import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SectionTitle, sectionTriggerStyle, sectionContentStyle, FieldRow, SectionGroup, TwoColumnFields, CompactField } from "./ValcreStyles";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionProps } from "./types";
import { sendToValcre } from "@/utils/webhooks";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isValcreJobNumber } from "@/config/valcre";
const OrganizingDocsSection: React.FC<SectionProps> = ({
  job,
  jobDetails = {},
  onUpdateDetails
}) => {
  const [isSectionSaving, setIsSectionSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [fieldStates, setFieldStates] = useState<Record<string, 'idle' | 'saving'>>({});
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});

  // Fields that sync to Valcre
  const VALCRE_SYNC_FIELDS = ['yearBuilt', 'buildingSize', 'numberOfUnits', 'parkingSpaces', 'legalDescription'];
  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(timer => clearTimeout(timer));
    };
  }, []);

  // Auto-save function
  const autoSaveField = useCallback(async (fieldName: string, value: any) => {
    if (!job || !onUpdateDetails) return;

    if (debounceTimers.current[fieldName]) {
      clearTimeout(debounceTimers.current[fieldName]);
    }

    debounceTimers.current[fieldName] = setTimeout(async () => {
      setFieldStates(prev => ({ ...prev, [fieldName]: 'saving' }));
      setIsSectionSaving(true);

      try {
        // Always save to Supabase first
        const { error: supabaseError } = await supabase
          .from('job_loe_details')
          .upsert({
            job_id: job.id,
            [fieldName]: value,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'job_id'
          });

        if (supabaseError) {
          console.error('Supabase save error:', supabaseError);
          toast.error(`Failed to save ${fieldName}`);
          setFieldStates(prev => ({ ...prev, [fieldName]: 'idle' }));
          setIsSectionSaving(false);
          return;
        }

        // Check if this field should also sync to Valcre
        const shouldSyncToValcre = VALCRE_SYNC_FIELDS.includes(fieldName) &&
                                    isValcreJobNumber(jobDetails?.jobNumber) &&
                                    jobDetails?.valcreJobId;

        if (shouldSyncToValcre) {
          const syncData: any = {
            jobId: jobDetails.valcreJobId,
            jobNumber: jobDetails.jobNumber,
            updateType: 'building_info',
            timestamp: new Date().toISOString(),
            [fieldName]: value
          };

          console.log(`Syncing ${fieldName} to Valcre:`, syncData);
          const result = await sendToValcre(syncData);

          if (!result.success) {
            console.error('Valcre sync failed:', result.error);
          }
        }

        setFieldStates(prev => ({ ...prev, [fieldName]: 'idle' }));
        setIsSectionSaving(false);

      } catch (error: any) {
        console.error('Auto-save error:', error);
        toast.error(`Failed to save ${fieldName}`);
        setFieldStates(prev => ({ ...prev, [fieldName]: 'idle' }));
        setIsSectionSaving(false);
      }
    }, 500);
  }, [job, jobDetails, onUpdateDetails, VALCRE_SYNC_FIELDS]);

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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let processedValue: string | number = value;

    if (type === 'number' && value !== '') {
      processedValue = parseFloat(value);
    }

    autoSaveField(name, processedValue);
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

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full border rounded-lg">
      <CollapsibleTrigger className={`${sectionTriggerStyle} flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800`}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {isOpen ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
            <SectionTitle title="Building Information & Client Documents" />
          </div>
          {isSectionSaving && (
            <Loader2 className="h-4 w-4 text-gray-400 dark:text-gray-500 animate-spin mr-2" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className={sectionContentStyle}>
        {/* Building Information Section */}
        <SectionGroup title="Building Information">
          {/* Action Buttons Row */}
          <div className="mb-4 flex justify-end">
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
                onBlur={handleBlur}
                className="h-7 text-sm max-w-[200px]"
              />
            </CompactField>

            <CompactField label="Building Size (SF)">
              <Input
                id="buildingSize"
                name="buildingSize"
                value={jobDetails.buildingSize || ''}
                onChange={handleChange}
                onBlur={handleBlur}
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
                onBlur={handleBlur}
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
                onBlur={handleBlur}
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
                onBlur={handleBlur}
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