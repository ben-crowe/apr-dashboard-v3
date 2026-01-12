# Supabase Storage Image Patterns

## Overview

This document provides comprehensive patterns for implementing image management in the APR Dashboard using Supabase Storage. The patterns cover raw uploads, image variants (thumbnails, web, print), job-based organization, signed URLs for protected access, and Postgres metadata synchronization.

---

## Bucket Structure

```
appraisal-raw/
  {job_id}/
    {uuid}.{ext}                    # Original uploads

appraisal-processed/
  {job_id}/
    thumb/
      {uuid}.jpg                    # 150x150 thumbnails
    web/
      {uuid}.jpg                    # 800x600 web optimized
    print/
      {uuid}.jpg                    # 2400x1800 print quality
```

### Bucket Configuration

**Raw Bucket** (`appraisal-raw`):
- Private bucket (requires authentication)
- Stores original high-resolution uploads
- No public access

**Processed Bucket** (`appraisal-processed`):
- Private bucket with signed URL access
- Contains generated variants
- Leverages Supabase image transformations for on-the-fly resizing

---

## Pattern 1: Create Storage Buckets

### SQL Migration

```sql
-- Create raw uploads bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'appraisal-raw',
  'appraisal-raw',
  false,
  52428800,  -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/tiff']
);

-- Create processed images bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'appraisal-processed',
  'appraisal-processed',
  false,
  26214400,  -- 25MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);
```

### JavaScript Bucket Creation

```typescript
// Create buckets programmatically (admin only)
const { data, error } = await supabase.storage.createBucket('appraisal-raw', {
  public: false,
  fileSizeLimit: 52428800, // 50MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/tiff']
});
```

---

## Pattern 2: RLS Policies for Storage

### Row-Level Security Policies

```sql
-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can upload to their job folders
CREATE POLICY "Users can upload to own job folders"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id IN ('appraisal-raw', 'appraisal-processed')
  AND (storage.foldername(name))[1] IN (
    SELECT job_id::text FROM jobs WHERE user_id = auth.uid()
  )
);

-- Policy: Users can view files in their job folders
CREATE POLICY "Users can view own job files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id IN ('appraisal-raw', 'appraisal-processed')
  AND (storage.foldername(name))[1] IN (
    SELECT job_id::text FROM jobs WHERE user_id = auth.uid()
  )
);

-- Policy: Users can delete files in their job folders
CREATE POLICY "Users can delete own job files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id IN ('appraisal-raw', 'appraisal-processed')
  AND (storage.foldername(name))[1] IN (
    SELECT job_id::text FROM jobs WHERE user_id = auth.uid()
  )
);

-- Policy: Users can update files in their job folders
CREATE POLICY "Users can update own job files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id IN ('appraisal-raw', 'appraisal-processed')
  AND (storage.foldername(name))[1] IN (
    SELECT job_id::text FROM jobs WHERE user_id = auth.uid()
  )
);
```

---

## Pattern 3: Upload from React Client

### TypeScript Types

```typescript
// types/storage.ts
export interface UploadedImage {
  id: string;
  job_id: string;
  filename: string;
  original_name: string;
  storage_path: string;
  bucket: string;
  mime_type: string;
  size_bytes: number;
  width?: number;
  height?: number;
  caption?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ImageUploadResult {
  success: boolean;
  image?: UploadedImage;
  error?: string;
}

export interface ImageVariant {
  type: 'thumb' | 'web' | 'print';
  width: number;
  height: number;
  quality: number;
}

export const IMAGE_VARIANTS: Record<string, ImageVariant> = {
  thumb: { type: 'thumb', width: 150, height: 150, quality: 80 },
  web: { type: 'web', width: 800, height: 600, quality: 85 },
  print: { type: 'print', width: 2400, height: 1800, quality: 95 }
};
```

### Image Upload Hook

