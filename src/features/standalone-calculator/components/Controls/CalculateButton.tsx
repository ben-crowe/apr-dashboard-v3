/**
 * Calculate Button Component
 * 
 * Triggers calculation engine and updates preview
 */

import { useCalculatorStore } from '../../store/calculatorStore';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

export function CalculateButton() {
  const runCalculations = useCalculatorStore((state) => state.runCalculations);

  const handleClick = () => {
    runCalculations();
  };

  return (
    <Button onClick={handleClick} className="gap-2">
      <Calculator className="h-4 w-4" />
      Calculate
    </Button>
  );
}
