/**
 * ImageConfiguratorDemo Component
 * Main standalone demo page for the Image Page Configurator feature
 * Combines upload, gallery, layout builder, and editor
 */

import React, { useState, useCallback, useMemo } from 'react';
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
import { FileText, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

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

            {/* Filters */}
            <FiltersPanel
              filters={filters}
              onChange={setFilters}
              selectedCount={selectedIds.length}
              totalCount={images.length}
              onBulkAction={handleBulkAction}
            />

            {/* Image grid */}
            <div className="flex-1 overflow-auto p-3">
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

export default ImageConfiguratorDemo;
