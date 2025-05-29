
import { supabase } from '@/integrations/supabase/client';

export interface InternalSearchFilters {
  category?: string;
  nutriScore?: string[];
  country?: string;
  state?: string;
  searchQuery?: string;
}

export const performInternalSearch = async (
  query: string,
  filters: InternalSearchFilters = {},
  limit: number = 10
) => {
  console.log('Performing internal search with filters:', { query, filters });

  // Build internal database query
  let internalQuery = supabase
    .from('products')
    .select(`
      *,
      manufacturer:manufacturers(*),
      category:categories(*)
    `)
    .eq('status', 'approved');

  // Apply search query filter
  if (query.trim()) {
    internalQuery = internalQuery.ilike('name', `%${query}%`);
  }

  // Apply category filter
  if (filters.category) {
    internalQuery = internalQuery.eq('category.name', filters.category);
  }

  // Apply nutri-score filter
  if (filters.nutriScore && filters.nutriScore.length > 0) {
    internalQuery = internalQuery.in('nutri_score', filters.nutriScore);
  }

  // Apply location filters
  if (filters.country) {
    internalQuery = internalQuery.eq('country', filters.country);
  }
  if (filters.state) {
    internalQuery = internalQuery.eq('state', filters.state);
  }

  // Execute internal search
  const { data: internalProducts, error: internalError } = await internalQuery
    .limit(limit)
    .order('created_at', { ascending: false });

  if (internalError) {
    console.error('Internal search error:', internalError);
  }

  return {
    products: internalProducts || [],
    count: internalProducts?.length || 0
  };
};
