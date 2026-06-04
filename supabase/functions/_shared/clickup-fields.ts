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

// The Job-Hub KEEP set: hub field NAME (must match ClickUp exactly) → value extractor over the joined
// job row (job_submissions.* + nested job_loe_details(*) + job_property_info(*)). Only the structured
// hub fields; REMOVE-set fields (Client Title/Phone/Address, Property Contact*, Job Status, Asset
// Condition, Valuation Premises, Additional Info) are intentionally NOT here.
function hubValueMap(job: any): Record<string, any> {
  const loe = (Array.isArray(job.job_loe_details) ? job.job_loe_details[0] : job.job_loe_details) || {}
  const hubUrl = 'https://apr-dashboard-v3.vercel.app'
  const valcreId = loe.valcre_job_id || job.valcre_job_id
  return {
    // Links
    'APR Dashboard Link': `${hubUrl}/dashboard/job/${job.id}`,
    'Valcre Job Link': valcreId ? `https://app.valcre.com/job/edit/${valcreId}#job` : '',
    // Job summary
    'Job Number': job.job_number || loe.job_number || '',
    'Client First Name': job.client_first_name || '',
    'Client Last Name': job.client_last_name || '',
    'Client Organization': job.client_organization || '',
    'Client Email': job.client_email || '',
    'Property Name': job.property_name || '',
    'Property Address': job.property_address || '',
    'Property Type': job.property_type || '',
    'Report Type': loe.report_type || '',                                   // HOLD — option-set align pending
    'Intended Use': loe.authorized_use || job.intended_use || '',           // HOLD — option-set align pending
    'Property Rights Appraised': loe.property_rights_appraised || '',
    'Scope of Work': loe.scope_of_work || '',
    'Payment Terms': loe.payment_terms || '',
    'Appraisal Fee': loe.appraisal_fee ?? '',                               // ADD pending on mirror
    // Status / dates
    'Delivery Date': loe.delivery_date || '',
    'Received Date': job.created_at || '',                                  // ADD pending
    'LOE Sent': loe.loe_sent_at || '',                                      // ADD pending
    'LOE Signed': loe.signed_at || loe.signed_date || '',                   // ADD pending
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
