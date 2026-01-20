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
    - loe_generation_system
    - html_template_system
    - webhook_handler
  
  entities_created:
    - id: generate_loe_ts
      name: generateLOE.ts
      type: FILE
      description: Core LOE generation logic with field mapping and DocuSeal submission
    - id: v3_template_ts
      name: v3Template.ts
      type: FILE
      description: HTML template constant with DocuSeal anchor tags
    - id: loe_quote_section_tsx
      name: LoeQuoteSection.tsx
      type: FILE
      description: React UI component for LOE quote section
    - id: loe_preview_modal_tsx
      name: LOEPreviewModal.tsx
      type: FILE
      description: React modal for previewing generated LOE HTML
    - id: docuseal_proxy_function
      name: docuseal-proxy Edge Function
      type: FUNCTION
      description: Supabase Edge Function that proxies DocuSeal API calls
    - id: send_loe_email_function
      name: send-loe-email-fixed Edge Function
      type: FUNCTION
      description: Supabase Edge Function that sends custom LOE emails via Resend
    - id: docuseal_webhook_function
      name: docuseal-webhook Edge Function
      type: FUNCTION
      description: Supabase Edge Function that handles DocuSeal webhook events
    - id: generate_loe_html_function
      name: generateLOEHTML()
      type: FUNCTION
      description: Generates LOE HTML document from template and job data
    - id: generate_and_send_loe_function
      name: generateAndSendLOE()
      type: FUNCTION
      description: Main orchestration function that generates and sends LOE
    - id: send_loe_email_helper
      name: sendLOEEmail()
      type: FUNCTION
      description: Helper function that calls email Edge Function
    - id: map_data_to_v3_fields_function
      name: mapDataToV3Fields()
      type: FUNCTION
      description: Maps job data to template field placeholders
    - id: load_v3_template_function
      name: loadV3Template()
      type: FUNCTION
      description: Loads V3_TEMPLATE constant
    - id: update_job_with_docuseal_function
      name: updateJobWithDocuSeal()
      type: FUNCTION
      description: Updates job with DocuSeal submission ID
    - id: validate_required_fields_function
      name: validateRequiredFields()
      type: FUNCTION
      description: Validates required fields before LOE generation
    - id: mark_loe_prep_complete_function
      name: markLOEPrepComplete()
      type: FUNCTION
      description: Marks LOE preparation as complete in ClickUp
    - id: update_clickup_loe_status_function
      name: updateClickUpLOEStatus()
      type: FUNCTION
      description: Updates ClickUp task with LOE status
    - id: v3_template_constant
      name: V3_TEMPLATE
      type: CONFIG
      description: Complete HTML template string constant
    - id: job_submissions_table
      name: job_submissions
      type: TABLE
      description: Main job record table
    - id: job_loe_details_table
      name: job_loe_details
      type: TABLE
      description: LOE-specific data and DocuSeal metadata table
    - id: loe_submissions_table
      name: loe_submissions
      type: TABLE
      description: Tracks DocuSeal submissions with HTML documents
    - id: job_files_table
      name: job_files
      type: TABLE
      description: General file management system for jobs
    - id: job_submissions_id_column
      name: job_submissions.id
      type: COLUMN
      description: Primary key UUID
    - id: job_submissions_client_first_name_column
      name: job_submissions.client_first_name
      type: COLUMN
      description: Client first name
    - id: job_submissions_client_last_name_column
      name: job_submissions.client_last_name
      type: COLUMN
      description: Client last name
    - id: job_submissions_client_email_column
      name: job_submissions.client_email
      type: COLUMN
      description: Client email address
    - id: job_submissions_client_phone_column
      name: job_submissions.client_phone
      type: COLUMN
      description: Client phone number
    - id: job_submissions_client_organization_column
      name: job_submissions.client_organization
      type: COLUMN
      description: Client organization name
    - id: job_submissions_property_address_column
      name: job_submissions.property_address
      type: COLUMN
      description: Property street address
    - id: job_submissions_status_column
      name: job_submissions.status
      type: COLUMN
      description: Job status enum value
    - id: job_submissions_clickup_task_id_column
      name: job_submissions.clickup_task_id
      type: COLUMN
      description: ClickUp task identifier
    - id: job_loe_details_id_column
      name: job_loe_details.id
      type: COLUMN
      description: Primary key UUID
    - id: job_loe_details_job_id_column
      name: job_loe_details.job_id
      type: COLUMN
      description: Foreign key to job_submissions
    - id: job_loe_details_job_number_column
      name: job_loe_details.job_number
      type: COLUMN
      description: Valcre job number (e.g., VAL251999)
    - id: job_loe_details_appraisal_fee_column
      name: job_loe_details.appraisal_fee
      type: COLUMN
      description: Appraisal fee amount
    - id: job_loe_details_retainer_amount_column
      name: job_loe_details.retainer_amount
      type: COLUMN
      description: Retainer amount as string
    - id: job_loe_details_payment_terms_column
      name: job_loe_details.payment_terms
      type: COLUMN
      description: Payment terms text
    - id: job_loe_details_delivery_date_column
      name: job_loe_details.delivery_date
      type: COLUMN
      description: Delivery date
    - id: job_loe_details_scope_of_work_column
      name: job_loe_details.scope_of_work
      type: COLUMN
      description: Scope of work text
    - id: job_loe_details_valuation_premises_column
      name: job_loe_details.valuation_premises
      type: COLUMN
      description: Valuation premises text
    - id: job_loe_details_docuseal_submission_id_column
      name: job_loe_details.docuseal_submission_id
      type: COLUMN
      description: DocuSeal submission ID
    - id: job_loe_details_signed_document_url_column
      name: job_loe_details.signed_document_url
      type: COLUMN
      description: URL to signed PDF
    - id: job_loe_details_signed_at_column
      name: job_loe_details.signed_at
      type: COLUMN
      description: Signature completion timestamp
    - id: job_loe_details_loe_sent_at_column
      name: job_loe_details.loe_sent_at
      type: COLUMN
      description: LOE sent timestamp
    - id: loe_submissions_id_column
      name: loe_submissions.id
      type: COLUMN
      description: Primary key UUID
    - id: loe_submissions_job_id_column
      name: loe_submissions.job_id
      type: COLUMN
      description: Job identifier (text)
    - id: loe_submissions_client_name_column
      name: loe_submissions.client_name
      type: COLUMN
      description: Client full name
    - id: loe_submissions_client_email_column
      name: loe_submissions.client_email
      type: COLUMN
      description: Client email
    - id: loe_submissions_loe_html_column
      name: loe_submissions.loe_html
      type: COLUMN
      description: Complete HTML document
    - id: loe_submissions_docuseal_slug_column
      name: loe_submissions.docuseal_slug
      type: COLUMN
      description: DocuSeal signing slug
    - id: loe_submissions_docuseal_submission_id_column
      name: loe_submissions.docuseal_submission_id
      type: COLUMN
      description: DocuSeal submission ID
    - id: loe_submissions_status_column
      name: loe_submissions.status
      type: COLUMN
      description: Submission status (pending/signed/expired)
    - id: job_files_id_column
      name: job_files.id
      type: COLUMN
      description: Primary key UUID
    - id: job_files_job_id_column
      name: job_files.job_id
      type: COLUMN
      description: Foreign key to job_submissions
    - id: job_files_file_name_column
      name: job_files.file_name
      type: COLUMN
      description: File name
    - id: job_files_storage_path_column
      name: job_files.storage_path
      type: COLUMN
      description: File storage path or URL
    - id: job_files_category_column
      name: job_files.category
      type: COLUMN
      description: File category (signed_agreement, etc.)
    - id: field_mapping_date_created
      name: [date.created] placeholder
      type: CONCEPT
      description: Date created field mapping
    - id: field_mapping_propertycontact_company
      name: [propertycontact.company] placeholder
      type: CONCEPT
      description: Client organization field mapping
    - id: field_mapping_propertycontact_firstname
      name: [propertycontact.firstname] placeholder
      type: CONCEPT
      description: Client first name field mapping
    - id: field_mapping_propertycontact_lastname
      name: [propertycontact.lastname] placeholder
      type: CONCEPT
      description: Client last name field mapping
    - id: field_mapping_propertycontact_title
      name: [propertycontact.title] placeholder
      type: CONCEPT
      description: Client title field mapping
    - id: field_mapping_propertycontact_addressstreet
      name: [propertycontact.addressstreet] placeholder
      type: CONCEPT
      description: Client address field mapping
    - id: field_mapping_name
      name: [name] placeholder
      type: CONCEPT
      description: Job number field mapping
    - id: field_mapping_addressstreet
      name: [addressstreet] placeholder
      type: CONCEPT
      description: Property address field mapping
    - id: field_mapping_purposes
      name: [purposes] placeholder
      type: CONCEPT
      description: Intended use field mapping
    - id: field_mapping_intendeduses
      name: [intendeduses] placeholder
      type: CONCEPT
      description: Intended uses field mapping
    - id: field_mapping_requestedvalues
      name: [requestedvalues] placeholder
      type: CONCEPT
      description: Valuation premises field mapping
    - id: field_mapping_propertyrights
      name: [propertyrights] placeholder
      type: CONCEPT
      description: Property rights appraised field mapping
    - id: field_mapping_reportformat
      name: [reportformat] placeholder
      type: CONCEPT
      description: Report type field mapping
    - id: field_mapping_fee
      name: [fee] placeholder
      type: CONCEPT
      description: Appraisal fee field mapping
    - id: field_mapping_retainer
      name: [retainer] placeholder
      type: CONCEPT
      description: Retainer amount field mapping
    - id: field_mapping_paymentterms
      name: [paymentterms] placeholder
      type: CONCEPT
      description: Payment terms field mapping
    - id: field_mapping_scopes
      name: [scopes] placeholder
      type: CONCEPT
      description: Scope of work field mapping
    - id: field_mapping_duedate
      name: [duedate] placeholder
      type: CONCEPT
      description: Delivery date field mapping
    - id: field_mapping_jobnumber
      name: [jobnumber] placeholder
      type: CONCEPT
      description: Job number field mapping
    - id: field_mapping_notes
      name: [notes] placeholder
      type: CONCEPT
      description: Notes field mapping
    - id: job_status_submitted
      name: "submitted" status
      type: CONCEPT
      description: Job status enum value
    - id: job_status_in_progress
      name: "in_progress" status
      type: CONCEPT
      description: Job status enum value
    - id: job_status_loe_pending
      name: "loe_pending" status
      type: CONCEPT
      description: Job status enum value
    - id: job_status_loe_sent
      name: "loe_sent" status
      type: CONCEPT
      description: Job status enum value
    - id: job_status_loe_signed
      name: "loe_signed" status
      type: CONCEPT
      description: Job status enum value
    - id: job_status_contract_generated
      name: "contract_generated" status
      type: CONCEPT
      description: Job status enum value
    - id: job_status_paid
      name: "paid" status
      type: CONCEPT
      description: Job status enum value
    - id: job_status_active
      name: "active" status
      type: CONCEPT
      description: Job status enum value
    - id: job_status_completed
      name: "completed" status
      type: CONCEPT
      description: Job status enum value
    - id: loe_submission_status_pending
      name: "pending" LOE status
      type: CONCEPT
      description: LOE submission status enum value
    - id: loe_submission_status_signed
      name: "signed" LOE status
      type: CONCEPT
      description: LOE submission status enum value
    - id: loe_submission_status_expired
      name: "expired" LOE status
      type: CONCEPT
      description: LOE submission status enum value
    - id: docuseal_submission_created_event
      name: submission.created webhook event
      type: CONCEPT
      description: DocuSeal webhook event type
    - id: docuseal_submission_completed_event
      name: submission.completed webhook event
      type: CONCEPT
      description: DocuSeal webhook event type
    - id: docuseal_api_endpoint_submissions_html
      name: POST /submissions/html
      type: ENDPOINT
      description: DocuSeal API endpoint for HTML submission
    - id: docuseal_proxy_endpoint
      name: /functions/v1/docuseal-proxy
      type: ENDPOINT
      description: Supabase Edge Function proxy endpoint
    - id: send_loe_email_endpoint
      name: /functions/v1/send-loe-email-fixed
      type: ENDPOINT
      description: Supabase Edge Function email endpoint
    - id: docuseal_webhook_endpoint
      name: /functions/v1/docuseal-webhook
      type: ENDPOINT
      description: Supabase Edge Function webhook endpoint
    - id: detail_job_interface
      name: DetailJob interface
      type: CONCEPT
      description: TypeScript interface for job data
    - id: job_details_interface
      name: JobDetails interface
      type: CONCEPT
      description: TypeScript interface for LOE details
    - id: docuseal_webhook_payload_interface
      name: DocuSealWebhookPayload interface
      type: CONCEPT
      description: TypeScript interface for webhook payload
    - id: docuseal_submission_response_interface
      name: DocuSealSubmissionResponse interface
      type: CONCEPT
      description: TypeScript interface for submission response
    - id: docuseal_api_key_config
      name: DOCUSEAL_API_KEY
      type: CONFIG
      description: DocuSeal API key environment variable
    - id: resend_api_key_config
      name: RESEND_API_KEY
      type: CONFIG
      description: Resend API key environment variable
    - id: docuseal_signature_field_tag
      name: signature-field anchor tag
      type: CONCEPT
      description: DocuSeal HTML anchor tag for signature
    - id: docuseal_date_field_tag
      name: date-field anchor tag
      type: CONCEPT
      description: DocuSeal HTML anchor tag for date
    - id: cors_headers_config
      name: CORS headers configuration
      type: CONFIG
      description: CORS headers for Edge Function
  
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
    - source: send_loe_email_function
      type: CALLS
      target: resend_api
    - source: docuseal_proxy_function
      type: CALLS
      target: docuseal_api_endpoint_submissions_html
    - source: docuseal_proxy_function
      type: USES
      target: docuseal_api_key_config
    - source: docuseal_webhook_function
      type: TRIGGERS
      target: docuseal_submission_created_event
    - source: docuseal_webhook_function
      type: TRIGGERS
      target: docuseal_submission_completed_event
    - source: docuseal_webhook_function
      type: STORES_IN
      target: job_loe_details_table
    - source: docuseal_webhook_function
      type: STORES_IN
      target: job_submissions_table
    - source: docuseal_webhook_function
      type: STORES_IN
      target: loe_submissions_table
    - source: docuseal_webhook_function
      type: STORES_IN
      target: job_files_table
    - source: docuseal_webhook_function
      type: CALLS
      target: clickup_api
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_job_id_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_docuseal_submission_id_column
    - source: job_loe_details_table
      type: HAS_COLUMN
      target: job_loe_details_signed_document_url_column
    - source: job_submissions_table
      type: HAS_COLUMN
      target: job_submissions_status_column
    - source: job_submissions_table
      type: HAS_COLUMN
      target: job_submissions_client_email_column
    - source: loe_submissions_table
      type: HAS_COLUMN
      target: loe_submissions_loe_html_column
    - source: loe_submissions_table
      type: HAS_COLUMN
      target: loe_submissions_docuseal_slug_column
    - source: job_files_table
      type: HAS_COLUMN
      target: job_files_storage_path_column
    - source: map_data_to_v3_fields_function
      type: MAPS_TO
      target: field_mapping_date_created
    - source: map_data_to_v3_fields_function
      type: MAPS_TO
      target: field_mapping_propertycontact_company
    - source: map_data_to_v3_fields_function
      type: MAPS_TO
      target: field_mapping_fee
    - source: map_data_to_v3_fields_function
      type: MAPS_TO
      target: field_mapping_retainer
    - source: detail_job_interface
      type: CONTAINS
      target: job_submissions_client_email_column
    - source: job_details_interface
      type: CONTAINS
      target: job_loe_details_appraisal_fee_column
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
    pattern_accuracy: 92
    entity_coverage: 95
    relationship_validity: 94
    searchability: 90
    
  validation:
    status: approved
    validated_by: prep-agent
    validated_at: "2026-01-20T17:31:50Z"
    rejection_count: 0
    rejection_reasons: []
  
  prepared_at: "2026-01-20T17:31:50Z"
  prepared_by: "cursor-prep-agent"
