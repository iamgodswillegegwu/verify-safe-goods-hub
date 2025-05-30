
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

export interface ValidationResult {
  found: boolean;
  verified: boolean;
  confidence: number;
  source: string;
  product?: ExternalProduct;
  alternatives: ExternalProduct[];
  sources: ValidationSource[];
}

export interface AggregationFilters {
  category?: string;
  brand?: string;
  country?: string;
  minConfidence?: number;
}

// Optimized search function with performance improvements
export const searchProductsQuick = async (query: string): Promise<ExternalProduct[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    console.log('Searching products with optimized APIs for:', query);
    
    const results: ExternalProduct[] = [];
    const searchPromises: Promise<ExternalProduct[]>[] = [];

    // Search internal database first (fastest)
    searchPromises.push(searchInternalDatabase(query));
    
    // Add external searches with timeout
    searchPromises.push(searchOpenFoodFactsAPI(query));
    searchPromises.push(searchNAFDACAPI(query));

    // Wait for all searches with a global timeout
    const timeoutPromise = new Promise<ExternalProduct[][]>((_, reject) => {
      setTimeout(() => reject(new Error('Search timeout')), 4000);
    });

    try {
      const searchResults = await Promise.race([
        Promise.allSettled(searchPromises),
        timeoutPromise
      ]);

      // Process results from Promise.allSettled
      if (Array.isArray(searchResults)) {
        searchResults.forEach((result) => {
          if (result.status === 'fulfilled' && Array.isArray(result.value)) {
            results.push(...result.value);
          }
        });
      }
    } catch (error) {
      console.log('Search timeout, returning partial results');
    }

    console.log('Optimized search results:', results.length);
    return results.slice(0, 10); // Limit results for performance
  } catch (error) {
    console.error('Optimized search error:', error);
    return [];
  }
};

// Optimized internal database search
const searchInternalDatabase = async (query: string): Promise<ExternalProduct[]> => {
  try {
    const { data: internalProducts } = await supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        batch_number,
        manufacturer:manufacturers(company_name),
        category:categories(name)
      `)
      .ilike('name', `%${query}%`)
      .eq('status', 'approved')
      .limit(3);

    if (!internalProducts) return [];

    return internalProducts.map(product => ({
      id: product.id,
      name: product.name,
      brand: product.manufacturer?.company_name,
      category: product.category?.name,
      description: product.description,
      verified: true,
      confidence: 0.95,
      source: 'internal' as APISource,
      barcode: product.batch_number
    }));
  } catch (error) {
    console.error('Internal database search error:', error);
    return [];
  }
};

// Real OpenFoodFacts API call with timeout
const searchOpenFoodFactsAPI = async (query: string): Promise<ExternalProduct[]> => {
  try {
    console.log('Calling OpenFoodFacts API for:', query);
    
    // Create timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=3`,
      {
        headers: {
          'User-Agent': 'SafeGoods-ProductVerification/1.0'
        },
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OpenFoodFacts API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.products || !Array.isArray(data.products)) {
      return [];
    }

    return data.products.slice(0, 2).map((product: any, index: number) => ({
      id: `off-${product.id || Date.now()}-${index}`,
      name: product.product_name || product.brands || `Product ${index + 1}`,
      brand: product.brands || 'Unknown Brand',
      category: product.categories || 'Food & Beverages',
      description: product.generic_name || product.product_name || '',
      verified: !!product.nutrition_grade_fr,
      confidence: product.nutrition_grade_fr ? 0.8 : 0.6,
      source: 'openfoodfacts' as APISource,
      barcode: product.code,
      imageUrl: product.image_url,
      nutriScore: product.nutrition_grade_fr?.toUpperCase()
    }));
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('OpenFoodFacts API call timed out');
    } else {
      console.error('OpenFoodFacts API error:', error);
    }
    return [];
  }
};

// Real NAFDAC API call using the edge function with timeout
const searchNAFDACAPI = async (query: string): Promise<ExternalProduct[]> => {
  try {
    console.log('Calling NAFDAC API for:', query);
    
    const { data, error } = await supabase.functions.invoke('nafdac-scraper', {
      body: { searchQuery: query, limit: 2 }
    });
    
    if (error) {
      console.error('NAFDAC API error:', error);
      return [];
    }
    
    if (!data.products || !Array.isArray(data.products)) {
      return [];
    }
    
    return data.products.slice(0, 2).map((product: any) => ({
      id: `nafdac-${product.id || Date.now()}`,
      name: product.name || `NAFDAC Product`,
      brand: product.manufacturer || 'NAFDAC Registered',
      category: product.category || 'Regulated Product',
      description: `NAFDAC Registration: ${product.registrationNumber || 'N/A'}`,
      verified: product.verified || true,
      confidence: 0.9,
      source: 'nafdac' as APISource,
      barcode: product.registrationNumber
    }));
  } catch (error) {
    console.error('NAFDAC API error:', error);
    return [];
  }
};

