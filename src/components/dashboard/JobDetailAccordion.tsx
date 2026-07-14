import React, { useState } from "react";
import { DetailJob, JobDetails } from "@/types/job";
import ClientSubmissionSection from "./job-details/ClientSubmissionSection";
import { JobDocumentsPanel } from "@/features/job-documents/JobDocumentsPanel";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SectionTitle } from "./job-details/ValcreStyles";
import LoeQuoteSection from "./job-details/LoeQuoteSection";
import OrganizingDocsSection from "./job-details/OrganizingDocsSection";
import PropertyInfoSection from "./job-details/PropertyInfoSection";
import Section4Compact from "./job-details/Section4Compact";
import { toast } from "sonner";
import { isValcreJobNumber } from "@/config/valcre";
import { useTestMode } from "@/contexts/TestModeContext";
import { Separator } from "@/components/ui/separator";
import { isV4Enabled } from "@/lib/featureFlags";
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";

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

  // Client Documents section — collapsible like every other section on this page. Open by default
  // so the sorting work is visible without a click; closes like the rest.
  const [clientDocsOpen, setClientDocsOpen] = useState(true);

  // RULE 1 — test tools self-disable on a real (live-synced) Valcre job.
  const isLiveValcreJob = isValcreJobNumber(jobDetails?.jobNumber) && !!(jobDetails as any)?.valcreJobId;

  // True once Fill was pressed — holds LoeQuoteSection's cascade cluster empty until a pick.
  const [testFilled, setTestFilled] = React.useState(false);
  // Bumped on Fill/Clear to snap the cascade picker back to its unpicked default.
  const [cascadeResetToken, setCascadeResetToken] = React.useState(0);
  // "Insert from data" toggle (mock parity) — shared by Section 1 (source fields yellow) and
  // Section 2 (the checkbox + mirror/Property-Rights mapping). OFF by default; reset on Fill/Clear.
  const [insertFromData, setInsertFromData] = React.useState(false);

  // Expand / collapse ALL sections — a shared signal each section watches via useEffect.
  const [allSectionsOpen, setAllSectionsOpen] = React.useState(false);
  const [openAllSignal, setOpenAllSignal] = React.useState<{
    open: boolean;
    n: number;
  } | null>(null);
  const toggleAllSections = () => {
    const next = !allSectionsOpen;
    setAllSectionsOpen(next);
    setOpenAllSignal((s) => ({ open: next, n: (s?.n || 0) + 1 }));
  };

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
        clientAddress: '350 7th Avenue SW, Suite 1800',
        clientCity: 'Calgary',
        clientProvince: 'AB',
        clientPostal: 'T2P 3N9',
        propertyName: 'Riverside Commerce Centre',
        propertyAddress: '4820 Macleod Trail SE',
        propertyCity: 'Calgary',
        propertyProvince: 'AB',
        propertyPostal: 'T2G 0A5',
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
        appraisalFee: 5000, // FIX 3 (2026-06-23): clean flat default (was 6500)
        retainerAmount: '', // FIX 3 (2026-06-23): no dollar amount — contract standard is 100% on signing (was '1500')
        effectiveDate: '2026-06-15',
        requestDate: '2026-06-09',
        deliveryDate: '2026-07-10',
        deliveryTime: '3',
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
    const jobKeys = ['clientFirstName','clientLastName','clientTitle','clientOrganization','clientPhone','clientEmail','clientAddress','clientCity','clientProvince','clientPostal','propertyName','propertyAddress','propertyCity','propertyProvince','propertyPostal','propertyType','intendedUse','assetCondition','valuationPremises','propertyContactFirstName','propertyContactLastName','propertyContactEmail','propertyContactPhone','notes'];
    const detailKeys = ['propertySubtype','tenancy','propertyRightsAppraised','valueTimeframe','scopeOfWork','reportType','reportFormat','assignmentType','analysisLevel','appraisalFee','retainerAmount','effectiveDate','requestDate','deliveryDate','deliveryTime','clientDocuments','previouslyAppraised','currentUse','proposedUse','cmhcFinancing','transactionStatus','zoningStatus','valuationPremises','statusOfImprovements','authorizedUse','valueScenarios','approachesToValue','yearBuilt','buildingSize','numberOfUnits','parkingSpaces','legalDescription','zoningClassification','zoneAbbreviation','landUseDesignation','floodZone','utilities','parcelNumber','grossLandSf','assessedValue','taxes','assessmentYear','landAssessmentValue','improvedAssessmentValue','totalAssessmentValue'];
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
      {/* Expand / collapse all sections — small icon, top-right, always visible. */}
      <div className="flex justify-end px-1">
        <button
          onClick={toggleAllSections}
          title={allSectionsOpen ? "Collapse all sections" : "Expand all sections"}
          className="p-1.5 rounded border border-gray-400 dark:border-white/20 text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          {allSectionsOpen ? (
            <ChevronsDownUp className="h-4 w-4" />
          ) : (
            <ChevronsUpDown className="h-4 w-4" />
          )}
        </button>
      </div>

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
        forceOpen={openAllSignal}
      />

      {/* Client documents — sort the client's submitted files into the job's five real folders and
          preview what is in each, in-app. ADDITIVE: the client-submission section above is untouched
          and still lists and accepts the client's uploads exactly as before.
          Collapsible with the SAME chevron header the other sections use — reused, not rebuilt. */}
      <Collapsible
        open={clientDocsOpen}
        onOpenChange={setClientDocsOpen}
        className="w-full border border-gray-400 dark:border-white/20 rounded-lg dark:bg-black/15"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 bg-gray-200 dark:bg-gray-800 rounded-t-lg">
          <div className="flex items-center gap-2">
            {clientDocsOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <SectionTitle title="Client Documents" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4">
          <JobDocumentsPanel jobId={job.id} folderUrl={(job as any)?.sharepointFolderUrl ?? null} />
        </CollapsibleContent>
      </Collapsible>

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
        forceOpen={openAllSignal}
      />

      {/* ── V4 GATE — section 3 onward (property research + report content) ──────────────
          Sections 1–2 above (intake + LOE) are the standalone V3 product Chris's team ships
          with; sections 3–4 are the V4 transition and stay DARK unless VITE_V4_ENABLED='true'.
          Conditional-mount (not CSS-hide) so no V4 code runs in the client build.
          ⚑ Any FUTURE section-3 entry button/link/affordance added here MUST also read
          isV4Enabled() — do not leave an ungated door into the gated surface. */}
      {isV4Enabled() && (
        <>
          <OrganizingDocsSection
            job={job}
            jobDetails={jobDetails}
            onUpdateDetails={onUpdateDetails}
            forceOpen={openAllSignal}
          />

          <PropertyInfoSection
            job={job}
            jobDetails={jobDetails}
            onUpdateDetails={onUpdateDetails}
            forceOpen={openAllSignal}
          />

          <Section4Compact
            job={job}
            jobDetails={jobDetails}
            onUpdateDetails={onUpdateDetails}
            forceOpen={openAllSignal}
          />
        </>
      )}
    </div>
  );
};

export default JobDetailAccordion;
