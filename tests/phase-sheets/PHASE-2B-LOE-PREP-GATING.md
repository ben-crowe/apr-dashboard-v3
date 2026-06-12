---
tags: [#APR, #testing, #loe-prep, #gating, #valcre, #phase-sheet, #full-loop]
phase: 2B
title: LOE Prep + Gating Chain (Stage 2)
last_reconciled: 2026-06-11
---

# Phase 2B — LOE Prep + Gating Chain (Stage 2)

**[⬅ Back to Phase Sheets Dashboard](~/Development/APR-Dashboard-v3/tests/phase-sheets/00-PHASE-SHEETS-DASHBOARD.md)**

> **Where this sits:** AFTER the client form is received (Phase 2 — the row + dashboard job + ClickUp card exist) and BEFORE the LOE is sent for signature (Phase 5). This is the "LOE Quote" prep stage: the team fills the appraisal-prep fields, then a two-step gate fires — fill all prep fields → Create Valcre Job button activates → Valcre returns a job number → that activates the LOE/e-sign button. This sheet is the gating chain.

---

## Index

1. The goal — fill-the-prep → gate → gate → send
2. The LOE-prep fields — what gets filled (points to the canonical field map)
3. How an agent fills each prep field — CLI + the Fill Test Data button
4. The Cascade Options button — set Status, never hand-jam the derived fields
5. ⭐ Gate 1 — prep fields complete → "Create Valcre Job" activates (exact code condition)
6. ⭐ Gate 2 — Valcre job number exists → LOE / e-sign button activates (exact code condition)
7. The full chain in order
8. How to verify each gate fires (test protocol for this stage)
9. Tools / CLIs for this phase
10. Definition of done

---

## 1. The goal

**GOAL:** The team fills the LOE-prep fields once. The moment all required prep fields are present, the "Create Valcre Job" button turns on by itself — no half-empty Valcre job is possible. Creating the job returns a Valcre job number, and that number turning up is what unlocks the LOE / e-sign button. Two automatic gates, each guarding the next step, so the workflow can only move forward when the data behind it is complete.

**CURRENT STATE:** ✅ Both gates exist and work in code, verified by reading `LoeQuoteSection.tsx` + `ESignatureAction.tsx`. Gate 1 is a real `useMemo` guard on six fields. Gate 2 is a hard `if (!jobDetails.jobNumber) return null` — the e-sign button literally does not render until a job number exists. The chain is sound; the open question for THIS stage is purely whether the cascade-derived fields and the Valcre job-number write-back fire cleanly enough to flip each gate (Phase 3 covers the Valcre create itself).

---

## 2. The LOE-prep fields — what gets filled

**GOAL:** Capture the appraisal-prep data (fee, scope, premises, value scenarios, approaches, report type, dates, etc.) needed to create a clean Valcre job and render a correct LOE.

**CURRENT STATE:** ✅ The fields live in the LOE Quote section (`LoeQuoteSection.tsx`) + Section 4 (property/financial). Do NOT re-type the field table here — it's already canonical in the field-map docs. Source of truth, in priority order:

- **`docs/Features/08-Master-Field-Registry/FIELD-DATA-MAP-where-everything-lives.md`** — the master "where every field lives" map (DB column ↔ dashboard field ↔ Valcre target).
- **`docs/Features/08-Master-Field-Registry/JOB-PREP-FIELDS-MAP-2026-06-03.md`** — the prep-stage field map specifically (this stage).
- **`docs/DASHBOARD-FIELD-CATALOG.md`** — the dashboard field catalog (every field, type, source).

The SIX fields that actually gate Gate 1 (everything else is optional-for-create) — see Section 5 for why these six:

- Property Address — `job.propertyAddress`
- Property Type — `job.propertyType` (comma-separated string)
- Authorized Use — `job.intendedUse`
- Appraisal Fee — `jobDetails.appraisalFee`
- Scope of Work — `jobDetails.scopeOfWork`
- Valuation Premises — `jobDetails.valuationPremises`

---

## 3. How an agent fills each prep field

**GOAL:** An agent (or the client/team) populates the prep fields without hand-typing every one — fast, repeatable, test-friendly.

**CURRENT STATE:** ✅ Three fill paths, all proven:

- **Fill Test Data button (the fast path).** Each section has its own fill button — they do NOT depend on Stage 1 having been filled by hand (the client already submitted Stage 1, which landed the `job_submissions` row; these buttons fill the STAGE-2 prep fields on top of that existing row). The buttons:
  - **LOE Quote section** — `fillTestData()` in `LoeQuoteSectionIndependent.tsx`: fills reportType (Full Narrative), appraisalFee (5000), disbursementPercentage, retainerAmount, AND — important — `jobNumber: CAL-<digits>` + `valcreJobId` + `lastValcreSync`. ⚠️ Note: this particular test-fill SHORT-CIRCUITS Gate 2 by stuffing a fake `jobNumber` — handy for testing the e-sign button in isolation, but it is NOT the real create-Valcre path. For a true end-to-end gate test, fill prep fields WITHOUT this jobNumber shortcut and let the real Valcre create write the number back.
  - **Section 4** — `fillTestData()` in `Section4CompactIndependent.tsx`: property/financial fields.
  - **Client Submission** — `fillClientTestData()` in `ClientSubmissionSectionClean.tsx`: the Stage-1 client fields (name, property, etc.).
- **Agent CLI fill (the ground-truth path).** Fields auto-save on blur via Supabase upsert (no Save button). An agent writes the prep fields directly to the row via Supabase REST (source `.env.local`, curl with `apikey` + `Bearer`) OR drives the actual inputs with `agent-browser` real-keystroke fill (`/agent-fill-fields` Method 1) + tab-out to trigger the blur-save. Verify by reading the `job_property_info` / `job_loe_details` rows back.
- **The Cascade Options button (for the derived fields).** Do NOT hand-fill Value Scenarios / Approaches — they are DERIVED. See Section 4.

---

## 4. The Cascade Options button — set Status, never hand-jam derived fields

**GOAL:** One pick sets the Status of Improvements, and the system auto-derives Value Scenarios + Approaches to Value + (for some versions) Property Rights / Scope / Valuation Premises. The agent never types the derived fields by hand — that's the whole point of the cascade.

**CURRENT STATE:** ✅ Working. The mechanism (`handleCascadeVersion` in `LoeQuoteSection.tsx`):

- The picker offers four canonical versions. Picking one sets `statusOfImprovements` (+ per-version overrides) and flips `cascadePicked = true`, which LOCKS the Value Scenarios display to the derived result (read-only after a cascade pick).
- **V1 — Completed:** `statusOfImprovements = 'Improved - Completed'`.
- **V2 — Under Renovation:** `statusOfImprovements = 'Improved - Under Renovation'`.
- **V3 — Demolition/Land:** sets `statusOfImprovements = 'Proposed - Improved Land (Demolition Required)'` + `propertyRightsAppraised = 'Fee Simple Interest'` + `scopeOfWork = 'Direct Comparison Approach'` + `assetCondition = 'Poor'`.
- **V4 — Insurance:** sets `statusOfImprovements = 'Improved - Completed'` + `authorizedUse = 'Insurance'` + `valuationPremises = 'Insurable Value'` + `scopeOfWork = 'Cost Approach'` + `propertyRightsAppraised = 'Fee Simple Interest'`.
- After the pick, two cascade `useEffect`s fire (Part C + Part D): they call `deriveValueScenarios(status, authorizedUse)` and `deriveApproaches(...)` from `loeCascade.ts`, write the results to `jobDetails.valueScenarios` / `approachesToValue`, and `autoSaveField` persists them. Both have loop guards (skip if unchanged).
- **Scoped Clear** (`__CLEAR__`): resets ONLY the cascade fields (status + scenarios + approaches), leaves everything else.

**So the fill recipe is:** fill the plain prep fields (fee, address, etc.) + pick a Cascade version for the status-derived ones. There is NO single "fill everything but the cascade" button — the cascade is its own deliberate pick, by design, because hand-jamming derived fields produces an inconsistent LOE.

---

## 5. ⭐ Gate 1 — prep fields complete → "Create Valcre Job" activates

**GOAL:** The "Create Valcre Job" button stays OFF until every field a clean Valcre job needs is present, so the team can't fire a half-empty job.

**CURRENT STATE:** ✅ Confirmed in code — `LoeQuoteSection.tsx`, the `canCreateValcreJob` `useMemo`. The EXACT enable condition (all six must be truthy):

```
canCreateValcreJob =
  job.propertyAddress
  && (job.propertyType && job.propertyType.trim())   // "hasPropertyType"
  && job.intendedUse                                  // Authorized Use
  && jobDetails.appraisalFee
  && jobDetails.scopeOfWork
  && jobDetails.valuationPremises
```

- While `canCreateValcreJob` is FALSE → the button renders DISABLED with a tooltip listing the missing fields (`getMissingFieldsForValcre` builds that list with the same six checks) + the hint *"Use Fill Test Data button above to quickly populate fields."*
- When it flips TRUE → the real **"Create Valcre Job"** button renders, `onClick={handleCreateValcreJob}` (disabled only while `isCreatingJob`).
- Belt-and-suspenders: `handleCreateValcreJob` itself early-returns `if (!job || !canCreateValcreJob) return;` — so even a forced click can't fire a half-empty job.

**Found the exact enable-condition code: YES** — `canCreateValcreJob` useMemo, six-field AND.

---

## 6. ⭐ Gate 2 — Valcre job number exists → LOE / e-sign button activates

**GOAL:** The LOE / e-sign button stays OFF until a real Valcre job number exists, so you can never send an LOE for a job that isn't in Valcre yet.

**CURRENT STATE:** ✅ Confirmed in code — `actions/ESignatureAction.tsx`. The gate is a hard render guard:

```
if (!jobDetails.jobNumber) {
  return null;          // button does not render at all until a job number exists
}
```

- After Gate 1 fires and `handleCreateValcreJob` succeeds, the returned VAL number is written back to `job_loe_details` (`job_number` / `jobNumber`) — THAT write-back is what populates `jobDetails.jobNumber` and makes the e-sign button appear.
- Once it renders, a SECONDARY disable applies: `isDisabled = alreadySent || !validation.isValid || isSending || isGenerating` — where `validation` = `validateRequiredFields(job, jobDetails)` (client first/last/email + property address, from `docuseal.ts`). So even with a job number, missing client basics keep it disabled (with a tooltip listing them).
- The button label is **"Preview & Send LOE"** (the Phase 5 trigger).
- ⚠️ Mount note: `ESignatureAction` was MOVED into the LOE Quote section workflow (`JobDetailActions.tsx` carries the comment *"ESignatureAction removed — moved to LOE Quote section for better workflow"*). So both gates live in the same LOE Quote area — fill → Create Valcre → number appears → e-sign button appears, all in one place.

**Found the exact enable-condition code: YES** — `if (!jobDetails.jobNumber) return null` (primary gate) + the `isDisabled` validation (secondary).

---

## 7. The full chain in order

1. Client submitted Stage 1 (Phase 2) → `job_submissions` row + dashboard job exist.
2. Team opens the job → LOE Quote section.
3. Fill the prep fields (Section 3) + pick a Cascade version (Section 4).
4. **Gate 1 flips:** all six required fields present → "Create Valcre Job" button activates.
5. Click it → Valcre create chain runs (Phase 3) → VAL number returns → written back to `job_loe_details`.
6. **Gate 2 flips:** `jobDetails.jobNumber` now set → "Preview & Send LOE" button appears (and enables once client basics validate).
7. Press the LOE button → Phase 5 (send + e-sign).

---

## 8. How to verify each gate fires (test protocol)

**Gate 1 — fields → Valcre-active:**
- Start from a job missing ≥1 of the six fields → confirm the button is DISABLED + the tooltip lists exactly the missing ones (cross-check against `getMissingFieldsForValcre`).
- Fill the missing field(s) — via CLI write + blur, or the section Fill Test Data button, + a Cascade pick for the status-derived ones.
- Re-check: button flips to the ENABLED "Create Valcre Job". Verify visually (`agent-browser --session apr-iso` screenshot of the button before/after) AND in state (read the row — all six columns populated).
- Negative test: with one field still blank, force-click → nothing fires (the `!canCreateValcreJob` early-return holds).

**Gate 2 — job-number → LOE-active:**
- Before create: confirm the e-sign button is ABSENT (not just disabled — it returns null). Screenshot shows no "Preview & Send LOE" button.
- Run the real Create Valcre Job (Phase 3, NOT the fake-jobNumber test-fill shortcut from Section 3) → VAL number written back.
- After write-back: confirm "Preview & Send LOE" now RENDERS. Screenshot before/after. Cross-check `job_loe_details.job_number` is non-null via Supabase REST.
- Secondary: with the button rendered but a client field blank, confirm it's DISABLED with the missing-fields tooltip; fill the client basics → it enables.

**Evidence rule (this stage):** a gate verdict needs BOTH the state read (the row fields) AND the pixel (button enabled/disabled/absent) — the button state is the user's reality; the row is the cause. Real clicks + real keystrokes only (`/agent-click` + `/agent-fill-fields` Method 1) — JS-dispatch fills silently fail React controlled inputs and would false-PASS the gate.

---

## 9. Tools / CLIs for this phase

> These markdowns double as a reminder of our capabilities + how we do the work. For Phase 2B:

- **`/cli-browser-auto` + `/agent-fill-fields` + `/agent-click` + `/agent-screenshot`** (`--session apr-iso`, port 8086) — drive the prep-field fills with REAL keystrokes (Method 1 — React controlled inputs reject JS-dispatch), pick the Cascade option, screenshot each gate's before/after button state. NOT `--cdp 9222` (that's KM-Exp).
- **`/cli-apr-tools` + Supabase REST direct** — write prep fields straight to the row + read back `job_property_info` / `job_loe_details` to confirm the six gate-fields are populated and the VAL number landed (source `.env.local`, curl with `apikey` + `Bearer`). Reads/writes work; DDL needs service_role.
- **`/guide-vercel-deploy`** — gating logic lives in client components (`LoeQuoteSection.tsx`, `ESignatureAction.tsx`); changes need a deploy. Vite dev proxies `/api` to prod.
- **The canonical field-map docs (Section 2)** — the source for WHAT each prep field is + where it lives; don't re-derive.

---

## 10. Definition of done

**Today-PASS (the gating chain works as built):**
- Gate 1: with any of the six fields missing → "Create Valcre Job" is disabled + tooltip names the missing field(s). With all six present → it enables. Verified by row-read + screenshot.
- Gate 2: with no `jobDetails.jobNumber` → no "Preview & Send LOE" button. After a real Valcre create writes the VAL number back → the button appears (and enables once client basics validate). Verified by row-read + screenshot.
- Cascade: picking a version sets the Status and the derived Value Scenarios / Approaches populate automatically (no hand-typing), locked read-only after the pick.

**Goal-PASS (clean + clear):**
- All Today-PASS, PLUS:
- The LOE-section Fill-Test-Data shortcut that stuffs a fake `jobNumber` is either removed or clearly separated from the real create path, so a tester can't accidentally skip Gate 2.
- The six gate-fields + the cascade-derived fields are the single agreed required-set, reconciled with the canonical field map (no drift between `canCreateValcreJob` and the field-map docs).
