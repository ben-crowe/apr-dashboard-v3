
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormSection from "@/components/FormSection";
import { FormData, ValidationErrors } from "@/utils/validation";
import { cn } from "@/lib/utils";

interface ClientInformationSectionProps {
  formData: FormData;
  errors: ValidationErrors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSameAsClientContactChange?: (checked: boolean) => void;
}

const ClientInformationSection: React.FC<ClientInformationSectionProps> = ({
  formData,
  errors,
  handleChange,
  handleSameAsClientContactChange,
}) => {
  return (
    <FormSection
      title="Client Information"
      description="Contact details for the client requesting the appraisal"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="clientFirstName"
            className={cn(errors.clientFirstName && "text-destructive")}
          >
            First Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="clientFirstName"
            name="clientFirstName"
            value={formData.clientFirstName}
            onChange={handleChange}
            className={cn(
              "bg-transparent border-0 border-b border-b-gray-400 pb-0.5 dark:border-b-white/20 text-gray-900 dark:text-white/70 rounded-none px-1 ml-3 max-w-[240px] placeholder:text-gray-300 dark:placeholder:text-white/25 hover:border-b-gray-700 dark:hover:border-b-white/40 focus-visible:border-b-gray-800 dark:focus-visible:border-b-border focus-visible:outline-none focus-visible:ring-0",
              errors.clientFirstName && "border-destructive"
            )}
            placeholder="John"
          />
          {errors.clientFirstName && (
            <p className="text-sm text-destructive">{errors.clientFirstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="clientLastName"
            className={cn(errors.clientLastName && "text-destructive")}
          >
            Last Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="clientLastName"
            name="clientLastName"
            value={formData.clientLastName}
            onChange={handleChange}
            className={cn(
              "bg-transparent border-0 border-b border-b-gray-400 pb-0.5 dark:border-b-white/20 text-gray-900 dark:text-white/70 rounded-none px-1 ml-3 max-w-[240px] placeholder:text-gray-300 dark:placeholder:text-white/25 hover:border-b-gray-700 dark:hover:border-b-white/40 focus-visible:border-b-gray-800 dark:focus-visible:border-b-border focus-visible:outline-none focus-visible:ring-0",
              errors.clientLastName && "border-destructive"
            )}
            placeholder="Smith"
          />
          {errors.clientLastName && (
            <p className="text-sm text-destructive">{errors.clientLastName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientTitle">Client Title</Label>
          <Input
            id="clientTitle"
            name="clientTitle"
            value={formData.clientTitle}
            onChange={handleChange}
            className="bg-transparent border-0 border-b border-b-gray-400 pb-0.5 dark:border-b-white/20 text-gray-900 dark:text-white/70 rounded-none px-1 ml-3 max-w-[240px] placeholder:text-gray-300 dark:placeholder:text-white/25 hover:border-b-gray-700 dark:hover:border-b-white/40 focus-visible:border-b-gray-800 dark:focus-visible:border-b-border focus-visible:outline-none focus-visible:ring-0"
            placeholder="Development Manager"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientOrganization">Client Company Name</Label>
          <Input
            id="clientOrganization"
            name="clientOrganization"
            value={formData.clientOrganization}
            onChange={handleChange}
            className="bg-transparent border-0 border-b border-b-gray-400 pb-0.5 dark:border-b-white/20 text-gray-900 dark:text-white/70 rounded-none px-1 ml-3 max-w-[240px] placeholder:text-gray-300 dark:placeholder:text-white/25 hover:border-b-gray-700 dark:hover:border-b-white/40 focus-visible:border-b-gray-800 dark:focus-visible:border-b-border focus-visible:outline-none focus-visible:ring-0"
            placeholder="ABC Development Corp"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="clientPhone"
            className={cn(errors.clientPhone && "text-destructive")}
          >
            Client Phone <span className="text-destructive">*</span>
          </Label>
          <Input
            id="clientPhone"
            name="clientPhone"
            value={formData.clientPhone}
            onChange={handleChange}
            className={cn(
              "bg-transparent border-0 border-b border-b-gray-400 pb-0.5 dark:border-b-white/20 text-gray-900 dark:text-white/70 rounded-none px-1 ml-3 max-w-[240px] placeholder:text-gray-300 dark:placeholder:text-white/25 hover:border-b-gray-700 dark:hover:border-b-white/40 focus-visible:border-b-gray-800 dark:focus-visible:border-b-border focus-visible:outline-none focus-visible:ring-0",
              errors.clientPhone && "border-destructive"
            )}
            placeholder="(587) 801-5151"
          />
          {errors.clientPhone && (
            <p className="text-sm text-destructive">{errors.clientPhone}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="clientEmail"
            className={cn(errors.clientEmail && "text-destructive")}
          >
            Client Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="clientEmail"
            name="clientEmail"
            type="email"
            value={formData.clientEmail}
            onChange={handleChange}
            className={cn(
              "bg-transparent border-0 border-b border-b-gray-400 pb-0.5 dark:border-b-white/20 text-gray-900 dark:text-white/70 rounded-none px-1 ml-3 max-w-[240px] placeholder:text-gray-300 dark:placeholder:text-white/25 hover:border-b-gray-700 dark:hover:border-b-white/40 focus-visible:border-b-gray-800 dark:focus-visible:border-b-border focus-visible:outline-none focus-visible:ring-0",
              errors.clientEmail && "border-destructive"
            )}
            placeholder="john@abcdevelopment.com"
          />
          {errors.clientEmail && (
            <p className="text-sm text-destructive">{errors.clientEmail}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="clientAddress">Client Organization Address</Label>
          <Input
            id="clientAddress"
            name="clientAddress"
            value={formData.clientAddress}
            onChange={handleChange}
            className="bg-transparent border-0 border-b border-b-gray-400 pb-0.5 dark:border-b-white/20 text-gray-900 dark:text-white/70 rounded-none px-1 ml-3 max-w-[240px] placeholder:text-gray-300 dark:placeholder:text-white/25 hover:border-b-gray-700 dark:hover:border-b-white/40 focus-visible:border-b-gray-800 dark:focus-visible:border-b-border focus-visible:outline-none focus-visible:ring-0"
            placeholder="123 Main Street, Calgary, AB T2P 1A1"
          />
        </div>
      </div>
    </FormSection>
  );
};

export default ClientInformationSection;
