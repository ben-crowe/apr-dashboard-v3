
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ValuationSectionProps {
  valuationPremises?: string;
  deliveryDate?: string;
  scopeOfWork?: string | string[];
  onValueChange: (value: string, name: string) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMultiSelectChange?: (values: string[], name: string) => void;
}

const ValuationSection: React.FC<ValuationSectionProps> = ({
  valuationPremises,
  deliveryDate,
  scopeOfWork = '',
  onValueChange,
  onInputChange,
  onMultiSelectChange,
}) => {
  // No default date - let user fill via test button or manually

  // Get the current scope value (handle both string and array)
  const getScopeValue = () => {
    if (Array.isArray(scopeOfWork)) {
      return scopeOfWork[0] || '';
    }
    return scopeOfWork || '';
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="valuationPremises">Valuation Premises</Label>
        <Select value={valuationPremises || ''} onValueChange={value => onValueChange(value, 'valuationPremises')}>
          <SelectTrigger id="valuationPremises">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Market Value As Is">Market Value As Is</SelectItem>
            <SelectItem value="Market Value As Is And Stabilized">Market Value As Is And Stabilized</SelectItem>
            <SelectItem value="Market Value As Complete And Stabilized">Market Value As Complete And Stabilized</SelectItem>
            <SelectItem value="Market Value Land As Is">Market Value Land As Is</SelectItem>
            <SelectItem value="Market Value Land As Is And Rezoned">Market Value Land As Is And Rezoned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deliveryDate">Delivery Date</Label>
        <Input 
          id="deliveryDate" 
          name="deliveryDate" 
          type="date" 
          value={deliveryDate || ''} 
          onChange={onInputChange} 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="scopeOfWork">Scope of Work</Label>
        <Select value={getScopeValue()} onValueChange={value => onValueChange(value, 'scopeOfWork')}>
          <SelectTrigger id="scopeOfWork">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="None">None</SelectItem>
            <SelectItem value="All Applicable">All Applicable</SelectItem>
            <SelectItem value="Best One Approach">Best One Approach</SelectItem>
            <SelectItem value="Best Two Approaches">Best Two Approaches</SelectItem>
            <SelectItem value="Cost Approach">Cost Approach</SelectItem>
            <SelectItem value="Direct Comparison Approach">Direct Comparison Approach</SelectItem>
            <SelectItem value="Discounted Cash Flow">Discounted Cash Flow</SelectItem>
            <SelectItem value="Feasibility Study">Feasibility Study</SelectItem>
            <SelectItem value="Income Approach">Income Approach</SelectItem>
            <SelectItem value="Land Value">Land Value</SelectItem>
            <SelectItem value="Litigation">Litigation</SelectItem>
            <SelectItem value="Market Research">Market Research</SelectItem>
            <SelectItem value="Net Rent Review">Net Rent Review</SelectItem>
            <SelectItem value="Update">Update</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ValuationSection;
