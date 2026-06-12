---
content_type: codex-template-fix-spec
title: Codex Template Fixes — Schedule A markers + Example-block removal (LOE-07-1)
status: ready for Codex — 2 template-layer fixes on the LIVE Supabase loe_templates row
owner: Codex (template owner) · qa-agent (flagged + will re-verify) · co-architect (gate)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
date: 2026-06-10
tags: [apr-workflow, loe, loe07, template, codex, schedule-a, conditional-section, valta]
---

# Codex Template Fixes — LOE-07-1 (Schedule A + Example block)

**Tags:** #apr-workflow #loe #loe07 #template #codex #schedule-a
**Entities:** [[LOE-07-1 Template]] [[Codex]] [[Valta]]
**Gate:** verifies against [LOE Test Coverage Gate](~/Development/APR-Dashboard-v3/tests/LOE-TEST-COVERAGE-GATE.md) items **B5** (Schedule A) + **B6** (Example block); routing per **E11** (template fix → Codex).

Two template-layer fixes on the LOE engagement letter you own. Both are the **same class** as the Section 10 blank-rows fix you already applied — the app's suppression logic is correct, the **live template is missing the markers / carries a leftover block.**

> **⚠ DIVERGENCE GUARD — edit the LIVE template, not the static file.** The app renders the **Supabase `loe_templates` DB row** (LOE-07-1 v7), NOT the static `LOE-template-v07.html`. Start from the current live export below; when done, push back to the Supabase row (saving a file alone is not a deploy).
>
> Current live export (fix from THIS, push result back to DB):
> [LIVE-loe-template-v07-current.html](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/LIVE-loe-template-v07-current.html)

---

## FIX 1 — Schedule A conditional markers (gate B5)

**Problem:** Schedule "A" renders on EVERY letter, including single-property jobs, showing the literal placeholder *"THIS SCHEDULE INSERTED WHEN [AssignmentType] SELECTED TO: MULTIPLE PROPERTIES."* It should appear ONLY when Assignment Type = Multiple Properties (documented design — `DECISIONS-2026-06-04.md`, `LOE-TO-DOCUSEAL-FIELD-MAP.md`).

**Root cause:** `applyConditionalScheduleA()` (generateLOE.ts) strips the block by removing `<!-- SCHEDULE-A:START -->…<!-- SCHEDULE-A:END -->`. The live template has the Schedule A `<section>` but **no fence markers** → nothing strips. (Static file has them; the DB copy never got them. The §10 fix added the EAHC fences but not these.)

**The fix — wrap the existing Schedule A section in the fence comments:**

```html
<!-- SCHEDULE-A:START -->
<section class="flow-section page-start schedule">

<h1>SCHEDULE “A”</h1>
<p class="field-label">Property List</p>
<p>THIS SCHEDULE INSERTED WHEN <span class="merge-token" data-token="AssignmentType">[AssignmentType]</span> SELECTED TO: MULTIPLE PROPERTIES</p>

</section>
<!-- SCHEDULE-A:END -->
```

Exact-match the EAHC fence pattern you already used (`<!-- NAME:START -->` / `<!-- NAME:END -->`). For a real multi-property job, replace the placeholder line with the actual property list driven by `[ScheduleAPropertyList]` (separate enhancement — markers first).

---

## FIX 2 — Remove the static "Example" legend block (gate B6)

**Problem:** Directly after the §10 EAHC table, a hardcoded **"Example"** legend table prints on every real contract (flagged for removal). It is NOT data — it's a sample.

**Location (right after `<!-- EAHC-ROW-6:END --></tbody></table>`):**

```html
<p>Example</p>
<table class="data-table">
<tbody>
<tr><td>As Is</td><td>current market value of the subject property as improved as of the effective date</td></tr>
<tr><td>As If Vacant Land</td><td>current market value … the property is vacant as of the effective date.</td></tr>
… (more sample rows) …
</tbody>
</table>
```

**The fix:** delete the `<p>Example</p>` + its sample `<table class="data-table">…</table>` entirely (it's static, not token-driven). If it's intended as authoring guidance, fence it `<!-- EXAMPLE:START -->…<!-- EXAMPLE:END -->` and we'll always-suppress it — but default = remove.

---

## Verification (qa re-runs after you push)

Against the gate, on the live DB template:

- **B5 single-property job** → Schedule A section GONE (no placeholder line). **B5 multi-property job** → Schedule A present.
- **B6** → no "Example" legend in the rendered letter.
- **B7** → no stray `[Token]` leaks introduced.
- Render method (gate D9/D10): serve over http + playwright `pdf`; verify against the **DB** template, not the static file.

Push to the Supabase `loe_templates` row → ping qa (dev-2) → qa readback-verifies and logs B5/B6 PASS in the dated grade doc.

---

**Last reviewed:** 2026-06-10 by qa-agent — flagged from SS12 (Schedule A intent confirmed in DECISIONS-2026-06-04 + field-map; live-vs-static template divergence confirmed). Routed to Codex per gate E11.
