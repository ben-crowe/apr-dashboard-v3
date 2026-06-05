---
content_type: master-dashboard
title: APR Dashboard — Master Navigation & Status
status: living front-door — keep current as work lands
updated: 2026-06-05
tags: [apr-workflow, apr-dashboard, master-index, navigation, home]
note: THE single front door. Open this first. Every active workflow, PRD, test doc, and reference links from here. As new docs get added, link them here so nothing scatters.
---

# APR Dashboard — Master Navigation & Status

**This is the front door.** One page that links to every current area. Open here, navigate out.
If you add a doc, add a link here.

> **Agents start here:** [01-AGENT-ACCESS-LOGIN-PRIMING](~/Development/APR-Dashboard-v3/docs/01-AGENT-ACCESS-LOGIN-PRIMING.md) — the single login/access/CLI/priming sheet for the APR Dashboard, ClickUp, Supabase, and Valcre. Load the skills, log in, drive — never a guess.
>
> **Reusable process Playbooks** (global, any project): [Playbook Library](~/.claude/knowledge/playbooks/00-PLAYBOOK-INDEX.md) — standalone "how we do this perfectly" sheets, searchable by `#playbook`. Includes the **Visual Data Verification (screenshot)** workflow and the **HTML Document Build** workflow. Each carries a cross-project session tally that primes the next run.

`#apr-workflow` `#apr-dashboard` `#master-index` — search any of these to surface the connected APR doc set.

_Last updated 2026-06-05. Supersedes the prior `APR-MASTER-DASHBOARD.md` (archived — was stale to April)._

---

## The Workflow (end to end) — and where each piece is documented

The product is a 4-stage appraisal pipeline. Here it is in order, each stage linked to its
detail doc:

| # | Stage | What happens | Detail doc |
|---|---|---|---|
| 1 | **Client Intake** | Client submits the request form → lands in Supabase | [Intake form field map](~/Development/APR-Dashboard-v3/tests/INTAKE-FORM-FIELDMAP-2026-06-03.md) |
| 2 | **Job Creation** | Auto-creates the Valcre job + ClickUp card + (planned) SharePoint folder | [Intake→ClickUp wiring spec](~/Development/APR-Dashboard-v3/tests/WIRING-SPEC-intake-clickup-chain-2026-06-04.md) · [Field routing](~/Development/APR-Dashboard-v3/docs/FIELD-ROUTING-dashboard-clickup-loe.md) |
| 2a | **Field Sync** | Dashboard fields push to Valcre (custom + native) + the ClickUp card | [PRD-A fields→Valcre](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/PRD-A-fields-to-valcre-mapping.md) · [Verified job-prep→Valcre map](~/Development/APR-Dashboard-v3/tests/MAP-jobprep-to-valcre-VERIFIED-2026-06-03.md) |
| 2b | **Asset Storage** | Per-job SharePoint folder (client home) + Supabase image buckets (app pipeline) | [Asset storage + SharePoint](~/Development/APR-Dashboard-v3/docs/Features/13-Asset-Storage/ASSET-STORAGE-SHAREPOINT.md) |
| 3 | **LOE + E-Signature** | Generate the LOE contract → DocuSeal e-sign | [LOE-07 PRD](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/PRD-B-loe07-html-paper.md) · [DocuSeal architecture](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-DOCUSEAL-ARCHITECTURE.md) · [LOE→DocuSeal field map](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/LOE-TO-DOCUSEAL-FIELD-MAP.md) |
| 4 | **Closing: Pay → Paid** | Signed → thank-you → QuickBooks invoice/pay → paid trigger. **Buildable NOW in sandbox — no wait on the merchant app; invoice-only model can even ship without it.** | [Closing roadmap](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/CLIENT-CLOSING-SEQUENCE-ROADMAP.md) · [Closing infographic plan](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-CLOSING-INFOGRAPHIC-PLAN.md) · [**QB Sandbox path**](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-SANDBOX-PAYMENT-PATH.md) · [QB research](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-PAYMENT-INTEGRATION-RESEARCH.md) · [QB merchant signup](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-MERCHANT-APPLICATION-HOWTO.md) |
| — | **Report Builder** | Stage-4 standalone (2082 fields) — NOT in this workflow yet | `docs/Features/07-Report-Builder/` |

