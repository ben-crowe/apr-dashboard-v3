/**
 * Input Panel - 62 Calculator Fields
 *
 * Displays all calculator input fields organized in collapsible sections:
 * - Unit Mix (20 fields)
 * - Totals (6 calculated fields)
 * - Other Income (6 fields)
 * - Vacancy & Loss (5 fields)
 * - Operating Expenses (11 fields)
 * - Cap Rate (1 field)
 * - Adjustments (4 fields)
 */

import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';

export default function InputPanel() {
  const { sections, updateFieldValue, runCalculations } = useReportBuilderStore();

  const calcSection = sections.find(s => s.id === 'calc');

  const getFieldValue = (fieldId: string): number => {
    if (!calcSection) return 0;

    const field = calcSection.fields.find(f => f.id === fieldId);
    if (field) return Number(field.value) || 0;

    if (calcSection.subsections) {
      for (const sub of calcSection.subsections) {
        const subField = sub.fields.find(f => f.id === fieldId);
        if (subField) return Number(subField.value) || 0;
      }
    }
    return 0;
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    updateFieldValue(fieldId, numValue);
  };

  // Trigger calculations when any field changes
  useEffect(() => {
    runCalculations();
  }, [sections, runCalculations]);

  const renderInputField = (fieldId: string, label: string, unit?: string, readOnly = false) => {
    const value = getFieldValue(fieldId);

    return (
      <div className="space-y-1.5">
        <Label htmlFor={fieldId} className="text-xs font-medium">
          {label}
        </Label>
        <div className="relative">
          <Input
            id={fieldId}
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(fieldId, e.target.value)}
            readOnly={readOnly}
            className={`text-sm ${readOnly ? 'bg-slate-100 text-slate-600' : ''}`}
            step="0.01"
          />
          {unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
              {unit}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
      <Accordion type="multiple" defaultValue={['unit-mix', 'other-income', 'vacancy', 'expenses', 'cap-rate']} className="space-y-2">

        {/* Unit Mix Section */}
        <AccordionItem value="unit-mix">
          <AccordionTrigger className="text-sm font-semibold">
            Unit Mix (20 fields)
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            {[1, 2, 3, 4].map(type => (
              <div key={type} className="p-3 border rounded-lg space-y-3 bg-white">
                <h4 className="font-medium text-sm text-slate-700">Type {type}</h4>
                {renderInputField(`calc-type${type}-name`, 'Unit Type')}
                {renderInputField(`calc-type${type}-count`, 'Count', 'units')}
                {renderInputField(`calc-type${type}-sf`, 'SF/Unit', 'SF')}
                {renderInputField(`calc-type${type}-rent`, 'Rent', '$/mo')}
                {renderInputField(`calc-type${type}-annual`, 'Annual Revenue', '$', true)}
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Totals Section */}
        <AccordionItem value="totals">
          <AccordionTrigger className="text-sm font-semibold">
            Totals (6 calculated fields)
          </AccordionTrigger>
          <AccordionContent className="space-y-3 p-3 bg-slate-50 rounded-lg">
            {renderInputField('calc-total-units', 'Total Units', 'units', true)}
            {renderInputField('calc-total-sf', 'Total SF', 'SF', true)}
            {renderInputField('calc-avg-unit-sf', 'Avg Unit SF', 'SF', true)}
            {renderInputField('calc-total-rental-revenue', 'Total Rental Revenue', '$', true)}
            {renderInputField('calc-avg-rent-per-unit', 'Avg Rent/Unit', '$/mo', true)}
            {renderInputField('calc-avg-rent-per-sf', 'Avg Rent/SF', '$/SF', true)}
          </AccordionContent>
        </AccordionItem>

        {/* Other Income Section */}
        <AccordionItem value="other-income">
          <AccordionTrigger className="text-sm font-semibold">
            Other Income (6 fields)
          </AccordionTrigger>
          <AccordionContent className="space-y-3">
            {renderInputField('calc-parking-per-unit', 'Parking/Unit', '$/mo')}
            {renderInputField('calc-parking-total', 'Parking Total', '$/yr', true)}
            {renderInputField('calc-laundry-per-unit', 'Laundry/Unit', '$/mo')}
            {renderInputField('calc-laundry-total', 'Laundry Total', '$/yr', true)}
            {renderInputField('calc-other-income', 'Other Income', '$/yr')}
            {renderInputField('calc-total-other-income', 'Total Other Income', '$/yr', true)}
          </AccordionContent>
        </AccordionItem>

        {/* Vacancy & Loss Section */}
        <AccordionItem value="vacancy">
          <AccordionTrigger className="text-sm font-semibold">
            Vacancy & Loss (5 fields)
          </AccordionTrigger>
          <AccordionContent className="space-y-3">
            {renderInputField('calc-vacancy-rate', 'Vacancy Rate', '%')}
            {renderInputField('calc-bad-debt-rate', 'Bad Debt Rate', '%')}
            {renderInputField('calc-concessions-rate', 'Concessions Rate', '%')}
            {renderInputField('calc-vacancy-loss', 'Vacancy Loss', '$', true)}
            {renderInputField('calc-egr', 'EGR', '$', true)}
          </AccordionContent>
        </AccordionItem>

        {/* Operating Expenses Section */}
        <AccordionItem value="expenses">
          <AccordionTrigger className="text-sm font-semibold">
            Operating Expenses (11 fields)
          </AccordionTrigger>
          <AccordionContent className="space-y-3">
            {renderInputField('calc-exp-management', 'Management', '% EGR')}
            {renderInputField('calc-exp-taxes', 'Taxes', '$/unit/yr')}
            {renderInputField('calc-exp-insurance', 'Insurance', '$/unit/yr')}
            {renderInputField('calc-exp-repairs', 'Repairs', '$/unit/yr')}
            {renderInputField('calc-exp-utilities', 'Utilities', '$/unit/yr')}
            {renderInputField('calc-exp-payroll', 'Payroll', '$/unit/yr')}
            {renderInputField('calc-exp-admin', 'Admin', '$/unit/yr')}
            {renderInputField('calc-exp-reserves', 'Reserves', '$/unit/yr')}
            {renderInputField('calc-exp-other', 'Other', '$/unit/yr')}
            {renderInputField('calc-expenses-total', 'Total Expenses', '$', true)}
            {renderInputField('calc-expense-ratio', 'Expense Ratio', '%', true)}
          </AccordionContent>
        </AccordionItem>

        {/* Cap Rate Section */}
        <AccordionItem value="cap-rate">
          <AccordionTrigger className="text-sm font-semibold">
            Cap Rate (1 field)
          </AccordionTrigger>
          <AccordionContent className="space-y-3">
            {renderInputField('calc-cap-rate', 'Capitalization Rate', '%')}
          </AccordionContent>
        </AccordionItem>

        {/* Adjustments Section */}
        <AccordionItem value="adjustments">
          <AccordionTrigger className="text-sm font-semibold">
            Adjustments (4 fields)
          </AccordionTrigger>
          <AccordionContent className="space-y-3">
            {renderInputField('calc-adj-capex', 'CapEx', '$')}
            {renderInputField('calc-adj-leasing', 'Leasing Costs', '$')}
            {renderInputField('calc-adj-other', 'Other Adjustments', '$')}
            {renderInputField('calc-adj-total', 'Total Adjustments', '$', true)}
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
