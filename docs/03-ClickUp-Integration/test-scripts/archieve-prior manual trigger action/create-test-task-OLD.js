#!/usr/bin/env node

/**
 * Create a test task in Chris's production board
 * Using the LOE Template 2025.01.09
 */

import https from 'https';

// Configuration
const CLICKUP_API_TOKEN = 'pk_10791838_U80AIXPC66YFCS56AGWT71SAPXWH6EU5';
const PRODUCTION_LIST_ID = '901402094744'; // Chris's actual job board
const TEMPLATE_ID = 't-86b3exqe8'; // LOE New Template 2025.01.09

// Test job data (simulating what would come from APR)
const testJobData = {
  valcreJobNumber: 'CAL250999', // Test job number
  clientName: 'TEST - Ben Crowe',
  propertyAddress: '123 Test Street, Calgary, AB',
  clientEmail: 'ben@valta.ca',
  clientPhone: '403-555-0123',
  clientOrganization: 'Test Company Inc',
  propertyType: 'Commercial',
  intendedUse: 'Financing',
  appraisalFee: 5500,
  retainerAmount: 2750
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

async function createTaskFromTemplate() {
  console.log('🚀 Creating test task in Chris\'s production board...\n');
  console.log('⚠️  This is the REAL production board!');
  console.log('Task will be named:', `${testJobData.valcreJobNumber} - ${testJobData.clientName}, ${testJobData.propertyAddress}`);
  console.log('\nPress Ctrl+C to cancel or wait 5 seconds to continue...');
  
  // Give time to cancel if needed
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  try {
    // Create task using the template
    const taskData = {
      name: `${testJobData.valcreJobNumber} - ${testJobData.clientName}, ${testJobData.propertyAddress}`,
      description: `Test job created from APR Hub integration
      
**Client Information:**
- Name: ${testJobData.clientName}
- Organization: ${testJobData.clientOrganization}
- Email: ${testJobData.clientEmail}
- Phone: ${testJobData.clientPhone}

**Property Details:**
- Address: ${testJobData.propertyAddress}
- Type: ${testJobData.propertyType}
- Intended Use: ${testJobData.intendedUse}

**Financial:**
- Appraisal Fee: $${testJobData.appraisalFee}
- Retainer: $${testJobData.retainerAmount}

**Job Number:** ${testJobData.valcreJobNumber}

This is a TEST task created by the APR integration.`,
      status: 'to do',
      template_id: TEMPLATE_ID // Use Chris's template
    };
    
    console.log('\n📤 Creating task...');
    const result = await clickupRequest(`/list/${PRODUCTION_LIST_ID}/task`, 'POST', taskData);
    
    if (result.id) {
      console.log('\n✅ Task created successfully!');
      console.log('Task ID:', result.id);
      console.log('Task Name:', result.name);
      console.log('URL:', result.url || `https://app.clickup.com/t/${result.id}`);
      console.log('\n📋 Check the board: https://app.clickup.com/9014181018/v/li/901402094744');
      
      // Check if template applied subtasks
      if (result.subtasks && result.subtasks.length > 0) {
        console.log('\n✅ Template subtasks applied:');
        result.subtasks.forEach(sub => {
          console.log(`  - ${sub.name}`);
        });
      }
    } else {
      console.log('❌ Error creating task:', result);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the test
console.log('================================================');
console.log('   ClickUp Production Board Test');
console.log('================================================\n');
createTaskFromTemplate();