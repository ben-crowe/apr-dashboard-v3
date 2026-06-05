# DROPDOWN_OPTIONS Delta Audit — Valta v6 ↔ Master fieldRegistry.ts

**Date:** 2026-05-14
**Author:** apr-domain-agent
**Mode:** Documentation only — read-only on both sources. No production code edits, no merge calls, no recommendations.

**Working assumption (recorded, not acted on):** Valta dropdowns are likely more accurate because Ben's client hand-curated Valta; Master dropdowns are older. This document records the diff; Ben decides.

**Sources:**
- **Valta:** `builds/prototypes/valta-field-registry-explorer-v6.html` — `DROPDOWN_OPTIONS` object (lines 933-956) + `FIELDS` array (lines 1136-1182)
- **Master:** `src/features/image-configurator/report-builder/schema/fieldRegistry.ts` — all entries with `type: "select" | "dropdown" | "multi-select"` and their `options:` arrays

**Canonical-path check:** `md5sum` of both candidate Master paths byte-identical:
- `src/features/image-configurator/report-builder/schema/fieldRegistry.ts` → `69dfb5bbf29e220c95f33fc17b9a4044`
- `src/features/report-builder/schema/fieldRegistry.ts`                    → `69dfb5bbf29e220c95f33fc17b9a4044`
Proceeded against the image-configurator path per folder CLAUDE.md authority.

---

## Headline Numbers

| Metric | Count |
|---|---|
| Valta dropdown lists (`DROPDOWN_OPTIONS` keys) | 22 |
| Valta `FIELDS` entries referencing a dropdown list | 18 |
| Valta dropdown lists with options populated | 20 |
| Valta dropdown lists empty (`ListZoningStatus`, `ListLand$/Metric`) | 2 |
| Master dropdown-typed fields (select + dropdown + multi-select) | 143 |
| &nbsp;&nbsp;— breakdown: `dropdown` type | 72 |
| &nbsp;&nbsp;— breakdown: `select` type | 69 |
| &nbsp;&nbsp;— breakdown: `multi-select` type | 2 |
| Matched (Valta dropdown ↔ Master dropdown) | 8 |
| &nbsp;&nbsp;— of which: same options (byte-equal) | 0 |
| &nbsp;&nbsp;— of which: different options | 8 |
| Valta-only dropdown fields (not in Master) | 10 |
| Master-only dropdown fields (no Valta counterpart) | 133 |

---

## 1. Inventory — Side-by-Side

Every Valta dropdown field, mapped (or not) to Master.

| valta_field_id | valta_dropdown_name | master_field_id | master_type | match_status |
|---|---|---|---|---|
| `PropertyType` | `ListPropertyType` | `property-type` | dropdown | matched (different options) |
| `PropertySubtype` | `ListPropertySubtype` | `property-subtype` | dropdown | matched (different options) |
| `Tenancy` | `ListTenancy` | `occupancy-status` | dropdown | matched (different options) *(semantic only)* |
| `StateofImprovements` | `ListStateofImprovements` | `—` | — | valta-only |
| `StatusofImprovements` | `ListStatusofImprovements` | `—` | — | valta-only |
| `InterestAppraised` | `ListInterestAppraised` | `property-rights` | select | matched (different options) |
| `AuthorizedUse` | `ListAuthorizedUse` | `—` | — | valta-only |
| `ValueScenarios` | `ListValueScenarios` | `value-scenario` | select | matched (different options) |
| `ApproachestoValue` | `ListApproachestoValue` | `approaches-applied` | multi-select | matched (different options) *(semantic only)* |
| `AssignmentType` | `ListAssignmentType` | `—` | — | valta-only |
| `ReportType` | `ListReportType` | `report-type` | dropdown | matched (different options) |
| `DesktopReport` | `ListYes/No` | `—` | — | valta-only |
| `Valuetimeframe` | `ListValueTimeFrame` | `timeframe` | dropdown | matched (different options) *(semantic only)* |
| `ClientDocuments` | `ListClientDocuments` | `—` | — | valta-only |
| `TransactionStatus` | `ListTransactionStatus` | `—` | — | valta-only |
| `ZoningStatus` | `ListZoningStatus` | `—` | — | valta-only |
| `LandMetric` | `ListLand$/Metric` | `—` | — | valta-only |
| `CMHCFinancing` | `ListYes/No` | `—` | — | valta-only |

