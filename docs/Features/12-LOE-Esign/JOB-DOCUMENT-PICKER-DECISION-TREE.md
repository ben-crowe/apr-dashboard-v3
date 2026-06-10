---
content_type: ux-decision-tree
title: Job Document Picker — Decision Tree + Evolution (document-not-version model)
status: v1 — 2026-06-05 (ui-designer write-up; co-arch handed off; design direction, pre-build)
owner: ui-designer (UX/decision-tree) · react-spec (build) · co-architect (tally) · Ben (direction)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
pairs_with: [~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/ECONTRACT-EDITOR-EVOLUTION-ROADMAP.md, ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-ECONTRACT-CREATOR-ARCHITECTURE.md]
tags: [apr-workflow, loe, econtract, ux, decision-tree, document-picker, versioning, job-level, lifecycle]
---

# Job Document Picker — Decision Tree + Evolution

**Tags:** #apr-workflow #loe #econtract #template-versioning #edit-scope #job-override #document-picker #versioning #lifecycle #ux #decision-tree
**Entities:** [[LOE E-Sign Feature]] [[eContract Editor]] [[loe_templates]] [[DocuSeal]]

**The problem today:** two template selectors disagree — the job-area "LOE Version" dropdown (V1/V2/V3)
and the e-sign modal picker (incl V07) — so the user faces a standing version menu next to a finished
document and can't tell which one wins. react-spec confirmed the per-job version field has **never been
used on any job**, so there's no legacy per-job version system to preserve — we build the clean model.

---

## The core concept (the fix)

**The job-level control is a DOCUMENT picker, not a version picker.**

- You choose **what to create** (LOE today; other document types as the app grows) — *document type*, not version.
- **Version is chosen ONCE — at creation** — defaulted to the newest (V07). That is the *only* moment a version is picked.
- After the document exists, **picking is over.** It **locks** to its version. No second version menu.
  Clicking it opens the editor to edit / preview / re-send the one that's there.
- You **can't spin up a duplicate** while one exists.

**Only two states ever show:**
- **STATE A — nothing yet:** a "Create LOE" prompt (pick what to create).
- **STATE B — created:** the one document, locked to its version, click-to-open.

Never a standing dropdown of versions sitting beside a finished document — that's the current confusion.

---

## Decision tree

```
Open job → "LOE Quote & Valuation Details"
│
├─ No LOE created yet?  ──► STATE A
│     └─ [ + Create LOE ] button
│           └─ on click: version = NEWEST by default (V07)
│                 └─ (advanced reveal, optional) "Use a different version ▾"  ← only place a version is ever chosen
│                       └─ creates the LOE  ──►  STATE B
│
└─ LOE already exists?  ──► STATE B
      └─ shows ONE card:  "LOE · V07 · <status>"   (no version dropdown)
            └─ click ──► opens editor  (preview / edit / Send / re-send)
            └─ cannot create a second LOE while this one exists
```

- The version label on the card is **read-only history** ("made on V07"), not a selector.
- The e-sign modal stops being a *second* version picker — once a doc exists it opens *that* doc, locked.

---

## Status lifecycle (what STATE B's card reflects)

The created document carries a status; the card shows it and routes the click to the right action.
Ties into the closing-sequence roadmap:

```
Draft (created, not sent) → Sent (DocuSeal) → Signed → Paid
```

- Draft → click opens editor (edit + Send).
- Sent/Signed → click opens view + re-send (edit locks harder — see phase-2 lock semantics).

---

## Build-now guardrail — don't block the expansion (Ben, 2026-06-05)

Even though only the **LOE** exists today, build the simple version on a **typed-document foundation** —
don't hard-code an "LOE-only" flow. Treat the created thing as a **job document with a `type` (type #1 = LOE)**,
and build the "Create" control to take a **list of document types even when that list has one item.**

- We're capturing rich job info; the job must not be hostage to a single template/contract type.
- Result: adding new contract types later (Phase 2.1) is **additive** — register a new type — never a teardown.
- This is the only thing that must be right *now*; the rest of Phase 2 can wait. Ship functional + simple,
  just not painted into an LOE-only corner. **Not a blocker — a foundation choice.**

## Phase 2 — the more-extensive model (plan after)

The simple version above fixes the confusion. This is where it grows — capture now, build later:

1. **Multiple document TYPES per job.** The "Create" step becomes a small menu — LOE, then (future)
   Report, Invoice, Engagement Amendment, etc. The job grows a **per-job document shelf**, each item
   typed + versioned-at-creation + status-tracked. The picker scales by *document type*, never by adding
   more version dropdowns.

2. **Controlled SUPERSEDE / AMEND path** — the one real case you *do* need a new version after one
   exists (client rejected, scope change, re-engagement). NOT a free version menu — a deliberate
   **"Create amendment / new version"** action that supersedes the prior (kept as history) and re-picks
   the version *at that moment only*. Preserves the "pick-once, then locked" rule per document instance.

3. **Per-job editable-zone overrides** live on the created document (ties to the
   ECONTRACT-EDITOR-EVOLUTION-ROADMAP job-vs-template scope — a job's doc can carry per-job edits without
   touching the master template).

4. **Document HISTORY per job** — superseded/old documents retained, viewable (read-only), so the audit
   trail of what was sent/signed survives.

5. **Lock semantics by status** — Draft = editable; once **Sent** it soft-locks (view + re-send +
   supersede, no silent edit); once **Signed** it hard-locks (view + supersede only). Protects a
   client-executed contract from accidental change.

---

## Why this is cleaner

- **One mental model:** "what document does this job have," not "which template version is selected, in
  which of two places."
- **Version is an at-creation detail,** not an ongoing decision the user re-faces every visit.
- **Scales** to more document types and a real lifecycle without multiplying dropdowns.

> Core model = build now (fixes the two-picker confusion). Phase 2 = planned after, on Ben's sequencing.
> ui-designer owns the visual states; react-spec builds; co-architect tracks.

---

**Last reviewed:** 2026-06-09 by qa-agent — surfaced on the [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md) (Significant Features 3a) + brought to km-markdown standard (inline Tags/Entities for tag-search). Content unchanged.
