# Sales Comparison Approach: INPUT → OUTPUT Mapping

**Section**: Sales Comparison Approach (Direct Comparison)
**Report Pages**: Pages 41-45 (approx)
**Status**: ✅ SalesComparisonPanel built, need verification
**Last Updated**: 2026-01-09

---

## INPUT FIELDS (User Entry)

### Section 1: Subject Property (Dependencies from Income Approach)

| Field ID | Label | Type | Tab Location | Registry | Required | Source |
|----------|-------|------|--------------|----------|----------|--------|
| `calc-total-units` | Total Units | number | Income Approach → Unit Mix | ✅ | Yes | Calculated from Income Approach |
| `calc-total-sf` | Total SF | number | Income Approach → Unit Mix | ✅ | Yes | Calculated from Income Approach |

**Note**: Subject property units and SF are calculated outputs from the Income Approach section. These values feed into the Sales Comparison indicated value calculation.

**Example Values** (from Income Approach):
```
Total Units: 16
Total SF: 12,700
```

---

### Section 2: Comparable Sales Data (×5 Comparables)

Each comparable (comp1 through comp5) has the following input fields:

#### Comparable 1 Fields

| Field ID | Label | Type | Tab Location | Registry | Required |
|----------|-------|------|--------------|----------|----------|
| `comp1-name` | Comp 1: Property Name | text | SalesTabPanel → Comparable Sales | ✅ | No |
| `comp1-address` | Comp 1: Address | text | SalesTabPanel → Comparable Sales | ✅ | No |
| `comp1-sale-date` | Comp 1: Sale Date | text | SalesTabPanel → Comparable Sales | ✅ | No |
| `comp1-sale-price` | Comp 1: Sale Price | currency | SalesTabPanel → Comparable Sales | ✅ | Yes |
| `comp1-units` | Comp 1: Units | number | SalesTabPanel → Comparable Sales | ✅ | Yes |
| `comp1-gba` | Comp 1: GBA (SF) | number | SalesTabPanel → Comparable Sales | ✅ | No |
| `comp1-year` | Comp 1: Year Built | number | SalesTabPanel → Comparable Sales | ✅ | No |

#### Comparable 2 Fields

| Field ID | Label | Type | Tab Location | Registry | Required |
|----------|-------|------|--------------|----------|----------|
| `comp2-name` | Comp 2: Property Name | text | SalesTabPanel → Comparable Sales | ✅ | No |
| `comp2-address` | Comp 2: Address | text | SalesTabPanel → Comparable Sales | ✅ | No |
| `comp2-sale-date` | Comp 2: Sale Date | text | SalesTabPanel → Comparable Sales | ✅ | No |
| `comp2-sale-price` | Comp 2: Sale Price | currency | SalesTabPanel → Comparable Sales | ✅ | Yes |
| `comp2-units` | Comp 2: Units | number | SalesTabPanel → Comparable Sales | ✅ | Yes |
| `comp2-gba` | Comp 2: GBA (SF) | number | SalesTabPanel → Comparable Sales | ✅ | No |
| `comp2-year` | Comp 2: Year Built | number | SalesTabPanel → Comparable Sales | ✅ | No |

#### Comparable 3 Fields

| Field ID | Label | Type | Tab Location | Registry | Required |
|----------|-------|------|--------------|----------|----------|
| `comp3-name` | Comp 3: Property Name | text | SalesTabPanel → Comparable Sales | ✅ | No |
| `comp3-address` | Comp 3: Address | text | SalesTabPanel → Comparable Sales | ✅ | No |
| `comp3-sale-date` | Comp 3: Sale Date | text | SalesTabPanel → Comparable Sales | ✅ | No |
| `comp3-sale-price` | Comp 3: Sale Price | currency | SalesTabPanel → Comparable Sales | ✅ | Yes |
| `comp3-units` | Comp 3: Units | number | SalesTabPanel → Comparable Sales | ✅ | Yes |
| `comp3-gba` | Comp 3: GBA (SF) | number | SalesTabPanel → Comparable Sales | ✅ | No |
| `comp3-year` | Comp 3: Year Built | number | SalesTabPanel → Comparable Sales | ✅ | No |

