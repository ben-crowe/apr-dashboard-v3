

--------------

Info from Perplexity:

You can absolutely build this; the good news is most pieces already exist as React‑friendly, open source building blocks. Below is a concise, opinionated plan mapped to your prompt and targeted at an AI‑assisted Cursor workflow.

***

## 1. Recommended tech stack

**Frontend (React/TypeScript)**  
- Upload & ingestion  
  - Uppy or FilePond for robust, large batch uploads with progress, retries, and chunking.  
  - react-dropzone if you want a lighter, “just drag‑drop and preview” layer.  
- State/UI  
  - React Query (TanStack) to sync with Supabase APIs.  
  - Tailwind or MUI for fast layouting and grid views.

**AI & image processing**  
- Classification (MVP)  
  - Hosted: Roboflow CLIP classification API, configured with your custom labels for appraiser categories.  
  - Future: self‑host CLIP (via Roboflow Inference or your own PyTorch service) if volume justifies it.  
- Quality scoring  
  - Backend: Python + OpenCV + BRISQUE for no‑reference image quality; simple Laplacian variance for blur; histogram‑based exposure check.  
  - Optionally, light client‑side blur/exposure checks in a Web Worker for instant feedback.

**Storage & backend**  
- Supabase:  
  - Storage for raw/web/thumbnail/print variants (your proposed folder structure is solid).  
  - Postgres for job_images / page_layouts / page_layout_slots exactly as you sketched.  
  - Edge Functions (Node or Deno) to orchestrate:  
    - Receive upload metadata, enqueue classification/quality jobs.  
    - Call AI APIs and write back ai_category, quality_score, etc.

**Image editing**  
- Filerobot Image Editor (react-filerobot-image-editor) for crop/rotate/adjust + non‑destructive presets.  
- Or lighter: react-image-crop or react-cropper (Cropper.js wrapper) if you only need crop/rotate.

**Drag‑drop & layout**  
- dnd-kit as the primary drag‑drop library (maintained, flexible, good for constrained grids).  
- react-photo-album or a simple CSS grid for gallery, plus dnd-kit overlays for re‑assignment.  
- For layout pages: dnd-kit + a fixed slot grid (array of slots) instead of a freeform grid layout.

***

## 2. Architecture & data flow (text diagram)

**High‑level flow for a single job:**

1. **Upload step**
   - User opens “Image Manager” for a job.  
   - React upload zone (Uppy/FilePond) accepts 100+ JPG/HEIC.  
   - Client optionally generates tiny preview thumbnails via Canvas for instant UI, then uploads full files to Supabase `uploads/{job_id}/raw/`.

2. **Ingestion API**
   - On each completed upload, client calls `POST /jobs/{job_id}/images` with:
     - storage path, original filename, file size, provisional width/height (from client or Supabase image metadata).  
   - Backend creates `job_images` rows with `status = 'pending'`.

3. **Background processing worker**
   - Triggered by DB insert or storage event:
     - Generate 300px thumbnail + ~1200px web variant + full‑res print copy into `processed/{job_id}/...`.  
     - Extract EXIF (timestamp, GPS) and update `exif_data`, `captured_at`, `gps_lat/lng`.  
     - Call AI classification API with your category labels; store `ai_category`, `ai_subcategory`, `ai_confidence`.  
     - Run quality scoring (blur, exposure, resolution threshold) and set `quality_score`, `is_blurry`, `is_overexposed`, etc.  
     - Mark `status = 'classified'`.

4. **Review UI**
   - React queries `job_images` for the job and renders:  
     - Grid of thumbnails with category/quality chips.  
     - Filters for category, subcategory, quality thresholds, and flags (blurry, overexposed).  
   - Dragging an image to a different category updates `user_category`/`user_subcategory`.

5. **Page layout builder**
   - For each job, backend seeds default `page_layouts` rows (e.g. Exterior 2x2, Interior 3x4).  
   - React renders each layout as a fixed array of slots from `page_layout_slots`.  
   - User drags images from filtered grid into specific slots (dnd-kit), which updates `page_layout_slots.image_id` and the corresponding `job_images.page_assignment` / `slot_position`.  
   - Report Builder later reads `page_layouts` + `page_layout_slots` + captions and populates the 55 registry fields.

6. **Export**
   - Server generates print‑ready PDF pages from `print/` images and layout definitions so all exports are consistent regardless of client screen.

***

## 3. Vision API & cost strategy (practical)

You have roughly two realistic patterns:

### Pattern A: Hosted APIs first (fastest to market)

- Use Roboflow CLIP classification:
  - Give it your concrete labels, e.g. `"exterior front facade", "interior kitchen", "common laundry room", "parking lot", ...`.  
  - Zero‑shot means you can iterate labels without retraining.  
- Alternative / backup:
  - Google Cloud Vision labels + a small rule‑based mapper, but this will be less precise for your categories than CLIP‑style textual prompts.
- Strategy:
  - Start with hosted API for 3–6 months.  
  - Track per‑job image count and total monthly calls; if monthly cost crosses your internal threshold, plan migration to a self‑hosted CLIP.

### Pattern B: Self‑hosted when needed

- Run CLIP + a light service (e.g. FastAPI) on a GPU instance:  
  - Your app sends: image URL + list of candidate labels.  
  - Service returns the best label & score.  
- This is worth it once you are doing enough images that API cost per 1k images is higher than a small dedicated GPU box.

Operational guideline:  
- Only classify images once per job, store the result, and never re‑classify unless user requests rerun.  
- Allow user overrides to always take precedence over AI.

***

## 4. UI patterns & mockup suggestions

### A. Ingestion & grid view

Think in terms of three panels:

1. **Top bar**
   - Job address, date, and quick filters (Exterior, Interior, Systems, Site, Basement/Utility).  
   - Bulk actions: “Select all blurry,” “Select all low‑quality,” “Mark selected as rejected.”

2. **Left filter sidebar**
   - Category tree (your table of categories/subcategories).  
   - Quality sliders (min quality score).  
   - Toggles for “Hide rejected”, “Hide used in layouts”, “Show only unplaced”.

3. **Main grid**
   - React Photo Album or CSS grid; each tile shows:
     - Thumbnail + quick labels: category chip, quality score or color (green/yellow/red), blur/exposure icon.  
     - Hover actions: “Edit”, “Assign to layout”, “View EXIF/metadata”.  
   - Multi‑select via shift+click or drag‑box; batch change category or mark selected as “selected_for_report”.

**Photo review workflow example:**
- Filter: “Exterior + quality >= 0.7, not placed”.  
- Multi‑select the best 8, drag them to “Exterior Layout 1–2” page tabs.  
- Use “Next unreviewed” keyboard shortcut to fly through 100+ images quickly.

### B. Layout management UI

Per layout (e.g. “Exterior 2x2”):

- Right panel: fixed 2x2 grid with 4 slots.  
  - Each slot shows either:
    - Empty state: “Drop photo here” with slot label (e.g. Front, Rear, Left, Right).  
    - Image + editable caption + remove button.  
