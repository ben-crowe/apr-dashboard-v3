import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionProps } from "./types";
import { toast } from "sonner";
import { CheckCircle, FolderOpen, Loader2, RefreshCw } from "lucide-react";
import { SectionGroup, CompactField, TwoColumnFields } from "./ValcreStyles";
import { supabase } from "@/integrations/supabase/client";
import { sendToValcre } from "@/utils/webhooks";

const OrganizingDocsSectionIndependent: React.FC<SectionProps> = ({
  job,
  jobDetails = {},
  onUpdateDetails,
}) => {
  const [isCreatingGoogle, setIsCreatingGoogle] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // Default to open
  
  const handleCreateGoogleFolder = async () => {
    if (!job || !jobDetails?.jobNumber) {
      toast.error("Please create a job number first (in Section 2)");
      return;
    }
    
    setIsCreatingGoogle(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-google-folder', {
        body: {
          jobNumber: jobDetails.jobNumber,
          propertyAddress: job.propertyAddress,
          clientName: `${job.firstName} ${job.lastName}`,
        },
      });
      
      if (error) throw error;
      
      if (data?.success && data?.folderUrl) {
        if (onUpdateDetails) {
          onUpdateDetails({
            googleFolderUrl: data.folderUrl,
            googleFolderCreated: true,
            googleFolderCreatedAt: new Date().toISOString(),
          });
        }
        
        toast.success(
          <div>
            <div>✅ Google folder created!</div>
            <a 
              href={data.folderUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              Open folder →
            </a>
          </div>
        );
      }
    } catch (error) {
      console.error('Error creating Google folder:', error);
      toast.error('Failed to create Google folder');
    } finally {
      setIsCreatingGoogle(false);
    }
  };

  const handleSyncOrganizingToValcre = async () => {
    if (!jobDetails?.valcreJobId) {
      toast.error("Please create a Valcre job first (in Section 2)");
      return;
    }
    
    setIsSyncing(true);
    
    try {
      const organizingData = {
        jobId: jobDetails.valcreJobId,
        jobNumber: jobDetails.jobNumber,
        updateType: 'organizing_docs',
        compReportUrl: jobDetails.compReportUrl || '',
        compAppraisalReportUrl: jobDetails.compAppraisalReportUrl || '',
        comparableSalesMapUrl: jobDetails.comparableSalesMapUrl || '',
        siteImprovementsMapUrl: jobDetails.siteImprovementsMapUrl || '',
        comparableRentalsMapUrl: jobDetails.comparableRentalsMapUrl || '',
        googleFolderUrl: jobDetails.googleFolderUrl || '',
        organizingNotes: jobDetails.organizingNotes || '',
        timestamp: new Date().toISOString(),
      };
      
      console.log('Syncing organizing docs to Valcre:', organizingData);
      const result = await sendToValcre(organizingData);
      
      if (result.success) {
        toast.success(
          <div>
            <div>✅ Organizing docs synced to Valcre!</div>
            <div className="text-xs mt-1">Job: {jobDetails.jobNumber}</div>
          </div>
        );
        
        if (onUpdateDetails) {
          onUpdateDetails({
            lastOrganizingSync: new Date().toISOString(),
          });
        }
      } else {
        toast.error(result.error || 'Failed to sync organizing docs');
      }
    } catch (error) {
      console.error('Error syncing to Valcre:', error);
      toast.error('Failed to sync organizing docs to Valcre');
    } finally {
      setIsSyncing(false);
    }
  };

  const fillTestData = () => {
    if (!onUpdateDetails) return;
    
    const testData = {
      compReportUrl: 'https://example.com/comp-report.pdf',
      compAppraisalReportUrl: 'https://example.com/comp-appraisal.pdf',
      comparableSalesMapUrl: 'https://example.com/sales-map.png',
      siteImprovementsMapUrl: 'https://example.com/improvements-map.png',
      comparableRentalsMapUrl: 'https://example.com/rentals-map.png',
      organizingNotes: 'Test notes for organizing documentation',
      googleFolderUrl: 'https://drive.google.com/drive/folders/test',
      googleFolderCreated: true,
    };
    
    onUpdateDetails(testData);
    toast.success('Organizing docs test data filled!');
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (onUpdateDetails) {
      onUpdateDetails({ [name]: value });
    }
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
          <span className="text-base font-medium">3a. Organizing Docs</span>
        </div>
        {jobDetails.googleFolderCreated && (
          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
        )}
      </button>
      
      {isOpen && (
        <div className="px-6 py-4">
          {/* Action Buttons Row */}
          <div className="mb-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCreateGoogleFolder}
              disabled={isCreatingGoogle || !jobDetails?.jobNumber}
              className="border-blue-600 text-blue-700 hover:bg-blue-50"
            >
              {isCreatingGoogle ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FolderOpen className="mr-2 h-3 w-3" />
                  Create Google Folder
                </>
              )}
            </Button>
            
            {jobDetails?.jobNumber && jobDetails.jobNumber.toString().startsWith('CAL') && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSyncOrganizingToValcre}
                disabled={isSyncing}
                className="border-green-600 text-green-700 hover:bg-green-50"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-3 w-3" />
                    Sync to Valcre
                  </>
                )}
              </Button>
            )}
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={fillTestData}
              className="text-gray-600"
            >
              Fill Test Data
            </Button>
          </div>

          {/* Google Folder Status */}
          {jobDetails.googleFolderUrl && (
            <SectionGroup title="Google Folder">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <a 
                  href={jobDetails.googleFolderUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Open Google Folder →
                </a>
              </div>
            </SectionGroup>
          )}

          {/* Document URLs Section */}
          <SectionGroup title="Document Links">
            <CompactField label="Comp Report URL">
              <Input
                name="compReportUrl"
                value={jobDetails.compReportUrl || ''}
                onChange={handleChange}
                placeholder="Enter URL or leave blank"
                className="h-7 text-sm"
              />
            </CompactField>
            
            <CompactField label="Comp Appraisal Report URL">
              <Input
                name="compAppraisalReportUrl"
                value={jobDetails.compAppraisalReportUrl || ''}
                onChange={handleChange}
                placeholder="Enter URL or leave blank"
                className="h-7 text-sm"
              />
            </CompactField>
            
            <TwoColumnFields>
              <CompactField label="Sales Map URL">
                <Input
                  name="comparableSalesMapUrl"
                  value={jobDetails.comparableSalesMapUrl || ''}
                  onChange={handleChange}
                  placeholder="Enter URL"
                  className="h-7 text-sm"
                />
              </CompactField>
              
              <CompactField label="Improvements Map URL">
                <Input
                  name="siteImprovementsMapUrl"
                  value={jobDetails.siteImprovementsMapUrl || ''}
                  onChange={handleChange}
                  placeholder="Enter URL"
                  className="h-7 text-sm"
                />
              </CompactField>
            </TwoColumnFields>
            
            <CompactField label="Comparable Rentals Map URL">
              <Input
                name="comparableRentalsMapUrl"
                value={jobDetails.comparableRentalsMapUrl || ''}
                onChange={handleChange}
                placeholder="Enter URL or leave blank"
                className="h-7 text-sm"
              />
            </CompactField>
          </SectionGroup>

          {/* Organizing Notes */}
          <SectionGroup title="Organizing Notes">
            <Textarea
              name="organizingNotes"
              value={jobDetails.organizingNotes || ''}
              onChange={handleChange}
              placeholder="Notes about document organization..."
              className="min-h-[80px] text-sm"
            />
          </SectionGroup>
        </div>
      )}
    </div>
  );
};

export default OrganizingDocsSectionIndependent;