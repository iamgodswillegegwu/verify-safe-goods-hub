
import { ExternalProduct } from '@/services/externalApiService';

export interface SearchSuggestion {
  text: string;
  type: 'internal' | 'external';
  product?: ExternalProduct;
}

export interface AutoSuggestSearchProps {
  onProductSelect: (productName: string, isExternal?: boolean, product?: ExternalProduct) => void;
  placeholder?: string;
  className?: string;
}

export interface SearchSuggestionsDropdownProps {
  suggestions: string[];
  externalProducts: ExternalProduct[];
  isLoading: boolean;
  showSuggestions: boolean;
  highlightedIndex: number;
  onSuggestionClick: (suggestion: string, isExternal?: boolean, product?: ExternalProduct) => void;
}

export interface SearchInputProps {
  query: string;
  placeholder: string;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus: () => void;
  onBlur: (e: React.FocusEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  className?: string;
}
