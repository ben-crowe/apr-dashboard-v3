// Shared ClickUp custom-field resolver for the Job-Hub model (spec: Data-Flow Visuals/03-CLICKUP-JOB-HUB-SPEC.md).
//
// WHY custom fields (not a markdown description blob): setting a field REPLACES, never appends — this
// structurally kills the "VAL261101 VAL261101" / double-section duplication bug. Board views can also
// filter/sort/group by typed field.
//
// Resolution is DYNAMIC byName: we GET the list's field definitions at runtime and match by field NAME
// (stable across lists) → id (differs per list). So this works on the BC mirror now AND auto-works when
// Ben replicates the template to the Valta board, with ZERO code change. Any hub field that is absent on
// the target list, or a dropdown whose value doesn't match a live option label, is SKIPPED (never sent).
//
// GOVERNING RULE (Ben, 2026-06-19): the ClickUp mirror's fields + dropdown OPTIONS are the client's
// source of truth. We do NOT add fields or options to ClickUp — keys here are reconciled to the LIVE
// mirror names (mirror task 86e1yb8nz). A dashboard value with no matching field/option simply does not
// sync — by design. See docs/CLICKUP-MIRROR-SYNC-RECONCILIATION-FIX.md.
//
// KEEP set (reconciled to live mirror names 2026-06-19):
// LINKS/JOB: Job Number (short_text) · APR Dashboard Link (url) · Valcre Job (url)
// CLIENT:    Client Full Name (first+last) · Client Email · Client Phone · Client Organization
// PROPERTY:  Property Name · Property Address · Property Type (drop_down) · Property Subtype (drop_down)
// CONTACT:   Contact Name (first+last) · Contact Email · Contact Phone
// SCOPE:     Report Type (drop_down) · Authorized Use (drop_down ← authorized_use)
//            Interest Appraised (drop_down ← property_rights_appraised) · State of Improvements (drop_down)
//            Status of Improvements (drop_down) · Approaches To Value · Value Scenario(s)
// SITE/TXN:  Transaction Status (drop_down) · Zoning Status (drop_down)
// DATES:     Delivery Date · Received Date · LOE Sent · LOE Signed
//
// SOURCES: job_submissions (root, incl. property_contact_* + client_*), job_loe_details (loe),
//   job_property_info (prop — only on create-clickup-task's select unless update's select is widened).
//   Cascade outputs (Approaches/Value Scenarios/Status/Txn/Zoning) are sourced loe-first so they sync
//   on UPDATE too (update-clickup-task selects loe but historically not prop).
//
// REMOVED 2026-06-19 (not on the client mirror, Ben confirmed): Scope of Work, Payment Terms, Appraisal Fee.

export interface ClickUpFieldDef {
  id: string
  name: string
  type: string
  type_config?: { options?: Array<{ id: string; name?: string; label?: string }> }
}

// Fetch the live custom-field definitions for a list.
export async function fetchListFields(token: string, listId: string): Promise<ClickUpFieldDef[]> {
  const resp = await fetch(`https://api.clickup.com/api/v2/list/${listId}/field`, {
    method: 'GET',
    headers: { 'Authorization': token, 'Content-Type': 'application/json' },
  })
  if (!resp.ok) {
    console.warn('fetchListFields non-200:', resp.status, await resp.text().catch(() => ''))
    return []
  }
  const data = await resp.json()
  return (data.fields || []) as ClickUpFieldDef[]
}

