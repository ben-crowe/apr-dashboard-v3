import { useState } from 'react';
import { useReportBuilderStore } from '../../store/reportBuilderStore';
import { cn } from '@/lib/utils';
import TextFieldEditor from './TextFieldEditor';
import ImageFieldEditor from './ImageFieldEditor';
import CalculatedFieldDisplay from './CalculatedFieldDisplay';
import { ReportField, ReportSubsection } from '../../types/reportBuilder.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image as ImageIcon, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Calculator panel imports for CALC section
import { ThemeProvider } from '@/features/calculator-demo-v4/context/ThemeContext';
import IncomeApproachPanel from '@/features/calculator-demo-v4/components/IncomeApproachPanel';
import SalesComparisonPanel from '@/features/calculator-demo-v4/components/SalesComparisonPanel';
import OperatingHistoryPanel from '@/features/calculator-demo-v4/components/OperatingHistoryPanel';
import ReconciliationPanel from '@/features/calculator-demo-v4/components/ReconciliationPanel';

// HomeTabPanel for HOME section
import { HomeTabPanel } from '../HomeTabPanel';

// SiteTabPanel for SITE section
import { SiteTabPanel } from '../SiteTabPanel';

// ImprovementsTabPanel for IMPV section
import { ImprovementsTabPanel } from '../ImprovementsTabPanel';

// IncomeTabPanel for INCOME section
import { IncomeTabPanel } from '../IncomeTabPanel';

// SalesTabPanel for SALES section
import { SalesTabPanel } from '../SalesTabPanel';

// CostTabPanel for COST section
import { CostTabPanel } from '../CostTabPanel';

// ReconTabPanel for RECON section
import { ReconTabPanel } from '../ReconTabPanel';

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

// HOME TAB - Uses field IDs that match template placeholders
// Verified against: Report-MF-template.html and fieldRegistry.ts
const HOME_FIELD_LAYOUT: Record<string, SubsectionLayout> = {
  'job-setup': [
    { fields: ['job-number', 'report-date'], widths: ['50%', '50%'] },
  ],
  'client-info': [
    // Template uses {{client-full-name}} - calculated from first+last
    { fields: ['client-first-name', 'client-last-name'], widths: ['50%', '50%'] },
    { fields: ['client-full-name'], widths: ['100%'] },  // Calculated field for template
    { fields: ['client-organization'], widths: ['100%'] },
    { fields: ['client-email', 'client-phone'], widths: ['50%', '50%'] },
    { fields: ['client-address'], widths: ['100%'] },
    { fields: ['client-city', 'client-province', 'client-postal'], widths: ['40%', '30%', '30%'] },
  ],
  'appraiser-info': [
    { fields: ['appraiser-name', 'appraiser-credentials'], widths: ['50%', '50%'] },
    { fields: ['appraiser-aic', 'appraiser-company'], widths: ['50%', '50%'] },
    { fields: ['appraiser-email', 'appraiser-phone'], widths: ['50%', '50%'] },
  ],
  'property-info': [
    { fields: ['property-name'], widths: ['100%'] },
    { fields: ['property-address'], widths: ['100%'] },
    { fields: ['property-type'], widths: ['50%'] },
    // Template uses {{report-legal}} not {{legal-description}}
    { fields: ['report-legal'], widths: ['100%'] },
  ],
  'assignment-details': [
    { fields: ['report-type', 'property-rights'], widths: ['50%', '50%'] },
    // Template uses {{report-intendeduse}} and {{report-intendeduser}}
    { fields: ['report-intendeduse', 'report-intendeduser'], widths: ['50%', '50%'] },
    { fields: ['scope-of-work'], widths: ['100%'] },
  ],
  'subject-contact': [
    { fields: ['contact-first-name', 'contact-last-name'], widths: ['50%', '50%'] },
    { fields: ['contact-phone', 'contact-email'], widths: ['50%', '50%'] },
    { fields: ['valuation-date'], widths: ['50%'] },
  ],
  'assumptions-conditions': [
    // Template uses {{report-extraordinary}}, {{report-hypothetical}}, {{report-limcond}}
    { fields: ['report-extraordinary'], widths: ['100%'] },
    { fields: ['report-hypothetical'], widths: ['100%'] },
    { fields: ['report-limcond'], widths: ['100%'] },
  ],
  'transmittal-content': [
    { fields: ['transmittal-date'], widths: ['50%'] },
    { fields: ['transmittal-body'], widths: ['100%'] },
  ],
};

