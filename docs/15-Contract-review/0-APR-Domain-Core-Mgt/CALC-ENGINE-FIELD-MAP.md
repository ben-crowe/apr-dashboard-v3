# APR Dashboard Calc Engine Field Map

**Generated:** 2025-12-24
**Location:** `src/features/report-builder/store/reportBuilderStore.ts` → `runCalculations()`

---

## INPUT FIELDS (User Must Enter)

These 24 fields are read by the calc engine. User enters values in TDD Dashboard Tab "17 - INCOME ANALYSIS".

### Unit Mix Inputs (16 fields)
| Field ID | Label | Type |
|----------|-------|------|
| `calc-type1-count` | Unit Type 1 Count | number |
| `calc-type1-sf` | Unit Type 1 Avg SF | number |
| `calc-type1-rent` | Unit Type 1 Market Rent/Mo | currency |
| `calc-type1-contract-rent` | Unit Type 1 Contract Rent/Mo | currency |
| `calc-type2-count` | Unit Type 2 Count | number |
| `calc-type2-sf` | Unit Type 2 Avg SF | number |
| `calc-type2-rent` | Unit Type 2 Market Rent/Mo | currency |
| `calc-type2-contract-rent` | Unit Type 2 Contract Rent/Mo | currency |
| `calc-type3-count` | Unit Type 3 Count | number |
| `calc-type3-sf` | Unit Type 3 Avg SF | number |
| `calc-type3-rent` | Unit Type 3 Market Rent/Mo | currency |
| `calc-type4-count` | Unit Type 4 Count | number |
| `calc-type4-sf` | Unit Type 4 Avg SF | number |
| `calc-type4-rent` | Unit Type 4 Market Rent/Mo | currency |

### Other Income Inputs (3 fields)
| Field ID | Label | Type |
|----------|-------|------|
| `calc-parking-per-unit` | Parking Income/Unit/Mo | currency |
| `calc-laundry-per-unit` | Laundry Income/Unit/Mo | currency |
| `calc-other-income` | Other Income (Annual) | currency |

### Vacancy & Loss Inputs (3 fields)
| Field ID | Label | Type |
|----------|-------|------|
| `calc-vacancy-rate` | Vacancy Rate % | percent |
| `calc-bad-debt-rate` | Bad Debt Rate % | percent |
| `calc-concessions-rate` | Concessions Rate % | percent |

### Cap Rate & Adjustments (4 fields)
| Field ID | Label | Type |
|----------|-------|------|
| `calc-cap-rate` | Capitalization Rate % | percent |
| `calc-adj-capex` | CapEx Adjustment | currency |
| `calc-adj-leasing` | Leasing Adjustment | currency |
| `calc-adj-other` | Other Adjustments | currency |

### Expense Inputs (9 fields)
| Field ID | Label | Type | Calc Base |
|----------|-------|------|-----------|
| `calc-exp-management` | Management | currency | per_unit |
| `calc-exp-taxes` | Property Taxes | currency | per_unit |
| `calc-exp-insurance` | Insurance | currency | per_unit |
| `calc-exp-repairs` | Repairs & Maintenance | currency | per_unit |
| `calc-exp-utilities` | Utilities | currency | per_unit |
| `calc-exp-payroll` | Payroll | currency | per_unit |
| `calc-exp-admin` | Administrative | currency | per_unit |
| `calc-exp-reserves` | Reserves | currency | per_unit |
| `calc-exp-other` | Other Expenses | currency | per_unit |

---

## OUTPUT FIELDS (Calculated Automatically)

These ~85 fields are computed by `runCalculations()` and written to the store.

### Unit Mix Calculated (22 fields)
| Field ID | Formula | Description |
|----------|---------|-------------|
| `calc-type1-annual` | count × rent × 12 | Type 1 Annual Revenue |
| `calc-type1-per-unit` | annual / count | Type 1 Annual per Unit |
| `calc-type1-per-sf` | rent / sf | Type 1 Rent per SF |
| `calc-type1-cont-v-market` | contractRent / marketRent × 100 | Contract vs Market % |
| `calc-type2-annual` | count × rent × 12 | Type 2 Annual Revenue |
| `calc-type2-per-unit` | annual / count | Type 2 Annual per Unit |
| `calc-type2-per-sf` | rent / sf | Type 2 Rent per SF |
| `calc-type2-cont-v-market` | contractRent / marketRent × 100 | Contract vs Market % |
| `calc-type3-annual` | count × rent × 12 | Type 3 Annual Revenue |
| `calc-type3-per-unit` | annual / count | Type 3 Annual per Unit |
| `calc-type3-per-sf` | rent / sf | Type 3 Rent per SF |
| `calc-type4-annual` | count × rent × 12 | Type 4 Annual Revenue |
| `calc-type4-per-unit` | annual / count | Type 4 Annual per Unit |
| `calc-type4-per-sf` | rent / sf | Type 4 Rent per SF |
| `calc-total-units` | sum of all counts | Total Unit Count |
| `calc-total-sf` | sum(count × sf) | Total Square Footage |
| `calc-avg-unit-sf` | totalSf / totalUnits | Average Unit Size |
| `calc-total-rental-revenue` | sum of type annuals | Total Rental Revenue |
| `calc-avg-rent-per-unit` | rentalRevenue / units / 12 | Avg Rent per Unit |
| `calc-avg-rent-per-sf` | rentalRevenue / totalSf / 12 | Avg Rent per SF |
| `calc-type-total-per-unit` | rentalRevenue / units | Total per Unit |
| `calc-type-total-per-sf` | rentalRevenue / totalSf | Total per SF |

