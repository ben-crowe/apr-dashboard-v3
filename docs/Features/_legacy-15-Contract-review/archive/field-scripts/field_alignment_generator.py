#!/usr/bin/env python3
"""
Field Alignment Report Generator
Compares fieldRegistry.ts fields with Word HTML source fields from consolidated mapping
"""

import re
import json
from difflib import SequenceMatcher
from collections import defaultdict
from datetime import datetime

# File paths
REGISTRY_FILE = "/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/schema/fieldRegistry.ts"
CONSOLIDATED_MAPPING = "/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/6-Souce Reports & Workbook/Ref-1-North Battleford/REPORT Pg Img/master-field-mapping-consolidated.json"
OUTPUT_FILE = "/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/FIELD-ALIGNMENT-REPORT.md"


def extract_registry_fields(filepath):
    """Extract field IDs from fieldRegistry.ts"""
    fields = []
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match patterns like: id: 'field-name',
    # or id: "field-name",
    pattern = r'''id:\s*['"]([^'"]+)['"]'''
    matches = re.findall(pattern, content)

    fields = list(dict.fromkeys(matches))  # Remove duplicates while preserving order
    print(f"Extracted {len(fields)} fields from registry")
    return fields


def extract_html_fields_from_mapping(filepath):
    """Extract field IDs from consolidated mapping JSON"""
    fields = set()

    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Extract all field IDs from pages
    if 'pages' in data:
        for page in data['pages']:
            if 'fields' in page:
                for field in page['fields']:
                    if 'fieldId' in field and field['fieldId']:
                        fields.add(field['fieldId'])

    field_list = sorted(fields)
    print(f"Extracted {len(field_list)} fields from HTML mapping")
    return field_list


def normalize_for_comparison(field):
    """Normalize field name for comparison"""
    return field.lower().replace('-', '').replace('_', '').replace(' ', '')


def similarity(a, b):
    """Calculate similarity ratio between two strings"""
    return SequenceMatcher(None, normalize_for_comparison(a), normalize_for_comparison(b)).ratio()


def find_best_match(registry_field, html_fields, used_matches):
    """
    Find the best matching HTML field for a registry field
    Returns: (html_field, status, confidence_score)
    """
    # Try exact string match first (case-sensitive)
    if registry_field in html_fields and registry_field not in used_matches:
        return registry_field, "✅ Exact", 1.0

    registry_norm = normalize_for_comparison(registry_field)

    # Try normalized match (case-insensitive, separator-agnostic)
    for html_field in html_fields:
        if html_field in used_matches:
            continue
        html_norm = normalize_for_comparison(html_field)
        if registry_norm == html_norm:
            return html_field, "✅ Close", 1.0

    # Try fuzzy matching
    best_match = None
    best_score = 0.0

    for html_field in html_fields:
        if html_field in used_matches:
            continue
        score = similarity(registry_field, html_field)
        if score > best_score:
            best_score = score
            best_match = html_field

    # Categorize based on score
    if best_score >= 0.80:
        return best_match, "✅ Close", best_score
    elif best_score >= 0.60:
        return best_match, "⚠️ Uncertain", best_score
    else:
        return None, "🔵 Extra", 0.0


def generate_notes(registry_field, html_field, status, score):
    """Generate helpful notes for the match"""
    if status == "✅ Exact":
        return "Perfect match - already aligned"
    elif status == "✅ Close":
        if score == 1.0:
            return "Exact match (case/separator difference only) - rename recommended"
        else:
            return f"Strong match ({score:.2%}) - verify and rename"
    elif status == "⚠️ Uncertain":
        return f"Uncertain match ({score:.2%}) - manual review required"
    elif status == "🔵 Extra":
        return "Not found in HTML - may be obsolete or custom field"
    elif status == "❌ Missing":
        return "Must be added to registry"
    return ""


