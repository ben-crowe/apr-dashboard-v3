import React from "react";
import { JobStatus, JobDetails } from "@/types/job";
import { Check, Circle, Clock, FileSignature, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

type WorkflowProgressProps = {
  status: JobStatus;
  jobDetails: JobDetails;
};

interface WorkflowStep {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  isComplete: boolean;
  isCurrent: boolean;
  isAvailable: boolean;
}

const WorkflowProgress: React.FC<WorkflowProgressProps> = ({ status, jobDetails }) => {
  // Determine workflow state
  const hasJobNumber = !!jobDetails.jobNumber;
  const hasRequiredFields = !!(
    jobDetails.propertyRightsAppraised && 
    jobDetails.reportType && 
    jobDetails.scopeOfWork &&
    jobDetails.appraisalFee
  );
  const isLOESent = status === 'loe_sent' || status === 'loe_signed' || !!jobDetails.docusealSubmissionId;
  const isLOESigned = status === 'loe_signed' || status === 'contract_generated';
  const isPaid = status === 'paid' || status === 'active';
  const isComplete = status === 'completed';

  const steps: WorkflowStep[] = [
    {
      id: 'submission',
      label: 'Submitted',
      description: 'Form received',
      icon: Check,
      isComplete: true, // Always true if we're viewing the job
      isCurrent: status === 'submitted' && !hasJobNumber,
      isAvailable: true
    },
    {
      id: 'valcre',
      label: 'Job Number',
      description: hasJobNumber ? jobDetails.jobNumber : 'Create Valcre job',
      icon: Circle,
      isComplete: hasJobNumber,
      isCurrent: status === 'submitted' && !hasJobNumber,
      isAvailable: true
    },
    {
      id: 'loe',
      label: 'E-Signature',
      description: isLOESent 
        ? (isLOESigned ? 'LOE Signed' : 'Awaiting signature') 
        : (hasRequiredFields ? 'Ready to send' : 'Fill required fields'),
      icon: FileSignature,
      isComplete: isLOESigned,
      isCurrent: hasJobNumber && !isLOESent,
      isAvailable: hasJobNumber && hasRequiredFields
    },
    {
      id: 'payment',
      label: 'Payment',
      description: isPaid ? 'Payment received' : 'Awaiting payment',
      icon: DollarSign,
      isComplete: isPaid,
      isCurrent: isLOESigned && !isPaid,
      isAvailable: isLOESigned
    },
    {
      id: 'active',
      label: 'Active',
      description: isComplete ? 'Job completed' : 'Job in progress',
      icon: Check,
      isComplete: isComplete,
      isCurrent: isPaid && !isComplete,
      isAvailable: isPaid
    }
  ];

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="relative">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                {/* Step Circle */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                    step.isComplete 
                      ? "bg-green-500 border-green-500 text-white" 
                      : step.isCurrent
                      ? "bg-blue-500 border-blue-500 text-white animate-pulse"
                      : step.isAvailable
                      ? "bg-white border-gray-300 text-gray-500"
                      : "bg-gray-100 border-gray-200 text-gray-400"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                
                {/* Step Label */}
                <div className="mt-2 text-center">
                  <div className={cn(
                    "text-xs font-medium",
                    step.isComplete ? "text-green-600" :
                    step.isCurrent ? "text-blue-600" :
                    step.isAvailable ? "text-gray-700" :
                    "text-gray-400"
                  )}>
                    {step.label}
                  </div>
                  <div className={cn(
                    "text-xs mt-0.5",
                    step.isCurrent ? "text-blue-500 font-medium" : "text-gray-500"
                  )}>
                    {step.description}
                  </div>
                </div>
                
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute top-5 left-full w-full h-0.5 -translate-y-1/2",
                      steps[index + 1].isComplete || steps[index + 1].isCurrent || steps[index + 1].isAvailable
                        ? "bg-gray-300"
                        : "bg-gray-200"
                    )}
                    style={{
                      width: 'calc(100vw / 5 - 2.5rem)',
                      maxWidth: '150px'
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Action Hint */}
      {steps.find(s => s.isCurrent) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="font-medium text-blue-900">Next Step:</span>
            <span className="text-blue-700">
              {steps.find(s => s.isCurrent)?.description}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowProgress;