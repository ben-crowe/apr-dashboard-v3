import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormSection from "@/components/FormSection";
import { FormData, ValidationErrors } from "@/utils/validation";
import { cn } from "@/lib/utils";

interface PropertyContactSectionProps {
  formData: FormData;
  errors: ValidationErrors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  visible: boolean;
}

const PropertyContactSection: React.FC<PropertyContactSectionProps> = ({
  formData,
  errors,
  handleChange,
  visible
}) => {
  if (!visible) return null;

  return (
    <FormSection
      title="Property Contact"
      description="Contact information for property access and inquiries"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label 
            htmlFor="propertyContactFirstName"
            className={cn(errors.propertyContactFirstName && "text-destructive")}
          >
            Contact or Department
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
            placeholder="Enter name"
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
            Last Name
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
            Email
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
            Phone
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
    </FormSection>
  );
};

export default PropertyContactSection;