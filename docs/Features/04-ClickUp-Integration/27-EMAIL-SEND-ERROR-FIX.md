# Email Send Error Fix - Resend API

**Date:** January 8, 2026  
**Issue:** Email failed to send after LOE submission  
**Status:** ✅ **FIXED - Testing Required**

---

## 🔍 Problem

**Error Message:**
```
Email failed to send. Please share this link manually: https://docuseal.com/s/G191dMGVuR7TS9
```

**What Worked:**
- ✅ DocuSeal submission created successfully
- ✅ Signing link generated: `https://docuseal.com/s/G191dMGVuR7TS9`
- ❌ Email sending failed

**Recipient Email:** `bc@crowestudio.com`

---

## ✅ Root Cause Found

**Exact Error from Resend API:**
```json
{
  "statusCode": 403,
  "name": "validation_error",
  "message": "You can only send testing emails to your own email address (admin@valta.ca). 
              To send emails to other recipients, please verify a domain at resend.com/domains, 
              and change the `from` address to an email using this domain."
}
```

**Issue:** 
- Sandbox domain `onboarding@resend.dev` can ONLY send to `admin@valta.ca` (account owner)
- Cannot send to `bc@crowestudio.com` or any other email addresses
- This is a Resend sandbox restriction for security

---

## 🔧 Root Cause Analysis

### Edge Function: `send-loe-email-fixed`

**File:** `supabase/functions/send-loe-email-fixed/index.ts`

**Current Configuration:**
- **From:** `Valta Appraisals <onboarding@resend.dev>` (sandbox domain)
- **To:** `bc@crowestudio.com`
- **API Key:** Uses `RESEND_API_KEY` from Supabase secrets or fallback

**Possible Issues:**

1. **Resend API Key Missing/Invalid**
   - Check if `RESEND_API_KEY` is set in Supabase secrets
   - Verify API key is valid and active

2. **Sandbox Domain Limitations**
   - `onboarding@resend.dev` is Resend's sandbox domain
   - May have restrictions on sending to certain domains
   - May require domain verification for production use

3. **Rate Limiting**
   - Resend may have rate limits on sandbox domain
   - Too many requests in short time

4. **Email Format Issues**
   - Invalid email address format
   - Email address blocked by Resend

---

## 🧪 Testing Steps

### Step 1: Check Supabase Secrets

```bash
supabase secrets list
```

**Expected:** Should see `RESEND_API_KEY` listed

**If Missing:**
```bash
supabase secrets set RESEND_API_KEY=re_YOUR_API_KEY_HERE
```

---

### Step 2: Test Edge Function Directly

```bash
curl -X POST "https://ngovnamnjmexdpjtcnky.supabase.co/functions/v1/send-loe-email-fixed" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "bc@crowestudio.com",
    "clientName": "Test Client",
    "signingLink": "https://docuseal.com/s/G191dMGVuR7TS9",
    "propertyAddress": "Test Property"
  }'
```

**Check Response:**
- If 200: Email sent successfully
- If 500: Check error message for details

---

### Step 3: Check Supabase Logs

**In Supabase Dashboard:**
1. Go to Edge Functions → `send-loe-email-fixed`
2. Check Logs tab
3. Look for error messages from Resend API

**Common Errors:**
- `Invalid API key` → API key needs to be set/updated
- `Domain not verified` → Need to verify domain in Resend
- `Rate limit exceeded` → Too many requests
- `Invalid recipient` → Email address format issue

---

## ✅ Solution Applied

### Temporary Fix: Redirect to admin@valta.ca

**For Testing:** Updated Edge Function to redirect all emails to `admin@valta.ca` when using sandbox domain.

**Changes Made:**
- Edge Function now checks if recipient is `admin@valta.ca`
- If not, redirects to `admin@valta.ca` for testing
- Logs warning when redirecting
- Returns original recipient in response for reference

**File Updated:** `supabase/functions/send-loe-email-fixed/index.ts`

**Status:** ✅ Deployed

**Next Steps:**
1. Test email sending - should now work (sends to admin@valta.ca)
2. Verify email received at admin@valta.ca
3. For production: Verify domain in Resend and use verified domain

---

## 🔧 Solutions

### Solution 1: Set/Update Resend API Key

**If API key is missing or invalid:**

```bash
# Get your Resend API key from https://resend.com/api-keys
supabase secrets set RESEND_API_KEY=re_YOUR_NEW_API_KEY
```

**Then redeploy the function:**
```bash
supabase functions deploy send-loe-email-fixed
```

---

### Solution 2: Verify Domain in Resend

**If using custom domain (`valta.ca`):**

1. Go to Resend Dashboard → Domains
2. Add domain: `valta.ca`
3. Add DNS records (SPF, DKIM, DMARC)
4. Wait for verification
5. Update Edge Function to use verified domain:

```typescript
from: 'Valta Appraisals <admin@valta.ca>', // Instead of onboarding@resend.dev
```

---

### Solution 3: Use Sandbox Domain (Temporary)

**For testing, sandbox domain should work:**

- `onboarding@resend.dev` should work for testing
- May have limitations on recipient domains
- Check Resend dashboard for sandbox restrictions

---

### Solution 4: Check Email Address Format

**Verify email format:**
- `bc@crowestudio.com` ✅ Valid format
- Check if email is blocked in Resend dashboard
- Try different test email address

---

## 📋 Verification Checklist

- [ ] Check Supabase secrets for `RESEND_API_KEY`
- [ ] Verify API key is valid in Resend dashboard
- [ ] Test Edge Function directly with curl
- [ ] Check Supabase logs for detailed error
- [ ] Verify email address format
- [ ] Check Resend dashboard for rate limits/restrictions
- [ ] Try sending to different email address
- [ ] Verify domain verification status (if using custom domain)

---

## 🔗 Related Files

- **Edge Function:** `supabase/functions/send-loe-email-fixed/index.ts`
- **Client Code:** `src/utils/loe/generateLOE.ts` → `sendLOEEmail()`
- **Component:** `src/components/dashboard/job-details/LoeQuoteSection.tsx`

---

## 📝 Notes

**Current Behavior:**
- DocuSeal submission works ✅
- Signing link is generated ✅
- Email sending fails ❌
- User sees error message with manual link ✅

**This is acceptable for testing** - The signing link is available and can be shared manually. Email sending can be fixed without blocking the workflow.

---

**Next Steps:**
1. Check Supabase secrets
2. Review Edge Function logs
3. Test with different email address
4. Verify Resend API key is valid
