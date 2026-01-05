# TDD Page Stats Panel & Actions - Complete Explanation

**Location:** `/test-input` (TestInputDashboard.tsx)  
**Last Updated:** 2026-01-04

---

## 📊 Stats Panel (Top Bar)

The stats panel displays real-time field status counts for **user-input fields only** (excludes calculated fields).

### How Stats Are Calculated

**Source:** `TestInputDashboard.tsx` lines 267-305

The stats are computed by:

1. **Iterating through `fieldRegistry`** (all 1,687 fields)
2. **Filtering to only count:**
   - Fields from visible sections (excludes hidden sections like `maps`, `photos`, `cost-s`, `sales`, `income`, `calc-output`)
   - Fields with `inputSource === 'user-input'` (excludes `calculated`, `api-fetch`, `template`, `auto-filled`)
   - Fields that exist in the store (have been initialized)
   - Fields matching the selected dataset filter (if "Report DataSet1" is active)

3. **Checking each field's status** by looking up its value in the store:
   - **Mapped** (Green): Field has a non-empty value
     - Non-empty strings (even "0" counts as mapped)
     - Non-empty arrays
     - Numbers (including 0)
   - **Empty** (Yellow): Field exists but is empty
     - Empty strings (`""`)
     - Empty arrays (`[]`)
   - **Missing** (Red): Field doesn't exist in store or is `undefined`/`null`

4. **Calculating percentage:** `(mapped / total) * 100`

### Stats Display

```
Total: [number]        → Total user-input fields being tracked
Mapped: [green badge]  → Fields with values
Empty: [yellow badge]  → Fields that are empty strings/arrays
Missing: [red badge]   → Fields that are undefined/null
Coverage: [percentage] → Percentage of fields that are mapped
```

**Example:** If you see `Total: 575`, `Mapped: 450`, `Empty: 100`, `Missing: 25`, `Coverage: 78%`:
- 575 user-input fields are being tracked
- 450 have values (mapped)
- 100 are empty strings/arrays
- 25 don't exist in the store
- 78% coverage means 78% of fields have values

---

## 🔘 Action Buttons (Top Bar)

There are **three action buttons** in the top bar:

### 1. **Refresh** Button

**Icon:** 🔄 (RefreshCw)  
**Function:** Hard page reload  
**Code:** `window.location.reload()`  
**When to use:** When you want to reset the entire page state

**What it does:**
- Reloads the entire page from scratch
- Clears all state
- Re-initializes the store
- Re-loads test data (via `useEffect` on mount)

---

### 2. **TDD Load All Fields** Button

**Icon:** 🗄️ (Database)  
**Label:** "TDD Load All Fields"  
**Active State:** Blue background when `activeTestMode === 'test-report'`  
**Disabled:** When `activeTestMode === 'designer'`

**What it does:**

1. **Sets test mode:** `setTestMode('test-report')`
   - This marks the mode as "Test Report Mode"
   - Disables the "Designer Mode" button

2. **Loads ALL fields from TestDataSet1:** `loadDataSet1All()`
   - Iterates through **every field** in `testDataSet1`
   - Updates the store with all values (both user-input AND calculated fields)
   - Runs calculations (`runCalculations()`)
   - Marks all sections as loaded

**Purpose:**
- **For TDD page review:** Shows ALL fields populated so you can see which fields have test data
- **Not for report generation:** This loads calculated fields too, which isn't realistic for actual report generation

**When to use:**
- When you want to see the full test dataset loaded into the TDD page
- When you want to verify which fields have test data vs. which are empty
- When you want to review field coverage

**Code Reference:** `reportBuilderStore.ts` lines 7088-7134

---

### 3. **Report DataSet1** Button

**Icon:** 🗄️ (Database)  
**Label:** "Report DataSet1"  
**Active State:** Green background when `selectedDataset === 'testDataSet1'`  
**Filter Effect:** When active, TDD page only shows fields that exist in `testDataSet1`

**What it does:**

