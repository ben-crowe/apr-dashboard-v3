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

// Letter size in inches: 8.5" x 11"
// Assuming 96 DPI (standard screen)
const LETTER_WIDTH_PX = 8.5 * 96;
const LETTER_HEIGHT_PX = 11 * 96;
const LETTER_ASPECT_RATIO = LETTER_WIDTH_PX / LETTER_HEIGHT_PX;

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
    <div className={`flex flex-col h-full ${className}`} style={{ backgroundColor: '#fafafa' }}>
      {/* Top header - Compact with page nav and controls */}
      <div className="flex items-center justify-between px-4 py-1 border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
        {/* Left: Page navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPageIndex === 0}
            className="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>

          <button
            onClick={goToNextPage}
            disabled={currentPageIndex === layouts.length - 1}
            className="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            title="Next page"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>

          {/* Divider */}
          <div style={{ borderLeft: '1px solid #e5e7eb', height: '20px', margin: '0 4px' }} />

          {/* Category filter badge */}
          {currentLayout && currentLayout.category_filter && (
            <span className="text-xs px-2 py-0.5 rounded font-medium text-slate-600" style={{ backgroundColor: '#f3f4f6' }}>
              {currentLayout.category_filter}
            </span>
          )}

          {/* Layout template display */}
          {currentLayout && (
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Grid3X3 className="w-3 h-3" />
              {currentLayout.layout_template}
            </span>
          )}
        </div>

        {/* Center: Page counter */}
        {currentLayout && (
          <div className="text-xs font-medium text-slate-600">
            {currentPageIndex + 1} / {layouts.length}
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-0.5" style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: '8px' }}>
            <button
              onClick={() => setZoomLevel(Math.max(0, zoomLevel - 1))}
              disabled={zoomLevel === 0}
              className="p-0.5 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Zoom in"
            >
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 rotate-180" />
            </button>
            <button
              onClick={() => setZoomLevel(Math.min(2, zoomLevel + 1))}
              disabled={zoomLevel === 2}
              className="p-0.5 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Zoom out"
            >
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          {/* Auto-fill button */}
          <button
            onClick={handleAutoFill}
            disabled={autoFill.isPending}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded transition-colors disabled:opacity-50 text-white"
            style={{ backgroundColor: '#10b981' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
          >
            <Wand2 className="w-3.5 h-3.5" />
            Auto-Fill
          </button>
        </div>
      </div>

      {/* White letter-size page container */}
      <div className="flex-1 p-4 overflow-auto flex items-center justify-center" style={{ backgroundColor: '#fafafa' }}>
        {/* Page wrapper - maintains letter aspect ratio */}
        <div
          className="flex flex-col rounded-lg shadow-md overflow-hidden"
          style={{
            backgroundColor: '#ffffff',
            width: '100%',
            maxWidth: `${LETTER_WIDTH_PX}px`,
            aspectRatio: `${LETTER_ASPECT_RATIO}`,
          }}
        >
          {/* Page title section */}
          {currentLayout && (
            <div className="px-6 pt-6 pb-4">
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
                    className="px-2 py-1 border-2 border-green-500 rounded text-sm text-slate-900 focus:outline-none font-semibold min-w-[200px]"
                    style={{ backgroundColor: '#f9fafb' }}
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
                  className="flex items-center gap-2 group px-2 py-1 rounded transition-colors"
                  style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="Click to edit page title"
                >
                  <span className="text-base font-bold text-slate-900">
                    {currentLayout.title || currentLayout.page_type}
                  </span>
                  <Edit2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors opacity-0 group-hover:opacity-100" />
                </button>
              )}
            </div>
          )}

          {/* Image grid */}
          <div className="flex-1 px-6 pb-4 flex items-center justify-center">
            <div
              className="grid w-full h-full gap-3"
              style={{
                gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
                gridAutoRows: `minmax(0, 1fr)`,
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

          {/* Page footer */}
          <div className="px-6 py-3 border-t flex justify-between items-center text-xs text-slate-500" style={{ borderColor: '#e5e7eb' }}>
            <div className="text-slate-600 font-medium">
              {currentLayout?.page_type}
            </div>
            <div className="text-slate-500">
              Page {currentPageIndex + 1} of {layouts.length}
            </div>
          </div>
        </div>
      </div>

      {/* Page tabs at bottom - Thin and scrollable */}
      <div className="flex items-center gap-1 px-3 py-1 border-t overflow-x-auto" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', height: '36px' }}>
        {layouts.map((layout, index) => {
          const slots = getSlotsForLayout(allSlots, layout.id);
          const filledCount = slots.filter((s) => s.image_id).length;
          const isActive = index === currentPageIndex;

          return (
            <button
              key={layout.id}
              onClick={() => setCurrentPageIndex(index)}
              className={`
                flex-shrink-0 flex flex-col items-center px-2 py-0.5 rounded text-xs font-medium transition-all
                whitespace-nowrap
                ${isActive ? 'text-white' : 'text-slate-600 hover:text-slate-900'}
              `}
              style={isActive ? { backgroundColor: '#10b981' } : { backgroundColor: '#f3f4f6' }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#e5e7eb';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }
              }}
            >
              <span>{layout.page_type}</span>
              <span className={`text-[10px] ${isActive ? 'text-green-100' : 'text-slate-500'}`}>
                {filledCount}/{slots.length}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LayoutBuilder;
