**Exactly. Both engines follow the same pattern:**
Date: 25.12.19

---

**Exactly right. The report doesn't care where the number comes from.**

```
Source A: Your Calc Engine → field value → Report
Source B: Valcre Import    → field value → Report
Source C: Manual Entry     → field value → Report
```

The template just reads from the registry field. Origin is irrelevant.

---

**Sales Comparison Approach - Two Parts:**

| Part | What It Is | Calc Needed? |
|------|------------|--------------|
| **Comp Data** | Sale price, units, GBA, year, etc. | ❌ User input |
| **Derived Metrics** | Price/unit, price/SF, cap rate | ✅ Simple division |
| **Adjustments Grid** | Location, condition, size adjustments | ❌ User input |
| **Indicated Value** | Adjusted price × subject units | ✅ Simple calc |

**Your Sales Comp "calc engine" is actually simple:**

```typescript
// Per comp
pricePerUnit = salePrice / units
pricePerSF = salePrice / gba
capRate = noi / salePrice

// Conclusion
indicatedValue = concludedPricePerUnit × subjectUnits
```

**Compare to Income Approach calc engine:**
- 11-step flow
- Unit mix aggregation
- Expense calculations
- Multiple scenarios

**Recommendation:**

Add Sales Comp derived fields as `inputSource: 'calculated'` in registry. The calculation logic is trivial - could be inline in the store or a small helper function. Doesn't need a full "engine."

Want me to list the Sales Comp fields that need calc logic vs pure input?


```
INPUTS (user/import) → CALC ENGINE → OUTPUTS (to report)
```

---

## Income Approach - Direct Capitalization

### INPUTS (User Entry or Valcre Import)

| Field | Registry ID | Type | Description |
|-------|-------------|------|-------------|
| Unit Type 1 Count | `calc-type1-count` | number | # of 1BR units |
| Unit Type 1 Rent | `calc-type1-rent` | currency | Monthly rent |
| Unit Type 1 SF | `calc-type1-sf` | number | Avg SF per unit |
| Unit Type 2-4 | (same pattern) | | |
| Other Income | `calc-other-income` | currency | Misc revenue |
| Vacancy Rate | `calc-vacancy-rate` | percentage | Vacancy allowance |
| Expense - Taxes | `calc-exp-taxes` | currency | Annual amount |
| Expense - Insurance | `calc-exp-insurance` | currency | Annual amount |
| Expense - Repairs | `calc-exp-repairs` | currency | Annual amount |
| Expense - Payroll | `calc-exp-payroll` | currency | Annual amount |
| Expense - Utilities | `calc-exp-utilities` | currency | Annual amount |
| Expense - Management | `calc-exp-management` | currency | Annual amount |
| Expense - Other | `calc-exp-other` | currency | Annual amount |
| Cap Rate | `calc-cap-rate` | percentage | Concluded rate |
| Total Units | `total-units` | number | From property |
| Total NRA | `total-nra` | number | From property |

**~25 input fields**

---

### OUTPUTS (Calculated by Engine)

| Field | Registry ID | Type | Calculation |
|-------|-------------|------|-------------|
| Type 1 Annual | `calc-type1-annual` | currency | count × rent × 12 |
| Type 1 Per Unit | `calc-type1-per-unit` | currency | annual ÷ count |
| Type 1 Per SF | `calc-type1-per-sf` | number | rent ÷ sf |
| Type 2-4 | (same pattern) | | |
| Total Rental Revenue | `calc-total-rental-revenue` | currency | Σ type annuals |
| PGR | `calc-pgr` | currency | rental + other |
| PGR Per Unit | `calc-pgr-per-unit` | currency | pgr ÷ units |
| PGR Per SF | `calc-pgr-per-sf` | number | pgr ÷ nra |
| Vacancy Loss | `calc-vacancy-loss` | currency | pgr × rate |
| EGR | `calc-egr` | currency | pgr - vacancy |
| EGR Per Unit | `calc-egr-per-unit` | currency | egr ÷ units |
| EGR Per SF | `calc-egr-per-sf` | number | egr ÷ nra |
| Exp Pct PGR (each) | `calc-exp-{cat}-pct-pgr` | percentage | exp ÷ pgr |
| Exp Pct EGR (each) | `calc-exp-{cat}-pct-egr` | percentage | exp ÷ egr |
| Exp Per Unit (each) | `calc-exp-{cat}-per-unit` | currency | exp ÷ units |
| Exp Per SF (each) | `calc-exp-{cat}-per-sf` | number | exp ÷ nra |
| Total Expenses | `calc-expenses-total` | currency | Σ expenses |
| Expense Ratio | `calc-expense-ratio` | percentage | total ÷ egr |
| Expenses Per Unit | `calc-expenses-per-unit` | currency | total ÷ units |
| Expenses Per SF | `calc-expenses-per-sf` | number | total ÷ nra |
| NOI | `calc-noi` | currency | egr - expenses |
| NOI Per Unit | `calc-noi-per-unit` | currency | noi ÷ units |
| NOI Per SF | `calc-noi-per-sf` | number | noi ÷ nra |
| Indicated Value | `calc-indicated-value` | currency | noi ÷ cap rate |
| Value Per Unit | `calc-value-per-unit` | currency | value ÷ units |
| Value Per SF | `calc-value-per-sf` | number | value ÷ nra |
| Indicated Value Rounded | `calc-indicated-value-rounded` | currency | round to nearest |

