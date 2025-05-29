import { z } from 'zod';

const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  brands: z.string().optional(),
  categories: z.string().optional(),
  image_front_url: z.string().optional(),
  nutriscore_grade: z.string().optional(),
});

const openFoodFactsResponseSchema = z.object({
  product: productSchema.optional(),
  code: z.string().optional(),
  status: z.number(),
  status_verbose: z.string(),
});

export type APISource = 'openfoodfacts' | 'fda' | 'cosing' | 'gs1' | 'internal' | 'nafdac';

export interface ValidationResult {
  found: boolean;
  verified: boolean;
  confidence: number;
  source: APISource;
  product?: ExternalProduct;
  alternatives: ExternalProduct[];
}

export interface ExternalProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  verified: boolean;
  source: APISource;
  data: any;
  imageUrl?: string;
  nutriScore?: string;
}

// Quick search function for Open Food Facts API
export const searchProductsQuick = async (
  query: string,
  limit: number = 5
): Promise<ExternalProduct[]> => {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1&page_size=${limit}`
    );
    const data = await response.json();

    if (data && data.products) {
      return data.products.map((product: any) => ({
        id: product.id,
        name: product.product_name || 'Unknown Product',
        brand: product.brands || 'Unknown Brand',
        category: product.categories || 'Unknown Category',
        verified: false,
        source: 'openfoodfacts',
        data: product,
        imageUrl: product.image_front_url || '/placeholder.svg',
        nutriScore: product.nutriscore_grade || 'unknown'
      }));
    }

    return [];
  } catch (error) {
    console.error('Error during quick product search:', error);
    return [];
  }
};

// Validation function for Open Food Facts API
export const validateProductOpenFoodFacts = async (
  productName: string,
  barcode?: string
): Promise<ValidationResult> => {
  try {
    let apiUrl = `https://world.openfoodfacts.org/api/v0/product?json=1`;
    if (barcode) {
      apiUrl = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json?fields=code,product_name,brands,categories,image_front_url,nutriscore_grade`;
    } else {
      apiUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${productName}&search_simple=1&action=process&json=1&page_size=1`;
    }

    const response = await fetch(apiUrl);
    const data = await response.json();

    const parsedResponse = openFoodFactsResponseSchema.safeParse(data);

    if (!parsedResponse.success) {
      console.error("Validation error:", parsedResponse.error);
      return {
        found: false,
        verified: false,
        confidence: 0,
        source: 'openfoodfacts',
        alternatives: []
      };
    }

    const validatedData = parsedResponse.data;

    if (validatedData.status === 1 && validatedData.product) {
      return {
        found: true,
        verified: true,
        confidence: 0.7,
        source: 'openfoodfacts',
        product: {
          id: validatedData.product.id || validatedData.code || 'unknown',
          name: validatedData.product.name || validatedData.product.brands || 'Unknown Product',
          brand: validatedData.product.brands || 'Unknown Brand',
          category: validatedData.product.categories || 'Unknown Category',
          verified: true,
          source: 'openfoodfacts',
          data: validatedData.product,
          imageUrl: validatedData.product.image_front_url || '/placeholder.svg',
          nutriScore: validatedData.product.nutriscore_grade || 'unknown'
        },
        alternatives: []
      };
    } else {
      return {
        found: false,
        verified: false,
        confidence: 0,
        source: 'openfoodfacts',
        alternatives: []
      };
    }
  } catch (error) {
    console.error('Open Food Facts validation error:', error);
    return {
      found: false,
      verified: false,
      confidence: 0,
      source: 'openfoodfacts',
      alternatives: []
    };
  }
};

// Validation function for FDA API (Drugs@FDA)
export const validateProductFDA = async (
  productName: string,
  barcode?: string
): Promise<ValidationResult> => {
  try {
    // Simulate FDA validation (replace with actual API call if available)
    console.log('Simulating FDA validation for:', productName);

    // Simulate a positive match with some confidence
    if (productName.toLowerCase().includes('aspirin') || productName.toLowerCase().includes('ibuprofen')) {
      return {
        found: true,
        verified: true,
        confidence: 0.6,
        source: 'fda',
        product: {
          id: `fda-${Date.now()}`,
          name: `Simulated ${productName}`,
          brand: 'Simulated FDA Brand',
          category: 'medication',
          verified: true,
          source: 'fda',
          data: {
            active_ingredients: ['Simulated Active Ingredient'],
            application_number: 'Simulated Application Number'
          },
          imageUrl: '/placeholder.svg'
        },
        alternatives: []
      };
    }

    // If no match, return not found
    return {
      found: false,
      verified: false,
      confidence: 0,
      source: 'fda',
      alternatives: []
    };

  } catch (error) {
    console.error('FDA validation error:', error);
    return {
      found: false,
      verified: false,
      confidence: 0,
      source: 'fda',
      alternatives: []
    };
  }
};

