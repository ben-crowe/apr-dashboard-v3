# SOP: Create ClickUp Subtasks

**Purpose:** Standard procedure for creating subtasks in ClickUp via API
**Difficulty:** Easy (once you know the 3 required values)
**Last Updated:** January 13, 2026

---

## Prerequisites

You need 3 things:

1. **API Token** - ClickUp personal token or OAuth token
2. **List ID** - The list ID where the parent task exists
3. **Parent Task ID** - The task that will contain the subtasks
4. **Valid Status** - A status that exists in the list

---

## Step 1: Get Parent Task Details

```bash
curl -X GET "https://api.clickup.com/api/v2/task/{PARENT_TASK_ID}" \
  -H "Authorization: {TOKEN}"
```

**Extract from response:**
- `list.id` - The list ID (CRITICAL: must use this, not a different list)
- Current task name and status

---

## Step 2: Get List Statuses

```bash
curl -X GET "https://api.clickup.com/api/v2/list/{LIST_ID}" \
  -H "Authorization: {TOKEN}"
```

**Extract available statuses:**
```json
{
  "statuses": [
    {"status": "to do", "type": "open"},
    {"status": "in progress", "type": "custom"},
    {"status": "done", "type": "closed"}
  ]
}
```

**Pick one status** - Use `status` value (e.g., "to do", "gen stuff", "Open")

---

## Step 3: Create Subtasks

**Single Subtask:**

```bash
curl -X POST "https://api.clickup.com/api/v2/list/{LIST_ID}/task" \
  -H "Authorization: {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Subtask Name",
    "parent": "PARENT_TASK_ID",
    "status": "to do"
  }'
```

**Multiple Subtasks (Script):**

```bash
#!/bin/bash

PARENT_TASK_ID="abc123"
LIST_ID="12345678"
TOKEN="pk_xxxxx"
STATUS="to do"

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

for SUBTASK in "${SUBTASKS[@]}"; do
  curl -s -X POST "https://api.clickup.com/api/v2/list/${LIST_ID}/task" \
    -H "Authorization: ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"${SUBTASK}\", \"parent\": \"${PARENT_TASK_ID}\", \"status\": \"${STATUS}\"}"
  echo "✓ Created: $SUBTASK"
done
```

---

## Step 4: Verify Subtasks Created

```bash
curl -X GET "https://api.clickup.com/api/v2/task/{PARENT_TASK_ID}?include_subtasks=true" \
  -H "Authorization: {TOKEN}" \
  | jq '.subtasks | length'
```

Should return the count of subtasks (e.g., `10`).

---

## Common Errors & Solutions

### Error: "Parent not child of list" (ITEM_137)

**Cause:** Using wrong list ID
**Fix:** Get parent task's list ID first (Step 1), use that list ID

```bash
# DON'T use a random list ID
# DO use the parent task's actual list ID
LIST_ID=$(curl -s -X GET "https://api.clickup.com/api/v2/task/${PARENT_TASK_ID}" \
  -H "Authorization: ${TOKEN}" | jq -r '.list.id')
```

### Error: "Status not found" (CRTSK_001)

**Cause:** Status name doesn't exist in the list
**Fix:** Get valid statuses from list (Step 2), use exact status name

```bash
# Get available statuses
curl -X GET "https://api.clickup.com/api/v2/list/${LIST_ID}" \
  -H "Authorization: ${TOKEN}" | jq '.statuses[] | .status'

# Use exact status name (case-sensitive!)
# ✓ "to do" (correct)
# ✗ "To Do" (wrong - case mismatch)
```

### Error: "You do not have access to this Space" (ACCESS_080)

**Cause:** Using wrong API token (e.g., Valta token for BC workspace)
**Fix:** Use correct token for the workspace

```bash
# BC Workspace: pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY
# Valta Workspace: pk_54774263_VRTOFK2ENK5O96J549ESCPUESS76E1AT
```

---

## Key Concepts

### Subtasks vs Checklists

**Subtasks** (what you want):
- Real child tasks with their own task IDs
- Created with `parent` field
- Can be assigned, have due dates, move between statuses
- API: `POST /list/{list_id}/task` with `"parent": "PARENT_ID"`

**Checklists** (what you DON'T want):
- Just checkboxes inside a task
- Cannot be assigned or have due dates
- API: `POST /task/{task_id}/checklist` and `/checklist/{id}/checklist_item`

### The 3 Critical Values

| Value | Where to Get | Why Critical |
|-------|--------------|--------------|
| **List ID** | Parent task's `.list.id` | Must match parent's list |
| **Parent Task ID** | User provides or query | Sets parent-child relationship |
| **Valid Status** | List's `.statuses[].status` | Must exist in list |

---

## Working Examples

### BC Workspace (APR Test - Valta Mirror)

```bash
# Configuration
PARENT_TASK_ID="86dz89m0k"
LIST_ID="901709621852"
TOKEN="pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY"
STATUS="gen stuff"

# Create subtask
curl -X POST "https://api.clickup.com/api/v2/list/${LIST_ID}/task" \
  -H "Authorization: ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Team Leader", "parent": "'${PARENT_TASK_ID}'", "status": "'${STATUS}'"}'
```

### Valta Workspace (Production)

```bash
# Configuration
PARENT_TASK_ID="abc123"  # Replace with actual task ID
LIST_ID="901402094744"
TOKEN="pk_54774263_VRTOFK2ENK5O96J549ESCPUESS76E1AT"
STATUS="to do"  # Use actual status from list

# Create subtask
curl -X POST "https://api.clickup.com/api/v2/list/${LIST_ID}/task" \
  -H "Authorization: ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Team Leader", "parent": "'${PARENT_TASK_ID}'", "status": "'${STATUS}'"}'
```

---

## Quick Reference

```bash
# 1. Get parent task's list ID
LIST_ID=$(curl -s "https://api.clickup.com/api/v2/task/${PARENT_ID}" \
  -H "Authorization: ${TOKEN}" | jq -r '.list.id')

# 2. Get valid status
STATUS=$(curl -s "https://api.clickup.com/api/v2/list/${LIST_ID}" \
  -H "Authorization: ${TOKEN}" | jq -r '.statuses[0].status')

# 3. Create subtask
curl -X POST "https://api.clickup.com/api/v2/list/${LIST_ID}/task" \
  -H "Authorization: ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Subtask Name\", \"parent\": \"${PARENT_ID}\", \"status\": \"${STATUS}\"}"

# 4. Verify
curl -s "https://api.clickup.com/api/v2/task/${PARENT_ID}?include_subtasks=true" \
  -H "Authorization: ${TOKEN}" | jq '.subtasks | length'
```

---

## Summary

Creating subtasks is **3 API values + 1 API call**:

1. Parent task's **list ID** (from parent task)
2. **Parent task ID** (provided)
3. **Valid status** (from list)
4. **POST** to `/list/{list_id}/task` with `parent` field

**That's it.** Once you have those 3 values correct, it works every time.

---

**Difficulty Rating:** ⭐️ Easy (once you understand the 3 values)
**Time to Execute:** 30 seconds per subtask
**Common Mistakes:** Wrong list ID, wrong status name, confusing subtasks with checklists
