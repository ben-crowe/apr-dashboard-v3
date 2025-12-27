# File Previewer System - APR Dashboard

## Project Overview
Custom in-app file preview system with zoom controls, navigation, and comprehensive viewer for all document types. This replaces basic browser preview with a sophisticated viewer that keeps users within the APR Dashboard.

## Current State
The APR Dashboard currently has:
- Basic file upload functionality 
- Simple Dialog modals that open files in new tabs
- No zoom controls for general files
- LOE Preview Modal with zoom (can be used as reference)

## Core Requirements

### Supported File Types
1. **Images**: JPG, JPEG, PNG, GIF, BMP, WebP, HEIC
2. **Documents**: PDF
3. **Spreadsheets**: Excel (view only)
4. **Text**: Word documents (view only)

### Essential Features

#### 1. Universal Preview Modal
- Single modal component that handles all file types
- Intelligent file type detection and appropriate viewer selection
- Consistent UI across all file types
- Smooth transitions between files

#### 2. Zoom Controls (Priority Feature)
Based on LOE Preview implementation:
- Zoom In/Out buttons (10% increments)
- Current zoom level display
- Reset zoom button (default 75-100% depending on file)
- Zoom range: 25% to 200%
- Keyboard shortcuts: Ctrl/Cmd + Plus/Minus

#### 3. Image Viewer Features
- Pan and drag when zoomed in
- Rotate image (90° increments)
- Full-screen mode
- Previous/Next navigation for multiple images
- Thumbnail strip for image galleries

#### 4. PDF Viewer Features
- Page navigation (Previous/Next/Go to page)
- Current page indicator (Page X of Y)
- Thumbnail sidebar (optional)
- Search within PDF (future enhancement)
- Download original PDF

#### 5. UI/UX Requirements
- Non-blocking modal (can interact with background)
- Smooth animations and transitions
- Loading states with progress indicators
- Error states with helpful messages
- Mobile responsive with touch gestures

## Implementation Strategy

### Phase 1: Core Infrastructure
1. Create base `FilePreviewModal` component
2. Implement file type detection system
3. Setup zoom state management
4. Create loading and error states

### Phase 2: Image Viewer
1. Implement image rendering with zoom
2. Add pan/drag functionality
3. Add rotation controls
4. Implement keyboard navigation

### Phase 3: PDF Viewer
1. Integrate PDF.js or react-pdf
2. Implement page navigation
3. Add zoom synchronization
4. Create page thumbnails

### Phase 4: Enhancement
1. Add full-screen mode
2. Implement touch gestures for mobile
3. Add print functionality
4. Create share link generation

## Technical Architecture

### Component Structure
```
04-FilePreviewer/
├── components/
│   ├── FilePreviewModal.tsx       // Main modal container
│   ├── viewers/
│   │   ├── ImageViewer.tsx        // Image-specific viewer
│   │   ├── PDFViewer.tsx          // PDF-specific viewer
│   │   └── DocumentViewer.tsx     // Fallback viewer
│   ├── controls/
│   │   ├── ZoomControls.tsx       // Zoom in/out/reset
│   │   ├── NavigationControls.tsx // Previous/Next/Page
│   │   └── ToolbarControls.tsx    // Download/Print/Share
│   └── utils/
│       ├── fileTypeDetector.ts    // Detect file type
│       ├── zoomCalculator.ts      // Zoom calculations
│       └── previewGenerator.ts    // Generate previews
```

### State Management
```typescript
interface FilePreviewState {
  isOpen: boolean;
  currentFile: {
    id: string;
    name: string;
    url: string;
    type: 'image' | 'pdf' | 'document' | 'other';
    size: number;
  } | null;
  zoomLevel: number; // 25-200
  currentPage: number; // For PDFs
  totalPages: number; // For PDFs
  rotation: number; // 0, 90, 180, 270
  isLoading: boolean;
  error: string | null;
}
```

### Required Dependencies
```json
{
  "dependencies": {
    "@react-pdf-viewer/core": "^3.x",     // PDF rendering
    "react-pdf": "^7.x",                   // Alternative PDF library
    "pdfjs-dist": "^3.x",                  // PDF.js for advanced features
    "react-zoom-pan-pinch": "^3.x",       // Image zoom/pan controls
    "react-use": "^17.x",                 // Utility hooks
    "lucide-react": "latest"               // Icons
  }
}
```

