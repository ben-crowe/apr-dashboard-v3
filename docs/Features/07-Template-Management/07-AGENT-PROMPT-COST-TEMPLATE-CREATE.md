# Agent Task: Create Cost Approach Template Page

## Priority: 🔴 CRITICAL

## Problem
The Cost Approach calculator works in the builder, but there is NO template page to display the output in the final report. Users complete Cost Approach inputs, but nothing appears in the generated PDF.

## Template File
```
public/Report-MF-template.html
```
Or wherever the master template is located.

## Current State
- ✅ CostTabPanel UI exists with 18 inputs
- ✅ CostApproachPanel calculator works
- ✅ Store has all cost-* fields wired
- ❌ No template page renders Cost Approach output

## Required: New Template Page

Create a new page (likely Page 69 or insert before RECON pages) with this structure:

### Page Header
```html
<!-- PAGE XX: Cost Approach -->
<div class="page-sheet" data-page-num="Page XX">
    <div class="Header1">Cost Approach</div>
```

### Land Value Section
```html
<table class="data-table">
    <tr class="section-header">
        <td colspan="2">LAND VALUE</td>
    </tr>
    <tr>
        <td>Land Area (SF)</td>
        <td class="text-right">{{cost-land-sf}}</td>
    </tr>
    <tr>
        <td>Rate per SF</td>
        <td class="text-right">{{cost-land-rate-per-sf}}</td>
    </tr>
    <tr class="total-row">
        <td>Land Value</td>
        <td class="text-right">{{cost-land-value}}</td>
    </tr>
</table>
```

### Replacement Cost New Section
```html
<table class="data-table">
    <tr class="section-header">
        <td colspan="2">REPLACEMENT COST NEW</td>
    </tr>
    <tr>
        <td>Gross Building Area (SF)</td>
        <td class="text-right">{{cost-rcn-gba}}</td>
    </tr>
    <tr>
        <td>Direct Cost per SF</td>
        <td class="text-right">{{cost-rcn-rate-per-sf}}</td>
    </tr>
    <tr>
        <td>Direct Costs</td>
        <td class="text-right">{{cost-rcn-direct-costs}}</td>
    </tr>
    <tr>
        <td>Indirect Costs ({{cost-rcn-indirect-pct}}%)</td>
        <td class="text-right">{{cost-rcn-indirect-costs}}</td>
    </tr>
    <tr>
        <td>Entrepreneur Incentive ({{cost-rcn-entrepreneur-pct}}%)</td>
        <td class="text-right">{{cost-rcn-entrepreneur-amt}}</td>
    </tr>
    <tr class="total-row">
        <td>Total Replacement Cost New</td>
        <td class="text-right">{{cost-rcn-total}}</td>
    </tr>
</table>
```

### Depreciation Section
```html
<table class="data-table">
    <tr class="section-header">
        <td colspan="2">DEPRECIATION</td>
    </tr>
    <tr>
        <td>Actual Age</td>
        <td class="text-right">{{cost-depr-physical-age}} years</td>
    </tr>
    <tr>
        <td>Economic Life</td>
        <td class="text-right">{{cost-depr-physical-life}} years</td>
    </tr>
    <tr>
        <td>Effective Age</td>
        <td class="text-right">{{cost-depr-physical-effective-age}} years</td>
    </tr>
    <tr>
        <td>Remaining Economic Life</td>
        <td class="text-right">{{cost-depr-physical-remaining-life}} years</td>
    </tr>
    <tr>
        <td>Physical Depreciation ({{cost-depr-physical-pct}}%)</td>
        <td class="text-right">{{cost-depr-physical-amt}}</td>
    </tr>
    <tr>
        <td>Functional Obsolescence</td>
        <td class="text-right">{{cost-depr-functional-total}}</td>
    </tr>
    <tr>
        <td>External Obsolescence</td>
        <td class="text-right">{{cost-depr-external-total}}</td>
    </tr>
    <tr class="total-row">
        <td>Total Depreciation</td>
        <td class="text-right">{{cost-depr-total-amt}}</td>
    </tr>
</table>
```

