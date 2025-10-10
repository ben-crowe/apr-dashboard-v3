# /api/valcre.ts Analysis - PropertyType & PropertyContact Investigation

**Date**: October 10, 2025
**Status**: 🎯 ROOT CAUSE IDENTIFIED

---

## 🔍 Summary

Analyzed `/api/valcre.ts` to understand how PropertyType and PropertyContact are processed when they arrive from the webhook. Found **critical field mapping issue** with PropertyType.

---

## 🚨 CRITICAL FINDING: PropertyType Field Mapping

### The Problem

`/api/valcre.ts` has **TWO** different PropertyType field mappings:

**Lines 574-581** (Primary mapping):
```typescript
console.log(`🏢 PropertyType from jobData: "${jobData.PropertyType}" (type: ${typeof jobData.PropertyType})`);
if (jobData.PropertyType) {
  // Use PropertyType directly - dashboard now sends exact Valcre values
  propertyData.PropertyType = jobData.PropertyType;
  console.log(`✅ PropertyType set to: "${propertyData.PropertyType}"`);
} else {
  console.log(`⚠️ PropertyType is falsy, not setting on Property entity`);
}
```

**Line 584** (Alternative mapping):
```typescript
if (jobData.PropertyTypeEnum) propertyData.Types = jobData.PropertyTypeEnum;
```

### The Issue

The webhook (`src/utils/webhooks/valcre.ts:202`) sends:
```typescript
PropertyType: formData.propertyType || 'Commercial',
```

But **DOES NOT** send `PropertyTypeEnum`.

This means:
- ✅ `propertyData.PropertyType` IS being set (line 577)
- ❌ `propertyData.Types` is NEVER set (line 584 never executes)

### Why This Matters

**Hypothesis**: Valcre API might expect the field `Types` (plural) instead of `PropertyType` (singular).

Evidence:
1. Line 584 comment suggests `PropertyTypeEnum → Types` was a known mapping
2. The code maintains BOTH mappings, suggesting uncertainty about which field Valcre accepts
3. User reports PropertyType not appearing in Valcre UI

### The Fix

**Option 1: Send both fields from webhook**
```typescript
// In src/utils/webhooks/valcre.ts
PropertyType: formData.propertyType || 'Commercial',
PropertyTypeEnum: formData.propertyType || 'Commercial',  // ADD THIS
```

**Option 2: Change API to set Types field**
```typescript
// In api/valcre.ts (line 577)
if (jobData.PropertyType) {
  propertyData.PropertyType = jobData.PropertyType;
  propertyData.Types = jobData.PropertyType;  // ADD THIS - set both fields
  console.log(`✅ PropertyType set to: "${propertyData.PropertyType}"`);
}
```

**Option 3: Test which field Valcre actually accepts**
```typescript
// Remove PropertyType, only send Types
if (jobData.PropertyType) {
  propertyData.Types = jobData.PropertyType;  // CHANGE: Use Types instead
  console.log(`✅ PropertyType (as Types) set to: "${propertyData.Types}"`);
}
```

---

## ✅ PropertyContact: CODE IS CORRECT

### Analysis of Lines 484-552

**Step 1: Check if separate PropertyContact needed** (lines 488-500):
```typescript
const needsSeparatePropertyContact =
  jobData.PropertyContact &&
  (jobData.PropertyContact.Email !== clientEmail ||
   jobData.PropertyContact.FirstName !== clientFirstName ||
   jobData.PropertyContact.LastName !== clientLastName);

console.log(`🔍 PropertyContact check:`, {
  hasPropertyContact: !!jobData.PropertyContact,
  propertyEmail: jobData.PropertyContact?.Email,
  clientEmail: clientEmail,
  emailsDifferent: jobData.PropertyContact?.Email !== clientEmail,
  needsSeparate: needsSeparatePropertyContact
});
```

✅ **CORRECT**: Only creates separate PropertyContact if email OR name is different.

**Step 2: Create separate Contact entity** (lines 502-545):
```typescript
if (needsSeparatePropertyContact) {
  console.log("Creating separate Property Contact entity...");
  const propertyContactData = {
    Company: jobData.PropertyContact.Company || contactCompany,
    FirstName: jobData.PropertyContact.FirstName || clientFirstName,
    LastName: jobData.PropertyContact.LastName || clientLastName,
    AddressStreet: jobData.PropertyContact.AddressStreet || addressParts.street,
    AddressCity: addressParts.city,
    AddressState: addressParts.province || "AB",
    AddressPostalCode: addressParts.postalCode || "",
    PhoneNumber: jobData.PropertyContact.PhoneNumber || "",  // ✅ CORRECT FIELD NAME
    Email: jobData.PropertyContact.Email || "",
    Title: jobData.PropertyContact.Title || "Property Contact",
    OwnerId: 7095, // Chris's correct OwnerId
  };

  console.log('👤 Creating PropertyContact with data:', JSON.stringify(propertyContactData, null, 2));

  const propContactResponse = await fetch(
    "https://api-core.valcre.com/api/v1/Contacts",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(propertyContactData),
    },
  );

  if (propContactResponse.ok) {
    const propContact = await propContactResponse.json();
    propertyContactId = propContact.Id || propContact.id;
    console.log("✅ Property Contact created with ID:", propertyContactId);
    console.log('✅ Contact entity response:', JSON.stringify(propContact, null, 2));
  } else {
    const errorText = await propContactResponse.text();
    console.log("⚠️ Failed to create separate Property Contact, will use ClientId");
    console.log('❌ Contact creation error:', errorText);
  }
}
```

