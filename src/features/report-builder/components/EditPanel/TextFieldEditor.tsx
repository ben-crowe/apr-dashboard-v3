import { useCallback, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useReportBuilderStore } from '../../store/reportBuilderStore';
import { ReportField } from '../../types/reportBuilder.types';
import { debounce } from '../../utils/previewDebounce';
import { cn } from '@/lib/utils';

interface TextFieldEditorProps {
  field: ReportField;
}

export default function TextFieldEditor({ field }: TextFieldEditorProps) {
  const updateFieldValue = useReportBuilderStore((state) => state.updateFieldValue);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Create debounced update function
  const debouncedUpdate = useCallback(
    debounce((fieldId: string, value: string) => {
      updateFieldValue(fieldId, value);
    }, 300),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    debouncedUpdate(field.id, e.target.value);
  };

  // Initialize input with current value
  useEffect(() => {
    if (inputRef.current && typeof field.value === 'string') {
      inputRef.current.value = field.value;
    }
  }, [field.value]);

  // Get background color class based on input type
  const getFieldBackgroundClass = () => {
    if (!field.inputType) return '';

    switch (field.inputType) {
      case 'user-input':
        return 'bg-yellow-100 border-yellow-300';
      case 'dropdown':
        return 'bg-blue-100 border-blue-300';
      case 'auto-filled':
        return 'bg-green-50 border-green-300 text-green-700';
      default:
        return '';
    }
  };

  const isMultiline = field.type === 'textarea';

  return (
    <div className="space-y-2">
      <Label htmlFor={field.id}>{field.label}</Label>
      {isMultiline ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          id={field.id}
          className={cn(
            'flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            getFieldBackgroundClass()
          )}
          defaultValue={field.value as string}
          onChange={handleChange}
          disabled={!field.isEditable}
        />
      ) : (
        <Input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          id={field.id}
          type="text"
          defaultValue={field.value as string}
          onChange={handleChange}
          disabled={!field.isEditable}
          className={getFieldBackgroundClass()}
        />
      )}
    </div>
  );
}