1. **Loads ONLY user-input fields:** `loadDataSet1User()`
   - Clears all calculated fields (sets them to empty strings)
   - Loads ONLY fields from `testDataSet1` where `inputSource === 'user-input'`
   - Runs calculation engine (`runCalculations()`) to populate calculated fields from scratch
   - Regenerates preview HTML

2. **Sets dataset filter:** `setSelectedDataset('testDataSet1')`
   - Filters the TDD page to only show fields that exist in `testDataSet1`
   - Hides fields that aren't in the test dataset

**Purpose:**
- **For report generation:** Simulates real-world usage where only user inputs are provided
- **For calculation testing:** Tests that the calculation engine correctly computes all calculated fields
- **For template testing:** Ensures the report template fills correctly with calculated values

**When to use:**
- When you want to test the calculation engine
- When you want to see the report as it would appear with real user inputs
- When you want to verify calculated fields are computed correctly

**Code Reference:** `reportBuilderStore.ts` lines 7136-7281

---

### 4. **View Report** Button

**Icon:** 🔗 (ExternalLink)  
**Label:** "View Report"  
**Disabled:** When `selectedDataset === null` (no dataset selected)  
**Active State:** Green background when dataset is selected

**What it does:**

1. **Navigates to mock-builder:** `navigate('/mock-builder')`
   - Takes you to the Report Builder page
   - The Report Builder will use whatever data is currently in the store

**Purpose:**
- **Workflow completion:** After loading test data, view the report in the builder
- **Visual verification:** See how the data looks in the actual report template

**When to use:**
- After clicking "Report DataSet1" to see the report with calculated fields
- After manually editing fields in the TDD page to see changes in the builder

**Code Reference:** `TestInputDashboard.tsx` lines 882-910

---

## 🔄 Typical Workflow

### Workflow 1: Review All Test Data

1. Click **"TDD Load All Fields"**
   - Loads all fields from TestDataSet1
   - Stats show total coverage
   - You can see which fields have test data

2. Review stats and fields
   - Check "Mapped" count
   - Review "Empty" and "Missing" fields
   - Verify field coverage percentage

3. Click **"View Report"** (optional)
   - See how all test data looks in the report

---

### Workflow 2: Test Calculation Engine

1. Click **"Report DataSet1"**
   - Loads only user-input fields
   - Clears calculated fields
   - Runs calculation engine
   - Stats show user-input coverage

2. Review calculated fields
   - Check that calculated fields were computed
   - Verify calculation accuracy

3. Click **"View Report"**
   - See the report with calculated values
   - Verify template fills correctly

---

## 🎯 Key Differences

| Feature | TDD Load All Fields | Report DataSet1 |
|---------|---------------------|----------------|
| **What it loads** | ALL fields (user-input + calculated) | ONLY user-input fields |
| **Calculated fields** | Loads from test data | Clears, then runs calc engine |
| **Test mode** | Sets to `'test-report'` | No mode change |
| **Dataset filter** | No filter | Filters to TestDataSet1 fields |
| **Purpose** | Review test data coverage | Test calculation engine |
| **Use case** | Field audit, coverage review | Report generation testing |

---

## 📝 Notes

- **Stats update automatically:** The stats recalculate whenever the store changes (via `useMemo` dependency on `sections` and `datasetFieldIds`)
- **Stats are filtered:** If "Report DataSet1" is active, stats only count fields in that dataset
- **Hidden sections excluded:** Stats don't count fields from hidden sections (maps, photos, cost-s, sales, income, calc-output)
- **Only user-input fields:** Stats never count calculated fields, even if they have values
- **Mode exclusivity:** "TDD Load All Fields" and "Designer Mode" are mutually exclusive (can't have both active)

---

## 🔍 Code Locations

- **Stats calculation:** `TestInputDashboard.tsx` lines 267-305
- **Field status logic:** `TestInputDashboard.tsx` lines 227-248
- **TDD Load All Fields:** `reportBuilderStore.ts` lines 7088-7134
- **Report DataSet1:** `reportBuilderStore.ts` lines 7136-7281
- **Button UI:** `TestInputDashboard.tsx` lines 778-910

