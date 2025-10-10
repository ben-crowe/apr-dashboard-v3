import React, { useState, useRef, useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SectionTitle, sectionTriggerStyle, sectionContentStyle, FieldRow, SectionGroup } from "./ValcreStyles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionProps } from "./types";
import { toast } from "sonner";
import { Upload, Eye, Download, ExternalLink, Check, FileText, FileImage, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ensureDocumentsBucketExists } from "@/utils/storage";
import { getSmartLinks, smartLinkLabels } from "@/utils/smartLinks";

// Unified component styling to match other sections
const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <div className="">
    {children}
  </div>
);

const Section4Compact: React.FC<SectionProps> = ({
  job,
  jobDetails = {},
  onUpdateDetails,
}) => {
  const [uploading, setUploading] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true); // Default to open

  // Get smart links based on property address
  const smartLinks = getSmartLinks(job.propertyAddress);

  // Ensure storage bucket exists when component mounts
  useEffect(() => {
    ensureDocumentsBucketExists();
  }, []);

  const fillTestData = () => {
    if (!onUpdateDetails) return;

    const testData = {
      land_title_url: "/test-docs/land-title.pdf",
      survey_certificate_url: "/test-docs/survey.pdf",
      assessment_split_land_value: 250000,
      assessment_split_building_value: 750000,
      assessment_split_data: { landValue: 250000, buildingValue: 750000 },
      tax_notice_url: "/test-docs/tax.pdf",
      zoning_map_url: "/test-docs/zoning.png",
      flood_map_url: "/test-docs/flood.png",
      aerial_photo_url: "/test-docs/aerial.jpg",
      building_permits_urls: [
        "/test-docs/permit1.pdf",
        "/test-docs/permit2.pdf",
      ],
      site_plan_url: "/test-docs/site-plan.pdf",
      documents_complete_count: 9,
    };

    onUpdateDetails(testData);
    toast.success("Test data populated!");
  };

  // Calculate document count (8 actual file uploads)
  const uploadedCount = [
    jobDetails.land_title_url,
    jobDetails.survey_certificate_url,
    jobDetails.tax_notice_url,
    jobDetails.zoning_map_url,
    jobDetails.flood_map_url,
    jobDetails.aerial_photo_url,
    jobDetails.building_permits_urls?.length > 0,
    jobDetails.site_plan_url,
  ].filter(Boolean).length;

  // Handle file upload to Supabase Storage
  const handleFileUpload = async (file: File, fieldName: string) => {
    if (!onUpdateDetails) return;

    setUploading(fieldName);

    try {
      // Sanitize filename to remove spaces and special characters
      const sanitizedFileName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${Date.now()}-${sanitizedFileName}`;
      // Remove 'job-' prefix from job.id for valid storage path
      const jobIdForStorage = job.id.startsWith('job-') ? job.id.replace('job-', '') : job.id;
      const filePath = `${jobIdForStorage}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (error) {
        console.error("Upload error:", error);
        toast.error("Upload failed: " + error.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("documents").getPublicUrl(filePath);

      onUpdateDetails({
        [fieldName]: publicUrl,
        [`${fieldName.replace("_url", "")}_uploaded_at`]:
          new Date().toISOString(),
        [`${fieldName.replace("_url", "")}_status`]: "uploaded",
      });

      toast.success(`Document uploaded successfully`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed");
    } finally {
      setUploading(null);
    }
  };

  // Handle multiple file upload for building permits
  const handleMultipleFileUpload = async (
    files: FileList,
    fieldName: string,
  ) => {
    if (!onUpdateDetails) return;

    setUploading(fieldName);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Sanitize filename to remove spaces and special characters
        const sanitizedFileName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${Date.now()}-${i}-${sanitizedFileName}`;
        // Remove 'job-' prefix from job.id for valid storage path
        const jobIdForStorage = job.id.startsWith('job-') ? job.id.replace('job-', '') : job.id;
        const filePath = `${jobIdForStorage}/${fileName}`;

        const { data, error } = await supabase.storage
          .from("documents")
          .upload(filePath, file);

        if (error) {
          console.error("Upload error:", error);
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("documents").getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      const existingUrls = jobDetails[fieldName] || [];
      const allUrls = [...existingUrls, ...uploadedUrls];

      onUpdateDetails({
        [fieldName]: allUrls,
        [`${fieldName.replace("_urls", "")}_uploaded_at`]:
          new Date().toISOString(),
        [`${fieldName.replace("_urls", "")}_status`]: "uploaded",
      });

      toast.success(`${uploadedUrls.length} permits uploaded`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed");
    } finally {
      setUploading(null);
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent, fieldName: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(fieldName);
    } else if (e.type === "dragleave") {
      setDragActive(null);
    }
  };

  const handleDrop = (
    e: React.DragEvent,
    fieldName: string,
    isMultiple = false,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (isMultiple) {
        handleMultipleFileUpload(e.dataTransfer.files, fieldName);
      } else {
        handleFileUpload(e.dataTransfer.files[0], fieldName);
      }
    }
  };

  // Handle file deletion
  const handleDeleteFile = async (fieldName: string, fileUrl: string, index?: number) => {
    try {
      // Extract the file path from the URL
      const urlParts = fileUrl.split('/storage/v1/object/public/documents/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        
        // Delete from Supabase storage
        const { error } = await supabase.storage
          .from('documents')
          .remove([filePath]);
        
        if (error) {
          console.error('Error deleting file:', error);
          toast.error('Failed to delete file from storage');
        }
      }
      
      // Update local state
      if (index !== undefined) {
        // For multiple files, remove the specific file from the array
        const currentFiles = jobDetails[fieldName] || [];
        const updatedFiles = currentFiles.filter((_: string, i: number) => i !== index);
        onUpdateDetails?.({ [fieldName]: updatedFiles });
      } else {
        // For single file, set to null
        onUpdateDetails?.({ [fieldName]: null });
      }
      
      toast.success('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  // Get status badge for a document
  const getStatusBadge = (hasFile: boolean, required: boolean = false) => {
    if (hasFile) {
      return (
        <span className="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-full">
          complete
        </span>
      );
    } else if (required) {
      return (
        <span className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
          pending
        </span>
      );
    }
    return null;
  };

  // Helper function to extract filename from URL
  const extractFilename = (url: string) => {
    if (!url) return "";
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    // Remove timestamp prefix if present (e.g., "1758551453821-" from filename)
    return filename.replace(/^\d+-/, '');
  };

  // Get file icon based on file extension
  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext || '')) {
      return FileImage;
    }
    return FileText;
  };

  // Document upload box component with file list view
  const DocumentUploadBox = ({
    label,
    fieldName,
    required = false,
    smartLinkKey,
    fileCount = 0,
    isMultiple = false,
  }: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const hasFile = isMultiple
      ? jobDetails[fieldName]?.length > 0
      : jobDetails[fieldName];
    const displayCount = isMultiple
      ? jobDetails[fieldName]?.length || 0
      : hasFile
        ? 1
        : 0;
    const isUploading = uploading === fieldName;
    const isDragging = dragActive === fieldName;

    return (
      <div
        className={`relative border rounded-lg p-3 transition-all ${
          isDragging
            ? "border-blue-400 bg-blue-50/50 dark:bg-blue-950/50 border-dashed border-2"
            : "border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/30 hover:border-gray-300 dark:hover:border-gray-600"
        }`}
        onDragEnter={(e) => handleDrag(e, fieldName)}
        onDragLeave={(e) => handleDrag(e, fieldName)}
        onDragOver={(e) => handleDrag(e, fieldName)}
        onDrop={(e) => handleDrop(e, fieldName, isMultiple)}
      >
        {/* Compact header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </h4>
            {displayCount > 0 && (
              <span className="text-xs text-gray-500">
                ({displayCount} file{displayCount !== 1 ? 's' : ''})
              </span>
            )}
          </div>
          {hasFile && (
            <Check className="h-4 w-4 text-green-600" />
          )}
        </div>

        {/* File List View - Show actual filenames with icons, preview and download */}
        {hasFile && (
          <div className="mb-3 space-y-1">
            {isMultiple ? (
              jobDetails[fieldName]?.map((url: string, index: number) => {
                const filename = extractFilename(url);
                const FileIcon = getFileIcon(filename);
                return (
                  <div key={index} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded border text-xs">
                    {/* File Icon */}
                    <FileIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    
                    {/* File Name */}
                    <span className="flex-1 truncate text-gray-700 dark:text-gray-300">
                      {filename}
                    </span>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-1">
                      {/* Preview Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => window.open(url, "_blank")}
                        title="Preview file"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      
                      {/* Download Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = filename;
                          link.click();
                        }}
                        title="Download file"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      
                      {/* Delete Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:text-red-600"
                        onClick={() => handleDeleteFile(fieldName, url, index)}
                        title="Delete file"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (() => {
              const filename = extractFilename(jobDetails[fieldName]);
              const FileIcon = getFileIcon(filename);
              return (
                <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded border text-xs">
                  {/* File Icon */}
                  <FileIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  
                  {/* File Name */}
                  <span className="flex-1 truncate text-gray-700 dark:text-gray-300">
                    {filename}
                  </span>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    {/* Preview Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => window.open(jobDetails[fieldName], "_blank")}
                      title="Preview file"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    
                    {/* Download Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = jobDetails[fieldName];
                        link.download = filename;
                        link.click();
                      }}
                      title="Download file"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    
                    {/* Delete Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:text-red-600"
                      onClick={() => handleDeleteFile(fieldName, jobDetails[fieldName])}
                      title="Delete file"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          {/* Smart Link button */}
          {smartLinkKey && smartLinks[smartLinkKey] && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => window.open(smartLinks[smartLinkKey], "_blank")}
              title={smartLinkLabels[smartLinkKey]}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}

          {/* Upload button */}
          <input
            ref={fileInputRef}
            type="file"
            multiple={isMultiple}
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => {
              if (isMultiple && e.target.files) {
                handleMultipleFileUpload(e.target.files, fieldName);
              } else if (e.target.files?.[0]) {
                handleFileUpload(e.target.files[0], fieldName);
              }
            }}
          />
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-3"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            title={hasFile ? "Add more files" : "Upload file"}
          >
            <Upload className={`h-4 w-4 mr-1 ${isUploading ? "animate-pulse" : ""}`} />
            {hasFile ? "Add" : "Upload"}
          </Button>
        </div>

        {/* Compact drag & drop hint */}
        {!hasFile && !isDragging && (
          <p className="text-xs text-gray-400 mt-2">
            Drag or click to upload
          </p>
        )}
        {isDragging && (
          <p className="text-xs text-blue-600 mt-2">Drop here</p>
        )}
      </div>
    );
  };

  return (
    <div className="w-full pb-32">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full border rounded-lg">
        <CollapsibleTrigger className={`${sectionTriggerStyle} flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800`}>
          <div className="flex items-center gap-2">
            {isOpen ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
            <SectionTitle title="Document Upload & Organization" />
          </div>
        </CollapsibleTrigger>

      <CollapsibleContent className={sectionContentStyle}>

            {/* Document Upload Grid - Compact 2 per row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Row 1: Legal Documents */}
              <DocumentUploadBox
                label="Land Title Certificate"
                fieldName="land_title_url"
                required
                smartLinkKey="land_title"
              />
              <DocumentUploadBox
                label="Survey Certificate/RPR"
                fieldName="survey_certificate_url"
                smartLinkKey="survey"
              />

              {/* Row 2: Assessment Documents */}
              <DocumentUploadBox
                label="Tax Assessment Notice"
                fieldName="tax_notice_url"
                smartLinkKey="tax_notice"
              />
              <DocumentUploadBox
                label="Aerial Photo"
                fieldName="aerial_photo_url"
                smartLinkKey="aerial"
              />

              {/* Row 3: Maps */}
              <DocumentUploadBox
                label="Zoning Map"
                fieldName="zoning_map_url"
                required
                smartLinkKey="zoning"
              />
              <DocumentUploadBox
                label="Flood Map"
                fieldName="flood_map_url"
                required
                smartLinkKey="flood"
              />

              {/* Row 4: Permits & Plans */}
              <DocumentUploadBox
                label="Building Permits"
                fieldName="building_permits_urls"
                smartLinkKey="permits"
                isMultiple={true}
              />
              <DocumentUploadBox
                label="Site Plan"
                fieldName="site_plan_url"
                smartLinkKey="site_plan"
              />
            </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default Section4Compact;
