/**
 * Preview Panel Component
 * 
 * Right panel container (60% width) with page selector, zoom controls, and iframe
 */

import { PageSelector } from './PageSelector';
import { ZoomControls } from './ZoomControls';
import { PageFrame } from './PageFrame';

export function PreviewPanel() {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header Controls */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <PageSelector />
        <ZoomControls />
      </div>
      
      {/* Page Frame */}
      <div className="flex-1 overflow-hidden">
        <PageFrame />
      </div>
    </div>
  );
}
