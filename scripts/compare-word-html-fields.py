#!/usr/bin/env python3
"""
Extract field IDs from Word HTML template and compare against fieldRegistry.ts

This script:
1. Parses Word HTML to find all <w:Sdt Title="..."> tags
2. Extracts field IDs and tracks page numbers
3. Reads fieldRegistry.ts to get registered fields
4. Generates a comprehensive comparison report
"""

import re
from collections import defaultdict
from pathlib import Path
from datetime import date
from typing import Dict, List, Set, Tuple

# File paths
HTML_FILE = Path("/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/VAL251012 - North Battleford Apt, 1101, 1121 109 Street, North Battleford.html")
FIELD_REGISTRY_FILE = Path("/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/schema/fieldRegistry.ts")
OUTPUT_FILE = Path("/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/FIELD-COMPARISON-REPORT.md")

def extract_fields_from_html(html_path: Path) -> Tuple[Dict[str, List[int]], int]:
    """
    Extract field IDs from Word HTML file.

    Returns:
        Tuple of (field_dict, total_pages) where field_dict maps field_id -> list of page numbers
    """
    print(f"Reading Word HTML from: {html_path}")

    with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Find all Title attributes in w:Sdt tags
    # Pattern: Title="Field_Name (VAL251012...xlsm)"
    # Use DOTALL to match across newlines since w:Sdt tags can span multiple lines
    title_pattern = re.compile(r'Title="([^"]+)"', re.IGNORECASE)

    # Page break pattern
    page_break_pattern = re.compile(r"<br\s+clear=all\s+style='page-break-before:always'>", re.IGNORECASE)

    # Find all page breaks positions
    page_breaks = [m.start() for m in page_break_pattern.finditer(content)]
    total_pages = len(page_breaks) + 1

    print(f"Found {total_pages} pages in document")

    # Find all field titles
    field_positions = {}  # position -> field_id

    for match in title_pattern.finditer(content):
        title = match.group(1)
        position = match.start()

        # Extract field ID from title (format: "Field_Name (VAL251012...xlsm)")
        # Get everything before the first '('
        if '(' in title:
            field_id = title.split('(')[0].strip()

            # Only keep field IDs that look like field names (contain underscore or start with uppercase)
            if field_id and ('_' in field_id or field_id[0].isupper()):
                field_positions[position] = field_id

    print(f"Found {len(field_positions)} field instances")

    # Map each field to its pages
    fields_by_page = defaultdict(list)

    for position, field_id in field_positions.items():
        # Determine which page this field is on
        page_num = 1
        for i, page_break_pos in enumerate(page_breaks):
            if position < page_break_pos:
                page_num = i + 1
                break
        else:
            # After all page breaks
            page_num = total_pages

        if page_num not in fields_by_page[field_id]:
            fields_by_page[field_id].append(page_num)

    # Sort page numbers for each field
    for field_id in fields_by_page:
        fields_by_page[field_id].sort()

    return dict(fields_by_page), total_pages


