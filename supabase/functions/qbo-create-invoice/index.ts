// QBO — create an Invoice (ensures the "Appraisal Services" item). INERT until creds + bootstrap (503).
// Body: { "customerId": "123", "amount": 2500, "billEmail": "billing@acme.com", "description": "Appraisal - VAL261054" }
//       (itemId optional — defaults to ensureItem('Appraisal Services'))
import { serve } from 'https://deno.land/std@0.220.0/http/server.ts';
import { qboConfigured, QboNotReady, ensureItem, createInvoice } from '../_shared/quickbooks.ts';

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
    const { customerId, amount, billEmail, description, itemId } = await req.json();
    if (!customerId || !amount) return json({ error: 'customerId and amount required' }, 400);
    const resolvedItemId = itemId ?? (await ensureItem()).id;
    const invoice = await createInvoice({ customerId, itemId: resolvedItemId, amount, billEmail, description });
    return json({ configured: true, success: true, invoiceId: invoice.id, syncToken: invoice.syncToken });
  } catch (error) {
    if (error instanceof QboNotReady) return json({ configured: false, message: error.message }, 503);
    console.error('qbo-create-invoice error:', error);
    return json({ error: 'createInvoice failed', details: (error as Error).message }, 500);
  }
});
