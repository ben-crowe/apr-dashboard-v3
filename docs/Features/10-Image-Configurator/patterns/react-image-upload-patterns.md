# React Image Upload Patterns

> Research completed: 2026-01-03
> Use case: Image Page Configurator - batch upload of 100+ property photos with progress, previews, and Supabase Storage integration

## Executive Summary

This document compares two leading React upload libraries for implementing batch image uploads:

| Feature | Uppy | react-dropzone |
|---------|------|----------------|
| **Bundle Size** | ~150KB (with Dashboard) | ~10KB |
| **UI Components** | Full Dashboard included | Headless - bring your own UI |
| **Progress Tracking** | Built-in with TUS protocol | Manual with Axios |
| **Resumable Uploads** | Native TUS support | Not supported |
| **Supabase Integration** | Official examples available | Custom implementation |
| **Learning Curve** | Medium | Low |
| **Best For** | Large files, resumable uploads | Simple drag-drop, custom UI |

**Recommendation:** Use **Uppy** for the Image Page Configurator due to:
- Native resumable upload support for large batches
- Built-in progress tracking per file
- Official Supabase TUS integration
- Dashboard component reduces development time

---

## Option 1: Uppy

### Overview

Uppy is a modular file uploader with a polished Dashboard UI, support for cloud sources (Google Drive, Dropbox), and native TUS protocol for resumable uploads.

### Installation

```bash
npm install @uppy/core @uppy/dashboard @uppy/tus @uppy/react
# or
yarn add @uppy/core @uppy/dashboard @uppy/tus @uppy/react
```

### CSS Requirements

```javascript
// Import in your main file or component
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
```

### Basic Setup with React

```tsx
import React, { useState } from 'react';
import Uppy from '@uppy/core';
import Dashboard from '@uppy/react/lib/Dashboard';
import Tus from '@uppy/tus';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

interface ImageUploaderProps {
  bucketName: string;
  onUploadComplete?: (files: any[]) => void;
}

function ImageUploader({ bucketName, onUploadComplete }: ImageUploaderProps) {
  // IMPORTANT: Use initializer function to prevent reinstantiation
  const [uppy] = useState(() =>
    new Uppy({
      id: 'image-uploader',
      autoProceed: false,
      restrictions: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        maxNumberOfFiles: 100,
        allowedFileTypes: ['image/*'],
      },
    })
    .use(Tus, {
      endpoint: 'https://your-project.supabase.co/storage/v1/upload/resumable',
      headers: {
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      chunkSize: 6 * 1024 * 1024, // 6MB required by Supabase
      retryDelays: [0, 3000, 5000, 10000, 20000],
    })
    .on('file-added', (file) => {
      // Set Supabase-specific metadata
      uppy.setFileMeta(file.id, {
        bucketName: bucketName,
        objectName: `${Date.now()}-${file.name}`,
        contentType: file.type,
      });
    })
    .on('complete', (result) => {
      console.log('Upload complete:', result.successful);
      onUploadComplete?.(result.successful);
    })
  );

  return (
    <Dashboard
      uppy={uppy}
      width="100%"
      height={450}
      showProgressDetails={true}
      proudlyDisplayPoweredByUppy={false}
      note="Upload up to 100 images (max 10MB each)"
    />
  );
}

export default ImageUploader;
```

### With Supabase Storage (Complete Example)

