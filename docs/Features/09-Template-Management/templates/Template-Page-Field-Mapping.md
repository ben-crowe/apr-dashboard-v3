# Template Page → Calculator Field Mapping

## Report-MF-Template v3.0

This document maps which template pages contain which calculator fields.
**Use this to wire up the CalcInputPanel → Store → Template injection.**

---

## INCOME APPROACH PAGES

### Page 27: Unit Mix (Property Description)
**Content:** Unit breakdown table in property description section
**Fields:** Static/property info only - no calc fields

---

### Page 36: Income Approach Introduction
**Content:** Methodology narrative
**Fields:** Primarily narrative, minimal dynamic fields

---

### Page 37: Rent Survey Comparison Table
**Content:** Rental comparables grid
**Fields:** RentComp1-5 fields (separate from calculator)

---

### Page 43: Operating History - YTD vs Projection
**Content:** Historical vs projected income/expense comparison
**Fields:** Operating history fields (oh-*), some calc fields for projection column

---

### Page 44: Operating Expenses Detail
**Content:** Expense breakdown with comments
**Fields:** Expense narrative fields, calc-exp-* for projected column

---

### ⭐ Page 48: DIRECT CAPITALIZATION (MAIN CALC OUTPUT)
**Content:** The primary Income Approach calculation table
**This is the KEY page that displays all calculator outputs**

#### Unit Mix Section
```
calc-type1-count, calc-type1-contract-rent, calc-type1-rent
calc-type1-cont-v-market, calc-type1-per-unit, calc-type1-per-sf, calc-type1-annual

calc-type2-count, calc-type2-contract-rent, calc-type2-rent  
calc-type2-cont-v-market, calc-type2-per-unit, calc-type2-per-sf, calc-type2-annual

calc-avg-contract-rent, calc-avg-market-rent, calc-avg-cont-v-market
calc-subtotal-per-unit, calc-subtotal-per-sf, calc-subtotal-annual
total-units (from Home tab, not calc)
```

#### Rental Revenue Section
```
calc-mf-annual, calc-mf-per-unit, calc-mf-per-sf
calc-mf-pct-pgr, calc-mf-pct-egr, calc-mf-pct-prr
calc-rental-rev-annual, calc-rental-rev-per-unit, calc-rental-rev-per-sf
```

#### Other Revenue Section
```
calc-parking-annual, calc-parking-per-unit, calc-parking-per-sf
calc-parking-pct-pgr, calc-parking-pct-egr, calc-parking-pct-prr

calc-laundry-annual, calc-laundry-per-unit, calc-laundry-per-sf
calc-laundry-pct-pgr, calc-laundry-pct-egr, calc-laundry-pct-prr

calc-other-rev-annual, calc-other-rev-per-unit, calc-other-rev-per-sf
calc-other-rev-pct-pgr, calc-other-rev-pct-egr, calc-other-rev-pct-prr
```

#### PGR (Potential Gross Revenue)
```
calc-pgr, calc-pgr-per-unit, calc-pgr-per-sf
```

#### Vacancy & Loss Section
```
calc-vacancy-loss, calc-vacancy-per-unit, calc-vacancy-per-sf
calc-vacancy-pct-pgr, calc-vacancy-pct-egr

calc-total-vacancy-loss, calc-total-vacancy-per-unit, calc-total-vacancy-per-sf
calc-total-vacancy-pct-pgr, calc-total-vacancy-pct-egr
```

#### EGR (Effective Gross Revenue)
```
calc-egr, calc-egr-per-unit, calc-egr-per-sf
```

#### Operating Expenses Section
```
calc-exp-taxes-annual, calc-exp-taxes-per-unit, calc-exp-taxes-per-sf
calc-exp-taxes-pct-pgr, calc-exp-taxes-pct-egr

calc-exp-insurance-annual, calc-exp-insurance-per-unit, calc-exp-insurance-per-sf
calc-exp-insurance-pct-pgr, calc-exp-insurance-pct-egr

calc-exp-repairs-annual, calc-exp-repairs-per-unit, calc-exp-repairs-per-sf
calc-exp-repairs-pct-pgr, calc-exp-repairs-pct-egr

calc-exp-utilities-annual, calc-exp-utilities-per-unit, calc-exp-utilities-per-sf
calc-exp-utilities-pct-pgr, calc-exp-utilities-pct-egr

calc-exp-payroll-annual, calc-exp-payroll-per-unit, calc-exp-payroll-per-sf
calc-exp-payroll-pct-pgr, calc-exp-payroll-pct-egr

calc-exp-management-annual, calc-exp-management-per-unit, calc-exp-management-per-sf
calc-exp-management-pct-pgr, calc-exp-management-pct-egr

calc-exp-other-annual, calc-exp-other-per-unit, calc-exp-other-per-sf
calc-exp-other-pct-pgr, calc-exp-other-pct-egr

calc-expenses-total, calc-expenses-per-unit, calc-expenses-per-sf
calc-expense-ratio-pgr, calc-expense-ratio-egr
```

