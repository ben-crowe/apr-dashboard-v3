// Shared ClickUp custom-field resolver for the Job-Hub model (spec: Data-Flow Visuals/03-CLICKUP-JOB-HUB-SPEC.md).
//
// WHY custom fields (not a markdown description blob): setting a field REPLACES, never appends — this
// structurally kills the "VAL261101 VAL261101" / double-section duplication bug. Board views can also
// filter/sort/group by typed field.
//
// Resolution is DYNAMIC byName: we GET the list's field definitions at runtime and match by field NAME
// (stable across lists) → id (differs per list). So this works on the BC mirror now AND auto-works when
// Ben replicates the template to the Valta board, with ZERO code change. Any hub field that is absent on
// the target list, or a dropdown whose value doesn't match a live option label, is SKIPPED (never sent) —
// which makes the HOLD dropdowns (Report Type, Intended Use) and not-yet-added fields (Appraisal Fee,
// Received/LOE Sent/LOE Signed dates) self-resolve the moment they exist / are aligned, no redeploy.

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

// Card-redesign KEEP set (2026-06-05, BRIEF-reactspec-clickup-card-redesign): the GROUPED data fields.
// Each datum lives ONCE — the two links + Job# + Date Ordered + the LOE tracker live in the DESCRIPTION
// title block (create-clickup-task), so they are NOT custom fields here. This map closes QA's subset gap
// (Asset Condition, Client Phone, Property Contact*, Valuation Premises, Status of Improvements were
// missing). REMOVED noise: Intended Use (dup of Authorized Use), Client Title, Client Address, Job Status,
// Additional Info. QA_PROBE_DELETE_ME is a stray ClickUp test field the API CANNOT delete — flag for
// manual removal in the ClickUp UI; do not fight the API. byName resolver SKIPS any field not yet on the
// list, so the 7 ADD fields self-populate the moment their defs exist (create in the UI or via API).
// Normalize asset_condition from the intake form's condition-rating vocabulary
// (Excellent / Very Good / Good / Fair / Poor / existing-property) to the ClickUp
// dropdown taxonomy (New Development | Existing Property).
// "new-development" or "new development" → New Development; everything else → Existing Property.
function normalizeAssetCondition(raw: string | undefined | null): string {
  if (!raw) return ''
  const v = raw.trim().toLowerCase().replace(/[_-]/g, ' ')
  if (v === 'new development' || v === 'new') return 'New Development'
  if (v === 'existing property' || v === 'existing') return 'Existing Property'
  // Condition-rating values (excellent/good/fair/poor/very good) all indicate an existing property.
  const ratingWords = ['excellent', 'very good', 'good', 'fair', 'poor']
  if (ratingWords.some(r => v.includes(r))) return 'Existing Property'
  return '' // unrecognized — skip
}

function hubValueMap(job: any): Record<string, any> {
  const loe = (Array.isArray(job.job_loe_details) ? job.job_loe_details[0] : job.job_loe_details) || {}
  const pi = (Array.isArray(job.job_property_info) ? job.job_property_info[0] : job.job_property_info) || {}
  return {
    // CLIENT
    'Client Organization': job.client_organization || '',
    'Client First Name': job.client_first_name || '',
    'Client Last Name': job.client_last_name || '',
    'Client Email': job.client_email || '',
    'Client Phone': job.client_phone || '',
    // PROPERTY
    'Property Name': job.property_name || '',
    'Property Address': job.property_address || '',
    'Property Type': job.property_type || '',
    // Property Subtype + Tenancy from job_property_info. Fields are field-absent on some lists
    // (will self-populate the moment "Property Subtype" / "Tenancy" columns are added in the UI).
    'Property Subtype': pi.property_subtype || '',
    'Tenancy': pi.tenancy || '',
    'Authorized Use': loe.authorized_use || job.intended_use || '',         // canonical (replaces Intended Use dup)
    // Asset Condition: normalize from intake rating vocabulary → ClickUp dropdown taxonomy
    // (New Development | Existing Property). See normalizeAssetCondition().
    'Asset Condition': normalizeAssetCondition(job.asset_condition || pi.asset_condition || ''),
    'Valuation Premises': loe.valuation_premises || job.valuation_premises || '',  // PLURAL — matches live ClickUp field name (singular missed byName, silently skipped)
    // PROPERTY CONTACT group DROPPED 2026-06-05 (Ben, locked mock MK9-0) — duplicates Client (same person).
    // ASSIGNMENT
    'Property Rights Appraised': loe.property_rights_appraised || '',
    'Scope of Work': loe.scope_of_work || '',
    'Report Type': loe.report_type || '',
    'Status of Improvements': pi.status_of_improvements || '',
    // FINANCIAL
    'Appraisal Fee': loe.appraisal_fee ?? '',
    'Retainer': loe.retainer_amount ?? '',
    'Delivery Date': loe.delivery_date || '',
    // Payment Terms: "On Completion" (DB value) → "Upon Completion" (ClickUp option).
    // Normalized via suffix-match below — no hardcoded alias needed; encode logic handles it.
    'Payment Terms': loe.payment_terms || '',
    // NOTES
    'Appraiser Notes': loe.internal_comments || loe.appraiser_comments || '',
    'Client Comments': job.notes || '',
  }
}

