
import { useCallback } from "react";
import { JobDetails, DetailJob } from "@/types/job";
import { useJobData } from "./useJobData";
import { useSaveJobDetails } from "./useSaveJobDetails";
import { useJobActions } from "./useJobActions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useJobDetail(jobId: string) {
  const { job, setJob, jobDetails, setJobDetails, isLoading, refetchJobData } = useJobData(jobId);
  const { isSaving, debouncedSave } = useSaveJobDetails(jobId);
  const { 
    isSending, 
    isGenerating, 
    isCreatingGoogle, 
    isSendingFinal, 
    googleFolderStatus,
    handleSendToValcre,
    handleSendToPandadoc,
    handleCreateGoogleFolder,
    handleGenerateContract,
    handleSendFinalData,
    handleSignatureSent
  } = useJobActions(job, setJob, jobDetails);

  const handleUpdateDetails = useCallback((newDetails: Partial<JobDetails>) => {
    const updatedDetails = { ...jobDetails, ...newDetails };
    setJobDetails(updatedDetails);
    
    // Save the updated details
    debouncedSave(updatedDetails);
  }, [jobDetails, setJobDetails, debouncedSave]);

  const handleUpdateJob = useCallback(async (updates: Partial<DetailJob>) => {
    if (!job) return;
    
    // Update local state immediately
    const updatedJob = { ...job, ...updates };
    setJob(updatedJob);
    
    // Prepare data for database update
    const dbUpdates: any = {};
    
    // Map DetailJob fields to ACTUAL database columns
    if (updates.clientFirstName !== undefined) dbUpdates.client_first_name = updates.clientFirstName;
    if (updates.clientLastName !== undefined) dbUpdates.client_last_name = updates.clientLastName;
    if (updates.clientEmail !== undefined) dbUpdates.client_email = updates.clientEmail;
    if (updates.clientPhone !== undefined) dbUpdates.client_phone = updates.clientPhone;
    if (updates.clientTitle !== undefined) dbUpdates.client_title = updates.clientTitle;
    if (updates.clientOrganization !== undefined) dbUpdates.client_organization = updates.clientOrganization;
    if (updates.clientAddress !== undefined) dbUpdates.client_address = updates.clientAddress;
    if (updates.propertyAddress !== undefined) dbUpdates.property_address = updates.propertyAddress;
    if (updates.propertyName !== undefined) dbUpdates.property_name = updates.propertyName;
    if (updates.propertyType !== undefined) dbUpdates.property_type = updates.propertyType;
    if (updates.propertyTypes !== undefined) dbUpdates.property_types = updates.propertyTypes;
    if (updates.intendedUse !== undefined) dbUpdates.intended_use = updates.intendedUse;
    if (updates.assetCondition !== undefined) dbUpdates.asset_condition = updates.assetCondition;
    if (updates.valuationPremises !== undefined) dbUpdates.valuation_premises = updates.valuationPremises;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.propertyContactFirstName !== undefined) dbUpdates.property_contact_first_name = updates.propertyContactFirstName;
    if (updates.propertyContactLastName !== undefined) dbUpdates.property_contact_last_name = updates.propertyContactLastName;
    if (updates.propertyContactEmail !== undefined) dbUpdates.property_contact_email = updates.propertyContactEmail;
    if (updates.propertyContactPhone !== undefined) dbUpdates.property_contact_phone = updates.propertyContactPhone;
    if (updates.sameAsClientContact !== undefined) dbUpdates.same_as_client_contact = updates.sameAsClientContact;

    // Save to database
    try {
      const { error } = await supabase
        .from('job_submissions')
        .update(dbUpdates)
        .eq('id', job.id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Failed to save changes');
      // Revert local state on error
      setJob(job);
    }
  }, [job, setJob]);

  return {
    job,
    jobDetails,
    isLoading,
    isSending,
    isGenerating,
    isCreatingGoogle,
    isSendingFinal,
    isSaving,
    googleFolderStatus,
    handleUpdateDetails,
    handleUpdateJob,
    handleSendToValcre,
    handleSendToPandadoc,
    handleCreateGoogleFolder,
    handleGenerateContract,
    handleSendFinalData,
    handleSignatureSent,
    refetchJobData  // Expose refetch function
  };
}
