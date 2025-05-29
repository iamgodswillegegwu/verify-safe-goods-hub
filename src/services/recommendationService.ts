
import { supabase, Product } from '@/lib/supabase';

export interface UserPreferences {
  favoriteCategories: string[];
  preferredNutriScores: string[];
  frequentSearches: string[];
  location?: {
    country?: string;
    state?: string;
    city?: string;
  };
}

export interface RecommendationScore {
  product: Product;
  score: number;
  reasons: string[];
}

export const getUserPreferences = async (userId: string): Promise<UserPreferences> => {
  // Get user's favorite categories from their favorited products
  const { data: favorites } = await supabase
    .from('user_favorites')
    .select(`
      product:products(
        category:categories(name),
        nutri_score,
        country,
        state,
        city
      )
    `)
    .eq('user_id', userId);

  // Get user's search history
  const { data: searches } = await supabase
    .from('verifications')
    .select('search_query')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  const favoriteCategories = Array.from(new Set(
    favorites?.map(f => f.product?.category?.name).filter(Boolean) || []
  ));

  const preferredNutriScores = Array.from(new Set(
    favorites?.map(f => f.product?.nutri_score).filter(Boolean) || []
  ));

  const frequentSearches = Array.from(new Set(
    searches?.map(s => s.search_query).filter(Boolean) || []
  )).slice(0, 10);

  // Get most common location from favorites
  const locations = favorites?.map(f => ({
    country: f.product?.country,
    state: f.product?.state,
    city: f.product?.city
  })).filter(l => l.country) || [];

  const mostCommonLocation = locations.length > 0 ? locations[0] : undefined;

  return {
    favoriteCategories,
    preferredNutriScores,
    frequentSearches,
    location: mostCommonLocation
  };
};

export const getPersonalizedRecommendations = async (
  userId: string,
  limit: number = 5
): Promise<RecommendationScore[]> => {
  const preferences = await getUserPreferences(userId);
  
  // Build query for recommendations
  let query = supabase
    .from('products')
    .select(`
      *,
      manufacturer:manufacturers(*),
      category:categories(*)
    `)
    .eq('status', 'approved')
    .limit(20); // Get more to score and filter

  // Apply location preference if available
  if (preferences.location?.country) {
    query = query.eq('country', preferences.location.country);
  }

  const { data: products, error } = await query;

  if (error || !products) {
    console.error('Error fetching products for recommendations:', error);
    return [];
  }

  // Score products based on user preferences
  const scoredProducts: RecommendationScore[] = products.map(product => {
    let score = 0;
    const reasons: string[] = [];

    // Category preference scoring
    if (preferences.favoriteCategories.includes(product.category?.name || '')) {
      score += 3;
      reasons.push('Matches your favorite category');
    }

    // Nutri-Score preference scoring
    if (preferences.preferredNutriScores.includes(product.nutri_score || '')) {
      score += 2;
      reasons.push('Matches your preferred Nutri-Score');
    }

    // Location preference scoring
    if (product.country === preferences.location?.country) {
      score += 1;
      reasons.push('Local product');
    }

    // Search history relevance
    const productNameLower = product.name.toLowerCase();
    const hasRelevantSearch = preferences.frequentSearches.some(search =>
      productNameLower.includes(search.toLowerCase()) || 
      search.toLowerCase().includes(productNameLower)
    );
    
    if (hasRelevantSearch) {
      score += 2;
      reasons.push('Related to your searches');
    }

    // Boost high-quality products
    if (product.nutri_score === 'A') {
      score += 1;
      reasons.push('High quality (Nutri-Score A)');
    }

    return {
      product,
      score,
      reasons
    };
  })
  .filter(item => item.score > 0) // Only include products with some relevance
  .sort((a, b) => b.score - a.score) // Sort by highest score first
  .slice(0, limit);

  return scoredProducts;
};

export const getSimilarProductsEnhanced = async (
  productId: string,
  userId?: string,
  limit: number = 5
): Promise<Product[]> => {
  // Get the base product
  const { data: baseProduct } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      manufacturer:manufacturers(*)
    `)
    .eq('id', productId)
    .single();

  if (!baseProduct) return [];

  // Find similar products
  let query = supabase
    .from('products')
    .select(`
      *,
      manufacturer:manufacturers(*),
      category:categories(*)
    `)
    .eq('status', 'approved')
    .neq('id', productId); // Exclude the base product

  // Prioritize same category
  if (baseProduct.category_id) {
    query = query.eq('category_id', baseProduct.category_id);
  }

  const { data: products } = await query.limit(limit * 2); // Get more to filter

  if (!products) return [];

  // Score similarity
  const scoredProducts = products.map(product => {
    let score = 0;

    // Same category
    if (product.category_id === baseProduct.category_id) score += 3;
    
    // Same manufacturer
    if (product.manufacturer_id === baseProduct.manufacturer_id) score += 2;
    
    // Similar Nutri-Score
    if (product.nutri_score === baseProduct.nutri_score) score += 2;
    
    // Same location
    if (product.country === baseProduct.country) score += 1;

    return { product, score };
  })
  .sort((a, b) => b.score - a.score)
  .slice(0, limit)
  .map(item => item.product);

  return scoredProducts;
};
