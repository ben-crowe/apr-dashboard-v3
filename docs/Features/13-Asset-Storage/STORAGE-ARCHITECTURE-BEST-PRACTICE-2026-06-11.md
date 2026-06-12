---
title: "Storage Architecture Best Practice — Supabase + SharePoint"
status: recommendation
created: 2026-06-11
tags: [apr-workflow, asset-storage, supabase, sharepoint, architecture, best-practice, ground-truth]
---

**Tags:** #apr-workflow #asset-storage #supabase #sharepoint #architecture #best-practice #ground-truth
**Entities:** Supabase Storage, Microsoft Graph API, SharePoint, APR Dashboard v3, DocuSeal, LOE PDF, Appraisal Report

**Backlink:** ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md

---

## RECOMMENDATION

**The correct pattern is: Supabase Storage as the system of record, with a one-way event-driven push of client-facing deliverables to SharePoint at finalization milestones.**

The app owns all storage. Every upload — photos, client-supplied docs, the working LOE draft, the draft report — lands in Supabase Storage. The app reads and serves everything from Supabase (CDN-backed, signed-URL, fast). SharePoint receives only the final client-facing artifacts: the signed LOE PDF and the finalized report PDF. Each push fires once, at the corresponding milestone event (LOE signed, report finalized). SharePoint is a delivery endpoint, not a data store the app reads from.

---

## 1. The Canonical Pattern — What Production Apps Use

The established architecture for a SaaS app that must deliver files into a customer's external document system (SharePoint, Box, Dropbox, etc.) is:

**App storage as system of record + one-way push of deliverables to SharePoint at finalization.**

This is option (c) in the framing — keep them functionally separate, push only the final artifacts. This is what production workflow apps do, and it is why Microsoft Graph upload-on-event is the dominant pattern documented across integrations.

The reasoning is straightforward:

- The app's logic runs against its own data. Supabase is fast, queryable, secured by RLS, and fully owned. No API intermediary slows down normal operations.
- SharePoint is the client's home for delivered documents — not a database the app processes from. Pushing to it on completion honors the separation of concerns.
- Microsoft's own documentation on Graph API file upload describes the push pattern (PUT/createUploadSession) as the primary integration model for backend apps delivering content to SharePoint drive items. This is the intended use of the API.

Option (b) — SharePoint as system of record — requires every internal operation to traverse the Graph API hierarchy (Sites → Drives → DriveItems) for every read. That introduces OAuth token management overhead, Graph rate-limit exposure (HTTP 429 throttling, dynamic back-off), and up to 20+ minutes of documented latency variability on Graph uploads — none of which belong in a user-facing upload flow.

Option (d) — two-way sync — is discussed in the next section and is unambiguously wrong for this case.

---

## 2. Why Two-Way Sync Is an Anti-Pattern

Two-way sync between an application datastore and SharePoint introduces three failure classes with no clean solution:

**Conflict management.** When both systems can write to the same record, the integration must determine which version wins. Every sync tool recommends designating a hard master/slave relationship and auto-rejecting the slave — which is exactly what one-way push already is, without the sync overhead. (Source: APPSeCONNECT data sync patterns.)

**Circular update loops.** A file update in system A generates a new timestamp, which the sync interprets as a delta, which writes to system B, which generates a new timestamp, which the sync finds again. Preventing this requires tracking integration-vs-user origin on every write — significant complexity for zero business value in this case.

**Tight coupling as a failure mode.** Microsoft Q&A threads document SharePoint Graph API with unpredictable upload latency (seconds to 20+ minutes), dynamic throttling, and retrieval delays of up to 5 minutes after upload. Coupling the app's write path to that behavior would cascade SharePoint degradation into the app itself.

The APPSeCONNECT integration guide states directly: "Bidirectional updates are sometimes critical and require manual conflict management which in most cases not recommended." For this use case — where SharePoint is a delivery endpoint, not a collaborative edit surface — there is no business case for the complexity.

---

## 3. Performance and UX: Supabase Storage vs Microsoft Graph for Serving

| Dimension | Supabase Storage | Microsoft Graph / SharePoint |
|---|---|---|
| CDN edge nodes | 285+ cities worldwide | Microsoft 365 CDN (data center proximity, not global edge pop) |
| File access pattern | Public URL or signed URL; CDN-cached; sub-100ms typical | Graph API call: OAuth token check → site → drive → driveItem → redirect; 200–500ms+ overhead |
| Signed URL caching | Smart CDN caches signed-URL responses at edge (Supabase Storage v2+) | Not applicable — each fetch is an authenticated API call |
| Throttling exposure | None on read path | HTTP 429 dynamic throttling on any Graph operation |
| Upload latency | Direct SDK upload; deterministic | Documented 20+ min variability on Graph PUT to SharePoint |

