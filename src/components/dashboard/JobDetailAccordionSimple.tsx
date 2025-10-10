import React, { useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { DetailJob, JobDetails } from "@/types/job";
import ClientSubmissionSection from "./job-details/ClientSubmissionSection";
import LoeQuoteSection from "./job-details/LoeQuoteSection";
import OrganizingDocsSection from "./job-details/OrganizingDocsSection";
import PropertyInfoSection from "./job-details/PropertyInfoSection";
import Section4Compact from "./job-details/Section4Compact";

// Simple independent collapsible section component
const IndependentSection = ({ 
  title, 
  children,
  defaultOpen = true 
}: { 
  title: string; 
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="w-full border-2 border-blue-500 rounded-lg bg-white mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span className="text-base font-medium">{title}</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 py-4 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

interface JobDetailAccordionSimpleProps {
  job: DetailJob;
  jobDetails?: JobDetails;
  onUpdateDetails?: (details: Partial<JobDetails>) => void;
  onUpdateJob?: (updates: Partial<DetailJob>) => void;
}

const JobDetailAccordionSimple: React.FC<JobDetailAccordionSimpleProps> = ({
  job,
  jobDetails = {},
  onUpdateDetails,
  onUpdateJob,
}) => {
  // All accordion sections open by default
  const [openSections, setOpenSections] = useState<string[]>([
    "section-1",
    "section-2", 
    "section-3a"
  ]);

  return (
    <div className="space-y-4">
      {/* Main Accordion for first 3 sections */}
      <div className="border-2 border-green-500 p-2 rounded-lg">
        <h3 className="text-sm font-bold text-green-600 mb-2">ACCORDION GROUP (Sections 1-3a)</h3>
        <Accordion
          type="multiple"
          value={openSections}
          onValueChange={setOpenSections}
          className="space-y-2"
        >
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
          />

          <OrganizingDocsSection
            job={job}
            jobDetails={jobDetails}
            onUpdateDetails={onUpdateDetails}
          />
        </Accordion>
      </div>

      {/* Independent Section 3b - Property Info */}
      <div className="border-2 border-orange-500 p-2 rounded-lg">
        <h3 className="text-sm font-bold text-orange-600 mb-2">INDEPENDENT SECTION 3b (Property Research)</h3>
        <PropertyInfoSection
          job={job}
          jobDetails={jobDetails}
          onUpdateDetails={onUpdateDetails}
        />
      </div>

      {/* Independent Section 4 - Document Upload with guaranteed bottom padding */}
      <div className="border-2 border-red-500 p-2 rounded-lg" style={{ marginBottom: '200px' }}>
        <h3 className="text-sm font-bold text-red-600 mb-2">INDEPENDENT SECTION 4 (Document Upload) - 200px padding below</h3>
        <Section4Compact
          job={job}
          jobDetails={jobDetails}
          onUpdateDetails={onUpdateDetails}
        />
      </div>

      {/* Visual padding indicator */}
      <div className="fixed bottom-0 right-0 bg-yellow-300 text-black p-2 text-xs">
        Bottom padding area (128px)
      </div>
    </div>
  );
};

export default JobDetailAccordionSimple;