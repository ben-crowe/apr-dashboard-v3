/**
 * Page Frame Component
 * 
 * Iframe that loads page HTML and receives postMessage updates
 */

import { useRef, useEffect } from 'react';
import { useCalculatorStore } from '../../store/calculatorStore';
import { formatFieldValue } from '../../utils/formatters';

const pageMap = {
  'page-48': '/src/features/standalone-calculator/pages/page-48-direct-capitalization.html',
  'page-49': '/src/features/standalone-calculator/pages/page-49-income-conclusion.html',
};

export function PageFrame() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const selectedPage = useCalculatorStore((state) => state.selectedPage);
  const zoomLevel = useCalculatorStore((state) => state.zoomLevel);
  const outputs = useCalculatorStore((state) => state.outputs);
  const devMode = useCalculatorStore((state) => state.devMode);

  // Send field updates to iframe
  const sendUpdates = () => {
    if (!iframeRef.current?.contentWindow) return;

    const fields = Object.entries(outputs)
      .filter(([_, value]) => value !== null && value !== undefined && !isNaN(value as number))
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
    // Small delay to ensure iframe is loaded
    const timer = setTimeout(() => {
      sendUpdates();
    }, 100);
    return () => clearTimeout(timer);
  }, [outputs, selectedPage]);

  // Handle iframe load
  const handleLoad = () => {
    sendUpdates();
  };

  // Calculate zoom transform
  const getZoomStyle = () => {
    switch (zoomLevel) {
      case 'fit':
        return { transform: 'scale(0.8)', transformOrigin: 'top left' };
      case '100%':
        return { transform: 'scale(1.0)', transformOrigin: 'top left' };
      case '150%':
        return { transform: 'scale(1.5)', transformOrigin: 'top left' };
      default:
        return {};
    }
  };

  // Get page URL - in production, these would be served from public folder
  // For now, we'll use a data URL approach or serve from public
  const pageUrl = pageMap[selectedPage];

  return (
    <div className="relative w-full h-full overflow-auto bg-gray-100">
      <div
        style={{
          ...getZoomStyle(),
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <iframe
          ref={iframeRef}
          src={pageUrl}
          onLoad={handleLoad}
          className="w-full h-full border-0"
          style={{
            minHeight: '11in',
            backgroundColor: 'white',
          }}
          title={`Page ${selectedPage === 'page-48' ? '48' : '49'}`}
        />
      </div>
      {devMode && (
        <div className="absolute bottom-2 right-2 bg-yellow-200 px-2 py-1 text-xs rounded">
          Dev Mode: Field IDs visible
        </div>
      )}
      <div className="absolute bottom-2 left-2 text-xs text-gray-500">
        {selectedPage === 'page-48' ? 'Page 48' : 'Page 49'}
      </div>
    </div>
  );
}
