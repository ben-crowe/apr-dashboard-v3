# Report Builder - Tab Field Specification

## Purpose
Update the existing Report Builder EditPanel tabs with correct input fields.
**DO NOT change styling** - just add/organize fields per this spec.

---

## Current Tabs
```
HOME | IMAGE MGT | SITE | IMPV | COST S | SALES | INCOME | RECON
```

---

## INCOME TAB - Field Specification

The INCOME tab needs **49 input fields** organized into collapsible sections.
These feed the calculator which outputs to Page 48 (Direct Capitalization).

### Section 1: UNIT MIX
**30 input fields (6 unit types × 5 fields each)**

Display as a table with 6 rows:

| Field | Type | ID Pattern | Example |
|-------|------|------------|---------|
| Unit Type Name | text | `calc-type{N}-name` | "1 Bed / 1 Bath" |
| Unit Count | number | `calc-type{N}-count` | 4 |
| Avg SF | number | `calc-type{N}-sf` | 550 |
| Contract Rent/Mo | currency | `calc-type{N}-contract-rent` | 895 |
| Market Rent/Mo | currency | `calc-type{N}-rent` | 900 |

**Exact Field IDs:**
```
calc-type1-name, calc-type1-count, calc-type1-sf, calc-type1-contract-rent, calc-type1-rent
calc-type2-name, calc-type2-count, calc-type2-sf, calc-type2-contract-rent, calc-type2-rent
calc-type3-name, calc-type3-count, calc-type3-sf, calc-type3-contract-rent, calc-type3-rent
calc-type4-name, calc-type4-count, calc-type4-sf, calc-type4-contract-rent, calc-type4-rent
calc-type5-name, calc-type5-count, calc-type5-sf, calc-type5-contract-rent, calc-type5-rent
calc-type6-name, calc-type6-count, calc-type6-sf, calc-type6-contract-rent, calc-type6-rent
```

---

### Section 2: OTHER INCOME
**3 input fields**

| Label | Type | Field ID | Unit |
|-------|------|----------|------|
| Parking | currency | `calc-parking-per-unit` | $/unit/mo |
| Laundry | currency | `calc-laundry-per-unit` | $/unit/mo |
| Other Income | currency | `calc-other-income-annual` | $/year |

---

### Section 3: VACANCY & LOSS
**4 input fields**

| Label | Type | Field ID | Unit |
|-------|------|----------|------|
| Vacancy Rate | number | `calc-vacancy-rate` | % |
| Concessions | number | `calc-concessions-rate` | % |
| Credit Loss | number | `calc-credit-loss-rate` | % |
| Other Loss | number | `calc-other-loss-rate` | % |

---

### Section 4: OPERATING EXPENSES
**7 input fields** (user enters ANNUAL totals)

| Label | Type | Field ID |
|-------|------|----------|
| Taxes | currency | `calc-exp-taxes-annual` |
| Insurance | currency | `calc-exp-insurance-annual` |
| Repairs & Maintenance | currency | `calc-exp-repairs-annual` |
| Utilities | currency | `calc-exp-utilities-annual` |
| Management | currency | `calc-exp-management-annual` |
| Reserves | currency | `calc-exp-reserves-annual` |
| Other | currency | `calc-exp-other-annual` |

---

### Section 5: CAPITALIZATION
**2 input fields**

| Label | Type | Field ID | Unit |
|-------|------|----------|------|
| Cap Rate | number | `calc-cap-rate` | % |
| Cap Rate 2 (optional) | number | `calc-cap-rate-2` | % |

---

### Section 6: ADJUSTMENTS
**3 input fields**

| Label | Type | Field ID |
|-------|------|----------|
| CapEx Adjustment | currency | `calc-adj-capex` |
| Leasing Costs | currency | `calc-adj-leasing` |
| Other Adjustment | currency | `calc-adj-other` |

---

### INCOME TAB - Existing Sections to KEEP

Keep these narrative/text sections that already exist:
- PGI Analysis (textarea)
- Expense Analysis (textarea)
- NOI Analysis (textarea)
- Cap Rate Analysis (textarea)

Keep the calculated results display panels:
- OperatingHistoryPanel
- IncomeApproachPanel
- Any other output display panels

---

### INCOME TAB - Summary

```
INPUTS TO ADD (49 total):
├── Unit Mix: 30 fields (6 types × 5 fields)
├── Other Income: 3 fields
├── Vacancy & Loss: 4 fields
├── Operating Expenses: 7 fields
├── Capitalization: 2 fields
└── Adjustments: 3 fields

KEEP EXISTING:
├── Narrative textareas (PGI, Expense, NOI, Cap Rate analysis)
└── Calculated results panels (IncomeApproachPanel, etc.)
```

---

## FIELD WIRING

Each input must:

1. **Read from store:**
```tsx
const value = useReportBuilderStore(state => 
  getFieldValue(state, 'calc-type1-count')
);
```

2. **Write to store on change:**
```tsx
onChange={(e) => {
  updateFieldValue('calc-type1-count', parseFloat(e.target.value) || 0);
  runCalculations();
}}
```

3. **Match field registry:**
Field must exist in `fieldRegistry.ts` with:
```ts
{
  id: 'calc-type1-count',
  inputSource: 'user-input',
  // ...
}
```

---

## HOME TAB - Field Check

The HOME tab should have `subject-units` (total rental units).

**IMPORTANT:** This field should be READ-ONLY and display the calculated total from INCOME tab:
```
subject-units = calc-type1-count + calc-type2-count + ... + calc-type6-count
```

Or it should be editable but sync'd to INCOME tab unit breakdown.

**Decision needed:** Is HOME tab's "Rental Units" the source of truth, or is INCOME tab's unit breakdown the source of truth?

**Recommendation:** INCOME tab unit breakdown is source of truth. HOME tab displays calculated total.

---

## FIELD REGISTRY CHECK

Before implementing, verify these fields exist in `fieldRegistry.ts`:

```bash
# Check for calc input fields
grep -E "calc-type[1-6]-(name|count|sf|contract-rent|rent)" fieldRegistry.ts
grep -E "calc-parking-per-unit|calc-laundry-per-unit|calc-other-income-annual" fieldRegistry.ts
grep -E "calc-vacancy-rate|calc-concessions-rate|calc-credit-loss-rate" fieldRegistry.ts
grep -E "calc-exp-(taxes|insurance|repairs|utilities|management|reserves|other)-annual" fieldRegistry.ts
grep -E "calc-cap-rate|calc-adj-(capex|leasing|other)" fieldRegistry.ts
```

If any are missing, add them with `inputSource: 'user-input'`.

---

## IMPLEMENTATION ORDER

1. **Verify field registry** has all 49 input field IDs
2. **Add Unit Mix section** to INCOME tab (table with 6 rows)
3. **Add Other Income section** (3 simple inputs)
4. **Add Vacancy section** (4 percentage inputs)
5. **Add Expenses section** (7 currency inputs)
6. **Add Capitalization section** (2 percentage inputs)
7. **Add Adjustments section** (3 currency inputs)
8. **Test:** Enter values → Check calculated outputs update → Check template preview

---

## DO NOT

- ❌ Change the visual styling of the Report Builder
- ❌ Create a separate standalone calculator
- ❌ Add new tabs
- ❌ Remove existing narrative sections
- ❌ Change field IDs from this spec

## DO

- ✅ Add input fields to existing INCOME tab
- ✅ Use collapsible sections to organize inputs
- ✅ Wire inputs to store with exact field IDs listed above
- ✅ Call `runCalculations()` after each input change
- ✅ Keep existing style patterns from other tabs