// Encode one value for a given ClickUp field type. Returns the API-ready value, or null = SKIP.
function encodeForField(def: ClickUpFieldDef, raw: any): string | number | null {
  if (raw === null || raw === undefined || String(raw).trim() === '') return null
  switch (def.type) {
    case 'drop_down': {
      // Single-select: take first value if a multi/comma string came through (matches Valcre first-value rule).
      const want = String(raw).split(',')[0].trim().toLowerCase()
      const opts = def.type_config?.options || []
      const label = (o: { label?: string; name?: string }) => String(o.label ?? o.name ?? '').trim().toLowerCase()
      // 1) exact (case-insensitive) match — the strict path.
      let hit = opts.find(o => label(o) === want)
      // 2) prefix match — source uses the SHORT form, ClickUp option is the LONG form.
      //    e.g. source "fee simple" → option "fee simple interest"; "market value" → "market value as is".
      //    Pick the SHORTEST option that starts with `want` (most specific extension of the source value),
      //    so "market value" lands on "market value as is" rather than a longer variant.
      if (!hit && want) {
        const prefixHits = opts.filter(o => label(o).startsWith(want))
        if (prefixHits.length) {
          hit = prefixHits.reduce((a, b) => (label(a).length <= label(b).length ? a : b))
        }
      }
      // 3) reverse prefix — source is the LONG form, option is the SHORT form (rarer, but symmetric).
      if (!hit && want) {
        hit = opts.find(o => label(o) && want.startsWith(label(o)))
      }
      // 4) significant-word overlap — handles mismatches like "on completion" ↔ "upon completion"
      //    where neither string is a prefix of the other.
      //    4a) Multi-word: find the option sharing the most words (≥3 chars) with the source
      //        (must share ≥2 words to qualify — avoids false positives).
      //    4b) Single long-word: if source has exactly 1 word ≥5 chars and it appears in only
      //        one option, use that option (e.g. "on completion" → "upon completion").
      if (!hit && want) {
        const wantWords = new Set(want.split(/\s+/).filter(w => w.length >= 3))
        if (wantWords.size >= 2) {
          // 4a) multi-word overlap
          let bestCount = 1
          let bestOpt: typeof opts[0] | undefined
          for (const o of opts) {
            const oWords = label(o).split(/\s+/).filter(w => w.length >= 3)
            const shared = oWords.filter(w => wantWords.has(w)).length
            if (shared > bestCount) { bestCount = shared; bestOpt = o }
          }
          if (bestOpt) hit = bestOpt
        } else {
          // 4b) single long-word match (≥5 chars) — e.g. "completion" → "upon completion"
          const longWords = Array.from(wantWords).filter(w => w.length >= 5)
          if (longWords.length === 1) {
            const lw = longWords[0]
            const candidates = opts.filter(o => label(o).split(/\s+/).includes(lw))
            if (candidates.length === 1) hit = candidates[0] // unambiguous single match only
          }
        }
      }
      return hit ? hit.id : null // still no match → SKIP (taxonomy mismatch — report as field-config gap)
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
export function buildHubCustomFields(job: any, listFields: ClickUpFieldDef[]): Array<{ id: string; value: any; name: string }> {
  const byName = new Map(listFields.map(f => [f.name, f]))
  const values = hubValueMap(job)
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
export function hubFieldsMissingColumns(job: any, listFields: ClickUpFieldDef[]): string[] {
  const have = new Set(listFields.map(f => f.name))
  return Object.keys(hubValueMap(job)).filter(name => !have.has(name))
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
      const resp = await fetch(`https://api.clickup.com/api/v2/task/${taskId}/field/${f.id}`, {
        method: 'POST',
        headers: { 'Authorization': token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: f.value }),
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
        // dropdown live value is the option id; date/number/string compare loosely
        if (v !== undefined && v !== null && String(v) === String(f.value)) verified++
      }
    }
  } catch (e) {
    console.warn('custom-field readback failed (non-fatal):', (e as any)?.message || e)
  }

  console.log(`🔁 custom fields: set=${set} failed=${failed} verified=${verified}/${fields.length}`)
  return { set, failed, verified, total: fields.length }
}
