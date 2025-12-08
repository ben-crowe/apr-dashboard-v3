-- Create report-images storage bucket for appraisal report photos
-- Images organized by job ID and category

-- Create report-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'report-images',
  'report-images',
  true,  -- Public for easy access in reports
  20971520,  -- 20MB limit per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 20971520,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[];

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "report-images public read" ON storage.objects;
DROP POLICY IF EXISTS "report-images public insert" ON storage.objects;
DROP POLICY IF EXISTS "report-images public update" ON storage.objects;
DROP POLICY IF EXISTS "report-images public delete" ON storage.objects;

-- RLS policies for report-images bucket
-- Public read access (reports need to display images)
CREATE POLICY "report-images public read" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'report-images');

-- Public insert (for now - can restrict to authenticated users later)
CREATE POLICY "report-images public insert" ON storage.objects
  FOR INSERT TO public
  WITH CHECK (bucket_id = 'report-images');

-- Public update
CREATE POLICY "report-images public update" ON storage.objects
  FOR UPDATE TO public
  USING (bucket_id = 'report-images');

-- Public delete
CREATE POLICY "report-images public delete" ON storage.objects
  FOR DELETE TO public
  USING (bucket_id = 'report-images');

-- Storage path convention:
-- report-images/{job_id}/cover/{filename}
-- report-images/{job_id}/maps/{filename}
-- report-images/{job_id}/exterior/{filename}
-- report-images/{job_id}/street/{filename}
-- report-images/{job_id}/common/{filename}
-- report-images/{job_id}/units/{filename}
-- report-images/{job_id}/systems/{filename}
-- report-images/{job_id}/signature/{filename}
