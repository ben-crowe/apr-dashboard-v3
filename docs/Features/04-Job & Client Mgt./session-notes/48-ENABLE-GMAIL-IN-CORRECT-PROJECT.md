# Enable Gmail API in Correct Project

**Issue:** Gmail API was enabled in "My First Project" but you're using "APR Dashboard Email Testing"

**Fix:** Enable Gmail API in the correct project

---

## Step 1: Enable Gmail API in Correct Project

1. **Make sure you're in project:** "APR Dashboard Email Testing"
   - Check top dropdown - should show "APR Dashboard Email Testing"

2. **Go to APIs & Services:**
   - Click **"APIs & Services"** in left menu
   - Click **"Library"**

3. **Enable Gmail API:**
   - Search for: `Gmail API`
   - Click on **"Gmail API"**
   - Click **"Enable"** button
   - Wait for it to enable (~10 seconds)

---

## Step 2: Configure OAuth Consent Screen

1. **Go to OAuth consent screen:**
   - APIs & Services > OAuth consent screen
   - Click **"Get started"** button (if you see it)

2. **User Type:**
   - Select **"External"**
   - Click **"Create"**

3. **App Information:**
   - App name: `APR Dashboard Email Testing`
   - User support email: `bc@crowestudio.com`
   - Click **"Save and Continue"**

4. **Scopes:**
   - Click **"Add or Remove Scopes"**
   - Search: `gmail.readonly`
   - Check: `https://www.googleapis.com/auth/gmail.readonly`
   - Click **"Update"** → **"Save and Continue"**

5. **Test Users:**
   - Click **"Add Users"**
   - Add: `bc@crowestudio.com`
   - Click **"Add"** → **"Save and Continue"**

6. **Make sure it's in "Testing" mode** (not "In production")

---

## Step 3: Create OAuth Client

1. **Go to Credentials:**
   - APIs & Services > Credentials

2. **Create OAuth client:**
   - Click **"Create Credentials"** > **"OAuth client ID"**
   - Application type: **Desktop app**
   - Name: `APR Dashboard - bc@crowestudio.com`
   - Click **"Create"**

3. **Download credentials:**
   - Click **"Download JSON"**
   - Save as: `credentials/bc-crowestudio/credentials.json`

---

## Important

**All setup must be in the same project:**
- ✅ Project: "APR Dashboard Email Testing"
- ✅ Gmail API enabled in this project
- ✅ OAuth consent screen configured in this project
- ✅ OAuth client created in this project

**Don't mix projects!**
