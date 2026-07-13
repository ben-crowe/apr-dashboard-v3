// The destination filename for a job_files row filed into a SharePoint subfolder.
//
// ONE pure function, deliberately isolated. Two reasons:
//
// 1. RETRY-IDEMPOTENCY DEPENDS ON PURITY. There is no transaction across Graph and Postgres, so
//    the design is: PUT first, stamp the row second, stamp only on a 2xx. A failed stamp leaves the
//    row in the inbox and the retry PUTs the SAME bytes to the SAME path, overwriting itself. That
//    only holds if this function is a pure function of the row — same row in, same name out, every
//    time. Anything non-deterministic here (conflictBehavior=rename, a listFolderItems pre-check, a
//    timestamp, a counter) turns a retry into a duplicate file in the client's live folder.
//
// 2. THE SUFFIX RULE IS AN OPEN QUESTION WITH BEN. Today: every filed file carries the short id
//    (the locked PRD's behaviour). Under consideration: carry it ONLY when two files on the same
//    job genuinely collide, so the client's live folder reads clean. That answer changes ONE
//    function body — this one — and nothing else.
//
// SHAREPOINT ILLEGAL CHARACTERS. Graph REJECTS these in an item name outright: " * : < > ? / \ |
// — plus leading/trailing whitespace and a leading "~$". URL-encoding does NOT rescue them:
// encodePath() in graph.ts percent-encodes the path, and an encoded colon is still an illegal
// SharePoint NAME. A client file called "Site Survey: North Lot.pdf" is entirely ordinary and Graph
// will 400 it. So the stem is sanitized here, before the PUT, not encoded on the way out.

/** Characters SharePoint rejects in an item name. */
const ILLEGAL = /["*:<>?/\\|]/g;

/** First 8 hex characters of the row's UUID, dashes stripped. */
export function shortId(rowId: string): string {
  return rowId.replace(/-/g, '').slice(0, 8);
}

/** Split on the LAST dot only: "report.final.pdf" -> ["report.final", ".pdf"]; "README" -> ["README", ""]. */
export function splitExtension(fileName: string): { stem: string; ext: string } {
  const dot = fileName.lastIndexOf('.');
  if (dot <= 0) return { stem: fileName, ext: '' }; // no dot, or a leading dot (".env" is all stem)
  return { stem: fileName.slice(0, dot), ext: fileName.slice(dot) };
}

/** Strip what SharePoint rejects. May return '' — the caller falls back to the row id. */
export function sanitizeStem(stem: string): string {
  return stem
    .replace(ILLEGAL, '')
    .replace(/^~\$/, '')
    .trim();
}

/**
 * Strip what SharePoint rejects from the EXTENSION too.
 *
 * The extension is exactly as client-controlled as the stem — splitExtension() splits on the LAST
 * dot, so anything after that dot is whatever the client typed. Sanitizing only the stem left every
 * illegal character that happened to fall after the last dot alive in the name, and Graph 400s on
 * it: "Scan 2026.01.03: final" -> ext ".03: final", colon intact. Same failure class the sanitizer
 * exists to close, in the half of the filename that went unchecked.
 */
export function sanitizeExt(ext: string): string {
  if (!ext) return '';
  const cleaned = ext.replace(ILLEGAL, '').replace(/\.+$/, '').trim();
  return cleaned === '.' || cleaned === '' ? '' : cleaned;
}

/**
 * The filed name for a job_files row. Pure: (row id, original file name) -> name.
 *
 * Always suffixes the short id — the LOCKED behaviour. If the stem sanitizes to empty (a name made
 * entirely of illegal characters), the row id alone carries the name, so a file can never be
 * PUT as a bare extension.
 */
export function filedFileName(rowId: string, originalFileName: string): string {
  const { stem, ext } = splitExtension(originalFileName);
  const safeStem = sanitizeStem(stem);
  const safeExt = sanitizeExt(ext);
  const name = safeStem ? `${safeStem}-${shortId(rowId)}${safeExt}` : `${rowId}${safeExt}`;
  // SharePoint also rejects any item name ENDING in a period or in whitespace. Final guard.
  return name.replace(/[.\s]+$/, '');
}
