import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon, ExternalLink, Loader2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadReportImage, deleteReportImage } from '@/utils/reportImageStorage';

interface ImageFieldInputProps {
  value: string | undefined;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
  // Optional: provide these to enable Supabase uploads
  jobId?: string;
  fieldId?: string;
  // If true, always use data URL (for quick testing without Supabase)
  useDataUrl?: boolean;
}

/**
 * Image upload input for Test Data Dashboard
 *
 * Modes:
 * 1. Supabase Upload (default when jobId & fieldId provided): Uploads to report-images bucket
 * 2. Data URL (useDataUrl=true or no jobId): Stores as base64 data URL
 * 3. External URL: Accepts pasted URLs
 */
const ImageFieldInput: React.FC<ImageFieldInputProps> = ({
  value,
  onChange,
  placeholder = 'Drop image or paste URL',
  className,
  jobId,
  fieldId,
  useDataUrl = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine if we should use Supabase
  const shouldUseSupabase = !useDataUrl && jobId && fieldId;

  // Handle escape key to close preview
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && previewOpen) {
        setPreviewOpen(false);
      }
    };

    if (previewOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [previewOpen]);

  // Convert File to data URL (fallback mode)
  const fileToDataUrl = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  // Handle file selection
  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Not an image file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (shouldUseSupabase) {
        // Upload to Supabase Storage
        const result = await uploadReportImage(file, jobId!, fieldId!);

        if ('error' in result) {
          setError(result.error);
          // Fallback to data URL if Supabase fails
          const dataUrl = await fileToDataUrl(file);
          onChange(dataUrl);
        } else {
          onChange(result.url);
        }
      } else {
        // Use data URL (local testing mode)
        const dataUrl = await fileToDataUrl(file);
        onChange(dataUrl);
      }
    } catch (err) {
      console.error('Failed to process image:', err);
      setError('Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };

  // Drag handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(f => f.type.startsWith('image/'));

    if (imageFile) {
      await handleFileSelect(imageFile);
    }
  };

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  // Handle paste from clipboard
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          await handleFileSelect(file);
          return;
        }
      }
    }
  };

  // Clear image
  const handleClear = async () => {
    // If it's a Supabase URL, we could delete it - but skip for now
    // since we might want to keep orphaned images for debugging
    onChange('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Check if value is a valid image URL or data URL
  const stringValue = typeof value === 'string' ? value : '';
  const hasImage = stringValue && (
    stringValue.startsWith('data:image/') ||
    stringValue.startsWith('http://') ||
    stringValue.startsWith('https://') ||
    stringValue.startsWith('/') // relative path
  );

  // Check if it's a Supabase URL
  const isSupabaseUrl = stringValue.includes('supabase') && stringValue.includes('report-images');

  return (
    <div className={cn('relative', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />

      {hasImage ? (
        // Image preview
        <div className="flex items-center gap-2">
          <div
            className="relative w-16 h-16 rounded border overflow-hidden bg-slate-100 flex-shrink-0"
            title={stringValue}
          >
            <img
              src={stringValue}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {isSupabaseUrl && (
              <div className="absolute bottom-0 left-0 right-0 bg-green-500/80 text-white text-[8px] text-center">
                Supabase
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7"
                onClick={() => setPreviewOpen(true)}
                title="Preview image"
              >
                <Eye className="w-3 h-3" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Upload className="w-3 h-3 mr-1" />
                )}
                Replace
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 text-red-500 hover:text-red-600"
                onClick={handleClear}
                disabled={isLoading}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            {stringValue?.startsWith('http') && (
              <a
                href={stringValue}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                View full
              </a>
            )}
          </div>
        </div>
      ) : (
        // Drop zone
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded border-2 border-dashed cursor-pointer transition-colors',
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-slate-300 hover:border-slate-400',
            isLoading && 'opacity-50 pointer-events-none'
          )}
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onPaste={handlePaste}
          tabIndex={0}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          ) : (
            <ImageIcon className="w-4 h-4 text-slate-400" />
          )}
          <span className={cn('text-sm', error ? 'text-red-500' : 'text-slate-500')}>
            {isLoading ? 'Uploading...' : error ? error : placeholder}
          </span>
        </div>
      )}

      {/* Mode indicator */}
      {!hasImage && (
        <div className="text-[10px] text-slate-400 mt-1">
          {shouldUseSupabase ? '→ Supabase Storage' : '→ Local (data URL)'}
        </div>
      )}

      {/* Preview Modal */}
      {previewOpen && hasImage && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2"
          onClick={() => setPreviewOpen(false)}
        >
          <div className="relative max-w-[95vw] max-h-[95vh]">
            <img
              src={stringValue}
              alt="Preview"
              className="max-w-[95vw] max-h-[95vh] object-contain rounded shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1.5 transition-colors shadow-lg"
              onClick={() => setPreviewOpen(false)}
              title="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageFieldInput;
