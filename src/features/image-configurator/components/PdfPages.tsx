import { useEffect, useRef, useState } from 'react';
import { Download, Loader2, ZoomIn, ZoomOut } from 'lucide-react';

/**
 * A PDF rendered as PAGES WE DRAW OURSELVES — never an <iframe>.
 *
 * ⚑ WHY, AND DO NOT "SIMPLIFY" THIS BACK TO AN <iframe src={pdf}>.
 * An iframe pointed at a PDF runs the BROWSER'S OWN PDF PLUGIN, and on hover that plugin draws its
 * own floating chrome over the document — zoom in, zoom out, rotate, download. It is composited
 * ABOVE the page, so nothing in our DOM can cover, style or suppress it (a transparent shield layer
 * was tried and did nothing; `#toolbar=0` is a Chrome-only hint this engine ignores). Ben's words:
 * "that magnifying glass thing is ridiculous looking."
 *
 * You cannot restyle a viewer you did not write. So we do not embed one: pdf.js rasterises each
 * page to a canvas and we hand out plain <img>s. No plugin, no chrome, nothing to hover — and the
 * page scroll, the background and the spacing are ours to design.
 */
export function PdfPages({ url, name }: { url: string; name: string }) {
  const [pages, setPages] = useState<string[]>([]);
  // Our OWN zoom. The browser plugin's zoom went away with the plugin; Ben wanted the CONTROLS kept,
  // just made small — not the plugin's oversized chrome. 1 = the whole page fits the frame.
  const [zoom, setZoom] = useState(1);

  /**
   * The frame's REAL height, measured — not derived from `90vh` arithmetic.
   *
   * A vh-based cap (`max-h-[calc(90vh-9rem)]`) is a GUESS about how much chrome sits above the
   * document, and it was wrong: the page overshot the frame and its foot was cut off again. The
   * frame is right there and can be asked. ResizeObserver keeps it right when the window changes.
   */
  const boxRef = useRef<HTMLDivElement>(null);
  const [fitHeight, setFitHeight] = useState(0);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => {
      // minus the box's own vertical padding (p-6 = 24px each side), or the page fills the frame edge
      // to edge and the shadow has nowhere to fall.
      setFitHeight(Math.max(120, el.clientHeight - 48));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let dead = false;
    const made: string[] = [];

    (async () => {
      setLoading(true);
      setFailed(false);
      setPages([]);
      try {
        const pdfjs = await import('pdfjs-dist');
        // Resolved through Vite, not a CDN — this app allows no external scripts, and a bare
        // specifier here fails silently, leaving a blank document.
        pdfjs.GlobalWorkerOptions.workerSrc = (
          await import('pdfjs-dist/build/pdf.worker.min.mjs?url')
        ).default;

        const pdf = await pdfjs.getDocument({ url }).promise;

        for (let n = 1; n <= pdf.numPages; n++) {
          if (dead) return;
          const page = await pdf.getPage(n);
          const viewport = page.getViewport({ scale: 2 }); // 2x, or text is soft on a retina panel
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('no 2d context');

          await page.render({ canvas, canvasContext: ctx, viewport }).promise;
          const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, 'image/png'));
          if (!blob || dead) return;

          const src = URL.createObjectURL(blob);
          made.push(src);
          // Show each page AS IT FINISHES — a long document must not sit blank until the last page
          // is done. The first page is what the reader wants; give it to them immediately.
          setPages((p) => [...p, src]);
          setLoading(false);
        }
        if (!dead) setLoading(false);
      } catch {
        if (!dead) {
          setFailed(true);
          setLoading(false);
        }
      }
    })();

    return () => {
      dead = true;
      made.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [url]);

  if (failed) {
    return (
      <div data-testid="doc-failed" className="text-sm text-neutral-500">
        This document could not be displayed.
      </div>
    );
  }

  return (
    // The toolbar must pin to the FRAME, not to the scrolling content — placed inside the scroll box it
    // slides away with the page. So the frame is a relative wrapper holding the scroll box and the bar
    // as SIBLINGS.
    <div className="relative h-full w-full">
      <div
        data-testid="doc-pages"
        // NEUTRAL, NOT BLUE (Ben: "do not add blue to the background of the PDF page"). The page is
        // white paper; it sits on a plain light surface and casts a soft shadow, which is what makes it
        // read as paper. A slate/navy surround tinted the whole document.
        ref={boxRef}
        className="h-full w-full overflow-y-auto bg-neutral-100 p-6"
      >
        {/* ONE WHOLE PAGE, NOT A CROPPED ONE (Ben: "you don't want to see it get cut off on the
            bottom… it should fit"). Sizing a page by WIDTH makes a portrait page taller than the frame
            and lops its foot off. Each page is capped to the frame's MEASURED height (see fitHeight —
            a vh guess was wrong at Ben's window size) and keeps its aspect ratio, so a whole page lands
            inside the frame whatever its shape, and a multi-page document scrolls a page at a time. */}
        <div className="flex min-h-full flex-col items-center justify-center gap-6">
          {pages.map((src, i) => (
            <img
              key={src}
              data-testid="doc-page"
              src={src}
              alt={`${name} — page ${i + 1}`}
              style={fitHeight ? { maxHeight: fitHeight * zoom } : undefined}
              className="w-auto max-w-none bg-white object-contain shadow-[0_2px_12px_rgba(0,0,0,0.18)]"
            />
          ))}
          {loading && (
            <div className="flex items-center gap-2 py-6 text-xs text-neutral-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              {pages.length ? 'Loading more pages…' : 'Opening…'}
            </div>
          )}
        </div>
      </div>

      {/* OUR controls, not the browser's. Ben kept the zoom and the download — he objected to the
          PLUGIN'S versions, which were oversized, unstyleable and drew themselves over the page.

          ALWAYS VISIBLE (Ben: "no need for hover-over to bring up those tools, let them be seen").
          And FLOATING, not in the flow: a sticky bar still occupies height, which pushed the frame's
          content past its own bottom and forced a scrollbar onto a page that already fitted. Absolute
          positioning takes it out of the layout entirely, so the page keeps its fit. */}
      {!!pages.length && (
        <div
          data-testid="doc-tools"
          className="pointer-events-none absolute bottom-4 left-0 right-0 z-10 flex justify-center"
        >
          <div className="pointer-events-auto flex items-center gap-0.5 rounded-full border border-black/10 bg-white/95 px-1.5 py-1 shadow-md backdrop-blur-sm">
            <button
              type="button"
              data-testid="doc-zoom-out"
              onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.25).toFixed(2)))}
              disabled={zoom <= 0.6}
              title="Zoom out"
              className="flex h-6 w-6 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-30"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              data-testid="doc-zoom-in"
              onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
              disabled={zoom >= 3}
              title="Zoom in"
              className="flex h-6 w-6 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-30"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>

            <span className="mx-1 h-3.5 w-px bg-black/10" />

            <a
              data-testid="doc-download"
              href={url}
              download={name}
              title={`Download ${name}`}
              className="flex h-6 w-6 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              <Download className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
