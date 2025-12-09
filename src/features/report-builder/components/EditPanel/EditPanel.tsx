import { useReportBuilderStore } from '../../store/reportBuilderStore';
import { cn } from '@/lib/utils';
import TextFieldEditor from './TextFieldEditor';
import ImageFieldEditor from './ImageFieldEditor';
import CalculatedFieldDisplay from './CalculatedFieldDisplay';
import { ReportField } from '../../types/reportBuilder.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Play, Image as ImageIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mapping of which image fields should appear in which sections
const SECTION_IMAGE_MAPPING: Record<string, string[]> = {
  'cover': ['img-cover-photo', 'img-signature'],
  'maps': ['img-map-regional', 'img-map-local', 'img-map-aerial-1', 'img-map-aerial-2', 'img-zoning-map', 'img-site-plan-1', 'img-site-plan-2'],
  'photos': [
    'img-exterior-1', 'img-exterior-2', 'img-exterior-3', 'img-exterior-4', 'img-exterior-5', 'img-exterior-6',
    'img-street-1', 'img-street-2', 'img-street-3',
    'img-common-1', 'img-common-2', 'img-common-3', 'img-common-4',
    'img-unit-1', 'img-unit-2', 'img-unit-3', 'img-unit-4', 'img-unit-5', 'img-unit-6',
    'img-systems-1', 'img-systems-2', 'img-systems-3', 'img-systems-4'
  ],
};

export default function EditPanel() {
  const { sections, activeSection, updateFieldValue, loadCalcTestData, loadFullTestData } = useReportBuilderStore();

  const currentSection = sections.find((s) => s.id === activeSection);
  const imageMgtSection = sections.find((s) => s.id === 'image-mgt');

  // Get related image fields from image-mgt section for the current section
  const getRelatedImageFields = (): ReportField[] => {
    if (!imageMgtSection || !activeSection) return [];

    const imageFieldIds = SECTION_IMAGE_MAPPING[activeSection] || [];
    if (imageFieldIds.length === 0) return [];

    const relatedFields: ReportField[] = [];

    // Search in image-mgt main fields
    for (const field of imageMgtSection.fields) {
      if (imageFieldIds.includes(field.id)) {
        relatedFields.push(field);
      }
    }

    // Search in image-mgt subsections
    if (imageMgtSection.subsections) {
      for (const subsection of imageMgtSection.subsections) {
        for (const field of subsection.fields) {
          if (imageFieldIds.includes(field.id)) {
            relatedFields.push(field);
          }
        }
      }
    }

    return relatedFields;
  };

  const relatedImages = getRelatedImageFields();

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
      <div className="bg-[#1a4480] text-white px-4 py-3 font-semibold text-lg flex items-center justify-between">
        <span>{currentSection.name.toUpperCase()}</span>
        <button
          onClick={loadFullTestData}
          className="text-xs font-normal text-blue-200 hover:text-white transition-colors"
        >
          Load Test Data
        </button>
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

        {/* Related Images from Image Management */}
        {relatedImages.length > 0 && (
          <div className="mb-8">
            <div className="bg-emerald-700 text-white px-4 py-2 font-semibold text-sm mb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              SECTION IMAGES
            </div>
            <p className="text-xs text-muted-foreground mb-4 px-2">
              Images for this section (managed in S3 IMAGE MGT)
            </p>
            <div className="grid grid-cols-2 gap-4 pl-2">
              {relatedImages.map(renderField)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
