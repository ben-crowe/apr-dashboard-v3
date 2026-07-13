-- Image Configurator Tables
-- Created for the image page configurator feature

-- Job Images table
CREATE TABLE IF NOT EXISTS public.job_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  thumbnail_path TEXT,
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  status TEXT DEFAULT 'pending',
  ai_category TEXT,
  ai_subcategory TEXT,
  ai_confidence DECIMAL(3,2),
  user_category TEXT,
  user_subcategory TEXT,
  quality_score DECIMAL(3,2),
  is_blurry BOOLEAN DEFAULT FALSE,
  is_overexposed BOOLEAN DEFAULT FALSE,
  is_underexposed BOOLEAN DEFAULT FALSE,
  crop_data JSONB,
  adjustments JSONB,
  selected_for_report BOOLEAN DEFAULT FALSE,
  page_assignment UUID,
  slot_position INTEGER,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page Layouts table
CREATE TABLE IF NOT EXISTS public.page_layouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id TEXT NOT NULL,
  page_type TEXT NOT NULL,
  layout_template TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  title TEXT,
  category_filter TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page Layout Slots table
CREATE TABLE IF NOT EXISTS public.page_layout_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layout_id UUID NOT NULL REFERENCES public.page_layouts(id) ON DELETE CASCADE,
  slot_position INTEGER NOT NULL,
  slot_label TEXT,
  image_id UUID REFERENCES public.job_images(id) ON DELETE SET NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_job_images_job_id ON public.job_images(job_id);
CREATE INDEX IF NOT EXISTS idx_page_layouts_job_id ON public.page_layouts(job_id);
CREATE INDEX IF NOT EXISTS idx_page_layout_slots_layout_id ON public.page_layout_slots(layout_id);

-- RLS Policies (permissive for dev)
ALTER TABLE public.job_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_layout_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all job_images" ON public.job_images;
CREATE POLICY "Allow all job_images" ON public.job_images FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all page_layouts" ON public.page_layouts;
CREATE POLICY "Allow all page_layouts" ON public.page_layouts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all page_layout_slots" ON public.page_layout_slots;
CREATE POLICY "Allow all page_layout_slots" ON public.page_layout_slots FOR ALL USING (true) WITH CHECK (true);

-- Storage buckets (explicit mime types - wildcards don't work)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('appraisal-raw', 'appraisal-raw', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('appraisal-processed', 'appraisal-processed', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies - fully permissive for dev
CREATE POLICY "Enable all for anon" ON storage.objects
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all for authenticated" ON storage.objects
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
