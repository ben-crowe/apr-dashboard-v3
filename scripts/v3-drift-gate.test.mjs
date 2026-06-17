#!/usr/bin/env node
/**
 * Multi-case self-test for v3-drift-gate.mjs (Phase-3 proof).
 * Builds fixtures from the certified config and asserts the gate blocks the right cases,
 * passes the rest, honors status tags, and reports correct coverage. Mutates NO real state.
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CONFIG = 'docs/Features/08-Master-Field-Registry/GENERATED-v3-drift-check.json';
const GATE = 'scripts/v3-drift-gate.mjs';
const config = JSON.parse(readFileSync(CONFIG, 'utf8'));
const checkable = config.checks.filter((c) => c.checkable !== false);
const dir = mkdtempSync(join(tmpdir(), 'driftgate-'));

// Build a CLEAN, in-sync manifest for every checkable field (keyed by v3key).
function cleanManifest() {
  const fields = {};
  for (const c of checkable) {
    fields[c.v3key] = {
      present: true, readable: true, sectionHome: c.sectionHome,
      options: ['a', 'b'], order: 1, required: true,
      master: { options: ['a', 'b'], order: 1, required: true },
    };
  }
  return { fields };
}
function write(name, obj) { const p = join(dir, name); writeFileSync(p, JSON.stringify(obj)); return p; }
function runGate(manifestPath, { approved, prod = true } = {}) {
  const args = [GATE, '--config', CONFIG, '--manifest', manifestPath, '--json'];
  if (approved) args.push('--approved', approved);
  if (prod) args.push('--prod');
  try {
    const out = execFileSync('node', args, { encoding: 'utf8', env: { ...process.env, VITE_V4_ENABLED: prod ? '' : 'true' } });
    return { code: 0, out: JSON.parse(out) };
  } catch (e) {
    return { code: e.status, out: JSON.parse(e.stdout || '{}') };
  }
}

let pass = 0, fail = 0;
const assert = (name, cond, detail) => { if (cond) { pass++; console.log(`  ✓ ${name}`); } else { fail++; console.log(`  ✗ ${name} — ${detail}`); } };

// InspectionDate accepted as known-gap so the fail-closed row doesn't block the clean case.
const acceptGap = write('approved-gap.json', { InspectionDate: 'known-gap' });

// CASE A — clean + accepted gap => PASS, full coverage, 1 flag.
{
  const r = runGate(write('A.json', cleanManifest()), { approved: acceptGap });
  assert('A clean → PASS', r.code === 0 && r.out.result === 'PASS', JSON.stringify(r.out).slice(0, 200));
  assert('A coverage full', r.out.verified === checkable.length && r.out.coverageOK, `verified=${r.out.verified}/${checkable.length}`);
  assert('A InspectionDate flagged (not silent)', r.out.flags === 1, `flags=${r.out.flags}`);
}

// CASE B — option drift on one field, unaccepted => BLOCK that field.
{
  const man = cleanManifest(); const t = checkable[0];
  man.fields[t.v3key].options = ['a', 'c'];  // changed dropdown option (Chris's real edit)
  const r = runGate(write('B.json', man), { approved: acceptGap });
  assert('B option-drift → BLOCK exit 1', r.code === 1 && r.out.result === 'BLOCK', `code=${r.code}`);
  assert('B blocks the drifted field', r.out.blockDetail.some((b) => b.field === t.masterName && /options/.test(b.why)), JSON.stringify(r.out.blockDetail));
}

// CASE C — a checkable field missing from manifest => BLOCK + coverage blind.
{
  const man = cleanManifest(); const t = checkable[1]; delete man.fields[t.v3key];
  const r = runGate(write('C.json', man), { approved: acceptGap });
  assert('C missing-field → BLOCK', r.code === 1 && r.out.result === 'BLOCK', `code=${r.code}`);
  assert('C coverage BLIND', r.out.coverageOK === false && r.out.verified < checkable.length, `verified=${r.out.verified}`);
}

// CASE D — unreadable options => fail-closed BLOCK.
{
  const man = cleanManifest(); const t = checkable[2]; man.fields[t.v3key].readable = false;
  const r = runGate(write('D.json', man), { approved: acceptGap });
  assert('D unreadable → fail-closed BLOCK', r.code === 1 && r.out.blockDetail.some((b) => /readable/.test(b.why)), JSON.stringify(r.out.blockDetail).slice(0, 200));
}

// CASE E — same drift as B but marked approved-change => PASS.
{
  const man = cleanManifest(); const t = checkable[0]; man.fields[t.v3key].options = ['a', 'c'];
  const appr = write('approved-E.json', { InspectionDate: 'known-gap', [t.masterName]: 'approved-change' });
  const r = runGate(write('E.json', man), { approved: appr });
  assert('E approved-change drift → PASS', r.code === 0 && r.out.result === 'PASS', JSON.stringify(r.out).slice(0, 200));
}

// CASE F — InspectionDate NOT accepted => fail-closed BLOCK (the real safety).
{
  const r = runGate(write('F.json', cleanManifest()), { approved: null });
  assert('F unaccepted fail-closed gap → BLOCK', r.code === 1 && r.out.blockDetail.some((b) => b.field === 'InspectionDate'), JSON.stringify(r.out.blockDetail).slice(0, 200));
}

// CASE G — empty manifest => fail-closed BLOCK (never silent green).
{
  const r = runGate(write('G.json', { fields: {} }), { approved: acceptGap });
  assert('G empty manifest → BLOCK (not silent-pass)', r.code === 1 && r.out.result === 'BLOCK', `code=${r.code}`);
}

// CASE H — drift in NON-PROD => report-only (exit 0, but result still BLOCK in payload).
{
  const man = cleanManifest(); man.fields[checkable[0].v3key].options = ['a', 'c'];
  const r = runGate(write('H.json', man), { approved: acceptGap, prod: false });
  assert('H non-prod drift → report-only exit 0', r.code === 0 && r.out.result === 'BLOCK', `code=${r.code} result=${r.out.result}`);
}

console.log(`\nv3-drift-gate self-test: ${pass} passed, ${fail} failed (fixtures in ${dir})`);
process.exit(fail === 0 ? 0 : 1);