```typescript
// hooks/useImageUpload.ts
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import type { UploadedImage, ImageUploadResult } from '@/types/storage';

interface UseImageUploadOptions {
  jobId: string;
  maxSizeMB?: number;
  allowedTypes?: string[];
  onUploadComplete?: (image: UploadedImage) => void;
  onError?: (error: string) => void;
}

export function useImageUpload({
  jobId,
  maxSizeMB = 25,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'],
  onUploadComplete,
  onError
}: UseImageUploadOptions) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} not supported. Allowed: ${allowedTypes.join(', ')}`;
    }

    // Check file size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      return `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds limit of ${maxSizeMB}MB`;
    }

    return null;
  }, [allowedTypes, maxSizeMB]);

  const getFileExtension = (file: File): string => {
    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/heic': 'heic',
      'image/tiff': 'tiff'
    };
    return mimeToExt[file.type] || 'jpg';
  };

  const uploadImage = useCallback(async (file: File): Promise<ImageUploadResult> => {
    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      onError?.(validationError);
      return { success: false, error: validationError };
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Generate unique filename
      const fileId = uuidv4();
      const extension = getFileExtension(file);
      const storagePath = `${jobId}/${fileId}.${extension}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('appraisal-raw')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      setProgress(50);

      // Get image dimensions (optional - requires loading image)
      const dimensions = await getImageDimensions(file);

      // Insert metadata into database
      const { data: imageData, error: dbError } = await supabase
        .from('job_images')
        .insert({
          id: fileId,
          job_id: jobId,
          filename: `${fileId}.${extension}`,
          original_name: file.name,
          storage_path: storagePath,
          bucket: 'appraisal-raw',
          mime_type: file.type,
          size_bytes: file.size,
          width: dimensions?.width,
          height: dimensions?.height,
          sort_order: 0
        })
        .select()
        .single();

      if (dbError) {
        // Rollback: delete uploaded file
        await supabase.storage.from('appraisal-raw').remove([storagePath]);
        throw new Error(dbError.message);
      }

      setProgress(100);
      onUploadComplete?.(imageData);

      return { success: true, image: imageData };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUploading(false);
    }
  }, [jobId, validateFile, onUploadComplete, onError]);

  const uploadMultiple = useCallback(async (files: File[]): Promise<ImageUploadResult[]> => {
    const results: ImageUploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const result = await uploadImage(files[i]);
      results.push(result);
      setProgress(((i + 1) / files.length) * 100);
    }

    return results;
  }, [uploadImage]);

  return {
    uploadImage,
    uploadMultiple,
    uploading,
    progress,
    error,
    clearError: () => setError(null)
  };
}

// Helper function to get image dimensions
async function getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => resolve(null);
    img.src = URL.createObjectURL(file);
  });
}
```

### Image Upload Component

```tsx
// components/ImageUploader.tsx
'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useImageUpload } from '@/hooks/useImageUpload';
import type { UploadedImage } from '@/types/storage';

interface ImageUploaderProps {
  jobId: string;
  onImagesUploaded?: (images: UploadedImage[]) => void;
  maxFiles?: number;
}

export function ImageUploader({
  jobId,
  onImagesUploaded,
  maxFiles = 20
}: ImageUploaderProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const { uploadMultiple, uploading, progress, error } = useImageUpload({
    jobId,
    maxSizeMB: 25,
    onUploadComplete: (image) => {
      setUploadedImages(prev => [...prev, image]);
    }
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const results = await uploadMultiple(acceptedFiles);
    const successfulUploads = results
      .filter(r => r.success && r.image)
      .map(r => r.image!);

    if (successfulUploads.length > 0) {
      onImagesUploaded?.(successfulUploads);
    }
  }, [uploadMultiple, onImagesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/heic': ['.heic']
    },
    maxFiles,
    disabled: uploading
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div>
            <p className="text-gray-600">Uploading... {Math.round(progress)}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : isDragActive ? (
          <p className="text-blue-600">Drop images here...</p>
        ) : (
          <div>
            <p className="text-gray-600">
              Drag and drop images here, or click to select
            </p>
            <p className="text-sm text-gray-400 mt-1">
              JPG, PNG, WebP, HEIC - Max 25MB each
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {uploadedImages.map((image) => (
            <div key={image.id} className="aspect-square bg-gray-100 rounded overflow-hidden">
              <ImageThumbnail image={image} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Pattern 4: Generate Signed URLs

### Signed URL Hook

```typescript
// hooks/useSignedUrl.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface UseSignedUrlOptions {
  bucket: string;
  path: string;
  expiresIn?: number; // seconds
  transform?: {
    width?: number;
    height?: number;
    quality?: number;
    resize?: 'cover' | 'contain' | 'fill';
  };
}

export function useSignedUrl({
  bucket,
  path,
  expiresIn = 3600, // 1 hour default
  transform
}: UseSignedUrlOptions) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function generateUrl() {
      if (!path) {
        setLoading(false);
        return;
      }

      try {
        const { data, error: urlError } = await supabase.storage
          .from(bucket)
          .createSignedUrl(path, expiresIn, {
            transform: transform ? {
              width: transform.width,
              height: transform.height,
              quality: transform.quality,
              resize: transform.resize
            } : undefined
          });

        if (urlError) throw urlError;
        setUrl(data.signedUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate URL');
      } finally {
        setLoading(false);
      }
    }

    generateUrl();
  }, [bucket, path, expiresIn, transform]);

  return { url, loading, error };
}
```

### Batch Signed URLs

```typescript
// lib/storage-utils.ts
import { supabase } from '@/lib/supabase';
import type { ImageVariant, IMAGE_VARIANTS } from '@/types/storage';

