
import React from "react";
import { Separator } from "@/components/ui/separator";
import {
  ClientInformationSection,
  PropertyInformationSection,
  DocumentsSection,
  SuccessScreen,
  SubmitButton,
  useFormSubmission
} from "@/components/submission-form";
import { generateCompleteTestData } from "@/utils/testDataGenerator";

const SubmissionForm = () => {
  const {
    formData,
    errors,
    isSubmitting,
    isSubmitted,
    webhookResponse,
    handleChange,
    handleSelectChange,
    handleSameAsClientContactChange,
    handleAutoFill,
    handleFileChange,
    handleSubmit,
    resetForm,
  } = useFormSubmission();

  if (isSubmitted) {
    return <SuccessScreen webhookResponse={webhookResponse} onReset={resetForm} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto space-y-8 glass-card p-6 rounded-xl animate-fade-in"
    >
      <div className="text-center mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-left">
              Appraisal Request
            </h1>
            <p className="text-muted-foreground mt-1 text-left">
              Please provide details about your appraisal request
            </p>
          </div>
          {/* Discrete test data link - matches dashboard style */}
          <button
            type="button"
            onClick={() => {
              const testData = generateCompleteTestData();
              console.log('Generated test data:', testData);
              console.log('propertyType:', testData.propertyType);
              console.log('intendedUse:', testData.intendedUse);
              handleAutoFill(testData);
            }}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
            title="Fill test data for development"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span>Test Data</span>
          </button>
        </div>
      </div>

      <Separator />

      <ClientInformationSection
        formData={formData}
        errors={errors}
        handleChange={handleChange}
      />

      <Separator />

      <PropertyInformationSection
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
      />

      <Separator />

      <DocumentsSection
        files={formData.files}
        error={errors.files}
        handleFileChange={handleFileChange}
      />

      <div className="flex justify-center pt-4">
        <SubmitButton isSubmitting={isSubmitting} />
      </div>

      <p className="text-center text-xs text-muted-foreground">
        By submitting this form, you agree to our{" "}
        <a href="#" className="underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
};

export default SubmissionForm;
