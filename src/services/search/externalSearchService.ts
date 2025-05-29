
import { supabase } from '@/lib/supabase';
import {
  ExternalProduct,
  APISource
} from '../externalApiService';

interface ExternalSearchFilters {
  category?: string;
  brand?: string;
  verified?: boolean;
}

export const searchExternalProducts = async (
  query: string,
  filters: ExternalSearchFilters = {}
): Promise<ExternalProduct[]> => {
  const results: ExternalProduct[] = [];
  
  try {
    // Search OpenFoodFacts (mock implementation)
    const openFoodFactsResults = await searchOpenFoodFacts(query, filters);
    results.push(...openFoodFactsResults);
    
    // Search FDA database (mock implementation)
    const fdaResults = await searchFDADatabase(query, filters);
    results.push(...fdaResults);
    
    // Search NAFDAC (mock implementation)
    const nafdacResults = await searchNAFDACDatabase(query, filters);
    results.push(...nafdacResults);
    
    return results.slice(0, 20); // Limit results
  } catch (error) {
    console.error('External search error:', error);
    return [];
  }
};

const searchOpenFoodFacts = async (
  query: string,
  filters: ExternalSearchFilters
): Promise<ExternalProduct[]> => {
  // Mock OpenFoodFacts search
  const mockResults: ExternalProduct[] = [
    {
      id: `off-${Date.now()}-1`,
      name: `${query} - OpenFoodFacts Product`,
      brand: 'Sample Brand',
      category: filters.category || 'Food & Beverages',
      description: `Product found in OpenFoodFacts containing "${query}"`,
      verified: Math.random() > 0.3,
      confidence: Math.random() * 0.4 + 0.6,
      source: 'openfoodfacts' as APISource,
      barcode: `123456789${Math.floor(Math.random() * 1000)}`
    }
  ];
  
  return mockResults;
};

const searchFDADatabase = async (
  query: string,
  filters: ExternalSearchFilters
): Promise<ExternalProduct[]> => {
  // Mock FDA search
  const mockResults: ExternalProduct[] = [
    {
      id: `fda-${Date.now()}-1`,
      name: `${query} - FDA Approved`,
      brand: 'Pharmaceutical Co.',
      category: filters.category || 'Medicine',
      description: `FDA approved product matching "${query}"`,
      verified: true,
      confidence: Math.random() * 0.2 + 0.8,
      source: 'fda' as APISource,
      barcode: `FDA${Math.floor(Math.random() * 100000)}`
    }
  ];
  
  return mockResults;
};

const searchNAFDACDatabase = async (
  query: string,
  filters: ExternalSearchFilters
): Promise<ExternalProduct[]> => {
  try {
    // Use the NAFDAC scraper edge function
    const { data, error } = await supabase.functions.invoke('nafdac-scraper', {
      body: { query, filters }
    });
    
    if (error) {
      console.error('NAFDAC search error:', error);
      return [];
    }
    
    return data?.products?.map((product: any) => ({
      id: `nafdac-${product.id || Date.now()}`,
      name: product.name || `${query} - NAFDAC Product`,
      brand: product.manufacturer || 'Unknown',
      category: product.category || 'General',
      description: product.description || `NAFDAC registered product containing "${query}"`,
      verified: product.verified || false,
      confidence: product.confidence || 0.7,
      source: 'nafdac' as APISource,
      barcode: product.registration_number || `NAFDAC${Math.floor(Math.random() * 100000)}`
    })) || [];
  } catch (error) {
    console.error('NAFDAC search error:', error);
    return [];
  }
};
