# ClickUp List ID Fix

**Issue:** Tasks being created in wrong/non-existent ClickUp list  
**Date:** January 8, 2026  
**Status:** ✅ **FIXED**

---

## 🔍 Problem

The Edge Function was using List ID `901703694310` which returns:
```json
{"err":"Not found","ECODE":"SHARD_006"}
```

This list doesn't exist or is inaccessible.

---

## ✅ Solution

Updated the Edge Function to use the correct List ID: `901706896375`

**List Details:**
- **Name:** "New Submission"
- **Space:** "Dev.Projects"
- **Workspace:** BC Workspace (8555561)
- **Status:** ✅ Exists and accessible

---

## 📋 Changes Made

**File:** `supabase/functions/create-clickup-task/index.ts`

**Before:**
```typescript
const CLICKUP_LIST_ID = Deno.env.get('CLICKUP_LIST_ID') || '901703694310' // Ben's test list in BC Workspace
```

**After:**
```typescript
const CLICKUP_LIST_ID = Deno.env.get('CLICKUP_LIST_ID') || '901706896375' // New Submission - BC Workspace (Dev.Projects)
```

---

## 🧪 Verification

**Test List ID:**
```bash
curl -H "Authorization: pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY" \
  "https://api.clickup.com/api/v2/list/901706896375"
```

**Result:** ✅ Returns list details successfully

---

## 🚀 Next Steps

1. ✅ Edge Function updated with correct List ID
2. ✅ Function redeployed
3. ⏳ **Test:** Click "Create ClickUp Task" button - should now create task in "New Submission" list

---

## 📍 Where Tasks Are Created

**ClickUp Location:**
- **Workspace:** BC Workspace (Development)
- **Space:** Dev.Projects
- **List:** New Submission
- **List ID:** `901706896375`

**To View:**
1. Go to ClickUp: https://app.clickup.com
2. Navigate to: BC Workspace → Dev.Projects → New Submission
3. Tasks should appear here

---

## 🔗 Related

- **ClickUp API Setup:** `16-CLICKUP-API-KEY-PROMPT.md`
- **401 Error Fix:** `21-CLICKUP-401-FIX.md`
- **Testing Status:** `19-TESTING-STATUS.md`
