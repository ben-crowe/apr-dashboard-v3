-- Add 13 VALTA-FIELD-SPEC fields to job_property_info
-- These are post-LOE fields gathered during the appraisal assignment

-- Building Information fields (Section 3)
ALTER TABLE job_property_info ADD COLUMN IF NOT EXISTS tenancy text;
ALTER TABLE job_property_info ADD COLUMN IF NOT EXISTS state_of_improvements text;
ALTER TABLE job_property_info ADD COLUMN IF NOT EXISTS status_of_improvements text;
ALTER TABLE job_property_info ADD COLUMN IF NOT EXISTS property_subtype text;
ALTER TABLE job_property_info ADD COLUMN IF NOT EXISTS land_metric text;
ALTER TABLE job_property_info ADD COLUMN IF NOT EXISTS environmental_assessment text;
ALTER TABLE job_property_info ADD COLUMN IF NOT EXISTS heritage_conservation text;

-- Appraisal Assignment fields (Section 4)
ALTER TABLE job_property_info ADD COLUMN IF NOT EXISTS assignment_type text;
ALTER TABLE job_property_info ADD COLUMN IF NOT EXISTS desktop_report text;
ALTER TABLE job_property_info ADD COLUMN IF NOT EXISTS value_timeframe text;
ALTER TABLE job_property_info ADD COLUMN IF NOT EXISTS approaches_to_value text;
ALTER TABLE job_property_info ADD COLUMN IF NOT EXISTS transaction_status text;
ALTER TABLE job_property_info ADD COLUMN IF NOT EXISTS zoning_status text;
