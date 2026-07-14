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
// ⚑ COLOURS — READ THIS BEFORE "FIXING" THE PALETTE. There are TWO rules here, not one, and the
// second one is the reason the file does something the first one appears to forbid.
//
//   1. SEMANTIC TOKENS EVERYWHERE BY DEFAULT — bg-card, bg-muted, text-foreground,
//      text-muted-foreground, border-border, the same tokens the neighbouring V3 sections use. No
//      raw hex, no rgb(). Picking colour values by eye is what made this panel come out wrong twice.
//
//   2. THE ONE DELIBERATE EXCEPTION: the folder TRAY, the folder CARDS and their SLOTS use an
//      explicit slate scale (bg-slate-200/100 + dark:bg-slate-800/white-alpha, border-slate-300).
//      That is PALETTE B, chosen by Ben and specified by ui-designer. It is NOT a leftover and it is
//      NOT a mistake. DO NOT "restore" it to bg-muted — that is precisely what broke it: bg-muted
//      resolves to near-white on this page, the white cards vanished into it, and Ben's words were
//      "it's pure white, I don't want to see the whole folder system white."
//      Every one of those slate classes carries a dark: variant, so both themes still separate.
//
// ⚑ THE STRUCTURAL POINT the palette serves (ui-designer's warning — it is not a colour swap):
// in the dark original the folder cards were LIGHT on a DARK panel; that contrast is what made them
// read as separate objects. On a light page a light card on a light page VANISHES. So the folder
// column is a RECESSED TRAY that is VISIBLY DARKER THAN THE PAGE, and each folder card sits ON it as
// a raised white surface (border + shadow). Slots take solid hairline borders, never dashed — dashed
// on white reads as nothing. That relationship is what must hold, in either theme. Change the values
// only with Ben and ui-designer; the relationship is the requirement.
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
import {
  AlertCircle,
  CheckCircle2,
  CloudOff,
  FileText,
  FolderOpen,
  FolderPlus,
  Loader2,
  Upload,
} from 'lucide-react';
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

const PDF_NAME = /\.pdf$/i;

