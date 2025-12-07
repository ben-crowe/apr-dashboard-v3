# DocuSeal E-Signature Implementation

**Last Updated:** November 1, 2025
**Project:** APR Dashboard V3
**System Component:** Letter of Engagement (LOE) Generation & E-Signature

---

## Overview

HTML-based document generation system using DocuSeal for e-signature capture. Backend generates complete HTML documents with pre-populated data and embedded signature field markers. DocuSeal converts anchor tags to interactive signature widgets. Eliminates traditional field mapping by treating DocuSeal as a signature interface rather than a template engine.

## System Architecture

### HTML-Based Template Approach

**Core Flow:**
1. Backend generates complete HTML document with all data pre-filled
2. HTML contains anchor tags marking signature placement
3. DocuSeal scans HTML for anchor tags and converts them to interactive fields
4. Client receives fully-populated document requiring only signature

**Key Architectural Decisions:**

**No Template ID Method**
- Traditional flow: Upload template → Map fields → Send data → Merge
- This implementation: Generate HTML → Mark signature spots → Send complete document
- DocuSeal becomes signing interface, not template engine

**HTML as Single Source of Truth**
- Document structure defined in code (`v3Template.ts`)
- Data mapping handled programmatically (`generateLOE.ts`)
- No platform-specific configuration to maintain
- Version control for document templates

**Signature Field Placement via Anchor Tags**
- HTML contains tags like `<signature-field>` and `<date-field>`
- DocuSeal automatically detects and converts to interactive elements
- No coordinate-based positioning
- Fields flow naturally with document content

---

## Implementation Components

### 1. HTML LOE Generation

**File:** `/src/utils/loe/generateLOE.ts`

**Template Loading:**
```typescript
async function loadV3Template(): Promise<string> {
  console.log('✅ Loading embedded V3 template (4 pages with all legal terms)');
  return V3_TEMPLATE;
}
```

V3 template imported from `v3Template.ts` contains:
- Complete 4-page Letter of Engagement structure
- All legal terms and conditions
- Placeholder fields in bracket notation: `[fieldName]`
- Anchor tags for signature placement

**Data Mapping (22 Fields):**
```typescript
function mapDataToV3Fields(job: DetailJob, jobDetails: JobDetails) {
  return {
    // Date
    '[date.created]': currentDate,

    // Client/Property Contact Information
    '[propertycontact.company]': job.clientOrganization || 'Not Specified',
    '[propertycontact.firstname]': job.clientFirstName || '',
    '[propertycontact.lastname]': job.clientLastName || '',
    '[propertycontact.title]': job.clientTitle || 'Not Specified',
    '[propertycontact.addressstreet]': job.clientAddress || 'Not Specified',

    // Property Details
    '[name]': jobDetails.jobNumber || 'PENDING-' + Date.now().toString().slice(-6),
    '[addressstreet]': job.propertyAddress || 'Property Address Not Specified',

    // Appraisal Details
    '[purposes]': job.intendedUse || 'Not Specified',
    '[intendeduses]': job.intendedUse || 'Not Specified',
    '[requestedvalues]': jobDetails.valuationPremises || 'Market Value',
    '[propertyrights]': jobDetails.propertyRightsAppraised || 'Fee Simple',
    '[reportformat]': jobDetails.reportType || 'Full Narrative Report',

    // Financial
    '[fee]': jobDetails.appraisalFee
      ? `$${jobDetails.appraisalFee.toLocaleString()}`
      : '$TBD',

    // Administrative
    '[scopes]': jobDetails.scopeOfWork || 'All Applicable',
    '[duedate]': jobDetails.deliveryDate || '15 business days',
  };
}
```

**HTML Generation:**
```typescript
export async function generateLOEHTML(
  job: DetailJob,
  jobDetails: JobDetails
): Promise<string> {
  // Load template
  let templateHTML = await loadV3Template();

  // Get field mappings
  const fieldMappings = mapDataToV3Fields(job, jobDetails);

  // Replace all bracketed fields with actual data
  for (const [field, value] of Object.entries(fieldMappings)) {
    const escapedField = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    templateHTML = templateHTML.replace(
      new RegExp(escapedField, 'g'),
      value as string
    );
  }

  // Anchor tags remain for DocuSeal to process
  return templateHTML;
}
```

Dynamic fields (names, addresses, fees) expand naturally in HTML without fixed-width constraints. Text wraps properly with document flow.

### 2. DocuSeal API Integration

**Submission Payload:**

Explicitly omits `template_id` - HTML is single source of truth.

```typescript
const submissionPayload = {
  // NO template_id - HTML is the single source of truth
  name: `LOE-${job.jobNumber || Date.now()}`,
  send_email: false, // Custom email handling
  documents: [
    {
      name: 'letter-of-engagement',
      html: templateHTML, // HTML with anchor tags
      size: 'Letter' // US Letter size
    }
  ],
  submitters: [{
    email: clientEmail,
    name: clientName,
    role: 'First Party' // Must match role in anchor tags
  }]
};
```

