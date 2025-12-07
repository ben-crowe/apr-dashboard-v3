#!/usr/bin/env node

/**
 * ClickUp Test Task Creation - Development Environment
 * Creates task matching Stage 1 format from 03-TASK-FORMAT-VISUAL.md
 * Uses Ben's test ClickUp (safe testing)
 */

import https from 'https';

// DEVELOPMENT ENVIRONMENT (Ben's ClickUp)
const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN || 'pk_10791838_HYQNAGXSJXUJR26U258A8KCXZ5B7C9M5';
const TEST_LIST_ID = '901706896375'; // Ben's APR list
const DASHBOARD_URL_FIELD_ID = 'REPLACE_WITH_ACTUAL_FIELD_ID'; // Get this from custom field creation

// Test Job Data (matches form submission structure)
const testJobData = {
  jobId: '550e8400-e29b-41d4-a716-446655440000', // UUID for Dashboard URL
  clientFirstName: 'John',
  clientLastName: 'Smith',
  clientOrganization: 'ABC Corporation',
  clientEmail: 'john.smith@abccorp.com',
  clientPhone: '(403) 555-1234',
  propertyName: 'Sparwood McDonalds',
  propertyAddress: '2100 Middletown Place, Sparwood, BC T1K 2L3',
  propertyType: 'Commercial - Retail',
  intendedUse: 'Purchase Transaction',
  assetCondition: 'Good',
  valuationPremise: 'Market Value - As Is',
  // Property Contact fields (current production form)
  propertyContactFirstName: 'Sarah',
  propertyContactLastName: 'Johnson',
  propertyContactEmail: 'sarah.johnson@abccorp.com',
  propertyContactPhone: '(403) 555-5678',
  sameAsClientContact: false,
  notes: 'Client needs appraisal for financing purposes. Property includes drive-through and parking for 25 vehicles. Building is approximately 3,200 SF with recent renovations completed in 2023.'
};

function clickupRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.clickup.com',
      path: `/api/v2${path}`,
      method: method,
      headers: {
        'Authorization': CLICKUP_API_TOKEN,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function createTestTask() {
  console.log('🧪 Creating test task in Ben\'s test environment...\n');

  // Build Dashboard URL
  const dashboardUrl = `https://apr-dashboard-v3.vercel.app/dashboard/job/${testJobData.jobId}`;

  // Build Stage 1 Description (matches 03-TASK-FORMAT-VISUAL.md)
  const taskDescription = `📍 **NEW JOB ARRIVED - [View in APR Hub](${dashboardUrl})**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**CLIENT INFORMATION**
Name: ${testJobData.clientFirstName} ${testJobData.clientLastName}
Organization: ${testJobData.clientOrganization}
Email: ${testJobData.clientEmail}
Phone: ${testJobData.clientPhone}

**PROPERTY INFORMATION**
Property Name: ${testJobData.propertyName}
Address: ${testJobData.propertyAddress}
Property Type: ${testJobData.propertyType}
Intended Use: ${testJobData.intendedUse}
Asset Condition: ${testJobData.assetCondition}
Valuation Premise: ${testJobData.valuationPremise}

**PROPERTY CONTACT**
Name: ${testJobData.propertyContactFirstName} ${testJobData.propertyContactLastName}
Email: ${testJobData.propertyContactEmail}
Phone: ${testJobData.propertyContactPhone}

**SUBMISSION NOTES**
${testJobData.notes}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏳ Waiting for LOE Quote Preparation...`;

  try {
    // Create task
    const taskData = {
      name: `NEW SUBMISSION - ${testJobData.propertyName}, ${testJobData.propertyAddress}`,
      markdown_description: taskDescription,
      status: 'to do',
      priority: 3,
      notify_all: false
      // Note: Uncomment when custom field is created:
      // custom_fields: [
      //   {
      //     id: DASHBOARD_URL_FIELD_ID,
      //     value: dashboardUrl
      //   }
      // ]
    };

    console.log('📤 Creating task in test list...');
    const result = await clickupRequest(`/list/${TEST_LIST_ID}/task`, 'POST', taskData);

    if (result.id) {
      console.log('\n✅ Task created successfully!');
      console.log('Task ID:', result.id);
      console.log('Task Name:', result.name);
      console.log('URL:', result.url || `https://app.clickup.com/t/${result.id}`);
      console.log('\n📋 Check Ben\'s test list: https://app.clickup.com/8555561/v/li/901703694310');
    } else {
      console.log('❌ Error creating task:', result);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the test
console.log('================================================');
console.log('   ClickUp Test - Development Environment');
console.log('================================================\n');
createTestTask();
