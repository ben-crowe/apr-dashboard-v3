#!/usr/bin/env python3
"""Apply LOE-07-RENDER-TWEAKS (A1 de-table + B1-B4 visual fixes) to LOE-template-v07.html.
Deterministic: each replacement asserts it matched exactly once. Re-runnable (idempotent-ish via asserts)."""
import os, re, sys

TPL = os.path.expanduser("~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/LOE-template-v07.html")
DATAURI_FILE = os.path.expanduser("~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/assets/valta-v07-letterhead.png.datauri.txt")

html = open(TPL).read()
datauri = open(DATAURI_FILE).read().strip()

def rep(old, new, label, count=1):
    global html
    n = html.count(old)
    assert n == count, f"[{label}] expected {count} match(es), found {n}"
    html = html.replace(old, new)
    print(f"  ✓ {label} ({n})")

# ── B1 — header top margin 1.1in → 1.35in (pages 2+ clearance) ──
rep("margin: 1.1in 0.75in 0.75in 0.75in;", "margin: 1.35in 0.75in 0.75in 0.75in;", "B1 header margin")

# ── B3 — footer color #6B7785 → #4A4A4A ──
rep("--footer: #6B7785;", "--footer: #4A4A4A;", "B3 footer color")
# ── B3 — footer rule 0.75px navy → 1px #003B7E (3 @bottom-* boxes; @top uses border-bottom, untouched) ──
rep("border-top: 0.75px solid var(--navy)", "border-top: 1px solid #003B7E", "B3 footer rule", count=3)

# ── B2 — condense body density ──
rep("margin: 22px 0 8px 0;", "margin: 14px 0 6px 0;", "B2 h2 margin")
rep("margin: 14px 0 4px 0; page-break-after: avoid;", "margin: 10px 0 3px 0; page-break-after: avoid;", "B2 h3.sub margin")
rep("p { margin: 7px 0; text-align: justify; }", "p { margin: 5px 0; text-align: justify; }", "B2 p margin")

# ── A1 — de-table §10: drop table.eahc rules, add borderless flex-row classes ──
old_css = (
    "  table.eahc { width: 100%; border-collapse: collapse; margin: 10px 0; }\n"
    "  table.eahc td { border: 1px solid var(--rule); padding: 5px 9px; vertical-align: top; font-size: 12.5px; line-height: 16px; }\n"
    "  table.eahc td:first-child { width: 220px; font-weight: 600; }"
)
new_css = (
    "  /* §10 borderless two-column (LOE-07-RENDER-TWEAKS A1) — flex rows, no cell box */\n"
    "  .eahc { margin: 10px 0; }\n"
    "  .eahc-row { display: flex; margin: 4px 0; font-size: 13.5px; line-height: 19px; }\n"
    "  .eahc-l { width: 220px; flex-shrink: 0; font-weight: 600; padding-right: 12px; }\n"
    "  .eahc-r { flex: 1; }"
)
rep(old_css, new_css, "A1 de-table CSS")

# ── A2/A3 — §10 DATA block: fenced flex rows (row suppression + narrative slots) ──
old_data = """<table class="eahc">
  <tbody>
    <tr><td>[ValueScenario1]</td><td>[EA/HCSummary1]</td></tr>
    <tr><td>[ValueScenario2]</td><td>[EA/HCSummary2]</td></tr>
    <tr><td>[ValueScenario3]</td><td>[EA/HCSummary3]</td></tr>
    <tr><td>[ValueScenario4]</td><td>[EA/HCSummary4]</td></tr>
    <tr><td>[ValueScenario5]</td><td>[EA/HCSummary5]</td></tr>
    <tr><td>[ValueScenario6]</td><td>[EA/HCSummary6]</td></tr>
  </tbody>
</table>"""
new_data = '<div class="eahc">\n' + "\n".join(
    f'<!-- EAHC-ROW-{i}:START --><div class="eahc-row"><div class="eahc-l">[ValueScenario{i}]</div>'
    f'<div class="eahc-r">[EA/HCSummary{i}]</div></div><!-- EAHC-ROW-{i}:END -->'
    for i in range(1, 7)
) + "\n</div>"
rep(old_data, new_data, "A2/A3 data rows")

# ── A4 — Example block de-tabled (static legend) ──
old_ex = """<table class="eahc">
  <tbody>
    <tr><td>As Is</td><td>current market value of the subject property as improved as of the effective date</td></tr>
    <tr><td>As If Vacant Land</td><td>current market value of the subject property based on the extraordinary assumption and hypothetical condition that the existing improvements on the subject site do not exist, and that the property is vacant as of the effective date.</td></tr>
  </tbody>
</table>"""
new_ex = """<div class="eahc">
<div class="eahc-row"><div class="eahc-l">As Is</div><div class="eahc-r">current market value of the subject property as improved as of the effective date</div></div>
<div class="eahc-row"><div class="eahc-l">As If Vacant Land</div><div class="eahc-r">current market value of the subject property based on the extraordinary assumption and hypothetical condition that the existing improvements on the subject site do not exist, and that the property is vacant as of the effective date.</div></div>
</div>"""
rep(old_ex, new_ex, "A4 example de-table")

# ── B4 — @top-left continuation logo → canonical datauri ──
# Replace whatever url("data:image/png;base64,...") currently sits in @top-left content.
m = re.search(r'(@top-left\s*\{\s*content:\s*url\(")data:image/png;base64,[A-Za-z0-9+/=]+("\);)', html)
assert m, "B4 @top-left content url not found"
html = html[:m.start()] + m.group(1) + datauri + m.group(2) + html[m.end():]
print("  ✓ B4 @top-left logo datauri")

# ── B4 — page-1 letterhead <img> → canonical datauri ──
m2 = re.search(r'(<img src=")data:image/png;base64,[A-Za-z0-9+/=]+(" alt="Valta Property Valuations Ltd\.")', html)
assert m2, "B4 page-1 letterhead img not found"
html = html[:m2.start()] + m2.group(1) + datauri + m2.group(2) + html[m2.end():]
print("  ✓ B4 page-1 letterhead datauri")

open(TPL, "w").write(html)
print("DONE — template tweaks applied.")
