/**
 * Dev Mode Toggle Component
 * 
 * Toggles field ID visibility (yellow highlights)
 */

import { useCalculatorStore } from '../../store/calculatorStore';
import { Button } from '@/components/ui/button';
import { Code } from 'lucide-react';

export function DevModeToggle() {
  const devMode = useCalculatorStore((state) => state.devMode);
  const toggleDevMode = useCalculatorStore((state) => state.toggleDevMode);

  return (
    <Button
      onClick={toggleDevMode}
      variant={devMode ? 'default' : 'outline'}
      size="sm"
      className="gap-2"
    >
      <Code className="h-4 w-4" />
      Dev Mode
    </Button>
  );
}
