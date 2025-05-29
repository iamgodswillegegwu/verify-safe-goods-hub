
import { supabase, Product, Verification } from '@/lib/supabase';

export interface SearchFilters {
  category?: string;
  country?: string;
  state?: string;
  city?: string;
  nutriScore?: string[];
}

export const searchProducts = async (query: string, filters?: SearchFilters): Promise<Product[]> => {
  let queryBuilder = supabase
    .from('products')
    .select(`
      *,
      manufacturer:manufacturers(*),
      category:categories(*)
    `)
    .eq('status', 'approved')
    .ilike('name', `%${query}%`);

  // Apply filters
  if (filters?.category) {
    queryBuilder = queryBuilder.eq('category.name', filters.category);
  }
  if (filters?.country) {
    queryBuilder = queryBuilder.eq('country', filters.country);
  }
  if (filters?.state) {
    queryBuilder = queryBuilder.eq('state', filters.state);
  }
  if (filters?.city) {
    queryBuilder = queryBuilder.eq('city', filters.city);
  }
  if (filters?.nutriScore && filters.nutriScore.length > 0) {
    queryBuilder = queryBuilder.in('nutri_score', filters.nutriScore);
  }

  const { data, error } = await queryBuilder.limit(10);

  if (error) {
    console.error('Error searching products:', error);
    return [];
  }

  return data || [];
};

export const verifyProduct = async (query: string, userId?: string, filters?: SearchFilters): Promise<Verification> => {
  // First, search for the product with filters
  const products = await searchProducts(query, filters);
  
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

export const getSimilarProducts = async (query: string, filters?: SearchFilters): Promise<Product[]> => {
  let queryBuilder = supabase
    .from('products')
    .select(`
      *,
      manufacturer:manufacturers(*),
      category:categories(*)
    `)
    .eq('status', 'approved')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

  // Apply same filters as search
  if (filters?.category) {
    queryBuilder = queryBuilder.eq('category.name', filters.category);
  }
  if (filters?.country) {
    queryBuilder = queryBuilder.eq('country', filters.country);
  }
  if (filters?.state) {
    queryBuilder = queryBuilder.eq('state', filters.state);
  }
  if (filters?.city) {
    queryBuilder = queryBuilder.eq('city', filters.city);
  }
  if (filters?.nutriScore && filters.nutriScore.length > 0) {
    queryBuilder = queryBuilder.in('nutri_score', filters.nutriScore);
  }

  const { data, error } = await queryBuilder.limit(5);

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

// New favorite functionality
export const addToFavorites = async (userId: string, productId: string) => {
  const { error } = await supabase
    .from('user_favorites')
    .insert({ user_id: userId, product_id: productId });

  if (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeFromFavorites = async (userId: string, productId: string) => {
  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

export const getUserFavorites = async (userId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('user_favorites')
    .select(`
      product:products(
        *,
        manufacturer:manufacturers(*),
        category:categories(*)
      )
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }

  // Fix the type issue by properly extracting the product data
  return data?.map(item => item.product).filter((product): product is Product => product !== null) || [];
};

export const isProductFavorited = async (userId: string, productId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('user_favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking favorite status:', error);
    return false;
  }

  return !!data;
};

// Product reporting functionality
export const reportProduct = async (
  userId: string, 
  productId: string, 
  reason: string, 
  description?: string
) => {
  const { error } = await supabase
    .from('product_reports')
    .insert({
      user_id: userId,
      product_id: productId,
      reason,
      description
    });

  if (error) {
    console.error('Error reporting product:', error);
    throw error;
  }
};
