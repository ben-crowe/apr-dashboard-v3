---
id: apr-data-flow-ground-truth
title: "APR Dashboard — End-to-End Data Flow (code-traced ground truth)"
status: verified-from-code 2026-06-18
type: reference
method: four parallel deep-traces reading the actual source, every claim cited file:line
note: >
  This supersedes the Master Dashboard's narrative where they disagree. The dashboard
  said the form "auto-creates the Valcre job + ClickUp card" — the CODE shows that is
  false. Valcre and ClickUp are manual dashboard buttons. Tracked action-by-action.
tags: [apr-workflow, data-flow, ground-truth, intake, valcre, clickup, loe, docuseal, quickbooks]
---

# APR Dashboard — End-to-End Data Flow (as the code actually runs)

Each stage = what fires, what data moves, where it lands, and whether it's AUTO or MANUAL.
Wired-vs-not-wired is called out honestly. Citations point to the real files.

---

## STAGE 1 — Client Intake (the form)

**Trigger:** client submits the appraisal-request form (`SubmissionForm.tsx`, route `/`).
The submit handler is `submission-form/useFormSubmission.ts` `handleSubmit`.

**What actually happens, in order:**
- Validate the form; on any error, stop — no write.
- **Insert one row into `job_submissions`** — every client + property + property-contact field, stamped `status: "submitted"`, `source: "webform"`, empty `tags`, and `source_metadata` (referrer + user-agent).
- **Conditionally insert `job_property_info`** — only if Property Subtype or Tenancy was provided.
- **Files:** each upload is sanitised, pushed to the `job-files` storage bucket, and a `job_files` row written.
- Show success. Done.

**What does NOT happen on submit (proven in code + comments):**
- **No Valcre job.** No Valcre code is even imported by the form.
- **No ClickUp task** — explicitly removed: *"REMOVED: Automatic ClickUp task creation on form submission … ClickUp tasks should be created manually from the dashboard."*
- **No n8n / webhook / edge-function call** — the old n8n `sendToWebhook` is still imported but never invoked; a `webhookData` object is built and never sent.

**Auth:** anonymous write (publishable key, *"Submit job data without authentication requirement"*). Succeeds only because RLS permits anon insert on these tables. There is no login anywhere in this app.

> **Correction to the Master Dashboard:** Stage "Job Creation — auto-creates Valcre job + ClickUp card" is inaccurate. The form writes to the database only.

---

## STAGE 2 — The submission becomes a dashboard job

- The dashboard job list (`/dashboard`) reads `job_submissions` with `select('*').order('created_at', desc)` — newest first. **A job simply IS a `job_submissions` row.** No Valcre, no ClickUp involved to appear here.
- Search/filter is in-memory (client-side); no re-query.
- Clicking a row navigates to `/dashboard/job/:jobId` and loads **four tables**: `job_submissions` (the job), `job_files`, `job_loe_details`, `job_property_info`. If the LOE row carries a Valcre job number, it overwrites the displayed job number so the title shows the VAL number.

---

## STAGE 3 — Section 1 (Client Information & Property Details)

The first accordion section. (Three sibling files exist — `…Clean`, `…Independent`, `…-old` — all dead; only `ClientSubmissionSection.tsx` is rendered.)

- **Binds each intake field to its column.** Client + property + property-contact fields → `job_submissions`. Property **Subtype** and **Tenancy** are special — they live on `job_property_info`, not `job_submissions`.
- **Three save paths:**
  - Text inputs → optimistic update, then a debounced save-on-blur to `job_submissions`.
  - Dropdowns (Property Type, Authorized Use, Valuation Premises, Asset Condition) → save immediately on change.
  - Subtype / Tenancy → separate path into `job_property_info`.
- All fields editable; no read-only. A per-field check-mark shows saving → saved → synced.
- **Section 1 is the "source" of the cascade.** Property Type / Subtype / Tenancy + Authorized Use feed Section 2's derivations — but Section 1 itself contains no cascade logic, it only stores the inputs.

---

## STAGE 4 — Section 2 (LOE Quote) + the cascade

The second section. Almost everything here saves to **`job_loe_details`** (keyed on `job_id`), auto-debounced on edit — there is **no Save button**.

