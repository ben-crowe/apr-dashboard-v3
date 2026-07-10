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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionProps } from "./types";
import { sendToValcre } from "@/utils/webhooks";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isValcreJobNumber } from "@/config/valcre";
const OrganizingDocsSection: React.FC<SectionProps> = ({
  job,
  jobDetails = {},
  onUpdateDetails,
  forceOpen = null
}) => {
  const [isSectionSaving, setIsSectionSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // closed by default (first two sections open)
  // Expand/collapse-all from the accordion header.
  useEffect(() => { if (forceOpen) setIsOpen(forceOpen.open); }, [forceOpen]);
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
          (isValcreJobNumber(jobDetails?.jobNumber) && (jobDetails as any)?.valcreJobId) && toast.error(`Failed to save ${fieldName}`);
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
        (isValcreJobNumber(jobDetails?.jobNumber) && (jobDetails as any)?.valcreJobId) && toast.error(`Failed to save ${fieldName}`);
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

  const handleSelectChange = (value: string, name: string) => {
    if (onUpdateDetails) {
      onUpdateDetails({ [name]: value });
    }
    autoSaveField(name, value);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full border border-gray-400 dark:border-white/20 rounded-lg dark:bg-black/15">
      <CollapsibleTrigger className={`${sectionTriggerStyle} flex items-center justify-between w-full px-4 py-3 bg-gray-200 dark:bg-gray-800 rounded-t-lg`}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            <SectionTitle title="Building Information & Client Documents" />
          </div>
          {isSectionSaving && (
            <Loader2 className="h-4 w-4 text-gray-400 dark:text-muted-foreground animate-spin mr-2" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className={sectionContentStyle}>
        {/* Building Information Section */}
        <SectionGroup title="Building Information">
          {/* Inner Test Data button removed 2026-06-10 — the global top "Fill Test Data" (JobDetailAccordion) fills all sections. */}
          
          <TwoColumnFields>
            <CompactField label="Year Built">
              <Input
                id="yearBuilt"
                name="yearBuilt"
                type="text" inputMode="numeric"
                min={1800}
                max={2099}
                maxLength={4}
                placeholder="yyyy"
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
                type="text" inputMode="numeric"
                min={0}
                placeholder="sq ft"
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
                type="text" inputMode="numeric"
                placeholder="Units"
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
                type="text" inputMode="numeric"
                placeholder="Spaces"
                value={jobDetails.parkingSpaces || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className="h-7 text-sm max-w-[200px]"
              />
            </CompactField>

            {/* Tenancy MOVED to Section 2 (LoeQuoteSection, Value Scenarios & Approaches) 2026-06-10 migration. */}

            <CompactField label="State of Improvements">
              <Select value={jobDetails.stateOfImprovements || ''} onValueChange={value => handleSelectChange(value, 'stateOfImprovements')}>
                <SelectTrigger className="h-7 text-sm max-w-[200px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Proposed">Proposed</SelectItem>
                  <SelectItem value="Under Construction">Under Construction</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>

            {/* Status of Improvements REMOVED (duplicate) 2026-06-10 — the wired copy lives in Section 2
                (LoeQuoteSection Cascade Options). Property Subtype MOVED to Section 2 (Value Scenarios &
                Approaches). Same jobDetails keys + handlers; no sync changed. */}

            <CompactField label="Land Metric">
              <Select value={jobDetails.landMetric || ''} onValueChange={value => handleSelectChange(value, 'landMetric')}>
                <SelectTrigger className="h-7 text-sm max-w-[200px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Square Feet">Square Feet</SelectItem>
                  <SelectItem value="Acres">Acres</SelectItem>
                  <SelectItem value="Hectares">Hectares</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>

            <CompactField label="Env. Assessment">
              <Input
                id="environmentalAssessment"
                name="environmentalAssessment"
                value={jobDetails.environmentalAssessment || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder=""
                className="h-7 text-sm max-w-[200px]"
              />
            </CompactField>

            <CompactField label="Heritage / Conserv.">
              <Input
                id="heritageConservation"
                name="heritageConservation"
                value={jobDetails.heritageConservation || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder=""
                className="h-7 text-sm max-w-[200px]"
              />
            </CompactField>
          </TwoColumnFields>
        </SectionGroup>
        
        {/* Legal Description Section */}
        <SectionGroup title="Legal Description">
          <TwoColumnFields>
            <CompactField label="Description" fullWidth className="mt-2">
              <Input
                id="legalDescription"
                name="legalDescription"
                value={jobDetails.legalDescription || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className="h-7 text-sm w-full !border-0 !rounded-none bg-transparent !px-0 !shadow-none"
              />
            </CompactField>
          </TwoColumnFields>
        </SectionGroup>
      </CollapsibleContent>
    </Collapsible>
  );
};
export default OrganizingDocsSection;