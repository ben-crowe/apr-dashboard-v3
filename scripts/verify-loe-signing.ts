#!/usr/bin/env tsx
/**
 * Verify LOE Signing - Check if webhook processed correctly
 * 
 * Usage:
 *   tsx scripts/verify-loe-signing.ts [jobId]
 * 
 * If no jobId provided, shows latest signed LOE
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ngovnamnjmexdpjtcnky.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nb3ZuYW1uam1leGRwanRjbmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTk0NzAsImV4cCI6MjA1NzI5NTQ3MH0.i5pxHZ6Uvo1kcyws-C0tSegs35pA7tMO287_gYXIkGQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyLOESigning(jobId?: string) {
  console.log('🔍 Verifying LOE Signing Status...\n')

  if (jobId) {
    // Check specific job
    console.log(`Checking job: ${jobId}\n`)

    const { data: job, error: jobError } = await supabase
      .from('job_submissions')
      .select('id, status, property_name, clickup_task_id, clickup_task_url, updated_at')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      console.error('❌ Job not found:', jobError?.message)
      return
    }

    const { data: loeDetails, error: loeError } = await supabase
      .from('job_loe_details')
      .select('signed_document_url, docuseal_submission_id, clickup_task_id')
      .eq('job_id', jobId)
      .single()

    console.log('📋 Job Details:')
    console.log(`   ID: ${job.id}`)
    console.log(`   Property: ${job.property_name || 'N/A'}`)
    console.log(`   Status: ${job.status}`)
    console.log(`   Updated: ${new Date(job.updated_at).toLocaleString()}`)
    console.log('')

    if (loeDetails) {
      console.log('📄 LOE Details:')
      console.log(`   Signed Document URL: ${loeDetails.signed_document_url || 'N/A'}`)
      console.log(`   DocuSeal Submission ID: ${loeDetails.docuseal_submission_id || 'N/A'}`)
      console.log(`   ClickUp Task ID: ${loeDetails.clickup_task_id || job.clickup_task_id || 'N/A'}`)
      console.log('')
    }

    // Verification
    console.log('✅ Verification:')
    const checks = {
      'Job Status = loe_signed': job.status === 'loe_signed',
      'Signed Document URL Exists': !!loeDetails?.signed_document_url,
      'ClickUp Task ID Exists': !!loeDetails?.clickup_task_id || !!job.clickup_task_id,
    }

    Object.entries(checks).forEach(([check, passed]) => {
      console.log(`   ${passed ? '✅' : '❌'} ${check}`)
    })

    if (job.clickup_task_url) {
      console.log(`\n🔗 ClickUp Task: ${job.clickup_task_url}`)
    }

  } else {
    // Show latest signed LOEs (by job status)
    console.log('📊 Latest Jobs with Status "loe_signed":\n')

    const { data: signedJobs, error } = await supabase
      .from('job_submissions')
      .select('id, status, property_name, clickup_task_id, clickup_task_url, updated_at')
      .eq('status', 'loe_signed')
      .order('updated_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('❌ Error:', error.message)
      return
    }

    if (!signedJobs || signedJobs.length === 0) {
      console.log('⚠️  No jobs with status "loe_signed" found')
      console.log('   (This might mean the webhook hasn\'t processed yet, or there\'s an issue)')
      return
    }

    signedJobs.forEach((job, index) => {
      console.log(`\n[${index + 1}] Job: ${job.id}`)
      console.log(`   Property: ${job.property_name || 'N/A'}`)
      console.log(`   Status: ${job.status}`)
      console.log(`   Updated: ${new Date(job.updated_at).toLocaleString()}`)
      console.log(`   ClickUp Task: ${job.clickup_task_id || 'N/A'}`)
      if (job.clickup_task_url) {
        console.log(`   ClickUp URL: ${job.clickup_task_url}`)
      }
    })
  }
}

// Get jobId from command line args
const jobId = process.argv[2]

verifyLOESigning(jobId).catch(console.error)
