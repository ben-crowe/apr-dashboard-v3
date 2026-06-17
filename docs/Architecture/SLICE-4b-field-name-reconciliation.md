---
id: slice-4b-field-name-reconciliation
title: "SLICE-4b — Field-Name Reconciliation Gate (STEP 1, pre-build)"
created: 2026-06-17
type: reconciliation-gate
status: for-QA-review-gate → then Ben sign-off → then build
authority: "⛔ RE-BASELINED 2026-06-17 → docs/Features/08-Master-Field-Registry/BASELINE-v03-2026-06-09-authority.{json,md} (parsed from canonical client-reviewed 'Valta Master Field Registry v03 - reviewed 2026-06-09.xlsx', 67 fields). PRIOR April 'docs/valta share/Valta-field-v03.xlsx' is STALE-DO-NOT-CITE (missing 3 fields)."
owner: "ui-designer (author) · qa-agent (review-gate) · co-architect (spec) · Ben (sign-off)"
scope: "Section 1 (Client Submission) + Section 2 (LOE Quote Prep) only — pre-acceptance"
tags: [apr, v4, slice-4b, field-registry, reconciliation, four-file-sync, client-authority]
---

# SLICE-4b — Field-Name Reconciliation Gate

> **STEP 1 of Slice-4b. NOTHING builds until QA passes this gate + Ben signs off.** This table
> is the field-ID source of truth for the 13 missing-field adds AND for every existing
> Section-1/Section-2 field, V3 vs V4 side-by-side.

## 🔄 RE-BASELINE (2026-06-17) — authority moved April → JUNE-9; re-run results below

**Why:** the April `docs/valta share/Valta-field-v03.xlsx` was 2 months stale (missing 3 fields). KN-Mgr (dev-6)
flagged it; ui-designer re-parsed the canonical **June-9** workbook (`...reviewed 2026-06-09.xlsx`, 67 fields).
New authority artifacts: `docs/Features/08-Master-Field-Registry/BASELINE-v03-2026-06-09-authority.{json,md}`.
The April file now carries a `STALE-DO-NOT-CITE` sibling marker.

### Re-run delta vs June-9 (this is the NEW work — NOT yet built, routed to QA first)

**1. The 3 holds → now CLEAN BUILDS (June-9 has them with authority + option lists):**

| Client-requested ID | Label (June-9) | V3 current | V4 target (to create) | Dropdown (June-9) |
|---|---|---|---|---|
| `CurrentUseImprovements` | Current Use Improvements | `currentUse` | `current-use-improvements` | Vacant Land · Single Family · Multifamily · Retail · Industrial · Office |
| `ProposedUseImprovements` | Proposed Use Improvements | `proposedUse` | `proposed-use-improvements` | Not Applicable · Single Family · Multifamily · Mixed Use · Retail · Industrial · Office |
| `PreviouslyAppraised` | Previously Appraised | `previouslyAppraised` | `previously-appraised` | Yes · No |

**2. The 10 already-built+deployed fields RE-CHECKED vs June-9 — 8 PASS, 2 need OPTION+TEST-VALUE FIX:**

| Built field | June-9 verdict | Fix needed |
|---|---|---|
| status-of-improvements | ✅ options match June-9 | none |
| assignment-type | ✅ match | none |
| transaction-status | ✅ match | none |
| zoning-status | ✅ match (In Place · To Be Rezoned) | none |
| cmhc-financing | ✅ Yes/No | none |
| desktop-report | ✅ Yes/No | none |
| client-documents | ✅ match (11 docs) | none |
| delivery-time | ✅ number, no options | none |
| **state-of-improvements** | ❌ I shipped `[Existing, Proposed, Vacant Land]`; June-9 = `[Improved, Proposed, Vacant Land, Improved Development Land]` | re-option + change test value "Existing"→"Improved" |
| **land-metric** | ❌ I shipped `[Square Feet, Acres, Hectares]` (from V3 — WRONG); June-9 = `[$/Unit, $/FAR, $/SF, $/Acre]` (a $/value basis, not area units) | re-option + change test value "Square Feet"→"$/SF" |

> ⚑ My earlier flags #2 (state) and #3 (land-metric) RESOLVE here — but as **corrections**, not confirmations. The
> correct option sets are June-9's; neither April nor the V3 component values were right. These 2 deployed fields
> need an option fix in the same 4-file-sync (fieldRegistry options + TestDataSet value; template/EditPanel unchanged).

**3. The 9 align-to-client RENAMES re-checked vs June-9 — UNCHANGED, all 9 stand.** Every rename target keeps the
same client name in June-9 (ClientCompanyName, ClientOrganizationAddress, InterestAppraised, AuthorizedUse, Tenancy,
ValueScenarios, ApproachestoValue, Valuetimeframe, ReportType, Fee). No new rename discrepancies surfaced.
`ScopeOfWork` is still ABSENT from June-9 → still `no-client-authority` (ours).