### Income Calculated (10 fields)
| Field ID | Formula | Description |
|----------|---------|-------------|
| `calc-parking-total` | parkingPerUnit × units × 12 | Annual Parking Income |
| `calc-laundry-total` | laundryPerUnit × units × 12 | Annual Laundry Income |
| `calc-total-other-income` | parking + laundry + other | Total Other Income |
| `calc-pgr` | rentalRevenue + otherIncome | Potential Gross Revenue |
| `calc-pgr-per-unit` | pgr / units | PGR per Unit |
| `calc-pgr-per-sf` | pgr / totalSf | PGR per SF |
| `calc-other-income-per-unit` | otherIncome / units | Other Income per Unit |
| `calc-other-income-per-sf` | otherIncome / totalSf | Other Income per SF |
| `calc-rental-revenue-per-unit` | rentalRevenue / units | Rental Revenue per Unit |

### Vacancy Calculated (5 fields)
| Field ID | Formula | Description |
|----------|---------|-------------|
| `calc-vacancy-loss` | pgr × totalVacancyRate | Vacancy & Loss Amount |
| `calc-vacancy-per-unit` | vacancyLoss / units | Vacancy per Unit |
| `calc-vacancy-per-sf` | vacancyLoss / totalSf | Vacancy per SF |
| `calc-egr` | pgr - vacancyLoss | Effective Gross Revenue |
| `calc-egr-per-unit` | egr / units | EGR per Unit |
| `calc-egr-per-sf` | egr / totalSf | EGR per SF |

### Expense Calculated (39 fields)

For EACH expense category (taxes, insurance, repairs, payroll, utilities, management, other):
| Field Pattern | Formula | Description |
|---------------|---------|-------------|
| `calc-exp-{name}-annual` | calculated expense | Annual Amount |
| `calc-exp-{name}-per-unit` | expense / units | Per Unit |
| `calc-exp-{name}-per-sf` | expense / totalSf | Per SF |
| `calc-exp-{name}-pct-pgr` | expense / pgr × 100 | % of PGR |
| `calc-exp-{name}-pct-egr` | expense / egr × 100 | % of EGR |

**Categories:** taxes, insurance, repairs, payroll, utilities, management, other = 7 × 5 = 35 fields

Plus totals:
| Field ID | Formula | Description |
|----------|---------|-------------|
| `calc-expenses-total` | sum of all expenses | Total Operating Expenses |
| `calc-expenses-per-unit` | total / units | Expenses per Unit |
| `calc-expenses-per-sf` | total / totalSf | Expenses per SF |
| `calc-expense-ratio` | total / egr × 100 | Operating Expense Ratio |

### NOI & Valuation (10 fields)
| Field ID | Formula | Description |
|----------|---------|-------------|
| `calc-noi` | egr - expenses | Net Operating Income |
| `calc-noi-per-unit` | noi / units | NOI per Unit |
| `calc-noi-per-sf` | noi / totalSf | NOI per SF |
| `calc-raw-value` | noi / capRate | Raw Capitalized Value |
| `calc-adj-total` | capex + leasing + other | Total Adjustments |
| `calc-indicated-value` | rawValue - adjustments | Indicated Value |
| `calc-indicated-value-rounded` | round(rawValue / 10000) × 10000 | Rounded Value |
| `calc-value-per-unit` | indicatedValue / units | Value per Unit |
| `calc-value-per-sf` | indicatedValue / totalSf | Value per SF |
| `calc-grm` | indicatedValue / rentalRevenue | Gross Rent Multiplier |

### Cross-Section Sync (1 field)
| Field ID | Source | Description |
|----------|--------|-------------|
| `recon-income-value` | calc-indicated-value | Syncs to Reconciliation |

---

## DATA FLOW

```
USER INPUT (TDD Dashboard)
    │
    ├── Unit Mix: calc-type1-count, calc-type1-sf, calc-type1-rent ...
    ├── Other Income: calc-parking-per-unit, calc-laundry-per-unit
    ├── Vacancy: calc-vacancy-rate, calc-bad-debt-rate
    ├── Expenses: calc-exp-taxes, calc-exp-insurance ...
    └── Valuation: calc-cap-rate, calc-adj-capex ...
    │
    ▼
runCalculations()
    │
    ├── Calculates: totalUnits, totalSf, rentalRevenue
    ├── Calculates: pgr, vacancyLoss, egr
    ├── Calculates: expensesTotal, noi
    └── Calculates: indicatedValue, valuePerUnit
    │
    ▼
STORE (sections[calc].fields)
    │
    ▼
interpolateTemplate() → {{calc-noi}} → $109,445
    │
    ▼
TEMPLATE (Report-MF-template.html Page 49)
```

---

## TEMPLATE FIELD USAGE

The template uses these calc fields on these pages:

| Page | Section | Key Fields Used |
|------|---------|-----------------|
| 49 | Income Table | calc-pgr, calc-egr, calc-noi, calc-*-per-unit |
| 49 | Expense Table | calc-exp-*-annual, calc-exp-*-pct-egr |
| 50 | Direct Cap | calc-cap-rate, calc-indicated-value |
| 50 | Value Summary | calc-value-per-unit, calc-value-per-sf, calc-grm |

---

*For Cursor/other agents: This is the authoritative list of calc engine fields.*
