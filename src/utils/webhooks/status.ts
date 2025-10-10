import { UpdateJobStatusData } from './types';

// Function to update job status via n8n
export const updateJobStatus = async (data: UpdateJobStatusData): Promise<{ success: boolean; responseData?: any; error?: string }> => {
  const webhookUrl = process.env.N8N_UPDATE_STATUS_WEBHOOK_URL || 'https://placeholder-n8n-update-status-webhook.com';
  
  try {
    console.log('Updating job status with data:', data);
    
    // Add timestamp if not provided
    if (!data.timestamp) {
      data.timestamp = new Date().toISOString();
    }
    
    // Attempt to send the data to n8n webhook
    if (webhookUrl !== 'https://placeholder-n8n-update-status-webhook.com') {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      // Extract response text regardless of status
      const responseText = await response.text().catch(() => 'Failed to get response text');
      
      // Try to parse response as JSON if possible
      let parsedResponse = null;
      try {
        parsedResponse = JSON.parse(responseText);
      } catch (e) {
        // If not JSON, keep as text
        parsedResponse = { rawText: responseText };
      }
      
      if (!response.ok) {
        console.error(`Status webhook response error: ${response.status} ${response.statusText}`, parsedResponse);
        return { 
          success: false, 
          responseData: parsedResponse,
          error: `${response.status} ${response.statusText}`
        };
      }
      
      console.log('n8n status webhook response:', parsedResponse);
      
      return {
        success: true,
        responseData: parsedResponse
      };
    } else {
      console.log('Using placeholder webhook URL. In production, set N8N_UPDATE_STATUS_WEBHOOK_URL');
      // Simulate a network request for development
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        success: true,
        responseData: { simulated: true, message: "This is a simulated response" }
      };
    }
  } catch (error) {
    console.error('Update job status error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
