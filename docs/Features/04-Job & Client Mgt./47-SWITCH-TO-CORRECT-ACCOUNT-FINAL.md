# Switch to Correct Google Account - Final Fix

**Issue:** Still signed in with wrong Google account in browser

---

## Quick Fix: Switch Account in Browser

### Option 1: Sign Out and Sign In

1. **In Google Cloud Console:**
   - Click your **profile picture** (top right)
   - Click **"Sign out"**
   - Sign back in with: **`bc@crowestudio.com`**

### Option 2: Use Incognito/Private Window

1. **Open a new incognito/private browser window**
2. **Go to:** https://console.cloud.google.com/
3. **Sign in with:** `bc@crowestudio.com`
4. **Select project:** "APR Dashboard Email Testing"
5. **Go to:** APIs & Services > OAuth consent screen

---

## After Switching Accounts

Once signed in with `bc@crowestudio.com`:

1. **Verify you're in the right project:**
   - Top dropdown should show: "APR Dashboard Email Testing"
   - Project ID: `apr-dashboard-email-testing`

2. **Go to OAuth consent screen:**
   - APIs & Services > OAuth consent screen
   - Check publishing status is "Testing"
   - Verify `bc@crowestudio.com` is in test users

3. **Try the script again:**
   ```bash
   python3 scripts/check-bc-email.py --latest --max-results 5
   ```

---

**Important:** The OAuth credentials must match the Google account you're signed in with!
