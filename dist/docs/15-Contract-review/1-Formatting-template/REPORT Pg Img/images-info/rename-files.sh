#!/bin/bash
# Rename image files to match established convention
# Based on: 25.12.16-1 - Report-file-alignment.md
#
# Convention:
# - Front matter: -a-cover, -b-conditions, -c-letter, -d-table-contents
# - Numbered pages: Page-01 through Page-74 (two-digit padding)

cd "/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/Img-doc-pages"

echo "=== Renaming Image Files to Established Convention ==="
echo ""

# Front matter pages (4 files) - using established naming
echo "Renaming front matter pages..."

mv "Ref.Report-VAL251012-North Battleford Apt.docx.pdf - Page 1 of 79.png" "-a-cover.png" 2>/dev/null && echo "✓ Source page 1 → -a-cover.png"
mv "Ref.Report-VAL251012-North Battleford Apt.docx.pdf - Page 3 of 79.png" "-c-letter.png" 2>/dev/null && echo "✓ Source page 3 → -c-letter.png"
mv "Ref.Report-VAL251012-North Battleford Apt.docx.pdf - Page 4 of 79.png" "-b-conditions.png" 2>/dev/null && echo "✓ Source page 4 → -b-conditions.png"
mv "Ref.Report-VAL251012-North Battleford Apt.docx.pdf - Page 5 of 79.png" "-d-table-contents.png" 2>/dev/null && echo "✓ Source page 5 → -d-table-contents.png"

echo ""
echo "Renaming numbered pages (Page-01 through Page-74)..."

# Numbered pages: Source page 6-79 → Document page 1-74
# Formula: Document page = Source page - 5
for source_page in {6..79}; do
  doc_page=$((source_page - 5))

  # Pad document page number with leading zero
  doc_page_padded=$(printf "%02d" $doc_page)

  old_name="Ref.Report-VAL251012-North Battleford Apt.docx.pdf - Page ${source_page} of 79.png"

  # Handle the special case for page 6 which has "(Actually Pg1)" in filename
  if [ $source_page -eq 6 ]; then
    old_name="Ref.Report-VAL251012-North Battleford Apt.docx.pdf - Page 6 of 79 (Actually Pg1).png"
  fi

  new_name="Page-${doc_page_padded}.png"

  if [ -f "$old_name" ]; then
    mv "$old_name" "$new_name"
    echo "✓ Source page ${source_page} → ${new_name} (document page ${doc_page})"
  fi
done

echo ""
echo "=== ✅ Renaming Complete! ==="
echo ""
echo "Front matter files:"
echo "  -a-cover.png          (cover page)"
echo "  -b-conditions.png     (limiting conditions)"
echo "  -c-letter.png         (transmittal letter)"
echo "  -d-table-contents.png (table of contents)"
echo ""
echo "Numbered files: Page-01.png through Page-74.png"
echo ""
echo "Total files: 78 (4 front matter + 74 numbered pages)"