**API Endpoint:**
```typescript
const submissionResponse = await fetch(
  `${supabaseUrl}/functions/v1/docuseal-proxy?endpoint=submissions/html`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(submissionPayload)
  }
);
```

**Response Handling:**
```typescript
const submission = await submissionResponse.json();
const submissionData = Array.isArray(submission) ? submission[0] : submission;

// Extract slug for signing URL
const docusealSlug = submissionData.slug ||
                     (submissionData.submitters && submissionData.submitters[0]?.slug) ||
                     '';
```

No template ID eliminates template management in DocuSeal platform. Every submission is self-contained. Changes to document structure only require code updates.

### 3. Signature Field Placement

**Anchor Tag Syntax:**

```html
<signature-field role="First Party" name="signature_1"></signature-field>
<date-field role="First Party" name="date_1"></date-field>
```

**DocuSeal Processing:**
1. Receives HTML document via API
2. Scans for `<signature-field>` and `<date-field>` tags
3. Matches `role="First Party"` to submitter role
4. Converts tags to interactive signature/date widgets
5. Generates signing URL with embedded document

Fields positioned in HTML structure without coordinates. Multiple signature locations supported via role-based field assignment. Natural document flow maintained.

### 4. Email Delivery & Client Experience

**Custom Email Flow:**

```typescript
// Disable DocuSeal's email
send_email: false,

// Send custom email via Edge Function
const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-loe-email-fixed`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: clientEmail,
    clientName: clientName,
    signingLink: signingLink, // Points to custom signing page
    propertyAddress: job.propertyAddress
  })
});
```

**Custom Signing Experience:**

**File:** `/src/pages/SigningPage.tsx`

Client receives link to APR Dashboard site (not DocuSeal directly):

```typescript
// Generate signing link to our domain
const signingLink = loeSubmission
  ? `${window.location.origin}/sign/${loeSubmission.id}`
  : `https://docuseal.com/s/${docusealSlug}`; // Fallback
```

**Signing Page Components:**

```typescript
<div className="max-w-5xl mx-auto p-6">
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">

    {/* Display the complete document */}
    <div className="p-8">
      <div
        className="loe-document"
        dangerouslySetInnerHTML={{ __html: loeHTML }}
      />
    </div>

    {/* DocuSeal Signature Widget */}
    <div className="p-8 bg-gray-50 border-t-2">
      <DocusealForm
        src={`https://docuseal.com/s/${docusealSlug}`}
        onComplete={handleSigningComplete}
      />
    </div>
  </div>
