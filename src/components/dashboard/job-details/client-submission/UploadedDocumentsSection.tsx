
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, FileImage, X } from "lucide-react";
import { DetailJob } from "@/types/job";
import { formatFileSize } from "@/utils/formatters";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import FileUpload from "@/components/FileUpload";
import { debugSupabase } from "@/utils/debug-supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UploadedDocumentsSectionProps {
  job: DetailJob;
  onUpdateJob?: (updates: Partial<DetailJob>) => void;
}

const UploadedDocumentsSection: React.FC<UploadedDocumentsSectionProps> = ({ job, onUpdateJob }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  
  // Get file icon based on type
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext || '')) {
      return <FileImage className="h-10 w-10 text-green-500" />;
    }
    if (ext === 'pdf') {
      return <FileText className="h-10 w-10 text-red-500" />;
    }
    return <FileText className="h-10 w-10 text-blue-500" />;
  };
  
  const handleDownload = async (file: { fileName: string; filePath: string }) => {
    try {
      toast.loading(`Downloading ${file.fileName}...`);
      
      // Download file from Supabase Storage
      const { data, error } = await supabase.storage
        .from('job-files')
        .download(file.filePath);
      
      if (error) {
        console.error("Error downloading file:", error);
        toast.error(`Failed to download ${file.fileName}. ${error.message}`);
        return;
      }
      
      if (!data) {
        toast.error(`Failed to download ${file.fileName}. File not found.`);
        return;
      }
      
      // Create a download link and click it
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.fileName;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`${file.fileName} downloaded successfully`);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error(`Failed to download ${file.fileName}. Please try again.`);
    } finally {
      toast.dismiss();
    }
  };
  
  const handleView = async (file: { fileName: string; filePath: string }) => {
    try {
      const { data } = supabase.storage
        .from('job-files')
        .getPublicUrl(file.filePath);
      
      if (data?.publicUrl) {
        setPreviewFile(file);
        setPreviewUrl(data.publicUrl);
      }
    } catch (error) {
      toast.error('Unable to view file');
    }
  };
  
  const closePreview = () => {
    setPreviewFile(null);
    setPreviewUrl("");
  };
  
  const handleFilesSelected = (files: File[]) => {
    setPendingFiles(files);
    if (files.length > 0) {
      handleUpload(files);
    }
  };

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    // Debug which Supabase we're using
    const supabaseInfo = debugSupabase();
    console.log('Upload attempt to:', supabaseInfo);
    
    setIsUploading(true);
    
    try {
      for (const file of files) {
        // Upload to Supabase storage
        // Remove 'job-' prefix from job.id for valid storage path (if it exists)
        const jobIdForStorage = job.id.startsWith('job-') ? job.id.replace('job-', '') : job.id;
        // Replace spaces and special characters in filename
        const sanitizedFileName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${jobIdForStorage}/${Date.now()}-${sanitizedFileName}`;
        
        const { data, error } = await supabase.storage
          .from('job-files')
          .upload(fileName, file);
        
        if (error) {
          toast.error(`Failed to upload ${file.name}: ${error.message}`);
          continue;
        }
        
        // Save file reference to database
        const { error: dbError } = await supabase
          .from('job_files')
          .insert({
            job_id: job.id,
            file_name: file.name,
            file_path: fileName, // This now uses the corrected path without 'job-' prefix
            file_type: file.type,
            file_size: file.size
          });
        
        if (dbError) {
          toast.error(`Failed to save ${file.name} reference`);
        } else {
          toast.success(`${file.name} uploaded successfully`);
          // Refresh the page or update the files list
          window.location.reload();
        }
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
      setPendingFiles([]);
    }
  };
  
  return (
    <div className="mt-6">
      <h4 className="font-semibold text-base text-slate-700 dark:text-slate-300 mb-4">Documents</h4>
      
      {/* File Upload Component with Drag and Drop */}
      <div className="mb-6">
        <FileUpload
          onChange={handleFilesSelected}
          value={pendingFiles}
          maxFiles={10}
          maxSize={10}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
        />
      </div>
      
      {/* Show existing files if any */}
      {job.files && job.files.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Uploaded Files</h5>
          <div className="space-y-2">
          {job.files.map((file) => {
            const ext = file.fileName.split('.').pop()?.toLowerCase();
            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext || '');
            
            return (
              <div
                key={file.id}
                className="group flex items-center gap-3 p-2 rounded-md border bg-card/50 hover:bg-card/80 transition-colors"
              >
                {/* Thumbnail or Icon */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded bg-muted/50 flex items-center justify-center">
                    {isImage ? (
                      <FileImage className="h-5 w-5 text-green-600" />
                    ) : ext === 'pdf' ? (
                      <FileText className="h-5 w-5 text-red-600" />
                    ) : (
                      <FileText className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                </div>
                
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => handleView(file)}
                >
                  <p className="text-sm font-medium truncate hover:text-primary transition-colors">
                    {file.fileName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.fileSize)}
                  </p>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleView(file)}
                    title="View file"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleDownload(file)}
                    title="Download file"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}
      
      {/* Preview Dialog */}
      <Dialog open={!!previewFile} onOpenChange={closePreview}>
        <DialogContent className="max-w-4xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-sm truncate pr-8">{previewFile?.fileName}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex items-center justify-center" style={{ maxHeight: 'calc(85vh - 100px)' }}>
            {previewFile && (
              <>
                {/* Image preview - contained within viewport */}
                {previewUrl && previewFile.fileName.match(/\.(jpg|jpeg|png|gif|bmp)$/i) && (
                  <img 
                    src={previewUrl} 
                    alt={previewFile.fileName}
                    className="max-w-full max-h-full object-contain rounded-lg"
                    style={{ maxHeight: 'calc(85vh - 120px)' }}
                  />
                )}
                
                {/* PDF and other files info */}
                {(!previewFile.fileName.match(/\.(jpg|jpeg|png|gif|bmp)$/i)) && (
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">{previewFile.fileName}</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {formatFileSize(previewFile.fileSize || 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {previewFile.fileName.endsWith('.pdf') 
                        ? 'PDF Document - Click to open in new tab'
                        : `Document - Click to open in new tab`
                      }
                    </p>
                    {previewUrl && (
                      <Button
                        className="mt-4"
                        onClick={() => window.open(previewUrl, '_blank')}
                      >
                        Open in New Tab
                      </Button>
                    )}
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

export default UploadedDocumentsSection;
// Force cache bust
