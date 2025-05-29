import { supabase } from '@/integrations/supabase/client';

export interface ValidationResult {
  found: boolean;
  verified: boolean;
  confidence: number;
  source: APISource;
  product?: ExternalProduct;
  alternatives: ExternalProduct[];
  sources?: string[];
  metadata?: {
    searchQuery: string;
    timestamp: string;
    region?: string;
  };
}

export interface ExternalProduct {
  id: string;
  name: string;
  barcode?: string;
  category?: string;
  brand?: string;
  manufacturer?: string;
  description?: string;
  ingredients?: string[];
  nutritionalInfo?: {
    energy?: string;
    fat?: string;
    carbohydrates?: string;
    protein?: string;
    salt?: string;
  };
  images?: string[];
  verified: boolean;
  confidence: number;
  source: APISource;
  country?: string;
  registrationNumber?: string;
  expiryDate?: string;
  batchNumber?: string;
  nafdacNumber?: string;
}

export type APISource = 'openfoodfacts' | 'fdc' | 'edamam' | 'nafdac' | 'internal';

// Cache management
const resultCache = new Map<string, { result: ValidationResult; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCachedResult = (key: string): ValidationResult | null => {
  const cached = resultCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.result;
  }
  resultCache.delete(key);
  return null;
};

export const cacheResult = (key: string, result: ValidationResult): void => {
  resultCache.set(key, { result, timestamp: Date.now() });
};

