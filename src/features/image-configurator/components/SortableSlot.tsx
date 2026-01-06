/**
 * SortableSlot Component
 * Droppable slot for image placement in layout builder
 * Supports drag-in from gallery and slot-to-slot swapping
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { X, ImagePlus, Edit3 } from 'lucide-react';
import type { PageLayoutSlot, JobImage } from '../types';
import { useSignedImageUrl } from '@/utils/supabaseStorage';

interface SortableSlotProps {
  slot: PageLayoutSlot;
  image?: JobImage | null;
  defaultCaption?: string;
  isOver?: boolean;
  onClear?: () => void;
  onUpdateCaption?: (caption: string) => void;
  onEditImage?: () => void;
  className?: string;
}

export function SortableSlot({
  slot,
  image,
  defaultCaption = '',
  isOver: isOverProp,
  onClear,
  onUpdateCaption,
  onEditImage,
  className = '',
}: SortableSlotProps) {
  const { setNodeRef, isOver: isOverDrop } = useDroppable({
    id: `slot-${slot.id}`,
    data: { type: 'slot', slotId: slot.id, layoutId: slot.layout_id },
  });

  const isHighlighted = isOverProp ?? isOverDrop;

  // Caption editing state
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [captionValue, setCaptionValue] = useState('');
  const captionInputRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Get signed URL for image (private bucket requires signed URLs)
  const imagePath = image ? (image.thumbnail_path || image.storage_path) : null;
  const imageUrl = useSignedImageUrl(imagePath, { width: 400 });

  // Current caption value (slot caption overrides image caption, with default fallback)
  const currentCaption = slot.caption || image?.caption || defaultCaption;

  // Initialize caption value when slot or image changes
  useEffect(() => {
    setCaptionValue(currentCaption);
  }, [currentCaption]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingCaption && captionInputRef.current) {
      captionInputRef.current.focus();
      captionInputRef.current.select();
    }
  }, [isEditingCaption]);

  // Handle caption save with debounce
  const handleCaptionChange = useCallback((newCaption: string) => {
    setCaptionValue(newCaption);

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce save by 500ms
    saveTimeoutRef.current = setTimeout(() => {
      if (onUpdateCaption) {
        onUpdateCaption(newCaption);
      }
    }, 500);
  }, [onUpdateCaption]);

  // Save immediately when input loses focus
  const handleCaptionBlur = useCallback(() => {
    // Clear debounce timer
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Save immediately
    if (onUpdateCaption && captionValue !== currentCaption) {
      onUpdateCaption(captionValue);
    }

    setIsEditingCaption(false);
  }, [captionValue, currentCaption, onUpdateCaption]);

  // Handle Enter/Escape keys
  const handleCaptionKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur(); // Triggers handleCaptionBlur
    } else if (e.key === 'Escape') {
      setCaptionValue(currentCaption); // Revert
      setIsEditingCaption(false);
    }
  }, [currentCaption]);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {/* Image slot */}
      <div
        ref={setNodeRef}
        className={`
          relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all duration-150
          ${isHighlighted ? 'border-blue-500 bg-blue-500/20 scale-[1.02]' : 'border-slate-600'}
          ${!image ? 'bg-slate-800/50' : ''}
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
            </div>

            {/* Caption overlay (always visible when caption exists and not editing) */}
            {currentCaption && !isEditingCaption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="text-xs text-white truncate">
                  {currentCaption}
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

      {/* Caption placeholder (always visible) */}
      <div className="relative">
        {image && isEditingCaption ? (
          <input
            ref={captionInputRef}
            type="text"
            value={captionValue}
            onChange={(e) => handleCaptionChange(e.target.value)}
            onBlur={handleCaptionBlur}
            onKeyDown={handleCaptionKeyDown}
            className="w-full px-2 py-1 text-xs bg-slate-800 border border-slate-600 rounded text-slate-200 focus:outline-none focus:border-blue-500"
            placeholder={defaultCaption || "Add caption..."}
          />
        ) : (
          <div
            onClick={image ? () => setIsEditingCaption(true) : undefined}
            className={`w-full px-2 py-1 text-xs text-left border rounded transition-colors ${
              image
                ? 'bg-slate-800/50 hover:bg-slate-800 border-slate-700 hover:border-slate-600 text-slate-300 cursor-pointer'
                : 'bg-slate-900/30 border-slate-700/50 text-slate-500 italic'
            }`}
            title={image ? "Click to edit caption" : "Suggested caption for this slot"}
          >
            {currentCaption || defaultCaption || 'Caption...'}
          </div>
        )}
      </div>
    </div>
  );
}

export default SortableSlot;
