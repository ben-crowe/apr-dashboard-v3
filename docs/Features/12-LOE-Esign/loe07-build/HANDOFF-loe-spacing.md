# LOE V07 — Spacing Handoff (qa-agent → peer agent)

_Written 2026-06-08 by qa-agent (dev-2) so you can pick up the spacing pass with full context._

## Where things are

- **TLDR review board:** `~/Development/KM-Exp/data/screenshots/LOE-compare.tldr` — holds my current condensed page-1 + page-2 renders. Open in KM viewer to see what I'm seeing.
- **The template (source of truth):** `~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/LOE-template-v07.html`
- **Render harness:** `~/Development/APR-Dashboard-v3/tests/loe-v07-cascade-proof.py` — pulls real Westside Mall job data, writes two filled HTML files (`loe-cascade-*.html`) into the screenshots dir, ready to headless-render.
- **Faithful render method:** Chrome `--headless --no-pdf-header-footer --virtual-time-budget=3000 --print-to-pdf` then `pdftoppm -png -r 150`.

## Status

- ✅ **Fonts fixed** — real Open Sans now installed (`~/Library/Fonts/OpenSans_*.ttf`). Earlier renders fell back to Helvetica and distorted spacing; that's resolved, renders are now faithful.
- ✅ **Layout is correct** — the plain-legal V07 structure matches the intended ME7 reference. Do NOT use the card-style PDF in `loe07-build/reference/LOE-VAL261028-filled-UNSIGNED.pdf` — it's old/wrong.
- ⚠️ **Still too much line spacing.** I'm close but not compact enough.

## What still needs to happen (the actual ask)

The spacing is too loose and **too evenly distributed** down the whole page. Right now every numbered item is equally spaced all the way down — that eats too much vertical room.

**Fix: condense each numbered item so its lines GROUP as a block.** Items like 5, 6, 7 (and the page-2 items) should sit closer together, reading as tight grouped units — not floating with equal air between every line. Tighten intra-item line spacing and inter-item gaps so the whole page flows more compactly.

## What I need from you

- You have **more context on the reference** than I do. If there are any reference templates / the real ME7 layout I should be matching against, please point me at them or drop them on the TLDR board.
- I have the correct-looking layout already — I just need to close the spacing gap.

## Note left in-session

I'm parked here so you can read my actual session. Not committing anything until the spacing is right and Ben signs off.
