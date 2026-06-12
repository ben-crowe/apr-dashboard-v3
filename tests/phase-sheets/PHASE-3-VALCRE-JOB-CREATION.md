---
title: "Phase 3 — Valcre Job Creation"
tags: [#APR, #testing, #phase-sheet, #full-loop, #valcre, #job-creation]
created: 2026-06-11
author: qa-agent
status: active
---

# Phase 3 — Valcre Job Creation

**[⬅ Back to Phase Sheets Dashboard](~/Development/APR-Dashboard-v3/tests/phase-sheets/00-PHASE-SHEETS-DASHBOARD.md)**

**What this sheet is:** the canonical reference for turning a submitted job into a real Valcre appraisal job — the step that stamps a VAL job number onto the record and creates the client/contact/property/job entities inside Valcre. Picks up where [Phase 2 — Form Received](~/Development/APR-Dashboard-v3/tests/phase-sheets/PHASE-2-FORM-RECEIVED.md) ends.

**How to read it:** every section leads with the **Goal** (what we want), then a **Current State** block right under it (what the code does today). Goal first, current state second.

---

## Index

1. The Goal — one button creates a clean Valcre job
2. The Two Paths — the good button vs the gap-ridden raw path
3. What gets created in Valcre (the 4-entity chain)
4. The field map — dashboard → Valcre Job
5. Known gaps & bugs
6. Test Protocol
7. Tools / CLIs for this phase
8. Definition of Done

---

## 1. The Goal — one button creates a clean Valcre job

**Goal:** the team opens a submitted job, clicks **"Create Valcre Job"**, and a complete, correctly-named Valcre job is created — property named properly (not "Unnamed Property"), fee populated (not $0), client + property contacts attached, property type/use/premises mapped to Valcre's enums. The VAL number is written back to our database, the button flips to "View in Valcre", and the ClickUp card updates with the VAL number.

**Current State:** the **button path works and is proven** — Run 3 created `VAL261057` cleanly. The mapping is solid when the data comes through that path. The known problems are downstream UI feedback (button doesn't flip) and the raw API path producing "Unnamed Property" / "$0 fee" when called without full LOE data. Details in Sections 2 + 5.

---

## 2. The Two Paths — the good button vs the gap-ridden raw path

There are two ways a Valcre job gets created. They call the SAME backend (`/api/valcre`) but build the payload differently — and that difference is the whole story.

### Path A — "Create Valcre Job" button (LoeQuoteSection) — THE GOOD PATH

**Goal:** this is the path the team should use. It reads BOTH the client-section data AND the LOE details (fee, scope, premises, report type), so Valcre gets a complete payload.

**Current State:** ✅ proven (VAL261057). Handler: `handleCreateValcreJob` in `LoeQuoteSection.tsx`. It assembles a full `valcreData` object — client name/email/phone, property name/address/type (parsed to array), intended use, asset condition, property contacts, AND the LOE fields (`appraisalFee`, `scopeOfWork`, `valuationPremises`, `reportType`, etc. from `jobDetails`). Falls back to `job.valuationPremises` (from the client section) if the LOE row doesn't have it. This is the rich payload that maps cleanly.

### Path B — "Send to Valcre" button (ValcreAction) — THE GAP-RIDDEN PATH

**Goal:** none — this path should be retired or fixed. It exists but is the wrong one.

**Current State:** ⚠️ self-flagged as broken. Handler: `handleSendToValcre` in `ValcreAction.tsx`. Its own source comment (lines 58–59) says: *"this component does NOT have access to jobDetails (LOE data). Use LoeQuoteSection's handleCreateValcreJob instead."* Because it can't see LOE data, it sends `appraisalFee: 0`, `reportType: ''`, `propertyRightsAppraised: ''`. That's where the "$0 fee" and missing-LOE gaps come from. When the raw `/api/valcre` create runs without a property name, it falls back to `"Unnamed Property"` (api/valcre.ts line 1081) — that's the "Unnamed" gap.

**The rule:** use Path A (the "Create Valcre Job" button in the LOE/Quote section). Path B ("Send to Valcre" in the actions strip) is the one that produces Unnamed/Fee0 and should not be the test path.

---

## 3. What gets created in Valcre (the 4-entity chain)

**Goal:** one click creates the full set of linked records inside Valcre so the job is workable: a Client, a Contact (and a separate Property Contact if different), a Property entity, and the Job itself — all wired together.

**Current State:** ✅ implemented in `/api/valcre`. The backend creates them in order:

1. **Client entity** — from client name/org/email/phone.
2. **Contact entity** — the client's contact person.
3. **Property Contact entity** — created separately ONLY if a distinct property contact was given; otherwise `PropertyContactId` is left null (deliberately — prevents duplicate contact display in Valcre).
4. **Property entity** — name, address (street/city/state/postal split), property type mapped to Valcre's enum, Types multi-select field, size/year if present.
5. **Job entity** — links all the above, sets the Job.Name, Fee, dates, requested values.

---

## 4. The field map — dashboard → Valcre Job

**Goal:** every dashboard field lands in the right Valcre field with the right format (Valcre is strict about enums).

**Current State:** ✅ mapped in `/api/valcre`. Key mappings:

| Dashboard field | Valcre field | Notes |
|---|---|---|
| Property Name | `Property.Name` | falls back to `"Unnamed Property"` if blank (the gap) |
| Job name (constructed) | `Job.Name` | format: `"{Property.Name}, {Street}, {City}, {State}"` (api/valcre.ts ~1415) |
| Property Address | `Property.AddressStreet/City/State/PostalCode` | address parsed into parts |
| Property Type | `Property.PropertyType` | single value, mapped to Valcre enum; invalid → "Building" |
| Property Type (multi) | `Property.Types` | PascalCase map: Multi-Family→MultiFamily, Healthcare→HealthCare, Self-Storage→SelfStorage |
| Appraisal Fee | `Job.Fee` | `parseDollarAmount(...) \|\| 0` — the "$0" gap when LOE fee missing |
| Authorized Use (intended use) | custom field (NOT native `Job.IntendedUses`) | moved off native field 2026-06-05 (D1 v3.1) — native write removed |
| Valuation Premises | `Job.RequestedValues` | via REQUESTED_VALUES_MAP |
| Property Rights Appraised | interest enum | "Fee Simple Interest"→"FeeSimple", etc. |
| Delivery Date | `Job.DueDate` | `.split("T")[0]` to date-only |
| Request / Signed / Effective dates | `Job.BidDate` / `AwardDate` / `EffectiveDate` | date-only |
| Client / contacts | Client + Contact entities | see Section 3 |

The VAL number comes back in the response; the button path writes it to `job_submissions.job_number` + `job_loe_details.valcre_job_id` so the Sync button and "View in Valcre" work.

---

## 5. Known gaps & bugs

**Goal:** zero of these — clean create, clear feedback, no duplicates.

**Current State (from Run 3 + source):**

**Gap 1 — "Unnamed Property" on the raw path.** If the create runs without a property name (Path B, or a job with a blank property name), Valcre gets `"Unnamed Property"` (api/valcre.ts line 1081). Fix: ensure the property name flows through; use Path A which always passes `job.propertyName`.

**Gap 2 — "$0 fee" on the raw path.** Path B sends `appraisalFee: 0` because it can't read LOE data. Use Path A, which reads `jobDetails.appraisalFee`.

**Bug 3 — button doesn't flip to "View in Valcre" (no success feedback).** The Valcre job IS created, but the post-create LOE-detail save fails on an empty-string date → Postgres error 22007 (invalid datetime format), which blocks the UI state update. Medium severity — job exists, user sees no confirmation.

**Bug 4 — ClickUp update "Failed to fetch" from dev origin.** After create, the ClickUp-update call fails with a CORS/edge-function origin error from `localhost:8086`. The Valcre job IS created; ClickUp just stays out of sync on dev-initiated creates.

**Bug 5 — double-click creates 2 jobs.** "Create Valcre Job" has no in-flight disabled state; double-clicking during the API call creates two Valcre jobs. Needs an in-flight guard. Requires manual Valcre cleanup when it happens.

---

## 6. Test Protocol

**Goal:** verify a clean create end-to-end via the good path.

**Current State / steps:**

1. Open a submitted job in the dashboard at `http://localhost:8086/dashboard/job/<job-id>`.
2. In the LOE/Quote section, optionally fill LOE fields (fee, scope) — or click "Fill with Test Data" + a Cascade Options version to populate them.
3. Click **"Create Valcre Job"** (Path A — the LOE/Quote section button, NOT the "Send to Valcre" action button).
4. Wait for the create to complete (single click — do NOT double-click, Bug 5).
5. Screenshot the result. Save to `~/Development/KM-Exp/data/screenshots/leg3-valcre-create.png`.
6. Verify in Valcre: the job exists with a real name (not "Unnamed Property"), fee populated (not $0), property type/use/premises mapped, client + contacts attached.
7. Verify the write-back: `job_submissions.job_number` and `job_loe_details.valcre_job_id` are set (re-run the Supabase curl from Phase 2 Section 2).
8. CLI: `~/.claude/scripts/apr/valcre-verify-job.sh <VAL-number>` to confirm the job from the Valcre side.

---

## 7. Tools / CLIs for this phase

> These markdowns double as a reminder of our capabilities + how we do the work. For Phase 3 specifically:

- **`/cli-apr-tools`** — the Valcre API toolkit: create job, read entities (Client / Contact / Property / Job), read CustomFields (`GetValues?entityId=X&type=6`), verify the 4-entity chain + the VAL number. Primary tool for this phase.
- **Supabase REST direct** — confirm the VAL number + `valcre_*` fields written back to the row after create (source `.env.local`, curl with `apikey` + `Bearer`).
- **`/cli-clickup-tools`** — verify the ClickUp card updated with the VAL number after create (Bug 4 surface — the dev-origin CORS failure).
- **`/cli-browser-auto` + `/agent-screenshot`** (`--session apr-iso`, port 8086) — drive the "Create Valcre Job" button (Path A), screenshot the button flip to "View in Valcre". Shadcn Select gotcha: click @ref to open, then `find text X click`. NOT `--cdp 9222` (KM-Exp).
- **`/guide-vercel-deploy`** — `api/valcre.ts` is a Vercel serverless function; field-map / fallback fixes need a deploy. Vite dev proxies `/api` to prod.

---

## 8. Definition of Done

### Today-PASS (the good path works)

1. Clicking "Create Valcre Job" (Path A) creates a Valcre job with a real property name, populated fee, mapped property type/use/premises, and attached client + contacts.
2. The VAL number is written back to `job_submissions.job_number` + `job_loe_details.valcre_job_id`.
3. Screenshot + `valcre-verify-job.sh` confirm the job exists correctly in Valcre.

Known bugs 3–5 are tracked separately; their presence does NOT fail the create itself (the job is created) — but they ARE the goal gaps below.

### Goal-PASS (clean + clear)

1. After create, the button flips to "View in Valcre" with visible success feedback (Bug 3 fixed — the 22007 empty-date save no longer blocks the UI update).
2. The ClickUp card reliably updates with the VAL number, including from dev origin (Bug 4 fixed).
3. Double-clicking "Create Valcre Job" creates exactly ONE job (Bug 5 fixed — in-flight disable).
4. The "Send to Valcre" gap-ridden path (Path B) is retired or fixed so there's one clean create path.

---

*Sources: `src/components/dashboard/job-details/LoeQuoteSection.tsx` (`handleCreateValcreJob`), `src/components/dashboard/job-details/actions/ValcreAction.tsx` (`handleSendToValcre` — the gap path), `src/utils/webhooks/valcre.ts` (`sendToValcre` payload builder), `api/valcre.ts` (4-entity create chain, Job.Name construction ~1415, Fee mapping ~1433, "Unnamed Property" fallback line 1081), `tests/E2E-TEST-PRD-FULL-LOOP.md` (Run 3 — VAL261057).*
