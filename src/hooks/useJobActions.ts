
import { useState, useCallback } from "react";
import { DetailJob, JobDetails } from "@/types/job";
import { toast } from "sonner";
import { createGoogleFolder } from "@/utils/webhooks";
import { supabase } from "@/integrations/supabase/client";

export function useJobActions(
  job: DetailJob | null,
  setJob: (job: DetailJob | null) => void,
  jobDetails: JobDetails
) {
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingGoogle, setIsCreatingGoogle] = useState(false);
  const [isSendingFinal, setIsSendingFinal] = useState(false);
  const [googleFolderStatus, setGoogleFolderStatus] = useState(false);

  const handleSendToValcre = useCallback(async () => {
    if (!job) return;
    
    setIsSending(true);
    try {
      // In a real app, the webhook service would make an API call to n8n
      // For now, we'll simulate getting a job number back
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Update job details with a job number
      const mockJobNumber = `JN-${Date.now().toString().slice(-6)}`;
      
      // Update Supabase
      const { error } = await supabase
        .from('job_submissions')
        .update({ 
          status: 'in_progress', 
          job_number: mockJobNumber 
        })
        .eq('id', job.id);
      
      if (error) throw error;
      
      // Update local status
      setJob({
        ...job,
        status: "in_progress",
        jobNumber: mockJobNumber
      });
      
      toast.success("Job successfully sent to Valcre");
    } catch (error) {
      console.error("Error sending to Valcre:", error);
      toast.error("Failed to send job to Valcre");
    } finally {
      setIsSending(false);
    }
  }, [job, setJob]);

  const handleSendToPandadoc = useCallback(async () => {
    if (!job) return;
    
    setIsSending(true);
    try {
      // In a real app, the webhook service would make an API call to n8n
      // For now, we'll simulate getting a job number back
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Update job details with a job number
      const mockJobNumber = `PD-${Date.now().toString().slice(-6)}`;
      
      // Update Supabase
      const { error } = await supabase
        .from('job_submissions')
        .update({ 
          status: 'in_progress', 
          job_number: mockJobNumber 
        })
        .eq('id', job.id);
      
      if (error) throw error;
      
      // Update local status
      setJob({
        ...job,
        status: "in_progress",
        jobNumber: mockJobNumber
      });
      
      toast.success("Job successfully sent to Pandadoc");
    } catch (error) {
      console.error("Error sending to Pandadoc:", error);
      toast.error("Failed to send job to Pandadoc");
    } finally {
      setIsSending(false);
    }
  }, [job, setJob]);

  const handleCreateGoogleFolder = useCallback(async () => {
    if (!job || !jobDetails.jobNumber) return;
    
    setIsCreatingGoogle(true);
    try {
      // Call the Google folder creation webhook
      const googleData = {
        jobId: job.id,
        jobNumber: jobDetails.jobNumber,
        clientName: `${job.clientFirstName} ${job.clientLastName}`,
        propertyAddress: job.propertyAddress
      };
      
      const result = await createGoogleFolder(googleData);
      
      if (result.success) {
        setGoogleFolderStatus(true);
        toast.success("File storage created successfully");
      } else {
        throw new Error("Failed to create file storage");
      }
    } catch (error) {
      console.error("Error creating file storage:", error);
      toast.error("Failed to create file storage");
    } finally {
      setIsCreatingGoogle(false);
    }
  }, [job, jobDetails.jobNumber]);

  const handleGenerateContract = useCallback(async () => {
    if (!job) return;
    
    setIsGenerating(true);
    try {
      // In a real app, the webhook service would make an API call to n8n
      // For now, we'll simulate a successful contract generation
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Update status in Supabase
      const { error } = await supabase
        .from('job_submissions')
        .update({ status: 'loe_pending' })
        .eq('id', job.id);
      
      if (error) throw error;
      
      toast.success("Contract successfully generated");
      
      // Update local status
      setJob({
        ...job,
        status: "loe_pending",
      });
    } catch (error) {
      console.error("Error generating contract:", error);
      toast.error("Failed to generate contract");
    } finally {
      setIsGenerating(false);
    }
  }, [job, setJob]);

  const handleSignatureSent = useCallback(async (submissionId: string) => {
    if (!job) return;
    
    try {
      // Update job status to LOE Sent
      const { error } = await supabase
        .from('job_submissions')
        .update({ 
          status: 'loe_sent'
        })
        .eq('id', job.id);
      
      if (error) throw error;
      
      // Update job details with DocuSeal submission ID
      const { error: detailsError } = await supabase
        .from('job_details')
        .update({ 
          docuseal_submission_id: submissionId
        })
        .eq('job_id', job.id);
      
      if (detailsError) throw detailsError;
      
      // Update local status
      setJob({
        ...job,
        status: "loe_sent",
      });
    } catch (error) {
      console.error("Error updating job after signature sent:", error);
      toast.error("Failed to update job status");
    }
  }, [job, setJob]);

  const handleSendFinalData = useCallback(async () => {
    if (!job) return;
    
    setIsSendingFinal(true);
    try {
      // In a real app, the webhook service would make an API call to n8n
      // For now, we'll simulate a successful data send
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Update status in Supabase
      const { error } = await supabase
        .from('job_submissions')
        .update({ status: 'completed' })
        .eq('id', job.id);
      
      if (error) throw error;
      
      toast.success("Final data successfully sent to Valcre");
      
      // Update local status
      setJob({
        ...job,
        status: "completed",
      });
    } catch (error) {
      console.error("Error sending final data:", error);
      toast.error("Failed to send final data to Valcre");
    } finally {
      setIsSendingFinal(false);
    }
  }, [job, setJob]);

  return {
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
  };
}
