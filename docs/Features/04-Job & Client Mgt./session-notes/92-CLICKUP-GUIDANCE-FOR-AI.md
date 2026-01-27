# ClickUp Guidance for AI Agents

**Date:** January 13, 2026  
**Purpose:** Comprehensive guide for AI agents working with ClickUp API  
**For:** Cursor AI and other agents building ClickUp integrations

---

## Quick Reference Links

### Scripts & Tools
- **[CLICKUP-SCRIPTS-REFERENCE.md](./CLICKUP-SCRIPTS-REFERENCE.md)** - Complete inventory of 55+ scripts/functions
- **[CLICKUP-API-PATTERNS-REFERENCE.md](./CLICKUP-API-PATTERNS-REFERENCE.md)** - Working code examples and patterns

### Key Directories
- **CLI Scripts:** `/Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/`
- **Test Scripts:** `/Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/04-Job & Client Mgt./test-scripts/`
- **Integration Code:** `/Users/bencrowe/Development/APR-Dashboard-v3/src/utils/webhooks/clickup.ts`

---

## Critical Concepts

### 1. Subtasks vs Checklists

**SUBTASKS** (What we need):
- Created with `parent` field in task creation
- Are actual child tasks with their own IDs
- Can be assigned, have due dates, move through statuses
- Show in task hierarchy
- API: `POST /list/{list_id}/task` with `{"parent": "parent_task_id"}`

