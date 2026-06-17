/**
 * IncomeTabPanel.tsx
 * Renders the INCOME tab with 4 sub-tabs: REVENUE, VACANCY, EXPENSES, VALUE
 * Each sub-tab shows relevant inputs + output tables
 * Preview auto-scrolls to corresponding section of Page 48
 */

import { useState, useCallback, useEffect, ChangeEvent } from 'react';
import { useReportBuilderStore } from '../../store/reportBuilderStore';
import { ThemeProvider } from '@/features/calculator-demo-v4/context/ThemeContext';
import OperatingHistoryPanel from '@/features/calculator-demo-v4/components/OperatingHistoryPanel';
import IncomeApproachPanel from '@/features/calculator-demo-v4/components/IncomeApproachPanel';
import './IncomeTabPanel.css';

// Sub-tab types
type SubTab = 'revenue' | 'vacancy' | 'expenses' | 'value';

// Unit type row IDs for iteration
const UNIT_TYPES = [1, 2, 3, 4, 5, 6] as const;

// Map sub-tabs to page sections for preview scroll
const SUB_TAB_TO_PAGE_SECTION: Record<SubTab, string> = {
  'revenue': 'unit-mix',
  'vacancy': 'vacancy-loss',
  'expenses': 'operating-expenses',
  'value': 'noi-value'
};

export default function IncomeTabPanel() {
  const { sections, updateFieldValue, setScrollToReportPage } = useReportBuilderStore();
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('revenue');

  // When sub-tab changes, scroll preview to Page 48
  useEffect(() => {
    // All Income Approach calculation outputs are on Page 48
    setScrollToReportPage(48);
  }, [activeSubTab, setScrollToReportPage]);

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

  // Render REVENUE sub-tab content
  const renderRevenueTab = () => (
    <div className="income-subtab-content">
      {/* Unit Mix Input Table */}
      <div className="income-section-card">
        <h3 className="income-section-title">Unit Mix</h3>
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
      </div>

      {/* Other Income */}
      <div className="income-section-card">
        <h3 className="income-section-title">Other Income</h3>
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
      </div>

      {/* Revenue Output - PGI Narrative */}
      <div className="income-section-card">
        <h3 className="income-section-title">PGI Analysis</h3>
        <textarea
          className="income-narrative-textarea"
          placeholder="Describe the potential gross income analysis..."
          value={String(getValue('income-pgi-narrative') || '')}
          onChange={onInputChange('income-pgi-narrative')}
        />
      </div>
    </div>
  );

  // Render VACANCY sub-tab content
  const renderVacancyTab = () => (
    <div className="income-subtab-content">
      <div className="income-section-card">
        <h3 className="income-section-title">Vacancy & Loss Rates</h3>
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
      </div>

      {/* Vacancy Output Table */}
      <div className="income-section-card">
        <h3 className="income-section-title">PGR → EGR Calculation</h3>
        <ThemeProvider>
          <div className="income-output-table">
            <IncomeApproachPanel />
          </div>
        </ThemeProvider>
      </div>
    </div>
  );

  // Render EXPENSES sub-tab content
  const renderExpensesTab = () => (
    <div className="income-subtab-content">
      <div className="income-section-card">
        <h3 className="income-section-title">Operating Expenses (Annual)</h3>
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
      </div>

      {/* Expense Narrative */}
      <div className="income-section-card">
        <h3 className="income-section-title">Expense Analysis</h3>
        <textarea
          className="income-narrative-textarea"
          placeholder="Describe the operating expense analysis..."
          value={String(getValue('income-expense-narrative') || '')}
          onChange={onInputChange('income-expense-narrative')}
        />
      </div>

      {/* Operating History Output */}
      <div className="income-section-card">
        <h3 className="income-section-title">Operating History</h3>
        <ThemeProvider>
          <div className="income-output-table">
            <OperatingHistoryPanel />
          </div>
        </ThemeProvider>
      </div>
    </div>
  );

  // Render VALUE sub-tab content
  const renderValueTab = () => (
    <div className="income-subtab-content">
      {/* Cap Rate */}
      <div className="income-section-card">
        <h3 className="income-section-title">Capitalization</h3>
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
      </div>

      {/* Adjustments */}
      <div className="income-section-card">
        <h3 className="income-section-title">Adjustments</h3>
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
      </div>

      {/* Narratives */}
      <div className="income-section-card">
        <h3 className="income-section-title">NOI Analysis</h3>
        <textarea
          className="income-narrative-textarea"
          placeholder="Describe the net operating income derivation..."
          value={String(getValue('income-noi-narrative') || '')}
          onChange={onInputChange('income-noi-narrative')}
        />
      </div>

      <div className="income-section-card">
        <h3 className="income-section-title">Cap Rate Analysis</h3>
        <textarea
          className="income-narrative-textarea"
          placeholder="Describe the capitalization rate selection..."
          value={String(getValue('income-cap-rate-analysis') || '')}
          onChange={onInputChange('income-cap-rate-analysis')}
        />
      </div>

      {/* Value Indication */}
      <div className="income-section-card">
        <h3 className="income-section-title">Value Indication</h3>
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

      {/* Direct Capitalization Output */}
      <div className="income-section-card">
        <h3 className="income-section-title">Direct Capitalization</h3>
        <ThemeProvider>
          <div className="income-output-table">
            <IncomeApproachPanel />
          </div>
        </ThemeProvider>
      </div>
    </div>
  );

  // Render active sub-tab content
  const renderActiveTab = () => {
    switch (activeSubTab) {
      case 'revenue': return renderRevenueTab();
      case 'vacancy': return renderVacancyTab();
      case 'expenses': return renderExpensesTab();
      case 'value': return renderValueTab();
    }
  };

  return (
    <div className="income-tab-panel">
      <div className="income-tab-container">
        {/* Header */}
        <div className="income-header-bar">
          <h2>Income Approach</h2>
          <p className="income-header-description">
            Direct Capitalization - Page 48
          </p>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="income-subtab-bar">
          <button
            className={`income-subtab ${activeSubTab === 'revenue' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('revenue')}
          >
            Revenue
          </button>
          <button
            className={`income-subtab ${activeSubTab === 'vacancy' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('vacancy')}
          >
            Vacancy
          </button>
          <button
            className={`income-subtab ${activeSubTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('expenses')}
          >
            Expenses
          </button>
          <button
            className={`income-subtab ${activeSubTab === 'value' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('value')}
          >
            Value
          </button>
        </div>

        {/* Active Sub-Tab Content */}
        {renderActiveTab()}
      </div>
    </div>
  );
}
