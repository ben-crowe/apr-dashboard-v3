---
content_type: readiness-pack
title: APR Next-Steps Readiness Pack — Email · SharePoint · QuickBooks · e-Sign · ClickUp-Codex · LOE Finalize
status: living — the prep pack co-architect assembled so nothing is unprepared when the next build session starts
created: 2026-06-11
updated: 2026-06-11
owner: co-architect (assembled) · Ben (provides the PENDING credentials)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
tags: [apr-workflow, readiness, next-steps, email, sharepoint, quickbooks, e-signature, clickup, codex, loe, ground-truth]
---

# APR Next-Steps Readiness Pack

**Tags:** #apr-workflow #readiness #next-steps #email #sharepoint #quickbooks #e-signature #clickup #codex #ground-truth
**Entities:** [[APR-Dashboard]] [[Asset-Storage]] [[SharePoint]] [[cli-apr-tools]]

**↑ Home:** [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md)

**What this is:** co-architect's prep pass over every next-step area Ben named — assembled from a full read of the source docs + SS12 search. Each section says: the **state**, **where it's documented**, **what Ben must provide** (credentials), **what's ready to build**, and the **test plan**. Goal: zero open questions when the build session starts.

---

> **Storage architecture — DECIDED (researched best practice, 2026-06-11):** Supabase Storage is the **system of record** for ALL assets; the app serves everything from Supabase (CDN-backed signed URLs — fast). SharePoint receives **only two PDFs** — the signed LOE + the finalized report — pushed **one-way, async, on their finalization events**. No two-way sync (documented anti-pattern). The systems never read from each other. Full rationale + sources: [Storage Architecture Best Practice](~/Development/APR-Dashboard-v3/docs/Features/13-Asset-Storage/STORAGE-ARCHITECTURE-BEST-PRACTICE-2026-06-11.md).

## 0. The one thing that unlocks two features — ONE Microsoft Entra app

Email send and SharePoint folders are **the same integration** — a single Entra (Azure AD) app with two Graph permissions. Build it once.

- **Recipe (Ben does the portal clicks, Global Admin):** [SharePoint App Setup Recipe](~/Development/APR-Dashboard-v3/docs/Features/13-Asset-Storage/SHAREPOINT-APP-SETUP-RECIPE.md)
- **★ Ready-to-deploy Codex prompt** (Ben opens `entra.microsoft.com` app-registrations, Codex drives it): [Codex Entra App-Registration Prompt](~/Development/APR-Dashboard-v3/docs/Features/13-Asset-Storage/CODEX-ENTRA-APP-REGISTRATION-PROMPT.md)
- **★ Exact API calls** (token, sendMail, folder-create, upload, access policy): [MS Graph Build Spec](~/Development/APR-Dashboard-v3/docs/Features/13-Asset-Storage/MS-GRAPH-BUILD-SPEC-2026-06-11.md)
- **Permissions:** `Sites.ReadWrite.All` (folders) + `Mail.Send` (email) → grant admin consent.
- **Guardrail:** Application Access Policy scoping `Mail.Send` to ONE `valta.ca` mailbox.
- **Ben is Global Admin** on the Valta tenant (`ben.crowe@valta.ca` / `valtapropertyvaluations.onmicrosoft.com`) — self-register + self-consent, no client dependency.

> **3 credential slots Ben fills once the app exists** (stored as Supabase/Vercel secrets, never in git):
> `GRAPH_TENANT_ID` · `GRAPH_CLIENT_ID` · `GRAPH_CLIENT_SECRET` · + the sending mailbox address.
> Slots: [Access & Login Priming → M365/Entra](~/Development/APR-Dashboard-v3/docs/01-AGENT-ACCESS-LOGIN-PRIMING.md)

---

## 1. Email — LOE sending (retire Resend → Microsoft Graph)

