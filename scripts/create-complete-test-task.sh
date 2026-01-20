#!/bin/bash
set -e

# ⚠️ BC WORKSPACE ONLY - SAFE FOR TESTING ⚠️
BC_TOKEN="pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY"
BC_LIST_ID="901709622357"  # APR Test - Valta Mirror list

echo "=========================================="
echo "Creating Complete Test Task in BC Workspace"
echo "=========================================="
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

# Custom field IDs (from Cursor's template task)
FIELD_JOB_NUMBER="77e8fc0f-0fe6-4916-ae26-4e36f587094c"
FIELD_APR_DASHBOARD="de43430c-e269-4d36-92e8-504b26a4cd57"
FIELD_VALCRE_LINK="6073e69c-114c-4498-a7cf-239080188401"
FIELD_CLIENT_FIRST="1c0a85cf-b257-4c58-8696-38da397ec743"
FIELD_CLIENT_LAST="2837a48e-8447-4e72-88de-9ad4e2f8c148"
FIELD_CLIENT_EMAIL="ff4ed4c7-a4d7-40f6-ae8e-d32625bd48b3"
FIELD_CLIENT_PHONE="ce6732da-6c2a-4102-9d1b-2a185d17353e"
FIELD_CLIENT_ORG="52d728c9-8a36-4f1a-a024-778d83e80dbd"
FIELD_PROPERTY_NAME="5e61e10d-79a5-4460-a610-c2df7fb0947e"
FIELD_PROPERTY_ADDRESS="a81a8be4-787b-4b6a-a649-6bfc65450a9f"
FIELD_PROPERTY_TYPE="6d93f760-abd3-4350-b4eb-dd06bd5e2aa5"
FIELD_DELIVERY_DATE="b01275c5-655d-46b8-a690-265185aec439"
FIELD_REPORT_TYPE="0137dc61-c9cf-46db-87c6-eb3aa88719c4"

# Task details
TASK_NAME="DEMO-001 - Harbor Retail Center, 456 Marine Dr, Vancouver, BC"

TASK_DESCRIPTION="▸ NEW APPRAISAL REQUEST: [View in APR Dashboard](https://apr-dashboard.vercel.app/jobs/demo-001)

**CLIENT INFORMATION**
• Name: Sarah Johnson
• Email: sjohnson@example.com
• Phone: (604) 555-1234
• Organization: Harbor Investments Ltd

**PROPERTY INFORMATION**
• Property Name: Harbor Retail Center
• Address: 456 Marine Dr, Vancouver, BC
• Property Type: Retail
• Asset Condition: Existing Property

**LOE QUOTE & VALUATION DETAILS**
• Appraisal Fee: \$4,500
• Retainer: \$2,250 (50% upfront)
• Delivery Date: February 28, 2026
• Report Type: Comprehensive
• Valuation Premise: Market Value As Is

**SCOPE OF WORK**
Complete appraisal including site inspection, comparable sales analysis, income approach, and cost approach.

**PAYMENT TERMS**
50% upfront, balance due upon delivery

---

📋 **WORKFLOW STATUS**
This task includes 10 subtasks matching the Valta workflow template."

echo "Step 1: Creating parent task..."

