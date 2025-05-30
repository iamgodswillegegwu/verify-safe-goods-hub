
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { verifyProduct, getSimilarProducts } from '@/services/productService';

export const useProductVerification = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({});
  const [verificationResult, setVerificationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    console.log('Searching for product:', searchQuery, 'with filters:', searchFilters);
    
    try {
      const verification = await verifyProduct(searchQuery, user?.id, searchFilters);
      
      let similarProducts = [];
      let externalData = null;

      // If not verified in internal DB, search external APIs and get similar products
      if (verification.result !== 'verified') {
        // Get similar products from internal database
        similarProducts = await getSimilarProducts(searchQuery, searchFilters);
        
        // Also search external APIs for additional data
        try {
          const { performEnhancedSearch } = await import('@/services/enhancedSearchService');
          const enhancedResult = await performEnhancedSearch(searchQuery, searchFilters, 5);
          
          if (enhancedResult.external.products.length > 0) {
            externalData = enhancedResult.external.products[0];
            // Add external products to similar products
            similarProducts = [
              ...similarProducts.map(p => ({ ...p, source: 'internal' })),
              ...enhancedResult.external.products.slice(1).map(p => ({ ...p, source: 'external' }))
            ];
          }
        } catch (error) {
          console.error('Error searching external APIs:', error);
        }
      }

      const result = {
        productName: searchQuery,
        isVerified: verification.result === 'verified',
        manufacturer: verification.product?.manufacturer?.company_name || 'Unknown',
        registrationDate: verification.product?.created_at ? 
          new Date(verification.product.created_at).toLocaleDateString() : 'N/A',
        certificationNumber: verification.product?.certification_number || 'N/A',
        similarProducts: similarProducts.map(p => ({
          name: p.name || 'Unknown Product',
          manufacturer: p.manufacturer?.company_name || p.brand || 'Unknown',
          verified: p.source === 'internal' || p.verified,
          source: p.source || 'internal',
          imageUrl: p.imageUrl || p.image_url,
          nutriScore: p.nutriScore || p.nutri_score
        })),
        product: verification.product,
        externalData,
        searchFilters
      };
      
      setVerificationResult(result);

      // Show appropriate toast notification
      if (verification.result === 'verified') {
        toast({
          title: "Product Verified! ✓",
          description: "This product is authentic and safe to use.",
        });
      } else if (externalData) {
        toast({
          title: "Product Found in External Database",
          description: `Found in ${externalData.source?.toUpperCase() || 'external'} database.`,
        });
      } else {
        toast({
          title: "Product Not Found",
          description: "Product not found in verified databases. Check suggested alternatives.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error verifying product:', error);
      toast({
        title: "Error",
        description: "Failed to verify product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = async (productName: string, isExternal = false, product = null) => {
    if (!productName) return;
    
    setSearchQuery(productName);
    
    if (isExternal && product) {
      // If it's an external product, show it directly with enhanced details
      const result = {
        productName,
        isVerified: product.verified || false,
        manufacturer: product.brand || 'External Source',
        registrationDate: 'N/A',
        certificationNumber: product.id || 'External Product',
        similarProducts: [],
        product: null,
        externalData: product,
        searchFilters
      };
      
      setVerificationResult(result);
      
      toast({
        title: "External Product Selected",
        description: `Found ${productName} from ${product.source?.toUpperCase() || 'external source'}`,
      });
    } else {
      // Search internal database with enhanced search
      await handleSearch();
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    searchFilters,
    setSearchFilters,
    verificationResult,
    setVerificationResult,
    isLoading,
    handleSearch,
    handleProductSelect
  };
};
