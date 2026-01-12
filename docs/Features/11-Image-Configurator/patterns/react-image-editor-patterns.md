# React Image Editor Patterns

## Overview

This document covers patterns for implementing image editing in React with a focus on:
- Crop with aspect ratio presets (4:3, 16:9, 1:1)
- Rotation in 90-degree increments
- Brightness/contrast adjustments
- **Non-destructive editing** (save parameters, apply on export)

---

## Option 1: Filerobot Image Editor

### Overview
Full-featured image editor with UI for cropping, rotating, filtering, and annotations. Best for users who need a complete editing experience.

**Pros:**
- Complete UI out of the box
- Supports design state save/restore (non-destructive)
- Customizable crop presets
- Extensive filter and adjustment options

**Cons:**
- Larger bundle size
- Peer dependencies (react-konva, styled-components)
- Design state restoration is experimental for different image sizes

### Installation

```bash
npm install react-filerobot-image-editor
```

**Peer dependencies required:**
- React/ReactDOM >= 17.0.0
- react-konva >= 17.0.1-1
- styled-components >= 5.3.5

### Modal Setup

```tsx
import React, { useState } from 'react';
import FilerobotImageEditor, { TABS, TOOLS } from 'react-filerobot-image-editor';

interface ImageEditorModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (editedImage: ImageData, designState: DesignState) => void;
  initialDesignState?: DesignState;
}

interface DesignState {
  // Filerobot design state structure
  imgSrc: string;
  finetunes: string[];
  finetunesProps: Record<string, number>;
  filter: string | null;
  adjustments: {
    crop?: { x: number; y: number; width: number; height: number };
    rotation?: number;
    isFlippedX?: boolean;
    isFlippedY?: boolean;
  };
  annotations: Record<string, unknown>;
  resize: { width?: number; height?: number };
}

interface ImageData {
  name: string;
  extension: string;
  mimeType: string;
  fullName: string;
  height: number;
  width: number;
  imageBase64: string;
  imageCanvas: HTMLCanvasElement;
  quality: number;
}

export function ImageEditorModal({
  imageUrl,
  isOpen,
  onClose,
  onSave,
  initialDesignState
}: ImageEditorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-4xl h-[80vh]">
        <FilerobotImageEditor
          source={imageUrl}
          onSave={(editedImageObject, designState) => {
            onSave(editedImageObject, designState);
            onClose();
          }}
          onClose={onClose}
          // Restore previous editing session
          loadableDesignState={initialDesignState}
          // Configure available tabs
          tabsIds={[TABS.ADJUST, TABS.FINETUNE, TABS.RESIZE]}
          defaultTabId={TABS.ADJUST}
          // Crop configuration
          Crop={{
            presetsItems: [
              { titleKey: 'original', descriptionKey: 'Original', ratio: 'original' },
              { titleKey: 'square', descriptionKey: '1:1', ratio: 1 },
              { titleKey: 'landscape43', descriptionKey: '4:3', ratio: 4 / 3 },
              { titleKey: 'landscape169', descriptionKey: '16:9', ratio: 16 / 9 },
              { titleKey: 'portrait34', descriptionKey: '3:4', ratio: 3 / 4 },
              { titleKey: 'portrait916', descriptionKey: '9:16', ratio: 9 / 16 },
            ],
            autoResize: false, // Don't auto-resize after crop
          }}
          // Disable save button if no changes made
          disableSaveIfNoChanges
          // Return promise to show loading spinner during async save
          savingPixelRatio={1}
          previewPixelRatio={1}
        />
      </div>
    </div>
  );
}
```

### Crop Presets Configuration