#### NOI (Net Operating Income)
```
calc-noi, calc-noi-per-unit, calc-noi-per-sf
```

#### Value Indication
```
calc-cap-rate
calc-indicated-value, calc-indicated-value-rounded
calc-value-per-unit, calc-value-per-sf
```

---

### Page 49: Income Approach Conclusion
**Content:** Value conclusion narrative
**Fields:** 
```
calc-indicated-value (final value)
calc-noi
calc-cap-rate
```

---

## SALES COMPARISON PAGES

### Page 52: Sales Comparables Map
**Content:** Location map with comparable markers
**Fields:** COMP1-5 address fields for map labels

### Pages 53-57: Individual Comparable Sheets (5 pages)
**Content:** One page per comparable with photo, details, adjustments
**Fields per page:**
```
COMP{N}-address, COMP{N}-city, COMP{N}-province
COMP{N}-sale-date, COMP{N}-sale-price
COMP{N}-price-per-unit, COMP{N}-price-per-sf
COMP{N}-year-built, COMP{N}-total-units, COMP{N}-gba
COMP{N}-cap-rate, COMP{N}-noi
COMP{N}-remarks
```

### Page 58: Sales Comparison Grid
**Content:** Adjustment grid comparing all 5 comps to subject
**Fields:** Full adjustment grid (COMP{N}-adj-* fields)

### Page 59: Sales Comparison Analysis
**Content:** Analysis narrative
**Fields:** sca-analysis narrative, COMP statistics

### Page 60: Sales Comparison Conclusion
**Content:** Value conclusion
**Fields:**
```
sca-indicated-value
sca-value-per-unit
sca-value-per-sf
```

---

## RECONCILIATION PAGE

### Page 62: Reconciliation of Values
**Content:** Final value reconciliation from all approaches
**Fields:**
```
calc-indicated-value (Income Approach)
sca-indicated-value (Sales Comparison)
cost-indicated-value (Cost Approach - if used)
recon-final-value (Reconciled conclusion)
recon-weighting-income, recon-weighting-sales, recon-weighting-cost
```

---

## WIRING INSTRUCTIONS FOR AGENT

### Step 1: CalcInputPanel → Store
When user changes an input field:
```typescript
updateFieldValue('calc-type1-count', newValue);
runCalculations(); // Triggers calculator engine
```

### Step 2: Calculator Engine → Store
Calculator reads inputs, computes outputs, writes back to store:
```typescript
// Example: income-table.ts
const type1Annual = type1Count * type1Rent * 12;
updateFieldValue('calc-type1-annual', type1Annual);
```

### Step 3: Store → Template (PreviewPanel)
PreviewPanel injects field values into template via postMessage:
```typescript
// Find all elements with data-field-id matching the field
iframe.contentWindow.postMessage({
  type: 'FIELD_UPDATE',
  fieldId: 'calc-type1-annual',
  value: '$43,200'
}, '*');
```

### Step 4: Template Receives Update
Template listener updates the element:
```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'FIELD_UPDATE') {
    const elements = document.querySelectorAll(
      `[data-field-id*="${event.data.fieldId}"]`
    );
    elements.forEach(el => el.textContent = event.data.value);
  }
});
```

---

## CRITICAL: Field ID Alignment

All four locations must use IDENTICAL field IDs:

| Location | Example |
|----------|---------|
| CalcInputPanel | `onChange={e => updateField('calc-exp-taxes-annual', ...)}` |
| Field Registry | `{ id: 'calc-exp-taxes-annual', inputSource: 'user-input' }` |
| Calculator | `inputFields: ['calc-exp-taxes-annual']` |
| Template | `data-field-id="{{calc-exp-taxes-annual}}"` |

**If ANY of these don't match exactly, the data won't flow.**

---

## PAGE COUNT SUMMARY

| Section | Pages | Calc Fields |
|---------|-------|-------------|
| Income Approach Intro | 36 | Few |
| Rent Survey | 37 | RentComp (not calc) |
| Operating History | 43-44 | Mixed (oh-* and calc-*) |
| **Direct Capitalization** | **48** | **~110 fields** |
| Income Conclusion | 49 | 3 fields |
| Sales Comp Sheets | 53-57 | COMP1-5 (not calc) |
| Sales Grid | 58 | Adjustment fields |
| Sales Conclusion | 60 | 3 fields |
| Reconciliation | 62 | 5 fields |

**Page 48 is the primary target - it contains all calculator outputs.**

---

## TEMPLATE FILE LOCATION

```
/mnt/user-data/uploads/Report-MF-Template-v2_9_0__1_.html
```

Or in project:
```
public/Report-MF-template.html
```
