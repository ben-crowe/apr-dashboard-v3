# Page 47 - Dynamic Cap Rate Chart Implementation Spec

**Status:** 📋 READY FOR IMPLEMENTATION
**Priority:** Medium (after core tables complete)
**Estimated Effort:** 2-3 hours
**Date Created:** December 18, 2025

---

## 🎯 OBJECTIVE

Replace the static chart image on Page 47 with a dynamically generated chart that:
1. Pulls data from registry fields (comp1-5 NOI/Unit and Cap Rate)
2. Updates automatically when comp data changes
3. Renders correctly in both preview and PDF output
4. Matches the visual style of the reference Valcre report

---

## 📊 CHART SPECIFICATIONS

### Chart Type
**Dual-Axis Combo Chart** (Bar + Line)

### Data Sources

| Element | Registry Field Pattern | Type |
|---------|----------------------|------|
| Bar Height (NOI/Unit) | `comp{1-5}-noi-per-unit` | currency |
| Line Points (OAR) | `comp{1-5}-cap-rate` | percentage |
| X-Axis Labels | "COMP 1" through "COMP 5" | static |

### Visual Specifications

```yaml
chart:
  width: 600px
  height: 300px
  background: white
  
bars:
  color: "#1e3a5f"  # Navy blue (match Valcre)
  width: 60px
  spacing: 40px
  
line:
  color: "#000000"  # Black
  strokeWidth: 2
  dots: true
  dotSize: 6
  
axes:
  left:
    label: "NOI/Unit"
    format: "$0,000"
    range: [0, 14000]  # Dynamic based on max value
  right:
    label: "OAR"
    format: "0.0%"
    range: [5.9%, 6.3%]  # Dynamic based on range
  bottom:
    labels: ["COMP 1", "COMP 2", "COMP 3", "COMP 4", "COMP 5"]

legend:
  position: "top-right"
  items:
    - { label: "NOI/Unit", symbol: "square", color: "#1e3a5f" }
    - { label: "OAR", symbol: "circle", color: "#000000" }
```

---

## 🏗️ TECHNICAL APPROACH

### Option A: Recharts (Recommended)

**Why Recharts:**
- Already React-based (matches your stack)
- Built-in dual-axis support
- SVG output (PDF-compatible)
- Good TypeScript support

**Installation:**
```bash
npm install recharts
```

**Implementation:**

```tsx
// src/features/report-builder/components/charts/CapRateChart.tsx

import React from 'react';
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
} from 'recharts';
import { useReportBuilderStore } from '../../store/reportBuilderStore';

interface ChartDataPoint {
  name: string;
  noiPerUnit: number;
  capRate: number;
}

export const CapRateChart: React.FC = () => {
  // Pull data from store
  const store = useReportBuilderStore();
  
  const chartData: ChartDataPoint[] = [
    {
      name: 'COMP 1',
      noiPerUnit: store.fields['comp1-noi-per-unit'] || 0,
      capRate: (store.fields['comp1-cap-rate'] || 0) * 100, // Convert to percentage display
    },
    {
      name: 'COMP 2',
      noiPerUnit: store.fields['comp2-noi-per-unit'] || 0,
      capRate: (store.fields['comp2-cap-rate'] || 0) * 100,
    },
    {
      name: 'COMP 3',
      noiPerUnit: store.fields['comp3-noi-per-unit'] || 0,
      capRate: (store.fields['comp3-cap-rate'] || 0) * 100,
    },
    {
      name: 'COMP 4',
      noiPerUnit: store.fields['comp4-noi-per-unit'] || 0,
      capRate: (store.fields['comp4-cap-rate'] || 0) * 100,
    },
    {
      name: 'COMP 5',
      noiPerUnit: store.fields['comp5-noi-per-unit'] || 0,
      capRate: (store.fields['comp5-cap-rate'] || 0) * 100,
    },
  ];

  // Calculate dynamic axis ranges
  const maxNoi = Math.max(...chartData.map(d => d.noiPerUnit));
  const noiAxisMax = Math.ceil(maxNoi / 2000) * 2000 + 2000; // Round up to nearest 2000
  
  const capRates = chartData.map(d => d.capRate).filter(r => r > 0);
  const minCapRate = Math.min(...capRates) - 0.2;
  const maxCapRate = Math.max(...capRates) + 0.2;

  return (
    <div className="cap-rate-chart" style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 60, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          
          {/* X Axis */}
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
          />
          
          {/* Left Y Axis - NOI/Unit */}
          <YAxis
            yAxisId="left"
            orientation="left"
            domain={[0, noiAxisMax]}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            tick={{ fontSize: 11 }}
          />
          
          {/* Right Y Axis - Cap Rate */}
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[minCapRate, maxCapRate]}
            tickFormatter={(value) => `${value.toFixed(1)}%`}
            tick={{ fontSize: 11 }}
          />
          
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === 'noiPerUnit') return [`$${value.toLocaleString()}`, 'NOI/Unit'];
              if (name === 'capRate') return [`${value.toFixed(2)}%`, 'OAR'];
              return [value, name];
            }}
          />
          
          <Legend 
            verticalAlign="top" 
            align="right"
            formatter={(value) => {
              if (value === 'noiPerUnit') return 'NOI/Unit';
              if (value === 'capRate') return 'OAR';
              return value;
            }}
          />
          
          {/* Bars - NOI/Unit */}
          <Bar
            yAxisId="left"
            dataKey="noiPerUnit"
            fill="#1e3a5f"
            barSize={50}
            radius={[2, 2, 0, 0]}
          />
          
          {/* Line - Cap Rate */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="capRate"
            stroke="#000000"
            strokeWidth={2}
            dot={{ fill: '#000000', r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CapRateChart;
```

