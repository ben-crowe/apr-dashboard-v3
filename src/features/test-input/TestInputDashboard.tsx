import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fieldRegistry,
  getAllSections,
  getFieldsBySection,
  getSubsectionsForSection,
  getFieldsBySubsection,
  FieldDefinition
} from '../report-builder/schema/fieldRegistry';
import { useReportBuilderStore } from '../report-builder/store/reportBuilderStore';
import { testDataSet1 } from '../report-builder/data/TestDataSet1';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, ExternalLink, Database, RefreshCw } from 'lucide-react';
import ImageFieldInput from './components/ImageFieldInput';

type FieldStatus = 'mapped' | 'empty' | 'missing';

interface FieldStatusInfo {
  field: FieldDefinition;
  status: FieldStatus;
  storeValue: any;
}

const TestInputDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { sections, updateFieldValue, runCalculations, loadDataSet1All, loadDataSet1User, loadDataSet1DirectToTemplate, initializeMockData, activeTestMode, setTestMode } = useReportBuilderStore();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [expandedValuations, setExpandedValuations] = useState<Set<string>>(new Set());
  const [expandedImageDestinations, setExpandedImageDestinations] = useState<Set<string>>(new Set());
  const [expandedCalcSubsections, setExpandedCalcSubsections] = useState<Set<string>>(new Set());
  const [expandedPhotoSubsections, setExpandedPhotoSubsections] = useState<Set<string>>(new Set());
  const [expandedAllCalcOutputSections, setExpandedAllCalcOutputSections] = useState<Set<string>>(new Set());
  const [localValues, setLocalValues] = useState<Record<string, any>>({});
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);

  // Dataset field IDs for filtering
  const datasetFieldIds = useMemo(() =>
    selectedDataset ? new Set(Object.keys(testDataSet1)) : null,
  [selectedDataset]);

  // Initialize store AND load test data on mount
  // Test data should load by default so we can see which fields have values vs empty
  useEffect(() => {
    const initAndLoadTestData = async () => {
      if (sections.length === 0) {
        console.log('TestInputDashboard: Initializing store...');
        await initializeMockData();
      }
      // Always load test data so TDD page shows actual values
      // This lets us verify: field with value = test data exists, empty = missing
      console.log('TestInputDashboard: Loading test data by default...');
      await loadDataSet1DirectToTemplate();
    };
    initAndLoadTestData();
  }, []); // Only run once on mount

  // Section names with numbered prefixes for easy cross-reference with Report Builder
  const sectionNameMapping: Record<string, string> = {
    // V3 Operational Sections (mirrors deployed V3 Dashboard)
    'client-intake': 'S1 - CLIENT INTAKE (V3)',
    'loe-prep': 'S2 - LOE PREP (V3)',
    'image-mgt': 'S3 - IMAGE MANAGEMENT',
    // Report Builder Sections
    'cover': '01 - COVER PAGE',
    'home': '02 - INTRODUCTION LETTER',
    'maps': '03 - LOCATION MAPS',
    'assignment': '04 - IDENTIFICATION OF ASSIGNMENT',
    'report': '05 - REPORT INFORMATION',
    'exec': '06 - EXECUTIVE SUMMARY',
    'photos': '07 - PROPERTY PHOTOGRAPHS',
    'site': '08 - SITE DETAILS',
    'location': '09 - LOCATION ANALYSIS',
    'tax': '10 - PROPERTY TAXES',
    'market': '11 - MARKET ANALYSIS',
    'impv': '12 - IMPROVEMENTS',
    'zone': '13 - ZONING',
    'hbu': '14 - HIGHEST & BEST USE',
    'calc': '15 - VALUATIONS (All 3 Approaches)',
    'land1': '16 - LAND VALUE',
    'cost-s': '17 - COST APPROACH',
    'sales': '18 - SALES COMPARISON',
    'income': '19 - INCOME APPROACH',
    'rental-survey': '20 - RENTAL SURVEY',
    'recon': '21 - RECONCILIATION',
    'cert': '22 - CERTIFICATION',
    // Renamed unnumbered sections
    'sales-comparison': '18 - SALES COMPS',
    'rent-analysis': '19 - RENT COMPS',
    'rentroll': '20 - RENT ROLL'
  };

  // Subsection name mapping for image-mgt
  const subsectionNameMapping: Record<string, string> = {
    'cover-images': 'COVER & SIGNATURE',
    'maps': 'MAPS',
    'exterior-photos': 'EXTERIOR PHOTOS',
    'street-photos': 'STREET VIEWS',
    'common-photos': 'COMMON AREAS',
    'unit-photos': 'UNIT INTERIORS',
    'systems-photos': 'BUILDING SYSTEMS'
  };

  // Sections hidden because they're consolidated into accordions
  // Maintains number gaps (03, 07, 17-19) for alignment with Report Builder
  // calc-output: Output-only fields that shouldn't appear as input tabs
  const hiddenSections = ['maps', 'photos', 'cost-s', 'sales', 'income', 'calc-output'];

  // Section display order for TDD dashboard
  const sectionDisplayOrder = [
    'client-intake',      // S1 - CLIENT INTAKE (V3)
    'loe-prep',          // S2 - LOE PREP (V3)
    'image-mgt',         // S3 - IMAGE MANAGEMENT
    'cover',             // 01 - COVER PAGE
    'home',              // 02 - INTRODUCTION LETTER
    'report',            // 05 - REPORT INFORMATION
    'exec',              // 06 - EXECUTIVE SUMMARY
    'site',              // 08 - SITE DETAILS
    'location',          // 09 - LOCATION ANALYSIS
    'tax',               // 10 - PROPERTY TAXES
    'market',            // 11 - MARKET ANALYSIS
    'impv',              // 12 - IMPROVEMENTS
    'zone',              // 13 - ZONING
    'hbu',               // 14 - HIGHEST & BEST USE
    'calc',              // 15 - VALUATIONS (All 3 Approaches)
    'land1',             // 16 - LAND VALUE
    'sales-comparison',  // 18 - SALES COMPS
    'rent-analysis',     // 19 - RENT COMPS
    'rentroll',          // 20 - RENT ROLL
    'recon',             // 21 - RECONCILIATION
    'cert',              // 22 - CERTIFICATION
  ];

  // Legacy image fields that are now managed in Image Management
  // Maps legacy field ID to: { managedFieldId, destination label, scrollToSection }
  const legacyClientFields: Record<string, { managedFieldId: string, destination: string, section: string, subsection: string }> = {
    // Client fields in cover section that are managed in client-intake
    'client-address': { managedFieldId: 'client-address', destination: 'S1 - Client Intake', section: 'client-intake', subsection: 'client-info-intake' },
    'client-city': { managedFieldId: 'client-city', destination: 'S1 - Client Intake', section: 'client-intake', subsection: 'client-info-intake' },
    'client-province': { managedFieldId: 'client-province', destination: 'S1 - Client Intake', section: 'client-intake', subsection: 'client-info-intake' },
    'client-postal': { managedFieldId: 'client-postal', destination: 'S1 - Client Intake', section: 'client-intake', subsection: 'client-info-intake' },
    'client-title': { managedFieldId: 'client-title', destination: 'S1 - Client Intake', section: 'client-intake', subsection: 'client-info-intake' },
  };

  const legacyAppraiserFields: Record<string, { managedFieldId: string, destination: string, section: string, subsection: string }> = {
    // Appraiser fields in cover section that are managed in loe-prep
    'appraiser-name': { managedFieldId: 'appraiser-name', destination: 'S2 - LOE Prep', section: 'loe-prep', subsection: 'appraiser-info' },
    'appraiser-credentials': { managedFieldId: 'appraiser-credentials', destination: 'S2 - LOE Prep', section: 'loe-prep', subsection: 'appraiser-info' },
    'appraiser-title': { managedFieldId: 'appraiser-title', destination: 'S2 - LOE Prep', section: 'loe-prep', subsection: 'appraiser-info' },
    'appraiser-email': { managedFieldId: 'appraiser-email', destination: 'S2 - LOE Prep', section: 'loe-prep', subsection: 'appraiser-info' },
    'appraiser-aic': { managedFieldId: 'appraiser-aic', destination: 'S2 - LOE Prep', section: 'loe-prep', subsection: 'appraiser-info' },
    'valuation-date': { managedFieldId: 'valuation-date', destination: 'S2 - LOE Prep', section: 'loe-prep', subsection: 'appraiser-info' },
    'report-date': { managedFieldId: 'report-date', destination: 'S2 - LOE Prep', section: 'loe-prep', subsection: 'appraiser-info' },
  };

  const legacyImageFields: Record<string, { managedFieldId: string, destination: string, section: string, subsection: string }> = {
    // Cover Section
    'cover-photo': { managedFieldId: 'img-cover-photo', destination: '01 - Cover & Signature', section: 'image-mgt', subsection: 'cover-images' },
    'appraiser1-signature': { managedFieldId: 'img-signature', destination: '01 - Cover & Signature', section: 'image-mgt', subsection: 'cover-images' },

    // Photos Section (group headers - can be ignored or mapped to their subsections)
    'photos-exterior': { managedFieldId: 'img-exterior-1', destination: '07 - Property Photographs', section: 'image-mgt', subsection: 'exterior-photos' },
    'photos-street': { managedFieldId: 'img-street-1', destination: '07 - Property Photographs', section: 'image-mgt', subsection: 'street-photos' },
    'photos-common': { managedFieldId: 'img-common-1', destination: '07 - Property Photographs', section: 'image-mgt', subsection: 'common-photos' },
    'photos-units': { managedFieldId: 'img-unit-1', destination: '07 - Property Photographs', section: 'image-mgt', subsection: 'unit-photos' },
    'photos-systems': { managedFieldId: 'img-systems-1', destination: '07 - Property Photographs', section: 'image-mgt', subsection: 'systems-photos' },

    // Site Section
    'site-plan-image': { managedFieldId: 'img-site-plan-1', destination: '03 - Location Maps', section: 'image-mgt', subsection: 'maps' },

    // Zone Section
    'zoning-map': { managedFieldId: 'img-zoning-map', destination: '03 - Location Maps', section: 'image-mgt', subsection: 'maps' },

    // Cert Section
    'cert-signature': { managedFieldId: 'img-signature', destination: '01 - Cover & Signature', section: 'image-mgt', subsection: 'cover-images' },

    // Sales Comparison Section - Maps
    'comp1-map': { managedFieldId: 'comp1-map', destination: '10 - Sales Comp Maps', section: 'image-mgt', subsection: 'comp-maps' },
    'comp2-map': { managedFieldId: 'comp2-map', destination: '10 - Sales Comp Maps', section: 'image-mgt', subsection: 'comp-maps' },
    'comp3-map': { managedFieldId: 'comp3-map', destination: '10 - Sales Comp Maps', section: 'image-mgt', subsection: 'comp-maps' },
    'comp4-map': { managedFieldId: 'comp4-map', destination: '10 - Sales Comp Maps', section: 'image-mgt', subsection: 'comp-maps' },
    'comp5-map': { managedFieldId: 'comp5-map', destination: '10 - Sales Comp Maps', section: 'image-mgt', subsection: 'comp-maps' },

    // Sales Comparison Section - Photos
    'comp1-photo': { managedFieldId: 'comp1-photo', destination: '09 - Sales Comp Photos', section: 'image-mgt', subsection: 'comp-photos' },
    'comp2-photo': { managedFieldId: 'comp2-photo', destination: '09 - Sales Comp Photos', section: 'image-mgt', subsection: 'comp-photos' },
    'comp3-photo': { managedFieldId: 'comp3-photo', destination: '09 - Sales Comp Photos', section: 'image-mgt', subsection: 'comp-photos' },
    'comp4-photo': { managedFieldId: 'comp4-photo', destination: '09 - Sales Comp Photos', section: 'image-mgt', subsection: 'comp-photos' },
    'comp5-photo': { managedFieldId: 'comp5-photo', destination: '09 - Sales Comp Photos', section: 'image-mgt', subsection: 'comp-photos' },

    // Rent Analysis Section
    'rental-comparables-map': { managedFieldId: 'rental-comparables-map', destination: '11 - Rental Comp Photos', section: 'image-mgt', subsection: 'rental-comp-photos' }
  };

  // Helper function to categorize fields as inputs or outputs
  const categorizeValuationFields = (fields: FieldDefinition[]): { inputs: FieldDefinition[], outputs: FieldDefinition[] } => {
    return {
      inputs: fields.filter(f => f.inputSource === 'user-input'),
      outputs: fields.filter(f => f.inputSource === 'calculated')
    };
  };

  // Get value from store by traversing sections/subsections
  const getStoreValue = (storeId: string): any => {
    for (const section of sections) {
      // Check section fields
      for (const field of section.fields) {
        if (field.id === storeId) return field.value;
      }
      // Check subsection fields
      for (const subsection of section.subsections || []) {
        for (const field of subsection.fields) {
          if (field.id === storeId) return field.value;
        }
      }
    }
    return undefined;
  };

  // Get field status
  const getFieldStatus = (field: FieldDefinition): FieldStatusInfo => {
    const storeValue = getStoreValue(field.storeId);

    // Missing: undefined or null
    if (storeValue === undefined || storeValue === null) {
      return { field, status: 'missing', storeValue: undefined };
    }

    // Empty strings are truly empty
    if (typeof storeValue === 'string' && storeValue.trim() === '') {
      return { field, status: 'empty', storeValue };
    }

    // Empty arrays are empty
    if (Array.isArray(storeValue) && storeValue.length === 0) {
      return { field, status: 'empty', storeValue };
    }

    // Everything else (including 0) is mapped
    return { field, status: 'mapped', storeValue };
  };

  // Helper: Sort fields - mapped fields first, then empty/missing at bottom
  const sortFieldsByValue = (fields: FieldDefinition[]): FieldDefinition[] => {
    return [...fields].sort((a, b) => {
      const statusA = getFieldStatus(a);
      const statusB = getFieldStatus(b);

      // Mapped fields come first
      if (statusA.status === 'mapped' && statusB.status !== 'mapped') return -1;
      if (statusA.status !== 'mapped' && statusB.status === 'mapped') return 1;

      // Within same status, maintain original order
      return 0;
    });
  };

  // Calculate statistics - only for visible sections (exclude hidden/consolidated tabs)
  // Only count fields that actually exist in the store
  const stats = useMemo(() => {
    let total = 0;
    let mapped = 0;
    let empty = 0;
    let missing = 0;

    // Build set of all field IDs that exist in the store
    const storeFieldIds = new Set<string>();
    sections.forEach(section => {
      section.fields?.forEach(field => storeFieldIds.add(field.id));
      section.subsections?.forEach(subsection => {
        subsection.fields.forEach(field => storeFieldIds.add(field.id));
      });
    });

    fieldRegistry.forEach(field => {
      // Skip fields from hidden sections (consolidated into accordions)
      if (hiddenSections.includes(field.section)) return;

      // In test-report mode (Map All to Report), count ALL fields
      // Otherwise, only count user-input fields
      if (activeTestMode !== 'test-report' && field.inputSource !== 'user-input') return;

      // Only count fields that exist in the store
      if (!storeFieldIds.has(field.storeId)) return;

      // Filter by dataset if selected
      if (datasetFieldIds && !datasetFieldIds.has(field.storeId)) return;

      total++;
      const status = getFieldStatus(field);
      if (status.status === 'mapped') mapped++;
      else if (status.status === 'empty') empty++;
      else missing++;
    });

    const percentage = total > 0 ? Math.round((mapped / total) * 100) : 0;

    return { total, mapped, empty, missing, percentage };
  }, [sections, datasetFieldIds, activeTestMode]);

  // Log on mount and stats change
  useEffect(() => {
    console.log(`Test Data Dashboard: ${stats.mapped}/${stats.total} fields mapped (${stats.percentage}%)`);
  }, [stats]);

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Toggle valuation approach accordion
  const toggleValuation = (valuationId: string) => {
    setExpandedValuations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(valuationId)) {
        newSet.delete(valuationId);
      } else {
        newSet.add(valuationId);
      }
      return newSet;
    });
  };

  // Toggle image management destination accordion
  const toggleImageDestination = (destinationId: string) => {
    setExpandedImageDestinations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(destinationId)) {
        newSet.delete(destinationId);
      } else {
        newSet.add(destinationId);
      }
      return newSet;
    });
  };

  const toggleCalcSubsection = (subsectionId: string) => {
    setExpandedCalcSubsections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subsectionId)) {
        newSet.delete(subsectionId);
      } else {
        newSet.add(subsectionId);
      }
      return newSet;
    });
  };

  const togglePhotoSubsection = (subsectionId: string) => {
    setExpandedPhotoSubsections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subsectionId)) {
        newSet.delete(subsectionId);
      } else {
        newSet.add(subsectionId);
      }
      return newSet;
    });
  };

  const toggleAllCalcOutputSection = (sectionId: string) => {
    setExpandedAllCalcOutputSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Handle field value change
  const handleFieldChange = (field: FieldDefinition, value: any) => {
    setLocalValues(prev => ({ ...prev, [field.storeId]: value }));
    updateFieldValue(field.storeId, value);
    // Trigger calc engine for calc-related fields (real-time updates like calculator-demo)
    if (field.storeId.startsWith('calc-')) {
      runCalculations();
    }
  };

  // Get current value (local or store)
  const getCurrentValue = (field: FieldDefinition): any => {
    if (localValues[field.storeId] !== undefined) {
      return localValues[field.storeId];
    }
    return getStoreValue(field.storeId) || '';
  };

  // Group image fields with their caption fields
  const groupImageFieldsWithCaptions = (fields: FieldDefinition[]): Array<{ image: FieldDefinition; caption?: FieldDefinition }> => {
    const imageFields = fields.filter(f => f.type === 'image');
    const captionFields = fields.filter(f => f.type === 'text' && f.id.endsWith('-caption'));
    const captionMap = new Map(captionFields.map(f => {
      const baseId = f.id.replace('-caption', '');
      return [baseId, f];
    }));

    return imageFields.map(imageField => ({
      image: imageField,
      caption: captionMap.get(imageField.id)
    }));
  };

  // Render input field based on type
  const renderInput = (field: FieldDefinition, statusInfo: FieldStatusInfo) => {
    const currentValue = getCurrentValue(field);

    switch (field.type) {
      case 'number':
      case 'currency':
      case 'percentage':
        return (
          <Input
            type="number"
            value={currentValue || ''}
            onChange={(e) => handleFieldChange(field, Number(e.target.value))}
            className="w-32 h-8 text-sm"
            placeholder={field.type === 'currency' ? '$0' : field.type === 'percentage' ? '0%' : '0'}
            readOnly={field.inputSource === 'calculated'}
            disabled={field.inputSource === 'calculated'}
          />
        );

      case 'date':
        // Check if this is a legacy appraiser field that's now managed in LOE Prep
        const appraiserDateMapping = legacyAppraiserFields[field.id];

        // Only show "Managed in S2" if field is NOT in loe-prep section
        if (appraiserDateMapping && field.section !== 'loe-prep') {
          // Show value (read-only) with link to LOE Prep section
          return (
            <div className="flex flex-col gap-1">
              <Input
                type="date"
                value={currentValue || ''}
                className="w-36 h-8 text-sm bg-slate-800 text-slate-400"
                readOnly
                disabled
              />
              <button
                onClick={() => {
                  setExpandedSections(prev => new Set([...prev, 'loe-prep']));
                  setTimeout(() => {
                    const element = document.getElementById('section-loe-prep');
                    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className="text-xs text-blue-600 hover:underline flex flex-col items-start"
              >
                <span className="font-medium">Managed in S2</span>
                <span className="text-slate-500">{appraiserDateMapping.destination}</span>
              </button>
            </div>
          );
        }

        return (
          <Input
            type="date"
            value={currentValue || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className="w-36 h-8 text-sm"
          />
        );

      case 'select':
        return (
          <select
            value={currentValue || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className="w-48 h-8 text-sm border rounded px-2"
          >
            <option value="">Select...</option>
            {field.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <Input
            type="text"
            value={currentValue || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className="w-64 h-8 text-sm"
            placeholder="Text..."
          />
        );

      case 'image':
        // Check if this is a legacy image field that's now managed in Image Management
        const legacyMapping = legacyImageFields[field.id];

        if (legacyMapping) {
          // Show thumbnail and link to Image Management instead of upload field
          const hasImage = currentValue && typeof currentValue === 'string' && currentValue.trim() !== '';
          const imageDestinationMap: Record<string, string> = {
            'cover-images': 'cover-sig',
            'maps': 'location-maps',
            'exterior-photos': 'property-photos',
            'street-photos': 'property-photos',
            'common-photos': 'property-photos',
            'unit-photos': 'property-photos',
            'systems-photos': 'property-photos',
            'subject-photos': 'subject-photos',
            'comp-photos': 'comp-photos',
            'comp-maps': 'comp-maps',
            'rental-comp-photos': 'rental-comp-photos'
          };
          const destinationId = imageDestinationMap[legacyMapping.subsection] || 'cover-sig';

          return (
            <div className="flex items-center gap-3">
              {hasImage && (
                <div className="relative w-16 h-16 rounded border overflow-hidden bg-slate-100 flex-shrink-0">
                  <img
                    src={currentValue as string}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              <button
                onClick={() => {
                  setExpandedSections(prev => new Set([...prev, 'image-mgt']));
                  setExpandedImageDestinations(prev => new Set([...prev, destinationId]));
                  setTimeout(() => {
                    const element = document.getElementById('section-image-mgt');
                    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className="text-xs text-blue-600 hover:underline flex flex-col items-start"
              >
                <span className="font-medium">Managed in S3</span>
                <span className="text-slate-500">{legacyMapping.destination}</span>
              </button>
            </div>
          );
        }

        // Normal image field rendering for Image Management fields
        return (
          <div className="flex flex-col gap-0">
            <ImageFieldInput
              value={currentValue || ''}
              onChange={(url) => handleFieldChange(field, url)}
              placeholder="Drop image or click to upload"
            />
            <div className="text-[10px] text-slate-400 mt-0.5">{field.id}</div>
          </div>
        );

      default: // text
        // Check if this is a legacy client field that's now managed in Client Intake
        const clientTextMapping = legacyClientFields[field.id];

        // Only show "Managed in S1" if field is NOT in client-intake section
        if (clientTextMapping && field.section !== 'client-intake') {
          // Show value (read-only) with link to Client Intake section
          return (
            <div className="flex flex-col gap-1">
              <Input
                type="text"
                value={currentValue || ''}
                className="w-64 h-8 text-sm bg-slate-800 text-slate-400"
                readOnly
                disabled
              />
              <button
                onClick={() => {
                  setExpandedSections(prev => new Set([...prev, 'client-intake']));
                  setTimeout(() => {
                    const element = document.getElementById('section-client-intake');
                    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className="text-xs text-blue-600 hover:underline flex flex-col items-start"
              >
                <span className="font-medium">Managed in S1</span>
                <span className="text-slate-500">{clientTextMapping.destination}</span>
              </button>
            </div>
          );
        }

        // Check if this is a legacy appraiser field that's now managed in LOE Prep
        const appraiserTextMapping = legacyAppraiserFields[field.id];

        // Only show "Managed in S2" if field is NOT in loe-prep section
        if (appraiserTextMapping && field.section !== 'loe-prep') {
          // Show value (read-only) with link to LOE Prep section
          return (
            <div className="flex flex-col gap-1">
              <Input
                type="text"
                value={currentValue || ''}
                className="w-64 h-8 text-sm bg-slate-800 text-slate-400"
                readOnly
                disabled
              />
              <button
                onClick={() => {
                  setExpandedSections(prev => new Set([...prev, 'loe-prep']));
                  setTimeout(() => {
                    const element = document.getElementById('section-loe-prep');
                    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className="text-xs text-blue-600 hover:underline flex flex-col items-start"
              >
                <span className="font-medium">Managed in S2</span>
                <span className="text-slate-500">{appraiserTextMapping.destination}</span>
              </button>
            </div>
          );
        }

        return (
          <Input
            type="text"
            value={currentValue || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className="w-64 h-8 text-sm"
            readOnly={field.inputSource === 'calculated'}
            disabled={field.inputSource === 'calculated'}
          />
        );
    }
  };

  // Render status badge
  const renderStatusBadge = (status: FieldStatus) => {
    switch (status) {
      case 'mapped':
        return <Badge className="bg-green-500 text-white text-xs">Mapped</Badge>;
      case 'empty':
        return <Badge className="bg-yellow-500 text-white text-xs">Empty</Badge>;
      case 'missing':
        return <Badge className="bg-red-500 text-white text-xs">Missing</Badge>;
    }
  };

  // Preview in builder - use React Router navigation to preserve store state
  const handlePreview = async () => {
    // Ensure preview is generated before navigating
    const store = useReportBuilderStore.getState();
    const previewHtml = store.previewHtml;
    if (!previewHtml || previewHtml.length === 0) {
      console.warn('Preview HTML is empty, generating preview...');
      // If preview is empty, generate it
      const sections = store.sections;
      if (sections.length > 0) {
        await store.generatePreview();
      } else {
        console.error('No sections available to generate preview');
      }
    }
    // Use React Router navigate (preserves Zustand store state)
    // Route is /mock-builder not /report-builder
    navigate('/mock-builder');
  };

  // Group fields by section
  const allSections = getAllSections();

  // Get ALL calculated fields from the entire registry, grouped by their original section
  // This is used for the "All Calculated Outputs" subsection within Tab 15 - VALUATIONS
  const allCalculatedFields = useMemo(() => {
    const calcFields = fieldRegistry.filter(f => f.inputSource === 'calculated');
    // Group by original section
    const groupedBySection: Record<string, FieldDefinition[]> = {};
    calcFields.forEach(field => {
      const sectionKey = field.section || 'uncategorized';
      if (!groupedBySection[sectionKey]) {
        groupedBySection[sectionKey] = [];
      }
      groupedBySection[sectionKey].push(field);
    });
    return groupedBySection;
  }, []);

  // Section labels for the All Calc Outputs subsection (inside Tab 15)
  const calcOutputSectionLabels: Record<string, string> = {
    'calc': 'Calc Engine (Valuations)',
    'exec': 'Executive Summary',
    'site': 'Site Details',
    'impv': 'Improvements',
    'market': 'Market Analysis',
    'income': 'Income Approach',
    'recon': 'Reconciliation',
    'calc-output': 'Additional Outputs',
    'cost-s': 'Cost Approach',
    'sales': 'Sales Comparison',
    'land1': 'Land Value',
    'uncategorized': 'Other Fields'
  };

  return (
    <div className="min-h-screen px-4 pt-4 pb-12" style={{ backgroundColor: '#1f1f1f' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header - Two Part Structure to Match Edit Panel */}
        <div className="mb-4 overflow-hidden">
          {/* Part 1: Title Bar (matches EditPanel header) */}
          <div style={{
            backgroundColor: 'transparent',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #4b5563'
          }}>
            <span style={{
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '15px'
            }}>
              TEST DATA INPUT DASHBOARD
            </span>
          </div>

          {/* Part 2: Stats & Actions Bar */}
          <div style={{
            backgroundColor: 'transparent',
            padding: '8px 14px',
            borderBottom: '1px solid #4b5563',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            minHeight: '44px',
            color: '#ffffff'
          }}>
            {/* Stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '13px', fontWeight: '500' }}>Total:</span>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>{stats.total}</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '13px', fontWeight: '500' }}>Mapped:</span>
                <Badge className="bg-green-500 text-white text-xs">{stats.mapped}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '13px', fontWeight: '500' }}>Empty:</span>
                <Badge className="bg-yellow-500 text-white text-xs">{stats.empty}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '13px', fontWeight: '500' }}>Missing:</span>
                <Badge className="bg-red-500 text-white text-xs">{stats.missing}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '13px', fontWeight: '500' }}>Coverage:</span>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>{stats.percentage}%</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
                className="gap-2 text-white border transition-colors"
                style={{ backgroundColor: '#2a2a2a', borderColor: '#4b5563' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333333'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                title="Hard refresh the page"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </Button>
              <Button
                onClick={async () => {
                  try {
                    // Set mode FIRST to update button state immediately
                    setTestMode('test-report');
                    console.log('Map All to Report: Loading fields directly to template...');
                    await loadDataSet1DirectToTemplate();
                    console.log('Map All to Report: Complete - navigating to template...');
                    navigate('/mock-builder');
                  } catch (error) {
                    console.error('Error in Load All Fields:', error);
                    alert('Error: ' + String(error));
                  }
                }}
                variant={activeTestMode === 'test-report' ? 'default' : 'outline'}
                size="sm"
                disabled={activeTestMode === 'designer'}
                className={`gap-2 text-white border transition-colors ${
                  activeTestMode === 'test-report'
                    ? 'bg-blue-600 hover:bg-blue-500 font-semibold shadow-md'
                    : activeTestMode === 'designer'
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                style={{
                  backgroundColor: activeTestMode === 'test-report' ? '#2563eb' : activeTestMode === 'designer' ? '#1f1f1f' : '#2a2a2a',
                  borderColor: activeTestMode === 'test-report' ? '#2563eb' : activeTestMode === 'designer' ? '#4b5563' : '#4b5563'
                }}
                onMouseEnter={(e) => {
                  if (activeTestMode === 'test-report') {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                  } else if (activeTestMode !== 'designer') {
                    e.currentTarget.style.backgroundColor = '#333333';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTestMode === 'test-report') {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  } else if (activeTestMode !== 'designer') {
                    e.currentTarget.style.backgroundColor = '#2a2a2a';
                  }
                }}
                title="Direct field validation - bypasses calc engine, maps all test data to template"
              >
                <Database className="w-3 h-3" />
                Map All to Report
                {activeTestMode === 'test-report' && <span className="ml-1">&#10003;</span>}
              </Button>
              <Button
                onClick={async () => {
                  try {
                    // Clear test-report mode so stats show user-input fields only
                    setTestMode('none');
                    console.log('Report DataSet1: Loading user-inputs, running calc engine...');
                    await loadDataSet1User();
                    setSelectedDataset('testDataSet1');
                    console.log('Report DataSet1: Data loaded, TDD filtered');
                  } catch (error) {
                    console.error('Error in Report DataSet1:', error);
                    alert('Error: ' + String(error));
                  }
                }}
                variant={selectedDataset === 'testDataSet1' ? 'default' : 'outline'}
                size="sm"
                className={`gap-2 text-white border transition-colors ${
                  selectedDataset === 'testDataSet1'
                    ? 'bg-green-600 hover:bg-green-500 font-semibold shadow-md'
                    : ''
                }`}
                style={{
                  backgroundColor: selectedDataset === 'testDataSet1' ? '#16a34a' : '#2a2a2a',
                  borderColor: selectedDataset === 'testDataSet1' ? '#16a34a' : '#4b5563'
                }}
                onMouseEnter={(e) => {
                  if (selectedDataset === 'testDataSet1') {
                    e.currentTarget.style.backgroundColor = '#22c55e';
                  } else {
                    e.currentTarget.style.backgroundColor = '#333333';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedDataset === 'testDataSet1') {
                    e.currentTarget.style.backgroundColor = '#16a34a';
                  } else {
                    e.currentTarget.style.backgroundColor = '#2a2a2a';
                  }
                }}
                title="Filter to show only fields in TestDataSet1"
              >
                <Database className="w-3 h-3" />
                Report DataSet1
                {selectedDataset === 'testDataSet1' && <span className="ml-1">&#10003;</span>}
              </Button>
              <Button
                onClick={() => {
                  console.log('View Report: Navigating to mock-builder...');
                  navigate('/mock-builder');
                }}
                variant="outline"
                size="sm"
                disabled={selectedDataset === null}
                className={`gap-2 text-white border transition-colors ${
                  selectedDataset !== null
                    ? 'bg-green-500 hover:bg-green-400 font-semibold shadow-md'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                style={{
                  backgroundColor: selectedDataset !== null ? '#22c55e' : '#1f1f1f',
                  borderColor: selectedDataset !== null ? '#22c55e' : '#4b5563'
                }}
                onMouseEnter={(e) => {
                  if (selectedDataset !== null) {
                    e.currentTarget.style.backgroundColor = '#4ade80';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedDataset !== null) {
                    e.currentTarget.style.backgroundColor = '#22c55e';
                  }
                }}
                title="Load user-inputs, run calc engine, then navigate to mock-builder"
              >
                <ExternalLink className="w-3 h-3" />
                View Report
                {selectedDataset !== null && <span className="ml-1">&rarr;</span>}
              </Button>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-2">
          {allSections
            .filter(sectionId => !hiddenSections.includes(sectionId))
            .sort((a, b) => {
              const indexA = sectionDisplayOrder.indexOf(a);
              const indexB = sectionDisplayOrder.indexOf(b);
              // If both are in the order array, sort by their position
              if (indexA !== -1 && indexB !== -1) return indexA - indexB;
              // If only one is in the order array, prioritize it
              if (indexA !== -1) return -1;
              if (indexB !== -1) return 1;
              // If neither is in the order array, maintain original order
              return 0;
            })
            .map(sectionId => {
            const allFields = getFieldsBySection(sectionId)
              .filter(f => f.inputSource === 'user-input')
              .filter(f => !datasetFieldIds || datasetFieldIds.has(f.storeId));
            if (allFields.length === 0) return null;

            // Sort fields: mapped first, then empty/missing at bottom
            const fields = sortFieldsByValue(allFields);
            const mappedFields = fields.filter(f => getFieldStatus(f).status === 'mapped');
            const emptyFields = fields.filter(f => {
              const status = getFieldStatus(f).status;
              return status === 'empty' || status === 'missing';
            });

            const isExpanded = expandedSections.has(sectionId);
            const sectionName = sectionNameMapping[sectionId] || sectionId.toUpperCase();

            return (
              <Collapsible
                key={sectionId}
                open={isExpanded}
                onOpenChange={() => toggleSection(sectionId)}
              >
                <div id={`section-${sectionId}`} className="rounded-lg overflow-hidden mb-2" style={{ backgroundColor: '#2a2a2a', border: '1px solid #4b5563' }}>
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 hover:bg-[#333333] cursor-pointer">
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-gray-300" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-300" />
                        )}
                        <h2 className="text-lg font-semibold text-white">
                          {sectionName}
                        </h2>
                        <Badge variant="outline" className="text-xs text-gray-300 border-gray-500">
                          {fields.length} fields
                        </Badge>
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="border-t" style={{ borderColor: '#4b5563' }}>
                      {/* Special rendering for Calculator section - INPUTS and OUTPUTS */}
                      {sectionId === 'calc' ? (
                        <div className="space-y-3 p-4" style={{ backgroundColor: '#1f1f1f' }}>
                          {/* ==================== INPUTS SECTION ==================== */}
                          <Collapsible
                            open={expandedCalcSubsections.has('inputs-main')}
                            onOpenChange={() => toggleCalcSubsection('inputs-main')}
                          >
                            <div className="border-2 rounded-lg overflow-hidden" style={{ borderColor: '#4b5563' }}>
                              <CollapsibleTrigger className="w-full">
                                <div className="px-4 py-3 flex items-center justify-between cursor-pointer transition-colors hover:bg-[#333333]" style={{ backgroundColor: '#2a2a2a' }}>
                                  <div className="flex items-center gap-2">
                                    {expandedCalcSubsections.has('inputs-main') ? (
                                      <ChevronDown className="w-5 h-5" style={{ color: '#9ca3af' }} />
                                    ) : (
                                      <ChevronRight className="w-5 h-5" style={{ color: '#9ca3af' }} />
                                    )}
                                    <h3 className="text-base font-bold text-white">INPUTS</h3>
                                    <Badge className="text-gray-300 border-gray-500" style={{ backgroundColor: '#1f1f1f' }}>User Entry Fields</Badge>
                                  </div>
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="p-3 space-y-2" style={{ backgroundColor: '#1f1f1f' }}>
                                  {/* Input subsections */}
                                  {['calc-unit-mix', 'calc-other-income', 'calc-vacancy', 'calc-expenses', 'calc-cap', 'calc-adjustments'].map(subsectionId => {
                                    const subsectionFields = getFieldsBySubsection(sectionId, subsectionId)
                                      .filter(f => f.inputSource === 'user-input')
                                      .filter(f => !datasetFieldIds || datasetFieldIds.has(f.storeId));

                                    if (subsectionFields.length === 0) return null;

                                    const subsectionLabels: Record<string, string> = {
                                      'calc-unit-mix': 'Unit Mix',
                                      'calc-other-income': 'Other Income',
                                      'calc-vacancy': 'Vacancy & Loss',
                                      'calc-expenses': 'Operating Expenses',
                                      'calc-cap': 'Cap Rate',
                                      'calc-adjustments': 'Adjustments'
                                    };

                                    return (
                                      <Collapsible
                                        key={subsectionId}
                                        open={expandedCalcSubsections.has(subsectionId)}
                                        onOpenChange={() => toggleCalcSubsection(subsectionId)}
                                      >
                                        <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#4b5563' }}>
                                          <CollapsibleTrigger className="w-full">
                                            <div className="px-4 py-2 flex items-center justify-between cursor-pointer transition-colors hover:bg-[#333333]" style={{ backgroundColor: '#2a2a2a' }}>
                                              <div className="flex items-center gap-2">
                                                {expandedCalcSubsections.has(subsectionId) ? (
                                                  <ChevronDown className="w-4 h-4" style={{ color: '#9ca3af' }} />
                                                ) : (
                                                  <ChevronRight className="w-4 h-4" style={{ color: '#9ca3af' }} />
                                                )}
                                                <h4 className="text-sm font-semibold text-white">{subsectionLabels[subsectionId] || subsectionId}</h4>
                                              </div>
                                              <Badge variant="outline" className="text-xs text-gray-300 border-gray-500">{subsectionFields.length} inputs</Badge>
                                            </div>
                                          </CollapsibleTrigger>
                                          <CollapsibleContent>
                                            <div className="p-3" style={{ backgroundColor: '#1f1f1f' }}>
                                              <table className="w-full text-sm">
                                                <tbody>
                                                  {subsectionFields.map(field => {
                                                    const statusInfo = getFieldStatus(field);
                                                    return (
                                                      <tr key={field.id} className="border-b hover:bg-[#333333]" style={{ borderColor: '#4b5563' }}>
                                                        <td className="px-2 py-1.5 text-xs font-mono w-48" style={{ color: '#9ca3af' }}>{field.storeId}</td>
                                                        <td className="px-2 py-1.5 text-sm text-white">{field.label}</td>
                                                        <td className="px-2 py-1.5">{renderInput(field, statusInfo)}</td>
                                                        <td className="px-2 py-1.5 w-20">{renderStatusBadge(statusInfo.status)}</td>
                                                      </tr>
                                                    );
                                                  })}
                                                </tbody>
                                              </table>
                                            </div>
                                          </CollapsibleContent>
                                        </div>
                                      </Collapsible>
                                    );
                                  })}
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>

                          {/* ==================== OUTPUTS SECTION ==================== */}
                          <Collapsible
                            open={expandedCalcSubsections.has('outputs-main')}
                            onOpenChange={() => toggleCalcSubsection('outputs-main')}
                          >
                            <div className="border-2 rounded-lg overflow-hidden" style={{ borderColor: '#4b5563' }}>
                              <CollapsibleTrigger className="w-full">
                                <div className="px-4 py-3 flex items-center justify-between cursor-pointer transition-colors hover:bg-[#333333]" style={{ backgroundColor: '#2a2a2a' }}>
                                  <div className="flex items-center gap-2">
                                    {expandedCalcSubsections.has('outputs-main') ? (
                                      <ChevronDown className="w-5 h-5" style={{ color: '#9ca3af' }} />
                                    ) : (
                                      <ChevronRight className="w-5 h-5" style={{ color: '#9ca3af' }} />
                                    )}
                                    <h3 className="text-base font-bold text-white">OUTPUTS</h3>
                                    <Badge className="text-gray-300 border-gray-500" style={{ backgroundColor: '#1f1f1f' }}>
                                      {Object.values(allCalculatedFields).flat().length} Calculated Fields
                                    </Badge>
                                    <Badge variant="outline" className="text-xs text-gray-400 border-gray-600" style={{ backgroundColor: '#1f1f1f' }}>Read-Only</Badge>
                                  </div>
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="p-3 space-y-2" style={{ backgroundColor: '#1f1f1f' }}>
                                  {/* Output groups - logically organized */}
                                  {(() => {
                                    // Group calculated fields by functional category
                                    const outputGroups: Record<string, { label: string; sections: string[] }> = {
                                      'income-approach': {
                                        label: 'Income Approach (PGR, EGR, NOI, Cap Value)',
                                        sections: ['calc', 'calc-output', 'calc-unit-mix', 'calc-other-income', 'calc-vacancy', 'calc-expenses', 'calc-cap', 'calc-adjustments', 'calc-results', 'calc-revenue-pct']
                                      },
                                      'sales-comparison': {
                                        label: 'Sales Comparison',
                                        sections: ['sales', 'sale-comp-1', 'sale-comp-2', 'sale-comp-3', 'sale-comp-4', 'sale-comp-5', 'sca-conclusion', 'sca-analysis', 'sales-conclusion']
                                      },
                                      'rent-roll': {
                                        label: 'Rent Roll',
                                        sections: ['rentroll', 'rentroll-totals', 'rentroll-type1', 'rentroll-type2']
                                      },
                                      'rental-analysis': {
                                        label: 'Rental Analysis',
                                        sections: ['rental-revenue', 'rent-analysis-1br', 'rent-analysis-2br', 'rental-comp-1', 'rental-comp-2', 'rental-comp-3', 'rental-comp-4', 'rental-comp-5', 'contract-vs-market', 'contract-analysis', 'survey-summary']
                                      },
                                      'historical-data': {
                                        label: 'Historical Data',
                                        sections: ['hist-expenses', 'hist-revenue', 'hist-vacancy', 'hist-noi']
                                      },
                                      'direct-cap': {
                                        label: 'Direct Cap Analysis',
                                        sections: ['dca-statistics', 'dca-summary', 'direct-capitalization', 'cap-rate-analysis']
                                      },
                                      'value-summary': {
                                        label: 'Value Summary',
                                        sections: ['value-summary', 'final-value', 'calculated-values', 'income-projections']
                                      },
                                      'other': {
                                        label: 'Other Outputs',
                                        sections: ['exec', 'income', 'recon', 'impv', 'site', 'market', 'cost-s', 'land1', 'cover', 'condition', 'building-overview', 'client-intake', 'client-info-intake', 'client-info', 'property-contact-intake', 'appraiser-info']
                                      }
                                    };

                                    return Object.entries(outputGroups).map(([groupId, { label, sections: groupSections }]) => {
                                      // Get all calculated fields for this group
                                      const groupFields = fieldRegistry.filter(f =>
                                        f.inputSource === 'calculated' && groupSections.includes(f.section || '')
                                      );

                                      if (groupFields.length === 0) return null;

                                      return (
                                        <Collapsible
                                          key={groupId}
                                          open={expandedAllCalcOutputSections.has(groupId)}
                                          onOpenChange={() => toggleAllCalcOutputSection(groupId)}
                                        >
                                          <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#4b5563' }}>
                                            <CollapsibleTrigger className="w-full">
                                              <div className="px-4 py-2 flex items-center justify-between cursor-pointer transition-colors hover:bg-[#333333]" style={{ backgroundColor: '#2a2a2a' }}>
                                                <div className="flex items-center gap-2">
                                                  {expandedAllCalcOutputSections.has(groupId) ? (
                                                    <ChevronDown className="w-4 h-4" style={{ color: '#9ca3af' }} />
                                                  ) : (
                                                    <ChevronRight className="w-4 h-4" style={{ color: '#9ca3af' }} />
                                                  )}
                                                  <h4 className="text-sm font-semibold text-white">{label}</h4>
                                                </div>
                                                <Badge variant="outline" className="text-xs text-gray-300 border-gray-500">{groupFields.length} outputs</Badge>
                                              </div>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                              <div className="p-3" style={{ backgroundColor: '#1f1f1f' }}>
                                                <table className="w-full text-sm">
                                                  <tbody>
                                                    {groupFields.map(field => {
                                                      const value = getStoreValue(field.storeId);
                                                      const formattedValue = field.type === 'currency'
                                                        ? (typeof value === 'number' ? `$${value.toLocaleString()}` : value || '-')
                                                        : field.type === 'percentage'
                                                        ? (typeof value === 'number' ? `${value.toFixed(2)}%` : value || '-')
                                                        : (value !== undefined && value !== null && value !== '' ? String(value) : '-');
                                                      return (
                                                        <tr key={field.id} className="border-b hover:bg-[#333333]" style={{ borderColor: '#4b5563', backgroundColor: '#2a2a2a' }}>
                                                          <td className="px-2 py-1.5 text-xs font-mono w-48" style={{ color: '#9ca3af' }}>{field.storeId}</td>
                                                          <td className="px-2 py-1.5 text-sm text-white">{field.label}</td>
                                                          <td className="px-2 py-1.5 text-sm font-medium text-right w-32 text-white">
                                                            {formattedValue}
                                                          </td>
                                                        </tr>
                                                      );
                                                    })}
                                                  </tbody>
                                                </table>
                                              </div>
                                            </CollapsibleContent>
                                          </div>
                                        </Collapsible>
                                      );
                                    });
                                  })()}
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>
                        </div>
                      ) : sectionId === 'image-mgt' ? (
                        <div className="space-y-4 p-4" style={{ backgroundColor: '#1f1f1f' }}>
                          {/* 01 - Cover & Signature */}
                          <Collapsible
                            open={expandedImageDestinations.has('cover-sig')}
                            onOpenChange={() => toggleImageDestination('cover-sig')}
                          >
                            <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#4b5563' }}>
                              <CollapsibleTrigger className="w-full">
                                <div className="px-4 py-3 flex items-center justify-between cursor-pointer transition-colors hover:bg-[#333333]" style={{ backgroundColor: '#2a2a2a' }}>
                                  <div className="flex items-center gap-2">
                                    {expandedImageDestinations.has('cover-sig') ? <ChevronDown className="w-4 h-4" style={{ color: '#9ca3af' }} /> : <ChevronRight className="w-4 h-4" style={{ color: '#9ca3af' }} />}
                                    <h3 className="text-sm font-semibold text-white">01 - COVER & SIGNATURE</h3>
                                  </div>
                                  <Badge variant="outline" className="text-xs ml-auto text-gray-300 border-gray-500">
                                    {getFieldsBySubsection(sectionId, 'cover-images').filter(f => f.inputSource === 'user-input').length} fields
                                  </Badge>
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="p-4" style={{ backgroundColor: '#1f1f1f' }}>
                                  <div className="grid grid-cols-2 gap-4">
                                    {getFieldsBySubsection(sectionId, 'cover-images').filter(f => f.inputSource === 'user-input' && f.id !== 'img-signature').map(field => {
                                      const statusInfo = getFieldStatus(field);
                                      return (
                                        <div key={field.id} className="flex flex-col gap-1">
                                          <label className="text-xs font-medium" style={{ color: '#9ca3af' }}>{field.label}</label>
                                          <div className="flex items-center gap-2">
                                            {renderInput(field, statusInfo)}
                                            {renderStatusBadge(statusInfo.status)}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>

                          {/* 03 - Location Maps */}
                          <Collapsible
                            open={expandedImageDestinations.has('location-maps')}
                            onOpenChange={() => toggleImageDestination('location-maps')}
                          >
                            <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#4b5563' }}>
                              <CollapsibleTrigger className="w-full">
                                <div className="px-4 py-3 flex items-center justify-between cursor-pointer transition-colors hover:bg-[#333333]" style={{ backgroundColor: '#2a2a2a' }}>
                                  <div className="flex items-center gap-2">
                                    {expandedImageDestinations.has('location-maps') ? <ChevronDown className="w-4 h-4" style={{ color: '#9ca3af' }} /> : <ChevronRight className="w-4 h-4" style={{ color: '#9ca3af' }} />}
                                    <h3 className="text-sm font-semibold text-white">03 - LOCATION MAPS</h3>
                                  </div>
                                  <Badge variant="outline" className="text-xs ml-auto text-gray-300 border-gray-500">
                                    {getFieldsBySubsection(sectionId, 'maps').filter(f => f.inputSource === 'user-input').length} fields
                                  </Badge>
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="p-4" style={{ backgroundColor: '#1f1f1f' }}>
                                  <div className="grid grid-cols-2 gap-4">
                                    {getFieldsBySubsection(sectionId, 'maps').filter(f => f.inputSource === 'user-input').map(field => {
                                      const statusInfo = getFieldStatus(field);
                                      return (
                                        <div key={field.id} className="flex flex-col gap-1">
                                          <label className="text-xs font-medium" style={{ color: '#9ca3af' }}>{field.label}</label>
                                          <div className="flex items-center gap-2">
                                            {renderInput(field, statusInfo)}
                                            {renderStatusBadge(statusInfo.status)}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>

                          {/* 07 - Property Photographs */}
                          <Collapsible
                            open={expandedImageDestinations.has('property-photos')}
                            onOpenChange={() => toggleImageDestination('property-photos')}
                          >
                            <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#4b5563' }}>
                              <CollapsibleTrigger className="w-full">
                                <div className="px-4 py-3 flex items-center justify-between cursor-pointer transition-colors hover:bg-[#333333]" style={{ backgroundColor: '#2a2a2a' }}>
                                  <div className="flex items-center gap-2">
                                    {expandedImageDestinations.has('property-photos') ? <ChevronDown className="w-4 h-4" style={{ color: '#9ca3af' }} /> : <ChevronRight className="w-4 h-4" style={{ color: '#9ca3af' }} />}
                                    <h3 className="text-sm font-semibold text-white">07 - PROPERTY PHOTOGRAPHS</h3>
                                  </div>
                                  <Badge variant="outline" className="text-xs ml-auto text-gray-300 border-gray-500">
                                    {getFieldsBySubsection(sectionId, 'exterior-photos').filter(f => f.inputSource === 'user-input').length +
                                     getFieldsBySubsection(sectionId, 'street-photos').filter(f => f.inputSource === 'user-input').length +
                                     getFieldsBySubsection(sectionId, 'common-photos').filter(f => f.inputSource === 'user-input').length +
                                     getFieldsBySubsection(sectionId, 'unit-photos').filter(f => f.inputSource === 'user-input').length +
                                     getFieldsBySubsection(sectionId, 'systems-photos').filter(f => f.inputSource === 'user-input').length} fields
                                  </Badge>
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="p-4 space-y-4" style={{ backgroundColor: '#1f1f1f' }}>
                                  {/* Exterior Photos */}
                                  <Collapsible
                                    open={expandedPhotoSubsections.has('exterior-photos')}
                                    onOpenChange={() => togglePhotoSubsection('exterior-photos')}
                                  >
                                    <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#4b5563' }}>
                                      <CollapsibleTrigger className="w-full">
                                        <div className="px-4 py-2 flex items-center justify-between cursor-pointer transition-colors hover:bg-[#333333]" style={{ backgroundColor: '#2a2a2a' }}>
                                          <div className="flex items-center gap-2">
                                            {expandedPhotoSubsections.has('exterior-photos') ? (
                                              <ChevronDown className="w-4 h-4" style={{ color: '#9ca3af' }} />
                                            ) : (
                                              <ChevronRight className="w-4 h-4" style={{ color: '#9ca3af' }} />
                                            )}
                                            <h4 className="text-xs font-semibold text-white">Exterior Photos</h4>
                                          </div>
                                          <Badge variant="outline" className="text-xs text-gray-300 border-gray-500">
                                            {getFieldsBySubsection(sectionId, 'exterior-photos').filter(f => f.inputSource === 'user-input').length} fields
                                          </Badge>
                                        </div>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent>
                                        <div className="grid grid-cols-2 gap-4 p-4" style={{ backgroundColor: '#1f1f1f' }}>
                                          {getFieldsBySubsection(sectionId, 'exterior-photos').filter(f => f.inputSource === 'user-input').map(field => {
                                            const statusInfo = getFieldStatus(field);
                                            return (
                                              <div key={field.id} className="flex flex-col gap-1">
                                                <label className="text-xs font-medium" style={{ color: '#9ca3af' }}>{field.label}</label>
                                                <div className="flex items-center gap-2">
                                                  {renderInput(field, statusInfo)}
                                                  {renderStatusBadge(statusInfo.status)}
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </CollapsibleContent>
                                    </div>
                                  </Collapsible>

                                  {/* Street Views */}
                                  <Collapsible
                                    open={expandedPhotoSubsections.has('street-photos')}
                                    onOpenChange={() => togglePhotoSubsection('street-photos')}
                                  >
                                    <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#4b5563' }}>
                                      <CollapsibleTrigger className="w-full">
                                        <div className="px-4 py-2 flex items-center justify-between cursor-pointer transition-colors hover:bg-[#333333]" style={{ backgroundColor: '#2a2a2a' }}>
                                          <div className="flex items-center gap-2">
                                            {expandedPhotoSubsections.has('street-photos') ? (
                                              <ChevronDown className="w-4 h-4" style={{ color: '#9ca3af' }} />
                                            ) : (
                                              <ChevronRight className="w-4 h-4" style={{ color: '#9ca3af' }} />
                                            )}
                                            <h4 className="text-xs font-semibold text-white">Street Views</h4>
                                          </div>
                                          <Badge variant="outline" className="text-xs text-gray-300 border-gray-500">
                                            {getFieldsBySubsection(sectionId, 'street-photos').filter(f => f.inputSource === 'user-input').length} fields
                                          </Badge>
                                        </div>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent>
                                        <div className="grid grid-cols-2 gap-4 p-4" style={{ backgroundColor: '#1f1f1f' }}>
                                          {getFieldsBySubsection(sectionId, 'street-photos').filter(f => f.inputSource === 'user-input').map(field => {
                                            const statusInfo = getFieldStatus(field);
                                            return (
                                              <div key={field.id} className="flex flex-col gap-1">
                                                <label className="text-xs font-medium" style={{ color: '#9ca3af' }}>{field.label}</label>
                                                <div className="flex items-center gap-2">
                                                  {renderInput(field, statusInfo)}
                                                  {renderStatusBadge(statusInfo.status)}
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </CollapsibleContent>
                                    </div>
                                  </Collapsible>

                                  {/* Common Areas */}
                                  <Collapsible
                                    open={expandedPhotoSubsections.has('common-photos')}
                                    onOpenChange={() => togglePhotoSubsection('common-photos')}
                                  >
                                    <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#4b5563' }}>
                                      <CollapsibleTrigger className="w-full">
                                        <div className="px-4 py-2 flex items-center justify-between cursor-pointer transition-colors hover:bg-[#333333]" style={{ backgroundColor: '#2a2a2a' }}>
                                          <div className="flex items-center gap-2">
                                            {expandedPhotoSubsections.has('common-photos') ? (
                                              <ChevronDown className="w-4 h-4" style={{ color: '#9ca3af' }} />
                                            ) : (
                                              <ChevronRight className="w-4 h-4" style={{ color: '#9ca3af' }} />
                                            )}
                                            <h4 className="text-xs font-semibold text-white">Common Areas</h4>
                                          </div>
                                          <Badge variant="outline" className="text-xs text-gray-300 border-gray-500">
                                            {getFieldsBySubsection(sectionId, 'common-photos').filter(f => f.inputSource === 'user-input').length} fields
                                          </Badge>
                                        </div>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent>
                                        <div className="grid grid-cols-2 gap-4 p-4" style={{ backgroundColor: '#1f1f1f' }}>
                                          {getFieldsBySubsection(sectionId, 'common-photos').filter(f => f.inputSource === 'user-input').map(field => {
                                            const statusInfo = getFieldStatus(field);
                                            return (
                                              <div key={field.id} className="flex flex-col gap-1">
                                                <label className="text-xs font-medium" style={{ color: '#9ca3af' }}>{field.label}</label>
                                                <div className="flex items-center gap-2">
                                                  {renderInput(field, statusInfo)}
                                                  {renderStatusBadge(statusInfo.status)}
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </CollapsibleContent>
                                    </div>
                                  </Collapsible>

                                  {/* Unit Interiors */}
                                  <Collapsible
                                    open={expandedPhotoSubsections.has('unit-photos')}
                                    onOpenChange={() => togglePhotoSubsection('unit-photos')}
                                  >
                                    <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#4b5563' }}>
                                      <CollapsibleTrigger className="w-full">
                                        <div className="px-4 py-2 flex items-center justify-between cursor-pointer transition-colors hover:bg-[#333333]" style={{ backgroundColor: '#2a2a2a' }}>
                                          <div className="flex items-center gap-2">
                                            {expandedPhotoSubsections.has('unit-photos') ? (
                                              <ChevronDown className="w-4 h-4" style={{ color: '#9ca3af' }} />
                                            ) : (
                                              <ChevronRight className="w-4 h-4" style={{ color: '#9ca3af' }} />
                                            )}
                                            <h4 className="text-xs font-semibold text-white">Unit Interiors</h4>
                                          </div>
                                          <Badge variant="outline" className="text-xs text-gray-300 border-gray-500">
                                            {getFieldsBySubsection(sectionId, 'unit-photos').filter(f => f.inputSource === 'user-input').length} fields
                                          </Badge>
                                        </div>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent>
                                        <div className="grid grid-cols-2 gap-4 p-4" style={{ backgroundColor: '#1f1f1f' }}>
                                          {getFieldsBySubsection(sectionId, 'unit-photos').filter(f => f.inputSource === 'user-input').map(field => {
                                            const statusInfo = getFieldStatus(field);
                                            return (
                                              <div key={field.id} className="flex flex-col gap-1">
                                                <label className="text-xs font-medium" style={{ color: '#9ca3af' }}>{field.label}</label>
                                                <div className="flex items-center gap-2">
                                                  {renderInput(field, statusInfo)}
                                                  {renderStatusBadge(statusInfo.status)}
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </CollapsibleContent>
                                    </div>
                                  </Collapsible>

                                  {/* Building Systems */}
                                  <Collapsible
                                    open={expandedPhotoSubsections.has('systems-photos')}
                                    onOpenChange={() => togglePhotoSubsection('systems-photos')}
                                  >
                                    <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#4b5563' }}>
                                      <CollapsibleTrigger className="w-full">
                                        <div className="px-4 py-2 flex items-center justify-between cursor-pointer transition-colors hover:bg-[#333333]" style={{ backgroundColor: '#2a2a2a' }}>
                                          <div className="flex items-center gap-2">
                                            {expandedPhotoSubsections.has('systems-photos') ? (
                                              <ChevronDown className="w-4 h-4" style={{ color: '#9ca3af' }} />
                                            ) : (
                                              <ChevronRight className="w-4 h-4" style={{ color: '#9ca3af' }} />
                                            )}
                                            <h4 className="text-xs font-semibold text-white">Building Systems</h4>
                                          </div>
                                          <Badge variant="outline" className="text-xs text-gray-300 border-gray-500">
                                            {getFieldsBySubsection(sectionId, 'systems-photos').filter(f => f.inputSource === 'user-input').length} fields
                                          </Badge>
                                        </div>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent>
                                        <div className="grid grid-cols-2 gap-4 p-4" style={{ backgroundColor: '#1f1f1f' }}>
                                          {getFieldsBySubsection(sectionId, 'systems-photos').filter(f => f.inputSource === 'user-input').map(field => {
                                            const statusInfo = getFieldStatus(field);
                                            return (
                                              <div key={field.id} className="flex flex-col gap-1">
                                                <label className="text-xs font-medium" style={{ color: '#9ca3af' }}>{field.label}</label>
                                                <div className="flex items-center gap-2">
                                                  {renderInput(field, statusInfo)}
                                                  {renderStatusBadge(statusInfo.status)}
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </CollapsibleContent>
                                    </div>
                                  </Collapsible>
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>

                          {/* 08 - Subject Photos */}
                          <Collapsible
                            open={expandedImageDestinations.has('subject-photos')}
                            onOpenChange={() => toggleImageDestination('subject-photos')}
                          >
                            <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#4b5563' }}>
                              <CollapsibleTrigger className="w-full">
                                <div className="px-4 py-3 flex items-center justify-between cursor-pointer transition-colors hover:bg-[#333333]" style={{ backgroundColor: '#2a2a2a' }}>
                                  <div className="flex items-center gap-2">
                                    {expandedImageDestinations.has('subject-photos') ? <ChevronDown className="w-4 h-4" style={{ color: '#9ca3af' }} /> : <ChevronRight className="w-4 h-4" style={{ color: '#9ca3af' }} />}
                                    <h3 className="text-sm font-semibold text-white">08 - SUBJECT PHOTOS</h3>
                                  </div>
                                  <Badge variant="outline" className="text-xs ml-auto text-gray-300 border-gray-500">
                                    {getFieldsBySubsection(sectionId, 'subject-photos').filter(f => f.inputSource === 'user-input').length} fields
                                  </Badge>
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="p-4" style={{ backgroundColor: '#1f1f1f' }}>
                                  <div className="grid grid-cols-2 gap-4">
                                    {groupImageFieldsWithCaptions(getFieldsBySubsection(sectionId, 'subject-photos').filter(f => f.inputSource === 'user-input')).map(({ image, caption }) => {
                                      const imageStatus = getFieldStatus(image);
                                      const captionStatus = caption ? getFieldStatus(caption) : null;
                                      return (
                                        <div key={image.id} className="flex flex-col gap-2 border rounded-lg p-3">
                                          <div className="flex flex-col gap-1">
                                            <label className="text-xs font-medium" style={{ color: '#9ca3af' }}>{image.label}</label>
                                            <div className="flex items-center gap-2">
                                              {renderInput(image, imageStatus)}
                                              {renderStatusBadge(imageStatus.status)}
                                            </div>
                                          </div>
                                          {caption && (
                                            <div className="flex flex-col gap-1">
                                              <label className="text-xs font-medium" style={{ color: '#9ca3af' }}>{caption.label}</label>
                                              <div className="flex items-center gap-2">
                                                {renderInput(caption, captionStatus!)}
                                                {renderStatusBadge(captionStatus!.status)}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>

                          {/* 09 - Sales Comp Photos */}
                          <Collapsible
                            open={expandedImageDestinations.has('comp-photos')}
                            onOpenChange={() => toggleImageDestination('comp-photos')}
                          >
                            <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#4b5563' }}>
                              <CollapsibleTrigger className="w-full">
                                <div className="px-4 py-3 flex items-center justify-between cursor-pointer transition-colors hover:bg-[#333333]" style={{ backgroundColor: '#2a2a2a' }}>
                                  <div className="flex items-center gap-2">
                                    {expandedImageDestinations.has('comp-photos') ? <ChevronDown className="w-4 h-4" style={{ color: '#9ca3af' }} /> : <ChevronRight className="w-4 h-4" style={{ color: '#9ca3af' }} />}
                                    <h3 className="text-sm font-semibold text-white">09 - SALES COMP PHOTOS</h3>
                                  </div>
                                  <Badge variant="outline" className="text-xs ml-auto text-gray-300 border-gray-500">
                                    {getFieldsBySubsection(sectionId, 'comp-photos').filter(f => f.inputSource === 'user-input').length} fields
                                  </Badge>
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="p-4" style={{ backgroundColor: '#1f1f1f' }}>
                                  <div className="grid grid-cols-2 gap-4">
                                    {groupImageFieldsWithCaptions(getFieldsBySubsection(sectionId, 'comp-photos').filter(f => f.inputSource === 'user-input')).map(({ image, caption }) => {
                                      const imageStatus = getFieldStatus(image);
                                      const captionStatus = caption ? getFieldStatus(caption) : null;
                                      return (
                                        <div key={image.id} className="flex flex-col gap-2 border rounded-lg p-3">
                                          <div className="flex flex-col gap-1">
                                            <label className="text-xs font-medium" style={{ color: '#9ca3af' }}>{image.label}</label>
                                            <div className="flex items-center gap-2">
                                              {renderInput(image, imageStatus)}
                                              {renderStatusBadge(imageStatus.status)}
                                            </div>
                                          </div>
                                          {caption && (
                                            <div className="flex flex-col gap-1">
                                              <label className="text-xs font-medium" style={{ color: '#9ca3af' }}>{caption.label}</label>
                                              <div className="flex items-center gap-2">
                                                {renderInput(caption, captionStatus!)}
                                                {renderStatusBadge(captionStatus!.status)}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>

                          {/* 10 - Sales Comp Maps */}
                          <Collapsible
                            open={expandedImageDestinations.has('comp-maps')}
                            onOpenChange={() => toggleImageDestination('comp-maps')}
                          >
                            <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#4b5563' }}>
                              <CollapsibleTrigger className="w-full">
                                <div className="px-4 py-3 flex items-center justify-between cursor-pointer transition-colors hover:bg-[#333333]" style={{ backgroundColor: '#2a2a2a' }}>
                                  <div className="flex items-center gap-2">
                                    {expandedImageDestinations.has('comp-maps') ? <ChevronDown className="w-4 h-4" style={{ color: '#9ca3af' }} /> : <ChevronRight className="w-4 h-4" style={{ color: '#9ca3af' }} />}
                                    <h3 className="text-sm font-semibold text-white">10 - SALES COMP MAPS</h3>
                                  </div>
                                  <Badge variant="outline" className="text-xs ml-auto text-gray-300 border-gray-500">
                                    {getFieldsBySubsection(sectionId, 'comp-maps').filter(f => f.inputSource === 'user-input').length} fields
                                  </Badge>
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="p-4" style={{ backgroundColor: '#1f1f1f' }}>
                                  <div className="grid grid-cols-2 gap-4">
                                    {getFieldsBySubsection(sectionId, 'comp-maps').filter(f => f.inputSource === 'user-input').map(field => {
                                      const statusInfo = getFieldStatus(field);
                                      return (
                                        <div key={field.id} className="flex flex-col gap-1">
                                          <label className="text-xs font-medium" style={{ color: '#9ca3af' }}>{field.label}</label>
                                          <div className="flex items-center gap-2">
                                            {renderInput(field, statusInfo)}
                                            {renderStatusBadge(statusInfo.status)}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>

                          {/* 11 - Rental Comp Photos */}
                          <Collapsible
                            open={expandedImageDestinations.has('rental-comp-photos')}
                            onOpenChange={() => toggleImageDestination('rental-comp-photos')}
                          >
                            <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#4b5563' }}>
                              <CollapsibleTrigger className="w-full">
                                <div className="px-4 py-3 flex items-center justify-between cursor-pointer transition-colors hover:bg-[#333333]" style={{ backgroundColor: '#2a2a2a' }}>
                                  <div className="flex items-center gap-2">
                                    {expandedImageDestinations.has('rental-comp-photos') ? <ChevronDown className="w-4 h-4" style={{ color: '#9ca3af' }} /> : <ChevronRight className="w-4 h-4" style={{ color: '#9ca3af' }} />}
                                    <h3 className="text-sm font-semibold text-white">11 - RENTAL COMP PHOTOS</h3>
                                  </div>
                                  <Badge variant="outline" className="text-xs ml-auto text-gray-300 border-gray-500">
                                    {getFieldsBySubsection(sectionId, 'rental-comp-photos').filter(f => f.inputSource === 'user-input').length +
                                     (getFieldsBySubsection('rent-analysis', 'rental-comps').find(f => f.id === 'rental-comparables-map' && f.inputSource === 'user-input') ? 1 : 0)} fields
                                  </Badge>
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="p-4" style={{ backgroundColor: '#1f1f1f' }}>
                                  <div className="grid grid-cols-2 gap-4">
                                    {getFieldsBySubsection(sectionId, 'rental-comp-photos').filter(f => f.inputSource === 'user-input').map(field => {
                                      const statusInfo = getFieldStatus(field);
                                      return (
                                        <div key={field.id} className="flex flex-col gap-1">
                                          <label className="text-xs font-medium" style={{ color: '#9ca3af' }}>{field.label}</label>
                                          <div className="flex items-center gap-2">
                                            {renderInput(field, statusInfo)}
                                            {renderStatusBadge(statusInfo.status)}
                                          </div>
                                        </div>
                                      );
                                    })}
                                    {/* Include rental-comparables-map from rent-analysis section */}
                                    {(() => {
                                      const rentalMapField = getFieldsBySubsection('rent-analysis', 'rental-comps').find(f => f.id === 'rental-comparables-map' && f.inputSource === 'user-input');
                                      if (rentalMapField) {
                                        const statusInfo = getFieldStatus(rentalMapField);
                                        return (
                                          <div key={rentalMapField.id} className="flex flex-col gap-1">
                                            <label className="text-xs font-medium" style={{ color: '#9ca3af' }}>{rentalMapField.label}</label>
                                            <div className="flex items-center gap-2">
                                              {renderInput(rentalMapField, statusInfo)}
                                              {renderStatusBadge(statusInfo.status)}
                                            </div>
                                          </div>
                                        );
                                      }
                                      return null;
                                    })()}
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>
                        </div>
                      ) : (
                        <div className="p-4" style={{ backgroundColor: '#1f1f1f' }}>
                          <table className="w-full">
                            <thead>
                              <tr className="border-b" style={{ borderColor: '#4b5563' }}>
                                <th className="text-left text-xs font-semibold px-4 py-2 w-48" style={{ color: '#9ca3af' }}>Field ID</th>
                                <th className="text-left text-xs font-semibold px-4 py-2" style={{ color: '#9ca3af' }}>Label</th>
                                <th className="text-left text-xs font-semibold px-4 py-2" style={{ color: '#9ca3af' }}>Value</th>
                                <th className="text-left text-xs font-semibold px-4 py-2 w-24" style={{ color: '#9ca3af' }}>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* Mapped fields first */}
                              {mappedFields.map(field => {
                                const statusInfo = getFieldStatus(field);
                                return (
                                  <tr
                                    key={field.id}
                                    className="border-b transition-colors"
                                    style={{ borderColor: '#4b5563', backgroundColor: '#1f1f1f' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1f1f1f'}
                                  >
                                    <td className="px-4 py-2 text-xs font-mono" style={{ color: '#9ca3af' }}>
                                      {field.storeId}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-white">
                                      {field.label}
                                      {field.required && (
                                        <span className="text-red-500 ml-1">*</span>
                                      )}
                                    </td>
                                    <td className="px-4 py-2">
                                      {renderInput(field, statusInfo)}
                                    </td>
                                    <td className="px-4 py-2">
                                      {renderStatusBadge(statusInfo.status)}
                                    </td>
                                  </tr>
                                );
                              })}
                              {/* Empty/Unused fields grouped at bottom */}
                              {emptyFields.length > 0 && (
                                <>
                                  <tr className="border-t-2" style={{ backgroundColor: '#2a2a2a', borderColor: '#4b5563' }}>
                                    <td colSpan={4} className="px-4 py-2 text-xs font-semibold uppercase" style={{ color: '#9ca3af' }}>
                                      Unused/Optional Fields ({emptyFields.length})
                                    </td>
                                  </tr>
                                  {emptyFields.map(field => {
                                    const statusInfo = getFieldStatus(field);
                                    return (
                                      <tr
                                        key={field.id}
                                        className="border-b transition-colors"
                                        style={{ borderColor: '#4b5563', backgroundColor: '#2a2a2a' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333333'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                                      >
                                        <td className="px-4 py-2 text-xs font-mono" style={{ color: '#9ca3af' }}>
                                          {field.storeId}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-white">
                                          {field.label}
                                          {field.required && (
                                            <span className="text-red-500 ml-1">*</span>
                                          )}
                                        </td>
                                        <td className="px-4 py-2">
                                          {renderInput(field, statusInfo)}
                                        </td>
                                        <td className="px-4 py-2">
                                          {renderStatusBadge(statusInfo.status)}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TestInputDashboard;
