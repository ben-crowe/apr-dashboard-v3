#!/usr/bin/env node
// One-shot: emit the Slice-4b SEED (fields absent from V4) from the canonical registry derivative.
import { readFileSync, writeFileSync } from 'node:fs';
const reg = JSON.parse(readFileSync('docs/Features/08-Master-Field-Registry/GENERATED-field-mapping.json', 'utf8')).fields;
const byName = Object.fromEntries(reg.map(f => [f.name, f]));
// CORRECTED 2026-06-17 (QA caught + co-arch code-verified): ValueScenarios / ApproachestoValue /
// Valuetimeframe were NOT 0-hit — they EXIST in V4 as value-scenario / approaches-applied / timeframe
// (Slice-3 bridge already feeds them); my original grep matched PascalCase + missed the kebab ids
// (the v3key-spike lesson, in my own seed). Removed → they move to the class-1/2 alias capture instead.
// Net = 13 DIRECT adds, none cascade-derived.
const class3 = ['StatusofImprovements','StateofImprovements','AssignmentType','TransactionStatus','ZoningStatus','CMHCFinancing','LandMetric','DesktopReport','ClientDocuments','CurrentUseImprovements','ProposedUseImprovements','PreviouslyAppraised','DeliveryTime'];
// These are user/logic INPUT fields, not cascade-derived outputs (StateofImprovements + ClientDocuments
// are plain Selects with no derivation logic — registry 'source: Logic' is loose labeling, treat as DIRECT).
const FORCE_DIRECT = new Set(['StateofImprovements','ClientDocuments']);
const L = [];
L.push('---');
L.push('title: "Slice-4b SEED — Fields absent from V4 (must ADD to fieldRegistry)"');
L.push('status: seed-spec (branched from Slice-4 Phase-1 capture)');
L.push('created: 2026-06-17');
L.push('owner: "ui-designer (registry) + co-architect (spec) + react (build) + qa (4-file-sync verify)"');
L.push('source: Slice-4 Phase-1 reconcile — Chris VALTA-FIELD-SPEC vs V4 fieldRegistry.ts (0-hit confirmed)');
L.push('tags: [apr, v4, slice-4b, field-registry, missing-fields, cascade-bridge, four-file-sync]');
L.push('---');
L.push('');
L.push('# Slice-4b SEED — Chris-registry / V3-Section-2 fields ABSENT from V4');
L.push('');
L.push('> Slice-4 Phase-1 reconcile confirmed these are **0-hit in `src/features/report-builder/schema/fieldRegistry.ts`** — not renamed, not misplaced, genuinely missing. This is WHY the section-10 valuation cascade never bridged to the report builder (Slice-3 finding): V4 had no fields to land them in. Closing this list also closes the cascade-bridge gap — same work.');
L.push('');
L.push('**Per-field ADD work (mandated 4-file sync + verify):** (1) `fieldRegistry.ts` entry (section-home = **loe-prep / S2**), (2) `Report-MF-template.html` `{{placeholder}}`, (3) `TestDataSet1` value, (4) EditPanel control → then render-verify.');
L.push('');
L.push('| Field | Label | Control | Source | Dropdown | Valcre (routesTo) | Derived? |');
L.push('|---|---|---|---|---|---|---|');
for (const n of class3) {
  const f = byName[n];
  if (!f) { L.push(`| \`${n}\` | (NOT IN REGISTRY — verify) | | | | | |`); continue; }
  const deriv = (f.source === 'Logic' && !FORCE_DIRECT.has(n)) ? 'Logic/derived' : 'direct';
  L.push(`| \`${n}\` | ${f.label} | ${f.control} | ${f.source} | ${f.dropdownList || '—'} | ${f.routesTo || '—'} | ${deriv} |`);
}
L.push('');
L.push('## Notes');
L.push('- **Cascade cluster** (StatusofImprovements → ValueScenarios → ApproachestoValue, + StateofImprovements) carries the section-10 logic — adding these + wiring `loeCascade.ts` output into the builder IS the cascade-bridge close.');
L.push('- **StateofImprovements** is also the S3→S2 move (Slice-4); here it additionally needs a net-new V4 field.');
L.push('- All section-home = **S2 (loe-prep)** per the pre-acceptance rule.');
L.push('- Attributes pulled from the canonical registry; QA reconciles each new fieldRegistry entry vs Chris VALTA-FIELD-SPEC + the 4-file sync.');
writeFileSync('docs/Architecture/SEED-V4b-add-missing-fields.md', L.join('\n') + '\n');
console.log(`wrote docs/Architecture/SEED-V4b-add-missing-fields.md (${class3.length} fields)`);
