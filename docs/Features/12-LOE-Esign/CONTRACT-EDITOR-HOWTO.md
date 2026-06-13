# How the Editable Contract Works — and How to Make Any Template Editable

_The approach we landed on 2026-06-13. The big idea: editability lives in the **HTML**, not in editor code. Mark a template once and the editor knows what to do — for any letter, forever._

---

## The core idea (read this first)

The editor is **dumb on purpose.** It doesn't know it's an LOE. It just reads two things from the template's HTML and renders accordingly:

- A block tagged **`data-editable`** → becomes an editable text box.
- Everything else → shown as-is (locked).

So to make a new letter (thank-you letter, anything) editable, you don't touch editor code — you **mark its HTML once.** Same editor, every template.

**Philosophy we settled on: make everything editable.** Clients export to Word and edit freely anyway, so locking things just created confusion. Every paragraph is a box. The only things kept out are the **signature/date anchors** (DocuSeal needs those intact or e-sign breaks) and the **field-labels** (those become the small titles above each box).

---

## How to make a template editable (the whole recipe)

**1. Mark the HTML.** Run the marker script on the template file:

```bash
python3 ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/mark-editable.py \
  <source.html> <marked-output.html>
```

It adds `data-editable="ed-N"` to every `<p>` and `<li>` that carries real content, and `data-removable` to each `<h1>` (for the future X-to-delete). It **skips** signature/date anchors, images, and field-labels. One simple rule, runs on any V07-style letter.

**2. Load it into the template list** (`loe_templates` table) as a row. The editor reads `template_html` from there.

**3. That's it.** Open the job → Create Contract → pick the template → Edit Contract. The editor parses the markers and shows the boxes, grouped by section.

---

## What the editor does with the markers (so you can reason about it)

- **Parses** the marked HTML (`src/utils/loe/templateParser.ts` → `parseByMarkers`) into a list of editable sections, each tagged with its **section title** (the numbered heading it lives under) and its **field label** (e.g. "Property Name").
- **Groups** them in the panel: the section number/title shows **once** as a header; the boxes sit under it. Numbered subsections (14.1–14.10) keep their own numbers. Boxes with no field name get a small auto-number (1, 2, 3…) matching the list numbers on the page.
- **Live preview** on the right re-renders as you type.
- **Saving** writes the edited HTML as a **client contract** (`job_contracts`), never back to the template — so the master is never touched, and each edit is its own saved version.
- **Data fields** (client, fees, dates) are already filled from the job before you see them; editing one just overrides it in *that* contract copy. It can't break anything upstream (the job, Valcre, ClickUp are untouched).

---

## Hard rule — never make these editable

- **Signature / date / text anchors** (`<signature-field>`, `<date-field>`, `<text-field>`) — DocuSeal places the real signature + date on these. Turn them into text and e-sign breaks. The marker script already skips them; keep it that way.

---

## Files

| File | Role |
|---|---|
| `docs/Features/12-LOE-Esign/loe07-build/mark-editable.py` | The marker script — run on any template HTML |
| `src/utils/loe/templateParser.ts` | Reads markers → editable sections (`parseByMarkers`), rebuilds on save (`reconstructByMarkers`) |
| `src/components/dashboard/job-details/actions/TemplateEditorModal.tsx` | The "Edit Contract" editor — grouped boxes + live preview |
| `src/utils/loe/jobContracts.ts` | Saved client contracts (load/save/markSent) |
| `loe_templates` (Supabase) | The template shells |
| `job_contracts` (Supabase) | Saved per-client contracts |

---

## Current templates (after 2026-06-13 cleanup)

- **LOE-07 v2** — the editable one, opens by default in the editor.
- **LOE-07 v1** — the prior plain V07, kept as the verified send template + fallback.
- **V07 - LOE-07 (May-25)** — archival; can't be removed (a sent LOE references it).

_Old V1/V2/V3 originals were deleted (unreferenced). Future templates (thank-you letter, etc.) just get marked with the script above and added to the list — no editor changes._
