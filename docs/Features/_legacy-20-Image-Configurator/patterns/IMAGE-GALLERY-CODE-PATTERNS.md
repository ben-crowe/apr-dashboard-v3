# Image Gallery Code Patterns - Ready-to-Use Snippets

**Last Updated:** 2026-01-03
**Source:** APR-Dashboard-v3 codebase analysis
**Status:** Production-ready patterns

---

## Pattern 1: Image Grid Display (2-4 Columns, Responsive)

**Use Case:** Responsive photo gallery for property images, document previews, inspection photos

```typescript
import React from 'react';
import { Image as ImageIcon, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageGridProps {
  images: string[];
  columns?: number; // 2, 3, or 4
  onRemove?: (index: number) => void;
  onPreview?: (url: string) => void;
}

export function ImageGrid({
  images,
  columns = 3,
  onRemove,
  onPreview
}: ImageGridProps) {
  const gridClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  }[columns] || 'grid-cols-3';

  return (
    <div className={`grid ${gridClass} gap-4 w-full`}>
      {images.map((imageUrl, index) => (
        <div
          key={`${imageUrl}-${index}`}
          className="relative aspect-square rounded-lg overflow-hidden bg-muted border border-border group"
        >
          {/* Image */}
          <img
            src={imageUrl}
            alt={`Image ${index + 1}`}
            className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = '0.3';
            }}
          />

          {/* Overlay Actions (visible on hover) */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:text-blue-200"
              onClick={() => onPreview?.(imageUrl)}
              title="Preview"
            >
              <Eye className="h-4 w-4" />
            </Button>
            {onRemove && (
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:text-red-400"
                onClick={() => onRemove(index)}
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Index Badge */}
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {index + 1}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Pattern 2: Image with Quality Indicator Badge

**Use Case:** Show quality status (High Resolution, Low Quality, Pending, etc.)

```typescript
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

interface ImageWithBadgeProps {
  imageUrl: string;
  quality?: 'high' | 'medium' | 'low' | 'pending';
  label?: string;
  size?: 'sm' | 'md' | 'lg'; // sm: 14x14, md: 20x20, lg: 28x28
}

const qualityConfig = {
  high: {
    badge: 'High Quality',
    icon: Check,
    variant: 'success' as const,
    color: 'bg-green-100 text-green-700'
  },
  medium: {
    badge: 'Standard',
    icon: Check,
    variant: 'default' as const,
    color: 'bg-blue-100 text-blue-700'
  },
  low: {
    badge: 'Low Resolution',
    icon: AlertCircle,
    variant: 'destructive' as const,
    color: 'bg-red-100 text-red-700'
  },
  pending: {
    badge: 'Processing',
    icon: Loader2,
    variant: 'secondary' as const,
    color: 'bg-gray-100 text-gray-700'
  }
};

const sizeConfig = {
  sm: 'w-14 h-14',
  md: 'w-20 h-20',
  lg: 'w-28 h-28'
};

