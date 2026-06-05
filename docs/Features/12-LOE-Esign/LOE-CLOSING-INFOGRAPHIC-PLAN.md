---
content_type: roadmap-infographic
title: LOE Closing Sequence — Canvas Infographic Plan (the closing roadmap visual)
status: active — living roadmap; sandbox path unblocks the build
owner: ui-designer (canvas) · co-architect (roadmap) · react-spec (wiring)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
tags: [apr-workflow, closing-sequence, loe, docuseal, quickbooks, sandbox, thank-you-page, paid-trigger, data-flow, paper-canvas]
keywords: [LOE closing sequence, sign to thank-you to quickbooks to paid, closing infographic, payment portal, paid webhook trigger, quickbooks sandbox reenact flow]
related: [~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/CLIENT-CLOSING-SEQUENCE-ROADMAP.md, ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-PAYMENT-INTEGRATION-RESEARCH.md, ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-MERCHANT-APPLICATION-HOWTO.md, "~/Development/APR-Dashboard-v3/Data-Flow Visuals/01-Data-Flow-Diagram.md"]
---

# LOE Closing Sequence — Canvas Infographic Plan

> **Closing-sequence cluster (one category):** this infographic plan (the visual map) pairs with
> the [Closing Sequence Roadmap](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/CLIENT-CLOSING-SEQUENCE-ROADMAP.md)
> (the plan), the [QuickBooks research](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-PAYMENT-INTEGRATION-RESEARCH.md),
> and the [merchant-account how-to](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-MERCHANT-APPLICATION-HOWTO.md).
> **Sandbox unblock (per QA):** a QuickBooks SANDBOX can reenact the full sign→thank-you→pay→paid
> flow WITHOUT waiting on the real merchant-account approval — so the build isn't gated on Ben's
> application. (Sandbox specifics being captured from QA → folded into the QB research doc.)
> It extends the [data-flow board](~/Development/APR-Dashboard-v3/Data-Flow Visuals/01-Data-Flow-Diagram.md) to the right of the LOE stop.

**By:** ui-designer (dev-4) · **Date:** 2026-06-04
**Source of truth:** `CLIENT-CLOSING-SEQUENCE-ROADMAP.md` (Ben's vision) + the live data-flow board (page 4-0, below the "APR Dashboard Below" divider).
**Goal:** extend the data-flow board into a **client-presentable infographic** that shows the whole journey — intake → job prep → Valcre/ClickUp → LOE → **email → sign → thank-you → QuickBooks payment → paid** — with phase icons and connecting flow lines, and (phase 2) cool Nano-generated phase imagery.

---

## The downstream stages to add (from the roadmap)

These extend the board to the RIGHT of the existing LOE (e-sign) stop. Several are **coming soon** — we add placeholder/diagram blocks now and swap in real screenshots as each ships.

| # | Stage | What the block shows | Asset status |
|---|---|---|---|
| 5 | **Client Signing Email** | the email sent to the client with the DocuSeal sign link | ⏳ coming soon — Ben re-engaging the email; screenshot when sent. Placeholder/mock for now. |
| 6 | **Thank-You Page (post-signing)** | what the client sees after signing; leads to payment | 🎨 **ui-designer mocks it + screenshots** (my deliverable per roadmap) |
| 7 | **QuickBooks Payment Portal** | the payment link/portal in the email or thank-you page; amount = the quote/LOE fee | ⏳ research in flight (forks QB-1/QB-2). Use an example/diagram/picture of a QB payment link until the real one exists. |
| 8 | **Paid Trigger** | QuickBooks "paid" webhook → dashboard status flips to Paid | ⏳ coming soon (react-spec, mirrors DocuSeal-signed trigger). Diagram block. |

Trigger chain (mirrors the existing ClickUp automation): **DocuSeal LOE sent → signed (webhook) → auto-send QB payment link + thank-you → QB paid (webhook) → dashboard "paid".**

---

## The infographic concept (Ben's direction — to refine together)

Turn the board from a row of screenshots into a **flow infographic**:

- **Phase icons** for each stop — e.g. a form (intake), a database/sync (Valcre/ClickUp), a document+pen (LOE/sign), an **envelope (client email sent)**, a **signature/checkmark (client signing)**, a **credit-card/dollar (QuickBooks payment)**, a **paid stamp (paid)**.
- **Connecting flow lines / arrows** between each stop — left→right, so the eye follows the journey from one phase to the next.
- **Two layers per stop:** the icon + label band on top (the infographic), the actual screenshot tile below it (the proof). So it reads as a clean infographic at a glance, with real evidence underneath.
- **Phase 2 — Nano imagery:** generate a polished illustrative image per phase with Nano image-gen (`~/Development/Nanobanna-img-gen/`, prose-prompt rule) — multiple cool images, one per phase, for a really sharp client-facing version. We discuss the style first.

> Build order: (1) finalize the screenshot board (done) → (2) add icons + connecting lines over the existing stops → (3) add the coming-soon stages as placeholder blocks → (4) Nano phase imagery once we lock the look. Ben + ui-designer discuss the visual direction before the Nano pass.

---

## Note for react-spec / co-arch — ClickUp card date tracker

The ClickUp card's status tracker currently shows **"Date Received"** only. It needs the full set, **connected to DocuSeal**:

- **Date Received** (intake)
- **Date Sent** — DocuSeal "sent" event (LOE emailed to client)
- **Date Signed** — DocuSeal "completed" event (client signed)

These are the `▸ LOE Sent` / `▸ LOE Signed` tracker lines the `docuseal-webhook` is meant to fill (see the ClickUp section in `DASHBOARD-FIELD-CATALOG.md`). Wire Sent + Signed to the DocuSeal webhook events so the card reflects the live signing status, not just received.

> Also carried open: "Date Received" — intake-side or signing-driven? (roadmap open question for Ben.)

---

## My next actions

1. **Mock the thank-you page** (my roadmap deliverable) → screenshot → it becomes the Stage-6 block.
2. Stand up the **infographic layer** (icons + flow lines) over the existing board once we agree the look.
3. Add **coming-soon placeholder blocks** for stages 5/7/8 so the full journey is visible now.
4. **Nano phase imagery** after we lock the visual direction.
