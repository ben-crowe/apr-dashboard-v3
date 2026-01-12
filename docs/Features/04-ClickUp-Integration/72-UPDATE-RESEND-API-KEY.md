# Update Resend API Key for Testing

**Date:** January 8, 2026  
**Purpose:** Use bc@crowestudio.com Resend account for testing  
**Status:** ✅ Edge Function Updated

---

## Changes Made

### ✅ Edge Function Updated

**File:** `supabase/functions/send-loe-email-fixed/index.ts`

**Changes:**
1. ✅ Updated API key fallback to: `re_G2kzpzLs_BYcHQSapaKbNosgRvGYpT7e8`
2. ✅ Removed email redirect logic (no longer redirecting to admin@valta.ca)
3. ✅ Now sends to actual recipient (`bc@crowestudio.com` or whatever is specified)

---

## Next Step: Update Supabase Secret

**You need to set the new API key in Supabase:**

```bash
supabase secrets set RESEND_API_KEY=re_G2kzpzLs_BYcHQSapaKbNosgRvGYpT7e8
```

**OR** update in Supabase Dashboard:
1. Go to: Supabase Dashboard → Project Settings → Edge Functions → Secrets
2. Find: `RESEND_API_KEY`
3. Update value to: `re_G2kzpzLs_BYcHQSapaKbNosgRvGYpT7e8`
4. Save

---

## About DocuSeal

**DocuSeal doesn't care about the email address:**
- ✅ DocuSeal only needs the signing link
- ✅ The email is just a delivery mechanism
- ✅ Any email address works - DocuSeal tracks by submission ID/slug
- ✅ The signing link is what matters, not who receives the email

**So using your Resend account is perfect for testing!**

---

## Testing

**After updating Supabase secret:**

1. **Send LOE email** from the dashboard
2. **Check your inbox:** `bc@crowestudio.com`
3. **Verify email arrived** using email checker:
   ```bash
   python3 scripts/check-bc-email.py --wait-for "subject:Letter of Engagement" --timeout 60 --show-body
   ```

---

**Status:** Edge Function updated - Need to update Supabase secret!