**State:** Today the LOE email sends via the `send-loe-email-fixed` edge function → **Resend** (sandbox `onboarding@resend.dev`). Production target (decided 2026-06-08): **send direct via Graph `sendMail` from a `valta.ca` mailbox**, same Entra app as SharePoint. The swap is SMALL — replace the ~15-line Resend fetch block with a Graph token-fetch + `sendMail`; zero frontend/webhook/DB changes.

**Recipient guard (keep):** test sends default to `bc@crowestudio.com` — independent of transport, stays after the swap.

**Agent CLI verification (full capability, at your disposal):** the agent reads `bc@crowestudio.com` via the **EPA BC-Support email CLI** (`~/Development/02-Project-Planning/EPA BC-Support system/`, skills `/email-check` `/email-view`). Send the LOE → read the inbox → confirm arrival. NEVER Codex/computer-use for this. One-time `reauth_gmail.py` if the token is expired (it expired mid-last-session — re-auth is a browser OAuth, flag to Ben).

**Where documented:** [★ MS Graph Build Spec (endpoints + sendMail + access policy)](~/Development/APR-Dashboard-v3/docs/Features/13-Asset-Storage/MS-GRAPH-BUILD-SPEC-2026-06-11.md) · [LOE/e-Sign Feature Sheet §send](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/00-LOE-ESIGN-FEATURE.md) · [DocuSeal Architecture](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-DOCUSEAL-ARCHITECTURE.md).

**Ben provides:** the Entra creds (Section 0) + which `valta.ca` mailbox sends.

**Test plan:** swap the send block → fire a test send on the pinned job → agent reads `bc@crowestudio.com` → confirm delivery + sender identity. Fallback delivery-proof: Resend status API (used last session when Gmail OAuth was down).

---

## 2. SharePoint — per-job folder creation

**State:** Documented + folder spec LOCKED; NOT wired (needs the Entra creds). Once creds land, a Graph call at job-creation (and an on-request dashboard button) creates the folder set.

**Folder spec (VERBATIM — confirmed from live SharePoint):**
- **Site:** `valtapropertyvaluations.sharepoint.com/sites/V` → `Shared Documents/2.Jobs/{YEAR}/`
- **Parent folder:** `{JOB#} - {Property Description + Street Address + City + Province}`
  - e.g. `VAL261054 - Stacked Townhouse Development 2822 &2828 11 Ave SE Calgary AB`
- **5 subfolders (exact order + casing):**
  1. `1. REPORT`
  2. `2. CLIENT SUPPLIED`
  3. `3. WORK FILES (TTSZ, PICS, COMPS)`
  4. `4. CLIENT BILLING (Invoice, LOE)` — signed LOE + invoice land here
  5. `5. LETTER OF RELIANCE (LOR)`

**Dashboard wiring (build):** the job-detail last section (Files/Assets) becomes a synced folder view with a **"Create Client Folders"** button → states `Create` → `creating…` → `Folders Connected ✓` (+ Open-in-SharePoint link). Idempotent (check-then-create, never duplicates). Disabled with "SharePoint not configured" until creds exist.

**Where documented:** [★ MS Graph Build Spec (folder-create + upload, exact calls)](~/Development/APR-Dashboard-v3/docs/Features/13-Asset-Storage/MS-GRAPH-BUILD-SPEC-2026-06-11.md) · [Setup Recipe](~/Development/APR-Dashboard-v3/docs/Features/13-Asset-Storage/SHAREPOINT-APP-SETUP-RECIPE.md) · [Asset Storage feature + Supabase buckets](~/Development/APR-Dashboard-v3/docs/Features/13-Asset-Storage/ASSET-STORAGE-SHAREPOINT.md) · [Phase 7 sheet](~/Development/APR-Dashboard-v3/tests/phase-sheets/PHASE-7-FOLDERS.md)

