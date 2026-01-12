#!/usr/bin/env node

/**
 * ClickUp Template Finder
 * Searches for task templates in workspaces
 */

import https from 'https';

// Ben's ClickUp API Token
const CLICKUP_API_TOKEN = 'pk_10791838_U80AIXPC66YFCS56AGWT71SAPXWH6EU5';

// Function to make ClickUp API requests
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

async function findTemplates() {
  console.log('🔍 Searching for ClickUp Templates...\n');
  
  try {
    // Get teams
    const teams = await clickupRequest('/team');
    
    for (const team of teams.teams) {
      console.log(`\n📁 Workspace: ${team.name} (ID: ${team.id})`);
      console.log('='.repeat(50));
      
      // Method 1: Try getting task templates from team level
      console.log('\n  Checking for task templates...');
      const templates = await clickupRequest(`/team/${team.id}/task_template`);
      
      if (templates && templates.templates && templates.templates.length > 0) {
        console.log(`  ✅ Found ${templates.templates.length} template(s):`);
        for (const template of templates.templates) {
          console.log(`     - ${template.name} (ID: ${template.id})`);
        }
      } else {
        console.log('  ℹ️ No templates at team level');
      }
      
      // Method 2: Check spaces for templates
      const spaces = await clickupRequest(`/team/${team.id}/space?archived=false`);
      
      for (const space of spaces.spaces) {
        console.log(`\n  📂 Space: ${space.name} (ID: ${space.id})`);
        
        // Check for template lists (often named "Templates" or similar)
        const lists = await clickupRequest(`/space/${space.id}/list?archived=false`);
        
        if (lists.lists) {
          for (const list of lists.lists) {
            // Look for lists with "template" in the name
            if (list.name.toLowerCase().includes('template') || 
                list.name.toLowerCase().includes('loe') ||
                list.name.toLowerCase().includes('appraisal')) {
              console.log(`     📋 Potential template list: ${list.name} (ID: ${list.id})`);
              
              // Get tasks in this list to see template structure
              const tasks = await clickupRequest(`/list/${list.id}/task?archived=false`);
              if (tasks.tasks && tasks.tasks.length > 0) {
                console.log(`        Found ${tasks.tasks.length} task(s) in this list:`);
                for (const task of tasks.tasks.slice(0, 3)) { // Show first 3
                  console.log(`          - ${task.name}`);
                  
                  // Check for custom fields (important for templates)
                  if (task.custom_fields && task.custom_fields.length > 0) {
                    console.log(`            Custom fields: ${task.custom_fields.map(f => f.name).join(', ')}`);
                  }
                }
              }
            }
          }
        }
        
        // Check folders too
        const folders = await clickupRequest(`/space/${space.id}/folder?archived=false`);
        if (folders.folders) {
          for (const folder of folders.folders) {
            if (folder.name.toLowerCase().includes('template')) {
              console.log(`     📁 Template folder found: ${folder.name} (ID: ${folder.id})`);
              
              // Get lists in folder
              const folderLists = await clickupRequest(`/folder/${folder.id}/list?archived=false`);
              if (folderLists.lists) {
                for (const list of folderLists.lists) {
                  console.log(`        - ${list.name} (ID: ${list.id})`);
                }
              }
            }
          }
        }
      }
    }
    
    console.log('\n\n💡 TIP: If you see template tasks in Chris\'s workspace,');
    console.log('   we can duplicate their structure (custom fields, etc.)');
    console.log('   into your Automation Team Board for testing!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the search
findTemplates();