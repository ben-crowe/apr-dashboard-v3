---
cognee_metadata:
  source_type: document
  source_path: "/Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-DOCUSEAL-ARCHITECTURE.md"
  source_date: "2026-01-20"

  category: apr-dashboard
  subcategory: loe-docuseal-esignature
  project: APR-Dashboard-v3

  tags:
    technologies: [react, typescript, supabase, docuseal, resend, clickup, deno]
    concepts: [field-mapping, html-generation, webhook-processing, email-sending, document-signing, template-injection]
    domains: [apr-dashboard, appraisal, letter-of-engagement, esignature]

  entities_referenced:
    - apr_dashboard_v3
    - docuseal_api
    - supabase_edge_functions
    - resend_api
    - clickup_api

  entities_created:
    - id: generate_loe_ts
      name: "generateLOE.ts"
      type: FILE
      description: "Core LOE generation logic with field mapping and DocuSeal submission"
    - id: v3_template_ts
      name: "v3Template.ts"
      type: FILE
      description: "HTML template constant with DocuSeal anchor tags"
    - id: loe_quote_section_tsx
      name: "LoeQuoteSection.tsx"
      type: FILE
      description: "React UI component for LOE quote section"
    - id: loe_preview_modal_tsx
      name: "LOEPreviewModal.tsx"
      type: FILE
      description: "React modal for previewing generated LOE HTML"
    - id: docuseal_proxy_index_ts
      name: "docuseal-proxy/index.ts"
      type: FILE
      description: "Supabase Edge Function that proxies DocuSeal API calls"
    - id: send_loe_email_index_ts
      name: "send-loe-email-fixed/index.ts"
      type: FILE
      description: "Supabase Edge Function that sends custom LOE emails via Resend"
    - id: docuseal_webhook_index_ts
      name: "docuseal-webhook/index.ts"
      type: FILE
      description: "Supabase Edge Function that handles DocuSeal webhook events"
    - id: job_ts
      name: "job.ts"
      type: FILE
      description: "TypeScript type definitions"
    - id: generate_loe_html_function
      name: "generateLOEHTML()"
      type: FUNCTION
      description: "Generates LOE HTML document from template and job data"
    - id: generate_and_send_loe_function
      name: "generateAndSendLOE()"
      type: FUNCTION
      description: "Main orchestration function that generates and sends LOE"
    - id: send_loe_email_helper
      name: "sendLOEEmail()"
      type: FUNCTION
      description: "Helper function that calls email Edge Function"
    - id: map_data_to_v3_fields_function
      name: "mapDataToV3Fields()"
      type: FUNCTION
      description: "Maps job data to template field placeholders"
    - id: load_v3_template_function
      name: "loadV3Template()"
      type: FUNCTION
      description: "Loads V3_TEMPLATE constant"
    - id: update_job_with_docuseal_function
      name: "updateJobWithDocuSeal()"
      type: FUNCTION
      description: "Updates job with DocuSeal submission ID"
    - id: validate_required_fields_function
      name: "validateRequiredFields()"
      type: FUNCTION
      description: "Validates required fields before LOE generation"
    - id: update_clickup_loe_status_function
      name: "updateClickUpLOEStatus()"
      type: FUNCTION
      description: "Updates ClickUp task with LOE status"
    - id: job_submissions_table
      name: "job_submissions"
      type: TABLE
      description: "Main job record table"
    - id: job_loe_details_table
      name: "job_loe_details"
      type: TABLE
      description: "LOE-specific data and DocuSeal metadata table"
    - id: loe_submissions_table
      name: "loe_submissions"
      type: TABLE
      description: "Tracks DocuSeal submissions with HTML documents"
    - id: job_files_table
      name: "job_files"
      type: TABLE
      description: "General file management system for jobs"
    - id: job_submissions_id_column
      name: "job_submissions.id"
      type: COLUMN
      description: "Primary key UUID"
    - id: job_submissions_client_first_name_column
      name: "job_submissions.client_first_name"
      type: COLUMN
      description: "Client first name"
    - id: job_submissions_client_last_name_column
      name: "job_submissions.client_last_name"
      type: COLUMN
      description: "Client last name"
    - id: job_submissions_client_email_column
      name: "job_submissions.client_email"
      type: COLUMN
      description: "Client email address"
    - id: job_submissions_client_phone_column
      name: "job_submissions.client_phone"
      type: COLUMN
      description: "Client phone number"
    - id: job_submissions_client_organization_column
      name: "job_submissions.client_organization"
      type: COLUMN
      description: "Client organization name"
    - id: job_submissions_property_name_column
      name: "job_submissions.property_name"
      type: COLUMN
      description: "Property name"
    - id: job_submissions_property_address_column
      name: "job_submissions.property_address"
      type: COLUMN
      description: "Property street address"
    - id: job_submissions_property_type_column
      name: "job_submissions.property_type"
      type: COLUMN
      description: "Property type"
    - id: job_submissions_intended_use_column
      name: "job_submissions.intended_use"
      type: COLUMN
      description: "Intended use"
    - id: job_submissions_status_column
      name: "job_submissions.status"
      type: COLUMN
      description: "Job status enum value"
    - id: job_submissions_clickup_task_id_column
      name: "job_submissions.clickup_task_id"
      type: COLUMN
      description: "ClickUp task identifier"
    - id: job_submissions_clickup_task_url_column
      name: "job_submissions.clickup_task_url"
      type: COLUMN
      description: "ClickUp task URL"
    - id: job_submissions_created_at_column
      name: "job_submissions.created_at"
      type: COLUMN
      description: "Created timestamp"
    - id: job_submissions_updated_at_column
      name: "job_submissions.updated_at"
      type: COLUMN
      description: "Updated timestamp"
    - id: job_loe_details_id_column
      name: "job_loe_details.id"
      type: COLUMN
      description: "Primary key UUID"
    - id: job_loe_details_job_id_column
      name: "job_loe_details.job_id"
      type: COLUMN
      description: "Foreign key to job_submissions"
    - id: job_loe_details_job_number_column
      name: "job_loe_details.job_number"
      type: COLUMN
      description: "Valcre job number (e.g., VAL251999)"
    - id: job_loe_details_valcre_job_id_column
      name: "job_loe_details.valcre_job_id"
      type: COLUMN
      description: "Valcre internal ID"
    - id: job_loe_details_appraisal_fee_column
      name: "job_loe_details.appraisal_fee"
      type: COLUMN
      description: "Appraisal fee amount"
    - id: job_loe_details_retainer_amount_column
      name: "job_loe_details.retainer_amount"
      type: COLUMN
      description: "Retainer amount as string"
    - id: job_loe_details_payment_terms_column
      name: "job_loe_details.payment_terms"
      type: COLUMN
      description: "Payment terms text"
    - id: job_loe_details_delivery_date_column
      name: "job_loe_details.delivery_date"
      type: COLUMN
      description: "Delivery date"
    - id: job_loe_details_scope_of_work_column
      name: "job_loe_details.scope_of_work"
      type: COLUMN
      description: "Scope of work text"
    - id: job_loe_details_valuation_premises_column
      name: "job_loe_details.valuation_premises"
      type: COLUMN
      description: "Valuation premises text"
    - id: job_loe_details_property_rights_appraised_column
      name: "job_loe_details.property_rights_appraised"
      type: COLUMN
      description: "Property rights appraised"
    - id: job_loe_details_report_type_column
      name: "job_loe_details.report_type"
      type: COLUMN
      description: "Report type"
    - id: job_loe_details_internal_comments_column
      name: "job_loe_details.internal_comments"
      type: COLUMN
      description: "Internal comments"
    - id: job_loe_details_delivery_comments_column
      name: "job_loe_details.delivery_comments"
      type: COLUMN
      description: "Delivery comments"
    - id: job_loe_details_payment_comments_column
      name: "job_loe_details.payment_comments"
      type: COLUMN
      description: "Payment comments"
    - id: job_loe_details_docuseal_submission_id_column
      name: "job_loe_details.docuseal_submission_id"
      type: COLUMN
      description: "DocuSeal submission ID"
    - id: job_loe_details_signed_document_url_column
      name: "job_loe_details.signed_document_url"
      type: COLUMN
      description: "URL to signed PDF"
    - id: job_loe_details_signed_at_column
      name: "job_loe_details.signed_at"
      type: COLUMN
      description: "Signature completion timestamp"
    - id: job_loe_details_loe_sent_at_column
      name: "job_loe_details.loe_sent_at"
      type: COLUMN
      description: "LOE sent timestamp"
    - id: job_loe_details_clickup_task_id_column
      name: "job_loe_details.clickup_task_id"
      type: COLUMN
      description: "ClickUp task ID"
    - id: job_loe_details_clickup_task_url_column
      name: "job_loe_details.clickup_task_url"
      type: COLUMN
      description: "ClickUp task URL"
    - id: job_loe_details_created_at_column
      name: "job_loe_details.created_at"
      type: COLUMN
      description: "Created timestamp"
    - id: job_loe_details_updated_at_column
      name: "job_loe_details.updated_at"
      type: COLUMN
      description: "Updated timestamp"
    - id: loe_submissions_id_column
      name: "loe_submissions.id"
      type: COLUMN
      description: "Primary key UUID"
    - id: loe_submissions_job_id_column
      name: "loe_submissions.job_id"
      type: COLUMN
      description: "Job identifier (text)"
    - id: loe_submissions_client_name_column
      name: "loe_submissions.client_name"
      type: COLUMN
      description: "Client full name"
    - id: loe_submissions_client_email_column
      name: "loe_submissions.client_email"
      type: COLUMN
      description: "Client email"
    - id: loe_submissions_loe_html_column
      name: "loe_submissions.loe_html"
      type: COLUMN
      description: "Complete HTML document"
    - id: loe_submissions_docuseal_slug_column
      name: "loe_submissions.docuseal_slug"
      type: COLUMN
      description: "DocuSeal signing slug"
    - id: loe_submissions_docuseal_submission_id_column
      name: "loe_submissions.docuseal_submission_id"
      type: COLUMN
      description: "DocuSeal submission ID"
    - id: loe_submissions_status_column
      name: "loe_submissions.status"
      type: COLUMN
      description: "Submission status (pending/signed/expired)"
    - id: loe_submissions_created_at_column
      name: "loe_submissions.created_at"
      type: COLUMN
      description: "Created timestamp"
    - id: loe_submissions_signed_at_column
      name: "loe_submissions.signed_at"
      type: COLUMN
      description: "Signed timestamp"
    - id: job_files_id_column
      name: "job_files.id"
      type: COLUMN
      description: "Primary key UUID"
    - id: job_files_job_id_column
      name: "job_files.job_id"
      type: COLUMN
      description: "Foreign key to job_submissions"
    - id: job_files_file_name_column
      name: "job_files.file_name"
      type: COLUMN
      description: "File name"
    - id: job_files_file_type_column
      name: "job_files.file_type"
      type: COLUMN
      description: "File type (e.g., application/pdf)"
    - id: job_files_file_size_column
      name: "job_files.file_size"
      type: COLUMN
      description: "File size in bytes"
    - id: job_files_storage_path_column
      name: "job_files.storage_path"
      type: COLUMN
      description: "File storage path or URL"
    - id: job_files_category_column
      name: "job_files.category"
      type: COLUMN
      description: "File category (signed_agreement, etc.)"
    - id: job_files_is_client_visible_column
      name: "job_files.is_client_visible"
      type: COLUMN
      description: "Client visibility flag"
    - id: job_files_created_at_column
      name: "job_files.created_at"
      type: COLUMN
      description: "Created timestamp"
    - id: field_mapping_date_created
      name: "[date.created] placeholder"
      type: CONCEPT
      description: "Date created field mapping - Generated via new Date().toLocaleDateString()"
    - id: field_mapping_propertycontact_company
      name: "[propertycontact.company] placeholder"
      type: CONCEPT
      description: "Client organization field mapping - From job.clientOrganization"
    - id: field_mapping_propertycontact_firstname
      name: "[propertycontact.firstname] placeholder"
      type: CONCEPT
      description: "Client first name field mapping - From job.clientFirstName"
    - id: field_mapping_propertycontact_lastname
      name: "[propertycontact.lastname] placeholder"
      type: CONCEPT
      description: "Client last name field mapping - From job.clientLastName"
    - id: field_mapping_propertycontact_title
      name: "[propertycontact.title] placeholder"
      type: CONCEPT
      description: "Client title field mapping - From job.clientTitle"
    - id: field_mapping_propertycontact_addressstreet
      name: "[propertycontact.addressstreet] placeholder"
      type: CONCEPT
      description: "Client address field mapping - From job.clientAddress"
    - id: field_mapping_name
      name: "[name] placeholder"
      type: CONCEPT
      description: "Job number field mapping - From jobDetails.jobNumber"
    - id: field_mapping_addressstreet
      name: "[addressstreet] placeholder"
      type: CONCEPT
      description: "Property address field mapping - From job.propertyAddress"
    - id: field_mapping_purposes
      name: "[purposes] placeholder"
      type: CONCEPT
      description: "Intended use field mapping - From job.intendedUse"
    - id: field_mapping_intendeduses
      name: "[intendeduses] placeholder"
      type: CONCEPT
      description: "Intended uses field mapping - From job.intendedUse (duplicate)"
    - id: field_mapping_requestedvalues
      name: "[requestedvalues] placeholder"
      type: CONCEPT
      description: "Valuation premises field mapping - From jobDetails.valuationPremises"
    - id: field_mapping_propertyrights
      name: "[propertyrights] placeholder"
      type: CONCEPT
      description: "Property rights appraised field mapping - From jobDetails.propertyRightsAppraised"
    - id: field_mapping_reportformat
      name: "[reportformat] placeholder"
      type: CONCEPT
      description: "Report type field mapping - From jobDetails.reportType"
    - id: field_mapping_fee
      name: "[fee] placeholder"
      type: CONCEPT
      description: "Appraisal fee field mapping - From jobDetails.appraisalFee (currency formatted)"
    - id: field_mapping_retainer
      name: "[retainer] placeholder"
      type: CONCEPT
      description: "Retainer amount field mapping - From jobDetails.retainerAmount (currency formatted)"
    - id: field_mapping_paymentterms
      name: "[paymentterms] placeholder"
      type: CONCEPT
      description: "Payment terms field mapping - From jobDetails.paymentTerms"
    - id: field_mapping_scopes
      name: "[scopes] placeholder"
      type: CONCEPT
      description: "Scope of work field mapping - From jobDetails.scopeOfWork"
    - id: field_mapping_duedate
      name: "[duedate] placeholder"
      type: CONCEPT
      description: "Delivery date field mapping - From jobDetails.deliveryDate"
    - id: field_mapping_jobnumber
      name: "[jobnumber] placeholder"
      type: CONCEPT
      description: "Job number field mapping - From jobDetails.jobNumber (duplicate)"
    - id: field_mapping_notes
      name: "[notes] placeholder"
      type: CONCEPT
      description: "Notes field mapping - From job.notes || jobDetails.specialInstructions"
    - id: job_status_submitted
      name: ""submitted" status"
      type: CONCEPT
      description: "Job status enum value - submitted"
    - id: job_status_in_progress
      name: ""in_progress" status"
      type: CONCEPT
      description: "Job status enum value - in_progress"
    - id: job_status_loe_pending
      name: ""loe_pending" status"
      type: CONCEPT
      description: "Job status enum value - loe_pending"
    - id: job_status_loe_sent
      name: ""loe_sent" status"
      type: CONCEPT
      description: "Job status enum value - loe_sent"
    - id: job_status_loe_signed
      name: ""loe_signed" status"
      type: CONCEPT
      description: "Job status enum value - loe_signed"
    - id: job_status_contract_generated
      name: ""contract_generated" status"
      type: CONCEPT
      description: "Job status enum value - contract_generated"
    - id: job_status_paid
      name: ""paid" status"
      type: CONCEPT
      description: "Job status enum value - paid"
    - id: job_status_active
      name: ""active" status"
      type: CONCEPT
      description: "Job status enum value - active"
    - id: job_status_completed
      name: ""completed" status"
      type: CONCEPT
      description: "Job status enum value - completed"
    - id: job_status_pending_loe
      name: ""pending_loe" status"
      type: CONCEPT
      description: "Job status enum value - pending_loe (initial state)"
    - id: job_status_payment_pending
      name: ""payment_pending" status"
      type: CONCEPT
      description: "Job status enum value - payment_pending"
    - id: job_status_job_in_progress
      name: ""job_in_progress" status"
      type: CONCEPT
      description: "Job status enum value - job_in_progress"
    - id: loe_submission_status_pending
      name: ""pending" LOE status"
      type: CONCEPT
      description: "LOE submission status enum value - pending"
    - id: loe_submission_status_signed
      name: ""signed" LOE status"
      type: CONCEPT
      description: "LOE submission status enum value - signed"
    - id: loe_submission_status_expired
      name: ""expired" LOE status"
      type: CONCEPT
      description: "LOE submission status enum value - expired"
    - id: docuseal_submission_created_event
      name: "submission.created webhook event"
      type: CONCEPT
      description: "DocuSeal webhook event type - submission.created"
    - id: docuseal_submission_completed_event
      name: "submission.completed webhook event"
      type: CONCEPT
      description: "DocuSeal webhook event type - submission.completed"
    - id: docuseal_api_endpoint_submissions_html
      name: "POST /submissions/html"
      type: ENDPOINT
      description: "DocuSeal API endpoint for HTML submission"
    - id: docuseal_proxy_endpoint
      name: "/functions/v1/docuseal-proxy"
      type: ENDPOINT
      description: "Supabase Edge Function proxy endpoint"
    - id: send_loe_email_endpoint
      name: "/functions/v1/send-loe-email-fixed"
      type: ENDPOINT
      description: "Supabase Edge Function email endpoint"
    - id: docuseal_webhook_endpoint
      name: "/functions/v1/docuseal-webhook"
      type: ENDPOINT
      description: "Supabase Edge Function webhook endpoint"
    - id: detail_job_interface
      name: "DetailJob interface"
      type: CONCEPT
      description: "TypeScript interface for job data - extends JobSubmission"
    - id: job_details_interface
      name: "JobDetails interface"
      type: CONCEPT
      description: "TypeScript interface for LOE details"
    - id: docuseal_webhook_payload_interface
      name: "DocuSealWebhookPayload interface"
      type: CONCEPT
      description: "TypeScript interface for webhook payload"
    - id: docuseal_submission_response_interface
      name: "DocuSealSubmissionResponse interface"
      type: CONCEPT
      description: "TypeScript interface for submission response"
    - id: detail_job_files_property
      name: "DetailJob.files"
      type: CONCEPT
      description: "TypeScript property - Optional array of JobFile"
    - id: detail_job_clickup_task_id_property
      name: "DetailJob.clickup_task_id"
      type: CONCEPT
      description: "TypeScript property - Optional string for ClickUp task ID"
    - id: detail_job_clickup_task_url_property
      name: "DetailJob.clickup_task_url"
      type: CONCEPT
      description: "TypeScript property - Optional string for ClickUp task URL"
    - id: job_submission_id_property
      name: "JobSubmission.id"
      type: CONCEPT
      description: "TypeScript property - string ID"
    - id: job_submission_client_first_name_property
      name: "JobSubmission.clientFirstName"
      type: CONCEPT
      description: "TypeScript property - string client first name"
    - id: job_submission_client_last_name_property
      name: "JobSubmission.clientLastName"
      type: CONCEPT
      description: "TypeScript property - string client last name"
    - id: job_submission_client_email_property
      name: "JobSubmission.clientEmail"
      type: CONCEPT
      description: "TypeScript property - string client email"
    - id: job_submission_client_phone_property
      name: "JobSubmission.clientPhone"
      type: CONCEPT
      description: "TypeScript property - string client phone"
    - id: job_submission_client_title_property
      name: "JobSubmission.clientTitle"
      type: CONCEPT
      description: "TypeScript property - optional string client title"
    - id: job_submission_client_organization_property
      name: "JobSubmission.clientOrganization"
      type: CONCEPT
      description: "TypeScript property - optional string client organization"
    - id: job_submission_client_address_property
      name: "JobSubmission.clientAddress"
      type: CONCEPT
      description: "TypeScript property - optional string client address"
    - id: job_submission_property_address_property
      name: "JobSubmission.propertyAddress"
      type: CONCEPT
      description: "TypeScript property - string property address"
    - id: job_submission_property_name_property
      name: "JobSubmission.propertyName"
      type: CONCEPT
      description: "TypeScript property - optional string property name"
    - id: job_submission_property_type_property
      name: "JobSubmission.propertyType"
      type: CONCEPT
      description: "TypeScript property - optional string property type (legacy)"
    - id: job_submission_property_types_property
      name: "JobSubmission.propertyTypes"
      type: CONCEPT
      description: "TypeScript property - optional string array property types"
    - id: job_submission_intended_use_property
      name: "JobSubmission.intendedUse"
      type: CONCEPT
      description: "TypeScript property - optional string intended use"
    - id: job_submission_asset_condition_property
      name: "JobSubmission.assetCondition"
      type: CONCEPT
      description: "TypeScript property - optional string asset condition"
    - id: job_submission_notes_property
      name: "JobSubmission.notes"
      type: CONCEPT
      description: "TypeScript property - optional string notes"
    - id: job_submission_property_contact_first_name_property
      name: "JobSubmission.propertyContactFirstName"
      type: CONCEPT
      description: "TypeScript property - optional string property contact first name"
    - id: job_submission_property_contact_last_name_property
      name: "JobSubmission.propertyContactLastName"
      type: CONCEPT
      description: "TypeScript property - optional string property contact last name"
    - id: job_submission_property_contact_email_property
      name: "JobSubmission.propertyContactEmail"
      type: CONCEPT
      description: "TypeScript property - optional string property contact email"
    - id: job_submission_property_contact_phone_property
      name: "JobSubmission.propertyContactPhone"
      type: CONCEPT
      description: "TypeScript property - optional string property contact phone"
    - id: job_submission_same_as_client_contact_property
      name: "JobSubmission.sameAsClientContact"
      type: CONCEPT
      description: "TypeScript property - optional boolean same as client contact"
    - id: job_submission_status_property
      name: "JobSubmission.status"
      type: CONCEPT
      description: "TypeScript property - JobStatus enum"
    - id: job_submission_created_at_property
      name: "JobSubmission.createdAt"
      type: CONCEPT
      description: "TypeScript property - string created timestamp"
    - id: job_submission_job_number_property
      name: "JobSubmission.jobNumber"
      type: CONCEPT
      description: "TypeScript property - optional string job number"
    - id: job_submission_clickup_task_id_property
      name: "JobSubmission.clickupTaskId"
      type: CONCEPT
      description: "TypeScript property - optional string ClickUp task ID"
    - id: job_submission_clickup_task_url_property
      name: "JobSubmission.clickupTaskUrl"
      type: CONCEPT
      description: "TypeScript property - optional string ClickUp task URL"
    - id: job_submission_files_property
      name: "JobSubmission.files"
      type: CONCEPT
      description: "TypeScript property - optional array of JobFile"
    - id: job_details_job_number_property
      name: "JobDetails.jobNumber"
      type: CONCEPT
      description: "TypeScript property - optional string job number"
    - id: job_details_valcre_job_id_property
      name: "JobDetails.valcreJobId"
      type: CONCEPT
      description: "TypeScript property - optional string Valcre job ID"
    - id: job_details_valcre_job_id_alt_property
      name: "JobDetails.valcre_job_id"
      type: CONCEPT
      description: "TypeScript property - optional string Valcre job ID (alternative naming)"
    - id: job_details_docuseal_submission_id_property
      name: "JobDetails.docusealSubmissionId"
      type: CONCEPT
      description: "TypeScript property - optional string DocuSeal submission ID"
    - id: job_details_docuseal_submission_id_alt_property
      name: "JobDetails.docuseal_submission_id"
      type: CONCEPT
      description: "TypeScript property - optional string DocuSeal submission ID (alternative naming)"
    - id: job_details_property_rights_appraised_property
      name: "JobDetails.propertyRightsAppraised"
      type: CONCEPT
      description: "TypeScript property - optional string property rights appraised"
    - id: job_details_valuation_premises_property
      name: "JobDetails.valuationPremises"
      type: CONCEPT
      description: "TypeScript property - optional string valuation premises"
    - id: job_details_delivery_date_property
      name: "JobDetails.deliveryDate"
      type: CONCEPT
      description: "TypeScript property - optional string delivery date"
    - id: job_details_scope_of_work_property
      name: "JobDetails.scopeOfWork"
      type: CONCEPT
      description: "TypeScript property - optional string scope of work"
    - id: job_details_special_instructions_property
      name: "JobDetails.specialInstructions"
      type: CONCEPT
      description: "TypeScript property - optional string special instructions"
    - id: job_details_report_type_property
      name: "JobDetails.reportType"
      type: CONCEPT
      description: "TypeScript property - optional string report type"
    - id: job_details_payment_terms_property
      name: "JobDetails.paymentTerms"
      type: CONCEPT
      description: "TypeScript property - optional string payment terms"
    - id: job_details_appraisal_fee_property
      name: "JobDetails.appraisalFee"
      type: CONCEPT
      description: "TypeScript property - optional number appraisal fee"
    - id: job_details_retainer_amount_property
      name: "JobDetails.retainerAmount"
      type: CONCEPT
      description: "TypeScript property - optional string retainer amount"
    - id: job_details_disbursement_percentage_property
      name: "JobDetails.disbursementPercentage"
      type: CONCEPT
      description: "TypeScript property - optional string disbursement percentage"
    - id: job_details_internal_comments_property
      name: "JobDetails.internalComments"
      type: CONCEPT
      description: "TypeScript property - optional string internal comments"
    - id: job_details_year_built_property
      name: "JobDetails.yearBuilt"
      type: CONCEPT
      description: "TypeScript property - optional string year built"
    - id: job_details_building_size_property
      name: "JobDetails.buildingSize"
      type: CONCEPT
      description: "TypeScript property - optional string building size"
    - id: job_details_legal_description_property
      name: "JobDetails.legalDescription"
      type: CONCEPT
      description: "TypeScript property - optional string legal description"
    - id: job_details_number_of_units_property
      name: "JobDetails.numberOfUnits"
      type: CONCEPT
      description: "TypeScript property - optional number number of units"
    - id: job_details_parking_spaces_property
      name: "JobDetails.parkingSpaces"
      type: CONCEPT
      description: "TypeScript property - optional number parking spaces"
    - id: job_details_zoning_classification_property
      name: "JobDetails.zoningClassification"
      type: CONCEPT
      description: "TypeScript property - optional string zoning classification"
    - id: job_details_zone_abbreviation_property
      name: "JobDetails.zoneAbbreviation"
      type: CONCEPT
      description: "TypeScript property - optional string zone abbreviation"
    - id: job_details_land_use_designation_property
      name: "JobDetails.landUseDesignation"
      type: CONCEPT
      description: "TypeScript property - optional string land use designation"
    - id: job_details_flood_zone_property
      name: "JobDetails.floodZone"
      type: CONCEPT
      description: "TypeScript property - optional string flood zone"
    - id: job_details_utilities_property
      name: "JobDetails.utilities"
      type: CONCEPT
      description: "TypeScript property - optional string utilities"
    - id: job_details_parcel_number_property
      name: "JobDetails.parcelNumber"
      type: CONCEPT
      description: "TypeScript property - optional string parcel number"
    - id: job_details_usable_land_sf_property
      name: "JobDetails.usableLandSf"
      type: CONCEPT
      description: "TypeScript property - optional number usable land square feet"
    - id: job_details_usable_land_acres_property
      name: "JobDetails.usableLandAcres"
      type: CONCEPT
      description: "TypeScript property - optional number usable land acres"
    - id: job_details_gross_land_sf_property
      name: "JobDetails.grossLandSf"
      type: CONCEPT
      description: "TypeScript property - optional number gross land square feet"
    - id: job_details_gross_land_acres_property
      name: "JobDetails.grossLandAcres"
      type: CONCEPT
      description: "TypeScript property - optional number gross land acres"
    - id: job_details_assessed_value_property
      name: "JobDetails.assessedValue"
      type: CONCEPT
      description: "TypeScript property - optional number assessed value"
    - id: job_details_taxes_property
      name: "JobDetails.taxes"
      type: CONCEPT
      description: "TypeScript property - optional number taxes"
    - id: job_details_assessment_year_property
      name: "JobDetails.assessmentYear"
      type: CONCEPT
      description: "TypeScript property - optional string assessment year"
    - id: job_details_land_assessment_value_property
      name: "JobDetails.landAssessmentValue"
      type: CONCEPT
      description: "TypeScript property - optional number land assessment value"
    - id: job_details_improved_assessment_value_property
      name: "JobDetails.improvedAssessmentValue"
      type: CONCEPT
      description: "TypeScript property - optional number improved assessment value"
    - id: job_details_total_assessment_value_property
      name: "JobDetails.totalAssessmentValue"
      type: CONCEPT
      description: "TypeScript property - optional number total assessment value"
    - id: generate_loe_html_job_param
      name: "generateLOEHTML job parameter"
      type: CONCEPT
      description: "Function parameter - DetailJob job"
    - id: generate_loe_html_job_details_param
      name: "generateLOEHTML jobDetails parameter"
      type: CONCEPT
      description: "Function parameter - JobDetails jobDetails"
    - id: generate_and_send_loe_job_param
      name: "generateAndSendLOE job parameter"
      type: CONCEPT
      description: "Function parameter - DetailJob job"
    - id: generate_and_send_loe_job_details_param
      name: "generateAndSendLOE jobDetails parameter"
      type: CONCEPT
      description: "Function parameter - JobDetails jobDetails"
    - id: generate_and_send_loe_html_template_param
      name: "generateAndSendLOE htmlTemplate parameter"
      type: CONCEPT
      description: "Function parameter - optional string htmlTemplate"
    - id: send_loe_email_client_email_param
      name: "sendLOEEmail clientEmail parameter"
      type: CONCEPT
      description: "Function parameter - string clientEmail"
    - id: send_loe_email_client_name_param
      name: "sendLOEEmail clientName parameter"
      type: CONCEPT
      description: "Function parameter - string clientName"
    - id: send_loe_email_signing_link_param
      name: "sendLOEEmail signingLink parameter"
      type: CONCEPT
      description: "Function parameter - string signingLink"
    - id: send_loe_email_property_address_param
      name: "sendLOEEmail propertyAddress parameter"
      type: CONCEPT
      description: "Function parameter - string propertyAddress"
    - id: map_data_to_v3_fields_job_param
      name: "mapDataToV3Fields job parameter"
      type: CONCEPT
      description: "Function parameter - DetailJob job"
    - id: map_data_to_v3_fields_job_details_param
      name: "mapDataToV3Fields jobDetails parameter"
      type: CONCEPT
      description: "Function parameter - JobDetails jobDetails"
    - id: generate_loe_html_return_type
      name: "generateLOEHTML return type"
      type: CONCEPT
      description: "Return type - Promise<string>"
    - id: generate_and_send_loe_return_type
      name: "generateAndSendLOE return type"
      type: CONCEPT
      description: "Return type - Promise with success, submissionId, signingLink, error"
    - id: send_loe_email_return_type
      name: "sendLOEEmail return type"
      type: CONCEPT
      description: "Return type - Promise<boolean>"
    - id: map_data_to_v3_fields_return_type
      name: "mapDataToV3Fields return type"
      type: CONCEPT
      description: "Return type - Record<string, string>"
    - id: v3_template_constant
      name: "V3_TEMPLATE"
      type: CONFIG
      description: "Complete HTML template string constant"
    - id: docuseal_api_key_config
      name: "DOCUSEAL_API_KEY"
      type: CONFIG
      description: "DocuSeal API key environment variable"
    - id: resend_api_key_config
      name: "RESEND_API_KEY"
      type: CONFIG
      description: "Resend API key environment variable"
    - id: cors_headers_config
      name: "CORS headers configuration"
      type: CONFIG
      description: "CORS headers for Edge Function"
    - id: cors_header_access_control_allow_origin
      name: "Access-Control-Allow-Origin header"
      type: CONFIG
      description: "CORS header - Access-Control-Allow-Origin: *"
    - id: cors_header_access_control_allow_headers
      name: "Access-Control-Allow-Headers header"
      type: CONFIG
      description: "CORS header - Access-Control-Allow-Headers"
    - id: docuseal_signature_field_tag
      name: "signature-field anchor tag"
      type: CONCEPT
      description: "DocuSeal HTML anchor tag for signature fields"
    - id: docuseal_date_field_tag
      name: "date-field anchor tag"
      type: CONCEPT
      description: "DocuSeal HTML anchor tag for date fields"

  relationships:
    - source: loe_quote_section_tsx
      type: CALLS
      target: generate_loe_html_function
    - source: loe_quote_section_tsx
      type: CALLS
      target: generate_and_send_loe_function
    - source: loe_preview_modal_tsx
      type: USES
      target: generate_loe_html_function
    - source: generate_loe_html_function
      type: USES
      target: v3_template_constant
    - source: generate_loe_html_function
      type: CALLS
      target: map_data_to_v3_fields_function
    - source: generate_loe_html_function
      type: CALLS
      target: load_v3_template_function
    - source: generate_and_send_loe_function
      type: CALLS
      target: generate_loe_html_function
    - source: generate_and_send_loe_function
      type: CALLS
      target: send_loe_email_helper
    - source: generate_and_send_loe_function
      type: CALLS
      target: docuseal_proxy_endpoint
    - source: generate_and_send_loe_function
      type: STORES_IN
      target: loe_submissions_table
    - source: generate_and_send_loe_function
      type: STORES_IN
      target: job_loe_details_table
    - source: send_loe_email_helper
      type: CALLS
      target: send_loe_email_endpoint
    - source: send_loe_email_index_ts
      type: CALLS
      target: resend_api
    - source: docuseal_proxy_index_ts
      type: CALLS
      target: docuseal_api_endpoint_submissions_html
    - source: docuseal_proxy_index_ts
      type: USES
      target: docuseal_api_key_config
    - source: docuseal_webhook_index_ts
      type: TRIGGERS
      target: docuseal_submission_created_event
    - source: docuseal_webhook_index_ts
      type: TRIGGERS
      target: docuseal_submission_completed_event
    - source: docuseal_webhook_index_ts
      type: STORES_IN
      target: job_loe_details_table
    - source: docuseal_webhook_index_ts
      type: STORES_IN
      target: job_submissions_table
    - source: docuseal_webhook_index_ts
      type: STORES_IN
      target: loe_submissions_table
    - source: docuseal_webhook_index_ts
      type: STORES_IN
      target: job_files_table
    - source: docuseal_webhook_index_ts
      type: CALLS
      target: clickup_api
    - source: job_submissions_table
      type: HAS_COLUMN
      target: job_submissions_id_column
    - source: job_submissions_table
      type: HAS_COLUMN
      target: job_submissions_client_first_name_column
    - source: job_submissions_table
      type: HAS_COLUMN
      target: job_submissions_client_last_name_column
    - source: job_submissions_table
      type: HAS_COLUMN
      target: job_submissions_client_email_column
    - source: job_submissions_table
      type: HAS_COLUMN
      target: job_submissions_client_phone_column
    - source: job_submissions_table
      type: HAS_COLUMN
      target: job_submissions_client_organization_column
    - source: job_submissions_table
      type: HAS_COLUMN
      target: job_submissions_property_name_column
    - source: job_submissions_table
      type: HAS_COLUMN
      target: job_submissions_property_address_column
    - source: job_submissions_table
      type: HAS_COLUMN
      target: job_submissions_property_type_column
    - source: job_submissions_table
      type: HAS_COLUMN
      target: job_submissions_intended_use_column
    - source: job_submissions_table
      type: HAS_COLUMN
      target: job_submissions_status_column
    - source: job_submissions_table
      type: HAS_COLUMN
      target: job_submissions_clickup_task_id_column
    - source: job_submissions_table
      type: HAS_COLUMN
      target: job_submissions_clickup_task_url_column
    - source: job_submissions_table
      type: HAS_COLUMN
      target: job_submissions_created_at_column
    - source: job_submissions_table
      type: HAS_COLUMN
      target: job_submissions_updated_at_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_id_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_job_id_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_job_number_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_valcre_job_id_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_appraisal_fee_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_retainer_amount_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_payment_terms_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_delivery_date_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_scope_of_work_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_valuation_premises_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_property_rights_appraised_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_report_type_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_internal_comments_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_delivery_comments_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_payment_comments_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_docuseal_submission_id_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_signed_document_url_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_signed_at_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_loe_sent_at_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_clickup_task_id_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_clickup_task_url_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_created_at_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_updated_at_column
    - source: loe_submissions_table
      type: HAS_COLUMN
      target: loe_submissions_id_column
    - source: loe_submissions_table
      type: HAS_COLUMN
      target: loe_submissions_job_id_column
    - source: loe_submissions_table
      type: HAS_COLUMN
      target: loe_submissions_client_name_column
    - source: loe_submissions_table
      type: HAS_COLUMN
      target: loe_submissions_client_email_column
    - source: loe_submissions_table
      type: HAS_COLUMN
      target: loe_submissions_loe_html_column
    - source: loe_submissions_table
      type: HAS_COLUMN
      target: loe_submissions_docuseal_slug_column
    - source: loe_submissions_table
      type: HAS_COLUMN
      target: loe_submissions_docuseal_submission_id_column
    - source: loe_submissions_table
      type: HAS_COLUMN
      target: loe_submissions_status_column
    - source: loe_submissions_table
      type: HAS_COLUMN
      target: loe_submissions_created_at_column
    - source: loe_submissions_table
      type: HAS_COLUMN
      target: loe_submissions_signed_at_column
    - source: job_files_table
      type: HAS_COLUMN
      target: job_files_id_column
    - source: job_files_table
      type: HAS_COLUMN
      target: job_files_job_id_column
    - source: job_files_table
      type: HAS_COLUMN
      target: job_files_file_name_column
    - source: job_files_table
      type: HAS_COLUMN
      target: job_files_file_type_column
    - source: job_files_table
      type: HAS_COLUMN
      target: job_files_file_size_column
    - source: job_files_table
      type: HAS_COLUMN
      target: job_files_storage_path_column
    - source: job_files_table
      type: HAS_COLUMN
      target: job_files_category_column
    - source: job_files_table
      type: HAS_COLUMN
      target: job_files_is_client_visible_column
    - source: job_files_table
      type: HAS_COLUMN
      target: job_files_created_at_column
    - source: detail_job_interface
      type: CONTAINS
      target: detail_job_files_property
    - source: detail_job_interface
      type: CONTAINS
      target: detail_job_clickup_task_id_property
    - source: detail_job_interface
      type: CONTAINS
      target: detail_job_clickup_task_url_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_id_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_client_first_name_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_client_last_name_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_client_email_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_client_phone_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_client_title_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_client_organization_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_client_address_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_property_address_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_property_name_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_property_type_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_property_types_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_intended_use_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_asset_condition_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_notes_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_property_contact_first_name_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_property_contact_last_name_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_property_contact_email_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_property_contact_phone_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_same_as_client_contact_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_status_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_created_at_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_job_number_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_clickup_task_id_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_clickup_task_url_property
    - source: detail_job_interface
      type: CONTAINS
      target: job_submission_files_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_job_number_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_valcre_job_id_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_valcre_job_id_alt_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_docuseal_submission_id_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_docuseal_submission_id_alt_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_property_rights_appraised_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_valuation_premises_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_delivery_date_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_scope_of_work_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_special_instructions_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_report_type_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_payment_terms_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_appraisal_fee_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_retainer_amount_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_disbursement_percentage_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_internal_comments_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_year_built_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_building_size_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_legal_description_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_number_of_units_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_parking_spaces_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_zoning_classification_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_zone_abbreviation_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_land_use_designation_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_flood_zone_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_utilities_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_parcel_number_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_usable_land_sf_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_usable_land_acres_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_gross_land_sf_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_gross_land_acres_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_assessed_value_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_taxes_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_assessment_year_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_land_assessment_value_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_improved_assessment_value_property
    - source: job_details_interface
      type: CONTAINS
      target: job_details_total_assessment_value_property
    - source: map_data_to_v3_fields_function
      type: MAPS_TO
      target: field_mapping_date_created
    - source: map_data_to_v3_fields_function
      type: MAPS_TO
      target: field_mapping_propertycontact_company
    - source: map_data_to_v3_fields_function
      type: MAPS_TO
      target: field_mapping_propertycontact_firstname
    - source: map_data_to_v3_fields_function
      type: MAPS_TO
      target: field_mapping_propertycontact_lastname
    - source: map_data_to_v3_fields_function
      type: MAPS_TO
      target: field_mapping_propertycontact_title
    - source: map_data_to_v3_fields_function
      type: MAPS_TO
      target: field_mapping_propertycontact_addressstreet
    - source: map_data_to_v3_fields_function
      type: MAPS_TO
      target: field_mapping_name
    - source: map_data_to_v3_fields_function
      type: MAPS_TO
      target: field_mapping_addressstreet
    - source: map_data_to_v3_fields_function
      type: MAPS_TO
      target: field_mapping_purposes
    - source: map_data_to_v3_fields_function
      type: MAPS_TO
      target: field_mapping_intendeduses
    - source: map_data_to_v3_fields_function
      type: MAPS_TO
      target: field_mapping_requestedvalues
    - source: map_data_to_v3_fields_function
      type: MAPS_TO
      target: field_mapping_propertyrights
    - source: map_data_to_v3_fields_function
      type: MAPS_TO
      target: field_mapping_reportformat
    - source: map_data_to_v3_fields_function
      type: MAPS_TO
      target: field_mapping_fee
    - source: map_data_to_v3_fields_function
      type: MAPS_TO
      target: field_mapping_retainer
    - source: map_data_to_v3_fields_function
      type: MAPS_TO
      target: field_mapping_paymentterms
    - source: map_data_to_v3_fields_function
      type: MAPS_TO
      target: field_mapping_scopes
    - source: map_data_to_v3_fields_function
      type: MAPS_TO
      target: field_mapping_duedate
    - source: map_data_to_v3_fields_function
      type: MAPS_TO
      target: field_mapping_jobnumber
    - source: map_data_to_v3_fields_function
      type: MAPS_TO
      target: field_mapping_notes
    - source: generate_loe_html_function
      type: USES
      target: generate_loe_html_job_param
    - source: generate_loe_html_function
      type: USES
      target: generate_loe_html_job_details_param
    - source: generate_and_send_loe_function
      type: USES
      target: generate_and_send_loe_job_param
    - source: generate_and_send_loe_function
      type: USES
      target: generate_and_send_loe_job_details_param
    - source: generate_and_send_loe_function
      type: USES
      target: generate_and_send_loe_html_template_param
    - source: send_loe_email_helper
      type: USES
      target: send_loe_email_client_email_param
    - source: send_loe_email_helper
      type: USES
      target: send_loe_email_client_name_param
    - source: send_loe_email_helper
      type: USES
      target: send_loe_email_signing_link_param
    - source: send_loe_email_helper
      type: USES
      target: send_loe_email_property_address_param
    - source: map_data_to_v3_fields_function
      type: USES
      target: map_data_to_v3_fields_job_param
    - source: map_data_to_v3_fields_function
      type: USES
      target: map_data_to_v3_fields_job_details_param
    - source: v3_template_constant
      type: CONTAINS
      target: docuseal_signature_field_tag
    - source: v3_template_constant
      type: CONTAINS
      target: docuseal_date_field_tag
    - source: docuseal_submission_created_event
      type: TRIGGERS
      target: update_clickup_loe_status_function
    - source: docuseal_submission_completed_event
      type: TRIGGERS
      target: update_clickup_loe_status_function
    - source: send_loe_email_index_ts
      type: USES
      target: resend_api_key_config

  cross_references:
    entities_also_in: []
    first_appearance: LOE-DOCUSEAL-ARCHITECTURE.md
    conflicts_with: []

  decisions:
    - id: custom_email_vs_docuseal_email
      decision: Use custom email via Resend instead of DocuSeal email service
      rationale: Better control over branding and messaging
      status: adopted
      adopted_at: "2026-01-20"
      supersedes: null
    - id: proxy_pattern_for_api_key
      decision: Use Supabase Edge Function proxy to protect DocuSeal API key
      rationale: API key never exposed to client-side code
      status: adopted
      adopted_at: "2026-01-20"
      supersedes: null
    - id: store_complete_html_in_loe_submissions
      decision: Store complete HTML document in loe_submissions table
      rationale: Enables document recreation without regenerating
      status: adopted
      adopted_at: "2026-01-20"
      supersedes: null

  prep_quality:
    pattern_accuracy: 95
    entity_coverage: 98
    relationship_validity: 96
    searchability: 92

  validation:
    status: approved
    validated_by: prep-agent
    validated_at: "2026-01-20_17-56-10Z"
    rejection_count: 0
    rejection_reasons: []

  prepared_at: "2026-01-20_17-56-10Z"
  prepared_by: "cursor-prep-agent"
