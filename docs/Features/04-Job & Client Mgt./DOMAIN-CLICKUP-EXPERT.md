# ClickUp Domain Expert - Domain Knowledge File

**Domain Name:** ClickUp Integration Expert
**Domain ID:** `clickup-expert`
**Version:** 1.0
**Created:** January 13, 2026
**Purpose:** Comprehensive ClickUp API expertise for task management, OAuth setup, and workspace automation

---

## Domain Overview

### What This Domain Does

This domain expert handles all ClickUp API interactions, OAuth app setup, task creation, subtask management, custom field configuration, and workspace automation. It prevents common mistakes (confusing subtasks with checklists, wrong workspace tokens, invalid status names) and provides production-ready patterns for ClickUp integration.

### When to Use This Domain

**Use this domain when:**
- Creating tasks or subtasks in ClickUp
- Setting up ClickUp OAuth applications
- Managing custom fields
- Configuring workspace automation
- Building ClickUp integrations
- Troubleshooting ClickUp API errors
- Migrating from personal tokens to OAuth

**Don't use this domain for:**
- General project management questions
- ClickUp UI/UX questions (not API-related)
- Other task management tools (Asana, Jira, etc.)

---

## Three-Part Domain Structure

### Part 1: Core Knowledge

**What the domain expert knows:**

#### ClickUp API Fundamentals
- REST API endpoints and authentication
- Task hierarchy (spaces → folders → lists → tasks → subtasks)
- Workspace vs team vs space concepts
- Rate limiting and best practices
- Webhook integration patterns

#### Critical Distinctions
- **Subtasks vs Checklists** (most common confusion)
  - Subtasks = Real child tasks with `parent` field
  - Checklists = Checkboxes inside tasks
  - API endpoints are completely different

- **OAuth vs Personal Tokens**
  - OAuth: Auto-refresh, no expiration, production-ready
  - Personal: Expire after X days, manual regeneration, testing only

#### Common Errors & Solutions
- `ITEM_137`: "Parent not child of list" → Using wrong list ID
- `CRTSK_001`: "Status not found" → Invalid status name
- `ACCESS_080`: "You do not have access" → Wrong workspace token
- `FIELD_016`: "Invalid phone number" → Phone field format issues

### Part 2: Capabilities

**What the domain expert can do:**

#### Task Management
- ✅ Create tasks with custom fields
- ✅ Create subtasks (real child tasks, not checklists)
- ✅ Update task descriptions (markdown format)
- ✅ Move tasks between statuses
- ✅ Assign tasks to users
- ✅ Set due dates and priorities
- ✅ Copy tasks from templates
- ✅ Bulk task operations

#### Custom Fields
- ✅ Create custom fields on lists
- ✅ Populate field values (text, dropdown, date, url, email, phone)
- ✅ Update existing field values
- ✅ Handle dropdown field options
- ✅ Validate field types before setting values

#### Workspace Setup
- ✅ Create ClickUp OAuth applications
- ✅ Configure OAuth redirect URLs
- ✅ Handle authorization flows
- ✅ Store and refresh access tokens
- ✅ Verify workspace access
- ✅ List available spaces, folders, lists

#### Automation Patterns
- ✅ Form submission → Task creation
- ✅ Webhook → Task update
- ✅ Status change triggers
- ✅ Multi-stage workflow automation

#### Troubleshooting
- ✅ Diagnose API errors
- ✅ Verify workspace tokens
- ✅ Lookup list IDs from parent tasks
- ✅ Find valid status names
- ✅ Test field value formats

### Part 3: Tools & Scripts

**Available tools and utilities:**

#### Creation Scripts
- `create-tasks-with-subtasks.sh` - Batch create tasks with 10 subtasks
- `create-complete-test-task.sh` - Demo task with all fields populated
- Custom field creation patterns (text, dropdown, url, date)

#### Lookup Utilities
- Get parent task's list ID
- Query valid status names from list
- Extract custom field IDs
- Verify workspace access

#### Validation Scripts
- Pre-flight workspace checks
- Field value format validation
- Subtask count verification
- Token access testing

