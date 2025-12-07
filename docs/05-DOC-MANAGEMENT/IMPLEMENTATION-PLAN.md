# File Previewer Implementation Plan

## Phase 1: Core Components (Week 1)

### 1.1 Base FilePreviewModal Component
**Reference**: LOEPreviewModal.tsx lines 122-282
- Create modal container with header, content, and footer sections
- Implement modal open/close state management
- Add keyboard shortcuts (Escape to close, Ctrl/Cmd + Plus/Minus for zoom)

### 1.2 Zoom Controls Implementation
**Direct from LOE Modal** (lines 131-169):
```typescript
// State management
const [zoomLevel, setZoomLevel] = useState(75);

// Zoom control functions
const handleZoomIn = () => setZoomLevel(Math.min(200, zoomLevel + 10));
const handleZoomOut = () => setZoomLevel(Math.max(25, zoomLevel - 10));
const handleResetZoom = () => setZoomLevel(75);

// Apply zoom via CSS (lines 46-76)
const scaledHTML = documentHTML.replace(
  '</head>',
  `<style>
    body {
      zoom: ${zoomLevel / 100};
      transform: scale(${0.9 + (zoomLevel / 100 - 0.75) * 0.5});
      transform-origin: top center;
    }
  </style></head>`
);
```

### 1.3 File Type Detection System
```typescript
const getFileViewer = (file: UploadedFile) => {
  const ext = file.filename.split('.').pop()?.toLowerCase();
  
  // Images
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'heic'].includes(ext)) {
    return <ImageViewer file={file} zoomLevel={zoomLevel} />;
  }
  
  // PDFs
  if (ext === 'pdf') {
    return <PDFViewer file={file} zoomLevel={zoomLevel} />;
  }
  
  // Documents (fallback)
  return <DocumentViewer file={file} />;
};
```

## Phase 2: Viewer Components (Week 1-2)

### 2.1 ImageViewer Component
**Features from Resources**:
- Pan and drag when zoomed (react-zoom-pan-pinch)
- Rotation controls (90° increments)
- Full-screen mode toggle
- Touch gesture support for mobile

```typescript
interface ImageViewerProps {
  file: UploadedFile;
  zoomLevel: number;
  onZoomChange: (level: number) => void;
}

// Implementation with zoom and pan
<TransformWrapper
  initialScale={zoomLevel / 100}
  minScale={0.25}
  maxScale={3}
>
  <TransformComponent>
    <img src={file.url} alt={file.filename} />
  </TransformComponent>
</TransformWrapper>
```

### 2.2 PDFViewer Component
**Using react-pdf library**:
```typescript
import { Document, Page } from 'react-pdf';

const PDFViewer = ({ file, zoomLevel }) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <Document
      file={file.url}
      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
    >
      <Page 
        pageNumber={currentPage}
        scale={zoomLevel / 100}
        renderMode="canvas"
      />
    </Document>
  );
};
```

### 2.3 Navigation Controls
**For multi-page documents**:
- Previous/Next page buttons
- Page number input (jump to page)
- Current page indicator (Page X of Y)
- Thumbnail sidebar (optional enhancement)

## Phase 3: Integration (Week 2)

### 3.1 Update Section4Compact.tsx
Replace current preview implementation with new modal:
```typescript
// Current (line 476)
onClick={() => window.open(url, "_blank")}

// New implementation
onClick={() => openFilePreview(file)}
```

### 3.2 Create Preview Context
```typescript
const FilePreviewContext = React.createContext({
  openPreview: (file: UploadedFile) => {},
  closePreview: () => {},
  currentFile: null,
  isOpen: false
});
```

### 3.3 Update All File Upload Components
- FileUpload.tsx
- UploadedDocumentsSection.tsx
- MultiDocumentUpload.tsx
- Any component with file preview buttons

## Phase 4: Mobile Optimization (Week 2-3)

### 4.1 Touch Gestures
- Pinch to zoom for images
- Swipe to navigate pages
- Double-tap to zoom

### 4.2 Responsive Layout
```typescript
// Adapt zoom controls for mobile
const isMobile = useMediaQuery('(max-width: 768px)');
const defaultZoom = isMobile ? 100 : 75;
```

