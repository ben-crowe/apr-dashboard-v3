---
title: "Phase 1 — Client Submission Form"
tags: [#APR, #testing, #intake-form, #phase-sheet, #full-loop]
created: 2026-06-11
author: qa-agent
status: active
---

# Phase 1 — Client Submission Form

**[⬅ Back to Phase Sheets Dashboard](~/Development/APR-Dashboard-v3/tests/phase-sheets/00-PHASE-SHEETS-DASHBOARD.md)**

**What this sheet is:** the canonical one-page reference for testing the very first phase of the APR full-loop — the public client intake form. Everything needed to run, verify, and understand this phase is on this page.

**How to read this sheet:** sections that describe behavior have two parts — **TODAY** (what the code actually does right now) and **TO-BUILD** (the goal, which doubles as the spec). The field tables (Sections 2–3) are the same in both — fields are fields. The submit-triggers-the-chain behavior is where TODAY and TO-BUILD differ (Sections 1 + 6).

---

## 1. What It Is + Where

The client intake form is how appraisal requests enter the system. A client fills it out, submits, and it lands as a row in `job_submissions`. The app then shows the submitted data in the dashboard's **Client Submission section** (Section 1 of the job detail accordion).

**Local dev (agent-controlled, Vite, port 8086):**

http://localhost:8086/appraisal-request-form

Note: the route `/appraisal-request-form` renders the same `SubmissionForm` component as `/` (the Index route). Either URL works locally.

**Live (Vercel, always accessible, no local server needed):**

https://apr-dashboard-v3.vercel.app/appraisal-request-form

The agent can fully drive the **local dev** version — start it with `npm run dev` in `~/Development/APR-Dashboard-v3`, then control it via `agent-browser --session apr-iso open http://localhost:8086/appraisal-request-form`. Local is the preferred test target: shorter feedback loop, same codebase. The live Vercel site is the production target for smoke tests when you don't want to run the dev server.

> **⭐ This IS the client-website form (Ben, 2026-06-11).** This form — the one we drive and review for testing — is our canonical testing form, and it **matches, and is intended to match, the embedded appraisal-request form on the Valta client website**. It represents the exact same form a real client fills out on the website. So testing this form = testing the real client intake experience. If the website's embedded form and this form ever diverge, that's a defect to flag — they are meant to stay identical.

### What submitting this form triggers

**TODAY (ground-truth):** submitting creates a `job_submissions` row + uploads files. That's it. No ClickUp task, no client email fire automatically — see [Phase 2](~/Development/APR-Dashboard-v3/tests/phase-sheets/PHASE-2-FORM-RECEIVED.md) for the full post-submit picture.

**TO-BUILD (the goal):** one submission AUTO-TRIGGERS the chain — Supabase row → dashboard job → **ClickUp task auto-created** (the team's notification, with data piped in) → **client thank-you email auto-sent**. The team works jobs in ClickUp, not the dashboard, so the submission has to push into ClickUp on its own. The full spec for that chain lives in Phase 2; this sheet just covers getting a clean, correct submission INTO the system.

---

## 2. Full Field Table

Source: `src/components/submission-form/ClientInformationSection.tsx`, `PropertyInformationSection.tsx`, `DocumentsSection.tsx`, `useFormSubmission.ts`. (Same in TODAY and TO-BUILD — the form fields don't change.)

### Section 1 — Client Information

| Field label on form | Field name (React) | Type | Required | Supabase column (`job_submissions`) |
|---|---|---|---|---|
| First Name | `clientFirstName` | text | ✅ Yes | `client_first_name` |
| Last Name | `clientLastName` | text | ✅ Yes | `client_last_name` |
| Client Title | `clientTitle` | text | No | `client_title` |
| Client Company Name | `clientOrganization` | text | No | `client_organization` |
| Client Phone | `clientPhone` | tel | ✅ Yes | `client_phone` |
| Client Email | `clientEmail` | email | ✅ Yes | `client_email` |
| Client Organization Address | `clientAddress` | text | No | `client_address` |

### Section 2 — Property & Job Information

#### Property basics

| Field label on form | Field name (React) | Type | Required | Supabase column (`job_submissions`) |
|---|---|---|---|---|
| Property Name | `propertyName` | text | ✅ Yes | `property_name` |
| Property Address | `propertyAddress` | text | No | `property_address` |

#### Optional Property Contact

| Field label on form | Field name (React) | Type | Required | Supabase column (`job_submissions`) |
|---|---|---|---|---|
| First Name/Department | `propertyContactFirstName` | text | No | `property_contact_first_name` |
| Last Name | `propertyContactLastName` | text | No | `property_contact_last_name` |
| Email | `propertyContactEmail` | email | No | `property_contact_email` |
| Phone | `propertyContactPhone` | tel | No | `property_contact_phone` |

#### Classification dropdowns

| Field label on form | Field name (React) | Type | Required | Options | Supabase column (`job_submissions`) |
|---|---|---|---|---|---|
| Property Type | `propertyType` | select | ✅ Yes | Agriculture, Building, Healthcare, Hotel, Industrial, Land, Manufactured Housing, Multifamily, Office, Retail, Self-Storage, Single-Family, Seniors, Special Purpose, Unknown, Other | `property_type` |
| Authorized Use | `intendedUse` | select | No | First Mortgage Financing, Financial Reporting, Insurance, Internal Decision-Making, Acquisition-Disposition, Estate Planning, Litigation, GST | `intended_use` |
| Valuation Premises | `valuationPremises` | select | No | Market Value, Market Rent, Investment Value, Insurable Value, Liquidation Value | `valuation_premises` |
| Asset Current Condition | `assetCondition` | select | No | Excellent, Very Good, Good, Fair, Poor | `asset_condition` |

> "Authorized Use" on the form maps to `intended_use` in Supabase. The label diverges intentionally — "Authorized Use" is the client-facing term; `intended_use` is the internal/Valcre term.

### Section 3 — Documents

| Field label on form | Field name (React) | Type | Required | Supabase table |
|---|---|---|---|---|
| Document upload(s) | `files` | file (multi) | No | `job_files` (separate table, FK to `job_submissions.id`) |

### Section 4 — Additional Information

| Field label on form | Field name (React) | Type | Required | Supabase column (`job_submissions`) |
|---|---|---|---|---|
| Additional Information | `notes` | textarea | No | `notes` |

### Submit

One "Submit" button at the bottom.

**TODAY:** submitting inserts a row into `job_submissions` with `status = "submitted"`, uploads any files to the `job-files` bucket, records them in `job_files`, and shows the success screen. No downstream automation fires.

**TO-BUILD:** the same insert + file upload, PLUS the submit handler auto-fires the ClickUp task creation and the client thank-you email (see Phase 2 for that spec).

---

## 3. Mapping In → Out

### Form → Supabase → Dashboard Client Section

The form's `handleSubmit` (in `src/components/submission-form/useFormSubmission.ts`) does a single `supabase.from('job_submissions').insert(...)` call. The key mappings (same in TODAY and TO-BUILD):

| Form field | `job_submissions` column | Dashboard display (Section 1 — Client Submission) |
|---|---|---|
| First Name + Last Name | `client_first_name` + `client_last_name` | "Client" header row, First Name / Last Name inputs |
| Client Title | `client_title` | Title input |
| Client Company Name | `client_organization` | Organization input |
| Client Phone | `client_phone` | Phone input |
| Client Email | `client_email` | Email input |
| Client Organization Address | `client_address` | Address textarea |
| Property Name | `property_name` | Property Name input |
| Property Address | `property_address` | Property Address textarea |
| Property Type | `property_type` | Property Type select |
| Authorized Use | `intended_use` | "Authorized Use" select (dashboard label matches form label) |
| Valuation Premises | `valuation_premises` | Valuation Premises select |
| Asset Current Condition | `asset_condition` | Asset Condition select |
| Property Contact (all 4) | `property_contact_*` | Optional Property Contact sub-group |
| Additional Information | `notes` | "Client Comments" (label differs — dashboard uses "Client Comments") |
| Files | `job_files` table (FK) | Organizing Docs section (Section 3), not Section 1 |

**One known propagation gap:** `valuation_premises` is saved to `job_submissions` on form submit. However the "Create Valcre Job" button reads from `job_loe_details` — and if that row doesn't have `valuation_premises` set, the button stays disabled. This is the known Stage-2 bug (see Known Bugs below).

---

## 4. Test Protocol

### The Rule

**Click the button. Never hand-fill. Hand-filling React controlled inputs (especially dropdowns) causes React state desync — the dropdown appears to show a value but the underlying state is empty, the submit sends blank. This was the source of every "field arrived blank" failure in Runs 1 and 2.**

The correct test path is:
1. Load the form on **localhost dev** (port 8086)
2. Click "Test Data" (the public intake form's auto-fill button, top-right of the form header)
3. Submit the form
4. Navigate to the resulting job in the dashboard
5. (Optional) Click "Fill with Test Data" + select a "Cascade Options" version for dashboard-side test data
6. Click "Create Valcre Job"

### Fill-with-Test-Data Button — where it is

**On the public intake form (`/` or `/appraisal-request-form`):**

A small "Test Data" link (text, not a button) sits in the top-right of the form header. It calls `generateCompleteTestData()` from `src/utils/testDataGenerator.ts` and populates all fields via `handleAutoFill`. This button renders on ALL environments — it is NOT gated to localhost. However it's subtle (no icon, small text), so target it by text content.

**On the dashboard job detail (`/dashboard/job/:id`):**

"Fill with Test Data" and "Clear" appear as small text links above the section accordion. These are in `src/components/dashboard/JobDetailAccordion.tsx`. They are **NOT** gated to localhost — they render everywhere, but disable themselves when the job already has a live Valcre job attached (`isLiveValcreJob` guard). The old per-section buttons described in `15-PLAYWRIGHT-TEST-BUTTONS.md` are gone; there is now ONE consolidated button at the top.

"Cascade Options" is a separate dropdown in the LOE Quote section (Section 2), also above the section body. It picks a scenario (V1–V4) and sets the value-scenario fields. This too renders everywhere and is `isLiveValcreJob`-gated.

### Localhost-dev-only gotcha

The `TestDataButton.tsx` component (used in some older paths) IS gated to `localhost` and `10.0.0.238` dev IPs. The buttons described above — the intake form "Test Data" link and the dashboard "Fill with Test Data" text link — are **NOT** using that component. They render everywhere. The document `15-PLAYWRIGHT-TEST-BUTTONS.md` is slightly stale on this.

**To be safe: always run tests against local dev (`http://localhost:8086`).** The local Vite dev server is the canonical test target. The hosted Vercel site works for read-only smoke tests but gives no test-data control.

### CLI tooling

| Tool | Purpose |
|---|---|
| `agent-browser --session apr-iso` | Open and drive the local form — screenshots, clicks, navigation. Requires `--session` flag (not `default`) to avoid hijacking KM-Exp at CDP 9222. |
| `~/.claude/scripts/apr/supabase-connect.sh` | Direct Supabase REST queries to verify what landed in `job_submissions` |
| `~/.claude/scripts/apr/apr-health-check.sh` | Confirm the app and Supabase are reachable |
| Playwright MCP `browser_fill_form` | For React controlled input fills if agent-browser's fill fails on a specific field |

### Step-by-step agent protocol

```
# STEP 0 — Start dev server (if not running)
cd ~/Development/APR-Dashboard-v3
npm run dev &
# Wait ~5s, then verify: curl -s http://localhost:8086/ | head -20

# STEP 1 — KM-Exp isolation tripwire (verify before and after)
curl -s 127.0.0.1:9222/json/list   # note the windowId=main URL

# STEP 2 — Open the form
agent-browser --session apr-iso open http://localhost:8086/appraisal-request-form
agent-browser --session apr-iso screenshot ~/Development/KM-Exp/data/screenshots/leg1-form-blank.png

# STEP 3 — Click "Test Data"
agent-browser --session apr-iso snapshot -i   # get refs
agent-browser --session apr-iso find text "Test Data" click
agent-browser --session apr-iso screenshot ~/Development/KM-Exp/data/screenshots/leg1-form-filled.png
# Verify: all fields populated, dropdowns show values (Property Type, Authorized Use, etc.)

# STEP 4 — Submit
agent-browser --session apr-iso find text "Submit" click
# Wait for success screen
agent-browser --session apr-iso screenshot ~/Development/KM-Exp/data/screenshots/leg1-form-submitted.png

# STEP 5 — Verify the row in Supabase
# Get the most recently created job_submissions row:
source /Users/bencrowe/Development/APR-Dashboard-v3/.env.local
curl -s "https://ngovnamnjmexdpjtcnky.supabase.co/rest/v1/job_submissions?order=created_at.desc&limit=1" \
  -H "apikey: $VITE_SUPABASE_PUBLISHABLE_KEY" \
  -H "Authorization: Bearer $VITE_SUPABASE_PUBLISHABLE_KEY"
# Check: client_first_name, property_type, intended_use are non-null
# TO-BUILD check: clickup_task_id should ALSO be non-null (auto-create fired on submit)

# STEP 6 — Navigate to the job in the dashboard and screenshot the mapped fields
# (use the id from STEP 5)
agent-browser --session apr-iso open http://localhost:8086/dashboard/job/<ID>
agent-browser --session apr-iso screenshot ~/Development/KM-Exp/data/screenshots/leg1-dashboard-client.png
```

### Screenshots to capture

| Screenshot | Filename convention | What to verify |
|---|---|---|
| Blank form loaded | `leg1-form-blank.png` | All sections visible, no pre-filled values |
| Form after "Test Data" click | `leg1-form-filled.png` | All fields populated, dropdowns show values |
| Success screen after submit | `leg1-form-submitted.png` | Success state visible (job ID or confirmation) |
| Dashboard Client Section | `leg1-dashboard-client.png` | Submitted values mapped correctly to all fields |

Save all screenshots to: `~/Development/KM-Exp/data/screenshots/`

---

## 5. Known Bugs (from QA Run 3, 2026-06-11)

Source: [tests/E2E-TEST-PRD-FULL-LOOP.md](~/Development/APR-Dashboard-v3/tests/E2E-TEST-PRD-FULL-LOOP.md) — Run Status 2026-06-11.

**Bug 1 — Create gives no visible success feedback (UI)**

After clicking "Create Valcre Job", the button does NOT flip to "View in Valcre" as expected. Root cause: the post-create LOE-detail save fails on an empty-string date value → Postgres error 22007 (invalid datetime format). This error does NOT cancel the Valcre job creation itself (the job IS created), but it blocks the UI state update that would flip the button. Severity: medium — the job is created, but the user sees no confirmation and cannot use "View in Valcre".

**Bug 2 — ClickUp update "Failed to fetch" from dev origin**

After job creation, the ClickUp card update call fails with "Failed to fetch" when running from `localhost:8086`. This is a CORS/edge-function origin issue — the Supabase edge function that updates ClickUp is not reached from the dev origin. The Valcre job IS created. Severity: medium — ClickUp stays out of sync on dev-initiated creates. (Note: relevant to the TO-BUILD auto-create path — the submit → ClickUp wiring must work from the dev origin too.)

**Bug 3 — Create double-click made 2 jobs (no in-flight disable)**

The "Create Valcre Job" button has no in-flight disabled state. Double-clicking it during the API call creates two Valcre jobs. `VAL261057` was the verified intended job from Run 3; an adjacent duplicate was also created. Severity: medium — requires manual cleanup in Valcre when it happens.

These are all in the downstream "Create Valcre Job" flow (Phase 2+), not in the form submission itself (Phase 1). Phase 1 (form → Supabase row) was verified PASS in Run 3.

---

## 5b. Live Form — the Valta Website (where this form actually goes)

**GOAL:** the real client form lives on the **Valta website at `valta.ca/request-appraisal/intake`**. Our APR-dashboard form (`/appraisal-request-form`) is the TEST stand-in that represents it. The two must carry IDENTICAL fields, and BOTH must feed the full pipeline (Supabase → dashboard job → ClickUp notification → confirmation email).

**CURRENT STATE (verified in code, not guessed):**
- The live Valta site is a **Next.js app at `~/Development/Valta-Website`**; the live form is **`app/request-appraisal/intake/page.tsx`** — the exact `valta.ca/request-appraisal/intake` route.
- It is **ALREADY wired to the SAME Supabase** (`ngovnamnjmexdpjtcnky`) **`job_submissions` table** as our test form — same DB, same project. Live-form submissions land in the same place. *(`lib/supabase.ts`, `hooks/useAppraisalFormSubmission.ts`)*
- It uploads files to the same `job-files` bucket + `job_files` table, and calls its own **`send-appraisal-request` edge fn** → a Resend confirmation email (FROM `Valta Website <onboarding@resend.dev>`).
- So this is **NOT a future "swap our form onto the site"** — both forms feed one database TODAY. They are **two separate codebases** (two forms, two submit hooks, two edge fns) pointed at one Supabase.

**TO-BUILD / WATCH:**
- **FIELD-DRIFT GUARD** — the two forms must stay field-identical. Compare the APR `SubmissionForm` fields vs the Valta intake fields; any divergence means the live form carries different data than we test. (Build task: keep in sync, or share one field source.)
- **The live form does NOT trigger the downstream pipeline** — its edge fn only emails. Wiring the live Valta form to the full chain (the **ClickUp new-job notification** + dashboard-job goal) is the to-build, same goal as Phase 2.

*Sources: `~/Development/Valta-Website/app/request-appraisal/intake/page.tsx`, `lib/supabase.ts`, `hooks/useAppraisalFormSubmission.ts`, `supabase/functions/send-appraisal-request/index.ts`.*

---

## 6. Goal / Definition of Done

### TODAY-PASS (current ground-truth works)

1. The public intake form loads at both the local dev URL and the live Vercel URL with all expected fields visible.
2. Clicking the "Test Data" button fills all fields — text inputs AND dropdowns — without any React desync (dropdowns must actually show the selected value AND have that value in React state, verified by submit + readback).
3. Submitting the form creates a row in `job_submissions` with every submitted field in the correct column (spot-check: `client_first_name`, `property_type`, `intended_use`, `valuation_premises`, `asset_condition`, `property_contact_*`, `notes`).
4. The submitted data appears correctly in the dashboard's Client Submission section (Section 1) when the job is opened.
5. Screenshot evidence exists for: blank form, filled form, and dashboard Client Section showing mapped data.

Known bugs above are tracked separately; their presence does NOT fail this phase unless they prevent the row from being created.

### TO-BUILD-PASS (the goal is shipped)

Everything in TODAY-PASS, PLUS the submit auto-triggers the chain (the full spec for these lives in [Phase 2](~/Development/APR-Dashboard-v3/tests/phase-sheets/PHASE-2-FORM-RECEIVED.md)):

1. Submitting the form auto-creates the ClickUp task (with submission data piped into custom fields), with no human action — `clickup_task_id` is already non-null on the row right after submit.
2. Submitting the form auto-sends the client a thank-you email, without blocking the success screen.

---

*Sources: `src/components/SubmissionForm.tsx`, `src/components/submission-form/ClientInformationSection.tsx`, `src/components/submission-form/PropertyInformationSection.tsx`, `src/components/submission-form/useFormSubmission.ts`, `src/integrations/supabase/types.ts`, `src/components/dashboard/JobDetailAccordion.tsx`, `tests/E2E-TEST-PRD-FULL-LOOP.md` (Run 3 — 2026-06-11), `tests/INTAKE-FORM-FIELDMAP-2026-06-03.md`, `tests/INTAKE-FORM-FIELDS-REFERENCE.md`, `docs/Features/04-Job & Client Mgt./session-notes/15-PLAYWRIGHT-TEST-BUTTONS.md`*

---

## 7. Verification Run — qa-agent + Ben, 2026-06-11 (live, local dev 8086)

**TODAY-PASS: ✅ MET — all 5 criteria, verified end-to-end (form → DB → dashboard).** Test job: William Jackson / Diamond Properties / Northgate Center (`job_submissions.id` e91a5cc1…, `source=webform`). Ben drove the form on his screen; qa-agent verified each field against the DB readback + the dashboard Section-1 render.

| DoD criterion | Result |
|---|---|
| 1. Form loads, all fields visible | ✓ — and the **public intake form has its own "Test Data" button** (open question resolved) |
| 2. Test Data fills text + dropdowns, no desync | ✓ — all 4 dropdowns set to VALID values (Multifamily / Insurance / Market Value / Very Good); confirmed real, not desynced, by submit + DB readback |
| 3. Submit → `job_submissions` row, every field correct column | ✓ — all 20 fields read back EXACT, incl. the **Authorized Use → `intended_use`** label-rename mapping |
| 4. Data displays in dashboard Client Section | ✓ — dashboard Section 1 shows every field + both uploaded files |
| 5. Evidence | Ben's blank-form / filled-form / dashboard captures; both attachments present in `job_files` (PDF + PNG) |

**Enhancement findings (UX/polish — do NOT fail the phase):**

1. **Job Reference = raw DB UUID.** The success popup surfaces `job_submissions.id` (e.g. `e91a5cc1-e85e-…`) as the client-facing "Job Reference." Convoluted; no VAL# exists yet at intake. **Enhance:** show a short, friendly intake reference instead of the database key.
2. **File-attach feedback is poor.** Drag-drop is glitchy and hard to confirm in dark mode (tiny text) — easy to think it failed. The upload DOES work (both files landed in `job_files`); the "it attached" signal needs to be obvious.
