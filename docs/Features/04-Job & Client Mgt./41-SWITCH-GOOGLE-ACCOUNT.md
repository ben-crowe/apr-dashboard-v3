# Switch to Correct Google Account for OAuth Setup

**Issue:** Google Cloud Console opened with wrong email account  
**Solution:** Switch to `bc@crowestudio.com` before configuring OAuth

---

## Quick Fix

### Step 1: Sign Out / Switch Account

1. **In Google Cloud Console** (the page that just opened):
   - Click your **profile picture** (top right corner)
   - Click **"Sign out"** or **"Use another account"**
   - Sign in with: **`bc@crowestudio.com`**

### Step 2: Navigate to OAuth Consent Screen

Once signed in with `bc@crowestudio.com`:

**Direct link:** https://console.cloud.google.com/apis/credentials/consent?project=gen-lang-client-0262970848

Or navigate manually:
1. Go to: https://console.cloud.google.com/
2. Make sure project `gen-lang-client-0262970848` is selected (top dropdown)
3. Go to: **APIs & Services** > **OAuth consent screen**

---

## Verify Correct Account

**Check the top right corner:**
- Should show: `bc@crowestudio.com`
- If it shows a different email, switch accounts

**Check the project:**
- Top dropdown should show: `gen-lang-client-0262970848`
- If not, select it from the dropdown

---

## After Switching Accounts

Once you're signed in with `bc@crowestudio.com`:

1. **Configure OAuth Consent Screen:**
   - Add scope: `gmail.readonly`
   - Add test user: `bc@crowestudio.com`

2. **Enable Gmail API:**
   - Go to: APIs & Services > Library
   - Search: "Gmail API"
   - Click: "Enable"

3. **Test:**
   ```bash
   python3 scripts/check-bc-email.py --latest --max-results 5
   ```

---

## Alternative: Use Incognito/Private Window

If switching accounts is difficult:

1. **Open incognito/private browser window**
2. **Go to:** https://console.cloud.google.com/
3. **Sign in with:** `bc@crowestudio.com`
4. **Navigate to:** OAuth consent screen

---

**Last Updated:** January 8, 2026