// Build the hub value map — keyed to the LIVE mirror field names (mirror task 86e1yb8nz, 39 fields).
// Sources: job_submissions (root), job_loe_details (loe), job_property_info (prop),
//   job_submissions.created_at (Received Date). The resolver matches by EXACT field name and skips on
//   miss, so every key here must match the live mirror name character-for-character.
function hubValueMap(job: any, hubUrl?: string): Record<string, any> {
  const loe = (Array.isArray(job.job_loe_details) ? job.job_loe_details[0] : job.job_loe_details) || {}
  const prop = (Array.isArray(job.job_property_info) ? job.job_property_info[0] : job.job_property_info) || {}

  // ── LINKS ──────────────────────────────────────────────────────────────────
  // Job Number: job_number lives on job_loe_details per the Valcre sync path.
  const jobNumber = loe.job_number || job.job_number || ''

  // APR Dashboard Link: <hubUrl>/dashboard/job/<job.id>
  const base = hubUrl || 'https://apr-dashboard-v3.vercel.app'
  const aprDashboardLink = job.id ? `${base}/dashboard/job/${job.id}` : ''

  // Valcre Job Link: https://app.valcre.com/job/edit/<valcre_job_id>#job (skip if absent)
  const valcreJobId = loe.valcre_job_id || job.valcre_job_id || ''
  const valcreJobLink = valcreJobId ? `https://app.valcre.com/job/edit/${valcreJobId}#job` : ''

  // ── CLIENT ───────────────────────────────────────────────────────────────
  // Client Full Name: the mirror has ONE name field (not first/last). Concatenate, trim.
  const clientFullName = [job.client_first_name, job.client_last_name]
    .filter(Boolean).join(' ').trim()

  // ── CONTACT (property contact, on job_submissions root) ──────────────────
  const contactName = [job.property_contact_first_name, job.property_contact_last_name]
    .filter(Boolean).join(' ').trim()

  // ── DATES ─────────────────────────────────────────────────────────────────
  // Delivery Date: loe.delivery_date (ISO string → unix ms via encodeForField date handler)
  // Received Date: job.created_at (ISO string → unix ms)
  // LOE Sent:  loe.loe_sent_at (ISO string → unix ms, stamped by docuseal-webhook on send event;
  //            column added by migration 20260619_add_loe_sent_at.sql so the webhook write lands)
  // LOE Signed: loe.signed_at  (ISO string → unix ms, stamped by docuseal-webhook on completion)

  return {
    // LINKS / JOB
    'Job Number': jobNumber,
    'APR Dashboard Link': aprDashboardLink,
    'Valcre Job': valcreJobLink,
    // CLIENT
    'Client Full Name': clientFullName,
    'Client Email': job.client_email || '',
    'Client Phone': job.client_phone || '',
    'Client Organization': job.client_organization || '',
    // PROPERTY
    'Property Name': job.property_name || '',
    'Property Address': job.property_address || '',
    'Property Type': job.property_type || '',
    'Property Subtype': prop.property_subtype || '',
    // CONTACT
    'Contact Name': contactName,
    'Contact Email': job.property_contact_email || '',
    'Contact Phone': job.property_contact_phone || '',
    // SCOPE / ASSIGNMENT
    // "Report Type" on the client mirror is the report FORMAT dropdown (Comprehensive/Concise/Form/N/A),
    // NOT report_type ("Appraisal Report" etc.). Source from report_format so the value matches an option.
    'Report Type': loe.report_format || job.report_format || '',
    'Authorized Use': loe.authorized_use || job.authorized_use || job.intended_use || '',
    'Interest Appraised': loe.property_rights_appraised || '',
    'State of Improvements': prop.state_of_improvements || '',
    'Status of Improvements': loe.status_of_improvements || prop.status_of_improvements || '',
    'Approaches To Value': loe.approaches_to_value || prop.approaches_to_value || '',
    'Value Scenario(s)': loe.value_scenarios || prop.value_scenarios || '',
    // SITE / TXN
    'Transaction Status': loe.transaction_status || prop.transaction_status || '',
    'Zoning Status': loe.zoning_status || prop.zoning_status || '',
    // DATES
    'Delivery Date': loe.delivery_date || '',
    'Received Date': job.created_at || '',
    'LOE Sent': loe.loe_sent_at || '',
    'LOE Signed': loe.signed_at || '',
  }
}

