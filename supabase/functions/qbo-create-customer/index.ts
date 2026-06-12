// QBO — create (or look up) a Customer. INERT until Intuit creds + OAuth bootstrap (503).
// Body: { "displayName": "Acme Holdings", "email": "billing@acme.com" }
import { serve } from 'https://deno.land/std@0.220.0/http/server.ts';
import { qboConfigured, QboNotReady, createCustomer } from '../_shared/quickbooks.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } });

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (!qboConfigured()) return json({ configured: false, message: 'QuickBooks not configured (Intuit app pending).' }, 503);
  try {
    const { displayName, email } = await req.json();
    if (!displayName) return json({ error: 'displayName required' }, 400);
    const customer = await createCustomer(displayName, email);
    return json({ configured: true, success: true, customerId: customer.id });
  } catch (error) {
    if (error instanceof QboNotReady) return json({ configured: false, message: error.message }, 503);
    console.error('qbo-create-customer error:', error);
    return json({ error: 'createCustomer failed', details: (error as Error).message }, 500);
  }
});
