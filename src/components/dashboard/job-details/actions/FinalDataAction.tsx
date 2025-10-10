
import React, { useMemo } from "react";
import ActionButton from "./ActionButton";
import { Database } from "lucide-react";
import { DetailJob, JobDetails } from "@/types/job";
import { sendFinalDataToValcre } from "@/utils/webhooks";

type FinalDataActionProps = {
  job: DetailJob;
  jobDetails: JobDetails;
  isSendingFinal: boolean;
  onSendFinalData: () => void;
};

const FinalDataAction: React.FC<FinalDataActionProps> = ({
  job,
  jobDetails,
  isSendingFinal,
  onSendFinalData
}) => {
  // Check if all required fields are complete
  const allFieldsComplete = useMemo(() => {
    const requiredFields = [
      'yearBuilt', 'buildingSize', 'zoningClassification',
      'propertyRightsAppraised', 'valuationPremises', 'scopeOfWork',
      'reportType', 'paymentTerms', 'appraisalFee'
    ];
    
    return requiredFields.every(field => 
      field in jobDetails && jobDetails[field as keyof JobDetails]);
  }, [jobDetails]);

  const handleSendFinalData = async () => {
    // Call the parent handler first (manages loading state and UI updates)
    onSendFinalData();
    
    try {
      // Prepare final data for Valcre
      const finalData = {
        jobId: job.id,
        action: 'send_final_data' as const,
        jobNumber: jobDetails.jobNumber || '',
        completeData: {
          // All job details
          ...jobDetails,
          // Client information
          clientFirstName: job.clientFirstName,
          clientLastName: job.clientLastName,
          clientEmail: job.clientEmail,
          clientPhone: job.clientPhone,
          clientOrganization: job.clientOrganization || '',
          clientTitle: job.clientTitle || '',
          clientAddress: job.clientAddress || '',
          // Property information
          propertyAddress: job.propertyAddress,
          propertyName: job.propertyName || '',
          propertyType: job.propertyType || '',
          intendedUse: job.intendedUse || '',
          assetCondition: job.assetCondition || '',
          notes: job.notes || '',
          // Files
          files: job.files || []
        }
      };
      
      // Send final data to webhook
      await sendFinalDataToValcre(finalData);
    } catch (error) {
      console.error("Error sending final data:", error);
    }
  };

  return (
    <ActionButton
      icon={Database}
      label="Send Final Data"
      onClick={handleSendFinalData}
      disabled={!jobDetails.jobNumber || !allFieldsComplete}
      isLoading={isSendingFinal}
    />
  );
};

export default FinalDataAction;
