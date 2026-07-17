---
name: APR Dashboard (apr-clean-working — the live app)
default_theme: dark   # Ben's ruling 2026-07-16 — all Stitch screens generate DARK
source_page: http://localhost:8086/dashboard
source_screenshot: ~/Development/KM-Exp/data/screenshots/apr-live-dashboard-theme-check.png
approved_dark_reference: ~/Development/KM-Exp/data/screenshots/apr-settings-firm-appraiser.html
colors:   # DARK theme (the generation default)
  surface: '#191d24'
  on-surface: '#e7edf5'
  surface-container: '#1e2530'
  surface-container-high: '#222b38'
  surface-container-low: '#161b22'
  outline: '#2b3542'
  primary: '#3b82f6'
  on-primary: '#ffffff'
  secondary: '#8b98a9'
  tertiary: '#6b7789'
  field: '#171c24'
  error: '#ef4444'
colors_light:   # LIGHT theme (the app's default at first load — reference only)
  surface: '#f7f9fb'
  on-surface: '#1b1e22'
  surface-container: '#ffffff'
  outline: '#e1e5eb'
  primary: '#2563eb'
  on-primary: '#ffffff'
  secondary: '#4c5158'
  muted: '#eef1f4'
  error: '#d92d2d'
---

# Design System: APR Dashboard

**Source of truth:** extracted from the RUNNING app at `http://localhost:8086`
(served from `~/Development/apr-clean-working`, whose `src/index.css` carries
both themes as CSS variables). The app loads LIGHT by default with a dark-mode
toggle in the header; **Ben approved the DARK look and all Stitch screens
generate dark-first.** The dark hex values below are the ones measured into the
approved Firm & Appraiser settings mock.

## 1. Visual Theme & Atmosphere (dark)

A dense, quiet, utilitarian operations dashboard in deep charcoal — an internal
professional tool, not a marketing site. Surfaces are layered charcoals: a
near-black page (#191d24), slightly lighter cards (#1e2530), and lighter-again
header bars (#222b38). Text is soft off-white (#e7edf5) with slate-gray
secondary text. One clear blue (#3b82f6) carries all interactive emphasis —
active tab underlines, primary buttons, focus. No gradients, no glow; selected
states are a slightly different shade plus a small marker, never bright.

## 2. Color Palette & Roles (dark)

### Primary Foundation
- **Deep Charcoal Page** (#191d24) — the app background.
- **Charcoal Card** (#1e2530) — cards, panels, form containers.
- **Raised Charcoal** (#222b38) — card header bars, tinted group headers.
- **Recessed Well** (#161b22) — tab bars, sunken areas.
- **Field Well** (#171c24) — input value boxes (filled well + underline).

### Accent & Interactive
- **Clear Action Blue** (#3b82f6) — primary buttons, active-tab underline, links, focus.
- **Dim Blue Panel** (#2a3a54) — informational banners, with #33517d border.

### Typography & Text Hierarchy
- **Soft Off-White** (#e7edf5) — headings and primary text.
- **Slate Gray** (#8b98a9) — labels, secondary text.
- **Dim Slate** (#6b7789) — placeholders, tertiary text, inactive tabs.

### Structure & States
- **Hairline Border** (#2b3542) — card borders, dividers, input underlines.
- **Signal Red** (#ef4444) — errors and destructive actions only.

## 3. Typography Rules

System UI sans-serif stack (no custom webfont). Small and dense: body ~13px,
page titles ~19px semi-bold, form labels ~12.25px regular. Sub-section headings
are 10.5px, semi-bold, UPPERCASE with slight letter-spacing. No display faces.

## 4. Component Stylings (the V3 patterns — measured, keep them)

* **Encapsulation is TWO levels:** ONE bordered box (1px #3d4757, 7px radius)
  around a whole group with a tinted collapsible header bar (#222b38, 10.5px/14px
  padding, 14px medium title + chevron); FLAT sub-sections inside it marked only
  by small uppercase letter-spaced headings.
* **Fields — one line per field, label right-aligned to a colon:** label column
  fixed width so colons align vertically; value box is a filled well (#171c24)
  with a bottom underline ONLY (1px #2b3542) — no side/top borders, no rounding,
  31.5px tall. The underline sits under the VALUE, never the label.
* **Tabs:** recessed bar (#161b22) with a bottom hairline; inactive tabs dim
  slate text; the ACTIVE tab is off-white text + 2px blue bottom border +
  semi-bold. Selected states are quiet — never bright, never white blocks.
* **Buttons:** primary = solid Clear Action Blue, white text, 8px radius,
  12.5px semi-bold; secondary = transparent with hairline border.
* **Banners:** dim blue panel, 8px radius, small info icon, light-blue bold
  key phrases.
* **Upload tiles:** dashed hairline border, 8px radius, square/round thumb
  placeholder + title/caption + right-aligned bordered button.

## 5. Layout Principles

Max content width ~1080px centered. Two-column field grids with wide rows
spanning both columns. Base spacing is small and dense (4px unit; 14–24px
paddings). Whitespace and hairlines do the separating.

## 6. Design System Notes for Stitch Generation

### Language to Use
"Dense, quiet, utilitarian dark operations dashboard; layered charcoal
surfaces; hairline borders; soft off-white text; one clear blue accent;
underline-only field wells; quiet selected states."

### Color References (dark — paste block)
Page #191d24 · Card #1e2530 · Card header #222b38 · Recessed well #161b22 ·
Field well #171c24 · Border #2b3542 · Text #e7edf5 · Secondary #8b98a9 ·
Placeholder #6b7789 · Action blue #3b82f6 · Banner #2a3a54 (border #33517d) ·
Error #ef4444

### Incremental Iteration
One change per edit prompt. Never restate the design system in edit prompts.

---
*The light theme (frontmatter `colors_light`) is the app's first-load default —
kept for reference. Do not generate Stitch screens light unless Ben asks.*
