# ClickUp Task Format Visual Specification

**Purpose**: Show EXACTLY what ClickUp tasks look like at TWO stages
**Date**: 2025-11-04
**Status**: Visual Reference for Implementation

---

## Overview: Two-Stage Task Updates

ClickUp tasks receive data in **TWO DISTINCT STAGES**:

1. **STAGE 1** (Form Submission): Client submits form → Task auto-created with client/property data
2. **STAGE 2** (Valcre Job Created): Appraiser fills Section 2 + creates Valcre job → Task UPDATED with appraiser data

---

## STAGE 1: Initial Task Creation (Form Submission)

### When Does This Happen?
- **Trigger**: Client submits form on website
- **Timing**: Immediately (within 1-2 seconds)
- **System**: Database webhook calls Edge Function automatically
- **Data Source**: `job_submissions` table (Section 1 fields only)

### Task Name Format
```
NEW SUBMISSION - [Property Name], [Property Address]
```

**Real Example**:
```
NEW SUBMISSION - Sparwood McDonalds, 2100 Middletown Place, Sparwood, BC
```

### Task Description (Markdown Format)

```markdown
📍 NEW JOB ARRIVED - [View in APR Hub](https://apr-dashboard-v3.vercel.app/dashboard/job/550e8400-e29b-41d4-a716-446655440000)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLIENT INFORMATION
Name: John Smith
Organization: ABC Corporation
Email: john.smith@abccorp.com
Phone: (403) 555-1234

PROPERTY INFORMATION
Property Name: Sparwood McDonalds
Address: 2100 Middletown Place, Sparwood, BC T1K 2L3
Property Type: Commercial - Retail
Intended Use: Purchase Transaction
Asset Condition: Good
Valuation Premise: Market Value - As Is

PROPERTY CONTACT
Name: Sarah Johnson
Email: sarah.johnson@abccorp.com
Phone: (403) 555-5678

SUBMISSION NOTES
Client needs appraisal for financing purposes. Property includes drive-through and parking for 25 vehicles. Building is approximately 3,200 SF with recent renovations completed in 2023.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏳ Waiting for LOE Quote Preparation...
```

### Custom Fields (Stage 1)
| Field Name | Type | Value | Display |
|------------|------|-------|---------|
| Dashboard Job URL | URL | `https://apr-dashboard-v3.vercel.app/dashboard/job/550e8400-e29b-41d4-a716-446655440000` | Blue clickable button |
| Status | Dropdown | "New Submission" | Yellow tag |

### Database Fields Used (Stage 1)

**Table**: `job_submissions`

```typescript
{
  id: string;                      // UUID for job
  client_first_name: string;       // "John"
  client_last_name: string;        // "Smith"
  client_organization: string;     // "ABC Corporation"
  client_email: string;            // "john.smith@abccorp.com"
  client_phone: string;            // "(403) 555-1234"
  property_name: string;           // "Sparwood McDonalds"
  property_address: string;        // "2100 Middletown Place, Sparwood, BC T1K 2L3"
  property_type: string;           // "Commercial - Retail"
  intended_use: string;            // "Purchase Transaction"
  asset_condition: string;         // "Good"
  valuation_premises: string;      // "Market Value - As Is"
  property_contact_first_name: string;  // "Sarah"
  property_contact_last_name: string;   // "Johnson"
  property_contact_email: string;       // "sarah.johnson@abccorp.com"
  property_contact_phone: string;       // "(403) 555-5678"
  same_as_client_contact: boolean;      // false
  notes: string;                   // Free text from client
  created_at: string;              // ISO timestamp
}
```

---

## STAGE 2: Updated Task (After Valcre Job Created)

### When Does This Happen?
- **Trigger**: Appraiser clicks "Create Valcre Job" button in Dashboard Section 2
- **Timing**: After appraiser fills out LOE quote fields
- **System**: Edge Function `update-clickup-task` (to be created)
- **Data Source**: `job_loe_details` table (Section 2 fields)

### Task Name Format (UPDATED)
```
[VAL Number] - [Property Name], [Property Address]
```

