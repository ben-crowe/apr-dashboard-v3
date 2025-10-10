import { createClickUpTask } from '@/utils/webhooks/clickup';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: Request) {
  try {
    const { jobId } = await request.json();
    
    if (!jobId) {
      return Response.json(
        { success: false, error: 'Job ID required' },
        { status: 400 }
      );
    }
    
    // Get job details
    const { data: job, error } = await supabase
      .from('job_submissions')
      .select('*')
      .eq('id', jobId)
      .single();
    
    if (error || !job) {
      return Response.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }
    
    // Check if task already exists
    if (job.clickup_task_id) {
      return Response.json({
        success: true,
        taskId: job.clickup_task_id,
        taskUrl: job.clickup_task_url,
        existing: true
      });
    }
    
    // Create ClickUp task
    const result = await createClickUpTask(job, job.job_number, true);
    
    if (result.success) {
      // Update database
      await supabase
        .from('job_submissions')
        .update({
          clickup_task_id: result.taskId,
          clickup_task_url: result.taskUrl
        })
        .eq('id', jobId);
    }
    
    return Response.json(result);
    
  } catch (error) {
    console.error('Error creating ClickUp task:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Also export as default for older Next.js versions
export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const request = new Request(req.url, {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: req.headers,
    });
    
    const response = await POST(request);
    const result = await response.json();
    
    res.status(response.status).json(result);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}