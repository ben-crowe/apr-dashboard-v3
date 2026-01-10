# Calculator Field Reference v2
## Income Approach - Direct Capitalization

**Source:** Valcre workbook DIRECTCAP sheet  
**Workbook capacity:** 25 unit types, 25 expense lines, 4 adjustment scenarios  
**Recommended build:** 6 unit types, 7 expense categories, 2 cap rates

---

## SUMMARY

| Category | Input Fields | Calculated Fields |
|----------|-------------|-------------------|
| Unit Mix (×6 types) | 30 | 30 |
| Other Income | 3 | 3 |
| Vacancy & Loss | 4 | 5 |
| Revenue Summary | 0 | 7 |
| Expenses (7 categories) | 7 | 24 |
| NOI | 0 | 3 |
| Capitalization | 5 | 6 |
| **TOTAL** | **49** | **78** |

---

## 1. UNIT MIX (×6 unit types)

### Per-Type Fields (repeat for type1 through type6)

| Field ID Pattern | I/O | Type | Description |
|-----------------|-----|------|-------------|
| `calc-type{N}-name` | INPUT | text | Unit type name (e.g., "1 Bed / 1 Bath") |
| `calc-type{N}-count` | INPUT | number | Number of units |
| `calc-type{N}-sf` | INPUT | number | Avg SF per unit |
| `calc-type{N}-contract-rent` | INPUT | currency | Contract rent $/mo |
| `calc-type{N}-rent` | INPUT | currency | Market rent $/mo |
| `calc-type{N}-cont-v-market` | CALC | percentage | Contract ÷ Market ratio |
| `calc-type{N}-per-unit` | CALC | currency | Annual rent per unit |
| `calc-type{N}-per-sf` | CALC | currency | Annual rent per SF |
| `calc-type{N}-annual` | CALC | currency | Total annual rent |
| `calc-type{N}-total-sf` | CALC | number | Count × SF |

### Unit Mix Totals

| Field ID | I/O | Description |
|----------|-----|-------------|
| `calc-total-units` | CALC | Sum all counts |
| `calc-total-sf` | CALC | Sum all total-sf |
| `calc-avg-contract-rent` | CALC | Weighted avg contract rent |
| `calc-avg-market-rent` | CALC | Weighted avg market rent |
| `calc-subtotal-annual` | CALC | Sum all annual rent |

---

## 2. OTHER INCOME

| Field ID | I/O | Description |
|----------|-----|-------------|
| `calc-parking-per-unit` | INPUT | Parking income $/unit/mo |
| `calc-laundry-per-unit` | INPUT | Laundry income $/unit/mo |
| `calc-other-income-annual` | INPUT | Other income (annual) |
| `calc-parking-annual` | CALC | Parking × units × 12 |
| `calc-laundry-annual` | CALC | Laundry × units × 12 |
| `calc-total-other-income` | CALC | Sum all other income |

---

## 3. VACANCY & LOSS

| Field ID | I/O | Description |
|----------|-----|-------------|
| `calc-vacancy-rate` | INPUT | Vacancy loss rate % |
| `calc-concessions-rate` | INPUT | Concessions rate % |
| `calc-credit-loss-rate` | INPUT | Credit loss rate % |
| `calc-other-loss-rate` | INPUT | Other loss rate % |
| `calc-vacancy-amount` | CALC | PGR × vacancy-rate |
| `calc-total-vacancy-loss` | CALC | Sum all loss amounts |
| `calc-total-vacancy-rate` | CALC | Sum all rates |

---

## 4. REVENUE SUMMARY

| Field ID | I/O | Calculation |
|----------|-----|-------------|
| `calc-total-rental-revenue` | CALC | = subtotal-annual |
| `calc-pgr` | CALC | Rental + other income |
| `calc-pgr-per-unit` | CALC | PGR ÷ total-units |
| `calc-pgr-per-sf` | CALC | PGR ÷ total-sf |
| `calc-egr` | CALC | PGR - vacancy-loss |
| `calc-egr-per-unit` | CALC | EGR ÷ total-units |
| `calc-egr-per-sf` | CALC | EGR ÷ total-sf |

---

## 5. OPERATING EXPENSES

### Input Fields (user enters ANNUAL totals)

