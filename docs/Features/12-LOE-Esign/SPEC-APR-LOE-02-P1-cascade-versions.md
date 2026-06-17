---
id: spec-apr-loe-02-p1
title: "SPEC-APR-LOE-02 Part 1 — Cascade Versions Saved on a Job (the crux) + Contact-Block Lock"
status: spec-for-gate
created: 2026-06-15
updated: 2026-06-15
revision: 2 (closes QA spec-gate REVISE; adds contact-block lock pre-fix)
type: build-spec
owner: co-architect (author) · qa-agent (spec gate + build-verify) · Ben (drives as real user)
parent_prd: ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/PRD-APR-LOE-02.md
prd_series: LOE / client-contract lifecycle
prd_seq: 2
part: 1 of 3
tags: [apr-workflow, loe, cascade-versions, loeCascade, value-scenarios, job-contracts, edited-html, save-draft, content-diff, contact-block-lock, build-spec, prd]
keywords: [cascade picker, value scenarios, deriveValueScenarios, job_contracts, edited_html, draft, content diff, Section 10, locked contact block, return to contact record]
---

**Tags:** #apr-workflow #loe #cascade-versions #loeCascade #value-scenarios #job-contracts #contact-block-lock #build-spec #prd
**Entities:** [[PRD-APR-LOE-02]] [[Cascade-Logic]] [[LOE E-Sign Feature]] [[job_contracts]]

> **📑 Part 1 of 3 — spec for the crux of [PRD-APR-LOE-02](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/PRD-APR-LOE-02.md).** Parts 2 (send→sign→status) and 3 (storage/payment, discuss) come after this passes + builds. NO send/sign in this part.

**↑ Parent PRD:** [PRD-APR-LOE-02 — LOE Series, Part 2](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/PRD-APR-LOE-02.md)

# SPEC — Part 1: Cascade Versions + Contact-Block Lock

> **Revision 2 changelog (closes QA spec-gate REVISE):** divergence table rewritten with VERBATIM `STATUS_TO_SCENARIOS` enum keys + collapse-pairs made explicit (gap 1); reopen proof step added (gap 2); saved-versions surface CONFIRMED to read `job_contracts` (gap 3); Authorized Use input path resolved — it's on Client Intake, not the picker (gap 4); per-version label requirement added (gap 5); save-failure-must-surface fence added (gap 6). Test job = **the existing test job** (Ben's call — no new job needed; fresh-Valcre-job is its own separate test). **NEW: contact-block lock pre-fix** (section A below).

---

## A. PRE-FIX — Lock the client contact block (do this first)

**The bug Ben found:** opening an already-created LOE, the cover-letter **recipient/contact block** renders as a run-on — name, company, address, phone, email jammed into one line, structure gone. It's the **only** section that mangles; every other editable section is plain prose and formats fine.

**Why it's the only one:** the contact block is **structured mapped data** (5 fields from the client record), not freeform prose. Editing a paragraph to add a client note is the real purpose of editability; editing sensitive client contact details is a **different situation** — it belongs at the source record, not inline in the document.

**⚑ CONFIRMED ROOT CAUSE (Ben repro + code-traced 2026-06-15):** it is an **edit-mode HTML parsing** bug, NOT the template or saved data. A fresh LOE renders the contact block correctly in the preview; the instant Edit is pressed it flattens. Cause: `templateParser.ts` runs **`stripHTMLTags()`** on section content when breaking the document into editable fields — the contact block's multi-line `<div>` structure (company-line / address-line, etc.) gets its tags stripped → collapses to one run-on line; reconstruct can't recover the breaks. **The lock fix cures it precisely:** if the contact block is excluded from the editable-sections parse (locked, rendered from the record), it never hits `stripHTMLTags()` and never flattens.

