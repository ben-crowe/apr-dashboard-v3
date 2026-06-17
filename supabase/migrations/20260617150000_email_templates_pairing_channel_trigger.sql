-- PRD-APR-LOE-03 Wave A (T1): email templates as a typed library — optional document
-- pairing + channel + trigger. Additive only; safe defaults keep the existing single
-- default row valid. job_email_instances already exists (20260614120000) — NOT recreated.

ALTER TABLE email_templates
  ADD COLUMN IF NOT EXISTS paired_template_id UUID NULL,            -- → loe_templates.id (the default email for that document)
  ADD COLUMN IF NOT EXISTS channel TEXT NOT NULL DEFAULT 'email',   -- 'email' | 'popup'
  ADD COLUMN IF NOT EXISTS "trigger" TEXT NOT NULL DEFAULT 'manual'; -- 'manual' | 'after_sign'

-- ⚑ Guardrail 3 (PRD-APR-LOE-03, from QA spec-gate): pairing is DETERMINISTIC — a document
-- template pairs to AT MOST one email. The plan's plain index would allow two emails to
-- claim one doc (nondeterministic first-match). A PARTIAL-UNIQUE index enforces 1↔1 while
-- leaving unpaired rows (paired_template_id IS NULL) unconstrained (many may stay null).
CREATE UNIQUE INDEX IF NOT EXISTS uq_email_templates_paired
  ON email_templates (paired_template_id) WHERE paired_template_id IS NOT NULL;

-- ⚑ KR2 first-class proof (PRD-APR-LOE-03): an email can be sent with NO document.
-- job_email_instances.contract_id is already NULLABLE (20260614120000) — document-less
-- sends write contract_id=null. Re-document the intent (the original comment said
-- "email is always step two"; first-class means it no longer is).
COMMENT ON COLUMN job_email_instances.contract_id IS
  'The document this email accompanies, OR NULL for a first-class document-less send (PRD-APR-LOE-03 KR2).';

-- ⚑ Guardrail 1 (PRD-APR-LOE-03): RLS stays OFF here to match the LOE sibling tables +
-- the anon-runtime app (20260614130000). Do NOT re-enable in this migration.
-- TODO(pre-cutover): re-enable RLS on email_templates + job_email_instances with anon-safe
-- policies before any real client traffic. Tracked as a PRD out-of-scope prerequisite.

-- Guardrail 4 (send-failure state) is already satisfied: job_email_instances.state
-- ('draft' | 'sent') lets the handler persist 'sent' ONLY on success; a failure leaves
-- the row in 'draft' (unsent). No schema change needed here.