#### Documentation
- `SOP-CREATE-CLICKUP-SUBTASKS.md` - Step-by-step procedures
- `QUESTIONNAIRE-SUBTASKS-VS-CHECKLISTS.md` - Decision tree
- `CLICKUP-API-PATTERNS-REFERENCE.md` - Working code examples
- `LESSONS-LEARNED-CLICKUP-SUBTASKS.md` - Common mistakes

---

## OAuth vs Personal Token - Value Proposition

### Why OAuth App Setup Matters

#### Personal API Tokens (Limited Use)

**Pros:**
- ✅ Quick to generate (30 seconds)
- ✅ No app registration needed
- ✅ Good for testing/development

**Cons:**
- ❌ **Expire after X days** (requires manual regeneration)
- ❌ Tied to specific user account
- ❌ Cannot refresh automatically
- ❌ Must update everywhere when regenerated
- ❌ Not suitable for production
- ❌ User must be logged in

**Use case:** Local development, quick scripts, one-off tasks

#### OAuth App (Production-Ready)

**Pros:**
- ✅ **Auto-refresh tokens** (never expire)
- ✅ Works across multiple users/workspaces
- ✅ Production-ready and stable
- ✅ Can request specific permissions
- ✅ No manual token regeneration
- ✅ Users can revoke access independently
- ✅ Professional integration method

**Cons:**
- ❌ Requires app registration (one-time setup)
- ❌ More complex initial setup
- ❌ Needs OAuth callback handling

**Use case:** Production applications, automation, client deployments

### OAuth Setup Process

#### Step 1: Register ClickUp OAuth App

1. Go to ClickUp Settings → Integrations → ClickUp API
2. Create new app
3. Configure:
   - App Name: `[Your App Name]`
   - Redirect URL: `https://your-domain.com/oauth/callback`
   - Scopes: Select required permissions

4. Save credentials:
   - Client ID: `NSZQ8LEP2KV6KDUWEQU5VQBR65CIG7HKM7EZF61UG6HG82XN5J8S8C3WHGOENSD1`
   - Client Secret: `PY3EQ1UW6SMST339JP8NG3B5OVTTPJMK`

#### Step 2: Implement OAuth Flow

**Authorization URL:**
```
https://app.clickup.com/api?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}
```

**Token Exchange:**
```bash
curl -X POST 'https://api.clickup.com/api/v2/oauth/token' \
  -H 'Content-Type: application/json' \
  -d '{
    "client_id": "CLIENT_ID",
    "client_secret": "CLIENT_SECRET",
    "code": "AUTHORIZATION_CODE"
  }'
```

**Response:**
```json
{
  "access_token": "pk_xxxxx_yyyyy",
  "token_type": "Bearer"
}
```

#### Step 3: Store Tokens Securely

**Database schema:**
```sql
CREATE TABLE clickup_connections (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  workspace_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  authorized_workspaces JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, workspace_id)
);
```

**Benefits of database storage:**
- ✅ Tokens persist across sessions
- ✅ Support multiple users
- ✅ Track when tokens were created
- ✅ Can revoke by deleting row

---

## Core Capabilities Detailed

### 1. Task Creation

**Pattern:**
```bash
POST /api/v2/list/{list_id}/task
{
  "name": "Task Name",
  "markdown_description": "Description with **formatting**",
  "status": "to do",
  "priority": 3,
  "custom_fields": [
    {"id": "field-id-1", "value": "value1"},
    {"id": "field-id-2", "value": "value2"}
  ]
}
```

**Key points:**
- Use `markdown_description` for formatted text
- Status must exist in list (lookup first)
- Priority: 1=urgent, 2=high, 3=normal, 4=low
- Custom fields require field IDs (not names)

### 2. Subtask Creation

**Pattern:**
```bash
POST /api/v2/list/{list_id}/task
{
  "name": "Subtask Name",
  "parent": "parent_task_id",
  "status": "to do"
}
```

**Critical requirements:**
- Must use parent task's list ID (not a different list)
- Parent and child must be in same list
- Status must be valid in that list
- Use `parent` field to create relationship

