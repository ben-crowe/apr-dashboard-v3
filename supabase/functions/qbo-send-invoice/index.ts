// QBO — email an existing Invoice (SendInvoice). INERT until creds + bootstrap (503).
// Body: { "invoiceId": "42", "sendTo": "billing@acme.com" }   (sendTo optional -> uses BillEmail)
import { serve } from 'https://deno.land/std@0.220.0/http/server.ts';
import { qboConfigured, QboNotReady, sendInvoice } from '../_shared/quickbooks.ts';

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
    const { invoiceId, sendTo } = await req.json();
    if (!invoiceId) return json({ error: 'invoiceId required' }, 400);
    await sendInvoice(invoiceId, sendTo);
    return json({ configured: true, success: true, invoiceId, emailStatus: 'EmailSent' });
  } catch (error) {
    if (error instanceof QboNotReady) return json({ configured: false, message: error.message }, 503);
    console.error('qbo-send-invoice error:', error);
    return json({ error: 'sendInvoice failed', details: (error as Error).message }, 500);
  }
});
