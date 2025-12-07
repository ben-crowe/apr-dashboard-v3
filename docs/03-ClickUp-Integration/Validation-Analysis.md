# Test Script Output Reference

**Script**: `create-test-task-v2.js`
**Environment**: Development (Ben's Test ClickUp)
**Date**: November 4, 2025

---

## Script Input Data

```javascript
const testJobData = {
  jobId: '550e8400-e29b-41d4-a716-446655440000',
  clientFirstName: 'John',
  clientLastName: 'Smith',
  clientOrganization: 'ABC Corporation',
  clientEmail: 'john.smith@abccorp.com',
  clientPhone: '(403) 555-1234',
  propertyName: 'Sparwood McDonalds',
  propertyAddress: '2100 Middletown Place, Sparwood, BC T1K 2L3',
  propertyType: 'Commercial - Retail',
  intendedUse: 'Purchase Transaction',
  assetCondition: 'Good',
  valuationPremise: 'Market Value - As Is',
  notes: 'Client needs appraisal for financing purposes...'
};
```

---

## ClickUp Task Output

### Task Name
```
NEW SUBMISSION - Sparwood McDonalds, 2100 Middletown Place, Sparwood, BC T1K 2L3
```

### Task Description (Markdown)
```markdown
📍 NEW JOB ARRIVED - [View in APR Hub](https://apr-hub-05-25.vercel.app/#/dashboard?jobId=550e8400-e29b-41d4-a716-446655440000)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLIENT INFORMATION
Name: John Smith
Organization: ABC Corporation
Email: john.smith@abccorp.com
Phone: (403) 555-1234

PROPERTY INFORMATION
Property Name: Sparwood McDonalds
Address: 2100 Middletown Place, Sparwood, BC T1K 2L3
Property Type: Commercial - Retail
Intended Use: Purchase Transaction
Asset Condition: Good
Valuation Premise: Market Value - As Is

SUBMISSION NOTES
Client needs appraisal for financing purposes. Property includes drive-through and parking for 25 vehicles. Building is approximately 3,200 SF with recent renovations completed in 2023.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏳ Waiting for LOE Quote Preparation...
```

### Task Properties
- **Status**: To Do
- **Priority**: Normal (3)
- **List**: Ben's Test List (901703694310)
- **Workspace**: BC Workspace (8555561)

### Custom Fields (When Enabled)
- **Dashboard Job URL**: `https://apr-hub-05-25.vercel.app/#/dashboard?jobId=550e8400...` (Clickable button)

---

## Field Mapping

| Script Variable | ClickUp Location | Format |
|-----------------|------------------|--------|
| `propertyName` | Task Name | "NEW SUBMISSION - {propertyName}, {propertyAddress}" |
| `propertyAddress` | Task Name | Part of task name |
| `clientFirstName` | Description → CLIENT INFORMATION → Name | "John Smith" |
| `clientLastName` | Description → CLIENT INFORMATION → Name | Combined with first name |
| `clientOrganization` | Description → CLIENT INFORMATION → Organization | Plain text |
| `clientEmail` | Description → CLIENT INFORMATION → Email | Plain text |
| `clientPhone` | Description → CLIENT INFORMATION → Phone | Plain text |
| `propertyName` | Description → PROPERTY INFORMATION → Property Name | Plain text |
| `propertyAddress` | Description → PROPERTY INFORMATION → Address | Plain text |
| `propertyType` | Description → PROPERTY INFORMATION → Property Type | Plain text |
| `intendedUse` | Description → PROPERTY INFORMATION → Intended Use | Plain text |
| `assetCondition` | Description → PROPERTY INFORMATION → Asset Condition | Plain text |
| `valuationPremise` | Description → PROPERTY INFORMATION → Valuation Premise | Plain text |
| `notes` | Description → SUBMISSION NOTES | Plain text |
| `jobId` | Dashboard URL (in description + custom field) | UUID in URL parameter |

---

## How to Run

### Step 1: Navigate to Script
```bash
cd /Users/bencrowe/Development/00-Project-Planning/APR-Dashboard/planning/3-section-ClickUp-Integration/03-Testing/test-scripts
```

### Step 2: Run Script
```bash
node create-test-task-v2.js
```

### Step 3: View Output
Console will show:
```
================================================
   ClickUp Test - Development Environment
================================================

🧪 Creating test task in Ben's test environment...

📤 Creating task in test list...

✅ Task created successfully!
Task ID: abc123xyz
Task Name: NEW SUBMISSION - Sparwood McDonalds, 2100 Middletown Place, Sparwood, BC T1K 2L3
URL: https://app.clickup.com/t/abc123xyz

📋 Check Ben's test list: https://app.clickup.com/8555561/v/li/901703694310
```

### Step 4: Verify in ClickUp
Open: https://app.clickup.com/8555561/v/li/901703694310

Check:
- Task name matches format
- Description has all sections
- Formatting is correct
- Click "View in APR Hub" link (will 404 for test UUID, that's expected)

---

## Testing Workflow

### 1. Edit Test Data
Modify lines 13-25 in `create-test-task-v2.js` with different values

### 2. Run Script
```bash
node create-test-task-v2.js
```

### 3. Check ClickUp
Task appears in Ben's test list immediately

### 4. Verify Format
Compare output to Stage 1 format in `03-TASK-FORMAT-VISUAL.md`

### 5. Iterate
- Adjust data
- Run again
- Delete old test tasks
- Repeat until perfect

### 6. Match Form
Once format is perfect, build form to send same structure

---

## Correct Configuration

**Environment**: Development (Ben's ClickUp)
**API Key**: `pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU`
**Test List**: `901703694310`
**Workspace**: BC Workspace (8555561)

**Safe to test**: ✅ Yes - creates in Ben's test environment only

---

## Data Format: Formatted Text

**Method**: All data goes into description as formatted markdown text

**Structure**:
1. Header with Dashboard link
2. CLIENT INFORMATION section
3. PROPERTY INFORMATION section
4. SUBMISSION NOTES section
5. Footer (waiting message)

**Custom Fields**: Only 1 - Dashboard Job URL (for clickable button)

**Everything else**: Formatted text in description

---

**This is the correct script and output format matching Stage 1 specification.**