</div>
```

Features:
- Branded header displays company branding
- Full document display shows complete HTML LOE above signature widget
- DocuSeal widget embed provides interactive signature component
- Status tracking updates database on signature completion

### 5. Webhook Handling

**File:** `/src/utils/webhooks/docuseal.ts`

**Webhook Payload Interface:**
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

**Webhook Handler:**
```typescript
export async function handleDocuSealWebhook(
  payload: DocuSealWebhookPayload,
): Promise<{ success: boolean; documentUrl?: string }> {
  try {
    if (payload.event_type === "submission.completed") {
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

**Database Status Updates:**

```typescript
const handleSigningComplete = async () => {
  setSigned(true);
  await supabase
    .from('loe_submissions')
    .update({
      status: 'signed',
      signed_at: new Date().toISOString()
    })
    .eq('id', id);
};
```

---

## Database Schema

**Table:** `loe_submissions`

```sql
CREATE TABLE IF NOT EXISTS loe_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  loe_html TEXT NOT NULL, -- Complete V3-LOE with all fields filled
  docuseal_slug TEXT NOT NULL, -- DocuSeal signing slug
  docuseal_submission_id TEXT,
  status TEXT DEFAULT 'pending', -- pending, signed, expired
  created_at TIMESTAMP DEFAULT NOW(),
  signed_at TIMESTAMP,
  UNIQUE(job_id)
);
```

**Design Decisions:**

**Store Complete HTML**
- `loe_html` field stores fully-populated document
- Enables document recreation without regenerating
- Audit trail of what client actually signed
- Supports resending if needed

**Slug vs Submission ID**
- `docuseal_slug`: Required for generating signing URLs
- `docuseal_submission_id`: DocuSeal's internal reference
- Slug more reliable for URL construction

**Status Tracking**
- `pending`: Sent but not yet signed
- `signed`: Client completed signature
- `expired`: DocuSeal submission expired

---

## API Reference

**DocuSeal Submission Request:**

```json
{
  "name": "LOE-VAL-2024-1234",
  "send_email": false,
  "documents": [
    {
      "name": "letter-of-engagement",
      "html": "<!DOCTYPE html><html>...</html>",
      "size": "Letter"
    }
  ],
  "submitters": [
    {
      "email": "client@example.com",
      "name": "John Smith",
      "role": "First Party"
    }
  ]
}
```

**DocuSeal Submission Response:**

```json
[
  {
    "id": "123456",
    "slug": "abc123xyz789",
    "status": "pending",
    "submitters": [
      {
        "id": "78910",
        "email": "client@example.com",
        "slug": "abc123xyz789",
        "status": "pending"
      }
    ],
    "created_at": "2025-11-01T10:30:00Z"
  }
]
```

**Custom Email Payload:**

```json
{
  "to": "client@example.com",
  "clientName": "John Smith",
  "signingLink": "https://apr-dashboard.com/sign/uuid-here",
  "propertyAddress": "123 Main Street, Calgary, AB"
}
```

---

## Key Functions Reference

**1. LOE Generation Flow:**

```
UI Button Click → generateAndSendLOE()
    ↓
Load V3 Template → mapDataToV3Fields()
    ↓
Replace Placeholders → generateLOEHTML()
    ↓
Validate Fields → Email regex check
    ↓
Send to DocuSeal API → /submissions/html endpoint
    ↓
Parse Response → Extract slug and submission ID
    ↓
Save to Database → loe_submissions table
    ↓
Send Custom Email → Edge function with signing link
    ↓
Return Success → Display link to user
```

**2. Client Signing Flow:**

```
Client Receives Email → Clicks signing link
    ↓
Load SigningPage → Fetch submission from database
    ↓
Display Document → Render complete HTML above signature widget
    ↓
Embed DocuSeal Form → React component with slug
    ↓
Client Signs → DocuSeal processes signature
    ↓
onComplete Event → Update database status to 'signed'
    ↓
Show Confirmation → Thank you message
```

**3. Webhook Processing Flow:**

```
DocuSeal Fires Webhook → submission.completed event
    ↓
Parse Payload → Extract document URL
    ↓
Validate Event → Check event type
    ↓
Return Document URL → For storage/download
```

**Email Validation & Fallback:**

```typescript
// Ensure valid email for DocuSeal
let clientEmail = job.clientEmail || '';
const clientName = `${job.clientFirstName} ${job.clientLastName}`.trim() || 'Client';

const emailRegex = /^[^\s@]+@[^\s@]+$/;
if (!clientEmail || !emailRegex.test(clientEmail)) {
  console.warn(`Invalid email "${clientEmail}", using placeholder`);
  clientEmail = 'noreply@valta.ca'; // Company fallback
}
```

DocuSeal requires valid email format. Missing emails would cause API errors. Fallback allows document creation to proceed. User can manually share signing link.

**Signing Link Generation:**

```typescript
// Generate signing link - points to our site
const signingLink = loeSubmission
  ? `${window.location.origin}/sign/${loeSubmission.id}`
  : `https://docuseal.com/s/${docusealSlug}`; // Fallback to DocuSeal

console.log('🔗 SIGNING LINK (for testing):', signingLink);
console.log('📝 If email fails, use this link directly!');
```

Console logs provide manual testing link. Fallback to DocuSeal if database insert fails. Easy to copy/paste for testing without email.

**UI Integration (LoeQuoteSection):**

```typescript
const handleGeneratePreview = async () => {
  // Verify Valcre job exists first
  if (!isValcreJobNumber(jobDetails?.jobNumber)) {
    toast.error("Please create a Valcre job first before generating LOE");
    return;
  }

  setIsGenerating(true);

  try {
    const html = await generateLOEHTML(job, jobDetails);
    setPreviewHTML(html);
    setShowPreview(true);
    toast.info(alreadySent
      ? "Ready to resend LOE - please review recipient email"
      : "Preview generated - please review before sending"
    );
  } catch (error) {
    toast.error("Failed to generate document preview");
  } finally {
    setIsGenerating(false);
  }
};
```

Workflow requires Valcre job number before LOE generation. Supports preview before sending. Enables resending to different email. User confirmation step prevents accidental sends.

---

## Technical Rationale

**HTML Approach vs Traditional Field Mapping**

HTML-based templates eliminate platform-specific field mapping interfaces. Template structure lives in code repository with full version control. Documents can be diffed, rolled back, and tested programmatically. DocuSeal serves as signature interface only, enabling migration to different e-signature providers if needed. No platform lock-in for document generation logic.

**Maintainability Advantages**

Templates editable in standard code editors without UI-based field placement. Changes tracked in git commits. Unit tests validate data mapping functions. Mock DocuSeal API for integration testing. Developer workflow follows standard code → test → deploy pattern. New document types created via code without learning e-signature platform UI. Single location for template updates (`v3Template.ts`). Field mapping logic centralized in one function. Clear separation between generation, signing, and delivery components.

---

**Related Documentation:**
- `01-Field-Map3.md` - Complete field mapping specifications
- `v3Template.ts` - LOE HTML template structure
- DocuSeal API Docs - https://www.docuseal.com/docs/api
- Supabase Edge Functions - Email sending implementation
