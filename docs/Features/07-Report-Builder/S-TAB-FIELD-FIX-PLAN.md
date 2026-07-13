# APR S-Tab Field — FIX PLAN

**Tags:** #apr #report-builder #s-tabs #field-registry #fix-plan
**Entities:** [[APR-Report-Builder]] [[fieldRegistry]] [[REGISTRY-DUP-ID-RULE]]

**Author:** co-architect · **Status:** ⛔ **SUPERSEDED — DO NOT BUILD FROM THIS DOCUMENT.**
**Superseded:** 2026-07-13 (co-architect, on qa's gate finding; every claim below re-verified against the code before this header was written).

---

## ⛔ WHY THIS IS SUPERSEDED — read before you touch anything

This plan carried the line *"Status: DRAFT … No code applied."* **That was false.** FIX 1–4 shipped and were committed while the doc still described them as pending. Building from it today would send you to edit fields that no longer exist and put a load-bearing field at risk of deletion.

**FIX 1–4 are DONE. Do not re-run them.**

| Fix | Shipped in | Verified today |
|---|---|---|
| FIX 1 — collapse `client-company` → `client-company-name` | `31e4413` | `grep -c 'id: "client-company"'` → **0** (the field is gone; registry changelog records the deletion). `client-company-name` → 1. |
| FIX 2 — derive `client-full-name`, drop the double-entry | `e3fde02`, `de5152e` | `client-full-name` → 1, and it is **load-bearing**. |
| FIX 3 — name-align labels to the V3 source | `d9c0e70` | applied |
| FIX 4 — map `status-of-improvements`; drop the stale `S3 - IMAGE MGT` string | — | `status-of-improvements` mapped in `useLoadJobIntoReport.ts`; `grep -c 'S3 - IMAGE MGT' reportBuilderStore.ts` → **0** |

**FIX 5 (V3 push + smart gap-fill) is the ONLY live item.** It is genuinely unbuilt, it is Ben-deferred, and it is NEW behaviour — so it needs its own spec and its own gate, not a leftover section of a finished document. Its two gate findings (save-before-pull, and UPDATE-never-INSERT) still stand and are still unbuilt. The route it depends on already exists (`/job/:jobId/report` → `JobReportRoute`).

### ☠️ The trap that made this dangerous, stated plainly

**FIX 2 below says "keep ONE representation per person — either the computed full-name OR first/last."** A builder reading that today could pick first/last and **delete `client-full-name`. Do not.** That side already won and the field is now load-bearing: it renders at real placeholder sites in the report template, and it is referenced in `EditPanel.tsx`, `HomeTabPanel.tsx`, `reportBuilderStore.ts`, `useLoadJobIntoReport.ts`, `v3OriginFields.ts` and `composeReportFields.ts`. Commit `de5152e` dropped `client-name` *because the report uses `client-full-name`*. The either/or wording never recorded which side won — that omission is the defect.

### Every line number below has DRIFTED — ignore them all

`client-company-name` L161→165 · `company-name` L474→471 · `client-full-name` L201→210 · `contact-full-name` L449→446.

This is exactly what `REGISTRY-DUP-ID-RULE.md`'s own non-negotiable #1 warns about: line refs drift, and a scoping map is never the final word. **Grep the registry live; never trust a line number in a doc.**

---

_Everything below this line is the original plan, kept verbatim for its reasoning and its classification work. It is a record, not an instruction._

---

## ⛔ HARD PRECONDITION (Ben-directed guardrail — runs BEFORE any consolidation)
Per **`docs/Features/08-Master-Field-Registry/REGISTRY-DUP-ID-RULE.md`**, classify EVERY same-id / same-concept candidate first:
- **SAME section (+ subsection) redundant** → genuinely duplicate → **consolidate.**
- **CROSS-section same-id** → intentional "enter once, surface everywhere / Managed-in-S1" share → **KEEP + reconcile only.**
- **SAME section, DIFFERENT subsection** → **REVIEW intent** — not an automatic collapse; verify it's redundant vs a distinct field before touching.

No field is consolidated until it's classified. Classification is shown per item below.

---

## KEEP — cross-section, do NOT touch (Audit Section 4, corrected)
These are by-design shares; deleting the 2nd def breaks the value-flow. **Reconcile label/type/options for consistency only:**
- `client-organization-address` L171 (client-intake) ↔ L2571 (cover, "Managed in S1") — qa already reconciled.
- `client-city` L181 ↔ L2581 · `client-province` L191 ↔ L2591 · `client-title` L151 ↔ L2611 (client-intake ↔ cover).
- `interest-appraised` L618 (loe-prep) ↔ L18647 (exec/contract-analysis).
Action: align reference instance's label/type/options to the capture instance. **No deletions.**

---

## THE FORWARD FIXES (sequenced; 4-file-sync impact named: fieldRegistry.ts · TestDataSet · Report-MF-template.html · EditPanel)

### FIX 1 — Company-name consolidation (SAME-section redundant → consolidate)
- **REVIEW-INTENT RESOLVED (2026-06-25):** `company-name` (L474) is subsection **company-info**, labelled "Company Name (Appraiser's Company)" — value "Valta Property Valuations Ltd." (TestDataSet1 L832); actively used in HomeTabPanel L263-264, store L6913, template (`{{company-name}}` ×4). **It is the APPRAISER's firm — a genuinely DISTINCT field, NOT a client-company duplicate. KEEP it, do NOT collapse.** (Guardrail catch: collapsing it would have merged the appraiser's company into the client's.)
- **Classified for collapse:** ONLY `client-company-name` (L161) + `client-company` (L222) — BOTH client-intake / client-info-intake = same subsection, both = the CLIENT's company → genuine dup.
- **Action:** collapse the two client-info-intake company fields to ONE canonical; standardize on **"organization"** per V3 source (`client_organization`). Keep the surviving id wired to the V3 mapping (hook L139-140).
- **4-file-sync:** registry (remove redundant def) · TestDataSet (drop dup value) · template (repoint `{{...}}` placeholder) · EditPanel (single input).
- **Proof:** registry has ONE company field in client-info-intake; Load Data fills it once; template renders it.

### FIX 2 — Full-name computed fields (SAME-subsection → decide one canonical)
- **Classified:** `client-full-name` (L201) + `contact-full-name` (L449) sit in the SAME subsection as their first/last fields → redundant-by-derivation.
- **Action:** keep ONE representation per person — either the computed full-name OR first/last + explicit derivation; do not carry both as independently-editable. (V3 provides first/last only — JobData L18-19 — so full-name is derived, not a source field.)
- **4-file-sync:** registry · TestDataSet · template placeholder · EditPanel.
- **Proof:** no double-entry of name; full-name value derives from first/last consistently.

### FIX 3 — Name-align to source (Audit Section 2)
- **Action:** reconcile registry id ↔ V3 source ↔ UI label name-to-name, OR document the intentional rename. Targets (all cite `useLoadJobIntoReport.ts`): `client-company-name`←`client_organization` (L139), `client-organization-address`←`client_address` (L143), `authorized-use`←`intended_use` (L210), contact-* ← `property_contact_*` (L246-261).
- **4-file-sync:** label changes touch registry + EditPanel + template; mapping stays in the hook.
- **Proof:** each S1/S2 field's name matches its source (or the rename is documented as intentional).

### FIX 4 — Wire the gap + purge stale label (Audit Section 5)
- **Action (a):** add a `fieldMappings` entry in `useLoadJobIntoReport.ts` for `status-of-improvements` (registry home EXISTS at L631; source on `job_loe_details`, interface L47; only the mapping is missing). **(b):** purge stale "S3 - IMAGE MGT" → "Client Documents" in `reportBuilderStore.ts` (L242-243).
- **4-file-sync:** (a) hook only (mapping) ; (b) store label only.
- **Proof:** loading a real job populates Status of Improvements; no "Image Mgt" string remains.

### FIX 5 — V3 PUSH + SMART GAP-FILL (Ben DECIDED — NEW behavior, spec-first → QA gate BEFORE code)
Two behaviors. **Reuse the existing bridge (`useLoadJobIntoReport`, jobId-triggered) + the planned `/dashboard/job/:jobId/report` route — do NOT rebuild the bridge.**

**5a — V3 PUSH ("Create Report"):**
- **TRIGGER:** a "Create Report" button on V3 (top menu or on the page), **enabled only AFTER the intake fields are filled** (enabled-when-filled guard).
- **⛔ SAVE→PULL ORDERING (gate finding — the bridge reads SAVED DB rows, not the live form):** `useLoadJobIntoReport` fetches `job_submissions`/`job_loe_details`/`job_property_info` by `jobId` (hook L300-334). So on press, the handler MUST **PERSIST the intake (save the edited values to job_submissions/loe/property) FIRST, then navigate + pull** — otherwise the bridge pulls the OLD/empty row and V4 shows stale/blank. Order = **save → confirm write → navigate(`/dashboard/job/:jobId/report`) → bridge pull**. (Alternative if scoped narrower: restrict 5a to already-saved jobs and SAY so explicitly — but the default is save-first.)
- **⛔ UPDATE-NOT-INSERT (gate finding — duplicate-row guardrail):** the button acts on an EXISTING job (holds the jobId). Persist = **UPDATE the existing job by `id`** (upsert keyed on `id`/`job_id`), **NEVER INSERT a new `job_submissions` row** — an insert = silent duplicate jobs + the bridge pulls the wrong row. PROOF: `job_submissions` row count unchanged after Create Report.
- **enabled-when-filled (defined):** button enables once client-first-name + client-last-name + client-email + property-address are present (mirrors the existing LOE gate's required set).
- **ON PRESS:** after the save confirms, opens the V4 report page directly (navigate to `/dashboard/job/:jobId/report`) and the push runs.
- **ROUTE-RENDER CHECK (minor):** confirm the BUTTON navigation to `/dashboard/job/:jobId/report` actually renders the report (route exists: Dashboard.tsx:113 `JobReportRoute`) and is NOT caught by the App.tsx:60 "no direct-URL access to V4 → NotFound" guard. Verify in-app nav renders, not NotFound.
- **VISIBLE MERGE:** the user WATCHES the data populate live, with the **DESTINATION TABS (S1/S2/S3 — whichever received data) OPEN/EXPANDED**, so they see exactly where each piece landed. (Not a silent background fill — the populate is on-screen + destination accordions auto-expanded.)
- **Wiring:** button → existing `useLoadJobIntoReport(jobId)` bridge via the report route. Connect, don't rebuild.
- **PROOF:** edit an intake field → press Create Report → the EDITED value shows in V4 (proves save→pull, not a stale row).

**5b — V4 TEST-DATA button = SMART GAP-FILL (never clobbers real data):**
- **S1/S2 EMPTY** → fill everything (full sample, current behavior).
- **S1/S2 already FILLED (real V3 data arrived)** → fill ONLY the fields that did NOT receive V3 data; leave every real value untouched. (Per-field conditional: skip if a real value is present.)
- **"is-filled" definition (minor — pin it so skip-logic is unambiguous):** a field counts as FILLED (→ skip, don't overwrite) if its value is a non-empty, non-whitespace string OR any real value; counts as EMPTY (→ fill) if `null`, `undefined`, `""`, or whitespace-only. The gap-fill writes ONLY to EMPTY fields.

- **Spec deliverables for the gate:** button label / placement / enabled-when-filled condition; open-V4-with-destination-tabs-expanded behavior; the visible live-merge; the per-field conditional gap-fill logic; the V3-push trigger.
- **4-file-sync + bridge touchpoints:** V3 dashboard (button + enabled-guard) · the report route (`/dashboard/job/:jobId/report`) · `useLoadJobIntoReport.ts` (bridge, reuse) · `TestInputDashboard.tsx` Load Data handler (conditional gap-fill) · the section-accordion expand state (auto-expand destination tabs).
- **ROUTE THE FIX 5 SPEC TO QA GATE BEFORE ANY CODE** (new logic).

---

## Sequence + gate
1. REVIEW-intent items resolved (company-name@notes-intake) → 2. FIX 1 → 3. FIX 2 → 4. FIX 3 → 5. FIX 4. FIX 5 deferred to Ben.
Each fix is its own small commit; `tsc` clean + the 4-file-sync verified per fix. **Route to QA(dev-9) gate with same-section-vs-cross-section as an explicit lens before any code.**
