-- LOE Saved Documents: signed-copy support for job_contracts.
--
-- Adds the executed (signed) PDF URL so a contract row promoted to state='signed' can OPEN the
-- DocuSeal-hosted signed copy instead of the pre-send draft HTML. The DocuSeal webhook
-- (supabase/functions/docuseal-webhook/index.ts) already has signedDocument.url at completion and
-- writes the same URL onto job_loe_details + job_files; this column lets the per-contract row carry
-- it too, matched by docuseal_submission_id.
--
-- NOTE (durability, future item): the signed PDF lives at a DocuSeal-hosted URL — it is NOT copied
-- into a Supabase storage bucket. If those links ever expire, a bucket-download step would be needed.
--
-- state column: confirmed (2026-06-23) to have NO CHECK constraint — 'signed' is already accepted
-- as a plain text value, so no constraint alteration is required here.

ALTER TABLE public.job_contracts
  ADD COLUMN IF NOT EXISTS signed_document_url text;

COMMENT ON COLUMN public.job_contracts.signed_document_url IS
  'DocuSeal-hosted URL of the executed (signed) PDF; populated by the docuseal-webhook on submission.completed. Null until signed.';
