#!/usr/bin/env python3
"""
SVG to HTML Batch Converter - Pages 35-40
Improved version with paragraph merging and better content extraction.
"""

import xml.etree.ElementTree as ET
import re
from pathlib import Path
from typing import List, Dict


def parse_style_attribute(style_str: str) -> Dict[str, str]:
    """Parse CSS style attribute into dictionary."""
    style_dict = {}
    if not style_str:
        return style_dict

    pairs = style_str.split(';')
    for pair in pairs:
        if ':' in pair:
            key, value = pair.split(':', 1)
            style_dict[key.strip()] = value.strip()

    return style_dict


def extract_text_from_element(text_elem, namespace: str) -> str:
    """Extract complete text from a text element including tspans."""
    parts = []

    # Get initial character
    if text_elem.text:
        parts.append(text_elem.text)

    # Get tspan content
    for tspan in text_elem.findall(f'{{{namespace}}}tspan'):
        if tspan.text:
            parts.append(tspan.text)
        if tspan.tail:
            parts.append(tspan.tail)

    # Join all parts
    full_text = ''.join(parts)

    # Clean up whitespace but preserve structure
    full_text = re.sub(r'\s+', ' ', full_text)

    return full_text.strip()


def extract_y_position(y_str: str) -> float:
    """Extract numeric y position from SVG coordinate string."""
    y_match = re.search(r'([\d.]+)', y_str)
    return float(y_match.group(1)) if y_match else 0


def extract_font_size(style_dict: Dict[str, str]) -> float:
    """Extract font size in pixels from style dictionary."""
    font_size_str = style_dict.get('font-size', '0px')
    font_size_match = re.search(r'([\d.]+)', font_size_str)
    return float(font_size_match.group(1)) if font_size_match else 0


def is_header(style_dict: Dict[str, str], font_size_px: float) -> str:
    """Determine if element is a header and what type."""
    fill = style_dict.get('fill', 'black')
    font_family = style_dict.get('font-family', '')

    # Large header (58-66px, blue)
    if font_size_px >= 46:
        if '#003B7E' in fill or 'rgb(0,59,126)' in fill or 'rgb(10,61,98)' in fill:
            return 'Header1'

    # Montserrat light (section headers)
    if 'Montserrat' in font_family and font_size_px >= 50:
        return 'Header2'

    return ''


def should_merge_lines(line1: Dict, line2: Dict) -> bool:
    """Determine if two lines should be merged into same paragraph."""
    text1 = line1['text']
    y1 = line1['y']
    y2 = line2['y']

    # Don't merge headers
    if line1.get('type') or line2.get('type'):
        return False

    # Check y-position gap (lines in same paragraph are ~56-57px apart)
    y_gap = abs(y2 - y1)

    # Large gap = definitely new paragraph
    if y_gap > 80:
        return False

    # Don't merge if line1 ends with sentence-ending punctuation AND there's a gap
    # This indicates a paragraph break (period + newline)
    if text1.rstrip().endswith(('.', '!', '?')) and y_gap > 50:
        return False

    # Normal paragraph line spacing - merge these lines
    if y_gap < 70:
        return True

    return False


def clean_text(text: str) -> str:
    """Clean text content for HTML output."""
    # Fix ligatures
    text = text.replace('ﬁ', 'fi')
    text = text.replace('ﬀ', 'ff')
    text = text.replace('ﬃ', 'ffi')
    text = text.replace('ﬂ', 'fl')

    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text)

    return text.strip()


def replace_property_data(text: str) -> str:
    """Replace hardcoded property-specific text with field IDs."""
    # Property addresses
    text = re.sub(
        r'1101,?\s*1121\s+109\s+St(?:reet)?,?\s*North\s+Battleford(?:,\s*Saskatchewan)?',
        '{{Subject_Street}}',
        text,
        flags=re.IGNORECASE
    )

    # File numbers
    text = re.sub(
        r'VAL251012',
        '{{Company_JobNumber}}',
        text,
        flags=re.IGNORECASE
    )

    # City name
    text = re.sub(
        r'North\s+Battleford',
        '{{Subject_City}}',
        text,
        flags=re.IGNORECASE
    )

    return text


def merge_paragraphs(elements: List[Dict]) -> List[Dict]:
    """Merge continuation lines into proper paragraphs."""
    if not elements:
        return []

    merged = []
    current_para = None

    for elem in elements:
        # Headers never merge
        if elem.get('type'):
            if current_para:
                merged.append(current_para)
                current_para = None
            merged.append(elem)
            continue

        # Start new paragraph or merge with current
        if current_para is None:
            current_para = elem.copy()
        elif should_merge_lines(current_para, elem):
            # Merge: add space and continuation text
            current_para['text'] += ' ' + elem['text']
            current_para['y_end'] = elem['y']
        else:
            # Don't merge: save current and start new
            merged.append(current_para)
            current_para = elem.copy()

    # Don't forget last paragraph
    if current_para:
        merged.append(current_para)

    return merged


