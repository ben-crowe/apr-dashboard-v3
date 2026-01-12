/**
 * Unit Mix Section Component
 * 
 * Displays 6 unit types × 5 fields each (30 inputs total)
 */

import { useCalculatorStore } from '../../store/calculatorStore';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function UnitMixSection() {
  const inputs = useCalculatorStore((state) => state.inputs);
  const updateInput = useCalculatorStore((state) => state.updateInput);
  const devMode = useCalculatorStore((state) => state.devMode);

  const handleChange = (fieldId: keyof typeof inputs, value: string) => {
    if (fieldId.includes('name')) {
      updateInput(fieldId, value);
    } else {
      const numValue = parseFloat(value) || 0;
      updateInput(fieldId, numValue);
    }
  };

  return (
    <Accordion type="single" collapsible defaultValue="unit-mix">
      <AccordionItem value="unit-mix">
        <AccordionTrigger>Unit Mix (6 types)</AccordionTrigger>
        <AccordionContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left p-2 font-semibold text-gray-900 dark:text-gray-100">Unit Type</th>
                  <th className="text-center p-2 font-semibold text-gray-900 dark:text-gray-100">Count</th>
                  <th className="text-center p-2 font-semibold text-gray-900 dark:text-gray-100">Avg SF</th>
                  <th className="text-right p-2 font-semibold text-gray-900 dark:text-gray-100">Contract $/Mo</th>
                  <th className="text-right p-2 font-semibold text-gray-900 dark:text-gray-100">Market $/Mo</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6].map((type) => (
                  <tr key={type} className="border-b dark:border-gray-700">
                    <td className="p-2">
                      <Input
                        type="text"
                        placeholder={`Type ${type} name`}
                        value={inputs[`calc-type${type}-name` as keyof typeof inputs] as string || ''}
                        onChange={(e) => handleChange(`calc-type${type}-name` as keyof typeof inputs, e.target.value)}
                        className="w-full"
                      />
                      {devMode && (
                        <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 font-mono">
                          calc-type{type}-name
                        </div>
                      )}
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        placeholder="0"
                        value={inputs[`calc-type${type}-count` as keyof typeof inputs] || ''}
                        onChange={(e) => handleChange(`calc-type${type}-count` as keyof typeof inputs, e.target.value)}
                        className="w-20 text-center"
                      />
                      {devMode && (
                        <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 font-mono text-center">
                          calc-type{type}-count
                        </div>
                      )}
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        placeholder="0"
                        value={inputs[`calc-type${type}-sf` as keyof typeof inputs] || ''}
                        onChange={(e) => handleChange(`calc-type${type}-sf` as keyof typeof inputs, e.target.value)}
                        className="w-20 text-center"
                      />
                      {devMode && (
                        <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 font-mono text-center">
                          calc-type{type}-sf
                        </div>
                      )}
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        placeholder="0"
                        value={inputs[`calc-type${type}-contract-rent` as keyof typeof inputs] || ''}
                        onChange={(e) => handleChange(`calc-type${type}-contract-rent` as keyof typeof inputs, e.target.value)}
                        className="w-24 text-right"
                      />
                      {devMode && (
                        <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 font-mono text-right">
                          calc-type{type}-contract-rent
                        </div>
                      )}
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        placeholder="0"
                        value={inputs[`calc-type${type}-rent` as keyof typeof inputs] || ''}
                        onChange={(e) => handleChange(`calc-type${type}-rent` as keyof typeof inputs, e.target.value)}
                        className="w-24 text-right"
                      />
                      {devMode && (
                        <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 font-mono text-right">
                          calc-type{type}-rent
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
