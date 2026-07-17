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
wiring. Change ONLY the visual design system, to a clean, professional,
LIGHT-mode aesthetic modeled on modern appraisal software:

**Overall:** light mode. Page background a near-white cool gray (#f7f8fa);
all content surfaces pure white. Airy and calm — generous whitespace,
almost no visible boxes. Hierarchy comes from typography and spacing, not
borders and fills.

**Top app bar:** solid brand blue (#1e88c5), full width. White logo mark and
app name at left, an inset lighter-blue search field in the center, white
icons and the user name at right.

**Left sidebar (staff pages):** white, flat, borderless — an icon + label
row per item in medium gray (#5f6b76); the ACTIVE item gets a soft light-blue
tint (#e3f2fd) with the icon and label in brand blue. A single solid blue
"+ Create new" style primary button sits at the top of the sidebar. (Screens
that currently use a top-tab row instead of a sidebar keep their tabs —
restyle the active tab to brand-blue text with a 2px brand-blue underline on
white.)

**Typography:** clean modern sans-serif (Roboto/system). Headings in deep
navy-ink (#263238), semi-bold, modest sizes. Body dark slate (#37474f).
Secondary text medium gray (#78838d). No uppercase letter-spaced labels —
plain sentence-case labels.

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
