/**
 * Other Income Section Component
 * 
 * 3 inputs: parking-per-unit, laundry-per-unit, other-income-annual
 */

import { useCalculatorStore } from '../../store/calculatorStore';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function OtherIncomeSection() {
  const inputs = useCalculatorStore((state) => state.inputs);
  const updateInput = useCalculatorStore((state) => state.updateInput);
  const devMode = useCalculatorStore((state) => state.devMode);

  const handleChange = (fieldId: keyof typeof inputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    updateInput(fieldId, numValue);
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="other-income">
        <AccordionTrigger>Other Income</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block text-gray-900 dark:text-gray-100">Parking $/Unit/Mo</label>
              <Input
                type="number"
                placeholder="0"
                value={inputs['calc-parking-per-unit'] || ''}
                onChange={(e) => handleChange('calc-parking-per-unit', e.target.value)}
              />
              {devMode && (
                <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 font-mono">
                  calc-parking-per-unit
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block text-gray-900 dark:text-gray-100">Laundry $/Unit/Mo</label>
              <Input
                type="number"
                placeholder="0"
                value={inputs['calc-laundry-per-unit'] || ''}
                onChange={(e) => handleChange('calc-laundry-per-unit', e.target.value)}
              />
              {devMode && (
                <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 font-mono">
                  calc-laundry-per-unit
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block text-gray-900 dark:text-gray-100">Other Income (Annual)</label>
              <Input
                type="number"
                placeholder="0"
                value={inputs['calc-other-income-annual'] || ''}
                onChange={(e) => handleChange('calc-other-income-annual', e.target.value)}
              />
              {devMode && (
                <div className="text-xs text-yellow-600 mt-1 font-mono">
                  calc-other-income-annual
                </div>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
