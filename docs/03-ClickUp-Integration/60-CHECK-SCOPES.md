# Check Gmail Scope

**Status:** ✅ OAuth consent screen is configured correctly!

**Remaining:** Check if Gmail scope is added

---

## Step 1: Go to Data Access

**In the left menu, click:**
- **"Data Access"**

This is where scopes are configured in the new Google Auth Platform.

---

## Step 2: Check for Gmail Scope

**On the Data Access page, look for:**

- ✅ **`https://www.googleapis.com/auth/gmail.readonly`** listed → Perfect!
- ❌ **Not listed** → Need to add it

---

## If Scope is Missing

**Don't worry!** The script will request it automatically when you run it. Google will prompt you to add it.

---

**Action:** Click **"Data Access"** in the left menu and tell me if you see `gmail.readonly` scope listed!
