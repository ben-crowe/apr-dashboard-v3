# Chrome Extension Interference - Fix Guide

**Issue:** Chrome extensions may be interfering with OAuth flow  
**Error:** "The message port closed before a response was received"  
**Solution:** Test in Incognito mode or disable extensions

---

## Quick Test: Incognito Mode

### Step 1: Run Script in Terminal

**Open terminal and run:**
```bash
cd /Users/bencrowe/Development/apr-dashboard-v3
python3 scripts/check-bc-email.py --latest --max-results 3
```

### Step 2: When Browser Opens

**Instead of using regular Chrome:**
1. **Open Chrome Incognito window** (Cmd+Shift+N on Mac)
2. **Copy the OAuth URL** from the terminal (if script prints it)
3. **Paste in Incognito window**
4. **Sign in with:** `bc@crowestudio.com`
5. **Complete OAuth flow**

**OR** - The script should automatically open a browser. If it opens regular Chrome:
1. **Close that window**
2. **Open Incognito manually**
3. **Look in terminal for the OAuth URL** (script should print it)
4. **Copy and paste in Incognito**

---

## If Incognito Works

**This confirms:** A Chrome extension is interfering

**Next steps:**
1. Identify which extension
2. Disable it temporarily when using the script
3. Or always use Incognito for OAuth flows

---

## Suspect Extensions to Disable

**Common culprits:**
- Gmail extensions
- Password managers (LastPass, 1Password, etc.)
- Google Assistant extensions
- OAuth/authentication helpers
- Ad blockers (sometimes interfere)

**How to disable:**
1. Chrome menu → Extensions (or `chrome://extensions`)
2. Toggle off suspicious extensions
3. Try script again
4. Re-enable one at a time to find culprit

---

## Clear OAuth Cache

**If extensions aren't the issue:**

### Option 1: Clear Chrome Cache
```bash
# Clear Chrome cache
rm -rf ~/Library/Application\ Support/Google/Chrome/Default/Cache/*
```

### Option 2: Clear Browser Data
1. Chrome → Settings → Privacy and security
2. Clear browsing data → All time
3. Check "Cookies and other site data"
4. Clear data

### Option 3: Clear OAuth Token File
```bash
# Delete cached OAuth token
rm /Users/bencrowe/Development/apr-dashboard-v3/credentials/bc-crowestudio/token.json
```

---

## Verify OAuth Redirect URI

**Check in Google Cloud Console:**

1. **Go to:** APIs & Services > Credentials
2. **Click:** OAuth client "APR Dashboard - bc@crowestudio.com"
3. **Check:** "Authorized redirect URIs"
4. **Should include:** `http://localhost` (or specific port if needed)

**Note:** For Desktop apps, `http://localhost` should work with any port automatically, but verify it's there.

---

## Test Steps Summary

### Test 1: Incognito Mode
```bash
# Run script
python3 scripts/check-bc-email.py --latest --max-results 3

# When browser opens:
# 1. Close regular Chrome window
# 2. Open Chrome Incognito (Cmd+Shift+N)
# 3. Copy OAuth URL from terminal
# 4. Paste in Incognito
# 5. Sign in with bc@crowestudio.com
```

### Test 2: Disable Extensions
1. Chrome → Extensions
2. Disable all extensions
3. Run script again
4. If works → re-enable one at a time

### Test 3: Clear Cache
```bash
# Clear token cache
rm credentials/bc-crowestudio/token.json

# Clear Chrome cache
rm -rf ~/Library/Application\ Support/Google/Chrome/Default/Cache/*
```

---

## Expected Behavior

**If working correctly:**
1. Script runs
2. Browser opens (or you open Incognito)
3. OAuth consent screen appears (NOT "app blocked")
4. You click "Allow"
5. Script fetches emails successfully

**If Chrome extension is interfering:**
- Browser opens but OAuth flow fails
- "Message port closed" error
- OAuth redirect doesn't complete

---

## Quick Command to Test

**Run this and watch for the OAuth URL:**
```bash
cd /Users/bencrowe/Development/apr-dashboard-v3
python3 scripts/check-bc-email.py --latest --max-results 3
```

**The script should print something like:**
```
Please visit this URL to authorize this application: https://accounts.google.com/o/oauth2/auth?...
```

**Copy that URL and paste in Incognito window!**

---

**Most Likely Fix:** Use Incognito mode - this disables all extensions and should work!
