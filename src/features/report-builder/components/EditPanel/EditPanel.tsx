import { useState } from 'react';
import { useReportBuilderStore } from '../../store/reportBuilderStore';
import { cn } from '@/lib/utils';
import TextFieldEditor from './TextFieldEditor';
import ImageFieldEditor from './ImageFieldEditor';
import CalculatedFieldDisplay from './CalculatedFieldDisplay';
import { ReportField, ReportSubsection } from '../../types/reportBuilder.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Play, Image as ImageIcon, ChevronDown, Database } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mapping of which image fields should appear in which sections
const SECTION_IMAGE_MAPPING: Record<string, string[]> = {
  'cover': ['img-cover-photo', 'img-signature'],
  'maps': ['img-map-regional', 'img-map-local', 'img-map-aerial-1', 'img-map-aerial-2', 'img-zoning-map', 'img-site-plan-1', 'img-site-plan-2'],
  'photos': [
    'img-exterior-1', 'img-exterior-2', 'img-exterior-3', 'img-exterior-4', 'img-exterior-5', 'img-exterior-6',
    'img-street-1', 'img-street-2', 'img-street-3',
    'img-common-1', 'img-common-2', 'img-common-3', 'img-common-4',
    'img-unit-1', 'img-unit-2', 'img-unit-3', 'img-unit-4', 'img-unit-5', 'img-unit-6',
    'img-systems-1', 'img-systems-2', 'img-systems-3', 'img-systems-4'
  ],
};

// Layout configuration for Home section field groupings
// Each row defines which fields appear together and their widths
type FieldLayoutRow = { fields: string[]; widths: string[] };
type SubsectionLayout = FieldLayoutRow[];

const HOME_FIELD_LAYOUT: Record<string, SubsectionLayout> = {
  'job-setup': [
    { fields: ['home-job-id', 'home-job-status', 'home-report-date'], widths: ['33.33%', '33.33%', '33.33%'] },
  ],
  'client-info': [
    { fields: ['home-client-name', 'home-client-company'], widths: ['50%', '50%'] },
    { fields: ['home-client-email', 'home-client-phone'], widths: ['50%', '50%'] },
    { fields: ['home-client-address-street'], widths: ['100%'] },
    { fields: ['home-client-address-city', 'home-client-address-state', 'home-client-address-postal'], widths: ['40%', '30%', '30%'] },
    { fields: ['home-client-reference'], widths: ['100%'] },
  ],
  'appraiser-info': [
    { fields: ['home-appraiser-name', 'home-appraiser-designation'], widths: ['50%', '50%'] },
    { fields: ['home-appraiser-license', 'home-appraiser-company'], widths: ['50%', '50%'] },
    { fields: ['home-appraiser-email', 'home-appraiser-phone'], widths: ['50%', '50%'] },
  ],
  'property-info': [
    { fields: ['home-property-name'], widths: ['100%'] },
    { fields: ['home-property-address-street'], widths: ['100%'] },
    { fields: ['home-property-address-city', 'home-property-address-province', 'home-property-address-postal'], widths: ['40%', '30%', '30%'] },
    { fields: ['home-property-type', 'home-property-pid'], widths: ['50%', '50%'] },
    { fields: ['home-property-legal-description'], widths: ['100%'] },
  ],
  'assignment-details': [
    { fields: ['home-report-type', 'home-property-rights'], widths: ['50%', '50%'] },
    { fields: ['home-intended-use', 'home-intended-users'], widths: ['50%', '50%'] },
    { fields: ['home-scope-of-work'], widths: ['100%'] },
  ],
  'subject-contact': [
    { fields: ['home-contact-name', 'home-contact-title'], widths: ['50%', '50%'] },
    { fields: ['home-contact-phone', 'home-contact-email'], widths: ['50%', '50%'] },
    { fields: ['home-inspection-date'], widths: ['50%'] },
  ],
  'assumptions-conditions': [
    { fields: ['home-extraordinary-assumptions'], widths: ['100%'] },
    { fields: ['home-hypothetical-conditions'], widths: ['100%'] },
    { fields: ['home-limiting-conditions'], widths: ['100%'] },
  ],
  'transmittal-content': [
    { fields: ['transmittal-date'], widths: ['50%'] },
    { fields: ['transmittal-body'], widths: ['100%'] },
  ],
};

// Approach toggle field IDs - these are rendered separately at top of Home section
const APPROACH_TOGGLE_IDS = ['home-use-income-approach', 'home-use-sales-approach', 'home-use-cost-approach'];

