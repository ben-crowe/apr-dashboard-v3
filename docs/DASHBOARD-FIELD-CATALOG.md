---
content_type: field-catalog
title: APR Dashboard — Field Catalog & Dropdown Reference
status: living reference
owner: ui-designer (authors) · co-architect (organizes)
home: 00-APR-MASTER-DASHBOARD.md
registry_v6: "https://apr-dashboard-v3.vercel.app/field-registry-v6.html (Valta Registry V6 — source of truth; 218-field client-facing subset)"
tags: [apr-workflow, fields, field-catalog, dropdowns, registry-v6, cascade, source-of-truth]
keywords: [dashboard field catalog, dropdown reference, valta field registry v6, field options, source of truth fields, cascade field reference]
related: [Features/12-LOE-Esign/loe07-build/CASCADE-TO-LOE-CONTRACT-NOTES.md, "valta share/CONDITIONAL-FIELD-LOGIC.md", FIELD-ROUTING-dashboard-clickup-loe.md, Features/08-Master-Field-Registry/PRD-A-fields-to-valcre-mapping.md]
---

# APR Dashboard — Field Catalog & Dropdown Reference

**Status:** Living reference · in progress · refine as fields are captured
**Author:** ui-designer (dev-4), from the live qa-agent app-driving session (VAL261101)
**Created:** 2026-06-04

> ## ⭐ Source of truth — the Valta Field Registry
> This catalog **maps / matches to the client's Valta Field Registry** — `field-registry-v6.html` (live at `apr-dashboard-v3.vercel.app/field-registry-v6.html`). It's built from **Chris's Valcre Fields tab — the client-facing 218-field subset.**
> When the **Valta registry (218 fields)** and the big **master registry (2,082 fields)** disagree on what the client actually has, the **source-of-truth call goes to the client's real Valcre fields** (per the note in the Master-Field-Registry folder). The Valta registry is the one we check.

## What this is (and how it differs from the other field docs)

A catalog of **every dashboard field, its input TYPE, and the actual DROPDOWN OPTIONS inside it** — the thing the routing/mapping docs don't show. The end goal is a **visual field board on the Paper canvas** (the fields + their dropdowns laid out like the screenshot boards), so you can see the whole dashboard's field set at a glance.

**Complements, doesn't duplicate:**
- `~/Development/APR-Dashboard-v3/docs/FIELD-ROUTING-dashboard-clickup-loe.md` — where each field *flows* (ClickUp / LOE). It does NOT list types or options.
- `~/Development/APR-Dashboard-v3/tests/TESTJOB-VAL261101-FIELDS-2026-06-03.md` — the test job's current *values*.
- co-architect's field-map (in progress) — the relationship drawing.
- **This doc** — the field *types + dropdown options* + the canvas-visual spec. My lane.

**Legend:** `[dropdown]` single-select · `[multi]` multi-select · `[text]` free-text · `[date]` date picker · `[$]` currency · `[#]` number. ✔ = options captured · ⏳ = options still to capture (open-dropdown shot or pull from `api/valcre.ts`).

---

## Job Details / LOE Quote section

Left column:

- **Property Rights** — `[dropdown]` ✔ (registry) · **Fee Simple · Leased Fee Interest · Leasehold Estate · Going Concern · Fee Simple & Leased Fee** · current: Leased Fee Interest · (registry: a cascade "Group 1 — 3 triggers → 1 result")
- **Payment Terms** — `[dropdown]` ⏳ · current: On LOE Signature
- **Report Type** — `[dropdown]` ⏳ · current: Appraisal Report
- **Retainer Paid** — `[date]`
- **Delivery Date** — `[date]` · current: 2026-02-10
- **Job Status** — `[dropdown]` ⏳ (Status…)
- **Assignment Type** — `[dropdown]` ⏳ · current: Single Property · (drives Schedule A when "Multiple Properties")
- **Value Scenarios** — `[multi]` · current: As Stabilized · registry = **cascade/smart field** (chained: Status of Improvements → Value Scenarios → Approaches to Value — *not* a free pick, which is why it fights automation). Syncs → **Custom 11563 (Premise-1) + 11564 (Premise-2)** (As Is=5128/11563, As Stabilized=5138/11564).
- **Zoning Status** — `[dropdown]` ✔ · **Legal Conforming · Legal Non-Conforming · Illegal · No Zoning** · syncs → Valcre CF 12054
- **Purpose** — `[text]` · (does NOT sync to Valcre.Purposes — leave free-text)
- **Desktop Report** — `[dropdown]` ⏳ (Yes/No flag)
- **Effective Date** — `[date]` · current: 2026-04-01
- **Signed Date** — `[date]` · current: 2026-03-20 (from DocuSeal webhook)
- **Proposed Use** — `[text]` · current: Industrial
- **Delivery Time (wks)** — `[#]` · current: 4
- **Previously Appraised** — `[dropdown]` ⏳ (Select…)

