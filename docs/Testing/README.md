# Testing Documentation

**Last Updated:** 2026-01-19

Central hub for all testing guides, protocols, and reference data.

---

## Structure

### Testing Guides
- **[ClickUp-4-Stage-Test.md](./ClickUp-4-Stage-Test.md)** - ClickUp automation testing (4-stage workflow)
- More testing guides to be added as features are tested

### Reference Data
- **[Field-Registry/](./Field-Registry/)** - Field registry test data
  - `empty-fields-list.json` - Complete field ID reference list (270 fields)

---

## Types of Testing

### 1. E2E Tests (Code-Level)
**Location:** `/tests/` (project root)

Playwright-based automated tests could be current or outdated. 

**Test Files:**
- `calc-demo.spec.ts` - Calculator demonstration tests
- `clickup-integration.spec.ts` - ClickUp API integration tests
- `full-workflow.spec.ts` - End-to-end workflow tests
- `test-calc-fields-integration.spec.ts` - Field integration validation
- `valcre-job-creation.spec.ts` - Valcre job creation tests
- `e2e/` - Additional E2E test scenarios
- `integration/` - Integration test suites
- `valcre/` - Valcre-specific tests

**Test Results:** `/test-results/`
- Playwright screenshots and debug artifacts
- Test run outputs and failures

**Status:** Existing but not heavily relied upon - prefer manual/API testing for reliability

**Purpose:** Baseline automated testing of UI and workflows

---

### 2. Feature Testing (System-Level)
**Location:** `docs/Testing/` (this directory)
- Feature testing guides
- Manual testing protocols
- System integration testing

**Purpose:** Verify features work end-to-end with real external APIs

---

### 3. API Testing
**Location:** `/scripts/api-tests.sh`
- ClickUp API tests
- Valcre API tests
- DocuSeal webhook tests
- Supabase Edge Function tests

**Purpose:** Validate external API integrations

---

## Testing Workflow

### For New Features
1. Write feature spec in `docs/Features/[feature]/`
2. Create testing guide in `docs/Testing/`
3. Write E2E tests in `/tests/`
4. Document test results in feature folder

### For Bug Fixes
1. Create reproduction test
2. Fix the bug
3. Verify test passes
4. Update testing documentation

---

## Quick Links

**Project Tests:**
- E2E Tests: `/tests/`
- Test Scripts: `/scripts/`
- Test Results: `/test-results/`

**Feature Testing:**
- ClickUp Integration: [ClickUp-4-Stage-Test.md](./ClickUp-4-Stage-Test.md)
- LOE Generation: `docs/Features/12-LOE-Esign/`
- Field Registry: `docs/Features/08-Master-Field-Registry/`

---

## Test Data

### Field Registry
- **empty-fields-list.json** - All field IDs for validation
- Use for checking field existence in registry

### Sample Jobs
- Test data generators in feature test scripts
- ClickUp test task creation in `/scripts/`

---

**Purpose:** Keep all testing documentation centralized and organized.
