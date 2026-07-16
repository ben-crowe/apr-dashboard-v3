
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight, MoreVertical, Eye, Pencil, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatJobNumber } from "@/utils/formatters";
import { JobSubmission } from "@/types/job";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ArchiveJobDialog } from "./job-list/ArchiveJobDialog";

interface JobListItemProps {
  job: JobSubmission;
  onSelect: () => void;
  // Called after an archive or permanent delete so the list refetches (job leaves the active list).
  onDelete?: () => void;
}

const statusColors = {
  submitted: "bg-slate-400",
  in_progress: "bg-amber-400",
  loe_pending: "bg-purple-400",
  loe_signed: "bg-emerald-500",
  completed: "bg-emerald-600",
};

const statusLabels = {
  submitted: "Submitted",
  in_progress: "In Progress",
  loe_pending: "LOE Pending",
  loe_signed: "LOE Signed",
  completed: "Completed",
};

const JobListItem: React.FC<JobListItemProps> = ({ job, onSelect, onDelete }) => {
  // Item 7B — the top-level Trash2 delete is gone. The row's action menu offers View / Edit / Archive,
  // with Archive the primary new action; a true permanent delete lives inside the archive dialog behind
  // its own confirm, so nobody deletes files and folders by reflex.
  const [archiveOpen, setArchiveOpen] = useState(false);
  const formattedDate = formatDistanceToNow(new Date(job.createdAt), {
    addSuffix: true,
  });

  const jobIdentifier = formatJobNumber(job.jobNumber, job);

  return (
    <>
      <div
        onClick={onSelect}
        className="flex items-center px-3 py-2 hover:bg-secondary/50 rounded-md cursor-pointer border-b border-border/30 group transition-colors"
      >
        {/* Status indicator */}
        <div
          className={cn(
            "w-1.5 h-1.5 rounded-sm mr-3 flex-shrink-0 opacity-70",
            statusColors[job.status as keyof typeof statusColors] || "bg-gray-400"
          )}
        />

        {/* Job ID and Address - main column */}
        <div className="flex-grow min-w-0">
          <div className="font-medium text-sm truncate" title={jobIdentifier}>
            {jobIdentifier}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {job.clientFirstName} {job.clientLastName}
          </div>
        </div>

        {/* Date */}
        <div className="text-xs text-muted-foreground whitespace-nowrap px-4 ml-2">
          {formattedDate}
        </div>

        {/* Status */}
        <div className="text-xs font-medium whitespace-nowrap w-24 text-right">
          {statusLabels[job.status as keyof typeof statusLabels] || "Unknown"}
        </div>

        {/* Action menu — View / Edit / Archive (Archive is the primary action) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="ml-2 p-1 rounded hover:bg-secondary opacity-0 group-hover:opacity-100 transition-opacity data-[state=open]:opacity-100"
              aria-label="Job actions"
              data-testid="job-actions-trigger"
            >
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onSelect={() => onSelect()}>
              <Eye className="mr-2 h-4 w-4" /> View job
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onSelect()}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => setArchiveOpen(true)}
              data-testid="archive-action"
              className="text-primary focus:text-primary"
            >
              <Archive className="mr-2 h-4 w-4" />
              <span className="flex flex-col">
                Archive job
                <span className="text-[10.5px] text-muted-foreground">
                  removes it from the active list — keeps the record
                </span>
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Action indicator */}
        <ChevronRight className="h-4 w-4 text-muted-foreground ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <ArchiveJobDialog
        job={job}
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        onDone={() => onDelete?.()}
      />
    </>
  );
};

export default JobListItem;
