
import React from "react";
import { Progress } from "@/components/ui/progress";
import { JobStatus } from "@/types/job";

type ProgressIndicatorProps = {
  status: JobStatus;
};

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ status }) => {
  // Helper function to calculate progress percentage
  const getProgressPercentage = (): number => {
    const statusMap: Record<JobStatus, number> = {
      'submitted': 15,
      'in_progress': 30,
      'loe_pending': 60,
      'completed': 100
    };
    
    return statusMap[status] || 5;
  };

  return (
    <div className="space-y-1">
      <div className="text-sm text-muted-foreground">Progress</div>
      <Progress value={getProgressPercentage()} className="h-2" />
    </div>
  );
};

export default ProgressIndicator;
