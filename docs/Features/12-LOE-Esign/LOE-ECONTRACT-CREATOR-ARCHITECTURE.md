# LOE eContract Creator — App Architecture (explainer)

**Status:** reference · **Written:** 2026-06-05 · **Author:** react-specialist · **Scope:** explain-only (no code changes)
**Anchored on:** the real LOE Preview header Ben pointed at — *LOE Preview / Review Letter of Engagement before sending to client / Template: V3 - Current Template · Set Default · 75% · Edit Template / E-signature will be sent to…*

This doc explains the app surface behind that header: how the preview renders, what "Edit Template" actually opens, how templates are versioned, and whether there's an in-app edit-in-canvas page-builder. It feeds the future **editable-areas** discussion (e.g. making §10 EA/HC user-editable).

---

## 0. The one-paragraph answer

The LOE preview is a **read-only rendered page** (an iframe showing the finished contract). "**Edit Template**" does **not** open a draw-on-the-page builder — it opens a **section-by-section text editor** (a column of text boxes, one per editable block of the letter). You edit the *words* in those boxes; the app stitches them back into the HTML and saves the result as a **new template version** in the database. So today there is **no direct edit-in-canvas** — the preview is for looking, the editor is text-boxes-beside-a-preview. That's the gap a future "editable areas" feature would close.

---

## 1. The two "V3"s — do not blur them

There are **two independent tracks** that both happen to say "V3," and Ben/Chris should keep them mentally separate:

**Contract-template track** — *"Template: V3 - Current Template"* in the preview header.

- This is a row in the **`loe_templates`** database table. The whole HTML letter lives in one column (`template_html`).
- Versions today (live): *V1 - Original*, *V2 - Updated*, **V3 - Current Template (the default)**, *V07 - LOE-07 (May-25 contract)*.
- "V3 - Current" is the one marked **default + active**, so it's what every preview/send uses. **V07 exists but is dormant** (not default, not active) — it's the new design we've been rendering locally, not yet switched on.

**Field-registry track** — *"Valta Master Field Registry v03 / v3.1."*

- That's the **field dictionary** (what each field means, its dropdown options, how it maps to Valcre). It governs the *data*, not the *letter layout*.
- It has nothing to do with the `loe_templates` version. A registry update changes field behavior; a template-version change swaps the letter body.

> **Plain version:** one "V3" is *which letter design is live*; the other "V3" is *the master list of fields and their rules*. Same number, unrelated tracks.

---

## 2. The Preview Area — how the page renders

Component: **`LOEPreviewModal.tsx`** (`src/components/dashboard/job-details/actions/`).

Pipeline, in order:

