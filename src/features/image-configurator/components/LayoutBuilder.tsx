/**
 * LayoutBuilder Component
 * Main layout editor for drag-drop image placement
 * Displays page layouts with droppable slots
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  Wand2,
  Layers,
  Grid3X3,
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
import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';

// Mapping of image layout page_type to report template page numbers
// Based on Report-MF-template.html structure where photos start at page 3
const PAGE_TYPE_TO_REPORT_PAGE: Record<string, number> = {
  'subject-photos-1': 3,
  'subject-photos-2': 4,
  'subject-photos-3': 5,
  'location-map': 6,
  'aerial-map': 7,
  'zoning-map': 8,
  'flood-map': 9,
  'site-plan': 10,
  'floor-plan': 11,
  'building-systems-1': 12,
  'building-systems-2': 13,
  'comp-location-map': 14,
  'comp-photos-1': 15,
  'comp-photos-2': 16,
  'rental-comp-map': 17,
  'rental-comp-photos': 18,
  'site-improvements': 19,
  'parking-photos': 20,
};

interface LayoutBuilderProps {
  jobId: string;
  images: JobImage[];
  onOpenEditor?: (imageId: string) => void;
  currentPageIndex: number;
  onPageChange: (index: number) => void;
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
  currentPageIndex,
  onPageChange,
  className = '',
}: LayoutBuilderProps) {
  const { data, isLoading, error } = useLayouts(jobId);
  const clearSlot = useClearSlot();
  const updateCaption = useUpdateSlotCaption();
  const updateTitle = useUpdateLayoutTitle();
  const autoFill = useAutoFillLayout();

  // Report builder store for syncing page scroll
  const setScrollToReportPage = useReportBuilderStore((state) => state.setScrollToReportPage);

  // Title editing state
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState('');

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

  // Sync report preview to current image layout page
  useEffect(() => {
    if (currentLayout?.page_type) {
      const reportPageNum = PAGE_TYPE_TO_REPORT_PAGE[currentLayout.page_type];
      if (reportPageNum) {
        setScrollToReportPage(reportPageNum);
      }
    }
  }, [currentLayout?.page_type, setScrollToReportPage]);


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
    <div className={`${className}`} style={{
      backgroundColor: '#fafafa',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden'
    }}>
      <style>{`
        .editor-panel-content input.page-title-input {
          background-color: transparent !important;
          background: transparent !important;
          border: none !important;
          border-bottom: none !important;
          outline: none !important;
          box-shadow: none !important;
          color: #475569 !important;
          padding: 0 !important;
          border-radius: 0 !important;
          font-style: normal !important;
        }
        .editor-panel-content input.page-title-input:focus {
          background-color: transparent !important;
          background: transparent !important;
          border: none !important;
          border-bottom: none !important;
          outline: none !important;
          box-shadow: none !important;
          color: #475569 !important;
          padding: 0 !important;
          border-radius: 0 !important;
          font-style: normal !important;
        }
      `}</style>
      {/* Top header - simplified, navigation handled by parent */}
      <div className="flex items-center justify-between px-4 py-1 border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', height: '32px', minHeight: '32px' }}>
        {/* Left: Category filter and layout info */}
        <div className="flex items-center gap-2">
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

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
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

      {/* Page viewing area - takes remaining space minus tabs */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        backgroundColor: '#f5f5f5',
        overflow: 'hidden',
        minHeight: 0
      }}>
        {/* Page wrapper - fixed letter proportions with min size */}
        <div
          className="flex flex-col"
          style={{
            backgroundColor: '#ffffff',
            aspectRatio: '8.5 / 11',
            height: '100%',
            maxWidth: '100%',
            minWidth: '400px',
            minHeight: '518px', // 400 * (11/8.5) to maintain ratio
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Page title section */}
          {currentLayout && (
            <div className="px-6 pt-4 pb-2">
              {editingTitle ? (
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
                  onBlur={handleSaveTitle}
                  className="page-title-input text-base font-semibold text-slate-600 pb-1"
                  style={{
                    width: 'auto',
                    minWidth: '200px',
                    padding: 0,
                    borderRadius: 0,
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                  }}
                  autoFocus
                />
              ) : (
                <div
                  onClick={() => setEditingTitle(true)}
                  className="text-base font-semibold text-slate-600 border-b border-slate-200 pb-0.5 inline-block cursor-text hover:bg-slate-50 hover:border-slate-400 rounded px-1 -mx-1 transition-all"
                  title="Click to edit"
                >
                  {currentLayout.title || currentLayout.page_type}
                </div>
              )}
            </div>
          )}

          {/* Image grid */}
          <div className="flex-1 px-4 pb-2 flex items-center justify-center overflow-hidden min-w-0 min-h-0">
            <div
              className="grid w-full h-full gap-3"
              style={{
                gridTemplateColumns: `repeat(${gridConfig.cols}, minmax(0, 1fr))`,
                gridAutoRows: `minmax(0, 1fr)`,
                width: '100%',
                height: '100%',
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
          <div
            className="flex items-center px-6 py-2"
            style={{
              borderTop: '1px solid #e5e7eb',
              flexShrink: 0
            }}
          >
            <span className="text-[10px] text-slate-400 italic">
              Page {currentPageIndex + 1}
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}

export default LayoutBuilder;
