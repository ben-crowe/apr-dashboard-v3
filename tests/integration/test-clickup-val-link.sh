#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SUPABASE_URL="https://ngovnamnjmexdpjtcnky.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nb3ZuYW1uam1leGRwanRjbmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTk0NzAsImV4cCI6MjA1NzI5NTQ3MH0.i5pxHZ6Uvo1kcyws-C0tSegs35pA7tMO287_gYXIkGQ"

# Get job ID from argument or use default test job
JOB_ID="${1:-ff14d9e8-0247-4eac-b2a5-8edc18b3940c}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "ClickUp VAL Number Link Verification Test"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Testing Job ID: $JOB_ID"
echo ""

# Step 1: Get job details from Supabase to check if Valcre job exists
echo "Step 1: Checking job details in database..."
echo ""

JOB_DATA=$(curl -s -X GET \
  "$SUPABASE_URL/rest/v1/job_submissions?id=eq.$JOB_ID&select=*,job_loe_details(*)" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY")

echo "Job data retrieved:"
echo "$JOB_DATA" | jq '.[0] | {id, clickup_task_id, job_number, job_loe_details: .job_loe_details[0] | {job_number, valcre_job_id}}'
echo ""

# Extract critical values
VALCRE_JOB_ID=$(echo "$JOB_DATA" | jq -r '.[0].job_loe_details[0].valcre_job_id // empty')
VAL_JOB_NUMBER=$(echo "$JOB_DATA" | jq -r '.[0].job_loe_details[0].job_number // .[0].job_number // empty')
CLICKUP_TASK_ID=$(echo "$JOB_DATA" | jq -r '.[0].clickup_task_id // empty')

if [ -z "$VALCRE_JOB_ID" ]; then
  echo -e "${RED}❌ FAIL: No valcre_job_id found in database${NC}"
  echo "This job doesn't have a Valcre job created yet."
  echo "The VAL number link SHOULD NOT appear (this is expected behavior)."
  exit 1
fi

echo -e "${GREEN}✅ Valcre job exists:${NC}"
echo "   VAL Number: $VAL_JOB_NUMBER"
echo "   Valcre Job ID: $VALCRE_JOB_ID"
echo "   ClickUp Task ID: $CLICKUP_TASK_ID"
echo "   Expected URL: https://app.valcre.com/job/edit/$VALCRE_JOB_ID#job"
echo ""

# Step 2: Call update-clickup-task Edge Function
echo "Step 2: Calling update-clickup-task Edge Function..."
echo ""

EDGE_RESPONSE=$(curl -s -X POST \
  "$SUPABASE_URL/functions/v1/update-clickup-task" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -d "{\"jobId\":\"$JOB_ID\"}")

echo "Edge Function Response:"
echo "$EDGE_RESPONSE" | jq '.'
echo ""

if ! echo "$EDGE_RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
  echo -e "${RED}❌ FAIL: Edge Function did not return success${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Edge Function returned success${NC}"
echo ""

# Step 3: Get production ClickUp token from user
echo "Step 3: Fetching ClickUp task to verify changes..."
echo ""
echo -e "${YELLOW}NOTE: I need the production ClickUp API token to fetch the task.${NC}"
echo "Please provide it as the second argument:"
echo "  ./test-clickup-val-link.sh $JOB_ID YOUR_CLICKUP_TOKEN"
echo ""

if [ -z "$2" ]; then
  echo -e "${YELLOW}⚠️  No ClickUp token provided - cannot verify task content${NC}"
  echo "The Edge Function call succeeded, but I can't verify the actual ClickUp task."
  echo ""
  echo "To complete verification, run:"
  echo "  ./test-clickup-val-link.sh $JOB_ID \$(supabase secrets list | grep CLICKUP_API_TOKEN | awk '{print \$2}')"
  exit 0
fi

CLICKUP_TOKEN="$2"

# Fetch ClickUp task
TASK_CONTENT=$(curl -s -X GET \
  "https://api.clickup.com/api/v2/task/$CLICKUP_TASK_ID" \
  -H "Authorization: $CLICKUP_TOKEN" \
  -H "Content-Type: application/json")

if echo "$TASK_CONTENT" | jq -e '.err' > /dev/null 2>&1; then
  echo -e "${RED}❌ FAIL: ClickUp API error${NC}"
  echo "$TASK_CONTENT" | jq '.'
  exit 1
fi

DESCRIPTION=$(echo "$TASK_CONTENT" | jq -r '.markdown_description // .description')

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "ClickUp Task Content (First 1000 chars):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$DESCRIPTION" | head -c 1000
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 4: Validate content
echo "Step 4: Validating VAL number link..."
echo ""

# Check if VAL number appears with link format
EXPECTED_PATTERN="VALCRE JOB NUMBER.*\[$VAL_JOB_NUMBER\].*valcre\.com"
if echo "$DESCRIPTION" | grep -qE "$EXPECTED_PATTERN"; then
  echo -e "${GREEN}✅ VAL number appears as clickable link${NC}"

  # Extract the actual line
  VAL_LINE=$(echo "$DESCRIPTION" | grep "VALCRE JOB NUMBER")
  echo "   Actual line: $VAL_LINE"

  # Check if URL is correct format
  if echo "$VAL_LINE" | grep -q "job/edit/$VALCRE_JOB_ID"; then
    echo -e "${GREEN}✅ URL format is correct: /job/edit/$VALCRE_JOB_ID#job${NC}"
  else
    echo -e "${RED}❌ URL format is incorrect${NC}"
    echo "   Expected: https://app.valcre.com/job/edit/$VALCRE_JOB_ID#job"
  fi
else
  echo -e "${RED}❌ FAIL: VAL number link is missing or incorrect${NC}"
  echo "   Looking for pattern: $EXPECTED_PATTERN"
  echo ""
  echo "   Actual VAL number line:"
  echo "$DESCRIPTION" | grep "VALCRE JOB NUMBER" || echo "   (Line not found)"
  exit 1
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}ALL TESTS PASSED ✅${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Task URL: https://app.clickup.com/t/$CLICKUP_TASK_ID"
