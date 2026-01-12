# Client Form Submission - Email Notification Flow

**Status:** ✅ Production Active
**Last Updated:** November 5, 2025

---

## Email Architecture Overview

**Who Handles It:** Valta Website project (NOT APR Dashboard)

**Why:** Form lives on Valta Website, so email logic lives there too. APR Dashboard just embeds the form via iframe.

---

## Email Trigger Flow

```
User Submits Form
     ↓
Valta Website Backend
     ↓
Data Saved to job_submissions Table (Supabase)
     ↓
Database Trigger Fires
     ↓
Supabase Edge Function: send-appraisal-request
     ↓
Resend API Sends Email
     ↓
Recipient Receives Notification
```

---

## Edge Function Details

**Location:** Valta Website repository
**File:** `supabase/functions/send-appraisal-request/index.ts`

**Trigger:** Supabase database trigger on `job_submissions` INSERT

**Purpose:**
- Send immediate email notification when new job submitted
- Include direct link to APR Dashboard for that specific job
- Support test mode with `[TEST]` prefix

---

## Email Configuration

### API Provider
**Service:** Resend
**API Key:** `re_8B4Po2eL_84kFfQeEHAf4z4GFTLaqTv94`

### Two-Mode System

| Mode | URL Parameter | Email Subject | Current Recipient | Future Recipient |
|------|--------------|---------------|-------------------|------------------|
| **Test** | `?test=true` | `[TEST] New Appraisal Request` | bc@crowestudio.com | bc@crowestudio.com |
| **Production** | (none) | `New Appraisal Request` | bc@crowestudio.com | clientcare@valta.ca* |

*After valta.ca domain verification complete

---

## Email Content Structure

### Subject Line
- **Test Mode:** `[TEST] New Appraisal Request - [Property Name]`
- **Production:** `New Appraisal Request - [Property Name]`

### Email Body Includes

**Client Information:**
- Client Name (First + Last)
- Client Title
- Client Organization
- Client Phone
- Client Email
- Client Organization Address

**Property Information:**
- Property Name
- Property Address
- Property Type
- Intended Use
- Valuation Premises
- Asset Condition
- Additional Information (if provided)

**Action Link:**
```
Direct Dashboard Link: /dashboard/job/:jobId
```
Example: `https://apr-dashboard-v3.vercel.app/dashboard/job/550e8400-e29b-41d4-a716-446655440000`

---

## Test Mode vs Production

### Test Mode (`?test=true`)
**Purpose:** Development and QA testing without affecting production inbox

**Behavior:**
1. Form displays yellow banner: "🧪 TEST MODE - Email will be marked with [TEST] prefix"
2. Email sent to: `bc@crowestudio.com`
3. Subject line prefixed with `[TEST]`
4. Data saved to same production database (shared with prod)
5. Dashboard link works normally

**Use Cases:**
- Form testing during development
- QA verification before release
- Demo submissions without production noise

### Production Mode (default)
**Purpose:** Real client submissions

**Behavior:**
1. No test mode banner shown
2. Email sent to: `bc@crowestudio.com` (temporary, awaiting domain verification)
3. Subject line: Clean, no prefix
4. Data saved to production database
5. Dashboard link works normally

---

## Domain Verification Status

### Current State
**Email Sender:** Resend default domain
**Recipient:** bc@crowestudio.com (both test and production)

**Why:** Awaiting DNS configuration for valta.ca domain

### After Domain Verification
**Email Sender:** noreply@valta.ca
**Production Recipient:** clientcare@valta.ca
**Test Recipient:** bc@crowestudio.com

**Required DNS Records:**
- SPF record
- DKIM record
- Domain verification TXT record

---

## Integration with APR Dashboard

### How Dashboard Gets Notified

**Dashboard does NOT trigger emails.** The flow is:

1. User fills embedded form in Dashboard iframe
2. Form submits to Valta Website backend
3. Valta Website saves to database
4. Valta Website sends email
5. Email contains link back to Dashboard

### Dashboard's Role

**Only responsibility:** Display the form via iframe

**Dashboard URL Parameters:**
- Adds `?embedded=true` to iframe src (hides website chrome)
- Optionally adds `?test=true` for test mode

**Example iframe src:**
```tsx
const formUrl = `https://valta.ca/request-appraisal/intake?embedded=true${isTestMode ? '&test=true' : ''}`
```

---

## Email Timing

### Expected Delivery Times

| Stage | Timing | Details |
|-------|--------|---------|
| Form Submission | Instant | User clicks "Submit" button |
| Database Save | < 1 second | Supabase writes record |
| Edge Function Trigger | < 2 seconds | Database trigger fires function |
| Email Send (Resend API) | < 5 seconds | API processes and sends |
| **Total Time** | **< 10 seconds** | From submit to inbox |

### If Email Doesn't Arrive

**Check:**
1. Spam/junk folder
2. Supabase Edge Function logs
3. Resend dashboard for delivery status
4. Database record created successfully (verify in `job_submissions` table)

---

## Configuration Code Example

**From Valta Website Edge Function:**
```typescript
const RESEND_API_KEY = 're_8B4Po2eL_84kFfQeEHAf4z4GFTLaqTv94'

// Check if test mode (from form URL parameter)
const isTestMode = searchParams.get('test') === 'true'

// Email recipient logic
const recipient = 'bc@crowestudio.com'
// Future (after domain verification):
// const recipient = isTestMode ? 'bc@crowestudio.com' : 'clientcare@valta.ca'

// Subject line
const subject = isTestMode
  ? `[TEST] New Appraisal Request - ${formData.propertyName}`
  : `New Appraisal Request - ${formData.propertyName}`
```

---

## Future Enhancements

### Planned (Requires Domain Verification)
- [ ] Production emails to clientcare@valta.ca
- [ ] Custom sender: noreply@valta.ca
- [ ] Email templates with Valta branding
- [ ] Automated follow-up email sequence

### Potential Features (Not Yet Scoped)
- [ ] CC additional recipients (client copy option)
- [ ] BCC for internal team distribution
- [ ] Email template variations by property type
- [ ] Automated reminder emails if no response

---

## Related Sections

**Upstream (Form):**
- 01-FORM-FIELD-MAPPING.md - What data gets included in email

**Downstream (Integrations):**
- 03-ClickUp-Integration - Task auto-created on same trigger
- 08-Client-Email-Sequence - Continues after initial notification

---

**Email flow is production-ready and operational.**
**Awaiting domain verification for production recipient routing.**
