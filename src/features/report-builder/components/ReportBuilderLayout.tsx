import { useNavigate } from 'react-router-dom';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import EditPanel from './EditPanel/EditPanel';
import PreviewPanel from './PreviewPanel/PreviewPanel';
import SectionSidebar from './SectionSidebar';

export default function ReportBuilderLayout() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      {/* Navigation Header */}
      <div className="bg-slate-800 text-white px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/test-input')}
            variant="ghost"
            size="sm"
            className="gap-2 text-white hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to TDD
          </Button>
          <span className="text-slate-400">|</span>
          <span className="font-semibold">Report Builder</span>
        </div>
        <Button
          onClick={() => window.location.reload()}
          variant="ghost"
          size="sm"
          className="gap-2 text-white hover:bg-slate-700"
          title="Refresh the page"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <SectionSidebar />

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={40} minSize={30} maxSize={60}>
          <EditPanel />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={60} minSize={40}>
          <PreviewPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
      </div>
    </div>
  );
}
