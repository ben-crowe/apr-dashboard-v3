
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionTitle, sectionTriggerStyle, sectionContentStyle, FieldRow, SectionGroup, TwoColumnFields, CompactField } from "./ValcreStyles";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [fieldStates, setFieldStates] = useState<Record<string, 'idle' | 'saving' | 'success'>>({});
  
  // Local state for currency fields during editing (prevents controlled input issues)
  const [editingAppraisalFee, setEditingAppraisalFee] = useState<string | null>(null);
  const [editingRetainerAmount, setEditingRetainerAmount] = useState<string | null>(null);
  const [editingPaymentAmount, setEditingPaymentAmount] = useState<string | null>(null);
  const [commentsExpanded, setCommentsExpanded] = useState(false);

  // Debounce timers
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});

  // Fields that sync to Valcre (from valcre.ts lines 231-248)
  const VALCRE_SYNC_FIELDS = ['appraisalFee', 'retainerAmount', 'deliveryDate', 'paymentTerms', 'appraiserComments', 'deliveryComments', 'paymentComments', 'propertyRightsAppraised', 'scopeOfWork', 'valuationPremises', 'reportType', 'paymentAmount', 'paymentPaidDate'];

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
      paymentAmount: 'Payment Amount',
      paymentPaidDate: 'Payment Paid Date',
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

          console.log(`Syncing ${fieldName} to Valcre:`, syncData);
          const result = await sendToValcre(syncData);

          if (!result.success) {
            console.error('Valcre sync failed:', result.error);
            toast.error(`Failed to sync ${getFieldDisplayName(fieldName)} to Valcre`);
          }
        } else {
          // Field saved to Supabase but no Valcre job yet
          // Silent save — no toast for routine field updates
        }

        // Clear field and section saving states
        setFieldStates(prev => ({ ...prev, [fieldName]: 'idle' }));
        setIsSectionSaving(false);

      } catch (error: any) {
        console.error('Auto-save error:', error);
        toast.error(`Failed to save ${fieldName}`);
        setFieldStates(prev => ({ ...prev, [fieldName]: 'idle' }));
        setIsSectionSaving(false);
      }
    }, 500); // 500ms debounce
  }, [job, jobDetails, onUpdateDetails, VALCRE_SYNC_FIELDS]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(timer => clearTimeout(timer));
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
    const STATIC_FEE = 3500;  // Fixed fee amount for testing
    const STATIC_RETAINER = 350;  // Fixed 10% retainer

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
      paymentAmount: (STATIC_FEE - STATIC_RETAINER).toFixed(2),
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
            {isOpen ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
            <SectionTitle title="LOE Quote & Valuation Details" />
          </div>
          {isSectionSaving && (
            <Loader2 className="h-4 w-4 text-gray-400 dark:text-gray-500 animate-spin mr-2" />
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
                  className="border border-gray-300 dark:border-white/30 bg-background dark:bg-transparent text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/50 hover:text-gray-900 transition-colors text-sm font-medium"
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
                  className="border border-gray-300 dark:border-white/30 bg-background dark:bg-transparent text-gray-900 dark:text-white cursor-not-allowed text-sm font-medium"
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
                className="!border !border-gray-300 dark:!border-white/30 !bg-transparent !text-gray-900 dark:!text-white hover:!bg-gray-100 dark:hover:!bg-white/10 hover:!border-gray-400 dark:hover:!border-white/50 transition-colors text-sm font-medium"
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
                        className="!border !border-gray-300 dark:!border-white/30 !bg-transparent !text-gray-900 dark:!text-white cursor-not-allowed text-sm font-medium"
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
                          className="border border-gray-300 dark:border-white/30 bg-background dark:bg-transparent text-gray-900 dark:text-white cursor-not-allowed text-sm font-medium"
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
                          className="border border-gray-300 dark:border-white/30 bg-background dark:bg-transparent text-gray-900 dark:text-white cursor-not-allowed text-sm font-medium"
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
                className="border border-gray-300 dark:border-white/30 bg-background dark:bg-transparent text-gray-900 dark:text-white cursor-not-allowed text-sm font-medium"
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
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
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
          </TwoColumnFields>
        </SectionGroup>

        {/* Job Details Section - Valuation fields */}
        <SectionGroup title="Job Details">

        {/* Valuation Details Section */}
        <TwoColumnFields>
          {/* Row 1 */}
          <CompactField label="Property Rights">
            <Select value={jobDetails.propertyRightsAppraised || ''} onValueChange={value => handleSelectChange(value, 'propertyRightsAppraised')}>
              <SelectTrigger className="h-7 text-sm max-w-[160px] !bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 !rounded-none px-0">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASC 805">ASC 805</SelectItem>
                <SelectItem value="Condominium Ownership">Condominium Ownership</SelectItem>
                <SelectItem value="Cost Segregation Study">Cost Segregation Study</SelectItem>
                <SelectItem value="Fee Simple Interest">Fee Simple Interest</SelectItem>
                <SelectItem value="Going Concern">Going Concern</SelectItem>
                <SelectItem value="Leased Fee Interest">Leased Fee Interest</SelectItem>
                <SelectItem value="Leasehold Interest">Leasehold Interest</SelectItem>
                <SelectItem value="Market Study">Market Study</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
                <SelectItem value="Partial Interest">Partial Interest</SelectItem>
                <SelectItem value="Partial Interest Taking">Partial Interest Taking</SelectItem>
                <SelectItem value="Rent Restricted">Rent Restricted</SelectItem>
                <SelectItem value="Total Taking">Total Taking</SelectItem>
              </SelectContent>
            </Select>
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

          <CompactField label="Payment Amount">
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

          <CompactField label="Payment Paid">
            <Input
              type="date"
              name="paymentPaidDate"
              value={jobDetails.paymentPaidDate || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-7 text-sm max-w-[160px]"
            />
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
                  <label className="text-sm text-gray-600 dark:text-gray-400">{label}:</label>
                  <div className="flex items-start gap-1">
                    {name === 'appraiserComments' && ((jobDetails as any).appraiserComments || '').length + ((jobDetails as any).deliveryComments || '').length + ((jobDetails as any).paymentComments || '').length > 80 ? (
                      <button
                        type="button"
                        onClick={() => setCommentsExpanded(!commentsExpanded)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mt-0.5 flex-shrink-0"
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
