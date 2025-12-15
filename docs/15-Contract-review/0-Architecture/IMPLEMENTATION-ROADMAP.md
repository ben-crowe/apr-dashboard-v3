# Implementation Roadmap
## North Battleford Report - Build Strategy

**Purpose:** Prioritized, actionable plan to implement all 79 pages of the report template
**Status:** Ready for development
**Date:** 2025-12-10

---

## Executive Summary

**Total Pages:** 79
**Distinct Layout Patterns:** 16
**Reusable Components:** 18
**Estimated Implementation:** Build in 5 phases over development cycles

**Recommended Strategy:**
1. Build foundation components first (70% coverage)
2. Implement common patterns (80% coverage)
3. Add special layouts (95% coverage)
4. Polish and unique elements (100% coverage)
5. Testing and refinement

---

## Phase 1: Foundation Components (Week 1)

### Goal: Build core reusable components that appear on most pages

**Coverage:** 70% of report (55/79 pages)

### Components to Build

| Component | Priority | Pages | Effort |
|-----------|----------|-------|--------|
| C01: Chevron Footer Graphic | Critical | 76 | 2-3 hours |
| C02: Running Header | Critical | 73 | 1-2 hours |
| C03: Navy Header Table | Critical | 30+ | 3-4 hours |
| C08: Data Table (Multi-Column) | Critical | 20+ | 2-3 hours |
| C15: Text Section with Subsections | Critical | 35+ | 2-3 hours |
| C16: Bullet List | Critical | 10+ | 1 hour |

**Total Effort:** 11-16 hours

### Deliverables
- Chevron footer renders correctly in PDF
- Running header with blue underline component
- Navy header table with 2-6 column support
- Text section component with blue subsection headers
- Bullet list styling

### Test Pages After Phase 1
- Page 6: Property Dashboard (multi-table)
- Page 17: Property Analysis (text with headers)
- Page 23: Property Taxes (data table)
- Pages 9-12: Photo grids (if C06 added)

### Success Criteria
- Navy colors print correctly (use print-color-adjust: exact)
- Chevron footer appears on all pages
- Running header text updates per section
- Tables have no vertical borders
- Text is justified

---

## Phase 2: Data Presentation & Navigation (Week 2)

### Goal: Complete standard layout patterns and navigation elements

**Coverage:** 80% of report (63/79 pages)

### Patterns to Implement

| Pattern | Pages | Effort |
|---------|-------|--------|
| P01: Hero Cover Page | 1 | 2-3 hours |
| P02: Standard Letter | 3, 4 | 1-2 hours |
| P04: Multi-Table Dashboard | 6, 7 | 2 hours |
| P05: Standard Text Body | 35 pages | 1 hour (reuse C15) |
| P06: Photo Grid (2x3) | 9-12 | 2-3 hours |
| P08: Full-Width Map | 14-16, 30, 54 | 2 hours |
| P09: Data Table Page | 20+ pages | 1 hour (reuse C08) |

**Additional Components:**
- C06: Photo Item with Caption (2 hours)
- C07: Map Container (1 hour)
- C13: Signature Block (1 hour)

**Total Effort:** 12-15 hours

### Deliverables
- Cover page with diagonal navy overlay
- Letter template with optional callout box
- Photo grid layout (2x3)
- Map container with attribution
- Signature block component

### Test Pages After Phase 2
- Page 1: Cover page
- Page 3: Transmittal letter with value conclusion box
- Page 6-7: Executive summary dashboard
- Pages 9-12: Photo section (complete)
- Pages 14-16: Maps section (complete)

### Success Criteria
- Cover page diagonal overlay renders
- Photos maintain aspect ratio in grid
- Maps are full-width with borders
- Letter layout matches reference
- All test pages print correctly

---

## Phase 3: Special Layouts & TOC (Week 3)

### Goal: Implement unique navigation and custom layouts

**Coverage:** 85% of report (67/79 pages)

### Patterns to Implement

| Pattern | Pages | Effort |
|---------|-------|--------|
| P03: Split-Screen TOC | 5 | 4-5 hours |
| P10: Site Plan Diagram | 26-27 | 2 hours |
| P15: Signature/Certification | 65 | 1-2 hours |
| P16: Full Navy Back Cover | 79 | 1-2 hours |

**Additional Components:**
- C14: Value Conclusion Box (1 hour)
- C17: Site Plan Diagram Container (1 hour)

**Total Effort:** 9-12 hours

### Deliverables
- Split-screen TOC with 30% navy sidebar
- Site plan diagram layout
- Certification page with signature
- Full navy back cover page

### TOC Implementation Details
**Critical CSS:**
```css
.toc-page {
  display: grid;
  grid-template-columns: 30% 70%;
  min-height: 100vh;
}

.toc-sidebar {
  background-color: #003366;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
```

