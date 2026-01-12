# Page 60 - Dynamic Sales Comparison Analysis Chart Implementation Spec

**Status:** 📋 READY FOR IMPLEMENTATION
**Priority:** Medium (after core tables complete)
**Estimated Effort:** 3-4 hours
**Date Created:** December 18, 2025

---

## 🎯 OBJECTIVE

Replace the static chart image on Page 60 with a dynamically generated chart that:
1. Shows grouped bars for Transaction Price vs Adjusted Price per unit
2. Displays trend lines showing convergence after adjustments
3. Pulls data from registry fields (comp1-5)
4. Supports both Valcre integration AND standalone data entry
5. Renders correctly in both preview and PDF output

---

## 📊 CHART SPECIFICATIONS

### Chart Type
**Grouped Bar Chart + Dual Trend Lines**

### Data Sources

| Element | Registry Field Pattern | Type |
|---------|----------------------|------|
| Left Bar (Transaction $/Unit) | `comp{1-5}-price-per-unit` | currency |
| Right Bar (Adjusted $/Unit) | `comp{1-5}-adj-price-per-unit` | currency |
| Unadjusted Trend Line | Linear regression of price-per-unit | calculated |
| Adjusted Trend Line | Linear regression of adj-price-per-unit | calculated |
| Value Labels | Same as bars | currency |

### Visual Specifications

```yaml
chart:
  width: 800px
  height: 350px
  background: white
  title: "UNADJUSTED & ADJUSTED PRICE"
  
bars:
  group_spacing: 60px
  bar_width: 35px
  inner_spacing: 5px
  
  transaction_bar:
    color: "#1e3a5f"  # Navy blue (darker)
    label: "Transaction Price$/Unit"
    
  adjusted_bar:
    color: "#3d6a99"  # Medium blue (lighter)
    label: "Adjusted $/Unit"
  
trend_lines:
  unadjusted:
    color: "#1e3a5f"
    style: "dashed"
    strokeWidth: 2
    label: "Unadjusted"
    
  adjusted:
    color: "#3d6a99"
    style: "dashed"
    strokeWidth: 2
    label: "Adjusted"
    
axes:
  left:
    label: "Price per Unit"
    format: "$0,000"
    range: [0, 250000]  # Dynamic based on max value
    gridLines: true
    
  bottom:
    labels: ["COMP 1", "COMP 2", "COMP 3", "COMP 4", "COMP 5"]

legend:
  position: "bottom-center"
  items:
    - { label: "Transaction Price$/Unit", symbol: "square", color: "#1e3a5f" }
    - { label: "Adjusted $/Unit", symbol: "square", color: "#3d6a99" }
    - { label: "Unadjusted", symbol: "line-dashed", color: "#1e3a5f" }
    - { label: "Adjusted", symbol: "line-dashed", color: "#3d6a99" }

value_labels:
  show: true
  position: "top"
  format: "$0,000"
  fontSize: 11
```

---

## 🏗️ TECHNICAL APPROACH

### Recharts Implementation

