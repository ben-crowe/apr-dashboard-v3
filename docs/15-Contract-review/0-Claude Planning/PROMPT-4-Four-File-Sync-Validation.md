# Task: 4-File Sync Validation

**Prompt Set:** Calculator Demo Valuation Approaches (4 of 4)
**Priority:** Final - Quality check after implementation

---

## Context

APR Dashboard uses a 4-file sync system. After adding new fields, verify all files match.

## Files to Check

1. `src/features/report-builder/schema/fieldRegistry.ts`
2. `src/features/report-builder/data/northBattlefordTestData.ts`
3. `public/Report-MF-template.html` (if applicable)
4. `public/test-data/IMAGE-FIELD-MAPPING.json` (for image fields only)

---

## Validation Steps

### Step 1: Count Fields

Run these checks:

```bash
# Count Sales Comp adjustment fields
grep -c "comp[1-5]-adj-" src/features/report-builder/schema/fieldRegistry.ts
# Expected: 40 (8 per comp × 5 comps)

# Count Cost Approach fields
grep -c "'cost-" src/features/report-builder/schema/fieldRegistry.ts
# Expected: ~35

# Count in test data
grep -c "comp[1-5]-adj-" src/features/report-builder/data/northBattlefordTestData.ts
# Should match registry count

grep -c "'cost-" src/features/report-builder/data/northBattlefordTestData.ts
# Should match registry count (for user-input fields)
```

### Step 2: Verify Calculated Fields Have Logic

For each field with `inputSource: 'calculated'`:
- Verify `runCalculations()` or `runSalesCompCalculations()` or `runCostApproachCalculations()` computes it
- No calculated field should be undefined/null after running calculations

**Sales Comp calculated fields to verify:**
- `compN-price-per-unit`
- `compN-price-per-sf`
- `compN-total-trans-adj`
- `compN-total-phys-adj`
- `compN-net-adj`
- `compN-gross-adj`
- `compN-adj-price-per-unit`
- `sales-indicated-value`

**Cost Approach calculated fields to verify:**
- `cost-land-value`
- `cost-rcn-direct-costs`
- `cost-rcn-indirect-costs`
- `cost-rcn-entrepreneur-amt`
- `cost-rcn-total`
- `cost-depr-physical-remaining-life`
- `cost-depr-physical-pct`
- `cost-depr-physical-amt`
- `cost-depr-total-amt`
- `cost-depr-total-pct`
- `cost-site-parking-total`
- `cost-site-total`
- `cost-depreciated-value`
- `cost-indicated-value`

### Step 3: Test Data Coverage

Every user-input field in the calculator demo should have a test value.

Run the calculator demo and verify:
- No NaN values displayed
- No undefined values displayed
- All calculated fields populate with numbers

**Manual test checklist:**

```
[ ] Income Approach shows $1,790,000
[ ] Sales Comparison panel loads comp1 data
[ ] comp1-sale-price shows $3,117,383
[ ] comp1-units shows 24
[ ] Adjustments default to 0%
[ ] Changing adjustment triggers recalculation
[ ] Sales Indicated Value updates
[ ] Cost Approach panel loads test data (if applied)
[ ] cost-land-value calculates correctly
[ ] cost-indicated-value calculates correctly
[ ] Reconciliation shows all 3 approaches
[ ] Toggle works for enabling/disabling approaches
[ ] Final value updates when toggling
```

### Step 4: Template Placeholders (if updating template)

If any new fields will appear in the PDF report:
- Add `{{field-id}}` placeholder to Report-MF-template.html
- Verify kebab-case naming convention

**Note:** For Calculator Demo, fields don't need to be in the HTML template unless they'll appear in the final report output.

---

## Expected Field Counts After Implementation

| Section | Field Count |
|---------|-------------|
| Sales Comp core (existing) | ~175 fields (35 per comp × 5) |
| Sales Comp adjustments (new) | 40 fields (8 per comp × 5) |
| Cost Approach (new) | ~35 fields |
| **Total New** | **~75 new fields** |

---

## Common Issues to Check

### Issue: Field shows NaN
**Cause:** Missing parseFloat() or field not in test data
**Fix:** Add parseFloat() wrapper and default value

### Issue: Calculated field stays 0
**Cause:** Calc function not being called or field ID mismatch
**Fix:** Verify field ID matches exactly in calc function

### Issue: Panel doesn't load test data
**Cause:** Field IDs don't match between registry and test data
**Fix:** Check for typos, ensure kebab-case

### Issue: Reconciliation shows wrong total
**Cause:** Weight calculation error or value not passed
**Fix:** Check props being passed to ReconciliationPanel

---

## Quick Validation Script

Run this in browser console on Calculator Demo page:

```javascript
// Check if key values are populated
const store = window.__REPORT_BUILDER_STORE__;
if (store) {
  const state = store.getState();
  console.log('Income Value:', state.getFieldValue('calc-indicated-value'));
  console.log('Comp1 Sale Price:', state.getFieldValue('comp1-sale-price'));
  console.log('Comp1 Price/Unit:', state.getFieldValue('comp1-price-per-unit'));
  console.log('Sales Indicated:', state.getFieldValue('sales-indicated-value'));
  console.log('Cost Indicated:', state.getFieldValue('cost-indicated-value'));
}
```

---

*Generated: December 26, 2025*
