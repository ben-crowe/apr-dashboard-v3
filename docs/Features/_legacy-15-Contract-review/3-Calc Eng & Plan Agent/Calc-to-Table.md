# Calculator to Template Table Field Mapping

This document shows each table exactly as it appears in the report template, with field IDs for each cell.

---

## Development Flow

### Phase 1: CALC DEMO PAGE (Current Focus)
**File:** `src/features/calculator-demo-v4/CalculatorDemoPage.tsx`
**URL:** `http://localhost:8086/calculator-demo`

Get all calculator panels working with proper tables:
- [x] Create `OperatingHistoryPanel.tsx` (Page 43) ✅ EXISTS (Dec 30, 2025)
- [x] Fix gaps in `IncomeApproachPanel.tsx` (Page 48) ✅ Unit Mix added, columns fixed
- [x] Fix gaps in `SalesComparisonPanel.tsx` (Page 60) ✅ Stats rows, trans-adj, gross-adj added
- [x] Verify `ReconciliationPanel.tsx` (Page 62) ✅ Functional
- [x] `CostApproachPanel.tsx` - optional, exists as-is

### Phase 2: STANDALONE REPORT PAGES (Next)
**Location:** `public/report-pages/` (to be created)

Extract each finance page as standalone HTML:
```
public/report-pages/
├── page-43-operating-history.html
├── page-48-direct-capitalization.html
├── page-60-sales-comparison.html
├── page-62-reconciliation.html
└── (other pages as needed)
```

Each standalone page:
- Receives data via postMessage from calc
- Can be viewed/tested independently
- Maps 1:1 to a calculator panel

### Phase 3: FULL REPORT ASSEMBLY (Later)

Full report assembles:
- Standalone finance pages (from Phase 2)
- Non-calc pages (cover, TOC, photos, market analysis, etc.)
- PDF generation

> Template integration happens at deployment - not during calc development.

---

## Key Files

