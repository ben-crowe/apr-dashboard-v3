# Final Troubleshooting - Still Getting Blocked

**Issue:** Still getting "app is blocked" error

---

## Verify OAuth Client Matches Project

**The OAuth client must be in the SAME project as the consent screen:**

1. **Go to:** APIs & Services > Credentials
2. **Find your OAuth client:** "APR Dashboard - bc@crowestudio.com"
3. **Check:** Does the Client ID match what's in `credentials.json`?
   - Client ID should be: `1051466697976-2nmjqg67klao50ncfvg9a0pf2ah6jo46.apps.googleusercontent.com`

---

## Try Running Script Manually

**Run this in your terminal** (so we can see the full error):

```bash
cd /Users/bencrowe/Development/apr-dashboard-v3
python3 scripts/check-bc-email.py --latest --max-results 3
```

**Copy and paste the FULL error message** you see.

---

## Double-Check These Settings

**In Google Cloud Console:**

1. **Project:** Must be "APR Dashboard Email Testing" (check top dropdown)
2. **OAuth Consent Screen:**
   - Publishing status: **Testing** (not "In production")
   - User type: **External**
   - Test users: **bc@crowestudio.com** listed
   - Scopes: **gmail.readonly** added
3. **OAuth Client:**
   - Must be in the SAME project
   - Application type: Desktop app

---

## If Still Blocked After 30 Minutes

**Google's systems can take up to 30 minutes to update.**

**Try again in 30 minutes**, or contact Google Cloud support if it persists.

---

**Action:** Run the script manually in your terminal and share the full error message!
