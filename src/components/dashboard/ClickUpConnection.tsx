import { useClickUpOAuth } from '@/hooks/useClickUpOAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2, ExternalLink } from 'lucide-react';

/**
 * ClickUp Connection Component
 * Shows connection status and allows users to connect/disconnect ClickUp
 */
const ClickUpConnection = () => {
  const { isConnected, connections, isLoading, error, connect, disconnect } = useClickUpOAuth();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ClickUp Integration</CardTitle>
          <CardDescription>Checking connection status...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-slate-600 dark:text-slate-400">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ClickUp Integration
          {isConnected ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          ) : (
            <XCircle className="h-5 w-5 text-slate-400" />
          )}
        </CardTitle>
        <CardDescription>
          {isConnected
            ? `Connected to ${connections.length} workspace(s)`
            : 'Connect your ClickUp account to enable task creation'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {isConnected ? (
          <div className="space-y-3">
            <div className="space-y-2">
              {connections.map((connection) => (
                <div
                  key={connection.id}
                  className="flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {connection.authorized_workspaces?.[0]?.name || `Workspace ${connection.workspace_id}`}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Connected {new Date(connection.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => disconnect(connection.workspace_id)}
                  >
                    Disconnect
                  </Button>
                </div>
              ))}
            </div>
            <Button
              onClick={connect}
              variant="outline"
              className="w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Add Another Workspace
            </Button>
          </div>
        ) : (
          <Button
            onClick={connect}
            className="w-full"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Connect ClickUp
          </Button>
        )}

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isConnected
            ? 'Your ClickUp account is connected. Tasks will be created automatically when you create jobs.'
            : 'Click the button above to authorize this app to access your ClickUp account.'}
        </p>
      </CardContent>
    </Card>
  );
};

export default ClickUpConnection;
