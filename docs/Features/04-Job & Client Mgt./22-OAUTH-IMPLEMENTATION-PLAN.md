# ClickUp OAuth Implementation Plan

**Date:** January 8, 2026  
**Status:** 🚀 Ready to Implement  
**OAuth App:** ✅ Created

---

## Credentials (Stored Securely)

- **Client ID:** `NSZQ8LEP2KV6KDUWEQU5VQBR65CIG7HKM7EZF61UG6HG82XN5J8S8C3WHGOENSD1`
- **Client Secret:** `PY3EQ1UW6SMST339JP8NG3B5OVTTPJMK`
- **Redirect URL:** `[TO BE CONFIRMED]`

---

## Implementation Steps

### Phase 1: Store Credentials Securely ✅

**Action:** Add to Supabase Edge Function environment variables

**Via Supabase Dashboard:**
1. Go to Supabase Dashboard → Edge Functions → Settings
2. Add environment variables:
   - `CLICKUP_CLIENT_ID` = `NSZQ8LEP2KV6KDUWEQU5VQBR65CIG7HKM7EZF61UG6HG82XN5J8S8C3WHGOENSD1`
   - `CLICKUP_CLIENT_SECRET` = `PY3EQ1UW6SMST339JP8NG3B5OVTTPJMK`

**Via CLI (alternative):**
```bash
supabase secrets set CLICKUP_CLIENT_ID=NSZQ8LEP2KV6KDUWEQU5VQBR65CIG7HKM7EZF61UG6HG82XN5J8S8C3WHGOENSD1
supabase secrets set CLICKUP_CLIENT_SECRET=PY3EQ1UW6SMST339JP8NG3B5OVTTPJMK
```

---

### Phase 2: Create Database Table for OAuth Tokens

**New Table:** `clickup_connections`

**Schema:**
```sql
CREATE TABLE clickup_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL,
  access_token TEXT NOT NULL, -- Encrypted/stored securely
  refresh_token TEXT, -- For future use if tokens expire
  authorized_workspaces JSONB, -- Array of workspace IDs user authorized
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, workspace_id)
);

-- Enable RLS
ALTER TABLE clickup_connections ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own connections
CREATE POLICY "Users can view own connections"
  ON clickup_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own connections"
  ON clickup_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own connections"
  ON clickup_connections FOR UPDATE
  USING (auth.uid() = user_id);
```

---

### Phase 3: Create OAuth Flow Edge Functions

#### 3.1 OAuth Authorization Endpoint

**File:** `supabase/functions/clickup-oauth-authorize/index.ts`

**Purpose:** Generate authorization URL and redirect user to ClickUp

**Flow:**
1. Generate state token (CSRF protection)
2. Build authorization URL with client_id, redirect_uri, state
3. Redirect user to ClickUp authorization page

#### 3.2 OAuth Callback Endpoint

**File:** `supabase/functions/clickup-oauth-callback/index.ts`

**Purpose:** Handle OAuth callback, exchange code for token

**Flow:**
1. Receive authorization code from ClickUp
2. Verify state token (CSRF protection)
3. Exchange code for access token via ClickUp API
4. Get authorized workspaces
5. Store access token in database
6. Redirect user back to Dashboard

#### 3.3 Get Access Token Endpoint

**File:** `supabase/functions/clickup-get-token/index.ts`

**Purpose:** Retrieve user's access token for API calls

**Flow:**
1. Get user ID from auth
2. Query `clickup_connections` table
3. Return access token (or error if not connected)

---

### Phase 4: Update Frontend

#### 4.1 Add "Connect ClickUp" Button

**File:** `src/components/dashboard/ClickUpConnection.tsx` (new)

**Features:**
- Show connection status
- "Connect ClickUp" button if not connected
- "Connected" status if connected
- "Reconnect" option

#### 4.2 OAuth Flow Handler

**File:** `src/hooks/useClickUpOAuth.ts` (new)

**Features:**
- Initiate OAuth flow
- Handle callback
- Check connection status
- Store connection state

---

### Phase 5: Update Edge Functions to Use OAuth Tokens