// Match ONE source value against a field's options, returning the option id or null.
// The full fuzzy cascade (exact → prefix → reverse-prefix → word-overlap), shared by drop_down
// (single) and labels (multi). `rawValue` is one already-trimmed value (no comma splitting here).
function matchOption(opts: Array<{ id: string; name?: string; label?: string }>, rawValue: string): string | null {
  const want = String(rawValue).trim().toLowerCase()
  if (!want) return null
  const label = (o: { label?: string; name?: string }) => String(o.label ?? o.name ?? '').trim().toLowerCase()
  // 1) exact (case-insensitive) match — the strict path.
  let hit = opts.find(o => label(o) === want)
  // 2) prefix match — source uses the SHORT form, ClickUp option is the LONG form.
  //    e.g. source "fee simple" → option "fee simple interest"; "Cost" → "Cost Approach".
  //    Pick the SHORTEST option that starts with `want` (most specific extension of the source value).
  if (!hit) {
    const prefixHits = opts.filter(o => label(o).startsWith(want))
    if (prefixHits.length) {
      hit = prefixHits.reduce((a, b) => (label(a).length <= label(b).length ? a : b))
    }
  }
  // 3) reverse prefix — source is the LONG form, option is the SHORT form (rarer, but symmetric).
  if (!hit) {
    hit = opts.find(o => label(o) && want.startsWith(label(o)))
  }
  // 4) significant-word overlap — handles mismatches like "on completion" ↔ "upon completion"
  //    where neither string is a prefix of the other.
  //    4a) Multi-word: option sharing the most words (≥3 chars), must share ≥2 to qualify.
  //    4b) Single long-word (≥5 chars) appearing in exactly one option.
  if (!hit) {
    const wantWords = new Set(want.split(/\s+/).filter(w => w.length >= 3))
    if (wantWords.size >= 2) {
      let bestCount = 1
      let bestOpt: typeof opts[0] | undefined
      for (const o of opts) {
        const oWords = label(o).split(/\s+/).filter(w => w.length >= 3)
        const shared = oWords.filter(w => wantWords.has(w)).length
        if (shared > bestCount) { bestCount = shared; bestOpt = o }
      }
      if (bestOpt) hit = bestOpt
    } else {
      const longWords = Array.from(wantWords).filter(w => w.length >= 5)
      if (longWords.length === 1) {
        const lw = longWords[0]
        const candidates = opts.filter(o => label(o).split(/\s+/).includes(lw))
        if (candidates.length === 1) hit = candidates[0] // unambiguous single match only
      }
    }
  }
  return hit ? hit.id : null // no match → caller decides (drop_down skips; labels drops just this value)
}

