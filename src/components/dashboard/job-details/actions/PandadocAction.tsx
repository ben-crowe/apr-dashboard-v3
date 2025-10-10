
import React from "react";
import ActionButton from "./ActionButton";
import { FileText } from "lucide-react";
import { DetailJob } from "@/types/job";
import { sendToPandadoc } from "@/utils/webhooks";

type PandadocActionProps = {
  job: DetailJob;
  isSending: boolean;
  onSendToPandadoc: () => void;
  onCreateGoogleFolder: () => void;
  jobNumber?: string;
};

const PandadocAction: React.FC<PandadocActionProps> = ({
  job,
  isSending,
  onSendToPandadoc,
  onCreateGoogleFolder,
  jobNumber
}) => {
  const handleSendToPandadoc = async () => {
    // Call the parent handler first (manages loading state and UI updates)
    onSendToPandadoc();

    try {
      // Prepare data for Pandadoc
      const pandadocData = {
        jobId: job.id,
        action: 'send_to_pandadoc' as const,
        formData: {
          clientName: `${job.clientFirstName} ${job.clientLastName}`,
          clientEmail: job.clientEmail,
          clientPhone: job.clientPhone,
          propertyAddress: job.propertyAddress,
          propertyType: job.propertyType || '',
          organizationName: job.clientOrganization || '',
          intendedUse: job.intendedUse || '',
          assetCondition: job.assetCondition || '',
          notes: job.notes || '',
        }
      };
      
      // Send data to Pandadoc webhook
      const result = await sendToPandadoc(pandadocData);
      
      // If we got a job number back (in a real app, this would come from the Pandadoc API)
      if (result.success && result.jobNumber) {
        // In a real app, we would update the job number in the database
        console.log(`Job number ${result.jobNumber} received from Pandadoc`);
        
        // After successful Pandadoc job creation, we automatically try to create the Google folder
        onCreateGoogleFolder();
      }
    } catch (error) {
      console.error("Error sending to Pandadoc:", error);
    }
  };

  return (
    <ActionButton
      icon={FileText}
      label="Send for E-Signature"
      onClick={handleSendToPandadoc}
      disabled={!!jobNumber}
      isLoading={isSending}
      variant="primary"
    />
  );
};

export default PandadocAction;
