import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SectionProps } from "./types";
import { sendToValcre } from "@/utils/webhooks";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RefreshCw, ChevronDown, ChevronRight } from "lucide-react";
import { FieldRow, SectionGroup, TwoColumnFields, CompactField } from "./ValcreStyles";

const PropertyInfoSectionIndependent: React.FC<SectionProps> = ({
  job,
  jobDetails = {},
  onUpdateDetails
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // Default to open
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onUpdateDetails) return;
    const { name, value, type } = e.target;
    let processedValue: string | number = value;

    if (type === 'number' && value !== '') {
      processedValue = parseFloat(value);
    }
    onUpdateDetails({
      [name]: processedValue
    });
  };

  const fillTestData = () => {
    if (!onUpdateDetails) return;
    
    const testData = {
      zoningClassification: 'Commercial Mixed-Use',
      zoneAbbreviation: 'C-2',
      landUseDesignation: 'Mixed Residential/Commercial',
      floodZone: 'Zone X',
      utilities: 'All public utilities available',
      parcelNumber: '123-456-789',
      grossBuildingAreaSf: 185908,
      netRentableAreaSf: 145394,
      yearBuilt: 2027,
      usableLandSf: 15000,
      grossLandSf: 18500,
      assessmentYear: '2024',
      landAssessmentValue: 250000,
      improvedAssessmentValue: 600000,
      totalAssessmentValue: 850000,
      assessedValue: 850000,
      taxes: 12500
    };
    
    onUpdateDetails(testData);
    toast.success('Test data populated for Section 3B!');
  };

  const handleSyncToValcre = async () => {
    if (!job || !jobDetails?.valcreJobId) return;
    
    setIsSyncing(true);
    
    try {
      const propertyData = {
        jobId: jobDetails.valcreJobId,
        jobNumber: jobDetails.jobNumber,
        updateType: 'property_research',
        zoningClassification: jobDetails.zoningClassification || '',
        zoneAbbreviation: jobDetails.zoneAbbreviation || '',
        landUseDesignation: jobDetails.landUseDesignation || '',
        floodZone: jobDetails.floodZone || '',
        utilities: jobDetails.utilities || '',
        parcelNumber: jobDetails.parcelNumber || '',
        grossBuildingAreaSf: jobDetails.grossBuildingAreaSf || 0,
        netRentableAreaSf: jobDetails.netRentableAreaSf || 0,
        yearBuilt: jobDetails.yearBuilt || '',
        usableLandSf: jobDetails.usableLandSf || 0,
        grossLandSf: jobDetails.grossLandSf || 0,
        assessmentYear: jobDetails.assessmentYear || '',
        landAssessmentValue: jobDetails.landAssessmentValue || 0,
        improvedAssessmentValue: jobDetails.improvedAssessmentValue || 0,
        totalAssessmentValue: jobDetails.totalAssessmentValue || 0,
        assessedValue: jobDetails.assessedValue || 0,
        taxes: jobDetails.taxes || 0,
        timestamp: new Date().toISOString(),
      };
      
      console.log('Syncing property research to Valcre:', propertyData);
      const result = await sendToValcre(propertyData);
      
      if (result.success) {
        toast.success(
          <div>
            <div>✅ Property research synced to Valcre!</div>
            <div className="text-xs mt-1">Job: {jobDetails.jobNumber}</div>
          </div>
        );

        await supabase
          .from('job_loe_details')
          .update({
            last_property_sync_at: new Date().toISOString()
          })
          .eq('job_id', job.id);
          
      } else {
        toast.error(result.error || 'Failed to sync property research');
      }
    } catch (error: any) {
      console.error('Error syncing to Valcre:', error);
      toast.error('Failed to sync property research to Valcre');
    } finally {
      setIsSyncing(false);
    }
  };

  // COMPLETELY INDEPENDENT COMPONENT - NOT PART OF ACCORDION
  return (
    <div className="w-full border rounded-lg bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b"
      >
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="text-base font-medium">3b. Data Gathering - Property Research</span>
        </div>
      </button>
      
      {isOpen && (
        <div className="px-6 py-4">
          {/* Action Buttons Row */}
          <div className="mb-4 flex justify-end gap-2">
            {jobDetails?.jobNumber && jobDetails.jobNumber.toString().startsWith('CAL') && (
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

          {/* Property Site Section */}
          <SectionGroup title="Property Site">
            <TwoColumnFields>
              <CompactField label="Zoning Classification">
                <Input id="zoningClassification" name="zoningClassification" value={jobDetails.zoningClassification || ''} onChange={handleChange} placeholder="e.g., Commercial Mixed-Use" className="h-7 text-sm" />
              </CompactField>
              <CompactField label="Zone Abbreviation">
                <Input id="zoneAbbreviation" name="zoneAbbreviation" value={jobDetails.zoneAbbreviation || ''} onChange={handleChange} placeholder="e.g., C-2" className="h-7 text-sm max-w-[100px]" />
              </CompactField>
              <CompactField label="Land Use Designation">
                <Input id="landUseDesignation" name="landUseDesignation" value={jobDetails.landUseDesignation || ''} onChange={handleChange} placeholder="e.g., Mixed Residential/Commercial" className="h-7 text-sm" />
              </CompactField>
              <CompactField label="Flood Zone">
                <Input id="floodZone" name="floodZone" value={jobDetails.floodZone || ''} onChange={handleChange} placeholder="e.g., Zone X" className="h-7 text-sm max-w-[150px]" />
              </CompactField>
            </TwoColumnFields>
            <CompactField label="Utilities">
              <Input id="utilities" name="utilities" value={jobDetails.utilities || ''} onChange={handleChange} placeholder="e.g., All public utilities available" className="h-7 text-sm" />
            </CompactField>
          </SectionGroup>

          {/* Parcels Summary Section */}
          <SectionGroup title="Parcels Summary">
            <CompactField label="Parcel Number">
              <Input id="parcelNumber" name="parcelNumber" value={jobDetails.parcelNumber || ''} onChange={handleChange} placeholder="e.g., 123-456-789" className="h-7 text-sm" />
            </CompactField>
            <TwoColumnFields>
              <CompactField label="Gross Building Area (SF)">
                <Input id="grossBuildingAreaSf" name="grossBuildingAreaSf" type="number" value={jobDetails.grossBuildingAreaSf || ''} onChange={handleChange} placeholder="e.g., 185908" className="h-7 text-sm max-w-[150px]" />
              </CompactField>
              <CompactField label="Net Rentable Area (SF)">
                <Input id="netRentableAreaSf" name="netRentableAreaSf" type="number" value={jobDetails.netRentableAreaSf || ''} onChange={handleChange} placeholder="e.g., 145394" className="h-7 text-sm max-w-[150px]" />
              </CompactField>
              <CompactField label="Year Built">
                <Input id="yearBuilt" name="yearBuilt" type="number" value={jobDetails.yearBuilt || ''} onChange={handleChange} placeholder="e.g., 2027" className="h-7 text-sm max-w-[150px]" />
              </CompactField>
              <CompactField label="Buildable Land (SF)">
                <Input id="usableLandSf" name="usableLandSf" type="number" value={jobDetails.usableLandSf || ''} onChange={handleChange} placeholder="e.g., 15000" className="h-7 text-sm max-w-[150px]" />
              </CompactField>
              <CompactField label="Total Site Area (SF)">
                <Input id="grossLandSf" name="grossLandSf" type="number" value={jobDetails.grossLandSf || ''} onChange={handleChange} placeholder="e.g., 18500" className="h-7 text-sm max-w-[150px]" />
              </CompactField>
            </TwoColumnFields>
          </SectionGroup>

          {/* Assessments & Taxes Section */}
          <SectionGroup title="Assessments & Taxes">
            <TwoColumnFields>
              <CompactField label="Assessment Year">
                <Input id="assessmentYear" name="assessmentYear" value={jobDetails.assessmentYear || ''} onChange={handleChange} placeholder="e.g., 2024" className="h-7 text-sm max-w-[100px]" />
              </CompactField>
              <CompactField label="Taxes">
                <Input id="taxes" name="taxes" type="number" value={jobDetails.taxes || ''} onChange={handleChange} placeholder="e.g., 12500" className="h-7 text-sm max-w-[150px]" />
              </CompactField>
              <CompactField label="Land Assessment">
                <Input id="landAssessmentValue" name="landAssessmentValue" type="number" value={jobDetails.landAssessmentValue || ''} onChange={handleChange} placeholder="e.g., 250000" className="h-7 text-sm max-w-[150px]" />
              </CompactField>
              <CompactField label="Improved Assessment">
                <Input id="improvedAssessmentValue" name="improvedAssessmentValue" type="number" value={jobDetails.improvedAssessmentValue || ''} onChange={handleChange} placeholder="e.g., 600000" className="h-7 text-sm max-w-[150px]" />
              </CompactField>
              <CompactField label="Total Assessment">
                <Input id="totalAssessmentValue" name="totalAssessmentValue" type="number" value={jobDetails.totalAssessmentValue || ''} onChange={handleChange} placeholder="e.g., 850000" className="h-7 text-sm max-w-[150px]" />
              </CompactField>
              <CompactField label="Assessed Value">
                <Input id="assessedValue" name="assessedValue" type="number" value={jobDetails.assessedValue || ''} onChange={handleChange} placeholder="e.g., 850000" className="h-7 text-sm max-w-[150px]" />
              </CompactField>
            </TwoColumnFields>
            <TwoColumnFields>
              <CompactField label="Land Value Split">
                <Input id="assessment_split_land_value" name="assessment_split_land_value" type="number" value={jobDetails.assessment_split_land_value || ''} onChange={handleChange} placeholder="e.g., 250000" className="h-7 text-sm max-w-[200px]" />
              </CompactField>
              <CompactField label="Building Value Split">
                <Input id="assessment_split_building_value" name="assessment_split_building_value" type="number" value={jobDetails.assessment_split_building_value || ''} onChange={handleChange} placeholder="e.g., 750000" className="h-7 text-sm max-w-[200px]" />
              </CompactField>
            </TwoColumnFields>
          </SectionGroup>
        </div>
      )}
    </div>
  );
};

export default PropertyInfoSectionIndependent;