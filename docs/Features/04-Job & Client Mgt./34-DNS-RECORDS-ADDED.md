# DNS Records Added - Verification Steps

**Date:** January 8, 2026  
**Status:** ✅ DNS Records Added to GoDaddy  
**Domain:** `crowestudio.com`

---

## ✅ Records Added

You mentioned adding "four MX records" - you should have added:

1. ✅ **DKIM** (TXT) - `resend._domainkey`
2. ✅ **SPF MX** (MX) - `send` → `feedback-smtp.us-east-1.amazonses.com`
3. ✅ **SPF TXT** (TXT) - `send` → `v=spf1 include:amazonses.com ~all`
4. ✅ **DMARC** (TXT) - `_dmarc` (optional but recommended)

**Note:** Only #2 is actually an MX record - the others are TXT records. But as long as all 4 are added, you're good!

---

## ⏳ Next Steps: Wait & Verify

### Step 1: Wait for DNS Propagation

**Wait Time:** 5-60 minutes (usually 10-30 minutes)

**Why:** DNS changes need to propagate across the internet

**Check Propagation (Optional):**
- Go to: https://dnschecker.org
- Search for: `resend._domainkey.crowestudio.com` (TXT)
- Should show the DKIM value once propagated

---

### Step 2: Verify in Resend

1. **Go to Resend:** https://resend.com/login
   - Email: `admin@valta.ca`
   - Password: `YmnG6HKD$%#FSUPE`

2. **Navigate to Domains:**
   - Click **"Domains"** in sidebar
   - Find `crowestudio.com` in the list

3. **Click "Verify" Button:**
   - Click the **"Verify"** button next to `crowestudio.com`
   - Resend will check DNS records

4. **Check Status:**
   - Should change to **"Verified"** ✅
   - If still "Pending" or "Failed", wait longer and try again

---

### Step 3: Update Edge Function (After Verification)

Once domain is verified, update the Edge Function to use it:

**File:** `supabase/functions/send-loe-email-fixed/index.ts`

**Changes Needed:**

1. **Change `from` address:**
```typescript
// OLD (sandbox):
from: 'Valta Appraisals <onboarding@resend.dev>',

// NEW (verified domain - crowestudio.com):
from: 'Valta Appraisals <noreply@crowestudio.com>',
```

2. **Remove redirect logic:**
```typescript
// REMOVE THIS ENTIRE BLOCK:
const actualRecipient = 'admin@valta.ca';
if (to !== 'admin@valta.ca') {
  console.log(`⚠️ Sandbox restriction...`);
}

// REPLACE WITH:
// Send to actual recipient (no restrictions after domain verification)
const actualRecipient = to;
```

3. **Update response:**
```typescript
// Change recipient back to actual recipient
recipient: actualRecipient, // Instead of always admin@valta.ca
// Remove originalRecipient and note fields
```

**Then deploy:**
```bash
supabase functions deploy send-loe-email-fixed
```

**Note:** Using `crowestudio.com` for now. Later, when Resend plan is upgraded, can switch to `valta.ca` for production.

---

## 🎉 After Verification

**What You Can Do:**
- ✅ Send emails to `bc@crowestudio.com` (your email)
- ✅ Send emails to any email address
- ✅ No sandbox restrictions
- ✅ Professional `from` address: `noreply@crowestudio.com`

**Test:**
- Send LOE email to `bc@crowestudio.com`
- Should arrive successfully!

---

## 📋 Verification Checklist

- [x] DNS records added to GoDaddy
- [ ] Waited 5-60 minutes for propagation
- [ ] Clicked "Verify" in Resend
- [ ] Status shows "Verified" ✅
- [ ] Updated Edge Function to use verified domain
- [ ] Deployed Edge Function
- [ ] Tested sending to bc@crowestudio.com

---

**Current Status:** DNS records added ✅  
**Next:** Wait for propagation, then verify in Resend
