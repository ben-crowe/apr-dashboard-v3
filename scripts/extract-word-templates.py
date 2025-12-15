#!/usr/bin/env python3
"""
Extract HTML boilerplate templates from Word-exported HTML
Replaces <w:Sdt> field content with handlebar placeholders
"""

import re
import sys
from pathlib import Path

def extract_section(html_content, section_number):
    """Extract content from a specific WordSection div"""
    pattern = rf'<div class=WordSection{section_number}>(.*?)</div>\s*(?=<div class=WordSection|\s*</body>)'
    match = re.search(pattern, html_content, re.DOTALL)
    if match:
        return match.group(1)
    return None

def replace_sdt_fields(content):
    """Replace <w:Sdt> field content with handlebar placeholders"""

    # Pattern to match w:Sdt tags with Title attribute
    # Captures: Title value and inner content
    pattern = r'<w:Sdt[^>]*Title="([^"]*)"[^>]*>(.*?)</w:Sdt>'

    def replacer(match):
        title = match.group(1)
        inner_content = match.group(2)

        # Extract just the field name (before the first parenthesis)
        field_name = title.split('(')[0].strip()

        # Check if this contains an image
        if '<v:shape' in inner_content or '<v:imagedata' in inner_content or '<img' in inner_content:
            return f'[IMAGE: {{{{{field_name}}}}}]'

        # Otherwise, replace with handlebar placeholder
        return f'{{{{{field_name}}}}}'

    # Replace all w:Sdt tags
    result = re.sub(pattern, replacer, content, flags=re.DOTALL)

    return result

def create_template_html(section_content, title):
    """Wrap section content in clean HTML with print-ready CSS"""

    template = f'''<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{title}</title>
  <style>
    /* Print-ready CSS for template viewing */
    @page {{
      size: 8.5in 11in;
      margin: 0.75in;
    }}

    body {{
      font-family: "Open Sans", "Segoe UI", Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #000;
      background: white;
      margin: 0;
      padding: 20px;
    }}

    table {{
      border-collapse: collapse;
      width: 100%;
      margin: 10px 0;
    }}

    td {{
      vertical-align: top;
      padding: 0 5pt;
    }}

    p {{
      margin: 0 0 8pt 0;
    }}

    b, strong {{
      font-weight: bold;
    }}

    /* Page breaks for PDF */
    br[clear=all] {{
      page-break-before: always;
      display: block;
      height: 1px;
    }}

    /* Preserve Word styles */
    .MsoNormal {{
      margin: 0 0 8pt 0;
    }}

    .MsoNormalTable {{
      border-collapse: collapse;
    }}

    /* Print media */
    @media print {{
      body {{
        padding: 0;
        margin: 0;
      }}

      br[clear=all] {{
        page-break-before: always;
      }}
    }}
  </style>
</head>
<body>
{section_content}
</body>
</html>
'''

    return template

def main():
    # File paths
    source_file = Path("/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/VAL251012 - North Battleford Apt, 1101, 1121 109 Street, North Battleford.html")
    output_dir = Path("/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/template-extracts")

    # Create output directory
    output_dir.mkdir(exist_ok=True)

    # Read source HTML
    print(f"Reading source file: {source_file}")
    html_content = source_file.read_text(encoding='utf-8')

    # Define sections to extract
    sections = [
        (2, "01_cover_letter.html", "Cover Letter"),
        (4, "02_executive_summary.html", "Executive Summary"),
        (6, "03_property_analysis.html", "Property Analysis")
    ]

    # Process each section
    for section_num, filename, title in sections:
        print(f"\nProcessing WordSection{section_num}: {title}")

        # Extract section
        section_content = extract_section(html_content, section_num)
        if not section_content:
            print(f"  ⚠️  Could not find WordSection{section_num}")
            continue

        print(f"  ✓ Extracted {len(section_content)} characters")

        # Replace w:Sdt fields with placeholders
        template_content = replace_sdt_fields(section_content)

        # Count replacements
        placeholder_count = len(re.findall(r'\{\{[^}]+\}\}', template_content))
        image_count = len(re.findall(r'\[IMAGE: \{\{[^}]+\}\}\]', template_content))

        print(f"  ✓ Replaced {placeholder_count} text fields")
        print(f"  ✓ Replaced {image_count} image fields")

        # Wrap in clean HTML
        final_html = create_template_html(template_content, title)

        # Write to file
        output_file = output_dir / filename
        output_file.write_text(final_html, encoding='utf-8')
        print(f"  ✓ Created: {output_file}")

    print(f"\n✅ Template extraction complete!")
    print(f"📁 Output directory: {output_dir}")
    print(f"\nTo view: open each HTML file in a browser and check Print Preview")

if __name__ == "__main__":
    main()