### Site Improvements Section
```html
<table class="data-table">
    <tr class="section-header">
        <td colspan="2">SITE IMPROVEMENTS</td>
    </tr>
    <tr>
        <td>Parking ({{cost-site-parking-spaces}} spaces @ {{cost-site-parking-cost}}/space)</td>
        <td class="text-right">{{cost-site-parking-total}}</td>
    </tr>
    <tr>
        <td>Landscaping</td>
        <td class="text-right">{{cost-site-landscaping}}</td>
    </tr>
    <tr>
        <td>Paving</td>
        <td class="text-right">{{cost-site-paving}}</td>
    </tr>
    <tr>
        <td>Utilities</td>
        <td class="text-right">{{cost-site-utilities}}</td>
    </tr>
    <tr>
        <td>Other</td>
        <td class="text-right">{{cost-site-other}}</td>
    </tr>
    <tr class="total-row">
        <td>Total Site Improvements</td>
        <td class="text-right">{{cost-site-total}}</td>
    </tr>
</table>
```

### Value Summary Section
```html
<table class="data-table">
    <tr class="section-header">
        <td colspan="2">COST APPROACH SUMMARY</td>
    </tr>
    <tr>
        <td>Land Value</td>
        <td class="text-right">{{cost-land-value}}</td>
    </tr>
    <tr>
        <td>Replacement Cost New</td>
        <td class="text-right">{{cost-rcn-total}}</td>
    </tr>
    <tr>
        <td>Less: Total Depreciation</td>
        <td class="text-right">({{cost-depr-total-amt}})</td>
    </tr>
    <tr>
        <td>Depreciated Cost of Improvements</td>
        <td class="text-right">{{cost-depreciated-value}}</td>
    </tr>
    <tr>
        <td>Plus: Site Improvements</td>
        <td class="text-right">{{cost-site-total}}</td>
    </tr>
    <tr class="grand-total">
        <td>INDICATED VALUE - COST APPROACH</td>
        <td class="text-right">{{cost-indicated-value}}</td>
    </tr>
</table>
```

### Narrative Section
```html
<div class="narrative-section">
    <div class="Header2">Cost Approach Analysis</div>
    <p>{{cost-approach-conclusion}}</p>
</div>
```

### Page Footer
```html
    <div class="page-footer">
        <div>
            <span class="page-num">XX</span>
            <span>{{Property_Address}}</span> | File <span>{{File_Number}}</span>
        </div>
        <div class="footer-accent"></div>
    </div>
</div>
```

## Field IDs Reference

### Input Fields (from store)
```
cost-land-sf
cost-land-rate-per-sf
cost-rcn-gba
cost-rcn-rate-per-sf
cost-rcn-indirect-pct
cost-rcn-entrepreneur-pct
cost-depr-physical-age
cost-depr-physical-life
cost-depr-physical-effective-age
cost-depr-functional-total
cost-depr-external-total
cost-site-parking-spaces
cost-site-parking-cost
cost-site-landscaping
cost-site-paving
cost-site-utilities
cost-site-other
cost-approach-conclusion
```

### Calculated Fields (from costApproachCalculations.ts)
```
cost-land-value
cost-rcn-direct-costs
cost-rcn-indirect-costs
cost-rcn-entrepreneur-amt
cost-rcn-total
cost-depr-physical-remaining-life
cost-depr-physical-pct
cost-depr-physical-amt
cost-depr-total-pct
cost-depr-total-amt
cost-site-parking-total
cost-site-total
cost-depreciated-value
cost-indicated-value
```

## Styling

Use the same CSS classes as other financial tables in the template:
- `.data-table` for tables
- `.section-header` for section headers
- `.total-row` for subtotals
- `.grand-total` for final value
- `.text-right` for right-aligned numbers

Copy styling patterns from Page 48 (Income Approach) for consistency.

## Page Placement

Insert before Reconciliation pages (currently 67-68).
Update page numbers if needed.

## Verification

1. Enter Cost Approach data in builder
2. Generate report preview
3. Verify Cost Approach page appears with correct values
4. Check calculated fields compute correctly

## Do NOT
- Change existing Cost tab UI
- Modify store field IDs
- Change calculation logic
- Alter other template pages