#### Comparable 4 Fields

| Field ID | Label | Type | Tab Location | Registry | Required |
|----------|-------|------|--------------|----------|----------|
| `comp4-name` | Comp 4: Property Name | text | SalesTabPanel → Comparable Sales | ✅ | No |
| `comp4-address` | Comp 4: Address | text | SalesTabPanel → Comparable Sales | ✅ | No |
| `comp4-sale-date` | Comp 4: Sale Date | text | SalesTabPanel → Comparable Sales | ✅ | No |
| `comp4-sale-price` | Comp 4: Sale Price | currency | SalesTabPanel → Comparable Sales | ✅ | Yes |
| `comp4-units` | Comp 4: Units | number | SalesTabPanel → Comparable Sales | ✅ | Yes |
| `comp4-gba` | Comp 4: GBA (SF) | number | SalesTabPanel → Comparable Sales | ✅ | No |
| `comp4-year` | Comp 4: Year Built | number | SalesTabPanel → Comparable Sales | ✅ | No |

#### Comparable 5 Fields

| Field ID | Label | Type | Tab Location | Registry | Required |
|----------|-------|------|--------------|----------|----------|
| `comp5-name` | Comp 5: Property Name | text | SalesTabPanel → Comparable Sales | ✅ | No |
| `comp5-address` | Comp 5: Address | text | SalesTabPanel → Comparable Sales | ✅ | No |
| `comp5-sale-date` | Comp 5: Sale Date | text | SalesTabPanel → Comparable Sales | ✅ | No |
| `comp5-sale-price` | Comp 5: Sale Price | currency | SalesTabPanel → Comparable Sales | ✅ | Yes |
| `comp5-units` | Comp 5: Units | number | SalesTabPanel → Comparable Sales | ✅ | Yes |
| `comp5-gba` | Comp 5: GBA (SF) | number | SalesTabPanel → Comparable Sales | ✅ | No |
| `comp5-year` | Comp 5: Year Built | number | SalesTabPanel → Comparable Sales | ✅ | No |

**Example Filled Inputs** (5 Comparables):
```
Comp 1: "Oakwood Apartments" | Address: "123 Main St" | Sale Date: "03/2024" | Sale Price: $2,400,000 | Units: 18 | SF: 13,500 | Year: 1985
Comp 2: "Maple Heights" | Address: "456 Oak Ave" | Sale Date: "01/2024" | Sale Price: $2,100,000 | Units: 16 | SF: 12,200 | Year: 1990
Comp 3: "Pine Grove" | Address: "789 Elm Blvd" | Sale Date: "11/2023" | Sale Price: $2,600,000 | Units: 20 | SF: 14,800 | Year: 1988
Comp 4: "Cedar Court" | Address: "321 Pine St" | Sale Date: "08/2023" | Sale Price: $1,950,000 | Units: 14 | SF: 11,000 | Year: 1992
Comp 5: "Birch Manor" | Address: "654 Cedar Ln" | Sale Date: "05/2023" | Sale Price: $2,300,000 | Units: 17 | SF: 13,100 | Year: 1987
```

---

### Section 3: Adjustments (×5 Comparables × 8 Categories)

Each comparable has 8 adjustment categories. Adjustments are entered as percentages (%).

#### Transaction Adjustments (Applied First)

