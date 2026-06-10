---
content_type: verification-checksheet
title: Mock Dashboard ↔ Chris's Registry — field-by-field verification
status: LIVING — populated as the mock settles; the proof the mock == Chris's registry before live sync
created: 2026-06-10
owner: co-architect
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
source: client-source/Valta Master Field Registry v03 - reviewed 2026-06-09.xlsx (Field Registry tab + Dropdown Lists tab)
purpose: Cross-reference EVERY mock field against Chris's registry — name, control type, option list, Valcre mapping — with a match mark on each. Built per Ben's request so we can prove the mock equals his registry, field by field, before it becomes the live dashboard.
tags: [apr-workflow, field-registry, verification, checksheet, mock-vs-registry]
---

# Mock ↔ Registry Verification Check Sheet

**How to read:** each row = one registry field. **Registry** columns are Chris's spec (the
authority). **Mock** column = what the mock renders. **✓ / ✗ / ⏳** = matches / mismatch / pending
mock-settle. Research fields (Section 4) are deliberately OUT — Chris's registry doesn't cover them
(see CLIENT-REVIEW-SHEET / they're Ben's own pre-registry research fields).

**Legend:** control types from registry "Data Control Type"; option lists from the Dropdown Lists
tab; Valcre = the registry's "Valcre Field Name" (native) or the verified custom-field ID.

---

## Section 1 — Client & Property (intake)

| Field | Registry control | Registry options/list | Valcre target | Mock | ✓/✗ |
|---|---|---|---|---|---|
| Job Number | Alpha Numeric | — | native Number | text | ⏳ |
| Job Status | Select one | (Valcre status enum) | native Status | locked/Valcre | ⏳ |
| Client First/Last/Title/Phone/Email | Text | — | native Contact fields | text | ⏳ |
| Property Name | Alpha Numeric | — | native Property Name | text | ⏳ |
| Property Address | Alpha Numeric | — | native Street Address | text | ⏳ |
| Property Type | Select one | Multifamily·Self-Storage·Retail·Industrial·Office·Land·Hotel·Seniors·Other | native Property Type | dropdown | ⏳ |
| Authorized Use | Select one | First Mortgage Financing·Financial Reporting·Insurance·Internal Decision-Making·Acquisition-Disposition·Estate Planning·Litigation·GST | native Job.IntendedUses | dropdown (1.11) | ⏳ |
| Valuation Premises | Select one | (registry list) | internal | dropdown | ⏳ |
| Asset Condition | Select one | (registry list) | internal | dropdown | ⏳ |

## Section 2 — LOE Quote & Valuation (the LOE gate)

