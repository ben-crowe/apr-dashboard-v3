-- Add Service Role bypass policy for clickup_connections
-- This allows Edge Functions using Service Role Key to insert/update records
-- despite RLS being enabled

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
