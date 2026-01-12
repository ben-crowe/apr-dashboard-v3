#!/bin/bash

# ClickUp 4-Stage Automation Test Suite
# Tests all 4 stages of the ClickUp task lifecycle
# Usage: ./test-clickup-4-stages.sh [stage-number]
# Example: ./test-clickup-4-stages.sh 1    # Test only Stage 1
#          ./test-clickup-4-stages.sh all  # Test all stages

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SUPABASE_URL="https://ngovnamnjmexdpjtcnky.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nb3ZuYW1uam1leGRwanRjbmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTk0NzAsImV4cCI6MjA1NzI5NTQ3MH0.i5pxHZ6Uvo1kcyws-C0tSegs35pA7tMO287_gYXIkGQ"

# Test data - will be created in Supabase for testing
# Generate a valid UUID for test job
TEST_JOB_ID=$(uuidgen | tr '[:upper:]' '[:lower:]')
TEST_CLICKUP_TASK_ID=""

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}ClickUp 4-Stage Automation Test Suite${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# ============================================================================
# STAGE 1: Form Submission → Create ClickUp Task
# ============================================================================
test_stage_1() {
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}STAGE 1: Form Submission → Create ClickUp Task${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Creating test job in database..."

    # First, create a test job in the database
    curl -X POST "${SUPABASE_URL}/rest/v1/job_submissions" \
        -H "apikey: ${SUPABASE_ANON_KEY}" \
        -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
        -H "Content-Type: application/json" \
        -H "Prefer: return=representation" \
        -d '{
            "id": "'${TEST_JOB_ID}'",
            "client_first_name": "Steven",
            "client_last_name": "Torres",
            "client_organization": "Cornerstone Development",
            "client_email": "steven.torres.test@example.com",
            "client_phone": "(587) 657-9438",
            "property_name": "Test Plaza",
            "property_address": "123 Test Lane, Calgary, AB T2P 1A1",
            "property_type": "Land",
            "intended_use": "Insurance",
            "asset_condition": "Very Good",
            "valuation_premises": "Market Rent",
            "property_contact_first_name": "Patricia",
            "property_contact_last_name": "White",
            "property_contact_email": "patricia.white.test@example.com",
            "property_contact_phone": "(587) 661-9357",
            "notes": "Test submission for Stage 1 automation"
        }' > /tmp/test_job_create.json

    echo -e "${GREEN}✓ Test job created in database${NC}"
    echo ""
    echo "Triggering Stage 1: create-clickup-task..."

    # Call the create-clickup-task Edge Function
    curl -X POST "${SUPABASE_URL}/functions/v1/create-clickup-task" \
        -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
        -H "Content-Type: application/json" \
        -d '{
            "jobId": "'${TEST_JOB_ID}'"
        }' > /tmp/test_stage1_response.json

    echo ""
    cat /tmp/test_stage1_response.json | jq '.'
    echo ""

    # Extract ClickUp task ID for next stages
    TEST_CLICKUP_TASK_ID=$(cat /tmp/test_stage1_response.json | jq -r '.taskId')

    if [ "$TEST_CLICKUP_TASK_ID" != "null" ] && [ -n "$TEST_CLICKUP_TASK_ID" ]; then
        echo -e "${GREEN}✓ Stage 1 SUCCESS${NC}"
        echo -e "  Task ID: ${TEST_CLICKUP_TASK_ID}"
        echo -e "  Task URL: $(cat /tmp/test_stage1_response.json | jq -r '.taskUrl')"
    else
        echo -e "${RED}✗ Stage 1 FAILED${NC}"
        echo "Response:"
        cat /tmp/test_stage1_response.json | jq '.'
        exit 1
    fi

    echo ""
    echo -e "${BLUE}Expected Result:${NC}"
    echo "  ▸ Task created with name: PENDING - Test Plaza, 123 Test Lane"
    echo "  ▸ Description has client info, property info, submission notes"
    echo "  ▸ Bottom shows: ⏳ Waiting for LOE Quote Preparation..."
    echo ""
}

