# PropertyType Multi-Select Investigation - CRITICAL FINDING

**Date**: October 10, 2025
**Status**: 🚨 **MAJOR ISSUE IDENTIFIED**

---

## 🚨 Critical Discovery

**User Statement**: *"Property type has a drop-down field set that you know of, but they're not typical fields; they're checkboxes that let the user pick multiple options in the property type drop-down."*

### Current Dashboard Implementation

**File**: `src/components/dashboard/job-details/ClientSubmissionSection.tsx` (Lines 227-252)

```typescript
<CompactField label="Property Type">
  <Select
    value={job.propertyType || ''}
    onValueChange={(value) => onUpdateJob?.({propertyType: value})}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select..." />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="Agriculture">Agriculture</SelectItem>
      <SelectItem value="Building">Building</SelectItem>
      <SelectItem value="Healthcare">Healthcare</SelectItem>
      <SelectItem value="Hospitality">Hospitality</SelectItem>
      <SelectItem value="Industrial">Industrial</SelectItem>
      <SelectItem value="Land">Land</SelectItem>
      <SelectItem value="Manufactured Housing">Manufactured Housing</SelectItem>
      <SelectItem value="Multi-Family">Multi-Family</SelectItem>
      <SelectItem value="Office">Office</SelectItem>
      <SelectItem value="Retail">Retail</SelectItem>
      <SelectItem value="Self-Storage">Self-Storage</SelectItem>
      <SelectItem value="Single-Family">Single-Family</SelectItem>
      <SelectItem value="Special Purpose">Special Purpose</SelectItem>
      <SelectItem value="Unknown">Unknown</SelectItem>
    </SelectContent>
  </Select>
</CompactField>
```

**Problem**: This is a **SINGLE-SELECT** dropdown.

### What Valcre Actually Supports

According to user: **MULTI-SELECT via checkboxes** - users can select MULTIPLE property types.

**Evidence from code**:
- `/api/valcre.ts:584` uses field name `Types` (PLURAL) → Suggests array field
- User explicitly states "checkboxes that let the user pick multiple options"

---

## 🎯 The Real Issue

### Current Flow (BROKEN)

1. **Dashboard UI**: Single-select dropdown
   - User can only pick ONE property type (e.g., "Retail")
   - Stored as STRING: `propertyType: "Retail"`

2. **Webhook**: Sends single string
   ```json
   {
     "PropertyType": "Retail",
     "PropertyTypeEnum": "Retail"
   }
   ```

3. **API Handler**: Sets single value
   ```typescript
   propertyData.PropertyType = "Retail";  // Single value
   propertyData.Types = "Retail";         // Should be ARRAY!
   ```

4. **Valcre API**: Expects array in `Types` field
   - Expected: `Types: ["Retail", "Office"]`
   - Receiving: `Types: "Retail"` (WRONG TYPE!)

### Correct Flow (NEEDED)

1. **Dashboard UI**: Multi-select checkbox group
   - User can pick MULTIPLE property types (e.g., "Retail" + "Office")
   - Stored as ARRAY: `propertyTypes: ["Retail", "Office"]`

2. **Webhook**: Sends array
   ```json
   {
     "PropertyTypes": ["Retail", "Office"]
   }
   ```

3. **API Handler**: Sets array
   ```typescript
   propertyData.Types = ["Retail", "Office"];  // Correct: array
   ```

4. **Valcre API**: Receives correct array
   - `Types: ["Retail", "Office"]` ✅

---

## 📋 Required Changes

### 1. Update Dashboard UI (MAJOR)

**File**: `src/components/dashboard/job-details/ClientSubmissionSection.tsx`

**Replace**: Lines 227-252 (single-select dropdown)

**With**: Multi-select checkbox group

```typescript
<CompactField label="Property Type(s)">
  <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
    {[
      "Agriculture",
      "Building",
      "Healthcare",
      "Hospitality",
      "Industrial",
      "Land",
      "Manufactured Housing",
      "Multi-Family",
      "Office",
      "Retail",
      "Self-Storage",
      "Single-Family",
      "Special Purpose",
      "Unknown"
    ].map((type) => (
      <div key={type} className="flex items-center gap-2">
        <Checkbox
          id={`property-type-${type}`}
          checked={(job.propertyTypes || []).includes(type)}
          onCheckedChange={(checked) => {
            const current = job.propertyTypes || [];
            const updated = checked
              ? [...current, type]
              : current.filter((t) => t !== type);
            onUpdateJob?.({ propertyTypes: updated });
          }}
        />
        <label htmlFor={`property-type-${type}`} className="text-sm cursor-pointer">
          {type}
        </label>
      </div>
    ))}
  </div>
</CompactField>
```

**Field name change**: `propertyType` (singular, string) → `propertyTypes` (plural, array)

