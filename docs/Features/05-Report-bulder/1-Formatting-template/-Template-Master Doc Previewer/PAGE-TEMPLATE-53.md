# Page 53 Template - Text Analysis with Summary Table

## HTML Code (Copy everything below this line)

```html
<!-- ============================================ -->
<!-- PAGE 53: [Page Title] -->
<!-- ============================================ -->
<div class="page-sheet" data-page-num="Page XX">
    <h1 class="Header1">Valuation & Conclusions</h1>

    <h2 class="Header2">[Section Title]</h2>

    <p>[Analysis paragraph 1 with inline field mappings like <span class="field-mapped" title="{{field-id}}" data-sample="value">{{field-id}}</span>]</p>

    <p>[Analysis paragraph 2]</p>

    <p>[Analysis paragraph 3]</p>

    <p>[Conclusion paragraph]</p>

    <h2 class="Header2">[Conclusion Section Title]</h2>

    <p>[Final analysis paragraph]</p>

    <table class="compact-table">
        <thead>
            <tr>
                <th>COMPONENT</th>
                <th>RANGE</th>
                <th>AVERAGE</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Market Extraction</td>
                <td><span class="field-mapped" title="{{field-range}}" data-sample="5.92% to 6.24%">{{field-range}}</span></td>
                <td class="numeric-cell"><span class="field-mapped" title="{{field-average}}" data-sample="6.03%">{{field-average}}</span></td>
            </tr>
            <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td>CONCLUDED [METRIC NAME]</td>
                <td></td>
                <td class="numeric-cell"><span class="field-mapped" title="{{calc-field}}" data-sample="6.25%">{{calc-field}}</span></td>
            </tr>
        </tbody>
    </table>

    <div class="page-footer">
        <div>
            <span class="page-num">XX</span>
            <span class="field-mapped" title="{{Property_Address}}" data-sample="1101, 1121 109 St, North Battleford, Saskatchewan">{{Property_Address}}</span> | File <span class="field-mapped" title="{{File_Number}}" data-sample="VAL251012 - 1">{{File_Number}}</span>
        </div>
        <div class="footer-accent"></div>
    </div>
</div>
```

## Key Features

1. **Text-Heavy Analysis Page**: Multiple paragraphs with inline field-mapped data
2. **Two H2 Sections**: Main analysis section + conclusion section
3. **Inline Field Mapping**: Fields embedded within paragraph text using spans
4. **Simple Summary Table**: 3-column table with header row + data rows
5. **Highlighted Conclusion Row**: Gray background + bold text for final conclusion
6. **Clean Typography**: Uses standard Header1, Header2, paragraph styles

## Field Mapping Pattern

```html
<span class="field-mapped" title="{{field-id}}" data-sample="sample-value">{{field-id}}</span>
```

## Table Structure

- **Header row**: Column titles (COMPONENT, RANGE, AVERAGE, etc.)
- **Data rows**: Regular white background
- **Conclusion row**: `style="background-color: #f0f0f0; font-weight: bold;"`
- **Numeric cells**: Use `class="numeric-cell"` for right-aligned numbers

## To Use This Template

1. Copy the HTML code above
2. Change `data-page-num="Page XX"` to your page number
3. Update the page number in footer: `<span class="page-num">XX</span>`
4. Replace `[Page Title]`, `[Section Title]` with actual titles
5. Replace all `[Analysis paragraph]` placeholders with your content
6. Update all field IDs: `{{field-id}}` → `{{your-actual-field-id}}`
7. Adjust table headers and rows for your specific data
8. Update `data-sample` values to match your test data

## Example Field IDs (from Page 53 - Cap Rate Analysis)

- `{{CapRate_Low}}` - Lowest cap rate in range
- `{{CapRate_High}}` - Highest cap rate in range
- `{{CapRate_Average}}` - Average cap rate
- `{{CapRate_Range}}` - Full range text (e.g., "5.92% to 6.24%")
- `{{calc-cap-rate}}` - Concluded cap rate
- `{{Year_Built}}` - Subject property year built
- `{{comp5-cap-rate}}` - Individual comparable cap rate

## Use Cases

- Capitalization Rate Analysis
- Discount Rate Analysis
- Market Rent Analysis
- Expense Analysis Conclusions
- Any page with multiple paragraphs of analysis + summary table
