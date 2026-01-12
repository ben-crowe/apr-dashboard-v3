# Google OAuth Block Issue - Summary for Code Agent

**Created:** January 8, 2026  
**Status:** ⚠️ App Still Being Blocked by Google  
**Issue:** "This app is blocked - This app tried to access sensitive info in your Google Account"

---

## What We've Set Up

### ✅ Project Configuration
- **Project Name:** APR Dashboard Email Testing
- **Project ID:** `apr-dashboard-email-testing`
- **Project Number:** `1051466697976`

### ✅ OAuth Consent Screen
- **Publishing Status:** Testing (not "In production")
- **User Type:** External
- **App Name:** APR Dashboard Email Testing
- **User Support Email:** bc@crowestudio.com
- **Test Users:** bc@crowestudio.com (added)
- **Scopes:** `https://www.googleapis.com/auth/gmail.readonly` (added)

### ✅ Gmail API
- **Status:** Enabled in project `apr-dashboard-email-testing`

### ✅ OAuth Client Credentials
- **Client ID:** `1051466697976-2nmjqg67klao50ncfvg9a0pf2ah6jo46.apps.googleusercontent.com`
- **Client Secret:** `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`
- **Application Type:** Desktop app
- **Name:** APR Dashboard - bc@crowestudio.com
- **Credentials File:** `/Users/bencrowe/Development/apr-dashboard-v3/credentials/bc-crowestudio/credentials.json`

### ✅ Scripts Created
- **Email Checker:** `scripts/check-bc-email.py`
- **Setup Script:** `scripts/setup-bc-email-auth.sh`
- **TypeScript Wrapper:** `scripts/check-bc-email.ts`

---

## Current Problem

**Error Message:**
```
This app is blocked
This app tried to access sensitive info in your Google Account. 
To keep your account safe, Google blocked this access.
```

**When Running:**
```bash
python3 scripts/check-bc-email.py --latest --max-results 3
```

**What Happens:**
1. Script starts
2. Browser opens for OAuth flow
3. Google shows "This app is blocked" error
4. Script fails

---

## What We've Verified

### ✅ Configuration Checks
- [x] Publishing status is "Testing" (not "In production")
- [x] User type is "External" (not "Internal")
- [x] Test user `bc@crowestudio.com` is added
- [x] Gmail readonly scope is added
- [x] Gmail API is enabled
- [x] OAuth client is created
- [x] Credentials.json file exists with correct format
- [x] All configuration is in the same project (`apr-dashboard-email-testing`)

### ⚠️ Potential Issues
- [ ] User might be signing in with wrong Google account when OAuth popup appears
- [ ] Google's systems might need more time to propagate changes (can take 30+ minutes)
- [ ] OAuth client might be in different project than consent screen (unlikely, but verify)
- [ ] Browser might be caching old OAuth state

---

## Files to Check

### Credentials File
**Location:** `/Users/bencrowe/Development/apr-dashboard-v3/credentials/bc-crowestudio/credentials.json`

**Expected Content:**
```json
{
  "installed": {
    "client_id": "1051466697976-2nmjqg67klao50ncfvg9a0pf2ah6jo46.apps.googleusercontent.com",
    "client_secret": "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",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "redirect_uris": ["http://localhost"]
  }
}
```

### Email Checker Script
**Location:** `scripts/check-bc-email.py`

**Key Function:** `get_credentials()` - Handles OAuth flow

---

## Next Steps to Troubleshoot

### 1. Verify OAuth Client Project
**Check:** APIs & Services > Credentials > OAuth client "APR Dashboard - bc@crowestudio.com"
- Verify it's in project `apr-dashboard-email-testing`
- Verify Client ID matches: `1051466697976-2nmjqg67klao50ncfvg9a0pf2ah6jo46.apps.googleusercontent.com`

### 2. Check Which Account User Signs In With
**When OAuth popup appears:**
- User must sign in with `bc@crowestudio.com`
- If different account appears, that's the problem
- Solution: Clear browser cache, use incognito, or ensure correct account is default

### 3. Wait for Propagation
**Google's systems can take 30+ minutes to update:**
- Wait 30 minutes after last configuration change
- Try script again

### 4. Verify Consent Screen One More Time
**Go to:** APIs & Services > OAuth consent screen
- **Publishing status:** Must say "Testing" (if "In production", click "BACK TO TESTING")
- **Audience:** Must say "External"
- **Test users:** Must include `bc@crowestudio.com`
- **Data Access:** Must include `gmail.readonly` scope

### 5. Clear OAuth Token Cache
**If token file exists, delete it to force fresh OAuth flow:**
```bash
rm /Users/bencrowe/Development/apr-dashboard-v3/credentials/bc-crowestudio/token.json
```

### 6. Try Incognito Browser
**Run script, but when browser opens:**
- Use incognito/private window
- Sign in with `bc@crowestudio.com` explicitly
- Complete OAuth flow

---

## Google Cloud Console URLs

**Project:** APR Dashboard Email Testing (`apr-dashboard-email-testing`)

**Key Pages:**
- OAuth Consent Screen: https://console.cloud.google.com/apis/credentials/consent?project=apr-dashboard-email-testing
- Credentials: https://console.cloud.google.com/apis/credentials?project=apr-dashboard-email-testing
- Gmail API: https://console.cloud.google.com/apis/library/gmail.googleapis.com?project=apr-dashboard-email-testing

---

## Script to Test

**Command:**
```bash
cd /Users/bencrowe/Development/apr-dashboard-v3
python3 scripts/check-bc-email.py --latest --max-results 3
```

**Expected Behavior:**
1. Script authenticates
2. Browser opens
3. User sees OAuth consent screen (not "app blocked")
4. User clicks "Allow"
5. Script fetches latest 3 emails

**Current Behavior:**
1. Script starts
2. Browser opens
3. Google shows "This app is blocked" error
4. Script fails

---

## Additional Context

**User's Email:** bc@crowestudio.com  
**User's Google Account:** bc@crowestudio.com (must match test user)  
**Project Created:** January 8, 2026  
**Last Configuration Change:** Just now (user saved scope changes)

**Related Documentation:**
- Setup guide: `docs/03-ClickUp-Integration/39-GMAIL-API-SETUP.md`
- OAuth consent setup: `docs/03-ClickUp-Integration/40-GOOGLE-OAUTH-CONSENT-SETUP.md`
- Troubleshooting: `docs/03-ClickUp-Integration/46-FIX-APP-BLOCKED-ERROR.md`

---

## Questions to Answer

1. **When OAuth popup appears, which Google account does user sign in with?**
   - Must be `bc@crowestudio.com`
   - If different, that's the issue

2. **How long has it been since last configuration change?**
   - Google can take 30+ minutes to propagate

3. **Is OAuth client in the same project as consent screen?**
   - Both must be in `apr-dashboard-email-testing`

4. **Is there a token.json file that might be cached?**
   - Location: `credentials/bc-crowestudio/token.json`
   - Delete it to force fresh OAuth flow

---

## Success Criteria

**Script works when:**
- ✅ OAuth popup shows consent screen (not "app blocked")
- ✅ User can click "Allow"
- ✅ Script successfully fetches emails
- ✅ No "app blocked" error

---

**Last Updated:** January 8, 2026  
**Status:** Waiting for resolution - All configuration appears correct, but Google still blocking