- Left panel: filtered image list scoped to that layout’s category (e.g. only Exterior).  
- Drag‑drop:  
  - Drag image onto slot; swapping images swaps their `slot_position`.  
  - Keyboard shortcuts: up/down arrow to cycle candidate images for focused slot.

### C. Image editing

- Clicking “Edit” on a tile opens a modal editor with:
  - Crop (with 4:3, 16:9, 1:1, “Report aspect” presets).  
  - Rotate 90° steps.  
  - Simple brightness/contrast sliders + “Auto enhance” button.  
- Save does not replace original:
  - Store `crop_data` and `adjustments` JSON in `job_images`.  
  - Regenerate web and print variants on backend using these parameters before export.

***

## 5. Implementation priority (phased plan)

**Phase 1 – Core ingestion & manual workflow (fastest path to value)**  
1. React upload UI (Uppy/FilePond) + Supabase Storage wiring.  
2. job_images table + minimal UI:
   - Grid of thumbnails.  
   - Manual tagging into your categories.  
   - Manual selection of photos per report section.  
3. Basic layout builder:
   - page_layouts + page_layout_slots.  
   - Drag from grid into 2–3 basic templates (2x2, 3x4).  
   - PDF export using static images (no AI, simple “human sorting”).

**Phase 2 – Automation helpers (AI + quality)**  
4. Background worker for:
   - Thumbnails/web/print variants.  
   - EXIF extraction.  
5. Vision classification:
   - Integrate Roboflow CLIP (or similar) for auto category/subcategory.  
   - UI surface: confidence chips, bulk filter “Review low‑confidence photos”.  
6. Quality scoring:
   - Implement blur + over/under‑exposure.  
   - Display quality badges and add “Suggest best” function:
     - Pre‑select top N images per category for each layout.

**Phase 3 – UX refinement & editing**  
7. Integrate full image editor (Filerobot or Cropper.js wrapper).  
8. Non‑destructive editing pipeline + regeneration of variants.  
9. Keyboard shortcuts, “Next/Previous unreviewed”, “Compare similar photos”.

**Phase 4 – Optimization & advanced ML**  
10. Evaluate costs and, if needed, move from hosted API to self‑hosted CLIP.  
11. Train a custom classifier on your own labeled property photos (especially for nuanced categories like “Mechanical room vs Storage”).  
12. Add more advanced quality metrics or composition heuristics only if they meaningfully improve selection.

***

Here’s a deep‑dive, step‑by‑step plan you can give directly to Cursor/Claude and iterate on. I’ll go from backend up through React components and AI details.

***

## 1. Supabase: storage, schema, and jobs

### 1.1 Buckets and paths

Use two buckets to keep things clean:

- `appraisal-raw`  
  - `uploads/{job_id}/raw/{uuid}.jpg` (original uploads)
- `appraisal-processed`  
  - `processed/{job_id}/thumb/{uuid}.jpg` (≈300px)  
  - `processed/{job_id}/web/{uuid}.jpg` (≈1200px, JPG, compressed)  
  - `processed/{job_id}/print/{uuid}.jpg` (max quality, maybe resized to 3000–4000px long edge)

Store only the **paths** in Postgres and let the app build signed URLs when needed.

Cursor prompt snippet for Supabase bucket helper:

```ts
// supabase/storage.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const rawBucket = 'appraisal-raw';
export const processedBucket = 'appraisal-processed';

export function rawPath(jobId: string, fileId: string) {
  return `uploads/${jobId}/raw/${fileId}.jpg`;
}

export function processedPath(jobId: string, variant: 'thumb' | 'web' | 'print', fileId: string) {
  return `processed/${jobId}/${variant}/${fileId}.jpg`;
}
```

### 1.2 Database schema refinements

Your tables are already solid. A few additions helpful for querying and performance:

```sql
ALTER TABLE job_images
  ADD COLUMN ai_labels JSONB,         -- optional: raw labels from AI
  ADD COLUMN review_notes TEXT,
  ADD COLUMN reviewed_by UUID,        -- user id
  ADD COLUMN reviewed_at TIMESTAMP;

CREATE INDEX idx_job_images_job_id ON job_images(job_id);
CREATE INDEX idx_job_images_category ON job_images(job_id, COALESCE(user_category, ai_category));
CREATE INDEX idx_job_images_status ON job_images(job_id, status);
CREATE INDEX idx_job_images_quality ON job_images(job_id, quality_score DESC);

-- For fast “unplaced images” queries
CREATE INDEX idx_job_images_unplaced
  ON job_images(job_id, selected_for_report, page_assignment)
  WHERE selected_for_report = TRUE AND page_assignment IS NULL;
```

`page_layouts` and `page_layout_slots` are good as‑is; just ensure:

```sql
CREATE INDEX idx_page_layouts_job_id ON page_layouts(job_id);
CREATE INDEX idx_page_layout_slots_layout_id ON page_layout_slots(layout_id);
```

Add a small lookup table for allowed categories if you want validation:

```sql
CREATE TABLE image_categories (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  subcategory VARCHAR(50) NOT NULL
);

-- Seed with your Exterior/Interior/Common/etc list.
```

***

## 2. Backend services: ingestion, processing, AI

Assume Next.js (App Router) + Supabase, but the same shape works in Express/Fastify.

### 2.1 Ingestion API (after upload)

After the client uploads an image directly to Supabase Storage, it should call a small API endpoint to create the DB row and enqueue processing.

Route idea:

- `POST /api/jobs/:jobId/images`

Body:

```json
{
  "storage_path": "uploads/{job_id}/raw/{uuid}.jpg",
  "original_filename": "IMG_1234.JPG",
  "file_size": 2342345,
  "width": 4032,
  "height": 3024
}
```

Handler skeleton:

```ts
// app/api/jobs/[jobId]/images/route.ts
import { supabase } from '@/lib/supabase';
import { randomUUID } from 'crypto';

export async function POST(req: Request, { params }: { params: { jobId: string } }) {
  const jobId = params.jobId;
  const body = await req.json();

  const id = randomUUID();

  const { error } = await supabase
    .from('job_images')
    .insert({
      id,
      job_id: jobId,
      original_filename: body.original_filename,
      storage_path: body.storage_path,
      file_size: body.file_size,
      width: body.width,
      height: body.height,
      status: 'pending',
    });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  // Option: enqueue processing job (e.g. via a jobs table or external queue)
  await supabase.from('image_jobs').insert({
    job_image_id: id,
    type: 'process',
    status: 'queued',
  });

  return new Response(JSON.stringify({ id }), { status: 201 });
}
```

You can also skip a formal queue table and have a cron/worker poll for `status = 'pending'`.

### 2.2 Background processor

Use a separate worker process (Node, Deno, or Python) that:

1. Finds `job_images` rows with `status = 'pending'`.  
2. For each:
   - Download the raw file from Supabase.  
   - Generate thumb/web/print variants.  
   - Extract EXIF datetime + GPS.  
   - Run AI classification.  
   - Run quality scoring.  
   - Update row and set `status = 'classified'`.

Example job loop in Node (pseudo):

