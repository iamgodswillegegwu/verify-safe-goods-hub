
import { supabase, Product, Verification } from '@/lib/supabase';
import { SearchFilters } from './productService';

export interface RecommendationScore {
  product: Product;
  score: number;
  reasons: string[];
}

export const getPersonalizedRecommendations = async (
  userId: string, 
  limit: number = 5
): Promise<RecommendationScore[]> => {
  try {
    // Get user's verification history
    const { data: verifications } = await supabase
      .from('verifications')
      .select(`
        *,
        product:products(
          *,
          manufacturer:manufacturers(*),
          category:categories(*)
        )
      `)
      .eq('user_id', userId)
      .eq('result', 'verified')
      .limit(50);

    // Get user's favorites
    const { data: favorites } = await supabase
      .from('user_favorites')
      .select(`
        product:products(
          *,
          manufacturer:manufacturers(*),
          category:categories(*)
        )
      `)
      .eq('user_id', userId);

    if (!verifications?.length && !favorites?.length) {
      // Return trending products for new users
      return getTrendingRecommendations(limit);
    }

    // Analyze user preferences
    const allUserProducts = [
      ...(verifications?.map(v => v.product).filter(Boolean) || []),
      ...(favorites?.map(f => f.product).filter(Boolean) || [])
    ];

    // Extract preferences
    const categoryPrefs = new Map<string, number>();
    const locationPrefs = new Map<string, number>();
    const nutriScorePrefs = new Map<string, number>();

    allUserProducts.forEach((product: any) => {
      if (product?.category?.name) {
        categoryPrefs.set(product.category.name, (categoryPrefs.get(product.category.name) || 0) + 1);
      }
      if (product?.nutri_score) {
        nutriScorePrefs.set(product.nutri_score, (nutriScorePrefs.get(product.nutri_score) || 0) + 1);
      }
      if (product?.country && product?.state) {
        const location = `${product.country}, ${product.state}`;
        locationPrefs.set(location, (locationPrefs.get(location) || 0) + 1);
      }
    });

    // Get recommendations based on preferences
    const recommendations = await getRecommendationsBasedOnPreferences(
      categoryPrefs,
      locationPrefs,
      nutriScorePrefs,
      allUserProducts.map(p => p.id),
      limit * 2
    );

    return recommendations.slice(0, limit);
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    return getTrendingRecommendations(limit);
  }
};

const getTrendingRecommendations = async (limit: number): Promise<RecommendationScore[]> => {
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      manufacturer:manufacturers(*),
      category:categories(*)
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(limit);

  return (products || []).map(product => ({
    product,
    score: 50,
    reasons: ['Recently Added', 'Popular']
  }));
};

const getRecommendationsBasedOnPreferences = async (
  categoryPrefs: Map<string, number>,
  locationPrefs: Map<string, number>,
  nutriScorePrefs: Map<string, number>,
  excludeIds: string[],
  limit: number
): Promise<RecommendationScore[]> => {
  let queryBuilder = supabase
    .from('products')
    .select(`
      *,
      manufacturer:manufacturers(*),
      category:categories(*)
    `)
    .eq('status', 'approved')
    .not('id', 'in', `(${excludeIds.join(',')})`)
    .limit(limit);

  const { data: products } = await queryBuilder;

  if (!products) return [];

  // Score products based on preferences
  const scoredProducts = products.map(product => {
    let score = 0;
    const reasons: string[] = [];

    // Category preference
    if (product.category?.name && categoryPrefs.has(product.category.name)) {
      score += categoryPrefs.get(product.category.name)! * 10;
      reasons.push(`Similar to ${product.category.name} products you like`);
    }

    // Nutri-score preference
    if (product.nutri_score && nutriScorePrefs.has(product.nutri_score)) {
      score += nutriScorePrefs.get(product.nutri_score)! * 5;
      reasons.push(`Good Nutri-Score (${product.nutri_score})`);
    }

    // Location preference
    if (product.country && product.state) {
      const location = `${product.country}, ${product.state}`;
      if (locationPrefs.has(location)) {
        score += locationPrefs.get(location)! * 3;
        reasons.push(`From preferred location`);
      }
    }

    // Boost for good nutri-scores
    if (['A', 'B'].includes(product.nutri_score || '')) {
      score += 5;
      reasons.push('Excellent nutrition rating');
    }

    return {
      product,
      score: score || 10, // Default score for products without specific matches
      reasons: reasons.length > 0 ? reasons : ['Recommended for you']
    };
  });

  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

export const getRecommendationsByCategory = async (
  categoryName: string,
  excludeIds: string[] = [],
  limit: number = 5
): Promise<Product[]> => {
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      manufacturer:manufacturers(*),
      category:categories(*)
    `)
    .eq('status', 'approved')
    .eq('category.name', categoryName)
    .not('id', 'in', `(${excludeIds.join(',')})`)
    .limit(limit);

  return products || [];
};