| Field ID | Label | Type | Tab Location | Registry | Required |
|----------|-------|------|--------------|----------|----------|
| `comp1-adj-property-rights` | Comp 1: Property Rights Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp1-adj-financing` | Comp 1: Financing Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp1-adj-sale-conditions` | Comp 1: Conditions of Sale Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp1-adj-market-conditions` | Comp 1: Market Conditions Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp2-adj-property-rights` | Comp 2: Property Rights Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp2-adj-financing` | Comp 2: Financing Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp2-adj-sale-conditions` | Comp 2: Conditions of Sale Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp2-adj-market-conditions` | Comp 2: Market Conditions Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp3-adj-property-rights` | Comp 3: Property Rights Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp3-adj-financing` | Comp 3: Financing Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp3-adj-sale-conditions` | Comp 3: Conditions of Sale Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp3-adj-market-conditions` | Comp 3: Market Conditions Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp4-adj-property-rights` | Comp 4: Property Rights Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp4-adj-financing` | Comp 4: Financing Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp4-adj-sale-conditions` | Comp 4: Conditions of Sale Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp4-adj-market-conditions` | Comp 4: Market Conditions Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp5-adj-property-rights` | Comp 5: Property Rights Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp5-adj-financing` | Comp 5: Financing Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp5-adj-sale-conditions` | Comp 5: Conditions of Sale Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp5-adj-market-conditions` | Comp 5: Market Conditions Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |

#### Physical Adjustments (Applied Second)

| Field ID | Label | Type | Tab Location | Registry | Required |
|----------|-------|------|--------------|----------|----------|
| `comp1-adj-location` | Comp 1: Location Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp1-adj-size` | Comp 1: Size Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp1-adj-age-condition` | Comp 1: Age/Condition Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp1-adj-other` | Comp 1: Other Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp2-adj-location` | Comp 2: Location Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp2-adj-size` | Comp 2: Size Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp2-adj-age-condition` | Comp 2: Age/Condition Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp2-adj-other` | Comp 2: Other Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp3-adj-location` | Comp 3: Location Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp3-adj-size` | Comp 3: Size Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp3-adj-age-condition` | Comp 3: Age/Condition Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp3-adj-other` | Comp 3: Other Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp4-adj-location` | Comp 4: Location Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp4-adj-size` | Comp 4: Size Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp4-adj-age-condition` | Comp 4: Age/Condition Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp4-adj-other` | Comp 4: Other Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp5-adj-location` | Comp 5: Location Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp5-adj-size` | Comp 5: Size Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp5-adj-age-condition` | Comp 5: Age/Condition Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |
| `comp5-adj-other` | Comp 5: Other Adj (%) | percentage | SalesTabPanel → Adjustments | ✅ | No |

**Example Filled Adjustments** (5 Comparables):
```
Comp 1: Rights: 0% | Financing: -2% | Sale Cond: 0% | Market: +3% | Location: +1% | Size: -2% | Age: +1% | Other: 0%
Comp 2: Rights: 0% | Financing: 0% | Sale Cond: 0% | Market: +4% | Location: 0% | Size: +1% | Age: +2% | Other: 0%
Comp 3: Rights: 0% | Financing: -1% | Sale Cond: 0% | Market: +2% | Location: -1% | Size: -3% | Age: 0% | Other: 0%
Comp 4: Rights: 0% | Financing: 0% | Sale Cond: 0% | Market: +5% | Location: +2% | Size: +3% | Age: +1% | Other: 0%
Comp 5: Rights: 0% | Financing: -1% | Sale Cond: 0% | Market: +3% | Location: 0% | Size: -1% | Age: +1% | Other: 0%
```

---

## OUTPUT FIELDS (Calculated Results)

These are **calculated** by `runSalesCompCalculations()` from the inputs above, then displayed in `SalesComparisonPanel` tables and exported to report template.

### Output Table 1: Per-Comparable Basic Calculations

For each comparable (comp1 through comp5), the following outputs are calculated:

| Output Field ID | Report Page | Calculation | Depends On Inputs |
|----------------|-------------|-------------|-------------------|
| `comp1-price-per-unit` | Page 41 | comp1-sale-price / comp1-units | `comp1-sale-price`, `comp1-units` |
| `comp1-price-per-sf` | Page 41 | comp1-sale-price / comp1-gba | `comp1-sale-price`, `comp1-gba` |
| `comp2-price-per-unit` | Page 41 | comp2-sale-price / comp2-units | `comp2-sale-price`, `comp2-units` |
| `comp2-price-per-sf` | Page 41 | comp2-sale-price / comp2-gba | `comp2-sale-price`, `comp2-gba` |
| `comp3-price-per-unit` | Page 41 | comp3-sale-price / comp3-units | `comp3-sale-price`, `comp3-units` |
| `comp3-price-per-sf` | Page 41 | comp3-sale-price / comp3-gba | `comp3-sale-price`, `comp3-gba` |
| `comp4-price-per-unit` | Page 41 | comp4-sale-price / comp4-units | `comp4-sale-price`, `comp4-units` |
| `comp4-price-per-sf` | Page 41 | comp4-sale-price / comp4-gba | `comp4-sale-price`, `comp4-gba` |
| `comp5-price-per-unit` | Page 41 | comp5-sale-price / comp5-units | `comp5-sale-price`, `comp5-units` |
| `comp5-price-per-sf` | Page 41 | comp5-sale-price / comp5-gba | `comp5-sale-price`, `comp5-gba` |

**Example Output**:
```
Comp 1: $133,333/unit ($2,400,000 / 18), $177.78/SF ($2,400,000 / 13,500)
Comp 2: $131,250/unit ($2,100,000 / 16), $172.13/SF ($2,100,000 / 12,200)
Comp 3: $130,000/unit ($2,600,000 / 20), $175.68/SF ($2,600,000 / 14,800)
Comp 4: $139,286/unit ($1,950,000 / 14), $177.27/SF ($1,950,000 / 11,000)
Comp 5: $135,294/unit ($2,300,000 / 17), $175.57/SF ($2,300,000 / 13,100)
```

---

### Output Table 2: Adjustment Summaries (Per Comparable)

For each comparable, adjustment totals are calculated:

| Output Field ID | Report Page | Calculation | Depends On Inputs |
|----------------|-------------|-------------|-------------------|
| `comp1-total-trans-adj` | Page 42 | SUM(property-rights, financing, sale-conditions, market-conditions) | `comp1-adj-property-rights`, `comp1-adj-financing`, `comp1-adj-sale-conditions`, `comp1-adj-market-conditions` |
| `comp1-total-phys-adj` | Page 42 | SUM(location, size, age-condition, other) | `comp1-adj-location`, `comp1-adj-size`, `comp1-adj-age-condition`, `comp1-adj-other` |
| `comp1-net-adj` | Page 42 | total-trans-adj + total-phys-adj | `comp1-total-trans-adj`, `comp1-total-phys-adj` |
| `comp1-gross-adj` | Page 42 | ABS(property-rights) + ABS(financing) + ... + ABS(other) | All `comp1-adj-*` fields |
| `comp2-total-trans-adj` | Page 42 | SUM(property-rights, financing, sale-conditions, market-conditions) | `comp2-adj-property-rights`, `comp2-adj-financing`, `comp2-adj-sale-conditions`, `comp2-adj-market-conditions` |
| `comp2-total-phys-adj` | Page 42 | SUM(location, size, age-condition, other) | `comp2-adj-location`, `comp2-adj-size`, `comp2-adj-age-condition`, `comp2-adj-other` |
| `comp2-net-adj` | Page 42 | total-trans-adj + total-phys-adj | `comp2-total-trans-adj`, `comp2-total-phys-adj` |
| `comp2-gross-adj` | Page 42 | ABS(property-rights) + ABS(financing) + ... + ABS(other) | All `comp2-adj-*` fields |
| `comp3-total-trans-adj` | Page 42 | SUM(property-rights, financing, sale-conditions, market-conditions) | `comp3-adj-property-rights`, `comp3-adj-financing`, `comp3-adj-sale-conditions`, `comp3-adj-market-conditions` |
| `comp3-total-phys-adj` | Page 42 | SUM(location, size, age-condition, other) | `comp3-adj-location`, `comp3-adj-size`, `comp3-adj-age-condition`, `comp3-adj-other` |
| `comp3-net-adj` | Page 42 | total-trans-adj + total-phys-adj | `comp3-total-trans-adj`, `comp3-total-phys-adj` |
| `comp3-gross-adj` | Page 42 | ABS(property-rights) + ABS(financing) + ... + ABS(other) | All `comp3-adj-*` fields |
| `comp4-total-trans-adj` | Page 42 | SUM(property-rights, financing, sale-conditions, market-conditions) | `comp4-adj-property-rights`, `comp4-adj-financing`, `comp4-adj-sale-conditions`, `comp4-adj-market-conditions` |
| `comp4-total-phys-adj` | Page 42 | SUM(location, size, age-condition, other) | `comp4-adj-location`, `comp4-adj-size`, `comp4-adj-age-condition`, `comp4-adj-other` |
| `comp4-net-adj` | Page 42 | total-trans-adj + total-phys-adj | `comp4-total-trans-adj`, `comp4-total-phys-adj` |
| `comp4-gross-adj` | Page 42 | ABS(property-rights) + ABS(financing) + ... + ABS(other) | All `comp4-adj-*` fields |
| `comp5-total-trans-adj` | Page 42 | SUM(property-rights, financing, sale-conditions, market-conditions) | `comp5-adj-property-rights`, `comp5-adj-financing`, `comp5-adj-sale-conditions`, `comp5-adj-market-conditions` |
| `comp5-total-phys-adj` | Page 42 | SUM(location, size, age-condition, other) | `comp5-adj-location`, `comp5-adj-size`, `comp5-adj-age-condition`, `comp5-adj-other` |
| `comp5-net-adj` | Page 42 | total-trans-adj + total-phys-adj | `comp5-total-trans-adj`, `comp5-total-phys-adj` |
| `comp5-gross-adj` | Page 42 | ABS(property-rights) + ABS(financing) + ... + ABS(other) | All `comp5-adj-*` fields |

**Example Output** (using example adjustments above):
```
Comp 1: Trans Adj: +1% (0-2+0+3), Phys Adj: 0% (1-2+1+0), Net: +1%, Gross: 9%
Comp 2: Trans Adj: +4% (0+0+0+4), Phys Adj: +3% (0+1+2+0), Net: +7%, Gross: 7%
Comp 3: Trans Adj: +1% (0-1+0+2), Phys Adj: -4% (-1-3+0+0), Net: -3%, Gross: 7%
Comp 4: Trans Adj: +5% (0+0+0+5), Phys Adj: +6% (2+3+1+0), Net: +11%, Gross: 11%
Comp 5: Trans Adj: +2% (0-1+0+3), Phys Adj: 0% (0-1+1+0), Net: +2%, Gross: 5%
```

---

### Output Table 3: Adjusted Price Per Unit (Per Comparable)

| Output Field ID | Report Page | Calculation | Depends On Inputs |
|----------------|-------------|-------------|-------------------|
| `comp1-adj-price-per-unit` | Page 43 | comp1-price-per-unit × (1 + (comp1-total-trans-adj + comp1-total-phys-adj) / 100) | `comp1-price-per-unit`, `comp1-total-trans-adj`, `comp1-total-phys-adj` |
| `comp2-adj-price-per-unit` | Page 43 | comp2-price-per-unit × (1 + (comp2-total-trans-adj + comp2-total-phys-adj) / 100) | `comp2-price-per-unit`, `comp2-total-trans-adj`, `comp2-total-phys-adj` |
| `comp3-adj-price-per-unit` | Page 43 | comp3-price-per-unit × (1 + (comp3-total-trans-adj + comp3-total-phys-adj) / 100) | `comp3-price-per-unit`, `comp3-total-trans-adj`, `comp3-total-phys-adj` |
| `comp4-adj-price-per-unit` | Page 43 | comp4-price-per-unit × (1 + (comp4-total-trans-adj + comp4-total-phys-adj) / 100) | `comp4-price-per-unit`, `comp4-total-trans-adj`, `comp4-total-phys-adj` |
| `comp5-adj-price-per-unit` | Page 43 | comp5-price-per-unit × (1 + (comp5-total-trans-adj + comp5-total-phys-adj) / 100) | `comp5-price-per-unit`, `comp5-total-trans-adj`, `comp5-total-phys-adj` |

**Example Output** (using example values above):
```
Comp 1: $134,666/unit ($133,333 × 1.01)
Comp 2: $140,438/unit ($131,250 × 1.07)
Comp 3: $126,100/unit ($130,000 × 0.97)
Comp 4: $154,608/unit ($139,286 × 1.11)
Comp 5: $138,000/unit ($135,294 × 1.02)
```

---

### Output Table 4: Value Indication Summary

| Output Field ID | Report Page | Calculation | Depends On Inputs |
|----------------|-------------|-------------|-------------------|
| `sca-indicated-value` | Page 44 | AVG(valid comps adj-price-per-unit) × calc-total-units | All `compN-adj-price-per-unit` (where compN-sale-price > 0), `calc-total-units` |
| `sca-indicated-value-rounded` | Page 44 | ROUND(sca-indicated-value / 10000) × 10000 | `sca-indicated-value` |
| `sca-value-per-sf` | Page 44 | sca-indicated-value / calc-total-sf | `sca-indicated-value`, `calc-total-sf` |

**Calculation Logic**:
1. Filter comparables where `sale-price > 0` (valid comps)
2. Calculate average of `adj-price-per-unit` for valid comps
3. Multiply average by subject property `calc-total-units`
4. Round to nearest $10,000 for `sca-indicated-value-rounded`
5. Divide by `calc-total-sf` for per-SF value

**Example Output** (using example values above):
```
Valid Comparables: 5 (all have sale-price > 0)
Average Adjusted Price/Unit: $138,762.40
  = ($134,666 + $140,438 + $126,100 + $154,608 + $138,000) / 5