```tsx
import React, { useState, useEffect } from 'react';
import Uppy from '@uppy/core';
import Dashboard from '@uppy/react/lib/Dashboard';
import Tus from '@uppy/tus';
import { createClient } from '@supabase/supabase-js';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
}

interface PropertyImageUploaderProps {
  propertyId: string;
  onFilesUploaded: (files: UploadedFile[]) => void;
}

export function PropertyImageUploader({
  propertyId,
  onFilesUploaded
}: PropertyImageUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const [uppy] = useState(() => {
    const uppyInstance = new Uppy({
      id: 'property-images',
      autoProceed: false,
      restrictions: {
        maxFileSize: 10 * 1024 * 1024,
        maxNumberOfFiles: 150,
        allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
      },
    });

    uppyInstance.use(Tus, {
      endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
      headers: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return {
          Authorization: `Bearer ${session?.access_token}`,
          'x-upsert': 'true', // Allow overwriting
        };
      },
      chunkSize: 6 * 1024 * 1024,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      allowedMetaFields: ['bucketName', 'objectName', 'contentType', 'cacheControl'],
    });

    return uppyInstance;
  });

  useEffect(() => {
    // Set metadata when files are added
    uppy.on('file-added', (file) => {
      const objectName = `properties/${propertyId}/${Date.now()}-${file.name}`;
      uppy.setFileMeta(file.id, {
        bucketName: 'property-images',
        objectName: objectName,
        contentType: file.type,
        cacheControl: '3600',
      });
    });

    // Handle upload completion
    uppy.on('upload-success', (file, response) => {
      if (file) {
        const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/property-images/${file.meta.objectName}`;

        setUploadedFiles(prev => [...prev, {
          id: file.id,
          name: file.name,
          url: publicUrl,
          size: file.size,
        }]);
      }
    });

    uppy.on('complete', (result) => {
      if (result.successful.length > 0) {
        onFilesUploaded(uploadedFiles);
      }
    });

    uppy.on('upload-error', (file, error) => {
      console.error('Upload failed:', file?.name, error);
    });

    return () => {
      uppy.close();
    };
  }, [uppy, propertyId, onFilesUploaded, uploadedFiles]);

  return (
    <div className="property-uploader">
      <Dashboard
        uppy={uppy}
        width="100%"
        height={500}
        showProgressDetails={true}
        showRemoveButtonAfterComplete={true}
        doneButtonHandler={() => {
          uppy.cancelAll();
          setUploadedFiles([]);
        }}
        note="Drag and drop property images (JPEG, PNG, WebP - max 10MB each)"
        locale={{
          strings: {
            dropPasteFiles: 'Drop property images here or %{browseFiles}',
            browseFiles: 'browse files',
          },
        }}
      />
    </div>
  );
}
```

### Progress Tracking with Hooks

```tsx
import { useUppyState, useUppyEvent } from '@uppy/react';

