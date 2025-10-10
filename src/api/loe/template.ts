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
    // Path to your V29 template
    const templatePath = path.join(
      process.cwd(),
      '_MODULES',
      '02-LOE-E-Signature',
      'LOE-&-Doc Various to Org',
      'V29-Plain-Brackets.html'
    );

    // Read the template file
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    
    // Return as HTML
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(templateContent);
  } catch (error) {
    console.error('Error loading template:', error);
    res.status(500).json({ error: 'Failed to load template' });
  }
}