Subject Units: 16 (from Income Approach)
───────────────────────
Indicated Value: $2,220,198 ($138,762.40 × 16)
Indicated Value (Rounded): $2,220,000
Indicated Value/SF: $174.82 ($2,220,198 / 12,700)
```

---

## DEPENDENCIES MAPPED

### Input Dependencies

**Subject Property**:
- `calc-total-units` ← Calculated from Income Approach Unit Mix
- `calc-total-sf` ← Calculated from Income Approach Unit Mix

**Comparable Data**:
- Each comparable requires: `sale-price` and `units` (minimum)
- Optional: `name`, `address`, `sale-date`, `gba`, `year`
- All adjustment fields are optional (default to 0%)

### Output Dependencies

**Per-Comparable Calculations**:
- `compN-price-per-unit` ← `compN-sale-price`, `compN-units`
- `compN-price-per-sf` ← `compN-sale-price`, `compN-gba`
- `compN-total-trans-adj` ← All 4 transaction adjustment inputs
- `compN-total-phys-adj` ← All 4 physical adjustment inputs
- `compN-net-adj` ← `compN-total-trans-adj`, `compN-total-phys-adj`
- `compN-gross-adj` ← All 8 adjustment inputs (absolute values)
- `compN-adj-price-per-unit` ← `compN-price-per-unit`, `compN-total-trans-adj`, `compN-total-phys-adj`

**Final Value Indication**:
- `sca-indicated-value` ← All valid `compN-adj-price-per-unit`, `calc-total-units`
- `sca-indicated-value-rounded` ← `sca-indicated-value`
- `sca-value-per-sf` ← `sca-indicated-value`, `calc-total-sf`

### Cross-Section Dependencies

**Sales Comparison depends on Income Approach**:
- Subject property units and SF come from Income Approach calculations
- If Income Approach not completed, Sales Comparison cannot calculate final value
- Sales Comparison can still calculate per-comparable adjusted prices independently

---

## EXAMPLE VALUES (Complete Flow)

### Input Values

**Subject Property** (from Income Approach):
```
Total Units: 16
Total SF: 12,700
```

**Comparable 1**:
```
Name: "Oakwood Apartments"
Address: "123 Main St"
Sale Date: "03/2024"
Sale Price: $2,400,000
Units: 18
GBA: 13,500 SF
Year Built: 1985