**Conclusion:** All in-app file serving must come from Supabase. The Graph API is appropriate only for the fire-and-forget outbound push at finalization. Never route app users through Graph to fetch files.

---

## 4. The Concrete Pattern for This Case

### Where uploads land
Every file uploaded by any party (client docs, photos, DocuSeal artifacts, report drafts) lands directly in Supabase Storage. The app reads from Supabase exclusively.

### Where the app serves from
Supabase Storage only — via public bucket URLs or signed URLs depending on access control requirements. CDN-backed, no Graph overhead in the hot path.

### Which artifacts get pushed to SharePoint and when

| Artifact | Push trigger | Notes |
|---|---|---|
| Signed LOE PDF | `loe.signed` event (DocuSeal webhook → app webhook handler) | Single file, push once, no update needed |
| Finalized appraisal report PDF | Report status transitions to `finalized` | Single file, push once |
| All other assets | Never | Photos, working drafts, client-supplied docs stay in Supabase |

The push is a background job: fetch the file from Supabase Storage (or pass the bytes directly from the DocuSeal/report generation pipeline), then `PUT` to the SharePoint drive item via Graph API using `createUploadSession` for any file over a few MB. Implement exponential backoff on HTTP 429 with a dead-letter mechanism (log the failed push, allow manual retry from the job dashboard). The user-facing app flow is never blocked on the SharePoint push.

### Should all assets go to SharePoint?
No. Only client-facing deliverables. Raw uploads (photos, client-supplied docs) are internal working files. Pushing them to SharePoint creates folder clutter, consumes SharePoint storage, and provides no value to the client. The client expects to find the signed LOE and the final report — that is the full deliverable set.

---

## 5. Owner Decisions vs. Standard Patterns

**What is entirely standard (no decision needed):**
- Supabase as system of record — established pattern
- One-way push of deliverables at finalization — established pattern
- Push as background/async job with retry — established pattern
- Only pushing signed LOE + final report, not all assets — standard for deliverable-focused workflows
- Graph API `PUT` / `createUploadSession` as the mechanism — the documented correct approach
- App serves all files from Supabase, never through Graph — unambiguous on performance grounds

**What the owner must decide:**

1. **SharePoint folder structure.** Where in the SharePoint site does each job's folder live? The push job needs a target drive ID and folder path. This is a business/naming convention decision, not an architecture one.

2. **Push failure handling UX.** If the SharePoint push fails (throttling, auth expiry, target folder missing), does the appraisers see a banner in the job view, or is it purely a background log entry? Either is valid — the app function is unaffected either way.

That is the complete decision set. Everything else is standard.

---

## Sources

- [Supabase Storage CDN Fundamentals](https://supabase.com/docs/guides/storage/cdn/fundamentals)
- [Supabase Smart CDN — Signed URL Caching](https://supabase.com/docs/guides/storage/cdn/smart-cdn)
- [Microsoft Graph: Upload Performance & Latency (Q&A)](https://learn.microsoft.com/en-us/answers/questions/1657899/how-to-improve-performance-on-file-uploading-to-sh)
- [Microsoft Graph: Delay When Fetching Uploaded Files](https://learn.microsoft.com/en-us/answers/questions/1376313/dalay-when-fetching-just-uploaded-files-using-grap)
- [Microsoft Graph: Large File Upload (createUploadSession)](https://learn.microsoft.com/en-us/graph/sdks/large-file-upload)
- [SharePoint API Integration: 2026 Architecture Guide (Truto)](https://truto.one/blog/how-to-integrate-with-the-sharepoint-api-2026-architecture-guide/)
- [APPSeCONNECT: Common Data Sync Strategies — Two-Way Sync Anti-Pattern](https://www.appseconnect.com/common-data-sync-strategies-for-application-integration/)
- [Shared Database Anti-Pattern (ben-morris.com)](https://www.ben-morris.com/a-shared-database-is-still-an-anti-pattern-no-matter-what-the-justification/)
- [Two-Way SharePoint/SQL Sync (Simego)](https://www.simego.com/blog/sharepoint-list-and-sql-table-2-way-synchronisation)
- [SharePoint Embedded Overview — Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/dev/embedded/overview)
- [Seamless SharePoint Integration with Microsoft Graph API (Medium)](https://medium.com/@shivalkarabhinav/seamless-sharepoint-integration-with-microsoft-graph-api-a-complete-guide-6f13b7bc8d82)
- [Supabase Storage v2: Smart CDN blog post](https://supabase.com/blog/storage-image-resizing-smart-cdn)
