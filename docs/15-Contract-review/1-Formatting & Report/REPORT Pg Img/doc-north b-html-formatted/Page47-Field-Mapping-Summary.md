# Page 47 Field Mapping Completion Summary

**Date:** December 16, 2024
**Page:** Page 47 - Capitalization Rate
**Status:** COMPLETE

---

## Field Count Summary

- **Previous field mappings:** 73
- **New field mappings added:** 14
- **Total field mappings:** 87

---

## New Field IDs Added

### Chart Y-Axis Labels (8 fields)

1. **{{Chart_YAxis_Max}}** - Maximum Y-axis value ($14,000)
2. **{{Chart_YAxis_Label_6}}** - Y-axis label 6 ($12,000)
3. **{{Chart_YAxis_Label_5}}** - Y-axis label 5 ($10,000)
4. **{{Chart_YAxis_Label_4}}** - Y-axis label 4 ($8,000)
5. **{{Chart_YAxis_Label_3}}** - Y-axis label 3 ($6,000)
6. **{{Chart_YAxis_Label_2}}** - Y-axis label 2 ($4,000)
7. **{{Chart_YAxis_Label_1}}** - Y-axis label 1 ($2,000)
8. **{{Chart_YAxis_Min}}** - Minimum Y-axis value ($0)

### Chart Bar Heights (5 fields)

9. **{{COMP_1_Chart_Bar_Height}}** - COMP 1 bar height in pixels (135px)
10. **{{COMP_2_Chart_Bar_Height}}** - COMP 2 bar height in pixels (103px)
11. **{{COMP_3_Chart_Bar_Height}}** - COMP 3 bar height in pixels (83px)
12. **{{COMP_4_Chart_Bar_Height}}** - COMP 4 bar height in pixels (170px)
13. **{{COMP_5_Chart_Bar_Height}}** - COMP 5 bar height in pixels (190px)

### Page Footer (1 field)

14. **{{Page_Number}}** - Page number in footer (47)

---

## Existing Field IDs (73 fields - already mapped)

### Comparable Sales Data (70 fields)

**COMP 1 Fields (14):**
- COMP_1_Name
- COMP_1_Address
- COMP_1_City
- COMP_1_Province
- COMP_1_NRA
- COMP_1_Units
- COMP_1_YearBuilt
- COMP_1_SaleDate
- COMP_1_SalePrice
- COMP_1_PriceSF
- COMP_1_NOI
- COMP_1_NOI_Unit
- COMP_1_CapRate

**COMP 2 Fields (13):**
- COMP_2_Name
- COMP_2_Address
- COMP_2_City
- COMP_2_Province
- COMP_2_NRA
- COMP_2_Units
- COMP_2_YearBuilt
- COMP_2_SaleDate
- COMP_2_SalePrice
- COMP_2_PriceSF
- COMP_2_NOI
- COMP_2_NOI_Unit
- COMP_2_CapRate

**COMP 3 Fields (13):**
- COMP_3_Name
- COMP_3_Address
- COMP_3_City
- COMP_3_Province
- COMP_3_NRA
- COMP_3_Units
- COMP_3_YearBuilt
- COMP_3_SaleDate
- COMP_3_SalePrice
- COMP_3_PriceSF
- COMP_3_NOI
- COMP_3_NOI_Unit
- COMP_3_CapRate

**COMP 4 Fields (13):**
- COMP_4_Name
- COMP_4_Address
- COMP_4_City
- COMP_4_Province
- COMP_4_NRA
- COMP_4_Units
- COMP_4_YearBuilt
- COMP_4_SaleDate
- COMP_4_SalePrice
- COMP_4_PriceSF
- COMP_4_NOI
- COMP_4_NOI_Unit
- COMP_4_CapRate

**COMP 5 Fields (13):**
- COMP_5_Name
- COMP_5_Address
- COMP_5_City
- COMP_5_Province
- COMP_5_NRA
- COMP_5_Units
- COMP_5_YearBuilt
- COMP_5_SaleDate
- COMP_5_SalePrice
- COMP_5_PriceSF
- COMP_5_NOI
- COMP_5_NOI_Unit
- COMP_5_CapRate

### Cap Rate Summary Fields (3)
- **CapRate_Average** - Average cap rate across comps (6.03%)
- **CapRate_High** - Highest cap rate (6.24%)
- **CapRate_Low** - Lowest cap rate (5.92%)

### Footer Fields (2)
- **Property_Address** - Property address in footer
- **File_Number** - File number in footer

---

## Page Structure

### Sections on Page 47:

1. **Header**
   - Title: "Valuation & Conclusions"
   - Subtitle: "Capitalization Rate"

2. **Comparable Sales Table**
   - 5 comparable properties
   - 13 data points per property
   - Summary statistics (Average, High, Low)

3. **NOI & Capitalization Rate Chart**
   - Bar chart showing NOI/Unit for each comparable
   - Y-axis scale from $0 to $14,000
   - 5 bars (COMP 1-5) with heights proportional to NOI/Unit values

4. **Text Summary**
   - Narrative describing cap rate range and average

5. **Page Footer**
   - Page number: 47
   - Property address
   - File number

---

## Technical Implementation Notes

### Field Mapping Format

**Standard mapping:**
```html
<span class="field-mapped" title="{{Field_ID}}">Display Value</span>
```

**Escaped mapping (for style attributes):**
```html
<div style="height: <span class=\"field-mapped\" title=\"{{Field_ID}}\">Value</span>px;"></div>
```

### Chart Implementation

The chart uses calculated heights based on NOI/Unit values:
- COMP 1: $7,780.02/unit → 135px height
- COMP 2: $6,111.00/unit → 103px height
- COMP 3: $5,129.00/unit → 83px height
- COMP 4: $12,389.00/unit → 170px height
- COMP 5: $12,891.00/unit → 190px height

Height calculation formula (approximate):
```
bar_height_px = (NOI_per_unit / max_NOI_per_unit) * max_chart_height
```

---

## Verification

### Field Count Verification
```bash
# Count field-mapped occurrences in Page 47
sed -n '3836,4037p' PREVIEW-Master.html | grep -o 'field-mapped' | wc -l
# Result: 87
```

### File Location
`/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-html/doc-pages-html-formatted/PREVIEW-Master.html`

### Line Range
- **Page 47 Start:** Line 3839
- **Page 47 End:** Line 4037
- **Total Lines:** 199

---

## Remaining Unmapped Values

### Static Content (Not Requiring Field IDs)

The following are static labels/constants and do not need field mapping:

- Table headers ("Data Point", "COMP 1-5", etc.)
- Row labels ("Name", "Address", "City", etc.)
- Chart labels ("COMP 1-5")
- Chart legend ("NOI/Unit")
- Section headers
- Static text content

These are template constants that remain the same across all reports.

---

## Next Steps

1. **Field Registry Update:** Add the 14 new field IDs to the central field registry
2. **Data Binding:** Map these fields to data sources (Valcre API, spreadsheet imports, etc.)
3. **Validation:** Test with sample data to ensure all fields populate correctly
4. **Documentation:** Update field mapping documentation with chart-specific fields

---

## Field ID Naming Convention

All new field IDs follow the `PascalCase_Underscore` format:
- Chart fields: `Chart_YAxis_[descriptor]`
- Bar heights: `COMP_[n]_Chart_Bar_Height`
- Page elements: `Page_Number`

This convention ensures consistency with existing field IDs and makes the purpose of each field clear.