**Files to Update:**
1. `supabase/functions/create-clickup-task/index.ts`
2. `supabase/functions/update-clickup-task/index.ts`
3. `supabase/functions/get-clickup-task/index.ts`
4. `supabase/functions/docuseal-webhook/index.ts`

**Changes:**
- Remove `CLICKUP_API_TOKEN` env var usage
- Get user's access token from `clickup_connections` table
- Use `Authorization: Bearer {access_token}` header
- Handle case where user hasn't connected yet

---

## OAuth Flow Diagram

```
User clicks "Connect ClickUp"
  ↓
Frontend calls /clickup-oauth-authorize
  ↓
Edge Function generates state token
  ↓
Redirects to: https://app.clickup.com/api?client_id={id}&redirect_uri={uri}&state={state}
  ↓
User authorizes on ClickUp
  ↓
ClickUp redirects to: /clickup-oauth-callback?code={code}&state={state}
  ↓
Edge Function exchanges code for access token
  ↓
Stores token in clickup_connections table
  ↓
Redirects user back to Dashboard
  ↓
✅ Connected!
```

---

## API Endpoints Needed

### 1. Authorization Endpoint
```
GET /clickup-oauth-authorize
→ Redirects to ClickUp authorization page
```

### 2. Callback Endpoint
```
GET /clickup-oauth-callback?code={code}&state={state}
→ Exchanges code for token
→ Stores in database
→ Redirects to Dashboard
```

### 3. Get Token Endpoint
```
GET /clickup-get-token
→ Returns user's access token
```

### 4. Connection Status Endpoint
```
GET /clickup-connection-status
→ Returns connection status and workspaces
```

---

## ClickUp OAuth Endpoints

**Authorization URL:**
```
https://app.clickup.com/api?client_id={client_id}&redirect_uri={redirect_uri}&state={state}
```

**Token Exchange URL:**
```
POST https://api.clickup.com/api/v2/oauth/token
Body: {
  client_id: string,
  client_secret: string,
  code: string
}
```

**Get Authorized Workspaces:**
```
GET https://api.clickup.com/api/v2/team
Headers: Authorization: Bearer {access_token}
```

---

## Security Considerations

1. **State Token:** Generate random state token for CSRF protection
2. **Client Secret:** Never expose in frontend, only in Edge Functions
3. **Access Tokens:** Store encrypted in database
4. **RLS Policies:** Ensure users can only access their own tokens
5. **HTTPS Only:** Redirect URLs must be HTTPS (or localhost for dev)

---

## Testing Plan

1. **Test OAuth Flow:**
   - Click "Connect ClickUp"
   - Authorize on ClickUp
   - Verify token stored in database
   - Verify redirect back to Dashboard

2. **Test API Calls:**
   - Create ClickUp task using OAuth token
   - Update ClickUp task using OAuth token
   - Verify tasks created in correct workspace

3. **Test Multi-Workspace:**
   - Authorize multiple workspaces
   - Verify can create tasks in different workspaces

---

## Migration from Personal Token

**Current State:**
- Using `CLICKUP_API_TOKEN` env var
- Single token for all users
- Breaks when regenerated

**Future State:**
- Each user has own access token
- Tokens stored per user/workspace
- Stable, no regeneration needed

**Migration Path:**
1. Implement OAuth flow
2. Update Edge Functions to use OAuth tokens
3. Keep `CLICKUP_API_TOKEN` as fallback during transition
4. Remove `CLICKUP_API_TOKEN` once all users connected

---

## Next Steps

1. ✅ Confirm redirect URL
2. ⏳ Store credentials in Supabase env vars
3. ⏳ Create database table
4. ⏳ Implement OAuth Edge Functions
5. ⏳ Update frontend with Connect button
6. ⏳ Update existing Edge Functions
7. ⏳ Test end-to-end
8. ⏳ Deploy!

---

## Reference Links

- [ClickUp OAuth Docs](https://developer.clickup.com/docs/authentication#build-apps-for-others---oauth-flow)
- [Get Access Token Endpoint](https://developer.clickup.com/reference/getaccesstoken)
- [Get Authorized Teams](https://developer.clickup.com/reference/getauthorizedteams)
