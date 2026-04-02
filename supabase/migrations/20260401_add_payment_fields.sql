-- Add payment tracking fields to job_loe_details
-- retainer_amount already exists as TEXT — do NOT re-add
ALTER TABLE job_loe_details ADD COLUMN IF NOT EXISTS retainer_paid_date DATE;
ALTER TABLE job_loe_details ADD COLUMN IF NOT EXISTS payment_amount NUMERIC;
ALTER TABLE job_loe_details ADD COLUMN IF NOT EXISTS payment_paid_date DATE;
