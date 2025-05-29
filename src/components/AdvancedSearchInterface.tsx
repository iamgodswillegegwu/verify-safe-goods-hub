
import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import SearchFilters from './SearchFilters';
import SearchResultsList from './SearchResultsList';
import SearchSortOptions, { SortOption } from './SearchSortOptions';
import { performAdvancedSearch, SearchOptions } from '@/services/searchService';
import { Product } from '@/lib/supabase';
import { SearchFilters as SearchFiltersType } from '@/services/productService';

const AdvancedSearchInterface = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFiltersType>({});
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  const resultsPerPage = 10;

  const performSearch = useCallback(async (page: number = 1) => {
    if (!searchQuery.trim() && Object.keys(searchFilters).length === 0) {
      setSearchResults([]);
      setTotalResults(0);
      return;
    }

    setIsLoading(true);
    console.log('Performing advanced search:', { 
      query: searchQuery, 
      filters: searchFilters, 
      sortBy, 
      page 
    });

    try {
      const options: SearchOptions = {
        filters: searchFilters,
        sortBy,
        limit: resultsPerPage,
        offset: (page - 1) * resultsPerPage
      };

      const { products, totalCount } = await performAdvancedSearch(searchQuery, options);
      
      setSearchResults(products);
      setTotalResults(totalCount);
      setCurrentPage(page);

      if (products.length === 0 && searchQuery.trim()) {
        toast({
          title: "No Results",
          description: "No products found matching your search criteria.",
        });
      }
    } catch (error) {
      console.error('Error performing search:', error);
      toast({
        title: "Search Error",
        description: "Failed to search products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, searchFilters, sortBy, toast]);

  const handleSearch = () => {
    performSearch(1);
  };

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setSearchFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handleProductSelect = (product: Product) => {
    console.log('Selected product:', product);
    // In a real app, this would navigate to product details page
    toast({
      title: "Product Selected",
      description: `Selected: ${product.name}`,
    });
  };

  // Auto-search when filters or sort changes
  useEffect(() => {
    if (searchResults.length > 0 || searchQuery.trim()) {
      performSearch(1);
    }
  }, [searchFilters, sortBy]);

  const totalPages = Math.ceil(totalResults / resultsPerPage);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Advanced Product Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Search Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Search for products, ingredients, manufacturers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-blue-200 focus:border-blue-400"
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSearch()}
            />
            <Button 
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-slate-300"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <SearchFilters 
              filters={searchFilters}
              onFiltersChange={handleFiltersChange}
            />
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {(searchResults.length > 0 || isLoading) && (
        <div className="space-y-4">
          {/* Sort Options */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              {isLoading ? 'Searching...' : `${totalResults} results found`}
            </div>
            <SearchSortOptions 
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />
          </div>

          {/* Results List */}
          <SearchResultsList 
            products={searchResults}
            isLoading={isLoading}
            onProductSelect={handleProductSelect}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => performSearch(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 2 + i;
                  }
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => performSearch(pageNum)}
                      disabled={isLoading}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => performSearch(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchInterface;
