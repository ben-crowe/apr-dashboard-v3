# Wiring Spec — Intake → Job → ClickUp auto-chain (current state + fixes)

**By:** qa-agent · 2026-06-04 · verified LIVE against prod (Supabase `ngovnamnjmexdpjtcnky` + ClickUp test list 901706896375).
**For:** react-specialist (the fixes). qa = verification only.
**Method:** read the DB trigger + edge-fn code, then drove a controlled test (inserted a marked `job_submissions` row → watched the chain → cleaned up).

---

## The intended 4-stage chain
1. **Stage 1** — intake form → `job_submissions` INSERT → DB trigger fires `create-clickup-task` → ClickUp task created + `clickup_task_id`/`url` saved back to the job.
2. **Stage 2** — Valcre job created / LOE details filled → adds the LOE Quote section to the **same** task.
3. **Stage 2.5** — DocuSeal LOE sent → "▸ LOE Sent" timestamp.
4. **Stage 3** — DocuSeal LOE signed → "▸ LOE Signed" timestamp + signer.

---

## Verified current state

| Stage | Status | Evidence |
|---|---|---|
| **1 — auto-create on intake** | ✅ **WIRED + WORKING** | DB trigger `auto_create_clickup_task` (AFTER INSERT on `job_submissions`) → fn `trigger_clickup_task_creation` → `net.http_post` to `create-clickup-task`. Live test: inserted a `job_submissions` row → within 10s `clickup_task_id` auto-populated (`86e1qk3gt`), card created with correct intake data + dashboard backlink. |
| **2 — update same task** | ❌ **BROKEN — 401** | `update-clickup-task` returns `{success:false, error:"Failed to fetch ClickUp task: 401"}`. It reads a **per-workspace OAuth token from the DB** (not the env secret), and that token is stale/expired → dies at the fetch step. So no LOE Quote section, no Valcre job number on the card. |
| **2.5 / 3 — DocuSeal tracker** | ⏸️ untested | "▸ LOE Sent / Signed" lines are blank scaffold; fill on real DocuSeal events. No LOE e-signed yet. |

### Two more findings
- **Client-side auto-creation was removed** (`useFormSubmission.ts:235-241`, "ClickUp task creation disabled… workflow is now Supabase → Valcre → ClickUp"). **That's fine** — the **DB trigger** is the real Stage-1 mechanism and it works. Don't re-add client-side creation; it would double-create.
- **The documented "Stage 2 creates a NEW task instead of updating" bug is NOT the current failure** — Stage 2 now 401s at the auth/fetch step *before* any create-vs-update logic runs. Fix the 401 first, then re-verify whether the duplicate bug resurfaces.

### Custom fields
- Card data lives in the **markdown description only**. ClickUp **structured custom fields = 0 populated** (the edge fn sends no `custom_fields` array). Separate roadmap (was ~7/48 on prod board; expand later).

---

## Exact fixes for react-spec

1. **Stage-2 401 (CRITICAL — blocks all post-intake sync).** `update-clickup-task` fetches a stale per-workspace **OAuth** token from the DB. Fix: either refresh/repair that DB OAuth token, **or** make `update-clickup-task` read the same env secret `CLICKUP_API_TOKEN` that `create-clickup-task` uses (create works; update doesn't — make them consistent). Re-verify: change a field → Stage-2 runs → card gets the LOE Quote section + Valcre number, on the SAME task (no duplicate).
2. **Going-forward sync trigger.** Today ClickUp only updates via the "Create Valcre Job" action (`LoeQuoteSection.tsx:339`). Per-field edits sync to Valcre but **not** ClickUp. **Decision (Ben):** should per-field job-prep edits also push to the ClickUp card? If yes, add a ClickUp update to the `autoSaveField` path (or debounce a Stage-2 refresh).
3. **Trigger hardening (low pri).** `trigger_clickup_task_creation` hardcodes the anon key as Bearer — works, but should read from Vault per the function's own comment. Not urgent (Stage-1 works).
4. **Custom fields (separate roadmap).** Wire a `custom_fields` array into the edge fns to populate ClickUp's structured fields (currently description-only).

---

## Net
Intake → job → ClickUp **task creation is solid** (trigger verified live). The break is **Stage-2 auth (401)** — fix that and the going-forward sync (LOE Quote section + Valcre number + per-field decision) follows. Custom-field population is a separate later piece.

---

## NEXT — card date fields + Valcre number mapping (Ben, 2026-06-04)

These are the remaining ClickUp-card mappings to verify + wire (after the Stage-2 token fix + per-field card sync). Tied to the documented Stage 2.5 / Stage 3 (DocuSeal events).

1. **LOE Sent date** (card) ← DocuSeal **LOE-sent** event (Stage 2.5). Migration applied, NOT yet tested with a real DocuSeal send.
2. **LOE Signed date** (card) ← DocuSeal **signed** event (Stage 3). Migration applied, NOT yet tested with a real DocuSeal signing. The DocuSeal webhook stamps the signed date + signer name.
3. **Date Received** (card) — assumed intake/submission date (stamped when the job comes in). CONFIRM with Ben whether this is intake-side or signing-driven.
4. **Valcre Job Number** → maps into the **2nd field under "New Appraisal Request"** on the card. Confirm the exact card field + wire it.

**Test to run:** enter a signed date on the dashboard → confirm it flows to the ClickUp card. Note: real DocuSeal signing ALSO sets a sign-date via webhook — verify the two sources don't conflict (dashboard-entered vs webhook-stamped).

**Owner:** QA verifies current state (does Stage 2.5/3 fire? does Valcre number land in the right card field?) → react-spec wires the DocuSeal date stamps + Valcre-number placement.
