#!/usr/bin/env node
/**
 * V3-ACTUAL manifest generator (Slice-4 Phase-3 precursor).
 * Lifts the inline <SelectItem> dropdowns out of the V3 form JSX into a structured manifest:
 *   { v3key: { present, options[], optionCount, required, readable, sourceFile } }
 * This is the V3-ACTUAL side the CI drift-gate diffs against the registry-sourced masterExpectations
 * (in GENERATED-v3-drift-check.json). Manifest = V3-ACTUAL ONLY; master comes from the config. Non-circular.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'docs/Features/08-Master-Field-Registry/GENERATED-v3-actual-manifest.json');
const JD = 'src/components/dashboard/job-details';
const FILES = [
  `${JD}/LoeQuoteSection.tsx`, `${JD}/ClientSubmissionSection.tsx`, `${JD}/OrganizingDocsSection.tsx`, `${JD}/PropertyInfoSection.tsx`,
  `${JD}/loe-quote/ValuationSection.tsx`, `${JD}/loe-quote/PropertyRightsSection.tsx`, `${JD}/loe-quote/PaymentSection.tsx`,
  `${JD}/client-submission/ClientInformationSection.tsx`, `${JD}/client-submission/PropertyInformationSection.tsx`,
];

const manifest = {};
for (const rel of FILES) {
  const abs = join(ROOT, rel);
  if (!existsSync(abs)) continue;
  const src = readFileSync(abs, 'utf8');
  const file = basename(rel);
  // Segment by each <Select opening; each segment = one dropdown.
  const segs = src.split(/<Select\b/).slice(1);
  for (const seg of segs) {
    const chunk = seg.split(/<\/Select>/)[0]; // up to this Select's close
    // field key: prefer handleSelectChange(value,'KEY'); fall back to value={jobDetails.KEY} / job.KEY
    const k = chunk.match(/handleSelectChange\([^,]*,\s*['"]([a-zA-Z]+)['"]\)/)
           || chunk.match(/value=\{(?:jobDetails|job)\??\.([a-zA-Z]+)/)            // \?? — optional chaining jobDetails?.X (CompactField Selects)
           || chunk.match(/onUpdateDetails\?\.\(\{\s*([a-zA-Z]+):/);                // onUpdateDetails?.({ X: v }) pattern
    if (!k) continue;
    const key = k[1];
    const options = [...chunk.matchAll(/<SelectItem\s+value=["']([^"']*)["']/g)].map(m => m[1]).filter(v => v && v !== '__clear__'); // drop empty + UI clear-sentinel
    if (!options.length) continue;
    // required: V3 forms rarely mark it; capture if a `required` attr or `*` label is near. else null=unknown.
    const required = /\brequired\b/.test(chunk.slice(0, 200)) ? true : null;
    manifest[key] = { present: true, options, optionCount: options.length, required, readable: key, sourceFile: file };
  }
}

// ── Cascade-cluster fields: their V3-ACTUAL option sets live in the cascade LOGIC (loeCascade.ts),
// not inline <SelectItem>. statusOfImprovements = the trigger (STATUS_TO_SCENARIOS keys); valueScenarios
// = the full derivable set (ALL_SCENARIOS); approachesToValue = union of STATUS_TO_APPROACHES values.
// This is still V3-ACTUAL (the live V3 cascade logic), independent of the registry master. ──
const casc = join(ROOT, 'src/utils/loe/loeCascade.ts');
if (existsSync(casc)) {
  const c = readFileSync(casc, 'utf8');
  const block = (name) => {
    const s = c.indexOf(name); if (s < 0) return '';
    const o = c.indexOf('{', s); const e = c.indexOf('\n};', o);
    return e > o ? c.slice(o, e) : '';
  };
  const statusKeys = [...new Set([...block('STATUS_TO_SCENARIOS').matchAll(/^\s*'([^']+)':/gm)].map(m => m[1]))];
  const apprBlock = block('STATUS_TO_APPROACHES');
  const apprVals = [...new Set([...apprBlock.matchAll(/'([^']+)'/g)].map(m => m[1]).filter(v => !statusKeys.includes(v)))];
  // valueScenarios = ALL_SCENARIOS = NARRATIVES scenario names ∪ PENDING_SCENARIOS (spread, no literals to grep).
  // NARRATIVES is an ARRAY (not object) and the FIRST 'NARRATIVES' hit is a comment — anchor on the const decl.
  const narrStart = c.indexOf('NARRATIVES: Narrative');
  const narrBlock = narrStart >= 0 ? c.slice(c.indexOf('[', narrStart), c.indexOf('\n];', narrStart)) : '';
  const narrScn = [...narrBlock.matchAll(/scenario:\s*["']([^"']+)["']/g)].map(m => m[1]);
  const pendStart = c.indexOf('PENDING_SCENARIOS');
  const pendScn = pendStart >= 0 ? [...c.slice(c.indexOf('[', pendStart), c.indexOf('];', pendStart)).matchAll(/'([^']+)'/g)].map(m => m[1]) : [];
  const allScn = [...new Set([...narrScn, ...pendScn])];
  const addCascade = (key, options) => {
    if (options.length) manifest[key] = { present: true, options, optionCount: options.length, required: true, readable: key, sourceFile: 'loeCascade.ts (cascade logic)', derived: key !== 'statusOfImprovements' };
  };
  addCascade('statusOfImprovements', statusKeys);     // trigger options
  addCascade('valueScenarios', allScn);               // full derivable set
  addCascade('approachesToValue', apprVals);          // approach set
  // InterestAppraised (v3key propertyRightsAppraised) is DERIVED — V3-actual option domain = UNION of all 3 rights maps
  // (PT_TO_RIGHTS ∪ SUB_TO_RIGHTS ∪ TN_TO_RIGHTS), the full set derivePropertyRights can output.
  const rightsVals = [...new Set(['PT_TO_RIGHTS', 'SUB_TO_RIGHTS', 'TN_TO_RIGHTS'].flatMap(nm => [...block(nm).matchAll(/:\s*'([^']+)'/g)].map(m => m[1])))];
  addCascade('propertyRightsAppraised', rightsVals);
}

// ── Completeness pass: every CHECKABLE field must appear in the manifest. Text/number/date inputs have
// no option-set to lift — record them as present-with-no-options (drift-check compares present+required only).
// Presence = the v3key appears anywhere in the concatenated V3 form sources. Residual-absent = FAIL-CLOSED. ──
const allFormSrc = FILES.map(r => existsSync(join(ROOT, r)) ? readFileSync(join(ROOT, r), 'utf8') : '').join('\n');
const driftPath = join(ROOT, 'docs/Features/08-Master-Field-Registry/GENERATED-v3-drift-check.json');
if (existsSync(driftPath)) {
  const checkable = JSON.parse(readFileSync(driftPath, 'utf8')).checks.filter(c => c.checkable && c.v3key);
  for (const c of checkable) {
    const masterHasOptions = !!(c.masterExpectations && c.masterExpectations.options); // is it a dropdown?
    const e = manifest[c.v3key];
    if (e) {
      // ⚑ QA nit: a DROPDOWN (master has options) we couldn't lift options for = UNREADABLE → readable:false
      // (gate blocks it as "unreadable, fail-closed", not mislabeled options-drift). Real extraction preferred; this is the backstop.
      if (masterHasOptions && !e.options) { e.readable = false; e.note = 'dropdown but options not extractable — fail-closed unreadable'; }
      else if (e.readable === undefined) e.readable = true;
      continue;
    }
    const present = new RegExp(`\\b${c.v3key}\\b`).test(allFormSrc);
    manifest[c.v3key] = {
      present, options: null, optionCount: null, required: null,
      // text/number/date (no master options) = readable present-no-options. Dropdown w/ no options or absent = readable:false (fail-closed).
      readable: present && !masterHasOptions,
      sourceFile: !present ? 'NOT FOUND in V3 forms (fail-closed)' : masterHasOptions ? 'present but options NOT extracted — fail-closed unreadable' : 'V3 form (text/number/date — no option-set)',
    };
  }
}

const out = {
  _meta: {
    purpose: 'V3-ACTUAL manifest — the live V3 form reality (present/options/order/required) lifted from inline <SelectItem> JSX.',
    contract: 'This is V3-ACTUAL ONLY. The CI gate diffs THIS against GENERATED-v3-drift-check.json masterExpectations (registry-sourced). NEVER use this as the master — that is the circular trap.',
    generated_by: 'scripts/gen-v3-actual-manifest.mjs',
  },
  fieldCount: Object.keys(manifest).length,
  fields: manifest,
};
writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(`✓ V3-ACTUAL manifest: ${out.fieldCount} dropdown fields lifted → GENERATED-v3-actual-manifest.json`);
console.log('  keys:', Object.keys(manifest).join(', '));
