/**
 * HomeTabPanel.tsx
 * Renders the HOME tab matching the wireframe layout exactly
 * 12 collapsible sections with dark theme styling
 */

import { useState, useCallback, useMemo, ChangeEvent } from 'react';
import { useReportBuilderStore } from '../../store/reportBuilderStore';
import { fieldRegistry } from '../../schema/fieldRegistry';
import './HomeTabPanel.css';

// Province options for dropdowns
const PROVINCES = ['', 'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];

// Rating options
const RATINGS = ['', 'Excellent', 'Good', 'Average', 'Fair', 'Poor'];

// Adjacent property types
const ADJACENT_TYPES = ['', 'Residential', 'Commercial', 'Industrial', 'Vacant', 'Park', 'Road'];

// Deed types
const DEED_TYPES = ['', 'Warranty', 'Quitclaim', 'Special Warranty', 'Trustee'];

// All section IDs for expand/collapse all functionality
const ALL_SECTION_IDS = [
  'job-setup',
  'appraisal-firm',
  'client-info',
  'appraisers',
  'key-dates',
  'valuation-scenario',
  'subject-property',
  'qualitative-ratings',
  'transaction-history',
  'conditions',
  'letter-of-transmittal'
];

// Get field options from registry if available
const getFieldOptions = (fieldId: string): string[] => {
  const field = fieldRegistry.find(f => f.id === fieldId);
  return field?.options || [];
};

// Collapsible Section Component
interface CollapsibleSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isCollapsed: boolean;
  onToggle: () => void;
}

function CollapsibleSection({ id, title, children, isCollapsed, onToggle }: CollapsibleSectionProps) {
  return (
    <div className={`section ${isCollapsed ? 'collapsed' : ''}`} id={id}>
      <div className="section-header" onClick={onToggle}>
        <h3>{title}</h3>
        <div className="collapse-icon">&#9660;</div>
      </div>
      <div className="section-content">
        {children}
      </div>
    </div>
  );
}

// Toggle Switch Component
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

function ToggleSwitch({ checked, onChange, label, disabled = false }: ToggleSwitchProps) {
  return (
    <div className="approach-item">
      <label className="toggle">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <span className="toggle-slider"></span>
      </label>
      {label && <span>{label}</span>}
    </div>
  );
}

// Form Toggle Row Component
interface ToggleRowProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

function ToggleRow({ checked, onChange, label }: ToggleRowProps) {
  return (
    <div className="toggle-row">
      <label className="toggle">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="toggle-slider"></span>
      </label>
      <span>{label}</span>
    </div>
  );
}