**Ben provides:** the Entra creds (Section 0). ~~OPEN ITEM: signed-LOE file-naming~~ **RESOLVED 2026-06-11 (Codex captured from live SharePoint):** the 5 subfolders match the locked spec exactly, and the file-naming convention in the `4. CLIENT BILLING` folder is:
- **Signed LOE — naming VARIES job-to-job (verified live 2026-06-11):** long `LOE - {parentFolderName} - signed.pdf` (e.g. `LOE - VAL261003 - Varsity Block 10506 81 Ave NW Edmonton AB - signed.pdf`, read live from VAL261003) vs short `LOE - {JOB#} - signed.pdf` (VAL261054, per Codex). No date in the name (date lives in SharePoint metadata).
- **Resolution — upload is match-or-fallback** (`chooseSignedLoeName`): if a signed-LOE file already exists in `4. CLIENT BILLING`, REUSE that exact name (replace, no duplicate); else write the robust long form. So the push is correct regardless of the job's convention. **Open:** whether to normalize the client to one convention. *(SharePoint folder-connect + upload are LIVE + verified — connect-not-create on VAL261003, zero duplicate.)*
- **Invoice:** `Invoice_{JOB#}_from_Valta_Property_Valuations_Ltd.pdf`
- The auto-push uploads the signed LOE to `4. CLIENT BILLING`; final report → `1. REPORT`.

**Test plan:** with creds in, fire folder-create on the pinned job → verify parent + 5 subfolders appear in SharePoint → click the dashboard button → confirm idempotent re-connect.

---

## 3. QuickBooks — sandbox closing flow

**State:** Documented, **entirely unbuilt**, blocked only on a human signup (free Intuit Developer account). No code, no creds yet. The whole closing choreography is buildable against the sandbox — only a live card "Pay Now" needs a real merchant account, which Ben's invoice-only model doesn't require.

**The two triggers:**
- **Trigger 1 — LOE signed** (DocuSeal `submission.completed`, already firing): thank-you email + create+send QuickBooks invoice. Replaces the `docuseal-webhook` `// TODO: Trigger payment flow` placeholder.
- **Trigger 2 — invoice paid** (Intuit webhook): receipt email + flip job status + flip ClickUp card → notify team.

**Sandbox setup (the human step):** free account at developer.intuit.com → create app → sandbox Client ID + Secret → OAuth2 → auto-provisioned sandbox QBO company → point edge fn at sandbox host. Subagents CAN prepare all the integration detail (OAuth scope strings, host, webhook event names, the edge-fn skeleton) ahead of the account existing.

**Where documented:** [★ QuickBooks Sandbox Build Spec — VERIFIED](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-SANDBOX-BUILD-SPEC-2026-06-11.md) — verified across 12 official sources; exact OAuth endpoints, `com.intuit.quickbooks.accounting` scope, `minorversion=75`, sandbox host, all 4 API call bodies, webhook payload + HMAC verify. **Two build-critical facts:** refresh tokens now have a 5-year max (Nov-2025 policy) and a **"Reconnect URL" is mandatory as of Feb 2026** (already in effect) — wire that; and the concurrent limit is 10/realm/sec (not 40). · [Sandbox Payment Path](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-SANDBOX-PAYMENT-PATH.md) · [Closing & Payment Feature](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/00-CLOSING-PAYMENT-FEATURE.md) · [Integration Research](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-PAYMENT-INTEGRATION-RESEARCH.md) · [Merchant How-To](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-MERCHANT-APPLICATION-HOWTO.md) · [Phase 8 sheet](~/Development/APR-Dashboard-v3/tests/phase-sheets/PHASE-8-QUICKBOOKS-CLOSING.md)

**Ben provides:** create the free Intuit Developer account (or Codex-as-human does it) → sandbox Client ID + Secret. **CLI-factory's first closing inputs** (once creds exist): `qbo-auth`, `qbo-create-customer`, `qbo-create-invoice`, `qbo-send-invoice`, `qbo-record-payment`, `qbo-webhook-verify` + wire `docuseal-webhook` Trigger-1.

**Test plan (sandbox, no real money):** create Customer + Invoice from signed-LOE data → send → record payment (flips Paid) → Intuit webhook → fire Trigger-2 (receipt + status + ClickUp flip).

