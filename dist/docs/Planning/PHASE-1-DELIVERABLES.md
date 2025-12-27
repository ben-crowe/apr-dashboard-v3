# Phase 1: Critical Workflow - Testing & Launch Checklist

**Version:** 1.0  
**Last Updated:** November 2, 2025  
**Purpose:** Get core appraisal workflow functioning and client-ready

---

## Overview

Phase 1 is the **minimum viable workflow** that must work perfectly before accepting real client jobs. This is not about features - it's about the essential path working end-to-end with professional client experience.

**The Core Path:**
```
Client Form → Dashboard → Valcre → LOE Email → Signature → Payment → Ready to Work
```

Everything else (N8N automations, Houski, advanced features) is Phase 2+.

---

## The Workflow (Visual)

```
┌─────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                      │
└─────────────────────────────────────────────────────────────────┘

1. Client fills form on valta.ca
         │
         ▼
2. Receives confirmation email
         │
         ▼
[WAIT - Internal processing]
         │
         ▼
3. Receives LOE email (DocuSeal link)
         │
         ▼
4. Opens signing page (looks like Valta site)
         │
         ▼
5. Signs LOE
         │
         ▼
6. Receives payment follow-up email
         │
         ▼
7. Opens payment page (looks like Valta site)
         │
         ▼
8. Completes payment
         │
         ▼
9. Receives confirmation & next steps

┌─────────────────────────────────────────────────────────────────┐
│ INTERNAL SIDE (Chris & Team)                                    │
└─────────────────────────────────────────────────────────────────┘

1. Form submission hits Supabase
         │
         ├──────────────────────┐
         │                      │
         ▼                      ▼
2. Dashboard updated     ClickUp task created
   (Section 1 filled)    "PENDING - Property"
         │
         ▼
3. Chris reviews & fills Section 2
   (Fee, retainer, delivery date)
         │
         ▼
4. Creates Valcre job (returns VAL#####)
         │
         ├──────────────────────┐
         │                      │
         ▼                      ▼
5. VAL# saved        ClickUp task updated
   in database       "VAL##### - Property"
         │
         ▼
6. Generates LOE (preview modal)
         │
         ▼
7. Sends LOE email to client
         │
         ▼
8. Client signs → Webhook fires
         │
         ├──────────────────────┐
         │                      │
         ▼                      ▼
9. Status: "loe_signed"  ClickUp: "LOE Signed"
         │
         ▼
10. Payment follow-up triggered
         │
         ▼
11. Payment received → Job ready
```

---

## Functional Testing Checklist

### 1. Form Submission & Database