---

## 📄 PDF RENDERING STRATEGY

### Challenge
Recharts renders to SVG in the DOM, but PDF generation needs a static image or inline SVG.

### Solution: SVG Extraction

```tsx
// src/features/report-builder/utils/chartToSvg.ts

/**
 * Extract SVG string from rendered Recharts component for PDF embedding
 */
export const extractChartSvg = (chartContainerId: string): string | null => {
  const container = document.getElementById(chartContainerId);
  if (!container) return null;
  
  const svg = container.querySelector('svg');
  if (!svg) return null;
  
  // Clone and clean up SVG for PDF
  const clonedSvg = svg.cloneNode(true) as SVGElement;
  
  // Set explicit dimensions
  clonedSvg.setAttribute('width', '600');
  clonedSvg.setAttribute('height', '300');
  
  // Return serialized SVG
  return new XMLSerializer().serializeToString(clonedSvg);
};

/**
 * Convert SVG to base64 data URL for embedding
 */
export const svgToDataUrl = (svgString: string): string => {
  const encoded = encodeURIComponent(svgString);
  return `data:image/svg+xml,${encoded}`;
};
```

### Integration with Report HTML Generation

```tsx
// In generateReportHtml.ts or similar

import { extractChartSvg, svgToDataUrl } from './chartToSvg';

// When generating Page 47 HTML:
const chartSvg = extractChartSvg('cap-rate-chart-container');
const chartDataUrl = chartSvg ? svgToDataUrl(chartSvg) : '';

// Replace placeholder in template
const page47Html = templateHtml.replace(
  '{{CAP_RATE_CHART}}',
  chartSvg 
    ? `<img src="${chartDataUrl}" alt="NOI & Capitalization Rate Chart" style="width: 600px; height: 300px;" />`
    : '<!-- Chart unavailable -->'
);
```

---

## 📁 FILE STRUCTURE

```
src/features/report-builder/
├── components/
│   └── charts/
│       ├── CapRateChart.tsx          # Main chart component
│       ├── CapRateChart.styles.ts    # Styled components (optional)
│       └── index.ts                  # Export
├── utils/
│   └── chartToSvg.ts                 # SVG extraction utilities
└── templates/
    └── page47-cap-rate.html          # Template with {{CAP_RATE_CHART}} placeholder
```

---

## 🔗 REGISTRY FIELD DEPENDENCIES

Chart requires these fields to be populated:

| Field ID | Type | Source |
|----------|------|--------|
| `comp1-noi-per-unit` | currency | calculated |
| `comp2-noi-per-unit` | currency | calculated |
| `comp3-noi-per-unit` | currency | calculated |
| `comp4-noi-per-unit` | currency | calculated |
| `comp5-noi-per-unit` | currency | calculated |
| `comp1-cap-rate` | percentage | user-input |
| `comp2-cap-rate` | percentage | user-input |
| `comp3-cap-rate` | percentage | user-input |
| `comp4-cap-rate` | percentage | user-input |
| `comp5-cap-rate` | percentage | user-input |

**All fields already exist in registry.** ✅

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: Basic Chart
- [ ] Install Recharts: `npm install recharts`
- [ ] Create `CapRateChart.tsx` component
- [ ] Wire to store fields
- [ ] Test in preview mode

### Phase 2: Styling
- [ ] Match Valcre visual style (navy bars, black line)
- [ ] Add proper axis formatting
- [ ] Add legend
- [ ] Responsive container

### Phase 3: PDF Integration
- [ ] Create `chartToSvg.ts` utility
- [ ] Add chart placeholder to Page 47 template
- [ ] Integrate SVG extraction into PDF generation
- [ ] Test PDF output

### Phase 4: Polish
- [ ] Handle edge cases (missing data, zero values)
- [ ] Add loading state
- [ ] Accessibility (alt text, ARIA)
- [ ] Unit tests

---

## 🧪 TEST CASES

1. **All 5 comps populated** → Full chart renders
2. **Only 3 comps populated** → Chart shows 3 bars/points
3. **Zero values** → Bars at zero, line points at zero
4. **Extreme values** → Axes scale appropriately
5. **PDF export** → Chart appears as image in PDF
6. **Preview toggle** → Chart updates when data changes

---

## 📚 REFERENCE

### Valcre Screenshot
See: `/mnt/user-data/uploads/pg-47-graph.png`

### Recharts Documentation
- Dual axis: https://recharts.org/en-US/examples/LineBarAreaComposedChart
- ComposedChart: https://recharts.org/en-US/api/ComposedChart

### Related Files
- Store: `src/features/report-builder/store/reportBuilderStore.ts`
- Registry: `src/features/report-builder/schema/fieldRegistry.ts`
- Page 47 template: `PREVIEW-Master.html` (lines ~3700-3800)

---

## 🚀 DEPLOYMENT PROMPT

When ready to implement, use this prompt:

```
Implement the dynamic Cap Rate chart for Page 47 per the spec in:
[FILE_PATH_HERE]

Requirements:
1. Use Recharts library
2. Pull data from comp1-5 registry fields (noi-per-unit, cap-rate)
3. Dual axis: Left = NOI/Unit ($), Right = Cap Rate (%)
4. Navy blue bars, black line with dots
5. SVG extraction for PDF compatibility
6. Match Valcre visual style

Follow the implementation checklist in the spec.
```

---

**Last Updated:** December 18, 2025
**Status:** Ready for Implementation
**Depends On:** Core table wiring (Pages 49, 59, 61, 63 complete)
