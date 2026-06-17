import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import JobDetailAccordion from "./JobDetailAccordion"; // Use the correct clean version
import JobDetailHeader from "./job-details/JobDetailHeader";
import JobDetailSkeleton from "./job-details/JobDetailSkeleton";
import JobNotFound from "./job-details/JobNotFound";
import { Button } from "@/components/ui/button";
import { isV4Enabled } from "@/lib/featureFlags";
import { useJobDetail } from "@/hooks/useJobDetail";
import { formatJobNumber } from "@/utils/formatters";

interface JobDetailViewProps {
  jobId: string;
  onBack: () => void;
}

const JobDetailView: React.FC<JobDetailViewProps> = ({ jobId, onBack }) => {
  const navigate = useNavigate();
  const {
    job,
    jobDetails,
    isLoading,
    isSaving,
    handleUpdateDetails,
    handleUpdateJob,
    refetchJobData,
  } = useJobDetail(jobId);

  if (isLoading) {
    return <JobDetailSkeleton onBack={onBack} />;
  }

  if (!job) {
    return <JobNotFound onBack={onBack} />;
  }

  return (
    <div className="max-w-[960px] mx-auto space-y-6 px-6 md:px-10 py-6 pb-32">
      <div className="flex flex-col space-y-5">
        <JobDetailHeader job={job} onBack={onBack} isSaving={isSaving} />

        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            {formatJobNumber(job.jobNumber, job)}
          </h1>
          {/* Report Builder entry — opens the SEPARATE report builder app with this job's data
              mapped in. Gated: only shows in our V4-lit build, never on Chris's client build.
              Any future section-3 entry point must likewise read isV4Enabled(). */}
          {isV4Enabled() && (
            <Button
              variant="default"
              onClick={() => navigate(`/dashboard/job/${jobId}/report`)}
              className="shrink-0"
            >
              <FileText className="mr-2 h-4 w-4" />
              Report Builder
            </Button>
          )}
        </div>
      </div>

      <JobDetailAccordion
        job={job}
        jobDetails={jobDetails}
        onUpdateDetails={handleUpdateDetails}
        onUpdateJob={handleUpdateJob}
        refetchJobData={refetchJobData}
      />
    </div>
  );
};

export default JobDetailView;
