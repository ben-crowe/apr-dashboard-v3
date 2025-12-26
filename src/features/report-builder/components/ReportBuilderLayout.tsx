import { useNavigate } from 'react-router-dom';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Database } from 'lucide-react';
import EditPanel from './EditPanel/EditPanel';
import PreviewPanel from './PreviewPanel/PreviewPanel';
import SectionSidebar from './SectionSidebar';
import { useReportBuilderStore } from '../store/reportBuilderStore';

export default function ReportBuilderLayout() {
  const navigate = useNavigate();
  const loadFullTestData = useReportBuilderStore((state) => state.loadFullTestData);
  const activeTestMode = useReportBuilderStore((state) => state.activeTestMode);

  const handleLoadTestData = async () => {
    await loadFullTestData();
  };

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
        <div className="flex items-center gap-3">
          {activeTestMode === 'test-report' && (
            <span className="text-sm text-slate-300 italic">
              Test Report Mode Active - showing calculated report
            </span>
          )}
          {activeTestMode === 'designer' && (
            <span className="text-sm text-slate-300 italic">
              Designer Mode - toggle sample data or load full test data
            </span>
          )}
          <Button
            onClick={handleLoadTestData}
            variant="ghost"
            size="sm"
            disabled={activeTestMode === 'test-report'}
            className={`gap-2 text-white border border-slate-600 ${
              activeTestMode === 'test-report'
                ? 'opacity-50 cursor-not-allowed hover:bg-slate-800'
                : 'hover:bg-slate-700'
            }`}
            title={
              activeTestMode === 'test-report'
                ? 'Disabled in Test Report Mode'
                : 'MODE 2: Load Full Test Data - Load ALL fields from test data for full mapping validation'
            }
          >
            <Database className="w-4 h-4" />
            Load Full Test Data
          </Button>
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
