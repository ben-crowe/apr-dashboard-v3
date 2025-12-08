import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useReportBuilderStore } from '../../store/reportBuilderStore';
import { ReportField } from '../../types/reportBuilder.types';
import {
  GripVertical,
  X,
  Plus,
  Upload,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageFieldEditorProps {
  field: ReportField;
}

export default function ImageFieldEditor({ field }: ImageFieldEditorProps) {
  const { reorderImages, addImage, removeImage, updateFieldValue } = useReportBuilderStore();
  const [newImageUrl, setNewImageUrl] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine if this is a single image field (img-* prefix)
  const isSingleImageField = field.id.startsWith('img-');

  // Get value based on field mode
  const singleImageValue = isSingleImageField ? (field.value as string || '') : '';
  const images = !isSingleImageField ? ((field.value as string[]) || []) : [];

  // Convert File to data URL
  const fileToDataUrl = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  // Handle file selection
  const handleFileSelect = async (file: File, replaceMode = false) => {
    if (!file.type.startsWith('image/')) {
      setError('Not an image file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert to data URL (Supabase integration comes later)
      const dataUrl = await fileToDataUrl(file);

      if (isSingleImageField) {
        // Single mode: replace the value
        updateFieldValue(field.id, dataUrl);
      } else {
        // Array mode: add to array (or replace if replaceMode)
        if (replaceMode && images.length > 0) {
          // Replace first image
          const newImages = [dataUrl, ...images.slice(1)];
          updateFieldValue(field.id, newImages);
        } else {
          // Add new image
          addImage(field.id, dataUrl);
        }
      }
    } catch (err) {
      console.error('Failed to process image:', err);
      setError('Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };

  // Drag handlers for FILE uploads
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(f => f.type.startsWith('image/'));

    if (imageFile) {
      await handleFileSelect(imageFile);
    }
  };

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  // Handle paste from clipboard
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          await handleFileSelect(file);
          return;
        }
      }
    }
  };

  // Clear single image
  const handleClearSingle = () => {
    updateFieldValue(field.id, '');
    setError(null);
  };

  // Drag handlers for IMAGE REORDERING (array mode only)
  const handleImageDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    reorderImages(field.id, newImages);
    setDraggedIndex(index);
  };

  const handleImageDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      addImage(field.id, newImageUrl.trim());
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    removeImage(field.id, imageUrl);
  };

  // Check if single value has an image
  const hasSingleImage = singleImageValue && (
    singleImageValue.startsWith('data:image/') ||
    singleImageValue.startsWith('http://') ||
    singleImageValue.startsWith('https://') ||
    singleImageValue.startsWith('/')
  );

  // SINGLE IMAGE MODE - Compact layout
  if (isSingleImageField) {
    return (
      <div className="space-y-1">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />

        {hasSingleImage ? (
          // Compact image preview
          <div className="flex items-center gap-2">
            <div
              className="relative w-14 h-14 rounded border overflow-hidden bg-muted flex-shrink-0"
              title={singleImageValue}
            >
              <img
                src={singleImageValue}
                alt={field.label}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.opacity = '0.3';
                }}
              />
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Upload className="w-3 h-3 mr-1" />
                )}
                Replace
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 text-red-500 hover:text-red-600"
                onClick={handleClearSingle}
                disabled={isLoading}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ) : (
          // Compact drop zone
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded border-2 border-dashed cursor-pointer transition-colors',
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : error
                ? 'border-red-300 bg-red-50'
                : 'border-slate-300 hover:border-slate-400',
              isLoading && 'opacity-50 pointer-events-none'
            )}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onPaste={handlePaste}
            tabIndex={0}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
            ) : (
              <ImageIcon className="w-4 h-4 text-slate-400" />
            )}
            <span className={cn('text-sm', error ? 'text-red-500' : 'text-slate-500')}>
              {isLoading ? 'Uploading...' : error ? error : 'Drop image or click'}
            </span>
          </div>
        )}

        {/* Field ID - small */}
        <div className="text-[10px] text-slate-400">{field.id}</div>
      </div>
    );
  }

  // ARRAY MODE (existing behavior with file upload added)
  return (
    <div className="space-y-4">
      <Label>{field.label}</Label>

      {/* Field ID indicator */}
      <div className="text-xs text-muted-foreground font-mono">
        {field.id}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* File upload drop zone */}
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-md border-2 border-dashed cursor-pointer transition-colors',
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-border hover:border-blue-400 bg-muted/30',
          isLoading && 'opacity-50 pointer-events-none'
        )}
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
        tabIndex={0}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
        ) : (
          <Upload className="w-5 h-5 text-muted-foreground" />
        )}
        <div className="flex-1">
          <p className={cn(
            'text-sm',
            error ? 'text-red-500' : 'text-foreground'
          )}>
            {isLoading
              ? 'Uploading...'
              : error
              ? error
              : 'Upload Image File'}
          </p>
          <p className="text-xs text-muted-foreground">
            Click, drag & drop, or paste from clipboard
          </p>
        </div>
      </div>

      {/* Image list with drag-and-drop reordering */}
      {images.length > 0 && (
        <div className="space-y-2">
          {images.map((imageUrl, index) => (
            <div
              key={`${imageUrl}-${index}`}
              draggable
              onDragStart={() => handleImageDragStart(index)}
              onDragOver={(e) => handleImageDragOver(e, index)}
              onDragEnd={handleImageDragEnd}
              className={cn(
                'flex items-center gap-3 p-3 bg-muted rounded-md cursor-move hover:bg-muted/80 transition-colors',
                draggedIndex === index && 'opacity-50'
              )}
            >
              <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <img
                src={imageUrl}
                alt={`Property ${index + 1}`}
                className="w-16 h-16 object-cover rounded border border-border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.opacity = '0.3';
                }}
              />
              <span className="flex-1 text-sm truncate">{imageUrl}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveImage(imageUrl)}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add image via URL (legacy support) */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Or add via URL:</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Enter image URL"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddImage();
              }
            }}
          />
          <Button onClick={handleAddImage} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {images.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-md">
          No images added yet. Upload a file or add an image URL to get started.
        </p>
      )}

      {/* Mode indicator */}
      <div className="text-[10px] text-muted-foreground">
        Mode: Array (Multiple Images) | Storage: Data URL (Supabase later)
      </div>
    </div>
  );
}