---

## 4. e-Signature — DocuSeal signing (so an agent or Ben can sign)

**State:** Full flow LIVE (V07 active). Generate → `docuseal-proxy` → `POST /submissions/html` → branded email → signing page → `docuseal-webhook` updates DB + ClickUp on completion. **Signing itself is the manual step** — the client (or Ben, or an agent) opens the signing link and signs.

**How signing works:** the email carries a signing button → custom `/sign/:id` route (fallback = DocuSeal slug URL) → interactive signing page (DECLINE / DOWNLOAD / SIGN NOW). Submitter is `bc@crowestudio.com` on test sends. **Ben's requirement met:** as long as it opens in your inbox, you (or an agent) can sign. Last session an agent drove the sign via Computer Use; not required — Ben signing from the inbox is the simple path.

**Real end-to-end PROVEN 2026-06-12** (real V07 LOE → sent → Resend delivered → Codex signed → webhook → DB `loe_signed` + ClickUp "LOE Signed"). **Two findings:**
- **⚠ OPEN — register the DocuSeal webhook (UI-only):** DocuSeal did NOT auto-deliver `submission.completed` (handler verified by firing it manually). DocuSeal API has no webhook-config endpoint (404) — **Codex/Ben:** DocuSeal dashboard → Settings → Webhooks → add `https://ngovnamnjmexdpjtcnky.supabase.co/functions/v1/docuseal-webhook`, events **submission.created + submission.completed**. Until done, the signed-status auto-flip won't fire live.
- **✓ FIXED — SharePoint upload is connect-only:** post-Graph-activation the signed-LOE upload would auto-create a folder for unmatched/test jobs in the client's real SharePoint (caught + cleaned live); `folderExists()` guard now skips unless the client folder already exists.

**Open bugs before a real client send** (not blockers for testing): re-anchor isn't needed (V07 verified); `loe_sent` status never auto-sets (jumps pending→signed); `loe_submissions` insert can fail silently; `docuseal-webhook` returns 200 even on error.

**Where documented:** [LOE/e-Sign Feature Sheet](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/00-LOE-ESIGN-FEATURE.md) · [DocuSeal Architecture](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-DOCUSEAL-ARCHITECTURE.md) · [Edit/Version Workflow](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-07-EDIT-VERSION-WORKFLOW.md) · [Phase 5 sheet](~/Development/APR-Dashboard-v3/tests/phase-sheets/PHASE-5-LOE-ESIGN.md)

**Test plan:** send LOE on the pinned job → agent confirms email arrival on `bc@crowestudio.com` → open signing link → sign (Ben or agent) → confirm webhook flips DB + ClickUp status.

---

## 5. LOE finalize + cascade verification — last session's PDFs to review

**State:** LOE-07 LIVE + cascade verified. Last session generated the full version matrix as PDFs (one per cascade scenario + single/multi-property). The cascade is graded against the coverage gate per run (A1–E11 PASS/FAIL in dated grade docs).

**Last session's LOE PDFs — open to review:**

`~/Development/APR-Dashboard-v3/tests/LOE-v1.pdf`  (V1 — Completed)

`~/Development/APR-Dashboard-v3/tests/LOE-v2.pdf`  (V2 — Under Renovation)

`~/Development/APR-Dashboard-v3/tests/LOE-v3.pdf`  (V3 — Demolition / Land)

`~/Development/APR-Dashboard-v3/tests/LOE-v4.pdf`  (V4 — Insurance)

`~/Development/APR-Dashboard-v3/tests/LOE-single-property.pdf`

`~/Development/APR-Dashboard-v3/tests/LOE-multi-property.pdf`

