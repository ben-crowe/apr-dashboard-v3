# Table Component: Blue Header Pattern

**Component Name:** Economic Table (Blue Header Bar)
**CSS Class:** `.economic-table`
**First Used:** Page 31 (Saskatchewan Economic Indicators)
**Created:** December 16, 2025

---

## Visual Design

**Blue Header Bar:**
- Background: `rgb(0, 59, 126)` (APR blue)
- Text: White, centered, bold
- Font: 10pt
- Padding: 8px 12px

**Column Headers:**
- Background: `rgb(0, 59, 126)` (same blue)
- Text: White, left-aligned, bold
- Font: 8pt (smaller than title)
- Padding: 4px 8px

**Data Cells:**
- Background: White
- Border: 1px solid #ddd
- Text: Left-aligned, 8pt
- Padding: 3px 8px
- First column: Bold text

---

## HTML Structure

```html
<table class="economic-table">
    <!-- TITLE ROW - Blue bar spanning full width -->
    <tr class="table-title-row">
        <th colspan="4" class="table-title">Saskatchewan Economic Indicators</th>
    </tr>

    <!-- COLUMN HEADERS - Blue row with column names -->
    <tr>
        <th>Indicator</th>
        <th>Estimate</th>
        <th>Commentary</th>
        <th>Source</th>
    </tr>

    <!-- DATA ROWS - White cells with field mapping -->
    <tr>
        <td><span class="field-mapped" title="{{SK_Econ_Indicator_1_Name}}">{{SK_Econ_Indicator_1_Name}}</span></td>
        <td><span class="field-mapped" title="{{SK_Econ_Indicator_1_Estimate}}">{{SK_Econ_Indicator_1_Estimate}}</span></td>
        <td><span class="field-mapped" title="{{SK_Econ_Indicator_1_Commentary}}">{{SK_Econ_Indicator_1_Commentary}}</span></td>
        <td><span class="field-mapped" title="{{SK_Econ_Indicator_1_Source}}">{{SK_Econ_Indicator_1_Source}}</span></td>
    </tr>
    <!-- Repeat for rows 2-14 -->
</table>
```

---

## CSS Definition

**Location:** `css-components-library.css`

```css
.economic-table {
    font-size: 8pt;
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.economic-table th.table-title {
    background-color: rgb(0, 59, 126);
    color: white;
    padding: 8px 12px;
    text-align: center;
    font-weight: bold;
    font-size: 10pt;
}

.economic-table th {
    background-color: rgb(0, 59, 126);
    color: white;
    padding: 4px 8px;
    text-align: left;
    font-weight: bold;
}

.economic-table td {
    padding: 3px 8px;
    border: 1px solid #ddd;
    vertical-align: top;
    text-align: left;
}

.economic-table td:first-child {
    font-weight: bold;
    text-align: left;
}
```

---

## Where Used

**Current Pages:**
- Page 31: Saskatchewan Economic Indicators (14 rows)

**Projected Pages:**
- Page 32: Alberta Economic Indicators (14 rows)
- Page 33: British Columbia Economic Indicators (14 rows)
- Page 34: National Economic Indicators (14 rows)

**Potential Future Use:**
- Any table with blue header bar + column headers + data rows pattern
- Market analysis tables
- Financial indicator tables
- Statistical summary tables

---

## Field Mapping Pattern

**Each data cell wraps content in field-mapped span:**

```html
<span class="field-mapped" title="{{Field_ID}}">{{Field_ID}}</span>
```

**Benefits:**
- Preview Mode toggle can replace field IDs with sample data
- Yellow highlight shows field mapping locations
- Tooltip shows field ID on hover
- Consistent pattern across all tables

---

## Variations

### Different Column Count

**3 Columns:**
```html
<th colspan="3" class="table-title">Table Title</th>
```

**5 Columns:**
```html
<th colspan="5" class="table-title">Table Title</th>
```

### Different Title Text

Simply change the text in the title cell:
```html
<th colspan="4" class="table-title">Alberta Economic Indicators</th>
<th colspan="4" class="table-title">Market Rent Survey</th>
<th colspan="4" class="table-title">Sales Comparable Analysis</th>
```

### Left-Aligned Title

Add custom class or inline style:
```html
<th colspan="4" class="table-title" style="text-align: left;">Section Title</th>
```

---

## Integration with Preview Mode

**JavaScript Toggle Logic:**

```javascript
// When preview mode is enabled
document.querySelectorAll('.field-mapped').forEach(span => {
    const fieldId = span.getAttribute('title').replace(/[{}]/g, '');
    if (sampleData[fieldId]) {
        span.textContent = sampleData[fieldId];
    }
});

// When preview mode is disabled
document.querySelectorAll('.field-mapped').forEach(span => {
    const fieldId = span.getAttribute('title');
    span.textContent = fieldId;
});
```

**Sample Data Example:**

```javascript
const sampleData = {
    'SK_Econ_Indicator_1_Name': 'Real GDP (2025)',
    'SK_Econ_Indicator_1_Estimate': '+1.8%',
    'SK_Econ_Indicator_1_Commentary': 'Growth driven by resource exports',
    'SK_Econ_Indicator_1_Source': 'Bank of Canada'
};
```

---

## When to Use This Component

✅ **Use this component when:**
- Table has blue header bar spanning multiple columns
- Table has column headers in blue
- Table has data rows with white background
- Table needs consistent APR blue styling
- Table has 3+ columns
- Table contains field-mapped data

❌ **Don't use this component when:**
- Simple 2-column key-value pairs (use `.key-value-table` instead)
- No header bar needed
- Different color scheme required
- Table is embedded as image (Valcre screenshot)

---

## Alternative Approaches

### Image Upload (Current Valcre Workflow)

For tables generated in Valcre that can't be field-mapped:

```html
<div class="economic-table-container">
    <img src="{{SK_Econ_Table_Image_URL}}" alt="Saskatchewan Economic Indicators" class="table-image" />
</div>
```

### Hybrid Approach

Image with optional field override:

```html
<div class="economic-table-container">
    <img src="{{SK_Econ_Table_Image_URL}}" alt="Saskatchewan Economic Indicators" class="table-image" />
    <!-- Hidden table for data extraction if needed -->
    <table class="economic-table" style="display: none;">
        <!-- Field-mapped structure for data access -->
    </table>
</div>
```

---

## Testing Checklist

When applying this component to a new page:

- [ ] Blue title bar displays correctly
- [ ] Title text is centered and legible
- [ ] Column headers are blue with white text
- [ ] Column headers are left-aligned
- [ ] Data cells have gray borders
- [ ] First column text is bold
- [ ] All cells have proper padding
- [ ] Table width is 100% of container
- [ ] Field IDs display in yellow highlight
- [ ] Preview mode toggle works
- [ ] Sample data populates correctly
- [ ] Table matches SVG source design

---

## Related Documentation

- **Component Library:** [COMPONENT-LIBRARY.md](../../1-Formatting & Report/REPORT Pg Img/doc-page-html/COMPONENT-LIBRARY.md)
- **CSS File:** [css-components-library.css](../../1-Formatting & Report/REPORT Pg Img/doc-page-html/css-components-library.css)
- **Field Index:** [FIELD-ASSETS-INDEX.md](./FIELD-ASSETS-INDEX.md)
- **Economic Indicator Fields:** [NEW-FIELDS-Economic-Indicators.md](./NEW-FIELDS-Economic-Indicators.md)

---

**Status:** Production-ready
**Reusable:** Yes - Apply to any blue header table
**Maintenance:** Update css-components-library.css for global changes
