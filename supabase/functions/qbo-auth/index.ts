// QuickBooks OAuth bootstrap (one-time) — connect + callback in one function.
//   GET .../qbo-auth?action=connect   -> 302 to Intuit consent
//   GET .../qbo-auth?code=...&realmId=...&state=...  (Intuit callback) -> exchange + store
//
// INERT until QBO_CLIENT_ID/SECRET exist (503). Spec Section 9B.

import { serve } from 'https://deno.land/std@0.220.0/http/server.ts';
import { qboConfigured, buildAuthUrl, exchangeCodeForTokens } from '../_shared/quickbooks.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  if (!qboConfigured()) {
    return new Response(
      JSON.stringify({ configured: false, message: 'QuickBooks not configured (Intuit app pending).' }),
      { status: 503, headers: { ...cors, 'Content-Type': 'application/json' } },
    );
  }

  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const realmId = url.searchParams.get('realmId');

  try {
    // Callback leg
    if (code && realmId) {
      await exchangeCodeForTokens(code, realmId);
      return new Response(
        '<html><body style="font-family:sans-serif"><h2>QuickBooks connected ✓</h2><p>You can close this tab.</p></body></html>',
        { status: 200, headers: { ...cors, 'Content-Type': 'text/html' } },
      );
    }
    // Connect leg
    const state = crypto.randomUUID(); // TODO: persist + verify on callback (CSRF) — follow-up
    return new Response(null, { status: 302, headers: { ...cors, Location: buildAuthUrl(state) } });
  } catch (error) {
    console.error('qbo-auth error:', error);
    return new Response(
      JSON.stringify({ error: 'OAuth step failed', details: (error as Error).message }),
      { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } },
    );
  }
});
