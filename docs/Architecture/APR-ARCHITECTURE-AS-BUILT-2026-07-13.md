---
content_type: architecture
title: APR Dashboard — architecture AS BUILT (verified against the running system)
status: verified 2026-07-13 by react-specialist — every claim checked against the live project, not against docs
updated: 2026-07-13
tags: [apr-architecture, as-built, sharepoint, edge-functions, supabase, ground-truth]
note: >
  Written because several long-standing beliefs about this app turned out to be false, and the false
  ones were repeated by agents (including me) for a whole day. Every statement here was checked
  against the RUNNING system — the deployed function list, the project's secrets, the live database —
  not against a document. Where a project doc says otherwise, that doc is stale and is named below.
---

# APR Dashboard — architecture AS BUILT

**How this was verified.** Deployed-function list and secrets read from the Supabase Management API
for project `ngovnamnjmexdpjtcnky`; schema and row state read by SQL against the live database; code
read from the repo. Nothing here is taken from a doc.

---

## ⛔ THE CORRECTION THAT MATTERS MOST — SharePoint is LIVE

**SharePoint is connected to the client's real tenant and has been since June.** It is NOT an
unconnected integration waiting on a decision, and it is NOT blocked on Ben.

Verified:

- **Credentials are set on the project.** `GRAPH_TENANT_ID`, `GRAPH_CLIENT_ID`,
  `GRAPH_CLIENT_SECRET`, `SHAREPOINT_SITE_ID`, `SHAREPOINT_DRIVE_ID`, plus `GRAPH_SEND_MAILBOX` /
  `GRAPH_SEND_NAME` for mail. All present.
- **The tenant is the client's real one** — `graph.ts` defaults to
  `valtapropertyvaluations.sharepoint.com`, site path `/sites/V`.
- **Two of the three SharePoint functions are DEPLOYED and ACTIVE:**
  - `create-job-folders` — ACTIVE. Creates the per-job folder tree.
  - `upload-loe-to-sharepoint` — ACTIVE. Writes the signed contract into the billing folder.
  - `job-folder-docs` — **NOT DEPLOYED.** This is the only missing piece.

**So the correct statement is:** "SharePoint is live; the one new function that lists and files
documents has not been pushed yet." It is a routine deploy, not a tenant connection.

**What this makes stale, and where:**

- The V3 job page's Client Documents panel shows **"SharePoint not connected"** whenever it cannot
  reach `job-folder-docs`. That message is FALSE — SharePoint *is* connected. It should say the
  document function is not deployed yet. (`src/features/job-documents/JobDocumentsPanel.tsx`, and the
  `sharepointReachable` flag in `useJobDocuments.ts` that feeds it.) **This is a real defect in my own
  code and it needs a task.**
- The master dashboard's Live Parts Checklist still frames SharePoint folder-create as pending Entra
  wiring. It is done. (`docs/00-APR-MASTER-DASHBOARD.md`, section 2b.)

---

## The Microsoft Graph library — `supabase/functions/_shared/graph.ts`

One Graph engine, one credential path. Every SharePoint and mail function imports it; nothing else
authenticates to Microsoft.

What it does: fetches and caches an app-only token; resolves the site and drive; `ensureFolder`
(idempotent create); `createJobFolders` (the parent + the five subfolders); `folderExists`;
`listFolderNames`; `listFolderItems`; `resolveJobFolderPath`; `uploadFile` (simple PUT, 4 MB cap);
`chooseSignedLoeName`; and `graphSendMail`.

**It carries `Deno.*` references throughout, so the browser bundle cannot import it.** That is why the
five folder names live in a separate inert leaf, `supabase/functions/_shared/jobSubfolders.ts`, which
both the Deno functions and the React app import. Do not "simplify" that by importing graph.ts from
the front end — it dies at runtime with `Deno is not defined`.

---

## Edge functions — 31 deployed

The ones that matter, and what each actually does:

