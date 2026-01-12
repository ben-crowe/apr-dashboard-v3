# Page Break Consistency Fixes

## Summary
Fixed page break consistency issues in the Report Builder HTML template to ensure proper PDF pagination and prevent sections from rendering as compressed extra-long pages.

## Changes Made

### 1. Maps Section (renderMapsSection)
**Location:** `/src/features/report-builder/templates/reportHtmlTemplate.ts` lines 4567-4610

**Problem:** All 3 maps (Regional, Local, Aerial) rendered on one long page that got compressed during PDF export.

**Solution:** Added page breaks before Local Area Map and Aerial View:
- Regional Location Map: First page (no break needed)
- Local Area Map: New page (added `<div style="page-break-before: always;"></div>`)
- Aerial View: New page (added `<div style="page-break-before: always;"></div>`)

**Result:** Each map now renders on its own page with proper sizing.

### 2. Photos Section (renderPhotosSection)
**Location:** `/src/features/report-builder/templates/reportHtmlTemplate.ts` lines 3215-3337

**Enhancement:** Added intelligent page breaking logic:
- Photos render in 2-column grid
- Page break added after every 4 photos (2 rows)
- Subsection title continues on new pages: "(continued)"

**Result:** Photo grids no longer span too many pages and get compressed.

## Sections Already Properly Paginated

The following sections were analyzed and found to have adequate page breaks:

### Site Section (280 lines)
- Has 3 page breaks at logical subsection boundaries
- Roughly one break every 70-90 lines
- **Status:** Properly paginated

### Sales Section (952 lines)  
- Has 8 page breaks throughout
- Breaks between sales comparables and analysis sections
- **Status:** Properly paginated

### Income Section (709 lines)
- Has 11 page breaks
- Breaks between income analysis components
- **Status:** Properly paginated

### Improvements Section (403 lines)
- Has 3 page breaks
- Breaks between major improvement categories
- **Status:** Properly paginated

### Rental Survey Section (601 lines)
- Has 1 page break
- May need additional breaks if content becomes denser
- **Status:** Adequate for current content

## Technical Details

### Page Break Implementation
All page breaks use the explicit approach:
```html
<div style="page-break-before: always;"></div>
```

This ensures consistent PDF rendering across different browsers and PDF generators.

### Page Size Guidelines
- Typical 8.5x11 page fits ~900-1000px of content
- Sections exceeding this should have page breaks at logical points
- Page breaks should occur at semantic boundaries (after tables, images, subsections)

## Testing Recommendations

1. Generate a PDF with all sections populated
2. Verify each map appears on its own page
3. Verify photo grids don't exceed 4 photos per page
4. Check that no pages appear compressed or stretched
5. Ensure page breaks occur at logical semantic boundaries

## Files Modified

- `/src/features/report-builder/templates/reportHtmlTemplate.ts`

## Commit
```
commit 2e94023
Add page breaks to long sections for proper PDF pagination
```