# Create main task with all custom fields
TASK_RESPONSE=$(curl -s -X POST "https://api.clickup.com/api/v2/list/${BC_LIST_ID}/task" \
  -H "Authorization: ${BC_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"${TASK_NAME}\",
    \"markdown_description\": $(echo "$TASK_DESCRIPTION" | jq -Rs .),
    \"status\": \"to do\",
    \"priority\": 3,
    \"custom_fields\": [
      {\"id\": \"${FIELD_JOB_NUMBER}\", \"value\": \"DEMO-001\"},
      {\"id\": \"${FIELD_APR_DASHBOARD}\", \"value\": \"https://apr-dashboard.vercel.app/jobs/demo-001\"},
      {\"id\": \"${FIELD_VALCRE_LINK}\", \"value\": \"https://valcre.com/jobs/demo-001\"},
      {\"id\": \"${FIELD_CLIENT_FIRST}\", \"value\": \"Sarah\"},
      {\"id\": \"${FIELD_CLIENT_LAST}\", \"value\": \"Johnson\"},
      {\"id\": \"${FIELD_CLIENT_EMAIL}\", \"value\": \"sjohnson@example.com\"},
      {\"id\": \"${FIELD_CLIENT_ORG}\", \"value\": \"Harbor Investments Ltd\"},
      {\"id\": \"${FIELD_PROPERTY_NAME}\", \"value\": \"Harbor Retail Center\"},
      {\"id\": \"${FIELD_PROPERTY_ADDRESS}\", \"value\": \"456 Marine Dr, Vancouver, BC\"},
      {\"id\": \"${FIELD_PROPERTY_TYPE}\", \"value\": \"4ee5fe78-62f4-43e9-a04f-fe92e3a848d8\"},
      {\"id\": \"${FIELD_DELIVERY_DATE}\", \"value\": 1740700800000},
      {\"id\": \"${FIELD_REPORT_TYPE}\", \"value\": \"19c3db8a-d5f2-4738-a881-6e77364f7809\"}
    ]
  }")

TASK_ID=$(echo "$TASK_RESPONSE" | jq -r '.id')

if [ "$TASK_ID" = "null" ] || [ -z "$TASK_ID" ]; then
  echo "❌ Failed to create task"
  echo "$TASK_RESPONSE" | jq .
  exit 1
fi

echo "✓ Task created: $TASK_ID"
echo "  URL: https://app.clickup.com/t/${TASK_ID}"
echo ""

echo "Step 2: Creating 10 subtasks..."

for SUBTASK in "${SUBTASKS[@]}"; do
  SUBTASK_RESPONSE=$(curl -s -X POST "https://api.clickup.com/api/v2/list/${BC_LIST_ID}/task" \
    -H "Authorization: ${BC_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"${SUBTASK}\",
      \"parent\": \"${TASK_ID}\",
      \"status\": \"to do\"
    }")

  SUBTASK_ID=$(echo "$SUBTASK_RESPONSE" | jq -r '.id')

  if [ "$SUBTASK_ID" != "null" ] && [ -n "$SUBTASK_ID" ]; then
    echo "  ✓ Created: $SUBTASK (ID: $SUBTASK_ID)"
  else
    echo "  ❌ Failed: $SUBTASK"
  fi
done

echo ""
echo "Step 3: Verifying subtasks..."

SUBTASK_COUNT=$(curl -s "https://api.clickup.com/api/v2/task/${TASK_ID}?include_subtasks=true" \
  -H "Authorization: ${BC_TOKEN}" | jq '.subtasks | length')

echo "  Total subtasks: ${SUBTASK_COUNT}"

echo ""
echo "=========================================="
echo "✓ Complete Test Task Created Successfully"
echo "=========================================="
echo ""
echo "Task ID: ${TASK_ID}"
echo "Task URL: https://app.clickup.com/t/${TASK_ID}"
echo "Subtasks: ${SUBTASK_COUNT}"
echo ""
echo "Custom Fields Populated:"
echo "  • Job Number: DEMO-001"
echo "  • Client: Sarah Johnson (sjohnson@example.com)"
echo "  • Organization: Harbor Investments Ltd"
echo "  • Property: Harbor Retail Center"
echo "  • Address: 456 Marine Dr, Vancouver, BC"
echo "  • Property Type: Retail"
echo "  • Delivery Date: Feb 28, 2026"
echo "  • Report Type: Comprehensive"
echo "  • APR Dashboard Link: ✓"
echo "  • Valcre Job Link: ✓"
echo ""
echo "This task demonstrates the complete structure for BC workspace testing."
echo ""
