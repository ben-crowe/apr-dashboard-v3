# AGENT FIX LIST - HomeTabPanel.tsx

## PRIORITY 1: Crosswalk Alignment (Data Flow Breaks Without These)

### File: HomeTabPanel.tsx

```typescript
// FIND AND REPLACE - Subject Property Fields

'property-address'     →  'subject-street'
'property-name'        →  'subject-propertyname'  
'total-units'          →  'subject-units'
```

### File: fieldRegistry.ts

```typescript
// DELETE these duplicate entries:

subject-city      // DELETE - use 'city' instead
subject-province  // DELETE - use 'province' instead
subject-state     // DELETE - use 'province' instead
subject-zip       // DELETE - use 'postal-code' instead
```

---

## PRIORITY 2: Appraiser Field Naming

### File: HomeTabPanel.tsx

```typescript
// FIND AND REPLACE - Remove extra hyphens, fix patterns

'appraiser1-all-units'   →  'appraiser1-allunits'
'appraiser2-all-units'   →  'appraiser2-allunits'
'inspection-date-1'      →  'appraiser1-inspectiondate'
'inspection-date-2'      →  'appraiser2-inspectiondate'
'inspection-extent'      →  'appraiser1-extent'
'inspection-extent-2'    →  'appraiser2-extent'
```

---

## PRIORITY 3: Add Missing Fields to Registry

### File: fieldRegistry.ts - ADD these fields:

```typescript
// Appraiser fields
'appraiser-license-expiry'
'appraiser-role'
'appraiser2-aic'
'appraiser2-credentials'
'appraiser2-email'
'appraiser2-license-expiry'
'appraiser2-phone'
'appraiser2-title'

// Client fields
'client-attention'
'client-salutation'

// Transaction fields
'current-owner'
'owner-address'
'prior-owner'
'last-purchase-price'
'purchase-date'
'ownership-history'
'sales-history'
'parcel-id'

// Conditions fields
'extraordinary-assumption-1'
'extraordinary-assumption-2'
'extraordinary-assumption-3'
'hypothetical-condition-1'
'hypothetical-condition-2'
'hypothetical-condition-3'
'limiting-condition-1'
'limiting-condition-2'
'limiting-condition-3'

// Other
'property-description-prefix'
'sale-lease-config'
'exposure-visibility'
'site-utility'
```

---

## VERIFICATION AFTER FIXES

Run this check:
```bash
# All HomeTabPanel fields should exist in registry
grep -oE "getValue\('[^']+'\)" HomeTabPanel.tsx | \
  sed "s/getValue('//" | sed "s/')//" | sort -u | \
  while read field; do
    grep -q "id: \"$field\"" fieldRegistry.ts || echo "MISSING: $field"
  done
```

Should return no output if all fields exist.

---

## DO NOT CHANGE

These HomeTabPanel fields are CORRECT per crosswalk:
- city
- province
- postal-code
- country
- latitude
- longitude
- legal-description
- property-type
- property-subtype
- condition
- adjacent-north/south/east/west
