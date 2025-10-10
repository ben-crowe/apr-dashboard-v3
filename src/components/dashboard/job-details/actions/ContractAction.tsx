
import React from "react";
import ActionButton from "./ActionButton";
import { FileOutput } from "lucide-react";
import { DetailJob, JobDetails } from "@/types/job";
import { generateContract } from "@/utils/webhooks";

type ContractActionProps = {
  job: DetailJob;
  jobDetails: JobDetails;
  isGenerating: boolean;
  onGenerateContract: () => void;
  jobNumber?: string;
};

const ContractAction: React.FC<ContractActionProps> = ({
  job,
  jobDetails,
  isGenerating,
  onGenerateContract,
  jobNumber
}) => {
  const handleGenerateContract = async () => {
    // Call the parent handler first (manages loading state and UI updates)
    onGenerateContract();

    try {
      // Prepare data for contract generation
      const contractData = {
        jobId: job.id,
        action: 'generate_contract' as const,
        loeData: {
          jobNumber: jobDetails.jobNumber || '',
          propertyRightsAppraised: jobDetails.propertyRightsAppraised || '',
          valuationPremises: jobDetails.valuationPremises || '',
          deliveryDate: jobDetails.deliveryDate || '',
          scopeOfWork: jobDetails.scopeOfWork || '',
          specialInstructions: jobDetails.specialInstructions || '',
          reportType: jobDetails.reportType || '',
          paymentTerms: jobDetails.paymentTerms || '',
          appraisalFee: jobDetails.appraisalFee || 0,
          retainerAmount: jobDetails.retainerAmount || '',
          disbursementPercentage: jobDetails.disbursementPercentage || '',
          // Client information
          clientName: `${job.clientFirstName} ${job.clientLastName}`,
          clientEmail: job.clientEmail,
          clientPhone: job.clientPhone,
          clientOrganization: job.clientOrganization || '',
          // Property information
          propertyAddress: job.propertyAddress,
          propertyName: job.propertyName || '',
          propertyType: job.propertyType || '',
        }
      };
      
      // Send data to webhook
      await generateContract(contractData);
    } catch (error) {
      console.error("Error generating contract:", error);
    }
  };

  return (
    <ActionButton
      icon={FileOutput}
      label="Generate LOE"
      onClick={handleGenerateContract}
      disabled={!jobNumber}
      isLoading={isGenerating}
    />
  );
};

export default ContractAction;
