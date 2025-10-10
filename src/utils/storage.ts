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
      console.warn("⚠️ Documents bucket does not exist. Please create it manually in Supabase Dashboard with settings: public=true, allowedMimeTypes=['image/*','application/pdf'], fileSizeLimit=10MB");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error ensuring documents bucket exists:", error);
    return false;
  }
}