/**
 * CostTabPanel.tsx
 * Renders the COST tab for Cost Approach
 * 5 collapsible sections for data entry + CostApproachPanel calculator table
 */

import { useState, useCallback, useMemo, ChangeEvent } from 'react';
import { useReportBuilderStore } from '../../store/reportBuilderStore';
import { ThemeProvider } from '@/features/calculator-demo-v4/context/ThemeContext';
import CostApproachPanel from '@/features/calculator-demo-v4/components/CostApproachPanel';
import './CostTabPanel.css';

// All section IDs for expand/collapse all functionality
const ALL_SECTION_IDS = [
  'land-value',
  'replacement-cost-new',
  'depreciation',
  'site-improvements',
  'cost-conclusion'
];

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
    <div className={`cost-section ${isCollapsed ? 'collapsed' : ''}`} id={id}>
      <div className="cost-section-header" onClick={onToggle}>
        <h3>{title}</h3>
        <div className="cost-header-controls">
          <div className="cost-collapse-icon">&#9660;</div>
        </div>
      </div>
      <div className="cost-section-content">
        {children}
      </div>
    </div>
  );
}

// Format currency for display
function formatCurrency(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num) || num === 0) return '';
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
}

// Format number with commas
function formatNumber(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num) || num === 0) return '';
  return new Intl.NumberFormat('en-CA').format(num);
}