Adjustments:
  Property Rights: 0%
  Financing: -2%
  Sale Conditions: 0%
  Market Conditions: +3%
  Location: +1%
  Size: -2%
  Age/Condition: +1%
  Other: 0%
```

**Comparable 2**:
```
Name: "Maple Heights"
Address: "456 Oak Ave"
Sale Date: "01/2024"
Sale Price: $2,100,000
Units: 16
GBA: 12,200 SF
Year Built: 1990

Adjustments:
  Property Rights: 0%
  Financing: 0%
  Sale Conditions: 0%
  Market Conditions: +4%
  Location: 0%
  Size: +1%
  Age/Condition: +2%
  Other: 0%
```

**Comparable 3**:
```
Name: "Pine Grove"
Address: "789 Elm Blvd"
Sale Date: "11/2023"
Sale Price: $2,600,000
Units: 20
GBA: 14,800 SF
Year Built: 1988

Adjustments:
  Property Rights: 0%
  Financing: -1%
  Sale Conditions: 0%
  Market Conditions: +2%
  Location: -1%
  Size: -3%
  Age/Condition: 0%
  Other: 0%
```

**Comparable 4**:
```
Name: "Cedar Court"
Address: "321 Pine St"
Sale Date: "08/2023"
Sale Price: $1,950,000
Units: 14
GBA: 11,000 SF
Year Built: 1992

