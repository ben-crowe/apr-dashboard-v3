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

  // Get recent jobs - filter for VAL251015 and higher
  console.log('📥 Fetching Valcre jobs with JobNumber >= VAL251015...\n');
  const jobsResp = await fetch('https://api-core.valcre.com/api/v1/Jobs?$filter=JobNumber ge \'VAL251015\'&$orderby=JobNumber desc&$expand=Property,Client,PropertyContact', {
    headers: { 'Authorization': `Bearer ${access_token}` }
  });

  const jobsData = await jobsResp.json();
  const jobs = jobsData.value;

  console.log('=== JOBS SINCE VAL251015 ===\n');

  jobs.forEach((job, i) => {
    const propertyName = job.Property?.PropertyName || 'No Property';
    const address = job.Property?.AddressStreet || 'No Address';
    const city = job.Property?.AddressCity || '';
    const fullAddress = city ? `${address}, ${city}` : address;
    const client = job.Client ? `${job.Client.FirstName} ${job.Client.LastName}` : 'No Client';
    const jobNumber = job.JobNumber;

    console.log(`${i + 1}. ${jobNumber} - ${propertyName}`);
    console.log(`   ${fullAddress}`);
    console.log(`   Client: ${client}`);
    console.log(`   Valcre ID: ${job.Id}`);
    console.log('');
  });

  console.log(`\nTotal: ${jobs.length} jobs found\n`);
}

main().catch(console.error);
