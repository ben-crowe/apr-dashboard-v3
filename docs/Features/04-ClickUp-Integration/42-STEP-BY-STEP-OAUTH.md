# Step-by-Step OAuth Consent Screen Setup

**Current Screen:** You're in Google Cloud Console > APIs & Services

---

## Step 1: Click "OAuth consent screen"

In the left menu, under "APIs & Services", click:
**"OAuth consent screen"**

---

## Step 2: Configure App Information

1. **User Type:**
   - Select **"External"** (unless you have Google Workspace)
   - Click **"Create"**

2. **App Information:**
   - **App name:** `APR Dashboard Email Testing`
   - **User support email:** Select `bc@crowestudio.com` from dropdown
   - **Developer contact:** `bc@crowestudio.com`
   - Click **"Save and Continue"**

---

## Step 3: Add Gmail Scope

1. Click **"Add or Remove Scopes"**
2. In the filter/search box, type: `gmail.readonly`
3. Find: `https://www.googleapis.com/auth/gmail.readonly`
4. **Check the box** next to it
5. Click **"Update"** (bottom of the scopes list)
6. Click **"Save and Continue"**

---

## Step 4: Add Test Users

1. Click **"Add Users"**
2. Type: `bc@crowestudio.com`
3. Click **"Add"**
4. Click **"Save and Continue"**

---

## Step 5: Review and Finish

1. Review the summary
2. Click **"Back to Dashboard"**

---

## Step 6: Enable Gmail API

1. In the left menu, click **"Library"** (under APIs & Services)
2. Search for: `Gmail API`
3. Click on **"Gmail API"**
4. Click **"Enable"** button

---

## Step 7: Test

After completing above steps, wait 1-2 minutes, then test:

```bash
python3 scripts/check-bc-email.py --latest --max-results 5
```

---

**Quick Navigation:**
- OAuth consent screen: Click "OAuth consent screen" in left menu
- Gmail API: APIs & Services > Library > Search "Gmail API"
