# Page 40 Table Row Tags Fix

## Issue
Page 40 tables were missing ALL `<tr>` row tags, causing invalid HTML structure.

## Tables Affected
1. **Table 1: "1 BED UNITS"** (lines 2687-2776) - 10 data rows
2. **Table 2: "UNIT TYPE ANALYSIS & CONCLUSIONS"** (lines 2780-2801) - 1 data row (already correct)
3. **Table 3: "2 BED UNITS"** (lines 2805-2894) - 10 data rows

## Fix Applied
Added proper `<tr>` and `</tr>` tags to wrap each set of `<td>` cells.

### Before (BROKEN):
```html
<tbody>
    
        <td>1 Flat 1 Bed / 1 Bath</td>
        <td class="text-right"><span...></span></td>
        ...
    
```

### After (CORRECT):
```html
<tbody>
    
    <tr>
        <td>1 Flat 1 Bed / 1 Bath</td>
        <td class="text-right"><span...></span></td>
        ...
    </tr>
    
```

## Validation Results
- Total `<tr>` tags: 24 (balanced)
- Total `</tr>` tags: 24 (balanced)
- Total `<td>` tags: 114 (balanced)
- Total `</td>` tags: 114 (balanced)
- All rows have 6 cells (correct structure)

## Files Modified
- `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-html/doc-pages-html-formatted/PREVIEW-Master.html`

## Backup Created
- `PREVIEW-Master.html.backup-[timestamp]`

## Commit
- `fix(page-40): add missing tr tags to all table rows`

---
Date: 2025-12-16
Fixed by: Claude Sonnet 4.5
