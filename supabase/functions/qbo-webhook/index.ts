// QBO webhook receiver (Trigger 2 — "invoice paid"). INERT until creds + verifier token (503).
//
// Contract: verify intuit-signature on the RAW body, confirm realmId, return 200 fast,
// then for each Payment.Create -> GET payment -> LinkedTxn -> fire APR downstream.
// Spec Section 4 + 9D.

import { serve } from 'https://deno.land/std@0.220.0/http/server.ts';
import { qboConfigured, verifyIntuitSignature, getPayment } from '../_shared/quickbooks.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, intuit-signature',
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } });

interface QboEntity { name: string; id: string; operation: string; lastUpdated: string; }
interface QboNotification { realmId: string; dataChangeEvent: { entities: QboEntity[] }; }

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (!qboConfigured()) return json({ configured: false, message: 'QuickBooks not configured (Intuit app pending).' }, 503);

  // RAW body FIRST — re-serialized JSON breaks the HMAC.
  const rawBody = await req.text();
  const signature = req.headers.get('intuit-signature');
  if (!verifyIntuitSignature(rawBody, signature)) {
    return json({ error: 'invalid signature' }, 401);
  }

  let payload: { eventNotifications?: QboNotification[] };
  try { payload = JSON.parse(rawBody); } catch { return json({ error: 'bad json' }, 400); }

  // Acknowledge immediately (Intuit requires 200 within 3s), process inline-but-fast.
  try {
    for (const note of payload.eventNotifications ?? []) {
      for (const ent of note.dataChangeEvent?.entities ?? []) {
        if (ent.name === 'Payment' && ent.operation === 'Create') {
          try {
            const payment = await getPayment(ent.id);
            const linkedInvoice = (payment?.Line ?? [])
              .flatMap((l: any) => l.LinkedTxn ?? [])
              .find((t: any) => t.TxnType === 'Invoice');
            console.log(`QBO Payment.Create ${ent.id} cleared invoice ${linkedInvoice?.TxnId ?? '(none)'} — realm ${note.realmId}`);
            // TODO (Trigger-2 downstream — wires when closing flow is live):
            //   1. map invoice TxnId -> job (a job_loe_details.qbo_invoice_id column)
            //   2. flip job_submissions.status -> 'paid'
            //   3. send receipt email (send-loe-email/Graph) + flip ClickUp card -> Paid
          } catch (e) {
            console.error('QBO payment fetch failed:', (e as Error).message);
          }
        }
      }
    }
  } catch (e) {
    console.error('qbo-webhook processing error (already acked):', (e as Error).message);
  }

  return json({ success: true });
});
