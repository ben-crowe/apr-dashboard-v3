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

  const handleSelectChange = (value: string, name: string) => {
    if (onUpdateDetails) {
      onUpdateDetails({ [name]: value });
    }
    autoSaveField(name, value);
  };

  // Fill test data for Section 3A
  const fillTestData = () => {
    if (!onUpdateDetails) return;
    
    const testData = {
      yearBuilt: '1998',
      buildingSize: '25000',
      numberOfUnits: 24,
      parkingSpaces: 48,
      tenancy: 'Multi-Tenant',
      stateOfImprovements: 'Complete',
      statusOfImprovements: 'As Is',
      propertySubtype: 'Mid-Rise',
      landMetric: 'Acres',
      environmentalAssessment: 'Phase I ESA completed 2024 — no concerns identified',
      heritageConservation: 'No heritage designation',
      legalDescription: 'Lot 15, Block 3, Plan 1234, City of Calgary, Province of Alberta'
    };
    
    onUpdateDetails(testData);
    toast.success('Test data populated for Section 3A!');
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full border border-gray-400 dark:border-white/20 rounded-lg dark:bg-black/15">
      <CollapsibleTrigger className={`${sectionTriggerStyle} flex items-center justify-between w-full px-4 py-3 bg-gray-200 dark:bg-gray-800 rounded-t-lg`}>
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
                type="number"
                min={1800}
                max={2099}
                maxLength={4}
                placeholder="e.g. 2005"
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
                type="number"
                min={0}
                placeholder="e.g. 25000"
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

            <CompactField label="Tenancy">
              <Select value={jobDetails.tenancy || ''} onValueChange={value => handleSelectChange(value, 'tenancy')}>
                <SelectTrigger className="h-7 text-sm max-w-[200px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Owner-Occupied">Owner-Occupied</SelectItem>
                  <SelectItem value="Single-Tenant">Single-Tenant</SelectItem>
                  <SelectItem value="Multi-Tenant">Multi-Tenant</SelectItem>
                  <SelectItem value="Vacant">Vacant</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>

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

            <CompactField label="Status of Improvements">
              <Select value={jobDetails.statusOfImprovements || ''} onValueChange={value => handleSelectChange(value, 'statusOfImprovements')}>
                <SelectTrigger className="h-7 text-sm max-w-[200px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="As Is">As Is</SelectItem>
                  <SelectItem value="As Complete">As Complete</SelectItem>
                  <SelectItem value="As Stabilized">As Stabilized</SelectItem>
                  <SelectItem value="As Proposed">As Proposed</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>

            <CompactField label="Property Subtype">
              <Select value={jobDetails.propertySubtype || ''} onValueChange={value => handleSelectChange(value, 'propertySubtype')}>
                <SelectTrigger className="h-7 text-sm max-w-[200px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low-Rise">Low-Rise</SelectItem>
                  <SelectItem value="Mid-Rise">Mid-Rise</SelectItem>
                  <SelectItem value="High-Rise">High-Rise</SelectItem>
                  <SelectItem value="Garden">Garden</SelectItem>
                  <SelectItem value="Walk-Up">Walk-Up</SelectItem>
                  <SelectItem value="Townhouse">Townhouse</SelectItem>
                  <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>

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

            <CompactField label="Environmental Assessment">
              <Input
                id="environmentalAssessment"
                name="environmentalAssessment"
                value={jobDetails.environmentalAssessment || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="EA reference..."
                className="h-7 text-sm max-w-[200px]"
              />
            </CompactField>

            <CompactField label="Heritage / Conservation">
              <Input
                id="heritageConservation"
                name="heritageConservation"
                value={jobDetails.heritageConservation || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="HC designation..."
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