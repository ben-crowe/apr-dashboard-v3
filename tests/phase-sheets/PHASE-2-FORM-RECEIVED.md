---
title: "Phase 2 — Form Received (Dashboard + Supabase + ClickUp + Email)"
tags: [#APR, #testing, #phase-sheet, #full-loop, #dashboard, #supabase, #clickup]
created: 2026-06-11
author: qa-agent
status: active
---

# Phase 2 — Form Received

**What this sheet is:** the canonical reference for what happens AFTER the client hits Submit on the intake form. Picks up exactly where [Phase 1 — Client Submission](~/Development/APR-Dashboard-v3/tests/phase-sheets/PHASE-1-CLIENT-SUBMISSION.md) ends.

**How to read it:** every section leads with the **Goal** (what we want), then a **Current State** block right under it (what the code does today). Goal first because that's what we're building toward; current state second so you know the gap.

---

## Index

1. The Goal Chain — one submit fires four things
2. Submit-Trigger 2.1 — Supabase job row
3. Submit-Trigger 2.2 — Dashboard job created
4. Submit-Trigger 2.3 — ClickUp task auto-created (the team's notification)
5. Submit-Trigger 2.4 — Client thank-you email
6. Dashboard "Client Information & Property Details" section — the field display
7. Tools / CLIs for this phase
8. Definition of Done

---

## 1. The Goal Chain — one submit fires four things

**Goal:** one client submission AUTO-TRIGGERS the whole chain, no human in the loop:

submit → Supabase job row → dashboard job created → ClickUp task auto-created (with data piped in) → client thank-you email sent.

The team lives in ClickUp working jobs, NOT in the APR dashboard. So the ClickUp task IS their notification a new job came in — it has to fire on submit, carrying the data. The four submit-triggers are detailed as 2.1–2.4 below.

**Current State:** only the first two fire automatically today (Supabase row + dashboard job + file uploads). ClickUp is a manual button. The thank-you email is promised on screen but never sent. Those two gaps are the build work.

---

## 2. Submit-Trigger 2.1 — Supabase job row

**Goal:** the moment the client submits, one row lands in the Supabase `job_submissions` table with every field in the right column. This row IS the job — the source of truth everything downstream reads.

**Current State:** ✅ working. The submit handler (`useFormSubmission.ts`) does a single insert into `job_submissions`, sets `status: "submitted"` and `source: "webform"`, and uploads any attached files to the `job-files` bucket + records them in `job_files`.

### Columns written

| Form field | `job_submissions` column |
|---|---|
| First Name / Last Name | `client_first_name` / `client_last_name` (required) |
| Client Title | `client_title` |
| Client Company Name | `client_organization` |
| Client Phone / Email | `client_phone` / `client_email` (required) |
| Client Organization Address | `client_address` |
| Property Name / Address | `property_name` / `property_address` |
| Property Type | `property_type` (required by DB) |
| Authorized Use | `intended_use` (null if blank) |
| Valuation Premises | `valuation_premises` (null if blank) |
| Asset Current Condition | `asset_condition` (null if blank) |
| Property Contact (4 fields) | `property_contact_*` (null if blank) |
| Additional Information | `notes` |
| — auto | `status` = "submitted", `source` = "webform", `tags` = [], `source_metadata` = {referrer, user_agent} |

### Verify

```bash
source /Users/bencrowe/Development/APR-Dashboard-v3/.env.local
curl -s "https://ngovnamnjmexdpjtcnky.supabase.co/rest/v1/job_submissions?order=created_at.desc&limit=1" \
  -H "apikey: $VITE_SUPABASE_PUBLISHABLE_KEY" \
  -H "Authorization: Bearer $VITE_SUPABASE_PUBLISHABLE_KEY"
```

Newest row has your values, `status: "submitted"`, `source: "webform"`.

---

## 3. Submit-Trigger 2.2 — Dashboard job created

**Goal:** the submitted row immediately becomes a job visible in the dashboard, with all the client + property data shown for the team to review and edit.

**Current State:** ✅ working. The row IS the dashboard job — there's no separate "create job" step. Opening `http://localhost:8086/dashboard/job/<job-id>` renders the data in the "Client Information & Property Details" section (detailed in Section 6 below).

---

## 4. Submit-Trigger 2.3 — ClickUp task auto-created (the team's notification)

**Goal:** the moment the client submits, a ClickUp task is auto-created on the team's list, with the submission data piped into it. This is how the team finds out a new job arrived — they work in ClickUp, not the dashboard. No human action between submit and the card appearing.

**Current State:** ❌ NOT auto-created today — this is the DEAD pattern being replaced. Today a human has to open the dashboard, create a Valcre job first, then click a "Create ClickUp Task" button (it's disabled until a Valcre job exists, tooltip *"Create a Valcre job first to enable ClickUp integration"*). Source comment in `useFormSubmission.ts`: *"REMOVED: Automatic ClickUp task creation on form submission."* That removal is the thing we're undoing.

**Build task:** fire the `create-clickup-task` edge function from the submit handler right after the row insert succeeds. The function is already idempotent (returns the existing task if one exists, so re-runs are safe). Drop the Valcre-job gate for the auto-create path; the function already handles a "PENDING" card name until a Valcre job number exists. Retire or repurpose the manual "Create ClickUp Task" button to "View in ClickUp."

### ⭐ Task NAME convention (verified in code 2026-06-11 — `create-clickup-task` + `updateClickUpWithValcreJob`)

The task name is **not freeform** — it follows a convention, and it's a **two-stage** name because no Valcre number exists yet at submit:

- **At submit (this phase, no Valcre job yet):** `PENDING - <Property Name>, <Street>, <City>`
  - e.g. `PENDING - Northgate Center, 7816 Main Avenue, Calgary` (province/postal stripped, no client name). `PENDING` is the placeholder where the VAL number will go. (`create-clickup-task`: `${job_number || valcre_job_id || 'PENDING'} - ${propertyName}, ${shortAddress}`.)
- **After the Valcre job is created (Phase 2B / Phase 3):** the SAME card is **renamed** to `<VAL job #> - <address>` and its body header flips to **"JOB BOOKED - <VAL#>"**. This rename is wired in `updateClickUpWithValcreJob` (`src/utils/webhooks/clickup.ts`) and fires at the Valcre-job step, NOT here.

So the lifecycle is: **PENDING name on submit → renamed to the VAL-number convention when Valcre assigns the number.** This phase only ever produces the `PENDING - …` name; the rename belongs to [Phase 2B](~/Development/APR-Dashboard-v3/tests/phase-sheets/PHASE-2B-LOE-PREP-GATING.md) / [Phase 3](~/Development/APR-Dashboard-v3/tests/phase-sheets/PHASE-3-VALCRE-JOB-CREATION.md).

> ⚠️ **Verify at the rename step (flag, not a blocker):** the create-name uses "Property Name, Street, City" but the rename uses the **full address** — the two formats don't perfectly match (property name may drop, short vs full address). Confirm the rename lands the EXACT intended convention when testing Phase 2B/3.

Deep field-level ClickUp detail (every custom field, the sync engine, the cutover) lives in the canonical doc, NOT here: [ClickUp Card Sync — CANONICAL](~/Development/APR-Dashboard-v3/docs/Features/04-Job%20%26%20Client%20Mgt./CLICKUP-SYNC-CANONICAL.md).

### What the card looks like (same engine today and after — `create-clickup-task` edge function)

- **Name:** per the two-stage convention above (`PENDING - …` here → `VAL# - …` after Valcre).
- **Body:** "NEW APPRAISAL REQUEST" header + link to the dashboard job + Valcre link + Job # + Date Ordered + LOE tracker scaffold. All data lives in custom fields, not the body.
- **Custom fields:** client/property/contact/financial/notes pushed into typed fields (set-replaces, no dup possible).
- **Tags:** `NEW ARRIVAL`, `APR Hub`.
- **Lands on:** BC Workspace "New Submission" list (`901706896375`) — the function is pinned to dev so test cards stay off Chris's live Valta list.

### Verify

Today: create Valcre job → click "Create ClickUp Task" → button flips to "View in ClickUp" + `clickup_task_id` non-null on the row.
Goal: submit the form → re-run the Section 2 curl → `clickup_task_id` already set, card already on the BC list, with NO human action in between.


### ⭐ Test → Production cutover (exact — do not guess) — TODAY ACTION ITEM

Ben wants to do this cutover **today, once tests pass**. The exact targets:

- **TODAY (test) — Ben's BC test ClickUp:** workspace/team **8555561**, test list **901709622357** ("APR Test - Valta Mirror").
- **PRODUCTION — the CLIENT's Valta workspace:** team **9014181018**, prod list **901402094744**, template **t-86b3exqe8**.

> ⚠️ Note: older wiring/docs reference a BC "New Submission" list `901706896375` and a different test list `901703694310`. The CANONICAL test target per Ben is **901709622357** (team 8555561). Reconcile any hardcoded list IDs to these before cutover.

**The cutover = two parts:**

1. **Retarget the list ID + token** (Ben-gated) — point `create-clickup-task` at the Valta prod list `901402094744` + the Valta workspace token.
2. **REBUILD EXACT on the client's Valta** — the ClickUp API **CANNOT save a task template** (that's UI-only). So the template rebuild is a **Codex in-app job (login-gated):** in the Valta space, build a task with ALL custom fields → "Save as Template." Because our field resolution is **byName** (not byId), the field set replicates with **zero code change**. **Field IDs are per-list — NEVER hardcode one list's field IDs for another list.**

---

## 5. Submit-Trigger 2.4 — Client thank-you email

**Goal:** the moment the client submits, they get an automated thank-you / confirmation email — *"Thanks {firstName}, we've received your appraisal request for {propertyName}. Our team will get back to you within the next couple hours with next steps."*

**Current State:** ❌ NOT sent today. The success screen tells the client *"You'll receive a confirmation email shortly,"* but nothing behind it sends one. The only email functions that exist (`send-loe-email*`) are for the LOE document much later in the workflow, not a post-submission thank-you. So today it's a promise on screen with no automation.

**Build task:** build a `send-submission-thankyou` edge function (Resend-backed) and fire it from `useFormSubmission.ts` after the row insert, using `client_email` + `client_first_name` from the just-inserted row. Fire-and-forget — a failed email must NOT block the client's success screen (log + retry, don't fail the submit).

---

## 6. Dashboard "Client Information & Property Details" section

**Goal:** opening the job in the dashboard shows every submitted field, editable, with auto-save and Valcre sync — the team's live working surface for the job.

**Current State:** ✅ working. First collapsible block in the job detail view (`ClientSubmissionSection.tsx`), open by default. Every field auto-saves on blur (500ms debounce) to Supabase; once a Valcre job is attached, edits also sync to Valcre.

### What it shows

**Client Information** — First Name, Last Name, Title, Organization, Phone (auto-formats), Email, Address. Reads from `client_*` columns.

**Property Information** — Property Name, Property Type (select), Address, Authorized Use (select → `intended_use`), Valuation Premises (select), Asset Condition (select). Same dropdown options as the intake form.

**Property Contact** — First Name, Last Name, Email, Phone. Reads from `property_contact_*`.

**Client Comments** — textarea, reads from `notes` (form's "Additional Information").

**Uploaded Documents** — lists `job_files` rows; Upload / Download / View / Delete available.

### Label-mapping gotchas (not bugs)

- Form "Additional Information" → dashboard "Client Comments" → DB `notes`
- Form "Authorized Use" → dashboard "Authorized Use" → DB `intended_use`
- Form "Client Company Name" → dashboard "Organization" → DB `client_organization`

### Verify

Open the job, screenshot the section, Read it, confirm every submitted value maps to the right field. Save to `~/Development/KM-Exp/data/screenshots/leg2-dashboard-client-section.png`.

---

## 7. Tools / CLIs for this phase

> These markdowns double as a reminder of our capabilities + how we do the work. For Phase 2 specifically:

- **`/cli-clickup-tools`** — create / read / update ClickUp tasks + custom fields; verify the auto-created card landed on the test list with data in fields. This is the primary tool for the whole 2.3 ClickUp trigger + the cutover.
- **`/cli-apr-tools` + Supabase REST direct** — verify the `job_submissions` row (source `.env.local`, curl with `apikey` + `Bearer`); confirm `clickup_task_id` written back after submit.
- **`/supabase-deploy`** — deploy the `create-clickup-task` edge function change (firing it on submit) + the future `send-submission-thankyou` function.
- **`/guide-vercel-deploy`** — submit-handler (`useFormSubmission.ts`) changes need a deploy; Vite dev proxies `/api` to prod Vercel.
- **`/cli-browser-auto` + `/agent-screenshot`** (`--session apr-iso`, port 8086) — drive the intake form Submit + screenshot the success screen / dashboard "Client Information" section. NOT `--cdp 9222` (KM-Exp).
- **BC email CLI suite (EPA BC-Support system)** — `~/Development/02-Project-Planning/EPA BC-Support system/`, `/email-check` / `/email-view`. How a Claude Code agent verifies the 2.4 thank-you email itself (arrived / open / read / screenshot). NEVER Codex, NEVER computer-use. One-time `reauth_gmail.py` if token expired.
- **Codex** — ONLY for the login-gated ClickUp "Save as Template" rebuild on the Valta workspace (the cutover). Not for email, not for the submit/test flow.

---

## 8. Definition of Done

### Today-PASS (current ground-truth works)

1. Submitting creates ONE `job_submissions` row, every field correct, `status: "submitted"`, `source: "webform"`.
2. Attached files land in `job_files` + the bucket + the dashboard Uploaded Documents list.
3. Opening the job shows the "Client Information & Property Details" section with values mapped correctly (screenshot).
4. After creating a Valcre job, the manual "Create ClickUp Task" button makes a card on the BC list, flips to "View in ClickUp", writes `clickup_task_id` back.

### Goal-PASS (the chain is shipped)

1. Submitting auto-creates the ClickUp card (data in custom fields), no human action — `clickup_task_id` already non-null right after submit.
2. Submitting auto-sends the client thank-you email (verified by a real send), without blocking the success screen.
3. The dashboard section + file landings still pass unchanged.
4. The manual "Create ClickUp Task" button is retired or repurposed to "View in ClickUp."

---

*Sources: `src/components/submission-form/useFormSubmission.ts`, `src/components/submission-form/SuccessScreen.tsx`, `src/components/dashboard/job-details/ClientSubmissionSection.tsx`, `src/components/dashboard/job-details/actions/ClickUpAction.tsx`, `src/utils/webhooks/clickup.ts`, `supabase/functions/create-clickup-task/index.ts`, `src/integrations/supabase/types.ts` (`job_submissions` Row).*
