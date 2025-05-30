
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { fetchProductDetails, searchProductsQuick } from './externalApiService';
import { toast } from '@/hooks/use-toast';
import { getCategoryMapping } from './search/categoryMapper';

export interface SearchFilters {
  category?: string;
  nutriScore?: string[];
  country?: string;
  state?: string;
  city?: string;
}

export interface VerificationResult {
  result: 'verified' | 'not_verified' | 'unknown';
  product?: any;
  similarProducts?: any[];
  timestamp: string;
}

// Verify a product in real-time, using both internal and external data sources
export const verifyProduct = async (
  productName: string, 
  userId?: string, 
  filters: SearchFilters = {}
): Promise<VerificationResult> => {
  console.log('Verifying product:', { productName, userId, filters });

  try {
    // Check internal database first
    const { data: internalProduct, error: internalError } = await supabase
      .from('products')
      .select(`
        *,
        manufacturer:manufacturers(*)
      `)
      .ilike('name', `%${productName}%`)
      .eq('status', 'approved')
      .single();

    if (internalError && internalError.code !== 'PGRST116') {
      console.error('Error verifying product internally:', internalError);
    }

    // Log verification attempt if user is logged in
    if (userId) {
      try {
        await supabase
          .from('verifications')
          .insert({
            user_id: userId,
            product_id: internalProduct?.id,
            result: internalProduct ? 'verified' : 'not_verified',
            search_query: productName
          });
      } catch (logError) {
        console.error('Failed to log verification:', logError);
      }
    }

    // If found in internal database, return verified result
    if (internalProduct) {
      return {
        result: 'verified',
        product: internalProduct,
        timestamp: new Date().toISOString()
      };
    }

    // If not found internally, search for similar products in the database
    const { data: similarProducts, error: similarError } = await supabase
      .from('products')
      .select(`
        *,
        manufacturer:manufacturers(*)
      `)
      .ilike('name', `%${productName.split(' ')[0]}%`)
      .eq('status', 'approved')
      .limit(5);

    if (similarError) {
      console.error('Error searching for similar products:', similarError);
    }

    // Return not verified result with similar products
    return {
      result: 'not_verified',
      similarProducts: similarProducts || [],
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Product verification error:', error);
    return {
      result: 'unknown',
      timestamp: new Date().toISOString()
    };
  }
};

// Get similar products based on partial name match and categories
export const getSimilarProducts = async (
  productName: string,
  filters: SearchFilters = {}
): Promise<any[]> => {
  try {
    // Build query for internal similar products
    let query = supabase
      .from('products')
      .select(`
        *,
        manufacturer:manufacturers(*)
      `)
      .eq('status', 'approved')
      .neq('name', productName);

    // If we have a category filter, apply it
    if (filters.category) {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('name', filters.category)
        .single();

      if (categoryData) {
        query = query.eq('category_id', categoryData.id);
      }
    }

    // Split search terms and use the first significant word
    const searchTerms = productName.split(' ');
    const significantTerm = searchTerms.find(term => term.length > 3) || searchTerms[0];
    
    query = query.ilike('name', `%${significantTerm}%`);

    // Apply Nutri-Score filter if specified
    if (filters.nutriScore && filters.nutriScore.length > 0) {
      query = query.in('nutri_score', filters.nutriScore);
    }

    // Apply location filters if specified
    if (filters.country) {
      query = query.eq('country', filters.country);
    }
    if (filters.state) {
      query = query.eq('state', filters.state);
    }
    if (filters.city) {
      query = query.eq('city', filters.city);
    }

    // Execute the query
    const { data: internalSimilar, error } = await query.limit(5);

    if (error) {
      console.error('Error getting similar products:', error);
      return [];
    }

    // Try to get external similar products in parallel
    let externalSimilar: any[] = [];
    try {
      const categoryCode = filters.category ? getCategoryMapping(filters.category) : undefined;
      const externalProducts = await searchProductsQuick(significantTerm);
      externalSimilar = externalProducts
        .filter(p => p.name.toLowerCase() !== productName.toLowerCase())
        .slice(0, 3);
    } catch (externalError) {
      console.error('Failed to fetch external similar products:', externalError);
    }

    // Combine results, prioritizing internal database results
    return [...(internalSimilar || []), ...externalSimilar];
  } catch (error) {
    console.error('Error in getSimilarProducts:', error);
    return [];
  }
};

// Report a product issue or counterfeit
export const reportProduct = async (
  productId: string,
  userId: string,
  reason: string,
  description: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('product_reports')
      .insert({
        product_id: productId,
        user_id: userId,
        reason,
        description
      });

    if (error) {
      console.error('Error reporting product:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to report product:', error);
    return false;
  }
};