function UploadProgress({ uppy }: { uppy: Uppy }) {
  // Reactive state access
  const files = useUppyState(uppy, (state) => state.files);
  const totalProgress = useUppyState(uppy, (state) => state.totalProgress);

  // Event listening
  const [completedResults] = useUppyEvent(uppy, 'complete');

  return (
    <div className="upload-progress">
      <div className="overall-progress">
        <div
          className="progress-bar"
          style={{ width: `${totalProgress}%` }}
        />
        <span>{totalProgress}% complete</span>
      </div>

      <div className="file-list">
        {Object.values(files).map((file: any) => (
          <div key={file.id} className="file-item">
            <span>{file.name}</span>
            <span>{file.progress?.percentage ?? 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Dashboard Modal Variant

```tsx
import { useState } from 'react';
import DashboardModal from '@uppy/react/lib/DashboardModal';

function ModalUploader({ uppy }: { uppy: Uppy }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Upload Images
      </button>

      <DashboardModal
        uppy={uppy}
        open={isOpen}
        onRequestClose={() => setIsOpen(false)}
        closeModalOnClickOutside={true}
        closeAfterFinish={false}
      />
    </>
  );
}
```

---

## Option 2: react-dropzone

### Overview

react-dropzone is a lightweight, headless library providing drag-and-drop file selection. It handles file input only - you implement the upload logic separately.

### Installation

```bash
npm install react-dropzone axios
# or
yarn add react-dropzone axios
```

### Basic Setup

```tsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileWithPreview extends File {
  preview: string;
}

function BasicDropzone() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    ));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 100,
  });

  // Cleanup previews on unmount
  useEffect(() => {
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <div>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the images here...</p>
        ) : (
          <p>Drag and drop images, or click to select</p>
        )}
      </div>

      <div className="preview-grid">
        {files.map(file => (
          <div key={file.name} className="preview-item">
            <img src={file.preview} alt={file.name} />
            <span>{file.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Batch Upload with Progress Tracking

```tsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface FileProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

interface BatchUploaderProps {
  propertyId: string;
  onComplete: (urls: string[]) => void;
}

export function BatchImageUploader({ propertyId, onComplete }: BatchUploaderProps) {
  const [fileProgress, setFileProgress] = useState<FileProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFileProgress(acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending',
    })));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 100,
    disabled: isUploading,
  });

  const uploadFile = async (fileItem: FileProgress, index: number): Promise<string> => {
    const { file } = fileItem;
    const fileName = `properties/${propertyId}/${Date.now()}-${file.name}`;

    // Update status to uploading
    setFileProgress(prev => prev.map((item, i) =>
      i === index ? { ...item, status: 'uploading' as const } : item
    ));

    try {
      // Get signed upload URL from Supabase
      const { data, error } = await supabase.storage
        .from('property-images')
        .createSignedUploadUrl(fileName);

      if (error) throw error;

      // Upload with progress tracking
      await axios.put(data.signedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
          );
          setFileProgress(prev => prev.map((item, i) =>
            i === index ? { ...item, progress } : item
          ));
        },
      });

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      // Update status to success
      setFileProgress(prev => prev.map((item, i) =>
        i === index ? { ...item, status: 'success' as const, url: urlData.publicUrl } : item
      ));

      return urlData.publicUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setFileProgress(prev => prev.map((item, i) =>
        i === index ? { ...item, status: 'error' as const, error: errorMessage } : item
      ));
      throw error;
    }
  };

  const uploadAll = async () => {
    setIsUploading(true);
    const uploadPromises = fileProgress.map((item, index) =>
      uploadFile(item, index).catch(() => null) // Continue on individual failures
    );

    const results = await Promise.all(uploadPromises);
    const successfulUrls = results.filter((url): url is string => url !== null);

    setIsUploading(false);
    onComplete(successfulUrls);
  };

  const removeFile = (index: number) => {
    setFileProgress(prev => prev.filter((_, i) => i !== index));
  };

  const overallProgress = fileProgress.length > 0
    ? Math.round(fileProgress.reduce((sum, f) => sum + f.progress, 0) / fileProgress.length)
    : 0;

  return (
    <div className="batch-uploader">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${isUploading ? 'disabled' : ''}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop images here...</p>
        ) : (
          <p>Drag and drop up to 100 images, or click to select</p>
        )}
      </div>

      {fileProgress.length > 0 && (
        <div className="upload-panel">
          <div className="overall-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <span>{overallProgress}% - {fileProgress.length} files</span>
          </div>

          <div className="file-list">
            {fileProgress.map((item, index) => (
              <div key={index} className={`file-item ${item.status}`}>
                <div className="file-preview">
                  <img
                    src={URL.createObjectURL(item.file)}
                    alt={item.file.name}
                  />
                </div>
                <div className="file-info">
                  <span className="file-name">{item.file.name}</span>
                  <div className="file-progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
                <div className="file-status">
                  {item.status === 'pending' && (
                    <button onClick={() => removeFile(index)}>Remove</button>
                  )}
                  {item.status === 'uploading' && <span>{item.progress}%</span>}
                  {item.status === 'success' && <span>Done</span>}
                  {item.status === 'error' && <span title={item.error}>Failed</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="actions">
            <button
              onClick={uploadAll}
              disabled={isUploading || fileProgress.length === 0}
            >
              {isUploading ? 'Uploading...' : `Upload ${fileProgress.length} Images`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Preview Generation Utility

```tsx
// utils/imagePreview.ts

export interface PreviewOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export async function generateThumbnail(
  file: File,
  options: PreviewOptions = {}
): Promise<string> {
  const { maxWidth = 200, maxHeight = 200, quality = 0.8 } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export async function generateThumbnails(
  files: File[],
  options?: PreviewOptions
): Promise<Map<string, string>> {
  const thumbnails = new Map<string, string>();

  await Promise.all(
    files.map(async (file) => {
      try {
        const thumbnail = await generateThumbnail(file, options);
        thumbnails.set(file.name, thumbnail);
      } catch (error) {
        console.warn(`Failed to generate thumbnail for ${file.name}:`, error);
      }
    })
  );

  return thumbnails;
}
```

### CSS Styling

```css
/* dropzone-styles.css */

.dropzone {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #fafafa;
}

.dropzone:hover {
  border-color: #666;
  background-color: #f0f0f0;
}

.dropzone.active {
  border-color: #2196f3;
  background-color: #e3f2fd;
}

.dropzone.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.upload-panel {
  margin-top: 20px;
}

.overall-progress {
  margin-bottom: 16px;
}

.progress-bar {
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.file-item.success {
  border-color: #4caf50;
  background-color: #e8f5e9;
}

.file-item.error {
  border-color: #f44336;
  background-color: #ffebee;
}

.file-preview {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

.file-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  display: block;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.file-progress-bar {
  height: 4px;
  background-color: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
}
```

---

## Comparison: Uppy vs react-dropzone

### When to Use Uppy

- Large file uploads (> 6MB) requiring resumability
- Need built-in UI with minimal customization
- Want cloud source integration (Google Drive, Dropbox)
- Require progress tracking out of the box
- Working with Supabase TUS protocol
- Limited development time

### When to Use react-dropzone

- Small file uploads
- Highly custom UI requirements
- Bundle size is critical
- Simple drag-and-drop without upload logic
- Already have upload infrastructure
- Want full control over upload behavior

---

## Recommended: Uppy for Image Page Configurator

For the specific use case of uploading 100+ property photos with progress indicators:

### Rationale

1. **Resumable Uploads**: TUS protocol ensures large batch uploads survive network interruptions
2. **Built-in Progress**: Per-file and overall progress tracking without custom implementation
3. **Supabase Integration**: Official examples and documentation for TUS with Supabase Storage
4. **Production Ready**: Dashboard component provides polished UX immediately
5. **Scalability**: Handles 100+ files with proper queue management

### Trade-offs Accepted

- Larger bundle size (~150KB vs ~10KB)
- Less UI customization flexibility
- Dependency on Uppy ecosystem

---

## Full Example: Batch Upload to Supabase

This complete implementation combines Uppy with Supabase Storage for the Image Page Configurator:

```tsx
// components/PropertyImageUploader.tsx

import React, { useState, useEffect, useMemo } from 'react';
import Uppy, { UppyFile } from '@uppy/core';
import Dashboard from '@uppy/react/lib/Dashboard';
import Tus from '@uppy/tus';
import ThumbnailGenerator from '@uppy/thumbnail-generator';
import { createClient } from '@supabase/supabase-js';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

// Types
interface UploadedImage {
  id: string;
  fileName: string;
  url: string;
  thumbnailUrl: string;
  size: number;
  uploadedAt: Date;
}

interface PropertyImageUploaderProps {
  propertyId: string;
  existingImages?: UploadedImage[];
  maxImages?: number;
  onImagesChange: (images: UploadedImage[]) => void;
  onError?: (error: Error) => void;
}

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function PropertyImageUploader({
  propertyId,
  existingImages = [],
  maxImages = 150,
  onImagesChange,
  onError,
}: PropertyImageUploaderProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(existingImages);
  const [isUploading, setIsUploading] = useState(false);

  const remainingSlots = maxImages - uploadedImages.length;

  const uppy = useMemo(() => {
    const instance = new Uppy({
      id: 'property-images',
      autoProceed: false,
      restrictions: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        maxNumberOfFiles: remainingSlots,
        allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
      },
      meta: {
        propertyId,
      },
    });

    // Add thumbnail generator for previews
    instance.use(ThumbnailGenerator, {
      thumbnailWidth: 200,
      thumbnailHeight: 200,
      thumbnailType: 'image/jpeg',
      waitForThumbnailsBeforeUpload: false,
    });

    // Configure TUS for Supabase
    instance.use(Tus, {
      endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
      headers: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return {
          Authorization: `Bearer ${session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'x-upsert': 'true',
        };
      },
      chunkSize: 6 * 1024 * 1024, // 6MB - required by Supabase
      retryDelays: [0, 3000, 5000, 10000, 20000],
      allowedMetaFields: ['bucketName', 'objectName', 'contentType', 'cacheControl'],
      removeFingerprintOnSuccess: true, // Allow re-uploading same file
    });

    return instance;
  }, [propertyId, remainingSlots]);

  useEffect(() => {
    // Set metadata when file is added
    const handleFileAdded = (file: UppyFile) => {
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const objectName = `properties/${propertyId}/${timestamp}-${safeName}`;

      uppy.setFileMeta(file.id, {
        bucketName: 'property-images',
        objectName: objectName,
        contentType: file.type || 'image/jpeg',
        cacheControl: '31536000', // 1 year cache
      });
    };

    // Handle successful upload
    const handleUploadSuccess = (file: UppyFile | undefined, response: any) => {
      if (!file) return;

      const objectName = file.meta.objectName as string;
      const { data } = supabase.storage
        .from('property-images')
        .getPublicUrl(objectName);

      // Generate thumbnail URL
      const thumbnailUrl = supabase.storage
        .from('property-images')
        .getPublicUrl(objectName, {
          transform: {
            width: 200,
            height: 200,
            resize: 'cover',
          },
        }).data.publicUrl;

      const newImage: UploadedImage = {
        id: file.id,
        fileName: file.name,
        url: data.publicUrl,
        thumbnailUrl,
        size: file.size,
        uploadedAt: new Date(),
      };

      setUploadedImages(prev => {
        const updated = [...prev, newImage];
        onImagesChange(updated);
        return updated;
      });
    };

    // Handle upload start
    const handleUploadStart = () => {
      setIsUploading(true);
    };

    // Handle upload complete
    const handleComplete = (result: any) => {
      setIsUploading(false);
      if (result.failed.length > 0) {
        const failedNames = result.failed.map((f: UppyFile) => f.name).join(', ');
        onError?.(new Error(`Failed to upload: ${failedNames}`));
      }
    };

    // Handle errors
    const handleError = (file: UppyFile | undefined, error: Error) => {
      console.error('Upload error:', file?.name, error);
      onError?.(error);
    };

    // Attach event listeners
    uppy.on('file-added', handleFileAdded);
    uppy.on('upload-success', handleUploadSuccess);
    uppy.on('upload', handleUploadStart);
    uppy.on('complete', handleComplete);
    uppy.on('upload-error', handleError);

    return () => {
      uppy.off('file-added', handleFileAdded);
      uppy.off('upload-success', handleUploadSuccess);
      uppy.off('upload', handleUploadStart);
      uppy.off('complete', handleComplete);
      uppy.off('upload-error', handleError);
    };
  }, [uppy, propertyId, onImagesChange, onError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      uppy.close();
    };
  }, [uppy]);

  const handleRemoveImage = async (imageId: string) => {
    const image = uploadedImages.find(img => img.id === imageId);
    if (!image) return;

    try {
      // Extract path from URL
      const urlParts = new URL(image.url);
      const path = urlParts.pathname.split('/property-images/')[1];

      if (path) {
        await supabase.storage.from('property-images').remove([path]);
      }

      setUploadedImages(prev => {
        const updated = prev.filter(img => img.id !== imageId);
        onImagesChange(updated);
        return updated;
      });
    } catch (error) {
      console.error('Failed to delete image:', error);
      onError?.(error as Error);
    }
  };

  return (
    <div className="property-image-uploader">
      <div className="uploader-header">
        <h3>Property Images</h3>
        <span className="image-count">
          {uploadedImages.length} / {maxImages} images
        </span>
      </div>

      {uploadedImages.length > 0 && (
        <div className="existing-images">
          <h4>Uploaded Images</h4>
          <div className="image-grid">
            {uploadedImages.map(image => (
              <div key={image.id} className="image-item">
                <img src={image.thumbnailUrl} alt={image.fileName} />
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveImage(image.id)}
                  disabled={isUploading}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {remainingSlots > 0 ? (
        <Dashboard
          uppy={uppy}
          width="100%"
          height={400}
          showProgressDetails={true}
          showRemoveButtonAfterComplete={true}
          proudlyDisplayPoweredByUppy={false}
          theme="light"
          note={`Upload up to ${remainingSlots} more images (JPEG, PNG, WebP - max 10MB each)`}
          locale={{
            strings: {
              dropPasteFiles: 'Drop property images here or %{browseFiles}',
              browseFiles: 'browse files',
              uploading: 'Uploading',
              complete: 'Complete',
              uploadFailed: 'Upload failed',
              paused: 'Paused',
              retry: 'Retry',
              cancel: 'Cancel',
              filesUploadedOfTotal: '%{complete} of %{smart_count} file uploaded |||| %{complete} of %{smart_count} files uploaded',
              dataUploadedOfTotal: '%{complete} of %{total}',
              xTimeLeft: '%{time} left',
              uploadXFiles: 'Upload %{smart_count} file |||| Upload %{smart_count} files',
              uploadXNewFiles: 'Upload +%{smart_count} file |||| Upload +%{smart_count} files',
            },
          }}
        />
      ) : (
        <div className="max-reached">
          Maximum number of images reached ({maxImages})
        </div>
      )}

      <style jsx>{`
        .property-image-uploader {
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: #fff;
        }

        .uploader-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .uploader-header h3 {
          margin: 0;
        }

        .image-count {
          color: #666;
          font-size: 14px;
        }

        .existing-images {
          margin-bottom: 24px;
        }

        .existing-images h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: #666;
        }

        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 12px;
        }

        .image-item {
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          aspect-ratio: 1;
        }

        .image-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          padding: 4px 8px;
          font-size: 12px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .image-item:hover .remove-btn {
          opacity: 1;
        }

        .remove-btn:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .max-reached {
          padding: 40px;
          text-align: center;
          background: #f5f5f5;
          border-radius: 8px;
          color: #666;
        }
      `}</style>
    </div>
  );
}

export default PropertyImageUploader;
```

### Usage Example

```tsx
// pages/property/[id]/images.tsx

import { PropertyImageUploader, UploadedImage } from '@/components/PropertyImageUploader';

export default function PropertyImagesPage({ propertyId }: { propertyId: string }) {
  const handleImagesChange = (images: UploadedImage[]) => {
    console.log('Images updated:', images.length);
    // Save to database, update state, etc.
  };

  const handleError = (error: Error) => {
    console.error('Upload error:', error);
    // Show toast notification
  };

  return (
    <div className="page-container">
      <h1>Property Images</h1>
      <PropertyImageUploader
        propertyId={propertyId}
        maxImages={150}
        onImagesChange={handleImagesChange}
        onError={handleError}
      />
    </div>
  );
}
```

---

## Supabase Storage Setup

### 1. Create Bucket

```sql
-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true);
```

### 2. Configure Policies

```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-images');

-- Allow public read access
CREATE POLICY "Allow public read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'property-images');

-- Allow owners to delete their files
CREATE POLICY "Allow owner delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[2]);
```

### 3. Enable Image Transformations

In your Supabase dashboard, enable image transformations for automatic thumbnail generation on-the-fly.

---

## Error Handling and Retries

### Uppy Configuration

```tsx
uppy.use(Tus, {
  // Retry configuration
  retryDelays: [0, 3000, 5000, 10000, 20000], // 5 retries with increasing delays

  // Handle upload errors
  onBeforeRequest: (req) => {
    // Add custom error handling
  },

  onAfterResponse: (req, res) => {
    if (res.getStatus() >= 400) {
      // Log or handle HTTP errors
    }
  },
});

// Global error handling
uppy.on('upload-error', (file, error, response) => {
  if (response?.status === 413) {
    // File too large
  } else if (response?.status === 401) {
    // Authentication error - refresh token
  } else if (response?.status === 409) {
    // Conflict - file already being uploaded
  }
});
```

### react-dropzone Error Handling

```tsx
const { getRootProps, getInputProps, fileRejections } = useDropzone({
  onDrop,
  accept: { 'image/*': [] },
  maxSize: 10 * 1024 * 1024,
  onDropRejected: (rejections) => {
    rejections.forEach(({ file, errors }) => {
      errors.forEach(error => {
        switch (error.code) {
          case 'file-too-large':
            console.error(`${file.name} is too large`);
            break;
          case 'file-invalid-type':
            console.error(`${file.name} has invalid type`);
            break;
          default:
            console.error(`${file.name}: ${error.message}`);
        }
      });
    });
  },
});
```

---

## Sources

### Uppy Documentation
- [Uppy React Documentation](https://uppy.io/docs/react/)
- [Uppy Dashboard Component](https://uppy.io/docs/react/dashboard/)
- [Uppy Dashboard Modal](https://uppy.io/docs/react/dashboard-modal/)
- [Uppy Dashboard Plugin](https://uppy.io/docs/dashboard/)
- [Uppy npm package](https://www.npmjs.com/package/@uppy/react)

### react-dropzone Documentation
- [react-dropzone Official Site](https://react-dropzone.js.org/)
- [react-dropzone GitHub](https://github.com/react-dropzone/react-dropzone)

### Supabase Storage
- [Supabase Resumable Uploads](https://supabase.com/docs/guides/storage/uploads/resumable-uploads)
- [Official Uppy + Supabase Example](https://github.com/supabase/supabase/tree/master/examples/storage/resumable-upload-uppy)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)

### Tutorials and Examples
- [BezKoder React Dropzone Tutorial](https://www.bezkoder.com/react-dropzone-multiple-files-upload/)
- [BezKoder GitHub Example](https://github.com/bezkoder/react-dropzone-multiple-files-upload)
- [Uppy React Dashboard CodeSandbox](https://codesandbox.io/s/uppy-react-dashboard-1xsc4b)
- [Uppy with Supabase Discussion](https://github.com/orgs/supabase/discussions/26424)
