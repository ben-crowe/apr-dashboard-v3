
import { ContractWebhookData } from './types';

// Function to generate contract via n8n
export const generateContract = async (data: ContractWebhookData): Promise<boolean> => {
  const webhookUrl = process.env.N8N_CONTRACT_WEBHOOK_URL || 'https://placeholder-n8n-contract-webhook.com';
  
  try {
    console.log('Sending data to contract generation webhook:', data);
    
    // Add timestamp if not provided
    if (!data.timestamp) {
      data.timestamp = new Date().toISOString();
    }
    
    // Simulate a network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demonstration, return success
    return true;
  } catch (error) {
    console.error('Contract generation webhook error:', error);
    return false;
  }
};
