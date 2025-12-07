# DocuSeal LOE Field Mapping Reference

**Last Updated**: 2025-11-13
**Status**: Production
**Purpose**: Complete field mapping for Letter of Engagement (LOE) e-signature documents

---

## Table of Contents

1. [Overview](#overview)
2. [DocuSeal Configuration](#docuseal-configuration)
3. [Field Mapping: Dashboard → DocuSeal](#field-mapping-dashboard--docuseal)
4. [Field Categories](#field-categories)
5. [Special Field Handling](#special-field-handling)
6. [Validation Logic](#validation-logic)
7. [Submission Process](#submission-process)
8. [ClickUp Integration](#clickup-integration)
9. [Webhook Handling](#webhook-handling)
10. [Code References](#code-references)

---

## Overview

The DocuSeal integration enables clients to electronically sign Letter of Engagement (LOE) documents. The system maps data from the APR Dashboard (Section 1: Client/Property Info + Section 2: LOE Quote Details) to a pre-designed DocuSeal template.

### Key Characteristics

- **Template-Based**: Uses fixed DocuSeal template (ID: 1680270)
- **22 Total Fields**: Mix of text, numeric, and select fields
- **Auto-Population**: Client info and LOE details pre-filled
- **E-Signature**: Sent via email for electronic signature
- **Two Data Sources**: Combines `job` (Section 1) + `jobDetails` (Section 2)
- **ClickUp Sync**: Automatically marks "Create & Send LOE" checklist complete

### Integration Flow

```
Dashboard: LOE Quote Tab
    ↓
User clicks "Send for E-Signature"
    ↓
Validation Check (required fields)
    ↓
Map fields: job + jobDetails → DocuSeal template
    ↓
DocuSeal API: Create Submission
    ↓
DocuSeal sends email to client
    ↓
Update ClickUp checklist (LOE sent)
    ↓
Client signs document
    ↓
Webhook: submission.completed
    ↓
Store signed document URL
```

---

## DocuSeal Configuration

### API Configuration

**Code Reference**: Lines 6-8 in `/src/utils/webhooks/docuseal.ts`

```typescript
const DOCUSEAL_API_KEY = import.meta.env.VITE_DOCUSEAL_API_KEY;
const DOCUSEAL_TEMPLATE_ID = "1680270";
const DOCUSEAL_API_BASE = "https://api.docuseal.co";
```

| Setting | Value |
|---------|-------|
| API Base URL | `https://api.docuseal.co` |
| Template ID | `1680270` |
| API Key Source | Environment variable: `VITE_DOCUSEAL_API_KEY` |

### Template Information

**Template ID**: `1680270`
**Template Name**: "Letter of Engagement (LOE)"
**Created**: Pre-designed template with 22 fields
**Field Types**: Text, numeric, dropdown/select, signature

---

## Field Mapping: Dashboard → DocuSeal

### Complete Field Map

**Code Reference**: Lines 26-73 in `docuseal.ts` - `mapJobToDocuSealFields()`

| # | DocuSeal Field Name | Source | Dashboard Field | Type | Notes |
|---|---------------------|--------|-----------------|------|-------|
| 1 | `date_created` | Auto | Current date | Text | Auto-generated on submission |
| 2 | `date_signed` | Client | (empty) | Text | Filled when client signs |
| 3 | `company_name` | job | `clientOrganization` | Text | Optional, fallback to "" |
| 4 | `client_address` | job | `clientAddress` | Text | Optional, fallback to "" |
| 5 | `client_name` | job | `clientFirstName` + `clientLastName` | Text | Combined full name |
| 6 | `client_phone` | job | `clientPhone` | Text | Optional, fallback to "" |
| 7 | `client_title` | job | `clientTitle` | Text | Optional, fallback to "" |
| 8 | `client_email` | job | `clientEmail` | Text | **REQUIRED** |
| 9 | `property_address` | job | `propertyAddress` | Text | **REQUIRED** |
| 10 | `notes` | jobDetails / job | `specialInstructions` or `notes` | Text | Optional, fallback to "" |
| 11 | `scope_of_work` | jobDetails | `scopeOfWork` | Text | Optional, fallback to "" |
| 12 | `job_number` | jobDetails | `jobNumber` | Text | Optional, fallback to "" |
| 13 | `appraisal_fee` | jobDetails | `appraisalFee` | Numeric | Optional, fallback to 0 |
| 14 | `retainer_amount` | jobDetails | `retainerAmount` | Text/Numeric | Optional, fallback to "" |
| 15 | `property_type` | (empty) | N/A | Select | **EMPTY** (avoid overlay issues) |
| 16 | `intended_use` | (empty) | N/A | Select | **EMPTY** (avoid overlay issues) |
| 17 | `requested_value` | (empty) | N/A | Select | **EMPTY** (avoid overlay issues) |
| 18 | `property_rights` | (empty) | N/A | Select | **EMPTY** (avoid overlay issues) |
| 19 | `report_type` | (empty) | N/A | Select | **EMPTY** (avoid overlay issues) |
| 20 | `payment_terms` | (empty) | N/A | Select | **EMPTY** (avoid overlay issues) |
| 21 | `report_delivery` | (empty) | N/A | Select | **EMPTY** (avoid overlay issues) |
| 22 | `client_signature` | Client | (empty) | Signature | Filled when client signs |

---

## Field Categories

### Category 1: Date Fields

**Code Reference**: Lines 33-35 in `docuseal.ts`

```typescript
{ name: "date_created", value: currentDate },
{ name: "date_signed", value: "" },
```

| Field | Source | Value Logic |
|-------|--------|-------------|
| `date_created` | Auto-generated | `new Date().toLocaleDateString("en-US")` |
| `date_signed` | Client action | Empty on send, filled when signed |

**Date Format**: US locale (MM/DD/YYYY)
**Example**: `11/13/2025`

### Category 2: Client Information (8 fields)

**Code Reference**: Lines 37-46 in `docuseal.ts`

```typescript
{ name: "company_name", value: job.clientOrganization || "" },
{ name: "client_address", value: job.clientAddress || "" },
{ name: "client_name", value: `${job.clientFirstName} ${job.clientLastName}` },
{ name: "client_phone", value: job.clientPhone || "" },
{ name: "client_title", value: job.clientTitle || "" },
{ name: "client_email", value: job.clientEmail },
```

| Field | Required | Fallback | Notes |
|-------|----------|----------|-------|
| `company_name` | No | `""` | Organization name |
| `client_address` | No | `""` | Client's mailing address |
| `client_name` | Yes | N/A | Combined: "FirstName LastName" |
| `client_phone` | No | `""` | Phone number |
| `client_title` | No | `""` | Job title |
| `client_email` | **YES** | N/A | **REQUIRED for validation** |

**Name Concatenation**: `clientFirstName` + space + `clientLastName`
**Example**: `"John Smith"`

### Category 3: Property Details (3 fields)

**Code Reference**: Lines 48-50 in `docuseal.ts`

```typescript
{ name: "property_address", value: job.propertyAddress },
{ name: "notes", value: jobDetails.specialInstructions || job.notes || "" },
{ name: "scope_of_work", value: jobDetails.scopeOfWork || "" },
```

| Field | Required | Fallback Chain | Notes |
|-------|----------|----------------|-------|
| `property_address` | **YES** | N/A | **REQUIRED for validation** |
| `notes` | No | `specialInstructions` → `notes` → `""` | Cascading fallback |
| `scope_of_work` | No | `""` | Work description |

**Notes Fallback Logic**:
1. Try `jobDetails.specialInstructions` first
2. If empty, try `job.notes`
3. If empty, use `""`

### Category 4: Job/Appraisal Details (1 field)

**Code Reference**: Line 54 in `docuseal.ts`

```typescript
{ name: "job_number", value: jobDetails.jobNumber || "" },
```

| Field | Required | Fallback | Notes |
|-------|----------|----------|-------|
| `job_number` | No | `""` | Valcre job number (e.g., "CAL250137") |

**Note**: May be empty for new submissions before Valcre job created.

### Category 5: Financial Information (2 fields)

**Code Reference**: Lines 57-58 in `docuseal.ts`

```typescript
{ name: "appraisal_fee", value: jobDetails.appraisalFee || 0 },
{ name: "retainer_amount", value: jobDetails.retainerAmount || "" },
```

| Field | Type | Required | Fallback | Format |
|-------|------|----------|----------|--------|
| `appraisal_fee` | Numeric | No | `0` | Number (no $ or commas) |
| `retainer_amount` | Text/Numeric | No | `""` | As-is from Dashboard |

**Appraisal Fee**:
- Type: Numeric field in DocuSeal
- Value: Raw number (e.g., `2500`, not `"$2,500"`)
- Fallback: `0` if not set

**Retainer Amount**:
- Type: Text or Numeric (template dependent)
- Value: As stored in Dashboard
- Fallback: Empty string

### Category 6: SELECT Fields (7 fields) - INTENTIONALLY EMPTY

**Code Reference**: Lines 60-67 in `docuseal.ts`

```typescript
// SELECT FIELDS - FIXED FOR NO OVERLAY ISSUES
// These are dropdown fields in template - send empty to avoid conflicts
{ name: "property_type", value: "" },
{ name: "intended_use", value: "" },
{ name: "requested_value", value: "" },
{ name: "property_rights", value: "" },
{ name: "report_type", value: "" },
{ name: "payment_terms", value: "" },
{ name: "report_delivery", value: "" },
```

**CRITICAL**: All SELECT fields sent as **EMPTY** (`""`)

| Field | Why Empty? |
|-------|------------|
| `property_type` | Dropdown field - empty prevents text overlay issues |
| `intended_use` | Dropdown field - empty prevents text overlay issues |
| `requested_value` | Dropdown field - empty prevents text overlay issues |
| `property_rights` | Dropdown field - empty prevents text overlay issues |
| `report_type` | Dropdown field - empty prevents text overlay issues |
| `payment_terms` | Dropdown field - empty prevents text overlay issues |
| `report_delivery` | Dropdown field - empty prevents text overlay issues |

**Rationale** (from code comments):
> "These are dropdown fields in template - send empty to avoid conflicts"

**Issue Prevented**: When dropdown/select fields in DocuSeal template receive text values via API, they can cause overlay issues where text bleeds through or duplicates. Sending empty string forces client to select from dropdown manually, ensuring clean selection.

### Category 7: Signature Block (1 field)

**Code Reference**: Line 72 in `docuseal.ts`

```typescript
{ name: "client_signature", value: "" },
```

| Field | Source | Value on Send | Value After Signing |
|-------|--------|---------------|---------------------|
| `client_signature` | Client action | `""` (empty) | Electronic signature data |

**Behavior**: Client signs via DocuSeal web interface, signature captured automatically.

---

## Special Field Handling

### 1. Full Name Concatenation

**Code Reference**: Line 42 in `docuseal.ts`

```typescript
{ name: "client_name", value: `${job.clientFirstName} ${job.clientLastName}` }
```

**Input**:
- `job.clientFirstName = "John"`
- `job.clientLastName = "Smith"`

**Output**: `"John Smith"`

**Note**: No null check - assumes first and last name always exist (validated earlier in workflow).

### 2. Cascading Fallbacks

**Notes Field** (Line 50):

```typescript
{ name: "notes", value: jobDetails.specialInstructions || job.notes || "" }
```

**Fallback Chain**:
1. `jobDetails.specialInstructions` (Section 2 field)
2. `job.notes` (Section 1 field)
3. `""` (empty string)

**Use Case**: Section 2 notes take priority, but preserve Section 1 notes if Section 2 empty.

### 3. Numeric vs. Text Fallbacks

**Appraisal Fee** (numeric fallback):
```typescript
{ name: "appraisal_fee", value: jobDetails.appraisalFee || 0 }
```
- Fallback: `0` (number)
- Reason: Numeric field type in DocuSeal

**Retainer Amount** (text fallback):
```typescript
{ name: "retainer_amount", value: jobDetails.retainerAmount || "" }
```
- Fallback: `""` (empty string)
- Reason: Text/mixed field type in DocuSeal

### 4. SELECT Fields Intentionally Empty

**All SELECT fields** (Lines 60-67):
```typescript
{ name: "property_type", value: "" }
// ... etc
```

**Why**: DocuSeal template has dropdown/select fields. Sending text values can cause:
- Text overlay on top of dropdown
- Duplicate values displayed
- Formatting issues

**Solution**: Send empty string, client selects from dropdown when signing.

---

## Validation Logic

### Required Fields Check

**Code Reference**: Lines 75-110 in `docuseal.ts` - `validateRequiredFields()`

```typescript
export function validateRequiredFields(
  job: DetailJob,
  jobDetails: JobDetails,
): {
  isValid: boolean;
  missingFields: string[];
} {
  const missingFields: string[] = [];

  // Only require basic fields for preview
  if (!job.clientFirstName) missingFields.push("Client First Name");
  if (!job.clientLastName) missingFields.push("Client Last Name");
  if (!job.clientEmail) missingFields.push("Client Email");
  if (!job.propertyAddress) missingFields.push("Property Address");

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}
```

### Validation Rules

| Field | Required? | Validation Check |
|-------|-----------|------------------|
| `clientFirstName` | **YES** | Truthy check |
| `clientLastName` | **YES** | Truthy check |
| `clientEmail` | **YES** | Truthy check (no email format validation) |
| `propertyAddress` | **YES** | Truthy check |
| All others | No | Optional fields |

**Return Value**:
```typescript
{
  isValid: boolean,        // true if all required fields present
  missingFields: string[]  // Array of missing field names
}
```

**Example Error Return**:
```typescript
{
  isValid: false,
  missingFields: ["Client Email", "Property Address"]
}
```

### Optional Field Warnings (Disabled)

**Code Reference**: Lines 91-104 in `docuseal.ts`

```typescript
// Optional fields for preview (show warnings but don't block)
const warnings: string[] = [];
if (!jobDetails.jobNumber) warnings.push("Job Number (will use temporary)");
if (!jobDetails.appraisalFee) warnings.push("Appraisal Fee (will show TBD)");

// Only log warnings once per session to avoid console spam
// Commented out to prevent console spam - warnings are expected for new jobs
// if (warnings.length > 0 && typeof window !== "undefined") {
//   const warningKey = `docuseal_warning_${job.id}`;
//   if (!window.sessionStorage.getItem(warningKey)) {
//     console.log("⚠️ Preview warnings:", warnings);
//     window.sessionStorage.setItem(warningKey, "shown");
//   }
// }
```

**Status**: Warning system currently **DISABLED** (commented out)

**Reason** (from code comment):
> "Commented out to prevent console spam - warnings are expected for new jobs"

**Previous Logic**:
- Warn if `jobNumber` missing (expected for new jobs)
- Warn if `appraisalFee` missing (expected before LOE prepared)
- Use session storage to show warning once per job per session

---

## Submission Process

### API Submission Function

**Code Reference**: Lines 112-189 in `docuseal.ts` - `sendForESignature()`

### Step 1: Validate Required Fields

```typescript
const validation = validateRequiredFields(job, jobDetails);
if (!validation.isValid) {
  return {
    success: false,
    error: `Missing required fields: ${validation.missingFields.join(", ")}`,
  };
}
```

**Behavior**: If validation fails, return error immediately (do not call DocuSeal API).

**Error Example**:
```typescript
{
  success: false,
  error: "Missing required fields: Client Email, Property Address"
}
```

### Step 2: Map All Fields

```typescript
const fields = mapJobToDocuSealFields(job, jobDetails);
```

**Result**: Array of 22 field mappings (as documented above).

### Step 3: Prepare Submission Data

**Code Reference**: Lines 131-143 in `docuseal.ts`

```typescript
const submissionData: DocuSealSubmissionData = {
  template_id: parseInt(DOCUSEAL_TEMPLATE_ID),
  send_email: true,
  submitters: [
    {
      email: job.clientEmail,
      phone: job.clientPhone,
      name: `${job.clientFirstName} ${job.clientLastName}`,
      role: "First Party",
      fields: fields,
    },
  ],
};
```

**Submission Structure**:

| Key | Value | Notes |
|-----|-------|-------|
| `template_id` | `1680270` (as number) | Template to use |
| `send_email` | `true` | DocuSeal sends email automatically |
| `submitters` | Array with 1 submitter | Client who will sign |
| `submitters[0].email` | Client email | **REQUIRED** - where to send |
| `submitters[0].phone` | Client phone | Optional |
| `submitters[0].name` | Client full name | For display in email |
| `submitters[0].role` | `"First Party"` | Signer role in template |
| `submitters[0].fields` | Array of 22 fields | Pre-filled field data |

**IMPORTANT**: `template_id` converted to number via `parseInt()`

### Step 4: Call DocuSeal API

**Code Reference**: Lines 148-155 in `docuseal.ts`

```typescript
const response = await fetch(`${DOCUSEAL_API_BASE}/submissions`, {
  method: "POST",
  headers: {
    "X-Auth-Token": DOCUSEAL_API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(submissionData),
});
```

**API Details**:

| Item | Value |
|------|-------|
| Method | POST |
| Endpoint | `https://api.docuseal.co/submissions` |
| Auth Header | `X-Auth-Token: {API_KEY}` |
| Content-Type | `application/json` |
| Body | JSON-stringified submission data |

### Step 5: Handle Response

**Success Path** (Lines 163-165):

```typescript
const result = await response.json();
console.log("DocuSeal submission created:", result);
```

**Error Path** (Lines 157-161):

```typescript
if (!response.ok) {
  const errorText = await response.text();
  console.error("DocuSeal API error:", errorText);
  throw new Error(`DocuSeal API error: ${response.status}`);
}
```

**Return on Success** (Lines 178-181):

```typescript
return {
  success: true,
  submissionId: result[0]?.id || result.id,
};
```

**Note**: Handles both single object (`result.id`) and array (`result[0].id`) responses from DocuSeal API.

---

## ClickUp Integration

### Auto-Update ClickUp Checklist

**Code Reference**: Lines 166-176 in `docuseal.ts`

```typescript
// Update ClickUp checklist to mark LOE as sent
if (job.clickup_task_id || job.clickupTaskId) {
  const taskId = job.clickup_task_id || job.clickupTaskId;
  try {
    await markLOESent(taskId);
    console.log("✅ Updated ClickUp checklist: LOE marked as sent");
  } catch (error) {
    console.warn("Failed to update ClickUp checklist:", error);
    // Don't fail the DocuSeal operation if ClickUp update fails
  }
}
```

### ClickUp Checklist Function

**Code Reference**: Lines 283-285 in `docuseal.ts` (imported from `clickup.ts`)

```typescript
// Mark LOE as sent when DocuSeal is triggered
export async function markLOESent(taskId: string): Promise<{ success: boolean; error?: string }> {
  return updateClickUpChecklist(taskId, '1. Create & Send LOE', true);
}
```

### Integration Behavior

1. **Trigger**: After DocuSeal submission succeeds
2. **Check**: Verify ClickUp task ID exists in job record
3. **Action**: Mark checklist item "1. Create & Send LOE" as complete
4. **Error Handling**: Log warning but **DO NOT** fail DocuSeal operation if ClickUp update fails

**Field Name Variations Handled**:
- `job.clickup_task_id` (snake_case from database)
- `job.clickupTaskId` (camelCase from frontend)

**Checklist Item Updated**: "1. Create & Send LOE"
**Status Change**: Unchecked → Checked (✓)

---

## Webhook Handling

### Webhook Interface

**Code Reference**: Lines 192-210 in `docuseal.ts`

```typescript
export interface DocuSealWebhookPayload {
  event_type: "submission.completed" | "submission.created";
  data: {
    id: string;
    status: string;
    email: string;
    created_at: string;
    completed_at?: string;
    documents?: Array<{
      id: string;
      name: string;
      url: string;
    }>;
    submission_events?: Array<{
      event_type: string;
      event_timestamp: string;
    }>;
  };
}
```

### Webhook Events

| Event Type | When Fired | Use Case |
|------------|------------|----------|
| `submission.created` | DocuSeal creates submission and sends email | Optional tracking |
| `submission.completed` | Client finishes signing document | **PRIMARY EVENT** - retrieve signed PDF |

### Document Completion Handler

**Code Reference**: Lines 212-235 in `docuseal.ts`

```typescript
export async function handleDocuSealWebhook(
  payload: DocuSealWebhookPayload,
): Promise<{ success: boolean; documentUrl?: string }> {
  try {
    if (payload.event_type === "submission.completed") {
      // Document has been signed
      const signedDocument = payload.data.documents?.[0];

      if (signedDocument) {
        console.log("Document signed:", signedDocument);

        return {
          success: true,
          documentUrl: signedDocument.url,
        };
      }
    }

    return { success: false };
  } catch (error) {
    console.error("Error handling DocuSeal webhook:", error);
    return { success: false };
  }
}
```

### Webhook Processing Logic

**Step 1**: Check event type
- Only process `submission.completed` events
- Ignore other event types

**Step 2**: Extract signed document
- Get first document from `payload.data.documents[]` array
- Document contains: `id`, `name`, `url`

**Step 3**: Return document URL
- Success: `{ success: true, documentUrl: "https://..." }`
- Failure: `{ success: false }`

### Signed Document Structure

**Example Document Object**:
```typescript
{
  id: "doc_abc123",
  name: "LOE - John Smith - Sparwood McDonalds.pdf",
  url: "https://api.docuseal.co/submissions/sub_xyz789/documents/doc_abc123"
}
```

**Document URL**: Direct link to signed PDF
**Use Case**: Store URL in database, display to team, archive for records

---

## Code References

### Primary File

**Path**: `/src/utils/webhooks/docuseal.ts`
**Lines**: 236 total
**Purpose**: Complete DocuSeal LOE integration logic

### Key Functions

| Function | Lines | Purpose |
|----------|-------|---------|
| `mapJobToDocuSealFields()` | 26-73 | Map Dashboard fields → DocuSeal template |
| `validateRequiredFields()` | 75-110 | Check required fields before submission |
| `sendForESignature()` | 112-189 | Main submission function |
| `handleDocuSealWebhook()` | 212-235 | Process webhook when document signed |

### Data Types

| Type | Lines | Purpose |
|------|-------|---------|
| `DocuSealSubmissionData` | 10-23 | API submission payload structure |
| `DocuSealWebhookPayload` | 192-210 | Webhook event structure |

### External Dependencies

**ClickUp Integration** (imported):
```typescript
import { markLOESent } from "./clickup";
```

**Supabase Client** (imported):
```typescript
import { supabase } from "@/integrations/supabase/client";
```

**Type Definitions** (imported):
```typescript
import { DetailJob, JobDetails } from "@/types/job";
```

---

## Implementation Notes

### Email Delivery

**Automatic**: DocuSeal sends email immediately upon successful submission
**Recipient**: `job.clientEmail`
**Content**: Email includes link to sign document online
**Template**: Controlled by DocuSeal template settings (not in code)

### Field Pre-Population

**All 22 fields** sent via API are pre-populated in the document the client sees.

**Editable vs. Read-Only**: Controlled by DocuSeal template field settings (not in code).

**Expected Behavior**:
- Text fields (client name, property address, etc.): Read-only
- SELECT fields (property type, intended use, etc.): Editable dropdowns
- Signature field: Must be signed by client
- Date signed: Auto-filled when signed

### Error Handling

**Validation Errors** (before API call):
```typescript
return {
  success: false,
  error: "Missing required fields: Client Email, Property Address"
};
```

**API Errors** (from DocuSeal):
```typescript
return {
  success: false,
  error: "DocuSeal API error: 400"
};
```

**ClickUp Update Errors** (non-blocking):
```typescript
console.warn("Failed to update ClickUp checklist:", error);
// Continue - don't fail DocuSeal operation
```

### Logging

**Console Logs**:
- Submission data (Line 145): `console.log("Sending to DocuSeal:", submissionData)`
- Success (Line 164): `console.log("DocuSeal submission created:", result)`
- ClickUp update (Line 171): `console.log("✅ Updated ClickUp checklist: LOE marked as sent")`
- Webhook events (Line 221): `console.log("Document signed:", signedDocument)`

**Error Logs**:
- API errors (Line 159): `console.error("DocuSeal API error:", errorText)`
- ClickUp warnings (Line 173): `console.warn("Failed to update ClickUp checklist:", error)`
- Webhook errors (Line 232): `console.error("Error handling DocuSeal webhook:", error)`

---

## Known Issues

### Issue 1: SELECT Fields Not Auto-Populated

**Problem**: All SELECT/dropdown fields sent as empty string (`""`).

**Impact**: Client must manually select from dropdowns when signing (property type, intended use, etc.).

**Current Workaround**: Intentional design to avoid text overlay issues.

**Potential Fix**: Map Dashboard values to DocuSeal dropdown option IDs (requires DocuSeal API field option discovery).

### Issue 2: No Email Format Validation

**Problem**: `validateRequiredFields()` checks if email exists but doesn't validate format.

**Impact**: Invalid email (e.g., "notanemail") passes validation, then fails at DocuSeal API.

**Current Behavior**: Error caught at API level, not validation level.

**Potential Fix**: Add regex email validation:
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!job.clientEmail || !emailRegex.test(job.clientEmail)) {
  missingFields.push("Valid Client Email");
}
```

### Issue 3: Date Format Hardcoded to US Locale

**Problem**: `new Date().toLocaleDateString("en-US")` always uses US format (MM/DD/YYYY).

**Impact**: International clients may expect different date formats (DD/MM/YYYY).

**Current Behavior**: Always US format regardless of client location.

**Potential Fix**: Use client locale or make configurable:
```typescript
const dateFormat = navigator.language || "en-US";
const currentDate = new Date().toLocaleDateString(dateFormat);
```

---

## Future Enhancements

### Potential Additions

1. **SELECT Field Mapping**: Auto-populate dropdown fields instead of leaving empty
2. **Email Validation**: Validate email format before API submission
3. **Phone Validation**: Validate phone number format
4. **Custom Email Templates**: Customize email sent to client
5. **Multiple Signers**: Support for multiple signatures (client + appraiser)
6. **Document Attachments**: Attach additional files to LOE
7. **Reminder Emails**: Automatic reminders if client doesn't sign within X days
8. **Locale Support**: International date formats based on client location

### Webhook Enhancements

1. **Database Storage**: Auto-save signed document URL to database
2. **ClickUp Update**: Mark "2. Receive Signed LOE" checklist complete on signature
3. **Notification System**: Alert team when LOE signed
4. **Valcre Sync**: Update Valcre job with signed LOE status
5. **Audit Trail**: Log all signature events for compliance

---

**END OF DOCUMENT**

---

## Document History

| Date | Change | Author |
|------|--------|--------|
| 2025-11-13 | Initial creation, reverse-engineered from production code | API Documenter (Claude) |

**Sources**:
- `/src/utils/webhooks/docuseal.ts` (Lines 1-236)
- DocuSeal API documentation (https://api.docuseal.co)
- Template ID: 1680270 (production template)
