
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, File } from "lucide-react";
import { JobSubmission } from "@/types/job";

interface JobCardProps {
  job: JobSubmission;
  onSelect: () => void;
}

const statusColors = {
  submitted: "bg-blue-500",
  in_progress: "bg-amber-500",
  loe_pending: "bg-purple-500",
  completed: "bg-green-500",
};

const statusLabels = {
  submitted: "Submitted",
  in_progress: "In Progress",
  loe_pending: "LOE Pending",
  completed: "Completed",
};

const JobCard: React.FC<JobCardProps> = ({ job, onSelect }) => {
  const formattedDate = formatDistanceToNow(new Date(job.createdAt), {
    addSuffix: true,
  });

  return (
    <div 
      className="rounded-md border border-border bg-card shadow-md hover:shadow-lg transition-all duration-200 hover:border-primary/20 cursor-pointer"
      onClick={onSelect}
    >
      <div className="p-3 flex flex-col h-full">
        {/* Header with property address and status indicator */}
        <div className="flex items-start gap-2 mb-1.5">
          <div
            className={cn(
              "w-2 h-2 rounded-sm mt-1.5",
              statusColors[job.status as keyof typeof statusColors] || "bg-gray-400"
            )}
          />
          <h3 className="font-medium text-sm leading-tight line-clamp-1 text-card-foreground">{job.propertyAddress}</h3>
        </div>

        {/* Client name */}
        <div className="text-xs text-muted-foreground pl-4 mb-1.5">
          {job.clientFirstName} {job.clientLastName}
        </div>

        {/* Meta info: date and status */}
        <div className="flex justify-between items-center text-xs mt-auto">
          <div className="text-muted-foreground">{formattedDate}</div>
          <div className="font-medium text-xs">
            {statusLabels[job.status as keyof typeof statusLabels] || "Unknown"}
          </div>
        </div>

        {/* Hover indicator */}
        <div className="mt-2 pt-2 border-t border-border/50 flex justify-between items-center">
          <div className="flex items-center gap-1">
            <File className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">View</span>
          </div>
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

export default JobCard;
