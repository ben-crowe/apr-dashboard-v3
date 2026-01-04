/**
 * SortableSlot Component
 * Droppable slot for image placement in layout builder
 * Supports drag-in from gallery and slot-to-slot swapping
 */

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { X, ImagePlus, Edit3 } from 'lucide-react';
import type { PageLayoutSlot, JobImage } from '../types';

interface SortableSlotProps {
  slot: PageLayoutSlot;
  image?: JobImage | null;
  isOver?: boolean;
  onClear?: () => void;
  onEditCaption?: () => void;
  onEditImage?: () => void;
  className?: string;
}

export function SortableSlot({
  slot,
  image,
  isOver: isOverProp,
  onClear,
  onEditCaption,
  onEditImage,
  className = '',
}: SortableSlotProps) {
  const { setNodeRef, isOver: isOverDrop } = useDroppable({
    id: `slot-${slot.id}`,
    data: { type: 'slot', slotId: slot.id, layoutId: slot.layout_id },
  });

  const isHighlighted = isOverProp ?? isOverDrop;

  // Build image URL if we have an image
  const imageUrl = image
    ? getSupabasePublicUrl(image.thumbnail_path || image.storage_path, { width: 400 })
    : null;

  return (
    <div
      ref={setNodeRef}
      className={`
        relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all duration-150
        ${isHighlighted ? 'border-blue-500 bg-blue-500/20 scale-[1.02]' : 'border-slate-600'}
        ${!image ? 'bg-slate-800/50' : ''}
        ${className}
      `}
    >
      {image ? (
        // Filled slot
        <>
          <img
            src={imageUrl!}
            alt={image.original_filename}
            className="w-full h-full object-cover"
          />

          {/* Hover overlay with actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col">
            {/* Top actions */}
            <div className="flex justify-end p-1.5 gap-1">
              {onEditImage && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditImage();
                  }}
                  className="p-1 rounded bg-white/20 hover:bg-white/30 transition-colors"
                  title="Edit image"
                >
                  <Edit3 className="w-3.5 h-3.5 text-white" />
                </button>
              )}
              {onClear && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear();
                  }}
                  className="p-1 rounded bg-red-500/80 hover:bg-red-500 transition-colors"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              )}
            </div>

            {/* Center slot info */}
            <div className="flex-1 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {slot.slot_label || `Slot ${slot.slot_position}`}
              </span>
            </div>

            {/* Bottom caption */}
            <div
              className="p-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onEditCaption?.();
              }}
            >
              <p className="text-xs text-white/80 truncate">
                {slot.caption || image.caption || 'Click to add caption...'}
              </p>
            </div>
          </div>

          {/* Caption display (always visible) */}
          {(slot.caption || image.caption) && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <p className="text-xs text-white truncate">
                {slot.caption || image.caption}
              </p>
            </div>
          )}
        </>
      ) : (
        // Empty slot
        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
          <ImagePlus className={`w-8 h-8 mb-1 ${isHighlighted ? 'text-blue-400' : ''}`} />
          <span className={`text-xs ${isHighlighted ? 'text-blue-400' : ''}`}>
            {slot.slot_label || `Slot ${slot.slot_position}`}
          </span>
          {isHighlighted && (
            <span className="text-xs text-blue-400 mt-1">Drop here</span>
          )}
        </div>
      )}

      {/* Position badge */}
      <div className="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
        {slot.slot_position}
      </div>
    </div>
  );
}

// Helper to build Supabase public URL with transformations
function getSupabasePublicUrl(
  path: string,
  options?: { width?: number; height?: number; quality?: number }
): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const bucket = path.includes('processed') ? 'appraisal-processed' : 'appraisal-raw';

  let url = `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;

  if (options) {
    const params = new URLSearchParams();
    if (options.width) params.set('width', String(options.width));
    if (options.height) params.set('height', String(options.height));
    if (options.quality) params.set('quality', String(options.quality));

    if (params.toString()) {
      url += `?${params.toString()}`;
    }
  }

  return url;
}

export default SortableSlot;
