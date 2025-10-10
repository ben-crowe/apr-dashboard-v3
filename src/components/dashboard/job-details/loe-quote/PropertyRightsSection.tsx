
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobDetails } from "@/types/job";

interface PropertyRightsSectionProps {
  value?: string;
  onValueChange: (value: string, name: string) => void;
}

const PropertyRightsSection: React.FC<PropertyRightsSectionProps> = ({ value, onValueChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="propertyRightsAppraised">Property Rights Appraised</Label>
      <Select value={value || ''} onValueChange={value => onValueChange(value, 'propertyRightsAppraised')}>
        <SelectTrigger id="propertyRightsAppraised">
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="None">None</SelectItem>
          <SelectItem value="ASC 805">ASC 805</SelectItem>
          <SelectItem value="Condominium Ownership">Condominium Ownership</SelectItem>
          <SelectItem value="Cost Segregation Study">Cost Segregation Study</SelectItem>
          <SelectItem value="Fee Simple Interest">Fee Simple Interest</SelectItem>
          <SelectItem value="Going Concern">Going Concern</SelectItem>
          <SelectItem value="Leased Fee Interest">Leased Fee Interest</SelectItem>
          <SelectItem value="Leasehold Interest">Leasehold Interest</SelectItem>
          <SelectItem value="Market Study">Market Study</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
          <SelectItem value="Partial Interest">Partial Interest</SelectItem>
          <SelectItem value="Partial Interest Taking">Partial Interest Taking</SelectItem>
          <SelectItem value="Rent Restricted">Rent Restricted</SelectItem>
          <SelectItem value="Total Taking">Total Taking</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PropertyRightsSection;
