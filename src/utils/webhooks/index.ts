
// Export all webhook functions
export * from './types';
// './formSubmission' DELETED 2026-07-13 — it was a SECOND, never-called upload path that carried the
// same silent-file-loss bug as the real one (upload error swallowed, row-insert error swallowed). It
// was imported by useFormSubmission but never invoked. Removing the re-export too, so the barrel does
// not resurrect a dead landmine.
export * from './valcre';
export * from './contract';
export * from './google';
export * from './status';
