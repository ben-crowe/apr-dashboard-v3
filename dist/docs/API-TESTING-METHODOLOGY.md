# API Testing Methodology - Empirical Integration Testing Guide

**Version:** 1.1
**Created:** November 16, 2025
**Updated:** November 16, 2025
**Status:** ✅ Production-Ready Methodology
**Applies To:** Any API-to-API integration project

---

## ⚡ STEP 0: THE FOUNDATIONAL PRINCIPLE (START HERE)

> **🎯 CRITICAL: This is the FIRST step for ANY API integration. Do this BEFORE any testing scripts, BEFORE any analysis, BEFORE any debugging.**

### The Dead Simple Approach That Works 90% of the Time

```
User fills ALL fields in target app → Gives agent record ID → Agent queries it → Done
```

**That's it. The API shows you the answer. Just look at it.**

---

### 🧑 USER RESPONSIBILITIES (User: Read This First!)

**⚠️ USER: Before asking the agent to debug or test ANY API integration:**

1. **Create ONE complete test record** in the target application (Valcre, ClickUp, Stripe, etc.)
   - Fill in **ALL fields** you want to map
   - Use realistic test data
   - Don't skip any fields

2. **Note the record ID** (job number, task ID, record number, etc.)
   - Example: VAL251031, TASK-12345, cust_abc123

3. **Give the agent:**
   - The record ID
   - API credentials (if not already configured)
   - Access to query the API

**That's it. The agent can now see EXACTLY what the API expects.**

---

### 🤖 AGENT RESPONSIBILITIES

**When user provides a complete test record ID:**

1. **Authenticate** with the target API
2. **Query the exact record** by ID
3. **Analyze the returned JSON** - this shows you:
   - Exact field names
   - Exact data formats
   - Exact enum values
   - Data types
   - Null vs populated fields
4. **Map fields directly** from what you see
5. **Done** - no guessing required

---

### Why This Works (It's Almost Too Simple)

**The Insight:**
- Any app with API access will return its own data structure
- If you fill in a record and query it, **the API tells you the answer**
- No documentation needed
- No guessing
- No trial and error

**Example - Valcre Multi-Family Type:**

**❌ What We Did (The Hard Way):**
```
Agent: Guessed "Multi-Family" → API Error ❌
Agent: Guessed "Multifamily" → API Error ❌
Agent: Guessed "multi_family" → API Error ❌
Agent: Guessed "MultiFamily" → Success ✅
Time wasted: 3 hours
```

**✅ What We SHOULD Have Done:**
```
User: "I created job VAL251031 with Multi-Family type selected"
Agent: Queries GET /api/v1/Jobs('VAL251031')?$expand=Property
Agent: Sees Property.Types = "MultiFamily"
Agent: "Ah, it needs PascalCase with no hyphen"
Time spent: 2 minutes
```

---

### The Complete Step 0 Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  USER: Create test record with ALL fields filled            │
│  - Use target app's UI to fill in everything                │
│  - Note the record ID                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  USER: Share record ID with agent                           │
│  "I created job VAL251031 with all fields filled"           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  AGENT: Query that exact record via API                     │
│  GET /api/v1/records/{id}?$expand=...                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  AGENT: Analyze returned JSON structure                     │
│  - See exact field names                                    │
│  - See exact formats                                        │
│  - See exact enum values                                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  AGENT: Map fields directly                                 │
│  Source App Field → Target App Field (from JSON)            │
│  NO GUESSING REQUIRED ✅                                     │
└─────────────────────────────────────────────────────────────┘
```

---

### When Step 0 Is Enough (90% of Cases)

✅ **Use Step 0 when:**
- Mapping fields for the first time
- Discovering API field names
- Understanding data formats
- Finding enum values
- Troubleshooting a single field

**Result:** Field mapping completed in minutes, not hours.

---

### When You Need Advanced Testing (10% of Cases)

⚠️ **Move to Advanced Testing below when:**
- Need to verify ALL possible enum values (e.g., 17 property types)
- Discovering patterns across multiple record types
- Testing edge cases and boundary conditions
- Building comprehensive validation suites
- API behavior differs across different record states

**See:** [Advanced Testing Methodology](#core-principles) below for comprehensive test script patterns.

---

### Step 0 Template Script

```typescript
/**
 * Step 0: Query Complete Test Record
 *
 * Usage: npx tsx query-test-record.ts <recordId>
 */

