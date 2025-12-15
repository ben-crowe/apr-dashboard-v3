# Mock Report Builder - Architecture Diagram

## High-Level Component Tree

```
MockReportBuilder (Page)
│
└─ ReportBuilderLayout
    │
    ├─ ResizablePanelGroup (horizontal)
    │   │
    │   ├─ ResizablePanel (40%, Edit)
    │   │   │
    │   │   └─ EditPanel
    │   │       │
    │   │       └─ Tabs
    │   │           │
    │   │           ├─ TabsList
    │   │           │   ├─ TabsTrigger (Cover Info)
    │   │           │   ├─ TabsTrigger (Photos)
    │   │           │   └─ TabsTrigger (Summary)
    │   │           │
    │   │           └─ TabsContent
    │   │               │
    │   │               ├─ CoverInfoSection
    │   │               │   ├─ TextFieldEditor (Property Address)
    │   │               │   ├─ TextFieldEditor (Client Name)
    │   │               │   └─ CalculatedFieldDisplay (Report Date)
    │   │               │
    │   │               ├─ PhotosSection
    │   │               │   └─ ImageFieldEditor
    │   │               │       ├─ Draggable Image List
    │   │               │       └─ Add Image Input
    │   │               │
    │   │               └─ SummarySection
    │   │                   ├─ TextFieldEditor (Notes - multiline)
    │   │                   └─ CalculatedFieldDisplay (Photo Count)
    │   │
    │   ├─ ResizableHandle (with grip)
    │   │
    │   └─ ResizablePanel (60%, Preview)
    │       │
    │       └─ PreviewPanel
    │           │
    │           └─ PreviewRenderer
    │               └─ iframe (isolated HTML preview)
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Zustand Store                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ State:                                                │  │
│  │  - sections: ReportSection[]                         │  │
│  │  - activeSection: string                             │  │
│  │  - previewHtml: string                               │  │
│  │  - isDirty: boolean                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Actions:                                              │  │
│  │  - updateFieldValue()                                │  │
│  │  - reorderImages()                                   │  │
│  │  - addImage()                                        │  │
│  │  - removeImage()                                     │  │
│  │  - generatePreview()                                 │  │
│  │  - setActiveSection()                                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ subscribe
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │  Edit    │   │  Preview │   │ Sections │
    │  Panel   │   │  Panel   │   │Components│
    └──────────┘   └──────────┘   └──────────┘
```

## User Interaction Flow

```
┌──────────────┐
│   User       │
└──────┬───────┘
       │
       │ Types in text field
       ▼
┌────────────────────┐
│ TextFieldEditor    │
│ (debounce 300ms)   │
└────────┬───────────┘
         │
         │ After 300ms
         ▼
┌─────────────────────┐
│ updateFieldValue()  │
│ (Zustand action)    │
└────────┬────────────┘
         │
         │ Update state
         ▼
┌─────────────────────┐
│ Update Calculated   │
│ Fields (if needed)  │
└────────┬────────────┘
         │
         │ Trigger
         ▼
┌─────────────────────┐
│ generatePreview()   │
└────────┬────────────┘
         │
         │ Generate HTML
         ▼
┌─────────────────────┐
│ reportHtmlTemplate  │
│ (HTML string)       │
└────────┬────────────┘
         │
         │ Update iframe
         ▼
┌─────────────────────┐
│ PreviewRenderer     │
│ (displays HTML)     │
└─────────────────────┘
```

## Image Drag-Drop Flow

```
┌──────────────┐
│   User       │
└──────┬───────┘
       │
       │ Drags image
       ▼
┌────────────────────┐
│ handleDragStart    │
│ (sets draggedIndex)│
└────────┬───────────┘
         │
         │ Drag over
         ▼
┌────────────────────┐
│ handleDragOver     │
│ (reorder in place) │
└────────┬───────────┘
         │
         │ Immediate (no debounce)
         ▼
┌─────────────────────┐
│ reorderImages()     │
│ (Zustand action)    │
└────────┬────────────┘
         │
         │ Update state
         ▼
┌─────────────────────┐
│ Update Photo Count  │
│ (calculated field)  │
└────────┬────────────┘
         │
         │ Trigger
         ▼
┌─────────────────────┐
│ generatePreview()   │
│ (instant update)    │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Preview updates     │
│ (shows new order)   │
└─────────────────────┘
```

## State Update Patterns

### Pattern 1: Debounced Text Update
```
User Types → [300ms wait] → Update Store → Calculate → Generate Preview → Render
```

### Pattern 2: Immediate Image Update
```
User Drags → Update Store → Calculate → Generate Preview → Render
              (instant)      (instant)    (instant)      (instant)
```

### Pattern 3: Tab Navigation
```
User Clicks Tab → setActiveSection() → Re-render Active Tab Content
                   (instant)           (no preview update)
```

## File Dependencies

