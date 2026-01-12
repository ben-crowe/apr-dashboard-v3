# INCOME Tab - Sections & Tables Review

## Quick Reference for Claude Desktop

---

## INPUT SECTIONS (49 Fields Total)

### 1. UNIT MIX (30 fields)

| Type | Count | Avg SF | Contract Rent | Market Rent |
|------|-------|--------|---------------|-------------|
| Type 1 | `calc-type1-count` | `calc-type1-sf` | `calc-type1-contract-rent` | `calc-type1-rent` |
| Type 2 | `calc-type2-count` | `calc-type2-sf` | `calc-type2-contract-rent` | `calc-type2-rent` |
| Type 3 | `calc-type3-count` | `calc-type3-sf` | `calc-type3-contract-rent` | `calc-type3-rent` |
| Type 4 | `calc-type4-count` | `calc-type4-sf` | `calc-type4-contract-rent` | `calc-type4-rent` |
| Type 5 | `calc-type5-count` | `calc-type5-sf` | `calc-type5-contract-rent` | `calc-type5-rent` |
| Type 6 | `calc-type6-count` | `calc-type6-sf` | `calc-type6-contract-rent` | `calc-type6-rent` |

**Name fields:** `calc-type{1-6}-name`

---

### 2. OTHER INCOME (3 fields)

| Label | Field ID | Unit |
|-------|----------|------|
| Parking | `calc-parking-per-unit` | $/unit/mo |
| Laundry | `calc-laundry-per-unit` | $/unit/mo |
| Other Income | `calc-other-income-annual` | $/year |

---

### 3. VACANCY & LOSS (4 fields)

| Label | Field ID | Unit |
|-------|----------|------|
| Vacancy Rate | `calc-vacancy-rate` | % |
| Concessions | `calc-concessions-rate` | % |
| Credit Loss | `calc-credit-loss-rate` | % |
| Other Loss | `calc-other-loss-rate` | % |

---

### 4. OPERATING EXPENSES (7 fields)

| Label | Field ID |
|-------|----------|
| Property Taxes | `calc-exp-taxes-annual` |
| Insurance | `calc-exp-insurance-annual` |
| Repairs & Maintenance | `calc-exp-repairs-annual` |
| Utilities | `calc-exp-utilities-annual` |
| Management | `calc-exp-management-annual` |
| Reserves | `calc-exp-reserves-annual` |
| Other | `calc-exp-other-annual` |

---

### 5. CAPITALIZATION (2 fields)

| Label | Field ID | Unit |
|-------|----------|------|
| Cap Rate | `calc-cap-rate` | % |
| Cap Rate 2 (Optional) | `calc-cap-rate-2` | % |

---

### 6. ADJUSTMENTS (3 fields)

| Label | Field ID |
|-------|----------|
| CapEx Adjustment | `calc-adj-capex` |
| Leasing Costs | `calc-adj-leasing` |
| Other Adjustment | `calc-adj-other` |

---

## NARRATIVE SECTIONS

### PGI Analysis
- Field: `income-pgi-narrative`
- Textarea for potential gross income analysis

### Expense Analysis
- Field: `income-expense-narrative`
- Textarea for expense analysis

### NOI Analysis
- Field: `income-noi-narrative`
- Textarea for net operating income analysis

### Cap Rate Analysis
- Field: `income-cap-rate-analysis`
- Textarea for capitalization rate analysis

### Value Indication
- Input: `income-value-indication` (number)
- Display: Formatted currency value

---

## CALCULATION TABLES (Outputs)

### Operating History - YTD vs Projection

| Category | YTD Total | YTD $/Unit | YTD %PGR | Proj Total | Proj $/Unit | Proj %PGR |
|----------|-----------|------------|----------|------------|-------------|-----------|
| **REVENUE** |||||||
| Total MF Revenue | - | - | - | calc | calc | calc |
| Parking Income | - | - | - | calc | calc | - |
| Laundry | - | - | - | calc | calc | - |
| TOTAL MISC REV | - | - | - | calc | calc | calc |
| PGR | - | - | 100% | calc | calc | 100% |
| **VACANCY** |||||||
| Vacancy | - | - | - | calc | calc | calc |
| EGR | - | - | - | calc | calc | calc |
| **EXPENSES** |||||||
| Taxes | - | - | - | calc | calc | calc |
| Insurance | - | - | - | calc | calc | calc |
| Repairs | - | - | - | calc | calc | calc |
| Payroll | - | - | - | calc | calc | calc |
| Utilities | - | - | - | calc | calc | calc |
| Management | - | - | - | calc | calc | calc |
| Other | - | - | - | calc | calc | calc |
| TOTAL EXPENSES | - | - | - | calc | calc | calc |
| **NOI** |||||||
| NOI | - | - | - | calc | calc | calc |

