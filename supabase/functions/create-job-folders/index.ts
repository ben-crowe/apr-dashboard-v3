// Feature B (SharePoint) — create the per-job folder tree on demand.
//
// Called at job creation AND by the dashboard "Create Client Folders" button.
// Idempotent: re-calling never duplicates (check-then-create per folder).
//
// INERT until the Entra app exists: with no GRAPH_* secrets it returns 503
// { configured:false } so the dashboard button can show "SharePoint not configured".
//
// Request body:
//   { "jobNumber": "VAL261054",
//     "propertyDescription": "Stacked Townhouse Development 2822 &2828 11 Ave SE Calgary AB",
//     "year": 2026 }            // optional — defaults to current year
//
// parent folder = "{jobNumber} - {propertyDescription}" under 2.Jobs/{year}/

import { serve } from 'https://deno.land/std@0.220.0/http/server.ts';
import { graphConfigured, createJobFolders, resolveSharePointIds } from '../_shared/graph.ts';

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
    const { jobNumber, propertyDescription, year } = await req.json();
    if (!jobNumber || !propertyDescription) {
      return json({ error: 'Missing required fields: jobNumber and propertyDescription' }, 400);
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
