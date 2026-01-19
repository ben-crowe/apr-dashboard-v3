# Image Configurator - Feature Documentation

> **Status:** IN DEVELOPMENT
> **Last Updated:** 2026-01-06
> **Location:** `src/features/image-configurator/`

---

## What It Is

A drag-and-drop interface for organizing property photos into report pages. Users upload images, the system categorizes them, and users drag them onto pre-configured page layouts that match the final printed report structure.

**Why it exists:** The Report Builder has 55+ image fields scattered across multiple sections. Managing these individually is tedious. This feature consolidates all image management into one visual interface.

---

## Access Points

| Location | Route | When Available | Status |
|----------|-------|----------------|--------|
| **Standalone** | `/image-test` | Always | ✅ Working |
| **Report Builder** | Sidebar → "Images" tab | When job is loaded | ✅ Working |

---

## Current State

### ✅ Working
- Image upload (drag/drop or click)
- Cloud storage (Supabase `appraisal-raw` bucket)
- Image gallery with filters
- Drag-and-drop to page slots
- 6 report type templates with 2-18 pages each
- Auto-create page layouts on first load
- Report type selector dropdown
- Integration with Report Builder (wired into `image-mgt` section)

### 🚧 In Progress
- Testing with real job data
- UX refinement based on usage patterns

### ⏳ Pending
- Auto-Fill feature (populate empty slots from matching category)
- Image editor (crop, rotate, adjust)
- Batch operations (move multiple images, clear page, etc.)
- Category override UI
- Custom page creation (add/remove pages beyond templates)

---

## User Flow

### 1. From Report Builder
```
User opens job → Report Builder loads → Click "Images" sidebar
                                              ↓
                            Image Configurator appears with job's images
```

### 2. Interface Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│  IMAGE PAGE CONFIGURATOR                    [Report Type: Standard] │
├──────────────────────────┬──────────────────────────────────────────┤
│  LEFT: Gallery           │  RIGHT: Layout Builder                   │
├──────────────────────────┼──────────────────────────────────────────┤
│  [Upload Zone]           │  Subject Photos - Page 1 (2x3 grid)      │
│                          │  ┌──────┬──────┬──────┐                  │
│  Filters: [Category ▼]  │  │ Slot │ Slot │ Slot │                  │
│                          │  │  1   │  2   │  3   │                  │
│  ┌────┐ ┌────┐ ┌────┐   │  ├──────┼──────┼──────┤                  │
│  │img │ │img │ │img │   │  │ Slot │ Slot │ Slot │                  │
│  └────┘ └────┘ └────┘   │  │  4   │  5   │  6   │                  │
│                          │  └──────┴──────┴──────┘                  │
│  ┌────┐ ┌────┐ ┌────┐   │                                           │
│  │img │ │img │ │img │   │  [◀ Prev] Page 1 of 14 [Next ▶]         │
│  └────┘ └────┘ └────┘   │                                           │
└──────────────────────────┴──────────────────────────────────────────┘
```

### 3. Actions
- **Upload:** Drag files to upload zone or click to browse
- **Filter:** Show only Exterior, Interior, Common, etc.
- **Place:** Drag image from gallery → drop on empty slot
- **Navigate:** Use arrows or page tabs to switch pages
- **Switch Template:** Change report type from dropdown (recreates page structure)

---

## Report Type Templates

| Template | Pages | Use Case |
|----------|-------|----------|
| **Standard Multi-Family** | 14 | Full appraisal with subject photos, maps, sales comps, rental comps |
| **Quick Residential** | 4 | Basic residential - subject photos + location map |
| **Land/Vacant** | 6 | Land appraisals - emphasis on site plans and aerials |
| **Drive-By Exterior** | 3 | Exterior-only inspection |
| **Desktop Review** | 2 | Minimal on-site inspection |
| **Commercial Full** | 18 | Large commercial with extended comp analysis |

Each template defines specific pages with grid layouts (1x1, 2x2, 2x3, 3x3, etc.)

---

## Page Layout Examples

**Standard Multi-Family Template (14 pages):**
1. Subject Photos - Page 1 (2x3 = 6 slots) - Category: Exterior
2. Subject Photos - Page 2 (2x3 = 6 slots) - Category: Interior Units
3. Location Map (1x1 = 1 slot)
4. Aerial Map (1x1 = 1 slot)
5. Zoning Map (1x1 = 1 slot)
6. Flood Map (1x1 = 1 slot)
7. Site Plan (1x1 = 1 slot)
8. Comp Location Map (1x1 = 1 slot)
9. Sales Comp Photos - Page 1 (2x3 = 6 slots)
10. Sales Comp Photos - Page 2 (2x3 = 6 slots)
11. Rental Comp Map (1x1 = 1 slot)
12. Rental Comp Photos (2x3 = 6 slots)
13. Building Systems (2x2 = 4 slots) - Category: Building Systems
14. Site Improvements (2x2 = 4 slots) - Category: Site

---

## Technical Architecture

### Component Structure
```
src/features/image-configurator/
├── components/
│   ├── ImageConfiguratorDemo.tsx    ← Main container
│   ├── ImageGallery.tsx              ← Left panel (upload + grid)
│   ├── LayoutBuilder.tsx             ← Right panel (pages + slots)
│   ├── UploadZone.tsx                ← Drag/drop upload area
│   └── index.ts
├── hooks/
│   ├── useLayouts.ts                 ← Fetch/create page layouts
│   ├── useImages.ts                  ← Fetch/upload images
│   └── useImageDrop.ts               ← Drag-and-drop logic
├── types/
│   └── index.ts                      ← TypeScript interfaces
└── index.ts
```

### Integration Point
```
src/features/report-builder/components/
├── EditPanel/EditPanel.tsx           ← Conditional render for image-mgt
└── ImageMgtTabPanel/
    ├── ImageMgtTabPanel.tsx          ← Wrapper component
    └── index.ts