interface SignedUrlRequest {
  bucket: string;
  path: string;
  variant?: keyof typeof IMAGE_VARIANTS;
}

interface SignedUrlResult {
  path: string;
  url: string | null;
  error?: string;
}

export async function generateSignedUrls(
  requests: SignedUrlRequest[],
  expiresIn: number = 3600
): Promise<SignedUrlResult[]> {
  const results: SignedUrlResult[] = [];

  // Process in parallel for efficiency
  const promises = requests.map(async (request) => {
    const variant = request.variant ? IMAGE_VARIANTS[request.variant] : undefined;

    const { data, error } = await supabase.storage
      .from(request.bucket)
      .createSignedUrl(request.path, expiresIn, {
        transform: variant ? {
          width: variant.width,
          height: variant.height,
          quality: variant.quality,
          resize: 'cover'
        } : undefined
      });

    return {
      path: request.path,
      url: data?.signedUrl || null,
      error: error?.message
    };
  });

  return Promise.all(promises);
}

// Generate all variant URLs for a single image
export async function generateImageVariantUrls(
  storagePath: string,
  bucket: string = 'appraisal-raw',
  expiresIn: number = 3600
): Promise<Record<string, string | null>> {
  const variants: Record<string, string | null> = {
    original: null,
    thumb: null,
    web: null,
    print: null
  };

  // Original URL
  const { data: originalData } = await supabase.storage
    .from(bucket)
    .createSignedUrl(storagePath, expiresIn);
  variants.original = originalData?.signedUrl || null;

  // Variant URLs with transformations
  for (const [key, variant] of Object.entries(IMAGE_VARIANTS)) {
    const { data } = await supabase.storage
      .from(bucket)
      .createSignedUrl(storagePath, expiresIn, {
        transform: {
          width: variant.width,
          height: variant.height,
          quality: variant.quality,
          resize: 'cover'
        }
      });
    variants[key] = data?.signedUrl || null;
  }

  return variants;
}
```

---

## Pattern 5: On-the-fly Image Transformations

### Transformation URL Builder

```typescript
// lib/image-transforms.ts

interface TransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  resize?: 'cover' | 'contain' | 'fill';
  format?: 'origin' | 'webp';
}

// For public buckets - direct URL transformation
export function getTransformedPublicUrl(
  projectUrl: string,
  bucket: string,
  path: string,
  options: TransformOptions
): string {
  const params = new URLSearchParams();

  if (options.width) params.set('width', options.width.toString());
  if (options.height) params.set('height', options.height.toString());
  if (options.quality) params.set('quality', options.quality.toString());
  if (options.resize) params.set('resize', options.resize);
  if (options.format) params.set('format', options.format);

  return `${projectUrl}/storage/v1/render/image/public/${bucket}/${path}?${params.toString()}`;
}

// Using Supabase client for private buckets
export async function getTransformedSignedUrl(
  supabase: any,
  bucket: string,
  path: string,
  expiresIn: number,
  options: TransformOptions
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn, {
      transform: {
        width: options.width,
        height: options.height,
        quality: options.quality,
        resize: options.resize
      }
    });

  if (error) {
    console.error('Transform URL error:', error);
    return null;
  }

  return data.signedUrl;
}
```

### Image Component with Variants

```tsx
// components/OptimizedImage.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { UploadedImage } from '@/types/storage';