def extract_fields_from_registry(registry_path: Path) -> Set[str]:
    """
    Extract field IDs from fieldRegistry.ts

    Returns:
        Set of field IDs
    """
    print(f"Reading fieldRegistry.ts from: {registry_path}")

    with open(registry_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all field IDs - they appear as keys in the registry object
    # Pattern: id: 'Field_Name' or id: "Field_Name"
    id_pattern = re.compile(r"id:\s*['\"]([^'\"]+)['\"]")

    field_ids = set()
    for match in id_pattern.finditer(content):
        field_id = match.group(1)
        field_ids.add(field_id)

    print(f"Found {len(field_ids)} fields in fieldRegistry.ts")

    return field_ids


def organize_fields_by_page(fields_by_page: Dict[str, List[int]], total_pages: int) -> Dict[int, List[str]]:
    """
    Reorganize data to group fields by page number.

    Returns:
        Dict mapping page_number -> list of field IDs on that page
    """
    pages = defaultdict(list)

    for field_id, page_nums in fields_by_page.items():
        for page_num in page_nums:
            pages[page_num].append(field_id)

    # Sort fields on each page alphabetically
    for page_num in pages:
        pages[page_num].sort()

    return dict(pages)


def generate_report(
    fields_by_page: Dict[str, List[int]],
    total_pages: int,
    registry_fields: Set[str],
    output_path: Path
):
    """
    Generate comprehensive comparison report in Markdown format.
    """
    print(f"Generating comparison report...")

    html_fields = set(fields_by_page.keys())

    # Calculate statistics
    in_both = html_fields & registry_fields
    missing_from_registry = html_fields - registry_fields
    extra_in_registry = registry_fields - html_fields

    match_rate = (len(in_both) / len(html_fields) * 100) if html_fields else 0

    # Organize by page
    pages = organize_fields_by_page(fields_by_page, total_pages)

    # Generate report
    lines = [
        "# Field Comparison Report: Word HTML vs fieldRegistry.ts",
        "",
        f"**Date:** {date.today().strftime('%Y-%m-%d')}",
        "**Purpose:** Validate fieldRegistry.ts against source Word HTML template",
        "",
        "## Summary Statistics",
        "",
        f"- **Word HTML Total Fields:** {len(html_fields)}",
        f"- **fieldRegistry.ts Total Fields:** {len(registry_fields)}",
        f"- **Fields in BOTH:** {len(in_both)} ✅",
        f"- **Missing from fieldRegistry:** {len(missing_from_registry)} ❌",
        f"- **Extra in fieldRegistry (not in Word HTML):** {len(extra_in_registry)} ⚠️",
        f"- **Match Rate:** {match_rate:.1f}%",
        "",
    ]

    # Fields by page section
    lines.extend([
        "## Fields by Page (Word HTML Source)",
        "",
    ])

    for page_num in sorted(pages.keys()):
        page_label = get_page_label(page_num)
        lines.append(f"### Page {page_num}{page_label}")
        lines.append("")

        for field_id in pages[page_num]:
            status = "✅" if field_id in registry_fields else "❌ MISSING"
            lines.append(f"- {field_id} {status}")

        lines.append("")

    # Comparison results section
    lines.extend([
        "## Comparison Results",
        "",
    ])

    # Correctly mapped fields
    if in_both:
        lines.extend([
            "### ✅ Correctly Mapped (in BOTH sources)",
            "",
            "| Field ID | Page(s) | Status |",
            "|----------|---------|--------|",
        ])

        for field_id in sorted(in_both):
            pages_str = format_page_list(fields_by_page[field_id])
            lines.append(f"| {field_id} | {pages_str} | ✅ Match |")

        lines.append("")

    # Missing from registry
    if missing_from_registry:
        lines.extend([
            "### ❌ Missing from fieldRegistry.ts",
            "",
            f"**Count:** {len(missing_from_registry)} fields need to be added",
            "",
            "| Field ID | Page(s) | Impact |",
            "|----------|---------|--------|",
        ])

        for field_id in sorted(missing_from_registry):
            pages_str = format_page_list(fields_by_page[field_id])
            lines.append(f"| {field_id} | {pages_str} | Missing - needs to be added |")

        lines.append("")

    # Extra in registry
    if extra_in_registry:
        lines.extend([
            "### ⚠️ Extra in fieldRegistry.ts (not in Word HTML)",
            "",
            f"**Count:** {len(extra_in_registry)} fields not found in Word template",
            "",
            "| Field ID | Status | Notes |",
            "|----------|--------|-------|",
        ])

        for field_id in sorted(extra_in_registry):
            lines.append(f"| {field_id} | Extra | Not found in Word template - may be obsolete or calculated |")

        lines.append("")

    # Recommendations section
    lines.extend([
        "## Recommendations",
        "",
    ])

    if missing_from_registry:
        lines.append(f"1. **CRITICAL:** Add {len(missing_from_registry)} missing fields to fieldRegistry.ts")

    if extra_in_registry:
        lines.append(f"2. Review {len(extra_in_registry)} extra fields - verify if they are:")
        lines.append("   - Calculated fields (generated programmatically)")
        lines.append("   - Legacy fields (obsolete, should be removed)")
        lines.append("   - Fields from other report templates")

    if match_rate < 100:
        lines.append("3. Verify field naming conventions match Word HTML exactly")

    if match_rate == 100 and not missing_from_registry and not extra_in_registry:
        lines.append("✅ **Perfect match!** All fields are correctly mapped.")

    lines.extend([
        "",
        "## Next Steps",
        "",
        "1. Review missing fields and determine if they should be added",
        "2. Check extra fields to confirm they are intentional",
        "3. Update fieldRegistry.ts as needed",
        "4. Re-run this comparison to verify changes",
        "",
    ])

    # Write report
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))

    print(f"Report written to: {output_path}")
    print("\n" + "="*70)
    print("SUMMARY")
    print("="*70)
    print(f"Word HTML Fields:        {len(html_fields)}")
    print(f"fieldRegistry.ts Fields: {len(registry_fields)}")
    print(f"Match Rate:              {match_rate:.1f}%")
    print(f"Missing from Registry:   {len(missing_from_registry)}")
    print(f"Extra in Registry:       {len(extra_in_registry)}")
    print("="*70)


def get_page_label(page_num: int) -> str:
    """Get descriptive label for known pages."""
    labels = {
        1: " - Cover Page",
        2: " - Transmittal Letter",
        3: " - Table of Contents",
        # Add more as needed
    }
    return labels.get(page_num, "")


def format_page_list(pages: List[int]) -> str:
    """Format list of page numbers as string."""
    if len(pages) == 1:
        return str(pages[0])
    elif len(pages) <= 3:
        return ", ".join(map(str, pages))
    else:
        return f"{pages[0]}, {pages[1]}, ... {pages[-1]}"


def main():
    """Main execution function."""
    print("\n" + "="*70)
    print("FIELD COMPARISON TOOL")
    print("Word HTML Template vs fieldRegistry.ts")
    print("="*70 + "\n")

    # Step 1: Extract fields from Word HTML
    fields_by_page, total_pages = extract_fields_from_html(HTML_FILE)

    # Step 2: Extract fields from fieldRegistry.ts
    registry_fields = extract_fields_from_registry(FIELD_REGISTRY_FILE)

    # Step 3: Generate comparison report
    generate_report(fields_by_page, total_pages, registry_fields, OUTPUT_FILE)

    print("\n✅ Complete! Check the report for detailed comparison.")


if __name__ == "__main__":
    main()
