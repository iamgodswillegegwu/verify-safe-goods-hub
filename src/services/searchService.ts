
import { supabase, Product } from '@/lib/supabase';
import { SearchFilters } from './productService';

export type SortOption = 
  | 'relevance' 
  | 'name_asc' 
  | 'name_desc' 
  | 'date_newest' 
  | 'date_oldest' 
  | 'nutri_score_best' 
  | 'location';

export interface SearchOptions {
  filters?: SearchFilters;
  sortBy?: SortOption;
  limit?: number;
  offset?: number;
}

export const performAdvancedSearch = async (
  query: string, 
  options: SearchOptions = {}
): Promise<{ products: Product[], totalCount: number }> => {
  const { filters, sortBy = 'relevance', limit = 20, offset = 0 } = options;

  let queryBuilder = supabase
    .from('products')
    .select(`
      *,
      manufacturer:manufacturers(*),
      category:categories(*)
    `, { count: 'exact' })
    .eq('status', 'approved');

  // Apply search query
  if (query.trim()) {
    queryBuilder = queryBuilder.or(`
      name.ilike.%${query}%,
      description.ilike.%${query}%,
      ingredients.ilike.%${query}%
    `);
  }

  // Apply filters
  if (filters?.category) {
    // Join with categories table for name-based filtering
    queryBuilder = queryBuilder.eq('category.name', filters.category);
  }
  if (filters?.country) {
    queryBuilder = queryBuilder.eq('country', filters.country);
  }
  if (filters?.state) {
    queryBuilder = queryBuilder.eq('state', filters.state);
  }
  if (filters?.city) {
    queryBuilder = queryBuilder.eq('city', filters.city);
  }
  if (filters?.nutriScore && filters.nutriScore.length > 0) {
    queryBuilder = queryBuilder.in('nutri_score', filters.nutriScore);
  }

  // Apply sorting
  switch (sortBy) {
    case 'name_asc':
      queryBuilder = queryBuilder.order('name', { ascending: true });
      break;
    case 'name_desc':
      queryBuilder = queryBuilder.order('name', { ascending: false });
      break;
    case 'date_newest':
      queryBuilder = queryBuilder.order('created_at', { ascending: false });
      break;
    case 'date_oldest':
      queryBuilder = queryBuilder.order('created_at', { ascending: true });
      break;
    case 'nutri_score_best':
      // Order by nutri_score (A is best, E is worst) - use nullsFirst instead of nullsLast
      queryBuilder = queryBuilder.order('nutri_score', { ascending: true, nullsFirst: true });
      break;
    case 'location':
      queryBuilder = queryBuilder.order('country', { ascending: true })
                                 .order('state', { ascending: true });
      break;
    case 'relevance':
    default:
      // For relevance, we'll order by created_at for now
      // In a real app, this would use full-text search ranking
      queryBuilder = queryBuilder.order('created_at', { ascending: false });
      break;
  }

  // Apply pagination
  queryBuilder = queryBuilder.range(offset, offset + limit - 1);

  const { data, error, count } = await queryBuilder;

  if (error) {
    console.error('Error performing advanced search:', error);
    return { products: [], totalCount: 0 };
  }

  return { 
    products: data || [], 
    totalCount: count || 0 
  };
};

// Optimized suggestions with caching and faster query
export const getSearchSuggestions = async (query: string): Promise<string[]> => {
  if (!query.trim() || query.length < 2) return [];

  try {
    // Use a more optimized query - only select name and limit results
    const { data, error } = await supabase
      .from('products')
      .select('name')
      .eq('status', 'approved')
      .ilike('name', `%${query}%`)
      .limit(5)
      .order('name'); // Add ordering for consistent results

    if (error) {
      console.error('Error fetching search suggestions:', error);
      return [];
    }

    return data?.map(product => product.name) || [];
  } catch (error) {
    console.error('Error in getSearchSuggestions:', error);
    return [];
  }
};

export const getTrendingSearches = async (): Promise<string[]> => {
  // Get most frequent search queries from verifications
  const { data, error } = await supabase
    .from('verifications')
    .select('search_query')
    .not('search_query', 'is', null)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching trending searches:', error);
    return [];
  }

  // Count frequency and return top searches
  const searchCounts = data?.reduce((acc, verification) => {
    const query = verification.search_query?.toLowerCase().trim();
    if (query) {
      acc[query] = (acc[query] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>) || {};

  return Object.entries(searchCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([query]) => query);
};