**Cascade test grades (what was verified, no need to re-run — review):** [LOE Grade 784140](~/Development/APR-Dashboard-v3/tests/LOE-GRADE-784140-2026-06-10.md) · [LOE Schedule-A fix grade](~/Development/APR-Dashboard-v3/tests/LOE-GRADE-scheduleA-fix-2026-06-10.md) · the gate itself: [LOE Test Coverage Gate](~/Development/APR-Dashboard-v3/tests/LOE-TEST-COVERAGE-GATE.md).

**Cascade spec (source of truth):** [Cascade Logic — Spec + Wiring](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/CASCADE-LOGIC-SPEC-AND-WIRING.md) · the four versions (V1 Completed / V2 Under Renovation / V3 Demolition-Land / V4 Insurance) set Status of Improvements → auto-derive Value Scenarios + Approaches + Property Rights.

**To finalize the LOE (the open enhancement list, not blockers):** document-picker redesign, unify the two version selectors, `loe_sent` auto-status bug, submission-record silent-fail bug. All in [Feature Sheet §6](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/00-LOE-ESIGN-FEATURE.md).

---

## 6. ClickUp — remake the task on the client's Valta account (Codex, UI-only)

**State:** The ClickUp Job-Hub is built to spec on the TEST list. The remaining piece is replicating it to the **client's live Valta workspace** — a UI-only job (ClickUp's API can't create field definitions or save templates), so **Codex drives it directly in Ben's shared ClickUp**.

**The canonical field set (build exactly this — 19 fields, 3 clusters):** [03-CLICKUP-JOB-HUB-SPEC](~/Development/APR-Dashboard-v3/Data-Flow%20Visuals/03-CLICKUP-JOB-HUB-SPEC.md)
- **Links:** Job Number · APR Dashboard Link · Valcre Job Link
- **Summary:** Client First/Last Name · Organization · Email · Property Name · Property Address · Property Type · Report Type · Intended Use · Property Rights · Scope of Work · Payment Terms · Appraisal Fee
- **Dates:** Received Date · Delivery Date · LOE Sent · LOE Signed
- **REMOVE (never show):** Client Title/Phone/Address · all Property Contact · Job Status · Asset Condition · Valuation Premises · Notes · (and Subtype/Tenancy — not on the hub).

**★ Ready-to-deploy Codex prompt:** [Codex ClickUp Valta Template Prompt](~/Development/APR-Dashboard-v3/docs/Features/04-Job%20%26%20Client%20Mgt./CODEX-CLICKUP-VALTA-TEMPLATE-PROMPT.md) — Ben opens the Valta list, Codex builds the 19 fields (TEXT) + Saves as Template. The code resolves fields **byName** so it populates with **zero code change** once the columns exist.

**Account detail (all in hand, shared with Ben):**
- **Production:** Valta workspace, team `9014181018`, list `901402094744`, template `t-86b3exqe8`.
- **Test (never write during testing):** BC workspace, team `8555561`, list `901709622357`.
- **Tokens:** in `/cli-clickup-tools` + the access sheet (`pk_10791838…` test, `pk_54774263…` prod) — edge fns read the Supabase `CLICKUP_API_TOKEN` secret.

**Where documented:** [ClickUp Sync CANONICAL](~/Development/APR-Dashboard-v3/docs/Features/04-Job%20%26%20Client%20Mgt./CLICKUP-SYNC-CANONICAL.md) · [Job-Hub Spec](~/Development/APR-Dashboard-v3/Data-Flow%20Visuals/03-CLICKUP-JOB-HUB-SPEC.md) · access sheet.

**Ben provides:** nothing new — the account is shared; Codex deploys on Ben's go.

---

## 7. Credentials & access — master status

Full sheet: [Agent Access, Login & Priming](~/Development/APR-Dashboard-v3/docs/01-AGENT-ACCESS-LOGIN-PRIMING.md). Status:

