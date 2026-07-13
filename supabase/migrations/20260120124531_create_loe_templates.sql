-- Create loe_templates table for storing user-editable LOE templates
CREATE TABLE loe_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  template_html TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(name, version, created_by)
);

-- Create indexes for performance
CREATE INDEX idx_loe_templates_user_default ON loe_templates(created_by, is_default) WHERE is_default = true;
CREATE INDEX idx_loe_templates_user_active ON loe_templates(created_by, is_active);

-- Enable Row Level Security
ALTER TABLE loe_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own templates
CREATE POLICY "Users can view own templates"
  ON loe_templates FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can insert own templates"
  ON loe_templates FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own templates"
  ON loe_templates FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own templates"
  ON loe_templates FOR DELETE
  USING (auth.uid() = created_by);
