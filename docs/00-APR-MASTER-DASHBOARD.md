---
content_type: master-dashboard
title: APR Dashboard — Master Navigation & Status
status: living front-door — keep current as work lands
updated: 2026-06-10
tags: [apr-workflow, apr-dashboard, master-index, navigation, home]
note: THE single front door. Open this first. Every significant feature, account, test doc, and reference links from here. Project-specific only — system/agent content lives on the Agent + Workflow dashboards.
dashboard_format: project-specific (see ~/.claude/knowledge/PROJECT-DASHBOARD-RULES.md)
---

# APR Dashboard — Master Navigation & Status

**This is the front door.** One page that links to every current area. Open here, navigate out.
If you add a doc, add a link here. **Project-specific only** — agent/skill/coordination content belongs on the [Agent Dashboard](~/.claude/knowledge/AGENT-DASHBOARD.md) + [Workflows Dashboard](~/.claude/knowledge/WORKFLOWS-DASHBOARD.md), not here.

> **Agents start here:** [01-AGENT-ACCESS-LOGIN-PRIMING](~/Development/APR-Dashboard-v3/docs/01-AGENT-ACCESS-LOGIN-PRIMING.md) — the single login/access/CLI/priming sheet for the APR Dashboard, ClickUp, Supabase, and Valcre. Load the skills, log in, drive — never a guess.

---

## ⭐ Router — want to do X? go straight here

**New here? Find your lane, open the ONE doc.** Each row points to the single right starting doc; the sections below carry the full set, live status, and accounts. Don't hunt — route.

