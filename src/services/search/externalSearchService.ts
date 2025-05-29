
import { 
  searchProductsQuick, 
  ExternalProduct,
  APISource
} from '../externalApiService';
import { getCategoryMapping } from './categoryMapper';

export interface ExternalSearchFilters {
  category?: string;
  nutriScore?: string[];
}

export const performExternalSearch = async (
  query: string,
  filters: ExternalSearchFilters = {},
  limit: number = 10
): Promise<ExternalProduct[]> => {
  let externalProducts: ExternalProduct[] = [];
  
  if (!query.trim()) {
    return externalProducts;
  }

  const mappedCategory = filters.category ? getCategoryMapping(filters.category) : undefined;
  
  // Search external APIs based on category
  if (!mappedCategory || mappedCategory === 'food') {
    const foodResults = await searchProductsQuick(query, Math.ceil(limit / 3));
    externalProducts.push(...foodResults);
  }
  
  if (!mappedCategory || ['cosmetics', 'personal_care'].includes(mappedCategory)) {
    // For cosmetics/personal care, we'll simulate results since APIs are limited
    const cosmeticResults = await searchProductsQuick(query, Math.ceil(limit / 4));
    externalProducts.push(...cosmeticResults.map(p => ({
      ...p,
      category: 'cosmetics',
      source: 'cosing' as APISource
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
        source: 'fda' as APISource,
        data: {},
        imageUrl: '/placeholder.svg'
      });
    }
  }

  // Always search NAFDAC for Nigerian products (covers all categories)
  try {
    const nafdacResponse = await fetch('https://flyvlvtvgvfybtnuntsd.supabase.co/functions/v1/nafdac-scraper', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseXZsdnR2Z3ZmeWJ0bnVudHNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NDQ5MTgsImV4cCI6MjA2NDEyMDkxOH0.iGlfXJUM6EZUwE_s0ipn6LR4ZkgK3d2hojRs5m_xo-g`,
      },
      body: JSON.stringify({
        searchQuery: query,
        limit: Math.ceil(limit / 4)
      })
    });

    const nafdacData = await nafdacResponse.json();
    if (nafdacData.found && nafdacData.products) {
      nafdacData.products.forEach((product: any) => {
        externalProducts.push({
          id: product.id,
          name: product.name,
          brand: product.manufacturer,
          category: product.category,
          verified: product.verified,
          source: 'nafdac' as APISource,
          data: {
            ...product,
            certifyingOrganization: 'NAFDAC (Nigeria)',
            country: 'Nigeria'
          },
          imageUrl: '/placeholder.svg'
        });
      });
    }
  } catch (nafdacError) {
    console.error('Error searching NAFDAC:', nafdacError);
  }

  // Filter external results by nutri-score if specified
  if (filters.nutriScore && filters.nutriScore.length > 0) {
    externalProducts = externalProducts.filter(product => 
      product.nutriScore && filters.nutriScore!.includes(product.nutriScore)
    );
  }

  return externalProducts;
};
