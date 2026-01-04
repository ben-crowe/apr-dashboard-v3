/**
 * ImageUploadZone Component
 * Drag-drop zone for bulk image uploads with progress tracking
 * Uses native HTML5 drag-drop (can be upgraded to Uppy/FilePond later)
 */

import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { STORAGE_BUCKETS, storagePaths, UploadProgress } from '../types';
import { v4 as uuid } from 'uuid';

interface ImageUploadZoneProps {
  jobId: string;
  onUploadComplete?: (imageIds: string[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  className?: string;
}

export function ImageUploadZone({
  jobId,
  onUploadComplete,
  maxFiles = 500,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/webp'],
  className = '',
}: ImageUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update a single upload's progress
  const updateUpload = useCallback((fileId: string, updates: Partial<UploadProgress>) => {
    setUploads((prev) =>
      prev.map((u) => (u.fileId === fileId ? { ...u, ...updates } : u))
    );
  }, []);

  // Upload a single file
  const uploadFile = useCallback(
    async (file: File): Promise<string | null> => {
      const fileId = uuid();
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const storagePath = storagePaths.raw(jobId, fileId);

      // Add to uploads list
      setUploads((prev) => [
        ...prev,
        {
          fileId,
          fileName: file.name,
          progress: 0,
          status: 'uploading',
        },
      ]);

      try {
        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKETS.RAW)
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        updateUpload(fileId, { progress: 50, status: 'processing' });

        // Get image dimensions
        const dimensions = await getImageDimensions(file);

        // Create job_images record
        const { error: dbError } = await supabase.from('job_images').insert({
          id: fileId,
          job_id: jobId,
          original_filename: file.name,
          storage_path: storagePath,
          file_size: file.size,
          width: dimensions.width,
          height: dimensions.height,
          status: 'pending',
          selected_for_report: false,
        });

        if (dbError) throw dbError;

        updateUpload(fileId, { progress: 100, status: 'complete' });
        return fileId;
      } catch (error) {
        console.error('Upload failed:', file.name, error);
        updateUpload(fileId, {
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed',
        });
        return null;
      }
    },
    [jobId, updateUpload]
  );

  // Process multiple files
  const processFiles = useCallback(
    async (files: File[]) => {
      // Filter to only accepted types
      const validFiles = files.filter((f) =>
        acceptedTypes.some((type) => f.type.match(type.replace('*', '.*')))
      );

      if (validFiles.length === 0) {
        console.warn('No valid image files found');
        return;
      }

      // Limit files
      const filesToUpload = validFiles.slice(0, maxFiles);
      setIsExpanded(true);

      // Upload all files (parallel with limit)
      const batchSize = 5; // Upload 5 at a time
      const uploadedIds: string[] = [];

      for (let i = 0; i < filesToUpload.length; i += batchSize) {
        const batch = filesToUpload.slice(i, i + batchSize);
        const results = await Promise.all(batch.map(uploadFile));
        uploadedIds.push(...results.filter((id): id is string => id !== null));
      }

      // Notify parent
      if (onUploadComplete && uploadedIds.length > 0) {
        onUploadComplete(uploadedIds);
      }
    },
    [acceptedTypes, maxFiles, uploadFile, onUploadComplete]
  );

  // Drag handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      await processFiles(files);
    },
    [processFiles]
  );

  // File input handler
  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        await processFiles(files);
      }
      // Reset input
      e.target.value = '';
    },
    [processFiles]
  );

  // Clear completed uploads
  const clearCompleted = useCallback(() => {
    setUploads((prev) => prev.filter((u) => u.status !== 'complete'));
  }, []);

  // Clear all uploads
  const clearAll = useCallback(() => {
    setUploads([]);
    setIsExpanded(false);
  }, []);

  // Stats
  const stats = {
    total: uploads.length,
    complete: uploads.filter((u) => u.status === 'complete').length,
    uploading: uploads.filter((u) => u.status === 'uploading' || u.status === 'processing')
      .length,
    errors: uploads.filter((u) => u.status === 'error').length,
  };

  return (
    <div className={`${className}`}>
      {/* Drop zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-slate-600 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800'
          }
        `}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          {isDragging ? (
            <>
              <Upload className="w-10 h-10 text-blue-400 animate-bounce" />
              <p className="text-blue-400 font-medium">Drop photos here</p>
            </>
          ) : (
            <>
              <ImageIcon className="w-10 h-10 text-slate-500" />
              <p className="text-slate-300 font-medium">
                Drop inspection photos here
              </p>
              <p className="text-slate-500 text-sm">
                or click to browse (up to {maxFiles} images)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Upload progress list */}
      {uploads.length > 0 && (
        <div className="mt-3">
          {/* Summary bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-800 rounded-t-lg border border-slate-700">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-sm text-slate-300"
            >
              <span>
                {stats.uploading > 0 ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                ) : stats.errors > 0 ? (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                )}
              </span>
              <span>
                {stats.complete}/{stats.total} uploaded
                {stats.errors > 0 && ` (${stats.errors} failed)`}
              </span>
            </button>

            <div className="flex items-center gap-2">
              {stats.complete > 0 && (
                <button
                  onClick={clearCompleted}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Clear done
                </button>
              )}
              <button
                onClick={clearAll}
                className="text-xs text-slate-400 hover:text-white"
              >
                Clear all
              </button>
            </div>
          </div>

          {/* File list */}
          {isExpanded && (
            <div className="max-h-48 overflow-y-auto border border-t-0 border-slate-700 rounded-b-lg bg-slate-900">
              {uploads.map((upload) => (
                <div
                  key={upload.fileId}
                  className="flex items-center gap-3 px-3 py-2 border-b border-slate-800 last:border-0"
                >
                  {/* Status icon */}
                  <div className="flex-shrink-0">
                    {upload.status === 'uploading' || upload.status === 'processing' ? (
                      <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    ) : upload.status === 'complete' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : upload.status === 'error' ? (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-600" />
                    )}
                  </div>

                  {/* File name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 truncate">{upload.fileName}</p>
                    {upload.error && (
                      <p className="text-xs text-red-400 truncate">{upload.error}</p>
                    )}
                  </div>

                  {/* Progress bar or status */}
                  <div className="flex-shrink-0 w-20">
                    {(upload.status === 'uploading' || upload.status === 'processing') && (
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${upload.progress}%` }}
                        />
                      </div>
                    )}
                    {upload.status === 'complete' && (
                      <span className="text-xs text-green-400">Done</span>
                    )}
                    {upload.status === 'error' && (
                      <span className="text-xs text-red-400">Failed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper to get image dimensions
async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
}

export default ImageUploadZone;
