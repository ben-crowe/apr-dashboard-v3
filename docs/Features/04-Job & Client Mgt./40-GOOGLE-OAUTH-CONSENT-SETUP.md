# Google OAuth Consent Screen Setup - Fix "Access Denied"

**Created:** January 8, 2026  
**Purpose:** Fix Google blocking Gmail API access by configuring OAuth consent screen  
**Status:** ⚠️ Action Required

---

## Problem

When trying to access Gmail API, Google blocks the request with:
- "Access Denied" error
- "invalid_scope: Bad Request" error
- OAuth consent screen not configured

---

## Solution: Configure OAuth Consent Screen

### Step 1: Go to Google Cloud Console

1. **Open:** https://console.cloud.google.com/
2. **Sign in** with `bc@crowestudio.com`
3. **Select your project:** `gen-lang-client-0262970848`
   - (Or the project where your OAuth credentials are)

### Step 2: Enable Gmail API

1. Go to **"APIs & Services"** > **"Library"**
2. Search for **"Gmail API"**
3. Click **"Enable"**
4. Wait for it to enable (usually instant)

### Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** > **"OAuth consent screen"**

2. **User Type:**
   - Select **"External"** (unless you have a Google Workspace account)
   - Click **"Create"**

3. **App Information:**
   - **App name:** `APR Dashboard Email Testing`
   - **User support email:** `bc@crowestudio.com`
   - **App logo:** (optional, skip for now)
   - Click **"Save and Continue"**

4. **Scopes:**
   - Click **"Add or Remove Scopes"**
   - In the filter box, search for: `gmail.readonly`
   - Check the box for: **`https://www.googleapis.com/auth/gmail.readonly`**
   - Click **"Update"**
   - Click **"Save and Continue"**

5. **Test Users:**
   - Click **"Add Users"**
   - Add your email: `bc@crowestudio.com`
   - Click **"Add"**
   - Click **"Save and Continue"**

6. **Summary:**
   - Review the settings
   - Click **"Back to Dashboard"**

### Step 4: Verify OAuth Client Configuration

1. Go to **"APIs & Services"** > **"Credentials"**
2. Find your OAuth 2.0 Client ID:
   - Client ID: `764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com`
3. Click on it to edit
4. Under **"Authorized redirect URIs"**, make sure you have:
   - `http://localhost` (or `http://localhost:8080` if needed)
5. Click **"Save"**

---

## Quick Checklist

- [ ] Gmail API is enabled
- [ ] OAuth consent screen is configured
- [ ] Gmail readonly scope is added
- [ ] Your email (`bc@crowestudio.com`) is added as a test user
- [ ] OAuth client has redirect URI: `http://localhost`

---

## After Configuration

Once configured, try running the email checker again:

```bash
python3 scripts/check-bc-email.py --latest --max-results 5
```

**Expected behavior:**
1. Browser opens automatically
2. Shows "Google hasn't verified this app" warning (normal for testing)
3. Click **"Advanced"** > **"Go to APR Dashboard Email Testing (unsafe)"**
4. Click **"Allow"** to grant Gmail read access
5. Script completes successfully

---

## Troubleshooting

### "Access Denied" Still Appears

**Solution:** Make sure:
1. You're signed in with `bc@crowestudio.com` in the browser
2. Your email is added as a test user in OAuth consent screen
3. Gmail API is enabled
4. Gmail readonly scope is added

### "invalid_scope" Error

**Solution:** 
- Go to OAuth consent screen > Scopes
- Make sure `https://www.googleapis.com/auth/gmail.readonly` is added
- Save and wait 1-2 minutes for changes to propagate

### Browser Doesn't Open

**Solution:**
- The script will print a URL
- Copy and paste it into your browser manually
- Complete the authorization
- Copy the code back to the terminal

### "App Not Verified" Warning

**This is normal for testing!** 
- Google shows this for unverified apps
- Click "Advanced" > "Go to [Your App Name] (unsafe)"
- This is safe for your own testing

---

## For Production (Future)

When ready for production:
1. Submit app for verification (if needed)
2. Add production redirect URIs
3. Configure app domain
4. Add privacy policy URL

**For now, testing mode is sufficient!**

---

## Quick Reference URLs

- **Google Cloud Console:** https://console.cloud.google.com/
- **APIs & Services:** https://console.cloud.google.com/apis
- **OAuth Consent Screen:** https://console.cloud.google.com/apis/credentials/consent
- **Gmail API:** https://console.cloud.google.com/apis/library/gmail.googleapis.com
- **Credentials:** https://console.cloud.google.com/apis/credentials

---

**Last Updated:** January 8, 2026  
**Status:** Ready to configure
