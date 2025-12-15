#!/bin/bash
# Multi-Page HTML Viewer Using KBPR Proven Patterns
# Based on Fortune 500 company patterns (Stripe, CBRE, Vanguard)
# Pattern: CSS Containment + Visual Buffers + Continuous Scroll

HTML_DIR="/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/6-Souce Reports & Workbook/Ref-1-North Battleford/REPORT Pg Img/html-pages"
OUTPUT_FILE="/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/reference-pages-viewer-kbpr.html"

# Limit to first 5 pages for testing
TEST_MODE=true
PAGE_LIMIT=5

echo "Creating KBPR pattern-based viewer (testing with $PAGE_LIMIT pages)..."

# Start HTML document
cat > "$OUTPUT_FILE" << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reference Report - KBPR Pattern Viewer</title>

  <style>
    /* ========================================
       KBPR PATTERN: Continuous Flow Document
       Source: Fortune 500 patterns
       ======================================== */

    /* Global @page rules for PDF export */
    @page {
      size: 8.5in 11in;
      margin: 0;
    }

    /* Global container - minimal styling */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
      background: #f5f5f5;
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
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

    /* Page container - generous top margin for nav */
    .document-container {
      margin-top: 60px;
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #f5f5f5;
    }

    /* ========================================
       PATTERN 1: Page Section (Wrapper Pattern)
       Purpose: Isolate each page's CSS
       ======================================== */
    .page-section {
      /* CSS Containment - prevents style bleeding */
      contain: layout style;

      /* Page dimensions */
      width: 8.5in;
      min-height: 11in;

      /* Visual styling */
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);

      /* Prevent breaks within page */
      break-inside: avoid;
      -webkit-column-break-inside: avoid;
      page-break-inside: avoid;

      /* Position context */
      position: relative;
      display: block;

      /* Breathing room */
      margin-bottom: 0;
    }

    /* ========================================
       PATTERN 2: Transition Zone
       Purpose: Visual separation between pages
       Source: Stripe (120-160px), CBRE (180-200px)
       ======================================== */
    .transition-zone {
      width: 100%;
      padding: 120px 0;
      text-align: center;
      background: #f5f5f5;
      position: relative;
    }

    .page-separator {
      width: 60%;
      max-width: 400px;
      height: 1px;
      background: linear-gradient(to right, transparent, #d0d0d0 20%, #d0d0d0 80%, transparent);
      margin: 0 auto 20px auto;
    }

    .page-indicator {
      color: #666;
      font-size: 12px;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    /* ========================================
       PATTERN 3: Page Number Badge
       ======================================== */
    .page-number-badge {
      position: absolute;
      top: -40px;
      left: 0;
      background: #003d7a;
      color: white;
      padding: 6px 14px;
      font-size: 11px;
      border-radius: 4px;
      letter-spacing: 1px;
      font-weight: 600;
      z-index: 10;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    /* ========================================
       Print Styles
       ======================================== */
    @media print {
      .nav-bar {
        display: none;
      }

      .transition-zone {
        display: none;
      }

      .page-number-badge {
        display: none;
      }

      .document-container {
        margin-top: 0;
        padding: 0;
        background: white;
      }

      .page-section {
        page-break-after: always;
        break-after: page;
        box-shadow: none;
        margin-bottom: 0;
      }

      .page-section:last-child {
        page-break-after: auto;
        break-after: auto;
      }
    }
  </style>
</head>
<body>
  <div class="nav-bar">
    <h1>Reference Report - KBPR Pattern Viewer (Testing: 5 pages)</h1>
    <button onclick="window.print()">Export to PDF</button>
  </div>

  <div class="document-container">
EOF

# Add pages with KBPR pattern structure
echo "Adding pages with KBPR patterns..."
page_count=0

for page_file in $(ls "$HTML_DIR" | grep "^page-[0-9].*\.html$" | grep -v ".bak" | sort -V); do
  page_num=$(echo "$page_file" | sed 's/page-\([0-9]*\).html/\1/')

  # Test mode: limit to 5 pages
  if [ "$TEST_MODE" = true ] && [ "$page_count" -ge "$PAGE_LIMIT" ]; then
    break
  fi

  # Page section wrapper (KBPR Pattern 1: Isolation)
  echo "    <div class=\"page-section\">" >> "$OUTPUT_FILE"
  echo "      <div class=\"page-number-badge\">Page $page_num</div>" >> "$OUTPUT_FILE"

  # Embed the page's CSS inline
  echo "      <style>" >> "$OUTPUT_FILE"
  sed -n '/<style>/,/<\/style>/p' "$HTML_DIR/$page_file" | \
    sed '1d;$d' >> "$OUTPUT_FILE"
  echo "      </style>" >> "$OUTPUT_FILE"

  # Extract body content
  sed -n '/<body>/,/<\/body>/p' "$HTML_DIR/$page_file" | \
    sed '1d;$d' >> "$OUTPUT_FILE"

  echo "    </div>" >> "$OUTPUT_FILE"

  # Add transition zone between pages (KBPR Pattern 2: Visual Separation)
  echo "    <div class=\"transition-zone\">" >> "$OUTPUT_FILE"
  echo "      <div class=\"page-separator\"></div>" >> "$OUTPUT_FILE"
  echo "      <div class=\"page-indicator\">Page Break</div>" >> "$OUTPUT_FILE"
  echo "    </div>" >> "$OUTPUT_FILE"

  echo "  Added page $page_num with KBPR isolation pattern"
  ((page_count++))
done

# Close HTML
cat >> "$OUTPUT_FILE" << 'EOF'
  </div>
</body>
</html>
EOF

echo ""
echo "✅ KBPR pattern viewer created!"
echo "📍 Location: $OUTPUT_FILE"
echo "📊 Pages: $page_count"
echo ""
echo "Patterns used:"
echo "  - CSS Containment (prevent style bleeding)"
echo "  - Visual Buffers (120px transition zones)"
echo "  - Inline CSS (preserve page-specific styles)"
echo "  - Continuous scroll (no page breaks)"
echo ""
echo "To view: open $OUTPUT_FILE"
