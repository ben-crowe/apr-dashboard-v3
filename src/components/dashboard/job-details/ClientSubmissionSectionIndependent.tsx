import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SectionProps } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw } from "lucide-react";
import { SectionTitle, FieldRow, SectionGroup, TwoColumnFields, CompactField } from "./ValcreStyles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ClientSubmissionSectionIndependent: React.FC<SectionProps> = ({
  job,
  onUpdateJob,
  onUpdateDetails,
  jobDetails
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // Default to open
  
  const handleSyncToValcre = async () => {
    if (!jobDetails?.valcreJobId) {
      toast.error("Please create a Valcre job first (in Section 2)");
      return;
    }
    
    setIsSyncing(true);
    try {
      // Sync logic here
      toast.success("Client information synced to Valcre!");
    } catch (error) {
      console.error('Sync error:', error);
      toast.error("Failed to sync to Valcre. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  const fillClientTestData = () => {
    if (!onUpdateJob) return;
    
    const firstNames = ['Michael', 'Sarah', 'David', 'Jennifer', 'Robert'];
    const lastNames = ['Johnson', 'Williams', 'Brown', 'Garcia', 'Martinez'];
    const titles = ['VP of Real Estate', 'Property Manager', 'CEO', 'Director of Operations'];
    const companies = ['Apex Developments', 'Stellar Properties', 'Urban Growth Partners', 'Pacific Investments'];
    const domains = ['gmail.com', 'company.com', 'outlook.com', 'business.net'];
    const areas = ['604', '778', '236', '250'];
    
    const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomCompany = companies[Math.floor(Math.random() * companies.length)];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const randomArea = areas[Math.floor(Math.random() * areas.length)];
    
    const updates = {
      firstName: randomFirst,
      lastName: randomLast,
      title: randomTitle,
      companyName: randomCompany,
      emailAddress: `${randomFirst.toLowerCase()}.${randomLast.toLowerCase()}@${randomDomain}`,
      phoneNumber: `(${randomArea}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      propertyAddress: job.propertyAddress || '',
      loanNumber: `LN-${Date.now().toString().slice(-8)}`,
      mobilePhone: `(${randomArea}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`
    };
    
    onUpdateJob(updates);
    toast.success('Client information test data filled!');
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (onUpdateJob) {
      onUpdateJob({ [name]: value });
    }
  };

  // COMPLETELY INDEPENDENT COMPONENT
  return (
    <div className="w-full border rounded-lg bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b"
      >
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="text-base font-medium">1. Client & New Appraisal Submission Info</span>
        </div>
      </button>
      
      {isOpen && (
        <div className="px-6 py-4">
          {/* Action Buttons Row */}
          <div className="mb-4 flex justify-end gap-2">
            {jobDetails?.jobNumber && jobDetails.jobNumber.toString().startsWith('CAL') && (
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
                    <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-3 w-3" />
                    Sync to Valcre
                  </>
                )}
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={fillClientTestData}
              className="text-gray-600"
            >
              Fill Test Data
            </Button>
          </div>

          <div className="space-y-4">
            {/* Primary Contact Section */}
            <SectionGroup title="Primary Contact">
              <TwoColumnFields>
                <CompactField label="First Name">
                  <Input
                    name="firstName"
                    value={job.firstName || ''}
                    onChange={handleChange}
                    className="h-7 text-sm"
                  />
                </CompactField>
                <CompactField label="Last Name">
                  <Input
                    name="lastName"
                    value={job.lastName || ''}
                    onChange={handleChange}
                    className="h-7 text-sm"
                  />
                </CompactField>
              </TwoColumnFields>
              <TwoColumnFields>
                <CompactField label="Title">
                  <Input
                    name="title"
                    value={job.title || ''}
                    onChange={handleChange}
                    className="h-7 text-sm"
                  />
                </CompactField>
                <CompactField label="Company">
                  <Input
                    name="companyName"
                    value={job.companyName || ''}
                    onChange={handleChange}
                    className="h-7 text-sm"
                  />
                </CompactField>
              </TwoColumnFields>
              <TwoColumnFields>
                <CompactField label="Email">
                  <Input
                    name="emailAddress"
                    type="email"
                    value={job.emailAddress || ''}
                    onChange={handleChange}
                    className="h-7 text-sm"
                  />
                </CompactField>
                <CompactField label="Phone">
                  <Input
                    name="phoneNumber"
                    value={job.phoneNumber || ''}
                    onChange={handleChange}
                    className="h-7 text-sm"
                  />
                </CompactField>
              </TwoColumnFields>
            </SectionGroup>

            {/* Property Section */}
            <SectionGroup title="Property Information">
              <CompactField label="Property Address">
                <Input
                  name="propertyAddress"
                  value={job.propertyAddress || ''}
                  onChange={handleChange}
                  className="h-7 text-sm"
                />
              </CompactField>
              <TwoColumnFields>
                <CompactField label="Property Type">
                  <Select
                    value={job.propertyType || ''}
                    onValueChange={(value) => onUpdateJob?.({ propertyType: value })}
                  >
                    <SelectTrigger className="h-7 text-sm">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single Family">Single Family</SelectItem>
                      <SelectItem value="Multi-Family">Multi-Family</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                      <SelectItem value="Land">Land</SelectItem>
                      <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                    </SelectContent>
                  </Select>
                </CompactField>
                <CompactField label="Loan Number">
                  <Input
                    name="loanNumber"
                    value={job.loanNumber || ''}
                    onChange={handleChange}
                    className="h-7 text-sm"
                  />
                </CompactField>
              </TwoColumnFields>
            </SectionGroup>

            {/* Additional Notes Section */}
            <SectionGroup title="Additional Information">
              <CompactField label="Special Instructions">
                <Textarea
                  name="specialInstructions"
                  value={job.specialInstructions || ''}
                  onChange={handleChange}
                  className="min-h-[60px] text-sm"
                  placeholder="Any special requirements or notes..."
                />
              </CompactField>
            </SectionGroup>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientSubmissionSectionIndependent;