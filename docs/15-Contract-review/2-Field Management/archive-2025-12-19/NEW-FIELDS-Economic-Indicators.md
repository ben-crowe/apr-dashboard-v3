# New Field IDs: Economic Indicators Tables

**Created:** December 16, 2025
**Status:** ⚠️ PLACEHOLDER FIELDS - Not yet validated against actual data source
**Source:** HTML page formatting for Market Context section (agent-generated naming convention)

**⚠️ IMPORTANT:** These field names were created by an agent during Page 31 formatting and may not match actual Valcre field names or data structure. They serve as placeholders for the HTML template structure.

---

## Overview

New field IDs created for provincial and national economic indicator tables in the Market Context section (Pages 31-34).

**Total New Fields:** 224 fields (4 regions × 14 indicators × 4 columns)

**Field Pattern:** `{Region}_Econ_Indicator_{Row#}_{Column}`

### Current Workflow (Valcre-Based)

**How it works now:**
1. Appraiser team uses Valcre system to generate economic indicator tables
2. Tables are screenshot from Valcre
3. Screenshots pasted into Word merge document
4. Static image embedded in final report

**APR Dashboard Goal:**
- Replace Valcre screenshots with dynamic HTML tables
- IF we can map data sources → populate fields automatically
- IF we cannot map data → provide image upload block for Valcre screenshot drop zone

**Fallback Option (Recommended for MVP):**
If field-level data mapping is not feasible, the page can accept a full table image upload (similar to current Valcre workflow) that gets inserted into the HTML at render time.

### Implementation Recommendation

**Option 1: Image Upload Block (Recommended for MVP)**
```html
<div class="economic-table-container">
    <div class="table-image-placeholder" data-upload-zone="saskatchewan-economic-indicators">
        <img src="{{SK_Econ_Table_Image_URL}}" alt="Saskatchewan Economic Indicators" />
        <!-- OR: Upload area for Valcre screenshot -->
    </div>
</div>
```

**Option 2: Field-Level Data Entry (Future Enhancement)**
Use the 56 SK_Econ_Indicator fields defined below (requires data mapping from Valcre or manual entry)

**Option 3: Hybrid Approach**
- Allow image upload as primary method
- Optionally provide field-level override for specific cells if needed

---

## Field Structure

### Saskatchewan Economic Indicators (Page 31)

**Field Prefix:** `SK_Econ_Indicator_`

**Columns:**
- `_Name` - Indicator name (e.g., "Real GDP (2025)")
- `_Estimate` - Numeric estimate (e.g., "+1.8%")
- `_Commentary` - Brief analysis text
- `_Source` - Data source citation (e.g., "Bank of Canada")

**Complete Field List (56 fields):**

```
SK_Econ_Indicator_1_Name
SK_Econ_Indicator_1_Estimate
SK_Econ_Indicator_1_Commentary
SK_Econ_Indicator_1_Source

SK_Econ_Indicator_2_Name
SK_Econ_Indicator_2_Estimate
SK_Econ_Indicator_2_Commentary
SK_Econ_Indicator_2_Source

SK_Econ_Indicator_3_Name
SK_Econ_Indicator_3_Estimate
SK_Econ_Indicator_3_Commentary
SK_Econ_Indicator_3_Source

SK_Econ_Indicator_4_Name
SK_Econ_Indicator_4_Estimate
SK_Econ_Indicator_4_Commentary
SK_Econ_Indicator_4_Source

SK_Econ_Indicator_5_Name
SK_Econ_Indicator_5_Estimate
SK_Econ_Indicator_5_Commentary
SK_Econ_Indicator_5_Source

SK_Econ_Indicator_6_Name
SK_Econ_Indicator_6_Estimate
SK_Econ_Indicator_6_Commentary
SK_Econ_Indicator_6_Source

SK_Econ_Indicator_7_Name
SK_Econ_Indicator_7_Estimate
SK_Econ_Indicator_7_Commentary
SK_Econ_Indicator_7_Source

SK_Econ_Indicator_8_Name
SK_Econ_Indicator_8_Estimate
SK_Econ_Indicator_8_Commentary
SK_Econ_Indicator_8_Source

SK_Econ_Indicator_9_Name
SK_Econ_Indicator_9_Estimate
SK_Econ_Indicator_9_Commentary
SK_Econ_Indicator_9_Source

SK_Econ_Indicator_10_Name
SK_Econ_Indicator_10_Estimate
SK_Econ_Indicator_10_Commentary
SK_Econ_Indicator_10_Source

SK_Econ_Indicator_11_Name
SK_Econ_Indicator_11_Estimate
SK_Econ_Indicator_11_Commentary
SK_Econ_Indicator_11_Source

SK_Econ_Indicator_12_Name
SK_Econ_Indicator_12_Estimate
SK_Econ_Indicator_12_Commentary
SK_Econ_Indicator_12_Source

SK_Econ_Indicator_13_Name
SK_Econ_Indicator_13_Estimate
SK_Econ_Indicator_13_Commentary
SK_Econ_Indicator_13_Source

SK_Econ_Indicator_14_Name
SK_Econ_Indicator_14_Estimate
SK_Econ_Indicator_14_Commentary
SK_Econ_Indicator_14_Source
```