export default function HomeTabPanel() {
  const { sections, updateFieldValue, initializeMockData } = useReportBuilderStore();

  // Track collapsed state for each section
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  // Toggle section collapse
  const toggleSection = useCallback((sectionId: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  // Check if all sections are collapsed
  const allCollapsed = useMemo(() => {
    return ALL_SECTION_IDS.every(id => collapsedSections.has(id));
  }, [collapsedSections]);

  // Expand all sections
  const expandAll = useCallback(() => {
    setCollapsedSections(new Set());
  }, []);

  // Collapse all sections
  const collapseAll = useCallback(() => {
    setCollapsedSections(new Set(ALL_SECTION_IDS));
  }, []);

  // Toggle all sections
  const toggleAllSections = useCallback(() => {
    if (allCollapsed) {
      expandAll();
    } else {
      collapseAll();
    }
  }, [allCollapsed, expandAll, collapseAll]);

  // Handle reset form - reinitialize from registry
  const handleResetForm = useCallback(() => {
    if (window.confirm('Are you sure you want to reset the form? All changes will be lost.')) {
      initializeMockData();
    }
  }, [initializeMockData]);

  // Handle save changes (placeholder - actual save logic depends on your backend)
  const handleSaveChanges = useCallback(() => {
    // TODO: Implement actual save logic
    console.log('Saving changes...', sections);
    alert('Changes saved successfully!');
  }, [sections]);

  // Get field value from store
  const getValue = useCallback((fieldId: string): string | number | boolean => {
    for (const section of sections) {
      for (const field of section.fields || []) {
        if (field.id === fieldId) return field.value;
      }
      for (const sub of section.subsections || []) {
        for (const field of sub.fields || []) {
          if (field.id === fieldId) return field.value;
        }
      }
    }
    return '';
  }, [sections]);

  // Update field in store
  const handleChange = useCallback((fieldId: string, value: string | number | boolean) => {
    updateFieldValue(fieldId, value);
  }, [updateFieldValue]);

  // Input change handler
  const onInputChange = useCallback((fieldId: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    handleChange(fieldId, e.target.value);
  }, [handleChange]);

  // Toggle change handler
  const onToggleChange = useCallback((fieldId: string) => (checked: boolean) => {
    handleChange(fieldId, checked);
  }, [handleChange]);

  // Valuation Approaches state
  const useIncome = getValue('home-use-income-approach') === true;
  const useSales = getValue('home-use-sales-approach') === true;
  const useCost = getValue('home-use-cost-approach') === true;
  const useDCF = getValue('use-dcf') === true;
  const useLandDC = getValue('use-land-dc') === true;

  return (
    <div className="home-tab-panel">
      <div className="home-tab-container">
        {/* Header Row with Expand/Collapse All and Save/Reset buttons */}
        <div className="home-header-row">
          <div className="header-left">
            <button
              className="btn btn-secondary"
              onClick={toggleAllSections}
              title={allCollapsed ? 'Expand All Sections' : 'Collapse All Sections'}
            >
              {allCollapsed ? 'Expand All' : 'Collapse All'}
            </button>
          </div>
          <div className="header-right">
            <button
              className="btn btn-secondary"
              onClick={handleResetForm}
            >
              Reset Form
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* 1. VALUATION APPROACHES - Always visible */}
        <div className="approaches-bar">
          <h2>Valuation Approaches</h2>
          <div className="approach-toggles">
            <ToggleSwitch
              checked={useIncome}
              onChange={onToggleChange('home-use-income-approach')}
              label="Income"
            />
            <ToggleSwitch
              checked={useSales}
              onChange={onToggleChange('home-use-sales-approach')}
              label="Sales Comp"
            />
            <ToggleSwitch
              checked={useCost}
              onChange={onToggleChange('home-use-cost-approach')}
              label="Cost"
            />
            <ToggleSwitch
              checked={useDCF}
              onChange={onToggleChange('use-dcf')}
              label="DCF"
            />
            <ToggleSwitch
              checked={useLandDC}
              onChange={onToggleChange('use-land-dc')}
              label="Land/Site DC"
            />
          </div>
          <div className="approach-config">
            <label>Sale/Lease Config:</label>
            <select
              value={String(getValue('sale-lease-config') || '$/Unit')}
              onChange={onInputChange('sale-lease-config')}
            >
              <option>$/Unit</option>
              <option>$/SF</option>
              <option>$/Month</option>
            </select>
          </div>
        </div>

        {/* 2. JOB SETUP */}
        <CollapsibleSection
          id="job-setup"
          title="Job Setup"
          isCollapsed={collapsedSections.has('job-setup')}
          onToggle={() => toggleSection('job-setup')}
        >
          <div className="form-grid form-grid-4">
            <div className="form-group">
              <label>Job ID</label>
              <input
                type="text"
                value={String(getValue('job-number') || '')}
                onChange={onInputChange('job-number')}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Property Type</label>
              <select
                value={String(getValue('property-type') || '')}
                onChange={onInputChange('property-type')}
              >
                {getFieldOptions('property-type').map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Property Subtype</label>
              <select
                value={String(getValue('property-subtype') || '')}
                onChange={onInputChange('property-subtype')}
              >
                <option>Apartment</option>
                <option>MURB</option>
                <option>Condo</option>
                <option>Townhouse</option>
                <option>Mixed-Use</option>
              </select>
            </div>
            <div className="form-group">
              <label>Valuation Type</label>
              <select
                value={String(getValue('value-scenario') || '')}
                onChange={onInputChange('value-scenario')}
              >
                {getFieldOptions('value-scenario').map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Rental Units</label>
              <input
                type="number"
                value={String(getValue('total-units') || '')}
                onChange={onInputChange('total-units')}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Occupancy Status</label>
              <select
                value={String(getValue('occupancy-status') || '')}
                onChange={onInputChange('occupancy-status')}
              >
                <option>Multi-Tenant</option>
                <option>Single-Tenant</option>
                <option>Owner-Occupied</option>
                <option>Vacant</option>
              </select>
            </div>
            <div className="form-group span-2">
              <label>Property Description Prefix</label>
              <textarea
                placeholder="e.g., The subject property is a..."
                value={String(getValue('property-description-prefix') || '')}
                onChange={onInputChange('property-description-prefix')}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* 3. APPRAISAL FIRM */}
        <CollapsibleSection
          id="appraisal-firm"
          title="Appraisal Firm"
          isCollapsed={collapsedSections.has('appraisal-firm')}
          onToggle={() => toggleSection('appraisal-firm')}
        >
          <div className="form-grid form-grid-4">
            <div className="form-group span-2">
              <label>Company Name</label>
              <input
                type="text"
                value={String(getValue('company-name') || '')}
                onChange={onInputChange('company-name')}
              />
            </div>
            <div className="form-group">
              <label>Report Type</label>
              <select
                value={String(getValue('report-type') || '')}
                onChange={onInputChange('report-type')}
              >
                {getFieldOptions('report-type').map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Appraisal Status</label>
              <select
                value={String(getValue('appraisal-status') || '')}
                onChange={onInputChange('appraisal-status')}
              >
                <option>Fully Detailed</option>
                <option>Summary</option>
                <option>Restricted</option>
              </select>
            </div>
            <div className="form-group span-2">
              <label>Address</label>
              <input
                type="text"
                placeholder="Street Address"
                value={String(getValue('company-address') || '')}
                onChange={onInputChange('company-address')}
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={String(getValue('appraiser-city') || '')}
                onChange={onInputChange('appraiser-city')}
              />
            </div>
            <div className="form-group">
              <label>Province / Postal</label>
              <input
                type="text"
                placeholder="AB T2P 1J9"
                value={String(getValue('company-city-state-zip') || '')}
                onChange={onInputChange('company-city-state-zip')}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                placeholder="(403) 555-0100"
                value={String(getValue('company-phone') || '')}
                onChange={onInputChange('company-phone')}
              />
            </div>
            <div className="form-group span-2">
              <label>Email</label>
              <input
                type="email"
                placeholder="info@company.com"
                value={String(getValue('company-email') || '')}
                onChange={onInputChange('company-email')}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* 4. CLIENT INFORMATION */}
        <CollapsibleSection
          id="client-info"
          title="Client Information"
          isCollapsed={collapsedSections.has('client-info')}
          onToggle={() => toggleSection('client-info')}
        >
          <div className="form-grid form-grid-4">
            <div className="form-group">
              <label>Client Name</label>
              <input
                type="text"
                value={String(getValue('client-full-name') || '')}
                onChange={onInputChange('client-full-name')}
              />
            </div>
            <div className="form-group">
              <label>Organization</label>
              <input
                type="text"
                value={String(getValue('client-organization') || '')}
                onChange={onInputChange('client-organization')}
              />
            </div>
            <div className="form-group">
              <label>Contact Person</label>
              <input
                type="text"
                value={String(getValue('client-first-name') || '')}
                onChange={onInputChange('client-first-name')}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={String(getValue('client-email') || '')}
                onChange={onInputChange('client-email')}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={String(getValue('client-phone') || '')}
                onChange={onInputChange('client-phone')}
              />
            </div>
            <div className="form-group span-2">
              <label>Address</label>
              <input
                type="text"
                value={String(getValue('client-address') || '')}
                onChange={onInputChange('client-address')}
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={String(getValue('client-city') || '')}
                onChange={onInputChange('client-city')}
              />
            </div>
            <div className="form-group">
              <label>Province</label>
              <select
                value={String(getValue('client-province') || '')}
                onChange={onInputChange('client-province')}
              >
                {PROVINCES.map(p => <option key={p} value={p}>{p || 'Select...'}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                value={String(getValue('client-postal') || '')}
                onChange={onInputChange('client-postal')}
              />
            </div>
            <div className="form-group">
              <label>Attention Line</label>
              <input
                type="text"
                placeholder="Attn:"
                value={String(getValue('client-attention') || '')}
                onChange={onInputChange('client-attention')}
              />
            </div>
            <div className="form-group">
              <label>Salutation</label>
              <input
                type="text"
                placeholder="Dear Mr./Ms."
                value={String(getValue('client-salutation') || '')}
                onChange={onInputChange('client-salutation')}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* 5. APPRAISERS */}
        <CollapsibleSection
          id="appraisers"
          title="Appraisers"
          isCollapsed={collapsedSections.has('appraisers')}
          onToggle={() => toggleSection('appraisers')}
        >
          {/* Primary Appraiser */}
          <div className="subsection">
            <div className="subsection-title">Primary Appraiser</div>
            <div className="form-grid form-grid-4">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={String(getValue('appraiser-name') || '')}
                  onChange={onInputChange('appraiser-name')}
                />
              </div>
              <div className="form-group">
                <label>Credentials</label>
                <input
                  type="text"
                  placeholder="AACI, P.App"
                  value={String(getValue('appraiser-credentials') || '')}
                  onChange={onInputChange('appraiser-credentials')}
                />
              </div>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Managing Partner"
                  value={String(getValue('appraiser-title') || '')}
                  onChange={onInputChange('appraiser-title')}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={String(getValue('appraiser-role') || 'Primary Appraiser')}
                  onChange={onInputChange('appraiser-role')}
                >
                  <option>Primary Appraiser</option>
                  <option>Co-Appraiser</option>
                  <option>Review Appraiser</option>
                </select>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={String(getValue('appraiser-phone') || '')}
                  onChange={onInputChange('appraiser-phone')}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={String(getValue('appraiser-email') || '')}
                  onChange={onInputChange('appraiser-email')}
                />
              </div>
              <div className="form-group">
                <label>AIC License #</label>
                <input
                  type="text"
                  value={String(getValue('appraiser-aic') || '')}
                  onChange={onInputChange('appraiser-aic')}
                />
              </div>
              <div className="form-group">
                <label>License Expiry</label>
                <input
                  type="date"
                  value={String(getValue('appraiser-license-expiry') || '')}
                  onChange={onInputChange('appraiser-license-expiry')}
                />
              </div>
            </div>
            <div className="appraiser-extra-row">
              <div className="toggle-group">
                <ToggleRow
                  checked={getValue('appraiser1-inspected') === true}
                  onChange={onToggleChange('appraiser1-inspected')}
                  label="Inspected Property"
                />
                <ToggleRow
                  checked={getValue('appraiser1-all-units') === true}
                  onChange={onToggleChange('appraiser1-all-units')}
                  label="All Units Inspected"
                />
                <ToggleRow
                  checked={getValue('appraiser1-ce') === true}
                  onChange={onToggleChange('appraiser1-ce')}
                  label="CE Completed"
                />
                <ToggleRow
                  checked={getValue('appraiser1-ethics') === true}
                  onChange={onToggleChange('appraiser1-ethics')}
                  label="Ethics Completed"
                />
              </div>
              <div className="form-group">
                <label>Inspection Date</label>
                <input
                  type="date"
                  value={String(getValue('inspection-date-1') || '')}
                  onChange={onInputChange('inspection-date-1')}
                />
              </div>
              <div className="form-group">
                <label>Inspection Extent</label>
                <input
                  type="text"
                  placeholder="Exterior and common areas"
                  value={String(getValue('inspection-extent') || '')}
                  onChange={onInputChange('inspection-extent')}
                />
              </div>
              <div className="form-group">
                <label>Signature</label>
                <div className="file-upload">
                  <button className="file-upload-btn">Upload</button>
                  <div className="file-preview">IMG</div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Appraiser */}
          <div className="subsection">
            <div className="subsection-title">Secondary Appraiser (Optional)</div>
            <div className="form-grid form-grid-4">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={String(getValue('appraiser2-name') || '')}
                  onChange={onInputChange('appraiser2-name')}
                />
              </div>
              <div className="form-group">
                <label>Credentials</label>
                <input
                  type="text"
                  value={String(getValue('appraiser2-credentials') || '')}
                  onChange={onInputChange('appraiser2-credentials')}
                />
              </div>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={String(getValue('appraiser2-title') || '')}
                  onChange={onInputChange('appraiser2-title')}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={String(getValue('appraiser2-role') || 'Co-Appraiser')}
                  onChange={onInputChange('appraiser2-role')}
                >
                  <option>Co-Appraiser</option>
                  <option>Primary Appraiser</option>
                  <option>Review Appraiser</option>
                </select>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={String(getValue('appraiser2-phone') || '')}
                  onChange={onInputChange('appraiser2-phone')}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={String(getValue('appraiser2-email') || '')}
                  onChange={onInputChange('appraiser2-email')}
                />
              </div>
              <div className="form-group">
                <label>AIC License #</label>
                <input
                  type="text"
                  value={String(getValue('appraiser2-aic') || '')}
                  onChange={onInputChange('appraiser2-aic')}
                />
              </div>
              <div className="form-group">
                <label>License Expiry</label>
                <input
                  type="date"
                  value={String(getValue('appraiser2-license-expiry') || '')}
                  onChange={onInputChange('appraiser2-license-expiry')}
                />
              </div>
            </div>
            <div className="appraiser-extra-row">
              <div className="toggle-group">
                <ToggleRow
                  checked={getValue('appraiser2-inspected') === true}
                  onChange={onToggleChange('appraiser2-inspected')}
                  label="Inspected Property"
                />
                <ToggleRow
                  checked={getValue('appraiser2-all-units') === true}
                  onChange={onToggleChange('appraiser2-all-units')}
                  label="All Units Inspected"
                />
                <ToggleRow
                  checked={getValue('appraiser2-ce') === true}
                  onChange={onToggleChange('appraiser2-ce')}
                  label="CE Completed"
                />
                <ToggleRow
                  checked={getValue('appraiser2-ethics') === true}
                  onChange={onToggleChange('appraiser2-ethics')}
                  label="Ethics Completed"
                />
              </div>
              <div className="form-group">
                <label>Inspection Date</label>
                <input
                  type="date"
                  value={String(getValue('inspection-date-2') || '')}
                  onChange={onInputChange('inspection-date-2')}
                />
              </div>
              <div className="form-group">
                <label>Inspection Extent</label>
                <input
                  type="text"
                  value={String(getValue('inspection-extent-2') || '')}
                  onChange={onInputChange('inspection-extent-2')}
                />
              </div>
              <div className="form-group">
                <label>Signature</label>
                <div className="file-upload">
                  <button className="file-upload-btn">Upload</button>
                  <div className="file-preview">IMG</div>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* 6. KEY DATES */}
        <CollapsibleSection
          id="key-dates"
          title="Key Dates"
          isCollapsed={collapsedSections.has('key-dates')}
          onToggle={() => toggleSection('key-dates')}
        >
          <div className="form-grid form-grid-4">
            <div className="form-group">
              <label>Letter Date</label>
              <input
                type="date"
                value={String(getValue('transmittal-date') || '')}
                onChange={onInputChange('transmittal-date')}
              />
            </div>
            <div className="form-group">
              <label>Inspection Date</label>
              <input
                type="date"
                value={String(getValue('inspection-date-1') || '')}
                onChange={onInputChange('inspection-date-1')}
              />
            </div>
            <div className="form-group">
              <label>Report Date</label>
              <input
                type="date"
                value={String(getValue('report-date') || '')}
                onChange={onInputChange('report-date')}
              />
            </div>
            <div className="form-group">
              <label>Effective Date</label>
              <input
                type="date"
                value={String(getValue('valuation-date') || '')}
                onChange={onInputChange('valuation-date')}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* 7. VALUATION SCENARIO */}
        <CollapsibleSection
          id="valuation-scenario"
          title="Valuation Scenario"
          isCollapsed={collapsedSections.has('valuation-scenario')}
          onToggle={() => toggleSection('valuation-scenario')}
        >
          <div className="form-grid form-grid-3">
            <div className="form-group">
              <label>Scenario Name</label>
              <select
                value={String(getValue('value-scenario') || '')}
                onChange={onInputChange('value-scenario')}
              >
                {getFieldOptions('value-scenario').map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Property Rights</label>
              <select
                value={String(getValue('property-rights') || '')}
                onChange={onInputChange('property-rights')}
              >
                {getFieldOptions('property-rights').map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Value Component</label>
              <select
                value={String(getValue('value-component') || '')}
                onChange={onInputChange('value-component')}
              >
                <option>Real Property</option>
                <option>Real Property + FF&E</option>
                <option>Going Concern</option>
              </select>
            </div>
          </div>
        </CollapsibleSection>

        {/* 8. SUBJECT PROPERTY */}
        <CollapsibleSection
          id="subject-property"
          title="Subject Property"
          isCollapsed={collapsedSections.has('subject-property')}
          onToggle={() => toggleSection('subject-property')}
        >
          <div className="form-grid form-grid-4">
            <div className="form-group span-2">
              <label>Property Name</label>
              <input
                type="text"
                value={String(getValue('property-name') || '')}
                onChange={onInputChange('property-name')}
              />
            </div>
            <div className="form-group span-2">
              <label>Street Address</label>
              <input
                type="text"
                value={String(getValue('property-address') || '')}
                onChange={onInputChange('property-address')}
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={String(getValue('city') || '')}
                onChange={onInputChange('city')}
              />
            </div>
            <div className="form-group">
              <label>Province</label>
              <select
                value={String(getValue('province') || '')}
                onChange={onInputChange('province')}
              >
                {PROVINCES.map(p => <option key={p} value={p}>{p || 'Select...'}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                value={String(getValue('postal-code') || '')}
                onChange={onInputChange('postal-code')}
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <select
                value={String(getValue('country') || 'Canada')}
                onChange={onInputChange('country')}
              >
                <option>Canada</option>
                <option>US</option>
              </select>
            </div>
            <div className="form-group">
              <label>Latitude</label>
              <input
                type="text"
                placeholder="51.0447"
                value={String(getValue('latitude') || '')}
                onChange={onInputChange('latitude')}
              />
            </div>
            <div className="form-group">
              <label>Longitude</label>
              <input
                type="text"
                placeholder="-114.0719"
                value={String(getValue('longitude') || '')}
                onChange={onInputChange('longitude')}
              />
            </div>
            <div className="form-group">
              <label>&nbsp;</label>
              <button className="btn-inline">Get Geocode</button>
            </div>
            <div className="form-group">
              <label>Parcel ID</label>
              <input
                type="text"
                value={String(getValue('parcel-id') || '')}
                onChange={onInputChange('parcel-id')}
              />
            </div>
            <div className="form-group span-4">
              <label>Legal Description</label>
              <textarea
                placeholder="Plan XXX, Block X, Lot X..."
                value={String(getValue('legal-description') || '')}
                onChange={onInputChange('legal-description')}
              />
            </div>
          </div>

          {/* Adjacent Properties Subsection */}
          <div className="subsection">
            <div className="subsection-title">Adjacent Properties</div>
            <div className="adjacent-grid">
              <div className="form-group">
                <label>North</label>
                <select
                  value={String(getValue('adjacent-north') || '')}
                  onChange={onInputChange('adjacent-north')}
                >
                  {ADJACENT_TYPES.map(t => <option key={t} value={t}>{t || 'Select...'}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>South</label>
                <select
                  value={String(getValue('adjacent-south') || '')}
                  onChange={onInputChange('adjacent-south')}
                >
                  {ADJACENT_TYPES.map(t => <option key={t} value={t}>{t || 'Select...'}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>East</label>
                <select
                  value={String(getValue('adjacent-east') || '')}
                  onChange={onInputChange('adjacent-east')}
                >
                  {ADJACENT_TYPES.map(t => <option key={t} value={t}>{t || 'Select...'}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>West</label>
                <select
                  value={String(getValue('adjacent-west') || '')}
                  onChange={onInputChange('adjacent-west')}
                >
                  {ADJACENT_TYPES.map(t => <option key={t} value={t}>{t || 'Select...'}</option>)}
                </select>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* 9. QUALITATIVE RATINGS */}
        <CollapsibleSection
          id="qualitative-ratings"
          title="Qualitative Ratings"
          isCollapsed={collapsedSections.has('qualitative-ratings')}
          onToggle={() => toggleSection('qualitative-ratings')}
        >
          {/* Site Ratings */}
          <div className="subsection">
            <div className="subsection-title">Site</div>
            <div className="ratings-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className="form-group">
                <label>Appeal</label>
                <select
                  value={String(getValue('site-appeal') || '')}
                  onChange={onInputChange('site-appeal')}
                >
                  {RATINGS.map(r => <option key={r} value={r}>{r || 'Select...'}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Exposure</label>
                <select
                  value={String(getValue('exposure-visibility') || '')}
                  onChange={onInputChange('exposure-visibility')}
                >
                  {RATINGS.map(r => <option key={r} value={r}>{r || 'Select...'}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Utility</label>
                <select
                  value={String(getValue('site-utility') || '')}
                  onChange={onInputChange('site-utility')}
                >
                  {RATINGS.map(r => <option key={r} value={r}>{r || 'Select...'}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Building Ratings */}
          <div className="subsection">
            <div className="subsection-title">Building</div>
            <div className="ratings-grid">
              <div className="form-group">
                <label>Quality</label>
                <select
                  value={String(getValue('building-quality') || '')}
                  onChange={onInputChange('building-quality')}
                >
                  {RATINGS.map(r => <option key={r} value={r}>{r || 'Select...'}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Appeal</label>
                <select
                  value={String(getValue('building-appeal') || '')}
                  onChange={onInputChange('building-appeal')}
                >
                  {RATINGS.map(r => <option key={r} value={r}>{r || 'Select...'}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Condition</label>
                <select
                  value={String(getValue('condition') || '')}
                  onChange={onInputChange('condition')}
                >
                  {RATINGS.map(r => <option key={r} value={r}>{r || 'Select...'}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Function</label>
                <select
                  value={String(getValue('building-function') || '')}
                  onChange={onInputChange('building-function')}
                >
                  {RATINGS.map(r => <option key={r} value={r}>{r || 'Select...'}</option>)}
                </select>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* 10. TRANSACTION HISTORY */}
        <CollapsibleSection
          id="transaction-history"
          title="Transaction History"
          isCollapsed={collapsedSections.has('transaction-history')}
          onToggle={() => toggleSection('transaction-history')}
        >
          <div className="form-grid form-grid-4">
            <div className="form-group">
              <label>Current Owner</label>
              <input
                type="text"
                value={String(getValue('current-owner') || '')}
                onChange={onInputChange('current-owner')}
              />
            </div>
            <div className="form-group span-2">
              <label>Owner Address</label>
              <input
                type="text"
                value={String(getValue('owner-address') || '')}
                onChange={onInputChange('owner-address')}
              />
            </div>
            <div className="form-group">
              <label>Prior Owner</label>
              <input
                type="text"
                value={String(getValue('prior-owner') || '')}
                onChange={onInputChange('prior-owner')}
              />
            </div>
            <div className="form-group">
              <label>Last Purchase Price</label>
              <input
                type="text"
                placeholder="$0.00"
                value={String(getValue('last-purchase-price') || '')}
                onChange={onInputChange('last-purchase-price')}
              />
            </div>
            <div className="form-group">
              <label>Purchase Date</label>
              <input
                type="date"
                value={String(getValue('purchase-date') || '')}
                onChange={onInputChange('purchase-date')}
              />
            </div>
            <div className="form-group">
              <label>Deed Type</label>
              <select
                value={String(getValue('deed-type') || '')}
                onChange={onInputChange('deed-type')}
              >
                {DEED_TYPES.map(t => <option key={t} value={t}>{t || 'Select...'}</option>)}
              </select>
            </div>
            <div className="form-group span-2">
              <label>Ownership History</label>
              <textarea
                value={String(getValue('ownership-history') || '')}
                onChange={onInputChange('ownership-history')}
              />
            </div>
            <div className="form-group span-2">
              <label>Sales History</label>
              <textarea
                value={String(getValue('sales-history') || '')}
                onChange={onInputChange('sales-history')}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* 11. CONDITIONS */}
        <CollapsibleSection
          id="conditions"
          title="Conditions"
          isCollapsed={collapsedSections.has('conditions')}
          onToggle={() => toggleSection('conditions')}
        >
          {/* Extraordinary Assumptions */}
          <div className="subsection">
            <div className="subsection-title">Extraordinary Assumptions</div>
            <div className="form-grid form-grid-3">
              <div className="form-group">
                <label>Assumption 1</label>
                <textarea
                  placeholder="No extraordinary assumptions were made for this assignment."
                  value={String(getValue('extraordinary-assumption-1') || '')}
                  onChange={onInputChange('extraordinary-assumption-1')}
                />
              </div>
              <div className="form-group">
                <label>Assumption 2</label>
                <textarea
                  value={String(getValue('extraordinary-assumption-2') || '')}
                  onChange={onInputChange('extraordinary-assumption-2')}
                />
              </div>
              <div className="form-group">
                <label>Assumption 3</label>
                <textarea
                  value={String(getValue('extraordinary-assumption-3') || '')}
                  onChange={onInputChange('extraordinary-assumption-3')}
                />
              </div>
            </div>
          </div>

          {/* Hypothetical Conditions */}
          <div className="subsection">
            <div className="subsection-title">Hypothetical Conditions</div>
            <div className="form-grid form-grid-3">
              <div className="form-group">
                <label>Condition 1</label>
                <textarea
                  placeholder="No hypothetical conditions were made for this assignment."
                  value={String(getValue('hypothetical-condition-1') || '')}
                  onChange={onInputChange('hypothetical-condition-1')}
                />
              </div>
              <div className="form-group">
                <label>Condition 2</label>
                <textarea
                  value={String(getValue('hypothetical-condition-2') || '')}
                  onChange={onInputChange('hypothetical-condition-2')}
                />
              </div>
              <div className="form-group">
                <label>Condition 3</label>
                <textarea
                  value={String(getValue('hypothetical-condition-3') || '')}
                  onChange={onInputChange('hypothetical-condition-3')}
                />
              </div>
            </div>
          </div>

          {/* Extraordinary Limiting Conditions */}
          <div className="subsection">
            <div className="subsection-title">Extraordinary Limiting Conditions</div>
            <div className="form-grid form-grid-3">
              <div className="form-group">
                <label>Limiting Condition 1</label>
                <textarea
                  placeholder="No extraordinary limiting conditions apply to this assignment."
                  value={String(getValue('limiting-condition-1') || '')}
                  onChange={onInputChange('limiting-condition-1')}
                />
              </div>
              <div className="form-group">
                <label>Limiting Condition 2</label>
                <textarea
                  value={String(getValue('limiting-condition-2') || '')}
                  onChange={onInputChange('limiting-condition-2')}
                />
              </div>
              <div className="form-group">
                <label>Limiting Condition 3</label>
                <textarea
                  value={String(getValue('limiting-condition-3') || '')}
                  onChange={onInputChange('limiting-condition-3')}
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* 12. LETTER OF TRANSMITTAL */}
        <CollapsibleSection
          id="letter-of-transmittal"
          title="Letter of Transmittal"
          isCollapsed={collapsedSections.has('letter-of-transmittal')}
          onToggle={() => toggleSection('letter-of-transmittal')}
        >
          <div className="form-grid">
            <div className="form-group" style={{ maxWidth: '200px' }}>
              <label>Letter Date</label>
              <input
                type="date"
                value={String(getValue('transmittal-date') || '')}
                onChange={onInputChange('transmittal-date')}
              />
            </div>
            <div className="form-group full-width">
              <label>Letter Body</label>
              <textarea
                className="letter-textarea"
                placeholder={`Dear [Client Name],

Re: Appraisal of [Property Address]

In accordance with your request, we have prepared an appraisal report on the above-referenced property. The purpose of this appraisal is to estimate the market value of the fee simple interest in the subject property as of [Effective Date].

Based on our analysis and the methodologies employed, it is our opinion that the market value of the subject property, as of the effective date, is:

[VALUE]

This letter is subject to the Assumptions and Limiting Conditions contained within the attached report.

Respectfully submitted,`}
                value={String(getValue('transmittal-body') || '')}
                onChange={onInputChange('transmittal-body')}
              />
            </div>
          </div>
        </CollapsibleSection>

      </div>
    </div>
  );
}
