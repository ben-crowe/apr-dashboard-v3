# Field Coverage Gap Analysis

**Analysis Date:** 2025-12-08
**Analyst:** Backend Developer Agent
**Purpose:** Compare IMAGE-TABLE-CATALOG.md requirements against reportBuilderStore.ts implementation

---

## Executive Summary

The Report Builder store has significant gaps in field coverage compared to the reference PDF data catalog. Major gaps exist in:
- **Rental Survey Section:** 0% coverage - completely missing
- **Income Approach Detail Tables:** Missing expense breakdown table with %EGR, $/SF, $/Unit columns
- **Sales Comparison Detail:** Missing NOI/unit, occupancy data for comparables
- **Property Summary Table:** Missing unified property identification table structure

**Overall Coverage:** Approximately 35-40% of required fields are present in simplified form.

---

## Section-by-Section Analysis

### 1. Income Approach Section

**Catalog Requirement:** `image25.png` + `image30.png`

**Expected Fields:**
- EXPENSE CONCLUSIONS table with 7 categories, each having:
  - %EGR column
  - $/SF NRA column
  - $/Unit column
  - Total $ column
- DIRECT CAPITALIZATION table with:
  - Unit mix details (count per bedroom type)
  - Contract rents vs Market rents comparison
  - PGR, Vacancy %, EGR, NOI, Cap Rate, Indicated Value

**Current Store Coverage:**

EXISTING (Calculator Section):
```
calc-exp-management (% EGR only)
calc-exp-taxes (per unit only)
calc-exp-insurance (per unit only)
calc-exp-repairs (per unit only)
calc-exp-utilities (per unit only)
calc-exp-payroll (per unit only)
calc-exp-admin (per unit only)
calc-exp-reserves (per unit only)
calc-exp-other (per unit only)
calc-pgr
calc-vacancy-rate
calc-egr
calc-noi (calculated)
calc-cap-rate
```

EXISTING (Income Approach Section - Narrative Only):
```
income-pgi-narrative (textarea - not structured data)
income-expense-narrative (textarea - not structured data)
income-noi-narrative (textarea - not structured data)
income-cap-rate-analysis (textarea)
income-value-indication (single number)
```

**MISSING FIELDS:**

Expense Table Display Fields (for report rendering):
```
income-expense-table-taxes-egr-percent
income-expense-table-taxes-per-sf
income-expense-table-taxes-per-unit
income-expense-table-taxes-total

income-expense-table-insurance-egr-percent
income-expense-table-insurance-per-sf
income-expense-table-insurance-per-unit
income-expense-table-insurance-total

[Same pattern for: repairs, payroll, utilities, management, other]

income-expense-table-total-egr-percent
income-expense-table-total-per-sf
income-expense-table-total-per-unit
income-expense-table-total-amount
```

Direct Cap Table Display Fields:
```
income-unit-mix-1br-count
income-unit-mix-2br-count
income-unit-mix-3br-count
income-contract-rent-1br
income-contract-rent-2br
income-contract-rent-3br
income-market-rent-1br
income-market-rent-2br
income-market-rent-3br
income-pgr-display
income-vacancy-percent-display
income-egr-display
income-expenses-display
income-noi-display
income-cap-rate-display
income-indicated-value-display
```

**Coverage Percentage:** 25%
**Priority:** HIGH - Missing structured table data needed for report rendering

---

### 2. Sales Comparison Section

**Catalog Requirement:** `image51.png` + `image60.png`

**Expected Fields:**
- DIRECT COMPARISON APPROACH TABLE (5 comps) with sections:
  - Sale Info: Price, $/Unit, Rights, Financing, Conditions
  - Income Info: NOI/Unit, Occupancy %, Cap Rate
  - Physical Info: Units, NRA, Year, Location, Quality, Condition, Amenities
  - Adjustments: Property Rights, Financing, Conditions, Market Time, Location, Size, Age/Condition, Other
- CONCLUSION TABLE: Transaction Price, Transactional Adj, Property Adj, Final, Net Adj %
- Subject unit calculation: Units × $/Unit = Indicated Value

**Current Store Coverage:**

EXISTING (3 comparables with basic fields):
```
comp1-name, comp1-address, comp1-sale-date, comp1-sale-price
comp1-units, comp1-price-per-unit
comp1-gba, comp1-price-per-sf
comp1-year, comp1-cap-rate
comp1-adj-property-rights, comp1-adj-financing
comp1-adj-conditions-sale, comp1-adj-market-time
comp1-adj-location, comp1-adj-size
comp1-adj-age-condition, comp1-adj-other

[comp2 and comp3 have same pattern]
```

EXISTING (Subject + Conclusion):
```
subject-units, subject-gba, subject-year
subject-site-area, subject-parking, subject-condition
sales-value-indication (single number)
sales-adjustment-summary (narrative)
```

