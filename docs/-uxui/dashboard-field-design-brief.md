# APR Dashboard — Field Layout Design Brief (v2.2)

Reference: `dashboard-field-style-guide.md`
Gold Standard: `LoeQuoteSection.tsx` lines 977–1055
Target: Client Info, Property Info, Property Contact sections

---

## 1. Reference Dimensions

| Measurement | Value | Source |
|---|---|---|
| Reference viewport | 1280px | Design target (minimum supported) |
| Dashboard card padding | 16px left + 16px right (`px-4`) | `sectionContentStyle` |
| Content max-width | 720px | Centered within card — `max-w-[720px] mx-auto` |
| Label column min-width | 160px | `CompactField` `min-w-[160px]` |
| Underline width | 160px | `max-w-[160px]` — ALL field types |
| Address input width | 320px | Text visible area (2x underline), NO underline on address |
| Two-column gap | 16px | `gap-x-4` (4 × 4px = 16px) |
| Row vertical gap | 2px | `gap-y-0.5` (0.5 × 4px = 2px) |
| Row height | 28px | `h-7` on inputs/selects |

> **v2.2 changes:** Three-column layout removed. Gap tightened from 32px to 16px. Content centered at 720px max-width. Address inputs extended to 320px visible width, no underline.

---

## 2. Grid Math — Two-Column Layout

Content wrapper: 720px max-width, centered in card.

```
Two columns with gap-x-4:
  total_gap = 16px
  column_width = (720 - 16) / 2 = 352px each

Within each column (flex row):
  [label: 160px min] [gap: 8px] [value area: flex-1 ≈ 184px]

Colon positions (measured from content-center left edge):
  Left column colon:  160px
  Right column colon: 352 + 16 + 160 = 528px
```

> **v2 change:** Three-column layout removed entirely. The three selects (Authorized Use, Valuation Premises, Asset Condition) now use two-column layout: Auth Use + Val Premises on one row, Asset Condition alone on the next row.

---

## 4. Single Full-Width Row (Address Fields)

Spans the full two-column grid (`md:col-span-2` or `md:col-span-3`).

```
[label: 160px min] [gap: 8px] [value text: flows freely to container edge]
                   [underline: 160px]

Colon position: 160px — matches two-column left colon.
```

The input text can extend beyond the 160px underline. The underline is a visual anchor, not a text boundary. Users type as much as needed. TBD: address fields may have no underline at all.

---

## 5. Label Alignment Rules

Labels RIGHT-ALIGN their text to the colon. The colon is appended automatically by `CompactField`.

```
          Label:  Value here
   Longer Label:  Value here
Short:            Value here    ← WRONG — labels must right-align
```

CSS: `text-align: right` + `min-width: 160px` + `white-space: nowrap`

The label column is a fixed gutter. Short labels push their text rightward. Long labels extend leftward (the `min-width` grows if needed, but 160px handles all current labels).

---

## 6. Underline Specification

All three field types share identical underline treatment:

```css
/* Underline (bottom border only) */
border: none;
border-bottom: 1px solid;
border-color: rgb(156, 163, 175);         /* gray-400 light mode */
border-color: rgba(255, 255, 255, 0.2);   /* white/20 dark mode */
border-radius: 0;
max-width: 160px;
height: 28px;                              /* h-7 */
padding: 0;
background: transparent;
```

Select fields add a chevron indicator (via Shadcn SelectTrigger). The chevron sits inside the 160px width.

---

## 7. Vertical Spacing — Row Type Transitions

When the layout switches between row types (double → single, single → double, double → triple, triple → double), add extra vertical space.

```
Standard row gap:     gap-y-0.5 (2px) — handled by grid
Transition spacing:   mt-4 (16px) on the new row-type container

Example structure:
  <TwoColumnFields>         ← double rows
    ...fields...
  </TwoColumnFields>
  <div class="mt-4">        ← 16px breathing room
    <TwoColumnFields>       ← single full-width row (Address)
      <CompactField fullWidth>
    </TwoColumnFields>
  </div>
  <div class="mt-4">        ← 16px again
    <ThreeColumnFields>     ← triple row
      ...fields...
    </ThreeColumnFields>
  </div>
```

---

## 8. Section Layouts — Field by Field

### CLIENT INFORMATION

| Row | Col 1 | Col 2 | Type |
|-----|-------|-------|------|
| 1 | First Name (text) | Last Name (text) | Two-column |
| 2 | Title (text) | Organization (text) | Two-column |
| 3 | Phone (text, tel format) | Email (text) | Two-column |
| 4 | Address (text, full-width) | — | Single row, col-span-2 |

Transition: Row 3 → Row 4 is double → single. Add `mt-4`.

### PROPERTY INFORMATION

| Row | Col 1 | Col 2 | Col 3 | Type |
|-----|-------|-------|-------|------|
| 1 | Property Name (text) | Property Type (select) | — | Two-column |
| 2 | Address (text, full-width) | — | — | Single row, col-span-2 |
| 3 | Authorized Use (select) | Valuation Premises (select) | Asset Condition (select) | Three-column |

Transitions: Row 1 → Row 2 is double → single (`mt-4`). Row 2 → Row 3 is single → triple (`mt-4`).

### PROPERTY CONTACT

| Row | Col 1 | Col 2 | Type |
|-----|-------|-------|------|
| 1 | First Name (text) | Email (text) | Two-column |
| 2 | Last Name (text) | Phone (text, tel format) | Two-column |

No transitions — all rows are the same type.

---

## 9. Current vs Target — What Must Change

| Property | Current (Broken) | Target (Gold Standard) |
|---|---|---|
| Grid gap | `gap-x-4` (16px) | `gap-x-8` (32px) |
| Label min-width | `[&_label]:min-w-[120px]` override | Remove override; use CompactField's built-in `min-w-[160px]` |
| Input max-width | `max-w-[280px]` or `max-w-[200px]` | `max-w-[160px]` uniform |
| Select max-width | `max-w-[200px]` or `max-w-[280px]` | `max-w-[160px]` uniform |
| Address underline | `w-full` (no cap) | `max-w-[160px]` (or no underline — TBD) |
| Three-column selects | Crammed into 2-col grid | Separate `ThreeColumnFields` (grid-cols-3, gap-x-6) |
| Property Contact | Nested `<div>` with `<h4>` | Proper `<SectionGroup title="Property Contact">` |
| Row-type transitions | No extra spacing | `mt-4` between different row types |
| Grid wrapper | Raw `<div class="grid ...">` | Use `TwoColumnFields` component |

---

## 10. Color & Typography (Existing — Do Not Change)

| Element | Value |
|---|---|
| Section title | `text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-400` |
| Label text | `text-sm text-gray-600 dark:text-gray-400` |
| Value text | `text-sm` (inherits base text color) |
| Underline (light) | `border-b-gray-400` |
| Underline (dark) | `border-b-white/20` |
| Background | Transparent (inputs blend into card) |
| Placeholder | Default Shadcn gray |

---

## 11. Accessibility Checklist

- [ ] Labels use `<label>` element with `text-right` alignment
- [ ] All inputs have associated labels (via flex row proximity)
- [ ] Focus states visible (Shadcn default ring)
- [ ] Tab order follows visual order (left-to-right, top-to-bottom)
- [ ] Select triggers have `cursor-pointer`
- [ ] Color contrast: gray-600 on white > 4.5:1 ✓
- [ ] Touch targets: 28px height meets 44px minimum via padding area
