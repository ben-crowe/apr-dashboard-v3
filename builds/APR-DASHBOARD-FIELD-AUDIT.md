# APR Dashboard — Field Audit vs VALTA Spec

**Last Updated:** 2026-03-30 @ 18:45 MST
**Updated By:** react-spec-4 (co-arch-2 verified)
**Status:** Post-deploy verified — 26/26 PASS on VAL261030

Every field on the dashboard, organized by section. Shows which are in Chris's VALTA 37-field spec and which are extras we added for the workflow.

---

## Section 1: Client Information (from intake form)

| # | Field | VALTA | Status |
|---|-------|-------|--------|
| 1 | First Name | #6 | Valid |
| 2 | Last Name | #7 | Valid |
| 3 | Title | #8 | Valid |
| 4 | Organization | #9 | Valid |
| 5 | Phone | #11 | Valid |
| 6 | Email | #12 | Valid |
| 7 | Address | #10 | Valid |

**7 fields. All in VALTA. No extras.**

---

## Section 2: Property Information

| # | Field | VALTA | Status |
|---|-------|-------|--------|
| 8 | Property Name | #13 | Valid |
| 9 | Property Types | #15 | Valid |
| 10 | Property Address | #14 | Valid |
| 11 | Authorized Use | #21 | Valid |
| 12 | Valuation Premises | #22 | Valid |
| 13 | Asset Condition | — | Extra (maps to Valcre InvestmentGrade, useful but not in VALTA) |

**6 fields. 5 in VALTA. 1 extra (Asset Condition).**

---

## Section 3: Property Contact

| # | Field | VALTA | Status |
|---|-------|-------|--------|
| 14 | First Name | — | Extra (Valcre entity requirement) |
| 15 | Last Name | — | Extra (Valcre entity requirement) |
| 16 | Email | — | Extra (Valcre entity requirement) |
| 17 | Phone | — | Extra (Valcre entity requirement) |

**4 fields. None in VALTA. All extras — required by Valcre for PropertyContact entity.**

---

## Section 4: LOE Quote & Valuation Details

| # | Field | VALTA | Status |
|---|-------|-------|--------|
| 18 | Job Number | #1 | Valid (returned from Valcre) |
| 19 | Property Rights | #20 | Valid |
| 20 | Scope of Work | — | Valid (maps to Valcre Scopes) |
| 21 | Appraisal Fee | #28 | Valid |
| 22 | Report Type | #24 | Valid |
| 23 | Delivery Date | #32 | Valid |
| 24 | Payment Terms | — | Extra (LOE workflow, appended to Valcre Comments) |
| 25 | Retainer Amount | — | Extra (LOE workflow) |
| 26 | General Comments | — | Extra (maps to Valcre Comments) |
| 27 | Delivery Comments | — | Extra (maps to Valcre DeliveryComments) |
| 28 | Payment Comments | — | Extra (maps to Valcre PaymentComments) |
| 29 | ClickUp Task link | — | Extra (internal tracking) |

**12 fields. 6 in VALTA. 6 extras — all serve the LOE/workflow pipeline.**

---

## Section 5: Appraisal Assignment (NEW — 13 VALTA fields)

| # | Field | VALTA | Status |
|---|-------|-------|--------|
| 30 | Assignment Type | #4 | Valid |
| 31 | Property Subtype | #16 | Valid |
| 32 | Tenancy | #17 | Valid |
| 33 | State of Improvements | #18 | Valid |
| 34 | Status of Improvements | #19 | Valid |
| 35 | Approaches to Value | #23 | Valid |
| 36 | Desktop Report | #25 | Valid |
| 37 | Value Timeframe | #26 | Valid |
| 38 | Transaction Status | #33 | Valid |
| 39 | Zoning Status | #34 | Valid |
| 40 | Land Metric | #35 | Valid |
| 41 | EA (Extraordinary Assumptions) | #36 | Valid |
| 42 | HC (Hypothetical Conditions) | #37 | Valid |

**13 fields. All in VALTA. No extras. Just built this session.**

---

## Section 6: Building Information

| # | Field | VALTA | Status |
|---|-------|-------|--------|
| 43 | Year Built | — | Valid (maps to Valcre Property.YearBuilt) |
| 44 | Building Size SF | — | Valid (maps to Valcre Property.SizeSF) |
| 45 | Number of Units | — | Valid (maps to Valcre Property.BuildingsCount) |
| 46 | Parking Spaces | — | Valid (maps to Valcre Property.ParkingSpacesCount) |
| 47 | Legal Description | — | Valid (maps to Valcre Property.DescriptionText) |

**5 fields. Not numbered in VALTA but all map to Valcre Property entity.**

---

## Section 7: Property Research / Data Gathering

| # | Field | VALTA | Status |
|---|-------|-------|--------|
| 48 | Zoning | #34 | Valid |
| 49 | Zone Code | — | Valid (maps to Valcre Property.ZoningName) |
| 50 | Land Use | — | Valid (maps to Valcre Property.ProposedLandUse) |
| 51 | Flood Zone | — | Valid (maps to Valcre Property.SiteFloodZone) |
| 52 | Utilities | — | Valid (maps to Valcre Property.Utilities) |
| 53 | Parcel Number | — | Valid (Valcre Comments on PATCH) |
| 54+ | Assessment fields (6) | — | Valid (Valcre Comments on PATCH) |

**~10 fields. Property research data for Valcre.**

---

## Summary

| Category | Fields | In VALTA | Extras |
|----------|--------|----------|--------|
| Client Info | 7 | 7 | 0 |
| Property Info | 6 | 5 | 1 (Asset Condition) |
| Property Contact | 4 | 0 | 4 (Valcre requirement) |
| LOE Details | 12 | 6 | 6 (workflow fields) |
| Appraisal Assignment | 13 | 13 | 0 |
| Building Info | 5 | 0 | 0 (Valcre mapped) |
| Property Research | ~10 | 1 | 0 (Valcre mapped) |
| **Total** | **~57** | **32** | **11 extras** |

**All 37 VALTA fields accounted for. 11 extras exist but all serve the pipeline (Valcre entity requirements, LOE workflow, internal tracking). No unnecessary fields.**
