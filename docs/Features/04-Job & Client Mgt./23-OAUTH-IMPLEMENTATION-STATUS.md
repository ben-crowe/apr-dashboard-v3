# ClickUp OAuth Implementation Status

**Date:** January 8, 2026  
**Status:** 🚧 Implementation In Progress

---

## ✅ Completed

### 1. OAuth App Created
- ✅ Client ID: `NSZQ8LEP2KV6KDUWEQU5VQBR65CIG7HKM7EZF61UG6HG82XN5J8S8C3WHGOENSD1`
- ✅ Client Secret: `PY3EQ1UW6SMST339JP8NG3B5OVTTPJMK`
- ✅ Redirect URL: `https://apr-dashboard-v3.vercel.app` (ClickUp only accepts base domain)

### 2. Frontend Components
- ✅ `src/pages/ClickUpCallback.tsx` - OAuth callback handler page
- ✅ `src/components/dashboard/ClickUpConnection.tsx` - Connection status component
- ✅ `src/hooks/useClickUpOAuth.ts` - OAuth management hook
- ✅ Route added to `src/App.tsx` for `/clickup/callback`

### 3. Edge Functions
- ✅ `supabase/functions/clickup-oauth-authorize/index.ts` - Generates authorization URL
- ✅ `supabase/functions/clickup-oauth-callback/index.ts` - Exchanges code for token

### 4. Database
- ✅ Migration created: `supabase/migrations/20260108_create_clickup_connections.sql`
- ✅ Table: `clickup_connections` with RLS policies

---

## ⏳ Next Steps (Required)

### 1. Set Up Environment Variables

**In Supabase Dashboard:**
1. Go to: **Project Settings → Edge Functions → Secrets**
2. Add these environment variables:
   - `CLICKUP_CLIENT_ID` = `NSZQ8LEP2KV6KDUWEQU5VQBR65CIG7HKM7EZF61UG6HG82XN5J8S8C3WHGOENSD1`
   - `CLICKUP_CLIENT_SECRET` = `PY3EQ1UW6SMST339JP8NG3B5OVTTPJMK`
   - `CLICKUP_REDIRECT_URI` = `https://apr-dashboard-v3.vercel.app`

**Via CLI (alternative):**
```bash
supabase secrets set CLICKUP_CLIENT_ID=NSZQ8LEP2KV6KDUWEQU5VQBR65CIG7HKM7EZF61UG6HG82XN5J8S8C3WHGOENSD1
supabase secrets set CLICKUP_CLIENT_SECRET=PY3EQ1UW6SMST339JP8NG3B5OVTTPJMK
supabase secrets set CLICKUP_REDIRECT_URI=https://apr-dashboard-v3.vercel.app
```

### 2. Run Database Migration

```bash
# Apply the migration
supabase db push

# Or if using local development
supabase migration up
```

### 3. Deploy Edge Functions

```bash
# Deploy OAuth functions
supabase functions deploy clickup-oauth-authorize
supabase functions deploy clickup-oauth-callback
```

### 4. ClickUp App Redirect URL

**Set to:** `https://apr-dashboard-v3.vercel.app`

**Note:** ClickUp only accepts the base domain (automatically strips paths). The Index page detects OAuth query params (`?code=xxx&state=xxx`) and redirects to the `/clickup/callback` handler automatically.

### 5. Update Existing Edge Functions

**Files to update:**
- `supabase/functions/create-clickup-task/index.ts`
- `supabase/functions/update-clickup-task/index.ts`
- `supabase/functions/get-clickup-task/index.ts`
- `supabase/functions/docuseal-webhook/index.ts`

**Changes needed:**
- Remove `CLICKUP_API_TOKEN` usage
- Get user's access token from `clickup_connections` table
- Use `Authorization: Bearer {access_token}` header
- Handle case where user hasn't connected yet

### 6. Add Connection Component to Dashboard

Add the `ClickUpConnection` component to your Dashboard settings or header:

```tsx
import ClickUpConnection from '@/components/dashboard/ClickUpConnection';

// Add to Dashboard settings page or header
<ClickUpConnection />
```

---

## 🧪 Testing Checklist

- [ ] Environment variables set in Supabase
- [ ] Database migration applied
- [ ] Edge Functions deployed
- [ ] Click "Connect ClickUp" button
- [ ] Authorize on ClickUp
- [ ] Verify callback redirects correctly
- [ ] Verify token stored in database
- [ ] Test creating ClickUp task with OAuth token
- [ ] Test updating ClickUp task with OAuth token
- [ ] Test multi-workspace support

---

## 📋 Implementation Summary

### OAuth Flow

```
1. User clicks "Connect ClickUp"
   ↓
2. Frontend calls clickup-oauth-authorize Edge Function
   ↓
3. Edge Function returns authorization URL
   ↓
4. User redirected to ClickUp authorization page
   ↓
5. User authorizes and selects workspaces
   ↓
6. ClickUp redirects to /clickup/callback?code=xxx&state=xxx
   ↓
7. ClickUpCallback page calls clickup-oauth-callback Edge Function
   ↓
8. Edge Function exchanges code for access token
   ↓
9. Token stored in clickup_connections table
   ↓
10. User redirected to Dashboard
    ↓
11. ✅ Connected!
```

### Database Schema

```sql
clickup_connections
├── id (UUID)
├── user_id (UUID → auth.users)
├── workspace_id (TEXT)
├── access_token (TEXT)
├── refresh_token (TEXT, nullable)
├── authorized_workspaces (JSONB)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

---

## 🔒 Security Notes

1. **Client Secret:** Stored in Supabase Edge Function secrets (never exposed to frontend)
2. **Access Tokens:** Stored in database (consider encrypting in production)
3. **RLS Policies:** Users can only access their own connections
4. **State Token:** CSRF protection in OAuth flow
5. **HTTPS Only:** Redirect URLs must be HTTPS

---

## 🐛 Troubleshooting

### "ClickUp OAuth credentials not configured"
- **Solution:** Set `CLICKUP_CLIENT_ID` and `CLICKUP_CLIENT_SECRET` in Supabase secrets

### "Authorization code is required"
- **Solution:** Make sure redirect URL matches exactly what's configured in ClickUp app

### "Failed to exchange authorization code"
- **Solution:** Check that client_id, client_secret, and code are correct

### "No access token received"
- **Solution:** Verify ClickUp API is responding correctly

### Connection not showing in Dashboard
- **Solution:** Check RLS policies, verify user_id matches auth.uid()

---

## 📚 Reference Files

- Credentials: `docs/03-ClickUp-Integration/21-OAUTH-CREDENTIALS.md`
- Implementation Plan: `docs/03-ClickUp-Integration/22-OAUTH-IMPLEMENTATION-PLAN.md`
- [ClickUp OAuth Docs](https://developer.clickup.com/docs/authentication#build-apps-for-others---oauth-flow)

---

## 🎯 Current Status

**Ready for:** Environment setup and testing  
**Blocked on:** None  
**Next Action:** Set environment variables and deploy Edge Functions
