# Feature 01: Foundation & Infrastructure

**Epic**: EPIC 1 - Foundation & Infrastructure
**Feature ID**: F01
**Complexity Size**: M (Medium)
**Status**: 📋 Not Started

---

## Overview

Establish technical foundation for APR Dashboard V4 build. Set up Next.js 15 project with React 19, TypeScript, Vite, and migrate existing Report Builder code from V3.

---

## Business Value

- **Clean architecture** for V4 development
- **Reuse existing V3 components** (Report Builder, Calculator)
- **Modern tooling** (Vite) for fast HMR and developer experience
- **Type safety** with TypeScript strict mode

---

## Deliverables

- [ ] Next.js 15 + React 19 + TypeScript project initialized
- [ ] Vite build configuration with fast HMR
- [ ] Migrate Report Builder code from V3 to V4 structure
- [ ] Set up Zustand store architecture (944+ field state management)
- [ ] Component library (Shadcn/UI) integrated
- [ ] ESLint + Prettier + Husky configured
- [ ] Basic routing structure (/report-builder, /preview, /client-portal)

---

## Technical Scope

### Files to Create
```
apr-dashboard-v4/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .eslintrc.js
├── .prettierrc
├── src/
│   ├── app/                    # Next.js 15 App Router
│   ├── components/
│   │   └── ui/                 # Shadcn/UI primitives
│   ├── features/
│   │   └── report-builder/     # Migrated from V3
│   │       ├── store/
│   │       ├── tables/
│   │       ├── editors/
│   │       └── schema/
│   ├── lib/
│   │   └── utils.ts
│   └── styles/
│       └── globals.css
└── public/
```

### Key Dependencies
```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "typescript": "^5.3.0",
  "vite": "^5.4.0",
  "zustand": "^4.5.0",
  "@shadcn/ui": "latest",
  "tailwindcss": "^3.4.0"
}
```

---

## Architecture Reference

- **Main Doc**: [APR-V4-ARCHITECTURE.md](../../Architecture/APR-V4-ARCHITECTURE.md) (Section 3.1 - Project Structure, lines 83-198)
- **Component Reuse**: Appendix B (lines 1562-1579)
- **Tech Stack**: Section 10.1 (lines 1176-1192)

---

## Dependencies

**Blocks**:
- Feature 02 (Database Schema) - needs DB structure defined
- Feature 03+ (All data entry features) - need foundation in place

**Requires**:
- V3 Report Builder code at: `/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/`

---

## Acceptance Criteria

- [ ] `npm run dev` starts development server without errors
- [ ] Hot Module Replacement (HMR) works (<200ms updates)
- [ ] TypeScript strict mode enabled with zero errors
- [ ] ESLint shows zero warnings
- [ ] Zustand store exports working with 944+ field types
- [ ] Basic routing navigates between /report-builder and /preview
- [ ] Shadcn/UI button component renders correctly

---

## Implementation Notes

### Migration Strategy
1. Copy V3 Report Builder folder structure
2. Update imports to Next.js 15 conventions
3. Verify Zustand store compatibility with React 19
4. Test calculator tables still work after migration

### Performance Targets
- Initial bundle size: <500KB (gzipped)
- HMR update time: <200ms
- TypeScript compilation: <10s

---

## Testing Requirements

- [ ] Unit tests: Zustand store actions
- [ ] Integration tests: Component rendering
- [ ] Build tests: Production build succeeds
- [ ] Type tests: No TypeScript errors

---

## Documentation

- [ ] Architecture decision record (ADR) for Next.js 15 choice
- [ ] Migration notes from V3 → V4
- [ ] Developer setup guide

---

## Progress Log

_Cursor updates this section after each work session_

### [Date] - Session 1
- Created Next.js 15 project
- Configured Vite
- ...

---

**Created**: 2026-01-10
**Last Updated**: 2026-01-10
**Owner**: Claude Code (Documentation Orchestrator)
