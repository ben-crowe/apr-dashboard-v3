/**
 * ImageConfiguratorDemo Component
 * Main standalone demo page for the Image Page Configurator feature
 * Combines upload, gallery, layout builder, and editor
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { useQueryClient } from '@tanstack/react-query';
import { ImageUploadZone } from './ImageUploadZone';
import { FiltersPanel } from './FiltersPanel';
import { ImageGrid } from './ImageGrid';
import { LayoutBuilder } from './LayoutBuilder';
import { ImageEditorModal } from './ImageEditorModal';
import { useJobImages, jobImagesKeys } from '../hooks/useJobImages';
import { useLayouts, useAssignImageToSlot, useClearSlot, getSlotsForLayout } from '../hooks/useLayouts';
import type { ImageFilters, JobImage, ReportTypeId } from '../types';
import { REPORT_TYPE_TEMPLATES, DEFAULT_REPORT_TYPE } from '../types';
import { useSignedImageUrl } from '@/utils/supabaseStorage';
import { FileText, ChevronDown, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

interface ImageConfiguratorDemoProps {
  jobId: string;
  className?: string;
}

export function ImageConfiguratorDemo({
  jobId,
  className = '',
}: ImageConfiguratorDemoProps) {
  const queryClient = useQueryClient();

  // Filter state
  const [filters, setFilters] = useState<ImageFilters>({});

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Editor modal state
  const [editorImageId, setEditorImageId] = useState<string | null>(null);

  // Active drag state
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  // Report type selector state
  const [selectedReportType, setSelectedReportType] = useState<ReportTypeId>(DEFAULT_REPORT_TYPE);
  const [showReportTypeMenu, setShowReportTypeMenu] = useState(false);
  const currentTemplate = REPORT_TYPE_TEMPLATES[selectedReportType];

  // Page selection state (lifted from LayoutBuilder for header display)
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Resizable split state
  const [splitPercent, setSplitPercent] = useState(42); // Gallery takes 42% by default
  const [isDraggingDivider, setIsDraggingDivider] = useState(false);

  // Expanded gallery overlay state
  const [isGalleryExpanded, setIsGalleryExpanded] = useState(false);
  const [popupSplitPercent, setPopupSplitPercent] = useState(65); // Gallery takes 65% in popup
  const [isDraggingPopupDivider, setIsDraggingPopupDivider] = useState(false);
  const [popupThumbnailSize, setPopupThumbnailSize] = useState(140); // Thumbnail size in px

  // Fetch data
  const { data: images = [], isLoading: imagesLoading } = useJobImages(jobId, filters);
  const { data: layoutData } = useLayouts(jobId);
  const assignImage = useAssignImageToSlot();
  const clearSlot = useClearSlot();

  // Image lookup map
  const imageMap = useMemo(() => {
    const map = new Map<string, JobImage>();
    images.forEach((img) => map.set(img.id, img));
    return map;
  }, [images]);

  // Layouts derived values for header display
  const layouts = layoutData?.layouts || [];
  const allSlots = layoutData?.slots || [];
  const currentLayout = layouts[currentPageIndex];

  // Image being edited
  const editorImage = editorImageId ? imageMap.get(editorImageId) : null;

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  // Toggle single selection
  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  // Multi-select (shift-click range)
  const handleSelectMultiple = useCallback((ids: string[]) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      ids.forEach((id) => newSet.add(id));
      return Array.from(newSet);
    });
  }, []);

  // Bulk actions
  const handleBulkAction = useCallback(
    (action: 'select-all' | 'select-none' | 'select-category') => {
      switch (action) {
        case 'select-all':
          setSelectedIds(images.map((img) => img.id));
          break;
        case 'select-none':
          setSelectedIds([]);
          break;
        case 'select-category':
          // Select all in current filtered category
          setSelectedIds(images.map((img) => img.id));
          break;
      }
    },
    [images]
  );

  // Open editor
  const handleOpenEditor = useCallback((id: string) => {
    setEditorImageId(id);
  }, []);

  // Close editor
  const handleCloseEditor = useCallback(() => {
    setEditorImageId(null);
  }, []);

  // Upload complete handler - invalidate query to show new images
  const handleUploadComplete = useCallback((newIds: string[]) => {
    console.log('Uploaded images:', newIds);
    // Invalidate the images query to refresh the grid
    queryClient.invalidateQueries({ queryKey: jobImagesKeys.lists() });
  }, [queryClient]);

  // DnD handlers for cross-panel drag
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDragId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveDragId(null);

      if (!over) return;

      const overId = String(over.id);

      // Check if dropped on a layout slot
      if (overId.startsWith('slot-')) {
        const slotId = overId.replace('slot-', '');
        const slot = layoutData?.slots.find((s) => s.id === slotId);

        if (!slot) return;

        const activeData = active.data.current;

        if (activeData?.type === 'image') {
          const imageId = activeData.imageId;

          // Clear slot if occupied
          if (slot.image_id) {
            await clearSlot.mutateAsync({
              slotId: slot.id,
              previousImageId: slot.image_id,
            });
          }

          // Assign image
          await assignImage.mutateAsync({
            slotId: slot.id,
            imageId,
            layoutId: slot.layout_id,
            slotPosition: slot.slot_position,
          });
        }
      }
    },
    [layoutData?.slots, assignImage, clearSlot]
  );

  // Get dragged image for overlay
  const draggedImage = activeDragId ? imageMap.get(activeDragId) : null;

  // Resizable divider handlers
  const handleDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingDivider(true);
  }, []);

  const handleDividerMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingDivider) return;

      const container = document.getElementById('image-configurator-split');
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const newPercent = ((e.clientX - rect.left) / rect.width) * 100;

      // Clamp between 20% and 60%
      const clampedPercent = Math.max(20, Math.min(60, newPercent));
      setSplitPercent(clampedPercent);
    },
    [isDraggingDivider]
  );

  const handleDividerMouseUp = useCallback(() => {
    setIsDraggingDivider(false);
  }, []);

  // Add/remove global mouse listeners for divider drag
  React.useEffect(() => {
    if (isDraggingDivider) {
      document.addEventListener('mousemove', handleDividerMouseMove);
      document.addEventListener('mouseup', handleDividerMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleDividerMouseMove);
      document.removeEventListener('mouseup', handleDividerMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleDividerMouseMove);
      document.removeEventListener('mouseup', handleDividerMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDraggingDivider, handleDividerMouseMove, handleDividerMouseUp]);

  // Popup resizable divider handlers
  const handlePopupDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingPopupDivider(true);
  }, []);

  const handlePopupDividerMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingPopupDivider) return;

      const container = document.getElementById('popup-split-container');
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const newPercent = ((e.clientX - rect.left) / rect.width) * 100;

      // Clamp between 40% and 85%
      const clampedPercent = Math.max(40, Math.min(85, newPercent));
      setPopupSplitPercent(clampedPercent);
    },
    [isDraggingPopupDivider]
  );

  const handlePopupDividerMouseUp = useCallback(() => {
    setIsDraggingPopupDivider(false);
  }, []);

  // Add/remove global mouse listeners for popup divider drag
  React.useEffect(() => {
    if (isDraggingPopupDivider) {
      document.addEventListener('mousemove', handlePopupDividerMouseMove);
      document.addEventListener('mouseup', handlePopupDividerMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handlePopupDividerMouseMove);
      document.removeEventListener('mouseup', handlePopupDividerMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handlePopupDividerMouseMove);
      document.removeEventListener('mouseup', handlePopupDividerMouseUp);
    };
  }, [isDraggingPopupDivider, handlePopupDividerMouseMove, handlePopupDividerMouseUp]);

  // ESC key to close expanded gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isGalleryExpanded) {
        setIsGalleryExpanded(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryExpanded]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={`flex flex-col h-full ${className}`} style={{ backgroundColor: '#1f1f1f' }}>
        {/* Top Header - Title, discrete template picker, and prominent page selector */}
        <div className="flex items-center justify-between px-4 py-2 border-b" style={{ backgroundColor: '#1a1a1a', borderColor: '#333' }}>
          {/* Left: Title with discrete template picker */}
          <div className="flex items-center gap-3">
            <h1 className="text-base font-semibold text-white">Image Page Configurator</h1>

            {/* Discrete Template Picker */}
            <div className="relative">
              <button
                onClick={() => setShowReportTypeMenu(!showReportTypeMenu)}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-colors"
                style={{ backgroundColor: '#2a2a2a' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
              >
                <FileText className="w-3 h-3 text-slate-500" />
                <span className="text-slate-400">{currentTemplate.name}</span>
                <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${showReportTypeMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Template Dropdown Menu */}
              {showReportTypeMenu && (
                <div className="absolute left-0 mt-2 w-72 rounded-lg shadow-xl z-50" style={{ backgroundColor: '#1f1f1f', borderColor: '#444', borderWidth: '1px', borderStyle: 'solid' }}>
                  <div className="p-2 border-b" style={{ borderColor: '#333' }}>
                    <div className="text-xs text-slate-400 uppercase tracking-wide px-2">Report Type</div>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2">
                    {Object.values(REPORT_TYPE_TEMPLATES).map((template) => (
                      <button
                        key={template.id}
                        onClick={() => {
                          setSelectedReportType(template.id);
                          setShowReportTypeMenu(false);
                          setCurrentPageIndex(0); // Reset to first page on template change
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedReportType === template.id
                            ? 'bg-green-600 text-white'
                            : 'text-slate-300 hover:text-slate-200'
                        }`}
                        style={selectedReportType !== template.id ? { backgroundColor: '#2a2a2a' } : undefined}
                        onMouseEnter={(e) => {
                          if (selectedReportType !== template.id) {
                            e.currentTarget.style.backgroundColor = '#333';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedReportType !== template.id) {
                            e.currentTarget.style.backgroundColor = '#2a2a2a';
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{template.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            selectedReportType === template.id
                              ? 'bg-green-500 text-white'
                              : 'bg-slate-700 text-slate-300'
                          }`}>
                            {template.pageCount} pages
                          </span>
                        </div>
                        <div className={`text-xs mt-0.5 ${
                          selectedReportType === template.id
                            ? 'text-green-100'
                            : 'text-slate-400'
                        }`}>
                          {template.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Prominent Page Selector with Navigation */}
          <div className="flex items-center gap-2">
            {/* Previous Page */}
            <button
              onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentPageIndex === 0}
              className="p-1.5 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: '#2a2a2a' }}
              onMouseEnter={(e) => { if (currentPageIndex > 0) e.currentTarget.style.backgroundColor = '#333'; }}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4 text-slate-300" />
            </button>

            {/* Page Dropdown - Prominent */}
            {layouts.length > 0 && (
              <select
                value={currentPageIndex}
                onChange={(e) => setCurrentPageIndex(Number(e.target.value))}
                className="text-sm font-medium rounded px-3 py-1.5 cursor-pointer transition-colors min-w-[200px]"
                style={{
                  backgroundColor: '#2a2a2a',
                  color: '#ffffff',
                  borderColor: '#444',
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
              >
                {layouts.map((layout, index) => {
                  const slots = getSlotsForLayout(allSlots, layout.id);
                  const filledCount = slots.filter((s) => s.image_id).length;
                  return (
                    <option key={layout.id} value={index} style={{ backgroundColor: '#1f1f1f' }}>
                      {layout.title || layout.page_type} ({filledCount}/{slots.length})
                    </option>
                  );
                })}
              </select>
            )}

            {/* Next Page */}
            <button
              onClick={() => setCurrentPageIndex((prev) => Math.min(layouts.length - 1, prev + 1))}
              disabled={currentPageIndex === layouts.length - 1 || layouts.length === 0}
              className="p-1.5 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: '#2a2a2a' }}
              onMouseEnter={(e) => { if (currentPageIndex < layouts.length - 1) e.currentTarget.style.backgroundColor = '#333'; }}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
              title="Next page"
            >
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>

        {/* Main content - split view */}
        <div id="image-configurator-split" className="flex-1 flex overflow-hidden relative">
          {/* Left panel - Gallery */}
          <div
            className="flex flex-col border-r"
            style={{ borderColor: '#333', width: `${splitPercent}%`, backgroundColor: '#1f1f1f' }}
          >
            {/* Upload zone - Compact */}
            <div className="px-3 py-3 border-b" style={{ borderColor: '#333' }}>
              <ImageUploadZone
                jobId={jobId}
                onUploadComplete={handleUploadComplete}
                maxFiles={500}
              />
            </div>

            {/* Filters with expand button */}
            <div className="flex items-center justify-between border-b" style={{ borderColor: '#333' }}>
              <FiltersPanel
                filters={filters}
                onChange={setFilters}
                selectedCount={selectedIds.length}
                totalCount={images.length}
                onBulkAction={handleBulkAction}
              />
              {/* Expand gallery button */}
              <button
                onClick={() => setIsGalleryExpanded(true)}
                className="mr-3 p-1.5 rounded transition-colors"
                style={{ backgroundColor: '#2a2a2a' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a3a3a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                title="Expand gallery"
              >
                <Maximize2 className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Image grid with visible scrollbar */}
            <div
              className="flex-1 p-3"
              style={{
                overflowY: 'auto',
                overflowX: 'hidden',
                scrollbarWidth: 'thin',
                scrollbarColor: '#4a4a4a #1f1f1f'
              }}
            >
              <ImageGrid
                jobId={jobId}
                filters={filters}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onSelectMultiple={handleSelectMultiple}
                onOpenEditor={handleOpenEditor}
              />
            </div>
          </div>

          {/* Draggable divider */}
          <div
            onMouseDown={handleDividerMouseDown}
            className={`w-1 hover:bg-green-500 cursor-col-resize transition-colors relative group ${
              isDraggingDivider ? 'bg-green-500' : ''
            }`}
            style={{ backgroundColor: '#333' }}
          >
            {/* Wider hit area for easier grabbing */}
            <div className="absolute inset-y-0 -left-1 -right-1" />
            {/* Visual indicator on hover */}
            <div className="absolute inset-y-0 left-0 right-0 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Right panel - Layout builder */}
          <div className="flex-1 flex flex-col">
            <LayoutBuilder
              jobId={jobId}
              images={images}
              onOpenEditor={handleOpenEditor}
              currentPageIndex={currentPageIndex}
              onPageChange={setCurrentPageIndex}
              className="flex-1"
            />
          </div>
        </div>

        {/* Footer stats */}
        <div className="px-4 py-1.5 border-t flex items-center justify-between text-xs text-slate-400" style={{ borderColor: '#333', backgroundColor: '#1a1a1a' }}>
          <div className="text-slate-400">
            {images.length} images | {selectedIds.length} selected | {layoutData?.layouts.length || 0} pages
          </div>
          <div className="text-slate-500">
            Drag images from gallery to slots, or use Auto-Fill
          </div>
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {draggedImage && <DragOverlayImage image={draggedImage} />}
      </DragOverlay>

      {/* Image editor modal */}
      {editorImage && (
        <ImageEditorModal
          image={editorImage}
          isOpen={!!editorImageId}
          onClose={handleCloseEditor}
        />
      )}

      {/* Expanded gallery overlay */}
      {isGalleryExpanded && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
        >
          {/* Overlay header */}
          <div
            className="flex items-center justify-between px-6 py-3 border-b shrink-0"
            style={{ backgroundColor: '#1a1a1a', borderColor: '#333' }}
          >
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-white">Image Gallery</h2>
              <span className="text-sm text-slate-400">
                {images.length} images | {selectedIds.length} selected
              </span>
            </div>
            <div className="flex items-center gap-3">
              {/* Page navigation in overlay */}
              {layouts.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentPageIndex === 0}
                    className="p-1.5 rounded disabled:opacity-30 transition-colors"
                    style={{ backgroundColor: '#2a2a2a' }}
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-300" />
                  </button>
                  <select
                    value={currentPageIndex}
                    onChange={(e) => setCurrentPageIndex(Number(e.target.value))}
                    className="text-sm font-medium rounded px-2 py-1 min-w-[180px]"
                    style={{ backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #444' }}
                  >
                    {layouts.map((layout, index) => {
                      const slots = getSlotsForLayout(allSlots, layout.id);
                      const filledCount = slots.filter((s) => s.image_id).length;
                      return (
                        <option key={layout.id} value={index}>
                          {layout.title || layout.page_type} ({filledCount}/{slots.length})
                        </option>
                      );
                    })}
                  </select>
                  <button
                    onClick={() => setCurrentPageIndex((prev) => Math.min(layouts.length - 1, prev + 1))}
                    disabled={currentPageIndex === layouts.length - 1}
                    className="p-1.5 rounded disabled:opacity-30 transition-colors"
                    style={{ backgroundColor: '#2a2a2a' }}
                  >
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                </div>
              )}
              <div style={{ width: '1px', height: '24px', backgroundColor: '#444' }} />
              <button
                onClick={() => setIsGalleryExpanded(false)}
                className="p-2 rounded-lg transition-colors"
                style={{ backgroundColor: '#2a2a2a' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a3a3a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                title="Close expanded view"
              >
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>
          </div>

          {/* Main content area - split view */}
          <div id="popup-split-container" className="flex-1 flex overflow-hidden">
            {/* Left: Image gallery */}
            <div className="flex flex-col" style={{ width: `${popupSplitPercent}%` }}>
              {/* Filters row with zoom controls */}
              <div className="flex items-center justify-between px-4 py-2 border-b shrink-0" style={{ backgroundColor: '#1f1f1f', borderColor: '#333' }}>
                <FiltersPanel
                  filters={filters}
                  onChange={setFilters}
                  selectedCount={selectedIds.length}
                  totalCount={images.length}
                  onBulkAction={handleBulkAction}
                />
                {/* Zoom controls */}
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => setPopupThumbnailSize(s => Math.max(80, s - 20))}
                    className="p-1 rounded transition-colors"
                    style={{ backgroundColor: '#2a2a2a' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a3a3a'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                    title="Smaller thumbnails"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-xs text-slate-500 w-8 text-center">{popupThumbnailSize}</span>
                  <button
                    onClick={() => setPopupThumbnailSize(s => Math.min(220, s + 20))}
                    className="p-1 rounded transition-colors"
                    style={{ backgroundColor: '#2a2a2a' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a3a3a'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                    title="Larger thumbnails"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Expanded image grid with scroll */}
              <div
                className="flex-1 p-4 overflow-y-auto overflow-x-hidden"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#4a4a4a #1f1f1f'
                }}
              >
                <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${popupThumbnailSize}px, 1fr))` }}>
                  {images.map((image) => (
                    <ExpandedGalleryItem
                      key={image.id}
                      image={image}
                      isSelected={selectedIds.includes(image.id)}
                      onToggleSelect={() => handleToggleSelect(image.id)}
                      onOpenEditor={() => {
                        setIsGalleryExpanded(false);
                        handleOpenEditor(image.id);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Resizable divider - discrete, no grab handle */}
            <div
              onMouseDown={handlePopupDividerMouseDown}
              className="cursor-col-resize transition-colors hover:bg-green-500"
              style={{
                width: '3px',
                backgroundColor: isDraggingPopupDivider ? '#10b981' : '#333',
                flexShrink: 0
              }}
            />

            {/* Right: Current page preview - EXACT COPY of LayoutBuilder structure */}
            <div
              style={{
                flex: 1,
                backgroundColor: '#fafafa',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden'
              }}
            >
              {/* Header bar - EXACT COPY from LayoutBuilder line 228 */}
              <div
                className="flex items-center justify-between px-4 py-1 border-b"
                style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', height: '32px', minHeight: '32px' }}
              >
                {/* Left: Category filter and layout info */}
                <div className="flex items-center gap-2">
                  {currentLayout?.category_filter && (
                    <span className="text-xs px-2 py-0.5 rounded font-medium text-slate-600" style={{ backgroundColor: '#f3f4f6' }}>
                      {currentLayout.category_filter}
                    </span>
                  )}
                  {currentLayout && (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      {currentLayout.layout_template}
                    </span>
                  )}
                </div>
                {/* Right: filled count */}
                {currentLayout && (
                  <span className="text-xs text-slate-500">
                    {getSlotsForLayout(allSlots, currentLayout.id).filter(s => s.image_id).length}/
                    {getSlotsForLayout(allSlots, currentLayout.id).length} filled
                  </span>
                )}
              </div>

              {/* Page viewing area - consistent size */}
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                padding: '8px',
                backgroundColor: '#f5f5f5',
                overflow: 'hidden',
                minHeight: 0
              }}>
                {currentLayout ? (
                  /* Page wrapper - fixed height, width from aspect ratio */
                  <div
                    className="flex flex-col"
                    style={{
                      backgroundColor: '#ffffff',
                      aspectRatio: '8.5 / 11',
                      height: '100%',
                      maxWidth: '100%',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {/* Page title section - matches LayoutBuilder styling */}
                    <div className="px-6 pt-4 pb-2">
                      <div className="text-base font-semibold text-slate-500 border-b border-slate-300 pb-1 inline-block italic hover:bg-slate-100 rounded px-1 -mx-1 transition-colors">
                        {currentLayout.title || currentLayout.page_type}
                      </div>
                    </div>

                    {/* Image grid - EXACT COPY from LayoutBuilder line 320 */}
                    <div className="flex-1 px-4 pb-2 flex items-center justify-center overflow-hidden min-w-0 min-h-0">
                      <div
                        className="grid w-full h-full gap-3"
                        style={{
                          gridTemplateColumns: `repeat(${(GRID_CONFIGS[currentLayout.layout_template] || GRID_CONFIGS['2x2']).cols}, minmax(0, 1fr))`,
                          gridAutoRows: 'minmax(0, 1fr)',
                          width: '100%',
                          height: '100%',
                        }}
                      >
                        {getSlotsForLayout(allSlots, currentLayout.id).map((slot) => {
                          const image = slot.image_id ? imageMap.get(slot.image_id) : null;
                          const defaultCaption = getDefaultCaption(slot.slot_position, currentLayout.category_filter);
                          return (
                            <PopupSlot
                              key={slot.id}
                              slot={slot}
                              image={image}
                              defaultCaption={defaultCaption}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Page footer - EXACT COPY from LayoutBuilder line 353 */}
                    <div
                      className="flex items-center px-6 py-2"
                      style={{ borderTop: '1px solid #e5e7eb', flexShrink: 0 }}
                    >
                      <span className="text-[10px] text-slate-400 italic">
                        Page {currentPageIndex + 1}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-500 text-sm">Select a page to preview</div>
                )}
              </div>

              {/* Panel footer - full width, dark */}
              <div
                className="flex items-center justify-between px-4 py-2 shrink-0"
                style={{ backgroundColor: '#1a1a1a', borderTop: '1px solid #333' }}
              >
                <span className="text-xs text-slate-400">
                  Page {currentPageIndex + 1} of {layouts.length}
                </span>
                <div className="flex items-center gap-2">
                  {/* Placeholder for future controls */}
                </div>
              </div>
            </div>
          </div>

          {/* Footer with action hint */}
          <div
            className="px-6 py-2 border-t text-center text-sm text-slate-500 shrink-0"
            style={{ backgroundColor: '#1a1a1a', borderColor: '#333' }}
          >
            Click to select | Double-click to edit | Press ESC or click X to close
          </div>
        </div>
      )}
    </DndContext>
  );
}

// Helper component for drag overlay image with signed URL
function DragOverlayImage({ image }: { image: JobImage }) {
  const path = image.thumbnail_path || image.storage_path;
  const imageUrl = useSignedImageUrl(path, { width: 200 });

  if (!imageUrl) return null;

  return (
    <div className="w-32 h-24 rounded-lg overflow-hidden shadow-2xl border-2 border-green-500 opacity-80">
      <img
        src={imageUrl}
        alt={image.original_filename}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

// Helper component for expanded gallery items
function ExpandedGalleryItem({
  image,
  isSelected,
  onToggleSelect,
  onOpenEditor,
}: {
  image: JobImage;
  isSelected: boolean;
  onToggleSelect: () => void;
  onOpenEditor: () => void;
}) {
  const path = image.thumbnail_path || image.storage_path;
  const imageUrl = useSignedImageUrl(path, { width: 300 });

  return (
    <div
      className={`relative rounded-lg overflow-hidden cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-black' : ''
      }`}
      style={{ aspectRatio: '4/3', backgroundColor: '#2a2a2a' }}
      onClick={onToggleSelect}
      onDoubleClick={onOpenEditor}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={image.original_filename}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-500">
          Loading...
        </div>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Category badge */}
      {image.category && (
        <div
          className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-xs font-medium"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff' }}
        >
          {image.category}
        </div>
      )}

      {/* Filename on hover */}
      <div
        className="absolute inset-x-0 bottom-0 p-2 opacity-0 hover:opacity-100 transition-opacity"
        style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}
      >
        <p className="text-xs text-white truncate">{image.original_filename}</p>
      </div>
    </div>
  );
}

// Grid configurations for page preview
const GRID_CONFIGS: Record<string, { cols: number; rows: number }> = {
  '1x1': { cols: 1, rows: 1 },
  '2x2': { cols: 2, rows: 2 },
  '2x3': { cols: 2, rows: 3 },
  '3x3': { cols: 3, rows: 3 },
  '3x4': { cols: 3, rows: 4 },
  '4x3': { cols: 4, rows: 3 },
  'custom': { cols: 2, rows: 2 },
};

// Predefined captions by category - matches LayoutBuilder
const DEFAULT_CAPTIONS: Record<string, string[]> = {
  'Exterior': ['Front Exterior', 'Rear Exterior', 'Left Side', 'Right Side', 'Street View', 'Close-up'],
  'Interior Units': ['Typical Kitchen', 'Typical Bathroom', 'Typical Bedroom 1', 'Typical Bedroom 2', 'Living Room', 'Hallway'],
  'Common Areas': ['Lobby', 'Corridor', 'Amenity Space', 'Laundry Room'],
  'Building Systems': ['HVAC', 'Electrical Panel', 'Plumbing', 'Water Heater', 'Roof', 'Elevator'],
  'Site': ['Parking', 'Landscaping', 'Entrance', 'Signage'],
};

// Get default caption based on slot position and category
function getDefaultCaption(slotPosition: number, categoryFilter?: string): string {
  if (!categoryFilter) return '';
  const captions = DEFAULT_CAPTIONS[categoryFilter] || [];
  return captions[slotPosition - 1] || '';
}

// PopupSlot - EXACT COPY of SortableSlot rendering (without drag/drop)
// Matches SortableSlot.tsx lines 109-206 exactly
function PopupSlot({
  slot,
  image,
  defaultCaption = '',
}: {
  slot: { id: string; slot_position: number; caption?: string };
  image: JobImage | null | undefined;
  defaultCaption?: string;
}) {
  const imagePath = image ? (image.thumbnail_path || image.storage_path) : null;
  const imageUrl = useSignedImageUrl(imagePath, { width: 400 });

  // Current caption value (slot caption overrides image caption, with default fallback)
  const currentCaption = slot.caption || image?.caption || defaultCaption;

  return (
    <div className="flex flex-col gap-1 min-w-0 min-h-0">
      {/* Image slot - EXACT COPY from SortableSlot line 112 */}
      <div
        className={`
          relative aspect-square overflow-hidden transition-all duration-150 group rounded-lg
          ${!image ? 'border-2 border-dashed border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100' : ''}
          ${image ? 'border border-slate-200 bg-white shadow-sm' : ''}
        `}
        style={{ width: '100%', height: 'auto' }}
      >
        {image ? (
          // Filled slot - EXACT COPY from SortableSlot line 122
          <img
            src={imageUrl!}
            alt={image.original_filename}
            className="w-full h-full object-contain"
          />
        ) : (
          // Empty slot - EXACT COPY from SortableSlot line 162
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="p-3 rounded-full mb-2 bg-slate-100">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-[11px] font-medium text-slate-400">
              Drag image here
            </span>
          </div>
        )}

        {/* Position badge - EXACT COPY from SortableSlot line 173 */}
        <div className="absolute top-1.5 left-1.5 bg-white/90 text-slate-400 text-[10px] px-1.5 py-0.5 rounded-md font-medium shadow-sm">
          {slot.slot_position}
        </div>
      </div>

      {/* Caption - matches SortableSlot styling */}
      {/* Always visible, LEFT ALIGNED, light hover */}
      {image ? (
        <div className="w-full text-[11px] text-slate-600 px-1 py-0.5 truncate rounded hover:bg-slate-100 transition-colors">
          {currentCaption || defaultCaption || 'Add caption...'}
        </div>
      ) : (
        <div className="w-full text-[11px] text-slate-400 px-1 py-0.5">
          {defaultCaption || 'Caption'}
        </div>
      )}
    </div>
  );
}

export default ImageConfiguratorDemo;
