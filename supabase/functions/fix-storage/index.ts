import { serve } from 'https://deno.land/std@0.220.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.7';

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get service role client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // List existing buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    const results = {
      existingBuckets: buckets || [],
      created: [],
      errors: []
    };

    // Check if buckets exist and update permissions
    const requiredBuckets = ['job-files', 'job-documents'];
    
    for (const bucketName of requiredBuckets) {
      const bucket = buckets?.find(b => b.id === bucketName || b.name === bucketName);
      
      if (!bucket) {
        // Create bucket
        const { data, error } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 10485760 // 10MB
        });
        
        if (error) {
          results.errors.push({ bucket: bucketName, error: error.message });
        } else {
          results.created.push(bucketName);
        }
      } else if (!bucket.public) {
        // Bucket exists but is not public - we need to fix this
        // Unfortunately Supabase doesn't have an updateBucket method in the client
        // We'll note this in the results
        results.errors.push({ 
          bucket: bucketName, 
          error: `Bucket exists but is private. Please run SQL: UPDATE storage.buckets SET public = true WHERE id = '${bucketName}';` 
        });
      }
    }

    return new Response(
      JSON.stringify(results),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});