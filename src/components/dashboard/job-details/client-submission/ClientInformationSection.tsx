import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DetailJob } from "@/types/job";

interface ClientInformationSectionProps {
  job: DetailJob;
  onUpdateJob?: (updates: Partial<DetailJob>) => void;
}

const ClientInformationSection: React.FC<ClientInformationSectionProps> = ({ job, onUpdateJob }) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onUpdateJob) return;
    const { name, value } = e.target;
    onUpdateJob({ [name]: value });
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
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Left Column */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="clientFirstName" className="text-sm">First Name</Label>
              <Input
                id="clientFirstName"
                name="clientFirstName"
                value={job.clientFirstName || ''}
                onChange={handleChange}
                placeholder="e.g., John"
                className={onUpdateJob ? "h-9 placeholder:text-gray-500" : "h-9 bg-slate-50 dark:bg-slate-800/50 placeholder:text-gray-500"}
                readOnly={!onUpdateJob}
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="clientLastName" className="text-sm">Last Name</Label>
              <Input
                id="clientLastName"
                name="clientLastName"
                value={job.clientLastName || ''}
                onChange={handleChange}
                placeholder="e.g., Smith"
                className={onUpdateJob ? "h-9 placeholder:text-gray-500" : "h-9 bg-slate-50 dark:bg-slate-800/50 placeholder:text-gray-500"}
                readOnly={!onUpdateJob}
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="clientTitle" className="text-sm">Client Title</Label>
            <Input
              id="clientTitle"
              name="clientTitle"
              value={job.clientTitle || ""}
              onChange={handleChange}
              placeholder="e.g., VP of Real Estate"
              className={onUpdateJob ? "h-9 placeholder:text-gray-500" : "h-9 bg-slate-50 placeholder:text-gray-500"}
              readOnly={!onUpdateJob}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="clientOrganization" className="text-sm">Client Organization Name</Label>
            <Input
              id="clientOrganization"
              name="clientOrganization"
              value={job.clientOrganization || ""}
              onChange={handleChange}
              placeholder="e.g., ABC Properties Inc."
              className={onUpdateJob ? "h-9 placeholder:text-gray-500" : "h-9 bg-slate-50 placeholder:text-gray-500"}
              readOnly={!onUpdateJob}
            />
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="clientAddress" className="text-sm">Client Organization Address</Label>
            <Input
              id="clientAddress"
              name="clientAddress"
              value={job.clientAddress || ""}
              onChange={handleChange}
              placeholder="e.g., 123 8th Avenue SW, Suite 500, Calgary, AB T2P 1B3"
              className={onUpdateJob ? "h-9 placeholder:text-gray-500" : "h-9 bg-slate-50 placeholder:text-gray-500"}
              readOnly={!onUpdateJob}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="clientPhone" className="text-sm">Client Phone</Label>
            <Input
              id="clientPhone"
              name="clientPhone"
              type="tel"
              value={formatPhoneNumber(job.clientPhone || '')}
              onChange={handlePhoneChange}
              placeholder="(403) 555-0100"
              className={onUpdateJob ? "h-9 placeholder:text-gray-500" : "h-9 bg-slate-50 placeholder:text-gray-500"}
              readOnly={!onUpdateJob}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="clientEmail" className="text-sm">Client Email</Label>
            <Input
              id="clientEmail"
              name="clientEmail"
              type="email"
              value={job.clientEmail || ''}
              onChange={handleChange}
              placeholder="e.g., john.smith@example.com"
              className={onUpdateJob ? "h-9 placeholder:text-gray-500" : "h-9 bg-slate-50 placeholder:text-gray-500"}
              readOnly={!onUpdateJob}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInformationSection;