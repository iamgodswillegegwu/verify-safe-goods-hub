import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { getSearchSuggestions } from '@/services/searchService';
import { searchProductsQuick, ExternalProduct } from '@/services/externalApiService';
import { useToast } from '@/hooks/use-toast';

// Simple in-memory cache for suggestions
const suggestionCache = new Map<string, {
  suggestions: string[];
  externalProducts: ExternalProduct[];
  timestamp: number;
}>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MIN_QUERY_LENGTH = 2;

export const useSearchSuggestions = (query: string) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [externalProducts, setExternalProducts] = useState<ExternalProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Reduce debounce delay for faster response
  const debouncedQuery = useDebounce(query, 150);
  
  // Use ref to track current request and allow cancellation
  const currentRequestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const searchSuggestions = async () => {
      if (!debouncedQuery || debouncedQuery.length < MIN_QUERY_LENGTH) {
        setSuggestions([]);
        setExternalProducts([]);
        return;
      }

      // Cancel previous request if still pending
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
      }

      // Create new abort controller for this request
      const abortController = new AbortController();
      currentRequestRef.current = abortController;

      setIsLoading(true);
      
      try {
        // Check cache first
        const cacheKey = debouncedQuery.toLowerCase().trim();
        const cached = suggestionCache.get(cacheKey);
        const now = Date.now();
        
        if (cached && (now - cached.timestamp) < CACHE_DURATION) {
          console.log('Using cached suggestions for:', debouncedQuery);
          setSuggestions(cached.suggestions);
          setExternalProducts(cached.externalProducts);
          setIsLoading(false);
          return;
        }

        console.log('Fetching real-time suggestions for:', debouncedQuery);
        
        // Prioritize internal database search (faster)
        const internalSuggestions = await getSearchSuggestions(debouncedQuery);
        
        // Set internal results immediately for faster UI response
        setSuggestions(internalSuggestions);
        
        // Check if request was cancelled
        if (abortController.signal.aborted) {
          return;
        }

        // Only fetch external results if we have few internal results
        let externalResults: ExternalProduct[] = [];
        if (internalSuggestions.length < 3) {
          try {
            // Use a shorter timeout for external APIs
            const timeoutPromise = new Promise<ExternalProduct[]>((_, reject) => {
              setTimeout(() => reject(new Error('External API timeout')), 3000);
            });
            
            externalResults = await Promise.race([
              searchProductsQuick(debouncedQuery),
              timeoutPromise
            ]);
          } catch (error) {
            console.log('External API timeout or error, continuing with internal results');
            externalResults = [];
          }
        }

        // Check if request was cancelled before setting results
        if (abortController.signal.aborted) {
          return;
        }

        console.log('Real-time suggestions results:', {
          internal: internalSuggestions.length,
          external: externalResults.length
        });

        setExternalProducts(externalResults);

        // Cache the results
        suggestionCache.set(cacheKey, {
          suggestions: internalSuggestions,
          externalProducts: externalResults,
          timestamp: now
        });

        // Clean old cache entries (keep cache size reasonable)
        if (suggestionCache.size > 50) {
          const oldestEntries = Array.from(suggestionCache.entries())
            .sort(([,a], [,b]) => a.timestamp - b.timestamp)
            .slice(0, 10);
          
          oldestEntries.forEach(([key]) => suggestionCache.delete(key));
        }

      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Search request was cancelled');
          return;
        }
        
        console.error('Error fetching real-time suggestions:', error);
        setSuggestions([]);
        setExternalProducts([]);
        
        // Only show error toast if it's not a timeout
        if (!error.message?.includes('timeout')) {
          // Add minimal fallback suggestions from cache or generate simple ones
          const fallbackSuggestions = generateSimpleFallback(debouncedQuery);
          setSuggestions(fallbackSuggestions);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
        currentRequestRef.current = null;
      }
    };

    searchSuggestions();

    // Cleanup function to cancel request when component unmounts or query changes
    return () => {
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
      }
    };
  }, [debouncedQuery]);

  // Generate simple fallback suggestions without heavy processing
  const generateSimpleFallback = (query: string): string[] => {
    const commonProducts = [
      'Organic Products',
      'Beauty Products', 
      'Health Supplements',
      'Food Products',
      'Personal Care'
    ];
    
    return commonProducts
      .filter(product => 
        product.toLowerCase().includes(query.toLowerCase()) ||
        query.toLowerCase().includes(product.toLowerCase().split(' ')[0])
      )
      .slice(0, 3)
      .map(product => `${query} - ${product}`);
  };

  return {
    suggestions,
    externalProducts,
    isLoading
  };
};
