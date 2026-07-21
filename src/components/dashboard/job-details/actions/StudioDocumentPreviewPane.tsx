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
 * laid out once at its native width, and the WHOLE page — paper and the text printed on it —
 * scales UNIFORMLY so the page width always matches the pane's width: skinny the pane and the
 * page gets smaller with proportionally smaller text; widen it and everything grows together.
 * Text is never sized independently of its page. The percentage control is a uniform whole-page
 * scale override on top of the width-fit default — stepping it scales page and text together, the
 * same single `zoomLevel` drives both the iframe's own box width and the zoom applied inside it.
 * This is the exact mechanism DocumentPreviewPane already used (and TemplateEditorModal's own
 * preview pane mirrors) — reproduced here verbatim, not shared, per the rule above.
 */
interface StudioDocumentPreviewPaneProps {
  /** The already-generated document HTML (from generateLOEHTML / a saved instance). */
  html: string;
  /** Optional controlled zoom. Omit to let the pane own it; null means "fit to the pane". */
  zoom?: number | null;
  onZoomChange?: (z: number | null) => void;
}

const StudioDocumentPreviewPane: React.FC<StudioDocumentPreviewPaneProps> = ({ html, zoom, onZoomChange }) => {
  // null = follow the measured fit; a number = the user picked a zoom with the strip.
  const [internalZoom, setInternalZoom] = useState<number | null>(null);
  const [fitZoom, setFitZoom] = useState(100);
  // Width-fit is a CEILING, not just the default: the page's rendered width must never exceed the
  // pane's content width, so a manual zoom can only ever sit at or below fitZoom — clamp on every
  // read, not just on entry, so a pane that shrinks (drag, explorer expanding) pulls an
  // already-set zoom back down with it instead of leaving the page wider than its pane.
  const zoomLevel = Math.min(zoom ?? internalZoom ?? fitZoom, fitZoom);
  const setZoom = (z: number) => { (onZoomChange ?? setInternalZoom)(Math.min(z, fitZoom)); };
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [naturalWidth, setNaturalWidth] = useState(0);
  const frameRef = useRef<HTMLIFrameElement>(null);
  // The fit is measured against the WRAPPER, never the iframe: when the floor below is hit the
  // iframe is deliberately made wider than the wrapper, so measuring the iframe would feed its
  // own width back into the calculation and the fit would never settle.
  const wrapRef = useRef<HTMLDivElement>(null);

  // Below this the text stops being readable, so the pane stops shrinking and lets the wrapper
  // scroll sideways instead — nothing becomes unreachable, it just needs scrolling.
  const MIN_FIT = 25;
  const SIDE_ROOM = 0.9;      // matches the email preview's content-to-box ratio
  const scaledWidth = Math.ceil(naturalWidth * (zoomLevel / 100));

  useEffect(() => {
    // The blob carries LAYOUT only. Scale is applied afterwards, against a measurement, because a
    // document authored at a fixed width has to be fitted to whatever width the pane happens to
    // be — and the pane's width changes (split vs single, drag grabber, the floating preview).
    if (html) {
      const laidOutHTML = html.replace(
        '</head>',
        `<style>
          /* width, not max-width: a max-width is capped by whatever the iframe's OWN box
             currently is, so measuring "natural" width while the iframe still sits at its
             previous (narrower) size would read back that stale, too-small number instead of the
             document's real authored width — corrupting every re-fit after the first. A fixed
             width always lays out at its true size, independent of the iframe's current box, so
             the natural-width measurement is trustworthy on every resize, not just the first. */
          body {
            width: 850px;
            margin: 0 auto;
            padding: 20px;
          }
          .document {
            width: 850px;
            margin: 0 auto;
          }
          @media print {
            body { zoom: 1; width: 100%; }
          }
        </style>
        </head>`
      );

      const blob = new Blob([laidOutHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [html]);

  // Measure the page at natural size, then scale it down to the pane. `zoom` rather than
  // `transform: scale` so the page's own layout box shrinks with it — a transform leaves the
  // original box in place, which is what produced the clipped right edge before.
  const measureFit = () => {
    const frame = frameRef.current;
    const doc = frame?.contentDocument;
    if (!frame || !doc?.body || !wrapRef.current) return;
    doc.body.style.setProperty('zoom', '1');
    const natural = Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth);
    // Leave the same breathing room down each side that the email preview has, rather than
    // running the page wall-to-wall. The email sits at 90% of its available width, so the
    // document matches it — a letter pressed against both edges reads as cramped next to it.
    const available = wrapRef.current.clientWidth * SIDE_ROOM;
    const pct = natural > available && natural > 0
      ? Math.max(MIN_FIT, Math.floor((available / natural) * 100))
      : 100;
    setFitZoom(pct);
    setNaturalWidth(natural);
    doc.body.style.setProperty('zoom', String((zoom ?? internalZoom ?? pct) / 100));
  };

  // Re-fit whenever the pane changes width — observe the WRAPPER (the pane's own geometry) as
  // the primary signal, not just the iframe: the iframe's box is itself react-state-driven output
  // of this same calculation, so a resize that only changes the wrapper (drag, rail collapse,
  // Split/Editor toggle) needs its own independent trigger, not a wait for the iframe to move.
  useEffect(() => {
    const frame = frameRef.current;
    const wrap = wrapRef.current;
    if (!frame || !wrap || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => measureFit());
    ro.observe(frame);
    ro.observe(wrap);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewUrl]);

  // Apply the current zoom (fitted or user-chosen) to the loaded document.
  useEffect(() => {
    frameRef.current?.contentDocument?.body?.style.setProperty('zoom', String(zoomLevel / 100));
  }, [zoomLevel]);

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
          {/* Reset means fit-to-pane. It re-measures as well as clearing any manual override,
              so it still does something when the zoom is already following the fit. */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { (onZoomChange ?? setInternalZoom)(null); measureFit(); }}
            className="h-5 w-5 p-0 hover:text-foreground ml-2"
            title="Fit to pane"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Preview Frame — the rendered PAGE is always a light page (never themed dark): explicit
          light backdrop + white iframe, matching the email/popup preview convention (bg-white). */}
      <div ref={wrapRef} className="flex-1 border border-slate-200 rounded-lg overflow-auto bg-slate-100 my-2">
        {previewUrl ? (
          <iframe
            ref={frameRef}
            src={previewUrl}
            onLoad={measureFit}
            className="h-full bg-white block mx-auto"
            title="LOE Document Preview"
            sandbox="allow-same-origin"
            /* Exactly as wide as the SCALED page, centred, so the slate backdrop shows down both
               sides — the same breathing room the email preview has. Letting it span the whole
               wrapper made the page white-on-white to the edges, which read as cramped.
               Only when the readable-size floor is hit does it exceed the wrapper, and then the
               wrapper scrolls sideways rather than cutting text off. */
            style={{ border: 'none', minHeight: '100%', width: scaledWidth || '100%' }}
          />
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
