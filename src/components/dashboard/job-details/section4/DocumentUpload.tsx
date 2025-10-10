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
  Download
} from "lucide-react";
import SmartLink from "./SmartLink";

interface DocumentUploadProps {
  type: string;
  label: string;
  currentFile?: string;
  status?: string;
  required: boolean;
  onUpload: (file: File) => void;
  smartLink?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  type,
  label,
  currentFile,
  status = 'missing',
  required,
  onUpload,
  smartLink
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
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
    if (files.length > 0) {
      const file = files[0];
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF or image file (PNG/JPG)');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setPreviewFile(file);
    onUpload(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const getStatusBadge = () => {
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
    <div className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50/50 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        {/* Status Icon */}
        <div className="flex items-center justify-center w-8 h-8">
          {status === 'complete' ? (
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
          {currentFile && (
            <p className="text-xs text-muted-foreground mt-1">
              {currentFile.split('/').pop()}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Smart Link */}
        {smartLink && <SmartLink url={smartLink} label="Get Document" />}

        {/* View Document (if uploaded) */}
        {currentFile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => window.open(currentFile, '_blank')}
            title="View document"
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}

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
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          {status === 'complete' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-7 text-sm"
            >
              Replace
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className={`h-8 ${isDragging ? 'bg-blue-50 border-blue-500' : ''}`}
            >
              <Upload className="h-3 w-3 mr-1" />
              {isDragging ? 'Drop here' : 'Upload'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;