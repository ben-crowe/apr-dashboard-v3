#!/usr/bin/env python3
"""
Rename SVG files to match footer page numbers.

Based on the mapping:
- PDF pages 7-79 map to document footer pages 1-74 (6-page offset)
- SVG file _7.svg -> Page-01.svg
- SVG file _8.svg -> Page-02.svg
- ... and so on
"""

import os
import shutil
from pathlib import Path

# Directory containing SVG files
svg_dir = Path("/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-pages-svg-per/")

# Create mapping: PDF page number to footer page number
# PDF pages 7-79 -> Footer pages 1-74 (offset of 6)
PDF_OFFSET = 6

def get_svg_files():
    """Get all SVG files in the directory."""
    pattern = "Ref.Report-VAL251012-North Battleford Apt.docx_*.svg"
    files = list(svg_dir.glob("Ref.Report-VAL251012-North Battleford Apt.docx_*.svg"))
    return sorted(files, key=lambda x: int(x.stem.split('_')[-1]))

def extract_pdf_page_num(filename):
    """Extract PDF page number from filename."""
    # filename format: "Ref.Report-VAL251012-North Battleford Apt.docx_35.svg"
    stem = filename.stem
    page_num = int(stem.split('_')[-1])
    return page_num

def pdf_to_footer_page(pdf_page):
    """Convert PDF page number to footer page number."""
    if pdf_page < 7:
        return None  # Front matter pages
    footer_page = pdf_page - PDF_OFFSET
    return footer_page

def generate_new_filename(footer_page):
    """Generate new filename based on footer page number."""
    return f"Page-{footer_page:02d}.svg"

def main():
    svg_files = get_svg_files()

    print(f"Found {len(svg_files)} SVG files")
    print("\nMapping Preview (first 10 and last 10):")
    print("-" * 80)
    print(f"{'Current Filename':<50} {'PDF#':<6} {'Footer#':<8} {'New Filename':<20}")
    print("-" * 80)

    rename_commands = []

    for idx, svg_file in enumerate(svg_files):
        pdf_page = extract_pdf_page_num(svg_file)
        footer_page = pdf_to_footer_page(pdf_page)

        if footer_page is None:
            # Skip front matter pages
            continue

        new_filename = generate_new_filename(footer_page)
        new_path = svg_dir / new_filename

        # Show preview for first 10 and last 10
        if idx < 10 or idx >= len(svg_files) - 10:
            print(f"{svg_file.name:<50} {pdf_page:<6} {footer_page:<8} {new_filename:<20}")
        elif idx == 10:
            print("...")

        # Generate rename command
        rename_commands.append((svg_file, new_path))

    print("-" * 80)
    print(f"\nTotal files to rename: {len(rename_commands)}")

    # Ask for confirmation
    print("\nReady to rename files. Proceed? (y/n): ", end='')
    response = input().strip().lower()

    if response == 'y':
        print("\nRenaming files...")
        for old_path, new_path in rename_commands:
            if new_path.exists():
                print(f"Warning: {new_path.name} already exists, skipping...")
                continue
            shutil.move(str(old_path), str(new_path))
            print(f"  Renamed: {old_path.name} -> {new_path.name}")
        print("\nDone!")
    else:
        print("\nRename cancelled.")
        print("\nGenerated bash commands (if you prefer to review first):")
        print("-" * 80)
        for old_path, new_path in rename_commands[:5]:
            print(f'mv "{old_path}" "{new_path}"')
        print("...")
        for old_path, new_path in rename_commands[-5:]:
            print(f'mv "{old_path}" "{new_path}"')

if __name__ == "__main__":
    main()
