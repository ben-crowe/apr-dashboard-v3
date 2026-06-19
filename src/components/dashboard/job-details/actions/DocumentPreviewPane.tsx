import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, RotateCcw } from "lucide-react";

/**
 * DocumentPreviewPane — the document RENDER surface (scaled blob iframe + compact zoom strip),
 * lifted VERBATIM from LOEPreviewModal (2026-06-18, SPEC-component-studio INV-0). It is the
 * SINGLE document render path: LOEPreviewModal renders through it and the Component Studio
 * renders through it — so they can never diverge and the previewer can't regress. The render
 * ENGINE upstream is still `generateLOEHTML`; this is only the zoom + iframe presentation that
 * both surfaces share. No new render engine.
 *
 * The zoom CSS injected into the document is identical to the original previewer's.
 */
interface DocumentPreviewPaneProps {
  /** The already-generated document HTML (from generateLOEHTML / a saved instance). */
  html: string;
  /** Optional controlled zoom; omit to let the pane own it (defaults to 75%, as the previewer did). */
  zoom?: number;
  onZoomChange?: (z: number) => void;
}

const DocumentPreviewPane: React.FC<DocumentPreviewPaneProps> = ({ html, zoom, onZoomChange }) => {
  const [internalZoom, setInternalZoom] = useState(75);
  const zoomLevel = zoom ?? internalZoom;
  const setZoom = (z: number) => { (onZoomChange ?? setInternalZoom)(z); };
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    // Create a blob URL for the preview with proper scaling CSS (verbatim from LOEPreviewModal).
    if (html) {
      const zoomDecimal = zoomLevel / 100;
      const scaleValue = 0.9 + (zoomDecimal - 0.75) * 0.5; // Adjust scale proportionally

      const scaledHTML = html.replace(
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
  }, [html, zoomLevel]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Compact zoom adjuster — sits just above the document it controls */}
      <div className="flex items-center justify-end px-4 pt-1">
        <div className="flex items-center gap-0.5 text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(Math.max(25, zoomLevel - 10))}
            className="h-5 w-5 p-0 hover:text-foreground"
            title="Zoom Out"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
          <span className="text-[11px] tabular-nums w-9 text-center select-none">{zoomLevel}%</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(Math.min(200, zoomLevel + 10))}
            className="h-5 w-5 p-0 hover:text-foreground"
            title="Zoom In"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(75)}
            className="h-5 w-5 p-0 hover:text-foreground ml-2"
            title="Reset Zoom"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="flex-1 border rounded-lg overflow-auto bg-muted my-2">
        {previewUrl ? (
          <iframe
            src={previewUrl}
            className="w-full h-full bg-card"
            title="LOE Document Preview"
            sandbox="allow-same-origin"
            style={{ border: 'none', minHeight: '100%' }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Loading preview...
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentPreviewPane;
