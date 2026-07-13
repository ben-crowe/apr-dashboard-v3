// Assertions for the SharePoint filed-name rule. Run:  deno run --allow-read supabase/functions/_shared/filedName.test.ts
//
// WHY A DELIBERATELY-FAILING CONTROL. The harness ends by running one assertion that MUST fail.
// If that control does NOT fail, the harness exits non-zero and says so — because an assertion set
// that cannot fail is an assertion set that never ran, and a green from it means nothing. A pass
// here therefore proves two things: the real assertions hold, AND the harness is actually executing
// them. (The extension leak below got past a passing suite precisely because nothing tested it.)

import { filedFileName, MAX_SHAREPOINT_PATH } from './filedName.ts';

const ID = '3f2b9c1a-77de-4a10-9b6e-0c1d2e3f4a5b';
const SHORT = '3f2b9c1a';
const ILLEGAL = /["*:<>?/\\|]/;

// A REAL destination prefix, from the locked folder spec + a real job folder name.
const PREFIX =
  '2.Jobs/2026/VAL261054 - Stacked Townhouse Development 2822 &2828 11 Ave SE Calgary AB/' +
  '3. WORK FILES (TTSZ, PICS, COMPS)/';

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
check('colon in stem stripped', filedFileName(ID, 'Site Survey: North Lot.pdf', ''), `Site Survey North Lot-${SHORT}.pdf`);
check('spaces + parens survive', filedFileName(ID, 'Site Survey (North Lot).pdf', ''), `Site Survey (North Lot)-${SHORT}.pdf`);
check('ampersand, comma, accent survive', filedFileName(ID, 'Plans & Élévations, rev2.dwg', ''), `Plans & Élévations, rev2-${SHORT}.dwg`);
check('multi-dot: split on LAST dot only', filedFileName(ID, 'report.final.pdf', ''), `report.final-${SHORT}.pdf`);
check('no dot = no extension', filedFileName(ID, 'README', ''), `README-${SHORT}`);
check('every forbidden char stripped from stem', filedFileName(ID, 'a"b*c<d>e?f/g\\h|i.pdf', ''), `abcdefghi-${SHORT}.pdf`);
check('leading ~$ rejected', filedFileName(ID, '~$budget.xlsx', ''), `budget-${SHORT}.xlsx`);
check('surrounding whitespace trimmed', filedFileName(ID, '   spaced   .pdf', ''), `spaced-${SHORT}.pdf`);
check('all-illegal stem falls back to the row id', filedFileName(ID, '///.pdf', ''), `${ID}.pdf`);

console.log('\n--- EXTENSION sanitation (the leak: ext is as client-controlled as the stem) ---');
check('colon after the last dot — was surviving', filedFileName(ID, 'Scan 2026.01.03: final', ''), `Scan 2026.01-${SHORT}.03 final`);
check('colon in a short ext — was surviving', filedFileName(ID, 'report.v2:final', ''), `report-${SHORT}.v2final`);
check('pipe in ext — was surviving', filedFileName(ID, 'notes.a|b', ''), `notes-${SHORT}.ab`);
check('trailing dot — SharePoint rejects names ending in a period', filedFileName(ID, 'survey.', ''), `survey-${SHORT}`);

console.log('\n--- invariants ---');
check('deterministic: same row in, same name out (retry-idempotency)',
  filedFileName(ID, 'Site Survey: North Lot.pdf', '') === filedFileName(ID, 'Site Survey: North Lot.pdf', ''), true);

const samples = [
  'Site Survey: North Lot.pdf', 'a"b*c<d>e?f/g\\h|i.pdf', '~$x.docx', '///.pdf', 'ok.pdf',
  'Scan 2026.01.03: final', 'report.v2:final', 'notes.a|b', 'survey.', 'weird.   ', '.',
];
check('NO illegal character survives into ANY output',
  samples.some((s) => ILLEGAL.test(filedFileName(ID, s, ''))), false);
check('NO output ends in a period or whitespace',
  samples.some((s) => /[.\s]$/.test(filedFileName(ID, s, ''))), false);

console.log('\n--- PATH LENGTH (SharePoint rejects a full path over ~400 chars) ---');

// The prefix is the real destination folder; the name is appended to it. The INVARIANT is about the
// assembled path, not the name — a valid name on an over-long path is still a rejected PUT.
const LONG_STEM = 'A'.repeat(300);
const longPath = PREFIX + filedFileName(ID, `${LONG_STEM}.pdf`, PREFIX);
check('a 300-char filename is cut to fit the full path', longPath.length <= MAX_SHAREPOINT_PATH, true);
check('the short id survives truncation (uniqueness is never cut)',
  filedFileName(ID, `${LONG_STEM}.pdf`, PREFIX).includes(SHORT), true);
check('the extension survives truncation (the file stays openable)',
  filedFileName(ID, `${LONG_STEM}.pdf`, PREFIX).endsWith('.pdf'), true);
check('a short name is NOT truncated when it already fits',
  filedFileName(ID, 'survey.pdf', PREFIX), `survey-${SHORT}.pdf`);
check('truncation cannot leave a trailing dot or space',
  /[.\s]$/.test(filedFileName(ID, `${'B'.repeat(120)}   ...x.pdf`, PREFIX)), false);

// Fail LOUD, never silently produce a path SharePoint will reject.
let threw = false;
try {
  // A prefix so long that no filename fits after it.
  filedFileName(ID, 'anything.pdf', 'x'.repeat(MAX_SHAREPOINT_PATH));
} catch {
  threw = true;
}
check('throws when the folder path alone leaves no room (loud, not a silent bad PUT)', threw, true);

// THE INVARIANT — over every sample, at three prefix lengths. This is the assertion that would have
// caught the extension leak, applied to length: assert the RULE, not the cases you thought of.
const lengthSamples = [
  'survey.pdf', 'Site Survey: North Lot.pdf', `${LONG_STEM}.pdf`, `${'x'.repeat(500)}.docx`,
  'Scan 2026.01.03: final', 'notes.a|b', 'survey.', '///.pdf', 'README', `${'y'.repeat(250)}`,
];
const prefixes = ['', PREFIX, PREFIX + 'x'.repeat(50)];
const anyOverLimit = lengthSamples.some((s) =>
  prefixes.some((p) => (p + filedFileName(ID, s, p)).length > MAX_SHAREPOINT_PATH),
);
check('INVARIANT — NO assembled full path exceeds the limit, for ANY sample at ANY prefix',
  anyOverLimit, false);

// Length work must not have broken the character rules.
const stillIllegal = lengthSamples.some((s) =>
  prefixes.some((p) => ILLEGAL.test(filedFileName(ID, s, p))),
);
check('INVARIANT — truncation did not reintroduce an illegal character', stillIllegal, false);

check('INVARIANT — still deterministic with a prefix (retry-idempotency)',
  filedFileName(ID, `${LONG_STEM}.pdf`, PREFIX) === filedFileName(ID, `${LONG_STEM}.pdf`, PREFIX), true);

// ---- The control: this assertion MUST fail. A green harness that skips it is not green. ----
console.log('\n--- control (MUST fail — proves the assertions actually execute) ---');
const controlFailed = !check(
  'CONTROL — deliberately wrong expectation, must NOT match',
  filedFileName(ID, 'ok.pdf', ''),
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
