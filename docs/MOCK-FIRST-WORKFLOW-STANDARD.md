---
title: Mock-First Workflow Standard
status: active
created: 2026-06-12
updated: 2026-06-12
description: "The standard for APR dashboard changes — dial it in on the HTML mock first, then wire the real app to match. Stops the design-and-build-at-once turmoil."
tags: [apr-workflow, process, standard, mock-first, doctrine-decision]
---

# Mock-First Workflow Standard

**Tags:** #apr-workflow #process #standard #mock-first #doctrine-decision
**Entities:** [[APR-Dashboard]]

**↑ Home:** [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md)

The rule for any dashboard UI / interaction change: **get it exactly right on the HTML mock first, then wire the real app to match it.** Never design and build in the real app at the same time.

---

## Why this exists

Designing *and* building at once in the real React app is where the turmoil comes from. The mock "just works" because it's plain HTML — no React state, no database, no save plumbing. The real app breaks on that hidden plumbing. When you change both the design and the wiring in the same pass, every regression looks like a mystery.

Mock-first removes the mystery: the mock becomes a **locked visual contract**, so the real-app job stops being "design and build" and becomes "make it match the mock" — a fixed target instead of a moving one.

## It's not just design — it's field validation against the registry

The bigger reason the mock lives **inside the registry HTML**: it's a **field-correctness gate**, not a design sandbox. As a field is added to the mock, it's cross-referenced against the registry on the spot:

- **Did the client actually ask for this field?** (Is it in the registry, or are we inventing it?)
- **Is it named the way the registry says?** (Naming dialled here, not renamed after deploy.)
- **Is it in the right section / right place?**

So "why are we adding this field, and does it belong here" gets answered against the registry **before** anything is wired — instead of discovering a wrong, misnamed, or misplaced field after it's already in deployed code. Design and field-justification happen together, in the one surface built for it. This is why the mock belongs in the registry HTML and not a generic design tool.

## The two surfaces

**Mock — the design surface (the HTML dashboard).**
- File: `public/field-registry-v6.html` (the current mock; cascade picker, pulse, dashboard fields).
- Cheap to edit, fully visual, no state/DB. UI designer owns it.
- Source of truth for **what it should look like and do.**
- Dial in layout, interaction, behaviour here until it's exactly right. Lock it.

**Local deployed — the wiring (the real React app).**
- The real `src/` app with React state + Supabase + the save plumbing.
- QA references the **locked** mock and wires the real app to match it — no guessing the target, because the mock already shows it.
- This is where the care goes: matching the mock's behaviour through the stateful layer.

## The flow

1. **Design on the mock** until the experience is exactly right (UI designer).
2. **Lock the mock** as the visual contract.
3. **Wire the real app to match** the locked mock (QA), referencing it directly.
4. **Verify the real app against the mock** — they should behave identically.

## What NOT to do

- ✗ Push design changes straight into the real app under time pressure (today's lesson).
- ✗ Change the design and the wiring in the same pass.
- ✗ Treat the real app as the design surface — it's the implementation surface.

## Applies to

- Dashboard layout / fields / sections.
- Cascade / test-mode / fill behaviour.
- The LOE document-mode editor (prove it on the mock, then wire the real app's existing `DocumentBuilder` to match).

---

**Last reviewed:** 2026-06-12 by co-architect — created after a rushed real-app push caused cascading regressions; locks mock-first → wire-second as the standard (Ben's call).
