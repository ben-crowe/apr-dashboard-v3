# LOE Generator - Letter of Engagement System

**Status:** ✅ **FULLY IMPLEMENTED & DEPLOYED**
**Last Updated:** November 4, 2025
**Project:** APR Dashboard v3
**E-Signature Provider:** DocuSeal
**Email Provider:** Resend API

---

## Overview

Custom-built LOE generation system with DocuSeal integration for e-signatures. Generates professional Letter of Engagement documents from dashboard data, sends via email with signing link, and tracks signature status.

## Architecture

### Components

**1. LOE Generation Logic**
**File:** `src/utils/loe/generateLOE.ts`

**2. LOE UI Section**
**File:** `src/components/dashboard/job-details/LoeQuoteSection.tsx`

**3. Email Sending**
**File:** `supabase/functions/send-loe-email-fixed/index.ts` (Edge Function)

**4. Signature Webhook**
**File:** `supabase/functions/docuseal-webhook/index.ts` (Edge Function)

## LOE Generation Workflow

### Step-by-Step Flow

**1. Appraiser Fills Required Fields**
```typescript
// Required fields for LOE generation
const requiredFields = {
  jobNumber: 'VAL250137',
  appraisalFee: 2500,
  retainerAmount: 1250,
  paymentTerms: 'On LOE Signature',
  reportDeliveryDate: '2025-11-30',
  // ... client and property info from form submission
};
```

**2. Generate LOE Button Click**
```typescript
handleGenerateLOE = async () => {
  // 1. Map dashboard data to LOE fields (22 fields)
  const loeData = mapDataToV3Fields(job, jobDetails);

  // 2. Generate HTML LOE with field substitution
  const templateHTML = generateHTMLTemplate(loeData);

  // 3. Create DocuSeal submission
  const docusealSubmission = await createDocuSealSubmission({
    html: templateHTML,
    signers: [{
      email: job.clientEmail,
      name: `${job.clientFirstName} ${job.clientLastName}`,
      role: 'First Party'
    }]
  });

  // 4. Store submission ID
  await supabase.from('job_loe_details').update({
    docuseal_submission_id: docusealSubmission.id
  }).eq('job_id', job.id);

  // 5. Send email with signing link
  await supabase.functions.invoke('send-loe-email-fixed', {
    body: {
      to: job.clientEmail,
      jobNumber: job.jobNumber,
      signingUrl: docusealSubmission.signing_url
    }
  });

  // 6. Update job status
  await supabase.from('job_submissions').update({
    status: 'loe_sent'
  }).eq('id', job.id);
};
```

**3. Client Receives Email**
```html
<!-- Email from Resend API -->
From: Valta Appraisals <noreply@crowestudio.com>
To: client@example.com
Subject: Letter of Engagement - Ready for Signature

Body:
- Professional email template
- Signing button → Links to DocuSeal
- Company branding
- Contact information
```

**4. Client Signs Document**
- Opens DocuSeal signing portal
- Reviews LOE document
- Signs electronically
- Submits signature

**5. DocuSeal Webhook Fires**
```typescript
// POST to: /functions/v1/docuseal-webhook
{
  event_type: 'submission.completed',
  data: {
    id: 'docuseal_submission_id',
    status: 'completed',
    documents: [{
      id: 'doc_id',
      name: 'Signed LOE Agreement',
      url: 'https://docuseal.com/docs/signed/...'
    }],
    completed_at: '2025-11-04T10:30:00Z'
  }
}
```

**6. Webhook Updates Job Status**
```typescript
// Update job status to 'loe_signed'
await supabase.from('job_submissions').update({
  status: 'loe_signed',
  updated_at: new Date().toISOString()
}).eq('id', jobId);

// Store signed document URL
await supabase.from('job_loe_details').update({
  signed_document_url: signedDocument.url,
  signed_at: completedAt
}).eq('job_id', jobId);

// Save to file management system
await supabase.from('job_files').insert({
  job_id: jobId,
  file_name: 'Signed LOE Agreement',
  storage_path: signedDocument.url,
  category: 'signed_agreement',
  is_client_visible: true
});
```

## Field Mapping (22 Fields)

### LOE Template Variables

