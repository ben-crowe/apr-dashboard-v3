// The data layer for the job-document sorter + folder previewer (PRD-APR-DOCS-01).
//
// THE TWO COLUMNS MEAN DIFFERENT THINGS — the whole feature rests on this:
//   filed_bucket    = the USER'S INTENT. Which folder they chose. Database truth. Needs SharePoint
//                     for NOTHING. Set FIRST, on the click, so the file appears in its folder
//                     instantly and durably — even with SharePoint undeployed, which it is today.
//   sharepoint_path = the MIRROR STATE. Did the copy actually land. Only ever set on a 2xx from
//                     SharePoint (this rule is qa-gated and is NOT loosened here).
//
// So: inbox membership keys on filed_bucket IS NULL. A folder's contents key on filed_bucket = name.
// "Filed but not mirrored" (filed_bucket set, sharepoint_path null) is a real, queryable state — the
// amber mark — and it reads as FILED, never as lost.
//
// FOLDER CONTENTS ARE A UNION (INV-5). Reading only the database would HIDE files that were written
// into the client's SharePoint tree by a path that leaves no job_files row — the signed contract is
// exactly that (upload-loe-to-sharepoint writes the file and no row). So a folder shows the database
// rows PLUS the live SharePoint listing when it is reachable. "Empty" is only honest when both are
// empty; database-empty with SharePoint unreachable says so, rather than lying with a bare "Empty".

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { JOB_SUBFOLDERS, type JobSubfolder } from '@shared/jobSubfolders';

/** The Supabase storage bucket intake uploads land in. Confirmed in useFormSubmission.ts — NOT 'documents'. */
export const STORAGE_BUCKET = 'job-files';

/** Graph single-PUT cap. Files over this cannot be copied to SharePoint by the app. */
export const MAX_COPY_BYTES = 4 * 1024 * 1024;

/** A file the app knows about: a job_files row, a SharePoint-only item, or both. */
export interface JobDocument {
  /** job_files.id — absent for a SharePoint-only item (nothing in our database to point at). */
  id: string | null;
  name: string;
  size: number;
  type: string;
  /** Storage path in the job-files bucket. Absent for SharePoint-only items = no bytes we can render. */
  storagePath: string | null;
  /** The folder the user filed it into. Null = still unsorted, i.e. in the inbox. */
  filedBucket: JobSubfolder | null;
  /** Set only when the SharePoint copy landed. Null while unmirrored — the amber state. */
  sharepointPath: string | null;
  /** True when this item exists ONLY in SharePoint: no row, no bytes here, so no in-app preview. */
  sharepointOnly: boolean;
}

export interface JobDocumentsState {
  /** Unsorted — the client's files with no folder chosen yet. */
  inbox: JobDocument[];
  /** Folder name -> its contents (database rows + SharePoint-only items merged). */
  byFolder: Record<JobSubfolder, JobDocument[]>;
  loading: boolean;
  error: string | null;
  /** False when the SharePoint listing could not be fetched — a folder may hold more than we can see. */
  sharepointReachable: boolean;
  /**
   * Whether this job's five SharePoint folders have been CREATED yet. This is a DIFFERENT fact from
   * `sharepointReachable` and conflating them is a real defect: a job whose folder set was never
   * created reads as "SharePoint not connected", which sends the reader hunting a connection fault
   * that does not exist. Filing is blocked while this is false — there is nowhere to file TO.
   */
  foldersExist: boolean;
}

interface FileRow {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  filed_bucket: string | null;
  sharepoint_path: string | null;
}

function emptyFolders(): Record<JobSubfolder, JobDocument[]> {
  return Object.fromEntries(JOB_SUBFOLDERS.map((f) => [f, []])) as Record<JobSubfolder, JobDocument[]>;
}