---

## Testing — the E2E workflow + how to drive the app

This is the testing home Ben asked about — it already existed; it's linked here now.

| Doc | What it is |
|---|---|
| [**E2E Testing Workflow — Master Plan**](~/Development/APR-Dashboard-v3/tests/E2E-TESTING-WORKFLOW-MASTER.md) | THE end-to-end test plan (v2, decisions locked with Ben). The full walk-through of the whole pipeline. |
| [**Data-Flow Visual Verification Workflow**](~/Development/APR-Dashboard-v3/Data-Flow%20Visuals/01-Data-Flow-Diagram.md) | **QA-owned.** Proves a job's data travels intact through every system via filled-in screenshots laid side-by-side on the Paper canvas. Fires whenever we need visual/end-to-end proof. **Living board:** Paper file `Build Workflow Testing` › page `APR Workflow` › board `DATA-FLOW BOARD — VAL261101`. |
| [Generic Visual Verification SOP](~/Development/APR-Dashboard-v3/tests/Testing-Visual-Verification-Workflow.md) | The capturer≠verifier screenshot discipline (multimodal read). Underlies the data-flow workflow above. |
| [**Sync Verification Report**](~/Development/APR-Dashboard-v3/Data-Flow%20Visuals/02-SYNC-VERIFICATION-RESULT.md) + [Auto-Sync Wiring Map](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/Valcre-Integration/AUTO-SYNC-WIRING-MAP.md) | **QA-owned pair.** Wiring map = how each field routes to Valcre; report = per-field readback PROOF it landed (never trust HTTP 200). The field-level layer of E2E testing. |
| [LOE E2E test plan (8-phase source)](~/Development/APR-Dashboard-v3/tests/LOE-END-TO-END-TEST-PLAN.md) | The source eight-phase plan the master wraps. |
| [LOE E2E autonomous-agent PRD](~/Development/APR-Dashboard-v3/tests/LOE-E2E-AGENT-AUTONOMOUS-PRD.md) | The autonomy PRD for running it agent-driven. |
| [**Agent CLI & Browser Tooling SOP**](~/Development/APR-Dashboard-v3/docs/AGENT-CLI-TOOLING-SOP.md) | How an agent logs in, fills fields, screenshots, verifies sync — the CLI-capabilities doc. |
| [CLI inventory preflight](~/Development/APR-Dashboard-v3/tests/CLI-INVENTORY-PREFLIGHT-2026-06-03.md) | What CLIs exist + gaps. |
| [Testing playbook](~/Development/APR-Dashboard-v3/docs/APR-TESTING-PLAYBOOK.md) · [Testing reference](~/Development/APR-Dashboard-v3/docs/APR-TESTING-REFERENCE.md) | Standing testing references. |

**Pinned test job:** VAL261101 "Westside Mall" — modify field-by-field, name-match guard first, never the Test Data button.
**Test ClickUp list:** the Valta-mirror test list in Ben's BC workspace. Never the client's production Valta list during testing.

---

## Current Status (as of 2026-06-05)

### Proven / shipped this week
- **Dashboard→Valcre sync** — proven end-to-end, custom + native fields, readback-verified.
- **ClickUp chain** — auto-create + Stage-2 enrichment + per-field card sync; deployed to the mirror test list; QA confirmed all fields land correctly with no duplicate card.
- **LOE-07 render** — Section 10 cascade wired (left from cascade, right via narrative-library trigger), de-tabled, footer/logo/spacing fixes applied; cascade logic verified.
- **Asset storage** — documented: SharePoint per-job folder (app-created on intake) + Supabase image buckets.
- **QuickBooks** — viability confirmed for Canada; merchant-account signup how-to written.

