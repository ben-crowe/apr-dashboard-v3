# Apply ClickUp OAuth Migration

**Task for Cursor:** Apply the clickup_connections table migration to Supabase

---

## Context

The OAuth infrastructure code exists but the database table was never created. We need to apply:
`/Users/bencrowe/Development/APR-Dashboard-v3/supabase/migrations/20260108_create_clickup_connections.sql`

---

## Option 1: Use Supabase CLI (Recommended)

```bash
cd /Users/bencrowe/Development/APR-Dashboard-v3
supabase db push
```

This will apply all pending migrations including the clickup_connections table.

---

## Option 2: Apply via Management API

Use the Supabase Management API to run the SQL directly:

**Project:** `ngovnamnjmexdpjtcnky`
**Token:** `sbp_3f05698a35727ca9b51e8d6e18f07533d12a9314`

Run each statement separately (policies need to exist before creating them):

1. Create table
2. Create indexes
3. Enable RLS
4. Create policies
5. Create function
6. Create trigger

---

## Verification

After applying, verify the table exists:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'clickup_connections';
```

---

## Next Steps After Migration

Once table exists:
1. Set OAuth secrets in Supabase (if not already set):
   - `CLICKUP_CLIENT_ID`
   - `CLICKUP_CLIENT_SECRET`
   - `CLICKUP_REDIRECT_URI`

2. User completes OAuth flow to get access token

3. Use token to create BC workspace mirror list

---

**Execute this first**, then we can proceed with creating the BC workspace mirror.