**The fix (no toggle — Ben's decision):**
- The client contact block is **read-only** in the document editor. It always **renders pre-structured from the client record**, one item per line, every time:
  - `[First Last], [Title]`
  - `[Company]`
  - `[Street, City, Prov Postal]`
  - `[Phone]`
  - `[Email]`
- It is **visible** on the document (so you see it in place, side-by-side context) but **not inline-editable**.
- **Clicking it routes to the client contact record** ("return to contact record" affordance) — you change contact details at the source, where they're authoritative. Change-here-not-there = data drift; routing to the record prevents it.
- **This also kills the formatting bug outright** — never freeform-editable means it can't get mangled. Single source of truth; the document just displays it.

**Scope fence:** lock applies to the **client contact block only**. All other editable sections (prose paragraphs, notes) stay editable exactly as they are — no toggle, no broader lock.

**Diagnosis to confirm during build (open question from Ben):** is the run-on on **every** LOE, or only already-created/edited ones? Ben observed it on an *already-created* LOE — a fresh `Create Contract` may render clean. The builder confirms whether fresh LOEs are also affected; either way the lock fix makes the block render from the record, so it's structured regardless.

**Proof:** open an LOE → contact block renders one-item-per-line from the client record → it is not inline-editable → clicking it routes to the client contact record. **Any draft created or edited AFTER the fix** cannot show a run-on contact block.

**Folds from QA re-gate (Part A → PASS):**
- **A1 — no retro-heal.** The fix stops NEW flattening but does NOT repair a draft already SAVED while flattened (its frozen `edited_html` keeps the run-on). So the guarantee is scoped to drafts created/edited after the fix. Pre-flight: confirm the test job has no pre-flattened drafts (or discard/regenerate them) before the version test, so a stale run-on isn't mistaken for a fix failure.
- **A2 — guarded navigation (real guardrail).** Clicking the contact block routes to the client contact record — it must NOT silently discard unsaved edits elsewhere in the open document. Fence it: warn / autosave / guarded nav before leaving.
- **A3 — graceful empty fields.** A mapped field with no value (no company, no phone) must render gracefully — **omit that line entirely**, never print `undefined`, a blank bullet, or an empty line.

**Open formatting decision (Ben, pending his pick — does NOT block the gate):** the address prints on one line because the client record stores it as a single combined field (`[client.addressstreet]` = "2399 Pine Place, Calgary, AB T2X 1Y6"). To break at the city (match VALTA letterhead), either (a) split the address string at the city at display time, or (b) store street + city/postal as separate parts on the client record. Decide here since the locked block renders from the record. Recommendation: lock first (cures the mangling); treat the city-line break as a small follow-on refinement.

---

## B. The cascade crux (the main work)

### The one goal

Using the **cascade picker**, make **4–5 genuinely different LOE versions** on the existing test job, **save each as a DRAFT** (no send), and **prove** the cascade picker actually changed the document — by a **content-diff of the saved `edited_html`**, not by eye.

### Key Result + proof

- **KR-P1 — Several distinct LOE versions persist as drafts on one job; the cascade picker provably drove the difference.**
  - **Prove:** a live job link → the saved-versions list shows the distinct draft rows → open two → a **content-diff of the saved `edited_html` shows the cascade-derived Section 10 (Value Scenarios + narratives) actually differs.** NOT "looks different."

---

## C. Ground truth (verified against code this session)

**Save path — `job_contracts` (`src/utils/loe/jobContracts.ts`):**
- `ContractState = 'draft' | 'saved' | 'sent'`. Each version = one `job_contracts` row at state `'draft'`.
- `saveJobContract()` = **insert when no `id`** (new version) / **update when `id` present** (overwrite same version).
- **⚑ The overwrite trap (real-user flow):** in `LoeQuoteSection.tsx` / `LOEPreviewModal.tsx`, the FIRST `Save Draft` inserts (no id) and then **captures the returned id** — so a SECOND `Save Draft` on the same open contract **updates that row**, not a new one. To make a new version the user must press **`Create Contract`** fresh (new instance, no id). Reopen + Save Draft = edits that one version.
- `template_version` column exists (gap 5 uses it for labeling).

**Saved-versions surface — CONFIRMED reads `job_contracts` (closes gap 3):** `LoeQuoteSection.tsx:155` → `loadJobContracts(job.id).then(setSavedContracts)`; `loadJobContracts()` does `from('job_contracts').select('*')` for the job. So saved drafts DO render in the list. No new wiring needed for "Ben sees them listed."

**Reopen path — CONFIRMED loads saved html (supports gap 2):** `LOEPreviewModal.tsx:91` — "Show exactly what was saved" — reopen binds to the row's `edited_html` rather than regenerating. Gap-2 proof step verifies it loads the correct row.

**Cascade engine — `src/utils/loe/loeCascade.ts`** (Group 2 "Value Scenarios" is the LIVE, proven half; Approaches + Property Rights are PLANNED/unwired — out of scope):
- `deriveValueScenarios(statusOfImprovements, authorizedUse)` → scenario list from `STATUS_TO_SCENARIOS`.
- Authorized Use containing "insurance" **overrides** → single scenario `Insurable Replacement Cost`.
- **Authorized Use input lives on Client Intake, NOT the cascade picker (closes gap 4):** the picker (`LoeQuoteSectionIndependent.tsx`) surfaces only **Status of Improvements**; `authorizedUse` is read from `jd.authorizedUse || job.intendedUse` (set on `ClientSubmissionSection.tsx` "Authorized Use" field). So version #5 IS reproducible by a real user — by setting **Authorized Use = Insurance on Client Intake**, not in the picker. The 4 Status-driven rows alone fully prove the crux; #5 is the override bonus via the intake field.

### ⚑ Divergence table — VERBATIM enum keys (closes gap 1)

Exact `STATUS_TO_SCENARIOS` keys from `loeCascade.ts`, with collapse-pairs made explicit. **Pick ONE row per distinct output** (rows that share an output are a collapse pair → would false-fail the crux):

| Use as version | VERBATIM Status-of-Improvements key | → Value Scenarios output | Collapses with |
|---|---|---|---|
| **v1** | `Improved - Completed` | `As Stabilized` | `Improved - Renovated` (DON'T use both) |
| **v2** | `Improved - Under Renovation` | `As-Is` + `As If Complete & Stabilized` | `Improved - Proposed Renovation` (DON'T use both) |
| **v3** | `Proposed - Vacant Land` | `As Is Vacant Land` + `As If Complete & Stabilized` | — (unique) |
| **v4** | `Proposed - Under Construction` | `As If Vacant Land` + `As If Complete & Stabilized` | `Proposed - Improved Land (Demolition Required)` (DON'T use both) |
| **v5** (bonus) | (any status) + **Authorized Use = Insurance** on Client Intake | `Insurable Replacement Cost` (override) | — (override path) |

> **DON'T mix a row with its collapse partner.** `Improved - Completed` and `Improved - Renovated` both → `As Stabilized` (identical Section 10 → false-fail). Note `As Is Vacant Land` (v3) ≠ `As If Vacant Land` (v4) — genuinely different first scenario. v1–v4 are confirmed-distinct outputs.

---

## D. Build scope

1. **Contact-block lock** (section A) — read-only, renders from client record, click → return to contact record.
2. **Save-as-new-version** — confirm each new version is a fresh `Create Contract` (no id → insert), landing as a separate `job_contracts` draft row; no overwrite, no dup.
3. **Per-version label (closes gap 5)** — each saved version gets a distinguishing label (e.g. the Status pick that made it) via `template_version`/label so the list is readable, not 5 indistinguishable rows.
4. **Save-failure must surface (closes gap 6)** — the save-draft caller must SURFACE a failed insert (toast/error/throw), not report success on a no-op. (PRD-LOE-01's bug was a *swallowed* error, not just a denied one.)
5. **Cascade reversibility** — `cascadeResetToken` / Fill-Clear un-does a Value-Scenario lock, so a wrong pick mid-version-making is never a dead end.

## E. Proof procedure (how QA verifies)

1. On the **existing test job**, create v1–v4 from the divergence table, each a fresh `Create Contract` → pick Status → `Save Draft`. (v5 optional via Authorized Use = Insurance on intake.)
2. Query `job_contracts` for that job → **4–5 distinct draft rows**, distinct ids, none overwritten, each with a distinguishing label.
3. **Content-diff** the `edited_html` of two rows (e.g. v1 vs v3) → the **Section 10 Value-Scenario block + narrative differs**.
4. **Isolate the cascade-derived Section 10** in the diff — prove the *cascade* caused the change, not an incidental manual edit (diff the Section-10 region specifically, or generate versions with no manual edits so any delta is cascade-attributable).
5. **Reopen check (closes gap 2)** — click a saved version in the list → confirm the editor loads THAT row's `edited_html` (match a known-distinct Section-10 string from that specific version), not the latest/blank/wrong row.
6. **Contact-block check (section A)** — contact block renders one-item-per-line from the record, is not inline-editable, clicking routes to the contact record.

## F. Fences

- **RLS + surfaced-failure:** confirm `job_contracts` insert is visible to the anon app identity (RLS off / correct policy) AND that a failed insert surfaces (gap 6). Verify AS the app's real runtime identity (anon) — the PRD-LOE-01 lesson. Silent save-fail here = the known `docuseal-loe-save-fail` issue.
- **No send / sign / email** this part (Part 2). SharePoint / payment (Part 3). Approaches + Property Rights cascade (PLANNED, unrelated). Email editing (shipped PRD-LOE-01).
- **Test job + bc@crowestudio.com only**; no production client.

## G. KR3 carry-note (Part 2)
Part 2 will need a **visible `job_status` UI surface** on the job — flagged so it's not a surprise. Not built in Part 1.

---

## Entry files (for the builder)

- `src/utils/loe/loeCascade.ts` — cascade engine (`deriveValueScenarios`, `STATUS_TO_SCENARIOS`).
- `src/utils/loe/generateLOE.ts` — Section 10 token fill (`resolveNarrative`); recipient tokens L90-94.
- `src/utils/loe/v4Template.ts` (+ v3/v5) — `company-line` / `address-line` recipient block (the contact block to lock).
- `src/utils/loe/jobContracts.ts` — `job_contracts` save/load (`saveJobContract`, `loadJobContracts`, draft state).
- `src/components/dashboard/job-details/LoeQuoteSection.tsx` + `LoeQuoteSectionIndependent.tsx` + `actions/LOEPreviewModal.tsx` — picker UI, Create Contract / Save Draft, versions list, reopen.
- `src/components/dashboard/job-details/ClientSubmissionSection.tsx` — Authorized Use field (for v5) + client contact record (lock routes here).

---

*Revision 2 for QA `/review-gate` spec-mode re-review — each gap closure mapped to its original hole. On PASS → Assembly Prompt → prompt-gate → forked builder.*
