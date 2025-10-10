export interface ContentBlock {
  id?: string;
  type: 'heading1' | 'heading2' | 'heading3' | 'paragraph' | 'list' | 'section' | 'text';
  content: string;
  attributes?: Record<string, any>;
}

export interface ContentBlocks {
  blocks: ContentBlock[];
}

export interface DocumentTemplate {
  id: string;
  name: string;
  category: 'modern' | 'traditional' | 'government' | 'premium';
  render: (content: ContentBlocks) => string;
  getInitialContent: () => string;
}

export class TemplateManager {
  private templates = new Map<string, DocumentTemplate>();
  
  constructor() {
    this.loadDefaultTemplates();
  }
  
  private loadDefaultTemplates() {
    // Modern Template
    this.templates.set('modern', {
      id: 'modern',
      name: 'Modern Clean',
      category: 'modern',
      getInitialContent: () => this.getModernTemplateContent(),
      render: (content: ContentBlocks) => this.renderModernTemplate(content)
    });
    
    // Traditional Template
    this.templates.set('traditional', {
      id: 'traditional',
      name: 'Traditional Legal',
      category: 'traditional',
      getInitialContent: () => this.getTraditionalTemplateContent(),
      render: (content: ContentBlocks) => this.renderTraditionalTemplate(content)
    });
    
    // Government Template
    this.templates.set('government', {
      id: 'government',
      name: 'Government Formal',
      category: 'government',
      getInitialContent: () => this.getGovernmentTemplateContent(),
      render: (content: ContentBlocks) => this.renderGovernmentTemplate(content)
    });
  }
  
  getTemplate(id: string): DocumentTemplate | undefined {
    return this.templates.get(id);
  }
  
  getAvailableTemplates(): Array<{ id: string; name: string; category: string }> {
    return Array.from(this.templates.values()).map(t => ({
      id: t.id,
      name: t.name,
      category: t.category
    }));
  }
  
  getInitialContent(templateId: string, documentType: string): string {
    const template = this.templates.get(templateId);
    return template ? template.getInitialContent() : this.getDefaultContent();
  }
  
  extractContent(html: string): ContentBlocks {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const blocks: ContentBlock[] = [];
    
    const processNode = (node: Node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const tagName = element.tagName.toLowerCase();
        
        // Skip wrapper divs and extract their content
        if (tagName === 'div' && element.className.includes('template')) {
          element.childNodes.forEach(child => processNode(child));
          return;
        }
        
        blocks.push({
          type: this.getBlockType(element),
          content: element.innerHTML,
          attributes: this.extractAttributes(element)
        });
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        blocks.push({
          type: 'text',
          content: node.textContent
        });
      }
    };
    
    doc.body.childNodes.forEach(processNode);
    
