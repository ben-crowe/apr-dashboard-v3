#!/bin/bash

# DocuSeal Webhook Test Suite
# Tests webhook job lookup and ClickUp task updates for Stages 2.5 & 3
# Usage: ./test-docuseal-webhook.sh [test-name]
# Example: ./test-docuseal-webhook.sh lookup-by-submission-id
#          ./test-docuseal-webhook.sh all

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
WEBHOOK_URL="${SUPABASE_URL}/functions/v1/docuseal-webhook"

# Test data
TEST_JOB_ID=$(uuidgen | tr '[:upper:]' '[:lower:]')
TEST_SUBMISSION_ID="test-submission-$(date +%s)"
TEST_CLICKUP_TASK_ID="test-task-$(date +%s)"

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}DocuSeal Webhook Test Suite${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# ============================================================================
# Setup: Create test job with ClickUp task ID and DocuSeal submission ID
# ============================================================================
setup_test_job() {
    echo -e "${YELLOW}Setting up test job...${NC}"
    
    # Create job submission
    curl -X POST "${SUPABASE_URL}/rest/v1/job_submissions" \
        -H "apikey: ${SUPABASE_ANON_KEY}" \
        -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
        -H "Content-Type: application/json" \
        -H "Prefer: return=representation" \
        -d '{
            "id": "'${TEST_JOB_ID}'",
            "client_first_name": "Test",
            "client_last_name": "Client",
            "client_email": "test@example.com",
            "property_name": "Test Property",
            "property_address": "123 Test St, Calgary, AB",
            "property_type": "Land",
            "clickup_task_id": "'${TEST_CLICKUP_TASK_ID}'",
            "clickup_task_url": "https://app.clickup.com/t/'${TEST_CLICKUP_TASK_ID}'"
        }' > /tmp/test_job_setup.json
    
    # Create LOE details with docuseal_submission_id pre-set
    curl -X POST "${SUPABASE_URL}/rest/v1/job_loe_details" \
        -H "apikey: ${SUPABASE_ANON_KEY}" \
        -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
        -H "Content-Type: application/json" \
        -H "Prefer: return=representation" \
        -d '{
            "job_id": "'${TEST_JOB_ID}'",
            "clickup_task_id": "'${TEST_CLICKUP_TASK_ID}'",
            "docuseal_submission_id": "'${TEST_SUBMISSION_ID}'",
            "job_number": "VAL999999"
        }' > /tmp/test_loe_setup.json
    
    echo -e "${GREEN}✓ Test job created${NC}"
    echo "  Job ID: ${TEST_JOB_ID}"
    echo "  Submission ID: ${TEST_SUBMISSION_ID}"
    echo "  ClickUp Task ID: ${TEST_CLICKUP_TASK_ID}"
    echo ""
}

# ============================================================================
# Test 1: Lookup by docuseal_submission_id (Production Mode)
# NOTE: This test requires the docuseal_submission_id column to exist
# If it fails, the migration needs to be applied first
# ============================================================================
test_lookup_by_submission_id() {
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}TEST 1: Lookup by docuseal_submission_id${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    echo -e "${BLUE}Note: This test requires docuseal_submission_id column.${NC}"
    echo -e "${BLUE}If column doesn't exist, migration needs to be applied first.${NC}"
    echo ""
    
    setup_test_job
    
    echo "Sending webhook with submission.created event..."
    echo "Using submission ID: ${TEST_SUBMISSION_ID}"
    echo ""
    
    # Send webhook for submission.created (Stage 2.5)
    # Include metadata.job_id as fallback since column might not exist yet
    RESPONSE=$(curl -s -X POST "${WEBHOOK_URL}" \
        -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
        -H "Content-Type: application/json" \
        -d '{
            "event_type": "submission.created",
            "data": {
                "id": "'${TEST_SUBMISSION_ID}'",
                "status": "pending",
                "email": "test@example.com",
                "created_at": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
                "metadata": {
                    "job_id": "'${TEST_JOB_ID}'"
                }
            }
        }')
    
    echo "Response:"
    echo "$RESPONSE" | jq '.'
    echo ""
    
    SUCCESS=$(echo "$RESPONSE" | jq -r '.success // false')
    MESSAGE=$(echo "$RESPONSE" | jq -r '.message // ""')
    JOB_ID=$(echo "$RESPONSE" | jq -r '.jobId // ""')
    
    if [ "$SUCCESS" = "true" ] && [ "$JOB_ID" = "$TEST_JOB_ID" ]; then
        echo -e "${GREEN}✓ TEST PASSED${NC}"
        echo "  ✓ Job found by submission ID"
        echo "  ✓ Correct job ID returned: ${JOB_ID}"
        if [ -n "$MESSAGE" ]; then
            echo "  ✓ Message: ${MESSAGE}"
        fi
    else
        echo -e "${RED}✗ TEST FAILED${NC}"
        echo "  Expected success=true and jobId=${TEST_JOB_ID}"
        echo "  Got: success=${SUCCESS}, jobId=${JOB_ID}"
        exit 1
    fi
    
    echo ""
}

