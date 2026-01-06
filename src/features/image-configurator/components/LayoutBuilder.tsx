/**
 * LayoutBuilder Component
 * Main layout editor with dnd-kit context for drag-drop image placement
 * Displays page layouts with droppable slots
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  ChevronLeft,
  ChevronRight,
  Wand2,
  RotateCcw,
  Layers,
  Grid3X3,
} from 'lucide-react';
import { SortableSlot } from './SortableSlot';
import {
  useLayouts,
  useAssignImageToSlot,
  useClearSlot,
  useSwapSlotImages,
  useAutoFillLayout,
  useCreateDefaultLayouts,
  getSlotsForLayout,
} from '../hooks/useLayouts';
import type { PageLayout, PageLayoutSlot, JobImage, LayoutTemplate } from '../types';
import { DEFAULT_LAYOUTS } from '../types';
import { getSignedImageUrl } from '@/utils/supabaseStorage';

interface LayoutBuilderProps {
  jobId: string;
  images: JobImage[];
  onOpenEditor?: (imageId: string) => void;
  className?: string;
}

// Grid configurations for each template
const GRID_CONFIGS: Record<LayoutTemplate, { cols: number; rows: number }> = {
  '1x1': { cols: 1, rows: 1 },
  '2x2': { cols: 2, rows: 2 },
  '2x3': { cols: 2, rows: 3 },
  '3x3': { cols: 3, rows: 3 },
  '3x4': { cols: 3, rows: 4 },
  '4x3': { cols: 4, rows: 3 },
  custom: { cols: 2, rows: 2 },
};

export function LayoutBuilder({
  jobId,
  images,
  onOpenEditor,
  className = '',
}: LayoutBuilderProps) {
  const { data, isLoading, error } = useLayouts(jobId);
  const assignImage = useAssignImageToSlot();
  const clearSlot = useClearSlot();
  const swapImages = useSwapSlotImages();
  const autoFill = useAutoFillLayout();
  const createLayouts = useCreateDefaultLayouts();

  // Current page index
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Drag state
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overSlotId, setOverSlotId] = useState<string | null>(null);
  const [dragImageUrl, setDragImageUrl] = useState<string | null>(null);

  // Sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Create image lookup map
  const imageMap = React.useMemo(() => {
    const map = new Map<string, JobImage>();
    images.forEach((img) => map.set(img.id, img));
    return map;
  }, [images]);

  // Get current layout and its slots
  const layouts = data?.layouts || [];
  const allSlots = data?.slots || [];
  const currentLayout = layouts[currentPageIndex];
  const currentSlots = currentLayout
    ? getSlotsForLayout(allSlots, currentLayout.id)
    : [];

  // Navigation handlers
  const goToPrevPage = useCallback(() => {
    setCurrentPageIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPageIndex((prev) => Math.min(layouts.length - 1, prev + 1));
  }, [layouts.length]);

  // Drag handlers
  const handleDragStart = useCallback(async (event: DragStartEvent) => {
    const activeIdStr = String(event.active.id);
    setActiveId(activeIdStr);
    
    // Get signed URL for dragged image
    const draggedImage = imageMap.get(activeIdStr);
    if (draggedImage) {
      const path = draggedImage.thumbnail_path || draggedImage.storage_path;
      if (path) {
        const signedUrl = await getSignedImageUrl(path, { width: 200 });
        setDragImageUrl(signedUrl);
      }
    }
  }, [imageMap]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const overId = event.over?.id;
    if (overId && String(overId).startsWith('slot-')) {
      setOverSlotId(String(overId).replace('slot-', ''));
    } else {
      setOverSlotId(null);
    }
  }, []);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);
      setOverSlotId(null);
      setDragImageUrl(null);

      if (!over) return;

      const overId = String(over.id);

      // Check if dropped on a slot
      if (overId.startsWith('slot-')) {
        const slotId = overId.replace('slot-', '');
        const slot = allSlots.find((s) => s.id === slotId);

        if (!slot) return;

        const activeData = active.data.current;

        // Dragging an image from the gallery
        if (activeData?.type === 'image') {
          const imageId = activeData.imageId;

          // If slot already has an image, we'd normally swap, but for gallery drag
          // we just replace
          if (slot.image_id) {
            // Clear the old image first
            await clearSlot.mutateAsync({
              slotId: slot.id,
              previousImageId: slot.image_id,
            });
          }

          // Assign new image
          await assignImage.mutateAsync({
            slotId: slot.id,
            imageId,
            layoutId: slot.layout_id,
            slotPosition: slot.slot_position,
          });
        }

        // Dragging from another slot (swap)
        if (activeData?.type === 'slot') {
          const sourceSlotId = activeData.slotId;
          const sourceSlot = allSlots.find((s) => s.id === sourceSlotId);

          if (sourceSlot && sourceSlot.id !== slot.id) {
            await swapImages.mutateAsync({
              slot1Id: sourceSlot.id,
              slot2Id: slot.id,
              image1Id: sourceSlot.image_id,
              image2Id: slot.image_id,
            });
          }
        }
      }
    },
    [allSlots, assignImage, clearSlot, swapImages]
  );

  // Handle slot clear
  const handleClearSlot = useCallback(
    async (slot: PageLayoutSlot) => {
      await clearSlot.mutateAsync({
        slotId: slot.id,
        previousImageId: slot.image_id || undefined,
      });
    },
    [clearSlot]
  );

  // Handle auto-fill
  const handleAutoFill = useCallback(async () => {
    if (!currentLayout) return;
    await autoFill.mutateAsync({
      layoutId: currentLayout.id,
      jobId,
      categoryFilter: currentLayout.category_filter || undefined,
    });
  }, [currentLayout, autoFill, jobId]);

  // Get active dragged image
  const activeImage = activeId ? imageMap.get(activeId) : null;

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-64 text-slate-400 ${className}`}>
        Loading layouts...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-64 text-red-400 ${className}`}>
        Error loading layouts: {error.message}
      </div>
    );
  }

  if (layouts.length === 0) {
    const handleCreateDefaults = async () => {
      await createLayouts.mutateAsync({ jobId, defaults: DEFAULT_LAYOUTS });
    };

    return (
      <div className={`flex flex-col items-center justify-center h-64 text-slate-400 ${className}`}>
        <Layers className="w-12 h-12 mb-3 opacity-50" />
        <p className="mb-2">No layouts found</p>
        <p className="text-sm text-slate-500 mb-4">Create default layouts to start placing images</p>
        <button
          onClick={handleCreateDefaults}
          disabled={createLayouts.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <Grid3X3 className="w-4 h-4" />
          {createLayouts.isPending ? 'Creating...' : 'Create Default Layouts'}
        </button>
        <p className="text-xs text-slate-600 mt-3">
          Creates: Exterior (2x2), Interior (3x3), Common (2x3), Systems (2x2), Site (2x2)
        </p>
      </div>
    );
  }

  const gridConfig = currentLayout
    ? GRID_CONFIGS[currentLayout.layout_template] || GRID_CONFIGS['2x2']
    : GRID_CONFIGS['2x2'];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={`flex flex-col ${className}`}>
        {/* Header with page navigation */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
          {/* Page nav */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPageIndex === 0}
              className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-sm text-slate-300">
              Page {currentPageIndex + 1} of {layouts.length}
            </span>

            <button
              onClick={goToNextPage}
              disabled={currentPageIndex === layouts.length - 1}
              className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Page info */}
          {currentLayout && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-white">
                {currentLayout.title || currentLayout.page_type}
              </span>
              {currentLayout.category_filter && (
                <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300">
                  {currentLayout.category_filter}
                </span>
              )}
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Grid3X3 className="w-3 h-3" />
                {currentLayout.layout_template}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoFill}
              disabled={autoFill.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 rounded transition-colors disabled:opacity-50"
            >
              <Wand2 className="w-3.5 h-3.5" />
              Auto-Fill
            </button>
          </div>
        </div>

        {/* Layout grid */}
        <div className="flex-1 p-4 bg-slate-900 overflow-auto">
          <div
            className="grid gap-3 max-w-4xl mx-auto"
            style={{
              gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
            }}
          >
            {currentSlots.map((slot) => {
              const image = slot.image_id ? imageMap.get(slot.image_id) : null;
              return (
                <SortableSlot
                  key={slot.id}
                  slot={slot}
                  image={image}
                  isOver={overSlotId === slot.id}
                  onClear={() => handleClearSlot(slot)}
                  onEditImage={image && onOpenEditor ? () => onOpenEditor(image.id) : undefined}
                />
              );
            })}
          </div>
        </div>

        {/* Page list (thumbnails) */}
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border-t border-slate-700 overflow-x-auto">
          {layouts.map((layout, index) => {
            const slots = getSlotsForLayout(allSlots, layout.id);
            const filledCount = slots.filter((s) => s.image_id).length;
            const isActive = index === currentPageIndex;

            return (
              <button
                key={layout.id}
                onClick={() => setCurrentPageIndex(index)}
                className={`
                  flex-shrink-0 flex flex-col items-center p-2 rounded transition-colors
                  ${isActive ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}
                `}
              >
                <span className="text-xs text-white font-medium">
                  {layout.page_type}
                </span>
                <span className="text-[10px] text-slate-300">
                  {filledCount}/{slots.length} filled
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Drag overlay - shows dragged image */}
      <DragOverlay>
        {activeImage && dragImageUrl && (
          <div className="w-32 h-24 rounded-lg overflow-hidden shadow-2xl border-2 border-blue-500 opacity-80">
            <img
              src={dragImageUrl}
              alt={activeImage.original_filename}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}


export default LayoutBuilder;
