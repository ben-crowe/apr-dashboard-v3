# Future Workflow Stages - Implementation Roadmap

**Created:** January 8, 2026  
**Purpose:** Document future workflow stages beyond current implementation  
**Status:** 📋 Planning Phase

---

## Current Workflow (Implemented)

```
1. Form Submission ✅
   ↓
2. Team Email Notification ✅
   ↓
3. Valcre Job Creation ✅
   ↓
4. ClickUp Task Creation ✅
   ↓
5. LOE Generation & Send ✅
   ↓
6. Client Signs LOE ✅
   ↓
7. Webhook Updates Status ✅
```

---

## Future Workflow Stages

### Stage 8: Thank You Email (After LOE Signed)

**Status:** ⏳ Not Implemented  
**Priority:** High  
**Trigger:** DocuSeal webhook `submission.completed`

**What Should Happen:**
1. Client signs LOE
2. Webhook fires (`docuseal-webhook` Edge Function)
3. **NEW:** Send thank you email to client
4. Email content:
   ```
   Subject: Thank You for Signing - We're Getting Started!
   
   Body:
   - Thank you for signing the Letter of Engagement
   - Confirmation of job details
   - Next steps (payment, timeline)
   - Contact information
   ```

**Implementation:**
- Add email sending to `docuseal-webhook/index.ts` after status update
- Use Resend API (same as LOE email)
- Send to `job.client_email`
- Template: Professional thank you message

**Edge Function Update:**
```typescript
// In docuseal-webhook/index.ts, after status update:
if (payload.event_type === 'submission.completed') {
  // ... existing status update code ...
  
  // NEW: Send thank you email
  await supabase.functions.invoke('send-thank-you-email', {
    body: {
      to: job.client_email,
      jobNumber: job.job_number,
      clientName: `${job.client_first_name} ${job.client_last_name}`
    }
  })
}
```

---

### Stage 9: Payment Email & Portal (Time Delay)

**Status:** ⏳ Not Implemented  
**Priority:** Medium  
**Trigger:** Time delay after LOE signed (e.g., 24-48 hours)

**What Should Happen:**
1. LOE signed (Stage 7)
2. **Time delay:** 24-48 hours
3. **NEW:** Send payment email to client
4. Email includes Stripe payment link
5. Client clicks link → Payment portal
6. Client pays via Stripe
7. Payment webhook updates job status

**Email Content:**
```
Subject: Payment Request - [Job Number]

Body:
- Thank you for signing
- Payment amount (appraisal fee, retainer)
- "Pay Now" button → Stripe checkout
- Payment terms reminder
```

**Stripe Integration:**
- Create Stripe Checkout Session
- Generate payment link
- Embed in email
- Handle payment webhook

**Implementation Notes:**
- Stripe credentials needed (see `docs/LOGIN-CREDENTIALS-PHASE-1.md`)
- Payment page: `/payment/:jobId` or `/checkout/:sessionId`
- Webhook: Update job status to 'payment_received'
- Update ClickUp task with payment status

**Edge Function to Create:**
- `send-payment-email` - Sends payment request email
- `create-stripe-session` - Creates Stripe checkout session
- `stripe-webhook` - Handles payment confirmation

---

### Stage 10: Payment Confirmation & Job Kickoff

**Status:** ⏳ Not Implemented  
**Priority:** Medium  
**Trigger:** Stripe payment webhook

**What Should Happen:**
1. Client pays via Stripe
2. Stripe webhook fires
3. **NEW:** Update job status to 'payment_received'
4. **NEW:** Send confirmation email to client
5. **NEW:** Update ClickUp task with payment status
6. **NEW:** Notify team (email/Slack/ClickUp)
7. Job ready for kickoff

**Email Content:**
```
Subject: Payment Received - Thank You!

Body:
- Payment confirmation
- Receipt/invoice
- Next steps (appraisal timeline)
- Contact information
```

**ClickUp Update:**
- Add payment status to task description
- Update custom fields (if using)
- Add comment: "Payment received - Job ready to start"

---

## Implementation Priority

### Phase 1 (Critical - Current Focus)
- ✅ Form submission
- ✅ Team notification
- ✅ Valcre job creation
- ✅ ClickUp task creation
- ✅ LOE generation & send
- ✅ **LOE signing verification** (CRITICAL - testing now)

### Phase 2 (High Priority - Next)
- ⏳ Thank you email after LOE signed
- ⏳ Payment email trigger (time delay)
- ⏳ Stripe payment portal setup

### Phase 3 (Medium Priority - Future)
- ⏳ Payment confirmation email
- ⏳ Payment webhook integration
- ⏳ ClickUp payment status updates
- ⏳ Team notification on payment

---

## Testing Strategy for Future Stages

### Thank You Email Testing
```bash
# 1. Sign LOE (using Playwright)
# 2. Verify webhook fires
# 3. Check Resend API for thank you email
curl -X GET "https://api.resend.com/emails" \
  -H "Authorization: Bearer re_8B4Po2eL_84kFfQeEHAf4z4GFTLaqTv94" | \
  jq '.data[] | select(.subject | contains("Thank You"))'
```

### Payment Flow Testing
```bash
# 1. Trigger payment email (after time delay)
# 2. Verify email sent (Resend API)
# 3. Click payment link (Playwright)
# 4. Complete Stripe checkout (test mode)
# 5. Verify webhook fires
# 6. Verify job status updated
# 7. Verify ClickUp task updated
```

---

## Notes

- **Stripe Setup:** See `docs/LOGIN-CREDENTIALS-PHASE-1.md` for Stripe configuration
- **Time Delay:** Can use Supabase cron jobs or Edge Function scheduling
- **Email Templates:** Use same Resend API as LOE emails
- **Webhook Security:** Verify Stripe webhook signatures
- **Testing:** Use Stripe test mode (card: 4242 4242 4242 4242)

---

**Last Updated:** January 8, 2026  
**Current Focus:** LOE signing verification (Stage 7)  
**Next Steps:** Implement thank you email (Stage 8)
