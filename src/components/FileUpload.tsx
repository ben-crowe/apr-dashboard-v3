
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, FileText, Eye, FileImage, File } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FileUploadProps {
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  accept?: string;
  value?: File[];
  error?: string;
}

const FileUpload = ({
  onChange,
  maxFiles = 10,
  maxSize = 10, // 10MB
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png",
  value = [],
  error,
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>(value);
  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    addFiles(Array.from(e.target.files));
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    newFiles.forEach((file) => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        invalidFiles.push(`${file.name} (exceeds ${maxSize}MB)`);
        return;
      }

      // Check if file type is accepted
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      if (!accept.includes(fileExtension) && accept !== "*") {
        invalidFiles.push(`${file.name} (unsupported file type)`);
        return;
      }

      validFiles.push(file);
    });

    // Check max files
    if (files.length + validFiles.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} files.`);
      return;
    }

    if (invalidFiles.length > 0) {
      toast.error(
        <div>
          <p>Some files couldn't be added:</p>
          <ul className="mt-2 list-disc pl-4 text-sm">
            {invalidFiles.map((file, i) => (
              <li key={i}>{file}</li>
            ))}
          </ul>
        </div>
      );
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onChange(updatedFiles);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    onChange(updatedFiles);
  };

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
    // Only set dragging to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      console.log('Files dropped:', droppedFiles.length);
      addFiles(droppedFiles);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  const handlePreview = (file: File) => {
    setPreviewFile(file);
    
    // Create preview URL for images
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  };

  const closePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewFile(null);
    setPreviewUrl("");
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return FileImage;
    if (file.type === 'application/pdf') return FileText;
    return File;
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-all",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          error && "border-destructive/50"
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <Input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
        />
        <div className="flex flex-col items-center text-center">
          <Upload
            className="h-10 w-10 mb-2 text-muted-foreground"
            aria-hidden="true"
          />
          <div className="space-y-1">
            <p className="font-medium">Drag & drop files here</p>
            <p className="text-sm text-muted-foreground">
              or click to browse (max {maxSize}MB per file)
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, Word, Excel, images
            </p>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-destructive mt-1">{error}</p>}

      {files.length > 0 && (
        <div className="space-y-2 animate-fade-in">
          {files.map((file, index) => {
            const Icon = getFileIcon(file);
            const isImage = file.type.startsWith('image/');
            const thumbnailUrl = isImage ? URL.createObjectURL(file) : null;
            
            return (
              <div
                key={`${file.name}-${index}`}
                className="group flex items-center gap-3 p-2 rounded-md border bg-card/50 hover:bg-card/80 transition-colors"
              >
                {/* Thumbnail or Icon */}
                <div className="flex-shrink-0">
                  {isImage && thumbnailUrl ? (
                    <div className="w-10 h-10 rounded overflow-hidden bg-muted">
                      <img 
                        src={thumbnailUrl}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        onLoad={() => {
                          // Clean up the URL after image loads to prevent memory leaks
                          if (index === files.length - 1) {
                            setTimeout(() => URL.revokeObjectURL(thumbnailUrl), 100);
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded bg-muted/50 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  )}
                </div>
                
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePreview(file);
                  }}
                >
                  <p className="text-sm font-medium truncate hover:text-primary transition-colors">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handlePreview(file);
                    }}
                    title="Preview file"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Preview file</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewFile} onOpenChange={closePreview}>
        <DialogContent className="max-w-4xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-sm truncate pr-8">{previewFile?.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex items-center justify-center" style={{ maxHeight: 'calc(85vh - 100px)' }}>
            {previewFile && (
              <>
                {/* Image preview - contained within viewport */}
                {previewFile.type.startsWith('image/') && previewUrl && (
                  <img 
                    src={previewUrl} 
                    alt={previewFile.name}
                    className="max-w-full max-h-full object-contain rounded-lg"
                    style={{ maxHeight: 'calc(85vh - 120px)' }}
                  />
                )}
                
                {/* PDF and other files info */}
                {!previewFile.type.startsWith('image/') && (
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">{previewFile.name}</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {formatFileSize(previewFile.size)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {previewFile.type === 'application/pdf' 
                        ? 'PDF Document - Preview not available'
                        : `${previewFile.type || 'Document'} - Preview not available`
                      }
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      The file will be uploaded with your submission
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileUpload;
