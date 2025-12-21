#!/bin/bash
# Rename image files from source page numbers to document page numbers
# Formula: Document page = Source page - 5
#
# Source pages 1-7: No document page numbers (cover, TOC, etc.) - keep original names
# Source pages 8-79: Have document page numbers 3-74

cd "/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/Img-doc-pages"

# Rename pages 8-79 (doc pages 3-74)
for source_page in {8..79}; do
  # Calculate document page number
  doc_page=$((source_page - 5))

  # Old filename
  old_name="Ref.Report-VAL251012-North Battleford Apt.docx.pdf - Page ${source_page} of 79.png"

  # New filename
  new_name="Img.Doc-${doc_page}.png"

  # Rename if file exists
  if [ -f "$old_name" ]; then
    mv "$old_name" "$new_name"
    echo "Renamed: Page ${source_page} → Doc page ${doc_page}"
  fi
done

# Keep original names for pages 1-7 (no document page numbers)
echo ""
echo "Pages 1-7 kept with original names (cover pages, no document page numbers)"

echo ""
echo "✅ Renaming complete!"
echo "Files now named: Img.Doc-3.png through Img.Doc-74.png"
