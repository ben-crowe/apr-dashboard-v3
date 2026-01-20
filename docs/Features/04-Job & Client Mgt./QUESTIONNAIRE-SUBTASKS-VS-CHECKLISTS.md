# Questionnaire: Creating Subtasks in ClickUp

**Purpose:** Decision tree to avoid confusing subtasks with checklists
**Use When:** User asks to create "subtasks", "tasks", or "checklist items"
**Last Updated:** January 13, 2026

---

## Decision Tree

When user says "create subtasks" or "add tasks", ask these questions **IN ORDER**:

---

### Question 1: What Type of Items?

**Ask:** "Do you want **subtasks** (real child tasks) or **checklist items** (checkboxes)?"

| User Says | What They Mean | API Endpoint |
|-----------|----------------|--------------|
| "Subtasks" | Real child tasks | `POST /list/{list_id}/task` with `parent` |
| "Child tasks" | Real child tasks | `POST /list/{list_id}/task` with `parent` |
| "Checklist" | Checkboxes | `POST /task/{task_id}/checklist` |
| "Checkboxes" | Checkboxes | `POST /task/{task_id}/checklist` |

**If unclear, ask:**
> "Should these be:
> - **Real tasks** that can be assigned to people and moved between statuses?
> - **Checkboxes** inside the task description for simple completion tracking?"

**Default assumption:** If user shows you a ClickUp task with items that have task IDs → They want SUBTASKS

---

### Question 2: Do You Have the Parent Task ID?

**Ask:** "What's the parent task ID or task URL?"

**Formats accepted:**
- Task ID: `86dz89m0k`
- Task URL: `https://app.clickup.com/t/86dz89m0k`
- Full URL: `https://app.clickup.com/9014181018/v/li/901709621852/86dz89m0k`

**Extract task ID:**
```bash
# From URL
echo "https://app.clickup.com/t/86dz89m0k" | grep -oE '[a-z0-9]{9,}$'
# Output: 86dz89m0k
```

---

### Question 3: Get Parent Task's List ID

**DO NOT ASK USER** - Look it up automatically:

```bash
curl -X GET "https://api.clickup.com/api/v2/task/{PARENT_TASK_ID}" \
  -H "Authorization: {TOKEN}" | jq -r '.list.id'
```

**CRITICAL:** Use the parent task's list ID, not a random list ID.

**Why this matters:**
- ✅ Parent task in list `12345` → Create subtasks in list `12345`
- ❌ Parent task in list `12345` → Create subtasks in list `67890` = ERROR

---

### Question 4: Get Valid Status Name

**DO NOT ASK USER** - Look it up automatically:

```bash
curl -X GET "https://api.clickup.com/api/v2/list/{LIST_ID}" \
  -H "Authorization: {TOKEN}" | jq '.statuses[] | .status'
```

**Output example:**
```json
"gen stuff"
"ideas "
"complete"
```

**Pick one status** (usually first status or "to do" equivalent)

**Why this matters:**
- ✅ Status exists in list → Works
- ❌ Status doesn't exist → ERROR "Status not found"

---

### Question 5: Which Workspace/Token?

**⚠️ CRITICAL WARNING ⚠️**

**ALWAYS VERIFY WORKSPACE BEFORE CREATING TASKS**

**Valta = PRODUCTION CLIENT WORKSPACE - DO NOT CREATE TEST TASKS THERE**

**Ask:** "Is this for BC workspace or Valta workspace?"

| Workspace | Token | List ID (example) | Purpose |
|-----------|-------|-------------------|---------|
| **BC** | `pk_10791838_...` | `901709621852` | ✅ TESTING ONLY |
| **Valta** | `pk_54774263_...` | `901402094744` | ❌ PRODUCTION - NO TESTS |

**Why this matters:**
- ✅ BC token + BC task → Safe testing environment
- ❌ Valta token + Valta list → **POLLUTES CLIENT WORKSPACE**
- ❌ Creating test tasks in Valta = **MUST DELETE MANUALLY**

**BEFORE creating ANY tasks:**
```bash
# Verify you're using BC workspace
echo "Using workspace token: ${TOKEN}"
# Should be: pk_10791838_... (BC)
# Should NOT be: pk_54774263_... (Valta)

# Verify list is in BC workspace
curl -s "https://api.clickup.com/api/v2/list/${LIST_ID}" \
  -H "Authorization: ${TOKEN}" | jq '.space.id'
# Should be: BC space ID (not Valta)
```

---

## Pre-Flight Checklist

Before creating subtasks, verify:

