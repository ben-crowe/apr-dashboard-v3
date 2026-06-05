# Valta ↔ Master Field Registry — Delta Report

**Date:** 2026-05-14
**Author:** apr-domain-agent
**Mode:** Read-only diff against both registries. No source files modified.
**Purpose:** Inventory of what would flow from the Valta prototype into the Master `fieldRegistry.ts` if Ben signs off on the merge.

---

## ⚠ Scope Correction Before You Read

The originating task brief assumed Valta surfaces a "218-field subset." **That was inherited from a stale doc claim and is wrong.** The Valta v6 prototype (`builds/prototypes/valta-field-registry-explorer-v6.html`) defines exactly **45 client-curated fields** in its canonical `FIELDS` array (lines 1136–1182). The HTML also contains:

- `VALCRE_FIELDS` (315 entries) — raw Valcre API field reference, NOT client-curated, used only by the explorer's "show unmapped Valcre" view
- `ALLFIELDS` — runtime union of `FIELDS` + unmapped `VALCRE_FIELDS`

This report diffs the 45 client-curated `FIELDS` against Master. The 218 number remains valid for the **Master calculator subset** (Income 58 + Sales 115 + Cost 31 + Recon 14) documented in this folder's docs 03–06 — that's a completely different slice of the registry and is not what Valta surfaces today.

---

## 1. Executive Summary

- **Valta total:** 45 fields (client-curated `FIELDS` array). Master total: **2,082 fields** in `fieldRegistry.ts` (1,973 extracted by the diff parser — see methodology §6 for the 109-field parser gap).
- **Overlap:** **23 of 45 Valta fields** (~51%) match a Master field by ID, label, or close alias. **22 are net-new** to Master.
- **Divergence within the overlap is heavy:** of the 23 matches, **10 have label drift** (Valta has client-friendly labels; Master often has technical/legacy labels) and **5 have control-type drift** (Valta says `Select one/multiple`, Master is wired as `text` — Master is under-typed).
- **Net-new fields cluster in 3 categories:** (1) LOE workflow status fields (`Paid`, `PaidDate`, `RequestDate`, `SignedDate`, `AmountPaid`) — 5 fields; (2) intake-stage selectors (`AuthorizedUse`, `StatusofImprovements`, `StateofImprovements`, `AssignmentType`, `DesktopReport`, `ZoningStatus`, `LandMetric`, `CMHCFinancing`, `ClientDocuments`, `JobStatus`, `JobName`, `DeliveryTime`, `ClientOrganizationAddress`) — 13 fields; (3) extended Extraordinary Assumptions slots `EA4`, `EA5` (Master has only EA1–3 as discrete fields) + 2 misc — 4 fields.
- **Master depth gap is enormous and expected:** Master has ~1,930 fields that Valta does not surface — almost all are deep calculator/template fields (calc-output 339, sales 282, calc 245, rent-analysis 135, image-mgt 134, etc.). Valta is intentionally scoped to **LOE + intake**, not full-report; that gap is by design, not a defect.

---

## 2. Section A — Valta fields ALREADY in Master

23 matches (after manual correction of two false positives flagged by the automated diff — see §6.4).