export function ImageWithBadge({
  imageUrl,
  quality = 'medium',
  label,
  size = 'md'
}: ImageWithBadgeProps) {
  const config = qualityConfig[quality];
  const IconComponent = config.icon;

  return (
    <div className="space-y-2">
      <div className={`relative rounded-lg overflow-hidden border border-border ${sizeConfig[size]}`}>
        <img
          src={imageUrl}
          alt={label}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.opacity = '0.3';
          }}
        />
      </div>
      <div className="space-y-1">
        {label && <p className="text-sm font-medium truncate">{label}</p>}
        <Badge variant={config.variant} className="w-fit">
          <IconComponent className={`h-3 w-3 mr-1 ${quality === 'pending' ? 'animate-spin' : ''}`} />
          {config.badge}
        </Badge>
      </div>
    </div>
  );
}
```

---

## Pattern 3: Drag-Drop Image Upload with Preview

**Use Case:** Uploading multiple property images with immediate preview

```typescript
import React, { useState, useRef } from 'react';
import { Upload, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DragDropUploaderProps {
  onImagesAdded: (urls: string[]) => void;
  maxImages?: number;
}

export function DragDropUploader({
  onImagesAdded,
  maxImages = 10
}: DragDropUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    setIsLoading(true);
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));

    try {
      const urls = await Promise.all(
        imageFiles.slice(0, maxImages - preview.length).map(fileToDataUrl)
      );
      setPreview(prev => [...prev, ...urls]);
      onImagesAdded(urls);
    } catch (err) {
      console.error('Failed to process images:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removePreview = (index: number) => {
    setPreview(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-border hover:border-blue-400 hover:bg-muted/50'
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
            <span className="text-sm text-gray-600">Uploading...</span>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="h-8 w-8 mx-auto text-gray-400" />
            <div>
              <p className="text-sm font-medium">Drag images here or click to select</p>
              <p className="text-xs text-gray-500">
                {preview.length}/{maxImages} images
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Preview Grid */}
      {preview.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {preview.map((url, index) => (
            <div key={index} className="relative aspect-square rounded overflow-hidden group">
              <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 bg-red-500/80 hover:bg-red-600 text-white"
                onClick={() => removePreview(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Pattern 4: Image Filter/Multi-Select

**Use Case:** Filter images by type, quality, or section

```typescript
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ImageFilterProps {
  images: Array<{
    url: string;
    quality?: 'high' | 'medium' | 'low';
    section?: string;
    type?: 'photo' | 'document' | 'plan';
  }>;
}

export function ImageFilter({ images }: ImageFilterProps) {
  const [selectedFilters, setSelectedFilters] = useState<{
    quality?: string;
    section?: string;
    type?: string;
  }>({});

  // Extract unique filter values
  const qualities = [...new Set(images.map(i => i.quality).filter(Boolean))] as string[];
  const sections = [...new Set(images.map(i => i.section).filter(Boolean))] as string[];
  const types = [...new Set(images.map(i => i.type).filter(Boolean))] as string[];

  // Filter images based on selections
  const filtered = images.filter(img => {
    if (selectedFilters.quality && img.quality !== selectedFilters.quality) return false;
    if (selectedFilters.section && img.section !== selectedFilters.section) return false;
    if (selectedFilters.type && img.type !== selectedFilters.type) return false;
    return true;
  });

  const toggleFilter = (key: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [key]: prev[key as keyof typeof prev] === value ? undefined : value
    }));
  };

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="space-y-2">
        {/* Quality Filter */}
        {qualities.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">Quality</p>
            <div className="flex gap-1 flex-wrap">
              {qualities.map(q => (
                <Badge
                  key={q}
                  variant={selectedFilters.quality === q ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleFilter('quality', q)}
                >
                  {q}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Type Filter */}
        {types.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">Type</p>
            <div className="flex gap-1 flex-wrap">
              {types.map(t => (
                <Badge
                  key={t}
                  variant={selectedFilters.type === t ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleFilter('type', t)}
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Section Filter */}
        {sections.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">Section</p>
            <div className="flex gap-1 flex-wrap">
              {sections.map(s => (
                <Badge
                  key={s}
                  variant={selectedFilters.section === s ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleFilter('section', s)}
                >
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Result Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filtered.length} of {images.length} images
        </p>
        {Object.keys(selectedFilters).length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedFilters({})}
            className="text-xs h-7"
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Filtered Images Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {filtered.map((img, idx) => (
          <div key={idx} className="relative aspect-square rounded overflow-hidden bg-muted">
            <img src={img.url} alt={`Image ${idx}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-gray-500 py-8">No images match your filters</p>
      )}
    </div>
  );
}
```

---

## Pattern 5: Image List with Drag Reordering (Extracted from Source)

**Use Case:** Reorder images by dragging within a list view

```typescript
import React, { useState } from 'react';
import { GripVertical, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DraggableImageListProps {
  images: string[];
  onReorder: (images: string[]) => void;
  onRemove: (index: number) => void;
  onPreview?: (url: string) => void;
}

export function DraggableImageList({
  images,
  onReorder,
  onRemove,
  onPreview
}: DraggableImageListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    onReorder(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-2">
      {images.map((imageUrl, index) => (
        <div
          key={`${imageUrl}-${index}`}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`flex items-center gap-3 p-3 bg-muted rounded-md cursor-move hover:bg-muted/80 transition-colors ${
            draggedIndex === index ? 'opacity-50' : ''
          }`}
        >
          <GripVertical className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <img
            src={imageUrl}
            alt={`Image ${index + 1}`}
            className="w-16 h-16 object-cover rounded border border-border cursor-pointer hover:opacity-80"
            onClick={() => onPreview?.(imageUrl)}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{imageUrl}</p>
            <p className="text-xs text-gray-400">Image {index + 1}</p>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            {onPreview && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onPreview(imageUrl)}
                className="h-8 w-8"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onRemove(index)}
              className="h-8 w-8 text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Pattern 6: Image Preview Modal (Full Screen)

**Use Case:** Display high-quality image preview with keyboard navigation

```typescript
import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImagePreviewModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  currentIndex?: number;
  total?: number;
}

export function ImagePreviewModal({
  imageUrl,
  isOpen,
  onClose,
  onNext,
  onPrev,
  currentIndex,
  total
}: ImagePreviewModalProps) {
  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-2 animate-fade-in"
      onClick={onClose}
    >
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/20"
        onClick={onClose}
        title="Close (Esc)"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Main Image */}
      <div className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center">
        <img
          src={imageUrl}
          alt="Preview"
          className="max-w-[95vw] max-h-[95vh] object-contain rounded"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Navigation Arrows */}
        {onPrev && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            title="Previous (←)"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        {onNext && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            title="Next (→)"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Image Counter */}
      {currentIndex !== undefined && total !== undefined && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded text-sm">
          {currentIndex + 1} / {total}
        </div>
      )}

      {/* Keyboard hints */}
      <div className="absolute bottom-4 right-4 text-white/70 text-xs text-right space-y-1">
        <p>Esc to close</p>
        {(onNext || onPrev) && <p>← → to navigate</p>}
      </div>
    </div>
  );
}
```

---

## Pattern 7: Image Management Store Hook

**Use Case:** Centralized image state management for complex image operations

```typescript
import { useState, useCallback } from 'react';

interface ImageState {
  images: string[];
  selectedIndices: Set<number>;
  filteredIndices: Set<number>;
}

export function useImageManager(initialImages: string[] = []) {
  const [state, setState] = useState<ImageState>({
    images: initialImages,
    selectedIndices: new Set(),
    filteredIndices: new Set(initialImages.map((_, i) => i))
  });

  // Reorder images
  const reorder = useCallback((fromIndex: number, toIndex: number) => {
    setState(prev => {
      const newImages = [...prev.images];
      const image = newImages[fromIndex];
      newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, image);
      return { ...prev, images: newImages };
    });
  }, []);

  // Add images
  const add = useCallback((images: string[]) => {
    setState(prev => ({
      ...prev,
      images: [...prev.images, ...images]
    }));
  }, []);

  // Remove images
  const remove = useCallback((indices: number[]) => {
    setState(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => !indices.includes(i)),
      selectedIndices: new Set([...prev.selectedIndices].filter(i => !indices.includes(i)))
    }));
  }, []);

  // Select/deselect images
  const toggleSelect = useCallback((index: number) => {
    setState(prev => {
      const newSelected = new Set(prev.selectedIndices);
      if (newSelected.has(index)) {
        newSelected.delete(index);
      } else {
        newSelected.add(index);
      }
      return { ...prev, selectedIndices: newSelected };
    });
  }, []);

  // Select all visible
  const selectAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedIndices: new Set(prev.filteredIndices)
    }));
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedIndices: new Set()
    }));
  }, []);

  // Batch delete selected
  const deleteSelected = useCallback(() => {
    remove(Array.from(state.selectedIndices));
  }, [state.selectedIndices, remove]);

  return {
    images: state.images,
    selectedCount: state.selectedIndices.size,
    selectedIndices: state.selectedIndices,
    reorder,
    add,
    remove,
    toggleSelect,
    selectAll,
    clearSelection,
    deleteSelected
  };
}

// Usage Example:
// const { images, add, remove, reorder, toggleSelect, selectedCount } = useImageManager();
```

---

## Quick Integration Checklist

```typescript
// 1. Import needed components
import { ImageGrid } from '@/components/gallery/ImageGrid';
import { ImageWithBadge } from '@/components/gallery/ImageWithBadge';
import { DragDropUploader } from '@/components/gallery/DragDropUploader';
import { useImageManager } from '@/hooks/useImageManager';

// 2. Set up state
const { images, add, reorder, remove } = useImageManager();

// 3. Add uploader
<DragDropUploader onImagesAdded={add} />;

// 4. Display grid
<ImageGrid images={images} onRemove={remove} />;

// 5. Add reordering support (if using list view)
// Use DraggableImageList component
```

---

## Performance Optimization Tips

### For Large Image Sets (50+):

```typescript
// Use React.memo to prevent unnecessary re-renders
const ImageCard = React.memo(({ image, onDelete, onPreview }: ImageCardProps) => {
  return (
    <div className="relative aspect-square rounded overflow-hidden bg-muted">
      <img src={image} alt="Gallery item" className="w-full h-full object-cover" />
    </div>
  );
});

// Use virtualization for very large lists
import { FixedSizeList as List } from 'react-window';

const largeGallery = (
  <List
    height={600}
    itemCount={images.length}
    itemSize={150}
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>
        <img src={images[index]} alt={`Item ${index}`} />
      </div>
    )}
  </List>
);

// Lazy load images
const LazyImage = ({ src, alt }: { src: string; alt: string }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    decoding="async"
    className="w-full h-full object-cover"
  />
);
```

---

## File References

All patterns extracted from:
- `/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/components/EditPanel/ImageFieldEditor.tsx`
- `/Users/bencrowe/Development/APR-Dashboard-v3/src/components/ui/badge.tsx`
- `/Users/bencrowe/Development/APR-Dashboard-v3/src/components/dashboard/job-details/section4/MultiDocumentUpload.tsx`

---

**Ready to use!** Copy-paste these patterns into your component library. Adjust imports and styling as needed for your project.