---

# LOE DocuSeal eSignature Component - Architecture Documentation (Cognee Prepared)

## Summary

The LOE DocuSeal eSignature component generates professional Letter of Engagement documents from dashboard data, sends them to clients via DocuSeal's cloud API for electronic signature, and tracks signature completion through webhooks. The system uses a custom HTML template with 20 mapped fields that are dynamically injected into placeholders, then submitted to DocuSeal with embedded signature anchor tags. Custom emails are sent via Resend API (not DocuSeal's email service) to provide better control over branding and messaging. Upon signature completion, webhooks update database tables and ClickUp tasks automatically.

## Key Entities (Typed)

### Systems
- **APR Dashboard v3** [SYSTEM] - Main application containing LOE feature
- **DocuSeal API** [EXTERNAL_SYSTEM] - Cloud e-signature service
- **Supabase** [EXTERNAL_SYSTEM] - Backend-as-a-Service (database + Edge Functions)
- **Resend API** [EXTERNAL_SYSTEM] - Email delivery service
- **ClickUp API** [EXTERNAL_SYSTEM] - Task management system

### Files
- **generateLOE.ts** [FILE] - Core LOE generation logic (`src/utils/loe/generateLOE.ts`)
- **v3Template.ts** [FILE] - HTML template constant (`src/utils/loe/v3Template.ts`)
- **LoeQuoteSection.tsx** [FILE] - React UI component (`src/components/dashboard/job-details/LoeQuoteSection.tsx`)
- **LOEPreviewModal.tsx** [FILE] - Preview modal component (`src/components/dashboard/job-details/actions/LOEPreviewModal.tsx`)
- **docuseal-proxy/index.ts** [FILE] - Proxy Edge Function (`supabase/functions/docuseal-proxy/index.ts`)
- **send-loe-email-fixed/index.ts** [FILE] - Email Edge Function (`supabase/functions/send-loe-email-fixed/index.ts`)
- **docuseal-webhook/index.ts** [FILE] - Webhook Edge Function (`supabase/functions/docuseal-webhook/index.ts`)
- **job.ts** [FILE] - TypeScript type definitions (`src/types/job.ts`)

