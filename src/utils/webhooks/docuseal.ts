import { DetailJob, JobDetails } from "@/types/job";
import { markLOESent } from "./clickup";
import { supabase } from "@/integrations/supabase/client";

// DocuSeal API Configuration
const DOCUSEAL_API_KEY = import.meta.env.VITE_DOCUSEAL_API_KEY;
const DOCUSEAL_TEMPLATE_ID = "1680270";
const DOCUSEAL_API_BASE = "https://api.docuseal.co";

export interface DocuSealSubmissionData {
  template_id: number;
  send_email: boolean;
  submitters: Array<{
    email: string;
    phone?: string;
    name?: string;
    role: string;
    fields?: Array<{
      name: string;
      value: string | number | boolean;
    }>;
  }>;
}

// One entry in the DocuSeal field mapping. `value` is the contract output (unchanged behaviour).
// `jobField` / `jobFields` are ADDITIVE, declarative metadata (Item 8, 2026-07-16): they name the
// job-page field(s) that back this DocuSeal field, so the "in LOE" chip can be DERIVED from this one
// mapping instead of a second hand-kept list. Entries with no backing job-page input (date_created,
// date_signed, client_signature — auto/signature) carry no jobField and are not marked. The DocuSeal
// submission reads only `name` + `value`, so the extra props never reach the contract path.
export interface DocuSealFieldEntry {
  name: string;
  value: any;
  jobField?: string;    // single backing job-page field (camelCase key on job / jobDetails)
  jobFields?: string[]; // composite / fallback backing fields (e.g. client_name, notes)
}

// Map job data to DocuSeal fields (22 fields as per Field-Map3.md)
export function mapJobToDocuSealFields(
  job: DetailJob,
  jobDetails: JobDetails,
): DocuSealFieldEntry[] {
  const currentDate = new Date().toLocaleDateString("en-US");

  return [
    // Date Fields
    { name: "date_created", value: currentDate },
    { name: "date_signed", value: "" }, // Will be filled when signing

    // Client Information
    { name: "company_name", value: job.clientOrganization || "", jobField: "clientOrganization" },
    { name: "client_address", value: job.clientAddress || "", jobField: "clientAddress" },
    {
      name: "client_name",
      value: `${job.clientFirstName} ${job.clientLastName}`,
      jobFields: ["clientFirstName", "clientLastName"], // composite — both fields back this
    },
    { name: "client_phone", value: job.clientPhone || "", jobField: "clientPhone" },
    { name: "client_title", value: job.clientTitle || "", jobField: "clientTitle" },
    { name: "client_email", value: job.clientEmail, jobField: "clientEmail" },

    // Property Details
    {
      name: "notes",
      value: jobDetails.specialInstructions || job.notes || "",
      jobFields: ["specialInstructions", "notes"], // fallback source — specialInstructions, else notes
    },
    { name: "property_address", value: job.propertyAddress, jobField: "propertyAddress" },
    { name: "scope_of_work", value: jobDetails.scopeOfWork || "", jobField: "scopeOfWork" },

    // Job/Appraisal Details - TEXT FIELDS ONLY
    { name: "job_number", value: jobDetails.jobNumber || "", jobField: "jobNumber" },

    // Financial Information
    { name: "appraisal_fee", value: jobDetails.appraisalFee || 0, jobField: "appraisalFee" },
    { name: "retainer_amount", value: jobDetails.retainerAmount || "", jobField: "retainerAmount" },

    // SELECT FIELDS - FIXED FOR NO OVERLAY ISSUES
    // Value sent EMPTY (avoids template overlay bleed) but they ARE contract-bound on the template, so
    // they still carry jobField metadata → they get the chip on their job-page select.
    { name: "property_type", value: "", jobField: "propertyType" },
    { name: "intended_use", value: "", jobField: "intendedUse" }, // page label: "Authorized Use"
    { name: "requested_value", value: "", jobField: "valuationPremises" }, // page label: "Valuation Premises"
    { name: "property_rights", value: "", jobField: "propertyRightsAppraised" },
    { name: "report_type", value: "", jobField: "reportType" },
    // payment_terms + report_delivery: on the DocuSeal template but with NO job-page input to mark —
    // the Payment Terms field was removed 2026-06-19 (fixed LOE boilerplate), and Report Delivery has
    // no job-details field (it exists only in the separate DocumentBuilder). No jobField → no chip.
    { name: "payment_terms", value: "" },
    { name: "report_delivery", value: "" },

    // Signature Block
    { name: "client_signature", value: "" }, // Will be filled when signing
  ];
}

// The SINGLE source of truth for which job-page fields are contract-bound (Item 8). Derived from the
// jobField metadata above — the "in LOE" chip reads THIS set, so the marker can never drift from the
// mapping. Built from empty job/jobDetails because the jobField metadata is static (independent of the
// values). If the mapping gains/loses a jobField, this set changes and the Item 8 test (which pins it
// to the agreed set) fails — forcing the chip and the mapping to stay in lockstep.
export function deriveContractBoundJobFields(): Set<string> {
  const set = new Set<string>();
  for (const entry of mapJobToDocuSealFields({} as DetailJob, {} as JobDetails)) {
    if (entry.jobField) set.add(entry.jobField);
    if (entry.jobFields) entry.jobFields.forEach((f) => set.add(f));
  }
  return set;
}

