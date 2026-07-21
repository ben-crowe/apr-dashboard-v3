import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, RotateCcw } from "lucide-react";

/**
 * StudioDocumentPreviewPane — Component Studio's OWN copy of the document render surface.
 *
 * This is a deliberate FORK of DocumentPreviewPane.tsx, not a shared component. Ben's standing
 * rule (2026-07-21): the original LOE document editor + e-signature previewer (TemplateEditorModal,
 * LOEPreviewModal, and everything DocumentPreviewPane.tsx feeds into) is protected, read-only
 * reference — it cannot be disturbed for the studio's needs. Whatever the studio needs gets
 * duplicated into a studio-owned file instead, so a future studio-only change can never leak into
 * the production send/sign flow.
 *
 * THE PAGE MODEL (Ben, 2026-07-21 — final): a real sheet of paper, photographed. The document is
 * laid out ONCE, at its native width, and never re-laid-out again — every size on screen is that
 * same frozen layout, painted smaller or larger. Text is never sized independently of its page.
 *
 * WHY `transform: scale`, NOT CSS `zoom` (2026-07-21, the acceptance test that caught it): Ben's
 * standing verification is line-end-word stability — the same word must end the same line at any
 * pane width, because a real printed page doesn't re-wrap when you shrink a photo of it. `zoom`
 * looks right in most engines but is a NON-STANDARD, engine-dependent rendering property — this
 * app's own WKWebView test surface visibly re-wrapped text under it even though the layout width
 * was fixed, while `transform: scale` cannot re-wrap by construction: it is a pure post-layout
 * paint operation with zero effect on how the box computed its own layout. The iframe always
 * renders its content at TRUE NATURAL SIZE (no zoom, ever) and the whole rendered result is scaled
 * as one flat image via `transform: scale(pageScale)` on a wrapper around it — line ends are
 * frozen because the layout that produced them never changes, only the paint size does.
 */
interface StudioDocumentPreviewPaneProps {
  html: string;
  /** Optional controlled zoom (a whole-page scale, 25–100, capped at the pane's own width-fit
      ceiling). Omit to let the pane own it; null means "reset to fit". */
  zoom?: number | null;
  onZoomChange?: (z: number | null) => void;
}

const StudioDocumentPreviewPane: React.FC<StudioDocumentPreviewPaneProps> = ({ html, zoom, onZoomChange }) => {
  const [internalZoom, setInternalZoom] = useState<number | null>(null);
  const [fitPct, setFitPct] = useState(100);
  // Width-fit is the default AND the ceiling — the page can never render wider than the pane, so
  // a manual zoom is always clamped to fitPct, both on read and on write.
  const pageScale = Math.min(zoom ?? internalZoom ?? fitPct, fitPct) / 100;
  const setZoom = (z: number) => { (onZoomChange ?? setInternalZoom)(Math.min(z, fitPct)); };
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const frameRef = useRef<HTMLIFrameElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const MIN_FIT = 25;
  const SIDE_ROOM = 0.9;      // matches the email preview's content-to-box ratio

  useEffect(() => {
    if (html) {
      // The iframe is ALWAYS laid out at this true fixed width — never zoomed, never resized to
      // fit anything. `width` (not `max-width`) so it never shrinks to whatever box happens to be
      // holding it; the frozen layout is the entire point.
      const laidOutHTML = html.replace(
        '</head>',
        `<style>
          body { width: 850px; margin: 0 auto; padding: 20px; }
          .document { width: 850px; margin: 0 auto; }
          @media print { body { width: 100%; } }
        </style>
        </head>`
      );

      const blob = new Blob([laidOutHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [html]);

  // Measure the page's true, frozen size (once per document — it never changes again) and fit it
  // to the wrapper. Layout-only: the zoom strip never feeds into this calculation.
  const measureFit = () => {
    const frame = frameRef.current;
    const doc = frame?.contentDocument;
    if (!frame || !doc?.body || !wrapRef.current) return;
    const w = Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth);
    const h = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
    setNaturalSize({ w, h });
    const available = wrapRef.current.clientWidth * SIDE_ROOM;
    const pct = w > available && w > 0
      ? Math.max(MIN_FIT, Math.floor((available / w) * 100))
      : 100;
    setFitPct(pct);
  };

  // Re-fit whenever the WRAPPER changes width (drag, rail collapse/expand, Split/Editor toggle,
  // window resize) — the wrapper is the independent geometry; the iframe's own box is frozen.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => measureFit());
    ro.observe(wrap);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewUrl]);

  const scaledW = Math.ceil(naturalSize.w * pageScale);
  const scaledH = Math.ceil(naturalSize.h * pageScale);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-end px-4 pt-1">
        <div className="flex items-center gap-0.5 text-muted-foreground">
          <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(MIN_FIT, Math.round(pageScale * 100) - 10))} className="h-5 w-5 p-0 hover:text-foreground" title="Zoom Out">
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
          <span className="text-[11px] tabular-nums w-9 text-center select-none">{Math.round(pageScale * 100)}%</span>
          <Button variant="ghost" size="sm" onClick={() => setZoom(Math.round(pageScale * 100) + 10)} className="h-5 w-5 p-0 hover:text-foreground" title="Zoom In">
            <ChevronUp className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => (onZoomChange ?? setInternalZoom)(null)} className="h-5 w-5 p-0 hover:text-foreground ml-2" title="Fit to pane">
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Preview frame — the page sits centered, its ON-SCREEN size purely a paint-time scale of
          a layout that never changes. The wrapper scrolls (vertically for a long document,
          horizontally never — the outer box is always exactly `scaledW/scaledH` wide/tall, so
          nothing to scroll sideways to). */}
      <div ref={wrapRef} className="flex-1 border border-slate-200 rounded-lg overflow-auto bg-slate-100 my-2">
        {previewUrl ? (
          <div
            className="mx-auto bg-white"
            style={{ width: scaledW || undefined, height: scaledH || undefined, overflow: 'hidden' }}
          >
            <div style={{ width: naturalSize.w || 850, height: naturalSize.h || undefined, transform: `scale(${pageScale})`, transformOrigin: 'top left' }}>
              <iframe
                ref={frameRef}
                src={previewUrl}
                onLoad={measureFit}
                className="bg-white block"
                title="LOE Document Preview"
                sandbox="allow-same-origin"
                style={{ border: 'none', width: naturalSize.w || 850, height: naturalSize.h || 1100, display: 'block' }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            Loading preview...
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioDocumentPreviewPane;
