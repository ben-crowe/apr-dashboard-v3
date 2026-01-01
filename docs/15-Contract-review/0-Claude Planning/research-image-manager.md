# Research Prompt: Image Manager Feature

## Objective

Research open source tools, libraries, and approaches for building an intelligent image management system for appraisal reports. The system should handle bulk photo uploads, AI-powered classification, quality scoring, and flexible page layout management.

---

## The Problem

Appraisers take 100+ photos during property inspections:
- Photos are unorganized (IMG_0001.jpg, IMG_0002.jpg...)
- Manual sorting takes hours
- Need to select best photos for each report section
- Need to arrange into specific page layouts
- Minor editing often needed (crop, brightness)

---

## Feature Requirements

### 1. Bulk Upload & Ingestion
- Drag-drop entire folder
- Handle 100+ images at once
- Extract EXIF data (timestamp, GPS if available)
- Generate thumbnails quickly
- Store originals + thumbnails

**Research:**
- Best practices for bulk image upload in React
- Thumbnail generation (client-side vs server-side)
- Supabase Storage patterns for image management
- Libraries: react-dropzone, uppy, filepond

### 2. AI-Powered Classification

Auto-categorize photos into preset buckets:

| Category | Subcategories |
|----------|---------------|
| Exterior | Front facade, Rear, Left side, Right side, Detail/feature |
| Interior Units | Kitchen, Bathroom, Bedroom, Living room, Hallway |
| Common Areas | Lobby/entrance, Corridor, Amenity space, Laundry |
| Building Systems | HVAC, Electrical panel, Plumbing, Water heater, Roof |
| Site | Parking, Landscaping, Street view, Signage |
| Basement/Utility | Mechanical room, Storage, Foundation |

**Research:**
- Vision AI APIs for image classification
  - OpenAI Vision API
  - Google Cloud Vision
  - AWS Rekognition
  - Anthropic Claude vision
  - Open source: CLIP, BLIP, LLaVA
- Real estate specific image classifiers
- Training custom classifiers on property photos
- Cost comparison of APIs vs self-hosted
- Accuracy benchmarks for interior/exterior classification

### 3. Quality Scoring

Rate each photo on:
- Sharpness/blur detection
- Lighting (over/under exposed)
- Composition (centered, level)
- Resolution adequacy

**Research:**
- Image quality assessment algorithms
- Blur detection (Laplacian variance, FFT methods)
- Exposure analysis
- Open source IQA libraries
- Browser-based vs server-side processing

### 4. Organization & Review UI

User interface for reviewing AI classifications:
- Grid view of all photos
- Filter by category/bucket
- Filter by quality score
- Drag to reassign category
- Multi-select for batch operations
- Approve/reject workflow

**Research:**
- React grid/masonry libraries
  - react-grid-layout
  - react-beautiful-dnd
  - dnd-kit
  - react-photo-gallery
- Photo management UI patterns (Lightroom, Google Photos, Apple Photos)
- Filtering/faceted search UI patterns

### 5. Page Layout Management

Arrange selected photos into report page layouts:
- Layout templates: 1-up, 2x2, 2x3, 3x4
- Drag-drop into slots
- Reorder within layout
- Preview actual report page appearance
- Caption editing per photo

**Research:**
- Layout builder patterns
- Drag-drop into fixed slots
- Print-aware layout (8.5x11 page constraints)
- Libraries for constrained drag-drop

### 6. Light Image Editing

Browser-based editing:
- Crop (with aspect ratio lock)
- Rotate
- Brightness/contrast
- Auto-enhance
- Maybe: straighten/perspective correction

**Research:**
- Browser-based image editors
  - Pintura (commercial)
  - react-image-crop
  - Cropper.js
  - Fabric.js
  - Filerobot Image Editor (open source)
- WebGL-based filters
- Non-destructive editing patterns

---

## Architecture Questions

### Client-side vs Server-side Processing

| Task | Client | Server | Recommendation |
|------|--------|--------|----------------|
| Thumbnail generation | ✓ | ✓ | Client for speed |
| AI classification | | ✓ | Server (API calls) |
| Quality scoring | ✓ | ✓ | Client possible |
| Crop/edit | ✓ | | Client |
| Final export | | ✓ | Server for consistency |

### Storage Architecture

