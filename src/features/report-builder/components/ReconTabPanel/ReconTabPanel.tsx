/**
 * ReconTabPanel.tsx
 * Renders the RECONCILIATION tab for final value reconciliation
 * Embeds ReconciliationPanel which combines Income, Sales, and Cost approaches
 * Plus Value Narratives collapsible section for final conclusions
 */

import { useState, useCallback, useMemo, ChangeEvent } from 'react';
import { useReportBuilderStore } from '../../store/reportBuilderStore';
import { ThemeProvider } from '@/features/calculator-demo-v4/context/ThemeContext';
import ReconciliationPanel from '@/features/calculator-demo-v4/components/ReconciliationPanel';
import './ReconTabPanel.css';

// All section IDs for expand/collapse all functionality
const ALL_SECTION_IDS = [
  'recon-narratives'
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
    <div className={`recon-section ${isCollapsed ? 'collapsed' : ''}`} id={id}>
      <div className="recon-section-header" onClick={onToggle}>
        <h3>{title}</h3>
        <div className="recon-header-controls">
          <div className="recon-collapse-icon">&#9660;</div>
        </div>
      </div>
      <div className="recon-section-content">
        {children}
      </div>
    </div>
  );
}

export default function ReconTabPanel() {
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

  // Get values from store for reconciliation
  const incomeValue = Number(getValue('income-value-indication')) || 0;
  const salesIndicatedValue = Number(getValue('sales-value-indication')) || 0;
  const costValue = Number(getValue('cost-value-indication')) || 0;

  return (
    <div className="recon-tab-panel">
      <div className="recon-tab-container">
        {/* Minimal controls - right aligned text links */}
        <div className="recon-quick-controls">
          <span className="recon-quick-link" onClick={toggleAllSections}>
            <span className="recon-chevron">{allCollapsed ? '>' : 'v'}</span>
            {allCollapsed ? 'Expand' : 'Collapse'}
          </span>
        </div>

        {/* Header */}
        <div className="recon-header">
          <h2 className="recon-title">RECONCILIATION</h2>
          <p className="recon-intro">
            Final value conclusion based on all approaches. Adjust the weights below to reflect
            the relative reliability of each valuation method for this property type and market.
          </p>
        </div>

        {/* Reconciliation Panel */}
        <div className="recon-panel-wrapper">
          <ThemeProvider>
            <ReconciliationPanel
              incomeValue={incomeValue}
              salesIndicatedValue={salesIndicatedValue}
              costValue={costValue}
            />
          </ThemeProvider>
        </div>

        {/* Section Divider */}
        <div className="recon-divider">
          <div className="recon-divider-line"></div>
          <span className="recon-divider-text">Value Narratives</span>
          <div className="recon-divider-line"></div>
        </div>

        {/* VALUE NARRATIVES SECTION */}
        <CollapsibleSection
          id="recon-narratives"
          title="Reconciliation Narratives"
          isCollapsed={collapsedSections.has('recon-narratives')}
          onToggle={() => toggleSection('recon-narratives')}
        >
          <div className="recon-form-grid">
            {/* Final Value Conclusion */}
            <div className="recon-form-group full-width">
              <label>Final Value Conclusion</label>
              <textarea
                className="recon-narrative-textarea"
                placeholder="Provide the final value conclusion narrative, explaining the reconciliation of all approaches and the rationale for the concluded value..."
                value={String(getValue('final-value-conclusion') || '')}
                onChange={onInputChange('final-value-conclusion')}
              />
            </div>

            {/* Value Scenario 1 */}
            <div className="recon-form-group full-width">
              <label>Value Scenario 1 (Text)</label>
              <textarea
                className="recon-narrative-textarea"
                placeholder="Value Scenario 1 expressed in words (e.g., 'One Million Eight Hundred Thousand Dollars')..."
                value={String(getValue('value-scenario1-text') || '')}
                onChange={onInputChange('value-scenario1-text')}
              />
            </div>

            {/* Value Scenario 2 */}
            <div className="recon-form-group full-width">
              <label>Value Scenario 2 (Text)</label>
              <textarea
                className="recon-narrative-textarea"
                placeholder="Value Scenario 2 expressed in words (e.g., 'Zero Dollars' for hypothetical condition scenarios)..."
                value={String(getValue('value-scenario2-text') || '')}
                onChange={onInputChange('value-scenario2-text')}
              />
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
