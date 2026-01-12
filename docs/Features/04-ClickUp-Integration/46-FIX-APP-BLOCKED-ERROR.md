# Fix "This app is blocked" Error

**Error:** "This app tried to access sensitive info in your Google Account. To keep your account safe, Google blocked this access."

**Cause:** Google blocks unverified apps from accessing sensitive scopes (like Gmail) unless they're in "Testing" mode with test users added.

---

## Solution: Set App to Testing Mode

### Step 1: Go to OAuth Consent Screen

1. **In Google Cloud Console:**
   - Go to **"APIs & Services"** > **"OAuth consent screen"**
   - Make sure you're in project: **"APR Dashboard Email Testing"**

### Step 2: Check Publishing Status

1. **Look at the top of the OAuth consent screen page**
2. You should see: **"Publishing status: Testing"** or **"In production"**

### Step 3: Set to Testing Mode

**If it says "In production":**

1. Click **"PUBLISH APP"** button (top right) - **DON'T click this!**
2. Instead, look for **"Back to Dashboard"** or scroll down
3. Find the section that says **"Publishing status"**
4. Click **"BACK TO TESTING"** or change status to **"Testing"**

**If it already says "Testing":**

1. Make sure you're added as a test user (see Step 4)

### Step 4: Verify Test Users

1. **In OAuth consent screen**, scroll to **"Test users"** section
2. **Make sure `bc@crowestudio.com` is listed**
3. **If not listed:**
   - Click **"ADD USERS"**
   - Type: `bc@crowestudio.com`
   - Click **"ADD"**
   - Click **"SAVE"**

### Step 5: Verify Scopes

1. **In OAuth consent screen**, check **"Scopes"** section
2. **Make sure you see:** `https://www.googleapis.com/auth/gmail.readonly`
3. **If missing:**
   - Click **"ADD OR REMOVE SCOPES"**
   - Search: `gmail.readonly`
   - Check the box
   - Click **"UPDATE"** → **"SAVE"**

---

## Important: Testing Mode Limitations

**In Testing mode:**
- ✅ Only test users (you) can use the app
- ✅ No verification needed
- ✅ Works immediately
- ❌ Only works for up to 100 test users

**In Production mode:**
- ❌ Requires Google verification (can take weeks)
- ❌ Google blocks unverified apps from sensitive scopes
- ✅ Works for unlimited users (after verification)

**For now, Testing mode is perfect!**

---

## After Fixing

1. **Wait 1-2 minutes** for changes to propagate
2. **Try the script again:**
   ```bash
   python3 scripts/check-bc-email.py --latest --max-results 5
   ```

3. **Expected behavior:**
   - Browser opens
   - Shows "Google hasn't verified this app" warning
   - Click **"Advanced"** → **"Go to APR Dashboard Email Testing (unsafe)"**
   - Click **"Allow"**
   - Script works!

---

## Quick Checklist

- [ ] OAuth consent screen is set to **"Testing"** mode (not "In production")
- [ ] `bc@crowestudio.com` is added as a **test user**
- [ ] Gmail readonly scope is added
- [ ] Gmail API is enabled
- [ ] OAuth client credentials are created

---

**Most Common Issue:** App is set to "In production" instead of "Testing" mode!
