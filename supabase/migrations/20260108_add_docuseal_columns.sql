-- Add DocuSeal integration columns to job_loe_details table
-- These columns are needed to track e-signature submissions and signed documents

ALTER TABLE public.job_loe_details 
ADD COLUMN IF NOT EXISTS docuseal_submission_id VARCHAR,
ADD COLUMN IF NOT EXISTS signed_document_url VARCHAR,
ADD COLUMN IF NOT EXISTS signed_at TIMESTAMP;

-- Add index for quick lookups by DocuSeal submission ID
CREATE INDEX IF NOT EXISTS idx_job_loe_details_docuseal_submission_id 
ON public.job_loe_details(docuseal_submission_id);

-- Add comments to explain the purpose of these columns
COMMENT ON COLUMN public.job_loe_details.docuseal_submission_id IS 'DocuSeal submission ID used to track e-signature documents';
COMMENT ON COLUMN public.job_loe_details.signed_document_url IS 'URL to the signed LOE document from DocuSeal';
COMMENT ON COLUMN public.job_loe_details.signed_at IS 'Timestamp when the LOE was signed by the client';
