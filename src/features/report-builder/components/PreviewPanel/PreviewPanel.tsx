import { useEffect, useRef } from 'react';
import { useReportBuilderStore } from '../../store/reportBuilderStore';

export default function PreviewPanel() {
  const previewHtml = useReportBuilderStore((state) => state.previewHtml);
  const activeTestMode = useReportBuilderStore((state) => state.activeTestMode);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Inject the report pages into the standalone viewer when HTML changes
  useEffect(() => {
    if (!previewHtml || !iframeRef.current) return;

    const iframe = iframeRef.current;

    // Wait for iframe to load with retry logic
    const handleLoad = () => {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        console.warn('PreviewPanel: iframe document not accessible');
        return;
      }

      // Find the pages wrapper in the standalone viewer (with retry)
      let pagesWrapper = iframeDoc.getElementById('pages-wrapper');
      if (!pagesWrapper) {
        // Retry after a short delay - iframe might still be loading
        setTimeout(() => {
          pagesWrapper = iframeDoc.getElementById('pages-wrapper');
          if (!pagesWrapper) {
            console.error('pages-wrapper not found in preview-wrapper.html after retry');
            return;
          }
          injectPages(pagesWrapper, iframeDoc);
        }, 500);
        return;
      }

      injectPages(pagesWrapper, iframeDoc);
    };

    const injectPages = (pagesWrapper: HTMLElement, iframeDoc: Document) => {
      // Extract just the page-sheet divs from the template HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = previewHtml;
      const pageSheets = tempDiv.querySelectorAll('.page-sheet');

      if (pageSheets.length === 0) {
        console.warn('PreviewPanel: No .page-sheet elements found in previewHtml');
        return;
      }

      // Clear wrapper and inject pages
      pagesWrapper.innerHTML = '';
      pageSheets.forEach(page => {
        pagesWrapper.appendChild(page.cloneNode(true));
      });

      // Trigger page count update if the wrapper has that function
      const iframeWindow = iframe.contentWindow as any;
      if (iframeWindow && typeof iframeWindow.updatePageCount === 'function') {
        iframeWindow.updatePageCount();
      }

      // Handle toggle based on test mode
      // In test-report mode: disable toggle (always show calculated report)
      // In designer mode: enable toggle (user can switch between sample data and full test data)
      const toggle = iframeDoc.getElementById('preview-toggle') as HTMLInputElement;
      const modeLabel = iframeDoc.getElementById('mode-label');
      if (toggle) {
        if (activeTestMode === 'test-report') {
          // Disable toggle in test-report mode
          toggle.disabled = true;
          toggle.checked = true; // Always show interpolated values
          pagesWrapper.classList.add('preview-mode');
          if (modeLabel) modeLabel.textContent = 'Preview Mode (Test Report Active)';
          toggle.style.opacity = '0.5';
          toggle.style.cursor = 'not-allowed';
        } else {
          // Enable toggle in designer mode or no mode
          toggle.disabled = false;
          toggle.style.opacity = '1';
          toggle.style.cursor = 'pointer';
          if (!toggle.checked) {
            // Enable preview mode to show interpolated values
            toggle.checked = true;
            pagesWrapper.classList.add('preview-mode');
            if (modeLabel) modeLabel.textContent = 'Designer Preview';
            
            // Trigger the toggle change handler to update all fields
            toggle.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('PreviewPanel: Auto-enabled preview mode to show interpolated values');
          } else {
            // Already enabled, but ensure preview-mode class is set
            pagesWrapper.classList.add('preview-mode');
            if (modeLabel) modeLabel.textContent = 'Designer Preview';
          }
        }
      }

      console.log(`PreviewPanel: Injected ${pageSheets.length} pages into preview`);
    };

    if (iframe.contentDocument?.readyState === 'complete') {
      handleLoad();
    } else {
      iframe.addEventListener('load', handleLoad);
      return () => iframe.removeEventListener('load', handleLoad);
    }
  }, [previewHtml, activeTestMode]);

  return (
    <div className="h-full w-full">
      {previewHtml ? (
        <iframe
          ref={iframeRef}
          src="/preview-wrapper.html"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block'
          }}
          title="Report Preview"
        />
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">Loading preview...</p>
        </div>
      )}
    </div>
  );
}
