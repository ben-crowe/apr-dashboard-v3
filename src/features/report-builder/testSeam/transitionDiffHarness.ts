/**
 * TRANSITION DIFF HARNESS — store-touching helpers + the diff-run PROCEDURE CONTRACT (chunk 3).
 *
 * These read/mutate the report-builder store through its PUBLIC API only (getState().sections
 * + updateFieldValue) — NO edit to reportBuilderStore.ts. The pure comparator lives in
 * transitionDiff.ts; this file is what the driver (codex / cmux-browser) wires around a live run.
 *
 * ── THE PROCEDURE CONTRACT (anti-vacuous-pass — the driver MUST run this exact sequence) ──────
 *   1. Fill-V3           → click "Fill V3 Test Data" (writes the V3-origin fields from the seam).
 *   2. snapshotReportStore()               → BASELINE.
 *   3. clearReportStore()                  → empty every field.
 *   4. assertStoreEmpty()                  → NEGATIVE CONTROL. Proves the store is blank so any
 *                                            value in PUSHED must come FROM the bridge, not
 *                                            residual baseline. (Create Report is
 *                                            gap-fill-never-clobbers / INV-4 — without the clear,
 *                                            it would SKIP the still-filled fields and the diff
 *                                            would show all-match while the bridge never ran: a
 *                                            vacuous, self-fulfilling PASS.)
 *   5. seedTransitionJob() → jobId         → the 3-row Create-Report read-set.
 *   6. Create Report on jobId              → the bridge pushes into the (now blank) store.
 *   7. snapshotReportStore()               → PUSHED.
 *   8. diffSnapshots(BASELINE, PUSHED)     → assertRouteParity + formatDiffTable → builds/ artifact.
 *   Optional sentinel (step 5a): seed one field to a value distinct from baseline and confirm the
 *   PUSHED snapshot shows the seeded value — extra proof the bridge, not residual state, wrote it.
 */

import { useReportBuilderStore } from '../store/reportBuilderStore';
import { V3_ORIGIN_FIELD_IDS } from './v3OriginFields';
import type { StoreSnapshot } from './transitionDiff';

/** Normalize any store field value (string | string[] | number) to a string for diffing. */
function normalize(value: string | string[] | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

/** Every field-id in the store (top-level + subsection fields), for iteration. */
function allFieldIds(): string[] {
  const ids: string[] = [];
  for (const section of useReportBuilderStore.getState().sections) {
    for (const f of section.fields) ids.push(f.id);
    for (const sub of section.subsections ?? []) {
      for (const f of sub.fields) ids.push(f.id);
    }
  }
  return ids;
}

/** Read a full field-id → value snapshot of the current store. */
export function snapshotReportStore(): StoreSnapshot {
  const snap: StoreSnapshot = {};
  for (const section of useReportBuilderStore.getState().sections) {
    for (const f of section.fields) snap[f.id] = normalize(f.value);
    for (const sub of section.subsections ?? []) {
      for (const f of sub.fields) snap[f.id] = normalize(f.value);
    }
  }
  return snap;
}

/** Empty every field in the store (the anti-vacuous CLEAR — forces the bridge to write blanks). */
export function clearReportStore(): void {
  const updateFieldValue = useReportBuilderStore.getState().updateFieldValue;
  for (const id of allFieldIds()) updateFieldValue(id, '');
}

/**
 * NEGATIVE CONTROL. Throw if any of the given field-ids is non-empty after the clear. Defaults
 * to the V3-origin id-set (the fields the bridge is expected to populate on push) — proving they
 * are blank pre-push is what makes a matching PUSHED value attributable to the bridge.
 */
export function assertStoreEmpty(
  fieldIds: readonly string[] = V3_ORIGIN_FIELD_IDS,
): void {
  const snap = snapshotReportStore();
  const stillFilled = fieldIds.filter((id) => (snap[id] ?? '') !== '');
  if (stillFilled.length > 0) {
    throw new Error(
      `assertStoreEmpty FAILED — ${stillFilled.length} field(s) not blank after clear ` +
        `(the negative control failed; a PASS would be vacuous): ${stillFilled.join(', ')}`,
    );
  }
}
