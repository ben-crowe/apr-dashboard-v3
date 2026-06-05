# APR Dashboard — Field Layout Design Brief (APPROVED)

Reference: `dashboard-field-style-guide.md`
Gold Standard: `LoeQuoteSection.tsx` lines 977–1055
Target: Client Info, Property Info, Property Contact sections
Approved Prototype: `builds/field-layout-prototype-v2.html`

---

## 1. Reference Dimensions

| Measurement | Value | Source |
|---|---|---|
| Reference viewport | 1280px | Design target (minimum supported) |
| Dashboard card padding | 16px left + 16px right (`px-4`) | `sectionContentStyle` |
| Content max-width | 850px | Centered within card — `max-w-[850px] mx-auto` |
| Label column min-width | 160px | `CompactField` `min-w-[160px]` |
| Underline width | 160px | `max-w-[160px]` — text inputs and selects only |
| Two-column gap | 16px | `gap-x-4` (4 × 4px = 16px) |
| Row vertical gap | 10px | Breathing room between field rows |
| Row height | 24px | Tighter than h-7 — underline hugs text baseline |
| Underline color (light) | `#d1d5db` (gray-300) | Subtle hint, not hard border |
| Underline color (dark) | `rgba(255,255,255,0.12)` | Matches light mode subtlety |

---

## 2. Grid Math — Two-Column Layout

Content wrapper: 850px max-width, centered in card.

```
Two columns with gap-x-4:
  total_gap = 16px
  column_width = (850 - 16) / 2 = 417px each

Within each column (flex row):
  [label: 160px min] [gap: 8px] [value area: flex-1 ≈ 249px]

Colon positions (measured from content-center left edge):
  Left column colon:  160px
  Right column colon: 417 + 16 + 160 = 593px
```

---

## 3. Address Fields (Single-Line, No Underline)

Address is a single full-width input spanning both columns (`md:col-span-2`). No underline, no border. Text flows freely.

```
[label: 160px min] [gap: 8px] [input: full available width, no border]

Colon position: 160px — matches two-column left colon.
```

Spacing:
- **Above address**: 16px (`margin-top: 16px`) — slightly more than row gap
- **Below address**: 20px (`margin-bottom: 20px`) — breathing room before next row type

---

## 4. Label Alignment Rules

Labels RIGHT-ALIGN their text to the colon. The colon is appended automatically by `CompactField`.

```
          Label:  Value here
   Longer Label:  Value here
```

CSS: `text-align: right` + `min-width: 160px` + `white-space: nowrap`

The label column is a fixed gutter. Short labels push their text rightward. Long labels extend leftward (the `min-width` grows if needed, but 160px handles all current labels).

---

## 5. Underline Specification

Text inputs and selects get underlines. Address fields do NOT.

```css
/* Underline (bottom border only) — text inputs and selects */
border: none;
border-bottom: 1px solid #d1d5db;       /* gray-300 light mode */
/* dark: rgba(255,255,255,0.12) */
border-radius: 0;
max-width: 160px;
height: 24px;
padding: 0;
background: transparent;

/* Focus state */
border-bottom-color: #6366f1;            /* indigo-500 */
box-shadow: 0 1px 0 0 #6366f1;
```

Select fields add a chevron indicator (via Shadcn SelectTrigger). The chevron sits inside the 160px width.

---

## 6. Vertical Spacing

| Spacing Type | Value | When |
|---|---|---|
| Row gap | 10px | Between standard field rows (grid `gap-y`) |
| Address above | 16px | From last double row to address row |
| Address below | 20px | From address row to next row type |
| Section group top | 16px | `mt-4` on each SectionGroup |
| Section group bottom | 24px | `mb-6` on each SectionGroup |
| Section title to fields | 12px | `mb-3` on section title |

---

## 7. Section Layouts — Field by Field

### CLIENT INFORMATION

| Row | Col 1 | Col 2 | Type |
|-----|-------|-------|------|
| 1 | First Name (text) | Last Name (text) | Two-column |
| 2 | Title (text) | Organization (text) | Two-column |
| 3 | Phone (text, tel format) | Email (text) | Two-column |
| 4 | Address (single-line, no underline) | — | Full-width, col-span-2 |

### PROPERTY INFORMATION

| Row | Col 1 | Col 2 | Type |
|-----|-------|-------|------|
| 1 | Property Name (text) | Property Type (select) | Two-column |
| 2 | Address (single-line, no underline) | — | Full-width, col-span-2 |
| 3 | Authorized Use (select) | Valuation Premises (select) | Two-column |
| 4 | Asset Condition (select) | — (empty) | Two-column, single field |

### PROPERTY CONTACT

| Row | Col 1 | Col 2 | Type |
|-----|-------|-------|------|
| 1 | First Name (text) | Email (text) | Two-column |
| 2 | Last Name (text) | Phone (text, tel format) | Two-column |

Property Contact must be its own `<SectionGroup>`, not a nested `<div>` with `<h4>`.

---

## 8. Current vs Target — What Must Change

| Property | Current (Broken) | Target (Approved) |
|---|---|---|
| Content centering | None — left-aligned | `max-w-[850px] mx-auto` wrapper |
| Grid gap | `gap-x-4` (16px) | Keep `gap-x-4` (16px) |
| Row gap | `gap-y-0.5` (2px) | `gap-y-[10px]` (10px) |
| Row height | `h-7` (28px) | 24px (tighter, line hugs text) |
| Label min-width | `[&_label]:min-w-[120px]` override | Remove override; use CompactField's built-in `min-w-[160px]` |
| Input max-width | `max-w-[280px]` or `max-w-[200px]` | `max-w-[160px]` uniform |
| Select max-width | `max-w-[200px]` or `max-w-[280px]` | `max-w-[160px]` uniform |
| Underline color | `gray-400` | `gray-300` (#d1d5db) — lighter |
| Address | `w-full` with underline | Single-line input, NO underline, full available width |
| Three-column selects | Crammed into 2-col grid | Stay two-column: Auth Use + Val Premises row, Asset Condition alone |
| Property Contact | Nested `<div>` with `<h4>` | Proper `<SectionGroup title="Property Contact">` |
| Address spacing | No extra spacing | 16px above, 20px below |
| Grid wrapper | Raw `<div class="grid ...">` | Use `TwoColumnFields` component |

---

## 9. Color & Typography

| Element | Value |
|---|---|
| Section title | `text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-400` |
| Label text | `text-sm text-gray-600 dark:text-gray-400` |
| Value text | `text-sm` (inherits base text color) |
| Underline (light) | `border-b` `#d1d5db` (gray-300) |
| Underline (dark) | `border-b` `rgba(255,255,255,0.12)` |
| Focus underline | `#6366f1` (indigo-500) |
| Background | Transparent (inputs blend into card) |
| Placeholder | Default Shadcn gray |

---

## 10. Accessibility Checklist

- [ ] Labels use `<label>` element with `text-right` alignment
- [ ] All inputs have associated labels (via flex row proximity)
- [ ] Focus states visible (indigo underline highlight)
- [ ] Tab order follows visual order (left-to-right, top-to-bottom)
- [ ] Select triggers have `cursor-pointer`
- [ ] Color contrast: gray-600 on white > 4.5:1
- [ ] Field rows have enough padding for comfortable click targets
