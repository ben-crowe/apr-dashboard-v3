// Client Documents — the approved folder previewer, on the V3 job page (PRD-APR-DOCS-01).
//
// THE CONTRACT IS THE PROTOTYPE, not this comment and not the PRD prose:
//   ~/Development/KM-Exp/data/screenshots/apr-folder-previewer-LIGHT.html   <- build to THIS
//   ~/Development/KM-Exp/data/screenshots/apr-doc-sorter-LIGHT.png          <- what it looks like
// The dark original (apr-folder-previewer-prototype.html) is reference only. ui-designer did the
// light conversion himself; where prose and prototype differ, the prototype wins. The earlier
// dropdown-only surface was built from the prose while the design was still being drawn — that is
// the mistake this replaces.
//
// ⚑ THE ONE TRAP, and it is a STRUCTURAL inversion, not a colour swap (ui-designer's warning):
// in the dark original the folder cards were LIGHT on a DARK panel — that contrast is what made
// them read as separate objects. Make the page light and a light card on a light page VANISHES:
// five white boxes on white, no edges. So:
//   - the right-hand folder column is a GREY WELL (#f1f5f9 = slate-100),
//   - each folder card is WHITE with a hairline border and a 1px shadow, sitting ON the well,
//   - the empty slots inside a card get their own tint (#f8fafc) or they disappear into the white.
//
// LEFT  = the client's files as a thumbnail gallery (2-up default, 1/2/3-up switch), drop zone above.
// RIGHT = all five folders, ALWAYS visible. Clicking one opens it IN THE LEFT GALLERY.
//
// THREE ways to file, all required (Ben: not everyone drags):
//   1. drag a thumbnail onto a folder card   2. drag it onto that folder's TAB   3. the dropdown
//
// The plumbing underneath is unchanged: filing writes filed_bucket FIRST (database truth, instant,
// needs SharePoint for nothing); the SharePoint copy is attempted after; a failed copy leaves the
// file FILED and visible with an amber mark. Never lost, never bounced back to the pile.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { JOB_SUBFOLDERS, JOB_SUBFOLDER_SHORT_LABELS, type JobSubfolder } from '@shared/jobSubfolders';
import { useJobDocuments, type JobDocument, STORAGE_BUCKET } from './useJobDocuments';
import { ImageEditorModal } from '@/features/image-configurator/components/ImageEditorModal';
import type { JobImage } from '@/features/image-configurator/types';
import { AlertCircle, CheckCircle2, CloudOff, FileText, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';

const IMAGE_TYPES = /^image\//;
const SLOTS = 6; // a folder card shows six; a seventh collapses into "+N"

/** Public URL for a file in the job-files bucket. */
function publicUrl(storagePath: string): string {
  const base = import.meta.env.VITE_SUPABASE_URL || '';
  return `${base}/storage/v1/object/public/${STORAGE_BUCKET}/${storagePath}`;
}

/**
 * THE ADAPTER. The preview window speaks `job_images`; the client's files live in `job_files` —
 * different tables, different columns. This maps one row into the shape the window expects, so the
 * component is REUSED rather than forked.
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

/** Amber = the user filed it, the SharePoint copy has not landed. FILED, not lost. */
function isAmber(d: JobDocument): boolean {
  return !!d.filedBucket && !d.sharepointPath && !d.sharepointOnly;
}

/** The unfile sentinel. Not a folder name, so it can never collide with one. */
const UNSORTED = '__un';

/** The picture on a card (big) or in a folder slot (small). */
function Art({ doc, big }: { doc: JobDocument; big: boolean }) {
  if (IMAGE_TYPES.test(doc.type) && doc.storagePath) {
    return <img src={publicUrl(doc.storagePath)} alt={doc.name} className="h-full w-full object-cover" />;
  }
  if (doc.sharepointOnly) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 text-blue-600">
        <FileText className={big ? 'h-7 w-7' : 'h-4 w-4'} />
        {big && <span className="text-[11px]">in SharePoint</span>}
      </div>
    );
  }
  // A type with no in-app preview. The wording is KEYED ON filed_bucket — "filed and safe" about a
  // file that is NOT in a folder is a false statement on screen.
  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <span className="rounded bg-[#f5f3ff] px-1.5 py-0.5 text-[10px] font-semibold text-violet-700">
        {ext(doc.name)}
      </span>
      {big && (
        <small className="text-[10px] text-[#64748b]">
          {doc.filedBucket ? 'filed and safe' : 'no preview'}
        </small>
      )}
    </div>
  );
}

