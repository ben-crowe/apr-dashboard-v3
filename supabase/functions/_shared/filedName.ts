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
 * SharePoint rejects any item whose FULL PATH exceeds ~400 characters. The full path here is the
 * parent job folder + the subfolder + the name this function builds, e.g.
 *   2.Jobs/2026/VAL261054 - Stacked Townhouse Development 2822 &2828 11 Ave SE Calgary AB/3. WORK FILES (TTSZ, PICS, COMPS)/<name>
 * The parent is already long, so a long client filename can push the total over and Graph rejects
 * the PUT. 400 is the documented ceiling; we build to it exactly rather than guessing a margin.
 */
export const MAX_SHAREPOINT_PATH = 400;

/** SharePoint rejects a name ending in a period or whitespace. Applied LAST — truncation can create one. */
function trimTrailing(name: string): string {
  return name.replace(/[.\s]+$/, '');
}

/**
 * The filed name for a job_files row. PURE: (row id, original name, destination prefix) -> name.
 *
 * `prefix` is everything the name will be appended to — the resolved parent folder path plus the
 * subfolder plus the trailing slash. It is derived SERVER-SIDE from the job row (resolveJobFolderPath),
 * so it is a deterministic input, not a lookup. This function reads NOTHING from SharePoint: a
 * length check that measured the live folder would make the name depend on remote state, and the
 * PUT-first design rests on this being a pure function of the row — a retry must rebuild the exact
 * same path to overwrite its own bytes instead of creating a second copy.
 *
 * `prefix` IS REQUIRED — deliberately no default. A default of '' would make the budget 400 minus
 * nothing, so a caller who forgot the argument would silently measure the NAME instead of the PATH,
 * disabling this entire guard with no compile error and no failing test. Required means the compiler
 * refuses to build such a caller. Pass '' explicitly if you genuinely mean "no prefix".
 *
 * Always suffixes the short id (the LOCKED behaviour). If the stem sanitizes to empty, the row id
 * alone carries the name, so a file can never be PUT as a bare extension.
 *
 * LENGTH: only the STEM is ever truncated. The short id and the extension are what make the file
 * unique and openable, so they are never cut. If even a zero-length stem does not fit, this THROWS
 * rather than return a name SharePoint will reject — a loud failure that leaves the row in the
 * inbox beats a silent 400 on the PUT.
 */
export function filedFileName(rowId: string, originalFileName: string, prefix: string): string {
  const { stem, ext } = splitExtension(originalFileName);
  const safeStem = sanitizeStem(stem);
  const safeExt = sanitizeExt(ext);

  // What the name may cost, given everything it gets appended to.
  const nameBudget = MAX_SHAREPOINT_PATH - prefix.length;

  // The fallback name (no usable stem) — the row id carries it.
  const fallback = trimTrailing(`${rowId}${safeExt}`);
  if (!safeStem) {
    if (fallback.length > nameBudget) {
      throw new Error(
        `filedFileName: destination path would exceed SharePoint's ${MAX_SHAREPOINT_PATH}-character limit ` +
          `even with no filename left to cut (prefix is ${prefix.length} chars). The job folder path is too long.`,
      );
    }
    return fallback;
  }

  const suffix = `-${shortId(rowId)}`;
  const stemBudget = nameBudget - suffix.length - safeExt.length;

  // No room for even one character of stem — fall back to the row id and let THAT be length-checked.
  if (stemBudget <= 0) {
    if (fallback.length > nameBudget) {
      throw new Error(
        `filedFileName: destination path would exceed SharePoint's ${MAX_SHAREPOINT_PATH}-character limit ` +
          `even with no filename left to cut (prefix is ${prefix.length} chars). The job folder path is too long.`,
      );
    }
    return fallback;
  }

  // Truncate the STEM only. trimTrailing runs AFTER the cut, because cutting mid-name can leave a
  // trailing dot or space — which is the very thing SharePoint rejects.
  const cutStem = trimTrailing(safeStem.slice(0, stemBudget));
  if (!cutStem) return fallback;

  return trimTrailing(`${cutStem}${suffix}${safeExt}`);
}