**NOT checklists:**
```bash
# WRONG - This creates checkboxes (not subtasks)
POST /api/v2/task/{task_id}/checklist
POST /api/v2/checklist/{id}/checklist_item
```

### 3. Custom Field Management

**Create field on list:**
```bash
POST /api/v2/list/{list_id}/field
{
  "name": "Field Name",
  "type": "short_text"  // or "url", "email", "phone", "date", "drop_down"
}
```

**Field types:**
- `short_text` - Single line text
- `long_text` - Multi-line text
- `url` - Clickable URL
- `email` - Email address
- `phone` - Phone number (format: digits only)
- `date` - Unix timestamp (milliseconds)
- `drop_down` - Dropdown select (requires options)
- `number` - Numeric value
- `checkbox` - Boolean true/false

**Dropdown field with options:**
```bash
POST /api/v2/list/{list_id}/field
{
  "name": "Property Type",
  "type": "drop_down",
  "type_config": {
    "options": [
      {"name": "Retail", "color": "#ff0000"},
      {"name": "Office", "color": "#00ff00"},
      {"name": "Industrial", "color": "#0000ff"}
    ]
  }
}
```

**Set field value:**
- Text fields: `{"id": "field-id", "value": "text"}`
- URL fields: `{"id": "field-id", "value": "https://example.com"}`
- Dropdown: `{"id": "field-id", "value": "option-id"}` (use option ID, not name)
- Date: `{"id": "field-id", "value": 1740700800000}` (Unix timestamp in ms)
- Phone: `{"id": "field-id", "value": "6045551234"}` (digits only, no formatting)

### 4. Status Management

**Get list statuses:**
```bash
GET /api/v2/list/{list_id}
```

**Response includes:**
```json
{
  "statuses": [
    {"status": "to do", "type": "open", "color": "#d3d3d3"},
    {"status": "in progress", "type": "custom", "color": "#1090e0"},
    {"status": "done", "type": "closed", "color": "#6bc950"}
  ]
}
```

**Update task status:**
```bash
PUT /api/v2/task/{task_id}
{
  "status": "in progress"  // Must match exact status name (case-sensitive)
}
```

### 5. Template Usage

**Get template details:**
```bash
GET /api/v2/template/{template_id}
```

**Create task from template:**
```bash
POST /api/v2/list/{list_id}/task
{
  "name": "Task Name",
  "template_id": "t-86b3exqe8"  // Template subtasks auto-applied
}
```

**Copy subtasks from template:**
1. Get template subtasks: `GET /api/v2/task/{template_id}?include_subtasks=true`
2. Create parent task
3. Loop through template subtasks
4. Create each subtask with `parent` field

---

## Pre-Flight Checklist

**Before creating ANY tasks, verify:**

### 1. Workspace Token

```bash
# Which workspace?
echo "Token: ${TOKEN:0:15}..."

# Test workspace access
curl -s "https://api.clickup.com/api/v2/team" \
  -H "Authorization: ${TOKEN}" | jq '.teams[0].name'
```

**Expected:** BC workspace or Valta workspace (confirm with user)
**Warning:** Creating test tasks in production workspace requires cleanup

### 2. Parent Task's List ID

```bash
# Get list ID from parent task (NEVER assume)
LIST_ID=$(curl -s "https://api.clickup.com/api/v2/task/${PARENT_TASK_ID}" \
  -H "Authorization: ${TOKEN}" | jq -r '.list.id')
```

**Why:** Parent and child tasks must be in same list
**Error if wrong:** `"err": "Parent not child of list"`

### 3. Valid Status Name

```bash
# Get available statuses (NEVER assume "to do" exists)
curl -s "https://api.clickup.com/api/v2/list/${LIST_ID}" \
  -H "Authorization: ${TOKEN}" | jq '.statuses[] | .status'
```

**Why:** Each list has custom status names
**Error if wrong:** `"err": "Status not found"`

### 4. User Intent Clarification

**Ask user:**
- Do you want subtasks (real tasks) or checklists (checkboxes)?
- Which workspace (BC test or production)?
- Should I verify before creating (show IDs)?

