/**
 * Test environment variables loading
 */

export function testEnvironmentVariables() {
  console.log('🔍 Testing Environment Variables:');
  console.log('=====================================');
  
  // Check all VITE env vars
  const envVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    VITE_SUPABASE_PROJECT_ID: import.meta.env.VITE_SUPABASE_PROJECT_ID,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
  };
  
  // Display each variable
  Object.entries(envVars).forEach(([key, value]) => {
    if (value === undefined) {
      console.error(`❌ ${key}: UNDEFINED`);
    } else if (value === '') {
      console.warn(`⚠️ ${key}: EMPTY STRING`);
    } else if (key.includes('KEY') && value) {
      // Partially hide sensitive keys
      const hidden = value.toString().substring(0, 20) + '...[hidden]';
      console.log(`✅ ${key}: ${hidden}`);
    } else {
      console.log(`✅ ${key}: ${value}`);
    }
  });
  
  console.log('=====================================');
  
  // Test URL construction
  if (envVars.VITE_SUPABASE_URL) {
    const testUrl = `${envVars.VITE_SUPABASE_URL}/functions/v1/docuseal-proxy?endpoint=templates/html`;
    console.log('📎 Constructed URL:', testUrl);
    
    // Validate URL
    try {
      const url = new URL(testUrl);
      console.log('✅ Valid URL:', url.hostname);
    } catch (e) {
      console.error('❌ Invalid URL construction:', e);
    }
  }
  
  return envVars;
}

// Auto-run on import if in development
if (import.meta.env.DEV) {
  testEnvironmentVariables();
}