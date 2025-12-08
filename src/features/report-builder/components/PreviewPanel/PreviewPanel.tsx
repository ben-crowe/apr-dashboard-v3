import { useState, useRef } from 'react';
import { useReportBuilderStore } from '../../store/reportBuilderStore';
import PreviewRenderer from './PreviewRenderer';
import { FileText, Minus, Plus, FileDown, Download } from 'lucide-react';
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
  exportToDOCX,
  getExportOptionsFromSections,
} from '../../utils/exportReport';

export default function PreviewPanel() {
  const previewHtml = useReportBuilderStore((state) => state.previewHtml);
  const sections = useReportBuilderStore((state) => state.sections);
  const [zoom, setZoom] = useState(0.75);
  const [isExporting, setIsExporting] = useState(false);
  const [showPdfDialog, setShowPdfDialog] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  const handleOpenPdfDialog = () => {
    setShowPdfDialog(true);
  };

  const handlePrintPdf = async () => {
    // Close dialog first
    setShowPdfDialog(false);

    // Small delay to let dialog close and ensure iframe is accessible
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      setIsExporting(true);

      // Direct call to iframe's print
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.print();
      } else {
        throw new Error('Preview iframe not available');
      }
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

        {/* Zoom Controls and Export Buttons */}
        <div className="px-6 py-3 border-t bg-background/50 flex items-center gap-4">
          <span className="text-sm text-muted-foreground font-medium min-w-[60px]">
            Zoom:
          </span>

          {/* Simplified Zoom Controls - 10% increments */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoom(z => Math.max(0.1, z - 0.1))}
              disabled={zoom <= 0.1}
              title="Zoom out"
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
              onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
              disabled={zoom >= 1.5}
              title="Zoom in"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-border mx-2" />

          {/* Export Buttons */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenPdfDialog}
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
            ref={iframeRef}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">Loading preview...</p>
          </div>
        )}
      </div>

      {/* PDF Export Dialog */}
      <Dialog open={showPdfDialog} onOpenChange={setShowPdfDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download as PDF</DialogTitle>
            <DialogDescription>
              Your browser's print dialog will open. To save as PDF:
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