```tsx
// Custom crop presets with folders for organization
const cropConfig = {
  presetsItems: [
    { titleKey: 'original', descriptionKey: 'Original', ratio: 'original' },
    { titleKey: 'square', descriptionKey: '1:1', ratio: 1 },
    { titleKey: 'landscape43', descriptionKey: '4:3', ratio: 4 / 3 },
    { titleKey: 'landscape169', descriptionKey: '16:9', ratio: 16 / 9 },
  ],
  // Organized presets in folders
  presetsFolders: [
    {
      titleKey: 'socialMedia',
      groups: [
        {
          titleKey: 'instagram',
          items: [
            { titleKey: 'post', width: 1080, height: 1080, descriptionKey: '1080x1080' },
            { titleKey: 'story', width: 1080, height: 1920, descriptionKey: '1080x1920' },
            { titleKey: 'landscape', width: 1080, height: 608, descriptionKey: '1.91:1' },
          ]
        },
        {
          titleKey: 'facebook',
          items: [
            { titleKey: 'post', width: 1200, height: 630, descriptionKey: '1200x630' },
            { titleKey: 'cover', width: 820, height: 312, descriptionKey: '820x312' },
          ]
        }
      ]
    }
  ],
  autoResize: false,
};
```

### Save Design State (Non-Destructive)

```tsx
import { useState, useCallback } from 'react';

interface ImageEditState {
  originalUrl: string;
  designState: DesignState | null;
  previewUrl: string | null; // Optional: cached preview
}

function useImageEditor() {
  const [editStates, setEditStates] = useState<Map<string, ImageEditState>>(new Map());

  const saveEditState = useCallback((imageId: string, designState: DesignState, previewBase64?: string) => {
    setEditStates(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(imageId);
      newMap.set(imageId, {
        originalUrl: existing?.originalUrl || '',
        designState,
        previewUrl: previewBase64 ? `data:image/jpeg;base64,${previewBase64}` : null,
      });
      return newMap;
    });
  }, []);

  const getEditState = useCallback((imageId: string) => {
    return editStates.get(imageId);
  }, [editStates]);

  // Convert design state to export-ready parameters
  const getExportParams = useCallback((imageId: string): ExportParams | null => {
    const state = editStates.get(imageId);
    if (!state?.designState) return null;

    const { adjustments, finetunesProps, resize } = state.designState;

    return {
      crop: adjustments?.crop,
      rotation: adjustments?.rotation || 0,
      flipX: adjustments?.isFlippedX || false,
      flipY: adjustments?.isFlippedY || false,
      brightness: finetunesProps?.Brightness || 0,
      contrast: finetunesProps?.Contrast || 0,
      saturation: finetunesProps?.Saturation || 0,
      resize: resize?.width || resize?.height ? resize : undefined,
    };
  }, [editStates]);

  return { saveEditState, getEditState, getExportParams };
}

interface ExportParams {
  crop?: { x: number; y: number; width: number; height: number };
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  brightness: number;
  contrast: number;
  saturation: number;
  resize?: { width?: number; height?: number };
}
```

---

## Option 2: react-image-crop

### Overview
Lightweight cropping-only library. Best when you need simple crop functionality without the overhead of a full editor.

**Pros:**
- Tiny bundle size (<5KB gzipped)
- No dependencies
- Simple API
- Full TypeScript support

**Cons:**
- Crop only - no filters, adjustments, or rotation
- Requires custom UI for rotation/adjustments
- Must implement image processing yourself

### Installation

```bash
npm install react-image-crop
```

### Basic Crop with Aspect Ratio

```tsx
import React, { useState, useCallback, useRef } from 'react';
import ReactCrop, {
  type Crop,
  centerCrop,
  makeAspectCrop,
  PixelCrop,
  PercentCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface CropData {
  percentCrop: PercentCrop;
  pixelCrop: PixelCrop;
}

interface ImageCropperProps {
  src: string;
  aspectRatio?: number; // e.g., 16/9, 4/3, 1
  onCropComplete: (cropData: CropData) => void;
}

export function ImageCropper({ src, aspectRatio, onCropComplete }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;

    if (aspectRatio) {
      // Create centered crop with aspect ratio
      const newCrop = centerCrop(
        makeAspectCrop(
          { unit: '%', width: 90 },
          aspectRatio,
          width,
          height
        ),
        width,
        height
      );
      setCrop(newCrop);
    }
  }, [aspectRatio]);

  const handleCropComplete = useCallback(
    (pixelCrop: PixelCrop, percentCrop: PercentCrop) => {
      if (percentCrop.width && percentCrop.height) {
        onCropComplete({ percentCrop, pixelCrop });
      }
    },
    [onCropComplete]
  );

  return (
    <ReactCrop
      crop={crop}
      onChange={(_, percentCrop) => setCrop(percentCrop)}
      onComplete={handleCropComplete}
      aspect={aspectRatio}
      minWidth={50}
      minHeight={50}
    >
      <img
        ref={imgRef}
        src={src}
        alt="Crop source"
        onLoad={onImageLoad}
        style={{ maxHeight: '70vh', maxWidth: '100%' }}
      />
    </ReactCrop>
  );
}
```

