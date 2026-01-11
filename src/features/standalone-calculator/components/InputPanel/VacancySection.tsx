/**
 * Vacancy & Loss Section Component
 * 
 * 4 inputs: vacancy-rate, concessions-rate, credit-loss-rate, other-loss-rate
 */

import { useCalculatorStore } from '../../store/calculatorStore';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function VacancySection() {
  const inputs = useCalculatorStore((state) => state.inputs);
  const updateInput = useCalculatorStore((state) => state.updateInput);
  const devMode = useCalculatorStore((state) => state.devMode);

  const handleChange = (fieldId: keyof typeof inputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    updateInput(fieldId, numValue);
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="vacancy">
        <AccordionTrigger>Vacancy & Loss</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Vacancy Rate (%)</label>
              <Input
                type="number"
                step="0.1"
                placeholder="0"
                value={inputs['calc-vacancy-rate'] || ''}
                onChange={(e) => handleChange('calc-vacancy-rate', e.target.value)}
              />
              {devMode && (
                <div className="text-xs text-yellow-600 mt-1 font-mono">
                  calc-vacancy-rate
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Concessions Rate (%)</label>
              <Input
                type="number"
                step="0.1"
                placeholder="0"
                value={inputs['calc-concessions-rate'] || ''}
                onChange={(e) => handleChange('calc-concessions-rate', e.target.value)}
              />
              {devMode && (
                <div className="text-xs text-yellow-600 mt-1 font-mono">
                  calc-concessions-rate
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Credit Loss Rate (%)</label>
              <Input
                type="number"
                step="0.1"
                placeholder="0"
                value={inputs['calc-credit-loss-rate'] || ''}
                onChange={(e) => handleChange('calc-credit-loss-rate', e.target.value)}
              />
              {devMode && (
                <div className="text-xs text-yellow-600 mt-1 font-mono">
                  calc-credit-loss-rate
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Other Loss Rate (%)</label>
              <Input
                type="number"
                step="0.1"
                placeholder="0"
                value={inputs['calc-other-loss-rate'] || ''}
                onChange={(e) => handleChange('calc-other-loss-rate', e.target.value)}
              />
              {devMode && (
                <div className="text-xs text-yellow-600 mt-1 font-mono">
                  calc-other-loss-rate
                </div>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
