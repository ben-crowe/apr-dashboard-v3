/**
 * Zoom Controls Component
 * 
 * Buttons to control iframe zoom: Fit Width, 100%, 150%
 */

import { useCalculatorStore } from '../../store/calculatorStore';
import { Button } from '@/components/ui/button';

const zoomLevels = [
  { value: 'fit' as const, label: 'Fit Width' },
  { value: '100%' as const, label: '100%' },
  { value: '150%' as const, label: '150%' },
];

export function ZoomControls() {
  const zoomLevel = useCalculatorStore((state) => state.zoomLevel);
  const setZoomLevel = useCalculatorStore((state) => state.setZoomLevel);

  return (
    <div className="flex items-center gap-2">
      {zoomLevels.map((level) => (
        <Button
          key={level.value}
          variant={zoomLevel === level.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => setZoomLevel(level.value)}
        >
          {level.label}
        </Button>
      ))}
    </div>
  );
}
