/**
 * Page Frame Component
 *
 * Simple iframe that loads combined pages HTML and receives postMessage updates.
 * No zoom controls - sizing controlled by panel divider (like Report Builder).
 * Iframe fills container at 100%, padding handled by container.
 */

import { useRef, useEffect } from 'react';
import { useCalculatorStore } from '../../store/calculatorStore';
import { formatFieldValue } from '../../utils/formatters';

export function PageFrame() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const outputs = useCalculatorStore((state) => state.outputs);
  const devMode = useCalculatorStore((state) => state.devMode);

  // Load combined HTML pages into iframe
  useEffect(() => {
    const loadCombinedPages = async () => {
      if (!iframeRef.current) return;

      try {
        // Fetch both pages
        const [page48Res, page49Res] = await Promise.all([
          fetch('/standalone-calculator-pages/page-48-direct-capitalization.html'),
          fetch('/standalone-calculator-pages/page-49-income-conclusion.html'),
        ]);

        const [page48Html, page49Html] = await Promise.all([
          page48Res.text(),
          page49Res.text(),
        ]);

        // Extract the page-sheet div from each page
        const extractPageSheet = (html: string) => {
          const fullMatch = html.match(
            /(<div[^>]*class="page-sheet"[^>]*>[\s\S]*?<\/div>)\s*(?:<script|<\/body)/i
          );
          if (fullMatch) {
            return fullMatch[1].trim();
          }
          const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<script/i);
          if (bodyMatch) {
            return bodyMatch[1].trim();
          }
          return '';
        };

        const page48Sheet = extractPageSheet(page48Html);
        const page49Sheet = extractPageSheet(page49Html);

        // Extract styles from first page
        const styleMatch = page48Html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
        const styles = styleMatch ? styleMatch[1] : '';

        // Extract script from first page
        const scriptMatch = page48Html.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
        const script = scriptMatch ? scriptMatch[1] : '';

        // Combine into single HTML document - styled like Report Builder viewer
        const combinedHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Income Approach Calculator - Pages 48-49</title>
    <style>
        ${styles}
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        html, body {
            height: 100%;
            overflow: auto;
            background: #525659;
            font-family: "Open Sans", Arial, sans-serif;
        }
        #pages-wrapper {
            padding: 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100%;
        }
        .page-sheet {
            width: 8.5in;
            min-height: 11in;
            background-color: white;
            page-break-after: always;
            margin-bottom: 24px;
            padding: 54px;
            padding-bottom: 180px;
            position: relative;
            display: block;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
    </style>
</head>
<body>
    <div id="pages-wrapper">
        ${page48Sheet}
        ${page49Sheet}
    </div>
    <script>
        ${script}
    </script>
</body>
</html>`;

        // Write to iframe
        const iframeDoc =
          iframeRef.current.contentDocument ||
          iframeRef.current.contentWindow?.document;
        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(combinedHTML);
          iframeDoc.close();

          // Send initial field updates after load
          setTimeout(() => {
            sendUpdates();
          }, 100);
        }
      } catch (error) {
        console.error('Failed to load pages:', error);
      }
    };

    loadCombinedPages();
  }, []); // Only load once on mount

  // Send field updates to iframe via postMessage
  const sendUpdates = () => {
    if (!iframeRef.current?.contentWindow) return;

    const fields = Object.entries(outputs)
      .filter(
        ([, value]) => value !== null && value !== undefined && !isNaN(value as number)
      )
      .map(([id, value]) => ({
        id,
        value: formatFieldValue(id, value as number),
      }));

    iframeRef.current.contentWindow.postMessage(
      {
        type: 'UPDATE_FIELDS',
        fields,
      },
      '*'
    );
  };

  // Send updates when outputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      sendUpdates();
    }, 100);
    return () => clearTimeout(timer);
  }, [outputs]);

  return (
    <div className="relative w-full h-full">
      <iframe
        ref={iframeRef}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
        }}
        title="Income Approach Calculator Preview"
      />
      {devMode && (
        <div className="absolute bottom-2 right-2 bg-yellow-200 px-2 py-1 text-xs rounded z-10">
          Dev Mode: Field IDs visible
        </div>
      )}
    </div>
  );
}
