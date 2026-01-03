/**
 * ReconTabPanel.tsx
 * Renders the RECONCILIATION tab for final value reconciliation
 * Embeds ReconciliationPanel which combines Income, Sales, and Cost approaches
 */

import { useCallback } from 'react';
import { useReportBuilderStore } from '../../store/reportBuilderStore';
import { ThemeProvider } from '@/features/calculator-demo-v4/context/ThemeContext';
import ReconciliationPanel from '@/features/calculator-demo-v4/components/ReconciliationPanel';
import './ReconTabPanel.css';

export default function ReconTabPanel() {
  const { sections } = useReportBuilderStore();

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
    return 0;
  }, [sections]);

  // Get values from store for reconciliation
  const incomeValue = Number(getValue('income-value-indication')) || 0;
  const salesIndicatedValue = Number(getValue('sales-value-indication')) || 0;
  const costValue = Number(getValue('cost-value-indication')) || 0;

  return (
    <div className="recon-tab-panel">
      <div className="recon-tab-container">
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
      </div>
    </div>
  );
}
