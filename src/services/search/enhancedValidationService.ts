
import { validateProductExternal, ValidationResult } from '../externalApiService';
import { getCategoryMapping } from './categoryMapper';

export interface ValidationFilters {
  category?: string;
  country?: string;
  state?: string;
  nutriScore?: string[];
}

// Get enhanced validation with location and category context
export const getEnhancedValidation = async (
  productName: string,
  filters: ValidationFilters = {}
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
      source: 'external' as any,
      alternatives: []
    };
  }
};