```ts
async function processPendingImages() {
  const { data: images } = await supabase
    .from('job_images')
    .select('*')
    .eq('status', 'pending')
    .limit(20);

  for (const img of images ?? []) {
    try {
      // 1. Download original
      const { data: file } = await supabase.storage
        .from(rawBucket)
        .download(img.storage_path);

      // 2. Generate variants (use sharp)
      const { thumbPath, webPath, printPath } = await generateVariants(img, file);

      // 3. EXIF
      const exif = await extractExif(file);

      // 4. Classification
      const cls = await classifyImageWithClip(file);

      // 5. Quality
      const quality = await scoreQuality(file);

      await supabase.from('job_images')
        .update({
          thumbnail_path: thumbPath,
          web_path: webPath,
          print_path: printPath,
          exif_data: exif.raw,
          captured_at: exif.capturedAt,
          gps_lat: exif.lat,
          gps_lng: exif.lng,
          ai_category: cls.category,
          ai_subcategory: cls.subcategory,
          ai_confidence: cls.score,
          ai_labels: cls.rawLabels,
          quality_score: quality.score,
          is_blurry: quality.isBlurry,
          is_overexposed: quality.isOver,
          is_underexposed: quality.isUnder,
          status: 'classified',
          updated_at: new Date().toISOString(),
        })
        .eq('id', img.id);
    } catch (err) {
      console.error('processing failed', img.id, err);
      await supabase.from('job_images')
        .update({ status: 'error' })
        .eq('id', img.id);
    }
  }
}
```

You can run this worker every minute via a simple cron or keep it as a long‑running loop with sleep.

***

## 3. React: upload and ingestion

### 3.1 Bulk upload with Uppy

Uppy is good for folders + progress + retries. A basic integration:

```tsx
// components/ImageUploadZone.tsx
'use client';

import React, { useEffect } from 'react';
import Uppy from '@uppy/core';
import Dashboard from '@uppy/react/lib/Dashboard';
import XHRUpload from '@uppy/xhr-upload';
import { rawBucket, rawPath } from '@/lib/storage';
import { v4 as uuid } from 'uuid';

export function ImageUploadZone({ jobId }: { jobId: string }) {
  const [uppy] = React.useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles: 500,
        allowedFileTypes: ['image/*'],
      },
      autoProceed: false,
    })
  );

  useEffect(() => {
    uppy.use(XHRUpload, {
      endpoint: `/api/upload/raw?jobId=${jobId}`, // you implement this to proxy to Supabase
      fieldName: 'file',
      formData: true,
    });

    uppy.on('complete', (result) => {
      // Option: refresh image list
      console.log('Upload complete', result);
    });

    return () => uppy.close();
  }, [uppy, jobId]);

  return (
    <Dashboard
      uppy={uppy}
      proudlyDisplayPoweredByUppy={false}
      note="Drop your inspection photos here (100+ supported)"
      height={400}
    />
  );
}
```

Alternate pattern: upload directly with Supabase JS client per file (simpler to implement) and skip XHRUpload. For each file you:

1. Generate a UUID.  
2. Call `supabase.storage.from(rawBucket).upload(rawPath(jobId, id), file)` from the browser.  
3. Then call `/api/jobs/:jobId/images` with that info.

***

## 4. React: grid, filters, and review UI

### 4.1 Hook to fetch images

Use TanStack Query:

```ts
// hooks/useJobImages.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export type ImageFilters = {
  category?: string | null;
  subcategory?: string | null;
  minQuality?: number | null;
  hideRejected?: boolean;
  hidePlaced?: boolean;
};

export function useJobImages(jobId: string, filters: ImageFilters) {
  return useQuery({
    queryKey: ['job-images', jobId, filters],
    queryFn: async () => {
      let query = supabase.from('job_images').select('*').eq('job_id', jobId);

      if (filters.category) {
        query = query.or(
          `ai_category.eq.${filters.category},user_category.eq.${filters.category}`
        );
      }
      if (filters.subcategory) {
        query = query.or(
          `ai_subcategory.eq.${filters.subcategory},user_subcategory.eq.${filters.subcategory}`
        );
      }
      if (filters.minQuality != null) {
        query = query.gte('quality_score', filters.minQuality);
      }
      if (filters.hideRejected) {
        query = query.eq('selected_for_report', true);
      }
      if (filters.hidePlaced) {
        query = query.is('page_assignment', null);
      }

      const { data, error } = await query.order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}
```

### 4.2 Grid component + selection

Use a CSS grid or react-photo-album:

```tsx
// components/ImageGrid.tsx
import React from 'react';
import { useJobImages, ImageFilters } from '@/hooks/useJobImages';

type Props = {
  jobId: string;
  filters: ImageFilters;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onOpenEditor: (id: string) => void;
};

export function ImageGrid(props: Props) {
  const { data, isLoading } = useJobImages(props.jobId, props.filters);

  if (isLoading) return <div>Loading images…</div>;
  if (!data || data.length === 0) return <div>No images yet.</div>;

  return (
    <div className="grid grid-cols-6 gap-2">
      {data.map((img) => {
        const isSelected = props.selectedIds.includes(img.id);
        // Build a public or signed URL for thumbnail
        const thumbUrl = getPublicThumbUrl(img.thumbnail_path); // implement this helper

        return (
          <button
            key={img.id}
            onClick={() => props.onToggleSelect(img.id)}
            className={`relative border rounded overflow-hidden ${
              isSelected ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <img src={thumbUrl} className="w-full h-24 object-cover" />
            <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1 rounded">
              {img.user_category ?? img.ai_category}
            </div>
            <div className="absolute bottom-1 right-1 flex gap-1">
              {/* quality badge */}
              <span className="bg-black/60 text-white text-[10px] px-1 rounded">
                {Math.round((img.quality_score ?? 0) * 100)}%
              </span>
              {/* blur / exposure icons could go here */}
            </div>
          </button>
        );
      })}
    </div>
  );
}
```

Add a filter bar above with category dropdowns and sliders.

***

## 5. React: layout builder with dnd-kit

### 5.1 Data model in UI

Fetch layouts and slots:

```ts
// hooks/useLayouts.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useLayouts(jobId: string) {
  return useQuery({
    queryKey: ['layouts', jobId],
    queryFn: async () => {
      const { data: layouts, error } = await supabase
        .from('page_layouts')
        .select('*')
        .eq('job_id', jobId)
        .order('sort_order', { ascending: true });
      if (error) throw error;

      const { data: slots, error: slotErr } = await supabase
        .from('page_layout_slots')
        .select('*')
        .in(
          'layout_id',
          layouts.map((l) => l.id)
        )
        .order('slot_position', { ascending: true });
      if (slotErr) throw slotErr;

      return { layouts, slots };
    },
  });
}
```

### 5.2 Layout page UI

Use dnd-kit Sortable in a fixed grid:

```tsx
// components/LayoutPage.tsx
'use client';

import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableSlot } from './SortableSlot';

