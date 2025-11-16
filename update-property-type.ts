/**
 * Update a property's Types field in Valcre
 *
 * Usage: npx tsx update-property-type.ts <propertyId> <types>
 * Example: npx tsx update-property-type.ts 25628721 "MultiFamily"
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

async function updatePropertyTypes(token: string, propertyId: string, types: string) {
  console.log(`📝 Updating Property ${propertyId}...`);
  console.log(`   Setting Types = "${types}"\n`);

  const url = `https://api-core.valcre.com/api/v1/Properties(${propertyId})`;

  const updateData = {
    Types: types,
  };

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update property: ${response.status} - ${errorText}`);
  }

  const responseText = await response.text();
  console.log('✅ Property updated successfully');
  console.log('Response:', responseText || 'No content (success)');

  return responseText;
}

async function main() {
  try {
    const propertyId = process.argv[2] || '25628721';
    const types = process.argv[3] || 'MultiFamily';

    const token = await authenticateValcre();
    await updatePropertyTypes(token, propertyId, types);

    console.log('\n✅ Done');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

main();
