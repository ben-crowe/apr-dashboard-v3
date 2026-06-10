---
content_type: create-spec
title: Valcre Custom-Field Create-Spec — v3.1 master (45 fields)
status: SPEC — awaiting co-architect gate (do NOT create until confirmed)
owner: qa-agent (spec + build) · co-architect (gate)
created: 2026-06-05
source_of_truth: ~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/client-source/Valta-Master-Field-Registry-v3.1-2026-06-05.xlsx
method_basis: builds/valcre-custom-fields-spec.md (3/30) + VALCRE-CUSTOM-FIELDS-ADMIN-DEFINITIONS.md
related: [~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/Valcre-Integration/BRIEF-QA-create-valcre-custom-fields-2026-06-05.md]
---

# Valcre Custom-Field Create-Spec — v3.1 (45 fields)

## Creation mechanics (relearned from 3/30, live-confirmed today)
- **Endpoint:** `POST /api/v1/CustomFields`
- **Payload:** `FieldEntityType:"Job"`, `Name`, `ValueType`, `DisplayName`, `AvailableValues:[...]`,
  `Offices:[{OfficeId:802}]`, `Requirement:"None"`, `SearchCapabilities:"None"`, `CanImport:true`,
  `CanExport:true`, `IsHidden:false`. Tenant 596 / Office 802.
- **ValueType strings (live-verified today):** `String` (text) · `SingleOption` (select one) ·
  `MultiOption` (select multiple) · `Integer` (whole number) · `Boolean` (checkbox).
- **Set value:** `UpdateSelectFieldValue` (select) / `UpdateFieldValue` (string/int/bool).
- **Readback:** `GetValues?entityId=<id>&type=6`, resolve `SelectedValues[].AvailableValueId`
  against `AvailableValues[]`. HTTP 200 != success — readback every field.

