#!/bin/bash
# Rename image files to clean format
# - Unnumbered pages: Descriptive names
# - Numbered pages: Img.Doc-[page#].png (no "of 79")

cd "/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/Img-doc-pages"

echo "=== Renaming Report Images ==="
echo ""

# Unnumbered front matter pages (4 files)
echo "Renaming unnumbered pages..."

mv "Ref.Report-VAL251012-North Battleford Apt.docx.pdf - Page 1 of 79.png" "Cover.png" 2>/dev/null && echo "✓ Page 1 → Cover.png"
mv "Ref.Report-VAL251012-North Battleford Apt.docx.pdf - Page 3 of 79.png" "Transmittal.png" 2>/dev/null && echo "✓ Page 3 → Transmittal.png"
mv "Ref.Report-VAL251012-North Battleford Apt.docx.pdf - Page 4 of 79.png" "Limiting-Conditions.png" 2>/dev/null && echo "✓ Page 4 → Limiting-Conditions.png"
mv "Ref.Report-VAL251012-North Battleford Apt.docx.pdf - Page 5 of 79.png" "TOC.png" 2>/dev/null && echo "✓ Page 5 → TOC.png"

echo ""
echo "Renaming numbered pages (Doc 1-74)..."

# Numbered pages: Source page 6+ → Document page (source - 5)
for source_page in {6..79}; do
  doc_page=$((source_page - 5))

  old_name="Ref.Report-VAL251012-North Battleford Apt.docx.pdf - Page ${source_page} of 79.png"

  # Handle the special case for page 6 which has "(Actually Pg1)" in filename
  if [ $source_page -eq 6 ]; then
    old_name="Ref.Report-VAL251012-North Battleford Apt.docx.pdf - Page 6 of 79 (Actually Pg1).png"
  fi

  new_name="Img.Doc-${doc_page}.png"

  if [ -f "$old_name" ]; then
    mv "$old_name" "$new_name"
    echo "✓ Source page ${source_page} → Img.Doc-${doc_page}.png"
  fi
done

echo ""
echo "=== ✅ Renaming Complete! ==="
echo ""
echo "Unnumbered files: Cover.png, Transmittal.png, Limiting-Conditions.png, TOC.png"
echo "Numbered files: Img.Doc-1.png through Img.Doc-74.png"
