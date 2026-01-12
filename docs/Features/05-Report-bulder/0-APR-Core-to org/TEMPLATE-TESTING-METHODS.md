# Template Testing Methods - Complete Guide

**Date:** January 3, 2026  
**Purpose:** Explain the two ways to test the report template and establish field mapping verification format  
**Status:** ✅ Complete

---

## Executive Summary

The APR Dashboard provides **two distinct testing methods** for validating the report template:

1. **Test Report Mode** - Validates calculation engine with real user inputs
2. **Designer Mode** - Visual design validation with sample data toggle

Both methods work together to ensure template correctness and field mapping accuracy.

---

## 🎯 Two Testing Methods Overview

### Method 1: Test Report Mode (Calculation Validation)

**Purpose:** Validate that the calculation engine correctly processes user inputs and generates calculated fields.

**How It Works:**
1. Loads **ONLY** user-input fields from test data
2. **Clears** all calculated fields (forces recalculation)
3. Runs the calculation engine to populate calculated fields
4. Displays the final report with all interpolated values

**Use Case:** Verify that calculations are correct and field mappings work end-to-end.

### Method 2: Designer Mode (Visual Design Validation)

**Purpose:** Validate template layout, styling, and field placement without running calculations.

**How It Works:**
1. Loads **full test data** (user inputs + calculated values)
2. Uses **template toggle** to switch between:
   - **Field ID view** - Shows `{{field-id}}` placeholders
   - **Sample data view** - Shows interpolated values from test data

**Use Case:** Verify template structure, field placement, and visual design.

---

## 🔄 Template Wrapper Toggle (ID ↔ Preview Mode)

### Location
**File:** `public/Report-MF-template.html`  
**Element:** `#preview-toggle` (line 556)  
**Label:** Shows "ID" or "Preview Mode" based on state

### What It Does

The toggle switches between two display modes for **non-financial fields**:

#### OFF (ID Mode)
- Shows **field IDs** as placeholders: `{{field-id}}`
- Example: `{{property-name}}`, `{{client-city}}`
- **Purpose:** Verify field IDs are correctly placed in template

#### ON (Preview Mode)
- Shows **sample data** from `data-sample` attribute
- Example: `North Battleford Apartments`, `Saskatoon`
- **Purpose:** See how the report looks with actual data

### Important Exclusions

**Financial fields are NOT affected by toggle** - They are controlled by the Calculator Demo:
- Fields with prefixes: `calc-`, `ia-dircap-`, `recon-`, `sca-`
- These fields receive values via `postMessage` from Calculator Demo
- Toggle intentionally skips these fields to prevent conflicts

### Code Reference

```8875:8908:public/Report-MF-template.html
        toggle.addEventListener('change', function() {
            const fields = document.querySelectorAll('.field-mapped');
            // Financial fields - controlled by calculator only, not toggle
            const calcPrefixes = ['calc-', 'ia-dircap-', 'recon-', 'sca-'];
            const isCalcField = (el) => {
                const title = el.getAttribute('title') || '';
                return calcPrefixes.some(prefix => title.includes(prefix));
            };

            if (this.checked) {
                pagesWrapper.classList.add('preview-mode');
                // Keep label as 'ID' - toggle state is visible from switch
                // Swap non-financial fields to sample data
                fields.forEach(el => {
                    if (isCalcField(el)) return; // Skip - calculator controls these
                    const sample = el.getAttribute('data-sample');
                    if (sample) {
                        if (!el.dataset.original) {
                            el.dataset.original = el.textContent;
                        }
                        el.textContent = sample;
                    }
                });
            } else {
                pagesWrapper.classList.remove('preview-mode');
                // Swap back to field IDs (skip financial - calculator controls)
                fields.forEach(el => {
                    if (isCalcField(el)) return;
                    if (el.dataset.original) {
                        el.textContent = el.dataset.original;
                    }
                });
            }
        });
```

### Behavior in Different Modes

| Mode | Toggle State | Toggle Enabled? | What Shows |
|------|-------------|-----------------|------------|
| **Test Report** | Always ON | ❌ Disabled | Interpolated values (from calc engine) |
| **Designer** | User control | ✅ Enabled | Toggle between IDs and sample data |
| **None** | Auto-ON | ✅ Enabled | Sample data (for visual preview) |