interface OptimizedImageProps {
  image: UploadedImage;
  variant: 'thumb' | 'web' | 'print' | 'original';
  alt?: string;
  className?: string;
  onClick?: () => void;
}

const VARIANT_CONFIG = {
  thumb: { width: 150, height: 150, quality: 80 },
  web: { width: 800, height: 600, quality: 85 },
  print: { width: 2400, height: 1800, quality: 95 },
  original: null
};

export function OptimizedImage({
  image,
  variant,
  alt,
  className,
  onClick
}: OptimizedImageProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadUrl() {
      const config = VARIANT_CONFIG[variant];

      const { data, error: urlError } = await supabase.storage
        .from(image.bucket)
        .createSignedUrl(image.storage_path, 3600, {
          transform: config ? {
            width: config.width,
            height: config.height,
            quality: config.quality,
            resize: 'cover' as const
          } : undefined
        });

      if (urlError) {
        setError(true);
      } else {
        setUrl(data.signedUrl);
      }
      setLoading(false);
    }

    loadUrl();
  }, [image, variant]);

  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-200 ${className}`} />
    );
  }

  if (error || !url) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <span className="text-gray-400">Failed to load</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt || image.original_name}
      className={className}
      onClick={onClick}
      loading="lazy"
    />
  );
}
```

---

## Pattern 6: Sync with Postgres Metadata Table

### Database Schema

```sql
-- Create job_images table for metadata
CREATE TABLE job_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  bucket TEXT NOT NULL DEFAULT 'appraisal-raw',
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  width INTEGER,
  height INTEGER,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  is_cover BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_job_images_job_id ON job_images(job_id);
CREATE INDEX idx_job_images_storage_path ON job_images(storage_path);
CREATE INDEX idx_job_images_sort_order ON job_images(job_id, sort_order);

-- Enable RLS
ALTER TABLE job_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view images for their jobs"
ON job_images FOR SELECT
TO authenticated
USING (
  job_id IN (SELECT id FROM jobs WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert images for their jobs"
ON job_images FOR INSERT
TO authenticated
WITH CHECK (
  job_id IN (SELECT id FROM jobs WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update images for their jobs"
ON job_images FOR UPDATE
TO authenticated
USING (
  job_id IN (SELECT id FROM jobs WHERE user_id = auth.uid())
);

CREATE POLICY "Users can delete images for their jobs"
ON job_images FOR DELETE
TO authenticated
USING (
  job_id IN (SELECT id FROM jobs WHERE user_id = auth.uid())
);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_job_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_job_images_updated_at
  BEFORE UPDATE ON job_images
  FOR EACH ROW
  EXECUTE FUNCTION update_job_images_updated_at();
```

### Storage-to-Database Sync Trigger

```sql
-- Function to sync storage.objects with job_images on delete
-- Note: This handles cleanup when files are deleted via Supabase dashboard

CREATE OR REPLACE FUNCTION sync_storage_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Only handle our appraisal buckets
  IF OLD.bucket_id IN ('appraisal-raw', 'appraisal-processed') THEN
    -- Delete corresponding metadata record
    DELETE FROM job_images
    WHERE storage_path = OLD.name
      AND bucket = OLD.bucket_id;
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on storage.objects
CREATE TRIGGER on_storage_object_deleted
  AFTER DELETE ON storage.objects
  FOR EACH ROW
  EXECUTE FUNCTION sync_storage_delete();
```

### Image Management Functions

