import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionProps } from "./types";
import { toast } from "sonner";
import { Upload, Eye, Download, ExternalLink, Check, FileText, FileImage, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ensureDocumentsBucketExists } from "@/utils/storage";
import { getSmartLinks, smartLinkLabels } from "@/utils/smartLinks";

const Section4CompactIndependent: React.FC<SectionProps> = ({
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

  // Calculate document count
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
      const sanitizedFileName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${Date.now()}-${sanitizedFileName}`;
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
        [`${fieldName.replace("_url", "")}_uploaded_at`]: new Date().toISOString(),
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

  // Document upload box component with drag and drop
  const DocumentUploadBox = ({
    label,
    fieldName,
    required = false,
    smartLinkKey,
    isMultiple = false,
  }: {
    label: string;
    fieldName: string;
    required?: boolean;
    smartLinkKey?: string;
    isMultiple?: boolean;
  }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const documentUrl = jobDetails[fieldName as keyof typeof jobDetails] as string | undefined;
    const smartLink = smartLinkKey ? smartLinks[smartLinkKey as keyof typeof smartLinks] : null;
    
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(fieldName);
    };
    
    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(null);
    };
    
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(null);
      
      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFileUpload(file, fieldName);
      }
    };
    
    return (
      <div 
        className={`border-2 border-dashed rounded-lg p-4 transition-all ${
          dragActive === fieldName ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
        } ${documentUrl ? 'bg-green-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex justify-between items-start mb-2">
          <label className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFileUpload(file, fieldName);
            }
          }}
          accept={isMultiple ? "*" : ".pdf,.jpg,.jpeg,.png"}
          multiple={isMultiple}
          className="hidden"
        />
        
        {!documentUrl ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="text-center py-8 cursor-pointer hover:bg-gray-100 rounded transition-colors"
          >
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              {uploading === fieldName ? "Uploading..." : "Drag and drop or click to upload"}
            </p>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={!!uploading}
              className="flex-1"
            >
              <Upload className="h-3 w-3 mr-1" />
              {uploading === fieldName ? "Uploading..." : "Replace"}
            </Button>
            
            <Button size="sm" variant="outline" onClick={() => window.open(documentUrl, '_blank')}>
              <Eye className="h-3 w-3" />
            </Button>
            
            {smartLink && (
              <Button size="sm" variant="outline" onClick={() => window.open(smartLink, '_blank')}>
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  // COMPLETELY INDEPENDENT COMPONENT
  return (
    <div className="w-full border rounded-lg bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b"
      >
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="text-base font-medium">4. Document Upload & Organization</span>
        </div>
        {uploadedCount > 0 && (
          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
        )}
      </button>
      
      {isOpen && (
        <div className="px-6 py-4">
          {/* Test Data Button */}
          <div className="flex justify-end mb-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={fillTestData}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Fill Test Data
            </Button>
          </div>

          {/* Document Upload Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
        </div>
      )}
    </div>
  );
};

export default Section4CompactIndependent;