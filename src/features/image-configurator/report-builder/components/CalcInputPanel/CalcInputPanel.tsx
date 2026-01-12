/**
 * CalcInputPanel.tsx
 * Renders input fields for calculator section (calc) in collapsible sections
 * User enters data here, sees calculated results in panels below
 */

import { useState, useCallback, useMemo, ChangeEvent } from 'react';
import { useReportBuilderStore } from '../../store/reportBuilderStore';
import './CalcInputPanel.css';

// All section IDs for expand/collapse all functionality
const ALL_SECTION_IDS = [
  'unit-mix',
  'other-income',
  'vacancy-loss',
  'operating-expenses',
  'cap-rate',
  'adjustments'
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
    <div className={`calc-section ${isCollapsed ? 'collapsed' : ''}`} id={id}>
      <div className="calc-section-header" onClick={onToggle}>
        <h3>{title}</h3>
        <div className="calc-collapse-icon">&#9660;</div>
      </div>
      <div className="calc-section-content">
        {children}
      </div>
    </div>
  );
}

// Unit Type Row Component (expandable sub-section)
interface UnitTypeRowProps {
  typeNum: number;
  isExpanded: boolean;
  onToggle: () => void;
  getValue: (fieldId: string) => string | number | boolean;
  onInputChange: (fieldId: string) => (e: ChangeEvent<HTMLInputElement>) => void;
}

