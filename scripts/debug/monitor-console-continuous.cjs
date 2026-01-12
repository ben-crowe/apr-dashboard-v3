/**
 * Continuous Console Monitor - Capture Emoji Logs
 *
 * Opens dashboard and monitors console continuously.
 * Captures the 3 emoji logs whenever save happens.
 * Run this, then save your job whenever ready.
 */

const { chromium } = require('playwright');
const fs = require('fs');

async function monitorConsole() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const captured = {
    propertyTypeLog: null,
    propertyContactLog: null,
    fullPayloadLog: null,
    timestamp: null
  };

  let fullPayload = null;

  console.log('🚀 Starting continuous console monitor...\n');

  // Monitor console for the 3 specific emoji logs
  page.on('console', msg => {
    const text = msg.text();

    // Capture PropertyType log
    if (text.includes('🏢 PropertyType from UI:')) {
      captured.propertyTypeLog = text;
      captured.timestamp = new Date().toISOString();
      console.log('\n✅ CAPTURED:', text);
    }

    // Capture PropertyContact log
    if (text.includes('👤 PropertyContact fields:')) {
      captured.propertyContactLog = text;
      console.log('✅ CAPTURED:', text);
    }

    // Capture full payload log and extract JSON
    if (text.includes('📤 Full payload to /api/valcre:')) {
      captured.fullPayloadLog = text;
      console.log('✅ CAPTURED: Full payload log');

      // Try to extract JSON from the log
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          fullPayload = JSON.parse(jsonMatch[0]);
          console.log('\n📦 PAYLOAD EXTRACTED FROM LOG:');
          console.log('PropertyType:', fullPayload.PropertyType || 'NOT FOUND');
          console.log('PropertyContact:', fullPayload.PropertyContact ? 'PRESENT' : 'NOT FOUND');

          if (fullPayload.PropertyContact) {
            console.log('\n👤 PropertyContact Details:');
            console.log('  FirstName:', fullPayload.PropertyContact.FirstName);
            console.log('  LastName:', fullPayload.PropertyContact.LastName);
            console.log('  Email:', fullPayload.PropertyContact.Email);
            console.log('  PhoneNumber:', fullPayload.PropertyContact.PhoneNumber);
          }
        }
      } catch (e) {
        // If JSON parsing fails, that's okay - we still have the log text
      }
    }

    // Check if we got all 3 logs
    if (captured.propertyTypeLog && captured.propertyContactLog && captured.fullPayloadLog) {
      console.log('\n🎉 ALL 3 EMOJI LOGS CAPTURED! Saving report...');
      saveReport();
    }
  });

  function saveReport() {
    const report = {
      timestamp: captured.timestamp || new Date().toISOString(),
      emojiLogs: {
        propertyType: captured.propertyTypeLog,
        propertyContact: captured.propertyContactLog,
        fullPayload: captured.fullPayloadLog
      },
      extractedPayload: fullPayload,
      analysis: {
        propertyTypePresent: fullPayload?.PropertyType ? true : false,
        propertyContactPresent: fullPayload?.PropertyContact ? true : false,
        propertyTypeValue: fullPayload?.PropertyType,
        propertyContactValue: fullPayload?.PropertyContact
      }
    };

    const reportPath = '/Users/bencrowe/Development/apr-dashboard-v3/EMOJI-LOGS-CAPTURED.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Report saved to: ${reportPath}`);

    // Generate markdown analysis
    const analysis = generateAnalysis(report);
    const mdPath = '/Users/bencrowe/Development/apr-dashboard-v3/EMOJI-LOGS-ANALYSIS.md';
    fs.writeFileSync(mdPath, analysis);
    console.log(`💾 Analysis saved to: ${mdPath}\n`);

    console.log('✅ CAPTURE COMPLETE - You can close the browser');
  }

  try {
    console.log('📍 Navigating to dashboard...\n');
    await page.goto('http://localhost:8080/dashboard');
    await page.waitForTimeout(3000);

    console.log('✅ Dashboard loaded');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📡 CONSOLE MONITOR ACTIVE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nInstructions:');
    console.log('1. The dashboard is now open');
    console.log('2. Open your job (with Albert Peterson data)');
    console.log('3. Make any edit or click Save');
    console.log('4. The monitor will capture the emoji logs automatically');
    console.log('5. Browser will stay open until you close it manually\n');
    console.log('Waiting for save event...\n');

    // Keep the browser open indefinitely
    // User can close manually when done
    await page.waitForTimeout(300000); // 5 minutes max

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    // Don't auto-close - let user close manually
    console.log('\n🏁 Monitor session ending...');
    await page.waitForTimeout(3000);
    await browser.close();
  }
}

