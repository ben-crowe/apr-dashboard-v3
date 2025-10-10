/**
 * Network Interception - Capture Valcre API Payload
 *
 * This script monitors network requests to /api/valcre and captures
 * the exact payload being sent, including PropertyType and PropertyContact.
 *
 * No UI interaction needed - just waits for the save to happen.
 */

const { chromium } = require('playwright');
const fs = require('fs');

async function interceptValcrePayload() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  let valcrePayload = null;
  const consoleEmojis = [];

  // Intercept network requests to /api/valcre
  page.on('request', request => {
    const url = request.url();
    if (url.includes('/api/valcre')) {
      console.log('\n🎯 INTERCEPTED REQUEST TO /api/valcre');
      console.log('URL:', url);
      console.log('Method:', request.method());

      // Capture the request body
      const postData = request.postData();
      if (postData) {
        try {
          valcrePayload = JSON.parse(postData);
          console.log('\n📦 PAYLOAD CAPTURED:');
          console.log(JSON.stringify(valcrePayload, null, 2));

          // Extract the key fields we care about
          console.log('\n🔍 KEY FIELDS:');
          console.log('PropertyType:', valcrePayload.PropertyType || 'NOT FOUND');
          console.log('PropertyContact:', valcrePayload.PropertyContact || 'NOT FOUND');

          if (valcrePayload.PropertyContact) {
            console.log('\n👤 PropertyContact Details:');
            console.log('  FirstName:', valcrePayload.PropertyContact.FirstName);
            console.log('  LastName:', valcrePayload.PropertyContact.LastName);
            console.log('  Email:', valcrePayload.PropertyContact.Email);
            console.log('  PhoneNumber:', valcrePayload.PropertyContact.PhoneNumber);
          }
        } catch (e) {
          console.error('Failed to parse payload:', e.message);
        }
      }
    }
  });

  // Also capture console logs with emojis
  page.on('console', msg => {
    const text = msg.text();

    // Capture the 3 specific emoji logs we need
    if (text.includes('🏢 PropertyType from UI:') ||
        text.includes('👤 PropertyContact fields:') ||
        text.includes('📤 Full payload to /api/valcre:')) {
      consoleEmojis.push({
        timestamp: new Date().toISOString(),
        text: text
      });
      console.log('\n✅ EMOJI LOG CAPTURED:', text);
    }
  });

  try {
    console.log('🚀 Starting Valcre payload interceptor...');
    console.log('📍 Navigating to dashboard...\n');

    await page.goto('http://localhost:8080/dashboard');
    await page.waitForTimeout(3000);

    console.log('✅ Dashboard loaded');
    console.log('\n⏳ WAITING FOR SAVE...');
    console.log('Instructions:');
    console.log('1. The dashboard is now open in the browser');
    console.log('2. Open your job (if not already open)');
    console.log('3. Make a small edit or click Save');
    console.log('4. The script will capture the API payload automatically\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Wait for 60 seconds for the user to save
    await page.waitForTimeout(60000);

    // Generate report
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 CAPTURE COMPLETE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (valcrePayload) {
      console.log('✅ SUCCESS: Valcre API payload captured!');

      const report = {
        timestamp: new Date().toISOString(),
        success: true,
        payload: valcrePayload,
        propertyType: valcrePayload.PropertyType,
        propertyContact: valcrePayload.PropertyContact,
        consoleEmojis: consoleEmojis
      };

      // Save to file
      const reportPath = '/Users/bencrowe/Development/apr-dashboard-v3/VALCRE-PAYLOAD-CAPTURED.json';
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\n💾 Report saved to: ${reportPath}`);

      // Generate findings markdown
      const findings = generateFindings(report);
      const mdPath = '/Users/bencrowe/Development/apr-dashboard-v3/VALCRE-PAYLOAD-ANALYSIS.md';
      fs.writeFileSync(mdPath, findings);
      console.log(`💾 Analysis saved to: ${mdPath}\n`);

    } else {
      console.log('⚠️ No payload captured - save might not have been triggered');
      console.log('Or the request might use a different endpoint\n');

      if (consoleEmojis.length > 0) {
        console.log('📋 Console emoji logs captured:');
        consoleEmojis.forEach(log => console.log(log.text));
      }
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    console.log('Browser will close in 5 seconds...');
    await page.waitForTimeout(5000);
    await browser.close();
  }
}

function generateFindings(report) {
  let md = `# Valcre API Payload Analysis

**Captured**: ${report.timestamp}

---

## ✅ Payload Status

`;

  if (report.propertyType) {
    md += `### PropertyType: PRESENT ✅\n\n\`\`\`\n${report.propertyType}\n\`\`\`\n\n`;
  } else {
    md += `### PropertyType: ❌ NOT FOUND IN PAYLOAD\n\n`;
  }

  if (report.propertyContact) {
    md += `### PropertyContact: PRESENT ✅\n\n\`\`\`json\n${JSON.stringify(report.propertyContact, null, 2)}\n\`\`\`\n\n`;
  } else {
    md += `### PropertyContact: ❌ NOT FOUND IN PAYLOAD\n\n`;
  }

  md += `---

## 📦 Full Payload

\`\`\`json
${JSON.stringify(report.payload, null, 2)}
\`\`\`

---

## 🔍 Console Emoji Logs

`;

  if (report.consoleEmojis.length > 0) {
    md += `\`\`\`\n`;
    report.consoleEmojis.forEach(log => {
      md += `${log.text}\n`;
    });
    md += `\`\`\`\n\n`;
  } else {
    md += `⚠️ No emoji logs captured\n\n`;
  }

  md += `---

## 🎯 Next Steps

`;

  if (report.propertyType && report.propertyContact) {
    md += `✅ **PropertyType and PropertyContact ARE in the webhook payload**

This means:
1. The webhook code in \`src/utils/webhooks/valcre.ts\` is working correctly
2. The problem is in \`/api/valcre.ts\` (Vercel serverless function)
3. Need to investigate how \`/api/valcre.ts\` processes these fields

**Action Items**:
- Check \`/api/valcre.ts\` lines 480-542 (PropertyContact entity creation)
- Check \`/api/valcre.ts\` lines 564-571 (PropertyType field mapping)
- Verify line 574: \`PropertyTypeEnum → Types\` mapping
`;
  } else {
    md += `❌ **PropertyType and/or PropertyContact NOT in payload**

This means:
1. The webhook code in \`src/utils/webhooks/valcre.ts\` is NOT executing correctly
2. OR the form data is not being passed to \`sendToValcre()\`
3. Need to debug the save operation and webhook trigger

**Action Items**:
- Check if \`sendToValcre()\` is being called on save
- Verify form data includes propertyType and propertyContact fields
- Check dashboard component save logic
`;
  }

  return md;
}

interceptValcrePayload().catch(console.error);
