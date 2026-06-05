// LOE-07 §10 cascade test — drives the REAL shared module (no duplicated logic) against VAL261101.
// Prints the derivation table for all 7 Status values + Insurance override, then renders the proving case.
// Run: npx tsx tests/loe-v07-cascade-test.ts
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { deriveValueScenarios, resolveNarrative, STATUS_TO_SCENARIOS } from '../src/utils/loe/loeCascade';

const PROJ = 'ngovnamnjmexdpjtcnky';
const JOB_ID = 'e5a7ba2f-0535-4fbf-9ba7-b7027cf0a157'; // VAL261101 = Westside Mall
const TPL = `${homedir()}/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/LOE-template-v07.html`;
const OUT = `${homedir()}/Development/KM-Exp/data/screenshots`;
mkdirSync(OUT, { recursive: true });

const SAT = execSync(
  `grep -m1 SUPABASE_ACCESS_TOKEN ~/.zshrc | sed -E 's/.*=["'"'"']?([^"'"'"']+).*/\\1/'`,
  { shell: '/bin/zsh' },
).toString().trim();

async function sql(q: string): Promise<any[]> {
  const r = await fetch(`https://api.supabase.com/v1/projects/${PROJ}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${SAT}`, 'Content-Type': 'application/json', 'User-Agent': 'curl/8.0' },
    body: JSON.stringify({ query: q }),
  });
  return r.json();
}

function g(d: any, k: string) { return (d && d[k]) || ''; }
function fmtCur(v: any) { const n = String(v ?? '').replace(/[^0-9.]/g, ''); return n ? `$${Number(n).toLocaleString()}` : '$TBD'; }

(async () => {
  const job = (await sql(`select * from job_submissions where id='${JOB_ID}'`))[0];
  const ldArr = await sql(`select * from job_loe_details where job_id='${JOB_ID}'`);
  const ld = ldArr[0] || {};

  // NAME-MATCH GUARD
  console.log(`GUARD property_name=${JSON.stringify(job.property_name)} job=${ld.job_number}`);
  if (!String(job.property_name || '').toLowerCase().includes('westside')) {
    throw new Error(`NAME-MATCH GUARD FAILED: ${job.property_name}`);
  }

  // ── Part C cascade table — ALL 7 status values + Insurance override (uses the REAL module) ──
  console.log('\n=== §10 CASCADE DERIVATION (real module) ===');
  const statuses = Object.keys(STATUS_TO_SCENARIOS);
  for (const st of statuses) {
    const scen = deriveValueScenarios(st, '');
    const right = scen.map(s => (resolveNarrative(s) ? 'RESOLVES(EA-001)' : '[bracket]'));
    console.log(`  ${st}`);
    scen.forEach((s, i) => console.log(`      ${i + 1}. ${s}  →  ${right[i]}`));
  }
  const ovr = deriveValueScenarios('Existing - Completed', 'Insurance');
  console.log(`  OVERRIDE Authorized Use=Insurance  →  ${ovr.join(' | ')}`);

  // ── Render the PROVING case: Proposed - Improved Land (Demolition Required) ──
  const proveStatus = 'Proposed - Improved Land (Demolition Required)';
  const scenarios = deriveValueScenarios(proveStatus, g(ld, 'authorized_use') || g(job, 'intended_use'));
  console.log(`\n=== RENDER CASE: ${proveStatus} ===\n  scenarios: ${scenarios.join(' | ')}`);

  const propName = g(job, 'property_name') || 'Unnamed Property';
  const map: Record<string, string> = {
    "[Today's Date]": 'June 4, 2026',
    '[ClientFirstName]': g(job, 'client_first_name'), '[ClientLastName]': g(job, 'client_last_name'),
    '[ClientCompanyName]': g(job, 'client_organization'), '[ClientOrganizationAddress]': g(job, 'client_address'),
    '[ClientPhone]': g(job, 'client_phone'), '[ClientEmail]': g(job, 'client_email'),
    '[JobNumber]': g(ld, 'job_number') || 'Awaiting Valcre job',
    '[JobName]': [propName, g(job, 'property_address')].filter(Boolean).join(', '),
    '[PropertyName]': propName, '[PropertyAddress]': g(job, 'property_address'), '[PropertyType]': g(job, 'property_type'),
    '[InterestAppraised]': g(ld, 'property_rights_appraised'),
    '[CurrentUseImprovements]': g(ld, 'current_use'), '[ProposedUseImprovements]': g(ld, 'proposed_use'),
    '[AuthorizedUse]': g(ld, 'authorized_use') || g(job, 'intended_use'),
    '[Valuetimeframe]': g(ld, 'value_timeframe') || g(ld, 'valuation_premises'),
    '[ValueScenarios]': g(ld, 'value_scenarios'), '[ReportType]': g(ld, 'report_type'),
    '[AssignmentType]': g(ld, 'assignment_type'), '[ApproachestoValue]': g(ld, 'approaches_to_value'),
    '[Fee]': fmtCur(g(ld, 'appraisal_fee')), '[DeliveryTime]': g(ld, 'delivery_time'),
    '[ClientDocuments]': g(ld, 'client_documents'), '[PreviouslyAppraised]': g(ld, 'previously_appraised'),
    '[ScheduleAPropertyList]': g(ld, 'schedule_a_property_list'),
  };
  // §10 slots from the REAL module
  for (let i = 1; i <= 6; i++) {
    const s = scenarios[i - 1];
    map[`[ValueScenario${i}]`] = s || '';
    map[`[EA/HCSummary${i}]`] = s ? (resolveNarrative(s) || `[EA/HCSummary${i}]`) : '';
  }

  let html = readFileSync(TPL, 'utf8');
  // Schedule-A strip (single property)
  if (!String(g(ld, 'assignment_type')).toLowerCase().includes('multiple')) {
    html = html.replace(/<!-- SCHEDULE-A:START -->[\s\S]*?<!-- SCHEDULE-A:END -->/g, '');
  }
  // §10 row suppression (same rule as generator)
  for (let i = 1; i <= 6; i++) {
    if (!scenarios[i - 1]) {
      html = html.replace(new RegExp(`<!-- EAHC-ROW-${i}:START -->[\\s\\S]*?<!-- EAHC-ROW-${i}:END -->`, 'g'), '');
    }
  }
  for (const [k, v] of Object.entries(map)) html = html.split(k).join(String(v));

  const filled = `${OUT}/loe-v07-cascade-VAL261101.html`;
  writeFileSync(filled, html);
  const residual = html.match(/\[[A-Za-z0-9/' .]+\]/g) || [];
  console.log(`  filled: ${filled}\n  residual tokens (excl comment): ${[...new Set(residual)].join(', ') || 'none'}`);

  // Chrome → PDF → PNG
  const pdf = `${OUT}/loe-v07-cascade-VAL261101.pdf`;
  const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  execSync(`"${CHROME}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdf}" "file://${filled}" 2>/dev/null`);
  execSync(`pdftoppm -png -r 150 "${pdf}" "${OUT}/loe-v07-cascade-page"`);
  console.log(`  PDF: ${pdf}\n  PNGs: ${OUT}/loe-v07-cascade-page-*.png`);
})();