export default function CostTabPanel() {
  const { sections, updateFieldValue } = useReportBuilderStore();

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

  // Number input change handler (converts to number)
  const onNumberChange = useCallback((fieldId: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    handleChange(fieldId, value);
  }, [handleChange]);

  return (
    <div className="cost-tab-panel">
      <div className="cost-tab-container">
        {/* Minimal controls - right aligned, no container */}
        <div className="cost-quick-controls">
          <span className="cost-quick-link" onClick={toggleAllSections}>
            <span className="cost-chevron">{allCollapsed ? '>' : 'v'}</span>
            {allCollapsed ? 'Expand' : 'Collapse'}
          </span>
        </div>

        {/* 1. LAND VALUE */}
        <CollapsibleSection
          id="land-value"
          title="LAND VALUE"
          isCollapsed={collapsedSections.has('land-value')}
          onToggle={() => toggleSection('land-value')}
        >
          <div className="cost-form-grid cost-form-grid-3">
            <div className="cost-form-group">
              <label>Land Area (SF)</label>
              <input
                type="number"
                value={String(getValue('cost-land-sf') || '')}
                onChange={onNumberChange('cost-land-sf')}
                placeholder="0"
              />
            </div>
            <div className="cost-form-group">
              <label>Rate per SF ($)</label>
              <input
                type="number"
                step="0.01"
                value={String(getValue('cost-land-rate-per-sf') || '')}
                onChange={onNumberChange('cost-land-rate-per-sf')}
                placeholder="$0.00"
              />
            </div>
            <div className="cost-form-group">
              <label>Land Value</label>
              <input
                type="text"
                value={formatCurrency(getValue('cost-land-value'))}
                readOnly
                className="calculated-field"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* 2. REPLACEMENT COST NEW */}
        <CollapsibleSection
          id="replacement-cost-new"
          title="REPLACEMENT COST NEW"
          isCollapsed={collapsedSections.has('replacement-cost-new')}
          onToggle={() => toggleSection('replacement-cost-new')}
        >
          {/* Building Costs */}
          <div className="cost-subsection">
            <div className="cost-subsection-title">Building Costs</div>
            <div className="cost-form-grid cost-form-grid-2">
              <div className="cost-form-group">
                <label>Gross Building Area (SF)</label>
                <input
                  type="number"
                  value={String(getValue('cost-rcn-gba') || '')}
                  onChange={onNumberChange('cost-rcn-gba')}
                  placeholder="0"
                />
              </div>
              <div className="cost-form-group">
                <label>Rate per SF ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={String(getValue('cost-rcn-rate-per-sf') || '')}
                  onChange={onNumberChange('cost-rcn-rate-per-sf')}
                  placeholder="$0.00"
                />
              </div>
            </div>
          </div>

          {/* Indirect & Entrepreneur */}
          <div className="cost-subsection">
            <div className="cost-subsection-title">Indirect & Entrepreneur Costs</div>
            <div className="cost-form-grid cost-form-grid-2">
              <div className="cost-form-group">
                <label>Indirect Costs (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={String(getValue('cost-rcn-indirect-pct') || '')}
                  onChange={onNumberChange('cost-rcn-indirect-pct')}
                  placeholder="0%"
                />
              </div>
              <div className="cost-form-group">
                <label>Entrepreneur Incentive (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={String(getValue('cost-rcn-entrepreneur-pct') || '')}
                  onChange={onNumberChange('cost-rcn-entrepreneur-pct')}
                  placeholder="0%"
                />
              </div>
            </div>
          </div>

          {/* Calculated Values */}
          <div className="cost-subsection">
            <div className="cost-subsection-title">Cost Summary</div>
            <div className="cost-form-grid cost-form-grid-2">
              <div className="cost-form-group">
                <label>Direct Costs</label>
                <input
                  type="text"
                  value={formatCurrency(getValue('cost-rcn-direct-costs'))}
                  readOnly
                  className="calculated-field"
                />
              </div>
              <div className="cost-form-group">
                <label>Indirect Costs</label>
                <input
                  type="text"
                  value={formatCurrency(getValue('cost-rcn-indirect-costs'))}
                  readOnly
                  className="calculated-field"
                />
              </div>
              <div className="cost-form-group">
                <label>Entrepreneur Amount</label>
                <input
                  type="text"
                  value={formatCurrency(getValue('cost-rcn-entrepreneur-amt'))}
                  readOnly
                  className="calculated-field"
                />
              </div>
              <div className="cost-form-group">
                <label>Total RCN</label>
                <input
                  type="text"
                  value={formatCurrency(getValue('cost-rcn-total'))}
                  readOnly
                  className="calculated-field cost-total-field"
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* 3. DEPRECIATION */}
        <CollapsibleSection
          id="depreciation"
          title="DEPRECIATION"
          isCollapsed={collapsedSections.has('depreciation')}
          onToggle={() => toggleSection('depreciation')}
        >
          {/* Physical Depreciation */}
          <div className="cost-subsection">
            <div className="cost-subsection-title">Physical Depreciation</div>
            <div className="cost-form-grid cost-form-grid-4">
              <div className="cost-form-group">
                <label>Actual Age (years)</label>
                <input
                  type="number"
                  value={String(getValue('cost-depr-physical-age') || '')}
                  onChange={onNumberChange('cost-depr-physical-age')}
                  placeholder="0"
                />
              </div>
              <div className="cost-form-group">
                <label>Economic Life (years)</label>
                <input
                  type="number"
                  value={String(getValue('cost-depr-physical-life') || '')}
                  onChange={onNumberChange('cost-depr-physical-life')}
                  placeholder="0"
                />
              </div>
              <div className="cost-form-group">
                <label>Effective Age (years)</label>
                <input
                  type="number"
                  value={String(getValue('cost-depr-physical-effective-age') || '')}
                  onChange={onNumberChange('cost-depr-physical-effective-age')}
                  placeholder="0"
                />
              </div>
              <div className="cost-form-group">
                <label>Remaining Life</label>
                <input
                  type="text"
                  value={formatNumber(getValue('cost-depr-physical-remaining-life')) + (getValue('cost-depr-physical-remaining-life') ? ' yrs' : '')}
                  readOnly
                  className="calculated-field"
                />
              </div>
            </div>
            <div className="cost-form-grid cost-form-grid-2" style={{ marginTop: '10px' }}>
              <div className="cost-form-group">
                <label>Physical Depreciation (%)</label>
                <input
                  type="text"
                  value={getValue('cost-depr-physical-pct') ? String(getValue('cost-depr-physical-pct')) + '%' : ''}
                  readOnly
                  className="calculated-field"
                />
              </div>
              <div className="cost-form-group">
                <label>Physical Depreciation ($)</label>
                <input
                  type="text"
                  value={formatCurrency(getValue('cost-depr-physical-amt'))}
                  readOnly
                  className="calculated-field"
                />
              </div>
            </div>
          </div>

          {/* Functional & External */}
          <div className="cost-subsection">
            <div className="cost-subsection-title">Functional & External Obsolescence</div>
            <div className="cost-form-grid cost-form-grid-2">
              <div className="cost-form-group">
                <label>Functional Obsolescence ($)</label>
                <input
                  type="number"
                  value={String(getValue('cost-depr-functional-total') || '')}
                  onChange={onNumberChange('cost-depr-functional-total')}
                  placeholder="$0"
                />
              </div>
              <div className="cost-form-group">
                <label>External Obsolescence ($)</label>
                <input
                  type="number"
                  value={String(getValue('cost-depr-external-total') || '')}
                  onChange={onNumberChange('cost-depr-external-total')}
                  placeholder="$0"
                />
              </div>
            </div>
          </div>

          {/* Total Depreciation */}
          <div className="cost-subsection">
            <div className="cost-subsection-title">Total Depreciation</div>
            <div className="cost-form-grid cost-form-grid-2">
              <div className="cost-form-group">
                <label>Total Depreciation (%)</label>
                <input
                  type="text"
                  value={getValue('cost-depr-total-pct') ? String(getValue('cost-depr-total-pct')) + '%' : ''}
                  readOnly
                  className="calculated-field"
                />
              </div>
              <div className="cost-form-group">
                <label>Total Depreciation ($)</label>
                <input
                  type="text"
                  value={formatCurrency(getValue('cost-depr-total-amt'))}
                  readOnly
                  className="calculated-field cost-total-field"
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* 4. SITE IMPROVEMENTS */}
        <CollapsibleSection
          id="site-improvements"
          title="SITE IMPROVEMENTS"
          isCollapsed={collapsedSections.has('site-improvements')}
          onToggle={() => toggleSection('site-improvements')}
        >
          {/* Parking */}
          <div className="cost-subsection">
            <div className="cost-subsection-title">Parking</div>
            <div className="cost-form-grid cost-form-grid-3">
              <div className="cost-form-group">
                <label>Parking Spaces</label>
                <input
                  type="number"
                  value={String(getValue('cost-site-parking-spaces') || '')}
                  onChange={onNumberChange('cost-site-parking-spaces')}
                  placeholder="0"
                />
              </div>
              <div className="cost-form-group">
                <label>Cost per Space ($)</label>
                <input
                  type="number"
                  value={String(getValue('cost-site-parking-cost') || '')}
                  onChange={onNumberChange('cost-site-parking-cost')}
                  placeholder="$0"
                />
              </div>
              <div className="cost-form-group">
                <label>Parking Total</label>
                <input
                  type="text"
                  value={formatCurrency(getValue('cost-site-parking-total'))}
                  readOnly
                  className="calculated-field"
                />
              </div>
            </div>
          </div>

          {/* Other Site Improvements */}
          <div className="cost-subsection">
            <div className="cost-subsection-title">Other Site Improvements</div>
            <div className="cost-form-grid cost-form-grid-2">
              <div className="cost-form-group">
                <label>Landscaping ($)</label>
                <input
                  type="number"
                  value={String(getValue('cost-site-landscaping') || '')}
                  onChange={onNumberChange('cost-site-landscaping')}
                  placeholder="$0"
                />
              </div>
              <div className="cost-form-group">
                <label>Paving ($)</label>
                <input
                  type="number"
                  value={String(getValue('cost-site-paving') || '')}
                  onChange={onNumberChange('cost-site-paving')}
                  placeholder="$0"
                />
              </div>
              <div className="cost-form-group">
                <label>Utilities ($)</label>
                <input
                  type="number"
                  value={String(getValue('cost-site-utilities') || '')}
                  onChange={onNumberChange('cost-site-utilities')}
                  placeholder="$0"
                />
              </div>
              <div className="cost-form-group">
                <label>Other ($)</label>
                <input
                  type="number"
                  value={String(getValue('cost-site-other') || '')}
                  onChange={onNumberChange('cost-site-other')}
                  placeholder="$0"
                />
              </div>
            </div>
          </div>

          {/* Site Improvements Total */}
          <div className="cost-subsection">
            <div className="cost-form-grid">
              <div className="cost-form-group">
                <label>Total Site Improvements</label>
                <input
                  type="text"
                  value={formatCurrency(getValue('cost-site-total'))}
                  readOnly
                  className="calculated-field cost-total-field"
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* 5. COST CONCLUSION */}
        <CollapsibleSection
          id="cost-conclusion"
          title="COST CONCLUSION"
          isCollapsed={collapsedSections.has('cost-conclusion')}
          onToggle={() => toggleSection('cost-conclusion')}
        >
          <div className="cost-form-grid">
            <div className="cost-form-group cost-full-width">
              <label>Cost Approach Narrative</label>
              <textarea
                placeholder="Summary of cost approach analysis and value conclusion..."
                value={String(getValue('cost-approach-conclusion') || '')}
                onChange={onInputChange('cost-approach-conclusion')}
              />
            </div>
          </div>

          {/* Value Summary */}
          <div className="cost-subsection">
            <div className="cost-subsection-title">Value Summary</div>
            <div className="cost-form-grid cost-form-grid-2">
              <div className="cost-form-group">
                <label>Depreciated Value</label>
                <input
                  type="text"
                  value={formatCurrency(getValue('cost-depreciated-value'))}
                  readOnly
                  className="calculated-field"
                />
              </div>
              <div className="cost-form-group">
                <label>Indicated Value (Cost Approach)</label>
                <input
                  type="text"
                  value={formatCurrency(getValue('cost-indicated-value'))}
                  readOnly
                  className="calculated-field cost-total-field"
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* COST APPROACH TABLE (Calculator Panel) */}
        <div className="cost-calculator-section">
          <div className="cost-calculator-header">
            <h3>COST APPROACH TABLE</h3>
          </div>
          <div className="cost-calculator-content">
            <ThemeProvider>
              <CostApproachPanel />
            </ThemeProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
