/**
 * IncomeTabPanel.tsx
 * Renders the INCOME tab for the Income Approach to valuation
 * 4 collapsible sections with narrative fields and value indication
 * Plus Operating History and Income Approach calculation tables at bottom
 */

import { useState, useCallback, useMemo, ChangeEvent } from 'react';
import { useReportBuilderStore } from '../../store/reportBuilderStore';
import { ThemeProvider } from '@/features/calculator-demo-v4/context/ThemeContext';
import OperatingHistoryPanel from '@/features/calculator-demo-v4/components/OperatingHistoryPanel';
import IncomeApproachPanel from '@/features/calculator-demo-v4/components/IncomeApproachPanel';
import './IncomeTabPanel.css';

// All section IDs for expand/collapse all functionality
const ALL_SECTION_IDS = [
  // Calculator Input Sections
  'calc-unit-mix',
  'calc-other-income',
  'calc-vacancy',
  'calc-expenses',
  'calc-capitalization',
  'calc-adjustments',
  // Narrative Sections
  'income-potential',
  'income-expenses',
  'income-noi',
  'income-analysis'
];

// Unit type row IDs for iteration
const UNIT_TYPES = [1, 2, 3, 4, 5, 6] as const;

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

  // Number input change handler - calls runCalculations after update
  const onNumberChange = useCallback((fieldId: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    handleChange(fieldId, value);
    // Trigger recalculation
    useReportBuilderStore.getState().runCalculations();
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

        {/* ========== CALCULATOR INPUT SECTIONS ========== */}

        {/* SECTION 1: UNIT MIX (30 fields) */}
        <CollapsibleSection
          id="calc-unit-mix"
          title="Unit Mix"
          isCollapsed={collapsedSections.has('calc-unit-mix')}
          onToggle={() => toggleSection('calc-unit-mix')}
        >
          <table className="income-unit-mix-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Count</th>
                <th>Avg SF</th>
                <th>Contract Rent</th>
                <th>Market Rent</th>
              </tr>
            </thead>
            <tbody>
              {UNIT_TYPES.map(n => (
                <tr key={n}>
                  <td>
                    <input
                      type="text"
                      placeholder={`Type ${n}`}
                      value={String(getValue(`calc-type${n}-name`) || '')}
                      onChange={onInputChange(`calc-type${n}-name`)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="0"
                      value={getValue(`calc-type${n}-count`) || ''}
                      onChange={onNumberChange(`calc-type${n}-count`)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="0"
                      value={getValue(`calc-type${n}-sf`) || ''}
                      onChange={onNumberChange(`calc-type${n}-sf`)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="0"
                      value={getValue(`calc-type${n}-contract-rent`) || ''}
                      onChange={onNumberChange(`calc-type${n}-contract-rent`)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="0"
                      value={getValue(`calc-type${n}-rent`) || ''}
                      onChange={onNumberChange(`calc-type${n}-rent`)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CollapsibleSection>

        {/* SECTION 2: OTHER INCOME (3 fields) */}
        <CollapsibleSection
          id="calc-other-income"
          title="Other Income"
          isCollapsed={collapsedSections.has('calc-other-income')}
          onToggle={() => toggleSection('calc-other-income')}
        >
          <div className="income-form-grid">
            <div className="income-form-group">
              <label>Parking ($/unit/mo)</label>
              <input
                type="number"
                placeholder="0"
                value={getValue('calc-parking-per-unit') || ''}
                onChange={onNumberChange('calc-parking-per-unit')}
              />
            </div>
            <div className="income-form-group">
              <label>Laundry ($/unit/mo)</label>
              <input
                type="number"
                placeholder="0"
                value={getValue('calc-laundry-per-unit') || ''}
                onChange={onNumberChange('calc-laundry-per-unit')}
              />
            </div>
            <div className="income-form-group">
              <label>Other Income ($/year)</label>
              <input
                type="number"
                placeholder="0"
                value={getValue('calc-other-income-annual') || ''}
                onChange={onNumberChange('calc-other-income-annual')}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* SECTION 3: VACANCY & LOSS (4 fields) */}
        <CollapsibleSection
          id="calc-vacancy"
          title="Vacancy & Loss"
          isCollapsed={collapsedSections.has('calc-vacancy')}
          onToggle={() => toggleSection('calc-vacancy')}
        >
          <div className="income-form-grid">
            <div className="income-form-group">
              <label>Vacancy Rate (%)</label>
              <input
                type="number"
                step="0.1"
                placeholder="0"
                value={getValue('calc-vacancy-rate') || ''}
                onChange={onNumberChange('calc-vacancy-rate')}
              />
            </div>
            <div className="income-form-group">
              <label>Concessions (%)</label>
              <input
                type="number"
                step="0.1"
                placeholder="0"
                value={getValue('calc-concessions-rate') || ''}
                onChange={onNumberChange('calc-concessions-rate')}
              />
            </div>
            <div className="income-form-group">
              <label>Credit Loss (%)</label>
              <input
                type="number"
                step="0.1"
                placeholder="0"
                value={getValue('calc-credit-loss-rate') || ''}
                onChange={onNumberChange('calc-credit-loss-rate')}
              />
            </div>
            <div className="income-form-group">
              <label>Other Loss (%)</label>
              <input
                type="number"
                step="0.1"
                placeholder="0"
                value={getValue('calc-other-loss-rate') || ''}
                onChange={onNumberChange('calc-other-loss-rate')}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* SECTION 4: OPERATING EXPENSES (7 fields) */}
        <CollapsibleSection
          id="calc-expenses"
          title="Operating Expenses (Annual)"
          isCollapsed={collapsedSections.has('calc-expenses')}
          onToggle={() => toggleSection('calc-expenses')}
        >
          <div className="income-form-grid">
            <div className="income-form-group">
              <label>Property Taxes</label>
              <input
                type="number"
                placeholder="0"
                value={getValue('calc-exp-taxes-annual') || ''}
                onChange={onNumberChange('calc-exp-taxes-annual')}
              />
            </div>
            <div className="income-form-group">
              <label>Insurance</label>
              <input
                type="number"
                placeholder="0"
                value={getValue('calc-exp-insurance-annual') || ''}
                onChange={onNumberChange('calc-exp-insurance-annual')}
              />
            </div>
            <div className="income-form-group">
              <label>Repairs & Maintenance</label>
              <input
                type="number"
                placeholder="0"
                value={getValue('calc-exp-repairs-annual') || ''}
                onChange={onNumberChange('calc-exp-repairs-annual')}
              />
            </div>
            <div className="income-form-group">
              <label>Utilities</label>
              <input
                type="number"
                placeholder="0"
                value={getValue('calc-exp-utilities-annual') || ''}
                onChange={onNumberChange('calc-exp-utilities-annual')}
              />
            </div>
            <div className="income-form-group">
              <label>Management</label>
              <input
                type="number"
                placeholder="0"
                value={getValue('calc-exp-management-annual') || ''}
                onChange={onNumberChange('calc-exp-management-annual')}
              />
            </div>
            <div className="income-form-group">
              <label>Reserves</label>
              <input
                type="number"
                placeholder="0"
                value={getValue('calc-exp-reserves-annual') || ''}
                onChange={onNumberChange('calc-exp-reserves-annual')}
              />
            </div>
            <div className="income-form-group">
              <label>Other</label>
              <input
                type="number"
                placeholder="0"
                value={getValue('calc-exp-other-annual') || ''}
                onChange={onNumberChange('calc-exp-other-annual')}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* SECTION 5: CAPITALIZATION (2 fields) */}
        <CollapsibleSection
          id="calc-capitalization"
          title="Capitalization"
          isCollapsed={collapsedSections.has('calc-capitalization')}
          onToggle={() => toggleSection('calc-capitalization')}
        >
          <div className="income-form-grid">
            <div className="income-form-group">
              <label>Cap Rate (%)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0"
                value={getValue('calc-cap-rate') || ''}
                onChange={onNumberChange('calc-cap-rate')}
              />
            </div>
            <div className="income-form-group">
              <label>Cap Rate 2 (%) - Optional</label>
              <input
                type="number"
                step="0.01"
                placeholder="0"
                value={getValue('calc-cap-rate-2') || ''}
                onChange={onNumberChange('calc-cap-rate-2')}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* SECTION 6: ADJUSTMENTS (3 fields) */}
        <CollapsibleSection
          id="calc-adjustments"
          title="Adjustments"
          isCollapsed={collapsedSections.has('calc-adjustments')}
          onToggle={() => toggleSection('calc-adjustments')}
        >
          <div className="income-form-grid">
            <div className="income-form-group">
              <label>CapEx Adjustment</label>
              <input
                type="number"
                placeholder="0"
                value={getValue('calc-adj-capex') || ''}
                onChange={onNumberChange('calc-adj-capex')}
              />
            </div>
            <div className="income-form-group">
              <label>Leasing Costs</label>
              <input
                type="number"
                placeholder="0"
                value={getValue('calc-adj-leasing') || ''}
                onChange={onNumberChange('calc-adj-leasing')}
              />
            </div>
            <div className="income-form-group">
              <label>Other Adjustment</label>
              <input
                type="number"
                placeholder="0"
                value={getValue('calc-adj-other') || ''}
                onChange={onNumberChange('calc-adj-other')}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* ========== NARRATIVE SECTIONS ========== */}
        <div className="income-tables-divider">
          <div className="income-divider-line"></div>
          <span className="income-divider-text">Narrative Analysis</span>
          <div className="income-divider-line"></div>
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

        {/* SECTION DIVIDER */}
        <div className="income-tables-divider">
          <div className="income-divider-line"></div>
          <span className="income-divider-text">Calculation Tables</span>
          <div className="income-divider-line"></div>
        </div>

        {/* CALCULATOR TABLES - wrapped in ThemeProvider */}
        <ThemeProvider>
          <div className="income-calculator-tables">
            {/* Operating History Table */}
            <div className="income-table-section">
              <OperatingHistoryPanel />
            </div>

            {/* Income Approach Table */}
            <div className="income-table-section">
              <IncomeApproachPanel />
            </div>
          </div>
        </ThemeProvider>

      </div>
    </div>
  );
}
