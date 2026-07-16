import { supabase } from "@/integrations/supabase/client";
import { STORAGE_BUCKET } from "@/features/job-documents/useJobDocuments";

// Item 7B — the archive / permanent-delete operations, in ONE place so the two paths share the
// storage + row cleanup and neither can drift from the other.

/**
 * Remove the job's uploaded file BYTES from storage. This is the fix for bug (a): the old delete never
 * called storage.remove(), so the bytes orphaned. Returns the paths it removed (for proof/logging).
 * Uses the real storage paths from job_files.file_path; sharepoint-only rows (null file_path) have no
 * bytes in our bucket and are skipped.
 */
export async function removeJobFileBytes(jobId: string): Promise<string[]> {
  const { data: rows, error } = await supabase
    .from("job_files")
    .select("file_path")
    .eq("job_id", jobId);
  if (error) throw error;

  const paths = (rows ?? [])
    .map((r) => (r as { file_path: string | null }).file_path)
    .filter((p): p is string => !!p && p.trim() !== "");

  if (paths.length) {
    const { error: rmErr } = await supabase.storage.from(STORAGE_BUCKET).remove(paths);
    if (rmErr) throw rmErr;
  }
  return paths;
}

/**
 * ARCHIVE — set archived_at, keeping every row and the workflow status untouched. If the user chose to
 * delete the uploaded files, remove the bytes (bug (a) fix) AND the job_files rows first; otherwise the
 * files stay and come back on restore.
 */
export async function archiveJob(jobId: string, opts: { deleteFiles: boolean }): Promise<void> {
  if (opts.deleteFiles) {
    await removeJobFileBytes(jobId);
    const { error: delErr } = await supabase.from("job_files").delete().eq("job_id", jobId);
    if (delErr) throw delErr;
  }
  const { error } = await supabase
    .from("job_submissions")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", jobId);
  if (error) throw error;
}

/** RESTORE — bring an archived job back to the active list (archived_at → null). */
export async function restoreJob(jobId: string): Promise<void> {
  const { error } = await supabase
    .from("job_submissions")
    .update({ archived_at: null })
    .eq("id", jobId);
  if (error) throw error;
}

/**
 * PERMANENT DELETE — the only true delete, behind its own confirm. Fixes BOTH documented bugs:
 *  (a) calls storage.remove() on the file bytes (old delete never did), and
 *  (b) deletes job_property_info (old delete skipped it entirely),
 * in addition to the tables the old delete already cleared. Rows are deleted child-first, then the
 * job_submissions parent last.
 */
export async function permanentlyDeleteJob(jobId: string): Promise<{ removedPaths: string[] }> {
  // (a) bytes first — if this throws we have not yet dropped the rows that point at them.
  const removedPaths = await removeJobFileBytes(jobId);

  // Child rows. job_property_info is the (b) fix — it was skipped by the old delete.
  for (const table of ["job_property_info", "job_loe_details", "job_details", "job_files"] as const) {
    const { error } = await supabase.from(table).delete().eq("job_id", jobId);
    if (error) throw error;
  }

  const { error } = await supabase.from("job_submissions").delete().eq("id", jobId);
  if (error) throw error;

  return { removedPaths };
}
