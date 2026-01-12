# PropertyType Fix Applied - October 10, 2025

## 🎯 Problem Identified

**Root Cause**: Field mapping mismatch between webhook and API handler.

### The Issue

`/api/valcre.ts` has TWO PropertyType field mappings:

1. **Line 577**: `propertyData.PropertyType = jobData.PropertyType;`
2. **Line 584**: `if (jobData.PropertyTypeEnum) propertyData.Types = jobData.PropertyTypeEnum;`

But the webhook (`src/utils/webhooks/valcre.ts:211`) was only sending:
```typescript
PropertyType: formData.propertyType || 'Commercial',
```

This meant:
- ✅ `PropertyType` field WAS being set
- ❌ `Types` field was NEVER set (because `PropertyTypeEnum` wasn't sent)

**Hypothesis**: Valcre API likely expects the `Types` field (plural), not `PropertyType` (singular).

---

## ✅ Fix Applied

**File**: `src/utils/webhooks/valcre.ts`
**Line**: 212 (added)

### Before:
```typescript
// Property fields (will be used for Property entity)
PropertyType: formData.propertyType || 'Commercial',
PropertySubtype: formData.propertySubtype || '',
```

### After:
```typescript
// Property fields (will be used for Property entity)
PropertyType: formData.propertyType || 'Commercial',
PropertyTypeEnum: formData.propertyType || 'Commercial',  // Also send as PropertyTypeEnum for api/valcre Types field mapping
PropertySubtype: formData.propertySubtype || '',
```

---

## 🔄 How It Works Now

When a job is saved with `PropertyType: "Retail"`:

1. **Webhook** (`src/utils/webhooks/valcre.ts:211-212`) sends:
   ```json
   {
     "PropertyType": "Retail",
     "PropertyTypeEnum": "Retail"
   }
   ```

2. **API Handler** (`/api/valcre.ts:577, 584`) sets BOTH fields:
   ```typescript
   propertyData.PropertyType = "Retail";  // Line 577
   propertyData.Types = "Retail";         // Line 584
   ```

3. **Valcre API** receives Property entity with:
   - `PropertyType: "Retail"` ✅
   - `Types: "Retail"` ✅

**Result**: Whichever field Valcre actually uses will now be populated.

---

## 🧪 How to Test

### Test 1: New Job Creation

1. Fill out dashboard with:
   - PropertyType: **Retail** (or any other type)
   - PropertyContact: **Albert Peterson** (different from client)

2. Save the job

3. Check Valcre UI:
   - ✅ PropertyType should appear as "Retail"
   - ✅ PropertyContact should appear as separate contact

### Test 2: Verify in Logs

**Browser Console** (should see):
```
🏢 PropertyType from UI: Retail
👤 PropertyContact fields: {firstName: "Albert", lastName: "Peterson", ...}
📤 Full payload to /api/valcre: {
  "PropertyType": "Retail",
  "PropertyTypeEnum": "Retail",
  "PropertyContact": {...}
}
```

**Vercel Function Logs** (should see):
```
🏢 PropertyType from jobData: "Retail" (type: string)
✅ PropertyType set to: "Retail"
🚨 CRITICAL DEBUG - Property Data Being Sent:
   PropertyType field: "Retail"
   Types field: "Retail"  ← NEW
```

---

## 📊 PropertyContact Status

### Code Analysis: ✅ CORRECT

PropertyContact code in `/api/valcre.ts` is working correctly:

- **Lines 488-500**: Proper duplicate check (only creates if email/name differ)
- **Lines 502-545**: Correct Contact entity creation with `PhoneNumber` field
- **Line 251**: Proper `PropertyContactId` link to Job entity

### Why It Might Not Appear

1. **Duplicate Prevention Working** - If PropertyContact email matches Client email, won't create separate contact (INTENDED)
2. **Contact Creation Failing** - Check Vercel logs for `❌ Contact creation error`
3. **Webhook Not Sending** - Need to verify PropertyContact object in `📤 Full payload` log

### How to Verify

Check **Vercel Function Logs** for PropertyContact:
```
📥 Received jobData.PropertyContact: {
  "FirstName": "Albert",
  "LastName": "Peterson",
  "Email": "Mark@AlbertJohnson.com",
  "PhoneNumber": "(221) 663-8812",
  ...
}

🔍 PropertyContact check: {
  hasPropertyContact: true,
  propertyEmail: "Mark@AlbertJohnson.com",
  clientEmail: "michael.johnson@premierpropertiesinc.ca",
  emailsDifferent: true,
  needsSeparate: true
}

👤 Creating PropertyContact with data: {...}

✅ Property Contact created with ID: 12345
```

If you see `❌ Contact creation error`, check the error details.

If you don't see these logs at all, PropertyContact isn't being sent from the webhook.

---

## 🎯 Next Steps

### 1. Deploy the Fix

The fix has been applied to `src/utils/webhooks/valcre.ts`. Deploy to production:

```bash
git add src/utils/webhooks/valcre.ts
git commit -m "Fix PropertyType mapping - send PropertyTypeEnum for Valcre Types field"
git push
```

Vercel will auto-deploy.

### 2. Test With Real Data

Use the test case from your dashboard:
- Client: Michael Johnson
- PropertyType: Retail
- PropertyContact: Albert Peterson (Mark@AlbertJohnson.com)

Save and verify in Valcre UI.

### 3. Check Vercel Logs

After testing, check Vercel function logs to confirm:
- ✅ PropertyType being set correctly
- ✅ PropertyContact creation succeeding or reason for failure

---

## 📁 Files Modified

### `/Users/bencrowe/Development/apr-dashboard-v3/src/utils/webhooks/valcre.ts`
- **Line 212**: Added `PropertyTypeEnum` to webhook payload
- **Purpose**: Ensure `/api/valcre.ts` line 584 executes and sets `Types` field

---

## 📝 Related Documentation

- **Analysis**: `API-VALCRE-FINDINGS.md` - Detailed code analysis
- **Investigation**: `PROPERTYTYPE-PROPERTYCONTACT-FINDINGS.md` - Original investigation notes
- **Fix**: `PROPERTYTYPE-FIX-APPLIED.md` - This document

---

## ✅ Expected Outcome

After deployment:
- **PropertyType** should appear correctly in Valcre Property entities
- **PropertyContact** should appear as separate contact (when different from client)
- Both fields properly synced to Valcre CRM

**Testing window**: Immediately after deployment - create a test job with Retail property type and verify in Valcre UI.
