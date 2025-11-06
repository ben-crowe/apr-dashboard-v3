import { useState } from "react";
import { FormData, ValidationErrors, validateForm } from "@/utils/validation";
import { sendToWebhook } from "@/utils/webhooks/formSubmission";
import { WebhookData } from "@/utils/webhooks/types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const initialFormData: FormData = {
  clientFirstName: "",
  clientLastName: "",
  clientTitle: "",
  clientOrganization: "",
  clientAddress: "",
  clientPhone: "",
  clientEmail: "",
  propertyName: "",
  propertyAddress: "",
  propertyType: "",
  intendedUse: "",
  valuationPremises: "",
  assetCondition: "",
  notes: "",
  files: [],
  // Property Contact fields (optional - defaults to client contact if empty)
  propertyContactFirstName: "",
  propertyContactLastName: "",
  propertyContactEmail: "",
  propertyContactPhone: "",
};

const useFormSubmission = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState<any>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (value: string, name: string) => {
    console.log(`📝 handleSelectChange called: ${name} = "${value}"`);
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      console.log(`📊 Updated formData.${name}:`, newData[name]);
      return newData;
    });
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAutoFill = (autoFillData: Partial<FormData>) => {
    // Update form data with a fresh object to force re-render
    setFormData((prev) => {
      const newData = { ...prev, ...autoFillData };

      // Log for debugging
      console.log('AutoFill - Previous propertyType:', prev.propertyType);
      console.log('AutoFill - New propertyType:', newData.propertyType);
      console.log('AutoFill - Previous intendedUse:', prev.intendedUse);
      console.log('AutoFill - New intendedUse:', newData.intendedUse);
      console.log('AutoFill - sameAsClientContact:', newData.sameAsClientContact);
      console.log('AutoFill - propertyContactFirstName:', newData.propertyContactFirstName);

      return newData;
    });

    // Clear any errors for fields that were auto-filled
    const updatedErrors = { ...errors };
    Object.keys(autoFillData).forEach((key) => {
      if (key in updatedErrors) {
        delete updatedErrors[key as keyof ValidationErrors];
      }
    });
    setErrors(updatedErrors);
  };

  const handleFileChange = (files: File[]) => {
    setFormData((prev) => ({ ...prev, files }));
    if (errors.files) {
      setErrors((prev) => ({ ...prev, files: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please correct the errors in the form.");
      return;
    }

    setIsSubmitting(true);
    setWebhookResponse(null);

    // DEBUG: Log what we're about to save
    console.log('🔍 Form Data being submitted:', {
      propertyType: formData.propertyType,
      intendedUse: formData.intendedUse,
      assetCondition: formData.assetCondition,
      fullFormData: formData
    });

    try {
      // Submit job data without authentication requirement
      const { data: jobData, error: saveError } = await supabase
        .from('job_submissions')
        .insert({
          client_first_name: formData.clientFirstName,
          client_last_name: formData.clientLastName,
          client_email: formData.clientEmail,
          client_phone: formData.clientPhone,
          client_title: formData.clientTitle,
          client_organization: formData.clientOrganization,
          client_address: formData.clientAddress,
          property_name: formData.propertyName,
          property_address: formData.propertyAddress,
          property_type: formData.propertyType, // Required by database - validated before submission
          intended_use: formData.intendedUse || null,
          valuation_premises: formData.valuationPremises || null,
          asset_condition: formData.assetCondition || null,
          property_contact_first_name: formData.propertyContactFirstName || null,
          property_contact_last_name: formData.propertyContactLastName || null,
          property_contact_email: formData.propertyContactEmail || null,
          property_contact_phone: formData.propertyContactPhone || null,
          notes: formData.notes,
          status: "submitted",
        })
        .select('*')
        .single();

      if (saveError) {
        throw saveError;
      }
      
      // DEBUG: Log what was actually saved
      console.log('✅ Job saved to database:', {
        id: jobData.id,
        property_type: jobData.property_type,
        intended_use: jobData.intended_use,
        asset_condition: jobData.asset_condition
      });

      const webhookData: WebhookData = {
        jobId: jobData.id,
        supabaseId: jobData.id,
        clientInfo: {
          firstName: formData.clientFirstName,
          lastName: formData.clientLastName,
          email: formData.clientEmail,
          phone: formData.clientPhone,
          title: formData.clientTitle,
          organization: formData.clientOrganization,
          address: formData.clientAddress,
        },
        propertyInfo: {
          name: formData.propertyName,
          address: formData.propertyAddress,
          type: formData.propertyType || '',
          intendedUse: formData.intendedUse,
          assetCondition: formData.assetCondition,
          notes: formData.notes,
        },
        files: formData.files.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size,
          path: `${jobData.id}/${file.name}`,
        })),
      };

      if (formData.files.length > 0) {
        console.log(`📤 Uploading ${formData.files.length} files for job ${jobData.id}`);

        for (const file of formData.files) {
          // Sanitize filename: replace spaces with underscores, remove special characters
          const sanitizedName = file.name
            .replace(/\s+/g, '_')  // Replace spaces with underscores
            .replace(/[^a-zA-Z0-9._-]/g, '');  // Remove special characters except . _ -

          const filePath = `${jobData.id}/${sanitizedName}`;
          console.log(`📁 Uploading file: ${file.name} → ${sanitizedName} (${file.type}, ${file.size} bytes)`);

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('job-files')
            .upload(filePath, file);

          if (uploadError) {
            console.error('❌ File upload error:', uploadError);
            console.error('   Original file:', file.name);
            console.error('   Sanitized name:', sanitizedName);
            console.error('   Path:', filePath);
            console.error('   Bucket: job-files');
            toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
            continue;
          }

          console.log('✅ File uploaded successfully:', uploadData);

          const { error: dbError } = await supabase.from('job_files').insert({
            job_id: jobData.id,
            file_name: file.name,  // Keep original name for display
            file_path: filePath,    // Use sanitized path for storage
            file_type: file.type,
            file_size: file.size,
          });

          if (dbError) {
            console.error('❌ Database insert error for file:', dbError);
          } else {
            console.log('✅ File reference saved to database');
          }
        }
      }

      setIsSubmitted(true);
      toast.success("Your submission has been received successfully.");

      // REMOVED: Automatic ClickUp task creation on form submission
      // ClickUp tasks should be created manually from the dashboard
      // This prevents conflicts with other automation and gives more control
      console.log('✅ Job submitted successfully - ClickUp task creation disabled');

      // n8n webhook removed - no longer part of workflow
      // The workflow is now: Supabase → Valcre → ClickUp
      console.log('Job submitted successfully to Supabase');
      
      // Set a success response for the UI including the job ID
      setWebhookResponse({
        success: true,
        message: "Job submitted successfully",
        jobId: jobData.id
      });

    } catch (error) {
      console.error("Submission error:", error);
      toast.error("There was an error submitting your request. Please try again.");
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setIsSubmitted(false);
    setWebhookResponse(null);
  };

  return {
    formData,
    errors,
    isSubmitting,
    isSubmitted,
    webhookResponse,
    handleChange,
    handleSelectChange,
    handleAutoFill,
    handleFileChange,
    handleSubmit,
    resetForm,
  };
};

export default useFormSubmission;
