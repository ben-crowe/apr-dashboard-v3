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
  jobDetails
}) => {
  const [isOpen, setIsOpen] = useState(true);
  
  // Auto-save state for section-level spinner
  const [isSectionSaving, setIsSectionSaving] = useState(false);
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});
  
  // Fields that sync to Valcre
  const VALCRE_SYNC_FIELDS = ['notes'];
  
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
        
        // Map field names correctly
        if (fieldName === 'notes') syncData.notes = value;
        
        console.log(`Syncing ${fieldName} to Valcre:`, syncData);
        const result = await sendToValcre(syncData);
        
        if (!result.success) {
          console.warn(`Failed to sync ${fieldName} to Valcre:`, result.error);
          toast.error(`Failed to sync ${fieldName} to Valcre`);
        }
      }
    } catch (error) {
      console.error(`Error saving ${fieldName}:`, error);
      toast.error(`Failed to save ${fieldName}`);
    } finally {
      setIsSectionSaving(false);
    }
  }, [onUpdateJob, jobDetails, VALCRE_SYNC_FIELDS]);
  
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


  const fillClientTestData = () => {
    if (!onUpdateJob) return;

    const firstNames = ['Michael', 'Sarah', 'David', 'Jennifer', 'Robert'];
    const lastNames = ['Johnson', 'Williams', 'Brown', 'Garcia', 'Martinez'];
    const titles = ['VP of Real Estate', 'Property Manager', 'CEO', 'Director of Operations'];
    const companies = ['Premier Properties Inc', 'Urban Development Group', 'Skyline Investments'];
    const propertyNames = ['Downtown Plaza', 'Riverside Complex', 'Tech Center Building'];
    const streets = ['17th Avenue SW', '8th Avenue SW', 'Centre Street', 'Macleod Trail'];
    const propertyTypes = ['Multi-Family', 'Office', 'Retail', 'Industrial', 'Building'];
    const intendedUses = ['Financing/Refinancing', 'Acquisition', 'Disposition', 'Insurance'];
    const conditions = ['Excellent', 'Very Good', 'Good', 'Fair'];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const propertyName = propertyNames[Math.floor(Math.random() * propertyNames.length)];
    const street = streets[Math.floor(Math.random() * streets.length)];
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const intendedUse = intendedUses[Math.floor(Math.random() * intendedUses.length)];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];

    const buildingNum = Math.floor(Math.random() * 400) + 100;
    const suiteNum = Math.floor(Math.random() * 500) + 100;
    const propNum = Math.floor(Math.random() * 400) + 100;
    const sqft = (Math.floor(Math.random() * 20) + 5) * 1000;

    const testData = {
      clientFirstName: firstName,
      clientLastName: lastName,
      clientTitle: title,
      clientOrganization: company,
      clientAddress: `${buildingNum} ${street}, Suite ${suiteNum}, Calgary, AB T2P 3H7`,
      clientPhone: `403-555-0100`,
      clientEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/ /g, '')}.ca`,
      propertyName: propertyName,
      propertyAddress: `${propNum} ${street}, Calgary, AB T2R 1M5`,
      propertyType: propertyType,
      intendedUse: intendedUse,
      assetCondition: condition,
      notes: `Property is a ${sqft.toLocaleString()} sq ft ${propertyType} complex. Need appraisal for ${intendedUse}.`,
      // Initialize property contact fields as empty (user can choose to use checkbox)
      sameAsClientContact: false,
      propertyContactFirstName: '',
      propertyContactLastName: '',
      propertyContactEmail: '',
      propertyContactPhone: ''
    };

    onUpdateJob(testData);
    toast.success(`Test data populated: ${firstName} ${lastName} - ${propertyName}`);
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
          toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
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
          toast.error(`Failed to save ${file.name} reference`);
        } else {
          console.log('✅ File reference saved to database');
        }
      }

      toast.success(`${files.length} file(s) uploaded successfully`);

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
      toast.error('Failed to upload files');
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
        toast.error('Failed to delete file from storage');
        return;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('job_files')
        .delete()
        .eq('id', file.id);

      if (dbError) {
        console.error('Database deletion error:', dbError);
        toast.error('Failed to delete file reference');
        return;
      }

      toast.success('File deleted successfully');

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
      toast.error('Failed to delete file');
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full border rounded-lg">
      <CollapsibleTrigger className={`${sectionTriggerStyle} flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800`}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {isOpen ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
            <SectionTitle title="Client Information & Property Details" />
          </div>
          {isSectionSaving && (
            <Loader2 className="h-4 w-4 text-gray-400 dark:text-gray-500 animate-spin mr-2" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className={sectionContentStyle}>
        {/* Action Buttons */}
        <div className="flex justify-end items-center mb-6">
          <button
            type="button"
            onClick={fillClientTestData}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            Test Data
          </button>
        </div>

        {/* Client Information Group */}
        <SectionGroup title="Client Information">
          <TwoColumnFields>
            <CompactField label="First Name">
              <Input
                value={job.clientFirstName || ''}
                onChange={(e) => onUpdateJob?.({clientFirstName: e.target.value})}
                className="h-7 text-sm max-w-[200px]"
              />
            </CompactField>
            <CompactField label="Last Name">
              <Input
                value={job.clientLastName || ''}
                onChange={(e) => onUpdateJob?.({clientLastName: e.target.value})}
                className="h-7 text-sm max-w-[200px]"
              />
            </CompactField>
            <CompactField label="Title">
              <Input
                value={job.clientTitle || ''}
                onChange={(e) => onUpdateJob?.({clientTitle: e.target.value})}
                className="h-7 text-sm max-w-[200px]"
              />
            </CompactField>
            <CompactField label="Organization">
              <Input
                value={job.clientOrganization || ''}
                onChange={(e) => onUpdateJob?.({clientOrganization: e.target.value})}
                className="h-7 text-sm max-w-[200px]"
              />
            </CompactField>
            <CompactField label="Phone">
              <Input
                type="tel"
                value={job.clientPhone ? formatPhoneNumber(job.clientPhone) : ''}
                onChange={(e) => {
                  const numbersOnly = e.target.value.replace(/\D/g, '');
                  onUpdateJob?.({clientPhone: numbersOnly});
                }}
                className="h-7 text-sm max-w-[200px]"
              />
            </CompactField>
            <CompactField label="Email">
              <Input
                value={job.clientEmail || ''}
                onChange={(e) => onUpdateJob?.({clientEmail: e.target.value})}
                className="h-7 text-sm max-w-[200px]"
              />
            </CompactField>
            <CompactField label="Address">
              <Input
                value={job.clientAddress || ''}
                onChange={(e) => onUpdateJob?.({clientAddress: e.target.value})}
                className="h-7 text-sm max-w-[200px]"
              />
            </CompactField>
          </TwoColumnFields>
        </SectionGroup>

        {/* Property Information Group */}
        <SectionGroup title="Property Information">
          <TwoColumnFields>
            <CompactField label="Property Name">
              <Input
                value={job.propertyName || ''}
                onChange={(e) => onUpdateJob?.({propertyName: e.target.value})}
                className="h-7 text-sm max-w-[200px]"
              />
            </CompactField>
            <CompactField label="Property Types">
              <div className="flex items-center gap-2 flex-wrap">
                {/* "Add more" button at the front */}
                <Select
                  value=""
                  onValueChange={(value) => {
                    if (value) {
                      const currentTypes = job.propertyTypes || [];
                      if (currentTypes.includes(value)) {
                        // Remove if already selected
                        onUpdateJob?.({ propertyTypes: currentTypes.filter(t => t !== value) });
                      } else {
                        // Add if not selected
                        onUpdateJob?.({ propertyTypes: [...currentTypes, value] });
                      }
                    }
                  }}
                >
                  <SelectTrigger className="h-7 text-sm w-[100px]">
                    <SelectValue placeholder="Add more..." />
                  </SelectTrigger>
                  <SelectContent>
                    {['Agriculture', 'Building', 'Healthcare', 'Hospitality', 'Industrial', 'Land', 
                      'Manufactured Housing', 'Multi-Family', 'Office', 'Retail', 'Self-Storage', 
                      'Single-Family', 'Special Purpose', 'Unknown']
                      .map((type) => {
                        const isSelected = job.propertyTypes?.includes(type);
                        return (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                checked={isSelected}
                                onCheckedChange={() => {}} // Handled by SelectItem's onValueChange
                                className="pointer-events-none"
                              />
                              <span>{type}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
                
                {/* Selected Types Display - inline after the button */}
                {job.propertyTypes && job.propertyTypes.length > 0 && (
                  <>
                    {job.propertyTypes.map((type) => (
                      <span
                        key={type}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300"
                        style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}
                      >
                        {type}
                        <button
                          type="button"
                          onClick={() => {
                            const newTypes = job.propertyTypes?.filter(t => t !== type) || [];
                            onUpdateJob?.({ propertyTypes: newTypes });
                          }}
                          className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 font-bold text-base leading-none"
                          title="Remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </>
                )}
              </div>
            </CompactField>
            <CompactField label="Address">
              <Input
                value={job.propertyAddress || ''}
                onChange={(e) => onUpdateJob?.({propertyAddress: e.target.value})}
                className="h-7 text-sm max-w-[200px]"
              />
            </CompactField>
            <CompactField label="Intended Use">
              <Select
                value={job.intendedUse || ''}
                onValueChange={(value) => onUpdateJob?.({intendedUse: value})}
              >
                <SelectTrigger className="h-7 text-sm max-w-[200px] text-center">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Financing/Refinancing">Financing/Refinancing</SelectItem>
                  <SelectItem value="Acquisition">Acquisition</SelectItem>
                  <SelectItem value="Disposition">Disposition</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                  <SelectItem value="Litigation">Litigation</SelectItem>
                  <SelectItem value="Estate Planning">Estate Planning</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>
            <CompactField label="Valuation Premises">
              <Select
                value={job.valuationPremises || ''}
                onValueChange={(value) => onUpdateJob?.({valuationPremises: value})}
              >
                <SelectTrigger className="h-7 text-sm max-w-[200px] text-center">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
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
                onValueChange={(value) => onUpdateJob?.({assetCondition: value})}
              >
                <SelectTrigger className="h-7 text-sm max-w-[200px] text-center">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Very Good">Very Good</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>
          </TwoColumnFields>

          {/* Property Contact Information */}
          <div className="mt-3">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Property Contact</h4>
            <TwoColumnFields>
              <CompactField label="First Name">
                <Input
                  value={job.propertyContactFirstName || ''}
                  onChange={(e) => onUpdateJob?.({propertyContactFirstName: e.target.value})}
                  className="h-7 text-sm max-w-[200px]"
                />
              </CompactField>
              <CompactField label="Email">
                <Input
                  value={job.propertyContactEmail || ''}
                  onChange={(e) => onUpdateJob?.({propertyContactEmail: e.target.value})}
                  className="h-7 text-sm max-w-[200px]"
                />
              </CompactField>
              <CompactField label="Last Name">
                <Input
                  value={job.propertyContactLastName || ''}
                  onChange={(e) => onUpdateJob?.({propertyContactLastName: e.target.value})}
                  className="h-7 text-sm max-w-[200px]"
                />
              </CompactField>
              <CompactField label="Phone">
                <Input
                  type="tel"
                  value={job.propertyContactPhone ? formatPhoneNumber(job.propertyContactPhone) : ''}
                  onChange={(e) => {
                    const numbersOnly = e.target.value.replace(/\D/g, '');
                    onUpdateJob?.({propertyContactPhone: numbersOnly});
                  }}
                  className="h-7 text-sm max-w-[200px]"
                />
              </CompactField>
            </TwoColumnFields>
          </div>
        </SectionGroup>

        {/* Client Comments Section */}
        <SectionGroup title="Client Comments">
          <TwoColumnFields>
            <CompactField label="">
              <Textarea
                value={job.notes || ''}
                onChange={(e) => onUpdateJob?.({notes: e.target.value})}
                onBlur={(e) => handleBlur('notes', e.target.value)}
                rows={3}
                className="text-sm resize-y min-h-[60px]"
                style={{ maxWidth: '400px' }}
              />
            </CompactField>
          </TwoColumnFields>
        </SectionGroup>

        {/* Uploaded Documents Section */}
        <SectionGroup title="Uploaded Documents">
          <div 
            className="space-y-3"
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
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                          {file.fileName}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
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

                            toast.success('File downloaded successfully');
                          } catch (error) {
                            console.error('Download error:', error);
                            toast.error('Failed to download file');
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
                            toast.error('Failed to view file');
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
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
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
