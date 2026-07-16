// THE five job subfolder names. ONE source. Every consumer imports this — nobody copies it.
//
// WHY A SEPARATE LEAF FILE, and not just "import it from graph.ts": graph.ts is a Deno edge-function
// module with Deno.* references throughout. The React app runs in the browser bundle, where `Deno` is
// undefined — importing graph.ts from the browser side dies at runtime. That constraint is exactly why
// the React files each grew their own hand-copy of the list in the first place.
//
// So this file is deliberately INERT: it exports the array and NOTHING else. No imports, no runtime
// API, no Deno, no browser globals. That is what lets the Deno functions AND the browser bundle both
// import the same one, which is the only way the copies stay gone.
//
// The names are VERBATIM — casing, numbering and the " - " spacing are what the client's live
// SharePoint actually uses (confirmed against it 2026-06-08). One character out and the app writes
// into a folder the client does not have. Do not "tidy" them.

export const JOB_SUBFOLDERS = [
  '1. REPORT',
  '2. CLIENT SUPPLIED',
  '3. WORK FILES (TTSZ, PICS, COMPS)',
  '4. CLIENT BILLING (Invoice, LOE)',
  '5. LETTER OF RELIANCE (LOR)',
] as const;

/** One of the five folder names. */
export type JobSubfolder = (typeof JOB_SUBFOLDERS)[number];

// Nested subfolders scaffolded INSIDE certain parent folders at job creation (Item 7A).
//
// LOCKED-VERBATIM — the same discipline as the five parent names above. These strings are
// written into the client's live SharePoint; casing, numbering and spacing are part of the name.
// Do NOT tidy them. A parent folder not listed here gets no nested subfolders.
//
// 'Previous Appraisal' inside CLIENT SUPPLIED is deliberately NOT here: it is an OPTIONAL,
// per-job folder tied to Ben's still-open "previously appraised" decision, not part of the
// unconditional scaffold. Add it only once that decision lands.
export const JOB_SUBSUBFOLDERS: Partial<Record<JobSubfolder, string[]>> = {
  '1. REPORT': ['Old'],
  '2. CLIENT SUPPLIED': ['Old', 'Emails'],
  '3. WORK FILES (TTSZ, PICS, COMPS)': ['1. TTSZ', '2. PICTURES', '3. COMPS'],
};

/** Short labels for tabs, where the full name will not fit. DISPLAY ONLY — never a second name list. */
export const JOB_SUBFOLDER_SHORT_LABELS: Record<JobSubfolder, string> = {
  '1. REPORT': '1. Report',
  '2. CLIENT SUPPLIED': '2. Client Supplied',
  '3. WORK FILES (TTSZ, PICS, COMPS)': '3. Work Files',
  '4. CLIENT BILLING (Invoice, LOE)': '4. Client Billing',
  '5. LETTER OF RELIANCE (LOR)': '5. Letter of Reliance',
};
