
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { verifyProduct } from '@/services/productService';
import { validateProductExternal, ValidationResult, ExternalProduct } from '@/services/externalApiService';

export const useEnhancedVerification = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [barcode, setBarcode] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [externalResult, setExternalResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [externalLoading, setExternalLoading] = useState(false);
  const { toast } = useToast();

  const handleProductSelect = (productName: string, isExternal = false, product: ExternalProduct | null = null) => {
    setSearchQuery(productName);
    
    if (isExternal && product) {
      setExternalResult({
        found: true,
        verified: product.verified,
        confidence: 0.8,
        source: product.source,
        product,
        alternatives: [],
        sources: [{
          name: product.source,
          status: 'success',
          verified: product.verified,
          confidence: 0.8
        }]
      });
      
      toast({
        title: "External Product Selected",
        description: `Selected ${productName} from ${product.source.toUpperCase()}`,
      });
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
      console.log('Starting internal verification for:', searchQuery);
      const result = await verifyProduct(searchQuery);
      console.log('Internal verification result:', result);
      
      setVerificationResult({
        productName: searchQuery,
        isVerified: result.result === 'verified',
        manufacturer: result.product?.manufacturer?.company_name || 'Unknown',
        registrationDate: result.product?.created_at || new Date().toISOString(),
        certificationNumber: result.product?.certification_number || 'N/A',
        product: result.product,
        similarProducts: []
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
        description: "Failed to verify product",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExternalVerification = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a product name to search",
        variant: "destructive"
      });
      return;
    }

    setExternalLoading(true);
    try {
      console.log('Starting external verification for:', searchQuery);
      const result = await validateProductExternal(searchQuery, barcode || undefined);
      console.log('External verification result:', result);
      
      setExternalResult(result);

      toast({
        title: "External Validation Complete",
        description: result.found ? 
          `Found in external databases with ${Math.round(result.confidence * 100)}% confidence` :
          "Product not found in external databases",
      });

    } catch (error) {
      console.error('External verification error:', error);
      toast({
        title: "External Validation Error",
        description: "Failed to validate product externally",
        variant: "destructive"
      });
    } finally {
      setExternalLoading(false);
    }
  };

  const handleCombinedVerification = async () => {
    await Promise.all([
      handleInternalVerification(),
      handleExternalVerification()
    ]);
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
