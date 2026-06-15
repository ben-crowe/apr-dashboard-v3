#!/usr/bin/env python3
"""
Mark a V07 LOE template with editability markers, per EDITABLE-PARTS-PROPOSAL.md.

The convention (the ONE simple rule the editor reads):
  - data-editable="ed-N"  -> a body block whose WORDING the client can edit.
  - data-removable + id    -> a section title; X-ing it drops that whole section.
  - everything else stays LOCKED: section titles' text, field labels, the
    merge-token data spans (auto-filled), and the DocuSeal signature anchors.

Rules for what becomes editable:
  - <p> and <li> that carry real prose (more than just a merge-token) -> editable.
  - <p class="field-label">            -> LOCKED (structural label).
  - <p> that is ONLY a merge-token      -> LOCKED (pure auto-filled data).
  - any block containing a signature/text/date-field or an <img>  -> LOCKED (DocuSeal).

Input/Output are FILES — the live master is never mutated in place.
"""
import re, sys

src = sys.argv[1]
dst = sys.argv[2]
html = open(src, encoding="utf-8").read()

ED = {"n": 0}
SKIP_TAGS = ("<signature-field", "<text-field", "<date-field", "<img")


def strip_tokens(inner: str) -> str:
    """Remove merge-token spans + all tags, return remaining prose."""
    no_tok = re.sub(r'<span class="merge-token".*?</span>', "", inner, flags=re.S)
    no_tags = re.sub(r"<[^>]+>", "", no_tok)
    return no_tags.replace("&nbsp;", " ").strip()


def mark_block(m: re.Match) -> str:
    full, attrs, inner = m.group(0), m.group(2), m.group(3)
    tag = m.group(1)
    # LOCKED cases -> return untouched
    if "field-label" in attrs:
        return full
    # The top-left client contact/address block: its stacked <br/> line breaks get stripped on
    # the editable-section round-trip (name + address collapse to one run-on line), so it must
    # stay NON-editable. Signature = the contact tokens together. (Ben bug 2026-06-15.)
    if "ClientFirstName" in inner and "ClientOrganizationAddress" in inner:
        return full
    if any(t in inner for t in SKIP_TAGS):
        return full
    if not (strip_tokens(inner) or "merge-token" in inner):  # truly empty = skip; data values ARE editable now
        return full
    if "data-editable" in attrs:          # already marked
        return full
    ED["n"] += 1
    new_attrs = f'{attrs} data-editable="ed-{ED["n"]}"'
    return f"<{tag}{new_attrs}>{inner}</{tag}>"


# Mark EVERY <p>/<li> block editable (Ben 2026-06-13: make it all editable — clients edit freely
# in Word anyway). Only field-labels (the sub-titles) + the signature/date anchors stay out. The
# Appendix is included now. (non-greedy; these tags don't self-nest in this template)
html = re.sub(r"<(p|li)((?:\s[^>]*)?)>([\s\S]*?)</\1>", mark_block, html)

# Mark section titles removable (forward-prep for the X-delete layer)
sec = {"n": 0}
def mark_h1(m):
    sec["n"] += 1
    return f'<h1 data-removable="sec-{sec["n"]}"{m.group(1)}>'
html = re.sub(r"<h1((?:\s[^>]*)?)>", mark_h1, html)

open(dst, "w", encoding="utf-8").write(html)
print(f"editable blocks marked: {ED['n']}")
print(f"removable sections marked: {sec['n']}")
