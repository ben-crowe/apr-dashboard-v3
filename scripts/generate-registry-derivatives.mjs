#!/usr/bin/env node
/**
 * Registry derivative generator — HTML registry → markdown + JSON.
 *
 * The HTML field registry (public/field-registry-v6.html) is the canonical, human-facing source
 * (Ben's call, 2026-06-16). Agents + code consume a clean GENERATED derivative so nobody parses HTML
 * and nothing drifts: this reads the FIELDS (field→Valcre mapping) and SCN_LIB (§10 scenarios) arrays
 * straight out of the HTML and writes:
 *   - GENERATED-field-mapping.md   (human-readable table, "do not hand-edit — regenerate")
 *   - GENERATED-field-mapping.json (machine-consumable; scenario derivedFrom carries FULL status keys)
 *
 * QA certifies BOTH the HTML and this derivative against api/valcre.ts (runtime truth).
 *
 * Run:  node scripts/generate-registry-derivatives.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const HTML = join(ROOT, 'public/field-registry-v6.html');
const OUT_DIR = join(ROOT, 'docs/Features/08-Master-Field-Registry');

// Shorthand (human view) → full canonical Status of Improvements key (exact STATUS_TO_SCENARIOS match).
const STATUS_FULL = {
  'Completed': 'Improved - Completed',
  'Renovated': 'Improved - Renovated',
  'Under Renovation': 'Improved - Under Renovation',
  'Proposed Renovation': 'Improved - Proposed Renovation',
  'Vacant Land': 'Proposed - Vacant Land',
  'Improved Land (Demo)': 'Proposed - Improved Land (Demolition Required)',
  'Improved Land (Demo Req)': 'Proposed - Improved Land (Demolition Required)',
  'Under Construction': 'Proposed - Under Construction',
};

// Pull a `const NAME = [ ... ];` array literal out of the HTML and evaluate it in a bare sandbox.
function extractArray(html, name) {
  const start = html.indexOf(`const ${name} = [`);
  if (start < 0) throw new Error(`${name} not found in HTML`);
  const open = html.indexOf('[', start);
  const end = html.indexOf('\n];', open);
  if (end < 0) throw new Error(`${name} array end not found`);
  const literal = html.slice(open, end + 2); // include the closing ]
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${literal});`)();
}

const html = readFileSync(HTML, 'utf8');
const FIELDS = extractArray(html, 'FIELDS');
const SCN = extractArray(html, 'SCN_LIB');

// ---------- JSON (machine-consumable) ----------
const json = {
  _meta: {
    source: 'public/field-registry-v6.html (canonical HTML registry)',
    runtime_truth: 'api/valcre.ts',
    generated_by: 'scripts/generate-registry-derivatives.mjs',
    note: 'GENERATED — do not hand-edit. Edit the HTML registry then regenerate.',
  },
  fields: FIELDS.map(f => ({
    name: f.n, label: f.l, control: f.c, source: f.s, dropdownList: f.d || null,
    routesTo: f.v || null, entity: f.vr || null, notForm: f.nf === 'Yes',
    required: f.req === 'Yes', notes: f.desc || '',
  })),
  scenarios: SCN.map(s => ({
    scenario: s.n, summary: s.sum || null, hasText: !s.pending,
    pending: !!s.pending, eaDetail: !!s.ea, hcDetail: !!s.hc,
    // FULL status keys for exact STATUS_TO_SCENARIOS match (QA note); passthrough for override/option-set labels.
    derivedFrom: (s.from || []).map(x => STATUS_FULL[x] || x),
    derivedFromDisplay: s.from || [],
    valcreCustomField: 'CF12414', valcreOptionId: s.oid,
  })),
};
writeFileSync(join(OUT_DIR, 'GENERATED-field-mapping.json'), JSON.stringify(json, null, 2) + '\n');

// ---------- Markdown (human-readable) ----------
const esc = v => String(v ?? '').replace(/\|/g, '\\|');
let md = `<!-- GENERATED from public/field-registry-v6.html by scripts/generate-registry-derivatives.mjs.
     DO NOT hand-edit — edit the HTML registry, then regenerate. Runtime truth = api/valcre.ts. -->

# APR Field Mapping — Generated Derivative

> Generated from the canonical **HTML field registry**. Edit there, not here. QA certifies against \`api/valcre.ts\`.

## Field → Valcre mapping

| Field | Label | Control | Source | Routes To | Entity | Req | Notes |
|---|---|---|---|---|---|---|---|
`;
for (const f of FIELDS) {
  md += `| \`${esc(f.n)}\` | ${esc(f.l)} | ${esc(f.c)} | ${esc(f.s)} | ${esc(f.v || '—')} | ${esc(f.vr || '—')} | ${esc(f.req)} | ${esc(f.desc)} |\n`;
}

md += `\n## Value Scenarios — Section 10 library

| Scenario | Section 10 Summary | EA/HC | Derived From | Valcre (CF12414) | Status |
|---|---|---|---|---|---|
`;
for (const s of SCN) {
  const eahc = ((s.ea ? 'EA' : '') + (s.ea && s.hc ? ' + ' : '') + (s.hc ? 'HC' : '')) || '—';
  const from = (s.from || []).map(x => STATUS_FULL[x] || x).join('; ');
  const sum = s.pending ? '_pending — Chris to supply_' : esc(s.sum);
  md += `| ${esc(s.n)} | ${sum} | ${eahc} | ${esc(from)} | CF12414 · ${s.oid} | ${s.pending ? 'Needs text' : 'Has text'} |\n`;
}
writeFileSync(join(OUT_DIR, 'GENERATED-field-mapping.md'), md);

console.log(`✓ Generated ${FIELDS.length} fields + ${SCN.length} scenarios`);
console.log(`  → ${join('docs/Features/08-Master-Field-Registry', 'GENERATED-field-mapping.json')}`);
console.log(`  → ${join('docs/Features/08-Master-Field-Registry', 'GENERATED-field-mapping.md')}`);
