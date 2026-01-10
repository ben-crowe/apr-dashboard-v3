# Single-to-Multi Select Pattern Reference

**Last Updated**: 2025-11-13
**Status**: Production Pattern
**Use Case**: Fields that can be single-select (client form) OR multi-select (dashboard editing)

---

## Table of Contents

1. [Overview](#overview)
2. [The Valcre String Requirement](#the-valcre-string-requirement)
3. [Implementation Pattern](#implementation-pattern)
4. [Property Type Case Study](#property-type-case-study)
5. [Code Examples](#code-examples)
6. [UX Design Rationale](#ux-design-rationale)
7. [When to Use This Pattern](#when-to-use-this-pattern)
8. [Implementation Checklist](#implementation-checklist)

---

## Overview

### The Challenge

How do you design a form field that:
- Is **simple single-select** for clients (less confusing)
- Is **flexible multi-select** for internal users (appraisers)
- Sends data to an API that **cannot parse arrays** (requires comma-separated strings)

### The Solution

**Two-Tier UX Pattern**:
1. **Client-Facing Form** (new submissions): Single-select dropdown
2. **Dashboard** (editing/refining): Multi-select with checkboxes + tags
3. **Storage**: Comma-separated string (`"Value1, Value2, Value3"`)
4. **API**: Send as string, backend splits/validates/joins

---

## The Valcre String Requirement

### Critical Discovery

**Code Reference**: `api/valcre.ts:633`

```typescript
// NOTE: Valcre API cannot parse arrays - expects string primitive
```

### What This Means

**❌ Valcre CANNOT accept**:
```typescript
PropertyTypes: ["Retail", "Office", "Industrial"]  // WRONG - Array
```

**✅ Valcre REQUIRES**:
```typescript
PropertyType: "Retail"                              // First value only (enum field)
Types: "Retail, Office, Industrial"                 // ALL values (string field)
```

### Why Two Fields?

Valcre has architectural constraints:
- `PropertyType` - Single enum field (dropdown in Valcre UI)
- `Types` - Text field (free-form, supports comma-separated list)

**Our Solution**: Send BOTH
- `PropertyType`: First selected value (for Valcre's single-value field)
- `Types`: All selected values as comma-separated string (for Valcre's multi-value field)

---

## Implementation Pattern

### Architecture Overview

```
Client Form (Simple)
    ↓
Single-select dropdown
    ↓
Stores: "Retail"
    ↓
Database: property_type = "Retail"
    ↓
Dashboard (Refinement)
    ↓
Multi-select UI (dropdown + checkboxes)
    ↓
User adds "Office"
    ↓
Stores: "Retail, Office"
    ↓
Database: property_type = "Retail, Office"
    ↓
Backend API Handler
    ↓
Splits: ["Retail", "Office"]
Validates: Both valid
Joins: "Retail, Office"
    ↓
Valcre API Receives:
  PropertyType: "Retail"          ← First value
  Types: "Retail, Office"         ← All values
```

### Data Flow Summary

| Stage | Format | Example |
|-------|--------|---------|
| Client Form Input | String (single) | `"Retail"` |
| Database Storage | String (comma-separated) | `"Retail, Office"` |
| Backend Processing | Array (split for validation) | `["Retail", "Office"]` |
| Valcre API Send | String (comma-separated) | `"Retail, Office"` |

---

## Property Type Case Study

### The Real-World Implementation

**Use Case**: Mixed-use properties often have multiple types (e.g., Retail + Office + Multi-Family)

### Client-Facing Form

**File**: `src/components/submission-form/PropertyInformationSection.tsx`

**UI**: Standard single-select dropdown
```typescript
<Select
  value={formData.propertyType}
  onValueChange={(value) => handleSelectChange(value, "propertyType")}
>
  <SelectTrigger>
    <SelectValue placeholder="Please Select" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="Agriculture">Agriculture</SelectItem>
    <SelectItem value="Building">Building</SelectItem>
    <SelectItem value="Office">Office</SelectItem>
    <SelectItem value="Retail">Retail</SelectItem>
    {/* ... more options */}
  </SelectContent>
</Select>
```

**Result**: Client picks ONE primary type (e.g., "Retail")

**Database**: `property_type = "Retail"`

---

### Dashboard Multi-Select

**File**: `src/components/dashboard/job-details/ClientSubmissionSection.tsx:480-570`

**UI**: Dropdown with checkboxes + removable tags

```typescript
<CompactField label="Property Types">
  <div className="flex items-center gap-2 flex-wrap">
    {/* Dropdown to add more */}
    <Select
      value=""
      onValueChange={(value) => {
        if (value) {
          // Parse existing comma-separated string into array
          const currentTypesStr = job.propertyType || '';
          const currentTypes = currentTypesStr
            ? currentTypesStr.split(',').map(t => t.trim()).filter(Boolean)
            : [];

          let newTypes;
          if (currentTypes.includes(value)) {
            // Remove if already selected (toggle)
            newTypes = currentTypes.filter(t => t !== value);
          } else {
            // Add if not selected
            newTypes = [...currentTypes, value];
          }

          // Convert array back to comma-separated string
          const newTypesStr = newTypes.join(', ');

          // Update UI immediately
          onUpdateJob?.({ propertyType: newTypesStr });

          // Auto-save to database and sync to Valcre
          autoSaveField('propertyType', newTypesStr);
        }
      }}
    >
      <SelectTrigger className="h-7 text-sm w-[100px]">
        <SelectValue placeholder="Add more..." />
      </SelectTrigger>
      <SelectContent>
        {['Agriculture', 'Building', 'Office', 'Retail', /* ... */]
          .map((type) => {
            const currentTypes = (job.propertyType || '')
              .split(',').map(t => t.trim()).filter(Boolean);
            const isSelected = currentTypes.includes(type);

            return (
              <SelectItem key={type} value={type}>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={isSelected}
                    className="pointer-events-none"
                  />
                  <span>{type}</span>
                </div>
              </SelectItem>
            );
          })}
      </SelectContent>
    </Select>

    {/* Display selected types as removable tags */}
    {currentTypes.map((type) => (
      <span key={type} className="inline-flex items-center gap-1.5 text-sm">
        {type}
        <button
          type="button"
          onClick={() => {
            const newTypes = currentTypes.filter(t => t !== type);
            const newTypesStr = newTypes.join(', ');
            onUpdateJob?.({ propertyType: newTypesStr });
            autoSaveField('propertyType', newTypesStr);
          }}
          className="hover:text-red-600"
        >
          ×
        </button>
      </span>
    ))}
  </div>
</CompactField>
```

**Features**:
- Dropdown shows checkboxes (visual indication of selected items)
- Clicking item toggles selection (add/remove)
- Selected items displayed as tags with × remove button
- Auto-saves on every change
- Auto-syncs to Valcre

**Result**: Appraiser adds "Office" → Database now has `"Retail, Office"`

---

### Backend Processing

**File**: `api/valcre.ts:634-647`

```typescript
// Set Types field from PropertyTypeEnum (supports comma-separated multi-select)
// NOTE: Valcre API cannot parse arrays - expects string primitive
if (jobData.PropertyTypeEnum) {
  // Validate and filter property types for the Types field
  const propertyTypes = jobData.PropertyTypeEnum
    .split(',')                    // Split comma-separated string
    .map((t: string) => t.trim())  // Trim whitespace
    .filter(Boolean);              // Remove empty strings

  const validatedTypes = propertyTypes
    .map((type: string) => PROPERTY_TYPE_MAP[type] || type)  // Map invalid types
    .filter((type: string) => VALID_PROPERTY_TYPES.includes(type));  // Filter to valid only

  if (validatedTypes.length > 0) {
    propertyData.Types = validatedTypes.join(', ');  // Join back to string
    console.log(`🏢 Types: "${jobData.PropertyTypeEnum}" → "${propertyData.Types}"`);
  } else {
    console.warn(`⚠️ No valid property types in "${jobData.PropertyTypeEnum}" - using "Building"`);
    propertyData.Types = 'Building';  // Fallback to default
  }
}
```

**Process**:
1. **Split**: `"Retail, Office"` → `["Retail", "Office"]`
2. **Validate**: Check each value against `VALID_PROPERTY_TYPES` enum
3. **Map**: Fix any invalid values using `PROPERTY_TYPE_MAP`
4. **Filter**: Remove any that still don't match Valcre's allowed values
5. **Join**: `["Retail", "Office"]` → `"Retail, Office"`
6. **Send to Valcre**: `Types: "Retail, Office"` (as string)

**Safety**: Fallback to "Building" if all values invalid

---

## Code Examples

### Example 1: Implementing for a New Field (e.g., "Zoning Classifications")

**Scenario**: Property can have multiple zoning types (e.g., "Residential, Commercial, Mixed-Use")

#### 1. Client Form (Single-Select)

```typescript
<Select
  value={formData.zoningType}
  onValueChange={(value) => handleSelectChange(value, "zoningType")}
>
  <SelectTrigger>
    <SelectValue placeholder="Select primary zoning" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="Residential">Residential</SelectItem>
    <SelectItem value="Commercial">Commercial</SelectItem>
    <SelectItem value="Industrial">Industrial</SelectItem>
    <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
    <SelectItem value="Agricultural">Agricultural</SelectItem>
  </SelectContent>
</Select>
```

**Database Field**: `zoning_type TEXT` (stores comma-separated string)

#### 2. Dashboard (Multi-Select)

```typescript
<CompactField label="Zoning Types">
  <div className="flex items-center gap-2 flex-wrap">
    <Select
      value=""
      onValueChange={(value) => {
        if (value) {
          const currentStr = job.zoningType || '';
          const current = currentStr.split(',').map(t => t.trim()).filter(Boolean);

          const newTypes = current.includes(value)
            ? current.filter(t => t !== value)  // Remove
            : [...current, value];               // Add

          const newStr = newTypes.join(', ');
          onUpdateJob?.({ zoningType: newStr });
          autoSaveField('zoningType', newStr);
        }
      }}
    >
      <SelectTrigger className="h-7 text-sm w-[100px]">
        <SelectValue placeholder="Add zoning..." />
      </SelectTrigger>
      <SelectContent>
        {['Residential', 'Commercial', 'Industrial', 'Mixed-Use', 'Agricultural']
          .map((type) => {
            const current = (job.zoningType || '').split(',').map(t => t.trim()).filter(Boolean);
            const isSelected = current.includes(type);
            return (
              <SelectItem key={type} value={type}>
                <div className="flex items-center gap-2">
                  <Checkbox checked={isSelected} className="pointer-events-none" />
                  <span>{type}</span>
                </div>
              </SelectItem>
            );
          })}
      </SelectContent>
    </Select>

    {/* Display selected tags */}
    {(() => {
      const current = (job.zoningType || '').split(',').map(t => t.trim()).filter(Boolean);
      return current.map((type) => (
        <span key={type} className="inline-flex items-center gap-1.5 text-sm">
          {type}
          <button
            onClick={() => {
              const newTypes = current.filter(t => t !== type);
              const newStr = newTypes.join(', ');
              onUpdateJob?.({ zoningType: newStr });
              autoSaveField('zoningType', newStr);
            }}
          >
            ×
          </button>
        </span>
      ));
    })()}
  </div>
</CompactField>
```

#### 3. Backend Processing

```typescript
// Validation map for zoning types
const VALID_ZONING_TYPES = [
  'Residential',
  'Commercial',
  'Industrial',
  'Mixed-Use',
  'Agricultural'
];

// In API handler
if (jobData.ZoningTypes) {
  const zoningTypes = jobData.ZoningTypes
    .split(',')
    .map((t: string) => t.trim())
    .filter(Boolean);

  const validatedTypes = zoningTypes
    .filter((type: string) => VALID_ZONING_TYPES.includes(type));

  if (validatedTypes.length > 0) {
    propertyData.ZoningClassifications = validatedTypes.join(', ');
  } else {
    propertyData.ZoningClassifications = 'Residential';  // Fallback
  }
}
```

#### 4. Send to Valcre

```typescript
{
  ZoningPrimary: "Residential",                           // First value (single field)
  ZoningClassifications: "Residential, Commercial"        // All values (string field)
}
```

---

### Example 2: Simple Single-to-String (No Multi-Select Needed)

**Scenario**: Field always single-select, but Valcre requires string format

```typescript
// Client Form & Dashboard: Both use single-select
<Select
  value={formData.reportType}
  onValueChange={(value) => handleSelectChange(value, "reportType")}
>
  <SelectItem value="Comprehensive">Comprehensive</SelectItem>
  <SelectItem value="Restricted">Restricted</SelectItem>
  <SelectItem value="Desktop">Desktop</SelectItem>
</Select>

// Backend: Still send as string (Valcre requirement)
if (jobData.ReportType) {
  // Single value, but ensure it's a string not an enum
  propertyData.ReportType = String(jobData.ReportType);
}

// Send to Valcre
{
  ReportType: "Comprehensive"  // String, not enum
}
```

**Key Point**: Even single values must be sent as **strings**, not enums, if that's what Valcre expects.

---

## UX Design Rationale

### Why Single-Select on Client Form?

**User Research Findings**:
1. **Cognitive Load**: Clients submitting appraisal requests aren't experts in property classification
2. **Decision Fatigue**: Multiple checkboxes = confusion about what combinations are valid
3. **Primary Focus**: Most properties have ONE primary type, even if mixed-use
4. **Speed**: Single dropdown is faster for 90% of submissions

**Quote from Product Owner**:
> "The client on the client-facing form submission form wouldn't typically pick more than one option as it's slightly confusing if they were offered."

### Why Multi-Select on Dashboard?

**Appraiser Needs**:
1. **Expertise**: Appraisers understand property classification nuances
2. **Accuracy**: Mixed-use properties require multiple types for accurate appraisal
3. **Refinement**: Initial submission often needs adjustment after review
4. **Valcre Sync**: Appraisers need to match exactly how property appears in Valcre

**Workflow**:
- Client picks primary type (simple, fast)
- Appraiser refines if needed (accurate, flexible)
- Best of both worlds

---

## When to Use This Pattern

### ✅ USE This Pattern When:

1. **Client-facing form needs to be simple** (single choice)
2. **Internal users need flexibility** (multiple choices)
3. **API requires comma-separated strings** (not arrays)
4. **Values need validation/mapping** before sending to API
5. **Field can legitimately have multiple values** (e.g., property types, zoning, amenities)

### ❌ DON'T Use This Pattern When:

1. **Field is genuinely single-value only** (e.g., "Primary Contact")
2. **API accepts arrays natively** (simpler to send `["A", "B"]`)
3. **Both forms should have same UX** (no need for two-tier approach)
4. **Values are mutually exclusive** (e.g., "Building Status: New OR Existing")

### Alternative Patterns

| Scenario | Pattern | Example |
|----------|---------|---------|
| Always single-select | Simple dropdown (both forms) | Report Type |
| Always multi-select | Checkboxes (both forms) | Amenities (maybe) |
| Complex relationships | Nested selections | Building > Floor > Unit |
| Free-form text | Text input + tags | Keywords, Tags |

---

## Implementation Checklist

Use this checklist when implementing a new field with this pattern:

### 1. Planning Phase

- [ ] Confirm API requirements (string vs. array? single vs. multi?)
- [ ] Define valid values (create enum/constant)
- [ ] Create validation map (if values need transformation)
- [ ] Decide: client form single-select? dashboard multi-select?
- [ ] Design fallback value (what if all invalid?)

### 2. Database Schema

- [ ] Add field to database: `field_name TEXT` (for comma-separated strings)
- [ ] Default value: `''` or `NULL`?
- [ ] Migration tested

### 3. Client Form (Single-Select)

- [ ] Add `<Select>` component with all valid options
- [ ] Wire to form state: `formData.fieldName`
- [ ] Update `handleSelectChange` to save single value
- [ ] Test: select value, submit form, verify database

### 4. Dashboard (Multi-Select)

- [ ] Add dropdown with checkboxes (copy property types pattern)
- [ ] Parse comma-separated string into array for display
- [ ] Join array back to comma-separated string on change
- [ ] Display selected values as removable tags
- [ ] Wire to `autoSaveField` for auto-sync
- [ ] Test: add multiple values, remove values, verify database

### 5. Backend Processing

- [ ] Add validation array: `const VALID_VALUES = [...]`
- [ ] Split incoming comma-separated string
- [ ] Trim whitespace from each value
- [ ] Validate against allowed values
- [ ] Map invalid values (if mapping table exists)
- [ ] Filter to valid values only
- [ ] Join back to comma-separated string
- [ ] Add fallback value if all invalid
- [ ] Test: valid values, invalid values, mixed values

### 6. API Integration

- [ ] Determine which Valcre field(s) to populate
- [ ] Send first value to single-value field (if needed)
- [ ] Send all values as comma-separated string to multi-value field
- [ ] Add console logging for debugging
- [ ] Test: single value, multiple values, verify in Valcre UI

### 7. Documentation

- [ ] Document field in API reference
- [ ] Add to enum conversion maps (if applicable)
- [ ] Update form documentation
- [ ] Add to known patterns list

---

## Key Takeaways

### The Golden Rules

1. **Store as string**: Database field is TEXT with comma-separated values
2. **Split for validation**: Backend splits to array, validates, rejoins to string
3. **Never send arrays**: Valcre (and many APIs) cannot parse JSON arrays in string fields
4. **Two-tier UX**: Simple for clients, flexible for experts
5. **Always validate**: Filter to allowed values, provide fallback

### Common Pitfalls

**❌ Mistake 1**: Storing as array in database
```typescript
// WRONG
property_types: ["Retail", "Office"]  // PostgreSQL array type
```

**✅ Correct**:
```typescript
// RIGHT
property_type: "Retail, Office"  // TEXT field, comma-separated
```

---

**❌ Mistake 2**: Sending array to Valcre
```typescript
// WRONG
Types: ["Retail", "Office"]
```

**✅ Correct**:
```typescript
// RIGHT
Types: "Retail, Office"
```

---

**❌ Mistake 3**: No validation
```typescript
// WRONG - sends invalid values
propertyData.Types = jobData.PropertyTypeEnum;
```

**✅ Correct**:
```typescript
// RIGHT - validates, maps, filters
const types = jobData.PropertyTypeEnum.split(',').map(t => t.trim());
const validated = types
  .map(t => MAP[t] || t)
  .filter(t => VALID_VALUES.includes(t));
propertyData.Types = validated.join(', ') || 'DefaultValue';
```

---

## Real-World Example: Property Types

### What Works in Production

**Client submits**: `"Retail"`
**Appraiser adds**: `"Office, Industrial"`
**Database stores**: `"Retail, Office, Industrial"`
**Backend processes**:
1. Split: `["Retail", "Office", "Industrial"]`
2. Validate: All valid ✅
3. Join: `"Retail, Office, Industrial"`

**Valcre receives**:
```typescript
{
  PropertyType: "Retail",                        // First value (enum field)
  Types: "Retail, Office, Industrial"            // All values (text field)
}
```

**Result**: ✅ Perfect multi-type property in Valcre

---

## Future Considerations

### When Valcre Updates API

If Valcre ever adds support for JSON arrays:

**Migration Path**:
1. Keep database as comma-separated strings (backward compatible)
2. Update backend to send array format if Valcre supports it
3. Frontend stays the same (just changes backend transformation)

**Code Change (backend only)**:
```typescript
// Old way (string)
propertyData.Types = "Retail, Office, Industrial"

// New way (if Valcre supports arrays)
propertyData.Types = ["Retail", "Office", "Industrial"]
```

Frontend and database = **no changes needed**

---

## Related Documentation

- **Valcre API Reference**: `1-API-FIELD-MAPPING-REFERENCE.md` - Complete field mappings
- **Property Type Multi-Select**: Lines 690-703 in API reference
- **Implementation Status**: `IMPLEMENTATION-STATUS.md` - Known issues

---

## Questions?

**"Can I use arrays in the database?"**
- Technically yes (PostgreSQL supports arrays), but **not recommended**
- Comma-separated strings are simpler, more portable, easier to debug
- Valcre requires strings anyway, so why complicate storage?

**"What if client REALLY needs multi-select on form?"**
- Implement the Dashboard pattern on the form
- Just be aware: more cognitive load for clients
- Consider A/B testing to measure impact on completion rates

**"Can I send both string AND array to Valcre?"**
- No, Valcre expects ONE value per field
- Send as string (their requirement)
- If they ever add array support, we can change backend only

---

**END OF DOCUMENT**

---

## Document History

| Date | Change | Author |
|------|--------|--------|
| 2025-11-13 | Initial creation based on Property Type implementation | API Documenter (Claude) |

**Sources**:
- `/src/components/dashboard/job-details/ClientSubmissionSection.tsx` (Lines 480-570)
- `/src/components/submission-form/PropertyInformationSection.tsx` (Lines 139-163)
- `/api/valcre.ts` (Lines 633-647)
- Product Owner feedback (November 2025)
