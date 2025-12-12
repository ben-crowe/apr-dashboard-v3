#!/usr/bin/env python3
"""
Add Missing Boilerplate to Report Template

Adds the 7 missing confirmed boilerplate blocks to reportHtmlTemplate.ts
in the appropriate sections.

Author: Python Pro
Date: 2025-12-11
"""

from pathlib import Path
from typing import Dict, Tuple
import re


# Define the 7 missing boilerplate blocks with their content and target sections
BOILERPLATE_BLOCKS = {
    'MG2': {
        'text': 'The subject property comprises an income generating asset and as such, we consider the inclusion of this approach warranted.',
        'section': 'income_approach_intro',
        'insert_after': 'Income Approach Methodology',
    },
    'MK3': {
        'text': 'In undertaking this approach, we have relied on the Direct Capitalization method only as the Discounted Cash Flow method does not contribute substantially to estimating the market value of the subject property beyond the Direct Capitalization method.',
        'section': 'income_approach_methodology',
        'insert_after': 'Direct Capitalization Method',
    },
    'MK4': {
        'text': 'In undertaking this approach, we have relied on the Discounted Cash Flow (DCF) method only as the Direct Capitalization method does not contribute substantially to estimating the market value of the subject property beyond the DCF analysis.',
        'section': 'income_approach_methodology',
        'insert_after': 'Direct Capitalization Method',
        'note': 'Alternative to MK3 - use based on methodology'
    },
    'MA5': {
        'text': 'The Cost Approach has limited applicability due to the age of the improvements and lack of market based data to support an estimate of accrued depreciation. Based on the preceding information, the Cost Approach will not be presented.',
        'section': 'approaches_to_value',
        'insert_after': 'Approaches to Value',
    },
    'MC5': {
        'text': 'The Cost Approach has limited applicability due to the age of the improvements and lack of market based data to support an estimate of accrued depreciation. Based on the preceding information, the Cost Approach has not been undertaken as part of this analysis.',
        'section': 'approaches_to_value',
        'insert_after': 'Approaches to Value',
        'note': 'Alternative to MA5 - use based on approach selection'
    },
    'CV8': {
        'text': 'Ownership of the subject property has not changed in the past three years. We are unaware of any pending sales or listing activity relating to the subject property.',
        'section': 'property_history',
        'insert_after': 'Property History|Prior Sales|Ownership',
    },
    'CV10': {
        'text': 'Ownership of the subject property has not changed in the past three years, however the property is currently listed for sale for . We are unaware of any pending sales or listing activity relating to the subject property.',
        'section': 'property_history',
        'insert_after': 'Property History|Prior Sales|Ownership',
        'note': 'Alternative to CV8 - use when property is listed'
    },
}


def add_income_approach_boilerplate(lines: list, block_id: str, block_info: dict) -> Tuple[list, bool]:
    """
    Add boilerplate to Income Approach section.

    Args:
        lines: Template file lines
        block_id: Boilerplate block ID
        block_info: Block information

    Returns:
        (modified_lines, success) tuple
    """
    # Find the Income Approach Methodology section
    for i, line in enumerate(lines):
        if 'Income Approach Methodology' in line and '<h3' in line:
            # Insert after the methodology paragraph
            # Look for the next narrative section
            for j in range(i + 1, min(i + 20, len(lines))):
                if '</p>' in lines[j] and 'site-narrative-text' in lines[j]:
                    # Insert new paragraph after this one
                    indent = '        '
                    new_lines = [
                        f'{indent}<p class="site-narrative-text" style="margin-top: 0.5rem;">\n',
                        f'{indent}  {block_info["text"]}\n',
                        f'{indent}</p>\n',
                    ]

                    lines[j+1:j+1] = new_lines
                    print(f"✅ Added {block_id} to Income Approach section at line {j+1}")
                    return (lines, True)

    print(f"⚠️  Could not find suitable location for {block_id}")
    return (lines, False)


def add_approaches_to_value_boilerplate(lines: list, block_id: str, block_info: dict) -> Tuple[list, bool]:
    """
    Add boilerplate to Approaches to Value section.

    Args:
        lines: Template file lines
        block_id: Boilerplate block ID
        block_info: Block information

    Returns:
        (modified_lines, success) tuple
    """
    # Find Approaches to Value section or Reconciliation section
    for i, line in enumerate(lines):
        if ('Approaches' in line or 'Reconciliation' in line) and ('<h2' in line or '<h3' in line):
            # Insert a new paragraph after the section heading
            for j in range(i + 1, min(i + 30, len(lines))):
                if '</p>' in lines[j] and ('narrative' in lines[j] or 'text' in lines[j]):
                    # Insert after first paragraph
                    indent = '        '
                    new_lines = [
                        f'{indent}<p class="site-narrative-text" style="margin-top: 0.5rem;">\n',
                        f'{indent}  {block_info["text"]}\n',
                        f'{indent}</p>\n',
                    ]

                    lines[j+1:j+1] = new_lines
                    print(f"✅ Added {block_id} to Approaches section at line {j+1}")
                    return (lines, True)

    # Alternative: Add to reconciliation conclusion
    for i, line in enumerate(lines):
        if 'Reconciliation' in line and 'Conclusion' in line:
            for j in range(i + 1, min(i + 20, len(lines))):
                if '<p' in lines[j] and ('narrative' in lines[j] or 'text' in lines[j]):
                    # Insert before reconciliation text
                    indent = '        '
                    new_lines = [
                        f'{indent}<p class="site-narrative-text" style="margin-bottom: 0.5rem;">\n',
                        f'{indent}  {block_info["text"]}\n',
                        f'{indent}</p>\n',
                        '\n',
                    ]

                    lines[j:j] = new_lines
                    print(f"✅ Added {block_id} to Reconciliation section at line {j}")
                    return (lines, True)

    print(f"⚠️  Could not find suitable location for {block_id}")
    return (lines, False)