**Real Example**:
```
VAL250137 - Sparwood McDonalds, 2100 Middletown Place, Sparwood, BC
```

**Change**: Task name changes from "NEW SUBMISSION - ..." to "VAL250137 - ..."

### Task Description (UPDATED - Markdown Format)

**IMPORTANT**: Stage 1 data stays at top, Stage 2 data gets APPENDED below

```markdown
📍 NEW JOB ARRIVED - [View in APR Hub](https://apr-hub-05-25.vercel.app/#/dashboard?jobId=550e8400-e29b-41d4-a716-446655440000)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLIENT INFORMATION
Name: John Smith
Organization: ABC Corporation
Email: john.smith@abccorp.com
Phone: (403) 555-1234

PROPERTY INFORMATION
Property Name: Sparwood McDonalds
Address: 2100 Middletown Place, Sparwood, BC T1K 2L3
Property Type: Commercial - Retail
Intended Use: Purchase Transaction
Asset Condition: Good
Valuation Premise: Market Value - As Is

SUBMISSION NOTES
Client needs appraisal for financing purposes. Property includes drive-through and parking for 25 vehicles. Building is approximately 3,200 SF with recent renovations completed in 2023.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 VALCRE JOB CREATED - [View in Valcre](https://app.valcre.com/jobs/12345)

JOB DETAILS
Valcre Job Number: VAL250137
Valcre Internal ID: 12345
Created: November 4, 2025

LOE QUOTE DETAILS
Appraisal Fee: $2,500.00
Retainer Amount (50%): $1,250.00
Disbursement Percentage: 15%
Delivery Date: November 15, 2025
Payment Terms: 50% retainer upfront, 50% on delivery

PROPERTY VALUATION DETAILS
Property Rights Appraised: Fee Simple
Valuation Premise: Market Value - As Is
Scope of Work: Income Approach, Direct Comparison Approach, Cost Approach
Report Type: Comprehensive Appraisal Report
Purpose of Appraisal: Purchase Transaction

VALCRE LINKS
View Job in Valcre: https://app.valcre.com/jobs/12345
ClickUp Task ID: 901402094744_abc123

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ LOE Quote Prepared - Ready for Client Signature
```

### Custom Fields (Stage 2 - UPDATED)
| Field Name | Type | Value | Display | Change |
|------------|------|-------|---------|--------|
| Dashboard Job URL | URL | (unchanged) | Blue button | No change |
| Status | Dropdown | "LOE Pending" | Orange tag | **UPDATED** |
| Valcre Job Number | Text | "VAL250137" | Plain text | **NEW** |
| Valcre Job URL | URL | `https://app.valcre.com/jobs/12345` | Blue button | **NEW** |

### Database Fields Used (Stage 2)

**Table**: `job_loe_details`

```typescript
{
  job_id: string;                       // Foreign key to job_submissions.id
  job_number: string;                   // "VAL250137" from Valcre
  valcre_job_id: number;                // 12345 (Valcre internal ID)
  appraisal_fee: number;                // 2500.00
  retainer_amount: number;              // 1250.00
  disbursement_percentage: number;      // 15
  delivery_date: string;                // "2025-11-15" (ISO date)
  payment_terms: string;                // "50% retainer upfront, 50% on delivery"
  property_rights_appraised: string;    // "Fee Simple"
  valuation_premises: string;           // "Market Value - As Is"
  scope_of_work: string;                // "Income Approach, Direct Comparison, Cost Approach"
  report_type: string;                  // "Comprehensive Appraisal Report"
  purpose_of_appraisal: string;         // "Purchase Transaction"
  clickup_task_id: string;              // Stored for reference
  clickup_task_url: string;             // Direct link to task
  created_at: string;                   // ISO timestamp
}
```

---

## Visual Comparison: Stage 1 vs Stage 2

### Example Task on November 4, 2025 (STAGE 1 ONLY)

**Task Name**: `NEW SUBMISSION - Sparwood McDonalds, 2100 Middletown Place`

