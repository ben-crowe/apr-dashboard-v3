// Debug helper to show which Supabase instance is being used
export const debugSupabase = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  
  console.log('🔍 Supabase Configuration:');
  console.log('URL:', url);
  console.log('Project ID:', projectId);
  console.log('Environment:', import.meta.env.MODE);
  
  // Extract project ID from URL if not set
  const extractedId = url?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  console.log('Extracted ID:', extractedId);
  
  return {
    url,
    projectId: projectId || extractedId,
    isCorrectBackend: extractedId === 'ngovnamnjmexdpjtcnky'
  };
};