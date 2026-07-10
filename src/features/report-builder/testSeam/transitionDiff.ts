/**
 * TRANSITION DIFF — pure field-level comparator (chunk 3, code half).
 *
 * Given two report-builder store snapshots — BASELINE (after Fill-V3) and PUSHED (after
 * Create Report on the seeded job) — emit a field-id-keyed diff and FAIL LOUD on any
 * unexpected mismatch. A mismatch is the product (a mapping bug found); it is never smoothed.
 *
 * PURE: no store / supabase / React imports, so it is unit-testable in isolation and the
 * driver can call it directly. The store-touching helpers (snapshot / clear / assert-empty)
 * live in transitionDiffHarness.ts.
 *
 * ── FRAMING (must appear in the close-out artifact) ─────────────────────────────
 * This diff proves ROUTE-PARITY: the button-fill route (Fill-V3 → composeReportFields) and
 * the real-push route (seed → Create Report) agree, because BOTH go through the same
 * fieldMappings (INV-0). It does NOT prove absolute bridge correctness — a bug shared by BOTH
 * routes is invisible by design. A PASS must NOT be over-read as "the bridge is correct."
 */

export const ROUTE_PARITY_FRAMING =
  'ROUTE-PARITY ONLY: the Fill-V3 button route and the real Create-Report push route agree ' +
  '(both traverse the same fieldMappings, INV-0). This is NOT absolute bridge correctness — ' +
  'a bug shared by both routes is invisible by design. Do not over-read a PASS.';

/** A full store snapshot: report-builder field-id → normalized string value. */
export type StoreSnapshot = Record<string, string>;

/**
 * The V3-origin fields the report bridge does NOT carry (chunk-2 finding). They are expected
 * empty from the bridge on BOTH sides, so a both-empty result is a known-gap, not a match to
 * celebrate — and a POPULATED value on either side is flagged for the wire/don't-wire ruling.
 */
export const BRIDGE_WATCH_FIELD_IDS: readonly string[] = [
  'asset-condition',
  'valuation-premises',
  'property-subtype',
  'property-city',
  'property-province',
  'property-postal',
  'client-title',
  'intake-notes',
  'delivery-date',
  'appraisal-fee',
  'retainer-amount',
  'payment-terms',
  'appraiser-comments',
];

const WATCH_SET = new Set<string>(BRIDGE_WATCH_FIELD_IDS);

export type DiffStatus =
  | 'match' // baseline === pushed, and (if watch) not both-empty-trivial
  | 'mismatch' // baseline !== pushed on a non-watch field — a real bridge bug. FAILS the run.
  | 'known-gap' // watch field, both empty — expected (bridge does not carry it)
  | 'watch-populated'; // watch field carries a value — flag for the wire/don't-wire ruling

export interface DiffRow {
  fieldId: string;
  baseline: string;
  pushed: string;
  match: boolean;
  expectedEmptyFromBridge: boolean;
  status: DiffStatus;
}

export interface DiffResult {
  rows: DiffRow[];
  mismatches: DiffRow[]; // non-watch mismatches — the failures
  watchPopulated: DiffRow[]; // watch fields that carried a value — ruling items, not failures
  ok: boolean; // true iff there are zero non-watch mismatches
}

const isEmpty = (v: string | undefined): boolean => v === undefined || v === '';

/**
 * Compare two snapshots over the union of their field-ids. Non-watch mismatches are failures;
 * watch fields are classified known-gap (both empty) or watch-populated (has a value).
 */
export function diffSnapshots(
  baseline: StoreSnapshot,
  pushed: StoreSnapshot,
): DiffResult {
  const fieldIds = Array.from(
    new Set([...Object.keys(baseline), ...Object.keys(pushed)]),
  ).sort();

  const rows: DiffRow[] = fieldIds.map((fieldId) => {
    const b = baseline[fieldId] ?? '';
    const p = pushed[fieldId] ?? '';
    const match = b === p;
    const watch = WATCH_SET.has(fieldId);

    let status: DiffStatus;
    if (watch) {
      status = isEmpty(b) && isEmpty(p) ? 'known-gap' : 'watch-populated';
    } else {
      status = match ? 'match' : 'mismatch';
    }

    return {
      fieldId,
      baseline: b,
      pushed: p,
      match,
      expectedEmptyFromBridge: watch,
      status,
    };
  });

  const mismatches = rows.filter((r) => r.status === 'mismatch');
  const watchPopulated = rows.filter((r) => r.status === 'watch-populated');
  return { rows, mismatches, watchPopulated, ok: mismatches.length === 0 };
}

/**
 * FAIL LOUD. Throws if any non-watch field mismatched — a mapping bug the run exists to catch.
 * Watch-populated rows do NOT throw (they route to the wire/don't-wire ruling) but are named.
 */
export function assertRouteParity(result: DiffResult): void {
  if (!result.ok) {
    const detail = result.mismatches
      .map((m) => `  ${m.fieldId}: baseline="${m.baseline}" pushed="${m.pushed}"`)
      .join('\n');
    throw new Error(
      `TRANSITION DIFF FAILED — ${result.mismatches.length} field(s) diverge between the ` +
        `Fill-V3 baseline and the Create-Report push (a bridge mapping bug):\n${detail}`,
    );
  }
}

/** Render the diff as a fixed-width table for the builds/ artifact. */
export function formatDiffTable(result: DiffResult): string {
  const head = `${ROUTE_PARITY_FRAMING}\n\n` +
    `fieldId | baseline | pushed | status\n` +
    `------- | -------- | ------ | ------`;
  const body = result.rows
    .map((r) => `${r.fieldId} | ${r.baseline} | ${r.pushed} | ${r.status}`)
    .join('\n');
  const summary =
    `\n\nSUMMARY: ${result.ok ? 'PASS (route-parity)' : 'FAIL'} — ` +
    `${result.mismatches.length} mismatch(es), ${result.watchPopulated.length} watch-populated, ` +
    `${result.rows.filter((r) => r.status === 'known-gap').length} known-gap(s).`;
  return `${head}\n${body}${summary}`;
}