export default function EditPanel() {
  const {
    sections,
    activeSection,
    updateFieldValue,
    loadCalcTestData,
    loadHomeTestData,
    loadCoverTestData,
    loadMapsTestData,
    loadAssignmentTestData,
    loadExecTestData,
    loadSiteTestData,
    loadImprovementsTestData,
    loadSalesTestData,
    loadIncomeTestData,
  } = useReportBuilderStore();

  // Track which subsections are EXPANDED (empty = all collapsed by default)
  const [expandedSubsections, setExpandedSubsections] = useState<Set<string>>(new Set());

  const toggleSubsection = (subsectionId: string) => {
    setExpandedSubsections(prev => {
      const next = new Set(prev);
      if (next.has(subsectionId)) {
        next.delete(subsectionId);
      } else {
        next.add(subsectionId);
      }
      return next;
    });
  };

  const currentSection = sections.find((s) => s.id === activeSection);
  const imageMgtSection = sections.find((s) => s.id === 'image-mgt');

  // Get approach toggle fields from the home section
  const getApproachToggleFields = (): ReportField[] => {
    const homeSection = sections.find(s => s.id === 'home');
    if (!homeSection) return [];

    const toggleFields: ReportField[] = [];

    // Check subsections for approach toggle fields
    for (const sub of homeSection.subsections || []) {
      for (const field of sub.fields || []) {
        if (APPROACH_TOGGLE_IDS.includes(field.id)) {
          toggleFields.push(field);
        }
      }
    }

    // Also check main fields
    for (const field of homeSection.fields || []) {
      if (APPROACH_TOGGLE_IDS.includes(field.id)) {
        toggleFields.push(field);
      }
    }

    // Sort to maintain consistent order
    return toggleFields.sort((a, b) =>
      APPROACH_TOGGLE_IDS.indexOf(a.id) - APPROACH_TOGGLE_IDS.indexOf(b.id)
    );
  };

  // Get related image fields from image-mgt section for the current section
  const getRelatedImageFields = (): ReportField[] => {
    if (!imageMgtSection || !activeSection) return [];

    const imageFieldIds = SECTION_IMAGE_MAPPING[activeSection] || [];
    if (imageFieldIds.length === 0) return [];

    const relatedFields: ReportField[] = [];

    // Search in image-mgt main fields
    for (const field of imageMgtSection.fields) {
      if (imageFieldIds.includes(field.id)) {
        relatedFields.push(field);
      }
    }

    // Search in image-mgt subsections
    if (imageMgtSection.subsections) {
      for (const subsection of imageMgtSection.subsections) {
        for (const field of subsection.fields) {
          if (imageFieldIds.includes(field.id)) {
            relatedFields.push(field);
          }
        }
      }
    }

    return relatedFields;
  };

  const relatedImages = getRelatedImageFields();

  if (!currentSection) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: '#1f1f1f' }}>
        <p className="text-white">Select a section to edit</p>
      </div>
    );
  }

  const getFieldBackgroundClass = (field: ReportField) => {
    if (!field.inputType) return '';

    switch (field.inputType) {
      case 'user-input':
        return '';
      case 'dropdown':
        return 'bg-gray-700 border-gray-600';
      case 'auto-filled':
        return 'bg-gray-600 border-gray-500 text-gray-300';
      default:
        return '';
    }
  };

  // Render a single field without the outer margin (for use in row layouts)
  const renderFieldContent = (field: ReportField) => {
    if (field.type === 'image') {
      return <ImageFieldEditor field={field} />;
    }

    if (field.type === 'calculated') {
      return <CalculatedFieldDisplay field={field} />;
    }

    if (field.type === 'textarea') {
      return <TextFieldEditor field={field} />;
    }

    if (field.type === 'dropdown' && field.options) {
      return (
        <>
          <Label htmlFor={field.id} className="text-sm font-medium mb-2 block text-white">
            {field.label}
          </Label>
          <Select
            value={String(field.value)}
            onValueChange={(value) => updateFieldValue(field.id, value)}
            disabled={!field.isEditable}
          >
            <SelectTrigger
              id={field.id}
              className={cn('w-full', getFieldBackgroundClass(field))}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      );
    }

    // Handle select type fields (same as dropdown)
    if (field.type === 'select' && field.options) {
      return (
        <>
          <Label htmlFor={field.id} className="text-sm font-medium mb-2 block text-white">
            {field.label}
          </Label>
          <Select
            value={String(field.value)}
            onValueChange={(value) => updateFieldValue(field.id, value)}
            disabled={!field.isEditable}
          >
            <SelectTrigger
              id={field.id}
              className={cn('w-full', getFieldBackgroundClass(field))}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      );
    }

    // Handle boolean/toggle fields
    if (field.type === 'boolean') {
      const isChecked = field.value === true || field.value === 'true' || field.value === 1;
      return (
        <div className="flex items-center gap-3 py-2">
          <button
            type="button"
            role="switch"
            aria-checked={isChecked}
            onClick={() => updateFieldValue(field.id, !isChecked)}
            disabled={!field.isEditable}
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800',
              isChecked ? 'bg-green-600' : 'bg-gray-600',
              !field.isEditable && 'opacity-50 cursor-not-allowed'
            )}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                isChecked ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
          <Label htmlFor={field.id} className="text-sm font-medium text-white cursor-pointer" onClick={() => field.isEditable && updateFieldValue(field.id, !isChecked)}>
            {field.label}
          </Label>
        </div>
      );
    }

    return (
      <>
        {field.placeholder && (
          <p className="text-sm text-red-400 mb-2 font-medium">
            {field.placeholder}
          </p>
        )}
        <Label htmlFor={field.id} className="text-sm font-medium mb-2 block text-white">
          {field.label}
        </Label>
        <Input
          id={field.id}
          type={field.type}
          value={String(field.value)}
          onChange={(e) => {
            const newValue = field.type === 'number'
              ? parseFloat(e.target.value) || 0
              : e.target.value;
            updateFieldValue(field.id, newValue);
          }}
          disabled={!field.isEditable}
          className={cn('w-full', getFieldBackgroundClass(field))}
        />
      </>
    );
  };

  const renderField = (field: ReportField) => {
    if (field.type === 'image') {
      return (
        <div key={field.id} className="mb-6">
          <ImageFieldEditor field={field} />
        </div>
      );
    }

    if (field.type === 'calculated') {
      return (
        <div key={field.id} className="mb-6">
          <CalculatedFieldDisplay field={field} />
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <div key={field.id} className="mb-6">
          <TextFieldEditor field={field} />
        </div>
      );
    }

    if (field.type === 'dropdown' && field.options) {
      return (
        <div key={field.id} className="mb-6">
          <Label htmlFor={field.id} className="text-sm font-medium mb-2 block text-white">
            {field.label}
          </Label>
          <Select
            value={String(field.value)}
            onValueChange={(value) => updateFieldValue(field.id, value)}
            disabled={!field.isEditable}
          >
            <SelectTrigger
              id={field.id}
              className={cn('w-full', getFieldBackgroundClass(field))}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    // Handle boolean/toggle fields in standalone render
    if (field.type === 'boolean') {
      const isChecked = field.value === true || field.value === 'true' || field.value === 1;
      return (
        <div key={field.id} className="mb-6">
          <div className="flex items-center gap-3 py-2">
            <button
              type="button"
              role="switch"
              aria-checked={isChecked}
              onClick={() => updateFieldValue(field.id, !isChecked)}
              disabled={!field.isEditable}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800',
                isChecked ? 'bg-green-600' : 'bg-gray-600',
                !field.isEditable && 'opacity-50 cursor-not-allowed'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  isChecked ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </button>
            <Label htmlFor={field.id} className="text-sm font-medium text-white cursor-pointer" onClick={() => field.isEditable && updateFieldValue(field.id, !isChecked)}>
              {field.label}
            </Label>
          </div>
        </div>
      );
    }

    return (
      <div key={field.id} className="mb-6">
        {field.placeholder && (
          <p className="text-sm text-red-400 mb-2 font-medium">
            {field.placeholder}
          </p>
        )}
        <Label htmlFor={field.id} className="text-sm font-medium mb-2 block text-white">
          {field.label}
        </Label>
        <Input
          id={field.id}
          type={field.type}
          value={String(field.value)}
          onChange={(e) => {
            const newValue = field.type === 'number'
              ? parseFloat(e.target.value) || 0
              : e.target.value;
            updateFieldValue(field.id, newValue);
          }}
          disabled={!field.isEditable}
          className={cn('w-full', getFieldBackgroundClass(field))}
        />
      </div>
    );
  };

  // Render subsection fields with optional row grouping layout
  const renderSubsectionFields = (subsection: ReportSubsection, isHomeSection: boolean) => {
    const layout = isHomeSection ? HOME_FIELD_LAYOUT[subsection.id] : undefined;

    if (layout) {
      // Render with row grouping
      return layout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-3 mb-4">
          {row.fields.map((fieldId, fieldIndex) => {
            const field = subsection.fields.find(f => f.id === fieldId);
            if (!field) return null;
            return (
              <div key={fieldId} style={{ width: row.widths[fieldIndex], minWidth: 0 }}>
                {renderFieldContent(field)}
              </div>
            );
          })}
        </div>
      ));
    }

    // Fallback: render fields normally (one per line)
    return subsection.fields.map(renderField);
  };

  const isHomeSection = currentSection.id === 'home';
  const approachToggleFields = isHomeSection ? getApproachToggleFields() : [];

  // Render approach toggle for the always-visible section
  const renderApproachToggle = (field: ReportField) => {
    const isChecked = field.value === true || field.value === 'true' || field.value === 1;
    return (
      <div key={field.id} className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={isChecked}
          onClick={() => updateFieldValue(field.id, !isChecked)}
          disabled={!field.isEditable}
          className={cn(
            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800',
            isChecked ? 'bg-green-600' : 'bg-gray-600',
            !field.isEditable && 'opacity-50 cursor-not-allowed'
          )}
        >
          <span
            className={cn(
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              isChecked ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </button>
        <Label
          htmlFor={field.id}
          className="text-sm font-medium text-white cursor-pointer"
          onClick={() => field.isEditable && updateFieldValue(field.id, !isChecked)}
        >
          {field.label}
        </Label>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#1f1f1f' }}>
      {/* Dark gray section header - matches preview panel */}
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
          {currentSection.name.toUpperCase()}
        </span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto p-6 text-white editor-panel-content" style={{ backgroundColor: '#1f1f1f' }}>
        <style>{`
          .editor-panel-content input:not([type="file"]),
          .editor-panel-content textarea,
          .editor-panel-content select {
            background-color: #2a2a2a !important;
            color: #ffffff !important;
            border-color: #4b5563 !important;
          }
          .editor-panel-content input::placeholder,
          .editor-panel-content textarea::placeholder {
            color: #9ca3af !important;
          }
        `}</style>

        {/* Valuation Approaches - Always visible at top of Home section */}
        {isHomeSection && approachToggleFields.length > 0 && (
          <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#2a2a2a' }}>
            <h3 className="text-white text-sm font-semibold mb-3">Valuation Approaches</h3>
            <div className="flex items-center gap-8">
              {approachToggleFields.map(renderApproachToggle)}
            </div>
          </div>
        )}

        {/* Home Test Data Button - Only show for HOME section */}
        {isHomeSection && (
          <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">Test Data</h4>
                <p className="text-sm text-gray-300">Load North Battleford sample data for Home fields</p>
              </div>
              <Button
                onClick={loadHomeTestData}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                <Database className="w-4 h-4 mr-2" />
                Load Test Data
              </Button>
            </div>
          </div>
        )}

        {/* Calculator Test Data Button - Only show for CALC section */}
        {currentSection.id === 'calc' && (
          <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">Calculator Test Mode</h4>
                <p className="text-sm text-gray-300">Load North Battleford sample data to verify calculations</p>
              </div>
              <Button
                onClick={loadCalcTestData}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Load Valcre Test Data
              </Button>
            </div>
          </div>
        )}

        {/* Cover Test Data Button - Only show for COVER section */}
        {currentSection.id === 'cover' && (
          <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">Test Data</h4>
                <p className="text-sm text-gray-300">Load North Battleford sample data for Cover fields</p>
              </div>
              <Button
                onClick={loadCoverTestData}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                <Database className="w-4 h-4 mr-2" />
                Load Test Data
              </Button>
            </div>
          </div>
        )}

        {/* Maps Test Data Button - Only show for MAPS section */}
        {currentSection.id === 'maps' && (
          <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">Test Data</h4>
                <p className="text-sm text-gray-300">Load North Battleford sample data for Maps fields</p>
              </div>
              <Button
                onClick={loadMapsTestData}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                <Database className="w-4 h-4 mr-2" />
                Load Test Data
              </Button>
            </div>
          </div>
        )}

        {/* Assignment Test Data Button - Only show for ASSIGNMENT section */}
        {currentSection.id === 'assignment' && (
          <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">Test Data</h4>
                <p className="text-sm text-gray-300">Load North Battleford sample data for Assignment fields</p>
              </div>
              <Button
                onClick={loadAssignmentTestData}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                <Database className="w-4 h-4 mr-2" />
                Load Test Data
              </Button>
            </div>
          </div>
        )}

        {/* Exec Test Data Button - Only show for EXEC section */}
        {currentSection.id === 'exec' && (
          <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">Test Data</h4>
                <p className="text-sm text-gray-300">Load North Battleford sample data for Executive Summary fields</p>
              </div>
              <Button
                onClick={loadExecTestData}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                <Database className="w-4 h-4 mr-2" />
                Load Test Data
              </Button>
            </div>
          </div>
        )}

        {/* Site Test Data Button - Only show for SITE section */}
        {currentSection.id === 'site' && (
          <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">Test Data</h4>
                <p className="text-sm text-gray-300">Load North Battleford sample data for Site Description fields</p>
              </div>
              <Button
                onClick={loadSiteTestData}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                <Database className="w-4 h-4 mr-2" />
                Load Test Data
              </Button>
            </div>
          </div>
        )}

        {/* Improvements Test Data Button - Only show for IMPV section */}
        {currentSection.id === 'impv' && (
          <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">Test Data</h4>
                <p className="text-sm text-gray-300">Load North Battleford sample data for Improvements fields</p>
              </div>
              <Button
                onClick={loadImprovementsTestData}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                <Database className="w-4 h-4 mr-2" />
                Load Test Data
              </Button>
            </div>
          </div>
        )}

        {/* Sales Test Data Button - Only show for SALES section */}
        {currentSection.id === 'sales' && (
          <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">Test Data</h4>
                <p className="text-sm text-gray-300">Load North Battleford sample data for Sales Comparison fields</p>
              </div>
              <Button
                onClick={loadSalesTestData}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                <Database className="w-4 h-4 mr-2" />
                Load Test Data
              </Button>
            </div>
          </div>
        )}

        {/* Income Test Data Button - Only show for INCOME section */}
        {currentSection.id === 'income' && (
          <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">Test Data</h4>
                <p className="text-sm text-gray-300">Load North Battleford sample data for Income Approach fields</p>
              </div>
              <Button
                onClick={loadIncomeTestData}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                <Database className="w-4 h-4 mr-2" />
                Load Test Data
              </Button>
            </div>
          </div>
        )}

        {/* Main section fields */}
        {currentSection.fields.length > 0 && (
          <div className="mb-8">
            {currentSection.fields.map(renderField)}
          </div>
        )}

        {/* Subsections as collapsible cards - skip approach-selection for Home since it's rendered above */}
        {currentSection.subsections?.filter(sub => !(isHomeSection && sub.id === 'approach-selection')).map((subsection) => {
          const isCollapsed = !expandedSubsections.has(subsection.id);

          return (
            <div
              key={subsection.id}
              className="mb-4 rounded-lg overflow-hidden"
              style={{ border: '1px solid #3a3a3a' }}
            >
              {/* Clickable header */}
              <button
                type="button"
                onClick={() => toggleSubsection(subsection.id)}
                className="w-full flex items-center justify-between px-4 py-3 transition-colors cursor-pointer"
                style={{ backgroundColor: '#2a2a2a' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333333'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
              >
                <span className="font-semibold text-sm text-white">
                  {subsection.title}
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    isCollapsed && "-rotate-90"
                  )}
                  style={{ color: '#888888' }}
                />
              </button>

              {/* Collapsible content */}
              <div
                className={cn(
                  "transition-all duration-200 ease-in-out overflow-hidden",
                  isCollapsed ? "max-h-0 opacity-0" : "max-h-[5000px] opacity-100"
                )}
              >
                <div className="p-4" style={{ backgroundColor: '#252525' }}>
                  {renderSubsectionFields(subsection, isHomeSection)}
                </div>
              </div>
            </div>
          );
        })}

        {/* Related Images from Image Management */}
        {relatedImages.length > 0 && (
          <div className="mb-8">
            <div className="text-white px-0 py-2 font-semibold text-sm mb-4 flex items-center gap-2 border-b border-[#4b5563]">
              <ImageIcon className="w-4 h-4" />
              SECTION IMAGES
            </div>
            <p className="text-xs text-gray-300 mb-4 px-2">
              Images for this section (managed in S3 IMAGE MGT)
            </p>
            <div className="grid grid-cols-2 gap-4 pl-2">
              {relatedImages.map(renderField)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