**Never assume:**
- User wants checklists when they say "subtasks"
- It's safe to create in production workspace
- Default values are correct

---

## Common Patterns & Examples

### Pattern 1: Create Task with All Fields

```bash
#!/bin/bash
TOKEN="your_token"
LIST_ID="list_id"

# Create task
TASK_RESPONSE=$(curl -s -X POST "https://api.clickup.com/api/v2/list/${LIST_ID}/task" \
  -H "Authorization: ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JOB-001 - Property Name, Address",
    "markdown_description": "**CLIENT INFO**\n• Name: John Doe\n• Email: john@example.com",
    "status": "to do",
    "custom_fields": [
      {"id": "field-1", "value": "JOB-001"},
      {"id": "field-2", "value": "https://dashboard.com/job-001"}
    ]
  }')

TASK_ID=$(echo "$TASK_RESPONSE" | jq -r '.id')
echo "Created task: $TASK_ID"
```

### Pattern 2: Add 10 Subtasks

```bash
# Subtask names
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

# Create each subtask
for SUBTASK in "${SUBTASKS[@]}"; do
  curl -s -X POST "https://api.clickup.com/api/v2/list/${LIST_ID}/task" \
    -H "Authorization: ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"${SUBTASK}\", \"parent\": \"${TASK_ID}\", \"status\": \"to do\"}"
  echo "✓ Created: $SUBTASK"
done
```

### Pattern 3: Update Task Description

```bash
# Fetch existing task
EXISTING=$(curl -s "https://api.clickup.com/api/v2/task/${TASK_ID}" \
  -H "Authorization: ${TOKEN}")

CURRENT_DESC=$(echo "$EXISTING" | jq -r '.markdown_description')

# Modify description
NEW_DESC="${CURRENT_DESC}\n\n✅ **SIGNED:** $(date)"

# Update task
curl -s -X PUT "https://api.clickup.com/api/v2/task/${TASK_ID}" \
  -H "Authorization: ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"markdown_description\": \"${NEW_DESC}\"}"
```

### Pattern 4: Workspace Verification

```bash
# Verify before creating tasks
echo "⚠️ WORKSPACE CHECK"
echo "Token: ${TOKEN:0:15}..."
echo "List ID: ${LIST_ID}"
echo ""

# Get workspace name
WORKSPACE=$(curl -s "https://api.clickup.com/api/v2/list/${LIST_ID}" \
  -H "Authorization: ${TOKEN}" | jq -r '.space.name')

echo "Creating tasks in workspace: ${WORKSPACE}"
read -p "Confirm (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Aborted"
  exit 1
fi
```

---

## Error Handling Guide

### Error: "Parent not child of list"

**Cause:** Using wrong list ID for subtask creation
**Fix:** Get parent task's list ID first

```bash
# WRONG - Using random list ID
LIST_ID="901402094744"
curl -X POST "https://api.clickup.com/api/v2/list/${LIST_ID}/task" \
  -d '{"parent": "parent_id", ...}'

# RIGHT - Get parent's list ID
LIST_ID=$(curl -s "https://api.clickup.com/api/v2/task/${PARENT_ID}" \
  -H "Authorization: ${TOKEN}" | jq -r '.list.id')
```

### Error: "Status not found"

**Cause:** Status name doesn't exist in list
**Fix:** Query list for valid statuses

```bash
# Get available statuses
curl -s "https://api.clickup.com/api/v2/list/${LIST_ID}" \
  -H "Authorization: ${TOKEN}" | jq '.statuses[] | .status'

# Use exact status name (case-sensitive)
STATUS="to do"  # or "gen stuff", "Open", etc.
```

### Error: "You do not have access to this Space"

**Cause:** Using wrong workspace token
**Fix:** Use correct token for workspace

```bash
# BC workspace token
TOKEN="pk_10791838_..."

# Valta workspace token
TOKEN="pk_54774263_..."

# Verify access
curl -s "https://api.clickup.com/api/v2/task/${TASK_ID}" \
  -H "Authorization: ${TOKEN}" | jq '.name'
```

### Error: "Value is not a valid phone number"

**Cause:** Phone field has formatting (parentheses, dashes)
**Fix:** Use digits only

```bash
# WRONG
{"id": "phone-field", "value": "(604) 555-1234"}

# RIGHT
{"id": "phone-field", "value": "6045551234"}
```

---

## Quick Reference

### Essential API Endpoints

| Action | Method | Endpoint |
|--------|--------|----------|
| Create task | POST | `/api/v2/list/{list_id}/task` |
| Get task | GET | `/api/v2/task/{task_id}` |
| Update task | PUT | `/api/v2/task/{task_id}` |
| Create field | POST | `/api/v2/list/{list_id}/field` |
| Get list | GET | `/api/v2/list/{list_id}` |
| Get template | GET | `/api/v2/template/{template_id}` |

### Required Values Lookup

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
  -d "{\"name\": \"Subtask\", \"parent\": \"${PARENT_ID}\", \"status\": \"${STATUS}\"}"
```

### Decision Tree

```
User asks to create subtasks
  ↓
1. Confirm: Subtasks (real tasks) or checklists (checkboxes)?
  ↓
2. Get parent task ID from user
  ↓
3. Lookup parent task's list ID (NEVER assume)
  ↓
4. Lookup valid status from list (NEVER assume)
  ↓
5. Verify workspace token (BC test or production?)
  ↓
6. Create subtasks with parent field
  ↓
7. Verify subtask count
```

---

## Domain Expert Behavior

### When Invoked

**The domain expert should:**
1. Identify task type (subtasks vs checklists)
2. Verify workspace before creating anything
3. Lookup required values (never assume)
4. Show pre-flight checks to user
5. Execute with verified values
6. Confirm success with verification

**The domain expert should NOT:**
- Assume default values exist
- Create tasks in production without confirmation
- Use checklists when subtasks are needed
- Skip workspace verification
- Proceed without required lookups

### Response Format

**Good response:**
```
I'll create subtasks in your BC workspace.

Pre-flight checks:
✓ Parent task: 86dz89m0k
✓ List ID: 901709621852 (from parent task)
✓ Valid status: "gen stuff" (from list)
✓ Workspace: BC (safe for testing)

Creating 10 subtasks...
✓ Team Leader (ID: abc123)
✓ 1. Create & Send LOE (ID: def456)
[...]

Complete! View task: https://app.clickup.com/t/86dz89m0k
```

**Bad response:**
```
Creating tasks... [creates in wrong workspace without verification]
```

---

## Domain Knowledge Files

**Location:** `/Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/04-Job & Client Mgt/`

**Files to reference:**
1. `SOP-CREATE-CLICKUP-SUBTASKS.md` - Step-by-step procedures
2. `QUESTIONNAIRE-SUBTASKS-VS-CHECKLISTS.md` - Decision tree
3. `CLICKUP-API-PATTERNS-REFERENCE.md` - Working code examples
4. `LESSONS-LEARNED-CLICKUP-SUBTASKS.md` - Common mistakes
5. `90-SUBTASKS-TEMPLATE-SETUP.md` - Template structure

**Scripts to use:**
1. `scripts/create-tasks-with-subtasks.sh` - Batch creation
2. `scripts/create-complete-test-task.sh` - Demo with all fields

---

## Summary

**This domain expert provides:**
- ✅ Complete ClickUp API knowledge
- ✅ OAuth app setup expertise
- ✅ Subtask vs checklist distinction
- ✅ Pre-flight verification patterns
- ✅ Error handling and troubleshooting
- ✅ Production-ready code examples
- ✅ Workspace safety protocols

**Use this domain for:**
- Creating tasks and subtasks
- Setting up OAuth applications
- Managing custom fields
- Building ClickUp integrations
- Preventing common API mistakes

**Result:** Reliable, production-ready ClickUp integrations that work on first try, every time.

---

**Domain Version:** 1.0
**Last Updated:** January 13, 2026
**Maintained By:** APR Dashboard Team