Adjustments:
  Property Rights: 0%
  Financing: 0%
  Sale Conditions: 0%
  Market Conditions: +5%
  Location: +2%
  Size: +3%
  Age/Condition: +1%
  Other: 0%
```

**Comparable 5**:
```
Name: "Birch Manor"
Address: "654 Cedar Ln"
Sale Date: "05/2023"
Sale Price: $2,300,000
Units: 17
GBA: 13,100 SF
Year Built: 1987

Adjustments:
  Property Rights: 0%
  Financing: -1%
  Sale Conditions: 0%
  Market Conditions: +3%
  Location: 0%
  Size: -1%
  Age/Condition: +1%
  Other: 0%
```

### Calculated Outputs

**Per-Comparable Calculations**:

| Comp | Price/Unit | Price/SF | Trans Adj | Phys Adj | Net Adj | Gross Adj | Adj Price/Unit |
|------|------------|---------|-----------|----------|---------|-----------|----------------|
| 1 | $133,333 | $177.78 | +1% | 0% | +1% | 9% | $134,666 |
| 2 | $131,250 | $172.13 | +4% | +3% | +7% | 7% | $140,438 |
| 3 | $130,000 | $175.68 | +1% | -4% | -3% | 7% | $126,100 |
| 4 | $139,286 | $177.27 | +5% | +6% | +11% | 11% | $154,608 |
| 5 | $135,294 | $175.57 | +2% | 0% | +2% | 5% | $138,000 |

**Value Indication**:
```
Average Adjusted Price/Unit: $138,762.40
  = ($134,666 + $140,438 + $126,100 + $154,608 + $138,000) / 5

