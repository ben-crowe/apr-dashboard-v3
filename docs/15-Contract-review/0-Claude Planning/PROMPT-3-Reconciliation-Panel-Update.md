# Task: Update ReconciliationPanel for All 3 Valuation Approaches

**Prompt Set:** Calculator Demo Valuation Approaches (3 of 4)
**Priority:** After Prompts 1 & 2 - Ties everything together

---

## Context

The existing ReconciliationPanel handles Income + Sales (50/50 default).
Needs to add Cost Approach and allow toggling each approach on/off.

## File to Modify

`src/features/calculator-demo-v4/components/ReconciliationPanel.tsx`

---

## Current Props

```typescript
interface ReconciliationPanelProps {
  incomeValue: number;
  salesCompValue: number;
  onReconcile?: (finalValue: number) => void;
}
```

## Updated Props

```typescript
interface ReconciliationPanelProps {
  incomeValue: number;
  salesCompValue: number;
  costValue: number;
  onReconcile?: (finalValue: number) => void;
}
```

---

## UI Updates Needed

### Add Cost Approach Row

```
| Approach           | Indicated Value | Applied | Weight |
|--------------------|-----------------|---------|--------|
| Income Approach    | $1,790,000      | ✓       | 50%    |
| Sales Comparison   | $1,850,000      | ✓       | 50%    |
| Cost Approach      | $2,515,269      | ☐       | 0%     |
```

### Add "Applied" Toggle

Each approach should have a checkbox to include/exclude it from reconciliation.
When excluded, show "(Not Applied)" and 0% weight.

### Auto-Rebalance Weights

When toggling an approach:
- 1 approach active: 100%
- 2 approaches active: 50%/50%
- 3 approaches active: 33%/33%/34% (or allow manual adjustment)

### Calculation

```
Final Value = Σ(Value × Weight) for all applied approaches
```

### Display Updates

- Show each approach's contribution
- Show final reconciled value
- Show per-unit value (final ÷ total units)

---

## Implementation

```typescript
interface ApproachConfig {
  name: string;
  value: number;
  applied: boolean;
  weight: number;
}

const [approaches, setApproaches] = useState<ApproachConfig[]>([
  { name: 'Income Approach', value: incomeValue, applied: true, weight: 50 },
  { name: 'Sales Comparison', value: salesCompValue, applied: true, weight: 50 },
  { name: 'Cost Approach', value: costValue, applied: false, weight: 0 },
]);

// Auto-rebalance when toggling
const toggleApproach = (index: number) => {
  const updated = [...approaches];
  updated[index].applied = !updated[index].applied;

  const activeCount = updated.filter(a => a.applied).length;

  if (activeCount === 0) {
    // At least one must be active
    updated[index].applied = true;
    return;
  }

  // Rebalance weights
  const weightPerApproach = Math.floor(100 / activeCount);
  const remainder = 100 - (weightPerApproach * activeCount);

  let assignedRemainder = false;
  updated.forEach(a => {
    if (a.applied) {
      a.weight = weightPerApproach + (assignedRemainder ? 0 : remainder);
      assignedRemainder = true;
    } else {
      a.weight = 0;
    }
  });

  setApproaches(updated);
};

// Calculate final value
const finalValue = approaches.reduce((sum, a) => {
  return sum + (a.value * a.weight / 100);
}, 0);
```

---

## Validation

### North Battleford (Income + Sales only):
- Income: $1,790,000 × 50% = $895,000
- Sales: $1,850,000 × 50% = $925,000
- **Final: $1,820,000**

### With Cost Approach disabled:
Show: "(Not Applied - limited applicability for income properties)"

### When Cost IS applied (new construction scenario):
- Income: $1,790,000 × 33% = $590,700
- Sales: $1,850,000 × 33% = $610,500
- Cost: $2,515,269 × 34% = $855,191
- **Final: $2,056,391**

---

## Also Update CalculatorDemoPage.tsx

Pass costValue prop to ReconciliationPanel:

```typescript
<ReconciliationPanel
  incomeValue={indicatedValue}
  salesCompValue={salesCompIndicatedValue}
  costValue={costIndicatedValue}  // NEW
  onReconcile={handleReconcile}
/>
```

---

*Generated: December 26, 2025*
