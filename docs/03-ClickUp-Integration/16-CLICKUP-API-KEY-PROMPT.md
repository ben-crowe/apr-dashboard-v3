# ClickUp API Key Setup Prompt

**For:** Claude Code Agent  
**Purpose:** Get valid ClickUp API token for testing  
**Date:** January 8, 2026

---

## Prompt to Give Your Claude Code Agent

```
I need to get a valid ClickUp API token for testing the APR Dashboard integration.

Current situation:
- The API token might have reset or expired
- Need to verify/create a new token in ClickUp
- Token will be used in Supabase Edge Functions and CLI scripts

Steps needed:
1. Go to ClickUp Settings → Apps → API
2. Generate a new API token (or verify existing one)
3. Copy the token (starts with "pk_")
4. Verify the token works by making a test API call

Once you have the token:
- Update Supabase Edge Function environment variable: CLICKUP_API_TOKEN
- Test with: curl -H "Authorization: YOUR_TOKEN" https://api.clickup.com/api/v2/user
- Share the token with me so I can update the Edge Function

ClickUp Workspace Details:
- Workspace: BC Workspace (Development)
- List ID: 901706896375 (New Submission - BC Workspace)
- Workspace ID: 8555561

The token should have permissions to:
- Create tasks
- Update tasks
- Read tasks
```

---

## Manual Steps (If Agent Can't Access ClickUp)

1. **Log into ClickUp**
   - Go to: https://app.clickup.com
   - Navigate to your workspace

2. **Get API Token**
   - Click your profile icon (bottom left)
   - Go to **Settings** → **Apps** → **API**
   - Click **Generate** to create new token (or copy existing)
   - Token format: `pk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

3. **Test Token**
   ```bash
   curl -H "Authorization: YOUR_TOKEN_HERE" https://api.clickup.com/api/v2/user
   ```
   Should return your user info (not `{"err": "Token invalid"}`)

4. **Update Supabase Edge Function**
   - Go to Supabase Dashboard → Edge Functions → Settings
   - Update `CLICKUP_API_TOKEN` environment variable
   - Or tell me the token and I'll update it

---

## Token Format

- **Starts with:** `pk_`
- **Length:** ~40+ characters
- **Example:** `pk_10791838_XB273RX0O9O1AL5WTZZIVREX1F3RUOL5`

---

## Security Note

- API tokens have full access to your ClickUp workspace
- Keep tokens secure, don't commit to git
- Tokens can be regenerated if compromised