Right column:

- **Scope of Work** — `[dropdown]` ⏳ · current: All Applicable
- **Appraisal Fee** — `[$]` · current: $3,500.00
- **Retainer Amount** — `[$]` · current: $350.00
- **Amount Paid** — `[$]`
- **Paid Date** — `[date]`
- **Authorized Use** — `[dropdown]` ⏳ · syncs → Job.IntendedUses
- **Report Format** — `[dropdown]` ⏳ · current: Comprehensive
- **Transaction Status** — `[dropdown]` ⏳ · current: Under Contract · syncs → Valcre CF12053
- **Analysis Level** — `[dropdown]` ✔ · **Comprehensive · Concise · Form** · syncs → Job.AnalysisLevel · (options = keys of `ANALYSIS_LEVEL_MAP`)
- **Lead Appraiser** — `[text]` · (dashboard-only — no Valcre custom field, native Staff picker only; correct as text)
- **CMHC Financing** — `[dropdown]` ⏳ (Select…) (Canadian intake flag)
- **Request Date** — `[date]` · current: 2026-03-15
- **Current Use** — `[text]` · current: Industrial
- **Approaches to Value** — `[dropdown]` ⏳ · current: Income & Direct Comparison
- **Client Documents** — `[multi]` ⏳ · current: Requested · (multi-select — set several valid document types)

Comments row: **General / Delivery / Payment** — `[text]` (multiline, card-only).

---

## Building Information & Client Documents section

- **Year Built** — `[text/#]`
- **Number of Units** — `[text/#]`
- **Tenancy** — `[dropdown]` ⏳ (Select…)
- **Status of Improvements** — `[dropdown]` ⏳ (Select…)
- **Land Metric** — `[dropdown]` ⏳ (Select…)
- **Heritage / Conserv.** — `[text]`
- **Building Size (SF)** — `[text/#]`
- **Parking Spaces** — `[text/#]`
- **State of Improvements** — `[dropdown]` ⏳ (Select…)
- **Property Subtype** — `[dropdown]` ⏳ (Select…)
- **Env. Assessment** — `[text]`

---

## ClickUp task — what goes to it + what it looks like

Every job also pushes to a **ClickUp task** (the "View in ClickUp" button on the job). The card is built in **3 stages by 3 builders** (not 4 — `create-valcre-job` touches Valcre, NOT the card):

**Stage 1 — initial card** (`create-clickup-task` edge fn / `src/utils/webhooks/clickup.ts`) — currently **LEAN**:
- Header link "NEW JOB ARRIVED — View in APR Hub" · **Client:** (first+last) · **Property:** (name+address) · **Type:** · **Intended Use:** · **Notes:** (optional) · status = "to do".

**Stage 2 — LOE QUOTE & VALUATION section** (`update-clickup-task`):
- Header "VALCRE JOB NUMBER" link · **PROPERTY VALUATION:** Property Rights · Scope of Work · Report Type · **FINANCIAL DETAILS:** Appraisal Fee · Retainer Amount · Delivery Date · Payment Terms · **APPRAISER NOTES:** internal/delivery/payment/client comments (bulleted).

**Stage 2.5 / 3 — status tracker** (`docuseal-webhook`):
- `▸ LOE Sent: <time>` · `▸ LOE Signed: <time> by <signer>` — filled on DocuSeal events.

**What the FULL (rich) card looks like — the "Summit Tower" target layout:**
```
📍 NEW APPRAISAL REQUEST: [APR Dashboard]
📍 VALCRE JOB NUMBER:            (filled by update-clickup-task)
━━━━━━━━━━
RECEIVED DATE:  YY.MM.DD / H:MM AM/PM
  ▸ LOE Sent:                    (filled by docuseal-webhook)
  ▸ LOE Signed:
━━━━━━━━━━
CLIENT INFORMATION   • Name / Org / Email / Phone
PROPERTY INFORMATION • Property / Address / Type / Use / Condition / Premise
PROPERTY CONTACT     • Name / Email / Phone
CLIENT COMMENTS      • ...
```