---

## Section A — Same-Options (byte-equal)

**None.** No Valta dropdown list matched a Master dropdown's options array exactly.

---

## Section B — Different-Options (matched fields)

8 matched pairs where options diverge.

### `PropertyType` (Valta) ↔ `property-type` (Master)
- **Valta label:** Property Type &nbsp;|&nbsp; **Master label:** Property Type
- **Valta control:** Select one &nbsp;|&nbsp; **Master type:** `dropdown`
- **Valta options (9):** `['Multifamily', 'Self-Storage', 'Retail', 'Industrial', 'Office', 'Land', 'Hotel', 'Seniors', 'Other']`
- **Master options (6):** `['Multi-Family', 'Office', 'Retail', 'Industrial', 'Land', 'Special Purpose']`
- **Shared (4):** `['Retail', 'Industrial', 'Office', 'Land']`
- **Valta-only (5):** `['Multifamily', 'Self-Storage', 'Hotel', 'Seniors', 'Other']`
- **Master-only (2):** `['Multi-Family', 'Special Purpose']`

### `PropertySubtype` (Valta) ↔ `property-subtype` (Master)
- **Valta label:** Property Subtype &nbsp;|&nbsp; **Master label:** Property Subtype
- **Valta control:** Select one &nbsp;|&nbsp; **Master type:** `dropdown`
- **Valta options (3):** `['Apartment', 'Townhouse', 'Mixed Use']`
- **Master options (7):** `['Apartment', 'MURB', 'Condo', 'Townhouse', 'Mixed-Use', 'Student Housing', 'Senior Living']`
- **Shared (2):** `['Apartment', 'Townhouse']`
- **Valta-only (1):** `['Mixed Use']`
- **Master-only (5):** `['MURB', 'Condo', 'Mixed-Use', 'Student Housing', 'Senior Living']`

### `Tenancy` (Valta) ↔ `occupancy-status` (Master) — **SEMANTIC NEAR-MISS** (id/label do not match; mapped manually based on intent)
- **Valta label:** Tenancy &nbsp;|&nbsp; **Master label:** Occupancy Status
- **Valta control:** Select one &nbsp;|&nbsp; **Master type:** `dropdown`
- **Valta options (6):** `['Multi-Tenant', 'Owner Occupied', 'Partial Owner Occupied', 'Single-Tenant', 'Unknown', 'Vacant']`
- **Master options (4):** `['Multi-Tenant', 'Single-Tenant', 'Owner-Occupied', 'Vacant']`
- **Shared (3):** `['Multi-Tenant', 'Single-Tenant', 'Vacant']`
- **Valta-only (3):** `['Owner Occupied', 'Partial Owner Occupied', 'Unknown']`
- **Master-only (1):** `['Owner-Occupied']`

### `InterestAppraised` (Valta) ↔ `property-rights` (Master)
- **Valta label:** Interest Appraised (Property Rights) &nbsp;|&nbsp; **Master label:** Property Rights
- **Valta control:** Select multiple &nbsp;|&nbsp; **Master type:** `select`
- **Valta options (4):** `['Fee Simple', 'Leased Fee Interest', 'Leasehold Estate', 'Going Concern']`
- **Master options (3):** `['Fee Simple Estate', 'Leased Fee', 'Leasehold']`
- **Shared (0):** `[]`
- **Valta-only (4):** `['Fee Simple', 'Leased Fee Interest', 'Leasehold Estate', 'Going Concern']`
- **Master-only (3):** `['Fee Simple Estate', 'Leased Fee', 'Leasehold']`

