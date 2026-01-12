# Setup Steps After Creating Project

**Project Created:** APR Dashboard Email Testing  
**Project ID:** `apr-dashboard-email-testing`

---

## Step 1: Enable Gmail API

1. **In the left menu**, click **"APIs & Services"**
2. Click **"Library"** (under APIs & Services)
3. **Search for:** `Gmail API`
4. Click on **"Gmail API"**
5. Click **"Enable"** button
6. Wait for it to enable (~10 seconds)

---

## Step 2: Configure OAuth Consent Screen

1. **In the left menu**, under **"APIs & Services"**, click **"OAuth consent screen"**

2. **User Type:**
   - Select **"External"**
   - Click **"Create"**

3. **App Information:**
   - **App name:** `APR Dashboard Email Testing`
   - **User support email:** Select `bc@crowestudio.com` from dropdown
   - **Developer contact:** `bc@crowestudio.com`
   - Click **"Save and Continue"**

4. **Scopes:**
   - Click **"Add or Remove Scopes"**
   - In the filter box, type: `gmail.readonly`
   - **Check the box** for: `https://www.googleapis.com/auth/gmail.readonly`
   - Click **"Update"** (at bottom of scopes list)
   - Click **"Save and Continue"**

5. **Test Users:**
   - Click **"Add Users"**
   - Type: `bc@crowestudio.com`
   - Click **"Add"**
   - Click **"Save and Continue"**

6. **Summary:**
   - Review settings
   - Click **"Back to Dashboard"**

---

## Step 3: Create OAuth Client Credentials

1. **In the left menu**, under **"APIs & Services"**, click **"Credentials"**

2. Click **"Create Credentials"** (top of page)
3. Select **"OAuth client ID"**

4. **Application type:** Select **"Desktop app"**
5. **Name:** `APR Dashboard - bc@crowestudio.com`
6. Click **"Create"**

7. **Download the credentials:**
   - A dialog will show your Client ID and Client Secret
   - Click **"Download JSON"**
   - **Save the file as:** `credentials/bc-crowestudio/credentials.json`
   - (Save it in your project: `/Users/bencrowe/Development/apr-dashboard-v3/credentials/bc-crowestudio/`)

8. Click **"Done"**

---

## Step 4: Test

After completing all steps, test the email checker:

```bash
python3 scripts/check-bc-email.py --latest --max-results 5
```

**Expected:** Browser opens, you authorize access, script shows your latest emails!

---

**Quick Navigation:**
- Gmail API: APIs & Services > Library > Search "Gmail API"
- OAuth Consent: APIs & Services > OAuth consent screen
- Credentials: APIs & Services > Credentials