---

# LOE DocuSeal eSignature Component - Architecture Documentation (Cognee Prepared)

## Summary

The LOE DocuSeal eSignature component generates professional Letter of Engagement documents from dashboard data, sends them to clients via DocuSeal's cloud API for electronic signature, and tracks signature completion through webhooks. The system uses a custom HTML template with 20 mapped fields that are dynamically injected into placeholders, then submitted to DocuSeal with embedded signature anchor tags. Custom emails are sent via Resend API (not DocuSeal's email service) to provide better control over branding and messaging. Upon signature completion, webhooks update database tables and ClickUp tasks automatically.

**Total Entities Extracted**: 211

## Key Entities (Typed)

### Systems
- **APR Dashboard v3** [SYSTEM] - Main application containing LOE feature
- **DocuSeal API** [EXTERNAL_SYSTEM] - Cloud e-signature service
- **Supabase** [EXTERNAL_SYSTEM] - Backend-as-a-Service (database + Edge Functions)
- **Resend API** [EXTERNAL_SYSTEM] - Email delivery service
- **ClickUp API** [EXTERNAL_SYSTEM] - Task management system

### Files (8)
- **generateLOE.ts** [FILE] - Core LOE generation logic with field mapping and DocuSeal submission
- **v3Template.ts** [FILE] - HTML template constant with DocuSeal anchor tags
- **LoeQuoteSection.tsx** [FILE] - React UI component for LOE quote section
- **LOEPreviewModal.tsx** [FILE] - React modal for previewing generated LOE HTML
- **docuseal-proxy/index.ts** [FILE] - Supabase Edge Function that proxies DocuSeal API calls
- **send-loe-email-fixed/index.ts** [FILE] - Supabase Edge Function that sends custom LOE emails via Resend
- **docuseal-webhook/index.ts** [FILE] - Supabase Edge Function that handles DocuSeal webhook events
- **job.ts** [FILE] - TypeScript type definitions

