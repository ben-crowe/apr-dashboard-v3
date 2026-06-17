#!/usr/bin/env node
// Inject v3key (v3) + v4id (v4) + section-home (sh) into named FIELDS rows of the HTML registry.
// Reusable per capture batch. Map below = the verified batch (code-confirmed, QA reconciles).
import { readFileSync, writeFileSync } from 'node:fs';
const HTML = 'public/field-registry-v6.html';

// name -> { v3: form-state key, v4: fieldRegistry id, sh: section-home }  (verified vs live code)
const BATCH = {
  // Batch 1 (S2 + renames) — already injected, skipped by the ,v3: guard; kept for record.
  ReportType:       { v3: 'reportFormat',            v4: 'report-type',    sh: 'S2' }, // v3 corrected reportType→reportFormat (FORMAT axis; reportType is the separate PRODUCT field)
  ScopeOfWork:      { v3: 'scopeOfWork',             v4: 'scope-of-work',  sh: 'S2' },
  InterestAppraised:{ v3: 'propertyRightsAppraised', v4: 'property-rights', sh: 'S2' }, // rename
  AuthorizedUse:    { v3: 'intendedUse',             v4: 'intended-use',   sh: 'S2' }, // rename
  LegalDescription: { v3: 'legalDescription',        v4: 'report-legal',   sh: 'S3' }, // v3 in OrganizingDocs; rename
  // Batch 2 (S1 client/property, flat camelCase on `job`, verified in client-submission/*.tsx)
  ClientFirstName:          { v3: 'clientFirstName', v4: 'client-first-name', sh: 'S1' },
  ClientLastName:           { v3: 'clientLastName',  v4: 'client-last-name',  sh: 'S1' },
  ClientEmail:              { v3: 'clientEmail',     v4: 'client-email',      sh: 'S1' },
  ClientTitle:              { v3: 'clientTitle',     v4: 'client-title',      sh: 'S1' },
  ClientOrganizationAddress:{ v3: 'clientAddress',  v4: 'client-address',    sh: 'S1' },
  PropertyName:             { v3: 'propertyName',    v4: 'property-name',     sh: 'S1' },
  PropertyAddress:          { v3: 'propertyAddress', v4: 'property-address',  sh: 'S1' },
  // Batch 3 — the 3 QA/co-arch moved OUT of the 4b seed (they EXIST in V4 as kebab ids; bridge feeds them)
  ValueScenarios:           { v3: 'valueScenarios',    v4: 'value-scenario',     sh: 'S2' },
  ApproachestoValue:        { v3: 'approachesToValue', v4: 'approaches-applied', sh: 'S2' }, // rename
  Valuetimeframe:           { v3: 'valueTimeframe',    v4: 'timeframe',          sh: 'S2' }, // rename
  // Batch 4 — clean (verified v3key in S1 subs / S2; v4id present in fieldRegistry)
  ClientPhone:              { v3: 'clientPhone',  v4: 'client-phone',   sh: 'S1' },
  PropertyType:             { v3: 'propertyType', v4: 'property-type',  sh: 'S1' },
  Fee:                      { v3: 'appraisalFee', v4: 'appraisal-fee',  sh: 'S2' }, // rename
  JobNumber:                { v3: 'jobNumber',    v4: 'job-number',     sh: 'S2' },
  // Batch 5 — ClientCompanyName: v3 clientOrganization (S1) → v4 client-organization (chosen of 2; QA confirm)
  ClientCompanyName:        { v3: 'clientOrganization', v4: 'client-organization', sh: 'S1' }, // rename; v4 chosen of client-organization|client-company
  // Batch 6 — deeper-traced tail (v3keys confirmed via .propertySubtype/.tenancy access; both dual-home S1+S2, S2 = in-scope home)
  PropertySubtype:          { v3: 'propertySubtype', v4: 'property-subtype', sh: 'S2' },
  Tenancy:                  { v3: 'tenancy',         v4: 'impv-tenancy',     sh: 'S2' }, // v4 = LIVE field (bridge feeds impv-tenancy from job_property_info); 'tenancy' id is the DEAD duplicate
};

let html = readFileSync(HTML, 'utf8');
const lines = html.split('\n');
let n = 0;
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^\s*\{n:"([^"]+)"/);
  if (!m || !BATCH[m[1]]) continue;
  if (/,v3:/.test(lines[i])) continue; // already injected
  const b = BATCH[m[1]];
  const inject = `,v3:${JSON.stringify(b.v3)},v4:${JSON.stringify(b.v4)},sh:${JSON.stringify(b.sh)}`;
  lines[i] = lines[i].replace(/\}(,?)\s*$/, `${inject}}$1`);
  n++;
}
writeFileSync(HTML, lines.join('\n'));
console.log(`injected v3/v4/sh into ${n} rows:`, Object.keys(BATCH).join(', '));
