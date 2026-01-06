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
import { useLayouts, useAssignImageToSlot, useClearSlot } from '../hooks/useLayouts';
import type { ImageFilters, JobImage, ReportTypeId } from '../types';
import { REPORT_TYPE_TEMPLATES, DEFAULT_REPORT_TYPE } from '../types';
import { useSignedImageUrl } from '@/utils/supabaseStorage';
import { FileText, ChevronDown } from 'lucide-react';

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

  // Resizable split state
  const [splitPercent, setSplitPercent] = useState(35); // Gallery takes 35% by default
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
      <div className={`flex flex-col h-full bg-slate-900 ${className}`}>
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-700">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-white">Image Page Configurator</h1>
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                Upload photos, organize by category, and build report pages
              </p>
            </div>

            {/* Report Type Selector */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowReportTypeMenu(!showReportTypeMenu)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded transition-colors text-sm whitespace-nowrap"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-white">{currentTemplate.name}</span>
                <span className="text-xs text-slate-400">({currentTemplate.pageCount})</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showReportTypeMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showReportTypeMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50">
                  <div className="p-2 border-b border-slate-700">
                    <div className="text-xs text-slate-500 uppercase tracking-wide px-2">Report Type</div>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2">
                    {Object.values(REPORT_TYPE_TEMPLATES).map((template) => (
                      <button
                        key={template.id}
                        onClick={() => {
                          setSelectedReportType(template.id);
                          setShowReportTypeMenu(false);
                          // TODO: Clear existing layouts and recreate from new template
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedReportType === template.id
                            ? 'bg-green-600 text-white'
                            : 'hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{template.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            selectedReportType === template.id
                              ? 'bg-green-500'
                              : 'bg-slate-600'
                          }`}>
                            {template.pageCount} pages
                          </span>
                        </div>
                        <div className={`text-xs mt-0.5 ${
                          selectedReportType === template.id
                            ? 'text-green-200'
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
        </div>

        {/* Main content - split view */}
        <div id="image-configurator-split" className="flex-1 flex overflow-hidden relative">
          {/* Left panel - Gallery */}
          <div
            className="flex flex-col border-r border-slate-700"
            style={{ width: `${splitPercent}%` }}
          >
            {/* Upload zone */}
            <div className="p-4 border-b border-slate-700">
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
            <div className="flex-1 overflow-auto p-4">
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
            className={`w-1 bg-slate-700 hover:bg-green-500 cursor-col-resize transition-colors relative group ${
              isDraggingDivider ? 'bg-green-500' : ''
            }`}
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
              className="flex-1"
            />
          </div>
        </div>

        {/* Footer stats */}
        <div className="px-6 py-2 border-t border-slate-700 flex items-center justify-between text-xs text-slate-500">
          <div>
            {images.length} images | {selectedIds.length} selected |{' '}
            {layoutData?.layouts.length || 0} pages
          </div>
          <div>
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
