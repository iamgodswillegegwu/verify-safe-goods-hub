
import { supabase, Product, Verification } from '@/lib/supabase';

export const searchProducts = async (query: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      manufacturer:manufacturers(*),
      category:categories(*)
    `)
    .eq('status', 'approved')
    .ilike('name', `%${query}%`)
    .limit(10);

  if (error) {
    console.error('Error searching products:', error);
    return [];
  }

  return data || [];
};

export const verifyProduct = async (query: string, userId?: string): Promise<Verification> => {
  // First, search for the product
  const products = await searchProducts(query);
  
  let result: 'verified' | 'not_found' | 'counterfeit' = 'not_found';
  let productId: string | undefined;

  if (products.length > 0) {
    // Check if the exact product name matches
    const exactMatch = products.find(p => 
      p.name.toLowerCase() === query.toLowerCase()
    );
    
    if (exactMatch) {
      result = 'verified';
      productId = exactMatch.id;
    } else {
      // Similar products found but no exact match
      result = 'not_found';
    }
  }

  // Log the verification attempt
  const verification: Partial<Verification> = {
    user_id: userId,
    product_id: productId,
    search_query: query,
    result
  };

  const { data, error } = await supabase
    .from('verifications')
    .insert(verification)
    .select(`
      *,
      product:products(
        *,
        manufacturer:manufacturers(*),
        category:categories(*)
      )
    `)
    .single();

  if (error) {
    console.error('Error logging verification:', error);
    // Return a basic verification object even if logging fails
    return {
      id: 'temp',
      search_query: query,
      result,
      created_at: new Date().toISOString(),
      product: productId ? products.find(p => p.id === productId) : undefined
    } as Verification;
  }

  return data;
};

export const getSimilarProducts = async (query: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      manufacturer:manufacturers(*),
      category:categories(*)
    `)
    .eq('status', 'approved')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(5);

  if (error) {
    console.error('Error fetching similar products:', error);
    return [];
  }

  return data || [];
};

export const getVerificationHistory = async (userId: string): Promise<Verification[]> => {
  const { data, error } = await supabase
    .from('verifications')
    .select(`
      *,
      product:products(
        *,
        manufacturer:manufacturers(*),
        category:categories(*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching verification history:', error);
    return [];
  }

  return data || [];
};
