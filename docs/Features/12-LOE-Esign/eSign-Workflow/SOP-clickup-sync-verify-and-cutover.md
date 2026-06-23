---
title: "SOP — ClickUp Sync: Verify, Gap-Fix & Cutover (reusable agent instructions)"
status: living
created: 2026-06-21
updated: 2026-06-21
last_reviewed: 2026-06-21
description: "Reusable, agent-followable SOP for wiring + verifying the APR dashboard→ClickUp field sync against a target card — BC-first, then re-point to Valta as config only. Drives the operator's real logged-in Chrome via OpenCLI (no API token). Doubles as the co-arch→agent dispatch brief."
owner: qa-agent (executor + gate) · co-architect (dispatch + spec)
tags: [apr-workflow, clickup, sync, cutover, valta, opencli, browser-use, agent-sop, qa-gate, dispatch-brief]
entities: [[ClickUp]] [[Valta workspace]] [[OpenCLI]] [[Browser Use]]
related:
  - "~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/MIGRATION-PLAYBOOK-clickup-to-valta.md"
  - "~/Development/00-Systems-Management/CLI-Libraries/browser-automation-findings.md"
cognee_ingest: skip
gemini_ingest: skip
gemini_store: ""
---

# SOP — ClickUp Sync: Verify, Gap-Fix & Cutover

**Tags:** #apr-workflow #clickup #sync #cutover #valta #opencli #agent-sop #qa-gate #dispatch-brief
**Entities:** [[ClickUp]] [[Valta workspace]] [[OpenCLI]] [[Browser Use]]
**Companion:** [Migration Playbook](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/MIGRATION-PLAYBOOK-clickup-to-valta.md) (the WHY + cross-account theory) · [Browser-Automation Findings](~/Development/00-Systems-Management/CLI-Libraries/browser-automation-findings.md) (the tool ground-truth)

> **What this is.** A step-by-step an agent can execute end-to-end to prove the dashboard→ClickUp field sync works on a target card, fix the real gaps, and re-point it to a new workspace. Written second-person so it reads as instructions. The playbook above is the strategy; **this is the runbook.**
>
> **The one-line model.** Wire + prove it in Ben's **BC** workspace first. Because the resolver matches ClickUp fields **by name at runtime**, re-pointing to **Valta** is config only — *zero code change* — provided Valta's field names match. So the work is 90% verification, 10% gap-fix.

---

## When to use this SOP

- Proving the dashboard→ClickUp sync lands correctly on a specific card.
- Diagnosing why a field "isn't syncing" (almost always a name/option mismatch, not a code bug).
- Cutting the sync over from one ClickUp workspace/list to another.

**Do NOT use it for:** building new dashboard features, ClickUp field *definition* admin (that's UI-only / the internal-endpoint path — see the playbook's gotcha section).

---

## Ground truth — the wiring as it stands (verify, don't trust this doc)

Re-read these at runtime; they drift. Confirm against the live code before acting.

- **Resolver** — `supabase/functions/_shared/clickup-fields.ts`. Matches by **field NAME** (stable) → id (per-list) at runtime. Any field absent on the target list, or a dropdown value with no matching option label, is **silently SKIPPED by design.**
- **Create path** — `supabase/functions/create-clickup-task/index.ts`. Pinned to the BC test list (full-schema mirror). List id is `CLICKUP_LIST_ID` env → hardcoded fallback.
- **Update path** — `supabase/functions/update-clickup-task/index.ts`. Follows the task's own `list.id` dynamically.
- **Target card (BC):** `VALTA JOBS - Temp V2` (the 39-field mirror).
- **Governing rule (Ben):** the ClickUp mirror's fields + dropdown options are the client's source of truth. **We never add fields/options to ClickUp from code.** A dashboard value with no matching field/option simply doesn't sync.

---

## Tools — what to drive with (and the traps)

| Need | Tool | Command shape | Trap |
|---|---|---|---|
| Read the real ClickUp card (no token) | **OpenCLI** on Ben's logged-in Chrome | `opencli browser <session> open <url>` / `... get title` | First positional arg is the **session** (`mvb399jv`), not the command. Bare `opencli browser open` errors. |
| Drive an open-ended web step | **Browser Use** | `browser-use open <url>` → `state` → `screenshot` | Session is sticky — `browser-use close` before re-passing `--cdp-url`. Skip the cloud `api_key` (paid, optional). |
| Trigger the sync the way the app does | invoke the **edge function** | it reads the token from **Supabase secrets** at runtime | The token hardcoded in source is DEAD. Never test with it. |
| Screenshot a rendered page for the gate | `agent-browser` | `agent-browser open <url>` + `agent-browser screenshot` | APR dev port is **8086**, not 5173. Headless only. |

**Pre-flight every session:** `export PATH="$HOME/.local/bin:$HOME/.npm-global/bin:$PATH"` then `opencli doctor` (expect profile `mvb399jv` connected). This is the no-token unlock — OpenCLI reads the card from Ben's real session.

---

## The phases

### Phase A — Gap-find (READ-ONLY, no code) → produces the truth table

