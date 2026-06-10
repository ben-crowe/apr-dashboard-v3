import React from "react";
import { DetailJob, JobDetails } from "@/types/job";
import ClientSubmissionSection from "./job-details/ClientSubmissionSection";
import LoeQuoteSection from "./job-details/LoeQuoteSection";
import OrganizingDocsSection from "./job-details/OrganizingDocsSection";
import PropertyInfoSection from "./job-details/PropertyInfoSection";
import Section4Compact from "./job-details/Section4Compact";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { isValcreJobNumber } from "@/config/valcre";

interface JobDetailAccordionProps {
  job: DetailJob;
  jobDetails?: JobDetails;
  onUpdateDetails?: (details: Partial<JobDetails>) => void;
  onUpdateJob?: (updates: Partial<DetailJob>) => void;
  refetchJobData?: () => Promise<void>;
}

const JobDetailAccordion: React.FC<JobDetailAccordionProps> = ({
  job,
  jobDetails = {},
  onUpdateDetails,
  onUpdateJob,
  refetchJobData,
}) => {

  // REMOVED: Auto-calculation of retainer amount - field must be user-editable
  // Previously this useEffect was overwriting user input immediately after typing
  // Client needs to manually set retainer amount per job

  // Fill all base fields from MOCK-DASHBOARD-TEST-DATA.md (Riverside Commerce Centre / Sarah Mitchell).
  // Does NOT set statusOfImprovements, authorizedUse (LOE side), or valueScenarios —
  // those are set by the Cascade Options picker in LoeQuoteSection.
  // RULE 1 — test tools self-disable on a real (live-synced) Valcre job.
  const isLiveValcreJob = isValcreJobNumber(jobDetails?.jobNumber) && !!(jobDetails as any)?.valcreJobId;

  const handleFillTestData = () => {
    if (isLiveValcreJob) {
      toast.info('Not available — this job is connected to a live Valcre job.');
      return;
    }
    if (onUpdateJob) {
      onUpdateJob({
        clientFirstName: 'Sarah',
        clientLastName: 'Mitchell',
        clientTitle: 'Portfolio Manager',
        clientOrganization: 'Bridgepoint Capital Partners',
        clientPhone: '(403) 555-0142',
        clientEmail: 'sarah.mitchell@bridgepointcap.com',
        clientAddress: '350 7th Avenue SW, Suite 1800, Calgary, AB T2P 3N9',
        propertyName: 'Riverside Commerce Centre',
        propertyAddress: '4820 Macleod Trail SE, Calgary, AB T2G 0A5',
        propertyType: 'Industrial',
        intendedUse: 'Financial Reporting',
        assetCondition: 'Good',
        propertyContactFirstName: 'Daniel',
        propertyContactLastName: 'Okafor',
        propertyContactEmail: 'd.okafor@riversidecc.ca',
        propertyContactPhone: '(403) 555-0199',
        notes: 'Refinancing appraisal; site access via property manager Daniel Okafor.',
      });
    }

    if (onUpdateDetails) {
      onUpdateDetails({
        // Section 2 — LOE Quote (base, no cascade inputs)
        jobStatus: 'In Progress',
        purpose: 'Financial Reporting',
        // statusOfImprovements intentionally omitted — set by Cascade Options
        // valueScenarios intentionally omitted — derived by cascade
        // authorizedUse intentionally omitted — set by Cascade Options
        propertySubtype: 'Multi-Tenant Industrial',
        tenancy: 'Multi-Tenant',
        propertyRightsAppraised: 'Leased Fee Interest',
        // approachesToValue intentionally omitted — derived field
        valueTimeframe: 'Current',
        scopeOfWork: 'Income Approach',
        reportType: 'Appraisal Report',
        reportFormat: 'Comprehensive',
        assignmentType: 'Single Property',
        analysisLevel: 'Detailed',
        appraisalFee: 6500,
        retainerAmount: '1500',
        paymentTerms: 'On LOE Signature',
        effectiveDate: '2026-06-15',
        requestDate: '2026-06-09',
        deliveryDate: '2026-07-10',
        deliveryTime: '4',
        clientDocuments: 'Rent Roll,Historical Operating Expenses,Purchase & Sale Agreement',
        previouslyAppraised: 'No',
        currentUse: 'Multi-tenant industrial / warehouse',
        proposedUse: 'Multi-tenant industrial / warehouse',
        cmhcFinancing: 'No',
        transactionStatus: 'Under Contract',
        zoningStatus: 'In Place',
        valuationPremises: 'Market Value',
        // Section 3 — Building Information
        yearBuilt: '2008',
        buildingSize: '84500',
        numberOfUnits: 12,
        parkingSpaces: 140,
        legalDescription: 'Plan 0712345, Block 4, Lot 7',
        // Section 4 — Property Research
        zoningClassification: 'I-G (Industrial General)',
        zoneAbbreviation: 'IG-2',
        landUseDesignation: 'Industrial',
        floodZone: 'Zone X (minimal risk)',
        utilities: 'Full municipal services',
        parcelNumber: '0192-837-465',
        grossLandSf: 84500,
        assessedValue: 11400000,
        taxes: 168000,
        assessmentYear: '2026',
        landAssessmentValue: 4200000,
        improvedAssessmentValue: 7200000,
        totalAssessmentValue: 11400000,
      } as any);
    }

    toast.success('Test data filled — pick a Cascade Options version to set Value Scenarios.');

    // Scroll to cascade anchor after a short tick so the DOM has updated
    setTimeout(() => {
      const el = document.getElementById('cascade-options-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  };

  return (
    <div className="space-y-2">
      {/* Fill Test Data — top-of-accordion button, fills all base fields */}
      <div className="flex justify-end px-1 pb-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleFillTestData}
          aria-disabled={isLiveValcreJob}
          title={isLiveValcreJob ? 'Not available — this job is connected to a live Valcre job.' : undefined}
          className={`text-xs border border-dashed border-gray-400 dark:border-white/20 text-muted-foreground hover:text-foreground hover:border-gray-600 dark:hover:border-white/40 transition-colors ${
            isLiveValcreJob ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Fill Test Data
        </Button>
      </div>

      {/* All sections are now independent Collapsibles */}
      <ClientSubmissionSection
        job={job}
        jobDetails={jobDetails}
        onUpdateDetails={onUpdateDetails}
        onUpdateJob={onUpdateJob}
      />

      <LoeQuoteSection
        job={job}
        jobDetails={jobDetails}
        onUpdateDetails={onUpdateDetails}
        refetchJobData={refetchJobData}
      />

      <OrganizingDocsSection
        job={job}
        jobDetails={jobDetails}
        onUpdateDetails={onUpdateDetails}
      />

      <PropertyInfoSection
        job={job}
        jobDetails={jobDetails}
        onUpdateDetails={onUpdateDetails}
      />

      <Section4Compact
        job={job}
        jobDetails={jobDetails}
        onUpdateDetails={onUpdateDetails}
      />
    </div>
  );
};

export default JobDetailAccordion;
