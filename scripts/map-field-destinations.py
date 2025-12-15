#!/usr/bin/env python3
"""
Map Field Destinations - Identify which pages/tables contain which fields
Parses Word HTML to determine field locations and groupings
"""

import re
from pathlib import Path
from collections import defaultdict

def extract_word_sections(html_path):
    """Extract WordSection divs from HTML"""
    content = Path(html_path).read_text(encoding='utf-8')

    sections = {}

    # Split by WordSection divs
    # Find all section start positions
    section_pattern = r'<div class=WordSection(\d+)>'
    matches = list(re.finditer(section_pattern, content))

    for i, match in enumerate(matches):
        section_num = int(match.group(1))
        start_pos = match.end()

        # Find end position (start of next section or end of body)
        if i < len(matches) - 1:
            end_pos = matches[i + 1].start()
        else:
            # Last section - find </body>
            body_end = content.rfind('</body>')
            end_pos = body_end if body_end != -1 else len(content)

        section_content = content[start_pos:end_pos]

        # Remove closing </div> if present at the end
        section_content = section_content.rstrip()
        if section_content.endswith('</div>'):
            section_content = section_content[:-6]

        sections[section_num] = section_content

    return sections

def extract_fields_from_section(section_content):
    """Extract all w:Sdt field IDs from a section"""
    # Pattern to match w:Sdt Title attributes
    pattern = r'<w:Sdt[^>]*Title="([^"]*)"[^>]*>'

    fields = []
    for match in re.finditer(pattern, section_content):
        title = match.group(1)
        # Extract field name (before first parenthesis)
        field_name = title.split('(')[0].strip()
        fields.append(field_name)

    return fields

def identify_table_type(fields):
    """Identify table type based on field patterns"""
    field_str = ' '.join(fields).lower()

    # Table type detection patterns
    if any(x in field_str for x in ['rent1', 'rent2', 'rent3', 'rent4', 'rent5', 'survey']):
        return 'Rental Survey'
    elif any(x in field_str for x in ['sale1', 'sale2', 'sale3', 'comp']):
        return 'Sales Comp'
    elif any(x in field_str for x in ['expense', 'opex', 'ia_opex']):
        return 'Expense Analysis'
    elif any(x in field_str for x in ['income', 'revenue', 'pgi']):
        return 'Income Analysis'
    elif any(x in field_str for x in ['directcap', 'cap_rate', 'capitalization']):
        return 'Direct Capitalization'
    elif any(x in field_str for x in ['dcf', 'cash_flow', 'discounted']):
        return 'DCF Analysis'
    elif any(x in field_str for x in ['unit_mix', 'rentroll']):
        return 'Unit Mix / Rent Roll'
    elif any(x in field_str for x in ['cost_approach', 'replacement_cost']):
        return 'Cost Approach'
    elif any(x in field_str for x in ['client', 'subject_property', 'property_name']):
        return 'Property Info'
    elif any(x in field_str for x in ['map', 'aerial', 'regional', 'local']):
        return 'Maps & Location'
    elif any(x in field_str for x in ['site', 'zoning', 'land']):
        return 'Site Analysis'
    else:
        return 'General Content'

def identify_section_name(section_num, fields):
    """Identify section name based on section number and field content"""
    # Common section mappings (based on typical appraisal report structure)
    section_names = {
        1: 'Title Page',
        2: 'Cover Letter / Transmittal',
        3: 'Table of Contents',
        4: 'Executive Summary',
        5: 'Certification',
        6: 'Property Analysis',
        7: 'Site Description',
        8: 'Improvements Description',
        9: 'Market Analysis',
        10: 'Highest & Best Use',
    }

    # Use predefined if available
    if section_num in section_names:
        return section_names[section_num]

    # Otherwise infer from field content
    field_str = ' '.join(fields).lower()
    if 'executive' in field_str or 'summary' in field_str:
        return 'Executive Summary'
    elif 'certification' in field_str or 'cert_' in field_str:
        return 'Certification'
    elif 'transmittal' in field_str or 'letter' in field_str:
        return 'Transmittal Letter'
    elif 'site' in field_str or 'zoning' in field_str:
        return 'Site Analysis'
    elif 'improvement' in field_str or 'building' in field_str:
        return 'Improvements'
    elif 'market' in field_str or 'survey' in field_str:
        return 'Market Analysis'
    elif 'income' in field_str or 'expense' in field_str:
        return 'Income & Expense Analysis'
    elif 'value' in field_str or 'conclusion' in field_str:
        return 'Valuation Conclusion'
    else:
        return f'Section {section_num}'

