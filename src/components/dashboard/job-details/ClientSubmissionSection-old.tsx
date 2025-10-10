
import React, { useState } from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SectionHeader, sectionTriggerStyle, sectionContentStyle, sectionContentWrapperStyle, subheadingStyle, fieldGroupStyle } from "./SectionStyles";
import { toast } from "sonner";
import { SectionProps } from "./types";
import ClientInformationSection from "./client-submission/ClientInformationSection";
import PropertyInformationSection from "./client-submission/PropertyInformationSection";
// UploadedDocumentsSection removed - not needed in Section 1
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw } from "lucide-react";

const ClientSubmissionSection: React.FC<SectionProps> = ({
  job,
  onUpdateJob,
  onUpdateDetails,
  jobDetails
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Sync client and property information to Valcre
  const handleSyncToValcre = async () => {
    if (!jobDetails?.valcreJobId) {
      toast.error("Please create a Valcre job first (in Section 2)");
      return;
    }
    
    setIsSyncing(true);
    try {
      // Update Contact in Valcre
      const contactResponse = await fetch(`/api/valcre/contacts/${jobDetails.valcreContactId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          FirstName: job.clientFirstName,
          LastName: job.clientLastName,
          Email: job.clientEmail,
          PhoneNumber: job.clientPhone,
          Title: job.clientTitle,
          Company: job.clientOrganization
        })
      });
      
      if (!contactResponse.ok) {
        throw new Error('Failed to update contact in Valcre');
      }
      
      // Update Property in Valcre
      const propertyResponse = await fetch(`/api/valcre/properties/${jobDetails.valcrePropertyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Name: job.propertyName,
          AddressStreet: job.propertyAddress,
          PropertyType: job.propertyType,
          AssetCondition: job.assetCondition
        })
      });
      
      if (!propertyResponse.ok) {
        throw new Error('Failed to update property in Valcre');
      }
      
      toast.success("Client information synced to Valcre!");
    } catch (error) {
      console.error('Sync error:', error);
      toast.error("Failed to sync to Valcre. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Fill test data for client information - DYNAMIC data for variety
  const fillClientTestData = () => {
    if (!onUpdateJob) return;
    
    // Dynamic test data arrays for variety - CLIENT names, not appraiser names!
    const firstNames = ['Michael', 'Sarah', 'David', 'Jennifer', 'Robert', 'Lisa', 'James', 'Emily'];
    const lastNames = ['Johnson', 'Williams', 'Brown', 'Garcia', 'Martinez', 'Davis', 'Rodriguez', 'Wilson'];
    const titles = ['VP of Real Estate', 'Property Manager', 'CEO', 'Director of Operations', 'Asset Manager', 'CFO'];
    const companies = ['Premier Properties Inc', 'Urban Development Group', 'Skyline Investments', 'Metro Real Estate', 'Capital Holdings LLC'];
    const propertyNames = ['Downtown Plaza', 'Riverside Complex', 'Tech Center Building', 'Heritage Square', 'Commerce Park'];
    const streets = ['17th Avenue SW', '8th Avenue SW', 'Centre Street', 'Macleod Trail', '11th Avenue SW', '4th Street SW'];
    const propertyTypes = ['Multifamily', 'Office', 'Retail', 'Industrial', 'Mixed Use', 'Hospitality', 'Healthcare', 'Self Storage', 'Land', 'Special Purpose'];
    const intendedUses = ['Financing/Refinancing', 'Acquisition', 'Disposition', 'Insurance', 'Litigation', 'Estate Planning', 'Consulting', 'Portfolio Review', 'Internal Valuation'];
    const conditions = ['Excellent', 'Very Good', 'Good', 'Fair'];
    
    // Generate random selections
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const propertyName = propertyNames[Math.floor(Math.random() * propertyNames.length)];
    const street = streets[Math.floor(Math.random() * streets.length)];
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const intendedUse = intendedUses[Math.floor(Math.random() * intendedUses.length)];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    // Generate realistic test numbers for addresses and phone
    const buildingNum = Math.floor(Math.random() * 400) + 100; // 100-500 range
    const suiteNum = Math.floor(Math.random() * 500) + 100; // 100-600 range
    const propNum = Math.floor(Math.random() * 400) + 100; // 100-500 range
    const areaCode = '403'; // Calgary area code
    const phoneNum = '555-0100'; // Standard test phone number
    const sqft = (Math.floor(Math.random() * 20) + 5) * 1000; // 5,000 to 25,000 sq ft
    
    // Build the test data with dynamic values
    const testData = {
      clientFirstName: firstName,
      clientLastName: lastName,
      clientTitle: title,
      clientOrganization: company,
      clientAddress: `${buildingNum} ${street}, Suite ${suiteNum}, Calgary, AB T2P 3H7`,
      clientPhone: `${areaCode}-${phoneNum}`,
      clientEmail: firstName === 'Test' || firstName === 'Demo' ? 
        `test@example.com` : 
        `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/ /g, '')}.ca`,
      propertyName: propertyName,
      propertyAddress: `${propNum} ${street}, Calgary, AB T2R 1M5`,
      propertyType: propertyType,
      intendedUse: intendedUse,
      assetCondition: condition,
      notes: `Property is a ${sqft.toLocaleString()} sq ft ${propertyType} complex. Need appraisal for ${intendedUse}. ${condition === 'Fair' ? 'Planning major renovations next year.' : 'Well-maintained property with stable tenancy.'}`
    };
    
    onUpdateJob(testData);
    toast.success(`Test data populated: ${firstName} ${lastName} - ${propertyName}`);
  };
  return <AccordionItem value="section-1">
      <AccordionTrigger className={sectionTriggerStyle}>
        <SectionHeader number="1" title="Section 1: Client's New Appraisal Submission Info" />
      </AccordionTrigger>
      <AccordionContent className={sectionContentStyle}>
        <div className={sectionContentWrapperStyle}>
        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          {/* Sync to Valcre Button */}
          <Button
            onClick={handleSyncToValcre}
            disabled={isSyncing || !jobDetails?.valcreJobId}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync to Valcre'}
          </Button>
          
          {/* Test Data Button */}
          <button
            type="button"
            onClick={fillClientTestData}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
            title="Fill test data for development"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span>Test Data</span>
          </button>
        </div>
        
        {/* Client Information Section */}
        <div>
          <h4 className={subheadingStyle}>Client Information</h4>
          <div className={fieldGroupStyle}>
            <ClientInformationSection job={job} onUpdateJob={onUpdateJob} />
          </div>
        </div>
        
        {/* Property Information Section */}
        <div>
          <h4 className={subheadingStyle}>Property Information</h4>
          <div className={fieldGroupStyle}>
            <PropertyInformationSection job={job} onUpdateJob={onUpdateJob} />
          </div>
        </div>
        
        </div>
      </AccordionContent>
    </AccordionItem>;
};

export default ClientSubmissionSection;
