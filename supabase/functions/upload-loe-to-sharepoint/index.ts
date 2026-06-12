// Feature B (SharePoint) — push the SIGNED LOE PDF into the job's billing folder.
//
// Storage architecture (decided): Supabase is the system of record. Only the
// signed LOE + the finalized report mirror one-way to SharePoint on finalization.
// This function handles the signed-LOE leg — called from the DocuSeal webhook
// once submission.completed fires.
//
// Confirmed convention (Codex captured live from SharePoint):
//   filename = "LOE - {JOB#} - signed.pdf"   (no date in the name)
//   lands in  "4. CLIENT BILLING (Invoice, LOE)"
//
// INERT until the Entra app exists: returns 503 { configured:false }.
//
// Request body (one of pdfBase64 | pdfUrl required):
//   { "jobNumber": "VAL261054",
//     "propertyDescription": "Stacked Townhouse Development ... Calgary AB",
//     "year": 2026,                 // optional — defaults to current year
//     "pdfBase64": "JVBERi0...",    // signed PDF bytes, OR
//     "pdfUrl": "https://.../signed.pdf" }   // fetched server-side

import { serve } from 'https://deno.land/std@0.220.0/http/server.ts';
import { graphConfigured, uploadFile, listFolderNames, chooseSignedLoeName, resolveSharePointIds, JOB_SUBFOLDERS } from '../_shared/graph.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const BILLING_SUBFOLDER = JOB_SUBFOLDERS[3]; // "4. CLIENT BILLING (Invoice, LOE)"

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  if (!graphConfigured()) {
    return json({ configured: false, message: 'SharePoint not configured (Entra app pending).' }, 503);
  }

  try {
    const { jobNumber, propertyDescription, year, pdfBase64, pdfUrl } = await req.json();
    if (!jobNumber || !propertyDescription) {
      return json({ error: 'Missing required fields: jobNumber and propertyDescription' }, 400);
    }
    if (!pdfBase64 && !pdfUrl) {
      return json({ error: 'Provide pdfBase64 or pdfUrl' }, 400);
    }

    let bytes: Uint8Array;
    if (pdfBase64) {
      bytes = base64ToBytes(pdfBase64);
    } else {
      const res = await fetch(pdfUrl);
      if (!res.ok) return json({ error: `Failed to fetch pdfUrl (${res.status})` }, 400);
      bytes = new Uint8Array(await res.arrayBuffer());
    }

    const resolvedYear = year ?? new Date().getUTCFullYear();
    const parentFolderName = `${jobNumber} - ${propertyDescription}`;
    const billingPath = `2.Jobs/${resolvedYear}/${parentFolderName}/${BILLING_SUBFOLDER}`;

    // Client's signed-LOE naming VARIES job-to-job (long form "LOE - {parentFolderName} - signed.pdf"
    // on some, short "LOE - {JOB#} - signed.pdf" on others). Match-or-fallback: reuse an existing
    // signed-LOE name if one is already in the billing folder (replace, no duplicate); else long form.
    const { driveId } = await resolveSharePointIds();
    const existing = await listFolderNames(driveId, billingPath);
    const filename = chooseSignedLoeName(existing, jobNumber, parentFolderName);
    const filePath = `${billingPath}/${filename}`;

    const uploaded = await uploadFile(filePath, bytes, 'application/pdf');

    return json({
      configured: true,
      success: true,
      jobNumber,
      filePath,
      filename,
      webUrl: uploaded.webUrl,
      itemId: uploaded.id,
    });
  } catch (error) {
    console.error('upload-loe-to-sharepoint error:', error);
    return json({ error: 'Failed to upload signed LOE', details: (error as Error).message }, 500);
  }
});
