# Client Email Sequence - Automated Workflow

**Status:** ⚠️ **PARTIALLY IMPLEMENTED**
**Last Updated:** November 4, 2025
**Project:** APR Dashboard v3

---

## Overview

Automated email sequence for client onboarding from LOE signature through payment collection and job kickoff. Designed to minimize manual touchpoints and accelerate time-to-payment.

## Target Workflow (Designed)

### Complete Sequence Design

```
1. LOE Email ✅ IMPLEMENTED
   ↓
2. E-Signature ✅ IMPLEMENTED
   ↓
3. [Time Delay] → Email 2 ❌ NOT IMPLEMENTED
   ↓
4. Payment Page ❌ NOT IMPLEMENTED
   ↓
5. ClickUp Status Update ❌ PARTIALLY IMPLEMENTED
```

### Email 1: Letter of Engagement (✅ Complete)

**Trigger:** Appraiser clicks "Generate & Send LOE"

**Implementation:**
- Edge Function: `send-loe-email-fixed/index.ts`
- Provider: Resend API
- Template: Professional HTML with signing button

**Email Content:**
```
From: Valta Appraisals <noreply@crowestudio.com>
Subject: Letter of Engagement - Ready for Signature

Body:
- Personalized greeting
- Job number reference
- "Review & Sign LOE" button → DocuSeal
- Contact information
- Company branding
```

**Status:** ✅ **FULLY OPERATIONAL**

### E-Signature Process (✅ Complete)

**Provider:** DocuSeal

**Flow:**
1. Client clicks signing link in email
2. Opens DocuSeal portal
3. Reviews LOE document (22 fields populated)
4. Signs electronically
5. Submits signature

**Webhook Integration:**
```typescript
// POST to: /functions/v1/docuseal-webhook
{
  event_type: 'submission.completed',
  data: {
    id: 'docuseal_submission_id',
    status: 'completed',
    documents: [{
      url: 'https://docuseal.com/docs/signed/...'
    }],
    completed_at: '2025-11-04T10:30:00Z'
  }
}
```

**Actions on Signature:**
```typescript
// 1. Update job status
await supabase.from('job_submissions').update({
  status: 'loe_signed'
}).eq('id', jobId);

// 2. Store signed document
await supabase.from('job_loe_details').update({
  signed_document_url: signedDoc.url,
  signed_at: completedAt
}).eq('job_id', jobId);

// 3. Save to file management
await supabase.from('job_files').insert({
  job_id: jobId,
  file_name: 'Signed LOE Agreement',
  category: 'signed_agreement'
});

// 4. TODO: Trigger Email 2 (NOT IMPLEMENTED)
```

**Status:** ✅ **FULLY OPERATIONAL**

### Email 2: Thank You + Payment Request (❌ NOT Implemented)

**Designed Trigger:** LOE signature completion + configurable delay (e.g., 1 hour)

**Intended Content:**
```
From: Valta Appraisals <noreply@valta.ca>
Subject: Thank You - Payment Information Enclosed

Body:
- Thank you for signing LOE
- Reference to signed agreement (attached or linked)
- Payment amount due (retainer from LOE)
- "Pay Now" button → Stripe payment page
- Alternative payment instructions (e-transfer, check)
- Contact for questions
```

**Implementation Gap:**
- ❌ No email template created
- ❌ No trigger mechanism
- ❌ No time delay system
- ❌ No Stripe payment page

**Status:** ❌ **NOT IMPLEMENTED**

### Payment Processing (❌ NOT Implemented)

**Designed System:** Stripe integration with hosted payment page

**Intended Flow:**
1. Client clicks "Pay Now" in Email 2
2. Redirects to Stripe-hosted payment page
3. Client enters payment details
4. Stripe processes payment
5. Stripe webhook → APR Dashboard
6. Dashboard updates job status
7. ClickUp status update triggered

**Required Components:**
- ❌ Stripe account setup
- ❌ Stripe API integration
- ❌ Payment page configuration
- ❌ Webhook endpoint for payment confirmation
- ❌ Database fields for payment tracking

**Alternative Mentioned:** GoHighLevel (GHL) white-labeled payment pages

**Status:** ❌ **NOT IMPLEMENTED**

### ClickUp Status Updates (⚠️ Partial)