```tsx
// src/features/report-builder/components/charts/SalesComparisonChart.tsx

import React, { useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  ReferenceLine,
} from 'recharts';
import { useReportBuilderStore } from '../../store/reportBuilderStore';

interface ChartDataPoint {
  name: string;
  compIndex: number;
  transactionPrice: number;
  adjustedPrice: number;
}

// Linear regression calculator
const calculateTrendLine = (data: number[]): { slope: number; intercept: number } => {
  const n = data.length;
  const xValues = data.map((_, i) => i + 1);
  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = data.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((acc, x, i) => acc + x * data[i], 0);
  const sumX2 = xValues.reduce((acc, x) => acc + x * x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return { slope, intercept };
};

export const SalesComparisonChart: React.FC = () => {
  const store = useReportBuilderStore();
  
  // Build chart data from store
  const chartData: ChartDataPoint[] = useMemo(() => [
    {
      name: 'COMP 1',
      compIndex: 1,
      transactionPrice: store.fields['comp1-price-per-unit'] || 0,
      adjustedPrice: store.fields['comp1-adj-price-per-unit'] || 0,
    },
    {
      name: 'COMP 2',
      compIndex: 2,
      transactionPrice: store.fields['comp2-price-per-unit'] || 0,
      adjustedPrice: store.fields['comp2-adj-price-per-unit'] || 0,
    },
    {
      name: 'COMP 3',
      compIndex: 3,
      transactionPrice: store.fields['comp3-price-per-unit'] || 0,
      adjustedPrice: store.fields['comp3-adj-price-per-unit'] || 0,
    },
    {
      name: 'COMP 4',
      compIndex: 4,
      transactionPrice: store.fields['comp4-price-per-unit'] || 0,
      adjustedPrice: store.fields['comp4-adj-price-per-unit'] || 0,
    },
    {
      name: 'COMP 5',
      compIndex: 5,
      transactionPrice: store.fields['comp5-price-per-unit'] || 0,
      adjustedPrice: store.fields['comp5-adj-price-per-unit'] || 0,
    },
  ], [store.fields]);

  // Calculate trend lines
  const trendData = useMemo(() => {
    const transactionPrices = chartData.map(d => d.transactionPrice);
    const adjustedPrices = chartData.map(d => d.adjustedPrice);
    
    const unadjustedTrend = calculateTrendLine(transactionPrices);
    const adjustedTrend = calculateTrendLine(adjustedPrices);
    
    return chartData.map((d, i) => ({
      ...d,
      unadjustedTrendValue: unadjustedTrend.intercept + unadjustedTrend.slope * (i + 1),
      adjustedTrendValue: adjustedTrend.intercept + adjustedTrend.slope * (i + 1),
    }));
  }, [chartData]);

  // Calculate dynamic Y-axis max
  const maxValue = Math.max(
    ...chartData.map(d => Math.max(d.transactionPrice, d.adjustedPrice))
  );
  const yAxisMax = Math.ceil(maxValue / 50000) * 50000 + 50000;

  // Currency formatter
  const formatCurrency = (value: number) => 
    `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

  return (
    <div className="sales-comparison-chart" style={{ width: '100%', height: 400 }}>
      <h3 style={{ textAlign: 'center', marginBottom: 10 }}>
        UNADJUSTED & ADJUSTED PRICE
      </h3>
      <ResponsiveContainer>
        <ComposedChart
          data={trendData}
          margin={{ top: 30, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
          />
          
          <YAxis
            domain={[0, yAxisMax]}
            tickFormatter={formatCurrency}
            tick={{ fontSize: 11 }}
          />
          
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
          />
          
          <Legend 
            verticalAlign="bottom"
            wrapperStyle={{ paddingTop: 20 }}
          />
          
          {/* Transaction Price Bars */}
          <Bar
            dataKey="transactionPrice"
            name="Transaction Price$/Unit"
            fill="#1e3a5f"
            barSize={35}
          >
            <LabelList 
              dataKey="transactionPrice" 
              position="top" 
              formatter={formatCurrency}
              style={{ fontSize: 10 }}
            />
          </Bar>
          
          {/* Adjusted Price Bars */}
          <Bar
            dataKey="adjustedPrice"
            name="Adjusted $/Unit"
            fill="#3d6a99"
            barSize={35}
          >
            <LabelList 
              dataKey="adjustedPrice" 
              position="top" 
              formatter={formatCurrency}
              style={{ fontSize: 10 }}
            />
          </Bar>
          
          {/* Unadjusted Trend Line */}
          <Line
            type="linear"
            dataKey="unadjustedTrendValue"
            name="Unadjusted"
            stroke="#1e3a5f"
            strokeWidth={2}
            strokeDasharray="8 4"
            dot={false}
          />
          
          {/* Adjusted Trend Line */}
          <Line
            type="linear"
            dataKey="adjustedTrendValue"
            name="Adjusted"
            stroke="#3d6a99"
            strokeWidth={2}
            strokeDasharray="8 4"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesComparisonChart;
```

---

## 🔗 DATA SOURCE INTEGRATION

### Option 1: Valcre Integration (Primary)

**Valcre workbook provides all data natively:**

| Field | Valcre Named Range | Registry ID |
|-------|-------------------|-------------|
| Sale Price | `Sale{N}_Price` | `comp{N}-sale-price` |
| Units | `Sale{N}_Units` | `comp{N}-units` |
| Price/Unit | `Sale{N}_PricePerUnit` | `comp{N}-price-per-unit` |
| Adjusted $/Unit | Calculated from adjustments | `comp{N}-adj-price-per-unit` |

**Integration Method:**
```typescript
// Import from Valcre workbook
const valcreData = await parseValcreWorkbook(xlsmFile);
const comp1PricePerUnit = valcreData.namedRanges['Sale1_PricePerUnit'];
```

**Pros:**
- Complete data ecosystem
- Validated calculations
- Already in client workflow

**Use Case:** Existing Valcre subscribers, current client workflow

---

### Option 2: Standalone Data Sources (Future)

For standalone operation without Valcre, comparable sales data can come from:

#### Commercial Data Providers

| Provider | Data Available | API/Format | Cost |
|----------|---------------|------------|------|
| **CoStar** | Sales comps, cap rates, NOI | API | $$$$ |
| **CMHC** (Canada) | Multifamily market data | CSV/API | $ |
| **RealPage** | Rent comps, market trends | API | $$$ |
| **Yardi Matrix** | Sales, rent comps | API | $$$ |
| **Real Capital Analytics** | Investment sales | API | $$$$ |

#### Public/Free Sources

| Source | Data Available | Format |
|--------|---------------|--------|
| **County Assessor** | Sale price, property details | Web scrape, FOIA |
| **MLS (via IDX)** | Residential/small multi sales | API |
| **CMHC Rental Market Report** | Vacancy, avg rents by market | PDF/CSV |
| **Statistics Canada** | Market indicators | API |

#### Manual Entry

```typescript
// CSV import structure for manual comp entry
interface SalesCompImport {
  propertyName: string;
  address: string;
  city: string;
  saleDate: string;
  salePrice: number;
  units: number;
  gba: number;
  noi: number;
  // Calculated on import:
  pricePerUnit?: number;  // salePrice / units
  pricePerSF?: number;    // salePrice / gba
  capRate?: number;       // noi / salePrice
}
```

#### Hybrid Approach (Recommended for Standalone)

```
┌─────────────────────────────────────────────────────────┐
│                    DATA SOURCES                         │
├─────────────────┬─────────────────┬─────────────────────┤
│  CoStar API     │  CMHC Data      │  Manual CSV Import  │
│  (if available) │  (Canadian)     │  (always available) │
└────────┬────────┴────────┬────────┴──────────┬──────────┘
         │                 │                   │
         └────────────────┬┴───────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   Comp Data Store     │
              │   (Normalized)        │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   Adjustment Engine   │
              │   (Your Calc Logic)   │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   Registry Fields     │
              │   (comp1-5-*)         │
              └───────────────────────┘
```

---

## 📊 SUPPORTING TEXT FIELDS

The page also includes dynamic text that references calculated values:

```html
Based on general bracketing, the comparable sales support an adjusted unit value 
ranges from {{sca-adjusted-value-low}}/Unit to {{sca-adjusted-value-high}}/Unit, 
with a unit value of {{sca-concluded-value-per-unit}}/Unit concluded for the 
subject property.
```

### Fields Required

| Template Field | Registry ID | Calculation |
|----------------|-------------|-------------|
| `{{SCA_AdjustedValueLow}}` | `sca-adjusted-value-low` | min(comp{1-5}-adj-price-per-unit) |
| `{{SCA_AdjustedValueHigh}}` | `sca-adjusted-value-high` | max(comp{1-5}-adj-price-per-unit) |
| `{{SCA_ConcludedValuePerUnit}}` | `sca-concluded-value-per-unit` | User input / appraiser judgment |

**Note:** These may already exist in registry - verify before adding.

---

## 📁 FILE STRUCTURE

```
src/features/report-builder/
├── components/
│   └── charts/
│       ├── CapRateChart.tsx              # Page 47 chart
│       ├── SalesComparisonChart.tsx      # Page 60 chart (THIS)
│       ├── chartUtils.ts                 # Shared utilities (trend lines, etc.)
│       └── index.ts
├── utils/
│   ├── chartToSvg.ts                     # SVG extraction for PDF
│   └── trendLineCalculator.ts            # Linear regression utility
└── data/
    └── importers/
        ├── valcreImporter.ts             # Valcre workbook import
        ├── csvImporter.ts                # Manual CSV import
        └── index.ts
```

---

## 🔗 REGISTRY FIELD DEPENDENCIES

### Required Fields (All exist from Page 59/61)

| Field ID | Type | Source |
|----------|------|--------|
| `comp1-price-per-unit` | currency | calculated |
| `comp2-price-per-unit` | currency | calculated |
| `comp3-price-per-unit` | currency | calculated |
| `comp4-price-per-unit` | currency | calculated |
| `comp5-price-per-unit` | currency | calculated |
| `comp1-adj-price-per-unit` | currency | calculated |
| `comp2-adj-price-per-unit` | currency | calculated |
| `comp3-adj-price-per-unit` | currency | calculated |
| `comp4-adj-price-per-unit` | currency | calculated |
| `comp5-adj-price-per-unit` | currency | calculated |

### May Need to Add

| Field ID | Type | Source |
|----------|------|--------|
| `sca-adjusted-value-low` | currency | calculated (min) |
| `sca-adjusted-value-high` | currency | calculated (max) |

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: Basic Chart
- [ ] Create `SalesComparisonChart.tsx` component
- [ ] Implement grouped bar chart with Recharts
- [ ] Wire to store fields (comp1-5)
- [ ] Test in preview mode

### Phase 2: Trend Lines
- [ ] Create `trendLineCalculator.ts` utility
- [ ] Add linear regression calculation
- [ ] Overlay trend lines on chart
- [ ] Style as dashed lines per spec

### Phase 3: Value Labels & Polish
- [ ] Add value labels on top of bars
- [ ] Match Valcre visual style exactly
- [ ] Add legend at bottom
- [ ] Responsive container

### Phase 4: PDF Integration
- [ ] Integrate with `chartToSvg.ts` utility
- [ ] Add placeholder to Page 60 template
- [ ] Test PDF output

### Phase 5: Standalone Data Sources (Future)
- [ ] Create CSV import utility
- [ ] Document API integration options
- [ ] Build comp data entry form (if not using Valcre)

---

## 🧪 TEST CASES

1. **All 5 comps with adjustments** → Full chart, converging trend lines
2. **High variance in unadjusted** → Wide spread, shows adjustment value
3. **Low variance after adjustment** → Trend lines converge
4. **Missing comp data** → Handle gracefully (skip or zero)
5. **PDF export** → Chart renders as image
6. **Extreme values** → Y-axis scales appropriately

---

## 📚 REFERENCE

### Valcre Screenshot
See: `/mnt/user-data/uploads/pg_60_grap-sales_comp_analysis.png`

### Related Specs
- Page 47 Cap Rate Chart: `Page-47-Dynamic-Chart-Implementation-Spec.md`

### Registry Fields
- Page 59 Sales Comparison: 188 fields (comp1-5 complete)
- Page 61 DCA Conclusion: 47 fields (adjusted prices)

---

## 🚀 DEPLOYMENT PROMPT

When ready to implement, use this prompt:

```
Implement the dynamic Sales Comparison Analysis chart for Page 60 per the spec in:
[FILE_PATH_HERE]

Requirements:
1. Use Recharts library
2. Grouped bars: Transaction $/Unit (dark) and Adjusted $/Unit (lighter)
3. Dual dashed trend lines showing linear regression
4. Value labels on top of each bar
5. Pull data from comp1-5 registry fields
6. SVG extraction for PDF compatibility

Follow the implementation checklist in the spec.
Data sources: Primary = Valcre import, Future = standalone CSV/API options.
```

---

## 💡 BUSINESS VALUE NOTE

**Why This Chart Matters:**

The visual convergence of trend lines after adjustments demonstrates:
1. **Methodology validity** - Adjustments bring comps into tighter range
2. **Appraisal defensibility** - Shows systematic approach
3. **Client understanding** - Visual proof of analysis
4. **Report quality** - Professional presentation

Without this chart, the Sales Comparison narrative is harder to support visually.

---

**Last Updated:** December 18, 2025
**Status:** Ready for Implementation
**Depends On:** 
- Page 59 fields (comp data) ✅
- Page 61 fields (adjusted prices) ✅
- Page 47 chart infrastructure (shared utilities)
