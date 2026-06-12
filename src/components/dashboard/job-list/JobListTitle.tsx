import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface JobListTitleProps {
  onSelectJob: (jobId: string) => void;
}

const JobListTitle: React.FC<JobListTitleProps> = ({ onSelectJob }) => {
  const handleCreateNewJob = async () => {
    try {
      // Create a new job with minimal required fields only
      const { data: newJob, error: saveError } = await supabase
        .from('job_submissions')
        .insert({
          client_first_name: "",
          client_last_name: "", 
          client_email: "",
          client_phone: "",
          property_address: "",
          property_type: "",  // Empty so dropdown shows "Select"
          status: "submitted",
          source: "manual",  // Track that this was manually created
          tags: [],  // Empty tags array
          source_metadata: {}  // No additional metadata for manual creation
        })
        .select('*')
        .single();

      if (saveError) {
        console.error("Supabase error details:", saveError);
        throw saveError;
      }

      if (!newJob) {
        throw new Error("No job data returned from Supabase");
      }

      // (Removed the "New job created — fill in details" toast — it popped over the cascade
      //  picker on a fresh job and was just noise. The job opens immediately anyway.)
      // Immediately open the full job detail view
      onSelectJob(newJob.id);
    } catch (error: any) {
      console.error("Error creating job - Full details:", {
        error,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code
      });
      
      // Show more detailed error to user
      const errorMessage = error?.message || "Failed to create job";
      toast.error(`Error: ${errorMessage}. Check console for details.`);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-xl font-semibold tracking-tight">Jobs</h1>
      <Button 
        onClick={handleCreateNewJob} 
        variant="outline"
        size="sm"
        className="px-2.5 py-1.5 border-slate-400/50 dark:border-slate-700/50 text-foreground hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-500/60 dark:hover:border-slate-600/60"
      >
        <Plus className="mr-1.5 h-3.5 w-3.5" /> New Job
      </Button>
    </div>
  );
};

export default JobListTitle;