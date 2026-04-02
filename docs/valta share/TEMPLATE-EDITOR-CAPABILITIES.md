# LOE Template Editor — Capabilities & Limitations

**Prepared by:** react-specialist
**Date:** 2026-04-02
**Purpose:** Determine whether the editor UI or code changes are needed for client LOE updates.

---

## A. Sections Extracted by parseTemplate()

The parser extracts **5 named section types** (not 7). The actual count of sections varies based on table rows in the template.

| # | Section ID | Label | CSS Selector / Regex | Type |
|---|-----------|-------|---------------------|------|
| 1 | `subject-line` | Subject Line | `/<div class="subject-line">([\s\S]*?)<\/div>/` | `other` |
| 2 | `intro` | Introduction Paragraph | `/<div class="intro">([\s\S]*?)<\/div>/` | `intro` |
| 3 | `table-row-N` (one per row) | Row header text (e.g. "Property") | `/<tr>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/g` | `table-cell` |
| 4 | `action` | Closing Statement | `/<div class="action-section">\s*<p>([\s\S]*?)<\/p>\s*<\/div>/` | `other` |
| 5 | `terms` | Terms & Conditions | `/<ol class="terms-list">([\s\S]*?)<\/ol>/` | `term` |

**Not parsed (read-only in editor):**
- Company logo / letterhead header
- Date and client address block
- Signature block (Sincerely, company name, signature image, client signature/date lines)
- DocuSeal signature-field/date-field tags
- Base64 images

---

## B. Table Rows — Can the Editor ADD New Rows?

**NO.** The editor can only edit the **value cell text** of existing `<tr>` rows. The parser uses a global regex to find all `<tr><td>...<td>...</tr>` patterns and creates one `table-row-N` section per row found.

There is no UI or logic to:
- Insert a new `<tr>` row
- Delete an existing row
- Reorder rows
- Add/remove columns

**To add a new table row (e.g., "Retainer Paid Date"), you must modify the template source code** (v3Template.ts or the stored HTML in loe_templates DB).

---

## C. Can the Editor ADD New [bracket] Placeholders?

**YES, but with a critical guard.** The user can type `[new.placeholder]` into any editable textarea. However, `handleSaveClick()` (line 206-222) compares the set of placeholders before and after editing:

```typescript
if (JSON.stringify(originalPlaceholders) !== JSON.stringify(sortedEdited)) {
  toast.error('Warning: Field placeholders have been modified!');
  return; // BLOCKS SAVE
}
```

This means:
- **Adding** a new placeholder like `[client.phone]` will be BLOCKED on save — the count/list won't match.
- **Removing** a placeholder will also be BLOCKED.
- **Changing** a placeholder name (e.g. `[client.name]` to `[client.fullName]`) will be BLOCKED.
- Only **editing surrounding text** while keeping all existing placeholders intact is allowed.

**To add new placeholders, you must modify the template source code AND update the placeholder validation logic.**

---

## D. Does reconstructHTML() Preserve Non-Edited Content?