## Live Valcre state (verified today)
- All 13 fields we built 3/30 (IDs 12042–12054) are **GONE** (Chris's cleanup) → full rebuild.
- Remaining custom fields (10, leave them): Lender×6, ValuationPremiseOne/Two, AppraisedValueOne/Two.
- These 10 are NOT in the 45 build list. The registry wants dedicated ValueScenario1–6 fields —
  do NOT reuse ValuationPremise for them (resolves the earlier "unconfirmed pairing").

---

## 🚩 GATE DECISIONS NEEDED (before any create)

**D1 — AuthorizedUse (the FLAG2 conflict).** v3.1 says custom `SingleOption`. But we shipped +
verified AuthorizedUse → native `Job.IntendedUses` today. Creating a custom AuthorizedUse means
re-pointing a working sync. **Recommend:** create the custom field for parity with the master BUT
leave the app on native until react-spec re-points in a controlled pass. Confirm.

**D2 — The 18 EA/HC narrative slots (EA/HCSummary1–6, EADetail1–6, HCDetail1–6).** Registry marks
them "Select one option" whose "options" are full narrative paragraphs (from EA-HC Text tab).
A select with 6 paragraph-length options is not populatable via sync. **Recommend (Picked):**
create these 18 as **`String`** (free text) — the loeCascade resolves the narrative and writes the
text in. This matches how react-spec already wired the §10 narratives. Confirm before I deviate
from the literal "Select one."

**D3 — Client typos in option VALUES (stored exactly as created).** Master contains: `Unkown`
(ListTenancy), trailing spaces on `Fee Simple ` and `Proposed - Improved Land (Demolition Required) `.
List-name typos (`Sate`/`Satus`) don't matter (label only). **Recommend:** create option values
EXACTLY as the master spells them (master = single authority), trimming only trailing spaces.
Flag `Unkown` for a yes/fix ruling — re-creating later is the expensive fix.

---

## The 45 — create table

### Select / checkbox / number fields (27)

| # | Field Name | ValueType | Options (exact, from Dropdown Lists tab) |
|---|---|---|---|
| 1 | Tenancy | SingleOption | Multi-Tenant · Owner Occupied · Partial Owner Occupied · Single-Tenant · Unkown · Vacant |
| 2 | StateofImprovements | SingleOption | Improved · Proposed · Vacant Land · Improved Development Land |
| 3 | StatusofImprovements | SingleOption | Improved - Completed · Improved - Renovated · Improved - Under Renovation · Improved - Proposed Renovation · Proposed - Vacant Land · Proposed - Improved Land (Demolition Required) · Proposed - Under Construction |
| 4 | CurrentUseImprovements | SingleOption | Vacant Land · Single Family · Multifamily · Retail · Industrial · Office |
| 5 | ProposedUseImprovements | SingleOption | Not Applicable · Single Family · Multifamily · Mixed Use · Retail · Industrial · Office |
| 6 | InterestAppraised | **MultiOption** | Fee Simple · Leased Fee Interest · Leasehold Estate · Going Concern |
| 7 | AuthorizedUse | SingleOption | First Mortgage Financing · Financial Reporting · Insurance · Internal Decision-Making · Acquisition-Disposition · Estate Planning · Litigation · GST  ⚠D1 |
| 8 | ValueScenarios | **MultiOption** | As Is Vacant Land · As If Vacant Land · As If Complete & Stabilized · As-Is · As Stabilized · As If Complete & Stabilized - Renovated · As If Complete - Rezoned · As If Complete - Serviced · As If Complete - Subdivided · Insurable Replacement Cost (10) |
| 9 | ApproachestoValue | **MultiOption** | Land Direct Comparison Approach · Cost Approach · Direct Comparison Approach · Income Approach |
| 10 | AssignmentType | SingleOption | Single Property · Multiple Properties |
| 11 | ReportType | SingleOption | Comprehensive · Concise · Form |
| 12 | DesktopReport | SingleOption | Yes · No |
| 13 | Valuetimeframe | SingleOption | Current · Prospective · Retrospective |
| 14 | DeliveryTime | **Integer** | (whole number — weeks) |
| 15 | Paid | **Boolean** | (checkbox) |
| 16 | ClientDocuments | **MultiOption** | Previous Appraisal · Property Details · Proforma · Unit Mix · Rent Roll · Historical Operating Expenses · Development Permit Drawings · Contact for Property Tour · Purchase & Sale Agreement · Environmental Reports · Property Condition Reports (11) |
| 17 | PreviouslyAppraised | SingleOption | Yes · No |
| 18 | TransactionStatus | **MultiOption** | Not Applicable · Listed · Under Contract  (note: v3.1 = multi; was single on 3/30) |
| 19 | ZoningStatus | SingleOption | In Place · To Be Rezoned |
| 20 | LandMetric | SingleOption | $/Unit · $/FAR · $/SF · $/Acre |
| 21 | CMHCFinancing | SingleOption | Yes · No |
| 22–27 | ValueScenario1 … ValueScenario6 | SingleOption | (each = the 10 ValueScenarios options above) |

### Narrative slots (18) — recommend String per D2

| # | Field Name | ValueType (recommended) |
|---|---|---|
| 28–33 | EA/HCSummary1 … EA/HCSummary6 | String (D2) |
| 34–39 | EADetail1 … EADetail6 | String (D2) |
| 40–45 | HCDetail1 … HCDetail6 | String (D2) |

---

## After-go plan (STEP 3–5, not now)
1. Create all 45, capturing each new Field ID + API key.
2. Write IDs/keys back into a dated copy of the master Field Registry (never overwrite original).
3. Re-point app sync per master; readback-verify per-field PASS/FAIL (Field-Sync playbook).
4. Name-match guard on VAL261101 (watch the 2nd "Westside Mall" decoy); never the Test Data button.

**STATUS: BUILT — all 45 created + readback-verified 2026-06-05 (co-architect GO; D1/D2/D3 confirmed).**

---

## BUILD RESULT — 45/45 created + verified (2026-06-05)

Method used: `POST /api/v1/CustomFields` (field) → `PATCH /api/v1/CustomFields(id)` with
`AvailableValues:[{"Value":...}]` (options — plain strings silently drop, gotcha) → GetValues readback.
Every option count matched want/got. IDs 12407–12451 (contiguous). Valcre addresses custom fields by
numeric Id — there is no separate string API key, so Field Key = the Id.

| Field | ID | Type | opts |
|---|---|---|---|
| StatusofImprovements | 12407 | SingleOption | 7 |
| Tenancy | 12408 | SingleOption | 6 (incl "Unkown" verbatim — D3) |
| StateofImprovements | 12409 | SingleOption | 4 |
| CurrentUseImprovements | 12410 | SingleOption | 6 |
| ProposedUseImprovements | 12411 | SingleOption | 7 |
| InterestAppraised | 12412 | MultiOption | 4 |
| AuthorizedUse | 12413 | SingleOption | 8 (app stays NATIVE — D1) |
| ValueScenarios | 12414 | MultiOption | 10 |
| ApproachestoValue | 12415 | MultiOption | 4 |
| AssignmentType | 12416 | SingleOption | 2 |
| ReportType | 12417 | SingleOption | 3 |
| DesktopReport | 12418 | SingleOption | 2 |
| Valuetimeframe | 12419 | SingleOption | 3 |
| DeliveryTime | 12420 | Integer | — |
| Paid | 12421 | Boolean | — |
| ClientDocuments | 12422 | MultiOption | 11 |
| PreviouslyAppraised | 12423 | SingleOption | 2 |
| TransactionStatus | 12424 | MultiOption | 3 |
| ZoningStatus | 12425 | SingleOption | 2 |
| LandMetric | 12426 | SingleOption | 4 |
| CMHCFinancing | 12427 | SingleOption | 2 |
| ValueScenario1–6 | 12428–12433 | SingleOption | 10 each |
| EA/HCSummary1–6 | 12434–12439 | String | — |
| EADetail1–6 | 12440–12445 | String | — |
| HCDetail1–6 | 12446–12451 | String | — |

Filled-back deliverable: `client-source/Valta-Master-Field-Registry-v3.1-2026-06-05-IDS-FILLED-2026-06-05.xlsx`
(original never overwritten). 'Unkown' flagged in the Tenancy row Description for client correction.

**NEXT (STEP 5 — react-spec, co-arch gate):** re-point the app sync to these custom-field IDs where the
master directs; readback-verify per-field PASS/FAIL on VAL261101. AuthorizedUse re-point is part of this
controlled pass (currently still native per D1).
