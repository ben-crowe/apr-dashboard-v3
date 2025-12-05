# Export UI Reference

## Button Placement

The export buttons are located in the Preview Panel toolbar, to the right of the zoom controls:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Live Preview                                                             │
│ Updates automatically as you edit                                       │
├─────────────────────────────────────────────────────────────────────────┤
│ Zoom: [-] ━━━━━━●━━━━━━━ [+] 75%  │  [📄 PDF]  [📥 DOCX]              │
└─────────────────────────────────────────────────────────────────────────┘
```

## Button Specifications

### PDF Button
- **Label**: "PDF"
- **Icon**: FileDown (lucide-react)
- **Variant**: outline
- **Size**: sm
- **Action**: Opens browser print dialog
- **Tooltip**: "Export as PDF (opens print dialog)"

### DOCX Button
- **Label**: "DOCX"
- **Icon**: Download (lucide-react)
- **Variant**: outline
- **Size**: sm
- **Action**: Downloads Word-compatible file
- **Tooltip**: "Export as Word document"

## Visual States

### Normal State
```tsx
<Button variant="outline" size="sm">
  <FileDown className="h-4 w-4 mr-1" />
  PDF
</Button>
```

### Disabled State
Buttons are disabled when:
- Export is in progress (`isExporting === true`)
- No preview is available (`!previewHtml`)

```tsx
<Button variant="outline" size="sm" disabled>
  <FileDown className="h-4 w-4 mr-1" />
  PDF
</Button>
```

## Complete Toolbar Code

```tsx
<div className="px-6 py-3 border-t bg-background/50 flex items-center gap-4">
  {/* Zoom Label */}
  <span className="text-sm text-muted-foreground font-medium min-w-[60px]">
    Zoom:
  </span>

  {/* Zoom Out Button */}
  <Button
    variant="outline"
    size="icon"
    onClick={handleZoomOut}
    disabled={zoom <= 25}
    className="h-8 w-8"
    title="Zoom out"
  >
    <ZoomOut className="h-4 w-4" />
  </Button>

  {/* Zoom Slider */}
  <div className="flex-1 max-w-xs">
    <Slider
      value={[zoom]}
      onValueChange={handleSliderChange}
      min={25}
      max={150}
      step={25}
      className="cursor-pointer"
    />
  </div>

  {/* Zoom In Button */}
  <Button
    variant="outline"
    size="icon"
    onClick={handleZoomIn}
    disabled={zoom >= 150}
    className="h-8 w-8"
    title="Zoom in"
  >
    <ZoomIn className="h-4 w-4" />
  </Button>

  {/* Zoom Percentage */}
  <span className="text-sm font-semibold min-w-[50px] text-right">
    {zoom}%
  </span>

  {/* Divider */}
  <div className="h-4 w-px bg-border mx-2" />

  {/* PDF Export Button */}
  <Button
    variant="outline"
    size="sm"
    onClick={handleExportPDF}
    disabled={isExporting || !previewHtml}
    title="Export as PDF (opens print dialog)"
  >
    <FileDown className="h-4 w-4 mr-1" />
    PDF
  </Button>

  {/* DOCX Export Button */}
  <Button
    variant="outline"
    size="sm"
    onClick={handleExportDOCX}
    disabled={isExporting || !previewHtml}
    title="Export as Word document"
  >
    <Download className="h-4 w-4 mr-1" />
    DOCX
  </Button>
</div>
```

## Toast Notifications

### PDF Export Success
```tsx
toast({
  title: 'Print dialog opened',
  description: 'Select "Save as PDF" to download the report.',
});
```

Appears as:
```
┌─────────────────────────────────────────┐
│ Print dialog opened                      │
│ Select "Save as PDF" to download the     │
│ report.                                  │
└─────────────────────────────────────────┘
```

### DOCX Export Success
```tsx
toast({
  title: 'Export successful',
  description: 'DOCX file has been downloaded.',
});
```

Appears as:
```
┌─────────────────────────────────────────┐
│ Export successful                        │
│ DOCX file has been downloaded.           │
└─────────────────────────────────────────┘
```

### Export Error
```tsx
toast({
  title: 'Export failed',
  description: error.message,
  variant: 'destructive',
});
```

Appears as:
```
┌─────────────────────────────────────────┐
│ ⚠ Export failed                         │
│ Preview iframe not available             │
└─────────────────────────────────────────┘
```

## Responsive Behavior

The toolbar is designed to be responsive:

- On wider screens: All controls visible in single row
- On narrower screens: May need to add responsive wrapping
- Export buttons maintain consistent spacing
- Icons scale appropriately with button size

## Accessibility

- **Keyboard Navigation**: Buttons are keyboard accessible (Tab/Enter)
- **Tooltips**: Clear descriptions via title attribute
- **Disabled States**: Visual feedback when buttons can't be used
- **Icons + Text**: Both visual and text labels for clarity
- **Focus States**: Proper focus indicators for keyboard users

## User Interaction Flow

### PDF Export Flow
1. User clicks "PDF" button
2. Button becomes disabled
3. Print dialog opens
4. Toast notification appears
5. User selects "Save as PDF" in print dialog
6. User chooses location and saves
7. Button re-enables

### DOCX Export Flow
1. User clicks "DOCX" button
2. Button becomes disabled
3. File downloads immediately
4. Toast notification appears
5. Button re-enables

## Styling Details

### Tailwind Classes Used

**Buttons**:
- `variant="outline"` - Outlined style (not filled)
- `size="sm"` - Small size for toolbar
- `disabled` - Gray out when not available

**Icons**:
- `className="h-4 w-4 mr-1"` - 16px size, 4px right margin

**Divider**:
- `className="h-4 w-px bg-border mx-2"` - Vertical line, 8px horizontal margins

**Container**:
- `className="px-6 py-3 border-t bg-background/50 flex items-center gap-4"`
- Padding, border, background, flexbox layout, 16px gaps

## Dark Mode Support

All components support dark mode:
- Border colors adapt automatically
- Background colors use theme variables
- Icons use theme colors
- Toast notifications support dark mode
- Button variants work in both modes

## Icon Reference

### FileDown (lucide-react)
```
 ┌─┐
 │ │
 │ │
 └─┘
  ↓
```
Used for PDF export (save/download action)

### Download (lucide-react)
```
  ↓
 ━━━
```
Used for DOCX export (direct download)

### ZoomOut (lucide-react)
```
 ╔═══╗
 ║ - ║
 ╚═══╝
```

### ZoomIn (lucide-react)
```
 ╔═══╗
 ║ + ║
 ╚═══╝
```

## Color Scheme

Following shadcn/ui design system:

- **Borders**: `border` - Subtle separator color
- **Background**: `bg-background/50` - Semi-transparent background
- **Text**: `text-muted-foreground` - Secondary text color
- **Buttons**: `outline` variant uses border + background on hover
- **Destructive**: Red tones for error toasts

## Testing Checklist

Visual testing:
- [ ] Buttons appear in correct position
- [ ] Icons display properly
- [ ] Divider is visible between sections
- [ ] Spacing is consistent
- [ ] Hover states work correctly
- [ ] Disabled states are visually clear
- [ ] Toast notifications appear and are readable
- [ ] Dark mode looks good
- [ ] Responsive layout works on different screen sizes
- [ ] Focus states are visible for keyboard navigation

## Screenshots Needed

For documentation, capture:
1. Normal state with both buttons
2. Disabled state
3. Hover state on each button
4. PDF toast notification
5. DOCX toast notification
6. Error toast notification
7. Dark mode version
8. Full preview panel with export buttons
