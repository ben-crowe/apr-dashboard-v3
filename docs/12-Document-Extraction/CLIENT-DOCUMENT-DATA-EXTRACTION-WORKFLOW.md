# Client Document Data Extraction Workflow

## The Critical Realization
Section 3A/3B data comes from THREE sources:
1. **Client-uploaded documents** (property tax, leases, financials)
2. **Houski API** (14 fields we can get)
3. **Manual entry** (remaining fields)

## Client Documents Containing Data

### Documents Client Uploads (Section 1/2):
1. **Property Tax Assessment**
   - Contains: Assessed value, lot size, building area, year built
   - Maps to: Section 3A & 3B fields

2. **Lease Agreements** 
   - Contains: Rental rates, tenant names, lease terms, unit sizes
   - Maps to: Section 3A (income data)

3. **Financial Statements**
   - Contains: Operating expenses, income, NOI, maintenance costs
   - Maps to: Financial fields in 3A

4. **Previous Appraisal Reports**
   - Contains: Historical values, comparables, property details
   - Maps to: Multiple sections

5. **Building Condition Report**
   - Contains: Roof age, HVAC details, structural condition
   - Maps to: Section 3A building fields

6. **Environmental Reports**
   - Contains: Environmental issues, remediation status
   - Maps to: Section 3B land fields

## The Data Flow Problem

### Current Challenge:
```
Client uploads PDF → ??? → Data in Section 3A/3B fields → Send to Valcre
```

### Solution Options:

#### Option 1: Manual Extraction (Current Chris workflow)
```
Client uploads → Chris manually reads → Types into fields → Send to Valcre
```
- Pros: No tech needed, Chris already does this
- Cons: Time-consuming, error-prone

#### Option 2: Semi-Automated with Preview
```
Client uploads → Display PDF → Pre-populated extraction form → Chris verifies → Send to Valcre
```
- Pros: Faster, Chris can verify
- Cons: Still requires manual review

#### Option 3: AI/OCR Extraction (Future)
```
Client uploads → AI/OCR extracts → Pre-populates fields → Chris verifies → Send to Valcre
```
- Pros: Very fast, reduces manual work
- Cons: Needs AI/OCR setup, may have errors

## Immediate Solution for Testing Page

### Document Management UI:
```javascript
// Section 3A should show:
const Section3A = () => {
  return (
    <div>
      <h3>Building Data (Section 3A)</h3>
      
      {/* Source indicators */}
      <div className="data-sources">
        <span>📄 From Property Tax Doc</span>
        <span>🌐 From Houski API</span>
        <span>✏️ Manual Entry</span>
      </div>

      {/* Fields with source badges */}
      <div className="field">
        <label>Year Built</label>
        <input value={yearBuilt} />
        <span className="source">📄 Property Tax</span>
      </div>

      <div className="field">
        <label>Square Footage</label>
        <input value={sqft} />
        <span className="source">🌐 Houski</span>
      </div>

      {/* Document viewer sidebar */}
      <div className="document-sidebar">
        <h4>Client Documents</h4>
        <button>View Property Tax PDF</button>
        <button>View Lease Agreement</button>
        {/* Opens PDF in modal/sidebar for reference */}
      </div>
    </div>
  );
};
```

## Data Mapping Matrix

| Field | Source Priority | Document Location |
|-------|----------------|-------------------|
| Year Built | 1. Property Tax PDF 2. Houski | Page 1, Assessment Details |
| Building Area | 1. Property Tax PDF 2. Houski | Page 1, Building Stats |
| Lot Size | 1. Property Tax PDF 2. Houski | Page 1, Land Details |
| Assessed Value | 1. Property Tax PDF | Page 1, Top section |
| Rental Income | 1. Lease PDFs | Various pages |
| Operating Expenses | 1. Financial Statements | P&L section |
| Zoning | 1. Houski 2. Property Tax | Page 2, Legal Description |

## Implementation Steps

### Phase 1 (Manual - NOW):
1. Display uploaded PDFs in sidebar/modal
2. Chris manually extracts data while viewing PDFs
3. Fields show source indicator (PDF/API/Manual)
4. "Send to Valcre" when complete

### Phase 2 (Semi-Auto - LATER):
1. Add OCR/extraction capability
2. Pre-populate fields from PDFs
3. Chris verifies/corrects
4. Track confidence scores

### Phase 3 (AI-Powered - FUTURE):
1. AI extracts and understands context
2. Handles various PDF formats
3. Learning from corrections
4. Near-complete automation

## Key Insight
**Section 3A is NOT just "Organizing Client Data" - it's EXTRACTING data from client documents!**

The name was misleading us. It's really:
- Parse client documents
- Extract relevant data points
- Combine with Houski API data
- Manual entry for gaps
- Send complete dataset to Valcre