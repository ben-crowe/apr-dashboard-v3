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
  const loadUserInputsOnly = useReportBuilderStore((state) => state.loadUserInputsOnly);
  const activeTestMode = useReportBuilderStore((state) => state.activeTestMode);

  const handleLoadTestData = async () => {
    await loadUserInputsOnly();
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      {/* Navigation Header */}
      <div className="text-white px-4 py-2 flex items-center justify-between shrink-0 border-b" style={{ backgroundColor: '#1f1f1f', borderColor: '#4b5563' }}>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/test-input')}
            variant="ghost"
            size="sm"
            className="gap-2 text-white hover:!bg-[#2a2a2a] hover:!text-white"
            style={{ backgroundColor: 'transparent', color: '#ffffff' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2a2a2a';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#ffffff';
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to TDD
          </Button>
          <span style={{ color: '#9ca3af' }}>|</span>
          <span className="font-semibold">Report Builder</span>
        </div>
        <div className="flex items-center gap-3">
          {activeTestMode === 'test-report' && (
            <span className="text-sm italic" style={{ color: '#9ca3af' }}>
              Test Report Mode Active - showing calculated report
            </span>
          )}
          {activeTestMode === 'designer' && (
            <span className="text-sm italic" style={{ color: '#9ca3af' }}>
              Designer Mode - toggle sample data or load full test data
            </span>
          )}
          <Button
            onClick={handleLoadTestData}
            variant="ghost"
            size="sm"
            disabled={activeTestMode === 'test-report'}
            className="gap-2 text-white border hover:!text-white"
            style={{
              backgroundColor: activeTestMode === 'test-report' ? '#1f1f1f' : '#2a2a2a',
              borderColor: '#4b5563',
              opacity: activeTestMode === 'test-report' ? 0.5 : 1,
              cursor: activeTestMode === 'test-report' ? 'not-allowed' : 'pointer',
              color: '#ffffff'
            }}
            onMouseEnter={(e) => {
              if (activeTestMode !== 'test-report') {
                e.currentTarget.style.backgroundColor = '#333333';
                e.currentTarget.style.color = '#ffffff';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = activeTestMode === 'test-report' ? '#1f1f1f' : '#2a2a2a';
              e.currentTarget.style.color = '#ffffff';
            }}
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
            className="gap-2 text-white hover:!bg-[#2a2a2a] hover:!text-white"
            style={{ backgroundColor: 'transparent', color: '#ffffff' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2a2a2a';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#ffffff';
            }}
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
        <ResizablePanel defaultSize={60}>
          <EditPanel />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={40}>
          <PreviewPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
      </div>
    </div>
  );
}