// Validation function for CosIng API (EU Cosmetics)
export const validateProductCosing = async (
  productName: string,
  barcode?: string
): Promise<ValidationResult> => {
  try {
    // Simulate CosIng validation (replace with actual API call if available)
    console.log('Simulating CosIng validation for:', productName);

    // Simulate a positive match with some confidence
    if (productName.toLowerCase().includes('shampoo') || productName.toLowerCase().includes('cream')) {
      return {
        found: true,
        verified: true,
        confidence: 0.5,
        source: 'cosing',
        product: {
          id: `cosing-${Date.now()}`,
          name: `Simulated ${productName}`,
          brand: 'Simulated CosIng Brand',
          category: 'cosmetics',
          verified: true,
          source: 'cosing',
          data: {
            inci_name: 'Simulated INCI Name',
            function: 'Simulated Function'
          },
          imageUrl: '/placeholder.svg'
        },
        alternatives: []
      };
    }

    // If no match, return not found
    return {
      found: false,
      verified: false,
      confidence: 0,
      source: 'cosing',
      alternatives: []
    };

  } catch (error) {
    console.error('CosIng validation error:', error);
    return {
      found: false,
      verified: false,
      confidence: 0,
      source: 'cosing',
      alternatives: []
    };
  }
};

// Validation function for GS1 Global Registry
export const validateProductGS1 = async (
  productName: string,
  barcode?: string
): Promise<ValidationResult> => {
  try {
    // Simulate GS1 validation (replace with actual API call if available)
    console.log('Simulating GS1 validation for:', productName);

    // Simulate a positive match with some confidence
    if (productName.toLowerCase().includes('electronics') || productName.toLowerCase().includes('clothing')) {
      return {
        found: true,
        verified: true,
        confidence: 0.4,
        source: 'gs1',
        product: {
          id: `gs1-${Date.now()}`,
          name: `Simulated ${productName}`,
          brand: 'Simulated GS1 Brand',
          category: 'general',
          verified: true,
          source: 'gs1',
          data: {
            gtin: 'Simulated GTIN',
            company_name: 'Simulated Company Name'
          },
          imageUrl: '/placeholder.svg'
        },
        alternatives: []
      };
    }

    // If no match, return not found
    return {
      found: false,
      verified: false,
      confidence: 0,
      source: 'gs1',
      alternatives: []
    };

  } catch (error) {
    console.error('GS1 validation error:', error);
    return {
      found: false,
      verified: false,
      confidence: 0,
      source: 'gs1',
      alternatives: []
    };
  }
};

// Add NAFDAC validation function
export const validateProductNAFDAC = async (
  productName: string,
  barcode?: string
): Promise<ValidationResult> => {
  try {
    console.log('Validating product with NAFDAC:', productName);

    const response = await fetch('https://flyvlvtvgvfybtnuntsd.supabase.co/functions/v1/nafdac-scraper', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseXZsdnR2Z3ZmeWJ0bnVudHNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NDQ5MTgsImV4cCI6MjA2NDEyMDkxOH0.iGlfXJUM6EZUwE_s0ipn6LR4ZkgK3d2hojRs5m_xo-g`,
      },
      body: JSON.stringify({
        searchQuery: productName,
        limit: 5
      })
    });

    const result = await response.json();

    if (result.found && result.products && result.products.length > 0) {
      const product = result.products[0];
      return {
        found: true,
        verified: true,
        confidence: result.confidence || 0.8,
        source: 'nafdac' as APISource,
        product: {
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
        },
        alternatives: result.products.slice(1).map((p: any) => ({
          id: p.id,
          name: p.name,
          brand: p.manufacturer,
          category: p.category,
          verified: p.verified,
          source: 'nafdac' as APISource,
          data: {
            ...p,
            certifyingOrganization: 'NAFDAC (Nigeria)',
            country: 'Nigeria'
          },
          imageUrl: '/placeholder.svg'
        }))
      };
    }

    return {
      found: false,
      verified: false,
      confidence: 0,
      source: 'nafdac' as APISource,
      alternatives: []
    };

  } catch (error) {
    console.error('NAFDAC validation error:', error);
    return {
      found: false,
      verified: false,
      confidence: 0,
      source: 'nafdac' as APISource,
      alternatives: []
    };
  }
};

export const validateProductExternal = async (
  productName: string,
  barcode?: string,
  category?: string
): Promise<ValidationResult> => {
  const results: ValidationResult[] = [];

  try {
    // Check Open Food Facts for food products
    if (!category || category === 'food') {
      const foodResult = await validateProductOpenFoodFacts(productName, barcode);
      if (foodResult.found) results.push(foodResult);
    }

    // Check FDA for drugs and medical products
    if (!category || category === 'medication') {
      const fdaResult = await validateProductFDA(productName, barcode);
      if (fdaResult.found) results.push(fdaResult);
    }

    // Check CosIng for cosmetics
    if (!category || category === 'cosmetics') {
      const cosResult = await validateProductCosing(productName, barcode);
      if (cosResult.found) results.push(cosResult);
    }

    // Check GS1 for general products
    if (!category || category === 'general') {
      const gs1Result = await validateProductGS1(productName, barcode);
      if (gs1Result.found) results.push(gs1Result);
    }

    // Always check NAFDAC for Nigerian products (all categories)
    const nafdacResult = await validateProductNAFDAC(productName, barcode);
    if (nafdacResult.found) results.push(nafdacResult);

    // Return the result with highest confidence
    if (results.length > 0) {
      const bestResult = results.reduce((best, current) => 
        current.confidence > best.confidence ? current : best
      );
      
      // Combine alternatives from all sources
      const allAlternatives = results.flatMap(r => r.alternatives || []);
      
      return {
        ...bestResult,
        alternatives: allAlternatives
      };
    }

    return {
      found: false,
      verified: false,
      confidence: 0,
      source: 'external' as APISource,
      alternatives: []
    };

  } catch (error) {
    console.error('External validation error:', error);
    return {
      found: false,
      verified: false,
      confidence: 0,
      source: 'external' as APISource,
      alternatives: []
    };
  }
};