### 4.3 Performance Optimization
- Lazy load viewer components
- Progressive PDF loading
- Image thumbnail generation
- Memory cleanup on unmount

## Technical Architecture

### Component Structure
```
04-FilePreviewer/
├── components/
│   ├── FilePreviewModal.tsx           // Main modal container
│   ├── viewers/
│   │   ├── ImageViewer.tsx           // Image-specific viewer
│   │   ├── PDFViewer.tsx             // PDF-specific viewer
│   │   └── DocumentViewer.tsx        // Fallback viewer
│   ├── controls/
│   │   ├── ZoomControls.tsx          // Reusable zoom UI
│   │   ├── NavigationControls.tsx    // Page navigation
│   │   └── ToolbarControls.tsx       // Download/Print/Share
│   └── hooks/
│       ├── useFilePreview.ts         // Preview state management
│       ├── useZoom.ts                // Zoom logic
│       └── useKeyboardShortcuts.ts   // Keyboard navigation
```

### Dependencies to Install
```bash
npm install @react-pdf-viewer/core react-pdf pdfjs-dist
npm install react-zoom-pan-pinch
npm install react-intersection-observer  # For lazy loading
```

## Implementation Checklist

### Week 1 Tasks
- [ ] Create FilePreviewModal base component
- [ ] Implement zoom controls (copy from LOE Modal)
- [ ] Add file type detection
- [ ] Create ImageViewer with basic zoom
- [ ] Set up modal open/close logic

### Week 2 Tasks
- [ ] Add PDFViewer with page navigation
- [ ] Implement pan/drag for images
- [ ] Add rotation controls
- [ ] Create keyboard shortcuts
- [ ] Update existing preview buttons

### Week 3 Tasks
- [ ] Add mobile touch gestures
- [ ] Optimize performance
- [ ] Add loading states
- [ ] Implement error handling
- [ ] Create share link functionality

### Week 4 Tasks
- [ ] Full integration testing
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Documentation
- [ ] Deploy to production

## Testing Strategy

### Unit Tests
```typescript
describe('FilePreviewModal', () => {
  test('opens with correct file', () => {});
  test('zoom controls work within bounds', () => {});
  test('keyboard shortcuts trigger zoom', () => {});
  test('closes on escape key', () => {});
});
```

### Integration Tests
- Test with Section4Compact document uploads
- Verify all file types preview correctly
- Test navigation between multiple files
- Ensure zoom persists during session

### E2E Tests
- Complete upload → preview → download flow
- Test on mobile devices
- Verify touch gestures work
- Cross-browser compatibility

## Success Metrics

### Performance Targets
- Modal open time: < 200ms
- Image load time: < 500ms
- PDF first page render: < 1s
- Zoom response: < 50ms

### User Experience Goals
- Zero external tabs opened
- All files viewable in-app
- Smooth zoom and pan
- Mobile-friendly interface

## Risk Mitigation

### Potential Issues
1. **Large PDF files**: Implement progressive loading
2. **Mobile memory constraints**: Add image optimization
3. **Browser compatibility**: Test PDF.js fallbacks
4. **Slow networks**: Add loading indicators

### Fallback Strategies
- If preview fails → Show download option
- If PDF.js fails → Use iframe fallback
- If zoom causes lag → Reduce quality temporarily

## Next Steps

1. **Immediate Action**: Install dependencies
2. **First Component**: Create FilePreviewModal.tsx
3. **Copy Zoom Logic**: Port from LOEPreviewModal
4. **Test Integration**: Update one upload button first
5. **Iterate**: Add viewers incrementally

## Notes from Resources

### From LOE Modal
- Default zoom: 75%
- Zoom range: 25-200%
- 10% increments work well
- CSS zoom + transform scale for best results

### From PreviewRenderer.tsx
- Virtual scrolling for performance (react-window)
- Page-by-page rendering for PDFs
- Highlight active sections
- Thumbnail navigation

### From ImageManager.tsx
- Drag-and-drop reordering
- Category filtering
- Upload progress tracking
- Image optimization before upload

---

*This plan incorporates the working zoom implementation from LOEPreviewModal and best practices from the resource components.*