#!/usr/bin/env python3
"""
Fix off-by-one error in SVG file naming.

The user's Page-1.svg is the correct page 1.
My Page-01.svg through Page-73.svg are all off by one (they should be Page-02.svg through Page-74.svg).

Strategy:
1. Rename in reverse order (Page-73.svg → Page-74.svg, etc.) to avoid conflicts
2. Finally rename Page-1.svg → Page-01.svg
"""

import os
import shutil
from pathlib import Path

svg_dir = Path("/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-pages-svg-per/")

def main():
    print("Fixing off-by-one error in SVG file naming...")
    print("-" * 80)

    # First, rename existing Page-01.svg through Page-73.svg to Page-02.svg through Page-74.svg
    # Do this in REVERSE order to avoid filename conflicts

    print("\nStep 1: Renaming Page-01.svg through Page-73.svg → Page-02.svg through Page-74.svg")
    print("(Processing in reverse order to avoid conflicts)")
    print("-" * 80)

    for i in range(73, 0, -1):  # 73 down to 1
        old_name = f"Page-{i:02d}.svg"
        new_name = f"Page-{i+1:02d}.svg"

        old_path = svg_dir / old_name
        new_path = svg_dir / new_name

        if old_path.exists():
            shutil.move(str(old_path), str(new_path))
            if i <= 5 or i >= 71:  # Show first 5 and last 3
                print(f"  Renamed: {old_name} → {new_name}")
            elif i == 6:
                print("  ...")

    print("\nStep 2: Renaming Page-1.svg → Page-01.svg")
    print("-" * 80)

    user_page_1 = svg_dir / "Page-1.svg"
    correct_page_1 = svg_dir / "Page-01.svg"

    if user_page_1.exists():
        shutil.move(str(user_page_1), str(correct_page_1))
        print(f"  Renamed: Page-1.svg → Page-01.svg")
    else:
        print("  Warning: Page-1.svg not found!")

    print("\n" + "=" * 80)
    print("Done! SVG files now correctly aligned with footer page numbers.")
    print("=" * 80)

    # Verify the result
    print("\nVerification (first 10 files):")
    print("-" * 80)
    svg_files = sorted([f for f in svg_dir.glob("Page-*.svg") if f.name[5].isdigit()])
    for f in svg_files[:10]:
        print(f"  {f.name}")

if __name__ == "__main__":
    main()