function UnitTypeRow({ typeNum, isExpanded, onToggle, getValue, onInputChange }: UnitTypeRowProps) {
  const prefix = `calc-type${typeNum}`;
  const typeName = getValue(`${prefix}-name`) || `Unit Type ${typeNum}`;

  return (
    <div className={`unit-type-row ${isExpanded ? 'expanded' : ''}`}>
      <div className="unit-type-header" onClick={onToggle}>
        <span className="unit-type-label">Type {typeNum}: {String(typeName)}</span>
        <span className="unit-type-expand">{isExpanded ? '−' : '+'}</span>
      </div>
      {isExpanded && (
        <div className="unit-type-fields">
          <div className="calc-form-grid calc-form-grid-5">
            <div className="calc-form-group">
              <label>Name</label>
              <input
                type="text"
                value={String(getValue(`${prefix}-name`) || '')}
                onChange={onInputChange(`${prefix}-name`)}
                placeholder="e.g., 1 Bed / 1 Bath"
              />
            </div>
            <div className="calc-form-group">
              <label>Count</label>
              <input
                type="number"
                value={String(getValue(`${prefix}-count`) || '')}
                onChange={onInputChange(`${prefix}-count`)}
                placeholder="0"
              />
            </div>
            <div className="calc-form-group">
              <label>Avg SF</label>
              <input
                type="number"
                value={String(getValue(`${prefix}-sf`) || '')}
                onChange={onInputChange(`${prefix}-sf`)}
                placeholder="0"
              />
            </div>
            <div className="calc-form-group">
              <label>Market Rent/Mo</label>
              <input
                type="number"
                value={String(getValue(`${prefix}-rent`) || '')}
                onChange={onInputChange(`${prefix}-rent`)}
                placeholder="$0"
              />
            </div>
            <div className="calc-form-group">
              <label>Contract Rent/Mo</label>
              <input
                type="number"
                value={String(getValue(`${prefix}-contract-rent`) || '')}
                onChange={onInputChange(`${prefix}-contract-rent`)}
                placeholder="$0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CalcInputPanel() {
  const { sections, updateFieldValue, runCalculations } = useReportBuilderStore();

  // Track collapsed state for each section (all expanded by default for inputs)
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  // Track expanded unit type rows
  const [expandedUnitTypes, setExpandedUnitTypes] = useState<Set<number>>(new Set([1]));

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

  // Toggle unit type row expansion
  const toggleUnitType = useCallback((typeNum: number) => {
    setExpandedUnitTypes(prev => {
      const next = new Set(prev);
      if (next.has(typeNum)) {
        next.delete(typeNum);
      } else {
        next.add(typeNum);
      }
      return next;
    });
  }, []);

  // Check if all sections are collapsed
  const allCollapsed = useMemo(() => {
    return ALL_SECTION_IDS.every(id => collapsedSections.has(id));
  }, [collapsedSections]);

  // Toggle all sections
  const toggleAllSections = useCallback(() => {
    if (allCollapsed) {
      setCollapsedSections(new Set());
    } else {
      setCollapsedSections(new Set(ALL_SECTION_IDS));
    }
  }, [allCollapsed]);

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

  // Update field in store and trigger calculations
  const handleChange = useCallback((fieldId: string, value: string | number | boolean) => {
    updateFieldValue(fieldId, value);
    // Trigger calculations after a short delay to batch updates
    setTimeout(() => runCalculations(), 0);
  }, [updateFieldValue, runCalculations]);

  // Input change handler
  const onInputChange = useCallback((fieldId: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    handleChange(fieldId, value);
  }, [handleChange]);

  return (
    <div className="calc-input-panel">
      <div className="calc-input-container">
        {/* Quick controls */}
        <div className="calc-quick-controls">
          <span className="calc-quick-link" onClick={toggleAllSections}>
            <span className="chevron">{allCollapsed ? '>' : 'v'}</span>
            {allCollapsed ? 'Expand All' : 'Collapse All'}
          </span>
        </div>

        {/* 1. UNIT MIX */}
        <CollapsibleSection
          id="unit-mix"
          title="Unit Mix"
          isCollapsed={collapsedSections.has('unit-mix')}
          onToggle={() => toggleSection('unit-mix')}
        >
          <div className="unit-mix-container">
            {[1, 2, 3, 4].map(typeNum => (
              <UnitTypeRow
                key={typeNum}
                typeNum={typeNum}
                isExpanded={expandedUnitTypes.has(typeNum)}
                onToggle={() => toggleUnitType(typeNum)}
                getValue={getValue}
                onInputChange={onInputChange}
              />
            ))}
          </div>
        </CollapsibleSection>

        {/* 2. OTHER INCOME */}
        <CollapsibleSection
          id="other-income"
          title="Other Income"
          isCollapsed={collapsedSections.has('other-income')}
          onToggle={() => toggleSection('other-income')}
        >
          <div className="calc-form-grid calc-form-grid-3">
            <div className="calc-form-group">
              <label>Parking $/Unit/Mo</label>
              <input
                type="number"
                value={String(getValue('calc-parking-per-unit') || '')}
                onChange={onInputChange('calc-parking-per-unit')}
                placeholder="$0"
              />
            </div>
            <div className="calc-form-group">
              <label>Laundry $/Unit/Mo</label>
              <input
                type="number"
                value={String(getValue('calc-laundry-per-unit') || '')}
                onChange={onInputChange('calc-laundry-per-unit')}
                placeholder="$0"
              />
            </div>
            <div className="calc-form-group">
              <label>Other Income (Annual)</label>
              <input
                type="number"
                value={String(getValue('calc-other-income') || '')}
                onChange={onInputChange('calc-other-income')}
                placeholder="$0"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* 3. VACANCY & LOSS */}
        <CollapsibleSection
          id="vacancy-loss"
          title="Vacancy & Loss"
          isCollapsed={collapsedSections.has('vacancy-loss')}
          onToggle={() => toggleSection('vacancy-loss')}
        >
          <div className="calc-form-grid calc-form-grid-3">
            <div className="calc-form-group">
              <label>Vacancy Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={String(getValue('calc-vacancy-rate') || '')}
                onChange={onInputChange('calc-vacancy-rate')}
                placeholder="5.0"
              />
            </div>
            <div className="calc-form-group">
              <label>Bad Debt Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={String(getValue('calc-bad-debt-rate') || '')}
                onChange={onInputChange('calc-bad-debt-rate')}
                placeholder="1.0"
              />
            </div>
            <div className="calc-form-group">
              <label>Concessions Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={String(getValue('calc-concessions-rate') || '')}
                onChange={onInputChange('calc-concessions-rate')}
                placeholder="0.5"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* 4. OPERATING EXPENSES */}
        <CollapsibleSection
          id="operating-expenses"
          title="Operating Expenses"
          isCollapsed={collapsedSections.has('operating-expenses')}
          onToggle={() => toggleSection('operating-expenses')}
        >
          <div className="calc-form-grid calc-form-grid-4">
            <div className="calc-form-group">
              <label>Taxes (Annual)</label>
              <input
                type="number"
                value={String(getValue('calc-exp-taxes-annual') || '')}
                onChange={onInputChange('calc-exp-taxes-annual')}
                placeholder="$0"
              />
            </div>
            <div className="calc-form-group">
              <label>Insurance (Annual)</label>
              <input
                type="number"
                value={String(getValue('calc-exp-insurance-annual') || '')}
                onChange={onInputChange('calc-exp-insurance-annual')}
                placeholder="$0"
              />
            </div>
            <div className="calc-form-group">
              <label>Repairs & Maint (Annual)</label>
              <input
                type="number"
                value={String(getValue('calc-exp-repairs-annual') || '')}
                onChange={onInputChange('calc-exp-repairs-annual')}
                placeholder="$0"
              />
            </div>
            <div className="calc-form-group">
              <label>Payroll (Annual)</label>
              <input
                type="number"
                value={String(getValue('calc-exp-payroll-annual') || '')}
                onChange={onInputChange('calc-exp-payroll-annual')}
                placeholder="$0"
              />
            </div>
            <div className="calc-form-group">
              <label>Utilities (Annual)</label>
              <input
                type="number"
                value={String(getValue('calc-exp-utilities-annual') || '')}
                onChange={onInputChange('calc-exp-utilities-annual')}
                placeholder="$0"
              />
            </div>
            <div className="calc-form-group">
              <label>Management (Annual)</label>
              <input
                type="number"
                value={String(getValue('calc-exp-management-annual') || '')}
                onChange={onInputChange('calc-exp-management-annual')}
                placeholder="$0"
              />
            </div>
            <div className="calc-form-group span-2">
              <label>Other Expenses (Annual)</label>
              <input
                type="number"
                value={String(getValue('calc-exp-other-annual') || '')}
                onChange={onInputChange('calc-exp-other-annual')}
                placeholder="$0"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* 5. CAP RATE */}
        <CollapsibleSection
          id="cap-rate"
          title="Cap Rate"
          isCollapsed={collapsedSections.has('cap-rate')}
          onToggle={() => toggleSection('cap-rate')}
        >
          <div className="calc-form-grid calc-form-grid-3">
            <div className="calc-form-group">
              <label>Cap Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={String(getValue('calc-cap-rate') || '')}
                onChange={onInputChange('calc-cap-rate')}
                placeholder="5.50"
              />
            </div>
            <div className="calc-form-group">
              <label>Range Low (%)</label>
              <input
                type="number"
                step="0.01"
                value={String(getValue('cap-rate-range-low') || '')}
                onChange={onInputChange('cap-rate-range-low')}
                placeholder="5.00"
              />
            </div>
            <div className="calc-form-group">
              <label>Range High (%)</label>
              <input
                type="number"
                step="0.01"
                value={String(getValue('cap-rate-range-high') || '')}
                onChange={onInputChange('cap-rate-range-high')}
                placeholder="6.00"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* 6. ADJUSTMENTS */}
        <CollapsibleSection
          id="adjustments"
          title="Adjustments"
          isCollapsed={collapsedSections.has('adjustments')}
          onToggle={() => toggleSection('adjustments')}
        >
          <div className="calc-form-grid calc-form-grid-3">
            <div className="calc-form-group">
              <label>CapEx Adjustment</label>
              <input
                type="number"
                value={String(getValue('calc-adj-capex') || '')}
                onChange={onInputChange('calc-adj-capex')}
                placeholder="$0"
              />
            </div>
            <div className="calc-form-group">
              <label>Leasing Costs</label>
              <input
                type="number"
                value={String(getValue('calc-adj-leasing') || '')}
                onChange={onInputChange('calc-adj-leasing')}
                placeholder="$0"
              />
            </div>
            <div className="calc-form-group">
              <label>Other Adjustments</label>
              <input
                type="number"
                value={String(getValue('calc-adj-other') || '')}
                onChange={onInputChange('calc-adj-other')}
                placeholder="$0"
              />
            </div>
          </div>
        </CollapsibleSection>

      </div>
    </div>
  );
}

// Also export as named export for flexibility
export { CalcInputPanel };