| Purpose | File Path |
|---------|-----------|
| **Calc Demo Page** | `src/features/calculator-demo-v4/CalculatorDemoPage.tsx` |
| **Calculator Panels** | `src/features/calculator-demo-v4/components/*.tsx` |
| **Report MF Template** | `docs/Report-MF-template-v2.6.0.html (2025-12-28) | (to extract single pages from)

**Report Template Reference (for field IDs only):**
`docs/15-Contract-review/1-Formatting-template/-Main-Templates & Guides/Master-Template/Report-MF-template-LIVE-2025-12-27.html` (v2.4.0)
NOTE--need to make sure our cal has the correct id's as it seems like it used this as field id refercne


---

## Calculator Panel → Report Page Mapping

| Calculator Panel | Status | Report Page | Standalone Page |
|------------------|--------|-------------|-----------------|
| `OperatingHistoryPanel.tsx` | ✅ **Complete** | Page 43 | `page-43-operating-history.html` |
| `IncomeApproachPanel.tsx` | ✅ **Complete** | Page 48 | `page-48-direct-capitalization.html` |
| `SalesComparisonPanel.tsx` | ✅ **Complete** | Page 60 | `page-60-sales-comparison.html` |
| `CostApproachPanel.tsx` | ✅ Exists (optional) | (optional) | `page-XX-cost-approach.html` |
| `ReconciliationPanel.tsx` | ✅ **Complete** | Page 62 | `page-62-reconciliation.html` |

---



---

## Page 48 - Direct Capitalization (Income Approach)

**Maps to:** `IncomeApproachPanel.tsx` in calculator

### Calculator Panel (Current)

| Item | Annual | $/Unit | $/SF | % of PGR | % of EGR |
|------|--------|--------|------|----------|----------|
| REVENUE | | | | | |
| Rental Revenue | `calc-total-rental-revenue` | `calc-rental-revenue-per-unit` | `calc-rental-revenue-per-sf` | % | - |
| Other Income | `calc-other-income` | `calc-other-income-per-unit` | `calc-other-income-per-sf` | % | - |
| **Potential Gross Revenue** | `calc-pgr` | `calc-pgr-per-unit` | `calc-pgr-per-sf` | 100% | - |
| Less: Vacancy & Collection | `calc-vacancy-loss` | `calc-vacancy-per-unit` | `calc-vacancy-per-sf` | % | - |
| **Effective Gross Revenue** | `calc-egr` | `calc-egr-per-unit` | `calc-egr-per-sf` | % | 100% |
| EXPENSES | | | | | |
| Taxes | `calc-exp-taxes-annual` | `/unit` | `/sf` | - | % |
| Insurance | `calc-exp-insurance-annual` | `/unit` | `/sf` | - | % |
| Repairs & Maintenance | `calc-exp-repairs-annual` | `/unit` | `/sf` | - | % |
| Payroll | `calc-exp-payroll-annual` | `/unit` | `/sf` | - | % |
| Utilities | `calc-exp-utilities-annual` | `/unit` | `/sf` | - | % |
| Management | `calc-exp-management-annual` | `/unit` | `/sf` | - | % |
| Other | `calc-exp-other-annual` | `/unit` | `/sf` | - | % |
| **Total Expenses** | `calc-expenses-total` | `calc-expenses-per-unit` | `calc-expenses-per-sf` | - | `calc-expense-ratio` |
| VALUE INDICATION | | | | | |
| **Net Operating Income** | `calc-noi` | `calc-noi-per-unit` | `calc-noi-per-sf` | - | - |
| Cap Rate | `calc-cap-rate` | | | | |
| Raw Value | `calc-raw-value` | | | | |
| Adjustments | `calc-adj-total` | | | | |
| **Indicated Value** | `calc-indicated-value` | | | | |

---

### Report Template Page 48 (4 Tables)

**Table 1: DIRECT CAPITALIZATION (Unit Mix)**

| Unit Mix | Units | Category | Contract | Market | Cont v Mkt | $/Unit | $/SF | $/Year |
|----------|-------|----------|----------|--------|------------|--------|------|--------|
| Type 1 bed / 1 bath | `calc-type1-count` | 1 Bed | `calc-type1-contract-rent` | `calc-type1-rent` | `calc-type1-cont-v-market` | `calc-type1-per-unit` | `calc-type1-per-sf` | `calc-type1-annual` |
| Flat 2 bed / 1 bath | `calc-type2-count` | 2 Bed | `calc-type2-contract-rent` | `calc-type2-rent` | `calc-type2-cont-v-market` | `calc-type2-per-unit` | `calc-type2-per-sf` | `calc-type2-annual` |
| **TOTAL RENTAL REVENUE** | `total-units` | | | | | `calc-type-total-per-unit` | `calc-type-total-per-sf` | `calc-total-rental-revenue` |

**Table 2: POTENTIAL GROSS REVENUE**

| Item | %PGR | %EGR | $/Unit | $/SF | Annual |
|------|------|------|--------|------|--------|
| Other Income (Miscellaneous) | 0% | 0% | `calc-other-income-per-unit` | `calc-other-income-per-sf` | `calc-other-income` |
| **POTENTIAL GROSS REVENUE** | | | `calc-pgr-per-unit` | `calc-pgr-per-sf` | `calc-pgr` |
| Vacancy | `calc-vacancy-rate` | `calc-vacancy-rate` | `calc-vacancy-per-unit` | `calc-vacancy-per-sf` | `calc-vacancy-loss` |
| **EFFECTIVE GROSS REVENUE** | | | `calc-egr-per-unit` | `calc-egr-per-sf` | `calc-egr` |

**Table 3: OPERATING EXPENSES**

| Item | %PGR | %EGR | $/Unit | $/SF | Annual |
|------|------|------|--------|------|--------|
| Real Estate Taxes | `calc-exp-taxes-pct-pgr` | `calc-exp-taxes-pct-egr` | `calc-exp-taxes-per-unit` | `calc-exp-taxes-per-sf` | `calc-exp-taxes-annual` |
| Insurance | `calc-exp-insurance-pct-pgr` | `calc-exp-insurance-pct-egr` | `calc-exp-insurance-per-unit` | `calc-exp-insurance-per-sf` | `calc-exp-insurance-annual` |
| Repairs & Maintenance | `calc-exp-repairs-pct-pgr` | `calc-exp-repairs-pct-egr` | `calc-exp-repairs-per-unit` | `calc-exp-repairs-per-sf` | `calc-exp-repairs-annual` |
| Payroll | `calc-exp-payroll-pct-pgr` | `calc-exp-payroll-pct-egr` | `calc-exp-payroll-per-unit` | `calc-exp-payroll-per-sf` | `calc-exp-payroll-annual` |
| Utilities | `calc-exp-utilities-pct-pgr` | `calc-exp-utilities-pct-egr` | `calc-exp-utilities-per-unit` | `calc-exp-utilities-per-sf` | `calc-exp-utilities-annual` |
| Management Fees | `calc-exp-management-pct-pgr` | `calc-exp-management-pct-egr` | `calc-exp-management-per-unit` | `calc-exp-management-per-sf` | `calc-exp-management-annual` |
| Other Expenses | `calc-exp-other-pct-pgr` | `calc-exp-other-pct-egr` | `calc-exp-other-per-unit` | `calc-exp-other-per-sf` | `calc-exp-other-annual` |
| **TOTAL OPERATING EXPENSES** | `calc-expense-ratio` | `calc-expense-ratio` | `calc-expenses-per-unit` | `calc-expenses-per-sf` | `calc-expenses-total` |

**Table 4: NET OPERATING INCOME**

| Item | $/Unit | $/SF | Total |
|------|--------|------|-------|
| Net Operating Income | `calc-noi-per-unit` | `calc-noi-per-sf` | `calc-noi` |
| Capitalization Rate | | | `calc-cap-rate` |
| Capitalized Value | | | `calc-indicated-value` |
| **INDICATED VALUE (ROUNDED)** | `calc-value-per-unit` | `calc-value-per-sf` | `calc-indicated-value-rounded` |

---

### Gap Analysis: Calc Panel vs Report Template

| Gap | Calc Panel | Report Template | Status |
|-----|------------|-----------------|--------|
| Unit Mix table | ✅ Has type1-4 with Contract/Market/% Market | Has dedicated table | ✅ **COMPLETE** |
| Column order | ✅ Matches template | Annual last | ✅ **COMPLETE** |
| %PGR column | Has it | Has it | ✅ Match |
| %EGR column | Has it | Has it | ✅ Match |
| Raw Value / Adjustments | Has them | Not shown | ✅ Internal only |
| Indicated Value Rounded | Shows "Indicated Value" | Has rounded row | ⚠️ Minor - could add explicit rounded display |

**Updated:** 2026-01-03 - Unit Mix and column order gaps fixed



---

## Page 60 - Sales Comparison Approach (Direct Comparison)

**Maps to:** `SalesComparisonPanel.tsx` in calculator

### Calculator Panel (Current)

**Table 1: Comparable Sales**

| Comp | Property | Sale Date | Sale Price | Units | SF | Year | $/Unit | $/SF |
|------|----------|-----------|------------|-------|-----|------|--------|------|
| 1 | `comp1-address` | `comp1-sale-date` | `comp1-sale-price` | `comp1-units` | `comp1-sf` | `comp1-year` | `comp1-price-per-unit` | `comp1-price-per-sf` |
| 2 | `comp2-address` | `comp2-sale-date` | `comp2-sale-price` | `comp2-units` | `comp2-sf` | `comp2-year` | `comp2-price-per-unit` | `comp2-price-per-sf` |
| 3 | `comp3-address` | `comp3-sale-date` | `comp3-sale-price` | `comp3-units` | `comp3-sf` | `comp3-year` | `comp3-price-per-unit` | `comp3-price-per-sf` |
| 4 | `comp4-address` | `comp4-sale-date` | `comp4-sale-price` | `comp4-units` | `comp4-sf` | `comp4-year` | `comp4-price-per-unit` | `comp4-price-per-sf` |
| 5 | `comp5-address` | `comp5-sale-date` | `comp5-sale-price` | `comp5-units` | `comp5-sf` | `comp5-year` | `comp5-price-per-unit` | `comp5-price-per-sf` |

**Table 2: Adjustments Grid**

| Category | Comp 1 | Comp 2 | Comp 3 | Comp 4 | Comp 5 |
|----------|--------|--------|--------|--------|--------|
| Property Rights | `comp1-adj-rights` | `comp2-adj-rights` | `comp3-adj-rights` | `comp4-adj-rights` | `comp5-adj-rights` |
| Financing | `comp1-adj-financing` | `comp2-adj-financing` | `comp3-adj-financing` | `comp4-adj-financing` | `comp5-adj-financing` |
| Conditions of Sale | `comp1-adj-conditions` | `comp2-adj-conditions` | `comp3-adj-conditions` | `comp4-adj-conditions` | `comp5-adj-conditions` |
| Market Conditions | `comp1-adj-market` | `comp2-adj-market` | `comp3-adj-market` | `comp4-adj-market` | `comp5-adj-market` |
| Location | `comp1-adj-location` | `comp2-adj-location` | `comp3-adj-location` | `comp4-adj-location` | `comp5-adj-location` |
| Size | `comp1-adj-size` | `comp2-adj-size` | `comp3-adj-size` | `comp4-adj-size` | `comp5-adj-size` |
| Age/Condition | `comp1-adj-age` | `comp2-adj-age` | `comp3-adj-age` | `comp4-adj-age` | `comp5-adj-age` |
| Other | `comp1-adj-other` | `comp2-adj-other` | `comp3-adj-other` | `comp4-adj-other` | `comp5-adj-other` |
| **NET ADJUSTMENT** | `comp1-net-adj` | `comp2-net-adj` | `comp3-net-adj` | `comp4-net-adj` | `comp5-net-adj` |
| **ADJUSTED $/UNIT** | `comp1-adj-price-per-unit` | `comp2-adj-price-per-unit` | `comp3-adj-price-per-unit` | `comp4-adj-price-per-unit` | `comp5-adj-price-per-unit` |

**Table 3: Value Indication**

| Item | Value |
|------|-------|
| Low $/Unit | `sca-adjusted-value-low` |
| High $/Unit | `sca-adjusted-value-high` |
| Average $/Unit | `sca-avg-value-per-unit` |
| **Indicated $/Unit** | `sca-concluded-value-per-unit` |

---

### Report Template Page 60 (2 Tables)

**Table 1: DIRECT COMPARISON APPROACH CONCLUSION (UNIT)**

| # | Transaction Price | Transactional | Adjusted | Property | Final | Net Adj | Gross Adj |
|---|-------------------|---------------|----------|----------|-------|---------|-----------|
| 1 | `comp1-price-per-unit` | `comp1-total-trans-adj` | `comp1-trans-adj-price` | `comp1-total-phys-adj` | `comp1-adj-price-per-unit` | `comp1-net-adj` | `comp1-gross-adj` |
| 2 | `comp2-price-per-unit` | `comp2-total-trans-adj` | `comp2-trans-adj-price` | `comp2-total-phys-adj` | `comp2-adj-price-per-unit` | `comp2-net-adj` | `comp2-gross-adj` |
| 3 | `comp3-price-per-unit` | `comp3-total-trans-adj` | `comp3-trans-adj-price` | `comp3-total-phys-adj` | `comp3-adj-price-per-unit` | `comp3-net-adj` | `comp3-gross-adj` |
| 4 | `comp4-price-per-unit` | `comp4-total-trans-adj` | `comp4-trans-adj-price` | `comp4-total-phys-adj` | `comp4-adj-price-per-unit` | `comp4-net-adj` | `comp4-gross-adj` |
| 5 | `comp5-price-per-unit` | `comp5-total-trans-adj` | `comp5-trans-adj-price` | `comp5-total-phys-adj` | `comp5-adj-price-per-unit` | `comp5-net-adj` | `comp5-gross-adj` |
| HIGH | `dca-high-price-per-unit` | `dca-high-trans-adj` | `dca-high-trans-adj-price` | `dca-high-phys-adj` | `dca-high-final-price` | `dca-high-net-adj` | `dca-high-gross-adj` |
| AVG | `dca-avg-price-per-unit` | `dca-avg-trans-adj` | `dca-avg-trans-adj-price` | `dca-avg-phys-adj` | `dca-avg-final-price` | `dca-avg-net-adj` | `dca-avg-gross-adj` |
| MED | `dca-med-price-per-unit` | `dca-med-trans-adj` | `dca-med-trans-adj-price` | `dca-med-phys-adj` | `dca-med-final-price` | `dca-med-net-adj` | `dca-med-gross-adj` |
| LOW | `dca-low-price-per-unit` | `dca-low-trans-adj` | `dca-low-trans-adj-price` | `dca-low-phys-adj` | `dca-low-final-price` | `dca-low-net-adj` | `dca-low-gross-adj` |

**Table 2: VALUE CALCULATION**

| | Subject Unit | | $/Unit | | Value |
|---|--------------|---|--------|---|-------|
| | `subject-units` | x | `sca-concluded-value-per-unit` | = | `sca-indicated-value` |
| **INDICATED VALUE (ROUNDED)** | | | `sca-concluded-value-per-unit` | | `sca-indicated-value-rounded` |

**Table 3: DIRECT COMPARISON APPROACH (Summary)**

| Item | Value |
|------|-------|
| Indicated Value | `sca-indicated-value-rounded` |
| $/SF NRA | `sca-value-per-sf` |

---

### Gap Analysis: Calc Panel vs Report Template (Sales Comparison)

| Gap | Calc Panel | Report Template | Status |
|-----|------------|-----------------|--------|
| Adjustment columns | ✅ 8 categories + Trans/Property grouping | Combines into Transactional + Property | ✅ **COMPLETE** |
| Trans-adjusted price | ✅ `transAdjPrice` calculated (line 159) | Has `compX-trans-adj-price` | ✅ **COMPLETE** |
| Statistics rows | ✅ `calcStats()` function (line 193+) | HIGH/AVG/MED/LOW rows | ✅ **COMPLETE** |
| Gross Adjustment | ✅ `grossAdj` calculation (lines 168-171) | Has `compX-gross-adj` | ✅ **COMPLETE** |
| Property details | In Comparable Sales table | On separate pages (52-58) | ✅ Different purpose |
| Value calc table | Shows subject units × $/unit | Full breakdown | ✅ **COMPLETE** |

**Updated:** 2026-01-03 - All major gaps fixed, panel fully functional

---

## Cost Approach (Calculator Only)

**Maps to:** `CostApproachPanel.tsx` in calculator

**Note:** The report template states "Cost Approach was not presented in this analysis" - this approach is **optional** and not rendered in the current template. The calc panel supports it for properties where Cost Approach is applicable.

### Calculator Panel (Current)

**Section 1: Land Valuation**

| Field | ID |
|-------|-----|
| Area (SF) | `cost-land-sf` |
| Rate/SF | `cost-land-rate-per-sf` |
| **Land Value** | `cost-land-value` |

**Section 2: Replacement Cost New (RCN)**

| Field | ID |
|-------|-----|
| GBA | `cost-rcn-gba` |
| Cost/SF | `cost-rcn-rate-per-sf` |
| Indirect % | `cost-rcn-indirect-pct` |
| Entrepreneur % | `cost-rcn-entrepreneur-pct` |
| Direct Costs | `cost-rcn-direct-costs` |
| Indirect Costs | `cost-rcn-indirect-costs` |
| Entrepreneur Amount | `cost-rcn-entrepreneur-amt` |
| **Total RCN** | `cost-rcn-total` |

**Section 3: Depreciation**

| Field | ID |
|-------|-----|
| Actual Age | `cost-depr-physical-age` |
| Economic Life | `cost-depr-physical-life` |
| Effective Age | `cost-depr-physical-effective-age` |
| Remaining Life | `cost-depr-physical-remaining-life` |
| Functional Obsolescence | `cost-depr-functional-total` |
| External Obsolescence | `cost-depr-external-total` |
| Physical Depr % | `cost-depr-physical-pct` |
| Physical Depr $ | `cost-depr-physical-amt` |
| **Total Depreciation** | `cost-depr-total-amt` / `cost-depr-total-pct` |

**Section 4: Site Improvements**

| Field | ID |
|-------|-----|
| Parking Spaces | `cost-site-parking-spaces` |
| Cost/Space | `cost-site-parking-cost` |
| Parking Total | `cost-site-parking-total` |
| Landscaping | `cost-site-landscaping` |
| Paving | `cost-site-paving` |
| Utilities | `cost-site-utilities` |
| Other | `cost-site-other` |
| **Total Site Improvements** | `cost-site-total` |

**Section 5: Value Indication**

| Field | ID |
|-------|-----|
| Land Value | `cost-land-value` |
| + Depreciated RCN | `cost-depreciated-value` |
| + Site Improvements | `cost-site-total` |
| **= Indicated Value** | `cost-indicated-value` |

---

### Gap Analysis: Cost Approach

| Gap | Calc Panel | Report Template | Action Needed |
|-----|------------|-----------------|---------------|
| Entire section | Full implementation | "Not presented" for this property | ✓ Optional - only render when applicable |
| Template page | N/A | Would need new Page 61.5 if used | **CREATE** Cost Approach template page when needed |

---

## Page 62 - Reconciliation of Value

**Maps to:** `ReconciliationPanel.tsx` in calculator

### Calculator Panel (Current)

| Approach | Indicated Value | Weight (%) | Weighted Value |
|----------|-----------------|------------|----------------|
| Income Approach | `calc-indicated-value` | `recon-income-weight` | (calculated) |
| Sales Comparison | `sca-indicated-value` | `recon-sales-weight` | (calculated) |
| Cost Approach | `cost-indicated-value` | `recon-cost-weight` | (calculated) |
| **Total** | | 100% | `recon-final-value` |

**Additional Display:**
- Final Reconciled Value (large display)
- $/Unit calculation
- $/SF calculation

---

### Report Template Page 62

**Table: RECONCILIATION OF VALUES**

| Item | Value |
|------|-------|
| **VALUATION SCENARIOS** | `value-scenario` |
| Interest | `property-rights` |
| Date | `recon-effective-date` |
| **DIRECT COMPARISON APPROACH** | |
| Indicated Value | `sca-indicated-value` |
| $/SF NRA | `sca-value-per-sf` |
| **INCOME APPROACH - DIRECT CAPITALIZATION** | |
| NOI | `calc-noi` |
| NOI $/SF NRA | `calc-noi-per-sf` |
| Capitalization Rate (OAR) | `calc-cap-rate` |
| Indicated Value | `calc-indicated-value` |
| $/SF NRA | `calc-value-per-sf` |
| **FINAL VALUE CONCLUSION** | `recon-final-value` |
| $/SF NRA | `recon-final-value-per-sf` |

---

### Gap Analysis: Calc Panel vs Report Template (Reconciliation)

| Gap | Calc Panel | Report Template | Action Needed |
|-----|------------|-----------------|---------------|
| Weighting system | Has weight inputs for each approach | No weights shown - just final value | ✓ Weights are internal calc, template shows conclusion |
| Cost Approach row | Has it | Not shown (excluded for this property) | ✓ Conditional - only show when applicable |
| Detailed breakdown | Shows weighted values per approach | Shows final only | ✓ Calc detail → Template summary |
| Valuation scenario | Missing | Has header with scenario type | **ADD** `value-scenario` field |
| Effective date | Uses store date | Has `recon-effective-date` | **VERIFY** field mapping |
| NOI display | In Income section | Repeated in reconciliation | ✓ Template pulls from calc values |




---------
---------

## Page 43 - Operating History

**Maps to:** `OperatingHistoryPanel.tsx` ✅ **EXISTS** (Created Dec 30, 2025)

### Calculator Panel (COMPLETE)

**Structure:** Side-by-side YTD vs Projection comparison

| Item | YTD Input | Projection (auto from calc) |
|------|-----------|----------------------------|
| Revenue fields | User inputs `hist-*` | Pulls `calc-*` from Income Approach |
| Expense fields | User inputs `hist-*` | Pulls `calc-*` from Income Approach |
| NOI | Calculated from YTD inputs | Pulls `calc-noi` |

---

### Report Template Page 43

| CATEGORY | YTD 2025 TOTAL | YTD 2025 $/UNIT | YTD 2025 %/PGR | PROJECTION TOTAL | PROJECTION $/UNIT | PROJECTION %/PGR |
|----------|----------------|-----------------|----------------|------------------|-------------------|------------------|
| **RENTAL REVENUE** | | | | | | |
| Total Multifamily Revenue | `hist-revenue-multifamily-total` | `hist-revenue-multifamily-per-unit` | `hist-revenue-multifamily-pct-pgr` | `calc-total-rental-revenue` | `calc-rental-revenue-per-unit` | `revenue-multifamily-proj-pct` |
| **TOTAL RENTAL REVENUE** | `hist-revenue-rental-total` | `hist-revenue-rental-per-unit` | `hist-revenue-rental-pct-pgr` | `calc-total-rental-revenue` | `calc-rental-revenue-per-unit` | `revenue-rental-proj-pct` |
| **MISCELLANEOUS REVENUE** | | | | | | |
| Parking Income | `hist-revenue-parking-total` | `hist-revenue-parking-per-unit` | `hist-revenue-parking-pct-pgr` | `calc-other-income` | `calc-other-income-per-unit` | `revenue-parking-proj-pct` |
| Laundry | `hist-revenue-laundry-total` | `hist-revenue-laundry-per-unit` | `hist-revenue-laundry-pct-pgr` | `revenue-laundry-proj-total` | `hist-revenue-laundry-per-unit` | `revenue-laundry-proj-pct` |
| **TOTAL MISCELLANEOUS REVENUE** | `hist-revenue-misc-total` | `hist-revenue-misc-per-unit` | `hist-revenue-misc-pct-pgr` | `calc-other-income` | `calc-other-income-per-unit` | `revenue-misc-proj-pct` |
| **POTENTIAL GROSS REVENUE** | `hist-pgr-total` | `hist-pgr-per-unit` | `hist-pgr-pct-pgr` | `calc-pgr` | `calc-pgr-per-unit` | `pgr-proj-pct` |
| **ALL VACANCY LOSS** | | | | | | |
| Vacancy | `hist-vacancy-total` | `hist-vacancy-per-unit` | `hist-vacancy-pct-pgr` | `calc-vacancy-loss` | `calc-vacancy-per-unit` | `calc-vacancy-rate` |
| **EFFECTIVE GROSS REVENUE** | `hist-egr-total` | `hist-egr-per-unit` | `hist-egr-pct-pgr` | `calc-egr` | `calc-egr-per-unit` | `egr-proj-pct` |
| **OPERATING EXPENSES** | | | | | | |
| Taxes | `hist-exp-taxes-total` | `hist-exp-taxes-per-unit` | `hist-exp-taxes-pct-pgr` | `calc-exp-taxes-annual` | `calc-exp-taxes-per-unit` | `calc-exp-taxes-pct-pgr` |
| Insurance | `hist-exp-insurance-total` | `hist-exp-insurance-per-unit` | `hist-exp-insurance-pct-pgr` | `calc-exp-insurance-annual` | `calc-exp-insurance-per-unit` | `calc-exp-insurance-pct-pgr` |
| Repairs & Maintenance | `hist-exp-repairs-total` | `hist-exp-repairs-per-unit` | `hist-exp-repairs-pct-pgr` | `calc-exp-repairs-annual` | `calc-exp-repairs-per-unit` | `calc-exp-repairs-pct-pgr` |
| Payroll | `hist-exp-payroll-total` | `hist-exp-payroll-per-unit` | `hist-exp-payroll-pct-pgr` | `calc-exp-payroll-annual` | `calc-exp-payroll-per-unit` | `calc-exp-payroll-pct-pgr` |
| Utilities | `hist-exp-utilities-total` | `hist-exp-utilities-per-unit` | `hist-exp-utilities-pct-pgr` | `calc-exp-utilities-annual` | `calc-exp-utilities-per-unit` | `calc-exp-utilities-pct-pgr` |
| Management Fees | `hist-exp-management-total` | `hist-exp-management-per-unit` | `hist-exp-management-pct-pgr` | `calc-exp-management-annual` | `calc-exp-management-per-unit` | `calc-exp-management-pct-pgr` |
| Other Expenses | `hist-exp-other-total` | `hist-exp-other-per-unit` | `hist-exp-other-pct-pgr` | `calc-exp-other-annual` | `calc-exp-other-per-unit` | `calc-exp-other-pct-pgr` |
| **TOTAL OPERATING EXPENSES** | `hist-exp-total-total` | `hist-exp-total-per-unit` | `hist-exp-total-pct-pgr` | `calc-expenses-total` | `calc-expenses-per-unit` | `calc-expense-ratio` |
| **NET OPERATING INCOME** | `hist-noi-total` | `hist-noi-per-unit` | `hist-noi-pct-pgr` | `calc-noi` | `calc-noi-per-unit` | `noi-proj-pct` |

**Field Count:** 90 total (45 YTD hist-* + 45 Projection calc-*/proj-*)

---

### Gap Analysis: Operating History

| Gap | Calc Panel | Report Template | Status |
|-----|------------|-----------------|--------|
| Entire panel | ✅ `OperatingHistoryPanel.tsx` exists | Has full YTD vs Projection table | ✅ **COMPLETE** |
| YTD input fields | ✅ Has `hist-*` input fields | 45 `hist-*` fields | ✅ **COMPLETE** |
| YTD calculations | ✅ Auto-calculates $/Unit and %PGR | $/Unit and %PGR for each row | ✅ **COMPLETE** |
| Side-by-side display | ✅ Shows YTD next to Projection | Matches template layout | ✅ **COMPLETE** |
| Year label | ⚠️ May need verification | Dynamic "YTD 2025" header | Verify in browser |

**Updated:** 2026-01-03 - Panel created Dec 30, 2025
