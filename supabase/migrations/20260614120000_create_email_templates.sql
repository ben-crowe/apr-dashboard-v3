-- Editable LOE send-email: managed DEFAULT template + per-send job-scoped INSTANCES.
-- Two separate objects so that editing one send never changes the managed default.
-- See src/utils/loe/emailTemplate.ts and docs/Features/12-LOE-Esign/PRD-multi-document-creator.md
-- ("Email template" Key Result).

-- ── Managed default (settings-scoped, one source of truth) ───────────────────────────
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- At most one default row.
CREATE UNIQUE INDEX IF NOT EXISTS uq_email_templates_one_default
  ON email_templates (is_default) WHERE is_default = true;

ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- The default email is a low-stakes team-managed cover note (NOT gated like the legal
-- contract template) — any authenticated user can read + manage it.
DROP POLICY IF EXISTS "email_templates auth all" ON email_templates;
CREATE POLICY "email_templates auth all"
  ON email_templates FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── Per-send instance (job-scoped, mirrors job_contracts) ────────────────────────────
CREATE TABLE IF NOT EXISTS job_email_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL,
  contract_id UUID,                        -- the document this email accompanies (email is always step two)
  recipient_email TEXT,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'draft',     -- 'draft' | 'sent'
  docuseal_submission_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_email_instances_job ON job_email_instances (job_id);

ALTER TABLE job_email_instances ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "job_email_instances auth all" ON job_email_instances;
CREATE POLICY "job_email_instances auth all"
  ON job_email_instances FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── Seed the managed default from the verbatim current email ──────────────────────────
-- Subject + body are the exact snapshot of send-loe-email-fixed at build time (2026-06-14),
-- kept in sync with src/utils/loe/emailTemplate.ts (EMAIL_SEED_SUBJECT / EMAIL_SEED_BODY).
INSERT INTO email_templates (name, subject, body_html, is_default)
SELECT
  'Default LOE Email',
  'Letter of Engagement - Ready for Signature',
  '<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; color: #333;">
<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
<p>Hi {{first_name}},</p>
<p>Your Letter of Engagement for the property appraisal at {{property_address}} is ready for your review and signature.</p>
<p><a href="{{signing_link}}" style="background-color: #1a73e8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Review &amp; Sign Document</a></p>
<p>What happens next:</p>
<ul>
<li>Review the Letter of Engagement carefully</li>
<li>Sign the document electronically</li>
<li>You''ll receive a copy for your records</li>
<li>We''ll begin work on your appraisal immediately</li>
</ul>
<p>If you have any questions, please don''t hesitate to contact us.</p>
<p>Best regards,</p>
<p><strong>Client Services Team</strong><br>
Valta Property Valuations Ltd.<br>
#300-4838 Richard Road SW, Calgary, AB T3E 6L1<br>
office: 587-801-5151 | email: clientcare@valta.ca | web: www.valta.ca</p>
</div>
</body>
</html>',
  true
WHERE NOT EXISTS (SELECT 1 FROM email_templates WHERE is_default = true);
