/**
 * Seed Test Job Data for Report Builder Pre-population Testing
 *
 * This script inserts a sample job record that can be used to test
 * the Report Builder pre-population flow.
 *
 * Usage:
 *   npm run seed:test-job
 *   # or
 *   npx tsx scripts/seed-test-job.ts
 *
 * Prerequisites:
 * - .env.local file with VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY
 * - For local Supabase: ensure `supabase start` is running
 * - For production: use the production URL and anon key
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing required environment variables:');
  console.error('  VITE_SUPABASE_URL:', SUPABASE_URL ? 'set' : 'MISSING');
  console.error('  VITE_SUPABASE_PUBLISHABLE_KEY:', SUPABASE_KEY ? 'set' : 'MISSING');
  console.error('');
  console.error('Please ensure .env.local contains:');
  console.error('  VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.error('  VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Test job ID - using a predictable ID for easy testing
const TEST_JOB_ID = 'test-job-report-builder-001';

// ============================================================================
// TEST DATA
// ============================================================================

const testJobSubmission = {
  id: TEST_JOB_ID,
  // Client Information
  client_first_name: 'John',
  client_last_name: 'Smith',
  client_email: 'john.smith@abcinvestments.com',
  client_phone: '604-555-1234',
  client_title: 'Director of Acquisitions',
  client_organization: 'ABC Investments Ltd.',
  client_address: '1500 - 1055 West Georgia Street, Vancouver, BC V6E 3P3',

  // Property Information
  property_name: 'Riverside Apartments',
  property_address: '123 Main Street, Vancouver, BC V6B 2W9',
  property_type: 'Multi-Family Residential',
  intended_use: 'Financing',
  asset_condition: 'Good',
  valuation_premises: 'Market Value',
  notes: 'Test job for Report Builder pre-population testing',

  // Property Contact (same as client for this test)
  property_contact_first_name: 'John',
  property_contact_last_name: 'Smith',
  property_contact_email: 'john.smith@abcinvestments.com',
  property_contact_phone: '604-555-1234',
  same_as_client_contact: true,

  // Status
  status: 'in_progress',
  job_number: 'VAL-2025-TEST-001'
};

const testLoeDetails = {
  job_id: TEST_JOB_ID,
  job_number: 'VAL-2025-TEST-001',
  property_rights_appraised: 'Fee Simple',
  valuation_premises: 'Market Value',
  delivery_date: '2025-02-15',
  scope_of_work: 'Complete appraisal of the subject property including physical inspection, market analysis, and value conclusion.',
  special_instructions: 'Please coordinate property access with building manager.',
  report_type: 'Narrative Appraisal Report',
  payment_terms: 'Net 30',
  appraisal_fee: 4500,
  retainer_amount: '50%',
  disbursement_percentage: '3%',
  internal_comments: 'Test job - do not bill'
};

const testPropertyInfo = {
  job_id: TEST_JOB_ID,
  // Building Details
  year_built: '1985',
  building_size: '45,000 SF',
  legal_description: 'Lot 1, Block 2, Plan BCP12345, District Lot 526, Group 1, NWD',
  number_of_units: 48,
  parking_spaces: 52,

  // Zoning and Land Use
  zoning_classification: 'RM-4 (Multiple Dwelling)',
  zone_abbreviation: 'RM-4',
  land_use_designation: 'Residential',
  flood_zone: 'Zone X (Minimal Flood Hazard)',
  utilities: 'All municipal utilities available: water, sewer, gas, electricity, telecommunications',

  // Parcel Information
  parcel_number: '015-432-789',
  usable_land_sf: 32500,
  usable_land_acres: 0.75,
  gross_land_sf: 35000,
  gross_land_acres: 0.80,

  // Assessment Information
  assessed_value: 12500000,
  taxes: 85000,
  assessment_year: '2024',
  land_assessment_value: 8500000,
  improved_assessment_value: 4000000,
  total_assessment_value: 12500000
};

// ============================================================================
// MAIN FUNCTION
// ============================================================================

async function seedTestJob() {
  console.log('');
  console.log('='.repeat(60));
  console.log('Seeding Test Job for Report Builder');
  console.log('='.repeat(60));
  console.log('');

  // Determine environment
  const isLocal = SUPABASE_URL?.includes('127.0.0.1') || SUPABASE_URL?.includes('localhost');
  console.log('Environment:', isLocal ? 'LOCAL' : 'PRODUCTION');
  console.log('Supabase URL:', SUPABASE_URL);
  console.log('Test Job ID:', TEST_JOB_ID);
  console.log('');

  if (isLocal) {
    console.log('NOTE: Using local Supabase. Ensure `supabase start` is running.');
    console.log('');
  }

  // Test connection first
  console.log('Testing connection...');
  const { error: testError } = await supabase.from('job_submissions').select('count').limit(1);

  if (testError) {
    console.error('');
    console.error('CONNECTION FAILED:', testError.message);
    console.error('');
    if (isLocal) {
      console.error('For local development:');
      console.error('  1. Run: supabase start');
      console.error('  2. Verify JWT secret matches .env.local');
      console.error('  3. Check supabase/config.toml for correct settings');
    } else {
      console.error('For production:');
      console.error('  1. Verify VITE_SUPABASE_URL is correct');
      console.error('  2. Verify VITE_SUPABASE_PUBLISHABLE_KEY is valid');
      console.error('  3. Check Supabase dashboard for any issues');
    }
    process.exit(1);
  }
  console.log('Connection successful!');
  console.log('');

  // Check if test job already exists
  const { data: existingJob, error: checkError } = await supabase
    .from('job_submissions')
    .select('id, job_number, status')
    .eq('id', TEST_JOB_ID)
    .maybeSingle();

  if (checkError) {
    console.error('Error checking for existing job:', checkError.message);
    process.exit(1);
  }

  if (existingJob) {
    console.log('Test job already exists:');
    console.log('  ID:', existingJob.id);
    console.log('  Job Number:', existingJob.job_number);
    console.log('  Status:', existingJob.status);
    console.log('');
    console.log('Deleting existing test data to refresh...');

    // Delete related records first (due to foreign keys)
    await supabase.from('job_property_info').delete().eq('job_id', TEST_JOB_ID);
    await supabase.from('job_loe_details').delete().eq('job_id', TEST_JOB_ID);
    await supabase.from('job_files').delete().eq('job_id', TEST_JOB_ID);
    await supabase.from('job_documents').delete().eq('job_id', TEST_JOB_ID);
    await supabase.from('job_submissions').delete().eq('id', TEST_JOB_ID);

    console.log('Existing test data deleted.');
    console.log('');
  }

  // Insert job submission
  console.log('1. Inserting job_submissions record...');
  const { data: jobData, error: jobError } = await supabase
    .from('job_submissions')
    .insert(testJobSubmission)
    .select()
    .single();

  if (jobError) {
    console.error('   ERROR:', jobError.message);
    if (jobError.details) console.error('   DETAILS:', jobError.details);
    if (jobError.hint) console.error('   HINT:', jobError.hint);
    process.exit(1);
  }
  console.log('   SUCCESS: Job created with ID:', jobData.id);

  // Insert LOE details
  console.log('2. Inserting job_loe_details record...');
  const { data: loeData, error: loeError } = await supabase
    .from('job_loe_details')
    .insert(testLoeDetails)
    .select()
    .single();

  if (loeError) {
    console.error('   ERROR:', loeError.message);
    if (loeError.details) console.error('   DETAILS:', loeError.details);
    if (loeError.hint) console.error('   HINT:', loeError.hint);
    process.exit(1);
  }
  console.log('   SUCCESS: LOE details created with ID:', loeData.id);

  // Insert property info
  console.log('3. Inserting job_property_info record...');
  const { data: propertyData, error: propertyError } = await supabase
    .from('job_property_info')
    .insert(testPropertyInfo)
    .select()
    .single();

  if (propertyError) {
    console.error('   ERROR:', propertyError.message);
    if (propertyError.details) console.error('   DETAILS:', propertyError.details);
    if (propertyError.hint) console.error('   HINT:', propertyError.hint);
    process.exit(1);
  }
  console.log('   SUCCESS: Property info created with ID:', propertyData.id);

  // Summary
  console.log('');
  console.log('='.repeat(60));
  console.log('Test Job Seeded Successfully!');
  console.log('='.repeat(60));
  console.log('');
  console.log('Job Details:');
  console.log('  ID:', TEST_JOB_ID);
  console.log('  Job Number:', testJobSubmission.job_number);
  console.log('  Client:', `${testJobSubmission.client_first_name} ${testJobSubmission.client_last_name}`);
  console.log('  Organization:', testJobSubmission.client_organization);
  console.log('  Property:', testJobSubmission.property_name);
  console.log('  Address:', testJobSubmission.property_address);
  console.log('  Property Type:', testJobSubmission.property_type);
  console.log('  Status:', testJobSubmission.status);
  console.log('');
  console.log('To test Report Builder pre-population:');
  console.log(`  1. Navigate to: /jobs/${TEST_JOB_ID}`);
  console.log('  2. Click "Generate Report" or navigate to Report Builder');
  console.log('  3. Verify fields are pre-populated from this job data');
  console.log('');
}

// Run the script
seedTestJob().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
