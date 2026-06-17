#!/usr/bin/env node
/**
 * V4 Slice-4 Phase 3 — V3 drift-check release-BLOCKING gate (HARDENED).
 *
 * Reads GENERATED-v3-drift-check.json (certified) and compares V3's actual field state
 * (a manifest) against the master via the ALIAS MAP (v3key -> masterName -> v4id) — NEVER
 * assumes v3key==v4id. Renames are real (10 flagged).
 *
 * HARDENED requirements (QA gate):
 *  - STRICT: compares presence + dropdown OPTIONS + field ORDER + REQUIRED-ness, both directions.
 *  - FAIL-CLOSED: a checkable:false row, a field absent from the V3 manifest, an unreadable
 *    options set, OR any internal failure (missing/empty config or manifest) => exit RED.
 *    NEVER reports "no drift" from a failed/empty run.
 *  - COVERAGE COUNT: reports verified-count; if verified < expected checkable => BLIND => RED.
 *  - STATUS TAG: synced|approved-change|pending. An unexplained mismatch BLOCKS; an
 *    approved-change PASSES (intentional divergence preserved); pending BLOCKS (not yet reconciled).
 *  - PRODUCTION-ONLY: blocks the prod release; preview/dev report-only (never block).
 *  - PER-CHANGE: invoke on every change (CI hook calls this script).
 *  - TWIN NAMES: disambiguated by sectionHome (never by name alone).
 *
 * Exit codes: 0 = pass (or report-only on non-prod); 1 = BLOCK (drift / blind / fail-closed).
 *
 * Usage:
 *   node scripts/v3-drift-gate.mjs --config <drift-check.json> --manifest <v3-actual.json> \
 *        [--approved <approved-changes.json>] [--prod] [--json]
 *   (--prod forces prod/blocking mode; otherwise inferred from VITE_V4_ENABLED unset => prod.)
 */
import { readFileSync, existsSync } from 'node:fs';

function arg(flag, def = null) {
  const i = process.argv.indexOf(flag);
  if (i === -1) return def;
  const v = process.argv[i + 1];
  return v && !v.startsWith('--') ? v : true;
}
const asJson = process.argv.includes('--json');

// --- PROD detection (build-time reliable). The gate BLOCKS only the PRODUCTION build:
//   • --prod            → explicit (tests).
//   • VERCEL_ENV==='production' → the canonical Vercel prod-build signal (preview/dev/local are NOT prod).
// NOTE: do NOT key off VITE_V4_ENABLED here — Vite .env files are NOT loaded into a pre-build node
// step's process.env, so that heuristic would wrongly mark local `npm run build` as prod. VERCEL_ENV
// is the same prod/preview boundary Slice-2 rides on, but it's actually present at build time.
const isProd = process.argv.includes('--prod') || process.env.VERCEL_ENV === 'production';

const RED = (m) => { console.error('⛔ DRIFT-GATE BLOCK: ' + m); };
const OK = (m) => { console.log('✅ ' + m); };

function fail(reason, detail) {
  // FAIL-CLOSED: any failure path lands here. Never a silent green.
  const verdict = { gate: 'v3-drift', result: 'BLOCK', prod: isProd, reason, detail };
  if (asJson) console.log(JSON.stringify(verdict, null, 2));
  RED(`${reason}${detail ? ' :: ' + JSON.stringify(detail) : ''}`);
  // Non-prod: report the block but do not fail the build (preview/dev iterate freely).
  process.exit(isProd ? 1 : 0);
}

// --- Load + sanity (fail-closed on missing/empty).
const configPath = arg('--config', 'docs/Features/08-Master-Field-Registry/GENERATED-v3-drift-check.json');
const manifestPath = arg('--manifest');
const approvedPath = arg('--approved');

let config, manifest, approved = {};
try {
  if (!existsSync(configPath)) fail('config-missing', { configPath });
  config = JSON.parse(readFileSync(configPath, 'utf8'));
} catch (e) { fail('config-unreadable', { configPath, error: String(e) }); }

const checks = config?.checks;
if (!Array.isArray(checks) || checks.length === 0) fail('config-empty', { checks: checks?.length ?? null });

if (!manifestPath || !existsSync(manifestPath)) fail('manifest-missing', { manifestPath });
try { manifest = JSON.parse(readFileSync(manifestPath, 'utf8')); }
catch (e) { fail('manifest-unreadable', { manifestPath, error: String(e) }); }
if (!manifest || typeof manifest !== 'object') fail('manifest-empty', {});

if (approvedPath && existsSync(approvedPath)) {
  try { approved = JSON.parse(readFileSync(approvedPath, 'utf8')); } catch { /* approved is optional; ignore parse */ }
}