Subject Units: 16
───────────────────────
Indicated Value: $2,220,198
Indicated Value (Rounded): $2,220,000
Indicated Value/SF: $174.82
```

---

## VERIFICATION CHECKLIST

### Input Verification
- [x] All input fields exist in fieldRegistry.ts (1,643 fields)
- [x] All input fields rendered in SalesComparisonPanel.tsx
- [x] Input fields wired to `updateFieldValue()` + `runCalculations()`
- [ ] **VERIFY**: Test data saves to store correctly
- [ ] **VERIFY**: Calculations trigger after input change
- [ ] **VERIFY**: Subject property fields (`calc-total-units`, `calc-total-sf`) populated from Income Approach

### Output Verification
- [x] All calculated fields exist in fieldRegistry.ts as `inputSource: "calculated"`
- [x] All calculated fields rendered in SalesComparisonPanel.tsx
- [x] Calculation logic implemented in `salesCompCalculations.ts`
- [ ] **VERIFY**: Calculation formulas match expected logic
- [ ] **VERIFY**: Template placeholders populate from calculated values
- [ ] **VERIFY**: PDF export shows correct calculated results
- [ ] **VERIFY**: Adjusted prices calculate correctly with positive and negative adjustments
- [ ] **VERIFY**: Indicated value uses only valid comparables (sale-price > 0)

### Flow Verification
- [ ] **VERIFY**: User enters inputs → Store updates → Calc engine runs → Outputs update → Template shows results
- [ ] **VERIFY**: No orphaned inputs (inputs that don't feed any output)
- [ ] **VERIFY**: No orphaned outputs (outputs missing required inputs)
- [ ] **VERIFY**: Cross-section dependency (Income Approach → Sales Comparison) works correctly
- [ ] **VERIFY**: Empty comparables (sale-price = 0) excluded from indicated value calculation

### Calculation Logic Verification
- [ ] **VERIFY**: Transaction adjustments sum correctly (4 categories)
- [ ] **VERIFY**: Physical adjustments sum correctly (4 categories)
- [ ] **VERIFY**: Net adjustment = trans + phys (can be negative)
- [ ] **VERIFY**: Gross adjustment = sum of absolute values
- [ ] **VERIFY**: Adjusted price = price-per-unit × (1 + net-adj/100)
- [ ] **VERIFY**: Indicated value = average(adj-price-per-unit) × subject-units
- [ ] **VERIFY**: Rounding logic for `sca-indicated-value-rounded` (nearest $10,000)

---

## ISSUES IDENTIFIED

### Missing Inputs (Still Need UI)
- None identified for Sales Comparison Approach ✅

### Potential Calculation Issues
1. **Subject Property Dependency**: Sales Comparison requires Income Approach to be completed first (for `calc-total-units` and `calc-total-sf`). Consider fallback to `property-total-units` and `property-nra` if Income Approach not completed.
2. **Empty Comparables**: Current logic correctly excludes comparables with `sale-price = 0` from indicated value calculation. Verify UI handles this gracefully.
3. **Adjustment Sign Convention**: Verify that negative adjustments (e.g., -2% financing) correctly reduce adjusted price. Formula: `price × (1 + adj/100)` means -2% = `price × 0.98`.
4. **Direct Comparison Summary**: The panel shows "Direct Comparison Summary" table with transaction-adjusted price and final price. Verify these match the calculation logic in `salesCompCalculations.ts`.

### Template Mapping Gaps
- [ ] **TODO**: Verify all `compN-*` fields in template have corresponding calculated fields in registry
- [ ] **TODO**: Verify `sca-indicated-value` and `sca-indicated-value-rounded` placeholders exist in template
- [ ] **TODO**: Check for duplicate field IDs in template (known issue: 121 duplicates pending cleanup)

---

## FIELD COUNT SUMMARY

### Input Fields
- **Subject Property**: 2 fields (from Income Approach)
- **Comparable Sales Data**: 5 comparables × 7 fields = 35 fields
- **Adjustments**: 5 comparables × 8 categories = 40 fields
- **Total Input Fields**: 77 fields

### Output Fields
- **Per-Comparable Basic**: 5 comparables × 2 fields = 10 fields
- **Per-Comparable Adjustments**: 5 comparables × 4 fields = 20 fields
- **Per-Comparable Adjusted Price**: 5 comparables × 1 field = 5 fields
- **Value Indication**: 3 fields
- **Total Output Fields**: 38 fields

### Grand Total
- **Total Fields**: 115 fields (77 inputs + 38 outputs)

---

## NEXT STEPS

1. **Run Test**: Fill all SalesTabPanel inputs with sample data (5 comparables with adjustments), verify outputs populate correctly
2. **Export Test**: Generate PDF, verify all `{{compN-*}}` and `{{sca-*}}` placeholders show calculated values (not literal text)
3. **Cross-Section Test**: Complete Income Approach first, then verify Sales Comparison uses correct subject property values
4. **Create Similar Docs**: Replicate this INPUT → OUTPUT format for:
   - Cost Approach
   - Reconciliation
   - Other report sections with calculations

---

**Document Status**: ✅ First draft complete
**Ready for**: Testing & verification by agent or user
