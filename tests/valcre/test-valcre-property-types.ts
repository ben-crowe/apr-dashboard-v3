/**
 * Valcre Property Type Test Script
 *
 * This script queries existing Valcre jobs to inspect actual PropertyType
 * and Types field values, helping us determine the correct enum mapping.
 *
 * Run with: npx tsx test-valcre-property-types.ts
 */

interface ValcreJob {
  Id: number;
  Number: string;
  Name: string;
  Status: string;
  PropertyId?: number;
}

interface ValcreProperty {
  Id: number;
  Name: string;
  PropertyType?: string;
  Types?: string;
  AddressStreet?: string;
  AddressCity?: string;
  AddressState?: string;
}

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
  console.log('✅ Authentication successful');
  return authData.access_token;
}

async function fetchJobs(token: string, limit: number = 20): Promise<ValcreJob[]> {
  console.log(`\n📋 Fetching ${limit} most recent jobs...`);

  // OData query: Get recent jobs, expand to include Property data
  // Note: Removed orderby CreatedDate - field doesn't exist in Valcre API
  const url = `https://api-core.valcre.com/api/v1/Jobs?$top=${limit}&$expand=Property`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch jobs: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log(`✅ Fetched ${data.value?.length || 0} jobs`);
  return data.value || [];
}

async function fetchProperty(token: string, propertyId: number): Promise<ValcreProperty | null> {
  const url = `https://api-core.valcre.com/api/v1/Properties(${propertyId})`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error(`⚠️ Failed to fetch property ${propertyId}: ${response.status}`);
    return null;
  }

  return await response.json();
}