---

### Alberta Economic Indicators (Page 32 - Projected)

**Field Prefix:** `AB_Econ_Indicator_`

**Same structure as Saskatchewan (56 fields):**
```
AB_Econ_Indicator_{1-14}_{Name|Estimate|Commentary|Source}
```

---

### British Columbia Economic Indicators (Page 33 - Projected)

**Field Prefix:** `BC_Econ_Indicator_`

**Same structure as Saskatchewan (56 fields):**
```
BC_Econ_Indicator_{1-14}_{Name|Estimate|Commentary|Source}
```

---

### National Economic Indicators (Page 34 - Projected)

**Field Prefix:** `National_Econ_Indicator_`

**Same structure as Saskatchewan (56 fields):**
```
National_Econ_Indicator_{1-14}_{Name|Estimate|Commentary|Source}
```

---

## Sample Data (Page 31 - Saskatchewan)

From PREVIEW-Master.html JavaScript sample data object:

```javascript
const sampleData = {
    // Saskatchewan Economic Indicators (Page 31)
    'SK_Econ_Indicator_1_Name': 'Real GDP (2025)',
    'SK_Econ_Indicator_1_Estimate': '+1.8%',
    'SK_Econ_Indicator_1_Commentary': 'Growth driven by resource exports, housing starts',
    'SK_Econ_Indicator_1_Source': 'Bank of Canada',

    'SK_Econ_Indicator_2_Name': 'CPI Inflation (2025)',
    'SK_Econ_Indicator_2_Estimate': '+1.9%',
    'SK_Econ_Indicator_2_Commentary': 'Below national average, stable food prices',
    'SK_Econ_Indicator_2_Source': 'Statistics Canada',

    'SK_Econ_Indicator_3_Name': 'Unemployment Rate (Q1 2025)',
    'SK_Econ_Indicator_3_Estimate': '5.2%',
    'SK_Econ_Indicator_3_Commentary': 'Tight labor market, mining sector hiring',
    'SK_Econ_Indicator_3_Source': 'Statistics Canada',

    'SK_Econ_Indicator_4_Name': 'Housing Starts (2025 est.)',
    'SK_Econ_Indicator_4_Estimate': '4,200 units',
    'SK_Econ_Indicator_4_Commentary': 'Strong multi-family construction in Regina/Saskatoon',
    'SK_Econ_Indicator_4_Source': 'CMHC',

    'SK_Econ_Indicator_5_Name': 'Average Home Price (2025)',
    'SK_Econ_Indicator_5_Estimate': '$321,000',
    'SK_Econ_Indicator_5_Commentary': '+3.5% YoY, stable market conditions',
    'SK_Econ_Indicator_5_Source': 'CREA',

    'SK_Econ_Indicator_6_Name': 'Rental Vacancy Rate (2024)',
    'SK_Econ_Indicator_6_Estimate': '4.8%',
    'SK_Econ_Indicator_6_Commentary': 'Balanced market, slight increase from 2023',
    'SK_Econ_Indicator_6_Source': 'CMHC',

    'SK_Econ_Indicator_7_Name': 'Potash Production (2025 est.)',
    'SK_Econ_Indicator_7_Estimate': '13.2M tonnes',
    'SK_Econ_Indicator_7_Commentary': 'Strong global demand, capacity expansion',
    'SK_Econ_Indicator_7_Source': 'Mining Association',

    'SK_Econ_Indicator_8_Name': 'Oil Production (2025)',
    'SK_Econ_Indicator_8_Estimate': '485K bbl/day',
    'SK_Econ_Indicator_8_Commentary': 'Steady output, new wells in development',
    'SK_Econ_Indicator_8_Source': 'Energy Ministry',

    'SK_Econ_Indicator_9_Name': 'Agricultural Exports (2025)',
    'SK_Econ_Indicator_9_Estimate': '$15.8B',
    'SK_Econ_Indicator_9_Commentary': 'Strong wheat and canola demand',
    'SK_Econ_Indicator_9_Source': 'Agriculture Canada',

    'SK_Econ_Indicator_10_Name': 'Population (2025 est.)',
    'SK_Econ_Indicator_10_Estimate': '1,228,000',
    'SK_Econ_Indicator_10_Commentary': '+1.2% growth, immigration driving increase',
    'SK_Econ_Indicator_10_Source': 'Statistics Canada',

    'SK_Econ_Indicator_11_Name': 'Retail Sales (2024)',
    'SK_Econ_Indicator_11_Estimate': '$17.9B',
    'SK_Econ_Indicator_11_Commentary': '+4.1% YoY, strong consumer spending',
    'SK_Econ_Indicator_11_Source': 'Statistics Canada',

    'SK_Econ_Indicator_12_Name': 'Business Investment (2025)',
    'SK_Econ_Indicator_12_Estimate': '$9.2B',
    'SK_Econ_Indicator_12_Commentary': 'Resource sector capital projects',
    'SK_Econ_Indicator_12_Source': 'Investment Monitor',

    'SK_Econ_Indicator_13_Name': 'Provincial Debt (2025)',
    'SK_Econ_Indicator_13_Estimate': '$29.4B',
    'SK_Econ_Indicator_13_Commentary': 'Manageable debt-to-GDP ratio',
    'SK_Econ_Indicator_13_Source': 'Ministry of Finance',

    'SK_Econ_Indicator_14_Name': 'Credit Rating (2025)',
    'SK_Econ_Indicator_14_Estimate': 'AA',
    'SK_Econ_Indicator_14_Commentary': 'Stable outlook, strong fiscal management',
    'SK_Econ_Indicator_14_Source': 'S&P Global'
};
```