| Field ID | Description |
|----------|-------------|
| `calc-exp-taxes-annual` | Taxes (annual $) |
| `calc-exp-insurance-annual` | Insurance (annual $) |
| `calc-exp-repairs-annual` | Repairs & Maintenance (annual $) |
| `calc-exp-utilities-annual` | Utilities (annual $) |
| `calc-exp-management-annual` | Management (annual $) |
| `calc-exp-reserves-annual` | Reserves (annual $) |
| `calc-exp-other-annual` | Other expenses (annual $) |

### Calculated Fields (per category)

For each expense category, calculator outputs:
- `calc-exp-{category}-per-unit` = annual ÷ total-units
- `calc-exp-{category}-per-sf` = annual ÷ total-sf
- `calc-exp-{category}-pct-egr` = annual ÷ EGR × 100

### Expense Totals

| Field ID | Calculation |
|----------|-------------|
| `calc-expenses-total` | Sum all expense-annual |
| `calc-expenses-per-unit` | Total ÷ units |
| `calc-expense-ratio` | Total ÷ EGR × 100 |

---

## 6. NET OPERATING INCOME

| Field ID | Calculation |
|----------|-------------|
| `calc-noi` | EGR - expenses-total |
| `calc-noi-per-unit` | NOI ÷ total-units |
| `calc-noi-per-sf` | NOI ÷ total-sf |

---

## 7. CAPITALIZATION & VALUE

| Field ID | I/O | Description |
|----------|-----|-------------|
| `calc-cap-rate` | INPUT | Primary cap rate % |
| `calc-cap-rate-2` | INPUT | Secondary cap rate % (optional) |
| `calc-adj-capex` | INPUT | CapEx adjustment |
| `calc-adj-leasing` | INPUT | Leasing costs adjustment |
| `calc-adj-other` | INPUT | Other adjustment |
| `calc-raw-value` | CALC | NOI ÷ cap-rate |
| `calc-adj-total` | CALC | Sum of adjustments |
| `calc-indicated-value` | CALC | Round(raw + adj, 10000) |
| `calc-value-per-unit` | CALC | Value ÷ units |
| `calc-value-per-sf` | CALC | Value ÷ SF |
| `calc-grm` | CALC | Value ÷ rental-revenue |

---

## CRITICAL: Required Fixes

### Template Needs:
1. Add rows for type3 through type6
2. Add `calc-type{N}-sf` field (SF per unit type)
3. Add `calc-type{N}-name` as input field (currently hardcoded)

### Standalone Calculator Needs:
1. Change expense field IDs to match template:
   - `calc-exp-taxes` → `calc-exp-taxes-annual`
   - `calc-exp-insurance` → `calc-exp-insurance-annual`
   - etc.
2. Add 2 more vacancy inputs (concessions-rate, other-loss-rate)
3. Expand unit mix from 1 type to 6 types

### Field Registry Needs:
- Verify all 127 fields exist
- Verify inputSource: "user-input" vs "calculated" is correct

---

## Agent Task Prompt

```
Build CalcInputPanel with these exact input fields:

UNIT MIX (30 inputs - 6 types × 5 fields):
- calc-type{1-6}-name (text)
- calc-type{1-6}-count (number)
- calc-type{1-6}-sf (number)
- calc-type{1-6}-contract-rent (currency)
- calc-type{1-6}-rent (currency)

OTHER INCOME (3 inputs):
- calc-parking-per-unit (currency)
- calc-laundry-per-unit (currency)
- calc-other-income-annual (currency)

VACANCY (4 inputs):
- calc-vacancy-rate (percentage)
- calc-concessions-rate (percentage)
- calc-credit-loss-rate (percentage)
- calc-other-loss-rate (percentage)

EXPENSES (7 inputs - ANNUAL totals):
- calc-exp-taxes-annual
- calc-exp-insurance-annual
- calc-exp-repairs-annual
- calc-exp-utilities-annual
- calc-exp-management-annual
- calc-exp-reserves-annual
- calc-exp-other-annual

CAPITALIZATION (5 inputs):
- calc-cap-rate (percentage)
- calc-cap-rate-2 (percentage, optional)
- calc-adj-capex (currency)
- calc-adj-leasing (currency)
- calc-adj-other (currency)

Total: 49 input fields
```
