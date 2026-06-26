import React from "react";
import { useNavigate } from "react-router-dom";
import { Settings, FileText } from "lucide-react";
import JobDetailAccordion from "./JobDetailAccordion"; // Use the correct clean version
import JobDetailHeader from "./job-details/JobDetailHeader";
import JobDetailSkeleton from "./job-details/JobDetailSkeleton";
import JobNotFound from "./job-details/JobNotFound";
import { Button } from "@/components/ui/button";
import { useJobDetail } from "@/hooks/useJobDetail";
import { isV4Enabled } from "@/lib/featureFlags";
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

  // FIX 5a — "Create Report": persist this job's intake to the EXISTING row, then open V4.
  // enabled-when-filled = the LOE required set (first/last/email/property-address) — mirrors
  // the existing LOE gate, NOT the wider Valcre gate.
  const canCreateReport = !!(
    job?.clientFirstName &&
    job?.clientLastName &&
    job?.clientEmail &&
    job?.propertyAddress
  );

  // SAVE→PULL ordering (gate finding): useLoadJobIntoReport reads SAVED job_submissions rows,
  // so persist the current intake to the EXISTING row FIRST (await), THEN navigate so the
  // bridge pulls fresh-not-stale. handleUpdateJob does update().eq('id', job.id) — UPDATE-by-id,
  // never INSERT (no duplicate job row). Passing the whole `job` re-persists the on-screen
  // intake (a `{}` call would risk an empty PostgREST update).
  const handleCreateReport = async () => {
    if (!job || !jobId) return;
    await handleUpdateJob(job);
    navigate(`/dashboard/job/${jobId}/report`);
  };

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
            {/* Create Report — FIX 5a. Visible only when V4 is enabled (the report route is
                registered ONLY under isV4Enabled(); with V4 off the nav would redirect to the
                dashboard, so we don't show a dead button). Disabled until the LOE-required intake
                fields are present (enabled-when-filled). */}
            {isV4Enabled() && (
              <Button
                type="button"
                size="sm"
                onClick={handleCreateReport}
                disabled={!canCreateReport}
                title={
                  canCreateReport
                    ? "Save this job's intake and open the report builder"
                    : "Fill client first name, last name, email, and property address to enable"
                }
              >
                <FileText className="h-4 w-4" />
                Create Report
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
