-- Item 7B — archive over delete.
-- A dedicated flag column, NOT an overload of the workflow status column: JobListContext.validateJobStatus
-- coerces any non-enum status (including 'archived') back to 'submitted', which would silently resurface an
-- archived job in the active list and lose its workflow state. archived_at keeps status untouched.
--   NULL       = active  (shown on the dashboard)
--   timestamp  = archived (hidden from the active list; the record is kept)
--   restore    = set archived_at back to NULL
ALTER TABLE job_submissions ADD COLUMN IF NOT EXISTS archived_at timestamptz NULL;

COMMENT ON COLUMN job_submissions.archived_at IS
  'Item 7B: archive-over-delete. NULL = active (shown on dashboard); a timestamp = archived (hidden from active list, record kept). Restore = set back to NULL. Never overload the status column.';
