#!/usr/bin/env python3
"""
Analyze 273 "missing" fields against Valcre workbook to determine:
1. Which fields exist in the workbook (dynamic data - need registry)
2. Which fields DON'T exist in workbook (likely boilerplate - hardcode)
3. Extract actual values from workbook for fields that exist

This script is VERIFIABLE - run it yourself to confirm results.
"""

import openpyxl
import json
from pathlib import Path

# Paths
WORKBOOK_PATH = Path("/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/VAL251012 - North Battleford Apt, 1101, 1121 109 Street, North Battleford.xlsm")
AUDIT_RESULTS_PATH = Path("/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/FIELD-AUDIT-RESULTS.md")
OUTPUT_PATH = Path("/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/FIELD-WORKBOOK-ANALYSIS.md")

print("=" * 80)
print("FIELD ANALYSIS: 273 Missing Fields vs Valcre Workbook")
print("=" * 80)

# Step 1: Load workbook and get all named ranges
print("\n[1/4] Loading Valcre workbook...")
wb = openpyxl.load_workbook(WORKBOOK_PATH, data_only=True)  # data_only=True gets calculated values
print(f"✓ Loaded workbook with {len(wb.defined_names)} named ranges")

# Get all named range names (excluding internal _xleta ones)
workbook_fields = set()
for name in wb.defined_names.keys():
    if not name.startswith('_xleta'):
        workbook_fields.add(name)

print(f"✓ Found {len(workbook_fields)} user-defined named ranges")

# Step 2: Extract the 273 missing fields from audit results
print("\n[2/4] Reading field audit results...")
missing_fields = []

with open(AUDIT_RESULTS_PATH, 'r') as f:
    content = f.read()

    # Parse all lines that start with "- " (field entries)
    in_missing_section = False
    for line in content.split('\n'):
        if '## Missing Fields' in line:
            in_missing_section = True
            continue
        if in_missing_section and line.startswith('##') and 'Missing Fields' not in line:
            # Still in missing fields if it's a subsection like "### Site Fields"
            if not line.startswith('###'):
                in_missing_section = False
        if in_missing_section and line.startswith('- '):
            field_id = line.split('- ')[1].strip()
            if field_id and not field_id.startswith('['):  # Skip metadata lines
                missing_fields.append(field_id)

print(f"✓ Extracted {len(missing_fields)} missing fields from audit")

# Step 3: Cross-reference each missing field against workbook
print("\n[3/4] Cross-referencing fields...")

results = {
    'in_workbook': [],
    'not_in_workbook': [],
    'field_values': {}
}

for field_id in missing_fields:
    # Convert kebab-case to potential workbook naming conventions
    # Workbook might use: PascalCase, UPPERCASE, or prefix patterns

    # Try exact match first
    if field_id in workbook_fields:
        results['in_workbook'].append(field_id)

        # Try to get the value
        try:
            defn = wb.defined_names[field_id]
            if defn.destinations:
                sheet_name, cell_ref = list(defn.destinations)[0]
                sheet = wb[sheet_name]
                cell = sheet[cell_ref.replace('$', '')]
                value = cell.value
                results['field_values'][field_id] = {
                    'sheet': sheet_name,
                    'cell': cell_ref,
                    'value': str(value) if value else ''
                }
        except Exception as e:
            results['field_values'][field_id] = {'error': str(e)}
    else:
        # Try variations
        variations = [
            field_id.upper(),
            field_id.replace('-', '_'),
            field_id.replace('-', '_').upper(),
            ''.join(word.capitalize() for word in field_id.split('-')),
            'HOME_' + field_id.replace('-', '_'),
            'SITE_' + field_id.replace('-', '_').upper(),
        ]

        found = False
        for variant in variations:
            if variant in workbook_fields:
                results['in_workbook'].append(f"{field_id} (as {variant})")
                found = True

                # Get value
                try:
                    defn = wb.defined_names[variant]
                    if defn.destinations:
                        sheet_name, cell_ref = list(defn.destinations)[0]
                        sheet = wb[sheet_name]
                        cell = sheet[cell_ref.replace('$', '')]
                        value = cell.value
                        results['field_values'][field_id] = {
                            'workbook_name': variant,
                            'sheet': sheet_name,
                            'cell': cell_ref,
                            'value': str(value) if value else ''
                        }
                except Exception as e:
                    results['field_values'][field_id] = {'workbook_name': variant, 'error': str(e)}
                break

        if not found:
            results['not_in_workbook'].append(field_id)