def convert_svg_to_html(svg_path: Path, page_number: int) -> str:
    """Convert SVG file to HTML page structure."""
    # Parse SVG
    tree = ET.parse(svg_path)
    root = tree.getroot()
    namespace = 'http://www.w3.org/2000/svg'

    # Collect all text elements with metadata
    raw_elements = []

    for text_elem in root.findall(f'.//{{{namespace}}}text'):
        # Get y position
        y_str = text_elem.get('y', '0')
        y_position = extract_y_position(y_str)

        # Extract text first to check if it's footer content
        text_content = extract_text_from_element(text_elem, namespace)
        if not text_content:
            continue

        # Skip footer text (page numbers and address lines)
        # Footer typically contains page numbers or "File VAL..." text
        if y_position > 750 and (
            re.match(r'^\d+$', text_content.strip()) or  # Just a page number
            'File VAL' in text_content or
            '109 St' in text_content or
            'Saskatchewan' in text_content
        ):
            continue

        # Get style
        style_str = text_elem.get('style', '')
        style_dict = parse_style_attribute(style_str)

        # Get font size
        font_size = extract_font_size(style_dict)

        # Skip very short text unless it's part of a header (large font)
        if len(text_content) < 2 and font_size < 40:
            continue

        # Classify element
        elem_type = is_header(style_dict, font_size)

        raw_elements.append({
            'y': y_position,
            'type': elem_type,
            'text': text_content,
            'font_size': font_size
        })

    # Sort by y position
    raw_elements.sort(key=lambda x: x['y'])

    # Merge elements on same y-line (headers split across multiple text elements)
    elements = []
    current_line = None

    for elem in raw_elements:
        if current_line is None:
            current_line = elem.copy()
        elif abs(current_line['y'] - elem['y']) < 1:  # Same line (y within 1px)
            # Merge text on same line with space if needed
            # Check if we need a space between merged parts
            if current_line['text'] and elem['text']:
                # Add space if previous doesn't end with space and next doesn't start with space
                if not current_line['text'].endswith(' ') and not elem['text'].startswith(' '):
                    current_line['text'] += ' '
            current_line['text'] += elem['text']
            # Use most prominent type (Header1 > Header2 > paragraph)
            if elem.get('type') and not current_line.get('type'):
                current_line['type'] = elem['type']
        else:
            # New line
            elements.append(current_line)
            current_line = elem.copy()

    # Don't forget last line
    if current_line:
        elements.append(current_line)

    # Merge paragraphs
    merged_elements = merge_paragraphs(elements)

    # Build HTML
    html_lines = []
    html_lines.append(f'<!-- Page {page_number} -->')
    html_lines.append(f'<div class="page-sheet" data-page-num="Page {page_number}">')
    html_lines.append('')

    # Process elements
    for elem in merged_elements:
        text = clean_text(elem['text'])
        text = replace_property_data(text)

        if elem.get('type') == 'Header1':
            html_lines.append(f'    <div class="Header1">{text}</div>')
            html_lines.append('')
        elif elem.get('type') == 'Header2':
            html_lines.append(f'    <div class="Header2">{text.upper()}</div>')
            html_lines.append('')
        else:
            # Paragraph text
            html_lines.append(f'    <p>{text}</p>')
            html_lines.append('')

    # Add footer
    html_lines.append('    <div class="page-footer">')
    html_lines.append(f'        <div><span class="page-num">{page_number}</span> <span class="field-mapped" title="{{{{Subject_Street}}}}">{{{{Subject_Street}}}}</span> | File <span class="field-mapped" title="{{{{Company_JobNumber}}}}">{{{{Company_JobNumber}}}}</span></div>')
    html_lines.append('        <div class="footer-accent"></div>')
    html_lines.append('    </div>')
    html_lines.append('</div>')
    html_lines.append('')

    return '\n'.join(html_lines)


def main():
    """Convert pages 35-40 from SVG to HTML."""
    # Input directory
    svg_dir = Path('/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-pages-svg-per')

    # Output file
    output_path = Path('/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-html/doc-pages-html-formatted/Page-35-40-FROM-SVG.html')

    # Page numbers to process
    pages = [35, 36, 37, 38, 39, 40]

    print("Converting SVG pages to HTML...")
    print("-" * 80)

    all_html = []

    for page_num in pages:
        svg_file = svg_dir / f'Ref.Report-VAL251012-North Battleford Apt.docx_{page_num}.svg'

        if not svg_file.exists():
            print(f"⚠️  Page {page_num}: SVG file not found - {svg_file.name}")
            continue

        print(f"Processing Page {page_num}...")
        html_content = convert_svg_to_html(svg_file, page_num)
        all_html.append(html_content)
        print(f"✓ Page {page_num} converted")

    # Combine all pages
    final_html = '\n'.join(all_html)

    # Write output
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(final_html, encoding='utf-8')

    print("-" * 80)
    print(f"✓ All pages converted successfully!")
    print(f"Output: {output_path.name}")
    print(f"\nTotal pages: {len(all_html)}")
    print(f"Total size: {len(final_html):,} characters")

    # Show preview of first page
    print("\n" + "=" * 80)
    print("PREVIEW - Page 35:")
    print("=" * 80)
    lines = all_html[0].split('\n')
    for line in lines[:30]:
        print(line)
    if len(lines) > 30:
        print(f"... ({len(lines) - 30} more lines)")


if __name__ == '__main__':
    main()
