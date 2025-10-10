import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

/**
 * API endpoint to serve the V29 LOE template
 * GET /api/loe/template
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Try multiple paths to find the V29 template
    const possiblePaths = [
      // Primary location - MOVED TO MASTER-PLANS
      path.join(process.cwd(), '_Master-Plans', '04-LOE-Workflow', 'docuseal-signing-integration', 'LOE-template.html'),
      // Fallback to old location if needed
      path.join(process.cwd(), '_MODULES', 'docuseal-signing-integration', 'LOE-template.html'),
      // Alternative location
      path.join(process.cwd(), '_MODULES', '02-LOE-E-Signature', 'LOE-&-Doc Various to Org', 'V29-Plain-Brackets.html'),
      // Another possible location
      path.join(process.cwd(), '_MODULES', '02-LOE-E-Signature', 'Valta-LOE-Template', 'V29-Plain-Brackets.html')
    ];
    
    let templatePath = '';
    let templateFound = false;
    
    // Find the first existing template
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        templatePath = testPath;
        templateFound = true;
        break;
      }
    }
    
    // Check if file exists
    if (!templateFound) {
      // Fallback: try relative to project root
      const altPath = path.join(
        process.cwd(),
        'public',
        'templates',
        'LOE-template.html'
      );
      
      if (fs.existsSync(altPath)) {
        const templateContent = fs.readFileSync(altPath, 'utf8');
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(templateContent);
      }
      
      return res.status(404).json({ 
        error: 'Template not found',
        path: templatePath 
      });
    }

    // Read the template file
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    
    // Return as HTML
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(templateContent);
  } catch (error) {
    console.error('Error loading template:', error);
    res.status(500).json({ 
      error: 'Failed to load template',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}