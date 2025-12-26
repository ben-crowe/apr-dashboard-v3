# BRIEF: Dynamic Photo Page Layout System

## Problem Statement

Appraisal reports contain photograph pages with mixed image orientations (landscape/portrait). Currently, fixed grid layouts cause:
- Awkward cropping of mismatched orientations
- Wasted whitespace
- Inconsistent professional appearance
- User frustration (why Word docs are preferred - manual adjustment)

## Current State

- Photo pages have fixed placeholder boxes
- User uploads images without orientation awareness
- Mixed landscape/portrait = poor visual result
- No intelligent grouping or sizing

## Desired Outcome

A smart upload system that:
1. Detects image orientation on upload
2. Groups like-orientations together
3. Renders optimal layout automatically
4. Fits within fixed page constraints (700px usable height)
5. Produces clean, professional output every time

## Constraints

- Page height: 700-720px usable
- Page width: ~600px content area
- Each image needs caption field below
- Maximum 2 images per row
- Footer reserved at bottom

## Layout Math

| Image Type | Dimensions (2-wide) | Row Height (with caption) |
|------------|---------------------|---------------------------|
| Landscape  | ~280px × 180px each | ~200px |
| Portrait   | ~200px × 280px each | ~300px |

## Viable Combinations (single page)

- 6 landscapes: 3 rows × 200px = 600px ✅
- 4 portraits: 2 rows × 300px = 600px ✅
- 4 landscape + 2 portrait: 400 + 300 = 700px ✅
- 2 landscape + 4 portrait: 200 + 600 = 800px ❌ (needs 2 pages)

## Proposed Solutions

### Option A: Auto-Detect + Auto-Group

1. User uploads any images to generic "Photo Page" slots
2. System detects orientation via aspect ratio
3. On render: landscapes grouped first, portraits second
4. Layout calculated dynamically based on counts

**Pros:** Simplest UX, no user decisions
**Cons:** Less control, may split unexpectedly

### Option B: Orientation-Specific Upload Slots

```
Photo Page Upload:
├── Landscape Slots (1-6 available)
│   └── [Upload] [Caption]
└── Portrait Slots (1-4 available)  
    └── [Upload] [Caption]
```

1. User consciously picks slot type
2. Preview shows exactly how it will render
3. System enforces orientation match (reject wrong type or auto-crop)

**Pros:** Predictable, user understands output
**Cons:** Slightly more complex UX

### Option C: Template Selection

User picks from preset templates:
- **6-Landscape** (3 rows × 2)
- **4-Portrait** (2 rows × 2)
- **Mixed A** (2 landscape + 2 portrait)
- **Mixed B** (4 landscape + 2 portrait)

**Pros:** Simplest to implement, guaranteed fit
**Cons:** Less flexibility

## Recommended Approach

**Option B** with smart defaults:
1. On upload, auto-detect orientation
2. Route to appropriate slot type automatically
3. Show live preview of page layout
4. Allow manual override/reorder
5. Warn if combination won't fit single page

## Technical Implementation Notes

### Orientation Detection
```javascript
// On image upload
const img = new Image();
img.onload = () => {
  const isLandscape = img.width > img.height;
  const aspectRatio = img.width / img.height;
  // Route to appropriate slot
};
```

### Render Logic
```javascript
function renderPhotoPage(images) {
  const landscapes = images.filter(i => i.isLandscape);
  const portraits = images.filter(i => !i.isLandscape);
  
  let currentHeight = 0;
  const pages = [];
  let currentPage = [];
  
  // Add landscapes first (200px per row of 2)
  // Add portraits second (300px per row of 2)
  // Split to new page if > 700px
}
```

### CSS Grid Approach
```css
.photo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  max-height: 700px;
}

.photo-landscape {
  aspect-ratio: 16/10;
  object-fit: cover;
}

.photo-portrait {
  aspect-ratio: 3/4;
  object-fit: cover;
}
```

## Research Questions

1. How do other report generators handle mixed-orientation photos?
2. Best practices for auto-cropping vs letterboxing?
3. Drag-and-drop reordering patterns for photo grids?
4. PDF generation with dynamic image layouts?

## Success Criteria

- Zero awkward cropping
- No wasted whitespace > 20%
- User can predict output before generating
- Professional appearance matching Word-based reports
- Works with 1-8 images per page

---

**Status:** Brief complete, ready for pattern research
**Next:** Agent to research existing solutions/patterns
**Priority:** Medium (doesn't block current work, improves UX significantly)


--Added issue we noticed:

Current problem:

Template has hardcoded captions: "1101 - East Elevation", "Bedroom 1", etc.
User can't change them without editing HTML
Input form inconsistent - some uploads have description, some don't

Should be:
Template:
{{photo-exterior-1-image}}
{{photo-exterior-1-caption}}

{{photo-exterior-2-image}}
{{photo-exterior-2-caption}}
Input Form (consistent pattern):
Every image upload gets:
├── [Image Upload]
├── [Caption Field] - pre-filled with suggestion, editable
└── Suggestion: "East Elevation" (click to use, or type custom)
Pre-fill suggestions help but don't lock:

Exterior 1 → suggests "East Elevation"
Exterior 2 → suggests "West Elevation"
Interior 1 → suggests "Living Room"
User clicks suggestion OR types "Unit 4 Kitchen"
