# Stitch RESTYLE pass — "Valcre-clean" light aesthetic (one paste, all screens)

Purpose: keep every screen's structure, content, and navigation EXACTLY as
generated — change ONLY the visual system. Kills the boxed-inputs-everywhere
AI look and matches the clean aesthetic of Valcre, the appraisal platform
Ben's client already uses.

Sources (real app, not the marketing site):
~/Development/KM-Exp/data/screenshots/valcre-job-orient-01.png (jobs list + sidebar)
~/Development/KM-Exp/data/screenshots/valcre-job-orient-03.png (job detail, underline fields)
~/Development/KM-Exp/data/screenshots/stitch-apr-review/valcre-home.png (marketing palette)

Paste everything below the line into Stitch as an edit applied to ALL screens.

---

Restyle EVERY screen in this project. Do NOT change any screen's layout,
sections, content, data, or navigation — same pages, same elements, same
nav chrome, same wiring. Change ONLY the surface treatment, to the clean,
professional quality of high-end appraisal software:

**The core change — remove the boxes.** Kill every boxed input, every
filled/tinted input well, every heavy group container. Hierarchy comes from
typography, spacing, and hairline dividers — never from borders, fills, or
background-color changes. Airy and calm, generous whitespace, calm flow.

**Mode:** light mode, near-white cool gray page (#f7f8fa) with pure white
surfaces. (Keep the existing nav structure — top bar, tabs, sidebar —
exactly where they are; just re-surface them in the light palette, flat and
borderless.)

**Typography:** clean modern sans-serif. Headings deep navy-ink (#263238),
semi-bold, modest sizes. Body dark slate (#37474f). Secondary text medium
gray (#78838d). Plain sentence-case labels — no uppercase letter-spacing.

**Form fields — the big change, NO boxes:** every input becomes
underline-only, Material style: the label sits left in medium gray, the
value in dark slate on a transparent background, with ONLY a 1px hairline
underline (#d6dbe0) beneath the value. No filled wells, no borders, no
rounded input boxes anywhere. Focus turns the underline brand blue.
Dropdowns are the same underline style with a small chevron.

**Tables/lists:** white rows with thin hairline dividers (#e8ebee), plain
gray column headers, compact row height, light-gray row hover. Checkbox
column where present. No zebra striping, no boxed rows.

**Cards/sections:** white, effectively borderless — at most a whisper-thin
border (#e5e8ec) or the faintest soft shadow, comfortable internal padding,
the section title in navy semi-bold with a small collapse chevron. No tinted
header bars, no heavy group boxes.

**Color discipline:** brand blue (#1e88c5) is the ONLY interactive color —
links, buttons, active states, focus. Green (#43a047) is reserved for one
primary confirmation action per screen at most (e.g. Sign document). Status
indicators stay as small colored dots with plain text labels (slate
Submitted, amber In Progress, purple LOE Pending, green LOE Signed /
Completed) — never colored fills or loud pills. Destructive red (#e53935)
for delete/error text only.

**Buttons:** primary = solid brand blue, white text, subtly rounded (6px);
secondary = white with a hairline border and blue text; text-only buttons
for low emphasis. No gradient, no glow, no shadow-heavy buttons.

**The client-facing signing page:** white paper document on the light gray
page, navy headings, the one green primary button. Keep it minimal.

Apply this consistently to every screen in the project.