### Functions (8)
- **generateLOEHTML()** [FUNCTION] - Generates LOE HTML document from template and job data
- **generateAndSendLOE()** [FUNCTION] - Main orchestration function that generates and sends LOE
- **sendLOEEmail()** [FUNCTION] - Helper function that calls email Edge Function
- **mapDataToV3Fields()** [FUNCTION] - Maps job data to template field placeholders
- **loadV3Template()** [FUNCTION] - Loads V3_TEMPLATE constant
- **updateJobWithDocuSeal()** [FUNCTION] - Updates job with DocuSeal submission ID
- **validateRequiredFields()** [FUNCTION] - Validates required fields before LOE generation
- **updateClickUpLOEStatus()** [FUNCTION] - Updates ClickUp task with LOE status

### Database Tables (4)
- **job_submissions** [TABLE] - Main job record table
- **job_loe_details** [TABLE] - LOE-specific data and DocuSeal metadata table
- **loe_submissions** [TABLE] - Tracks DocuSeal submissions with HTML documents
- **job_files** [TABLE] - General file management system for jobs

### Database Columns (57 total)
- **job_submissions**: 15 columns
- **job_loe_details**: 23 columns
- **loe_submissions**: 10 columns
- **job_files**: 9 columns

### Field Mappings (20 total)
- **[date.created] placeholder** [CONCEPT] - Date created field mapping - Generated via new Date().toLocaleDateString()
- **[propertycontact.company] placeholder** [CONCEPT] - Client organization field mapping - From job.clientOrganization
- **[propertycontact.firstname] placeholder** [CONCEPT] - Client first name field mapping - From job.clientFirstName
- **[propertycontact.lastname] placeholder** [CONCEPT] - Client last name field mapping - From job.clientLastName
- **[propertycontact.title] placeholder** [CONCEPT] - Client title field mapping - From job.clientTitle
- **[propertycontact.addressstreet] placeholder** [CONCEPT] - Client address field mapping - From job.clientAddress
- **[name] placeholder** [CONCEPT] - Job number field mapping - From jobDetails.jobNumber
- **[addressstreet] placeholder** [CONCEPT] - Property address field mapping - From job.propertyAddress
- **[purposes] placeholder** [CONCEPT] - Intended use field mapping - From job.intendedUse
- **[intendeduses] placeholder** [CONCEPT] - Intended uses field mapping - From job.intendedUse (duplicate)
- **[requestedvalues] placeholder** [CONCEPT] - Valuation premises field mapping - From jobDetails.valuationPremises
- **[propertyrights] placeholder** [CONCEPT] - Property rights appraised field mapping - From jobDetails.propertyRightsAppraised
- **[reportformat] placeholder** [CONCEPT] - Report type field mapping - From jobDetails.reportType
- **[fee] placeholder** [CONCEPT] - Appraisal fee field mapping - From jobDetails.appraisalFee (currency formatted)
- **[retainer] placeholder** [CONCEPT] - Retainer amount field mapping - From jobDetails.retainerAmount (currency formatted)
- **[paymentterms] placeholder** [CONCEPT] - Payment terms field mapping - From jobDetails.paymentTerms
- **[scopes] placeholder** [CONCEPT] - Scope of work field mapping - From jobDetails.scopeOfWork
- **[duedate] placeholder** [CONCEPT] - Delivery date field mapping - From jobDetails.deliveryDate
- **[jobnumber] placeholder** [CONCEPT] - Job number field mapping - From jobDetails.jobNumber (duplicate)
- **[notes] placeholder** [CONCEPT] - Notes field mapping - From job.notes || jobDetails.specialInstructions

