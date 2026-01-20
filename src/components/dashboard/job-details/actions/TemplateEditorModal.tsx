import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Save, X } from "lucide-react";
import { toast } from "sonner";
import { parseTemplate, reconstructHTML, EditableSection } from "@/utils/loe/templateParser";

interface TemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialHTML: string;
  onSave: (templateName: string, editedHTML: string, setAsDefault: boolean) => Promise<void>;
}

const TemplateEditorModal: React.FC<TemplateEditorModalProps> = ({
  isOpen,
  onClose,
  initialHTML,
  onSave
}) => {
  const [sections, setSections] = useState<Map<string, string>>(new Map());
  const [previewUrl, setPreviewUrl] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Parse template into editable sections when modal opens
  const editableSections = useMemo(() => {
    if (!isOpen || !initialHTML) return [];
    return parseTemplate(initialHTML);
  }, [isOpen, initialHTML]);

  // Initialize sections from parsed template
  useEffect(() => {
    if (isOpen && editableSections.length > 0) {
      const initialSections = new Map<string, string>();
      editableSections.forEach(section => {
        initialSections.set(section.id, section.content);
      });
      setSections(initialSections);
      setShowSaveDialog(false);
      setTemplateName('');
      setSetAsDefault(false);
    }
  }, [isOpen, editableSections]);

  // Update preview when sections change
  useEffect(() => {
    if (sections.size > 0 && initialHTML && editableSections.length > 0) {
      const reconstructed = reconstructHTML(initialHTML, sections, editableSections);
      const blob = new Blob([reconstructed], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [sections, initialHTML, editableSections]);

  const handleSectionChange = (sectionId: string, value: string) => {
    setSections(prev => {
      const updated = new Map(prev);
      updated.set(sectionId, value);
      return updated;
    });
  };

  const handleSaveClick = () => {
    // Check if field placeholders are intact
    const placeholderPattern = /\[[\w.-]+\]/g;
    const originalPlaceholders = (initialHTML.match(placeholderPattern) || []).sort();
    
    // Collect all placeholders from edited sections
    const editedPlaceholders: string[] = [];
    sections.forEach(content => {
      const matches = content.match(placeholderPattern) || [];
      editedPlaceholders.push(...matches);
    });
    const sortedEdited = editedPlaceholders.sort();
    
    if (JSON.stringify(originalPlaceholders) !== JSON.stringify(sortedEdited)) {
      toast.error('Warning: Field placeholders have been modified! Please ensure all [field] placeholders are intact.');
      return;
    }

    setShowSaveDialog(true);
  };

  const handleSave = async () => {
    if (!templateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    setIsSaving(true);
    try {
      const reconstructed = reconstructHTML(initialHTML, sections, editableSections);
      await onSave(templateName.trim(), reconstructed, setAsDefault);
      setShowSaveDialog(false);
      setTemplateName('');
      setSetAsDefault(false);
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[95vw] !max-h-[95vh] w-[95vw] h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit LOE Template</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 flex-1 min-h-0 overflow-hidden">
          {/* Form Editor Side */}
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto pr-2">
            <div className="space-y-1 p-2">
              {editableSections.map((section) => {
                // Calculate appropriate rows based on content length
                const contentLength = section.content.length;
                const rows = section.type === 'intro' 
                  ? 4 
                  : section.type === 'term' 
                    ? Math.max(3, Math.min(8, Math.ceil(contentLength / 80)))
                    : section.type === 'table-cell'
                      ? Math.max(2, Math.min(6, Math.ceil(contentLength / 100)))
                      : 4;

                return (
                  <div key={section.id} className="border rounded p-2 bg-white dark:bg-gray-900 shadow-sm">
                    <Textarea
                      value={sections.get(section.id) || ''}
                      onChange={(e) => handleSectionChange(section.id, e.target.value)}
                      rows={rows}
                      className="border-gray-300 dark:border-gray-700 resize-y min-h-[60px]"
                      placeholder={`Enter ${section.label.toLowerCase()}...`}
                    />
                    {section.placeholders.length > 0 && (
                      <div className="mt-1">
                        <div className="flex flex-wrap gap-1">
                          {section.placeholders.map((placeholder) => (
                            <Badge 
                              key={placeholder} 
                              variant="secondary"
                              className="text-xs"
                            >
                              {placeholder}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 mt-4 p-4 border-t sticky bottom-0 bg-white dark:bg-gray-900 z-10">
              <Button onClick={handleSaveClick} className="gap-2" disabled={isSaving}>
                <Save className="h-4 w-4" />
                Save Template
              </Button>
              <Button variant="outline" onClick={onClose} disabled={isSaving}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>

          {/* Preview Side */}
          <div className="flex-1 border rounded-lg overflow-y-auto min-w-0 bg-gray-50 dark:bg-gray-800">
            {previewUrl ? (
              <iframe
                src={previewUrl}
                className="w-full h-full min-h-[600px]"
                title="Template Preview"
                sandbox="allow-same-origin"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Loading preview...
              </div>
            )}
          </div>
        </div>

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Save Template</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="e.g., Standard LOE, Commercial LOE"
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="set-default"
                    checked={setAsDefault}
                    onCheckedChange={(checked) => setSetAsDefault(checked as boolean)}
                  />
                  <Label htmlFor="set-default" className="cursor-pointer">
                    Set as my default template
                  </Label>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={isSaving || !templateName.trim()}>
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowSaveDialog(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TemplateEditorModal;
