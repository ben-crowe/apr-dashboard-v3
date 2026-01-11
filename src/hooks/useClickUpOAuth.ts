import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ClickUpConnection {
  id: string;
  workspace_id: string;
  authorized_workspaces: Array<{
    id: string;
    name: string;
  }>;
  created_at: string;
}

interface UseClickUpOAuthReturn {
  isConnected: boolean;
  connections: ClickUpConnection[];
  isLoading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: (workspaceId: string) => Promise<void>;
  refreshConnections: () => Promise<void>;
}

/**
 * Hook for managing ClickUp OAuth connections
 */
export const useClickUpOAuth = (): UseClickUpOAuthReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [connections, setConnections] = useState<ClickUpConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check connection status
  const checkConnection = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsConnected(false);
        setConnections([]);
        setIsLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('clickup_connections')
        .select('id, workspace_id, authorized_workspaces, created_at')
        .eq('user_id', user.id);

      if (fetchError) {
        throw fetchError;
      }

      setConnections(data || []);
      setIsConnected((data || []).length > 0);
    } catch (err) {
      console.error('Error checking ClickUp connection:', err);
      setError(err instanceof Error ? err.message : 'Failed to check connection');
      setIsConnected(false);
      setConnections([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize connection check
  useEffect(() => {
    checkConnection();
  }, []);

  // Connect to ClickUp (initiate OAuth flow)
  const connect = async () => {
    try {
      setError(null);

      // Get authorization URL from Edge Function
      const { data, error: authError } = await supabase.functions.invoke('clickup-oauth-authorize');

      if (authError || !data?.success) {
        throw new Error(authError?.message || data?.error || 'Failed to get authorization URL');
      }

      // Redirect user to ClickUp authorization page
      window.location.href = data.authorizationUrl;
    } catch (err) {
      console.error('Error initiating ClickUp connection:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to ClickUp');
      throw err;
    }
  };

  // Disconnect from ClickUp (remove connection)
  const disconnect = async (workspaceId: string) => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { error: deleteError } = await supabase
        .from('clickup_connections')
        .delete()
        .eq('user_id', user.id)
        .eq('workspace_id', workspaceId);

      if (deleteError) {
        throw deleteError;
      }

      // Refresh connections
      await checkConnection();
    } catch (err) {
      console.error('Error disconnecting from ClickUp:', err);
      setError(err instanceof Error ? err.message : 'Failed to disconnect');
      throw err;
    }
  };

  return {
    isConnected,
    connections,
    isLoading,
    error,
    connect,
    disconnect,
    refreshConnections: checkConnection,
  };
};
