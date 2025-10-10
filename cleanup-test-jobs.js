#!/usr/bin/env node
/**
 * Cleanup Script: Delete old test jobs, keep the 3-4 most recent
 * Created: October 10, 2025
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ngovnamnjmexdpjtcnky.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nb3ZuYW1uam1leGRwanRjbmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTk0NzAsImV4cCI6MjA1NzI5NTQ3MH0.i5pxHZ6Uvo1kcyws-C0tSegs35pA7tMO287_gYXIkGQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function cleanupJobs() {
  console.log("🔍 Fetching all jobs...\n");

  // Get all jobs ordered by creation date (newest first)
  const { data: jobs, error } = await supabase
    .from("job_submissions")
    .select("id, created_at, job_number, property_name, status")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error fetching jobs:", error);
    return;
  }

  console.log(`Found ${jobs.length} total jobs\n`);

  // Show all jobs
  console.log("📋 Current Jobs:");
  jobs.forEach((job, index) => {
    console.log(
      `${index + 1}. [${job.job_number || "No number"}] ${job.property_name || "Unnamed"} - ${job.status} (${new Date(job.created_at).toLocaleDateString()})`,
    );
  });

  // Keep the 4 most recent jobs
  const KEEP_COUNT = 4;
  const jobsToKeep = jobs.slice(0, KEEP_COUNT);
  const jobsToDelete = jobs.slice(KEEP_COUNT);

  console.log(`\n✅ Keeping ${KEEP_COUNT} most recent jobs:`);
  jobsToKeep.forEach((job) => {
    console.log(
      `   - [${job.job_number || "No number"}] ${job.property_name || "Unnamed"}`,
    );
  });

  if (jobsToDelete.length === 0) {
    console.log("\n✨ No jobs to delete - only 4 or fewer jobs exist.");
    return;
  }

  console.log(`\n🗑️  Will delete ${jobsToDelete.length} old jobs:`);
  jobsToDelete.forEach((job) => {
    console.log(
      `   - [${job.job_number || "No number"}] ${job.property_name || "Unnamed"}`,
    );
  });

  // Ask for confirmation
  console.log(
    "\n⚠️  WARNING: This will permanently delete these jobs and related data.",
  );
  console.log("Press Ctrl+C to cancel, or wait 5 seconds to proceed...\n");

  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log("🔥 Deleting jobs...\n");

  const idsToDelete = jobsToDelete.map((job) => job.id);

  // Delete related data first (due to foreign keys)
  console.log("   Deleting job_loe_details...");
  await supabase.from("job_loe_details").delete().in("job_id", idsToDelete);

  console.log("   Deleting job_building_info...");
  await supabase.from("job_building_info").delete().in("job_id", idsToDelete);

  console.log("   Deleting job_property_details...");
  await supabase
    .from("job_property_details")
    .delete()
    .in("job_id", idsToDelete);

  console.log("   Deleting job_client_info...");
  await supabase.from("job_client_info").delete().in("job_id", idsToDelete);

  console.log("   Deleting job_files...");
  await supabase.from("job_files").delete().in("job_id", idsToDelete);

  console.log("   Deleting jobs...");
  const { error: deleteError } = await supabase
    .from("job_submissions")
    .delete()
    .in("id", idsToDelete);

  if (deleteError) {
    console.error("❌ Error deleting jobs:", deleteError);
    return;
  }

  console.log(`\n✅ Successfully deleted ${jobsToDelete.length} jobs!`);
  console.log(`✅ Kept ${KEEP_COUNT} most recent jobs.`);
}

cleanupJobs().catch(console.error);
