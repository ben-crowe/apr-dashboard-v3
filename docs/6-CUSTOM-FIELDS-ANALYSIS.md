# Valcre Custom Fields - Implementation Analysis

**Date:** November 13, 2025
**Status:** Analysis & Recommendations
**Purpose:** Review 10 additional Valcre custom fields and determine implementation strategy

---

## Table of Contents

1. [Overview](#overview)
2. [Custom Fields List](#custom-fields-list)
3. [Field Analysis by Category](#field-analysis-by-category)
   - [Lender Information Fields](#lender-information-fields)
   - [Valuation Premise Fields](#valuation-premise-fields)
   - [Appraised Value Fields](#appraised-value-fields)
4. [Current State](#current-state)
5. [Implementation Recommendations](#implementation-recommendations)
6. [Technical Implementation Details](#technical-implementation-details)
7. [UI/UX Considerations](#uiux-considerations)
8. [Decision Matrix](#decision-matrix)

---

## Overview

Your client has created 10 custom fields in Valcre that are currently not mapped from the Dashboard. This document analyzes each field group and provides implementation recommendations.

**Custom Fields Identified:**
1. Lender Company Name
2. Lender Company Address
3. Lender Contact Name
4. Lender Contact Email
5. Lender Contact Phone
6. Lender Contact Title
7. Valuation Premise - 1
8. Valuation Premise - 2
9. Appraised Value - 1
10. Appraised Value - 2

---

## Custom Fields List

### From Your Screenshot Analysis

Based on the Valcre interface screenshot provided, these custom fields appear in the Job details section:

| Field Name | Field Type | Current Status | Priority |
|-----------|-----------|----------------|----------|
| **Lender Company Name** | Text | Not implemented | Medium |
| **Lender Company Address** | Text | Not implemented | Medium |
| **Lender Contact Name** | Text | Not implemented | Medium |
| **Lender Contact Email** | Email | Not implemented | Medium |
| **Lender Contact Phone** | Phone | Not implemented | Medium |
| **Lender Contact Title** | Text | Not implemented | Low |
| **Valuation Premise - 1** | Dropdown | Not implemented | **HIGH** |
| **Valuation Premise - 2** | Dropdown | Not implemented | Medium |
| **Appraised Value - 1** | Currency | Not implemented | Medium |
| **Appraised Value - 2** | Currency | Not implemented | Medium |

---

## Field Analysis by Category

### Lender Information Fields

**Fields:** 6 fields (Company Name/Address, Contact Name/Email/Phone/Title)

**Purpose:** Capture information about the lending institution when the appraisal is for financing purposes.

**Current Implementation:**
- ❌ No lender fields exist in Dashboard
- ❌ No database columns for lender data
- ❌ No API mappings

**Use Case Analysis:**
- **When Needed:** Only when "Intended Use" = "Financing Purposes" or similar
- **Client Workflow:** If client is refinancing or purchasing with a loan, lender details are required
- **Frequency:** Estimated 60-70% of appraisals (most are for financing)

**Valcre Custom Field Names (Expected):**
```typescript
LenderCompanyName: string
LenderCompanyAddress: string
LenderContactName: string
LenderContactEmail: string
LenderContactPhone: string
LenderContactTitle: string
```

**Recommendation:** ⭐ **IMPLEMENT**

**Rationale:**
- High-frequency use case (most appraisals are for financing)
- Complete set of 6 fields provides professional lender contact management
- Conditional visibility keeps UI clean for non-financing appraisals
- Mirrors standard industry practice (Fannie Mae, Freddie Mac forms all capture lender info)

---

### Valuation Premise Fields

**Fields:** Valuation Premise - 1, Valuation Premise - 2

**Purpose:** Specify one or more valuation scenarios (e.g., "As Is", "As Stabilized", "As Complete")

**Current Implementation:**
- ✅ Dashboard has `valuationPremises` dropdown field
- ✅ Client form captures "Valuation Premises"
- ⚠️ **Currently maps to WRONG field** - maps to standard Valcre `RequestedValues` enum
- ❌ Does NOT map to custom "Valuation Premise - 1" field

**The Problem:**

Your codebase currently maps `valuationPremises` to the **standard Valcre enum field** called `RequestedValues`:

```typescript
// api/valcre.ts Line 947
jobCreateData.RequestedValues = converted;
```

But your client created **custom dropdown fields** named:
- "Valuation Premise - 1"
- "Valuation Premise - 2"

These are DIFFERENT fields!

**Valcre Field Comparison:**

| Field Type | Field Name | Values | Current Mapping |
|-----------|-----------|--------|----------------|
| **Standard Enum** | `RequestedValues` | AsIs, MarketRentStudy, Liquidation, etc. | ✅ Currently mapped |
| **Custom Field 1** | `Valuation Premise - 1` | As Is, As Stabilized, As If Renovated, etc. | ❌ Not mapped |
| **Custom Field 2** | `Valuation Premise - 2` | As Is, As Stabilized, As If Renovated, etc. | ❌ Not mapped |

**Client Form Options (from IMPLEMENTATION-STATUS.md):**
```
- Market Value: As Is
- Market Value: As Is & As Stabilized
- Market Value: As Complete & As Stabilized
- Market Value: Land As Is & As Complete & As Stabilized
- Market Value: Land As Is
- Market Value: Land As Is & As Rezoned
```

**Valcre Custom Field Options (from IMPLEMENTATION-STATUS.md):**
```
- As Is
- As Stabilized
- As If Renovated & Stabilized
- As If Complete & Stabilized
- As Is Vacant Land
- As If Vacant Land
- As If Rezoned
- As If Serviced
- As If Subdivided
```

**Notice:** Client form has combo options like "As Is **& As Stabilized**" - this suggests need for BOTH fields.

**Recommendation:** ⭐⭐⭐ **IMPLEMENT - HIGHEST PRIORITY**

**Rationale:**
- Field already exists in Dashboard UI
- Currently mapping to wrong Valcre field
- Client explicitly created custom fields for this purpose
- Multi-scenario support requires both fields (e.g., "As Is" in field 1, "As Stabilized" in field 2)

**Implementation Strategy:**

**Option A: Map to Custom Fields Only** (RECOMMENDED)
- Stop mapping to `RequestedValues`
- Parse client form value and extract scenarios
- Map first scenario to "Valuation Premise - 1"
- Map second scenario (if exists) to "Valuation Premise - 2"

Example:
```typescript
// Input: "Market Value: As Is & As Stabilized"
// Parse to:
ValuationPremise1: "As Is"
ValuationPremise2: "As Stabilized"
```

**Option B: Dual Mapping** (More complex)
- Keep mapping to `RequestedValues` (backward compatibility)
- ALSO map to custom "Valuation Premise - 1" and "Valuation Premise - 2"
- Risk of data redundancy

**Recommended:** Option A - cleaner implementation, matches client's intent.

---

### Appraised Value Fields

**Fields:** Appraised Value - 1, Appraised Value - 2

**Purpose:** Capture the final appraised value(s) resulting from the appraisal

**Current Implementation:**
- ❌ No appraised value fields in Dashboard
- ❌ No database columns
- ❌ No API mappings

**Use Case Analysis:**
- **When Needed:** AFTER appraisal is completed
- **Workflow Timing:** This is a RESULT field, not an input field
- **Dashboard Section:** Would belong in a "Completed Appraisal" or "Results" section

**Why Two Fields?**
- Matches the two Valuation Premise fields
- Example:
  - Valuation Premise 1: "As Is" → Appraised Value 1: $850,000
  - Valuation Premise 2: "As Stabilized" → Appraised Value 2: $1,200,000

**Recommendation:** ⚠️ **DEFER - NOT CRITICAL**

**Rationale:**
- These are OUTPUT fields (appraisal results), not INPUT fields (engagement details)
- Current Dashboard focuses on pre-engagement and LOE phase
- No workflow currently exists for entering final appraisal values
- Lower priority than engagement/LOE fields

**Future Implementation:**
If you want to add this later, create a new Dashboard section:
- Section Name: "Appraisal Results" or "Final Values"
- Timing: Only visible after Valcre job status = "Completed" or similar
- Fields: Appraised Value 1, Appraised Value 2, Date of Value, Effective Date

---

## Current State

### What's Working Today

| Feature | Status | Details |
|---------|--------|---------|
| Client Form Submission | ✅ | Captures all engagement details |
| Valcre Job Creation | ✅ | Auto-creates job with client/property |
| Standard Field Mapping | ✅ | Fee, Retainer, Due Date, etc. |
| Comment Fields | ✅ | General, Client, Delivery, Payment |
| Property Types | ✅ | Multi-type support working |

### What's NOT Working

| Field Category | Issue | Impact |
|---------------|-------|--------|
| **Lender Information** | No fields exist | Cannot capture lender details for financing appraisals |
| **Valuation Premise Custom Fields** | Mapping to wrong field | Client's custom fields remain empty |
| **Appraised Values** | No fields exist | Cannot record final appraisal values |

---

## Implementation Recommendations

### Priority 1: Valuation Premise - 1 & 2 ⭐⭐⭐

**Why First:**
- Dashboard field already exists
- Currently broken (maps to wrong Valcre field)
- Client explicitly created these custom fields
- Quick win - mostly configuration, not new UI

**Implementation Complexity:** 🟡 MEDIUM

**Estimated Effort:** 2-3 hours

**Files to Modify:**
1. `/api/valcre.ts` - Change mapping from `RequestedValues` to custom fields
2. `/src/utils/webhooks/valcre.ts` - Update payload builder
3. Add value parsing logic for combo scenarios

**Steps:**
1. Determine Valcre API field names for custom fields (likely `ValuationPremise1`, `ValuationPremise2`)
2. Create parsing function to split combo values (e.g., "As Is & As Stabilized" → ["As Is", "As Stabilized"])
3. Update API to send to custom fields instead of `RequestedValues`
4. Test with all client form options

---

### Priority 2: Lender Information Fields ⭐⭐

**Why Second:**
- High-frequency use case (most appraisals involve financing)
- Professional feature expected in appraisal software
- Conditional visibility keeps UI clean

**Implementation Complexity:** 🟠 MEDIUM-HIGH

**Estimated Effort:** 4-6 hours

**Database Changes Required:**
```sql
-- Migration: 20251113_add_lender_fields.sql
ALTER TABLE job_loe_details
ADD COLUMN IF NOT EXISTS lender_company_name TEXT,
ADD COLUMN IF NOT EXISTS lender_company_address TEXT,
ADD COLUMN IF NOT EXISTS lender_contact_name TEXT,
ADD COLUMN IF NOT EXISTS lender_contact_email TEXT,
ADD COLUMN IF NOT EXISTS lender_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS lender_contact_title TEXT;
```

**UI/UX Design:**

**Option A: Always Visible**
```tsx
<SectionGroup title="Lender Information">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Field label="Lender Company Name:" name="lenderCompanyName" />
    <Field label="Lender Company Address:" name="lenderCompanyAddress" />
    <Field label="Contact Name:" name="lenderContactName" />
    <Field label="Contact Email:" name="lenderContactEmail" />
    <Field label="Contact Phone:" name="lenderContactPhone" />
    <Field label="Contact Title:" name="lenderContactTitle" />
  </div>
</SectionGroup>
```

**Option B: Conditional (Recommended)**
Show only when "Intended Use" includes "Financing" or similar:

```tsx
{intendedUse?.includes('Financing') && (
  <SectionGroup title="Lender Information">
    ...
  </SectionGroup>
)}
```

**Files to Modify:**
1. Database migration
2. `/src/components/dashboard/job-details/LoeQuoteSection.tsx` - Add UI section
3. `/src/types/job.ts` - Add field types
4. `/api/valcre.ts` - Add API mappings
5. `/src/utils/webhooks/valcre.ts` - Add webhook mappings
6. `/src/hooks/useJobDetail.ts` - Add field mappings

**API Field Names (Expected):**
```typescript
LenderCompanyName: string
LenderCompanyAddress: string
LenderContactName: string
LenderContactEmail: string
LenderContactPhone: string
LenderContactTitle: string
```

---

### Priority 3: Appraised Value Fields ⭐

**Why Last:**
- Output fields, not input fields
- No current workflow for entering final values
- Lower business priority than engagement details

**Implementation Complexity:** 🟡 MEDIUM

**Estimated Effort:** 3-4 hours

**Recommendation:** DEFER until Dashboard adds "Appraisal Results" section

---

## Technical Implementation Details

### Valcre API Field Name Detection

**Challenge:** We need to determine the exact API field names Valcre uses for these custom fields.

**Likely Patterns:**

| Display Name | Likely API Name (CamelCase) |
|--------------|---------------------------|
| Lender Company Name | `LenderCompanyName` |
| Lender Company Address | `LenderCompanyAddress` |
| Lender Contact Name | `LenderContactName` |
| Lender Contact Email | `LenderContactEmail` |
| Lender Contact Phone | `LenderContactPhone` |
| Lender Contact Title | `LenderContactTitle` |
| Valuation Premise - 1 | `ValuationPremise1` or `ValuationPremise_1` |
| Valuation Premise - 2 | `ValuationPremise2` or `ValuationPremise_2` |
| Appraised Value - 1 | `AppraisedValue1` or `AppraisedValue_1` |
| Appraised Value - 2 | `AppraisedValue2` or `AppraisedValue_2` |

**Verification Method:**
1. Create a test job in Valcre manually
2. Fill in these custom fields
3. Fetch job via API: `GET /api/jobs/{id}`
4. Inspect response JSON to see exact field names

---

### Valuation Premise Parsing Logic

**Problem:** Client form has combo values like "Market Value: As Is & As Stabilized"

**Solution:** Parse and split into two fields

```typescript
// New utility function
function parseValuationPremises(rawValue: string): {
  premise1: string | null;
  premise2: string | null;
} {
  // Remove "Market Value:" prefix if present
  const cleaned = rawValue.replace(/^Market Value:\s*/i, '').trim();

  // Check for "&" separator indicating multiple scenarios
  if (cleaned.includes('&')) {
    const parts = cleaned.split('&').map(s => s.trim());
    return {
      premise1: parts[0] || null,
      premise2: parts[1] || null,
    };
  }

  // Single scenario
  return {
    premise1: cleaned,
    premise2: null,
  };
}

// Usage in api/valcre.ts
if (jobData.valuationPremises) {
  const { premise1, premise2 } = parseValuationPremises(jobData.valuationPremises);

  if (premise1) {
    jobCreateData.ValuationPremise1 = premise1;
  }
  if (premise2) {
    jobCreateData.ValuationPremise2 = premise2;
  }
}
```

**Example Transformations:**

| Client Form Input | Premise 1 | Premise 2 |
|------------------|-----------|-----------|
| "Market Value: As Is" | "As Is" | null |
| "Market Value: As Is & As Stabilized" | "As Is" | "As Stabilized" |
| "Market Value: As Complete & As Stabilized" | "As Complete" | "As Stabilized" |
| "Market Value: Land As Is & As Rezoned" | "Land As Is" | "As Rezoned" |

---

## UI/UX Considerations

### Dashboard Section Organization

**Current Sections:**
1. Client Submission (Section 1) - Client and property details
2. LOE & Quote (Section 2) - Fee, retainer, dates, comments

**Proposed New Section:**
3. **Lender Information** (NEW) - Conditional section for financing appraisals

**Layout Mockup:**

```
┌─────────────────────────────────────────────────────┐
│ LOE & Quote Details                                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│ [Existing fields: Fee, Retainer, Dates, etc.]      │
│                                                      │
├─────────────────────────────────────────────────────┤
│ Lender Information                                   │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Company Name:        [_______________]               │
│ Company Address:     [_______________]               │
│                                                      │
│ Contact Name:        [_______________]               │
│ Contact Email:       [_______________]               │
│ Contact Phone:       [_______________]               │
│ Contact Title:       [_______________]               │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Responsive Grid Layout

Following the pattern established in the Comments section:

```tsx
<SectionGroup title="Lender Information">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
    {/* Left Column */}
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-400">Company Name:</label>
      <Input
        name="lenderCompanyName"
        value={jobDetails.lenderCompanyName || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="e.g., Wells Fargo Bank"
      />
    </div>

    {/* Right Column */}
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-400">Company Address:</label>
      <Input
        name="lenderCompanyAddress"
        value={jobDetails.lenderCompanyAddress || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="e.g., 123 Main St, Calgary AB"
      />
    </div>

    {/* Row 2 */}
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-400">Contact Name:</label>
      <Input
        name="lenderContactName"
        value={jobDetails.lenderContactName || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="e.g., John Smith"
      />
    </div>

    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-400">Contact Email:</label>
      <Input
        type="email"
        name="lenderContactEmail"
        value={jobDetails.lenderContactEmail || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="e.g., john.smith@wellsfargo.com"
      />
    </div>

    {/* Row 3 */}
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-400">Contact Phone:</label>
      <Input
        type="tel"
        name="lenderContactPhone"
        value={jobDetails.lenderContactPhone || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="e.g., (403) 555-1234"
      />
    </div>

    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-400">Contact Title:</label>
      <Input
        name="lenderContactTitle"
        value={jobDetails.lenderContactTitle || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="e.g., Loan Officer"
      />
    </div>
  </div>
</SectionGroup>
```

---

## Decision Matrix

| Field Group | Implement Now? | Priority | Complexity | Business Value |
|-------------|---------------|----------|------------|----------------|
| **Valuation Premise 1 & 2** | ✅ YES | **HIGH** | Medium | HIGH - Fixes broken mapping |
| **Lender Information (6 fields)** | ✅ YES | Medium | Medium-High | HIGH - Common use case |
| **Appraised Values 1 & 2** | ❌ DEFER | Low | Medium | LOW - Output field, no workflow yet |

---

## Next Steps

### Recommended Implementation Order

**Phase 1: Quick Win (2-3 hours)**
- [ ] Fix Valuation Premise mapping to use custom fields instead of `RequestedValues`
- [ ] Add parsing logic for combo scenarios
- [ ] Test with all client form options
- [ ] Update documentation

**Phase 2: Lender Fields (4-6 hours)**
- [ ] Create database migration for 6 lender fields
- [ ] Add UI section to LoeQuoteSection.tsx
- [ ] Add TypeScript types
- [ ] Add API mappings in api/valcre.ts
- [ ] Add webhook mappings
- [ ] Test conditional visibility (if using that approach)
- [ ] Update documentation

**Phase 3: Future Enhancement (Deferred)**
- [ ] Add "Appraisal Results" section to Dashboard
- [ ] Implement Appraised Value 1 & 2 fields
- [ ] Add workflow for entering final values after appraisal completion

---

## Questions for Client (Chris)

Before implementing, confirm with client:

1. **Valuation Premise Mapping:**
   - Should we STOP mapping to standard `RequestedValues` field?
   - Should we map ONLY to custom "Valuation Premise - 1" and "Valuation Premise - 2"?
   - Recommended: YES - use custom fields only

2. **Lender Fields Visibility:**
   - Should lender fields always be visible?
   - Or only when "Intended Use" includes "Financing"?
   - Recommended: Conditional visibility (cleaner UX)

3. **Lender Fields Source:**
   - Should these be added to CLIENT FORM (pre-submission)?
   - Or only in DASHBOARD (post-submission)?
   - Recommended: Dashboard only (LOE phase)

4. **Appraised Values:**
   - Are these needed now, or can we defer?
   - Recommended: DEFER until appraisal completion workflow exists

---

## Documentation Updates Needed

After implementation, update these docs:

1. **`/docs/1-API-FIELD-MAPPING-REFERENCE.md`**
   - Add Lender fields to field mapping table
   - Update Valuation Premise section to show custom field mapping
   - Add Appraised Value fields to "Future Enhancements" section

2. **`/docs/IMPLEMENTATION-STATUS.md`**
   - Mark Valuation Premise as ✅ Implemented
   - Add Lender Information to "Recently Implemented" section
   - Update "Features to Implement" section

3. **Create new doc:** `/docs/LENDER-INFORMATION-GUIDE.md`
   - Usage guide for lender fields
   - When to use them
   - Best practices for data entry

---

## Summary

**IMPLEMENT NOW:**
1. ✅ Valuation Premise 1 & 2 - **Quick fix, high impact**
2. ✅ Lender Information (6 fields) - **Common use case, professional feature**

**DEFER:**
3. ❌ Appraised Values 1 & 2 - **Output fields, no workflow yet**

**Total Estimated Effort:** 6-9 hours for both Priority 1 & 2

**Expected Benefits:**
- Fix broken Valuation Premise mapping
- Support multi-scenario appraisals properly
- Capture lender information for financing appraisals
- Professional feature set matching industry standards
- All Valcre custom fields properly utilized

---

**Document Status:** ✅ Complete
**Created:** November 13, 2025
**Next Action:** Review with client and proceed with Phase 1 implementation