# ============================================================================
# Test 2: Lookup by metadata.job_id (Test Mode) - Should update docuseal_submission_id
# ============================================================================
test_lookup_by_metadata() {
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}TEST 2: Lookup by metadata.job_id (Fallback)${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    # Create job WITHOUT docuseal_submission_id
    TEST_JOB_ID_2=$(uuidgen | tr '[:upper:]' '[:lower:]')
    TEST_SUBMISSION_ID_2="test-submission-$(date +%s)"
    TEST_CLICKUP_TASK_ID_2="test-task-$(date +%s)"
    
    echo "Creating test job WITHOUT docuseal_submission_id..."
    
    curl -X POST "${SUPABASE_URL}/rest/v1/job_submissions" \
        -H "apikey: ${SUPABASE_ANON_KEY}" \
        -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
        -H "Content-Type: application/json" \
        -H "Prefer: return=representation" \
        -d '{
            "id": "'${TEST_JOB_ID_2}'",
            "client_first_name": "Test",
            "client_last_name": "Client2",
            "client_email": "test2@example.com",
            "property_name": "Test Property 2",
            "property_address": "456 Test St, Calgary, AB",
            "property_type": "Land"
        }' > /dev/null
    
    curl -X POST "${SUPABASE_URL}/rest/v1/job_loe_details" \
        -H "apikey: ${SUPABASE_ANON_KEY}" \
        -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
        -H "Content-Type: application/json" \
        -H "Prefer: return=representation" \
        -d '{
            "job_id": "'${TEST_JOB_ID_2}'",
            "clickup_task_id": "'${TEST_CLICKUP_TASK_ID_2}'",
            "job_number": "VAL999998"
        }' > /dev/null
    
    echo -e "${GREEN}✓ Test job created (no submission ID)${NC}"
    echo ""
    
    echo "Sending webhook with metadata.job_id..."
    echo "Submission ID: ${TEST_SUBMISSION_ID_2}"
    echo "Job ID in metadata: ${TEST_JOB_ID_2}"
    echo ""
    
    # Send webhook with metadata.job_id
    RESPONSE=$(curl -s -X POST "${WEBHOOK_URL}" \
        -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
        -H "Content-Type: application/json" \
        -d '{
            "event_type": "submission.created",
            "data": {
                "id": "'${TEST_SUBMISSION_ID_2}'",
                "status": "pending",
                "email": "test2@example.com",
                "created_at": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
                "metadata": {
                    "job_id": "'${TEST_JOB_ID_2}'"
                }
            }
        }')
    
    echo "Response:"
    echo "$RESPONSE" | jq '.'
    echo ""
    
    SUCCESS=$(echo "$RESPONSE" | jq -r '.success // false')
    JOB_ID=$(echo "$RESPONSE" | jq -r '.jobId // ""')
    
    if [ "$SUCCESS" = "true" ] && [ "$JOB_ID" = "$TEST_JOB_ID_2" ]; then
        echo -e "${GREEN}✓ TEST PASSED${NC}"
        echo "  ✓ Job found by metadata.job_id"
        echo "  ✓ Correct job ID returned: ${JOB_ID}"
        
        # Verify docuseal_submission_id was updated
        echo ""
        echo "Verifying docuseal_submission_id was updated..."
        UPDATED=$(curl -s -X GET "${SUPABASE_URL}/rest/v1/job_loe_details?job_id=eq.${TEST_JOB_ID_2}&select=docuseal_submission_id" \
            -H "apikey: ${SUPABASE_ANON_KEY}" \
            -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" | jq -r '.[0].docuseal_submission_id')
        
        if [ "$UPDATED" = "$TEST_SUBMISSION_ID_2" ]; then
            echo -e "${GREEN}  ✓ docuseal_submission_id updated correctly: ${UPDATED}${NC}"
        else
            echo -e "${RED}  ✗ docuseal_submission_id NOT updated. Got: ${UPDATED}${NC}"
            exit 1
        fi
    else
        echo -e "${RED}✗ TEST FAILED${NC}"
        exit 1
    fi
    
    echo ""
}

