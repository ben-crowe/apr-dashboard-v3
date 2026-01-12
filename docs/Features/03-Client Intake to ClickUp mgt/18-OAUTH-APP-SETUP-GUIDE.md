# ClickUp OAuth App Setup Guide

**Date:** January 8, 2026  
**Purpose:** Step-by-step guide to create ClickUp OAuth app and implement OAuth flow

---

## ✅ Confirmation: OAuth Apps are FREE

**No paid upgrade needed!** OAuth apps are part of ClickUp's standard API offering. Anyone with workspace owner/admin permissions can create them.

---

## Step 1: Create OAuth App in ClickUp

### Where to Go
1. **Log into ClickUp**: https://app.clickup.com
2. **Click your profile icon** (bottom left)
3. **Go to**: Settings → **Apps**
4. **Click**: **"Create new app"** button

### What You'll Need to Provide

**App Name:**
- Example: `"APR Dashboard Integration"` or `"Valta APR Automation"`

**Redirect URL:**
- This is where ClickUp will redirect users after they authorize
- **For Development**: `http://localhost:5173/clickup/callback` (or your local dev URL)
- **For Production**: `https://apr-dashboard-v3.vercel.app/clickup/callback`
- **Important**: Must be HTTPS in production (or localhost for dev)

### What You'll Get Back

After creating the app, ClickUp will give you:

1. **`client_id`** - Public identifier for your app (safe to share)
   - Example: `ABC123XYZ789`
   - This is used in the OAuth authorization URL

2. **`client_secret`** - Secret key (KEEP PRIVATE!)
   - Example: `secret_abc123xyz789...`
   - **DO NOT** commit this to git
   - Store in environment variables only

---

## Step 2: Share With Me

**What to Share:**
- ✅ `client_id` (safe to share)
- ✅ `client_secret` (I'll help you store it securely)
- ✅ Redirect URL you used

**What NOT to Share:**
- ❌ Don't share your personal API token (`pk_...`) - we won't need it anymore!

---

## Step 3: What Happens Next (Implementation)

Once you share the credentials, I'll:

1. **Store Credentials Securely**
   - Add `CLICKUP_CLIENT_ID` to Supabase Edge Function env vars
   - Add `CLICKUP_CLIENT_SECRET` to Supabase Edge Function env vars (encrypted)

2. **Create OAuth Flow**
   - Add "Connect ClickUp" button to Dashboard
   - Implement OAuth redirect handler
   - Create callback endpoint to exchange code for token
   - Store access tokens per user/workspace in database

3. **Update Edge Functions**
   - Modify `create-clickup-task` to use user's access token (not env var)
   - Modify `update-clickup-task` to use user's access token
   - Modify `get-clickup-task` to use user's access token
   - Modify `docuseal-webhook` to use user's access token

4. **Database Schema**
   - Create `clickup_connections` table to store:
     - User ID
     - Workspace ID(s)
     - Access token (encrypted)
     - Refresh token (if needed later)

---

## Step 4: How Users Will Connect

### First Time Setup
1. User opens Dashboard
2. Sees "Connect ClickUp" button
3. Clicks button → Redirected to ClickUp authorization page
4. User selects which workspaces to authorize
5. Clicks "Authorize" → Redirected back to Dashboard
6. Access token stored securely
7. ✅ Done! No more token sharing needed

### Subsequent Use
- Access token is automatically used for API calls
- No user interaction needed
- Works across all authorized workspaces

---

## Current vs Future Architecture

### Current (Personal Token)
```
Your Personal Token (pk_...)
  ↓
Stored in CLICKUP_API_TOKEN env var
  ↓
Used by all Edge Functions
  ↓
❌ Breaks when regenerated
❌ Only works for your workspaces
❌ Must share token manually
```

### Future (OAuth App)
```
OAuth App Created
  ↓
client_id + client_secret stored securely
  ↓
User clicks "Connect ClickUp"
  ↓
User authorizes workspaces
  ↓
Access token stored per user/workspace
  ↓
Edge Functions use user's token automatically
  ↓
✅ Stable (tokens don't expire)
✅ Multi-workspace support
✅ No token sharing needed
```

---

## Quick Checklist

### For You (Now)
- [ ] Log into ClickUp
- [ ] Go to Settings → Apps → Create new app
- [ ] Name the app
- [ ] Set redirect URL (use production URL: `https://apr-dashboard-v3.vercel.app/clickup/callback`)
- [ ] Copy `client_id` and `client_secret`
- [ ] Share with me

### For Me (After You Share)
- [ ] Store credentials in Supabase env vars
- [ ] Create OAuth flow implementation
- [ ] Update Edge Functions to use OAuth tokens
- [ ] Create database table for token storage
- [ ] Test OAuth flow end-to-end

---

## Redirect URL Examples

### Development (Local)
```
http://localhost:5173/clickup/callback
```

### Production (Vercel)
```
https://apr-dashboard-v3.vercel.app/clickup/callback
```

**Note:** You can add multiple redirect URLs to your OAuth app if needed. For now, use the production URL since that's where your Dashboard is deployed.

---

## Security Notes

1. **`client_secret` is SECRET**
   - Never commit to git
   - Store in Supabase Edge Function env vars only
   - Only share with me via secure channel (not in public chat)

2. **Access Tokens**
   - Will be stored encrypted in database
   - One token per user/workspace combination
   - Tokens don't expire (currently)

3. **OAuth Flow**
   - Uses HTTPS redirects
   - Secure code exchange
   - Industry-standard OAuth 2.0

---

## Questions?

**Q: Do I need to create separate apps for dev/prod?**  
A: No, you can use one app with multiple redirect URLs, or create separate apps if you prefer.

**Q: What if I want to test locally first?**  
A: Add `http://localhost:5173/clickup/callback` as a redirect URL in your OAuth app settings.

**Q: Can multiple users connect?**  
A: Yes! Each user connects their own account and authorizes their own workspaces.

**Q: What happens if a user revokes access?**  
A: We'll detect that and prompt them to reconnect. The OAuth flow handles this gracefully.

---

## Next Steps

1. **Create the OAuth app** (5 minutes)
2. **Share credentials** with me
3. **I'll implement the OAuth flow** (I'll handle all the code)
4. **Test together** to make sure it works
5. **Deploy** and never worry about tokens breaking again! 🎉

---

## Reference Links

- [ClickUp OAuth Documentation](https://developer.clickup.com/docs/authentication#build-apps-for-others---oauth-flow)
- [OAuth App Settings](https://app.clickup.com/settings/apps)
- [Get Access Token Endpoint](https://developer.clickup.com/reference/getaccesstoken)
