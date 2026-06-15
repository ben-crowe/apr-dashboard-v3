import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, FileText, Download, ExternalLink, Upload, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { SectionProps } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { SectionTitle, sectionTriggerStyle, sectionContentStyle, FieldRow, SectionGroup, TwoColumnFields, CompactField } from "./ValcreStyles";
import { sendToValcre } from "@/utils/webhooks/valcre";
import { isValcreJobNumber } from "@/config/valcre";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ClientSubmissionSection: React.FC<SectionProps> = ({
  job,
  onUpdateJob,
  onUpdateDetails,
  jobDetails,
  testMode = false,
  insertFromData = false
}) => {
  // Source fields (Property Type / Subtype / Tenancy) light yellow when "Insert from data" maps them
  // into Section 2's cascade — mirrors the mock's src-mapped highlight.
  const srcTint = (filled: unknown): React.CSSProperties | undefined =>
    testMode && insertFromData && filled
      ? { background: '#fef9c3', borderBottomColor: '#eab308', color: '#1f2937', borderRadius: 4, paddingLeft: 6, paddingRight: 6 }
      : undefined;
  const srcTriggerCls = (filled: unknown): string =>
    testMode && insertFromData && filled
      ? 'h-7 text-sm w-[160px] border-0 border-b'
      : 'h-7 text-sm w-[160px] !bg-transparent border-0 border-b border-b-gray-300 dark:border-b-white/[0.12] !rounded-none';
  const [isOpen, setIsOpen] = useState(true);
  
  // Auto-save state for section-level spinner
  const [isSectionSaving, setIsSectionSaving] = useState(false);
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});
  
  // Fields that sync to Valcre
  const VALCRE_SYNC_FIELDS = [
    'notes', 'valuationPremises', 'intendedUse', 'assetCondition', 'propertyTypes', 'propertyName', 'propertyAddress',
    'clientFirstName', 'clientLastName', 'clientTitle', 'clientOrganization', 'clientEmail', 'clientPhone', 'clientAddress',
    'propertyContactFirstName', 'propertyContactLastName', 'propertyContactEmail', 'propertyContactPhone',
    // Wired 2026-06-15 (2nd batch, ui-designer live-pull verified) — tenancy → CF12408 SingleOption (opts 7418-7423).
    // Tenancy is entered HERE in Section 1 (Section 2 only mirrors it), so it must sync from here. All six dashboard
    // options match the server map exactly (incl. Valcre's own 'Unkown' typo = id 7422) → no silent-no-write.
    'tenancy',
    // Wired 2026-06-15 (2nd batch) — propertySubtype → native Property.SecondaryType (NOT a custom field).
    // Server already handles it on both paths (api/valcre.ts: update L823-865 PATCHes the linked Property,
    // create L1242). Create-job already sent it; the EDIT path was the gap — the onChange below only set
    // local state, never fired the sync. Same sync-only helper as tenancy. Free-text native field → raw write.
    'propertySubtype'
  ];

  // Helper function to get user-friendly field names for toast messages
  const getFieldDisplayName = (fieldName: string): string => {
    const fieldNames: Record<string, string> = {
      notes: 'Client Comments',
      valuationPremises: 'Valuation Premises',
      intendedUse: 'Authorized Use',
      assetCondition: 'Asset Condition',
      propertyTypes: 'Property Types',
      propertyName: 'Property Name',
      propertyAddress: 'Property Address',
      clientFirstName: 'Client First Name',
      clientLastName: 'Client Last Name',
      clientTitle: 'Client Title',
      clientOrganization: 'Client Organization',
      clientEmail: 'Client Email',
      clientPhone: 'Client Phone',
      clientAddress: 'Client Address',
      propertyContactFirstName: 'Property Contact First Name',
      propertyContactLastName: 'Property Contact Last Name',
      propertyContactEmail: 'Property Contact Email',
      propertyContactPhone: 'Property Contact Phone'
    };
    return fieldNames[fieldName] || fieldName;
  };
  
  // Auto-save function
  const autoSaveField = useCallback(async (fieldName: string, value: any) => {
    if (!onUpdateJob) return;
    
    try {
      setIsSectionSaving(true);
      
      // Always save to Supabase first
      await onUpdateJob({ [fieldName]: value });
      
      // Check if this field should also sync to Valcre
      const shouldSyncToValcre = VALCRE_SYNC_FIELDS.includes(fieldName) &&
                                  isValcreJobNumber(jobDetails?.jobNumber) &&
                                  jobDetails?.valcreJobId;
      
      if (shouldSyncToValcre) {
        const syncData: any = {
          jobId: jobDetails.valcreJobId,
          jobNumber: jobDetails.jobNumber,
          updateType: 'loe_details'
        };
        
        // Map field names correctly for Valcre sync
        if (fieldName === 'notes') syncData.notes = value;
        if (fieldName === 'valuationPremises') syncData.valuationPremises = value;
        if (fieldName === 'intendedUse') syncData.intendedUse = value;
        if (fieldName === 'assetCondition') syncData.assetCondition = value;
        if (fieldName === 'propertyTypes') syncData.propertyTypes = value;
        if (fieldName === 'tenancy') syncData.tenancy = value;   // → CF12408 SingleOption (wired 2026-06-15, 2nd batch)
        if (fieldName === 'propertyName') syncData.propertyName = value;
        if (fieldName === 'propertyAddress') syncData.propertyAddress = value;
        if (fieldName === 'clientFirstName') syncData.clientFirstName = value;
        if (fieldName === 'clientLastName') syncData.clientLastName = value;
        if (fieldName === 'clientTitle') syncData.clientTitle = value;
        if (fieldName === 'clientOrganization') syncData.clientOrganization = value;
        if (fieldName === 'clientEmail') syncData.clientEmail = value;
        if (fieldName === 'clientPhone') syncData.clientPhone = value;
        if (fieldName === 'clientAddress') syncData.clientAddress = value;
        if (fieldName === 'propertyContactFirstName') syncData.propertyContactFirstName = value;
        if (fieldName === 'propertyContactLastName') syncData.propertyContactLastName = value;
        if (fieldName === 'propertyContactEmail') syncData.propertyContactEmail = value;
        if (fieldName === 'propertyContactPhone') syncData.propertyContactPhone = value;
        
        console.log(`Syncing ${fieldName} to Valcre:`, syncData);
        const result = await sendToValcre(syncData);
        
        if (!result.success) {
          console.warn(`Failed to sync ${fieldName} to Valcre:`, result.error);
          toast.error(`Failed to sync ${getFieldDisplayName(fieldName)} to Valcre`);
        }
      } else {
        // Field saved but not synced (no Valcre job yet)
        // Silent save — no toast for routine field updates
      }
    } catch (error) {
      console.error(`Error saving ${fieldName}:`, error);
      // Only popup a save failure when there's a real Valcre job. No job = just playing/testing
      // fields → stay silent (Ben: no popup spam without a job number).
      if (isValcreJobNumber(jobDetails?.jobNumber) && jobDetails?.valcreJobId) {
        toast.error(`Failed to save ${getFieldDisplayName(fieldName)}`);
      }
    } finally {
      setIsSectionSaving(false);
    }
  }, [onUpdateJob, jobDetails, VALCRE_SYNC_FIELDS]);

  // Sync-ONLY helper for jobDetails-store fields (wired 2026-06-15, 2nd batch).
  // WHY this exists separate from autoSaveField: autoSaveField persists via onUpdateJob →
  // job_submissions, which has NO tenancy column (handleUpdateJob field map in useJobDetail.ts).
  // Tenancy's canonical home is job_property_info (DB-verified 2026-06-15: useSaveJobDetails.ts routes
  // 'tenancy' + 'propertySubtype' to job_property_info, NOT job_loe_details), already persisted via onUpdateDetails.
  // So tenancy must NOT ride autoSaveField (would mis-write/no-op the DB copy) — it persists via
  // onUpdateDetails and fires ONLY the Valcre sync here. NOTE: tenancy → CF12408 is a CUSTOM-field-
  // only update → empty native PATCH → blocked by the same server empty-native-PATCH bug until that
  // server fix deploys; so this lands only WITH that deploy (honest "failed" popup pre-deploy).
  const syncDetailFieldToValcre = useCallback(async (fieldName: string, value: any) => {
    const shouldSyncToValcre = VALCRE_SYNC_FIELDS.includes(fieldName) &&
                                isValcreJobNumber(jobDetails?.jobNumber) &&
                                jobDetails?.valcreJobId;
    if (!shouldSyncToValcre) return;
    try {
      const syncData: any = {
        jobId: jobDetails.valcreJobId,
        jobNumber: jobDetails.jobNumber,
        updateType: 'loe_details',
      };
      if (fieldName === 'tenancy') syncData.tenancy = value; // → CF12408 SingleOption
      if (fieldName === 'propertySubtype') syncData.propertySubtype = value; // → native Property.SecondaryType (server reads jobData.propertySubtype)
      console.log(`Syncing ${fieldName} to Valcre:`, syncData);
      const result = await sendToValcre(syncData);
      if (!result.success) {
        console.warn(`Failed to sync ${fieldName} to Valcre:`, result.error);
        toast.error(`Failed to sync ${getFieldDisplayName(fieldName)} to Valcre`);
      }
    } catch (error) {
      console.error(`Error syncing ${fieldName} to Valcre:`, error);
      if (isValcreJobNumber(jobDetails?.jobNumber) && jobDetails?.valcreJobId) {
        toast.error(`Failed to sync ${getFieldDisplayName(fieldName)} to Valcre`);
      }
    }
  }, [jobDetails, VALCRE_SYNC_FIELDS]);

  // Handle field blur with debouncing
  const handleBlur = useCallback((fieldName: string, value: any) => {
    // Clear existing timer
    if (debounceTimers.current[fieldName]) {
      clearTimeout(debounceTimers.current[fieldName]);
    }
    
    // Set new timer
    debounceTimers.current[fieldName] = setTimeout(() => {
      autoSaveField(fieldName, value);
    }, 500);
  }, [autoSaveField]);
  
  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);
  
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format phone number as (XXX) XXX-XXXX
  const formatPhoneNumber = (value: string): string => {
    if (!value) return '';
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };


  // Handle file upload
  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Sanitize filename
        const sanitizedName = file.name
          .replace(/\s+/g, '_')
          .replace(/[^a-zA-Z0-9._-]/g, '');

        const filePath = `${job.id}/${sanitizedName}`;

        console.log(`📤 Uploading file: ${file.name} → ${sanitizedName}`);

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('job-files')
          .upload(filePath, file);

        if (uploadError) {
          console.error('❌ File upload error:', uploadError);
          (isValcreJobNumber(jobDetails?.jobNumber) && (jobDetails as any)?.valcreJobId) && toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
          continue;
        }

        console.log('✅ File uploaded successfully:', uploadData);

        // Save file reference to database
        const { error: dbError } = await supabase.from('job_files').insert({
          job_id: job.id,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
        });

        if (dbError) {
          console.error('❌ Database insert error:', dbError);
          (isValcreJobNumber(jobDetails?.jobNumber) && (jobDetails as any)?.valcreJobId) && toast.error(`Failed to save ${file.name} reference`);
        } else {
          console.log('✅ File reference saved to database');
        }
      }

      void 0 /* success: silent (Ben) */;

      // Refresh file list without closing job
      const { data: fileData, error: fileError } = await supabase
        .from('job_files')
        .select('*')
        .eq('job_id', job.id)
        .order('created_at', { ascending: false });

      if (!fileError && fileData && onUpdateJob) {
        onUpdateJob({
          files: fileData.map(f => ({
            id: f.id,
            fileName: f.file_name,
            filePath: f.file_path,
            fileType: f.file_type,
            fileSize: f.file_size,
          }))
        });
      }

    } catch (error) {
      console.error('Upload error:', error);
      (isValcreJobNumber(jobDetails?.jobNumber) && (jobDetails as any)?.valcreJobId) && toast.error('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Handle file deletion
  const handleDeleteFile = async (file: any) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('job-files')
        .remove([file.filePath]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
        (isValcreJobNumber(jobDetails?.jobNumber) && (jobDetails as any)?.valcreJobId) && toast.error('Failed to delete file from storage');
        return;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('job_files')
        .delete()
        .eq('id', file.id);

      if (dbError) {
        console.error('Database deletion error:', dbError);
        (isValcreJobNumber(jobDetails?.jobNumber) && (jobDetails as any)?.valcreJobId) && toast.error('Failed to delete file reference');
        return;
      }

      void 0 /* success: silent (Ben) */;

      // Refresh file list without closing job
      const { data: fileData, error: fileError } = await supabase
        .from('job_files')
        .select('*')
        .eq('job_id', job.id)
        .order('created_at', { ascending: false });

      if (!fileError && fileData && onUpdateJob) {
        onUpdateJob({
          files: fileData.map(f => ({
            id: f.id,
            fileName: f.file_name,
            filePath: f.file_path,
            fileType: f.file_type,
            fileSize: f.file_size,
          }))
        });
      }

    } catch (error) {
      console.error('Delete error:', error);
      (isValcreJobNumber(jobDetails?.jobNumber) && (jobDetails as any)?.valcreJobId) && toast.error('Failed to delete file');
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full border border-gray-400 dark:border-white/20 rounded-lg dark:bg-black/15">
      <CollapsibleTrigger className={`${sectionTriggerStyle} flex items-center justify-between w-full px-4 py-3 bg-gray-200 dark:bg-gray-800 rounded-t-lg`}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            <SectionTitle title="Client Information & Property Details" />
          </div>
          {isSectionSaving && (
            <Loader2 className="h-4 w-4 text-gray-400 dark:text-muted-foreground animate-spin mr-2" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className={sectionContentStyle}>
        {/* Inner 'Test Data' button removed — the global top 'Fill Test Data' button (JobDetailAccordion) fills all sections. */}

        {/* Client Information Group */}
        <SectionGroup title="Client Information">
          <TwoColumnFields className="md:!grid-cols-[1fr_1fr] md:!max-w-[1100px] pr-8">
            <CompactField label="First Name">
              <div className="relative">
                <Input value={job.clientFirstName || ''} onChange={(e) => onUpdateJob?.({clientFirstName: e.target.value})} onBlur={(e) => handleBlur('clientFirstName', e.target.value)} placeholder="First name" className="h-7 text-sm w-full !border-0 !rounded-none bg-transparent !px-0 !shadow-none" />
                <div className="absolute bottom-0 left-0 w-[160px] h-px bg-gray-300 dark:bg-white/[0.12]" />
              </div>
            </CompactField>
            <CompactField label="Last Name">
              <div className="relative">
                <Input value={job.clientLastName || ''} onChange={(e) => onUpdateJob?.({clientLastName: e.target.value})} onBlur={(e) => handleBlur('clientLastName', e.target.value)} placeholder="Last name" className="h-7 text-sm w-full !border-0 !rounded-none bg-transparent !px-0 !shadow-none" />
                <div className="absolute bottom-0 left-0 w-[160px] h-px bg-gray-300 dark:bg-white/[0.12]" />
              </div>
            </CompactField>
            <CompactField label="Title">
              <div className="relative">
                <Input value={job.clientTitle || ''} onChange={(e) => onUpdateJob?.({clientTitle: e.target.value})} onBlur={(e) => handleBlur('clientTitle', e.target.value)} placeholder="Title" className="h-7 text-sm w-full !border-0 !rounded-none bg-transparent !px-0 !shadow-none" />
                <div className="absolute bottom-0 left-0 w-[160px] h-px bg-gray-300 dark:bg-white/[0.12]" />
              </div>
            </CompactField>
            <CompactField label="Organization">
              <div className="relative">
                <Input value={job.clientOrganization || ''} onChange={(e) => onUpdateJob?.({clientOrganization: e.target.value})} onBlur={(e) => handleBlur('clientOrganization', e.target.value)} placeholder="Organization" className="h-7 text-sm w-full !border-0 !rounded-none bg-transparent !px-0 !shadow-none" />
                <div className="absolute bottom-0 left-0 w-[160px] h-px bg-gray-300 dark:bg-white/[0.12]" />
              </div>
            </CompactField>
            <CompactField label="Phone">
              <div className="relative">
                <Input type="tel" value={job.clientPhone ? formatPhoneNumber(job.clientPhone) : ''} onChange={(e) => { const numbersOnly = e.target.value.replace(/\D/g, ''); onUpdateJob?.({clientPhone: numbersOnly}); }} onBlur={(e) => handleBlur('clientPhone', e.target.value.replace(/\D/g, ''))} placeholder="Phone" className="h-7 text-sm w-full !border-0 !rounded-none bg-transparent !px-0 !shadow-none" />
                <div className="absolute bottom-0 left-0 w-[160px] h-px bg-gray-300 dark:bg-white/[0.12]" />
              </div>
            </CompactField>
            <CompactField label="Email">
              <div className="relative">
                <Input value={job.clientEmail || ''} onChange={(e) => onUpdateJob?.({clientEmail: e.target.value})} onBlur={(e) => handleBlur('clientEmail', e.target.value)} placeholder="Email" className="h-7 text-sm w-full !border-0 !rounded-none bg-transparent !px-0 !shadow-none" />
                <div className="absolute bottom-0 left-0 w-[160px] h-px bg-gray-300 dark:bg-white/[0.12]" />
              </div>
            </CompactField>
          </TwoColumnFields>
          {/* Address — single line, no underline */}
          <div className="mt-4 mb-5">
            <CompactField label="Address">
              <Input
                value={job.clientAddress || ''}
                onChange={(e) => onUpdateJob?.({clientAddress: e.target.value})}
                onBlur={(e) => handleBlur('clientAddress', e.target.value)}
                placeholder="123 Main Street, Suite 500, Calgary, AB T2P 1A1"
                className="h-7 text-sm border-0 border-b border-b-gray-300 dark:border-b-white/[0.12] rounded-none bg-transparent px-0 w-full"
              />
            </CompactField>
          </div>
        </SectionGroup>

        {/* Property Information Group */}
        <SectionGroup title="Property Information">
          <TwoColumnFields className="md:!grid-cols-[1fr_1fr] md:!max-w-[1100px] pr-8">
            <CompactField label="Property Name">
              <div className="relative">
                <Input value={job.propertyName || ''} onChange={(e) => onUpdateJob?.({propertyName: e.target.value})} onBlur={(e) => handleBlur('propertyName', e.target.value)} placeholder="Property name" className="h-7 text-sm w-full !border-0 !rounded-none bg-transparent !px-0 !shadow-none" />
                <div className="absolute bottom-0 left-0 w-[160px] h-px bg-gray-300 dark:bg-white/[0.12]" />
              </div>
            </CompactField>
            <CompactField label="Property Type">
              <Select
                value={job.propertyType?.split(',')[0]?.trim() || ''}
                onValueChange={(value) => {
                  const v = value === '__clear__' ? '' : value;
                  onUpdateJob?.({ propertyType: v });
                  autoSaveField('propertyType', v);
                }}
              >
                <SelectTrigger className={srcTriggerCls(job.propertyType)} style={srcTint(job.propertyType) || { paddingLeft: 0, paddingRight: 0 }}>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__clear__" className="text-gray-400 dark:text-white/40">— None</SelectItem>
                  <SelectItem value="Agriculture">Agriculture</SelectItem>
                  <SelectItem value="Building">Building</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Hotel">Hotel</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Land">Land</SelectItem>
                  <SelectItem value="Manufactured Housing">Manufactured Housing</SelectItem>
                  <SelectItem value="Multifamily">Multifamily</SelectItem>
                  <SelectItem value="Office">Office</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Self-Storage">Self-Storage</SelectItem>
                  <SelectItem value="Single-Family">Single-Family</SelectItem>
                  <SelectItem value="Seniors">Seniors</SelectItem>
                  <SelectItem value="Special Purpose">Special Purpose</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>
            <CompactField label="Property Subtype">
              <Select
                value={jobDetails?.propertySubtype || ''}
                onValueChange={(value) => {
                  const v = value === '__clear__' ? '' : value;
                  onUpdateDetails?.({ propertySubtype: v });   // persists to job_property_info (DB-verified, unchanged)
                  syncDetailFieldToValcre('propertySubtype', v); // wired 2026-06-15 (2nd batch) → native Property.SecondaryType
                }}
              >
                <SelectTrigger className={srcTriggerCls(jobDetails?.propertySubtype)} style={srcTint(jobDetails?.propertySubtype) || { paddingLeft: 0, paddingRight: 0 }}>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__clear__" className="text-gray-400 dark:text-white/40">— None</SelectItem>
                  <SelectItem value="Low-Rise">Low-Rise</SelectItem>
                  <SelectItem value="Mid-Rise">Mid-Rise</SelectItem>
                  <SelectItem value="High-Rise">High-Rise</SelectItem>
                  <SelectItem value="Garden">Garden</SelectItem>
                  <SelectItem value="Walk-Up">Walk-Up</SelectItem>
                  <SelectItem value="Townhouse">Townhouse</SelectItem>
                  <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>
            <CompactField label="Tenancy">
              <Select
                value={jobDetails?.tenancy || ''}
                onValueChange={(value) => {
                  const v = value === '__clear__' ? '' : value;
                  onUpdateDetails?.({ tenancy: v });   // persists to job_property_info (DB-verified, unchanged)
                  syncDetailFieldToValcre('tenancy', v); // wired 2026-06-15 (2nd batch) → CF12408
                }}
              >
                <SelectTrigger className={srcTriggerCls(jobDetails?.tenancy)} style={srcTint(jobDetails?.tenancy) || { paddingLeft: 0, paddingRight: 0 }}>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__clear__" className="text-gray-400 dark:text-white/40">— None</SelectItem>
                  <SelectItem value="Multi-Tenant">Multi-Tenant</SelectItem>
                  <SelectItem value="Owner Occupied">Owner Occupied</SelectItem>
                  <SelectItem value="Partial Owner Occupied">Partial Owner Occupied</SelectItem>
                  <SelectItem value="Single-Tenant">Single-Tenant</SelectItem>
                  <SelectItem value="Unkown">Unkown</SelectItem>
                  <SelectItem value="Vacant">Vacant</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>
          </TwoColumnFields>
          {/* Address — single line, no underline */}
          <div className="mt-4 mb-5">
            <CompactField label="Address">
              <Input
                value={job.propertyAddress || ''}
                onChange={(e) => onUpdateJob?.({propertyAddress: e.target.value})}
                onBlur={(e) => handleBlur('propertyAddress', e.target.value)}
                placeholder="2800 Bayview Avenue, Calgary, AB T2P 1A1"
                className="h-7 text-sm border-0 border-b border-b-gray-300 dark:border-b-white/[0.12] rounded-none bg-transparent px-0 w-full"
              />
            </CompactField>
          </div>
          {/* Three selects — use same TwoColumnFields grid so edges align */}
          <TwoColumnFields className="md:!grid-cols-[1fr_1fr] md:!max-w-[1100px] pr-8">
            <CompactField label="Authorized Use">
              <Select
                value={job.intendedUse || ''}
                onValueChange={(value) => {
                  const v = value === '__clear__' ? '' : value;
                  onUpdateJob?.({intendedUse: v});
                  autoSaveField('intendedUse', v);
                }}
              >
                {/* Provenance: Authorized Use shades ORANGE only while it's the active Insurance override
                    (Test Mode + value = Insurance) — mirrors the mock; resting look stays unshaded. */}
                <SelectTrigger
                  className={testMode && job.intendedUse === 'Insurance'
                    ? 'h-7 text-sm w-[160px] border-0 border-b px-1.5'
                    : 'h-7 text-sm w-[160px] !bg-transparent border-0 border-b border-b-gray-300 dark:border-b-white/[0.12] !rounded-none'}
                  style={testMode && job.intendedUse === 'Insurance'
                    ? { background: '#ffedd5', borderBottomColor: '#f97316', color: '#1f2937', borderRadius: 4 }
                    : { paddingLeft: 0, paddingRight: 0 }}
                >
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__clear__" className="text-gray-400 dark:text-white/40">— None</SelectItem>
                  <SelectItem value="First Mortgage Financing">First Mortgage Financing</SelectItem>
                  <SelectItem value="Financial Reporting">Financial Reporting</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                  <SelectItem value="Internal Decision-Making">Internal Decision-Making</SelectItem>
                  <SelectItem value="Acquisition-Disposition">Acquisition-Disposition</SelectItem>
                  <SelectItem value="Estate Planning">Estate Planning</SelectItem>
                  <SelectItem value="Litigation">Litigation</SelectItem>
                  <SelectItem value="GST">GST</SelectItem>
                  {/* Canonical 8 = registry ListAuthorizedUse. "Underwriting Decisions" + "Other" removed
                      2026-06-05 — not valid IntendedUses, silently fail the native map (gotcha d). */}
                </SelectContent>
              </Select>
            </CompactField>
            <CompactField label="Valuation Premises">
              <Select
                value={job.valuationPremises || ''}
                onValueChange={(value) => {
                  const v = value === '__clear__' ? '' : value;
                  onUpdateJob?.({valuationPremises: v});
                  autoSaveField('valuationPremises', v);
                }}
              >
                <SelectTrigger className="h-7 text-sm w-[160px] !bg-transparent border-0 border-b border-b-gray-300 dark:border-b-white/[0.12] !rounded-none" style={{ paddingLeft: 0, paddingRight: 0 }}>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__clear__" className="text-gray-400 dark:text-white/40">— None</SelectItem>
                  <SelectItem value="Market Value">Market Value</SelectItem>
                  <SelectItem value="Market Rent">Market Rent</SelectItem>
                  <SelectItem value="Investment Value">Investment Value</SelectItem>
                  <SelectItem value="Insurable Value">Insurable Value</SelectItem>
                  <SelectItem value="Liquidation Value">Liquidation Value</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>
            <CompactField label="Asset Condition">
              <Select
                value={job.assetCondition || ''}
                onValueChange={(value) => {
                  const v = value === '__clear__' ? '' : value;
                  onUpdateJob?.({assetCondition: v});
                  autoSaveField('assetCondition', v);
                }}
              >
                <SelectTrigger className="h-7 text-sm w-[160px] !bg-transparent border-0 border-b border-b-gray-300 dark:border-b-white/[0.12] !rounded-none" style={{ paddingLeft: 0, paddingRight: 0 }}>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__clear__" className="text-gray-400 dark:text-white/40">— None</SelectItem>
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Very Good">Very Good</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>
          </TwoColumnFields>
        </SectionGroup>

        {/* Property Contact */}
        <SectionGroup title="Property Contact">
          <TwoColumnFields className="md:!grid-cols-[1fr_1fr] md:!max-w-[1100px] pr-8">
            <CompactField label="First Name">
              <div className="relative">
                <Input value={job.propertyContactFirstName || ''} onChange={(e) => onUpdateJob?.({propertyContactFirstName: e.target.value})} onBlur={(e) => handleBlur('propertyContactFirstName', e.target.value)} placeholder="Contact first name" className="h-7 text-sm w-full !border-0 !rounded-none bg-transparent !px-0 !shadow-none" />
                <div className="absolute bottom-0 left-0 w-[160px] h-px bg-gray-300 dark:bg-white/[0.12]" />
              </div>
            </CompactField>
            <CompactField label="Email">
              <div className="relative">
                <Input value={job.propertyContactEmail || ''} onChange={(e) => onUpdateJob?.({propertyContactEmail: e.target.value})} onBlur={(e) => handleBlur('propertyContactEmail', e.target.value)} placeholder="Contact email" className="h-7 text-sm w-full !border-0 !rounded-none bg-transparent !px-0 !shadow-none" />
                <div className="absolute bottom-0 left-0 w-[160px] h-px bg-gray-300 dark:bg-white/[0.12]" />
              </div>
            </CompactField>
            <CompactField label="Last Name">
              <div className="relative">
                <Input value={job.propertyContactLastName || ''} onChange={(e) => onUpdateJob?.({propertyContactLastName: e.target.value})} onBlur={(e) => handleBlur('propertyContactLastName', e.target.value)} placeholder="Contact last name" className="h-7 text-sm w-full !border-0 !rounded-none bg-transparent !px-0 !shadow-none" />
                <div className="absolute bottom-0 left-0 w-[160px] h-px bg-gray-300 dark:bg-white/[0.12]" />
              </div>
            </CompactField>
            <CompactField label="Phone">
              <div className="relative">
                <Input type="tel" value={job.propertyContactPhone ? formatPhoneNumber(job.propertyContactPhone) : ''} onChange={(e) => { const numbersOnly = e.target.value.replace(/\D/g, ''); onUpdateJob?.({propertyContactPhone: numbersOnly}); }} onBlur={(e) => handleBlur('propertyContactPhone', e.target.value.replace(/\D/g, ''))} placeholder="Contact phone" className="h-7 text-sm w-full !border-0 !rounded-none bg-transparent !px-0 !shadow-none" />
                <div className="absolute bottom-0 left-0 w-[160px] h-px bg-gray-300 dark:bg-white/[0.12]" />
              </div>
            </CompactField>
          </TwoColumnFields>
        </SectionGroup>

        {/* Client Comments Section */}
        <SectionGroup title="Client Comments">
          <div className="ml-8">
            <Textarea
              value={job.notes || ''}
              onChange={(e) => onUpdateJob?.({notes: e.target.value})}
              onBlur={(e) => handleBlur('notes', e.target.value)}
              placeholder="Notes"
              rows={2}
              className="text-sm resize-none min-h-[40px] max-w-[400px]"
            />
          </div>
        </SectionGroup>

        {/* Uploaded Documents Section */}
        <SectionGroup title="Uploaded Documents">
          <div
            className="space-y-3 ml-8"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {/* Compact Upload Button */}
            <div className={`transition-all ${dragActive ? 'bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border-2 border-dashed border-blue-500' : ''}`}>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload(e.target.files);
                  }
                }}
              />

              {dragActive ? (
                <div className="text-center py-2">
                  <Upload className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Drop files here</p>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="h-8"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Files'}
                </Button>
              )}
            </div>

            {/* Uploaded Files List - Compact */}
            <div className="space-y-1.5">
              {job.files && job.files.length > 0 ? (
                job.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2 bg-muted rounded border border-border hover:bg-muted dark:hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">
                          {file.fileName}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {(file.fileSize / 1024).toFixed(0)} KB
                      </span>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          try {
                            const { data, error } = await supabase.storage
                              .from('job-files')
                              .download(file.filePath);

                            if (error) throw error;

                            const url = URL.createObjectURL(data);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = file.fileName;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);

                            void 0 /* success: silent (Ben) */;
                          } catch (error) {
                            console.error('Download error:', error);
                            (isValcreJobNumber(jobDetails?.jobNumber) && (jobDetails as any)?.valcreJobId) && toast.error('Failed to download file');
                          }
                        }}
                        className="h-7 w-7 p-0"
                        title="Download"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          try {
                            const { data, error } = await supabase.storage
                              .from('job-files')
                              .createSignedUrl(file.filePath, 3600);

                            if (error) throw error;

                            window.open(data.signedUrl, '_blank');
                          } catch (error) {
                            console.error('View error:', error);
                            (isValcreJobNumber(jobDetails?.jobNumber) && (jobDetails as any)?.valcreJobId) && toast.error('Failed to view file');
                          }
                        }}
                        className="h-7 w-7 p-0"
                        title="View"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFile(file)}
                        className="h-7 w-7 p-0 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">No files uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        </SectionGroup>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ClientSubmissionSection;
