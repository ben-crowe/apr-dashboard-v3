import React, { useState, useMemo, useCallback } from 'react';
import { EditorPane } from './EditorPane';
import { PreviewPane } from './PreviewPane';
import { FieldSidebar } from './FieldSidebar';
import { TemplateSelector } from './TemplateSelector';
import { useContentEditable } from './hooks/useContentEditable';
import { FieldRegistry, FieldDefinition } from './services/FieldRegistry';
import { TemplateManager } from './services/TemplateManager';

export interface JobData {
  id?: string;
  dateCreated: string;
  jobNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName?: string;
  clientAddress?: string;
  clientTitle?: string;
  propertyAddress: string;
  propertyType: string;
  notes?: string;
  intendedUse: string;
  requestedValue: string;
  propertyRights: string;
  reportType: string;
  appraisalFee: string;
  retainerAmount?: string;
  paymentTerms: string;
  scopeOfWork: string;
  reportDelivery: string;
}

interface DocumentEditorProps {
  jobData: JobData;
  documentType?: 'LOE';
  onSave?: (html: string, metadata?: any) => void;
  onSend?: (html: string) => void;
  onClose?: () => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  jobData,
  documentType = 'LOE',
  onSave,
  onSend,
  onClose
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [previewMode, setPreviewMode] = useState<'markers' | 'values'>('values');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  const fieldRegistry = useMemo(() => new FieldRegistry(), []);
  const templateManager = useMemo(() => new TemplateManager(), []);
  
  const initialContent = useMemo(() => 
    templateManager.getInitialContent(selectedTemplate, documentType),
    []
  );
  
  const { editorRef, content, setContent, insertAtCursor } = useContentEditable({
    initialContent,
    onChange: (newContent) => {
      setSaveStatus('idle');
    }
  });
  
  const handleFieldInsert = useCallback((field: FieldDefinition) => {
    insertAtCursor(field.marker);
  }, [insertAtCursor]);
  
  const handleTemplateChange = useCallback((newTemplateId: string) => {
    // Extract content from current template
    const contentBlocks = templateManager.extractContent(content);
    
    // Apply new template
    const newContent = templateManager.applyTemplate(contentBlocks, newTemplateId);
    
    // Update editor content
    setContent(newContent);
    setSelectedTemplate(newTemplateId);
  }, [content, templateManager, setContent]);
  
  const handleSave = useCallback(async () => {
    setSaveStatus('saving');
    
    try {
      await onSave?.(content, {
        template: selectedTemplate,
        documentType,
        lastModified: new Date().toISOString()
      });
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('idle');
    }
  }, [content, selectedTemplate, documentType, onSave]);
  
  const handleSend = useCallback(() => {
    onSend?.(content);
  }, [content, onSend]);
  
  // Validate fields
  const validation = useMemo(() => {
    return fieldRegistry.validateFields(content, jobData);
  }, [content, jobData, fieldRegistry]);
  
  return (
    <div className="document-editor-container h-screen flex flex-col bg-gray-100">
      {/* Header Toolbar */}
      <div className="editor-toolbar bg-white shadow-sm border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Document Editor</h2>
            <span className="text-sm text-gray-500">{documentType}</span>
          </div>
          
          <div className="flex items-center gap-3">
            {validation.errors.length > 0 && (
              <div className="text-sm text-amber-600">
                ⚠️ {validation.errors.filter(e => e.severity === 'error').length} issues
              </div>
            )}
            
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all
                ${saveStatus === 'saving' 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : saveStatus === 'saved'
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
                }
              `}
            >
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? '✓ Saved' : 'Save'}
            </button>
            
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
            >
              Send to DocuSeal
            </button>
            
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Fields */}
        <div className="w-72 border-r bg-gray-50 overflow-y-auto">
          <FieldSidebar
            registry={fieldRegistry}
            jobData={jobData}
            onFieldClick={handleFieldInsert}
          />
        </div>
        
        {/* Center/Right - Editor and Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Template Selector */}
          <div className="p-4 bg-gray-50">
            <TemplateSelector
              current={selectedTemplate}
              onChange={handleTemplateChange}
              templates={templateManager.getAvailableTemplates()}
            />
          </div>
          
          {/* Editor and Preview Split View */}
          <div className="flex-1 flex gap-4 p-4 overflow-hidden">
            <EditorPane ref={editorRef} />
            <PreviewPane
              content={content}
              jobData={jobData}
              mode={previewMode}
              onModeChange={setPreviewMode}
              template={selectedTemplate}
              registry={fieldRegistry}
            />
          </div>
        </div>
      </div>
    </div>
  );
};