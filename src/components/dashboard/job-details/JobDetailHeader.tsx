
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
    completed: "Completed",
  }[job.status] || "Unknown";

  const statusColor = {
    submitted: "bg-blue-500",
    in_progress: "bg-amber-500",
    loe_pending: "bg-purple-500",
    completed: "bg-green-500",
  }[job.status] || "bg-gray-400";

  // Extract just the CAL###### part for the header
  const baseJobNumber = job.jobNumber?.split(" - ")[0] || "";

  return (
    <div className="flex items-center space-x-4">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
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
      {isSaving && (
        <span className="text-xs text-muted-foreground animate-pulse">
          Saving changes...
        </span>
      )}
    </div>
  );
};

export default JobDetailHeader;
