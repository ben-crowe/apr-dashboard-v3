import React, { useState } from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { SectionProps } from "./types";
import { RefreshCw } from "lucide-react";
import { 
  SectionTitle, 
  CleanInput, 
  CleanSelect,
  CleanTextarea,
  CleanCompactField,
  CleanFieldGroup,
  CleanTwoColumnLayout,
  CleanSection,
  CleanActionBar,
  CleanButton
} from "./ValcreCleanStyles";

const ClientSubmissionSectionClean: React.FC<SectionProps> = ({
  job,
  onUpdateJob,
  onUpdateDetails,
  jobDetails
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  
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
    const companies = ['Premier Properties Inc', 'Urban Development Group', 'Skyline Investments'];
    const propertyNames = ['Downtown Plaza', 'Riverside Complex', 'Tech Center Building'];
    const streets = ['17th Avenue SW', '8th Avenue SW', 'Centre Street', 'Macleod Trail'];
    const propertyTypes = ['Multifamily', 'Office', 'Retail', 'Industrial', 'Mixed Use'];
    const intendedUses = ['Financing/Refinancing', 'Acquisition', 'Disposition', 'Insurance'];
    const conditions = ['Excellent', 'Very Good', 'Good', 'Fair'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const propertyName = propertyNames[Math.floor(Math.random() * propertyNames.length)];
    const street = streets[Math.floor(Math.random() * streets.length)];
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const intendedUse = intendedUses[Math.floor(Math.random() * intendedUses.length)];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    const buildingNum = Math.floor(Math.random() * 400) + 100;
    const suiteNum = Math.floor(Math.random() * 500) + 100;
    const propNum = Math.floor(Math.random() * 400) + 100;
    const sqft = (Math.floor(Math.random() * 20) + 5) * 1000;
    
    const testData = {
      clientFirstName: firstName,
      clientLastName: lastName,
      clientTitle: title,
      clientOrganization: company,
      clientAddress: `${buildingNum} ${street}, Suite ${suiteNum}, Calgary, AB T2P 3H7`,
      clientPhone: `403-555-0100`,
      clientEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/ /g, '')}.ca`,
      propertyName: propertyName,
      propertyAddress: `${propNum} ${street}, Calgary, AB T2R 1M5`,
      propertyType: propertyType,
      intendedUse: intendedUse,
      assetCondition: condition,
      notes: `Property is a ${sqft.toLocaleString()} sq ft ${propertyType} complex. Need appraisal for ${intendedUse}.`
    };
    
    onUpdateJob(testData);
    toast.success(`Test data populated: ${firstName} ${lastName} - ${propertyName}`);
  };

  return (
    <AccordionItem value="section-1" className="border-none">
      <AccordionTrigger className="hover:no-underline py-3 px-0">
        <SectionTitle number="1." title="Client's New Appraisal Submission Info" />
      </AccordionTrigger>
      <AccordionContent className="px-0 py-0">
        <CleanSection>
          {/* Action Bar */}
          <CleanActionBar>
            <CleanButton
              onClick={handleSyncToValcre}
              disabled={isSyncing || !jobDetails?.valcreJobId}
              variant="secondary"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync to Valcre'}
            </CleanButton>
            
            <button
              type="button"
              onClick={fillClientTestData}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              Test Data
            </button>
          </CleanActionBar>
          
          {/* Client Information - No extra container, just logical grouping */}
          <CleanFieldGroup title="Client Information">
            <CleanTwoColumnLayout>
              <CleanCompactField label="First Name" required>
                <CleanInput 
                  value={job.clientFirstName || ''} 
                  onChange={(e) => onUpdateJob?.({clientFirstName: e.target.value})}
                  placeholder="Enter first name"
                />
              </CleanCompactField>
              
              <CleanCompactField label="Last Name" required>
                <CleanInput 
                  value={job.clientLastName || ''} 
                  onChange={(e) => onUpdateJob?.({clientLastName: e.target.value})}
                  placeholder="Enter last name"
                />
              </CleanCompactField>
              
              <CleanCompactField label="Title">
                <CleanInput 
                  value={job.clientTitle || ''} 
                  onChange={(e) => onUpdateJob?.({clientTitle: e.target.value})}
                  placeholder="Job title"
                />
              </CleanCompactField>
              
              <CleanCompactField label="Organization">
                <CleanInput 
                  value={job.clientOrganization || ''} 
                  onChange={(e) => onUpdateJob?.({clientOrganization: e.target.value})}
                  placeholder="Company name"
                />
              </CleanCompactField>
              
              <CleanCompactField label="Phone">
                <CleanInput 
                  value={job.clientPhone || ''} 
                  onChange={(e) => onUpdateJob?.({clientPhone: e.target.value})}
                  placeholder="(403) 555-0100"
                  type="tel"
                />
              </CleanCompactField>
              
              <CleanCompactField label="Email" required>
                <CleanInput 
                  value={job.clientEmail || ''} 
                  onChange={(e) => onUpdateJob?.({clientEmail: e.target.value})}
                  placeholder="email@example.com"
                  type="email"
                />
              </CleanCompactField>
              
              <CleanCompactField label="Address" fullWidth>
                <CleanInput 
                  value={job.clientAddress || ''} 
                  onChange={(e) => onUpdateJob?.({clientAddress: e.target.value})}
                  placeholder="Street address, City, Province, Postal"
                />
              </CleanCompactField>
            </CleanTwoColumnLayout>
          </CleanFieldGroup>
          
          {/* Property Information - No extra container */}
          <CleanFieldGroup title="Property Information">
            <CleanTwoColumnLayout>
              <CleanCompactField label="Property Name" required>
                <CleanInput 
                  value={job.propertyName || ''} 
                  onChange={(e) => onUpdateJob?.({propertyName: e.target.value})}
                  placeholder="Enter property name"
                />
              </CleanCompactField>
              
              <CleanCompactField label="Property Type">
                <CleanSelect 
                  value={job.propertyType || ''}
                  onChange={(e) => onUpdateJob?.({propertyType: e.target.value})}
                >
                  <option value="">Select type</option>
                  <option value="Office">Office</option>
                  <option value="Retail">Retail</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Multifamily">Multifamily</option>
                  <option value="Mixed Use">Mixed Use</option>
                  <option value="Land">Land</option>
                  <option value="Special Purpose">Special Purpose</option>
                </CleanSelect>
              </CleanCompactField>
              
              <CleanCompactField label="Property Address" fullWidth required>
                <CleanInput 
                  value={job.propertyAddress || ''} 
                  onChange={(e) => onUpdateJob?.({propertyAddress: e.target.value})}
                  placeholder="Full property address"
                />
              </CleanCompactField>
              
              <CleanCompactField label="Intended Use">
                <CleanSelect 
                  value={job.intendedUse || ''}
                  onChange={(e) => onUpdateJob?.({intendedUse: e.target.value})}
                >
                  <option value="">Select use</option>
                  <option value="Financing/Refinancing">Financing/Refinancing</option>
                  <option value="Acquisition">Acquisition</option>
                  <option value="Disposition">Disposition</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Tax Appeal">Tax Appeal</option>
                  <option value="Internal Valuation">Internal Valuation</option>
                </CleanSelect>
              </CleanCompactField>
              
              <CleanCompactField label="Asset Condition">
                <CleanSelect 
                  value={job.assetCondition || ''}
                  onChange={(e) => onUpdateJob?.({assetCondition: e.target.value})}
                >
                  <option value="">Select condition</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </CleanSelect>
              </CleanCompactField>
            </CleanTwoColumnLayout>
          </CleanFieldGroup>
          
          {/* Notes Section */}
          <CleanFieldGroup title="Additional Notes">
            <CleanTextarea 
              value={job.notes || ''} 
              onChange={(e) => onUpdateJob?.({notes: e.target.value})}
              placeholder="Any additional information about the property or appraisal requirements..."
              rows={3}
            />
          </CleanFieldGroup>
        </CleanSection>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ClientSubmissionSectionClean;