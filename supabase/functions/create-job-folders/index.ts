// Feature B (SharePoint) — create the per-job folder tree on demand.
//
// Called at job creation (after the VAL number lands) AND by the dashboard
// "Create Client Folders" button. Idempotent: re-calling never duplicates.
//
// INERT until the Entra app exists: with no GRAPH_* secrets it returns 503
// { configured:false } so the dashboard button can show "SharePoint not configured".
//
// Request body — EITHER form:
//   { "jobId": "<job_submissions.id>" }                     ← preferred (parity-safe)
//   { "jobNumber": "VAL261054",
//     "propertyDescription": "Stacked Townhouse ... Calgary AB",
//     "year": 2026 }                                        ← explicit override
//
// With jobId we look up the row and build the folder name via jobFolderInputs() —
// the SAME helper the signed-LOE upload uses, so the parent folder is byte-identical.

import { serve } from 'https://deno.land/std@0.220.0/http/server.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { graphConfigured, createJobFolders, resolveSharePointIds, jobFolderInputs } from '../_shared/graph.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  if (!graphConfigured()) {
    return json({ configured: false, message: 'SharePoint not configured (Entra app pending).' }, 503);
  }

  try {
    const body = await req.json();
    let jobNumber: string | undefined = body.jobNumber;
    let propertyDescription: string | undefined = body.propertyDescription;
    let year: string | number | undefined = body.year;

    // Preferred path: resolve from the job row so the name matches the upload side.
    if (body.jobId) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      );
      const { data: jobRow, error } = await supabase
        .from('job_submissions')
        .select('job_number, property_name, property_address, created_at')
        .eq('id', body.jobId)
        .single();
      if (error || !jobRow) return json({ error: 'Job not found for jobId' }, 404);
      if (!jobRow.job_number) return json({ error: 'Job has no job_number yet — create the Valcre job first' }, 409);
      ({ jobNumber, propertyDescription, year } = jobFolderInputs(jobRow));
    }

    if (!jobNumber || !propertyDescription) {
      return json({ error: 'Provide jobId, or jobNumber + propertyDescription' }, 400);
    }

    const parentFolderName = `${jobNumber} - ${propertyDescription}`;
    const resolvedYear = year ?? new Date().getUTCFullYear();

    const result = await createJobFolders({ year: resolvedYear, parentFolderName });
    const { siteId } = await resolveSharePointIds();

    return json({
      configured: true,
      success: true,
      jobNumber,
      parentPath: result.parentPath,
      parentId: result.parentId,
      subfolders: result.subfolders,
      siteId,
    });
  } catch (error) {
    console.error('create-job-folders error:', error);
    return json({ error: 'Failed to create job folders', details: (error as Error).message }, 500);
  }
});
