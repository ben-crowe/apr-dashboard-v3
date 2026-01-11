# Create OAuth Client - Step by Step

**Current Step:** Create credentials > Credential Type

---

## Step 1: Select Data Type

**On the current page:**

1. **Select:** "User data" (the first radio button)
   - This creates an OAuth client (what we need for Gmail)
   - "Application data" creates a service account (not what we need)

2. **Click:** "Next" button

---

## Step 2: Configure OAuth Client

**On the next page, you'll see:**

1. **Application type:** Select **"Desktop app"**
2. **Name:** Enter `APR Dashboard - bc@crowestudio.com`
3. **Click:** "Create"

---

## Step 3: Download Credentials

**After clicking "Create":**

1. A dialog will appear showing:
   - Your Client ID
   - Your Client Secret
2. **Click:** "Download JSON" button
3. **Save the file as:** `credentials/bc-crowestudio/credentials.json`
   - Save it in: `/Users/bencrowe/Development/apr-dashboard-v3/credentials/bc-crowestudio/`

4. **Click:** "Done"

---

## After Downloading

Once you have the credentials.json file:

1. **Test the script:**
   ```bash
   python3 scripts/check-bc-email.py --latest --max-results 5
   ```

2. **Expected:** Browser opens, you authorize access, script works!

---

**Important:** Make sure you select "User data" (not "Application data")!
