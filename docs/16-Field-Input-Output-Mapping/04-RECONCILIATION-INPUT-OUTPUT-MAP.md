# Reconciliation: INPUT → OUTPUT Mapping

**Section**: Value Reconciliation (Final Value Conclusion)
**Report Pages**: Pages 51-55 (approx)
**Status**: ✅ ReconciliationPanel built, need verification
**Last Updated**: 2026-01-09

---

## INPUT FIELDS (User Entry)

### Section 1: Value Indications (From Other Approaches)

These values are **passed as props** to ReconciliationPanel from the Income, Sales, and Cost approach panels. They are **not direct user inputs** but are displayed for reference and used in calculations.

| Field ID | Label | Type | Source | Tab Location | Required |
|----------|-------|------|--------|--------------|----------|
| `calc-indicated-value` | Income Approach: Indicated Value | currency | Income Approach Output | ReconciliationPanel (prop) | No |
| `sca-indicated-value` | Sales Comparison: Indicated Value | currency | Sales Comparison Output | ReconciliationPanel (prop) | No |
| `cost-indicated-value` | Cost Approach: Indicated Value | currency | Cost Approach Output | ReconciliationPanel (prop) | No |

**Note**: These values come from completed calculations in their respective approach panels. If an approach is not completed, its value defaults to $0.

**Example Values** (from completed approaches):
```
Income Approach: $3,284,000
Sales Comparison: $2,220,198
Cost Approach: $1,018,358
```

---

### Section 2: Weighting Factors

| Field ID | Label | Type | Tab Location | Registry | Required |
|----------|-------|------|--------------|----------|----------|
| `recon-income-weight` | Income Approach Weight (%) | percentage | ReconTabPanel → Reconciliation Weights | ✅ | Yes |
| `recon-sales-weight` | Sales Comparison Weight (%) | percentage | ReconTabPanel → Reconciliation Weights | ✅ | Yes |
| `recon-cost-weight` | Cost Approach Weight (%) | percentage | ReconTabPanel → Reconciliation Weights | ✅ | Yes |

**Weighting Rules**:
- Weights must sum to 100%
- Default weights: Income 33%, Sales 33%, Cost 34% (when all 3 approaches active)
- Default weights: Income 50%, Sales 50%, Cost 0% (when only 2 approaches active)
- Auto-adjustment: When one weight changes, remaining weights adjust proportionally to maintain 100% sum
- Weights are clamped between 0% and 100%

**Example Filled Input**:
```
Income Weight: 60%
Sales Weight: 35%
Cost Weight: 5%
Total: 100%
```

---

### Section 3: Reconciliation Narrative/Comments

| Field ID | Label | Type | Tab Location | Registry | Required |
|----------|-------|------|--------------|----------|----------|
| `recon-narrative` | Reconciliation Analysis Narrative | textarea | ReconTabPanel → Reconciliation Analysis | ✅ | No |

**Purpose**: Text field for appraiser to document reasoning for weight assignments and final value conclusion.

**Example Filled Input**:
```
"The Income Approach is given primary weight (60%) as it best reflects the investment characteristics of this income-producing property. The Sales Comparison Approach (35%) provides market support, while the Cost Approach (5%) is given minimal weight due to the property's age and limited applicability."
```

---

## OUTPUT FIELDS (Calculated Results)

These are **calculated** by ReconciliationPanel from the value indications and weights above, then displayed in the panel and exported to report template.

### Output Table 1: Approach Values Stored

| Output Field ID | Report Page | Calculation | Depends On Inputs |
|----------------|-------------|-------------|-------------------|
| `recon-income-value` | Page 51 | Stored from Income Approach prop | `calc-indicated-value` (from Income Approach) |
| `recon-sales-value` | Page 51 | Stored from Sales Comparison prop | `sca-indicated-value` (from Sales Comparison) |
| `recon-cost-value` | Page 51 | Stored from Cost Approach prop | `cost-indicated-value` (from Cost Approach) |

**Purpose**: These fields store the indicated values from each approach for display in the reconciliation table and report template.

