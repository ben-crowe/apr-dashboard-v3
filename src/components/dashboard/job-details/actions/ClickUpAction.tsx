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
import { supabase } from '@/integrations/supabase/client';

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
      // Get current user for OAuth token lookup
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.warn('⚠️ [ClickUp] User authentication check failed:', authError.message);
        console.warn('⚠️ [ClickUp] Edge Function will use fallback token');
      } else if (!user) {
        console.warn('⚠️ [ClickUp] User not authenticated - Edge Function will use fallback token');
      } else {
        console.log('✅ [ClickUp] User authenticated:', user.id);
      }

      // Call Supabase Edge Function
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ngovnamnjmexdpjtcnky.supabase.co';
      const endpoint = `${supabaseUrl}/functions/v1/create-clickup-task`;

      const requestBody = {
        jobId: job.id,
        userId: user?.id  // OAuth lookup, falls back to env var if null
      };

      console.log('📡 [ClickUp] Calling edge function:', endpoint);
      console.log('📡 [ClickUp] Request body:', requestBody);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify(requestBody)
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
      return <CheckCircle2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
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
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClick}
          className="border-gray-200 dark:border-slate-700/50 bg-white dark:bg-secondary text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-slate-600/60 hover:bg-transparent dark:hover:bg-transparent transition-colors text-sm font-medium"
        >
          <ExternalLink className="w-4 h-4" />
          View in ClickUp
        </Button>
      ) : hasJobNumber ? (
        // Has job number - can create task
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={isCreating}
          className="border-gray-200 dark:border-slate-700/50 bg-white dark:bg-secondary text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-slate-600/60 hover:bg-transparent dark:hover:bg-transparent transition-colors text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating Task...
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4" />
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
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={true}
                  className="border-gray-200 dark:border-slate-700/50 bg-white dark:bg-secondary text-gray-400 dark:text-gray-600 cursor-not-allowed text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
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