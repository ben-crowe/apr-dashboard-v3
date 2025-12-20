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

  // Dark mode toggle
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

          // Inject dark mode CSS if not already present
          if (!iframeDoc.getElementById('dark-mode-styles')) {
            const style = iframeDoc.createElement('style');
            style.id = 'dark-mode-styles';
            style.textContent = `
              body.dark-mode .page-sheet,
              body.dark-mode .page {
                filter: brightness(0.8);
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
    <div className="h-full flex flex-col bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Live Preview</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Updates automatically as you edit
          </p>
        </div>

        {/* Enhanced Zoom Controls and Export Buttons */}
        <div className="px-6 py-3 border-t bg-background/50 flex items-center gap-4">
          <span className="text-sm text-muted-foreground font-medium min-w-[60px]">
            Zoom:
          </span>

          {/* Enhanced Zoom Controls - Click or Hold to Zoom */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoom(z => Math.max(minZoom, z - 0.1))}
              onMouseDown={handleZoomOutMouseDown}
              onMouseUp={handleZoomMouseUp}
              onMouseLeave={handleZoomMouseUp}
              disabled={zoom <= minZoom}
              title="Zoom out (click or hold)"
            >
              <Minus className="h-4 w-4" />
            </Button>

            <span className="text-sm w-12 text-center font-medium">
              {Math.round(zoom * 100)}%
            </span>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoom(z => Math.min(maxZoom, z + 0.1))}
              onMouseDown={handleZoomInMouseDown}
              onMouseUp={handleZoomMouseUp}
              onMouseLeave={handleZoomMouseUp}
              disabled={zoom >= maxZoom}
              title="Zoom in (click or hold)"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-border mx-2" />

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleDarkModeToggle}
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Divider */}
          <div className="h-4 w-px bg-border mx-2" />

          {/* Export Buttons */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            disabled={isExporting || !previewHtml}
            title="Download as PDF"
          >
            <FileDown className="h-4 w-4 mr-1" />
            PDF
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportDOCX}
            disabled={isExporting || !previewHtml}
            title="Export as Word document"
          >
            <Download className="h-4 w-4 mr-1" />
            DOCX
          </Button>
        </div>
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