```typescript
const mapDataToV3Fields = (job, jobDetails) => {
  return {
    // Date & Job Info
    '[date.created]': formatDate(new Date()), // "November 4, 2025"
    '[name]': jobDetails.jobNumber || 'PENDING',

    // Client Contact
    '[propertycontact.company]': job.clientOrganization || 'Not Specified',
    '[propertycontact.firstname]': job.clientFirstName || '',
    '[propertycontact.lastname]': job.clientLastName || '',
    '[propertycontact.email]': job.clientEmail || '',
    '[propertycontact.phone]': formatPhone(job.clientPhone) || '',

    // Property Information
    '[addressstreet]': job.propertyAddress || 'Property Address Not Specified',
    '[addresscity]': extractCity(job.propertyAddress) || 'City Not Specified',
    '[addressprovince]': extractProvince(job.propertyAddress) || 'Province Not Specified',
    '[addresspostal]': extractPostalCode(job.propertyAddress) || 'Postal Code Not Specified',

    // Valuation Details
    '[purposes]': job.intendedUse || 'Not Specified',
    '[type]': job.valuationPremises || 'Market Value',
    '[propertytype]': formatPropertyTypes(job.propertyTypes) || 'Not Specified',

    // Financial Terms
    '[fee]': formatCurrency(jobDetails.appraisalFee) || '$TBD',
    '[retainer]': formatCurrency(jobDetails.retainerAmount) || '$TBD',
    '[payment]': jobDetails.paymentTerms || 'On LOE Signature',
    '[delivery]': formatDate(jobDetails.reportDeliveryDate) || 'TBD',

    // Property Characteristics
    '[yearbuilt]': jobDetails.yearBuilt || 'Unknown',
    '[buildingsize]': formatNumber(jobDetails.buildingSize) || 'Unknown',
    '[units]': jobDetails.numberOfUnits?.toString() || 'N/A',
    '[parking]': jobDetails.parkingSpaces?.toString() || 'N/A'
  };
};
```

### Formatting Functions

```typescript
const formatCurrency = (value) => {
  if (!value) return '$TBD';
  return `$${Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
};

const formatPropertyTypes = (types) => {
  if (!Array.isArray(types) || types.length === 0) return 'Not Specified';
  return types.join(', ');
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
```

## DocuSeal Integration

### HTML Template Structure

```html
<!-- LOE Template with DocuSeal Anchor Tags -->
<html>
<head>
  <style>
    /* Professional styling */
    body { font-family: 'Georgia', serif; }
    .header { text-align: center; margin-bottom: 30px; }
    .signature-section { margin-top: 50px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Letter of Engagement</h1>
    <p>Job Number: [name]</p>
    <p>Date: [date.created]</p>
  </div>

  <p>Dear [propertycontact.firstname] [propertycontact.lastname],</p>

  <p>This Letter of Engagement confirms our agreement to provide an appraisal
  for the property located at [addressstreet], [addresscity], [addressprovince].</p>

  <h3>Scope of Work</h3>
  <p>Purpose: [purposes]</p>
  <p>Property Type: [propertytype]</p>
  <p>Valuation Basis: [type]</p>

  <h3>Fees and Terms</h3>
  <p>Appraisal Fee: [fee]</p>
  <p>Retainer Amount: [retainer]</p>
  <p>Payment Terms: [payment]</p>
  <p>Estimated Delivery: [delivery]</p>

  <div class="signature-section">
    <p><strong>Client Signature:</strong></p>
    <!-- DocuSeal signature anchor -->
    <signature-field role="First Party" />

    <p><strong>Date Signed:</strong></p>
    <!-- DocuSeal date anchor -->
    <date-field role="First Party" />
  </div>
</body>
</html>
```

### DocuSeal Submission API

```typescript
const createDocuSealSubmission = async (data) => {
  const response = await fetch('https://api.docuseal.com/submissions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DOCUSEAL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: `LOE-${data.jobNumber}`,
      send_email: false, // We send our own email via Resend
      documents: [{
        name: 'letter-of-engagement',
        html: data.templateHTML,
        size: 'Letter' // 8.5" x 11"
      }],
      submitters: [{
        email: data.clientEmail,
        name: data.clientName,
        role: 'First Party' // Must match anchor tags
      }]
    })
  });

  return response.json();
};
```

## Email System

### Resend API Configuration

**Edge Function:** `send-loe-email-fixed/index.ts`

```typescript
const RESEND_API_KEY = 're_8B4Po2eL_84kFfQeEHAf4z4GFTLaqTv94';

const sendLOEEmail = async ({ to, jobNumber, signingUrl }) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Valta Appraisals <noreply@crowestudio.com>',
      to: [to],
      subject: 'Letter of Engagement - Ready for Signature',
      html: generateEmailHTML(jobNumber, signingUrl)
    })
  });

  return response.json();
};
```

### Email Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #003366; color: white; padding: 20px; text-align: center; }
    .button { display: inline-block; background: #003366; color: white;
              padding: 15px 30px; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Valta Property Valuations</h1>
    </div>

    <h2>Letter of Engagement Ready for Signature</h2>
    <p>Dear Client,</p>

    <p>Your Letter of Engagement for Job #{jobNumber} is ready for your review and signature.</p>

    <p>Please click the button below to review and sign the document electronically:</p>

    <p style="text-align: center; margin: 30px 0;">
      <a href="{signingUrl}" class="button">Review & Sign LOE</a>
    </p>

    <p>If you have any questions, please contact us at:</p>
    <p>
      Email: info@valta.ca<br>
      Phone: (403) 555-0100
    </p>

    <p>Thank you,<br>
    Valta Property Valuations Team</p>
  </div>
</body>
</html>
```

