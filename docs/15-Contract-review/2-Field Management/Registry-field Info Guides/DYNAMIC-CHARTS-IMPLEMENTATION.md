# Dynamic Charts Implementation Guide

## Overview

The APR Dashboard generates certain charts dynamically from extracted data rather than placing static images. This ensures charts always reflect current data and eliminates the need for manual image updates.

## Charts to Implement

### 1. SA1_SPAdjUnadj - Sales Comparison Price Analysis

**Chart Type:** Grouped Bar Chart  
**Location in Report:** Sales Comparison Approach section (page ~59)  
**Title:** "UNADJUSTED & ADJUSTED PRICE"

**Data Fields Required:**
```
comp1-priceperunit      → $129,891
comp2-priceperunit      → $102,019
comp3-priceperunit      → $85,627
comp4-priceperunit      → $198,085
comp5-priceperunit      → $214,375

comp1-adjpriceperunit   → $116,635
comp2-adjpriceperunit   → $116,627
comp3-adjpriceperunit   → $116,629
comp4-adjpriceperunit   → $111,914
comp5-adjpriceperunit   → $118,100
```

**Visual Structure:**
- X-axis: COMP 1, COMP 2, COMP 3, COMP 4, COMP 5
- Y-axis: Dollar values ($0 - $250,000)
- Bar groups: Transaction $/Unit (dark), Adjusted (medium), Unadjusted (light dashed line)
- Show value labels above each bar

**Summary Statistics (for table below chart):**
```
dca-adjprice-high       → HIGH row
dca-adjprice-low        → LOW row  
dca-adjprice-avg        → AVG row
```

---

### 2. IA_OARNOI - NOI & Capitalization Rate

**Chart Type:** Combo Chart (Bars + Line/Points)  
**Location in Report:** Capitalization Rate section (page ~46)  
**Title:** "NOI & CAPITALIZATION RATE"

**Data Fields Required:**
```
comp1-noiperunit        → $7,780
comp2-noiperunit        → $6,111
comp3-noiperunit        → $5,129
comp4-noiperunit        → $12,365
comp5-noiperunit        → $12,681

comp1-caprate           → 5.99%
comp2-caprate           → 5.99%
comp3-caprate           → 5.99%
comp4-caprate           → 6.24%
comp5-caprate           → 5.92%
```

**Visual Structure:**
- X-axis: COMP 1, COMP 2, COMP 3, COMP 4, COMP 5
- Left Y-axis: NOI/Unit ($0 - $14,000)
- Right Y-axis: OAR percentage (5.9% - 6.3%)
- Bars: NOI/Unit (dark blue)
- Points/Line: OAR (dots with percentage)

**Summary Text:**
> "The comparable capitalization rates indicate a range from {oar-low} to {oar-high} with an average of {oar-avg}."

---

### 3. Investment Indicators Chart (Optional)

**Chart Type:** Multi-line Time Series  
**Source Image:** image66.png (for reference styling)  
**Title:** "MULTIFAMILY INVESTMENT INDICATORS"

This chart shows market trends over time (2015-2030) for various Canadian cities. May require external data source or could be a static reference image if data isn't available per-property.

---

## Data Source Reference

All chart data comes from **TEST-DATA-COMPLETE-V2.json**

Key prefixes:
- `comp1-` through `comp5-` → Sales comparison data
- `oarcomp1-` through `oarcomp5-` → OAR/Cap rate analysis
- `dca-` → Direct comparison approach summary stats

---

## Implementation Notes

### Chart Library Suggestions
- **Recharts** (React) - Clean, declarative API
- **Chart.js** - Lightweight, flexible
- **D3.js** - Full control, complex visualizations

### Color Scheme (from Valcre template)
- Primary bars: `#1a365d` (dark navy)
- Secondary bars: `#4a7ab0` (medium blue)  
- Accent/lines: `#718096` (gray)
- Negative values: Red text in parentheses

### Responsive Considerations
- Charts should scale for PDF export (fixed dimensions)
- Print-friendly: Ensure adequate contrast
- Match Valcre styling for professional appearance

---

## Static Images NOT Needed

These extracted images are static exports from Word - **do not use** since charts are data-driven:

| Image File | Chart Name | Status |
|------------|------------|--------|
| image51.emf | Chart EMF 1 | ❌ Skip - generate dynamically |
| image52.emf | Chart EMF 2 | ❌ Skip - generate dynamically |
| image53.emf | Chart EMF 3 | ❌ Skip - generate dynamically |
| image68.png | NOI & Cap Rate | ❌ Skip - generate dynamically |
| image66.png | Investment Indicators | ⚠️ May keep as reference/static |

---

## Files Reference

| File | Purpose |
|------|---------|
| TEST-DATA-COMPLETE-V2.json | Source data (1,053 fields) |
| IMAGE-MANIFEST.json | Static image mappings |
| DYNAMIC-CHARTS-IMPLEMENTATION.md | This file |

---

*Last Updated: 2025-12-23*
