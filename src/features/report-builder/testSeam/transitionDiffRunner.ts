/**
 * TRANSITION DIFF RUNNER — DEV-ONLY window bridge for the browser driver (chunk 3 run mechanism).
 *
 * Exposes the seed + harness + comparator on `window.__transitionDiff` so a console/injected-JS
 * driver (codex on localhost dev) can invoke them. STRICTLY dev-only: install() early-returns
 * unless import.meta.env.DEV, and main.tsx imports it behind a DEV guard via a dynamic import, so
 * the whole module is dead-code-eliminated from the prod bundle (the global is absent in prod).
 *
 * No store/registry edit — this only wires the already-committed testSeam pieces to a global.
 *
 * ── THE CONSOLE RECIPE (the driver pastes JS between the real UI clicks) ─────────────────────
 *   // 1. UI: click "Fill V3 Test Data"      (browser driver presses the button)
 *   window.__transitionDiff.baseline = window.__transitionDiff.snapshot();
 *   window.__transitionDiff.clear();
 *   window.__transitionDiff.assertEmpty();                       // negative control — throws if not blank
 *   const jobId = await window.__transitionDiff.seed();          // 3-row read-set, returns job id
 *   // 6. UI: open the report context for jobId, then click "Create Report"  (browser driver)
 *   window.__transitionDiff.pushed = window.__transitionDiff.snapshot();
 *   const r = window.__transitionDiff.diff(window.__transitionDiff.baseline, window.__transitionDiff.pushed);
 *   window.__transitionDiff.assert(r);                           // FAILS LOUD on a non-watch mismatch
 *   console.log(window.__transitionDiff.format(r));              // table → paste into the builds/ artifact
 */

import { seedTransitionJob, cleanupTransitionSeed } from './seedTransitionJob';
import {
  snapshotReportStore,
  clearReportStore,
  assertStoreEmpty,
} from './transitionDiffHarness';
import {
  diffSnapshots,
  assertRouteParity,
  formatDiffTable,
} from './transitionDiff';
import type { StoreSnapshot } from './transitionDiff';

interface TransitionDiffGlobal {
  /** stashed between steps by the driver */
  baseline?: StoreSnapshot;
  pushed?: StoreSnapshot;
  snapshot: typeof snapshotReportStore;
  clear: typeof clearReportStore;
  assertEmpty: typeof assertStoreEmpty;
  seed: typeof seedTransitionJob;
  cleanup: typeof cleanupTransitionSeed;
  diff: typeof diffSnapshots;
  assert: typeof assertRouteParity;
  format: typeof formatDiffTable;
}

declare global {
  interface Window {
    __transitionDiff?: TransitionDiffGlobal;
  }
}

/** Install the DEV-only global. No-op outside dev or without a window. */
export function installTransitionDiffRunner(): void {
  if (!import.meta.env.DEV) return;
  if (typeof window === 'undefined') return;

  window.__transitionDiff = {
    snapshot: snapshotReportStore,
    clear: clearReportStore,
    assertEmpty: assertStoreEmpty,
    seed: seedTransitionJob,
    cleanup: cleanupTransitionSeed,
    diff: diffSnapshots,
    assert: assertRouteParity,
    format: formatDiffTable,
  };

  console.log(
    '[transition-diff] window.__transitionDiff installed (DEV only). ' +
      'Recipe: click Fill-V3 → baseline=snapshot() → clear() → assertEmpty() → ' +
      'jobId=await seed() → open jobId report + Create Report → pushed=snapshot() → ' +
      'assert(diff(baseline,pushed)) → format().',
  );
}