✅ **CORRECT**:
- Uses `PhoneNumber` (not `Phone`)
- Sends to `/api/v1/Contacts` endpoint
- Sets `OwnerId: 7095`
- Has comprehensive logging

**Step 3: Link PropertyContact to Job** (line 251):
```typescript
const jobCreateData: any = {
  Name: jobName,
  Status: "Lead",
  OwnerId: 7095,

  // CRITICAL: Reference the entities we just created!
  ClientId: clientId,
  PropertyId: propertyId,
  PropertyContactId: propertyContactId,  // ✅ LINKS THE PROPERTY CONTACT

  // ... other fields
};
```

✅ **CORRECT**: Job entity references `PropertyContactId`.

### Why PropertyContact Might Not Appear

Since the code is correct, if PropertyContact isn't appearing in Valcre, it's likely:

1. ❌ **Webhook not sending PropertyContact** - Check console logs (need emoji logs)
2. ❌ **PropertyContact creation failing silently** - Check error logs in lines 540-544
3. ✅ **Duplicate prevention working** - If email matches client, PropertyContact won't be created (INTENDED)

---

## 📊 Logging Already Present

### PropertyType Logging (Lines 574, 578, 580, 91-93):
```typescript
console.log(`🏢 PropertyType from jobData: "${jobData.PropertyType}" (type: ${typeof jobData.PropertyType})`);
// ...
console.log(`✅ PropertyType set to: "${propertyData.PropertyType}"`);
// ...
console.log(`⚠️ PropertyType is falsy, not setting on Property entity`);
// ...
console.log('🚨 CRITICAL DEBUG - Property Data Being Sent:');
console.log(`   PropertyType field: "${propertyData.PropertyType}"`);
console.log(`   Full propertyData: ${JSON.stringify(propertyData, null, 2)}`);
```

### PropertyContact Logging (Lines 194-197, 494-500, 520, 537-538, 542-544):
```typescript
console.log('📥 Received jobData.PropertyType:', jobData.PropertyType);
console.log('📥 Received jobData.PropertyContact:', JSON.stringify(jobData.PropertyContact, null, 2));
// ...
console.log(`🔍 PropertyContact check:`, { /* detailed check */ });
// ...
console.log('👤 Creating PropertyContact with data:', JSON.stringify(propertyContactData, null, 2));
// ...
console.log("✅ Property Contact created with ID:", propertyContactId);
console.log('✅ Contact entity response:', JSON.stringify(propContact, null, 2));
// ... or ...
console.log("⚠️ Failed to create separate Property Contact, will use ClientId");
console.log('❌ Contact creation error:', errorText);
```

**This means**: We should be able to see detailed PropertyType/PropertyContact processing in the **Vercel serverless function logs**.

---

## 🎯 Next Steps

### Immediate: Check Vercel Logs

Since `/api/valcre` is a Vercel serverless function, check Vercel deployment logs:

1. Go to Vercel Dashboard → apr-dashboard-v3 project
2. Navigate to "Logs" or "Functions"
3. Search for recent logs containing:
   - `🏢 PropertyType from jobData:`
   - `📥 Received jobData.PropertyContact:`
   - `🔍 PropertyContact check:`
   - `✅ PropertyType set to:`
   - `👤 Creating PropertyContact with data:`

These logs will show:
- ✅ If PropertyType is arriving from webhook
- ✅ If PropertyContact is arriving from webhook
- ✅ If PropertyContact creation succeeds or fails
- ✅ What data is being sent to Valcre API

### Test Fix for PropertyType

**Recommended**: Send BOTH `PropertyType` and `PropertyTypeEnum` from webhook:

```typescript
// In src/utils/webhooks/valcre.ts (around line 202)
PropertyType: formData.propertyType || 'Commercial',
PropertyTypeEnum: formData.propertyType || 'Commercial',  // ADD THIS LINE
```

This ensures BOTH fields are set in `/api/valcre.ts`:
- Line 577: `propertyData.PropertyType` ✅
- Line 584: `propertyData.Types` ✅

If Valcre expects `Types`, it will work. If it expects `PropertyType`, it will work. Belt and suspenders.

### Verify PropertyContact

Check Vercel logs for:
- `✅ Property Contact created with ID: [number]` → SUCCESS
- `⚠️ Failed to create separate Property Contact` → FAILURE (check error)
- Neither log → PropertyContact not being sent from webhook

---

## 📋 Code Locations Reference

**/api/valcre.ts**:
- Lines 574-584: PropertyType field mapping logic
- Lines 484-552: PropertyContact entity creation logic
- Lines 194-197: PropertyType/PropertyContact received logging
- Lines 494-500: PropertyContact duplicate check logging
- Lines 520, 537-544: PropertyContact creation logging
- Line 251: PropertyContactId linked to Job

**src/utils/webhooks/valcre.ts**:
- Line 202: PropertyType sent to API
- Lines 272-282: PropertyContact object construction
- Lines 186-192: PropertyType/PropertyContact logging (webhook side)
- Line 298: Full payload logging (webhook side)

---

## 🔬 Conclusion

**PropertyType**: Likely field mapping issue - Valcre might expect `Types` not `PropertyType`

**PropertyContact**: Code is correct - need to check if:
1. Webhook is sending the data
2. Contact creation is succeeding in Valcre API
3. Vercel logs show success/failure

**Next Action**: Check Vercel serverless function logs to see actual API processing.
