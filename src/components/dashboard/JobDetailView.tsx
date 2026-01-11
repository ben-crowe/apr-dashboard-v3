import React from "react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import JobDetailAccordion from "./JobDetailAccordion"; // Use the correct clean version
// import JobDetailAccordion from "./JobDetailAccordionSimple"; // TEMPORARY - Testing simplified version
// import JobDetailAccordion from "./JobDetailAccordionFixed"; // DO NOT USE - has wrong fields
import JobDetailHeader from "./job-details/JobDetailHeader";
// JobDetailActions removed - unnecessary buttons causing clutter
import JobDetailSkeleton from "./job-details/JobDetailSkeleton";
import JobNotFound from "./job-details/JobNotFound";
import { useJobDetail } from "@/hooks/useJobDetail";
import { formatJobNumber } from "@/utils/formatters";
import { isValcreJobNumber, isPendingValcreJob, hasRealValcreJob } from "@/config/valcre";

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
    isSending,
    isGenerating,
    isCreatingGoogle,
    isSendingFinal,
    isSaving,
    googleFolderStatus,
    handleUpdateDetails,
    handleUpdateJob,
    handleSendToValcre,
    handleSendToPandadoc,
    handleCreateGoogleFolder,
    handleGenerateContract,
    handleSendFinalData,
    handleSignatureSent,
    refetchJobData,
  } = useJobDetail(jobId);

  const handleBeginReport = () => {
    navigate(`/dashboard/job/${jobId}/report`);
  };

  // Check if we have a REAL Valcre job (has valcre_job_id - definitive proof)
  // OR a valid job number that's not PENDING
  const hasValidValcreJob = hasRealValcreJob(jobDetails) || 
                           (isValcreJobNumber(jobDetails?.jobNumber) && !isPendingValcreJob(jobDetails?.jobNumber));

  if (isLoading) {
    return <JobDetailSkeleton onBack={onBack} />;
  }

  if (!job) {
    return <JobNotFound onBack={onBack} />;
  }

  return (
    <div className="space-y-8 px-6 md:px-10 py-6 pb-32">
      <div className="flex flex-col space-y-5">
        <JobDetailHeader job={job} onBack={onBack} isSaving={isSaving} />

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {formatJobNumber(job.jobNumber, job)}
          </h1>

          {hasValidValcreJob ? (
            <Button
              onClick={handleBeginReport}
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 px-2.5 py-1.5 border-slate-400/50 dark:border-slate-700/50 text-foreground hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-500/60 dark:hover:border-slate-600/60"
            >
              <FileText className="h-3.5 w-3.5" />
              Begin Report
            </Button>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={true}
                      className="px-2.5 py-1.5 border-slate-400/30 dark:border-slate-700/30 text-muted-foreground opacity-50 cursor-not-allowed"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Begin Report
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Create a Valcre job number first</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* JobDetailActions removed - all buttons moved to their respective sections */}
      </div>

      <Separator />

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
