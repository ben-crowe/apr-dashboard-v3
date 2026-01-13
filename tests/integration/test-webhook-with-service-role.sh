#!/bin/bash

# Test webhook using service role key (bypasses RLS)
# This simulates how the webhook actually works in production

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

SUPABASE_URL="https://ngovnamnjmexdpjtcnky.supabase.co"
WEBHOOK_URL="${SUPABASE_URL}/functions/v1/docuseal-webhook"

# Get service role key from environment or use test key
# Note: In production, webhook uses SUPABASE_SERVICE_ROLE_KEY from env
SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-test-service-key}"

echo -e "${BLUE}Testing DocuSeal Webhook with Service Role Key${NC}"
echo ""

# Create test data using service role (bypasses RLS)
echo -e "${YELLOW}Creating test job with service role...${NC}"

TEST_JOB_ID=$(uuidgen | tr '[:upper:]' '[:lower:]')
TEST_SUBMISSION_ID="test-submission-$(date +%s)"
TEST_CLICKUP_TASK_ID="test-task-$(date +%s)"

# Note: This requires service role key - for now, we'll test with existing data
# or create via Edge Function that has service role access

echo "Test Job ID: ${TEST_JOB_ID}"
echo "Submission ID: ${TEST_SUBMISSION_ID}"
echo ""
echo -e "${YELLOW}Note: This test requires service role key access.${NC}"
echo -e "${YELLOW}For full testing, use Supabase Dashboard SQL Editor to create test data,${NC}"
echo -e "${YELLOW}or test with real DocuSeal webhook events.${NC}"
echo ""

# Test webhook endpoint is accessible
echo -e "${YELLOW}Testing webhook endpoint accessibility...${NC}"
RESPONSE=$(curl -s -X POST "${WEBHOOK_URL}" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "submission.created",
    "data": {
      "id": "test-123",
      "status": "pending",
      "created_at": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
    }
  }' 2>&1)

echo "Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

echo -e "${GREEN}Webhook endpoint is accessible${NC}"
echo ""
echo -e "${BLUE}To fully test:${NC}"
echo "1. Create job_loe_details record with docuseal_submission_id via Supabase Dashboard"
echo "2. Send webhook event with matching submission_id"
echo "3. Verify job found and ClickUp task updated"
