# ClickUp Integration - How It Actually Works

**Last Updated**: September 9, 2025  
**Status**: ✅ WORKING - Manual trigger via button

## Overview

ClickUp tasks are created **manually** when users click the "Create ClickUp Task" button in APR Hub. Tasks automatically include the correct template with 9 subtasks.

## Configuration

### API Settings
- **API Key**: `pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU`
- **Template ID**: `t-86b3exqe8` (LOE New Template 2025.01.09)
- **List ID**: `901402094744` (Valta workspace - production)
- **Test List**: `901703694310` (Ben's workspace - testing)

### Task Template (9 Subtasks)
When a task is created, it automatically includes these subtasks:
1. Create & Send LOE
2. Plan Job
3. Pull (TTSZ)
4. Tour Property
5. Sale and Lease Comps
6. Build Front End
7. Complete Valuation
8. Send to Client
9. Book Job

## Task Creation Workflow

### 1. User Clicks Button
**Location**: Job Details page → Action buttons  
**Component**: `/src/components/dashboard/job-details/actions/ClickUpAction.tsx`

### 2. Edge Function Creates Task
**Function**: `/supabase/functions/create-clickup-task/index.ts`  
**Process**:
```
1. Fetches job details from Supabase
2. Builds task name: "VAL251004 - Property Name, Address"
3. Creates task with template (adds 9 subtasks)
4. Sets priority: Normal (3)
5. Sets status: "To Do"
6. Saves task ID and URL to database
```

### 3. Task Details

**Name Format**: `VAL###### - Property Name, Address`

**Description Includes**:
- Link to APR Hub job
- Client information
- Property details
- Intended use
- Notes

**Priority**: Normal (3) - shows in main task list

### 4. Button Updates
- Changes from "Create ClickUp Task" → "View in ClickUp"
- Purple color indicates task exists
- Clicking opens ClickUp task in new tab

## Database Storage

Task details saved to `job_submissions` table:
- `clickup_task_id`: Task ID from ClickUp
- `clickup_task_url`: Direct link to task

## Testing

### Quick Test
```bash
node _APR-Hub-Master/07-ClickUp-Workflow/test-scripts/test-apr-clickup-integration.js
```

### Manual Test
1. Open any job in APR Hub
2. Click "Create ClickUp Task"
3. Verify task appears in ClickUp with 9 subtasks
4. Button should change to "View in ClickUp"

## Files & Locations

- **Button Component**: `/src/components/dashboard/job-details/actions/ClickUpAction.tsx`
- **Edge Function**: `/supabase/functions/create-clickup-task/index.ts`
- **Test Scripts**: `/_APR-Hub-Master/07-ClickUp-Workflow/test-scripts/`

## Important Notes

- **Manual Only**: Tasks are NOT created automatically (disabled Sept 9, 2025)
- **Template Required**: The template ID adds the 9 subtasks automatically
- **One Task Per Job**: System prevents duplicate tasks for same job

---
*Simple, clean, working. Questions? Check the Edge Function code.*