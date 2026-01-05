# Images Fix Applied - 2026-01-05

## Problem
Images not displaying in preview even though:
- Image files exist in `public/extracted-images/` (91 files)
- TestDataSet1 has correct paths: `"subject-photo": "/extracted-images/image2.jpeg"`

## Root Cause Found
The `buildImageMgtSection()` function in `reportBuilderStore.ts` was **missing 5 subsections** that exist in the fieldRegistry:

- `subject-photos` - Primary subject property images
- `comp-photos` - Comparable property photos
- `comp-maps` - Comparable location maps
- `rental-comp-photos` - Rental comparable photos
- `branding` - Company logo

This caused all fields in these subsections to be **silently dropped** when building sections from the registry.

## Fix Applied
Added the missing subsections to `buildImageMgtSection()` at line 175-180:

```typescript
'subject-photos': { id: 'subject-photos', title: 'SUBJECT PROPERTY PHOTOGRAPHS', fields: [] },
'comp-photos': { id: 'comp-photos', title: 'COMPARABLE PHOTOGRAPHS', fields: [] },
'comp-maps': { id: 'comp-maps', title: 'COMPARABLE LOCATION MAPS', fields: [] },
'rental-comp-photos': { id: 'rental-comp-photos', title: 'RENTAL COMPARABLE PHOTOGRAPHS', fields: [] },
'branding': { id: 'branding', title: 'COMPANY BRANDING', fields: [] },
```

## Verification
To verify the fix:
1. Go to TDD page (`/test-input`)
2. Click "Load Data" button
3. Navigate to Report Builder
4. Check browser console - should see image fields being loaded
5. In preview, cover page image should display

## Console Debug Commands
```javascript
// Check if image fields are in store
useReportBuilderStore.getState().sections.find(s => s.id === 'image-mgt')?.subsections

// Check if subject-photo value is populated
useReportBuilderStore.getState().sections
  .flatMap(s => s.subsections || [])
  .flatMap(sub => sub.fields)
  .find(f => f.id === 'subject-photo')

// After Load Data, in browser console:
document.querySelectorAll('img[src*="extracted"]').length  // Should be > 0
```

## Files Modified
- `src/features/report-builder/store/reportBuilderStore.ts` - Added missing subsections

## Commit
`1c73fa6` - Fix images not loading: add missing subsections to buildImageMgtSection