**The cascade (`loeCascade.ts`)** — pure rules, exact-string keyed, fired by React effects when Status of Improvements or Authorized Use changes:
- **Value Scenarios** ← Status of Improvements (e.g. "Improved - Completed" → "As Stabilized"; "Proposed - Vacant Land" → "As Is Vacant Land" + "As If Complete & Stabilized"). **Insurance override wins:** Authorized Use containing "insurance" → "Insurable Replacement Cost".
- **Approaches to Value** ← same inputs (Insurance → "Cost Approach").
- **Property Rights** ← Property Type → Subtype (Mixed Use) → Tenancy, in that override order (Tenancy beats all). Single-Tenant → "Going Concern", Owner Occupied → "Fee Simple", etc.
- Derived fields are read-only displays; they auto-save like any other field.

**Authorized Use is NOT a Section 2 field** — it's `job.intendedUse` on `job_submissions` (Section 1), read into the cascade. Subtype/Tenancy shown here are mirrors of the `job_property_info` values.

---

## STAGE 5 — Create Valcre Job (MANUAL button)

- **Canonical handler:** `LoeQuoteSection.handleCreateValcreJob` (the `ValcreAction` component is a legacy twin that lacks LOE data — its own comment says to use the Section-2 handler).
- **Gated:** the button only enables when property address, type, intended use, appraisal fee, scope of work, and valuation premises are present.
- **Path:** builds a flat payload → `sendToValcre` → **POST to the Vercel `/api/valcre`** serverless function (NOT the parallel Supabase `create-valcre-job` edge function, which is legacy/unused here).
- **Server side:** find-or-create Contact → create Property (with enum validation) → create Job. Property Rights routes to a Valcre custom field, not the native field.
- **Writeback:** the returned VAL number → `job_loe_details.job_number`; the numeric id → `job_loe_details.valcre_job_id`.
- **After success it auto-fires** the ClickUp card update and (in the creation path) folder scaffolding.
- **Verification:** custom-field writes are readback-verified via GetValues — *"Valcre returns HTTP 200 even on internal failure, so the ONLY proof is reading it back."*

---

## STAGE 6 — Create ClickUp Task (MANUAL, hard-gated)

- **Hard gate:** the button is disabled until a Valcre job number exists — *"Create a Valcre job first to enable ClickUp integration."*
- **Path:** calls the `create-clickup-task` edge function with the job id.
- **List is pinned to the test (dev) list in code** regardless of the global setting — so Stage-1 cards land on Ben's test list, not the client's production list. The production list + template are defined but not selected.
- **Idempotent:** if a task id already exists it returns the existing one.
- **Card model:** data lives in custom fields, not the description (the description is just two quick-links). Writeback stores `clickup_task_id` + `clickup_task_url` on both `job_submissions` and `job_loe_details`.

---

## STAGE 7 — Field Sync (ongoing, after a Valcre job exists)

- Editing a Section-2 field auto-saves to `job_loe_details` (debounced), then:
  - **→ ClickUp card:** for a fixed set of card fields, reusing the existing task (never creating).
  - **→ Valcre:** for a fixed set of sync fields, **but only once a real Valcre job exists** (number + id). Before that, fields save to Supabase only.
- Every Valcre write is readback-verified; the amber field indicator surfaces an otherwise-silent rejection.
- Section 1's fields don't sync to Valcre directly — they influence it indirectly by re-firing the cascade, whose derived fields then sync.

---

## STAGE 8 — LOE Generation

- `generateLOEHTML` loads a template row by precedence: explicit HTML → the job's template id → **newest active version** (note: active, not "default") → embedded fallback.
- Version picks the token vocabulary: version ≥ 6 → the **V07 `[PascalCase]` tokens** (current default); older → the `[lowercase.dotted]` tokens.
- Every `[Token]` is replaced from `job` / `jobDetails` (full token→field map in the trace).
- **Section 10** is itself a cascade: left column = value scenarios derived from Status of Improvements; right column = the matching EA/HC narrative from a preloaded narrative library. Empty scenarios → the whole section is dropped; Schedule A is stripped unless assignment type is "multiple".
- Signature/date anchor tags are left in the HTML for DocuSeal to convert.

---

## STAGE 9 — Contract record (job_contracts) — PARTIALLY DEAD

- `job_contracts` holds one job's tailored HTML with its own lifecycle (`draft | saved | sent`).
- **Save Draft** (from the preview or the split editor) writes `edited_html` as `draft`, reusing the same row on re-save.
- **⚠ Gap:** `markContractSent` — the function that would flip a contract to `sent` — is **never called anywhere.** So `job_contracts` never actually reaches `sent`. The read-only/"view sent contract" plumbing exists for a state the code never produces. The real send instead logs a `job_email_instances` row and updates `job_loe_details` — it does **not** update the contract's state.

---

## STAGE 10 — E-Signature send (DocuSeal)

