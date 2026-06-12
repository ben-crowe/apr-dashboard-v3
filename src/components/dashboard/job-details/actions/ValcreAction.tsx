
import React from "react";
import ActionButton from "./ActionButton";
import { Send } from "lucide-react";
import { DetailJob } from "@/types/job";
import { sendToValcre } from "@/utils/webhooks";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ValcreActionProps = {
  job: DetailJob;
  isSending: boolean;
  onSendToValcre: () => void;
  onCreateGoogleFolder: () => void;
  jobNumber?: string;
};

const ValcreAction: React.FC<ValcreActionProps> = ({
  job,
  isSending,
  onSendToValcre,
  onCreateGoogleFolder,
  jobNumber
}) => {
  const handleSendToValcre = async () => {
    // Call the parent handler first (manages loading state and UI updates)
    onSendToValcre();

    try {
      // Prepare data for Valcre - include ALL fields from database
      const valcreData = {
        jobId: job.id,
        action: 'send_to_valcre' as const,
        formData: {
          // Client Information
          clientName: `${job.clientFirstName} ${job.clientLastName}`,
          clientEmail: job.clientEmail,
          clientPhone: job.clientPhone,
          clientOrganization: job.clientOrganization || '',
          clientTitle: job.clientTitle || 'Property Manager',

          // Property Contact (CRITICAL - must be included!)
          propertyContactFirstName: job.propertyContactFirstName || '',
          propertyContactLastName: job.propertyContactLastName || '',
          propertyContactEmail: job.propertyContactEmail || '',
          propertyContactPhone: job.propertyContactPhone || '',

          // Property Information
          propertyName: job.propertyName || '',
          propertyAddress: job.propertyAddress,
          propertyType: job.propertyType || 'Office',
          clientAddress: job.clientAddress || '',

          // LOE Fields (from form submission)
          intendedUse: job.intendedUse || '',
          valuationPremises: job.valuationPremises || '',

          // LOE Fields — WARNING: this component does NOT have access to jobDetails (LOE data).
          // Use LoeQuoteSection's handleCreateValcreJob instead — it reads real LOE values.
          reportType: '',
          propertyRightsAppraised: '',
          analysisLevel: '',

          // Financial — DO NOT hardcode defaults, use 0 to signal "not set"
          appraisalFee: 0,
          retainerAmount: 0,

          // Other
          assetCondition: job.assetCondition || '',
          notes: job.notes || '',
        }
      };
      
      // Send data to webhook
      const result = await sendToValcre(valcreData);
      
      // If we got a job number back, update the database
      if (result.success && result.jobNumber) {
        console.log(`Job number ${result.jobNumber} received from Valcre, ID: ${result.jobId}`);
        
        // Update job_submissions with the Valcre job number and ID
        const { error: updateError } = await supabase
          .from("job_submissions")
          .update({ 
            job_number: result.jobNumber,
            valcre_status: 'sent',
            valcre_sent_at: new Date().toISOString()
          })
          .eq("id", job.id);
          
        if (updateError) {
          console.error("Error updating job with Valcre number:", updateError);
          toast.error("Failed to save VAL number to job_submissions");
          return; // Stop here if update failed
        }

        // Also update job_loe_details with valcre_job_id for the Sync button to work
        const numericJobId = result.jobId ? parseInt(result.jobId.toString(), 10) : null;

        // Check if LOE record exists first
        console.log('🔍 [ValcreAction] Checking for existing LOE record with job_id:', job.id);
        const { data: existingLoe, error: checkError } = await supabase
          .from('job_loe_details')
          .select('id')
          .eq('job_id', job.id)
          .maybeSingle();

        if (checkError) {
          console.error('❌ [ValcreAction] Error checking for existing LOE:', checkError);
        }
        console.log('🔍 [ValcreAction] LOE check result:', existingLoe ? `Found LOE: ${existingLoe.id}` : 'No existing LOE record');

        let loeUpdateError;
        if (existingLoe) {
          // Update existing LOE record
          console.log('📝 [ValcreAction] Updating existing LOE record:', existingLoe.id);
          const { error, data } = await supabase
            .from("job_loe_details")
            .update({
              job_number: result.jobNumber,
              valcre_job_id: numericJobId,
              updated_at: new Date().toISOString()
            })
            .eq('job_id', job.id)
            .select();

          console.log('📝 [ValcreAction] Update result:', { error, rowsAffected: data?.length || 0 });
          loeUpdateError = error;
        } else {
          // Insert new LOE record
          console.log('➕ [ValcreAction] Creating new LOE record for job:', job.id, 'with VAL:', result.jobNumber);
          const { error, data } = await supabase
            .from("job_loe_details")
            .insert({
              job_id: job.id,
              job_number: result.jobNumber,
              valcre_job_id: numericJobId,
              updated_at: new Date().toISOString()
            })
            .select();

          console.log('➕ [ValcreAction] Insert result:', { error, data });
          loeUpdateError = error;
        }

        if (loeUpdateError) {
          console.error("❌ [ValcreAction] Error updating LOE details with Valcre ID:", loeUpdateError);
          toast.error("Failed to save VAL number to LOE details");
          return; // Stop here if LOE update failed
        }

        console.log("✅ [ValcreAction] VAL number saved successfully to both tables");

        // Show success message to user
        void 0 /* success: silent (Ben) */;

        // After successful Valcre job creation, we automatically try to create the Google folder
        onCreateGoogleFolder();

        // Refresh the page to show the updated job number and enable sync button
        console.log("🔄 Refreshing page to update button state...");
        setTimeout(() => {
          console.log("🔄 Executing page reload now");
          window.location.reload();
        }, 2000); // Increased to 2 seconds to ensure DB commit
      }
    } catch (error) {
      console.error("Error sending to Valcre:", error);
    }
  };

  return (
    <ActionButton
      icon={Send}
      label="Send to Valcre"
      onClick={handleSendToValcre}
      disabled={!!jobNumber}
      isLoading={isSending}
      variant="primary"
    />
  );
};

export default ValcreAction;
