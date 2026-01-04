/**
 * ImageGrid Component
 * Displays job images in a filterable, selectable grid
 * Supports drag-to-slot functionality via dnd-kit
 */

import React, { useCallback, useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Sun,
  SunDim,
  Droplets,
  GripVertical,
  Edit3,
  MapPin
} from 'lucide-react';
import { JobImage, ImageFilters, ImageCategory } from '../types';
import { useJobImages, getEffectiveCategory, getQualityColor, needsReview } from '../hooks/useJobImages';
import { useSignedImageUrl } from '@/utils/supabaseStorage';

interface ImageGridProps {
  jobId: string;
  filters: ImageFilters;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectMultiple?: (ids: string[]) => void;
  onOpenEditor?: (id: string) => void;
  onOpenPreview?: (id: string) => void;
  className?: string;
}

export function ImageGrid({
  jobId,
  filters,
  selectedIds,
  onToggleSelect,
  onSelectMultiple,
  onOpenEditor,
  onOpenPreview,
  className = '',
}: ImageGridProps) {
  const { data: images, isLoading, error } = useJobImages(jobId, filters);

  // Create a lookup for faster selection checks
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  // Handle shift-click for range selection
  const lastClickedRef = React.useRef<number | null>(null);

  const handleClick = useCallback(
    (index: number, e: React.MouseEvent) => {
      if (e.shiftKey && lastClickedRef.current !== null && onSelectMultiple && images) {
        // Range select
        const start = Math.min(lastClickedRef.current, index);
        const end = Math.max(lastClickedRef.current, index);
        const rangeIds = images.slice(start, end + 1).map((img) => img.id);
        onSelectMultiple(rangeIds);
      } else {
        // Single select
        onToggleSelect(images![index].id);
        lastClickedRef.current = index;
      }
    },
    [images, onToggleSelect, onSelectMultiple]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        Loading images...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        Error loading images: {error.message}
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Eye className="w-12 h-12 mb-3 opacity-50" />
        <p>No images found</p>
        <p className="text-sm text-slate-500">Upload photos or adjust filters</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-4 gap-2 ${className}`}>
      {images.map((image, index) => (
        <DraggableImageTile
          key={image.id}
          image={image}
          isSelected={selectedSet.has(image.id)}
          onClick={(e) => handleClick(index, e)}
          onEdit={() => onOpenEditor?.(image.id)}
          onPreview={() => onOpenPreview?.(image.id)}
        />
      ))}
    </div>
  );
}

// Draggable image tile component
interface DraggableImageTileProps {
  image: JobImage;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onEdit?: () => void;
  onPreview?: () => void;
}

function DraggableImageTile({
  image,
  isSelected,
  onClick,
  onEdit,
  onPreview,
}: DraggableImageTileProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: image.id,
    data: { type: 'image', imageId: image.id },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  // Get display data
  const category = getEffectiveCategory(image);
  const qualityColor = getQualityColor(image.quality_score);
  const showReviewBadge = needsReview(image);
  const isPlaced = !!image.page_assignment;

  // Get signed URL for thumbnail (private bucket requires signed URLs)
  const thumbnailPath = image.thumbnail_path || image.storage_path;
  const thumbnailUrl = useSignedImageUrl(thumbnailPath, { width: 300 }) || '/placeholder-image.jpg';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative group rounded-lg overflow-hidden cursor-pointer
        border-2 transition-all duration-150
        ${isSelected ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-transparent'}
        ${isDragging ? 'shadow-xl scale-105' : 'hover:border-slate-600'}
        ${isPlaced ? 'opacity-60' : ''}
      `}
      onClick={onClick}
    >
      {/* Drag handle */}
      <div
        {...listeners}
        {...attributes}
        className="absolute top-1 left-1 z-10 p-1 rounded bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-3 h-3 text-white" />
      </div>

      {/* Image */}
      <div className="aspect-[4/3] bg-slate-800">
        <img
          src={thumbnailUrl}
          alt={image.original_filename}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Overlay badges */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left: Category */}
        {category && (
          <div className="absolute top-1 left-8 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
            {category}
          </div>
        )}

        {/* Top-right: Quality indicator */}
        <div className="absolute top-1 right-1 flex items-center gap-1">
          {/* Quality score */}
          <div
            className={`
              text-[10px] px-1.5 py-0.5 rounded font-medium
              ${qualityColor === 'green' ? 'bg-green-500/80 text-white' : ''}
              ${qualityColor === 'yellow' ? 'bg-yellow-500/80 text-black' : ''}
              ${qualityColor === 'red' ? 'bg-red-500/80 text-white' : ''}
            `}
          >
            {Math.round((image.quality_score ?? 0) * 100)}%
          </div>

          {/* Needs review badge */}
          {showReviewBadge && (
            <div className="bg-orange-500/80 text-white text-[10px] px-1 py-0.5 rounded">
              <AlertTriangle className="w-3 h-3" />
            </div>
          )}
        </div>

        {/* Bottom-left: Issue indicators */}
        <div className="absolute bottom-1 left-1 flex items-center gap-1">
          {image.is_blurry && (
            <div className="bg-red-500/80 text-white p-0.5 rounded" title="Blurry">
              <EyeOff className="w-3 h-3" />
            </div>
          )}
          {image.is_overexposed && (
            <div className="bg-yellow-500/80 text-black p-0.5 rounded" title="Overexposed">
              <Sun className="w-3 h-3" />
            </div>
          )}
          {image.is_underexposed && (
            <div className="bg-blue-500/80 text-white p-0.5 rounded" title="Underexposed">
              <SunDim className="w-3 h-3" />
            </div>
          )}
          {image.gps_lat && image.gps_lng && (
            <div className="bg-green-500/80 text-white p-0.5 rounded" title="Has GPS">
              <MapPin className="w-3 h-3" />
            </div>
          )}
        </div>

        {/* Bottom-right: Placed indicator */}
        {isPlaced && (
          <div className="absolute bottom-1 right-1 bg-green-500/80 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Placed
          </div>
        )}

        {/* Selection checkmark */}
        {isSelected && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Hover actions */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
        {onPreview && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors pointer-events-auto"
            title="Preview"
          >
            <Eye className="w-4 h-4 text-white" />
          </button>
        )}
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors pointer-events-auto"
            title="Edit"
          >
            <Edit3 className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* File name tooltip on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-[10px] text-white truncate">
          {image.original_filename}
        </p>
      </div>
    </div>
  );
}


export default ImageGrid;
