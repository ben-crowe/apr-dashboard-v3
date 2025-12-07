#!/usr/bin/env tsx

import { readFileSync } from 'fs';
import { join } from 'path';

console.log('═══════════════════════════════════════════════════════');
console.log('Code Implementation Verification');
console.log('═══════════════════════════════════════════════════════\n');

const srcDir = '/Users/bencrowe/Development/apr-dashboard-v3/src';

// Test 1: Asset Condition Auto-Save Implementation
console.log('TEST 1: Asset Condition Auto-Save\n');

try {
  const clientSubmissionPath = join(srcDir, 'components/dashboard/job-details/ClientSubmissionSection.tsx');
  const content = readFileSync(clientSubmissionPath, 'utf-8');

  console.log('Checking ClientSubmissionSection.tsx (line ~614)...');

  // Check for assetCondition auto-save
  const hasAssetConditionAutoSave = content.includes('autoSaveField(\'assetCondition\'') ||
                                     content.includes('autoSaveField("assetCondition"');

  if (hasAssetConditionAutoSave) {
    console.log('✅ Asset Condition auto-save FOUND');

    // Extract the relevant code block
    const lines = content.split('\n');
    const assetConditionLines = lines
      .map((line, idx) => ({ line, num: idx + 1 }))
      .filter(({ line }) => line.includes('assetCondition'));

    console.log('\nRelevant code locations:');
    assetConditionLines.slice(0, 5).forEach(({ line, num }) => {
      console.log(`  Line ${num}: ${line.trim().substring(0, 80)}`);
    });

    // Check for onValueChange handler
    const hasOnValueChange = /onValueChange=\{[^}]*assetCondition[^}]*\}/s.test(content);
    if (hasOnValueChange) {
      console.log('\n✅ onValueChange handler with assetCondition FOUND');
    } else {
      console.log('\n⚠️ onValueChange handler pattern not detected (may be formatted differently)');
    }

  } else {
    console.log('❌ Asset Condition auto-save NOT FOUND');
  }

} catch (error) {
  console.error('❌ Error reading ClientSubmissionSection.tsx:', error);
}

// Test 2: Comments Mapping
console.log('\n═══════════════════════════════════════════════════════');
console.log('TEST 2: Comments Field Mapping\n');

console.log('Part A: Client Comments (notes field)\n');
try {
  const clientSubmissionPath = join(srcDir, 'components/dashboard/job-details/ClientSubmissionSection.tsx');
  const content = readFileSync(clientSubmissionPath, 'utf-8');

  console.log('Checking ClientSubmissionSection.tsx for notes field sync...');

  // Check for notes field sync
  const hasNotesSync = content.includes('syncData.notes');

  if (hasNotesSync) {
    console.log('✅ Client Comments (notes) sync mapping FOUND');

    // Find the sync block
    const lines = content.split('\n');
    const syncLines = lines
      .map((line, idx) => ({ line, num: idx + 1 }))
      .filter(({ line }) => line.includes('notes') && line.includes('syncData'));

    console.log('\nSync mapping code:');
    syncLines.slice(0, 3).forEach(({ line, num }) => {
      console.log(`  Line ${num}: ${line.trim()}`);
    });

  } else {
    console.log('❌ Client Comments (notes) sync NOT FOUND');
  }

} catch (error) {
  console.error('❌ Error checking Client Comments:', error);
}

console.log('\nPart B: Appraiser Comments (internal_comments field)\n');
try {
  const loeQuotePath = join(srcDir, 'components/dashboard/job-details/LoeQuoteSection.tsx');
  const content = readFileSync(loeQuotePath, 'utf-8');

  console.log('Checking LoeQuoteSection.tsx for appraiserComments mapping...');

  // Check for appraiserComments mapping
  const hasAppraiserCommentsMapping = content.includes('appraiserComments') &&
                                       (content.includes('internal_comments') || content.includes('internalComments'));

  if (hasAppraiserCommentsMapping) {
    console.log('✅ Appraiser Comments mapping FOUND');

    // Find the mapping
    const lines = content.split('\n');
    const mappingLines = lines
      .map((line, idx) => ({ line, num: idx + 1 }))
      .filter(({ line }) => line.includes('appraiserComments') || line.includes('internal_comments'));

    console.log('\nMapping code:');
    mappingLines.slice(0, 5).forEach(({ line, num }) => {
      console.log(`  Line ${num}: ${line.trim()}`);
    });

    // Check if it's in the field mappings constant
    const hasFieldMapping = /appraiserComments['":].*internal_comments/s.test(content) ||
                           /['"]internal_comments['"].*appraiserComments/s.test(content);

    if (hasFieldMapping) {
      console.log('\n✅ Field mapping to internal_comments confirmed');
    } else {
      console.log('\n⚠️ Mapping pattern unclear - manual verification needed');
    }

  } else {
    console.log('❌ Appraiser Comments mapping NOT FOUND');
  }

} catch (error) {
  console.error('❌ Error checking Appraiser Comments:', error);
}

// Check Valcre webhook/sync logic
console.log('\n═══════════════════════════════════════════════════════');
console.log('Valcre Sync Configuration\n');

try {
  const fieldMappingsPath = join(srcDir, 'utils/fieldMappings.ts');
  const content = readFileSync(fieldMappingsPath, 'utf-8');

  console.log('Checking utils/fieldMappings.ts...');

  const hasNotesMapping = content.includes('notes');
  const hasInternalCommentsMapping = content.includes('internal_comments') || content.includes('internalComments');

  console.log(`  notes field mapping: ${hasNotesMapping ? '✅' : '❌'}`);
  console.log(`  internal_comments mapping: ${hasInternalCommentsMapping ? '✅' : '❌'}`);

  if (hasNotesMapping && hasInternalCommentsMapping) {
    console.log('\n✅ Both comment fields have separate mappings');
  } else {
    console.log('\n⚠️ One or both mappings not found in fieldMappings.ts');
  }

} catch (error) {
  console.log('⚠️ fieldMappings.ts not found or error reading:', error);
}

console.log('\n═══════════════════════════════════════════════════════');
console.log('Summary\n');
console.log('✅ = Implementation verified in code');
console.log('❌ = Implementation not found');
console.log('⚠️ = Needs manual verification\n');
console.log('For complete verification, run the browser test:');
console.log('  npx tsx test-final-two.spec.ts\n');
