# Page 59 Template - Direct Comparison Approach Table

This is a complete, self-contained template for Page 59. You can copy and paste this directly into PREVIEW-Master.html to create a new page with the same structure.

---

## HTML Code (Copy everything below this line)

```html
<!-- ============================================ -->
<!-- PAGE 64 (Report Page 59): Direct Comparison Approach Table -->
<!-- ============================================ -->
<div class="page-sheet" data-page-num="Page 59">
    <style>
        /* Compact styling for Page 59 - 7 columns with vertical gridlines */
        .page-sheet[data-page-num="Page 59"] .compact-table {
            font-size: 7.5pt;
            margin-bottom: 0;
            border-collapse: collapse;
        }
        .page-sheet[data-page-num="Page 59"] .compact-table td,
        .page-sheet[data-page-num="Page 59"] .compact-table th {
            padding: 2px 3px;
            line-height: 1.1;
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
            border-top: none;
            border-bottom: none;
        }
        .page-sheet[data-page-num="Page 59"] .compact-table td,
        .page-sheet[data-page-num="Page 59"] .compact-table th:not(.table-section-header) {
            text-align: left !important;
        }
        /* Remove outer left border */
        .page-sheet[data-page-num="Page 59"] .compact-table td:first-child,
        .page-sheet[data-page-num="Page 59"] .compact-table th:first-child {
            border-left: none;
        }
        /* Remove outer right border */
        .page-sheet[data-page-num="Page 59"] .compact-table td:last-child,
        .page-sheet[data-page-num="Page 59"] .compact-table th:last-child {
            border-right: none;
        }
        .page-sheet[data-page-num="Page 59"] .table-section-header {
            font-size: 8.5pt;
            padding: 3px;
            text-align: center !important;
            border: none !important;
        }
        /* Column headers - no vertical gridlines, line underneath spans full width */
        .page-sheet[data-page-num="Page 59"] .compact-table:first-of-type thead tr th {
            border-left: none !important;
            border-right: none !important;
            border-bottom: 1px solid #ccc !important;
        }
        /* Empty corner cell - no right border, keep bottom border for continuous line */
        .page-sheet[data-page-num="Page 59"] .empty-corner {
            border-right: none !important;
        }
        /* SALE INFORMATION section - remove vertical borders from empty SUBJECT column */
        .page-sheet[data-page-num="Page 59"] .compact-table:nth-of-type(2) tbody tr td:nth-child(2):empty {
            border-left: none !important;
            border-right: none !important;
        }
        /* Line above Total Physical Adjustments row - no vertical gridlines */
        .page-sheet[data-page-num="Page 59"] .summary-separator td {
            border-top: 1px solid #ccc !important;
            padding-top: 10px !important;
            border-left: none !important;
            border-right: none !important;
        }
        /* Spacing above the summary line - add padding-bottom to Unit Amenities row */
        .page-sheet[data-page-num="Page 59"] .compact-table:last-of-type tbody tr:nth-child(12) td {
            padding-bottom: 8px;
        }
        /* Thicker bottom border on last row of final table only */
        .page-sheet[data-page-num="Page 59"] .compact-table:last-of-type tbody tr:last-child td {
            border-bottom: 2px solid #ccc !important;
        }
        .page-sheet[data-page-num="Page 59"] .compact-table tbody tr:first-child td {
            padding-top: 10px;
        }
        .page-sheet[data-page-num="Page 59"] .label-col {
            background-color: transparent;
            width: 17%;
            border-left: none !important;
            border-right: none !important;
            white-space: nowrap;
        }
        /* Smaller font for address rows to prevent wrapping */
        .page-sheet[data-page-num="Page 59"] .compact-table tbody tr:first-child td:not(.label-col) {
            font-size: 6.5pt;
        }
        /* City row: same small font as addresses, no bold */
        .page-sheet[data-page-num="Page 59"] .compact-table tbody tr:nth-child(2) td:not(.label-col) {
            font-size: 6.5pt;
        }
        .page-sheet[data-page-num="Page 59"] .compact-table tbody tr:nth-child(2) strong {
            font-weight: normal;
        }
        /* Multi-line amenities */
        .page-sheet[data-page-num="Page 59"] .amenities-list {
            font-size: 6.5pt;
            line-height: 1.3;
        }
        .page-sheet[data-page-num="Page 59"] h1 {
            margin-bottom: 8px;
        }
        .page-sheet[data-page-num="Page 59"] h2 {
            margin-bottom: 6px;
        }
        .page-sheet[data-page-num="Page 59"] p {
            margin-bottom: 8px;
            font-size: 9pt;
        }
    </style>
    <h1 class="Header1">Valuation & Conclusions</h1>

    <h2 class="Header2">Direct Comparison Approach</h2>

    <p>The following table summarizes the direct comparison analysis for the subject property and comparable sales.</p>

    <table class="compact-table">
        <colgroup>
            <col style="width: 17%;">
            <col style="width: 13.83%;">
            <col style="width: 13.83%;">
            <col style="width: 13.83%;">
            <col style="width: 13.83%;">
            <col style="width: 13.83%;">
            <col style="width: 13.83%;">
        </colgroup>
        <thead>
            <tr>
                <th colspan="7" class="table-section-header">DIRECT COMPARISON APPROACH TABLE</th>
            </tr>
            <tr>
                <th class="empty-corner" style="background-color: white;"></th>
                <th style="text-align: center; background-color: white;">SUBJECT</th>
                <th style="text-align: center; background-color: white;">COMP 1</th>
                <th style="text-align: center; background-color: white;">COMP 2</th>
                <th style="text-align: center; background-color: white;">COMP 3</th>
                <th style="text-align: center; background-color: white;">COMP 4</th>
                <th style="text-align: center; background-color: white;">COMP 5</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="label-col">Name</td>
                <td><span class="field-mapped" title="{{property-name}}" data-sample="Acorn Apartments">{{property-name}}</span></td>
                <td><span class="field-mapped" title="{{comp1-name}}" data-sample="Heritage House">{{comp1-name}}</span></td>
                <td><span class="field-mapped" title="{{comp2-name}}" data-sample="College View Apartments">{{comp2-name}}</span></td>
                <td><span class="field-mapped" title="{{comp3-name}}" data-sample="Woodland Estates">{{comp3-name}}</span></td>
                <td><span class="field-mapped" title="{{comp4-name}}" data-sample="Parkside Flats 1">{{comp4-name}}</span></td>
                <td><span class="field-mapped" title="{{comp5-name}}" data-sample="Parkside Flats 2">{{comp5-name}}</span></td>
            </tr>
            <tr>
                <td class="label-col">Address</td>
                <td><span class="field-mapped" title="{{street-address}}" data-sample="1101, 1121 109 St">{{street-address}}</span></td>
                <td><span class="field-mapped" title="{{comp1-address}}" data-sample="1351 107 St">{{comp1-address}}</span></td>
                <td><span class="field-mapped" title="{{comp2-address}}" data-sample="10910-10912 Winder Crescent">{{comp2-address}}</span></td>
                <td><span class="field-mapped" title="{{comp3-address}}" data-sample="1901 Pearson Ave">{{comp3-address}}</span></td>
                <td><span class="field-mapped" title="{{comp4-address}}" data-sample="1000 Parr Hill Dr">{{comp4-address}}</span></td>
                <td><span class="field-mapped" title="{{comp5-address}}" data-sample="1030 Parr Hill Dr">{{comp5-address}}</span></td>
            </tr>
            <tr>
                <td class="label-col">City</td>
                <td><span class="field-mapped" title="{{city}}" data-sample="North Battleford">{{city}}</span></td>
                <td><span class="field-mapped" title="{{comp1-city}}" data-sample="North Battleford">{{comp1-city}}</span></td>
                <td><span class="field-mapped" title="{{comp2-city}}" data-sample="North Battleford">{{comp2-city}}</span></td>
                <td><span class="field-mapped" title="{{comp3-city}}" data-sample="North Battleford">{{comp3-city}}</span></td>
                <td><span class="field-mapped" title="{{comp4-city}}" data-sample="Martensville">{{comp4-city}}</span></td>
                <td><span class="field-mapped" title="{{comp5-city}}" data-sample="Martensville">{{comp5-city}}</span></td>
            </tr>
            <tr>
                <td class="label-col">Province</td>
                <td><span class="field-mapped" title="{{province}}" data-sample="SK">{{province}}</span></td>
                <td><span class="field-mapped" title="{{comp1-province}}" data-sample="SK">{{comp1-province}}</span></td>
                <td><span class="field-mapped" title="{{comp2-province}}" data-sample="SK">{{comp2-province}}</span></td>
                <td><span class="field-mapped" title="{{comp3-province}}" data-sample="SK">{{comp3-province}}</span></td>
                <td><span class="field-mapped" title="{{comp4-province}}" data-sample="SK">{{comp4-province}}</span></td>
                <td><span class="field-mapped" title="{{comp5-province}}" data-sample="SK">{{comp5-province}}</span></td>
            </tr>
            <tr>
                <td class="label-col">Postal Code</td>
                <td><span class="field-mapped" title="{{postal-code}}" data-sample="S9A 2E5">{{postal-code}}</span></td>
                <td><span class="field-mapped" title="{{comp1-postal-code}}" data-sample="S9A 2A1">{{comp1-postal-code}}</span></td>
                <td><span class="field-mapped" title="{{comp2-postal-code}}" data-sample="S9A 2C3">{{comp2-postal-code}}</span></td>
                <td><span class="field-mapped" title="{{comp3-postal-code}}" data-sample="S9A 3L5">{{comp3-postal-code}}</span></td>
                <td><span class="field-mapped" title="{{comp4-postal-code}}" data-sample="S0K 2I1">{{comp4-postal-code}}</span></td>
                <td><span class="field-mapped" title="{{comp5-postal-code}}" data-sample="S0K 2I1">{{comp5-postal-code}}</span></td>
            </tr>
        </tbody>
    </table>

    <table class="compact-table">
        <colgroup>
            <col style="width: 17%;">
            <col style="width: 13.83%;">
            <col style="width: 13.83%;">
            <col style="width: 13.83%;">
            <col style="width: 13.83%;">
            <col style="width: 13.83%;">
            <col style="width: 13.83%;">
        </colgroup>
        <thead>
            <tr>
                <th colspan="7" class="table-section-header">SALE INFORMATION</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="label-col">Transaction Price</td>
                <td></td>
                <td class="numeric-cell"><span class="field-mapped" title="{{comp1-sale-price}}" data-sample="$3,117,383">{{comp1-sale-price}}</span></td>
                <td class="numeric-cell"><span class="field-mapped" title="{{comp2-sale-price}}" data-sample="$4,590,858">{{comp2-sale-price}}</span></td>
                <td class="numeric-cell"><span class="field-mapped" title="{{comp3-sale-price}}" data-sample="$2,055,056">{{comp3-sale-price}}</span></td>
                <td class="numeric-cell"><span class="field-mapped" title="{{comp4-sale-price}}" data-sample="$9,310,000">{{comp4-sale-price}}</span></td>
                <td class="numeric-cell"><span class="field-mapped" title="{{comp5-sale-price}}" data-sample="$13,720,000">{{comp5-sale-price}}</span></td>
            </tr>
            <tr>
                <td class="label-col">Transaction Price$/Unit</td>
                <td></td>
                <td class="numeric-cell"><span class="field-mapped" title="{{comp1-price-per-unit}}" data-sample="$129,891">{{comp1-price-per-unit}}</span></td>
                <td class="numeric-cell"><span class="field-mapped" title="{{comp2-price-per-unit}}" data-sample="$102,019">{{comp2-price-per-unit}}</span></td>
                <td class="numeric-cell"><span class="field-mapped" title="{{comp3-price-per-unit}}" data-sample="$85,627">{{comp3-price-per-unit}}</span></td>
                <td class="numeric-cell"><span class="field-mapped" title="{{comp4-price-per-unit}}" data-sample="$198,085">{{comp4-price-per-unit}}</span></td>
                <td class="numeric-cell"><span class="field-mapped" title="{{comp5-price-per-unit}}" data-sample="$214,375">{{comp5-price-per-unit}}</span></td>
            </tr>
            <!-- Add more SALE INFORMATION rows as needed -->
        </tbody>
    </table>

    <table class="compact-table">
        <colgroup>
            <col style="width: 17%;">
            <col style="width: 13.83%;">
            <col style="width: 13.83%;">
            <col style="width: 13.83%;">
            <col style="width: 13.83%;">
            <col style="width: 13.83%;">
            <col style="width: 13.83%;">
        </colgroup>
        <thead>
            <tr>
                <th colspan="7" class="table-section-header">INCOME INFORMATION</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="label-col">NOI/Unit</td>
                <td class="numeric-cell"><span class="field-mapped" title="{{calc-noi-per-unit}}" data-sample="$6,986">{{calc-noi-per-unit}}</span></td>
                <td class="numeric-cell"><span class="field-mapped" title="{{comp1-noi-per-unit}}" data-sample="$7,780">{{comp1-noi-per-unit}}</span> <span style="font-size: 6pt; color: #d32f2f;">(10%)</span></td>
                <td class="numeric-cell"><span class="field-mapped" title="{{comp2-noi-per-unit}}" data-sample="$6,111">{{comp2-noi-per-unit}}</span> <span style="font-size: 6pt;">14%</span></td>
                <td class="numeric-cell"><span class="field-mapped" title="{{comp3-noi-per-unit}}" data-sample="$5,129">{{comp3-noi-per-unit}}</span> <span style="font-size: 6pt;">36%</span></td>
                <td class="numeric-cell"><span class="field-mapped" title="{{comp4-noi-per-unit}}" data-sample="$12,365">{{comp4-noi-per-unit}}</span> <span style="font-size: 6pt; color: #d32f2f;">(44%)</span></td>
                <td class="numeric-cell"><span class="field-mapped" title="{{comp5-noi-per-unit}}" data-sample="$12,681">{{comp5-noi-per-unit}}</span> <span style="font-size: 6pt; color: #d32f2f;">(45%)</span></td>
            </tr>
            <!-- Add more INCOME INFORMATION rows as needed -->
        </tbody>
    </table>

    <table class="compact-table">
        <colgroup>
            <col style="width: 17%;">
            <col style="width: 13.83%;">
            <col style="width: 13.83%;">
            <col style="width: 13.83%;">
            <col style="width: 13.83%;">
            <col style="width: 13.83%;">
            <col style="width: 13.83%;">
        </colgroup>
        <thead>
            <tr>
                <th colspan="7" class="table-section-header">PHYSICAL INFORMATION</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="label-col">Units</td>
                <td class="numeric-cell"><span class="field-mapped" title="{{subject-units}}" data-sample="16">{{subject-units}}</span></td>
                <td class="numeric-cell"><span class="field-mapped" title="{{comp1-units}}" data-sample="24">{{comp1-units}}</span></td>
                <td class="numeric-cell"><span class="field-mapped" title="{{comp2-units}}" data-sample="45">{{comp2-units}}</span></td>
                <td class="numeric-cell"><span class="field-mapped" title="{{comp3-units}}" data-sample="24">{{comp3-units}}</span></td>
                <td class="numeric-cell"><span class="field-mapped" title="{{comp4-units}}" data-sample="47">{{comp4-units}}</span></td>
                <td class="numeric-cell"><span class="field-mapped" title="{{comp5-units}}" data-sample="64">{{comp5-units}}</span></td>
            </tr>
            <!-- Add more PHYSICAL INFORMATION rows as needed -->
            <tr class="summary-separator" style="background-color: white;">
                <td colspan="2" style="background-color: white;"><strong>Total Physical Adjustments</strong></td>
                <td class="numeric-cell" style="background-color: white;"><span class="field-mapped" title="{{comp1-total-phys-adj}}" data-sample="-$13,208">{{comp1-total-phys-adj}}</span> <span style="font-size: 6pt; color: #d32f2f;">(10%)</span></td>
                <td class="numeric-cell" style="background-color: white;"><span class="field-mapped" title="{{comp2-total-phys-adj}}" data-sample="$14,608">{{comp2-total-phys-adj}}</span> <span style="font-size: 6pt;">14%</span></td>
                <td class="numeric-cell" style="background-color: white;"><span class="field-mapped" title="{{comp3-total-phys-adj}}" data-sample="-$31,562">{{comp3-total-phys-adj}}</span> <span style="font-size: 6pt; color: #d32f2f;">(36%)</span></td>
                <td class="numeric-cell" style="background-color: white;"><span class="field-mapped" title="{{comp4-total-phys-adj}}" data-sample="-$86,171">{{comp4-total-phys-adj}}</span> <span style="font-size: 6pt; color: #d32f2f;">(44%)</span></td>
                <td class="numeric-cell" style="background-color: white;"><span class="field-mapped" title="{{comp5-total-phys-adj}}" data-sample="-$96,270">{{comp5-total-phys-adj}}</span> <span style="font-size: 6pt; color: #d32f2f;">(45%)</span></td>
            </tr>
            <tr style="background-color: white;">
                <td colspan="2" style="background-color: white;"><strong>Adjusted $/Unit</strong></td>
                <td class="numeric-cell" style="background-color: white;"><strong><span class="field-mapped" title="{{comp1-adj-price-per-unit}}" data-sample="$116,683">{{comp1-adj-price-per-unit}}</span></strong></td>
                <td class="numeric-cell" style="background-color: white;"><strong><span class="field-mapped" title="{{comp2-adj-price-per-unit}}" data-sample="$116,627">{{comp2-adj-price-per-unit}}</span></strong></td>
                <td class="numeric-cell" style="background-color: white;"><strong><span class="field-mapped" title="{{comp3-adj-price-per-unit}}" data-sample="$54,065">{{comp3-adj-price-per-unit}}</span></strong></td>
                <td class="numeric-cell" style="background-color: white;"><strong><span class="field-mapped" title="{{comp4-adj-price-per-unit}}" data-sample="$111,914">{{comp4-adj-price-per-unit}}</span></strong></td>
                <td class="numeric-cell" style="background-color: white;"><strong><span class="field-mapped" title="{{comp5-adj-price-per-unit}}" data-sample="$118,105">{{comp5-adj-price-per-unit}}</span></strong></td>
            </tr>
        </tbody>
    </table>

    <div class="page-footer">
        <div>
            <span class="page-num">59</span>
            <span class="field-mapped" title="{{Property_Address}}" data-sample="1101, 1121 109 St, North Battleford, Saskatchewan">{{Property_Address}}</span> | File <span class="field-mapped" title="{{File_Number}}" data-sample="VAL251012 - 1">{{File_Number}}</span>
        </div>
        <div class="footer-accent"></div>
    </div>
</div>
```

---

## Key Features

1. **Scoped CSS** - All styles use `.page-sheet[data-page-num="Page 59"]` selector
2. **Multiple Table Sections** - Clean pattern with section headers
3. **Column Headers** - Only the first table has SUBJECT/COMP 1-5 headers
4. **Vertical Gridlines** - Between data columns (not on label column)
5. **Compact Fonts** - 7.5pt base, 6.5pt for addresses/amenities
6. **Summary Rows** - Styled with separator lines and white background
7. **Field Mapping** - All data wrapped in `<span class="field-mapped">` with field IDs

## To Use This Template

1. Copy the HTML code section above
2. Change `data-page-num="Page 59"` to your new page number
3. Update all CSS selectors to match your page number
4. Replace field IDs ({{comp1-name}}, etc.) with your field names
5. Adjust table sections as needed
6. Update footer page number

This template gives you the exact same structure and styling as Page 59!