| I'm working on… | Open this first | Full detail |
|---|---|---|
| **0 · Access / login / CLIs** (do FIRST) | [Agent Access & Login Priming](~/Development/APR-Dashboard-v3/docs/01-AGENT-ACCESS-LOGIN-PRIMING.md) | [§2 Accounts & Access](#2-accounts-access) |
| **1 · Client Intake** (form → dashboard) | [Intake form field map](~/Development/APR-Dashboard-v3/tests/INTAKE-FORM-FIELDMAP-2026-06-03.md) | [§1 Features](#1-significant-features) |
| **2 · Job + Sync** (Valcre job · ClickUp card · field sync) | [★ ClickUp Card Sync — CANONICAL](~/Development/APR-Dashboard-v3/docs/Features/04-Job%20%26%20Client%20Mgt./CLICKUP-SYNC-CANONICAL.md) · [Dashboard→Valcre location map](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/Valcre-Integration/DASHBOARD-TO-VALCRE-LOCATION-MAP.md) | [§1 Features](#1-significant-features) |
| **3 · LOE + E-Signature** | [★ LOE / E-Signature Feature Sheet](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/00-LOE-ESIGN-FEATURE.md) | [§1 Features](#1-significant-features) |
| **4 · Closing: Pay → Paid** | [★ Closing & Payment Feature Sheet](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/00-CLOSING-PAYMENT-FEATURE.md) | [§1 Features](#1-significant-features) |
| **5 · TESTING** (run the pipeline) | [★ E2E Testing Workflow — Master Plan](~/Development/APR-Dashboard-v3/tests/E2E-TESTING-WORKFLOW-MASTER.md) | [§3 Testing](#3-testing) |
| **6 · Reference** (fields · cascade · routing) | [★ Field Data Map — where everything lives](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/FIELD-DATA-MAP-where-everything-lives.md) · [Cascade spec + wiring](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/CASCADE-LOGIC-SPEC-AND-WIRING.md) | [§4 Reference](#4-reference) |

> **Before any ClickUp / Valcre / DocuSeal / Supabase action:** LOAD [`/cli-apr-tools`](~/.claude/skills/cli-apr-tools/SKILL.md) + [`/cli-clickup-tools`](~/.claude/skills/cli-clickup-tools/SKILL.md) and **search the catalog first** — most test/sync actions already have a CLI. Don't hand-roll curl until you've confirmed no command exists.

`#apr-workflow` `#apr-dashboard` `#master-index` — search any of these to surface the connected APR doc set.

_Last updated 2026-06-10 (router/navigability pass — top "want to do X? go here" router added; no content removed). Sections follow the canonical project-dashboard format: Significant Features · Accounts & Access · Testing · Reference · Status & Filing._

---

## Page sections

_(The router above sends you to the right doc; this jumps you to a section on THIS page.)_

1. [Significant Features](#1-significant-features)
2. [Accounts & Access](#2-accounts-access)
   - [Deployment & Environments](#deployment--environments)
3. [Testing](#3-testing)
4. [Reference](#4-reference)
5. [Status & Filing](#5-status-filing)

---

## 1. Significant Features

The major features of the app, laid out in logical workflow order — a 4-stage appraisal pipeline. Each feature links to its detail doc; the Live Parts Checklist below it is the live done/open status of the same set.

| # | Feature | What happens | Detail doc |
|---|---|---|---|
| 1 | **Client Intake** | Client submits the request form → lands in Supabase | [Intake form field map](~/Development/APR-Dashboard-v3/tests/INTAKE-FORM-FIELDMAP-2026-06-03.md) |
| 2 | **Job Creation** | Auto-creates the Valcre job + ClickUp card + (planned) SharePoint folder | [Intake→ClickUp wiring spec](~/Development/APR-Dashboard-v3/tests/WIRING-SPEC-intake-clickup-chain-2026-06-04.md) · [Field routing](~/Development/APR-Dashboard-v3/docs/FIELD-ROUTING-dashboard-clickup-loe.md) |
| 2a | **Field Sync** | Dashboard fields push to Valcre (custom + native) + the ClickUp card | [**Dashboard→Valcre LOCATION map**](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/Valcre-Integration/DASHBOARD-TO-VALCRE-LOCATION-MAP.md) · [PRD-A fields→Valcre](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/PRD-A-fields-to-valcre-mapping.md) · [Verified job-prep→Valcre map](~/Development/APR-Dashboard-v3/tests/MAP-jobprep-to-valcre-VERIFIED-2026-06-03.md) |
| 2b | **Asset Storage + Email** (one Microsoft 365 / Graph integration) | A **single Entra app** (Ben self-creates as Global Admin) powers BOTH: per-job SharePoint folders (client home) + Supabase image buckets, AND outbound email send from a `valta.ca` mailbox via Graph. 2b owns the shared M365 plumbing; the email *messages/triggers* live with Features 3 (LOE send) & 4 (closing emails). | [Asset storage + SharePoint](~/Development/APR-Dashboard-v3/docs/Features/13-Asset-Storage/ASSET-STORAGE-SHAREPOINT.md) · _email-send section to be added to this doc_ |
| 3 | **LOE + E-Signature** | Generate the LOE contract → DocuSeal e-sign. **V07 is LIVE (2026-06-05).** | [**★ LOE / E-Signature Feature Sheet**](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/00-LOE-ESIGN-FEATURE.md) · [eContract architecture](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-ECONTRACT-CREATOR-ARCHITECTURE.md) · [DocuSeal architecture](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-DOCUSEAL-ARCHITECTURE.md) · [LOE-07 PRD](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/PRD-B-loe07-html-paper.md) |
| 3a | **eContract Editor — Edit Scopes & Versioning** | In-app editing of the LOE with **two scopes** — *Edit This LOE* (per-client job override) vs *Edit Template* (the shared boilerplate for all jobs) — plus version-at-creation + lock-by-status (Draft/Sent/Signed) and fenced editable zones. The per-job override store is the known missing piece. **Design direction — documented; marker-based editor now BUILT + live-verified (2026-06-13).** | [**★ Contract Editor — Architecture & Intent**](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/CONTRACT-EDITOR-ARCHITECTURE.md) _(current model: templates-as-shells, Edit Contract vs Edit Template, Create Contract lifecycle)_ · [eContract Editor Evolution Roadmap](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/ECONTRACT-EDITOR-EVOLUTION-ROADMAP.md) · [Job Document Picker decision tree](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/JOB-DOCUMENT-PICKER-DECISION-TREE.md) · [LOE-07 Edit / Re-host Workflow](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-07-EDIT-VERSION-WORKFLOW.md) |
| 4 | **Closing: Pay → Paid** | Signed → thank-you → QuickBooks invoice/pay → paid trigger. **Buildable NOW in sandbox.** | [**★ Closing & Payment Feature Sheet**](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/00-CLOSING-PAYMENT-FEATURE.md) · [Closing roadmap](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/CLIENT-CLOSING-SEQUENCE-ROADMAP.md) · [QB Sandbox path](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-SANDBOX-PAYMENT-PATH.md) |
| — | **Report Builder** | Stage-4 standalone (2082 fields) — NOT in this workflow yet | `docs/Features/07-Report-Builder/` |
| — | **Test Data Fill (per-section)** | Each job-detail section has a "Test Data" button (top-right of the section header) for fast testing. Today they're one-off — each section fills its own hand-written batch; three sections always fill identical fixed values, two shuffle a few fields randomly; none are realistic/coherent or versioned, and they ignore the cascade (they jam a value into the derived Value-Scenarios field instead of setting the status and letting the rules compute it → stale displayed values). **To rebuild** as a versioned, cascade-aware "pick a version → fill realistic data" feature, like the Field Registry tool. Research done; PRD pending. | [**Test Data Buttons — research/starting point**](~/Development/APR-Dashboard-v3/docs/Features/TEST-DATA-BUTTONS-RESEARCH.md) |
| — | **Job-Detail Field Audit (dropdown clarity)** | Which job-detail fields are real dropdowns vs derived/auto-filled vs free-text, every option-set verified against the CURRENT client registry, and where the live UI has drifted. Key finds: same field built twice across LOE-Quote vs Data-Gathering sections with conflicting option-sets (LOE = canonical, Data-Gathering = stale); true gaps = Current/Proposed Use (registry has options, app is free-text) + Job Status/Purpose; derived (not gaps) = Value Scenarios/Approaches/Property Rights. Source of truth = client's live-SharePoint `Valta Master Field Registry v03` (reviewed 2026-06-09). Diagnosis only — no field changes pending co-arch reconcile + Ben's call. | [**★ Job-Detail Field Audit**](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/JOB-DETAIL-FIELD-AUDIT-2026-06-09.md) · [client registry (v03)](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/client-source/) |
| — | **★ Client Review Sheet (questions for Chris)** | Running, append-only list of questions/concerns to confirm with the client before we build to his registry. Every entry pinpoints the EXACT tab + row/column + text in his `v03` Excel so the question is never vague. Open items: Value Scenarios marked as new Valcre fields but no field given; "Report Type" wording (his Comprehensive/Concise/Form ≈ our Report Format?); "Zoning Status" wording (his In Place/To Be Rezoned vs Valcre's legal-conformance set); "Land $/Metric" meaning; a "Unkown" typo. | [**★ Client Review Sheet**](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/CLIENT-REVIEW-SHEET.md) · [registry vs code divergences](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/REGISTRY-VS-CODE-DIVERGENCES.md) |
| — | **★ Field Mapping & Data — where everything lives** | The single index for ALL field info: where the dropdown OPTIONS are defined (the section components), where the CASCADE logic lives (`loeCascade.ts`), where the LOE TOKEN mapping lives (`generateLOE.ts`), where VALCRE/CLICKUP routing lives (the wiring arrays + Valcre location map), the CLIENT REGISTRY source-of-truth (the v03 xlsx), the DB tables, and every working doc + the Field Registry Explorer surfaces. Built so nobody has to hunt for field data again. | [**★ Field Data Map — where everything lives**](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/FIELD-DATA-MAP-where-everything-lives.md) · [Extracted registry](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/EXTRACTED-FIELD-REGISTRY-dashboard.md) · [Proposed re-sort](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/PROPOSED-SECTION-RESORT-2026-06-09.md) · [Mock test data](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/MOCK-DASHBOARD-TEST-DATA.md) |

:::details{.boxed.aligned summary="📋 Live Parts Checklist — done vs. open status of each feature (click to open)"}

The live readout: each pipeline part as a check item. `[x]` proven · `[~]` partial / in-flight · `[ ]` open or unverified. Verify live before trusting — close each part independently before chaining the full end-to-end run.

- `[~]` **1. Client Intake** → Supabase. **Standalone test we can run NOW:** the client's real appraisal-request form is hosted on the Valta site at `https://valta.ca/request-appraisal/intake` (test mode: `?test=true`) — it mirrors our submission form. Fill it with test data → confirm every field lands in the APR dashboard. Re-verifies form→dashboard delivery on its own, before any downstream test.
- `[x]` **2. Job Creation** — auto-creates Valcre job + ClickUp card. Proven, QA-confirmed, no duplicate card.
- `[x]` **2a. Field Sync → Valcre** — dashboard fields push to Valcre (custom + native), readback-verified. **Standalone test (repeatable):** change a field on the dashboard for the pinned test job → watch it sync live to Valcre. Preferred method = a single per-field CLI/API action, NOT the "Fill with Test Data" button. **Gotcha to fix:** make that button agent-pressable (press → reshuffles realistic field data).
- `[ ]` **2a-E2E. Brand-new job creation (true end-to-end)** — after per-field verifications pass, create a brand-new Valcre job via the client form submission for a real end-to-end run. Ben is fine creating a couple real jobs; he deletes test jobs himself (missing `valcre-delete-job` API doesn't matter).
- `[~]` **2a-ClickUp. Card sync + correct template** — custom-field sync result documented (lands in proper custom fields). **OPEN:** a full filled-out card render isn't visually verified (live card 404s with BC test token); sync-on-every-change isn't confirmed end-to-end. Verify with prod token or a fresh task on test list `901709622357`. Visual: [clickup-hub-card-render.html](~/Development/APR-Dashboard-v3/Data-Flow%20Visuals/clickup-hub-card-render.html) · result: [04-CLICKUP-CUSTOMFIELD-SYNC-RESULT.md](~/Development/APR-Dashboard-v3/Data-Flow%20Visuals/04-CLICKUP-CUSTOMFIELD-SYNC-RESULT.md)
- `[~]` **2b. Asset Storage + Email (one Microsoft 365 / Graph integration)** — ONE Entra app powers folders AND email send. Email-send detail is the "Email deliverable" line in the section below (same app: add `Mail.Send` alongside `Sites.ReadWrite.All`). SharePoint side: Supabase image buckets done; per-job folder-create `[ ]` NOT wired. At intake the app creates a parent job folder under `…/sites/V/Shared Documents/2.Jobs/{YEAR}/` **AND scaffolds 5 standard subfolders inside it**. Site: `valtapropertyvaluations.sharepoint.com/sites/V`.
  - **Parent folder name (VERBATIM — casing + ` - ` separator [space-hyphen-space] are intentional, match exactly):** `{JOB#} - {Property Description + Street Address + City + Province}`
    - e.g. `VAL261054 - Stacked Townhouse Development 2822 &2828 11 Ave SE Calgary AB`
    - e.g. `VAL261051 - Windsong South Osborne Drive 8th St SW Airdrie AB`
  - **5 subfolders (VERBATIM, in this order — numbered prefixes + casing exact):**
    1. `1. REPORT` — finished report lands here
    2. `2. CLIENT SUPPLIED`
    3. `3. WORK FILES (TTSZ, PICS, COMPS)`
    4. `4. CLIENT BILLING (Invoice, LOE)` — signed LOE + invoice land here
    5. `5. LETTER OF RELIANCE (LOR)`
  - **Confirmed from Ben's live SharePoint 2026-06-08** (screenshot review, not Codex). Folder spec is LOCKED.
  - **PERMISSION RESOLVED 2026-06-08 — NO LONGER CLIENT-BLOCKED.** Ben is **Global Administrator** on the Valta tenant (`valtapropertyvaluations.onmicrosoft.com`, account `ben.crowe@valta.ca`). He can self-register the app AND grant admin consent — the entire integration is his to wire, no external ask. Confirmed via Entra → his user → Assigned roles.
  - **Wiring plan (all doable by Ben/agents now):** register an Entra app (single-tenant) → capture Tenant ID + Client ID + create a Client Secret → add `Sites.ReadWrite.All` **application** permission + Ben grants admin consent → store the 3 creds server-side (Vercel env, like Valcre) → build the Graph call that creates the parent job folder + the 5 subfolders at intake. Then `[ ]` → `[x]`.
- `[x]` **3. LOE generation (V07)** — LIVE 2026-06-05, cascade verified.
- `[~]` **3-DocuSeal. E-sign flow** — MORE BUILT than "trivial": full flow implemented — `generateLOE` → `docuseal-proxy` edge fn → `POST /submissions/html` (`send_email:false`) → branded Resend email (`send-loe-email-fixed`) → `signature`/`date` anchor tags → `docuseal-webhook` updates DB + ClickUp on completed. **OPEN before a live send:** re-anchor the V07 signature field; sync template selectors (job-area "LOE Version" dropdown AND e-sign modal both list V07); resolve template-ID / API-key discrepancy. **By design:** Stage-6 client signing is manual via Codex Computer Use. **Risk:** `docuseal-webhook` returns HTTP 200 even on error.
- `[~]` **3-EA/HC. Narrative library** — Chris building; §10 right column fills as entries land.
- `[~]` **4. Closing: Pay → Paid (QuickBooks)** — **most of this is buildable NOW against the Intuit sandbox** (QA documented 2026-06-05). Free Intuit Developer account → sandbox Client ID + Secret → OAuth2 → sandbox QBO company → point edge fn at sandbox host. Builds + tests the whole closing choreography: create Customer + Invoice from signed-LOE data → send → record payment (flips Paid) → Intuit webhook → fire Trigger-2 (receipt + status + ClickUp flip). Two triggers: (1) LOE signed → thank-you + invoice; (2) invoice paid → receipt + flip. **Only the live "Pay Now" card-charge needs the real merchant account** — invoice-only model doesn't even need that. `[~]` sandbox flow = build now · `[ ]` live Pay-Now = later.
- `[ ]` **5. Cutover to client accounts (post-testing)** — once each channel is verified on Ben's accounts, promote to the client's: ClickUp → client's Valta workspace (off BC mirror `901703694310` → prod `901402094744`); email → client's MS 365; plus Valcre etc. The test→production switch — stays open until testing is signed off. See **Accounts & Access** below.
- `[ ]` **— Report Builder** — out of scope for this workflow (parked).

**Undocumented / "probably done but never confirmed" — verify first:**
- `[~]` **Email deliverable** — **PRODUCTION TARGET (decided 2026-06-08): retire Resend, send direct via Microsoft Graph `sendMail` from a `valta.ca` mailbox using the same Entra app as SharePoint (`Mail.Send` + app-access-policy scoped to one mailbox). See Open Questions → Email for full rationale.** _Current (interim) wiring (QA-verified 2026-06-08):_ LOE/sign email sends via the `send-loe-email-fixed` Supabase edge function → **Resend**, **FROM `onboarding@resend.dev` (Resend's SANDBOX domain — NOT a verified custom domain; the earlier `noreply@crowestudio.com` note was WRONG).** So Resend is currently just a test stub with no real sender identity invested — dropping it unwinds nothing. Test recipient `bc@crowestudio.com` is hardcoded in the LOE preview modal + test page, overridable, and **independent of transport** (stays the same after the swap). **Swap verdict: SMALL** — replace the ~15-line Resend `fetch` block in that one edge function with a Graph token-fetch + `sendMail` call, add 3 Supabase secrets (Tenant/Client ID + Secret); zero frontend / webhook / DB / `generateLOE` changes. **Cleanup flags:** Resend API key is hardcoded as a literal fallback in the edge fn (retire with Resend); two dead variants `send-loe-email` + `send-loe-email-v2` exist on disk unused. _Unverified:_ whether the hardcoded Resend key still works (needs a live call). Test-send verified to **`bc@crowestudio.com`** (the wired default test recipient — a guard so test sends never reach a real client). The "direct, no-Resend" memory = a conflation: the *recipient* is Ben's inbox, the *send* still goes through Resend. **No direct-SMTP wiring exists.** **Open DECISION (Ben):** transactional, so we could drop Resend and send direct from the Valta MS 365 admin mailbox for production. **Risks:** silent `noreply@valta.ca` fallback on invalid address; an email failure does NOT fail the LOE. **Verification is agent-autonomous:** the agent has full CLI email on `bc@crowestudio.com` via the EPA BC-Support email system — send the LOE → read the inbox to confirm arrival. (The `guide-gmail-cli` one-word `gmail` command is stale; the EPA system is the real path.)
- ~~Test-state reset~~ — **NOT needed (Ben, 2026-06-07).** Same-job reuse IS the method: pinned job VAL261101, modify field-by-field, name-match guard, never the Test Data button.

**Visual proof layer (the data-flow board):**
- [Data-Flow Visual Verification Workflow](~/Development/APR-Dashboard-v3/Data-Flow%20Visuals/01-Data-Flow-Diagram.md) — screenshot per stage as data travels; Paper board `DATA-FLOW BOARD — VAL261101`. Capture a filled-field screenshot at each stop, lay side-by-side, so every part carries visual proof, not just a PASS claim.

---

**What this checklist IS (read me):** it's the verification status mirror of the Significant Features above — the same pipeline, shown as done/open boxes instead of links. Use it to see at a glance what's proven vs. still open before chaining the full end-to-end run. As each part closes, flip its box. It is the single live build readout; the feature table above is the navigation, this is the state.

:::

---

## 2. Accounts & Access

Every integration runs on **Ben's own test account** today and migrates to the **client's account** once testing is signed off. Canonical secrets live in the access sheet — never duplicated here.

**All secrets:** [01-AGENT-ACCESS-LOGIN-PRIMING](~/Development/APR-Dashboard-v3/docs/01-AGENT-ACCESS-LOGIN-PRIMING.md) — point there, never duplicate a token/password into this dashboard.

### Test (Ben's) vs. production (client's)

| Channel | Testing on (Ben's) | Production (client's) | Cutover step |
|---|---|---|---|
| **ClickUp** | BC workspace, "Valta Mirror" test list `901703694310` | Client's **Valta workspace**, list `901402094744` | Move/create the job task on the client's Valta list |
| **Email** | Ben's inbox via Resend sandbox (`onboarding@resend.dev`, interim) | **Direct via Microsoft Graph `sendMail` from a `valta.ca` mailbox — Resend RETIRED** | Stand up the Entra app + `valta.ca` sender, swap the one edge-fn send call |
| **Microsoft 365** (SharePoint folders + email send) | Ben's `valta.ca` account — **Global Administrator** on the Valta tenant | Same tenant (it already IS the client's) — one Entra app, Ben self-consents | Create the Entra app; grant `Sites.ReadWrite.All` + `Mail.Send`; store IDs/secret in the access sheet |
| **Valcre** | _confirm against access sheet_ | Client's Valcre account | _confirm_ |
| **Other accounts** | — | — | QuickBooks merchant (later), etc. |

> Nothing migrates to the client's accounts until the corresponding part is verified on Ben's accounts first — `[ ]` item 5 in the checklist tracks it.

:::details{.boxed.aligned summary="Account coverage — what's in the access sheet (click)"}
- **Valcre** ✓ — API creds in Vercel env (`VALCRE_CLIENT_ID/SECRET/PASSWORD`) + CLI scripts **AND a separate WEB-UI login for screenshots** (`app.valcre.com`, `chris.chornohos@valta.ca`). GOLDEN rule: HTTP 200 ≠ success → always GetValues readback.
- **ClickUp** ✓ — Ben's BC test workspace (team `8555561`, test list `901709622357`) + client's Valta production workspace (team `9014181018`, list `901402094744`, template `t-86b3exqe8`). **Gotcha:** ClickUp is login-gated → headless can't screenshot a card (use Codex/in-app or render from live data).
- **Supabase** ✓ — persisted no-expiry PAT in env + `/supabase-deploy` (auto-authed).
- **Vercel** ✓ — `vercel --prod` via `/guide-vercel-deploy`.
:::

**Gaps flagged here so they're not a surprise mid-work:**
- `[ ]` **Dashboard login password** = `__PENDING__` in the access sheet — Ben to fill.
- `[ ]` **Client Valta ClickUp — template setup.** The ClickUp API **cannot SAVE a task template (UI-only)** — it can only *apply* `t-86b3exqe8` + create-with-custom-fields. Saving a NEW template = a Codex in-app job (login-gated UI). Plan: Codex logs in via Ben's account → builds the task with all custom fields in the Valta space → "Save as Template."

**APR power tools (ready, don't re-search):** `/cli-clickup-tools` (60 cmds) · `/cli-apr-tools` (Valcre/DocuSeal/Supabase/intake) · `/supabase-deploy` · `/guide-vercel-deploy` · `/codex-in-app-ops` (for the login-gated ClickUp-template-into-Valta task). *Reusable Codex delegation patterns now live on the [Workflows Dashboard](~/.claude/knowledge/WORKFLOWS-DASHBOARD.md).*

---

## Deployment & Environments

**Two separate apps, one shared database.** The local app and the deployed app run *different code*, but both read and write the *same single Supabase database in the cloud* — there is no separate local database. Mental model: **one warehouse (the database), two storefronts (the apps).** A code change lives in only one storefront until deployed; anything written to the database is seen by both.

| | Local (dev) | Deployed (production) |
|---|---|---|
| **URL** | `http://localhost:8086` (dev port set in `vite.config.ts` — NOT 5173, that's KM-Exp) | `https://apr-dashboard-v3.vercel.app` (Vercel; the live Valta-facing site) |
| **Code** | Your working copy on this machine. Edits + uncommitted work show up here instantly (Vite hot-reload). | Whatever was last shipped with `vercel --prod`. Local edits are invisible here until deployed. |
| **Database** | Shared cloud Supabase (`ngovnamnjmexdpjtcnky`) | **Same** shared cloud Supabase |
| **Client intake form** | mirrors the live form | Hosted on the Valta site: `https://valta.ca/request-appraisal/intake` (`?test=true` for test mode) |

### How we use each

- **Local is the build + test surface.** It's where agents do the work — full headless browser driving (agent-browser on port 8086), DOM inspection, screenshots, and direct API/DB calls. Faster, safer, and you can see uncommitted changes immediately. All design + verification happens here first.

- **Deployed is the live client-facing site.** It only changes on a deliberate `vercel --prod` push (see `/guide-vercel-deploy`). Nothing reaches the client until it's deployed.

### The one thing to watch — the shared database

Because the database is shared, **a row written from local is also present for the deployed app.** It usually stays invisible/inert on production anyway (e.g. an inactive LOE template won't list or send there), but the data itself is live. So: **code changes are safely isolated to local; database writes are not.** When testing locally, prefer rows that are flagged inactive / non-default so production never surfaces or acts on them.

**Deploy command:** `cd ~/Development/APR-Dashboard-v3 && vercel --prod` (build locally first with `npm run build` to catch errors). Never deploy without Ben's go.

---

## 3. Testing

The E2E workflow + how to drive the app. **Before any ClickUp / Valcre / DocuSeal / Supabase action, LOAD the tool skill ([`/cli-apr-tools`](~/.claude/skills/cli-apr-tools/SKILL.md)) and run its search FIRST — do not hand-roll curl until you've confirmed no command exists.**

> **Most of these test/sync actions already have a CLI.** Load [`/cli-apr-tools`](~/.claude/skills/cli-apr-tools/SKILL.md) **and** [`/cli-clickup-tools`](~/.claude/skills/cli-clickup-tools/SKILL.md) and search the catalog before hand-rolling anything — each command now carries an **exists / missing / broken** status, so a search also tells you what still needs authoring.

| Doc | What it is |
|---|---|
| [**★ Full-Loop E2E Test PRD (RUNBOOK)**](~/Development/APR-Dashboard-v3/tests/E2E-TEST-PRD-FULL-LOOP.md) | **THE executable runbook qa-agent drives** — the whole client journey leg by leg (intake field-mapping → LOE → Valcre → ClickUp → e-sign/triggers/signed-date → folders → QuickBooks), each leg with action/verify/screenshot/status. No-stopping rule; screenshots → tldraw canvas. Makes the Master Plan runnable. |
| [**E2E Testing Workflow — Master Plan**](~/Development/APR-Dashboard-v3/tests/E2E-TESTING-WORKFLOW-MASTER.md) | THE end-to-end test plan (v2, decisions locked). Full walk-through of the whole pipeline + the gap analysis the PRD above executes against. |
| [**★ LOE Test Coverage Gate**](~/Development/APR-Dashboard-v3/tests/LOE-TEST-COVERAGE-GATE.md) | **The documented "what to verify on EVERY LOE test"** — cascade, §10 cleanliness, Schedule A / multiple properties, Example-block leak, token leaks, render gotcha. Run the LOE against this so nothing's missed (the Schedule-A-miss fix). |
| [**Data-Flow Visual Verification Workflow**](~/Development/APR-Dashboard-v3/Data-Flow%20Visuals/01-Data-Flow-Diagram.md) | **QA-owned.** Proves a job's data travels intact via filled-in screenshots side-by-side on Paper. Living board: `Build Workflow Testing` › `APR Workflow` › `DATA-FLOW BOARD — VAL261101`. |
| [Generic Visual Verification SOP](~/Development/APR-Dashboard-v3/tests/Testing-Visual-Verification-Workflow.md) | The capturer≠verifier screenshot discipline. |
| [**Sync Verification Report**](~/Development/APR-Dashboard-v3/Data-Flow%20Visuals/02-SYNC-VERIFICATION-RESULT.md) + [Auto-Sync Wiring Map](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/Valcre-Integration/AUTO-SYNC-WIRING-MAP.md) | **QA-owned pair.** Wiring map = how each field routes; report = per-field readback PROOF (never trust HTTP 200). |
| [LOE E2E test plan (8-phase source)](~/Development/APR-Dashboard-v3/tests/LOE-END-TO-END-TEST-PLAN.md) | The source eight-phase plan. |
| [LOE E2E autonomous-agent PRD](~/Development/APR-Dashboard-v3/tests/LOE-E2E-AGENT-AUTONOMOUS-PRD.md) | The autonomy PRD. |
| [**Agent CLI & Browser Tooling SOP**](~/Development/APR-Dashboard-v3/docs/AGENT-CLI-TOOLING-SOP.md) | How an agent logs in, fills fields, screenshots, verifies sync. |
| [CLI inventory preflight](~/Development/APR-Dashboard-v3/tests/CLI-INVENTORY-PREFLIGHT-2026-06-03.md) | **Pointer + residual findings only** — the per-command inventory now lives IN the `/cli-apr-tools` skill as searchable rows (with exists/missing/broken status). This doc keeps the non-command findings (Valcre prod-as-Chris constraint, the field-count RECONCILE flag). |
| [Testing playbook](~/Development/APR-Dashboard-v3/docs/APR-TESTING-PLAYBOOK.md) · [Testing reference](~/Development/APR-Dashboard-v3/docs/APR-TESTING-REFERENCE.md) | Standing testing references. |

**Pinned test job:** VAL261101 "Westside Mall" — modify field-by-field, name-match guard first, never the Test Data button.
**Test ClickUp list:** the Valta-mirror test list in Ben's BC workspace. Never the client's production list during testing.

:::details{.boxed.aligned summary="Priming prompts — per stage, paste-ready (prime the agent BEFORE working it)"}

Before working a stage, the agent runs a **full two-phase context-search** on that topic so it wakes into the rich record (prior runs, gotchas, locked decisions). A thin result = wrong query, not missing docs → keywords are deliberately rich.

> **Template:** *"QA — before we touch this, run a FULL two-phase context-search (`context-search` → if any leg is thin, escalate to `/search-all`). Topic: `<the line below>`. Read the full output, summarize done / open / gotchas, THEN we work it."*

- **0 · Agent CLI tooling (do first):** `agent screenshot click fill CDP real vs synthetic false-positive PASS km-exp crash agent-browser headless viewer-open DOM testing`
- **1 · Client Intake form → dashboard:** `APR client intake appraisal-request form valta.ca/request-appraisal/intake test mode field map form to dashboard supabase job_submissions all fields land`
- **2a · Field Sync → Valcre:** `APR dashboard field sync Valcre custom native readback GetValues per-field mapping auto-sync wiring map Fill-with-Test-Data button single CLI action`
- **2-ClickUp · Card create + sync + visual:** `APR ClickUp card auto-create job submission custom fields not description template sync on change BC mirror list visual render token 404 04-CLICKUP-CUSTOMFIELD-SYNC-RESULT`
- **2b · SharePoint asset storage:** `APR asset storage SharePoint Microsoft Graph API write access folder-create intake chain 2.Jobs year job-number tenant client-id secret Sites.ReadWrite`
- **3 · LOE + DocuSeal e-sign:** `APR LOE V07 DocuSeal e-sign flow generateLOE docuseal-proxy submissions html anchor tags webhook template selector sync template-id key discrepancy re-anchor signature`
- **3-EA/HC · Narrative library / §10 cascade:** `APR LOE section 10 cascade EA HC narrative library value scenarios status-of-improvements dropdown cascade keys`
- **Email · deliverable + verify:** `APR email Resend send-loe-email-fixed noreply crowestudio bc@crowestudio.com test recipient direct MS365 vs Resend gmail CLI read inbox verify delivery`
- **4 · QuickBooks closing (sandbox):** `APR QuickBooks sandbox Intuit developer client-id secret OAuth realmId invoice customer record payment webhook two triggers LOE signed invoice paid merchant account not needed`
- **5 · Client-account cutover:** `APR client accounts test to production ClickUp BC mirror to Valta workspace email to client MS365 Valcre account access login sheet cutover`
- **E2E · New Valcre job creation:** `APR new Valcre job creation end-to-end client form submission fill stage-2 dashboard fields real job test cleanup delete`

:::

**`[ ]` TASK — capture the per-job asset folder structure (Codex, from live SharePoint).** Our docs hold only the top path (`2.Jobs/{YEAR}/{JOB#} - {PROPERTY}/`) — the subfolder set inside each job folder + what assets go where is NOT documented; it lives only in the live Valta SharePoint. Capture via Codex (login-gated). Ben opens his SharePoint to the jobs folder, thumbs-up, Codex documents it. **Output:** `docs/Features/13-Asset-Storage/JOB-FOLDER-STRUCTURE.md` so the intake folder-create wiring builds the exact same set, not a guess. *(Codex delegation pattern: Workflows Dashboard.)*

---

## 4. Reference

### Fields, Cascade & Registry

The source of truth for what fields exist, their options, the cascade rules, and how it feeds the LOE. **Valta Registry V6 is the live source:** https://apr-dashboard-v3.vercel.app/field-registry-v6.html

| Doc | What it is |
|---|---|
| [**★ Cascade Logic — Full Spec + Wiring Pass-Off**](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/CASCADE-LOGIC-SPEC-AND-WIRING.md) | **CANONICAL.** Every cascade rule (verified vs code) + built-vs-planned status per group + the wiring tasks. Read this to wire the cascade. |
| [**★ ClickUp Card Sync — CANONICAL**](~/Development/APR-Dashboard-v3/docs/Features/04-Job%20%26%20Client%20Mgt./CLICKUP-SYNC-CANONICAL.md) | **CANONICAL.** The custom-fields Job-Hub model — which fields sync, why custom fields (not the dead markdown card), the edge fns, readback-verify, test-vs-prod list. Supersedes the stale rich-card docs. |
| [Cascade Field Options → LOE](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/CASCADE-TO-LOE-CONTRACT-NOTES.md) | Contract-side view — how cascade outputs land in the LOE sections/pages + the §10 narrative-library detail. |
| [LOE-07 Build-Ready Spec (§10 wiring)](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/LOE-07-RENDER-TWEAKS-2026-06-04.md) | The build-ready execution companion — exact code anchors + values. |
| [Conditional Field Logic — Complete Reference](~/Development/APR-Dashboard-v3/docs/valta%20share/CONDITIONAL-FIELD-LOGIC.md) | The authoritative cascade rule set. |
| [Field Catalog & Dropdown Reference](~/Development/APR-Dashboard-v3/docs/DASHBOARD-FIELD-CATALOG.md) | Every dashboard field + its dropdown options, mapped to Registry V6. |
| [Field Routing (dashboard→ClickUp→LOE)](~/Development/APR-Dashboard-v3/docs/FIELD-ROUTING-dashboard-clickup-loe.md) | Where each field flows. |
| [PRD-A — Fields → Valcre Mapping](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/PRD-A-fields-to-valcre-mapping.md) | The field→Valcre mapping + sync testing PRD. |
| [**API & Field Mapping Reference**](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/Valcre-Integration/1-API-FIELD-MAPPING-REFERENCE.md) | Source of truth for field→Valcre mappings + enum conversions. PRIME-FIRST mini-SOP + Work Diary + PENDING Questions park. |
| [**Valcre OData Schema Reference**](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/Valcre-Integration/VALCRE-ODATA-SCHEMA-REFERENCE.md) | GROUND TRUTH — authoritative enum token sets for every Valcre field, extracted from $metadata. Check here before guessing any enum value. |
| [Dropdown vs Registry Audit](~/Development/APR-Dashboard-v3/docs/DROPDOWN-VS-REGISTRY-AUDIT.md) | Every dropdown's options vs the V6 registry — the mismatch punch-list. |

### Key reference docs

| Topic | Doc |
|---|---|
| Field registry (master) | `docs/Features/08-Master-Field-Registry/` |
| Field routing (dashboard→ClickUp→LOE) | [FIELD-ROUTING](~/Development/APR-Dashboard-v3/docs/FIELD-ROUTING-dashboard-clickup-loe.md) |
| Dashboard field catalog | [DASHBOARD-FIELD-CATALOG](~/Development/APR-Dashboard-v3/docs/DASHBOARD-FIELD-CATALOG.md) |
| Architecture | [DASHBOARD-ARCHITECTURE](~/Development/APR-Dashboard-v3/docs/DASHBOARD-ARCHITECTURE.md) |
| Valcre custom-field live definitions | `docs/Features/08-Master-Field-Registry/Valcre-Integration/` |
| Cascade → LOE contract notes | [CASCADE-TO-LOE-CONTRACT-NOTES](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/CASCADE-TO-LOE-CONTRACT-NOTES.md) |

---

## 5. Status & Filing

> **▶ NEXT-STEPS READINESS PACK (2026-06-11):** [everything prepped for the next build session](~/Development/APR-Dashboard-v3/docs/NEXT-STEPS-READINESS-PACK-2026-06-11.md) — email · SharePoint · QuickBooks · e-Sign · ClickUp-Codex · LOE-finalize, each with state, docs, credential slots, naming specs, and last session's LOE PDFs. Read this first when resuming.

### Current status (as of 2026-06-05)

**Proven / shipped this week:**
- **Dashboard→Valcre sync** — proven end-to-end, custom + native fields, readback-verified.
- **ClickUp chain** — auto-create + Stage-2 enrichment + per-field card sync; deployed to mirror test list; QA confirmed all fields land, no duplicate card.
- **LOE-07 render** — Section 10 cascade wired, de-tabled, footer/logo/spacing fixed; cascade logic verified.
- **Asset storage** — documented: SharePoint per-job folder + Supabase image buckets.
- **QuickBooks** — viability confirmed for Canada; merchant-account how-to written.

**In flight / next:**
- **SharePoint folder-create** — wire into the intake chain (needs Microsoft Graph access).
- **Status-of-Improvements dropdown** — align options to cascade keys so Section 10 fires live.
- **EA/HC narrative library** — Chris building; right column of Section 10 fills as entries land.
- **QuickBooks wiring** — sandbox buildable now; live Pay-Now after merchant approval.
- **DocuSeal e-sign wiring** — re-anchor V07 + sync template selectors + resolve template-ID discrepancy before a live send.

### Open questions for Ben
- ~~**SharePoint:** Azure AD app registration on the client tenant…~~ **RESOLVED 2026-06-08 — not a blocker.** Ben is Global Administrator on the Valta tenant; he can self-register the app and self-consent `Sites.ReadWrite.All`. Folder-create is now buildable with no external dependency (see Live Parts Checklist 2b for the wiring plan + locked folder spec).
- **Dashboard login password:** still `__PENDING__` in the access sheet.
- ~~**Email:** keep Resend or send direct?~~ **DECIDED 2026-06-08 — retire Resend.** Production email sends **direct via Microsoft Graph `sendMail`** as a `valta.ca` mailbox, using the **same Entra app** as the SharePoint integration (add `Mail.Send` application permission alongside `Sites.ReadWrite.All`; Ben admin-consents both). Rationale: transactional, low-volume, B2B, expected by recipient → a real authenticated MS 365 mailbox delivers as well or better than a Resend relay, with full app control and one less vendor. `valta.ca` is a live MS 365 domain so SPF/DKIM/DMARC are already handled. **Guardrail:** scope sending with an **Application Access Policy** to the single sending mailbox (app must not be able to send as any tenant user). **Trade-off accepted:** lose Resend open/click analytics + bounce dashboard — fine for LOE mail; NDR bounces return to the mailbox where agents read them. **Keep** `bc@crowestudio.com` CLI access purely as the agent delivery-verification channel during testing.
- **Codex browser tasks:** the job-folder-structure capture + the ClickUp template-save both need Ben to open the relevant browser/SharePoint, then Codex executes.

### Filing notes (cleanup proposals — for Ben's ok)
- **Two folders share number `13`** — `13-Asset-Storage` and `13-Data-Extraction`. One should renumber (proposal: Data-Extraction → next free number).
- **Test docs in `tests/`, PRDs in `docs/Features/`** — reasonable split (runnable tests vs specs), kept as-is.
- The prior stale `APR-MASTER-DASHBOARD.md` is archived to `docs/_archive/` — this `00-` file replaces it.
- **System/agent content moved out 2026-06-07** — the agent skill/structure/reference audits → [Agent Dashboard](~/.claude/knowledge/AGENT-DASHBOARD.md); coordination + Codex delegation patterns → [Workflows Dashboard](~/.claude/knowledge/WORKFLOWS-DASHBOARD.md). This dashboard is now project-specific only.
