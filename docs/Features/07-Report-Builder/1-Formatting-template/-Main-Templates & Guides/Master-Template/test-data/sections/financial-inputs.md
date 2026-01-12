# Financial Input Fields

These are the USER INPUT fields for the Income Approach calculator.

**Rule:** User enters these. Calculator computes everything else.

---

## Unit Mix Inputs

Controls rental revenue calculations.

| Field ID | Type | Example | Notes |
|----------|------|---------|-------|
| `calc-total-units` | number | 16 | Total units in property |   
| `calc-type1-name` | string | "1BR/1BA" | Unit type label |
| `calc-type1-count` | number | 4 | Count of this type |
| `calc-type1-sf` | number | 550 | SF per unit |
| `calc-type1-rent` | number | 900 | Market rent $/month |
| `calc-type2-name` | string | "2BR/1BA" | Unit type label |
| `calc-type2-count` | number | 12 | Count of this type |
| `calc-type2-sf` | number | 667 | SF per unit |
| `calc-type2-rent` | number | 1060 | Market rent $/month |
| `calc-type3-*` | ... | ... | (same pattern) |
| `calc-type4-*` | ... | ... | (same pattern) |

**Calculated from these:**
- Annual rental revenue = count × rent × 12
- Total SF = sum of (count × sf)
- $/Unit, $/SF metrics

---

## Other Income Inputs

| Field ID | Type | Example | Notes |
|----------|------|---------|-------|
| `calc-parking-per-unit` | number | 25 | Monthly parking $/unit |
| `calc-laundry-per-unit` | number | 15 | Monthly laundry $/unit |

**Calculated:** Annual other income = (parking + laundry) × units × 12

---

## Vacancy & Loss Rates

| Field ID | Type | Example | Notes |
|----------|------|---------|-------|
| `calc-vacancy-rate` | number | 4 | Vacancy % |
| `calc-bad-debt-rate` | number | 1 | Bad debt % |
| `calc-concessions-rate` | number | 0.5 | Concessions % |

**Calculated:** Vacancy loss = PGR × (vacancy + bad debt + concessions) / 100

---

## Expense Inputs (per unit/year)

| Field ID | Type | Example | Notes |
|----------|------|---------|-------|
| `calc-exp-taxes` | number | 1168 | Property taxes $/unit/yr |
| `calc-exp-insurance` | number | 710 | Insurance $/unit/yr |
| `calc-exp-repairs` | number | 830 | Repairs $/unit/yr |
| `calc-exp-utilities` | number | 1315 | Utilities $/unit/yr |
| `calc-exp-payroll` | number | 500 | Payroll $/unit/yr |
| `calc-exp-management` | number | 4.25 | Management % of EGR |
| `calc-exp-admin` | number | 0 | Admin $/unit/yr |
| `calc-exp-reserves` | number | 300 | Reserves $/unit/yr |
| `calc-exp-other` | number | 245 | Other $/unit/yr |

**Note:** Management is a % of EGR. All others are $/unit/year.

**Calculated:**
- Annual expense = input × total units
- Management = EGR × (rate / 100)
- Total expenses = sum of all categories

---

## Capitalization Input

| Field ID | Type | Example | Notes |
|----------|------|---------|-------|
| `calc-cap-rate` | number | 6.25 | Cap rate % |

**Calculated:** Indicated Value = NOI / (cap rate / 100)

---

## What Gets Calculated (NOT user input)

These fields are OUTPUT - computed by the calculator:

| Field ID | Calculation |
|----------|-------------|
| `calc-pgr` | Rental revenue + Other income |
| `calc-vacancy-loss` | PGR × vacancy rates |
| `calc-egr` | PGR - Vacancy loss |
| `calc-expenses-total` | Sum of all expense categories |
| `calc-noi` | EGR - Expenses |
| `calc-indicated-value` | NOI / Cap rate |
| `calc-*-per-unit` | Value / total units |
| `calc-*-per-sf` | Value / total SF |
| `calc-expense-ratio` | Expenses / EGR × 100 |

---

## Adding New Input Fields

1. Add field to this documentation
2. Add to `northBattlefordTestData.ts`
3. Add to calculator panel UI (InputPanel or relevant section)
4. Add to `runCalculations()` if it affects calculations
5. Add to postMessage bridge if it goes to template