async function main() {
  try {
    // Authenticate
    const token = await authenticateValcre();

    // Fetch recent jobs
    const jobs = await fetchJobs(token, 30);

    console.log('\n' + '='.repeat(80));
    console.log('VALCRE PROPERTY TYPE ANALYSIS');
    console.log('='.repeat(80));

    const propertyTypeStats: Record<string, number> = {};
    const typesFieldStats: Record<string, number> = {};
    let multiFamilyCount = 0;
    const multiFamilyExamples: Array<{job: string, propertyType?: string, types?: string}> = [];

    // Process each job
    for (const job of jobs) {
      if (!job.PropertyId) {
        console.log(`\n⚠️ Job ${job.Number} - No property linked`);
        continue;
      }

      // Fetch the property details
      const property = await fetchProperty(token, job.PropertyId);

      if (!property) {
        console.log(`\n⚠️ Job ${job.Number} - Property ${job.PropertyId} not found`);
        continue;
      }

      // Track statistics
      if (property.PropertyType) {
        propertyTypeStats[property.PropertyType] = (propertyTypeStats[property.PropertyType] || 0) + 1;
      }

      if (property.Types) {
        // Types can be comma-separated, so track each type separately
        const types = property.Types.split(',').map(t => t.trim());
        types.forEach(type => {
          typesFieldStats[type] = (typesFieldStats[type] || 0) + 1;
        });
      }

      // Check for Multi-Family in either field (case-insensitive, various formats)
      const typesLower = property.Types?.toLowerCase() || '';
      const propertyTypeLower = property.PropertyType?.toLowerCase() || '';
      const hasMultiFamilyInTypes = typesLower.includes('multi') && typesLower.includes('family');
      const hasMultiFamilyInPropertyType = propertyTypeLower.includes('multi') && propertyTypeLower.includes('family');

      if (hasMultiFamilyInTypes || hasMultiFamilyInPropertyType) {
        multiFamilyCount++;
        multiFamilyExamples.push({
          job: job.Number,
          propertyType: property.PropertyType,
          types: property.Types,
        });

        // Log the first 5 Multi-Family examples in detail
        if (multiFamilyCount <= 5) {
          console.log(`\n🏢 Multi-Family Property Found:`);
          console.log(`   Job: ${job.Number}`);
          console.log(`   Property Name: ${property.Name}`);
          console.log(`   Address: ${property.AddressStreet}, ${property.AddressCity}, ${property.AddressState}`);
          console.log(`   PropertyType field: "${property.PropertyType || 'NOT SET'}"`);
          console.log(`   Types field: "${property.Types || 'NOT SET'}"`);
          console.log(`   Property ID: ${property.Id}`);
        }
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(80));
    console.log('SUMMARY STATISTICS');
    console.log('='.repeat(80));

    console.log(`\n📊 PropertyType Field Distribution (${Object.keys(propertyTypeStats).length} unique values):`);
    Object.entries(propertyTypeStats)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        console.log(`   ${type.padEnd(25)} - ${count} jobs`);
      });

    console.log(`\n📊 Types Field Distribution (${Object.keys(typesFieldStats).length} unique values):`);
    Object.entries(typesFieldStats)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        console.log(`   ${type.padEnd(25)} - ${count} occurrences`);
      });

    console.log(`\n🔍 Multi-Family Analysis:`);
    console.log(`   Total Multi-Family properties found: ${multiFamilyCount}`);

    if (multiFamilyExamples.length > 0) {
      console.log(`\n   All Multi-Family Examples (${multiFamilyExamples.length}):`);
      multiFamilyExamples.forEach(ex => {
        console.log(`   - Job ${ex.job}: PropertyType="${ex.propertyType || 'NONE'}", Types="${ex.types || 'NONE'}"`);
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log('KEY FINDINGS');
    console.log('='.repeat(80));

    // Analyze if Multi-Family appears in PropertyType or Types field
    const hasMultiFamilyInPropertyTypeEnum = Object.keys(propertyTypeStats).some(
      type => type.toLowerCase().includes('multi') || type.toLowerCase().includes('family')
    );
    const hasMultiFamilyInTypesEnum = Object.keys(typesFieldStats).some(
      type => type.toLowerCase().includes('multi') || type.toLowerCase().includes('family')
    );

    console.log(`\n✅ Multi-Family appears in PropertyType field enum: ${hasMultiFamilyInPropertyTypeEnum ? 'YES' : 'NO'}`);
    console.log(`✅ Multi-Family appears in Types field: ${hasMultiFamilyInTypesEnum ? 'YES' : 'NO'}`);

    if (multiFamilyExamples.length > 0) {
      const exampleWithPropertyType = multiFamilyExamples.find(ex => ex.propertyType?.includes('Multi-Family'));
      const exampleWithTypes = multiFamilyExamples.find(ex => ex.types?.includes('Multi-Family'));

      if (exampleWithPropertyType) {
        console.log(`\n🎯 RECOMMENDATION: Multi-Family IS VALID in PropertyType field!`);
        console.log(`   Example: Job ${exampleWithPropertyType.job} has PropertyType="${exampleWithPropertyType.propertyType}"`);
      } else if (exampleWithTypes) {
        console.log(`\n🎯 RECOMMENDATION: Multi-Family ONLY appears in Types field, NOT PropertyType!`);
        console.log(`   Example: Job ${exampleWithTypes.job} has Types="${exampleWithTypes.types}" but PropertyType="${exampleWithTypes.propertyType}"`);
      }
    } else {
      console.log(`\n⚠️ WARNING: No Multi-Family properties found in the ${jobs.length} most recent jobs.`);
      console.log(`   Try increasing the sample size or checking older jobs.`);
    }

    console.log('\n' + '='.repeat(80));
    console.log('NEXT STEPS');
    console.log('='.repeat(80));
    console.log(`\n1. Review the PropertyType field values above`);
    console.log(`2. Confirm if "Multi-Family" appears in PropertyType enum`);
    console.log(`3. Update PROPERTY_TYPE_MAP in api/valcre.ts accordingly`);
    console.log(`4. Test Multi-Family job creation again\n`);

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Run the script
main();