function generateAnalysis(report) {
  let md = `# Emoji Logs Analysis - PropertyType & PropertyContact

**Captured**: ${report.timestamp}

---

## 📋 Captured Emoji Logs

### 🏢 PropertyType Log
\`\`\`
${report.emojiLogs.propertyType || 'NOT CAPTURED'}
\`\`\`

### 👤 PropertyContact Log
\`\`\`
${report.emojiLogs.propertyContact || 'NOT CAPTURED'}
\`\`\`

### 📤 Full Payload Log
\`\`\`
${report.emojiLogs.fullPayload || 'NOT CAPTURED'}
\`\`\`

---

## 🔍 Analysis

`;

  if (report.analysis.propertyTypePresent) {
    md += `### ✅ PropertyType: PRESENT IN PAYLOAD\n\n**Value**: \`${report.analysis.propertyTypeValue}\`\n\n`;
  } else {
    md += `### ❌ PropertyType: NOT FOUND IN PAYLOAD\n\n`;
  }

  if (report.analysis.propertyContactPresent) {
    md += `### ✅ PropertyContact: PRESENT IN PAYLOAD\n\n\`\`\`json\n${JSON.stringify(report.analysis.propertyContactValue, null, 2)}\n\`\`\`\n\n`;
  } else {
    md += `### ❌ PropertyContact: NOT FOUND IN PAYLOAD\n\n`;
  }

  md += `---

## 📦 Extracted Payload

`;

  if (report.extractedPayload) {
    md += `\`\`\`json
${JSON.stringify(report.extractedPayload, null, 2)}
\`\`\`\n\n`;
  } else {
    md += `⚠️ Could not extract JSON payload from log\n\n`;
  }

  md += `---

## 🎯 Verdict

`;

  if (report.analysis.propertyTypePresent && report.analysis.propertyContactPresent) {
    md += `### ✅ WEBHOOK IS WORKING CORRECTLY

**Finding**: PropertyType and PropertyContact ARE in the webhook payload sent to \`/api/valcre\`.

**This means**:
1. ✅ The webhook code in \`src/utils/webhooks/valcre.ts\` is working correctly
2. ✅ PropertyType and PropertyContact are being captured from the UI
3. ✅ They are being sent to the Vercel serverless function

**Problem is in**: \`/api/valcre.ts\` (Vercel serverless function)

**Next Steps**:
1. Investigate \`/api/valcre.ts\` lines 480-542 (PropertyContact entity creation)
2. Check \`/api/valcre.ts\` lines 564-571 (PropertyType field mapping)
3. Verify line 574 clue: Check if Valcre API expects \`Types\` instead of \`PropertyType\`
4. Add logging to \`/api/valcre.ts\` to see what's being sent to Valcre API
`;
  } else {
    md += `### ❌ WEBHOOK HAS ISSUES

**Finding**: PropertyType and/or PropertyContact NOT in webhook payload.

**This means**:
1. ❌ The webhook code in \`src/utils/webhooks/valcre.ts\` is NOT executing correctly
2. OR the form data is missing these fields
3. OR the save operation isn't calling \`sendToValcre()\`

**Next Steps**:
1. Check if \`sendToValcre()\` is being called when saving
2. Verify form data includes \`propertyType\` and \`propertyContact*\` fields
3. Check dashboard component save/auto-save logic
4. Add more detailed logging to webhook function
`;
  }

  return md;
}

monitorConsole().catch(console.error);
