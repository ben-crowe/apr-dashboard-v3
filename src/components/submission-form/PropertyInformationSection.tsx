
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormSection from "@/components/FormSection";
import { FormData, ValidationErrors } from "@/utils/validation";
import { cn } from "@/lib/utils";

interface PropertyInformationSectionProps {
  formData: FormData;
  errors: ValidationErrors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (value: string, name: string) => void;
}

const PropertyInformationSection: React.FC<PropertyInformationSectionProps> = ({
  formData,
  errors,
  handleChange,
  handleSelectChange,
}) => {
  return (
    <FormSection
      title="Property & Job Information"
      description="Details about the property to be appraised"
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Property Name and Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="propertyName" className={cn(errors.propertyName && "text-destructive")}>
              Property Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="propertyName"
              name="propertyName"
              value={formData.propertyName}
              onChange={handleChange}
              className={cn(errors.propertyName && "border-destructive")}
              placeholder="Riverside Apartments"
            />
            {errors.propertyName && (
              <p className="text-sm text-destructive">{errors.propertyName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyAddress" className={cn(errors.propertyAddress && "text-destructive")}>
              Property Address
            </Label>
            <Input
              id="propertyAddress"
              name="propertyAddress"
              value={formData.propertyAddress}
              onChange={handleChange}
              className={cn(errors.propertyAddress && "border-destructive")}
              placeholder="456 River Road, Calgary, AB T2P 2B2"
            />
            {errors.propertyAddress && (
              <p className="text-sm text-destructive">{errors.propertyAddress}</p>
            )}
          </div>
        </div>

        {/* Property Contact Information Section */}
        <div className="pt-4 border-t border-gray-200">
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold">Optional Property Contact</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Leave blank if same as client contact above
              </p>
            </div>

            {/* Property Contact Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="propertyContactFirstName">First Name/Department</Label>
                <Input
                  id="propertyContactFirstName"
                  name="propertyContactFirstName"
                  value={formData.propertyContactFirstName || ""}
                  onChange={handleChange}
                  placeholder="Marcus / Property Management"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyContactLastName">Last Name</Label>
                <Input
                  id="propertyContactLastName"
                  name="propertyContactLastName"
                  value={formData.propertyContactLastName || ""}
                  onChange={handleChange}
                  placeholder="Johnson"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="propertyContactEmail">Email</Label>
                <Input
                  id="propertyContactEmail"
                  name="propertyContactEmail"
                  type="email"
                  value={formData.propertyContactEmail || ""}
                  onChange={handleChange}
                  placeholder="property.manager@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyContactPhone">Phone</Label>
                <Input
                  id="propertyContactPhone"
                  name="propertyContactPhone"
                  type="tel"
                  value={formData.propertyContactPhone || ""}
                  onChange={handleChange}
                  placeholder="(403) 555-0123"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Property Details - Type, Use, Valuation, Condition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type</Label>
            <Select
              value={formData.propertyType}
              onValueChange={(value) => handleSelectChange(value, "propertyType")}
            >
              <SelectTrigger className={errors.propertyType ? "border-destructive" : ""}>
                <SelectValue placeholder="Please Select" />
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
                <SelectItem value="Single-Family">Single-Family</SelectItem>
                <SelectItem value="Special Purpose">Special Purpose</SelectItem>
                <SelectItem value="Unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
            {errors.propertyType && (
              <p className="text-sm text-destructive">{errors.propertyType}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="intendedUse">Intended Use</Label>
            <Select
              value={formData.intendedUse}
              onValueChange={(value) => handleSelectChange(value, "intendedUse")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Please Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Financing/Refinancing">Financing/Refinancing</SelectItem>
                <SelectItem value="Acquisition">Acquisition</SelectItem>
                <SelectItem value="Disposition">Disposition</SelectItem>
                <SelectItem value="Insurance">Insurance</SelectItem>
                <SelectItem value="Litigation">Litigation</SelectItem>
                <SelectItem value="Estate Planning">Estate Planning</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

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



        <div className="space-y-2">
          <Label htmlFor="notes">Additional Information</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Please provide any additional details about the property, special circumstances, timeline requirements, or other relevant information..."
            className="min-h-[120px]"
          />
        </div>
      </div>
    </FormSection>
  );
};

export default PropertyInformationSection;
