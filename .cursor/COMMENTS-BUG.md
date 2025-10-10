# Comments Field Mapping Bug

## Issue
Client Comments and Appraiser Comments are being combined into a single field instead of mapping to Valcre's separate comment fields.

## Current Behavior (WRONG)
**Dashboard Data:**
- Client Comments: "Property is a 14,000 sq ft Industrial complex. Need appraisal for Financing/Refinancing."
- Appraiser Comments: (empty)

**What Gets Sent:**
```javascript
jobData.Comments = "=== CLIENT COMMENTS ===\nProperty is a 14,000 sq ft Industrial complex...\n\n=== APPRAISER COMMENTS ===\n"
```

**Valcre Result:**
- General Comments: Empty ❌
- Client Comments: Empty ❌

## Expected Behavior (CORRECT)
**Dashboard → Valcre Mapping:**
- Dashboard "Client Comments" (notes field) → Valcre `ClientComments` field
- Dashboard "Appraiser Comments" → Valcre `Comments` field (General)

**Valcre Has 4 Comment Fields:**
1. General (`Comments`) - Internal appraiser notes
2. Client (`ClientComments`) - Client-visible comments  
3. Delivery - Delivery instructions
4. Payment - Payment notes

## Root Cause
**File:** `src/utils/webhooks/valcre.ts`  
**Lines:** 265-275

```javascript
// CURRENT CODE (WRONG):
const creationComments = [];
if (formData.notes) {  // notes = client comments from property section
  creationComments.push(`=== CLIENT COMMENTS ===\n${formData.notes}`);
}
if (formData.appraiserComments) {
  creationComments.push(`=== APPRAISER COMMENTS ===\n${formData.appraiserComments}`);
}
if (creationComments.length > 0) {
  jobData.Comments = creationComments.join('\n\n');  // ❌ WRONG - goes to General field only
}
```

## Fix Required
**File:** `src/utils/webhooks/valcre.ts`  
**Lines:** 265-275

```javascript
// CORRECTED CODE:
// Map client comments to ClientComments field
if (formData.notes) {
  jobData.ClientComments = formData.notes;  // ✅ Goes to Valcre "Client" field
}

// Map appraiser comments to Comments field (General)
if (formData.appraiserComments) {
  jobData.Comments = formData.appraiserComments;  // ✅ Goes to Valcre "General" field
}
```

## Testing After Fix
1. Create new job with client comments: "Test client comment"
2. Add appraiser comments: "Test appraiser comment"
3. Click "Create Valcre Job"
4. Log into Valcre and verify:
   - Client Comments field shows: "Test client comment"
   - General Comments field shows: "Test appraiser comment"

## Priority
**MEDIUM** - Comments work but go to wrong fields. Users can manually edit in Valcre.

## Related Code
The API endpoint `/api/valcre.ts` correctly expects these fields:
- Line 810: `Comments: jobData.InternalComments || ""`
- Line 813-814: `ClientComments: jobData.ClientComments || jobData.SpecialInstructions || ""`

The webhook just needs to send the right field names.
