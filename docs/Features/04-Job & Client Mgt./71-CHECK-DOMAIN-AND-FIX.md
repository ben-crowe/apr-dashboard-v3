# Check Domain Verification and Fix Email Redirect

**Issue:** LOE email sent but not received in bc@crowestudio.com inbox  
**Likely Cause:** Email redirected to admin@valta.ca due to sandbox restriction

---

## Step 1: Check if Domain is Verified

**Go to Resend Dashboard:**
1. Login: https://resend.com/login
   - Email: `admin@valta.ca`
   - Password: `YmnG6HKD$%#FSUPE`

2. **Check Domains:**
   - Click "Domains" in sidebar
   - Look for `crowestudio.com`
   - Check status: "Verified" ✅ or "Pending" ⏳

---

## Step 2: If Domain is Verified

**Update Edge Function to remove redirect:**

**File:** `supabase/functions/send-loe-email-fixed/index.ts`

**Changes:**
1. Remove redirect logic (lines 32-39)
2. Change `from` address to use verified domain
3. Send to actual recipient

---

## Step 3: If Domain is NOT Verified

**The email went to admin@valta.ca** (due to sandbox restriction)

**Options:**
1. Check admin@valta.ca inbox to verify email was sent
2. Complete domain verification for crowestudio.com
3. Then update Edge Function

---

## Quick Check

**Check Resend for most recent LOE email:**
```bash
curl -X GET "https://api.resend.com/emails?limit=10" \
  -H "Authorization: Bearer re_8B4Po2eL_84kFfQeEHAf4z4GFTLaqTv94" | \
  grep -i "letter\|loe" -A 5
```

**Or check admin@valta.ca inbox** to see if email arrived there.

---

**Action:** Check Resend dashboard - is `crowestudio.com` verified? That will tell us what to do next!
