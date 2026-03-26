# ClickUp 401 Error - Comprehensive Debugging & Fix Plan

**Date:** January 27, 2026  
**Status:** 🔴 CRITICAL - Blocking Production  
**Issue:** ClickUp API returning 401 Unauthorized after removing OAuth

---

## Problem Summary

**Symptoms:**
- Valcre job creation works ✅ (VAL261101 created successfully)
- ClickUp task creation fails with 401 ❌
- Edge Function logs show token is set but API returns 401
- Token works when tested directly with curl ✅

**Error Pattern:**
```
Failed to create ClickUp task: ClickUp API error: 401
Edge Function returned a non-2xx status code
```

---

## Root Cause Analysis

### Potential Issues

1. **Token Format** - ClickUp API requires token WITHOUT "Bearer" prefix
2. **Token Validity** - Token might be expired or invalid
3. **Workspace Access** - Token might not have access to Valta workspace (9014181018)
4. **List Access** - Token might not have access to list (901402094744)
5. **Environment Variable** - Edge Function might not be reading env var correctly

### Current Code Analysis

**Line 232 in create-clickup-task/index.ts:**
```typescript
'Authorization': CLICKUP_API_TOKEN,  // ✅ Correct - no "Bearer" prefix
```

**Token Source (Line 84-88):**
```typescript
const envToken = CLICKUP_ENV === 'production' 
  ? Deno.env.get('CLICKUP_API_TOKEN_VALTA')
  : Deno.env.get('CLICKUP_API_TOKEN') || 'pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY'
```

**Current Token Set:**
- `CLICKUP_API_TOKEN_VALTA=pk_10791838_YH555EZC464CNCRYESM1AKNVA77G6K3J`
- `CLICKUP_ENV=production`

---

## Test Plan

### Phase 1: Verify Token Validity ✅

**Test 1.1: Direct API Call with Token**
```bash
curl -X GET "https://api.clickup.com/api/v2/user" \
  -H "Authorization: pk_10791838_YH555EZC464CNCRYESM1AKNVA77G6K3J"
```

**Expected:** User info returned  
**If fails:** Token is invalid/expired → Need new token

**Test 1.2: Verify Workspace Access**
```bash
curl -X GET "https://api.clickup.com/api/v2/team/9014181018" \
  -H "Authorization: pk_10791838_YH555EZC464CNCRYESM1AKNVA77G6K3J"
```

**Expected:** Workspace info returned  
**If fails:** Token doesn't have access to Valta workspace

**Test 1.3: Verify List Access**
```bash
curl -X GET "https://api.clickup.com/api/v2/list/901402094744" \
  -H "Authorization: pk_10791838_YH555EZC464CNCRYESM1AKNVA77G6K3J"
```

**Expected:** List info returned  
**If fails:** Token doesn't have access to list

---

### Phase 2: Edge Function Debugging ✅

**Test 2.1: Check Environment Variables**
```bash
# Call test-env function
curl -X POST "https://ngovnamnjmexdpjtcnky.supabase.co/functions/v1/test-env" \
  -H "Authorization: Bearer [ANON_KEY]"
```

**Expected:** Shows `valtaTokenSet: true` and token prefix

**Test 2.2: Test Edge Function with Logging**
- Deploy function with enhanced logging
- Call function with test job
- Check Supabase logs for:
  - Token prefix
  - Token length
  - Environment detection
  - API call details

**Test 2.3: Direct Edge Function Call**
```bash
curl -X POST "https://ngovnamnjmexdpjtcnky.supabase.co/functions/v1/create-clickup-task" \
  -H "Authorization: Bearer [ANON_KEY]" \
  -H "Content-Type: application/json" \
  -d '{"jobId": "[TEST_JOB_ID]"}'
```

**Check logs for:**
- Token being used
- API endpoint called
- Response status
- Error message

---

### Phase 3: Fix Implementation ✅

**Fix 1: Verify Token Format**
- Ensure token is passed directly (no "Bearer" prefix) ✅ Already correct
- Verify token doesn't have extra whitespace
- Verify token is complete (not truncated)

**Fix 2: Verify Environment Detection**
- Ensure `CLICKUP_ENV=production` is set
- Ensure function reads env var correctly
- Add explicit logging to confirm

**Fix 3: Token Validation**
- Add token validation before API call
- Verify token format (starts with `pk_`, correct length)
- Verify token is not null/undefined

**Fix 4: Error Handling**
- Capture full error response from ClickUp API
- Log error details for debugging
- Return meaningful error messages

---

## Implementation Steps

### Step 1: Verify Token Works Directly
```bash
# Test token with ClickUp API
curl -X GET "https://api.clickup.com/api/v2/user" \
  -H "Authorization: pk_10791838_YH555EZC464CNCRYESM1AKNVA77G6K3J"
```

### Step 2: Test Workspace Access
```bash
curl -X GET "https://api.clickup.com/api/v2/team/9014181018" \
  -H "Authorization: pk_10791838_YH555EZC464CNCRYESM1AKNVA77G6K3J"
```

### Step 3: Test List Access
```bash
curl -X GET "https://api.clickup.com/api/v2/list/901402094744" \
  -H "Authorization: pk_10791838_YH555EZC464CNCRYESM1AKNVA77G6K3J"
```

### Step 4: Test Task Creation Directly
```bash
curl -X POST "https://api.clickup.com/api/v2/list/901402094744/task" \
  -H "Authorization: pk_10791838_YH555EZC464CNCRYESM1AKNVA77G6K3J" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Task",
    "markdown_description": "Test",
    "status": "to do"
  }'
```

### Step 5: Fix Edge Function
- Add comprehensive logging
- Verify token format
- Add error capture
- Test with real job

### Step 6: Deploy & Verify
- Deploy fixed function
- Test end-to-end workflow
- Verify task creation
- Verify task update

---

## Success Criteria

✅ Token validates with ClickUp API  
✅ Token has access to Valta workspace  
✅ Token has access to target list  
✅ Edge Function reads token correctly  
✅ Edge Function creates task successfully  
✅ Edge Function updates task successfully  
✅ Full workflow works end-to-end  

---

## Next Steps

1. Execute Phase 1 tests (verify token)
2. Execute Phase 2 tests (debug Edge Function)
3. Implement fixes from Phase 3
4. Deploy and verify
5. Document solution

---

**Status:** Ready for execution  
**Priority:** 🔴 CRITICAL - Blocking production workflow