**Current state vs target:**
- **UPDATE 2026-06-04: the rich Stage-1 card now RENDERS LIVE** — a fresh card for Westside Mall shows CLIENT INFORMATION / PROPERTY INFORMATION / PROPERTY CONTACT / CLIENT COMMENTS all populated. The rich template was recovered/wired (was previously stripped: git rich `669659c` → removed `72ca10f`).
- **Stage-2 still blocked:** the LOE Quote & Valuation section + the "VALCRE JOB NUMBER" outward link are **not on the fresh card** — Stage-2 `update-clickup-task` **401'd (token bug)**. The APR-Hub backlink works; the Valcre outward link returns once Stage-2's token is fixed.

**Sync-path finding (why dashboard changes don't reach the card):**
- **Per-field dashboard edits sync to Valcre but NEVER call ClickUp** — ClickUp simply isn't in the per-field save path. So editing a field updates Valcre, not the card.
- The ClickUp card **only** updates when the "Create Valcre Job" / sync action runs (`LoeQuoteSection.tsx:339` → `update-clickup-task`) — and that action **401s**. So no Stage-2 update ever lands; the card stays Stage-1-only.
- **Creation chain (confirmed working):** form submission → APR job → **a DB trigger creates the ClickUp task** (Stage-1). It is NOT client-side — do **not** re-add client-side creation or it double-creates.
- **Stage-2 401 root cause (sharpened):** `update-clickup-task` reads a **different, expired token** than the creation step uses. That stale token is the real bug — fix it and Stage-2 lands.
- **Per-field edits don't push to ClickUp at all** (they only sync to Valcre) — a product decision for Ben on whether they should.
- **Custom fields still empty** (~7 of 48) — separate later piece.
- **Full fix spec:** `~/Development/APR-Dashboard-v3/tests/WIRING-SPEC-intake-clickup-chain-2026-06-04.md` (handed to react-spec).
- **Two different "rich" things — don't conflate:** (A) the markdown card **body** (the Summit Tower look — recover via git) vs (B) the **custom FIELDS** (48-field production board, only **~7 filled today**, Phase 1–4 roadmap expands to 21). Restoring (A) is the small git job; (B) is the documented roadmap.

**Visual capture — PENDING:** the live VAL261101 card (`86b8c5xt9`) **404s with the BC test token** (it's on a prod workspace), so the rendered card hasn't been screenshotted yet. QA tests ClickUp **after** the Valcre sync test (next destination) — either with the prod token or a fresh task on the canonical test list `901709622357`. That screenshot is the ClickUp tile for the data-flow board.

> Full field-by-field routing (dashboard → ClickUp → LOE) lives in `~/Development/APR-Dashboard-v3/docs/FIELD-ROUTING-dashboard-clickup-loe.md`; card-builder mechanics in `tests/MAPPING-dashboard-to-clickup.md` + `tests/FINDINGS-rich-clickup-card-recovery-2026-06-03.md`.

---

## Captured dropdown options (so far)

- **Zoning Status** ✔ — Legal Conforming · Legal Non-Conforming · Illegal · No Zoning
- **Analysis Level** ✔ — Comprehensive · Concise · Form
- **Report Format** — current Comprehensive (full list ⏳ — likely same trio, see open question below)

## Still to capture (⏳ — open-dropdown shot or pull from `api/valcre.ts` maps)

Property Rights · Payment Terms · Report Type · Job Status · Assignment Type · Value Scenarios · Desktop Report · Previously Appraised · Scope of Work · Authorized Use · Report Format · Transaction Status · CMHC Financing · Approaches to Value · Client Documents · Tenancy · Status of Improvements · Land Metric · State of Improvements · Property Subtype.

> Fastest source for the *sync* dropdowns: the conversion maps in `api/valcre.ts` (e.g. `ANALYSIS_LEVEL_MAP`, `PURPOSES_MAP`) — the keys ARE the valid option set, so pulling options from there guarantees dashboard ↔ sync values can't drift.

---

## Open questions for Ben

- **Analysis Level vs Report Format** — both show Comprehensive / Concise / Form. Possible redundant/duplicate fields (flagged by react-spec). Worth a look.

---

## Canvas visual plan (my next step)

Once the open-dropdown shots are captured (QA is shooting them — `apr-fc-04-zoning-open`, `apr-fc3-analysis-open`, etc.), lay the dashboard field set out on the Paper canvas as a **field-visual board**: each field labeled with its type badge and its dropdown options shown open, grouped by section (Job Details / Building Info), so the whole field model reads at a glance — same side-by-side discipline as the data-flow board.

---

## Refinement log

- **2026-06-04** — v0.1. Seeded from the live QA session: Job Details + Building Info field list with types, Zoning + Analysis Level options captured, sync targets noted, canvas-visual plan set.
