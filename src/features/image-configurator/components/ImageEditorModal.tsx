/**
 * ImageEditorModal Component
 * Non-destructive image editor for crop, rotate, and adjustments
 * Uses CSS transforms + stores parameters (can be enhanced with Filerobot later)
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  X,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Sun,
  Contrast,
  Droplets,
  Check,
  Undo2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type { JobImage } from '../types';
import { useSaveImageEdits } from '../hooks/useJobImages';

interface ImageEditorModalProps {
  image: JobImage;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
}

interface Adjustments {
  brightness: number;
  contrast: number;
  saturation: number;
}

const DEFAULT_CROP: CropData = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  rotation: 0,
  flipH: false,
  flipV: false,
};

const DEFAULT_ADJUSTMENTS: Adjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
};

export function ImageEditorModal({
  image,
  isOpen,
  onClose,
  onSave,
}: ImageEditorModalProps) {
  const saveEdits = useSaveImageEdits();

  // Editor state
  const [cropData, setCropData] = useState<CropData>(
    (image.crop_data as CropData) || DEFAULT_CROP
  );
  const [adjustments, setAdjustments] = useState<Adjustments>(
    (image.adjustments as Adjustments) || DEFAULT_ADJUSTMENTS
  );
  const [activeTab, setActiveTab] = useState<'transform' | 'adjust'>('transform');
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  // Image container ref
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset to original
  const handleReset = useCallback(() => {
    setCropData(DEFAULT_CROP);
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setZoom(1);
  }, []);

  // Rotation handlers
  const handleRotateLeft = useCallback(() => {
    setCropData((prev) => ({
      ...prev,
      rotation: (prev.rotation - 90) % 360,
    }));
  }, []);

  const handleRotateRight = useCallback(() => {
    setCropData((prev) => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
    }));
  }, []);

  // Flip handlers
  const handleFlipH = useCallback(() => {
    setCropData((prev) => ({
      ...prev,
      flipH: !prev.flipH,
    }));
  }, []);

  const handleFlipV = useCallback(() => {
    setCropData((prev) => ({
      ...prev,
      flipV: !prev.flipV,
    }));
  }, []);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  }, []);

  // Adjustment handlers
  const handleAdjustmentChange = useCallback(
    (key: keyof Adjustments, value: number) => {
      setAdjustments((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  // Save handler
  const handleSave = useCallback(async () => {
    await saveEdits.mutateAsync({
      imageId: image.id,
      cropData,
      adjustments,
    });
    onSave?.();
    onClose();
  }, [image.id, cropData, adjustments, saveEdits, onSave, onClose]);

  // Build image URL
  const imageUrl = image.storage_path
    ? getSupabasePublicUrl(image.storage_path)
    : '/placeholder-image.jpg';

  // Build CSS filter string
  const filterStyle = `
    brightness(${adjustments.brightness}%)
    contrast(${adjustments.contrast}%)
    saturate(${adjustments.saturation}%)
  `;

  // Build transform string
  const transformStyle = `
    scale(${zoom})
    rotate(${cropData.rotation}deg)
    scaleX(${cropData.flipH ? -1 : 1})
    scaleY(${cropData.flipV ? -1 : 1})
  `;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-900 rounded-lg shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium text-white">Edit Image</h2>
            <span className="text-sm text-slate-400 truncate max-w-[200px]">
              {image.original_filename}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
            >
              <Undo2 className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saveEdits.isPending}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Image preview */}
          <div className="flex-1 flex items-center justify-center p-4 bg-slate-950 overflow-hidden">
            <div className="relative max-w-full max-h-full overflow-hidden">
              <img
                ref={imageRef}
                src={imageUrl}
                alt={image.original_filename}
                className="max-w-full max-h-[60vh] object-contain transition-transform duration-200"
                style={{
                  filter: filterStyle,
                  transform: transformStyle,
                }}
              />
            </div>
          </div>

          {/* Controls sidebar */}
          <div className="w-72 bg-slate-800 border-l border-slate-700 flex flex-col">
            {/* Tab buttons */}
            <div className="flex border-b border-slate-700">
              <button
                onClick={() => setActiveTab('transform')}
                className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === 'transform'
                    ? 'text-white bg-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Transform
              </button>
              <button
                onClick={() => setActiveTab('adjust')}
                className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === 'adjust'
                    ? 'text-white bg-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Adjust
              </button>
            </div>

            {/* Controls */}
            <div className="flex-1 p-4 overflow-y-auto">
              {activeTab === 'transform' && (
                <div className="space-y-6">
                  {/* Rotation */}
                  <div>
                    <label className="block text-xs text-slate-400 mb-2">
                      Rotation
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleRotateLeft}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span className="text-sm">Left</span>
                      </button>
                      <button
                        onClick={handleRotateRight}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
                      >
                        <RotateCw className="w-4 h-4" />
                        <span className="text-sm">Right</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 text-center">
                      {cropData.rotation}°
                    </p>
                  </div>

                  {/* Flip */}
                  <div>
                    <label className="block text-xs text-slate-400 mb-2">
                      Flip
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleFlipH}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded transition-colors ${
                          cropData.flipH
                            ? 'bg-blue-600 hover:bg-blue-500'
                            : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                      >
                        <FlipHorizontal className="w-4 h-4" />
                        <span className="text-sm">Horizontal</span>
                      </button>
                      <button
                        onClick={handleFlipV}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded transition-colors ${
                          cropData.flipV
                            ? 'bg-blue-600 hover:bg-blue-500'
                            : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                      >
                        <FlipVertical className="w-4 h-4" />
                        <span className="text-sm">Vertical</span>
                      </button>
                    </div>
                  </div>

                  {/* Zoom */}
                  <div>
                    <label className="block text-xs text-slate-400 mb-2">
                      Zoom
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleZoomOut}
                        disabled={zoom <= 0.5}
                        className="p-2 bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-50"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-full rounded-full transition-all"
                          style={{ width: `${((zoom - 0.5) / 2.5) * 100}%` }}
                        />
                      </div>
                      <button
                        onClick={handleZoomIn}
                        disabled={zoom >= 3}
                        className="p-2 bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-50"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 text-center">
                      {Math.round(zoom * 100)}%
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'adjust' && (
                <div className="space-y-6">
                  {/* Brightness */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Sun className="w-3.5 h-3.5" />
                        Brightness
                      </label>
                      <span className="text-xs text-slate-500">
                        {adjustments.brightness}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={200}
                      value={adjustments.brightness}
                      onChange={(e) =>
                        handleAdjustmentChange('brightness', Number(e.target.value))
                      }
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Contrast */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Contrast className="w-3.5 h-3.5" />
                        Contrast
                      </label>
                      <span className="text-xs text-slate-500">
                        {adjustments.contrast}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={200}
                      value={adjustments.contrast}
                      onChange={(e) =>
                        handleAdjustmentChange('contrast', Number(e.target.value))
                      }
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Saturation */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Droplets className="w-3.5 h-3.5" />
                        Saturation
                      </label>
                      <span className="text-xs text-slate-500">
                        {adjustments.saturation}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={200}
                      value={adjustments.saturation}
                      onChange={(e) =>
                        handleAdjustmentChange('saturation', Number(e.target.value))
                      }
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Info footer */}
            <div className="p-3 border-t border-slate-700 bg-slate-850">
              <p className="text-xs text-slate-500 text-center">
                Non-destructive: Original image preserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to build Supabase public URL
function getSupabasePublicUrl(path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const bucket = path.includes('processed') ? 'appraisal-processed' : 'appraisal-raw';
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

export default ImageEditorModal;
