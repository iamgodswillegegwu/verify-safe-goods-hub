
import React from 'react';
import { Clock, ExternalLink, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchSuggestionsDropdownProps } from './types';

const SearchSuggestionsDropdown = React.forwardRef<HTMLDivElement, SearchSuggestionsDropdownProps>(
  ({
    suggestions,
    externalProducts,
    isLoading,
    showSuggestions,
    highlightedIndex,
    onSuggestionClick
  }, ref) => {
    const totalSuggestions = suggestions.length + externalProducts.length;

    if (!showSuggestions || totalSuggestions === 0) {
      return null;
    }

    return (
      <Card 
        ref={ref}
        className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto shadow-lg border bg-white"
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
                  onClick={() => onSuggestionClick(suggestion)}
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
                  onClick={() => onSuggestionClick(product.name, true, product)}
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
                        {product.source?.toUpperCase() || 'EXTERNAL'}
                      </Badge>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

SearchSuggestionsDropdown.displayName = 'SearchSuggestionsDropdown';

export default SearchSuggestionsDropdown;
