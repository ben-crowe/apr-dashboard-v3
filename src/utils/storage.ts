import { supabase } from "@/integrations/supabase/client";

export async function ensureDocumentsBucketExists() {
  try {
    // Check if the bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error listing buckets:", listError);
      return false;
    }
    
    const documentsBucketExists = buckets?.some(bucket => bucket.name === 'documents');
    
    if (!documentsBucketExists) {
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket('documents', {
        public: true,
        allowedMimeTypes: ['image/*', 'application/pdf'],
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (createError) {
        console.error("Error creating documents bucket:", createError);
        return false;
      }
      
      console.log("Documents bucket created successfully");
    }
    
    return true;
  } catch (error) {
    console.error("Error ensuring documents bucket exists:", error);
    return false;
  }
}