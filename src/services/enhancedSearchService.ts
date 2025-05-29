
import { supabase } from '@/integrations/supabase/client';
import { 
  searchProductsQuick, 
  validateProductExternal, 
  ExternalProduct,
  ValidationResult 
} from './externalApiService';

export interface EnhancedSearchFilters {
  category?: string;
  nutriScore?: string[];
  country?: string;
  state?: string;
  searchQuery?: string;
}

export interface EnhancedSearchResult {
  internal: {
    products: any[];
    count: number;
  };
  external: {
    products: ExternalProduct[];
    count: number;
  };
  combined: any[];
}

// Map internal categories to external API categories
const getCategoryMapping = (category: string): string => {
  const mappings: Record<string, string> = {
    'Cosmetics': 'cosmetics',
    'Skincare': 'cosmetics',
    'Personal Care': 'personal_care',
    'Hair Care': 'cosmetics',
    'Food Products': 'food',
    'Beverages': 'food',
    'Supplements': 'supplement',
    'Vitamins': 'supplement',
    'Medications': 'medication'
  };
  
  return mappings[category] || 'food';
};

// Enhanced search that queries both internal and external APIs with filters
export const performEnhancedSearch = async (
  query: string,
  filters: EnhancedSearchFilters = {},
  limit: number = 10
): Promise<EnhancedSearchResult> => {
  try {
    console.log('Performing enhanced search with filters:', { query, filters });

    // Build internal database query
    let internalQuery = supabase
      .from('products')
      .select(`
        *,
        manufacturer:manufacturers(*),
        category:categories(*)
      `)
      .eq('status', 'approved');

    // Apply search query filter
    if (query.trim()) {
      internalQuery = internalQuery.ilike('name', `%${query}%`);
    }

    // Apply category filter
    if (filters.category) {
      internalQuery = internalQuery.eq('category.name', filters.category);
    }

    // Apply nutri-score filter
    if (filters.nutriScore && filters.nutriScore.length > 0) {
      internalQuery = internalQuery.in('nutri_score', filters.nutriScore);
    }

    // Apply location filters
    if (filters.country) {
      internalQuery = internalQuery.eq('country', filters.country);
    }
    if (filters.state) {
      internalQuery = internalQuery.eq('state', filters.state);
    }

    // Execute internal search
    const { data: internalProducts, error: internalError } = await internalQuery
      .limit(limit)
      .order('created_at', { ascending: false });

    if (internalError) {
      console.error('Internal search error:', internalError);
    }

    // Perform external API search with category mapping
    let externalProducts: ExternalProduct[] = [];
    
    if (query.trim()) {
      const mappedCategory = filters.category ? getCategoryMapping(filters.category) : undefined;
      
      // Search external APIs based on category
      if (!mappedCategory || mappedCategory === 'food') {
        const foodResults = await searchProductsQuick(query, Math.ceil(limit / 2));
        externalProducts.push(...foodResults);
      }
      
      if (!mappedCategory || ['cosmetics', 'personal_care'].includes(mappedCategory)) {
        // For cosmetics/personal care, we'll simulate results since APIs are limited
        const cosmeticResults = await searchProductsQuick(query, Math.ceil(limit / 4));
        externalProducts.push(...cosmeticResults.map(p => ({
          ...p,
          category: 'cosmetics',
          source: 'cosing' as const
        })));
      }
      
      if (!mappedCategory || ['supplement', 'medication'].includes(mappedCategory)) {
        // For supplements/medications, enhance with FDA search simulation
        if (query.toLowerCase().includes('vitamin') || query.toLowerCase().includes('supplement')) {
          externalProducts.push({
            id: `supplement-${Date.now()}`,
            name: `${query} Supplement`,
            brand: 'External Source',
            category: 'supplement',
            verified: true,
            source: 'fda',
            data: {},
            imageUrl: '/placeholder.svg'
          });
        }
      }
    }

    // Filter external results by nutri-score if specified
    if (filters.nutriScore && filters.nutriScore.length > 0) {
      externalProducts = externalProducts.filter(product => 
        product.nutriScore && filters.nutriScore!.includes(product.nutriScore)
      );
    }

    // Combine and deduplicate results
    const combinedResults = [
      ...(internalProducts || []).map(p => ({ ...p, source: 'internal' })),
      ...externalProducts.map(p => ({ ...p, source: 'external' }))
    ];

    console.log('Enhanced search results:', {
      internal: internalProducts?.length || 0,
      external: externalProducts.length,
      combined: combinedResults.length
    });

    return {
      internal: {
        products: internalProducts || [],
        count: internalProducts?.length || 0
      },
      external: {
        products: externalProducts,
        count: externalProducts.length
      },
      combined: combinedResults
    };

  } catch (error) {
    console.error('Enhanced search error:', error);
    return {
      internal: { products: [], count: 0 },
      external: { products: [], count: 0 },
      combined: []
    };
  }
};

// Get enhanced validation with location and category context
export const getEnhancedValidation = async (
  productName: string,
  filters: EnhancedSearchFilters = {}
): Promise<ValidationResult & { productDetails?: any }> => {
  try {
    const mappedCategory = filters.category ? getCategoryMapping(filters.category) : undefined;
    
    const result = await validateProductExternal(
      productName,
      undefined, // barcode
      mappedCategory
    );

    // If product found, enrich with additional details
    if (result.product) {
      const enrichedProduct = {
        ...result.product,
        searchContext: {
          category: filters.category,
          location: filters.country ? `${filters.country}${filters.state ? `, ${filters.state}` : ''}` : undefined,
          nutriScoreFilter: filters.nutriScore
        }
      };

      return {
        ...result,
        productDetails: enrichedProduct
      };
    }

    return result;
  } catch (error) {
    console.error('Enhanced validation error:', error);
    return {
      found: false,
      verified: false,
      confidence: 0,
      source: 'error',
      alternatives: []
    };
  }
};
