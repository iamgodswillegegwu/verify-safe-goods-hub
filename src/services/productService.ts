
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
    // Check internal database first with comprehensive product details
    const { data: internalProduct, error: internalError } = await supabase
      .from('products')
      .select(`
        *,
        manufacturer:manufacturers(*),
        category:categories(*)
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

    // If found in internal database, return verified result with comprehensive details
    if (internalProduct) {
      return {
        result: 'verified',
        product: {
          ...internalProduct,
          // Ensure we have the image URL properly formatted
          image_url: internalProduct.image_url || null,
          // Add any missing fields with defaults
          description: internalProduct.description || 'No description available',
          manufacturing_date: internalProduct.manufacturing_date || null,
          expiry_date: internalProduct.expiry_date || null,
          allergens: internalProduct.allergens || [],
          nutrition_facts: internalProduct.nutrition_facts || {},
          certification_documents: internalProduct.certification_documents || []
        },
        timestamp: new Date().toISOString()
      };
    }

    // If not found internally, search for similar products in the database with full details
    const { data: similarProducts, error: similarError } = await supabase
      .from('products')
      .select(`
        *,
        manufacturer:manufacturers(*),
        category:categories(*)
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

// Get similar products based on partial name match and categories with comprehensive details
export const getSimilarProducts = async (
  productName: string,
  filters: SearchFilters = {}
): Promise<any[]> => {
  try {
    // Build query for internal similar products with full details
    let query = supabase
      .from('products')
      .select(`
        *,
        manufacturer:manufacturers(*),
        category:categories(*)
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
        .map(p => ({
          ...p,
          // Ensure consistent field mapping for external products
          manufacturer: p.brand,
          verified: p.verified,
          imageUrl: p.imageUrl,
          description: p.description || 'External product',
          category: p.category,
          nutriScore: p.nutriScore,
          source: p.source
        }))
        .slice(0, 3);
    } catch (externalError) {
      console.error('Failed to fetch external similar products:', externalError);
    }

    // Combine results, prioritizing internal database results with enhanced mapping
    const mappedInternal = (internalSimilar || []).map(p => ({
      ...p,
      manufacturer: p.manufacturer?.company_name || 'Unknown',
      verified: true,
      imageUrl: p.image_url,
      source: 'internal'
    }));

    return [...mappedInternal, ...externalSimilar];
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

// Add product to user favorites
export const addToFavorites = async (userId: string, productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: userId,
        product_id: productId
      });

    if (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to add to favorites:', error);
    return false;
  }
};

// Remove product from user favorites
export const removeFromFavorites = async (userId: string, productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to remove from favorites:', error);
    return false;
  }
};

// Check if product is favorited by user
export const isProductFavorited = async (userId: string, productId: string): Promise<boolean> => {
  try {
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
  } catch (error) {
    console.error('Failed to check favorite status:', error);
    return false;
  }
};

// Get user's favorite products
export const getUserFavorites = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select(`
        id,
        created_at,
        product:products(
          *,
          manufacturer:manufacturers(*),
          category:categories(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting user favorites:', error);
      return [];
    }

    // Extract products from the favorites data
    return data?.map(fav => ({
      ...fav.product,
      favorited_at: fav.created_at
    })) || [];
  } catch (error) {
    console.error('Failed to get user favorites:', error);
    return [];
  }
};