// Real-time product validation with multiple APIs
export const validateProduct = async (barcode: string): Promise<ExternalProduct | null> => {
  try {
    console.log('Validating product with real APIs for barcode:', barcode);
    
    // Try OpenFoodFacts first
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      {
        headers: {
          'User-Agent': 'SafeGoods-ProductVerification/1.0'
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log('OpenFoodFacts validation response:', data);
      
      if (data.status === 1 && data.product) {
        const product = data.product;
        return {
          id: `off-${product.id || barcode}`,
          name: product.product_name || 'Unknown Product',
          brand: product.brands || 'Unknown Brand',
          category: product.categories || 'Food & Beverages',
          description: product.generic_name || product.product_name || '',
          barcode: barcode,
          verified: !!product.nutrition_grade_fr,
          confidence: product.nutrition_grade_fr ? 0.85 : 0.7,
          source: 'openfoodfacts',
          imageUrl: product.image_url,
          nutriScore: product.nutrition_grade_fr?.toUpperCase()
        };
      }
    }

    // If OpenFoodFacts fails, try internal database
    const { data: internalProduct } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name),
        manufacturer:manufacturers(company_name)
      `)
      .eq('batch_number', barcode)
      .single();

    if (internalProduct) {
      return {
        id: internalProduct.id,
        name: internalProduct.name,
        brand: internalProduct.manufacturer?.company_name || 'Unknown',
        category: internalProduct.category?.name || 'Unknown',
        description: internalProduct.description,
        barcode: barcode,
        verified: internalProduct.status === 'approved',
        confidence: 0.95,
        source: 'internal'
      };
    }

    return null;
  } catch (error) {
    console.error('Product validation error:', error);
    return null;
  }
};

export const validateProductExternal = async (barcode: string, productName?: string): Promise<ValidationResult> => {
  try {
    console.log('External validation for:', { barcode, productName });
    
    const sources: ValidationSource[] = [];
    let product: ExternalProduct | null = null;
    let highestConfidence = 0;

    // Try barcode validation first
    if (barcode) {
      const barcodeProduct = await validateProduct(barcode);
      if (barcodeProduct) {
        product = barcodeProduct;
        highestConfidence = barcodeProduct.confidence;
        sources.push({
          name: barcodeProduct.source.toUpperCase(),
          status: 'success',
          verified: barcodeProduct.verified,
          confidence: barcodeProduct.confidence
        });
      }
    }

    // If no barcode result and we have a product name, try name search
    if (!product && productName) {
      const nameResults = await searchProductsQuick(productName);
      if (nameResults.length > 0) {
        // Take the highest confidence result
        product = nameResults.reduce((best, current) => 
          current.confidence > best.confidence ? current : best
        );
        highestConfidence = product.confidence;
        sources.push({
          name: product.source.toUpperCase(),
          status: 'success',
          verified: product.verified,
          confidence: product.confidence
        });
      }
    }

    return {
      found: !!product,
      verified: product?.verified || false,
      confidence: highestConfidence,
      source: product?.source || 'unknown',
      product,
      alternatives: [],
      sources
    };
  } catch (error) {
    console.error('External validation error:', error);
    return {
      found: false,
      verified: false,
      confidence: 0,
      source: 'unknown',
      alternatives: [],
      sources: [{
        name: 'System',
        status: 'error',
        verified: false,
        confidence: 0
      }]
    };
  }
};

export const fetchProductDetails = async (id: string): Promise<ExternalProduct | null> => {
  try {
    console.log('Fetching product details for ID:', id);
    
    // If it's an OpenFoodFacts ID, fetch from their API
    if (id.startsWith('off-')) {
      const barcode = id.replace('off-', '').split('-')[0];
      return await validateProduct(barcode);
    }
    
    // If it's an internal ID, fetch from Supabase
    const { data: product } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name),
        manufacturer:manufacturers(company_name)
      `)
      .eq('id', id)
      .single();

    if (product) {
      return {
        id: product.id,
        name: product.name,
        brand: product.manufacturer?.company_name,
        category: product.category?.name,
        description: product.description,
        verified: product.status === 'approved',
        confidence: 0.95,
        source: 'internal',
        barcode: product.batch_number
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
};
