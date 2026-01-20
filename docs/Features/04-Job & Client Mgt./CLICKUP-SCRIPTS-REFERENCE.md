# ClickUp Scripts & Tools Reference

Complete inventory of all ClickUp management scripts for task creation, field mapping, and API integration.

**Last Updated**: January 13, 2026

---

## 📚 Table of Contents

1. [CLI Library - Production Scripts](#cli-library---production-scripts)
2. [APR Dashboard Test Scripts](#apr-dashboard-test-scripts)
3. [Integration Utilities](#integration-utilities)
4. [Quick Links](#quick-links)

---

## 🔧 CLI Library - Production Scripts

**Location**: `/Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/`

**46 Production-Ready CLI Scripts** for managing ClickUp via API

### Overview
- Zero startup context cost (scripts load on-demand)
- Direct API access without MCP overhead
- Standalone Python tools for automation
- Reverse-engineered from `@taazkareem/clickup-mcp-server` v0.8.5

### Documentation
- **[Main README](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/README.md)** - Complete usage guide (400+ lines)
- **[Quick Start](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/QUICKSTART.md)** - 2-minute setup guide
- **[Manifest](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/MANIFEST.md)** - File inventory
- **[Completion Report](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/COMPLETION_REPORT.md)** - Project summary & testing

### Script Categories

#### 🏢 Workspace (1 script)
- **[get-workspace-hierarchy.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/get-workspace-hierarchy.py)**
  - Get complete workspace structure (spaces, folders, lists)
  - Essential first step for finding IDs
  - Usage: `./scripts/get-workspace-hierarchy.py`

#### ✅ Task Operations (15 scripts)
- **[create-task.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/create-task.py)** - Create single task
- **[get-task.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/get-task.py)** - Get task details (supports custom IDs)
- **[update-task.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/update-task.py)** - Update task properties
- **[move-task.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/move-task.py)** - Move task to different list
- **[duplicate-task.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/duplicate-task.py)** - Create copy of task
- **[delete-task.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/delete-task.py)** - Permanently delete task
- **[get-task-comments.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/get-task-comments.py)** - Get task comments
- **[create-task-comment.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/create-task-comment.py)** - Add comment to task
- **[attach-task-file.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/attach-task-file.py)** - Attach file to task
- **[get-workspace-tasks.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/get-workspace-tasks.py)** - Search tasks with filters
- **[create-bulk-tasks.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/create-bulk-tasks.py)** - Create multiple tasks
- **[update-bulk-tasks.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/update-bulk-tasks.py)** - Update multiple tasks
- **[move-bulk-tasks.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/move-bulk-tasks.py)** - Move multiple tasks
- **[delete-bulk-tasks.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/delete-bulk-tasks.py)** - Delete multiple tasks
- **[get-workspace-members.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/get-workspace-members.py)** - Get all workspace members

#### ⏱️ Time Tracking (6 scripts)
- **[get-task-time-entries.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/get-task-time-entries.py)** - Get time entries for task
- **[start-time-tracking.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/start-time-tracking.py)** - Start timer on task
- **[stop-time-tracking.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/stop-time-tracking.py)** - Stop running timer
- **[get-current-time-entry.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/get-current-time-entry.py)** - Get currently running timer
- **[add-time-entry.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/add-time-entry.py)** - Add manual time entry
- **[delete-time-entry.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/delete-time-entry.py)** - Delete time entry

#### 📋 List Management (5 scripts)
- **[create-list.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/create-list.py)** - Create list in space
- **[create-list-in-folder.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/create-list-in-folder.py)** - Create list in folder
- **[get-list.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/get-list.py)** - Get list details
- **[update-list.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/update-list.py)** - Update list properties
- **[delete-list.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/delete-list.py)** - Delete list

#### 📁 Folder Management (4 scripts)
- **[create-folder.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/create-folder.py)** - Create folder in space
- **[get-folder.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/get-folder.py)** - Get folder details
- **[update-folder.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/update-folder.py)** - Update folder properties
- **[delete-folder.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/delete-folder.py)** - Delete folder

#### 🏷️ Tag Management (6 scripts)
- **[get-space-tags.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/get-space-tags.py)** - Get all tags in space
- **[create-space-tag.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/create-space-tag.py)** - Create new tag
- **[update-space-tag.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/update-space-tag.py)** - Update tag properties
- **[delete-space-tag.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/delete-space-tag.py)** - Delete tag
- **[add-tag-to-task.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/add-tag-to-task.py)** - Add tag to task
- **[remove-tag-from-task.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/remove-tag-from-task.py)** - Remove tag from task

#### 👥 Member Management (2 scripts)
- **[find-member-by-name.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/find-member-by-name.py)** - Find member by name/email
- **[resolve-assignees.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/resolve-assignees.py)** - Resolve names to user IDs

#### 📄 Document Management (7 scripts)
- **[create-document.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/create-document.py)** - Create document
- **[get-document.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/get-document.py)** - Get document details
- **[list-documents.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/list-documents.py)** - List documents in container
- **[list-document-pages.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/list-document-pages.py)** - List pages in document
- **[get-document-pages.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/get-document-pages.py)** - Get page content
- **[create-document-page.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/create-document-page.py)** - Create new page
- **[update-document-page.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/update-document-page.py)** - Update page content

### Quick Examples

```bash
# Get workspace hierarchy (start here!)
./scripts/get-workspace-hierarchy.py

# Create task with full details
./scripts/create-task.py "🎯 New feature" \
  --list-id "123456789" \
  --markdown-description "## Details\n\nFull description" \
  --priority 1 \
  --tag "urgent"

# Search tasks by tag and status
./scripts/get-workspace-tasks.py --tag "urgent" --status "open"

# Start time tracking
./scripts/start-time-tracking.py "abc123def"

# Bulk operations
./scripts/create-bulk-tasks.py "123456789" '[
  {"name": "Task 1", "priority": 2},
  {"name": "Task 2", "priority": 3}
]'
```

---

## 🧪 APR Dashboard Test Scripts

**Location**: `/Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/04-Job & Client Mgt./test-scripts/`

**Purpose**: Direct API testing for ClickUp integration in APR Dashboard

### Test Scripts

#### ⭐ 01-create-test-task-v2.js (PRIMARY)
**[View File](file:///Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/04-Job & Client Mgt./test-scripts/01-create-test-task-v2.js)**

**Purpose**: Create test task matching Stage 1 format

**Features**:
- Creates task in Ben's test ClickUp (List ID: 901703694310)
- Uses correct format from task spec
- Formatted markdown description (all sections)
- Safe for testing (Development environment only)

**Usage**:
```bash
cd /Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/04-Job\ \&\ Client\ Mgt./test-scripts/
node 01-create-test-task-v2.js
```

**Test Environment**:
- Workspace: 8555561 (BC Workspace)
- List: 901703694310 (Automation Team Board)
- View: https://app.clickup.com/8555561/v/li/901703694310

#### 02-get-clickup-templates.js
**[View File](file:///Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/04-Job & Client Mgt./test-scripts/02-get-clickup-templates.js)**

**Purpose**: List all available templates

**Features**:
- Queries ClickUp API for templates
- Shows template IDs and names
- Useful for verifying template exists

**Usage**:
```bash
node 02-get-clickup-templates.js
```

#### 03-get-template-details.js
**[View File](file:///Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/04-Job & Client Mgt./test-scripts/03-get-template-details.js)**

**Purpose**: Get detailed info about specific template

**Features**:
- Fetches template configuration
- Shows what subtasks template adds
- Displays template properties

**Usage**:
```bash
node 03-get-template-details.js
```

### Documentation
- **[Test Scripts README](file:///Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/04-Job & Client Mgt./test-scripts/README.md)** - Complete testing guide

---

## 🔗 Integration Utilities

**Location**: `/Users/bencrowe/Development/APR-Dashboard-v3/src/utils/webhooks/`

### clickup.ts - Production Integration Module
**[View File](file:///Users/bencrowe/Development/APR-Dashboard-v3/src/utils/webhooks/clickup.ts)**

**Purpose**: TypeScript utilities for APR Dashboard → ClickUp integration

#### Key Functions

##### Task Creation
```typescript
createClickUpTask(job: DetailJob, valcreJobNumber?: string, useTemplate: boolean = true)
```
- Creates ClickUp task from APR job submission
- Supports both test and production environments
- Uses template with subtasks
- Returns task ID and URL

##### Task Updates
```typescript
updateClickUpWithValcreJob(taskId: string, valcreJobNumber: string, valcreJobId?: number)
```
- Updates task when Valcre job is created
- Changes task name from "NEW" to Valcre job number
- Updates description with job booking status
- Marks "Book Job" subtask as complete

##### Status Management
```typescript
updateClickUpTaskStatus(taskId: string, status: string)
```
- Update task status in ClickUp
- Simple status change API wrapper

##### Checklist Management
```typescript
updateClickUpChecklist(taskId: string, checklistItem: string, resolved: boolean)
```
- Mark checklist items as complete/incomplete
- Syncs APR Hub actions with ClickUp workflow
- Finds checklist item by name

```typescript
markLOEPrepComplete(taskId: string)
```
- Mark LOE preparation subtask as complete
- Called when LOE is ready to send

```typescript
markLOESent(taskId: string)
```
- Mark LOE as sent in checklist
- Called when DocuSeal envelope is created

##### Field Discovery
```typescript
getClickUpCustomFields(listId?: string)
```
- Get all custom fields for a list
- Useful for setup and debugging
- Returns field IDs and configurations

#### Configuration

**Environment Variables**:
```typescript
VITE_CLICKUP_API_TOKEN // API token
VITE_CLICKUP_ENV // 'test' or 'production'
VITE_APP_URL // APR Hub URL for task links
```

**Environments**:
```typescript
test: {
  workspaceId: '8555561',      // Ben's BC WorkSpace
  listId: '901703694310',      // Automation Team Board
  templateId: 't-86b3exqe8'    // LOE New Template
}

production: {
  workspaceId: '9014181018',   // Valta workspace
  listId: '901402094744',      // Chris's list
  templateId: 't-86b3exqe8'    // LOE New Template
}
```

#### Field Mapping
```typescript
mapJobToClickUpFields(job: DetailJob)
```
- Simplified field mapping approach
- Minimal custom fields (just essentials)
- Full details accessible via APR Hub link
- Returns array of custom field values

#### Task Format
Tasks created with:
- **Name**: `{ValcreJobNumber} - {PropertyName}, {Address}`
- **Description**: Markdown formatted with:
  - Client information
  - Property details
  - Link to APR Hub
  - Job type and intended use
- **Tags**: `['NEW ARRIVAL', 'APR Hub']`
- **Template**: LOE workflow with subtasks

---

## 🔍 Quick Links

### CLI Library
- [Main Directory](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/)
- [README](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/README.md)
- [Scripts Folder](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/)
- [Quick Start Guide](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/QUICKSTART.md)

### APR Dashboard
- [Test Scripts Folder](file:///Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/04-Job & Client Mgt./test-scripts/)
- [Integration Module](file:///Users/bencrowe/Development/APR-Dashboard-v3/src/utils/webhooks/clickup.ts)
- [Test Scripts README](file:///Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/04-Job & Client Mgt./test-scripts/README.md)

### ClickUp Resources
- [ClickUp API Documentation](https://clickup.com/api)
- [API v2 Base URL](https://api.clickup.com/api/v2)

---

## 📊 Script Inventory Summary

| Category | CLI Scripts | Test Scripts | Integration Utils |
|----------|------------|--------------|-------------------|
| Task Operations | 15 | 1 | 5 functions |
| Time Tracking | 6 | - | - |
| List Management | 5 | - | - |
| Folder Management | 4 | - | - |
| Tag Management | 6 | - | - |
| Member Management | 2 | - | - |
| Document Management | 7 | - | - |
| Workspace | 1 | - | - |
| Templates | - | 2 | - |
| Custom Fields | - | - | 1 function |
| **TOTAL** | **46** | **3** | **6 functions** |

---

## 🎯 Common Use Cases

### Get Started
1. Start with [get-workspace-hierarchy.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/get-workspace-hierarchy.py) to find IDs
2. Use [create-task.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/create-task.py) for basic task creation
3. Use [get-workspace-tasks.py](file:///Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/get-workspace-tasks.py) for searching

### Test APR Integration
1. Run [01-create-test-task-v2.js](file:///Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/04-Job & Client Mgt./test-scripts/01-create-test-task-v2.js) to test task creation
2. Check results in test workspace
3. Verify format matches specifications

### Production Integration
1. Use [clickup.ts](file:///Users/bencrowe/Development/APR-Dashboard-v3/src/utils/webhooks/clickup.ts) functions in APR Dashboard
2. Environment-aware (test vs production)
3. Automatic field mapping and template application

---

**Generated**: January 13, 2026
**Maintained By**: Ben Crowe
**Total Scripts Documented**: 55+ (46 CLI + 3 test + 6 integration functions)
