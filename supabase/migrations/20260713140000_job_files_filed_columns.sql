-- job_files: record WHERE a client-supplied file was filed on SharePoint.
--
-- Additive and nullable only. No backfill, no destructive change. Every existing row keeps
-- sharepoint_path NULL, which is exactly what the S3 inbox reads as "not filed yet" — so all
-- existing files appear in the inbox on first load, which is the intended behaviour.
--
-- COLUMN NAMING: deliberately NOT `category`. That name is already claimed by
-- docs/Architecture/ASSET-ROUTING-ARCHITECTURE.md for the report-facing category set (the one that
-- routes an asset to a report section). These columns record the SharePoint SUBFOLDER a file was
-- physically filed into — a different thing. Reusing `category` would collide the two.
--
-- sharepoint_path is THE key column: it is the only one that cannot be non-null unless Graph
-- actually returned a webUrl for a completed PUT. The inbox keys on it alone.

alter table public.job_files
  add column if not exists filed_bucket    text,        -- exact subfolder name, e.g. '2. CLIENT SUPPLIED'
  add column if not exists filed_at        timestamptz, -- when the PUT succeeded
  add column if not exists sharepoint_path text;        -- the SharePoint webUrl returned by the PUT

comment on column public.job_files.filed_bucket is
  'The exact SharePoint subfolder this file was filed into (one of the five job subfolders). NULL = not filed.';
comment on column public.job_files.filed_at is
  'When the SharePoint PUT succeeded. Stamped only after a 2xx — never before.';
comment on column public.job_files.sharepoint_path is
  'The webUrl SharePoint returned for the filed item. NULL = not filed; this column alone defines the inbox.';

-- Inbox read path: job_files for a job where sharepoint_path is null.
create index if not exists job_files_unfiled_idx
  on public.job_files (job_id)
  where sharepoint_path is null;
