
import { useState, useRef } from 'react';
import { AutoSuggestSearchProps } from './search/types';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';
import SearchInput from './search/SearchInput';
import SearchSuggestionsDropdown from './search/SearchSuggestionsDropdown';
import { ExternalProduct } from '@/services/externalApiService';

const AutoSuggestSearch = ({ 
  onProductSelect, 
  placeholder = "Search for products...", 
  className = "" 
}: AutoSuggestSearchProps) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const { suggestions, externalProducts, isLoading } = useSearchSuggestions(query);

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

  return (
    <div className={`relative w-full ${className}`}>
      <SearchInput
        query={query}
        placeholder={placeholder}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        inputRef={inputRef}
      />

      <SearchSuggestionsDropdown
        ref={suggestionsRef}
        suggestions={suggestions}
        externalProducts={externalProducts}
        isLoading={isLoading}
        showSuggestions={showSuggestions}
        highlightedIndex={highlightedIndex}
        onSuggestionClick={handleSuggestionClick}
      />
    </div>
  );
};

export default AutoSuggestSearch;