**Current Implementation (✅):**
```typescript
// Task auto-created on form submission
await createClickUpTask({
  name: `${jobNumber} - ${propertyName}`,
  status: 'loe pending',
  custom_fields: { ... }
});

// Both tables updated for button persistence
await supabase.from('job_submissions').update({
  clickup_task_id: task.id,
  clickup_task_url: task.url
});

await supabase.from('job_loe_details').upsert({
  job_id: jobId,
  clickup_task_id: task.id,
  clickup_task_url: task.url
});
```

**Missing Automation (❌):**
```typescript
// Should update on LOE signed
onLOESigned() {
  await updateClickUpTask(taskId, {
    status: 'pending payment'
  });
}

// Should update on payment received
onPaymentReceived() {
  await updateClickUpTask(taskId, {
    status: 'job in progress',
    custom_fields: {
      'Payment Received': true,
      'Payment Date': new Date()
    }
  });
}
```

**Status:** ⚠️ **PARTIALLY IMPLEMENTED** (auto-creation works, status updates missing)

## GoHighLevel (GHL) Alternative

### Evidence of GHL Plan

**From APR Systems Guide v3.1:**
- White-labeled automation platform
- Payment follow-up emails
- Landing pages for payment collection
- Email sequence automation
- CRM capabilities

**From DocuSeal Webhook Code:**
```typescript
// Line 113 in docuseal-webhook/index.ts
// TODO: Trigger payment flow (GHL integration)
// This would be the next step in the workflow
```

**GHL vs Stripe Decision:**

| Feature | Stripe | GoHighLevel |
|---------|--------|-------------|
| Payment Processing | ✅ Industry standard | ✅ Built-in |
| Email Automation | ❌ Requires separate tool | ✅ Native |
| Landing Pages | ❌ Requires separate tool | ✅ Visual builder |
| CRM Integration | ❌ Requires webhook | ✅ Native CRM |
| White Labeling | ⚠️ Limited | ✅ Full control |
| Cost | Per transaction | Monthly subscription |

**Recommendation:** GHL provides more comprehensive solution for automated email sequences + payment + CRM in one platform.

## Implementation Roadmap

### Phase 1: Email 2 (Thank You + Payment Info)

**Effort:** 1-2 days

**Tasks:**
1. Create email template with payment instructions
2. Set up time-delayed trigger (1 hour after signature)
3. Store "Email 2 sent" timestamp in database
4. Manual payment tracking workflow

**Database Changes:**
```sql
ALTER TABLE job_loe_details ADD COLUMN thank_you_email_sent_at TIMESTAMP;
ALTER TABLE job_loe_details ADD COLUMN payment_info_sent BOOLEAN DEFAULT FALSE;
```

**Edge Function:**
```typescript
// supabase/functions/send-thank-you-email/index.ts
export const sendThankYouEmail = async (jobId) => {
  const job = await getJobDetails(jobId);

  await resend.emails.send({
    from: 'Valta Appraisals <noreply@valta.ca>',
    to: job.clientEmail,
    subject: 'Thank You - Payment Information Enclosed',
    html: generateThankYouEmailHTML(job)
  });

  await supabase.from('job_loe_details').update({
    thank_you_email_sent_at: new Date().toISOString(),
    payment_info_sent: true
  }).eq('job_id', jobId);
};
```

### Phase 2: Stripe Payment Integration

**Effort:** 3-5 days

**Tasks:**
1. Set up Stripe account
2. Create Stripe Checkout session
3. Build payment page
4. Implement webhook for payment confirmation
5. Update job status on payment
6. Trigger ClickUp status update

**Database Changes:**
```sql
ALTER TABLE job_loe_details ADD COLUMN stripe_session_id VARCHAR;
ALTER TABLE job_loe_details ADD COLUMN payment_status VARCHAR DEFAULT 'pending';
ALTER TABLE job_loe_details ADD COLUMN payment_amount NUMERIC;
ALTER TABLE job_loe_details ADD COLUMN payment_received_at TIMESTAMP;
ALTER TABLE job_loe_details ADD COLUMN stripe_payment_intent_id VARCHAR;
```

