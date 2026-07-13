-- Disable RLS on the editable-LOE-email tables to match the LOE sibling tables.
--
-- QA build-verify (2026-06-14) found per-send email instances SILENTLY never
-- persisted: email_templates + job_email_instances were created with RLS ENABLED
-- + an authenticated-only policy, but the APR app runs ANON (no ProtectedRoute on
-- /dashboard, getSession empty). Every sibling LOE table (loe_submissions,
-- job_contracts) has RLS OFF, so the anon insert hit 42501 and the row never wrote.
--
-- Fix = match the established sibling pattern (RLS off), not invent new anon policies.
ALTER TABLE email_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE job_email_instances DISABLE ROW LEVEL SECURITY;
