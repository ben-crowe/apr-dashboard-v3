<!-- e74158f8-a655-4b05-bb92-b9d8b3cb5cc3 17ba6629-b574-4a92-9290-9342fbb18b8c -->
# Fix PropertyType and PropertyContact Valcre Mapping

## CRITICAL SAFETY REQUIREMENTS

**DO NOT BREAK JOB CREATION** - Non-negotiable constraint

Safety Rules:

1. Job creation MUST succeed even if PropertyType/PropertyContact fail
2. Graceful degradation - Skip problematic fields, log warnings, continue
3. Test incremental changes - Fix one thing at a time, verify each step
4. Keep rollback commands ready (see bottom of plan)
5. Preserve existing working code - Don't touch ClientId, PropertyId, or core Job fields

## Priority Order (Based on Field Constraints)

**Priority 1: PropertyType** (Creation-only field - cannot fix after job creation)

**Priority 2: PropertyContact** (Updateable field - can retry later via PATCH)

Source: PropertyType is POST-only, verified in Golden Memories - VALCRE-FIELD-TEST-PROCEDURE.md

## Verified Context (Oct 10, 2025)

### Critical Requirements

**OwnerId: 7095 = Chris Chornohos (Appraiser)**

- ALL contacts MUST have this OwnerId
- Webhook already includes it (api/valcre.ts line 512)
- Verified in: create-standalone-contact.cjs, Golden Memories

**PropertyContactId is UPDATEABLE**

- Can PATCH update after job creation
- Verified working: create-standalone-contact.cjs (Oct 7, 2025)
- Lower urgency than PropertyType - can fix later if needed

**PropertyContact Object Construction Already Exists**

- Webhook DOES build PropertyContact object (src/utils/webhooks/valcre.ts lines 272-282)
- Issue is NOT in webhook mapping
- Must be in api/valcre.ts or Valcre API rejection
- Uses correct field name: PhoneNumber (NOT Phone)

**Contact API is Verified Working**

- create-standalone-contact.cjs proves Contact creation works
- Issue is likely in data reaching API OR linking PropertyContactId to Job

**PropertyType: CREATION-ONLY FIELD**