```
Supabase Storage:
├── uploads/
│   └── {job_id}/
│       └── raw/           # Original uploads
│           └── IMG_001.jpg
├── processed/
│   └── {job_id}/
│       ├── thumbnails/    # 300px thumbnails
│       ├── web/           # 1200px for preview
│       └── print/         # Full res for PDF
```

### Database Schema

```sql
CREATE TABLE job_images (
  id UUID PRIMARY KEY,
  job_id UUID REFERENCES job_submissions(id),
  
  -- File info
  original_filename VARCHAR(255),
  storage_path VARCHAR(500),
  thumbnail_path VARCHAR(500),
  file_size INT,
  width INT,
  height INT,
  
  -- Classification
  ai_category VARCHAR(50),
  ai_subcategory VARCHAR(50),
  ai_confidence FLOAT,
  user_category VARCHAR(50),      -- Override
  user_subcategory VARCHAR(50),   -- Override
  
  -- Quality
  quality_score FLOAT,            -- 0-1
  is_blurry BOOLEAN,
  is_overexposed BOOLEAN,
  is_underexposed BOOLEAN,
  
  -- Metadata
  exif_data JSONB,
  captured_at TIMESTAMP,
  gps_lat FLOAT,
  gps_lng FLOAT,
  
  -- Usage
  selected_for_report BOOLEAN DEFAULT FALSE,
  page_assignment VARCHAR(50),    -- e.g., 'exterior-photos-1'
  slot_position INT,              -- Position in page layout
  caption TEXT,
  
  -- Editing
  crop_data JSONB,                -- {x, y, width, height}
  adjustments JSONB,              -- {brightness, contrast, etc}
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- pending, classified, reviewed, placed
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE page_layouts (
  id UUID PRIMARY KEY,
  job_id UUID REFERENCES job_submissions(id),
  page_type VARCHAR(50),          -- 'exterior-photos', 'interior-photos', etc
  layout_template VARCHAR(20),    -- '2x2', '3x4', '1-up'
  sort_order INT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE page_layout_slots (
  id UUID PRIMARY KEY,
  layout_id UUID REFERENCES page_layouts(id),
  slot_position INT,
  image_id UUID REFERENCES job_images(id),
  caption TEXT
);
```

---

## Open Source Projects to Evaluate

### Image Upload & Management
- [ ] Uppy (https://uppy.io/) - Modular upload library
- [ ] FilePond (https://pqina.nl/filepond/) - File upload with preview
- [ ] react-dropzone - Simple drag-drop

### Image Classification (Self-hosted)
- [ ] CLIP (OpenAI) - Zero-shot classification
- [ ] BLIP-2 - Image understanding
- [ ] LLaVA - Vision-language model
- [ ] Roboflow - Custom model training

### Image Quality Assessment
- [ ] IQA-PyTorch - Quality assessment models
- [ ] BRISQUE - No-reference quality metric
- [ ] OpenCV blur detection

### Grid & Drag-Drop
- [ ] dnd-kit (https://dndkit.com/) - Modern drag-drop
- [ ] react-beautiful-dnd - Atlassian's library
- [ ] react-grid-layout - Draggable grid

### Image Editing
- [ ] Filerobot Image Editor - Full featured, open source
- [ ] react-image-crop - Simple cropping
- [ ] CamanJS - Canvas filters
- [ ] Cropper.js - Versatile cropping

### Photo Gallery UI
- [ ] react-photo-album - Responsive gallery
- [ ] Photoswipe - Lightbox
- [ ] Masonic - Virtual masonry

---

## Competitive Analysis

Research how these handle photo management:
- **Lightroom** - Professional workflow
- **Google Photos** - AI classification, search
- **Apple Photos** - On-device ML, memories
- **Canva** - Layout templates
- **Real estate listing platforms** - How they handle property photos

---

## Deliverables

1. **Recommended tech stack** for each component
2. **Architecture diagram** showing data flow
3. **API cost analysis** for vision classification
4. **UI mockup suggestions** based on best practices
5. **Implementation priority** - what to build first

---

## Integration Points

This feature connects to:
- `job_submissions` - Job context
- Report Builder - Places images into template
- Field registry - `img-exterior-1`, `img-common-2`, etc. (55 image fields)
- Preview panel - Shows placed images in report

The Image Manager replaces manual population of the 55 image fields in the registry with an intelligent workflow.
