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
// (Asset Condition, Client Phone, Property Contact*, Valuation Premise, Status of Improvements were
// missing). REMOVED noise: Intended Use (dup of Authorized Use), Client Title, Client Address, Job Status,
// Additional Info. QA_PROBE_DELETE_ME is a stray ClickUp test field the API CANNOT delete — flag for
// manual removal in the ClickUp UI; do not fight the API. byName resolver SKIPS any field not yet on the
// list, so the 7 ADD fields self-populate the moment their defs exist (create in the UI or via API).
function hubValueMap(job: any): Record<string, any> {
  const loe = (Array.isArray(job.job_loe_details) ? job.job_loe_details[0] : job.job_loe_details) || {}
  const pi = (Array.isArray(job.job_property_info) ? job.job_property_info[0] : job.job_property_info) || {}
  const propContact = [job.property_contact_first_name, job.property_contact_last_name].filter(Boolean).join(' ')
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
    'Authorized Use': loe.authorized_use || job.intended_use || '',         // canonical (replaces Intended Use dup)
    'Asset Condition': job.asset_condition || pi.asset_condition || '',
    'Valuation Premise': loe.valuation_premises || job.valuation_premises || '',
    // PROPERTY CONTACT
    'Property Contact Name': propContact,
    'Property Contact Email': job.property_contact_email || '',
    'Property Contact Phone': job.property_contact_phone || '',
    // ASSIGNMENT
    'Property Rights Appraised': loe.property_rights_appraised || '',
    'Scope of Work': loe.scope_of_work || '',
    'Report Type': loe.report_type || '',
    'Status of Improvements': pi.status_of_improvements || '',
    // FINANCIAL
    'Appraisal Fee': loe.appraisal_fee ?? '',
    'Retainer': loe.retainer_amount ?? '',
    'Delivery Date': loe.delivery_date || '',
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
      const hit = opts.find(o => String(o.label ?? o.name ?? '').trim().toLowerCase() === want)
      return hit ? hit.id : null // no live option matches → SKIP (HOLD dropdowns self-resolve once aligned)
    }
    case 'date': {
      const n = typeof raw === 'number' ? raw : Date.parse(String(raw))
      return Number.isFinite(n) ? n : null // ClickUp wants unix ms
    }
    case 'currency': {
      const n = Number(String(raw).replace(/[^0-9.]/g, ''))
      return Number.isFinite(n) ? n : null // dollars
    }
    case 'phone': // E.164 — no phone in KEEP set, but encode defensively if added
      return String(raw).trim()
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