### Status Values (17 total)
- Job Statuses: 9 values
- Additional Job Submission Statuses: 3 values
- LOE Submission Statuses: 3 values
- Webhook Events: 2 values

### TypeScript Interface Properties (58 total)
- DetailJob: 3 properties
- JobSubmission: 26 properties
- JobDetails: 36 properties

### Function Parameters (11 total)
- generateLOEHTML: 2 parameters
- generateAndSendLOE: 3 parameters
- sendLOEEmail: 4 parameters
- mapDataToV3Fields: 2 parameters

### API Endpoints (4 total)
- **POST /submissions/html** [ENDPOINT] - DocuSeal API endpoint for HTML submission
- **/functions/v1/docuseal-proxy** [ENDPOINT] - Supabase Edge Function proxy endpoint
- **/functions/v1/send-loe-email-fixed** [ENDPOINT] - Supabase Edge Function email endpoint
- **/functions/v1/docuseal-webhook** [ENDPOINT] - Supabase Edge Function webhook endpoint

### Configuration Values (6 total)
- **V3_TEMPLATE** [CONFIG] - Complete HTML template string constant
- **DOCUSEAL_API_KEY** [CONFIG] - DocuSeal API key environment variable
- **RESEND_API_KEY** [CONFIG] - Resend API key environment variable
- **CORS headers configuration** [CONFIG] - CORS headers for Edge Function
- **Access-Control-Allow-Origin header** [CONFIG] - CORS header - Access-Control-Allow-Origin: *
- **Access-Control-Allow-Headers header** [CONFIG] - CORS header - Access-Control-Allow-Headers

