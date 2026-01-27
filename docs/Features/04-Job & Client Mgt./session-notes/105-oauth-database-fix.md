# OAuth Database Fix - Token Persistence Issue

## Problem Summary

OAuth callback was completing successfully and showing success messages, but tokens were not being saved to the `clickup_connections` table.

## Root Cause

Row Level Security (RLS) policies on `clickup_connections` table were blocking inserts from the Edge Function.

**Why:** When Edge Functions use the Service Role Key, `auth.uid()` returns NULL. The RLS policies only allowed inserts where `auth.uid() = user_id`, which would never match when NULL.

## Changes Made

### 1. Edge Function Enhancement
**File:** `/supabase/functions/clickup-oauth-callback/index.ts`

Changes:
- Added explicit auth configuration to Supabase client
- Added `.select()` to upsert to confirm successful insert
- Enhanced logging to track database operations
- Better error handling with detailed error logging

### 2. Database Migration Created
**File:** `/supabase/migrations/20260127_add_service_role_policy.sql`

Creates a Service Role bypass policy that allows Edge Functions to insert records despite RLS.

### 3. Edge Function Deployed
```bash
supabase functions deploy clickup-oauth-callback --project-ref ngovnamnjmexdpjtcnky
```

Status: DEPLOYED

## Required Manual Step

**IMPORTANT:** The RLS policy fix requires manual execution in Supabase Dashboard.

### Run This SQL

1. Go to: https://supabase.com/dashboard/project/ngovnamnjmexdpjtcnky/sql

2. Copy and execute this SQL:

```sql
-- Add Service Role bypass policy for clickup_connections
-- This allows Edge Functions using Service Role Key to insert/update records

-- Drop existing policies to recreate in correct order
DROP POLICY IF EXISTS "Service role bypass" ON clickup_connections;
DROP POLICY IF EXISTS "Users can view own connections" ON clickup_connections;
DROP POLICY IF EXISTS "Users can insert own connections" ON clickup_connections;
DROP POLICY IF EXISTS "Users can update own connections" ON clickup_connections;
DROP POLICY IF EXISTS "Users can delete own connections" ON clickup_connections;

-- Service role bypass MUST come first (checked first by Postgres)
CREATE POLICY "Service role bypass"
  ON clickup_connections
  FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role')
  WITH CHECK (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- Users can only view their own connections
CREATE POLICY "Users can view own connections"
  ON clickup_connections FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own connections
CREATE POLICY "Users can insert own connections"
  ON clickup_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own connections
CREATE POLICY "Users can update own connections"
  ON clickup_connections FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own connections
CREATE POLICY "Users can delete own connections"
  ON clickup_connections FOR DELETE
  USING (auth.uid() = user_id);
```

3. Verify success - you should see "Success. No rows returned"

## Testing After Fix

1. Click "Connect ClickUp" button
2. Authorize with ClickUp
3. Should see success message
4. Check database:

```sql
SELECT * FROM clickup_connections;
```

Should now show records with:
- user_id
- workspace_id
- access_token
- authorized_workspaces

## Files Modified

- `/supabase/functions/clickup-oauth-callback/index.ts` - Enhanced error handling and logging
- `/supabase/migrations/20260108_create_clickup_connections.sql` - Original table creation
- `/supabase/migrations/20260127_add_service_role_policy.sql` - RLS bypass policy (needs manual execution)

## Commit

```
a8d3ed3 - Fix ClickUp OAuth callback to save tokens to database
```

## Status

- Edge Function: DEPLOYED
- Migration: NEEDS MANUAL EXECUTION
- Testing: PENDING (after SQL execution)