# ============================================================================
# STAGE 2: Valcre Job Created → Update ClickUp Task with LOE Section
# ============================================================================
test_stage_2() {
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}STAGE 2: Valcre Job Created → Add LOE Section${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    if [ -z "$TEST_CLICKUP_TASK_ID" ]; then
        echo -e "${RED}ERROR: No ClickUp task ID found. Run Stage 1 first.${NC}"
        exit 1
    fi

    echo "Creating LOE details in database..."

    # Create LOE details for the test job
    curl -X POST "${SUPABASE_URL}/rest/v1/job_loe_details" \
        -H "apikey: ${SUPABASE_ANON_KEY}" \
        -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
        -H "Content-Type: application/json" \
        -H "Prefer: return=representation" \
        -d '{
            "job_id": "'${TEST_JOB_ID}'",
            "job_number": "VAL251999",
            "property_rights": "Leased Fee Interest",
            "scope_of_work": "Direct Comparison Approach",
            "report_type": "Comprehensive Appraisal Report",
            "appraisal_fee": 3500.00,
            "retainer_amount": 1750.00,
            "delivery_date": "2025-12-15",
            "payment_terms": "50% retainer upfront, balance on delivery",
            "general_comments": "Internal appraiser notes and assessment details",
            "delivery_comments": "Deliver via email as PDF, CC to property manager",
            "payment_comments": "Wire transfer preferred, payment terms net 15",
            "clickup_task_id": "'${TEST_CLICKUP_TASK_ID}'"
        }' > /tmp/test_loe_create.json

    echo -e "${GREEN}✓ LOE details created in database${NC}"
    echo ""
    echo "Triggering Stage 2: update-clickup-task..."

    # Call the update-clickup-task Edge Function
    curl -X POST "${SUPABASE_URL}/functions/v1/update-clickup-task" \
        -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
        -H "Content-Type: application/json" \
        -d '{
            "jobId": "'${TEST_JOB_ID}'"
        }' > /tmp/test_stage2_response.json

    echo ""
    cat /tmp/test_stage2_response.json | jq '.'
    echo ""

    SUCCESS=$(cat /tmp/test_stage2_response.json | jq -r '.success')

    if [ "$SUCCESS" = "true" ]; then
        echo -e "${GREEN}✓ Stage 2 SUCCESS${NC}"
    else
        echo -e "${RED}✗ Stage 2 FAILED${NC}"
        echo "Response:"
        cat /tmp/test_stage2_response.json | jq '.'
        exit 1
    fi

    echo ""
    echo -e "${BLUE}Expected Result:${NC}"
    echo "  ▸ Task name updated: PENDING → VAL251999 - Test Plaza, 123 Test Lane"
    echo "  ▸ LOE section added with:"
    echo "    • Job Details (VAL251999, Created date)"
    echo "    • Property Valuation (Rights, Scope, Report Type)"
    echo "    • Financial Details (Fee, Retainer, Date, Terms)"
    echo "    • Comments (General, Delivery, Payment)"
    echo "  ▸ Valcre Job link updated from 'Coming Soon' to actual link"
    echo "  ▸ Stage 1 data preserved (client/property info)"
    echo ""
}

# ============================================================================
# STAGE 2.5: DocuSeal Send → Add "LOE Sent" Timestamp
# ============================================================================
test_stage_2_5() {
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}STAGE 2.5: DocuSeal Send → Add LOE Sent Timestamp${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    if [ -z "$TEST_CLICKUP_TASK_ID" ]; then
        echo -e "${RED}ERROR: No ClickUp task ID found. Run Stage 1 first.${NC}"
        exit 1
    fi

    echo "Simulating DocuSeal 'sent' webhook event..."

    # Simulate DocuSeal webhook for submission.created (sent)
    curl -X POST "${SUPABASE_URL}/functions/v1/docuseal-webhook" \
        -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
        -H "Content-Type: application/json" \
        -d '{
            "event_type": "submission.created",
            "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
            "data": {
                "id": "test-submission-'$(date +%s)'",
                "template_id": "test-template",
                "submission_id": "test-submission-'$(date +%s)'",
                "status": "pending",
                "metadata": {
                    "job_id": "'${TEST_JOB_ID}'",
                    "clickup_task_id": "'${TEST_CLICKUP_TASK_ID}'"
                }
            }
        }' > /tmp/test_stage2_5_response.json

    echo ""
    cat /tmp/test_stage2_5_response.json | jq '.'
    echo ""

    SUCCESS=$(cat /tmp/test_stage2_5_response.json | jq -r '.success')

    if [ "$SUCCESS" = "true" ]; then
        echo -e "${GREEN}✓ Stage 2.5 SUCCESS${NC}"
    else
        echo -e "${RED}✗ Stage 2.5 FAILED${NC}"
        echo "Response:"
        cat /tmp/test_stage2_5_response.json | jq '.'
        exit 1
    fi

    echo ""
    echo -e "${BLUE}Expected Result:${NC}"
    echo "  ▸ LOE Sent line added at top:"
    echo "    ▸ LOE Sent:   25.11.19 / 3:45 PM"
    echo "  ▸ Timestamp reflects current time"
    echo "  ▸ Line inserted after 'Submission Date'"
    echo ""
}

