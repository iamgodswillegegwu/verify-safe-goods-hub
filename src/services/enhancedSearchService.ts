
import { ExternalProduct } from './externalApiService';
import { performInternalSearch, InternalSearchFilters } from './search/internalSearchService';
import { performExternalSearch } from './search/externalSearchService';

export interface EnhancedSearchFilters extends InternalSearchFilters {
  // Inherits all filters from InternalSearchFilters
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

// Enhanced search that queries both internal and external APIs with filters
export const performEnhancedSearch = async (
  query: string,
  filters: EnhancedSearchFilters = {},
  limit: number = 10
): Promise<EnhancedSearchResult> => {
  try {
    console.log('Performing enhanced search with filters:', { query, filters });

    // Execute internal search
    const internalResult = await performInternalSearch(query, filters, limit);

    // Perform external API search
    const externalProducts = await performExternalSearch(query, filters, limit);

    // Combine and deduplicate results
    const combinedResults = [
      ...internalResult.products.map(p => ({ ...p, source: 'internal' })),
      ...externalProducts.map(p => ({ ...p, source: 'external' }))
    ];

    console.log('Enhanced search results:', {
      internal: internalResult.count,
      external: externalProducts.length,
      combined: combinedResults.length
    });

    return {
      internal: internalResult,
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

// Re-export validation service
export { getEnhancedValidation } from './search/enhancedValidationService';
