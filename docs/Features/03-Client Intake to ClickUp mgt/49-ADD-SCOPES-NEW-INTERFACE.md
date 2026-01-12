# Add Gmail Scope - New Google Auth Platform Interface

**Issue:** Can't find scope option in OAuth consent screen

**Solution:** In the new Google Auth Platform, scopes are added differently

---

## Step 1: Complete OAuth Consent Screen Setup First

1. **In OAuth consent screen:**
   - Fill in App Information (name, email)
   - Click **"Save and Continue"** through all steps
   - Complete the setup first

---

## Step 2: Add Scopes After Initial Setup

**Option A: In OAuth Consent Screen (after setup)**

1. **Go to:** APIs & Services > OAuth consent screen
2. **Click on your app** (if you see a list) or go to the main page
3. **Look for:** "Scopes" section or "Data Access" section
4. **Click:** "Add or Remove Scopes" or "Edit Scopes"

**Option B: Through API Configuration**

1. **Go to:** APIs & Services > Enabled APIs & services
2. **Find:** Gmail API
3. **Click on it**
4. **Look for:** OAuth configuration or Scopes section

**Option C: Direct Scope Addition**

1. **In OAuth consent screen**, look for:
   - "Scopes" tab/section
   - "Data Access" section
   - Or a button/link that says "Add Scopes" or "Manage Scopes"

---

## Step 3: Alternative - Add Scope via API

If you can't find it in the UI:

1. **Make sure Gmail API is enabled** (should be done)
2. **The scope might auto-appear** when you try to use it
3. **Or add it programmatically** when creating OAuth client

---

## Quick Check

**Can you see these sections in OAuth consent screen?**
- Branding
- Audience  
- Clients
- **Data Access** ← Scopes might be here!
- Verification Center
- Settings

**Try clicking "Data Access"** - that's where scopes are often configured in the new interface!

---

## If Still Can't Find It

**Don't worry!** You can:
1. Complete OAuth consent screen setup (without scopes)
2. Create OAuth client credentials
3. The scope will be requested when you first run the script
4. Google will prompt you to add it then

**The script will request the scope automatically when it runs!**
