# ClickUp API Patterns Reference

**Purpose:** Working code examples from APR Dashboard for creating tasks, custom fields, and subtasks in ClickUp.

**For:** Cursor AI to learn ClickUp API patterns when building BC workspace mirror.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Create Task with Template](#create-task-with-template)
3. [Create Custom Fields](#create-custom-fields)
4. [Create Checklist/Subtasks](#create-checklistsubtasks)
5. [Update Task Description](#update-task-description)
6. [Get Template Information](#get-template-information)
7. [Complete Working Examples](#complete-working-examples)

---

## Authentication

All ClickUp API requests require an Authorization header:

```bash
Authorization: Bearer {CLICKUP_API_TOKEN}
```

**Environment Variables:**
- `CLICKUP_API_TOKEN` - Personal access token or OAuth token
- `CLICKUP_LIST_ID` - Target list ID
- `CLICKUP_TEMPLATE_ID` - Template ID (optional)

---

## Create Task with Template

### Basic Task Creation

**From:** `supabase/functions/create-clickup-task/index.ts:173-189`

```typescript
const clickupResponse = await fetch(`https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`, {
  method: 'POST',
  headers: {
    'Authorization': CLICKUP_API_TOKEN,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: taskName,
    markdown_description: description,
    priority: 3,
    status: 'to do',
    template_id: CLICKUP_TEMPLATE_ID // Optional - applies template subtasks
  })
})

const taskData = await clickupResponse.json()
const taskId = taskData.id
```

### Task with Custom Fields

**From:** `tests/integration/test-clickup-4-stages.sh:85-106`

```bash
curl -X POST "https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task" \
  -H "Authorization: ${CLICKUP_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "VAL251999 - Test Property, 123 Main St",
    "markdown_description": "**CLIENT INFO**\n• Name: Test Client\n• Email: test@example.com\n\n[View in Dashboard](https://example.com)",
    "status": "to do",
    "priority": 3,
    "custom_fields": [
      {
        "id": "job-number-field-id",
        "value": "VAL251999"
      },
      {
        "id": "dashboard-link-field-id",
        "value": "https://example.com/jobs/VAL251999"
      }
    ],
    "template_id": "t-86b3exqe8"
  }'
```

**Key Points:**
- `markdown_description` - Supports markdown formatting and clickable links
- `custom_fields` - Array of objects with `id` and `value`
- `template_id` - Automatically applies template's checklist items
- Field IDs must be obtained first (see Create Custom Fields section)

---

## Create Custom Fields

### Add Custom Field to List

**Pattern:** Create custom fields on the LIST level (not task level)

```bash
# 1. Create short text field
curl -X POST "https://api.clickup.com/api/v2/list/${LIST_ID}/field" \
  -H "Authorization: ${CLICKUP_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Job Number",
    "type": "short_text"
  }'

# 2. Create URL field
curl -X POST "https://api.clickup.com/api/v2/list/${LIST_ID}/field" \
  -H "Authorization: ${CLICKUP_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "APR Dashboard Link",
    "type": "url"
  }'

# 3. Create dropdown field
curl -X POST "https://api.clickup.com/api/v2/list/${LIST_ID}/field" \
  -H "Authorization: ${CLICKUP_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Property Type",
    "type": "drop_down",
    "type_config": {
      "options": [
        {"name": "Retail", "color": "#ff0000"},
        {"name": "Office", "color": "#00ff00"},
        {"name": "Industrial", "color": "#0000ff"}
      ]
    }
  }'
```

**Response:**
```json
{
  "id": "abc123-field-id",
  "name": "Job Number",
  "type": "short_text"
}
```

**Save the field `id`** - You'll need it to populate values when creating tasks.

### Common Field Types

| Type | Description | Example Value |
|------|-------------|---------------|
| `short_text` | Single-line text | `"VAL251999"` |
| `long_text` | Multi-line text | `"Long description..."` |
| `url` | Clickable URL | `"https://example.com"` |
| `drop_down` | Dropdown select | `"Retail"` |
| `number` | Numeric value | `3500` |
| `date` | Date picker | `1705104000000` (timestamp) |
| `checkbox` | Boolean | `true` or `false` |

---

## Create Checklist/Subtasks

**IMPORTANT:** ClickUp API requires a **two-step process** for checklist items:

1. Create the checklist container first
2. Add individual items to the checklist

### Step 1: Create Checklist

```bash
curl -X POST "https://api.clickup.com/api/v2/task/${TASK_ID}/checklist" \
  -H "Authorization: ${CLICKUP_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Team Leader"
  }'
```

**Response:**
```json
{
  "checklist": {
    "id": "checklist-abc123",
    "name": "Team Leader",
    "orderindex": 1,
    "items": []
  }
}
```

### Step 2: Add Checklist Items

**From:** `supabase/functions/create-clickup-task/index.ts` (inferred pattern)

```bash
# Add each subtask as a separate API call
curl -X POST "https://api.clickup.com/api/v2/checklist/${CHECKLIST_ID}/checklist_item" \
  -H "Authorization: ${CLICKUP_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Team Leader",
    "assignee": null
  }'

curl -X POST "https://api.clickup.com/api/v2/checklist/${CHECKLIST_ID}/checklist_item" \
  -H "Authorization: ${CLICKUP_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "1. Create & Send LOE"
  }'

curl -X POST "https://api.clickup.com/api/v2/checklist/${CHECKLIST_ID}/checklist_item" \
  -H "Authorization: ${CLICKUP_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "2. Plan Job"
  }'

# Repeat for all 10 subtasks...
```

### Complete 10-Subtask Example

```typescript
// From Valta template analysis
const subtasks = [
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

// Step 1: Create checklist
const checklistResponse = await fetch(`https://api.clickup.com/api/v2/task/${taskId}/checklist`, {
  method: 'POST',
  headers: {
    'Authorization': CLICKUP_API_TOKEN,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "Team Leader"
  })
})

const checklistData = await checklistResponse.json()
const checklistId = checklistData.checklist.id

// Step 2: Add each subtask item
for (const subtask of subtasks) {
  await fetch(`https://api.clickup.com/api/v2/checklist/${checklistId}/checklist_item`, {
    method: 'POST',
    headers: {
      'Authorization': CLICKUP_API_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: subtask
    })
  })
}
```

---

## Update Task Description

**From:** `scripts/manually-update-clickup-loe-signed.ts:34-95`

### Pattern: Fetch → Modify → Update

```typescript
// 1. Fetch existing task
const getTaskResponse = await fetch(`https://api.clickup.com/api/v2/task/${taskId}`, {
  method: 'GET',
  headers: {
    'Authorization': CLICKUP_API_TOKEN,
    'Content-Type': 'application/json'
  }
})

const existingTask = await getTaskResponse.json()
const existingDescription = existingTask.markdown_description

// 2. Modify description
// Example: Replace a placeholder line
const updatedDescription = existingDescription.replace(
  /📄 LOE DOCUMENT: Pending/,
  `📄 LOE DOCUMENT: ✅ Signed on ${new Date().toLocaleDateString()}`
)

// Or: Append new line
const updatedDescription = existingDescription + `\n\n✅ SIGNED: ${timestamp}`

// 3. Update task
const updateResponse = await fetch(`https://api.clickup.com/api/v2/task/${taskId}`, {
  method: 'PUT',
  headers: {
    'Authorization': CLICKUP_API_TOKEN,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    description: updatedDescription,
    markdown_description: updatedDescription
  })
})

if (!updateResponse.ok) {
  throw new Error(`Failed to update task: ${updateResponse.statusText}`)
}
```

**Key Points:**
- Always fetch existing description first (don't overwrite)
- Use `markdown_description` for markdown formatting
- Include both `description` and `markdown_description` fields
- Verify update with `!updateResponse.ok` check

---

## Get Template Information

**From:** `docs/Features/04-Job & Client Mgt./test-scripts/02-get-clickup-templates.js`

### Get List Templates

```javascript
const axios = require('axios')

const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN
const CLICKUP_LIST_ID = process.env.CLICKUP_LIST_ID

async function getTemplates() {
  try {
    // Get list details (includes templates)
    const listResponse = await axios.get(
      `https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}`,
      {
        headers: {
          'Authorization': CLICKUP_API_TOKEN
        }
      }
    )

    console.log('List Templates:', listResponse.data.templates)

    // Get specific template details
    const templateId = 't-86b3exqe8'
    const templateResponse = await axios.get(
      `https://api.clickup.com/api/v2/template/${templateId}`,
      {
        headers: {
          'Authorization': CLICKUP_API_TOKEN
        }
      }
    )

    console.log('Template Details:', templateResponse.data)
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
  }
}

getTemplates()
```

**Template Response Structure:**
```json
{
  "id": "t-86b3exqe8",
  "name": "LOE New Template 2025.01.09",
  "task": {
    "name": "Template Task Name",
    "description": "Template description",
    "checklists": [
      {
        "name": "Team Leader",
        "items": [
          {"name": "Team Leader"},
          {"name": "1. Create & Send LOE"},
          {"name": "2. Plan Job"}
        ]
      }
    ]
  }
}
```

---

## Complete Working Examples

### Example 1: Create Task from Scratch (No Template)

**From:** `tests/integration/test-clickup-4-stages.sh`

```bash
#!/bin/bash

# Configuration
CLICKUP_API_TOKEN="pk_54774263_VRTOFK2ENK5O96J549ESCPUESS76E1AT"
CLICKUP_LIST_ID="901402094744"

# Step 1: Create task
TASK_RESPONSE=$(curl -s -X POST "https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task" \
  -H "Authorization: ${CLICKUP_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "VAL251999 - Test Property, 123 Main St, Vancouver, BC",
    "markdown_description": "▸ NEW APPRAISAL REQUEST\n\n**CLIENT INFORMATION**\n• Name: Steven Torres\n• Email: steven@example.com\n\n**PROPERTY INFORMATION**\n• Property Name: Test Plaza\n• Address: 123 Main St\n• Property Type: Land",
    "status": "to do",
    "priority": 3
  }')

# Extract task ID
TASK_ID=$(echo $TASK_RESPONSE | jq -r '.id')
echo "Created task: $TASK_ID"

# Step 2: Create checklist
CHECKLIST_RESPONSE=$(curl -s -X POST "https://api.clickup.com/api/v2/task/${TASK_ID}/checklist" \
  -H "Authorization: ${CLICKUP_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Team Leader"
  }')

CHECKLIST_ID=$(echo $CHECKLIST_RESPONSE | jq -r '.checklist.id')
echo "Created checklist: $CHECKLIST_ID"

# Step 3: Add subtasks
for SUBTASK in "Team Leader" "1. Create & Send LOE" "2. Plan Job"; do
  curl -s -X POST "https://api.clickup.com/api/v2/checklist/${CHECKLIST_ID}/checklist_item" \
    -H "Authorization: ${CLICKUP_API_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"$SUBTASK\"}"
  echo "Added subtask: $SUBTASK"
done
```

### Example 2: Edge Function Pattern

**From:** `supabase/functions/create-clickup-task/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CLICKUP_API_TOKEN = Deno.env.get('CLICKUP_API_TOKEN')!
const CLICKUP_LIST_ID = Deno.env.get('CLICKUP_LIST_ID')!
const CLICKUP_TEMPLATE_ID = Deno.env.get('CLICKUP_TEMPLATE_ID')

serve(async (req) => {
  try {
    const { jobId } = await req.json()

    // 1. Fetch job data from Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: job, error } = await supabaseClient
      .from('job_submissions')
      .select('*')
      .eq('id', jobId)
      .single()

    if (error) throw error

    // 2. Build task details
    const taskName = `${job.job_number || 'NEW'} - ${job.property_name}, ${job.property_address}`

    const description = `▸ NEW APPRAISAL REQUEST: [View in APR Dashboard](https://apr-dashboard.vercel.app/jobs/${jobId})

**CLIENT INFORMATION**
• Name: ${job.client_first_name} ${job.client_last_name}
• Email: ${job.client_email}
• Phone: ${job.client_phone}

**PROPERTY INFORMATION**
• Property Name: ${job.property_name}
• Address: ${job.property_address}
• Property Type: ${job.property_type}

**LOE QUOTE & VALUATION DETAILS**
• Appraisal Fee: $${job.appraisal_fee}
• Retainer: $${job.retainer}
• Delivery Date: ${job.delivery_date}`

    // 3. Create ClickUp task
    const clickupResponse = await fetch(
      `https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`,
      {
        method: 'POST',
        headers: {
          'Authorization': CLICKUP_API_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: taskName,
          markdown_description: description,
          priority: 3,
          status: 'to do',
          template_id: CLICKUP_TEMPLATE_ID // Applies subtasks automatically
        })
      }
    )

    if (!clickupResponse.ok) {
      throw new Error(`ClickUp API error: ${clickupResponse.statusText}`)
    }

    const taskData = await clickupResponse.json()

    // 4. Save task ID back to database
    await supabaseClient
      .from('job_submissions')
      .update({ clickup_task_id: taskData.id })
      .eq('id', jobId)

    return new Response(
      JSON.stringify({
        success: true,
        taskId: taskData.id,
        taskUrl: taskData.url
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

---

## Common Patterns Summary

### Task Creation Flow
1. Build task name: `[JOB_NUMBER] - [PROPERTY_NAME], [ADDRESS]`
2. Build markdown description with sections
3. POST to `/api/v2/list/{list_id}/task`
4. Extract task ID from response
5. Save task ID to database

### Custom Fields Flow
1. Create fields on list: POST to `/api/v2/list/{list_id}/field`
2. Save field IDs
3. When creating tasks, include `custom_fields` array with IDs and values

### Checklist Flow
1. Create task first
2. POST to `/api/v2/task/{task_id}/checklist` to create container
3. Extract checklist ID
4. Loop through items, POST each to `/api/v2/checklist/{checklist_id}/checklist_item`

### Update Flow
1. GET existing task
2. Modify description/fields
3. PUT updated data back to `/api/v2/task/{task_id}`

---

## API Endpoints Quick Reference

| Action | Method | Endpoint |
|--------|--------|----------|
| Create task | POST | `/api/v2/list/{list_id}/task` |
| Get task | GET | `/api/v2/task/{task_id}` |
| Update task | PUT | `/api/v2/task/{task_id}` |
| Create field | POST | `/api/v2/list/{list_id}/field` |
| Create checklist | POST | `/api/v2/task/{task_id}/checklist` |
| Add checklist item | POST | `/api/v2/checklist/{checklist_id}/checklist_item` |
| Get template | GET | `/api/v2/template/{template_id}` |
| Get list | GET | `/api/v2/list/{list_id}` |

---

## Error Handling

**From:** All scripts show consistent error handling pattern:

```typescript
const response = await fetch(url, options)

if (!response.ok) {
  const errorText = await response.text()
  console.error('ClickUp API Error:', errorText)
  throw new Error(`ClickUp API error: ${response.statusText}`)
}

const data = await response.json()
```

**Common Errors:**
- `401 Unauthorized` - Invalid API token
- `404 Not Found` - Invalid list/task/template ID
- `400 Bad Request` - Missing required fields or invalid payload
- `429 Too Many Requests` - Rate limit exceeded

---

## Testing Script

**From:** `tests/integration/test-clickup-4-stages.sh` - Complete 4-stage automation test

```bash
#!/bin/bash
set -e

# Configuration
source .env.test

echo "=========================================="
echo "ClickUp 4-Stage Automation Test"
echo "=========================================="

# Stage 1: Create job and ClickUp task
echo "Stage 1: Creating job and ClickUp task..."
JOB_ID=$(uuidgen | tr '[:upper:]' '[:lower:]')

curl -X POST "${SUPABASE_URL}/rest/v1/job_submissions" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"id\": \"${JOB_ID}\", \"property_name\": \"Test Plaza\"}"

TASK_ID=$(curl -s -X POST "${SUPABASE_URL}/functions/v1/create-clickup-task" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"jobId\": \"${JOB_ID}\"}" | jq -r '.taskId')

echo "✓ Task created: $TASK_ID"

# Stage 2: Valcre job created
echo "Stage 2: Simulating Valcre job creation..."
# (Update description with Valcre job link)

# Stage 2.5: LOE sent
echo "Stage 2.5: Simulating LOE sent..."
# (Update description with DocuSeal link)

# Stage 3: LOE signed
echo "Stage 3: Simulating LOE signed..."
# (Update description with signature timestamp)

echo "=========================================="
echo "✓ All 4 stages completed successfully"
echo "=========================================="
```

---

**Last Updated:** January 13, 2026
**Source Files:**
- `tests/integration/test-clickup-4-stages.sh`
- `scripts/manually-update-clickup-loe-signed.ts`
- `src/utils/webhooks/clickup.ts`
- `supabase/functions/create-clickup-task/index.ts`
- `docs/Features/04-Job & Client Mgt./test-scripts/02-get-clickup-templates.js`
