/**
 * Capitalization Rate & Adjustments Section Component
 * 
 * 5 inputs: cap-rate, cap-rate-2, adj-capex, adj-leasing, adj-other
 */

import { useCalculatorStore } from '../../store/calculatorStore';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function CapRateSection() {
  const inputs = useCalculatorStore((state) => state.inputs);
  const updateInput = useCalculatorStore((state) => state.updateInput);
  const devMode = useCalculatorStore((state) => state.devMode);

  const handleChange = (fieldId: keyof typeof inputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    updateInput(fieldId, numValue);
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="cap-rate">
        <AccordionTrigger>Capitalization</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block text-gray-900 dark:text-gray-100">Cap Rate (%)</label>
              <Input
                type="number"
                step="0.25"
                placeholder="0"
                value={inputs['calc-cap-rate'] || ''}
                onChange={(e) => handleChange('calc-cap-rate', e.target.value)}
              />
              {devMode && (
                <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 font-mono">
                  calc-cap-rate
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block text-gray-900 dark:text-gray-100">Cap Rate 2 (%)</label>
              <Input
                type="number"
                step="0.25"
                placeholder="—"
                value={inputs['calc-cap-rate-2'] || ''}
                onChange={(e) => handleChange('calc-cap-rate-2', e.target.value)}
              />
              {devMode && (
                <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 font-mono">
                  calc-cap-rate-2
                </div>
              )}
            </div>
            <div className="pt-2 border-t dark:border-gray-700">
              <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100">Adjustments</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block text-gray-900 dark:text-gray-100">CapEx Adjustment</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={inputs['calc-adj-capex'] || ''}
                    onChange={(e) => handleChange('calc-adj-capex', e.target.value)}
                  />
                  {devMode && (
                    <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 font-mono">
                      calc-adj-capex
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block text-gray-900 dark:text-gray-100">Leasing Costs</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={inputs['calc-adj-leasing'] || ''}
                    onChange={(e) => handleChange('calc-adj-leasing', e.target.value)}
                  />
                  {devMode && (
                    <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 font-mono">
                      calc-adj-leasing
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block text-gray-900 dark:text-gray-100">Other Adjustments</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={inputs['calc-adj-other'] || ''}
                    onChange={(e) => handleChange('calc-adj-other', e.target.value)}
                  />
                  {devMode && (
                    <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 font-mono">
                      calc-adj-other
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
