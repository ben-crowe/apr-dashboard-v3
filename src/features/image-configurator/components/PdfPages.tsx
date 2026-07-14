import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

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
    <div
      data-testid="doc-pages"
      // NEUTRAL, NOT BLUE (Ben: "do not add blue to the background of the PDF page"). The page is white
      // paper; it sits on a plain light surface and casts a soft shadow, which is what makes it read as
      // paper. A slate/navy surround tinted the whole document.
      className="h-full w-full overflow-y-auto bg-neutral-100 p-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
        {pages.map((src, i) => (
          <img
            key={src}
            data-testid="doc-page"
            src={src}
            alt={`${name} — page ${i + 1}`}
            className="w-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.18)]"
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
  );
}