**Example Output**:
```
Income Value: $3,284,000
Sales Value: $2,220,198
Cost Value: $1,018,358
```

---

### Output Table 2: Weighted Values (Per Approach)

| Output Field ID | Report Page | Calculation | Depends On Inputs |
|----------------|-------------|-------------|-------------------|
| Income Weighted Value | Page 51 | recon-income-value × (recon-income-weight / 100) | `recon-income-value`, `recon-income-weight` |
| Sales Weighted Value | Page 51 | recon-sales-value × (recon-sales-weight / 100) | `recon-sales-value`, `recon-sales-weight` |
| Cost Weighted Value | Page 51 | recon-cost-value × (recon-cost-weight / 100) | `recon-cost-value`, `recon-cost-weight` |

**Example Output** (using example values above):
```
Income Weighted: $1,970,400 ($3,284,000 × 60%)
Sales Weighted: $777,069 ($2,220,198 × 35%)
Cost Weighted: $50,918 ($1,018,358 × 5%)
```

---

### Output Table 3: Final Reconciled Value

| Output Field ID | Report Page | Calculation | Depends On Inputs |
|----------------|-------------|-------------|-------------------|
| `recon-reconciled-value` | Page 52 | SUM(Income Weighted + Sales Weighted + Cost Weighted) | All weighted values from Output Table 2 |
| `recon-final-value` | Page 52 | Same as recon-reconciled-value | `recon-reconciled-value` |
| `recon-final-value-per-unit` | Page 52 | recon-reconciled-value / calc-total-units | `recon-reconciled-value`, `calc-total-units` |
| `recon-final-value-per-sf` | Page 52 | recon-reconciled-value / calc-total-sf | `recon-reconciled-value`, `calc-total-sf` |

**Calculation Formula**:
```
Reconciled Value = (Income Value × Income Weight%) + 
                   (Sales Value × Sales Weight%) + 
                   (Cost Value × Cost Weight%)
```

**Example Output** (using example values above):
```
Reconciled Value: $2,798,387
  = $1,970,400 + $777,069 + $50,918

Per Unit: $174,899 ($2,798,387 / 16 units)
Per SF: $220.35 ($2,798,387 / 12,700 SF)
```

---

## DEPENDENCIES MAPPED

### Input Dependencies

**Value Indications**:
- `calc-indicated-value` ← Calculated from Income Approach (Doc 01)
- `sca-indicated-value` ← Calculated from Sales Comparison (Doc 02)
- `cost-indicated-value` ← Calculated from Cost Approach (Doc 03)
- These are **not direct inputs** but are required for reconciliation calculation

**Weighting Factors**:
- All three weights (`recon-income-weight`, `recon-sales-weight`, `recon-cost-weight`) are user inputs
- Weights must sum to 100% (enforced by auto-adjustment logic)
- Weights can be 0% if an approach is not applicable

**Narrative**:
- `recon-narrative` is optional text input for documentation
- No dependencies on other fields

### Output Dependencies

**Stored Values**:
- `recon-income-value` ← `calc-indicated-value` (from Income Approach)
- `recon-sales-value` ← `sca-indicated-value` (from Sales Comparison)
- `recon-cost-value` ← `cost-indicated-value` (from Cost Approach)

**Weighted Values** (calculated in UI, not stored):
- Income Weighted ← `recon-income-value`, `recon-income-weight`
- Sales Weighted ← `recon-sales-value`, `recon-sales-weight`
- Cost Weighted ← `recon-cost-value`, `recon-cost-weight`

**Final Reconciled Value**:
- `recon-reconciled-value` ← All three weighted values
- `recon-final-value` ← `recon-reconciled-value` (same value, different field ID)
- `recon-final-value-per-unit` ← `recon-reconciled-value`, `calc-total-units` (from Income Approach)
- `recon-final-value-per-sf` ← `recon-reconciled-value`, `calc-total-sf` (from Income Approach)

### Cross-Section Dependencies