| Content Type | Preserved? | How |
|-------------|-----------|-----|
| **[bracket] placeholders in unedited sections** | YES | `reconstructHTML()` starts with `originalHTML` and only replaces sections that exist in `editedSections` Map. Unedited sections are untouched. |
| **[bracket] placeholders in edited sections** | YES, if user doesn't delete them | The text is stored as plain text. If the user keeps `[client.name]` in the textarea, it passes through. The save guard (see C above) blocks save if any placeholder changes. |
| **DocuSeal signature-field / date-field tags** | YES | These tags are NOT inside any parsed section (they're in the signature block which is read-only). The parser never touches them. `reconstructHTML()` only replaces matched section regions. |
| **Base64 embedded images** | YES | Images (logo, signature) are in the header/footer which the parser doesn't extract. They remain in `originalHTML` untouched. |
| **CSS class names and styling** | MOSTLY YES | The `<div class="intro">`, `<div class="action-section">`, `<ol class="terms-list">` wrappers are preserved. However, `escapeAndFormatHTML()` converts newlines to `<br>` and escapes all HTML entities. Any inline HTML styling in edited content (bold, italic, links) will be escaped to literal text. |

**Key risk:** If a section contains inline HTML like `<strong>bold text</strong>`, editing that section will escape it to `&lt;strong&gt;bold text&lt;/strong&gt;` — the formatting will appear as literal angle brackets in the output.

---

## E. Can the Editor Add Entirely New Sections?

**NO.** The parser extracts a fixed set of sections based on CSS class selectors. The editor UI renders only those extracted sections. There is no:
- "Add Section" button
- Free-form HTML insertion
- Drag-and-drop section reordering

**To add a new section (e.g., Scope of Work between the fee table and closing), you must modify the template source code.** You would also need to add a new regex pattern in `parseSections()` and a new reconstruction block in `reconstructSections()` for the editor to recognize it.

---

## F. What Happens When T&C Text is Edited?

The T&C section has special handling:

1. **Parse:** The parser walks `<li>` tags inside `<ol class="terms-list">`, handles nested `<ol class="terms-sublist">`, and joins all terms with `\n\n` double-newline separators into one big string.

2. **Edit:** The user sees one large textarea with all terms separated by blank lines.

3. **Reconstruct:** On save, the edited text is split by `\n\n` back into individual terms. Each term is matched by index to the original `<li>` items.

**Preserved:**
- `<ol class="terms-list">` wrapper — YES
- Individual `<li>` wrappers — YES (reconstructed from split)
- Nested `<ol class="terms-sublist">` — YES (matched by index to original, nested HTML preserved)

**NOT preserved:**
- If the user changes the NUMBER of terms (adds/removes a `\n\n` separated block), the index matching breaks. Extra terms get simple `<li>` wrappers. Removed terms lose their nested sublists.
- Any inline HTML within a term (bold, links) is escaped via `escapeAndFormatHTML()`.

**Bottom line:** Editing term TEXT is safe. Adding/removing/reordering terms risks losing nested sublist structure.

---

## G. Where is the Saved Template Stored?

**Supabase `loe_templates` table.** NOT v3Template.ts.

The save flow:
1. User clicks "Save Template" in TemplateEditorModal
2. Placeholder validation runs (blocks if placeholders changed)
3. `reconstructHTML()` produces final HTML
4. `saveTemplate()` in saveTemplate.ts INSERTs a new row into `loe_templates` table with:
   - `name` — user-provided template name
   - `template_html` — full reconstructed HTML
   - `is_default` — boolean (if checked, all other defaults are unset first)
   - `version` — always 1 (no versioning logic)

**v3Template.ts is the SOURCE template** used to generate the initial HTML via `generateLOEHTML()`. Saved templates in the DB are COPIES of the generated output with user edits baked in. They are full HTML documents, not template source.

**Template selection flow:**
- LOEPreviewModal loads all templates from `loe_templates` via `loadAllTemplates()`
- User can pick a saved template from a dropdown
- Selected template's HTML is re-run through `generateLOEHTML()` to inject current job data
- "Default Template" option uses v3Template.ts directly

---

## Summary: What Requires Code vs Editor

| Change | Editor? | Code? |
|--------|---------|-------|
| Edit intro/closing text | YES | NO |
| Edit existing table cell values | YES | NO |
| Edit T&C wording | YES (careful) | NO |
| Edit subject line boilerplate | YES | NO |
| Add new table row | NO | YES — modify v3Template.ts |
| Add new [placeholder] | NO | YES — modify template + parser validation |
| Add new section (e.g., Scope of Work) | NO | YES — modify template + parser + reconstructor |
| Change header/footer/logo | NO | YES — modify v3Template.ts |
| Change signature block | NO | YES — modify v3Template.ts |
| Reorder table rows | NO | YES — modify v3Template.ts |
| Add/remove T&C terms | RISKY | YES — safer via code |

---

## Cross-Reference: LOE-DOCUSEAL-ARCHITECTURE.md

Verified against the architecture doc (docs/Features/12-LOE-Esign/LOE-DOCUSEAL-ARCHITECTURE.md). Key alignments and additions:

### Field Count
Architecture doc lists **20 mapped placeholders** in `mapDataToV3Fields()`. The editor's save guard compares these 20 against edited content. Any change to this set requires updating both v3Template.ts AND generateLOE.ts (the `mapDataToV3Fields` function).

### Template Source vs Saved Templates
- **v3Template.ts** = source template with `[bracket]` placeholders (static code constant)
- **generateLOEHTML()** = replaces placeholders with real job data, producing final HTML
- **loe_templates DB** = stores edited copies of the FINAL HTML (placeholders already replaced), not the source template
- **Editor edits FINAL HTML** (post-replacement), so what's in the editor textareas is rendered text, not template source

This means: if the editor saves a template, it saves a snapshot of the generated HTML with that job's data baked in. When loading a saved template for a different job, `generateLOEHTML()` is called again with the saved template HTML — but the old job's data is already in the HTML text. The re-generation step re-runs placeholder replacement, but since placeholders were already replaced in the saved copy, it only affects placeholders that were preserved in the editor.

### DocuSeal Signature Tags
Architecture doc confirms `<signature-field>` and `<date-field>` tags are in the signature section (pages 2-3). The parser does NOT extract this section — it's read-only in the editor. These tags are safe from editor modifications.

### Architecture Doc's Own Recommendation
Section 9.1 flags the hardcoded template as tech debt and recommends "database-driven template system." Section 10.2 proposes a `loe_template_sections` table for per-section editing. The current editor is a partial implementation of this vision — it parses sections from HTML but doesn't use a sections table. The `loe_templates` table exists but stores full HTML, not decomposed sections.

### No Contradictions Found
All findings in the capabilities doc above are consistent with the architecture doc. The architecture doc provides additional context but does not contradict any capability or limitation described above.