```

**Flow:**
1. `MockReportBuilder` receives `jobId` from URL params
2. Calls `setCurrentJobId(jobId)` to store in reportBuilderStore
3. When user clicks "Images" in sidebar, `EditPanel` renders `ImageMgtTabPanel`
4. `ImageMgtTabPanel` reads `currentJobId` from store
5. Renders `ImageConfiguratorDemo` with `jobId` prop
6. `ImageConfiguratorDemo` fetches layouts and images for that job

---

## Database Schema

### Tables

**`page_layouts`** - Page definitions
```sql
id              uuid PRIMARY KEY
job_id          uuid REFERENCES jobs(id)
page_type       text                    -- 'subject-photos-1', 'location-map', etc.
layout_template text                    -- '1x1', '2x2', '2x3', '3x3', etc.
sort_order      integer                 -- Display order
title           text                    -- "Subject Photos - Page 1"
category_filter text                    -- "Exterior", "Interior Units", null
created_at      timestamp
updated_at      timestamp
```

**`page_layout_slots`** - Individual image slots
```sql
id             uuid PRIMARY KEY
layout_id      uuid REFERENCES page_layouts(id) ON DELETE CASCADE
slot_position  integer              -- 1-12 depending on grid size
slot_label     text                 -- "Slot 1", "Slot 2", etc.
image_id       uuid                 -- Foreign key to job_images (nullable)
created_at     timestamp
updated_at     timestamp
```

**`job_images`** - Uploaded images
```sql
id              uuid PRIMARY KEY
job_id          uuid REFERENCES jobs(id)
file_name       text
file_path       text                -- Supabase storage path
file_size       integer
mime_type       text
category        text                -- AI-detected or manual
quality_score   real                -- 0.0-1.0
upload_date     timestamp
```

### Storage

**Supabase Storage Bucket:** `appraisal-raw`
- Public read access
- Authenticated write access
- Path format: `{jobId}/{timestamp}-{filename}.jpg`

---

## Key Decisions

### 1. Auto-Create on Load
**Decision:** Layouts auto-create from template on first visit (no manual button).
**Why:** Better UX - user sees pages immediately, not an empty state.
**Impact:** `useLayouts` hook checks if layouts exist, creates from `DEFAULT_LAYOUTS` if not.

### 2. Report Type Templates
**Decision:** Pre-define 6 report type templates instead of generic category buckets.
**Why:** Matches real appraisal workflows (user said "I just want to do what I normally do").
**Impact:** Each template has specific page count and layout structure.

### 3. Standalone Development
**Decision:** Build at `/image-test` route first, wire into Report Builder later.
**Why:** Easier to develop/test without Report Builder complexity.
**Impact:** Feature is self-contained, can be tested independently.

### 4. Cloud Supabase Only
**Decision:** Use cloud Supabase, not local.
**Why:** Local keys regenerate on restart, causing 401 errors that confused agents.
**Impact:** `.env.local` must point to `https://ngovnamnjmexdpjtcnky.supabase.co`.

---

## Next Steps

### Phase 1: Core UX (Current)
- [x] Upload interface
- [x] Gallery with filters
- [x] Drag-and-drop to slots
- [x] Page navigation
- [x] Report type templates
- [x] Auto-create layouts
- [x] Integration with Report Builder

### Phase 2: Enhancement
- [ ] Auto-Fill button (populate from matching category)
- [ ] Image editor (crop, rotate, brightness)
- [ ] Category override UI
- [ ] Batch operations (move multiple, clear page)
- [ ] Search/filter by filename

### Phase 3: Advanced
- [ ] Custom page creation (add/remove pages)
- [ ] AI quality threshold filter
- [ ] Caption/annotation system
- [ ] Template import/export
- [ ] Multi-job image reuse

---

## Testing Checklist

When testing this feature:

- [ ] Can upload images via drag-and-drop
- [ ] Can upload images via click-to-browse
- [ ] Images appear in gallery after upload
- [ ] Can drag image from gallery to slot
- [ ] Can navigate between pages
- [ ] Report type dropdown shows all 6 templates
- [ ] Changing report type recreates page structure
- [ ] Page layouts persist (refresh doesn't lose assignments)
- [ ] Works in standalone mode (`/image-test`)
- [ ] Works in Report Builder ("Images" tab)
- [ ] No console errors when loading
- [ ] Images load from cloud Supabase (no 401 errors)

---

## Related Files

| Purpose | Location |
|---------|----------|
| Feature code | `src/features/image-configurator/` |
| Report Builder integration | `src/features/report-builder/components/ImageMgtTabPanel/` |
| Domain knowledge | `docs/APR-Domain Mgr/` |
| Supabase guide | `~/.claude/commands/guide-supabase-deploy.md` |

---

## Questions / Open Issues

1. **Q:** What happens if user changes report type after assigning images?
   **A:** Currently recreates layouts (clears assignments). Need to decide: preserve or warn user.

2. **Q:** How to handle images that don't fit any category?
   **A:** Need "Uncategorized" or "Other" bucket in filters.

3. **Q:** Should we allow custom page creation beyond templates?
   **A:** Yes, but later phase. Start with templates to validate UX.

4. **Q:** What's the relationship between this and the 55 image fields in Report Builder?
   **A:** This replaces manual field-by-field assignment. Need migration path from old fields to new system.

---

**End of Feature Doc**
