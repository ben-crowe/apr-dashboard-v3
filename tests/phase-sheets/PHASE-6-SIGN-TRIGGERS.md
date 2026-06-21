---
content_type: stage-anatomy
title: Phase 6 — Sign → Triggers → Signed-Date
status: VERIFIED LIVE 2026-06-18 — signed-trigger fires; job→loe_signed + signed_at land, confirmed in DB (ckpt #148). Closing auto-trigger (Phase 8) + loe_submissions update still open.
created: 2026-06-11
owner: co-architect (doc) · react-spec (code) · qa-agent (verify)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
tags: [apr-workflow, stage-anatomy, phase-sheet, docuseal, webhook, e-sign, signed-date, clickup, testing]
---

# Phase 6 — Sign → Triggers → Signed-Date

**[⬅ Back to Phase Sheets Dashboard](~/Development/APR-Dashboard-v3/tests/phase-sheets/00-PHASE-SHEETS-DASHBOARD.md)**

**Tags:** #stage-anatomy #phase-sheet #docuseal #webhook #e-sign #signed-date #clickup
**Entities:** [[APR-Testing]] [[DocuSeal]] [[ClickUp]]

> **What this phase covers:** the client has received the sign link (Phase 5). This phase is everything
> that fires the moment signing completes — the DocuSeal `submission.completed` webhook, the DB
> writes that stamp the signed-date, the ClickUp card flip, and the downstream handoff that opens
> the closing sequence (Phase 8). Phase 5 is the send + sign; Phase 6 is what happens when signing is done.

---

## Index

1. [What it is](#1--what-it-is)
2. [Where it lives](#2--where-it-lives)
3. [The fields / data](#3--the-fields--data)
4. [Data flow in → out](#4--data-flow-in--out)
5. [Trigger / gating logic](#5--trigger--gating-logic)
6. [User + agent flow](#6--user--agent-flow)
7. [Tools / CLIs for this phase](#7--tools--clis-for-this-phase)
8. [Test + verify](#8--test--verify)
9. [Goal vs current state](#9--goal-vs-current-state)
10. [Known bugs / to-build](#10--known-bugs--to-build)
11. [Production wiring / cutover](#11--production-wiring--cutover)
12. [Sources](#12--sources)

---

## 1 — What it is

**GOAL:** The moment a client finishes signing, the system stamps the signed-date automatically and
propagates it to the job record and the ClickUp card — no manual update, no dashboard visit required.

Phase 6 is **the completion round-trip:** DocuSeal fires a webhook → the `docuseal-webhook` edge
function handles the `submission.completed` event → DB signed-date is written → ClickUp card is
updated → a downstream handoff to closing/payment is triggered (Phase 8). It sits after Phase 5 (send
+ sign) and before Phase 7 (folder creation) and Phase 8 (closing sequence).

**Current state:** The webhook is deployed and the code is wired. The DB writes and ClickUp update
are implemented. No full automated end-to-end round-trip has been run against the test job yet —
nobody has driven a complete sign → signed-date-on-job cycle in the test environment.

---

## 2 — Where it lives

**GOAL:** Every piece is locatable and testable without guessing.

**Current state:**

- **Local dev URL** — `http://localhost:8086/dashboard` (APR dev port; `npm run dev` from the repo).
  No specific UI route for this phase — it is a webhook handler, not a dashboard page.
- **Live / production webhook URL** — `https://ngovnamnjmexdpjtcnky.supabase.co/functions/v1/docuseal-webhook`
  (the URL registered in DocuSeal's webhook configuration).
- **DocuSeal webhook registration** — configured in the DocuSeal dashboard under the account's
  webhook settings; events `submission.created` + `submission.completed` both point at the URL above.

**Code locations:**

- [docuseal-webhook/index.ts](~/Development/APR-Dashboard-v3/supabase/functions/docuseal-webhook/index.ts)
  — the entire Phase 6 server-side logic. `submission.completed` handler starts at line 273.
- [docuseal-proxy/index.ts](~/Development/APR-Dashboard-v3/supabase/functions/docuseal-proxy/index.ts)
  — the thin pass-through used in Phase 5 to create the submission (referenced here because the
  `submitter_id` it returns is needed for the API auto-complete test path — Section 8).
- [generateLOE.ts](~/Development/APR-Dashboard-v3/src/utils/loe/generateLOE.ts)
  — writes `docuseal_submission_id` onto `job_loe_details` after submission creation; that ID is
  the primary job-lookup key the webhook uses.
- [LOE-DOCUSEAL-ARCHITECTURE.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-DOCUSEAL-ARCHITECTURE.md)
  — deep-dive architecture reference (sections 4.7–4.9, 8.3–8.4).

---

## 3 — The fields / data

**GOAL:** Know exactly which DB columns Phase 6 writes so a readback check can confirm each one.

**Current state:** The `submission.completed` handler writes to three tables. The canonical schema
lives in [LOE-DOCUSEAL-ARCHITECTURE.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-DOCUSEAL-ARCHITECTURE.md)
(Section 5). The Phase 6 subset:

**`job_submissions` (status flip):**

| Column | Written value | Notes |
|---|---|---|
| `status` | `'loe_signed'` | The job-level status the rest of the app reads |
| `updated_at` | `new Date().toISOString()` | Touch timestamp |

**`job_loe_details` (signed-date + signed PDF):**

| Column | Written value | Source in payload |
|---|---|---|
| `signed_at` | `payload.data.completed_at` (fallback: `new Date()`) | DocuSeal `completed_at` field |
| `signed_document_url` | `payload.data.documents[0].url` | DocuSeal-hosted PDF URL |

**`job_files` (signed PDF record):**

| Column | Written value |
|---|---|
| `job_id` | UUID of the job |
| `file_name` | `signedDocument.name \|\| 'Signed LOE Agreement'` |
| `file_type` | `'application/pdf'` |
| `storage_path` | DocuSeal PDF URL (same as `signed_document_url`) |
| `category` | `'signed_agreement'` |
| `is_client_visible` | `true` |

**`loe_submissions` (status update):**

The architecture doc (Section 4.8) documents an update to `loe_submissions.status = 'signed'` and
`signed_at` on `submission.completed`. **Note:** this update is not present in the current
`docuseal-webhook/index.ts` source — it is described in the architecture doc but the live edge
function does not execute it. Gap flagged in Section 10.

**`job_loe_details` (`submission.created` — Phase 5 handoff, not Phase 6):**

For completeness: `loe_sent_at` is written on `submission.created` (Phase 5's webhook event), not
on `submission.completed`. Phase 6 does not re-write `loe_sent_at`.

---

## 4 — Data flow in → out

**GOAL:** Clear provenance for every write — what comes in and where it lands.

**Current state:**

**In (from DocuSeal webhook payload):**

- `event_type: 'submission.completed'`
- `data.id` — DocuSeal submission ID (used as the primary job-lookup key via `docuseal_submission_id` on `job_loe_details`)
- `data.completed_at` — ISO timestamp of the signing completion
- `data.submitters[0].name` — signer name (used in the ClickUp description line)
- `data.documents[0].url` — URL of the signed PDF hosted by DocuSeal
- `data.metadata.job_id` — fallback job-lookup key (test mode; back-fills `docuseal_submission_id` if used)

**Job lookup (two-path, mirrors Valcre pattern):**

1. Primary: `job_loe_details.docuseal_submission_id = data.id` — production path.
2. Fallback: `job_loe_details.job_id = metadata.job_id` — test mode; if matched, also writes
   `docuseal_submission_id` for future lookups.

If neither resolves: the `submission.created` handler returns HTTP 200 + skips ClickUp. The
`submission.completed` handler returns HTTP 404 — a behavioural inconsistency (see Section 10).

**Out (to downstream systems):**

- `job_submissions.status` → `'loe_signed'` — the status the dashboard reads; also what Phase 8
  (closing sequence) polls/reacts to.
- `job_loe_details.signed_at` + `signed_document_url` — the signed-date record agents and the
  dashboard display.
- `job_files` insert — the signed PDF appears in the job's file list.
- ClickUp card description — `▸ LOE Signed: YY.MM.DD / H:MM AM/PM by <signer>` written into the
  existing card via regex-replace on the `▸ LOE Signed:` blank line.

**Downstream trigger (not yet built):**

The `submission.completed` handler currently ends with a `// TODO: Trigger payment flow (GHL
integration)` comment at line 395 of the webhook. The Phase 8 closing sequence (thank-you email +
QuickBooks invoice) is **not fired automatically today** — it must be manually triggered or built
as a follow-on step. See [00-CLOSING-PAYMENT-FEATURE.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/00-CLOSING-PAYMENT-FEATURE.md).

---

## 5 — Trigger / gating logic

**GOAL:** Know exactly what fires Phase 6 and what gates or blocks it.

**Current state:**

**What fires Phase 6:**
DocuSeal fires a POST to the webhook URL on `submission.completed`. This event fires when:
- A human client clicks through the DocuSeal signing portal and completes the signature fields.
- **OR** an API `PUT /submitters/{id}` call with `completed: true` is made (the programmatic
  auto-complete path — see Section 8). Both paths fire the identical `submission.completed` event.

**Gate 1 — job lookup must succeed:**
The webhook resolves the job via `docuseal_submission_id` (primary) or `metadata.job_id` (fallback).
If neither resolves, the handler returns HTTP 404 and no DB writes happen. The `submission_id` is
written by `generateAndSendLOE` at send time; a failed save at send time (see Section 10 bug) leaves
this lookup broken.

**Gate 2 — signed document in payload:**
The `signed_document_url` and `job_files` insert only happen `if (signedDocument)` — i.e., if
`payload.data.documents[0]` exists. The `job_submissions.status` flip and ClickUp update still
happen even if no signed document is present in the payload.

**Gate 3 — ClickUp task ID on the job:**
`updateClickUpLOEStatus` is only called `if (loeDetails.clickup_task_id)`. Jobs that were created
before the ClickUp integration or that had the task-creation step fail will not get the ClickUp
update; the DB writes still proceed.

**ClickUp failure handling:**
ClickUp failures are caught, logged, and swallowed — the webhook does not fail or retry on ClickUp
errors. The DB writes are treated as more important.

**The HTTP 200-on-error risk (known issue):**
The outer `catch` block in the webhook handler returns HTTP 400 on unhandled exceptions. However,
the `submission.created` job-not-found path returns HTTP 200 (intentional — prevents DocuSeal
retry). The `submission.completed` job-not-found path returns HTTP 404 (different behaviour). On
any exception thrown by DB writes, the outer catch returns HTTP 400, which **will** cause DocuSeal
to retry. The architecture doc (Section 8.4) describes the intent as "return 200 even on error" to
prevent duplicate processing, but the current code only does this for the created/not-found path —
not for runtime errors on the completed path.

---

## 6 — User + agent flow

**GOAL:** Know the human path and the agent path so either can drive this phase.

**Human path:**

1. Client receives the branded Valta email (from Phase 5) with the "Review & Sign Document" button.
2. Client opens the DocuSeal signing portal, fills the signature field and date field, submits.
3. DocuSeal fires `submission.completed` to the webhook URL — no human action required on the
   dashboard side.
4. The appraiser sees the ClickUp card update (`▸ LOE Signed: ...`) and the dashboard job status
   changes to "LOE Signed" — both automatic.

**Agent path (test loop — NO Codex, NO computer-use for this phase):**

The agent drives the signing completion via the DocuSeal **Update-a-submitter** API endpoint
(`PUT /submitters/{id}` with `completed: true`). This fires the identical `submission.completed`
webhook as a human portal sign. The submitter ID is available from the `/submissions/html` response
(the `submitters[]` array — same object that carries the slug).

Step-by-step agent sequence:

1. **Retrieve the submitter ID** — read `job_loe_details.docuseal_submission_id` for the pinned
   test job, then call `GET https://api.docuseal.com/submissions/{submission_id}` to get the
   `submitters[0].id`. (Or capture it at Phase 5 send time and store it.)
2. **Trigger completion** — `PUT https://api.docuseal.com/submitters/{submitter_id}` with body
   `{ "completed": true }` and header `X-Auth-Token: {DOCUSEAL_API_KEY}`. This fires
   `submission.completed` to the registered webhook URL in real-time.
3. **Wait ~3 seconds** for the webhook to process (Supabase edge functions are fast but not
   instantaneous).
4. **Readback verify** — Section 8 covers the exact checks.

**Caveat:** the `completed: true` auto-sign is documented on DocuSeal's hosted API. If the account
tier does not permit it (returns a 4xx), fall back to Codex computer-use against the DocuSeal
signing portal. The API path is the default.

**Email verification (not part of Phase 6 but triggered by it):**
Any confirmation email that fires post-signing is verified via the BC email CLI suite
(`~/Development/02-Project-Planning/EPA BC-Support system/`) — OAuth'd Python on
`bc@crowestudio.com`. Never Codex, never computer-use for email. The `/email-check` and
`/email-view` slash commands cover this.

---

## 7 — Tools / CLIs for this phase

**GOAL:** Know the full toolkit before starting, not mid-task.

- **`/cli-apr-tools`** — Valcre / DocuSeal / Supabase ops. The DocuSeal `GET /submissions/{id}` call
  (to fetch submitter ID), the `PUT /submitters/{id}` `completed:true` auto-sign, and direct
  Supabase reads of `job_loe_details` + `job_submissions` + `job_files`.
- **Supabase REST direct** — source `.env.local` for `VITE_SUPABASE_PUBLISHABLE_KEY`, then `curl`
  with `apikey` + `Authorization: Bearer` headers. Reads and writes work; DDL needs service-role.
  Use to readback `signed_at`, `signed_document_url`, and `job_submissions.status` after a webhook
  fires.
- **`/supabase-deploy`** — deploy edge-function changes to `docuseal-webhook`. Any fix to the
  webhook ships here. Command: `supabase functions deploy docuseal-webhook`.
- **`/cli-clickup-tools`** — verify the `▸ LOE Signed: ...` line actually landed on the ClickUp
  card description after the webhook fires.
- **BC email CLI suite** (`~/Development/02-Project-Planning/EPA BC-Support system/`) — the
  `/email-check` / `/email-view` slash commands + OAuth'd Python on `bc@crowestudio.com`. Used to
  verify any post-signing email (Phase 8 territory, but verifiable from this phase's trigger).
- **DocuSeal API direct** — `PUT https://api.docuseal.com/submitters/{id}` with `completed:true`.
  Header: `X-Auth-Token: {DOCUSEAL_API_KEY}`. This is the programmatic sign trigger for the test
  loop. The DOCUSEAL_API_KEY is stored in Supabase edge function secrets (not in `.env.local`);
  retrieve it with `supabase secrets list` or from the Supabase dashboard.
- **`/agent-screenshot`** (`--session apr-iso`, port 8086) — screenshot the dashboard job card
  after the webhook fires to visually confirm the status badge has updated.
- **Codex computer-use** — FALLBACK ONLY for the signing portal, if the `completed:true` API path
  is gated by the DocuSeal plan tier.

---

## 8 — Test + verify

**GOAL:** Prove the full sign → signed-date round-trip with machine-verifiable evidence. No guessing.
Capturer ≠ verifier (the agent that triggers the action is not the agent that reads the result back).

**Test protocol:**

**Pre-condition:** A live test submission must exist on the pinned test job (VAL261101 — "Westside
Mall" test job, not the decoy). Phase 5 must have run (submission created, `docuseal_submission_id`
written to `job_loe_details`). If no live submission exists, run Phase 5 first.

**Step 1 — Fetch the submitter ID.**
```
GET https://api.docuseal.com/submissions/{docuseal_submission_id}
Header: X-Auth-Token: {DOCUSEAL_API_KEY}
```
Capture `submitters[0].id` from the response. Verify the submission status is `'pending'`.

**Step 2 — Trigger completion via API.**
```
PUT https://api.docuseal.com/submitters/{submitter_id}
Header: X-Auth-Token: {DOCUSEAL_API_KEY}
Body: { "completed": true }
```
Expected response: HTTP 200 with the submitter object updated to `status: 'completed'`.

**Step 3 — Allow the webhook to process (wait ~3–5 seconds).**

**Step 4 — Readback: `job_loe_details`.**
```sql
SELECT signed_at, signed_document_url
FROM job_loe_details
WHERE job_id = '{test_job_uuid}';
```
Expected: `signed_at` is populated with a recent timestamp; `signed_document_url` is a non-null
DocuSeal PDF URL.

**Step 5 — Readback: `job_submissions`.**
```sql
SELECT status, updated_at
FROM job_submissions
WHERE id = '{test_job_uuid}';
```
Expected: `status = 'loe_signed'`.

**Step 6 — Readback: `job_files`.**
```sql
SELECT file_name, category, storage_path
FROM job_files
WHERE job_id = '{test_job_uuid}'
  AND category = 'signed_agreement';
```
Expected: one row with `category = 'signed_agreement'` and a non-null `storage_path`.

**Step 7 — ClickUp card readback.**
Use `/cli-clickup-tools` to fetch the card description for the test job's ClickUp task ID. Verify
the description contains a `▸ LOE Signed: YY.MM.DD / H:MM AM/PM by ...` line with a recent
timestamp.

**Step 8 — Dashboard screenshot.**
Use `/agent-screenshot` (port 8086) to screenshot the job detail page. Verify the status badge
shows "LOE Signed" (or equivalent `loe_signed` display label).

**Evidence gates (all must pass for a Today-PASS):**

- `job_loe_details.signed_at` populated — ✓ / ✗
- `job_loe_details.signed_document_url` non-null — ✓ / ✗
- `job_submissions.status = 'loe_signed'` — ✓ / ✗
- `job_files` row with `category = 'signed_agreement'` — ✓ / ✗
- ClickUp card `▸ LOE Signed:` line with correct timestamp — ✓ / ✗
- Dashboard badge shows signed state — ✓ / ✗

---

## 9 — Goal vs current state

**GOAL (done looks like):**
Client signs → `submission.completed` fires → within 5 seconds, `job_loe_details.signed_at` is
stamped, `job_submissions.status = 'loe_signed'`, ClickUp card carries `▸ LOE Signed: ...`, and
the closing sequence (Phase 8) is automatically triggered. The entire round-trip is provable by an
agent without a human in the loop, using the DocuSeal `PUT /submitters/{id}` API.

**Today-PASS (test environment):**
- DocuSeal `PUT /submitters/{id}` with `completed:true` fires `submission.completed`.
- `job_loe_details.signed_at` + `signed_document_url` are written.
- `job_submissions.status` flips to `'loe_signed'`.
- `job_files` insert succeeds.
- ClickUp card description updated.
- All six evidence gates in Section 8 pass.
- The automated closing trigger (Phase 8) is NOT yet part of Today-PASS — it is not built.

**Current state (updated 2026-06-18 — signing round-trip now PROVEN live):**
- Webhook deployed to Supabase: ✅
- `submission.completed` DB writes implemented: ✅ (all three tables, per Section 3)
- ClickUp update implemented: ✅ (with error-swallow)
- **Signed-trigger fires end-to-end: ✅ VERIFIED LIVE 2026-06-18 (ckpt #148).** Root cause of the earlier ❌ was the DocuSeal webhook URL set to a placeholder `example.com/hook`; repointed to the real `docuseal-webhook` function. A sign now flips `job_submissions.status → loe_signed` and stamps `job_loe_details.signed_at` — confirmed by DB readback. A backup status-advance on `SigningPage` was added as a webhook backstop.
- Closing sequence auto-trigger: ❌ (TODO comment in code, not built — separate from the signed-trigger above)
- `loe_submissions` status update: ❌ (documented in architecture, missing from live code)
- HTTP 200 on error consistency: ❌ (inconsistent — see Section 10)

---

## 10 — Known bugs / to-build

**Bug 1 — HTTP 200 on error is inconsistent (risk: missed failures).**
Root cause: the `submission.created` job-not-found path deliberately returns HTTP 200 (prevents
DocuSeal from retrying). The `submission.completed` job-not-found path returns HTTP 404 (will
trigger DocuSeal retry). The outer `catch` block returns HTTP 400 on runtime errors (will also
trigger retry). The intent of "return 200 to prevent retry" is only partially implemented. DocuSeal
retrying a `completed` event that already wrote to the DB could cause duplicate `job_files` rows.
Owner to fix: react-specialist or fullstack. Fix: wrap the `submission.completed` handler in the
same error-swallow pattern as `submission.created` (return 200 + log, never throw to the outer catch).
Code location: [docuseal-webhook/index.ts](~/Development/APR-Dashboard-v3/supabase/functions/docuseal-webhook/index.ts) lines 273–408.

**Bug 2 — `loe_submissions` status not updated on completion.**
Root cause: [LOE-DOCUSEAL-ARCHITECTURE.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-DOCUSEAL-ARCHITECTURE.md)
(Section 4.8) documents `loe_submissions.status = 'signed'` + `signed_at` being written on
`submission.completed`. The live webhook code does not execute this update. `loe_submissions` rows
stay `status = 'pending'` forever after signing. This is a silent inconsistency — nothing downstream
reads this column today, but the architecture doc will mislead future agents.
Owner to fix: react-specialist. Fix: add the `loe_submissions` update inside the `submission.completed`
handler, mirroring the `job_loe_details` update that is already there.

**Bug 3 — `loe_submissions` insert can fail silently at send time (Phase 5 dependency).**
Documented in [00-LOE-ESIGN-FEATURE.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/00-LOE-ESIGN-FEATURE.md)
(Section 6 known bugs): the `loe_submissions` insert in `generateAndSendLOE` can fail silently.
Impact on Phase 6: if `docuseal_submission_id` is also not written (a separate failure path), the
webhook's primary job-lookup fails and no DB writes happen. Phase 6 is silently skipped.
Owner to fix: react-specialist. Fix: harden the send path in `generateLOE.ts` to hard-fail or
surface the `loe_submissions` insert error.

**To-build — Closing sequence auto-trigger (Phase 8).**
The `submission.completed` handler ends with `// TODO: Trigger payment flow (GHL integration)` (line
395 of the webhook). The thank-you email + QuickBooks invoice (Phase 8) must be triggered here.
Owner: react-specialist. Reference: [00-CLOSING-PAYMENT-FEATURE.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/00-CLOSING-PAYMENT-FEATURE.md).

**To-build — Folder creation trigger (Phase 7, optional).**
No folder-create logic fires from the webhook today. If Phase 7 exists as a manual step, this is fine;
if it should be automatic, the trigger point is the same `submission.completed` handler.

**ClickUp API token hardcoded (tech debt).**
`CLICKUP_API_TOKEN` in `docuseal-webhook/index.ts` line 11 falls back to a hardcoded token string
if the env var is not set: `Deno.env.get('CLICKUP_API_TOKEN') || 'pk_10791838_...'`. The env var
is set in production, but the hardcoded fallback is a credential-in-code smell.
Owner: any agent touching the webhook. Fix: remove the hardcoded fallback; fail loudly if the env
var is missing.

---

## 11 — Production wiring / cutover

**GOAL:** Know what switches during cutover and what must not be touched during testing.

**Current state:**

**DocuSeal webhook registration:**
The webhook URL is registered in the DocuSeal account settings. **Ben's test DocuSeal account** is
the active account during testing. The URL `https://ngovnamnjmexdpjtcnky.supabase.co/functions/v1/docuseal-webhook`
points to the live Supabase instance (not a separate test instance — the DB is shared).

**ClickUp environments:**

| Phase | ClickUp workspace | List ID |
|---|---|---|
| Testing | BC WorkSpace (Ben's account) | `901703694310` (or `901709622357` for sign-trigger test list) |
| Production | Valta workspace (client) | `901402094744` |

**NEVER write to the client's live Valta ClickUp workspace or list during testing.** The ClickUp
token in the webhook (`CLICKUP_API_TOKEN` env var) must point at Ben's test workspace for all
pre-cutover work. The cutover step is: update the Supabase edge function secret to the Valta
workspace token.

**Supabase instance:**
There is only one Supabase instance (`ngovnamnjmexdpjtcnky`). It is live and not paused. All test
writes (signed-date, job_files, status) go into the same DB as production data. Use dedicated test
job records (VAL261101 and its `job_id`) and never write to rows belonging to real client jobs.

**DocuSeal API key:**
Stored as `DOCUSEAL_API_KEY` in Supabase edge function secrets. The proxy and the direct API calls
in the test loop use this key. Ben's test DocuSeal account uses it during testing; the Valta account
key replaces it at cutover.

**Cutover checklist (when going live):**
1. Update `CLICKUP_API_TOKEN` secret → Valta workspace token.
2. Update `DOCUSEAL_API_KEY` secret → Valta DocuSeal account key.
3. Confirm webhook URL is registered in the Valta DocuSeal account.
4. Test with a real Valta job record (not VAL261101).
5. Verify `job_submissions.status` flips correctly for a real job.

---

## 12 — Sources

Every fact in this sheet is grounded in one of these sources:

- [docuseal-webhook/index.ts](~/Development/APR-Dashboard-v3/supabase/functions/docuseal-webhook/index.ts)
  — primary source for all DB writes, ClickUp logic, job-lookup paths, and error handling. Read in
  full for this sheet.
- [LOE-DOCUSEAL-ARCHITECTURE.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-DOCUSEAL-ARCHITECTURE.md)
  — Sections 4.7–4.9 (webhook data flow), 5.1–5.4 (DB schema), 8.3–8.4 (webhook payloads + error
  handling). The `loe_submissions` update discrepancy was found by comparing this doc against the
  live webhook code.
- [00-LOE-ESIGN-FEATURE.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/00-LOE-ESIGN-FEATURE.md)
  — Section 6 (known bugs including `loe_submissions` silent-fail), current state as of 2026-06-05.
- [00-CLOSING-PAYMENT-FEATURE.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/00-CLOSING-PAYMENT-FEATURE.md)
  — downstream closing sequence (Phases 8+); the TODO comment in the webhook confirmed against this
  doc.
- [PHASE-5-LOE-ESIGN.md](~/Development/APR-Dashboard-v3/tests/phase-sheets/PHASE-5-LOE-ESIGN.md)
  — the prior phase; Sections 5–6 (completion round-trip, programmatic auto-sign API). The
  `PUT /submitters/{id}` `completed:true` finding originated in Phase 5's investigation.
- DocuSeal API documentation (`docuseal.com/docs/api`) — the Update-a-submitter endpoint with
  `completed: true` parameter, as documented in Phase 5 Section 6 (verified against live API docs).
- [CLAUDE.md](~/Development/APR-Dashboard-v3/CLAUDE.md) — ClickUp test list IDs and production list
  IDs; Supabase instance ID; the "never write client's live ClickUp during testing" rule.

---

**Last reviewed:** 2026-06-11 by co-architect — Phase 6 stage anatomy; grounded in live webhook code.
All gaps are documented against their source.
