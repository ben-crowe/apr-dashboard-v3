# Simple OAuth Consent Screen Checklist

**You're on the right page!** Here's exactly what to check:

---

## On the OAuth Consent Screen Page - Look For:

### 1. Top of Page - Publishing Status

**Look at the TOP of the page** - do you see:

- ✅ **"Publishing status: Testing"** → GOOD! Skip to #2
- ❌ **"Publishing status: In production"** → BAD! Look for "BACK TO TESTING" button and click it

---

### 2. Test Users Section

**Scroll down** - do you see a section called **"Test users"**?

- ✅ **Yes, and `bc@crowestudio.com` is listed** → GOOD! Skip to #3
- ❌ **Yes, but `bc@crowestudio.com` is NOT listed** → Click "ADD USERS" button, type `bc@crowestudio.com`, click "ADD"
- ❌ **No Test users section** → You might need to complete setup first

---

### 3. Scopes Section

**Look for a section called "Scopes" or "Data Access"**

- ✅ **You see `gmail.readonly` listed** → GOOD! You're done!
- ❌ **You don't see it** → That's OK, we can add it later or the script will request it

---

## If You See "Get started" Button

**If the page shows "Get started" or "Configure consent screen":**

1. **Click "Get started"**
2. **Select "External"** → Click "Create"
3. **Fill in:**
   - App name: `APR Dashboard Email Testing`
   - User support email: `bc@crowestudio.com`
4. **Click "Save and Continue"** through all steps
5. **Make sure it says "Testing" mode** (not "In production")

---

## What Page Are You Actually On?

**Tell me what you see:**
- Do you see "Get started" button?
- Do you see "Publishing status" at the top?
- Do you see sections like "App information", "Scopes", "Test users"?

**Just describe what's on the page and I'll tell you exactly what to click!**
