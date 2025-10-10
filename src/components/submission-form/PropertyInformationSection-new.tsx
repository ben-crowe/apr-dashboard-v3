import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormSection } from "./FormSection";
import { cn } from "@/lib/utils";

interface PropertyInformationSectionProps {
  formData: any;
  errors: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (value: string, fieldName: string) => void;
  handleSameAsClientContactChange?: (checked: boolean) => void;
}

export const PropertyInformationSection: React.FC<PropertyInformationSectionProps> = ({
  formData,
  errors,
  handleChange,
  handleSelectChange,
  handleSameAsClientContactChange,
}) => {
  return (
    <FormSection title="Property Information" subtitle="Details about the property to be appraised">
      <div className="space-y-6">
        {/* Basic Property Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="propertyName"
              className={cn(errors.propertyName && "text-destructive")}
            >
              Property Name
            </Label>
            <Input
              id="propertyName"
              name="propertyName"
              value={formData.propertyName || ""}
              onChange={handleChange}
              className={cn(errors.propertyName && "border-destructive")}
              placeholder="e.g. Parkview Apartments, Riverside Plaza"
            />
            {errors.propertyName && (
              <p className="text-sm text-destructive">{errors.propertyName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="propertyAddress"
              className={cn(errors.propertyAddress && "text-destructive")}
            >
              Property Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="propertyAddress"
              name="propertyAddress"
              value={formData.propertyAddress || ""}
              onChange={handleChange}
              className={cn(errors.propertyAddress && "border-destructive")}
              placeholder="Enter full property address"
              required
            />
            {errors.propertyAddress && (
              <p className="text-sm text-destructive">
                {errors.propertyAddress}
              </p>
            )}
          </div>
        </div>

        {/* Property Type and Use */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="propertyType"
              className={cn(errors.propertyType && "text-destructive")}
            >
              Property Type
            </Label>
            <select
              id="propertyType"
              name="propertyType"
              value={formData.propertyType || ""}
              onChange={(e) => {
                handleSelectChange(e.target.value, "propertyType");
              }}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errors.propertyType && "border-destructive"
              )}
            >
              <option value="">Select property type</option>
              <option value="Multifamily">Multifamily</option>
              <option value="Office">Office</option>
              <option value="Retail">Retail</option>
              <option value="Industrial">Industrial</option>
              <option value="Mixed Use">Mixed Use</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Self Storage">Self Storage</option>
              <option value="Land">Land</option>
              <option value="Special Purpose">Special Purpose</option>
            </select>
            {errors.propertyType && (
              <p className="text-sm text-destructive">{errors.propertyType}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="intendedUse">Intended Use</Label>
            <select
              id="intendedUse"
              name="intendedUse"
              value={formData.intendedUse || ""}
              onChange={(e) => {
                handleSelectChange(e.target.value, "intendedUse");
              }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select intended use</option>
              <option value="Financing/Refinancing">Financing/Refinancing</option>
              <option value="Acquisition">Acquisition</option>
              <option value="Disposition">Disposition</option>
              <option value="Insurance">Insurance</option>
              <option value="Litigation">Litigation</option>
              <option value="Estate Planning">Estate Planning</option>
              <option value="Consulting">Consulting</option>
              <option value="Portfolio Review">Portfolio Review</option>
              <option value="Internal Valuation">Internal Valuation</option>
            </select>
          </div>
        </div>

        {/* Valuation and Condition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="valuationPremises">Valuation Premises</Label>
            <Select
              value={formData.valuationPremises}
              onValueChange={(value) =>
                handleSelectChange(value, "valuationPremises")
              }
            >
              <SelectTrigger id="valuationPremises">
                <SelectValue placeholder="Select valuation premises" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Market Value">Market Value</SelectItem>
                <SelectItem value="Market Rent">Market Rent</SelectItem>
                <SelectItem value="Investment Value">Investment Value</SelectItem>
                <SelectItem value="Insurable Value">Insurable Value</SelectItem>
                <SelectItem value="Liquidation Value">Liquidation Value</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assetCondition">Asset Current Condition</Label>
            <Select
              value={formData.assetCondition}
              onValueChange={(value) =>
                handleSelectChange(value, "assetCondition")
              }
            >
              <SelectTrigger id="assetCondition">
                <SelectValue placeholder="Select asset condition" />
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

        {/* Property Contact Person - Integrated discretely */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sameAsClientContact"
              checked={formData.sameAsClientContact || false}
              onCheckedChange={handleSameAsClientContactChange}
            />
            <Label
              htmlFor="sameAsClientContact"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Property Contact Same as Client Contact
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label 
                htmlFor="propertyContactFirstName"
                className={cn(errors.propertyContactFirstName && "text-destructive")}
              >
                Property Contact First Name
              </Label>
              <Input
                id="propertyContactFirstName"
                name="propertyContactFirstName"
                value={formData.propertyContactFirstName || ""}
                onChange={handleChange}
                disabled={formData.sameAsClientContact}
                className={cn(
                  errors.propertyContactFirstName && "border-destructive",
                  formData.sameAsClientContact && "bg-muted cursor-not-allowed"
                )}
                placeholder="Enter first name"
              />
              {errors.propertyContactFirstName && (
                <p className="text-sm text-destructive">
                  {errors.propertyContactFirstName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="propertyContactLastName"
                className={cn(errors.propertyContactLastName && "text-destructive")}
              >
                Property Contact Last Name
              </Label>
              <Input
                id="propertyContactLastName"
                name="propertyContactLastName"
                value={formData.propertyContactLastName || ""}
                onChange={handleChange}
                disabled={formData.sameAsClientContact}
                className={cn(
                  errors.propertyContactLastName && "border-destructive",
                  formData.sameAsClientContact && "bg-muted cursor-not-allowed"
                )}
                placeholder="Enter last name"
              />
              {errors.propertyContactLastName && (
                <p className="text-sm text-destructive">
                  {errors.propertyContactLastName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="propertyContactEmail"
                className={cn(errors.propertyContactEmail && "text-destructive")}
              >
                Property Contact Email
              </Label>
              <Input
                id="propertyContactEmail"
                name="propertyContactEmail"
                type="email"
                value={formData.propertyContactEmail || ""}
                onChange={handleChange}
                disabled={formData.sameAsClientContact}
                className={cn(
                  errors.propertyContactEmail && "border-destructive",
                  formData.sameAsClientContact && "bg-muted cursor-not-allowed"
                )}
                placeholder="Enter email address"
              />
              {errors.propertyContactEmail && (
                <p className="text-sm text-destructive">
                  {errors.propertyContactEmail}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="propertyContactPhone"
                className={cn(errors.propertyContactPhone && "text-destructive")}
              >
                Property Contact Phone
              </Label>
              <Input
                id="propertyContactPhone"
                name="propertyContactPhone"
                type="tel"
                value={formData.propertyContactPhone || ""}
                onChange={handleChange}
                disabled={formData.sameAsClientContact}
                className={cn(
                  errors.propertyContactPhone && "border-destructive",
                  formData.sameAsClientContact && "bg-muted cursor-not-allowed"
                )}
                placeholder="Enter phone number"
              />
              {errors.propertyContactPhone && (
                <p className="text-sm text-destructive">
                  {errors.propertyContactPhone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional information that might be relevant"
            rows={4}
          />
        </div>
      </div>
    </FormSection>
  );
};