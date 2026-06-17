#!/usr/bin/env node
/**
 * One-shot fold: merge co-arch's V3->V4 field map (bridge-flow status + reportTarget + bridgeNote)
 * into the canonical HTML registry FIELDS array, keyed by field name (n).
 *
 *  - Adds three keys to each matching FIELDS row:  st (status) · rt (reportTarget) · bn (bridgeNote)
 *  - Appends the registry-GAP rows (present in V4 bridge, absent from the intake registry).
 *
 * HTML registry is canonical; this edits it in place. Run once, then regenerate derivatives.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const HTML = join(ROOT, 'public/field-registry-v6.html');
const MAP = join(ROOT, 'docs/Features/08-Master-Field-Registry/V3-to-V4-field-map.json');

const map = JSON.parse(readFileSync(MAP, 'utf8'));
const byName = new Map(map.map(r => [r.name, r]));

// Names already in the registry FIELDS array (the 48). The remainder of the map = gap rows.
const html = readFileSync(HTML, 'utf8');
const lines = html.split('\n');

// Locate FIELDS array bounds.
let start = -1, end = -1;
for (let i = 0; i < lines.length; i++) {
  if (start < 0 && /^const FIELDS = \[/.test(lines[i])) start = i;
  else if (start >= 0 && /^\];/.test(lines[i])) { end = i; break; }
}
if (start < 0 || end < 0) throw new Error('FIELDS array bounds not found');

const seen = new Set();
let matched = 0;
for (let i = start + 1; i < end; i++) {
  const m = lines[i].match(/^\s*\{n:"([^"]+)"/);
  if (!m) continue;
  const name = m[1];
  seen.add(name);
  const row = byName.get(name);
  if (!row) { console.warn(`  ⚠ no map row for registry field: ${name}`); continue; }
  // Inject st/rt/bn just before the row's closing "}," (or "}")
  const inject = `,st:${JSON.stringify(row.status)},rt:${JSON.stringify(row.reportTarget ?? '')},bn:${JSON.stringify(row.bridgeNote ?? '')}`;
  lines[i] = lines[i].replace(/\}(,?)\s*$/, `${inject}}$1`);
  matched++;
}

// Gap rows = map entries not present in the registry. Build full FIELDS rows for them.
const gapRows = map.filter(r => !seen.has(r.name));
const gapLines = gapRows.map(r => {
  const desc = `[V4 bridge field — not on intake form] ${r.notes || ''}`.trim();
  const o = {
    n: r.name, l: r.label, c: r.control, s: r.source, d: '',
    v: r.routesTo ?? '', vr: r.entity ?? '', nf: 'Yes',
    req: r.required ? 'Yes' : 'No', desc,
    st: r.status, rt: r.reportTarget ?? '', bn: r.bridgeNote ?? '',
  };
  const body = Object.entries(o).map(([k, v]) => `${k}:${JSON.stringify(v)}`).join(',');
  return `  {${body}},`;
});

// Splice gap rows in just before the closing "];"
const merged = [
  ...lines.slice(0, end),
  '  // ── V4 bridge-only fields (carried into the report builder, absent from the intake form) ──',
  ...gapLines,
  ...lines.slice(end),
];

writeFileSync(HTML, merged.join('\n'));
console.log(`✓ Folded bridge-flow status into ${matched} registry rows + appended ${gapLines.length} gap rows`);
console.log(`  Gap rows: ${gapRows.map(r => r.name).join(', ')}`);