export const CONTRACT_BOUND_JOB_FIELDS: Set<string> = deriveContractBoundJobFields();

/** True when a job-page field flows into the Letter of Engagement (drives the "in LOE" chip). */
export function isContractBoundField(fieldKey: string): boolean {
  return CONTRACT_BOUND_JOB_FIELDS.has(fieldKey);
}

// Check if all required fields are filled (relaxed for preview testing)
export function validateRequiredFields(
  job: DetailJob,
  jobDetails: JobDetails,
): {
  isValid: boolean;
  missingFields: string[];
} {
  const missingFields: string[] = [];

  // Only require basic fields for preview
  if (!job.clientFirstName) missingFields.push("Client First Name");
  if (!job.clientLastName) missingFields.push("Client Last Name");
  if (!job.clientEmail) missingFields.push("Client Email");
  if (!job.propertyAddress) missingFields.push("Property Address");

  // Optional fields for preview (show warnings but don't block)
  const warnings: string[] = [];
  if (!jobDetails.jobNumber) warnings.push("Job Number (will use temporary)");
  if (!jobDetails.appraisalFee) warnings.push("Appraisal Fee (will show TBD)");

  // Only log warnings once per session to avoid console spam
  // Commented out to prevent console spam - warnings are expected for new jobs
  // if (warnings.length > 0 && typeof window !== "undefined") {
  //   const warningKey = `docuseal_warning_${job.id}`;
  //   if (!window.sessionStorage.getItem(warningKey)) {
  //     console.log("⚠️ Preview warnings:", warnings);
  //     window.sessionStorage.setItem(warningKey, "shown");
  //   }
  // }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

// Send document for e-signature via DocuSeal
export async function sendForESignature(
  job: DetailJob,
  jobDetails: JobDetails,
): Promise<{ success: boolean; submissionId?: string; error?: string }> {
  try {
    // Validate required fields first
    const validation = validateRequiredFields(job, jobDetails);
    if (!validation.isValid) {
      return {
        success: false,
        error: `Missing required fields: ${validation.missingFields.join(", ")}`,
      };
    }

    // Map all fields
    const fields = mapJobToDocuSealFields(job, jobDetails);

    // Prepare submission data
    const submissionData: DocuSealSubmissionData = {
      template_id: parseInt(DOCUSEAL_TEMPLATE_ID),
      send_email: true,
      submitters: [
        {
          email: job.clientEmail,
          phone: job.clientPhone,
          name: `${job.clientFirstName} ${job.clientLastName}`,
          role: "First Party",
          fields: fields,
        },
      ],
    };

    console.log("Sending to DocuSeal:", submissionData);

    // Send to DocuSeal API
    const response = await fetch(`${DOCUSEAL_API_BASE}/submissions`, {
      method: "POST",
      headers: {
        "X-Auth-Token": DOCUSEAL_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submissionData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DocuSeal API error:", errorText);
      throw new Error(`DocuSeal API error: ${response.status}`);
    }

    const result = await response.json();
    console.log("DocuSeal submission created:", result);

    // Update ClickUp checklist to mark LOE as sent
    if (job.clickup_task_id || job.clickupTaskId) {
      const taskId = job.clickup_task_id || job.clickupTaskId;
      try {
        await markLOESent(taskId);
        console.log("✅ Updated ClickUp checklist: LOE marked as sent");
      } catch (error) {
        console.warn("Failed to update ClickUp checklist:", error);
        // Don't fail the DocuSeal operation if ClickUp update fails
      }
    }

    return {
      success: true,
      submissionId: result[0]?.id || result.id,
    };
  } catch (error: any) {
    console.error("Error sending for e-signature:", error);
    return {
      success: false,
      error: error.message || "Failed to send document for signature",
    };
  }
}

// Handle webhook when document is signed
export interface DocuSealWebhookPayload {
  event_type: "submission.completed" | "submission.created";
  data: {
    id: string;
    status: string;
    email: string;
    created_at: string;
    completed_at?: string;
    documents?: Array<{
      id: string;
      name: string;
      url: string;
    }>;
    submission_events?: Array<{
      event_type: string;
      event_timestamp: string;
    }>;
  };
}

export async function handleDocuSealWebhook(
  payload: DocuSealWebhookPayload,
): Promise<{ success: boolean; documentUrl?: string }> {
  try {
    if (payload.event_type === "submission.completed") {
      // Document has been signed
      const signedDocument = payload.data.documents?.[0];

      if (signedDocument) {
        console.log("Document signed:", signedDocument);

        return {
          success: true,
          documentUrl: signedDocument.url,
        };
      }
    }

    return { success: false };
  } catch (error) {
    console.error("Error handling DocuSeal webhook:", error);
    return { success: false };
  }
}
