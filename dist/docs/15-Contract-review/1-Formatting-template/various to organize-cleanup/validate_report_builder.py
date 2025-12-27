#!/usr/bin/env python3
"""
Report Builder Implementation Validator

Cross-references Report Builder implementation against:
1. BOILERPLATE-VALIDATION.md (8 confirmed boilerplate blocks)
2. Reference HTML output (Ref.ReportVAL251012NorthBattlefordApt.docx.html)

Determines: CORRECT / MISSING / WRONG / SALVAGEABLE

Author: Python Pro
Date: 2025-12-11
"""

from pathlib import Path
from typing import Dict, List, Tuple, Set
from dataclasses import dataclass
from enum import Enum
import re


class ValidationStatus(Enum):
    """Status of implementation validation."""
    CORRECT = "✅ CORRECT"
    MISSING = "❌ MISSING"
    WRONG = "⚠️ WRONG"
    PARTIAL = "🔸 PARTIAL"


@dataclass
class BoilerplateBlock:
    """Confirmed boilerplate text block."""
    source: str  # Cell reference or range name
    text: str
    match_pct: float


@dataclass
class ValidationResult:
    """Result of validating a specific aspect."""
    aspect: str
    status: ValidationStatus
    details: str
    priority: str  # HIGH / MEDIUM / LOW