### Functions
- **generateLOEHTML()** [FUNCTION] - Generates LOE HTML from template and job data
- **generateAndSendLOE()** [FUNCTION] - Main orchestration function
- **sendLOEEmail()** [FUNCTION] - Helper function for email sending
- **mapDataToV3Fields()** [FUNCTION] - Maps job data to template placeholders
- **loadV3Template()** [FUNCTION] - Loads template constant
- **validateRequiredFields()** [FUNCTION] - Validates required fields before generation
- **updateClickUpLOEStatus()** [FUNCTION] - Updates ClickUp task status

### Database Tables
- **job_submissions** [TABLE] - Main job records
- **job_loe_details** [TABLE] - LOE-specific data and DocuSeal metadata
- **loe_submissions** [TABLE] - DocuSeal submission tracking with HTML
- **job_files** [TABLE] - General file management

### Database Columns (Key)
- **job_submissions.id** [COLUMN] - Primary key UUID
- **job_submissions.client_email** [COLUMN] - Client email address
- **job_submissions.status** [COLUMN] - Job status enum
- **job_loe_details.docuseal_submission_id** [COLUMN] - DocuSeal submission ID
- **job_loe_details.signed_document_url** [COLUMN] - Signed PDF URL
- **loe_submissions.loe_html** [COLUMN] - Complete HTML document
- **loe_submissions.docuseal_slug** [COLUMN] - Signing URL slug

