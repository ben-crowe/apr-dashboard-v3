/**
 * Operating Expenses Section Component
 * 
 * 7 inputs: taxes-annual, insurance-annual, repairs-annual, utilities-annual,
 * management-annual, reserves-annual, other-annual
 */

import { useCalculatorStore } from '../../store/calculatorStore';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const expenseFields = [
  { id: 'calc-exp-taxes-annual', label: 'Taxes (Annual)' },
  { id: 'calc-exp-insurance-annual', label: 'Insurance (Annual)' },
  { id: 'calc-exp-repairs-annual', label: 'Repairs & Maintenance (Annual)' },
  { id: 'calc-exp-utilities-annual', label: 'Utilities (Annual)' },
  { id: 'calc-exp-management-annual', label: 'Management (Annual)' },
  { id: 'calc-exp-reserves-annual', label: 'Reserves (Annual)' },
  { id: 'calc-exp-other-annual', label: 'Other Expenses (Annual)' },
] as const;

export function ExpensesSection() {
  const inputs = useCalculatorStore((state) => state.inputs);
  const updateInput = useCalculatorStore((state) => state.updateInput);
  const devMode = useCalculatorStore((state) => state.devMode);

  const handleChange = (fieldId: keyof typeof inputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    updateInput(fieldId, numValue);
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="expenses">
        <AccordionTrigger>Operating Expenses (Annual)</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            {expenseFields.map((field) => (
              <div key={field.id}>
                <label className="text-sm font-medium mb-1 block">{field.label}</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={inputs[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
                {devMode && (
                  <div className="text-xs text-yellow-600 mt-1 font-mono">
                    {field.id}
                  </div>
                )}
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
