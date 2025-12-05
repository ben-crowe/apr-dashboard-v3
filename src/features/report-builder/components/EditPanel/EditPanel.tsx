import { useReportBuilderStore } from '../../store/reportBuilderStore';
import { cn } from '@/lib/utils';
import TextFieldEditor from './TextFieldEditor';
import ImageFieldEditor from './ImageFieldEditor';
import CalculatedFieldDisplay from './CalculatedFieldDisplay';
import { ReportField } from '../../types/reportBuilder.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function EditPanel() {
  const { sections, activeSection, updateFieldValue, loadCalcTestData } = useReportBuilderStore();

  const currentSection = sections.find((s) => s.id === activeSection);

  if (!currentSection) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Select a section to edit</p>
      </div>
    );
  }

  const getFieldBackgroundClass = (field: ReportField) => {
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

  const renderField = (field: ReportField) => {
    if (field.type === 'image') {
      return (
        <div key={field.id} className="mb-6">
          <ImageFieldEditor field={field} />
        </div>
      );
    }

    if (field.type === 'calculated') {
      return (
        <div key={field.id} className="mb-6">
          <CalculatedFieldDisplay field={field} />
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <div key={field.id} className="mb-6">
          <TextFieldEditor field={field} />
        </div>
      );
    }

    if (field.type === 'dropdown' && field.options) {
      return (
        <div key={field.id} className="mb-6">
          <Label htmlFor={field.id} className="text-sm font-medium mb-2 block">
            {field.label}
          </Label>
          <Select
            value={String(field.value)}
            onValueChange={(value) => updateFieldValue(field.id, value)}
            disabled={!field.isEditable}
          >
            <SelectTrigger
              id={field.id}
              className={cn('w-full', getFieldBackgroundClass(field))}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    return (
      <div key={field.id} className="mb-6">
        {field.placeholder && (
          <p className="text-sm text-red-600 mb-2 font-medium">
            {field.placeholder}
          </p>
        )}
        <Label htmlFor={field.id} className="text-sm font-medium mb-2 block">
          {field.label}
        </Label>
        <Input
          id={field.id}
          type={field.type}
          value={String(field.value)}
          onChange={(e) => {
            const newValue = field.type === 'number'
              ? parseFloat(e.target.value) || 0
              : e.target.value;
            updateFieldValue(field.id, newValue);
          }}
          disabled={!field.isEditable}
          className={cn('w-full', getFieldBackgroundClass(field))}
        />
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Blue section header */}
      <div className="bg-[#1a4480] text-white px-4 py-3 font-semibold text-lg">
        {currentSection.name.toUpperCase()}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Calculator Test Data Button - Only show for CALC section */}
        {currentSection.id === 'calc' && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-blue-900">Calculator Test Mode</h4>
                <p className="text-sm text-blue-700">Load North Battleford sample data to verify calculations</p>
              </div>
              <Button
                onClick={loadCalcTestData}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <Play className="w-4 h-4 mr-2" />
                Load Valcre Test Data
              </Button>
            </div>
          </div>
        )}

        {/* Main section fields */}
        {currentSection.fields.length > 0 && (
          <div className="mb-8">
            {currentSection.fields.map(renderField)}
          </div>
        )}

        {/* Subsections with blue headers */}
        {currentSection.subsections?.map((subsection) => (
          <div key={subsection.id} className="mb-8">
            <div className="bg-[#1a4480] text-white px-4 py-2 font-semibold text-sm mb-4">
              {subsection.title}
            </div>
            <div className="pl-2">
              {subsection.fields.map(renderField)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
