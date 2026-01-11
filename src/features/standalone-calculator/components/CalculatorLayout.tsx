/**
 * Calculator Layout Component
 * 
 * Main split-pane container with input panel (left) and preview panel (right)
 */

import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { InputPanel } from './InputPanel/InputPanel';
import { PreviewPanel } from './PreviewPanel/PreviewPanel';
import { CalculateButton } from './Controls/CalculateButton';
import { ExportButton } from './Controls/ExportButton';
import { DevModeToggle } from './Controls/DevModeToggle';

export function CalculatorLayout() {
  return (
    <div className="h-screen flex flex-col">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">APR Valuation Calculator</h1>
        </div>
        <div className="flex items-center gap-2">
          <CalculateButton />
          <ExportButton />
          <DevModeToggle />
        </div>
      </div>

      {/* Split Pane Layout */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - Inputs (40% default) */}
          <ResizablePanel defaultSize={40} minSize={30} maxSize={70}>
            <InputPanel />
          </ResizablePanel>

          {/* Resizable Handle */}
          <ResizableHandle withHandle />

          {/* Right Panel - Preview (60% default) */}
          <ResizablePanel defaultSize={60} minSize={30} maxSize={70}>
            <PreviewPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
