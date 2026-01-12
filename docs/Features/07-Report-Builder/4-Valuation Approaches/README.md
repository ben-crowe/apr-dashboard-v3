# Valuation Approaches

**Three Core Approaches to Value** used in real estate appraisal per USPAP/CUSPAP standards.

---

## Overview

| Approach | Description | Status | Pages |
|----------|-------------|--------|-------|
| **Income Approach** | Capitalizes NOI to derive value | ✅ COMPLETE | 44-50 |
| **Sales Comparison** | Adjusts comparable sales | ⚠️ IN PROGRESS | 51-62 |
| **Cost Approach** | Land + depreciated improvements | ❌ NOT STARTED | 63-68 |

---

## 1. Income Approach

**Method:** Direct Capitalization (NOI ÷ Cap Rate = Value)

**Implementation Status:** ✅ COMPLETE
- Calc engine: `runCalculations()` in reportBuilderStore.ts
- 86 calculated field outputs
- Calculator Demo v4 fully functional
- North Battleford test data validates to $1,780,000

**Key Components:**
- Unit mix (4 unit types)
- PGR, Vacancy, EGR calculations
- 7 expense categories with 5 metrics each
- NOI and capitalization

**Files:**
- `src/features/report-builder/store/reportBuilderStore.ts`
- `src/features/calculator-demo-v4/` (full implementation)

---

## 2. Sales Comparison Approach

**Method:** Adjust comparable sales to subject property

**Implementation Status:** ⚠️ IN PROGRESS
- Calculator Demo v4 has working sandbox (LOCAL STATE)
- Full report engine NOT BUILT (~620 fields needed)
- Test data: ZERO comps in northBattlefordTestData.ts

**Key Components:**
- 5 comparable sales (not 3 as originally planned)
- ~120 fields per comp
- Transactional adjustments (property rights, financing, conditions, market)
- Physical adjustments (location, size, age, condition)
- Summary grid with adjusted values

**Files:**
- `2-Sales-Comparison/SALES-COMPARISON-ENGINE-HANDOFF.md` - Full spec
- `2-Sales-Comparison/SALES-COMPARABLES-DATA-MAPPING.md` - Field mapping
- `src/features/calculator-demo-v4/components/SalesComparisonPanel.tsx` - Sandbox

---

## 3. Cost Approach

**Method:** Land Value + Replacement Cost - Depreciation = Value

**Implementation Status:** ❌ NOT STARTED
- No fields defined
- No test data
- No calc engine

**Key Components (typical):**
- Land valuation (comparable land sales)
- Replacement cost new ($/SF or Marshall & Swift)
- Physical depreciation (age/life method)
- Functional obsolescence
- External obsolescence

**Files:**
- `3-Cost-Approach/` - Placeholder

---

## Reconciliation

After all three approaches are calculated, values are reconciled:

```
Final Value = (Income Value × Weight₁) + (Sales Value × Weight₂) + (Cost Value × Weight₃)
```

**Typical Weighting (Multi-Family):**
- Income Approach: 60-80% (primary for investment properties)
- Sales Comparison: 20-40% (market confirmation)
- Cost Approach: 0-10% (usually limited weight for older properties)

**Current Implementation:**
- `ReconciliationPanel.tsx` combines Income + Sales approaches
- Weighted average calculation
- Cost approach not yet included

---

## Calculator Demo v4

The calculator at `/calculator-demo` serves as the **source of truth** for testing all valuation approaches.

**Current Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  INPUT PANEL (45%)       │  OUTPUT PANEL (55%)              │
├──────────────────────────┴──────────────────────────────────┤
│  [▼ Sales Comparison Approach] - Working sandbox            │
├─────────────────────────────────────────────────────────────┤
│  [▼ Value Reconciliation] - Combines Income + Sales         │
├─────────────────────────────────────────────────────────────┤
│  [▼ Summary Report] - Quick reference cards                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Priority

1. **Phase 1:** Income Approach Tables (template-matched report output)
2. **Phase 2:** Sales Comparison Engine (full ~620 fields, store integration)
3. **Phase 3:** Reconciliation (weighted combination of all approaches)
4. **Phase 4:** Cost Approach (future)

---

*Last Updated: December 26, 2025*
