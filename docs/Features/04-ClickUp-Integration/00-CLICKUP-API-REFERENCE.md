# ClickUp API Reference for Manual Operations

**Purpose**: Direct ClickUp API interaction via curl commands
**Date**: November 4, 2025
**API Version**: v2

---

## Authentication

All ClickUp API requests require an API token in the Authorization header.

```bash
Authorization: YOUR_API_KEY
```

**Base URL**: `https://api.clickup.com/api/v2`

---

## Your Credentials

### Development Environment (Ben's ClickUp)
```
API Key: pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU
Team ID: 8555561
Workspace: BC Workspace
Test List ID: 901703694310
```

### Production Environment (Client's Valta ClickUp)
```
API Key: pk_10791838_U80AIXPC66YFCS56AGWT71SAPXWH6EU5
Team ID: 9014181018
Workspace: Valta
Production List ID: 901402094744
Template ID: t-86b3exqe8
```

---

## Tasks

### Create Task

```bash
curl -X POST 'https://api.clickup.com/api/v2/list/{list_id}/task' \
  -H 'Authorization: {api_key}' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Task Name",
    "description": "Task description",
    "markdown_description": "**Bold** and *italic* text",
    "status": "to do",
    "priority": 3,
    "template_id": "t-86b3exqe8"
  }'
```

**Response**:
```json
{
  "id": "abc123",
  "name": "Task Name",
  "status": {
    "status": "to do"
  },
  "url": "https://app.clickup.com/t/abc123"
}
```

**Working Example (Development)**:
```bash
curl -X POST 'https://api.clickup.com/api/v2/list/901703694310/task' \
  -H 'Authorization: pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Test Task - Form Submission",
    "markdown_description": "**CLIENT**: John Smith\n**PROPERTY**: 123 Main St",
    "status": "to do",
    "priority": 3
  }'
```

### Get Task

```bash
curl -X GET 'https://api.clickup.com/api/v2/task/{task_id}' \
  -H 'Authorization: {api_key}'
```

**Response**:
```json
{
  "id": "abc123",
  "name": "Task Name",
  "description": "Task description",
  "status": {
    "status": "to do"
  },
  "custom_fields": [],
  "url": "https://app.clickup.com/t/abc123"
}
```

### Update Task

```bash
curl -X PUT 'https://api.clickup.com/api/v2/task/{task_id}' \
  -H 'Authorization: {api_key}' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Updated Task Name",
    "markdown_description": "Updated description",
    "status": "in progress"
  }'
```

### Delete Task

```bash
curl -X DELETE 'https://api.clickup.com/api/v2/task/{task_id}' \
  -H 'Authorization: {api_key}'
```

### Get Tasks in List

```bash
curl -X GET 'https://api.clickup.com/api/v2/list/{list_id}/task' \
  -H 'Authorization: {api_key}'
```

**With filters**:
```bash
curl -X GET 'https://api.clickup.com/api/v2/list/{list_id}/task?archived=false&subtasks=true' \
  -H 'Authorization: {api_key}'
```

---

## Custom Fields

### Create Custom Field

```bash
curl -X POST 'https://api.clickup.com/api/v2/list/{list_id}/field' \
  -H 'Authorization: {api_key}' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Dashboard Job URL",
    "type": "url",
    "type_config": {}
  }'
```

**Field Types**:
- `text` - Plain text
- `url` - URL (clickable link)
- `email` - Email address
- `phone` - Phone number
- `date` - Date picker
- `number` - Numeric value
- `checkbox` - Boolean
- `drop_down` - Dropdown selection

**Response**:
```json
{
  "id": "field-abc123",
  "name": "Dashboard Job URL",
  "type": "url"
}
```

### Set Custom Field Value (in task creation)

```bash
curl -X POST 'https://api.clickup.com/api/v2/list/{list_id}/task' \
  -H 'Authorization: {api_key}' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Task Name",
    "custom_fields": [
      {
        "id": "field-abc123",
        "value": "https://example.com/job/123"
      }
    ]
  }'
```

### Set Custom Field Value (existing task)

```bash
curl -X POST 'https://api.clickup.com/api/v2/task/{task_id}/field/{field_id}' \
  -H 'Authorization: {api_key}' \
  -H 'Content-Type: application/json' \
  -d '{
    "value": "https://example.com/job/123"
  }'
```

---

## Lists

### Get List

```bash
curl -X GET 'https://api.clickup.com/api/v2/list/{list_id}' \
  -H 'Authorization: {api_key}'
```

**Working Example (Development)**:
```bash
curl -X GET 'https://api.clickup.com/api/v2/list/901703694310' \
  -H 'Authorization: pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU'
```

### Get Lists in Folder

```bash
curl -X GET 'https://api.clickup.com/api/v2/folder/{folder_id}/list' \
  -H 'Authorization: {api_key}'
```

### Get Lists in Space