def generate_report():
    """Generate the field alignment report"""
    print("Starting field alignment analysis...")

    # Extract fields
    registry_fields = extract_registry_fields(REGISTRY_FILE)
    html_fields = extract_html_fields_from_mapping(CONSOLIDATED_MAPPING)

    print(f"\nRegistry fields: {len(registry_fields)}")
    print(f"HTML fields: {len(html_fields)}")

    # Track matches
    used_matches = set()
    alignments = []

    # Find matches for each registry field
    for registry_field in registry_fields:
        html_field, status, score = find_best_match(registry_field, html_fields, used_matches)
        if html_field:
            used_matches.add(html_field)
        notes = generate_notes(registry_field, html_field, status, score)

        alignments.append({
            'registry': registry_field,
            'html': html_field if html_field else "—",
            'status': status,
            'notes': notes,
            'score': score
        })

    # Find missing fields (in HTML but not matched)
    for html_field in html_fields:
        if html_field not in used_matches:
            alignments.append({
                'registry': "—",
                'html': html_field,
                'status': "❌ Missing",
                'notes': generate_notes(None, html_field, "❌ Missing", 0.0),
                'score': 0.0
            })

    # Sort by priority: Uncertain → Close → Exact → Extra → Missing
    status_priority = {
        "⚠️ Uncertain": 1,
        "✅ Close": 2,
        "✅ Exact": 3,
        "🔵 Extra": 4,
        "❌ Missing": 5
    }
    alignments.sort(key=lambda x: (status_priority.get(x['status'], 6), -x['score'], x['registry']))

    # Count by status
    status_counts = defaultdict(int)
    for alignment in alignments:
        status_counts[alignment['status']] += 1

    # Generate markdown report
    report = f"""# Field Alignment Report: Registry → HTML Source

**Date:** {datetime.now().strftime('%Y-%m-%d')}
**Purpose:** Map existing fieldRegistry.ts fields to Word HTML source fields

## Summary

- **Total Registry Fields:** {len(registry_fields)}
- **Total HTML Source Fields:** {len(html_fields)}
- **Exact Matches:** {status_counts.get('✅ Exact', 0)} (already aligned perfectly)
- **Close Matches:** {status_counts.get('✅ Close', 0)} (need renaming)
- **Uncertain Matches:** {status_counts.get('⚠️ Uncertain', 0)} (need manual review)
- **Extra in Registry:** {status_counts.get('🔵 Extra', 0)} (not in HTML)
- **Missing from Registry:** {status_counts.get('❌ Missing', 0)} (in HTML, not in registry)

## Coverage Analysis

**Registry → HTML Match Rate:** {((status_counts.get('✅ Exact', 0) + status_counts.get('✅ Close', 0)) / len(registry_fields) * 100):.1f}%
- Fields that align well: {status_counts.get('✅ Exact', 0) + status_counts.get('✅ Close', 0)} / {len(registry_fields)}
- Potential obsolete fields: {status_counts.get('🔵 Extra', 0)} ({(status_counts.get('🔵 Extra', 0) / len(registry_fields) * 100):.1f}%)

**HTML → Registry Coverage:** {((status_counts.get('✅ Exact', 0) + status_counts.get('✅ Close', 0)) / len(html_fields) * 100):.1f}%
- Fields needing addition: {status_counts.get('❌ Missing', 0)} / {len(html_fields)} ({(status_counts.get('❌ Missing', 0) / len(html_fields) * 100):.1f}%)

## Field Alignment Table

| fieldRegistry.ts | Word HTML Source | Status | Notes |
|------------------|------------------|--------|-------|
"""

    # Add table rows
    for alignment in alignments:
        report += f"| {alignment['registry']} | {alignment['html']} | {alignment['status']} | {alignment['notes']} |\n"

    # Add action items sections
    report += "\n## Action Items\n\n"

    # Uncertain matches
    uncertain = [a for a in alignments if a['status'] == "⚠️ Uncertain"]
    if uncertain:
        report += f"### High Priority - Uncertain Matches ({len(uncertain)} fields)\n\n"
        report += "These matches need manual verification to confirm they are correct:\n\n"
        for a in uncertain:
            report += f"- `{a['registry']}` → `{a['html']}` (similarity: {a['score']:.2%})\n"
        report += "\n"

    # Close matches
    close = [a for a in alignments if a['status'] == "✅ Close"]
    if close:
        report += f"### Medium Priority - Close Matches ({len(close)} fields)\n\n"
        report += "These fields just need to be renamed in fieldRegistry.ts:\n\n"
        for a in close:
            if a['registry'] != a['html']:  # Only show if names differ
                report += f"- Rename `{a['registry']}` → `{a['html']}`\n"
        report += "\n"

    # Exact matches
    exact = [a for a in alignments if a['status'] == "✅ Exact"]
    if exact:
        report += f"### Already Aligned - Exact Matches ({len(exact)} fields)\n\n"
        report += "These fields are perfectly aligned and need no changes:\n\n"
        report += "```\n"
        for i, a in enumerate(exact):
            report += f"{a['registry']}"
            if (i + 1) % 5 == 0:
                report += "\n"
            else:
                report += ", " if i < len(exact) - 1 else ""
        report += "\n```\n\n"

    # Extra fields
    extra = [a for a in alignments if a['status'] == "🔵 Extra"]
    if extra:
        report += f"### Low Priority - Extra Fields ({len(extra)} fields)\n\n"
        report += "These registry fields are not found in the HTML source. Review if they are still needed:\n\n"
        for a in extra[:50]:  # Limit to first 50 to keep report manageable
            report += f"- `{a['registry']}` - Consider removing if obsolete\n"
        if len(extra) > 50:
            report += f"\n... and {len(extra) - 50} more (see table above for full list)\n"
        report += "\n"

    # Missing fields
    missing = [a for a in alignments if a['status'] == "❌ Missing"]
    if missing:
        report += f"### Required - Missing Fields ({len(missing)} fields)\n\n"
        report += "These HTML fields are not in the registry and must be added:\n\n"
        for a in missing[:50]:  # Limit to first 50
            report += f"- `{a['html']}`\n"
        if len(missing) > 50:
            report += f"\n... and {len(missing) - 50} more (see table above for full list)\n"
        report += "\n"

    # Next steps
    report += """## Recommended Next Steps

1. **Review Uncertain Matches** (High Priority)
   - Manually verify the suggested mappings
   - Update field names where appropriate
   - Document any intentional differences

2. **Rename Close Matches** (Medium Priority)
   - Systematically rename registry fields to match HTML source
   - Update all references in code
   - Commit changes incrementally

3. **Add Missing Fields** (Required)
   - Add new field definitions to fieldRegistry.ts
   - Follow existing patterns for field structure
   - Include proper categories and data types

4. **Review Extra Fields** (Low Priority)
   - Identify which fields are truly obsolete
   - Remove unused fields to reduce maintenance burden
   - Document any custom fields that should remain

5. **Test and Validate**
   - Run full report generation after changes
   - Verify all fields render correctly
   - Check for any breaking changes
"""

    # Write report
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(report)

    print(f"\n✓ Report generated: {OUTPUT_FILE}")
    print(f"\nSummary:")
    print(f"  Exact matches: {status_counts.get('✅ Exact', 0)}")
    print(f"  Close matches: {status_counts.get('✅ Close', 0)}")
    print(f"  Uncertain matches: {status_counts.get('⚠️ Uncertain', 0)}")
    print(f"  Extra fields: {status_counts.get('🔵 Extra', 0)}")
    print(f"  Missing fields: {status_counts.get('❌ Missing', 0)}")


if __name__ == "__main__":
    generate_report()