- [ ] **User wants SUBTASKS** (not checklists)
- [ ] **Have parent task ID**
- [ ] **Looked up parent's list ID** (don't assume)
- [ ] **Looked up valid status** (don't assume "to do")
- [ ] **Using correct workspace token**

---

## Execution Template

```bash
#!/bin/bash

# === INPUTS (from user or lookup) ===
PARENT_TASK_ID="86dz89m0k"  # From user
TOKEN="pk_10791838_..."      # Based on workspace

# === AUTO-LOOKUP (never ask user) ===
LIST_ID=$(curl -s "https://api.clickup.com/api/v2/task/${PARENT_TASK_ID}" \
  -H "Authorization: ${TOKEN}" | jq -r '.list.id')

STATUS=$(curl -s "https://api.clickup.com/api/v2/list/${LIST_ID}" \
  -H "Authorization: ${TOKEN}" | jq -r '.statuses[0].status')

# === CREATE SUBTASKS ===
SUBTASKS=(
  "Team Leader"
  "1. Create & Send LOE"
  # ... etc
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

## Common Mistakes & How to Avoid

### Mistake 1: Assuming "to do" is a valid status

**Wrong approach:**
```bash
STATUS="to do"  # Assumption - might not exist!
```

**Right approach:**
```bash
# Look it up from the list
STATUS=$(curl -s "https://api.clickup.com/api/v2/list/${LIST_ID}" \
  -H "Authorization: ${TOKEN}" | jq -r '.statuses[0].status')
```

---

### Mistake 2: Using wrong list ID

**Wrong approach:**
```bash
LIST_ID="901402094744"  # Random list ID from environment variable
```

**Right approach:**
```bash
# Get list ID from parent task
LIST_ID=$(curl -s "https://api.clickup.com/api/v2/task/${PARENT_TASK_ID}" \
  -H "Authorization: ${TOKEN}" | jq -r '.list.id')
```

---

### Mistake 3: Creating checklists instead of subtasks

**Wrong approach:**
```bash
# This creates CHECKBOXES (not subtasks)
curl -X POST "https://api.clickup.com/api/v2/task/${PARENT_ID}/checklist" \
  -d '{"name": "Team Leader"}'
```

**Right approach:**
```bash
# This creates SUBTASKS (real child tasks)
curl -X POST "https://api.clickup.com/api/v2/list/${LIST_ID}/task" \
  -d '{"name": "Team Leader", "parent": "'${PARENT_ID}'", "status": "'${STATUS}'"}'
```

**Key difference:** Subtasks use `parent` field, not `/checklist` endpoint.

---

### Mistake 4: Not verifying workspace token

**Wrong approach:**
```bash
TOKEN="pk_54774263_..."  # Valta token
PARENT_TASK_ID="86dz89m0k"  # BC task (different workspace!)
# ERROR: "You do not have access"
```

**Right approach:**
```bash
# Ask user which workspace, use correct token
if [ "$WORKSPACE" = "BC" ]; then
  TOKEN="pk_10791838_..."
else
  TOKEN="pk_54774263_..."
fi
```

---

## Quick Reference Card

When user says "create subtasks":

1. ✅ **Confirm they want subtasks** (not checklists)
2. ✅ **Get parent task ID** (from user)
3. ✅ **Auto-lookup list ID** (from parent task)
4. ✅ **Auto-lookup valid status** (from list)
5. ✅ **Verify correct token** (BC vs Valta)
6. ✅ **Create subtasks** with `parent` field
7. ✅ **Verify count** with `?include_subtasks=true`

**Never assume:**
- ❌ List ID
- ❌ Status name
- ❌ Token workspace

**Always lookup:**
- ✅ Parent task's list ID
- ✅ List's valid statuses
- ✅ Workspace from task ID or user

---

## Example Dialog

**User:** "Create subtasks on this task: https://app.clickup.com/t/86dz89m0k"

**Agent thinks:**
1. User said "subtasks" → They want real child tasks (not checklists)
2. Parent task ID = `86dz89m0k` (extracted from URL)
3. Need to look up list ID (don't assume)
4. Need to look up status (don't assume)
5. Need to confirm workspace (BC or Valta?)

**Agent asks:** "Is this task in BC workspace or Valta workspace?"

**User:** "BC"

**Agent executes:**
```bash
# 1. Get list ID
LIST_ID=$(curl -s "https://api.clickup.com/api/v2/task/86dz89m0k" \
  -H "Authorization: pk_10791838_..." | jq -r '.list.id')
# Result: 901709621852

# 2. Get valid status
STATUS=$(curl -s "https://api.clickup.com/api/v2/list/901709621852" \
  -H "Authorization: pk_10791838_..." | jq -r '.statuses[0].status')
# Result: "gen stuff"

# 3. Create subtasks with correct values
for SUBTASK in "Team Leader" "1. Create & Send LOE" ...; do
  curl -X POST "https://api.clickup.com/api/v2/list/901709621852/task" \
    -H "Authorization: pk_10791838_..." \
    -d '{"name": "'$SUBTASK'", "parent": "86dz89m0k", "status": "gen stuff"}'
done
```

**Agent reports:** "✓ Created 10 subtasks in task 86dz89m0k"

---

**This questionnaire prevents:**
- Creating checklists when user wants subtasks
- Using wrong list ID (most common error)
- Using invalid status names
- Using wrong workspace token

**Result:** Subtasks created correctly on first try, every time.