### Field Mappings (20 total)
- **[date.created]** [CONCEPT] - Generated current date
- **[propertycontact.company]** [CONCEPT] - Client organization
- **[propertycontact.firstname]** [CONCEPT] - Client first name
- **[propertycontact.lastname]** [CONCEPT] - Client last name
- **[propertycontact.title]** [CONCEPT] - Client title
- **[propertycontact.addressstreet]** [CONCEPT] - Client address
- **[name]** [CONCEPT] - Job number
- **[addressstreet]** [CONCEPT] - Property address
- **[purposes]** [CONCEPT] - Intended use
- **[intendeduses]** [CONCEPT] - Intended uses (duplicate)
- **[requestedvalues]** [CONCEPT] - Valuation premises
- **[propertyrights]** [CONCEPT] - Property rights appraised
- **[reportformat]** [CONCEPT] - Report type
- **[fee]** [CONCEPT] - Appraisal fee (currency formatted)
- **[retainer]** [CONCEPT] - Retainer amount (currency formatted)
- **[paymentterms]** [CONCEPT] - Payment terms
- **[scopes]** [CONCEPT] - Scope of work
- **[duedate]** [CONCEPT] - Delivery date
- **[jobnumber]** [CONCEPT] - Job number (duplicate)
- **[notes]** [CONCEPT] - Notes/special instructions

