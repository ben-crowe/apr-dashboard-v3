import { useEffect, useRef } from 'react';
import { useReportBuilderStore } from '../../store/reportBuilderStore';

export default function PreviewPanel() {
  const previewHtml = useReportBuilderStore((state) => state.previewHtml);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Inject the report pages into the standalone viewer when HTML changes
  useEffect(() => {
    if (!previewHtml || !iframeRef.current) return;

    const iframe = iframeRef.current;

    // Wait for iframe to load
    const handleLoad = () => {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) return;

      // Find the pages wrapper in the standalone viewer
      const pagesWrapper = iframeDoc.getElementById('pages-wrapper');
      if (!pagesWrapper) {
        console.error('pages-wrapper not found in preview-wrapper.html');
        return;
      }

      // Extract just the page-sheet divs from the template HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = previewHtml;
      const pageSheets = tempDiv.querySelectorAll('.page-sheet');

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
    };

    if (iframe.contentDocument?.readyState === 'complete') {
      handleLoad();
    } else {
      iframe.addEventListener('load', handleLoad);
      return () => iframe.removeEventListener('load', handleLoad);
    }
  }, [previewHtml]);

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