### Aspect Ratio Lock with Presets

```tsx
import React, { useState } from 'react';

const ASPECT_RATIOS = {
  free: undefined,
  '1:1': 1,
  '4:3': 4 / 3,
  '16:9': 16 / 9,
  '3:4': 3 / 4,
  '9:16': 9 / 16,
} as const;

type AspectRatioKey = keyof typeof ASPECT_RATIOS;

export function ImageCropperWithPresets({ src, onSave }: { src: string; onSave: (data: CropData) => void }) {
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioKey>('free');
  const [cropData, setCropData] = useState<CropData | null>(null);

  return (
    <div>
      {/* Aspect ratio selector */}
      <div className="flex gap-2 mb-4">
        {Object.keys(ASPECT_RATIOS).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedRatio(key as AspectRatioKey)}
            className={`px-3 py-1 rounded ${
              selectedRatio === key ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Cropper */}
      <ImageCropper
        src={src}
        aspectRatio={ASPECT_RATIOS[selectedRatio]}
        onCropComplete={setCropData}
      />

      {/* Save button */}
      <button
        onClick={() => cropData && onSave(cropData)}
        disabled={!cropData}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
      >
        Apply Crop
      </button>
    </div>
  );
}
```

---

## Option 3: react-easy-crop

### Overview
Simple cropping library with zoom and rotation support. Good middle ground between react-image-crop and Filerobot.

**Pros:**
- Small bundle size
- Built-in zoom and rotation
- Touch-friendly
- Provides both percent and pixel crop data

**Cons:**
- No filters or adjustments
- Requires custom canvas processing for actual crop

### Installation

```bash
npm install react-easy-crop
```

### Crop with Zoom and Rotation

```tsx
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