- Entry: `LoeQuoteSection.handleApproveAndSend` → `generateAndSendLOE(..., sendEmail=false)` (the caller owns the email, to avoid a double-send).
- Builds a DocuSeal submission from the **HTML itself** (no template id; HTML is the single source of truth), one submitter "First Party", `send_email: false`.
- **POST to the `docuseal-proxy` edge function** → forwards to the DocuSeal API. (An older direct path in `docuseal.ts` exists but is unused.)
- Persists a `loe_submissions` row (full filled HTML snapshot + slug + submission id, `status: pending`) and writes `job_loe_details.docuseal_submission_id` — **this id is the keystone the webhook later uses to find the job.**
- Builds the signing link to the in-app signing page and returns it.
- **⚠ Latent risk:** the submission sets no `metadata.job_id`, so the webhook can only find the job via that stored submission id. If that write failed, the webhook can't match.

---

## STAGE 11 — Email send

- `sendLOEEmail` → **POST to the `send-loe-email-fixed` edge function** with `{ to, clientName, signingLink, propertyAddress }` (plus subject/body when an override is composed; `{{signing_link}}` pre-resolved).
- **Transport:** Microsoft Graph is gated behind an env var that isn't set, so it falls through to **Resend, from `onboarding@resend.dev`** (a sandbox sender, no real domain invested).
- **`job_email_instances`** (`state: sent`) is written client-side after a confirmed send, when an override is present.
- Success is reported only on a real `success:true` — never a bare HTTP 200 (the fix for the old silent-RLS bug).
- **Dead variants on disk:** `send-loe-email`, `send-loe-email-v2`, `send-loe-email-gmail` — all unused; only `-fixed` is live.

---

## STAGE 12 — DocuSeal webhook (signing comes back)

- `docuseal-webhook` runs with the **service-role key** (bypasses RLS). Listens for `submission.created` and `submission.completed`.
- Finds the job by `job_loe_details.docuseal_submission_id` (the metadata fallback never fires — no metadata is sent).
- **On created (LOE sent):** stamps `loe_sent_at`, updates the ClickUp card's "LOE Sent" line.
- **On completed (LOE signed):** sets `job_submissions.status = 'loe_signed'`, writes the signed PDF url + signed-at to `job_loe_details`, inserts a `signed_agreement` `job_files` row, mirrors the PDF to SharePoint (no-ops until Entra configured), **fires QuickBooks Trigger-1**, and updates the ClickUp "LOE Signed" line.
- **⚠ HTTP-200-on-error risk:** on the *sent* event, a job-not-found returns 200 ("skipping"), so a missed timestamp silently won't retry.

---

## STAGE 13 — Closing / QuickBooks

All five `qbo-*` edge functions exist but are **inert by design** — each returns 503 until the Intuit app + OAuth are bootstrapped.

- **Trigger-1 (signed → invoice): WIRED.** Inside the signed-webhook it chains create-customer → create-invoice → send-invoice using client + appraisal-fee data. It short-circuits on the 503 today and never fails the webhook — so it's wired, just dormant until Intuit creds exist.
- **Trigger-2 (paid → receipt): NOT WIRED.** `qbo-webhook` receives the payment but the downstream is a TODO stub, and **no `qbo_invoice_id` is ever stored**, so a payment can't be mapped back to a job. Paid-flip + receipt don't happen.
- **No QuickBooks code in the frontend** — the whole closing flow is server-to-server.

---

## The honest shape

- **Form → database only.** No external calls on submit.
- **Then a human-driven dashboard sequence:** Section 1 (intake) → Section 2 (LOE + cascade) → **manually** Create Valcre Job → **manually** Create ClickUp Task (gated on Valcre) → ongoing field sync → generate LOE → send to DocuSeal → email the link → webhook records the signature → QuickBooks Trigger-1 (dormant).
- **The automation is in the individual actions, not the chaining** — a person still walks each job stage to stage.

## Real gaps / risks surfaced by the trace
- `job_contracts` never flips to `sent` (`markContractSent` is dead code).
- QuickBooks Trigger-2 (paid → receipt) isn't wired, and there's no invoice→job mapping column.
- DocuSeal submissions carry no `metadata.job_id` — webhook matching hangs entirely on the stored submission id.
- The webhook returns HTTP 200 on a not-found "sent" event — silent miss, no retry.
- Email goes out from a Resend sandbox sender; the Microsoft Graph transport is built but not switched on.

---

*Traced 2026-06-18 from source via four parallel deep-reads. Where this disagrees with the
Master Dashboard, this document is the ground truth — it was read from the running code.*