**~50+ output fields**

---

## Sales Comparison Approach

### INPUTS (User Entry or Valcre Import)

| Field | Registry ID | Type | Description |
|-------|-------------|------|-------------|
| **Per Comp (×5):** |
| Comp Name | `comp{N}-name` | text | Property name |
| Comp Address | `comp{N}-address` | text | Street address |
| Comp City | `comp{N}-city` | text | City |
| Comp Sale Date | `comp{N}-sale-date` | date | Transaction date |
| Comp Sale Price | `comp{N}-sale-price` | currency | Sale amount |
| Comp Units | `comp{N}-units` | number | Unit count |
| Comp GBA | `comp{N}-gba` | number | Gross building area |
| Comp Year Built | `comp{N}-year` | number | Construction year |
| Comp NOI | `comp{N}-noi` | currency | Net operating income |
| **Adjustments (×5):** |
| Location Adj | `comp{N}-adj-location` | percentage | Location adjustment |
| Condition Adj | `comp{N}-adj-condition` | percentage | Condition adjustment |
| Size Adj | `comp{N}-adj-size` | percentage | Size adjustment |
| Age Adj | `comp{N}-adj-age` | percentage | Age adjustment |
| Other Adj | `comp{N}-adj-other` | percentage | Other adjustments |
| **Conclusion:** |
| Concluded $/Unit | `dca-price-per-unit-concluded` | currency | Appraiser's opinion |

**~70 input fields** (14 per comp × 5 comps)

---

### OUTPUTS (Calculated by Engine)

| Field | Registry ID | Type | Calculation |
|-------|-------------|------|-------------|
| **Per Comp (×5):** |
| Price Per Unit | `comp{N}-price-per-unit` | currency | price ÷ units |
| Price Per SF | `comp{N}-price-per-sf` | currency | price ÷ gba |
| Cap Rate | `comp{N}-cap-rate` | percentage | noi ÷ price |
| NOI Per Unit | `comp{N}-noi-per-unit` | currency | noi ÷ units |
| Gross Adj | `comp{N}-gross-adj` | percentage | Σ adjustments |
| Adjusted $/Unit | `comp{N}-adj-price-per-unit` | currency | $/unit × (1 + gross adj) |
| **Summary:** |
| $/Unit Range Low | `dca-price-per-unit-low` | currency | min(comp adj $/unit) |
| $/Unit Range High | `dca-price-per-unit-high` | currency | max(comp adj $/unit) |
| $/Unit Average | `dca-price-per-unit-avg` | currency | avg(comp adj $/unit) |
| **Value Conclusion:** |
| Indicated Value | `sales-indicated-value` | currency | concluded $/unit × subject units |
| Value Per SF | `sales-value-per-sf` | currency | value ÷ subject nra |

**~35 output fields**

---

## Summary

| Approach | Inputs | Outputs | Total Fields |
|----------|--------|---------|--------------|
| Income (Direct Cap) | ~25 | ~50 | ~75 |
| Sales Comparison | ~70 | ~35 | ~105 |
| **Combined** | **~95** | **~85** | **~180** |

**The calc engines are just:**
- Income: Complex (11-step flow, already built ✅)
- Sales: Simple (division + sum, needs building)

Both feed the same report template. Report doesn't know or care which engine produced the value.