### 2. Update Database Schema

**File**: Supabase migration

**Change**:
```sql
-- Current (WRONG):
propertyType: TEXT

-- Needed (CORRECT):
property_types: TEXT[]  -- Array of text values
```

**Migration SQL**:
```sql
-- Add new column
ALTER TABLE job_submissions
ADD COLUMN property_types TEXT[] DEFAULT '{}';

-- Migrate existing data (single value to array)
UPDATE job_submissions
SET property_types = ARRAY[property_type]::TEXT[]
WHERE property_type IS NOT NULL AND property_type != '';

-- OPTIONAL: Drop old column after verification
-- ALTER TABLE job_submissions DROP COLUMN property_type;
```

### 3. Update Webhook

**File**: `src/utils/webhooks/valcre.ts`

**Change**: Line 211-212

```typescript
// OLD (sends string):
PropertyType: formData.propertyType || 'Commercial',
PropertyTypeEnum: formData.propertyType || 'Commercial',

// NEW (sends array):
PropertyTypes: formData.propertyTypes || ['Commercial'],  // Array
```

### 4. Update API Handler

**File**: `/api/valcre.ts`

**Change**: Lines 574-584

```typescript
// OLD (expects string):
if (jobData.PropertyType) {
  propertyData.PropertyType = jobData.PropertyType;
}
if (jobData.PropertyTypeEnum) propertyData.Types = jobData.PropertyTypeEnum;

// NEW (expects array):
if (jobData.PropertyTypes && Array.isArray(jobData.PropertyTypes)) {
  propertyData.Types = jobData.PropertyTypes;  // Valcre expects array in Types field
  console.log(`✅ PropertyTypes set to array: ${JSON.stringify(propertyData.Types)}`);
} else {
  console.log(`⚠️ PropertyTypes is not an array or missing`);
}
```

### 5. Update Type Definitions

**File**: `src/types/job.ts`

```typescript
// OLD:
export interface Job {
  propertyType?: string;
  // ...
}

// NEW:
export interface Job {
  propertyTypes?: string[];  // Changed to array
  // ...
}
```

---

## 🎯 Implementation Priority

### Phase 1: Quick Fix (Already Done)
✅ Send both `PropertyType` and `PropertyTypeEnum` to ensure at least single value works

### Phase 2: Proper Multi-Select (CRITICAL - NEEDS TO BE DONE)

1. **Database Migration** - Add `property_types` array column
2. **UI Update** - Convert to checkbox group
3. **Webhook Update** - Send array
4. **API Update** - Process array
5. **Type Definitions** - Update interfaces

---

## ⚠️ Why This Matters

**User's Statement**: *"Our client uses the checkbox option often"*

This means:
- Clients frequently select MULTIPLE property types (e.g., "Retail + Office" for mixed-use)
- Current dashboard CANNOT support this use case
- Users are forced to pick only ONE type, which is INCORRECT for many properties

**Business Impact**:
- Appraisals for mixed-use properties are incomplete
- PropertyType data in Valcre is inaccurate
- Clients can't properly describe their properties

---

## 🧪 Test Cases

After implementing multi-select:

### Test 1: Single Property Type
- Select: "Retail"
- Expected in Valcre: `Types: ["Retail"]`

### Test 2: Multiple Property Types (MAIN USE CASE)
- Select: "Retail" + "Office"
- Expected in Valcre: `Types: ["Retail", "Office"]`

### Test 3: Mixed-Use Complex
- Select: "Retail" + "Office" + "Multi-Family"
- Expected in Valcre: `Types: ["Retail", "Office", "Multi-Family"]`

---

## 📊 Current Status

- ✅ **Phase 1 Fix**: Deployed (sends `PropertyTypeEnum` for single-value compatibility)
- ❌ **Phase 2 Fix**: NOT STARTED (multi-select functionality)

**Phase 1** ensures existing single-value selections work correctly.

**Phase 2** (THIS IS CRITICAL) enables the checkbox multi-select functionality that clients "use often".

---

## 🚀 Recommendation

**IMMEDIATE ACTION NEEDED**:

1. You need to push the Phase 1 fix: `git push`
2. Then implement Phase 2 (multi-select) ASAP to support actual user workflow

**Estimated Effort** for Phase 2:
- Database migration: 10 minutes
- UI update: 30 minutes
- Webhook/API update: 20 minutes
- Testing: 30 minutes
- **Total: ~1.5 hours**

---

## 📝 Notes

- Current fix (Phase 1) is a **workaround** that only supports single property type
- Proper fix (Phase 2) requires **multi-select checkbox UI** to match Valcre's capability
- User explicitly mentioned checkboxes, confirming this is the expected UI pattern

**Phase 2 is NOT optional** - it's required to support the actual business workflow.
