# Resend & Email Credentials

**⚠️ SECURITY WARNING:** This file contains sensitive credentials. DO NOT commit to git.

**Setup Date:** November 10, 2025  
**Last Updated:** January 8, 2026

---

## Resend Login

**URL:** https://resend.com/login

**Credentials:**
- **Email:** `admin@valta.ca`
- **Password:** `YmnG6HKD$%#FSUPE`

**Setup Date:** November 10, 2025

**Purpose:**
- Manage Resend API keys
- Verify domains for email sending
- View email delivery logs
- Configure email templates

**Current Status:**
- ✅ Account active
- ✅ API key configured in Supabase secrets
- ⏳ Domain verification pending (sandbox mode active)

---

## Email Login (admin@valta.ca)

**Email Provider:** Microsoft Outlook / Office 365  
**Migration Date:** Moved from Gmail to Microsoft

**Login URLs:**
- **Microsoft Login (Primary):** https://login.microsoftonline.com/
- **Outlook Web:** https://outlook.office.com (after login)
- **Office 365 Portal:** https://www.office.com (after login)

**Note:** Use https://login.microsoftonline.com/ and enter `admin@valta.ca` with password

**Credentials:**
- **Email:** `admin@valta.ca`
- **Password:** `Superbotheredlady@2`
- **Previous Password:** `Emailcircle1estates!` (old/incorrect)

**Purpose:**
- Access admin@valta.ca inbox
- Receive test emails from Resend sandbox
- Monitor email delivery for testing

**Current Usage:**
- Receives LOE e-signature emails (sandbox restriction)
- Receives form submission notifications
- Testing email delivery

**Note:** Client migrated from Gmail to Microsoft Outlook/Office 365

---

## Resend API Configuration

**Current API Key:** Stored in Supabase secrets as `RESEND_API_KEY`

**Sandbox Domain:** `onboarding@resend.dev`
- **Restriction:** Can only send to `admin@valta.ca` (account owner)
- **Status:** Active for testing

**Production Domain:** (Pending verification)
- **Domain:** `valta.ca` or `crowestudio.com` (to be verified)
- **Status:** Not yet verified

---

## Domain Verification Steps

**To enable sending to any email address (including bc@crowestudio.com):**

**You DON'T need a new Resend account or upgrade!** You can verify a domain in your existing free Resend account.

### Option 1: Verify `crowestudio.com` Domain (Recommended for Testing)

1. **Login to Resend:** https://resend.com/login
   - Email: `admin@valta.ca`
   - Password: `YmnG6HKD$%#FSUPE`

2. **Add Domain:**
   - Go to **Domains** section in Resend dashboard
   - Click **"Add Domain"**
   - Enter: `crowestudio.com`

3. **Add DNS Records:**
   - Resend will provide DNS records to add:
     - SPF record (TXT)
     - DKIM record (TXT)
     - Domain verification TXT record
   - Add these to your DNS provider (wherever crowestudio.com DNS is managed)

4. **Wait for Verification:**
   - Usually takes a few minutes to hours
   - Resend will verify DNS records automatically

5. **Update Edge Function:**
   - Change `from` address to: `Valta Appraisals <noreply@crowestudio.com>` or similar
   - Remove sandbox redirect logic
   - Deploy updated function
   - **Now you can send to ANY email, including bc@crowestudio.com!**

### Option 2: Verify `valta.ca` Domain (For Production)

Same process as above, but use `valta.ca` domain instead.

**Current Resend Plan:**
- ✅ Free plan supports domain verification
- ✅ No upgrade needed to verify domains
- ✅ Verified domains allow sending to any email address

---

## Related Files

- **Edge Function:** `supabase/functions/send-loe-email-fixed/index.ts`
- **Email Error Fix:** `docs/03-ClickUp-Integration/27-EMAIL-SEND-ERROR-FIX.md`
- **Valcre Credentials:** `docs/03-ClickUp-Integration/20-VALCRE-CREDENTIALS.md`

---

## Security Notes

- ✅ This file is in `.gitignore` - will not be committed
- ⚠️ Keep credentials secure
- ⚠️ Do not share these credentials publicly
- ⚠️ Rotate passwords periodically

---

**Last Updated:** January 8, 2026
