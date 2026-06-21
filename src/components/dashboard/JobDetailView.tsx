import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Settings } from "lucide-react";
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
          <div className="flex items-center gap-3 flex-none">
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
            {/* Asset Studio — quiet configure-affordance at the PAGE TOP (under the ribbon, far right),
                deliberately OFF the LOE action row so it never reads as a peer of the produce buttons.
                Opens the Studio (mounted in LoeQuoteSection) via a decoupled window event. */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('apr:open-asset-studio'))}
              title="Asset Studio — Document, Email & Popup library + sequence map"
              className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Settings className="h-4 w-4 transition-transform duration-150 group-hover:rotate-45" />
              Asset Studio
            </button>
          </div>
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