// Subsection display titles for HOME tab
const HOME_SUBSECTION_TITLES: Record<string, string> = {
  'job-setup': 'Job Setup',
  'client-info': 'Client Information',
  'appraiser-info': 'Appraiser Information',
  'property-info': 'Property Information',
  'assignment-details': 'Assignment Details',
  'subject-contact': 'Property Contact',
  'assumptions-conditions': 'Assumptions & Conditions',
  'transmittal-content': 'Letter of Transmittal',
};

// Layout configuration for Cover section field groupings
const COVER_FIELD_LAYOUT: Record<string, SubsectionLayout> = {
  'client-info': [
    { fields: ['client-contact-name', 'client-company'], widths: ['50%', '50%'] },
    { fields: ['client-address'], widths: ['100%'] },
    { fields: ['client-city', 'client-province', 'client-postal'], widths: ['40%', '30%', '30%'] },
  ],
  'appraiser-info': [
    { fields: ['appraiser-name', 'appraiser-credentials'], widths: ['50%', '50%'] },
    { fields: ['appraiser-title', 'appraiser-company'], widths: ['50%', '50%'] },
    { fields: ['appraiser-address'], widths: ['100%'] },
    { fields: ['appraiser-city', 'appraiser-phone'], widths: ['50%', '50%'] },
    { fields: ['appraiser-website', 'appraiser-email'], widths: ['50%', '50%'] },
    { fields: ['appraiser-aic-number'], widths: ['50%'] },
  ],
};

// Layout configuration for Maps section - images full width
const MAPS_FIELD_LAYOUT: Record<string, SubsectionLayout> = {
  'location-maps': [
    { fields: ['img-map-regional'], widths: ['100%'] },
    { fields: ['img-map-local'], widths: ['100%'] },
  ],
  'aerial-maps': [
    { fields: ['img-map-aerial-1'], widths: ['100%'] },
    { fields: ['img-map-aerial-2'], widths: ['100%'] },
    { fields: ['img-zoning-map'], widths: ['100%'] },
  ],
  'site-plans': [
    { fields: ['img-site-plan-1'], widths: ['100%'] },
    { fields: ['img-site-plan-2'], widths: ['100%'] },
  ],
};

// Layout configuration for Assignment section
const ASSIGNMENT_FIELD_LAYOUT: Record<string, SubsectionLayout> = {
  'assignment-property-id': [
    { fields: ['assignment-property-legal'], widths: ['100%'] },
    { fields: ['assignment-property-address'], widths: ['100%'] },
    { fields: ['assignment-property-type', 'assignment-property-interest'], widths: ['50%', '50%'] },
  ],
  'assignment-client': [
    { fields: ['assignment-client-name'], widths: ['100%'] },
    { fields: ['assignment-client-address'], widths: ['100%'] },
    { fields: ['assignment-intended-use'], widths: ['100%'] },
    { fields: ['assignment-intended-users'], widths: ['100%'] },
  ],
  'assignment-scope': [
    { fields: ['assignment-inspection-date', 'assignment-inspection-type'], widths: ['50%', '50%'] },
    { fields: ['assignment-inspector-name'], widths: ['50%'] },
    { fields: ['assignment-data-sources'], widths: ['100%'] },
    { fields: ['assignment-analysis-methods'], widths: ['100%'] },
  ],
  'assignment-dates': [
    { fields: ['assignment-effective-date', 'assignment-report-date'], widths: ['50%', '50%'] },
  ],
  'assignment-conditions': [
    { fields: ['assignment-hypothetical'], widths: ['100%'] },
    { fields: ['assignment-extraordinary-assumptions'], widths: ['100%'] },
    { fields: ['assignment-general-assumptions'], widths: ['100%'] },
    { fields: ['assignment-limiting-conditions'], widths: ['100%'] },
  ],
};

