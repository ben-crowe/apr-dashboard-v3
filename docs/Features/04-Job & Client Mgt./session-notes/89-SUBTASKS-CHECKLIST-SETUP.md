# Subtasks/Checklist Setup

**Date:** January 13, 2026  
**Purpose:** Document template task with 10 workflow checklist items  
**List:** APR Test - Valta Mirror (901709622357)

---

## Template Task Created

- **Task ID:** `86dz89vw1`
- **Task Name:** `APR Job Workflow Template`
- **Task URL:** `https://app.clickup.com/t/86dz89vw1`
- **Checklist ID:** `7f13d510-dadc-4431-a961-e66aff13fd30`
- **Checklist Name:** `APR Workflow Steps`

---

## 10 Checklist Items

These items are created in the template task and should be copied to new jobs:

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

## How to Use Template

### Option 1: Copy Checklist to New Task

When creating a new task, copy the checklist from the template:

```bash
# Get checklist from template
TEMPLATE_TASK_ID="86dz89vw1"
NEW_TASK_ID="[new_task_id]"

# Get checklist items from template
CHECKLIST_ITEMS=$(curl -s -X GET "https://api.clickup.com/api/v2/task/$TEMPLATE_TASK_ID?include_subtasks=true" \
  -H "Authorization: pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY" \
  | jq -r '.checklists[0].items[] | .name')

# Create checklist in new task
curl -X POST "https://api.clickup.com/api/v2/task/$NEW_TASK_ID/checklist" \
  -H "Authorization: pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY" \
  -H "Content-Type: application/json" \
  -d '{"name": "APR Workflow Steps"}'

# Add each item
for item in $CHECKLIST_ITEMS; do
  curl -X POST "https://api.clickup.com/api/v2/checklist/[checklist_id]/checklist_item" \
    -H "Authorization: pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"$item\"}"
done
```

### Option 2: Use ClickUp Template Feature

In ClickUp UI:
1. Open template task
2. Click "..." menu
3. Select "Save as Template"
4. When creating new task, use template

---

## API Reference

### Create Checklist

```bash
POST https://api.clickup.com/api/v2/task/{task_id}/checklist
{
  "name": "APR Workflow Steps"
}
```

### Add Checklist Item

```bash
POST https://api.clickup.com/api/v2/checklist/{checklist_id}/checklist_item
{
  "name": "Team Leader"
}
```

### Get Checklist Items

```bash
GET https://api.clickup.com/api/v2/task/{task_id}?include_subtasks=true
```

---

## Verification

Verify checklist has 10 items:

```bash
curl -X GET "https://api.clickup.com/api/v2/task/86dz89vw1?include_subtasks=true" \
  -H "Authorization: pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY" \
  | jq '.checklists[0] | {name, item_count: (.items | length), items: [.items[] | .name]}'
```

Expected output:
```json
{
  "name": "APR Workflow Steps",
  "item_count": 10,
  "items": [
    "Team Leader",
    "1. Create & Send LOE",
    "2. Plan Job",
    "3. Pull (TTSZ) Tax, Title, Site Plan, Zoning",
    "4. Tour Property",
    "5. Sale and Lease Comps",
    "6. Build Front End",
    "7. Complete Valuation",
    "8. Send to Client",
    "9. Book Job"
  ]
}
```

---

**Document Status:** ✅ Template Created with Checklist  
**Next Step:** Use template when creating new tasks
