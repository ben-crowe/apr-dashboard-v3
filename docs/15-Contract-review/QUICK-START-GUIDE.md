# Mock Report Builder - Quick Start Guide

## Access the Builder

1. Start the development server:
   ```bash
   cd /Users/bencrowe/Development/APR-Dashboard-v3
   npm run dev
   ```

2. Open browser to: `http://localhost:3000/mock-builder`

## What You'll See

### Split-Screen Interface

**Left Panel (Edit)**
- Tabs: Cover Info | Photos | Summary
- Editable fields with live updates
- Image drag-and-drop interface

**Right Panel (Preview)**
- Live HTML preview
- Updates as you type (300ms delay)
- Full styled document

## Try These Features

### 1. Edit Text Fields
- Click "Cover Info" tab
- Type in "Property Address" field
- Wait 300ms - preview updates automatically

### 2. Edit Multiline Text
- Click "Summary" tab
- Type in "Summary Notes" textarea
- Preview updates with formatted text

### 3. Reorder Images
- Click "Photos" tab
- Drag any image up or down
- Preview updates immediately

### 4. Add New Image
- Click "Photos" tab
- Paste URL in input field (try: `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400`)
- Press Enter or click + button
- See photo count increase in Summary tab

### 5. Remove Image
- Click X button on any image
- See photo count decrease
- Preview updates

### 6. Resize Panels
- Grab the handle between panels
- Drag left or right
- Panels resize smoothly

### 7. Watch Calculated Fields
- "Report Date" always shows today
- "Total Photo Count" updates automatically
- Both are read-only (muted background)

## Architecture Quick Reference

### State Management
```typescript
// Access the store anywhere
import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';

// Use in component
const updateField = useReportBuilderStore((state) => state.updateFieldValue);
```

### Adding New Sections

1. Create section component in `/src/features/report-builder/components/sections/`
2. Add to mock data in `reportBuilderStore.ts`
3. Add tab in `EditPanel.tsx`
4. Update HTML template in `reportHtmlTemplate.ts`

### Adding New Field Types

1. Define type in `reportBuilder.types.ts`
2. Create editor component in `/src/features/report-builder/components/EditPanel/`
3. Add to section component
4. Handle in store actions

## File Locations

- **Page**: `/src/pages/MockReportBuilder.tsx`
- **Store**: `/src/features/report-builder/store/reportBuilderStore.ts`
- **Layout**: `/src/features/report-builder/components/ReportBuilderLayout.tsx`
- **Template**: `/src/features/report-builder/templates/reportHtmlTemplate.ts`

## Common Tasks

### Update Mock Data
Edit: `/src/features/report-builder/store/reportBuilderStore.ts`
Look for: `getMockData()` function

### Change Debounce Delay
Edit: `/src/features/report-builder/components/EditPanel/TextFieldEditor.tsx`
Change: `debounce(..., 300)` to desired milliseconds

### Modify Preview Style
Edit: `/src/features/report-builder/templates/reportHtmlTemplate.ts`
Update: `<style>` section

### Add Validation
Edit: `/src/features/report-builder/store/reportBuilderStore.ts`
Update: `updateFieldValue` action

## Troubleshooting

### Preview not updating
- Check browser console for errors
- Verify 300ms has passed after typing
- Ensure field ID matches store data

### Images not displaying
- Check image URL is valid
- Ensure CORS allows loading
- Try Unsplash URLs (CORS-friendly)

### Drag-and-drop not working
- Ensure draggable attribute is set
- Check browser supports Drag API
- Verify event handlers are attached

### Build errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## Sample Image URLs

Use these for testing:
```
https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400
https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400
https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400
https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400
https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400
```

## Next Steps

To extend this to full V4 report builder:

1. **Add More Sections**: Duplicate section pattern
2. **Real Field Mapping**: Import actual 330+ field definitions
3. **Backend Integration**: Connect to Supabase
4. **PDF Export**: Integrate pdf generation library
5. **Save/Load**: Implement persistence
6. **Validation**: Add field-level validation
7. **Templates**: Create multiple report templates
8. **Collaboration**: Add real-time features

## Performance Tips

- Use debouncing for all text inputs
- Skip debouncing for immediate feedback (images, toggles)
- Keep calculated field logic simple
- Minimize HTML template size
- Use Zustand selectors to prevent unnecessary re-renders

## Key Patterns

### Debounced Updates
```typescript
const debouncedUpdate = useCallback(
  debounce((id: string, value: string) => {
    updateFieldValue(id, value);
  }, 300),
  []
);
```

### Immediate Updates
```typescript
const handleReorder = (newOrder: string[]) => {
  reorderImages(fieldId, newOrder);
  // No debounce - instant feedback
};
```

### Calculated Fields
```typescript
// Update automatically when dependencies change
function updateCalculatedFields(sections: ReportSection[]): ReportSection[] {
  // Find dependency
  const photoCount = getPhotoCount(sections);

  // Update calculated field
  return updateField('total-photo-count', photoCount);
}
```

## Support

For issues or questions:
1. Check browser console for errors
2. Verify all files are present
3. Ensure npm install completed
4. Check TypeScript compilation
5. Review this guide

## Success Criteria

You'll know it's working when:
- ✅ Split screen appears
- ✅ Tabs switch correctly
- ✅ Text edits update preview after 300ms
- ✅ Images can be dragged and reordered
- ✅ Photo count updates automatically
- ✅ Report date shows today
- ✅ Preview renders full HTML document
- ✅ Panels can be resized