interface Point {
  x: number;
  y: number;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CropEditorProps {
  src: string;
  aspect?: number;
  onComplete: (croppedAreaPixels: Area, rotation: number) => void;
}

export function CropEditor({ src, aspect = 4 / 3, onComplete }: CropEditorProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSave = () => {
    if (croppedAreaPixels) {
      onComplete(croppedAreaPixels, rotation);
    }
  };

  return (
    <div className="relative h-96">
      <Cropper
        image={src}
        crop={crop}
        zoom={zoom}
        rotation={rotation}
        aspect={aspect}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onRotationChange={setRotation}
        onCropComplete={onCropComplete}
        minZoom={1}
        maxZoom={3}
        zoomSpeed={0.1}
      />

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
        <div className="flex items-center gap-4">
          <label className="text-white">
            Zoom: {zoom.toFixed(1)}x
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="ml-2"
            />
          </label>

          <label className="text-white">
            Rotation: {rotation}deg
            <input
              type="range"
              min={0}
              max={360}
              step={90}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="ml-2"
            />
          </label>

          <button onClick={handleSave} className="ml-auto bg-blue-500 text-white px-4 py-2 rounded">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Non-Destructive Workflow

### Core Concept

Non-destructive editing means:
1. **Store only edit parameters** (crop coordinates, rotation degrees, brightness values)
2. **Keep original image untouched**
3. **Apply parameters at export time** (when generating final output)

### Benefits
- Users can modify edits later
- Original quality preserved
- Smaller storage (JSON params vs. modified images)
- Server-side processing for consistency

### Data Structure for Edit Parameters

```typescript
// Store this JSON with each image
interface ImageEditParams {
  version: 1; // For future migrations

  // Crop parameters (pixel values relative to original image)
  crop?: {
    x: number;      // Left offset
    y: number;      // Top offset
    width: number;  // Crop width
    height: number; // Crop height
  };

  // Transform parameters
  rotation: number;     // 0, 90, 180, 270
  flipX: boolean;
  flipY: boolean;

  // Adjustment parameters (-100 to 100 scale)
  adjustments: {
    brightness: number;  // -100 to 100
    contrast: number;    // -100 to 100
    saturation: number;  // -100 to 100
    exposure: number;    // -100 to 100
  };

  // Output dimensions (optional)
  resize?: {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'fill';
  };
}

// Default values
const DEFAULT_EDIT_PARAMS: ImageEditParams = {
  version: 1,
  rotation: 0,
  flipX: false,
  flipY: false,
  adjustments: {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    exposure: 0,
  },
};
```

### Database Schema Example

```sql
-- Images table with edit parameters
CREATE TABLE page_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id),

  -- Original image reference
  original_url TEXT NOT NULL,
  original_width INTEGER,
  original_height INTEGER,

  -- Edit parameters as JSONB
  edit_params JSONB DEFAULT '{
    "version": 1,
    "rotation": 0,
    "flipX": false,
    "flipY": false,
    "adjustments": {
      "brightness": 0,
      "contrast": 0,
      "saturation": 0,
      "exposure": 0
    }
  }',

  -- Cached processed preview (optional)
  preview_url TEXT,
  preview_generated_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast JSON queries
CREATE INDEX idx_page_images_has_edits ON page_images
  USING btree ((edit_params IS NOT NULL AND edit_params != '{}'));
```

---

## Apply Params on Export (Server-Side with Sharp)

### Sharp.js Server-Side Processing

```typescript
// server/lib/image-processor.ts
import sharp from 'sharp';
import { ImageEditParams } from '@/types/image-edit';

interface ProcessImageOptions {
  inputBuffer: Buffer;
  editParams: ImageEditParams;
  outputFormat?: 'jpeg' | 'png' | 'webp';
  quality?: number;
}

export async function processImage({
  inputBuffer,
  editParams,
  outputFormat = 'jpeg',
  quality = 85,
}: ProcessImageOptions): Promise<Buffer> {
  let pipeline = sharp(inputBuffer);

  // 1. Apply rotation first (before crop for correct coordinates)
  if (editParams.rotation && editParams.rotation !== 0) {
    pipeline = pipeline.rotate(editParams.rotation);
  }

  // 2. Apply flip/flop
  if (editParams.flipY) {
    pipeline = pipeline.flip(); // Vertical flip
  }
  if (editParams.flipX) {
    pipeline = pipeline.flop(); // Horizontal flip
  }

  // 3. Apply crop (extract)
  if (editParams.crop) {
    const { x, y, width, height } = editParams.crop;
    pipeline = pipeline.extract({
      left: Math.round(x),
      top: Math.round(y),
      width: Math.round(width),
      height: Math.round(height),
    });
  }

  // 4. Apply resize if specified
  if (editParams.resize) {
    pipeline = pipeline.resize({
      width: editParams.resize.width,
      height: editParams.resize.height,
      fit: editParams.resize.fit || 'cover',
      withoutEnlargement: true,
    });
  }

  // 5. Apply adjustments
  const { adjustments } = editParams;

  // Brightness and saturation via modulate
  // Note: Sharp uses multiplicative values (1 = no change)
  // Our params use -100 to 100 scale, so convert
  const brightness = 1 + (adjustments.brightness / 100);
  const saturation = 1 + (adjustments.saturation / 100);

  if (brightness !== 1 || saturation !== 1) {
    pipeline = pipeline.modulate({
      brightness: Math.max(0.1, brightness), // Prevent negative
      saturation: Math.max(0, saturation),
    });
  }

  // Contrast via linear transformation
  // Formula: a * input + b where a controls contrast
  if (adjustments.contrast !== 0) {
    const contrast = 1 + (adjustments.contrast / 100);
    // Adjust around middle gray (128)
    const offset = 128 * (1 - contrast);
    pipeline = pipeline.linear(contrast, offset);
  }

  // 6. Output with format and quality
  switch (outputFormat) {
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality, mozjpeg: true });
      break;
    case 'png':
      pipeline = pipeline.png({ compressionLevel: 9 });
      break;
    case 'webp':
      pipeline = pipeline.webp({ quality });
      break;
  }

  return pipeline.toBuffer();
}
```

### API Route Example (Next.js)

```typescript
// app/api/images/[id]/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { processImage } from '@/server/lib/image-processor';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') as 'jpeg' | 'png' | 'webp' || 'jpeg';
  const quality = parseInt(searchParams.get('quality') || '85');

  // Fetch image record with edit params
  const { data: image, error } = await supabase
    .from('page_images')
    .select('original_url, edit_params')
    .eq('id', params.id)
    .single();

  if (error || !image) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }

  // Fetch original image
  const originalResponse = await fetch(image.original_url);
  const originalBuffer = Buffer.from(await originalResponse.arrayBuffer());

  // Process with edit params
  const processedBuffer = await processImage({
    inputBuffer: originalBuffer,
    editParams: image.edit_params,
    outputFormat: format,
    quality,
  });

  // Return processed image
  return new NextResponse(processedBuffer, {
    headers: {
      'Content-Type': `image/${format}`,
      'Content-Disposition': `attachment; filename="processed.${format}"`,
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
```

### Supabase Edge Function Example

```typescript
// supabase/functions/process-image/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Note: Sharp doesn't work in Deno Edge Functions
// Use Cloudflare Workers with @cloudflare/worker-images or similar
// This example shows the pattern for a Node.js-based Edge Function

serve(async (req) => {
  const { imageId, format = 'jpeg', quality = 85 } = await req.json();

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Fetch image record
  const { data: image } = await supabase
    .from('page_images')
    .select('original_url, edit_params')
    .eq('id', imageId)
    .single();

  if (!image) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }

  // For Deno, consider using:
  // - Cloudflare Images API
  // - imgix URL parameters
  // - A separate Node.js service for Sharp processing

  // Example: Generate imgix URL with transformations
  const imgixUrl = buildImgixUrl(image.original_url, image.edit_params);

  return new Response(JSON.stringify({ processedUrl: imgixUrl }));
});

function buildImgixUrl(originalUrl: string, params: ImageEditParams): string {
  const base = 'https://your-source.imgix.net';
  const path = encodeURIComponent(originalUrl);
  const transforms = [];

  if (params.rotation) transforms.push(`rot=${params.rotation}`);
  if (params.flipX) transforms.push('flip=h');
  if (params.flipY) transforms.push('flip=v');
  if (params.crop) {
    const { x, y, width, height } = params.crop;
    transforms.push(`rect=${x},${y},${width},${height}`);
  }
  if (params.adjustments.brightness !== 0) {
    transforms.push(`bri=${params.adjustments.brightness}`);
  }
  if (params.adjustments.contrast !== 0) {
    transforms.push(`con=${params.adjustments.contrast}`);
  }

  return `${base}/${path}?${transforms.join('&')}`;
}
```

---

## Full Example: Modal Editor with Non-Destructive Save

### Complete Implementation

```tsx
// components/ImageConfigurator/ImageEditModal.tsx
import React, { useState, useCallback } from 'react';
import FilerobotImageEditor, { TABS, TOOLS } from 'react-filerobot-image-editor';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ImageEditParams {
  version: 1;
  crop?: { x: number; y: number; width: number; height: number };
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  adjustments: {
    brightness: number;
    contrast: number;
    saturation: number;
    exposure: number;
  };
  // Store Filerobot design state for restoring edit session
  designState?: unknown;
}

interface ImageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageId: string;
  currentParams?: ImageEditParams;
  onSave: (imageId: string, params: ImageEditParams, previewDataUrl?: string) => Promise<void>;
}

export function ImageEditModal({
  isOpen,
  onClose,
  imageUrl,
  imageId,
  currentParams,
  onSave,
}: ImageEditModalProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(
    async (editedImageObject: any, designState: any) => {
      setIsSaving(true);
      try {
        // Extract parameters from design state
        const params: ImageEditParams = {
          version: 1,
          rotation: designState.adjustments?.rotation || 0,
          flipX: designState.adjustments?.isFlippedX || false,
          flipY: designState.adjustments?.isFlippedY || false,
          adjustments: {
            brightness: designState.finetunesProps?.Brightness || 0,
            contrast: designState.finetunesProps?.Contrast || 0,
            saturation: designState.finetunesProps?.Saturation || 0,
            exposure: designState.finetunesProps?.Brightness || 0, // Filerobot uses Brightness
          },
          // Store crop if applied
          crop: designState.adjustments?.crop,
          // Store full design state for session restoration
          designState,
        };

        // Get preview as data URL (optional - for displaying without server round-trip)
        const previewDataUrl = editedImageObject.imageBase64
          ? `data:${editedImageObject.mimeType};base64,${editedImageObject.imageBase64}`
          : undefined;

        await onSave(imageId, params, previewDataUrl);
        onClose();
      } finally {
        setIsSaving(false);
      }
    },
    [imageId, onSave, onClose]
  );

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl h-[85vh] p-0">
        <FilerobotImageEditor
          source={imageUrl}
          onSave={handleSave}
          onClose={onClose}
          // Restore previous edit session if available
          loadableDesignState={currentParams?.designState}
          // Available tabs
          tabsIds={[TABS.ADJUST, TABS.FINETUNE, TABS.FILTERS]}
          defaultTabId={TABS.ADJUST}
          // Crop presets for page layouts
          Crop={{
            presetsItems: [
              { titleKey: 'original', descriptionKey: 'Original', ratio: 'original' as any },
              { titleKey: 'square', descriptionKey: '1:1', ratio: 1 },
              { titleKey: 'landscape43', descriptionKey: '4:3', ratio: 4 / 3 },
              { titleKey: 'landscape169', descriptionKey: '16:9', ratio: 16 / 9 },
              { titleKey: 'portrait34', descriptionKey: '3:4', ratio: 3 / 4 },
            ],
            autoResize: false,
          }}
          // Finetune options
          Finetune={{
            tools: ['Brightness', 'Contrast', 'Saturation', 'Warmth'],
          }}
          // UI customization
          Text={{ text: '' }}
          annotationsCommon={{
            fill: '#000000',
          }}
          disableSaveIfNoChanges
          showBackButton
          savingPixelRatio={1}
          previewPixelRatio={window.devicePixelRatio || 1}
        />
      </DialogContent>
    </Dialog>
  );
}
```

### Using the Modal in a Page Component

```tsx
// components/ImageConfigurator/PageImageConfigurator.tsx
import React, { useState, useCallback } from 'react';
import { ImageEditModal } from './ImageEditModal';
import { usePageImages } from '@/hooks/usePageImages';

interface PageImage {
  id: string;
  url: string;
  editParams?: ImageEditParams;
  previewUrl?: string;
}

export function PageImageConfigurator({ pageId }: { pageId: string }) {
  const { images, updateImageParams } = usePageImages(pageId);
  const [editingImage, setEditingImage] = useState<PageImage | null>(null);

  const handleSaveParams = useCallback(
    async (imageId: string, params: ImageEditParams, previewDataUrl?: string) => {
      await updateImageParams(imageId, params, previewDataUrl);
    },
    [updateImageParams]
  );

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="relative group cursor-pointer"
          onClick={() => setEditingImage(image)}
        >
          {/* Show preview if available, otherwise original */}
          <img
            src={image.previewUrl || image.url}
            alt=""
            className="w-full h-48 object-cover rounded-lg"
          />

          {/* Edit indicator */}
          {image.editParams && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
              Edited
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
            <span className="text-white font-medium">Edit Image</span>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {editingImage && (
        <ImageEditModal
          isOpen={!!editingImage}
          onClose={() => setEditingImage(null)}
          imageUrl={editingImage.url}
          imageId={editingImage.id}
          currentParams={editingImage.editParams}
          onSave={handleSaveParams}
        />
      )}
    </div>
  );
}
```

### React Hook for Image Management

```tsx
// hooks/usePageImages.ts
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ImageEditParams } from '@/types/image-edit';

interface PageImage {
  id: string;
  url: string;
  editParams?: ImageEditParams;
  previewUrl?: string;
}

export function usePageImages(pageId: string) {
  const [images, setImages] = useState<PageImage[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('page_images')
      .select('id, original_url, edit_params, preview_url')
      .eq('page_id', pageId)
      .order('position');

    if (!error && data) {
      setImages(
        data.map((img) => ({
          id: img.id,
          url: img.original_url,
          editParams: img.edit_params,
          previewUrl: img.preview_url,
        }))
      );
    }
    setLoading(false);
  }, [pageId]);

  const updateImageParams = useCallback(
    async (imageId: string, params: ImageEditParams, previewDataUrl?: string) => {
      // Update in database
      const { error } = await supabase
        .from('page_images')
        .update({
          edit_params: params,
          preview_url: previewDataUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', imageId);

      if (!error) {
        // Update local state
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? { ...img, editParams: params, previewUrl: previewDataUrl }
              : img
          )
        );
      }

      return !error;
    },
    []
  );

  // Export all images with applied edits
  const exportProcessedImages = useCallback(async (): Promise<string[]> => {
    const processedUrls: string[] = [];

    for (const image of images) {
      if (image.editParams && hasEdits(image.editParams)) {
        // Call server API to process image
        const response = await fetch(`/api/images/${image.id}/export?format=jpeg&quality=90`);
        const blob = await response.blob();
        processedUrls.push(URL.createObjectURL(blob));
      } else {
        // No edits, use original
        processedUrls.push(image.url);
      }
    }

    return processedUrls;
  }, [images]);

  return {
    images,
    loading,
    fetchImages,
    updateImageParams,
    exportProcessedImages,
  };
}

function hasEdits(params: ImageEditParams): boolean {
  return !!(
    params.crop ||
    params.rotation !== 0 ||
    params.flipX ||
    params.flipY ||
    params.adjustments.brightness !== 0 ||
    params.adjustments.contrast !== 0 ||
    params.adjustments.saturation !== 0
  );
}
```

---

## Comparison Summary

| Feature | Filerobot | react-image-crop | react-easy-crop |
|---------|-----------|------------------|-----------------|
| Bundle Size | Large (~200KB) | Tiny (<5KB) | Small (~10KB) |
| Cropping | Yes | Yes | Yes |
| Rotation | Yes | No | Yes |
| Zoom | Yes | No | Yes |
| Filters | Yes | No | No |
| Adjustments | Yes | No | No |
| UI Included | Full UI | Crop only | Crop only |
| Design State Save | Yes | Manual | Manual |
| TypeScript | Yes | Yes | Yes |
| Dependencies | Many | None | None |

### Recommendation

- **Use Filerobot** if you need a complete editor with filters, adjustments, and annotations
- **Use react-image-crop** if you only need simple cropping with minimal overhead
- **Use react-easy-crop** if you need crop + rotation/zoom but no filters

For the Image Page Configurator use case with crop, rotate, and adjustments, **Filerobot** is recommended as it provides:
1. Complete UI out of the box
2. Built-in design state save/restore for non-destructive editing
3. All required features (crop presets, rotation, brightness/contrast)
4. Lower development effort

---

## Sources

- [Filerobot Image Editor GitHub](https://github.com/scaleflex/filerobot-image-editor)
- [Filerobot Demo](https://scaleflex.github.io/filerobot-image-editor/)
- [react-image-crop GitHub](https://github.com/DominicTobias/react-image-crop)
- [react-image-crop npm](https://www.npmjs.com/package/react-image-crop)
- [react-easy-crop GitHub](https://github.com/ValentinH/react-easy-crop)
- [react-easy-crop npm](https://www.npmjs.com/package/react-easy-crop)
- [Sharp Image Operations API](https://sharp.pixelplumbing.com/api-operation/)
- [Sharp Resize/Extract API](https://sharp.pixelplumbing.com/api-resize/)
- [Processing Images with Sharp - DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-process-images-in-node-js-with-sharp)
- [Image Upload Modal with Crop - DEV Community](https://dev.to/mizanrifat/creating-an-image-upload-modal-with-crop-and-rotate-functionality-in-react-5cbd)
- [LogRocket Top React Cropping Libraries](https://blog.logrocket.com/top-react-image-cropping-libraries/)
