
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { verifyProduct } from '@/services/productService';
import { validateProductExternal, ValidationResult, ExternalProduct } from '@/services/externalApiService';
import { useDebounce } from '@/hooks/useDebounce';

export const useEnhancedVerification = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [barcode, setBarcode] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [externalResult, setExternalResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [externalLoading, setExternalLoading] = useState(false);
  const { toast } = useToast();

  const debouncedBarcode = useDebounce(barcode, 500);

  // Auto-verify product when barcode is entered and stable
  // This provides a more seamless experience for users
  useEffect(() => {
    if (debouncedBarcode && debouncedBarcode.length >= 8) {
      handleExternalVerification();
    }
  }, [debouncedBarcode]);

  const handleProductSelect = (productName: string, isExternal = false, product: ExternalProduct | null = null) => {
    console.log('Product selected:', { productName, isExternal, product });
    setSearchQuery(productName);
    
    if (isExternal && product) {
      // For external products, set the external result right away
      setExternalResult({
        found: true,
        verified: product.verified,
        confidence: product.confidence,
        source: product.source,
        product,
        alternatives: [],
        sources: [{
          name: product.source,
          status: 'success',
          verified: product.verified,
          confidence: product.confidence
        }]
      });
      
      toast({
        title: "External Product Selected",
        description: `Selected ${productName} from ${product.source.toUpperCase()}`,
      });
      
      // Additionally verify with internal database
      handleInternalVerification();
    } else {
      // For standard search, run combined verification
      handleCombinedVerification();
    }
  };

  const handleInternalVerification = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a product name to search",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Starting real-time internal verification for:', searchQuery);
      const result = await verifyProduct(searchQuery);
      console.log('Internal verification result:', result);
      
      setVerificationResult({
        productName: searchQuery,
        isVerified: result.result === 'verified',
        manufacturer: result.product?.manufacturer?.company_name || 'Unknown',
        registrationDate: result.product?.created_at || new Date().toISOString(),
        certificationNumber: result.product?.certification_number || 'N/A',
        product: result.product,
        similarProducts: result.similarProducts || []
      });

      toast({
        title: "Verification Complete",
        description: result.result === 'verified' ? 
          "Product found in internal database" : 
          "Product not found in internal database",
      });

    } catch (error) {
      console.error('Internal verification error:', error);
      toast({
        title: "Verification Error",
        description: "Failed to verify product internally, but attempting external verification",
        variant: "destructive"
      });
      
      // Fall back to external verification on internal error
      if (!externalResult) {
        handleExternalVerification();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExternalVerification = async () => {
    const searchTerm = barcode.trim() || searchQuery.trim();
    
    if (!searchTerm) {
      toast({
        title: "Search Required",
        description: "Please enter a product name or barcode to search",
        variant: "destructive"
      });
      return;
    }

    setExternalLoading(true);
    try {
      console.log('Starting real-time external verification for:', { searchQuery, barcode });
      
      // Clear previous results
      setExternalResult(null);
      
      // Pass both barcode and product name for maximum match probability
      const result = await validateProductExternal(barcode || searchQuery, searchQuery || undefined);
      console.log('External verification result:', result);
      
      setExternalResult(result);

      const confidencePercentage = Math.round(result.confidence * 100);
      
      if (result.found) {
        toast({
          title: "External Validation Complete",
          description: result.verified ? 
            `Product verified with ${confidencePercentage}% confidence in ${result.source.toUpperCase()}` :
            `Product found but not verified (${confidencePercentage}% confidence)`,
        });
      } else {
        toast({
          title: "External Validation Complete",
          description: "Product not found in external databases",
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('External verification error:', error);
      toast({
        title: "External Validation Error",
        description: "Failed to validate product with external services",
        variant: "destructive"
      });
    } finally {
      setExternalLoading(false);
    }
  };

  const handleCombinedVerification = async () => {
    if (!searchQuery.trim() && !barcode.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a product name or barcode to search",
        variant: "destructive"
      });
      return;
    }

    console.log('Starting combined real-time verification');
    
    // Run both verifications in parallel for faster results
    await Promise.all([
      handleInternalVerification(),
      handleExternalVerification()
    ]);
    
    // Show comprehensive result toast
    const hasResults = verificationResult || externalResult?.found;
    
    if (hasResults) {
      toast({
        title: "Verification Complete",
        description: "Results available from multiple sources",
      });
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    barcode,
    setBarcode,
    verificationResult,
    externalResult,
    loading,
    externalLoading,
    handleProductSelect,
    handleInternalVerification,
    handleExternalVerification,
    handleCombinedVerification
  };
};
