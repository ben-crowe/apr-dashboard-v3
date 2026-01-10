# Cost Approach - Placeholder

**Status:** ❌ NOT STARTED
**Priority:** Low (after Income and Sales Comparison)
**Last Updated:** December 26, 2025

---

## Overview

The Cost Approach derives value by estimating the cost to replace the property:

```
Value = Land Value + Replacement Cost New - Depreciation
```

---

## Typical Components

### 1. Land Valuation
- Comparable land sales
- Allocation method
- Extraction method
- Ground rent capitalization

### 2. Replacement Cost New (RCN)
- Direct costs (materials, labor)
- Indirect costs (permits, fees, financing)
- Entrepreneurial profit
- Sources: Marshall & Swift, RS Means, local contractors

### 3. Depreciation
- **Physical Depreciation:** Age/life method, breakdown method
- **Functional Obsolescence:** Superadequacy, deficiency, outdated design
- **External Obsolescence:** Market conditions, location factors

---

## Report Pages

Per template analysis, Cost Approach covers Pages 63-68:

| Page | Content |
|------|---------|
| 63 | Cost Approach introduction |
| 64 | Land valuation |
| 65 | Replacement cost analysis |
| 66 | Depreciation schedule |
| 67 | Cost approach summary |
| 68 | Value indication |

---

## Field Requirements (Estimated)

| Component | Est. Fields |
|-----------|-------------|
| Land Value | ~20 |
| Building Cost | ~30 |
| Site Improvements | ~15 |
| Depreciation | ~25 |
| Summary | ~10 |
| **Total** | **~100** |

---

## Implementation Considerations

### Multi-Family Context
For multi-family properties, the Cost Approach typically receives limited weight in reconciliation because:
- Older properties have significant depreciation estimation challenges
- Market participants (investors) focus on income, not replacement cost
- Functional obsolescence is common in older building designs

### When Cost Approach is More Relevant
- New construction (minimal depreciation)
- Special-purpose properties
- Insurance valuations
- Litigation/condemnation
- Properties with limited market data

---

## Dependencies

Before starting Cost Approach:
1. ✅ Income Approach complete
2. ⚠️ Sales Comparison complete
3. ❌ Field registry structure for cost components
4. ❌ Test data with land and cost values

---

## Files to Create

```
3-Cost-Approach/
├── COST-APPROACH-ENGINE-HANDOFF.md    # Full implementation spec
├── LAND-VALUATION-FIELDS.md           # Land-specific fields
└── DEPRECIATION-METHODOLOGY.md        # Depreciation calculations
```

**Code files:**
- `src/features/report-builder/tables/cost-table.ts`
- `src/features/calculator-demo-v4/components/CostApproachPanel.tsx`

---

## Notes

This approach is intentionally deferred. Multi-family appraisals typically place minimal weight on Cost Approach, so Income and Sales Comparison are priorities.

---

*This is a placeholder. Implementation will begin after Sales Comparison is complete.*
