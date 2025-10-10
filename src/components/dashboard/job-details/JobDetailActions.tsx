
import React from "react";
import { DetailJob, JobDetails } from "@/types/job";
// WorkflowProgress removed - unnecessary clutter taking up too much room
// ValcreAction removed - using the button in LOE Quote section instead
import PandadocAction from "./actions/PandadocAction";
// ESignatureAction removed - moved to LOE Quote section for better workflow
import ContractAction from "./actions/ContractAction";
import GoogleFolderButton from "./actions/GoogleFolderButton";
import FinalDataAction from "./actions/FinalDataAction";
import GoogleFolderAction from "./actions/GoogleFolderAction";

interface JobDetailActionsProps {
  job: DetailJob;
  jobDetails: JobDetails;
  isSending: boolean;
  isGenerating: boolean;
  isCreatingGoogle: boolean;
  isSendingFinal: boolean;
  onGenerateContract: () => void;
  onSendToValcre: () => void;
  onSendToPandadoc: () => void;
  onSendFinalData: () => void;
  onCreateGoogleFolder: () => void;
  onSignatureSent: (submissionId: string) => void;
  googleFolderStatus: boolean;
}

const JobDetailActions: React.FC<JobDetailActionsProps> = ({
  job,
  jobDetails,
  isSending,
  isGenerating,
  isCreatingGoogle,
  isSendingFinal,
  onGenerateContract,
  onSendToValcre,
  onSendToPandadoc,
  onSendFinalData,
  onCreateGoogleFolder,
  onSignatureSent,
  googleFolderStatus,
}) => {
  // All action buttons removed - not needed, causing clutter
  // Actions are now integrated into their respective sections:
  // - Create Valcre Job: In Section 2 (LOE Quote)
  // - Send LOE: In Section 2 (LOE Quote)
  // - Sync to Valcre: In each section where needed
  return null;
};

export default JobDetailActions;
