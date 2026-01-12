#!/usr/bin/env python3
"""
Automated Report Comparison Tool

Compares generated Report Builder HTML against Valcre reference HTML.
Identifies differences, missing content, and validates field values.

Author: Python Pro
Date: 2025-12-11
"""

from pathlib import Path
from typing import Dict, List, Tuple, Set
from bs4 import BeautifulSoup
import re
from difflib import SequenceMatcher
import json


# ============================================================================
# CONFIGURATION
# ============================================================================

REFERENCE_HTML = Path("/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/North Battleford Apt -Report-content extracted copy/Ref.ReportVAL251012NorthBattlefordApt.docx.html")
GENERATED_HTML = Path("/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/Valcre Workbook/generated-report.html")
OUTPUT_REPORT = Path("/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/AUTOMATED-COMPARISON-REPORT.md")

# Key field values to verify (from North Battleford workbook)
EXPECTED_FIELD_VALUES = {
    'property_name': '1101 & 1121 - 109 Street',
    'city': 'North Battleford',
    'province': 'Saskatchewan',
    'property_type': 'Apartment',
    'client_name': 'Concentra Bank',
    'file_number': 'VAL251012',
    'units': '24',  # Total units
    'year_built': '1967',
}


# ============================================================================
# HTML PARSING FUNCTIONS
# ============================================================================

def load_html(file_path: Path) -> BeautifulSoup:
    """Load and parse HTML file."""
    print(f"📖 Loading HTML: {file_path.name}")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    return BeautifulSoup(content, 'html.parser')


def extract_text_blocks(soup: BeautifulSoup) -> List[Dict[str, str]]:
    """
    Extract meaningful text blocks from HTML.

    Returns list of dicts with:
    - text: The text content
    - tag: HTML tag type
    - classes: CSS classes
    - section: Inferred section name
    """
    blocks = []

    # Find all text-containing elements
    for elem in soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'td', 'li', 'div']):
        text = elem.get_text(strip=True)

        # Skip empty or very short blocks
        if not text or len(text) < 3:
            continue

        # Skip navigation/UI elements
        if any(skip in text.lower() for skip in ['click here', 'toggle', 'menu', 'nav']):
            continue

        # Infer section from headings or context
        section = infer_section(elem)

        blocks.append({
            'text': normalize_text(text),
            'tag': elem.name,
            'classes': elem.get('class', []),
            'section': section,
            'length': len(text)
        })

    return blocks


def infer_section(elem) -> str:
    """Infer section name from element context."""
    # Look for section headings in parents or siblings
    current = elem
    for _ in range(5):  # Look up to 5 parents
        if current.name in ['h1', 'h2', 'h3']:
            return current.get_text(strip=True)

        # Check for section markers in classes
        classes = current.get('class', [])
        if classes:
            for cls in classes:
                if 'section' in cls.lower():
                    return cls

        current = current.parent
        if not current:
            break

    return 'Unknown'


def normalize_text(text: str) -> str:
    """Normalize text for comparison."""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove special characters that might differ
    text = text.strip()
    return text


def extract_images(soup: BeautifulSoup) -> List[Dict[str, str]]:
    """Extract all image references."""
    images = []
    for img in soup.find_all('img'):
        images.append({
            'src': img.get('src', ''),
            'alt': img.get('alt', ''),
            'classes': img.get('class', []),
            'context': get_image_context(img)
        })
    return images


def get_image_context(img) -> str:
    """Get context around image (parent heading, etc.)."""
    current = img.parent
    for _ in range(3):
        if not current:
            break
        if current.name in ['h1', 'h2', 'h3', 'h4']:
            return current.get_text(strip=True)
        current = current.parent
    return 'Unknown context'


# ============================================================================
# COMPARISON FUNCTIONS
# ============================================================================

