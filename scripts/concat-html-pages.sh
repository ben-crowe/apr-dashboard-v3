#!/bin/bash
# Concatenate all 77 HTML pages into a single viewer
# This creates a simple viewer from the reference HTML pages in html-pages/

HTML_DIR="/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/6-Souce Reports & Workbook/Ref-1-North Battleford/REPORT Pg Img/html-pages"
OUTPUT_FILE="/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/reference-pages-viewer.html"

echo "Creating reference pages viewer..."

# Start HTML document
cat > "$OUTPUT_FILE" << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reference Report - All Pages Viewer</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #f0f0f0;
    }

    .nav-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #003d7a;
      color: white;
      padding: 12px 20px;
      z-index: 1000;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-bar h1 {
      margin: 0;
      font-size: 18px;
      font-weight: normal;
    }

    .nav-bar button {
      background: #4a9fd8;
      color: white;
      border: none;
      padding: 8px 16px;
      cursor: pointer;
      border-radius: 4px;
      font-size: 14px;
    }

    .nav-bar button:hover {
      background: #5ab0e8;
    }

    .content {
      margin-top: 50px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .page-wrapper {
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      position: relative;
    }

    .page-number {
      position: absolute;
      top: -30px;
      left: 0;
      background: #003d7a;
      color: white;
      padding: 4px 12px;
      font-size: 12px;
      border-radius: 4px;
    }

    /* Page break for printing */
    @media print {
      .nav-bar { display: none; }
      .page-number { display: none; }
      .content { margin-top: 0; padding: 0; gap: 0; }
      .page-wrapper {
        page-break-after: always;
        box-shadow: none;
        margin: 0;
      }
    }
  </style>
</head>
<body>
  <div class="nav-bar">
    <h1>Reference Report - All Pages (Visual Verification)</h1>
    <button onclick="window.print()">Export to PDF</button>
  </div>

  <div class="content">
EOF

# Loop through all page-XX.html files (excluding .bak files and non-HTML)
for page_file in $(ls "$HTML_DIR" | grep "^page-[0-9].*\.html$" | grep -v ".bak" | sort -V); do
  page_num=$(echo "$page_file" | sed 's/page-\([0-9]*\).html/\1/')

  echo "    <div class=\"page-wrapper\">" >> "$OUTPUT_FILE"
  echo "      <div class=\"page-number\">Page $page_num</div>" >> "$OUTPUT_FILE"

  # Extract just the <body> content (skip DOCTYPE, html, head tags)
  # This extracts everything between <body> and </body>
  sed -n '/<body>/,/<\/body>/p' "$HTML_DIR/$page_file" | \
    sed '1d;$d' >> "$OUTPUT_FILE"

  echo "    </div>" >> "$OUTPUT_FILE"

  echo "  Added page $page_num"
done

# Close HTML document
cat >> "$OUTPUT_FILE" << 'EOF'
  </div>
</body>
</html>
EOF

echo ""
echo "✅ Reference pages viewer created!"
echo "📍 Location: $OUTPUT_FILE"
echo ""
echo "To view: open $OUTPUT_FILE"
