# Export Functionality - Quick Reference

## For Users

### How to Export PDF
1. Click the "PDF" button in the preview toolbar
2. Wait for print dialog to open
3. Select "Save as PDF" as the printer
4. Choose download location
5. Click "Save"

### How to Export DOCX
1. Click the "DOCX" button in the preview toolbar
2. File downloads automatically
3. Open in Microsoft Word to edit

### File Names
Files are automatically named:
- `appraisal-report-[property-name]-[date].pdf`
- `appraisal-report-VAL-2024-001-2025-12-04.docx`

## For Developers

### Quick Setup
```bash
# Already installed
npm install jspdf html2canvas docx file-saver @types/file-saver
```

### Import and Use
```tsx
import {
  exportToPDF,
  exportToDOCX,
  getExportOptionsFromSections,
} from '@/features/report-builder/utils/exportReport';

// In component
const handleExportPDF = async () => {
  const options = getExportOptionsFromSections(sections);
  await exportToPDF(iframeRef.current, options);
};

const handleExportDOCX = async () => {
  const options = getExportOptionsFromSections(sections);
  await exportToDOCX(previewHtml, options);
};
```

### Available Functions
| Function | Purpose | Input | Output |
|----------|---------|-------|--------|
| `exportToPDF()` | Print dialog export | iframe ref | Promise<void> |
| `exportToDOCX()` | Word export | HTML string | Promise<void> |
| `exportToHTML()` | HTML file export | HTML string | Promise<void> |
| `exportToPDFDirect()` | Direct PDF (no dialog) | iframe ref | Promise<void> |
| `getExportOptionsFromSections()` | Extract metadata | sections array | ExportOptions |

### File Locations
```
src/features/report-builder/
├── utils/
│   └── exportReport.ts              # Export functions
├── components/
│   └── PreviewPanel/
│       ├── PreviewPanel.tsx         # UI with buttons
│       └── PreviewRenderer.tsx      # Iframe with ref
├── EXPORT_GUIDE.md                  # Full documentation
├── EXPORT_UI_REFERENCE.md           # UI specs
└── EXPORT_QUICK_REFERENCE.md        # This file
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Print dialog doesn't open | Check pop-up blocker |
| DOCX formatting looks wrong | This is normal - adjust in Word |
| File name is generic | Add property name or file number to report |
| Export button disabled | Wait for preview to load |
| Error message appears | Check console for details |

## Browser Support
- Chrome/Chromium: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Edge: ✅ Full support

## Key Features
- Smart file naming based on report data
- Error handling with toast notifications
- Loading states prevent duplicate exports
- Multi-page document support
- Image preservation in exports
- Browser print dialog for PDF
- Word-compatible DOCX format

## Testing Checklist
- [ ] PDF export works
- [ ] DOCX export works
- [ ] File names are correct
- [ ] Multi-page reports export fully
- [ ] Images are included
- [ ] Error handling works
- [ ] Toast notifications appear
- [ ] Works in all browsers

## Need More Info?
- Full guide: `EXPORT_GUIDE.md`
- UI reference: `EXPORT_UI_REFERENCE.md`
- Implementation: `EXPORT_IMPLEMENTATION_SUMMARY.md`
- Code: `src/features/report-builder/utils/exportReport.ts`