def parse_confirmed_boilerplate(validation_md_path: Path) -> List[BoilerplateBlock]:
    """
    Extract the 8 confirmed boilerplate blocks from validation report.

    Args:
        validation_md_path: Path to BOILERPLATE-VALIDATION.md

    Returns:
        List of confirmed boilerplate blocks
    """
    blocks: List[BoilerplateBlock] = []

    with open(validation_md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find confirmed boilerplate section
    confirmed_section = re.search(
        r'## ✅ CONFIRMED BOILERPLATE.*?## ⚠️ CONDITIONAL TEXT',
        content,
        re.DOTALL
    )

    if not confirmed_section:
        return blocks

    section_text = confirmed_section.group(0)

    # Parse each block
    block_pattern = r'### ([^\n]+)\n\n\*\*Match:\*\* ([\d.]+)%\n\n(.*?)\n\n\*Found in reference report'

    for match in re.finditer(block_pattern, section_text, re.DOTALL):
        source = match.group(1).strip()
        match_pct = float(match.group(2))
        text = match.group(3).strip()

        blocks.append(BoilerplateBlock(
            source=source,
            text=text,
            match_pct=match_pct
        ))

    return blocks


def search_in_template_code(template_path: Path, search_text: str, context_lines: int = 2) -> List[Tuple[int, str]]:
    """
    Search for text in template code.

    Args:
        template_path: Path to template TypeScript file
        search_text: Text to search for
        context_lines: Number of context lines to return

    Returns:
        List of (line_number, context) tuples
    """
    matches: List[Tuple[int, str]] = []

    with open(template_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Normalize search text
    search_normalized = ' '.join(search_text.lower().split())

    # Search for matches
    for i, line in enumerate(lines):
        line_normalized = ' '.join(line.lower().split())

        if search_normalized in line_normalized:
            # Get context
            start = max(0, i - context_lines)
            end = min(len(lines), i + context_lines + 1)
            context = ''.join(lines[start:end])

            matches.append((i + 1, context))

    return matches


def extract_html_sections(html_path: Path) -> Dict[str, str]:
    """
    Extract key sections from reference HTML.

    Args:
        html_path: Path to reference HTML

    Returns:
        Dict mapping section name to content
    """
    sections: Dict[str, str] = {}

    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Look for key section markers
    # Executive Summary
    exec_match = re.search(
        r'EXECUTIVE SUMMARY.*?(?=<h[12]|$)',
        html_content,
        re.DOTALL | re.IGNORECASE
    )
    if exec_match:
        sections['Executive Summary'] = exec_match.group(0)[:1000]  # First 1000 chars

    # Income Approach
    income_match = re.search(
        r'INCOME (?:CAPITALIZATION )?APPROACH.*?(?=<h[12]|$)',
        html_content,
        re.DOTALL | re.IGNORECASE
    )
    if income_match:
        sections['Income Approach'] = income_match.group(0)[:1000]

    # Certification
    cert_match = re.search(
        r'CERTIFICATION.*?(?=<h[12]|$)',
        html_content,
        re.DOTALL | re.IGNORECASE
    )
    if cert_match:
        sections['Certification'] = cert_match.group(0)[:1000]

    return sections


def validate_confirmed_boilerplate(
    blocks: List[BoilerplateBlock],
    template_path: Path
) -> List[ValidationResult]:
    """
    Validate that confirmed boilerplate blocks are in template.

    Args:
        blocks: List of confirmed boilerplate blocks
        template_path: Path to template code

    Returns:
        List of validation results
    """
    results: List[ValidationResult] = []

    for block in blocks:
        # Search for block text in template
        # Try to find key phrases (first 50 chars)
        key_phrase = block.text[:50].strip()

        matches = search_in_template_code(template_path, key_phrase)

        if matches:
            status = ValidationStatus.CORRECT
            details = f"Found in template at line(s): {', '.join(str(m[0]) for m in matches)}"
            priority = "LOW"
        else:
            # Try shorter search (first 30 chars)
            short_phrase = block.text[:30].strip()
            short_matches = search_in_template_code(template_path, short_phrase)

            if short_matches:
                status = ValidationStatus.PARTIAL
                details = f"Partial match found at line(s): {', '.join(str(m[0]) for m in short_matches)}"
                priority = "MEDIUM"
            else:
                status = ValidationStatus.MISSING
                details = "Not found in template code"
                priority = "HIGH"

        results.append(ValidationResult(
            aspect=f"Boilerplate: {block.source}",
            status=status,
            details=details,
            priority=priority
        ))

    return results


def validate_section_structure(
    template_path: Path,
    html_sections: Dict[str, str]
) -> List[ValidationResult]:
    """
    Validate section structure against reference.

    Args:
        template_path: Path to template code
        html_sections: Dict of reference HTML sections

    Returns:
        List of validation results
    """
    results: List[ValidationResult] = []

    # Check for Executive Summary
    if 'Executive Summary' in html_sections:
        exec_matches = search_in_template_code(template_path, "executive summary")

        if exec_matches:
            results.append(ValidationResult(
                aspect="Executive Summary Section",
                status=ValidationStatus.CORRECT,
                details=f"Found at line(s): {', '.join(str(m[0]) for m in exec_matches)}",
                priority="LOW"
            ))
        else:
            results.append(ValidationResult(
                aspect="Executive Summary Section",
                status=ValidationStatus.MISSING,
                details="Section structure not found in template",
                priority="HIGH"
            ))

    # Check for Income Approach
    if 'Income Approach' in html_sections:
        income_matches = search_in_template_code(template_path, "income approach")

        if income_matches:
            results.append(ValidationResult(
                aspect="Income Approach Section",
                status=ValidationStatus.CORRECT,
                details=f"Found at line(s): {', '.join(str(m[0]) for m in income_matches)}",
                priority="LOW"
            ))
        else:
            results.append(ValidationResult(
                aspect="Income Approach Section",
                status=ValidationStatus.MISSING,
                details="Section structure not found in template",
                priority="HIGH"
            ))

    # Check for Certification
    if 'Certification' in html_sections:
        cert_matches = search_in_template_code(template_path, "certification")

        if cert_matches:
            results.append(ValidationResult(
                aspect="Certification Section",
                status=ValidationStatus.CORRECT,
                details=f"Found at line(s): {', '.join(str(m[0]) for m in cert_matches)}",
                priority="LOW"
            ))
        else:
            results.append(ValidationResult(
                aspect="Certification Section",
                status=ValidationStatus.MISSING,
                details="Section structure not found in template",
                priority="HIGH"
            ))

    return results


def write_validation_report(
    boilerplate_results: List[ValidationResult],
    structure_results: List[ValidationResult],
    output_path: Path
) -> None:
    """
    Write validation report to markdown.

    Args:
        boilerplate_results: Boilerplate validation results
        structure_results: Structure validation results
        output_path: Output markdown path
    """
    all_results = boilerplate_results + structure_results

    # Categorize results
    correct = [r for r in all_results if r.status == ValidationStatus.CORRECT]
    partial = [r for r in all_results if r.status == ValidationStatus.PARTIAL]
    missing = [r for r in all_results if r.status == ValidationStatus.MISSING]
    wrong = [r for r in all_results if r.status == ValidationStatus.WRONG]

    # Calculate salvageability
    total = len(all_results)
    correct_pct = len(correct) / total * 100 if total > 0 else 0
    salvageable = correct_pct >= 50

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("# Report Builder Implementation Validation\n\n")
        f.write(f"**Validation Date:** 2025-12-11\n")
        f.write(f"**Template Code:** `/src/features/report-builder/templates/reportHtmlTemplate.ts`\n")
        f.write(f"**Reference:** North Battleford HTML Report\n")
        f.write(f"**Boilerplate Reference:** BOILERPLATE-VALIDATION.md\n\n")

        # Summary
        f.write("## Executive Summary\n\n")
        f.write(f"**Total Checks:** {total}\n")
        f.write(f"**✅ Correct:** {len(correct)} ({len(correct)/total*100:.1f}%)\n")
        f.write(f"**🔸 Partial:** {len(partial)} ({len(partial)/total*100:.1f}%)\n")
        f.write(f"**❌ Missing:** {len(missing)} ({len(missing)/total*100:.1f}%)\n")
        f.write(f"**⚠️ Wrong:** {len(wrong)} ({len(wrong)/total*100:.1f}%)\n\n")

        # Verdict
        f.write("## Verdict\n\n")
        if salvageable:
            f.write(f"**🟢 SALVAGEABLE** ({correct_pct:.1f}% correct)\n\n")
            f.write("The existing implementation has a solid foundation and can be incrementally improved.\n")
            f.write("Focus on fixing MISSING and PARTIAL items rather than rebuilding from scratch.\n\n")
        else:
            f.write(f"**🔴 REBUILD RECOMMENDED** ({correct_pct:.1f}% correct)\n\n")
            f.write("The existing implementation has significant gaps. Consider rebuilding key sections.\n\n")

        # What's Working
        f.write("## ✅ What's Working Correctly\n\n")
        if correct:
            for result in correct:
                f.write(f"### {result.aspect}\n\n")
                f.write(f"{result.details}\n\n")
                f.write("---\n\n")
        else:
            f.write("*No fully correct implementations found*\n\n")

        # What's Partial
        f.write("## 🔸 What's Partially Implemented\n\n")
        if partial:
            for result in partial:
                f.write(f"### {result.aspect}\n\n")
                f.write(f"**Priority:** {result.priority}\n\n")
                f.write(f"{result.details}\n\n")
                f.write("---\n\n")
        else:
            f.write("*No partial implementations found*\n\n")

        # What's Missing
        f.write("## ❌ What's Missing\n\n")
        if missing:
            for result in missing:
                f.write(f"### {result.aspect}\n\n")
                f.write(f"**Priority:** {result.priority}\n\n")
                f.write(f"{result.details}\n\n")
                f.write("---\n\n")
        else:
            f.write("*No missing implementations*\n\n")

        # Priority Fixes
        f.write("## 🔧 Priority Fixes\n\n")
        high_priority = [r for r in all_results if r.priority == "HIGH"]

        if high_priority:
            f.write("**HIGH PRIORITY:**\n\n")
            for result in high_priority:
                f.write(f"- **{result.aspect}**: {result.details}\n")
            f.write("\n")

        medium_priority = [r for r in all_results if r.priority == "MEDIUM"]
        if medium_priority:
            f.write("**MEDIUM PRIORITY:**\n\n")
            for result in medium_priority:
                f.write(f"- **{result.aspect}**: {result.details}\n")
            f.write("\n")


def main() -> None:
    """Main validation workflow."""
    # Paths
    validation_md = Path("/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/BOILERPLATE-VALIDATION.md")
    template_ts = Path("/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/templates/reportHtmlTemplate.ts")
    reference_html = Path("/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/North Battleford Apt -Report-content extracted copy/Ref.ReportVAL251012NorthBattlefordApt.docx.html")
    output_md = Path("/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/REPORT-BUILDER-VALIDATION.md")

    print("📖 Parsing confirmed boilerplate blocks...")
    boilerplate_blocks = parse_confirmed_boilerplate(validation_md)
    print(f"   Found {len(boilerplate_blocks)} confirmed boilerplate blocks")

    print("\n🔍 Validating boilerplate in template code...")
    boilerplate_results = validate_confirmed_boilerplate(boilerplate_blocks, template_ts)

    print("\n🌐 Extracting reference HTML sections...")
    html_sections = extract_html_sections(reference_html)
    print(f"   Extracted {len(html_sections)} key sections")

    print("\n📐 Validating section structure...")
    structure_results = validate_section_structure(template_ts, html_sections)

    print("\n📊 Summary:")
    all_results = boilerplate_results + structure_results
    correct = sum(1 for r in all_results if r.status == ValidationStatus.CORRECT)
    partial = sum(1 for r in all_results if r.status == ValidationStatus.PARTIAL)
    missing = sum(1 for r in all_results if r.status == ValidationStatus.MISSING)

    print(f"   ✅ Correct: {correct}/{len(all_results)}")
    print(f"   🔸 Partial: {partial}/{len(all_results)}")
    print(f"   ❌ Missing: {missing}/{len(all_results)}")

    print(f"\n📝 Writing validation report...")
    write_validation_report(boilerplate_results, structure_results, output_md)

    print(f"\n✅ Validation complete!")
    print(f"   Output: {output_md}")


if __name__ == "__main__":
    main()
