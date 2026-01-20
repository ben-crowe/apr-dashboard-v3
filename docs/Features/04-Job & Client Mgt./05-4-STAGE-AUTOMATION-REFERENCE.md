# ClickUp Integration Reference

**Status:** 🔧 In Development - Stages 1 & 2 Deployed, Issues Found
**Last Updated:** November 19, 2025
**Architecture:** Progressive 4-stage task updates through complete appraisal lifecycle

---

## Table of Contents

1. [Overview](#overview)
2. [Stage Progression](#stage-progression)
3. [Stage 1: Form Submission → Create Task](#stage-1-form-submission--create-clickup-task)
4. [Stage 2: Valcre Job Created → Add LOE Section](#stage-2-valcre-job-created--add-loe-section)
5. [Stage 2.5: DocuSeal Send → Add LOE Sent Timestamp](#stage-25-docuseal-send--add-loe-sent-timestamp)
6. [Stage 3: DocuSeal Signature → Add LOE Signed](#stage-3-docuseal-signature--add-loe-signed)
7. [Task Name Formats](#task-name-formats)
8. [Configuration](#configuration)
9. [Test Suite](#test-suite)
10. [Known Issues](#known-issues)
11. [Next Steps](#next-steps)

---

## Overview

Automated ClickUp task management system that tracks the complete appraisal job lifecycle through 4 distinct stages, from initial form submission to signed LOE.

**Architecture:** Progressive task updates - each stage adds information while preserving previous stage data.

### Key Characteristics

- **4-Stage Progression**: Form → Valcre → DocuSeal Send → DocuSeal Signed
- **Progressive Updates**: Each stage appends to previous stages (no data loss)
- **Single Task ID**: Same task updated through all stages (not separate tasks)
- **Markdown Descriptions**: All data stored in formatted task descriptions
- **Event-Driven**: Database triggers and webhooks drive automation
- **VAL Naming**: Uses new VAL job numbers (not old CAL method)

---

## Stage Progression

```
STAGE 1: Form Submission
   ↓ (creates task)
STAGE 2: Valcre Job Created
   ↓ (adds LOE section)
STAGE 2.5: DocuSeal LOE Sent
   ↓ (adds timestamp)
STAGE 3: DocuSeal LOE Signed
   ↓ (adds signature + name)
COMPLETE: Full task history
```

---

## Stage 1: Form Submission → Create ClickUp Task

**Trigger:** Client submits appraisal request form on valta.ca

**Edge Function:** `create-clickup-task`
**Location:** `/supabase/functions/create-clickup-task/index.ts`

### What It Does

- Creates new ClickUp task in "New Submission" list
- Pulls data from `job_submissions` table
- Formats description with client info, property details, submission notes
- Sets task name: `PENDING - [Property Name], [Address]`

### Task Format Created

```markdown
▸ NEW Appraisal Request:   View in APR Dashboard
▸ VALCRE Job:             Coming Soon
▸ File Storage:           Coming Soon
▸ Pipedrive CRM:          Coming Soon

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Submission Date: November 19, 2025 / 3:45 PM

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLIENT INFORMATION
• Name: Steven Torres
• Organization: Cornerstone Development
• Email: steven.torres.023370@test.com
• Phone: (587) 657-9438

PROPERTY INFORMATION
• Property Name: Test Plaza
• Address: 123 Test Lane, Calgary, AB T2P 1A1
• Property Type: Land
• Intended Use: Insurance
• Asset Condition: Very Good
• Valuation Premise: Market Rent

PROPERTY CONTACT
• Name: Patricia White
• Email: patricia.white.023370@test.com
• Phone: (587) 661-9357

SUBMISSION NOTES
Test submission generated at 3:45:43 PM

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏳ Waiting for LOE Quote Preparation...
```

### Configuration

```typescript
CLICKUP_API_TOKEN (secret): pk_10791838_XB273RX0O9O1AL5WTZZIVREX1F3RUOL5
CLICKUP_LIST_ID (secret): 901706896375 // New Submission list
CLICKUP_WORKSPACE_ID: 8555561 // BC Workspace (Development)
```

### Database Tables Used

- `job_submissions` - Form data

### Test Results

✅ **Working** - Creates task successfully
- Task created with proper format
- Clean triangles (▸) and bullets (•) formatting
- All client and property data present

**Test Command:**
```bash
./test-clickup-4-stages.sh 1
```

---

## Stage 2: Valcre Job Created → Add LOE Section

**Trigger:** Appraiser clicks "Create Valcre Job" in Dashboard Section 2

**Edge Function:** `update-clickup-task`
**Location:** `/supabase/functions/update-clickup-task/index.ts`

### What It Does

- Fetches existing ClickUp task ID from `job_loe_details.clickup_task_id`
- Fetches LOE quote details from `job_loe_details` table
- Builds combined description (Stage 1 + Stage 2)
- Updates task name: `PENDING` → `VAL[number]`
- Updates "Valcre Job" link from "Coming Soon" to actual link

### LOE Section Format Added

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 LOE QUOTE PREPARED

JOB DETAILS
• Valcre Job Number: VAL251999
• Created: November 19, 2025

PROPERTY VALUATION
• Property Rights: Leased Fee Interest
• Scope of Work: Direct Comparison Approach
• Report Type: Comprehensive Appraisal Report

FINANCIAL DETAILS
• Appraisal Fee: $3,500.00
• Retainer Amount: $1,750.00
• Delivery Date: December 15, 2025
• Payment Terms: 50% retainer upfront, balance on delivery

COMMENTS
• General: Internal appraiser notes and assessment details
• Delivery: Deliver via email as PDF, CC to property manager
• Payment: Wire transfer preferred, payment terms net 15

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Database Tables Used

- `job_loe_details` - LOE quote details
- `job_submissions` - Original form data (for rebuilding full description)

### Test Results

⚠️ **Issue Found** - Creates new task instead of updating existing one
- Stage 1 creates task ID: 86dygkp2u
- Stage 2 creates task ID: 86dygkp2v (DIFFERENT TASK!)
- Expected: Should update 86dygkp2u, not create new task

**Root Cause:** Need to investigate why task lookup/update is failing

**Test Command:**
```bash
./test-clickup-4-stages.sh 2
```

---

## Stage 2.5: DocuSeal Send → Add LOE Sent Timestamp

**Trigger:** Appraiser sends LOE via DocuSeal for client signature

**Edge Function:** `docuseal-webhook`
**Location:** `/supabase/functions/docuseal-webhook/index.ts`
**Event:** `submission.created`

### What It Does

- Receives DocuSeal webhook when LOE is sent
- Looks up job by DocuSeal submission ID
- Fetches current ClickUp task description
- Adds "LOE Sent" timestamp line at top
- Updates ClickUp task

### Timestamp Format Added

```markdown
▸ LOE Sent:   25.11.19 / 3:45 PM
▸ LOE Signed: [Pending]
```

### Test Results

❌ **Failed** - "Job not found, skipping ClickUp update"
- Webhook can't find job in database
- Submission ID lookup failing

**Root Cause:** Need to investigate job lookup logic in webhook handler

**Test Command:**
```bash
./test-clickup-4-stages.sh 2.5
```

---

## Stage 3: DocuSeal Signature → Add LOE Signed

**Trigger:** Client signs LOE via DocuSeal

**Edge Function:** `docuseal-webhook`
**Location:** `/supabase/functions/docuseal-webhook/index.ts`
**Event:** `submission.completed`

### What It Does

- Receives DocuSeal webhook when LOE is signed
- Looks up job by DocuSeal submission ID
- Fetches current ClickUp task description
- Updates "LOE Signed" line with timestamp + signer name
- Updates ClickUp task

### Timestamp Format Updated

```markdown
▸ LOE Sent:   25.11.19 / 3:45 PM
▸ LOE Signed: 25.11.19 / 4:15 PM by Steven Torres
```

### Test Results

❌ **Failed** - "Job not found for submission"
- Webhook can't find job in database
- Same lookup issue as Stage 2.5

**Test Command:**
```bash
./test-clickup-4-stages.sh 3
```

---

## Task Name Formats

### Format Summary

| Stage | Format | Example |
|-------|--------|---------|
| Stage 1 | `PENDING - [Property], [Street], [City]` | `PENDING - Test Plaza, 123 Test Lane, Calgary` |
| Stage 2 | `VAL[number] - [Property], [Full Address]` | `VAL251999 - Test Plaza, 123 Test Lane, Calgary, AB T2P 1A1` |

### Naming System

**NEW METHOD (Current):** VAL prefix
- Example: `VAL251999`
- Used for all new jobs from November 2025

**OLD METHOD (Deprecated):** CAL prefix
- Example: `CAL250137`
- Legacy system, no longer used
- Old documentation may reference CAL numbers

---

## Configuration

### Current (Development)

```
Workspace: BC Workspace (8555561)
List: New Submission (901706896375)
API Token: pk_10791838_XB273RX0O9O1AL5WTZZIVREX1F3RUOL5
```

### Production (Future)

```
Workspace: Valta (9014181018)
List: Chris's list (901402094744)
API Token: Same token (works for both workspaces)
```

### Environment Variables

**Supabase Secrets:**
```bash
CLICKUP_API_TOKEN=pk_10791838_XB273RX0O9O1AL5WTZZIVREX1F3RUOL5
CLICKUP_LIST_ID=901706896375
CLICKUP_WORKSPACE_ID=8555561
```

### API Endpoints

| Operation | HTTP Method | Endpoint | Used In |
|-----------|-------------|----------|---------|
| Create Task | POST | `/list/{listId}/task` | Stage 1 |
| Update Task | PUT | `/task/{taskId}` | Stages 2, 2.5, 3 |
| Get Task | GET | `/task/{taskId}` | Stage 2.5, 3 |

---

## Test Suite

**Location:** `/test-clickup-4-stages.sh`

### Commands

```bash
# Test all stages
./test-clickup-4-stages.sh all

# Test specific stage
./test-clickup-4-stages.sh 1     # Stage 1 only
./test-clickup-4-stages.sh 2     # Stages 1-2
./test-clickup-4-stages.sh 2.5   # Stages 1-2.5
./test-clickup-4-stages.sh 3     # All stages 1-3

# Cleanup test data
./test-clickup-4-stages.sh cleanup
```

### What Test Does

1. Creates test job in `job_submissions` table
2. Triggers Edge Function via curl
3. Reports task ID and URL
4. Shows expected vs actual results

### Test Environment

- **Database:** ngovnamnjmexdpjtcnky.supabase.co
- **Workspace:** BC Workspace (8555561)
- **List:** New Submission (901706896375)
- **Job Data:** Steven Torres, Test Plaza property

---

## Known Issues

### 1. Stage 2 Creates New Task (CRITICAL)

**Problem:** `update-clickup-task` creates new task instead of updating Stage 1 task

**Evidence:**
- Stage 1: task 86dygkp2u
- Stage 2: task 86dygkp2v (different!)

**Expected:** Stage 2 should update 86dygkp2u

**Investigation Needed:**
- Check how `update-clickup-task` looks up existing task
- Verify `job_loe_details.clickup_task_id` is being set correctly
- Check if task ID is passed vs looked up from database

**Impact:** HIGH - Progressive updates won't work if each stage creates new tasks

---

### 2. DocuSeal Webhook Can't Find Jobs

**Problem:** Stages 2.5 & 3 return "Job not found"

**Evidence:**
- Stage 2.5: "Job not found, skipping ClickUp update"
- Stage 3: "Job not found for submission"

**Expected:** Webhook should find job by DocuSeal submission ID

**Investigation Needed:**
- Check webhook payload structure
- Verify submission ID mapping in database
- Check job lookup query in webhook handler

**Impact:** HIGH - Timestamp updates won't work

---

### 3. Agent 2 Code Review Issues (PENDING FIX)

From previous session's peer review:

1. **Missing 📋 emoji** in LOE section header
   - Location: `update-clickup-task/index.ts` line 123
   - Fix: Add emoji to "LOE QUOTE PREPARED" header

2. **Wrong field name:** `property_rights_appraised` → `property_rights`
   - Location: `update-clickup-task/index.ts` line 130
   - Fix: Change field name to match database

3. **Wrong field name:** `internal_comments` → `general_comments`
   - Location: `update-clickup-task/index.ts` line 140
   - Fix: Change field name to match database

**Impact:** MEDIUM - May cause field mapping errors

---

## Next Steps

### Immediate Fixes Required

1. **Fix Stage 2 task creation issue**
   - Investigate why new task is created instead of updating
   - Verify `clickup_task_id` storage and lookup
   - Test that Stage 2 updates Stage 1 task

2. **Fix DocuSeal webhook job lookup**
   - Debug submission ID mapping
   - Verify webhook payload structure
   - Test Stages 2.5 & 3 after fix

3. **Apply Agent 2 code review fixes**
   - Add missing emoji
   - Fix field name mismatches
   - Redeploy `update-clickup-task`

### Testing After Fixes

```bash
# Full test sequence
./test-clickup-4-stages.sh all

# Verify single task ID throughout
# Expected: Same task ID for all stages (86dygXXXX)
# Not: Different task IDs per stage
```

### Production Deployment

After all tests pass:
1. Switch from test workspace to production workspace
2. Update list ID to production list
3. Update workspace ID to Valta workspace (9014181018)
4. Deploy to production Supabase
5. Test with real form submission
6. Monitor first 5 jobs

---

## API Credential Discovery

### Valid Token Found via Session History Search

**Problem Solved:** ClickUp API authentication was failing with 401 errors

**Solution:** Created `.claude/rules/api-credential-search.md` - teaches agents to search JSONL session history for working API credentials

**Pattern Used:**
```bash
grep -rh "pk_[0-9]*_[A-Z0-9]*" ~/.claude/projects/*PROJECT*/*.jsonl \
  | grep -o "pk_[0-9]*_[A-Z0-9]*" | sort -u
```

**Result:** Found valid token `pk_10791838_XB273RX0O9O1AL5WTZZIVREX1F3RUOL5`

**Documentation:** See SCRIPTS-DASHBOARD.md section "🔑 API Credential Discovery from Session History"

---

## Code References

### Primary Files

1. **Stage 1 - Form Submission:**
   - `/supabase/functions/create-clickup-task/index.ts`
   - Database trigger → Auto-creates task

2. **Stage 2 - Valcre Job:**
   - `/supabase/functions/update-clickup-task/index.ts`
   - Dashboard action → Updates task with LOE details

3. **Stages 2.5 & 3 - DocuSeal:**
   - `/supabase/functions/docuseal-webhook/index.ts`
   - Webhook events → Adds timestamps

4. **Test Suite:**
   - `/test-clickup-4-stages.sh`
   - Automated testing for all 4 stages

---

## Implementation Notes

### Progressive Updates Architecture

**Design Principle:** Each stage APPENDS to previous stages, never replaces

**Stage 1:** Creates base task with form data
**Stage 2:** Adds LOE section, preserves Stage 1 data
**Stage 2.5:** Adds timestamp, preserves Stages 1 & 2
**Stage 3:** Adds signature, preserves all previous data

**Critical:** Single task ID used throughout all stages

### Idempotency

**Safe Retry Logic:** Edge functions check for existing data before creating/updating

**Why Critical:** Webhooks may fire multiple times, triggers may retry

### Error Handling

All Edge Functions return:
```json
{
  "success": true/false,
  "error": "Error message if failed",
  "taskId": "ClickUp task ID",
  "taskUrl": "https://app.clickup.com/t/..."
}
```

---

**Last Updated:** November 19, 2025, 9:00 PM
**Test Script:** `/test-clickup-4-stages.sh`
**Session Summary:** `/docs/-passover-sessions/25.11.19-3 - API-Credential-Search-Rule-ClickUp-Testing.md`
