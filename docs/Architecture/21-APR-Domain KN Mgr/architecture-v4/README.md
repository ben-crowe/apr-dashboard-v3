# Architecture V4 - Reference Specifications

> **Purpose:** Detailed implementation specs for APR Dashboard V4 features
> **Primary Source:** See `../FULL-ECOSYSTEM-INTEGRATION.md` for strategic context
> **Last Updated:** 2026-01-06

---

## When to Use These Docs

| If you need... | Read this file |
|----------------|----------------|
| Strategic direction, 4-stage architecture | `../FULL-ECOSYSTEM-INTEGRATION.md` |
| Dual calculator verification spec | `APR-V4-ARCHITECTURE.md` Section 5 |
| Client link delivery system | `APR-V4-ARCHITECTURE.md` Section 7 |
| 79-page template component breakdown | `IMPLEMENTATION-ROADMAP.md` |
| Database schema proposals | `APR-V4-ARCHITECTURE.md` Section 11.2 |
| Component reuse analysis | `APR-V4-IMPLEMENTATION-GUIDE.md` |
| Zustand store patterns & data flow | `ARCHITECTURE-DIAGRAM.md` |

---

## Document Index

### APR-V4-ARCHITECTURE.md
**Created:** Nov 29, 2025 | **Status:** Concepts valid, field counts outdated

**Valuable Sections:**
- **Section 5: Dual Calculator Specification** - Side-by-side comparison between internal calculator and Excel import. Trust-building approach for transition from Excel workflow.
- **Section 6: Live HTML Preview System** - Preview architecture with iframe isolation.
- **Section 7: Client Link Delivery System** - Shareable URLs with expiry, password protection, QR codes. Solves 23MB email attachment problem.
- **Section 11.2: Database Schema** - `reports`, `report_shares`, `access_logs` table proposals.

**Outdated Content:**
- Field counts (says 330, now 944+)
- Section counts (says 19, now 22+ in sidebar)
- Timeline estimates (ignored per project rules)

---

### APR-V4-IMPLEMENTATION-GUIDE.md
**Created:** Dec 1, 2025 | **Status:** Quick-start guide, partially outdated

**Valuable Sections:**
- **Valcre READ Operations** - High-priority API additions to fetch 80+ fields automatically
- **Component Reuse Audit Summary** - Realistic: 15-20% portable (not 40%). Shadcn/ui portable, auth/routing/state need rebuild.
- **Key Named Ranges** - Excel extraction reference: `IA_DirCap_PGI`, `IA_DirCap_NOI`, etc.
- **Technical Constraints** - Zustand over Context, hybrid JSONB + columns for DB

---

### IMPLEMENTATION-ROADMAP.md
**Created:** Dec 10, 2025 | **Status:** Detailed template breakdown

**Valuable Sections:**
- **79-page North Battleford Report** - Complete component analysis
- **16 Distinct Layout Patterns** - P01-P16 with page mappings
- **18 Reusable Components** - C01-C18 with effort estimates
- **5 Phase Build Sequence** - Foundation -> Data -> Navigation -> Charts -> Comparables
- **Page Grouping by Pattern** - Groups A-I for implementation planning

**Use for:** Understanding HTML template complexity, planning component builds

---

### ARCHITECTURE-DIAGRAM.md
**Created:** Dec 4, 2025 | **Status:** Still accurate for MockReportBuilder

**Valuable Sections:**
- **Component Tree** - Full hierarchy from MockReportBuilder down
- **Data Flow Diagram** - Zustand store -> components -> preview
- **User Interaction Flow** - Edit -> debounce -> store -> preview pipeline
- **State Update Patterns** - Debounced text vs immediate image updates
- **File Dependencies** - Import tree for Report Builder

---

### APR-Platform-Strategy.md
**Created:** Dec 2025 | **Status:** Strategic direction (merged into FULL-ECOSYSTEM)

**Content moved to:** `../FULL-ECOSYSTEM-INTEGRATION.md` Section "Platform Independence Strategy"

The "Kill Valcre/ClickUp/Pipedrive" strategy with 3 workstreams is now part of the main ecosystem document.

---

### Other Files

| File | Status | Notes |
|------|--------|-------|
| `IMPLEMENTATION-STATUS.md` | Outdated | V3 bug tracking, not relevant to V4 |
| `MOCK-REPORT-BUILDER-IMPLEMENTATION.md` | Accurate | `/mock-builder` route implementation |
| `apr reseach prompt.md` | Reference | Original 3-agent research prompt |

---

## Key Decisions from These Specs

1. **Dual Calculator Mode** - Side-by-side comparison builds trust during Excel->Web transition
2. **Client Link Delivery** - Shareable URLs replace 23MB email attachments
3. **Component Reuse** - 15-20% realistic (shadcn/ui portable, state management needs rebuild)
4. **Database Strategy** - Hybrid JSONB + columns (narratives in JSONB, queryable fields as columns)
5. **State Management** - Zustand over Context (330+ fields cause re-render cascades with Context)

---

## Relationship to Other Docs

```
APR-Domain Mgr/
├── DOMAIN-CONTEXT.md              <- Mission, phases, current focus
├── FULL-ECOSYSTEM-INTEGRATION.md  <- WHAT we're building + WHY (strategic)
├── PENDING-TASKS.md               <- Current task queue
├── PROJECT-INDEX.md               <- Master directory
└── architecture-v4/
    ├── README.md                  <- YOU ARE HERE (index)
    ├── APR-V4-ARCHITECTURE.md     <- HOW: Calculator, delivery specs
    ├── IMPLEMENTATION-ROADMAP.md  <- HOW: Template component breakdown
    └── ARCHITECTURE-DIAGRAM.md    <- HOW: Data flow, component tree
```

**Rule:** Read FULL-ECOSYSTEM for context first. Dive into these specs when building specific features.

---

*Index created: 2026-01-06 by APR-Mgr*
