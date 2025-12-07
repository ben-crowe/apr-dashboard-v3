/**
 * DOCX Asset Extractor for APR Report Builder
 *
 * Extracts images and text from reference DOCX file
 *
 * Usage: node scripts/extractDocxAssets.js
 */

const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DOCX_PATH = path.join(__dirname, '../docs/15-Contract-review/VAL251012 - North Battleford Apt, 1101, 1121 109 Street, North Battleford.docx');
const OUTPUT_DIR = path.join(__dirname, '../public/test-data');
const IMAGES_DIR = path.join(OUTPUT_DIR, 'images');

// Image category mappings based on document order
// These will be refined after seeing actual image content
const IMAGE_CATEGORIES = {
  // Cover and logos
  '1': { category: 'misc', name: 'logo-valcre' },
  '2': { category: 'cover', name: 'cover-photo' },
  '3': { category: 'misc', name: 'logo-appraisal-institute' },
  '4': { category: 'misc', name: 'logo-aic' },

  // Maps (typically 36-38 based on file sizes - large PNGs)
  '36': { category: 'maps', name: 'location-map' },
  '37': { category: 'maps', name: 'aerial-map' },
  '38': { category: 'maps', name: 'zoning-map' },

  // Property photos (12-35 are typically interior/exterior JPEGs)
  '12': { category: 'exterior', name: 'exterior-1' },
  '13': { category: 'exterior', name: 'exterior-2' },
  '14': { category: 'exterior', name: 'exterior-3' },
  '15': { category: 'exterior', name: 'exterior-4' },
  '16': { category: 'street-views', name: 'street-1' },
  '17': { category: 'street-views', name: 'street-2' },
  '18': { category: 'interior', name: 'interior-1' },
  '19': { category: 'interior', name: 'interior-2' },
  '20': { category: 'interior', name: 'interior-3' },
  '21': { category: 'interior', name: 'interior-4' },
  '22': { category: 'interior', name: 'interior-5' },
  '23': { category: 'interior', name: 'interior-6' },
  '24': { category: 'interior', name: 'interior-7' },
  '25': { category: 'interior', name: 'interior-8' },
  '26': { category: 'interior', name: 'interior-9' },
  '27': { category: 'interior', name: 'interior-10' },
  '28': { category: 'interior', name: 'interior-11' },
  '29': { category: 'interior', name: 'interior-12' },
  '30': { category: 'interior', name: 'interior-13' },
  '31': { category: 'interior', name: 'interior-14' },
  '32': { category: 'interior', name: 'interior-15' },
  '33': { category: 'interior', name: 'interior-16' },
  '34': { category: 'interior', name: 'interior-17' },
  '35': { category: 'interior', name: 'interior-18' },
};

