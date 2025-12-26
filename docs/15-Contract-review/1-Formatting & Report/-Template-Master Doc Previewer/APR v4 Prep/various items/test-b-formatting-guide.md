# Test B Formatting Guide

**Status:** Test B selected as winner for Footer Page 1 compression

---

## Compression Settings

```css
font-size: 8.5pt;
padding: 2px 4px;
line-height: 1.2;
```

---

## Overall Page Height

**Critical:** Content must NOT touch the footer

**Usable content area:** 700-720px maximum
- Total page height: ~1056px (US Letter at 96 DPI)
- Header + margins: ~100px
- Footer + margins: ~100px
- **Remaining for content:** 700-720px

**Ensure spacing buffer at bottom to prevent footer collision**

---

## Blue Section Headers - Spacing

**Above the blue bar:** Normal spacing (no extra padding)

**Below the blue bar:** NEEDS MORE SPACE
- Current attempt: `padding: 4px 8px 15px 8px` (15px bottom padding)
- Issue: Not creating visible white space below blue bar
- User feedback: "spacing above the blue bar" when trying to add space below

**Problem:** Padding-bottom on blue cell extends blue background, doesn't create gap to next row

---

## Nested Table Structure (Land Area)

**Hierarchical pattern:**
```
Land Area (parent label)
  ├─ Square Feet | Acres (column headers)
  ├─ Usable      | 24,400 | 0.56
  └─ Total       | 24,400 | 0.56
```

**HTML Implementation:**
```html
<tr>
    <td class="label-col">Land Area</td>
    <td style="padding: 0;">
        <table style="width: 100%; border-collapse: collapse; margin: 0; background: white;">
            <tr>
                <td style="width: 50%; padding: 2px 4px; text-align: left;">Square Feet</td>
                <td style="width: 50%; padding: 2px 4px; text-align: left;">Acres</td>
            </tr>
        </table>
    </td>
</tr>
<tr>
    <td class="label-col" style="padding-left: 20px;">Usable</td>
    <td style="padding: 0;">
        <table style="width: 100%; border-collapse: collapse; margin: 0;">
            <tr>
                <td style="width: 50%; padding: 2px 4px; text-align: left;">24,400</td>
                <td style="width: 50%; padding: 2px 4px; text-align: left;">0.56</td>
            </tr>
        </table>
    </td>
</tr>
```

**Key points:**
- 50/50 width split for columns
- `text-align: left` on ALL cells (prevents centering)
- `padding-left: 20px` for indented child rows
- Nested tables ensure proper column alignment

---

## What's Working
✅ Compression settings (8.5pt, 2px, 1.2)
✅ Nested table structure for hierarchical data
✅ Left-aligned columns

## What's Not Working
❌ Blue header spacing below bars
❌ File corruption from deleting test scenarios

---

**Last Updated:** 2025-12-21
