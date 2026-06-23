
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Loader2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SectionTitle, sectionTriggerStyle, sectionContentStyle, FieldRow, SectionGroup, TwoColumnFields, CompactField, FieldSyncStatus } from "./ValcreStyles";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SectionProps } from "./types";
import { isValcreJobNumber, isPendingValcreJob, hasRealValcreJob, VALCRE_JOB_PREFIX } from "@/config/valcre";
import JobNumberField from "./loe-quote/JobNumberField";
import { sendToValcre } from "@/utils/webhooks";
import { supabase } from "@/integrations/supabase/client";
import { generateAppraisalTestData } from "@/utils/testDataGenerator";
import { FileSignature, AlertCircle, ExternalLink, Trash2, FolderOpen, CheckCircle, Mail } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { validateRequiredFields } from "@/utils/webhooks/docuseal";
import { generateLOEHTML, generateAndSendLOE, sendLOEEmail } from "@/utils/loe/generateLOE";
import { loadJobContracts, saveJobContract, deleteJobContract, markContractSent, JobContract } from "@/utils/loe/jobContracts";
import { saveJobEmailInstance, loadJobEmailInstances, EmailInstance, EmailTemplate } from "@/utils/loe/emailTemplate";
import EmailComposeModal from "@/components/dashboard/job-details/actions/EmailComposeModal";
import PopupComposeModal from "@/components/dashboard/job-details/actions/PopupComposeModal";
import ComponentStudio from "@/components/dashboard/job-details/actions/ComponentStudio";
import { PopupTemplate } from "@/utils/loe/popupTemplate";
import { markLOEPrepComplete } from "@/utils/webhooks/clickup";
import LOEPreviewModal from "./actions/LOEPreviewModal";
import ClickUpAction from "./actions/ClickUpAction";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { deriveValueScenarios, STATUS_TO_SCENARIOS, deriveApproaches, derivePropertyRights } from "@/utils/loe/loeCascade";
import ValueScenarioNarratives from "./ValueScenarioNarratives";

// Derived field read-only style (Value Scenarios, Property Rights, Approaches to Value)
const derivedFieldStyle: React.CSSProperties = {
  fontStyle: 'italic',
  color: 'inherit',                                   // bright/readable when filled — the Valcre Job Number reference look
  borderBottom: '1px solid rgba(148,163,184,0.45)',   // persistent underline (reads in light + dark)
  padding: '2px 0',
  fontSize: '0.8rem',
  minHeight: '28px',
  display: 'flex',
  alignItems: 'center',
  userSelect: 'none' as const,
  pointerEvents: 'none' as const,
};

// Provenance colors — mirror the mock (public/field-registry-v6.html). Each color is locked to the
// DESTINATION field so the box "tells the truth" about what drives it. Applied ONLY while Test Mode is
// on AND the field is actively driven, so the normal (resting) locked-field look stays unshaded.
const PROV = {
  status:     { bg: '#dcfce7', bd: '#22c55e' }, // green  — Status of Improvements (2.4)
  auth:       { bg: '#ffedd5', bd: '#f97316' }, // orange — Authorized Use (1.13)
  scenarios:  { bg: '#ffe4e6', bd: '#f43f5e' }, // rose   — Value Scenarios (2.5)
  approaches: { bg: '#dbeafe', bd: '#3b82f6' }, // blue   — Approaches to Value (2.9)
  source:     { bg: '#fef9c3', bd: '#eab308' }, // yellow — insert-from-data sources
} as const;

// Derived-field box style, optionally tinted with a provenance color. Tinting adds padding + radius so
// the shaded box reads as a chip; null key → plain derived look (unshaded, as Ben locked it at rest).
const provStyle = (key: keyof typeof PROV | null): React.CSSProperties =>
  key
    ? {
        ...derivedFieldStyle,
        background: PROV[key].bg,
        borderBottomColor: PROV[key].bd,
        color: '#1f2937',        // dark slate — readable on the light pastel in BOTH light + dark mode
        paddingLeft: 6,
        paddingRight: 6,
        borderRadius: 4,
      }
    : derivedFieldStyle;

// Name-segment colors for the cascade picker labels (mirror the mock's cv-* spans).
const CV = { left: '#15803d', leftAu: '#f59e0b', scen: '#be123c', appr: '#1d4ed8' } as const;

// The four scenario choices. `left` is the driving outcome word (green for V1–V3 Status, amber for V4
// Authorized Use); `scen`/`appr` are the derived Value Scenarios / Approaches the choice produces.
const CASCADE_OPTIONS = [
  { v: 'V1', left: 'Completed',                scen: 'As Stabilized',                                appr: 'Direct Comparison + Income' },
  { v: 'V2', left: 'Under Renovation',         scen: 'As-Is + As If Complete & Stabilized',          appr: 'Direct Comparison + Income + Cost' },
  { v: 'V3', left: 'Improved Land (Demo Req)', scen: 'As If Vacant Land + As If Complete & Stabilized', appr: 'Land Direct Comparison + Cost' },
  { v: 'V4', left: 'Insurance',                scen: 'Insurable Replacement Cost',                   appr: 'Cost Approach' },
] as const;

// ── Saved Documents: template-TYPE taxonomy (Version C pills) ────────────────────────
// Base registry of document types. These ALWAYS render as pills — even at count 0 — so the
// type taxonomy is visible/persistent (don't hide empty types). Only LOE is currently wired to
// a real template; Client Letter / Email / Thank-You are forward-declared placeholders that
// light up once those template types exist. New types added here appear as new pills
// automatically; any type discovered in saved data that isn't here is appended at render time.
const DOC_TYPES: { key: string; label: string }[] = [
  { key: 'loe',    label: 'LOE' },
  { key: 'letter', label: 'Client Letter' },
  { key: 'email',  label: 'Email' },
  { key: 'thanks', label: 'Thank-You' },
];

// Map a saved contract to its document type. Keyed off contract_type/name so the same row always
// lands in the same pill. Unknown types derive their own pill from contract_type so a brand-new
// template type (or cascade-version label) surfaces as a pill with no code change.
const typeOf = (c: JobContract): { key: string; label: string } => {
  const hay = `${c.contract_type ?? ''} ${c.name ?? ''}`.toLowerCase();
  if (hay.includes('thank'))  return DOC_TYPES[3];
  if (hay.includes('letter')) return DOC_TYPES[1];
  if (hay.includes('email'))  return DOC_TYPES[2];
  if (hay.includes('loe'))    return DOC_TYPES[0];
  const label = c.contract_type?.trim() || 'Other';
  return { key: `t:${label.toLowerCase()}`, label };
};

const formatShortDate = (iso: string): string => {
  try { return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
  catch { return ''; }
};

// Default delivery time in weeks (contract standard, Ben 2026-06-19).
const DEFAULT_DELIVERY_WEEKS = 3;

// Compute a delivery date = base + weeks, returned as a YYYY-MM-DD string for <input type="date">.
const addWeeks = (base: Date, weeks: number): string => {
  const d = new Date(base);
  d.setDate(d.getDate() + weeks * 7);
  return d.toISOString().slice(0, 10);
};

// Resolve the Delivery Date for display: ALWAYS TODAY + weeks, recomputed on every render
// (Ben 2026-06-19 — no loe_sent_at coupling, no lock, never persisted). A refresh rolls it forward;
// changing the weeks value shifts it immediately. Default weeks = 3.
const resolveDeliveryDate = (weeksRaw: string | undefined): string => {
  const weeksNum = parseInt(String(weeksRaw ?? ''), 10);
  const weeks = Number.isFinite(weeksNum) && weeksNum > 0 ? weeksNum : DEFAULT_DELIVERY_WEEKS;
  return addWeeks(new Date(), weeks);
};

// Postgres DATE columns reject empty strings with `22007 invalid input syntax for type date: ""`.
// Blank date inputs (Retainer Paid / Signed / Effective / Request / Payment Paid) emit `""`, which
// would otherwise blow up the LOE-detail save and block the Create-Valcre button flipping to
// "View in Valcre". Coerce any empty/whitespace string → null so the DATE column gets a real null.
// Returns null for null/undefined/empty; otherwise the trimmed value untouched. (Bug A, 2026-06-22.)
const nullIfEmptyDate = (v: unknown): string | null => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s === '' ? null : s;
};

// Clickable info popover (? icon) for a field label. Click to open. Used on fields whose behavior
// isn't obvious (Delivery Date auto-set on LOE-sent; Client Requested Date; questionable fields).
//
// PLACEMENT RULE (Ben): the ? icon ALWAYS sits OUTSIDE the field name — to the LEFT of the label
// text (the outer edge of a right-aligned label) — so the label→value line is never broken. This
// helper bakes that in: it returns a flex row that puts the icon FIRST, then the label text. Callers
// pass the field-name string as `label`; never place the icon between the label and the input.
const FieldInfo: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <span className="inline-flex items-center justify-end gap-1 w-full">
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Field info"
          className="inline-flex items-center text-muted-foreground hover:text-foreground shrink-0"
        >
          <HelpCircle className="h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="max-w-xs text-xs leading-relaxed">
        {children}
      </PopoverContent>
    </Popover>
    {label}
  </span>
);

