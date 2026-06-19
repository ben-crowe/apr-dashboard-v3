-- Add loe_sent_at column to job_loe_details.
-- ROOT-CAUSE FIX: docuseal-webhook/index.ts already writes `.update({ loe_sent_at })` on the LOE
-- "sent" event, but the column never existed — so the write silently errored (webhook logs it,
-- does not throw) and the timestamp was lost. The ClickUp mirror now carries an "LOE Sent" field,
-- so this date is live-relevant. Adding the column makes the existing webhook write land and lets
-- the ClickUp resolver (clickup-fields.ts → hubValueMap reads loe.loe_sent_at) populate "LOE Sent".

ALTER TABLE public.job_loe_details
ADD COLUMN IF NOT EXISTS loe_sent_at TIMESTAMP;

COMMENT ON COLUMN public.job_loe_details.loe_sent_at IS 'Timestamp when the LOE was sent for signature (stamped by docuseal-webhook on the submission "sent" event)';
