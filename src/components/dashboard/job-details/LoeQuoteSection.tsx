
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
import { FileSignature, AlertCircle, ExternalLink } from "lucide-react";
import { validateRequiredFields } from "@/utils/webhooks/docuseal";
import { generateLOEHTML, generateAndSendLOE, sendLOEEmail } from "@/utils/loe/generateLOE";
import { markLOEPrepComplete } from "@/utils/webhooks/clickup";
import LOEPreviewModal from "./actions/LOEPreviewModal";
import ClickUpAction from "./actions/ClickUpAction";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LoeQuoteSection: React.FC<SectionProps> = ({
  job,
  jobDetails = {},
  onUpdateDetails,
  refetchJobData
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHTML, setPreviewHTML] = useState<string>('');
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
    // cmhcFinancing, desktopReport, purpose, leadAppraiser, approachesToValue.
    // authorizedUse REMOVED 2026-06-05 (field-hygiene dedup) — Authorized Use now lives once on Client Intake
    // as `intendedUse`, which already syncs to native Job.IntendedUses. See DASHBOARD-TO-VALCRE-LOCATION-MAP.
    'analysisLevel', 'transactionStatus', 'zoningStatus', 'valueScenarios'];

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
          toast.warning('ClickUp card update failed — refresh ClickUp');
        } else if (result.verified === false) {
          console.warn('ClickUp card update unverified (PUT 200 but readback mismatch):', result);
          toast.warning('ClickUp card update unverified');
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
        clientAddress: job.clientAddress || '',  // Client address for contact entity (separate from property)
        propertyName: job.propertyName,  // Include property name for Valcre job title
        propertyAddress: job.propertyAddress,
        propertyType: job.propertyType,  // Comma-separated string: "Healthcare, Manufactured Housing"
        propertyTypes: job.propertyType ? job.propertyType.split(',').map(t => t.trim()).filter(Boolean) : [],  // Parse to array for Valcre API
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
        valuationPremises: jobDetails?.valuationPremises || '',
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
          toast.success(
            <div>
              <div>✅ Job submitted to Valcre!</div>
              <div>Waiting for {VALCRE_JOB_PREFIX} number...</div>
              <div className="text-sm mt-1">Check Valcre dashboard for actual job number</div>
            </div>
          );

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
              toast.warning('ClickUp task update failed - please refresh ClickUp');
            } else {
              console.log('✅ ClickUp task updated with LOE section:', updateResult);
              toast.success('ClickUp task updated with LOE details');
            }
          } catch (clickupError) {
            console.error('❌ Error updating ClickUp task:', clickupError);
            toast.warning('ClickUp task update failed - please refresh ClickUp');
          }

          // Refetch job data to ensure UI reflects latest database state
          if (refetchJobData) {
            console.log('🔄 Refetching job data to update button state...');
            await refetchJobData();
            console.log('✅ Job data refetched - button should now show "View in Valcre"');
          }

          toast.success(
            <div>
              <div>✅ Valcre job created!</div>
              <div>Job Number: {result.jobNumber}</div>
              <a
                href={`https://app.valcre.com/job/edit/${numericJobId}#job`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#3b82f6', textDecoration: 'underline' }}
              >
                View in Valcre →
              </a>
            </div>
          );
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
          toast.error(`Failed to save ${fieldName}`);
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
          if (fieldName === 'transactionStatus') syncData.transactionStatus = value; // → Custom 12053 (UpdateSelectFieldValue)
          if (fieldName === 'zoningStatus') syncData.zoningStatus = value;           // → Custom 12054 (UpdateSelectFieldValue)
          if (fieldName === 'valueScenarios') syncData.valueScenarios = value;       // → Custom 11563/11564 (manual, verified values only)

          console.log(`Syncing ${fieldName} to Valcre:`, syncData);
          const result = await sendToValcre(syncData);

          // Determine per-field sync outcome from the readback-backed response (HTTP 200 ≠ success):
          // a native-PATCH rejection (nativePatchError), a readback mismatch, or a failed custom write
          // all count as sync-failed — the amber state surfaces the otherwise-silent rejection.
          const nativeBad = result.nativeVerified
            ? Object.values(result.nativeVerified).some((v: any) => v && v.ok === false)
            : false;
          const customBad = !!result.customFields && result.customFields.failed > 0;
          const syncFailed = !result.success || !!result.nativePatchError || nativeBad || customBad;
          if (syncFailed) {
            console.error('Valcre sync failed:', result.nativePatchError || result.error, result);
            toast.error(`Failed to sync ${getFieldDisplayName(fieldName)} to Valcre`);
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
        toast.error(`Failed to save ${fieldName}`);
        setFieldStates(prev => ({ ...prev, [fieldName]: 'idle' }));
        setIsSectionSaving(false);
      }
    }, 500); // 500ms debounce
  }, [job, jobDetails, onUpdateDetails, VALCRE_SYNC_FIELDS, pushCardUpdate]);

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

    try {
      // If already sent, we're resending - generate fresh HTML
      if (alreadySent) {
        const html = await generateLOEHTML(job, jobDetails);
        setPreviewHTML(html);
        setShowPreview(true);
        toast.info("Ready to resend LOE - please review recipient email");
      } else {
        // First time sending - generate preview
        const html = await generateLOEHTML(job, jobDetails);
        setPreviewHTML(html);
        setShowPreview(true);
        toast.info("Preview generated - please review before sending");

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

  // Send after approval
  const handleApproveAndSend = async (overrideEmail?: string) => {
    setIsSending(true);

    try {
      // Use override email if provided, otherwise use client's email
      const recipientEmail = overrideEmail || job.clientEmail;

      // Log the email being sent to
      console.log('📧 Sending LOE to email:', recipientEmail);
      console.log('📧 Override email provided:', overrideEmail ? 'Yes' : 'No');
      console.log('📧 Original client email:', job.clientEmail);

      // Create a modified job object if using override email
      const jobToSend = overrideEmail ? { ...job, clientEmail: overrideEmail } : job;

      // Send to DocuSeal with the already generated HTML
      const result = await generateAndSendLOE(jobToSend, jobDetails, previewHTML);

      if (result.success && result.submissionId && result.signingLink) {
        // Send custom email with signing link
        console.log('📮 Sending email via Edge Function to:', recipientEmail);
        const emailSent = await sendLOEEmail(
          recipientEmail,
          `${job.clientFirstName} ${job.clientLastName}`,
          result.signingLink,
          job.propertyAddress
        );

        console.log('📮 Email send result:', emailSent ? 'Success' : 'Failed');

        if (emailSent) {
          toast.success(`✅ LOE sent to ${recipientEmail} successfully!`);
        } else {
          // Only show the link if email actually failed
          toast.error(`Email failed to send. Please share this link manually: ${result.signingLink}`);
        }

        // Update job details with submission ID
        if (onUpdateDetails) {
          onUpdateDetails({ docusealSubmissionId: result.submissionId });
        }

        setShowPreview(false);
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

  // Fill test data for appraiser fields - MIX of static and dynamic
  const fillTestData = () => {
    if (!onUpdateDetails) return;

    // STATIC VALUES for critical business fields
    const STATIC_FEE = 6000;  // Fixed fee amount for testing
    const STATIC_RETAINER = STATIC_FEE * 0.20;  // 20% retainer

    // STATIC delivery date - always 14 days from today
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 14);
    const staticDeliveryDate = deliveryDate.toISOString().split('T')[0];

    // DYNAMIC values for variety (but not business-critical) - must match dropdown values exactly
    const propertyRights = ['Fee Simple Interest', 'Leasehold Interest', 'Leased Fee Interest', 'Partial Interest'];
    const valuationTypes = ['Market Value As Is', 'Market Value As Is And Stabilized', 'Market Value As Complete And Stabilized', 'Market Value Land As Is'];
    const scopes = ['All Applicable', 'Direct Comparison Approach', 'Income Approach', 'Cost Approach', 'Best Two Approaches'];
    const reportTypes = ['Appraisal Report', 'Restricted Appraisal Report', 'Desk Review', 'Evaluation', 'Consultation'];

    // Helper to get random element
    const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    // Dynamic internal comments (just for variety in testing)
    const appraisers = ['John Smith', 'Jane Williams', 'Bob Johnson', 'Sarah Davis'];
    const internalNotes = [
      'Rush appraisal - priority client',
      'Standard timeline - coordinate site visit',
      'Follow up with property manager for access',
      'Client prefers digital delivery'
    ];

    // Test data with MIX of static (business-critical) and dynamic (for variety)
    const testData = {
      // job_number intentionally NOT included - this comes from Valcre API response
      propertyRightsAppraised: getRandom(propertyRights),  // Dynamic for variety
      valuationPremises: getRandom(valuationTypes),  // Dynamic for variety
      deliveryDate: staticDeliveryDate,  // STATIC - always 14 days out
      scopeOfWork: getRandom(scopes),  // Dynamic for variety
      reportType: 'Appraisal Report',  // Always Appraisal Report per Ben
      paymentTerms: 'On LOE Signature',  // STATIC payment terms - matches dropdown value
      appraisalFee: STATIC_FEE,  // STATIC fee - $3500
      retainerAmount: STATIC_RETAINER.toFixed(2),  // STATIC retainer - $350
      deliveryTimeframe: '14 days',  // STATIC timeframe
      appraiserComments: `${getRandom(appraisers)} assigned. ${getRandom(internalNotes)}`,
      deliveryComments: 'Draft report due 7 days prior to final delivery. Client to confirm inspection access 48 hours in advance.',
      paymentComments: 'Retainer due on LOE signature. Balance due on report delivery. Late payments subject to 2% monthly interest.',
      paymentAmount: STATIC_FEE.toFixed(2),
      retainerPaidDate: (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; })(),
      paymentPaidDate: (() => { const d = new Date(deliveryDate); d.setDate(d.getDate() + 5); return d.toISOString().split('T')[0]; })()
    };

    onUpdateDetails(testData);
    toast.success(`Test data populated! Fee: $${STATIC_FEE} (fixed), Delivery: ${staticDeliveryDate} (14 days)`);
  };

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
        {/* Action Buttons Row */}
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
                      <p className="text-xs mt-2 text-gray-400">Use "Test Data" buttons to quickly fill fields for testing</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
                          {alreadySent ? "LOE Sent" : "Preview & Send LOE"}
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
                          Preview & Send LOE
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
                  {alreadySent ? "Resend LOE" : isGenerating ? "Generating..." : "Preview & Send LOE"}
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
                Preview & Send LOE
              </Button>
            )}
          </div>

          {/* Test Data Link - Discrete for dev/testing */}
          <button
            type="button"
            onClick={fillTestData}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            title="Fill test data for development"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span>Test Data</span>
          </button>
        </div>

        {/* Job Information Section - After buttons, properly indented */}
        <SectionGroup title="Job Information">
          <TwoColumnFields>
            <CompactField label="Job Number">
              <Input
                value={jobDetails?.jobNumber || ''}
                readOnly
                placeholder={isPendingValcreJob(jobDetails?.jobNumber) ? 'Pending...' : 'Awaiting Valcre job'}
                className="h-7 text-sm max-w-[160px]"
              />
            </CompactField>
            <CompactField label="ClickUp Task">
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
            </CompactField>
            <CompactField label="LOE Version">
              {/* PRD-B version selector — default = newest active; old versions stay selectable */}
              <Select
                value={jobDetails.loeTemplateId || (loeTemplates[0]?.id ?? '')}
                onValueChange={value => handleSelectChange(value, 'loeTemplateId')}
              >
                <SelectTrigger className="h-7 text-sm max-w-[200px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0">
                  <SelectValue placeholder="Newest" />
                </SelectTrigger>
                <SelectContent>
                  {loeTemplates.map((t, idx) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}{idx === 0 ? ' (newest)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CompactField>
          </TwoColumnFields>
        </SectionGroup>

        {/* Job Details Section - Valuation fields */}
        <SectionGroup title="Job Details">

        {/* Valuation Details Section */}
        <TwoColumnFields>
          {/* Row 1 */}
          <CompactField label="Property Rights" status={fieldStates['propertyRightsAppraised']}>
            <MultiSelect
              value={jobDetails.propertyRightsAppraised || ''}
              onChange={values => handleMultiSelectChange(values, 'propertyRightsAppraised')}
              options={[
                'ASC 805',
                'Condominium Ownership',
                'Cost Segregation Study',
                'Fee Simple Interest',
                'Going Concern',
                'Leased Fee Interest',
                'Leasehold Interest',
                'Market Study',
                'Other',
                'Partial Interest',
                'Partial Interest Taking',
                'Rent Restricted',
                'Total Taking',
              ]}
            />
          </CompactField>

          <CompactField label="Scope of Work">
            <Select value={jobDetails.scopeOfWork || ''} onValueChange={value => handleSelectChange(value, 'scopeOfWork')}>
              <SelectTrigger className="h-7 text-sm max-w-[160px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Applicable">All Applicable</SelectItem>
                <SelectItem value="Best One Approach">Best One Approach</SelectItem>
                <SelectItem value="Best Two Approaches">Best Two Approaches</SelectItem>
                <SelectItem value="Cost Approach">Cost Approach</SelectItem>
                <SelectItem value="Direct Comparison Approach">Direct Comparison Approach</SelectItem>
                <SelectItem value="Discounted Cash Flow">Discounted Cash Flow</SelectItem>
                <SelectItem value="Feasibility Study">Feasibility Study</SelectItem>
                <SelectItem value="Income Approach">Income Approach</SelectItem>
                <SelectItem value="Land Value">Land Value</SelectItem>
                <SelectItem value="Litigation">Litigation</SelectItem>
                <SelectItem value="Market Research">Market Research</SelectItem>
                <SelectItem value="Market Study">Market Study</SelectItem>
                <SelectItem value="Net Rent Review">Net Rent Review</SelectItem>
                <SelectItem value="Update">Update</SelectItem>
              </SelectContent>
            </Select>
          </CompactField>

          {/* Row 2 */}
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

          <CompactField label="Appraisal Fee">
            <Input
              type="text"
              name="appraisalFee"
              value={editingAppraisalFee !== null ? editingAppraisalFee : (jobDetails.appraisalFee ? `$${formatCurrency(jobDetails.appraisalFee)}` : '')}
              onChange={handleCurrencyChange}
              onBlur={handleCurrencyBlur}
              onFocus={() => setEditingAppraisalFee(jobDetails.appraisalFee ? jobDetails.appraisalFee.toString() : '')}
              className="h-7 text-sm max-w-[160px]"
            />
          </CompactField>

          {/* Row 3 */}
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

          <CompactField label="Retainer Amount">
            <Input
              type="text"
              name="retainerAmount"
              value={editingRetainerAmount !== null ? editingRetainerAmount : (jobDetails.retainerAmount ? `$${formatCurrency(parseFloat(jobDetails.retainerAmount))}` : '')}
              onChange={handleCurrencyChange}
              onBlur={handleCurrencyBlur}
              onFocus={() => setEditingRetainerAmount(jobDetails.retainerAmount || '')}
              className="h-7 text-sm max-w-[160px]"
            />
          </CompactField>

          {/* Row 4 - Payment Tracking */}
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

          {/* Row 5 */}
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

          {/* ── New Valta loe-prep fields (added 2026-06-03; app-side only, not Valcre-synced) ── */}

          <CompactField label="Job Status">
            {/* No v6 DROPDOWN_OPTIONS list for Job Status — text input (options not invented) */}
            <Input
              type="text"
              name="jobStatus"
              value={jobDetails.jobStatus || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Status..."
              className="h-7 text-sm max-w-[160px]"
            />
          </CompactField>

          {/* Authorized Use removed 2026-06-05 (field-hygiene dedup) — it now lives ONCE on the Client
              Intake form (its origin), wired there to native Job.IntendedUses. The §10 LOE cascade reads
              job.intendedUse as the canonical source. See DASHBOARD-TO-VALCRE-LOCATION-MAP "Field-hygiene cleanup spec". */}

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

          <CompactField label="Value Scenarios" status={fieldStates['valueScenarios']}>
            <MultiSelect
              value={jobDetails.valueScenarios || ''}
              onChange={values => handleMultiSelectChange(values, 'valueScenarios')}
              options={[
                'As If Complete & Stabilized',
                'As If Complete & Stabilized - Renovated',
                'As If Complete - Rezoned',
                'As If Complete - Serviced',
                'As If Complete - Subdivided',
                'As If Vacant Land',
                'As Is Vacant Land',
                'As Stabilized',
                'As-Is',
                'Insurable Replacement Cost',
              ]}
            />
          </CompactField>

          <CompactField label="Transaction Status" status={fieldStates['transactionStatus']}>
            {/* v3.1 master ListTransactionStatus — re-optioned to the new CUSTOM field CF12424 value set
                (Not Applicable / Listed / Under Contract). Old 5-option set didn't match the new field. */}
            <Select value={jobDetails.transactionStatus || ''} onValueChange={value => handleSelectChange(value, 'transactionStatus')}>
              <SelectTrigger className="h-7 text-sm max-w-[160px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                <SelectItem value="Listed">Listed</SelectItem>
                <SelectItem value="Under Contract">Under Contract</SelectItem>
              </SelectContent>
            </Select>
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

          <CompactField label="Purpose">
            {/* No v6 options — text input (not invented) */}
            <Input
              type="text"
              name="purpose"
              value={jobDetails.purpose || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Purpose..."
              className="h-7 text-sm max-w-[160px]"
            />
          </CompactField>

          <CompactField label="Lead Appraiser">
            {/* No v6 options — text input (not invented) */}
            <Input
              type="text"
              name="leadAppraiser"
              value={jobDetails.leadAppraiser || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Lead appraiser..."
              className="h-7 text-sm max-w-[160px]"
            />
          </CompactField>

          <CompactField label="Desktop Report">
            <Select value={jobDetails.desktopReport || ''} onValueChange={value => handleSelectChange(value, 'desktopReport')}>
              <SelectTrigger className="h-7 text-sm max-w-[160px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
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

          {/* ── LOE-07 gap fields (feed the v07 contract template) ── */}
          <CompactField label="Current Use">
            <Input type="text" name="currentUse" value={(jobDetails as any).currentUse || ''} onChange={handleChange} onBlur={handleBlur} placeholder="Current use..." className="h-7 text-sm max-w-[160px]" />
          </CompactField>
          <CompactField label="Proposed Use">
            <Input type="text" name="proposedUse" value={(jobDetails as any).proposedUse || ''} onChange={handleChange} onBlur={handleBlur} placeholder="Proposed use..." className="h-7 text-sm max-w-[160px]" />
          </CompactField>
          <CompactField label="Approaches to Value">
            <Input type="text" name="approachesToValue" value={(jobDetails as any).approachesToValue || ''} onChange={handleChange} onBlur={handleBlur} placeholder="Approaches..." className="h-7 text-sm max-w-[160px]" />
          </CompactField>
          <CompactField label="Delivery Time (wks)">
            <Input type="text" name="deliveryTime" value={(jobDetails as any).deliveryTime || ''} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. 4" className="h-7 text-sm max-w-[160px]" />
          </CompactField>
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
          onClose={() => setShowPreview(false)}
          job={job}
          jobDetails={jobDetails}
          documentHTML={previewHTML}
          onApprove={handleApproveAndSend}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default LoeQuoteSection;