**Testing:**
- Navy sidebar must print (not gray)
- TOC entries align page numbers to right
- No header/footer on TOC page
- Proper page break after TOC

### Test Pages After Phase 3
- Page 5: Split-screen TOC (critical brand element)
- Pages 26-27: Site plans
- Page 65: Certification with signature
- Page 79: Back cover (navy background)

### Success Criteria
- TOC navy sidebar prints dark blue
- TOC page numbers align correctly
- Site plans are centered
- Back cover is full navy blue
- All pages in print preview

---

## Phase 4: Advanced Components & Charts (Week 4)

### Goal: Implement complex calculation tables and data visualization

**Coverage:** 95% of report (75/79 pages)

### Components to Implement

| Component | Pages | Effort |
|-----------|-------|--------|
| C04: Navy Section Divider Row | 50, 61-64 | 1 hour |
| C18: Calculation Table with Subtotals | 50, 61-64 | 6-8 hours |
| C11: Bar Chart Component | 47, 49, 60 | 4-5 hours |
| C12: Line Chart Component | 47 | 3-4 hours |

**Total Effort:** 14-18 hours

### Calculation Table Requirements
- Multiple section dividers inside tbody
- Subtotal and total rows with special styling
- Automatic red styling for negative values
- Right-aligned numbers
- Complex multi-column layouts