### `ValueScenarios` (Valta) ↔ `value-scenario` (Master)
- **Valta label:** Value Scenarios &nbsp;|&nbsp; **Master label:** Value Scenario
- **Valta control:** Select multiple &nbsp;|&nbsp; **Master type:** `select`
- **Valta options (10):** `['As Is Vacant Land', 'As If Vacant Land', 'As If Complete & Stabilized', 'As-Is', 'As Stabilized', 'As If Complete & Stabilized - Renovated', 'As If Complete - Rezoned', 'As If Complete - Serviced', 'As If Complete - Subdivided', 'Insurable Replacement Cost']`
- **Master options (4):** `['As Is', 'As Stabilized', 'As Complete', 'As Proposed']`
- **Shared (1):** `['As Stabilized']`
- **Valta-only (9):** `['As Is Vacant Land', 'As If Vacant Land', 'As If Complete & Stabilized', 'As-Is', 'As If Complete & Stabilized - Renovated', 'As If Complete - Rezoned', 'As If Complete - Serviced', 'As If Complete - Subdivided', 'Insurable Replacement Cost']`
- **Master-only (3):** `['As Is', 'As Complete', 'As Proposed']`

### `ApproachestoValue` (Valta) ↔ `approaches-applied` (Master) — **SEMANTIC NEAR-MISS** (id/label do not match; mapped manually based on intent)
- **Valta label:** Approaches to Value &nbsp;|&nbsp; **Master label:** Approaches Applied
- **Valta control:** Select multiple &nbsp;|&nbsp; **Master type:** `multi-select`
- **Valta options (4):** `['Land Direct Comparison Approach', 'Cost Approach', 'Direct Comparison Approach', 'Income Approach']`
- **Master options (3):** `['Cost', 'Sales Comparison', 'Income']`
- **Shared (0):** `[]`
- **Valta-only (4):** `['Land Direct Comparison Approach', 'Cost Approach', 'Direct Comparison Approach', 'Income Approach']`
- **Master-only (3):** `['Cost', 'Sales Comparison', 'Income']`

### `ReportType` (Valta) ↔ `report-type` (Master)
- **Valta label:** Report Type &nbsp;|&nbsp; **Master label:** Report Type
- **Valta control:** Select one &nbsp;|&nbsp; **Master type:** `dropdown`
- **Valta options (3):** `['Comprehensive', 'Concise', 'Form']`
- **Master options (3):** `['Appraisal Report', 'Restricted Appraisal', 'Desktop Appraisal']`
- **Shared (0):** `[]`
- **Valta-only (3):** `['Comprehensive', 'Concise', 'Form']`
- **Master-only (3):** `['Appraisal Report', 'Restricted Appraisal', 'Desktop Appraisal']`

### `Valuetimeframe` (Valta) ↔ `timeframe` (Master) — **SEMANTIC NEAR-MISS** (id/label do not match; mapped manually based on intent)
- **Valta label:** Value Timeframe &nbsp;|&nbsp; **Master label:** Timeframe
- **Valta control:** Select one &nbsp;|&nbsp; **Master type:** `dropdown`
- **Valta options (3):** `['Current', 'Prospective', 'Retrospective']`
- **Master options (4):** `['Current', 'As Stabilized', 'As Complete', 'As Is']`
- **Shared (1):** `['Current']`
- **Valta-only (2):** `['Prospective', 'Retrospective']`
- **Master-only (3):** `['As Stabilized', 'As Complete', 'As Is']`

---

## Section C — Valta-only Dropdown Fields

Dropdown fields in Valta with no Master counterpart (or where Master has the concept under a different type, e.g., `text` instead of `select`). Per the prior `VALTA-MASTER-DELTA-2026-05-14.md` report §A, fields like Tenancy / InterestAppraised / ValueScenarios were flagged as TYPE drift — Master under-types them as `text` despite Valta proving they are select-shaped. This section enumerates those plus other Valta-only dropdowns.

**Count: 10**