---

## HTML Table Structure

**Blue Header Bar Pattern (Reusable Component):**

```html
<table class="economic-table">
    <tr class="table-title-row">
        <th colspan="4" class="table-title">Saskatchewan Economic Indicators</th>
    </tr>
    <tr>
        <th>Indicator</th>
        <th>Estimate</th>
        <th>Commentary</th>
        <th>Source</th>
    </tr>
    <tr>
        <td><span class="field-mapped" title="{{SK_Econ_Indicator_1_Name}}">{{SK_Econ_Indicator_1_Name}}</span></td>
        <td><span class="field-mapped" title="{{SK_Econ_Indicator_1_Estimate}}">{{SK_Econ_Indicator_1_Estimate}}</span></td>
        <td><span class="field-mapped" title="{{SK_Econ_Indicator_1_Commentary}}">{{SK_Econ_Indicator_1_Commentary}}</span></td>
        <td><span class="field-mapped" title="{{SK_Econ_Indicator_1_Source}}">{{SK_Econ_Indicator_1_Source}}</span></td>
    </tr>
    <!-- Repeat for indicators 2-14 -->
</table>
```

**CSS Class:** `.economic-table` (defined in css-components-library.css)

---

## Integration Tasks

### 1. Add to Field Registry (fieldRegistry.ts)

```typescript
// Market Context - Economic Indicators
export const economicIndicatorFields = {
  // Saskatchewan (Page 31)
  SK_Econ_Indicator_1_Name: { type: 'text', label: 'SK Indicator 1 - Name' },
  SK_Econ_Indicator_1_Estimate: { type: 'text', label: 'SK Indicator 1 - Estimate' },
  SK_Econ_Indicator_1_Commentary: { type: 'textarea', label: 'SK Indicator 1 - Commentary' },
  SK_Econ_Indicator_1_Source: { type: 'text', label: 'SK Indicator 1 - Source' },
  // ... repeat for 2-14

  // Alberta (Page 32)
  AB_Econ_Indicator_1_Name: { type: 'text', label: 'AB Indicator 1 - Name' },
  // ... repeat pattern

  // British Columbia (Page 33)
  BC_Econ_Indicator_1_Name: { type: 'text', label: 'BC Indicator 1 - Name' },
  // ... repeat pattern

  // National (Page 34)
  National_Econ_Indicator_1_Name: { type: 'text', label: 'National Indicator 1 - Name' },
  // ... repeat pattern
};
```

### 2. Add to MASTER-FIELD-DIRECTORY.md

Add new section:
```markdown
## Market Context - Economic Indicators (224 fields)

### Saskatchewan Economic Indicators (Page 31) - 56 fields
- SK_Econ_Indicator_{1-14}_{Name|Estimate|Commentary|Source}

### Alberta Economic Indicators (Page 32) - 56 fields
- AB_Econ_Indicator_{1-14}_{Name|Estimate|Commentary|Source}

### British Columbia Economic Indicators (Page 33) - 56 fields
- BC_Econ_Indicator_{1-14}_{Name|Estimate|Commentary|Source}

### National Economic Indicators (Page 34) - 56 fields
- National_Econ_Indicator_{1-14}_{Name|Estimate|Commentary|Source}
```

### 3. Add to DATA-FLOW-SUMMARY.md

Document data flow:
```
User Input → economicIndicatorFields store → Report HTML Tables (Pages 31-34)
```

---

## Notes

- **Field naming convention** follows pattern: `{Region}_Econ_Indicator_{Row#}_{Column}`
- **Case-sensitive** - Use exact casing (SK not sk, Econ not econ)
- **Rows 1-14** - Fixed number of indicators per region
- **Columns** - Always Name, Estimate, Commentary, Source (in that order)
- **Preview Mode** - Sample data provided for Saskatchewan (Page 31) for validation
- **Reusable Component** - `.economic-table` CSS class for consistent styling

---

## Related Files

- **Component Library:** `/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-html/COMPONENT-LIBRARY.md`
- **CSS Styles:** `/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-html/css-components-library.css`
- **HTML Preview:** `/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-html/doc-pages-html-formatted/PREVIEW-Master.html`
- **Agent Guide:** `/docs/15-Contract-review/1-Formatting & Report/-passover-sessions/AGENT-GUIDE-Page-Formatting.md`

---

**Status:** Ready for integration into field registry and master directory
**Next Steps:** Apply same pattern to pages 32-34 (AB, BC, National indicators)