**Reconciliation depends on ALL other approaches**:
- **Income Approach**: Provides `calc-indicated-value` and `calc-total-units`, `calc-total-sf` for per-unit/per-SF calculations
- **Sales Comparison**: Provides `sca-indicated-value`
- **Cost Approach**: Provides `cost-indicated-value`
- Reconciliation **cannot be completed** without at least one approach value
- Per-unit and per-SF calculations require Income Approach to be completed first

---

## EXAMPLE VALUES (Complete Flow)

### Input Values

**Value Indications** (from completed approaches):
```
Income Approach: $3,284,000
Sales Comparison: $2,220,198
Cost Approach: $1,018,358
```

**Weighting Factors**:
```
Income Weight: 60%
Sales Weight: 35%
Cost Weight: 5%
Total: 100%
```

**Narrative**:
```
"The Income Approach is given primary weight (60%) as it best reflects the investment characteristics of this income-producing property. The Sales Comparison Approach (35%) provides market support, while the Cost Approach (5%) is given minimal weight due to the property's age and limited applicability."
```

### Calculated Outputs

**Stored Values**:
```
Income Value: $3,284,000
Sales Value: $2,220,198
Cost Value: $1,018,358
```

**Weighted Values**:
```
Income Weighted: $1,970,400 ($3,284,000 × 60%)
Sales Weighted: $777,069 ($2,220,198 × 35%)
Cost Weighted: $50,918 ($1,018,358 × 5%)
```

**Final Reconciled Value**:
```
Reconciled Value: $2,798,387
  = $1,970,400 + $777,069 + $50,918

Per Unit: $174,899 ($2,798,387 / 16 units)
Per SF: $220.35 ($2,798,387 / 12,700 SF)
```

---

## VERIFICATION CHECKLIST

### Input Verification
- [x] All input fields exist in fieldRegistry.ts (1,643 fields)
- [x] All input fields rendered in ReconciliationPanel.tsx
- [x] Weight inputs wired to auto-adjustment logic
- [ ] **VERIFY**: Value indications passed correctly from Income, Sales, Cost panels
- [ ] **VERIFY**: Weights auto-adjust to sum to 100% when changed
- [ ] **VERIFY**: Weights clamped between 0% and 100%
- [ ] **VERIFY**: Narrative text saves to store correctly

### Output Verification
- [x] All calculated fields exist in fieldRegistry.ts as `inputSource: "calculated"`
- [x] All calculated fields rendered in ReconciliationPanel.tsx
- [x] Calculation logic implemented in ReconciliationPanel component
- [ ] **VERIFY**: Calculation formulas match expected logic
- [ ] **VERIFY**: Template placeholders populate from calculated values
- [ ] **VERIFY**: PDF export shows correct calculated results
- [ ] **VERIFY**: Weighted values calculate correctly
- [ ] **VERIFY**: Reconciled value sums all weighted values correctly
- [ ] **VERIFY**: Per-unit and per-SF calculations use correct denominator (from Income Approach)

