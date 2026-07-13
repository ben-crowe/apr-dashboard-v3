-- Popup templates — the THIRD managed component type beside Document + Email.
-- Mirrors email_templates (SPEC-APR-LOE-popup-editor INV-2), with ONE difference:
-- popups resolve by `is_active` (exactly one active) rather than `is_default`.
--
-- The active popup is what the post-sign Thank-You screen renders (SigningPage, INV-0).
--
-- RLS is DISABLED from creation ON PURPOSE. The APR app runs ANON (no ProtectedRoute
-- on /dashboard; getSession is empty), and every sibling LOE table (loe_submissions,
-- job_contracts, email_templates) has RLS OFF. An enabled-RLS table with an
-- authenticated-only policy would SILENTLY reject the anon insert (42501) and the row
-- would never persist — the exact bug QA caught on email_templates 2026-06-14. Logged
-- debt: re-enable with anon-safe policies pre-cutover (tracked with the email tables).

CREATE TABLE IF NOT EXISTS popup_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  body_html TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- At most one active popup (INV-3 — exactly one active resolves deterministically).
CREATE UNIQUE INDEX IF NOT EXISTS uq_popup_templates_one_active
  ON popup_templates (is_active) WHERE is_active = true;

-- Match the LOE sibling tables: RLS OFF so the anon app can read + manage popups.
ALTER TABLE popup_templates DISABLE ROW LEVEL SECURITY;
