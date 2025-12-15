#!/bin/bash
# Fixed Multi-Page HTML Concatenation with Proper CSS Scoping
# This version extracts and scopes CSS from each page to prevent conflicts

HTML_DIR="/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/6-Souce Reports & Workbook/Ref-1-North Battleford/REPORT Pg Img/html-pages"
OUTPUT_FILE="/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/reference-pages-viewer-fixed.html"

echo "Creating properly scoped multi-page viewer..."

# Start HTML document
cat > "$OUTPUT_FILE" << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reference Report - All Pages (Properly Scoped)</title>

  <style>
    /* Global @page rules for PDF export */
    @page {
      size: 8.5in 11in;
      margin: 0;
    }

    /* Global resets */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
      background: #f0f0f0;
      font-family: Arial, sans-serif;
    }

    /* Navigation bar */
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

    /* Page container */
    .page-container {
      margin-top: 50px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    /* Individual page wrapper */
    .page-wrapper {
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      position: relative;
      width: 8.5in;
      min-height: 11in;
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

    /* Print styles */
    @media print {
      .nav-bar {
        display: none;
      }

      .page-number {
        display: none;
      }

      .page-container {
        margin-top: 0;
        padding: 0;
        gap: 0;
      }

      .page-wrapper {
        page-break-after: always;
        break-after: page;
        box-shadow: none;
        margin: 0;
      }

      .page-wrapper:last-child {
        page-break-after: auto;
        break-after: auto;
      }
    }
  </style>

  <!-- Scoped CSS from individual pages -->
  <style>
EOF

# Extract and scope CSS from all pages
echo "Extracting and scoping CSS..."
for page_file in $(ls "$HTML_DIR" | grep "^page-[0-9].*\.html$" | grep -v ".bak" | sort -V); do
  page_num=$(echo "$page_file" | sed 's/page-\([0-9]*\).html/\1/')

  echo "    /* === Scoped CSS from Page $page_num === */" >> "$OUTPUT_FILE"

  # Extract CSS and add data-page scope to all selectors
  # Skip @page, *, body, html rules (already handled globally)
  sed -n '/<style>/,/<\/style>/p' "$HTML_DIR/$page_file" | \
    sed '1d;$d' | \
    awk -v page="$page_num" '
      BEGIN { in_rule = 0; selector = ""; }

      # Skip global rules
      /^[ ]*@page/ { next; }
      /^[ ]*\*[ ]*\{/ { next; }
      /^[ ]*body[ ]*\{/ { next; }
      /^[ ]*html[ ]*\{/ { next; }

      # Process selectors and rules
      /{/ {
        # This line contains a selector and opening brace
        # Add data-page scope
        gsub(/^[ ]+/, "");  # Remove leading whitespace
        printf "    [data-page=\"%s\"] %s\n", page, $0;
        in_rule = 1;
        next;
      }

      /}/ {
        # Closing brace
        print "    " $0;
        in_rule = 0;
        next;
      }

      # Rule body content
      in_rule == 1 {
        print "      " $0;
      }
    ' >> "$OUTPUT_FILE"

  echo "  Scoped CSS for page $page_num"
done

# Close head and start body
cat >> "$OUTPUT_FILE" << 'EOF'
  </style>
</head>
<body>
  <div class="nav-bar">
    <h1>Reference Report - All Pages (Properly Scoped CSS)</h1>
    <button onclick="window.print()">Export to PDF</button>
  </div>

  <div class="page-container">
EOF

# Add all page content
echo "Adding page content..."
for page_file in $(ls "$HTML_DIR" | grep "^page-[0-9].*\.html$" | grep -v ".bak" | sort -V); do
  page_num=$(echo "$page_file" | sed 's/page-\([0-9]*\).html/\1/')

  echo "    <div class=\"page-wrapper\" data-page=\"$page_num\">" >> "$OUTPUT_FILE"
  echo "      <div class=\"page-number\">Page $page_num</div>" >> "$OUTPUT_FILE"

  # Extract body content (no style tags)
  sed -n '/<body>/,/<\/body>/p' "$HTML_DIR/$page_file" | \
    sed '1d;$d' >> "$OUTPUT_FILE"

  echo "    </div>" >> "$OUTPUT_FILE"

  echo "  Added page $page_num"
done

# Close HTML
cat >> "$OUTPUT_FILE" << 'EOF'
  </div>
</body>
</html>
EOF

echo ""
echo "✅ Fixed multi-page viewer created!"
echo "📍 Location: $OUTPUT_FILE"
echo ""
echo "To view: open $OUTPUT_FILE"
