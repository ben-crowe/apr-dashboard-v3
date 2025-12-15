#!/usr/bin/env python3
"""
Classify Field Registry fields as Input vs Calculated
Cross-references fieldRegistry.ts with MASTER-FIELD-DIRECTORY.md
"""

import re
from pathlib import Path
from collections import defaultdict

def parse_field_registry(file_path):
    """Extract all fields from fieldRegistry.ts with their inputSource"""
    content = Path(file_path).read_text()

    fields = []
    # Pattern to match field definitions
    # { id: 'field-name', storeId: '...', label: '...', ... inputSource: 'user-input' ... }
    pattern = r"\{\s*id:\s*'([^']+)'.*?inputSource:\s*'([^']+)'.*?\}"

    for match in re.finditer(pattern, content, re.DOTALL):
        field_id = match.group(1)
        input_source = match.group(2)
        fields.append({
            'id': field_id,
            'inputSource': input_source
        })

    return fields

def parse_valcre_directory(file_path):
    """Extract all fields from MASTER-FIELD-DIRECTORY.md with I/C markers"""
    content = Path(file_path).read_text()

    fields = {}
    # Pattern to match field rows in markdown tables
    # | `IA_DirCap_PGI` | currency | 🔢 | $A$1 |
    pattern = r'\|\s*`([^`]+)`\s*\|[^|]*\|[^|]*([📝🔢])[^|]*\|'

    for match in re.finditer(pattern, content):
        field_name = match.group(1)
        marker = match.group(2)
        fields[field_name] = {
            'name': field_name,
            'type': '📝 Input' if marker == '📝' else '🔢 Calculated'
        }

    return fields

def fuzzy_match_field(registry_field, valcre_fields):
    """
    Attempt to match a registry field to a Valcre field
    Handles naming convention differences:
    - Registry: kebab-case (e.g., 'client-company')
    - Valcre: PascalCase_Underscore (e.g., 'Client_Company')
    """

    # Direct conversion attempts
    conversions = [
        # As-is
        registry_field,
        # Convert to PascalCase_Underscore
        '_'.join(word.capitalize() for word in registry_field.split('-')),
        # Convert to UpperCase_Underscore
        registry_field.upper().replace('-', '_'),
        # Try with IA_ prefix (Income Analysis fields)
        'IA_' + '_'.join(word.capitalize() for word in registry_field.split('-')),
        # Try without calc- prefix
        registry_field.replace('calc-', ''),
        '_'.join(word.capitalize() for word in registry_field.replace('calc-', '').split('-')),
    ]

    for conversion in conversions:
        if conversion in valcre_fields:
            return valcre_fields[conversion]

    # Fuzzy partial matching
    registry_clean = registry_field.lower().replace('-', '').replace('_', '')
    for valcre_field_name, valcre_field_data in valcre_fields.items():
        valcre_clean = valcre_field_name.lower().replace('-', '').replace('_', '')
        if registry_clean in valcre_clean or valcre_clean in registry_clean:
            # Partial match confidence check
            if len(registry_clean) > 5 and abs(len(registry_clean) - len(valcre_clean)) < 5:
                return {**valcre_field_data, 'confidence': 'partial'}

    return None