```
MockReportBuilder.tsx
├── imports ReportBuilderLayout.tsx
│   ├── imports ResizablePanel components
│   ├── imports EditPanel.tsx
│   │   ├── imports Tabs components
│   │   ├── imports CoverInfoSection.tsx
│   │   │   ├── imports TextFieldEditor.tsx
│   │   │   │   ├── imports debounce.ts
│   │   │   │   └── imports reportBuilderStore.ts
│   │   │   └── imports CalculatedFieldDisplay.tsx
│   │   ├── imports PhotosSection.tsx
│   │   │   └── imports ImageFieldEditor.tsx
│   │   │       └── imports reportBuilderStore.ts
│   │   └── imports SummarySection.tsx
│   │       ├── imports TextFieldEditor.tsx
│   │       └── imports CalculatedFieldDisplay.tsx
│   └── imports PreviewPanel.tsx
│       └── imports PreviewRenderer.tsx
│
└── uses reportBuilderStore.ts
    ├── imports reportBuilder.types.ts
    └── imports reportHtmlTemplate.ts
```

## Store State Machine

```
┌──────────────────┐
│   Uninitialized  │
└────────┬─────────┘
         │
         │ initializeMockData()
         ▼
┌──────────────────┐
│   Initialized    │◄──┐
│   (sections,     │   │
│    previewHtml)  │   │
└────────┬─────────┘   │
         │              │
         │ User edits   │
         ▼              │
┌──────────────────┐   │
│     Dirty        │   │
│  (isDirty: true) │   │
└────────┬─────────┘   │
         │              │
         │ Auto-update  │
         └──────────────┘
```

## Component Responsibilities

### Page Layer
- **MockReportBuilder**: Initialize store, render layout

### Layout Layer
- **ReportBuilderLayout**: Manage split panels, resize behavior

### Panel Layer
- **EditPanel**: Tab navigation, section switching
- **PreviewPanel**: Display preview, loading states

### Section Layer
- **CoverInfoSection**: Render cover fields
- **PhotosSection**: Render photo fields
- **SummarySection**: Render summary fields

### Field Layer
- **TextFieldEditor**: Handle text input, debouncing
- **ImageFieldEditor**: Handle drag-drop, add/remove
- **CalculatedFieldDisplay**: Display read-only calculated values

### Utility Layer
- **PreviewRenderer**: iframe management, HTML rendering
- **previewDebounce**: Debounce utility function
- **reportHtmlTemplate**: HTML generation logic

## Zustand Store Architecture

```
┌─────────────────────────────────────────────┐
│              reportBuilderStore              │
├─────────────────────────────────────────────┤
│ State Management:                           │
│  - sections[] (source of truth)             │
│  - previewHtml (derived from sections)      │
│  - activeSection (UI state)                 │
│  - isDirty (form state)                     │
├─────────────────────────────────────────────┤
│ Computed Values:                            │
│  - Photo count (from photos array)          │
│  - Report date (current date)               │
├─────────────────────────────────────────────┤
│ Actions:                                    │
│  - Field updates (updateFieldValue)         │
│  - Image operations (add/remove/reorder)    │
│  - Preview generation (generatePreview)     │
│  - Initialization (initializeMockData)      │
└─────────────────────────────────────────────┘
```

## Preview Generation Pipeline

```
┌──────────────────┐
│  Store State     │
│  (sections[])    │
└────────┬─────────┘
         │
         ▼
┌──────────────────────┐
│ generateReportHtml() │
│  - Extract fields    │
│  - Build HTML string │
│  - Apply styles      │
└────────┬─────────────┘
         │
         ▼
┌──────────────────┐
│  HTML String     │
│  (with CSS)      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  iframe srcDoc   │
│  (isolated DOM)  │
└──────────────────┘
```

## Technology Stack Integration

```
┌────────────────────────────────────────┐
│           Application Layer            │
│  MockReportBuilder (React Component)   │
└────────────────┬───────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
    ▼            ▼            ▼
┌────────┐  ┌────────┐  ┌──────────┐
│Zustand │  │shadcn/ │  │  React   │
│ Store  │  │   ui   │  │ Router   │
└────────┘  └────────┘  └──────────┘
    │            │            │
    └────────────┼────────────┘
                 │
                 ▼
        ┌────────────────┐
        │   React 18.3   │
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │  Vite Build    │
        └────────────────┘
```

## Performance Optimization Points

1. **Debouncing**: Text inputs use 300ms delay
2. **Selective Updates**: Only re-render changed components
3. **Iframe Isolation**: Prevents style thrashing
4. **Zustand Selectors**: Minimize re-renders
5. **React.memo**: Could be added to field editors
6. **Lazy Loading**: Could be added for sections

## Extension Points

To add new features:

1. **New Field Type**:
   - Add to types
   - Create editor component
   - Update template

2. **New Section**:
   - Add to mock data
   - Create section component
   - Add to tab list

3. **New Action**:
   - Add to store
   - Add to component
   - Update preview

4. **New Calculation**:
   - Add to updateCalculatedFields()
   - Define in field
   - Display in template

## Summary

This architecture provides:
- Clear separation of concerns
- Scalable state management
- Efficient rendering
- Easy extension
- Type safety
- Performance optimization
