import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SectionTitle, sectionTriggerStyle, sectionContentStyle, FieldRow, SectionGroup, TwoColumnFields, CompactField } from "./ValcreStyles";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SectionProps } from "./types";
import { sendToValcre } from "@/utils/webhooks";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
const OrganizingDocsSection: React.FC<SectionProps> = ({
  job,
  jobDetails = {},
  onUpdateDetails
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!onUpdateDetails) return;
    const {
      name,
      value,
      type
    } = e.target;
    let processedValue: string | number = value;

    // Convert numeric values
    if (type === 'number' && value !== '') {
      processedValue = parseFloat(value);
    }
    onUpdateDetails({
      [name]: processedValue
    });
  };

  // Fill test data for Section 3A
  const fillTestData = () => {
    if (!onUpdateDetails) return;
    
    const testData = {
      yearBuilt: '1998',
      buildingSize: '25000',
      numberOfUnits: 24,
      parkingSpaces: 48,
      legalDescription: 'Lot 15, Block 3, Plan 1234, City of Calgary, Province of Alberta'
    };
    
    onUpdateDetails(testData);
    toast.success('Test data populated for Section 3A!');
  };

  const handleSyncToValcre = async () => {
    if (!job || !jobDetails?.valcreJobId) return;
    
    setIsSyncing(true);
    
    try {
      // Prepare building/docs data for Valcre
      const buildingData = {
        jobId: jobDetails.valcreJobId,
        jobNumber: jobDetails.jobNumber,
        updateType: 'building_info',
        // Building information from Section 3a
        yearBuilt: jobDetails.yearBuilt || '',
        buildingSize: jobDetails.buildingSize || '',
        numberOfUnits: jobDetails.numberOfUnits || 0,
        parkingSpaces: jobDetails.parkingSpaces || 0,
        legalDescription: jobDetails.legalDescription || '',
        timestamp: new Date().toISOString(),
      };
      
      console.log('Syncing building info to Valcre:', buildingData);
      const result = await sendToValcre(buildingData);
      
      if (result.success) {
        toast.success(
          <div>
            <div>✅ Building info synced to Valcre!</div>
            <div className="text-xs mt-1">Job: {jobDetails.jobNumber}</div>
          </div>
        );
        
        // Update sync timestamp
        await supabase
          .from('job_loe_details')
          .update({
            last_building_sync_at: new Date().toISOString()
          })
          .eq('job_id', job.id);
          
      } else {
        toast.error(result.error || 'Failed to sync building info');
      }
    } catch (error: any) {
      console.error('Error syncing to Valcre:', error);
      toast.error('Failed to sync building info to Valcre');
    } finally {
      setIsSyncing(false);
    }
  };
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full border rounded-lg">
      <CollapsibleTrigger className={`${sectionTriggerStyle} flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800`}>
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
          <SectionTitle title="Building Information & Client Documents" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className={sectionContentStyle}>
        {/* Building Information Section */}
        <SectionGroup title="Building Information">
          {/* Action Buttons Row */}
          <div className="mb-4 flex justify-between">
            <div>
              {/* Sync Button - Only show when job exists */}
              {jobDetails?.jobNumber && jobDetails.jobNumber.toString().startsWith('VAL') && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSyncToValcre}
                  disabled={isSyncing}
                  className="border-green-600 text-green-700 hover:bg-green-50"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Sync to Valcre
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Test Data Button */}
            <button
              type="button"
              onClick={fillTestData}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
              title="Fill test data for development"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span>Test Data</span>
            </button>
          </div>
          
          <TwoColumnFields>
            <CompactField label="Year Built">
              <Input
                id="yearBuilt"
                name="yearBuilt"
                value={jobDetails.yearBuilt || ''}
                onChange={handleChange}
                className="h-7 text-sm max-w-[200px]"
              />
            </CompactField>

            <CompactField label="Building Size (SF)">
              <Input
                id="buildingSize"
                name="buildingSize"
                value={jobDetails.buildingSize || ''}
                onChange={handleChange}
                className="h-7 text-sm max-w-[200px]"
              />
            </CompactField>

            <CompactField label="Number of Units">
              <Input
                id="numberOfUnits"
                name="numberOfUnits"
                type="number"
                value={jobDetails.numberOfUnits || ''}
                onChange={handleChange}
                className="h-7 text-sm max-w-[200px]"
              />
            </CompactField>

            <CompactField label="Parking Spaces">
              <Input
                id="parkingSpaces"
                name="parkingSpaces"
                type="number"
                value={jobDetails.parkingSpaces || ''}
                onChange={handleChange}
                className="h-7 text-sm max-w-[200px]"
              />
            </CompactField>
          </TwoColumnFields>
        </SectionGroup>
        
        {/* Legal Description Section */}
        <SectionGroup title="Legal Description">
          <TwoColumnFields>
            <CompactField label="Description" fullWidth>
              <Textarea
                id="legalDescription"
                name="legalDescription"
                value={jobDetails.legalDescription || ''}
                onChange={handleChange}
                rows={3}
                className="resize-none text-sm w-full"
              />
            </CompactField>
          </TwoColumnFields>
        </SectionGroup>
      </CollapsibleContent>
    </Collapsible>
  );
};
export default OrganizingDocsSection;