import React from "react";
import { DetailJob, JobDetails } from "@/types/job";
import ClientSubmissionSection from "./job-details/ClientSubmissionSection";
import LoeQuoteSection from "./job-details/LoeQuoteSection";
import OrganizingDocsSection from "./job-details/OrganizingDocsSection";
import PropertyInfoSection from "./job-details/PropertyInfoSection";
import Section4Compact from "./job-details/Section4Compact";
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
        // propertyType intentionally omitted — Group-1 cascade trigger; left empty so the cascade section starts blank after Fill
        intendedUse: 'Financial Reporting',
        assetCondition: 'Good',
        valuationPremises: 'Market Value', // Client-section field reads from `job` (display); also kept on jobDetails below for the Valcre sync
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
        // jobStatus intentionally omitted — locked Valcre-native display, not a test value
        // purpose intentionally omitted — free-text user input, starts empty (self-describing placeholder)
        // statusOfImprovements intentionally omitted — set by Cascade Options
        // valueScenarios intentionally omitted — derived by cascade
        // authorizedUse intentionally omitted — set by Cascade Options
        // propertySubtype / tenancy / propertyRightsAppraised intentionally omitted — cascade Group-1 triggers + output;
        // left empty so the whole cascade section reads 'Pending' after Fill (start-empty-then-watch-it-work)
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

  // Clear — inverse of Fill Test Data. Wipes the test-filled fields back to empty (placeholder state).
  // Gated identically: never fires on a live Valcre job.
  const handleClearTestData = () => {
    if (isLiveValcreJob) {
      toast.info('Not available — this job is connected to a live Valcre job.');
      return;
    }
    const jobKeys = ['clientFirstName','clientLastName','clientTitle','clientOrganization','clientPhone','clientEmail','clientAddress','propertyName','propertyAddress','propertyType','intendedUse','assetCondition','valuationPremises','propertyContactFirstName','propertyContactLastName','propertyContactEmail','propertyContactPhone','notes'];
    const detailKeys = ['propertySubtype','tenancy','propertyRightsAppraised','valueTimeframe','scopeOfWork','reportType','reportFormat','assignmentType','analysisLevel','appraisalFee','retainerAmount','paymentTerms','effectiveDate','requestDate','deliveryDate','deliveryTime','clientDocuments','previouslyAppraised','currentUse','proposedUse','cmhcFinancing','transactionStatus','zoningStatus','valuationPremises','statusOfImprovements','authorizedUse','valueScenarios','approachesToValue','yearBuilt','buildingSize','numberOfUnits','parkingSpaces','legalDescription','zoningClassification','zoneAbbreviation','landUseDesignation','floodZone','utilities','parcelNumber','grossLandSf','assessedValue','taxes','assessmentYear','landAssessmentValue','improvedAssessmentValue','totalAssessmentValue'];
    if (onUpdateJob) onUpdateJob(Object.fromEntries(jobKeys.map(k => [k, ''])) as any);
    if (onUpdateDetails) onUpdateDetails(Object.fromEntries(detailKeys.map(k => [k, ''])) as any);
    toast.success('Test data cleared.');
  };

  return (
    <div className="space-y-2">
      {/* Test-data control — subtle frameless text links (NOT buttons). Layout: Clear · | · Fill with Test Data.
          Both gated: disabled/muted on a live Valcre job. */}
      <div className="flex justify-end items-center gap-2.5 px-1 pb-1 text-xs">
        <span
          role="button"
          onClick={handleClearTestData}
          title={isLiveValcreJob ? 'Not available — this job is connected to a live Valcre job.' : undefined}
          className={`text-muted-foreground hover:text-foreground transition-colors ${
            isLiveValcreJob ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          Clear
        </span>
        <span className="w-px h-3 bg-gray-300 dark:bg-white/20" />
        <span
          role="button"
          onClick={handleFillTestData}
          title={isLiveValcreJob ? 'Not available — this job is connected to a live Valcre job.' : undefined}
          className={`text-muted-foreground hover:text-foreground transition-colors ${
            isLiveValcreJob ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          Fill with Test Data
        </span>
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
