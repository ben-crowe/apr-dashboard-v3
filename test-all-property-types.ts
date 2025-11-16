/**
 * Comprehensive Property Type Verification Test
 *
 * Tests ALL Dashboard property types to ensure they map correctly to Valcre
 * and are accepted by the Valcre API without errors.
 *
 * Usage: npx tsx test-all-property-types.ts <propertyId>
 * Example: npx tsx test-all-property-types.ts 25628739
 */

// All property types from Dashboard (including those that need mapping)
const DASHBOARD_PROPERTY_TYPES = [
  // Standard types (should pass through or convert via TYPES_FIELD_MAP)
  'Agriculture',
  'Building',
  'Healthcare',
  'Hospitality',
  'Industrial',
  'Land',
  'Manufactured Housing',
  'Multi-Family',
  'Office',
  'Retail',
  'Self-Storage',
  'Single-Family',
  'Special Purpose',
  'Unknown',

  // Legacy types (need PROPERTY_TYPE_MAP conversion)
  'Mixed Use',
  'Commercial',
  'Residential',
];

// Expected Valcre values based on our mapping
const EXPECTED_VALCRE_TYPES: Record<string, string> = {
  'Agriculture': 'Agriculture',
  'Building': 'Building',
  'Healthcare': 'HealthCare', // PascalCase with capital C
  'Hospitality': 'Hospitality',
  'Industrial': 'Industrial',
  'Land': 'Land',
  'Manufactured Housing': 'ManufacturedHousing',
  'Multi-Family': 'MultiFamily',
  'Office': 'Office',
  'Retail': 'Retail',
  'Self-Storage': 'SelfStorage',
  'Single-Family': 'SingleFamily',
  'Special Purpose': 'SpecialPurpose',
  'Unknown': 'Unknown',
  'Mixed Use': 'Building',
  'Commercial': 'Building',
  'Residential': 'Building',
};

interface TestResult {
  dashboardType: string;
  expectedValcreType: string;
  actualValcreType: string | null;
  success: boolean;
  error?: string;
}

async function authenticateValcre(): Promise<string> {
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
  return authData.access_token;
}

async function updatePropertyType(token: string, propertyId: string, valcreType: string): Promise<boolean> {
  const url = `https://api-core.valcre.com/api/v1/Properties(${propertyId})`;

  const updateData = {
    Types: valcreType,
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
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return true;
}

async function getPropertyType(token: string, propertyId: string): Promise<string | null> {
  const url = `https://api-core.valcre.com/api/v1/Properties(${propertyId})`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch property: ${response.status}`);
  }

  const property = await response.json();
  return property.Types || null;
}

async function testPropertyType(
  token: string,
  propertyId: string,
  dashboardType: string
): Promise<TestResult> {
  const expectedValcreType = EXPECTED_VALCRE_TYPES[dashboardType];

  try {
    // Update property to expected Valcre type
    await updatePropertyType(token, propertyId, expectedValcreType);

    // Delay to ensure update is committed (Valcre API can be slow)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Verify the update
    const actualValcreType = await getPropertyType(token, propertyId);

    const success = actualValcreType === expectedValcreType;

    return {
      dashboardType,
      expectedValcreType,
      actualValcreType,
      success,
    };
  } catch (error: any) {
    return {
      dashboardType,
      expectedValcreType,
      actualValcreType: null,
      success: false,
      error: error.message,
    };
  }
}

async function main() {
  console.log('='.repeat(80));
  console.log('COMPREHENSIVE PROPERTY TYPE VERIFICATION TEST');
  console.log('='.repeat(80));

  const propertyId = process.argv[2] || '25628739';

  try {
    console.log('\n🔐 Authenticating with Valcre API...');
    const token = await authenticateValcre();
    console.log('✅ Authentication successful');

    console.log(`\n📋 Testing ${DASHBOARD_PROPERTY_TYPES.length} property types on Property ID: ${propertyId}\n`);

    const results: TestResult[] = [];

    // Test each property type
    for (let i = 0; i < DASHBOARD_PROPERTY_TYPES.length; i++) {
      const dashboardType = DASHBOARD_PROPERTY_TYPES[i];
      const progress = `[${i + 1}/${DASHBOARD_PROPERTY_TYPES.length}]`;

      process.stdout.write(`${progress} Testing "${dashboardType}"... `);

      const result = await testPropertyType(token, propertyId, dashboardType);
      results.push(result);

      if (result.success) {
        console.log(`✅ PASS (${result.actualValcreType})`);
      } else {
        console.log(`❌ FAIL`);
        if (result.error) {
          console.log(`    Error: ${result.error}`);
        } else {
          console.log(`    Expected: "${result.expectedValcreType}", Got: "${result.actualValcreType}"`);
        }
      }
    }

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('TEST SUMMARY');
    console.log('='.repeat(80));

    const passed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`\n✅ Passed: ${passed}/${results.length}`);
    console.log(`❌ Failed: ${failed}/${results.length}`);

    if (failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      results
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`   - ${r.dashboardType}`);
          console.log(`     Expected: "${r.expectedValcreType}"`);
          console.log(`     Got: "${r.actualValcreType}"`);
          if (r.error) console.log(`     Error: ${r.error}`);
        });
    }

    console.log('\n' + '='.repeat(80));

    if (failed === 0) {
      console.log('🎉 ALL TESTS PASSED! All property types work correctly.');
      console.log('='.repeat(80));
      process.exit(0);
    } else {
      console.log('⚠️ SOME TESTS FAILED - Fix required before deployment');
      console.log('='.repeat(80));
      process.exit(1);
    }

  } catch (error: any) {
    console.error('\n❌ Test execution failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

main();
