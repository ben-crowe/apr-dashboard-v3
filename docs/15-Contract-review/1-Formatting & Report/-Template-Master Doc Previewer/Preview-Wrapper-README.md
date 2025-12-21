# Preview Wrapper - Standalone

## What This Is
A complete document preview viewer with controls. Drop your pages in, it works.

## How To Use

### Option A: Direct HTML
1. Open `Preview-Wrapper-Standalone.html`
2. Find the comment block `<!-- INSERT YOUR PAGES HERE -->`
3. Delete the sample pages
4. Paste your page HTML there
5. Done

### Option B: iFrame in React
```jsx
<iframe 
    src="/Preview-Wrapper-Standalone.html" 
    style={{width: '100%', height: '100%', border: 'none'}} 
/>
```

### Option C: Inject Pages Dynamically
```javascript
// Get the pages wrapper
const wrapper = document.getElementById('pages-wrapper');

// Clear sample pages
wrapper.innerHTML = '';

// Inject your pages
wrapper.innerHTML = yourPagesHTML;

// Re-run page detection (needed after dynamic injection)
window.location.reload(); // or re-initialize the JS
```

## Page Requirements

Each page needs:
```html
<div class="page-sheet" data-page-num="Page X">
    <!-- your content -->
</div>
```

### Page Numbering

| data-page-num | Displays As | Use For |
|---------------|-------------|---------|
| Page 2 | -4 | Cover |
| Page 3 | -3 | Letter |
| Page 4 | -2 | Limiting Conditions |
| Page 5 | -1 | Table of Contents |
| Page 6 | 1 | First content page |
| Page 7 | 2 | Second content page |
| ... | ... | ... |

**Formula:**
- Internal 2-5 → Display = Internal - 6
- Internal 6+ → Display = Internal - 5

## Field Mapping (Optional)

If you want the toggle to switch between placeholders and sample data:

```html
<span class="field-mapped" data-sample="$1,800,000">{{Final_Value}}</span>
```

- Toggle OFF: Shows `{{Final_Value}}`
- Toggle ON: Shows `$1,800,000`

## Features Included

- ✅ Zoom (10% - 150%, click or hold buttons)
- ✅ Pinch-to-zoom on trackpad (Ctrl+scroll)
- ✅ Drag to pan
- ✅ Page navigation (type number or use arrows)
- ✅ Auto-detect current page on scroll
- ✅ Bounds enforcement (can't go past first/last page)
- ✅ Field ID / Sample Data toggle
- ✅ Dark mode
- ✅ Print styles (hides controls)

## No React Required

This is vanilla HTML/CSS/JS. It doesn't care what framework loads it.
Just embed via iframe or inject into a div.