def compare_text_blocks(reference_blocks: List[Dict], generated_blocks: List[Dict]) -> Dict:
    """
    Compare text blocks between reference and generated HTML.

    Returns:
    - matches: List of matching blocks
    - missing: Blocks in reference but not in generated
    - extra: Blocks in generated but not in reference
    - different: Blocks that exist but have different content
    """
    results = {
        'matches': [],
        'missing': [],
        'extra': [],
        'different': []
    }

    # Create text lookup for fast matching
    ref_texts = {b['text']: b for b in reference_blocks}
    gen_texts = {b['text']: b for b in generated_blocks}

    # Find exact matches
    for text in ref_texts:
        if text in gen_texts:
            results['matches'].append({
                'text': text,
                'section': ref_texts[text]['section']
            })

    # Find missing (in reference but not generated)
    for text, block in ref_texts.items():
        if text not in gen_texts:
            # Check for partial match
            best_match = find_best_match(text, list(gen_texts.keys()))
            if best_match and best_match['similarity'] > 0.7:
                results['different'].append({
                    'expected': text,
                    'actual': best_match['text'],
                    'similarity': best_match['similarity'],
                    'section': block['section']
                })
            else:
                results['missing'].append({
                    'text': text,
                    'section': block['section'],
                    'length': block['length']
                })

    # Find extra (in generated but not reference)
    for text, block in gen_texts.items():
        if text not in ref_texts:
            # Only flag if not already caught as different
            is_different = any(d['actual'] == text for d in results['different'])
            if not is_different:
                results['extra'].append({
                    'text': text,
                    'section': block['section'],
                    'length': block['length']
                })

    return results


def find_best_match(text: str, candidates: List[str]) -> Dict:
    """Find best matching text from candidates."""
    best_match = None
    best_ratio = 0.0

    for candidate in candidates:
        ratio = SequenceMatcher(None, text, candidate).ratio()
        if ratio > best_ratio:
            best_ratio = ratio
            best_match = candidate

    if best_match and best_ratio > 0.5:
        return {'text': best_match, 'similarity': best_ratio}
    return None


def compare_images(reference_images: List[Dict], generated_images: List[Dict]) -> Dict:
    """Compare image references."""
    return {
        'reference_count': len(reference_images),
        'generated_count': len(generated_images),
        'difference': len(reference_images) - len(generated_images),
        'missing': find_missing_images(reference_images, generated_images),
        'extra': find_extra_images(reference_images, generated_images)
    }


def find_missing_images(reference: List[Dict], generated: List[Dict]) -> List[Dict]:
    """Find images in reference but not in generated."""
    ref_contexts = {img['context'] for img in reference}
    gen_contexts = {img['context'] for img in generated}

    missing = []
    for img in reference:
        if img['context'] not in gen_contexts:
            missing.append({
                'context': img['context'],
                'alt': img['alt'],
                'src': img['src'][:50]  # Truncate long paths
            })

    return missing


def find_extra_images(reference: List[Dict], generated: List[Dict]) -> List[Dict]:
    """Find images in generated but not in reference."""
    ref_contexts = {img['context'] for img in reference}
    gen_contexts = {img['context'] for img in generated}

    extra = []
    for img in generated:
        if img['context'] not in ref_contexts:
            extra.append({
                'context': img['context'],
                'alt': img['alt'],
                'src': img['src'][:50]
            })

    return extra


def verify_field_values(soup: BeautifulSoup, expected: Dict[str, str]) -> Dict:
    """Verify expected field values appear in generated HTML."""
    html_text = soup.get_text()

    results = {
        'found': [],
        'missing': [],
        'incorrect': []
    }

    for field_name, expected_value in expected.items():
        if expected_value in html_text:
            results['found'].append({
                'field': field_name,
                'value': expected_value,
                'status': 'FOUND'
            })
        else:
            # Check for partial/fuzzy match
            pattern = re.escape(expected_value)
            if re.search(pattern, html_text, re.IGNORECASE):
                results['found'].append({
                    'field': field_name,
                    'value': expected_value,
                    'status': 'FOUND (case mismatch)'
                })
            else:
                results['missing'].append({
                    'field': field_name,
                    'expected': expected_value
                })

    return results


# ============================================================================
# REPORT GENERATION
# ============================================================================

