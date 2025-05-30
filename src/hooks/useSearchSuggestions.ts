
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { getSearchSuggestions } from '@/services/searchService';
import { searchProductsQuick, ExternalProduct } from '@/services/externalApiService';

export const useSearchSuggestions = (query: string) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [externalProducts, setExternalProducts] = useState<ExternalProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const searchSuggestions = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setSuggestions([]);
        setExternalProducts([]);
        return;
      }

      setIsLoading(true);
      try {
        console.log('Fetching real-time suggestions for:', debouncedQuery);
        
        // Search both internal database and external APIs in parallel
        const [internalSuggestions, externalResults] = await Promise.all([
          getSearchSuggestions(debouncedQuery),
          searchProductsQuick(debouncedQuery)
        ]);

        console.log('Real-time suggestions results:', {
          internal: internalSuggestions.length,
          external: externalResults.length
        });

        setSuggestions(internalSuggestions);
        setExternalProducts(externalResults);
      } catch (error) {
        console.error('Error fetching real-time suggestions:', error);
        setSuggestions([]);
        setExternalProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchSuggestions();
  }, [debouncedQuery]);

  return {
    suggestions,
    externalProducts,
    isLoading
  };
};