**Re-baseline net (the delta to build AFTER QA gate):** 3 new fields + 2 option-fixes on already-built fields.
Everything else (8 built fields, 9 renames, holds) is unchanged. **Do NOT build the delta yet — QA gates this re-run first.**

---

## ✅ GATE RESULT (qa-agent, 2026-06-17) — CONDITIONAL PASS *(against the STALE April baseline — superseded by the June-9 re-run above; re-gate pending)*

Verified against source, not author's word.

- **PASS, proceeds now:** the **10 clean adds** (Part-A rows 1–10), the **hold-3** (rows 11–13 → Chris
  thread, 0 hits in spec), and **all authority name-calls**. QA confirmed all 13 V3-current ids exist
  in src, and confirmed `api/valcre.ts` custom-field map is keyed by INTAKE camelCase (not V4 kebab) —
  so a rename does NOT directly break the custom-field map.
- **GATED, do NOT ship until the rename spec folds in Findings 1+2 below:** the **9 align-to-client
  renames** (Part B). A rename is a multi-file re-point, NOT a one-file id swap — see the Rename
  Re-Point Protocol section.
- **Finding 3 (authority caveat) — CLOSED by ui-designer:** on the designated authority
  `Valta-field-v03.xlsx`, the company field name is literally `ClientCompanyName`; "Organization"
  appears only in the separate `ClientOrganizationAddress` field. The `client-organization →
  client-company-name` call is unambiguous on the authority file. (QA's "both appear" came from the
  `.md`, which is a conversion of a *different* source xlsx — `Valta-field-v03.xlsx` is Ben's
  designated authority and rules.)

## 🔒 RENAME RE-POINT PROTOCOL (QA Findings 1+2 — mandatory before ANY rename ships)

**FINDING 1 (CRITICAL): a rename is a multi-file RE-POINT, not a `fieldRegistry.ts` edit.** The
Slice-3 bridge (`useLoadJobIntoReport.ts`) feeds 9 rename targets BY fieldId — rename the id without
re-pointing the bridge → the feed writes to a dead id → **field goes EMPTY** (same failure as the
empty-duplicate trap, reached by rename). `workbookFieldMapping.ts` also maps Valcre `ValueType` →
`value-scenario` — rename breaks the Valcre workbook export too.

**Per-field re-point checklist — every renamed field must hit ALL of these, then QA verifies it STILL
FILLS from the bridge post-rename (not just that the id changed):**
1. `fieldRegistry.ts` — field `id` + `storeId`
2. `useLoadJobIntoReport.ts` — bridge `fieldId` feed (line refs: client-organization L139, client-address L143, report-type L202, property-rights L206, intended-use L210, value-scenario L228, approaches-applied L232, timeframe L236, impv-tenancy L241)
3. `workbookFieldMapping.ts` — `registryId` (where mapped, e.g. value-scenario)
4. `Report-MF-template.html` — `{{placeholder}}` token
5. EditPanel control binding
6. save hook / autosave keyed on the id

**FINDING 2 (HIGH): TWIN-ID.** `property-rights → interest-appraised` has **2 defs** in
`fieldRegistry.ts` (loe-prep home + exec/report home). Rename must hit BOTH or one home keeps the old
id. (`report-type` / `client-address` / `property-name` / `property-address` are also twinned —
relevant if touched later.) **Rename by sectionHome-scoped pair; assert def-count before/after; never
a bare-id global replace.**

## Authority rule (Ben, verbatim intent — refined 2026-06-17)

1. **The tie-breaker is the CLIENT'S (Chris's) requested field-ID NAME** — the `VALTA Field Name`
   column in `Valta-field-v03.xlsx`. Where V3 and V4 differ today, **the client's name breaks the
   tie** — we do NOT keep whichever was typed first. Valcre's own naming is **informational only**.
2. **Case-convention is NOT a mismatch.** The client writes PascalCase (`ClientFirstName`); V3 is
   camelCase (`clientFirstName`); V4 is kebab (`client-first-name`). Same name in three dresses =
   **MATCH**. A mismatch is a different *word/concept*, not a different case.
3. **EXCEPTION — structural/compound fields (address-in-parts, contact breakouts).** Where WE split
   one client field into parts the client didn't itemize, that is **we-own-structure** — flag and
   move on, NOT a mismatch.

### Verdict legend
- **MATCH** — V3 and V4 both carry the client's name (case-convention only). No action.
- **align-to-client** — V3 and/or V4 use a different word than the client's name → rename toward
  the client. The `Diverges` note says which side(s).
- **we-own-structure** — our breakout; client didn't itemize. No action, no mismatch.
- **no-client-authority** — field is NOT in Chris's registry; the client never named it. Authority
  can't break the tie → **Chris question required before naming**.

