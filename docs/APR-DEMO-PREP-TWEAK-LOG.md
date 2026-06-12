---
title: APR Demo-Prep Tweak Log
status: active
created: 2026-06-12
updated: 2026-06-12
description: "Running checklist of the dashboard cascade / test-mode / notification tweaks for the client demo — so nothing gets lost."
tags: [apr-workflow, demo-prep, cascade, test-mode, notifications, checklist, loose-end]
---

# APR Demo-Prep Tweak Log

**Tags:** #apr-workflow #demo-prep #cascade #test-mode #notifications #checklist
**Entities:** [[APR-Dashboard]] [[ClickUp-Job-Hub]]

**↑ Home:** [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md)

Running list of every tweak from the demo-prep session so it's all written down. Everything checked is **on local now** — it reaches the live site only after a deploy (see Pending).

---

## Cascade behaviour

- [x] Cascade picker **stays active** after a Valcre number exists (was locking — killed the demo switch).
- [x] Cascade cluster **stays empty until you pick a scenario** — Fill holds it back; pick V1–V4 and the whole cluster (Value Scenarios, Property Rights, Approaches) comes alive together.
- [x] **Clear and Fill both snap it back** to the default-cleared look (picker says "pick a scenario", fields show placeholders).
- [x] "Set in Section 1" wording → **"from Section 1"** so every field reads consistently.
- [x] **Numbers removed from the field names** — no 1.1 / 1.2 / 2.1 in the names. Clean "from Status" / "from Property Type" / "from Section 1".

## Test data + Test Mode

- [x] The **client-form** test button now fills **all** Section-1 fields (Subtype, Tenancy, Valuation Premises) + two stale dropdown values fixed.
- [x] **Test Mode toggle** lives in the **top header beside the refresh button**, default OFF, not remembered between reloads.
- [x] Toggle OFF **hides** the Clear / Fill links so a real job can't be clobbered.
- [x] **Smart Fill** — if the job came from a real form submission, Fill **keeps Section 1** and only fills Section 2.
- [x] **Clear / Fill sit just above the divider line** (no gap pushing the form down).

## Notifications (the popups)

- [x] **Success popups gone app-wide** — no "saved / deleted / renamed / synced" ever.
- [x] **Only real errors pop** — small, top-centre.
- [x] In-flight shows a **quiet spinner**, no words.
- [x] Field-save failures **stay silent when there's no Valcre job** (just playing).
- [x] "New job created" popup removed.

## Fill with Test Data — fixed (was regressed)

- [x] **Section 2 was coming back empty** — Fill made two back-to-back saves and the second wiped the first (stale merge). Merged into one save.
- [x] **Section 1 was filling then reverting** — a save-error rollback snapped it back to empty. Removed the rollback.
- [x] **Verified field-by-field in the browser** — Sections 1–4 all fill; cascade cluster stays empty until you pick. Now matches the mock.
- [x] **Spec written** — [Test-Data Fill Spec](~/Development/APR-Dashboard-v3/docs/APR-TEST-DATA-FILL-SPEC.md): every field, empty vs filled. The contract that stops this regressing.

## LOE template editing — broken, needs real fix (NOT pre-meeting)

- [ ] **Only one tiny section is editable.** The editor isn't a real editor — it's a parser that hunts the LOE for old labelled chunks (intro / terms / action). The rebuilt v7 template doesn't have those labels, so it finds almost nothing.
- [ ] **Durable fix:** replace the brittle chunk-parser with a proper **rich editor** over the whole LOE, so a template change never breaks editing again. (Re-syncing the parser is the band-aid; the rich editor is the real answer.)
- [x] **The editor ALREADY EXISTS in the codebase — do NOT rebuild from scratch.** Full inline-editable document builder at `src/components/DocumentBuilder/` (EditorPane with contentEditable, FieldSidebar, PreviewPane, TemplateSelector, hooks/services/templates), wired to the `/document-builder-test` route. The LOE flow just isn't pointed at it — it uses the broken `TemplateEditorModal` + `templateParser`. **Next-session build = wire the LOE into the existing DocumentBuilder; verify it's functional; retire the chunk-parser.** Prior-art spec: `docs/Features/12-LOE-Esign/_Archive/TEMPLATE-EDITOR-DOCUMENT-MODE.md`. Live v7 markup to target: `docs/Features/12-LOE-Esign/loe07-build/LIVE-loe-template-v07-current.html`.

## Pending

- [ ] **Deploy to live** — everything above is on local; the live site still shows the old behaviour. _Your go._
- [ ] Small QA follow-up: a dedicated spinner for bare delete/rename actions that lack one today (low priority).
- [ ] _Parked (you deferred as unnecessary):_ a separate Test-Mode edit-lock toggle to prevent accidental syncs.

---

**Last reviewed:** 2026-06-12 by co-architect — created as the running demo-prep tweak log so the flurry of small changes is all written down in one place.