async function authenticate() {
  // Your API authentication
  return "access_token";
}

async function queryCompleteRecord(recordId: string) {
  const token = await authenticate();

  console.log(`Querying record: ${recordId}\n`);

  const response = await fetch(
    `https://api.example.com/records/${recordId}?expand=all`,
    {
      headers: { "Authorization": `Bearer ${token}` }
    }
  );

  const record = await response.json();

  console.log("Complete Record Structure:");
  console.log(JSON.stringify(record, null, 2));

  console.log("\n📋 Field Mapping Discovered:");
  Object.keys(record).forEach(field => {
    const value = record[field];
    const type = typeof value;
    console.log(`  ${field}: ${type} = ${JSON.stringify(value)}`);
  });
}

const recordId = process.argv[2];
if (!recordId) {
  console.error("Usage: npx tsx query-test-record.ts <recordId>");
  process.exit(1);
}

queryCompleteRecord(recordId);
```

---

### Why We Forget This (And Why Users Need Reminding)

**It feels too simple.** We're conditioned to think API integration is complex, so we jump to:
- Reading (outdated) documentation
- Writing test scripts
- Analyzing multiple records
- Testing format variations

**But the answer is right there:** Just query a complete record and LOOK at what the API returns.

**⚠️ REMINDER FOR USERS:**
- Don't ask agent to "figure out" field mapping
- Don't ask agent to "test" API integration
- **FIRST:** Create complete record → Share ID → Agent queries it
- **THEN:** If needed, ask for advanced testing

---

## 🔬 Advanced Testing Methodology

**Use this section when Step 0 isn't sufficient for your use case.**

### Purpose

This section provides advanced methodology for testing and validating API integrations through empirical data analysis when you need comprehensive verification beyond a single record query.

**When to use:** Edge case testing, multi-value verification, pattern discovery across record types.

---

## Table of Contents (Advanced)

1. [Core Principles](#core-principles)
2. [Methodology Overview](#methodology-overview)
3. [Testing Workflow](#testing-workflow)
4. [Test Script Patterns](#test-script-patterns)
5. [Common Pitfalls](#common-pitfalls)
6. [Case Study: Multi-Family Property Type](#case-study-multi-family-property-type)
7. [Template Scripts](#template-scripts)

---

## Core Principles

### 1. Empirical Over Documentary

**Problem:** API documentation is often:
- Incomplete or outdated
- Missing edge cases
- Incorrect about field formats
- Ambiguous about enum values

**Solution:** Query actual production data to discover truth

```typescript
// ❌ BAD: Trusting documentation
const propertyType = "Multi-Family"; // Docs say this works

// ✅ GOOD: Testing actual API
const actualJobs = await queryExistingJobs();
const actualPropertyTypes = jobs.map(j => j.Property.Types);
// Discover: All use "MultiFamily" (no hyphen)
```

### 2. Test With Existing Data

**Problem:** Creating new test records:
- Pollutes production database
- May trigger unwanted side effects
- Can't be easily cleaned up
- Wastes API rate limits

**Solution:** Always test against existing, designated test records

```typescript
// ❌ BAD: Creating new test data
const newJob = await api.createJob({ /* test data */ });

// ✅ GOOD: Using existing test record
const TEST_JOB_ID = "25628739"; // Designated test record
await api.updateJob(TEST_JOB_ID, { /* test update */ });
```

### 3. Iterative Format Discovery

**Problem:** Guessing field formats leads to:
- Multiple failed deployments
- Wasted development time
- Production errors
- User frustration

**Solution:** Systematically test format variations

```typescript
// Test different format variations systematically
const formats = [
  "Multi-Family",     // Hypothesis 1: Hyphenated
  "Multifamily",      // Hypothesis 2: No hyphen, lowercase
  "multi_family",     // Hypothesis 3: Snake case
  "MultiFamily"       // Hypothesis 4: PascalCase
];

