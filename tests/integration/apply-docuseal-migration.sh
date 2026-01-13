#!/bin/bash

# Apply DocuSeal migration manually via Supabase API
# This adds the docuseal_submission_id column that the webhook needs

SUPABASE_URL="https://ngovnamnjmexdpjtcnky.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nb3ZuYW1uam1leGRwanRjbmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTk0NzAsImV4cCI6MjA1NzI5NTQ3MH0.i5pxHZ6Uvo1kcyws-C0tSegs35pA7tMO287_gYXIkGQ"

echo "Applying DocuSeal migration..."

# Note: This requires service role key or RPC function
# For now, we'll check if column exists and provide manual SQL

echo ""
echo "To apply this migration, run this SQL in Supabase SQL Editor:"
echo ""
cat << 'EOF'
-- Add DocuSeal integration columns to job_loe_details table
ALTER TABLE public.job_loe_details 
ADD COLUMN IF NOT EXISTS docuseal_submission_id VARCHAR,
ADD COLUMN IF NOT EXISTS signed_document_url VARCHAR,
ADD COLUMN IF NOT EXISTS signed_at TIMESTAMP;

-- Add index for quick lookups by DocuSeal submission ID
CREATE INDEX IF NOT EXISTS idx_job_loe_details_docuseal_submission_id 
ON public.job_loe_details(docuseal_submission_id);
EOF

echo ""
echo "Or check if column already exists:"
curl -s -X GET "${SUPABASE_URL}/rest/v1/job_loe_details?limit=0" \
    -H "apikey: ${SUPABASE_ANON_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
    -H "Prefer: return=minimal" 2>&1 | head -5