## Entity Aliases

- **APR Dashboard v3**: APR-Dashboard, APR v3, the dashboard, APR Dashboard
- **DocuSeal**: DocuSeal API, DocuSeal service, e-signature provider
- **LOE**: Letter of Engagement, LOE document, engagement letter
- **generateLOE.ts**: generateLOE, LOE generator, LOE generation utility
- **V3_TEMPLATE**: template, HTML template, LOE template, v3 template
- **job_submissions**: jobs table, job records, submissions table
- **job_loe_details**: LOE details, LOE data, job LOE table
- **loe_submissions**: LOE submissions, submission tracking, LOE tracking

## Relationships (Typed)

### Function Call Relationships
- **LoeQuoteSection.tsx** --[CALLS]--> **generateLOEHTML()**
- **LoeQuoteSection.tsx** --[CALLS]--> **generateAndSendLOE()**
- **generateAndSendLOE()** --[CALLS]--> **generateLOEHTML()**
- **generateAndSendLOE()** --[CALLS]--> **sendLOEEmail()**
- **generateLOEHTML()** --[CALLS]--> **mapDataToV3Fields()**
- **generateLOEHTML()** --[CALLS]--> **loadV3Template()**

### API Call Relationships
- **generateAndSendLOE()** --[CALLS]--> **docuseal-proxy endpoint**
- **docuseal-proxy Edge Function** --[CALLS]--> **DocuSeal API /submissions/html**
- **sendLOEEmail()** --[CALLS]--> **send-loe-email-fixed endpoint**
- **send-loe-email-fixed Edge Function** --[CALLS]--> **Resend API**
- **docuseal-webhook Edge Function** --[CALLS]--> **ClickUp API**