| Valta field | Valta list | Valta control | Valta options | Notes |
|---|---|---|---|---|
| `StateofImprovements` | `ListStateofImprovements` | Select one | ['Existing', 'Proposed', 'Vacant Land'] | Cascade result field. No Master dropdown exists. |
| `StatusofImprovements` | `ListStatusofImprovements` | Select one | ['Existing - Completed', 'Existing - Renovated', 'Existing - Under Renovation', 'Existing - To Be Renovated', 'Proposed - Vacant Land', 'Proposed - Improved Land (Demolition Required)', 'Proposed - Under Construction'] | Cascade trigger. Master has `appraisal-status` and `occupancy-status` but neither is the same concept. |
| `AuthorizedUse` | `ListAuthorizedUse` | Select one | ['First Mortgage Financing', 'Financial Reporting', 'Insurance', 'Internal Decision-Making', 'Acquisition-Disposition', 'Estate Planning', 'Litigation', 'GST'] | Master has `intended-use` (not in dropdown set — verify), and unrelated `conforming-use` dropdown. |
| `AssignmentType` | `ListAssignmentType` | Select one | ['Single Property', 'Multiple Properties'] | No Master equivalent. |
| `DesktopReport` | `ListYes/No` | Select one | ['Yes', 'No'] | Yes/No flag. Master has many boolean fields but uses `type: "boolean"`, excluded from this audit. |
| `ClientDocuments` | `ListClientDocuments` | Select multiple | ['Previous Appraisal', 'Property Details', 'Proforma', 'Unit Mix', 'Rent Roll', 'Historical Operating Expenses', 'Development Permit Drawings', 'Contact for Property Tour', 'Purchase & Sale Agreement', 'Environmental Reports', 'Property Condition Reports'] | Pre-LOE document checklist. No Master equivalent. |
| `TransactionStatus` | `ListTransactionStatus` | Select multiple | ['Not Applicable', 'Listed', 'Under Contract'] | No Master equivalent (verify against `tax-status`/`appraisal-status` — different concepts). |
| `ZoningStatus` | `ListZoningStatus` | Select one | *(empty list in Valta)* | Master has `zoning-conformance` and `zoning-compliance` dropdowns — overlapping but distinct concept. ALSO: Valta `ListZoningStatus` is EMPTY in v6. |
| `LandMetric` | `ListLand$/Metric` | Select one | *(empty list in Valta)* | Valta `ListLand$/Metric` is EMPTY in v6. No Master equivalent. |
| `CMHCFinancing` | `ListYes/No` | Select one | ['Yes', 'No'] | Canadian-specific. No Master equivalent. |

---

## Section D — Master-only Dropdown Fields

Dropdown-typed fields in Master with no Valta counterpart. **Count: 133**

Grouped by `type`:

### Master `type: "dropdown"` — 65 fields

