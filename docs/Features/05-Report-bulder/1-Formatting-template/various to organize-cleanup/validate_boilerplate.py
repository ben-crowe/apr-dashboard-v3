#!/usr/bin/env python3
"""
Valcre Boilerplate Validation

Cross-references extracted boilerplate against HTML reference report to classify:
1. CONFIRMED BOILERPLATE - appears in reference report (static text)
2. CONDITIONAL - not in reference report (property-specific)
3. FIELD-POPULATED - contains placeholders or variable markers

Author: Python Pro
Date: 2025-12-11
"""

from pathlib import Path
from typing import Dict, List, Tuple, Set
from dataclasses import dataclass
from enum import Enum
import re
from html.parser import HTMLParser


class TextClassification(Enum):
    """Classification types for boilerplate text."""
    CONFIRMED = "CONFIRMED BOILERPLATE"
    CONDITIONAL = "CONDITIONAL"
    FIELD_POPULATED = "FIELD-POPULATED"


@dataclass
class TextBlock:
    """Represents a text block from boilerplate extraction."""
    source: str  # Cell reference or named range name
    text: str
    classification: TextClassification
    found_in_html: bool
    match_percentage: float
    notes: str


class HTMLTextExtractor(HTMLParser):
    """Extract readable text content from HTML."""

    def __init__(self):
        super().__init__()
        self.text_content: List[str] = []
        self.current_text = []

    def handle_data(self, data: str):
        """Collect text data from HTML."""
        cleaned = data.strip()
        if cleaned:
            self.current_text.append(cleaned)

    def get_text(self) -> str:
        """Return all extracted text as single string."""
        return ' '.join(self.current_text)


def extract_html_text(html_path: Path) -> str:
    """
    Extract text content from HTML file.

    Args:
        html_path: Path to HTML file

    Returns:
        Extracted text content
    """
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    parser = HTMLTextExtractor()
    parser.feed(html_content)
    return parser.get_text()


