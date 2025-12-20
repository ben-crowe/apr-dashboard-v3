import { useState, useRef, useEffect } from 'react';
import { useReportBuilderStore } from '../../store/reportBuilderStore';
import PreviewRenderer from './PreviewRenderer';
import { FileText, Minus, Plus, FileDown, Download, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  exportToPDF,
  exportToPDFViaPrint,
  exportToDOCX,
  getExportOptionsFromSections,
} from '../../utils/exportReport';

export default function PreviewPanel() {
  const previewHtml = useReportBuilderStore((state) => state.previewHtml);
  const sections = useReportBuilderStore((state) => state.sections);
  const [zoom, setZoom] = useState(0.75);
  const [isExporting, setIsExporting] = useState(false);
  const [showPdfDialog, setShowPdfDialog] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showFieldIds, setShowFieldIds] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const zoomIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const minZoom = 0.1;
  const maxZoom = 1.5;
  const zoomStep = 0.05; // 5% for smoother hold-to-zoom

  // DEBUG: Expose HTML on window for automated extraction
  useEffect(() => {
    if (previewHtml) {
      (window as any).__PREVIEW_HTML__ = previewHtml;
    }
  }, [previewHtml]);

  // Hide built-in controls from template (we use React controls instead)
  useEffect(() => {
    if (iframeRef.current?.contentDocument) {
      const iframeDoc = iframeRef.current.contentDocument;

      // Inject CSS to hide template's built-in controls
      if (!iframeDoc.getElementById('hide-builtin-controls')) {
        const style = iframeDoc.createElement('style');
        style.id = 'hide-builtin-controls';
        style.textContent = `
          #go-button,
          #refresh-button,
          label[for="preview-toggle"],
          .controls-bar,
          .toggle-container,
          .field-toggle-container,
          .page-nav-container,
          #mode-label,
          .preview-controls,
          div[style*="position: fixed"],
          div[style*="position: absolute"][style*="top"],
          .floating-controls {
            display: none !important;
            visibility: hidden !important;
          }
        `;
        iframeDoc.head.appendChild(style);
      }
    }
  }, [previewHtml]);

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const options = getExportOptionsFromSections(sections);

      toast({
        title: 'Generating PDF...',
        description: 'Please wait while we generate your PDF.',
      });

      // Try Gotenberg service first (one-click download)
      await exportToPDF(previewHtml, options);

      toast({
        title: 'PDF Downloaded',
        description: 'Your report has been saved.',
      });
    } catch (error) {
      console.error('Export PDF error:', error);

      // If Gotenberg unavailable, show dialog for print fallback
      if (error instanceof Error && error.message === 'PDF_SERVICE_UNAVAILABLE') {
        setShowPdfDialog(true);
        return;
      }

      toast({
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'Failed to export PDF',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintPdf = async () => {
    setShowPdfDialog(false);
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      setIsExporting(true);
      await exportToPDFViaPrint(iframeRef.current);
    } catch (error) {
      console.error('Export PDF error:', error);
      toast({
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'Failed to export PDF',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportDOCX = async () => {
    try {
      setIsExporting(true);
      const options = getExportOptionsFromSections(sections);
      await exportToDOCX(previewHtml, options);

      toast({
        title: 'Export successful',
        description: 'DOCX file has been downloaded.',
      });
    } catch (error) {
      console.error('Export DOCX error:', error);
      toast({
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'Failed to export DOCX',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Hold-to-zoom: Start continuous zoom on mousedown
  const handleZoomOutMouseDown = () => {
    zoomIntervalRef.current = setInterval(() => {
      setZoom(z => Math.max(minZoom, z - zoomStep));
    }, 100);
  };

  const handleZoomInMouseDown = () => {
    zoomIntervalRef.current = setInterval(() => {
      setZoom(z => Math.min(maxZoom, z + zoomStep));
    }, 100);
  };

  const handleZoomMouseUp = () => {
    if (zoomIntervalRef.current) {
      clearInterval(zoomIntervalRef.current);
      zoomIntervalRef.current = null;
    }
  };

  // Show Field IDs toggle
  const handleShowFieldIdsToggle = () => {
    const newShowFieldIds = !showFieldIds;
    setShowFieldIds(newShowFieldIds);

    // Toggle field IDs in iframe content
    if (iframeRef.current?.contentDocument) {
      const iframeDoc = iframeRef.current.contentDocument;
      const previewToggle = iframeDoc.getElementById('preview-toggle') as HTMLInputElement;
      if (previewToggle) {
        previewToggle.checked = newShowFieldIds;
        previewToggle.dispatchEvent(new Event('change'));
      }
    }
  };

  // Dark mode toggle - 10-15% darkening filter
  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    // Apply dark mode to iframe content
    if (iframeRef.current?.contentDocument) {
      const iframeDoc = iframeRef.current.contentDocument;
      const iframeBody = iframeDoc.body;

      if (iframeBody) {
        if (newDarkMode) {
          iframeBody.classList.add('dark-mode');

          // Inject dark mode CSS if not already present (subtle 15% darkening)
          if (!iframeDoc.getElementById('dark-mode-styles')) {
            const style = iframeDoc.createElement('style');
            style.id = 'dark-mode-styles';
            style.textContent = `
              body.dark-mode .page-sheet,
              body.dark-mode .page {
                filter: brightness(0.85);
              }
            `;
            iframeDoc.head.appendChild(style);
          }
        } else {
          iframeBody.classList.remove('dark-mode');
        }
      }
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (zoomIntervalRef.current) {
        clearInterval(zoomIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Compact Header Bar */}
      <div style={{
        backgroundColor: '#4b5563',
        padding: '12px 16px',
        borderBottom: '1px solid #374151'
      }}>
        <h2 style={{
          fontSize: '15px',
          fontWeight: '600',
          color: '#ffffff',
          margin: 0
        }}>
          REPORT PREVIEW
        </h2>
      </div>

      {/* Compact Control Bar - Single Row */}
      <div style={{
        backgroundColor: '#4b5563',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        height: '44px',
        borderBottom: '1px solid #374151',
        color: '#ffffff'
      }}>
        {/* Zoom Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: '500' }}>Zoom:</span>
          <button
            onClick={() => setZoom(z => Math.max(minZoom, z - 0.1))}
            onMouseDown={handleZoomOutMouseDown}
            onMouseUp={handleZoomMouseUp}
            onMouseLeave={handleZoomMouseUp}
            disabled={zoom <= minZoom}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '4px',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#ffffff'
            }}
          >
            −
          </button>
          <span style={{ fontSize: '13px', fontWeight: '500', minWidth: '40px', textAlign: 'center' }}>
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(z => Math.min(maxZoom, z + 0.1))}
            onMouseDown={handleZoomInMouseDown}
            onMouseUp={handleZoomMouseUp}
            onMouseLeave={handleZoomMouseUp}
            disabled={zoom >= maxZoom}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '4px',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#ffffff'
            }}
          >
            +
          </button>
        </div>

        {/* iOS-Style Toggle Switch for Show Field IDs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '20px' }}>
          <label style={{
            position: 'relative',
            display: 'inline-block',
            width: '44px',
            height: '24px',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={showFieldIds}
              onChange={handleShowFieldIdsToggle}
              style={{
                opacity: 0,
                width: 0,
                height: 0
              }}
            />
            <span style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: showFieldIds ? '#3b82f6' : '#d1d5db',
              borderRadius: '24px',
              transition: 'background-color 0.3s',
              cursor: 'pointer'
            }}>
              <span style={{
                position: 'absolute',
                content: '',
                height: '18px',
                width: '18px',
                left: showFieldIds ? '23px' : '3px',
                bottom: '3px',
                backgroundColor: 'white',
                borderRadius: '50%',
                transition: 'left 0.3s'
              }} />
            </span>
          </label>
          <span style={{ fontSize: '13px', fontWeight: '500' }}>Show Field IDs</span>
        </div>

        {/* Page Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
          <input
            type="number"
            value={1}
            min={1}
            max={77}
            style={{
              width: '50px',
              height: '28px',
              padding: '4px 8px',
              fontSize: '13px',
              borderRadius: '4px',
              border: '1px solid #9ca3af',
              textAlign: 'center',
              backgroundColor: '#e5e7eb',
              color: '#374151'
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: '500' }}>of 77</span>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={handleDarkModeToggle}
          title={darkMode ? 'Light mode' : 'Dark mode'}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '4px'
          }}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        {/* Export Buttons */}
        <button
          onClick={handleExportPDF}
          disabled={isExporting || !previewHtml}
          style={{
            backgroundColor: '#e5e7eb',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            color: '#374151',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <FileDown className="h-3 w-3" />
          PDF
        </button>

        <button
          onClick={handleExportDOCX}
          disabled={isExporting || !previewHtml}
          style={{
            backgroundColor: '#e5e7eb',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            color: '#374151',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Download className="h-3 w-3" />
          DOCX
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {previewHtml ? (
          <PreviewRenderer
            html={previewHtml}
            zoom={zoom}
            onZoomChange={setZoom}
            ref={iframeRef}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">Loading preview...</p>
          </div>
        )}
      </div>

      {/* PDF Export Fallback Dialog (when Gotenberg unavailable) */}
      <Dialog open={showPdfDialog} onOpenChange={setShowPdfDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download as PDF</DialogTitle>
            <DialogDescription>
              PDF service is starting up. Use browser print dialog instead:
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Select <strong>"Save as PDF"</strong> from the printer dropdown</li>
              <li>Click <strong>Save</strong></li>
              <li>Choose where to save the file</li>
            </ol>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPdfDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePrintPdf}>
              Open Print Dialog
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