export function LayoutPage({
  layout,
  slots,
  imagesById,
  onAssignImage,
}: {
  layout: any;
  slots: any[];
  imagesById: Record<string, any>;
  onAssignImage: (slotId: string, imageId: string | null) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor));

  const slotIds = slots.map((s) => s.id);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const imageId = active.id.toString();
    const slotId = over.id.toString();

    // If dragging from grid to slot, you’ll represent it differently (see below),
    // but idea is: detect target slot and call onAssignImage.
    onAssignImage(slotId, imageId);
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={slotIds} strategy={rectSortingStrategy}>
        <div className="grid gap-2"
          style={{
            gridTemplateColumns:
              layout.layout_template === '2x2'
                ? 'repeat(2, minmax(0, 1fr))'
                : layout.layout_template === '3x4'
                  ? 'repeat(3, minmax(0, 1fr))'
                  : 'repeat(1, minmax(0, 1fr))',
          }}
        >
          {slots.map((slot) => (
            <SortableSlot
              key={slot.id}
              id={slot.id}
              image={slot.image_id ? imagesById[slot.image_id] : null}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
```

`SortableSlot` represents each slot as a drop target. To drag images from the gallery to slots, you can:

- Represent gallery items as draggable but not part of the SortableContext (plain `Draggable` pattern in dnd-kit) and detect drops onto slot droppable areas.  
- Or use `@dnd-kit/core` only for cross‑containers and manually handle the “assigned to this slot” logic.

Update API when a slot is changed:

```ts
// app/api/layout-slots/[slotId]/assign/route.ts
import { supabase } from '@/lib/supabase';

export async function POST(req: Request, { params }: { params: { slotId: string } }) {
  const { imageId } = await req.json();

  const { data: slot, error: slotErr } = await supabase
    .from('page_layout_slots')
    .select('layout_id, slot_position')
    .eq('id', params.slotId)
    .single();

  if (slotErr) return new Response(slotErr.message, { status: 400 });

  const updates = [
    supabase.from('page_layout_slots').update({ image_id: imageId }).eq('id', params.slotId),
    supabase
      .from('job_images')
      .update({
        selected_for_report: true,
        page_assignment: slot.layout_id,
        slot_position: slot.slot_position,
      })
      .eq('id', imageId),
  ];

  const results = await Promise.all(updates);
  const error = results.find((r) => r.error)?.error;
  if (error) return new Response(error.message, { status: 400 });

  return new Response(JSON.stringify({ ok: true }));
}
```

***

## 6. Image editing (non‑destructive)

### 6.1 React integration with Filerobot

Modal editor that saves only params:

```tsx
// components/ImageEditorModal.tsx
'use client';

import React from 'react';
import FilerobotImageEditor, {
  TABS,
  TOOLS,
} from 'react-filerobot-image-editor';

export function ImageEditorModal({
  isOpen,
  onClose,
  imageUrl,
  onSaveAdjustments,
}: {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onSaveAdjustments: (data: any) => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-[900px] h-[600px] overflow-hidden">
        <FilerobotImageEditor
          source={imageUrl}
          onSave={(editedImageObject, designState) => {
            // designState contains crop/filters/adjustments
            onSaveAdjustments(designState);
            onClose();
          }}
          onClose={onClose}
          tabsIds={[TABS.ADJUST, TABS.FILTERS, TABS.CROP]}
          defaultToolId={TOOLS.CROP}
          cropPresets={[
            { titleKey: 'Report 4:3', ratio: 4 / 3 },
            { titleKey: 'Square', ratio: 1 },
          ]}
        />
      </div>
    </div>
  );
}
```

When `onSaveAdjustments` fires:

- Update `crop_data` + `adjustments` for that `job_images` row.  
- Optionally enqueue a “re-render variants” job so your backend re‑applies adjustments to `web` and `print`.

Backend handler:

```ts
// app/api/images/[imageId]/edit/route.ts
import { supabase } from '@/lib/supabase';

export async function POST(req: Request, { params }: { params: { imageId: string } }) {
  const body = await req.json(); // { crop_data, adjustments }

  const { error } = await supabase
    .from('job_images')
    .update({
      crop_data: body.crop_data,
      adjustments: body.adjustments,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.imageId);

  if (error) return new Response(error.message, { status: 400 });

  // enqueue re-render job if you want server-side processed versions
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
```

Server re-render logic applies the crop/adjustments with an image library (e.g. sharp or PIL).

***

## 7. AI classification: concrete plan

### 7.1 Category prompt design for CLIP

Prepare a fixed list of text labels tuned for your buckets:

- Exterior:
  - “Exterior front facade of building”  
  - “Exterior rear of building”  
  - “Exterior left side of building”  
  - “Exterior right side of building”  
  - “Exterior close-up property feature”  

- Interior Units:
  - “Interior kitchen”  
  - “Interior bathroom”  
  - “Interior bedroom”  
  - “Interior living room”  
  - “Interior hallway”  

- Common Areas:
  - “Common area lobby or building entrance”  
  - “Common corridor or hallway”  
  - “Amenity space (gym, lounge, pool)”  
  - “Common laundry room”  

- Building Systems:
  - “Mechanical HVAC equipment”  
  - “Electrical panel”  
  - “Plumbing fixtures or pipes”  
  - “Water heater or boiler”  
  - “Roof or roof membrane”  

- Site:
  - “Parking lot or garage”  
  - “Landscaping or yard”  
  - “Street view around property”  
  - “Property signage”  

- Basement/Utility:
  - “Basement mechanical room”  
  - “Basement storage area”  
  - “Basement foundation walls”  

Use CLIP’s “compare image to a list of texts” endpoint. For each image:

1. Send the image.  
2. Send the array of text labels.  
3. Receive scores; pick the top label.  
4. Map label → `ai_category` (Exterior, Interior Units, etc.) + `ai_subcategory` (Front facade, Kitchen, etc.).  
5. Store both the chosen label and the raw scores.

### 7.2 Practical tricks

- Add a generic “Other / Uncertain” label to catch weird images.  
- If top score is below a threshold (e.g. 0.45), mark `ai_category = 'uncertain'` and show a “Needs review” badge.  
- Keep your list of labels in a DB table or config so you can tweak text without code deploy.

***

## 8. Quality scoring details

Implement minimal but effective metrics:

1. **Blur detection (Laplacian variance)**  
   - Convert to grayscale.  
   - Compute Laplacian; variance < threshold → blurry.  
   - Map variance to a normalized 0–1 score (e.g. `score_blur = clamp(var / k, 0, 1)`).

2. **Exposure**  
   - Build histogram of luminance.  
   - If most pixels are near 0 → underexposed; near 255 → overexposed.  
   - Map to `is_underexposed`, `is_overexposed`, and a `score_exposure` in 0–1.

3. **Resolution adequacy**  
   - If min(width, height) < required print resolution threshold (e.g. 1500px), down‑score.

4. **Overall quality_score**  
   - Combine: `quality_score = 0.5 * score_blur + 0.3 * score_exposure + 0.2 * resolution_score`.  
   - Clamp.[1]

In your UI, show a color dot:

- 0.8–1.0: green.  
- 0.6–0.79: yellow.  
- <0.6: red, with tooltip like “Blurry” or “Underexposed”.

Add a “Pick best for this section” button that:

- Filters candidate images by category (e.g. Exterior).  
- Sorts by `quality_score` desc.  
- Auto‑fills available layout slots with top N images.

***

## 9. Export to report builder

Your Report Builder/field registry likely expects:

- `img-exterior-1`, `img-exterior-2`, … up to 55 fields.  
- Each also has a caption.

Use page layouts + slots as the “source of truth” and have a small mapping layer:

1. Define a deterministic ordering of layouts and slots for each page type.  
2. For each slot with an image:
   - Compute the target field key (e.g. `img-exterior-1`).  
   - Write to your registry table: `field_name = 'img-exterior-1'`, `value = image.print_path`, `caption = slot.caption`.

You can run this as:

- A `Generate Report` button that calls an API:
  - Reads all `page_layouts` / `page_layout_slots` for the job.  
  - Applies mapping → populates registry fields.  
  - Kicks off PDF generation.

***

## 10. Next steps with Cursor

You can now progressively feed Cursor prompts like:

1. **Backend ingestion & DB wiring**

> Build a Next.js App Router API route `app/api/jobs/[jobId]/images/route.ts` that inserts job_images rows in Supabase as described here: [paste the schema and ingestion flow from section 2.1]. Use TypeScript and the existing Supabase client in `lib/supabase.ts`.

2. **Image upload component**

> Build a React `ImageUploadZone` component using Supabase JS client directly: it should take `jobId`, allow dropping 100+ images, upload each to the `appraisal-raw` bucket using the `rawPath(jobId, uuid)` helper, and then call `/api/jobs/:jobId/images` with the metadata. Show progress per file.

3. **Grid & filters**

> Implement `useJobImages` and `ImageGrid` as described, with filters for category, quality score, and “hide placed/hide rejected” toggles. Use Tailwind for layout and TanStack Query for data.

4. **Layout builder**

> Implement `LayoutPage` and `SortableSlot` with dnd-kit such that I can drag images from the ImageGrid into fixed slots and a call is made to `/api/layout-slots/[slotId]/assign` to persist.

5. **Optional AI + worker**

> Scaffold a simple Node worker that loads images from Supabase, runs dummy classification and dummy quality scoring (random numbers) and updates job_images. Replace with real CLIP + OpenCV implementations once wiring works.

-------------

Continuing with a “you can paste this into Cursor and build” level of detail. I’ll focus on concrete file structure, core components, and workflows.

***

## 1. Minimal project structure for the MVP

Assume: Next.js + App Router + TypeScript + Supabase + React Query + Tailwind.

```txt
src/
  app/
    layout.tsx
    page.tsx                      # dashboard or job list
    jobs/
      [jobId]/
        page.tsx                  # Image Manager main screen
    api/
      jobs/
        [jobId]/
          images/
            route.ts              # POST: create job_images row after upload
      layout-slots/
        [slotId]/
          assign/
            route.ts              # POST: assign image to slot
      images/
        [imageId]/
          edit/
            route.ts              # POST: save crop/adjustments
  components/
    ImageUploadZone.tsx
    ImageGrid.tsx
    FiltersPanel.tsx
    ImageManagerLayout.tsx        # main layout combining grid + layout builder
    LayoutTabs.tsx
    LayoutPage.tsx
    SortableSlot.tsx
    ImageEditorModal.tsx
  hooks/
    useJobImages.ts
    useLayouts.ts
  lib/
    supabase.ts
    storage.ts
    api.ts                        # helper for calling Next APIs
```

You can ask Cursor to scaffold each file with the code snippets below as starting points.

***

## 2. Image Manager main page

### 2.1 Job page (top-level container)

`app/jobs/[jobId]/page.tsx`:

```tsx
import { ImageManagerLayout } from '@/components/ImageManagerLayout';

export default function JobPage({ params }: { params: { jobId: string } }) {
  return (
    <div className="flex flex-col h-screen">
      <header className="border-b px-4 py-2 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Image Manager</h1>
          <p className="text-xs text-gray-500">
            Job ID: {params.jobId}
          </p>
        </div>
        {/* future: job address, date, etc */}
      </header>

      <ImageManagerLayout jobId={params.jobId} />
    </div>
  );
}
```

### 2.2 ImageManagerLayout: three-pane layout

`components/ImageManagerLayout.tsx`:

```tsx
'use client';

import React from 'react';
import { ImageUploadZone } from './ImageUploadZone';
import { FiltersPanel } from './FiltersPanel';
import { ImageGrid } from './ImageGrid';
import { LayoutTabs } from './LayoutTabs';
import { ImageEditorModal } from './ImageEditorModal';
import { useJobImages, ImageFilters } from '@/hooks/useJobImages';

export function ImageManagerLayout({ jobId }: { jobId: string }) {
  const [filters, setFilters] = React.useState<ImageFilters>({});
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [editorImageId, setEditorImageId] = React.useState<string | null>(null);

  const { data: images } = useJobImages(jobId, filters);

  const imagesById = React.useMemo(
    () =>
      (images ?? []).reduce<Record<string, any>>((acc, img) => {
        acc[img.id] = img;
        return acc;
      }, {}),
    [images]
  );

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Upload */}
      <div className="border-b px-4 py-2">
        <ImageUploadZone jobId={jobId} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: filters + grid */}
        <div className="w-2/3 border-r flex flex-col min-w-[500px]">
          <FiltersPanel
            filters={filters}
            onChange={setFilters}
            selectedCount={selectedIds.length}
          />
          <div className="flex-1 overflow-auto p-2">
            <ImageGrid
              jobId={jobId}
              filters={filters}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onOpenEditor={(id) => setEditorImageId(id)}
            />
          </div>
        </div>

        {/* Right: layout builder */}
        <div className="flex-1 flex flex-col">
          <LayoutTabs jobId={jobId} imagesById={imagesById} />
        </div>
      </div>

      <ImageEditorModal
        isOpen={!!editorImageId}
        onClose={() => setEditorImageId(null)}
        image={
          editorImageId ? imagesById[editorImageId] : null
        }
      />
    </div>
  );
}
```

***

## 3. FiltersPanel (category + quality)

`components/FiltersPanel.tsx`:

```tsx
import React from 'react';
import { ImageFilters } from '@/hooks/useJobImages';

const CATEGORIES = [
  { value: '', label: 'All categories' },
  { value: 'Exterior', label: 'Exterior' },
  { value: 'Interior Units', label: 'Interior Units' },
  { value: 'Common Areas', label: 'Common Areas' },
  { value: 'Building Systems', label: 'Building Systems' },
  { value: 'Site', label: 'Site' },
  { value: 'Basement/Utility', label: 'Basement/Utility' },
];

type Props = {
  filters: ImageFilters;
  onChange: (filters: ImageFilters) => void;
  selectedCount: number;
};

export function FiltersPanel({ filters, onChange, selectedCount }: Props) {
  return (
    <div className="px-3 py-2 flex items-center gap-4 bg-gray-50 border-b">
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-600">Category</label>
        <select
          className="border rounded text-xs px-1 py-0.5"
          value={filters.category ?? ''}
          onChange={(e) =>
            onChange({ ...filters, category: e.target.value || null })
          }
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-600">Min quality</label>
        <input
          type="range"
          min={0}
          max={100}
          value={(filters.minQuality ?? 0) * 100}
          onChange={(e) =>
            onChange({
              ...filters,
              minQuality: Number(e.target.value) / 100,
            })
          }
        />
        <span className="text-xs text-gray-500 w-10">
          {Math.round((filters.minQuality ?? 0) * 100)}%
        </span>
      </div>

      <label className="flex items-center gap-1 text-xs text-gray-600">
        <input
          type="checkbox"
          checked={!!filters.hideRejected}
          onChange={(e) =>
            onChange({ ...filters, hideRejected: e.target.checked })
          }
        />
        Hide rejected
      </label>

      <label className="flex items-center gap-1 text-xs text-gray-600">
        <input
          type="checkbox"
          checked={!!filters.hidePlaced}
          onChange={(e) =>
            onChange({ ...filters, hidePlaced: e.target.checked })
          }
        />
        Hide placed
      </label>

      <div className="ml-auto text-xs text-gray-500">
        Selected: {selectedCount}
      </div>
    </div>
  );
}
```

You can extend with subcategory dropdowns later.

***

## 4. LayoutTabs and LayoutPage wiring

### 4.1 LayoutTabs: tabs for each page layout

`components/LayoutTabs.tsx`:

```tsx
'use client';

import React from 'react';
import { useLayouts } from '@/hooks/useLayouts';
import { LayoutPage } from './LayoutPage';
import { apiPost } from '@/lib/api';

type Props = {
  jobId: string;
  imagesById: Record<string, any>;
};

export function LayoutTabs({ jobId, imagesById }: Props) {
  const { data, isLoading } = useLayouts(jobId);
  const [activeLayoutId, setActiveLayoutId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (data?.layouts?.length && !activeLayoutId) {
      setActiveLayoutId(data.layouts[0].id);
    }
  }, [data, activeLayoutId]);

  if (isLoading) return <div className="p-3 text-sm">Loading layouts…</div>;
  if (!data || data.layouts.length === 0)
    return <div className="p-3 text-sm">No layouts defined for this job.</div>;

  const activeLayout = data.layouts.find((l) => l.id === activeLayoutId)!;
  const layoutSlots = data.slots.filter((s) => s.layout_id === activeLayoutId);

  async function handleAssignImage(slotId: string, imageId: string | null) {
    await apiPost(`/api/layout-slots/${slotId}/assign`, { imageId });
    // Optionally trigger a refetch via React Query invalidate
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b flex">
        {data.layouts.map((layout) => (
          <button
            key={layout.id}
            onClick={() => setActiveLayoutId(layout.id)}
            className={`px-3 py-2 text-xs border-b-2 ${
              activeLayoutId === layout.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500'
            }`}
          >
            {layout.page_type} ({layout.layout_template})
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-3">
        <LayoutPage
          layout={activeLayout}
          slots={layoutSlots}
          imagesById={imagesById}
          onAssignImage={handleAssignImage}
        />
      </div>
    </div>
  );
}
```

### 4.2 SortableSlot basic implementation

`components/SortableSlot.tsx`:

```tsx
'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export function SortableSlot({
  id,
  image,
}: {
  id: string;
  image: any | null;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`border rounded aspect-[4/3] flex items-center justify-center relative bg-gray-50 ${
        isOver ? 'ring-2 ring-blue-400' : ''
      }`}
    >
      {image ? (
        <>
          <img
            src={getPublicThumbUrl(image.thumbnail_path)}
            className="w-full h-full object-cover rounded"
          />
          <div className="absolute bottom-1 left-1 right-1">
            <input
              className="w-full bg-black/60 text-white text-[10px] px-1 py-0.5 rounded"
              defaultValue={image.caption ?? ''}
              // hook up onBlur -> API to save caption if you want
            />
          </div>
        </>
      ) : (
        <span className="text-xs text-gray-400">Drop photo here</span>
      )}
    </div>
  );
}

// you already need a helper to build public URLs
declare function getPublicThumbUrl(path: string): string;
```

***

## 5. Simple draggable from grid to slots

To keep it beginner‑friendly, start with this pattern:

- Each grid tile is a draggable with id = imageId.  
- Each slot is a droppable with id = slotId.  
- In `DndContext.onDragEnd`, if `over` is a slot, call assign API.

Update `ImageGrid` to make items draggable:

```tsx
import { useDraggable } from '@dnd-kit/core';

function DraggableImageTile({ img, isSelected, onClick }: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: img.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : {};

  const thumbUrl = getPublicThumbUrl(img.thumbnail_path);

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      type="button"
      onClick={onClick}
      className={`relative border rounded overflow-hidden ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <img src={thumbUrl} className="w-full h-24 object-cover" />
      {/* badges as before */}
    </button>
  );
}
```

Then wrap both grid and layout in one `DndContext` at the ImageManager level (or LayoutTabs level) and use `onDragEnd` to detect drops.

***

## 6. Supabase image URLs and transformations

You can use Supabase’s image transformations instead of pre‑generating thumbs, at least for web usage.

Helper:

```ts
// lib/storage.ts
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export function publicImageUrl(bucket: string, path: string, options?: { width?: number; quality?: number }) {
  const base = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
  if (!options) return base;

  const params = new URLSearchParams();
  if (options.width) params.set('width', String(options.width));
  if (options.quality) params.set('quality', String(options.quality));

  return `${base}?${params.toString()}`;
}
```

Then:

```ts
function getPublicThumbUrl(path: string) {
  return publicImageUrl('appraisal-processed', path, { width: 300, quality: 65 });
}
```

For performance/cost, you can still pre‑generate real thumbnails server‑side and just serve them directly (no transformation query string).

***

## 7. Keyboard shortcuts & workflow polish

You can progressively add “pro” touches inspired by Lightroom/Photos apps:

- Press `G` = go to grid only (hide layout pane).  
- Press `L` = focus layout only (hide grid pane).  
- Arrow keys:
  - Left/right: move selection between grid images.  
  - Up/down: change filters (e.g. next category).  
- Spacebar: open a quick loupe/lightbox to inspect.

Implementation tip: use a global hotkey hook like `react-hotkeys-hook` to keep it simple.

***

## 8. Suggested build order with Cursor

If you want to use this conversation as a build script with Cursor/Claude Opus, run through these prompts in sequence:

1. **Scaffold Supabase integration and DB types**

> Generate a `lib/supabase.ts` file for a Next.js 14 App Router project using Supabase JS client. Then generate TypeScript types for the tables `job_images`, `page_layouts`, and `page_layout_slots` matching this schema: [paste your final SQL].

2. **Create upload zone**

> Implement `ImageUploadZone` that uploads dropped image files directly to Supabase `appraisal-raw` bucket using the `rawPath(jobId, uuid)` helper. After each upload succeeds, call `POST /api/jobs/:jobId/images` with storage_path, filename, width, height, file_size. Show progress per file.

3. **Create useJobImages + ImageGrid**

> Implement `useJobImages` hook and `ImageGrid` that shows thumbnails for the current job. Support selection, quality badge, and category chip using ai_category/user_category and quality_score.

4. **Create FiltersPanel**

> Implement `FiltersPanel` to control category, minQuality, hideRejected, and hidePlaced filters, then wire it into `ImageManagerLayout` as shown.

5. **Create layout tables and LayoutTabs + LayoutPage**

> Implement `useLayouts`, `LayoutTabs`, `LayoutPage`, and `SortableSlot` as above. Then implement `POST /api/layout-slots/[slotId]/assign` to update page_layout_slots and job_images.

6. **Wire dnd-kit for drag grid → slot**

> Use @dnd-kit/core to make grid tiles draggable and slots droppable. On drop, call assign API, then refresh affected queries.

7. **Add ImageEditorModal**

> Implement `ImageEditorModal` using `react-filerobot-image-editor` or `react-image-crop`. Save crop/adjustments via `POST /api/images/[imageId]/edit`, storing `crop_data` and `adjustments`.

Once you have those in place, the system is usable even before you plug in real AI and quality scoring. The AI and worker can be layered on without changing the UI contracts.

If you’d like, the next step can be a concrete “worker” implementation in Python (OpenCV + simple quality metrics) or a detailed example of calling a CLIP‑style classification API and mapping labels to your category/subcategory fields.

Below is a more detailed layer focusing on: (1) a concrete AI/quality worker, (2) a realistic CLIP classification approach, and (3) practical considerations for your team around tradeoffs and extensions. Treat everything as a strong starting point, not a “must follow” spec.

***

## 1. AI/quality worker: Python + OpenCV + simple CLIP client

### 1.1 Worker responsibilities

For each new image in `job_images` with `status = 'pending'`, the worker should:

1. Download the original from storage.  
2. Generate thumbnail/web/print variants if you don’t rely on on‑the‑fly transforms.  
3. Extract EXIF data (time, GPS).  
4. Run classification (CLIP/hosted model).  
5. Run quality scoring (blur + exposure + resolution).  
6. Update `job_images` with all of the above and mark `status = 'classified'`.

### 1.2 Basic skeleton (Python)

Very simplified example to give your team a pattern:

```py
import io
import time
import requests
from PIL import Image, ExifTags
import cv2
import numpy as np
from supabase import create_client, Client

SUPABASE_URL = "..."
SUPABASE_SERVICE_KEY = "..."
RAW_BUCKET = "appraisal-raw"
PROCESSED_BUCKET = "appraisal-processed"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def main_loop():
    while True:
        process_pending_batch()
        time.sleep(5)

def process_pending_batch(limit: int = 20):
    res = supabase.table("job_images").select("*").eq("status", "pending").limit(limit).execute()
    images = res.data or []
    for img in images:
        try:
            process_single_image(img)
        except Exception as e:
            print("error processing", img["id"], e)
            supabase.table("job_images").update({"status": "error"}).eq("id", img["id"]).execute()

def process_single_image(img_row):
    # 1) download from storage
    storage_path = img_row["storage_path"]
    data = download_from_storage(RAW_BUCKET, storage_path)

    # 2) PIL + OpenCV
    pil_img = Image.open(io.BytesIO(data)).convert("RGB")
    cv_img = cv2.imdecode(np.frombuffer(data, np.uint8), cv2.IMREAD_COLOR)

    # 3) variants
    thumb_path, web_path, print_path = save_variants(img_row["job_id"], img_row["id"], pil_img)

    # 4) EXIF
    exif_data, captured_at, gps_lat, gps_lng = extract_exif(pil_img)

    # 5) classification
    cls = classify_with_clip(data)

    # 6) quality
    q = quality_metrics(cv_img)

    # 7) DB update
    supabase.table("job_images").update({
        "thumbnail_path": thumb_path,
        "web_path": web_path,
        "print_path": print_path,
        "exif_data": exif_data,
        "captured_at": captured_at,
        "gps_lat": gps_lat,
        "gps_lng": gps_lng,
        "ai_category": cls["category"],
        "ai_subcategory": cls["subcategory"],
        "ai_confidence": cls["confidence"],
        "ai_labels": cls["raw_labels"],
        "quality_score": q["score"],
        "is_blurry": q["is_blurry"],
        "is_overexposed": q["is_over"],
        "is_underexposed": q["is_under"],
        "status": "classified",
    }).eq("id", img_row["id"]).execute()

def download_from_storage(bucket, path):
    # Use HTTP signed URL or direct storage API; implementation depends on stack
    ...

def save_variants(job_id, image_id, pil_img):
    # Example: create thumb (300px), web (~1200px), print (~3000px)
    ...
    return thumb_path, web_path, print_path

def extract_exif(img: Image.Image):
    raw_exif = {}
    dt = None
    lat = lng = None
    try:
        exif = img._getexif() or {}
        exif_decoded = {ExifTags.TAGS.get(k, k): v for k, v in exif.items()}
        raw_exif = exif_decoded
        dt = exif_decoded.get("DateTimeOriginal")
        # parse GPS if present
        gps_info = exif_decoded.get("GPSInfo")
        if gps_info:
            lat, lng = parse_gps(gps_info)
    except Exception:
        pass
    return raw_exif, dt, lat, lng

def classify_with_clip(image_bytes: bytes):
    # Pseudocode; replace with Roboflow / other CLIP service
    texts = [
        "Exterior front facade of building",
        "Exterior rear of building",
        "Interior kitchen",
        "Interior bathroom",
        "Interior bedroom",
        "Interior living room",
        "Common lobby or entrance",
        "Common corridor or hallway",
        "Amenity space such as gym or lounge",
        "Common laundry room",
        "Parking lot or garage",
        "Landscaping or yard",
        "Street view around property",
        "Property signage",
        "Mechanical HVAC equipment",
        "Electrical panel",
        "Plumbing fixtures or pipes",
        "Water heater or boiler",
        "Roof or roof membrane",
        "Basement mechanical room",
        "Basement storage area",
        "Basement foundation walls",
        "Other or unknown property photo"
    ]

    # send to your CLIP service; get scores per text
    scores = call_clip_api(image_bytes, texts)

    # pick top
    best_idx = int(np.argmax(scores))
    best_text = texts[best_idx]
    best_score = float(scores[best_idx])

    category, subcategory = map_text_to_fields(best_text)
    return {
        "category": category,
        "subcategory": subcategory,
        "confidence": best_score,
        "raw_labels": [{"label": t, "score": float(s)} for t, s in zip(texts, scores)],
    }

def quality_metrics(cv_img):
    gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)

    # Blur via Laplacian variance
    lap = cv2.Laplacian(gray, cv2.CV_64F)
    var_lap = lap.var()
    blur_score = min(var_lap / 200.0, 1.0)  # tune 200 based on your data
    is_blurry = var_lap < 50.0             # threshold to mark as blurry

    # Exposure via histogram
    hist = cv2.calcHist([gray], [0], None, [256], [0, 256]).flatten()
    hist_norm = hist / (hist.sum() + 1e-8)
    dark_frac = hist_norm[:40].sum()
    bright_frac = hist_norm[216:].sum()

    is_under = dark_frac > 0.55
    is_over = bright_frac > 0.55
    exposure_score = 1.0 - max(dark_frac, bright_frac)  # 1 = well-balanced

    # Resolution adequacy relative to print
    h, w = gray.shape
    min_side = min(w, h)
    res_score = min(1.0, max(0.0, (min_side - 1200) / 1200.0))  # >2400px => near 1, 1200px => 0

    # Combine
    score = 0.5 * blur_score + 0.3 * exposure_score + 0.2 * res_score
    return {
        "score": float(max(0.0, min(1.0, score))),
        "is_blurry": bool(is_blurry),
        "is_under": bool(is_under),
        "is_over": bool(is_over),
    }

if __name__ == "__main__":
    main_loop()
```

Important:

- All thresholds here are placeholders. Your team should validate on real appraiser photos and tune (or even add user‑level toggles for what counts as “too blurry”).  
- You can also create separate modules for classification vs quality so you can swap implementations later (e.g., move from hosted CLIP to self‑hosted).

***

## 2. CLIP/vision cost and performance considerations

### 2.1 API vs self‑hosted

Key tradeoffs for your team:

- Hosted API:
  - Pro: zero infra, quick iteration on label text, usually good uptime.  
  - Con: per‑image cost, latency depends on provider, less control over updates.  
- Self‑hosted CLIP:
  - Pro: predictable infra cost, full control, can run on cheaper GPUs or even CPU for small jobs.  
  - Con: you own scaling, monitoring, and updates; more DevOps overhead.

Your workflow has a natural batching point: the job. That means:

- You can send images job‑by‑job and even debounce classification if the appraiser is still uploading.  
- You can cache results forever (no need to re‑classify once stored), so you only pay once per image.

Your team can start with a “cheap but decent” hosted option, then export a few weeks of labeled data and test a self‑hosted CLIP instance with the same prompts for quality/cost comparison.

### 2.2 Accuracy expectations

For your categories:

- CLIP/vision models tend to be very good at:
  - Interior vs exterior  
  - Kitchen vs bathroom vs bedroom vs living room  
  - Parking vs landscaping vs street view  
- They are weaker on:
  - Fine distinctions (e.g., “mechanical room” vs “storage room” vs “foundation close‑up”)  
  - Very cluttered or dark images

Design the UX assuming:

- AI will get most images right, but not all.  
- Reviewers have fast tools to:
  - Filter “uncertain/low confidence” images.  
  - Bulk‑reassign categories via drag‑drop or dropdowns.  
  - Override any AI field, and overrides always win.

The worker should store `ai_confidence` and some representation of “uncertainness” (e.g., difference between top‑1 and top‑2 scores) so the UI can bubble up “needs attention” buckets.

***

## 3. UX patterns your team can refine

### 3.1 Borrowed from Lightroom/Photos

Patterns that work well for 100+ images:

- **Grid view as the default:** small thumbnails, compact info, keyboard navigation.  
- **Loupe/preview view:** single image large, quick next/previous, quality status visible.  
- **Flags & ratings:** in your case:
  - Binary “Use in report / Reject” flag.  
  - Maybe a simple 3‑color quality indicator that combines blur/exposure/resolution.  
- **Filter presets per workflow step:**  
  - “Unclassified or low confidence”  
  - “Low quality but not reviewed”  
  - “Selected for report but not placed in layout”

Your team can add these as quick filter buttons on top of the grid.

### 3.2 Layout interaction refinements

Once the basic drag‑drop works, the following can make the layout builder feel pro:

- Hover over a slot → highlight the source image in the grid (and scroll to it).  
- Right‑click on slot → menu:
  - “Replace with next best in this category” (uses quality_score ordering).  
  - “Clear slot”.  
- “Auto fill layout” button per page:
  - Filter by the layout’s primary category (e.g., Exterior).  
  - Fill empty slots with top‑quality unplaced images.  
  - Let the reviewer tweak manually afterward.

These are simple server‑side queries and can dramatically reduce manual work.

***

## 4. Extensibility and “future‑you” considerations

Your team will be happier later if you:

1. **Keep AI optional and versioned**  
   - Add a field like `ai_model_version` to `job_images`.  
   - Store which model/prompt set produced ai_category/ai_subcategory.  
   - That way, if you improve the model later, you can re‑run only for new jobs, or provide a “Re‑classify with latest model” button.

2. **Isolate AI logic behind a small internal API**  
   - E.g., a single HTTP endpoint or internal function: `classifyPropertyImage(image_bytes) -> { category, subcategory, confidence, raw_labels }`.  
   - Frontend/worker never cares if you switch from hosted CLIP to self‑hosted or to a domain‑specific model later.

3. **Design quality scoring as pluggable**  
   - Start with Laplacian variance + simple exposure.  
   - Later, you can swap in BRISQUE or more advanced IQA methods without touching the React code; `quality_score` stays a 0–1 float.

4. **Keep the editing pipeline non‑destructive**  
   - Always store original untouched.  
   - Treat `crop_data` and `adjustments` as instructions.  
   - Regenerate derivatives on demand or via worker.  
   - This gives you the freedom to change your export resolution, sharpening, or compression strategy without losing quality.

***

## 5. Message to your team (how to use this research)

What follows is the kind of “wrap‑up note” you can share internally:

> **Team,**
>
> The document above is research and a proposed direction for building an intelligent image manager for our appraisal workflow. It outlines a possible tech stack, data model, worker processes, AI classification approach, quality scoring ideas, and React UI patterns that appear well‑suited to our use case.
>
> This is **not** a final design or a mandate. It’s intended as a detailed starting point to:
>
> - Expose you to common patterns and libraries being used in the wild for bulk image upload, classification, and layout management.  
> - Give us a concrete vocabulary (tables, fields, endpoints, components) we can critique and iterate on together.  
> - Highlight key tradeoffs (client vs server processing, hosted AI vs self‑hosted, image transformation strategies, etc.) so we can make decisions informed by our own constraints around cost, performance, and maintainability.
>
> As you implement this, please:
>
> - Treat every suggestion as a hypothesis to validate, not a requirement to follow blindly.  
> - Continue your own research into alternative tools, algorithms, and UX patterns where you see better fits.  
> - Challenge assumptions (e.g., choice of libraries, blur thresholds, category taxonomy) based on real appraiser feedback and real inspection photo sets.  
> - Adjust or replace parts of this plan where they conflict with our existing architecture, security standards, or performance goals.
>
> The goal of this research is to get us moving in the right direction quickly, give you concrete examples to build from, and shorten the path to a first working version. From there, your judgment, experimentation, and domain knowledge should drive which parts we keep, which we refine, and which we discard in favor of better ideas.
