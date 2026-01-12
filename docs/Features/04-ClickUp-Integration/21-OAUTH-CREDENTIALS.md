# ClickUp OAuth App Credentials

**Date:** January 8, 2026  
**Status:** ✅ OAuth App Created  
**⚠️ SECURITY: DO NOT COMMIT THIS FILE TO GIT**

---

## OAuth App Credentials

### Client ID
```
NSZQ8LEP2KV6KDUWEQU5VQBR65CIG7HKM7EZF61UG6HG82XN5J8S8C3WHGOENSD1
```
**Status:** ✅ Safe to share (public identifier)

### Client Secret
```
PY3EQ1UW6SMST339JP8NG3B5OVTTPJMK
```
**Status:** ⚠️ KEEP PRIVATE - Store in Supabase env vars only

### Redirect URL
```
https://apr-dashboard-v3.vercel.app
```
**Note:** ClickUp only accepts the base domain (strips paths). OAuth callback is handled at root (`/`) which detects query params and redirects to `/clickup/callback` handler.

---

## Next Steps

1. ✅ OAuth app created
2. ⏳ Store credentials in Supabase Edge Function env vars
3. ⏳ Implement OAuth flow in Dashboard
4. ⏳ Update Edge Functions to use OAuth tokens
5. ⏳ Test OAuth connection

---

## Security Notes

- **Client Secret** must be stored in Supabase Edge Function environment variables
- **Never commit** client secret to git
- **Client ID** is safe to use in frontend code
- Access tokens will be stored encrypted in database
