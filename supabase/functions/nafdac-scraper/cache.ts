
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { NAFDACProduct } from './types.ts';

// Cache NAFDAC search results to reduce API calls
export async function cacheNAFDACResult(
  supabase: ReturnType<typeof createClient>,
  query: string,
  products: NAFDACProduct[]
): Promise<void> {
  try {
    const queryHash = createQueryHash(query);
    
    // Set expiration to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    // Store result in cache table
    const { error } = await supabase
      .from('external_api_cache')
      .insert({
        query_hash: queryHash,
        result_data: {
          found: products.length > 0,
          verified: products.length > 0,
          confidence: products.length > 0 ? 0.8 : 0,
          source: 'nafdac',
          products: products,
          alternatives: []
        },
        expires_at: expiresAt.toISOString()
      });
    
    if (error) {
      console.error('Error caching NAFDAC result:', error);
    }
  } catch (error) {
    console.error('Error in cacheNAFDACResult:', error);
  }
}

// Retrieve cached NAFDAC result if available
export async function getCachedResult(
  supabase: ReturnType<typeof createClient>,
  query: string
): Promise<{ result_data: any } | null> {
  try {
    const queryHash = createQueryHash(query);
    
    // Get cached result if not expired
    const { data, error } = await supabase
      .from('external_api_cache')
      .select('result_data')
      .eq('query_hash', queryHash)
      .gt('expires_at', new Date().toISOString())
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error retrieving cached result:', error);
    return null;
  }
}

// Create a simple hash for the query string
function createQueryHash(query: string): string {
  const normalized = query.toLowerCase().trim();
  
  // Simple hash function for query
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return `nafdac-${hash}-${normalized.substr(0, 10)}`;
}
