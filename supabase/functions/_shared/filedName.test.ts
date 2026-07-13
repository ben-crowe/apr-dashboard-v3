// Assertions for the SharePoint filed-name rule. Run:  deno run --allow-read supabase/functions/_shared/filedName.test.ts
//
// WHY A DELIBERATELY-FAILING CONTROL. The harness ends by running one assertion that MUST fail.
// If that control does NOT fail, the harness exits non-zero and says so — because an assertion set
// that cannot fail is an assertion set that never ran, and a green from it means nothing. A pass
// here therefore proves two things: the real assertions hold, AND the harness is actually executing
// them. (The extension leak below got past a passing suite precisely because nothing tested it.)

import { filedFileName } from './filedName.ts';

const ID = '3f2b9c1a-77de-4a10-9b6e-0c1d2e3f4a5b';
const SHORT = '3f2b9c1a';
const ILLEGAL = /["*:<>?/\\|]/;

let failures = 0;
function check(label: string, got: unknown, want: unknown): boolean {
  const ok = got === want;
  if (!ok) {
    failures++;
    console.log(`✗ ${label}\n    got:  ${got}\n    want: ${want}`);
  } else {
    console.log(`✓ ${label}`);
  }
  return ok;
}

console.log('--- stem sanitation (original set) ---');
check('colon in stem stripped', filedFileName(ID, 'Site Survey: North Lot.pdf'), `Site Survey North Lot-${SHORT}.pdf`);
check('spaces + parens survive', filedFileName(ID, 'Site Survey (North Lot).pdf'), `Site Survey (North Lot)-${SHORT}.pdf`);
check('ampersand, comma, accent survive', filedFileName(ID, 'Plans & Élévations, rev2.dwg'), `Plans & Élévations, rev2-${SHORT}.dwg`);
check('multi-dot: split on LAST dot only', filedFileName(ID, 'report.final.pdf'), `report.final-${SHORT}.pdf`);
check('no dot = no extension', filedFileName(ID, 'README'), `README-${SHORT}`);
check('every forbidden char stripped from stem', filedFileName(ID, 'a"b*c<d>e?f/g\\h|i.pdf'), `abcdefghi-${SHORT}.pdf`);
check('leading ~$ rejected', filedFileName(ID, '~$budget.xlsx'), `budget-${SHORT}.xlsx`);
check('surrounding whitespace trimmed', filedFileName(ID, '   spaced   .pdf'), `spaced-${SHORT}.pdf`);
check('all-illegal stem falls back to the row id', filedFileName(ID, '///.pdf'), `${ID}.pdf`);

console.log('\n--- EXTENSION sanitation (the leak: ext is as client-controlled as the stem) ---');
check('colon after the last dot — was surviving', filedFileName(ID, 'Scan 2026.01.03: final'), `Scan 2026.01-${SHORT}.03 final`);
check('colon in a short ext — was surviving', filedFileName(ID, 'report.v2:final'), `report-${SHORT}.v2final`);
check('pipe in ext — was surviving', filedFileName(ID, 'notes.a|b'), `notes-${SHORT}.ab`);
check('trailing dot — SharePoint rejects names ending in a period', filedFileName(ID, 'survey.'), `survey-${SHORT}`);

console.log('\n--- invariants ---');
check('deterministic: same row in, same name out (retry-idempotency)',
  filedFileName(ID, 'Site Survey: North Lot.pdf') === filedFileName(ID, 'Site Survey: North Lot.pdf'), true);

const samples = [
  'Site Survey: North Lot.pdf', 'a"b*c<d>e?f/g\\h|i.pdf', '~$x.docx', '///.pdf', 'ok.pdf',
  'Scan 2026.01.03: final', 'report.v2:final', 'notes.a|b', 'survey.', 'weird.   ', '.',
];
check('NO illegal character survives into ANY output',
  samples.some((s) => ILLEGAL.test(filedFileName(ID, s))), false);
check('NO output ends in a period or whitespace',
  samples.some((s) => /[.\s]$/.test(filedFileName(ID, s))), false);

// ---- The control: this assertion MUST fail. A green harness that skips it is not green. ----
console.log('\n--- control (MUST fail — proves the assertions actually execute) ---');
const controlFailed = !check(
  'CONTROL — deliberately wrong expectation, must NOT match',
  filedFileName(ID, 'ok.pdf'),
  'this-is-deliberately-not-the-answer',
);

// The control's failure is expected, so it does not count against the real result.
const realFailures = failures - (controlFailed ? 1 : 0);

console.log('');
if (!controlFailed) {
  console.log('HARNESS BROKEN — the control assertion did not fail, so the assertions are not running.');
  Deno.exit(2);
}
if (realFailures > 0) {
  console.log(`${realFailures} REAL ASSERTION(S) FAILED`);
  Deno.exit(1);
}
console.log('ALL REAL ASSERTIONS PASS — and the control failed as required, so they genuinely ran.');