### Data Storage Relationships
- **generateAndSendLOE()** --[STORES_IN]--> **loe_submissions table**
- **generateAndSendLOE()** --[STORES_IN]--> **job_loe_details table**
- **docuseal-webhook Edge Function** --[STORES_IN]--> **job_submissions table**
- **docuseal-webhook Edge Function** --[STORES_IN]--> **job_loe_details table**
- **docuseal-webhook Edge Function** --[STORES_IN]--> **loe_submissions table**
- **docuseal-webhook Edge Function** --[STORES_IN]--> **job_files table**

### Template Relationships
- **generateLOEHTML()** --[USES]--> **V3_TEMPLATE constant**
- **V3_TEMPLATE** --[CONTAINS]--> **signature-field anchor tag**
- **V3_TEMPLATE** --[CONTAINS]--> **date-field anchor tag**
- **mapDataToV3Fields()** --[MAPS_TO]--> **20 field mapping placeholders**

### Database Relationships
- **job_loe_details table** --[HAS_COLUMN]--> **23 columns**
- **job_submissions table** --[HAS_COLUMN]--> **15 columns**
- **loe_submissions table** --[HAS_COLUMN]--> **10 columns**
- **job_files table** --[HAS_COLUMN]--> **9 columns**

### Interface Property Relationships
- **DetailJob interface** --[CONTAINS]--> **3 properties**
- **JobSubmission interface** --[CONTAINS]--> **26 properties**
- **JobDetails interface** --[CONTAINS]--> **36 properties**

