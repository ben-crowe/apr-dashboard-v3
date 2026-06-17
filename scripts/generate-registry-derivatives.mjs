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

// Pull a `const NAME = { ... };` object literal out of the HTML and evaluate it.
function extractObject(html, name) {
  const start = html.indexOf(`const ${name} = {`);
  if (start < 0) throw new Error(`${name} not found in HTML`);
  const open = html.indexOf('{', start);
  const end = html.indexOf('\n};', open);
  if (end < 0) throw new Error(`${name} object end not found`);
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${html.slice(open, end + 2)});`)();
}

const html = readFileSync(HTML, 'utf8');
const FIELDS = extractArray(html, 'FIELDS');
const SCN = extractArray(html, 'SCN_LIB');
const DROPDOWN_OPTIONS = extractObject(html, 'DROPDOWN_OPTIONS'); // master option-sets (ordered), registry-sourced

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
    // V3->V4 bridge-flow (folded from V3-to-V4-field-map.json 2026-06-16):
    // status = does the V3 value actually reach the report builder via useLoadJobIntoReport.ts
    //          (BRIDGE-FLOW, not registry-presence) — maps-clean | mismatched-stale | missing-in-v4
    // reportTarget = report-side destination (Valcre CF/native or report TEMPLATE {{placeholder}})
    bridgeStatus: f.st || null, reportTarget: f.rt || null, bridgeNote: f.bn || '',
    // V3↔V4 alias capture (Slice-4 Phase 1): v3key = V3 form-state key (nested in S1, flat in S2),
    // v4id = V4 fieldRegistry id, sectionHome = S1/S2/S3 the field lives in. null until captured.
    v3key: f.v3 || null, v4id: f.v4 || null, sectionHome: f.sh || null,
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

## Field → Valcre mapping + V3→V4 bridge flow

> **Bridge** column = does the V3 value actually reach the report builder (BRIDGE-FLOW via \`useLoadJobIntoReport.ts\`), NOT registry-presence. \`maps-clean\` reaches it; \`mismatched-stale\` reaches it lossy; \`missing-in-v4\` never bridges. **Report Target** = the report-side destination (Valcre CF/native, or report TEMPLATE \`{{placeholder}}\`). Folded from \`V3-to-V4-field-map.json\` (co-arch, 2026-06-16).

| Field | Label | Control | Source | Routes To | Entity | Req | Bridge | Report Target | Notes |
|---|---|---|---|---|---|---|---|---|---|
`;
for (const f of FIELDS) {
  md += `| \`${esc(f.n)}\` | ${esc(f.l)} | ${esc(f.c)} | ${esc(f.s)} | ${esc(f.v || '—')} | ${esc(f.vr || '—')} | ${esc(f.req)} | ${esc(f.st || '—')} | ${esc(f.rt || '—')} | ${esc(f.desc)} |\n`;
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

// ─────────────────────────────────────────────────────────────────────────────
// Phase-2 EMIT TARGETS (Slice-4) — two derivatives off the one master, for S1/S2:
//   1. V4 form config   — keyed by v4id; the schema-driven V4 S1/S2 consumes/checks against this.
//   2. V3 drift-check   — keyed by v3key; compares V3's actual fields vs the master VIA THE ALIAS MAP
//      (never v3key==v4id — renames are common). FAIL-CLOSED on any field whose v3key is a sentinel
//      (GAP-no-V3-input / PENDING) — flagged uncheckable, never silent-passed.
// Only fields with a captured alias (v3 or v4 present) participate — the class-1/2 set.
// ─────────────────────────────────────────────────────────────────────────────
const SENTINELS = ['GAP-no-V3-input', 'PENDING-CAPTURE', 'PENDING'];
const aliased = FIELDS.filter(f => f.v3 || f.v4);

// KNOWN-GAPS (Slice-4 option-drift triage 2026-06-17, QA-narrowed): approved-PENDING divergences the gate
// must treat as DRIFT-DEBT (flag-as-known, counted, NOT block / NOT new-drift), each with resolve-by + ref.
// The gate: divergence ⊆ knownGap.allowed → drift-debt; anything beyond → real drift (block).
const KNOWN_GAPS = {
  PropertyType:  { allowed: ['Seniors', 'Other'], reason: 'registry-only values absent from V3; keep-or-drop', resolveBy: 'Chris-thread', ref: 'SLICE4-option-drift-triage-2026-06-17 #3' },
  AuthorizedUse: { allowed: ['First Mortgage Financing', 'Insurance', 'GST', 'Financing', 'Consulting', 'Dispute Resolution', 'Divorce', 'Establish Sales Price', 'Other'], reason: 'residual taxonomy divergence registry↔V3, materially different lists', resolveBy: 'Chris-thread', ref: 'SLICE4-option-drift-triage-2026-06-17 #4' },
  // PropertySubtype = genuine Chris-Q (lean vs full subtypes) — stays known-gap per co-arch triage 2026-06-17.
  PropertySubtype: { allowed: ['Low-Rise', 'Mid-Rise', 'High-Rise', 'Garden', 'Walk-Up', 'Apartment'], reason: 'GRANULAR-vs-GENERIC taxonomy gap (QA-confirmed real): V3 has granular subtypes (Low-Rise/Mid-Rise/etc), master/client lean (Apartment) — needs Chris lean-vs-full call. Mixed-Use hyphen-variant now ALIGNED (no longer gapped).', resolveBy: 'Chris-thread', ref: 'SLICE4-extraction-completion-2026-06-17' },
  // Tenancy "Unkown" → FIXED at source (typo corrected to "Unknown" in form + test-gen), NOT a known-gap.
  // InterestAppraised "Fee Simple & Leased Fee" → master ALIGNED (added to ListInterestAppraised), NOT a known-gap.
};

// 1. V4 form config (the V4 S1/S2 build/check target)
const v4config = {
  _meta: { source: 'public/field-registry-v6.html (canonical)', purpose: 'V4 S1/S2 form config — generate/check the schema-driven builder against this', generated_by: 'scripts/generate-registry-derivatives.mjs' },
  fields: aliased.filter(f => f.v4).map(f => ({
    v4id: f.v4, masterName: f.n, label: f.l, control: f.c,
    dropdownList: f.d || null, required: f.req === 'Yes', sectionHome: f.sh || null,
  })),
};
writeFileSync(join(OUT_DIR, 'GENERATED-v4-form-config.json'), JSON.stringify(v4config, null, 2) + '\n');

// 2. V3 drift-check (compare V3 actual vs master via alias map; fail-closed on sentinels)
const checks = aliased.map(f => {
  const uncheckable = !f.v3 || SENTINELS.includes(f.v3);
  return {
    masterName: f.n, v3key: f.v3 || null, v4id: f.v4 || null, sectionHome: f.sh || null,
    checkable: !uncheckable,
    // FAIL-CLOSED contract: uncheckable rows MUST be flagged by the consumer, never passed.
    failClosed: uncheckable ? `flag — uncheckable (${f.v3 || 'no v3key'})` : null,
    // rename = checkable field whose v3key differs from v4id. Fail-closed/gap rows (uncheckable) are
    // NOT renames — they're Class-4 gaps; counting them as renames corrupts the gate's coverage count.
    rename: !uncheckable && !!(f.v3 && f.v4 && f.v3.toLowerCase().replace(/-/g, '') !== f.v4.toLowerCase().replace(/-/g, '')),
    // ⚑ ACTIVATION-CRITICAL (anti-circular): the MASTER expectations, sourced from the REGISTRY only
    // (DROPDOWN_OPTIONS + req), NEVER from V3-actual. The CI gate reads THESE as the expected truth and
    // diffs the manifest's V3-ACTUAL against them. Without this the gate would compare V3 to a master
    // echoed from V3 = circular false-pass. options array carries the option-SET and the ORDER.
    masterExpectations: {
      required: f.req === 'Yes',
      dropdownList: f.d || null,
      options: (f.d && DROPDOWN_OPTIONS[f.d]) ? DROPDOWN_OPTIONS[f.d] : null,
      optionCount: (f.d && DROPDOWN_OPTIONS[f.d]) ? DROPDOWN_OPTIONS[f.d].length : null,
    },
    // approved drift-debt allowance (gate flags-as-known, never blocks; not new drift). null = none.
    knownGap: KNOWN_GAPS[f.n] || null,
  };
});
const driftCheck = {
  _meta: { source: 'public/field-registry-v6.html (canonical)', purpose: 'V3 drift-check — compare V3 actual fields vs master via the alias map (NEVER v3key==v4id); fail-closed on sentinels', generated_by: 'scripts/generate-registry-derivatives.mjs',
    rule: 'Match V3 field by v3key; verify it still aligns to masterName/v4id. Any checkable:false row = FLAG (do not silent-pass).',
    antiCircular: 'The GATE must compare the manifest V3-ACTUAL against THIS file’s per-field masterExpectations (registry-sourced: options/order/required). NEVER derive master from V3-actual — that is the circular false-pass. The manifest supplies V3-ACTUAL ONLY.' },
  counts: { total: checks.length, checkable: checks.filter(c => c.checkable).length, failClosed: checks.filter(c => !c.checkable).length, renames: checks.filter(c => c.rename).length, knownGaps: checks.filter(c => c.knownGap).length },
  checks,
};
writeFileSync(join(OUT_DIR, 'GENERATED-v3-drift-check.json'), JSON.stringify(driftCheck, null, 2) + '\n');

console.log(`✓ Phase-2 emit: V4 config (${v4config.fields.length} fields) + V3 drift-check (${driftCheck.counts.checkable} checkable / ${driftCheck.counts.failClosed} fail-closed / ${driftCheck.counts.renames} renames)`);
console.log(`  → GENERATED-v4-form-config.json`);
console.log(`  → GENERATED-v3-drift-check.json`);