**CHECKLISTS** (What we DON'T want):
- Created with `/checklist` endpoint
- Just checkboxes, not real tasks
- Cannot be assigned or have due dates
- Only for completion tracking
- API: `POST /task/{task_id}/checklist` then `POST /checklist/{checklist_id}/checklist_item`

**Key Difference:** Subtasks have `parent` field, checklists don't.

### 2. Templates vs Manual Creation

**Using Template (`template_id`):**
- Automatically creates subtasks/checklists from saved template
- One API call creates everything
- Template must exist in ClickUp first
- API: Include `"template_id": "t-xxxxx"` in task creation

**Manual Creation:**
- Create parent task first
- Then create each subtask with `parent` field
- More control, more API calls
- Better for programmatic control

### 3. Statuses Are Space-Level

**Critical:** Statuses are inherited from SPACE, not list level.

- To have custom statuses, create dedicated space
- Statuses configured in Space Settings → Statuses
- Cannot create statuses via API (must use UI)
- Lists inherit statuses from their space

### 4. Custom Fields

**Field Types:**
- `short_text` - Text input
- `url` - Clickable link
- `email` - Email address
- `phone` - Phone number
- `date` - Date picker
- `currency` - Money amount
- `drop_down` - Dropdown with options
- `text` - Multi-line text

**Creating Dropdown Fields:**
```json
{
  "name": "Property Type",
  "type": "drop_down",
  "type_config": {
    "options": [
      {"name": "Multifamily", "orderindex": 0},
      {"name": "Retail", "orderindex": 1}
    ]
  }
}
```

---

## Common Patterns

### Pattern 1: Create Task with Subtasks

```bash
# Step 1: Create parent task
PARENT_ID=$(curl -X POST "https://api.clickup.com/api/v2/list/{list_id}/task" \
  -H "Authorization: {token}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Parent Task", "status": "to do"}' \
  | jq -r '.id')

# Step 2: Create subtasks
for subtask_name in "Subtask 1" "Subtask 2" "Subtask 3"; do
  curl -X POST "https://api.clickup.com/api/v2/list/{list_id}/task" \
    -H "Authorization: {token}" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"$subtask_name\", \"parent\": \"$PARENT_ID\", \"status\": \"to do\"}"
done
```

### Pattern 2: Create Task with Template

```bash
curl -X POST "https://api.clickup.com/api/v2/list/{list_id}/task" \
  -H "Authorization: {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Task Name",
    "status": "to do",
    "template_id": "t-86b3exqe8"
  }'
```

### Pattern 3: Create Custom Fields

```bash
# Text field
curl -X POST "https://api.clickup.com/api/v2/list/{list_id}/field" \
  -H "Authorization: {token}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Field Name", "type": "short_text"}'

# Dropdown field
curl -X POST "https://api.clickup.com/api/v2/list/{list_id}/field" \
  -H "Authorization: {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Property Type",
    "type": "drop_down",
    "type_config": {
      "options": [
        {"name": "Option 1", "orderindex": 0},
        {"name": "Option 2", "orderindex": 1}
      ]
    }
  }'
```

### Pattern 4: Populate Custom Fields in Task

```bash
curl -X POST "https://api.clickup.com/api/v2/list/{list_id}/task" \
  -H "Authorization: {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Task Name",
    "custom_fields": [
      {"id": "field_id_1", "value": "Text Value"},
      {"id": "field_id_2", "value": "https://example.com"}
    ]
  }'
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Creating Checklists Instead of Subtasks
**Wrong:**
```bash
# Creates checklist, not subtask
curl -X POST "/task/{task_id}/checklist" ...
```

**Correct:**
```bash
# Creates actual subtask
curl -X POST "/list/{list_id}/task" \
  -d '{"name": "Subtask", "parent": "parent_id"}'
```

### ❌ Mistake 2: Trying to Create Statuses via API
**Wrong:** ClickUp API doesn't support creating statuses
**Correct:** Must use ClickUp UI (Space Settings → Statuses)

### ❌ Mistake 3: Assuming Statuses Are List-Level
**Wrong:** Trying to set statuses per list
**Correct:** Statuses are space-level, create dedicated space for custom statuses

### ❌ Mistake 4: Not Using `include_subtasks=true`
**Wrong:** Querying task without flag, getting `subtasks: 0`
**Correct:** Always use `?include_subtasks=true` when checking for subtasks

---

## Verification Patterns

### Verify Subtasks Exist

```bash
curl -X GET "https://api.clickup.com/api/v2/task/{task_id}?include_subtasks=true" \
  -H "Authorization: {token}" \
  | jq '{subtasks_count: (.subtasks | length), subtasks: [.subtasks[] | {id, name, parent}]}'
```

**Expected:** `subtasks_count: 10` with each subtask having `parent: "{parent_id}"`

### Verify Custom Fields

```bash
curl -X GET "https://api.clickup.com/api/v2/list/{list_id}/field" \
  -H "Authorization: {token}" \
  | jq '[.fields[] | select(.name | test("Field Name"; "i"))] | length'
```

**Expected:** Returns count of matching fields

### Verify Statuses

```bash
curl -X GET "https://api.clickup.com/api/v2/space/{space_id}" \
  -H "Authorization: {token}" \
  | jq '.statuses[] | {status, color, type, orderindex}'
```

**Expected:** List of all statuses with their properties

---

## Working Examples

### Example 1: Complete Task Creation (from APR Dashboard)

See: `supabase/functions/create-clickup-task/index.ts`

**Key Pattern:**
1. Build task name: `{job_number} - {property_name}, {address}`
2. Build markdown description with all job details
3. Create task with `template_id` (if using template)
4. Update database with task ID/URL

### Example 2: Create Subtasks Manually

See: `90-SUBTASKS-TEMPLATE-SETUP.md`

**Key Pattern:**
1. Create parent task
2. Loop through subtask names
3. Create each with `parent` field
4. Verify with `include_subtasks=true`

### Example 3: Field Creation Script

See: `87-CREATE-ALL-CUSTOM-FIELDS.md`

**Key Pattern:**
1. Define all fields with types
2. Create dropdown fields with `type_config.options`
3. Create currency fields with `type_config.currency`
4. Verify all fields created

---

## API Endpoints Quick Reference

### Tasks
- `POST /list/{list_id}/task` - Create task (or subtask with `parent`)
- `GET /task/{task_id}` - Get task details
- `GET /task/{task_id}?include_subtasks=true` - Get task with subtasks
- `PUT /task/{task_id}` - Update task
- `DELETE /task/{task_id}` - Delete task

### Custom Fields
- `POST /list/{list_id}/field` - Create custom field
- `GET /list/{list_id}/field` - Get all fields
- `PUT /task/{task_id}/field/{field_id}` - Update field value

### Checklists (Avoid - Use Subtasks Instead)
- `POST /task/{task_id}/checklist` - Create checklist
- `POST /checklist/{checklist_id}/checklist_item` - Add item
- `PUT /checklist/{checklist_id}/checklist_item/{item_id}` - Update item

### Lists & Spaces
- `POST /space/{space_id}/folder` - Create folder
- `POST /folder/{folder_id}/list` - Create list
- `GET /space/{space_id}` - Get space (includes statuses)

---

## Environment Configuration

### Development (BC Workspace)
```
Workspace ID: 8555561
Space ID: 90173368196 (APR Testing)
List ID: 901709622357 (APR Test - Valta Mirror)
API Token: pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY
```

### Production (Valta Workspace)
```
Workspace ID: 9014181018
List ID: 901402094744 (Valta Jobs)
Template ID: t-86b3exqe8 (LOE New Template)
```

---

## Key Learnings from This Session

1. **Statuses are space-level** - Created dedicated "APR Testing" space for custom statuses
2. **Subtasks use `parent` field** - Not checklists, actual child tasks
3. **Templates create structure** - But manual creation gives more control
4. **All fields from job ticket** - Created 29 custom fields matching dashboard
5. **Verification is critical** - Always use `include_subtasks=true` when checking

---

## Next Steps for Agents

When building ClickUp integrations:

1. **Start with workspace hierarchy** - Use `get-workspace-hierarchy.py`
2. **Create dedicated space** - If custom statuses needed
3. **Create list in space** - Then add custom fields
4. **Create template task** - With subtasks (not checklists)
5. **Verify everything** - Use API to confirm structure
6. **Document field IDs** - Save for automation

---

## Reference Documents

- **[CLICKUP-SCRIPTS-REFERENCE.md](./CLICKUP-SCRIPTS-REFERENCE.md)** - 55+ scripts inventory
- **[CLICKUP-API-PATTERNS-REFERENCE.md](./CLICKUP-API-PATTERNS-REFERENCE.md)** - Working code examples
- **[83-STATUS-PIPELINE-SETUP.md](./83-STATUS-PIPELINE-SETUP.md)** - Status configuration guide
- **[87-CREATE-ALL-CUSTOM-FIELDS.md](./87-CREATE-ALL-CUSTOM-FIELDS.md)** - Field creation guide
- **[90-SUBTASKS-TEMPLATE-SETUP.md](./90-SUBTASKS-TEMPLATE-SETUP.md)** - Subtasks creation guide

---

**Document Status:** ✅ Comprehensive Guidance Complete  
**Use When:** Building ClickUp integrations, creating tasks, fields, or subtasks