### Webhook Event Relationships
- **DocuSeal** --[TRIGGERS]--> **docuseal-webhook Edge Function**
- **submission.created event** --[TRIGGERS]--> **updateClickUpLOEStatus()**
- **submission.completed event** --[TRIGGERS]--> **updateClickUpLOEStatus()**

### Configuration Relationships
- **docuseal-proxy Edge Function** --[USES]--> **DOCUSEAL_API_KEY**
- **send-loe-email-fixed Edge Function** --[USES]--> **RESEND_API_KEY**

## Content

### 1. Executive Summary

The LOE DocuSeal eSignature component generates professional Letter of Engagement documents from dashboard data, sends them to clients via DocuSeal's cloud API for electronic signature, and tracks signature completion through webhooks. The system uses a custom HTML template with ~20 mapped fields that are dynamically injected into placeholders, then submitted to DocuSeal with embedded signature anchor tags. Custom emails are sent via Resend API (not DocuSeal's email service) to provide better control over branding and messaging. Upon signature completion, webhooks update database tables and ClickUp tasks automatically.

**Key Integration Points**:
- **DocuSeal**: Cloud API for e-signature processing (`https://api.docuseal.com`)
- **Supabase**: Edge Functions (proxy, email, webhook) + PostgreSQL database
- **Resend API**: Custom email delivery service
- **ClickUp API**: Task management and status updates

### 2. System Architecture

The system follows a multi-stage flow:

1. **User Initiation**: User clicks "Preview & Send LOE" in `LoeQuoteSection.tsx`
2. **HTML Generation**: `generateLOEHTML()` loads template, maps fields, replaces placeholders
3. **Preview**: HTML shown in `LOEPreviewModal.tsx` for user approval
4. **DocuSeal Submission**: `generateAndSendLOE()` sends HTML to DocuSeal via proxy
5. **Email Sending**: Custom email sent via Resend with signing link
6. **Database Storage**: Submission data stored in `loe_submissions` and `job_loe_details`
7. **Webhook Processing**: DocuSeal sends webhooks for status updates
8. **Status Updates**: Webhook handler updates database and ClickUp

### 3. Component Inventory

#### Core Generation Logic (`generateLOE.ts`)
- **Primary Responsibility**: Generates LOE HTML documents by mapping job data to template fields and orchestrates DocuSeal submission and email sending.
- **Exports**: `generateLOEHTML()`, `generateAndSendLOE()`, `sendLOEEmail()`
- **Dependencies**: `@/types/job`, `./v3Template`, `@/integrations/supabase/client`
- **Dependents**: `LoeQuoteSection.tsx`, `LOEPreviewModal.tsx`

#### HTML Template (`v3Template.ts`)
- **Primary Responsibility**: Stores the complete HTML template for LOE documents as a large string constant with embedded CSS, DocuSeal anchor tags, and placeholder fields.
- **Exports**: `V3_TEMPLATE` constant
- **Dependencies**: None (pure constant)
- **Dependents**: `generateLOE.ts`

#### UI Component (`LoeQuoteSection.tsx`)
- **Primary Responsibility**: React component that displays LOE quote section in dashboard, handles user interactions for generating and sending LOE documents.
- **Exports**: `LoeQuoteSection` component
- **Dependencies**: Shadcn UI components, LOE generation utilities, preview modal
- **Dependents**: Parent dashboard component

#### Edge Functions
- **docuseal-proxy**: Proxies requests to DocuSeal API to secure API keys
- **send-loe-email-fixed**: Sends custom LOE emails via Resend API
- **docuseal-webhook**: Handles DocuSeal webhook events and updates database/ClickUp

### 4. Data Flow

#### User Initiation
- Trigger: User clicks "Preview & Send LOE" button
- Validation: `validateRequiredFields()` checks required fields
- Flow: Button click → `handleGeneratePreview()` → `generateLOEHTML()` → Preview modal

#### HTML Generation
1. Load template: `loadV3Template()` returns `V3_TEMPLATE`
2. Map fields: `mapDataToV3Fields()` creates field mappings object
3. Replace placeholders: Global regex replacement for each field
4. Return HTML: Complete HTML string with all placeholders replaced

#### DocuSeal Submission
- Endpoint: `/functions/v1/docuseal-proxy?endpoint=submissions/html`
- Payload: `{ name, send_email: false, documents: [{ html, size: "Letter" }], submitters: [{ email, name, role: "First Party" }] }`
- Response: `{ id, slug, status, submitters: [{ slug }] }`
- Storage: Insert into `loe_submissions`, update `job_loe_details.docuseal_submission_id`

#### Email Sending
- Function: `send-loe-email-fixed` Edge Function
- Payload: `{ to, clientName, signingLink, propertyAddress }`
- Email Content: HTML email with greeting, signing button, instructions, footer
- Signing Link: `https://docuseal.com/s/${docusealSlug}`

#### Webhook Processing
- **submission.created**: Updates `job_loe_details.loe_sent_at`, updates ClickUp
- **submission.completed**: Updates `job_submissions.status` to `'loe_signed'`, stores `signed_document_url`, inserts into `job_files`, updates ClickUp

### 5. Database Schema

#### `job_submissions` Table
- **Purpose**: Main job record storing client/property information and overall job status
- **Key Columns**: `id` (UUID PK), `client_email`, `client_first_name`, `client_last_name`, `property_address`, `status` (enum), `clickup_task_id`
- **Status Values**: submitted, in_progress, loe_pending, loe_sent, loe_signed, contract_generated, paid, active, completed
- **Write Operations**: Created on form submission, updated by webhook on signature completion

#### `job_loe_details` Table
- **Purpose**: Stores LOE-specific data and DocuSeal integration metadata
- **Key Columns**: `id` (UUID PK), `job_id` (FK), `job_number`, `appraisal_fee`, `retainer_amount`, `docuseal_submission_id`, `signed_document_url`, `signed_at`, `loe_sent_at`
- **Foreign Keys**: `job_id` → `job_submissions.id` (CASCADE DELETE)
- **Write Operations**: Created when LOE details filled, updated by `generateAndSendLOE()` and webhooks

#### `loe_submissions` Table
- **Purpose**: Tracks each DocuSeal submission with complete HTML document for audit/re-send capability
- **Key Columns**: `id` (UUID PK), `job_id` (TEXT), `client_name`, `client_email`, `loe_html` (complete HTML), `docuseal_slug`, `docuseal_submission_id`, `status` (pending/signed/expired)
- **Status Values**: pending, signed, expired
- **Write Operations**: Created by `generateAndSendLOE()`, updated by webhook on completion

#### `job_files` Table
- **Purpose**: General file management system for jobs, including signed documents
- **Key Columns**: `id` (UUID PK), `job_id` (FK), `file_name`, `file_type`, `storage_path` (DocuSeal URL), `category` (signed_agreement), `is_client_visible`
- **Foreign Keys**: `job_id` → `job_submissions.id` (CASCADE DELETE)
- **Write Operations**: Inserted by webhook on `submission.completed` event

### 6. Field Mapping Reference

Complete enumeration of all 20 field mappings:

