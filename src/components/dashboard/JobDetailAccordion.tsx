import React from "react";
import { DetailJob, JobDetails } from "@/types/job";
import ClientSubmissionSection from "./job-details/ClientSubmissionSection";
import LoeQuoteSection from "./job-details/LoeQuoteSection";
import OrganizingDocsSection from "./job-details/OrganizingDocsSection";
import PropertyInfoSection from "./job-details/PropertyInfoSection";
import Section4Compact from "./job-details/Section4Compact";
import { toast } from "sonner";
import { isValcreJobNumber } from "@/config/valcre";
import { useTestMode } from "@/contexts/TestModeContext";
import { Separator } from "@/components/ui/separator";

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
  // Test Mode is GLOBAL now (toggle lives in the header). The Fill/Clear links + cascade demo
  // + source-reference badges read it from context.
  const { testMode } = useTestMode();

  // RULE 1 — test tools self-disable on a real (live-synced) Valcre job.
  const isLiveValcreJob = isValcreJobNumber(jobDetails?.jobNumber) && !!(jobDetails as any)?.valcreJobId;

  // True once Fill was pressed — holds LoeQuoteSection's cascade cluster empty until a pick.
  const [testFilled, setTestFilled] = React.useState(false);
  // Bumped on Fill/Clear to snap the cascade picker back to its unpicked default.
  const [cascadeResetToken, setCascadeResetToken] = React.useState(0);
  // "Insert from data" toggle (mock parity) — shared by Section 1 (source fields yellow) and
  // Section 2 (the checkbox + mirror/Property-Rights mapping). OFF by default; reset on Fill/Clear.
  const [insertFromData, setInsertFromData] = React.useState(false);

  const handleFillTestData = () => {
    if (isLiveValcreJob) {
      void 0 /* success: silent (Ben) */;
      return;
    }
    // Smart Fill: if Section 1 already holds real submission data, DON'T clobber it —
    // fill only Section 2. Only fill Section 1 when the job is blank.
    const section1HasData = !!(job.clientFirstName || job.clientEmail || job.propertyName);
    if (!section1HasData && onUpdateJob) {
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
        intendedUse: 'First Mortgage Financing', // mock intake Authorized Use; V4 overrides → Insurance, Clear restores this
        assetCondition: 'Good',
        valuationPremises: 'Market Value',
        propertyContactFirstName: 'Daniel',
        propertyContactLastName: 'Okafor',
        propertyContactEmail: 'd.okafor@riversidecc.ca',
        propertyContactPhone: '(403) 555-0199',
        notes: 'Refinancing appraisal; site access via property manager Daniel Okafor.',
      });
    }

    if (onUpdateDetails) {
      onUpdateDetails({
        // Section 2 — LOE Quote (base, no cascade inputs). statusOfImprovements/valueScenarios/
        // authorizedUse/propertyRightsAppraised/approachesToValue omitted — set by Cascade Options.
        propertySubtype: 'Mixed-Use', // mock 'Mixed Use' → live option is hyphenated 'Mixed-Use' (space = blank)
        tenancy: 'Multi-Tenant',
        // valueTimeframe intentionally NOT filled — the mock skips it (FILL_SKIP) and the scenario
        // dash-rule shows it as "—". Filling it diverged from the mock.
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
        currentUse: 'Industrial',   // must match a Current Use option (Vacant Land/Single Family/
        proposedUse: 'Industrial',  // Multifamily/Retail/Industrial/Office) or the Select renders blank.
        cmhcFinancing: 'No',
        transactionStatus: 'Under Contract',
        zoningStatus: 'In Place',
        valuationPremises: 'Market Value',
        yearBuilt: '2008',
        buildingSize: '84500',
        numberOfUnits: 12,
        parkingSpaces: 140,
        legalDescription: 'Plan 0712345, Block 4, Lot 7',
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
        // Property Rights IS source-data (Type+Subtype+Tenancy → Leased Fee Interest, Tenancy wins) —
        // the mock fills it on Fill + lights it yellow, so we set it here too (not scenario-gated).
        propertyRightsAppraised: 'Leased Fee Interest',
        // SCENARIO-derived fields stay EMPTY after Fill (they fill only when a scenario is picked).
        // These MUST live in this SINGLE update — a separate second onUpdateDetails call was
        // clobbering the whole object (stale-closure merge), which blanked all of Section 2.
        statusOfImprovements: '',
        valueScenarios: '',
        approachesToValue: '',
      } as any);
    }

    setTestFilled(true);
    setInsertFromData(true); // mock parity: Fill auto-checks "Insert from data" → sources light yellow + map now
    setCascadeResetToken((t) => t + 1); // snap the cascade picker back to "pick a scenario"

    void 0 /* success: silent (Ben) */;

    // Scroll to the cascade picker and pulse it so the eye lands on "now pick a scenario."
    setTimeout(() => {
      const el = document.getElementById('cascade-options-anchor');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('cascade-pulse');
        setTimeout(() => el.classList.remove('cascade-pulse'), 8000);
      }
    }, 150);
  };

  const handleClearTestData = () => {
    if (isLiveValcreJob) {
      void 0 /* success: silent (Ben) */;
      return;
    }
    const jobKeys = ['clientFirstName','clientLastName','clientTitle','clientOrganization','clientPhone','clientEmail','clientAddress','propertyName','propertyAddress','propertyType','intendedUse','assetCondition','valuationPremises','propertyContactFirstName','propertyContactLastName','propertyContactEmail','propertyContactPhone','notes'];
    const detailKeys = ['propertySubtype','tenancy','propertyRightsAppraised','valueTimeframe','scopeOfWork','reportType','reportFormat','assignmentType','analysisLevel','appraisalFee','retainerAmount','paymentTerms','effectiveDate','requestDate','deliveryDate','deliveryTime','clientDocuments','previouslyAppraised','currentUse','proposedUse','cmhcFinancing','transactionStatus','zoningStatus','valuationPremises','statusOfImprovements','authorizedUse','valueScenarios','approachesToValue','yearBuilt','buildingSize','numberOfUnits','parkingSpaces','legalDescription','zoningClassification','zoneAbbreviation','landUseDesignation','floodZone','utilities','parcelNumber','grossLandSf','assessedValue','taxes','assessmentYear','landAssessmentValue','improvedAssessmentValue','totalAssessmentValue'];
    if (onUpdateJob) onUpdateJob(Object.fromEntries(jobKeys.map((k) => [k, ''])) as any);
    if (onUpdateDetails) onUpdateDetails(Object.fromEntries(detailKeys.map((k) => [k, ''])) as any);
    setTestFilled(false); // back to real-job behavior — cascade derives naturally again
    setInsertFromData(false);
    setCascadeResetToken((t) => t + 1);
    setCascadeResetToken((t) => t + 1);
    void 0 /* success: silent (Ben) */;
  };

  return (
    <div className="space-y-2">
      {/* Test-data links — frameless text, top-right. Shown ONLY in Test Mode (global toggle).
          Gated on a live Valcre job too. */}
      {testMode && (
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
      )}

      {/* The divider sits BELOW the test links so Clear/Fill ride just above the line
          (no gap pushing the form down). In non-test mode it's the plain header divider. */}
      <Separator />

      {/* All sections are now independent Collapsibles */}
      <ClientSubmissionSection
        job={job}
        jobDetails={jobDetails}
        onUpdateDetails={onUpdateDetails}
        onUpdateJob={onUpdateJob}
        testMode={testMode}
        insertFromData={insertFromData}
      />

      <LoeQuoteSection
        job={job}
        jobDetails={jobDetails}
        onUpdateDetails={onUpdateDetails}
        onUpdateJob={onUpdateJob}
        refetchJobData={refetchJobData}
        testMode={testMode}
        testFilled={testFilled}
        cascadeResetToken={cascadeResetToken}
        insertFromData={insertFromData}
        setInsertFromData={setInsertFromData}
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