for (const format of formats) {
  const result = await testFormat(format);
  console.log(`${format}: ${result.success ? "✅" : "❌"}`);
}

// Result: Only "MultiFamily" succeeds → Update mapping
```

### 4. Comprehensive Verification

**Problem:** Testing only one scenario misses:
- Edge cases
- Other affected fields
- Regression issues

**Solution:** Create comprehensive test suites covering all variations

```typescript
// ✅ GOOD: Test all possible values
const ALL_PROPERTY_TYPES = [
  "Agriculture", "Building", "Healthcare", "Hospitality",
  "Industrial", "Land", "Multi-Family", "Office",
  // ... all 17 types
];

for (const type of ALL_PROPERTY_TYPES) {
  await testPropertyType(type);
}
// Ensures ALL types work, not just the one you're debugging
```

### 5. Document Everything

**Problem:** Discoveries are lost when:
- Team members change
- Context is forgotten
- Same issues recur months later

**Solution:** Document findings immediately with evidence

```markdown
## Discovery: Healthcare Property Type Format

**Date:** Nov 16, 2025
**Tested By:** Empirical script testing
**Test Property:** 25628739

**Hypothesis:** Healthcare requires "HealthCare" (capital C)

**Evidence:**
- Attempt "Healthcare" → ❌ "Requested value 'Healthcare' was not found"
- Attempt "HealthCare" → ✅ SUCCESS
- Query 10 existing Healthcare jobs → All use "HealthCare"

**Conclusion:** Valcre requires "HealthCare" with capital C

**Code Change:** Added to TYPES_FIELD_MAP
```

---

## Methodology Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PROBLEM IDENTIFIED                        │
│              (API integration not working)                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│               STEP 1: QUERY ACTUAL DATA                      │
│   Fetch existing API records to see what values exist       │
│   - Get 20-50 recent records                                │
│   - Analyze field values and patterns                       │
│   - Identify format requirements                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│          STEP 2: FORMULATE HYPOTHESES                        │
│   Based on actual data, create testable hypotheses          │
│   - What format does the API expect?                        │
│   - Are there multiple variations?                          │
│   - What are the exact enum values?                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│            STEP 3: EMPIRICAL TESTING                         │
│   Test each hypothesis against existing test record         │
│   - Try format variation 1 → Record result                  │
│   - Try format variation 2 → Record result                  │
│   - Continue until success found                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│          STEP 4: COMPREHENSIVE VERIFICATION                  │
│   Create test suite covering ALL variations                 │
│   - Test all enum values                                    │
│   - Test edge cases                                         │
│   - Verify no regressions                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 5: IMPLEMENT & DOCUMENT                    │
│   Update code and documentation with findings               │
│   - Add format conversion logic                             │
│   - Document discovery process                              │
│   - Create/update field mapping reference                   │
│   - Add test scripts to library                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Testing Workflow

### Phase 1: Discovery (Query Actual Data)

**Goal:** Understand what the API actually uses, not what docs say

**Script Pattern:**
```typescript
async function discoverFieldPatterns() {
  console.log("Authenticating with API...");
  const token = await authenticate();

  console.log("Fetching recent records...");
  const records = await api.get("/endpoint", {
    params: { limit: 50 }
  });

  console.log("Analyzing patterns...");
  const fieldAnalysis = records.map(record => ({
    id: record.id,
    fieldValue: record.targetField,
    relatedField: record.relatedField
  }));

  // Group by pattern
  const patterns = {};
  fieldAnalysis.forEach(item => {
    const key = item.fieldValue;
    if (!patterns[key]) patterns[key] = 0;
    patterns[key]++;
  });

  console.log("\nField Value Distribution:");
  Object.entries(patterns)
    .sort((a, b) => b[1] - a[1])
    .forEach(([value, count]) => {
      console.log(`  ${value}: ${count} occurrences`);
    });
}
```

**Questions to Answer:**
- What exact values appear in the field?
- Are there multiple format variations?
- Which related fields are populated?
- Are there null/empty patterns?

### Phase 2: Hypothesis Formation

**Goal:** Create testable predictions based on discovered patterns

**Example Analysis:**
```
Observed Data:
- 30 records with Property.Types = "MultiFamily" (PascalCase, no hyphen)
- 0 records with Property.Types = "Multi-Family" (hyphenated)
- 30 records with Property.PropertyType = NULL

