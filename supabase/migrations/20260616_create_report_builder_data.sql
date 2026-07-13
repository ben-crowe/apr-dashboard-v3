-- V4 Slice 1: report-builder persistence. One row per job holds the report's
-- field-value bag so the builder survives reload. Spec:
-- docs/Architecture/SPEC-V4-slice1-unlock-persist.md
-- See src/features/report-builder/hooks/useSaveReportBuilderData.ts (save/load + autosave).

CREATE TABLE IF NOT EXISTS report_builder_data (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- QA FIX 3: job_id is TEXT and intentionally has NO foreign key. The report builder
  -- scopes by BOTH real job_submissions UUIDs AND synthetic/test ids (e.g. 'test-job-001'
  -- from /mock-builder), so a UUID-typed FK to job_submissions would reject valid builder
  -- sessions. Uniqueness + queryability are preserved by the unique index below.
  job_id         TEXT NOT NULL,
  schema_version INTEGER NOT NULL DEFAULT 1,  -- validation/migration hook (see save hook)
  data           JSONB NOT NULL DEFAULT '{}', -- the field-value bag (id -> value), registry-validated
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One row per job → autosave is a clean upsert on job_id.
CREATE UNIQUE INDEX IF NOT EXISTS uq_report_builder_data_job ON report_builder_data (job_id);

-- OPEN ACCESS (Ben's call, 2026-06-16): app under active development — no auth gate so
-- agents + anon + the app all read/write freely. Login-based gating is a separate later
-- feature. RLS disabled to match where the email tables landed (the intended posture).
ALTER TABLE report_builder_data DISABLE ROW LEVEL SECURITY;
