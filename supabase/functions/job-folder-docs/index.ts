// Feature B (SharePoint) — S3 Client Documents folder tab: LIST + UPLOAD + CREATE + FILE-FROM-STORAGE.
//
// SECURITY — WHAT THE jobId-ONLY CONTRACT ACTUALLY BUYS (corrected 2026-07-13; the previous version
// of this comment overclaimed and must not be cited again):
//   IT STOPS PATH TRAVERSAL. The folder path is DERIVED SERVER-SIDE from the job row; any
//   client-supplied path key is rejected outright; `bucket` is validated against the five canonical
//   subfolder names. A caller cannot make this function write outside a job's own subtree.
//   IT DOES *NOT* STOP CROSS-JOB ACCESS. This function has NO caller authentication whatsoever.
//   Anyone who can reach it and knows (or guesses) a jobId can list and write that job's folder.
//   The jobId-only contract constrains WHERE the function writes, not WHO may ask it to. Real
//   cross-job protection needs caller auth (the Login + Roles work), and does not exist today.
//   Graph secrets never leave the server — that part is true and is a separate property.
//
// Built on the EXISTING _shared/graph.ts (INV-0 — one Graph engine, one credential path):
//   LIST              -> resolveJobFolderPath (read-only) + listFolderItems (additive)
//   UPLOAD            -> resolveJobFolderPath + uploadFile (UNCHANGED)
//   CREATE            -> createJobFolders (UNCHANGED, the no-folders-yet action)
//   FILE-FROM-STORAGE -> read the job_files row + its bytes from the `job-files` storage bucket,
//                        PUT to the subfolder, THEN stamp the row. Bytes never touch the browser.
//
// Request forms:
//   LIST              (JSON):      { jobId, action: "list" }
//   CREATE            (JSON):      { jobId, action: "create" }
//   UPLOAD            (multipart): fields jobId, action="upload", bucket, + file (the dropped File)
//   FILE-FROM-STORAGE (JSON):      { jobId, action: "file-from-storage", fileId, bucket }
//
// ORDER OF OPERATIONS FOR FILE-FROM-STORAGE — PUT FIRST, STAMP SECOND, STAMP ONLY ON 2xx.
// Stamp-then-PUT is FORBIDDEN: it marks a row filed, drops it out of the inbox, and silently loses
// the file when the PUT fails. There is no transaction spanning Graph and Postgres, so idempotent
// retry IS the design — a failed stamp leaves the row in the inbox, and the retry PUTs the same
// bytes to the same deterministic path, overwriting itself. That is why filedFileName() is pure.
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
import { filedFileName } from '../_shared/filedName.ts';

/** The Supabase storage bucket intake uploads land in. Confirmed in useFormSubmission.ts — NOT 'documents'. */
const STORAGE_BUCKET = 'job-files';

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
    let fileId: string | undefined;
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
      fileId = typeof body.fileId === 'string' ? body.fileId : undefined;
    }

    if (!jobId) return json({ error: 'jobId is required' }, 400);
    if (
      action !== 'list' &&
      action !== 'upload' &&
      action !== 'create' &&
      action !== 'file-from-storage'
    ) {
      return json(
        { error: 'action must be "list", "upload", "create", or "file-from-storage"' },
        400,
      );
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

    // ---- FILE-FROM-STORAGE ----
    // Move an intake-uploaded file from the `job-files` storage bucket into a SharePoint subfolder.
    // The bytes go server-side; the browser never re-uploads them.
    if (action === 'file-from-storage') {
      if (!bucket || !VALID_BUCKETS.includes(bucket)) {
        return json({ error: 'bucket must be one of the five job subfolders' }, 400);
      }
      if (!fileId) return json({ error: 'fileId is required for file-from-storage' }, 400);
      if (!parentPath) {
        return json({ error: 'no-folders-yet', message: 'Create the client folders first.' }, 409);
      }

      // Resolve the row BY (id, job_id) together. A fileId belonging to another job cannot be
      // filed into this job's folder — the pair must match or there is no row.
      const { data: fileRow, error: fileErr } = await supabase
        .from('job_files')
        .select('id, file_name, file_path, file_type, file_size, sharepoint_path')
        .eq('id', fileId)
        .eq('job_id', jobId)
        .single();
      if (fileErr || !fileRow) return json({ error: 'File not found for this job' }, 404);

      // Already filed — idempotent no-op, not an error. (v1: a filed file leaves the inbox for good.)
      if (fileRow.sharepoint_path) {
        return json({ filed: true, alreadyFiled: true, webUrl: fileRow.sharepoint_path });
      }

      // Size gate BEFORE pulling bytes — the row already carries the size.
      if ((fileRow.file_size ?? 0) > MAX_UPLOAD_BYTES) {
        return json(
          {
            error: 'too-large',
            message: 'too large to file here — upload via SharePoint web',
            maxBytes: MAX_UPLOAD_BYTES,
            folderUrl: `/${parentPath}/${bucket}`,
          },
          413,
        );
      }

      const { data: blob, error: dlErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(fileRow.file_path);
      if (dlErr || !blob) {
        return json({ error: `Could not read the stored file: ${dlErr?.message ?? 'no data'}` }, 502);
      }
      const bytes = new Uint8Array(await blob.arrayBuffer());

      // Deterministic, row-keyed destination name — sanitized for SharePoint's forbidden set.
      // Pure function of the row, so a retry overwrites its own bytes at its own path.
      const destName = filedFileName(fileRow.id, fileRow.file_name);

      // 1. PUT FIRST. If this throws, nothing is stamped and the row stays in the inbox.
      const uploaded = await uploadFile(
        `${parentPath}/${bucket}/${destName}`,
        bytes,
        fileRow.file_type || 'application/octet-stream',
      );

      // 2. STAMP SECOND, and only now — the PUT returned. A stamp failure here is survivable:
      //    the row stays in the inbox and a retry re-PUTs the same bytes to the same path.
      const { error: stampErr } = await supabase
        .from('job_files')
        .update({
          filed_bucket: bucket,
          filed_at: new Date().toISOString(),
          sharepoint_path: uploaded.webUrl ?? null,
        })
        .eq('id', fileRow.id)
        .eq('job_id', jobId);

      if (stampErr) {
        return json(
          {
            error: 'filed-but-not-stamped',
            message:
              'The file reached SharePoint but the database was not updated. It stays in the inbox; ' +
              'filing it again is safe and overwrites the same file.',
            webUrl: uploaded.webUrl ?? null,
            detail: stampErr.message,
          },
          500,
        );
      }

      return json({
        filed: true,
        item: { name: destName, webUrl: uploaded.webUrl, id: uploaded.id },
        bucket,
      });
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