const searchOpenFoodFacts = async (productName: string, barcode?: string): Promise<ValidationResult> => {
  const baseUrl = 'https://world.openfoodfacts.org/api/v0/product';
  const searchTerm = barcode ? `/${barcode}.json` : `?search_terms=${encodeURIComponent(productName)}&json=true`;
  const url = `${baseUrl}${searchTerm}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 1 && data.product) {
      const product = data.product;
      return {
        found: true,
        verified: true,
        confidence: 80,
        source: 'openfoodfacts',
        product: {
          id: product._id,
          name: product.product_name,
          barcode: product.code,
          category: product.categories,
          brand: product.brands,
          manufacturer: product.manufacturers,
          description: product.generic_name,
          ingredients: product.ingredients?.map((i: any) => i.text),
          nutritionalInfo: {
            energy: product.nutriments?.energy_value,
            fat: product.nutriments?.fat,
            carbohydrates: product.nutriments?.carbohydrates,
            protein: product.nutriments?.protein,
            salt: product.nutriments?.salt,
          },
          images: product.image_url ? [product.image_url] : [],
          verified: true,
          confidence: 80,
          source: 'openfoodfacts'
        },
        alternatives: [],
        sources: ['Open Food Facts']
      };
    } else if (data.products && data.products.length > 0) {
      return {
        found: true,
        verified: false,
        confidence: 60,
        source: 'openfoodfacts',
        product: {
          id: data.products[0]._id,
          name: data.products[0].product_name,
          barcode: data.products[0].code,
          category: data.products[0].categories,
          brand: data.products[0].brands,
          manufacturer: data.products[0].manufacturers,
          description: data.products[0].generic_name,
          ingredients: data.products[0].ingredients?.map((i: any) => i.text),
          nutritionalInfo: {
            energy: data.products[0].nutriments?.energy_value,
            fat: data.products[0].nutriments?.fat,
            carbohydrates: data.products[0].nutriments?.carbohydrates,
            protein: data.products[0].nutriments?.protein,
            salt: data.products[0].nutriments?.salt,
          },
          images: data.products[0].image_url ? [data.products[0].image_url] : [],
          verified: false,
          confidence: 60,
          source: 'openfoodfacts'
        },
        alternatives: [],
        sources: ['Open Food Facts']
      };
    } else {
      return {
        found: false,
        verified: false,
        confidence: 0,
        source: 'openfoodfacts',
        alternatives: [],
        sources: ['Open Food Facts']
      };
    }
  } catch (error) {
    console.error('Open Food Facts API error:', error);
    return {
      found: false,
      verified: false,
      confidence: 0,
      source: 'openfoodfacts',
      alternatives: [],
      sources: ['Open Food Facts']
    };
  }
};

const searchFDC = async (productName: string, category?: string): Promise<ValidationResult> => {
  const apiKey = process.env.NEXT_PUBLIC_FDC_API_KEY;
  if (!apiKey) {
    console.warn('FDC API key is missing.');
    return {
      found: false,
      verified: false,
      confidence: 0,
      source: 'fdc',
      alternatives: [],
      sources: ['Food Data Central']
    };
  }

  let url = `https://api.nal.usda.gov/fdc/v1/food/search?api_key=${apiKey}&dataType=Foundation,Survey,SR Legacy&pageSize=2`;
  if (productName) {
    url += `&query=${encodeURIComponent(productName)}`;
  }
  if (category) {
    url += `&brandOwner=${encodeURIComponent(category)}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.foods && data.foods.length > 0) {
      const food = data.foods[0];
      return {
        found: true,
        verified: true,
        confidence: 75,
        source: 'fdc',
        product: {
          id: String(food.fdcId),
          name: food.description,
          brand: food.brandOwner,
          category: food.foodCategory,
          description: food.ingredients,
          nutritionalInfo: {
            energy: food.foodNutrients?.find((n: any) => n.nutrientName === 'Energy')?.value,
            fat: food.foodNutrients?.find((n: any) => n.nutrientName === 'Total lipid (fat)')?.value,
            carbohydrates: food.foodNutrients?.find((n: any) => n.nutrientName === 'Carbohydrate, by difference')?.value,
            protein: food.foodNutrients?.find((n: any) => n.nutrientName === 'Protein')?.value,
            salt: food.foodNutrients?.find((n: any) => n.nutrientName === 'Sodium')?.value,
          },
          verified: true,
          confidence: 75,
          source: 'fdc'
        },
        alternatives: data.foods.slice(1).map((f: any) => ({
          id: String(f.fdcId),
          name: f.description,
          brand: f.brandOwner,
          category: food.foodCategory,
          verified: false,
          confidence: 50,
          source: 'fdc' as APISource
        })),
        sources: ['Food Data Central']
      };
    } else {
      return {
        found: false,
        verified: false,
        confidence: 0,
        source: 'fdc',
        alternatives: [],
        sources: ['Food Data Central']
      };
    }
  } catch (error) {
    console.error('FDC API error:', error);
    return {
      found: false,
      verified: false,
      confidence: 0,
      source: 'fdc',
      alternatives: [],
      sources: ['Food Data Central']
    };
  }
};

// NAFDAC integration function
export const searchNAFDAC = async (productName: string): Promise<ValidationResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('nafdac-scraper', {
      body: { productName }
    });

    if (error) {
      console.error('NAFDAC search error:', error);
      return {
        found: false,
        verified: false,
        confidence: 0,
        source: 'nafdac',
        alternatives: []
      };
    }

    if (data?.success && data?.products?.length > 0) {
      const product = data.products[0];
      return {
        found: true,
        verified: true,
        confidence: product.confidence || 85,
        source: 'nafdac',
        product: {
          id: product.id || `nafdac-${Date.now()}`,
          name: product.name,
          brand: product.brand,
          manufacturer: product.manufacturer,
          category: product.category,
          verified: true,
          confidence: product.confidence || 85,
          source: 'nafdac',
          country: 'Nigeria',
          registrationNumber: product.registrationNumber,
          nafdacNumber: product.nafdacNumber
        },
        alternatives: data.products.slice(1).map((p: any) => ({
          id: p.id || `nafdac-alt-${Date.now()}`,
          name: p.name,
          brand: p.brand,
          manufacturer: p.manufacturer,
          verified: true,
          confidence: p.confidence || 70,
          source: 'nafdac' as APISource,
          country: 'Nigeria',
          registrationNumber: p.registrationNumber,
          nafdacNumber: p.nafdacNumber
        }))
      };
    }

    return {
      found: false,
      verified: false,
      confidence: 0,
      source: 'nafdac',
      alternatives: []
    };
  } catch (error) {
    console.error('NAFDAC integration error:', error);
    return {
      found: false,
      verified: false,
      confidence: 0,
      source: 'nafdac',
      alternatives: []
    };
  }
};

export const validateProductExternal = async (
  productName: string,
  barcode?: string,
  category?: string
): Promise<ValidationResult> => {
  const cacheKey = `${productName}-${barcode || ''}-${category || ''}`;
  
  // Check cache first
  const cached = getCachedResult(cacheKey);
  if (cached) {
    return cached;
  }

  // Try multiple sources in parallel
  const promises = [
    searchOpenFoodFacts(productName, barcode),
    searchFDC(productName, category),
    searchNAFDAC(productName)
  ];

  try {
    const results = await Promise.allSettled(promises);
    
    // Find the best result
    let bestResult: ValidationResult = {
      found: false,
      verified: false,
      confidence: 0,
      source: 'openfoodfacts',
      alternatives: []
    };

    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.found) {
        if (result.value.confidence > bestResult.confidence) {
          bestResult = result.value;
        }
      }
    });

    // Combine alternatives from all sources
    const allAlternatives: ExternalProduct[] = [];
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allAlternatives.push(...result.value.alternatives);
      }
    });

    bestResult.alternatives = allAlternatives
      .filter(alt => alt.name !== bestResult.product?.name)
      .slice(0, 5);

    // Cache the result
    cacheResult(cacheKey, bestResult);
    
    return bestResult;
  } catch (error) {
    console.error('External validation error:', error);
    return {
      found: false,
      verified: false,
      confidence: 0,
      source: 'openfoodfacts',
      alternatives: []
    };
  }
};
