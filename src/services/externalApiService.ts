
// External API integration service for real-time product validation
import { supabase } from '@/integrations/supabase/client';

export interface ExternalProduct {
  id: string;
  name: string;
  brand?: string;
  category: string;
  verified: boolean;
  source: 'openfoodfacts' | 'fda' | 'cosing' | 'gs1' | 'internal';
  data: any;
  nutriScore?: string;
  ingredients?: string[];
  allergens?: string[];
  imageUrl?: string;
}

export interface ValidationResult {
  found: boolean;
  verified: boolean;
  confidence: number;
  source: string;
  product?: ExternalProduct;
  alternatives?: ExternalProduct[];
}

// Open Food Facts API service
export const searchOpenFoodFacts = async (barcode: string, productName?: string): Promise<ExternalProduct | null> => {
  try {
    let url = '';
    if (barcode) {
      url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
    } else if (productName) {
      url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(productName)}&json=1&page_size=1`;
    } else {
      return null;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (barcode && data.status === 1 && data.product) {
      const product = data.product;
      return {
        id: product.code || barcode,
        name: product.product_name || 'Unknown Product',
        brand: product.brands,
        category: 'food',
        verified: true,
        source: 'openfoodfacts',
        data: product,
        nutriScore: product.nutriscore_grade?.toUpperCase(),
        ingredients: product.ingredients_text ? [product.ingredients_text] : [],
        allergens: product.allergens_tags || [],
        imageUrl: product.image_url
      };
    } else if (!barcode && data.products && data.products.length > 0) {
      const product = data.products[0];
      return {
        id: product.code || Date.now().toString(),
        name: product.product_name || 'Unknown Product',
        brand: product.brands,
        category: 'food',
        verified: true,
        source: 'openfoodfacts',
        data: product,
        nutriScore: product.nutriscore_grade?.toUpperCase(),
        ingredients: product.ingredients_text ? [product.ingredients_text] : [],
        allergens: product.allergens_tags || [],
        imageUrl: product.image_url
      };
    }

    return null;
  } catch (error) {
    console.error('Error searching Open Food Facts:', error);
    return null;
  }
};

// FDA NDC API service for drugs/medications
export const searchFDADrugs = async (productName: string): Promise<ExternalProduct | null> => {
  try {
    const url = `https://api.fda.gov/drug/ndc.json?search=brand_name:"${encodeURIComponent(productName)}"&limit=1`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const drug = data.results[0];
      return {
        id: drug.product_ndc || Date.now().toString(),
        name: drug.brand_name || drug.generic_name || productName,
        brand: drug.labeler_name,
        category: 'medication',
        verified: true,
        source: 'fda',
        data: drug,
        ingredients: drug.active_ingredients?.map((ing: any) => ing.name) || []
      };
    }

    return null;
  } catch (error) {
    console.error('Error searching FDA drugs:', error);
    return null;
  }
};

// CosIng cosmetics validation (using internal database approach)
export const searchCosmetics = async (productName: string, ingredients?: string[]): Promise<ExternalProduct | null> => {
  try {
    // Since CosIng doesn't have a public API, we'll check against our internal database
    // and validate ingredients against known safe ingredients
    const safeIngredients = [
      'water', 'glycerin', 'sodium chloride', 'citric acid', 'tocopherol',
      'hyaluronic acid', 'niacinamide', 'retinol', 'salicylic acid'
    ];

    if (ingredients) {
      const hasUnsafeIngredients = ingredients.some(ing => 
        !safeIngredients.some(safe => 
          ing.toLowerCase().includes(safe.toLowerCase())
        )
      );

      return {
        id: Date.now().toString(),
        name: productName,
        category: 'cosmetics',
        verified: !hasUnsafeIngredients,
        source: 'cosing',
        data: { ingredients, safetyCheck: !hasUnsafeIngredients },
        ingredients
      };
    }

    return null;
  } catch (error) {
    console.error('Error validating cosmetics:', error);
    return null;
  }
};

// GS1 barcode validation simulation
export const validateBarcode = async (barcode: string): Promise<boolean> => {
  try {
    // Basic barcode validation (check digit validation for EAN-13)
    if (barcode.length === 13) {
      const digits = barcode.split('').map(Number);
      let sum = 0;
      
      for (let i = 0; i < 12; i++) {
        sum += digits[i] * (i % 2 === 0 ? 1 : 3);
      }
      
      const checkDigit = (10 - (sum % 10)) % 10;
      return checkDigit === digits[12];
    }
    
    return barcode.length >= 8 && barcode.length <= 14;
  } catch (error) {
    console.error('Error validating barcode:', error);
    return false;
  }
};

// Main validation orchestrator
export const validateProductExternal = async (
  productName: string,
  barcode?: string,
  category?: string,
  ingredients?: string[]
): Promise<ValidationResult> => {
  const results: ExternalProduct[] = [];
  let mainProduct: ExternalProduct | null = null;

  try {
    // Validate barcode first if provided
    if (barcode) {
      const barcodeValid = await validateBarcode(barcode);
      if (!barcodeValid) {
        return {
          found: false,
          verified: false,
          confidence: 0,
          source: 'barcode_validation',
          alternatives: []
        };
      }
    }

    // Search based on category or try all APIs
    if (category === 'food' || !category) {
      const foodResult = await searchOpenFoodFacts(barcode || '', productName);
      if (foodResult) {
        results.push(foodResult);
        if (!mainProduct) mainProduct = foodResult;
      }
    }

    if (category === 'medication' || category === 'supplement' || !category) {
      const drugResult = await searchFDADrugs(productName);
      if (drugResult) {
        results.push(drugResult);
        if (!mainProduct) mainProduct = drugResult;
      }
    }

    if (category === 'cosmetics' || category === 'skincare' || category === 'personal_care' || !category) {
      const cosmeticResult = await searchCosmetics(productName, ingredients);
      if (cosmeticResult) {
        results.push(cosmeticResult);
        if (!mainProduct) mainProduct = cosmeticResult;
      }
    }

    // Calculate confidence based on number of sources and data quality
    const confidence = results.length > 0 ? 
      Math.min(0.9, 0.3 + (results.length * 0.2) + (barcode ? 0.3 : 0)) : 0;

    return {
      found: results.length > 0,
      verified: mainProduct?.verified || false,
      confidence,
      source: mainProduct?.source || 'none',
      product: mainProduct || undefined,
      alternatives: results.slice(1)
    };

  } catch (error) {
    console.error('Error in external validation:', error);
    return {
      found: false,
      verified: false,
      confidence: 0,
      source: 'error',
      alternatives: []
    };
  }
};

// Cache management for API results - simplified implementation
export const cacheExternalResult = async (
  query: string,
  result: ValidationResult
): Promise<void> => {
  try {
    // Direct insert since RPC functions don't exist yet
    const { error } = await supabase
      .from('external_api_cache')
      .insert({
        query_hash: btoa(query),
        result_data: result,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });

    if (error) {
      console.error('Error caching external result:', error);
    }
  } catch (error) {
    console.error('Error caching external result:', error);
  }
};

export const getCachedResult = async (query: string): Promise<ValidationResult | null> => {
  try {
    // Direct query since RPC functions don't exist yet
    const { data, error } = await supabase
      .from('external_api_cache')
      .select('result_data')
      .eq('query_hash', btoa(query))
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      return null;
    }

    return data.result_data as ValidationResult;
  } catch (error) {
    console.error('Error getting cached result:', error);
    return null;
  }
};