// Layout configuration for Exec section
const EXEC_FIELD_LAYOUT: Record<string, SubsectionLayout> = {
  'property-identification': [
    { fields: ['value-scenario', 'property-rights'], widths: ['50%', '50%'] },
    { fields: ['building-style', 'total-buildings'], widths: ['50%', '50%'] },
    { fields: ['total-nra', 'total-units'], widths: ['50%', '50%'] },
    { fields: ['year-built', 'occupancy-rate'], widths: ['50%', '50%'] },
    { fields: ['stories', 'building-format'], widths: ['50%', '50%'] },
  ],
  'value-summary': [
    { fields: ['concluded-value'], widths: ['100%'] },
    { fields: ['hypothetical-conditions'], widths: ['100%'] },
    { fields: ['extraordinary-assumptions'], widths: ['100%'] },
    { fields: ['extraordinary-limiting-conditions'], widths: ['100%'] },
  ],
};

// Layout configuration for Site section
const SITE_FIELD_LAYOUT: Record<string, SubsectionLayout> = {
  'site-area': [
    { fields: ['site-total-area', 'site-acreage'], widths: ['50%', '50%'] },
    { fields: ['site-address'], widths: ['100%'] },
    { fields: ['site-shape', 'topography', 'accessibility'], widths: ['33.33%', '33.33%', '33.33%'] },
    { fields: ['exposure-visibility'], widths: ['100%'] },
  ],
  'adjacent-uses': [
    { fields: ['adjacent-north', 'adjacent-south'], widths: ['50%', '50%'] },
    { fields: ['adjacent-east', 'adjacent-west'], widths: ['50%', '50%'] },
  ],
  'site-conditions': [
    { fields: ['easements'], widths: ['100%'] },
    { fields: ['soils'], widths: ['100%'] },
    { fields: ['hazardous-waste'], widths: ['100%'] },
    { fields: ['site-rating'], widths: ['100%'] },
    { fields: ['site-conclusion'], widths: ['100%'] },
  ],
  'site-plan-images': [
    { fields: ['site-plan-image'], widths: ['100%'] },
  ],
};

// Layout configuration for Impv (Improvements) section
const IMPV_FIELD_LAYOUT: Record<string, SubsectionLayout> = {
  'building-overview': [
    { fields: ['impv-overview'], widths: ['100%'] },
    { fields: ['impv-num-buildings', 'impv-nra'], widths: ['50%', '50%'] },
    { fields: ['impv-year-built', 'impv-num-units'], widths: ['50%', '50%'] },
    { fields: ['impv-stories', 'impv-building-format'], widths: ['50%', '50%'] },
  ],
  'amenities': [
    { fields: ['project-amenities'], widths: ['100%'] },
    { fields: ['unit-amenities'], widths: ['100%'] },
    { fields: ['laundry'], widths: ['100%'] },
    { fields: ['security'], widths: ['100%'] },
  ],
  'construction': [
    { fields: ['foundation', 'exterior-walls', 'roof'], widths: ['33.33%', '33.33%', '33.33%'] },
    { fields: ['impv-roof-condition', 'impv-insulation', 'elevator'], widths: ['33.33%', '33.33%', '33.33%'] },
  ],
  'systems': [
    { fields: ['hvac', 'electrical'], widths: ['50%', '50%'] },
    { fields: ['plumbing', 'fire-protection'], widths: ['50%', '50%'] },
  ],
  'finishes': [
    { fields: ['interior-walls', 'ceilings'], widths: ['50%', '50%'] },
    { fields: ['flooring', 'doors-windows'], widths: ['50%', '50%'] },
    { fields: ['impv-interior-finish'], widths: ['100%'] },
  ],
  'site-improvements': [
    { fields: ['site-impv'], widths: ['100%'] },
    { fields: ['landscaping'], widths: ['100%'] },
    { fields: ['parking-spaces', 'parking-ratio'], widths: ['50%', '50%'] },
    { fields: ['impv-building-footprint', 'impv-site-coverage'], widths: ['50%', '50%'] },
  ],
  'condition': [
    { fields: ['overall-condition'], widths: ['100%'] },
    { fields: ['functional-design'], widths: ['100%'] },
    { fields: ['hazardous-materials'], widths: ['100%'] },
  ],
};

