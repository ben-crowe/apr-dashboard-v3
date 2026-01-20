# OAuth Redirect URI - Answers for Troubleshooting

**Created:** January 8, 2026  
**Purpose:** Answer questions about OAuth redirect URI and browser issues

---

## Answers to Questions

### 1. Does the script open a browser window?

**YES** - The script uses `InstalledAppFlow.run_local_server(port=0)` which:
- Opens a browser automatically
- Uses a random available port (port=0 means auto-select)
- Creates a local HTTP server to receive the OAuth callback
- The redirect URI will be something like: `http://localhost:8080` or `http://localhost:54321` (random port)

**Code location:** `scripts/check-bc-email.py` line 122:
```python
creds = flow.run_local_server(port=0)
```

---

### 2. Which Chrome extension is involved?

**NONE** - This is not a Chrome extension issue. This is:
- A Python CLI script using Google's OAuth library
- The script opens a browser for OAuth consent
- Google's OAuth service handles the redirect
- No Chrome extensions are involved

---

### 3. What's the fix we're looking for?

**The issue is NOT browser popup blocking or redirect URI whitelisting.**

**The actual issue:** Google is showing "This app is blocked" error, which means:
- OAuth consent screen configuration issue
- OR user signing in with wrong Google account
- OR Google's systems haven't propagated changes yet

**NOT a redirect URI problem** - The redirect URI is automatically handled by `run_local_server()`.

---

### 4. Redirect URI the CLI script is using

**The script uses:** `http://localhost` (with random port)

**In credentials.json:**
```json
{
  "installed": {
    "redirect_uris": ["http://localhost"]
  }
}
```

**How it works:**
- `port=0` tells Python to pick any available port
- Google OAuth library automatically handles the redirect
- The local server receives the OAuth code
- No manual whitelisting needed

---

## The Real Problem

**The error is NOT about redirect URIs or Chrome blocking.**

**The error is:** Google showing "This app is blocked" page, which means:

1. **OAuth consent screen issue:**
   - App might be in "Production" mode instead of "Testing"
   - User might not be in test users list
   - Scope might not be properly configured

2. **Account mismatch:**
   - User signing in with different Google account than `bc@crowestudio.com`
   - Test user list only includes `bc@crowestudio.com`

3. **Propagation delay:**
   - Google's systems can take 30+ minutes to update
   - Changes were just saved

---

## What We've Configured

### OAuth Client Redirect URIs
- **Authorized redirect URIs:** `http://localhost` (in credentials.json)
- **OAuth Client in Google Cloud:** Should have `http://localhost` as authorized redirect URI

### OAuth Consent Screen
- **Publishing Status:** Testing
- **User Type:** External
- **Test Users:** bc@crowestudio.com
- **Scopes:** gmail.readonly

---

## What to Check

### 1. OAuth Client Redirect URIs in Google Cloud

**Go to:** APIs & Services > Credentials > OAuth client "APR Dashboard - bc@crowestudio.com"

**Check:** "Authorized redirect URIs" section
- Should include: `http://localhost`
- If missing, add it

**Note:** For Desktop apps, Google usually allows `http://localhost` automatically, but verify it's there.

### 2. Verify User Account

**When browser opens for OAuth:**
- User MUST sign in with `bc@crowestudio.com`
- If different account appears, that's the problem
- Test users list only includes `bc@crowestudio.com`

### 3. Check OAuth Consent Screen Status

**Go to:** APIs & Services > OAuth consent screen > Audience
- Publishing status: **Testing** (not "In production")
- User type: **External**
- Test users: **bc@crowestudio.com** listed

---

## If It's Actually a Browser/Popup Issue

**If browser doesn't open at all:**

1. **Check Chrome popup blocker:**
   - Chrome Settings > Privacy and security > Site settings > Pop-ups and redirects
   - Allow pop-ups for localhost

2. **Try different browser:**
   - Use Firefox or Safari instead of Chrome
   - Or use incognito mode

3. **Manual OAuth flow:**
   - The script will print a URL if browser doesn't open
   - Copy URL and paste in browser manually

---

## Summary

**The issue is NOT:**
- ❌ Chrome popup blocking
- ❌ Redirect URI whitelisting
- ❌ Chrome extension configuration

**The issue IS:**
- ✅ Google blocking the app (OAuth consent screen configuration)
- ✅ Possibly wrong Google account being used
- ✅ Possibly propagation delay (wait 30 minutes)

**The redirect URI (`http://localhost`) is fine** - Google's OAuth library handles it automatically.

---

**Next Steps:**
1. Verify OAuth client has `http://localhost` in authorized redirect URIs
2. Make sure user signs in with `bc@crowestudio.com` when browser opens
3. Wait 30 minutes for Google's systems to propagate changes
4. Verify OAuth consent screen is in "Testing" mode
