
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface SuccessScreenProps {
  webhookResponse: any;
  onReset: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({
  webhookResponse,
  onReset,
}) => {
  return (
    <div className="max-w-md mx-auto p-6 glass-card rounded-xl animate-fade-in">
      <div className="flex flex-col items-center text-center space-y-6 py-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>

        <h2 className="text-2xl font-bold text-center">
          Thank You for Your Submission!
        </h2>

        {webhookResponse?.jobId && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <p className="text-sm text-green-800">
              <strong>Job Reference:</strong> <span className="font-mono">{webhookResponse.jobId}</span>
            </p>
          </div>
        )}

        <p className="text-center text-base text-gray-600 pt-4">
          Your appraisal request has been successfully submitted. Our team will review your information and get back to you within 24 hours.
        </p>

        <div className="flex flex-col gap-4 pt-4 w-full">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-center text-slate-700">
              <strong>What happens next?</strong>
              <br />
              You'll receive a confirmation email shortly. Our team will review your request and contact you within 24 hours to discuss the next steps.
            </p>
          </div>

          <Button
            onClick={() => window.location.href = 'https://valta.ca'}
            className="w-full"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
