import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ngovnamnjmexdpjtcnky.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nb3ZuYW1uam1leGRwanRjbmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTk0NzAsImV4cCI6MjA1NzI5NTQ3MH0.i5pxHZ6Uvo1kcyws-C0tSegs35pA7tMO287_gYXIkGQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSubmissions() {
  console.log('📊 Checking latest job submissions...\n');

  const { data, error } = await supabase
    .from('job_submissions')
    .select('id, property_name, created_at, clickup_task_id, clickup_task_url')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('Latest 5 submissions:\n');
  data?.forEach((submission, index) => {
    console.log(`${index + 1}. ID: ${submission.id}`);
    console.log(`   Property: ${submission.property_name}`);
    console.log(`   Created: ${new Date(submission.created_at).toLocaleString()}`);
    console.log(`   ClickUp Task ID: ${submission.clickup_task_id || 'NOT CREATED'}`);
    console.log(`   ClickUp Task URL: ${submission.clickup_task_url || 'N/A'}`);
    console.log('');
  });
}

checkSubmissions();
