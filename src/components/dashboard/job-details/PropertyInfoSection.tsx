import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SectionProps } from "./types";
import { sendToValcre } from "@/utils/webhooks";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { SectionTitle, sectionTriggerStyle, sectionContentStyle, FieldRow, SectionGroup, TwoColumnFields, CompactField } from "./ValcreStyles";

const PropertyInfoSection: React.FC<SectionProps> = ({
  job,
  jobDetails = {},
  onUpdateDetails
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // Default to open

  // Format number with commas (e.g., 3000 -> 3,000)
  const formatNumber = (value: string | number): string => {
    if (!value) return '';
    const numericValue = String(value).replace(/[^0-9.]/g, '');
    const parts = numericValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  // Format currency with $ and commas (e.g., 3000 -> $3,000)
  const formatCurrency = (value: string | number): string => {
    if (!value) return '';
    return `$${formatNumber(value)}`;
  };

  // Strip formatting from string (e.g., "$3,000.00" -> "3000.00")
  const unformatNumber = (value: string): string => {
    return value.replace(/[^0-9.]/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onUpdateDetails) return;
    const {
      name,
      value,
      type
    } = e.target;
    let processedValue: string | number = value;

    // Convert numeric values - strip formatting first
    if (type === 'number' && value !== '') {
      processedValue = parseFloat(unformatNumber(value));
    }
    onUpdateDetails({
      [name]: processedValue
    });
  };

  // Handle currency field changes
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onUpdateDetails) return;
    const rawValue = unformatNumber(e.target.value);
    onUpdateDetails({
      [e.target.name]: rawValue ? parseFloat(rawValue) : 0
    });
  };

  // Handle number field changes (SF fields)
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onUpdateDetails) return;
    const rawValue = unformatNumber(e.target.value);
    onUpdateDetails({
      [e.target.name]: rawValue ? parseFloat(rawValue) : 0
    });
  };

  // Fill test data for Section 3B
  const fillTestData = () => {
    if (!onUpdateDetails) return;
    
    const testData = {
      // Property Site
      zoningClassification: 'Commercial Mixed-Use',
      zoneAbbreviation: 'C-2',
      landUseDesignation: 'Mixed Residential/Commercial',
      floodZone: 'Zone X',
      utilities: 'All public utilities available',
      // Parcels Summary
      parcelNumber: '123-456-789',
      grossBuildingAreaSf: 185908,
      netRentableAreaSf: 145394,
      yearBuilt: 2027,
      usableLandSf: 15000,
      grossLandSf: 18500,
      // Assessments & Taxes
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
      // Prepare property research data for Valcre
      const propertyData = {
        jobId: jobDetails.valcreJobId,
        jobNumber: jobDetails.jobNumber,
        updateType: 'property_research',
        // Property Site data
        zoningClassification: jobDetails.zoningClassification || '',
        zoneAbbreviation: jobDetails.zoneAbbreviation || '',
        landUseDesignation: jobDetails.landUseDesignation || '',
        floodZone: jobDetails.floodZone || '',
        utilities: jobDetails.utilities || '',
        // Parcels Summary
        parcelNumber: jobDetails.parcelNumber || '',
        grossBuildingAreaSf: jobDetails.grossBuildingAreaSf || 0,
        netRentableAreaSf: jobDetails.netRentableAreaSf || 0,
        yearBuilt: jobDetails.yearBuilt || '',
        usableLandSf: jobDetails.usableLandSf || 0,
        grossLandSf: jobDetails.grossLandSf || 0,
        // Assessments & Taxes
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
            <div>✅ Property data synced to Valcre!</div>
            <div className="text-xs mt-1">Job: {jobDetails.jobNumber}</div>
          </div>
        );
        
        // Update sync timestamp
        await supabase
          .from('job_loe_details')
          .update({
            last_property_sync_at: new Date().toISOString()
          })
          .eq('job_id', job.id);
          
      } else {
        toast.error(result.error || 'Failed to sync property data');
      }
    } catch (error: any) {
      console.error('Error syncing to Valcre:', error);
      toast.error('Failed to sync property data to Valcre');
    } finally {
      setIsSyncing(false);
    }
  };

  return <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full border rounded-lg">
      <CollapsibleTrigger className={`${sectionTriggerStyle} flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800`}>
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
          <SectionTitle title="Data Gathering - Property Research" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className={sectionContentStyle}>
          {/* Action Buttons Row - Compact */}
          <div className="mb-4 flex justify-start gap-2">
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

          {/* Property Site Section */}
          <SectionGroup title="Property Site">
            <TwoColumnFields>
              <CompactField label="Zoning">
                <Input id="zoningClassification" name="zoningClassification" value={jobDetails.zoningClassification || ''} onChange={handleChange} className="h-7 text-sm max-w-[200px]" />
              </CompactField>
              <CompactField label="Zone Code">
                <Input id="zoneAbbreviation" name="zoneAbbreviation" value={jobDetails.zoneAbbreviation || ''} onChange={handleChange} className="h-7 text-sm max-w-[200px]" />
              </CompactField>
              <CompactField label="Land Use">
                <Input id="landUseDesignation" name="landUseDesignation" value={jobDetails.landUseDesignation || ''} onChange={handleChange} className="h-7 text-sm max-w-[200px]" />
              </CompactField>
              <CompactField label="Flood Zone">
                <Input id="floodZone" name="floodZone" value={jobDetails.floodZone || ''} onChange={handleChange} className="h-7 text-sm max-w-[200px]" />
              </CompactField>
              <CompactField label="Utilities">
                <Input id="utilities" name="utilities" value={jobDetails.utilities || ''} onChange={handleChange} className="h-7 text-sm max-w-[200px]" />
              </CompactField>
            </TwoColumnFields>
          </SectionGroup>

          {/* Parcels Summary Section */}
          <SectionGroup title="Parcels Summary">
            <TwoColumnFields>
              <CompactField label="Parcel Number">
                <Input id="parcelNumber" name="parcelNumber" value={jobDetails.parcelNumber || ''} onChange={handleChange} className="h-7 text-sm max-w-[200px]" />
              </CompactField>
              <CompactField label="Gross Building Area (SF)">
                <Input id="grossBuildingAreaSf" name="grossBuildingAreaSf" type="text" value={formatNumber(jobDetails.grossBuildingAreaSf || '')} onChange={handleNumberChange} className="h-7 text-sm max-w-[200px]" />
              </CompactField>
              <CompactField label="Net Rentable Area (SF)">
                <Input id="netRentableAreaSf" name="netRentableAreaSf" type="text" value={formatNumber(jobDetails.netRentableAreaSf || '')} onChange={handleNumberChange} className="h-7 text-sm max-w-[200px]" />
              </CompactField>
              <CompactField label="Year Built">
                <Input id="yearBuilt" name="yearBuilt" type="number" value={jobDetails.yearBuilt || ''} onChange={handleChange} className="h-7 text-sm max-w-[200px]" />
              </CompactField>
              <CompactField label="Buildable Land (SF)">
                <Input id="usableLandSf" name="usableLandSf" type="text" value={formatNumber(jobDetails.usableLandSf || '')} onChange={handleNumberChange} className="h-7 text-sm max-w-[200px]" />
              </CompactField>
              <CompactField label="Total Site Area (SF)">
                <Input id="grossLandSf" name="grossLandSf" type="text" value={formatNumber(jobDetails.grossLandSf || '')} onChange={handleNumberChange} className="h-7 text-sm max-w-[200px]" />
              </CompactField>
              <CompactField label="Assessed Value">
                <Input id="assessedValue" name="assessedValue" type="text" value={formatCurrency(jobDetails.assessedValue || '')} onChange={handleCurrencyChange} className="h-7 text-sm max-w-[200px]" />
              </CompactField>
              <CompactField label="Taxes">
                <Input id="taxes" name="taxes" type="text" value={formatCurrency(jobDetails.taxes || '')} onChange={handleCurrencyChange} className="h-7 text-sm max-w-[200px]" />
              </CompactField>
            </TwoColumnFields>
          </SectionGroup>

          {/* Assessments & Taxes Section */}
          <SectionGroup title="Assessments & Taxes">
            <TwoColumnFields>
              <CompactField label="Assessment Year">
                <Input id="assessmentYear" name="assessmentYear" value={jobDetails.assessmentYear || ''} onChange={handleChange} className="h-7 text-sm max-w-[200px]" />
              </CompactField>
              <CompactField label="Land Value">
                <Input id="landAssessmentValue" name="landAssessmentValue" type="text" value={formatCurrency(jobDetails.landAssessmentValue || '')} onChange={handleCurrencyChange} className="h-7 text-sm max-w-[200px]" />
              </CompactField>
              <CompactField label="Land Split *">
                <Input id="assessment_split_land_value" name="assessment_split_land_value" type="text" value={formatCurrency(jobDetails.assessment_split_land_value || '')} onChange={handleCurrencyChange} className="h-7 text-sm max-w-[200px]" />
              </CompactField>
              <CompactField label="Improved Value">
                <Input id="improvedAssessmentValue" name="improvedAssessmentValue" type="text" value={formatCurrency(jobDetails.improvedAssessmentValue || '')} onChange={handleCurrencyChange} className="h-7 text-sm max-w-[200px]" />
              </CompactField>
              <CompactField label="Total Value">
                <Input id="totalAssessmentValue" name="totalAssessmentValue" type="text" value={formatCurrency(jobDetails.totalAssessmentValue || '')} onChange={handleCurrencyChange} className="h-7 text-sm max-w-[200px]" />
              </CompactField>
              <CompactField label="Building Split *">
                <Input id="assessment_split_building_value" name="assessment_split_building_value" type="text" value={formatCurrency(jobDetails.assessment_split_building_value || '')} onChange={handleCurrencyChange} className="h-7 text-sm max-w-[200px]" />
              </CompactField>
            </TwoColumnFields>
          </SectionGroup>
      </CollapsibleContent>
    </Collapsible>;
};
export default PropertyInfoSection;