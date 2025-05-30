import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Scan, 
  ExternalLink, 
  Shield, 
  Database,
  Globe,
  Zap
} from 'lucide-react';
import { verifyProduct } from '@/services/productService';
import { validateProductExternal, ValidationResult } from '@/services/externalApiService';
import EnhancedVerificationResult from './EnhancedVerificationResult';
import ExternalValidationDialog from './ExternalValidationDialog';
import AutoSuggestSearch from './AutoSuggestSearch';

const EnhancedProductVerification = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [barcode, setBarcode] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [externalResult, setExternalResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [externalLoading, setExternalLoading] = useState(false);
  const [showExternalDialog, setShowExternalDialog] = useState(false);
  const { toast } = useToast();

  const handleProductSelect = (productName: string, isExternal = false, product = null) => {
    setSearchQuery(productName);
    
    if (isExternal && product) {
      // Set external result if it's from external APIs
      setExternalResult({
        found: true,
        verified: product.verified,
        confidence: 0.8,
        source: product.source,
        product,
        alternatives: []
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            Enhanced Product Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search">Product Name (with Auto-Suggest)</Label>
              <AutoSuggestSearch
                onProductSelect={handleProductSelect}
                placeholder="Start typing for suggestions..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="barcode">Barcode (Optional)</Label>
              <Input
                id="barcode"
                placeholder="Enter barcode..."
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleInternalVerification}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Database className="h-4 w-4 mr-2" />
              {loading ? 'Verifying...' : 'Internal Database'}
            </Button>

            <Button 
              onClick={handleExternalVerification}
              disabled={externalLoading}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              <Globe className="h-4 w-4 mr-2" />
              {externalLoading ? 'Validating...' : 'External APIs'}
            </Button>

            <Button 
              onClick={handleCombinedVerification}
              disabled={loading || externalLoading}
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              <Zap className="h-4 w-4 mr-2" />
              {(loading || externalLoading) ? 'Processing...' : 'Combined Search'}
            </Button>

            <Button 
              onClick={() => setShowExternalDialog(true)}
              variant="outline"
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Advanced External
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Internal Database Result */}
        {verificationResult && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Internal Database Result
            </h3>
            <EnhancedVerificationResult result={verificationResult} />
          </div>
        )}

        {/* External API Result */}
        {externalResult && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-600" />
              External API Result
            </h3>
            <Card className={`border-2 ${externalResult.verified ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
              <CardHeader className={`${externalResult.verified ? 'bg-green-100' : 'bg-orange-100'} rounded-t-lg`}>
                <CardTitle className="flex items-center justify-between">
                  <span className={externalResult.verified ? 'text-green-800' : 'text-orange-800'}>
                    {externalResult.found ? 
                      (externalResult.verified ? 'Verified ✓' : 'Found - Issues ⚠️') :
                      'Not Found ❌'
                    }
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(externalResult.confidence * 100)}% confidence
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {externalResult.product ? (
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">{externalResult.product.name}</p>
                      {externalResult.product.brand && (
                        <p className="text-sm text-slate-600">Brand: {externalResult.product.brand}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Source: {externalResult.source.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Category: {externalResult.product.category}
                      </Badge>
                    </div>
                    {externalResult.product.nutriScore && (
                      <div className="text-sm">
                        <strong>Nutri-Score:</strong> {externalResult.product.nutriScore}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-600">No external data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* External Validation Dialog */}
      <ExternalValidationDialog
        isOpen={showExternalDialog}
        onClose={() => setShowExternalDialog(false)}
        productName={searchQuery}
        barcode={barcode}
      />
    </div>
  );
};

export default EnhancedProductVerification;