**Implementation:**
```typescript
// Create payment link
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'cad',
      product_data: {
        name: 'Appraisal Retainer',
        description: `Job ${jobNumber} - ${propertyAddress}`
      },
      unit_amount: retainerAmount * 100 // Convert to cents
    },
    quantity: 1
  }],
  mode: 'payment',
  success_url: `${DASHBOARD_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${DASHBOARD_URL}/payment/cancelled`,
  metadata: {
    job_id: jobId,
    job_number: jobNumber
  }
});

// Store session ID
await supabase.from('job_loe_details').update({
  stripe_session_id: session.id,
  payment_status: 'initiated'
}).eq('job_id', jobId);

// Return payment URL for email
return session.url;
```

**Webhook Handler:**
```typescript
// supabase/functions/stripe-webhook/index.ts
export const handleStripeWebhook = async (event) => {
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { job_id, job_number } = session.metadata;

    // Update payment status
    await supabase.from('job_loe_details').update({
      payment_status: 'completed',
      payment_received_at: new Date().toISOString(),
      payment_amount: session.amount_total / 100,
      stripe_payment_intent_id: session.payment_intent
    }).eq('job_id', job_id);

    // Update job status
    await supabase.from('job_submissions').update({
      status: 'job_in_progress'
    }).eq('id', job_id);

    // Update ClickUp status
    const job = await getJob(job_id);
    if (job.clickup_task_id) {
      await updateClickUpTaskStatus(job.clickup_task_id, 'job in progress');
    }
  }
};
```

### Phase 3: GHL Integration (Alternative to Stripe)

**Effort:** 5-7 days

**Tasks:**
1. Set up GHL account and API access
2. Create payment landing page in GHL
3. Configure email automation in GHL
4. Set up GHL webhook to APR Dashboard
5. Test complete workflow

**GHL Workflow:**
```
1. DocuSeal webhook → APR Dashboard
2. APR Dashboard → GHL API (trigger automation)
3. GHL sends Email 2 with payment link
4. GHL processes payment
5. GHL webhook → APR Dashboard (payment confirmed)
6. APR Dashboard → Update ClickUp
```

**API Integration:**
```typescript
// Trigger GHL automation
const triggerGHLSequence = async (contact) => {
  await fetch('https://rest.gohighlevel.com/v1/contacts/lookup', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GHL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: contact.email,
      firstName: contact.firstName,
      lastName: contact.lastName,
      customFields: {
        'job_number': contact.jobNumber,
        'retainer_amount': contact.retainerAmount,
        'property_address': contact.propertyAddress
      },
      tags: ['loe-signed']
    })
  });

  // GHL automation triggered by 'loe-signed' tag
};
```

## Current Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| **Email 1: LOE** | ✅ Complete | Resend API, working |
| **E-Signature** | ✅ Complete | DocuSeal, webhook working |
| **Email 2: Thank You** | ❌ Not Implemented | Template missing |
| **Payment Page** | ❌ Not Implemented | Stripe or GHL needed |
| **Payment Webhook** | ❌ Not Implemented | No handler exists |
| **ClickUp Auto-Create** | ✅ Complete | On form submission |
| **ClickUp Status Updates** | ❌ Not Implemented | Manual only |
| **Time Delays** | ❌ Not Implemented | No scheduler |

## Decision Required

### Option 1: Stripe Payment Only
**Effort:** 3-5 days
**Pros:** Simple, focused implementation
**Cons:** Still need separate email system for Email 2

### Option 2: GoHighLevel (GHL) Full Suite
**Effort:** 5-7 days
**Pros:** Complete automation platform, email + payment + CRM
**Cons:** Learning curve, subscription cost

### Option 3: Manual Process (Current)
**Effort:** None
**Workflow:**
1. Client signs LOE (automated)
2. Appraiser manually sends payment instructions (email/phone)
3. Client sends payment (e-transfer/check)
4. Appraiser manually updates ClickUp status
**Pros:** No development needed
**Cons:** Manual touchpoints, slower payment

## Documentation References

### Implementation Files
- `/Users/bencrowe/Development/APR-Dashboard-v3/supabase/functions/send-loe-email-fixed/index.ts` - Email 1 (working)
- `/Users/bencrowe/Development/APR-Dashboard-v3/supabase/functions/docuseal-webhook/index.ts` - Signature webhook (working)
- `/Users/bencrowe/Development/APR-Dashboard-v3/supabase/functions/create-clickup-task/index.ts` - Task creation (working)

### Related Sections
- **Section 3: ClickUp Integration** - Task management system
- **Section 6: LOE Generator** - Email 1 and e-signature
- **Section 2: Pipedrive/GHL Decision** - CRM choice affects this section

---

**DECISION REQUIRED: Choose payment automation strategy (Stripe, GHL, or manual process).**
