#!/usr/bin/env node
/**
 * Multi-case self-test for v3-drift-gate.mjs (Phase-3 proof, NON-CIRCULAR model).
 * MASTER comes from config.masterExpectations (registry-sourced). The manifest supplies
 * V3-ACTUAL ONLY (present/options/order/required/readable) — NEVER a master snapshot.
 * Asserts: blocks real drift, passes in-sync, honors status tags, reports true coverage,
 * and FAIL-CLOSES on the circular cases. Mutates NO real state.
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CONFIG = 'docs/Features/08-Master-Field-Registry/GENERATED-v3-drift-check.json';
const GATE = 'scripts/v3-drift-gate.mjs';
const config = JSON.parse(readFileSync(CONFIG, 'utf8'));
const checkable = config.checks.filter((c) => c.checkable !== false);
const dd = checkable.find((c) => Array.isArray(c.masterExpectations?.options)); // a dropdown field
const txt = checkable.find((c) => !c.masterExpectations?.options);              // a required-only field
const kg = checkable.find((c) => c.knownGap && Array.isArray(c.knownGap.allowed) && Array.isArray(c.masterExpectations?.options)); // a known-gap dropdown (e.g. PropertyType)
const dir = mkdtempSync(join(tmpdir(), 'driftgate-'));

// CLEAN V3-actual manifest = mirrors each field's registry masterExpectations (in sync). NO master key.
function cleanManifest() {
  const fields = {};
  for (const c of checkable) {
    const M = c.masterExpectations;
    fields[c.v3key] = {
      present: true, readable: true, sectionHome: c.sectionHome,
      required: M.required,
      options: Array.isArray(M.options) ? [...M.options] : null,
    };
  }
  return { fields };
}
function write(name, obj) { const p = join(dir, name); writeFileSync(p, JSON.stringify(obj)); return p; }
function runGate(manifestPath, { approved, prod = true, configPath = CONFIG } = {}) {
  const args = [GATE, '--config', configPath, '--manifest', manifestPath, '--json'];
  if (approved) args.push('--approved', approved);
  if (prod) args.push('--prod');
  try {
    const out = execFileSync('node', args, { encoding: 'utf8', env: { ...process.env, VITE_V4_ENABLED: prod ? '' : 'true' } });
    return { code: 0, out: JSON.parse(out) };
  } catch (e) { return { code: e.status, out: JSON.parse(e.stdout || '{}') }; }
}

let pass = 0, fail = 0;
const assert = (name, cond, detail) => { if (cond) { pass++; console.log(`  ✓ ${name}`); } else { fail++; console.log(`  ✗ ${name} — ${detail}`); } };
const acceptGap = write('approved-gap.json', { InspectionDate: 'known-gap' });

// ===== 12 PRIOR CASES (now on the non-circular fixture model) =====
// A — clean + accepted gap => PASS, full coverage, 1 flag.
{
  const r = runGate(write('A.json', cleanManifest()), { approved: acceptGap });
  assert('A clean → PASS', r.code === 0 && r.out.result === 'PASS', JSON.stringify(r.out).slice(0, 200));
  assert('A coverage full', r.out.verified === checkable.length && r.out.coverageOK, `verified=${r.out.verified}/${checkable.length}`);
  assert('A InspectionDate flagged (not silent)', r.out.flags === 1, `flags=${r.out.flags}`);
}
// B — dropdown OPTION drift vs registry-master, unaccepted => BLOCK that field.
{
  const man = cleanManifest(); man.fields[dd.v3key].options = [...dd.masterExpectations.options].reverse(); // order drift
  const r = runGate(write('B.json', man), { approved: acceptGap });
  assert('B option-order drift → BLOCK exit 1', r.code === 1 && r.out.result === 'BLOCK', `code=${r.code}`);
  assert('B blocks the drifted dropdown', r.out.blockDetail.some((b) => b.field === dd.masterName && /options/.test(b.why)), JSON.stringify(r.out.blockDetail).slice(0, 200));
}
// C — checkable field missing from manifest => BLOCK + coverage blind.
{
  const man = cleanManifest(); delete man.fields[checkable[1].v3key];
  const r = runGate(write('C.json', man), { approved: acceptGap });
  assert('C missing-field → BLOCK', r.code === 1 && r.out.result === 'BLOCK', `code=${r.code}`);
  assert('C coverage BLIND', r.out.coverageOK === false && r.out.verified < checkable.length, `verified=${r.out.verified}`);
}
// D — unreadable options => fail-closed BLOCK.
{
  const man = cleanManifest(); man.fields[dd.v3key].readable = false;
  const r = runGate(write('D.json', man), { approved: acceptGap });
  assert('D unreadable → fail-closed BLOCK', r.code === 1 && r.out.blockDetail.some((b) => /readable/.test(b.why)), JSON.stringify(r.out.blockDetail).slice(0, 200));
}
// ===== VALUE-SCOPED KNOWN-GAP CASES (the prod-live hole + its inverse) =====
// kg = a known-gap dropdown (e.g. PropertyType, allowed=[Seniors,Other]).
const kgAllowed = kg.knownGap.allowed;
const kgOpts = kg.masterExpectations.options;
const kgShared = kgOpts.filter((v) => !kgAllowed.includes(v)); // the protected, non-allowed values
const tagKg = (extra = {}) => write('appr-kg.json', { InspectionDate: 'known-gap', [kg.masterName]: 'approved-change', ...extra });

// (KG-1) tagged approved-change + a SHARED value CORRUPTED (not in allowed) => MUST BLOCK (the hole).
{
  const man = cleanManifest();
  const opts = [...kgOpts]; opts[0] = opts[0] + ' CORRUPTED';   // corrupt a shared, non-allowed value
  man.fields[kg.v3key].options = opts;
  const r = runGate(write('KG1.json', man), { approved: tagKg() });
  assert('(KG-1) approved-change + corrupted SHARED value → BLOCK (hole closed)', r.code === 1 && r.out.blockDetail.some((b) => b.field === kg.masterName && /residual/.test(b.why)), JSON.stringify(r.out.blockDetail).slice(0, 240));
}
// (KG-2) tagged + divergence EXACTLY the allowed set (drop allowed items) => PASS (narrow suppression).
{
  const man = cleanManifest();
  man.fields[kg.v3key].options = kgOpts.filter((v) => !kgAllowed.includes(v)); // removed == allowed set
  const r = runGate(write('KG2.json', man), { approved: tagKg() });
  assert('(KG-2) divergence ⊆ allowed → PASS (narrow)', r.code === 0 && r.out.result === 'PASS', JSON.stringify(r.out).slice(0, 240));
}
// (KG-3) tagged + ORDER drift on SHARED (non-allowed) values => BLOCK.
{
  const man = cleanManifest();
  const opts = [...kgOpts];
  // swap the first two shared values' positions (order drift among protected values)
  const i = opts.indexOf(kgShared[0]), j = opts.indexOf(kgShared[1]);
  [opts[i], opts[j]] = [opts[j], opts[i]];
  man.fields[kg.v3key].options = opts;
  const r = runGate(write('KG3.json', man), { approved: tagKg() });
  assert('(KG-3) order drift on shared values → BLOCK', r.code === 1 && r.out.blockDetail.some((b) => b.field === kg.masterName && /ORDER/.test(b.why)), JSON.stringify(r.out.blockDetail).slice(0, 240));
}
// (KG-4) tagged known-gap but config has NO allowed set for it => fail-closed BLOCK.
{
  const bad = JSON.parse(JSON.stringify(config));
  const victim = bad.checks.find((c) => c.masterName === kg.masterName);
  victim.knownGap = null;                                    // strip the allowed set
  const badCfg = write('config-noallowed.json', bad);
  const man = cleanManifest(); man.fields[kg.v3key].options = [...kgOpts].reverse(); // any drift
  const r = runGate(write('KG4.json', man), { approved: tagKg(), configPath: badCfg });
  assert('(KG-4) known-gap tag + no allowed set → fail-closed BLOCK', r.code === 1 && r.out.blockDetail.some((b) => b.field === kg.masterName && /allowed set/i.test(b.why)), JSON.stringify(r.out.blockDetail).slice(0, 240));
}
// F — InspectionDate NOT accepted => fail-closed BLOCK.
{
  const r = runGate(write('F.json', cleanManifest()), { approved: null });
  assert('F unaccepted fail-closed gap → BLOCK', r.code === 1 && r.out.blockDetail.some((b) => b.field === 'InspectionDate'), JSON.stringify(r.out.blockDetail).slice(0, 200));
}
// G — empty manifest => fail-closed BLOCK.
{
  const r = runGate(write('G.json', { fields: {} }), { approved: acceptGap });
  assert('G empty manifest → BLOCK (not silent-pass)', r.code === 1 && r.out.result === 'BLOCK', `code=${r.code}`);
}
// H — drift in NON-PROD => report-only (exit 0, payload BLOCK).
{
  const man = cleanManifest(); man.fields[dd.v3key].options = [...dd.masterExpectations.options].reverse();
  const r = runGate(write('H.json', man), { approved: acceptGap, prod: false });
  assert('H non-prod drift → report-only exit 0', r.code === 0 && r.out.result === 'BLOCK', `code=${r.code} result=${r.out.result}`);
}
// twin sectionHome mismatch => BLOCK
{
  const man = cleanManifest(); man.fields[txt.v3key].sectionHome = txt.sectionHome === 'S1' ? 'S2' : 'S1';
  const r = runGate(write('Htwin.json', man), { approved: acceptGap });
  assert('twin sectionHome mismatch → BLOCK', r.code === 1 && r.out.blockDetail.some((b) => /sectionHome/.test(b.why)), JSON.stringify(r.out.blockDetail).slice(0, 160));
}

// ===== 3 NEW NON-CIRCULAR CASES =====
// (a) MASTER MISSING from config (checkable row stripped of masterExpectations) => fail-closed RED.
{
  const bad = JSON.parse(JSON.stringify(config));
  const victim = bad.checks.find((c) => c.checkable !== false);
  delete victim.masterExpectations;
  const badCfg = write('config-nomaster.json', bad);
  const r = runGate(write('case-a.json', cleanManifest()), { approved: acceptGap, configPath: badCfg });
  assert('(a) master-missing-from-config → fail-closed RED', r.code === 1 && r.out.blockDetail.some((b) => b.field === victim.masterName && /masterExpectations/.test(b.why)), JSON.stringify(r.out.blockDetail).slice(0, 200));
}
// (b) ⚑ required-ONLY mismatch => REPORT-ONLY PASS (NOT a block) — v1 policy.
{
  const man = cleanManifest(); man.fields[txt.v3key].required = !txt.masterExpectations.required;
  const r = runGate(write('case-b.json', man), { approved: acceptGap });
  assert('(b) required-only mismatch → report-only PASS (not block)', r.code === 0 && r.out.result === 'PASS', `code=${r.code} result=${r.out.result}`);
  assert('(b) required divergence REPORTED in info', r.out.info >= 1 && r.out.infoDetail.some((i) => i.field === txt.masterName && /required/.test(i.note)), JSON.stringify(r.out.infoDetail).slice(0, 200));
}
// (b2) ⚑ REAL V3 SHAPE: every field required=null (V3 doesn't enforce) => PASS, full coverage, all reported.
{
  const man = cleanManifest();
  for (const k of Object.keys(man.fields)) man.fields[k].required = null;
  const r = runGate(write('case-b2.json', man), { approved: acceptGap });
  assert('(b2) all-required-null (real V3) → PASS not 100%-block', r.code === 0 && r.out.result === 'PASS', `code=${r.code} result=${r.out.result}`);
  assert('(b2) full coverage despite required=null everywhere', r.out.verified === checkable.length && r.out.coverageOK, `verified=${r.out.verified}/${checkable.length}`);
  assert('(b2) required divergences all REPORTED (not silent)', r.out.info >= 1, `info=${r.out.info}`);
}
// (b3) OPTION/order mismatch STILL BLOCKS (blocking dimension intact) — guard against over-loosening.
{
  const man = cleanManifest(); man.fields[dd.v3key].options = [...dd.masterExpectations.options].reverse();
  const r = runGate(write('case-b3.json', man), { approved: acceptGap });
  assert('(b3) option/order mismatch STILL BLOCKS', r.code === 1 && r.out.blockDetail.some((b) => b.field === dd.masterName && /options/.test(b.why)), JSON.stringify(r.out.blockDetail).slice(0, 200));
}
// (c) V3-ACTUAL matches registry-master => PASS (explicit non-circular pass).
{
  const r = runGate(write('case-c.json', cleanManifest()), { approved: acceptGap });
  assert('(c) V3==registry-master → PASS', r.code === 0 && r.out.result === 'PASS' && r.out.verified === checkable.length, JSON.stringify(r.out).slice(0, 200));
}
// (d bonus) manifest smuggles its own master => circular-guard BLOCK.
{
  const man = cleanManifest(); man.fields[dd.v3key].master = { options: ['x'], required: false };
  const r = runGate(write('case-d.json', man), { approved: acceptGap });
  assert('(d) manifest-carries-master → circular-guard BLOCK', r.code === 1 && r.out.blockDetail.some((b) => /circular/.test(b.why)), JSON.stringify(r.out.blockDetail).slice(0, 200));
}

console.log(`\nv3-drift-gate self-test: ${pass} passed, ${fail} failed (fixtures in ${dir})`);
process.exit(fail === 0 ? 0 : 1);
