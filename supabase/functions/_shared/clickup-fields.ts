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
// which makes the not-yet-added fields (Appraisal Fee, Received Date, LOE Sent, LOE Signed, Intended Use)
// self-resolve the moment they exist, no redeploy.
//
// KEEP set (spec 03-CLICKUP-JOB-HUB-SPEC.md — updated 2026-06-11):
// LINKS:   Job Number (short_text) · APR Dashboard Link (url) · Valcre Job Link (url)
// SUMMARY: Client First Name · Client Last Name · Client Organization · Client Email
//          Property Name · Property Address · Property Type (drop_down)
//          Report Type (drop_down) · Intended Use (drop_down ← authorized_use)
//          Property Rights (drop_down) · Scope of Work (short_text)
//          Payment Terms (drop_down) · Appraisal Fee (currency)
// DATES:   Delivery Date · Received Date · LOE Sent · LOE Signed
//
// REMOVE set (must NOT be pushed): Client Title, Client Phone, Client Address,
//   all Property Contact fields, Job Status, Asset Condition, Valuation Premises,
//   Additional Info/Notes, Property Subtype, Tenancy, Retainer, Status of Improvements,
//   Authorized Use (canonical key renamed to "Intended Use" per spec).

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

// Build the hub value map — EXACTLY the KEEP set from the spec.
// Sources: job_submissions (root), job_loe_details (loe), job_submissions.created_at (Received Date).
function hubValueMap(job: any, hubUrl?: string): Record<string, any> {
  const loe = (Array.isArray(job.job_loe_details) ? job.job_loe_details[0] : job.job_loe_details) || {}

  // ── LINKS ──────────────────────────────────────────────────────────────────
  // Job Number: job_number lives on job_loe_details per the Valcre sync path.
  const jobNumber = loe.job_number || job.job_number || ''

  // APR Dashboard Link: <hubUrl>/dashboard/job/<job.id>
  const base = hubUrl || 'https://apr-dashboard-v3.vercel.app'
  const aprDashboardLink = job.id ? `${base}/dashboard/job/${job.id}` : ''

  // Valcre Job Link: https://app.valcre.com/job/edit/<valcre_job_id>#job (skip if absent)
  const valcreJobId = loe.valcre_job_id || job.valcre_job_id || ''
  const valcreJobLink = valcreJobId ? `https://app.valcre.com/job/edit/${valcreJobId}#job` : ''

  // ── SUMMARY ────────────────────────────────────────────────────────────────
  const appraisalFee = loe.appraisal_fee ?? job.appraisal_fee ?? ''

  // ── DATES ─────────────────────────────────────────────────────────────────
  // Delivery Date: loe.delivery_date (ISO string → unix ms via encodeForField date handler)
  // Received Date: job.created_at (ISO string → unix ms)
  // LOE Sent:  loe.loe_sent_at (ISO string → unix ms, set by docuseal-webhook on send event)
  // LOE Signed: loe.signed_at  (ISO string → unix ms, set by docuseal-webhook on completion)

  return {
    // LINKS
    'Job Number': jobNumber,
    'APR Dashboard Link': aprDashboardLink,
    'Valcre Job Link': valcreJobLink,
    // SUMMARY — CLIENT
    'Client First Name': job.client_first_name || '',
    'Client Last Name': job.client_last_name || '',
    'Client Organization': job.client_organization || '',
    'Client Email': job.client_email || '',
    // SUMMARY — PROPERTY
    'Property Name': job.property_name || '',
    'Property Address': job.property_address || '',
    'Property Type': job.property_type || '',
    // SUMMARY — ASSIGNMENT
    'Report Type': loe.report_type || job.report_type || '',
    'Intended Use': loe.authorized_use || job.authorized_use || job.intended_use || '',
    'Property Rights Appraised': loe.property_rights_appraised || '',
    'Scope of Work': loe.scope_of_work || '',
    'Payment Terms': loe.payment_terms || '',
    'Appraisal Fee': appraisalFee,
    // DATES
    'Delivery Date': loe.delivery_date || '',
    'Received Date': job.created_at || '',
    'LOE Sent': loe.loe_sent_at || '',
    'LOE Signed': loe.signed_at || '',
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
