#!/usr/bin/env node

/**
 * Test Job Submission - Phase 2 Testing for PropertyType and PropertyContact
 *
 * This script simulates a job submission through the webhook to test Cursor's logging
 * from Phase 1. It creates a job with:
 * - PropertyType: "Multi-Family"
 * - PropertyContact: Different from client (all 4 fields filled)
 */

const fetch = require("node-fetch");

const WEBHOOK_URL = "http://localhost:8080/api/valcre";

const testJobData = {
  // Client Info (will be primary contact)
  clientFirstName: "John",
  clientLastName: "Developer",
  clientEmail: "john.developer@example.com",
  clientPhone: "403-555-1234",
  clientOrganization: "Dev Corp",

  // Property Contact (DIFFERENT from client - this is key for testing)
  propertyContactFirstName: "Sarah",
  propertyContactLastName: "PropertyManager",
  propertyContactEmail: "sarah.manager@example.com",
  propertyContactPhone: "403-555-9999",

  // Property Info with PropertyType
  propertyAddress: "123 Test Street, Calgary, AB T2P 1A1",
  propertyType: "Multi-Family", // ← KEY TEST VALUE

  // Job Details
  intendedUse: "Financing",
  appraisalType: "Full Appraisal",
  deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0], // 2 weeks from now

  // LOE Details
  appraisalFee: 2500,
  retainerAmount: 1000,

  // Comments
  clientComments: "Test job for PropertyType and PropertyContact logging",
  internalNotes: "Phase 2 test - checking webhook logs",
};

async function submitTestJob() {
  console.log("🧪 Test Job Submission - Phase 2 Testing\n");
  console.log('Testing PropertyType: "Multi-Family"');
  console.log("Testing PropertyContact: Different from client\n");

  try {
    console.log("📤 Sending to webhook:", WEBHOOK_URL);

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testJobData),
    });

    console.log("📥 Response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Webhook failed:", errorText);
      process.exit(1);
    }

    const result = await response.json();
    console.log("\n✅ Webhook Response:");
    console.log(JSON.stringify(result, null, 2));

    console.log("\n📊 What to check in logs:");
    console.log('1. Look for: "🏢 PropertyType from UI: Multi-Family"');
    console.log(
      '2. Look for: "👤 PropertyContact fields: { firstName: Sarah, ... }"',
    );
    console.log('3. Look for: "📤 Full payload to /api/valcre"');
    console.log(
      '4. Look for: "📥 Received jobData.PropertyType: Multi-Family"',
    );
    console.log('5. Look for: "📥 Received jobData.PropertyContact: {...}"');
    console.log('6. Look for: "🏢 Property entity data being sent"');
    console.log('7. Look for: "✅ Property API response"');
    console.log('8. Look for: "👤 Creating PropertyContact with data"');

    if (result.jobNumber) {
      console.log("\n🔗 Check Valcre UI:");
      console.log(`   https://app.valcre.com/Jobs/${result.jobId || "[ID]"}`);
      console.log("   Job Number:", result.jobNumber);
      console.log("\nVerify in Valcre:");
      console.log('   ✓ PropertyType shows as "Multi-Family"');
      console.log('   ✓ PropertyContact shows "Sarah PropertyManager"');
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

console.log("⚠️  Make sure dev server is running on http://localhost:8083\n");
submitTestJob().catch(console.error);