export function useJobDocuments(jobId: string | null) {
  const [state, setState] = useState<JobDocumentsState>({
    inbox: [],
    byFolder: emptyFolders(),
    loading: true,
    error: null,
    sharepointReachable: false,
    foldersExist: false,
  });

  const load = useCallback(async () => {
    if (!jobId) {
      setState({ inbox: [], byFolder: emptyFolders(), loading: false, error: null, sharepointReachable: false });
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));

    // 1. THE DATABASE — always. This is what makes the screen work with SharePoint dark.
    const { data, error } = await supabase
      .from('job_files')
      .select('id, file_name, file_path, file_size, file_type, filed_bucket, sharepoint_path')
      .eq('job_id', jobId)
      .order('created_at', { ascending: true });

    if (error) {
      setState({ inbox: [], byFolder: emptyFolders(), loading: false, error: error.message, sharepointReachable: false });
      return;
    }

    const rows = (data ?? []) as FileRow[];
    const inbox: JobDocument[] = [];
    const byFolder = emptyFolders();

    for (const r of rows) {
      const doc: JobDocument = {
        id: r.id,
        name: r.file_name,
        size: r.file_size,
        type: r.file_type,
        storagePath: r.file_path,
        filedBucket: (r.filed_bucket as JobSubfolder | null) ?? null,
        sharepointPath: r.sharepoint_path,
        sharepointOnly: false,
      };
      // INBOX MEMBERSHIP KEYS ON filed_bucket — not on sharepoint_path. A file the user has filed
      // leaves the inbox immediately, whether or not SharePoint ever hears about it.
      if (!doc.filedBucket) inbox.push(doc);
      else if (byFolder[doc.filedBucket]) byFolder[doc.filedBucket].push(doc);
    }

    // 2. SHAREPOINT — merged in when reachable.
    let sharepointReachable = false;
    let foldersExist = false;
    try {
      const { data: sp, error: spErr } = await supabase.functions.invoke('job-folder-docs', {
        body: { jobId, action: 'list' },
      });
      const listing = sp as { foldersExist?: boolean; buckets?: { name: string; items: { name: string; size: number; webUrl: string }[] }[] } | null;
      // A CLEAN ANSWER of "no folders yet" means SharePoint answered us — it is reachable. Only a
      // thrown call or an error IS unreachable. Reading a missing folder set as a dead connection is
      // how a perfectly healthy job gets reported as broken.
      if (!spErr && listing) {
        sharepointReachable = true;
        foldersExist = !!listing.foldersExist;
      }
      if (!spErr && listing?.foldersExist && listing.buckets) {
        for (const bucket of listing.buckets) {
          const folder = bucket.name as JobSubfolder;
          if (!byFolder[folder]) continue;
          for (const item of bucket.items ?? []) {
            // A SharePoint item we already know about as a database row is the SAME file — do not
            // list it twice. Match on the name we actually PUT (the row's name is the client's
            // original; the copy carries the row-keyed name), so match loosely on the stem.
            const known = byFolder[folder].some(
              (d) => item.name === d.name || (d.id && item.name.includes(d.id.replace(/-/g, '').slice(0, 8))),
            );
            if (known) continue;
            // Present in the client's folder, no row here: the signed contract is exactly this.
            // It is a REAL file and must show — but we hold no bytes, so it cannot be previewed.
            byFolder[folder].push({
              id: null,
              name: item.name,
              size: item.size,
              type: '',
              storagePath: null,
              filedBucket: folder,
              sharepointPath: item.webUrl,
              sharepointOnly: true,
            });
          }
        }
      }
    } catch {
      // SharePoint unreachable. Not an error for this screen — the database half still works.
      sharepointReachable = false;
      foldersExist = false;
    }

    setState({ inbox, byFolder, loading: false, error: null, sharepointReachable, foldersExist });
  }, [jobId]);

  useEffect(() => {
    void load();
  }, [load]);

  /**
   * File (or MOVE) a document into a folder.
   *
   * WRITE ORDER IS THE CONTRACT:
   *   1. Set filed_bucket in the database FIRST. This is the user's action; it is durable and it is
   *      what makes the file appear in the folder immediately. It needs SharePoint for nothing.
   *      On a MOVE of an already-mirrored file, sharepoint_path is reset to NULL in the SAME write —
   *      the old copy is in the OLD folder, so claiming it is mirrored in the new one would be a lie.
   *      (The old SharePoint copy stays where it is. We never delete from the client's tree. Accepted.)
   *   2. THEN ask the server to copy it to SharePoint. That call stamps sharepoint_path — and only
   *      on a 2xx. If it fails, the file stays filed and visible, marked amber. Never lost.
   */
  const fileInto = useCallback(
    async (doc: JobDocument, folder: JobSubfolder): Promise<{ mirrored: boolean; error?: string }> => {
      if (!jobId || !doc.id) return { mirrored: false, error: 'This file is only in SharePoint — nothing to move.' };

      // STEP 1 — the durable, DB-only, instant part.
      const { error: dbErr } = await supabase
        .from('job_files')
        .update({ filed_bucket: folder, filed_at: new Date().toISOString(), sharepoint_path: null })
        .eq('id', doc.id)
        .eq('job_id', jobId);

      if (dbErr) return { mirrored: false, error: dbErr.message };

      // Reflect it on screen NOW — before SharePoint is even asked.
      await load();

      // STEP 2 — the mirror. Failure here is survivable and expected while undeployed.
      const { data, error: fnErr } = await supabase.functions.invoke('job-folder-docs', {
        body: { jobId, action: 'file-from-storage', fileId: doc.id, bucket: folder },
      });
      if (fnErr) return { mirrored: false, error: fnErr.message };
      if ((data as { error?: string })?.error) return { mirrored: false, error: (data as { message?: string }).message };

      await load();
      return { mirrored: true };
    },
    [jobId, load],
  );

  /**
   * UNFILE — put a filed document back in the unsorted pile.
   *
   * Without this, filing is a ONE-WAY DOOR: a mis-filed file could be shuffled between folders but
   * never returned to the client's-files side, so a wrong click was unrecoverable from the UI.
   *
   * Clearing filed_bucket is all it takes — inbox membership keys on filed_bucket IS NULL, so the
   * file reappears where it started. sharepoint_path is cleared in the SAME write for the same
   * reason a MOVE clears it: if the file was already copied to SharePoint, that copy is sitting in
   * a folder this file no longer claims to be in, and leaving the mirror stamp would have the app
   * asserting a location that is no longer true. The old SharePoint copy stays where it is — we
   * never delete from the client's tree — so the honest state is "unsorted, not mirrored".
   */
  const unfile = useCallback(
    async (doc: JobDocument): Promise<{ ok: boolean; error?: string }> => {
      if (!jobId || !doc.id) return { ok: false, error: 'This file is only in SharePoint — nothing to move.' };

      const { error: dbErr } = await supabase
        .from('job_files')
        .update({ filed_bucket: null, filed_at: null, sharepoint_path: null })
        .eq('id', doc.id)
        .eq('job_id', jobId);

      if (dbErr) return { ok: false, error: dbErr.message };
      await load();
      return { ok: true };
    },
    [jobId, load],
  );

  /**
   * Add files the appraiser drops in from their own machine. They land UNSORTED, exactly where a
   * client's uploads land — filing is a separate, deliberate act.
   *
   * The storage key is built with the SAME rule as the client intake form (useFormSubmission.ts):
   * a random token, then a stripped-to-legal name segment. Do not "simplify" it to the bare
   * filename. That was the bug fixed on 2026-07-13 — two files whose names differ only in stripped
   * characters collide on one key, the second upload 409s, and a file is silently LOST. The token is
   * what makes the key unique; `file_name` below keeps the original name for display.
   *
   * A failed row-insert is treated as harshly as a failed upload: the bytes would sit in storage
   * with nothing pointing at them, invisible to this panel forever.
   */
  const addFiles = useCallback(
    async (files: File[]): Promise<{ added: number; failed: string[] }> => {
      const failed: string[] = [];
      let added = 0;
      if (!jobId) return { added, failed: files.map((f) => f.name) };

      for (const file of files) {
        const token = crypto.randomUUID().slice(0, 8);
        const segment = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
        const filePath = `${jobId}/${token}${segment ? `-${segment}` : ''}`;

        const { error: upErr } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, file);
        if (upErr) {
          failed.push(file.name);
          continue;
        }

        const { error: dbErr } = await supabase.from('job_files').insert({
          job_id: jobId,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type || 'application/octet-stream',
          file_size: file.size,
        });

        if (dbErr) failed.push(file.name);
        else added++;
      }

      if (added) await load();
      return { added, failed };
    },
    [jobId, load],
  );

  /**
   * Create this job's five SharePoint folders.
   *
   * Sends ONLY { jobId } — the same single-argument call the LOE ribbon's button makes. The edge
   * function composes the folder name the one canonical way. A client-side name built here would be
   * a SECOND way of composing it, and the last time two ways existed they disagreed and a DUPLICATE
   * folder set was created in the client's SharePoint. One caller shape, one name.
   *
   * Idempotent server-side: an existing set is CONNECTED to, never re-created.
   */
  const createFolders = useCallback(async (): Promise<{ ok: boolean; url?: string; error?: string }> => {
    if (!jobId) return { ok: false, error: 'No job.' };

    const { data, error } = await supabase.functions.invoke('create-job-folders', { body: { jobId } });
    if (error) return { ok: false, error: error.message };
    if ((data as { configured?: boolean })?.configured === false)
      return { ok: false, error: 'SharePoint is not configured yet.' };
    if (!(data as { success?: boolean })?.success) return { ok: false, error: 'Could not create the folders.' };

    await load();
    return { ok: true, url: (data as { parentWebUrl?: string }).parentWebUrl };
  }, [jobId, load]);

  return { ...state, reload: load, fileInto, unfile, addFiles, createFolders };
}
