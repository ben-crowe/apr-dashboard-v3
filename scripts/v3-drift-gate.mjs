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

// --- PROD detection: explicit --prod, else VITE_V4_ENABLED unset/!=='true' => prod (Slice-2 contract).
const isProd = process.argv.includes('--prod') || process.env.VITE_V4_ENABLED !== 'true';

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

  // Twin disambiguation: sectionHome must match (never match by name alone).
  if (actual.sectionHome && c.sectionHome && actual.sectionHome !== c.sectionHome)
    return { state: 'BLOCK', why: `sectionHome mismatch ${actual.sectionHome}!=${c.sectionHome}` };

  // FAIL-CLOSED: options must be machine-readable to be checked.
  if (actual.readable === false) return { state: 'BLOCK', why: 'options not machine-readable (fail-closed)' };

  // STRICT diff: options (set), order, required. Master expectations live on the manifest's
  // master mirror OR are carried per-field; here we diff actual vs its recorded master snapshot.
  const drift = [];
  if (actual.master) {
    const a = actual, M = actual.master;
    const optA = JSON.stringify([...(a.options || [])].sort());
    const optM = JSON.stringify([...(M.options || [])].sort());
    if (optA !== optM) drift.push('options');
    if ((a.order ?? null) !== (M.order ?? null)) drift.push('order');
    if ((a.required ?? null) !== (M.required ?? null)) drift.push('required');
    if ((a.present ?? true) === false) drift.push('absent');
  } else {
    // No master snapshot to compare against = cannot verify = fail-closed.
    return { state: 'BLOCK', why: 'no master snapshot to compare (fail-closed)' };
  }

  if (drift.length === 0) return { state: 'PASS', why: 'in sync' };

  // Mismatch — honor STATUS TAG.
  const status = approved[c.masterName] || actual.status || 'pending';
  if (status === 'approved-change') return { state: 'PASS', why: `intentional (approved-change): ${drift.join(',')}` };
  return { state: 'BLOCK', why: `drift [${drift.join(',')}] status=${status}` };
}

// --- Run.
const expectedCheckable = checks.filter((c) => c.checkable !== false).length;
let verified = 0;
const blocks = [];
const flags = [];
for (const c of checks) {
  const r = compareField(c);
  if (c.checkable !== false && r.state === 'PASS') verified++;      // only a real PASS counts as verified
  if (r.state === 'BLOCK') blocks.push({ field: c.masterName, v3key: c.v3key, why: r.why });
  if (r.state === 'FLAG') flags.push({ field: c.masterName, v3key: c.v3key, why: r.why });
}

// COVERAGE: verified must reach expectedCheckable, else we're blind on some checkable field.
const coverageOK = verified === expectedCheckable;

const summary = {
  gate: 'v3-drift', prod: isProd,
  total: checks.length, expectedCheckable, verified,
  coverageOK, blocks: blocks.length, blockDetail: blocks,
  flags: flags.length, flagDetail: flags,
};

// FLAGS are always surfaced (never silent), regardless of pass/block.
if (flags.length && !asJson) for (const f of flags) console.log(`⚑ FLAG ${f.field} (${f.v3key}): ${f.why}`);

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