**MISSING FIELDS:**

Comparable 4 and 5 (catalog shows 5 comps):
```
comp4-[all fields]
comp5-[all fields]
```

Income Info Fields (for all 5 comps):
```
comp1-noi-per-unit
comp1-occupancy-percent
comp1-financing-terms
comp1-property-rights-detail
comp1-condition-rating
comp1-quality-rating
comp1-amenities-list
comp1-location-rating

[Same for comp2-5]
```

Adjustment Detail Fields:
```
comp1-adj-transactional-total
comp1-adj-property-total
comp1-adj-net-percent
comp1-final-adjusted-value

[Same for comp2-5]
```

Subject Fields:
```
subject-price-per-unit-concluded
subject-total-indicated-value
subject-adjustment-range-low
subject-adjustment-range-high
```

**Coverage Percentage:** 40%
**Priority:** HIGH - Missing comps 4-5 and income/quality data for grid completeness

---

### 3. Rental Survey Section

**Catalog Requirement:** `image38.png` + `image40.png` + `image41.png`

**Expected Fields:**
- SURVEY COMPARISON TABLE (5 rental comparables) with:
  - Property Info: Name, Address, City
  - Rent Survey: Type, Rent/Unit, Rent/SF, Amenities, Utilities, Parking, Laundry
  - Building Info: Units, SF, Location, Quality, Condition, Appeal, Amenities, Security
- 1BR UNITS ANALYSIS: 15 comp rows + HIGH/AVG/MED/LOW summaries + Conclusion (SF, $/unit, $/SF)
- 2BR UNITS ANALYSIS: 15 comp rows + summaries + Conclusion (SF, $/unit, $/SF)

**Current Store Coverage:**

EXISTING:
```
NONE - No rental survey section exists in store
```

Calculator has unit types but not rental comps:
```
calc-type1-rent (market rent for unit type 1)
calc-type2-rent (market rent for unit type 2)
[etc - but these are subject property rents, not comparable surveys]
```

**MISSING FIELDS:**

Rental Comparable Survey (5 comps):
```
rental-comp1-name
rental-comp1-address
rental-comp1-city
rental-comp1-units
rental-comp1-sf
rental-comp1-location-rating
rental-comp1-quality-rating
rental-comp1-condition-rating
rental-comp1-appeal-rating
rental-comp1-amenities
rental-comp1-security
rental-comp1-parking
rental-comp1-laundry
rental-comp1-utilities-included

[Same for rental-comp2 through rental-comp5]
```

1BR Unit Analysis:
```
rent-1br-analysis-intro
rent-1br-comp-count (15 comparables)
rent-1br-high-rent
rent-1br-avg-rent
rent-1br-median-rent
rent-1br-low-rent
rent-1br-conclusion-sf
rent-1br-conclusion-rent-per-unit
rent-1br-conclusion-rent-per-sf
rent-1br-final-conclusion
```

2BR Unit Analysis:
```
rent-2br-analysis-intro
rent-2br-comp-count (15 comparables)
rent-2br-high-rent
rent-2br-avg-rent
rent-2br-median-rent
rent-2br-low-rent
rent-2br-conclusion-sf
rent-2br-conclusion-rent-per-unit
rent-2br-conclusion-rent-per-sf
rent-2br-final-conclusion
```

**Coverage Percentage:** 0%
**Priority:** CRITICAL - Entire section missing, required for multi-family appraisals

---

### 4. Property Summary Section

**Catalog Requirement:** `image73.png`

**Expected Fields:**
- PROPERTY IDENTIFICATION table
- SITE table
- IMPROVEMENT table
- QUALITATIVE table (all Average ratings)

**Current Store Coverage:**

EXISTING (scattered across multiple sections):
```
property-name (cover section)
property-type-display (cover section)
street-address (cover section)
city, province (cover section)
site-total-area (site section)
site-acreage (site section)
zoning-classification (zone section)
total-units (exec section)
total-nra (exec section)
year-built (exec section)
building-style (exec section)
stories (exec section)
```

Improvements section has detailed fields:
```
impv-stories, impv-project-amenities, impv-unit-amenities
impv-foundation, impv-exterior-walls, impv-roof
impv-hvac, impv-electrical, impv-plumbing
impv-overall-condition, impv-functional-design
[etc - approximately 25+ improvement fields exist]
```

**MISSING FIELDS:**

Unified Property Summary Table Fields:
```
property-summary-legal-description
property-summary-effective-age
property-summary-actual-age
property-summary-quality-rating
property-summary-condition-rating
property-summary-functional-utility-rating
property-summary-appeal-rating
```

These fields exist but aren't in a summary format for image73's table structure.

**Coverage Percentage:** 70%
**Priority:** MEDIUM - Fields exist but may need reformatting for summary table display

---

### 5. Reconciliation Section