**Code Reference:**
```174:203:src/features/report-builder/components/PreviewPanel/PreviewPanel.tsx
      const toggle = iframeDoc.getElementById('preview-toggle') as HTMLInputElement;
      const modeLabel = iframeDoc.getElementById('mode-label');
      if (toggle) {
        if (activeTestMode === 'test-report') {
          // Disable toggle in test-report mode
          toggle.disabled = true;
          toggle.checked = true; // Always show interpolated values
          pagesWrapper.classList.add('preview-mode');
          if (modeLabel) modeLabel.textContent = 'Preview Mode (Test Report Active)';
          toggle.style.opacity = '0.5';
          toggle.style.cursor = 'not-allowed';
        } else {
          // Enable toggle in designer mode or no mode
          toggle.disabled = false;
          toggle.style.opacity = '1';
          toggle.style.cursor = 'pointer';
          if (!toggle.checked) {
            // Enable preview mode to show interpolated values
            toggle.checked = true;
            pagesWrapper.classList.add('preview-mode');
            if (modeLabel) modeLabel.textContent = 'Designer Preview';

            // Trigger the toggle change handler to update all fields
            toggle.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('PreviewPanel: Auto-enabled preview mode to show interpolated values');
          } else {
            // Already enabled, but ensure preview-mode class is set
            pagesWrapper.classList.add('preview-mode');
            if (modeLabel) modeLabel.textContent = 'Designer Preview';
          }
        }
      }
```

---

## 🎛️ TDD Page Control Buttons (Upper Panel)

### Location
**File:** `src/features/test-input/TestInputDashboard.tsx`  
**Location:** Top control bar (lines 760-893)

### Button Functions

#### 1. 🔄 Refresh Button
**Icon:** `RefreshCw`  
**Action:** Hard refresh the page (`window.location.reload()`)  
**Purpose:** Clear all state and reload fresh  
**When to Use:** After making code changes or when state seems corrupted

**Code Reference:**
```761:773:src/features/test-input/TestInputDashboard.tsx
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
                className="gap-2 text-white border transition-colors"
                style={{ backgroundColor: '#2a2a2a', borderColor: '#4b5563' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333333'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                title="Hard refresh the page"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </Button>
```

---

#### 2. 🗄️ Test Report Button
**Icon:** `Database`  
**Color:** Blue (`#2563eb`) when active  
**Action:** 
1. Sets `activeTestMode = 'test-report'`
2. Calls `loadUserInputsOnly()` - loads ONLY user-input fields
3. Clears calculated fields
4. Runs `runCalculations()` to populate calculated fields
5. Disables Designer Mode button

**Purpose:** Validate calculation engine correctness  
**When to Use:** After making changes to calculation logic or field mappings

**Behavior:**
- ✅ **Active State:** Blue background, checkmark (✓), disabled toggle in template
- ❌ **Disabled When:** Designer Mode is active
- 🔒 **Locks Toggle:** Template toggle becomes disabled and locked ON

