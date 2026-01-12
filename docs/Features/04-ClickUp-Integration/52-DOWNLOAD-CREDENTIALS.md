# Download OAuth Credentials

**OAuth Client Created!**
- Client ID: `1051466697976-2nmjqg67klao50ncfvg9a0pf2ah6jo46.apps.googleusercontent.com`

---

## Step 1: Download Credentials JSON

**On the current page:**

1. **Look for:** "Download JSON" button
2. **Click:** "Download JSON"
3. **Save the file as:** `credentials/bc-crowestudio/credentials.json`
   - Save location: `/Users/bencrowe/Development/apr-dashboard-v3/credentials/bc-crowestudio/`

---

## Step 2: Verify File Location

**Make sure the file is saved correctly:**

```bash
ls -la credentials/bc-crowestudio/credentials.json
```

**Should show:** The file exists

---

## Step 3: Test the Setup

**After downloading, test it:**

```bash
python3 scripts/check-bc-email.py --latest --max-results 5
```

**Expected:**
1. Browser opens automatically
2. Shows OAuth consent screen
3. Click "Allow" to grant access
4. Script fetches your latest emails!

---

## If You See "App Blocked" Error

**Make sure:**
1. OAuth consent screen is in **"Testing"** mode (not "In production")
2. `bc@crowestudio.com` is added as a **test user**
3. You're signed in with `bc@crowestudio.com` in the browser

---

**Next:** Download the JSON file and test!