// Per-field synonym tables, keyed by ClickUp field NAME. Applied BEFORE the generic fuzzy matcher to
// bridge cases where the dashboard's vocabulary and the client's option labels mean the same thing but
// share no word the matcher could catch (e.g. "Improved" vs "Existing Property"). Keyed by lowercased
// source value → the client's exact option label. A source value NOT in the table falls through to the
// normal fuzzy match (which skips on no match). A wrong value on the client card is worse than an empty
// one, so we only normalize mappings we're certain of and deliberately leave ambiguous values unmapped.
const FIELD_SYNONYMS: Record<string, Record<string, string>> = {
  'State of Improvements': {
    'improved': 'Existing Property',
    'complete': 'Existing Property',
    'completed': 'Existing Property',
    'existing': 'Existing Property',
    'proposed': 'Proposed', // already matches; included for clarity
    // Vacant Land / Improved Development Land intentionally unmapped pending client taxonomy
    // confirmation — safe-skip (a wrong value is worse than blank).
  },
  // FIX 1 (2026-06-23) — Property Subtype: bridge the dashboard's hyphen/space spelling to the client
  // mirror's exact option labels (Apartment / Townhouse / Mixed Use / Shopping Centre). The dashboard
  // emits 'Mixed-Use' (hyphen); the client option is 'Mixed Use' (space) → the fuzzy matcher would drop
  // it silently. 'Townhouse' already matches exactly (listed for clarity). Dashboard-only subtypes with
  // no client equivalent (Low/Mid/High-Rise, Garden, Walk-Up) are intentionally left unmapped → safe-skip.
  'Property Subtype': {
    'mixed-use': 'Mixed Use',
    'mixed use': 'Mixed Use',
    'townhouse': 'Townhouse',
    'apartment': 'Apartment',
    'shopping centre': 'Shopping Centre',
    'shopping center': 'Shopping Centre',
  },
  // FIX 2 (2026-06-23) — Status of Improvements: CORRECTED. The earlier two-value mapping
  // ('Existing Property' | 'Proposed') was WRONG — that target set does not exist on this dropdown.
  // Live OpenCLI readback proved the field's real option set is the GRANULAR seven-value list
  // (docs/VALTA-FIELD-SPEC.md L73): 'Existing - Completed | Existing - Renovated |
  // Existing - Under Renovation | Existing - To Be Renovated | Proposed - Vacant Land |
  // Proposed - Improved Land (Demolition Required) | Proposed - Under Construction'.
  // The dashboard cascade (loeCascade.ts STATUS_TO_SCENARIOS) uses an 'Improved - *' prefix; ClickUp
  // uses 'Existing - *'. So we only need to bridge the prefix (Improved → Existing) — the suffix already
  // matches the client option verbatim. 'Proposed - *' keys are already identical to ClickUp options.
  'Status of Improvements': {
    'improved - completed': 'Existing - Completed',
    'improved - renovated': 'Existing - Renovated',
    'improved - under renovation': 'Existing - Under Renovation',
    'improved - proposed renovation': 'Existing - To Be Renovated',
    'proposed - vacant land': 'Proposed - Vacant Land',
    'proposed - improved land (demolition required)': 'Proposed - Improved Land (Demolition Required)',
    'proposed - under construction': 'Proposed - Under Construction',
  },
  // FIX 2 (2026-06-23) — Property Type: the dashboard stores 'Self-Storage' (hyphen) but the LIVE client
  // mirror option is 'Self Storage' (space) — confirmed by reading the field's type_config.options off the
  // running list. The strict matcher misses on the hyphen and silently skips → Property Type synced blank.
  // Live option set (verbatim): Multifamily | Self Storage | Retail | Industrial | Land | Office | Hotel |
  // Senior | Other. Bridge the dashboard spelling to the exact live label. (Other dashboard property types
  // that already match a live option verbatim need no synonym — left to the exact matcher.)
  'Property Type': {
    'self-storage': 'Self Storage',
    'self storage': 'Self Storage',
    'seniors': 'Senior',
  },
}

// Apply a field's synonym table to one source value (returns the canonical label, or the value unchanged).
function applySynonym(fieldName: string, value: string): string {
  const table = FIELD_SYNONYMS[fieldName]
  if (!table) return value
  return table[value.trim().toLowerCase()] ?? value
}

// Encode one value for a given ClickUp field type. Returns the API-ready value, or null = SKIP.
// drop_down → option id (string); labels → array of option ids (string[]); date/currency → number.
function encodeForField(def: ClickUpFieldDef, raw: any): string | number | string[] | null {
  if (raw === null || raw === undefined || String(raw).trim() === '') return null
  switch (def.type) {
    case 'drop_down': {
      // Single-select: take first value if a multi/comma string came through (matches Valcre first-value rule).
      const opts = def.type_config?.options || []
      return matchOption(opts, applySynonym(def.name, String(raw).split(',')[0]))
    }
    case 'labels': {
      // Multi-select (ClickUp type "labels"): source is comma-separated. Match EACH value through the
      // same fuzzy cascade, collect the matched option ids. Skip the whole field only if NONE match.
      const opts = def.type_config?.options || []
      const ids: string[] = []
      for (const part of String(raw).split(',')) {
        const id = matchOption(opts, applySynonym(def.name, part))
        if (id && !ids.includes(id)) ids.push(id)
      }
      return ids.length ? ids : null
    }
    case 'date': {
      const n = typeof raw === 'number' ? raw : Date.parse(String(raw))
      return Number.isFinite(n) ? n : null // ClickUp wants unix ms
    }
    case 'currency': {
      const n = Number(String(raw).replace(/[^0-9.]/g, ''))
      return Number.isFinite(n) ? n : null // dollars
    }
    case 'phone': {
      // ClickUp PHONE fields SILENTLY DROP non-E.164 values. Normalize: strip to digits, then format.
      // "(403) 342-6502" → "+14033426502". 10 digits → +1; 11 starting with 1 → +1…; else +<digits>.
      const digits = String(raw).replace(/\D/g, '')
      if (!digits) return null
      if (digits.length === 10) return `+1${digits}`
      if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
      return `+${digits}`
    }
    default: // email / url / short_text / text
      return String(raw).trim()
  }
}