```bash
curl -X GET 'https://api.clickup.com/api/v2/space/{space_id}/list' \
  -H 'Authorization: {api_key}'
```

---

## Documents

### Create Document

```bash
curl -X POST 'https://api.clickup.com/api/v3/workspaces/{workspace_id}/docs' \
  -H 'Authorization: {api_key}' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Document Name",
    "parent": {
      "id": "{parent_id}",
      "type": 6
    },
    "visibility": "PUBLIC",
    "create_page": true
  }'
```

**Parent Types**:
- `4` - Space
- `5` - Folder
- `6` - List
- `7` - Everything
- `12` - Workspace

**Working Example (Ben's ClickUp)**:
```bash
curl -X POST 'https://api.clickup.com/api/v3/workspaces/8555561/docs' \
  -H 'Authorization: pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Test Document",
    "parent": {
      "id": "85319-16017",
      "type": 7
    },
    "visibility": "PUBLIC",
    "create_page": true
  }'
```

### Get Document

```bash
curl -X GET 'https://api.clickup.com/api/v3/workspaces/{workspace_id}/docs/{doc_id}' \
  -H 'Authorization: {api_key}'
```

### Create Document Page

```bash
curl -X POST 'https://api.clickup.com/api/v3/workspaces/{workspace_id}/docs/{doc_id}/pages' \
  -H 'Authorization: {api_key}' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Page Title",
    "content": "# Heading\n\nPage content in markdown",
    "parent_page_id": "{parent_page_id}"
  }'
```

**Note**: Omit `parent_page_id` to create top-level page.

### Update Document Page

```bash
curl -X PATCH 'https://api.clickup.com/api/v3/workspaces/{workspace_id}/docs/{doc_id}/pages/{page_id}' \
  -H 'Authorization: {api_key}' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Updated Page Title",
    "content": "Updated content",
    "content_format": "md",
    "content_edit_mode": "replace"
  }'
```

**Content Edit Modes**:
- `replace` - Replace entire content
- `append` - Add to end
- `prepend` - Add to beginning

---

## Templates

### Get Template

```bash
curl -X GET 'https://api.clickup.com/api/v2/team/{team_id}/taskTemplate/{template_id}' \
  -H 'Authorization: {api_key}'
```

**Working Example (Production Template)**:
```bash
curl -X GET 'https://api.clickup.com/api/v2/team/9014181018/taskTemplate/t-86b3exqe8' \
  -H 'Authorization: pk_10791838_U80AIXPC66YFCS56AGWT71SAPXWH6EU5'
```

### Apply Template to Task

Include `template_id` in task creation:
```bash
curl -X POST 'https://api.clickup.com/api/v2/list/{list_id}/task' \
  -H 'Authorization: {api_key}' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Task Name",
    "template_id": "t-86b3exqe8"
  }'
```

---

## Workspaces & Spaces

### Get Workspaces (Teams)

```bash
curl -X GET 'https://api.clickup.com/api/v2/team' \
  -H 'Authorization: {api_key}'
```

### Get Spaces

```bash
curl -X GET 'https://api.clickup.com/api/v2/team/{team_id}/space' \
  -H 'Authorization: {api_key}'
```

### Get Folders in Space

```bash
curl -X GET 'https://api.clickup.com/api/v2/space/{space_id}/folder' \
  -H 'Authorization: {api_key}'
```

---

## Comments

### Get Task Comments

```bash
curl -X GET 'https://api.clickup.com/api/v2/task/{task_id}/comment' \
  -H 'Authorization: {api_key}'
```

### Create Task Comment

```bash
curl -X POST 'https://api.clickup.com/api/v2/task/{task_id}/comment' \
  -H 'Authorization: {api_key}' \
  -H 'Content-Type: application/json' \
  -d '{
    "comment_text": "This is a comment",
    "notify_all": false
  }'
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "err": "Token invalid",
  "ECODE": "OAUTH_027"
}
```
**Fix**: Check API key is correct.

### 404 Not Found
```json
{
  "err": "Team not found",
  "ECODE": "TEAM_NOT_FOUND"
}
```
**Fix**: Check team/workspace ID is correct.

### 400 Bad Request
```json
{
  "err": "List not found",
  "ECODE": "LIST_NOT_FOUND"
}
```
**Fix**: Check list ID exists and is accessible with your API key.

### 429 Rate Limited
```json
{
  "err": "Rate limit exceeded"
}
```
**Limit**: 100 requests per minute per token.

---

## Common Patterns

### Create Task with Full Configuration

```bash
curl -X POST 'https://api.clickup.com/api/v2/list/{list_id}/task' \
  -H 'Authorization: {api_key}' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "VAL250137 - Property Name, Address",
    "markdown_description": "**CLIENT**: John Smith\n**PROPERTY**: 123 Main St\n**EMAIL**: john@example.com",
    "status": "to do",
    "priority": 3,
    "template_id": "t-86b3exqe8",
    "custom_fields": [
      {
        "id": "field-abc123",
        "value": "https://apr-hub-05-25.vercel.app/#/dashboard?jobId=123"
      }
    ],
    "notify_all": false
  }'
```

### Update Task Name and Description

```bash
curl -X PUT 'https://api.clickup.com/api/v2/task/{task_id}' \
  -H 'Authorization: {api_key}' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "VAL250137 - Updated Name",
    "markdown_description": "**STAGE 1 DATA**\n...\n\n**STAGE 2 DATA**\nVAL: 250137\nFee: $2,500"
  }'
```

### Check Task Exists

```bash
# Get task by ID
TASK_ID="abc123"
API_KEY="pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU"

curl -X GET "https://api.clickup.com/api/v2/task/${TASK_ID}" \
  -H "Authorization: ${API_KEY}" \
  -s -o /dev/null -w "%{http_code}"

# Returns: 200 (exists) or 404 (doesn't exist)
```

---

## Testing Workflow

### 1. Verify API Access

```bash
# Development
curl -X GET 'https://api.clickup.com/api/v2/team' \
  -H 'Authorization: pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU'

# Should return team 8555561 (BC Workspace)
```

### 2. Get List Details

```bash
# Development test list
curl -X GET 'https://api.clickup.com/api/v2/list/901703694310' \
  -H 'Authorization: pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU'

# Should return list name and details
```

### 3. Create Test Task

```bash
curl -X POST 'https://api.clickup.com/api/v2/list/901703694310/task' \
  -H 'Authorization: pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "API Test Task",
    "description": "Testing ClickUp API access"
  }'

# Should return task ID and URL
```

### 4. Verify Task Created

Check ClickUp workspace to see task appeared.

### 5. Delete Test Task

```bash
curl -X DELETE 'https://api.clickup.com/api/v2/task/{task_id_from_step_3}' \
  -H 'Authorization: pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU'
```

---

## APR Dashboard Integration Examples

### Create Task on Form Submission

```bash
#!/bin/bash
JOB_ID="550e8400-e29b-41d4-a716-446655440000"
CLIENT_NAME="John Smith"
PROPERTY_ADDRESS="123 Main Street, Calgary AB"
DASHBOARD_URL="https://apr-hub-05-25.vercel.app/#/dashboard?jobId=${JOB_ID}"

# Development
curl -X POST 'https://api.clickup.com/api/v2/list/901703694310/task' \
  -H 'Authorization: pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU' \
  -H 'Content-Type: application/json' \
  -d "{
    \"name\": \"NEW SUBMISSION - ${PROPERTY_ADDRESS}\",
    \"markdown_description\": \"📍 **NEW JOB ARRIVED - [View in APR Hub](${DASHBOARD_URL})**\n\n**CLIENT**: ${CLIENT_NAME}\n**PROPERTY**: ${PROPERTY_ADDRESS}\",
    \"status\": \"to do\",
    \"priority\": 3
  }"
```

### Update Task After Valcre Job Created

```bash
#!/bin/bash
TASK_ID="abc123"
VAL_NUMBER="VAL250137"
APPRAISAL_FEE="2500.00"
DELIVERY_DATE="November 15, 2025"

# Get current task description
CURRENT_DESC=$(curl -s -X GET "https://api.clickup.com/api/v2/task/${TASK_ID}" \
  -H 'Authorization: pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU' \
  | jq -r '.markdown_description')

# Append Stage 2 data
NEW_DESC="${CURRENT_DESC}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📋 **VALCRE JOB CREATED**\n\nVAL: ${VAL_NUMBER}\nFee: \$${APPRAISAL_FEE}\nDelivery: ${DELIVERY_DATE}"

# Update task
curl -X PUT "https://api.clickup.com/api/v2/task/${TASK_ID}" \
  -H 'Authorization: pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU' \
  -H 'Content-Type: application/json' \
  -d "{
    \"name\": \"${VAL_NUMBER} - Property Name, Address\",
    \"markdown_description\": \"${NEW_DESC}\"
  }"
```

---

## Debugging

### View Full Response

```bash
curl -v -X GET 'https://api.clickup.com/api/v2/list/901703694310' \
  -H 'Authorization: pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU'
```

### Pretty Print JSON

```bash
curl -X GET 'https://api.clickup.com/api/v2/list/901703694310' \
  -H 'Authorization: pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU' \
  | jq '.'
```

### Save Response to File

```bash
curl -X GET 'https://api.clickup.com/api/v2/list/901703694310' \
  -H 'Authorization: pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU' \
  -o response.json
```

---

## Reference

**Official Docs**: https://clickup.com/api
**API Base**: https://api.clickup.com/api/v2
**Rate Limit**: 100 requests/minute per token

---

**Last Updated**: November 4, 2025
**Maintained By**: Ben Crowe
**Related Documents**: 00-ENVIRONMENT-CONFIG.md for workspace details