async function extractDocx() {
  console.log('Starting DOCX extraction...\n');

  // Ensure output directories exist
  const categories = ['cover', 'exterior', 'interior', 'street-views', 'maps', 'comparables', 'misc'];
  categories.forEach(cat => {
    const dir = path.join(IMAGES_DIR, cat);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Extract images using unzip (DOCX is a ZIP file)
  const tempDir = '/tmp/docx-extract';

  console.log('1. Extracting images from DOCX ZIP...');
  try {
    execSync(`rm -rf ${tempDir} && mkdir -p ${tempDir}`, { stdio: 'pipe' });
    execSync(`unzip -q "${DOCX_PATH}" -d ${tempDir}`, { stdio: 'pipe' });
  } catch (err) {
    console.error('Failed to extract DOCX:', err.message);
    return;
  }

  const mediaDir = path.join(tempDir, 'word/media');
  if (!fs.existsSync(mediaDir)) {
    console.error('No media directory found in DOCX');
    return;
  }

  // Get all media files
  const mediaFiles = fs.readdirSync(mediaDir).sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || '0');
    const numB = parseInt(b.match(/\d+/)?.[0] || '0');
    return numA - numB;
  });

  console.log(`   Found ${mediaFiles.length} media files\n`);

  // Copy images to categorized folders
  console.log('2. Copying images to public/test-data/images/...');

  const imageManifest = [];

  mediaFiles.forEach(file => {
    // Skip EMF files (Windows metafiles)
    if (file.endsWith('.emf')) {
      console.log(`   Skipping EMF: ${file}`);
      return;
    }

    const num = file.match(/\d+/)?.[0];
    const ext = path.extname(file).toLowerCase();
    const mapping = IMAGE_CATEGORIES[num];

    let category = 'misc';
    let newName = file;

    if (mapping) {
      category = mapping.category;
      newName = `${mapping.name}${ext}`;
    } else {
      // Auto-categorize by number range
      const numInt = parseInt(num);
      if (numInt >= 12 && numInt <= 17) {
        category = 'exterior';
        newName = `exterior-${numInt - 11}${ext}`;
      } else if (numInt >= 18 && numInt <= 35) {
        category = 'interior';
        newName = `interior-${numInt - 17}${ext}`;
      } else if (numInt >= 36 && numInt <= 38) {
        category = 'maps';
      } else if (numInt >= 39 && numInt <= 89) {
        // Higher numbered images are typically comparable photos
        category = 'comparables';
        newName = `comparable-${numInt - 38}${ext}`;
      }
    }

    const srcPath = path.join(mediaDir, file);
    const destPath = path.join(IMAGES_DIR, category, newName);

    fs.copyFileSync(srcPath, destPath);

    const stats = fs.statSync(srcPath);
    imageManifest.push({
      original: file,
      category,
      filename: newName,
      path: `/test-data/images/${category}/${newName}`,
      size: stats.size,
    });

    console.log(`   ${file} -> ${category}/${newName}`);
  });

  // Save image manifest
  const manifestPath = path.join(OUTPUT_DIR, 'image-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(imageManifest, null, 2));
  console.log(`\n   Image manifest saved to: ${manifestPath}`);

  // Extract text content using mammoth
  console.log('\n3. Extracting text content with mammoth...');

  try {
    // Get raw text
    const textResult = await mammoth.extractRawText({ path: DOCX_PATH });
    const textPath = path.join(OUTPUT_DIR, 'north-battleford-text.txt');
    fs.writeFileSync(textPath, textResult.value);
    console.log(`   Raw text saved to: ${textPath}`);

    // Get HTML (for structure reference)
    const htmlResult = await mammoth.convertToHtml({ path: DOCX_PATH });
    const htmlPath = path.join(OUTPUT_DIR, 'north-battleford-structure.html');
    fs.writeFileSync(htmlPath, htmlResult.value);
    console.log(`   HTML structure saved to: ${htmlPath}`);

    // Log any messages
    if (htmlResult.messages.length > 0) {
      console.log('\n   Mammoth messages:');
      htmlResult.messages.slice(0, 10).forEach(msg => {
        console.log(`   - ${msg.type}: ${msg.message}`);
      });
      if (htmlResult.messages.length > 10) {
        console.log(`   ... and ${htmlResult.messages.length - 10} more`);
      }
    }
  } catch (err) {
    console.error('Mammoth extraction failed:', err.message);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('EXTRACTION COMPLETE');
  console.log('='.repeat(60));
  console.log(`\nImages extracted: ${imageManifest.length}`);
  console.log('\nBy category:');

  const byCat = imageManifest.reduce((acc, img) => {
    acc[img.category] = (acc[img.category] || 0) + 1;
    return acc;
  }, {});

  Object.entries(byCat).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
  });

  console.log('\nOutput files:');
  console.log(`  ${OUTPUT_DIR}/image-manifest.json`);
  console.log(`  ${OUTPUT_DIR}/north-battleford-text.txt`);
  console.log(`  ${OUTPUT_DIR}/north-battleford-structure.html`);
  console.log(`  ${IMAGES_DIR}/[categorized folders]`);
}

extractDocx().catch(console.error);
