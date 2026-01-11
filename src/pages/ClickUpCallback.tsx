import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

/**
 * ClickUp OAuth Callback Handler
 * 
 * This page handles the OAuth callback from ClickUp after user authorization.
 * Flow:
 * 1. User authorizes on ClickUp
 * 2. ClickUp redirects here with ?code=xxx&state=xxx
 * 3. We exchange code for access token via Edge Function
 * 4. Store token in database
 * 5. Redirect to Dashboard
 */
const ClickUpCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing authorization...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get authorization code and state from URL
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        // Check for OAuth error
        if (error) {
          setStatus('error');
          setMessage(`Authorization failed: ${error}`);
          setTimeout(() => navigate('/dashboard'), 3000);
          return;
        }

        // Validate we have required params
        if (!code || !state) {
          setStatus('error');
          setMessage('Missing authorization code or state parameter');
          setTimeout(() => navigate('/dashboard'), 3000);
          return;
        }

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          setStatus('error');
          setMessage('Please log in first');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Exchange code for access token via Edge Function
        setMessage('Exchanging authorization code for access token...');
        const { data, error: exchangeError } = await supabase.functions.invoke('clickup-oauth-callback', {
          body: {
            code,
            state,
            userId: user.id
          }
        });

        if (exchangeError || !data?.success) {
          setStatus('error');
          setMessage(exchangeError?.message || data?.error || 'Failed to exchange authorization code');
          setTimeout(() => navigate('/dashboard'), 5000);
          return;
        }

        // Success!
        setStatus('success');
        setMessage('Successfully connected to ClickUp! Redirecting...');
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
        setTimeout(() => navigate('/dashboard'), 5000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 text-center">
          {status === 'processing' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">Connecting to ClickUp...</h2>
              <p className="text-slate-600 dark:text-slate-400">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 h-12 w-12 flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">Successfully Connected!</h2>
              <p className="text-slate-600 dark:text-slate-400">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="rounded-full bg-red-100 dark:bg-red-900/30 h-12 w-12 flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-red-600 dark:text-red-400">Connection Failed</h2>
              <p className="text-slate-600 dark:text-slate-400">{message}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClickUpCallback;
