# Fix ClickUp LOE Signed Regex Pattern

**Issue:** ClickUp task description not updating with LOE Signed timestamp  
**Date:** January 8, 2026  
**Status:** ✅ FIXED

---

## Problem

**User Report:**
- LOE was signed successfully
- Job status updated to `loe_signed` ✅
- ClickUp task description still showed blank lines:
  ```
  ▸ LOE Sent:
  ▸ LOE Signed:
  ```

**Root Cause:**
- Regex pattern `/  ▸ LOE Signed:\s+$/m` expected **two spaces** before the bullet (`  ▸`)
- Actual format in ClickUp has **no spaces** before the bullet (`▸`)
- Regex didn't match, so update failed silently

---

## Solution

**Updated Regex Pattern:**
- **Old:** `/  ▸ LOE Signed:\s+$/m` (required 2 spaces)
- **New:** `/^\s*▸ LOE Signed:\s*$/m` (matches with or without leading spaces)

**Changes Made:**

1. **Removed leading spaces from output format:**
   - Old: `  ▸ LOE Signed: ...`
   - New: `▸ LOE Signed: ...`

2. **Updated regex to be flexible:**
   - `^\s*` - Matches start of line with optional whitespace
   - `▸ LOE Signed:` - Matches the text
   - `\s*$` - Matches optional whitespace before end of line
   - `m` flag - Multiline mode

3. **Applied same fix to both "sent" and "signed" handlers**

---

## Files Updated

**File:** `supabase/functions/docuseal-webhook/index.ts`

**Changes:**
- Line 90: Updated `sent` handler regex
- Line 113: Updated `signed` handler output format (removed leading spaces)
- Line 117: Updated `signed` handler regex
- Line 125: Updated fallback regex for inserting after "LOE Sent"

---

## Testing

**Manual Update Script Created:**
- `scripts/manually-update-clickup-loe-signed.ts`
- Allows manual update of existing tasks for testing

**Test Result:**
```bash
$ tsx scripts/manually-update-clickup-loe-signed.ts 86dyykm3m "Ben Crowe"
✅ Replaced blank LOE Signed line
✅ ClickUp task updated successfully!
Updated line: ▸ LOE Signed: 26.01.08 / 8:15 PM by Ben Crowe
```

**Verified:**
- ✅ Regex now matches actual ClickUp format
- ✅ Task description updated correctly
- ✅ Timestamp format correct: `YY.MM.DD / H:MM AM/PM by [name]`

---

## Expected Format After Fix

**ClickUp Task Description:**
```
📍 NEW APPRAISAL REQUEST: APR Dashboard
📍 VALCRE JOB NUMBER: VAL261003
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECEIVED DATE:  26.01.08 / 7:50 PM
▸ LOE Sent:   26.01.08 / 7:55 PM
▸ LOE Signed: 26.01.08 / 8:15 PM by Ben Crowe
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Future Signings

**For new LOE signings:**
- Webhook will automatically update ClickUp task ✅
- Format: `▸ LOE Signed: [timestamp] by [signer name]`
- No manual intervention needed

**For existing signed LOEs:**
- Use manual script: `tsx scripts/manually-update-clickup-loe-signed.ts <taskId> [signerName]`

---

**Status:** ✅ Fixed and deployed - Future signings will update automatically!