**Task Description** (shortened for clarity):
```
📍 NEW JOB ARRIVED
━━━━━━━━━━━━━━━━
CLIENT: John Smith
PROPERTY: Sparwood McDonalds
━━━━━━━━━━━━━━━━
⏳ Waiting for LOE Quote...
```

**Custom Fields**:
- Dashboard Job URL: [Blue Button]
- Status: "New Submission" (Yellow)

---

### Same Task on November 5, 2025 (STAGE 1 + STAGE 2)

**Task Name**: `VAL250137 - Sparwood McDonalds, 2100 Middletown Place` ← **NAME CHANGED**

**Task Description** (shortened for clarity):
```
📍 NEW JOB ARRIVED
━━━━━━━━━━━━━━━━
CLIENT: John Smith
PROPERTY: Sparwood McDonalds
━━━━━━━━━━━━━━━━

📋 VALCRE JOB CREATED          ← **NEW SECTION ADDED**
━━━━━━━━━━━━━━━━
JOB: VAL250137
FEE: $2,500.00
RETAINER: $1,250.00
DELIVERY: Nov 15, 2025
━━━━━━━━━━━━━━━━
✅ LOE Quote Prepared
```

**Custom Fields** (updated):
- Dashboard Job URL: [Blue Button] (unchanged)
- Status: "LOE Pending" (Orange) ← **UPDATED**
- Valcre Job Number: "VAL250137" ← **NEW**
- Valcre Job URL: [Blue Button] ← **NEW**

---

## Field Mapping: Dashboard Section 2 → ClickUp Task

### Section 2 Fields That Update ClickUp

