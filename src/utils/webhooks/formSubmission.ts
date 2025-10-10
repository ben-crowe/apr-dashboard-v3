
import { WebhookData } from './types';
import { JobSubmission, JobStatus, JobFile } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";

// Function to send initial form submission to n8n
export const sendToWebhook = async (data: WebhookData): Promise<{ success: boolean; responseData?: any; error?: string }> => {
  // Updated test webhook URL
  const webhookUrl = 'https://crowestudio.app.n8n.cloud/webhook-test/5042d852-4724-4cfb-b7e2-c47a8f0f62ef';
  
  try {
    console.log('Sending form submission to n8n webhook:', data);
    
    // Add timestamp if not provided
    if (!data.timestamp) {
      data.timestamp = new Date().toISOString();
    }
    
    // Using the actual webhook URL
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    // Extract response text regardless of success status
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
      console.error(`Webhook response error: ${response.status} ${response.statusText}`, parsedResponse);
      return { 
        success: false, 
        responseData: parsedResponse,
        error: `${response.status} ${response.statusText}`
      };
    }
    
    console.log('n8n webhook response:', parsedResponse);
    console.log('Form submission successfully sent to n8n');
    
    return { 
      success: true, 
      responseData: parsedResponse 
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Save job to Supabase
export const saveJobToLocalStorage = async (job: JobSubmission): Promise<void> => {
  try {
    console.log('Saving job to Supabase:', job);
    
    // Ensure we have a valid status
    const status: JobStatus = job.status || "submitted";
    
    // Save to Supabase
    const { data, error } = await supabase
      .from('job_submissions')
      .insert({
        // Don't include the id field - let Supabase generate it
        client_first_name: job.clientFirstName,
        client_last_name: job.clientLastName,
        client_email: job.clientEmail,
        client_phone: job.clientPhone,
        client_title: job.clientTitle || null,
        client_organization: job.clientOrganization || null,
        client_address: job.clientAddress || null,
        property_name: job.propertyName || null,
        property_address: job.propertyAddress,
        property_type: job.propertyType || null,
        intended_use: job.intendedUse || null,
        asset_condition: job.assetCondition || null,
        notes: job.notes || null,
        status: status,
        created_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error saving job to Supabase:', error);
      throw error;
    }
    
    console.log('Job saved to Supabase successfully:', data);
    
    // If there are files, upload them to storage and save file metadata to job_files table
    if (job.files && job.files.length > 0) {
      console.log(`Uploading ${job.files.length} files to Supabase Storage`);
      
      for (const file of job.files) {
        try {
          // Generate a unique file path to prevent overwriting
          const timestamp = new Date().getTime();
          const filePath = `${data.id}/${timestamp}_${file.fileName}`;
          
          // Upload the file to Supabase Storage
          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('job-files')
            .upload(filePath, file.file, {
              cacheControl: '3600',
              upsert: false,
            });
            
          if (uploadError) {
            console.error('Error uploading file to Supabase Storage:', uploadError);
            continue; // Try the next file if this one fails
          }
          
          console.log('File uploaded successfully:', uploadData);
          
          // Get the public URL for the uploaded file
          const publicUrl = supabase.storage
            .from('job-files')
            .getPublicUrl(filePath).data.publicUrl;
          
          // Save file metadata to job_files table
          const { error: fileError } = await supabase
            .from('job_files')
            .insert({
              job_id: data.id,
              file_name: file.fileName,
              file_path: filePath,
              file_type: file.fileType,
              file_size: file.fileSize
            });
            
          if (fileError) {
            console.error('Error saving file metadata to Supabase:', fileError);
          }
        } catch (fileError) {
          console.error('Error processing file:', fileError);
        }
      }
    }
  } catch (error) {
    console.error('Error saving job:', error);
    throw error;
  }
};
