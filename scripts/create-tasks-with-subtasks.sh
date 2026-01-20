#!/bin/bash
set -e

# ⚠️ CRITICAL: VERIFY WORKSPACE BEFORE RUNNING ⚠️
# Valta = PRODUCTION CLIENT WORKSPACE - DO NOT CREATE TEST TASKS THERE
# BC = TEST WORKSPACE - Safe for testing

# DEFAULTS TO BC WORKSPACE (SAFE FOR TESTING)
CLICKUP_API_TOKEN="${CLICKUP_API_TOKEN:-pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY}"
CLICKUP_LIST_ID="${CLICKUP_LIST_ID:-901709621852}"

# Verify workspace before proceeding
echo "⚠️  WORKSPACE CHECK ⚠️"
echo "Token: ${CLICKUP_API_TOKEN:0:15}..."
echo "List ID: ${CLICKUP_LIST_ID}"
echo ""
read -p "Creating tasks in BC TEST workspace? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Aborted - verify workspace configuration"
    exit 1
fi
echo ""

# 10 Subtasks from Valta template
SUBTASKS=(
  "Team Leader"
  "1. Create & Send LOE"
  "2. Plan Job"
  "3. Pull (TTSZ) Tax, Title, Site Plan, Zoning"
  "4. Tour Property"
  "5. Sale and Lease Comps"
  "6. Build Front End"
  "7. Complete Valuation"
  "8. Send to Client"
  "9. Book Job"
)

# Function to create task with subtasks
create_task_with_subtasks() {
  local TASK_NAME="$1"
  local TASK_DESC="$2"

  echo "Creating task: $TASK_NAME"

  # Step 1: Create the task (escape description for JSON)
  TASK_DESC_ESCAPED=$(echo "$TASK_DESC" | jq -Rs .)

  TASK_RESPONSE=$(curl -s -X POST "https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task" \
    -H "Authorization: ${CLICKUP_API_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"${TASK_NAME}\",
      \"markdown_description\": ${TASK_DESC_ESCAPED},
      \"status\": \"to do\",
      \"priority\": 3
    }")

  TASK_ID=$(echo "$TASK_RESPONSE" | jq -r '.id')

  if [ "$TASK_ID" = "null" ] || [ -z "$TASK_ID" ]; then
    echo "❌ Failed to create task"
    echo "$TASK_RESPONSE" | jq .
    return 1
  fi

  echo "✓ Task created: $TASK_ID"

  # Step 2: Create subtasks (actual child tasks, not checklist items)
  for SUBTASK in "${SUBTASKS[@]}"; do
    SUBTASK_RESPONSE=$(curl -s -X POST "https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task" \
      -H "Authorization: ${CLICKUP_API_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "{
        \"name\": \"${SUBTASK}\",
        \"parent\": \"${TASK_ID}\",
        \"status\": \"to do\"
      }")

    SUBTASK_ID=$(echo "$SUBTASK_RESPONSE" | jq -r '.id')

    if [ "$SUBTASK_ID" = "null" ] || [ -z "$SUBTASK_ID" ]; then
      echo "  ❌ Failed to create subtask: $SUBTASK"
    else
      echo "  ✓ Added subtask: $SUBTASK (ID: $SUBTASK_ID)"
    fi
  done

  echo "✓ Task complete: https://app.clickup.com/t/${TASK_ID}"
  echo ""
}

# Create sample tasks
echo "=========================================="
echo "Creating Tasks with 10 Subtasks"
echo "=========================================="
echo ""

# Task 1
create_task_with_subtasks \
  "TEST-001 - Sample Property, 123 Main St, Vancouver, BC" \
  "▸ NEW APPRAISAL REQUEST

**CLIENT INFORMATION**
• Name: Test Client
• Email: test@example.com
• Phone: (555) 123-4567

**PROPERTY INFORMATION**
• Property Name: Sample Property
• Address: 123 Main St
• Property Type: Retail"

# Task 2
create_task_with_subtasks \
  "TEST-002 - Office Building, 456 Oak Ave, Vancouver, BC" \
  "▸ NEW APPRAISAL REQUEST

**CLIENT INFORMATION**
• Name: Demo Client
• Email: demo@example.com
• Phone: (555) 987-6543

**PROPERTY INFORMATION**
• Property Name: Office Building
• Address: 456 Oak Ave
• Property Type: Office"

# Task 3
create_task_with_subtasks \
  "TEST-003 - Industrial Complex, 789 Industrial Way, Surrey, BC" \
  "▸ NEW APPRAISAL REQUEST

**CLIENT INFORMATION**
• Name: Sample Client
• Email: sample@example.com
• Phone: (555) 456-7890

**PROPERTY INFORMATION**
• Property Name: Industrial Complex
• Address: 789 Industrial Way
• Property Type: Industrial"

echo "=========================================="
echo "✓ All tasks created successfully"
echo "=========================================="