**Chart Implementation:**
- Use Chart.js or similar library
- Navy blue bars (#003366)
- Gray grid lines (#D0D0D0)
- Test PDF rendering (may need static image fallback)
- Ensure charts print correctly

### Test Pages After Phase 4
- Page 47: Capitalization Rate with line chart + bar chart
- Page 49: Direct Capitalization with bar chart + table
- Page 50: Direct Capitalization conclusion (complex table)
- Page 60: Sales Comparison bar chart
- Pages 61-64: Adjustment tables

### Success Criteria
- Section dividers appear navy inside table
- Red negatives auto-detect parentheses
- Calculations flow correctly (subtotals → totals)
- Charts render in PDF
- Numbers align properly

---

## Phase 5: Comparable Sale Sheets & Polish (Week 5)

### Goal: Implement most complex layout and final polish

**Coverage:** 100% of report (79/79 pages)

### Final Components

| Component | Pages | Effort |
|-----------|-------|--------|
| C10: Comparable Sale Card | 55-59 | 8-10 hours |
| C09: Comparables Map with Legend | 54 | 2 hours |

**Total Effort:** 10-12 hours

### Comparable Sale Card Complexity
- CSS Grid with 4 areas (2x2 + full-width remarks)
- Multiple tables inside grid areas
- Property photo + Google Map integration
- Each card on separate page
- 5 cards total (one per comparable)

**Grid Structure:**
```
┌───────────────────┬───────────┐
│  Sale Info        │  Photo    │  Row 1
│  (tables)         │           │
├───────────────────┼───────────┤
│  Property Details │  Map      │  Row 2
│  (tables)         │           │
├───────────────────┴───────────┤
│  Remarks (full width)         │  Row 3
└───────────────────────────────┘
```

### Polish Tasks
1. **Page break management**
   - Ensure sections start on new page where needed
   - Prevent breaks inside tables/charts
   - Comparable cards one per page

2. **Typography fine-tuning**
   - Verify font sizes match spec
   - Check line heights
   - Ensure text justification

3. **Color verification**
   - All navy elements print dark blue
   - Red negatives are #C00000
   - Chevron gradient renders correctly

4. **Print CSS optimization**
   - Test with Gotenberg
   - Verify page margins (0.75in L/R, 1.25in top, 1.0in bottom)
   - Check header/footer positioning

### Test Pages After Phase 5
- Page 54: Comparables location map with legend
- Pages 55-59: All 5 comparable sale sheets
- Full report PDF export (all 79 pages)

### Success Criteria
- All 79 pages render correctly
- Comparable cards use CSS Grid properly
- Photos and maps integrate seamlessly
- No layout breaks or overlaps
- PDF matches reference report visually

---

## Testing Strategy

### Unit Testing (Per Phase)
After each phase, test individual components:
- Component renders in isolation
- Props/inputs work correctly
- CSS styling matches spec
- Responsive behavior (if applicable)

### Integration Testing (After Phase 2, 4, 5)
Test complete pages:
- Components work together
- Page layout is correct
- Headers/footers appear
- Page breaks are proper

### PDF Testing (After Each Phase)
Generate PDF and verify:
- Colors print correctly (navy, red)
- Fonts render properly
- Images/photos display
- Charts appear (not blank)
- Page numbers correct
- No content cutoff

### Cross-Reference Testing (After Phase 5)
Compare generated PDF with reference:
- Side-by-side visual comparison
- Page count matches (79)
- Layout fidelity
- Typography matching
- Color accuracy

---

## Complexity vs Impact Matrix

### High Impact, Low Complexity (Do First)
- P05: Standard Text Body (35 pages)
- C03: Navy Header Table (30+ pages)
- C02: Running Header (73 pages)
- C01: Chevron Footer (76 pages)

### High Impact, Medium Complexity (Do Second)
- P06: Photo Grid (5 pages)
- P04: Multi-Table Dashboard (2 pages)
- C08: Data Table (20+ pages)

### High Impact, High Complexity (Do Third)
- P03: Split-Screen TOC (1 page, but critical brand element)
- C18: Calculation Table (5 pages, core valuation)
- C10: Comparable Sale Card (5 pages, unique layout)

### Medium Impact, High Complexity (Do Fourth)
- C11: Bar Chart (3 pages)
- C12: Line Chart (1 page)

### Low Impact, Any Complexity (Do Last)
- P16: Back Cover (1 page)
- C09: Comparables Map (1 page)
- P10: Site Plan (2 pages)

---

## Page Grouping by Pattern

### Group A: Standard Text Pages (Build with Phase 1)
**Pages:** 8, 17-25, 29, 32-36, 39-40, 52-53, 66-78
**Count:** 35 pages
**Pattern:** P05 (Standard Text Body)
**Components:** C02, C15, C16
**Effort:** Minimal after components built

### Group B: Data Table Pages (Build with Phase 1-2)
**Pages:** 19, 23, 28, 33, 34, 37, 38, 41-44, 45, 48, 51
**Count:** 16 pages
**Pattern:** P09 (Data Table Page)
**Components:** C02, C03, C08
**Effort:** Reuse existing components

### Group C: Photo Pages (Build with Phase 2)
**Pages:** 9, 10, 11, 12, 13
**Count:** 5 pages
**Pattern:** P06/P07 (Photo Grid)
**Components:** C02, C05, C06
**Effort:** 2-3 hours total

### Group D: Map Pages (Build with Phase 2)
**Pages:** 14, 15, 16, 30, 54
**Count:** 5 pages
**Pattern:** P08 (Full-Width Map)
**Components:** C02, C07, C09 (for page 54)
**Effort:** 2-3 hours total

### Group E: Dashboard Pages (Build with Phase 2)
**Pages:** 6, 7
**Count:** 2 pages
**Pattern:** P04 (Multi-Table Dashboard)
**Components:** C02, C03
**Effort:** 1-2 hours (stack multiple tables)

### Group F: Calculation Pages (Build with Phase 4)
**Pages:** 50, 61-64
**Count:** 5 pages
**Pattern:** P13 (Complex Calculation Table)
**Components:** C02, C04, C18
**Effort:** 6-8 hours

### Group G: Chart Pages (Build with Phase 4)
**Pages:** 47, 49, 60
**Count:** 3 pages
**Patterns:** P11, P12
**Components:** C02, C11, C12
**Effort:** 7-9 hours

### Group H: Comparable Pages (Build with Phase 5)
**Pages:** 54-59
**Count:** 6 pages
**Pattern:** P14 (Comparable Sale Sheet)
**Components:** C02, C09, C10
**Effort:** 10-12 hours

### Group I: Special Pages (Build with Phase 3)
**Pages:** 1, 3, 4, 5, 26, 27, 65, 79
**Count:** 8 pages
**Patterns:** P01, P02, P03, P10, P15, P16
**Various Components**
**Effort:** 9-12 hours

---

## Build Sequence Recommendation

### Week 1: Foundation
**Focus:** Core components
**Build:** C01, C02, C03, C08, C15, C16
**Test:** Pages 6, 17, 23
**Deliverable:** 35 pages working (standard text + simple tables)

### Week 2: Data Presentation
**Focus:** Visual elements and layouts
**Build:** P01, P02, P04, P06, P08, C06, C07, C13, C14
**Test:** Pages 1, 3-4, 6-7, 9-16
**Deliverable:** 55 pages working (70%)

### Week 3: Navigation & Special Layouts
**Focus:** TOC and unique pages
**Build:** P03, P10, P15, P16, C17
**Test:** Pages 5, 26-27, 65, 79
**Deliverable:** 67 pages working (85%)

### Week 4: Advanced Data
**Focus:** Charts and complex tables
**Build:** C04, C11, C12, C18
**Test:** Pages 47, 49, 50, 60-64
**Deliverable:** 75 pages working (95%)

### Week 5: Comparables & Polish
**Focus:** Most complex layout and refinement
**Build:** C09, C10
**Test:** Pages 54-59, full report
**Deliverable:** 79 pages working (100%)

---

## Risk Mitigation

### High-Risk Items

**1. Split-Screen TOC Navy Background**
- **Risk:** Navy sidebar might print gray or not at all
- **Mitigation:** Use print-color-adjust: exact on all navy elements
- **Testing:** Print PDF early in Phase 3
- **Backup:** Use background image if CSS fails

**2. Chevron Footer Gradient**
- **Risk:** Linear gradient may not render in PDF
- **Mitigation:** Test gradient early in Phase 1
- **Testing:** Generate PDF with footer component
- **Backup:** Use SVG or background image for chevron

**3. Charts in PDF**
- **Risk:** Canvas-based charts may not export to PDF
- **Mitigation:** Use Chart.js with PDF export plugin
- **Testing:** Generate PDF with charts in Phase 4
- **Backup:** Convert charts to static images before PDF generation

**4. Comparable Sale Card Grid Layout**
- **Risk:** CSS Grid may not work in PDF rendering
- **Mitigation:** Use CSS Grid with print-specific styles
- **Testing:** Test page 55 in Phase 5
- **Backup:** Use flexbox alternative or table-based layout

**5. Red Negative Value Detection**
- **Risk:** JavaScript may not detect all negative values
- **Mitigation:** Use multiple detection methods (parentheses, minus sign, numeric < 0)
- **Testing:** Test page 50 extensively
- **Backup:** Manual CSS class application

---

## Performance Considerations

### Page Load Time
- Target: < 2 seconds for full report
- Optimize images (compress photos, use WebP)
- Lazy load photos/maps
- Minify CSS/JS

### PDF Generation Time
- Target: < 10 seconds for 79-page report
- Use efficient HTML structure
- Minimize DOM complexity
- Optimize Gotenberg settings

### Bundle Size
- Target: < 500KB for template CSS/JS
- Use tree-shaking
- Minimize dependencies
- Consider component lazy loading

---

## Documentation Requirements

### Code Documentation
- Component prop interfaces
- Usage examples for each component
- CSS class documentation
- Integration guide

### Testing Documentation
- Test cases for each component
- PDF rendering checklist
- Visual regression test suite
- Browser compatibility notes

### Deployment Documentation
- Build process
- Environment variables
- Gotenberg configuration
- Troubleshooting guide

---

## Success Metrics

### Functional Metrics
- [ ] All 79 pages render correctly
- [ ] PDF exports successfully
- [ ] All colors print accurately
- [ ] Page breaks are correct
- [ ] Headers/footers on all pages

### Quality Metrics
- [ ] Visual fidelity > 95% vs reference
- [ ] Typography matches specification
- [ ] All tables display properly
- [ ] Photos maintain aspect ratio
- [ ] Charts render in PDF

### Performance Metrics
- [ ] Page load < 2 seconds
- [ ] PDF generation < 10 seconds
- [ ] Bundle size < 500KB
- [ ] No console errors
- [ ] Passes accessibility checks

---

## Maintenance Plan

### Regular Updates
- Review component library quarterly
- Update dependencies monthly
- Test PDF rendering after Gotenberg updates
- Verify print CSS after browser updates

### Component Versioning
- Use semantic versioning for components
- Document breaking changes
- Maintain changelog
- Provide migration guides

### Issue Tracking
- Report layout bugs
- Track PDF rendering issues
- Monitor performance regressions
- Document workarounds

---

## Appendix: Quick Reference

### Phase Checklist

**Phase 1: Foundation**
- [ ] Chevron footer component
- [ ] Running header component
- [ ] Navy header table component
- [ ] Data table component
- [ ] Text section component
- [ ] Bullet list styling
- [ ] Test pages 6, 17, 23

**Phase 2: Data Presentation**
- [ ] Cover page layout
- [ ] Letter template
- [ ] Photo grid layout
- [ ] Map container
- [ ] Signature block
- [ ] Test pages 1, 3-4, 6-16

**Phase 3: Special Layouts**
- [ ] Split-screen TOC
- [ ] Site plan layout
- [ ] Certification page
- [ ] Back cover
- [ ] Test pages 5, 26-27, 65, 79

**Phase 4: Advanced Components**
- [ ] Section divider rows
- [ ] Calculation table
- [ ] Bar chart component
- [ ] Line chart component
- [ ] Test pages 47, 49, 50, 60-64

**Phase 5: Comparables & Polish**
- [ ] Comparable sale card
- [ ] Comparables map
- [ ] Full report testing
- [ ] Visual regression tests
- [ ] Test all 79 pages

---

**Document Status:** Complete Implementation Roadmap
**Total Estimated Effort:** 50-65 hours across 5 phases
**Recommended Timeline:** 5 weeks (1 phase per week)
**Last Updated:** 2025-12-10
