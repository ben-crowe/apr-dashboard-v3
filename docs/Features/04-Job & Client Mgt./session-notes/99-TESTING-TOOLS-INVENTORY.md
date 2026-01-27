# Testing Tools Inventory - LOE E2E Workflow

**Date:** 2026-01-23
**Status:** READY FOR TESTING
**Purpose:** Complete inventory of testing tools, scripts, and integration status

---

## What's In Cognee vs What Exists

### Files NOT in Cognee (Should Be)

| File | Content | Value |
|------|---------|-------|
| **12-EMAIL-CHECKING-SETUP.md** | Gmail API setup for bc@crowestudio.com, Resend API verification | High - Email workflow knowledge |
| **39-GMAIL-API-SETUP.md** | Complete Gmail OAuth setup, Python/TS scripts, search syntax | High - Email CLI details |
| **00-CLICKUP-API-REFERENCE.md** | Full ClickUp API reference with curl examples, credentials (both workspaces) | Critical - Production API patterns |
| **DOMAIN-CLICKUP-EXPERT.md** | Comprehensive ClickUp domain knowledge (OAuth, subtasks vs checklists, pre-flight checks) | Critical - Expert-level patterns |
| **95-CLICKUP-DOMAIN-EXPERT-SUMMARY.md** | The mastered "3 lookups + 1 API call" pattern | High - Core pattern |
| **SOP-CREATE-CLICKUP-SUBTASKS.md** | Step-by-step procedure for subtasks | High - SOP |
| **CLICKUP-SCRIPTS-REFERENCE.md** | 46 CLI scripts inventory, test scripts, integration utilities | Critical - Tool inventory |
| **Client-Email-Sequence/README.md** | Email automation workflow (LOE → signature → payment) | High - Workflow spec |

---

## Script Locations

### Gmail/Email Scripts

| Script | Location | Purpose |
|--------|----------|---------|
| Label Manager | `/Users/bencrowe/Development/02-Project-Planning/EPA BC-Support system/src/support-system/01-Label-Manager/` | Existing OAuth setup |
| Python Email Checker | `/Users/bencrowe/Development/APR-Dashboard-v3/scripts/check-bc-email.py` | Check bc@crowestudio.com inbox |
| TypeScript Wrapper | `/Users/bencrowe/Development/APR-Dashboard-v3/scripts/check-bc-email.ts` | TS version of checker |
| Auth Setup | `/Users/bencrowe/Development/APR-Dashboard-v3/scripts/setup-bc-email-auth.sh` | Setup script |

### ClickUp CLI Library

**Location:** `/Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/`

**46 Production-Ready Scripts:**

| Category | Count | Key Scripts |
|----------|-------|-------------|
| Task Operations | 15 | create-task.py, get-task.py, update-task.py |
| Time Tracking | 6 | start-time-tracking.py, stop-time-tracking.py |
| List Management | 5 | create-list.py, get-list.py |
| Folder Management | 4 | create-folder.py, get-folder.py |
| Tag Management | 6 | get-space-tags.py, add-tag-to-task.py |
| Member Management | 2 | find-member-by-name.py |
| Document Management | 7 | create-document.py, get-document.py |
| Workspace | 1 | get-workspace-hierarchy.py |

---

## Integration Status

| Integration | Status | Details | Needed for Production |
|-------------|--------|---------|----------------------|
| ClickUp BC Workspace | WORKING | Dev testing, List ID: 901706896375 | Already working |
| ClickUp Valta Workspace | PARTIAL | Edge Functions use dev creds | Add env var support |
| Resend Sandbox | WORKING | Sends to admin@valta.ca | - |
| Resend valta.ca | NOT DONE | Domain not verified | Verify domain |
| DocuSeal | WORKING | LOE generation + signing | Already working |
| Email Checker | WORKING | bc@crowestudio.com OAuth | Already working |

---

## Files for Cognee Ingestion (Priority)

### Priority 1 (Critical)
1. `DOMAIN-CLICKUP-EXPERT.md` - Complete ClickUp expertise
2. `00-CLICKUP-API-REFERENCE.md` - API credentials and patterns
3. `39-GMAIL-API-SETUP.md` - Email CLI setup

### Priority 2 (High)
4. `SOP-CREATE-CLICKUP-SUBTASKS.md` - Core SOP
5. `CLICKUP-SCRIPTS-REFERENCE.md` - Tool inventory
6. `Client-Email-Sequence/README.md` - Email workflow

---

## Testing Quick Start

### Test ClickUp Task Creation
```bash
cd /Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli
./scripts/create-task.py "Test Task" --list-id 901706896375
```

### Test Email Checker
```bash
cd /Users/bencrowe/Development/APR-Dashboard-v3
python3 scripts/check-bc-email.py
```

### Test DocuSeal
- Use dashboard: `http://localhost:8086/dashboard`
- Open any job → Generate LOE → Send for signature

---

## Edge Functions Needing Update for Production

| Function | Current State | Fix Required |
|----------|---------------|--------------|
| `create-clickup-task` | Uses CLICKUP_API_TOKEN (dev) | Add CLICKUP_API_TOKEN_VALTA |
| `update-clickup-task` | Uses CLICKUP_API_TOKEN (dev) | Add CLICKUP_API_TOKEN_VALTA |
| `send-loe-email-fixed` | Uses onboarding@resend.dev | Change to noreply@valta.ca |

---

**Last Updated:** 2026-01-23
**Session:** LOE E2E Testing Prep