Hypotheses:
1. API requires PascalCase format (MultiFamily, not Multi-Family)
2. Hyphens are not allowed
3. PropertyType field is not used for multi-select
4. Types field is the primary field
```

### Phase 3: Empirical Testing

**Goal:** Systematically test each hypothesis using existing test record

**Script Pattern:**
```typescript
async function testFormatVariations(testRecordId: string) {
  const token = await authenticate();

  const formatVariations = [
    { name: "Hyphenated", value: "Multi-Family" },
    { name: "Lowercase no hyphen", value: "Multifamily" },
    { name: "Snake case", value: "multi_family" },
    { name: "PascalCase", value: "MultiFamily" }
  ];

  const results = [];

  for (const variant of formatVariations) {
    console.log(`Testing: ${variant.name} (${variant.value})`);

    try {
      await api.patch(`/records/${testRecordId}`, {
        targetField: variant.value
      });

      // Verify update
      const updated = await api.get(`/records/${testRecordId}`);
      const success = updated.targetField === variant.value;

      results.push({
        ...variant,
        success,
        actualValue: updated.targetField
      });

      console.log(success ? "  ✅ SUCCESS" : "  ❌ FAILED");

    } catch (error) {
      results.push({
        ...variant,
        success: false,
        error: error.message
      });
      console.log(`  ❌ ERROR: ${error.message}`);
    }

    // Delay to avoid rate limiting
    await sleep(1500);
  }

  return results;
}
```

### Phase 4: Comprehensive Verification

**Goal:** Test ALL possible values to ensure complete coverage

**Script Pattern:**
```typescript
async function comprehensiveTest(testRecordId: string) {
  const ALL_VALUES = [
    "Value1", "Value2", "Value3",
    // ... all possible values
  ];

  const results = [];

  for (let i = 0; i < ALL_VALUES.length; i++) {
    const value = ALL_VALUES[i];
    console.log(`[${i+1}/${ALL_VALUES.length}] Testing "${value}"...`);

    const result = await testSingleValue(testRecordId, value);
    results.push(result);

    if (result.success) {
      console.log(`  ✅ PASS`);
    } else {
      console.log(`  ❌ FAIL: ${result.error}`);
    }
  }

  // Summary
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`\n✅ Passed: ${passed}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);

  return { passed, failed, results };
}
```

### Phase 5: Implementation & Documentation

**Goal:** Update code and create permanent documentation

**Steps:**
1. Add format conversion logic to API handler
2. Create comprehensive documentation
3. Update field mapping reference
4. Add test scripts to library
5. Document discovery process for future reference

---

## Test Script Patterns

### Pattern 1: Data Discovery Script

**Purpose:** Query API to discover existing patterns

```typescript
/**
 * Data Discovery Script Template
 *
 * Usage: npx tsx discover-field-patterns.ts
 */

interface RecordAnalysis {
  id: string;
  fieldValue: any;
  relatedFields: Record<string, any>;
}

async function authenticate(): Promise<string> {
  // Implement authentication logic
  return "access_token";
}

async function fetchRecords(token: string, limit: number = 50): Promise<any[]> {
  const response = await fetch("https://api.example.com/endpoint", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return await response.json();
}

async function analyzeFieldPatterns() {
  console.log("=".repeat(80));
  console.log("FIELD PATTERN DISCOVERY");
  console.log("=".repeat(80));

  const token = await authenticate();
  const records = await fetchRecords(token, 50);

  console.log(`\nAnalyzing ${records.length} records...\n`);

  // Analyze target field
  const fieldValues = new Map<any, number>();

  records.forEach(record => {
    const value = record.targetField;
    fieldValues.set(value, (fieldValues.get(value) || 0) + 1);
  });

  console.log("Field Value Distribution:");
  Array.from(fieldValues.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([value, count]) => {
      const percentage = ((count / records.length) * 100).toFixed(1);
      console.log(`  "${value}": ${count} (${percentage}%)`);
    });
}

analyzeFieldPatterns();
```

### Pattern 2: Format Testing Script

**Purpose:** Test different format variations

```typescript
/**
 * Format Testing Script Template
 *
 * Usage: npx tsx test-formats.ts <recordId>
 */

interface FormatTest {
  name: string;
  value: any;
  success: boolean;
  error?: string;
}

const FORMAT_VARIATIONS = [
  { name: "Original", value: "original-value" },
  { name: "Modified 1", value: "modified-value-1" },
  { name: "Modified 2", value: "modified-value-2" },
];

async function testFormat(
  token: string,
  recordId: string,
  format: any
): Promise<boolean> {
  try {
    await fetch(`https://api.example.com/records/${recordId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ targetField: format })
    });

    // Verify
    const response = await fetch(`https://api.example.com/records/${recordId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const record = await response.json();

    return record.targetField === format;
  } catch (error) {
    throw error;
  }
}

async function main() {
  const recordId = process.argv[2] || "default-test-record";
  const token = await authenticate();

  console.log(`Testing formats on record: ${recordId}\n`);

  const results: FormatTest[] = [];

  for (const variant of FORMAT_VARIATIONS) {
    process.stdout.write(`Testing "${variant.name}"... `);

    try {
      const success = await testFormat(token, recordId, variant.value);
      results.push({ ...variant, success });
      console.log(success ? "✅" : "❌");
    } catch (error: any) {
      results.push({ ...variant, success: false, error: error.message });
      console.log(`❌ ERROR: ${error.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Summary
  const passed = results.filter(r => r.success).length;
  console.log(`\n✅ Passed: ${passed}/${results.length}`);
}

main();
```

### Pattern 3: Comprehensive Verification Script

**Purpose:** Test all possible values systematically

```typescript
/**
 * Comprehensive Verification Script Template
 *
 * Usage: npx tsx verify-all-values.ts <recordId>
 */

const ALL_EXPECTED_VALUES = [
  "Value1",
  "Value2",
  "Value3",
  // ... complete list
];

const EXPECTED_FORMATS: Record<string, string> = {
  "Value1": "ApiFormat1",
  "Value2": "ApiFormat2",
  "Value3": "ApiFormat3",
};

interface TestResult {
  inputValue: string;
  expectedFormat: string;
  actualFormat: string | null;
  success: boolean;
  error?: string;
}

async function testValue(
  token: string,
  recordId: string,
  value: string
): Promise<TestResult> {
  const expectedFormat = EXPECTED_FORMATS[value];

  try {
    // Update
    await fetch(`https://api.example.com/records/${recordId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ targetField: expectedFormat })
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Verify
    const response = await fetch(`https://api.example.com/records/${recordId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const record = await response.json();
    const actualFormat = record.targetField;

    return {
      inputValue: value,
      expectedFormat,
      actualFormat,
      success: actualFormat === expectedFormat
    };
  } catch (error: any) {
    return {
      inputValue: value,
      expectedFormat,
      actualFormat: null,
      success: false,
      error: error.message
    };
  }
}

async function main() {
  console.log("=".repeat(80));
  console.log("COMPREHENSIVE VALUE VERIFICATION");
  console.log("=".repeat(80));

  const recordId = process.argv[2] || "default-test-record";
  const token = await authenticate();

  console.log(`\nTesting ${ALL_EXPECTED_VALUES.length} values on record: ${recordId}\n`);

  const results: TestResult[] = [];

  for (let i = 0; i < ALL_EXPECTED_VALUES.length; i++) {
    const value = ALL_EXPECTED_VALUES[i];
    process.stdout.write(`[${i+1}/${ALL_EXPECTED_VALUES.length}] Testing "${value}"... `);

    const result = await testValue(token, recordId, value);
    results.push(result);

    if (result.success) {
      console.log(`✅ PASS`);
    } else {
      console.log(`❌ FAIL`);
      if (result.error) console.log(`    Error: ${result.error}`);
    }
  }

  // Summary
  console.log("\n" + "=".repeat(80));
  console.log("TEST SUMMARY");
  console.log("=".repeat(80));

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`\n✅ Passed: ${passed}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);

  if (failed > 0) {
    console.log("\n❌ FAILED TESTS:");
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`   - ${r.inputValue}`);
        console.log(`     Expected: "${r.expectedFormat}"`);
        console.log(`     Got: "${r.actualFormat}"`);
        if (r.error) console.log(`     Error: ${r.error}`);
      });
  }

  process.exit(failed > 0 ? 1 : 0);
}

main();
```

---

## Common Pitfalls

### Pitfall 1: Trusting Documentation Without Verification

**Problem:**
```typescript
// API docs say: "Use 'Multi-Family' for multi-family properties"
const propertyType = "Multi-Family";

// Deployed to production → FAILS
// API Error: "Requested value 'Multi-Family' was not found"
```

**Solution:**
```typescript
// Query 30 actual records first
const actualRecords = await api.getRecords({ limit: 30 });
const actualValues = actualRecords.map(r => r.propertyType);
console.log(actualValues);
// All show "MultiFamily" (no hyphen, PascalCase)

// Use discovered value
const propertyType = "MultiFamily"; // ✅ Works
```

### Pitfall 2: Testing in Production Without Safety Net

**Problem:**
```typescript
// Creating new production records for testing
const testJob = await api.createJob({ /* test data */ });
// Oops, can't delete it. Clutters production database.
```

**Solution:**
```typescript
// Use designated test record
const TEST_RECORD_ID = "designated-test-record";
await api.updateRecord(TEST_RECORD_ID, { /* test data */ });
// Safe to update repeatedly, doesn't create clutter
```

### Pitfall 3: Assuming Single Format Works for All

**Problem:**
```typescript
// Found that "Office" works
const propertyType = "Office"; // ✅ Works

// Assumed all property types use same format
const propertyType = "Multi-Family"; // ❌ FAILS (needs "MultiFamily")
const propertyType = "Healthcare"; // ❌ FAILS (needs "HealthCare")
```

**Solution:**
```typescript
// Test ALL values comprehensively
const ALL_TYPES = ["Office", "Multi-Family", "Healthcare", /* ... */];
const results = await testAllPropertyTypes(ALL_TYPES);
// Discovers: Office ✅, Multi-Family ❌, Healthcare ❌
// Create mapping for special cases
```

### Pitfall 4: Not Documenting Discovery Process

**Problem:**
- 6 months later: "Why did we map Healthcare to HealthCare?"
- Team member: "Is this correct? Should I change it?"
- No record of testing or rationale

**Solution:**
```markdown
## Healthcare Property Type Mapping

**Discovered:** Nov 16, 2025
**Test Script:** test-all-property-types.ts
**Test Record:** 25628739

**Evidence:**
- Attempted "Healthcare" → Error: "Requested value 'Healthcare' was not found"
- Attempted "HealthCare" → ✅ SUCCESS
- Queried 10 existing Healthcare jobs → All use "HealthCare"

**Conclusion:** Valcre requires capital C in "HealthCare"

**Mapping Added:** `'Healthcare': 'HealthCare'` in TYPES_FIELD_MAP
```

### Pitfall 5: Deploying Without Comprehensive Testing

**Problem:**
```typescript
// Fixed Multi-Family mapping
'Multi-Family': 'MultiFamily'  // Tested and works ✅

// Deployed immediately
// Later discovered: Healthcare also broken ❌
```

**Solution:**
```typescript
// Run comprehensive test suite BEFORE deploying
const results = await testAllPropertyTypes([
  "Agriculture", "Building", "Healthcare", "Hospitality",
  "Industrial", "Land", "Multi-Family", "Office",
  // ... all 17 types
]);

// Results: 16/17 passing, Healthcare failing
// Fix Healthcare BEFORE deploying
// Re-run: 17/17 passing ✅
// NOW deploy with confidence
```

---

## Case Study: Multi-Family Property Type

**Real-world example demonstrating this methodology in action**

### Initial Problem

Dashboard Multi-Family property type failing to create Valcre jobs with error:
```
{"error":["Requested value 'Multi-Family' was not found."]}
```

### Failed Approaches (Traditional)

**Attempt 1:** Changed to "Multifamily" (lowercase f)
- ❌ Result: "Requested value 'Multifamily' was not found"

**Attempt 2:** Kept hyphen "Multi-Family"
- ❌ Result: "Requested value 'Multi-Family' was not found"

**Attempt 3:** Tried snake_case "multi_family"
- ❌ Result: "Requested value 'multi_family' was not found"

**Problem:** Guessing formats wastes time and frustrates users

### Empirical Approach (Success)

**Step 1: Query Actual Data**
Created `test-valcre-property-types.ts`:
```typescript
const jobs = await fetchJobs({ limit: 30 });
const propertyTypes = jobs
  .filter(j => j.Property.Types?.includes("Family"))
  .map(j => ({
    PropertyType: j.Property.PropertyType,
    Types: j.Property.Types
  }));
```

**Discovery:**
```
All 30 Multi-Family properties:
- PropertyType: NULL/empty
- Types: "MultiFamily" (PascalCase, no hyphen)

Conclusion: Types field uses "MultiFamily" format
```

**Step 2: Hypothesis Formation**
```
Hypothesis: Valcre requires PascalCase without hyphens
- "Multi-Family" → "MultiFamily"
- "Self-Storage" → "SelfStorage"
- "Single-Family" → "SingleFamily"
```

**Step 3: Empirical Testing**
Created `update-property-type.ts` to test formats:
```typescript
// Test 1
await updateProperty(TEST_ID, { Types: "Multi-Family" });
// ❌ ERROR: "Requested value 'Multi-Family' was not found"

// Test 2
await updateProperty(TEST_ID, { Types: "Multifamily" });
// ❌ ERROR: "Requested value 'Multifamily' was not found"

// Test 3
await updateProperty(TEST_ID, { Types: "MultiFamily" });
// ✅ SUCCESS!
```

**Step 4: Comprehensive Verification**
Created `test-all-property-types.ts`:
```typescript
const results = await testAllPropertyTypes([
  "Agriculture", "Building", "Healthcare", // ... all 17
]);

// Initial: 16/17 passing (Healthcare failing)
// Fixed: Added 'Healthcare': 'HealthCare'
// Final: 17/17 passing ✅
```

**Step 5: Implementation**
Added `TYPES_FIELD_MAP` to `api/valcre.ts`:
```typescript
const TYPES_FIELD_MAP: Record<string, string> = {
  'Multi-Family': 'MultiFamily',
  'Single-Family': 'SingleFamily',
  'Self-Storage': 'SelfStorage',
  'Manufactured Housing': 'ManufacturedHousing',
  'Special Purpose': 'SpecialPurpose',
  'Healthcare': 'HealthCare',
};
```

**Documentation:**
- Created `PROPERTY-TYPE-FIELD-MAPPING.md`
- Updated `1-API-FIELD-MAPPING-REFERENCE.md`
- Added test scripts to library
- Documented discovery process

### Results

- ✅ Multi-Family property type working
- ✅ All 17 property types verified
- ✅ Comprehensive test suite created
- ✅ Future-proof documentation
- ✅ Reusable methodology established

**Time Saved:** Prevented weeks of trial-and-error debugging for future field mapping issues

---

## Template Scripts

### Minimal Discovery Script

```typescript
/**
 * Minimal API Discovery Script
 * Replace API_ENDPOINT, authenticate(), and field names
 */

async function authenticate() {
  // Your auth logic here
  return "access_token";
}

async function discoverFieldPatterns() {
  const token = await authenticate();

  const response = await fetch("https://api.example.com/records?limit=50", {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const records = await response.json();

  // Analyze field
  const fieldValues = new Map();
  records.forEach((r: any) => {
    const value = r.targetField;
    fieldValues.set(value, (fieldValues.get(value) || 0) + 1);
  });

  console.log("Field Distribution:");
  Array.from(fieldValues.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([value, count]) => {
      console.log(`  ${value}: ${count}`);
    });
}

discoverFieldPatterns();
```

### Minimal Format Test Script

```typescript
/**
 * Minimal Format Testing Script
 */

const FORMATS_TO_TEST = [
  "format-variation-1",
  "format-variation-2",
  "format-variation-3"
];

async function testFormat(recordId: string, format: string) {
  const token = await authenticate();

  try {
    await fetch(`https://api.example.com/records/${recordId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ targetField: format })
    });

    console.log(`${format}: ✅`);
    return true;
  } catch (error: any) {
    console.log(`${format}: ❌ ${error.message}`);
    return false;
  }
}

