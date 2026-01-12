# APR Dashboard Template Rebuild - Orchestrator Prompt

## Mission
Complete reconstruction of `reportHtmlTemplate.ts` using slide-deck architecture. Current approach is fundamentally broken - uses `overflow: hidden` divs that clip content exceeding 11 inches. No amount of patching fixes this. Rebuild required.

## The Problem
The 364KB template (7481 lines) attempts dynamic content in fixed-height containers. When content exceeds container height, it's clipped. The Executive Summary "fix" (splitting into 3 pages) proves we need **discrete page functions** - not overflow hacks.

## The Solution: Slide Deck Architecture
79 discrete page functions. Each returns exactly one 8.5" × 11" page. No internal overflow handling. Content that exceeds one page gets a dedicated overflow page function.

```typescript
// Target architecture
export function renderPage1(data: ReportData): string { /* Cover page */ }
export function renderPage2(data: ReportData): string { /* TOC */ }
export function renderPage3(data: ReportData): string { /* Exec Summary 1/3 */ }
// ... through renderPage79()

export function generateFullReport(data: ReportData): string {
  return [
    renderPage1(data),
    renderPage2(data),
    // ...
  ].join('\n');
}
```

## Critical Files

**Template to rebuild:**
`/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/templates/reportHtmlTemplate.ts`

**Data binding sources:**
- `/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/schema/fieldRegistry.ts`
- `/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/schema/workbookFieldMapping.ts`

**Visual reference (79 PNG pages):**
`/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/North Battleford Apt -Report-content extracted copy/REPORT Pg Img/`

**Existing working styles to preserve:**
The current template has battle-tested CSS for fonts, tables, headers. Extract and reuse - don't reinvent.

## Agent Deployment Plan

### Agent 1: Style Extraction
- Read current template
- Extract all CSS/styling that works
- Create `reportStyles.ts` with shared constants
- Document font families, sizes, colors, spacing

### Agent 2: Page Inventory  
- Review all 79 reference PNGs
- Create page manifest: `{ pageNum, type, contentDescription, dataRequirements }`
- Identify which pages need overflow variants
- Group related pages (e.g., "Comparable Sales" spans pages 45-52)

### Agent 3: Page Function Generator
- Build `renderPageN()` functions in batches
- Start with static/simple pages (cover, TOC, dividers)
- Progress to data-bound pages
- Each function: single responsibility, single page output

### Agent 4: Data Binding Integration
- Wire fieldRegistry values into page functions
- Use workbookFieldMapping for Excel-sourced data
- Implement placeholder fallbacks for missing data
- Validate all `{{fieldName}}` patterns resolved

### Agent 5: Assembly & Testing
- Build `generateFullReport()` orchestrator
- PDF generation test
- Visual comparison against reference PNGs
- Fix any page break issues

## Current State
- Executive Summary 3-page split: WORKING (proves architecture viable)
- Overall data binding: ~60% connected, 8+ hardcoded placeholders remain
- PDF output: Functional but clips overflow content

## Constraints
- Maintain TypeScript typing
- Keep React Query integration for data fetching
- Preserve existing API contracts
- Output must render in Puppeteer for PDF generation

## Success Criteria
- 79 discrete page functions
- Zero `overflow: hidden` clipping hacks
- All fieldRegistry values properly bound
- PDF output matches reference within 95% visual fidelity
- Template maintainable (add/remove pages without cascade failures)

## Start Command
```bash
cd /Users/bencrowe/Development/APR-Dashboard-v3
# Read the template first
cat src/features/report-builder/templates/reportHtmlTemplate.ts | head -500
# Then deploy Agent 1 for style extraction
```

---
*Generated: 2025-12-12*
*Context: Previous session hit environment limitations. This prompt enables fresh Claude Code terminal session with full sub-agent deployment capability.*
