#!/bin/bash

# Bulk Delete Test Tasks from ClickUp
# WARNING: This will permanently delete ALL tasks with "Test Plaza" in the name

set -e

# Configuration
CLICKUP_API_TOKEN="pk_10791838_XB273RX0O9O1AL5WTZZIVREX1F3RUOL5"
LIST_ID="901706896375"  # New Submission - BC Workspace

echo "🔍 Finding all test tasks..."

# Get all tasks from the list
TASKS=$(curl -s "https://api.clickup.com/api/v2/list/${LIST_ID}/task" \
  -H "Authorization: ${CLICKUP_API_TOKEN}" \
  | jq -r '.tasks[] | select(.name | contains("Test Plaza") or contains("PENDING") or contains("VAL251999")) | .id')

TASK_COUNT=$(echo "$TASKS" | wc -l | tr -d ' ')

echo "Found ${TASK_COUNT} test tasks to delete"
echo ""
echo "Tasks to be deleted:"
echo "$TASKS"
echo ""

# Confirmation prompt
read -p "⚠️  Delete ${TASK_COUNT} test tasks? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled"
    exit 0
fi

# Delete each task
DELETED=0
FAILED=0

for TASK_ID in $TASKS; do
    echo -n "Deleting task ${TASK_ID}... "

    RESPONSE=$(curl -s -X DELETE "https://api.clickup.com/api/v2/task/${TASK_ID}" \
      -H "Authorization: ${CLICKUP_API_TOKEN}")

    if [[ $? -eq 0 ]]; then
        echo "✓"
        ((DELETED++))
    else
        echo "✗ Failed"
        ((FAILED++))
    fi

    # Rate limit: 100 requests per minute
    sleep 0.6
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Deleted: ${DELETED} tasks"
if [ $FAILED -gt 0 ]; then
    echo "❌ Failed: ${FAILED} tasks"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
