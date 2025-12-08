import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageFieldInputProps {
  value: string | undefined;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Single image upload input for Test Data Dashboard
 * Stores image as data URL (for testing) or accepts external URLs
 *
 * For production, this would upload to Supabase Storage and store the URL
 */
const ImageFieldInput: React.FC<ImageFieldInputProps> = ({
  value,
  onChange,
  placeholder = 'Drop image or paste URL',
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert File to data URL
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
      console.warn('Not an image file:', file.type);
      return;
    }

    setIsLoading(true);
    try {
      // For testing: convert to data URL
      // For production: upload to Supabase Storage and get URL
      const dataUrl = await fileToDataUrl(file);
      onChange(dataUrl);
    } catch (error) {
      console.error('Failed to process image:', error);
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
  const handleClear = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Check if value is a valid image URL or data URL
  // Handle case where value might be array or non-string
  const stringValue = typeof value === 'string' ? value : '';
  const hasImage = stringValue && (
    stringValue.startsWith('data:image/') ||
    stringValue.startsWith('http://') ||
    stringValue.startsWith('https://') ||
    stringValue.startsWith('/') // relative path
  );

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
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-3 h-3 mr-1" />
                Replace
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 text-red-500 hover:text-red-600"
                onClick={handleClear}
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
          <ImageIcon className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-500">
            {isLoading ? 'Processing...' : placeholder}
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageFieldInput;
