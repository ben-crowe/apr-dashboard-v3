# Field Data Reference - Master Guide

**Purpose:** This document lists all field IDs and their corresponding data-sample values for each page in PREVIEW-Master.html

**Property:** North Battleford Apartments (VAL251012)

**Last Updated:** 2025-12-17

---

## PAGE 3 - Letter of Transmittal

| # | Field ID | Data Sample Value | Source |
|---|----------|-------------------|--------|
| 1 | `{{Company_Name}}` | Valta Property Valuations Ltd. | PNG: -c-letter.png |
| 2 | `{{Company_Address}}` | #300, 4658 Richard Road SW | PNG: -c-letter.png |
| 3 | `{{Company_CityStateZip}}` | Calgary, AB T3E 6L1 | PNG: -c-letter.png |
| 4 | `{{Company_Phone}}` | 587-801-5151 | PNG: -c-letter.png |
| 5 | `{{Report_Date}}` | November 20, 2025 | PNG: -c-letter.png |
| 6 | `{{Client_Company}}` | 102109845 Saskatchewan Ltd. | PNG: -c-letter.png |
| 7 | `{{Client_Address}}` | 1901, 1088 - 6th Ave SW, | PNG: -c-letter.png |
| 8 | `{{Client_CityStateZip}}` | Calgary, AB T2P 5N3 | PNG: -c-letter.png |
| 9 | `{{Client_Name}}` | Kenneth Engler | PNG: -c-letter.png |
| 10 | `{{Report_Values}}` | As Stabilized (Fee Simple Estate) | PNG: -c-letter.png |
| 11 | `{{Subject_Street}}` | 1101, 1121 109 St | PNG: -c-letter.png |
| 12 | `{{Subject_City}}` | North Battleford | PNG: -c-letter.png |
| 13 | `{{Subject_State}}` | SK | PNG: -c-letter.png |
| 14 | `{{Client_Company}}` | 102109845 Saskatchewan Ltd. | PNG: -c-letter.png |
| 15 | `{{Report_ValueScenario1}}` | As Stabilized | PNG: -c-letter.png |
| 16 | `{{Subject_IntroComment}}` | The subject property, located at 1101, 1121 109 St, North Battleford, SK, is a multi-family, walkup property with improvements located in North Battleford. The improvements are comprised of 2 total buildings, and consist of 10,201 square feet (sf) of net rentable area (NRA) as of the valuation date. The property (following date, we have found the property to be weighted) is approximately 100.0% occupied and features 16 units in a 2-story, garden style format. | PNG: -c-letter.png |
| 17 | `{{Subject_EconCharacteristics}}` | Based upon our investigation of the real estate market and after considering all of the pertinent facts as set forth within the body of this appraisal report, as of the effective date, the following: | PNG: -c-letter.png |
| 18 | `{{Report_Interest}}` | Fee Simple Estate | PNG: -c-letter.png |
| 19 | `{{Subject_ExposureTime}}` | Six Months | PNG: -c-letter.png |
| 20 | `{{Report_Date1}}` | October 17, 2025 | PNG: -c-letter.png |
| 21 | `{{Report_Values}}` | $1,400,000 | PNG: -c-letter.png |
| 22 | `{{Report_Hypothetical}}` | The use of a hypothetical condition(s) may have impacted the results of the assignment. The As Stabilized value has been developed under the hypothetical condition that the subject property is fully rented (or building costs, rent loss, or lease-up expenses). In addition it is a hypothetical condition that all units could achieve current market rent levels and stabilized occupancy as of the effective date of the appraisal. Under this premise, deductions are made for holding costs, rent loss, or lease-up expenses. In addition it is a hypothetical condition that as of the effective date the property's existing lease terms reflect contract rents that are deemed to be below-market rents. For the purposes of this analysis, it is assumed that lease-up to market rent levels has occurred under typical market conditions, without undue delay or concessions exceeding prevailing market norms. If this assumption proves incorrect, such as market rents are not achievable the value conclusion may be materially impacted. | PNG: -c-letter.png |
| 23 | `{{Report_Extraordinary}}` | No Extraordinary Assumptions were made for this assignment. | PNG: -c-letter.png |
| 24 | `{{Company_JobNumber}}` | VAL251012 | PNG: -c-letter.png |

**Total Fields on Page 3:** 24 field-mapped spans (some field IDs appear multiple times)

---

## PAGE 4 - Extraordinary Limiting Conditions

| # | Field ID | Data Sample Value | Source |
|---|----------|-------------------|--------|
| 1 | `{{Report_LimCond}}` | No Extraordinary Limiting Conditions were made for this assignment. | PNG: -b-conditions.png |
| 2 | `{{Company_Name}}` | Valta Property Valuations Ltd. | PNG: -b-conditions.png |
| 3 | `{{Appraiser1_Signature}}` | Appraiser1_Signature | PNG: -b-conditions.png |
| 4 | `{{Appraiser1_Name}}` | Chris Chornohos, AACI, MRICS | PNG: -b-conditions.png |
| 5 | `{{Appraiser1_Title}}` | Founder | PNG: -b-conditions.png |
| 6 | `{{Appraiser1_Email}}` | chris.chornohos@valta.ca | PNG: -b-conditions.png |
| 7 | `{{Subject_Street}}` | 1101, 1121 109 St | PNG: -b-conditions.png |
| 8 | `{{Company_JobNumber}}` | VAL251012 - 1 | PNG: -b-conditions.png |

**Total Fields on Page 4:** 8 field-mapped spans

**Note:** Fields 2-8 already had data-sample attributes from previous work. Only field 1 (Report_LimCond) was added in this session.

---

## PAGE 5 - Table of Contents

**Total Fields on Page 5:** 0 field-mapped spans (all static text)

---

## PAGES 6+ - Status: Pending

Pages 6 through 39 still need data-sample attributes added. These pages contain property-specific data that will require extraction from PNG images and potentially cross-reference with Binscarth property SVG files.

---

## How to Use This Guide

**For Toggle Testing:**
1. Open PREVIEW-Master.html in browser
2. Navigate to a page listed above
3. Toggle OFF → Should see field IDs (e.g., `{{Company_Name}}`)
4. Toggle ON → Should see data values from "Data Sample Value" column

**For Adding New Pages:**
1. Read the PNG image for the page
2. Extract property-specific values
3. Add to this document
4. Add data-sample attributes to HTML
5. Commit to git

---

## Git Commits

- **Page 3:** Commit `6fc7abf` (Session 6)
- **Page 4:** Commit `7816b5c` (Session 7)

---

**Next Pages to Complete:**
- Page 6 (Property Overview) - ~30 fields
- Page 7 (Highest & Best Use) - ~10 fields
- Page 8 (Summary) - ~15 fields
- Pages 9-39 - TBD