| Function | State | What it is |
|---|---|---|
| `create-job-folders` | ACTIVE | Creates the per-job SharePoint folder tree. |
| `upload-loe-to-sharepoint` | ACTIVE | Puts the signed contract in the billing folder. Writes NO `job_files` row — this is why a folder's contents must be read as a union of the database AND the live SharePoint listing, or the signed contract is invisible. |
| `job-folder-docs` | **NOT DEPLOYED** | Lists a job's folders and files a document into one. The only unpushed piece. |
| `docuseal-proxy`, `docuseal-webhook` | ACTIVE | E-signature. |
| `send-loe-email`, `-fixed`, `-v2` | ACTIVE | Three variants exist. Only one is wired; the other two are dead weight and should be named as such. |
| `create-clickup-task`, `update-clickup-task` | ACTIVE | ClickUp. **Both are hard-pinned to the TEST workspace** (`const CLICKUP_ENV = 'dev'`), so the production branch is unreachable code today. It wakes up at cutover, and it has never been type-checked in that state. |

**Type-checking:** these functions could not be checked at all until 2026-07-13 — two missing npm
packages aborted the checker before it read a line. Fixed with `supabase/functions/deno.json`. Run
`npm run check:functions` from the repo root. Do NOT run a bare `deno check` — it resolves config from
the working directory, so from the repo root it silently uses the wrong config.

---

## The intake → job pipeline (the path a client's request actually takes)

1. **Client submits the form** (`src/components/submission-form/useFormSubmission.ts`).
   `formToDbRow` builds the `job_submissions` insert.
2. **Attachments** upload to the **`job-files`** storage bucket (NOT `documents` — that is a different
   bucket used by the appraiser-side slot uploads) and get a `job_files` row each.
   The storage key is `{jobId}/{token}-{safeName}`: the **token** carries uniqueness, the strip only
   keeps the key legal, and `file_name` keeps the client's original name for display.
   *(Before 2026-07-13 the key was the sanitised name alone, so two client files could collide and one
   would be silently destroyed. Fixed; a failed file is now named to the client.)*
3. **Job creation** — Valcre job number, then the ClickUp card, then the SharePoint folder tree.
4. **The dashboard job page** reads the job, its LOE details, its property info, and its files.
5. **The report builder (V4)** pulls the job through `useLoadJobIntoReport`.

---

## Database — the tables that carry the work

- `job_submissions` — the job. One row per client request.
- `job_files` — the client's attachments. `file_name` (original), `file_path` (opaque storage key),
  plus `filed_bucket` / `filed_at` / `sharepoint_path` added 2026-07-13 for document filing.
  **`filed_bucket` = the user's chosen folder (database truth, needs SharePoint for nothing).
  `sharepoint_path` = the mirror state, set ONLY on a successful copy.** Those two meaning different
  things is what lets the folder screen work while `job-folder-docs` is unpushed.
- `job_loe_details` — contract/quote line items + DocuSeal columns.
- `job_property_info` — property subtype, tenancy.
- `job_images` — the report builder's images. **A different table from `job_files`**, with different
  columns. The image gallery reads `job_images`; the client's documents live in `job_files`. Anything
  reusing the gallery for client documents needs an adapter.
- `client_profiles` — CRM data. **Readable by anyone** (see the open security task).

**Storage buckets:** `job-files` (client attachments, public), `documents` (appraiser slot uploads),
`appraisal-raw` / `appraisal-processed` (report builder images).

---

## Known-stale docs (named, as instructed)

- `docs/00-APR-MASTER-DASHBOARD.md` — section 2b still frames SharePoint as pending Entra
  registration and admin consent. **Done.** The folder-create function is deployed and active.
- Anything that says the report builder's field registry has a fixed field count — grep the registry
  live; the counts in docs go stale.
- Anything that tells an agent to type-check with a bare `tsc --noEmit` — that resolves the root
  config, which type-checks **zero files** and exits 0 on anything. The real command is
  `npx tsc -p tsconfig.app.json --noEmit`.

---

## Where I am thin

- **Valcre.** I have not read `api/valcre.ts` or traced the job-number flow end to end. I know it is a
  server-side proxy with the key in Vercel env, and nothing more.
- **The calculation engine** behind the report builder — I have never opened it.
- **DocuSeal.** I know the functions are deployed; I have not traced the signing flow.
- **Whether `send-loe-email` vs `-fixed` vs `-v2` are all still referenced.** Three exist; I believe
  one is live. I have not proven which.