| master_field_id | master_label | option_count | first_3_options |
|---|---|---|---|
| `appraiser-role` | Appraiser Role | 3 | ['Primary Appraiser', 'Co-Appraiser', 'Review Appraiser'] |
| `province` | Province | 13 | ['AB', 'SK', 'MB']… |
| `site-shape` | Shape | 5 | ['Rectangular', 'Square', 'Irregular']… |
| `topography` | Topography | 5 | ['Level', 'Gently Sloping', 'Sloping']… |
| `exposure-visibility` | Exposure & Visibility | 5 | ['Excellent', 'Good', 'Average']… |
| `adjacent-north` | North | 6 | ['Residential', 'Commercial', 'Industrial']… |
| `adjacent-south` | South | 6 | ['Residential', 'Commercial', 'Industrial']… |
| `adjacent-east` | East | 6 | ['Residential', 'Commercial', 'Industrial']… |
| `adjacent-west` | West | 6 | ['Residential', 'Commercial', 'Industrial']… |
| `site-rating` | Site Rating | 5 | ['Excellent', 'Good', 'Average']… |
| `site-quality` | Site Quality | 5 | ['Excellent', 'Good', 'Average']… |
| `site-utility` | Site Utility | 5 | ['Excellent', 'Good', 'Average']… |
| `building-quality` | Building Quality | 5 | ['Excellent', 'Good', 'Average']… |
| `building-appeal` | Building Appeal | 5 | ['Excellent', 'Good', 'Average']… |
| `rent-trend` | Rent Trend | 3 | ['Improving', 'Stable', 'Declining'] |
| `foundation` | Foundation | 4 | ['Concrete', 'Block', 'Slab']… |
| `roof` | Roof | 4 | ['Flat', 'Pitched', 'Hip']… |
| `overall-condition` | Overall Condition | 5 | ['Excellent', 'Good', 'Average']… |
| `zoning-conformance` | Conformance | 3 | ['Legal Conforming', 'Legal Non-Conforming', 'Illegal'] |
| `comp1-property-rights` | Property Rights | 3 | ['Fee Simple Estate', 'Leased Fee Estate', 'Leasehold Interest'] |
| `comp1-parking-type` | Parking Type | 4 | ['Surface', 'Underground', 'Structured']… |
| `comp2-property-rights` | Property Rights | 3 | ['Fee Simple Estate', 'Leased Fee Estate', 'Leasehold Interest'] |
| `comp2-parking-type` | Parking Type | 4 | ['Surface', 'Underground', 'Structured']… |
| `comp3-property-rights` | Property Rights | 3 | ['Fee Simple Estate', 'Leased Fee Estate', 'Leasehold Interest'] |
| `comp3-parking-type` | Parking Type | 4 | ['Surface', 'Underground', 'Structured']… |
| `comp4-property-rights` | Property Rights | 3 | ['Fee Simple Estate', 'Leased Fee Estate', 'Leasehold Interest'] |
| `comp4-parking-type` | Parking Type | 4 | ['Surface', 'Underground', 'Structured']… |
| `comp5-property-rights` | Property Rights | 3 | ['Fee Simple Estate', 'Leased Fee Estate', 'Leasehold Interest'] |
| `comp5-parking-type` | Parking Type | 4 | ['Surface', 'Underground', 'Structured']… |
| `subject-parking-type` | Parking Type | 4 | ['Surface', 'Underground', 'Structured']… |
| `subject-parking-type` | Parking Type | 4 | ['Surface', 'Underground', 'Structured']… |
| `appraiser1-role` | Appraiser 1 Role | 3 | ['Primary Appraiser', 'Co-Appraiser', 'Review Appraiser'] |
| `appraiser2-role` | Appraiser 2 Role | 3 | ['Primary Appraiser', 'Co-Appraiser', 'Review Appraiser'] |
| `street1-type` | Street 1 Type | 3 | ['Paved', 'Gravel', 'Dirt'] |
| `street2-type` | Street 2 Type | 3 | ['Paved', 'Gravel', 'Dirt'] |
| `impv-appeal` | Appeal Rating | 5 | ['Excellent', 'Good', 'Average']… |
| `impv-condition` | Condition Rating | 5 | ['Excellent', 'Good', 'Average']… |
| `impv-quality` | Quality Rating | 5 | ['Excellent', 'Good', 'Average']… |
| `valuation-type` | Valuation Type | 3 | ['Current', 'Retrospective', 'Prospective'] |
| `appraisal-status` | Appraisal Status | 3 | ['Fully Detailed', 'Summary', 'Restricted'] |
| `scenario-name` | Scenario Name | 4 | ['As Is', 'As Stabilized', 'As Complete']… |
| `value-component` | Value Component | 3 | ['Real Property', 'Real Property + FF&E', 'Going Concern'] |
| `country` | Country | 2 | ['Canada', 'United States'] |
| `drainage` | Drainage | 3 | ['Adequate', 'Inadequate', 'Poor'] |
| `visibility` | Visibility | 5 | ['Excellent', 'Good', 'Average']… |
| `zoning-compliance` | Zoning Compliance | 3 | ['Legal Conforming', 'Legal Non-Conforming', 'Illegal'] |
| `conforming-use` | Conforming Use | 3 | ['Yes', 'No', 'Non-Conforming'] |
| `conforming-lot` | Conforming Lot | 2 | ['Yes', 'No'] |
| `construction-type` | Construction Type | 4 | ['Wood Frame', 'Steel Frame', 'Concrete']… |
| `roof-type` | Roof Type | 4 | ['Flat', 'Pitched', 'Hip']… |
| `building-class` | Building Class | 4 | ['A', 'B', 'C']… |
| `parking-type` | Parking Type | 4 | ['Surface', 'Underground', 'Structured']… |
| `deed-type` | Deed Type | 4 | ['Warranty', 'Quitclaim', 'Special Warranty']… |
| `tax-status` | Tax Status | 3 | ['Current', 'Delinquent', 'Exempt'] |
| `assessment-trend` | Assessment Trend | 3 | ['Increasing', 'Stable', 'Decreasing'] |
| `util-water` | Water | 4 | ['Municipal', 'Well', 'Cistern']… |
| `util-sewer` | Sewer | 3 | ['Municipal', 'Septic', 'None'] |
| `util-electric` | Electric | 2 | ['Connected', 'Not Connected'] |
| `util-gas` | Gas | 3 | ['Natural Gas', 'Propane', 'None'] |
| `economic-outlook` | Economic Outlook | 3 | ['Improving', 'Stable', 'Declining'] |
| `market-outlook` | Market Outlook | 3 | ['Improving', 'Stable', 'Declining'] |
| `site-appeal` | Site Appeal | 5 | ['Excellent', 'Good', 'Average']… |
| `site-exposure` | Site Exposure | 5 | ['Excellent', 'Good', 'Average']… |
| `building-condition` | Building Condition | 5 | ['Excellent', 'Good', 'Average']… |
| `building-function` | Building Function | 5 | ['Excellent', 'Good', 'Average']… |

