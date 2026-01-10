# Sales Comparison Approach - Feature Specification

**Target:** Calculator Test Page (sandbox)
**Status:** Planning
**Date:** 2024-12-12

---

## Overview

Add a Sales Comparison Approach section to the calculator test page as a new tab or collapsible section below the existing Income Approach.

**Important:** This is a standalone calculation in the test page ONLY.

```
TEST CALCULATOR PAGE (sandbox)
├── Income Approach section    ← EXISTS, working, validated
├── Sales Comparison section   ← NEW - this feature
└── Reconciliation section     ← NEW - this feature
```

**Does NOT touch:**
- `reportBuilderStore.ts` (validated engine - protected)
- `fieldRegistry.ts` (add fields LATER after validation)
- Report builder production code

**Flow:** Build in sandbox → Validate math → Migrate to production when proven

---

## Section 1: Comparable Sales Input

Add 5 comparable sale entries. Each comp has:

| Field | Type | Notes |
|-------|------|-------|
| Property Name | text | e.g., "Riverside Apartments" |
| Address | text | Full address |
| Sale Date | date | MM/YYYY or full date |
| Sale Price | currency | e.g., $1,500,000 |
| Units | number | Unit count |
| SF (GBA) | number | Gross Building Area |
| Year Built | number | 4-digit year |
| $/Unit | calculated | Sale Price ÷ Units |
| $/SF | calculated | Sale Price ÷ SF |

**UI Notes:**
- Compact table format similar to Unit Mix table
- Input fields for editable values
- Auto-calculate $/Unit and $/SF on change

---

## Section 2: Adjustment Grid

For each comp, percentage adjustments:

| Adjustment Category | Type | Range |
|---------------------|------|-------|
| Property Rights | +/- % | Typically 0% |
| Financing | +/- % | Cash equivalent adjustment |
| Conditions of Sale | +/- % | Arms-length adjustment |
| Market Conditions (Time) | +/- % | Time adjustment to date of value |
| Location | +/- % | Location quality difference |
| Size | +/- % | Size/scale adjustment |
| Age/Condition | +/- % | Physical condition adjustment |
| Other | +/- % | Catch-all for other factors |

**Calculated Fields:**
- **NET ADJUSTMENT** = Sum of all adjustment percentages
- **ADJUSTED $/UNIT** = $/Unit × (1 + Net Adjustment/100)

**UI Notes:**
- Grid format with comps as columns, adjustments as rows
- Each cell is an input field for percentage
- Show running total at bottom
- Color code: positive adjustments one color, negative another (subtle)

---

## Section 3: Sales Comparison Value Indication

Summary table showing adjusted values:

| Comp | Adjusted $/Unit |
|------|-----------------|
| 1 | $XXX,XXX |
| 2 | $XXX,XXX |
| 3 | $XXX,XXX |
| 4 | $XXX,XXX |
| 5 | $XXX,XXX |
| **Low** | $XXX,XXX |
| **High** | $XXX,XXX |
| **Average** | $XXX,XXX |

**User Input:**
- Indicated $/Unit: User selects/inputs value within the Low-High range
- Should show validation if outside range (warning, not error)

**Calculated:**
- **Indicated Value (Sales)** = Indicated $/Unit × Subject Units

**Subject Units:** Pull from Income Approach section (calc-total-units)

---

## Section 4: Final Reconciliation

Combine both approaches:

| Approach | Value | Weight |
|----------|-------|--------|
| Income Approach | $1,780,000 | __% |
| Sales Comparison | $X,XXX,XXX | __% |
| **RECONCILED VALUE** | $X,XXX,XXX | 100% |

**Logic:**
- Income Value: Pull from existing Income Approach (calc-indicated-value)
- Sales Value: From Section 3 calculation
- Weights: User inputs, must sum to 100%
- Reconciled Value = (Income × Income Weight) + (Sales × Sales Weight)

**UI Notes:**
- Final reconciled value should be prominent (like current Indicated Value display)
- Show per-unit and per-SF metrics for reconciled value

---

## UI/UX Requirements

### Layout Option A: Tabs
```
[Income Approach] [Sales Comparison] [Reconciliation]
     ↑ active tab shows content below
```

### Layout Option B: Collapsible Sections (Recommended)
```
Income Approach          [Expanded - current layout]
─────────────────────────────────────────────────────
Sales Comparison         [Collapsed by default]
─────────────────────────────────────────────────────
Reconciliation           [Collapsed by default]
```

### Styling
- Same dark theme as existing calculator
- Use existing ThemeContext colors (supports light/dark mode)
- Same border, text, and input styling
- Consistent with current InputPanel component patterns

---

## Data Flow

```
INCOME APPROACH (existing)
├── Total Units → feeds into Sales Comparison
└── Indicated Value → feeds into Reconciliation

SALES COMPARISON (new)
├── 5 Comps with adjustments
├── Adjusted $/Unit calculations
└── Indicated Value (Sales) → feeds into Reconciliation

RECONCILIATION (new)
├── Income Value (from Income Approach)
├── Sales Value (from Sales Comparison)
├── User-defined weights
└── Final Reconciled Value
```

---

## Implementation Notes

### Files to Create/Modify

**Create:**
- `src/features/calculator-demo/components/SalesComparisonPanel.tsx`
- `src/features/calculator-demo/components/ReconciliationPanel.tsx`

**Modify:**
- `src/features/calculator-demo/CalculatorDemoPage.tsx` - Add new sections/tabs

**Do NOT Modify:**
- `src/features/report-builder/store/reportBuilderStore.ts`
- `src/features/report-builder/utils/fieldRegistry.ts`
- Any production report builder code

### State Management

Option A: Local state in component (simpler, recommended for sandbox)
```typescript
const [comps, setComps] = useState<Comparable[]>([...5 empty comps]);
const [adjustments, setAdjustments] = useState<AdjustmentGrid>({...});
```

Option B: Add to Zustand store (if we want persistence)
- Only if needed for cross-component communication

---

## Test Data

Sample comp data for "Load Test Data" button:

| Comp | Property | Sale Price | Units | $/Unit |
|------|----------|------------|-------|--------|
| 1 | Riverside Apts | $1,650,000 | 12 | $137,500 |
| 2 | Oak Manor | $1,900,000 | 14 | $135,714 |
| 3 | Pine View | $1,450,000 | 10 | $145,000 |
| 4 | Cedar Heights | $2,100,000 | 16 | $131,250 |
| 5 | Maple Court | $1,750,000 | 13 | $134,615 |

---

## Validation Checklist

Before migrating to production:

- [ ] All calculations match manual spreadsheet verification
- [ ] Adjusted $/Unit formula correct
- [ ] Net adjustment sums correctly
- [ ] Reconciliation weights enforce 100% total
- [ ] Subject units correctly pulled from Income section
- [ ] Edge cases handled (zero values, missing comps)
- [ ] Light/dark mode works correctly
- [ ] Responsive layout on different screen sizes

---

## Future Migration Path

When validated in sandbox:

1. Add field definitions to `fieldRegistry.ts`
2. Add section to `reportBuilderStore.ts`
3. Add calculations to store
4. Add HTML template section for report output
5. Wire up report builder UI

---

## Agent Deployment Notes

When ready to implement, deploy:
- `frontend-developer` or `react-specialist` agent
- Provide this spec document as context
- Reference existing `InputPanel.tsx` for styling patterns
- Reference `ThemeContext.tsx` for theme colors
