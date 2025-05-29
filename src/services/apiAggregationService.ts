
import { 
  ExternalProduct, 
  APISource, 
  ValidationSource,
  AggregationFilters 
} from './externalApiService';
import { supabase } from '@/lib/supabase';

interface AggregatedSearchResult {
  products: ExternalProduct[];
  sources: ValidationSource[];
  confidence: number;
  count: number;
}

export const aggregateProductSearch = async (
  query: string,
  filters: AggregationFilters = {}
): Promise<AggregatedSearchResult> => {
  console.log('Starting aggregated search for:', query);
  
  const sources: ValidationSource[] = [];
  let allProducts: ExternalProduct[] = [];
  
  try {
    // Search internal database
    const internalResults = await searchInternalDatabase(query, filters);
    if (internalResults.length > 0) {
      allProducts.push(...internalResults);
      sources.push({
        name: 'Internal Database',
        status: 'success',
        verified: true,
        confidence: 0.95,
        details: { count: internalResults.length }
      });
    }
    
    // Search external APIs
    const externalResults = await searchExternalAPIs(query, filters);
    allProducts.push(...externalResults);
    
    // Add external source info
    sources.push({
      name: 'External APIs',
      status: 'success',
      verified: true,
      confidence: 0.75,
      details: { count: externalResults.length }
    });
    
    // Remove duplicates and sort by confidence
    const uniqueProducts = deduplicateProducts(allProducts);
    const sortedProducts = uniqueProducts.sort((a, b) => b.confidence - a.confidence);
    
    // Calculate overall confidence
    const avgConfidence = sortedProducts.length > 0 
      ? sortedProducts.reduce((sum, p) => sum + p.confidence, 0) / sortedProducts.length 
      : 0;
    
    console.log(`Found ${sortedProducts.length} unique products from ${sources.length} sources`);
    
    return {
      products: sortedProducts,
      sources,
      confidence: avgConfidence,
      count: sortedProducts.length
    };
    
  } catch (error) {
    console.error('Aggregation error:', error);
    sources.push({
      name: 'Aggregation Service',
      status: 'error',
      verified: false,
      confidence: 0,
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
    
    return {
      products: [],
      sources,
      confidence: 0,
      count: 0
    };
  }
};

const searchInternalDatabase = async (
  query: string, 
  filters: AggregationFilters
): Promise<ExternalProduct[]> => {
  try {
    let dbQuery = supabase
      .from('products')
      .select(`
        *,
        category:categories(name),
        manufacturer:manufacturers(company_name)
      `)
      .ilike('name', `%${query}%`);
    
    if (filters.category) {
      dbQuery = dbQuery.eq('categories.name', filters.category);
    }
    
    if (filters.minConfidence) {
      // Filter by approval status as proxy for confidence
      dbQuery = dbQuery.eq('status', 'approved');
    }
    
    const { data, error } = await dbQuery.limit(10);
    
    if (error) throw error;
    
    return (data || []).map(product => ({
      id: product.id,
      name: product.name,
      brand: product.manufacturer?.company_name,
      category: product.category?.name,
      description: product.description,
      barcode: product.batch_number,
      verified: product.status === 'approved',
      confidence: product.status === 'approved' ? 0.95 : 0.6,
      source: 'internal' as APISource
    }));
  } catch (error) {
    console.error('Internal search error:', error);
    return [];
  }
};

const searchExternalAPIs = async (
  query: string,
  filters: AggregationFilters
): Promise<ExternalProduct[]> => {
  const results: ExternalProduct[] = [];
  
  try {
    // Mock external API results
    const mockResults: ExternalProduct[] = [
      {
        id: `ext-${Date.now()}-1`,
        name: `${query} External Product`,
        brand: 'External Brand',
        category: filters.category || 'General',
        description: `External product matching "${query}"`,
        verified: Math.random() > 0.4,
        confidence: Math.random() * 0.5 + 0.5,
        source: 'openfoodfacts' as APISource
      }
    ];
    
    results.push(...mockResults);
    
    return results;
  } catch (error) {
    console.error('External API search error:', error);
    return [];
  }
};

const deduplicateProducts = (products: ExternalProduct[]): ExternalProduct[] => {
  const seen = new Set();
  return products.filter(product => {
    const key = `${product.name.toLowerCase()}-${product.brand?.toLowerCase() || ''}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

export const getProductSources = async (productId: string): Promise<ValidationSource[]> => {
  // Mock implementation for getting validation sources for a specific product
  return [
    {
      name: 'NAFDAC',
      status: 'success',
      verified: true,
      confidence: 0.9,
      details: { lastChecked: new Date().toISOString() }
    },
    {
      name: 'OpenFoodFacts',
      status: 'success',
      verified: true,
      confidence: 0.8,
      details: { lastChecked: new Date().toISOString() }
    }
  ];
};

export const validateProductAcrossSources = async (
  productName: string,
  barcode?: string
): Promise<ValidationSource[]> => {
  console.log('Validating product across sources:', productName);
  
  const sources: ValidationSource[] = [];
  
  try {
    // Validate against NAFDAC
    const nafdacResult = await validateWithNAFDAC(productName, barcode);
    sources.push(nafdacResult);
    
    // Validate against OpenFoodFacts
    const offResult = await validateWithOpenFoodFacts(productName, barcode);
    sources.push(offResult);
    
    // Validate against FDA (if applicable)
    const fdaResult = await validateWithFDA(productName, barcode);
    sources.push(fdaResult);
    
    return sources;
  } catch (error) {
    console.error('Cross-validation error:', error);
    return [{
      name: 'Validation Service',
      status: 'error',
      verified: false,
      confidence: 0,
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    }];
  }
};

const validateWithNAFDAC = async (productName: string, barcode?: string): Promise<ValidationSource> => {
  try {
    // Use NAFDAC scraper function
    const { data, error } = await supabase.functions.invoke('nafdac-scraper', {
      body: { query: productName, barcode }
    });
    
    if (error) throw error;
    
    return {
      name: 'NAFDAC',
      status: 'success',
      verified: data?.verified || false,
      confidence: data?.confidence || 0.7,
      details: data
    };
  } catch (error) {
    return {
      name: 'NAFDAC',
      status: 'error',
      verified: false,
      confidence: 0,
      details: { error: error instanceof Error ? error.message : 'NAFDAC validation failed' }
    };
  }
};

const validateWithOpenFoodFacts = async (productName: string, barcode?: string): Promise<ValidationSource> => {
  // Mock OpenFoodFacts validation
  return {
    name: 'OpenFoodFacts',
    status: 'success',
    verified: Math.random() > 0.3,
    confidence: Math.random() * 0.4 + 0.6,
    details: { productName, barcode, lastChecked: new Date().toISOString() }
  };
};

const validateWithFDA = async (productName: string, barcode?: string): Promise<ValidationSource> => {
  // Mock FDA validation
  return {
    name: 'FDA',
    status: 'success',
    verified: Math.random() > 0.2,
    confidence: Math.random() * 0.3 + 0.7,
    details: { productName, barcode, lastChecked: new Date().toISOString() }
  };
};
