import React, { useState, useEffect } from "react";
import ActionButton from "./ActionButton";
import { FileSignature, AlertCircle } from "lucide-react";
import { DetailJob, JobDetails } from "@/types/job";
import { validateRequiredFields } from "@/utils/webhooks/docuseal";
import { generateLOEHTML, generateAndSendLOE, sendLOEEmail } from "@/utils/loe/generateLOE";
import LOEPreviewModal from "./LOEPreviewModal";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ESignatureActionProps = {
  job: DetailJob;
  jobDetails: JobDetails;
  onSignatureSent: (submissionId: string) => void;
};

const ESignatureAction: React.FC<ESignatureActionProps> = ({
  job,
  jobDetails,
  onSignatureSent
}) => {
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHTML, setPreviewHTML] = useState<string>('');
  const [validation, setValidation] = useState<{
    isValid: boolean;
    missingFields: string[];
  }>({ isValid: false, missingFields: [] });

  // Check if document was already sent (but allow preview/regeneration)
  const alreadySent = false; // Always allow preview/regeneration for testing

  // Validate fields whenever job or jobDetails change
  useEffect(() => {
    const result = validateRequiredFields(job, jobDetails);
    setValidation(result);
  }, [job, jobDetails]);

  // Generate preview first
  const handleGeneratePreview = async () => {
    setIsGenerating(true);
    
    try {
      console.log('🔍 Starting preview generation for job:', job.id);
      console.log('📋 Job data:', { clientFirstName: job.clientFirstName, clientLastName: job.clientLastName, propertyAddress: job.propertyAddress });
      console.log('📊 Job details data:', { jobNumber: jobDetails.jobNumber, appraisalFee: jobDetails.appraisalFee });
      
      // Generate the HTML document
      const html = await generateLOEHTML(job, jobDetails);
      setPreviewHTML(html);
      setShowPreview(true);
      toast.success("Preview generated successfully! Review your document before sending.");
    } catch (error) {
      console.error("❌ Error generating preview:", error);
      toast.error(`Failed to generate document preview: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Send after approval
  const handleApproveAndSend = async (recipientEmail?: string) => {
    setIsSending(true);
    
    try {
      // Use the edited email if provided, otherwise use original
      const emailToUse = recipientEmail || job.clientEmail;
      
      // Create a modified job object with the updated email
      const jobWithUpdatedEmail = {
        ...job,
        clientEmail: emailToUse
      };
      
      // Send to DocuSeal with the already generated HTML
      const result = await generateAndSendLOE(jobWithUpdatedEmail, jobDetails, previewHTML);
      
      if (result.success && result.submissionId && result.signingLink) {
        // Send custom email with signing link
        const emailSent = await sendLOEEmail(
          emailToUse,
          `${job.clientFirstName} ${job.clientLastName}`,
          result.signingLink,
          job.propertyAddress
        );
        
        if (emailSent) {
          toast.success("LOE sent for e-signature successfully!");
        } else {
          toast.success("LOE generated! Signing link: " + result.signingLink);
        }
        
        onSignatureSent(result.submissionId);
        setShowPreview(false);
      } else {
        toast.error(result.error || "Failed to send LOE");
      }
    } catch (error) {
      console.error("Error sending for e-signature:", error);
      toast.error("An error occurred while sending LOE");
    } finally {
      setIsSending(false);
    }
  };

  // Don't show button if no Valcre job number
  if (!jobDetails.jobNumber) {
    return null;
  }

  // Button is disabled if already sent or validation fails
  const isDisabled = alreadySent || !validation.isValid || isSending || isGenerating;

  // Create tooltip content for missing fields
  const tooltipContent = validation.missingFields.length > 0 ? (
    <div className="space-y-1">
      <p className="font-semibold">Missing required fields:</p>
      <ul className="text-xs list-disc list-inside">
        {validation.missingFields.map((field, idx) => (
          <li key={idx}>{field}</li>
        ))}
      </ul>
    </div>
  ) : alreadySent ? (
    "LOE already sent for signature"
  ) : (
    "Send LOE for e-signature"
  );

  const button = (
    <ActionButton
      icon={FileSignature}
      label={alreadySent ? "LOE Sent" : "Preview & Send LOE"}
      onClick={handleGeneratePreview}
      disabled={isDisabled}
      isLoading={isGenerating}
      variant={alreadySent ? "success" : "primary"}
    />
  );

  // Show validation tooltip if there are missing fields
  if (validation.missingFields.length > 0 && !alreadySent) {
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                {button}
                <AlertCircle className="absolute -top-1 -right-1 h-4 w-4 text-amber-500" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              {tooltipContent}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Preview Modal */}
        <LOEPreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          job={job}
          jobDetails={jobDetails}
          documentHTML={previewHTML}
          onApprove={handleApproveAndSend}
        />
      </>
    );
  }

  return (
    <>
      {button}
      
      {/* Preview Modal */}
      <LOEPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        job={job}
        jobDetails={jobDetails}
        documentHTML={previewHTML}
        onApprove={handleApproveAndSend}
      />
    </>
  );
};

export default ESignatureAction;