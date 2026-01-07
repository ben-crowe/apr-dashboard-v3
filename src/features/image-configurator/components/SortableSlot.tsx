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
    <div className={`flex flex-col gap-1 min-w-0 min-h-0 ${className}`}>
      {/* Image slot */}
      <div
        ref={setNodeRef}
        className={`
          relative aspect-square overflow-hidden transition-all duration-150 group rounded-lg
          ${isHighlighted ? 'border-2 border-green-500 bg-green-50 scale-[1.02]' : ''}
          ${!image && !isHighlighted ? 'border-2 border-dashed border-slate-300 bg-slate-50/50' : ''}
          ${image ? 'border border-slate-200 bg-white shadow-sm' : ''}
        `}
        style={{ width: '100%', height: 'auto' }}
      >
        {image ? (
          // Filled slot
          <>
            <img
              src={imageUrl!}
              alt={image.original_filename}
              className="w-full h-full object-contain"
            />

            {/* Action buttons - top right, visible on hover */}
            <div className="absolute top-1 right-1 flex gap-1 opacity-0 hover:opacity-100 transition-opacity group-hover:opacity-100">
              {onEditImage && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditImage();
                  }}
                  className="p-1 rounded bg-slate-700/80 hover:bg-slate-600 transition-colors"
                  title="Edit image"
                >
                  <Edit3 className="w-3 h-3 text-white" />
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
                  <X className="w-3 h-3 text-white" />
                </button>
              )}
            </div>

          </>
        ) : (
          // Empty slot - modern drag-drop style
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className={`p-3 rounded-full mb-2 ${isHighlighted ? 'bg-green-100' : 'bg-slate-100'}`}>
              <ImagePlus className={`w-6 h-6 ${isHighlighted ? 'text-green-500' : 'text-slate-400'}`} />
            </div>
            <span className={`text-[11px] font-medium ${isHighlighted ? 'text-green-600' : 'text-slate-400'}`}>
              {isHighlighted ? 'Drop image here' : 'Drag image here'}
            </span>
          </div>
        )}

        {/* Position badge */}
        <div className="absolute top-1.5 left-1.5 bg-white/90 text-slate-400 text-[10px] px-1.5 py-0.5 rounded-md font-medium shadow-sm">
          {slot.slot_position}
        </div>
      </div>

      {/* Caption - editable text under image */}
      <div className="relative">
        {image && isEditingCaption ? (
          <input
            ref={captionInputRef}
            type="text"
            value={captionValue}
            onChange={(e) => handleCaptionChange(e.target.value)}
            onBlur={handleCaptionBlur}
            onKeyDown={handleCaptionKeyDown}
            className="w-full text-[11px] text-slate-700 bg-white border border-slate-300 rounded px-1 py-0.5 outline-none focus:border-green-500"
            placeholder={defaultCaption || "Add caption..."}
          />
        ) : image ? (
          <div
            onClick={() => setIsEditingCaption(true)}
            className="w-full text-[11px] text-slate-600 cursor-text px-1 py-0.5 rounded hover:bg-slate-100 transition-colors truncate"
            title="Click to edit caption"
          >
            {currentCaption || defaultCaption || 'Add caption...'}
          </div>
        ) : (
          <div className="w-full text-[11px] text-slate-400 px-1 py-0.5">
            {defaultCaption || 'Caption'}
          </div>
        )}
      </div>
    </div>
  );
}

export default SortableSlot;