const LoeQuoteSection: React.FC<SectionProps> = ({
  job,
  jobDetails = {},
  onUpdateDetails,
  onUpdateJob,
  refetchJobData,
  testFilled = false,
  testMode = false,
  cascadeResetToken = 0,
  insertFromData = false,
  setInsertFromData
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [isCreatingAssetFolders, setIsCreatingAssetFolders] = useState(false);

  // Create the SharePoint per-job folder tree (parent + 5 standard subfolders) ON DEMAND from
  // the action ribbon. Works for ANY job, including ones created directly in Valcre. Explicit
  // jobNumber + propertyDescription form so it never depends on a job_submissions row. Idempotent.
  const handleCreateAssetFolders = async () => {
    if (!jobDetails?.jobNumber) {
      toast.error('Create a Valcre job first');
      return;
    }
    // FIX 2 (2026-06-23) — short-circuit: if this job already has a stored SharePoint folder URL, just
    // open it (mirror the open-state button below) and skip the invoke entirely. Never re-create a set.
    const storedUrl = (job as any)?.sharepointFolderUrl;
    if (storedUrl) {
      window.open(storedUrl, '_blank');
      return;
    }
    setIsCreatingAssetFolders(true);
    try {
      // FIX 2 (2026-06-23) — send ONLY { jobId } so the edge fn composes the folder name the ONE
      // canonical way (jobFolderInputs, space-join). The old client-side comma-join built a DIFFERENT
      // name than the server's, so ensureFolder's GET-by-path missed the client's existing folder and
      // created a DUPLICATE set. Byte-identical name (+ the server's jobNumber prefix-match) = connect.
      const { data, error } = await supabase.functions.invoke('create-job-folders', {
        body: { jobId: job.id },
      });
      if (error) throw error;
      if (data?.configured === false) {
        toast.error('SharePoint is not configured yet');
        return;
      }
      if (data?.success) {
        // Persist the folder URL so the button stays in its "created → open" state across reloads
        // and never re-creates a set. onUpdateJob writes job_submissions.sharepoint_folder_url.
        if (data.parentWebUrl && onUpdateJob) {
          onUpdateJob({ sharepointFolderUrl: data.parentWebUrl } as any);
        }
        toast.success(
          <div>
            <div>{data.connectedOnly ? '✅ Asset folders linked!' : '✅ Asset folders created!'}</div>
            {data.parentWebUrl && (
              <a href={data.parentWebUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                Open folder →
              </a>
            )}
          </div>
        );
      } else {
        toast.error('Failed to create asset folders');
      }
    } catch (error) {
      console.error('Error creating asset folders:', error);
      toast.error('Failed to create asset folders');
    } finally {
      setIsCreatingAssetFolders(false);
    }
  };
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHTML, setPreviewHTML] = useState<string>('');
  // Instance id the preview is bound to: null for a brand-new Create Document/Email, the row's id
  // when opening an existing (sent) contract for View. Carried into the modal so resave /
  // future sent-marking updates the same row.
  const [currentContractId, setCurrentContractId] = useState<string | null>(null);
  // Read-only View mode for the preview (opening a SENT contract).
  const [previewReadOnly, setPreviewReadOnly] = useState(false);
  // True when the preview is showing an ALREADY-SAVED instance (reopened draft/sent) — show its
  // HTML verbatim, don't regenerate the default template on open.
  const [previewExisting, setPreviewExisting] = useState(false);
  // When opening a SIGNED contract, the preview shows the executed PDF at this URL (read-only),
  // not the pre-send draft HTML. Null for draft/sent (which still render edited_html).
  const [previewSignedUrl, setPreviewSignedUrl] = useState<string | null>(null);
  // Active Saved Documents type pill: '' = nothing selected (list collapsed, just pills),
  // 'all' = every doc, or a DOC_TYPES key. The pill selection itself is the expand/collapse.
  const [typeFilter, setTypeFilter] = useState<string>('');
  // Saved client contracts for THIS job (Create Document/Email → save → appears here). The
  // dashboard shows what's been saved/prepped/sent + always lets you create a new one.
  const [savedContracts, setSavedContracts] = useState<JobContract[]>([]);
  // C — delete a saved DRAFT (never a sent doc). Two-step: hover-X → confirm dialog → delete.
  const [pendingDelete, setPendingDelete] = useState<JobContract | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const refreshContracts = useCallback(() => {
    if (job?.id) loadJobContracts(job.id).then(setSavedContracts);
  }, [job?.id]);
  useEffect(() => { refreshContracts(); }, [refreshContracts]);

  // PRD-APR-LOE-03 T3 — wire per-send email INSTANCES (load/state/refresh), mirroring the
  // contract refresh pattern above. The instance SAVE already lives in the send path below;
  // this adds the read side + a single persist helper for the send/draft paths (Wave C/D
  // consume it). contract_id stays nullable → the document-less first-class send (KR2).
  const [emailInstances, setEmailInstances] = useState<EmailInstance[]>([]);
  const refreshEmailInstances = useCallback(async () => {
    if (job?.id) setEmailInstances(await loadJobEmailInstances(job.id));
  }, [job?.id]);
  useEffect(() => { void refreshEmailInstances(); }, [refreshEmailInstances]);
  const persistEmailInstance = async (args: {
    id?: string; subject: string; bodyHtml: string;
    recipientEmail: string; contractId: string | null; state: 'draft' | 'sent';
  }) => {
    const res = await saveJobEmailInstance({
      id: args.id, jobId: job.id, contractId: args.contractId ?? undefined,
      recipientEmail: args.recipientEmail, subject: args.subject,
      bodyHtml: args.bodyHtml, state: args.state,
    });
    if (!res.success) toast.error(`Saving email failed: ${res.error ?? 'unknown error'}`);
    await refreshEmailInstances();
    return res;
  };

  // PRD-APR-LOE-03 Wave D1 — the DOCUMENT-LESS first-class email send (INV-0): a standalone
  // Send-by-Email entry on the job, reachable WITHOUT opening a document. Additive — it does
  // NOT touch the live LOE send path (handleApproveAndSend); it writes a contract_id=null instance.
  // Doc-less send goes to the client email as-is (no hidden redirect). Test data uses fake
  // @test.com addresses, so testing is safe; pick the real client only when intended.
  const [docLessOpen, setDocLessOpen] = useState(false);
  const [docLessTemplate, setDocLessTemplate] = useState<EmailTemplate | null>(null);
  const [docLessSending, setDocLessSending] = useState(false);
  // Popup editor (third component type) — opened from the Previewer's Popup dropdown.
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupInitial, setPopupInitial] = useState<PopupTemplate | null>(null);
  // Component Studio (library + sequence map + split previewer/editor) — additive entry; the
  // proven document previewer/email/popup editors are reused via the onEdit* callbacks.
  const [studioOpen, setStudioOpen] = useState(false);
  // Asset Studio trigger now lives at the PAGE TOP (JobDetailView, under the ribbon, far right) —
  // off the action row, NOT a peer of the produce buttons. The Studio modal + its edit-delegate
  // handlers stay here, so the page-top cog opens it via a decoupled window event.
  useEffect(() => {
    const open = () => setStudioOpen(true);
    window.addEventListener('apr:open-asset-studio', open);
    return () => window.removeEventListener('apr:open-asset-studio', open);
  }, []);
  // Doc-less send: empty signing link (G5 — no DocuSeal link on a document-less email);
  // persist the instance as 'sent' ONLY on Resend success (G4); contract_id=null (KR2).
  const handleSendDocLess = async (payload: { subject: string; bodyHtml: string }) => {
    if (docLessSending) return;
    setDocLessSending(true);
    try {
      const recipient = job?.clientEmail || '';
      const clientName = `${job?.clientFirstName ?? ''} ${job?.clientLastName ?? ''}`.trim();
      const ok = await sendLOEEmail(recipient, clientName, '', job?.propertyAddress ?? '', payload);
      if (ok) {
        await persistEmailInstance({
          subject: payload.subject, bodyHtml: payload.bodyHtml,
          recipientEmail: recipient, contractId: null, state: 'sent',
        });
        toast.success('Email sent (document-less) and recorded on the job.');
        setDocLessOpen(false);
      } else {
        toast.error('Email send failed — not recorded (no draft left behind).');
      }
    } finally {
      setDocLessSending(false);
    }
  };

  const [validation, setValidation] = useState<{
    isValid: boolean;
    missingFields: string[];
  }>({ isValid: false, missingFields: [] });

  // Section-level save state for visual feedback
  const [isSectionSaving, setIsSectionSaving] = useState(false);
  const [fieldStates, setFieldStates] = useState<Record<string, FieldSyncStatus>>({});

  // Local state for currency fields during editing (prevents controlled input issues)
  const [editingAppraisalFee, setEditingAppraisalFee] = useState<string | null>(null);
  const [editingRetainerAmount, setEditingRetainerAmount] = useState<string | null>(null);
  const [editingPaymentAmount, setEditingPaymentAmount] = useState<string | null>(null);
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  // RULE 2 — Value Scenarios locks ONLY after a cascade pick (default: editable multi-select).
  const [cascadePicked, setCascadePicked] = useState(false);
  const [cascadeVersion, setCascadeVersion] = useState(''); // held selection for the top cascade picker (so the label persists, not resets)
  // Stash the user's real Authorized Use (intendedUse) BEFORE the V4 Insurance override replaces it,
  // so Clear / switching to V1–V3 restores it (matches the mock's data-intake behavior). Never blanked.
  const preInsuranceIntendedUse = useRef<string>('');
  // Stash the mapped source values when "Insert from data" is UNCHECKED, so re-checking re-injects them
  // (mock parity: ON re-fills from base, OFF empties all six source/mirror fields + strips the yellow).
  const mappedSources = useRef<{ propertyType: string; propertySubtype: string; tenancy: string }>({ propertyType: '', propertySubtype: '', tenancy: '' });

  // Fill/Clear bump cascadeResetToken → snap the picker back to its unpicked "default cleared" state.
  useEffect(() => {
    if (cascadeResetToken > 0) {
      setCascadePicked(false);
      setCascadeVersion('');
    }
  }, [cascadeResetToken]);

  // While a job is test-filled but no scenario has been picked, the cascade-derived cluster
  // (Value Scenarios, Property Rights, Approaches) DISPLAYS placeholders — even though the
  // property fields hold values — so it reads as "empty, waiting for a scenario." A real
  // (never-filled) job derives + shows normally.
  const cascadeIdle = testFilled && !cascadePicked;

  // LOE template versions (PRD-B version selector) — default newest active
  const [loeTemplates, setLoeTemplates] = useState<Array<{ id: string; name: string; version: number }>>([]);
  useEffect(() => {
    supabase
      .from('loe_templates')
      .select('id, name, version')
      .eq('is_active', true)
      .order('version', { ascending: false })
      .then(({ data }) => { if (data) setLoeTemplates(data as any); });
  }, []);

  // Debounce timers
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});

  // Fields that sync to Valcre (from valcre.ts lines 231-248)
  // PRD-A clean fields wired to Valcre (QA-verified one-by-one):
  // requestDate→Job.BidDate (#1 PASS), signedDate→Job.AwardDate (#2 PASS), effectiveDate→Job.EffectiveDate (#3 PASS).
  // Desktop Report (#4) was REVERTED — Valcre custom field 12050 does NOT exist on this tenant
  //   (confirmed live API + QA readback + Ben's admin list). Stays Supabase/LOE-only until/unless a CF is created.
  // paymentTerms REMOVED 2026-06-19 (Ben) — field retired; LOE clause is fixed boilerplate, not a per-job
  // choice, so it no longer syncs to Valcre. DB column job_loe_details.payment_terms left in place (unused).
  const VALCRE_SYNC_FIELDS = ['appraisalFee', 'retainerAmount', 'deliveryDate', 'appraiserComments', 'deliveryComments', 'paymentComments', 'propertyRightsAppraised', 'scopeOfWork', 'valuationPremises', 'reportType', 'paymentAmount', 'paymentPaidDate', 'requestDate', 'signedDate', 'effectiveDate',
    // Auto-sync wiring (2026-06-04, AUTO-SYNC-WIRING-MAP) — job-prep fields with VERIFIED Valcre targets.
    // analysisLevel→AnalysisLevel, transactionStatus→CF12053, zoningStatus→CF12054, valueScenarios→CF11563/11564.
    // (propertyRightsAppraised→Purposes is already above.) Do-NOT-wire list excluded: reportFormat, assignmentType,
    // cmhcFinancing, desktopReport, purpose, leadAppraiser.
    // authorizedUse REMOVED 2026-06-05 (field-hygiene dedup) — Authorized Use now lives once on Client Intake
    // as `intendedUse`, which already syncs to native Job.IntendedUses. See DASHBOARD-TO-VALCRE-LOCATION-MAP.
    'analysisLevel', 'transactionStatus', 'zoningStatus', 'valueScenarios',
    // Fix 4: currentUse → CF12410 (currentUseImprovements), proposedUse → CF12411 (proposedUseImprovements)
    'currentUse', 'proposedUse',
    // Wired 2026-06-15 — registry-mapped but never sent (single-value, server-ready in VALTA_CUSTOM_FIELD_IDS):
    'statusOfImprovements', 'valueTimeframe',
    // Wired 2026-06-15 (second batch, ui-designer live-pull verified) — approachesToValue → CF12415 MultiOption
    // (opts 7513-7516). Convert layer in api/valcre.ts already matches today's live Valcre; uses the multi-value
    // path (comma-joined string → option-ID array, same shape as valueScenarios). Was on the old do-not-wire list.
    'approachesToValue'];

  // ON-CHANGE SYNC GATE REMOVED 2026-06-23 (Ben) — the old 9-field whitelist (CLICKUP_CARD_FIELDS)
  // made every OTHER field create-only: editing it later never refreshed the ClickUp card, so the
  // card went stale/blank. The whitelist was a redundant gate — update-clickup-task re-reads
  // job_loe_details FRESH from the DB and rebuilds the WHOLE card section by jobId, so ANY persisted
  // field change can safely fire it (no per-field value payload). pushCardUpdate() self-guards on a
  // saved clickup_task_id (never creates), so firing on every autosave is safe. The constant is kept
  // for reference (it documents which fields the card explicitly renders), but is no longer the gate.
  const CLICKUP_CARD_FIELDS = ['propertyRightsAppraised', 'scopeOfWork', 'reportType', 'appraisalFee',
    'retainerAmount', 'deliveryDate', 'appraiserComments', 'deliveryComments', 'paymentComments'];

  // Debounced card refresh: rapid edits across several card fields coalesce into ONE update-clickup-task
  // call (it rebuilds the whole section from DB anyway). Reuses the saved clickup_task_id — never creates.
  const clickupPushTimer = useRef<NodeJS.Timeout | null>(null);
  const pushCardUpdate = useCallback(() => {
    const taskId = (jobDetails as any)?.clickupTaskId || (job as any)?.clickupTaskId
      || (job as any)?.clickup_task_id;
    if (!taskId) return; // no card yet (Stage-1 hasn't created one) — nothing to update
    if (clickupPushTimer.current) clearTimeout(clickupPushTimer.current);
    clickupPushTimer.current = setTimeout(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const { data: result, error } = await supabase.functions.invoke('update-clickup-task', {
          body: { jobId: job.id, userId: user?.id },
        });
        // Readback, not 200: the edge fn re-GETs the card and returns `verified`.
        if (error || !result?.success) {
          console.error('ClickUp card update failed:', error || result?.error);
          (isValcreJobNumber(jobDetails?.jobNumber) && (jobDetails as any)?.valcreJobId) && toast.warning('ClickUp card update failed — refresh ClickUp');
        } else if (result.verified === false) {
          console.warn('ClickUp card update unverified (PUT 200 but readback mismatch):', result);
          (isValcreJobNumber(jobDetails?.jobNumber) && (jobDetails as any)?.valcreJobId) && toast.warning('ClickUp card update unverified');
        } else {
          console.log('✅ ClickUp card updated + verified:', result.taskId);
        }
      } catch (e) {
        console.error('ClickUp card push error:', e);
      }
    }, 1500); // coalesce window
  }, [job, jobDetails]);

  // Helper function to get user-friendly field names for toast messages
  const getFieldDisplayName = (fieldName: string): string => {
    const fieldNames: Record<string, string> = {
      appraisalFee: 'Appraisal Fee',
      retainerAmount: 'Retainer Amount',
      deliveryDate: 'Delivery Date',
      appraiserComments: 'Appraiser Comments',
      deliveryComments: 'Delivery Comments',
      paymentComments: 'Payment Comments',
      propertyRightsAppraised: 'Property Rights Appraised',
      scopeOfWork: 'Scope of Work',
      valuationPremises: 'Valuation Premises',
      reportType: 'Report Type',
      paymentAmount: 'Amount Paid',
      paymentPaidDate: 'Paid Date',
      retainerPaidDate: 'Retainer Paid Date'
    };
    return fieldNames[fieldName] || fieldName;
  };

  // Check if document was already sent
  const alreadySent = jobDetails.docusealSubmissionId ||
                      job.status === 'loe_sent' ||
                      job.status === 'loe_signed';

  // Validate fields whenever job or jobDetails change
  useEffect(() => {
    const result = validateRequiredFields(job, jobDetails);
    setValidation(result);
  }, [job, jobDetails]);

  // Check if required fields are filled for Create Valcre button
  const canCreateValcreJob = React.useMemo(() => {
    if (!job) return false;

    // Check if property type exists (stored as comma-separated string in property_type column)
    const hasPropertyType = !!(job.propertyType && job.propertyType.trim());

    return !!(
      job.propertyAddress &&
      hasPropertyType &&
      job.intendedUse &&
      jobDetails?.appraisalFee &&
      jobDetails?.scopeOfWork &&
      jobDetails?.valuationPremises
    );
  }, [job, jobDetails]);

  // Get missing fields for tooltip
  const getMissingFieldsForValcre = React.useMemo(() => {
    const missingFields = [];
    if (!job?.propertyAddress) missingFields.push('Property Address');

    // Check property type (stored as comma-separated string)
    const hasPropertyType = !!(job?.propertyType && job?.propertyType.trim());
    if (!hasPropertyType) missingFields.push('Property Type');

    if (!job?.intendedUse) missingFields.push('Authorized Use');
    if (!jobDetails?.appraisalFee) missingFields.push('Appraisal Fee');
    if (!jobDetails?.scopeOfWork) missingFields.push('Scope of Work');
    if (!jobDetails?.valuationPremises) missingFields.push('Valuation Premises');
    return missingFields;
  }, [job, jobDetails]);

  // Bug C: `disabled={isCreatingJob}` (button @ JSX) is NOT enough — React batches setIsCreatingJob,
  // so a rapid double-click can re-enter handleCreateValcreJob before the disabled prop re-renders,
  // firing TWO Valcre creates. A synchronous useRef guard flips instantly (no render needed) and is
  // the real lock. (2026-06-22.)
  const isCreatingJobLock = useRef(false);

  // Handle creating Valcre job
  const handleCreateValcreJob = async () => {
    if (!job || !canCreateValcreJob) return;
    // Synchronous re-entry guard — the FIRST line that runs, before any await.
    if (isCreatingJobLock.current) return;
    isCreatingJobLock.current = true;

    setIsCreatingJob(true);

    try {
      // Prepare COMPLETE data for Valcre including LOE details
      const valcreData = {
        jobId: job.id,
        jobNumber: jobDetails?.jobNumber || '',  // Include the VAL number if we have it
        clientName: `${job.clientFirstName} ${job.clientLastName}`,
        clientEmail: job.clientEmail,
        clientPhone: job.clientPhone,
        clientTitle: job.clientTitle,
        clientOrganization: job.clientOrganization,
        clientAddress: job.clientAddress || '',  // Client address (street) for contact entity (separate from property)
        clientCity: job.clientCity || '',        // → Valcre Contact AddressCity (1:1, no parse)
        clientProvince: job.clientProvince || '', // → Valcre Contact AddressState
        clientPostal: job.clientPostal || '',     // → Valcre Contact AddressPostalCode
        propertyName: job.propertyName,  // Include property name for Valcre job title
        propertyAddress: job.propertyAddress,
        propertyCity: job.propertyCity || '',        // → Valcre Property AddressCity (1:1, no parse)
        propertyProvince: job.propertyProvince || '', // → Valcre Property AddressState
        propertyPostal: job.propertyPostal || '',     // → Valcre Property AddressPostalCode
        propertyType: job.propertyType,  // Comma-separated string: "Healthcare, Manufactured Housing"
        propertyTypes: job.propertyType ? job.propertyType.split(',').map(t => t.trim()).filter(Boolean) : [],  // Parse to array for Valcre API
        // Subtype + Tenancy: the create path (valcre.ts) reads formData.propertySubtype (-> SecondaryType)
        // and formData.tenancy (-> CF12408). They were never SENT, so both landed blank (VAL261060).
        // MUST be lowercase `propertySubtype` to match valcre.ts L283/L337. Stored via the client
        // section to job_property_info -> surfaces on jobDetails; fall back to job.
        propertySubtype: (jobDetails as any)?.propertySubtype || (job as any)?.propertySubtype || '',
        tenancy: (jobDetails as any)?.tenancy || (job as any)?.tenancy || '',
        intendedUse: job.intendedUse,
        assetCondition: job.assetCondition,
        notes: job.notes,
        // Include property contact fields (separate from client)
        propertyContactFirstName: job.propertyContactFirstName || '',
        propertyContactLastName: job.propertyContactLastName || '',
        propertyContactEmail: job.propertyContactEmail || '',
        propertyContactPhone: job.propertyContactPhone || '',
        // Include LOE details for complete job creation
        appraisalFee: jobDetails?.appraisalFee || 0,
        retainerAmount: jobDetails?.retainerAmount || '',
        scopeOfWork: jobDetails?.scopeOfWork || '',
        // Fix 2: fall back to job.valuationPremises (ClientSubmissionSection stores to job_submissions)
        // so a freshly-created job gets RequestedValues set even if only filled via Client section.
        valuationPremises: jobDetails?.valuationPremises || (job as any)?.valuationPremises || '',
        propertyRightsAppraised: jobDetails?.propertyRightsAppraised || '',
        reportType: jobDetails?.reportType || '',
        deliveryDate: jobDetails?.deliveryDate || '',
        status: 'in_progress',
        timestamp: new Date().toISOString(),
      };

      console.log('Sending to Valcre:', valcreData);
      const result = await sendToValcre(valcreData);

      console.log('Valcre response:', result);  // Log the full response to see what's happening

      if (result.success && result.jobNumber) {
        // Check if we got a PENDING response (Valcre API didn't return actual job yet)
        const isPending = result.jobNumber.toString().startsWith('PENDING');

        if (isPending) {
          // Don't store PENDING values - they're just temporary placeholders
          // Show success but note that we're waiting for the actual job number
          void 0 /* success: silent (Ben) */;

          // Store a flag that job was created but pending
          await supabase
            .from('job_loe_details')
            .upsert({
              job_id: job.id,  // Fixed: Use 'job_id' not 'job_submission_id'
              updated_at: new Date().toISOString(),
              // Don't store the PENDING values - INTEGER columns can't handle them
              // Will update with real values when Valcre webhook fires
            });
        } else {
          // We got real values from Valcre - store them
          // Parse jobId to ensure it's numeric for the INTEGER column
          const numericJobId = parseInt(result.jobId, 10);

          // Update job with the real Valcre job number AND job ID
          if (onUpdateDetails) {
            onUpdateDetails({
              jobNumber: result.jobNumber,
              valcreJobId: numericJobId || null // Only store if it's a valid number
            });
          }

          // Update in Supabase with real values
          console.log('💾 Saving VAL number to job_loe_details:', result.jobNumber);

          // Check if LOE record exists first
          console.log('🔍 Checking for existing LOE record with job_id:', job.id);
          const { data: existingLoe, error: checkError } = await supabase
            .from('job_loe_details')
            .select('id')
            .eq('job_id', job.id)
            .maybeSingle();

          if (checkError) {
            console.error('❌ Error checking for existing LOE:', checkError);
          }
          console.log('🔍 LOE check result:', existingLoe ? `Found LOE: ${existingLoe.id}` : 'No existing LOE record');

          let dbError;
          if (existingLoe) {
            // Update existing LOE record
            console.log('📝 Updating existing LOE record:', existingLoe.id);
            const { error, data } = await supabase
              .from('job_loe_details')
              .update({
                job_number: result.jobNumber,
                valcre_job_id: numericJobId || null,
                updated_at: new Date().toISOString()
              })
              .eq('job_id', job.id)
              .select();

            console.log('📝 Update result:', { error, rowsAffected: data?.length || 0 });
            dbError = error;
          } else {
            // Insert new LOE record
            console.log('➕ Creating new LOE record for job:', job.id, 'with VAL:', result.jobNumber);
            const { error, data } = await supabase
              .from('job_loe_details')
              .insert({
                job_id: job.id,
                job_number: result.jobNumber,
                valcre_job_id: numericJobId || null,
                updated_at: new Date().toISOString()
              })
              .select();

            console.log('➕ Insert result:', { error, data });
            dbError = error;
          }

          if (dbError) {
            console.error('❌ Failed to save VAL number to database:', dbError);
            toast.error('Failed to save VAL number - please refresh page');
            return;
          }

          console.log('✅ VAL number saved to database successfully');

          // Save ALL current LOE details to database before updating ClickUp
          console.log('💾 Saving all LOE details to database...');
          const { error: loeDetailsSaveError } = await supabase
            .from('job_loe_details')
            .update({
              appraisal_fee: jobDetails?.appraisalFee || 0,
              retainer_amount: jobDetails?.retainerAmount || '',
              scope_of_work: jobDetails?.scopeOfWork || '',
              valuation_premises: jobDetails?.valuationPremises || '',
              property_rights_appraised: jobDetails?.propertyRightsAppraised || '',
              report_type: jobDetails?.reportType || '',
              delivery_date: jobDetails?.deliveryDate || null,
              internal_comments: jobDetails?.appraiserComments || '',
              delivery_comments: jobDetails?.deliveryComments || '',
              payment_comments: jobDetails?.paymentComments || '',
              payment_amount: jobDetails?.paymentAmount || null,
              // Bug A: payment_paid_date / retainer_paid_date are Postgres DATE columns — an empty
              // string ("") throws 22007 and aborts this save, blocking the "View in Valcre" flip.
              // Coerce blank → null.
              payment_paid_date: nullIfEmptyDate(jobDetails?.paymentPaidDate),
              retainer_paid_date: nullIfEmptyDate(jobDetails?.retainerPaidDate),
              // FIX 4 (2026-06-23) — effective_date / request_date / signed_date were MISSING from this
              // bulk "save all LOE details" write, so a value set by Fill Test Data (which calls
              // onUpdateDetails directly, not the per-field input/autoSaveField path) never reached the
              // DB through the Create-Valcre flow. The columns stayed null → Effective Date and Client
              // Requested Date rendered blank on reload (the date <input> reads jobDetails.effectiveDate /
              // .requestDate, which hydrate from these columns). Same DATE-column "" → null coercion as
              // the two above (else 22007 aborts the whole save).
              effective_date: nullIfEmptyDate(jobDetails?.effectiveDate),
              request_date: nullIfEmptyDate(jobDetails?.requestDate),
              signed_date: nullIfEmptyDate(jobDetails?.signedDate),
              updated_at: new Date().toISOString()
            })
            .eq('job_id', job.id);

          if (loeDetailsSaveError) {
            console.error('⚠️ Failed to save LOE details:', loeDetailsSaveError);
          } else {
            console.log('✅ All LOE details saved to database');
          }

          // Update ClickUp task with Section 2 (LOE details)
          console.log('🔄 Updating ClickUp task with LOE section...');
          try {
            // Get current user for OAuth token lookup
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError) {
              console.warn('⚠️ User authentication check failed:', authError.message);
              console.warn('⚠️ Edge Function will use fallback token');
            } else if (!user) {
              console.warn('⚠️ User not authenticated - Edge Function will use fallback token');
            } else {
              console.log('✅ User authenticated for ClickUp update:', user.id);
            }

            const { data: updateResult, error: updateError } = await supabase.functions.invoke(
              'update-clickup-task',
              {
                body: {
                  jobId: job.id,
                  userId: user?.id  // OAuth lookup, falls back to env var if null
                }
              }
            );

            if (updateError) {
              console.error('❌ Failed to update ClickUp task:', updateError);
              (isValcreJobNumber(jobDetails?.jobNumber) && (jobDetails as any)?.valcreJobId) && toast.warning('ClickUp task update failed - please refresh ClickUp');
            } else {
              console.log('✅ ClickUp task updated with LOE section:', updateResult);
              void 0 /* success: silent (Ben) */;
            }
          } catch (clickupError) {
            console.error('❌ Error updating ClickUp task:', clickupError);
            (isValcreJobNumber(jobDetails?.jobNumber) && (jobDetails as any)?.valcreJobId) && toast.warning('ClickUp task update failed - please refresh ClickUp');
          }

          // Refetch job data to ensure UI reflects latest database state
          if (refetchJobData) {
            console.log('🔄 Refetching job data to update button state...');
            await refetchJobData();
            console.log('✅ Job data refetched - button should now show "View in Valcre"');
          }

          void 0 /* success: silent (Ben) */;
        }
      } else {
        toast.error(result.error || 'Failed to create Valcre job');
      }
    } catch (error: any) {
      console.error('Error creating Valcre job:', error);
      toast.error('Failed to create Valcre job. Check console for details.');
    } finally {
      setIsCreatingJob(false);
      isCreatingJobLock.current = false; // release the Bug-C synchronous re-entry guard
    }
  };

  // Auto-save function with Valcre sync
  const autoSaveField = useCallback(async (fieldName: string, value: any) => {
    if (!job || !onUpdateDetails) return;

    // Per-field save/sync FAILURE toasts fire ONLY on a real Valcre job. No real job = just
    // playing/checking fields (no real persistence target) → silent (Ben's demo rule). The job
    // number is the natural separator. Field-state indicators still update either way.
    const hasRealJob = hasRealValcreJob(jobDetails);

    // Clear any existing debounce timer for this field
    if (debounceTimers.current[fieldName]) {
      clearTimeout(debounceTimers.current[fieldName]);
    }

    // Set field to saving state after 500ms
    debounceTimers.current[fieldName] = setTimeout(async () => {
      setFieldStates(prev => ({ ...prev, [fieldName]: 'saving' }));
      setIsSectionSaving(true);

      try {
        // EXPLICIT field name mapping: camelCase (component) → snake_case (database)
        // Testing Agent found: regex conversion was NOT executing in save flow
        const fieldMappings: Record<string, string> = {
          appraisalFee: 'appraisal_fee',
          retainerAmount: 'retainer_amount',
          appraiserComments: 'internal_comments',
          deliveryComments: 'delivery_comments',
          paymentComments: 'payment_comments',
          scopeOfWork: 'scope_of_work',
          propertyRightsAppraised: 'property_rights_appraised',
          reportType: 'report_type',
          valuationPremises: 'valuation_premises',
          deliveryDate: 'delivery_date',
          paymentAmount: 'payment_amount',
          paymentPaidDate: 'payment_paid_date',
          retainerPaidDate: 'retainer_paid_date',
          // New Valta loe-prep fields (app-side only — NOT synced to Valcre yet)
          jobStatus: 'job_status',
          authorizedUse: 'authorized_use',
          assignmentType: 'assignment_type',
          desktopReport: 'desktop_report',
          cmhcFinancing: 'cmhc_financing',
          valueScenarios: 'value_scenarios',
          transactionStatus: 'transaction_status',
          zoningStatus: 'zoning_status',
          purpose: 'purpose',
          effectiveDate: 'effective_date',
          analysisLevel: 'analysis_level',
          reportFormat: 'report_format',
          leadAppraiser: 'lead_appraiser',
          requestDate: 'request_date',
          signedDate: 'signed_date',
          // LOE-07 version selector + gap fields
          loeTemplateId: 'loe_template_id',
          currentUse: 'current_use',
          proposedUse: 'proposed_use',
          valueTimeframe: 'value_timeframe',
          approachesToValue: 'approaches_to_value',
          deliveryTime: 'delivery_time',
          clientDocuments: 'client_documents',
          previouslyAppraised: 'previously_appraised',
          statusOfImprovements: 'status_of_improvements',
        };

        // Use mapped field name if exists, otherwise use original
        const dbFieldName = fieldMappings[fieldName] || fieldName;

        // Bug A: these map to Postgres DATE columns — a cleared date input emits "" which throws
        // 22007 on write. Coerce blank → null for any date-typed column. (delivery_date is text in
        // the schema today but is included defensively in case the column type tightens.)
        const DATE_DB_COLUMNS = new Set([
          'retainer_paid_date', 'payment_paid_date', 'signed_date',
          'effective_date', 'request_date', 'delivery_date',
        ]);
        const saveValue = DATE_DB_COLUMNS.has(dbFieldName) ? nullIfEmptyDate(value) : value;

        // Always save to Supabase first
        const { error: supabaseError } = await supabase
          .from('job_loe_details')
          .upsert({
            job_id: job.id,
            [dbFieldName]: saveValue,  // Use mapped field name (date blanks coerced to null)
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'job_id'
          });

        if (supabaseError) {
          console.error('Supabase save error:', supabaseError);
          if (hasRealJob) toast.error(`Failed to save ${fieldName}`); // silent unless a real Valcre job
          setFieldStates(prev => ({ ...prev, [fieldName]: 'idle' }));
          setIsSectionSaving(false);
          return;
        }

        // Persisted to Supabase — baseline 'saved' (grey check). Upgraded to 'synced'/'sync-failed' below.
        setFieldStates(prev => ({ ...prev, [fieldName]: 'saved' }));

        // Additive ClickUp-card push: ANY persisted field change refreshes the existing card
        // (debounced, reuses saved clickup_task_id — never creates). update-clickup-task rebuilds the
        // WHOLE card from the DB by jobId, so we fire it on every autosave (gate removed 2026-06-23).
        // Independent of the Valcre sync below.
        pushCardUpdate();

        // Check if this field should also sync to Valcre
        const shouldSyncToValcre = VALCRE_SYNC_FIELDS.includes(fieldName) &&
                                    isValcreJobNumber(jobDetails?.jobNumber) &&
                                    jobDetails?.valcreJobId;

        if (shouldSyncToValcre) {
          // Prepare sync data for Valcre
          const syncData: any = {
            jobId: jobDetails.valcreJobId,
            jobNumber: jobDetails.jobNumber,
            updateType: 'loe_details',
            timestamp: new Date().toISOString(),
          };

          // Map field names to Valcre format
          if (fieldName === 'appraisalFee') syncData.appraisalFee = value;
          if (fieldName === 'retainerAmount') syncData.retainerAmount = value;
          if (fieldName === 'deliveryDate') syncData.deliveryDate = value;
          if (fieldName === 'appraiserComments') syncData.appraiserComments = value;
          if (fieldName === 'deliveryComments') syncData.deliveryComments = value;
          if (fieldName === 'paymentComments') syncData.paymentComments = value;
          if (fieldName === 'propertyRightsAppraised') syncData.propertyRightsAppraised = value;
          if (fieldName === 'scopeOfWork') syncData.scopeOfWork = value;
          if (fieldName === 'valuationPremises') syncData.valuationPremises = value;
          if (fieldName === 'reportType') syncData.reportType = value;
          if (fieldName === 'paymentAmount') syncData.paymentAmount = value;
          if (fieldName === 'paymentPaidDate') syncData.paymentPaidDate = value;
          // SEMANTIC-MISMATCH FLAG (2026-06-19): the dashboard label is now "Client Requested Date"
          // (client's special requested delivery date), but this field STILL writes Valcre Job.BidDate
          // (intake/bid date). Mapping kept intact per Ben — blank = nothing syncs. Do NOT rewire or
          // drop the Valcre mapping without Ben's go; revisit whether client-requested-delivery should
          // map to a different Valcre field (or none).
          if (fieldName === 'requestDate') syncData.requestDate = value;     // PRD-A #1 → Job.BidDate (see flag above)
          if (fieldName === 'signedDate') syncData.signedDate = value;       // PRD-A #2 → Job.AwardDate
          if (fieldName === 'effectiveDate') syncData.effectiveDate = value; // PRD-A #3 → Job.EffectiveDate
          // Auto-sync wiring (2026-06-04, AUTO-SYNC-WIRING-MAP) — server routes each to its verified target
          if (fieldName === 'authorizedUse') syncData.authorizedUse = value;         // → Job.IntendedUses (INTENDED_USES_MAP)
          if (fieldName === 'analysisLevel') syncData.analysisLevel = value;         // → Job.AnalysisLevel (ANALYSIS_LEVEL_MAP)
          if (fieldName === 'transactionStatus') syncData.transactionStatus = value; // → Custom 12424 (server resolves NAME→ID via VALTA_CUSTOM_FIELD_IDS in api/valcre.ts; live-verified 2026-06-10)
          if (fieldName === 'zoningStatus') syncData.zoningStatus = value;           // → Custom 12425 (server resolves NAME→ID via VALTA_CUSTOM_FIELD_IDS in api/valcre.ts; live-verified 2026-06-10)
          if (fieldName === 'valueScenarios') syncData.valueScenarios = value;       // → CF12414 via setValtaCustomFields (Fix 1: legacy CF11563/11564 path removed)
          if (fieldName === 'statusOfImprovements') syncData.statusOfImprovements = value; // → CF12407 (wired 2026-06-15 — was registry-mapped but never sent)
          if (fieldName === 'valueTimeframe') syncData.valueTimeframe = value;             // → CF12419 (wired 2026-06-15 — was registry-mapped but never sent)
          if (fieldName === 'approachesToValue') syncData.approachesToValue = value;       // → CF12415 MultiOption (wired 2026-06-15, 2nd batch; server converts comma-joined → option-ID array)
          // Fix 4: dashboard sends currentUse/proposedUse; server expects currentUseImprovements/proposedUseImprovements
          // (those are the VALTA_CUSTOM_FIELD_IDS keys that setValtaCustomFields iterates).
          // Option labels match CF12410/12411 exactly — no label reconciliation needed.
          if (fieldName === 'currentUse') syncData.currentUseImprovements = value;   // → CF12410 (currentUseImprovements)
          if (fieldName === 'proposedUse') syncData.proposedUseImprovements = value; // → CF12411 (proposedUseImprovements)

          console.log(`Syncing ${fieldName} to Valcre:`, syncData);
          const result = await sendToValcre(syncData);

          // Determine per-field sync outcome from the readback-backed response (HTTP 200 ≠ success):
          // a native-PATCH rejection (nativePatchError), a readback mismatch, or a failed custom write
          // all count as sync-failed — the amber state surfaces the otherwise-silent rejection.
          const nativeBad = result.nativeVerified
            ? Object.values(result.nativeVerified).some((v: any) => v && v.ok === false)
            : false;
          const customBad = !!result.customFields && result.customFields.failed > 0;
          // "Patch object can't be empty" is NOT a real failure — it just means this sync touched
          // only CUSTOM fields (e.g. valueScenarios / statusOfImprovements) so the native PATCH body
          // was empty. The custom write still landed (verified: customFields.failed === 0). Treating
          // it as a failure is the false-positive toast. Only a GENUINE native rejection counts, so
          // every popup the user sees is a real one.
          // NARROW match (ui-designer catch): only the specific empty-patch string, NOT any error
          // containing "empty" — else a real rejection like "value cannot be empty for required field X"
          // would be falsely suppressed (a false-negative, the opposite of honest popups).
          const emptyNativePatch = !!result.nativePatchError && /patch object can.?t be empty/i.test(result.nativePatchError);
          const realNativePatchError = !!result.nativePatchError && !emptyNativePatch;
          const syncFailed = !result.success || realNativePatchError || nativeBad || customBad;
          if (syncFailed) {
            console.error('Valcre sync failed:', result.nativePatchError || result.error, result);
            if (hasRealJob) toast.error(`Failed to sync ${getFieldDisplayName(fieldName)} to Valcre`); // silent unless a real Valcre job
            setFieldStates(prev => ({ ...prev, [fieldName]: 'sync-failed' }));
          } else {
            setFieldStates(prev => ({ ...prev, [fieldName]: 'synced' }));
          }
        } else {
          // Field saved to Supabase but no Valcre job yet — stays 'saved' (grey check).
        }

        // Section spinner off — leave the per-field state (saved/synced/sync-failed) intact for the indicator.
        setIsSectionSaving(false);

      } catch (error: any) {
        console.error('Auto-save error:', error);
        if (hasRealJob) toast.error(`Failed to save ${fieldName}`); // silent unless a real Valcre job
        setFieldStates(prev => ({ ...prev, [fieldName]: 'idle' }));
        setIsSectionSaving(false);
      }
    }, 500); // 500ms debounce
  }, [job, jobDetails, onUpdateDetails, VALCRE_SYNC_FIELDS, pushCardUpdate]);

  // Part C — Cascade Effect: re-derive valueScenarios whenever statusOfImprovements or authorizedUse changes.
  // Writes result to jobDetails.valueScenarios via onUpdateDetails + persists via autoSaveField.
  const statusOfImprovements = (jobDetails as any).statusOfImprovements as string | undefined;
  // UNIFIED 2026-06-12 (Ben-approved): the cascade's Insurance override reads the SAME field the user
  // sees + sets in Section 1 — `intendedUse` (labelled "Authorized Use"). It lives on the JOB object
  // (job_submissions), updated via onUpdateJob — NOT on jobDetails. Reading it here means a manual
  // Section-1 "Insurance" pick fires the override, and V4 writing job.intendedUse colors Section 1 orange.
  const authorizedUse = (job as any)?.intendedUse as string | undefined;

  useEffect(() => {
    if (!onUpdateDetails) return;
    const scenarios = deriveValueScenarios(statusOfImprovements, authorizedUse);
    const joined = scenarios.join(', ');
    // Loop guard: only write + sync when value has actually changed
    if (joined === (jobDetails.valueScenarios || '')) return;
    onUpdateDetails({ valueScenarios: joined });
    autoSaveField('valueScenarios', joined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusOfImprovements, authorizedUse]);

  // Part D — Cascade Effect: re-derive approachesToValue whenever statusOfImprovements or authorizedUse changes.
  // NOTE: approachesToValue is NOW IN VALCRE_SYNC_FIELDS (wired 2026-06-15, 2nd batch → CF12415 MultiOption).
  // The autoSaveField('approachesToValue', ...) below both persists to Supabase AND triggers the Valcre sync;
  // generateLOE.ts still reads jobDetails.approachesToValue directly for the LOE doc.
  useEffect(() => {
    if (!onUpdateDetails) return;
    const approaches = deriveApproaches(statusOfImprovements, authorizedUse);
    const joinedAppr = approaches.join(', ');
    if (joinedAppr === ((jobDetails as any).approachesToValue || '')) return; // loop guard
    onUpdateDetails({ approachesToValue: joinedAppr } as any);
    autoSaveField('approachesToValue', joinedAppr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusOfImprovements, authorizedUse]);

  // Part E — Cascade Effect: re-derive propertyRightsAppraised whenever Property Type, Subtype, or Tenancy changes.
  // propertyRightsAppraised IS in VALCRE_SYNC_FIELDS — autoSaveField triggers Valcre sync via the existing if-chain.
  const primaryPropertyType = (job?.propertyType || '').split(',')[0].trim();
  useEffect(() => {
    if (!onUpdateDetails) return;
    // Property Rights is SOURCE-driven (Type / Subtype / Tenancy), NOT scenario-driven — so it derives
    // as soon as Fill inserts the sources (lit yellow), independent of the scenario picker. This mirrors
    // the mock's decoupling: the picker drives Status / Value Scenarios / Approaches; Fill drives the
    // source chain + Property Rights.
    const rights = derivePropertyRights(primaryPropertyType, (jobDetails as any).propertySubtype, (jobDetails as any).tenancy);
    if (!rights) return; // no match -> leave field as-is ("Pending"); don't blank an existing value
    if (rights === (jobDetails.propertyRightsAppraised || '')) return; // loop guard
    onUpdateDetails({ propertyRightsAppraised: rights });
    autoSaveField('propertyRightsAppraised', rights);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryPropertyType, (jobDetails as any).propertySubtype, (jobDetails as any).tenancy]);


  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(timer => clearTimeout(timer));
      if (clickupPushTimer.current) clearTimeout(clickupPushTimer.current);
    };
  }, []);

  // Currency formatting helpers
  const formatCurrency = (value: string | number): string => {
    if (!value) return '';
    const numericValue = String(value).replace(/[^0-9.]/g, '');
    const num = parseFloat(numericValue);
    if (isNaN(num)) return '';
    // Format with 2 decimal places and thousands separators
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const unformatCurrency = (value: string): string => {
    return value.replace(/[^0-9.]/g, '');
  };

  // Handle currency field changes (appraisalFee, retainerAmount) with auto-save
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onUpdateDetails) return;
    const { name, value } = e.target;

    // Store raw input value in local state during editing
    if (name === 'appraisalFee') {
      setEditingAppraisalFee(value);
    } else if (name === 'retainerAmount') {
      setEditingRetainerAmount(value);
    } else if (name === 'paymentAmount') {
      setEditingPaymentAmount(value);
    }

    // Update the underlying value
    const rawValue = unformatCurrency(value);
    const numericValue = rawValue ? parseFloat(rawValue) : 0;

    // CRITICAL: retainerAmount stored as string in DB, appraisalFee/paymentAmount as number
    const processedValue = name === 'retainerAmount' ? numericValue.toString() : numericValue;

    onUpdateDetails({
      [name]: processedValue
    });
  };

  const handleCurrencyBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Clear editing state on blur - field will show formatted value again
    if (name === 'appraisalFee') {
      setEditingAppraisalFee(null);
    } else if (name === 'retainerAmount') {
      setEditingRetainerAmount(null);
    } else if (name === 'paymentAmount') {
      setEditingPaymentAmount(null);
    }

    const rawValue = unformatCurrency(value);
    const numericValue = rawValue ? parseFloat(rawValue) : 0;

    // CRITICAL: retainerAmount must be saved as string, appraisalFee/paymentAmount as number
    // Database schema: retainer_amount is text, appraisal_fee/payment_amount is numeric
    const processedValue = name === 'retainerAmount' ? numericValue.toString() : numericValue;
    autoSaveField(name, processedValue);
  };

  // Handle input changes with auto-save
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!onUpdateDetails) return;
    const { name, value, type } = e.target;
    let processedValue: string | number = value;

    // Convert numeric values - handle appraisalFee specifically
    if ((type === 'number' || name === 'appraisalFee') && value !== '') {
      // Remove any non-numeric characters (like $ or ,)
      const cleanValue = value.replace(/[^0-9.]/g, '');
      processedValue = cleanValue ? parseFloat(cleanValue) : 0;
    }

    // Update UI immediately
    onUpdateDetails({
      [name]: processedValue
    });

    // Trigger auto-save for fields that should auto-save
    if (name === 'appraiserComments') {
      autoSaveField(name, processedValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let processedValue: string | number = value;

    if ((type === 'number' || name === 'appraisalFee') && value !== '') {
      const cleanValue = value.replace(/[^0-9.]/g, '');
      processedValue = cleanValue ? parseFloat(cleanValue) : 0;
    }

    autoSaveField(name, processedValue);
  };

  // Handle select changes with auto-save
  const handleSelectChange = (value: string, name: string) => {
    if (!onUpdateDetails) return;
    onUpdateDetails({
      [name]: value
    });
    autoSaveField(name, value);
  };

  // Handle multi-select changes
  const handleMultiSelectChange = (values: string[], name: string) => {
    if (!onUpdateDetails) return;
    // Join the array into a comma-separated string for storage
    const stringValue = values.join(',');
    onUpdateDetails({
      [name]: stringValue
    });
    autoSaveField(name, stringValue);
  };

  // Helper function to ensure scopeOfWork is properly formatted
  const getScopeOfWork = () => {
    const scope = jobDetails.scopeOfWork;
    if (Array.isArray(scope)) {
      return scope;
    } else if (typeof scope === 'string') {
      return scope;
    }
    return [];
  };

  // Generate preview first (or resend existing)
  const handleGeneratePreview = async () => {
    // Check if Valcre job number exists
    if (!isValcreJobNumber(jobDetails?.jobNumber)) {
      toast.error("Please create a Valcre job first before generating LOE");
      return;
    }

    setIsGenerating(true);
    // Create Document/Email = a brand-new instance: no id (first Save Draft inserts), editable,
    // regenerated from the template (not a reopened saved instance).
    setCurrentContractId(null);
    setPreviewReadOnly(false);
    setPreviewExisting(false);

    try {
      // If already sent, we're resending - generate fresh HTML
      if (alreadySent) {
        const html = await generateLOEHTML(job, jobDetails);
        setPreviewHTML(html);
        setShowPreview(true);
        void 0 /* success: silent (Ben) */;
      } else {
        // First time sending - generate preview
        const html = await generateLOEHTML(job, jobDetails);
        setPreviewHTML(html);
        setShowPreview(true);
        void 0 /* success: silent (Ben) */;

        // Mark LOE preparation as complete in ClickUp (all required fields are now filled)
        if (jobDetails?.clickupTaskId || job.clickupTaskId) {
          const clickupTaskId = jobDetails?.clickupTaskId || job.clickupTaskId;
          console.log('📋 Marking LOE prep complete in ClickUp:', clickupTaskId);
          try {
            await markLOEPrepComplete(clickupTaskId);
            console.log('✅ ClickUp subtask updated: LOE preparation complete');
          } catch (error) {
            console.warn('Failed to update ClickUp subtask:', error);
          }
        }
      }
    } catch (error) {
      console.error("Error generating preview:", error);
      toast.error("Failed to generate document preview");
    } finally {
      setIsGenerating(false);
    }
  };

  // Send after approval. emailOverride carries the composed ② Email content (subject + body).
  const handleApproveAndSend = async (
    overrideEmail?: string,
    emailOverride?: { subject: string; bodyHtml: string },
  ) => {
    // Double-send guard: ignore a second dispatch while one is in flight.
    if (isSending) return;
    setIsSending(true);

    try {
      const recipientEmail = overrideEmail || job.clientEmail;
      const jobToSend = overrideEmail ? { ...job, clientEmail: overrideEmail } : job;

      // Guarantee a saved contract row BEFORE sending. If we're sending a brand-new (never-saved)
      // document, there's no job_contracts row yet, so the send could only ever produce a doc-less
      // email pill — the contract would never appear in Saved Documents. Insert a draft carrying the
      // edited HTML now, so (a) Open works (the row holds the HTML that went out) and (b) the next
      // step can promote that same row to 'sent'. Reuses currentContractId when one already exists
      // (reopened draft) so we update the SAME row rather than forking a duplicate.
      let contractId = currentContractId;
      if (!contractId && previewHTML) {
        const monthDay = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const client = job.clientLastName || job.clientFirstName || 'Client';
        const saved = await saveJobContract({
          jobId: job.id,
          name: `LOE — ${client} — ${monthDay}`,
          editedHtml: previewHTML,
          contractType: 'LOE',
          state: 'draft',
        });
        if (saved.success && saved.id) {
          contractId = saved.id;
          setCurrentContractId(saved.id);
        } else {
          console.error('saveJobContract (pre-send) failed:', saved.error);
        }
      }

      // DocuSeal submission ONLY (sendEmail=false) — we send the composed email ourselves below.
      // This is the double-send fix: generateAndSendLOE no longer also fires its own email here.
      const result = await generateAndSendLOE(jobToSend, jobDetails, previewHTML, false);

      if (result.success && result.submissionId && result.signingLink) {
        // Send the composed cover-note email with the now-resolved signing link.
        const emailSent = await sendLOEEmail(
          recipientEmail,
          `${job.clientFirstName} ${job.clientLastName}`,
          result.signingLink,
          job.propertyAddress,
          emailOverride,
        );

        if (emailSent) {
          // Promote the saved contract row to 'sent' and record the DocuSeal submission id, so the
          // row surfaces in Saved Documents with a SENT badge (and the signed event can later match
          // it by submission id). Then refresh the list so it appears immediately.
          if (contractId) {
            const promoted = await markContractSent(contractId, result.submissionId);
            if (!promoted.success) {
              console.error('markContractSent failed:', promoted.error);
            }
            refreshContracts();
          }
          // Persist the per-send email INSTANCE as 'sent' (job-scoped; never touches the default).
          if (emailOverride) {
            const finalSubject = emailOverride.subject.split('{{signing_link}}').join(result.signingLink);
            const finalBody = emailOverride.bodyHtml.split('{{signing_link}}').join(result.signingLink);
            const saved = await saveJobEmailInstance({
              jobId: job.id,
              contractId: contractId,
              recipientEmail,
              subject: finalSubject,
              bodyHtml: finalBody,
              state: 'sent',
              docusealSubmissionId: result.submissionId,
            });
            // Surface a persistence failure instead of swallowing it: the email DID
            // send, but the per-send record didn't save — the client-view history
            // would be silently incomplete. Make it visible (this is the failure the
            // first build hid behind an ignored {success,error}).
            if (!saved.success) {
              console.error('saveJobEmailInstance failed:', saved.error);
              toast.error(`Email sent, but saving the record failed: ${saved.error ?? 'unknown error'}`);
            }
            void refreshEmailInstances(); // T3: keep the job's instance list live after a send
          }
          if (onUpdateDetails) onUpdateDetails({ docusealSubmissionId: result.submissionId });
          setShowPreview(false);
        } else {
          // Email failed → do NOT mark sent (no instance row, no submission flag). Surface the link.
          toast.error(`Email failed to send. Please share this link manually: ${result.signingLink}`);
        }
      } else {
        toast.error(result.error || "Failed to send LOE");
      }
    } catch (error) {
      console.error("Error sending for e-signature:", error);
      toast.error("An error occurred while sending LOE");
    } finally {
      setIsSending(false);
    }
  };

  // Part B — Cascade Options picker handler
  // Picks a version, sets statusOfImprovements + per-version overrides.
  // The cascade useEffect above then derives and writes valueScenarios.
  const handleCascadeVersion = (version: string) => {
    if (!onUpdateDetails) return;
    // Stop the Fill-Test-Data attention pulse the moment a version is picked.
    document.getElementById('cascade-options-anchor')?.classList.remove('cascade-pulse');

    // Authorized Use (intendedUse) lives on the JOB object — write it via onUpdateJob (the same path
    // Section 1 uses), so Section 1 sees "Insurance" + colors orange. If we're LEAVING the V4 override,
    // restore the value we stashed when V4 was entered.
    const leavingOverride = cascadeVersion === 'V4' && (job as any)?.intendedUse === 'Insurance';
    const restoreAuthorizedUse = () => {
      if (leavingOverride && onUpdateJob) onUpdateJob({ intendedUse: preInsuranceIntendedUse.current || '' } as any);
    };

    if (version === '__CLEAR__') {
      // Scoped Clear — resets ONLY the cascade cluster; restores Authorized Use if V4 had overridden it.
      setCascadeVersion('');
      setCascadePicked(false);
      onUpdateDetails({ statusOfImprovements: '', valueScenarios: '', approachesToValue: '' } as any);
      autoSaveField('statusOfImprovements', '');
      autoSaveField('valueScenarios', '');
      autoSaveField('approachesToValue', '');
      restoreAuthorizedUse();
      return;
    }
    setCascadePicked(true); // lock Value Scenarios display to derived result
    setCascadeVersion(version); // hold the picked version so the picker label persists (e.g. "V2 — Under Renovation")

    // SCENARIO-ONLY, mirroring the mock: V1–V3 set Status of Improvements; V4 DASHES Status and sets
    // Authorized Use → Insurance. Value Scenarios / Approaches / Property Rights all DERIVE via the
    // effects — the picker no longer force-sets premise / scope / rights / asset-condition (dropped per
    // Ben for exact mock parity). Status is ONE batched onUpdateDetails (stale-merge guard); Authorized
    // Use goes through onUpdateJob (its real store).
    if (version === 'V1') {
      onUpdateDetails({ statusOfImprovements: 'Improved - Completed' } as any);
      autoSaveField('statusOfImprovements', 'Improved - Completed');
      restoreAuthorizedUse();
    } else if (version === 'V2') {
      onUpdateDetails({ statusOfImprovements: 'Improved - Under Renovation' } as any);
      autoSaveField('statusOfImprovements', 'Improved - Under Renovation');
      restoreAuthorizedUse();
    } else if (version === 'V3') {
      onUpdateDetails({ statusOfImprovements: 'Proposed - Improved Land (Demolition Required)' } as any);
      autoSaveField('statusOfImprovements', 'Proposed - Improved Land (Demolition Required)');
      restoreAuthorizedUse();
    } else if (version === 'V4') {
      // Stash the real Authorized Use before the Insurance override (only on a fresh entry into V4).
      if (cascadeVersion !== 'V4') preInsuranceIntendedUse.current = (job as any)?.intendedUse || '';
      onUpdateDetails({ statusOfImprovements: '' } as any); // Status dashes on the Insurance scenario
      autoSaveField('statusOfImprovements', '');
      if (onUpdateJob) onUpdateJob({ intendedUse: 'Insurance' } as any); // → Section 1 shows Insurance + orange
    }
  };

  // "Insert from data" toggle — HIGHLIGHT-ONLY (Ben 2026-06-16). This checkbox only shows/hides the
  // yellow "these are the mapped source fields" indicator; it must NEVER add or remove the underlying
  // field DATA. (Previously OFF emptied Property Type / Subtype / Tenancy / Property Rights — a real
  // data-loss bug, the same class as the cascade-switch clobber.) Section 2's mapped display already
  // shows/hides off this same flag, so toggling the flag alone is all that's needed. Data stays put.
  const handleInsertFromData = (checked: boolean) => {
    setInsertFromData?.(checked);
  };

  // Render a cascade-cluster derived value, mirroring the mock:
  //  • before any scenario is picked (idle)  → the dim "from X" placeholder
  //  • picked but this field isn't driven      → the dash "—" (the dash rule)
  //  • has a value                             → the value, truncated with a hover title
  //  • Test-Mode + driven                       → provenance tint on the box (else unshaded at rest)
  const renderDerived = (
    value: string,
    placeholder: string,
    tintKey: keyof typeof PROV | null,
    tooltip: string,
    maxW = 'max-w-[220px]',
  ): React.ReactNode => {
    const tinted = testMode ? tintKey : null;
    // Dark text in light mode (Ben), themed-light only in dark mode when NOT on a pastel chip.
    const valueTextClass = tinted ? 'text-slate-900' : 'text-slate-900 dark:text-slate-100';
    let body: React.ReactNode;
    if (cascadeIdle) body = <span className="text-zinc-400">{placeholder}</span>;
    else if (value) body = <span className={`truncate min-w-0 flex-1 ${valueTextClass}`}>{value}</span>;
    else body = <span className="text-zinc-400">{cascadePicked ? '—' : placeholder}</span>;
    return (
      <div style={provStyle(tinted)} className={maxW} title={value || tooltip}>
        {body}
      </div>
    );
  };

  // ClickUp task URL derived from job fields
  const clickupTaskUrl = job.clickup_task_url || (job as any).clickupTaskUrl || '';
  const clickupTaskId = job.clickup_task_id || (job as any).clickupTaskId || '';

  // RULE 1 — test tools self-disable on a real (live-synced) Valcre job.
  // (isLiveValcreJob / liveJobToast removed 2026-06-12 — cascade picker no longer locks on a live
  //  Valcre job; it stays active as a test/demo tool, consistent with all other dashboard fields.)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full border border-gray-400 dark:border-white/20 rounded-lg dark:bg-black/15">
      <CollapsibleTrigger className={`${sectionTriggerStyle} flex items-center justify-between w-full px-4 py-3 bg-gray-200 dark:bg-gray-800 rounded-t-lg`}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            <SectionTitle title="LOE Quote & Valuation Details" />
          </div>
          {isSectionSaving && (
            <Loader2 className="h-4 w-4 text-gray-400 dark:text-muted-foreground animate-spin mr-2" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className={sectionContentStyle}>
        {/* Action Buttons Row — Part F: View in Valcre · View in ClickUp · Create Document/Email.
            These PRODUCE assets for the job. The Asset Studio (CONFIGURE templates) deliberately does
            NOT live here — it's a quiet cog at the PAGE TOP (JobDetailView, under the ribbon, far
            right), opened via the 'apr:open-asset-studio' window event so it's never a peer of these. */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-2">
            {/* Create/View Valcre Job Button - Transforms after creation */}
            {isValcreJobNumber(jobDetails?.jobNumber) ? (
              // Job already created - show appropriate button based on status
              isPendingValcreJob(jobDetails?.jobNumber) ? (
                // PENDING job - show "Check Valcre Dashboard" button
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://app.valcre.com/Jobs', '_blank')}
                  className="bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100 shadow-sm"
                  title="Job submitted to Valcre - check dashboard for VAL number"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Check Valcre Dashboard
                </Button>
              ) : jobDetails?.valcreJobId ? (
                // We have the full job ID - show clickable button
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`https://app.valcre.com/job/edit/${jobDetails.valcreJobId}#job`, '_blank')}
                  className="border border-border dark:border-white/30 bg-background dark:bg-transparent text-foreground hover:bg-muted dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/50 hover:text-foreground transition-colors text-sm font-medium"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View in Valcre
                </Button>
              ) : (
                // We have VAL number but waiting for job ID from webhook
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled
                  className="border border-border dark:border-white/30 bg-background dark:bg-transparent text-foreground cursor-not-allowed text-sm font-medium"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Valcre Job: {jobDetails.jobNumber}
                </Button>
              )
            ) : canCreateValcreJob ? (
              // Can create job - show active button
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCreateValcreJob}
                className="!border-2 !border-emerald-500 dark:!border-emerald-400/60 !bg-background dark:!bg-transparent !text-foreground hover:!bg-emerald-50 dark:hover:!bg-emerald-500/10 transition-colors text-sm font-medium"
                disabled={isCreatingJob}
              >
                {isCreatingJob ? 'Creating...' : 'Create Valcre Job'}
              </Button>
            ) : (
              // Cannot create yet - show disabled with tooltip
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={true}
                        className="!border !border-border dark:!border-white/30 !bg-transparent !text-foreground dark:!text-white cursor-not-allowed text-sm font-medium"
                      >
                        Create Valcre Job
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <div className="space-y-1">
                      <p className="font-semibold">Fill required fields first:</p>
                      <ul className="text-xs list-disc list-inside">
                        {getMissingFieldsForValcre.map((field, idx) => (
                          <li key={idx}>{field}</li>
                        ))}
                      </ul>
                      <p className="text-xs mt-2 text-gray-400">Use "Fill Test Data" button above to quickly populate fields</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* View in ClickUp — Part F: middle button, links to existing task or opens ClickUpAction */}
            {(clickupTaskUrl || clickupTaskId) ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(clickupTaskUrl || `https://app.clickup.com/t/${clickupTaskId}`, '_blank')}
                className="border border-border dark:border-white/30 bg-background dark:bg-transparent text-foreground hover:bg-muted dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/50 hover:text-foreground transition-colors text-sm font-medium"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View in ClickUp
              </Button>
            ) : (
              /* No task yet — render the create-task widget inline */
              <ClickUpAction
                job={job}
                jobDetails={jobDetails}
                onTaskCreated={async () => {
                  console.log('🔄 [ClickUp] Task created - refetching job data...');
                  if (refetchJobData) {
                    await refetchJobData();
                    console.log('✅ [ClickUp] Job data refetched - button state should update');
                  } else {
                    console.warn('⚠️ [ClickUp] No refetchJobData function available');
                  }
                }}
              />
            )}

            {/* Asset Folders — two states. CREATED (job has a folder URL): green "active" look that
                OPENS the existing set (never re-creates). NOT YET: plain outline that creates once. */}
            {(job as any)?.sharepointFolderUrl ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open((job as any).sharepointFolderUrl, '_blank')}
                className="border border-emerald-500/70 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-400/40 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors text-sm font-medium"
                title="Asset folders exist — click to open in SharePoint"
              >
                <FolderOpen className="h-4 w-4 mr-1" />
                Asset Folders
                <CheckCircle className="h-3.5 w-3.5 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCreateAssetFolders}
                disabled={isCreatingAssetFolders || !isValcreJobNumber(jobDetails?.jobNumber)}
                className="border border-border dark:border-white/30 bg-background dark:bg-transparent text-foreground hover:bg-muted dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/50 hover:text-foreground transition-colors text-sm font-medium"
              >
                {isCreatingAssetFolders ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <FolderOpen className="h-4 w-4 mr-1" />
                )}
                {isCreatingAssetFolders ? 'Creating...' : 'Asset Folders'}
              </Button>
            )}

            {/* E-Signature Button - Only visible when REAL Valcre job exists (has valcre_job_id) */}
            {hasRealValcreJob(jobDetails) ? (
              validation.missingFields.length > 0 && !alreadySent ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          onClick={handleGeneratePreview}
                          disabled={true}
                          className="border border-border dark:border-white/30 bg-background dark:bg-transparent text-foreground cursor-not-allowed text-sm font-medium"
                        >
                          <FileSignature className="h-4 w-4 mr-1" />
                          Create Document/Email
                        </Button>
                        <AlertCircle className="absolute -top-1 -right-1 h-4 w-4 text-amber-500" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      <div className="space-y-1">
                        <p className="font-semibold">Missing required fields:</p>
                        <ul className="text-xs list-disc list-inside">
                          {validation.missingFields.map((field, idx) => (
                            <li key={idx}>{field}</li>
                          ))}
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : !isValcreJobNumber(jobDetails?.jobNumber) ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={true}
                          className="border border-border dark:border-white/30 bg-background dark:bg-transparent text-foreground cursor-not-allowed text-sm font-medium"
                        >
                          <FileSignature className="h-4 w-4 mr-1" />
                          Create Document/Email
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-sm">
                      <p className="text-sm">Please create a Valcre job first to generate the LOE</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGeneratePreview}
                  disabled={!validation.isValid || isSending || isGenerating}
                  className={alreadySent
                    ? "border border-amber-300 dark:border-amber-500/30 bg-transparent text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:border-amber-400 dark:hover:border-amber-500/50 transition-colors text-sm font-medium"
                    : "border-2 border-emerald-500 dark:border-emerald-400/60 bg-background dark:bg-transparent text-foreground hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors text-sm font-medium"}
                >
                  <FileSignature className="h-4 w-4 mr-1" />
                  {isGenerating ? "Generating..." : "Create Document/Email"}
                </Button>
              )
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={true}
                className="border border-border dark:border-white/30 bg-background dark:bg-transparent text-foreground cursor-not-allowed text-sm font-medium"
              >
                <FileSignature className="h-4 w-4 mr-1" />
                Create Document/Email
              </Button>
            )}
          </div>

        </div>

        {/* PRD-APR-LOE-03 D2 (INV-0 + INV-4) + LOE-saved-docs consolidation (2026-06-23): the separate
            "Saved Documents/Email — Emails" PILL block is REMOVED. Everything — draft / sent / signed
            documents AND document-less emails — now lives as ROWS inside the single Saved Documents
            expandable list below, each with its own status badge + Open. Doc-less emails (contract_id
            === null) surface as rows tagged "Email" rather than a separate pill strip. */}

        {/* Doc-less compose/preview modal (Wave D1 — separate instance from the with-document path). */}
        <EmailComposeModal
          isOpen={docLessOpen}
          onClose={() => setDocLessOpen(false)}
          onBack={() => setDocLessOpen(false)}
          job={job}
          jobDetails={jobDetails}
          recipientEmail={job?.clientEmail || ''}
          isSending={docLessSending}
          onSend={handleSendDocLess}
          initialTemplate={docLessTemplate ?? undefined}
          onSaveDraft={async (subject, bodyHtml) => {
            await persistEmailInstance({ subject, bodyHtml, recipientEmail: job?.clientEmail || '', contractId: null, state: 'draft' });
          }}
          docTemplateId={null}
        />

        {/* Saved Documents (Version C — type-tab / pill filter). FULL-WIDTH, collapsible toggle
            WITHIN this section (default open; collapse to hide the list when there are many).
            Persistent type pills incl. empty placeholders; tap a pill to filter; 'All' shows
            everything drafts-first. ONE consistent "Open" per row — the badge carries draft/sent
            and behavior branches (draft → editable editor, sent → read-only preview). */}
        {(savedContracts.length > 0 || emailInstances.some(e => e.contract_id === null)) && (() => {
          // CONSOLIDATED list model (2026-06-23): one expandable list carries BOTH saved contracts
          // (draft / sent / signed) AND document-less emails (contract_id === null) as rows. Emails
          // that belong to a contract are already represented by that contract's row, so only the
          // doc-less ones surface here (no duplication). Each row is a discriminated union so the
          // renderer can branch contract-vs-email behaviour.
          type ContractRow = { kind: 'contract'; id: string; contract: JobContract };
          type EmailRow = { kind: 'email'; id: string; email: EmailInstance };
          type ListRow = ContractRow | EmailRow;

          const docLessEmails = emailInstances.filter(e => e.contract_id === null);

          const contractRows: ListRow[] = savedContracts.map(c => ({ kind: 'contract', id: c.id, contract: c }));
          const emailRows: ListRow[] = docLessEmails.map(e => ({ kind: 'email', id: e.id, email: e }));
          const allRows: ListRow[] = [...contractRows, ...emailRows];

          // Type key/label for any row: contracts via typeOf(); doc-less emails are always 'email'.
          const rowType = (r: ListRow): { key: string; label: string } =>
            r.kind === 'contract' ? typeOf(r.contract) : DOC_TYPES[2]; // DOC_TYPES[2] = Email

          // Sort order within a group: drafts (actionable) above sent/signed (archive). updated_at-desc
          // from the queries gives newest-first; this stable sort just floats drafts to the top.
          const orderWeight = (r: ListRow): number => {
            const st = r.kind === 'contract' ? r.contract.state : r.email.state;
            return st === 'draft' ? 0 : 1;
          };
          const draftFirst = (arr: ListRow[]) =>
            [...arr].sort((a, b) => orderWeight(a) - orderWeight(b));

          // Per-type counts + the pill set: base registry ∪ any unregistered type found in data.
          const counts = new Map<string, number>();
          for (const r of allRows) {
            const k = rowType(r).key;
            counts.set(k, (counts.get(k) ?? 0) + 1);
          }
          const seen = new Set<string>();
          const extraTypes = allRows
            .map(rowType)
            .filter(t => !DOC_TYPES.some(d => d.key === t.key))
            .filter(t => (seen.has(t.key) ? false : (seen.add(t.key), true)));
          const pillTypes = [...DOC_TYPES, ...extraTypes];

          const visible = typeFilter === 'all'
            ? allRows
            : allRows.filter(r => rowType(r).key === typeFilter);
          const rows = draftFirst(visible);

          const pillClass = (active: boolean) =>
            `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors ${
              active
                ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white'
                : 'bg-background text-muted-foreground border-border hover:border-gray-400'}`;
          const countClass = (active: boolean) =>
            `text-[10px] font-semibold rounded-full px-1.5 ${
              active ? 'bg-white/25 text-white dark:bg-gray-900/20 dark:text-gray-900' : 'bg-muted text-muted-foreground'}`;

          // Shared status-badge style: signed (emerald, terminal) > sent (green) > draft (blue).
          const badgeClass = (state: string) =>
            `text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded-full ${
              state === 'signed'
                ? 'bg-emerald-600 text-white dark:bg-emerald-600 dark:text-white'
                : state === 'sent'
                ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400'}`;

          return (
            <div className="mb-6 w-full">
              <div className="rounded-md border border-border bg-muted/30 p-3">
                <div className="text-xs font-semibold text-foreground mb-2">
                  Saved Documents/Email ({allRows.length})
                </div>

                {/* Type pills — the selection IS the expand/collapse. Nothing selected on load =
                    collapsed (just the pills + counts). Tap a pill to expand that type's docs;
                    tap the active pill again to collapse. Pills persist even at 0 docs. */}
                <div className="flex flex-wrap gap-1.5">
                  <button type="button" onClick={() => setTypeFilter(f => f === 'all' ? '' : 'all')} className={pillClass(typeFilter === 'all')}>
                    All
                    <span className={countClass(typeFilter === 'all')}>{allRows.length}</span>
                  </button>
                  {pillTypes.map(t => {
                    const active = typeFilter === t.key;
                    return (
                      <button key={t.key} type="button" onClick={() => setTypeFilter(f => f === t.key ? '' : t.key)} className={pillClass(active)}>
                        {t.label}
                        <span className={countClass(active)}>{counts.get(t.key) ?? 0}</span>
                      </button>
                    );
                  })}
                </div>

                {/* List — only when a pill is selected (the selection is the expand/collapse). */}
                {typeFilter !== '' && (rows.length === 0 ? (
                  <div className="text-xs text-muted-foreground italic px-1 pt-3 pb-1">
                    {typeFilter === 'all'
                      ? 'No documents yet.'
                      : `No ${pillTypes.find(t => t.key === typeFilter)?.label ?? ''} documents yet.`}
                  </div>
                ) : (
                  <div className="space-y-0.5 mt-3">
                    {rows.map((r) => {
                      if (r.kind === 'email') {
                        // Doc-less email row: tagged "Email", state badge, Open previews the email
                        // body HTML read-only (no contractId, no signed PDF). No delete (records of
                        // what went out aren't editable here).
                        const e = r.email;
                        return (
                          <div key={r.id} className="group flex items-center justify-between gap-2 text-sm px-1.5 py-1.5 rounded hover:bg-muted/60">
                            <div className="flex items-center gap-2 min-w-0">
                              <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span className="truncate text-foreground">{e.subject || '(untitled email)'}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[11px] text-muted-foreground">
                                {typeFilter === 'all' ? 'Email' : formatShortDate(e.updated_at)}
                              </span>
                              <span className={badgeClass(e.state)}>{e.state}</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => {
                                  // Preview the email body verbatim, read-only. Not a contract:
                                  // no contractId, no signed PDF, no editable draft path.
                                  setCurrentContractId(null);
                                  setPreviewReadOnly(true);
                                  setPreviewExisting(true);
                                  setPreviewSignedUrl(null);
                                  setPreviewHTML(e.body_html || '');
                                  setShowPreview(true);
                                }}
                              >
                                Open
                              </Button>
                            </div>
                          </div>
                        );
                      }

                      const c = r.contract;
                      const isSent = c.state === 'sent';
                      const isSigned = c.state === 'signed';
                      return (
                        <div key={r.id} className="group flex items-center justify-between gap-2 text-sm px-1.5 py-1.5 rounded hover:bg-muted/60">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileSignature className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="truncate text-foreground">{c.name}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-muted-foreground">
                              {typeFilter === 'all' ? typeOf(c).label : formatShortDate(c.updated_at)}
                            </span>
                            <span className={badgeClass(c.state)}>{c.state}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => {
                                // Both states open at the single-panel PREVIEW level (not the split
                                // editor). Sent = read-only; draft = editable (Edit Document opens
                                // the split, and Cancel there returns HERE instead of dead-ending
                                // back to the job). existingContract shows the saved HTML verbatim.
                                // SIGNED → open the executed PDF (read-only) at signed_document_url;
                                // draft/sent → render the saved edited_html as before.
                                setCurrentContractId(c.id);
                                setPreviewReadOnly(isSent || isSigned);
                                setPreviewExisting(true);
                                setPreviewSignedUrl(isSigned ? (c.signed_document_url ?? null) : null);
                                setPreviewHTML(c.edited_html);
                                setShowPreview(true);
                              }}
                            >
                              Open
                            </Button>
                            {/* C — delete: subtle hover-X, DRAFTS ONLY (never sent or signed). */}
                            {!isSent && !isSigned && (
                              <button
                                type="button"
                                aria-label="Delete draft"
                                title="Delete draft"
                                onClick={() => setPendingDelete(c)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-600 shrink-0 p-0.5"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Cascade Options — scenario picker strip (TEST tool, NOT a client-facing field).
            Top of Section 2, pushed to the side, matches the mock #cascadePicker.
            Stays ACTIVE on a live Valcre job (2026-06-12) — this is a test/demo tool, never in
            production. Leaving it live lets us switch versions AFTER a Valcre number exists, which
            also fires the value-scenarios sync to Valcre (demonstrates the sync working). Consistent
            with every other dashboard field, none of which lock on a live job. */}
        <div className="flex justify-end mb-2">
          <div id="cascade-options-anchor">
            <Select value={cascadeVersion} onValueChange={handleCascadeVersion}>
              <SelectTrigger className="h-8 px-3 text-xs gap-1 rounded-md border border-border bg-background min-w-[230px]">
                {/* Trigger shows the FULL colored name — "V# — choice = scenarios & approaches" — exactly
                    like the mock, not a shortened label. */}
                {(() => {
                  const o = CASCADE_OPTIONS.find(x => x.v === cascadeVersion);
                  return o ? (
                    <span className="whitespace-nowrap">
                      {o.v} — <span style={{ color: o.v === 'V4' ? CV.leftAu : CV.left, fontWeight: 600 }}>{o.left}</span>
                      {' = '}<span style={{ color: CV.scen, fontWeight: 600 }}>{o.scen}</span>
                      {' & '}<span style={{ color: CV.appr, fontWeight: 600 }}>{o.appr}</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Cascade Options — pick a scenario</span>
                  );
                })()}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__CLEAR__" className="text-muted-foreground border-b border-border mb-1">Clear — reset to empty</SelectItem>
                {CASCADE_OPTIONS.map(o => (
                  <SelectItem key={o.v} value={o.v} textValue={`${o.v} — ${o.left}`}>
                    <span>{o.v} — </span>
                    <span style={{ color: o.v === 'V4' ? CV.leftAu : CV.left, fontWeight: 600 }}>{o.left}</span>
                    <span> = </span>
                    <span style={{ color: CV.scen, fontWeight: 600 }}>{o.scen}</span>
                    <span> & </span>
                    <span style={{ color: CV.appr, fontWeight: 600 }}>{o.appr}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 1. Job Info */}
        <SectionGroup title="Job Info">
          <TwoColumnFields>
            <CompactField label="Job Number">
              <Input
                value={jobDetails?.jobNumber || ''}
                readOnly
                placeholder={isPendingValcreJob(jobDetails?.jobNumber) ? 'Pending...' : 'Awaiting Valcre job'}
                className="h-7 text-sm max-w-[160px]"
              />
            </CompactField>
            {/* ClickUp Task field removed — Part F. Task URL/ID is in the "View in ClickUp" button above. */}
            {/* LOE Version picker removed 2026-06-09 — single active template (LOE-07-1); the
                send path defaults to the newest active template, so "Create Document/Email" goes
                straight in on the one template. (Document-not-version-picker direction —
                see JOB-DOCUMENT-PICKER-DECISION-TREE.md.) */}
            <CompactField label="Job Status">
              {/* Shows the LOGICAL workflow status (job.status) as a plain-language label —
                  Submitted → "Sent — Awaiting Signature" → "Signed by Client" → … — so the field
                  reflects the LOE pipeline, not the (unwired) Valcre mirror. Read-only for now; it
                  advances as the sent/signed events update job.status. Two-way Valcre Status sync
                  remains a separate TODO (api/valcre.ts push + pull). */}
              <Input
                value={
                  ({
                    submitted: 'Submitted',
                    in_progress: 'In Progress',
                    loe_pending: 'LOE Pending',
                    loe_sent: 'Sent — Awaiting Signature',
                    loe_signed: 'Signed by Client',
                    contract_generated: 'Contract Generated',
                    paid: 'Paid',
                    active: 'Active',
                    completed: 'Completed',
                  } as Record<string, string>)[job?.status] ?? (jobDetails.jobStatus || '')
                }
                readOnly
                placeholder="No status yet"
                className="h-7 text-sm max-w-[220px] italic !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0 cursor-default focus-visible:ring-0"
              />
            </CompactField>
          </TwoColumnFields>
        </SectionGroup>

        {/* 2. Purpose of the Assignment */}
        <SectionGroup title="Purpose of the Assignment">
          <TwoColumnFields>
            <CompactField label="Purpose">
              {/* Free-text (user input). Placeholder is self-describing — says it's free text + where it maps —
                  rather than pre-filling a fake purpose sentence. Matches the mock. */}
              <Input
                type="text"
                name="purpose"
                value={jobDetails.purpose || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Purpose of the assignment (free text)"
                title="Free text — fills the LOE 'Purpose of the Assignment' paragraph (wiring pending)."
                className="h-7 text-sm max-w-[300px]"
              />
            </CompactField>
          </TwoColumnFields>
        </SectionGroup>

        {/* Body "Cascade Options" group REMOVED 2026-06-10 — matches the mock: the V1–V4 scenario picker
            is now the side strip at the top of Section 2 (test tool), and Status of Improvements moved into
            "Value Scenarios & Approaches" as a normal field. */}

        {/* 4. Value Scenarios & Approaches */}
        <SectionGroup title="Value Scenarios & Approaches">
          {/* Insert-from-data toggle (mock parity) — checking it maps Section 1's Property Type /
              Subtype / Tenancy into the cascade and lights those source fields (here + Section 1) yellow.
              Test tool, shown only in Test Mode. */}
          {testMode && (
            <label className="flex items-center gap-2 mb-3 text-xs text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={insertFromData}
                onChange={e => handleInsertFromData(e.target.checked)}
                className="h-3.5 w-3.5 accent-[#eab308] cursor-pointer"
              />
              Insert from data — map Type / Subtype / Tenancy into the cascade
            </label>
          )}
          <TwoColumnFields>
            {/* Status of Improvements — moved here 2026-06-10 (was in body "Cascade Options" group, now matches mock 2.4).
                Real user field + the cascade driver. Starts blank (no preset). */}
            <CompactField label="Status of Improvements">
              {cascadeVersion === 'V4' ? (
                // Dash rule: the Insurance scenario is driven by Authorized Use, so Status does not apply.
                // NOT test-mode-gated — V4 always dashes Status (live + test), matching the mock.
                <div style={provStyle(null)} className="max-w-[220px]" title="The Insurance scenario is driven by Authorized Use — Status does not apply.">
                  <span className="text-zinc-400">—</span>
                </div>
              ) : (
                <Select
                  value={(jobDetails as any).statusOfImprovements || ''}
                  onValueChange={value => {
                    if (!onUpdateDetails) return;
                    setCascadePicked(true); // a status drives the cascade → lock Value Scenarios to derived result
                    onUpdateDetails({ statusOfImprovements: value } as any);
                    autoSaveField('statusOfImprovements', value);
                  }}
                >
                  <SelectTrigger
                    style={testMode && cascadePicked && (jobDetails as any).statusOfImprovements ? { background: PROV.status.bg, borderBottomColor: PROV.status.bd, color: '#1f2937', borderRadius: 4 } : undefined}
                    className={testMode && cascadePicked && (jobDetails as any).statusOfImprovements
                      ? 'h-7 text-sm max-w-[220px] border-0 border-b px-1.5'
                      : 'h-7 text-sm max-w-[220px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0'}
                  >
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(STATUS_TO_SCENARIOS).map(key => (
                      <SelectItem key={key} value={key}>{key}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CompactField>
            <CompactField label="Value Scenarios" status={fieldStates['valueScenarios']}>
              {/* Derived (rose) — driven by Status of Improvements + Authorized Use via the cascade. */}
              {(() => {
                const v = deriveValueScenarios(statusOfImprovements, authorizedUse).join(', ');
                return renderDerived(v, 'results from Status + Authorized Use', v ? 'scenarios' : null,
                  'Computed from Status of Improvements + your Authorized Use (from Section 1).');
              })()}
            </CompactField>
            <CompactField label="Property Rights" status={fieldStates['propertyRightsAppraised']}>
              {/* Source-driven (yellow) from Type / Subtype / Tenancy — maps in only when "Insert from
                  data" is on, exactly like the mock; otherwise reads "from Tenancy (1.11)". */}
              {(() => {
                const v = derivePropertyRights(primaryPropertyType, (jobDetails as any).propertySubtype, (jobDetails as any).tenancy);
                const mapped = !testMode || insertFromData;
                const tinted = testMode && insertFromData && v ? 'source' : null;
                return (
                  <div style={provStyle(tinted)} className="max-w-[220px]" title={v || 'Auto-derived from Property Type, Subtype & Tenancy.'}>
                    {mapped && v
                      ? <span className={`truncate min-w-0 flex-1 ${tinted ? 'text-slate-900' : 'text-slate-900 dark:text-slate-100'}`}>{v}</span>
                      : <span className="text-zinc-400">results from Type / Subtype / Tenancy</span>}
                  </div>
                );
              })()}
            </CompactField>
            <CompactField label="Approaches to Value">
              {/* Derived (blue) — driven by Status of Improvements via the cascade. */}
              {(() => {
                const v = deriveApproaches(statusOfImprovements, authorizedUse).join(', ');
                return renderDerived(v, 'results from Status + Authorized Use', v ? 'approaches' : null,
                  'Computed from Status of Improvements + Authorized Use (Insurance → Cost Approach).');
              })()}
            </CompactField>
            {/* MIRROR of Section 1. Maps in (shows value + yellow) only when "Insert from data" is on; in
                Test Mode while unchecked it reads "from Subtype (1.10)" to show it's not yet mapped. */}
            <CompactField label="Property Subtype">
              {(() => {
                const v = (jobDetails as any).propertySubtype;
                const mapped = !testMode || insertFromData;
                const tinted = testMode && insertFromData && v ? 'source' : null;
                return (
                  <div style={provStyle(tinted)} className="max-w-[160px]" title="Maps from Property Subtype in Section 1.">
                    {mapped && v
                      ? <span className="truncate min-w-0 flex-1 text-slate-900 dark:text-slate-100">{v}</span>
                      : <span className="text-zinc-400">from Subtype (1.10)</span>}
                  </div>
                );
              })()}
            </CompactField>
            {/* MIRROR of Section 1 — same insert-from-data gating as Property Subtype. */}
            <CompactField label="Tenancy">
              {(() => {
                const v = (jobDetails as any).tenancy;
                const mapped = !testMode || insertFromData;
                const tinted = testMode && insertFromData && v ? 'source' : null;
                return (
                  <div style={provStyle(tinted)} className="max-w-[160px]" title="Maps from Tenancy in Section 1.">
                    {mapped && v
                      ? <span className="truncate min-w-0 flex-1 text-slate-900 dark:text-slate-100">{v}</span>
                      : <span className="text-zinc-400">from Tenancy (1.11)</span>}
                  </div>
                );
              })()}
            </CompactField>
            {/* MOVED 2026-06-10 from Data Gathering. Dash rule: a picked scenario does not set a timeframe,
                so in Test Mode it shows "—" once a scenario is active (mirrors the mock). */}
            <CompactField label="Value Timeframe">
              {testMode && cascadePicked ? (
                <div style={provStyle(null)} className="max-w-[160px]" title="Not set by the selected scenario.">
                  <span className="text-zinc-400">—</span>
                </div>
              ) : (
                <Select value={jobDetails.valueTimeframe || ''} onValueChange={value => handleSelectChange(value, 'valueTimeframe')}>
                  <SelectTrigger className="h-7 text-sm max-w-[160px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Current">Current</SelectItem>
                    <SelectItem value="Prospective">Prospective</SelectItem>
                    <SelectItem value="Retrospective">Retrospective</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </CompactField>
          </TwoColumnFields>
          {/* Live §10 mirror — the derived scenarios' actual write-ups, inline + editable on the dashboard. */}
          <ValueScenarioNarratives scenarios={deriveValueScenarios(statusOfImprovements, authorizedUse)} />
        </SectionGroup>

        {/* 5. Scope of Work */}
        <SectionGroup title="Scope of Work">
          <TwoColumnFields>
            <CompactField label="Scope of Work">
              <MultiSelect
                value={(jobDetails as any).scopeOfWork || ''}
                onChange={values => handleMultiSelectChange(values, 'scopeOfWork')}
                options={[
                  'All Applicable',
                  'Best One Approach',
                  'Best Two Approaches',
                  'Cost Approach',
                  'Direct Comparison Approach',
                  'Discounted Cash Flow',
                  'Feasibility Study',
                  'Income Approach',
                  'Land Value',
                  'Litigation',
                  'Market Research',
                  'Market Study',
                  'Net Rent Review',
                  'Update',
                ]}
              />
            </CompactField>
          </TwoColumnFields>
        </SectionGroup>

        {/* 6. Report Type & Assignment Type */}
        <SectionGroup title="Report Type & Assignment Type">
          <TwoColumnFields>
            <CompactField label="Report Type">
              <Select value={jobDetails.reportType || ''} onValueChange={value => handleSelectChange(value, 'reportType')}>
                <SelectTrigger className="h-7 text-sm max-w-[160px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Amendment Letter">Amendment Letter</SelectItem>
                  <SelectItem value="Appraisal Report">Appraisal Report</SelectItem>
                  <SelectItem value="Broker Opinion of Value">Broker Opinion of Value</SelectItem>
                  <SelectItem value="Completion Report">Completion Report</SelectItem>
                  <SelectItem value="Consultation">Consultation</SelectItem>
                  <SelectItem value="Desk Review">Desk Review</SelectItem>
                  <SelectItem value="Evaluation">Evaluation</SelectItem>
                  <SelectItem value="Peer Review">Peer Review</SelectItem>
                  <SelectItem value="Rent Study">Rent Study</SelectItem>
                  <SelectItem value="Restricted Appraisal Report">Restricted Appraisal Report</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>
            <CompactField label="Report Format">
              {/* Valcre "Format" (Comprehensive/Concise/Form) — distinct from existing "Report Type" */}
              <Select value={jobDetails.reportFormat || ''} onValueChange={value => handleSelectChange(value, 'reportFormat')}>
                <SelectTrigger className="h-7 text-sm max-w-[160px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Comprehensive">Comprehensive</SelectItem>
                  <SelectItem value="Concise">Concise</SelectItem>
                  <SelectItem value="Form">Form</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>
            <CompactField label="Assignment Type">
              <Select value={jobDetails.assignmentType || ''} onValueChange={value => handleSelectChange(value, 'assignmentType')}>
                <SelectTrigger className="h-7 text-sm max-w-[160px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Multiple Properties">Multiple Properties</SelectItem>
                  <SelectItem value="Single Property">Single Property</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>
            <CompactField label="Analysis Level" status={fieldStates['analysisLevel']}>
              {/* Re-optioned to Valcre's REAL JobAnalysisLevel enum members (from live $metadata). VALUE = exact
                  enum member name (what Job.AnalysisLevel accepts); label = friendly. Old options (Comprehensive/
                  Concise/Form) were NOT valid enum members — only "Detailed" was, so Concise/Form 400'd. Maps 1:1. */}
              <Select value={jobDetails.analysisLevel || ''} onValueChange={value => handleSelectChange(value, 'analysisLevel')}>
                <SelectTrigger className="h-7 text-sm max-w-[160px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Detailed">Detailed</SelectItem>
                  <SelectItem value="Summary">Summary</SelectItem>
                  <SelectItem value="Brief">Brief</SelectItem>
                  <SelectItem value="DetailedResidential">Detailed Residential</SelectItem>
                  <SelectItem value="RestrictedAccessReport">Restricted Access Report</SelectItem>
                  <SelectItem value="ProgressReport">Progress Report</SelectItem>
                  <SelectItem value="ValuationAssessmentLetter">Valuation Assessment Letter</SelectItem>
                  <SelectItem value="RentalAssessmentLetter">Rental Assessment Letter</SelectItem>
                  <SelectItem value="RentalSubmission">Rental Submission</SelectItem>
                  <SelectItem value="RentalDetermination">Rental Determination</SelectItem>
                  <SelectItem value="PropertyPro">Property Pro</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>
          </TwoColumnFields>
        </SectionGroup>

        {/* 7. Fees & Terms */}
        <SectionGroup title="Fees & Terms">
          <TwoColumnFields>
            <CompactField label="Appraisal Fee">
              <Input
                type="text"
                name="appraisalFee"
                placeholder="$ amount"
                value={editingAppraisalFee !== null ? editingAppraisalFee : (jobDetails.appraisalFee ? `$${formatCurrency(jobDetails.appraisalFee)}` : '')}
                onChange={handleCurrencyChange}
                onBlur={handleCurrencyBlur}
                onFocus={() => setEditingAppraisalFee(jobDetails.appraisalFee ? jobDetails.appraisalFee.toString() : '')}
                className="h-7 text-sm max-w-[160px]"
              />
            </CompactField>
            <CompactField
              label={
                <FieldInfo label="Retainer Amount:">
                  Keep for special use cases? Standard is 100% on signing — a retainer (partial
                  payment up front) only applies to the occasional large job. Otherwise leave at 0.
                </FieldInfo>
              }
            >
              <Input
                type="text"
                name="retainerAmount"
                placeholder="$ amount"
                /* Defaults to $0.00 until a value is entered (Ben 2026-06-19) — standard is no retainer. */
                value={editingRetainerAmount !== null ? editingRetainerAmount : (jobDetails.retainerAmount ? `$${formatCurrency(parseFloat(jobDetails.retainerAmount))}` : '$0.00')}
                onChange={handleCurrencyChange}
                onBlur={handleCurrencyBlur}
                onFocus={() => setEditingRetainerAmount(jobDetails.retainerAmount || '')}
                className="h-7 text-sm max-w-[160px]"
              />
            </CompactField>
            {/* Payment Terms field REMOVED 2026-06-19 (Ben) — LOE clause is fixed contract boilerplate,
                not a per-job choice. No dashboard input; the contract template's fixed clause stays. */}
          </TwoColumnFields>
        </SectionGroup>

        {/* 8. Payment */}
        <SectionGroup title="Payment">
          <TwoColumnFields>
            <CompactField
              label={
                <FieldInfo label="Retainer Paid:">
                  Currently feeds nothing downstream — keep for internal tracking, or remove?
                </FieldInfo>
              }
            >
              <Input
                type="date"
                name="retainerPaidDate"
                value={jobDetails.retainerPaidDate || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className="h-7 text-sm max-w-[160px]"
              />
            </CompactField>
            <CompactField label="Amount Paid">
              <Input
                type="text"
                name="paymentAmount"
                value={editingPaymentAmount !== null ? editingPaymentAmount : (jobDetails.paymentAmount ? `$${formatCurrency(jobDetails.paymentAmount)}` : '')}
                onChange={handleCurrencyChange}
                onBlur={handleCurrencyBlur}
                onFocus={() => setEditingPaymentAmount(jobDetails.paymentAmount ? jobDetails.paymentAmount.toString() : '')}
                className="h-7 text-sm max-w-[160px]"
              />
            </CompactField>
            <CompactField label="Paid Date">
              <Input
                type="date"
                name="paymentPaidDate"
                value={jobDetails.paymentPaidDate || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className="h-7 text-sm max-w-[160px]"
              />
            </CompactField>
            <CompactField label="Signed Date" status={fieldStates['signedDate']}>
              <Input
                type="date"
                name="signedDate"
                value={jobDetails.signedDate || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className="h-7 text-sm max-w-[160px]"
              />
            </CompactField>
          </TwoColumnFields>
        </SectionGroup>

        {/* 9. Effective Date & Report Date */}
        <SectionGroup title="Effective Date & Report Date">
          <TwoColumnFields>
            <CompactField label="Effective Date" status={fieldStates['effectiveDate']}>
              <Input
                type="date"
                name="effectiveDate"
                value={jobDetails.effectiveDate || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className="h-7 text-sm max-w-[160px]"
              />
            </CompactField>
            <CompactField
              status={fieldStates['requestDate']}
              label={
                <FieldInfo label="Client Requested Date:">
                  Optional — the client's special requested delivery date (e.g. a rush, or a later
                  date like 4 months out). Leave blank for the standard 3-week turnaround. A date
                  later than standard pushes the delivery assumption out.
                </FieldInfo>
              }
            >
              <Input
                type="date"
                name="requestDate"
                value={jobDetails.requestDate || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className="h-7 text-sm max-w-[160px]"
              />
            </CompactField>
            <CompactField
              label={
                <FieldInfo label="Delivery Date:">
                  Always {(jobDetails as any).deliveryTime || DEFAULT_DELIVERY_WEEKS} weeks ahead of
                  today (from the Delivery Time field).
                </FieldInfo>
              }
            >
              {/* Derived/display-only: ALWAYS today + weeks, recomputed each render (not persisted).
                  Rendered as PLAIN TEXT — NOT a date input (Ben): no picker, no manual entry, no edit
                  path. The ONLY way to change it is the Delivery Time (wks) field; they are locked as a pair. */}
              <span
                className="inline-flex items-center h-7 text-sm text-foreground/90 max-w-[160px]"
                title="Always N weeks ahead of today — change the Delivery Time field to adjust"
              >
                {resolveDeliveryDate((jobDetails as any).deliveryTime)}
              </span>
            </CompactField>
            <CompactField label="Delivery Time (wks)">
              <Input type="text" name="deliveryTime" value={(jobDetails as any).deliveryTime || '3'} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. 3" className="h-7 text-sm max-w-[160px]" />
            </CompactField>
          </TwoColumnFields>
        </SectionGroup>

        {/* 10. Property Use & Other */}
        <SectionGroup title="Property Use & Other">
          <TwoColumnFields>
            <CompactField label="Current Use">
              {/* Registry ListCurrentUseImprovements — converted from free-text to Select (2026-06-10 migration).
                  Binding preserved: same jobDetails.currentUse key, now via handleSelectChange (same save+sync path). */}
              <Select value={(jobDetails as any).currentUse || ''} onValueChange={value => handleSelectChange(value, 'currentUse')}>
                <SelectTrigger className="h-7 text-sm max-w-[160px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vacant Land">Vacant Land</SelectItem>
                  <SelectItem value="Single Family">Single Family</SelectItem>
                  <SelectItem value="Multifamily">Multifamily</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Office">Office</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>
            <CompactField label="Proposed Use">
              {/* Registry ListProposedUseImprovements — converted from free-text to Select (2026-06-10 migration).
                  Binding preserved: same jobDetails.proposedUse key, now via handleSelectChange (same save+sync path). */}
              <Select value={(jobDetails as any).proposedUse || ''} onValueChange={value => handleSelectChange(value, 'proposedUse')}>
                <SelectTrigger className="h-7 text-sm max-w-[160px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                  <SelectItem value="Single Family">Single Family</SelectItem>
                  <SelectItem value="Multifamily">Multifamily</SelectItem>
                  <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Office">Office</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>
            <CompactField label="CMHC Financing">
              <Select value={jobDetails.cmhcFinancing || ''} onValueChange={value => handleSelectChange(value, 'cmhcFinancing')}>
                <SelectTrigger className="h-7 text-sm max-w-[160px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>
            <CompactField label="Transaction Status" status={fieldStates['transactionStatus']}>
              {/* v3.1 master ListTransactionStatus — re-optioned to the new CUSTOM field CF12424 value set
                  (Not Applicable / Listed / Under Contract). Old 5-option set didn't match the new field.
                  Converted to MultiSelect (CF12424 is MultiOption) — mirrors Scope of Work / Client Documents pattern. */}
              <MultiSelect
                value={(jobDetails as any).transactionStatus || ''}
                onChange={values => handleMultiSelectChange(values, 'transactionStatus')}
                options={[
                  'Not Applicable',
                  'Listed',
                  'Under Contract',
                ]}
              />
            </CompactField>
            <CompactField label="Zoning Status" status={fieldStates['zoningStatus']}>
              {/* v3.1 master ListZoningStatus — re-optioned to the new CUSTOM field CF12425 value set
                  (In Place / To Be Rezoned). Old 4 legal-* options didn't match the new field. */}
              <Select value={jobDetails.zoningStatus || ''} onValueChange={value => handleSelectChange(value, 'zoningStatus')}>
                <SelectTrigger className="h-7 text-sm max-w-[160px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Place">In Place</SelectItem>
                  <SelectItem value="To Be Rezoned">To Be Rezoned</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>
          </TwoColumnFields>
        </SectionGroup>

        {/* 11. Property Information Request */}
        <SectionGroup title="Property Information Request">
          <TwoColumnFields>
            <CompactField label="Client Documents">
              {/* Registry ListClientDocuments (field-registry-v6.html:948) — multi-value, 11 options verbatim.
                  FIX 5 (2026-06-23): rendered as a Shadcn Checkbox GROUP (was a MultiSelect dropdown) — pure
                  presentation swap. SAME data shape: value stays the comma-joined string in
                  jobDetails.clientDocuments, each toggle rebuilds the selected array and routes through the
                  unchanged handleMultiSelectChange → DB client_documents + Valcre mapping all untouched. */}
              {(() => {
                const CLIENT_DOCUMENT_OPTIONS = [
                  'Previous Appraisal',
                  'Property Details',
                  'Proforma',
                  'Unit Mix',
                  'Rent Roll',
                  'Historical Operating Expenses',
                  'Development Permit Drawings',
                  'Contact for Property Tour',
                  'Purchase & Sale Agreement',
                  'Environmental Reports',
                  'Property Condition Reports',
                ];
                const selected = String((jobDetails as any).clientDocuments || '')
                  .split(',').map(v => v.trim()).filter(Boolean);
                const toggle = (opt: string, checked: boolean) => {
                  const next = checked
                    ? [...selected, opt].filter((v, i, a) => a.indexOf(v) === i)
                    : selected.filter(v => v !== opt);
                  handleMultiSelectChange(next, 'clientDocuments');
                };
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                    {CLIENT_DOCUMENT_OPTIONS.map(opt => {
                      const id = `clientDoc-${opt.replace(/[^a-zA-Z0-9]+/g, '-')}`;
                      const checked = selected.includes(opt);
                      return (
                        <label key={opt} htmlFor={id} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                          <Checkbox
                            id={id}
                            checked={checked}
                            onCheckedChange={(c) => toggle(opt, c === true)}
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                );
              })()}
            </CompactField>
            <CompactField label="Previously Appraised">
              <Select value={(jobDetails as any).previouslyAppraised || ''} onValueChange={value => handleSelectChange(value, 'previouslyAppraised')}>
                <SelectTrigger className="h-7 text-sm max-w-[160px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>
          </TwoColumnFields>
        </SectionGroup>

        {/* "Other" SectionGroup REMOVED 2026-06-10 migration — Lead Appraiser (not in registry) +
            Desktop Report (Chris: delete; Valcre CF12050 doesn't exist on tenant) both removed.
            Authorized Use was already removed 2026-06-05 (lives once on Client Intake → Job.IntendedUses).
            State keys (leadAppraiser/desktopReport) left harmless; not in VALCRE_SYNC_FIELDS. */}

          {/* Comments Section - Three columns (responsive) */}
          <SectionGroup title="Comments">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-4">
              {[
                { label: 'General', name: 'appraiserComments', placeholder: 'Internal appraiser notes...' },
                { label: 'Delivery', name: 'deliveryComments', placeholder: 'Delivery instructions...' },
                { label: 'Payment', name: 'paymentComments', placeholder: 'Payment terms and notes...' },
              ].map(({ label, name, placeholder }) => (
                <div key={name} className="flex flex-col gap-2">
                  <label className="text-sm text-muted-foreground">{label}:</label>
                  <div className="flex items-start gap-1">
                    {name === 'appraiserComments' && ((jobDetails as any).appraiserComments || '').length + ((jobDetails as any).deliveryComments || '').length + ((jobDetails as any).paymentComments || '').length > 80 ? (
                      <button
                        type="button"
                        onClick={() => setCommentsExpanded(!commentsExpanded)}
                        className="text-gray-400 hover:text-muted-foreground dark:hover:text-gray-300 mt-0.5 flex-shrink-0"
                      >
                        {commentsExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      </button>
                    ) : null}
                    <Textarea
                      name={name}
                      value={(jobDetails as any)[name] || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={3}
                      className={`text-sm resize-none w-full !bg-transparent border-0 border-b border-b-gray-300 dark:border-b-white/[0.12] !rounded-none px-0 py-1 ${
                        !commentsExpanded ? 'max-h-[60px] overflow-hidden' : ''
                      }`}
                      placeholder={placeholder}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionGroup>

        {/* Preview Modal */}
        <LOEPreviewModal
          isOpen={showPreview}
          onClose={() => { setShowPreview(false); setPreviewReadOnly(false); setPreviewExisting(false); setPreviewSignedUrl(null); refreshContracts(); }}
          job={job}
          jobDetails={jobDetails}
          documentHTML={previewHTML}
          onApprove={handleApproveAndSend}
          onContractSaved={refreshContracts}
          contractId={currentContractId}
          readOnly={previewReadOnly}
          existingContract={previewExisting}
          signedDocumentUrl={previewSignedUrl}
          onPickEmail={(tpl) => { setDocLessTemplate(tpl); setDocLessOpen(true); }}
          onPickPopup={(p) => { setPopupInitial(p ?? null); setPopupOpen(true); }}
        />

        {/* Popup editor — the third managed component type (post-sign Thank-You screen). */}
        <PopupComposeModal
          isOpen={popupOpen}
          onClose={() => setPopupOpen(false)}
          job={job}
          jobDetails={jobDetails}
          initialTemplate={popupInitial ?? undefined}
        />

        {/* Component Studio — additive surface. Deep-edit delegates to the proven editors:
            document → the existing previewer/editor, email → EmailComposeModal, popup → PopupComposeModal. */}
        <ComponentStudio
          isOpen={studioOpen}
          onClose={() => setStudioOpen(false)}
          job={job}
          jobDetails={jobDetails}
          onEditDocument={() => { setStudioOpen(false); handleGeneratePreview(); }}
          onEditEmail={(tpl) => { setDocLessTemplate(tpl); setDocLessOpen(true); }}
          onEditPopup={(p) => { setPopupInitial(p ?? null); setPopupOpen(true); }}
        />

        {/* Reopening a draft now routes through LOEPreviewModal (single-panel preview → Edit →
            split editor → Back to Preview), so the old standalone draft-editor shell is retired —
            it dead-ended on Cancel back to the job instead of the preview. */}

        {/* C — delete-draft confirmation (second popup). DRAFTS ONLY — never opened for sent. */}
        <AlertDialog open={!!pendingDelete} onOpenChange={(o) => { if (!o) setPendingDelete(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this draft?</AlertDialogTitle>
              <AlertDialogDescription>
                "{pendingDelete?.name}" will be permanently removed. This can't be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isDeleting}
                onClick={async (e) => {
                  e.preventDefault();
                  if (!pendingDelete || pendingDelete.state === 'sent') { setPendingDelete(null); return; }
                  setIsDeleting(true);
                  const result = await deleteJobContract(pendingDelete.id);
                  setIsDeleting(false);
                  if (result.success) {
                    toast.success('Draft deleted');
                    setPendingDelete(null);
                    refreshContracts();
                  } else {
                    toast.error(`Failed to delete: ${result.error}`);
                  }
                }}
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default LoeQuoteSection;
