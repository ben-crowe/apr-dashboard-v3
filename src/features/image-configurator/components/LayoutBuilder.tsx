/**
 * LayoutBuilder Component
 * Main layout editor for drag-drop image placement
 * Displays page layouts with droppable slots
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Wand2,
  Layers,
  Grid3X3,
  Edit2,
  Check,
} from 'lucide-react';
import { SortableSlot } from './SortableSlot';
import {
  useLayouts,
  useClearSlot,
  useAutoFillLayout,
  useUpdateSlotCaption,
  useUpdateLayoutTitle,
  getSlotsForLayout,
} from '../hooks/useLayouts';
import type { PageLayoutSlot, JobImage, LayoutTemplate } from '../types';

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

// Predefined captions by category
const DEFAULT_CAPTIONS: Record<string, string[]> = {
  'Exterior': ['Front Exterior', 'Rear Exterior', 'Left Side', 'Right Side', 'Street View', 'Close-up'],
  'Interior Units': ['Typical Kitchen', 'Typical Bathroom', 'Typical Bedroom 1', 'Typical Bedroom 2', 'Living Room', 'Hallway'],
  'Common Areas': ['Lobby', 'Corridor', 'Amenity Space', 'Laundry Room'],
  'Building Systems': ['HVAC', 'Electrical Panel', 'Plumbing', 'Water Heater', 'Roof', 'Elevator'],
  'Site': ['Parking', 'Landscaping', 'Entrance', 'Signage'],
};

export function LayoutBuilder({
  jobId,
  images,
  onOpenEditor,
  className = '',
}: LayoutBuilderProps) {
  const { data, isLoading, error } = useLayouts(jobId);
  const clearSlot = useClearSlot();
  const updateCaption = useUpdateSlotCaption();
  const updateTitle = useUpdateLayoutTitle();
  const autoFill = useAutoFillLayout();

  // Current page index
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Title editing state
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState('');

  // Zoom level state (0 = zoomed in, 1 = default/fit page, 2 = max zoom out)
  const [zoomLevel, setZoomLevel] = useState(1);

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

  // Initialize title value when layout changes
  useEffect(() => {
    if (currentLayout) {
      setTitleValue(currentLayout.title || currentLayout.page_type);
    }
  }, [currentLayout?.id, currentLayout?.title]);

  // Navigation handlers
  const goToPrevPage = useCallback(() => {
    setCurrentPageIndex((prev) => Math.max(0, prev - 1));
    setEditingTitle(false);
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPageIndex((prev) => Math.min(layouts.length - 1, prev + 1));
    setEditingTitle(false);
  }, [layouts.length]);

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

  // Handle caption update
  const handleUpdateCaption = useCallback(
    async (slotId: string, caption: string) => {
      await updateCaption.mutateAsync({ slotId, caption });
    },
    [updateCaption]
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

  // Handle title save
  const handleSaveTitle = useCallback(async () => {
    if (!currentLayout || titleValue === currentLayout.title) {
      setEditingTitle(false);
      return;
    }

    await updateTitle.mutateAsync({
      layoutId: currentLayout.id,
      title: titleValue,
    });

    setEditingTitle(false);
  }, [currentLayout, titleValue, updateTitle]);

  // Get default caption for a slot based on page category
  const getDefaultCaption = useCallback((slotPosition: number, categoryFilter?: string): string => {
    if (!categoryFilter) return '';
    const captions = DEFAULT_CAPTIONS[categoryFilter] || [];
    return captions[slotPosition - 1] || '';
  }, []);

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

  // Note: layouts auto-create from template on first load, so this should rarely show
  if (layouts.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center h-64 text-slate-400 ${className}`}>
        <Layers className="w-12 h-12 mb-3 opacity-50 animate-pulse" />
        <p>Setting up report pages...</p>
      </div>
    );
  }

  const gridConfig = currentLayout
    ? GRID_CONFIGS[currentLayout.layout_template] || GRID_CONFIGS['2x2']
    : GRID_CONFIGS['2x2'];

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Header with page navigation and title */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        {/* Left: Page nav with editable title */}
        <div className="flex items-center gap-3">
          <button
            onClick={goToPrevPage}
            disabled={currentPageIndex === 0}
            className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Editable page title */}
          {currentLayout && (
            <>
              {editingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={titleValue}
                    onChange={(e) => setTitleValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTitle();
                      if (e.key === 'Escape') {
                        setTitleValue(currentLayout.title || currentLayout.page_type);
                        setEditingTitle(false);
                      }
                    }}
                    className="px-2 py-1 bg-slate-700 border-2 border-green-500 rounded text-sm text-white focus:outline-none font-medium min-w-[200px]"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveTitle}
                    className="p-1 rounded bg-green-600 hover:bg-green-700 text-white"
                    title="Save title"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingTitle(true)}
                  className="flex items-center gap-2 group hover:bg-slate-700 px-2 py-1.5 rounded transition-colors"
                  title="Click to edit page title"
                >
                  <span className="text-sm font-medium text-white">
                    {currentLayout.title || currentLayout.page_type}
                  </span>
                  <Edit2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-300 transition-colors" />
                </button>
              )}
            </>
          )}

          <button
            onClick={goToNextPage}
            disabled={currentPageIndex === layouts.length - 1}
            className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Page metadata */}
        {currentLayout && (
          <div className="flex items-center gap-3">
            {currentLayout.category_filter && (
              <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300">
                {currentLayout.category_filter}
              </span>
            )}
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Grid3X3 className="w-3 h-3" />
              {currentLayout.layout_template}
            </span>
            <span className="text-xs text-slate-400">
              {currentPageIndex + 1} / {layouts.length}
            </span>
            {/* Zoom toggle */}
            <div className="flex items-center gap-0.5 ml-1 border-l border-slate-600 pl-2">
              <button
                onClick={() => setZoomLevel(Math.max(0, zoomLevel - 1))}
                disabled={zoomLevel === 0}
                className="p-0.5 rounded hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                title="Zoom in (larger)"
              >
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 rotate-180" />
              </button>
              <button
                onClick={() => setZoomLevel(Math.min(2, zoomLevel + 1))}
                disabled={zoomLevel === 2}
                className="p-0.5 rounded hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                title="Zoom out (smaller)"
              >
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoFill}
            disabled={autoFill.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-green-600 hover:bg-green-500 rounded transition-colors disabled:opacity-50"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Auto-Fill
          </button>
        </div>
      </div>

      {/* Layout grid */}
      <div className="flex-1 p-4 bg-slate-900 overflow-auto">
        <div
          className="grid mx-auto"
          style={{
            gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
            gap: zoomLevel === 0 ? '12px' : zoomLevel === 1 ? '8px' : '6px',
            maxWidth: zoomLevel === 0 ? '1024px' : zoomLevel === 1 ? '800px' : '600px',
          }}
        >
          {currentSlots.map((slot) => {
            const image = slot.image_id ? imageMap.get(slot.image_id) : null;
            const defaultCaption = getDefaultCaption(
              slot.slot_position,
              currentLayout?.category_filter
            );

            return (
              <SortableSlot
                key={slot.id}
                slot={slot}
                image={image}
                defaultCaption={defaultCaption}
                onClear={() => handleClearSlot(slot)}
                onUpdateCaption={(caption) => handleUpdateCaption(slot.id, caption)}
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
                ${isActive ? 'bg-green-600' : 'bg-slate-700 hover:bg-slate-600'}
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
  );
}

export default LayoutBuilder;
