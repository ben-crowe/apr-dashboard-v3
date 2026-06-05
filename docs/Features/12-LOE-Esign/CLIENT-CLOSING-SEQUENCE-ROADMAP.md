---
content_type: roadmap
title: Client Closing Sequence — sign → thank-you → QuickBooks payment → paid trigger
status: roadmap (Ben vision 2026-06-04)
owner: co-architect coordinates
home: 00-APR-MASTER-DASHBOARD.md
tags: [apr-workflow, closing-sequence, docuseal, quickbooks, thank-you-page, paid-trigger]
related: [LOE-DOCUSEAL-ARCHITECTURE.md, WIRING-SPEC-intake-clickup-chain-2026-06-04.md, CLIENT-CLOSING-SEQUENCE-ROADMAP.md]
---

# Client Closing Sequence — Roadmap

The final phase: take a signed LOE all the way to a paid client, automatically. Ben's vision, 2026-06-04.

## The sequence (each step triggers the next)

1. **E-signature send + sign trigger** — establish + RE-TEST how the LOE DocuSeal e-sign gets sent to the client and how the signing completes. Believed tested previously (see DocuSeal arch doc + prior session notes — checkpoint #304 proved LOE-07 render + DocuSeal anchors + Chris sig). RE-ENACT on the live LOE-07 doc.
2. **Client signing email** — the email sent to the client containing the sign link. Ben has partially established this; Ben re-engaging.
3. **Thank-you page (post-signing)** — what the client sees after signing. ui-designer mocks it + screenshots. MUST embed/lead to the payment portal.
4. **Payment portal (QuickBooks)** — the thank-you page AND/OR a follow-up email carries a QuickBooks payment link/portal. **Amount = the quote amount (the LOE fee).** Auto-sent on signing completion (DocuSeal signed event → fire the payment send).
5. **Paid trigger** — when the client pays in QuickBooks, a webhook/trigger fires back into the APR dashboard (status → paid), mirroring the existing DocuSeal-signed trigger pattern.

## Trigger chain (mirrors the existing 4-stage ClickUp automation)
DocuSeal LOE sent → DocuSeal signed (webhook) → auto-send QuickBooks payment link (amount = quote) + thank-you page → QuickBooks paid (webhook) → dashboard "paid" trigger.

## Research in flight (forked agents, 2026-06-04)
- **QB-1:** QuickBooks payment integration options — QB Payments API / Intuit Payments / payment links / hosted invoices: how to generate a payment link or portal for a specific amount (the quote), and how to detect "paid" (webhook).
- **QB-2:** flow/architecture — how to auto-send the payment link in a post-DocuSeal-signing follow-up email + thank-you page, and wire a "paid" webhook back to a dashboard trigger.

## Owners
- Sign trigger re-test: QA (current e-sign→LOE thread) + co-arch.
- Signing email: Ben.
- Thank-you page + screenshots: ui-designer.
- QuickBooks integration: research forks now → react-spec wires after research lands.
- Paid trigger: react-spec (mirrors DocuSeal-signed trigger).

## Open question for Ben
- "Date Received" card field — intake-side or signing-driven? (carried from the ClickUp chain spec)
