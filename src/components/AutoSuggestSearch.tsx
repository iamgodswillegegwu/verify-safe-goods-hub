
import { useState, useRef, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { performEnhancedSearch } from '@/services/enhancedSearchService';
import { useToast } from '@/hooks/use-toast';

interface AutoSuggestSearchProps {
  onProductSelect: (productName: string, isExternal?: boolean, product?: any) => void;
  placeholder?: string;
  className?: string;
}

const AutoSuggestSearch = ({ onProductSelect, placeholder = "Search products...", className = "" }: AutoSuggestSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  const searchProducts = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const result = await performEnhancedSearch(query, {}, 5);
      
      // Combine and format results
      const combinedSuggestions = [
        ...result.internal.products.map(p => ({ ...p, source: 'internal' })),
        ...result.external.products.map(p => ({ ...p, source: 'external' }))
      ].slice(0, 8);
      
      setSuggestions(combinedSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      searchProducts(value);
    }, 300);
  };

  const handleSuggestionClick = (suggestion: any) => {
    const productName = suggestion.name || suggestion.product_name || 'Unknown Product';
    setSearchQuery(productName);
    setShowSuggestions(false);
    setSuggestions([]);
    
    onProductSelect(productName, suggestion.source === 'external', suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      onProductSelect(searchQuery.trim());
    }
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          className="pl-10 pr-10"
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto">
          <CardContent className="p-0">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {suggestion.name || suggestion.product_name || 'Unknown Product'}
                    </p>
                    {suggestion.brand && (
                      <p className="text-sm text-gray-600">Brand: {suggestion.brand}</p>
                    )}
                    {suggestion.manufacturer?.company_name && (
                      <p className="text-sm text-gray-600">
                        Manufacturer: {suggestion.manufacturer.company_name}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <Badge 
                      variant="outline" 
                      className={suggestion.source === 'external' ? 'text-green-700 border-green-300' : 'text-blue-700 border-blue-300'}
                    >
                      {suggestion.source === 'external' ? 'External' : 'Internal'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AutoSuggestSearch;