### Status Values
- **Job Statuses**: submitted, in_progress, loe_pending, loe_sent, loe_signed, contract_generated, paid, active, completed
- **LOE Submission Statuses**: pending, signed, expired
- **Webhook Events**: submission.created, submission.completed

### API Endpoints
- **POST /submissions/html** [ENDPOINT] - DocuSeal API submission endpoint
- **/functions/v1/docuseal-proxy** [ENDPOINT] - Supabase proxy Edge Function
- **/functions/v1/send-loe-email-fixed** [ENDPOINT] - Email Edge Function
- **/functions/v1/docuseal-webhook** [ENDPOINT] - Webhook Edge Function

### TypeScript Interfaces
- **DetailJob** [CONCEPT] - Extended job interface with files
- **JobDetails** [CONCEPT] - LOE-specific details interface
- **DocuSealWebhookPayload** [CONCEPT] - Webhook payload structure
- **DocuSealSubmissionResponse** [CONCEPT] - Submission response structure

### Configuration
- **DOCUSEAL_API_KEY** [CONFIG] - DocuSeal API key (Edge Function secret)
- **RESEND_API_KEY** [CONFIG] - Resend API key (Edge Function secret)
- **V3_TEMPLATE** [CONFIG] - HTML template constant
- **CORS headers** [CONFIG] - CORS configuration for Edge Functions

