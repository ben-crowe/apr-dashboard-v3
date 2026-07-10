// Feature B (SharePoint) — S3 Client Documents folder tab: LIST + UPLOAD (chunk 4).
//
// INV-3 SECURITY CRUX — the input contract accepts jobId (+ action, bucket, file) ONLY. The
// folder path is DERIVED SERVER-SIDE from the job row; any client-supplied path is REJECTED.
// creds-server-side alone does NOT stop cross-job access — the jobId-only contract does, together
// with resolveJobFolderPath's job-unique prefix. Graph secrets never leave the server.
//
// Built on the EXISTING _shared/graph.ts (INV-0 — one Graph engine, one credential path):
//   LIST   -> resolveJobFolderPath (read-only) + listFolderItems (additive)
//   UPLOAD -> resolveJobFolderPath + uploadFile (UNCHANGED)
//   CREATE -> createJobFolders (UNCHANGED, the no-folders-yet action)
//
// Request forms:
//   LIST   (JSON):      { jobId, action: "list" }
//   CREATE (JSON):      { jobId, action: "create" }
//   UPLOAD (multipart): fields jobId, action="upload", bucket, + file (the dropped File)
//
// Single-PUT cap = 4 MB (Graph simple-upload). Enforced AUTHORITATIVELY here; the client also
// pre-checks for UX. A file > 4 MB -> 413 with a clear per-file error + the folder link-out.

import { serve } from 'https://deno.land/std@0.220.0/http/server.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import {
  graphConfigured,
  resolveSharePointIds,
  jobFolderInputs,
  resolveJobFolderPath,
  listFolderItems,
  uploadFile,
  createJobFolders,
  JOB_SUBFOLDERS,
} from '../_shared/graph.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4 MB — Graph single-PUT cap
const VALID_BUCKETS: readonly string[] = JOB_SUBFOLDERS;

// Keys a client must never be able to supply — a path here is the job-subtree-only hole.
const FORBIDDEN_PATH_KEYS = ['path', 'folderPath', 'filePath', 'parentPath'];

interface JobRow {
  job_number: string | null;
  property_name: string | null;
  property_address: string | null;
  created_at: string | null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  if (!graphConfigured()) {
    return json({ configured: false, message: 'SharePoint not configured (Entra app pending).' }, 503);
  }

  try {
    // ---- parse input (multipart for upload, JSON otherwise) + reject any client-supplied path ----
    const contentType = req.headers.get('content-type') ?? '';
    let jobId: string | undefined;
    let action: string | undefined;
    let bucket: string | undefined;
    let fileName: string | undefined;
    let fileType = 'application/octet-stream';
    let fileBytes: Uint8Array | undefined;

    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      for (const key of FORBIDDEN_PATH_KEYS) {
        if (form.has(key)) return json({ error: `client-supplied "${key}" is not accepted` }, 400);
      }
      jobId = form.get('jobId')?.toString();
      action = form.get('action')?.toString();
      bucket = form.get('bucket')?.toString();
      const f = form.get('file');
      if (f instanceof File) {
        fileBytes = new Uint8Array(await f.arrayBuffer());
        fileName = f.name;
        fileType = f.type || fileType;
      }
    } else {
      const body = (await req.json()) as Record<string, unknown>;
      for (const key of FORBIDDEN_PATH_KEYS) {
        if (key in body) return json({ error: `client-supplied "${key}" is not accepted` }, 400);
      }
      jobId = typeof body.jobId === 'string' ? body.jobId : undefined;
      action = typeof body.action === 'string' ? body.action : undefined;
      bucket = typeof body.bucket === 'string' ? body.bucket : undefined;
    }

    if (!jobId) return json({ error: 'jobId is required' }, 400);
    if (action !== 'list' && action !== 'upload' && action !== 'create') {
      return json({ error: 'action must be "list", "upload", or "create"' }, 400);
    }

    // ---- derive the job's folder inputs SERVER-SIDE from the job row (never from the client) ----
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const { data: jobRowRaw, error: jobErr } = await supabase
      .from('job_submissions')
      .select('job_number, property_name, property_address, created_at')
      .eq('id', jobId)
      .single();
    if (jobErr || !jobRowRaw) return json({ error: 'Job not found for jobId' }, 404);
    const jobRow = jobRowRaw as JobRow;
    if (!jobRow.job_number) {
      return json({ error: 'Job has no job_number yet — create the Valcre job first' }, 409);
    }

    const inputs = jobFolderInputs(jobRow);
    const { driveId } = await resolveSharePointIds();

    // ---- CREATE (explicit no-folders-yet action) ----
    if (action === 'create') {
      const result = await createJobFolders({
        year: inputs.year,
        parentFolderName: `${inputs.jobNumber} - ${inputs.propertyDescription}`,
        jobNumber: inputs.jobNumber,
      });
      return json({ created: true, folderUrl: result.parentWebUrl ?? null, result });
    }

    // ---- resolve the ACTUAL job parent path (read-only, job-unique) ----
    const parentPath = await resolveJobFolderPath(driveId, inputs);

    // ---- LIST ----
    if (action === 'list') {
      if (!parentPath) {
        return json({ foldersExist: false, buckets: [], folderUrl: null });
      }
      const buckets = [];
      for (const name of JOB_SUBFOLDERS) {
        const items = await listFolderItems(driveId, `${parentPath}/${name}`);
        buckets.push({
          name,
          items: items
            .filter((i) => !i.isFolder)
            .map((i) => ({ name: i.name, size: i.size, webUrl: i.webUrl, modified: i.lastModified })),
        });
      }
      return json({ foldersExist: true, folderUrl: `/${parentPath}`, buckets });
    }

    // ---- UPLOAD ----
    // bucket must be one of the five canonical names (also blocks path traversal via bucket).
    if (!bucket || !VALID_BUCKETS.includes(bucket)) {
      return json({ error: 'bucket must be one of the five job subfolders' }, 400);
    }
    if (!fileBytes || !fileName) return json({ error: 'file is required for upload' }, 400);
    if (fileBytes.byteLength > MAX_UPLOAD_BYTES) {
      return json(
        {
          error: 'too-large',
          message: 'too large to sort here — upload via SharePoint web',
          maxBytes: MAX_UPLOAD_BYTES,
          folderUrl: parentPath ? `/${parentPath}/${bucket}` : null,
        },
        413,
      );
    }
    if (!parentPath) {
      return json({ error: 'no-folders-yet', message: 'Create the client folders first.' }, 409);
    }

    const uploaded = await uploadFile(`${parentPath}/${bucket}/${fileName}`, fileBytes, fileType);
    return json({ uploaded: true, item: { name: fileName, webUrl: uploaded.webUrl, id: uploaded.id } });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error';
    return json({ error: message }, 500);
  }
});