- [ ] Client form accessible from valta.ca
- [ ] All required fields validate properly
- [ ] Optional fields accept empty values
- [ ] Form submits successfully
- [ ] Data appears in Supabase `job_submissions` table
- [ ] All fields map correctly to database columns
- [ ] Job number auto-generated (format: APR-######)
- [ ] Confirmation email sent to client (if implemented)

**Test with:** At least 3 different property types to verify field handling

---

### 2. ClickUp Auto-Creation

- [ ] Task created in ClickUp immediately on form submission
- [ ] Task name: "PENDING - [Property Name], [City]"
- [ ] Task created in correct list/workspace
- [ ] 9 subtasks auto-added from template
- [ ] `clickup_task_id` saved to database
- [ ] `clickup_task_url` saved to database
- [ ] Dashboard button shows "View in ClickUp" (not "Create")
- [ ] Button link opens correct ClickUp task

**Test trigger:** Submit test form, check ClickUp within 30 seconds

**Known Issue:** If task doesn't auto-create, check webhook configuration in Supabase

---

### 3. Dashboard Display

- [ ] Job appears in dashboard list
- [ ] Job details page accessible via URL: `/dashboard/job/[id]`
- [ ] Section 1 displays all client/property info correctly
- [ ] Section 1 is read-only (no editing)
- [ ] Section 2 fields are editable
- [ ] Section 3 fields are editable
- [ ] Auto-save works on blur (field loses focus)
- [ ] "Saved" notification appears after auto-save
- [ ] No data loss when navigating away and returning

---

### 4. Valcre Job Creation

- [ ] "Create Valcre Job" button visible in Section 2
- [ ] Button only clickable when required fields filled
- [ ] Click triggers Valcre API call
- [ ] Success returns VAL##### number
- [ ] VAL# saved to database (`job_loe_details.valcre_job_id`)
- [ ] Button changes to "View Valcre Job"
- [ ] Button link opens correct Valcre job in new tab

**Field Mapping Verification:**
- [ ] Client name (First + Last) → Contact entity
- [ ] Property address → Property entity
- [ ] Appraisal fee ($ stripped) → Fee field
- [ ] Retainer ($ stripped) → Retainer field (NOT RetainerAmount)
- [ ] Property type matches Valcre dropdown exactly
- [ ] All Section 2 fields map correctly

**Test with:** Real Valcre credentials, check job appears in Valcre system

---

### 5. ClickUp Task Update (After Valcre)

- [ ] After Valcre job created, ClickUp task name updates
- [ ] New name: "VAL##### - [Property Name], [City]"
- [ ] Update happens automatically (no manual action)
- [ ] Task description includes dashboard link
- [ ] Task description includes Valcre job link
- [ ] Update appears in ClickUp within 1 minute

**If this doesn't work:** Check trigger in Valcre creation code

---

### 6. LOE Generation

- [ ] "Preview & Send LOE" button visible in Section 2
- [ ] Button only clickable after Valcre job created
- [ ] Click opens modal with LOE preview
- [ ] LOE displays all job details correctly
- [ ] 4-page format displays properly
- [ ] Professional formatting maintained
- [ ] Email recipient field pre-filled (client email)
- [ ] Can override email for testing

---

### 7. Email Delivery

- [ ] "Send to Client" button in LOE modal
- [ ] Click triggers email via Resend API
- [ ] Email arrives in client inbox (check spam folder too)
- [ ] FROM shows: Valta Appraisals <admin@valta.ca>
- [ ] Subject clear and professional
- [ ] Email body formatted properly
- [ ] DocuSeal signing link included
- [ ] Link is clickable

**Test with:** Multiple email providers (Gmail, Outlook, etc.)

**Timing:** Email should arrive within 1-2 minutes

---

### 8. DocuSeal Signing Page

- [ ] Signing link opens DocuSeal page
- [ ] Page loads without errors
- [ ] LOE document displays correctly
- [ ] Signature fields visible and functional
- [ ] Date fields auto-populate
- [ ] Can complete signature (draw, type, or upload)
- [ ] "Submit" button works
- [ ] Submission triggers webhook

**CLIENT EXPERIENCE (CRITICAL):**
- [ ] **Page styled to match valta.ca branding**
- [ ] **NO DocuSeal branding visible**
- [ ] **Same colors as Valta website**
- [ ] **Same fonts as Valta website**
- [ ] **Logo placement matches Valta site**
- [ ] **Client feels like they're still "on Valta"**
- [ ] **No jarring "where am I?" experience**

**Test with:** Someone unfamiliar with the system - do they notice they left Valta's site?

---

### 9. Signature Webhook & Status Update

- [ ] After signature submitted, webhook fires
- [ ] Job status updates to "loe_signed" in database
- [ ] Update appears in dashboard
- [ ] `loe_signed_at` timestamp recorded
- [ ] Signed document stored/accessible
- [ ] ClickUp task updated: Status or comment shows "LOE Signed"

**Timing:** Should happen within 30 seconds of signature

**If webhook doesn't fire:** Check DocuSeal webhook configuration

---

### 10. Payment Follow-Up Email (N8N Automation)

**N8N Workflow triggers on LOE signature:**
- [ ] DocuSeal webhook fires to N8N
- [ ] N8N queries Supabase for job details (amount, client email)
- [ ] N8N creates Stripe checkout session
- [ ] N8N generates payment email with checkout link
- [ ] Email sent via Resend (FROM: admin@valta.ca)
- [ ] Email arrives in client inbox
- [ ] Email content professional (Valta branding)
- [ ] Payment link included and clickable
- [ ] Pipedrive deal updated: "Payment Requested"
- [ ] ClickUp task commented: "Payment email sent - $X,XXX"

**Timing:** Immediate (triggered by signature webhook)

---

### 11. Payment Page (Stripe Checkout / Next.js)

**Approach:** Stripe Checkout embedded in Next.js page on APR Dashboard

- [ ] Payment link opens checkout page on dashboard domain
- [ ] Page loads without errors
- [ ] Stripe payment form displays correctly
- [ ] All payment fields functional (card, billing info)
- [ ] Can complete test payment in Stripe test mode

**CLIENT EXPERIENCE (CRITICAL):**
- [ ] **Page styled to match valta.ca branding**
- [ ] **Same colors, fonts, logo as Valta site**
- [ ] **Seamless visual continuation from LOE email**
- [ ] **Looks like client never left Valta ecosystem**
- [ ] **Minimal Stripe branding (powered by Stripe badge acceptable)**
- [ ] **Professional, trustworthy appearance**
- [ ] **Responsive design (works on mobile)**

**Implementation:**
- Next.js page at `/payment/:jobId` or `/checkout/:sessionId`
- Stripe Checkout embedded (iframe or redirect)
- Valta branding wrapper around Stripe form
- SSL certificate on dashboard domain

**Test on:**
- [ ] Desktop Chrome
- [ ] Desktop Safari
- [ ] Mobile iOS
- [ ] Mobile Android

**Test with:** Someone who doesn't know the system - do they trust entering payment info?

---

### 12. Payment Confirmation & Job Activation (N8N Automation)

**N8N Workflow triggers on Stripe payment success:**
- [ ] Stripe webhook fires to N8N
- [ ] N8N updates Supabase: `payment_received = true`, `payment_date = now()`
- [ ] Dashboard reflects updated status
- [ ] N8N sends confirmation email to client (receipt + next steps)
- [ ] Pipedrive deal updated: "Payment Received - Job Active"
- [ ] ClickUp task updated: "Payment received $X,XXX - Job ready to work"
- [ ] Job now "ready to work" status

---

## Client Experience Verification

### Visual Continuity Audit

**Purpose:** Ensure client never feels they've "left" Valta's ecosystem

**Check each touchpoint:**

1. **Confirmation Email (Form Submission)**
   - [ ] Valta logo visible
   - [ ] Matches valta.ca color scheme
   - [ ] Professional tone
   - [ ] Clear next steps

2. **LOE Email**
   - [ ] Valta branding
   - [ ] Professional layout
   - [ ] Clear call-to-action
   - [ ] Link doesn't look suspicious

3. **DocuSeal Signing Page**
   - [ ] Looks like valta.ca (colors, fonts, layout)
   - [ ] Valta logo prominent
   - [ ] No competing branding
   - [ ] Professional, trustworthy appearance

4. **Payment Follow-Up Email**
   - [ ] Consistent with previous emails
   - [ ] Clear instructions
   - [ ] Payment link looks legitimate

5. **Payment Landing Page**
   - [ ] Strongest branding match (this is money)
   - [ ] Looks exactly like valta.ca
   - [ ] SSL certificate shows Valta domain (or acceptable)
   - [ ] Payment form professional
   - [ ] Trust signals visible (secure, encrypted, etc.)

6. **Confirmation Email (Payment)**
   - [ ] Receipt provided
   - [ ] Next steps clear
   - [ ] Contact information visible
   - [ ] Professional thank-you message

**Gut Check:** Show the entire journey to someone unfamiliar. Ask:
- "Does this feel like one unified system or multiple disconnected tools?"
- "At any point did you feel confused or concerned?"
- "Would you trust entering your payment information?"

---

## Payment Setup Requirements

### Information Needed from Client (Chris/Valta)

Before payment page can go live, gather from Valta's bookkeeper:

**Banking Information:**
- [ ] Business bank account for deposits
- [ ] Bank routing number
- [ ] Account number
- [ ] Account holder name (must match business name)

**Payment Processor:**
- [ ] Which processor? (Stripe, Square, other)
- [ ] Existing account or new setup required?
- [ ] Login credentials for processor admin
- [ ] API keys for integration

**Business Information:**
- [ ] Legal business name
- [ ] Business tax ID / EIN
- [ ] Business address
- [ ] Business phone number
- [ ] Business email for receipts

**Preferences:**
- [ ] Payment methods accepted (credit card, debit, ACH, etc.)
- [ ] Payment timing (due immediately or net terms?)
- [ ] Partial payments allowed or full only?
- [ ] Retainer percentage (if different from appraisal quote)

**Create Q&A document for client:**
- Simple checklist format
- "We need X, Y, Z to set up payments"
- Include WHY each item needed (builds trust)
- Estimated setup time once info provided

---

## Known Blockers & Issues

### High Priority (Must Fix Before Launch)

1. **ClickUp Task Auto-Creation**
   - **Status:** Implementation exists, needs verification
   - **Test:** Submit form, verify task appears immediately
   - **If broken:** Check Supabase webhook configuration

2. **Valcre Field Mapping**
   - **Known Issue:** Retainer field name must be `Retainer` not `RetainerAmount`
   - **Verify:** Check `src/utils/webhooks/valcre.ts` line 142
   - **Test:** Create job, check retainer amount in Valcre matches dashboard

3. **DocuSeal Branding**
   - **Status:** Unknown if branded to match Valta
   - **Must verify:** Open signing page, visually inspect
   - **Impact:** Client trust depends on this

4. **Payment Page Branding**
   - **Status:** Needs creation/verification
   - **Must verify:** Visual match to valta.ca
   - **Impact:** Payment security concerns if looks generic

5. **Email Domain Verification**
   - **Current:** valta.ca verified
   - **Verify:** admin@valta.ca works (not noreply)
   - **Test:** Send test email, check deliverability

### Medium Priority (Fix Soon)

6. **ClickUp Task Description Formatting**
   - **Current:** Basic description
   - **Wanted:** Formatted markdown with all job details
   - **Impact:** Task exists, just needs prettier format

7. **Property Contact Fields Missing from UI**
   - **Issue:** Data collected in form but not visible/editable in dashboard
   - **Impact:** Can't verify property contact info
   - **Workaround:** Data exists, just not displayed

8. **Testing Status Language**
   - **Issue:** Some sections say "Not Tested" (confusing)
   - **Fix:** Use "Functionally tested, awaiting client acceptance"
   - **Impact:** Documentation clarity only

---

## Success Criteria

**Phase 1 is COMPLETE when:**

✅ All functional tests pass  
✅ Client experience is seamless (visual continuity verified)  
✅ Payment setup complete (banking info gathered, processor configured)  
✅ Chris and team confident in workflow  
✅ Ready to accept real client jobs  

**Phase 1 is NOT complete if:**

❌ Any step in core workflow broken  
❌ DocuSeal or payment page looks generic/unbranded  
❌ ClickUp tasks not auto-creating  
❌ Valcre field mapping errors  
❌ Team has concerns or confusion  

---

## Next Steps After Phase 1

Once Phase 1 complete and working:

**Phase 2: Enhanced Automation**
- Expand N8N workflows (Phase 1 has payment automation)
- Advanced email sequences and reminders
- Automated status updates and notifications

**Phase 3: Data Enhancement**
- Houski integration (with validation)
- Advanced document hub (Section 4)
- PDF data extraction
- Municipal scraping

**Phase 4: Analytics & Optimization**
- Performance tracking
- Client satisfaction metrics
- Bottleneck identification
- Continuous improvement

**But first:** Get Phase 1 solid. Everything else is enhancement.

---

## Resources

**Technical Documentation:**
- Complete Systems Guide: `APR-Systems-Guide-v3.1.md`
- ClickUp Implementation: `/_ClickUp-Integration/01-Documentation/README.md`
- DocuSeal Implementation: `/docs-extra/DocuSeal-Implementation.md`

**For Questions:**
- Ben (Project lead)
- Systems Guide (technical reference)
- Session notes (context and decisions)

---

**Document Version:** 1.0  
**Created:** November 2, 2025  
**Purpose:** Phase 1 testing and launch readiness

---

**END OF PHASE 1 DELIVERABLES DOCUMENT**
