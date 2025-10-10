
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatJobNumber } from "@/utils/formatters";
import { JobSubmission } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface JobListItemProps {
  job: JobSubmission;
  onSelect: () => void;
  onDelete?: () => void;
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

const JobListItem: React.FC<JobListItemProps> = ({ job, onSelect, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const formattedDate = formatDistanceToNow(new Date(job.createdAt), {
    addSuffix: true,
  });

  // Format job ID and property information
  const jobIdentifier = formatJobNumber(job.jobNumber, job);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting the job
    
    if (!confirm(`Delete job for ${job.clientFirstName} ${job.clientLastName}?`)) {
      return;
    }

    setIsDeleting(true);
    
    try {
      // Delete related records first
      await supabase.from('job_loe_details').delete().eq('job_id', job.id);
      await supabase.from('job_details').delete().eq('job_id', job.id);
      await supabase.from('job_files').delete().eq('job_id', job.id);
      
      // Then delete the main job
      const { error } = await supabase
        .from('job_submissions')
        .delete()
        .eq('id', job.id);

      if (error) throw error;
      
      toast.success('Job deleted successfully');
      if (onDelete) onDelete();
      
    } catch (error: any) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div 
      onClick={onSelect}
      className="flex items-center px-3 py-2 hover:bg-secondary/50 rounded-md cursor-pointer border-b border-border/30 group transition-colors"
    >
      {/* Status indicator */}
      <div
        className={cn(
          "w-2 h-2 rounded-full mr-3 flex-shrink-0",
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
      
      {/* Delete button */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="ml-2 p-1 rounded hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
        aria-label="Delete job"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </button>
      
      {/* Action indicator */}
      <ChevronRight className="h-4 w-4 text-muted-foreground ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default JobListItem;
