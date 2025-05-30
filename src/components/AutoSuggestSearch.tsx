import { useState, useEffect, useRef } from 'react';
import { Search, Clock, ExternalLink, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { getSearchSuggestions } from '@/services/searchService';
import { searchProductsQuick, ExternalProduct } from '@/services/externalApiService';

interface AutoSuggestSearchProps {
  onProductSelect: (productName: string, isExternal?: boolean, product?: ExternalProduct) => void;
  placeholder?: string;
  className?: string;
}

const AutoSuggestSearch = ({ 
  onProductSelect, 
  placeholder = "Search for products...", 
  className = "" 
}: AutoSuggestSearchProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [externalProducts, setExternalProducts] = useState<ExternalProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
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
        // Search both internal database and external APIs in parallel
        const [internalSuggestions, externalResults] = await Promise.all([
          getSearchSuggestions(debouncedQuery),
          searchProductsQuick(debouncedQuery)
        ]);

        setSuggestions(internalSuggestions);
        setExternalProducts(externalResults);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    searchSuggestions();
  }, [debouncedQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
    setHighlightedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: string, isExternal = false, product?: ExternalProduct) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onProductSelect(suggestion, isExternal, product);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = suggestions.length + externalProducts.length;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => prev < totalItems - 1 ? prev + 1 : -1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > -1 ? prev - 1 : totalItems - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          if (highlightedIndex < suggestions.length) {
            handleSuggestionClick(suggestions[highlightedIndex]);
          } else {
            const externalIndex = highlightedIndex - suggestions.length;
            const product = externalProducts[externalIndex];
            handleSuggestionClick(product.name, true, product);
          }
        } else if (query.trim()) {
          onProductSelect(query.trim());
          setShowSuggestions(false);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    if (query.length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(e.relatedTarget as Node)) {
        setShowSuggestions(false);
      }
    }, 150);
  };

  const totalSuggestions = suggestions.length + externalProducts.length;

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="pl-10 pr-4"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        )}
      </div>

      {showSuggestions && totalSuggestions > 0 && (
        <Card 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto shadow-lg border"
        >
          <CardContent className="p-0">
            {/* Internal Database Suggestions */}
            {suggestions.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">
                  <Package className="h-3 w-3 inline mr-1" />
                  Internal Database
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`internal-${index}`}
                    className={`w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-gray-100 transition-colors ${
                      highlightedIndex === index ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{suggestion}</span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        Verified
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* External API Suggestions */}
            {externalProducts.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-green-50 border-b">
                  <ExternalLink className="h-3 w-3 inline mr-1" />
                  External Sources
                </div>
                {externalProducts.map((product, index) => (
                  <button
                    key={`external-${index}`}
                    className={`w-full text-left px-3 py-2 hover:bg-green-50 border-b border-gray-100 transition-colors ${
                      highlightedIndex === suggestions.length + index ? 'bg-green-50' : ''
                    }`}
                    onClick={() => handleSuggestionClick(product.name, true, product)}
                  >
                    <div className="flex items-center gap-2">
                      {product.imageUrl && (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="h-8 w-8 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{product.name}</div>
                        {product.brand && (
                          <div className="text-xs text-gray-500 truncate">by {product.brand}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {product.nutriScore && (
                          <Badge variant="outline" className="text-xs">
                            {product.nutriScore}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                          {product.source.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AutoSuggestSearch;
