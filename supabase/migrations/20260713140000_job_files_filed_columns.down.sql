-- DOWN for 20260713140000_job_files_filed_columns.sql
--
-- ⚠ SCHEMA-REVERSIBLE, NOT CONSEQUENCE-REVERSIBLE. READ BEFORE RUNNING.
--
-- Dropping these columns restores the old table shape cleanly. It does NOT undo what the feature
-- did. By the time anyone runs this, files have been COPIED INTO THE CLIENT'S LIVE SHAREPOINT, and
-- these three columns are the ONLY record of which files we put there and where. Drop them and that
-- record is destroyed: the copies remain in the client's folders, and the app can no longer tell a
-- filed file from an unfiled one — so every already-filed file reappears in the inbox and will be
-- filed a second time.
--
-- The SharePoint side is not cleaned up by this script and MUST NOT be: deleting from a client's
-- live folder tree is not a migration's business.
--
-- If you are rolling back to fix a bug, strongly prefer leaving these columns in place.
-- If you must drop them, export them first:
--   create table job_files_filed_backup as
--     select id, job_id, filed_bucket, filed_at, sharepoint_path
--     from public.job_files where sharepoint_path is not null;

drop index if exists public.job_files_unfiled_idx;

alter table public.job_files
  drop column if exists sharepoint_path,
  drop column if exists filed_at,
  drop column if exists filed_bucket;
