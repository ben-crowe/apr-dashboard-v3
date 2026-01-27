import React from "react";
import { Separator } from "@/components/ui/separator";
import JobDetailAccordion from "./JobDetailAccordion"; // Use the correct clean version
// import JobDetailAccordion from "./JobDetailAccordionSimple"; // TEMPORARY - Testing simplified version
// import JobDetailAccordion from "./JobDetailAccordionFixed"; // DO NOT USE - has wrong fields
import JobDetailHeader from "./job-details/JobDetailHeader";
// JobDetailActions removed - unnecessary buttons causing clutter
import JobDetailSkeleton from "./job-details/JobDetailSkeleton";
import JobNotFound from "./job-details/JobNotFound";
import { useJobDetail } from "@/hooks/useJobDetail";
import { formatJobNumber } from "@/utils/formatters";

interface JobDetailViewProps {
  jobId: string;
  onBack: () => void;
}

const JobDetailView: React.FC<JobDetailViewProps> = ({ jobId, onBack }) => {
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

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {formatJobNumber(job.jobNumber, job)}
          </h1>
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
