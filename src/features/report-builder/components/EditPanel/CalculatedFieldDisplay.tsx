import { Label } from '@/components/ui/label';
import { ReportField } from '../../types/reportBuilder.types';

interface CalculatedFieldDisplayProps {
  field: ReportField;
}

export default function CalculatedFieldDisplay({ field }: CalculatedFieldDisplayProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.id} className="text-white">{field.label}</Label>
      <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-gray-300">
        {field.value}
        {field.calculationFormula && (
          <span className="ml-auto text-xs italic text-gray-400">
            ({field.calculationFormula})
          </span>
        )}
      </div>
    </div>
  );
}
