-- Create clickup_connections table for storing OAuth access tokens
-- Each user can have multiple connections (one per workspace)

CREATE TABLE IF NOT EXISTS clickup_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL,
  access_token TEXT NOT NULL, -- OAuth access token (consider encrypting in production)
  refresh_token TEXT, -- For future use if tokens expire
  authorized_workspaces JSONB, -- Array of workspace objects user authorized
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, workspace_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_clickup_connections_user_id ON clickup_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_clickup_connections_workspace_id ON clickup_connections(workspace_id);

-- Enable RLS
ALTER TABLE clickup_connections ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do anything (for Edge Functions)
CREATE POLICY "Service role bypass"
  ON clickup_connections
  USING (true)
  WITH CHECK (true);

-- Policy: Users can only view their own connections
CREATE POLICY "Users can view own connections"
  ON clickup_connections FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own connections
CREATE POLICY "Users can insert own connections"
  ON clickup_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own connections
CREATE POLICY "Users can update own connections"
  ON clickup_connections FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own connections
CREATE POLICY "Users can delete own connections"
  ON clickup_connections FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_clickup_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_clickup_connections_updated_at
  BEFORE UPDATE ON clickup_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_clickup_connections_updated_at();