def generate_comparison_report(
    text_comparison: Dict,
    image_comparison: Dict,
    field_verification: Dict,
    output_path: Path
) -> None:
    """Generate comprehensive comparison report in Markdown."""

    # Calculate statistics
    total_blocks = (
        len(text_comparison['matches']) +
        len(text_comparison['missing']) +
        len(text_comparison['different'])
    )

    match_percentage = 0 if total_blocks == 0 else (
        len(text_comparison['matches']) / total_blocks * 100
    )

    report_lines = []

    # Header
    from datetime import datetime
    report_lines.append("# Automated Report Comparison")
    report_lines.append("")
    report_lines.append(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    report_lines.append(f"**Reference:** `Ref.ReportVAL251012NorthBattlefordApt.docx.html`")
    report_lines.append("")

    # Executive Summary
    report_lines.append("## Executive Summary")
    report_lines.append("")
    report_lines.append(f"**Overall Match:** {match_percentage:.1f}%")
    report_lines.append("")
    report_lines.append("| Metric | Reference | Generated | Status |")
    report_lines.append("|--------|-----------|-----------|--------|")
    report_lines.append(f"| Text Blocks | {len(text_comparison['matches']) + len(text_comparison['missing'])} | {len(text_comparison['matches']) + len(text_comparison['extra'])} | {'✅' if len(text_comparison['missing']) == 0 else '⚠️'} |")
    report_lines.append(f"| Images | {image_comparison['reference_count']} | {image_comparison['generated_count']} | {'✅' if image_comparison['difference'] == 0 else '⚠️'} |")
    report_lines.append(f"| Field Values | {len(EXPECTED_FIELD_VALUES)} | {len(field_verification['found'])} | {'✅' if len(field_verification['missing']) == 0 else '⚠️'} |")
    report_lines.append("")

    # Text Block Analysis
    report_lines.append("## Text Block Analysis")
    report_lines.append("")
    report_lines.append(f"- ✅ **Matches:** {len(text_comparison['matches'])} blocks")
    report_lines.append(f"- ❌ **Missing:** {len(text_comparison['missing'])} blocks")
    report_lines.append(f"- ⚠️ **Different:** {len(text_comparison['different'])} blocks")
    report_lines.append(f"- ➕ **Extra:** {len(text_comparison['extra'])} blocks")
    report_lines.append("")

    # Missing Content
    if text_comparison['missing']:
        report_lines.append("### Missing Content (in Reference, not in Generated)")
        report_lines.append("")
        for i, block in enumerate(text_comparison['missing'][:20], 1):  # Limit to 20
            report_lines.append(f"**{i}. Section:** {block['section']}")
            report_lines.append(f"   - Text: `{block['text'][:100]}{'...' if len(block['text']) > 100 else ''}`")
            report_lines.append(f"   - Length: {block['length']} chars")
            report_lines.append("")

        if len(text_comparison['missing']) > 20:
            report_lines.append(f"*... and {len(text_comparison['missing']) - 20} more*")
            report_lines.append("")

    # Different Content
    if text_comparison['different']:
        report_lines.append("### Different Content (Similar but not Exact)")
        report_lines.append("")
        for i, diff in enumerate(text_comparison['different'][:15], 1):  # Limit to 15
            report_lines.append(f"**{i}. Section:** {diff['section']} (Similarity: {diff['similarity']:.0%})")
            report_lines.append(f"   - Expected: `{diff['expected'][:80]}...`")
            report_lines.append(f"   - Actual: `{diff['actual'][:80]}...`")
            report_lines.append("")

        if len(text_comparison['different']) > 15:
            report_lines.append(f"*... and {len(text_comparison['different']) - 15} more*")
            report_lines.append("")

    # Extra Content
    if text_comparison['extra']:
        report_lines.append("### Extra Content (in Generated, not in Reference)")
        report_lines.append("")
        for i, block in enumerate(text_comparison['extra'][:10], 1):  # Limit to 10
            report_lines.append(f"**{i}. Section:** {block['section']}")
            report_lines.append(f"   - Text: `{block['text'][:100]}{'...' if len(block['text']) > 100 else ''}`")
            report_lines.append("")

        if len(text_comparison['extra']) > 10:
            report_lines.append(f"*... and {len(text_comparison['extra']) - 10} more*")
            report_lines.append("")

    # Image Analysis
    report_lines.append("## Image Analysis")
    report_lines.append("")
    report_lines.append(f"- Reference: {image_comparison['reference_count']} images")
    report_lines.append(f"- Generated: {image_comparison['generated_count']} images")
    report_lines.append(f"- Difference: {image_comparison['difference']} images")
    report_lines.append("")

    if image_comparison['missing']:
        report_lines.append("### Missing Images")
        report_lines.append("")
        for img in image_comparison['missing'][:10]:
            report_lines.append(f"- **Context:** {img['context']}")
            report_lines.append(f"  - Alt: {img['alt']}")
            report_lines.append("")

    # Field Value Verification
    report_lines.append("## Field Value Verification")
    report_lines.append("")

    if field_verification['found']:
        report_lines.append("### ✅ Found Values")
        report_lines.append("")
        for field in field_verification['found']:
            status_icon = "✅" if field['status'] == 'FOUND' else "⚠️"
            report_lines.append(f"- {status_icon} **{field['field']}:** `{field['value']}` ({field['status']})")
        report_lines.append("")

    if field_verification['missing']:
        report_lines.append("### ❌ Missing Values")
        report_lines.append("")
        for field in field_verification['missing']:
            report_lines.append(f"- **{field['field']}:** Expected `{field['expected']}`")
        report_lines.append("")

    # Actionable Fixes
    report_lines.append("## Actionable Fixes")
    report_lines.append("")

    fixes = []
    if text_comparison['missing']:
        fixes.append(f"1. **Add Missing Content:** {len(text_comparison['missing'])} text blocks from reference are missing")
    if text_comparison['different']:
        fixes.append(f"2. **Fix Different Content:** {len(text_comparison['different'])} blocks have differences")
    if image_comparison['missing']:
        fixes.append(f"3. **Add Missing Images:** {len(image_comparison['missing'])} images missing")
    if field_verification['missing']:
        fixes.append(f"4. **Populate Missing Fields:** {len(field_verification['missing'])} field values not found")

    if fixes:
        for fix in fixes:
            report_lines.append(fix)
    else:
        report_lines.append("✅ **No fixes needed!** Generated report matches reference.")

    report_lines.append("")

    # Write report
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(report_lines))

    print(f"✅ Report generated: {output_path.name}")


