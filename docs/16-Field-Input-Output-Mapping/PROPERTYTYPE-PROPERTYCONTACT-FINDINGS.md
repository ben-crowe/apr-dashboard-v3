# PropertyType & PropertyContact Investigation - Code Analysis

**Date**: October 10, 2025
**Issue**: PropertyType and PropertyContact not appearing in Valcre
**Status**: ✅ Logging code confirmed in place

---

## ✅ What IS Working (Confirmed in Code)

### 1. Logging Code is Present (`src/utils/webhooks/valcre.ts`)

**Line 186-192**: PropertyType and PropertyContact logging
```typescript
console.log('🏢 PropertyType from UI:', formData.propertyType);
console.log('👤 PropertyContact fields:', {
  firstName: formData.propertyContactFirstName,
  lastName: formData.propertyContactLastName,
  email: formData.propertyContactEmail,
  phone: formData.propertyContactPhone
});
```

**Line 298 (from grep)**: Full payload logging
```typescript
console.log('📤 Full payload to /api/valcre:', JSON.stringify(jobData, null, 2));
```

### 2. PropertyContact Object Construction (Lines 272-282)

```typescript
// Only include PropertyContact if property contact fields are actually provided
// Don't send PropertyContact with client fallbacks - that causes duplication
if (formData.propertyContactEmail && formData.propertyContactEmail !== formData.clientEmail) {
  jobData.PropertyContact = {
    FirstName: formData.propertyContactFirstName,
    LastName: formData.propertyContactLastName,
    Company: formData.clientOrganization || formData.organizationName || 'Direct Client',
    Email: formData.propertyContactEmail,
    PhoneNumber: formData.propertyContactPhone,  // ✅ Correct: PhoneNumber not Phone
    Title: formData.clientTitle || 'Property Manager',
    AddressStreet: formData.propertyAddress
  };
}
```

**✅ This is CORRECT** - PropertyContact object is built when email differs from client

### 3. PropertyType in Payload (Line 202)

```typescript
PropertyType: formData.propertyType || 'Commercial',
```

**✅ PropertyType IS included** in the payload to /api/valcre

---

## 🔍 What We Need to Verify

### From Console Logs (Ben's Test Data):

**Test Case**: Albert Peterson as PropertyContact (different from client Michael Johnson)

**Expected Logs Should Show**:
```
🏢 PropertyType from UI: Retail
👤 PropertyContact fields: {
  firstName: "Albert",
  lastName: "Peterson",
  email: "Mark@AlbertJohnson.com",
  phone: "(221) 663-8812"
}
📤 Full payload to /api/valcre: {
  ...
  "PropertyType": "Retail",
  "PropertyContact": {
    "FirstName": "Albert",
    "LastName": "Peterson",
    "Email": "Mark@AlbertJohnson.com",
    "PhoneNumber": "(221) 663-8812",
    ...
  }
  ...
}
```

### If These Logs Appear ✅:
- PropertyType and PropertyContact ARE in the webhook payload
- Problem is in `/api/valcre.ts` (Vercel serverless function)
- Need to check how `/api/valcre.ts` processes PropertyType and PropertyContact

### If These Logs DON'T Appear ❌:
- Webhook isn't being triggered
- Or save operation isn't calling `sendToValcre()`
- Need to check auto-save logic in dashboard components

---

## 🎯 Next Steps for Cursor

### Option A: If Emoji Logs Show PropertyType & PropertyContact

Check `/api/valcre.ts` for how it handles these fields:

1. **PropertyType**: Does it map to correct Valcre API field?
   - Is it `Property.PropertyType`?
   - Or `Property.Types` (see line 574 clue)?
   - Or `Property.Type`?

2. **PropertyContact**: Does it create separate Contact entity?
   - Check lines 480-542 in `/api/valcre.ts`
   - Verify OwnerId: 7095 is set
   - Confirm Contact POST succeeds
   - Check if PropertyContactId is linked to Job

### Option B: If Emoji Logs DON'T Appear

Check dashboard save logic:
1. Is `sendToValcre()` being called?
2. Is auto-save triggering correctly?
3. Are PropertyContact fields being included in formData?

---

## 📋 Manual Test Instructions (For Ben or Automation)

1. Fill out dashboard with:
   - Client: Michael Johnson
   - PropertyType: Retail
   - PropertyContact: Albert Peterson (Mark@AlbertJohnson.com)

2. Save/Submit

3. Check console for these 3 specific logs:
   - `🏢 PropertyType from UI:`
   - `👤 PropertyContact fields:`
   - `📤 Full payload to /api/valcre:`

4. Copy those 3 log lines (just those 3, nothing else)

5. Paste to Cursor with context: "Here are the emoji logs showing what's being sent to /api/valcre"

---

## 🔬 Code Locations Reference

**Webhook File**: `/Users/bencrowe/Development/apr-dashboard-v3/src/utils/webhooks/valcre.ts`
- Line 186: PropertyType logging
- Lines 187-192: PropertyContact logging
- Line 202: PropertyType in payload
- Lines 272-282: PropertyContact object construction
- Line 298: Full payload logging

**API File**: `/Users/bencrowe/Development/apr-dashboard-v3/api/valcre.ts`
- Lines 480-542: PropertyContact entity creation
- Lines 564-571: PropertyType field mapping
- Line 574: PropertyTypeEnum → Types mapping (CLUE!)

---

**Summary**: The webhook code looks CORRECT. PropertyType and PropertyContact SHOULD be in the payload. We need to see the actual console logs to confirm they're being sent, then investigate `/api/valcre.ts` if they are.
