import React, { useState, useRef, DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  Check, 
  AlertCircle, 
  ExternalLink,
  Eye,
  X,
  Plus,
  Trash2
} from "lucide-react";
import SmartLink from "./SmartLink";

interface MultiDocumentUploadProps {
  type: string;
  label: string;
  currentFiles?: string[];
  status?: string;
  required: boolean;
  onUpload: (files: File[]) => void;
  smartLink?: string;
}

const MultiDocumentUpload: React.FC<MultiDocumentUploadProps> = ({
  type,
  label,
  currentFiles = [],
  status = 'missing',
  required,
  onUpload,
  smartLink
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFilesSelect(files);
  };

  const handleFilesSelect = (files: File[]) => {
    // Validate file types
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const validFiles = files.filter(file => {
      if (!validTypes.includes(file.type)) {
        alert(`${file.name}: Please upload PDF or image files only`);
        return false;
      }
      // Check file size (max 10MB per file)
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name}: File size must be less than 10MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setUploadedFiles([...uploadedFiles, ...validFiles]);
      onUpload(validFiles);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFilesSelect(Array.from(files));
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  const getStatusBadge = () => {
    if (currentFiles.length > 0) {
      return <Badge variant="success" className="h-5"><Check className="h-3 w-3 mr-1" />{currentFiles.length} files</Badge>;
    }
    switch (status) {
      case 'complete':
        return <Badge variant="success" className="h-5"><Check className="h-3 w-3 mr-1" />Complete</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="h-5">Pending</Badge>;
      default:
        return <Badge variant="outline" className="h-5"><AlertCircle className="h-3 w-3 mr-1" />Missing</Badge>;
    }
  };

  return (
    <div className="space-y-2">
      {/* Main Upload Area */}
      <div className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50/50 transition-colors">
        <div className="flex items-center gap-3 flex-1">
          {/* Status Icon */}
          <div className="flex items-center justify-center w-8 h-8">
            {currentFiles.length > 0 ? (
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-3 w-3 text-green-600" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                <FileText className="h-3 w-3 text-gray-400" />
              </div>
            )}
          </div>

          {/* Document Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{label}</span>
              {required && <span className="text-xs text-red-500">*</span>}
              {getStatusBadge()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Supports multiple files (PDF, PNG, JPG)
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Smart Link */}
          {smartLink && <SmartLink url={smartLink} label="Find Documents" />}

          {/* Upload Area with Drag-and-Drop */}
          <div
            className={`relative ${isDragging ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className={`h-8 ${isDragging ? 'bg-blue-50 border-blue-500' : ''}`}
            >
              <Plus className="h-3 w-3 mr-1" />
              {isDragging ? 'Drop here' : 'Add Files'}
            </Button>
          </div>
        </div>
      </div>

      {/* Existing Files List */}
      {currentFiles.length > 0 && (
        <div className="ml-11 space-y-1">
          {currentFiles.map((file, index) => {
            const fileName = file.split('/').pop() || file;
            const year = fileName.match(/\d{4}/)?.[0];
            
            return (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="h-3 w-3 text-gray-500" />
                  <span>{fileName}</span>
                  {year && <Badge variant="secondary" className="h-4 text-xs">{year}</Badge>}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => window.open(file, '_blank')}
                    title="View document"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Newly Uploaded Files (before save) */}
      {uploadedFiles.length > 0 && (
        <div className="ml-11 space-y-1">
          <p className="text-xs font-medium text-gray-600 mb-1">Ready to upload:</p>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded text-xs">
              <div className="flex items-center gap-2">
                <FileText className="h-3 w-3 text-blue-500" />
                <span className="font-medium">{file.name}</span>
                <Badge variant="secondary" className="h-4 text-xs">{(file.size / 1024).toFixed(0)} KB</Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-blue-100"
                onClick={() => removeFile(index)}
                title="Remove file"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiDocumentUpload;