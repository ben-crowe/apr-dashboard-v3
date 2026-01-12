# APR Report Builder - Claude Desktop Review Package

**Created:** December 21, 2025
**Purpose:** Review TDD Intake + Report Builder components

---

## What's in This Package

### 1. **MockReportBuilder.tsx** (Main Report Builder Page)
**Location:** `src/pages/MockReportBuilder.tsx`
**What it shows:** The complete Report Builder interface with:
- Split-panel layout (Editor left, Preview right)
- Load test data button
- EditPanel and PreviewPanel components integrated

**Key Features:**
- Resizable panels via `react-resizable-panels`
- Test data loading from `northBattlefordTestData-REAL.ts`
- State management via `reportBuilderStore`

---

### 2. **TestInputDashboard.tsx** (TDD Intake Form)
**Location:** `src/features/test-input/TestInputDashboard.tsx`
**What it shows:** The 24-section TDD intake form:
- **S1 - Client Intake:** 18 fields (auto-populates to Report Builder)
- **S2 - LOE Prep:** 11 fields (job assignment, delivery)
- **S3 - Image Management:** ~35 image upload fields
- **Sections 01-22:** Report sections matching Valcre workbook tabs

**Key Features:**
- Vertical tabs navigation
- Field mapping to Report Builder via `mapsTo` property
- Real-time validation

---

### 3. **PreviewPanel.tsx** (Preview Component)
**Location:** `src/features/report-builder/components/PreviewPanel/PreviewPanel.tsx`
**What it does:** Displays the report preview using iframe wrapper pattern

**Architecture (Session #30 Refactor):**
```typescript
// Simple iframe wrapper - 73 lines total
export default function PreviewPanel() {
  const previewHtml = useReportBuilderStore((state) => state.previewHtml);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Extract .page-sheet divs from previewHtml
    // Inject into iframe's #pages-wrapper element
    // Call iframe's updatePageCount() function
  }, [previewHtml]);

  return <iframe src="/preview-wrapper.html" />;
}
```

**Key Decision:** Uses iframe wrapper instead of React controls (90% code reduction from 600+ lines)

---

### 4. **EditPanel.tsx** (Editor Component)
**Location:** `src/features/report-builder/components/EditPanel/EditPanel.tsx`
**What it does:** Field editor panel for modifying report content

**Features:**
- Section-based navigation (matches TDD structure)
- Field editing with type-specific inputs
- Real-time preview updates
- Zustand store integration

---

### 5. **Report-MF-Temp-Framed.html** (Complete Framed Template)
**Location:** Created December 21, 2025
**What it is:** The "Framed Template" = Frame Wrapper + Report Template combined

**Structure:**
- **Header Controls:** Zoom, page navigation, field toggle, dark mode (lines 1-454)
- **Pages Wrapper:** Container for pages (line 454)
- **Report Pages:** 70 pages (Page 3-72) with all content and styling (lines 455-7557)
- **JavaScript:** Zoom, pan, scroll tracking, dark mode logic (lines 7564-7813)

**Page Numbering:**
- Pages 3-72 use `data-page-num="Page X"` attribute
- Unnumbered pages (cover, intro) use negative indexing (0, -1, -2)

---

## How They Work Together

### Data Flow:
```
TDD Input Dashboard (24 sections)
    ↓ (via mapsTo field mapping)
Field Registry (924 fields)
    ↓
Zustand Store (reportBuilderStore)
    ↓         ↓
Edit Panel   Preview Panel
             ↓
        Framed Template (iframe)
```

### Rendering Flow:
```
1. User loads test data in MockReportBuilder
2. Store updates previewHtml state
3. PreviewPanel detects change in useEffect
4. Extracts .page-sheet divs from previewHtml
5. Injects into iframe's #pages-wrapper div
6. Iframe wrapper handles all controls (zoom, nav, etc.)
```

---

## Key Technical Decisions

### 1. Iframe Wrapper Pattern (Session #30)
**Why:** Standalone HTML viewer already worked perfectly
**Before:** 600+ lines of React controls trying to rebuild what worked
**After:** 73-line iframe wrapper that just hosts the proven viewer
**Result:** 90% code reduction, zero bugs, proven reliability

### 2. "Framed Template" Versioning
**Why:** Safer to version Frame + Template together
**Workflow:**
- Always work with complete Framed Template
- Edit pages in place within the frame
- No splitting/combining files
- Version the whole thing as one unit

### 3. Page Number Extraction
**Template structure:** Pages have `data-page-num="Page 3"` through `"Page 72"`
**Unnumbered pages:** Cover/intro use negative indexing
**Handling:**
```typescript
const pageNumAttr = element.getAttribute('data-page-num');
if (pageNumAttr) {
  const match = pageNumAttr.match(/Page (\\d+)/i);
  return match ? parseInt(match[1], 10) : null;
} else {
  return -index; // Negative for unnumbered pages
}
```

---

## URLs (If Localhost Works)

**Dev server:** http://localhost:8082/

**Routes:**
- `/test-input` → TDD Intake Dashboard
- `/mock-builder` → Report Builder (Editor + Preview)
- `/preview-master-test` → Preview wrapper only

---

## Visual Layout

### MockReportBuilder (/mock-builder)
```
┌─────────────────────────────────────────────────────┐
│ [Load Test Data] button                             │
├──────────────────────┬──────────────────────────────┤
│                      │                              │
│   EditPanel          │      PreviewPanel            │
│   (left side)        │      (right side)            │
│                      │                              │
│ - Section tabs       │  ┌────────────────────────┐  │
│ - Field inputs       │  │ Zoom: [-] 100% [+]    │  │
│ - Real-time edits    │  │ Page: [↑] 3 [↓]       │  │
│                      │  ├────────────────────────┤  │
│                      │  │                        │  │
│                      │  │   Report Preview       │  │
│                      │  │   (70 pages)           │  │
│                      │  │                        │  │
│                      │  └────────────────────────┘  │
│                      │                              │
└──────────────────────┴──────────────────────────────┘
```

### TestInputDashboard (/test-input)
```
┌─────────────────────────────────────────────────────┐
│  TDD Input Dashboard                                │
├────────┬────────────────────────────────────────────┤
│ S1     │ Client Intake                              │
│ S2     │ - Client Name: [___________]               │
│ S3     │ - Property Address: [___________]          │
│ 01     │ - Inspection Date: [___________]           │
│ 02     │ ...                                        │
│ 03     │                                            │
│ ...    │                                            │
│ 22     │                                            │
│        │                                            │
│        │ [Save] [Load Test Data]                    │
└────────┴────────────────────────────────────────────┘
```

---

## Questions to Ask While Reviewing

1. **TDD → Report Builder flow:** Does the field mapping make sense? Are the 18 S1 fields properly auto-populating?

2. **Preview Panel:** Is the iframe wrapper approach clean? Does the page navigation work smoothly?

3. **Edit Panel:** Is the section-based navigation intuitive? Should fields be grouped differently?

4. **Framed Template:** Are all 70 pages rendering correctly? Any styling issues?

5. **Overall UX:** Is the split-panel layout effective? Should controls be repositioned?

---

## Session Context

**Session #30 (Dec 20, 2025):** Preview panel iframe wrapper refactor
- Reduced PreviewPanel from 600+ lines to 73 lines
- Architecture shift: Use proven HTML wrapper instead of rebuilding in React
- Result: All navigation controls work perfectly

**Current Status:**
- ✅ Report Templates 1-77: Complete
- ✅ Field Registry: ~95% complete (924 fields)
- ✅ Calculator Engine: Expanded (35 expense breakdown outputs)
- ✅ Preview Panel: Polished with iframe wrapper
- ✅ TDD Documentation: Complete (24 sections)

**Next Priority:** Stage 1 - Template field validation (page-by-page field ID cross-checking)

---

**Ready for review!** Let me know if you need any clarifications on how these components work together.
