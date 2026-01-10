# Cursor Agent Test Prompt: Calculator to Template Field Verification

## Your Task

Test that all calculator output fields correctly populate in the HTML template via postMessage.

---

## Step 1: Open the Calculator Preview App

Navigate to: `http://localhost:8086/calculator-preview`

This loads:
- **Left panel (60%):** Calculator input form
- **Right panel (40%):** Report template in iframe

---

## Step 2: Enter Test Data in Calculator

Enter these values in the calculator form:

### Unit Mix Section
| Field | Value |
|-------|-------|
| Type 1 Units | 6 |
| Type 1 Rent/Mo | 1040 |
| Type 1 Contract Rent | 975 |
| Type 2 Units | 10 |
| Type 2 Rent/Mo | 1008 |
| Type 2 Contract Rent | 1008 |

### Other Income
| Field | Value |
|-------|-------|
| Parking/Unit/Mo | 0 |
| Laundry/Unit/Mo | 0 |
| Other Income (Annual) | 8400 |

### Vacancy & Loss
| Field | Value |
|-------|-------|
| Vacancy Rate % | 4 |
| Bad Debt Rate % | 0 |
| Concessions Rate % | 0 |

### Expenses (Annual)
| Field | Value |
|-------|-------|
| Taxes | 19688 |
| Insurance | 11360 |
| Repairs | 13280 |
| Payroll | 8000 |
| Utilities | 21040 |
| Management | 8281 |
| Other | 3920 |

### Cap Rate
| Field | Value |
|-------|-------|
| Cap Rate % | 6.25 |

---

## Step 3: Verify Calculated Outputs

After entering the data, the calculator should compute these values. Check they appear in the right panel (template):

### Expected Calculated Values
| Field ID | Expected Value | Check |
|----------|---------------|-------|
| calc-pgr | ~$204,240 | [ ] |
| calc-egr | ~$196,070 | [ ] |
| calc-noi | ~$111,771 | [ ] |
| calc-indicated-value | ~$1,788,336 | [ ] |
| calc-indicated-value-rounded | ~$1,790,000 | [ ] |
| calc-expense-ratio | ~43.6% | [ ] |
| calc-value-per-unit | ~$111,771/Unit | [ ] |

---

## Step 4: Scroll Through Template and Verify Fields

Scroll through the template in the right panel and verify these sections have populated values (not placeholder text like `{{calc-noi}}`):

### Page 43-44 Area (Income/Expenses Table)
- [ ] Total Rental Revenue shows dollar amount
- [ ] PGR (Potential Gross Revenue) shows dollar amount
- [ ] Vacancy Loss shows negative dollar amount in parentheses
- [ ] EGR (Effective Gross Revenue) shows dollar amount
- [ ] Each expense category (Taxes, Insurance, etc.) shows amounts
- [ ] Total Expenses shows dollar amount
- [ ] NOI shows dollar amount

### Page 49 Area (Direct Capitalization Table)
- [ ] Unit Mix table shows Type 1 and Type 2 rows with values
- [ ] calc-type1-count shows "6"
- [ ] calc-type2-count shows "10"
- [ ] calc-type1-annual shows dollar amount
- [ ] calc-type2-annual shows dollar amount
- [ ] Total Rental Revenue row shows sum
- [ ] Expense breakdown shows all 7 categories
- [ ] NOI row shows calculated NOI
- [ ] Cap Rate shows percentage
- [ ] Indicated Value shows dollar amount

### Page 50 Area (Value Conclusion)
- [ ] calc-indicated-value shows dollar amount
- [ ] calc-indicated-value-rounded shows rounded value
- [ ] calc-value-per-unit shows $/Unit
- [ ] calc-value-per-sf shows $/SF

### Page 63 Area (Reconciliation)
- [ ] recon-final-value shows dollar amount
- [ ] sca-indicated-value shows dollar amount
- [ ] sca-value-per-sf shows $/SF

---

## Step 5: Check for Any Unpopulated Fields

Look for any fields still showing placeholder format like:
- `{{calc-something}}`
- `{{ia-dircap-something}}`
- `{{recon-something}}`
- `{{sca-something}}`

If you find any, note the exact field ID.

---

## Step 6: Report Results

Report back with:

1. **PASS/FAIL** - Did all fields populate?

2. **If any failures**, list:
   - Field ID that failed
   - What it shows (placeholder or wrong value)
   - Location in template (page/section)

3. **Screenshot** the Direct Capitalization table (Page 49 area) showing populated values

---

## Expected Success Criteria

- All `calc-*` fields show calculated dollar amounts or percentages
- All `ia-dircap-*` fields show values (mirrors calc values)
- All `recon-*` and `sca-*` fields show values
- No `{{field-id}}` placeholders visible
- Negative values display in parentheses like `($1,234)`

---

## Files for Reference

If you need to check the field mapping:
- **Field list:** `docs/15-Contract-review/3-Calc Eng & Plan Agent/CALC-TO-TEMPLATE-FIELD-MAPPING.md`
- **PostMessage bridge:** `src/features/calculator-demo-v4/CalculatorWithPreview.tsx`
- **Template:** `public/Report-MF-template.html`

---

## Troubleshooting

**If fields don't populate:**
1. Check browser console for errors
2. Verify postMessage is being sent (look for `[CalculatorWithPreview] Sent update to template: X fields`)
3. Check template has message listener in `<script>` section

**If values are wrong:**
1. Check the calculation in reportBuilderStore.ts
2. Verify input values were entered correctly

---

*Test created: 2025-12-29*
*Expected fields: 88 total*