// Layout configuration for Sales section
const SALES_FIELD_LAYOUT: Record<string, SubsectionLayout> = {
  'subject-summary': [
    { fields: ['subject-units', 'subject-gba', 'subject-year'], widths: ['33.33%', '33.33%', '33.33%'] },
    { fields: ['subject-site-area', 'subject-parking', 'subject-condition'], widths: ['33.33%', '33.33%', '33.33%'] },
  ],
  'sale-comp-1': [
    { fields: ['comp1-name', 'comp1-address'], widths: ['50%', '50%'] },
    { fields: ['comp1-sale-date', 'comp1-sale-price'], widths: ['50%', '50%'] },
    { fields: ['comp1-units', 'comp1-price-per-unit'], widths: ['50%', '50%'] },
    { fields: ['comp1-gba', 'comp1-price-per-sf'], widths: ['50%', '50%'] },
    { fields: ['comp1-year', 'comp1-cap-rate'], widths: ['50%', '50%'] },
    { fields: ['comp1-adj-property-rights', 'comp1-adj-financing'], widths: ['50%', '50%'] },
    { fields: ['comp1-adj-conditions-sale', 'comp1-adj-market-time'], widths: ['50%', '50%'] },
    { fields: ['comp1-adj-location', 'comp1-adj-size'], widths: ['50%', '50%'] },
    { fields: ['comp1-adj-age-condition', 'comp1-adj-other'], widths: ['50%', '50%'] },
  ],
  'sale-comp-2': [
    { fields: ['comp2-name', 'comp2-address'], widths: ['50%', '50%'] },
    { fields: ['comp2-sale-date', 'comp2-sale-price'], widths: ['50%', '50%'] },
    { fields: ['comp2-units', 'comp2-price-per-unit'], widths: ['50%', '50%'] },
    { fields: ['comp2-gba', 'comp2-price-per-sf'], widths: ['50%', '50%'] },
    { fields: ['comp2-year', 'comp2-cap-rate'], widths: ['50%', '50%'] },
    { fields: ['comp2-adj-property-rights', 'comp2-adj-financing'], widths: ['50%', '50%'] },
    { fields: ['comp2-adj-conditions-sale', 'comp2-adj-market-time'], widths: ['50%', '50%'] },
    { fields: ['comp2-adj-location', 'comp2-adj-size'], widths: ['50%', '50%'] },
    { fields: ['comp2-adj-age-condition', 'comp2-adj-other'], widths: ['50%', '50%'] },
  ],
  'sale-comp-3': [
    { fields: ['comp3-name', 'comp3-address'], widths: ['50%', '50%'] },
    { fields: ['comp3-sale-date', 'comp3-sale-price'], widths: ['50%', '50%'] },
    { fields: ['comp3-units', 'comp3-price-per-unit'], widths: ['50%', '50%'] },
    { fields: ['comp3-gba', 'comp3-price-per-sf'], widths: ['50%', '50%'] },
    { fields: ['comp3-year', 'comp3-cap-rate'], widths: ['50%', '50%'] },
    { fields: ['comp3-adj-property-rights', 'comp3-adj-financing'], widths: ['50%', '50%'] },
    { fields: ['comp3-adj-conditions-sale', 'comp3-adj-market-time'], widths: ['50%', '50%'] },
    { fields: ['comp3-adj-location', 'comp3-adj-size'], widths: ['50%', '50%'] },
    { fields: ['comp3-adj-age-condition', 'comp3-adj-other'], widths: ['50%', '50%'] },
  ],
  'sales-conclusion': [
    { fields: ['sales-value-indication'], widths: ['100%'] },
    { fields: ['sales-adjustment-summary'], widths: ['100%'] },
  ],
};

// Layout configuration for Income section
const INCOME_FIELD_LAYOUT: Record<string, SubsectionLayout> = {
  'income-potential': [
    { fields: ['income-pgi-narrative'], widths: ['100%'] },
  ],
  'income-expenses': [
    { fields: ['income-expense-narrative'], widths: ['100%'] },
  ],
  'income-noi': [
    { fields: ['income-noi-narrative'], widths: ['100%'] },
  ],
  'income-analysis': [
    { fields: ['income-cap-rate-analysis'], widths: ['100%'] },
    { fields: ['income-value-indication'], widths: ['100%'] },
  ],
};