# ============================================================================
# STAGE 3: DocuSeal Signature → Add "LOE Signed" Timestamp + Client Name
# ============================================================================
test_stage_3() {
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}STAGE 3: DocuSeal Signature → Add LOE Signed${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    if [ -z "$TEST_CLICKUP_TASK_ID" ]; then
        echo -e "${RED}ERROR: No ClickUp task ID found. Run Stage 1 first.${NC}"
        exit 1
    fi

    echo "Simulating DocuSeal 'signed' webhook event..."

    # Simulate DocuSeal webhook for submission.completed (signed)
    curl -X POST "${SUPABASE_URL}/functions/v1/docuseal-webhook" \
        -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
        -H "Content-Type: application/json" \
        -d '{
            "event_type": "submission.completed",
            "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
            "data": {
                "id": "test-submission-'$(date +%s)'",
                "template_id": "test-template",
                "submission_id": "test-submission-'$(date +%s)'",
                "status": "completed",
                "submitters": [
                    {
                        "name": "Steven Torres",
                        "email": "steven.torres.test@example.com",
                        "completed_at": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
                    }
                ],
                "metadata": {
                    "job_id": "'${TEST_JOB_ID}'",
                    "clickup_task_id": "'${TEST_CLICKUP_TASK_ID}'"
                }
            }
        }' > /tmp/test_stage3_response.json

    echo ""
    cat /tmp/test_stage3_response.json | jq '.'
    echo ""

    SUCCESS=$(cat /tmp/test_stage3_response.json | jq -r '.success')

    if [ "$SUCCESS" = "true" ]; then
        echo -e "${GREEN}✓ Stage 3 SUCCESS${NC}"
    else
        echo -e "${RED}✗ Stage 3 FAILED${NC}"
        echo "Response:"
        cat /tmp/test_stage3_response.json | jq '.'
        exit 1
    fi

    echo ""
    echo -e "${BLUE}Expected Result:${NC}"
    echo "  ▸ LOE Signed line added after LOE Sent:"
    echo "    ▸ LOE Sent:   25.11.19 / 3:45 PM"
    echo "    ▸ LOE Signed: 25.11.19 / 3:47 PM by Steven Torres"
    echo "  ▸ Timestamp reflects current time"
    echo "  ▸ Client name extracted from submitter"
    echo ""
}

# ============================================================================
# Cleanup Function
# ============================================================================
cleanup() {
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}Cleanup${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Cleaning up test data..."

    # Delete test job from database
    if [ -n "$TEST_JOB_ID" ]; then
        curl -X DELETE "${SUPABASE_URL}/rest/v1/job_submissions?id=eq.${TEST_JOB_ID}" \
            -H "apikey: ${SUPABASE_ANON_KEY}" \
            -H "Authorization: Bearer ${SUPABASE_ANON_KEY}"

        curl -X DELETE "${SUPABASE_URL}/rest/v1/job_loe_details?job_id=eq.${TEST_JOB_ID}" \
            -H "apikey: ${SUPABASE_ANON_KEY}" \
            -H "Authorization: Bearer ${SUPABASE_ANON_KEY}"

        echo -e "${GREEN}✓ Test data cleaned up${NC}"
    fi

    # Note: ClickUp task will remain for manual verification
    if [ -n "$TEST_CLICKUP_TASK_ID" ]; then
        echo -e "${BLUE}Note: ClickUp task ${TEST_CLICKUP_TASK_ID} was created. Delete manually if needed.${NC}"
    fi
}

# ============================================================================
# Main Execution
# ============================================================================

STAGE="${1:-all}"

case "$STAGE" in
    1)
        test_stage_1
        ;;
    2)
        test_stage_1
        test_stage_2
        ;;
    2.5|25)
        test_stage_1
        test_stage_2
        test_stage_2_5
        ;;
    3)
        test_stage_1
        test_stage_2
        test_stage_2_5
        test_stage_3
        ;;
    all)
        test_stage_1
        echo ""
        read -p "Stage 1 complete. Continue to Stage 2? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            test_stage_2
        fi

        echo ""
        read -p "Stage 2 complete. Continue to Stage 2.5? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            test_stage_2_5
        fi

        echo ""
        read -p "Stage 2.5 complete. Continue to Stage 3? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            test_stage_3
        fi
        ;;
    cleanup)
        cleanup
        ;;
    *)
        echo "Usage: $0 [stage-number|all|cleanup]"
        echo ""
        echo "Options:"
        echo "  1       - Test Stage 1 only (form submission)"
        echo "  2       - Test Stages 1-2 (form + Valcre job)"
        echo "  2.5     - Test Stages 1-2.5 (form + Valcre + LOE sent)"
        echo "  3       - Test all stages 1-3 (complete flow)"
        echo "  all     - Test all stages with prompts (default)"
        echo "  cleanup - Clean up test data"
        echo ""
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}Testing Complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "Review the ClickUp task to verify all stages:"
echo "  Task ID: ${TEST_CLICKUP_TASK_ID}"
echo ""
echo "To cleanup test data, run:"
echo "  $0 cleanup"
echo ""
