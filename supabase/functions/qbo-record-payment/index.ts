// QBO — record a manual Payment against an Invoice (flips it Paid; no merchant account).
// Primarily for automated sandbox testing of the "paid" trigger. INERT until creds + bootstrap (503).
// Body: { "customerId": "123", "invoiceId": "42", "amount": 2500 }
import { serve } from 'https://deno.land/std@0.220.0/http/server.ts';
import { qboConfigured, QboNotReady, recordPayment } from '../_shared/quickbooks.ts';

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
    const { customerId, invoiceId, amount } = await req.json();
    if (!customerId || !invoiceId || !amount) return json({ error: 'customerId, invoiceId, amount required' }, 400);
    const payment = await recordPayment({ customerId, invoiceId, amount });
    return json({ configured: true, success: true, paymentId: payment.id });
  } catch (error) {
    if (error instanceof QboNotReady) return json({ configured: false, message: error.message }, 503);
    console.error('qbo-record-payment error:', error);
    return json({ error: 'recordPayment failed', details: (error as Error).message }, 500);
  }
});