// Combined section layouts for all sections
const SECTION_FIELD_LAYOUTS: Record<string, Record<string, SubsectionLayout>> = {
  'home': HOME_FIELD_LAYOUT,
  'cover': COVER_FIELD_LAYOUT,
  'maps': MAPS_FIELD_LAYOUT,
  'assignment': ASSIGNMENT_FIELD_LAYOUT,
  'exec': EXEC_FIELD_LAYOUT,
  'site': SITE_FIELD_LAYOUT,
  'impv': IMPV_FIELD_LAYOUT,
  'sales': SALES_FIELD_LAYOUT,
  'income': INCOME_FIELD_LAYOUT,
};

// Approach toggle field IDs - these are rendered separately at top of Home section
// TODO: Add these fields to the store when approach selection is needed
const APPROACH_TOGGLE_IDS: string[] = [
  'home-use-income-approach',
  'home-use-sales-approach',
  'home-use-cost-approach',
];

export default function EditPanel() {
  const {
    sections,
    activeSection,
    updateFieldValue,
  } = useReportBuilderStore();

  // Track which subsections are EXPANDED (empty = all collapsed by default)
  const [expandedSubsections, setExpandedSubsections] = useState<Set<string>>(new Set());

  // State for calculator panel value tracking (CALC section)
  const [incomeValue, setIncomeValue] = useState(0);
  const [salesValue, setSalesValue] = useState(0);

  // Track if all subsections are expanded
  const [allExpanded, setAllExpanded] = useState(false);

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

  // Toggle all subsections expanded/collapsed
  const toggleAllSubsections = () => {
    if (allExpanded) {
      // Collapse all
      setExpandedSubsections(new Set());
      setAllExpanded(false);
    } else {
      // Expand all - get all subsection IDs for current section
      const currentSect = sections.find((s) => s.id === activeSection);
      if (currentSect) {
        const isHome = currentSect.id === 'home';
        const subsectionIds = isHome
          ? Object.keys(HOME_FIELD_LAYOUT)
          : (currentSect.subsections || []).map(s => s.id);
        setExpandedSubsections(new Set(subsectionIds));
        setAllExpanded(true);
      }
    }
  };

  const currentSection = sections.find((s) => s.id === activeSection);
  const imageMgtSection = sections.find((s) => s.id === 'image-mgt');

  // Look up a field by ID across ALL sections in the store
  const findFieldById = (fieldId: string): ReportField | undefined => {
    for (const section of sections) {
      // Check main fields
      for (const field of section.fields || []) {
        if (field.id === fieldId) return field;
      }
      // Check subsection fields
      for (const sub of section.subsections || []) {
        for (const field of sub.fields || []) {
          if (field.id === fieldId) return field;
        }
      }
    }
    return undefined;
  };

  // Build HOME tab subsections from hardcoded layout (fields live in other sections)
  const buildHomeSubsections = (): ReportSubsection[] => {
    const subsections: ReportSubsection[] = [];

    for (const [subsectionId, layout] of Object.entries(HOME_FIELD_LAYOUT)) {
      // Collect all field IDs from the layout rows
      const fieldIds = layout.flatMap(row => row.fields);

      // Look up each field from the store
      const fields: ReportField[] = [];
      for (const fieldId of fieldIds) {
        const field = findFieldById(fieldId);
        if (field) {
          fields.push(field);
        } else {
          // Create placeholder for missing fields
          fields.push({
            id: fieldId,
            label: fieldId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            type: 'text',
            value: '',
            isEditable: true,
            inputType: 'user-input',
          });
        }
      }

      subsections.push({
        id: subsectionId,
        title: HOME_SUBSECTION_TITLES[subsectionId] || subsectionId,
        fields,
      });
    }

    return subsections;
  };

  // Get approach toggle fields - looks up from all sections now
  const getApproachToggleFields = (): ReportField[] => {
    const toggleFields: ReportField[] = [];

    for (const toggleId of APPROACH_TOGGLE_IDS) {
      const field = findFieldById(toggleId);
      if (field) {
        toggleFields.push(field);
      }
    }

    return toggleFields;
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
  // Uses SECTION_FIELD_LAYOUTS to get layout for any section (not just home)
  const renderSubsectionFields = (subsection: ReportSubsection, sectionId: string) => {
    const sectionLayout = SECTION_FIELD_LAYOUTS[sectionId];
    const layout = sectionLayout?.[subsection.id];

    if (layout) {
      // Render with row grouping - fields on same row share horizontal space
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

    // Fallback: render fields in 2-column grid for short fields, full width for textareas
    return (
      <div className="grid grid-cols-2 gap-3">
        {subsection.fields.map(field => {
          const isWideField = field.type === 'textarea' || field.type === 'image' ||
                              field.label?.toLowerCase().includes('description') ||
                              field.label?.toLowerCase().includes('narrative') ||
                              field.label?.toLowerCase().includes('address');
          return (
            <div key={field.id} className={isWideField ? 'col-span-2' : ''}>
              {renderField(field)}
            </div>
          );
        })}
      </div>
    );
  };

  const isHomeSection = currentSection.id === 'home';
  const isSiteSection = currentSection.id === 'site';
  const isImpvSection = currentSection.id === 'impv';
  const isIncomeSection = currentSection.id === 'income';
  const isSalesSection = currentSection.id === 'sales';
  const isCostSection = currentSection.id === 'cost-s';
  const isCalcSection = currentSection.id === 'calc';
  const isReconSection = currentSection.id === 'recon';

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#1f1f1f' }}>
      {/* Section header */}
      <div style={{
        backgroundColor: 'transparent',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #4b5563'
      }}>
        <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '15px' }}>
          {currentSection.name.toUpperCase()}
        </span>
        {/* Expand/Collapse All button - hide for sections with their own controls */}
        {!isHomeSection && !isSiteSection && !isImpvSection && !isIncomeSection && !isSalesSection && !isCostSection && !isReconSection && (
          <button
            type="button"
            onClick={toggleAllSubsections}
            className="p-1 rounded hover:bg-gray-700 transition-colors"
            title={allExpanded ? 'Collapse all sections' : 'Expand all sections'}
          >
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                allExpanded ? "rotate-180" : "-rotate-90"
              )}
              style={{ color: '#888888' }}
            />
          </button>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto text-white editor-panel-content" style={{ backgroundColor: '#1f1f1f' }}>
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

        {/* HOME Section - Render HomeTabPanel component */}
        {isHomeSection && (
          <HomeTabPanel />
        )}

        {/* SITE Section - Render SiteTabPanel component */}
        {isSiteSection && (
          <SiteTabPanel />
        )}

        {/* IMPV Section - Render ImprovementsTabPanel component */}
        {isImpvSection && (
          <ImprovementsTabPanel />
        )}

        {/* INCOME Section - Render IncomeTabPanel component */}
        {isIncomeSection && (
          <IncomeTabPanel />
        )}

        {/* SALES Section - Render SalesTabPanel component */}
        {isSalesSection && (
          <SalesTabPanel />
        )}

        {/* COST Section - Render CostTabPanel component */}
        {isCostSection && (
          <CostTabPanel />
        )}

        {/* RECON Section - Render ReconTabPanel component */}
        {isReconSection && (
          <ReconTabPanel />
        )}

        {/* Calculator Table Panels - Only show for CALC section */}
        {isCalcSection && (
          <div className="p-6">
            <ThemeProvider>
              <div className="space-y-6 mb-6">
                <div className="text-white px-0 py-2 font-semibold text-sm mb-2 border-b border-[#4b5563]">
                  CALCULATOR TABLES
                </div>
                <OperatingHistoryPanel />
                <IncomeApproachPanel onValueChange={setIncomeValue} />
                <SalesComparisonPanel onIndicatedValueChange={setSalesValue} />
                <ReconciliationPanel
                  incomeValue={incomeValue}
                  salesIndicatedValue={salesValue}
                  costValue={0}
                />
              </div>
            </ThemeProvider>
          </div>
        )}

        {/* Non-Home, Non-Site, Non-Impv, Non-Income, Non-Sales, Non-Cost, Non-Recon, Non-Calc sections - render standard fields and subsections */}
        {!isHomeSection && !isSiteSection && !isImpvSection && !isIncomeSection && !isSalesSection && !isCostSection && !isReconSection && !isCalcSection && (
          <div className="p-6">
            {/* Main section fields */}
            {currentSection.fields.length > 0 && (
              <div className="mb-8">
                {currentSection.fields.map(renderField)}
              </div>
            )}

            {/* Subsections as collapsible cards */}
            {(currentSection.subsections || []).map((subsection) => {
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
                      {renderSubsectionFields(subsection, currentSection.id)}
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
        )}
      </div>
    </div>
  );
}
