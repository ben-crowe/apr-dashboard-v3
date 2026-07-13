-- Add source tracking and tagging system to job_submissions
-- Date: 2026-01-08
-- Purpose: Track job creation source (manual vs webform) and enable flexible tagging for future CRM

-- Add source column (how job was created)
ALTER TABLE job_submissions 
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'webform';

-- Add tags column (flexible tagging system)
ALTER TABLE job_submissions 
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;

-- Add source_metadata column (additional context about creation)
ALTER TABLE job_submissions 
ADD COLUMN IF NOT EXISTS source_metadata JSONB DEFAULT '{}'::jsonb;

-- Add constraint for valid source values
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'valid_source' 
    AND conrelid = 'job_submissions'::regclass
  ) THEN
    ALTER TABLE job_submissions 
    ADD CONSTRAINT valid_source CHECK (source IN ('webform', 'manual', 'api', 'import', 'crm'));
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_job_submissions_source ON job_submissions(source);
CREATE INDEX IF NOT EXISTS idx_job_submissions_tags ON job_submissions USING GIN(tags);

-- Backfill existing jobs - assume all existing are webform submissions
UPDATE job_submissions 
SET source = 'webform', tags = '[]'::jsonb, source_metadata = '{}'::jsonb
WHERE source IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN job_submissions.source IS 'How the job was created: webform, manual, api, import, crm';
COMMENT ON COLUMN job_submissions.tags IS 'Array of tags for filtering and categorization (e.g., ["urgent", "repeat-client"])';
COMMENT ON COLUMN job_submissions.source_metadata IS 'Additional context about job creation (e.g., IP address, referrer)';
