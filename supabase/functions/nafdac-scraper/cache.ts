
import { NAFDACProduct } from './types.ts';

// Cache NAFDAC results
export async function cacheNAFDACResult(supabase: any, query: string, products: NAFDACProduct[]) {
  try {
    await supabase
      .from('external_api_cache')
      .insert({
        query_hash: btoa(`nafdac-${query}`),
        result_data: {
          found: products.length > 0,
          verified: true,
          confidence: products.length > 0 ? 0.8 : 0,
          source: 'nafdac',
          products: products,
          alternatives: []
        },
        expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() // 6 hours cache
      });
  } catch (error) {
    console.error('Error caching NAFDAC result:', error);
  }
}

export async function getCachedResult(supabase: any, query: string) {
  const cacheKey = btoa(`nafdac-${query}`);
  const { data: cached } = await supabase
    .from('external_api_cache')
    .select('result_data')
    .eq('query_hash', cacheKey)
    .gt('expires_at', new Date().toISOString())
    .single();

  return cached;
}
