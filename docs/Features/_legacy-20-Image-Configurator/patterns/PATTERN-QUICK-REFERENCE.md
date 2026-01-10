# Image Gallery Patterns - Quick Reference Card

**Print this page for your desk!**

---

## Pattern Selection Decision Tree

```
Do you need to display images?
│
├─ YES: Single image?
│  ├─ YES → Pattern 2: Single Image Handler
│  │        (ImageFieldEditor with img-* prefix)
│  │
│  └─ NO: Multiple images?
│     ├─ List view with reordering?
│     │  └─ YES → Pattern 5: DraggableImageList
│     │
│     └─ Grid view?
│        └─ YES → Pattern 1: ImageGrid (NEW)
│
├─ Need file upload?
│  └─ YES → Pattern 3: DragDropUploader
│
├─ Need filtering/selection?
│  └─ YES → Pattern 4: ImageFilter + Badge
│
└─ Need status indicators?
   └─ YES → Pattern 3: Quality Indicators + Badge
```

---

## Pattern Cheat Sheet

### Pattern 1: ImageGrid
**When:** Display 10-200 images in responsive grid
**Import:** `import { ImageGrid } from '@/components/gallery/ImageGrid'`
**Time to Setup:** 5 min
**Lines of Code:** ~80
```
┌─────┬─────┬─────┐
│ 🖼️  │ 🖼️  │ 🖼️  │
├─────┼─────┼─────┤
│ 🖼️  │ 🖼️  │ 🖼️  │
├─────┼─────┼─────┤
│ 🖼️  │ 🖼️  │ 🖼️  │
└─────┴─────┴─────┘
```
**Props:** `images, columns, onRemove, onPreview`
**Return:** JSX grid element
**File Location:** Code pattern #1 in documentation

---

### Pattern 2: Single Image Handler
**When:** Upload/display one image (cover, logo, etc)
**Import:** Already in `ImageFieldEditor.tsx` (use `img-*` prefix)
**Time to Setup:** 0 min (existing)
**Lines of Code:** 125
```
┌────────────┐
│   🖼️       │
│   [👁] [×] │
└────────────┘
```
**Field ID:** Must start with `img-`
**Storage:** Single string (data URL or URL)
**File Location:** `ImageFieldEditor.tsx` lines 215-340

---

### Pattern 3: DragDropUploader
**When:** Let users add multiple images at once
**Import:** `import { DragDropUploader } from '@/components/gallery/DragDropUploader'`
**Time to Setup:** 10 min
**Lines of Code:** ~100
```
┌──────────────────────────┐
│  📤 Drop images here     │
│      or click            │
├──────────────────────────┤
│ ┌──┐ ┌──┐ ┌──┐           │
│ │🖼️│ │🖼️│ │🖼️│           │
│ └──┘ └──┘ └──┘           │
│                   [✕]    │
└──────────────────────────┘
```
**Props:** `onImagesAdded, maxImages`
**Accepts:** Files via drag, click, or paste
**Return:** Preview grid after upload
**File Location:** Code pattern #3 in documentation

---

### Pattern 4: ImageFilter
**When:** Filter 50+ images by quality/type/section
**Import:** `import { ImageFilter } from '@/components/gallery/ImageFilter'`
**Time to Setup:** 15 min
**Lines of Code:** ~120
```
Quality: [High] [Medium] [Low]
Type:    [Photo] [Doc] [Plan]
Section: [Site] [Improvements]

[23 images matching]
┌─────┬─────┬─────┬─────┐
│ 🖼️  │ 🖼️  │ 🖼️  │ 🖼️  │
└─────┴─────┴─────┴─────┘
```
**Props:** `images` (with metadata)
**Returns:** Filtered grid + count
**File Location:** Code pattern #4 in documentation

---

### Pattern 5: DraggableImageList
**When:** Reorder images in list view
**Import:** `import { DraggableImageList } from '@/components/gallery/DraggableImageList'`
**Time to Setup:** 10 min
**Lines of Code:** ~90
```
[≡] 🖼️  image1.jpg  [👁] [×]
[≡] 🖼️  image2.jpg  [👁] [×]
    ↕  (drag to reorder)
[≡] 🖼️  image3.jpg  [👁] [×]
```
**Props:** `images, onReorder, onRemove, onPreview`
**Uses:** HTML5 drag-drop API
**File Location:** Code pattern #5 in documentation

---

### Pattern 6: ImagePreviewModal
**When:** Show fullscreen image preview
**Import:** `import { ImagePreviewModal } from '@/components/gallery/ImagePreviewModal'`
**Time to Setup:** 5 min (wrap existing modal)
**Lines of Code:** ~120
```
    [✕]
     |
[←] 📷 LARGE [→]
     |
  1 / 10
```
**Keyboard:** ESC to close, ← → to navigate
**Props:** `imageUrl, isOpen, onClose, onNext, onPrev`
**File Location:** Code pattern #6 in documentation

