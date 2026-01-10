# APR Dashboard - Split Panel Editor & Image Management UX

**Exported:** 2025-12-24 05:45 MST

## The Core Innovation

The APR Dashboard separates **GATHERING** data from **REVIEWING** data with two distinct interfaces:

1. **TDD Dashboard** (Test Data Dashboard) = Bulk data entry mode
2. **Split Panel Editor** = Review & edit mode with live preview

---

## The Split Panel Editor

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SPLIT PANEL EDITOR                                │
├────────────────────────────────┬────────────────────────────────────────┤
│                                │                                        │
│     EDITABLE FIELDS            │         LIVE HTML PREVIEW              │
│                                │                                        │
│  ┌──────────────────────┐      │      ┌────────────────────────────┐   │
│  │ zoning-map           │      │      │                            │   │
│  │ [Upload] [Change]    │      │      │    ┌──────────────────┐    │   │
│  └──────────────────────┘      │      │    │   ZONING MAP     │    │   │
│                                │      │    │   [Actual Image]  │    │   │
│  ┌──────────────────────┐      │      │    └──────────────────┘    │   │
│  │ zoning-description   │      │      │                            │   │
│  │ [R2 - Low Density]   │      │      │    Zoning: R2 - Low        │   │
│  └──────────────────────┘      │      │    Density Residential     │   │
│                                │      │                            │   │
│  ┌──────────────────────┐      │      │    Permitted Uses:         │   │
│  │ permitted-uses       │      │      │    • Single family         │   │
│  │ [Multi-family...]    │      │      │    • Multi-family          │   │
│  └──────────────────────┘      │      │                            │   │
│                                │      └────────────────────────────┘   │
│                                │                                        │
│        LEFT PANEL              │            RIGHT PANEL                 │
│     (Data Source)              │         (Rendered Output)              │
│                                │                                        │
└────────────────────────────────┴────────────────────────────────────────┘
```

### Why This Is Revolutionary

**Traditional Workflow (Word/PDF):**
1. Type data somewhere
2. Generate report
3. See problem in output
4. Hunt for where to fix it
5. Re-generate
6. Check again
7. Repeat...

**APR Split Panel Workflow:**
1. See the rendered page (RIGHT)
2. See the data fields that feed it (LEFT)
3. Don't like something? Edit it RIGHT THERE
4. See the change instantly
5. Done.

**You never leave context.** The source field is always visible next to the output it produces.

---

## Two Modes, Two Purposes

### Mode 1: TDD Dashboard (S3 - Image Management)

**Purpose:** Bulk gathering of all images in one place

**When to use:** 
- Initial report setup
- Assistant gathering all photos
- Batch uploading from inspection

**UX Pattern:**
- All image uploads consolidated in ONE tab
- Don't jump around to 20 tabs to upload images
- Get everything in, organized by category

```
S3 - IMAGE MANAGEMENT
├── 01 - Cover & Signature
├── 03 - Location Maps  
├── 07 - Property Photographs
│   ├── Exterior Photos (6 slots)
│   ├── Street Views (3 slots)
│   ├── Common Areas (4 slots)
│   ├── Subject Photos (25 slots)
│   ├── Unit Interiors (6 slots)
│   └── Building Systems (4 slots)
├── Comp Photos (5 slots)
└── Comp Maps (5 slots)
```

### Mode 2: Split Panel Editor

**Purpose:** Review and refine with live preview

**When to use:**
- Appraiser reviewing assistant's work
- Quality check before delivery
- Fine-tuning specific pages

**UX Pattern:**
- See rendered page on right
- See/edit source fields on left
- Change something, see it update
- In-context editing

---

## The "Managed Elsewhere" Pattern

In the TDD Dashboard, tabs like "13 - ZONING" show:

```
┌─────────────────────────────────────────────────────────────┐
│  zoning-map          Zoning Map       "Managed in Image Mgt"│
│                                       [clickable link → S3] │
└─────────────────────────────────────────────────────────────┘
```

**Why?**
- In UPLOAD mode: Go to S3, upload all images at once
- The numbered tab shows WHERE it appears in the report
- But you don't upload it there (that would mean jumping around)

**In Split Panel Editor:**
- The same `zoning-map` field IS editable
- Because now you're in REVIEW mode, looking at the actual page
- You can change the image right there, next to the preview
- No need to go back to S3

---

## Workflow Example

### Setup Phase (Assistant)

```
1. Open TDD Dashboard
2. Go to S3 - Image Management
3. Upload ALL images:
   - Cover photo ✓
   - 24 subject photos ✓
   - 5 comp photos ✓
   - 5 comp maps ✓
   - Zoning map ✓
   - Site plans ✓
4. Fill other tabs with property data
5. Hand off to appraiser
```

### Review Phase (Appraiser)

```
1. Open Split Panel Editor
2. Navigate to Page 15 (Zoning)
3. See rendered zoning section on RIGHT
4. See data fields on LEFT
5. Notice: "That zoning map is cropped weird"
6. Click the image field on LEFT
7. Upload better image
8. See it update on RIGHT instantly
9. Move to next page
10. Repeat until satisfied
```

---

## Future State

The TDD Dashboard as it exists now is for TESTING field mapping. In production:

- Images might come from Google Drive folder sync
- Or automatic import from inspection app
- Or API pull from photo management system

**The point:** However images GET IN, the Split Panel Editor is where appraisers REVIEW and REFINE them in context.

The TDD Dashboard validates that all fields map correctly. The Split Panel Editor is the actual work environment.

---

## Why This Beats Everything Else

| Old Way | APR Way |
|---------|---------|
| Edit source → Generate → Check output → Hunt for error → Edit source → Regenerate | Edit source ↔ See output (same screen) |
| Images scattered across document sections | Images consolidated for upload, contextual for review |
| "Where does this field go?" | See field AND output simultaneously |
| Re-generate whole doc to see changes | Live preview updates instantly |
| Multiple tools (Word, PDF viewer, source files) | One interface, two panels |

---

## Summary

1. **S3 - Image Management:** Where you GATHER images (bulk upload mode)
2. **Numbered Tabs:** WHERE images appear in report structure (reference links when in TDD)
3. **Split Panel Editor:** Where you REVIEW & EDIT with live preview (images editable in context)

**The magic:** Upload once in S3. Edit anywhere in Split Panel. Never lose context.

---

*Architecture by: Ben Crowe*
*Documented: 2025-12-23*