---

### Direct Capitalization (Page 48 Output)

#### Unit Type Summary

| Unit Type | Count | SF | Rent/Mo | Contract | % Market | Annual | $/Unit |
|-----------|-------|----|---------|-----------| ---------|--------|--------|
| Type 1 | input | input | calc | input | calc | calc | calc |
| Type 2 | input | input | calc | input | calc | calc | calc |
| Type 3 | input | input | calc | input | calc | calc | calc |
| Type 4 | input | input | calc | input | calc | calc | calc |
| Type 5 | input | input | calc | input | calc | calc | calc |
| Type 6 | input | input | calc | input | calc | calc | calc |
| **TOTAL** | calc | calc | - | calc | calc | - | - |

---

#### Potential Gross Revenue

| Item | % of PGR | % of EGR | $/Unit | $/SF | Annual |
|------|----------|----------|--------|------|--------|
| **RENTAL REVENUE** ||||||
| Total MF Revenue | calc | - | calc | calc | calc |
| TOTAL RENTAL | calc | - | calc | calc | calc |
| **OTHER REVENUE** ||||||
| Parking Income | calc | - | calc | calc | calc |
| Laundry | calc | - | calc | calc | calc |
| TOTAL OTHER | calc | - | calc | calc | calc |
| **PGR** | 100% | - | calc | calc | calc |
| **VACANCY** ||||||
| Vacancy | calc | calc | calc | calc | calc |
| TOTAL VACANCY | calc | calc | calc | calc | calc |
| **EGR** | calc | 100% | calc | calc | calc |

---

#### Operating Expenses

| Item | % of PGR | % of EGR | $/Unit | $/SF | Annual |
|------|----------|----------|--------|------|--------|
| Taxes | calc | calc | calc | calc | input |
| Insurance | calc | calc | calc | calc | input |
| Repairs & Maint | calc | calc | calc | calc | input |
| Payroll | calc | calc | calc | calc | input |
| Utilities | calc | calc | calc | calc | input |
| Management | calc | calc | calc | calc | input |
| Other | calc | calc | calc | calc | input |
| **Total Expenses** | calc | calc | calc | calc | calc |

---

#### Net Operating Income & Value

| Item | Value |
|------|-------|
| Net Operating Income | `calc-noi` |
| NOI $/Unit | `calc-noi-per-unit` |
| NOI $/SF | `calc-noi-per-sf` |
| Cap Rate | `calc-cap-rate` (input) |
| Raw Value | `calc-raw-value` |
| Adjustments | `calc-adj-total` |
| **Indicated Value** | `calc-indicated-value` |

---

## FIELD COUNTS

| Section | Input Fields | Output Fields |
|---------|--------------|---------------|
| Unit Mix | 30 | 30+ |
| Other Income | 3 | 3+ |
| Vacancy & Loss | 4 | 5+ |
| Operating Expenses | 7 | 21+ |
| Capitalization | 2 | 6+ |
| Adjustments | 3 | - |
| Narratives | 5 | - |
| **TOTAL** | **49 inputs** | **78+ outputs** |

---

## DATA FLOW

```
User Input (49 fields)
       |
       v
   Zustand Store
       |
       v
  runCalculations()
       |
       v
   Store Updates (78 outputs)
       |
       v
  postMessage to iframe
       |
       v
  Template Page 48 displays values
```

---

## FILES

| File | Purpose |
|------|---------|
| `IncomeTabPanel.tsx` | Input sections UI |
| `IncomeTabPanel.css` | Styling |
| `reportBuilderStore.ts` | State + runCalculations() |
| `fieldRegistry.ts` | Field definitions |
| `Report-MF-template.html` | Page 48 template |

---

**Created:** 2026-01-11
**Status:** Implemented and committed
