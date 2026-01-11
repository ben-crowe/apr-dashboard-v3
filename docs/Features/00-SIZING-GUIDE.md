# Feature Sizing Guide

**Project**: APR Dashboard V4
**Date**: 2026-01-10
**Purpose**: Scope estimation using complexity blocks (NOT time estimates)

---

## Sizing System

We use **T-shirt sizes** to indicate feature complexity and scope:

| Size | Complexity | What This Means |
|------|------------|-----------------|
| **XS** | Minimal | Single component, straightforward logic, minimal dependencies |
| **S** | Small | Few components, clear requirements, low complexity |
| **M** | Medium | Multiple components, moderate complexity, some dependencies |
| **L** | Large | Many components, high complexity, significant dependencies |
| **XL** | Extra Large | Complex system, many moving parts, critical dependencies |

---

## Sizing Factors (NOT Time!)

### Code Volume
- XS: 1-2 files
- S: 3-5 files
- M: 6-15 files
- L: 16-30 files
- XL: 30+ files

### Integration Points
- XS: Self-contained (no external APIs)
- S: 1 external integration
- M: 2-3 integrations
- L: 4-6 integrations
- XL: Complex multi-system integration

### Unknowns / Risk
- XS: Well-defined, clear path
- S: Mostly clear, minor unknowns
- M: Some unknowns, moderate risk
- L: Significant unknowns, higher risk
- XL: Many unknowns, complex problem space

### Dependencies
- XS: No dependencies
- S: 1-2 feature dependencies
- M: 3-4 feature dependencies
- L: 5+ feature dependencies
- XL: Blocks entire system

---

## Feature Size Examples

### XS Examples
- Add a new form field
- Create a simple validation rule
- Style update to existing component
- Add a single database column

### S Examples
- **F18: ClickUp Stage 2** - Update task name, add custom field, status transition
- Create new UI section with 5-10 fields
- Add export format (JSON)
- Simple API integration

### M Examples
- **F01: Foundation** - Next.js setup, migration, component library
- **F02: Database Schema** - 3 tables, RLS policies, indexes
- **F09: Reconciliation** - Combine 3 approaches, weighting logic
- New section with 15-25 fields

### L Examples
- **F03: Core Sections** - 5 sections, 72 fields, reuse patterns
- **F06: Income Calculator** - 24 inputs → 85 outputs, 5 calculator tables
- **F11: Live Preview** - Split-screen, iframe, real-time rendering
- **F14: Share Links** - Token generation, security, expiry, QR codes

### XL Examples
- **F04: Narrative Sections** - 8 sections, 91 fields, rich text editors
- **F07: Sales Comparison** - Comparable grid, adjustments, validation
- **F12: Template System** - 79-page HTML, Handlebars, field interpolation
- **F17: Valcre Integration** - Two-way sync, field mapping, auto-population

---

## Updated Feature Sizes

### EPIC 1: Foundation & Infrastructure
| ID | Feature | Size |
|----|---------|------|
| F01 | Foundation-Infrastructure | **M** |
| F02 | Database-Schema | **M** |

### EPIC 2: Data Entry & Field Management
| ID | Feature | Size |
|----|---------|------|
| F03 | Core-Sections | **L** |
| F04 | Narrative-Sections | **XL** |
| F05 | Media-Management | **L** |

### EPIC 3: Calculation Engine
| ID | Feature | Size |
|----|---------|------|
| F06 | Income-Calculator | **L** |
| F07 | Sales-Comparison | **XL** |
| F08 | Cost-Approach | **M** |
| F09 | Reconciliation | **M** |
| F10 | Excel-Import | **L** |

### EPIC 4: Preview & Export
| ID | Feature | Size |
|----|---------|------|
| F11 | Live-Preview | **L** |
| F12 | Template-System | **XL** |
| F13 | Export-Engine | **L** |

### EPIC 5: Client Delivery
| ID | Feature | Size |
|----|---------|------|
| F14 | Share-Links | **L** |
| F15 | Client-Portal | **M** |
| F16 | Email-Delivery | **M** |

### EPIC 6: Integration & Workflow
| ID | Feature | Size |
|----|---------|------|
| F17 | Valcre-Integration | **XL** |
| F18 | ClickUp-Stage-2 | **S** |
| F19 | Dashboard-UX | **M** |
| F20 | LOE-Generator | **✅ Done** |

### EPIC 7: Testing & Deployment
| ID | Feature | Size |
|----|---------|------|
| F21 | Testing | **L** |
| F22 | Performance | **M** |
| F23 | Deployment | **M** |

### EPIC 8: Extended Features
| ID | Feature | Size |
|----|---------|------|
| F24 | Document-Management | **M** |
| F25 | Document-Extraction | **L** |
| F26 | Houski-Integration | **M** |

---

## Scope Summary

**By Size**:
- XS: 0 features
- S: 1 feature (F18)
- M: 10 features (F01, F02, F08, F09, F15, F16, F19, F22, F23, F24, F26)
- L: 10 features (F03, F05, F06, F10, F11, F13, F14, F21, F25)
- XL: 4 features (F04, F07, F12, F17)

**Total Scope**:
- **26 features** across 7 epics
- **4 XL features** (highest complexity)
- **10 L features** (large scope)
- **11 M features** (medium scope)
- **1 S feature** (small scope)

---

## Using This Guide

### For Cursor (Implementation)
- **XS-S**: Single session, straightforward implementation
- **M**: May need 1-2 sessions, moderate complexity
- **L**: Multiple sessions, complex logic, testing required
- **XL**: Break into sub-tasks, careful planning needed

### For Planning (Ben/Claude Code)
- **Size indicates scope**, not calendar time
- **XL features** may need additional briefing documents
- **Dependencies** matter more than size
- **MVP decisions** based on feature size + priority

### For Progress Tracking
- Mark feature as ✅ when complete, regardless of size
- Size helps explain "why is this taking multiple sessions?"
- Use size to validate if feature should be split

---

## Why Not Time Estimates?

**With LLMs (Cursor, Claude)**:
- M feature: Could be 20 minutes or 2 hours (depends on many factors)
- L feature: Could be 1 hour or 4 hours
- XL feature: Could be 2 hours or 8 hours

**Variability depends on**:
- LLM understanding of context
- Number of iterations needed
- Edge cases discovered
- Integration complexity
- Existing code quality

**Size blocks capture complexity**, not duration.

---

## Revision History

| Date | Change |
|------|--------|
| 2026-01-10 | Removed hour estimates, added T-shirt sizing |
| 2026-01-10 | Initial sizing guide created |

---

**Remember**: Sizes indicate **scope and complexity**, not **how long it will take**.
