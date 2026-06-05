# Theme System — Light / Dark Mode

**Status:** Production · **Added:** 2026-06-05 · **Owner area:** app-wide UI
**Default:** Light · **Persists:** yes (localStorage) · **Toggle:** header Sun/Moon button

---

## 1. What it does

The app supports **light and dark mode**. It defaults to **light** (the typical default), the user flips it with the header toggle, and the choice **persists across reloads**. Both modes are designed to be readable — colors come from shadcn semantic tokens that have a defined light value AND a defined dark value, so text contrast holds in both.

## 2. How it works (the engine)

Four pieces, in order:

**No-flash boot script** — `index.html`
Runs before React paints. Reads `localStorage('theme')` (default `light`) and sets the `dark`/`light` class on `<html>` immediately, so there's no light→dark flash on load. Must stay in sync with the provider's default + storage key.

**ThemeProvider** — `src/components/theme-provider.tsx`
The single source of truth. Holds the theme state (`light` | `dark` | `system`), applies the class to `<html>`, persists to `localStorage('theme')`, and (in `system` mode) tracks OS preference live. Wraps the whole app in `src/App.tsx`.

**useTheme hook** — `src/hooks/use-theme.tsx`
A back-compat shim that re-exports `useTheme` from the provider. Existing imports keep working. Returns `{ theme, setTheme }`.

**Header toggle** — `src/components/dashboard/DashboardLayout.tsx`
The Sun/Moon button calls `setTheme(theme === 'dark' ? 'light' : 'dark')`.

> **What was wrong before:** `src/main.tsx` force-added the `dark` class on every boot, which stomped the toggle and the saved choice — so light mode never appeared. That line was removed; the provider + boot script now own the theme.

## 3. How colors stay readable in both modes (the paint)

Components use **shadcn semantic tokens**, not hardcoded colors. The tokens auto-respond to the `dark` class because each is defined twice in `src/index.css` — once under `:root` (light) and once under `.dark`.

| Use it for | Token class | Not this (breaks one mode) |
|---|---|---|
| Page background | `bg-background` | `bg-white`, `bg-gray-900` |
| Card / panel background | `bg-card` | `bg-white`, `bg-gray-800` |
| Subtle / inset background | `bg-muted` | `bg-gray-50`, `bg-gray-100` |
| Primary text | `text-foreground` | `text-gray-900`, `text-white` |
| Secondary / label text | `text-muted-foreground` | `text-gray-500`, `text-gray-600` |
| Borders / dividers | `border-border`, `divide-border` | `border-gray-200` |

**Rule for new components:** use semantic tokens. You should almost never need a `dark:` variant — the token already carries both values. A hardcoded `bg-white` with no `dark:` pair is the exact bug this system fixes (renders light in dark mode).

## 4. Files

- `index.html` — no-flash boot script
- `src/components/theme-provider.tsx` — provider (source of truth)
- `src/hooks/use-theme.tsx` — back-compat shim
- `src/App.tsx` — wraps app in `<ThemeProvider>`
- `src/main.tsx` — force-dark removed
- `src/index.css` — token definitions (`:root` light @ ~60, `.dark` @ ~101)
- `src/components/dashboard/DashboardLayout.tsx` — header toggle button
- `scripts/theme-tokens-codemod.mjs` — the codemod that converted the dashboard's hardcoded colors to tokens (342 occurrences / 34 files). Re-runnable; extend `RULES` to convert more areas.

## 5. Known follow-ups

- **Other surfaces:** this pass covered the shared engine + the dashboard / job-detail components (the reported area). Separate feature surfaces (report builder, calculator demos) have their own theme contexts and may need their own token pass — run the codemod against those dirs and screenshot-verify both modes.
- **Status-of-Improvements dropdown** (unrelated, noted during this work): its options don't match the §10 cascade keys — tracked separately.

## 6. How to verify after changes

Render both modes and look (don't trust tsc — it can't see contrast):
1. Toggle via the header button, reload → the choice must stick.
2. Screenshot light AND dark of any changed screen.
3. Check text is readable on its background in BOTH. A light island in dark mode (or vice-versa) = a hardcoded color that needs a token.