---

### Pattern 7: useImageManager Hook
**When:** Need complex state management for images
**Import:** `import { useImageManager } from '@/hooks/useImageManager'`
**Time to Setup:** 5 min to integrate
**Lines of Code:** ~80
```typescript
const { images, add, remove, reorder, toggleSelect, selectedCount }
  = useImageManager();

add(newImages);          // Add images
remove([1, 2, 3]);       // Remove by index
reorder(0, 3);           // Drag reorder
toggleSelect(2);         // Checkbox toggle
selectedCount;           // How many selected
deleteSelected();        // Batch delete
```
**Returns:** Image state + 8 action functions
**File Location:** Code pattern #7 in documentation

---

## Quick Integration Guide

### Step 1: Choose Your Pattern
Use decision tree above ↑

### Step 2: Copy Component
Find code pattern in [IMAGE-GALLERY-CODE-PATTERNS.md](./IMAGE-GALLERY-CODE-PATTERNS.md)

### Step 3: Create File
```bash
# Example: Create ImageGrid component
cat > src/components/gallery/ImageGrid.tsx << 'EOF'
[PASTE CODE PATTERN HERE]
EOF
```

### Step 4: Import & Use
```typescript
import { ImageGrid } from '@/components/gallery/ImageGrid';

export function MyGallery() {
  const [images, setImages] = useState<string[]>([]);

  return (
    <ImageGrid
      images={images}
      columns={3}
      onRemove={(idx) => setImages(prev => prev.filter((_, i) => i !== idx))}
    />
  );
}
```

### Step 5: Test
```bash
npm run dev
# Navigate to component
# Test with 5, 50, 500 images
```

---

## Pattern Comparison Matrix

| Aspect | Pattern 1 | Pattern 2 | Pattern 3 | Pattern 4 | Pattern 5 | Pattern 6 | Pattern 7 |
|--------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| **Name** | ImageGrid | Single | Upload | Filter | List | Modal | Hook |
| **Images** | 10-200 | 1 | 5-20 | 50+ | 10-50 | 1 | N/A |
| **View** | Grid | Compact | Grid | Filtered | List | Full | Logic |
| **Drag** | No | No | No | No | Yes | No | Helper |
| **Upload** | No | Yes | Yes | No | No | No | Manages |
| **Filter** | No | No | No | Yes | No | No | Helper |
| **Time** | 5m | 0m | 10m | 15m | 10m | 5m | 5m |
| **Effort** | Easy | None | Med | Med | Med | Easy | Med |
| **Status** | New | Exists | New | New | New | Exists | New |

---

## Common Use Cases

### Use Case: Property Photo Album
**Patterns:** 3 (upload) → 1 (grid) → 6 (preview)
```
User uploads images → Grid displays them → Click to preview fullscreen
```

### Use Case: Inspection Report
**Patterns:** 3 (upload) → 4 (filter by room) → 5 (reorder) → Export
```
Upload photos → Filter by section → Reorder → Generate report
```

### Use Case: Document Management
**Patterns:** 3 (upload) → 2 (single cover) → 5 (list for editing)
```
Upload docs → Set cover image → Arrange pages
```

### Use Case: Quality Control
**Patterns:** 1 (grid) → Show quality badges → 4 (filter low quality)
```
Display all images → Mark quality level → Filter for review
```

---

## Keyboard Shortcuts

### ImageGrid + ImagePreviewModal
```
ESC    Close preview
→ ←    Next/Previous image (in modal)
Click  Toggle preview on/off
```

### DraggableImageList
```
Drag   Reorder images
Click  Preview image
Enter  Select item (future)
```

---

## CSS Classes You'll Need

All patterns use **Tailwind CSS**. Key classes:

```css
/* Grid layouts */
.grid                  /* CSS Grid container */
.grid-cols-2           /* 2 columns on mobile */
.md:grid-cols-3        /* 3 columns on tablet */
.lg:grid-cols-4        /* 4 columns on desktop */

/* Spacing */
.gap-4                 /* Gap between items */
.space-y-2             /* Vertical spacing */
.space-x-2             /* Horizontal spacing */

/* Sizing */
.aspect-square         /* 1:1 ratio */
.w-16 .h-16           /* 64×64px thumbnail */
.w-full               /* 100% width */

/* Effects */
.rounded              /* Rounded corners */
.overflow-hidden      /* Clip content */
.hover:opacity-75     /* Hover effect */
.group-hover:opacity-100  /* Group hover */

/* Background */
.bg-muted             /* Subtle background */
.border-dashed        /* Dashed border */
```

---

## File Structure After Setup

