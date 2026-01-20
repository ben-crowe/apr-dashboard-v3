import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Save, X, ZoomIn, ZoomOut, RotateCcw, ChevronUp, ChevronDown } from "lucide-react";
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
  const [zoomLevel, setZoomLevel] = useState(75); // Default zoom 75%
  const [fontSize, setFontSize] = useState(12); // Default font size 12px
  const [leftPanelWidth, setLeftPanelWidth] = useState(50); // Default 50% width
  const [isResizing, setIsResizing] = useState(false);

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

  // Update preview when sections change or zoom changes
  useEffect(() => {
    if (sections.size > 0 && initialHTML && editableSections.length > 0) {
      const reconstructed = reconstructHTML(initialHTML, sections, editableSections);
      
      // Inject zoom CSS into the HTML (exactly like LOEPreviewModal does)
      const zoomDecimal = zoomLevel / 100;
      const scaleValue = 0.9 + (zoomDecimal - 0.75) * 0.5; // Adjust scale proportionally
      
      const scaledHTML = reconstructed.replace(
        '</head>',
        `<style>
          body {
            zoom: ${zoomDecimal};
            transform: scale(${scaleValue});
            transform-origin: top center;
            max-width: 850px;
            margin: 0 auto;
            padding: 20px;
            overflow-x: hidden;
          }
          .document {
            max-width: 850px;
            margin: 0 auto;
          }
          @media print {
            body {
              zoom: 1;
              transform: none;
              max-width: 100%;
            }
          }
        </style>
        </head>`
      );
      
      const blob = new Blob([scaledHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [sections, initialHTML, editableSections, zoomLevel]);

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

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(200, prev + 10)); // Max 200%
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(25, prev - 10)); // Min 25%
  };

  const handleZoomReset = () => {
    setZoomLevel(75); // Reset to 75%
  };

  const handleFontSizeIncrease = () => {
    setFontSize(prev => Math.min(prev + 1, 20)); // Max 20px
  };

  const handleFontSizeDecrease = () => {
    setFontSize(prev => Math.max(prev - 1, 10)); // Min 10px
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    let isDragging = true;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      e.stopPropagation();
      
      const container = document.querySelector('[data-resize-container]') as HTMLElement;
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      // Constrain between 25% and 75%
      const constrainedWidth = Math.max(25, Math.min(75, newLeftWidth));
      setLeftPanelWidth(constrainedWidth);
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      isDragging = false;
      setIsResizing(false);
    };

    const handleMouseLeave = () => {
      isDragging = false;
      setIsResizing(false);
    };

    // Use capture phase to ensure we catch the event
    document.addEventListener('mousemove', handleMouseMove, { passive: false, capture: true });
    document.addEventListener('mouseup', handleMouseUp, { passive: false, capture: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: false, capture: true });
    
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      isDragging = false;
      document.removeEventListener('mousemove', handleMouseMove, { capture: true });
      document.removeEventListener('mouseup', handleMouseUp, { capture: true });
      document.removeEventListener('mouseleave', handleMouseLeave, { capture: true });
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[95vw] !max-h-[95vh] w-[95vw] h-[95vh] overflow-hidden flex flex-col p-4 [&>button]:hidden">
        {/* Header - Matching LOEPreviewModal */}
        <div className="flex justify-between items-center pb-2 border-b">
          <div>
            <h2 className="text-lg font-semibold">Edit LOE Template</h2>
            <p className="text-sm text-gray-600">Edit template content and preview changes</p>
          </div>
          
          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="h-6 w-6 p-0 hover:bg-transparent dark:hover:bg-transparent text-gray-600 dark:text-gray-400"
              title="Zoom Out"
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            
            <span className="text-xs font-medium px-2 min-w-[45px] text-center text-gray-600 dark:text-gray-400">
              {zoomLevel}%
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="h-6 w-6 p-0 hover:bg-transparent dark:hover:bg-transparent text-gray-600 dark:text-gray-400"
              title="Zoom In"
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomReset}
              className="h-6 w-6 p-0 hover:bg-transparent dark:hover:bg-transparent text-gray-600 dark:text-gray-400"
              title="Reset Zoom"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0 overflow-hidden pt-4 gap-2" data-resize-container>
          {/* Form Editor Side */}
          <div 
            className="flex flex-col min-w-0 border rounded-lg bg-white dark:bg-gray-900 relative"
            style={{ width: `calc(${leftPanelWidth}% - 8px)`, minWidth: '300px' }}
          >
            {/* Resizer Divider - Part of editor panel border */}
            <div
              className="absolute right-0 top-0 bottom-0 w-1 bg-transparent hover:bg-gray-400 dark:hover:bg-gray-500 cursor-col-resize transition-colors z-30"
              onMouseDown={handleMouseDown}
              style={{ marginRight: '-4px' }}
            />
            
            {/* Container with padding for content */}
            <div className="flex flex-col flex-1 min-h-0 overflow-hidden p-3">
              {/* Font Size Control - Fixed Position Header */}
              <div className="flex items-center justify-end gap-1 sticky top-0 z-20 border-b border-gray-200 dark:border-gray-700 mb-2 -mx-3 px-3 py-2 bg-white dark:bg-gray-900 shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFontSizeDecrease}
                className="h-5 w-5 p-0 hover:bg-transparent dark:hover:bg-transparent text-gray-600 dark:text-gray-400"
                title="Decrease Font Size"
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
              
              <span className="text-xs font-medium px-1 min-w-[30px] text-center text-gray-600 dark:text-gray-400">
                {fontSize}px
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFontSizeIncrease}
                className="h-5 w-5 p-0 hover:bg-transparent dark:hover:bg-transparent text-gray-600 dark:text-gray-400"
                title="Increase Font Size"
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              </div>
              
              {/* Scrollable content container */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="space-y-2 px-2 pt-1 pb-4" style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize * 1.3}px` }}>

              {/* DOCUMENT ORDER RENDERING - Shows both editable and read-only sections */}

              {/* Header - Read-only */}
              <div className="text-gray-400 dark:text-gray-500 text-xs mb-2 pb-2 border-b border-gray-200 dark:border-gray-700 select-none">
                [Company Logo]
                <div className="text-right">
                  [Date]<br/>
                  [Client Name] | [Client Contact]<br/>
                  [Client Address]
                </div>
              </div>

              {/* Subject Line - Editable boilerplate + read-only field placeholders */}
              {editableSections.find(s => s.id === 'subject-line') && (() => {
                const section = editableSections.find(s => s.id === 'subject-line')!;
                const currentValue = sections.get(section.id) || '';
                return (
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Subject Line</div>
                    <div className="space-y-1">
                      <Textarea
                        value={currentValue}
                        onChange={(e) => handleSectionChange(section.id, e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded resize-y bg-white dark:bg-gray-800 dark:text-gray-100 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600"
                        rows={2}
                        style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize * 1.3}px` }}
                      />
                      {section.placeholders.length > 0 && (
                        <div className="text-xs text-gray-400 dark:text-gray-500 italic select-none px-2">
                          {section.placeholders.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Introduction - Editable */}
              {editableSections.find(s => s.id === 'intro') && (() => {
                const section = editableSections.find(s => s.id === 'intro')!;
                const currentValue = sections.get(section.id) || '';
                return (
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Introduction Paragraph</div>
                    <Textarea
                      value={currentValue}
                      onChange={(e) => handleSectionChange(section.id, e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded resize-y bg-white dark:bg-gray-800 dark:text-gray-100 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600"
                      rows={3}
                      style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize * 1.3}px` }}
                    />
                  </div>
                );
              })()}

              {/* Property Details Table - All fields editable */}
              <div className="mb-3 text-sm border border-gray-200 dark:border-gray-700 rounded overflow-hidden">
                <div className="text-xs font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 border-b border-gray-200 dark:border-gray-700">Property Details</div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {/* All table rows are editable - users can override field values */}
                  {editableSections
                    .filter(s => s.id.startsWith('table-row-'))
                    .map((section) => {
                      const currentValue = sections.get(section.id) || '';
                      return (
                        <div key={section.id} className="grid grid-cols-2 gap-2 px-2 py-1.5">
                          <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{section.label}</div>
                          <Textarea
                            value={currentValue}
                            onChange={(e) => handleSectionChange(section.id, e.target.value)}
                            className="text-xs p-1 border border-gray-300 dark:border-gray-600 rounded resize-y bg-white dark:bg-gray-800 dark:text-gray-100 focus:border-gray-400 dark:focus:border-gray-500"
                            rows={1}
                            style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize * 1.3}px` }}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Terms & Conditions - Editable */}
              {editableSections.find(s => s.id === 'terms') && (() => {
                const section = editableSections.find(s => s.id === 'terms')!;
                const currentValue = sections.get(section.id) || '';
                return (
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Terms & Conditions</div>
                    <Textarea
                      value={currentValue}
                      onChange={(e) => handleSectionChange(section.id, e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded resize-y bg-white dark:bg-gray-800 dark:text-gray-100 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600"
                      rows={12}
                      style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize * 1.3}px` }}
                    />
                  </div>
                );
              })()}

              {/* Closing Statement - Editable */}
              {editableSections.find(s => s.id === 'action') && (() => {
                const section = editableSections.find(s => s.id === 'action')!;
                const currentValue = sections.get(section.id) || '';
                return (
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Closing Statement</div>
                    <Textarea
                      value={currentValue}
                      onChange={(e) => handleSectionChange(section.id, e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded resize-y bg-white dark:bg-gray-800 dark:text-gray-100 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600"
                      rows={2}
                      style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize * 1.3}px` }}
                    />
                  </div>
                );
              })()}

              {/* Signature Block - Read-only */}
              <div className="text-gray-400 dark:text-gray-500 text-xs select-none mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div>Sincerely,</div>
                <div className="font-semibold">Valta Property Valuations Ltd.</div>
                <div className="mt-2">[Signature Image]</div>
                <div className="mt-4">
                  <div>Client Signature: _________________</div>
                  <div className="mt-2">Date: _________________</div>
                </div>
              </div>

                </div>
              </div>

              {/* Footer with save buttons */}
              <div className="flex gap-2 mt-2 px-2 py-2 border-t sticky bottom-0 bg-white dark:bg-gray-900 z-10 -mx-3 px-3">
              <Button 
                onClick={handleSaveClick} 
                variant="outline" 
                size="sm"
                className="h-7 px-2 text-xs gap-1" 
                disabled={isSaving}
              >
                <Save className="h-3 w-3" />
                Save Template
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onClose} 
                className="h-7 px-2 text-xs"
                disabled={isSaving}
              >
                <X className="h-3 w-3" />
                Cancel
              </Button>
              </div>
            </div>
          </div>

          {/* Preview Side */}
          <div 
            className="border rounded-lg overflow-hidden min-w-0 bg-gray-50 dark:bg-gray-800 flex flex-col"
            style={{ width: `calc(${100 - leftPanelWidth}% - 8px)`, minWidth: '300px' }}
          >
            
            {/* Preview Container with Zoom */}
            <div className="flex-1 overflow-auto min-h-0">
              {previewUrl ? (
                <div 
                  className="w-full flex justify-center"
                  style={{
                    padding: '16px',
                    minHeight: '100%'
                  }}
                >
                  <iframe
                    src={previewUrl}
                    className="border"
                    style={{
                      width: '100%',
                      height: '2000px',
                      minHeight: '2000px',
                      display: 'block',
                      border: '1px solid #e5e7eb',
                      margin: 0,
                      padding: 0
                    }}
                    title="Template Preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Loading preview...
                </div>
              )}
            </div>
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