---

## PART A — The 13 missing-field adds (bucket-C DIRECT, off SEED-V4b)

All are **absent from V4** today (`fieldRegistry.ts` 0-hit), so the V4 target is a NEW id we get to
name correctly from the start. All collected in **V3 Section 2** (verified in source). Section-home
on add = **S2 (loe-prep)**.

| # | Client-requested ID (authority) | V3 current | V4 target (to create) | Verdict | Diverges / note |
|---|---|---|---|---|---|
| 1 | `StatusofImprovements` | `statusOfImprovements` (LoeQuoteSectionIndependent) | `status-of-improvements` | **MATCH** | cascade TRIGGER (direct user input, not derived) |
| 2 | `StateofImprovements` | `stateOfImprovements` (OrganizingDocsSection) | `state-of-improvements` | **MATCH** | also the S3→S2 move (Slice-4) |
| 3 | `AssignmentType` | `assignmentType` | `assignment-type` | **MATCH** | — |
| 4 | `TransactionStatus` | `transactionStatus` | `transaction-status` | **MATCH** | select-multiple |
| 5 | `ZoningStatus` | `zoningStatus` | `zoning-status` | **MATCH** | — |
| 6 | `CMHCFinancing` | `cmhcFinancing` | `cmhc-financing` | **MATCH** | ListYes/No |
| 7 | `LandMetric` | `landMetric` (OrganizingDocsSection) | `land-metric` | **MATCH** | client UI label = "Land $/Metric"; field name = `LandMetric` |
| 8 | `DesktopReport` | `desktopReport` | `desktop-report` | **MATCH** | ListYes/No |
| 9 | `ClientDocuments` | `clientDocuments` | `client-documents` | **MATCH** | select-multiple |
| 10 | `DeliveryTime` | `deliveryTime` | `delivery-time` | **MATCH** | whole number; client `App Location = No` but `Required = Yes` |
| 11 | `CurrentUseImprovements` | `currentUse` (LoeQuoteSectionIndependent) | **HOLD** | **no-client-authority** | ⚑ NOT in Chris's registry. SEED-coined name. V3 uses `currentUse`. Chris-Q before naming. |
| 12 | `ProposedUseImprovements` | `proposedUse` (LoeQuoteSectionIndependent) | **HOLD** | **no-client-authority** | ⚑ NOT in Chris's registry. SEED-coined. V3 uses `proposedUse`. Chris-Q. |
| 13 | `PreviouslyAppraised` | `previouslyAppraised` | **HOLD** | **no-client-authority** | ⚑ NOT in Chris's registry. V3 collects it; Chris never listed it. Chris-Q (keep or drop). |

