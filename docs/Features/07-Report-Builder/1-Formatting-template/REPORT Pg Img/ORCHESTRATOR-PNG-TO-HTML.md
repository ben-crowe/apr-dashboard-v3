# PNG → HTML → PDF Orchestrator

## Mission
Convert 79 reference PNGs into 79 standalone HTML files. Combine into single PDF. This produces a clean, static replica of the Valcre report. Dynamic field extraction happens AFTER this is working.

## Source PNGs
```
/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/North Battleford Apt -Report-content extracted copy/REPORT Pg Img./
```
78 PNG files (Page 1-79, naming: `Ref.Report-VAL251012-North Battleford Apt.docx.pdf - Page X of 79.png`)

## Output Location
```
/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/North Battleford Apt -Report-content extracted copy/REPORT Pg Img./html-pages/
```
Output: `page-01.html`, `page-02.html`, ... `page-79.html`

## Agent Instructions (Per-Page Conversion)

Each agent receives ONE PNG and produces ONE HTML file.

**Prompt for each sub-agent:**
```
You are converting a single page image to HTML.

INPUT: [path to PNG]
OUTPUT: [path to HTML file]

Requirements:
- Pixel-perfect replication of the PNG
- Single HTML file with embedded CSS (no external stylesheets)
- Page size: 8.5" × 11" (816px × 1056px at 96dpi)
- Match fonts exactly (use system fonts: Arial, Times New Roman, or specify closest match)
- Match colors exactly (use color picker values from image)
- Match spacing, margins, alignment exactly
- All text must be actual text (not images) for future field extraction
- Tables must be HTML tables
- Images/logos: reference as placeholder comments <!-- LOGO: filename.png -->

Structure:
<!DOCTYPE html>
<html>
<head>
  <style>
    @page { size: 8.5in 11in; margin: 0; }
    body { width: 8.5in; height: 11in; margin: 0; padding: 0; font-family: Arial, sans-serif; }
    /* page-specific styles */
  </style>
</head>
<body>
  <!-- page content -->
</body>
</html>

Do NOT:
- Add responsive design
- Add interactivity
- Deviate from the source image
- Guess at content you can't read - mark as [ILLEGIBLE]

DO:
- Replicate exactly what you see
- Use precise measurements
- Match typography precisely
- Preserve all whitespace and alignment
```

## Orchestration Pattern

**Option A: Batch of 10 agents × 8 pages each**
```bash
# Agent 1: pages 1-8
# Agent 2: pages 9-16
# Agent 3: pages 17-24
# ... etc
```

**Option B: True parallel (79 agents)**
If your terminal supports it, spawn all 79 simultaneously. Each is independent.

**Option C: Haiku swarm**
Use `--model haiku` for speed. This is visual conversion, not complex reasoning.

```bash
claude --model haiku "Convert this PNG to pixel-perfect HTML: [path]"
```

## Assembly (After All Pages Complete)

Create `combined-report.html`:
```typescript
// assemble.ts
import fs from 'fs';
import path from 'path';

const pagesDir = './src/features/report-builder/templates/pages';
const pages = [];

for (let i = 1; i <= 79; i++) {
  const pageNum = String(i).padStart(2, '0');
  const content = fs.readFileSync(path.join(pagesDir, `page-${pageNum}.html`), 'utf-8');
  // Extract body content only
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    pages.push(`<div class="page" id="page-${i}">${bodyMatch[1]}</div>`);
  }
}

const combined = `
<!DOCTYPE html>
<html>
<head>
  <style>
    @page { size: 8.5in 11in; margin: 0; }
    @media print { .page { page-break-after: always; } }
    .page { width: 8.5in; height: 11in; overflow: hidden; position: relative; }
    /* Merge all page styles here */
  </style>
</head>
<body>
  ${pages.join('\n')}
</body>
</html>
`;

fs.writeFileSync('./combined-report.html', combined);
```

## Verification
1. Open each `page-XX.html` in browser - should match PNG exactly
2. Open `combined-report.html` - should be 79-page document
3. Print to PDF - should produce clean 79-page PDF

## After This Works
THEN we extract dynamic sections. Not before. Get the static replica working first.

---
*This is Phase 1. Static replica. Dynamic fields are Phase 2.*