```typescript
// lib/image-manager.ts
import { supabase } from '@/lib/supabase';
import type { UploadedImage } from '@/types/storage';

export class ImageManager {

  // Get all images for a job
  static async getJobImages(jobId: string): Promise<UploadedImage[]> {
    const { data, error } = await supabase
      .from('job_images')
      .select('*')
      .eq('job_id', jobId)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Delete image (storage + metadata)
  static async deleteImage(image: UploadedImage): Promise<void> {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(image.bucket)
      .remove([image.storage_path]);

    if (storageError) throw storageError;

    // Delete metadata (also happens via trigger, but explicit is safer)
    const { error: dbError } = await supabase
      .from('job_images')
      .delete()
      .eq('id', image.id);

    if (dbError) throw dbError;
  }

  // Update image caption
  static async updateCaption(imageId: string, caption: string): Promise<void> {
    const { error } = await supabase
      .from('job_images')
      .update({ caption })
      .eq('id', imageId);

    if (error) throw error;
  }

  // Reorder images
  static async reorderImages(
    jobId: string,
    orderedIds: string[]
  ): Promise<void> {
    const updates = orderedIds.map((id, index) => ({
      id,
      sort_order: index
    }));

    // Use upsert to update sort_order for each image
    for (const update of updates) {
      await supabase
        .from('job_images')
        .update({ sort_order: update.sort_order })
        .eq('id', update.id)
        .eq('job_id', jobId);
    }
  }

  // Set cover image
  static async setCoverImage(
    jobId: string,
    imageId: string
  ): Promise<void> {
    // First, unset all cover images for this job
    await supabase
      .from('job_images')
      .update({ is_cover: false })
      .eq('job_id', jobId);

    // Then set the new cover image
    await supabase
      .from('job_images')
      .update({ is_cover: true })
      .eq('id', imageId)
      .eq('job_id', jobId);
  }

  // Get cover image for a job
  static async getCoverImage(jobId: string): Promise<UploadedImage | null> {
    const { data, error } = await supabase
      .from('job_images')
      .select('*')
      .eq('job_id', jobId)
      .eq('is_cover', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
}
```

---

## Full Example: Complete Image Upload Flow

### Complete Implementation

```tsx
// pages/job/[jobId]/images.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { supabase } from '@/lib/supabase';
import { ImageManager } from '@/lib/image-manager';
import { useImageUpload } from '@/hooks/useImageUpload';
import { OptimizedImage } from '@/components/OptimizedImage';
import type { UploadedImage } from '@/types/storage';

interface JobImagesPageProps {
  params: { jobId: string };
}

// Sortable Image Card Component
function SortableImageCard({
  image,
  onDelete,
  onSetCover,
  isCover
}: {
  image: UploadedImage;
  onDelete: () => void;
  onSetCover: () => void;
  isCover: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const [caption, setCaption] = useState(image.caption || '');
  const [saving, setSaving] = useState(false);

  const handleCaptionBlur = async () => {
    if (caption !== image.caption) {
      setSaving(true);
      await ImageManager.updateCaption(image.id, caption);
      setSaving(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative bg-white rounded-lg shadow-sm border overflow-hidden
        ${isCover ? 'ring-2 ring-blue-500' : ''}
      `}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 p-1 bg-white/80 rounded cursor-grab z-10"
      >
        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
        </svg>
      </div>

      {/* Image */}
      <div className="aspect-square">
        <OptimizedImage
          image={image}
          variant="thumb"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Caption Input */}
      <div className="p-2">
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          onBlur={handleCaptionBlur}
          placeholder="Add caption..."
          className="w-full text-sm border-0 border-b border-transparent focus:border-gray-300 focus:ring-0 px-0 py-1"
        />
      </div>

      {/* Actions */}
      <div className="absolute top-2 right-2 flex gap-1">
        <button
          onClick={onSetCover}
          className={`p-1 rounded ${isCover ? 'bg-blue-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white'}`}
          title={isCover ? 'Cover image' : 'Set as cover'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="p-1 bg-white/80 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded"
          title="Delete image"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Cover Badge */}
      {isCover && (
        <div className="absolute bottom-12 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          Cover
        </div>
      )}
    </div>
  );
}

