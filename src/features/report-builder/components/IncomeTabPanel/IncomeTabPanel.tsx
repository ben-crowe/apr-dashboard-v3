/**
 * IncomeTabPanel.tsx
 * Renders the INCOME tab for the Income Approach to valuation
 * 4 collapsible sections with narrative fields and value indication
 */

import { useState, useCallback, useMemo, ChangeEvent } from 'react';
import { useReportBuilderStore } from '../../store/reportBuilderStore';
import './IncomeTabPanel.css';

// All section IDs for expand/collapse all functionality
const ALL_SECTION_IDS = [
  'income-potential',
  'income-expenses',
  'income-noi',
  'income-analysis'
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
    <div className={`income-section ${isCollapsed ? 'collapsed' : ''}`} id={id}>
      <div className="income-section-header" onClick={onToggle}>
        <h3>{title}</h3>
        <div className="income-header-controls">
          <div className="income-collapse-icon">&#9660;</div>
        </div>
      </div>
      <div className="income-section-content">
        {children}
      </div>
    </div>
  );
}

export default function IncomeTabPanel() {
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

  // Format currency for display
  const formatCurrency = (value: string | number | boolean): string => {
    const num = typeof value === 'number' ? value : parseFloat(String(value));
    if (isNaN(num) || num === 0) return '';
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="income-tab-panel">
      <div className="income-tab-container">
        {/* Minimal controls - right aligned, no container */}
        <div className="income-quick-controls">
          <span className="income-quick-link" onClick={toggleAllSections}>
            <span className="income-chevron">{allCollapsed ? '>' : 'v'}</span>
            {allCollapsed ? 'Expand' : 'Collapse'}
          </span>
        </div>

        {/* Section Header */}
        <div className="income-header-bar">
          <h2>Income Approach</h2>
          <p className="income-header-description">
            Analysis of income potential, operating expenses, and capitalization for property valuation
          </p>
        </div>

        {/* 1. POTENTIAL INCOME */}
        <CollapsibleSection
          id="income-potential"
          title="Potential Gross Income"
          isCollapsed={collapsedSections.has('income-potential')}
          onToggle={() => toggleSection('income-potential')}
        >
          <div className="income-form-grid">
            <div className="income-form-group full-width">
              <label>PGI Analysis</label>
              <textarea
                className="income-narrative-textarea"
                placeholder="Describe the potential gross income analysis, including market rent comparisons, rent roll analysis, and any rent premiums or discounts applied..."
                value={String(getValue('income-pgi-narrative') || '')}
                onChange={onInputChange('income-pgi-narrative')}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* 2. OPERATING EXPENSES */}
        <CollapsibleSection
          id="income-expenses"
          title="Operating Expenses"
          isCollapsed={collapsedSections.has('income-expenses')}
          onToggle={() => toggleSection('income-expenses')}
        >
          <div className="income-form-grid">
            <div className="income-form-group full-width">
              <label>Expense Analysis</label>
              <textarea
                className="income-narrative-textarea"
                placeholder="Describe the operating expense analysis, including comparison to industry standards, expense ratios, and any adjustments made for stabilized expenses..."
                value={String(getValue('income-expense-narrative') || '')}
                onChange={onInputChange('income-expense-narrative')}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* 3. NET OPERATING INCOME */}
        <CollapsibleSection
          id="income-noi"
          title="Net Operating Income"
          isCollapsed={collapsedSections.has('income-noi')}
          onToggle={() => toggleSection('income-noi')}
        >
          <div className="income-form-grid">
            <div className="income-form-group full-width">
              <label>NOI Analysis</label>
              <textarea
                className="income-narrative-textarea"
                placeholder="Describe the net operating income derivation, including any adjustments for reserves, management fees, and stabilization considerations..."
                value={String(getValue('income-noi-narrative') || '')}
                onChange={onInputChange('income-noi-narrative')}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* 4. INCOME APPROACH ANALYSIS */}
        <CollapsibleSection
          id="income-analysis"
          title="Income Approach Analysis"
          isCollapsed={collapsedSections.has('income-analysis')}
          onToggle={() => toggleSection('income-analysis')}
        >
          <div className="income-form-grid">
            <div className="income-form-group full-width">
              <label>Cap Rate Analysis</label>
              <textarea
                className="income-narrative-textarea"
                placeholder="Describe the capitalization rate selection, including market-derived cap rates, investor surveys, and risk analysis supporting the selected rate..."
                value={String(getValue('income-cap-rate-analysis') || '')}
                onChange={onInputChange('income-cap-rate-analysis')}
              />
            </div>

            {/* Value Indication Subsection */}
            <div className="income-subsection">
              <div className="income-subsection-title">Value Indication</div>
              <div className="income-form-grid income-form-grid-2">
                <div className="income-form-group">
                  <label>Income Approach Value</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={String(getValue('income-value-indication') || '')}
                    onChange={onInputChange('income-value-indication')}
                  />
                </div>
                <div className="income-form-group">
                  <label>Formatted Value</label>
                  <div className="income-value-display">
                    {formatCurrency(getValue('income-value-indication')) || '$0'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

      </div>
    </div>
  );
}
