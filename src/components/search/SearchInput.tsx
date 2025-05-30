
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SearchInputProps } from './types';

const SearchInput = ({
  query,
  placeholder,
  isLoading,
  onInputChange,
  onKeyDown,
  onFocus,
  onBlur,
  inputRef,
  className = ""
}: SearchInputProps) => {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          className="pl-10 pr-4"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
