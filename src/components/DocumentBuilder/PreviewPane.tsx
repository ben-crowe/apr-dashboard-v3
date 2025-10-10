import React, { useMemo, useState } from 'react';
import { FieldRegistry } from './services/FieldRegistry';

interface PreviewPaneProps {
  content: string;
  jobData: any;
  mode: 'markers' | 'values';
  onModeChange: (mode: 'markers' | 'values') => void;
  template: string;
  registry: FieldRegistry;
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({
  content,
  jobData,
  mode,
  onModeChange,
  template,
  registry
}) => {
  const [zoom, setZoom] = useState(100);
  
  const processedContent = useMemo(() => {
    if (mode === 'markers') {
      // Highlight field markers
      return registry.highlightFields(content);
    }
    // Replace with actual values
    return registry.replaceFields(content, jobData);
  }, [content, jobData, mode, registry]);
  
  return (
    <div className="preview-pane flex-1 p-4 bg-gray-50 rounded-lg shadow-sm">
      <div className="preview-controls flex items-center justify-between mb-4 p-3 bg-white rounded-lg shadow-sm">
        <button
          onClick={() => onModeChange(mode === 'markers' ? 'values' : 'markers')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {mode === 'markers' ? '👁️ Show Values' : '🏷️ Show Fields'}
        </button>
        
        <div className="zoom-controls flex items-center gap-2">
          <button
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            -
          </button>
          <span className="min-w-[50px] text-center font-medium">{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            +
          </button>
          <button
            onClick={() => setZoom(100)}
            className="ml-2 px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
      
      <div className="preview-viewport bg-white rounded-lg shadow-sm overflow-auto" style={{ height: '600px' }}>
        <div 
          className={`preview-content template-${template} p-6`}
          style={{ 
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top left',
            width: zoom !== 100 ? `${10000 / zoom}%` : '100%'
          }}
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      </div>
    </div>
  );
};