### In flight / next
- **SharePoint folder-create** — wire into the intake chain (needs Microsoft Graph API access set up).
- **Status-of-Improvements dropdown** — options must be aligned to the cascade keys so Section 10 fires live (Ben's canonical-list call).
- **EA/HC narrative library** — Chris is building it; the right column of Section 10 fills as entries land.
- **QuickBooks wiring** — after Ben's merchant-account approval.
- **DocuSeal e-sign wiring** — field map done, wiring is trivial on Ben's go.

---

## Fields, Cascade & Registry (the field-options category)

The source of truth for what fields exist, their dropdown options, the cascade rules, and how it
all feeds the LOE. **The Valta Registry V6 is the live source:** https://apr-dashboard-v3.vercel.app/field-registry-v6.html

| Doc | What it is |
|---|---|
| [Cascade Field Options → LOE](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/CASCADE-TO-LOE-CONTRACT-NOTES.md) | **Source of truth (concept)** for how cascade picks feed the LOE contract (value scenarios, §10 EA/HC). Links to Registry V6. |
| [LOE-07 Build-Ready Spec (§10 wiring)](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/LOE-07-RENDER-TWEAKS-2026-06-04.md) | The **build-ready execution** companion to the notes above — exact code anchors + values; what react-spec built (§10 cascade wiring + de-table + footer/logo/spacing). |
| [Conditional Field Logic — Complete Reference](~/Development/APR-Dashboard-v3/docs/valta%20share/CONDITIONAL-FIELD-LOGIC.md) | The authoritative cascade rule set — predefined fields that auto-fill on option combos. |
| [Field Catalog & Dropdown Reference](~/Development/APR-Dashboard-v3/docs/DASHBOARD-FIELD-CATALOG.md) | Every dashboard field + its dropdown options, mapped to Registry V6. |
| [Field Routing (dashboard→ClickUp→LOE)](~/Development/APR-Dashboard-v3/docs/FIELD-ROUTING-dashboard-clickup-loe.md) | Where each field flows. |
| [PRD-A — Fields → Valcre Mapping](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/PRD-A-fields-to-valcre-mapping.md) | The field→Valcre mapping + sync testing PRD. |

## Key Reference Docs

| Topic | Doc |
|---|---|
| Field registry (master) | `docs/Features/08-Master-Field-Registry/` |
| Field routing (dashboard→ClickUp→LOE) | [FIELD-ROUTING](~/Development/APR-Dashboard-v3/docs/FIELD-ROUTING-dashboard-clickup-loe.md) |
| Dashboard field catalog | [DASHBOARD-FIELD-CATALOG](~/Development/APR-Dashboard-v3/docs/DASHBOARD-FIELD-CATALOG.md) |
| Architecture | [DASHBOARD-ARCHITECTURE](~/Development/APR-Dashboard-v3/docs/DASHBOARD-ARCHITECTURE.md) |
| Valcre custom-field live definitions | `docs/Features/08-Master-Field-Registry/Valcre-Integration/` |
| Cascade → LOE contract notes | [CASCADE-TO-LOE-CONTRACT-NOTES](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/CASCADE-TO-LOE-CONTRACT-NOTES.md) |

---

## Filing notes (cleanup proposals — for Ben's ok, not done yet)

- **Two folders share number `13`** — `13-Asset-Storage` and `13-Data-Extraction`. One should renumber. (Proposal: Data-Extraction → next free number.)
- **Test docs live in `tests/`, PRDs in `docs/Features/`** — that's a reasonable split (runnable tests vs specs), kept as-is. This dashboard bridges them so the split doesn't cost navigability.
- The prior stale `APR-MASTER-DASHBOARD.md` is archived to `docs/_archive/` — this `00-` file replaces it.
- "Discuss after" with Ben: the APR Domain agent's priming holds the intended org structure — reconcile this dashboard's layout against it.