    return { blocks };
  }
  
  applyTemplate(content: ContentBlocks, templateId: string): string {
    const template = this.templates.get(templateId);
    if (!template) {
      console.warn(`Template ${templateId} not found, using default`);
      return this.renderDefaultTemplate(content);
    }
    
    return template.render(content);
  }
  
  private getBlockType(element: HTMLElement): ContentBlock['type'] {
    const tagName = element.tagName.toLowerCase();
    const typeMap: Record<string, ContentBlock['type']> = {
      'h1': 'heading1',
      'h2': 'heading2',
      'h3': 'heading3',
      'p': 'paragraph',
      'ul': 'list',
      'ol': 'list',
      'div': 'section'
    };
    
    return typeMap[tagName] || 'paragraph';
  }
  
  private extractAttributes(element: HTMLElement): Record<string, any> {
    const attributes: Record<string, any> = {};
    
    Array.from(element.attributes).forEach(attr => {
      attributes[attr.name] = attr.value;
    });
    
    return attributes;
  }
  
  private renderBlock(block: ContentBlock): string {
    switch (block.type) {
      case 'heading1':
        return `<h1>${block.content}</h1>`;
      case 'heading2':
        return `<h2>${block.content}</h2>`;
      case 'heading3':
        return `<h3>${block.content}</h3>`;
      case 'paragraph':
        return `<p>${block.content}</p>`;
      case 'list':
        return `<ul>${block.content}</ul>`;
      case 'section':
        return `<div>${block.content}</div>`;
      case 'text':
        return block.content;
      default:
        return `<p>${block.content}</p>`;
    }
  }
  
  // Template Content Generators
  
  private getDefaultContent(): string {
    return `
      <h1>Letter of Engagement</h1>
      <p>Date: [--date-created--]</p>
      <p>Job Number: [--job-number--]</p>
      
      <p>Dear [--client-name--],</p>
      
      <p>Thank you for choosing our appraisal services for the property located at [--property-address--].</p>
      
      <p>This letter confirms our engagement to provide a [--report-type--] appraisal report for the above-referenced property.</p>
      
      <h2>Scope of Work</h2>
      <p>[--scope-of-work--]</p>
      
      <h2>Fee Structure</h2>
      <p>Appraisal Fee: [--appraisal-fee--]</p>
      <p>Retainer Amount: [--retainer-amount--]</p>
      <p>Payment Terms: [--payment-terms--]</p>
      
      <h2>Delivery Timeline</h2>
      <p>[--report-delivery--]</p>
      
      <p>Please sign and return this letter to confirm your acceptance of these terms.</p>
      
      <p>Sincerely,</p>
      <p>Valta Appraisals Inc.</p>
    `;
  }
  
  private getModernTemplateContent(): string {
    return `
      <div class="modern-template">
        <div class="modern-header">
          <h1 style="color: #2563eb; font-family: 'Inter', sans-serif;">Letter of Engagement</h1>
          <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            <div>
              <p><strong>Date:</strong> [--date-created--]</p>
              <p><strong>Job #:</strong> [--job-number--]</p>
            </div>
            <div style="text-align: right;">
              <p><strong>Valta Appraisals Inc.</strong></p>
              <p>Calgary, Alberta</p>
            </div>
          </div>
        </div>
        
        <div class="modern-content" style="margin-top: 30px;">
          <p>Dear [--client-name--],</p>
          
          <p>We are pleased to confirm our engagement to provide appraisal services for:</p>
          
          <div style="background: #f3f4f6; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
            <p><strong>Property:</strong> [--property-address--]</p>
            <p><strong>Type:</strong> [--property-type--]</p>
            <p><strong>Intended Use:</strong> [--intended-use--]</p>
          </div>
          
          <h2 style="color: #1e40af;">Scope of Services</h2>
          <p>[--scope-of-work--]</p>
          
          <h2 style="color: #1e40af;">Investment & Timeline</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <p><strong>Appraisal Fee:</strong> [--appraisal-fee--]</p>
              <p><strong>Retainer:</strong> [--retainer-amount--]</p>
            </div>
            <div>
              <p><strong>Payment Terms:</strong> [--payment-terms--]</p>
              <p><strong>Delivery:</strong> [--report-delivery--]</p>
            </div>
          </div>
          
          <p style="margin-top: 30px;">Please confirm your acceptance by signing below.</p>
        </div>
      </div>
    `;
  }
  
  private getTraditionalTemplateContent(): string {
    return `
      <div class="traditional-template" style="font-family: 'Times New Roman', serif; line-height: 2;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 18pt; text-transform: uppercase;">Letter of Engagement</h1>
        </div>
        
        <div style="text-align: right; margin-bottom: 20px;">
          <p>[--date-created--]</p>
          <p>File No. [--job-number--]</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p>[--client-name--]</p>
          <p>[--company-name--]</p>
          <p>[--client-address--]</p>
        </div>
        
        <p>Dear [--client-name--]:</p>
        
        <p style="text-indent: 50px;">This letter shall serve to confirm our engagement to prepare a [--report-type--] appraisal report for the property located at [--property-address--], hereinafter referred to as the "Subject Property."</p>
        
        <h2 style="font-size: 14pt; margin-top: 30px;">I. SCOPE OF WORK</h2>
        <p style="text-indent: 50px;">[--scope-of-work--]</p>
        
        <h2 style="font-size: 14pt; margin-top: 30px;">II. COMPENSATION</h2>
        <p style="text-indent: 50px;">The fee for this appraisal shall be [--appraisal-fee--]. A retainer in the amount of [--retainer-amount--] is required upon execution of this agreement. Payment terms are [--payment-terms--].</p>
        
        <h2 style="font-size: 14pt; margin-top: 30px;">III. DELIVERY</h2>
        <p style="text-indent: 50px;">The appraisal report shall be delivered within [--report-delivery--] of receipt of all necessary documentation.</p>
        
        <p style="margin-top: 40px;">If the above meets with your approval, please execute this letter where indicated below.</p>
        
        <p style="margin-top: 30px;">Very truly yours,</p>
        <p style="margin-top: 40px;">VALTA APPRAISALS INC.</p>
      </div>
    `;
  }
  
  private getGovernmentTemplateContent(): string {
    return `
      <div class="government-template" style="font-family: Arial, sans-serif; font-size: 11pt;">
        <div style="border: 2px solid #000; padding: 10px; margin-bottom: 20px;">
          <h1 style="text-align: center; font-size: 14pt;">GOVERNMENT OF CANADA</h1>
          <h2 style="text-align: center; font-size: 12pt;">APPRAISAL SERVICES AGREEMENT</h2>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="border: 1px solid #000; padding: 5px;"><strong>DATE:</strong></td>
            <td style="border: 1px solid #000; padding: 5px;">[--date-created--]</td>
            <td style="border: 1px solid #000; padding: 5px;"><strong>FILE NO:</strong></td>
            <td style="border: 1px solid #000; padding: 5px;">[--job-number--]</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 5px;"><strong>CLIENT:</strong></td>
            <td colspan="3" style="border: 1px solid #000; padding: 5px;">[--client-name--], [--company-name--]</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 5px;"><strong>PROPERTY:</strong></td>
            <td colspan="3" style="border: 1px solid #000; padding: 5px;">[--property-address--]</td>
          </tr>
        </table>
        
        <h3 style="background: #333; color: white; padding: 5px;">1.0 SCOPE OF WORK</h3>
        <p style="margin-left: 20px;">[--scope-of-work--]</p>
        
        <h3 style="background: #333; color: white; padding: 5px;">2.0 DELIVERABLES</h3>
        <p style="margin-left: 20px;">2.1 Report Type: [--report-type--]</p>
        <p style="margin-left: 20px;">2.2 Intended Use: [--intended-use--]</p>
        <p style="margin-left: 20px;">2.3 Property Rights: [--property-rights--]</p>
        
        <h3 style="background: #333; color: white; padding: 5px;">3.0 FEES AND PAYMENT</h3>
        <p style="margin-left: 20px;">3.1 Total Fee: [--appraisal-fee--]</p>
        <p style="margin-left: 20px;">3.2 Retainer Required: [--retainer-amount--]</p>
        <p style="margin-left: 20px;">3.3 Payment Terms: [--payment-terms--]</p>
        
        <h3 style="background: #333; color: white; padding: 5px;">4.0 TIMELINE</h3>
        <p style="margin-left: 20px;">4.1 Delivery: [--report-delivery--]</p>
        
        <p style="margin-top: 40px;"><strong>AUTHORIZED SIGNATURE:</strong> _______________________________</p>
      </div>
    `;
  }
  
  private renderModernTemplate(content: ContentBlocks): string {
    return `
      <div class="modern-template">
        ${content.blocks.map(block => this.renderBlock(block)).join('')}
      </div>
    `;
  }
  
  private renderTraditionalTemplate(content: ContentBlocks): string {
    return `
      <div class="traditional-template">
        ${content.blocks.map(block => this.renderBlock(block)).join('')}
      </div>
    `;
  }
  
  private renderGovernmentTemplate(content: ContentBlocks): string {
    return `
      <div class="government-template">
        ${content.blocks.map(block => this.renderBlock(block)).join('')}
      </div>
    `;
  }
  
  private renderDefaultTemplate(content: ContentBlocks): string {
    return content.blocks.map(block => this.renderBlock(block)).join('');
  }
}