| Field | Registry control | Registry options/list | Valcre target | Mock | ✓/✗ |
|---|---|---|---|---|---|
| Purpose | Text (free) | — (NOT in registry as a field; LOE-paragraph prose) | — (LOE only) | free-text + tooltip | ✓ |
| Status of Improvements | Select one | Improved-Completed·Improved-Renovated·Improved-Under Renovation·Improved-Proposed Renovation·Proposed-Vacant Land·Proposed-Improved Land(Demolition Required)·Proposed-Under Construction | native (cascade input) | dropdown (2.4) | ✓ |
| Value Scenarios | Select multiple | As Is Vacant Land·As If Vacant Land·As If Complete & Stabilized·As-Is·As Stabilized·As If Complete & Stabilized-Renovated·As If Complete-Rezoned·-Serviced·-Subdivided·Insurable Replacement Cost | CF12414 (IDS-filled) — **DERIVED, do not set** | locked/derived (2.5) | ✓ |
| Property Subtype | Select one | Apartment·Townhouse·Mixed Use·Shopping Centre **(⚠ 3-way mismatch w/ live + Valcre SecondaryType — PV-1)** | native Subtype/SecondaryType | dropdown (2.6) | ⏳ |
| Tenancy | Select one | Multi-Tenant·Owner Occupied·Partial Owner Occupied·Single-Tenant·**Unkown(typo)**·Vacant | — | dropdown (2.7) | ⏳ |
| Property Rights (InterestAppraised) | Select multiple | Fee Simple·Leased Fee Interest·Leasehold Estate·Going Concern | native Job.Purposes | multi-select | ⏳ |
| Approaches to Value | Select multiple | Land Direct Comparison·Cost·Direct Comparison·Income | — (DERIVED) | dropdown | ⏳ |
| Value Timeframe | Select one | Current·Prospective·Retrospective | — | dropdown | ⏳ |
| Scope of Work | Select multiple | (registry; Valcre treats as checkbox) | — | dropdown→multi | ⏳ |
| Report Type | Select one | Comprehensive·Concise·Form **(= our "Report Format" — naming reconcile)** | — | dropdown | ⏳ |
| Assignment Type | Select one | Single Property·Multiple Properties | — (LOE-only ruling) | dropdown | ⏳ |
| Appraisal Fee | Whole Number | — | native Fee | number | ⏳ |
| Retainer Amount | (number) | — | native Retainer | number | ⏳ |
| Payment Terms | Select one | (registry list) | ClickUp only | dropdown | ⏳ |
| Effective Date | Date | — | native EffectiveDate | date | ⏳ |
| Request Date | Date | — | native BidDate | date | ⏳ |
| Signed Date | Date | — | native AwardDate | date | ⏳ |
| Delivery/Due Date | Date | — | native DueDate | date | ⏳ |
| Client Documents | Select multiple | Previous Appraisal·Property Details·Proforma·Unit Mix·Rent Roll·Historical Operating Expenses·Development Permit Drawings·Contact for Property Tour·Purchase & Sale Agreement·Environmental Reports·Property Condition Reports | — | multi-select | ⏳ |
| Previously Appraised | Select one | Yes·No | — | dropdown | ⏳ |
| Transaction Status | Select multiple | Not Applicable·Listed·Under Contract **(label mismatch w/ Valcre — partial)** | CF12424 | dropdown | ⏳ |
| Zoning Status | Select one | In Place·To Be Rezoned | CF12425 | dropdown | ⏳ |
| Current Use | Select one | Vacant Land·Single Family·Multifamily·Retail·Industrial·Office | — | dropdown (just built) | ⏳ |
| Proposed Use | Select one | Not Applicable·Single Family·Multifamily·Mixed Use·Retail·Industrial·Office | — | dropdown (just built) | ⏳ |
| CMHC Financing | Select one | Yes·No | — (no Valcre field) | dropdown | ⏳ |

## Section 3 — Building Information

| Field | Registry control | Registry options/list | Valcre target | Mock | ✓/✗ |
|---|---|---|---|---|---|
| State of Improvements | Select one | Improved·Proposed·Vacant Land·Improved Development Land | — | dropdown | ⏳ |
| Land Metric | Select one | $/Unit·$/FAR·$/SF·$/Acre **(⚠ live app shows AREA units SF/Acres/Hectares — concept mismatch)** | — | dropdown | ⏳ |
| Year Built, Building Size, Units, Parking, Env Assessment, Heritage, Legal Desc | (various) | — | — | — | ⏳ |

---

## Known divergences to resolve (carried to CLIENT-REVIEW-SHEET)

1. **Property Subtype** — 3-way option mismatch (registry vs live app vs Valcre SecondaryType). PV-1.
2. **Transaction Status** — registry labels vs Valcre's accepted labels (silent-no-write risk).
3. **Land Metric** — registry ($-per-unit) vs live app (area units) = different concepts.
4. **Report Type** — registry "Report Type" (Comprehensive/Concise/Form) = our "Report Format" (naming).
5. **"Unkown"** typo in ListTenancy.
6. **Lead Appraiser / Desktop Report** — not in registry / Chris said delete (being removed).

---

*To finish: as the mock settles, flip each ⏳ to ✓ (verified the mock control + options match the
registry row) or ✗ (mismatch → fix or log). The all-✓ state = the mock provably equals Chris's
registry, the gate before live sync.*
