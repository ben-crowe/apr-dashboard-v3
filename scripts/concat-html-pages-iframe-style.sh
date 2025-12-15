#!/bin/bash
# Multi-Page HTML Concatenation Using Shadow DOM Concept
# Each page gets its own isolated style context

HTML_DIR="/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/6-Souce Reports & Workbook/Ref-1-North Battleford/REPORT Pg Img/html-pages"
OUTPUT_FILE="/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/reference-pages-viewer-iframe-style.html"

echo "Creating iframe-style multi-page viewer..."

# Start HTML document
cat > "$OUTPUT_FILE" << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reference Report - All Pages (Iframe Style)</title>

  <style>
    /* Global @page rules for PDF export */
    @page {
      size: 8.5in 11in;
      margin: 0;
    }

    /* Global container styles only */
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

    /* Individual page wrapper - MINIMAL styling */
    .page-wrapper {
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      position: relative;
      /* Let the inner page-root control dimensions */
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
      z-index: 10;
    }

    /* Page root - creates isolated context for each page */
    .page-root {
      /* This div will contain the full original page HTML */
      /* The page's body styles will be converted to apply here */
      display: block;
      position: relative;
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
</head>
<body>
  <div class="nav-bar">
    <h1>Reference Report - All Pages (Iframe Style)</h1>
    <button onclick="window.print()">Export to PDF</button>
  </div>

  <div class="page-container">
EOF

# Add all page content
echo "Adding pages with isolated styles..."
for page_file in $(ls "$HTML_DIR" | grep "^page-[0-9].*\.html$" | grep -v ".bak" | sort -V); do
  page_num=$(echo "$page_file" | sed 's/page-\([0-9]*\).html/\1/')

  echo "    <div class=\"page-wrapper\" data-page=\"$page_num\">" >> "$OUTPUT_FILE"
  echo "      <div class=\"page-number\">Page $page_num</div>" >> "$OUTPUT_FILE"
  echo "      <div class=\"page-root\" id=\"page-$page_num\">" >> "$OUTPUT_FILE"

  # Extract the FULL page content (style + body)
  # We'll modify body selector to .page-root selector

  # First, extract and modify the CSS
  echo "        <style>" >> "$OUTPUT_FILE"
  sed -n '/<style>/,/<\/style>/p' "$HTML_DIR/$page_file" | \
    sed '1d;$d' | \
    sed "s/^[ ]*body[ ]*{/#page-$page_num.page-root {/g" | \
    sed "s/^[ ]*html[ ]*{/#page-$page_num.page-root {/g" | \
    awk -v page="$page_num" '
      # Replace standalone body/html selectors with scoped version
      # Keep everything else as-is
      !/^[ ]*@page/ { print "          " $0; }
    ' >> "$OUTPUT_FILE"
  echo "        </style>" >> "$OUTPUT_FILE"

  # Extract body content
  sed -n '/<body>/,/<\/body>/p' "$HTML_DIR/$page_file" | \
    sed '1d;$d' | \
    sed 's/^/        /' >> "$OUTPUT_FILE"

  echo "      </div>" >> "$OUTPUT_FILE"
  echo "    </div>" >> "$OUTPUT_FILE"

  echo "  Added page $page_num with isolated styles"
done

# Close HTML
cat >> "$OUTPUT_FILE" << 'EOF'
  </div>
</body>
</html>
EOF

echo ""
echo "✅ Iframe-style multi-page viewer created!"
echo "📍 Location: $OUTPUT_FILE"
echo ""
echo "This version preserves each page's original body styles by converting them to scoped selectors."
echo ""
echo "To view: open $OUTPUT_FILE"