- Can ONLY be set during job creation (POST)
- CANNOT be updated after (PATCH returns 200 OK but doesn't persist)
- Source: Golden Memories - VALCRE-FIELD-TEST-PROCEDURE.md
- This is why PropertyType is Priority 1

## Problem Analysis

### PropertyType Issue

- **UI**: 14 dropdown values (Multi-Family, Office, Retail, etc.) in `ClientSubmissionSection.tsx` lines 426-449
- **Storage**: `job.propertyType` (camelCase)
- **Webhook**: `src/utils/webhooks/valcre.ts` line 202: `PropertyType: formData.propertyType || 'Commercial'`
- **API**: `api/valcre.ts` lines 565-571: `propertyData.PropertyType = jobData.PropertyType`
- **Result**: Field not appearing in Valcre Property entity

### PropertyContact Issue

- **UI**: Flat fields (`propertyContactFirstName`, `propertyContactLastName`, `propertyContactEmail`, `propertyContactPhone`)
- **Webhook**: Lines 272-282 should create nested PropertyContact object
- **API**: `api/valcre.ts` lines 484-542: Creates Contact entity with OwnerId: 7095
- **Known**: Contact API works (verified via `create-standalone-contact.cjs`)
- **Hypothesis**: Webhook not building PropertyContact object from flat fields

## Phase 1: Add Comprehensive Logging (SAFE)

### In `src/utils/webhooks/valcre.ts`

After line 200, add:

```typescript
console.log('🏢 PropertyType from UI:', formData.propertyType);
console.log('👤 PropertyContact fields:', {
  firstName: formData.propertyContactFirstName,
  lastName: formData.propertyContactLastName,
  email: formData.propertyContactEmail,
  phone: formData.propertyContactPhone
});
```

Before sending to API (around line 285), add:

```typescript
console.log('📤 Full payload to /api/valcre:', JSON.stringify(jobData, null, 2));
```

### In `api/valcre.ts`

At handler start (after line 190), add:

```typescript
console.log('📥 Received jobData.PropertyType:', jobData.PropertyType);
console.log('📥 Received jobData.PropertyContact:', JSON.stringify(jobData.PropertyContact, null, 2));
```

Before Property entity creation (around line 640), add:

```typescript
console.log('🏢 Property entity data being sent:', JSON.stringify(propertyData, null, 2));
```

After Property creation (around line 652), add:

```typescript
const propertyResponse = await fetch(...);
const propertyBody = await propertyResponse.json();
console.log('✅ Property API response:', JSON.stringify(propertyBody, null, 2));
```

Before PropertyContact creation (around line 499), add:

```typescript
if (needsSeparatePropertyContact) {
  console.log('👤 Creating PropertyContact with data:', JSON.stringify(propertyContactData, null, 2));
}
```

**Test**: Create job - should succeed with more logging, no functional changes

## Phase 2: Test and Analyze Logs

Create test job with:

- PropertyType: "Multi-Family"
- PropertyContact: Different from client (all 4 fields filled)

Check Vercel/console logs to answer:

**PropertyType Questions:**

1. Is PropertyType reaching the webhook?
2. Is PropertyType in the API payload?
3. What's the exact Property entity request to Valcre?
4. What's the Valcre API response? Any error about PropertyType?
5. Does Valcre response show a different field name expectation (Type vs PropertyType vs Types)?

**PropertyContact Questions:**

1. Are flat fields reaching the webhook?
2. Is `jobData.PropertyContact` object constructed?
3. What's the exact Contact entity request?
4. Does Contact POST succeed?
5. Is PropertyContactId set on the Job?

**DO NOT make code changes yet** - only gather evidence

## Phase 3: Fix PropertyType (High Priority)

### If Field Name is Wrong

Based on logs, if Valcre expects different field name, update `api/valcre.ts` around line 565:

```typescript
// Try "Type" instead of "PropertyType"
if (jobData.PropertyType) {
  propertyData.Type = jobData.PropertyType;
  console.log(`✅ Type set to: "${propertyData.Type}"`);
}
```

Or if Valcre expects `Types` array (line 574 already maps `PropertyTypeEnum → Types`), investigate that path.

### If Values Need Mapping

If Valcre rejects hyphenated values, add mapping before line 565:

```typescript
const PROPERTY_TYPE_MAP: Record<string, string> = {
  'Multi-Family': 'Multifamily',
  'Manufactured Housing': 'ManufacturedHousing',
  'Self-Storage': 'SelfStorage',
  'Single-Family': 'SingleFamily',
  'Special Purpose': 'SpecialPurpose',
};

const mappedPropertyType = jobData.PropertyType
  ? (PROPERTY_TYPE_MAP[jobData.PropertyType] || jobData.PropertyType)
  : null;

if (mappedPropertyType) {
  propertyData.PropertyType = mappedPropertyType;
}
```

**Test**: Create job, verify PropertyType appears in Valcre UI

**Rollback if breaks**: `git checkout api/valcre.ts`

## Phase 4: Fix PropertyContact (Lower Priority)

### If PropertyContact Object Not Built

If logs show `jobData.PropertyContact` is undefined, update `src/utils/webhooks/valcre.ts` around line 270:

```typescript
// Build PropertyContact object if any field filled
const hasPropertyContact = formData.propertyContactFirstName ||
                          formData.propertyContactLastName ||
                          formData.propertyContactEmail ||
                          formData.propertyContactPhone;

if (hasPropertyContact && formData.propertyContactEmail !== formData.clientEmail) {
  jobData.PropertyContact = {
    FirstName: formData.propertyContactFirstName || '',
    LastName: formData.propertyContactLastName || '',
    Email: formData.propertyContactEmail || '',
    PhoneNumber: formData.propertyContactPhone || '',  // Note: PhoneNumber not Phone
    Company: formData.clientOrganization || formData.organizationName || 'Direct Client',
    Title: formData.clientTitle || 'Property Manager',
    AddressStreet: formData.propertyAddress
  };
  console.log('👤 Built PropertyContact object:', jobData.PropertyContact);
}
```

**Test**: Create job with different PropertyContact, verify Contact created and linked

**Rollback if breaks**: `git checkout src/utils/webhooks/valcre.ts`

## Rollback Commands (Keep Ready)

```bash
# Check what changed
git diff api/valcre.ts
git diff src/utils/webhooks/valcre.ts

# Rollback PropertyType fix
git checkout api/valcre.ts

# Rollback PropertyContact fix
git checkout src/utils/webhooks/valcre.ts

# Revert all changes
git checkout api/valcre.ts src/utils/webhooks/valcre.ts
```

## Files to Modify

1. `api/valcre.ts` (lines 565-571, 640-660) - PropertyType and logging
2. `src/utils/webhooks/valcre.ts` (lines 200-285) - PropertyContact object construction and logging

## Success Criteria

- PropertyType dropdown value appears in Valcre Property entity
- PropertyContact creates separate Contact entity with OwnerId: 7095
- PropertyContactId links to Job entity
- Job creation never fails (graceful degradation if fields fail)
- Client Contact still works (no regression)

### To-dos

- [ ] Add comprehensive logging to webhook and API without changing functionality
- [ ] Create test job and analyze logs to identify root cause for both issues
- [ ] Fix PropertyType field mapping based on log analysis (high priority - creation-only)
- [ ] Fix PropertyContact object construction if PropertyType succeeded (lower priority - updateable)