async function main() {
  const recordId = process.argv[2] || "test-record-id";

  for (const format of FORMATS_TO_TEST) {
    await testFormat(recordId, format);
    await new Promise(r => setTimeout(r, 1000));
  }
}

main();
```

---

## Summary

**Key Takeaways:**

**MOST IMPORTANT (Step 0):**
1. **USER: Create complete test record → Note ID → Share with agent**
2. **AGENT: Query that record → See exact structure → Map directly**
3. **Result: Done in 2 minutes, no guessing**

**Advanced Testing (When Step 0 Isn't Enough):**
1. **Always query actual API data** before making assumptions
2. **Use existing test records** - never create new ones
3. **Test format variations systematically** - don't guess
4. **Verify comprehensively** - test all values, not just one
5. **Document discoveries** - include evidence and rationale

**Workflow:**
```
Step 0 (90% of cases): Create Record → Query It → Map → Done ✅

Advanced (10% of cases): Problem → Query Data → Hypothesize → Test → Verify → Document → Deploy
```

**Benefits:**
- ✅ 2-minute solutions for most field mapping
- ✅ Faster debugging for edge cases
- ✅ Fewer production errors
- ✅ Better documentation
- ✅ Reusable test scripts
- ✅ Institutional knowledge preservation

---

## Related Documentation

**Valcre-Specific Implementation:**
- [API Field Mapping Reference](1-API-FIELD-MAPPING-REFERENCE.md) - Complete Valcre field mappings with Step 0
- [Property Type Field Mapping](07-Valcre-Integration/PROPERTY-TYPE-FIELD-MAPPING.md) - Property type case study

**Test Scripts:**
- `test-all-property-types.ts` - Comprehensive property type verification
- `test-valcre-property-types.ts` - Pattern discovery script
- `test-valcre-job-by-number.ts` - Job query utility (Step 0 script)
- `update-property-type.ts` - Format testing script

---

**Document Version:** 1.1
**Last Updated:** November 16, 2025
**Methodology Status:** ✅ Proven in Production
**Applies To:** Universal API integration testing

**Major Update (v1.1):**
- ✅ Added Step 0 foundational principle (90% solution)
- ✅ Repositioned comprehensive testing as "Advanced" (10% of cases)
- ✅ Emphasized user responsibility to create complete test records
- ✅ Added Step 0 template script
- ✅ Clear separation: Simple (Step 0) vs Advanced (comprehensive testing)

---

**End of API Testing Methodology Guide**