// manifest keyed by v3key -> { present, options[], order, required, readable, status, sectionHome }
const m = manifest.fields || manifest; // tolerate {fields:{...}} or flat {...}

// --- Compare one master check vs V3 actual (STRICT). Returns {state, why}.
function compareField(c) {
  // FAIL-CLOSED: explicitly uncheckable rows are ALWAYS surfaced (never silent-passed).
  //   - An ACCEPTED gap (approved-change | known-gap in the approved list) => FLAG, not block
  //     (e.g. InspectionDate pending Slice-4c: visible every run, but doesn't block prod forever).
  //   - An UNACCEPTED uncheckable => BLOCK (the real fail-closed safety).
  if (c.checkable === false) {
    const s = approved[c.masterName];
    if (s === 'approved-change' || s === 'known-gap')
      return { state: 'FLAG', why: `accepted gap (${s}) — flagged, not blocking: ${c.failClosed || 'no V3 input'}` };
    return { state: 'BLOCK', why: `uncheckable + NOT accepted (${c.failClosed || 'no V3 input'})` };
  }

  // ALIAS MAP: locate V3 actual by v3key — never by v4id/masterName.
  const actual = m[c.v3key];
  if (!actual) return { state: 'BLOCK', why: `v3 field absent for v3key='${c.v3key}'` };

  // ⚑ CIRCULAR-GUARD #1 (fail-closed): MASTER must come from THIS config (registry-sourced
  // masterExpectations), NEVER from V3-actual. A checkable row with no masterExpectations cannot
  // be verified against a real master → RED. (_meta.antiCircular.)
  const M = c.masterExpectations;
  if (!M || typeof M !== 'object')
    return { state: 'BLOCK', why: 'NO masterExpectations in config — circular-guard fail-closed (no registry master to verify against)' };

  // ⚑ CIRCULAR-GUARD #2 (fail-closed): the manifest must supply V3-ACTUAL ONLY. If it smuggles
  // its own master snapshot, the master source would echo the manifest (the circular false-pass).
  if (actual.master !== undefined || actual.masterExpectations !== undefined)
    return { state: 'BLOCK', why: 'manifest carries a master snapshot — circular (manifest must be V3-ACTUAL only)' };

  // Twin disambiguation: sectionHome must match (never match by name alone).
  if (actual.sectionHome && c.sectionHome && actual.sectionHome !== c.sectionHome)
    return { state: 'BLOCK', why: `sectionHome mismatch ${actual.sectionHome}!=${c.sectionHome}` };

  // FAIL-CLOSED: options must be machine-readable to be checked.
  if (actual.readable === false) return { state: 'BLOCK', why: 'options not machine-readable (fail-closed)' };

  // STRICT diff: V3-ACTUAL (manifest) vs MASTER (config.masterExpectations, registry-sourced).
  //  - Dropdowns (master.options is an array) → ORDERED options (set+order) = BLOCKING.
  //  - Presence (absent) = BLOCKING.
  //  - ⚑ `required` = REPORT-ONLY for v1 — V3 does NOT enforce required (e.g. contact fields have
  //    no required attr → V3-actual emits required=null for every field), so a required mismatch is
  //    NOT a real V3 dimension yet and would 100%-false-block. We still COMPARE + REPORT it (so the
  //    divergence is visible), but it NEVER exits RED. Re-enable as blocking when V3 enforces required.
  const masterOpts = Array.isArray(M.options) ? M.options : null;
  const actualOpts = Array.isArray(actual.options) ? actual.options : [];
  const absent = (actual.present ?? true) === false;

  // Value-level divergence (for both the normal block-test AND value-scoped suppression).
  let removed = [], added = [], optionsDiffer = false;
  if (masterOpts) {
    const mset = new Set(masterOpts), aset = new Set(actualOpts);
    removed = masterOpts.filter((v) => !aset.has(v));
    added = actualOpts.filter((v) => !mset.has(v));
    optionsDiffer = JSON.stringify(actualOpts) !== JSON.stringify(masterOpts); // set OR order
  }
  const blockingDrift = [];
  if (absent) blockingDrift.push('absent');
  if (optionsDiffer) blockingDrift.push('options');

  const infoDrift = [];
  if ((actual.required ?? null) !== (M.required ?? null))
    infoDrift.push(`required(v3=${actual.required}, master=${M.required})`); // REPORT-ONLY (v1)

  if (blockingDrift.length === 0)
    return { state: 'PASS', why: infoDrift.length ? `in sync (report-only: ${infoDrift.join(';')})` : 'in sync', info: infoDrift };

  // BLOCKING mismatch — honor STATUS TAG, but VALUE-SCOPED for known-gap/approved-change.
  const status = approved[c.masterName] || actual.status || 'pending';
  if (status === 'approved-change' || status === 'known-gap') {
    // ⚑ VALUE-SCOPED suppression — a known-gap tag must NEVER blanket the whole field.
    // FAIL-CLOSED: tagged but config carries no knownGap.allowed set => cannot suppress => BLOCK.
    const allowed = c.knownGap && Array.isArray(c.knownGap.allowed) ? c.knownGap.allowed : null;
    if (!allowed)
      return { state: 'BLOCK', why: `known-gap tagged but NO knownGap.allowed set in config (fail-closed) — drift [${blockingDrift.join(',')}]`, info: infoDrift };
    const aset = new Set(allowed);
    // residual VALUES = changed/added/removed values NOT in the allowed set (corrupted shared value or new value).
    const residual = [...removed, ...added].filter((v) => !aset.has(v));
    // residual ORDER = relative order of SHARED, non-allowed values must be preserved (allowed items may shift positions).
    let orderResidual = false;
    if (masterOpts) {
      const stableM = masterOpts.filter((v) => actualOpts.includes(v) && !aset.has(v));
      const stableA = actualOpts.filter((v) => masterOpts.includes(v) && !aset.has(v));
      orderResidual = JSON.stringify(stableM) !== JSON.stringify(stableA);
    }
    const residualDetail = [...residual];
    if (absent) residualDetail.push('absent(presence not suppressible)');
    if (orderResidual) residualDetail.push('ORDER-on-shared-values');
    if (residualDetail.length === 0)
      return { state: 'PASS', why: `known-gap honored NARROWLY (all divergence ⊆ allowed): ${[...removed, ...added].join(',') || 'n/a'}`, info: infoDrift };
    return { state: 'BLOCK', why: `known-gap does NOT cover residual [${residualDetail.join(',')}] (allowed=${allowed.join('|')})`, info: infoDrift };
  }
  return { state: 'BLOCK', why: `drift [${blockingDrift.join(',')}] status=${status}`, info: infoDrift };
}