def main():
    # File paths
    word_html = Path("/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/VAL251012 - North Battleford Apt, 1101, 1121 109 Street, North Battleford.html")
    output_file = Path("/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/FIELD-DESTINATION-MAP.md")

    print("📖 Reading Word HTML...")
    sections = extract_word_sections(word_html)
    print(f"   Found {len(sections)} WordSection divs")

    print("\n🔍 Analyzing field locations...")

    # Track field appearances
    field_locations = defaultdict(list)  # field_name -> [section_nums]
    section_fields = {}  # section_num -> [field_names]
    section_info = {}  # section_num -> {name, table_type, field_count}

    for section_num, section_content in sorted(sections.items()):
        fields = extract_fields_from_section(section_content)
        unique_fields = list(dict.fromkeys(fields))  # Preserve order, remove duplicates

        section_fields[section_num] = unique_fields

        # Identify section characteristics
        section_name = identify_section_name(section_num, unique_fields)
        table_type = identify_table_type(unique_fields)

        section_info[section_num] = {
            'name': section_name,
            'table_type': table_type,
            'field_count': len(unique_fields),
            'total_appearances': len(fields)
        }

        # Track where each field appears
        for field_name in unique_fields:
            field_locations[field_name].append(section_num)

        print(f"   Section {section_num:2d}: {section_name:30s} | {len(unique_fields):3d} fields | Type: {table_type}")

    print(f"\n📊 Statistics:")
    print(f"   Total unique fields across all sections: {len(field_locations)}")
    print(f"   Fields appearing in multiple sections: {sum(1 for locs in field_locations.values() if len(locs) > 1)}")
    print(f"   Single-section fields: {sum(1 for locs in field_locations.values() if len(locs) == 1)}")

    # Generate report
    print(f"\n📝 Writing destination map report...")

    report = f"""# Field Destination Map

**Generated:** map-field-destinations.py
**Purpose:** Identify which report pages/sections contain which fields

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| **Total WordSections** | {len(sections)} |
| **Unique Fields** | {len(field_locations)} |
| **Multi-Section Fields** | {sum(1 for locs in field_locations.values() if len(locs) > 1)} |
| **Single-Section Fields** | {sum(1 for locs in field_locations.values() if len(locs) == 1)} |

---

## Section Overview

| Section | Name | Table Type | Unique Fields | Total Appearances |
|---------|------|------------|---------------|-------------------|
"""

    for section_num in sorted(section_info.keys()):
        info = section_info[section_num]
        report += f"| {section_num} | {info['name']} | {info['table_type']} | {info['field_count']} | {info['total_appearances']} |\n"

    report += f"""

---

## Fields by Section

Shows which fields appear in each section of the report.

"""

    for section_num in sorted(section_fields.keys()):
        info = section_info[section_num]
        fields = section_fields[section_num]

        report += f"""
### Section {section_num}: {info['name']}

**Table Type:** {info['table_type']}
**Field Count:** {len(fields)}

<details>
<summary>Click to expand field list ({len(fields)} fields)</summary>

"""
        for i, field_name in enumerate(fields, 1):
            report += f"{i}. `{field_name}`\n"

        report += "\n</details>\n"

    report += f"""

---

## Field Location Index

Alphabetical index showing which sections contain each field.

| Field Name | Appears In Sections | Count |
|------------|---------------------|-------|
"""

    for field_name in sorted(field_locations.keys()):
        sections_list = field_locations[field_name]
        sections_str = ', '.join(str(s) for s in sections_list)
        count = len(sections_list)
        report += f"| `{field_name}` | {sections_str} | {count} |\n"

    report += f"""

---

## Table Type Groupings

Fields grouped by their primary table type.

"""

    # Group fields by table type
    table_groups = defaultdict(set)
    for section_num, info in section_info.items():
        table_type = info['table_type']
        for field in section_fields[section_num]:
            table_groups[table_type].add(field)

    for table_type in sorted(table_groups.keys()):
        fields = sorted(table_groups[table_type])
        report += f"""
### {table_type} ({len(fields)} fields)

<details>
<summary>Click to expand field list</summary>

"""
        for field in fields:
            report += f"- `{field}`\n"

        report += "\n</details>\n"

    report += f"""

---

## Multi-Section Fields

Fields that appear in multiple sections (reused across report).

| Field Name | Section Count | Sections |
|------------|---------------|----------|
"""

    multi_section_fields = {field: locs for field, locs in field_locations.items() if len(locs) > 1}
    for field_name in sorted(multi_section_fields.keys(), key=lambda x: len(field_locations[x]), reverse=True):
        sections_list = field_locations[field_name]
        sections_str = ', '.join(str(s) for s in sections_list)
        count = len(sections_list)
        report += f"| `{field_name}` | {count} | {sections_str} |\n"

    report += f"""

---

## Next Steps

1. **Cross-reference with fieldRegistry.ts:** Verify all Word HTML fields are mapped in registry
2. **Map calculator outputs to tables:** Identify which table fields are auto-populated
3. **Create per-page templates:** Generate HTML templates for each section
4. **Validate field usage:** Confirm fields are used where expected

---

## Notes

- **Section numbers** correspond to `<div class=WordSection#>` in the Word HTML export
- **Table types** are inferred from field name patterns
- **Multi-section fields** indicate shared data (e.g., client info, property details)
- **Single-section fields** are specific to one part of the report

"""

    output_file.write_text(report)
    print(f"✅ Report written to: {output_file}")
    print(f"\n📍 Location: {output_file}")

if __name__ == "__main__":
    main()
