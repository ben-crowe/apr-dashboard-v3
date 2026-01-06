# Image Page Configurator - User Guide

## What It Does

The Image Page Configurator helps you organize property photos into report pages. Upload images, categorize them, drag them onto page layouts, and they'll appear in your final report.

## Accessing the Feature

- **Test Mode:** http://localhost:8086/image-test
- **In Report Builder:** (Integration pending)

---

## Interface Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    IMAGE PAGE CONFIGURATOR                          │
├──────────────────────────────┬──────────────────────────────────────┤
│     LEFT: Image Gallery      │       RIGHT: Layout Builder          │
├──────────────────────────────┼──────────────────────────────────────┤
│  ┌──────────────────────┐    │   ┌──────────────────────────────┐   │
│  │   Upload Zone        │    │   │  Page: Exterior (2x2 grid)   │   │
│  │   (drag files here)  │    │   ├──────────────┬───────────────┤   │
│  └──────────────────────┘    │   │   Slot 1     │    Slot 2     │   │
│                              │   │   [photo]    │    [empty]    │   │
│  Filters: Category, Quality  │   ├──────────────┼───────────────┤   │
│                              │   │   Slot 3     │    Slot 4     │   │
│  ┌─────┐ ┌─────┐ ┌─────┐    │   │   [empty]    │    [empty]    │   │
│  │ img │ │ img │ │ img │    │   └──────────────┴───────────────┘   │
│  └─────┘ └─────┘ └─────┘    │                                      │
│                              │   [◀ Page 1 of 5 ▶]  [Auto-Fill]    │
└──────────────────────────────┴──────────────────────────────────────┘
```

---

## Step-by-Step Usage

### 1. Create Layouts (First Time Only)

When you first open the configurator, you'll see "No layouts found."

Click **"Create Default Layouts"** to create:
- **Exterior** (2x2 = 4 photos)
- **Interior** (3x3 = 9 photos)
- **Common Areas** (2x3 = 6 photos)
- **Building Systems** (2x2 = 4 photos)
- **Site** (2x2 = 4 photos)

### 2. Upload Images

**Drag & Drop:** Drag image files onto the upload zone
**Click to Browse:** Click the upload zone to select files

- Supports: JPG, PNG, WebP
- Max 500 images per upload
- Images are stored in Supabase cloud storage

### 3. Use Filters

Filter your image gallery by:
- **Category:** Exterior, Interior, Common Areas, etc.
- **Quality:** Filter by AI-detected quality score
- **Status:** Show unreviewed, hide placed, etc.

### 4. Place Images on Layouts

**Manual Drag & Drop:**
1. Drag an image from the left gallery
2. Drop it on an empty slot on the right

**Auto-Fill:**
1. Navigate to a page (e.g., "Exterior")
2. Click **Auto-Fill** button
3. Best-quality images matching that category auto-populate empty slots

### 5. Navigate Between Pages

Use the **◀ ▶** arrows or click page tabs at the bottom to switch between layout pages.

### 6. Manage Slots

- **Clear slot:** Hover and click the X to remove an image
- **Swap images:** Drag from one slot to another
- **Edit image:** Click to open the image editor (crop, adjust)

---

## Default Layout Templates

| Page Type | Grid | Slots | Category Filter |
|-----------|------|-------|-----------------|
| Exterior | 2x2 | 4 | Exterior |
| Interior | 3x3 | 9 | Interior Units |
| Common Areas | 2x3 | 6 | Common Areas |
| Systems | 2x2 | 4 | Building Systems |
| Site | 2x2 | 4 | Site |

---

## Image Categories

The AI classifier assigns categories automatically:

| Category | Examples |
|----------|----------|
| **Exterior** | Front facade, rear, sides, street view |
| **Interior Units** | Kitchen, bathroom, bedroom, living room |
| **Common Areas** | Lobby, corridor, amenity space, laundry |
| **Building Systems** | HVAC, electrical, plumbing, roof |
| **Site** | Parking, landscaping, signage, entrance |
| **Basement/Utility** | Mechanical room, storage, foundation |

You can manually override categories in the image editor.

---

## Data Storage

| Data | Location |
|------|----------|
| Raw images | Supabase storage: `appraisal-raw` bucket |
| Image metadata | Supabase table: `job_images` |
| Page layouts | Supabase table: `page_layouts` |
| Slot assignments | Supabase table: `page_layout_slots` |

---

## Troubleshooting

### "No layouts found"
Click the **Create Default Layouts** button to initialize the 5 default pages.

### Images not loading (401 errors)
Check `.env.local` - make sure `VITE_SUPABASE_URL` points to cloud, not local:
```
# WRONG (local)
VITE_SUPABASE_URL="http://127.0.0.1:54321"

# CORRECT (cloud)
VITE_SUPABASE_URL="https://ngovnamnjmexdpjtcnky.supabase.co"
```

### Upload fails
- Check file size (max ~50MB per file)
- Check network connection
- Verify Supabase storage bucket exists and has correct permissions

---

## Future Enhancements

- [ ] Integration with Report Builder image sections
- [ ] Custom layout creation (variable grids)
- [ ] Batch category assignment
- [ ] AI quality filtering threshold
- [ ] Caption/annotation editor
