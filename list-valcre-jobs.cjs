#!/usr/bin/env node

const fetch = require('node-fetch');

const AUTH_CONFIG = {
  url: 'https://auth.valcre.com/oauth/token',
  grant_type: 'password',
  client_id: 'c9AfkQFS3Scq8YvRsl1DtGbbMRaDDSoh',
  client_secret: '6VLkSjdT-EvELiIh8QLNv-sQrgy-o_P2KXrHn1g1_Sq9p9yPn73NxuBGtKGaO2kZ',
  username: 'chris.chornohos@valta.ca',
  password: 'Valvalta1!',
  scope: 'offline_access',
  audience: 'https://valcre.api.com'
};

async function main() {
  console.log('🔐 Authenticating...');
  const authResponse = await fetch(AUTH_CONFIG.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(AUTH_CONFIG)
  });
  const { access_token } = await authResponse.json();
  console.log('✅ Authenticated\n');

  // Get recent jobs (last 20)
  console.log('📥 Fetching recent Valcre jobs...\n');
  const jobsResp = await fetch('https://api-core.valcre.com/api/v1/Jobs?$top=20&$orderby=Id desc&$expand=Property,Client,PropertyContact', {
    headers: { 'Authorization': `Bearer ${access_token}` }
  });

  const jobsData = await jobsResp.json();
  const jobs = jobsData.value;

  console.log('=== RECENT VALCRE JOBS ===\n');

  jobs.forEach((job, i) => {
    const propertyName = job.Property?.PropertyName || 'No Property';
    const address = job.Property?.AddressStreet || 'No Address';
    const client = job.Client ? `${job.Client.FirstName} ${job.Client.LastName}` : 'No Client';
    const jobNumber = job.JobNumber || `VAL${job.Id}`;

    console.log(`${i + 1}. ${jobNumber} - ${propertyName}`);
    console.log(`   Address: ${address}`);
    console.log(`   Client: ${client}`);
    console.log(`   Valcre ID: ${job.Id}`);
    console.log(`   Created: ${job.CreateDateTime || 'Unknown'}`);
    console.log('');
  });

  // Find jobs ending in 15 or after
  console.log('\n=== JOBS TO DELETE (Job ID ending in 15 or higher) ===\n');
  const recentJobs = jobs.filter(job => {
    const lastTwoDigits = job.Id % 100;
    return lastTwoDigits >= 15;
  });

  if (recentJobs.length === 0) {
    console.log('No jobs found with ID ending in 15 or higher in last 20 jobs.');
    return;
  }

  recentJobs.forEach((job, i) => {
    const propertyName = job.Property?.PropertyName || 'No Property';
    const address = job.Property?.AddressStreet || 'No Address';
    const client = job.Client ? `${job.Client.FirstName} ${job.Client.LastName}` : 'No Client';
    const jobNumber = job.JobNumber || `VAL${job.Id}`;

    console.log(`${i + 1}. ${jobNumber} (ID: ${job.Id}) - ${propertyName}`);
    console.log(`   ${address}`);
    console.log(`   Contact: ${client}`);
    console.log('');
  });
}

main().catch(console.error);
