import { useEffect } from 'react';
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
  const generatePreview = useReportBuilderStore((state) => state.generatePreview);
  const loadFullTestData = useReportBuilderStore((state) => state.loadFullTestData);

  // Generate preview on mount to show any pre-loaded data (e.g., from TDD)
  useEffect(() => {
    generatePreview();
  }, [generatePreview]);

  const handleLoadTestData = async () => {
    await loadFullTestData();
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
          <Button
            onClick={handleLoadTestData}
            variant="ghost"
            size="sm"
            className="gap-2 text-white border hover:!text-white"
            style={{
              backgroundColor: '#2a2a2a',
              borderColor: '#4b5563',
              color: '#ffffff'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#333333';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2a2a2a';
              e.currentTarget.style.color = '#ffffff';
            }}
            title="Load ALL fields from test data for full mapping validation"
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
