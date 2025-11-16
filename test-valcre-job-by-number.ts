/**
 * Query a Valcre job by VAL number
 *
 * Usage: npx tsx test-valcre-job-by-number.ts <valNumber>
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

async function fetchJobByNumber(token: string, valNumber: string) {
  console.log(`📋 Fetching job ${valNumber}...\n`);

  // Query job by Number field with expanded Property data
  const url = `https://api-core.valcre.com/api/v1/Jobs?$filter=Number eq '${valNumber}'&$expand=Property`;

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

  const data = await response.json();

  if (!data.value || data.value.length === 0) {
    throw new Error(`No job found with number ${valNumber}`);
  }

  return data.value[0];
}

async function main() {
  try {
    const valNumber = process.argv[2] || 'VAL251031';

    const token = await authenticateValcre();
    const job = await fetchJobByNumber(token, valNumber);

    console.log('='.repeat(80));
    console.log(`JOB ${valNumber} VERIFICATION`);
    console.log('='.repeat(80));

    console.log('\n📋 JOB DETAILS:');
    console.log(`   Job ID: ${job.Id}`);
    console.log(`   VAL Number: ${job.Number}`);
    console.log(`   Job Name: ${job.Name}`);
    console.log(`   Status: ${job.Status}`);
    console.log(`   Property ID: ${job.PropertyId}`);

    if (job.Property) {
      console.log('\n📦 PROPERTY DETAILS:');
      console.log(`   Property Name: ${job.Property.Name}`);
      console.log(`   PropertyType field: "${job.Property.PropertyType || 'NOT SET'}"`);
      console.log(`   Types field: "${job.Property.Types || 'NOT SET'}"`);
      console.log(`   Address: ${job.Property.AddressStreet}, ${job.Property.AddressCity}, ${job.Property.AddressState}`);

      // Verify Multi-Family mapping
      if (job.Property.Types?.includes('MultiFamily')) {
        console.log('\n✅ SUCCESS! Types field contains "MultiFamily" - fix is working!');
      } else {
        console.log('\n⚠️ WARNING: Types field does not contain "MultiFamily"');
        console.log(`   Current value: "${job.Property.Types}"`);
      }
    } else {
      console.log('\n⚠️ No Property data in response');
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ Verification complete');
    console.log('='.repeat(80));

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

main();
