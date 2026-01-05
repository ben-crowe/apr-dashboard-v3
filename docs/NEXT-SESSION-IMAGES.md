# Next Session: Fix Images Not Loading

## Problem
Images not displaying in preview even though:
- Image files exist in `public/extracted-images/` (91 files)
- TestDataSet1 has correct paths: `"subject-photo": "/extracted-images/image2.jpeg"`

## Likely Cause
Template has `<img src="{{subject-photo}}">` but interpolation may not be replacing src attributes properly.

## Check These:
1. **Template line 704:** `<img src="{{subject-photo}}"...`
2. **Interpolation regex (reportBuilderStore.ts:6075):** Does it replace inside src attributes?
3. **Image field IDs in TestDataSet1:** `subject-photo`, `subject-photo-1` through `subject-photo-25`

## Test Data Image Fields
```
subject-photo: /extracted-images/image2.jpeg
subject-photo-1: /extracted-images/image12.jpeg
img-map-regional: /extracted-images/image1.png
img-comparables-map: /extracted-images/image38.png
```

## Quick Debug
```javascript
// In browser console after Load Data:
document.querySelectorAll('img[src*="{{"]').length  // Should be 0 if interpolated
document.querySelectorAll('img[src*="extracted"]').length  // Should be > 0
```

## Files
- `public/Report-MF-template.html` - image tags
- `src/features/report-builder/store/reportBuilderStore.ts` - interpolateTemplate()
- `src/features/report-builder/data/TestDataSet1.ts` - image URLs