1. Confirm OpenCLI green + the target card URL.
2. Pick or create ONE dashboard job that has data in every section.
3. Trigger the sync (create-clickup-task) for that job.
4. **Four-layer read-back** (Rule 1 — never conclude from one layer):
   - **API/function** — function response + logs: which fields it *attempted*, which it *skipped*.
   - **ClickUp card** — drive Ben's Chrome via OpenCLI to the card; read each field's actual value.
   - **Resolver source** — confirm the KEEP-set name for any field that didn't land.
   - **Control** — compare against a field you KNOW maps, to isolate dispatch vs. mapping.
5. **Deliverable = the truth table.** Every target-card field classified:

   | Field | Dashboard source | Result | Class |
   |---|---|---|---|
   | (name) | (db column) | landed / skipped / wrong | **MAPPED-OK** / **SKIP-BY-DESIGN** (manual ops field) / **REAL-MISMATCH** (name or option) |

   Only **REAL-MISMATCH** rows become Phase B work. SKIP-BY-DESIGN (Work Phase, Phase Owner, Invoice Paid, TTSZ Done, Template/Photos Saved, Comps Provided, Task Type, Client Info Received, etc.) stay hand-filled — confirm with Ben once, then leave them.

### Phase B — Close the real gaps (CODE — minimal)

- For each REAL-MISMATCH: fix the **resolver KEEP-set name** to match the live card (e.g. `Received Date` → `Inspection Date`), or fix the dropdown value to match a live option label.
- **No new ClickUp fields/options** (governing rule). If the dashboard owns data the card has no field for, that's a Ben decision (add on the ClickUp side), not a code change.
- `npm run build` clean before deploy. Deploy the edge function. Re-run Phase A read-back on the changed fields only.

### Phase C — End-to-end proof (GATE — me)

Fresh job → intake → job create → full field push → **status-tag pipeline** `new arrival → loe sent → loe signed → awaiting payment → paid` → LOE send → sign → confirm the signed-trigger **swaps the tag** and the card updates. Screenshot the card. "It renders" ≠ "it works" — drive it and compare.

### Phase D — Re-point to Valta (CONFIG ONLY — zero code)

1. **Name-parity audit FIRST** — list Valta's field names, diff against the BC mirror KEEP-set. Any name that differs = a silent skip on Valta. This is the whole risk surface.
2. Point create/update at the Valta list id + fresh Valta token (Supabase secret).
3. Recreate the app's ClickUp **webhook** in Valta; re-point DocuSeal / Resend / QuickBooks IDs (these do NOT carry — see playbook).
4. Re-run Phase C against Valta. Proof-first close.

---

## Gates (non-negotiable — from the QA Iron Laws)

- **Four-layer before any FAIL** (Rule 1). API-said-ok ≠ it-worked. Read state + card + source + control before concluding. A FAIL report **names the broken line** (file:line + why + fix), never just "doesn't work."
- **Verification fresh this turn.** No PASS without a proving read-back run THIS turn on the real path.
- **Screenshot the card** before any "done." Pixels are the only proof of what the user sees.
- **Stop at 3 attempts** on the same defect — escalate, never attempt #4.

## Definition of done

- [ ] Truth table produced; REAL-MISMATCH rows isolated from SKIP-BY-DESIGN.
- [ ] Every REAL-MISMATCH fixed in the resolver; build clean; deployed.
- [ ] One job synced end-to-end on BC: all owned fields land; tag pipeline swaps on sign; card screenshotted.
- [ ] Ben confirmed the SKIP-BY-DESIGN ops fields stay hand-filled.
- [ ] (Cutover) Valta name-parity audited; list/token/webhook re-pointed; one signing proven on Valta.

---

## Co-arch → agent dispatch brief (paste-ready)

> Use this when co-arch dispatches an agent to run the SOP instead of me. Matches the WHY/SUSPICION/LAYERS/ACCEPTANCE frame.

```
TASK: Run Phase A of the ClickUp Sync SOP against card "VALTA JOBS - Temp V2".
DOC (read in full first): ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/SOP-clickup-sync-verify-and-cutover.md
ALSO READ: that project's CLAUDE.md (no-login app; dev port 8086) + the resolver clickup-fields.ts.

WHY: gates whether the dashboard→ClickUp sync is correct in BC before any Valta cutover.
SUSPICION (default): ok:true silent no-op — fields the function "sent" don't actually land because the name/option doesn't match the live card.
TOOLS: OpenCLI on the logged-in Chrome (no token) to read the card — pre-flight `opencli doctor`, session arg `mvb399jv` is FIRST positional. Do NOT use the dead in-code token.
LAYERS (all four, per SOP Phase A): function logs · live card values · resolver KEEP-set names · a known-good control field.
ACCEPTANCE: a complete truth table classifying every card field MAPPED-OK / SKIP-BY-DESIGN / REAL-MISMATCH. No code edits in Phase A.
ON FAIL/GAP: name the resolver line + the exact name/option mismatch + the one-line fix. Never return "it doesn't sync" alone.
RETURN: the truth table + the REAL-MISMATCH punch list. ≤1 screen.
```

---

*Authored 2026-06-21 by qa-agent — the executable runbook companion to the cross-workspace Migration Playbook. Reusable: lift the dispatch brief for any agent; lift Phases A/D for any logged-in-web-app data-sync verification.*