def add_property_history_boilerplate(lines: list, block_id: str, block_info: dict) -> Tuple[list, bool]:
    """
    Add boilerplate to Property History section (or create it in Executive Summary).

    Args:
        lines: Template file lines
        block_id: Boilerplate block ID
        block_info: Block information

    Returns:
        (modified_lines, success) tuple
    """
    # Try to find property history section first
    for i, line in enumerate(lines):
        if any(keyword in line for keyword in ['Property History', 'Prior Sales', 'Sales History', 'Ownership']):
            if '<h' in line:
                # Found property history section - insert after heading
                for j in range(i + 1, min(i + 15, len(lines))):
                    if '<p' in lines[j] or '<div' in lines[j]:
                        indent = '        '
                        new_lines = [
                            f'{indent}<p class="site-narrative-text">\n',
                            f'{indent}  {block_info["text"]}\n',
                            f'{indent}</p>\n',
                        ]

                        lines[j:j] = new_lines
                        print(f"✅ Added {block_id} to Property History section at line {j}")
                        return (lines, True)

    # If no property history section, add to Executive Summary
    for i, line in enumerate(lines):
        if 'EXECUTIVE SUMMARY' in line.upper() and '<h' in line:
            # Look for the end of executive summary content
            for j in range(i + 1, min(i + 100, len(lines))):
                if '</div>' in lines[j] and 'executive' in lines[j - 10:j + 1].__str__().lower():
                    # Insert before closing div
                    indent = '        '
                    new_lines = [
                        '\n',
                        f'{indent}<h3 class="subsection-title">Property History</h3>\n',
                        f'{indent}<div class="site-narrative-section">\n',
                        f'{indent}  <p class="site-narrative-text">{block_info["text"]}</p>\n',
                        f'{indent}</div>\n',
                    ]

                    lines[j:j] = new_lines
                    print(f"✅ Added {block_id} to Executive Summary (Property History) at line {j}")
                    return (lines, True)

    print(f"⚠️  Could not find suitable location for {block_id}")
    return (lines, False)


def main() -> None:
    """Main workflow to add boilerplate blocks."""
    template_path = Path("/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/templates/reportHtmlTemplate.ts")
    backup_path = template_path.with_suffix('.ts.backup')

    print(f"📖 Reading template: {template_path.name}")

    # Create backup
    if not backup_path.exists():
        print(f"💾 Creating backup: {backup_path.name}")
        with open(template_path, 'r', encoding='utf-8') as f:
            backup_content = f.read()
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(backup_content)

    # Read template
    with open(template_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    print(f"   Loaded {len(lines)} lines\n")

    # Track modifications
    modified = False
    added_blocks = []

    # Process each boilerplate block
    print("📝 Adding boilerplate blocks...\n")

    # Add Income Approach blocks (MG2, MK3, MK4)
    for block_id in ['MG2', 'MK3']:
        block_info = BOILERPLATE_BLOCKS[block_id]
        lines, success = add_income_approach_boilerplate(lines, block_id, block_info)
        if success:
            added_blocks.append(block_id)
            modified = True

    # Add Approaches to Value blocks (MA5, MC5)
    for block_id in ['MA5']:
        block_info = BOILERPLATE_BLOCKS[block_id]
        lines, success = add_approaches_to_value_boilerplate(lines, block_id, block_info)
        if success:
            added_blocks.append(block_id)
            modified = True

    # Add Property History blocks (CV8)
    for block_id in ['CV8']:
        block_info = BOILERPLATE_BLOCKS[block_id]
        lines, success = add_property_history_boilerplate(lines, block_id, block_info)
        if success:
            added_blocks.append(block_id)
            modified = True

    # Write modified template
    if modified:
        print(f"\n💾 Writing modified template...")
        with open(template_path, 'w', encoding='utf-8') as f:
            f.writelines(lines)

        print(f"\n✅ Successfully added {len(added_blocks)} boilerplate blocks:")
        for block_id in added_blocks:
            print(f"   - {block_id}: {BOILERPLATE_BLOCKS[block_id]['text'][:60]}...")

        print(f"\n📌 Backup saved to: {backup_path.name}")
        print(f"📌 Modified template: {template_path.name}")

        print(f"\n⚠️  Note: The following blocks were NOT added (alternatives/conditional):")
        skipped = set(BOILERPLATE_BLOCKS.keys()) - set(added_blocks)
        for block_id in skipped:
            note = BOILERPLATE_BLOCKS[block_id].get('note', 'Skipped')
            print(f"   - {block_id}: {note}")
    else:
        print("\n❌ No modifications made - could not find suitable locations")

    print(f"\n✅ Script complete!")


if __name__ == "__main__":
    main()