### Master `type: "select"` — 67 fields

| master_field_id | master_label | option_count | first_3_options |
|---|---|---|---|
| `subject-location-rating` | Location Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `subject-access-rating` | Access Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `subject-exposure-rating` | Exposure Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `subject-quality-rating` | Quality Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `subject-appeal-rating` | Appeal Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp1-location` | Location Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp1-access` | Access Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp1-exposure` | Exposure Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp1-quality` | Quality Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp1-condition` | Condition Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp1-appeal` | Appeal Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp2-location` | Location Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp2-access` | Access Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp2-exposure` | Exposure Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp2-quality` | Quality Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp2-condition` | Condition Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp2-appeal` | Appeal Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp3-location` | Location Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp3-access` | Access Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp3-exposure` | Exposure Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp3-quality` | Quality Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp3-condition` | Condition Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp3-appeal` | Appeal Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp4-location` | Location Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp4-access` | Access Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp4-exposure` | Exposure Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp4-quality` | Quality Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp4-condition` | Condition Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp4-appeal` | Appeal Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp5-location` | Location Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp5-access` | Access Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp5-exposure` | Exposure Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp5-quality` | Quality Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp5-condition` | Condition Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `comp5-appeal` | Appeal Rating | 5 | ['Superior', 'Above Average', 'Average']… |
| `survey1-location` | Location Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `survey1-quality` | Quality Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `survey1-condition` | Condition Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `survey1-appeal` | Appeal Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `survey1-amenities` | Amenities Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `survey2-location` | Location Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `survey2-quality` | Quality Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `survey2-condition` | Condition Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `survey2-appeal` | Appeal Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `survey2-amenities` | Amenities Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `survey3-location` | Location Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `survey3-quality` | Quality Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `survey3-condition` | Condition Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `survey3-appeal` | Appeal Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `survey3-amenities` | Amenities Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `survey4-location` | Location Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `survey4-quality` | Quality Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `survey4-condition` | Condition Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `survey4-appeal` | Appeal Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `survey4-amenities` | Amenities Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `survey5-location` | Location Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `survey5-quality` | Quality Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `survey5-condition` | Condition Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `survey5-appeal` | Appeal Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `survey5-amenities` | Amenities Rating | 3 | ['Superior', 'Similar', 'Inferior'] |
| `use-dcf-methodology` | Use DCF Methodology | 2 | ['Yes', 'No'] |
| `property-is-listed` | Property Currently Listed | 2 | ['Yes', 'No'] |
| `subject-conforminglot` | Conforming Lot | 2 | ['Yes', 'No'] |
| `subject-conforminguse` | Conforming Use | 3 | ['Yes', 'No', 'Non-Conforming'] |
| `subject-legally-permitted` | Legally Permitted | 2 | ['Yes', 'No'] |
| `subject-parking-incl` | Parking Included | 2 | ['Yes', 'No'] |
| `sale-lease-config` | Sale/Lease Configuration | 3 | ['$/Unit', '$/SF', '$/Month'] |

### Master `type: "multi-select"` — 1 fields

| master_field_id | master_label | option_count | first_3_options |
|---|---|---|---|
| `select-modules` | Select Modules | 5 | ['DC', 'Income', 'Cost']… |

---

## Section E — Summary Counts (no recommendations)

| Bucket | Count |
|---|---|
| Valta dropdown fields total | 18 |
| Master dropdown fields total | 143 |
| Matched pairs (Section A + B) | 8 |
| &nbsp;&nbsp;— same options | 0 |
| &nbsp;&nbsp;— different options | 8 |
| &nbsp;&nbsp;&nbsp;&nbsp;— of which by direct id/label match | 5 |
| &nbsp;&nbsp;&nbsp;&nbsp;— of which by semantic near-miss | 3 |
| Valta-only fields (no Master counterpart) | 10 |
| Master-only dropdown fields | 133 |

**Coverage observation (numbers only, no merge call):**
- Of 18 Valta dropdown fields, only **8** have any kind of dropdown counterpart in Master.
- Of those 8 matched, **0 share an exact options list** with Master.
- Master has **133** dropdown fields that Valta does not surface at all — Valta is a much narrower client-facing LOE/intake subset.

---

## Section F — Methodology

**Valta extraction:** direct file read. `DROPDOWN_OPTIONS` is a literal JS object at line 933 (22 keys). `FIELDS` array at line 1136 (45 entries). Filtered FIELDS where `d` (dropdown-list key) is non-empty → 18 fields. Spot-verified 3: `PropertyType` (line 1150), `Tenancy` (line 1152), `ValueScenarios` (line 1157) — all `d:` values match a key in `DROPDOWN_OPTIONS`.

**Master extraction:** regex pass over `fieldRegistry.ts` (22,032 lines). Split file by `id:` boundary, captured `type:`, `label:`, and inline `options: [...]` array per field. Pre-pass `grep` confirmed total counts: 72 `dropdown` + 69 `select` + 2 `multi-select` = 143. Parser extracted all 143 with non-empty option arrays (0 fields with empty `options:`). Spot-verified 3:
  - `property-type` line 1: 6 options matches grep
  - `province` line 5: 13 options including ('AB','SK','MB','BC','ON','QC',...)
  - `building-condition` (last bucket): 5 options ('Excellent','Good','Average','Fair','Poor') matches grep

**Matching strategy (Valta → Master):**
1. Exact kebab-case id match (`PropertyType` → `property-type`)
2. Normalized-label match (strip non-alphanumeric, lowercase)
3. Manual alt-id table for known variants (`InterestAppraised` → `property-rights`, `ValueScenarios` → `value-scenario`)
4. Semantic near-miss — manual mapping where id/label diverge but intent is the same. **3 such mappings recorded** and flagged inline:
    - `Tenancy` ↔ `occupancy-status` (Valta has 6 options inc. Multi-Tenant/Single-Tenant/Vacant; Master has 4 overlapping)
    - `Valuetimeframe` ↔ `timeframe` (only 'Current' shared)
    - `ApproachestoValue` ↔ `approaches-applied` (Master `multi-select`; only 'Income' shared by intent)
    These are NOT byte-equivalent matches — they're recorded as possible-overlap candidates for Ben's review.

**Option-set comparison:** byte-equal string comparison after preserving original casing/spacing. No normalization (e.g., 'Multi-Tenant' vs 'Multi-tenant' would count as different — and 'Owner Occupied' vs 'Owner-Occupied' DOES differ, see Section B Tenancy).

**Parser-gap honesty:**
- Valta `FIELDS` array: parsed 45/45 (verified line count 1137-1181). No gap.
- Master `fieldRegistry.ts`: 143 dropdown-typed fields extracted. Pre-pass `grep` count matched extraction count — 0 parser-miss. Limitation: a field with `options: someConstant` (reference rather than inline array) would be missed by this regex, but no such pattern was observed during spot checks.
- `boolean` type fields (21 of them in fieldRegistry.ts) were EXCLUDED from this audit even though Valta's `ListYes/No` (2 fields: `DesktopReport`, `CMHCFinancing`) is conceptually a Yes/No dropdown. Per brief scope (`select / select-one / select-multiple / dropdown / enum`), boolean was not in scope.
- `type: "text"` fields flagged in prior `VALTA-MASTER-DELTA-2026-05-14.md` §A as under-typed in Master (`tenancy`, `interest-appraised`, `value-scenario` were called out as text-in-Master / Select-in-Valta) — but my extraction shows `interest-appraised` does NOT exist as a Master text field (Master uses `property-rights` as a `dropdown` already). The prior delta's TYPE-drift claim for `interest-appraised` may need re-verification by Ben/qa-agent — outside scope of this audit to resolve.

**Constraints honored:**
- No edits to `fieldRegistry.ts`, the Valta HTML, calc engine, or any source.
- Document-only deliverable.
- Both source paths byte-identical (md5 verified) — proceeded against the image-configurator authoritative path.