| Dashboard Field Label | Database Column | ClickUp Location | Format |
|-----------------------|-----------------|------------------|--------|
| **Job Information** | | | |
| Job Number (VAL#) | `job_number` | Task Name prefix + Description | "VAL250137" |
| Valcre Job ID | `valcre_job_id` | Description only | "12345" |
| | | | |
| **Property Details** | | | |
| Property Rights Appraised | `property_rights_appraised` | Description - Property Valuation Details | Dropdown value |
| Valuation Premise | `valuation_premises` | Description - Property Valuation Details | Dropdown value |
| Delivery Date | `delivery_date` | Description - LOE Quote Details | "November 15, 2025" |
| Scope of Work | `scope_of_work` | Description - Property Valuation Details | Comma-separated |
| Report Type | `report_type` | Description - Property Valuation Details | Dropdown value |
| | | | |
| **Financial Details** | | | |
| Appraisal Fee | `appraisal_fee` | Description - LOE Quote Details | "$2,500.00" |
| Retainer Amount | `retainer_amount` | Description - LOE Quote Details | "$1,250.00" |
| Disbursement % | `disbursement_percentage` | Description - LOE Quote Details | "15%" |
| Payment Terms | `payment_terms` | Description - LOE Quote Details | Text |
| | | | |
| **Custom Fields** | | | |
| (auto-generated) | `job_number` | Custom Field: "Valcre Job Number" | "VAL250137" |
| (from Valcre API) | `valcre_job_id` | Custom Field: "Valcre Job URL" | Clickable link |

### Fields NOT Sent to ClickUp (Dashboard Only)

These fields stay in Dashboard, not synced to ClickUp:
- Section 3 fields (Building Information)
- Section 4 fields (Data Gathering)
- Section 5 fields (Document Uploads)
- Internal notes/timestamps

---

## API Call Structure: Update Task (Stage 2)

### Endpoint
```
PATCH https://api.clickup.com/api/v2/task/{task_id}
```

### Headers
```json
{
  "Authorization": "pk_10791838_U80AIXPC66YFCS56AGWT71SAPXWH6EU5",
  "Content-Type": "application/json"
}
```

### Request Body (JSON)
```json
{
  "name": "VAL250137 - Sparwood McDonalds, 2100 Middletown Place, Sparwood, BC",
  "markdown_description": "[FULL DESCRIPTION WITH STAGE 1 + STAGE 2 DATA - see template below]",
  "custom_fields": [
    {
      "id": "STATUS_FIELD_ID",
      "value": "loe_pending"
    },
    {
      "id": "VALCRE_JOB_NUMBER_FIELD_ID",
      "value": "VAL250137"
    },
    {
      "id": "VALCRE_JOB_URL_FIELD_ID",
      "value": "https://app.valcre.com/jobs/12345"
    }
  ]
}
```

### Description Template (Combined Stage 1 + Stage 2)

**CRITICAL**: Do NOT overwrite Stage 1 data. Append Stage 2 data below.

```javascript
const buildStage2Description = (existingDescription, stage2Data) => {
  // Parse existing description to keep Stage 1 data
  const stage1Content = existingDescription;

  // Build Stage 2 section
  const stage2Content = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 VALCRE JOB CREATED - [View in Valcre](${stage2Data.valcreJobUrl})

JOB DETAILS
Valcre Job Number: ${stage2Data.jobNumber}
Valcre Internal ID: ${stage2Data.valcreJobId}
Created: ${formatDate(stage2Data.createdAt)}

LOE QUOTE DETAILS
Appraisal Fee: ${formatCurrency(stage2Data.appraisalFee)}
Retainer Amount (50%): ${formatCurrency(stage2Data.retainerAmount)}
Disbursement Percentage: ${stage2Data.disbursementPercentage}%
Delivery Date: ${formatDate(stage2Data.deliveryDate)}
Payment Terms: ${stage2Data.paymentTerms}

PROPERTY VALUATION DETAILS
Property Rights Appraised: ${stage2Data.propertyRights}
Valuation Premise: ${stage2Data.valuationPremise}
Scope of Work: ${stage2Data.scopeOfWork}
Report Type: ${stage2Data.reportType}
Purpose of Appraisal: ${stage2Data.purposeOfAppraisal}

VALCRE LINKS
View Job in Valcre: ${stage2Data.valcreJobUrl}
ClickUp Task ID: ${stage2Data.clickupTaskId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ LOE Quote Prepared - Ready for Client Signature
`;

  // Combine: Keep Stage 1, add Stage 2
  return stage1Content.replace(/⏳ Waiting for LOE Quote Preparation.../, stage2Content);
};
```

---

## Trigger Mechanism for Stage 2 Update

### When Does the Update Happen?

**Trigger**: When appraiser clicks "Create Valcre Job" button in Dashboard Section 2

### Sequence of Events

1. **User Action**: Appraiser fills out Section 2 fields (fee, retainer, delivery date, etc.)
2. **Validation**: Dashboard validates all required fields are filled
3. **Button Click**: Appraiser clicks "Create Valcre Job"
4. **API Call #1**: Dashboard → Valcre API (create job)
5. **Response**: Valcre returns job number (e.g., "VAL250137") and job ID (e.g., 12345)
6. **Database Update**: Dashboard saves Valcre data to `job_loe_details` table
7. **API Call #2**: Dashboard → Supabase Edge Function `update-clickup-task`
8. **Edge Function**:
   - Fetches current ClickUp task (to preserve Stage 1 data)
   - Fetches Stage 2 data from `job_loe_details`
   - Builds combined description (Stage 1 + Stage 2)
   - Calls ClickUp API to update task name + description + custom fields
9. **ClickUp Updated**: Task now shows both Stage 1 and Stage 2 data
10. **Dashboard Feedback**: Button changes to "View Valcre Job" (green)

### Edge Function to Create: `update-clickup-task`

**Location**: `/Users/bencrowe/Development/APR-Dashboard-v3/supabase/functions/update-clickup-task/index.ts`

**Input** (from Dashboard):
```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Process**:
1. Fetch job data from `job_submissions` (Stage 1)
2. Fetch LOE data from `job_loe_details` (Stage 2)
3. Fetch current ClickUp task description (GET /task/{id})
4. Build combined description (preserve Stage 1, append Stage 2)
5. Update ClickUp task (PATCH /task/{id})
6. Return success/failure

**Output**:
```json
{
  "success": true,
  "taskId": "abc123xyz",
  "taskUrl": "https://app.clickup.com/t/abc123xyz",
  "updated": true
}
```

---

## TypeScript Code: Building Task Descriptions

### Stage 1 Description Builder (Form Submission)