/** The picture on a card (big) or in a folder slot (small). */
function Art({ doc, big }: { doc: JobDocument; big: boolean }) {
  if (IMAGE_TYPES.test(doc.type) && doc.storagePath) {
    return <img src={publicUrl(doc.storagePath)} alt={doc.name} className="h-full w-full object-cover" />;
  }

  // A PDF gets a REAL first-page thumbnail, not a type badge. Every card looked identical before
  // this, which defeats the point of a sorter — you could not tell two documents apart without
  // opening each one. The browser's own PDF viewer does the rendering (the same one the previewer
  // uses), so this costs no new dependency. `pointer-events-none` is load-bearing: without it the
  // frame swallows the click and the card no longer opens. The viewer chrome is suppressed via the
  // URL fragment; a browser that ignores it still shows the page, which is the thing we want.
  if (PDF_NAME.test(doc.name) && doc.storagePath && !doc.sharepointOnly) {
    return (
      <iframe
        data-testid="pdf-thumb"
        src={`${publicUrl(doc.storagePath)}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
        title={doc.name}
        tabIndex={-1}
        aria-hidden
        className="pointer-events-none h-full w-full border-0 bg-white"
      />
    );
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
      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-violet-700 dark:text-violet-300">
        {ext(doc.name)}
      </span>
      {/* "no preview" was a lie the moment the previewer learned to render documents — it CAN be
          opened, it just has no thumbnail. Saying otherwise trains the user not to click it. */}
      {big && <small className="text-[10px] text-muted-foreground">click to open</small>}
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
      className="h-6 w-full rounded border border-border bg-card px-1 text-[11px] text-foreground"
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

export function JobDocumentsPanel({ jobId, folderUrl }: { jobId: string; folderUrl?: string | null }) {
  const {
    inbox,
    byFolder,
    loading,
    error,
    sharepointReachable,
    foldersExist,
    reload,
    fileInto,
    unfile,
    addFiles,
    createFolders,
  } = useJobDocuments(jobId);

  /** null = the Unsorted pile. A folder name = that folder, opened IN THE LEFT GALLERY. */
  const [view, setView] = useState<JobSubfolder | null>(null);
  const [gsize, setGsize] = useState<1 | 2 | 3>(2);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [dragDoc, setDragDoc] = useState<JobDocument | null>(null);
  const [overTarget, setOverTarget] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [creatingFolders, setCreatingFolders] = useState(false);
  const [showFolderHelp, setShowFolderHelp] = useState(false);
  const foldRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const pickerRef = useRef<HTMLInputElement | null>(null);

  /**
   * THE GATE. You cannot file a document into a folder that does not exist. Until the job's five
   * SharePoint folders are created, every filing route is disabled — the dropdowns, dragging a card
   * onto a folder, and dragging onto a folder tab. Adding files to the UNSORTED pile stays allowed:
   * unsorted is our own storage and needs SharePoint for nothing.
   *
   * Without this, a filing would set the folder in our database and then fail to copy anything, and
   * the file would sit in the amber "filed but not mirrored" state forever with no way to resolve it.
   */
  const canFile = foldersExist;

  const makeFolders = async () => {
    if (creatingFolders) return;
    setCreatingFolders(true);
    const res = await createFolders();
    setCreatingFolders(false);
    if (res.ok) toast.success('SharePoint folders ready — you can file documents now');
    else toast.error(res.error ?? 'Could not create the folders');
  };

  /**
   * The one place a file from the appraiser's own machine enters. Both the drop and the file-picker
   * route here, so there is a single upload path to reason about, not two.
   */
  const takeFiles = async (files: File[]) => {
    if (!files.length || uploading) return;
    setUploading(true);
    const { added, failed } = await addFiles(files);
    setUploading(false);

    if (added) toast.success(`${added} file${added > 1 ? 's' : ''} added — unsorted, file them into a folder`);
    // Never silent. A file that does not arrive must SAY it did not arrive, by name — the whole
    // point of the 2026-07-13 intake-form fix, and it applies identically here.
    if (failed.length) toast.error(`Could not add: ${failed.join(', ')}`);
  };

  const list = view ? byFolder[view] : inbox;
  const filedCount = useMemo(
    () => JOB_SUBFOLDERS.reduce((n, f) => n + byFolder[f].filter((d) => !d.sharepointOnly).length, 0),
    [byFolder],
  );
  const total = inbox.length + filedCount;

  const move = async (doc: JobDocument, folder: JobSubfolder) => {
    if (!doc.id) return;

    // THE GATE, AT THE ONE PLACE EVERY FILING ROUTE PASSES THROUGH — the dropdown, a card dragged
    // onto a folder, and a card dragged onto a folder tab all end up here. Disabling the three
    // controls in the UI is a courtesy; THIS is the check that cannot be walked around.
    // Filing with no folder set would write the folder into our database and then have nowhere to
    // copy the file to, stranding it in the amber "filed but not mirrored" state permanently.
    if (!canFile) {
      toast.error('Create the SharePoint folder set first — there is nowhere to file this yet.');
      return;
    }

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
      <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
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
        <button onClick={() => void reload()} className="w-fit rounded border border-border px-2 py-1 text-xs">
          Retry
        </button>
      </div>
    );
  }

  const preview = previewIdx !== null ? list[previewIdx] : null;

  return (
    <div data-testid="job-documents-panel" className="flex flex-col">
      {/* ── TOP RIBBON — the folder tabs. Deliberately QUIET.
          Selected = a slightly darker background (bg-muted) + a small blue dot, and NOTHING more.
          Ben rejected a bright/white selected tab TWICE. Do not make it high-contrast. ── */}
      {/* NO WRAPPING (Ben). On a narrow page this row SCROLLS sideways — it does not fold onto a second
          line. A wrapped ribbon rearranges itself under the user and the folder order stops being a
          row you can scan. `min-w-0` on the flex child is what actually permits the overflow: without
          it the child refuses to shrink below its content and the scroll never engages. */}
      <div className="border-b border-border px-1 pb-2">
        {/* The hint stays on its OWN line, ABOVE the folders (Ben) — it is guidance, not a control, and
            putting it in the same row crowds the things you actually click. */}
        <div className="pb-1.5 text-[11px] text-muted-foreground">
          Drag onto a folder or its tab · or use the dropdown on a file
        </div>
        <div
          className="flex min-w-0 items-center justify-end gap-1 overflow-x-auto whitespace-nowrap"
          data-testid="folder-ribbon"
        >
          {/* A folder tab is DORMANT until the folder set exists — it is a name for a folder that has
              not been created, so it must not look like something you can act on. Dormant = dimmed and
              inert (no hover, not a drop target). The moment the set is created every tab brightens and
              takes a small green dot: the row itself tells you the folders are alive, with no banner
              needed to say it. Keep the dot SMALL (Ben) — it is a status mark, not a decoration. */}
          {JOB_SUBFOLDERS.map((f) => {
            const items = byFolder[f];
            const bad = items.filter(isAmber).length;
            const on = view === f;
            const over = overTarget === `tab:${f}`;
            const live = foldersExist;
            return (
              <button
                key={f}
                type="button"
                data-testid="folder-tab"
                data-folder={f}
                data-live={live ? 'true' : 'false'}
                title={live ? f : `${f} — this folder does not exist yet`}
                onClick={() => live && goToFolder(f)}
                aria-disabled={!live}
                onDragOver={(e) => {
                  if (!live) return;
                  e.preventDefault();
                  setOverTarget(`tab:${f}`);
                }}
                onDragLeave={() => setOverTarget(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  if (live) dropOn(f);
                }}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-1 text-[11px] transition-colors ${
                  !live
                    ? 'cursor-default border-transparent text-muted-foreground/40'
                    : over
                      ? 'border-dashed border-green-500 bg-green-50 text-green-700'
                      : on
                        ? 'border-transparent bg-muted text-foreground'
                        : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {/* The selected tab keeps its blue dot. An unselected LIVE tab gets a small green one —
                    the "this folder is real" mark. A dormant tab gets nothing. */}
                {on ? (
                  <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-blue-500" />
                ) : live ? (
                  <span
                    data-testid="folder-live-dot"
                    className="h-[5px] w-[5px] shrink-0 rounded-full bg-emerald-500/70"
                  />
                ) : null}
                <span>{JOB_SUBFOLDER_SHORT_LABELS[f]}</span>
                <span className={`text-[10px] font-semibold ${live ? 'text-muted-foreground' : 'text-muted-foreground/40'}`}>
                  {items.length}
                </span>
                {bad > 0 && <CloudOff className="h-3 w-3 text-amber-600 dark:text-amber-400" />}
              </button>
            );
          })}

          {/* A gap and a hairline rule (Ben). The folder names are places you FILE INTO; the button is
              an ACTION ON the set. Sitting flush together they read as one list of six things, and the
              button looks like a sixth folder. The rule says: different kind of thing. */}
          {!loading && (
            <span
              data-testid="folder-set-divider"
              aria-hidden
              className="mx-2 h-4 w-px shrink-0 bg-border"
            />
          )}

        {/* ── THE FOLDER SET — one small button, sitting WITH the folder tabs because that is what it
                 governs. It replaced a full-width coloured banner that shouted the same information at
                 the user on every single page load (Ben: "way too in your face").

                 Two states, the same logic the old LOE ribbon button had:
                   folders exist  -> GREEN, active, opens them in SharePoint.
                   no folders yet -> DIM, and it CREATES the set. Filing stays blocked until then.

                 The explanation is not gone, it is BEHIND the "?" — press it and it appears. An
                 explanation the user can summon is worth more than one they have to read every time, and
                 permanently-visible instructional text stops being read at all. ── */}
          {!loading && (
            <div className="flex items-center gap-1" data-testid="folder-set-control">
              <button
                type="button"
                data-testid={foldersExist ? 'open-folders' : 'create-folders'}
                onClick={() => {
                  if (foldersExist) folderUrl && window.open(folderUrl, '_blank', 'noopener');
                  else void makeFolders();
                }}
                disabled={
                  foldersExist ? !folderUrl : creatingFolders || !sharepointReachable
                }
                title={
                  foldersExist
                    ? 'Folders are set up — open them in SharePoint'
                    : sharepointReachable
                      ? 'Create this job’s SharePoint folders'
                      : 'SharePoint is unreachable'
                }
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-1 text-[11px] font-medium transition-colors disabled:opacity-50 ${
                  foldersExist
                    ? 'border-emerald-500/60 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-300'
                    : 'border-border bg-transparent text-muted-foreground hover:border-foreground/40 hover:text-foreground'
                }`}
              >
                {creatingFolders ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : foldersExist ? (
                  <FolderOpen className="h-3.5 w-3.5" />
                ) : (
                  <FolderPlus className="h-3.5 w-3.5" />
                )}
                <span>{creatingFolders ? 'Creating…' : foldersExist ? 'Folders' : 'Create folder set'}</span>
                {foldersExist && <CheckCircle2 className="h-3 w-3" />}
              </button>

              {/* The help mark. Tiny and nearly invisible until you go near it: it BRIGHTENS on hover
                  and the explanation appears with it — no click needed. Click still works, and it also
                  responds to keyboard focus, because a hover-only control does not exist for anyone
                  navigating by keyboard. */}
              <button
                type="button"
                data-testid="folder-help"
                aria-label="What is the folder set?"
                aria-expanded={showFolderHelp}
                onMouseEnter={() => setShowFolderHelp(true)}
                onMouseLeave={() => setShowFolderHelp(false)}
                onFocus={() => setShowFolderHelp(true)}
                onBlur={() => setShowFolderHelp(false)}
                onClick={() => setShowFolderHelp((v) => !v)}
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-border text-[9px] font-semibold leading-none text-muted-foreground transition-colors hover:border-foreground hover:bg-muted hover:text-foreground focus:border-foreground focus:text-foreground"
              >
                ?
              </button>
            </div>
          )}
        </div>
      </div>

      {/* The explanation, ON DEMAND. It is the same text the banner used to shout on every page load —
          it now appears only when the "?" is pressed, and it says what is TRUE right now rather than
          both states at once. */}
      {showFolderHelp && (
        <div
          data-testid="folder-help-box"
          role="note"
          className="mb-2 rounded-[9px] border border-border bg-muted/60 px-3 py-2 text-xs text-muted-foreground"
        >
          {foldersExist ? (
            <>
              This job’s five SharePoint folders exist. Filing a document into one of them copies it
              into the client’s real folder in SharePoint. <b>Folders</b> opens them.
            </>
          ) : (
            <>
              This job has no SharePoint folders yet, so there is nowhere to file a document — filing is
              disabled until you press <b>Create folder set</b>. Files can still be added below; they
              wait in the unsorted pile.
            </>
          )}
        </div>
      )}

      {/* ── PROGRESS — the point of the screen. ── */}
      <div className="flex items-center gap-3 px-1 py-2">
        {inbox.length === 0 ? (
          <span className="flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-green-700">
            <CheckCircle2 className="h-4 w-4" /> Everything is sorted
          </span>
        ) : (
          <span className="whitespace-nowrap text-sm text-foreground">
            <b>{inbox.length}</b> still to sort
          </span>
        )}
        <div className="h-1.5 flex-1 overflow-hidden rounded bg-muted">
          <div
            className="h-full bg-green-600 transition-all"
            style={{ width: total ? `${(filedCount / total) * 100}%` : '0%' }}
          />
        </div>
        {/* Said ONCE, here — NOT repeated as a paragraph in all five folders. Ben rejected that. */}
        {!sharepointReachable && (
          <span
            className="flex items-center gap-1 whitespace-nowrap text-[11px] text-muted-foreground"
            title="Filing still works — files are safe here and the copy is retried."
          >
            <CloudOff className="h-3 w-3" /> SharePoint not connected
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-[10px] border border-border lg:grid-cols-[1fr_380px]">
        {/* ── LEFT — the gallery. Shows Unsorted, or the folder you opened. ── */}
        <div className="flex flex-col gap-2 border-r border-border bg-card p-3">
          {/* Drop zone. It used to be an empty target that only printed "isn't wired up yet" — it now
              actually takes the file. Clicking it opens the OS file picker, because a drop target with
              no click fallback is unreachable by keyboard and unreachable by anything scripted. */}
          <div
            data-testid="drop-zone"
            role="button"
            tabIndex={0}
            aria-label="Add files to this job"
            aria-busy={uploading}
            onClick={() => !uploading && pickerRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!uploading) pickerRef.current?.click();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              // Tells the OS this is a COPY target. Without it macOS shows the "no entry" cursor and
              // the drop never fires — the drag looks refused even though the handler exists.
              e.dataTransfer.dropEffect = 'copy';
              setOverTarget('drop');
            }}
            onDragLeave={() => setOverTarget(null)}
            onDrop={(e) => {
              e.preventDefault();
              setOverTarget(null);
              // dataTransfer.files, NOT .items — .items is empty for an OS-level file drag in some
              // engines, and reading the wrong one silently yields zero files on a real drop.
              void takeFiles(Array.from(e.dataTransfer.files));
            }}
            className={`flex cursor-pointer flex-col items-center rounded-[9px] border-2 border-dashed py-4 text-center transition-colors ${
              overTarget === 'drop' ? 'border-blue-500 bg-blue-500/10' : 'border-border hover:border-blue-500/60'
            } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
          >
            <Upload className="h-4 w-4 text-muted-foreground" />
            <div className="text-xs text-foreground">
              {uploading ? 'Adding…' : 'Drop files here, or click to choose'}
            </div>
            <div className="text-[10px] text-muted-foreground">they land in the pile below, unsorted</div>
            <input
              ref={pickerRef}
              data-testid="file-picker"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                void takeFiles(Array.from(e.target.files ?? []));
                // Reset, or picking the SAME file twice in a row fires no change event the second time.
                e.target.value = '';
              }}
            />
          </div>

          {/* Title + the 1-up / 2-up / 3-up size switch. */}
          <div className="flex items-center justify-between">
            <span className="truncate text-sm font-semibold text-foreground">
              {view ?? 'Unsorted'}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                · {list.length} file{list.length === 1 ? '' : 's'}
              </span>
              {view && (
                <button
                  data-testid="back-to-unsorted-link"
                  onClick={() => setView(null)}
                  className="ml-2 rounded border border-border px-1.5 py-0.5 text-[11px] font-normal text-blue-600 dark:text-blue-400 hover:bg-muted"
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
                    gsize === n ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted'
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
              <div className="flex flex-col items-center gap-1 rounded-md border border-border bg-muted/40 py-12 text-center">
                {view ? (
                  <>
                    <div className="text-sm font-semibold text-foreground">This folder is empty</div>
                    <div className="text-xs text-muted-foreground">
                      Drag a file onto it, or pick it from a file's dropdown.
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                    <div className="text-sm font-semibold text-foreground">Everything is sorted</div>
                    <div className="text-xs text-muted-foreground">Every file the client sent is now in a folder.</div>
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
                      draggable={!!doc.id && canFile}
                      onDragStart={() => setDragDoc(doc)}
                      onDragEnd={() => {
                        setDragDoc(null);
                        setOverTarget(null);
                      }}
                      className={`flex flex-col overflow-hidden rounded-[9px] border bg-card transition-opacity ${
                        amber ? 'border-amber-500/60' : 'border-border'
                      } ${dragDoc?.id === doc.id ? 'opacity-40' : ''} ${busyId === doc.id ? 'opacity-50' : ''}`}
                    >
                      <button
                        type="button"
                        data-testid="thumb-open"
                        onClick={() => setPreviewIdx(i)}
                        className={`relative flex items-center justify-center overflow-hidden bg-muted ${
                          gsize === 1 ? 'h-[260px]' : gsize === 2 ? 'h-[150px]' : 'h-[104px]'
                        }`}
                        title="Open"
                      >
                        <Art doc={doc} big />
                        {amber && (
                          <span
                            data-testid="amber-mark"
                            title="Filed here. The copy to SharePoint has not landed — the file is safe."
                            className="absolute right-1 top-1 flex items-center gap-1 rounded bg-amber-50 px-1 py-0.5 text-[9px] font-semibold text-amber-600 dark:text-amber-400"
                          >
                            <CloudOff className="h-2.5 w-2.5" /> SharePoint failed
                          </span>
                        )}
                      </button>
                      <div className="flex flex-col gap-1 p-1.5">
                        {/* No file-size line — Ben cut it; it wasted a row on every card. */}
                        <div className="truncate text-[11px] text-foreground" title={doc.name}>
                          {doc.name}
                        </div>
                        {doc.sharepointOnly ? (
                          <span className="text-[10px] text-blue-600">in SharePoint</span>
                        ) : (
                          <MoveSelect
                            doc={doc}
                            onMove={(f) => void move(doc, f)}
                            onUnfile={() => void putBack(doc)}
                            disabled={busyId === doc.id || !canFile}
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
        <div className="flex flex-col bg-slate-200 p-3 dark:bg-slate-800" data-testid="folder-well">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-sm font-semibold text-foreground">Job Folders</span>
            <span className="text-[10px] text-muted-foreground">drag a file onto one · click to look inside</span>
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
                  className={`shrink-0 cursor-pointer rounded-lg border-[1.5px] bg-card p-3 shadow dark:shadow-none transition-all ${
                    over
                      ? 'scale-[1.01] border-dashed border-green-500 bg-green-50'
                      : flash === folder
                        ? 'border-green-500 ring-4 ring-green-500/30'
                        : on
                          ? 'border-blue-500 ring-2 ring-blue-500/30'
                          : 'border-slate-300 dark:border-white/20 hover:border-slate-400 dark:hover:border-white/30'
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="truncate text-[11px] font-semibold text-foreground" title={folder}>
                      {folder}
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground">
                      {items.length ? `${items.length} file${items.length === 1 ? '' : 's'}` : '—'}
                      {bad > 0 && (
                        <span
                          className="flex items-center gap-0.5 font-semibold text-amber-600 dark:text-amber-400"
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
                            className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[5px] border border-slate-300 bg-slate-100 dark:border-white/20 dark:bg-white/5"
                            title={f.name}
                          >
                            <Art doc={f} big={false} />
                            {isAmber(f) && (
                              <span className="absolute right-0.5 top-0.5 rounded bg-amber-600 px-1 text-[8px] font-bold text-white">
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
                            className="flex aspect-[4/3] items-center justify-center rounded bg-muted/40 text-[11px] font-semibold text-muted-foreground"
                          >
                            +{rest}
                          </div>
                        );
                      }
                      return (
                        <div
                          key={`hole-${k}`}
                          data-testid="empty-slot"
                          className="flex aspect-[4/3] items-center justify-center rounded-[5px] border border-slate-200 bg-slate-100 text-[10px] font-semibold text-muted-foreground dark:border-white/10 dark:bg-white/5"
                        >
                          {k + 1}
                        </div>
                      );
                    })}
                  </div>

                  {/* ONE short line per empty folder. NOT a paragraph, and not five times over. */}
                  {items.length === 0 && (
                    <div className="mt-2 text-[11px] text-muted-foreground">Empty — drag a file here</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── PREVIEW — full-screen, in-app. No download, no external tab. Reuses the report builder's
          window with the crop/rotate/adjust rail switched off.

          imageUrlOverride is passed for EVERY file we hold bytes for, not just pictures. Gating it
          on IMAGE_TYPES sent non-images down the modal's OWN default URL builder, which addresses
          the image-configurator's buckets — so a PDF that really exists in `job-files` resolved to a
          404 in `appraisal-raw` and drew as a broken image. We say WHERE the file lives; the modal
          decides HOW to draw it. ── */}
      {preview && (
        <ImageEditorModal
          image={toJobImage(preview)}
          isOpen
          viewOnly
          imageUrlOverride={preview.storagePath ? publicUrl(preview.storagePath) : null}
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
                    disabled={!canFile}
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
