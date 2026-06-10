import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionProps } from "./types";
import { toast } from "sonner";
import { SectionTitle, sectionTriggerStyle, sectionContentStyle, FieldRow, SectionGroup, TwoColumnFields, CompactField } from "./ValcreStyles";

const PropertyInfoSection: React.FC<SectionProps> = ({
  job,
  jobDetails = {},
  onUpdateDetails
}) => {
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

  const handleSelectChange = (value: string, name: string) => {
    if (!onUpdateDetails) return;
    onUpdateDetails({ [name]: value });
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

  return <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full border border-gray-400 dark:border-white/20 rounded-lg dark:bg-black/15">
      <CollapsibleTrigger className={`${sectionTriggerStyle} flex items-center justify-between w-full px-4 py-3 bg-gray-200 dark:bg-gray-800 rounded-t-lg`}>
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          <SectionTitle title="Data Gathering - Property Research" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className={sectionContentStyle}>
          {/* Inner 'Test Data' button removed — global top 'Fill Test Data' (JobDetailAccordion) fills all sections. */}

          {/* Appraisal Assignment Section — VALTA fields */}
          <SectionGroup title="Appraisal Assignment">
            <TwoColumnFields>
              <CompactField label="Assignment Type">
                <Select value={jobDetails.assignmentType || ''} onValueChange={value => handleSelectChange(value, 'assignmentType')}>
                  <SelectTrigger className="h-7 text-sm max-w-[200px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Update">Update</SelectItem>
                    <SelectItem value="Retrospective">Retrospective</SelectItem>
                    <SelectItem value="Desktop">Desktop</SelectItem>
                  </SelectContent>
                </Select>
              </CompactField>

              <CompactField label="Desktop Report">
                <Select value={jobDetails.desktopReport || ''} onValueChange={value => handleSelectChange(value, 'desktopReport')}>
                  <SelectTrigger className="h-7 text-sm max-w-[200px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </CompactField>

              <CompactField label="Value Timeframe">
                <Select value={jobDetails.valueTimeframe || ''} onValueChange={value => handleSelectChange(value, 'valueTimeframe')}>
                  <SelectTrigger className="h-7 text-sm max-w-[200px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Current">Current</SelectItem>
                    <SelectItem value="Retrospective">Retrospective</SelectItem>
                    <SelectItem value="Prospective">Prospective</SelectItem>
                  </SelectContent>
                </Select>
              </CompactField>

              <CompactField label="Approaches to Value">
                <Select value={jobDetails.approachesToValue || ''} onValueChange={value => handleSelectChange(value, 'approachesToValue')}>
                  <SelectTrigger className="h-7 text-sm max-w-[200px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Applicable">All Applicable</SelectItem>
                    <SelectItem value="Cost Approach">Cost Approach</SelectItem>
                    <SelectItem value="Direct Comparison">Direct Comparison</SelectItem>
                    <SelectItem value="Income Approach">Income Approach</SelectItem>
                    <SelectItem value="Cost + Direct Comparison">Cost + Direct Comparison</SelectItem>
                    <SelectItem value="Cost + Income">Cost + Income</SelectItem>
                    <SelectItem value="Direct Comparison + Income">Direct Comparison + Income</SelectItem>
                  </SelectContent>
                </Select>
              </CompactField>

              <CompactField label="Transaction Status">
                <Select value={jobDetails.transactionStatus || ''} onValueChange={value => handleSelectChange(value, 'transactionStatus')}>
                  <SelectTrigger className="h-7 text-sm max-w-[200px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arm's Length">Arm's Length</SelectItem>
                    <SelectItem value="Non-Arm's Length">Non-Arm's Length</SelectItem>
                    <SelectItem value="Listing">Listing</SelectItem>
                    <SelectItem value="Under Contract">Under Contract</SelectItem>
                    <SelectItem value="REO/Bank Sale">REO/Bank Sale</SelectItem>
                  </SelectContent>
                </Select>
              </CompactField>

              <CompactField label="Zoning Status">
                <Select value={jobDetails.zoningStatus || ''} onValueChange={value => handleSelectChange(value, 'zoningStatus')}>
                  <SelectTrigger className="h-7 text-sm max-w-[200px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Legal Conforming">Legal Conforming</SelectItem>
                    <SelectItem value="Legal Non-Conforming">Legal Non-Conforming</SelectItem>
                    <SelectItem value="Illegal">Illegal</SelectItem>
                    <SelectItem value="No Zoning">No Zoning</SelectItem>
                  </SelectContent>
                </Select>
              </CompactField>
            </TwoColumnFields>
          </SectionGroup>

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
                <Input id="yearBuilt" name="yearBuilt" type="text" inputMode="numeric" placeholder="" value={jobDetails.yearBuilt || ''} onChange={handleChange} className="h-7 text-sm max-w-[200px]" />
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