1. **Load templates** — `loadAllTemplates()` reads the `loe_templates` rows; the default one is selected. The dropdown (*Template: V3 - Current* + *Set Default*) lets you switch which row renders, and `setDefaultTemplate()` flips the app-wide default.
2. **Fill it** — `generateLOEHTML(job, jobDetails, template_html)` takes the chosen template's HTML and **replaces every `[Token]` with the job's real data** (the same mapper layer behind the LOE itself), and applies the conditional-section logic (drop Schedule A / §10 when they don't apply).
3. **Scale it** — the **75%** control is a zoom: the filled HTML gets a CSS `zoom`/`transform: scale()` wrapper sized to the chosen percent.
4. **Show it** — the scaled HTML is turned into a Blob URL and dropped into a sandboxed **`<iframe>`**. That iframe is the preview you see.

Key point: **the iframe is display-only.** You cannot click into the letter and type. It re-renders whenever the template, the data, or the zoom changes.

---

## 3. "Edit Template" — what it actually opens

Button at the top of the preview → opens **`TemplateEditorModal.tsx`**. This is the closest thing to an in-app builder today, and here's exactly how it works:

- **It parses the letter into editable sections.** `templateParser.ts` (`parseTemplate`) runs regex over the template HTML and pulls out a handful of **text blocks** — the subject line, the intro paragraph, certain table cells, the closing statement, the terms & conditions — and strips the HTML tags so you see plain text.
- **Each block becomes a text box.** The editor shows a column of auto-resizing **textareas**, one per parsed section, beside a live preview. You edit the *words*.
- **Field placeholders are protected.** On save it compares the `[field]` tokens before and after; if you accidentally deleted or changed one, it **blocks the save** with a warning. So the data-wiring can't be broken by editing prose.
- **Reconstruct + save as a new version.** `reconstructHTML()` slots your edited text back into the original HTML wrappers, then `saveTemplate()` **inserts a brand-new `loe_templates` row** (you name it; optionally tick "set as default"). Edits are **app-wide template versions**, not per-job.

So the edit model is: **structured text-box editing of named sections → reconstruct → new saved template version.** It is **not** contentEditable, **not** a drag-block builder, **not** a free-form HTML canvas, and there is **no per-job edited copy** that persists (an unsaved tweak lives only in memory for that one send).

---

## 4. The Recipient block — the send safeguard

At the bottom: *E-signature will be sent to: bc@crowestudio.com … (Testing: …, Client: edward.johnson…@test.com) · Change Recipient.*

- The recipient defaults to **bc@crowestudio.com** (the developer/testing inbox), **not** the client — a deliberate guard so test sends don't reach a real client.
- When the recipient differs from the job's client email, the UI shows the **"(Testing: X, Client: Y)"** note so it's obvious you're in test mode.
- **Change Recipient** swaps in a different address for this send. The real client email comes from the job record.

---

## 5. Edit-in-canvas: verdict + what "editable areas" would take

**Does a direct in-canvas HTML page-builder exist today? No.** The preview is a read-only iframe; "editing" is the section-textarea modal in Section 3.

To make a specific region **user-editable in the preview itself** (the future ask — e.g. let an appraiser hand-edit the §10 EA/HC text in place), the building blocks would be:

- **Editable zones** — mark which parts of the letter are user-editable (the rest stays locked). The cleanest hook is the *same comment-fence pattern we already use for conditional sections* (`<!-- SECTION-EAHC -->`) — a fence can equally mark "this block is editable."
- **An edit surface** — either `contentEditable` regions inside the rendered page, or a light block model overlaid on the preview. (Note the React-controlled-input caveat: contentEditable needs careful state handling, not raw value-assignment.)
- **A persistence decision (the real question for Ben/Chris):** when someone edits an area, does it save as **(a)** a new template version (app-wide, like today), or **(b)** a **per-job override** (this one job's letter differs, template untouched)? There's no per-job override table today — that's the main new piece an editable-areas feature would need.
- **Token vs prose boundary** — editable zones must still protect `[field]` tokens (the editor already does this for the text-box flow; the same guard would apply in-canvas).

> **Bottom line for the editable-areas discussion:** the §10 work we just did (fenced, conditional, auto-renumbering sections) is actually the right foundation — the same fences that let a section *drop* could let a section become *editable*. The missing piece isn't the rendering; it's deciding **where per-job edits live** (new version vs job override) and adding that storage.

---

## Sources
- `src/components/dashboard/job-details/actions/LOEPreviewModal.tsx` — preview modal (iframe render, zoom, template dropdown, recipient)
- `src/components/dashboard/job-details/actions/TemplateEditorModal.tsx` — section-textarea editor ("Edit Template")
- `src/utils/loe/templateParser.ts` — `parseTemplate` / `reconstructHTML` (section carve + stitch)
- `src/utils/loe/saveTemplate.ts` — `saveTemplate` / `setDefaultTemplate` (new-version insert, default flip)
- `src/utils/loe/generateLOE.ts` — `generateLOEHTML` (token fill + conditional sections)
- `loe_templates` table — template-version rows (V1/V2/V3-default/V07-dormant)
