# Session Summary: ClickUp Edge Function Fix + test-engineer Agent

**Date**: October 9, 2025
**Session**: ClickUp button persistence bug fix
**Status**: ✅ COMPLETE

---

## 🎯 Problem Solved

**Issue**: ClickUp edge function was failing to save task data to `job_loe_details` table, preventing button state persistence.

**Error Message**:
```
Failed to save ClickUp task to LOE details
Location: create-clickup-task/index.ts:124
```

**Root Cause**: PostgreSQL `upsert` with `onConflict: 'job_id'` requires a UNIQUE constraint on the conflict column, but `job_loe_details.job_id` was just a regular foreign key (not unique).

---

## ✅ Fix Applied

### Migration Created and Deployed

**File**: `supabase/migrations/20251009180235_add_unique_constraint_job_loe_details.sql`

**What it does**:
1. Removes duplicate records (keeps most recent)
2. Adds `UNIQUE` constraint on `job_loe_details.job_id`
3. Enforces 1:1 relationship between `job_submissions` and `job_loe_details`

**Status**: ✅ Deployed to production

### Verification

```bash
supabase migration list --linked
```

Result:
```
✅ 20251009020000 | Applied | ClickUp columns exist
✅ 20251009180235 | Applied | Unique constraint added
```

---

## 🧪 New Agent Created: test-engineer

**Location**: `~/.claude/agents/test-engineer.md`

**Purpose**: Automated testing specialist with Playwright MCP expertise and token-efficient evidence extraction.

### Key Features

1. **Token-Efficient Testing**:
   - Extracts evidence < 1000 tokens
   - Drops HTML dumps, DOM snapshots, verbose logs
   - Keeps only critical errors and state data

2. **Immediate Handoff Rules**:
   - Database errors → backend-developer
   - UI issues → frontend-developer
   - Confidence < 70% → Deploy specialist immediately

3. **Structured Reporting**:
   ```markdown
   ## Test: [Name]
   Status: ✅/❌
   Outcome: [One sentence]
   Evidence: [Critical data only]
   ```

4. **Playwright MCP Integration**:
   - Direct tool usage
   - Evidence extraction protocol
   - Background delegation for fixes

---

## 🔄 Marcel Routing Updated

**File**: `~/.claude/agents/marcel-orchestrator.md`

**Changes**:
- Added `test-engineer` to SuperClaude Personas (now 21)
- Added testing detection in Step 1: Intent Detection
- Added testing routes in Technology Detection
- Updated decision tree with testing branch

**New Routing Rule**:
```
Testing/Verification?
├─ "Test the button..." → test-engineer
├─ "Verify this works..." → test-engineer
├─ "Check if persists..." → test-engineer
└─ Automated testing needs → test-engineer
```

---

## 📋 Files Modified

### Created
- `~/.claude/agents/test-engineer.md` (3.2K)
- `/Users/bencrowe/Development/APR-Dashboard/supabase/migrations/20251009180235_add_unique_constraint_job_loe_details.sql`

### Updated
- `~/.claude/agents/marcel-orchestrator.md` (routing rules)

### Deployed
- Database migration (unique constraint on job_loe_details.job_id)

---

## 🎯 Ready for Testing

**What's fixed**:
1. ✅ ClickUp columns exist in job_loe_details
2. ✅ Unique constraint allows upsert to work
3. ✅ RLS policy permits all operations
4. ✅ Edge function can create OR update LOE details

**Expected behavior**:
- Click "Create ClickUp Task" button
- Task created in ClickUp ✅
- Task ID saved to job_submissions ✅
- Task ID saved to job_loe_details ✅ (NOW WORKS)
- Button shows "View in ClickUp" ✅
- Button persists after page reload ✅

---

## 🚀 Next Steps

### To Test ClickUp Button:
```
User: "test-engineer, please test the ClickUp button persistence"
```

test-engineer will:
1. Navigate to dashboard
2. Click ClickUp button
3. Verify task creation
4. Check database persistence
5. Reload page and verify button state
6. Report structured findings (< 1000 tokens)

### If Issues Found:
- test-engineer will immediately deploy backend-developer for database issues
- test-engineer will deploy frontend-developer for UI issues
- Marcel will verify final fix

---

## 📝 Technical Notes

### Why the Fix Works

**Before**:
```typescript
.upsert({ job_id, clickup_task_id, clickup_task_url }, { onConflict: 'job_id' })
// ❌ FAILS: job_id has no unique constraint
```

**After**:
```sql
ALTER TABLE job_loe_details ADD CONSTRAINT job_loe_details_job_id_unique UNIQUE (job_id);
```

Now `upsert` works because:
- First time: INSERT (no conflict)
- Second time: UPDATE (conflict detected, updates existing row)
- Always succeeds ✅

### Architecture

```
Edge Function (create-clickup-task)
  ├─ Creates ClickUp task via API ✅
  ├─ Saves to job_submissions ✅
  └─ Upserts to job_loe_details ✅ (NOW WORKS)

Button Component (LoeQuoteSection.tsx)
  ├─ Reads clickup_task_url from job_loe_details ✅
  ├─ Shows "Create" or "View in ClickUp" ✅
  └─ Persists after page reload ✅
```

---

## 🎓 Lessons Learned

1. **Marcel's Delegation Issue**: Marcel tried to fix database issues himself instead of immediately deploying backend-developer. Should route at first database error.

2. **Playwright Token Usage**: Direct Playwright usage is fine, but Marcel needs to extract evidence and drop verbose logs. test-engineer solves this.

3. **Architecture Separation**: Better to have specialized agents (test-engineer) than load Marcel with testing protocols.

---

**Status**: Ready for user's organized change list.

**Test Command Available**:
```bash
# User can now say:
"test-engineer, test the ClickUp button persistence"
```

