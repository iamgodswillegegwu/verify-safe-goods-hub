
import { useState } from 'react';
import { Search, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AutoSuggestSearch from './AutoSuggestSearch';
import ProductScanner from './ProductScanner';
import SearchFilters from './SearchFilters';
import VerificationResult from './VerificationResult';
import AdvancedSearchInterface from './AdvancedSearchInterface';

interface ProductVerificationSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFilters: any;
  setSearchFilters: (filters: any) => void;
  verificationResult: any;
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
  isLoading: boolean;
  showAdvancedSearch: boolean;
  setShowAdvancedSearch: (show: boolean) => void;
  handleSearch: () => Promise<void>;
  handleScanResult: (result: any) => Promise<void>;
  handleProductSelect: (productName: string, isExternal?: boolean, product?: any) => Promise<void>;
}

const ProductVerificationSection = ({
  searchQuery,
  setSearchQuery,
  searchFilters,
  setSearchFilters,
  verificationResult,
  isScanning,
  setIsScanning,
  isLoading,
  showAdvancedSearch,
  setShowAdvancedSearch,
  handleSearch,
  handleScanResult,
  handleProductSelect
}: ProductVerificationSectionProps) => {
  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Verify Your Products</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Scan or search for cosmetic and food products to verify their authenticity and safety
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Search Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-1 border border-gray-200">
            <Button
              variant={!showAdvancedSearch ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowAdvancedSearch(false)}
              className={!showAdvancedSearch ? "bg-blue-600 text-white" : ""}
            >
              Quick Verification
            </Button>
            <Button
              variant={showAdvancedSearch ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowAdvancedSearch(true)}
              className={showAdvancedSearch ? "bg-blue-600 text-white" : ""}
            >
              Advanced Search
            </Button>
          </div>
        </div>

        {!showAdvancedSearch ? (
          <div className="space-y-6">
            {/* Main Search and Verification Card */}
            <Card className="border-2 border-blue-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-sky-50">
                <CardTitle className="text-center text-slate-800">Product Verification</CardTitle>
                <CardDescription className="text-center">
                  Search with real-time suggestions or scan products
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Auto-Suggest Search Input */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                      <Search className="h-5 w-5 text-blue-600" />
                      Search by Name
                    </h3>
                    <AutoSuggestSearch
                      onProductSelect={handleProductSelect}
                      placeholder="Start typing to see suggestions..."
                      className="w-full"
                    />
                    <Button 
                      onClick={handleSearch}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={isLoading || !searchQuery.trim()}
                    >
                      {isLoading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                      ) : (
                        <Search className="h-4 w-4 mr-2" />
                      )}
                      Search & Verify
                    </Button>
                  </div>

                  {/* Camera Scanner */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                      <Camera className="h-5 w-5 text-green-600" />
                      Scan Product
                    </h3>
                    <Button
                      onClick={() => setIsScanning(!isScanning)}
                      variant="outline"
                      className="w-full border-green-200 text-green-700 hover:bg-green-50"
                      disabled={isLoading}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {isScanning ? 'Stop Scanner' : 'Start Scanner'}
                    </Button>
                  </div>
                </div>

                {/* Advanced Filters */}
                <SearchFilters 
                  filters={searchFilters}
                  onFiltersChange={setSearchFilters}
                />

                {/* Scanner Component */}
                {isScanning && (
                  <div className="mt-6">
                    <ProductScanner onResult={handleScanResult} />
                  </div>
                )}

                {/* Enhanced Verification Result Display */}
                {verificationResult && (
                  <div className="mt-6">
                    <VerificationResult result={verificationResult} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Advanced Search Interface */
          <AdvancedSearchInterface />
        )}
      </div>
    </section>
  );
};

export default ProductVerificationSection;