## Signature Status Tracking

### Database Fields

```sql
-- job_loe_details table
ALTER TABLE job_loe_details ADD COLUMN docuseal_submission_id VARCHAR;
ALTER TABLE job_loe_details ADD COLUMN signed_document_url VARCHAR;
ALTER TABLE job_loe_details ADD COLUMN signed_at TIMESTAMP;

-- job_submissions table (status tracking)
ALTER TABLE job_submissions ADD COLUMN status VARCHAR DEFAULT 'pending_loe';
```

### Status Flow

```
pending_loe → loe_sent → loe_signed → payment_pending → job_in_progress
```

**Status Updates:**
- `pending_loe` - Initial state, LOE not yet generated
- `loe_sent` - LOE generated and email sent
- `loe_signed` - Client completed signature (webhook updates)
- `payment_pending` - Next step (future: trigger payment flow)

## Testing

### End-to-End Test

```typescript
test('LOE Generation and Signing Flow', async () => {
  // 1. Create job with required data
  const job = await createTestJob({
    clientEmail: 'test@example.com',
    clientFirstName: 'John',
    clientLastName: 'Doe',
    propertyAddress: '123 Main St, Calgary, AB T2P 1A1'
  });

  // 2. Fill LOE details
  await updateJobDetails(job.id, {
    jobNumber: 'VAL250137',
    appraisalFee: 2500,
    retainerAmount: 1250,
    paymentTerms: 'On LOE Signature'
  });

  // 3. Generate LOE
  const result = await generateLOE(job.id);
  expect(result.docusealSubmissionId).toBeDefined();
  expect(result.signingUrl).toBeDefined();

  // 4. Verify email sent
  const emailLog = await getLastEmail();
  expect(emailLog.to).toBe('test@example.com');
  expect(emailLog.subject).toContain('Letter of Engagement');

  // 5. Simulate signature completion
  await simulateDocuSealWebhook({
    event_type: 'submission.completed',
    data: {
      id: result.docusealSubmissionId,
      status: 'completed'
    }
  });

  // 6. Verify status updated
  const updatedJob = await getJob(job.id);
  expect(updatedJob.status).toBe('loe_signed');
});
```

## Known Issues

### Resolved
- ✅ **Email delivery** - Resend API working correctly
- ✅ **Signature anchors** - DocuSeal anchor tags properly placed
- ✅ **Webhook processing** - Status updates working
- ✅ **Field substitution** - All 22 fields mapping correctly

### Current Limitations
- ⚠️ **Single signer only** - Only client signs (no appraiser counter-signature)
- ⚠️ **No preview before send** - Live preview window not implemented
- ⚠️ **Manual resend** - No automatic retry for failed emails
- ⚠️ **Domain verification pending** - Sending from noreply@crowestudio.com (needs valta.ca)

## Configuration

### Environment Variables

```env
# DocuSeal API
VITE_DOCUSEAL_API_KEY=your_api_key_here
VITE_DOCUSEAL_TEMPLATE_ID=your_template_id

# Resend API
VITE_RESEND_API_KEY=re_8B4Po2eL_84kFfQeEHAf4z4GFTLaqTv94

# Webhook URL
VITE_DOCUSEAL_WEBHOOK_URL=https://[project-ref].supabase.co/functions/v1/docuseal-webhook
```

### DocuSeal Webhook Setup

**Configure in DocuSeal Dashboard:**
1. Settings → Webhooks
2. Add webhook URL: `https://[project-ref].supabase.co/functions/v1/docuseal-webhook`
3. Select event: `submission.completed`
4. Save configuration

## Documentation References

### Implementation Files
- `/Users/bencrowe/Development/APR-Dashboard-v3/src/utils/loe/generateLOE.ts` - LOE generation logic
- `/Users/bencrowe/Development/APR-Dashboard-v3/src/components/dashboard/job-details/LoeQuoteSection.tsx` - UI component
- `/Users/bencrowe/Development/APR-Dashboard-v3/supabase/functions/send-loe-email-fixed/index.ts` - Email sender
- `/Users/bencrowe/Development/APR-Dashboard-v3/supabase/functions/docuseal-webhook/index.ts` - Signature webhook

### Related Sections
- **Section 4: APR Dashboard** - Source of LOE data
- **Section 5: Valcre Integration** - Syncs LOE details
- **Section 7: Email Sequence** - Continues after signature

---

**LOE Generator is production-ready and fully operational with DocuSeal + Resend integration.**
