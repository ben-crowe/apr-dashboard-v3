import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DetailJob, JobDetails } from "@/types/job";
import { Send, X, Download, Mail, Plus, ZoomIn, ZoomOut, RotateCcw, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import TemplateEditorModal from './TemplateEditorModal';
import { saveTemplate, loadAllTemplates, loadTemplateById, setDefaultTemplate, LOETemplate } from '@/utils/loe/saveTemplate';
import { generateLOEHTML } from '@/utils/loe/generateLOE';

interface LOEPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: DetailJob;
  jobDetails: JobDetails;
  documentHTML: string;
  onApprove: (recipientEmail?: string) => Promise<void>;
}

const LOEPreviewModal: React.FC<LOEPreviewModalProps> = ({
  isOpen,
  onClose,
  job,
  jobDetails,
  documentHTML,
  onApprove
}) => {
  const [isSending, setIsSending] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [showEmailEdit, setShowEmailEdit] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(75); // Default zoom 75%
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedHTML, setEditedHTML] = useState<string>('');
  const [templateModified, setTemplateModified] = useState(false);
  
  // Template picker state
  const [templates, setTemplates] = useState<LOETemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [currentDocumentHTML, setCurrentDocumentHTML] = useState<string>(documentHTML);

  // Initialize recipient email - Default to bc@crowestudio.com for testing (developer's email)
  // Users can change it via "Change Recipient" button if needed
  useEffect(() => {
    // For testing: Default to developer's email (bc@crowestudio.com)
    // Users can override via "Change Recipient" button
    const testEmail = 'bc@crowestudio.com';
    setRecipientEmail(testEmail);
    console.log('📧 Default email set to:', testEmail, '(testing mode)');
  }, []);

  // Load templates when modal opens
  useEffect(() => {
    if (isOpen) {
      loadTemplates();
      setCurrentDocumentHTML(documentHTML);
    }
  }, [isOpen]);

  // Update currentDocumentHTML when documentHTML prop changes
  useEffect(() => {
    if (isOpen) {
      setCurrentDocumentHTML(documentHTML);
    }
  }, [documentHTML, isOpen]);

  const loadTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const loadedTemplates = await loadAllTemplates();
      setTemplates(loadedTemplates);
      
      // Find default template
      const defaultTemplate = loadedTemplates.find(t => t.is_default);
      if (defaultTemplate) {
        setSelectedTemplateId(defaultTemplate.id);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const handleTemplateChange = async (templateId: string) => {
    if (templateId === selectedTemplateId) return;
    
    setIsRegenerating(true);
    try {
      const template = await loadTemplateById(templateId);
      if (!template) {
        toast.error('Template not found');
        return;
      }

      // Regenerate LOE with selected template
      const regeneratedHTML = await generateLOEHTML(job, jobDetails, template.template_html);
      setCurrentDocumentHTML(regeneratedHTML);
      setEditedHTML(''); // Clear any edited HTML
      setTemplateModified(false);
      setSelectedTemplateId(templateId);
      
      toast.success(`Loaded template: ${template.name}`);
    } catch (error) {
      console.error('Failed to load template:', error);
      toast.error('Failed to load template');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSetDefault = async (templateId: string) => {
    const success = await setDefaultTemplate(templateId);
    if (success) {
      toast.success('Default template updated');
      loadTemplates(); // Reload to refresh UI
    } else {
      toast.error('Failed to set default template');
    }
  };

  useEffect(() => {
    // Create a blob URL for the preview with proper scaling CSS
    const htmlToUse = editedHTML || currentDocumentHTML;
    if (htmlToUse) {
      // Add CSS to scale the document based on zoom level
      const zoomDecimal = zoomLevel / 100;
      const scaleValue = 0.9 + (zoomDecimal - 0.75) * 0.5; // Adjust scale proportionally
      
      const scaledHTML = htmlToUse.replace(
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
      
      // Cleanup on unmount
      return () => URL.revokeObjectURL(url);
    }
  }, [currentDocumentHTML, editedHTML, zoomLevel]);

  const handleSend = async () => {
    // Check if template was edited but not saved
    if (templateModified) {
      toast.error('Please save your template before sending to client');
      return;
    }

    // Validate email before sending with proper regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!recipientEmail || !emailRegex.test(recipientEmail)) {
      toast.error('Please enter a valid email address (e.g., name@domain.com)');
      setShowEmailEdit(true);
      return;
    }

    setIsSending(true);
    try {
      // Pass the recipient email if it's different from the original
      const emailToUse = recipientEmail !== job.clientEmail ? recipientEmail : undefined;
      await onApprove(emailToUse);
      onClose();
    } catch (error) {
      console.error('Error sending document:', error);
      toast.error('Failed to send document');
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadPreview = () => {
    // Create a download link for the HTML
    const htmlToDownload = editedHTML || currentDocumentHTML;
    const blob = new Blob([htmlToDownload], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LOE-Preview-${job.clientLastName}-${jobDetails.jobNumber || 'DRAFT'}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Preview downloaded');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[90vw] h-[95vh] flex flex-col p-4 [&>button]:hidden">
        {/* Minimal Header */}
        <div className="flex justify-between items-center pb-2 border-b">
          <div className="flex-1">
            <h2 className="text-lg font-semibold">LOE Preview</h2>
            <p className="text-sm text-gray-600">Review Letter of Engagement before sending to client</p>
          </div>
          
          {/* Template Picker */}
          <div className="flex items-center gap-2 mr-4">
            <Label htmlFor="template-select" className="text-sm font-medium whitespace-nowrap">
              Template:
            </Label>
            <Select
              value={selectedTemplateId || 'default'}
              onValueChange={handleTemplateChange}
              disabled={isLoadingTemplates || isRegenerating}
            >
              <SelectTrigger id="template-select" className="w-[200px] h-8 text-sm bg-white border border-gray-300 text-gray-900 hover:border-gray-400 focus:border-gray-400 focus:outline-none focus:ring-0">
                {isRegenerating ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <SelectValue placeholder="Select template">
                    {templates.find(t => t.id === selectedTemplateId)?.name || 'Default Template'}
                  </SelectValue>
                )}
              </SelectTrigger>
              <SelectContent className="bg-background border border-border">
                <SelectItem value="default">Default Template</SelectItem>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{template.name}</span>
                      {template.is_default && (
                        <span className="ml-2 text-xs text-blue-600">(Default)</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTemplateId && templates.find(t => t.id === selectedTemplateId) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSetDefault(selectedTemplateId)}
                className="h-7 text-xs"
                title="Set as default template"
              >
                Set Default
              </Button>
            )}
          </div>
          
          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel(Math.max(25, zoomLevel - 10))}
                className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200"
                title="Zoom Out"
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              
              <span className="text-xs font-medium px-2 min-w-[45px] text-center dark:text-gray-200">
                {zoomLevel}%
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200"
                title="Zoom In"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
              
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel(75)}
                className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200"
                title="Reset Zoom"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditedHTML(currentDocumentHTML);
                setIsEditMode(true);
              }}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Template
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

        {/* Email Recipient Section */}
        <div className="flex items-center gap-3 py-2 px-4">
          <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          {showEmailEdit ? (
            <div className="flex items-center gap-2 flex-1">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Send to:</span>
              <Input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-64 h-8 text-sm bg-white dark:bg-secondary border border-gray-300 dark:border-border text-gray-900 dark:text-foreground placeholder:text-gray-500 dark:placeholder:text-muted-foreground hover:border-gray-400 dark:hover:border-border focus-visible:border-gray-400 dark:focus-visible:border-border focus-visible:outline-none focus-visible:ring-0"
                placeholder="Enter recipient email"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowEmailEdit(false)}
                className="h-8 text-xs text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 hover:underline"
              >
                Done
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1">
              <span className="text-sm font-medium text-gray-900 dark:text-white">E-signature will be sent to:</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{recipientEmail || 'No email specified'}</span>
              {recipientEmail !== job.clientEmail && (
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  (Testing: {recipientEmail}, Client: {job.clientEmail})
                </span>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowEmailEdit(true)}
                className="h-7 text-xs text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 hover:underline ml-auto"
              >
                Change Recipient
              </Button>
            </div>
          )}
        </div>

        {/* Preview Frame - Maximum space */}
        <div className="flex-1 border rounded-lg overflow-auto bg-gray-100 my-2">
          {previewUrl ? (
            <iframe
              src={previewUrl}
              className="w-full h-full bg-white"
              title="LOE Document Preview"
              sandbox="allow-same-origin"
              style={{ border: 'none', minHeight: '100%' }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Loading preview...
            </div>
          )}
        </div>

        {/* Minimal Footer */}
        <div className="flex justify-between items-center pt-2 border-t">
          <p className="text-xs text-gray-500">
            Verify all details are correct before sending
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPreview}
              className="h-7 text-sm"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <button
              onClick={handleSend}
              disabled={isSending}
              className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 hover:underline transition-colors text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed disabled:no-underline flex items-center gap-1"
            >
              {isSending ? (
                'Sending...'
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send to Client
                </>
              )}
            </button>
          </div>
        </div>

        {/* Template Editor Modal */}
        <TemplateEditorModal
          isOpen={isEditMode}
          onClose={() => setIsEditMode(false)}
          initialHTML={editedHTML || currentDocumentHTML}
          onSave={async (templateName, html, setAsDefault) => {
            // Save template (app-wide, no user requirement)
            const result = await saveTemplate({
              templateName,
              templateHTML: html,
              setAsDefault
            });

            if (result.success) {
              toast.success(`Template "${templateName}" saved successfully!`);
              setEditedHTML(html);
              setTemplateModified(false);
              
              // Reload templates to include the new one
              await loadTemplates();
              
              // Update preview with edited HTML
              const blob = new Blob([html], { type: 'text/html' });
              const url = URL.createObjectURL(blob);
              setPreviewUrl(url);
            } else {
              toast.error(`Failed to save template: ${result.error}`);
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default LOEPreviewModal;