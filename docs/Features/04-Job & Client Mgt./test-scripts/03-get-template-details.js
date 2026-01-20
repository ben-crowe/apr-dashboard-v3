#!/usr/bin/env node

/**
 * Get specific template details from ClickUp
 */

import https from 'https';

const CLICKUP_API_TOKEN = 'pk_10791838_U80AIXPC66YFCS56AGWT71SAPXWH6EU5';

function clickupRequest(path, method = 'GET') {
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
    req.end();
  });
}

async function getTemplateDetails() {
  console.log('📋 Getting LOE Template Details from Valta Workspace...\n');
  
  try {
    // Get the LOE New Template 2025.01.09
    const templateId = 't-86b3exqe8';
    const teamId = '9014181018'; // Valta workspace
    
    console.log(`Fetching template: LOE New Template 2025.01.09 (${templateId})`);
    console.log('='.repeat(60));
    
    // Get template details
    const template = await clickupRequest(`/team/${teamId}/task_template/${templateId}`);
    
    if (template) {
      console.log('\n📝 Template Structure:');
      console.log('Name:', template.name || 'LOE Template');
      
      if (template.status) {
        console.log('Status:', template.status.status || 'N/A');
      }
      
      if (template.description) {
        console.log('\nDescription:', template.description.substring(0, 200));
      }
      
      // Custom fields are key for APR integration!
      if (template.custom_fields && template.custom_fields.length > 0) {
        console.log('\n🔧 Custom Fields:');
        for (const field of template.custom_fields) {
          console.log(`  - ${field.name} (Type: ${field.type})`);
          if (field.type_config && field.type_config.options) {
            console.log(`    Options: ${field.type_config.options.map(o => o.name).join(', ')}`);
          }
        }
      }
      
      // Check for checklists
      if (template.checklists && template.checklists.length > 0) {
        console.log('\n✅ Checklists:');
        for (const checklist of template.checklists) {
          console.log(`  ${checklist.name}:`);
          if (checklist.items) {
            for (const item of checklist.items) {
              console.log(`    ☐ ${item.name}`);
            }
          }
        }
      }
      
      console.log('\n\n💡 To duplicate this template:');
      console.log('1. Create a new task template in your Automation-Active space');
      console.log('2. Copy these custom fields and structure');
      console.log('3. Use template ID for creating APR tasks automatically');
      
      // Save template structure for reference
      console.log('\n\n📄 Full template data saved to: template-structure.json');
      const fs = await import('fs');
      fs.writeFileSync('template-structure.json', JSON.stringify(template, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

getTemplateDetails();