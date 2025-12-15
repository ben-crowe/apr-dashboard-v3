# Mock V4 Report Builder Implementation

## Overview

A fully functional mock report builder with split-screen layout, live preview, and drag-and-drop image reordering capabilities. This implementation serves as a proof-of-concept for the full V4 report builder.

## Access

Navigate to: `http://localhost:3000/mock-builder`

## Architecture

### Technology Stack

- **State Management**: Zustand (installed)
- **UI Components**: shadcn/ui (existing)
- **Layout**: react-resizable-panels (existing)
- **Routing**: react-router-dom (existing)
- **Preview**: iframe with srcDoc
- **Debouncing**: Custom implementation (300ms)

### File Structure

```
src/
├── pages/
│   └── MockReportBuilder.tsx           # Main page component
│
└── features/
    └── report-builder/
        ├── components/
        │   ├── ReportBuilderLayout.tsx         # Split-screen layout
        │   ├── EditPanel/
        │   │   ├── EditPanel.tsx               # Edit panel with tabs
        │   │   ├── TextFieldEditor.tsx         # Text input fields
        │   │   ├── ImageFieldEditor.tsx        # Image list with drag-drop
        │   │   └── CalculatedFieldDisplay.tsx  # Read-only calculated fields
        │   ├── PreviewPanel/
        │   │   ├── PreviewPanel.tsx            # Preview container
        │   │   └── PreviewRenderer.tsx         # iframe renderer
        │   └── sections/
        │       ├── CoverInfoSection.tsx        # Cover info tab content
        │       ├── PhotosSection.tsx           # Photos tab content
        │       └── SummarySection.tsx          # Summary tab content
        ├── store/
        │   └── reportBuilderStore.ts           # Zustand state management
        ├── templates/
        │   └── reportHtmlTemplate.ts           # HTML generation
        ├── types/
        │   └── reportBuilder.types.ts          # TypeScript definitions
        └── utils/
            └── previewDebounce.ts              # Debounce utility
```

## Features Implemented

### 1. Split-Screen Layout

- **Resizable panels**: Edit panel (40%) | Preview panel (60%)
- **Draggable handle**: Visual grip handle for resizing
- **Size constraints**: Min 30% / Max 60% for edit panel
- **Responsive**: Maintains proportions on window resize

### 2. Edit Panel

#### Tab Navigation
- Cover Info
- Photos
- Summary

#### Field Types
- **Text fields**: Standard text inputs with debouncing
- **Multiline text**: Textarea for summary notes
- **Image fields**: Drag-and-drop list with reordering
- **Calculated fields**: Read-only auto-calculated values

### 3. Live Preview

- **iframe isolation**: Prevents style conflicts
- **300ms debounce**: Updates after user stops typing
- **Instant updates**: Image reordering triggers immediate preview
- **Full HTML**: Complete styled document preview

### 4. Image Management

- **Drag to reorder**: Visual feedback during drag
- **Add images**: URL input with Enter key support
- **Remove images**: X button to delete
- **Preview integration**: Changes immediately reflected

### 5. Calculated Fields

- **Report Date**: Auto-calculated (current date)
- **Total Photo Count**: Auto-updates as images added/removed
- **Visual distinction**: Muted background, read-only state

## Mock Data

### Cover Info Section
- Property Address: "123 Main Street, Calgary, AB T2P 1J9"
- Client Name: "John Smith"
- Report Date: Auto-calculated (current date)

### Photos Section
- 3 sample property images from Unsplash
- Drag-and-drop to reorder
- Add/remove functionality

### Summary Section
- Summary Notes: Multiline text field
- Total Photo Count: Auto-calculated from photos

## State Management

### Zustand Store Structure

```typescript
interface ReportBuilderState {
  sections: ReportSection[];          // All report sections
  activeSection: string;              // Currently selected tab
  previewHtml: string;                // Generated HTML preview
  isDirty: boolean;                   // Unsaved changes flag

  setActiveSection: (id: string) => void;
  updateFieldValue: (fieldId: string, value: any) => void;
  reorderImages: (fieldId: string, urls: string[]) => void;
  addImage: (fieldId: string, url: string) => void;
  removeImage: (fieldId: string, url: string) => void;
  generatePreview: () => void;
  initializeMockData: () => void;
}
```

