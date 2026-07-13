// S3 Inbox — the client's intake-uploaded files that have NOT been filed into SharePoint yet.
//
// THE GAP THIS CLOSES. A client who attaches files to the intake form has them uploaded to the
// Supabase `job-files` storage bucket and recorded in job_files (useFormSubmission.ts). Nothing
// ever showed them: the S3 tab reads SharePoint only, so those files were invisible in the app
// forever. This lists them and lets you file each one into one of the five job subfolders.
//
// INBOX MEMBERSHIP is keyed on ONE column: sharepoint_path IS NULL. That column cannot be non-null
// unless Graph actually returned a webUrl for a completed PUT, so "not filed" cannot be faked by a
// half-finished write. v1 limitation, stated not accidental: once filed, a file leaves the inbox
// permanently and cannot be re-filed from here.
//
// The bytes never pass through the browser. Filing calls the job-folder-docs edge function with
// { jobId, fileId, bucket } and the server reads the stored file and PUTs it.

import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileText,
  Inbox,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

const JOB_SUBFOLDERS = [
  '1. REPORT',
  '2. CLIENT SUPPLIED',
  '3. WORK FILES (TTSZ, PICS, COMPS)',
  '4. CLIENT BILLING (Invoice, LOE)',
  '5. LETTER OF RELIANCE (LOR)',
] as const;

// The client's own attachments are almost always what they were asked to supply.
const DEFAULT_BUCKET = '2. CLIENT SUPPLIED';

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4 MB — Graph single-PUT cap; the server re-checks.
const STORAGE_BUCKET = 'job-files'; // confirmed in useFormSubmission.ts — NOT 'documents'

interface InboxFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created_at: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface S3InboxProps {
  jobId: string;
  /** Called after a successful file so the bucket lists refresh. */
  onFiled: () => void;
}

export function S3Inbox({ jobId, onFiled }: S3InboxProps) {
  const [files, setFiles] = useState<InboxFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<Record<string, string>>({});
  const [filingId, setFilingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const { data, error } = await supabase
      .from('job_files')
      .select('id, file_name, file_path, file_size, file_type, created_at')
      .eq('job_id', jobId)
      .is('sharepoint_path', null)
      .order('created_at', { ascending: true });
    setLoading(false);
    if (error) {
      setLoadError(error.message);
      return;
    }
    setFiles((data ?? []) as InboxFile[]);
  }, [jobId]);

  useEffect(() => {
    void load();
  }, [load]);

  const fileIt = async (file: InboxFile) => {
    const bucket = destinations[file.id] ?? DEFAULT_BUCKET;
    setFilingId(file.id);
    const { data, error } = await supabase.functions.invoke('job-folder-docs', {
      body: { jobId, action: 'file-from-storage', fileId: file.id, bucket },
    });
    setFilingId(null);

    if (error) {
      toast.error(`Couldn’t file ${file.file_name}: ${error.message}`);
      return;
    }
    // The server reports a PUT that landed but whose row stamp failed. The file IS on SharePoint;
    // it stays in the inbox and filing it again is safe. Say so rather than pretending it worked.
    if ((data as { error?: string })?.error === 'filed-but-not-stamped') {
      toast.warning(
        `${file.file_name} reached SharePoint but wasn’t recorded. It stays in the inbox — filing it again is safe.`,
      );
      void load();
      return;
    }
    toast.success(`${file.file_name} filed to ${bucket}`);
    await load();
    onFiled();
  };

  /** Oversize files can't be filed through Graph's 4MB single-PUT — give the user the bytes instead. */
  const downloadOversize = async (file: InboxFile) => {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(file.file_path, 60 * 5);
    if (error || !data?.signedUrl) {
      toast.error(`Couldn’t create a download link: ${error?.message ?? 'no URL returned'}`);
      return;
    }
    window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-4 text-sm text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading the client’s uploaded files…
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col gap-2 px-3 py-4">
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="w-4 h-4" /> Couldn’t load the client’s uploaded files: {loadError}
        </div>
        <Button variant="outline" size="sm" className="w-fit" onClick={() => void load()}>
          Retry
        </Button>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-4 text-sm text-muted-foreground">
        <CheckCircle2 className="w-4 h-4 text-green-600" />
        Nothing waiting — every file the client uploaded has been filed.
      </div>
    );
  }

  return (
    <div className="rounded-md border border-amber-700/50 bg-amber-950/20" data-testid="s3-inbox">
      <div className="flex items-center gap-2 border-b border-amber-700/50 px-3 py-2">
        <Inbox className="w-4 h-4 text-amber-500" />
        <span className="text-sm font-medium text-amber-200">
          {files.length} file{files.length === 1 ? '' : 's'} the client uploaded, not filed yet
        </span>
      </div>

      <ul className="divide-y divide-amber-700/30">
        {files.map((file) => {
          const oversize = file.file_size > MAX_UPLOAD_BYTES;
          const busy = filingId === file.id;
          return (
            <li key={file.id} className="flex flex-wrap items-center gap-2 px-3 py-2">
              <FileText className="w-4 h-4 shrink-0 text-amber-500/80" />
              <span className="truncate text-sm text-amber-50" title={file.file_name}>
                {file.file_name}
              </span>
              <span className="shrink-0 text-xs text-amber-200/70">
                {formatSize(file.file_size)}
              </span>

              {oversize ? (
                // Parked, and visibly parked — not an unfinished row. With a working way to get the
                // bytes: "upload via SharePoint web" is unfollowable if you can't retrieve the file.
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-amber-400">
                    Too large to file here (over 4 MB) — upload it via SharePoint
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 h-7"
                    onClick={() => void downloadOversize(file)}
                  >
                    <Download className="w-3 h-3" /> Download
                  </Button>
                </div>
              ) : (
                <div className="ml-auto flex items-center gap-2">
                  <select
                    className="h-7 rounded border border-gray-600 bg-[#1f1f1f] px-2 text-xs text-white"
                    value={destinations[file.id] ?? DEFAULT_BUCKET}
                    disabled={busy}
                    onChange={(e) =>
                      setDestinations((prev) => ({ ...prev, [file.id]: e.target.value }))
                    }
                  >
                    {JOB_SUBFOLDERS.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <Button
                    size="sm"
                    className="h-7 gap-1"
                    disabled={busy}
                    onClick={() => void fileIt(file)}
                  >
                    {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                    {busy ? 'Filing…' : 'File it'}
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
