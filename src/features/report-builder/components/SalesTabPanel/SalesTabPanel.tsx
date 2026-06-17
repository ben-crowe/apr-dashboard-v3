/**
 * SalesTabPanel.tsx
 * Renders the SALES tab for Sales Comparison Approach
 * 5 collapsible sections: Subject Summary, 5 Comparables, Value Conclusion
 * Plus the live-updating Sales Comparison Table at the bottom
 */

import { useState, useCallback, useMemo, ChangeEvent } from 'react';
import { useReportBuilderStore } from '../../store/reportBuilderStore';
import { ThemeProvider } from '@/features/calculator-demo-v4/context/ThemeContext';
import SalesComparisonPanel from '@/features/calculator-demo-v4/components/SalesComparisonPanel';
import './SalesTabPanel.css';

// Condition options for subject property
const CONDITION_OPTIONS = ['', 'Excellent', 'Good', 'Average', 'Fair', 'Poor'];

// All section IDs for expand/collapse all functionality
const ALL_SECTION_IDS = [
  'subject-summary',
  'sale-comp-1',
  'sale-comp-2',
  'sale-comp-3',
  'sale-comp-4',
  'sale-comp-5',
  'sales-conclusion'
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
    <div className={`sales-section ${isCollapsed ? 'collapsed' : ''}`} id={id}>
      <div className="sales-section-header" onClick={onToggle}>
        <h3>{title}</h3>
        <div className="sales-header-controls">
          <div className="sales-collapse-icon">&#9660;</div>
        </div>
      </div>
      <div className="sales-section-content">
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

export default function SalesTabPanel() {
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

  // Render a single comparable sale section
  const renderComparable = (compNum: number) => {
    const prefix = `comp${compNum}`;
    const sectionId = `sale-comp-${compNum}`;
    const title = `COMPARABLE SALE ${compNum}`;

    return (
      <CollapsibleSection
        key={sectionId}
        id={sectionId}
        title={title}
        isCollapsed={collapsedSections.has(sectionId)}
        onToggle={() => toggleSection(sectionId)}
      >
        {/* Property Identification */}
        <div className="sales-subsection">
          <div className="sales-subsection-title">Property Identification</div>
          <div className="sales-form-grid sales-form-grid-2">
            <div className="sales-form-group">
              <label>Property Name</label>
              <input
                type="text"
                value={String(getValue(`${prefix}-name`) || '')}
                onChange={onInputChange(`${prefix}-name`)}
              />
            </div>
            <div className="sales-form-group">
              <label>Address</label>
              <input
                type="text"
                value={String(getValue(`${prefix}-address`) || '')}
                onChange={onInputChange(`${prefix}-address`)}
              />
            </div>
          </div>
        </div>

        {/* Sale Information */}
        <div className="sales-subsection">
          <div className="sales-subsection-title">Sale Information</div>
          <div className="sales-form-grid sales-form-grid-2">
            <div className="sales-form-group">
              <label>Sale Date</label>
              <input
                type="date"
                value={String(getValue(`${prefix}-sale-date`) || '')}
                onChange={onInputChange(`${prefix}-sale-date`)}
              />
            </div>
            <div className="sales-form-group">
              <label>Sale Price</label>
              <input
                type="number"
                placeholder="$0"
                value={String(getValue(`${prefix}-sale-price`) || '')}
                onChange={onInputChange(`${prefix}-sale-price`)}
              />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="sales-subsection">
          <div className="sales-subsection-title">Property Details</div>
          <div className="sales-form-grid sales-form-grid-2">
            <div className="sales-form-group">
              <label>Units</label>
              <input
                type="number"
                value={String(getValue(`${prefix}-units`) || '')}
                onChange={onInputChange(`${prefix}-units`)}
              />
            </div>
            <div className="sales-form-group">
              <label>Price/Unit</label>
              <input
                type="text"
                value={formatCurrency(getValue(`${prefix}-price-per-unit`))}
                readOnly
                className="calculated-field"
              />
            </div>
            <div className="sales-form-group">
              <label>GBA (SF)</label>
              <input
                type="number"
                value={String(getValue(`${prefix}-gba`) || '')}
                onChange={onInputChange(`${prefix}-gba`)}
              />
            </div>
            <div className="sales-form-group">
              <label>Price/SF</label>
              <input
                type="text"
                value={formatCurrency(getValue(`${prefix}-price-per-sf`))}
                readOnly
                className="calculated-field"
              />
            </div>
            <div className="sales-form-group">
              <label>Year Built</label>
              <input
                type="number"
                value={String(getValue(`${prefix}-year`) || '')}
                onChange={onInputChange(`${prefix}-year`)}
              />
            </div>
            <div className="sales-form-group">
              <label>Cap Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={String(getValue(`${prefix}-cap-rate`) || '')}
                onChange={onInputChange(`${prefix}-cap-rate`)}
              />
            </div>
          </div>
        </div>

        {/* Adjustments */}
        <div className="sales-subsection">
          <div className="sales-subsection-title">Adjustments (%)</div>
          <div className="sales-form-grid sales-form-grid-2">
            <div className="sales-form-group">
              <label>Property Rights</label>
              <input
                type="number"
                step="0.1"
                value={String(getValue(`${prefix}-adj-property-rights`) || 0)}
                onChange={onInputChange(`${prefix}-adj-property-rights`)}
              />
            </div>
            <div className="sales-form-group">
              <label>Financing Terms</label>
              <input
                type="number"
                step="0.1"
                value={String(getValue(`${prefix}-adj-financing`) || 0)}
                onChange={onInputChange(`${prefix}-adj-financing`)}
              />
            </div>
            <div className="sales-form-group">
              <label>Conditions of Sale</label>
              <input
                type="number"
                step="0.1"
                value={String(getValue(`${prefix}-adj-conditions-sale`) || 0)}
                onChange={onInputChange(`${prefix}-adj-conditions-sale`)}
              />
            </div>
            <div className="sales-form-group">
              <label>Market/Time</label>
              <input
                type="number"
                step="0.1"
                value={String(getValue(`${prefix}-adj-market-time`) || 0)}
                onChange={onInputChange(`${prefix}-adj-market-time`)}
              />
            </div>
            <div className="sales-form-group">
              <label>Location</label>
              <input
                type="number"
                step="0.1"
                value={String(getValue(`${prefix}-adj-location`) || 0)}
                onChange={onInputChange(`${prefix}-adj-location`)}
              />
            </div>
            <div className="sales-form-group">
              <label>Size</label>
              <input
                type="number"
                step="0.1"
                value={String(getValue(`${prefix}-adj-size`) || 0)}
                onChange={onInputChange(`${prefix}-adj-size`)}
              />
            </div>
            <div className="sales-form-group">
              <label>Age/Condition</label>
              <input
                type="number"
                step="0.1"
                value={String(getValue(`${prefix}-adj-age-condition`) || 0)}
                onChange={onInputChange(`${prefix}-adj-age-condition`)}
              />
            </div>
            <div className="sales-form-group">
              <label>Other</label>
              <input
                type="number"
                step="0.1"
                value={String(getValue(`${prefix}-adj-other`) || 0)}
                onChange={onInputChange(`${prefix}-adj-other`)}
              />
            </div>
          </div>
        </div>
      </CollapsibleSection>
    );
  };

  return (
    <div className="sales-tab-panel">
      <div className="sales-tab-container">
        {/* Minimal controls - right aligned, no container */}
        <div className="sales-quick-controls">
          <span className="sales-quick-link" onClick={toggleAllSections}>
            <span className="sales-chevron">{allCollapsed ? '>' : 'v'}</span>
            {allCollapsed ? 'Expand' : 'Collapse'}
          </span>
        </div>

        {/* 1. SUBJECT PROPERTY SUMMARY */}
        <CollapsibleSection
          id="subject-summary"
          title="SUBJECT PROPERTY SUMMARY"
          isCollapsed={collapsedSections.has('subject-summary')}
          onToggle={() => toggleSection('subject-summary')}
        >
          <div className="sales-form-grid sales-form-grid-3">
            <div className="sales-form-group">
              <label>Number of Units</label>
              <input
                type="number"
                value={String(getValue('subject-units') || '')}
                onChange={onInputChange('subject-units')}
              />
            </div>
            <div className="sales-form-group">
              <label>Gross Building Area (SF)</label>
              <input
                type="number"
                value={String(getValue('subject-gba') || '')}
                onChange={onInputChange('subject-gba')}
              />
            </div>
            <div className="sales-form-group">
              <label>Year Built</label>
              <input
                type="number"
                value={String(getValue('subject-year') || '')}
                onChange={onInputChange('subject-year')}
              />
            </div>
            <div className="sales-form-group">
              <label>Site Area (SF)</label>
              <input
                type="number"
                value={String(getValue('subject-site-area') || '')}
                onChange={onInputChange('subject-site-area')}
              />
            </div>
            <div className="sales-form-group">
              <label>Parking Ratio</label>
              <input
                type="number"
                step="0.01"
                value={String(getValue('subject-parking') || '')}
                onChange={onInputChange('subject-parking')}
              />
            </div>
            <div className="sales-form-group">
              <label>Condition</label>
              <select
                value={String(getValue('subject-condition') || '')}
                onChange={onInputChange('subject-condition')}
              >
                {CONDITION_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt || 'Select...'}</option>
                ))}
              </select>
            </div>
          </div>
        </CollapsibleSection>

        {/* 2-6. COMPARABLE SALES (5 total) */}
        {renderComparable(1)}
        {renderComparable(2)}
        {renderComparable(3)}
        {renderComparable(4)}
        {renderComparable(5)}

        {/* 7. VALUE CONCLUSION */}
        <CollapsibleSection
          id="sales-conclusion"
          title="VALUE CONCLUSION"
          isCollapsed={collapsedSections.has('sales-conclusion')}
          onToggle={() => toggleSection('sales-conclusion')}
        >
          <div className="sales-form-grid">
            <div className="sales-form-group">
              <label>Sales Comparison Value</label>
              <input
                type="number"
                placeholder="$0"
                value={String(getValue('sales-value-indication') || '')}
                onChange={onInputChange('sales-value-indication')}
              />
            </div>
            <div className="sales-form-group sales-full-width">
              <label>Adjustment Summary</label>
              <textarea
                placeholder="Summary of adjustments applied to comparable sales..."
                value={String(getValue('sales-adjustment-summary') || '')}
                onChange={onInputChange('sales-adjustment-summary')}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* SECTION DIVIDER */}
        <div className="sales-section-divider">
          <div className="sales-divider-line"></div>
          <span className="sales-divider-text">SALES COMPARISON TABLE</span>
          <div className="sales-divider-line"></div>
        </div>

        {/* SALES COMPARISON TABLE - Live updating calculator table */}
        <div className="sales-comparison-table-wrapper">
          <ThemeProvider>
            <SalesComparisonPanel />
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
}