print(f"✓ Found {len(results['in_workbook'])} fields IN workbook")
print(f"✓ Found {len(results['not_in_workbook'])} fields NOT in workbook")

# Step 4: Generate report
print("\n[4/4] Generating analysis report...")

report = f"""# Field Analysis: 273 Missing Fields vs Valcre Workbook

**Generated:** 2025-12-13
**Script:** analyze-273-fields.py
**Workbook:** VAL251012 - North Battleford Apt
**Total Fields Analyzed:** {len(missing_fields)}

## Summary

- **Fields IN Workbook:** {len(results['in_workbook'])} (these are DYNAMIC data - need registry entries)
- **Fields NOT in Workbook:** {len(results['not_in_workbook'])} (likely BOILERPLATE - should hardcode)

## Breakdown

### ✅ Fields Found in Workbook ({len(results['in_workbook'])} fields)

These are actual Valcre workbook fields containing dynamic property data.
**Action Required:** Add to fieldRegistry.ts with values from test data.

"""

for field_id in results['in_workbook']:
    base_field = field_id.split(' (as ')[0]
    if base_field in results['field_values']:
        val_info = results['field_values'][base_field]
        if 'value' in val_info:
            report += f"- `{field_id}`\n"
            report += f"  - Sheet: {val_info.get('sheet', 'N/A')}\n"
            report += f"  - Cell: {val_info.get('cell', 'N/A')}\n"
            report += f"  - Value: `{val_info['value']}`\n\n"
        elif 'error' in val_info:
            report += f"- `{field_id}` - ERROR: {val_info['error']}\n\n"

report += f"""
### ❌ Fields NOT Found in Workbook ({len(results['not_in_workbook'])} fields)

These field IDs do NOT exist in the Valcre workbook named ranges.
**Likely:** Standard boilerplate text that should be hardcoded in templates.
**Action Required:** Compare against reference PDF to confirm, then hardcode in renderPageXX functions.

"""

for field_id in results['not_in_workbook']:
    report += f"- `{field_id}`\n"

report += """
## Next Steps

### For Fields IN Workbook (Dynamic Data):
1. Verify the extracted values match reference PDF
2. Add field definitions to fieldRegistry.ts
3. Add test data values from workbook extraction
4. Test rendering in templates

### For Fields NOT in Workbook (Boilerplate):
1. Find the actual text in reference PDF pages
2. Compare same section in second reference property (VAL251026)
3. If text is IDENTICAL between properties → Confirmed boilerplate
4. Update renderPageXX() to hardcode the text
5. Remove getFieldValue() calls for these fields

## Verification

**How to verify this analysis:**
```bash
# Run this script yourself
python3 analyze-273-fields.py

# Compare output to reference PDF
# Open: docs/15-Contract-review/VAL251012 - North Battleford Apt...docx
# Search for fields listed above and verify values match
```
"""

with open(OUTPUT_PATH, 'w') as f:
    f.write(report)

print(f"✓ Report saved to: {OUTPUT_PATH}")

# Also save JSON for programmatic use
json_path = OUTPUT_PATH.with_suffix('.json')
with open(json_path, 'w') as f:
    json.dump(results, f, indent=2)

print(f"✓ JSON data saved to: {json_path}")

print("\n" + "=" * 80)
print("ANALYSIS COMPLETE")
print("=" * 80)
print(f"\nResults:")
print(f"  IN workbook (dynamic):     {len(results['in_workbook']):3d} fields")
print(f"  NOT in workbook (likely boilerplate): {len(results['not_in_workbook']):3d} fields")
print(f"\nReview the report and verify against the actual PDF yourself.")
print("=" * 80)