# ============================================================================
# MAIN WORKFLOW
# ============================================================================

def main() -> None:
    """Main comparison workflow."""
    print("\n" + "="*70)
    print("AUTOMATED REPORT COMPARISON")
    print("="*70 + "\n")

    # Check if generated HTML exists
    if not GENERATED_HTML.exists():
        print("❌ Generated HTML not found. Please run:")
        print("   node generate_and_compare.js")
        print("")
        return

    # Load both HTMLs
    print("📊 Analyzing Reference HTML...")
    ref_soup = load_html(REFERENCE_HTML)
    ref_blocks = extract_text_blocks(ref_soup)
    ref_images = extract_images(ref_soup)
    print(f"   - Text blocks: {len(ref_blocks)}")
    print(f"   - Images: {len(ref_images)}")
    print("")

    print("📊 Analyzing Generated HTML...")
    gen_soup = load_html(GENERATED_HTML)
    gen_blocks = extract_text_blocks(gen_soup)
    gen_images = extract_images(gen_soup)
    print(f"   - Text blocks: {len(gen_blocks)}")
    print(f"   - Images: {len(gen_images)}")
    print("")

    # Run comparisons
    print("🔍 Comparing content...")
    text_comparison = compare_text_blocks(ref_blocks, gen_blocks)
    image_comparison = compare_images(ref_images, gen_images)
    field_verification = verify_field_values(gen_soup, EXPECTED_FIELD_VALUES)
    print("")

    # Generate full report
    print("📝 Generating Comparison Report...")
    generate_comparison_report(
        text_comparison,
        image_comparison,
        field_verification,
        OUTPUT_REPORT
    )

    # Calculate and display summary
    total_blocks = (
        len(text_comparison['matches']) +
        len(text_comparison['missing']) +
        len(text_comparison['different'])
    )
    match_percentage = 0 if total_blocks == 0 else (
        len(text_comparison['matches']) / total_blocks * 100
    )

    print("")
    print("="*70)
    print("COMPARISON SUMMARY")
    print("="*70)
    print(f"Match Percentage: {match_percentage:.1f}%")
    print(f"Matches: {len(text_comparison['matches'])}")
    print(f"Missing: {len(text_comparison['missing'])}")
    print(f"Different: {len(text_comparison['different'])}")
    print(f"Extra: {len(text_comparison['extra'])}")
    print("="*70)
    print("")
    print(f"✅ Full report: {OUTPUT_REPORT.name}")
    print("\n" + "="*70 + "\n")


if __name__ == "__main__":
    main()
