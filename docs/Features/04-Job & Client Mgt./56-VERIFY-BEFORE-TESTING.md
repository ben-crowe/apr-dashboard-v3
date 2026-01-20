# Verify OAuth Setup BEFORE Testing

**STOP:** Don't try to authenticate until we verify everything is configured correctly!

---

## Critical Checks (Do These First)

### 1. OAuth Consent Screen - Publishing Status

**Go to:** APIs & Services > OAuth consent screen

**Check:**
- ✅ **Publishing status:** Must say **"Testing"** (NOT "In production")
- ❌ If it says "In production" → Click "BACK TO TESTING"

**Why:** Google blocks unverified apps in production mode from accessing sensitive scopes like Gmail.

---

### 2. Test Users

**In OAuth consent screen:**

**Check:**
- ✅ **Test users section** should list: `bc@crowestudio.com`
- ❌ If not listed → Click "ADD USERS" → Add `bc@crowestudio.com` → Save

**Why:** In Testing mode, only test users can use the app.

---

### 3. Scopes

**In OAuth consent screen:**

**Check:**
- ✅ **Scopes section** should include: `https://www.googleapis.com/auth/gmail.readonly`
- ❌ If missing → Need to add it (may be in "Data Access" section in new interface)

**Why:** The script needs Gmail readonly permission.

---

### 4. Gmail API Enabled

**Go to:** APIs & Services > Enabled APIs & services

**Check:**
- ✅ **Gmail API** should be in the list
- ❌ If not → Go to Library → Search "Gmail API" → Enable

---

## After Verifying All Above

**ONLY THEN** try running the script.

**If still blocked:**
- Make sure you're signed in with `bc@crowestudio.com` in your browser
- Make sure OAuth consent screen is in "Testing" mode
- Make sure you're added as a test user

---

**DO NOT RUN THE SCRIPT UNTIL ALL CHECKS PASS!**
