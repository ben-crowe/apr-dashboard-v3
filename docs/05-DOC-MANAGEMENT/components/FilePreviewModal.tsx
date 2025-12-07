import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  X, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Maximize,
  Share2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  filename: string;
  url: string;
  size?: number;
  type?: string;
  uploadedAt?: Date;
}

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: UploadedFile | null;
  files?: UploadedFile[]; // For navigation between files
  onNavigate?: (direction: 'prev' | 'next') => void;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  isOpen,
  onClose,
  file,
  files = [],
  onNavigate
}) => {
  const [zoomLevel, setZoomLevel] = useState(75); // Default zoom 75% like LOE Modal
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Get file extension for type detection
  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  // Detect file type
  const getFileType = (filename: string): 'image' | 'pdf' | 'document' | 'other' => {
    const ext = getFileExtension(filename);
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'heic'].includes(ext)) {
      return 'image';
    }
    if (ext === 'pdf') {
      return 'pdf';
    }
    if (['doc', 'docx', 'xls', 'xlsx', 'txt'].includes(ext)) {
      return 'document';
    }
    return 'other';
  };

  // Zoom controls (from LOE Modal pattern)
  const handleZoomIn = () => setZoomLevel(Math.min(200, zoomLevel + 10));
  const handleZoomOut = () => setZoomLevel(Math.max(25, zoomLevel - 10));
  const handleResetZoom = () => setZoomLevel(75);

  // Rotation for images
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  // Download file
  const handleDownload = () => {
    if (!file) return;
    
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.filename;
    link.click();
    toast.success('Download started');
  };

  // Share file (generate temporary link)
  const handleShare = async () => {
    if (!file) return;
    
    try {
      // Copy URL to clipboard
      await navigator.clipboard.writeText(file.url);
      toast.success('Link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  // Toggle fullscreen
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;

      // Zoom controls
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          handleZoomIn();
        } else if (e.key === '-') {
          e.preventDefault();
          handleZoomOut();
        } else if (e.key === '0') {
          e.preventDefault();
          handleResetZoom();
        }
      }

      // Navigation
      if (onNavigate) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          onNavigate('prev');
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          onNavigate('next');
        }
      }

      // Close on Escape
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onNavigate, onClose]);

  // Navigation helpers
  const currentIndex = file ? files.findIndex(f => f.id === file.id) : -1;
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < files.length - 1;

  // Render file content based on type
  const renderFileContent = () => {
    if (!file) return null;

    const fileType = getFileType(file.filename);
    const zoomStyles = {
      zoom: zoomLevel / 100,
      transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
      transformOrigin: 'center center',
      transition: 'transform 0.2s ease'
    };

    switch (fileType) {
      case 'image':
        return (
          <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
            <img
              src={file.url}
              alt={file.filename}
              style={zoomStyles}
              className="max-w-full max-h-full object-contain"
              onLoad={() => setIsLoading(false)}
            />
          </div>
        );

      case 'pdf':
        return (
          <iframe
            src={file.url}
            className="w-full h-full bg-white"
            title={file.filename}
            style={{ 
              border: 'none',
              zoom: zoomLevel / 100
            }}
            onLoad={() => setIsLoading(false)}
          />
        );

      case 'document':
      case 'other':
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <FileText className="w-24 h-24 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{file.filename}</h3>
            <p className="text-sm text-gray-500 mb-4">
              Preview not available for this file type
            </p>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download File
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] flex flex-col p-4">
        {/* Header with controls */}
        <div className="flex justify-between items-center pb-2 border-b">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">File Preview</h2>
            {file && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {file.filename}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Navigation controls */}
            {onNavigate && files.length > 1 && (
              <div className="flex items-center gap-1 mr-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('prev')}
                  disabled={!hasPrevious}
                  className="h-8 w-8 p-0"
                  title="Previous file (←)"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs px-2">
                  {currentIndex + 1} / {files.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('next')}
                  disabled={!hasNext}
                  className="h-8 w-8 p-0"
                  title="Next file (→)"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200"
                title="Zoom Out (Ctrl -)"
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              
              <span className="text-xs font-medium px-2 min-w-[45px] text-center dark:text-gray-200">
                {zoomLevel}%
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200"
                title="Zoom In (Ctrl +)"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
              
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetZoom}
                className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200"
                title="Reset Zoom (Ctrl 0)"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              {file && getFileType(file.filename) === 'image' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRotate}
                  className="h-8 w-8 p-0"
                  title="Rotate"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFullscreen}
                className="h-8 w-8 p-0"
                title="Fullscreen"
              >
                <Maximize className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="h-8 w-8 p-0"
                title="Share"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="h-8 w-8 p-0"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </Button>
              
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
                title="Close (Esc)"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* File preview content */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 rounded-lg my-2 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Loading preview...</p>
              </div>
            </div>
          )}
          {renderFileContent()}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {file && (
              <>
                {getFileType(file.filename) === 'image' && (
                  <span>Use mouse to pan • Ctrl +/- to zoom</span>
                )}
                {getFileType(file.filename) === 'pdf' && (
                  <span>Use mouse wheel to scroll • Ctrl +/- to zoom</span>
                )}
                {files.length > 1 && (
                  <span> • Arrow keys to navigate files</span>
                )}
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="h-7 text-sm"
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreviewModal;