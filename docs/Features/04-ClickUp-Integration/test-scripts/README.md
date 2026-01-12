# ClickUp Test Scripts

**Purpose**: Direct API testing for ClickUp integration development
**Environment**: Ben's Development ClickUp (safe testing)
**Date**: November 4, 2025

---

## File Overview

### 02-create-test-task-v2.js ⭐ **USE THIS ONE**
**Purpose**: Create test task matching Stage 1 format

**What it does**:
- Creates task in Ben's test ClickUp (901703694310)
- Uses correct format from `03-TASK-FORMAT-VISUAL.md`
- Formatted markdown description (all sections)
- Safe for testing (Development environment only)

**How to run**:
```bash
node 02-create-test-task-v2.js
```

**Output**: Task appears in https://app.clickup.com/8555561/v/li/901703694310

**Reference**: See `TEST-SCRIPT-OUTPUT-v2.md` (in parent folder) for expected output

---

### 03-get-clickup-templates.js
**Purpose**: List all available templates

**What it does**:
- Queries ClickUp API for templates
- Shows template IDs and names
- Useful for verifying template exists

**How to run**:
```bash
node 03-get-clickup-templates.js
```

**Output**: Console list of templates with IDs

---

### 04-get-template-details.js
**Purpose**: Get detailed info about specific template

**What it does**:
- Fetches template configuration
- Shows what subtasks template adds
- Displays template properties

**How to run**:
```bash
node 04-get-template-details.js
```

**Output**: Detailed template structure

---

### 01-create-test-task-OLD.js ❌ **DON'T USE**
**Purpose**: Old version (archived)

**Problems**:
- Uses CAL instead of VAL
- Creates in production (dangerous)
- Outdated format

**Keep for**: Reference only, don't run

---

## Quick Start

### First Time Setup
1. Make sure you're in this directory
2. Verify Node.js is installed: `node --version`

### Create Test Task
```bash
node 02-create-test-task-v2.js
```

### View Results
Open: https://app.clickup.com/8555561/v/li/901703694310

---

## Testing Workflow

### Step 1: Edit Test Data
Open `02-create-test-task-v2.js` and modify lines 13-25:
```javascript
const testJobData = {
  jobId: '550e8400-e29b-41d4-a716-446655440000',
  clientFirstName: 'John',
  clientLastName: 'Smith',
  // ... edit values here
};
```

### Step 2: Run Script
```bash
node 02-create-test-task-v2.js
```

### Step 3: Check ClickUp
Task appears immediately in Ben's test list

### Step 4: Verify Format
Compare to Stage 1 spec in `03-TASK-FORMAT-VISUAL.md`

### Step 5: Iterate
- Adjust data
- Run again
- Verify changes
- Repeat until perfect

### Step 6: Build Form
Once format is dialed in, build form to match this exact structure

---

## Configuration

### Environment: Development (Ben's ClickUp)
```javascript
API Key: pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU
Test List: 901703694310
Workspace: 8555561 (BC Workspace)
```

**Safe**: ✅ Creates in test environment only

---

## What These Scripts Test

### Task Creation
- API authentication works
- Task appears in correct list
- Task name format is correct

### Description Format
- CLIENT INFORMATION section
- PROPERTY INFORMATION section
- SUBMISSION NOTES section
- Markdown formatting
- Separator lines

### Data Mapping
- All fields go to correct locations
- Text formatting is clean
- Links work correctly

### Custom Fields (Future)
- Dashboard Job URL field (when created)
- Clickable button functionality

---

## Expected Output

### Console
```
================================================
   ClickUp Test - Development Environment
================================================

🧪 Creating test task in Ben's test environment...

📤 Creating task in test list...

✅ Task created successfully!
Task ID: abc123xyz
Task Name: NEW SUBMISSION - Sparwood McDonalds, 2100 Middletown Place, Sparwood, BC T1K 2L3
URL: https://app.clickup.com/t/abc123xyz

📋 Check Ben's test list: https://app.clickup.com/8555561/v/li/901703694310
```

### In ClickUp
Task with:
- Name: "NEW SUBMISSION - {Property}, {Address}"
- Description: Formatted markdown with all sections
- Status: To Do
- Priority: Normal (3)

---

## Troubleshooting

### Error: "Token invalid"
Check API key in script matches Ben's Dev key

### Error: "List not found"
Verify List ID is `901703694310`

### Task not appearing
Refresh ClickUp or check correct workspace (8555561)

### Import error
Make sure you're using Node.js with ES module support

---

## Related Documentation

**Output Reference**: `../TEST-SCRIPT-OUTPUT-v2.md`
**Format Spec**: `../03-TASK-FORMAT-VISUAL.md`
**Environment Config**: `../00-ENVIRONMENT-CONFIG.md`
**API Reference**: `../00-CLICKUP-API-REFERENCE.md`

---

**Last Updated**: November 4, 2025
**Maintained By**: Ben Crowe
