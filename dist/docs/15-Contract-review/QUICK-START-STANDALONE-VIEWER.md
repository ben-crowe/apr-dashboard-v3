# Quick Start: Standalone Report Viewer

## One-Line Commands

### Generate the viewer
```bash
npm run generate-viewer
```

### Open in browser
```bash
open docs/15-Contract-review/standalone-viewer.html
```

### Export to PDF
1. Open the HTML file in browser (command above)
2. Click "Export to PDF" button in the navigation bar
3. OR use: File → Print → Save as PDF

## What This Does

Generates a single HTML file containing all 78 rendered report pages:
- Pages 01-09, 11-79 (page 10 is missing in original report)
- Full styling and layout
- Minimal mock data (fields show as empty if no data)
- Ready for visual comparison against reference PDF

## File Locations

- **Generated HTML**: `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/standalone-viewer.html`
- **Build Script**: `/Users/bencrowe/Development/APR-Dashboard-v3/scripts/generate-standalone-viewer.ts`
- **Full README**: `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/STANDALONE-VIEWER-README.md`

## Success Criteria

When you open the HTML file, you should see:
- Navigation bar at top showing "78 Pages (01-09, 11-79)"
- Blue "Export to PDF" button
- All pages stacked vertically with page number indicators
- Each page should be ~8.5" × 11" in print preview

## Next Steps After Verification

1. Compare generated PDF against reference report
2. Document any layout/styling discrepancies
3. Make corrections to `reportPageTemplates.ts` if needed
4. Regenerate viewer with `npm run generate-viewer`
5. Once satisfied, integrate into main Report Builder

## Important Notes

- This viewer is NOT connected to the main application
- It uses the SAME render functions that will be used in production
- Changes to `reportPageTemplates.ts` require regenerating the viewer
- The viewer automatically updates when you run `npm run generate-viewer`

## Troubleshooting

**Issue**: Script fails
**Fix**: Run `npm install` to ensure all dependencies are installed

**Issue**: PDF cuts off content
**Fix**: In print dialog, set margins to "None" and enable "Background graphics"

**Issue**: Pages look empty
**Fix**: This is expected - the viewer uses minimal mock data. Add more test data in `generate-standalone-viewer.ts` if needed.

---

For detailed documentation, see `STANDALONE-VIEWER-README.md`
