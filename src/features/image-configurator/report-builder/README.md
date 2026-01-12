# Report Builder Feature

A mock V4 report builder implementation demonstrating split-screen editing with live preview.

## Quick Start

```bash
# Navigate to the mock builder
http://localhost:3000/mock-builder
```

## Features

- **Split-screen layout** with resizable panels
- **Live preview** with 300ms debouncing on text edits
- **Drag-and-drop** image reordering
- **Calculated fields** that auto-update
- **Tab navigation** between sections
- **Professional HTML preview** with styling

## Architecture

### State Management

Uses Zustand for lightweight, performant state management:

```typescript
import { useReportBuilderStore } from './store/reportBuilderStore';

// In components
const sections = useReportBuilderStore((state) => state.sections);
const updateField = useReportBuilderStore((state) => state.updateFieldValue);
```

### Component Structure

```
components/
├── ReportBuilderLayout.tsx       # Main split layout
├── EditPanel/
│   ├── EditPanel.tsx             # Tab navigation
│   ├── TextFieldEditor.tsx       # Text inputs (debounced)
│   ├── ImageFieldEditor.tsx      # Image drag-drop
│   └── CalculatedFieldDisplay.tsx # Read-only fields
├── PreviewPanel/
│   ├── PreviewPanel.tsx          # Preview container
│   └── PreviewRenderer.tsx       # iframe rendering
└── sections/
    ├── CoverInfoSection.tsx      # Cover info fields
    ├── PhotosSection.tsx         # Photo management
    └── SummarySection.tsx        # Summary fields
```

### Data Flow

```
User Input → Field Editor → Store Action → State Update → Preview Regeneration → iframe Render
```

## Mock Sections

### 1. Cover Info
- Property Address (text, editable)
- Client Name (text, editable)
- Report Date (calculated, auto-updated)

### 2. Photos
- Property Photos (image array, drag-drop reordering)
- Add/remove images
- 3 sample Unsplash images

### 3. Summary
- Summary Notes (multiline text, editable)
- Total Photo Count (calculated from photos)

## Usage Examples

### Updating a Field

```typescript
// In a component
const updateFieldValue = useReportBuilderStore((state) => state.updateFieldValue);

updateFieldValue('property-address', '456 New Street');
```

### Adding an Image

```typescript
const addImage = useReportBuilderStore((state) => state.addImage);

addImage('property-photos', 'https://example.com/image.jpg');
```

### Reordering Images

```typescript
const reorderImages = useReportBuilderStore((state) => state.reorderImages);

const newOrder = ['url3', 'url1', 'url2'];
reorderImages('property-photos', newOrder);
```

## Key Files

### Store
- `store/reportBuilderStore.ts` - Zustand state management
- `types/reportBuilder.types.ts` - TypeScript definitions

### Templates
- `templates/reportHtmlTemplate.ts` - HTML preview generation

### Utilities
- `utils/previewDebounce.ts` - Debounce utility

## Performance

- **Text edits**: 300ms debounce prevents excessive re-renders
- **Image operations**: Immediate updates for instant feedback
- **Preview rendering**: Efficient iframe updates
- **State updates**: Optimized with Zustand selectors

## Extending

### Add a New Section

1. Create section component:
```typescript
// components/sections/NewSection.tsx
export default function NewSection() {
  const sections = useReportBuilderStore((state) => state.sections);
  const section = sections.find((s) => s.id === 'new-section');
  // Render fields...
}
```

2. Add to mock data in store:
```typescript
{
  id: 'new-section',
  name: 'New Section',
  fields: [/* field definitions */]
}
```

3. Add tab in EditPanel:
```typescript
<TabsTrigger value="new-section">New Section</TabsTrigger>
<TabsContent value="new-section">
  <NewSection />
</TabsContent>
```

4. Update HTML template to render new section.

### Add a New Field Type

1. Define type in `types/reportBuilder.types.ts`:
```typescript
export type FieldType = 'text' | 'number' | 'date' | 'image' | 'calculated' | 'your-new-type';
```

2. Create editor component:
```typescript
// components/EditPanel/YourFieldEditor.tsx
export default function YourFieldEditor({ field }: { field: ReportField }) {
  // Implementation...
}
```

3. Use in section component:
```typescript
{field.type === 'your-new-type' && <YourFieldEditor field={field} />}
```

4. Handle in store actions and template.

## Testing

### Manual Testing
- Navigate to `/mock-builder`
- Edit fields and verify preview updates
- Drag-drop images and verify order
- Switch tabs and verify content
- Resize panels and verify behavior

### Automated Testing
```bash
# Run TypeScript check
npm run build

# Run linting
npm run lint
```

## Troubleshooting

### Preview not updating
- Verify 300ms has passed after typing
- Check browser console for errors
- Ensure field ID matches store data

### Images not loading
- Verify image URL is valid
- Check CORS policy
- Try Unsplash URLs (CORS-friendly)

### TypeScript errors
- Ensure all types are imported
- Check field definitions match types
- Run `npm run build` to verify

## Future Enhancements

Potential additions for full V4:
1. Real 330+ field schema
2. Backend persistence (Supabase)
3. PDF export functionality
4. Image upload (not just URLs)
5. Rich text editing
6. Field validation
7. Template management
8. Undo/redo functionality
9. Real-time collaboration
10. Accessibility improvements

## Documentation

Full documentation available in `/docs/15-Contract-review/`:
- `MOCK-REPORT-BUILDER-IMPLEMENTATION.md` - Technical details
- `QUICK-START-GUIDE.md` - Getting started
- `ARCHITECTURE-DIAGRAM.md` - Visual architecture
- `VERIFICATION-CHECKLIST.md` - Testing checklist

## Dependencies

- **zustand** - State management
- **react-resizable-panels** - Split layout
- **@radix-ui/react-tabs** - Tab navigation
- **shadcn/ui** - UI components

## License

Part of APR Dashboard v3 project.