**Part-A finding:** 10 of 13 have clean client authority → create in V4 with the kebab of the
client name, no ambiguity. **3 of 13 (#11–13) are NOT in Chris's registry** — the SEED named them
itself. These must NOT be built blind: either Chris confirms the name, or we build them as
`we-own-structure` under our V3 name. **Recommend: build the 10, hold the 3 for the Chris thread.**

---

## PART B — All existing Section-1 + Section-2 fields (V3 vs V4)

### Section 1 — Client's New Appraisal Submission Info

| Client-requested ID (authority) | V3 current | V4 target | Verdict | Diverges / note |
|---|---|---|---|---|
| `ClientFirstName` | `clientFirstName` | `client-first-name` | **MATCH** | — |
| `ClientLastName` | `clientLastName` | `client-last-name` | **MATCH** | — |
| `ClientTitle` | `clientTitle` | `client-title` | **MATCH** | ⚑ V4 field may not exist yet (bridge: missing-in-v4) — QA confirm |
| `ClientPhone` | `clientPhone` | `client-phone` | **MATCH** | — |
| `ClientEmail` | `clientEmail` | `client-email` | **MATCH** | — |
| `ClientCompanyName` | `clientOrganization` | `client-organization` | **align-to-client** | BOTH sides say "Organization"; client says "Company". Rename → `client-company-name`. |
| `ClientOrganizationAddress` | `clientAddress` | `client-address` | **align-to-client** | low priority — both omit "Organization". Address single-field (not broken out), so a name diff, not structure. |
| `PropertyName` | `propertyName` | `property-name` | **MATCH** | — |
| `PropertyAddress` | `propertyAddress` | `property-address` | **MATCH** | single field; if later split → we-own-structure |
| `PropertyType` | `propertyType` | `property-type` | **MATCH** | — |
| _(property/site contact)_ `—` | `propertyContactFirstName` | `contact-first-name` | **we-own-structure** | property/site contact breakout — NOT in client registry (client only itemizes the CLIENT person) |
| _(property/site contact)_ `—` | `propertyContactLastName` | `contact-last-name` | **we-own-structure** | same breakout |
| _(property/site contact)_ `—` | `propertyContactEmail` | `contact-email` | **we-own-structure** | same breakout |
| _(property/site contact)_ `—` | `propertyContactPhone` | `contact-phone` | **we-own-structure** | same breakout |

### Section 2 — LOE Quote Prep

| Client-requested ID (authority) | V3 current | V4 target | Verdict | Diverges / note |
|---|---|---|---|---|
| `JobNumber` | `jobNumber` | `job-number` | **MATCH** | — |
| `PropertySubtype` | `propertySubtype` | `property-subtype` | **MATCH** | — |
| `Tenancy` | `tenancy` | `impv-tenancy` | **align-to-client** | V4 prefixes `impv-`; client says `Tenancy`. V3 matches. Rename V4 → `tenancy`. |
| `InterestAppraised` | `propertyRightsAppraised` | `property-rights` | **align-to-client** | BOTH say "PropertyRights"; client says "InterestAppraised". Rename both → `interest-appraised`. |
| `AuthorizedUse` | `intendedUse` | `intended-use` | **align-to-client** | BOTH say "IntendedUse"; client says "AuthorizedUse". Rename both → `authorized-use`. |
| `ValueScenarios` | `valueScenarios` | `value-scenario` | **align-to-client** | V4 singular; client + V3 plural. Rename V4 → `value-scenarios` (minor). Field EXISTS (Slice-3) — re-point/rename, NOT add. |
| `ApproachestoValue` | `approachesToValue` | `approaches-applied` | **align-to-client** | V4 says "applied"; client says "ApproachestoValue". V3 matches. Rename V4 → `approaches-to-value`. EXISTS — rename, NOT add. |
| `Valuetimeframe` | `valueTimeframe` | `timeframe` | **align-to-client** | V4 drops "Value"; client + V3 keep it. Rename V4 → `value-timeframe`. EXISTS — rename, NOT add. |
| `ReportType` | `reportFormat` | `report-type` | **align-to-client** | V3 says "reportFormat"; client + V4 say "ReportType". Rename V3 → `reportType`. (V3 product-field `reportType` is a SEPARATE Bucket-4 Chris-Q.) |
| `Fee` | `appraisalFee` | `appraisal-fee` | **align-to-client** | low priority — both add "appraisal". Client says just `Fee`. Confirm rename vs leave (our name is clearer). |
| `InspectionDate` | _(no V3 input — Slice-4c)_ | `report-inspectiondate` | **align-to-client** | V4 → `inspection-date`. V3 has NO input (Slice-4c, parked). |
| `ScopeOfWork` | `scopeOfWork` | `scope-of-work` | **no-client-authority** | ⚑ NOT in Chris's registry. V3+V4 agree with each other. Confirm it's ours (likely derived/narrative). |

---

## Cross-cutting findings (for QA + Ben)

1. **The dominant divergence pattern is "V4 (and sometimes V3) used an internal synonym instead of
   the client's word":** `Organization`→Company, `PropertyRights`→InterestAppraised,
   `IntendedUse`→AuthorizedUse, `impv-tenancy`→Tenancy, `approaches-applied`→ApproachestoValue,
   `timeframe`→Valuetimeframe. **Per the authority rule, all rename toward the client.**

2. **3 fields are NOT in Chris's registry** (`CurrentUseImprovements`, `ProposedUseImprovements`,
   `PreviouslyAppraised`) — the SEED named them itself. **Authority can't break the tie. → Chris
   question** (keep + confirm name, or drop). Do NOT build these 3 in this slice.

3. **1 existing field has no client authority** (`ScopeOfWork`) — V3/V4 agree, likely our own
   narrative field. Confirm, then leave as-is (we-own).

4. **Out of scope (S3, not in this gate):** `LegalDescription` (V4 `report-legal`) — flagged only so
   QA knows it was seen and deliberately excluded (Section-3, post-acceptance).

5. **Rename-vs-add discipline:** `ValueScenarios` / `ApproachestoValue` / `Valuetimeframe` already
   EXIST in V4 (Slice-3) — any client-alignment is a **re-point/rename**, never a new add (adding
   alongside = empty-duplicate trap, headline acceptance fails).

---

## Recommended gate outcome (ui-designer)

- **Build now (10):** Part-A rows 1–10 — clean client authority, create in V4 as the client-name kebab.
- **Hold for Chris (3):** Part-A rows 11–13 — no client authority.
- **Rename pass (existing):** the 9 `align-to-client` rows in Part B — sequence with QA so renames
  don't break the Slice-3 bridge or the Valcre sync.
- **No action:** all `MATCH` + `we-own-structure` rows.

**QA review-gate asks:** (a) confirm each V3-current ID against source; (b) confirm the 3
no-authority fields belong in the Chris thread, not this build; (c) confirm the rename set won't
break the live Valcre field mapping (`api/valcre.ts`) before any rename ships.
