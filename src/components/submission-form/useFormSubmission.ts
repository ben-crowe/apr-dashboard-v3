import { useState } from "react";
import { FormData, ValidationErrors, validateForm } from "@/utils/validation";
import { WebhookData } from "@/utils/webhooks/types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";

/**
 * Non-formData inputs to the job_submissions insert. Reads the browser globals
 * (document.referrer / navigator.userAgent), so it is assembled by the caller and
 * passed into formToDbRow — keeping formToDbRow pure and testable.
 */
export interface SourceMetadata {
  referrer: string | null;
  user_agent: string | null;
}

/**
 * Pure builder for the job_submissions insert row.
 *
 * Extracted verbatim from handleSubmit (behavior-neutral). Every field is the same
 * mapping the inline insert used — the `|| null` coalescing and the non-null
 * `property_type` (required by the DB, validated before submit) are preserved exactly.
 * `source_metadata` is the only non-formData input; the live submit passes it so the
 * insert stays byte-identical, while the report test seam calls this with no
 * sourceMetadata (the report bridge never reads source_metadata).
 */
export function formToDbRow(
  formData: FormData,
  sourceMetadata?: SourceMetadata,
): TablesInsert<"job_submissions"> {
  return {
    client_first_name: formData.clientFirstName,
    client_last_name: formData.clientLastName,
    client_email: formData.clientEmail,
    client_phone: formData.clientPhone,
    client_title: formData.clientTitle,
    client_organization: formData.clientOrganization,
    client_address: formData.clientAddress,
    client_city: formData.clientCity || null,
    client_province: formData.clientProvince || null,
    client_postal_code: formData.clientPostal || null,
    property_name: formData.propertyName,
    property_address: formData.propertyAddress,
    property_city: formData.propertyCity || null,
    property_province: formData.propertyProvince || null,
    property_postal_code: formData.propertyPostal || null,
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
    source: "webform", // Track that this came from webform submission
    tags: [], // Empty tags array (can be added later)
    source_metadata: sourceMetadata ?? null,
  };
}

const initialFormData: FormData = {
  clientFirstName: "",
  clientLastName: "",
  clientTitle: "",
  clientOrganization: "",
  clientAddress: "",
  clientCity: "",
  clientProvince: "",
  clientPostal: "",
  clientPhone: "",
  clientEmail: "",
  propertyName: "",
  propertyAddress: "",
  propertyCity: "",
  propertyProvince: "",
  propertyPostal: "",
  propertyType: "",
  propertySubtype: "",
  tenancy: "",
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
      // Submit job data without authentication requirement.
      // source_metadata reads browser globals here (kept out of the pure formToDbRow);
      // formToDbRow then builds the identical insert row from formData + this metadata.
      const sourceMetadata: SourceMetadata = {
        referrer: typeof document !== 'undefined' ? document.referrer : null,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      };
      const { data: jobData, error: saveError } = await supabase
        .from('job_submissions')
        .insert(formToDbRow(formData, sourceMetadata))
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

      // Save property_subtype and tenancy to job_property_info if provided
      if (formData.propertySubtype || formData.tenancy) {
        const { error: propInfoError } = await supabase
          .from('job_property_info')
          .insert({
            job_id: jobData.id,
            property_subtype: formData.propertySubtype || null,
            tenancy: formData.tenancy || null,
          });
        if (propInfoError) {
          console.error('Error saving property info:', propInfoError);
        }
      }

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

      // Files the client attached that did NOT make it. The submission still succeeds — we never
      // lose a whole appraisal over one attachment — but they are TOLD, by name, and asked to
      // re-send. Silence here is what lost client files: a file could vanish with nothing said.
      const lostFiles: string[] = [];

      if (formData.files.length > 0) {
        console.log(`📤 Uploading ${formData.files.length} files for job ${jobData.id}`);

        for (const file of formData.files) {
          // THE STORAGE KEY. Two jobs, deliberately separated:
          //
          //   UNIQUENESS comes from the token — NOT from the name. The old code built the path from
          //   the sanitised name alone, so two DIFFERENT client files could sanitise to the SAME
          //   path ("Scan 1.pdf" and "Scan_1.pdf" both became "Scan_1.pdf"). The second upload then
          //   failed 409 Duplicate and the loop `continue`d straight past the row insert. The file
          //   was gone, and only a toast said so. Reproduced before this fix: two distinct files in,
          //   ONE object out.
          //
          //   LEGALITY comes from the strip — the segment still sits inside a Supabase storage key,
          //   which must be a legal key, so a minimal strip-to-safe-characters stays. It no longer
          //   matters that it mangles ("Évaluation.pdf" -> "valuation.pdf"): the token already made
          //   the key unique, and file_name below keeps the client's ORIGINAL name for display.
          //   This is NOT a transliterator and must not become one.
          const uniqueToken = crypto.randomUUID().slice(0, 8);
          const nameSegment = file.name
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9._-]/g, '');
          // A name made entirely of stripped characters leaves nothing — the token alone carries it.
          const filePath = `${jobData.id}/${uniqueToken}${nameSegment ? `-${nameSegment}` : ''}`;
          console.log(`📁 Uploading file: ${file.name} → ${filePath} (${file.type}, ${file.size} bytes)`);

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('job-files')
            .upload(filePath, file);

          if (uploadError) {
            console.error('❌ File upload error:', uploadError, { original: file.name, filePath });
            lostFiles.push(file.name);
            continue;
          }

          console.log('✅ File uploaded successfully:', uploadData);

          const { error: dbError } = await supabase.from('job_files').insert({
            job_id: jobData.id,
            file_name: file.name,  // the client's ORIGINAL name, untouched — this is what is displayed
            file_path: filePath,   // opaque storage key; nothing reconstructs a display name from it
            file_type: file.type,
            file_size: file.size,
          });

          if (dbError) {
            // A row-insert failure is JUST AS BAD as an upload failure, and it used to be a bare
            // console.error. The bytes are in storage but no row points at them, so the file is
            // invisible to the dashboard and the folder panel FOREVER, and the client is told
            // nothing. It now surfaces exactly like a failed upload.
            console.error('❌ Database insert error for file:', dbError, { original: file.name, filePath });
            lostFiles.push(file.name);
          } else {
            console.log('✅ File reference saved to database');
          }
        }
      }

      setIsSubmitted(true);

      // The confirmation must NOT read as an unqualified success while a file is missing.
      if (lostFiles.length > 0) {
        toast.error(
          `Your request was submitted, but ${lostFiles.length} attachment${lostFiles.length === 1 ? '' : 's'} did not upload: ` +
            `${lostFiles.join(', ')}. Please email ${lostFiles.length === 1 ? 'it' : 'them'} to us so we have everything.`,
          { duration: 30000 },
        );
      }

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