def main():
    # File paths
    registry_file = Path("/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/schema/fieldRegistry.ts")
    valcre_file = Path("/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/2-Field Mgt-12.14.25/MASTER-FIELD-DIRECTORY.md")
    output_file = Path("/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/FIELD-INPUT-OUTPUT-CLASSIFICATION.md")

    print("🔍 Parsing field registry...")
    registry_fields = parse_field_registry(registry_file)
    print(f"   Found {len(registry_fields)} fields in fieldRegistry.ts")

    print("\n🔍 Parsing Valcre directory...")
    valcre_fields = parse_valcre_directory(valcre_file)
    print(f"   Found {len(valcre_fields)} fields in MASTER-FIELD-DIRECTORY.md")

    print("\n🔗 Matching fields...")

    # Classification buckets
    user_inputs = []
    calculated_outputs = []
    registry_calculated = []
    registry_api_fetch = []
    registry_auto_filled = []
    unmapped_fields = []

    for field in registry_fields:
        field_id = field['id']
        input_source = field['inputSource']

        # Check Valcre mapping
        valcre_match = fuzzy_match_field(field_id, valcre_fields)

        classification = {
            'id': field_id,
            'inputSource': input_source,
            'valcreMatch': valcre_match['name'] if valcre_match else None,
            'valcreType': valcre_match['type'] if valcre_match else None,
            'confidence': valcre_match.get('confidence', 'direct') if valcre_match else None
        }

        # Classify based on both registry inputSource and Valcre type
        if input_source == 'user-input':
            # Verify with Valcre if possible
            if valcre_match and '🔢 Calculated' in valcre_match['type']:
                # Conflict: Registry says user-input, Valcre says calculated
                classification['note'] = '⚠️ CONFLICT: Registry=user-input, Valcre=calculated'
            user_inputs.append(classification)

        elif input_source == 'calculated':
            registry_calculated.append(classification)

        elif input_source == 'api-fetch':
            registry_api_fetch.append(classification)

        elif input_source == 'auto-filled':
            registry_auto_filled.append(classification)

        # Check if Valcre identifies as calculated
        if valcre_match and '🔢 Calculated' in valcre_match['type']:
            calculated_outputs.append(classification)

        # Track unmapped
        if not valcre_match:
            unmapped_fields.append(classification)

    print(f"\n📊 Classification Results:")
    print(f"   📝 User Inputs (registry): {len(user_inputs)}")
    print(f"   🔢 Calculated (registry): {len(registry_calculated)}")
    print(f"   🌐 API Fetch (registry): {len(registry_api_fetch)}")
    print(f"   🤖 Auto-filled (registry): {len(registry_auto_filled)}")
    print(f"   🔢 Calculator Outputs (Valcre): {len(calculated_outputs)}")
    print(f"   ❓ Unmapped to Valcre: {len(unmapped_fields)}")

    # Generate report
    print(f"\n📝 Writing classification report...")

    report = f"""# Field Input/Output Classification Report

**Generated:** {Path(__file__).name}
**Purpose:** Classify all fieldRegistry.ts fields as user inputs vs calculator outputs

---

## Summary Statistics

| Category | Count | Description |
|----------|-------|-------------|
| **Total Fields** | {len(registry_fields)} | All fields in fieldRegistry.ts |
| **📝 User Inputs** | {len(user_inputs)} | Fields with inputSource='user-input' |
| **🔢 Registry Calculated** | {len(registry_calculated)} | Fields with inputSource='calculated' |
| **🌐 API Fetch** | {len(registry_api_fetch)} | Fields with inputSource='api-fetch' |
| **🤖 Auto-filled** | {len(registry_auto_filled)} | Fields with inputSource='auto-filled' |
| **🔢 Valcre Calculated** | {len(calculated_outputs)} | Fields marked 🔢 in Valcre workbook |
| **❓ Unmapped** | {len(unmapped_fields)} | Fields not found in Valcre directory |

---

## Data Flow Architecture

```
USER INPUTS (TDD Dashboard - Manual Entry)
    ↓
CALCULATOR ENGINE (External Valcre Code)
    ↓
CALCULATED OUTPUT FIELDS (~{len(calculated_outputs)} fields)
    ↓
REPORT TABLES (Expenses, Surveys, Comps)
```

---

## User Input Fields ({len(user_inputs)})

These fields are manually entered by users in the TDD Dashboard.

| Field ID | Valcre Match | Valcre Type | Confidence | Notes |
|----------|--------------|-------------|------------|-------|
"""

    for field in sorted(user_inputs, key=lambda x: x['id']):
        valcre = field.get('valcreMatch', '')
        valcre_type = field.get('valcreType', '❓ Unknown')
        confidence = field.get('confidence', '-')
        note = field.get('note', '')
        report += f"| `{field['id']}` | `{valcre}` | {valcre_type} | {confidence} | {note} |\n"

    report += f"""

---

## Calculated Fields (Registry) ({len(registry_calculated)})

These fields are marked as calculated in fieldRegistry.ts.

| Field ID | Valcre Match | Valcre Type | Confidence |
|----------|--------------|-------------|------------|
"""

    for field in sorted(registry_calculated, key=lambda x: x['id']):
        valcre = field.get('valcreMatch', '')
        valcre_type = field.get('valcreType', '❓ Unknown')
        confidence = field.get('confidence', '-')
        report += f"| `{field['id']}` | `{valcre}` | {valcre_type} | {confidence} |\n"

    report += f"""

---

## Calculator Output Fields (Valcre) ({len(calculated_outputs)})

These fields are marked 🔢 Calculated in the Valcre workbook.
They are auto-generated by the external calculator engine.

| Field ID | Valcre Field Name | Registry Input Source |
|----------|-------------------|----------------------|
"""

    for field in sorted(calculated_outputs, key=lambda x: x['id']):
        valcre = field.get('valcreMatch', '')
        input_source = field['inputSource']
        report += f"| `{field['id']}` | `{valcre}` | {input_source} |\n"

    report += f"""

---

## Unmapped Fields ({len(unmapped_fields)})

These fields exist in fieldRegistry.ts but have no match in MASTER-FIELD-DIRECTORY.md.
They may be:
- Custom dashboard fields without Valcre equivalents
- Fields with significantly different naming conventions
- New fields added to the dashboard

| Field ID | Registry Input Source | Possible Reason |
|----------|----------------------|-----------------|
"""

    for field in sorted(unmapped_fields, key=lambda x: x['id']):
        input_source = field['inputSource']
        reason = ''
        if 'intake-' in field['id']:
            reason = 'Client intake form (V3 Dashboard specific)'
        elif 'loe-' in field['id']:
            reason = 'LOE/Quote section (V3 Dashboard specific)'
        elif 'img-' in field['id']:
            reason = 'Image management (Dashboard-specific)'
        else:
            reason = 'Unknown - needs manual review'

        report += f"| `{field['id']}` | {input_source} | {reason} |\n"

    report += f"""

---

## Next Steps

1. **Review Conflicts:** Check fields where Registry says 'user-input' but Valcre says '🔢 Calculated'
2. **Verify Unmapped Fields:** Determine if unmapped fields should be added to Valcre or removed from registry
3. **Map Field Destinations:** For each field, identify which report page/table it populates
4. **Document Calculator Engine:** Identify which input fields feed which calculated outputs

---

## Field Naming Convention Notes

- **Registry:** Uses `kebab-case` (e.g., `client-company`, `calc-pgi`)
- **Valcre:** Uses `PascalCase_Underscore` (e.g., `Client_Company`, `IA_DirCap_PGI`)
- **Prefixes:**
  - `calc-*`: Calculated fields in registry
  - `IA_*`: Income Analysis fields in Valcre
  - `intake-*`: Client intake form fields (dashboard-specific)
  - `loe-*`: Letter of Engagement fields (dashboard-specific)
  - `img-*`: Image upload fields (dashboard-specific)

"""

    output_file.write_text(report)
    print(f"✅ Report written to: {output_file}")
    print(f"\n📍 Location: {output_file}")

if __name__ == "__main__":
    main()
