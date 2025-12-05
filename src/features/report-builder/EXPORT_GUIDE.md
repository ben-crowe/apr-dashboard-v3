# Report Export Functionality Guide

## Overview

The Report Builder now includes export functionality that allows users to download their appraisal reports in multiple formats:

- **PDF** - For final delivery to clients
- **DOCX** - For users who want to make further edits in Microsoft Word
- **HTML** - For archival or importing into other systems

## Features

### PDF Export

**Location**: Preview Panel toolbar, "PDF" button

**Functionality**:
- Opens the browser's native print dialog
- User can select "Save as PDF" to download
- Preserves exact layout and formatting
- Supports multi-page documents with proper page breaks

**Technical Details**:
- Uses the browser's built-in print functionality
- Most reliable method for PDF generation
- No additional processing or quality loss
- File naming: `appraisal-report-[property-name/file-number]-[date].pdf`

### DOCX Export

**Location**: Preview Panel toolbar, "DOCX" button

**Functionality**:
- Downloads a Word-compatible file
- Can be opened in Microsoft Word for editing
- Preserves basic formatting and structure
- Maintains text content and images

**Technical Details**:
- Exports as HTML with Microsoft Word XML namespaces
- Word automatically converts on open
- File naming: `appraisal-report-[property-name/file-number]-[date].docx`
- Note: Some advanced CSS styling may need adjustment in Word

### HTML Export

**Location**: Available via `exportToHTML()` function (can be added to UI if needed)

**Functionality**:
- Downloads a standalone HTML file
- Can be opened in any browser
- Useful for archival or integration with other systems

## File Naming Convention

Exported files are automatically named using the following pattern:

```
appraisal-report-[identifier]-[date].[extension]
```

**Identifier Priority**:
1. Custom file name (if provided)
2. File Number from report
3. Property Name from report (sanitized)
4. Falls back to "appraisal-report" only

**Date Format**: YYYY-MM-DD (ISO format)

**Examples**:
- `appraisal-report-VAL-2024-001-2025-12-04.pdf`
- `appraisal-report-north-battleford-apartments-2025-12-04.docx`

## Implementation Details

### File Structure

```
src/features/report-builder/
├── utils/
│   └── exportReport.ts          # Export utility functions
├── components/
│   └── PreviewPanel/
│       ├── PreviewPanel.tsx     # UI with export buttons
│       └── PreviewRenderer.tsx  # Iframe renderer with ref forwarding
```

### Export Functions

#### `exportToPDF(iframeRef, options)`

Exports using browser print dialog.

**Parameters**:
- `iframeRef`: Reference to the preview iframe
- `options`: Export options (fileName, propertyName, fileNumber)

**Returns**: Promise<void>

#### `exportToDOCX(html, options)`

Exports as Word-compatible HTML file.

**Parameters**:
- `html`: The complete HTML content to export
- `options`: Export options (fileName, propertyName, fileNumber)

**Returns**: Promise<void>

#### `exportToHTML(html, options)`

Exports as standalone HTML file.

**Parameters**:
- `html`: The complete HTML content to export
- `options`: Export options (fileName, propertyName, fileNumber)

**Returns**: Promise<void>

#### `exportToPDFDirect(iframeRef, options)`

Alternative PDF export using html2canvas + jsPDF (not currently in UI).

**Parameters**:
- `iframeRef`: Reference to the preview iframe
- `options`: Export options

**Returns**: Promise<void>

**Note**: This method generates PDFs directly without print dialog but may have quality/performance trade-offs.

## User Experience

### Export Workflow

1. User edits report in Report Builder
2. Preview updates in real-time
3. User clicks "PDF" or "DOCX" button in toolbar
4. For PDF: Print dialog opens
   - User selects "Save as PDF"
   - Chooses download location
5. For DOCX: File downloads immediately
6. Toast notification confirms success

### Error Handling

All export functions include:
- Try-catch error handling
- User-friendly error messages via toast notifications
- Console logging for debugging
- Graceful fallbacks

### Loading States

- Export buttons disable during export process
- Loading state prevents multiple simultaneous exports
- Toast notifications provide feedback

## Dependencies

### npm Packages

```json
{
  "jspdf": "^latest",
  "html2canvas": "^latest",
  "docx": "^latest",
  "file-saver": "^latest"
}
```

### Installation

```bash
npm install jspdf html2canvas docx file-saver @types/file-saver
```

## Browser Compatibility

- **PDF Export**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **DOCX Export**: All modern browsers
- **HTML Export**: All modern browsers

**Print Dialog Support**:
- Chrome/Edge: Native PDF generation
- Firefox: Native PDF generation
- Safari: Native PDF generation

## Future Enhancements

Possible improvements:

1. **Direct PDF Download**
   - Add option to skip print dialog
   - Use `exportToPDFDirect()` for one-click download

2. **Export Templates**
   - Allow custom export templates
   - Different formatting for different clients

3. **Batch Export**
   - Export multiple reports at once
   - Zip file downloads

4. **Cloud Storage**
   - Save directly to cloud storage (Dropbox, Google Drive)
   - Email reports directly from app

5. **Export Options Dialog**
   - Custom file names
   - Page range selection
   - Quality settings

6. **Better DOCX Conversion**
   - Use proper DOCX library for better formatting
   - Preserve more advanced styling

## Troubleshooting

### PDF Export Not Working

**Issue**: Print dialog doesn't open
**Solution**:
- Check browser pop-up blocker settings
- Ensure iframe has loaded content
- Try in different browser

### DOCX Formatting Issues

**Issue**: Layout looks different in Word
**Solution**:
- This is expected - HTML to Word conversion has limitations
- User can adjust formatting in Word
- Complex CSS may not translate perfectly

### Large File Downloads

**Issue**: Slow or failing exports for large reports
**Solution**:
- Optimize images before adding to report
- Consider splitting very large reports
- Use direct PDF export instead of print dialog

### File Name Not Updating

**Issue**: Downloaded file has generic name
**Solution**:
- Ensure Property Name or File Number is filled in Cover section
- Check that fields have the correct IDs in the store

## Code Examples

### Adding Export Button

```tsx
import { exportToPDF, getExportOptionsFromSections } from '@/features/report-builder/utils/exportReport';

const handleExportPDF = async () => {
  try {
    setIsExporting(true);
    const options = getExportOptionsFromSections(sections);
    await exportToPDF(iframeRef.current, options);

    toast({
      title: 'Print dialog opened',
      description: 'Select "Save as PDF" to download the report.',
    });
  } catch (error) {
    toast({
      title: 'Export failed',
      description: error.message,
      variant: 'destructive',
    });
  } finally {
    setIsExporting(false);
  }
};
```

### Custom File Name

```tsx
const options: ExportOptions = {
  fileName: 'custom-report-name',
  propertyName: 'Optional Property Name',
  fileNumber: 'VAL-2024-001'
};

await exportToPDF(iframeRef.current, options);
```

## Testing

### Manual Testing Checklist

- [ ] PDF export opens print dialog
- [ ] PDF maintains layout and formatting
- [ ] DOCX downloads successfully
- [ ] DOCX can be opened in Word
- [ ] File names are correct
- [ ] Export buttons disable during export
- [ ] Toast notifications appear
- [ ] Error handling works (try with no preview)
- [ ] Multi-page documents export correctly
- [ ] Images are included in exports

### Browser Testing

Test in:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Support

For issues or questions:
1. Check this guide first
2. Review console errors
3. Test in different browser
4. Check browser console for detailed error messages
