# PRD-A — Job-Prep → Valcre Field Verification

**Test job:** VAL261101 / Valcre Id 784140 — "Westside Mall, 2129 Broadway Court, Calgary, AB" (name-match guard passed before every write)
**Date:** 2026-06-03 · **Tester:** qa-agent (dev-2)
**Method:** direct PATCH / CustomFields write to live Valcre API → API readback → Valcre web-UI screenshot (logged in as chris.chornohos@valta.ca)

## Results

| # | Dashboard field | Valcre target | Valcre UI label | Wrote | Readback | Result |
|---|---|---|---|---|---|---|
| 1 | Request Date | `Job.BidDate` | Bid Date | 2026-03-15 | 2026-03-15 | ✅ PASS |
| 2 | Signed Date | `Job.AwardDate` | Awarded Date | 2026-03-20 | 2026-03-20 | ✅ PASS |
| 3 | Effective Date | `Job.EffectiveDate` | Date of Value | 2026-04-01 | 2026-04-01 | ✅ PASS |
| 4 | Desktop Report | CF 12050 (Boolean) | — | true | rejected | ❌ FAIL |

## Field #4 — FAIL detail (for react-spec)

Write to `POST /CustomFields/UpdateFieldValue {EntityId:784140, CustomFieldId:12050, Value:true}` failed:

- Boolean `true` → HTTP 400 `Cannot convert the literal 'True' to the expected type 'Edm.String'.`
- Retried as string `"Yes"` → HTTP 400 as well.
- `GetValues?entityId=784140&type=6` lists the live job custom-field set (Tenancy, StateOfImprovements, StatusOfImprovements, PropertySubtype, LandMetric, AssignmentType, ValueTimeframe, ApproachesToValue, TransactionStatus, ZoningStatus) — **no DesktopReport** (also absent: EnvironmentalAssessment, HeritageConservation).

**Root cause to reconcile:** `api/valcre.ts` configures `desktopReport: { type: "Boolean" }` → CF12050, but on the live tenant CF12050 either doesn't exist on the job entity or is String-typed. react-spec must confirm CF12050 was actually created on this tenant and its real type, then fix the config (string value, or correct field id) before re-test.

## Conflict targets (settled by react-spec re-mapping) — 6/6 PASS

All verified on VAL261101 via direct write → readback → Valcre UI screenshot.

| # | Dashboard field | Valcre target | Wrote | Readback | Result |
|---|---|---|---|---|---|
| C1 | Transaction Status | CF 12053 (SingleOption) | av 5989 | "Under Contract" | ✅ PASS |
| C2 | Zoning Status | CF 12054 (SingleOption) | av 5991 | "Legal Conforming" | ✅ PASS |
| C3 | Value Scenarios | CF 11563 ValPremise-1 | av 5128 | "As Is" | ✅ PASS |
| C3 | Value Scenarios | CF 11564 ValPremise-2 | av 5138 | "As Stabilized" | ✅ PASS |
| C4 | Property Rights | native `Job.Purposes` | FeeSimple | "Fee Simple Interest" (UI) | ✅ PASS |
| C5 | Report Format | native `Job.ReportFormat` | RestrictedAppraisal | "Restricted Appraisal Report" (UI) | ✅ PASS |
| C6 | Authorized Use | native `Job.IntendedUses` | FinancialReporting | "Financial Reporting" (UI) | ✅ PASS |

**GOTCHA banked:** Valcre `CustomFields/UpdateSelectFieldValue` returns **HTTP 200 even on internal failure** (the real status rides in the response body). Never trust the POST code — verify every custom-field write via `GetValues` readback. (Same trap as the boolean field #4: HTTP 200 wrapping a 400.)

**HELD for Ben (not verified — intent-ambiguous):** Assignment Type (CF12049 exists but concept clash), Job Status (native Status enum, may be LOE-only), Lead Appraiser (native OwnerId/Staff*Id, needs staff-ID lookup).
**B / no target (not verified):** CMHC, Purpose, Desktop Report — no Valcre field exists.

## Deploy gap (blocks the real wired-path test for ALL fields)

`POST https://apr-dashboard-v3.vercel.app/api/valcre {updateType:'loe_details', requestDate:...}` returned `updatedFields:[]` + Valcre 400 "Patch object can't be empty" — the new `requestDate→BidDate` map (`api/valcre.ts:464`) is **local-only, not deployed to Vercel**. Targets above are proven via direct PATCH; the dashboard→proxy→Valcre wired path can't be verified until react-spec runs `vercel --prod`.

## Evidence (screenshots)
- `~/Development/KM-Exp/data/screenshots/valcre-784140-field1-biddate.png` (#1)
- `~/Development/KM-Exp/data/screenshots/valcre-784140-field2-3-dates.png` (#2 + #3)
- `~/Development/KM-Exp/data/screenshots/valcre-784140-customfields.png` (C1–C3 custom selects)
- `~/Development/KM-Exp/data/screenshots/valcre-784140-natives.png` (C4–C6 native Report section)
