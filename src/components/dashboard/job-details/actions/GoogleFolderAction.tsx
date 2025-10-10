import React from "react";
import { createGoogleFolder } from "@/utils/webhooks";
import { DetailJob, JobDetails } from "@/types/job";

type GoogleFolderActionProps = {
  job: DetailJob;
  jobDetails: JobDetails;
  onCreateGoogleFolder: () => void;
};

const GoogleFolderAction = ({ job, jobDetails, onCreateGoogleFolder }: GoogleFolderActionProps) => {
  const handleCreateGoogleFolder = async () => {
    // This can be triggered automatically after Valcre send
    if (!jobDetails.jobNumber) return;
    
    try {
      const googleData = {
        jobId: job.id,
        jobNumber: jobDetails.jobNumber,
        clientName: `${job.clientFirstName} ${job.clientLastName}`,
        propertyAddress: job.propertyAddress
      };
      
      await createGoogleFolder(googleData);
    } catch (error) {
      console.error("Error creating Google folder:", error);
    }
  };

  // This component doesn't render anything - it's just a utility
  return null;
};

export default GoogleFolderAction;