## Integration Points

### 1. File Upload Components
- `FileUpload.tsx` - Add preview button to uploaded files
- `UploadedDocumentsSection.tsx` - Replace `window.open()` with preview modal
- `Section4Compact.tsx` - Integrate preview for document fields
- `MultiDocumentUpload.tsx` - Add preview icons

### 2. Existing Preview References
- `LOEPreviewModal.tsx` - Reference implementation for zoom controls
- Current Dialog components - Replace with new preview modal

### 3. API Integration
- Supabase Storage URLs - Handle signed URLs for preview
- File metadata from database - Display file information

## Code Examples

### Zoom Implementation (from LOE Modal)
```typescript
const [zoomLevel, setZoomLevel] = useState(75);

// Zoom controls
const handleZoomIn = () => setZoomLevel(Math.min(200, zoomLevel + 10));
const handleZoomOut = () => setZoomLevel(Math.max(25, zoomLevel - 10));
const handleResetZoom = () => setZoomLevel(75);

// Apply zoom via CSS
const zoomStyle = {
  zoom: zoomLevel / 100,
  transform: `scale(${zoomLevel / 100})`,
  transformOrigin: 'top center'
};
```

### File Type Detection
```typescript
const detectFileType = (filename: string): FileType => {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '')) {
    return 'image';
  }
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx'].includes(ext || '')) return 'document';
  if (['xls', 'xlsx'].includes(ext || '')) return 'spreadsheet';
  
  return 'other';
};
```

## Testing Requirements

### Unit Tests
- File type detection accuracy
- Zoom calculations and boundaries
- State management transitions
- Error handling scenarios

### Integration Tests
- Modal opening/closing
- File loading from Supabase
- Navigation between files
- Zoom persistence

### E2E Tests
- Complete user flow from upload to preview
- Mobile touch gestures
- Keyboard navigation
- Cross-browser compatibility

## Performance Considerations

1. **Lazy Loading**: Load viewer components only when needed
2. **Image Optimization**: Generate thumbnails for large images
3. **PDF Streaming**: Load PDF pages on demand
4. **Memory Management**: Cleanup blob URLs and event listeners
5. **Caching**: Cache previewed files for session

## Future Enhancements

1. **Annotation Tools**: Draw, highlight, comment on documents
2. **Collaborative Features**: Share preview sessions
3. **OCR Integration**: Search within scanned documents
4. **Video Support**: Preview video files with controls
5. **3D Model Viewer**: For CAD/3D files
6. **Office Integration**: Better Word/Excel rendering
7. **Comparison Mode**: Side-by-side file comparison

## 🚨 CURRENT STATUS: READY BUT NOT INTEGRATED

**Status as of**: November 2024
- ✅ Base FilePreviewModal component created with zoom controls
- ✅ Zoom implementation copied from LOE Preview Modal (working code)
- ✅ File type detection and basic viewers implemented
- ❌ NOT integrated into the main app yet
- ❌ Dependencies NOT installed
- ❌ Preview buttons in Section4Compact still use `window.open()`

### To Complete Integration:
1. Install required dependencies (see package.json dependencies above)
2. Update Section4Compact.tsx to use FilePreviewModal instead of window.open()
3. Add context provider for preview state management
4. Test with existing file uploads
5. Enhance viewers (PDF with react-pdf, Image with pan/zoom)

**The foundation is built and ready - just needs to be connected to the app when ready to proceed.**

## Notes

- The LOE Preview Modal provides a good reference for zoom implementation
- Current file viewers just open in new tabs - this will be a significant UX improvement
- Mobile support is critical as appraisers work in the field
- Must maintain performance with large files (10MB+ images, 100+ page PDFs)

## Resources

- [LOEPreviewModal.tsx](/src/components/dashboard/job-details/actions/LOEPreviewModal.tsx) - Reference zoom implementation
- [File Management README](/00-APR-Resources/20-FILE_Mgt/README.md) - Original requirements
- [react-pdf Documentation](https://react-pdf.wojtechwaj.pl/)
- [PDF.js Examples](https://mozilla.github.io/pdf.js/examples/)