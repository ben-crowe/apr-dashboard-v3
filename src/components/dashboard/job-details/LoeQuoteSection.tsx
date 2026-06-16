
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionTitle, sectionTriggerStyle, sectionContentStyle, FieldRow, SectionGroup, TwoColumnFields, CompactField, FieldSyncStatus } from "./ValcreStyles";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SectionProps } from "./types";
import { isValcreJobNumber, isPendingValcreJob, hasRealValcreJob, VALCRE_JOB_PREFIX } from "@/config/valcre";
import JobNumberField from "./loe-quote/JobNumberField";
import { sendToValcre } from "@/utils/webhooks";
import { supabase } from "@/integrations/supabase/client";
import { generateAppraisalTestData } from "@/utils/testDataGenerator";
import { FileSignature, AlertCircle, ExternalLink, Trash2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { validateRequiredFields } from "@/utils/webhooks/docuseal";
import { generateLOEHTML, generateAndSendLOE, sendLOEEmail } from "@/utils/loe/generateLOE";
import { loadJobContracts, saveJobContract, deleteJobContract, JobContract } from "@/utils/loe/jobContracts";
import { saveJobEmailInstance } from "@/utils/loe/emailTemplate";
import { markLOEPrepComplete } from "@/utils/webhooks/clickup";
import LOEPreviewModal from "./actions/LOEPreviewModal";
import TemplateEditorModal from "./actions/TemplateEditorModal";
import ClickUpAction from "./actions/ClickUpAction";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { deriveValueScenarios, STATUS_TO_SCENARIOS, deriveApproaches, derivePropertyRights } from "@/utils/loe/loeCascade";

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
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHTML, setPreviewHTML] = useState<string>('');
  // Instance id the preview is bound to: null for a brand-new Create Contract, the row's id
  // when opening an existing (sent) contract for View. Carried into the modal so resave /
  // future sent-marking updates the same row.
  const [currentContractId, setCurrentContractId] = useState<string | null>(null);
  // Read-only View mode for the preview (opening a SENT contract).
  const [previewReadOnly, setPreviewReadOnly] = useState(false);
  // The draft being continued in the standalone editor (Open a draft → editor).
  const [editDraft, setEditDraft] = useState<JobContract | null>(null);
  // Active Saved Documents type pill: '' = nothing selected (list collapsed, just pills),
  // 'all' = every doc, or a DOC_TYPES key. The pill selection itself is the expand/collapse.
  const [typeFilter, setTypeFilter] = useState<string>('');
  // Saved client contracts for THIS job (Create Contract → save → appears here). The
  // dashboard shows what's been saved/prepped/sent + always lets you create a new one.
  const [savedContracts, setSavedContracts] = useState<JobContract[]>([]);
  // C — delete a saved DRAFT (never a sent doc). Two-step: hover-X → confirm dialog → delete.
  const [pendingDelete, setPendingDelete] = useState<JobContract | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const refreshContracts = useCallback(() => {
    if (job?.id) loadJobContracts(job.id).then(setSavedContracts);
  }, [job?.id]);
  useEffect(() => { refreshContracts(); }, [refreshContracts]);
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
  const VALCRE_SYNC_FIELDS = ['appraisalFee', 'retainerAmount', 'deliveryDate', 'paymentTerms', 'appraiserComments', 'deliveryComments', 'paymentComments', 'propertyRightsAppraised', 'scopeOfWork', 'valuationPremises', 'reportType', 'paymentAmount', 'paymentPaidDate', 'requestDate', 'signedDate', 'effectiveDate',
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

  // Fields that ALSO push to the ClickUp card (additive to Valcre sync — Ben-confirmed 2026-06-04).
  // These are EXACTLY the Stage-2 LOE-QUOTE fields that update-clickup-task renders into the card
  // (per QA's tests/MAPPING-dashboard-to-clickup.md Stage-2 + docs/FIELD-ROUTING-dashboard-clickup-loe.md).
  // update-clickup-task re-reads job_loe_details FRESH from the DB and rebuilds the section, so we only
  // need to fire it (by jobId) after the field persists — no per-field value payload. Internal-only
  // tracking fields (retainerPaidDate / paymentAmount-paid / paymentPaidDate) are NOT-on-card → excluded.
  const CLICKUP_CARD_FIELDS = ['propertyRightsAppraised', 'scopeOfWork', 'reportType', 'appraisalFee',
    'retainerAmount', 'deliveryDate', 'paymentTerms', 'appraiserComments', 'deliveryComments', 'paymentComments'];

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
      paymentTerms: 'Payment Terms',
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

  // Handle creating Valcre job
  const handleCreateValcreJob = async () => {
    if (!job || !canCreateValcreJob) return;

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
        paymentTerms: jobDetails?.paymentTerms || '',
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
              payment_terms: jobDetails?.paymentTerms || '',
              internal_comments: jobDetails?.appraiserComments || '',
              delivery_comments: jobDetails?.deliveryComments || '',
              payment_comments: jobDetails?.paymentComments || '',
              payment_amount: jobDetails?.paymentAmount || null,
              payment_paid_date: jobDetails?.paymentPaidDate || '',
              retainer_paid_date: jobDetails?.retainerPaidDate || '',
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
          paymentTerms: 'payment_terms',
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

        // Always save to Supabase first
        const { error: supabaseError } = await supabase
          .from('job_loe_details')
          .upsert({
            job_id: job.id,
            [dbFieldName]: value,  // Use mapped field name
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

        // Additive ClickUp-card push: if this is a card-routed field, refresh the existing card
        // (debounced, reuses saved clickup_task_id — never creates). Independent of the Valcre sync below.
        if (CLICKUP_CARD_FIELDS.includes(fieldName)) {
          pushCardUpdate();
        }

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
          if (fieldName === 'paymentTerms') syncData.paymentTerms = value;
          if (fieldName === 'appraiserComments') syncData.appraiserComments = value;
          if (fieldName === 'deliveryComments') syncData.deliveryComments = value;
          if (fieldName === 'paymentComments') syncData.paymentComments = value;
          if (fieldName === 'propertyRightsAppraised') syncData.propertyRightsAppraised = value;
          if (fieldName === 'scopeOfWork') syncData.scopeOfWork = value;
          if (fieldName === 'valuationPremises') syncData.valuationPremises = value;
          if (fieldName === 'reportType') syncData.reportType = value;
          if (fieldName === 'paymentAmount') syncData.paymentAmount = value;
          if (fieldName === 'paymentPaidDate') syncData.paymentPaidDate = value;
          if (fieldName === 'requestDate') syncData.requestDate = value;     // PRD-A #1 → Job.BidDate
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
    // Create Contract = a brand-new instance: no id (first Save Draft inserts), editable.
    setCurrentContractId(null);
    setPreviewReadOnly(false);

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
          // Persist the per-send email INSTANCE as 'sent' (job-scoped; never touches the default).
          if (emailOverride) {
            const finalSubject = emailOverride.subject.split('{{signing_link}}').join(result.signingLink);
            const finalBody = emailOverride.bodyHtml.split('{{signing_link}}').join(result.signingLink);
            const saved = await saveJobEmailInstance({
              jobId: job.id,
              contractId: currentContractId,
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

  // "Insert from data" toggle — mock parity (toggleInsertFromData). ON re-injects the source chain
  // (Property Type / Subtype / Tenancy → Section 2 mirrors + Property Rights) and lights it yellow;
  // OFF empties ALL SIX back to placeholders and strips the yellow. Re-check restores the stashed set.
  const handleInsertFromData = (checked: boolean) => {
    if (checked) {
      const s = mappedSources.current;
      if (s.propertyType || s.propertySubtype || s.tenancy) {
        if (onUpdateJob) onUpdateJob({ propertyType: s.propertyType } as any);
        onUpdateDetails?.({ propertySubtype: s.propertySubtype, tenancy: s.tenancy } as any);
      }
      setInsertFromData?.(true); // Property Rights re-derives via Part E from the restored sources
    } else {
      // Stash the current source values so re-check can re-inject them, then empty all six.
      mappedSources.current = {
        propertyType: (job as any)?.propertyType || '',
        propertySubtype: (jobDetails as any)?.propertySubtype || '',
        tenancy: (jobDetails as any)?.tenancy || '',
      };
      if (onUpdateJob) onUpdateJob({ propertyType: '' } as any);
      onUpdateDetails?.({ propertySubtype: '', tenancy: '', propertyRightsAppraised: '' } as any);
      setInsertFromData?.(false);
    }
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
        {/* Action Buttons Row — Part F: View in Valcre · View in ClickUp · Create Contract */}
        <div className="mb-6 flex justify-between">
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
                className="!border !border-border dark:!border-white/30 !bg-transparent !text-foreground dark:!text-white hover:!bg-muted dark:hover:!bg-white/10 hover:!border-gray-400 dark:hover:!border-white/50 transition-colors text-sm font-medium"
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
                          Create Contract
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
                          Create Contract
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
                    : "border-2 border-gray-800 dark:border-white/50 bg-gray-800 dark:bg-transparent text-white dark:text-white hover:bg-gray-700 dark:hover:bg-white/10 transition-colors text-sm font-medium"}
                >
                  <FileSignature className="h-4 w-4 mr-1" />
                  {isGenerating ? "Generating..." : "Create Contract"}
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
                Create Contract
              </Button>
            )}
          </div>
        </div>

        {/* Saved Documents (Version C — type-tab / pill filter). FULL-WIDTH, collapsible toggle
            WITHIN this section (default open; collapse to hide the list when there are many).
            Persistent type pills incl. empty placeholders; tap a pill to filter; 'All' shows
            everything drafts-first. ONE consistent "Open" per row — the badge carries draft/sent
            and behavior branches (draft → editable editor, sent → read-only preview). */}
        {savedContracts.length > 0 && (() => {
          // Drafts (actionable) above sent (archive); newest-first within a group is preserved by
          // the updated_at-desc query (stable sort).
          const draftFirst = (arr: JobContract[]) =>
            [...arr].sort((a, b) => (a.state === 'sent' ? 1 : 0) - (b.state === 'sent' ? 1 : 0));

          // Per-type counts + the pill set: base registry ∪ any unregistered type found in data.
          const counts = new Map<string, number>();
          for (const c of savedContracts) {
            const k = typeOf(c).key;
            counts.set(k, (counts.get(k) ?? 0) + 1);
          }
          const seen = new Set<string>();
          const extraTypes = savedContracts
            .map(typeOf)
            .filter(t => !DOC_TYPES.some(d => d.key === t.key))
            .filter(t => (seen.has(t.key) ? false : (seen.add(t.key), true)));
          const pillTypes = [...DOC_TYPES, ...extraTypes];

          const visible = typeFilter === 'all'
            ? savedContracts
            : savedContracts.filter(c => typeOf(c).key === typeFilter);
          const rows = draftFirst(visible);

          const pillClass = (active: boolean) =>
            `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors ${
              active
                ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white'
                : 'bg-background text-muted-foreground border-border hover:border-gray-400'}`;
          const countClass = (active: boolean) =>
            `text-[10px] font-semibold rounded-full px-1.5 ${
              active ? 'bg-white/25 text-white dark:bg-gray-900/20 dark:text-gray-900' : 'bg-muted text-muted-foreground'}`;

          return (
            <div className="mb-6 w-full">
              <div className="rounded-md border border-border bg-muted/30 p-3">
                <div className="text-xs font-semibold text-foreground mb-2">
                  Saved Documents ({savedContracts.length})
                </div>

                {/* Type pills — the selection IS the expand/collapse. Nothing selected on load =
                    collapsed (just the pills + counts). Tap a pill to expand that type's docs;
                    tap the active pill again to collapse. Pills persist even at 0 docs. */}
                <div className="flex flex-wrap gap-1.5">
                  <button type="button" onClick={() => setTypeFilter(f => f === 'all' ? '' : 'all')} className={pillClass(typeFilter === 'all')}>
                    All
                    <span className={countClass(typeFilter === 'all')}>{savedContracts.length}</span>
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
                    {rows.map((c) => {
                      const isSent = c.state === 'sent';
                      return (
                        <div key={c.id} className="group flex items-center justify-between gap-2 text-sm px-1.5 py-1.5 rounded hover:bg-muted/60">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileSignature className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="truncate text-foreground">{c.name}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-muted-foreground">
                              {typeFilter === 'all' ? typeOf(c).label : formatShortDate(c.updated_at)}
                            </span>
                            <span className={`text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded-full ${
                              isSent
                                ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400'}`}>
                              {c.state}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => {
                                if (isSent) {
                                  // Sent → read-only preview of what went out (no editor, no resave).
                                  setCurrentContractId(c.id);
                                  setPreviewReadOnly(true);
                                  setPreviewHTML(c.edited_html);
                                  setShowPreview(true);
                                } else {
                                  // draft (or legacy 'saved') → continue editing the SAME instance.
                                  setEditDraft(c);
                                }
                              }}
                            >
                              Open
                            </Button>
                            {/* C — delete: subtle hover-X, DRAFTS ONLY (never sent). */}
                            {!isSent && (
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
                send path defaults to the newest active template, so "Create Contract" goes
                straight in on the one template. (Document-not-version-picker direction —
                see JOB-DOCUMENT-PICKER-DECISION-TREE.md.) */}
            <CompactField label="Job Status">
              {/* Reflects Valcre's native Status field. Two-way Valcre Status sync is a real TODO
                  (next wiring pass: api/valcre.ts push + a pull path) — for now render locked/italic,
                  non-editable, no tooltip. jobStatus is job-record-only (not in any sync array). */}
              <Input
                value={jobDetails.jobStatus || ''}
                readOnly
                placeholder="Pending Valcre job status"
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
              {testMode && cascadeVersion === 'V4' ? (
                // Dash rule: the Insurance scenario is driven by Authorized Use, so Status does not apply.
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
                return renderDerived(v, 'from Status of Impr. (2.4)', v ? 'scenarios' : null,
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
                      : <span className="text-zinc-400">from Tenancy (1.11)</span>}
                  </div>
                );
              })()}
            </CompactField>
            <CompactField label="Approaches to Value">
              {/* Derived (blue) — driven by Status of Improvements via the cascade. */}
              {(() => {
                const v = deriveApproaches(statusOfImprovements, authorizedUse).join(', ');
                return renderDerived(v, 'from Status of Impr. (2.4)', v ? 'approaches' : null,
                  'Auto-derived from Status of Improvements.');
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
                    <SelectItem value="Retrospective">Retrospective</SelectItem>
                    <SelectItem value="Prospective">Prospective</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </CompactField>
          </TwoColumnFields>
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
            <CompactField label="Retainer Amount">
              <Input
                type="text"
                name="retainerAmount"
                placeholder="$ amount"
                value={editingRetainerAmount !== null ? editingRetainerAmount : (jobDetails.retainerAmount ? `$${formatCurrency(parseFloat(jobDetails.retainerAmount))}` : '')}
                onChange={handleCurrencyChange}
                onBlur={handleCurrencyBlur}
                onFocus={() => setEditingRetainerAmount(jobDetails.retainerAmount || '')}
                className="h-7 text-sm max-w-[160px]"
              />
            </CompactField>
            <CompactField label="Payment Terms">
              <Select value={jobDetails.paymentTerms || ''} onValueChange={value => handleSelectChange(value, 'paymentTerms')}>
                <SelectTrigger className="h-7 text-sm max-w-[160px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On LOE Signature">On LOE Signature</SelectItem>
                  <SelectItem value="NET 30 Days">NET 30 Days</SelectItem>
                  <SelectItem value="On Completion">On Completion</SelectItem>
                  <SelectItem value="50% Upfront">50% Upfront</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>
          </TwoColumnFields>
        </SectionGroup>

        {/* 8. Payment */}
        <SectionGroup title="Payment">
          <TwoColumnFields>
            <CompactField label="Retainer Paid">
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
            <CompactField label="Request Date" status={fieldStates['requestDate']}>
              <Input
                type="date"
                name="requestDate"
                value={jobDetails.requestDate || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className="h-7 text-sm max-w-[160px]"
              />
            </CompactField>
            <CompactField label="Delivery Date">
              <Input
                type="date"
                name="deliveryDate"
                value={jobDetails.deliveryDate || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className="h-7 text-sm max-w-[160px]"
              />
            </CompactField>
            <CompactField label="Delivery Time (wks)">
              <Input type="text" name="deliveryTime" value={(jobDetails as any).deliveryTime || ''} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. 4" className="h-7 text-sm max-w-[160px]" />
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
              {/* Registry ListClientDocuments (field-registry-v6.html:948) — Select multiple. Options verbatim (11). */}
              <MultiSelect
                value={(jobDetails as any).clientDocuments || ''}
                onChange={values => handleMultiSelectChange(values, 'clientDocuments')}
                options={[
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
                ]}
              />
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
          onClose={() => { setShowPreview(false); setPreviewReadOnly(false); refreshContracts(); }}
          job={job}
          jobDetails={jobDetails}
          documentHTML={previewHTML}
          onApprove={handleApproveAndSend}
          onContractSaved={refreshContracts}
          contractId={currentContractId}
          readOnly={previewReadOnly}
        />

        {/* Continue-a-draft editor — opens the SAME instance by id (no LOEPreviewModal shell,
            so the template-regeneration machinery never clobbers the saved draft). Save Draft
            updates this row in place; the editor stays open so the user can keep working. */}
        <TemplateEditorModal
          isOpen={!!editDraft}
          onClose={() => { setEditDraft(null); refreshContracts(); }}
          initialHTML={editDraft?.edited_html || ''}
          initialName={editDraft?.name}
          onSave={async (documentName, html) => {
            if (!editDraft) return;
            const result = await saveJobContract({
              id: editDraft.id,
              jobId: job.id,
              name: documentName || editDraft.name,
              editedHtml: html,
              templateId: editDraft.template_id,
              templateVersion: editDraft.template_version,
              contractType: editDraft.contract_type,
              state: 'draft',
            });
            if (result.success) {
              refreshContracts();
            } else {
              toast.error(`Failed to save draft: ${result.error}`);
            }
          }}
        />

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