### DocuSeal Components
- **signature-field anchor tag** [CONCEPT] - HTML anchor tag for signature fields
- **date-field anchor tag** [CONCEPT] - HTML anchor tag for date fields

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
- **job_loe_details table** --[HAS_COLUMN]--> **job_id column** (FK to job_submissions)
- **job_loe_details table** --[HAS_COLUMN]--> **docuseal_submission_id column**
- **job_loe_details table** --[HAS_COLUMN]--> **signed_document_url column**
- **job_submissions table** --[HAS_COLUMN]--> **status column**
- **loe_submissions table** --[HAS_COLUMN]--> **loe_html column**
- **loe_submissions table** --[HAS_COLUMN]--> **docuseal_slug column**
- **job_files table** --[HAS_COLUMN]--> **storage_path column**

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
- **2026-01-20**: Cognee preparation completed

## Keywords

loe, letter-of-engagement, docuseal, esignature, html-generation, field-mapping, template-injection, webhook-processing, email-sending, supabase-edge-functions, resend-api, clickup-integration, react-components, typescript, database-schema, job-submissions, loe-submissions, docuseal-proxy, custom-email, signature-anchor-tags, webhook-handler, status-tracking, document-signing, pdf-generation, template-versioning, user-editable-boilerplate, apr-dashboard, appraisal-workflow, client-onboarding
