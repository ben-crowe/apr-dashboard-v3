// S3 Client Documents — the SharePoint folder buckets for a job (chunk 4, KR4).
//
// REUSABLE (KR6): the ONLY input is a jobId (+ optional parent link) — no dashboard-only
// assumptions — so a future client-facing upload page can reuse this verbatim. All Graph
// access goes through the server-side `job-folder-docs` edge function; no Graph secret here.

import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  ExternalLink,
  FileText,
  FolderPlus,
  Loader2,
  UploadCloud,
} from 'lucide-react';
import { toast } from 'sonner';

// Verbatim, in order — mirrors graph.ts JOB_SUBFOLDERS. The edge function is authoritative;
// this is the render order + empty-state scaffold when a bucket has no files yet.
const JOB_SUBFOLDERS = [
  '1. REPORT',
  '2. CLIENT SUPPLIED',
  '3. WORK FILES (TTSZ, PICS, COMPS)',
  '4. CLIENT BILLING (Invoice, LOE)',
  '5. LETTER OF RELIANCE (LOR)',
] as const;

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4 MB — Graph single-PUT cap (server enforces too)
const MANY_FILES = 25; // overflow threshold — scroll the list instead of growing the card

interface BucketItem {
  name: string;
  size: number;
  webUrl: string;
  modified: string | null;
}
interface Bucket {
  name: string;
  items: BucketItem[];
}
interface ListResponse {
  foldersExist: boolean;
  buckets: Bucket[];
  folderUrl: string | null;
}

type LoadState = 'loading' | 'ready' | 'no-folders' | 'error';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface S3FolderBucketsProps {
  jobId: string;
  /** The job's stored SharePoint parent folder URL (job_submissions.sharepoint_folder_url). */
  sharepointFolderUrl?: string | null;
}

export function S3FolderBuckets({ jobId, sharepointFolderUrl }: S3FolderBucketsProps) {
  const [state, setState] = useState<LoadState>('loading');
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadingBucket, setUploadingBucket] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setState('loading');
    setError(null);
    const { data, error: invokeErr } = await supabase.functions.invoke<ListResponse>(
      'job-folder-docs',
      { body: { jobId, action: 'list' } },
    );
    if (invokeErr) {
      setError(invokeErr.message);
      setState('error');
      return;
    }
    if (!data?.foldersExist) {
      setBuckets([]);
      setState('no-folders');
      return;
    }
    setBuckets(data.buckets);
    setState('ready');
  }, [jobId]);

  useEffect(() => {
    void load();
  }, [load]);

  const createFolders = async () => {
    setCreating(true);
    const { error: invokeErr } = await supabase.functions.invoke('job-folder-docs', {
      body: { jobId, action: 'create' },
    });
    setCreating(false);
    if (invokeErr) {
      toast.error(`Create folders failed: ${invokeErr.message}`);
      return;
    }
    toast.success('Client folders created on SharePoint');
    void load();
  };

  const uploadTo = async (bucket: string, file: File) => {
    // CLIENT pre-check (UX) — the edge function re-checks authoritatively.
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error(`${file.name} is too large to sort here (max 4 MB) — upload via SharePoint web.`);
      return;
    }
    setUploadingBucket(bucket);
    const form = new FormData();
    form.append('jobId', jobId);
    form.append('action', 'upload');
    form.append('bucket', bucket);
    form.append('file', file);
    const { error: invokeErr } = await supabase.functions.invoke('job-folder-docs', { body: form });
    setUploadingBucket(null);
    if (invokeErr) {
      toast.error(`Upload of ${file.name} failed: ${invokeErr.message}`);
      return;
    }
    toast.success(`${file.name} uploaded to ${bucket}`);
    void load();
  };

  if (state === 'loading') {
    return (
      <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading SharePoint folders…
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="w-4 h-4" /> Couldn’t load folders: {error}
        </div>
        <Button variant="outline" size="sm" className="w-fit" onClick={() => void load()}>
          Retry
        </Button>
      </div>
    );
  }

  if (state === 'no-folders') {
    return (
      <div className="flex flex-col gap-3 p-6">
        <div className="text-sm text-muted-foreground">
          No client folders exist for this job yet.
        </div>
        <Button size="sm" className="w-fit gap-2" disabled={creating} onClick={createFolders}>
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderPlus className="w-4 h-4" />}
          Create Client Folders
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 p-2">
      {JOB_SUBFOLDERS.map((name) => (
        <BucketCard
          key={name}
          name={name}
          items={buckets.find((b) => b.name === name)?.items ?? []}
          uploading={uploadingBucket === name}
          folderUrl={sharepointFolderUrl ?? null}
          onDropFile={(file) => void uploadTo(name, file)}
        />
      ))}
    </div>
  );
}

interface BucketCardProps {
  name: string;
  items: BucketItem[];
  uploading: boolean;
  folderUrl: string | null;
  onDropFile: (file: File) => void;
}

function BucketCard({ name, items, uploading, folderUrl, onDropFile }: BucketCardProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onDropFile(file);
  };

  return (
    <div className="flex flex-col rounded-md border border-border bg-card">
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border">
        <span className="text-sm font-medium truncate" title={name}>{name}</span>
        {folderUrl && (
          <a
            href={folderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground shrink-0"
            title="Open this folder on SharePoint web"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      <div className={`max-h-48 overflow-y-auto px-3 py-2 ${items.length >= MANY_FILES ? 'text-xs' : 'text-sm'}`}>
        {items.length === 0 ? (
          <div className="text-xs text-muted-foreground italic py-2">Empty</div>
        ) : (
          <ul className="flex flex-col gap-1">
            {items.map((item) => (
              <li key={item.name} className="flex items-center gap-2 min-w-0">
                <FileText className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                <a
                  href={item.webUrl || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate hover:underline"
                  title={item.name}
                >
                  {item.name}
                </a>
                <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                  {formatSize(item.size)}
                  {item.modified ? ` · ${item.modified.slice(0, 10)}` : ''}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`m-2 flex items-center justify-center gap-2 rounded border border-dashed py-3 text-xs cursor-pointer transition-colors ${
          dragOver ? 'border-blue-500 bg-blue-500/10' : 'border-border text-muted-foreground hover:border-foreground/40'
        }`}
      >
        {uploading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading…
          </>
        ) : (
          <>
            <UploadCloud className="w-3.5 h-3.5" /> Drop a file or click to upload
          </>
        )}
        <input
          type="file"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onDropFile(file);
            e.target.value = '';
          }}
        />
      </label>
    </div>
  );
}
