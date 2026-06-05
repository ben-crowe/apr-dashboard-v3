# V07 → App Template Reconciliation (plan — hold changes)

**Status:** investigation + plan · **Date:** 2026-06-05 · **Author:** react-specialist · **Hold:** no DB changes until Ben's go.
**Trigger:** Ben/ui-designer — the app e-sign previewer/editor renders a DIFFERENT template ("V3 - Current") than the v07 we've been perfecting; none of our work reaches a real client.

---

## 1. The map — V3-Current vs LOE-template-v07.html (they are two parallel templates)

| | **V3 - Current** (app, live) | **LOE-template-v07.html** (our work) |
|---|---|---|
| Where it lives | `loe_templates` DB row, **version 5** | a FILE on disk (+ a STALE `loe_templates` v6 row) |
| Active / default | **is_active = true, is_default = true** | v6 row: **is_active=false, is_default=false** (dormant); file: not in DB |
| Size | ~189 KB | ~56 KB |
| Layout | **web-flow** (`max-width:800px`, system fonts, screen CSS) | **print-paginated** (`@page`, CSS counters, navy letterhead, footer) |
| Token format | **lowercase dotted** — `[name]`, `[client.firstname]`, `[intendeduses]`, `[valuescenarios]` (23 tokens) | **PascalCase** — `[ClientFirstName]`, `[AuthorizedUse]`, `[ValueScenario1]`, `[EA/HCSummary1]` |
| Mapper that fills it | `mapDataToV3Fields` (because version < 6) | `mapDataToV07Fields` (version ≥ 6) |
| Our work present? | **No** — old logo, no cascade, no §10 suppression, no counter-renumber, no narratives | **Yes** — all of it (logo, cascade, suppression, narratives, design) |

**Verdict:** v07 is the **redesign meant to REPLACE V3**, not a variant of it. They don't share a layout *or* a token vocabulary — so you can't paste v07's body into the V3 row; the **version number drives which mapper fills the tokens**, so v07 must enter the store as a **version ≥ 6** row to fill correctly.

**Why our work never reached the app:** every edit (logo, cascade, suppression, etc.) went into the FILE. The FILE was never loaded back into `loe_templates`. The dormant v6 "V07" DB row is an **old snapshot** from before these edits — confirmed: it has none of the counter CSS / EA/HC fences / rebuilt logo.

---

## 2. Canonical — which template the e-sign send actually transmits

The send path is `LoeQuoteSection → generateLOEHTML(job, jobDetails)` with **no explicit template id**. Selection logic in `loadTemplateRow` (`generateLOE.ts`):

> explicit HTML → job's chosen id → **NEWEST *ACTIVE* version** → fallback.

It keys on **newest is_active=true**, NOT the `is_default` flag. Current active rows: v5 (V3), v4, v3. **v6 (V07) is is_active=false, so it's excluded.** → The newest active is **v5 = V3-Current**, so:

- **The e-sign send renders V3-Current (v5) and transmits THAT to DocuSeal.** Mapper = `mapDataToV3Fields`.
- The preview/editor modal separately picks the `is_default` row = also V3-Current.
- **So both preview and send = V3 today.** A client receives the old web-style contract with the old logo and none of our work. Confirmed canonical.

---

## 3. Path — get v07 into the template the app uses (3 steps, all behind Ben's go)

The cascade + suppression are already version-gated (`version ≥ 6 → mapDataToV07Fields` + conditional logic), so the ONLY thing standing between our work and the live flow is **getting the current v07 FILE into an active loe_templates row at version ≥ 6.**

1. **Load file → DB.** Push the current `LOE-template-v07.html` contents into a `loe_templates` row at **version ≥ 6** — either UPDATE the existing v6 "V07" row's `template_html` (refreshes the stale snapshot; recommended — keeps one V07 row) or INSERT a fresh **version 7**. Either way the version-≥6 gate selects `mapDataToV07Fields`, so the PascalCase tokens + cascade + suppression all resolve.
2. **Activate.** Set that row **is_active = true** so it enters the "newest active" selection → the **send path** auto-switches to v07 (newest active version wins).
3. **Default.** Set **is_default = true** (and unset V3's) so the **preview/editor modal** also shows v07. Now editor + previewer + e-sign all match the Paper-canvas design.

**Token sanity (verified):** v07's file tokens are exactly the `mapDataToV07Fields` keys; the 2 DocuSeal anchors (`<signature-field>` / `<date-field>`, role "First Party") are in the file. So fields, cascade, §10, and signing all resolve once it's the active version. No token rewrite needed.

### Caveats / decisions for Ben

- **This IS "go live with the new contract."** Steps 2–3 flip the dormant flags — the exact `is_active`/`is_default` change I've been told to hold. Needs Ben's explicit go (it changes what clients receive).
- **Middle option (review without full go-live):** do step 1 + set **is_active=true but is_default=false**. Then v07 becomes selectable in the editor's template dropdown for in-app review — BUT note the send path keys on *newest active*, so activating v6/v7 would ALSO make it the send default. To preview-only without changing sends, we'd instead load it as a **draft** the modal can pick by id without activating. Cleanest "just let Ben see it in-app" = step 1 + temporary is_active, on a throwaway, then revert. Flag: there's no true "inactive-but-previewable" slot today.
- **Source-of-truth going forward.** Once v07 is the live DB row, the FILE and the DB row can drift (file edits don't auto-sync). Decide the canonical source: keep editing the FILE then re-push on each change (file = source), or edit via the in-app editor (DB = source). Recommend **file = source** until the design settles, with a one-command file→DB push.
- **Old V3 rows.** Leave V1/V2/V3 active for rollback, or deactivate after v07 is proven. Ben's call.

---

## 4. Recommended sequence (on Ben's go)

1. Refresh the v6 "V07" row `template_html` from the current file (file → DB push).
2. Re-render through the **real app path** (not Chrome-direct) on VAL261101 to confirm `mapDataToV07Fields` + cascade + suppression fire identically to the file render (name-match guard first).
3. Flip v07 **is_active = true, is_default = true**; set V3 **is_default = false**.
4. Verify in-app: editor + previewer + a test e-sign all show the v07 design with the rebuilt logo + populated §10.
5. Keep V3 active (not default) as rollback.

**Holding all of the above until Ben confirms go-live.**

---

## Sources
- `src/utils/loe/generateLOE.ts` — `loadTemplateRow` (newest-active selection), `getMapperForVersion` (≥6 → v07 mapper)
- `src/components/dashboard/job-details/actions/LOEPreviewModal.tsx` — preview picks `is_default`
- `loe_templates` table — v5 (V3, active+default) vs v6 (V07, dormant); v07 row is a stale pre-edit snapshot
- `docs/Features/12-LOE-Esign/loe07-build/LOE-template-v07.html` — the current v07 design (file = our work)
