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
  console.log('TemplateEditorModal: Component rendered', {
    isOpen,
    hasInitialHTML: !!initialHTML,
    initialHTMLLength: initialHTML?.length || 0
  });
  
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

  // Auto-resize textarea based on content
  const handleTextareaResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    // Reset height to auto to get accurate scrollHeight
    textarea.style.height = 'auto';
    // Calculate minimum height based on padding (p-2 = 8px top + 8px bottom = 16px, p-1 = 4px top + 4px bottom = 8px)
    const padding = textarea.classList.contains('p-1') ? 8 : 16;
    const minHeight = fontSize * 1.3 + padding; // Single line height + padding
    // Set height to scrollHeight (content height), but at least one line
    const newHeight = Math.max(textarea.scrollHeight, minHeight);
    textarea.style.height = newHeight + 'px';
  };

  // Auto-resize all textareas on initial load and when sections change
  useEffect(() => {
    if (isOpen && editableSections.length > 0) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        const textareas = document.querySelectorAll('textarea[data-auto-resize="true"]');
        textareas.forEach((textarea: HTMLTextAreaElement) => {
          // Reset to minimal height first
          textarea.style.height = 'auto';
          // Calculate height based on content or default to single line
          const minHeight = fontSize * 1.3; // Single line height
          const contentHeight = textarea.scrollHeight;
          textarea.style.height = Math.max(minHeight, contentHeight) + 'px';
        });
      });
    }
  }, [isOpen, sections, fontSize, editableSections.length]);

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

  // Generate preview HTML with zoom CSS
  const generatePreviewHTML = (html: string): string => {
    const zoomDecimal = zoomLevel / 100;
    const scaleValue = 0.9 + (zoomDecimal - 0.75) * 0.5;
    
    const styleCSS = `<style>
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
        </style>`;
    
    if (html.includes('</head>')) {
      return html.replace('</head>', `${styleCSS}\n        </head>`);
    } else if (html.includes('</html>')) {
      return html.replace('</html>', `${styleCSS}\n        </html>`);
    } else {
      return styleCSS + '\n' + html;
    }
  };

  // Update preview when modal opens, sections change, or zoom changes
  useEffect(() => {
    console.log('TemplateEditorModal: Preview useEffect triggered', {
      isOpen,
      hasInitialHTML: !!initialHTML,
      initialHTMLLength: initialHTML?.length || 0,
      currentPreviewUrl: previewUrl ? 'exists' : 'none'
    });
    
    if (!isOpen) {
      // Clean up when modal closes
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
      }
      return;
    }
    
    if (!initialHTML || initialHTML.trim().length === 0) {
      console.error('TemplateEditorModal: No initialHTML provided or empty');
      setPreviewUrl('');
      return;
    }
    
    // Always generate preview - use original HTML if reconstruction fails
    let htmlToUse = initialHTML;
    
    try {
      if (editableSections.length > 0 && sections.size > 0) {
        htmlToUse = reconstructHTML(initialHTML, sections, editableSections);
      } else if (editableSections.length > 0) {
        const sectionsToUse = new Map(editableSections.map(s => [s.id, s.content]));
        htmlToUse = reconstructHTML(initialHTML, sectionsToUse, editableSections);
      }
    } catch (reconstructError) {
      console.warn('TemplateEditorModal: Reconstruction failed, using original HTML:', reconstructError);
      htmlToUse = initialHTML;
    }
    
    // Always generate preview HTML with zoom CSS
    try {
      const scaledHTML = generatePreviewHTML(htmlToUse);
      const blob = new Blob([scaledHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Revoke old URL before setting new one
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      setPreviewUrl(url);
      console.log('TemplateEditorModal: Preview URL created successfully');
      
      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (error) {
      console.error('TemplateEditorModal: Failed to create preview blob:', error);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl('');
    }
  }, [isOpen, sections, initialHTML, editableSections, zoomLevel]);

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
            <h2 className="text-lg font-semibold">Edit Contract</h2>
            <p className="text-sm text-muted-foreground">Edit template content and preview changes</p>
          </div>
          
          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="h-6 w-6 p-0 hover:bg-transparent dark:hover:bg-transparent text-muted-foreground"
              title="Zoom Out"
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            
            <span className="text-xs font-medium px-2 min-w-[45px] text-center text-muted-foreground">
              {zoomLevel}%
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="h-6 w-6 p-0 hover:bg-transparent dark:hover:bg-transparent text-muted-foreground"
              title="Zoom In"
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomReset}
              className="h-6 w-6 p-0 hover:bg-transparent dark:hover:bg-transparent text-muted-foreground"
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
            className="flex flex-col min-w-0 border rounded-lg bg-background relative"
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
              <div className="flex items-center justify-end gap-1 sticky top-0 z-20 border-b border-border mb-2 -mx-3 px-3 py-2 bg-background shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFontSizeDecrease}
                className="h-5 w-5 p-0 hover:bg-transparent dark:hover:bg-transparent text-muted-foreground"
                title="Decrease Font Size"
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
              
              <span className="text-xs font-medium px-1 min-w-[30px] text-center text-muted-foreground">
                {fontSize}px
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFontSizeIncrease}
                className="h-5 w-5 p-0 hover:bg-transparent dark:hover:bg-transparent text-muted-foreground"
                title="Increase Font Size"
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              </div>
              
              {/* Scrollable content container */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="space-y-2 px-2 pt-1 pb-4" style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize * 1.3}px` }}>

              {/* GENERIC SECTION RENDERING (2026-06-13) — one box per editable section the
                  parser returns, id-agnostic. Replaces the old 5 hardcoded section IDs
                  (subject-line/intro/table-row/terms/action) which silently rendered NOTHING for
                  marker-based (ed-N) templates. Works for BOTH the V07 marker template and the
                  legacy class-based templates — labels come from section.label. The full letter
                  (header, signatures, locked titles) lives in the live preview pane on the right. */}

              {editableSections.length === 0 && (
                <div className="text-xs text-muted-foreground italic select-none px-2 py-6 text-center">
                  No editable sections found in this template.
                </div>
              )}

              {/* GROUPED RENDERING (2026-06-13) — the numbered section title shows ONCE as a header;
                  the editable boxes sit under it with only their short field sub-label (no repeated
                  section number). Numbered subsections (14.1–14.10) are their own group titles. */}
              {(() => {
                const groups: { title: string; items: EditableSection[] }[] = [];
                for (const s of editableSections) {
                  const title = s.sectionTitle || s.label || 'Section';
                  const last = groups[groups.length - 1];
                  if (last && last.title === title) last.items.push(s);
                  else groups.push({ title, items: [s] });
                }
                return groups.map((g, gi) => {
                  // Number ONLY real numbered-list items (<ol>, e.g. the Appendix) — counter
                  // advances only for those, so they read 1..N matching the page. Field-named
                  // boxes show their name; bullets + prose + titles get NO label (the page has
                  // no numbers there either).
                  let orderedNum = 0;
                  return (
                  <div key={gi} className="mb-4">
                    <div className="text-sm font-semibold text-foreground border-b border-border pb-1 mb-2">
                      {g.title}
                    </div>
                    {g.items.map((section) => {
                      const currentValue = sections.get(section.id) || '';
                      const micro = section.fieldLabel
                        ? { text: section.fieldLabel, cls: 'text-xs font-medium text-muted-foreground' }
                        : section.ordered
                          ? { text: String(++orderedNum), cls: 'text-[10px] font-semibold text-muted-foreground/70' }
                          : null;
                      return (
                        <div key={section.id} className="mb-3">
                          {micro && (
                            <div className={`mb-1 ${micro.cls}`}>{micro.text}</div>
                          )}
                          <Textarea
                            value={currentValue}
                            onChange={(e) => {
                              handleSectionChange(section.id, e.target.value);
                              handleTextareaResize(e);
                            }}
                            data-auto-resize="true"
                            className="w-full p-2 border border-border rounded resize-none bg-card text-foreground hover:border-gray-400 focus-visible:border-gray-400 focus-visible:outline-none focus-visible:ring-0 overflow-hidden"
                            rows={1}
                            style={{
                              fontSize: `${fontSize}px`,
                              lineHeight: `${fontSize * 1.3}px`,
                              height: 'auto',
                              minHeight: `${fontSize * 1.3 + 16}px`,
                            }}
                          />
                          {section.placeholders.length > 0 && (
                            <div className="text-xs text-gray-400 dark:text-muted-foreground italic select-none px-2 mt-0.5">
                              {section.placeholders.join(', ')}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  );
                });
              })()}

                </div>
              </div>

              {/* Footer with save buttons */}
              <div className="flex gap-2 mt-2 px-2 py-2 border-t sticky bottom-0 bg-background z-10 -mx-3 px-3">
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
            className="border rounded-lg overflow-hidden min-w-0 bg-muted flex flex-col"
            style={{ width: `calc(${100 - leftPanelWidth}% - 8px)`, minWidth: '300px' }}
          >
            
            {/* Preview Container with Zoom */}
            <div className="flex-1 overflow-auto min-h-0 bg-muted">
              {(() => {
                console.log('TemplateEditorModal: Rendering preview panel', {
                  hasPreviewUrl: !!previewUrl,
                  previewUrlLength: previewUrl.length,
                  hasInitialHTML: !!initialHTML
                });
                
                if (previewUrl) {
                  return (
                    <div 
                      className="w-full h-full flex justify-center items-start"
                      style={{
                        padding: '16px'
                      }}
                    >
                      <iframe
                        key={previewUrl} // Force re-render when URL changes
                        src={previewUrl}
                        className="border bg-card shadow-sm"
                        style={{
                          width: '100%',
                          height: '100%',
                          minHeight: '2000px',
                          display: 'block',
                          border: '1px solid #e5e7eb',
                          borderRadius: '4px',
                          margin: 0,
                          padding: 0
                        }}
                        title="Template Preview"
                        sandbox="allow-same-origin allow-scripts"
                        onLoad={() => {
                          console.log('TemplateEditorModal: Preview iframe loaded successfully');
                          console.log('TemplateEditorModal: Iframe src:', previewUrl.substring(0, 100));
                        }}
                        onError={(e) => {
                          console.error('TemplateEditorModal: Preview iframe error:', e);
                          console.error('TemplateEditorModal: Failed URL:', previewUrl);
                        }}
                      />
                    </div>
                  );
                } else if (initialHTML) {
                  return (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-2"></div>
                        <div>Generating preview...</div>
                        <div className="text-xs mt-2">HTML length: {initialHTML.length}</div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div>No template available</div>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Save Template</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="e.g., Standard LOE, Commercial LOE"
                    className="mt-1 bg-card border border-border text-foreground placeholder:text-muted-foreground hover:border-gray-400 focus-visible:border-gray-400 focus-visible:outline-none focus-visible:ring-0"
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
