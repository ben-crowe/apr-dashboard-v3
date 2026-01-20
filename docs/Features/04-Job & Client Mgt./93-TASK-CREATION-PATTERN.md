# Task Creation Pattern - Learning from Examples

**Date:** January 13, 2026  
**Purpose:** Document correct task creation pattern based on real ClickUp examples  
**Example Task:** https://app.clickup.com/t/86dz8a3d7

---

## What I Learned from the Example Task

### Task Structure Analysis

**Example Task:** `86dz8a3d7` - "TASK EXMPLE"

**Current State:**
- Name: "TASK EXMPLE"
- Status: "gen stuff"
- Custom Fields: None populated
- Description: None
- Subtasks: Unknown (need to check with include_subtasks)

**What This Teaches:**
- Tasks can exist with minimal data
- Custom fields exist but may not be populated
- **CRITICAL:** Need to populate ALL custom fields when creating tasks
- Tasks should have descriptions with job information
- **Tasks appear in table/list view** - empty fields = empty columns = incomplete task

### Complete Example Task Created

**Task ID:** `86dz8a4cf` - "VAL251999 - Complete Test Task"

**What Was Created:**
- ✅ Task with name, status, priority
- ✅ Markdown description with full job details
- ✅ 6 custom fields populated (Job Number, Dashboard Link, Valcre Link, Client Name/Email)
- ✅ 10 subtasks created (all with `parent` field)
- ✅ No checklists (only subtasks)

**Pattern to Follow:**
1. Create task with ALL custom fields populated
2. Create 10 subtasks with `parent` field
3. Verify in list view - fields should show as columns
4. Verify in task detail - subtasks should appear nested

---

## Correct Task Creation Pattern

### Step 1: Create Parent Task with ALL Data

```bash
curl -X POST "https://api.clickup.com/api/v2/list/{list_id}/task" \
  -H "Authorization: {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "VAL251999 - Property Name, Address",
    "status": "TO DO",
    "priority": 3,
    "markdown_description": "Full job details...",
    "custom_fields": [
      {"id": "job_number_id", "value": "VAL251999"},
      {"id": "client_first_name_id", "value": "John"},
      {"id": "client_last_name_id", "value": "Smith"},
      {"id": "client_email_id", "value": "john@example.com"},
      {"id": "client_phone_id", "value": "(555) 123-4567"},
      {"id": "property_name_id", "value": "Property Name"},
      {"id": "property_address_id", "value": "123 Main St"},
      {"id": "property_type_id", "value": "Retail"},
      {"id": "dashboard_link_id", "value": "https://dashboard.com/job/123"},
      {"id": "valcre_link_id", "value": "https://valcre.com/job/123"},
      // ... ALL 29 custom fields populated
    ]
  }'
```

### Step 2: Create Subtasks (NOT Checklists)

```bash
PARENT_ID="task_id_from_step_1"

for subtask in "Team Leader" "1. Create & Send LOE" "2. Plan Job" \
  "3. Pull (TTSZ) Tax, Title, Site Plan, Zoning" "4. Tour Property" \
  "5. Sale and Lease Comps" "6. Build Front End" "7. Complete Valuation" \
  "8. Send to Client" "9. Book Job"; do
  
  curl -X POST "https://api.clickup.com/api/v2/list/{list_id}/task" \
    -H "Authorization: {token}" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"$subtask\",
      \"parent\": \"$PARENT_ID\",
      \"status\": \"TO DO\"
    }"
done
```

---

## Key Learnings

### 1. Populate ALL Custom Fields
- Don't create empty tasks
- Fill in all 29 custom fields from job ticket
- Fields should match dashboard data exactly

### 2. Tasks Appear in Table/List View
- Custom fields show as columns in list view
- Empty fields = empty columns = looks incomplete
- Need to populate fields so they're visible in table

### 3. Description + Fields = Complete Task
- Description shows full details when task is opened
- Custom fields show in list view columns
- Both are needed for complete task

### 4. Subtasks Show in Task Detail View
- Subtasks appear nested under parent task
- Each subtask is clickable
- Can be assigned and tracked independently

---

## Complete Task Creation Script

See: `87-CREATE-ALL-CUSTOM-FIELDS.md` for field creation
See: `90-SUBTASKS-TEMPLATE-SETUP.md` for subtask creation

**Full Pattern:**
1. Create parent task with ALL custom fields populated
2. Create 10 subtasks with `parent` field
3. Verify task appears correctly in list view
4. Verify subtasks appear in task detail view

---

**Document Status:** ✅ Pattern Documented  
**Next Step:** Create complete test task with all fields + subtasks
