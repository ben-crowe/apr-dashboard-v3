import React from "react";
import { DetailJob, JobDetails } from "@/types/job";
import ClientSubmissionSection from "./job-details/ClientSubmissionSection";
import LoeQuoteSection from "./job-details/LoeQuoteSection";
import OrganizingDocsSection from "./job-details/OrganizingDocsSection";
import PropertyInfoSection from "./job-details/PropertyInfoSection";
import Section4Compact from "./job-details/Section4Compact";

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

  return (
    <div className="space-y-2">
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