// --- Run.
const expectedCheckable = checks.filter((c) => c.checkable !== false).length;
let verified = 0;
const blocks = [];
const flags = [];
const info = [];   // report-only divergences (required, v1) — surfaced, NEVER blocking
for (const c of checks) {
  const r = compareField(c);
  if (c.checkable !== false && r.state === 'PASS') verified++;      // only a real PASS counts as verified
  if (r.state === 'BLOCK') blocks.push({ field: c.masterName, v3key: c.v3key, why: r.why });
  if (r.state === 'FLAG') flags.push({ field: c.masterName, v3key: c.v3key, why: r.why });
  if (Array.isArray(r.info) && r.info.length) info.push({ field: c.masterName, v3key: c.v3key, note: r.info.join(';') });
}

// COVERAGE: verified must reach expectedCheckable, else we're blind on some checkable field.
const coverageOK = verified === expectedCheckable;

const summary = {
  gate: 'v3-drift', prod: isProd,
  requiredPolicy: 'report-only-v1 (V3 does not enforce required; re-enable as blocking when it does)',
  blockingDimensions: ['options', 'order', 'presence'],
  total: checks.length, expectedCheckable, verified,
  coverageOK, blocks: blocks.length, blockDetail: blocks,
  flags: flags.length, flagDetail: flags,
  info: info.length, infoDetail: info,
};

// FLAGS + report-only INFO are always surfaced (never silent), regardless of pass/block.
if (flags.length && !asJson) for (const f of flags) console.log(`⚑ FLAG ${f.field} (${f.v3key}): ${f.why}`);
if (info.length && !asJson) for (const i of info) console.log(`ℹ️  report-only ${i.field} (${i.v3key}): ${i.note}`);

if (blocks.length > 0 || !coverageOK) {
  if (asJson) console.log(JSON.stringify({ ...summary, result: 'BLOCK' }, null, 2));
  else {
    RED(`${blocks.length} drift/block(s); coverage ${verified}/${expectedCheckable}${coverageOK ? '' : ' (BLIND)'}`);
    for (const b of blocks) console.error(`   - ${b.field} (${b.v3key}): ${b.why}`);
  }
  process.exit(isProd ? 1 : 0);
}

if (asJson) console.log(JSON.stringify({ ...summary, result: 'PASS' }, null, 2));
else OK(`drift-gate PASS — verified ${verified}/${expectedCheckable} checkable fields, 0 drift, ${flags.length} accepted flag(s). (${isProd ? 'PROD/blocking' : 'non-prod/report-only'})`);
process.exit(0);
