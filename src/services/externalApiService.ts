import { supabase } from '@/lib/supabase';

export interface ExternalProduct {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  description?: string;
  barcode?: string;
  verified: boolean;
  confidence: number;
  source: APISource;
  imageUrl?: string;
  nutriScore?: string;
}

export type APISource = 'internal' | 'openfoodfacts' | 'fda' | 'nafdac';

export interface ValidationSource {
  name: string;
  status: 'success' | 'error' | 'pending';
  verified: boolean;
  confidence: number;
  details?: any;
}

export interface AggregationFilters {
  category?: string;
  brand?: string;
  country?: string;
  minConfidence?: number;
}

// Mock quick search function for auto-suggest
export const searchProductsQuick = async (query: string): Promise<ExternalProduct[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    // Search internal database first
    const { data: internalProducts } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name),
        manufacturer:manufacturers(company_name)
      `)
      .ilike('name', `%${query}%`)
      .limit(5);

    const results: ExternalProduct[] = [];
    
    if (internalProducts) {
      results.push(...internalProducts.map(product => ({
        id: product.id,
        name: product.name,
        brand: product.manufacturer?.company_name,
        category: product.category?.name,
        description: product.description,
        verified: product.status === 'approved',
        confidence: 0.95,
        source: 'internal' as APISource,
        barcode: product.batch_number
      })));
    }

    // Add mock external results for demo
    if (results.length < 3) {
      results.push({
        id: `ext-${Date.now()}`,
        name: `${query} Product`,
        brand: 'Sample Brand',
        category: 'Food',
        verified: Math.random() > 0.5,
        confidence: Math.random() * 0.5 + 0.5,
        source: 'openfoodfacts' as APISource
      });
    }

    return results;
  } catch (error) {
    console.error('Quick search error:', error);
    return [];
  }
};

export const validateProduct = async (barcode: string): Promise<ExternalProduct | null> => {
    // Simulate API call to external database
    await new Promise(resolve => setTimeout(resolve, 1000));

    const randomConfidence = Math.random() * 0.4 + 0.6; // Confidence between 60% and 100%
    const isVerified = randomConfidence > 0.75;

    return {
        id: `ext-${Date.now()}`,
        name: 'External Product',
        brand: 'Sample Brand',
        category: 'Food',
        description: 'Product found in external database',
        barcode: barcode,
        verified: isVerified,
        confidence: randomConfidence,
        source: 'openfoodfacts'
    };
};

export const fetchProductDetails = async (id: string): Promise<ExternalProduct | null> => {
    // Simulate API call to fetch product details by ID
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        id: id,
        name: 'Detailed Product',
        brand: 'Sample Brand',
        category: 'Food',
        description: 'Detailed product description from external source',
        barcode: '123456789',
        verified: true,
        confidence: 0.85,
        source: 'openfoodfacts',
        imageUrl: 'https://via.placeholder.com/150',
        nutriScore: 'B'
    };
};
