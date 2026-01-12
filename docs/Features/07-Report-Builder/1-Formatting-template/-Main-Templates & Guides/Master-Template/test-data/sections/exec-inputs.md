# Executive Summary Section Input Fields

These are the USER INPUT fields for the Report Builder Executive Summary Section.

**Loads via:** "Load Test Data" button in Exec section of EditPanel
**Rule:** User enters these. Template displays them in the Executive Summary pages.

---

## Property Summary

Key property metrics for the executive summary.

- **Property Name:** `property-name`  |  North Battleford Apartments  |  Subject property name
- **Property Address:** `property-address`  |  1101, 1121 109 St  |  Street address
- **City:** `city`  |  North Battleford  |  City name
- **Province:** `province`  |  Saskatchewan  |  Province/State
- **Property Type:** `property-type`  |  Multi-Family  |  Property classification

---

## Unit Summary

Unit count and building size metrics.

- **Total Units:** `calc-total-units`  |  16  |  Number of residential units
- **Total GBA:** `gba`  |  10,204  |  Gross building area (SF)
- **Total NRA:** `nra`  |  10,204  |  Net rentable area (SF)

---

## Key Dates

Critical dates for the appraisal.

- **Effective Date:** `effective-date`  |  October 17, 2025  |  Date of value
- **Report Date:** `report-date`  |  2025-11-20  |  Date report issued
- **Inspection Date:** `inspection-date`  |  October 17, 2025  |  Date of property inspection

---

## Value Conclusions

Final value estimates from each approach.

- **Direct Cap Value:** `dircap-value1`  |  1800000  |  Income approach value conclusion
- **Value Per Unit:** `dircap-value1-perunit`  |  $112,500/Unit  |  Value per residential unit
- **Value Per SF:** `dircap-value1-psf`  |  176.40  |  Value per square foot
- **Final Value Conclusion:** `final-value-conclusion`  |  $0  |  Reconciled final value

---

## Income Summary

Key income and expense metrics.

- **PGI:** `calc-pgi`  |  204240  |  Potential gross income
- **EGR:** `calc-egr`  |  196406.4  |  Effective gross revenue
- **Total Expenses:** `calc-total-expenses`  |  65563  |  Operating expenses
- **NOI:** `calc-noi`  |  111771.128  |  Net operating income
- **Cap Rate:** `calc-cap-rate`  |  6.25  |  Capitalization rate (%)
- **Expense Ratio:** `expense-ratio`  |  0.43  |  Operating expense ratio

---

## Site Summary

Basic site information.

- **Site Size:** `site-size`  |  0  |  Site area (SF)
- **Year Built:** `year-built`  |  1981  |  Year of construction
- **Building Class:** `building-class`  |  0  |  Property class rating

---

## Ownership

Current ownership information.

- **Current Owner:** `current-owner-text`  |  The subject property is currently under the ownership of 102109845 Saskatchewan Ltd.  |  Ownership statement

---

## Field Mapping: Source to Exec

Maps source fields from `northBattlefordTestData.ts` to exec field IDs.

**Property Fields:**
- `property-name`, `property-address`, `city`, `province` → Property identification
- `property-type` → Classification

**Financial Fields:**
- `calc-pgi`, `calc-egr`, `calc-noi` → Revenue metrics
- `calc-total-expenses`, `expense-ratio` → Expense metrics
- `calc-cap-rate` → Capitalization rate

**Value Fields:**
- `dircap-value1` → Primary value conclusion
- `dircap-value1-perunit`, `dircap-value1-psf` → Per-unit/SF values

---

## Total Fields: 24

- Property Summary: 5
- Unit Summary: 3
- Key Dates: 3
- Value Conclusions: 4
- Income Summary: 6
- Site Summary: 3
- Ownership: 1

---

## Adding New Exec Fields

1. Add field definition to `initializeMockData()` in `reportBuilderStore.ts`
2. Add mapping in `loadExecTestData()` function
3. Update this documentation
4. Test with "Load Test Data" button
