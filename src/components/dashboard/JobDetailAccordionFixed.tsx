import React from "react";
import { DetailJob, JobDetails } from "@/types/job";
import ClientSubmissionSectionIndependent from "./job-details/ClientSubmissionSectionIndependent";
import LoeQuoteSectionIndependent from "./job-details/LoeQuoteSectionIndependent";
import OrganizingDocsSectionIndependent from "./job-details/OrganizingDocsSectionIndependent";
import PropertyInfoSectionIndependent from "./job-details/PropertyInfoSectionIndependent";
import Section4CompactIndependent from "./job-details/Section4CompactIndependent";

interface JobDetailAccordionFixedProps {
  job: DetailJob;
  jobDetails?: JobDetails;
  onUpdateDetails?: (details: Partial<JobDetails>) => void;
  onUpdateJob?: (updates: Partial<DetailJob>) => void;
}

const JobDetailAccordionFixed: React.FC<JobDetailAccordionFixedProps> = ({
  job,
  jobDetails = {},
  onUpdateDetails,
  onUpdateJob,
}) => {
  // REMOVED: Auto-calculation of retainer amount - field must be user-editable
  // Previously this useEffect was overwriting user input immediately after typing
  // Client needs to manually set retainer amount per job

  return (
    // MASTER CONTAINER - Contains all sections
    <div className="w-full border-2 border-gray-300 rounded-lg bg-white shadow-lg p-4">
      <h2 className="text-lg font-bold mb-4 text-gray-700">All Job Details</h2>
      
      {/* Section 1 - Client Submission (Independent) */}
      <div className="mb-4">
        <ClientSubmissionSectionIndependent
          job={job}
          jobDetails={jobDetails}
          onUpdateDetails={onUpdateDetails}
          onUpdateJob={onUpdateJob}
        />
      </div>

      {/* Section 2 - LOE Quote (Independent) */}
      <div className="mb-4">
        <LoeQuoteSectionIndependent
          job={job}
          jobDetails={jobDetails}
          onUpdateDetails={onUpdateDetails}
        />
      </div>

      {/* Section 3a - Organizing Docs (Independent) */}
      <div className="mb-4">
        <OrganizingDocsSectionIndependent
          job={job}
          jobDetails={jobDetails}
          onUpdateDetails={onUpdateDetails}
        />
      </div>

      {/* Section 3b - Independent collapsible within master container */}
      <div className="mb-4">
        <PropertyInfoSectionIndependent
          job={job}
          jobDetails={jobDetails}
          onUpdateDetails={onUpdateDetails}
        />
      </div>

      {/* Section 4 - Independent collapsible within master container */}
      <div className="mb-32">
        <Section4CompactIndependent
          job={job}
          jobDetails={jobDetails}
          onUpdateDetails={onUpdateDetails}
        />
      </div>

      {/* Extra padding at bottom of master container */}
      <div className="h-20"></div>
    </div>
  );
};

export default JobDetailAccordionFixed;