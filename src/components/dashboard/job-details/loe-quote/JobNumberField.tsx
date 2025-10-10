
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DetailJob, JobDetails } from "@/types/job";
import { CheckCircle } from "lucide-react";
import ClickUpAction from "../actions/ClickUpAction";
import { isValcreJobNumber, isPendingValcreJob, VALCRE_JOB_EXAMPLE } from "@/config/valcre";

interface JobNumberFieldProps {
  job: DetailJob;
  jobDetails?: JobDetails;
}

const JobNumberField: React.FC<JobNumberFieldProps> = ({ job, jobDetails }) => {
  // Just use the raw job number for the field - no formatting with address
  const jobNumber = jobDetails?.jobNumber || '';
  
  // Check if we have a Valcre job number (but not PENDING)
  const hasValcreJob = isValcreJobNumber(jobDetails?.jobNumber) && !isPendingValcreJob(jobDetails?.jobNumber);
  
  // For display, show "Pending..." if it's a PENDING job
  const displayValue = isPendingValcreJob(jobNumber) ? '' : jobNumber;

  return (
    <div className="space-y-2">
      <Label htmlFor="jobNumber">Job Number</Label>
      <div className="space-y-2">
        <div>
          <Input 
            id="jobNumber" 
            name="jobNumber" 
            value={hasValcreJob ? displayValue : ''} 
            placeholder={isPendingValcreJob(jobNumber) ? 'Pending...' : `e.g., ${VALCRE_JOB_EXAMPLE}`}
            readOnly 
            className={`bg-background font-mono text-sm w-40 ${!hasValcreJob ? 'placeholder:text-gray-500' : ''}`}
          />
        </div>
        
        {/* ClickUp Integration */}
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">
            ClickUp Integration:
          </div>
          <ClickUpAction 
            job={job} 
            jobDetails={jobDetails}
            onTaskCreated={() => {
              // Refresh the page to update the UI
              window.location.reload();
            }}
          />
          {job.clickup_task_id && (
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              Task created
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobNumberField;