1. **[date.created]** → Generated via `new Date().toLocaleDateString()` → Example: "January 20, 2026"
2. **[propertycontact.company]** → `job.clientOrganization` → Fallback: 'Not Specified'
3. **[propertycontact.firstname]** → `job.clientFirstName` → Fallback: ''
4. **[propertycontact.lastname]** → `job.clientLastName` → Fallback: ''
5. **[propertycontact.title]** → `job.clientTitle` → Fallback: 'Not Specified'
6. **[propertycontact.addressstreet]** → `job.clientAddress` → Fallback: 'Not Specified'
7. **[name]** → `jobDetails.jobNumber` → Fallback: 'PENDING-' + timestamp
8. **[addressstreet]** → `job.propertyAddress` → Fallback: 'Property Address Not Specified'
9. **[purposes]** → `job.intendedUse` → Fallback: 'Not Specified'
10. **[intendeduses]** → `job.intendedUse` → Fallback: 'Not Specified' (duplicate)
11. **[requestedvalues]** → `jobDetails.valuationPremises` → Fallback: 'Market Value'
12. **[propertyrights]** → `jobDetails.propertyRightsAppraised` → Fallback: 'Fee Simple'
13. **[reportformat]** → `jobDetails.reportType` → Fallback: 'Full Narrative Report'
14. **[fee]** → `jobDetails.appraisalFee` (currency formatted) → Fallback: '$TBD'
15. **[scopes]** → `jobDetails.scopeOfWork` → Fallback: 'All Applicable'
16. **[duedate]** → `jobDetails.deliveryDate` → Fallback: '15 business days'
17. **[jobnumber]** → `jobDetails.jobNumber` → Fallback: 'PENDING-' + timestamp (duplicate)
18. **[paymentterms]** → `jobDetails.paymentTerms` → Fallback: 'Net 30 days'
19. **[retainer]** → `jobDetails.retainerAmount` (currency formatted) → Fallback: '$TBD'
20. **[notes]** → `job.notes || jobDetails.specialInstructions` → Fallback: '' (cascading)

**Field Replacement Logic**: All fields use global regex replacement with escaped placeholders. Multiple occurrences of same placeholder are replaced.

### 7. Template Structure Analysis

The `V3_TEMPLATE` is a complete HTML document (~3-4 pages when rendered):

#### Page 1: Header and Introduction
- Document header with logo, company address, date
- Subject line with dynamic fields: `[name]`, `[addressstreet]`
- Introduction paragraph with client contact fields

#### Page 1-2: Property Details Tables
- First table: Property identification, type, authorized client/users, authorized use, effective date, value type, property rights
- Second table: Report type, fee, scope of work, delivery date
- All table values are dynamic fields

#### Page 2-3: Signature Section
- Signature container with DocuSeal anchor tags:
  - `<signature-field role="First Party" required="true">`
  - `<date-field role="First Party" required="true">`
- Signed by field with client name and title

#### Page 3-4: Terms & Conditions
- Fully static legal text (hardcoded)
- Numbered list of terms and conditions

#### Page 4: Footer
- Company information (hardcoded)
- Contact information (hardcoded)

**Content Classification**:
- **Fully Static**: Company info, legal terms, CSS styling, signature field structure
- **Dynamic via Field Mapping**: All bracketed placeholders, property details table values, client name
- **Candidates for User-Editable**: Introduction paragraph, Terms & Conditions, footer company info, email template

### 8. DocuSeal Integration Deep Dive

#### API Authentication Flow
- **Pattern**: Proxy via Supabase Edge Function
- **Flow**: Client → Proxy (Supabase anon key) → DocuSeal API (X-Auth-Token header)
- **API Key Storage**: `DOCUSEAL_API_KEY` environment variable in Edge Function secrets
- **Benefits**: API key never exposed to client-side code

#### Submission Payload Structure
```typescript
{
  name: "LOE-VAL251999",
  send_email: false, // CRITICAL: We send our own email
  documents: [{
    name: "letter-of-engagement",
    html: "<!DOCTYPE html>...", // Complete HTML with anchor tags
    size: "Letter" // 8.5" x 11"
  }],
  submitters: [{
    email: "client@example.com",
    name: "John Smith",
    role: "First Party" // Must match anchor tag roles!
  }]
}
```

#### Webhook Payload Structure
- **submission.created**: `{ event_type, data: { id, status, email, created_at, submitters, metadata } }`
- **submission.completed**: Same as created plus `completed_at`, `documents: [{ url }]`

#### DocuSeal Anchor Tags
- **signature-field**: `<signature-field role="First Party" required="true">` → Interactive signature pad
- **date-field**: `<date-field role="First Party" required="true">` → Date picker
- **Role Matching**: Anchor tag `role` must match `submitters[].role` in payload

#### CORS Configuration
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

#### Error Handling Patterns
- **Proxy Errors**: Return detailed error messages to client
- **Webhook Errors**: Log but return 200 (don't fail webhook to prevent retries)
- **Email Errors**: Log but don't fail LOE creation (document more important than email)

#### Rate Limits
- **DocuSeal API**: Not documented in codebase (check DocuSeal docs)
- **Resend API**: Not documented in codebase (check Resend docs)
- **Supabase Edge Functions**: 60s timeout, 128MB memory, invocation limits by plan tier

### 9. Current Limitations & Tech Debt

#### Hardcoded Values
- **Template HTML**: Complete HTML hardcoded in `v3Template.ts` (requires code deployment to change)
- **Email Template**: HTML hardcoded in Edge Function (requires code deployment to change)
- **Company Information**: Company name, address, contact info hardcoded in template

#### TODOs
- **Payment Flow Integration**: TODO in webhook handler to trigger GHL integration after signature

#### Known Edge Cases
- **Invalid Email Handling**: Falls back to `noreply@valta.ca` if email invalid (no user notification)
- **Missing Job Lookup**: Webhook logs error but continues if job not found (no alerting)
- **Email Failure**: LOE still created if email fails (no retry mechanism)

#### Failure Modes
- **DocuSeal API Down**: No LOE creation, no fallback mechanism
- **Webhook Failure**: Status updates may be missed, no idempotent processing
- **Email Service Failure**: Client may not receive email, no retry queue
- **Database Connection Failure**: LOE may not be saved, no retry logic

### 10. Extension Points

#### User-Editable Boilerplate
- **Introduction Paragraph**: Currently partially dynamic, structure is static
- **Terms & Conditions Section**: Fully static, hardcoded legal text
- **Footer Company Information**: Fully static
- **Email Template**: Hardcoded in Edge Function

#### Template Versioning Schema
Proposed database schema:
- **loe_templates** table: `id`, `name`, `version`, `template_html`, `is_active`, `created_by`, `created_at`, `updated_at`
- **loe_template_sections** table: `id`, `template_id`, `section_name`, `section_html`, `is_editable`, `order_index`
- Update `loe_submissions` table: Add `template_id`, `template_version` columns

#### Preview/Edit UI Changes
- New component: `LOETemplateEditor.tsx` for editing template sections
- Update `LOEPreviewModal.tsx`: Add "Edit Template" button
- New API: `update-loe-template` Edge Function for saving template changes

#### Database Changes
- Migration 1: Create `loe_templates` and `loe_template_sections` tables
- Migration 2: Add `template_id` and `template_version` to `loe_submissions`
- Migration 3: Migrate existing data (insert current template as version 1)

## Patterns Identified

1. **Field Mapping Pattern**: Dynamic data injection into HTML templates using bracketed placeholders with global regex replacement
2. **Proxy Pattern**: Edge Function proxy protects API keys from client-side exposure
3. **Custom Email Pattern**: Use third-party email service (Resend) instead of DocuSeal email for better control
4. **Webhook Idempotency Pattern**: Return 200 even on errors to prevent retry loops
5. **Complete HTML Storage Pattern**: Store full HTML document in database for audit/re-send capability
6. **Two-Table Pattern**: Store data in both `job_submissions` (main) and `job_loe_details` (LOE-specific)
7. **Status Enum Pattern**: Use string enums for job status and LOE submission status
8. **Anchor Tag Pattern**: DocuSeal scans HTML for special anchor tags and converts to interactive fields

## Likely Queries

- "How does LOE generation work?" → See Section: Data Flow - HTML Generation
- "What fields are mapped in the template?" → See Section: Field Mapping Reference
- "How are DocuSeal anchor tags used?" → See Section: DocuSeal Integration Deep Dive - Anchor Tags
- "What happens when a client signs the LOE?" → See Section: Data Flow - Webhook Processing
- "Where is the signed PDF stored?" → See Section: Database Schema - job_files table
- "How does the email sending work?" → See Section: Data Flow - Email Sending
- "What database tables are involved?" → See Section: Database Schema
- "How are webhooks handled?" → See Section: DocuSeal Integration Deep Dive - Webhook Payload Structure
- "What are the current limitations?" → See Section: Current Limitations & Tech Debt
- "How can templates be made editable?" → See Section: Extension Points

## Timeline

- **2026-01-20**: Architecture documentation created
- **2026-01-20**: Cognee preparation completed with 211 entities extracted

## Keywords

loe, letter-of-engagement, docuseal, esignature, html-generation, field-mapping, template-injection, webhook-processing, email-sending, supabase-edge-functions, resend-api, clickup-integration, react-components, typescript, database-schema, job-submissions, loe-submissions, docuseal-proxy, custom-email, signature-anchor-tags, webhook-handler, status-tracking, document-signing, pdf-generation, template-versioning, user-editable-boilerplate, apr-dashboard, appraisal-workflow, client-onboarding