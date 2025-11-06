import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { DetailJob } from '@/types/job';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isValcreJobNumber } from '@/config/valcre';

interface ClickUpActionProps {
  job: DetailJob;
  jobDetails?: any; // To check for job number
  onTaskCreated?: (taskId: string, taskUrl: string) => void;
}

const ClickUpAction: React.FC<ClickUpActionProps> = ({ job, jobDetails, onTaskCreated }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if we have a Valcre job number
  const hasJobNumber = isValcreJobNumber(jobDetails?.jobNumber);
  const hasClickUpTask = !!job.clickup_task_id || !!job.clickup_task_url;

  console.log('🔍 [ClickUp] Component state:', {
    jobId: job.id,
    jobNumber: jobDetails?.jobNumber,
    hasJobNumber,
    hasClickUpTask,
    clickupTaskId: job.clickup_task_id,
    clickupTaskUrl: job.clickup_task_url
  });

  const handleClick = async () => {
    console.log('🖱️ [ClickUp] Button clicked');

    // If task exists, open it
    if (job.clickup_task_url) {
      console.log('✅ [ClickUp] Opening existing task:', job.clickup_task_url);
      window.open(job.clickup_task_url, '_blank');
      return;
    }

    // Don't create if no job number
    if (!hasJobNumber) {
      console.warn('⚠️ [ClickUp] No VAL job number found - cannot create task');
      console.warn('⚠️ [ClickUp] jobDetails?.jobNumber:', jobDetails?.jobNumber);
      setError('Create a Valcre job first');
      return;
    }

    // Create new task
    console.log('➕ [ClickUp] Creating new ClickUp task for job:', job.id);
    setIsCreating(true);
    setError(null);

    try {
      // Call Supabase Edge Function
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ngovnamnjmexdpjtcnky.supabase.co';
      const endpoint = `${supabaseUrl}/functions/v1/create-clickup-task`;

      console.log('📡 [ClickUp] Calling edge function:', endpoint);
      console.log('📡 [ClickUp] Request body:', { jobId: job.id });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({ jobId: job.id })
      });

      console.log('📡 [ClickUp] Response status:', response.status);

      const result = await response.json();
      console.log('📡 [ClickUp] Response data:', result);

      if (result.success) {
        console.log('✅ [ClickUp] Task created successfully:', result.taskId);
        console.log('✅ [ClickUp] Task URL:', result.taskUrl);
        // Don't open immediately - let user click View button
        onTaskCreated?.(result.taskId, result.taskUrl);
      } else {
        console.error('❌ [ClickUp] Task creation failed:', result.error);
        setError(result.error || 'Failed to create task');
      }
    } catch (err) {
      console.error('❌ [ClickUp] Network error:', err);
      setError('Network error - please try again');
    } finally {
      setIsCreating(false);
      console.log('🏁 [ClickUp] Handler complete');
    }
  };

  // Show status indicator
  const getStatusIcon = () => {
    if (job.clickup_task_id) {
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    }
    if (error) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  return (
    <div className="flex items-center gap-2">
      {getStatusIcon()}
      
      {/* Show different button states based on conditions */}
      {hasClickUpTask ? (
        // Task exists - show View button
        <Button
          onClick={handleClick}
          variant="default"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View in ClickUp
        </Button>
      ) : hasJobNumber ? (
        // Has job number - can create task
        <Button
          onClick={handleClick}
          disabled={isCreating}
          variant="outline"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Task...
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4 mr-2" />
              Create ClickUp Task
            </>
          )}
        </Button>
      ) : (
        // No job number - disabled with tooltip
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  variant="outline"
                  disabled={true}
                  className="opacity-50 cursor-not-allowed"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Create ClickUp Task
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">Create a Valcre job first to enable ClickUp integration</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
};

export default ClickUpAction;