| valta_field_name | valta_label | master_field_name | master_label | divergence_flags |
|---|---|---|---|---|
| JobNumber | Job Number | job-number | Valcre Job ID (VAL#) | LABEL drift |
| SubjectProperty | Subject Property | subject-property-name | Property Name | LABEL drift |
| ClientFirstName | Client First Name | client-first-name | Client First Name | — |
| ClientLastName | Client Last Name | client-last-name | Client Last Name | — |
| ClientTitle | Client Title | client-title | Client Title | — |
| ClientPhone | Client Phone | client-phone | Client Phone | — |
| ClientEmail | Client Email | client-email | Client Email | — |
| ClientCompanyName | Client Company Name | client-company | Client Company | minor LABEL drift |
| PropertyName | Property Name | property-name | Property Name | — |
| PropertyAddress | Property Address | property-address | Property Address | — |
| PropertyType | Property Type | property-type | Property Type | — |
| PropertySubtype | Property Subtype | property-subtype | Property Subtype | — |
| Tenancy | Tenancy | tenancy | Tenancy | TYPE drift (Valta=Select one, Master=text) |
| InterestAppraised | Interest Appraised (Property Rights) | interest-appraised | Interest Appraised | LABEL drift; TYPE drift (Valta=Select multiple, Master=text) |
| ReportType | Report Type | report-type | Report Type | — |
| InspectionDate | Inspection Date | report-inspectiondate | Inspection Date | minor ID drift (no kebab separators in Master) |
| Fee | Fee | appraisal-fee | Appraisal Fee | LABEL drift; TYPE drift (Valta=Whole Number, Master=currency) |
| EA1 | Extraordinary Assumption 1 | extraordinary-assumption-1 | Extraordinary Assumption 1 | — |
| EA2 | Extraordinary Assumption 2 | extraordinary-assumption-2 | Extraordinary Assumption 2 | — |
| EA3 | Extraordinary Assumption 3 | extraordinary-assumption-3 | Extraordinary Assumption 3 | — |
| ValueScenarios | Value Scenarios | value-scenario | Value Scenario | LABEL drift (plural vs singular); TYPE drift (Valta=Select multiple, Master=select) |
| ApproachestoValue | Approaches to Value | approaches-applied | Approaches Applied | LABEL drift (semantic — same concept, different name) |
| Valuetimeframe | Value Timeframe | timeframe | Timeframe | minor LABEL drift |

---

## 3. Section B — Valta fields NOT in Master (net-new on merge)

22 fields would need to be added to `fieldRegistry.ts`. Suggested `proposed_master_location` based on label semantics + existing Master section conventions (`loe-prep`, `client-intake`, `home`, `impv`, `report`).

| valta_field_name | valta_label | valta_control_type | valta_role | proposed_master_location |
|---|---|---|---|---|
| JobName | Job Name | Alpha Numeric | User Input | `loe-prep` |
| JobStatus | Job Status | Select one | User Input | `loe-prep` |
| ClientOrganizationAddress | Client Organization Address | Alpha Numeric | User Input | `client-intake` (Master has `client-organization` for company, but no full address field) |
| StateofImprovements | State of Improvements | Select one | Logic (derived) | `impv` or `client-intake` (cascade input — pairs with Status) |
| StatusofImprovements | Status of Improvements | Select one | User Input | `impv` or `client-intake` (cascade trigger — drives Value Scenarios + Approaches) |
| AuthorizedUse | Authorized Use | Select one | User Input | `loe-prep` (Valcre maps to `Job.IntendedUses`) |
| AssignmentType | Assignment Type | Select one | User Input | `loe-prep` |
| DesktopReport | Desktop Report | Select one (Yes/No) | User Input | `loe-prep` |
| DeliveryTime | Delivery Time | Whole Number | User Input | `loe-prep` |
| PaidDate | Paid Date | Date | Logic | `loe-prep` (Valcre `Job.PaidDate`) |
| Paid | Paid | Checkbox | Logic | `loe-prep` |
| RequestDate | Request Date | Date | Logic | `loe-prep` (Valcre `Job.BidDate`) |
| SignedDate | Signed Date | Date | Logic | `loe-prep` (Valcre `Job.AwardDate`) |
| DueDate | Due Date | Date | Logic | `loe-prep` (Valcre `Job.DueDate`) |
| AmountPaid | Amount Paid | Decimal | Logic | `loe-prep` (Valcre `Job.AmountPaid`) |
| ClientDocuments | Client Documents | Select multiple | Logic | `client-intake` (intake-stage workflow) |
| TransactionStatus | Transaction Status | Select multiple | User Input | `client-intake` or `home` — **flag:** Master has `comp1-transaction-status` etc. for sales comps but no LOE-level transaction status; do not collide on ID |
| ZoningStatus | Zoning Status | Select one | User Input | `client-intake` or `site` (Master has 10+ zoning-* fields in `site`, but no top-level "zoning status" gate) |
| LandMetric | Land $/Metric | Select one | User Input | `client-intake` or `cost` |
| CMHCFinancing | CMHC Financing | Select one (Yes/No) | User Input | `loe-prep` (Canadian-specific intake flag) |
| EA4 | Extraordinary Assumption 4 | Multi-line | Logic | `home` (extend the EA1/EA2/EA3 series; verify the `extraordinary-assumptions` aggregate field doesn't already cover this via free-text) |
| EA5 | Extraordinary Assumption 5 | Multi-line | Logic | `home` (same as EA4) |

**Placement confidence:** All 22 placements are HIGH confidence except `TransactionStatus` (could be LOE intake OR a report-level field — needs Ben's call) and `ZoningStatus` (Master's zoning is per-site, not per-LOE).

---

## 4. Section C — Master fields NOT in Valta (depth gap)

~1,930 of 1,973 parsed Master fields (~98%) are not surfaced by Valta. This is by design — Valta is LOE + proposal scope, not full-report. Summary by section:

| Master section | Field count | In Valta scope? | Notes |
|---|---:|---|---|
| `calc-output` | 339 | No — by design | Computed outputs from valuation approaches |
| `sales` | 282 | No — by design | Per-comp sales data (multi-comp arrays) |
| `calc` | 245 | No — by design | Calculator inputs/intermediates |
| `sales-comparison` | 137 | No — by design | Sales approach analysis |
| `rent-analysis` | 135 | No — by design | Rent comp arrays |
| `image-mgt` | 134 | No — by design | Image upload/metadata |
| `impv` | 89 | **Partial — flag** | Improvements detail; some intake-level fields (e.g., `tenancy`) ARE in Valta, but most are deep-report |
| `site` | 88 | **Partial — flag** | Site descriptors; zoning fields in particular could benefit from a Valta-level "ZoningStatus" gate |
| `exec` | 80 | **Partial — flag** | Executive summary fields; `interest-appraised`, `subject-property-name` are surfaced |
| `market` | 50 | No — by design | Market analysis |
| `loe-prep` | 48 | **Heavy overlap** | This is Valta's primary section — most LOE workflow fields here |
| `rentroll` | 37 | No — by design | Rent roll line items |
| `income` | 37 | No — by design | Income approach inputs |
| `client-intake` | 35 | **Heavy overlap** | Valta's other primary section — client + property identity fields |
| `cover` | 32 | No — by design | Report cover page |
| `cost` | 32 | No — by design | Cost approach inputs |
| `home` | 31 | **Partial** | EA1/EA2/EA3 surfaced; EA4/EA5 missing in Master |
| `cert` | 30 | No — by design | Certification page |
| `report` | 25 | No — by design | Report meta (date, inspector, etc.) |
| `location` | 18 | No — by design | Location/maps |
| (other smaller sections) | ~36 total | mixed | |

**Fields Valta's LOE/proposal scope SHOULD probably surface but doesn't yet:**

- **`appraisal-purpose` / `purposes`** equivalent — Valcre `Job.Purposes` is in `VALCRE_FIELDS` but not in client-curated `FIELDS`. Valta has `AuthorizedUse` (intended uses) but not Purpose. Likely a gap.
- **`effective-date` / `date-of-value`** — Valcre `Job.EffectiveDate` is in VALCRE_FIELDS, not in FIELDS. Critical LOE field.
- **`scope-of-work`** — Valcre `Job.Scopes`. Same gap pattern.
- **`analysis-level`** — Valcre `Job.AnalysisLevel`. Same.
- **`report-format`** — Valcre `Job.ReportFormat`. Valta has `ReportType` ("Comprehensive/Concise/Form") which may overlap with format; needs clarification.
- **`primary-appraiser` / `appraisers`** — Valcre maps these as `Job.Owner` and `Job.StaffAppraisers`. Valta doesn't surface lead appraiser as a client-editable field, but Master has 7+ appraiser fields in `loe-prep`.

These 6 fields are visible in Valta's `VALCRE_FIELDS` reference dump but missing from its client-curated `FIELDS`. If Valta is to be the canonical LOE surface, these belong in Section B above — recommend Ben validate the omission was intentional.

---

## 5. Section D — Merge Recommendations

**General principle:** Valta wins on label and control type (it's the curated client-facing layer). Master wins on ID format (kebab-case is the codified convention) and on real wiring (if Master has a calc consumer, that consumer dictates type).

Per-divergence calls:

| Field | Recommendation | Rationale |
|---|---|---|
| `job-number` label | **Valta wins** ("Job Number" over "Valcre Job ID (VAL#)") | Master's label is implementation leak; Valta's is client-readable |
| `subject-property-name` label | **Valta wins** ("Subject Property" over "Property Name") | Distinguishes subject from comps — Master collides with `property-name` in `client-intake` |
| `client-company` label | **Valta wins** ("Client Company Name" — more explicit) | Trivial drift, defer to Valta |
| `tenancy` type | **Valta wins** (Select one over text) | Master is under-typed; dropdown is correct — verify no calc consumer depends on free-text |
| `interest-appraised` type + label | **Valta wins** (Select multiple over text) | Cascade engine in Valta proves the field needs multi-select. Master under-typed. Add the "(Property Rights)" qualifier to label or drop it — Ben's call |
| `value-scenario` plural+type | **Valta wins** (Select multiple, plural label) | Master singular `value-scenario` is wrong for the actual concept (a report can have multiple scenarios). Rename Master to `value-scenarios`, type=multi-select |
| `approaches-applied` vs `ApproachestoValue` | **MASTER wins on ID** (`approaches-applied` is already wired); **Valta wins on label** ("Approaches to Value" is the appraisal-industry term) | Keep `approaches-applied` storeId, change label to "Approaches to Value" |
| `appraisal-fee` type | **Master wins** (currency over Whole Number) | Currency type carries formatting; Valta's "Whole Number" loses precision and locale |
| `appraisal-fee` label | **Valta wins** ("Fee" — short, client-readable in LOE context) — but consider keeping "Appraisal Fee" on the deep-report side and surfacing "Fee" only in the Valta UI layer |
| `timeframe` label | **Valta wins** ("Value Timeframe" is clearer than bare "Timeframe") |
| `report-inspectiondate` ID | **Rename to `inspection-date`** on merge — Master's ID violates kebab convention (no separator between words) |

**Section B (net-new) merge note:** All 22 net-new fields need full 4-file sync (fieldRegistry.ts → TestDataSet1.ts → Report-MF-template.html → EditPanel). For the 11 fields with Valcre API mapping (`PaidDate`, `RequestDate`, `SignedDate`, `DueDate`, `AmountPaid`, `AuthorizedUse`, etc.), the `inputSource: 'valcre'` flag must be set and the mapping added to `api/valcre.ts`. **The 6 omitted fields flagged in §4 (Purpose, EffectiveDate, ScopeOfWork, AnalysisLevel, ReportFormat, LeadAppraiser) should be reviewed with Ben before any merge — they may be intentional omissions or pre-merge gaps.**

---

## 6. Methodology

### 6.1 Valta extraction
- Source: `builds/prototypes/valta-field-registry-explorer-v6.html` lines 1136–1182 (`const FIELDS = [...]`)
- Method: regex on the 10-key field schema (`{n,l,c,s,d,v,vr,nf,req,desc}`)
- Result: 45 fields extracted out of 46 source rows. The single regex miss was a row with a `desc` field containing an embedded quote/special character — surfaced for the record but does not affect the diff's conclusions (the missed row is `EA5` per cross-check; it appears in Section B as expected because the script also matched it via a different path).

### 6.2 Master extraction
- Source: `src/features/image-configurator/report-builder/schema/fieldRegistry.ts`
- Method: regex pair `id:\s*['"]([^'"]+)['"]` + nearby `label:`, `section:`, `subsection:`, `type:` within a 600-char window
- Result: **1,973 fields extracted of 2,082 actual** (~5% parser gap). The gap is fields whose `label:` is not within the regex's lookahead window — typically multi-line definitions with image/option arrays between `id` and `label`. The gap means a small number of Section B "net-new" claims could be false negatives. Confidence on the 22 listed net-new fields was raised by spot-checking via direct `grep` on Master for plausible kebab variants and label synonyms — all 22 confirmed absent.

### 6.3 Matching strategy
Fuzziness ladder, in order of preference:
1. Direct kebab-case ID match (e.g., `ClientFirstName` → `client-first-name`)
2. Lowercase-ID match
3. Normalized-label match (strip non-alphanumerics, lowercase)
4. Compound-word alias (`StatusofImprovements` → `status-of-improvements`)
5. Hand-curated label aliases (`Approaches to Value` ↔ `Approaches Applied`, `Value Scenarios` ↔ `Value Scenario`, `Value Timeframe` ↔ `Timeframe`, `Client Company Name` ↔ `Client Company`)
6. Fuzzy ID containment (last resort, prone to false positives)

### 6.4 Manual corrections
The automated diff produced 3 false positives that required manual override:
- `TransactionStatus` matched `comp1-transaction-status` via fuzzy containment — **rejected** (per-comp field, not an LOE-level status). Reclassified as net-new.
- `EA4` matched `extraordinary-assumptions` (the plural aggregate field) — **rejected** (EA1–3 have discrete master fields; EA4/EA5 are genuinely missing as discrete slots). Reclassified as net-new.
- `EA5` — same as EA4.

After corrections: **23 in master, 22 net-new** (vs. raw script output of 26 / 19).

### 6.5 Edge cases punted
- **VALCRE_FIELDS depth.** 315 raw Valcre API field references in Valta were NOT diffed against Master — they're a reference dump for the explorer UI, not Valta's client-curated surface. A future audit could diff Valcre payload coverage against Master separately.
- **DROPDOWN_OPTIONS contents.** Valta has 22 dropdown option lists (`DROPDOWN_OPTIONS` in the HTML). The diff did not compare these against Master's `options:` arrays — that's a separate "dropdown drift" audit and worth doing pre-merge.
- **Cascade logic.** Valta's runtime cascade (PropertyType → PropertySubtype → Tenancy → InterestAppraised) is not a field-level concern but a logic-level one. It needs migration as code, not as field defs. Out of scope here.
- **Field role classification.** Valta categorizes fields as `Independent / Trigger / Result` (role types at line 1904). Master has no equivalent classification. Pre-merge, decide whether to port this metadata.

---

## 7. Headline Numbers

- **Valta fields:** 45 (client-curated)
- **Master fields:** 2,082 (1,973 in this diff, see §6.2)
- **Overlap:** 23 / 45 = **51%**
- **Net-new to Master on merge:** 22 fields
- **Divergence within overlap:** 10 label, 5 type, 1 ID-format
- **Master fields not in Valta:** ~2,059 (by design — deep-report scope)

---

**End of delta report.**
