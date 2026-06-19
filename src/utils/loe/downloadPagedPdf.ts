/**
 * Paged-PDF download — the EXACT logic lifted verbatim from LOEPreviewModal.handleDownloadPreview
 * (2026-06-18, SPEC-component-studio INV-0). Extracted UNCHANGED into a shared util so the
 * Component Studio's Document path reuses the SAME download — no new/parallel render or print
 * engine. LOEPreviewModal now calls this; the Studio calls this; one code path.
 *
 * Opens a clean print window, runs the Paged.js polyfill so the @page footer (Page X of Y +
 * VALTA) is rendered onto every page, forces white paper, then auto-opens the print dialog
 * (client picks "Save as PDF"). Bare Chrome print drops @page margin-box content; Paged.js
 * restores it.
 */

// Paged.js polyfill is vendored into /public (from the pagedjs npm package).
const PAGED_POLYFILL_PATH = '/paged.polyfill.js';

/** Download the given document HTML as a true paged PDF. `docTitle` is the window/file title. */
export function downloadPagedPdf(htmlToDownload: string, docTitle: string): boolean {
  if (!htmlToDownload) return false;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return false;

  const polyfillSrc = new URL(PAGED_POLYFILL_PATH, window.location.origin).href;
  // Point the download tab at the app's VA favicon. Without this the new window falls
  // back to /favicon.ico (the stale Lovable heart) instead of the VA mark.
  const faviconTag = `<link rel="icon" type="image/svg+xml" href="${window.location.origin}/favicon.svg">`;
  const titleTag = `<title>${docTitle}</title>${faviconTag}`;
  // White-paper guard: Paged.js paginates in SCREEN context, where the template's
  // @media screen grey backdrop would tint the page boxes. Force every Paged.js page
  // box (and the paper) white so the downloaded PDF is uniform white edge-to-edge.
  const whitePaperStyle =
    `<style>html,body{background:#fff !important}` +
    `.pagedjs_pages,.pagedjs_page,.pagedjs_sheet,.pagedjs_pagebox{background:#fff !important}` +
    `@media print{html,body,.pagedjs_page{background:#fff !important}}</style>`;
  // PagedConfig must be set BEFORE the polyfill loads; .after fires once pagination completes.
  const pagedHooks =
    `<script>window.PagedConfig={auto:true,after:function(){setTimeout(function(){window.focus();window.print();},400);}};</scr` + `ipt>` +
    `<script src="${polyfillSrc}"></scr` + `ipt>`;

  let doc = htmlToDownload;
  doc = /<\/title>/i.test(doc)
    ? doc.replace(/<title>[\s\S]*?<\/title>/i, titleTag)
    : /<\/head>/i.test(doc)
      ? doc.replace(/<\/head>/i, `${titleTag}</head>`)
      : titleTag + doc;
  // inject the white-paper guard as the LAST thing in <head> so it wins the cascade
  doc = /<\/head>/i.test(doc)
    ? doc.replace(/<\/head>/i, `${whitePaperStyle}</head>`)
    : whitePaperStyle + doc;
  doc = /<\/body>/i.test(doc)
    ? doc.replace(/<\/body>/i, `${pagedHooks}</body>`)
    : doc + pagedHooks;

  printWindow.document.open();
  printWindow.document.write(doc);
  printWindow.document.close();
  return true;
}