### Flow Verification
- [ ] **VERIFY**: User completes Income/Sales/Cost approaches → Values appear in Reconciliation → User sets weights → Reconciled value calculates → Template shows results
- [ ] **VERIFY**: No orphaned inputs (inputs that don't feed any output)
- [ ] **VERIFY**: No orphaned outputs (outputs missing required inputs)
- [ ] **VERIFY**: Cross-section dependency (Income/Sales/Cost → Reconciliation) works correctly
- [ ] **VERIFY**: Zero values handled correctly (if approach not completed, value = $0)

### Calculation Logic Verification
- [ ] **VERIFY**: Weighted value = Approach Value × (Weight / 100)
- [ ] **VERIFY**: Reconciled value = SUM(all weighted values)
- [ ] **VERIFY**: Per-unit = Reconciled Value / Total Units
- [ ] **VERIFY**: Per-SF = Reconciled Value / Total SF
- [ ] **VERIFY**: Weights sum to 100% (auto-adjustment works)
- [ ] **VERIFY**: Weight changes trigger recalculation
- [ ] **VERIFY**: Approach value changes trigger recalculation

### Edge Cases
- [ ] **VERIFY**: Only one approach completed (weight = 100%, others = 0%)
- [ ] **VERIFY**: Only two approaches completed (weights sum to 100%)
- [ ] **VERIFY**: All three approaches completed (weights sum to 100%)
- [ ] **VERIFY**: Zero approach values handled correctly
- [ ] **VERIFY**: Negative approach values handled correctly (if possible)

---

## ISSUES IDENTIFIED

### Missing Inputs (Still Need UI)
- None identified for Reconciliation ✅

### Potential Calculation Issues
1. **Field ID Mismatch**: ReconciliationPanel stores `recon-reconciled-value` but registry may have `recon-final-value`. Verify both fields exist and are synced.
2. **Weight Auto-Adjustment**: When one weight changes, remaining weights adjust proportionally. Verify this logic works correctly and doesn't cause infinite loops.
3. **Zero Approach Values**: If an approach value is $0 (not completed), its weighted contribution is $0. Verify this doesn't cause calculation errors.
4. **Per-Unit/Per-SF Dependencies**: These calculations depend on `calc-total-units` and `calc-total-sf` from Income Approach. If Income Approach not completed, these will be 0, causing division by zero. Verify protection exists.
5. **Weight Validation**: Weights must sum to 100%. Current implementation shows warning if not exactly 100%, but auto-adjustment should prevent this. Verify edge cases.

### Template Mapping Gaps
- [ ] **TODO**: Verify all `recon-*` fields in template have corresponding calculated fields in registry
- [ ] **TODO**: Verify `recon-reconciled-value` and `recon-final-value` are both in template (may be duplicates)
- [ ] **TODO**: Check for duplicate field IDs in template (known issue: 121 duplicates pending cleanup)

---

## FIELD COUNT SUMMARY

### Input Fields
- **Value Indications**: 3 fields (from other approaches, not direct inputs)
- **Weighting Factors**: 3 fields
- **Narrative**: 1 field
- **Total Input Fields**: 7 fields (4 direct inputs + 3 from other approaches)

### Output Fields
- **Stored Approach Values**: 3 fields
- **Final Reconciled Value**: 4 fields (reconciled value, final value, per-unit, per-SF)
- **Total Output Fields**: 7 fields

### Grand Total
- **Total Fields**: 14 fields (7 inputs + 7 outputs)

---

## SPECIAL NOTES

### Weight Auto-Adjustment Logic

When a user changes one weight, the remaining weights automatically adjust to maintain a 100% sum:

**Example**: If Income Weight changes from 33% to 60%:
- Remaining = 100% - 60% = 40%
- Sales and Cost weights redistribute proportionally from their current ratio
- If Sales was 33% and Cost was 34%, ratio is 33:34
- New Sales = 40% × (33/67) = 19.7%
- New Cost = 40% × (34/67) = 20.3%

This ensures weights always sum to 100% without manual adjustment.

### Cross-Section Integration

Reconciliation is the **final step** in the valuation process:
1. Complete Income Approach → Get `calc-indicated-value`
2. Complete Sales Comparison → Get `sca-indicated-value`
3. Complete Cost Approach → Get `cost-indicated-value` (optional)
4. Set weights in Reconciliation → Calculate final value
5. Export to report template

All approach values must be calculated before reconciliation can produce a final value.

---

## NEXT STEPS

1. **Run Test**: Complete Income, Sales, and Cost approaches, verify values appear in Reconciliation panel
2. **Weight Test**: Adjust weights, verify auto-adjustment works and reconciled value recalculates
3. **Export Test**: Generate PDF, verify all `{{recon-*}}` placeholders show calculated values (not literal text)
4. **Edge Case Test**: Test with only 1 or 2 approaches completed, verify weights adjust correctly
5. **Create Final Doc**: Replicate this INPUT → OUTPUT format for:
   - Field Alignment Verification (Doc 05)

---

**Document Status**: ✅ First draft complete
**Ready for**: Testing & verification by agent or user
