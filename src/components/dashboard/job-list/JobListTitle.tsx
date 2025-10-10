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
          status: "submitted"
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

      toast.success("New job created! Fill in the client and property details.");
      
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
      <Button onClick={handleCreateNewJob} size="sm">
        <Plus className="mr-2 h-4 w-4" /> New Job
      </Button>
    </div>
  );
};

export default JobListTitle;