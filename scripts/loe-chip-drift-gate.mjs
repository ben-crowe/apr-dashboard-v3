#!/usr/bin/env node
/**
 * Item 8 — "in LOE" chip drift gate (build-BLOCKING).
 *
 * The chip that marks contract-bound job-page fields is DERIVED from the jobField metadata on
 * mapJobToDocuSealFields (docuseal.ts). This gate proves, at BUILD TIME, that the fields the UI
 * actually chips === the fields the mapping declares contract-bound. If someone adds a field to the
 * mapping and forgets its chip (or removes a field but leaves a stale chip), the two sets diverge and
 * this script exits non-zero, failing `npm run build`. That is what makes "the chip follows the
 * mapping" a real guarantee rather than a vitest test nobody runs.
 *
 * FAIL-CLOSED: an unreadable file, a source set that parses to zero entries, or ANY mismatch → exit 1.
 * Never reports "no drift" from a failed/empty run.
 *
 * The two sets:
 *  - DERIVED (mapping truth): every jobField / jobFields literal on the entries returned by
 *    mapJobToDocuSealFields in src/utils/webhooks/docuseal.ts.
 *  - CHIP (what the UI renders): every loeField="..." literal on a CompactField, plus every
 *    <ContractBoundChip field="..." /> literal, across src/components/dashboard/job-details/**.tsx.
 *    (CompactField renders <ContractBoundChip field={loeField} /> — a variable, not a literal — so
 *    only the loeField props and the one direct notes chip are literals to collect.)
 *
 * Usage: node scripts/loe-chip-drift-gate.mjs [--json]
 * Exit:  0 = sets match; 1 = drift / fail-closed.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const asJson = process.argv.includes('--json');

const DOCUSEAL = 'src/utils/webhooks/docuseal.ts';
const CHIP_DIR = 'src/components/dashboard/job-details';

function die(msg, extra = {}) {
  if (asJson) console.log(JSON.stringify({ ok: false, error: msg, ...extra }, null, 2));
  else {
    console.error(`\n✗ LOE chip drift gate FAILED: ${msg}`);
    for (const [k, v] of Object.entries(extra)) {
      console.error(`  ${k}: ${Array.isArray(v) ? v.join(', ') || '(none)' : v}`);
    }
    console.error('');
  }
  process.exit(1);
}

function read(path) {
  if (!existsSync(path)) die(`missing file: ${path}`);
  try {
    return readFileSync(path, 'utf8');
  } catch (e) {
    die(`unreadable file: ${path} (${e.message})`);
  }
}

// --- DERIVED set: jobField / jobFields literals in the mapping ---------------------------------
function deriveMappingSet() {
  const src = read(DOCUSEAL);
  const set = new Set();
  // jobField: "someKey"
  for (const m of src.matchAll(/\bjobField:\s*["']([^"']+)["']/g)) set.add(m[1]);
  // jobFields: ["a", "b"]
  for (const m of src.matchAll(/\bjobFields:\s*\[([^\]]+)\]/g)) {
    for (const q of m[1].matchAll(/["']([^"']+)["']/g)) set.add(q[1]);
  }
  return set;
}

// --- CHIP set: loeField="..." + <ContractBoundChip field="..."> literals across the UI ----------
function collectTsx(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) collectTsx(p, acc);
    else if (entry.name.endsWith('.tsx')) acc.push(p);
  }
  return acc;
}

function deriveChipSet() {
  if (!existsSync(CHIP_DIR)) die(`missing dir: ${CHIP_DIR}`);
  const set = new Set();
  for (const file of collectTsx(CHIP_DIR)) {
    const src = read(file);
    for (const m of src.matchAll(/\bloeField=["']([^"']+)["']/g)) set.add(m[1]);
    for (const m of src.matchAll(/<ContractBoundChip\b[^>]*\bfield=["']([^"']+)["']/g)) set.add(m[1]);
  }
  return set;
}

const derived = deriveMappingSet();
const chips = deriveChipSet();

if (derived.size === 0) die('derived mapping set is EMPTY — parse failed or the mapping lost its jobField metadata');
if (chips.size === 0) die('chip set is EMPTY — parse failed or every loeField/chip was removed');

const missingChips = [...derived].filter((f) => !chips.has(f)).sort(); // in mapping, no chip on page
const staleChips = [...chips].filter((f) => !derived.has(f)).sort(); // chip on page, not in mapping

if (missingChips.length || staleChips.length) {
  die('chip set does not match the derived contract-bound mapping set', {
    'contract fields with NO chip (add the chip or the mapping is wrong)': missingChips,
    'chips with NO backing mapping entry (remove the chip or add the mapping)': staleChips,
    'derived (mapping)': [...derived].sort(),
    'chips (ui)': [...chips].sort(),
  });
}

if (asJson) console.log(JSON.stringify({ ok: true, count: derived.size, fields: [...derived].sort() }, null, 2));
else console.log(`✓ LOE chip drift gate: ${derived.size} contract-bound fields — chip set matches the mapping.`);
process.exit(0);