### Automatic Updates

The store automatically:
1. Updates calculated fields when dependencies change
2. Regenerates preview on any data change
3. Maintains field relationships (photo count updates)

## Component Interaction

### Data Flow

```
User Input
    ↓
TextFieldEditor (debounced)
    ↓
updateFieldValue (store)
    ↓
Update calculated fields
    ↓
generatePreview (store)
    ↓
PreviewRenderer (iframe)
```

### Drag-and-Drop Flow

```
User drags image
    ↓
handleDragOver
    ↓
reorderImages (store)
    ↓
generatePreview (store)
    ↓
PreviewRenderer updates immediately
```

## Preview HTML Template

The template generates a complete HTML document with:

- Responsive layout
- Professional styling
- Photo grid (auto-fill, min 250px)
- Summary section with notes
- Statistics display
- Empty states for missing content

## Key Implementation Details

### Debouncing Strategy

Text fields use 300ms debounce to prevent excessive re-renders:
- User types continuously: No updates
- User pauses 300ms: Preview regenerates
- Image changes: Immediate update (no debounce)

### Field Editing

- Text fields maintain internal state (uncontrolled)
- Store updates on debounce completion
- Calculated fields never accept user input
- Image operations bypass debouncing for instant feedback

### Preview Isolation

The iframe uses:
- `sandbox="allow-same-origin"` for security
- Direct document write for performance
- srcDoc updates trigger re-render
- No external script execution

## Performance Characteristics

### Build Output
- Bundle size: 937.44 kB (354.07 kB gzipped)
- Build successful with no errors
- All TypeScript types properly defined

### Runtime Performance
- Debounced updates prevent excessive rendering
- Zustand provides efficient state updates
- iframe isolation prevents layout thrashing
- Drag operations use optimistic updates

## Browser Compatibility

Tested features:
- iframe srcDoc (modern browsers)
- CSS Grid (modern browsers)
- Drag-and-drop API (modern browsers)
- ResizeObserver (via react-resizable-panels)

## Future Enhancements

Potential additions for full V4:
1. Save/load functionality
2. Export to PDF
3. Section templates
4. Field validation
5. Undo/redo
6. Real-time collaboration
7. Image upload (not just URLs)
8. Rich text editing
9. Custom field types
10. Template management

## Testing Recommendations

Manual test checklist:
- [ ] Navigate to /mock-builder
- [ ] Edit property address, see preview update
- [ ] Edit client name, see preview update
- [ ] Edit summary notes (multiline), see preview update
- [ ] Switch between tabs
- [ ] Drag images to reorder, see preview update
- [ ] Add new image URL, press Enter
- [ ] Remove an image, see count update
- [ ] Resize panels with handle
- [ ] Verify report date shows current date
- [ ] Verify photo count updates automatically

## Key Files

### Entry Point
- `/src/pages/MockReportBuilder.tsx` - Initialize and render

### Core Logic
- `/src/features/report-builder/store/reportBuilderStore.ts` - State management
- `/src/features/report-builder/templates/reportHtmlTemplate.ts` - HTML generation

### Main Components
- `/src/features/report-builder/components/ReportBuilderLayout.tsx` - Split layout
- `/src/features/report-builder/components/EditPanel/EditPanel.tsx` - Edit interface
- `/src/features/report-builder/components/PreviewPanel/PreviewPanel.tsx` - Preview display

### Field Editors
- `/src/features/report-builder/components/EditPanel/TextFieldEditor.tsx` - Text inputs
- `/src/features/report-builder/components/EditPanel/ImageFieldEditor.tsx` - Image management
- `/src/features/report-builder/components/EditPanel/CalculatedFieldDisplay.tsx` - Auto-calculated

## Notes

- All components use TypeScript strict mode
- shadcn/ui components ensure consistent styling
- Zustand provides simple, performant state management
- Desktop-first design (mobile responsive features not implemented)
- Mock data only (no backend integration)
- 3 sections demonstrate the pattern for full 330+ fields

## Route Configuration

Added to `/src/App.tsx`:
```typescript
<Route path="/mock-builder" element={<MockReportBuilder />} />
```

## Dependencies Added

- `zustand@latest` - Lightweight state management

No other dependencies required (all others already in project).