**Catalog Requirement:** `image46.png` + `image75.png`

**Expected Fields:**
- RECONCILIATION OF VALUES table: Valuation Scenarios, Interest, Date
- VALUES: Sales Approach, Income Approach, Final Value (both $/SF and total)
- VALUE CONCLUSION: Interest, Exposure Time, Effective Date, Final Value

**Current Store Coverage:**

EXISTING:
```
recon-income-value
recon-sales-value
recon-cost-value
recon-income-weight
recon-sales-weight
recon-cost-weight
recon-narrative
recon-final-value
recon-value-premise
recon-effective-date
```

**MISSING FIELDS:**
```
recon-valuation-scenario (AS STABILIZED, AS IS, etc.)
recon-interest-appraised (Fee Simple, Leasehold, etc.)
recon-sales-value-per-sf
recon-income-value-per-sf
recon-final-value-per-sf
recon-exposure-time (months)
recon-marketing-time (months)
```

**Coverage Percentage:** 65%
**Priority:** MEDIUM - Core values exist, missing metadata and per-SF breakdowns

---

## Priority Recommendations

### Critical Priority (Implement First)

1. **Add Rental Survey Section**
   - Create new section: `rental-survey`
   - Add 5 rental comparables with full detail fields
   - Add 1BR and 2BR unit analysis subsections
   - Estimated fields to add: 60-70

2. **Expand Sales Comparables to 5**
   - Add comp4 and comp5 with full field sets
   - Add income info fields to all comps (NOI/unit, occupancy)
   - Add quality/condition ratings
   - Estimated fields to add: 40-50

### High Priority (Implement Second)

3. **Add Income Expense Table Display Fields**
   - Add expense table columns: %EGR, $/SF, $/Unit, Total
   - Add Direct Cap table display fields
   - Link to calculator section for data source
   - Estimated fields to add: 35-40

4. **Add Unit Mix Contract vs Market Rent Comparison**
   - Add contract rent fields for each unit type
   - Add market rent analysis fields
   - Link to rental survey conclusions
   - Estimated fields to add: 15-20

### Medium Priority (Implement Third)

5. **Add Reconciliation Metadata Fields**
   - Add valuation scenario, interest type
   - Add per-SF calculations for all approaches
   - Add exposure/marketing time fields
   - Estimated fields to add: 8-10

6. **Create Property Summary Table Structure**
   - Add unified summary table subsection
   - Link existing fields from other sections
   - Add effective/actual age fields
   - Estimated fields to add: 5-8

---

## Field Count Summary

| Section | Catalog Required | Store Existing | Missing | Coverage % |
|---------|-----------------|----------------|---------|------------|
| Income Approach | ~50 | ~13 | ~37 | 25% |
| Sales Comparison | ~120 | ~48 | ~72 | 40% |
| Rental Survey | ~70 | 0 | ~70 | 0% |
| Property Summary | ~20 | ~14 | ~6 | 70% |
| Reconciliation | ~15 | ~10 | ~5 | 65% |
| **TOTAL** | **~275** | **~85** | **~190** | **31%** |

---

## Implementation Notes

### Data Flow Architecture

The store currently has two layers:
1. **Calculator Section (CALC):** Input fields with user-editable values
2. **Approach Sections (INCOME/SALES):** Narrative analysis fields

**Gap:** Missing third layer for **display table fields** that format calculator data for report rendering.

**Recommendation:** Add subsections to Income/Sales approaches:
- `income-expense-table` subsection with display fields
- `income-direct-cap-table` subsection with display fields
- `sales-comparison-grid` subsection with all comp data
- `sales-adjustment-grid` subsection with adjustment breakdowns

### Field Mapping Strategy

Many missing fields can be auto-calculated from existing data:
- `income-expense-table-taxes-per-sf` = `calc-exp-taxes` / `total-nra`
- `income-expense-table-taxes-egr-percent` = `calc-exp-taxes` / `calc-egr` × 100
- `comp1-price-per-sf` = `comp1-sale-price` / `comp1-gba`

**Recommendation:** Create computed field helpers in store to derive display values from input values.

### Test Data Validation

The catalog was built from actual reference PDF (North Battleford Apartments). Before implementing new fields:
1. Verify test data file has values for new fields
2. Cross-reference `northBattlefordTestData-REAL.ts` against image tables
3. Ensure field IDs match catalog naming conventions

---

## Next Steps

1. Review this analysis with frontend team to validate field requirements
2. Create detailed field specifications for Rental Survey section
3. Update TypeScript types to include new field structures
4. Implement fields in priority order (Critical → High → Medium)
5. Update test data to populate all new fields
6. Update HTML template renderers to display new table sections

---

**Analysis Complete**
**Total Missing Fields:** ~190
**Estimated Implementation Effort:** Significant - affects store schema, types, renderers, and test data
