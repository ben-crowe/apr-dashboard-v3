# Sales Comparison Section Structure (11 Pages)

```
SALES COMPARISON APPROACH
├── PAGE 1: Methodology & Subject Summary
│   ├── Sales Comparison Methodology (narrative)
│   │   └── Principle of substitution explanation
│   │   └── Six-comparable framework description
│   └── Subject Property Summary Table
│       ├── Number of Units
│       ├── GBA
│       ├── Year Built
│       ├── Site Area
│       └── Condition
│
├── PAGE 2: Comparable Sales 1 & 2
│   ├── Comparable Sale 1 (full detail table)
│   │   ├── Property Name
│   │   ├── Address
│   │   ├── Sale Date
│   │   ├── Sale Price
│   │   ├── Units
│   │   ├── Price/Unit (calculated)
│   │   ├── GBA
│   │   ├── Price/SF (calculated)
│   │   ├── Year Built
│   │   └── Cap Rate
│   └── Comparable Sale 2 (full detail table)
│       └── [same structure as Sale 1]
│
├── PAGE 3: Comparable Sales 3 & 4
│   ├── Comparable Sale 3 (full detail table)
│   └── Comparable Sale 4 (full detail table) ★ NEW
│
├── PAGE 4: Comparable Sales 5 & 6
│   ├── Comparable Sale 5 (full detail table) ★ NEW
│   └── Comparable Sale 6 (full detail table) ★ NEW
│
├── PAGES 5-6: Comparable Sales Summary Table ★ NEW
│   └── Summary Table (all 6 comparables)
│       ├── Header Row: Property | Address | Sale Date | Price | Units | GBA | $/Unit | $/SF
│       ├── Subject Row (for comparison)
│       ├── Sale 1 Row
│       ├── Sale 2 Row
│       ├── Sale 3 Row
│       ├── Sale 4 Row ★ NEW
│       ├── Sale 5 Row ★ NEW
│       └── Sale 6 Row ★ NEW
│
├── PAGES 7-8: Comparable Sales Analysis ★ NEW
│   └── Individual Comparable Cards
│       ├── Sale 1 Card (narrative description)
│       ├── Sale 2 Card
│       ├── Sale 3 Card
│       ├── Sale 4 Card ★ NEW
│       ├── Sale 5 Card ★ NEW
│       └── Sale 6 Card ★ NEW
│
├── PAGE 9: Adjustment Grid Analysis ★ NEW
│   └── Adjustment Grid Table
│       ├── Header: Element | Subject | Sale 1-6
│       ├── Sale Price Row
│       ├── ADJUSTMENTS Section
│       │   ├── Property Rights
│       │   ├── Financing Terms
│       │   ├── Conditions of Sale
│       │   ├── Market Conditions (Time)
│       │   ├── Location
│       │   ├── Size (Units)
│       │   └── Age/Condition
│       ├── Net Adjustment Row
│       └── Adjusted Price Row
│
├── PAGE 10: Adjustment Summary ★ NEW
│   └── Adjustment Summary (narrative)
│       ├── Property Rights adjustments
│       ├── Financing Terms adjustments
│       ├── Conditions of Sale adjustments
│       ├── Market Conditions adjustments
│       ├── Location adjustments
│       ├── Size adjustments
│       └── Age/Condition adjustments
│
└── PAGE 11: Sales Comparison Reconciliation ★ NEW
    ├── Sales Comparison Reconciliation (narrative)
    │   ├── Degree of similarity analysis
    │   ├── Adjustment quantity and quality
    │   ├── Range of indicated values
    │   └── Weight assignment rationale
    └── Sales Comparison Value Conclusion Table
        └── Indicated Value - Sales Comparison Approach
```

## Field Pattern

For each sale (1-6), the following fields are available:

```typescript
{
  name: string;           // saleX-name
  address: string;        // saleX-address
  saleDate: string;       // saleX-sale-date
  salePrice: string;      // saleX-sale-price
  numUnits: string;       // saleX-num-units
  gba: string;            // saleX-gba
  yearBuilt: string;      // saleX-year-built
  capRate: string;        // saleX-cap-rate
  siteArea: string;       // saleX-site-area (optional)
  condition: string;      // saleX-condition (optional)
  description: string;    // saleX-description (for narrative cards)
}
```

## Narrative Fields

```typescript
{
  salesMethodology: string;      // Methodology introduction (with default)
  adjustmentSummary: string;     // Adjustment summary (with default)
  salesReconciliation: string;   // Reconciliation narrative (with default)
  salesValueIndication: string;  // Final concluded value
}
```

## Page Break Strategy

| Section | Page Break | Reason |
|---------|------------|--------|
| After Subject Summary | Before Comp 1 | Start individual comps on new page |
| After Comp 2 | Before Comp 3 | Group 2 comps per page |
| After Comp 4 | Before Comp 5 | Group 2 comps per page |
| After Comp 6 | Before Summary Table | Major section transition |
| After Summary Table | Before Analysis Cards | Major section transition |
| After Analysis Cards | Before Adjustment Grid | Major section transition |
| After Adjustment Grid | Before Adj Summary | Major section transition |
| After Adj Summary | Before Reconciliation | Final section |

Total: **8 page breaks** = **11 pages**

## Key Features

1. **Backward Compatible:** Works with 3 or 6 sales
2. **Auto-calculations:** Price/Unit and Price/SF computed automatically
3. **Default Text:** Professional default narratives when custom text not provided
4. **Conditional Rendering:** Sections only show when data exists
5. **Consistent Styling:** Matches existing report styling
6. **Professional Layout:** Clean, organized, appraisal-standard formatting

★ = New addition in this implementation