// Main Page Component
export default function JobImagesPage({ params }: JobImagesPageProps) {
  const { jobId } = params;
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [coverId, setCoverId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load images
  useEffect(() => {
    async function loadImages() {
      const data = await ImageManager.getJobImages(jobId);
      setImages(data);
      const cover = data.find(img => img.is_cover);
      setCoverId(cover?.id || null);
      setLoading(false);
    }
    loadImages();
  }, [jobId]);

  // Handle new uploads
  const handleImagesUploaded = useCallback((newImages: UploadedImage[]) => {
    setImages(prev => [...prev, ...newImages]);
  }, []);

  // Handle delete
  const handleDelete = useCallback(async (image: UploadedImage) => {
    if (!confirm('Delete this image?')) return;

    await ImageManager.deleteImage(image);
    setImages(prev => prev.filter(img => img.id !== image.id));
    if (coverId === image.id) setCoverId(null);
  }, [coverId]);

  // Handle set cover
  const handleSetCover = useCallback(async (imageId: string) => {
    await ImageManager.setCoverImage(jobId, imageId);
    setCoverId(imageId);
  }, [jobId]);

  // Handle drag end (reorder)
  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex(img => img.id === active.id);
    const newIndex = images.findIndex(img => img.id === over.id);

    const newOrder = [...images];
    const [movedItem] = newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, movedItem);

    setImages(newOrder);
    await ImageManager.reorderImages(jobId, newOrder.map(img => img.id));
  }, [images, jobId]);

  // Upload hook
  const { uploadMultiple, uploading, progress, error } = useImageUpload({
    jobId,
    onUploadComplete: (image) => {
      setImages(prev => [...prev, image]);
    }
  });

  // File input handler
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await uploadMultiple(files);
    }
  };

  if (loading) {
    return <div className="p-8">Loading images...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Job Images</h1>

      {/* Upload Area */}
      <div className="mb-8">
        <label className={`
          flex flex-col items-center justify-center w-full h-32
          border-2 border-dashed rounded-lg cursor-pointer
          ${uploading ? 'bg-blue-50 border-blue-300' : 'border-gray-300 hover:border-gray-400'}
        `}>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/heic"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <div className="text-center">
              <p className="text-blue-600">Uploading... {Math.round(progress)}%</p>
              <div className="w-48 bg-blue-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600">Click to upload images</p>
              <p className="text-sm text-gray-400">JPG, PNG, WebP, HEIC - Max 25MB</p>
            </div>
          )}
        </label>
        {error && (
          <p className="mt-2 text-red-600 text-sm">{error}</p>
        )}
      </div>

      {/* Image Grid */}
      {images.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No images uploaded yet
        </div>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images.map(img => img.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((image) => (
                <SortableImageCard
                  key={image.id}
                  image={image}
                  isCover={image.id === coverId}
                  onDelete={() => handleDelete(image)}
                  onSetCover={() => handleSetCover(image.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Summary */}
      <div className="mt-8 text-sm text-gray-500">
        {images.length} image{images.length !== 1 ? 's' : ''} uploaded
      </div>
    </div>
  );
}
```

---

## Best Practices Summary

### Storage Organization
1. Use separate buckets for raw uploads vs processed images
2. Organize by `job_id` as the top-level folder
3. Use UUIDs for filenames to prevent collisions
4. Store original file names in metadata table

### Security
1. Keep buckets private; use signed URLs for access
2. Implement RLS policies based on job ownership
3. Set appropriate file size and MIME type limits
4. Validate files both client-side and server-side

### Performance
1. Use on-the-fly transformations instead of pre-generating variants
2. Set appropriate cache-control headers (3600+ seconds)
3. Use `loading="lazy"` for images below the fold
4. Generate signed URLs in batch when displaying multiple images

### Metadata Sync
1. Store image metadata in Postgres with RLS
2. Use database triggers to sync deletions
3. Track sort order and cover image in database
4. Include dimensions for layout optimization

### Error Handling
1. Rollback storage uploads if database insert fails
2. Handle signed URL expiration gracefully
3. Provide meaningful error messages to users
4. Log errors for debugging

---

## Sources

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase Image Transformations](https://supabase.com/docs/guides/storage/serving/image-transformations)
- [JavaScript Storage API Reference](https://supabase.com/docs/reference/javascript/storage-from-upload)
- [Building a React Image Uploader with Supabase Storage](https://www.owolf.com/blog/building-a-react-image-uploader-with-supabase-storage)
- [Supabase Dropzone Component](https://supabase.com/ui/docs/nextjs/dropzone)
- [Complete Guide to File Uploads with Next.js and Supabase](https://supalaunch.com/blog/file-upload-nextjs-supabase)
- [Supabase Storage File Upload Guide](https://nikofischer.com/supabase-storage-file-upload-guide)
- [Storage Schema Design](https://supabase.com/docs/guides/storage/schema/design)
- [Supabase Storage GitHub](https://github.com/supabase/storage)
- [Triggering Functions on File Upload](https://github.com/orgs/supabase/discussions/6540)
- [How to Organize Folders in Supabase Storage](https://www.rapidevelopers.com/supabase-tutorial/how-to-organize-folders-in-supabase-storage)
