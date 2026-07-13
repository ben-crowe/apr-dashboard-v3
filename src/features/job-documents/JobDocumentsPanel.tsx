// Client-document sorting + in-app folder previewer, on the V3 job page (PRD-APR-DOCS-01).
//
// LEFT  = the client's submitted files, still unsorted. Thumbnails.
// RIGHT = all five job folders, always visible at once, each showing what is actually inside it.
// Emptying the left into the right IS the job.
//
// Filing is DATABASE-FIRST. Picking a folder writes filed_bucket immediately, so the file moves on
// screen at once — with SharePoint undeployed, as it is today. The SharePoint copy is attempted
// after, and a failure leaves the file filed and visible with an amber mark. It is never lost, and
// it never bounces back to the unsorted pile.
//
// The preview REUSES the report builder's image window (ImageEditorModal) with its editing rail
// switched off — it is not forked. Forking it would rebuild the very duplication that BUILD STEP 1
// just deleted from the folder names.

import React, { useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { JOB_SUBFOLDERS, JOB_SUBFOLDER_SHORT_LABELS, type JobSubfolder } from '@shared/jobSubfolders';
import { useJobDocuments, type JobDocument, MAX_COPY_BYTES, STORAGE_BUCKET } from './useJobDocuments';
import { ImageEditorModal } from '@/features/image-configurator/components/ImageEditorModal';
import type { JobImage } from '@/features/image-configurator/types';
import { AlertCircle, CheckCircle2, CloudOff, FileText, FolderOpen, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const IMAGE_TYPES = /^image\//;

/** Public URL for a file in the job-files bucket — what the preview window renders. */
function publicUrl(storagePath: string): string {
  const base = import.meta.env.VITE_SUPABASE_URL || '';
  return `${base}/storage/v1/object/public/${STORAGE_BUCKET}/${storagePath}`;
}

/**
 * THE ADAPTER (co-architect ruling 2). The gallery and preview window speak `job_images`; the
 * client's files live in `job_files` — different tables, different columns. This maps one row into
 * the shape the window expects so we can REUSE the component instead of forking it. The fields the
 * window does not need for a view-only preview (crop_data, adjustments, quality, AI category) are
 * simply absent, which it tolerates.
 */
function toJobImage(doc: JobDocument): JobImage {
  return {
    id: doc.id ?? doc.name,
    job_id: '',
    original_filename: doc.name,
    storage_path: doc.storagePath ?? '',
    file_size: doc.size,
  } as unknown as JobImage;
}

function ext(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot + 1).toUpperCase() : 'FILE';
}

function sizeOf(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Amber = the user filed it, but the SharePoint copy has not landed. Filed, not lost. */
function isAmber(d: JobDocument): boolean {
  return !!d.filedBucket && !d.sharepointPath && !d.sharepointOnly;
}

interface MoveMenuProps {
  doc: JobDocument;
  current: JobSubfolder | null;
  onMove: (folder: JobSubfolder) => void;
  disabled?: boolean;
}

/** The "Move to…" dropdown. Ben's call — a dropdown, because not everyone drags. */
function MoveMenu({ doc, current, onMove, disabled }: MoveMenuProps) {
  return (
    <select
      aria-label={`Move ${doc.name} to a folder`}
      data-testid="move-to-folder"
      className="h-7 max-w-[150px] rounded border border-gray-500 bg-[#1f1f1f] px-1 text-xs text-white"
      value={current ?? ''}
      disabled={disabled}
      onChange={(e) => {
        const v = e.target.value as JobSubfolder;
        if (v) onMove(v);
      }}
    >
      <option value="">Move to…</option>
      {JOB_SUBFOLDERS.map((f) => (
        <option key={f} value={f}>
          {f}
        </option>
      ))}
    </select>
  );
}

interface ThumbProps {
  doc: JobDocument;
  onOpen: (doc: JobDocument) => void;
  onMove: (doc: JobDocument, folder: JobSubfolder) => void;
  busy: boolean;
}

function Thumb({ doc, onOpen, onMove, busy }: ThumbProps) {
  const isImage = IMAGE_TYPES.test(doc.type);
  const amber = isAmber(doc);

  return (
    <div
      data-testid="doc-thumb"
      className={`relative flex flex-col rounded-md border bg-[#232323] ${
        amber ? 'border-amber-600' : 'border-gray-700'
      }`}
    >
      <button
        type="button"
        onClick={() => onOpen(doc)}
        className="flex h-28 items-center justify-center overflow-hidden rounded-t-md bg-[#1a1a1a]"
        title={doc.sharepointOnly ? 'In SharePoint — no preview held here' : 'Preview'}
      >
        {isImage && doc.storagePath ? (
          <img src={publicUrl(doc.storagePath)} alt={doc.name} className="h-full w-full object-cover" />
        ) : (
          // Not previewable in-app: a type badge, and the file reads as FILED AND SAFE — never broken.
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <FileText className="h-6 w-6" />
            <span className="rounded bg-gray-700 px-1.5 py-0.5 text-[10px] font-medium text-gray-200">
              {ext(doc.name)}
            </span>
            <span className="text-[10px]">filed and safe</span>
          </div>
        )}
      </button>

      {amber && (
        <span
          data-testid="amber-mark"
          title="Filed. The copy to SharePoint has not landed yet — the file is safe here."
          className="absolute right-1 top-1 rounded-full bg-amber-500/90 p-0.5"
        >
          <CloudOff className="h-3 w-3 text-black" />
        </span>
      )}

      <div className="flex flex-col gap-1 p-1.5">
        <span className="truncate text-[11px] text-gray-200" title={doc.name}>
          {doc.name}
        </span>
        <span className="text-[10px] text-gray-500">{sizeOf(doc.size)}</span>
        {doc.sharepointOnly ? (
          <span className="text-[10px] text-blue-300">in SharePoint</span>
        ) : (
          <MoveMenu doc={doc} current={doc.filedBucket} onMove={(f) => onMove(doc, f)} disabled={busy} />
        )}
      </div>
    </div>
  );
}

export function JobDocumentsPanel({ jobId }: { jobId: string }) {
  const { inbox, byFolder, loading, error, sharepointReachable, reload, fileInto } = useJobDocuments(jobId);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [preview, setPreview] = useState<JobDocument | null>(null);

  const filedCount = useMemo(
    () => JOB_SUBFOLDERS.reduce((n, f) => n + byFolder[f].filter((d) => !d.sharepointOnly).length, 0),
    [byFolder],
  );
  const total = inbox.length + filedCount;

  const move = async (doc: JobDocument, folder: JobSubfolder) => {
    if (!doc.id) return;
    setBusyId(doc.id);
    const res = await fileInto(doc, folder);
    setBusyId(null);
    if (res.mirrored) {
      toast.success(`${doc.name} filed to ${folder} and copied to SharePoint`);
    } else {
      // The file IS filed — it is in the folder and out of the inbox. Only the copy failed.
      toast.warning(
        `${doc.name} filed to ${folder}. The SharePoint copy hasn't landed (${res.error ?? 'SharePoint unreachable'}) — the file is safe here and marked.`,
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-6 text-sm text-gray-400">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading the client's documents…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2 p-6">
        <div className="flex items-center gap-2 text-sm text-red-400">
          <AlertCircle className="h-4 w-4" /> Couldn't load the documents: {error}
        </div>
        <button onClick={() => void reload()} className="w-fit rounded border border-gray-600 px-2 py-1 text-xs text-gray-200">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div data-testid="job-documents-panel" className="flex flex-col gap-3">
      {/* Progress — "N still to sort", ending in a tick. */}
      <div className="flex items-center gap-3 rounded-md border border-gray-700 bg-[#232323] px-3 py-2">
        {inbox.length === 0 ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-300">Everything is sorted</span>
          </>
        ) : (
          <>
            <FolderOpen className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-amber-200">
              {inbox.length} still to sort
            </span>
          </>
        )}
        <div className="ml-2 h-1.5 flex-1 overflow-hidden rounded bg-gray-700">
          <div
            className="h-full bg-green-600 transition-all"
            style={{ width: total ? `${(filedCount / total) * 100}%` : '0%' }}
          />
        </div>
        {!sharepointReachable && (
          <span className="flex items-center gap-1 text-[11px] text-gray-400" title="Filing still works — the copy to SharePoint will be retried.">
            <CloudOff className="h-3 w-3" /> SharePoint not connected
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* LEFT — the client's unsorted files. */}
        <div className="rounded-md border border-gray-700 bg-[#1f1f1f] p-2">
          <div className="mb-2 px-1 text-sm font-medium text-gray-200">
            Client's files {inbox.length ? `— ${inbox.length} to sort` : ''}
          </div>
          {inbox.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-500">
              Nothing waiting. Every file the client sent has been put in a folder.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {inbox.map((d) => (
                <Thumb key={d.id} doc={d} onOpen={setPreview} onMove={move} busy={busyId === d.id} />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — all five folders, always visible. */}
        <div className="flex flex-col gap-2">
          {JOB_SUBFOLDERS.map((folder) => {
            const items = byFolder[folder];
            const anyAmber = items.some(isAmber);
            return (
              <div
                key={folder}
                data-testid="folder-card"
                data-folder={folder}
                className={`rounded-md border bg-[#232323] p-2 ${anyAmber ? 'border-amber-700' : 'border-gray-700'}`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="truncate text-xs font-medium text-gray-200" title={folder}>
                    {JOB_SUBFOLDER_SHORT_LABELS[folder]}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-500">
                    {items.length} file{items.length === 1 ? '' : 's'}
                    {anyAmber && <CloudOff className="h-3 w-3 text-amber-500" />}
                  </span>
                </div>

                {items.length === 0 ? (
                  // Honest emptiness. If SharePoint is unreachable we may simply not be able to SEE
                  // what is in there — saying a bare "Empty" would be a claim we cannot make.
                  <div className="px-1 py-2 text-[11px] text-gray-500">
                    {sharepointReachable
                      ? 'Empty — file a document here'
                      : 'No filed documents. SharePoint is not connected, so anything already in this folder cannot be listed yet.'}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-1.5">
                    {items.slice(0, 6).map((d) => (
                      <Thumb
                        key={d.id ?? `sp-${d.name}`}
                        doc={d}
                        onOpen={setPreview}
                        onMove={move}
                        busy={busyId === d.id}
                      />
                    ))}
                    {items.length > 6 && (
                      <div className="flex items-center justify-center rounded border border-gray-700 text-xs text-gray-400">
                        +{items.length - 6}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* In-app preview. No download, no external tab — the report builder's window, editing off. */}
      {preview && (
        <ImageEditorModal
          image={toJobImage(preview)}
          isOpen
          viewOnly
          imageUrlOverride={
            preview.storagePath && IMAGE_TYPES.test(preview.type) ? publicUrl(preview.storagePath) : null
          }
          headerExtra={
            preview.id ? (
              <MoveMenu
                doc={preview}
                current={preview.filedBucket}
                onMove={(f) => {
                  void move(preview, f);
                  setPreview(null);
                }}
              />
            ) : null
          }
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}
