
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { DetailJob } from "@/types/job";

interface JobDetailHeaderProps {
  job: DetailJob;
  onBack: () => void;
  isSaving: boolean;
}

const JobDetailHeader: React.FC<JobDetailHeaderProps> = ({ job, onBack, isSaving }) => {
  const statusLabel = {
    submitted: "Submitted",
    in_progress: "In Progress",
    loe_pending: "LOE Pending",
    loe_signed: "LOE Signed",
    completed: "Completed",
  }[job.status] || "Unknown";

  const statusColor = {
    submitted: "bg-slate-400",
    in_progress: "bg-amber-400",
    loe_pending: "bg-purple-400",
    loe_signed: "bg-emerald-500",
    completed: "bg-emerald-600",
  }[job.status] || "bg-gray-400";

  // Extract just the CAL###### part for the header
  const baseJobNumber = job.jobNumber?.split(" - ")[0] || "";

  return (
    <div className="flex items-center space-x-4">
      <Button 
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground dark:hover:text-gray-200 transition-colors text-sm font-medium hover:bg-transparent dark:hover:bg-transparent"
      >
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
        Back
      </Button>
      <div className="flex items-center space-x-2">
        {/* Status bubble removed - unnecessary clutter */}
        <span className="text-sm font-medium">{statusLabel}</span>
        {baseJobNumber && (
          <span className="text-sm text-muted-foreground">
            #{baseJobNumber}
          </span>
        )}
      </div>
      {/* In-flight = subtle spinner, no words (Ben's notification rule). */}
      {isSaving && <Loader2 className="h-3.5 w-3.5 text-muted-foreground animate-spin" aria-label="Saving" />}
    </div>
  );
};

export default JobDetailHeader;
