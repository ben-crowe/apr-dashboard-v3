import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DetailJob, JobDetails } from "@/types/job";
import {
  FileText, Mail, MonitorCheck, ArrowRight, ArrowLeft, ChevronDown, ChevronUp, ChevronRight, ChevronLeft,
  Pencil, X, Layers, LayoutGrid, Download, Loader2, Eye, RotateCcw, Plus, Columns, HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import DocumentPreviewPane from './DocumentPreviewPane';
import DocumentFieldsEditor from './DocumentFieldsEditor';
import { downloadPagedPdf } from '@/utils/loe/downloadPagedPdf';
import { generateLOEHTML } from '@/utils/loe/generateLOE';
import { loadAllTemplates, LOETemplate } from '@/utils/loe/saveTemplate';
import { saveJobContract } from '@/utils/loe/jobContracts';
import { loadAllEmailTemplates, resolveEditTimeTokens, saveEmailTemplate, EMAIL_MERGE_TOKENS, EMAIL_SEED_SUBJECT, EMAIL_SEED_BODY, EmailTemplate } from '@/utils/loe/emailTemplate';
import { loadAllPopupTemplates, loadActivePopupTemplate, resolvePopupTokens, savePopupTemplate, POPUP_MERGE_TOKENS, POPUP_SEED_BODY, PopupTemplate } from '@/utils/loe/popupTemplate';

/**
 * ComponentStudio — the Document/Email/Popup library + sequence map + split previewer/editor
 * (SPEC-component-studio). A SHELL that arranges the proven components; it does NOT rebuild them:
 *   - Document renders through the SHARED DocumentPreviewPane + generateLOEHTML + downloadPagedPdf
 *     (the exact path the existing LOEPreviewModal uses — INV-0, no new render engine).
 *   - Email renders the managed email's body (edit-time tokens resolved).
 *   - Popup renders the managed popup's body (sign-time tokens resolved).
 * Deep EDIT delegates to the existing modal editors via the onEdit* callbacks (full reuse):
 *   document → LOEPreviewModal, email → EmailComposeModal, popup → PopupComposeModal.
 *
 * Interaction rules (locked with Ben against the reviewed mockup):
 *   - LIBRARY entry → the library rail STAYS; component opens on the right (no spine).
 *   - SEQUENCE-block entry → rail collapses to icons, the sequence SPINE takes the left.
 *   - Split is render-LEFT / editor-RIGHT, render-dominant (¾:¼), chevron→half, drag grabber, render zoom.
 */
type CompType = 'doc' | 'mail' | 'popup';
// 'home' is where the studio opens: a short explanation of the area. Landing straight on a
// sequence map gave no answer to "what is this screen".
type View = 'home' | 'map' | 'seq' | 'lib';

interface StudioInstance { id: string; name: string; }

interface ComponentStudioProps {
  isOpen: boolean;
  onClose: () => void;
  job: DetailJob;
  jobDetails: JobDetails;
  /** Deep-edit delegates to the existing proven modal editors (reuse — no rebuild). */
  onEditDocument?: (template: LOETemplate) => void;
  onEditEmail?: (template: EmailTemplate) => void;
  onEditPopup?: (template: PopupTemplate) => void;
}

const TYPE_META: Record<CompType, { label: string; icon: React.ReactNode; accent: string; dot: string }> = {
  mail:  { label: 'Email',    icon: <Mail className="h-3.5 w-3.5" />,        accent: 'border-t-cyan-700',  dot: 'bg-cyan-700' },
  doc:   { label: 'Document', icon: <FileText className="h-3.5 w-3.5" />,    accent: 'border-t-[#2c5aa0]', dot: 'bg-[#2c5aa0]' },
  popup: { label: 'Popup',    icon: <MonitorCheck className="h-3.5 w-3.5" />, accent: 'border-t-emerald-600', dot: 'bg-emerald-600' },
};
const ORDER: CompType[] = ['mail', 'doc', 'popup'];
const CONN: Record<string, string> = { mail: 'delivers', doc: 'after signing' };

/**
 * The sequences. Only the first is wired to real work; the other two are here so that "sequence"
 * reads as a category rather than as one thing with a name.
 *
 * They are made of component TYPES, not of their own copies — each part resolves to the same
 * component that sits in the library below, which is the whole point of the arrangement. That is
 * also why the extra sequences invent no components: a made-up component would appear in the
 * library as a real one.
 */
interface Sequence { id: string; name: string; parts: CompType[] }
const SEQUENCES: Sequence[] = [
  { id: 'loe',      name: 'LOE Deployment', parts: ['mail', 'doc', 'popup'] },
  { id: 'reminder', name: 'Unsigned LOE Reminder',  parts: ['mail', 'doc'] },
  { id: 'delivery', name: 'Report Delivery',        parts: ['mail', 'doc', 'popup'] },
];

const ComponentStudio: React.FC<ComponentStudioProps> = ({
  isOpen, onClose, job, jobDetails, onEditDocument, onEditEmail, onEditPopup,
}) => {
  const [view, setView] = useState<View>('home');
  const [itemType, setItemType] = useState<CompType>('doc');
  const [selectedId, setSelectedId] = useState<string>('');
  // Reading is the default job: a component opens as a FULL-WIDTH render with no editor.
  // Edit is opt-in via the Edit button in the panel bar; only then does a layout choice exist.
  const [mode, setMode] = useState<'read' | 'edit'>('read');
  const [editLayout, setEditLayout] = useState<'split' | 'editor'>('split'); // split is an even 50/50
  const [screenZoom, setScreenZoom] = useState(100); // zoom for email/popup render (doc uses the pane's own)
  const [spineW, setSpineW] = useState(312);          // sequence-spine width (drag to resize)
  const [railCollapsed, setRailCollapsed] = useState(false); // explorer rail collapsed to icons
  const [seqId, setSeqId] = useState<string>('loe');                       // which sequence the map shows
  const [seqOpen, setSeqOpen] = useState<Record<string, boolean>>({});     // which names are expanded in the rail
  const currentSeq = SEQUENCES.find(s => s.id === seqId) ?? SEQUENCES[0];
  const [spineCollapsed, setSpineCollapsed] = useState(false); // collapse the spine to an icon strip

  const [docTemplates, setDocTemplates] = useState<LOETemplate[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [popupTemplates, setPopupTemplates] = useState<PopupTemplate[]>([]);
  const [open, setOpen] = useState<Record<CompType, boolean>>({ doc: true, mail: true, popup: true });

  const [docHtml, setDocHtml] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Clicking a module on the sequence map opens a floating preview UNDER the module row, rather
  // than replacing the whole view — the modules stay visible so you keep your place.
  const [previewType, setPreviewType] = useState<CompType | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  // The preview is centred on the MODULE ROW, not on the canvas. The canvas carries padding and
  // sits to the right of the library rail, so centring on it pushes the panel visibly right of
  // the modules it belongs to. Measured from the row rather than assumed, because the row's width
  // changes with the rail and with how many modules there are.
  const rowRef = useRef<HTMLDivElement>(null);
  const [previewBox, setPreviewBox] = useState<{ left: number; width: number; top: number } | null>(null);

  const splitRef = useRef<HTMLDivElement>(null);

  // Load the three libraries on open.
  useEffect(() => {
    if (!isOpen) return;
    loadAllTemplates().then(setDocTemplates).catch(() => setDocTemplates([]));
    loadAllEmailTemplates().then(ts => setEmailTemplates(ts.filter(t => t.channel === 'email'))).catch(() => setEmailTemplates([]));
    // Popups: self-heal — if the table has no rows yet, seed the default Thank-You so the
    // Popup component is always present (loadActivePopupTemplate seeds; loadAll just lists).
    loadAllPopupTemplates().then(async ps => {
      if (ps.length === 0) { await loadActivePopupTemplate(); ps = await loadAllPopupTemplates(); }
      setPopupTemplates(ps);
    }).catch(() => setPopupTemplates([]));
    setView('home');
  }, [isOpen]);

  // Add a new component instance (email/popup) from its seed, then open it.
  const addNew = async (t: CompType) => {
    if (t === 'popup') {
      const res = await savePopupTemplate({ name: 'New popup', body_html: POPUP_SEED_BODY });
      if (res.success && res.id) { setPopupTemplates(await loadAllPopupTemplates()); openLib('popup', res.id); }
      else toast.error('Could not add popup');
    } else if (t === 'mail') {
      const res = await saveEmailTemplate({ name: 'New email', subject: EMAIL_SEED_SUBJECT, body_html: EMAIL_SEED_BODY, channel: 'email' });
      if (res.success && res.id) { setEmailTemplates((await loadAllEmailTemplates()).filter(x => x.channel === 'email')); openLib('mail', res.id); }
      else toast.error('Could not add email');
    }
  };

  const listFor = (t: CompType): StudioInstance[] =>
    t === 'doc' ? docTemplates.map(d => ({ id: d.id, name: d.name }))
    : t === 'mail' ? emailTemplates.map(e => ({ id: e.id, name: e.name }))
    : popupTemplates.map(p => ({ id: p.id, name: p.name }));

  const defaultIdFor = (t: CompType): string => {
    if (t === 'doc') return (docTemplates.find(d => d.is_default) ?? docTemplates[0])?.id ?? '';
    if (t === 'mail') return (emailTemplates.find(e => e.is_default) ?? emailTemplates[0])?.id ?? '';
    return (popupTemplates.find(p => p.is_active) ?? popupTemplates[0])?.id ?? '';
  };
  const nameFor = (t: CompType, id: string): string => listFor(t).find(i => i.id === id)?.name ?? TYPE_META[t].label;

  const tokenCtx = {
    firstName: job.clientFirstName || '', lastName: job.clientLastName || '',
    jobNumber: jobDetails.jobNumber || '', propertyAddress: job.propertyAddress || '',
    clientName: `${job.clientFirstName ?? ''} ${job.clientLastName ?? ''}`.trim(),
  };

  // Generate the document render through the SHARED engine when a doc is selected.
  useEffect(() => {
    let cancelled = false;
    if ((view === 'seq' || view === 'lib' || previewType === 'doc') && itemType === 'doc' && selectedId) {
      const tpl = docTemplates.find(d => d.id === selectedId);
      if (!tpl) return;
      setIsGenerating(true);
      generateLOEHTML(job, jobDetails, tpl.template_html, tpl.id, (tpl as any).version)
        .then(html => { if (!cancelled) setDocHtml(html); })
        .catch(() => { if (!cancelled) setDocHtml(''); })
        .finally(() => { if (!cancelled) setIsGenerating(false); });
    }
    return () => { cancelled = true; };
  }, [view, itemType, selectedId, docTemplates, job, jobDetails, previewType]);

  // Inline editor (email + popup) — the SAME editable-surface mechanism the existing modal
  // editors use (a designMode document seeded with the managed body). Reused inline here.
  const editIframeRef = useRef<HTMLIFrameElement>(null);
  const editableBody = (): string =>
    itemType === 'mail' ? (emailTemplates.find(e => e.id === selectedId)?.body_html ?? '')
    : itemType === 'popup' ? (popupTemplates.find(p => p.id === selectedId)?.body_html ?? '')
    : docHtml;

  // The editor scales its page to fit the pane, the way the render side does — a document is
  // authored at ~850px and the editor pane is narrower than that, so at natural width the right
  // edge of every line was cut off. `zoom` (not `transform: scale`) because zoom re-lays-out the
  // page, so the caret and click targets stay where the text is drawn; a transform moves the
  // pixels out from under them and typing lands in the wrong place.
  // editorZoom null = follow the fit; a number = the user overrode it with the zoom strip.
  const [editorZoom, setEditorZoom] = useState<number | null>(null);
  const [editorFit, setEditorFit] = useState(100);
  const editorZoomPct = editorZoom ?? editorFit;

  const applyEditorZoom = (pct: number) => {
    const doc = editIframeRef.current?.contentDocument;
    doc?.body?.style.setProperty('zoom', String(pct / 100));
  };

  // Measure at zoom 1, then fit. Called after every write and on any pane resize.
  const measureEditorFit = () => {
    const frame = editIframeRef.current;
    const doc = frame?.contentDocument;
    if (!frame || !doc?.body) return;
    doc.body.style.setProperty('zoom', '1');
    const natural = Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth);
    const available = frame.clientWidth;
    const pct = natural > available && natural > 0
      ? Math.max(25, Math.floor((available / natural) * 100))
      : 100;
    setEditorFit(pct);
    doc.body.style.setProperty('zoom', String((editorZoom ?? pct) / 100));
  };

  useEffect(() => {
    if (view === 'map') return;
    const doc = editIframeRef.current?.contentDocument;
    if (!doc) return;
    const body = (editableBody() || '<p></p>').replace(/<script[\s\S]*?<\/script>/gi, '');
    doc.open(); doc.write(body); doc.close(); doc.designMode = 'on';
    setEditorZoom(null);          // a freshly loaded component starts fitted
    measureEditorFit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, itemType, selectedId, mode, editLayout, emailTemplates, popupTemplates, docHtml]);

  // Refit when the pane changes width — the Split/Editor toggle and the drag grabber both do that.
  useEffect(() => {
    const frame = editIframeRef.current;
    if (!frame || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => measureEditorFit());
    ro.observe(frame);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, mode, editLayout]);

  useEffect(() => { applyEditorZoom(editorZoomPct); }, [editorZoomPct]);

  const insertToken = (token: string) => {
    const doc = editIframeRef.current?.contentDocument;
    if (!doc) return;
    (doc.body as HTMLElement | null)?.focus();
    if (!doc.execCommand('insertText', false, token) && doc.body) doc.body.append(token);
  };

  const handleSaveInline = async () => {
    if (itemType === 'doc') {
      // The fields editor keeps `docHtml` reconstructed live as the user types (its onChange),
      // so the save body IS the current docHtml — no iframe read needed. Same save path the
      // previewer's Edit Document uses: a tailored draft on this job, not the managed template.
      const tpl = docTemplates.find(d => d.id === selectedId);
      const client = job.clientLastName || job.clientFirstName || 'Client';
      const monthDay = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const name = `${tpl?.name || 'Document'} — ${client} — ${monthDay}`;
      const res = await saveJobContract({ jobId: job.id, name, editedHtml: docHtml, templateId: selectedId || null, templateVersion: (tpl as any)?.version ?? null, contractType: tpl?.name ?? null, state: 'draft' });
      if (res.success) toast.success('Saved as draft'); else toast.error(`Save failed: ${res.error}`);
      return;
    }
    const doc = editIframeRef.current?.contentDocument;
    if (!doc) return;
    const body = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
    if (itemType === 'popup') {
      const tpl = popupTemplates.find(p => p.id === selectedId);
      const res = await savePopupTemplate({ id: selectedId || undefined, name: tpl?.name ?? 'Thank-You', body_html: body, setActive: tpl?.is_active ?? false });
      if (res.success) { toast.success('Saved'); loadAllPopupTemplates().then(setPopupTemplates); } else toast.error(`Save failed: ${res.error}`);
    } else if (itemType === 'mail') {
      const tpl = emailTemplates.find(e => e.id === selectedId);
      if (!tpl) return;
      const res = await saveEmailTemplate({ id: tpl.id, name: tpl.name, subject: tpl.subject, body_html: body, channel: 'email' });
      if (res.success) { toast.success('Saved'); loadAllEmailTemplates().then(ts => setEmailTemplates(ts.filter(t => t.channel === 'email'))); } else toast.error(`Save failed: ${res.error}`);
    }
  };

  const mergeTokens = itemType === 'mail' ? EMAIL_MERGE_TOKENS : POPUP_MERGE_TOKENS;

  // Open the floating preview on a module, or slide it to a neighbour if one is already open.
  const openPreview = (t: CompType) => {
    setItemType(t);
    setSelectedId(defaultIdFor(t));
    setPreviewType(t);
  };

  // Render the sequence's document ONCE when the map opens, so opening its preview is immediate
  // rather than showing a spinner. This existed to serve the hover preview; hover is gone, and it
  // earns its place on its own — one call on arriving at the map, none on opening.
  useEffect(() => {
    if (view !== 'map' || docHtml || !docTemplates.length) return;
    const id = defaultIdFor('doc');
    const tpl = docTemplates.find(d => d.id === id);
    if (!tpl) return;
    let cancelled = false;
    generateLOEHTML(job, jobDetails, tpl.template_html, tpl.id, (tpl as any).version)
      .then(html => { if (!cancelled) setDocHtml(html); })
      .catch(() => {});
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, docTemplates]);

  // Place the preview under the module row, horizontally TRACKING whichever module is showing.
  // A panel that never moves while its contents swap gives no clue which module you are looking
  // at — the slide is the signal. First module: left edges align. Last: right edges align.
  // Anything between: centred under its own card. Works for a sequence of any length.
  const shownType = previewType;
  // Motion only when sliding from one module to another. Opening must be instant: the panel was
  // animating from wherever it last sat, which reads as it flying in from the side.
  const prevShown = useRef<CompType | null>(null);
  const [slide, setSlide] = useState(false);
  useEffect(() => {
    const row = rowRef.current;
    if (view !== 'map' || !row) { setPreviewBox(null); return; }
    const measure = () => {
      const r = rowRef.current;
      const canvas = r?.offsetParent as HTMLElement | null;
      if (!r || !canvas) return;
      // Measure against the CARDS, not the row element. The row is a full-width flex container,
      // so its centre is the canvas centre, well right of the cards themselves.
      const cards = [...r.querySelectorAll('[data-module-card]')] as HTMLElement[];
      if (!cards.length) return;
      const rects = cards.map(c => c.getBoundingClientRect());
      const box = canvas.getBoundingClientRect();
      const cardsLeft = Math.min(...rects.map(x => x.left));
      const cardsRight = Math.max(...rects.map(x => x.right));
      const width = Math.round((cardsRight - cardsLeft) * 0.6);

      const idx = shownType ? cards.findIndex(c => c.getAttribute('data-module-card') === shownType) : -1;
      let leftPx: number;
      if (idx <= 0 && idx !== -1) {
        leftPx = rects[0].left;                                   // first module: left edges align
      } else if (idx === cards.length - 1 && idx !== -1) {
        leftPx = rects[idx].right - width;                        // last module: right edges align
      } else if (idx > 0) {
        const c = rects[idx];
        leftPx = c.left + (c.width - width) / 2;                  // middle: centred under its card
      } else {
        leftPx = cardsLeft + (cardsRight - cardsLeft - width) / 2; // nothing shown: centred on the row
      }
      // Never let it run outside the cards' own span.
      leftPx = Math.min(Math.max(leftPx, cardsLeft), cardsRight - width);

      setPreviewBox({
        left: Math.round(leftPx - box.left + canvas.scrollLeft),
        width,
        top: Math.round(Math.max(...rects.map(x => x.bottom)) - box.top + canvas.scrollTop + 12),
      });
    };
    setSlide(prevShown.current !== null && shownType !== null);
    prevShown.current = shownType;
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(row);
    return () => ro.disconnect();
  }, [view, shownType, currentSeq]);

  // Click anywhere outside closes it — EXCEPT on another module card, which slides the preview
  // to that module instead (the card's own click handler runs and re-opens it).
  useEffect(() => {
    if (!previewType) return;
    const onDown = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      if (previewRef.current?.contains(el)) return;
      if (el.closest('[data-module-card]')) return;
      setPreviewType(null);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [previewType]);

  // ── open paths ────────────────────────────────────────────────────────────
  const openSeq = (t: CompType, m: 'read' | 'edit' = 'read') => { setItemType(t); setSelectedId(defaultIdFor(t)); setMode(m); setEditLayout('split'); setView('seq'); };
  const openLib = (t: CompType, id: string) => { setItemType(t); setSelectedId(id); setView('lib'); setMode('read'); setEditLayout('split'); };

  // ONE edit destination per component: its group area under the library (Emails / Documents /
  // Popups). Every Edit route lands here — the explorer group, the Edit on a module card, and the
  // Edit inside the floating module preview — so there is never a second place a component is
  // edited depending on how you arrived.
  const openEdit = (t: CompType, id?: string) => {
    setPreviewType(null);
    setItemType(t);
    setSelectedId(id ?? defaultIdFor(t));
    setView('lib');
    setMode('edit');
    setEditLayout('split');
  };
  const closePanel = () => setView('map');

  // NOTE: the old bounce-out to TemplateEditorModal (a floating full-screen layer over the
  // studio, on an empty background — the broken-looking state Ben screenshotted) is gone.
  // Editing a document now stays inside the studio via the Fields panel above; there is no
  // remaining code path that opens TemplateEditorModal layered over the studio.

  const handleDownload = () => {
    if (itemType === 'doc' && docHtml) {
      const ok = downloadPagedPdf(docHtml, `LOE-${job.clientLastName || 'Client'}-${jobDetails.jobNumber || 'DRAFT'}`);
      if (!ok) toast.error('Please allow pop-ups to download the PDF');
    }
  };

  // ── render of the selected component (left pane) ──────────────────────────
  const renderLeft = () => {
    const kind = itemType;
    if (kind === 'doc') {
      if (isGenerating && !docHtml) {
        return <div className="flex-1 flex items-center justify-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Rendering document…</div>;
      }
      // Document = the SHARED previewer pane (paper page on the viewer, zoom + paged path).
      return <DocumentPreviewPane html={docHtml} />;
    }
    // Email + Popup = screen content → a page view scaled to fit its box.
    const id = selectedId;
    const html = kind === 'mail'
      ? resolveEditTimeTokens(emailTemplates.find(e => e.id === id)?.body_html ?? '', tokenCtx)
      : resolvePopupTokens(popupTemplates.find(p => p.id === id)?.body_html ?? '', tokenCtx);
    return <ScreenPreview html={html} kind={kind} />;
  };

  /**
   * The mock browser page — traffic dots, address strip, white page. ONE definition, used by every
   * component that represents a web page: the email today, the popup on top of it, and anything
   * website-shaped added later. Two copies of this would drift, and the frame is what makes a
   * preview read as a real page rather than a floating fragment.
   */
  const PageFrame: React.FC<{ width: number; height: number; scale: number; children: React.ReactNode }> =
    ({ width, height, scale, children }) => (
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden"
           style={{
             width, height, transform: `scale(${scale})`, transformOrigin: 'top left',
             // Lifts the page off its backdrop — cast below and to both sides, not just down.
             boxShadow: '0 18px 40px -12px rgba(15,23,42,0.45), 0 6px 18px -8px rgba(15,23,42,0.30)',
           }}>
        <div className="h-8 bg-slate-100 border-b border-slate-200 flex items-center gap-1.5 px-3">
          <span className="w-2.5 h-2.5 rounded-full bg-red-300" /><span className="w-2.5 h-2.5 rounded-full bg-yellow-300" /><span className="w-2.5 h-2.5 rounded-full bg-green-300" />
          <span className="ml-2 flex-1 h-4 bg-white border border-slate-200 rounded" />
        </div>
        {children}
      </div>
    );

  // The screen preview for an email or a popup: a fixed-size viewing box with the whole thing
  // scaled to fit inside it, height as well as width.
  //
  // It used to be a fixed 640-tall frame in a scrolling box, with CSS `zoom` on an ancestor as the
  // control. Two separate faults. The box grew past the panel so the mock browser frame was cut off
  // at the bottom, and `zoom` on an ancestor of an iframe resizes the frame's BOX while the document
  // inside re-lays out to the new size — so the readout said 45% while the text stayed the same
  // size. A transform is what actually scales what is drawn, and that is what is used now.
  const ScreenPreview: React.FC<{ html: string; kind: CompType }> = ({ html, kind }) => {
    const boxRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<HTMLIFrameElement>(null);
    const [box, setBox] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
    const CHROME_H = 32;                                        // the mock browser bar
    // The content's REAL height, measured after it loads. Fitting against an assumed height was
    // the defect: a 640 guess fits the FRAME while taller content keeps running past the bottom.
    const [contentH, setContentH] = useState(kind === 'popup' ? 240 : 640);
    // THE PAGE IS THE SAME FOR EVERY COMPONENT TYPE — same width, same height, same proportions.
    // Only what sits ON it changes. Giving the popup a shorter page made it read as a phone
    // rather than the desktop browser the email shows, which is the opposite of the point.
    const PAGE_W = 680, PAGE_H = 640;
    // The one case the page grows: an email taller than the standard page, because the whole
    // email has to be visible. The popup's page is never anything but the standard.
    const pageH = kind === 'popup' ? PAGE_H : Math.max(contentH, PAGE_H);
    const INTRINSIC_W = PAGE_W;
    const measureContent = () => {
      const doc = frameRef.current?.contentDocument;
      if (!doc?.documentElement) return;
      setContentH(Math.max(doc.documentElement.scrollHeight, doc.body?.scrollHeight ?? 0, 120));
    };
    const INTRINSIC_H = pageH + CHROME_H;

    useEffect(() => {
      const el = boxRef.current;
      if (!el) return;
      // clientWidth/Height INCLUDE the box's own padding, and the scaled screen sits inside that
      // padding — so fitting against the raw numbers overshoots by the padding and clips.
      const measure = () => {
        const cs = getComputedStyle(el);
        const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
        const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
        setBox({ w: Math.max(0, el.clientWidth - padX), h: Math.max(0, el.clientHeight - padY) });
      };
      measure();
      if (typeof ResizeObserver === 'undefined') return;
      const ro = new ResizeObserver(measure); ro.observe(el);
      return () => ro.disconnect();
    }, []);

    // TWO SEPARATE SCALES, and keeping them separate is the point.
    //   pageScale  — fits the whole page into the box. Set by the box, never by the user.
    //   contentZoom — the user's control. It magnifies what is ON the page.
    // They were one number before, so the zoom control resized the page itself: the stage moved
    // when it should have held still and only the writing on it should have changed size.
    const pageScale = box.w && box.h
      ? Math.min(box.w / INTRINSIC_W, box.h / INTRINSIC_H)
      : 1;
    const contentZoom = screenZoom / 100;

    return (
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-end px-4 pt-1">
          <div className="flex items-center gap-0.5 text-muted-foreground">
            <Button variant="ghost" size="sm" onClick={() => setScreenZoom(z => Math.max(25, z - 10))} className="h-5 w-5 p-0 hover:text-foreground" title="Zoom Out"><ChevronDown className="h-3.5 w-3.5" /></Button>
            {/* Shows what is ACTUALLY applied, not a setting that the render ignores. */}
            <span className="text-[11px] tabular-nums w-9 text-center select-none">{Math.round(contentZoom * 100)}%</span>
            <Button variant="ghost" size="sm" onClick={() => setScreenZoom(z => Math.min(300, z + 10))} className="h-5 w-5 p-0 hover:text-foreground" title="Zoom In"><ChevronUp className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="sm" onClick={() => setScreenZoom(100)} className="h-5 w-5 p-0 hover:text-foreground ml-2" title="Fit whole screen"><RotateCcw className="h-3 w-3" /></Button>
          </div>
        </div>
        {/* Fixed box. It does not grow with content — content is scaled to it. */}
        <div ref={boxRef} className="flex-1 min-h-0 overflow-auto bg-slate-100 p-4">
          <div style={{ width: INTRINSIC_W * pageScale, height: INTRINSIC_H * pageScale, margin: '0 auto' }}>
            <PageFrame width={INTRINSIC_W} height={INTRINSIC_H} scale={pageScale}>
              {/* ONE code path for every page-shaped component. The popup's own HTML already IS
                  a full web page — its own header, footer and a modest centred card — so it
                  renders at full page width exactly like the email. Squeezing that page into a
                  narrow column was what turned it into a phone layout: the page reflowed to its
                  mobile breakpoint. Nothing about a component type changes the page. */}
              <div className="overflow-hidden bg-white" style={{ width: PAGE_W, height: pageH }}>
                <iframe ref={frameRef} srcDoc={html} onLoad={measureContent}
                        title={`${TYPE_META[kind].label} preview`} sandbox="allow-same-origin"
                        className="bg-white"
                        style={{ border: 'none', width: PAGE_W, height: pageH,
                                 transform: `scale(${contentZoom})`, transformOrigin: 'top center' }} />
              </div>
            </PageFrame>
          </div>
        </div>
      </div>
    );
  };

  // ── library rail ──────────────────────────────────────────────────────────
  // Narrow presentation is used both when the user collapses the rail and when the parked
  // sequence view takes the left side.
  const railNarrow = railCollapsed || view === 'seq';
  const Rail = () => (
    <aside className="flex-none bg-card border-r flex flex-col overflow-hidden transition-[width]"
           style={{ width: railNarrow ? 54 : 228 }}>
      {/* Collapse control. The rail had none — only the parked sequence list did — so there was no
          way to give the canvas the width back. Collapses to an icon strip rather than hiding
          entirely, which is what this component already does elsewhere and keeps the reopen
          control in place instead of needing a new one somewhere else. */}
      <div className={`flex items-center ${railCollapsed ? 'justify-center' : 'justify-end'} px-2 pt-2`}>
        <button onClick={() => setRailCollapsed(c => !c)} title={railCollapsed ? 'Expand explorer' : 'Collapse explorer'}
          className="h-6 w-6 flex items-center justify-center rounded-md border bg-card text-muted-foreground hover:text-[#2c5aa0] hover:border-[#2c5aa0]">
          {railCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>
      {/* Content scrolls; the help entry at the foot of the rail does not — see below. */}
      <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="p-3.5 pb-2">
        <div className={`flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-muted-foreground mb-2 ${railNarrow ? 'justify-center' : ''}`}>
          <Layers className="h-3 w-3" />{!railNarrow && 'Sequences'}
        </div>
        {SEQUENCES.map(s => {
          const current = seqId === s.id && view === 'map';
          return (
            <div key={s.id} className="mb-0.5">
              <div className={`flex items-center gap-2 px-2.5 py-2 rounded-lg ${current ? 'bg-[#2c5aa0]/10 ring-1 ring-[#2c5aa0]/30' : 'hover:bg-muted'} ${railNarrow ? 'justify-center' : ''}`} title={s.name}>
                {/* The chevron only expands the list of parts. The NAME is what opens the sequence. */}
                <button type="button" onClick={() => setSeqOpen(o => ({ ...o, [s.id]: !o[s.id] }))}
                        title={seqOpen[s.id] ? 'Hide parts' : 'Show parts'} className="flex-none text-[#2c5aa0] dark:text-blue-300">
                  <ChevronRight className={`h-4 w-4 transition-transform ${seqOpen[s.id] ? 'rotate-90' : ''}`} />
                </button>
                {!railNarrow && (
                  <>
                    <span className="flex-1 font-semibold text-sm truncate text-foreground cursor-pointer" onClick={() => { setSeqId(s.id); setView('map'); }}>{s.name}</span>
                  </>
                )}
              </div>
              {/* Parts list: a quick read of what the sequence is made of. Deliberately INERT —
                  no click handler and no hover styling, so nothing promises an interaction. */}
              {!railNarrow && seqOpen[s.id] && (
                <div className="pl-[30px] py-0.5">
                  {s.parts.map((p, i) => (
                    <div key={`${p}-${i}`} className="flex items-center gap-2 px-2.5 py-1 text-[12.5px] text-muted-foreground select-none">
                      <span className={`w-1.5 h-1.5 rounded-full flex-none ${TYPE_META[p].dot}`} />
                      <span className="flex-1 truncate">{nameFor(p, defaultIdFor(p))}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="p-3.5 pt-3 border-t">
        <div className={`flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-muted-foreground mb-2 ${railNarrow ? 'justify-center' : ''}`}>
          <LayoutGrid className="h-3 w-3" />{!railNarrow && 'Component Library'}
        </div>
        {ORDER.map(t => (
          <div key={t} className="mb-1">
            <div className={`flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-muted font-semibold ${railNarrow ? 'justify-center' : ''}`}
                 onClick={() => !railNarrow && setOpen(o => ({ ...o, [t]: !o[t] }))} title={TYPE_META[t].label + 's'}>
              <span className={t === 'doc' ? 'text-[#2c5aa0]' : t === 'mail' ? 'text-cyan-700' : 'text-emerald-600'}>{TYPE_META[t].icon}</span>
              {!railNarrow && <>{TYPE_META[t].label}s<span className="ml-auto text-[11px] text-muted-foreground bg-muted rounded-full px-2">{listFor(t).length}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open[t] ? '' : '-rotate-90'}`} /></>}
            </div>
            {!railNarrow && open[t] && (
              <div className="pl-[30px] py-0.5">
                {listFor(t).map(inst => (
                  <div key={inst.id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-muted text-[13px]" onClick={() => openLib(t, inst.id)}>
                    <span className={`w-1.5 h-1.5 rounded-full flex-none ${TYPE_META[t].dot}`} />
                    <span className="flex-1 truncate">{inst.name}</span>
                  </div>
                ))}
                {listFor(t).length === 0 && <div className="px-2.5 py-1.5 text-xs text-muted-foreground">None yet</div>}
                {(t === 'popup' || t === 'mail') && (
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-muted text-[13px] text-muted-foreground" onClick={() => addNew(t)}>
                    <Plus className="h-3.5 w-3.5 flex-none" />
                    <span className="flex-1">New {TYPE_META[t].label.toLowerCase()}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      </div>
      {/* Help, anchored at the foot of the rail and set apart from the content groups above —
          quieter type, its own divider, and outside the scrolling area so it stays put however
          long the library grows. Still present as an icon when the rail is collapsed. */}
      <div className="flex-none border-t p-2">
        <div className={`flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer ${view === 'home' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted'} ${railNarrow ? 'justify-center' : ''}`}
             onClick={() => setView('home')} title="How this area works">
          <HelpCircle className="h-4 w-4 flex-none" />
          {!railNarrow && <span className="flex-1 text-[12.5px]">How this area works</span>}
        </div>
      </div>
    </aside>
  );

  // ── home: what this area is ───────────────────────────────────────────────
  const Home = () => (
    <div className="flex-1 overflow-auto p-8">
      <h1 className="text-xl font-bold">How this area works</h1>
      <p className="text-muted-foreground mt-1 max-w-[720px]">
        Everything a client receives is built here, once, and reused on every job.
      </p>
      <div className="mt-7 grid gap-4 max-w-[720px]">
        <div className="border rounded-xl p-4 bg-card">
          <div className="flex items-center gap-2 font-semibold text-sm"><Layers className="h-4 w-4 text-[#2c5aa0]" /> Sequences</div>
          <p className="text-sm text-muted-foreground mt-1.5">
            The order a client experiences things — an email delivers the document, the document is signed,
            a popup confirms it. Open one to see its parts laid out.
          </p>
          <button type="button" onClick={() => setView('map')}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold border rounded-md px-2 py-1 hover:text-[#2c5aa0] hover:border-[#2c5aa0]">
            Open {SEQUENCES[0].name} <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="border rounded-xl p-4 bg-card">
          <div className="flex items-center gap-2 font-semibold text-sm"><LayoutGrid className="h-4 w-4 text-[#2c5aa0]" /> Component library</div>
          <p className="text-sm text-muted-foreground mt-1.5">
            The three kinds of thing a sequence is made from — emails, documents and popups — listed on the
            left. A sequence does not hold its own copies; it points at these.
          </p>
        </div>
        <div className="border rounded-xl p-4 bg-card">
          <div className="flex items-center gap-2 font-semibold text-sm"><Eye className="h-4 w-4 text-[#2c5aa0]" /> Previewing and editing</div>
          <p className="text-sm text-muted-foreground mt-1.5">
            Anything you open opens as a full-width page to read. Press Edit to change it — then choose
            whether to keep the preview beside the editor or use the whole width.
          </p>
        </div>
      </div>
    </div>
  );

  // ── sequence map (blocks) ─────────────────────────────────────────────────
  const Map = () => (
    <div className="flex-1 overflow-auto p-6 relative">
      <h1 className="text-xl font-bold">{currentSeq.name}</h1>
      <p className="text-muted-foreground mt-1">What the client experiences, in order. Click a block to preview it here; Edit opens it in its own editing area.</p>
      <div ref={rowRef} className="flex items-stretch mt-7 pb-4 overflow-x-auto">
        {currentSeq.parts.map((t, i) => (
          <React.Fragment key={t}>
            {/* data-module-card marks a card as "not outside": clicking one while a preview is
                open slides the preview to it instead of dismissing. */}
            <div data-module-card={t}
                 className={`w-[236px] flex-none bg-card border rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition border-t-4 ${TYPE_META[t].accent} ${previewType === t ? 'ring-2 ring-[#2c5aa0] bg-[#2c5aa0]/5' : ''}`}
                 onClick={() => openPreview(t)}
                 >
              <div className="p-4">
                <div className={`flex items-center gap-1.5 text-[11px] font-bold tracking-wide uppercase ${t === 'doc' ? 'text-[#2c5aa0]' : t === 'mail' ? 'text-cyan-700' : 'text-emerald-600'}`}>{TYPE_META[t].icon}{TYPE_META[t].label}</div>
                <div className="text-[15px] font-bold mt-2">{nameFor(t, defaultIdFor(t))}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{t === 'doc' ? 'e-signature document' : t === 'mail' ? 'delivers the signing link' : 'post-sign confirmation'}</div>
              </div>
              <div className="flex items-center gap-1.5 border-t px-3 py-2 bg-muted/30">
                <button type="button" onClick={(e) => { e.stopPropagation(); openPreview(t); }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground border rounded-md px-2 py-1 bg-card hover:text-[#2c5aa0] hover:border-[#2c5aa0] transition-colors">
                  <Eye className="h-3 w-3" /> Preview
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); openEdit(t); }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground border rounded-md px-2 py-1 bg-card hover:text-[#2c5aa0] hover:border-[#2c5aa0] transition-colors">
                  <Pencil className="h-3 w-3" /> Edit
                </button>
              </div>
            </div>
            {i < currentSeq.parts.length - 1 && (
              <div className="w-[74px] flex-none flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
                <span className="text-[10px] font-bold uppercase tracking-wide">{CONN[t]}</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      {previewType && ModulePreview()}
    </div>
  );

  // Floating preview of one module. Sits BELOW the module row so the row stays visible and you
  // can click straight across to a neighbour; centred at 60% of the canvas width.
  const ModulePreview = () => {
    const t = previewType as CompType;
    return (
      <div ref={previewRef}
           className={`absolute bg-card border rounded-2xl shadow-2xl overflow-hidden flex flex-col z-20 ${slide ? 'transition-[left] duration-200 ease-out' : ''}`}
           /* An explicit HEIGHT, not just a max-height: the body is a flex-1 child, and with only
              a max-height on the parent it resolves to zero and the preview renders empty. */
           style={{
             left: previewBox?.left ?? 0,
             width: previewBox?.width ?? '60%',
             top: previewBox?.top ?? 236,
             height: `min(520px, calc(100% - ${(previewBox?.top ?? 236) + 24}px))`,
           }}>
        <div className="flex items-center gap-2 px-4 h-11 border-b bg-muted/30 flex-none">
          <span className={`flex items-center gap-1.5 text-[11px] font-bold uppercase ${t === 'doc' ? 'text-[#2c5aa0]' : t === 'mail' ? 'text-cyan-700' : 'text-emerald-600'}`}>{TYPE_META[t].icon}{TYPE_META[t].label}</span>
          <span className="font-bold text-sm truncate">{nameFor(t, defaultIdFor(t))}</span>
          <div className="flex-1" />
          <Button size="sm" className="h-7 gap-1.5 bg-[#2c5aa0] hover:bg-[#234a85]"
                  onClick={() => { openEdit(t); }}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setPreviewType(null)}><X className="h-4 w-4" /></Button>
        </div>
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">{renderLeft()}</div>
      </div>
    );
  };

  // ── sequence spine (vertical, while a panel is open from a block) ─────────
  const startSpineGrab = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX, startW = spineW;
    const move = (ev: MouseEvent) => setSpineW(Math.max(200, Math.min(460, startW + (ev.clientX - startX))));
    const up = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', move); document.addEventListener('mouseup', up);
  };

  const Spine = () => (
    <div className="flex-none border-r bg-muted/40 overflow-y-auto relative" style={{ width: spineCollapsed ? 54 : spineW }}>
      <div className={spineCollapsed ? 'p-2' : 'p-4'}>
        <div className="flex items-center mb-3">
          {!spineCollapsed && <span className="flex-1 text-[11px] font-bold tracking-wider uppercase text-muted-foreground px-1">Sequence</span>}
          <button onClick={() => setSpineCollapsed(c => !c)} title={spineCollapsed ? 'Expand sequence' : 'Collapse sequence'}
            className="h-6 w-6 flex items-center justify-center rounded-md border bg-card text-muted-foreground hover:text-[#2c5aa0] hover:border-[#2c5aa0] mx-auto">
            {spineCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        </div>
        {ORDER.map((t, i) => {
          const cur = t === itemType;
          const lcol = t === 'doc' ? 'border-l-[#2c5aa0]' : t === 'mail' ? 'border-l-cyan-700' : 'border-l-emerald-600';
          const tcol = t === 'doc' ? 'text-[#2c5aa0]' : t === 'mail' ? 'text-cyan-700' : 'text-emerald-600';
          return (
            <React.Fragment key={t}>
              {spineCollapsed ? (
                <button onClick={() => openSeq(t)} title={`${TYPE_META[t].label}: ${nameFor(t, defaultIdFor(t))}`}
                  className={`w-full flex items-center justify-center py-2.5 my-1.5 rounded-lg border bg-card border-l-[3px] ${lcol} ${tcol} ${cur ? 'ring-2 ring-[#2c5aa0]' : ''}`}>
                  {TYPE_META[t].icon}
                </button>
              ) : (
                <div className={`bg-card border rounded-xl p-3 cursor-pointer shadow-sm border-l-[3px] ${lcol} ${cur ? 'ring-2 ring-[#2c5aa0]' : ''}`} onClick={() => openSeq(t)}>
                  <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase ${tcol}`}>{TYPE_META[t].icon}{TYPE_META[t].label}</div>
                  <div className="font-bold text-[13.5px] mt-1 truncate">{nameFor(t, defaultIdFor(t))}</div>
                </div>
              )}
              {!spineCollapsed && i < ORDER.length - 1 && <div className="flex items-center gap-1.5 text-muted-foreground px-1.5 py-1.5 text-[10.5px] font-bold uppercase"><ChevronDown className="h-3.5 w-3.5" />{CONN[t]}</div>}
            </React.Fragment>
          );
        })}
      </div>
      {!spineCollapsed && <div className="absolute top-0 right-0 h-full w-1.5 cursor-col-resize hover:bg-[#2c5aa0]/30" onMouseDown={startSpineGrab} title="Drag to resize" />}
    </div>
  );

  // ── the work area ─────────────────────────────────────────────────────────
  // read  → the render alone, full width (the default; reading is the common job)
  // edit  → split (an even 50/50, drag to change) or the editor alone, full width
  // Documents diverge from email/popup here: their "Editor" view IS just the rendered page
  // (fields editing only exists in Split), so a doc in edit+editor shows the render alone —
  // never the freeform iframe. Email/popup keep the original behavior in both layouts.
  const isDoc = itemType === 'doc';
  const showRender = mode === 'read' || editLayout === 'split' || (isDoc && mode === 'edit' && editLayout === 'editor');
  const showEditor = mode === 'edit' && !(isDoc && editLayout === 'editor');
  const startGrab = (e: React.MouseEvent) => {
    e.preventDefault();
    const split = splitRef.current; if (!split) return;
    const left = split.firstElementChild as HTMLElement | null; if (!left) return;
    const move = (ev: MouseEvent) => {
      const r = split.getBoundingClientRect();
      const w = Math.max(260, Math.min(r.width - 260, ev.clientX - r.left));
      left.style.flex = `0 0 ${w}px`;
    };
    const up = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', move); document.addEventListener('mouseup', up);
  };

  const Work = () => (
    <div className="flex-1 flex min-w-0">
      {view === 'seq' && Spine()}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {/* panel bar */}
        <div className="flex items-center gap-2.5 h-12 px-4 bg-card border-b flex-none">
          <span className={`flex items-center gap-1.5 text-[11px] font-bold uppercase ${itemType === 'doc' ? 'text-[#2c5aa0]' : itemType === 'mail' ? 'text-cyan-700' : 'text-emerald-600'}`}>{TYPE_META[itemType].icon}{TYPE_META[itemType].label}</span>
          <span className="font-bold">{nameFor(itemType, selectedId)}</span>
          <div className="flex-1" />
          {itemType === 'doc' && <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={handleDownload}><Download className="h-4 w-4" /> Download</Button>}
          {mode === 'read' ? (
            <Button size="sm" className="h-8 gap-1.5 bg-[#2c5aa0] hover:bg-[#234a85]" onClick={() => { setEditLayout('split'); setMode('edit'); }}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
          ) : (
            <>
              {/* Layout choice exists only inside edit mode. Split opens even, 50/50. */}
              <div className="flex items-center rounded-md border overflow-hidden">
                <button type="button" onClick={() => setEditLayout('split')}
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 ${editLayout === 'split' ? 'bg-[#2c5aa0] text-white' : 'text-muted-foreground hover:text-[#2c5aa0]'}`}>
                  <Columns className="h-3 w-3" /> Split
                </button>
                <button type="button" onClick={() => setEditLayout('editor')}
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 border-l ${editLayout === 'editor' ? 'bg-[#2c5aa0] text-white' : 'text-muted-foreground hover:text-[#2c5aa0]'}`}>
                  <Pencil className="h-3 w-3" /> Editor
                </button>
              </div>
              <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => setMode('read')}>
                <Eye className="h-4 w-4" /> Done
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={closePanel}><X className="h-4 w-4" /></Button>
        </div>
        {/* work area */}
        <div ref={splitRef} className="flex-1 flex min-h-0 p-4 gap-0">
          {showRender && (
            <div className="flex flex-col border rounded-xl overflow-hidden bg-card min-w-0"
                 style={showEditor ? { flex: '0 0 50%' } : { flex: '1 1 100%' }}>
              <div className="flex items-center gap-2 px-3.5 py-2.5 border-b font-semibold text-[13px] bg-muted/30"><Eye className="h-3.5 w-3.5" /> Rendered</div>
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">{renderLeft()}</div>
            </div>
          )}
          {showRender && showEditor && (
            <div className="w-3.5 flex items-center justify-center cursor-col-resize group" onMouseDown={startGrab} title="Drag to resize">
              <span className="w-[3px] h-9 rounded bg-border group-hover:bg-[#2c5aa0]" />
            </div>
          )}
          {showEditor && isDoc && (
          // The document's Split-view right pane: labeled section boxes, not a second copy of
          // the page. Same component TemplateEditorModal's Edit Contract screen uses — one
          // editor codebase, not two. Editing a field here updates `docHtml`, which is what the
          // Rendered pane on the left is already showing, so the page rebuilds live in place.
          <div className="flex flex-col border rounded-xl overflow-hidden bg-card flex-1 min-w-0">
            <div className="flex items-center gap-2 px-3.5 py-2.5 border-b font-semibold text-[13px] bg-muted/30">
              <Pencil className="h-3.5 w-3.5" /> Fields
            </div>
            <div className="flex-1 min-h-0 flex flex-col p-3">
              <DocumentFieldsEditor
                key={selectedId}
                html={docHtml}
                onChange={setDocHtml}
                onSave={handleSaveInline}
              />
            </div>
          </div>
          )}
          {showEditor && !isDoc && (
          <div className="flex flex-col border rounded-xl overflow-hidden bg-card flex-1 min-w-0">
            <div className="flex items-center gap-2 px-3.5 py-2.5 border-b font-semibold text-[13px] bg-muted/30">
              <Pencil className="h-3.5 w-3.5" /> Editor
              {/* Same zoom strip as the render side. Reset returns to the fitted size. */}
              <div className="ml-auto flex items-center gap-0.5 text-muted-foreground font-normal">
                <Button variant="ghost" size="sm" onClick={() => setEditorZoom(Math.max(25, editorZoomPct - 10))} className="h-5 w-5 p-0 hover:text-foreground" title="Zoom Out"><ChevronDown className="h-3.5 w-3.5" /></Button>
                <span className="text-[11px] tabular-nums w-9 text-center select-none">{editorZoomPct}%</span>
                <Button variant="ghost" size="sm" onClick={() => setEditorZoom(Math.min(200, editorZoomPct + 10))} className="h-5 w-5 p-0 hover:text-foreground" title="Zoom In"><ChevronUp className="h-3.5 w-3.5" /></Button>
                {/* Re-measures as well as clearing the override: when the zoom is ALREADY following
                    the fit, clearing state alone is a no-op and the button would appear dead. */}
                <Button variant="ghost" size="sm" onClick={() => { setEditorZoom(null); measureEditorFit(); }} className="h-5 w-5 p-0 hover:text-foreground ml-2" title="Fit to pane"><RotateCcw className="h-3 w-3" /></Button>
              </div>
            </div>
            {/* INLINE editor for email/popup (designMode editable surface). */}
            <div className="flex-1 min-h-0 flex flex-col p-3 gap-2">
              <div className="text-[11px] text-muted-foreground">Merge fields (click to insert)</div>
              <div className="flex flex-wrap gap-1.5">
                {mergeTokens.map(tk => (
                  <button key={tk.token} type="button" onClick={() => insertToken(tk.token)}
                    className="text-xs px-2 py-1 rounded border font-mono bg-muted text-foreground hover:border-[#2c5aa0] hover:text-[#2c5aa0] transition-colors">
                    {tk.label}
                  </button>
                ))}
              </div>
              <iframe ref={editIframeRef} title="Inline editor" className="flex-1 min-h-0 w-full rounded-md border bg-white focus-within:border-[#2c5aa0]" />
              <div className="flex justify-end">
                <Button size="sm" className="gap-1.5 bg-[#2c5aa0] hover:bg-[#234a85]" onClick={handleSaveInline}><Pencil className="h-3.5 w-3.5" /> Save</Button>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Full-window: no margin, no rounding, no dashboard showing round the edges — the
          studio is a dense work surface and the floating border was dead space. The X in
          the top bar still routes back to the job page. */}
      {/* Position/size go in inline style, not classes: the shared DialogContent base already
          sets left-[50%]/top-[50%]/translate + a max width, and class-vs-class overrides there
          depend on stylesheet order. Inline style is deterministic. */}
      <DialogContent
        className="rounded-none sm:rounded-none border-0 flex flex-col p-0 gap-0 [&>button]:hidden overflow-hidden"
        style={{ left: 0, top: 0, transform: 'none', width: '100vw', height: '100vh', maxWidth: 'none' }}
      >
        {/* top bar */}
        <div className="flex items-center gap-4 px-4 h-14 border-b flex-none">
          <div className="flex items-baseline gap-2"><span className="font-extrabold tracking-wide text-[#2c5aa0]">VALTA</span><span className="text-xs text-muted-foreground">Component Studio</span></div>
          <span className="w-px h-6 bg-border" />
          <span className="font-semibold text-sm">LOE Sequence Builder</span>
          <div className="flex-1" />
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        {/* shell */}
        <div className="flex-1 flex min-h-0">
          {Rail()}
          <main className="flex-1 flex flex-col min-w-0">
            {/* stage bar / crumb */}
            <div className="flex items-center gap-3 h-12 px-5 border-b flex-none text-sm">
              {view === 'home' ? (
                <span className="font-semibold">Component Studio</span>
              ) : view === 'map' ? (
                <span className="font-semibold">{currentSeq.name}</span>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="cursor-pointer hover:text-[#2c5aa0]" onClick={closePanel}>{view === 'lib' ? 'Component Library' : currentSeq.name}</span>
                  <span className="text-muted-foreground/50">/</span>
                  <span>{TYPE_META[itemType].label}{view === 'lib' ? 's' : ''}</span>
                  <span className="text-muted-foreground/50">/</span>
                  <span className="text-foreground font-semibold">{nameFor(itemType, selectedId)}</span>
                </div>
              )}
              <div className="flex-1" />
              {view !== 'map' && view !== 'home' && <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={closePanel}><ArrowLeft className="h-4 w-4" /> Back to map</Button>}
            </div>
            <div className="flex-1 flex min-h-0">
              {view === 'home' ? Home() : view === 'map' ? Map() : Work()}
            </div>
          </main>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentStudio;
