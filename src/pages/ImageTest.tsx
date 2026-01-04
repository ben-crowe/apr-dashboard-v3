/**
 * Image Test Page
 * Standalone test page for the Image Configurator feature
 */

import { ImageConfiguratorDemo } from '@/features/image-configurator';

export default function ImageTest() {
  // Use a test job ID for demo purposes
  const testJobId = 'test-job-001';

  return (
    <div className="min-h-screen bg-slate-950">
      <ImageConfiguratorDemo jobId={testJobId} className="h-screen" />
    </div>
  );
}
