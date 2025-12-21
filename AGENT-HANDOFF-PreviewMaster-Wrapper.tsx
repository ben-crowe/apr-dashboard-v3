/**
 * HANDOFF COMPONENT FOR CLOUD DESKTOP AGENT
 *
 * Purpose: Isolated preview environment for PREVIEW-Master.html
 *
 * This component wraps PreviewRenderer to load and display PREVIEW-Master.html
 * with zoom in/out controls. No dual-panel complexity, no state management.
 *
 * After work is complete, this component plugs directly into:
 * /src/features/report-builder/components/ReportBuilderLayout.tsx
 *
 * ===================================================================
 */

import { useState, useRef } from 'react';
import PreviewRenderer from '@/features/report-builder/components/PreviewPanel/PreviewRenderer';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PreviewMasterWrapper() {
  const [zoom, setZoom] = useState(0.75);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load PREVIEW-Master.html on mount
  const loadPreviewMaster = async () => {
    try {
      // Load the HTML file
      const response = await fetch('/PREVIEW-Master.html');
      const html = await response.text();
      setPreviewHtml(html);
    } catch (error) {
      console.error('Failed to load PREVIEW-Master.html:', error);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-muted/30">
      {/* Header with Controls */}
      <div className="border-b bg-background">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold">Preview Master - Document Viewer</h2>
          <p className="text-sm text-muted-foreground mt-1">
            PREVIEW-Master.html with zoom and pan controls
          </p>
        </div>

        {/* Zoom Controls */}
        <div className="px-6 py-3 border-t bg-background/50 flex items-center gap-4">
          <span className="text-sm text-muted-foreground font-medium min-w-[60px]">
            Zoom:
          </span>

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

          {/* Load Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={loadPreviewMaster}
          >
            Load PREVIEW-Master.html
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-hidden">
        {previewHtml ? (
          <PreviewRenderer
            html={previewHtml}
            zoom={zoom}
            ref={iframeRef}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">Click "Load PREVIEW-Master.html" to begin</p>
          </div>
        )}
      </div>
    </div>
  );
}