/** The "Move to…" dropdown — filing route 3. Ben was explicit that dragging must not be the only way. */
function MoveSelect({
  doc,
  onMove,
  onUnfile,
  disabled,
}: {
  doc: JobDocument;
  onMove: (f: JobSubfolder) => void;
  onUnfile: () => void;
  disabled?: boolean;
}) {
  return (
    <select
      data-testid="move-to-folder"
      aria-label={`Move ${doc.name} to a folder`}
      className="h-6 w-full rounded border border-[#e2e8f0] bg-white px-1 text-[11px] text-[#0f172a]"
      value={doc.filedBucket ?? ''}
      disabled={disabled}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => {
        const v = e.target.value;
        if (v === UNSORTED) onUnfile();
        else if (v) onMove(v as JobSubfolder);
      }}
    >
      {!doc.filedBucket && <option value="">Move to…</option>}
      {JOB_SUBFOLDERS.map((f) => (
        <option key={f} value={f}>
          {f}
        </option>
      ))}
      {doc.filedBucket && (
        <option value={UNSORTED} data-testid="back-to-unsorted">
          ↩ Back to Unsorted
        </option>
      )}
    </select>
  );
}

export function JobDocumentsPanel({ jobId }: { jobId: string }) {
  const { inbox, byFolder, loading, error, sharepointReachable, reload, fileInto, unfile } =
    useJobDocuments(jobId);

  /** null = the Unsorted pile. A folder name = that folder, opened IN THE LEFT GALLERY. */
  const [view, setView] = useState<JobSubfolder | null>(null);
  const [gsize, setGsize] = useState<1 | 2 | 3>(2);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [dragDoc, setDragDoc] = useState<JobDocument | null>(null);
  const [overTarget, setOverTarget] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);
  const foldRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const list = view ? byFolder[view] : inbox;
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
    setFlash(folder);
    setTimeout(() => setFlash(null), 800);
    if (res.mirrored) toast.success(`${doc.name} → ${folder} · copying to SharePoint too`);
    else
      toast.warning(
        `${doc.name} → ${folder}. The SharePoint copy hasn't landed — the file is filed here and marked.`,
      );
  };

  const putBack = async (doc: JobDocument) => {
    if (!doc.id) return;
    setBusyId(doc.id);
    const res = await unfile(doc);
    setBusyId(null);
    if (res.ok) toast.success(`${doc.name} → back to Unsorted`);
    else toast.error(`Couldn't move ${doc.name} back: ${res.error}`);
  };

  /** A drop landed on a folder card OR on its tab. Both routes end here. */
  const dropOn = (folder: JobSubfolder) => {
    setOverTarget(null);
    const d = dragDoc;
    setDragDoc(null);
    if (d) void move(d, folder);
  };

  /** Clicking a folder (or its tab) opens it in the LEFT gallery and flashes its card.
   *  It never hides the other folders — single-folder mode was rejected. */
  const goToFolder = (folder: JobSubfolder) => {
    setView(folder);
    foldRefs.current[folder]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setFlash(folder);
    setTimeout(() => setFlash(null), 800);
  };

  // Arrow keys step through the open folder; Escape closes. As in the prototype's lightbox.
  useEffect(() => {
    if (previewIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewIdx(null);
      if (e.key === 'ArrowRight') setPreviewIdx((i) => (i === null ? i : (i + 1) % list.length));
      if (e.key === 'ArrowLeft') setPreviewIdx((i) => (i === null ? i : (i - 1 + list.length) % list.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [previewIdx, list.length]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-6 text-sm text-[#64748b]">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading the client's documents…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2 p-6">
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" /> Couldn't load the documents: {error}
        </div>
        <button onClick={() => void reload()} className="w-fit rounded border border-[#e2e8f0] px-2 py-1 text-xs">
          Retry
        </button>
      </div>
    );
  }

  const preview = previewIdx !== null ? list[previewIdx] : null;

  return (
    <div data-testid="job-documents-panel" className="flex flex-col">
      {/* ── TOP RIBBON — the folder tabs. Deliberately QUIET.
          Selected = background #e8edf4 + a small blue dot, and NOTHING more. Ben rejected a
          bright/white selected tab TWICE, and it is easier to break on a light page. ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e2e8f0] px-1 pb-2">
        <span className="text-[11px] text-[#64748b]">
          Drag onto a folder or its tab · or use the dropdown on a file
        </span>
        <div className="flex flex-wrap items-center gap-1" data-testid="folder-ribbon">
          {JOB_SUBFOLDERS.map((f) => {
            const items = byFolder[f];
            const bad = items.filter(isAmber).length;
            const on = view === f;
            const over = overTarget === `tab:${f}`;
            return (
              <button
                key={f}
                type="button"
                data-testid="folder-tab"
                data-folder={f}
                title={f}
                onClick={() => goToFolder(f)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverTarget(`tab:${f}`);
                }}
                onDragLeave={() => setOverTarget(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  dropOn(f);
                }}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-1 text-[11px] transition-colors ${
                  over
                    ? 'border-dashed border-green-500 bg-green-50 text-green-700'
                    : on
                      ? 'border-transparent bg-[#e8edf4] text-[#0f172a]'
                      : 'border-transparent text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
                }`}
              >
                {on && <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-[#3b82f6]" />}
                <span>{JOB_SUBFOLDER_SHORT_LABELS[f]}</span>
                <span className={`text-[10px] font-semibold ${items.length ? 'text-[#64748b]' : 'text-[#cbd5e1]'}`}>
                  {items.length}
                </span>
                {bad > 0 && <CloudOff className="h-3 w-3 text-[#d97706]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── PROGRESS — the point of the screen. ── */}
      <div className="flex items-center gap-3 px-1 py-2">
        {inbox.length === 0 ? (
          <span className="flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-green-700">
            <CheckCircle2 className="h-4 w-4" /> Everything is sorted
          </span>
        ) : (
          <span className="whitespace-nowrap text-sm text-[#0f172a]">
            <b>{inbox.length}</b> still to sort
          </span>
        )}
        <div className="h-1.5 flex-1 overflow-hidden rounded bg-[#e2e8f0]">
          <div
            className="h-full bg-[#22c55e] transition-all"
            style={{ width: total ? `${(filedCount / total) * 100}%` : '0%' }}
          />
        </div>
        {/* Said ONCE, here — NOT repeated as a paragraph in all five folders. Ben rejected that. */}
        {!sharepointReachable && (
          <span
            className="flex items-center gap-1 whitespace-nowrap text-[11px] text-[#64748b]"
            title="Filing still works — files are safe here and the copy is retried."
          >
            <CloudOff className="h-3 w-3" /> SharePoint not connected
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-[10px] border border-[#e2e8f0] lg:grid-cols-[1fr_380px]">
        {/* ── LEFT — the gallery. Shows Unsorted, or the folder you opened. ── */}
        <div className="flex flex-col gap-2 border-r border-[#e2e8f0] bg-white p-3">
          {/* Drop zone. */}
          <div
            data-testid="drop-zone"
            onDragOver={(e) => {
              e.preventDefault();
              setOverTarget('drop');
            }}
            onDragLeave={() => setOverTarget(null)}
            onDrop={(e) => {
              e.preventDefault();
              setOverTarget(null);
              toast.info(
                "Adding files from the desktop isn't wired up yet — the client's uploads appear here on their own.",
              );
            }}
            className={`flex flex-col items-center rounded-[9px] border-2 border-dashed py-4 text-center ${
              overTarget === 'drop' ? 'border-[#3b82f6] bg-blue-50' : 'border-[#e2e8f0]'
            }`}
          >
            <Upload className="h-4 w-4 text-[#94a3b8]" />
            <div className="text-xs text-[#0f172a]">Drop files here to add them</div>
            <div className="text-[10px] text-[#64748b]">they land in the pile below, unsorted</div>
          </div>

          {/* Title + the 1-up / 2-up / 3-up size switch. */}
          <div className="flex items-center justify-between">
            <span className="truncate text-sm font-semibold text-[#0f172a]">
              {view ?? 'Unsorted'}
              <span className="ml-1 text-xs font-normal text-[#64748b]">
                · {list.length} file{list.length === 1 ? '' : 's'}
              </span>
              {view && (
                <button
                  data-testid="back-to-unsorted-link"
                  onClick={() => setView(null)}
                  className="ml-2 rounded border border-[#e2e8f0] px-1.5 py-0.5 text-[11px] font-normal text-[#3b82f6] hover:bg-[#f1f5f9]"
                >
                  back to Unsorted
                </button>
              )}
            </span>
            <div className="flex shrink-0 items-center gap-0.5" data-testid="size-switch">
              {([1, 2, 3] as const).map((n) => (
                <button
                  key={n}
                  onClick={() => setGsize(n)}
                  className={`rounded px-1.5 py-0.5 text-[11px] ${
                    gsize === n ? 'bg-[#e8edf4] text-[#0f172a]' : 'text-[#94a3b8] hover:bg-[#f1f5f9]'
                  }`}
                >
                  {n} up
                </button>
              ))}
            </div>
          </div>

          {/* The thumbnails. */}
          <div className="max-h-[560px] overflow-y-auto pr-1">
            {list.length === 0 ? (
              <div className="flex flex-col items-center gap-1 rounded-md border border-[#e2e8f0] bg-[#f8fafc] py-12 text-center">
                {view ? (
                  <>
                    <div className="text-sm font-semibold text-[#0f172a]">This folder is empty</div>
                    <div className="text-xs text-[#64748b]">
                      Drag a file onto it, or pick it from a file's dropdown.
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-8 w-8 text-[#22c55e]" />
                    <div className="text-sm font-semibold text-[#0f172a]">Everything is sorted</div>
                    <div className="text-xs text-[#64748b]">Every file the client sent is now in a folder.</div>
                  </>
                )}
              </div>
            ) : (
              <div
                className={`grid gap-2 ${
                  gsize === 1 ? 'grid-cols-1' : gsize === 2 ? 'grid-cols-2' : 'grid-cols-3'
                }`}
              >
                {list.map((doc, i) => {
                  const amber = isAmber(doc);
                  return (
                    <div
                      key={doc.id ?? `sp-${doc.name}`}
                      data-testid="doc-thumb"
                      draggable={!!doc.id}
                      onDragStart={() => setDragDoc(doc)}
                      onDragEnd={() => {
                        setDragDoc(null);
                        setOverTarget(null);
                      }}
                      className={`flex flex-col overflow-hidden rounded-[9px] border bg-white transition-opacity ${
                        amber ? 'border-[#d97706]/50' : 'border-[#e2e8f0]'
                      } ${dragDoc?.id === doc.id ? 'opacity-40' : ''} ${busyId === doc.id ? 'opacity-50' : ''}`}
                    >
                      <button
                        type="button"
                        data-testid="thumb-open"
                        onClick={() => setPreviewIdx(i)}
                        className={`relative flex items-center justify-center overflow-hidden bg-[#f1f5f9] ${
                          gsize === 1 ? 'h-[260px]' : gsize === 2 ? 'h-[150px]' : 'h-[104px]'
                        }`}
                        title="Open"
                      >
                        <Art doc={doc} big />
                        {amber && (
                          <span
                            data-testid="amber-mark"
                            title="Filed here. The copy to SharePoint has not landed — the file is safe."
                            className="absolute right-1 top-1 flex items-center gap-1 rounded bg-amber-50 px-1 py-0.5 text-[9px] font-semibold text-[#d97706]"
                          >
                            <CloudOff className="h-2.5 w-2.5" /> SharePoint failed
                          </span>
                        )}
                      </button>
                      <div className="flex flex-col gap-1 p-1.5">
                        {/* No file-size line — Ben cut it; it wasted a row on every card. */}
                        <div className="truncate text-[11px] text-[#0f172a]" title={doc.name}>
                          {doc.name}
                        </div>
                        {doc.sharepointOnly ? (
                          <span className="text-[10px] text-blue-600">in SharePoint</span>
                        ) : (
                          <MoveSelect
                            doc={doc}
                            onMove={(f) => void move(doc, f)}
                            onUnfile={() => void putBack(doc)}
                            disabled={busyId === doc.id}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT — the GREY WELL. All five folders, ALWAYS visible, as WHITE cards sitting on it.
            The well is the whole point: a white card on a white page has no edges. ── */}
        <div className="flex flex-col bg-[#f1f5f9] p-3" data-testid="folder-well">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-sm font-semibold text-[#0f172a]">Job Folders</span>
            <span className="text-[10px] text-[#64748b]">drag a file onto one · click to look inside</span>
          </div>

          <div className="flex max-h-[640px] flex-col gap-3 overflow-y-auto">
            {JOB_SUBFOLDERS.map((folder) => {
              const items = byFolder[folder];
              const bad = items.filter(isAmber).length;
              const shown = items.slice(0, SLOTS);
              const rest = items.length - shown.length;
              const over = overTarget === `fold:${folder}`;
              const on = view === folder;

              return (
                <div
                  key={folder}
                  ref={(el) => (foldRefs.current[folder] = el)}
                  data-testid="folder-card"
                  data-folder={folder}
                  onClick={() => goToFolder(folder)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setOverTarget(`fold:${folder}`);
                  }}
                  onDragLeave={() => setOverTarget(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    dropOn(folder);
                  }}
                  className={`shrink-0 cursor-pointer rounded-lg border-[1.5px] bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,.05)] transition-all ${
                    over
                      ? 'scale-[1.01] border-dashed border-[#22c55e] bg-green-50'
                      : flash === folder
                        ? 'border-[#22c55e] shadow-[0_0_0_6px_rgba(34,197,94,.3)]'
                        : on
                          ? 'border-[#3b82f6] shadow-[0_0_0_3px_rgba(59,130,246,.22)]'
                          : 'border-[#e2e8f0] hover:border-[#94a3b8]'
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="truncate text-[11px] font-semibold text-[#0f172a]" title={folder}>
                      {folder}
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-[10px] text-[#64748b]">
                      {items.length ? `${items.length} file${items.length === 1 ? '' : 's'}` : '—'}
                      {bad > 0 && (
                        <span
                          className="flex items-center gap-0.5 font-semibold text-[#d97706]"
                          title="Did not copy to SharePoint"
                        >
                          <CloudOff className="h-3 w-3" /> {bad}
                        </span>
                      )}
                    </span>
                  </div>

                  {/* 3-across x 2-down slots. Filled show the file; empty are dashed + numbered and get
                      their OWN tint or they vanish into the white card; a seventh becomes "+N". */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {Array.from({ length: SLOTS }).map((_, k) => {
                      if (k < shown.length) {
                        const f = shown[k];
                        return (
                          <div
                            key={f.id ?? `s-${f.name}`}
                            data-testid="folder-slot"
                            className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[5px] bg-[#f8fafc]"
                            title={f.name}
                          >
                            <Art doc={f} big={false} />
                            {isAmber(f) && (
                              <span className="absolute right-0.5 top-0.5 rounded bg-[#d97706] px-1 text-[8px] font-bold text-white">
                                !
                              </span>
                            )}
                          </div>
                        );
                      }
                      if (k === shown.length && rest > 0) {
                        return (
                          <div
                            key="more"
                            className="flex aspect-[4/3] items-center justify-center rounded bg-[#f8fafc] text-[11px] font-semibold text-[#64748b]"
                          >
                            +{rest}
                          </div>
                        );
                      }
                      return (
                        <div
                          key={`hole-${k}`}
                          data-testid="empty-slot"
                          className="flex aspect-[4/3] items-center justify-center rounded-[5px] border-[1.5px] border-dashed border-[#cbd5e1] text-[10px] font-semibold text-[#cbd5e1]"
                        >
                          {k + 1}
                        </div>
                      );
                    })}
                  </div>

                  {/* ONE short line per empty folder. NOT a paragraph, and not five times over. */}
                  {items.length === 0 && (
                    <div className="mt-2 text-[11px] text-[#64748b]">Empty — drag a file here</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── PREVIEW — full-screen, in-app. No download, no external tab. Reuses the report builder's
          window with the crop/rotate/adjust rail switched off. ── */}
      {preview && (
        <ImageEditorModal
          image={toJobImage(preview)}
          isOpen
          viewOnly
          imageUrlOverride={
            preview.storagePath && IMAGE_TYPES.test(preview.type) ? publicUrl(preview.storagePath) : null
          }
          headerExtra={
            <div className="flex items-center gap-2">
              <button
                data-testid="preview-prev"
                onClick={() => setPreviewIdx((i) => (i === null ? i : (i - 1 + list.length) % list.length))}
                className="rounded px-2 py-1 text-base text-slate-300 hover:bg-slate-700"
                title="Previous"
              >
                ‹
              </button>
              <span className="whitespace-nowrap text-xs text-slate-400">
                {(previewIdx ?? 0) + 1} of {list.length} in {view ?? 'Unsorted'} · shown here, never downloaded
              </span>
              <button
                data-testid="preview-next"
                onClick={() => setPreviewIdx((i) => (i === null ? i : (i + 1) % list.length))}
                className="rounded px-2 py-1 text-base text-slate-300 hover:bg-slate-700"
                title="Next"
              >
                ›
              </button>
              {preview.id && (
                <div className="w-40">
                  <MoveSelect
                    doc={preview}
                    onMove={(f) => {
                      void move(preview, f);
                      setPreviewIdx(null);
                    }}
                    onUnfile={() => {
                      void putBack(preview);
                      setPreviewIdx(null);
                    }}
                  />
                </div>
              )}
            </div>
          }
          onClose={() => setPreviewIdx(null)}
        />
      )}
    </div>
  );
}