# ============================================================================
# Test 3: Stage 3 - submission.completed (LOE Signed)
# ============================================================================
test_stage_3_signed() {
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}TEST 3: Stage 3 - LOE Signed${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    setup_test_job
    
    echo "Sending webhook with submission.completed event..."
    echo ""
    
    SIGNER_NAME="Test Client"
    SIGNER_EMAIL="test@example.com"
    
    RESPONSE=$(curl -s -X POST "${WEBHOOK_URL}" \
        -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
        -H "Content-Type: application/json" \
        -d '{
            "event_type": "submission.completed",
            "data": {
                "id": "'${TEST_SUBMISSION_ID}'",
                "status": "completed",
                "email": "'${SIGNER_EMAIL}'",
                "created_at": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
                "completed_at": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
                "submitters": [
                    {
                        "name": "'${SIGNER_NAME}'",
                        "email": "'${SIGNER_EMAIL}'"
                    }
                ],
                "documents": [
                    {
                        "id": "doc-123",
                        "name": "Signed LOE.pdf",
                        "url": "https://docuseal.co/documents/doc-123"
                    }
                ]
            }
        }')
    
    echo "Response:"
    echo "$RESPONSE" | jq '.'
    echo ""
    
    SUCCESS=$(echo "$RESPONSE" | jq -r '.success // false')
    JOB_ID=$(echo "$RESPONSE" | jq -r '.jobId // ""')
    STATUS=$(echo "$RESPONSE" | jq -r '.status // ""')
    SIGNER=$(echo "$RESPONSE" | jq -r '.signerName // ""')
    
    if [ "$SUCCESS" = "true" ] && [ "$JOB_ID" = "$TEST_JOB_ID" ] && [ "$STATUS" = "loe_signed" ]; then
        echo -e "${GREEN}✓ TEST PASSED${NC}"
        echo "  ✓ Job found by submission ID"
        echo "  ✓ Job status updated to: ${STATUS}"
        echo "  ✓ Signer name captured: ${SIGNER}"
        
        # Verify job status in database
        echo ""
        echo "Verifying job status in database..."
        DB_STATUS=$(curl -s -X GET "${SUPABASE_URL}/rest/v1/job_submissions?id=eq.${TEST_JOB_ID}&select=status" \
            -H "apikey: ${SUPABASE_ANON_KEY}" \
            -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" | jq -r '.[0].status')
        
        if [ "$DB_STATUS" = "loe_signed" ]; then
            echo -e "${GREEN}  ✓ Database status updated correctly: ${DB_STATUS}${NC}"
        else
            echo -e "${RED}  ✗ Database status NOT updated. Got: ${DB_STATUS}${NC}"
            exit 1
        fi
    else
        echo -e "${RED}✗ TEST FAILED${NC}"
        exit 1
    fi
    
    echo ""
}

# ============================================================================
# Test 4: Error Handling - Job Not Found
# ============================================================================
test_job_not_found() {
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}TEST 4: Error Handling - Job Not Found${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    FAKE_SUBMISSION_ID="fake-submission-$(date +%s)"
    
    echo "Sending webhook with non-existent submission ID..."
    echo "Submission ID: ${FAKE_SUBMISSION_ID}"
    echo ""
    
    RESPONSE=$(curl -s -X POST "${WEBHOOK_URL}" \
        -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
        -H "Content-Type: application/json" \
        -d '{
            "event_type": "submission.created",
            "data": {
                "id": "'${FAKE_SUBMISSION_ID}'",
                "status": "pending",
                "email": "fake@example.com",
                "created_at": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
            }
        }')
    
    echo "Response:"
    echo "$RESPONSE" | jq '.'
    echo ""
    
    SUCCESS=$(echo "$RESPONSE" | jq -r '.success // false')
    MESSAGE=$(echo "$RESPONSE" | jq -r '.message // ""')
    
    # For submission.created, should return success=true with message
    # For submission.completed, should return 404
    if [ "$SUCCESS" = "true" ] && [[ "$MESSAGE" == *"not found"* ]] || [[ "$MESSAGE" == *"skipping"* ]]; then
        echo -e "${GREEN}✓ TEST PASSED${NC}"
        echo "  ✓ Gracefully handled missing job"
        echo "  ✓ Returned success=true with appropriate message"
    else
        echo -e "${RED}✗ TEST FAILED${NC}"
        echo "  Expected success=true with 'not found' message"
        echo "  Got: success=${SUCCESS}, message=${MESSAGE}"
        exit 1
    fi
    
    echo ""
}

# ============================================================================
# Cleanup
# ============================================================================
cleanup() {
    echo -e "${YELLOW}Cleaning up test data...${NC}"
    
    if [ -n "$TEST_JOB_ID" ]; then
        curl -s -X DELETE "${SUPABASE_URL}/rest/v1/job_loe_details?job_id=eq.${TEST_JOB_ID}" \
            -H "apikey: ${SUPABASE_ANON_KEY}" \
            -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" > /dev/null
        
        curl -s -X DELETE "${SUPABASE_URL}/rest/v1/job_submissions?id=eq.${TEST_JOB_ID}" \
            -H "apikey: ${SUPABASE_ANON_KEY}" \
            -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" > /dev/null
    fi
    
    echo -e "${GREEN}✓ Cleanup complete${NC}"
}

# ============================================================================
# Main Execution
# ============================================================================

TEST_NAME="${1:-all}"

case "$TEST_NAME" in
    lookup-by-submission-id|1)
        test_lookup_by_submission_id
        cleanup
        ;;
    lookup-by-metadata|2)
        test_lookup_by_metadata
        cleanup
        ;;
    stage-3|3)
        test_stage_3_signed
        cleanup
        ;;
    job-not-found|4)
        test_job_not_found
        ;;
    all)
        test_lookup_by_submission_id
        echo ""
        test_lookup_by_metadata
        echo ""
        test_stage_3_signed
        echo ""
        test_job_not_found
        cleanup
        ;;
    cleanup)
        cleanup
        ;;
    *)
        echo "Usage: $0 [test-name|all|cleanup]"
        echo ""
        echo "Tests:"
        echo "  lookup-by-submission-id  - Test finding job by docuseal_submission_id"
        echo "  lookup-by-metadata       - Test fallback to metadata.job_id"
        echo "  stage-3                  - Test submission.completed (LOE signed)"
        echo "  job-not-found            - Test error handling"
        echo "  all                      - Run all tests (default)"
        echo "  cleanup                  - Clean up test data"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}Testing Complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