// Build the [{id, value}] array for a job against a list's live field defs (byName, type-encoded, skip-on-miss).
// hubUrl is optional — defaults to the production APR Dashboard URL.
export function buildHubCustomFields(job: any, listFields: ClickUpFieldDef[], hubUrl?: string): Array<{ id: string; value: any; name: string }> {
  const byName = new Map(listFields.map(f => [f.name, f]))
  const values = hubValueMap(job, hubUrl)
  const out: Array<{ id: string; value: any; name: string }> = []
  for (const [name, raw] of Object.entries(values)) {
    const def = byName.get(name)
    if (!def) continue // field not on this list → skip
    const encoded = encodeForField(def, raw)
    if (encoded === null) continue // empty / unmatched dropdown → skip
    out.push({ id: def.id, value: encoded, name })
  }
  return out
}

// Diagnostic: which hub field NAMES have no column on this list (byName miss). Independent of value —
// answers "which fields need a one-time column created in the ClickUp UI". Logged by create-clickup-task.
export function hubFieldsMissingColumns(job: any, listFields: ClickUpFieldDef[], hubUrl?: string): string[] {
  const have = new Set(listFields.map(f => f.name))
  return Object.keys(hubValueMap(job, hubUrl)).filter(name => !have.has(name))
}

// Apply custom fields to a task via the per-field endpoint (POST /task/{id}/field/{fieldId}).
// Set-replaces semantics = no duplication possible. Then a single GET readback confirms persistence
// (not trusting the 200 alone — the session-long doctrine). Returns counts for the caller's response.
export async function applyTaskFields(
  token: string,
  taskId: string,
  fields: Array<{ id: string; value: any; name: string }>,
): Promise<{ set: number; failed: number; verified: number; total: number }> {
  let set = 0, failed = 0
  for (const f of fields) {
    try {
      // labels (multi-select) need the add/rem envelope; ClickUp rejects a bare array or string.
      // All other types take the plain { value }. Array value == labels field.
      const body = Array.isArray(f.value)
        ? { value: { add: f.value, rem: [] } }
        : { value: f.value }
      const resp = await fetch(`https://api.clickup.com/api/v2/task/${taskId}/field/${f.id}`, {
        method: 'POST',
        headers: { 'Authorization': token, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (resp.ok) { set++ } else {
        failed++
        console.warn(`field set failed [${f.name}]:`, resp.status, await resp.text().catch(() => ''))
      }
    } catch (e) {
      failed++
      console.warn(`field set error [${f.name}]:`, (e as any)?.message || e)
    }
  }

  // Readback: GET the task once, confirm each target field now holds the value we sent.
  let verified = 0
  try {
    const resp = await fetch(`https://api.clickup.com/api/v2/task/${taskId}`, {
      method: 'GET',
      headers: { 'Authorization': token, 'Content-Type': 'application/json' },
    })
    if (resp.ok) {
      const task = await resp.json()
      const live = new Map((task.custom_fields || []).map((cf: any) => [cf.id, cf.value]))
      for (const f of fields) {
        const v = live.get(f.id)
        if (v === undefined || v === null) continue
        if (Array.isArray(f.value)) {
          // labels: live value is an array of option ids — verify every id we sent is present.
          const liveIds = new Set((Array.isArray(v) ? v : []).map((x: any) => String(x)))
          if (f.value.length > 0 && f.value.every((id: string) => liveIds.has(String(id)))) verified++
        } else if (String(v) === String(f.value)) {
          // dropdown live value is the option id; date/number/string compare loosely
          verified++
        }
      }
    }
  } catch (e) {
    console.warn('custom-field readback failed (non-fatal):', (e as any)?.message || e)
  }

  console.log(`🔁 custom fields: set=${set} failed=${failed} verified=${verified}/${fields.length}`)
  return { set, failed, verified, total: fields.length }
}
