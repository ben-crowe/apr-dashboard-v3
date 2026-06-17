#!/usr/bin/env node
/**
 * Slice-4b JOB 1 — collision-safe rename + consolidation script.
 *
 * WHY: the inline sed loop corrupted fieldRegistry.ts via substring chaining
 * ('client-organization' ⊂ 'client-organization-address'). This script eliminates that
 * with a SENTINEL two-phase pass (OLD → @@SENTINEL@@ → NEW), exact token forms only,
 * per-field def-count asserts, and block-aware consolidation deletes.
 *
 * USAGE:
 *   node scripts/slice4b-rename.mjs            # DRY-RUN (default) — prints plan + asserts, writes nothing
 *   node scripts/slice4b-rename.mjs --apply    # apply to tree, regen derivatives, print asserts
 *
 * AFTER --apply: run `npm run build` (drift-gate must stay green) + render-verify each field fills.
 * QA-GATED: do not --apply until QA passes the surface map + this script.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const APPLY = process.argv.includes('--apply');
const ROOT = process.cwd();

// 7 clean renames (target id starts at 0 defs → before==after)
const RENAMES = [
  ['client-organization', 'client-company-name'],
  ['client-address', 'client-organization-address'],
  ['intended-use', 'authorized-use'],
  ['value-scenario', 'value-scenarios'],
  ['approaches-applied', 'approaches-to-value'],
  ['timeframe', 'value-timeframe'],
  // ['appraisal-fee', 'fee'],  // ⚑ DROPPED (co-arch decision 2026-06-17): bare 'fee' id = substring footgun, zero client harm keeping 'appraisal-fee'. If client LABEL must read 'Fee', change the label only — NEVER the id. Do NOT enable.
];

// 2 consolidations: remove a def block, then re-point remaining occurrences to the surviving (existing) id
const CONSOLIDATIONS = [
  { from: 'impv-tenancy', into: 'tenancy', removeDef: { id: 'impv-tenancy' }, expectFinal: 1 },
  { from: 'property-rights', into: 'interest-appraised', removeDef: { id: 'property-rights', section: 'exec' }, expectFinal: 2 },
];

const EXCLUDE = ['.backup', '.bak', '_archive', '/dist/', '/.vercel/', 'node_modules', 'reportHtmlTemplate_BACKUP', 'reportHtmlTemplate_BEFORE'];

// ⚑ QA FAIL FIX (property-rights calc-collision): 'property-rights' is ALSO a sales-comp ADJUSTMENT CATEGORY
// (fieldGenerators.ts → comp{n}-adj-property-rights ×40; salesCompCalculations.ts transAdj). Same token, DIFFERENT
// concept — these files must NOT be re-pointed or the 40-field comp-adjustment grid silently breaks.
const FILE_EXCLUDE = {
  'property-rights': ['fieldGenerators.ts', 'salesCompCalculations.ts'],
};
// MIXED files: rename ONLY the field READ `getFieldString('OLD')` (reads the renamed field);
// LEAVE the `values['OLD']` output/calc keys untouched (per QA L364-366 by-line guidance).
const READ_SCOPE = {
  'CalculatorWithPreview.tsx': ['property-rights', 'value-scenario'],
};
const SOURCE_ROOTS = ['src', 'public', 'api'];   // GENERATED-*.json are NOT edited here — regenerated below
const EXTS = ['.ts', '.tsx', '.html'];

function listFiles() {
  const out = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const fp = path.join(d, e.name);
      if (EXCLUDE.some((x) => fp.includes(x))) continue;
      if (e.isDirectory()) walk(fp);
      else if (EXTS.some((x) => fp.endsWith(x))) out.push(fp);
    }
  };
  for (const r of SOURCE_ROOTS) if (fs.existsSync(r)) walk(r);
  return out;
}

// Exact token forms — never bare substring (excludes comp1-*, value-scenario1, etc.)
function tokenRegexes(id) {
  const e = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return [
    new RegExp(`"${e}"`, 'g'),
    new RegExp(`'${e}'`, 'g'),
    new RegExp('`' + e + '`', 'g'),
    new RegExp(`"${e}":`, 'g'),     // testdata key (subset of "id" but kept explicit)
    new RegExp(`\\{\\{${e}\\}\\}`, 'g'), // template placeholder
  ];
}

// Rename one id in one file, honoring per-id excludes + read-scoped (mixed) files.
function renameInFile(txt, fp, oldId, newId) {
  if ((FILE_EXCLUDE[oldId] || []).some((x) => fp.includes(x))) return txt; // category-key file — leave it
  const scoped = Object.entries(READ_SCOPE).find(([f]) => fp.includes(f));
  if (scoped && scoped[1].includes(oldId)) {
    // scoped: ONLY the field read, leave values['OLD'] keys
    return txt.split(`getFieldString('${oldId}')`).join(`getFieldString('${newId}')`);
  }
  const sentinel = `@@R_${oldId.replace(/[^a-z]/g, '_')}@@`;
  let out = txt;
  for (const re of tokenRegexes(oldId)) out = out.replace(re, (m) => m.replace(oldId, sentinel));
  return out.split(sentinel).join(newId);
}

// Block delete: a flat field-def object { ... id: "X" [... section: "Y"] ... }, ending with "},"
function removeDefBlock(txt, { id, section }) {
  const idE = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // flat object (no nested braces inside a field def)
  const re = new RegExp(`\\n\\s*\\{[^{}]*id:\\s*"${idE}"[^{}]*\\},`, 'g');
  let removed = 0;
  const result = txt.replace(re, (block) => {
    if (section && !new RegExp(`section:\\s*"${section}"`).test(block)) return block; // keep non-matching-section def
    removed++;
    return '';
  });
  return { result, removed };
}

const FILES = listFiles();
const report = [];
let writes = 0;

// ---- PHASE 1: clean renames (sentinel two-phase) ----
for (const [oldId, newId] of RENAMES) {
  let touched = 0;
  for (const fp of FILES) {
    const before = fs.readFileSync(fp, 'utf8');
    const after = renameInFile(before, fp, oldId, newId);
    if (after !== before) { touched++; if (APPLY) { fs.writeFileSync(fp, after); writes++; } }
  }
  report.push(`  rename ${oldId} → ${newId}: ${touched} file(s)`);
}

// ---- PHASE 2: consolidations (block-delete def + re-point occurrences) ----
const FR = 'src/features/report-builder/schema/fieldRegistry.ts';
for (const c of CONSOLIDATIONS) {
  // 2a. remove the redundant/twin def block from fieldRegistry
  let fr = fs.readFileSync(FR, 'utf8');
  const { result, removed } = removeDefBlock(fr, c.removeDef);
  if (APPLY && removed) fs.writeFileSync(FR, result);
  // 2b. re-point ALL remaining occurrences of `from` → `into` (sentinel), every surface
  let touched = 0;
  for (const fp of FILES) {
    const before = fs.readFileSync(fp, 'utf8');
    const after = renameInFile(before, fp, c.from, c.into);
    if (after !== before) { touched++; if (APPLY) { fs.writeFileSync(fp, after); writes++; } }
  }
  report.push(`  consolidate ${c.from} → ${c.into}: removed ${removed} def block(s), re-pointed ${touched} file(s)`);
}

// ---- regenerate drift-gate derivatives from the master (only on apply) ----
if (APPLY) {
  console.log('\nRegenerating drift-gate derivatives from master…');
  try {
    execSync('node scripts/generate-registry-derivatives.mjs', { stdio: 'inherit' });
    execSync('node scripts/gen-v3-actual-manifest.mjs', { stdio: 'inherit' });
  } catch (e) { console.error('⚠ derivative regen failed — fix before trusting drift-gate', e.message); }
}

// ---- ASSERTS ----
function defCount(id) {
  const fr = fs.readFileSync(FR, 'utf8');
  return (fr.match(new RegExp(`id:\\s*"${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g')) || []).length;
}
console.log(`\n=== Slice-4b rename ${APPLY ? 'APPLIED' : 'DRY-RUN (no writes)'} ===`);
report.forEach((r) => console.log(r));
console.log('\n=== DEF-COUNT ASSERTS ===');
let ok = true;
for (const [oldId, newId] of RENAMES) {
  const o = defCount(oldId), n = defCount(newId);
  const pass = APPLY ? (o === 0 && n >= 1) : true;
  if (!pass) ok = false;
  console.log(`  ${oldId}=${o} (want 0)  ${newId}=${n} (want ≥1)  ${APPLY ? (pass ? '✓' : '✗') : '(dry-run)'}`);
}
for (const c of CONSOLIDATIONS) {
  const f = defCount(c.from), t = defCount(c.into);
  const pass = APPLY ? (f === 0 && t === c.expectFinal) : true;
  if (!pass) ok = false;
  console.log(`  ${c.from}=${f} (want 0)  ${c.into}=${t} (want ${c.expectFinal})  ${APPLY ? (pass ? '✓' : '✗') : '(dry-run)'}`);
}
if (!APPLY) console.log('\nDRY-RUN complete. Re-run with --apply ONLY after QA passes. Then: npm run build + render-verify each field fills.');
else { console.log(`\nApplied ${writes} file writes. ${ok ? 'ALL ASSERTS PASS ✓' : 'ASSERT FAILURE ✗ — investigate before build/deploy'}`); if (!ok) process.exit(1); }