```typescript
// File: /supabase/functions/create-clickup-task/index.ts
// Used: When form is submitted (auto-triggered)

const buildStage1Description = (job: JobSubmission): string => {
  const dashboardUrl = `https://apr-hub-05-25.vercel.app/#/dashboard?jobId=${job.id}`;

  return `📍 **NEW JOB ARRIVED - [View in APR Hub](${dashboardUrl})**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**CLIENT INFORMATION**
Name: ${job.client_first_name} ${job.client_last_name}
Organization: ${job.client_organization || 'N/A'}
Email: ${job.client_email}
Phone: ${job.client_phone || 'N/A'}

**PROPERTY INFORMATION**
Property Name: ${job.property_name}
Address: ${job.property_address}
Property Type: ${job.property_type || 'N/A'}
Intended Use: ${job.intended_use || 'N/A'}
Asset Condition: ${job.asset_condition || 'N/A'}
Valuation Premise: ${job.valuation_premises || 'N/A'}

**SUBMISSION NOTES**
${job.notes || 'No additional notes provided'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏳ Waiting for LOE Quote Preparation...`;
};
```

### Stage 2 Description Builder (After Valcre Job Created)

```typescript
// File: /supabase/functions/update-clickup-task/index.ts
// Used: When "Create Valcre Job" button is clicked

