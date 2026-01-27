# Subtasks Template Setup

**Date:** January 13, 2026  
**Purpose:** Document template task with 10 workflow SUBTASKS (not checklists)  
**List:** APR Test - Valta Mirror (901709622357)

---

## Template Task Created

- **Task ID:** `86dz89vw1`
- **Task Name:** `APR Job Workflow Template`
- **Task URL:** `https://app.clickup.com/t/86dz89vw1`
- **Type:** Parent task with 10 SUBTASKS (not checklists)
- **Status:** ✅ Checklist removed, only subtasks remain

---

## 10 Subtasks Created ✅

These are actual **subtasks** (child tasks with `parent` field), NOT checklist items:

**Subtask IDs:**
1. `86dz89y92` - Team Leader
2. `86dz89y9g` - 1. Create & Send LOE
3. `86dz89y9z` - 2. Plan Job
4. `86dz89yaf` - 3. Pull (TTSZ) Tax, Title, Site Plan, Zoning
5. `86dz89yat` - 4. Tour Property
6. `86dz89yb1` - 5. Sale and Lease Comps
7. `86dz89ybu` - 6. Build Front End
8. `86dz89yck` - 7. Complete Valuation
9. `86dz89yd3` - 8. Send to Client
10. `86dz89ydj` - 9. Book Job

**Note:** Checklist was removed - only subtasks remain.

1. **Team Leader** - Assign lead appraiser
2. **1. Create & Send LOE** - Generate and send Letter of Engagement
3. **2. Plan Job** - Review scope, assign resources, set timeline
4. **3. Pull (TTSZ) Tax, Title, Site Plan, Zoning** - Gather property documentation
5. **4. Tour Property** - Schedule and complete site inspection
6. **5. Sale and Lease Comps** - Research comparable properties
7. **6. Build Front End** - Create report structure and preliminary data
8. **7. Complete Valuation** - Finalize appraisal calculations
9. **8. Send to Client** - Deliver completed appraisal report
10. **9. Book Job** - Archive and update financial records

---

## How to Create Subtasks via API

### Create Subtask

```bash
POST https://api.clickup.com/api/v2/list/{list_id}/task
{
  "name": "Team Leader",
  "parent": "86dz89vw1",  // Parent task ID
  "status": "to do"
}
```

**Key:** Set `parent` field to the parent task ID to create a subtask.

### Get Subtasks

```bash
GET https://api.clickup.com/api/v2/task/{task_id}?include_subtasks=true
```

---

## Difference: Subtasks vs Checklists

### Subtasks (What We Need)
- ✅ Actual child tasks
- ✅ Can be assigned individually
- ✅ Can have their own due dates
- ✅ Can be moved between statuses independently
- ✅ Show up in task hierarchy
- ✅ Created with `parent` field in API

### Checklists (What I Created Before)
- ❌ Just checkboxes
- ❌ Cannot be assigned
- ❌ Cannot have due dates
- ❌ Just completion tracking
- ❌ Created with `/checklist` endpoint

---

## Using Template for New Tasks

When creating a new job task, copy subtasks from template:

```bash
# 1. Create parent task
PARENT_TASK_ID=$(curl -X POST "https://api.clickup.com/api/v2/list/901709622357/task" \
  -H "Authorization: pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY" \
  -H "Content-Type: application/json" \
  -d '{"name": "VAL251999 - Property Name, Address", "status": "to do"}' \
  | jq -r '.id')

# 2. Get subtask names from template
SUBTASK_NAMES=$(curl -X GET "https://api.clickup.com/api/v2/task/86dz89vw1?include_subtasks=true" \
  -H "Authorization: pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY" \
  | jq -r '.subtasks[] | .name')

# 3. Create subtasks for new task
for name in $SUBTASK_NAMES; do
  curl -X POST "https://api.clickup.com/api/v2/list/901709622357/task" \
    -H "Authorization: pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"$name\", \"parent\": \"$PARENT_TASK_ID\", \"status\": \"to do\"}"
done
```

---

## Verification

Verify template has 10 subtasks:

```bash
curl -X GET "https://api.clickup.com/api/v2/task/86dz89vw1?include_subtasks=true" \
  -H "Authorization: pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY" \
  | jq '{id, name, subtask_count: (.subtasks | length), subtasks: [.subtasks[] | {id, name, status: .status.status}]}'
```

Expected: 10 subtasks listed under the parent task.

---

**Document Status:** ✅ Template Created with Subtasks  
**Next Step:** Use template when creating new tasks (copy subtasks)
