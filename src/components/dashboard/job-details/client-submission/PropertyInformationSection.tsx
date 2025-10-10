
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DetailJob } from "@/types/job";

interface PropertyInformationSectionProps {
  job: DetailJob;
  onUpdateJob?: (updates: Partial<DetailJob>) => void;
}

const PropertyInformationSection: React.FC<PropertyInformationSectionProps> = ({ job, onUpdateJob }) => {

  // Clean quoted strings from database
  const cleanQuotedString = (value: string | undefined): string => {
    if (!value) return "";
    // Remove surrounding quotes if they exist
    if (typeof value === 'string' && value.startsWith("'") && value.endsWith("'")) {
      return value.slice(1, -1);
    }
    return value;
  };

  // Format phone number as (XXX) XXX-XXXX
  const formatPhoneNumber = (value: string): string => {
    if (!value) return '';

    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');

    // Format based on length
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };

  const handleSelectChange = (value: string, field: keyof DetailJob) => {
    if (onUpdateJob) {
      onUpdateJob({ [field]: value });
    }
  };

  // Handle phone number changes with auto-formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onUpdateJob) return;
    const { name, value } = e.target;

    // Remove formatting for storage (keep only digits)
    const numbersOnly = value.replace(/\D/g, '');

    onUpdateJob({ [name]: numbersOnly });
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-base text-slate-700 dark:text-slate-200">Property Information</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="propertyName">Property Name</Label>
            <Input
              id="propertyName"
              name="propertyName"
              value={job.propertyName || ""}
              placeholder="e.g., Parkview Apartments"
              onChange={(e) => onUpdateJob?.({ propertyName: e.target.value })}
              className="placeholder:text-gray-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="propertyAddress">Property Address</Label>
            <Input
              id="propertyAddress"
              name="propertyAddress"
              value={job.propertyAddress || ""}
              placeholder="e.g., 456 17th Avenue SW, Calgary, AB T2S 0A1"
              onChange={(e) => onUpdateJob?.({ propertyAddress: e.target.value })}
              className="placeholder:text-gray-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type</Label>
            <Select 
              value={cleanQuotedString(job.propertyType)} 
              onValueChange={value => handleSelectChange(value, 'propertyType')}
            >
              <SelectTrigger id="propertyType">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Agriculture">Agriculture</SelectItem>
                <SelectItem value="Building">Building</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Hospitality">Hospitality</SelectItem>
                <SelectItem value="Industrial">Industrial</SelectItem>
                <SelectItem value="Land">Land</SelectItem>
                <SelectItem value="Manufactured Housing">Manufactured Housing</SelectItem>
                <SelectItem value="Multi-Family">Multi-Family</SelectItem>
                <SelectItem value="Office">Office</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Self-Storage">Self-Storage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="intendedUse">Intended Use</Label>
            <Select 
              value={cleanQuotedString(job.intendedUse)} 
              onValueChange={value => handleSelectChange(value, 'intendedUse')}
            >
              <SelectTrigger id="intendedUse">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Acquisition/Disposition">Acquisition/Disposition</SelectItem>
                <SelectItem value="Consulting">Consulting</SelectItem>
                <SelectItem value="Decision-Making/Internal">Decision-Making/Internal</SelectItem>
                <SelectItem value="Dispute Resolution">Dispute Resolution</SelectItem>
                <SelectItem value="Divorce">Divorce</SelectItem>
                <SelectItem value="Establish Sales Price">Establish Sales Price</SelectItem>
                <SelectItem value="Estate Planning">Estate Planning</SelectItem>
                <SelectItem value="Financial Reporting">Financial Reporting</SelectItem>
                <SelectItem value="Financing">Financing</SelectItem>
                <SelectItem value="Litigation">Litigation</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="valuationPremises">Valuation Premises</Label>
            <Select
              value={cleanQuotedString(job.valuationPremises)}
              onValueChange={value => handleSelectChange(value, 'valuationPremises')}
            >
              <SelectTrigger id="valuationPremises">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="As-Is">As-Is</SelectItem>
                <SelectItem value="Prospective at Completion">Prospective at Completion</SelectItem>
                <SelectItem value="Prospective at Stabilization">Prospective at Stabilization</SelectItem>
                <SelectItem value="As-Vacant">As-Vacant</SelectItem>
                <SelectItem value="Insurable Replacement Cost">Insurable Replacement Cost</SelectItem>
                <SelectItem value="Bulk Value">Bulk Value</SelectItem>
                <SelectItem value="Disposition">Disposition</SelectItem>
                <SelectItem value="Go Dark">Go Dark</SelectItem>
                <SelectItem value="Hypothetical">Hypothetical</SelectItem>
                <SelectItem value="In Use">In Use</SelectItem>
                <SelectItem value="Liquidation">Liquidation</SelectItem>
                <SelectItem value="Lots">Lots</SelectItem>
                <SelectItem value="Lots to Houses">Lots to Houses</SelectItem>
                <SelectItem value="Market Rent Study">Market Rent Study</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
                <SelectItem value="Rent Restricted">Rent Restricted</SelectItem>
                <SelectItem value="Retrospective">Retrospective</SelectItem>
                <SelectItem value="Tax Credits">Tax Credits</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assetCondition">Asset Current Condition</Label>
            <Select
              value={cleanQuotedString(job.assetCondition)}
              onValueChange={value => handleSelectChange(value, 'assetCondition')}
            >
              <SelectTrigger id="assetCondition">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Excellent">Excellent</SelectItem>
                <SelectItem value="Very Good">Very Good</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Property Contact Fields - Always visible, no checkbox */}
      <div className="border-t pt-4">
        <h5 className="font-medium text-sm text-slate-600 dark:text-slate-300 mb-3">Property Contact</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="propertyContactFirstName">Contact First Name/Department</Label>
            <Input
              id="propertyContactFirstName"
              name="propertyContactFirstName"
              value={job.propertyContactFirstName || ""}
              placeholder="Enter name"
              onChange={(e) => onUpdateJob?.({ propertyContactFirstName: e.target.value })}
              className="placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyContactLastName">Contact Last Name</Label>
            <Input
              id="propertyContactLastName"
              name="propertyContactLastName"
              value={job.propertyContactLastName || ""}
              placeholder="Enter last name"
              onChange={(e) => onUpdateJob?.({ propertyContactLastName: e.target.value })}
              className="placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyContactEmail">Contact Email</Label>
            <Input
              id="propertyContactEmail"
              name="propertyContactEmail"
              type="email"
              value={job.propertyContactEmail || ""}
              placeholder="Enter email address"
              onChange={(e) => onUpdateJob?.({ propertyContactEmail: e.target.value })}
              className="placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyContactPhone">Contact Phone</Label>
            <Input
              id="propertyContactPhone"
              name="propertyContactPhone"
              type="tel"
              value={formatPhoneNumber(job.propertyContactPhone || "")}
              placeholder="(403) 555-0100"
              onChange={handlePhoneChange}
              className="placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Client Comments</Label>
        <Textarea
          id="notes"
          name="notes"
          value={job.notes || ""}
          placeholder="e.g., Client requests focus on retail comparables, property has pending zoning change..."
          rows={4}
          onChange={(e) => onUpdateJob?.({ notes: e.target.value })}
          className="placeholder:text-gray-500"
        />
      </div>
    </div>
  );
};

export default PropertyInformationSection;