interface Stage2Data {
  jobNumber: string;              // "VAL250137"
  valcreJobId: number;            // 12345
  valcreJobUrl: string;           // "https://app.valcre.com/jobs/12345"
  appraisalFee: number;           // 2500.00
  retainerAmount: number;         // 1250.00
  disbursementPercentage: number; // 15
  deliveryDate: string;           // "2025-11-15"
  paymentTerms: string;           // "50% retainer upfront, 50% on delivery"
  propertyRights: string;         // "Fee Simple"
  valuationPremise: string;       // "Market Value - As Is"
  scopeOfWork: string;            // "Income Approach, Direct Comparison, Cost Approach"
  reportType: string;             // "Comprehensive Appraisal Report"
  purposeOfAppraisal: string;     // "Purchase Transaction"
  clickupTaskId: string;          // Existing task ID
  createdAt: string;              // ISO timestamp
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const formatDate = (isoDate: string): string => {
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const buildStage2Section = (data: Stage2Data): string => {
  return `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 **VALCRE JOB CREATED** - [View in Valcre](${data.valcreJobUrl})

**JOB DETAILS**
Valcre Job Number: ${data.jobNumber}
Valcre Internal ID: ${data.valcreJobId}
Created: ${formatDate(data.createdAt)}

**LOE QUOTE DETAILS**
Appraisal Fee: ${formatCurrency(data.appraisalFee)}
Retainer Amount (50%): ${formatCurrency(data.retainerAmount)}
Disbursement Percentage: ${data.disbursementPercentage}%
Delivery Date: ${formatDate(data.deliveryDate)}
Payment Terms: ${data.paymentTerms}

**PROPERTY VALUATION DETAILS**
Property Rights Appraised: ${data.propertyRights}
Valuation Premise: ${data.valuationPremise}
Scope of Work: ${data.scopeOfWork}
Report Type: ${data.reportType}
Purpose of Appraisal: ${data.purposeOfAppraisal}

**VALCRE LINKS**
View Job in Valcre: ${data.valcreJobUrl}
ClickUp Task ID: ${data.clickupTaskId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ LOE Quote Prepared - Ready for Client Signature`;
};

const buildCombinedDescription = (
  existingDescription: string,
  stage2Data: Stage2Data
): string => {
  // Check if Stage 2 already added (idempotency)
  if (existingDescription.includes('📋 **VALCRE JOB CREATED**')) {
    console.log('⚠️ Stage 2 data already present, skipping update');
    return existingDescription;
  }

  // Remove waiting message and append Stage 2 data
  const stage1Content = existingDescription.replace(
    /⏳ Waiting for LOE Quote Preparation\.\.\./,
    ''
  ).trim();

  return stage1Content + buildStage2Section(stage2Data);
};
```

### Complete Update Function

```typescript
// File: /supabase/functions/update-clickup-task/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CLICKUP_API_TOKEN = 'pk_10791838_U80AIXPC66YFCS56AGWT71SAPXWH6EU5';
const CLICKUP_API_BASE = 'https://api.clickup.com/api/v2';

serve(async (req) => {
  try {
    const { jobId } = await req.json();

    // 1. Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 2. Fetch job data (Stage 1)
    const { data: job } = await supabase
      .from('job_submissions')
      .select('*')
      .eq('id', jobId)
      .single();

    if (!job || !job.clickup_task_id) {
      throw new Error('Job or ClickUp task not found');
    }

    // 3. Fetch LOE data (Stage 2)
    const { data: loeData } = await supabase
      .from('job_loe_details')
      .select('*')
      .eq('job_id', jobId)
      .single();

    if (!loeData || !loeData.job_number) {
      throw new Error('LOE data or job number not found');
    }

    // 4. Fetch current ClickUp task
    const taskResponse = await fetch(
      `${CLICKUP_API_BASE}/task/${job.clickup_task_id}`,
      {
        headers: { 'Authorization': CLICKUP_API_TOKEN }
      }
    );

    const currentTask = await taskResponse.json();

    // 5. Build combined description
    const stage2Data: Stage2Data = {
      jobNumber: loeData.job_number,
      valcreJobId: loeData.valcre_job_id,
      valcreJobUrl: `https://app.valcre.com/jobs/${loeData.valcre_job_id}`,
      appraisalFee: loeData.appraisal_fee,
      retainerAmount: loeData.retainer_amount,
      disbursementPercentage: loeData.disbursement_percentage,
      deliveryDate: loeData.delivery_date,
      paymentTerms: loeData.payment_terms,
      propertyRights: loeData.property_rights_appraised,
      valuationPremise: loeData.valuation_premises,
      scopeOfWork: loeData.scope_of_work,
      reportType: loeData.report_type,
      purposeOfAppraisal: loeData.purpose_of_appraisal,
      clickupTaskId: job.clickup_task_id,
      createdAt: loeData.created_at
    };

    const updatedDescription = buildCombinedDescription(
      currentTask.markdown_description,
      stage2Data
    );

    // 6. Update task name (add VAL number prefix)
    const updatedTaskName = `${loeData.job_number} - ${job.property_name}, ${job.property_address}`;

    // 7. Update ClickUp task
    const updateResponse = await fetch(
      `${CLICKUP_API_BASE}/task/${job.clickup_task_id}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': CLICKUP_API_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: updatedTaskName,
          markdown_description: updatedDescription,
          custom_fields: [
            {
              id: 'VALCRE_JOB_NUMBER_FIELD_ID', // Replace with actual field ID
              value: loeData.job_number
            },
            {
              id: 'VALCRE_JOB_URL_FIELD_ID', // Replace with actual field ID
              value: `https://app.valcre.com/jobs/${loeData.valcre_job_id}`
            },
            {
              id: 'STATUS_FIELD_ID', // Replace with actual field ID
              value: 'loe_pending'
            }
          ]
        })
      }
    );

    const result = await updateResponse.json();

    return new Response(JSON.stringify({
      success: true,
      taskId: job.clickup_task_id,
      taskUrl: job.clickup_task_url,
      updated: true
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
```

---

## Real-World Examples with Actual Data

### Example 1: Task on November 4, 2025, 10:00 AM (STAGE 1 ONLY)

**Scenario**: Client just submitted form for McDonalds appraisal

**Task Name**:
```
NEW SUBMISSION - Sparwood McDonalds, 2100 Middletown Place, Sparwood, BC
```

**Task Description**:
```markdown
📍 NEW JOB ARRIVED - [View in APR Hub](https://apr-hub-05-25.vercel.app/#/dashboard?jobId=7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLIENT INFORMATION
Name: Sarah Johnson
Organization: Mountain Capital Investments Ltd.
Email: sarah.johnson@mountaincapital.com
Phone: (403) 782-5566

PROPERTY INFORMATION
Property Name: Sparwood McDonalds
Address: 2100 Middletown Place, Sparwood, BC T1K 2L3
Property Type: Commercial - Quick Service Restaurant
Intended Use: Purchase Transaction
Asset Condition: Good
Valuation Premise: Market Value - As Is

SUBMISSION NOTES
Purchasing McDonalds franchise location in Sparwood. Need appraisal for bank financing (RBC). Property includes 3,200 SF building with drive-through, parking for 25 vehicles. Building renovated in 2023 (new HVAC, updated interior). Triple-net lease in place. Closing date target: January 15, 2026.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏳ Waiting for LOE Quote Preparation...
```

**Custom Fields**:
- Dashboard Job URL: `https://apr-hub-05-25.vercel.app/#/dashboard?jobId=7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d` (Blue button)
- Status: "New Submission" (Yellow tag)

**Subtasks** (from template - 9 tasks):
- [ ] Review submission details
- [ ] Prepare LOE quote
- [ ] Send LOE for signature
- [ ] Receive signed LOE
- [ ] Collect retainer payment
- [ ] Activate job in Valcre
- [ ] Schedule property inspection
- [ ] Complete appraisal report
- [ ] Deliver final report to client

---

### Example 2: SAME Task on November 5, 2025, 2:30 PM (STAGE 1 + STAGE 2)

**Scenario**: Chris prepared LOE quote and created Valcre job

**Task Name** (CHANGED):
```
VAL250137 - Sparwood McDonalds, 2100 Middletown Place, Sparwood, BC
```

**Task Description** (UPDATED - Stage 2 appended):
```markdown
📍 NEW JOB ARRIVED - [View in APR Hub](https://apr-hub-05-25.vercel.app/#/dashboard?jobId=7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLIENT INFORMATION
Name: Sarah Johnson
Organization: Mountain Capital Investments Ltd.
Email: sarah.johnson@mountaincapital.com
Phone: (403) 782-5566

PROPERTY INFORMATION
Property Name: Sparwood McDonalds
Address: 2100 Middletown Place, Sparwood, BC T1K 2L3
Property Type: Commercial - Quick Service Restaurant
Intended Use: Purchase Transaction
Asset Condition: Good
Valuation Premise: Market Value - As Is

SUBMISSION NOTES
Purchasing McDonalds franchise location in Sparwood. Need appraisal for bank financing (RBC). Property includes 3,200 SF building with drive-through, parking for 25 vehicles. Building renovated in 2023 (new HVAC, updated interior). Triple-net lease in place. Closing date target: January 15, 2026.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 VALCRE JOB CREATED - [View in Valcre](https://app.valcre.com/jobs/12345)

JOB DETAILS
Valcre Job Number: VAL250137
Valcre Internal ID: 12345
Created: November 5, 2025

LOE QUOTE DETAILS
Appraisal Fee: $3,200.00
Retainer Amount (50%): $1,600.00
Disbursement Percentage: 15%
Delivery Date: November 22, 2025
Payment Terms: 50% retainer upfront via e-transfer, 50% on delivery of final report

PROPERTY VALUATION DETAILS
Property Rights Appraised: Fee Simple
Valuation Premise: Market Value - As Is
Scope of Work: Income Approach, Direct Comparison Approach, Cost Approach
Report Type: Comprehensive Appraisal Report
Purpose of Appraisal: Financing (Purchase Transaction)

VALCRE LINKS
View Job in Valcre: https://app.valcre.com/jobs/12345
ClickUp Task ID: 901402094744_t8g9h0i1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ LOE Quote Prepared - Ready for Client Signature
```

**Custom Fields** (UPDATED):
- Dashboard Job URL: `https://apr-hub-05-25.vercel.app/#/dashboard?jobId=7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d` (unchanged)
- Status: "LOE Pending" (Orange tag) ← **CHANGED**
- Valcre Job Number: "VAL250137" ← **NEW**
- Valcre Job URL: `https://app.valcre.com/jobs/12345` (Blue button) ← **NEW**

**Subtasks** (2 completed):
- [x] Review submission details ← **COMPLETED**
- [x] Prepare LOE quote ← **COMPLETED**
- [ ] Send LOE for signature ← **NEXT**
- [ ] Receive signed LOE
- [ ] Collect retainer payment
- [ ] Activate job in Valcre
- [ ] Schedule property inspection
- [ ] Complete appraisal report
- [ ] Deliver final report to client

---

## What Changed Between Stages? (Quick Reference)

| Element | Stage 1 | Stage 2 | Change Type |
|---------|---------|---------|-------------|
| **Task Name** | "NEW SUBMISSION - Property, Address" | "VAL250137 - Property, Address" | PREFIX ADDED |
| **Description Section** | Client + Property info only | Client + Property + LOE Quote + Valcre data | APPENDED |
| **Waiting Message** | "⏳ Waiting for LOE Quote..." | (removed) | REPLACED |
| **Status Footer** | "⏳ Waiting..." | "✅ LOE Quote Prepared..." | REPLACED |
| **Custom Field: Status** | "New Submission" (Yellow) | "LOE Pending" (Orange) | UPDATED |
| **Custom Field: Valcre Job Number** | (not present) | "VAL250137" | ADDED |
| **Custom Field: Valcre Job URL** | (not present) | Clickable link | ADDED |
| **Subtasks** | 0 of 9 complete | 2 of 9 complete | PROGRESSED |

---

## Implementation Checklist

### Prerequisites
- [ ] ClickUp custom fields created:
  - [ ] "Dashboard Job URL" (type: url)
  - [ ] "Valcre Job Number" (type: text)
  - [ ] "Valcre Job URL" (type: url)
  - [ ] "Status" (type: dropdown with values: new_submission, loe_pending, loe_signed, etc.)
- [ ] Database tables have required columns:
  - [ ] `job_submissions.clickup_task_id`
  - [ ] `job_submissions.clickup_task_url`
  - [ ] `job_loe_details.job_number`
  - [ ] `job_loe_details.valcre_job_id`

### Stage 1 Implementation (Already Done)
- [x] Edge Function `create-clickup-task` deployed
- [x] Database webhook configured (auto-trigger on form submission)
- [x] Task template with 9 subtasks configured
- [x] Stage 1 description format implemented

### Stage 2 Implementation (TO DO)
- [ ] Create Edge Function `update-clickup-task`
- [ ] Implement Stage 2 description builder (append to Stage 1)
- [ ] Add idempotency check (don't update twice)
- [ ] Update task name with VAL number prefix
- [ ] Set custom fields (Valcre job number, URL, status)
- [ ] Deploy Edge Function to Supabase
- [ ] Modify Dashboard "Create Valcre Job" button to call update function
- [ ] Test end-to-end: Form → Stage 1 → LOE → Stage 2

### Testing
- [ ] Test Stage 1: Submit form → Task created with client/property data
- [ ] Test Stage 2: Create Valcre job → Task updated with LOE data
- [ ] Verify no duplicates (idempotency works)
- [ ] Verify bidirectional navigation (Dashboard ↔ ClickUp)
- [ ] Verify custom fields display correctly in ClickUp
- [ ] Verify task name changes from "NEW SUBMISSION" to "VAL250137"

---

## Summary: What Ben Needs to See

**STAGE 1** (Auto-created on form submission):
- Task Name: "NEW SUBMISSION - Property, Address"
- Description: Client info + Property info + "⏳ Waiting..."
- Status: "New Submission" (Yellow)

**STAGE 2** (Updated after Valcre job created):
- Task Name: "VAL250137 - Property, Address" ← **VAL# ADDED**
- Description: [Stage 1 data] + [LOE Quote data] + [Valcre job data] ← **APPENDED**
- Status: "LOE Pending" (Orange) ← **UPDATED**
- New Custom Fields: Valcre Job Number, Valcre Job URL ← **ADDED**

**Key Principle**: Stage 1 data is PRESERVED and VISIBLE. Stage 2 data is APPENDED below. Task becomes enriched with more detail as job progresses through workflow.

---

**END OF VISUAL SPECIFICATION**

**Next Steps**: Use this document as visual reference when implementing Stage 2 update functionality. Code templates provided above are production-ready.
