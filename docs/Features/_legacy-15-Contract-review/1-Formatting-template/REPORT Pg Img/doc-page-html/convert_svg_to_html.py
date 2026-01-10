#!/usr/bin/env python3
"""
SVG to HTML Page Converter - Improved Version

Converts high-quality SVG files to clean HTML pages matching the
page-sheet structure for APR report templates.

Usage:
    python3 convert_svg_to_html.py
"""

import xml.etree.ElementTree as ET
import re
from pathlib import Path


def parse_style_attribute(style_str):
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


def extract_text_from_element(text_elem, namespace):
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


def classify_element(style_dict, font_size_px):
    """Classify text element based on styling."""
    fill = style_dict.get('fill', 'black')
    font_family = style_dict.get('font-family', '')

    # Header detection
    is_large = font_size_px >= 58
    is_blue = '#003B7E' in fill or 'rgb(0,59,126)' in fill
    is_montserrat = 'Montserrat' in font_family

    if is_large and is_blue:
        if is_montserrat:
            return 'Header1'
        else:
            return 'Header2'

    return 'paragraph'


def clean_text(text):
    """Clean text content for HTML output."""
    # Decode HTML entities
    text = text.replace('&amp;', '&')
    text = text.replace('&quot;', '"')

    # Fix ligatures
    text = text.replace('ﬁ', 'fi')
    text = text.replace('ﬀ', 'ff')
    text = text.replace('ﬃ', 'ffi')
    text = text.replace('ﬂ', 'fl')

    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text)

    return text.strip()


def replace_property_data(text):
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

    return text


def convert_svg_to_html(svg_path, page_number):
    """Convert SVG file to HTML page structure."""
    # Parse SVG
    tree = ET.parse(svg_path)
    root = tree.getroot()
    namespace = 'http://www.w3.org/2000/svg'

    # Collect all text elements with metadata
    elements = []

    for text_elem in root.findall(f'.//{{{namespace}}}text'):
        # Get y position
        y_str = text_elem.get('y', '0')
        y_match = re.search(r'([\d.]+)', y_str)
        y_position = float(y_match.group(1)) if y_match else 0

        # Skip footer (y > 700) and page numbers
        if y_position > 700:
            continue

        # Get style
        style_str = text_elem.get('style', '')
        style_dict = parse_style_attribute(style_str)

        # Get font size
        font_size_str = style_dict.get('font-size', '0px')
        font_size_match = re.search(r'([\d.]+)', font_size_str)
        font_size = float(font_size_match.group(1)) if font_size_match else 0

        # Extract text
        text_content = extract_text_from_element(text_elem, namespace)
        if not text_content or len(text_content) < 2:
            continue

        # Classify element
        elem_type = classify_element(style_dict, font_size)

        elements.append({
            'y': y_position,
            'type': elem_type,
            'text': text_content
        })

    # Sort by y position
    elements.sort(key=lambda x: x['y'])

    # Build HTML
    html_lines = []
    html_lines.append(f'<div class="page-sheet" data-page-num="Page {page_number}">')

    # Process elements
    for elem in elements:
        text = clean_text(elem['text'])
        text = replace_property_data(text)

        if elem['type'] == 'Header1':
            html_lines.append(f'    <div class="Header1">{text}</div>')
            html_lines.append('')
        elif elem['type'] == 'Header2':
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

    return '\n'.join(html_lines)


def main():
    """Main conversion function."""
    # File paths
    svg_path = Path('/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-pages-svg-per/Ref.Report-VAL251012-North Battleford Apt.docx_39.svg')
    output_path = Path('/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-html/doc-pages-html-single/Page-39-FROM-SVG.html')

    print(f"Converting {svg_path.name}...")
    html_content = convert_svg_to_html(svg_path, 39)

    # Write output
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(html_content, encoding='utf-8')

    print(f"✓ Converted to {output_path.name}")
    print(f"\nContent preview:")
    print("-" * 80)
    print(html_content)
    print("-" * 80)


if __name__ == '__main__':
    main()
