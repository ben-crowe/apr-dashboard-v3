/**
 * Query a specific Valcre job to inspect its structure
 *
 * Usage: npx tsx test-valcre-job.ts <jobId>
 */

async function authenticateValcre(): Promise<string> {
  console.log('🔐 Authenticating with Valcre API...');

  const authBody = {
    grant_type: 'password',
    client_id: process.env.VALCRE_CLIENT_ID || 'c9AfkQFS3Scq8YvRsl1DtGbbMRaDDSoh',
    client_secret: process.env.VALCRE_CLIENT_SECRET || '6VLkSjdT-EvELiIh8QLNv-sQrgy-o_P2KXrHn1g1_Sq9p9yPn73NxuBGtKGaO2kZ',
    username: process.env.VALCRE_USERNAME || 'chris.chornohos@valta.ca',
    password: process.env.VALCRE_PASSWORD || 'Valvalta1!',
    scope: 'offline_access',
    audience: 'https://valcre.api.com',
  };

  const authResponse = await fetch('https://auth.valcre.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(authBody),
  });

  if (!authResponse.ok) {
    const errorData = await authResponse.json();
    throw new Error(`Authentication failed: ${JSON.stringify(errorData)}`);
  }

  const authData = await authResponse.json();
  console.log('✅ Authentication successful\n');
  return authData.access_token;
}

async function fetchJob(token: string, jobId: string) {
  console.log(`📋 Fetching job ${jobId}...\n`);

  // Query job with expanded Property data
  const url = `https://api-core.valcre.com/api/v1/Jobs(${jobId})?$expand=Property`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch job: ${response.status} - ${errorText}`);
  }

  const job = await response.json();
  return job;
}

async function main() {
  try {
    const jobId = process.argv[2] || '723743';

    const token = await authenticateValcre();
    const job = await fetchJob(token, jobId);

    console.log('='.repeat(80));
    console.log(`JOB ${jobId} DETAILS`);
    console.log('='.repeat(80));
    console.log(JSON.stringify(job, null, 2));
    console.log('='.repeat(80));

    if (job.Property) {
      console.log('\n📦 PROPERTY DETAILS:');
      console.log(`   Property ID: ${job.Property.Id}`);
      console.log(`   Property Name: ${job.Property.Name}`);
      console.log(`   PropertyType field: "${job.Property.PropertyType || 'NOT SET'}"`);
      console.log(`   Types field: "${job.Property.Types || 'NOT SET'}"`);
      console.log(`   Address: ${job.Property.AddressStreet}, ${job.Property.AddressCity}, ${job.Property.AddressState}`);
    } else {
      console.log('\n⚠️ No Property data in response');
    }

    console.log('\n✅ Done');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

main();
