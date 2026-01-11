# ClickUp 401 Error Fix

**Issue:** ClickUp API returning 401 Unauthorized when creating tasks  
**Date:** January 8, 2026  
**Status:** 🔧 **NEEDS FIX**

---

## 🔍 Problem

When clicking "Create ClickUp Task" button, getting:
```
ClickUp API error: 401
Failed to load resource: the server responded with a status of 400
```

---

## ✅ Root Cause

The Edge Function `create-clickup-task` is deployed to Supabase cloud, but:
1. **Environment variable not set** - `CLICKUP_API_TOKEN` not configured in Supabase Dashboard
2. **OR** - Edge Function needs redeployment with updated fallback token

The code has a fallback token (`pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY`), but if the Edge Function was deployed before this update, it won't have it.

---

## 🔧 Solution Options

### Option 1: Redeploy Edge Function (REQUIRED AFTER SETTING SECRET)

**Important:** After adding a secret in Supabase Dashboard, you MUST redeploy the Edge Function for it to pick up the new secret.

```bash
cd /Users/bencrowe/Development/apr-dashboard-v3
supabase functions deploy create-clickup-task
```

This will redeploy the function and it will pick up the `CLICKUP_API_TOKEN` secret you just added.

---

### Option 2: Set Environment Variable in Supabase Dashboard (ALREADY DONE)

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `ngovnamnjmexdpjtcnky`
3. Navigate to: **Edge Functions** → **Settings** (or **Environment Variables**)
4. Add environment variable:
   - **Name:** `CLICKUP_API_TOKEN`
   - **Value:** `pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY`
5. Save changes
6. Edge Function will automatically use the new env var

**Advantages:**
- ✅ No redeployment needed
- ✅ Token can be updated without code changes
- ✅ More secure (not in code)

---

### Option 2: Redeploy Edge Function

If you prefer to use the fallback token in code:

```bash
cd /Users/bencrowe/Development/apr-dashboard-v3
supabase functions deploy create-clickup-task
```

**Note:** This will deploy the function with the fallback token hardcoded.

---

## 🧪 Verify Fix

After setting the environment variable or redeploying:

1. Go to dashboard: `http://localhost:8086/dashboard`
2. Open job: `/dashboard/job/f8f1106a-e44c-477e-b046-42315ce38d8f`
3. Click "Create ClickUp Task" button
4. Should see success message instead of 401 error

---

## 📋 Edge Functions That Need Token

All these functions use `CLICKUP_API_TOKEN`:
- ✅ `create-clickup-task` - **NEEDS FIX**
- ✅ `update-clickup-task` - May need fix too
- ✅ `get-clickup-task` - May need fix too
- ✅ `docuseal-webhook` - May need fix too

**Recommendation:** Set the environment variable once, all functions will use it.

---

## 🔗 Related

- **ClickUp API Token:** `16-CLICKUP-API-KEY-PROMPT.md`
- **Testing Status:** `19-TESTING-STATUS.md`