**Code Reference:**
```774:820:src/features/test-input/TestInputDashboard.tsx
              <Button
                onClick={async () => {
                  try {
                    // Set mode FIRST to update button state immediately
                    setTestMode('test-report');
                    console.log('Test Report: Loading user-input fields only...');
                    await loadUserInputsOnly();
                    console.log('Test Report: Calculations complete - check calculated fields');
                  } catch (error) {
                    console.error('Error in Test Report:', error);
                    alert('Error: ' + String(error));
                  }
                }}
                variant={activeTestMode === 'test-report' ? 'default' : 'outline'}
                size="sm"
                disabled={activeTestMode === 'designer'}
                className={`gap-2 text-white border transition-colors ${
                  activeTestMode === 'test-report'
                    ? 'bg-blue-600 hover:bg-blue-500 font-semibold shadow-md'
                    : activeTestMode === 'designer'
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                style={{
                  backgroundColor: activeTestMode === 'test-report' ? '#2563eb' : activeTestMode === 'designer' ? '#1f1f1f' : '#2a2a2a',
                  borderColor: activeTestMode === 'test-report' ? '#2563eb' : activeTestMode === 'designer' ? '#4b5563' : '#4b5563'
                }}
                onMouseEnter={(e) => {
                  if (activeTestMode === 'test-report') {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                  } else if (activeTestMode !== 'designer') {
                    e.currentTarget.style.backgroundColor = '#333333';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTestMode === 'test-report') {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  } else if (activeTestMode !== 'designer') {
                    e.currentTarget.style.backgroundColor = '#2a2a2a';
                  }
                }}
                title="MODE 3: Test Report - Load ONLY user-input fields, clear calculated fields, then run calc engine for validation"
              >
                <Database className="w-3 h-3" />
                Test Report
                {activeTestMode === 'test-report' && <span className="ml-1">✓</span>}
              </Button>
```

---

#### 3. 🎨 Designer Mode Button
**Icon:** `Database`  
**Color:** Purple (`#9333ea`) when active  
**Action:**
1. Sets `activeTestMode = 'designer'`
2. Enables template toggle functionality
3. Disables Test Report button

**Purpose:** Visual design validation with sample data  
**When to Use:** When checking template layout, styling, or field placement

**Behavior:**
- ✅ **Active State:** Purple background, checkmark (✓)
- ❌ **Disabled When:** Test Report Mode is active
- 🔓 **Enables Toggle:** Template toggle becomes interactive

**Code Reference:**
```821:860:src/features/test-input/TestInputDashboard.tsx
              <Button
                onClick={() => {
                  // Set mode to update button state immediately
                  setTestMode('designer');
                  console.log('Designer Mode: Activated - use toggle or Load Full Test Data in Report Builder');
                }}
                variant={activeTestMode === 'designer' ? 'default' : 'outline'}
                size="sm"
                disabled={activeTestMode === 'test-report'}
                className={`gap-2 text-white border transition-colors ${
                  activeTestMode === 'designer'
                    ? 'bg-purple-600 hover:bg-purple-500 font-semibold shadow-md'
                    : activeTestMode === 'test-report'
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                style={{
                  backgroundColor: activeTestMode === 'designer' ? '#9333ea' : activeTestMode === 'test-report' ? '#1f1f1f' : '#2a2a2a',
                  borderColor: activeTestMode === 'designer' ? '#9333ea' : activeTestMode === 'test-report' ? '#4b5563' : '#4b5563'
                }}
                onMouseEnter={(e) => {
                  if (activeTestMode === 'designer') {
                    e.currentTarget.style.backgroundColor = '#a855f7';
                  } else if (activeTestMode !== 'test-report') {
                    e.currentTarget.style.backgroundColor = '#333333';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTestMode === 'designer') {
                    e.currentTarget.style.backgroundColor = '#9333ea';
                  } else if (activeTestMode !== 'test-report') {
                    e.currentTarget.style.backgroundColor = '#2a2a2a';
                  }
                }}
                title="Designer Mode - Use toggle for sample data or Load Full Test Data button in Report Builder"
              >
                <Database className="w-3 h-3" />
                Designer Mode
                {activeTestMode === 'designer' && <span className="ml-1">✓</span>}
              </Button>
```

---

#### 4. 🔗 Preview in Builder Button
**Icon:** `ExternalLink`  
**Color:** Green (`#22c55e`) when a test mode is active  
**Action:** Navigates to `/mock-builder` route with current store data  
**Purpose:** Open Report Builder to see template with current data  
**When to Use:** After loading test data, to preview in split-screen layout

**Behavior:**
- Shows green background when test mode is active
- Shows arrow (→) indicator when test mode is active
- Preserves all store data when navigating

**Code Reference:**
```861:892:src/features/test-input/TestInputDashboard.tsx
              <Button
                onClick={handlePreview}
                variant="outline"
                size="sm"
                className={`gap-2 text-white border transition-colors ${
                  activeTestMode !== 'none'
                    ? 'bg-green-500 hover:bg-green-400 font-semibold shadow-md'
                    : ''
                }`}
                style={{
                  backgroundColor: activeTestMode !== 'none' ? '#22c55e' : '#2a2a2a',
                  borderColor: activeTestMode !== 'none' ? '#22c55e' : '#4b5563'
                }}
                onMouseEnter={(e) => {
                  if (activeTestMode !== 'none') {
                    e.currentTarget.style.backgroundColor = '#4ade80';
                  } else {
                    e.currentTarget.style.backgroundColor = '#333333';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTestMode !== 'none') {
                    e.currentTarget.style.backgroundColor = '#22c55e';
                  } else {
                    e.currentTarget.style.backgroundColor = '#2a2a2a';
                  }
                }}
              >
                <ExternalLink className="w-3 h-3" />
                Preview in Builder
                {activeTestMode !== 'none' && <span className="ml-1">→</span>}
              </Button>
```

---

## 📊 Field Mapping Status Report Card Format

### Purpose
Standardized format for reporting field mapping verification status when confirming field mappings.

### Report Card Structure

```markdown
# Field Mapping Status Report Card

**Date:** [YYYY-MM-DD]
**Reviewer:** [Name/Role]
**Scope:** [Section/Page/Field Range]

---

## Summary

| Metric | Count | Status |
|--------|-------|--------|
| **Total Fields** | X | — |
| **Mapped Fields** | X | ✅ |
| **Unmapped Fields** | X | ⚠️ |
| **Verified Valcre IDs** | X | ✅ |
| **Unverified Valcre IDs** | X | ⚠️ |
| **Coverage** | X% | [Grade] |

**Overall Grade:** [A/B/C/D/F]

---

## Field Status Breakdown

### ✅ Mapped & Verified (X fields)
- `field-id-1` → `Valcre_ID_1` ✅ Verified
- `field-id-2` → `Valcre_ID_2` ✅ Verified
- ...

### ⚠️ Mapped but Unverified (X fields)
- `field-id-3` → `Valcre_ID_3` ⚠️ Needs verification
- `field-id-4` → `Valcre_ID_4` ⚠️ Needs verification
- ...

### ❌ Unmapped (X fields)
- `field-id-5` → ❌ No Valcre ID
- `field-id-6` → ❌ No Valcre ID
- ...

### 🔍 Needs Investigation (X fields)
- `field-id-7` → ⚠️ Valcre ID doesn't exist in ground truth
- `field-id-8` → ⚠️ Multiple possible Valcre IDs
- ...

---

## Testing Results

### Test Report Mode
- ✅ All user-input fields load correctly
- ✅ Calculation engine runs without errors
- ✅ Calculated fields populate correctly
- ⚠️ [Any issues found]

### Designer Mode
- ✅ Template toggle works correctly
- ✅ Field IDs display correctly in ID mode
- ✅ Sample data displays correctly in Preview mode
- ⚠️ [Any issues found]

---

## Recommendations

1. [Action item 1]
2. [Action item 2]
3. [Action item 3]

---

## Next Steps

- [ ] Verify unverified Valcre IDs against ground truth
- [ ] Map unmapped fields
- [ ] Fix any issues found in testing
- [ ] Re-run tests after fixes
```

### Grade Scale

| Coverage | Grade | Meaning |
|----------|-------|---------|
| 95-100% | **A** | Excellent - All critical fields mapped and verified |
| 85-94% | **B** | Good - Most fields mapped, minor gaps |
| 75-84% | **C** | Acceptable - Significant gaps but core fields mapped |
| 65-74% | **D** | Needs Work - Many fields unmapped |
| <65% | **F** | Critical - Major mapping gaps |

### Status Icons

- ✅ **Mapped & Verified** - Field has Valcre ID verified against ground truth
- ⚠️ **Mapped but Unverified** - Field has Valcre ID but not verified
- ❌ **Unmapped** - Field has no Valcre ID
- 🔍 **Needs Investigation** - Valcre ID may be incorrect or ambiguous

---

## Workflow: Using Both Testing Methods

### Step 1: Load Test Data
1. Navigate to TDD page (`/test-input`)
2. Click **"Test Report"** button (loads user inputs only)
3. OR click **"Designer Mode"** button (loads full test data)

### Step 2: Verify Field Mappings

#### In Test Report Mode:
1. Check that calculated fields populate correctly
2. Verify values match expected calculations
3. Check console for any calculation errors

#### In Designer Mode:
1. Toggle template toggle **OFF** → Verify field IDs are correct
2. Toggle template toggle **ON** → Verify sample data displays correctly
3. Check that financial fields are excluded from toggle (controlled by calculator)

### Step 3: Generate Report Card
1. Count mapped vs unmapped fields
2. Verify Valcre IDs against ground truth JSON
3. Document any issues found
4. Generate report card using format above

### Step 4: Fix Issues
1. Fix any incorrect field IDs in template
2. Add missing Valcre mappings
3. Verify mappings against ground truth
4. Re-run tests

---

## Quick Reference

### Testing Method Comparison

| Aspect | Test Report Mode | Designer Mode |
|--------|-----------------|---------------|
| **Data Loaded** | User inputs only | Full test data |
| **Calculations** | ✅ Runs calc engine | ❌ Uses pre-calculated values |
| **Toggle State** | 🔒 Locked ON | 🔓 User control |
| **Purpose** | Validate calculations | Validate design |
| **Best For** | Field mapping verification | Template layout verification |

### Button States

| Button | Normal | Active | Disabled |
|--------|--------|--------|----------|
| **Test Report** | Gray outline | Blue solid | When Designer active |
| **Designer Mode** | Gray outline | Purple solid | When Test Report active |
| **Preview in Builder** | Gray outline | Green solid | Always enabled |

---

*Document created: January 3, 2026*  
*Last updated: January 3, 2026*