```
src/components/gallery/
├── ImageGrid.tsx           (Pattern 1)
├── ImageCard.tsx           (Sub-component)
├── ImageWithBadge.tsx      (Pattern 2 variant)
├── DragDropUploader.tsx    (Pattern 3)
├── ImageFilter.tsx         (Pattern 4)
├── DraggableImageList.tsx  (Pattern 5)
├── ImagePreviewModal.tsx   (Pattern 6)
└── index.ts                (Barrel export)

src/hooks/
└── useImageManager.ts      (Pattern 7)

docs/
├── README-IMAGE-PATTERNS.md        (This series)
├── IMAGE-GALLERY-CODE-PATTERNS.md  (Copy-paste snippets)
├── IMAGE-GRID-GALLERY-PATTERNS.md  (Deep dive)
└── PATTERN-QUICK-REFERENCE.md      (You are here)
```

---

## Troubleshooting Quick Fixes

### Images don't display
```
✓ Check URL validity (data:// or https://)
✓ Check CORS headers if external URL
✓ Check file size (should be reasonable)
✓ Check image onError handler
```

### Drag-drop not working
```
✓ Check draggable attribute is set
✓ Check onDragStart/onDragEnd are bound
✓ Check event.preventDefault() in handlers
✓ Check z-index if under other elements
```

### Grid is broken on mobile
```
✓ Check grid-cols-1 for mobile
✓ Check responsive breakpoints (md:, lg:)
✓ Check gap sizing on small screens
✓ Check image aspect-square maintains ratio
```

### Performance is slow with 500+ images
```
✓ Use Pattern 7 hook with virtualization
✓ Enable lazy loading: <img loading="lazy" />
✓ Use React.memo for image cards
✓ Consider pagination (10-20 per page)
```

---

## Integration with Your Store

```typescript
// Connect patterns to reportBuilderStore

// Add image
const { addImage } = useReportBuilderStore();
<DragDropUploader onImagesAdded={(urls) =>
  urls.forEach(url => addImage(fieldId, url))
} />

// Reorder images
const { reorderImages } = useReportBuilderStore();
<DraggableImageList onReorder={(images) =>
  reorderImages(fieldId, images)
} />

// Remove image
const { removeImage } = useReportBuilderStore();
<ImageGrid onRemove={(idx) =>
  removeImage(fieldId, images[idx])
} />
```

---

## Feature Progression

### MVP (Week 1)
✓ Grid layout
✓ Image upload
✓ Basic preview

### v1.1 (Week 2)
✓ Pagination
✓ Basic filter
✓ Status badges

### v1.2 (Week 3)
✓ Advanced filters
✓ Drag reordering
✓ Keyboard shortcuts

### v2.0 (Future)
✓ Virtualization (500+)
✓ Cloud storage
✓ Image editing
✓ Bulk operations

---

## Resources & References

**Main Documentation:**
- [IMAGE-GALLERY-CODE-PATTERNS.md](./IMAGE-GALLERY-CODE-PATTERNS.md) - Copy-paste ready code
- [IMAGE-GRID-GALLERY-PATTERNS.md](./IMAGE-GRID-GALLERY-PATTERNS.md) - Full analysis
- [README-IMAGE-PATTERNS.md](./README-IMAGE-PATTERNS.md) - Overview & roadmap

**Source Code:**
- `src/features/report-builder/components/EditPanel/ImageFieldEditor.tsx` - Original implementation
- `src/features/report-builder/schema/fieldRegistry.ts` - Field definitions
- `src/components/ui/badge.tsx` - Badge component

**External Resources:**
- [Tailwind CSS Grid](https://tailwindcss.com/docs/display#grid)
- [React DnD Events](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

## Decision: Use Existing Code or Build New?

**Answer: Use existing code + wrap with grid layout**

Your `ImageFieldEditor.tsx` has:
- ✓ File upload (drag-drop + click)
- ✓ Paste from clipboard
- ✓ Drag reordering logic
- ✓ Preview modal
- ✓ Data URL storage

Just needs:
- CSS Grid layout (instead of vertical list)
- Pagination for 200+ images
- Filter controls

**Risk:** Very low - proven code in production

---

## Final Checklist Before Building

- [ ] Read [IMAGE-GALLERY-CODE-PATTERNS.md](./IMAGE-GALLERY-CODE-PATTERNS.md)
- [ ] Choose 1-3 patterns from chart above
- [ ] Copy code into your components folder
- [ ] Update imports for your project structure
- [ ] Test with 5, 50, 500 images
- [ ] Measure performance
- [ ] Deploy when ready
- [ ] Celebrate! 🎉

---

**Last Updated:** 2026-01-03
**Pattern Version:** 1.0
**Status:** Ready for Production

Print this → Keep it on your desk → Reference while coding