def parse_boilerplate_extraction(md_path: Path, min_length: int = 100) -> List[Tuple[str, str]]:
    """
    Parse BOILERPLATE-EXTRACTION.md and extract text blocks > min_length.

    Args:
        md_path: Path to boilerplate extraction markdown
        min_length: Minimum character length for text blocks

    Returns:
        List of (source_identifier, text_content) tuples
    """
    blocks: List[Tuple[str, str]] = []

    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by section markers (###)
    sections = re.split(r'\n###\s+', content)

    for section in sections:
        if not section.strip():
            continue

        lines = section.split('\n')
        if len(lines) < 2:
            continue

        # First line is the source (cell ref or range name)
        source = lines[0].strip()

        # Collect text until we hit --- or next section
        text_lines = []
        for line in lines[1:]:
            line = line.strip()
            if line == '---' or line.startswith('**'):
                break
            if line and not line.startswith('#'):
                text_lines.append(line)

        text = ' '.join(text_lines).strip()

        # Only include text blocks > min_length
        if len(text) >= min_length:
            blocks.append((source, text))

    return blocks


def detect_field_placeholders(text: str) -> bool:
    """
    Detect if text contains field placeholders or variable markers.

    Args:
        text: Text to analyze

    Returns:
        True if placeholders detected
    """
    # Common placeholder patterns
    placeholder_patterns = [
        r'\[.*?\]',           # [placeholder]
        r'\{.*?\}',           # {placeholder}
        r'<.*?>',             # <placeholder>
        r'__+',               # _____ (blank lines)
        r'\$\{.*?\}',         # ${variable}
        r'\b(TBD|N/A|XXX)\b', # Common placeholders
        r'\s{3,}',            # Multiple spaces (often for fill-ins)
    ]

    for pattern in placeholder_patterns:
        if re.search(pattern, text):
            return True

    return False


def find_text_in_html(text: str, html_text: str, threshold: float = 0.7) -> Tuple[bool, float]:
    """
    Search for text (or key phrases) in HTML content.

    Uses fuzzy matching - if threshold% of words match, consider it found.

    Args:
        text: Text block to search for
        html_text: HTML text content
        threshold: Minimum match percentage (0.0-1.0)

    Returns:
        (found, match_percentage) tuple
    """
    # Normalize both texts (lowercase, remove extra whitespace)
    text_normalized = ' '.join(text.lower().split())
    html_normalized = ' '.join(html_text.lower().split())

    # Exact match check first
    if text_normalized in html_normalized:
        return (True, 1.0)

    # Key phrase matching (extract phrases > 15 chars)
    words = text_normalized.split()

    # Try progressively smaller phrase sizes
    for phrase_size in [10, 7, 5, 3]:
        if len(words) < phrase_size:
            continue

        matches = 0
        total_phrases = len(words) - phrase_size + 1

        for i in range(total_phrases):
            phrase = ' '.join(words[i:i + phrase_size])
            if phrase in html_normalized:
                matches += 1

        match_percentage = matches / total_phrases if total_phrases > 0 else 0.0

        if match_percentage >= threshold:
            return (True, match_percentage)

    # No match found
    return (False, 0.0)


def classify_text_block(
    source: str,
    text: str,
    html_text: str
) -> TextBlock:
    """
    Classify a text block based on its characteristics.

    Args:
        source: Source identifier (cell ref or range name)
        text: Text content
        html_text: HTML reference text

    Returns:
        Classified TextBlock
    """
    # Check for field placeholders first
    has_placeholders = detect_field_placeholders(text)

    # Search for text in HTML
    found, match_pct = find_text_in_html(text, html_text)

    # Classify based on findings
    if has_placeholders:
        classification = TextClassification.FIELD_POPULATED
        notes = "Contains placeholders or variable markers"
    elif found:
        classification = TextClassification.CONFIRMED
        notes = f"Found in reference report (match: {match_pct:.1%})"
    else:
        classification = TextClassification.CONDITIONAL
        notes = "Not found in reference report - likely property-specific"

    return TextBlock(
        source=source,
        text=text,
        classification=classification,
        found_in_html=found,
        match_percentage=match_pct,
        notes=notes
    )


def write_validation_report(
    blocks: List[TextBlock],
    output_path: Path
) -> None:
    """
    Write validation report to markdown.

    Args:
        blocks: List of classified text blocks
        output_path: Output markdown file path
    """
    # Separate blocks by classification
    confirmed = [b for b in blocks if b.classification == TextClassification.CONFIRMED]
    conditional = [b for b in blocks if b.classification == TextClassification.CONDITIONAL]
    field_populated = [b for b in blocks if b.classification == TextClassification.FIELD_POPULATED]

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("# Valcre Boilerplate Validation Report\n\n")
        f.write(f"**Validation Date:** 2025-12-11\n")
        f.write(f"**Source:** BOILERPLATE-EXTRACTION.md\n")
        f.write(f"**Reference:** Ref.ReportVAL251012NorthBattlefordApt.docx.html\n\n")

        # Summary statistics
        f.write("## Summary Statistics\n\n")
        f.write(f"- **Total Blocks Analyzed:** {len(blocks)}\n")
        f.write(f"- **Confirmed Boilerplate:** {len(confirmed)} ({len(confirmed)/len(blocks)*100:.1f}%)\n")
        f.write(f"- **Conditional Text:** {len(conditional)} ({len(conditional)/len(blocks)*100:.1f}%)\n")
        f.write(f"- **Field-Populated:** {len(field_populated)} ({len(field_populated)/len(blocks)*100:.1f}%)\n\n")

        # Classification guide
        f.write("## Classification Guide\n\n")
        f.write("**CONFIRMED BOILERPLATE:** Static text that appears in all reports\n")
        f.write("- Found in reference HTML report\n")
        f.write("- No placeholders or variables\n")
        f.write("- Safe to use as template boilerplate\n\n")

        f.write("**CONDITIONAL:** Text that appears based on property type or selections\n")
        f.write("- Not found in reference report\n")
        f.write("- Likely specific to certain property types or configurations\n")
        f.write("- May require conditional logic in template\n\n")

        f.write("**FIELD-POPULATED:** Contains placeholders or variable data\n")
        f.write("- Has blank fields, brackets, or other placeholder markers\n")
        f.write("- Requires data binding in template\n\n")

        f.write("---\n\n")

        # Confirmed Boilerplate Section
        f.write("## ✅ CONFIRMED BOILERPLATE\n\n")
        f.write(f"**Count:** {len(confirmed)} blocks\n\n")
        f.write("Static text that appears in reference report - safe for template reuse.\n\n")

        for block in confirmed:
            f.write(f"### {block.source}\n\n")
            f.write(f"**Match:** {block.match_percentage:.1%}\n\n")
            f.write(f"{block.text}\n\n")
            f.write(f"*{block.notes}*\n\n")
            f.write("---\n\n")

        # Conditional Text Section
        f.write("## ⚠️ CONDITIONAL TEXT\n\n")
        f.write(f"**Count:** {len(conditional)} blocks\n\n")
        f.write("Text not found in reference report - likely property-specific or configuration-based.\n\n")

        for block in conditional:
            f.write(f"### {block.source}\n\n")
            f.write(f"{block.text}\n\n")
            f.write(f"*{block.notes}*\n\n")
            f.write("---\n\n")

        # Field-Populated Section
        f.write("## 📝 FIELD-POPULATED TEXT\n\n")
        f.write(f"**Count:** {len(field_populated)} blocks\n\n")
        f.write("Text containing placeholders or variable markers - requires data binding.\n\n")

        for block in field_populated:
            f.write(f"### {block.source}\n\n")
            f.write(f"{block.text}\n\n")
            f.write(f"*{block.notes}*\n\n")
            f.write("---\n\n")


def main() -> None:
    """Main validation workflow."""
    # Paths
    boilerplate_path = Path("/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/BOILERPLATE-EXTRACTION.md")
    html_path = Path("/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/North Battleford Apt -Report-content extracted copy/Ref.ReportVAL251012NorthBattlefordApt.docx.html")
    output_path = Path("/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/BOILERPLATE-VALIDATION.md")

    print("📖 Parsing boilerplate extraction (blocks > 100 chars)...")
    text_blocks = parse_boilerplate_extraction(boilerplate_path, min_length=100)
    print(f"   Found {len(text_blocks)} text blocks")

    print("\n🌐 Extracting text from HTML reference report...")
    html_text = extract_html_text(html_path)
    print(f"   Extracted {len(html_text):,} characters from HTML")

    print("\n🔍 Cross-referencing and classifying text blocks...")
    classified_blocks: List[TextBlock] = []

    for i, (source, text) in enumerate(text_blocks, 1):
        block = classify_text_block(source, text, html_text)
        classified_blocks.append(block)

        # Progress indicator
        if i % 10 == 0:
            print(f"   Processed {i}/{len(text_blocks)} blocks...")

    print(f"   ✅ Classified {len(classified_blocks)} blocks")

    # Statistics
    confirmed = sum(1 for b in classified_blocks if b.classification == TextClassification.CONFIRMED)
    conditional = sum(1 for b in classified_blocks if b.classification == TextClassification.CONDITIONAL)
    field_pop = sum(1 for b in classified_blocks if b.classification == TextClassification.FIELD_POPULATED)

    print("\n📊 Classification Summary:")
    print(f"   Confirmed Boilerplate: {confirmed} ({confirmed/len(classified_blocks)*100:.1f}%)")
    print(f"   Conditional Text: {conditional} ({conditional/len(classified_blocks)*100:.1f}%)")
    print(f"   Field-Populated: {field_pop} ({field_pop/len(classified_blocks)*100:.1f}%)")

    print(f"\n📝 Writing validation report to: {output_path.name}")
    write_validation_report(classified_blocks, output_path)

    print("\n✅ Validation complete!")
    print(f"   Output: {output_path}")


if __name__ == "__main__":
    main()