| System | Access | Gap |
|---|---|---|
| **Supabase** | ✓ persisted no-expiry PAT (`/supabase-deploy`) | none |
| **Valcre** | ✓ API creds (Vercel env) + OData `$metadata` schema reference + web-UI login for screenshots | none |
| **ClickUp** | ✓ test + prod tokens, team/list/template IDs | none |
| **Vercel** | ✓ `vercel --prod` | none |
| **M365 / Entra (email + SharePoint)** | Ben is Global Admin — can self-register | ⚠ app not created → `GRAPH_TENANT_ID` / `GRAPH_CLIENT_ID` / `GRAPH_CLIENT_SECRET` + sending mailbox all PENDING |
| **QuickBooks** | — | ⚠ free Intuit Developer account not created → sandbox Client ID/Secret PENDING |
| **Dashboard login** | — | ⚠ `__PENDING__` (Ben provides once, or agent rides Ben's `apr-qa` session) |
| **Email verify CLI** | ✓ EPA BC-Support on `bc@crowestudio.com` | ⚠ Gmail OAuth may need a one-time re-auth |

**Agent CLI capability (confirmed at our disposal):** full Bash/CLI — Valcre API (+ OData `$metadata`), Supabase REST, ClickUp 60-cmd CLI, DocuSeal API, intake-form drive (`agent-browser --session apr-iso`, port 8086), email read/send via EPA, deploy via `vercel --prod` + `/supabase-deploy`. Skills load via [Access Sheet Step 1](~/Development/APR-Dashboard-v3/docs/01-AGENT-ACCESS-LOGIN-PRIMING.md).

---

## 7b. Skills the build agent must load (so no CLI/ability is missed)

Load at session start — `reprime-skills.sh <agent>` for own persona, then `/prime-apr` (dashboard read + SS12), then the per-item CLI/capability skills:

| Work item | Skills to load |
|---|---|
| **All (startup)** | reprime own skills · `/prime-apr` · `/cli-browser-auto` · `/agent-fill-fields` · `/agent-screenshot` |
| **Valcre / LOE / e-Sign** | `/cli-apr-tools` (Valcre/DocuSeal/Supabase/intake) · `/guide-valcre-api` (OData + `$metadata`) · `/supabase-deploy` · `/guide-vercel-deploy` |
| **ClickUp (+ Valta Codex remake)** | `/cli-clickup-tools` (60 cmds) · `/codex-in-app-ops` (Codex UI deploy) |
| **Email (test) / verify delivery** | EPA BC-Support email CLI on `bc@crowestudio.com` (`/email-check`, `/email-view`) — crowestudio.com stays the TEST path |
| **SharePoint + Email (Graph build)** | `/supabase-deploy` (edge fns) · `/codex-in-app-ops` (Entra app-registration via Codex) · the MS Graph build spec doc |
| **QuickBooks** | `/supabase-deploy` (edge fn) · the QuickBooks build spec doc |

Any skill that fails to load → emit `ENRICH|DEFICIT|skills-missing-on-load: <list>` in the first checkpoint so the gap is visible, not silent.

---

## 8. Recommended build sequence (when the session starts)

1. **Ben creates the ONE Entra app** (Section 0) → fills 3 Graph creds. Unlocks BOTH email + SharePoint.
2. **Email swap** (smallest, highest value) — Resend → Graph `sendMail`; agent verifies via `bc@crowestudio.com`.
3. **SharePoint folder-create** — Graph call at intake + dashboard button (needs the signed-LOE file-naming confirm from Ben).
4. **In parallel:** subagents prep the QuickBooks sandbox integration detail; Ben (or Codex) creates the Intuit Developer account.
5. **Codex** remakes the ClickUp template on the Valta workspace (anytime — independent).
6. **Parked field cleanup** (from last session): Subtype/Tenancy into the Create-Valcre-Job payload (2-line fix), the 5 ClickUp UI columns.

---

**Last reviewed:** 2026-06-11 by co-architect — assembled as the pre-build readiness pack across email · SharePoint · QuickBooks · e-Sign · ClickUp-Codex · LOE-finalize, from a full read of the source docs + SS12 search. Surfaces every doc, credential slot, naming spec, and last session's LOE PDFs so nothing is unprepared.
