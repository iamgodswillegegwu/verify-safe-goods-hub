
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Globe, 
  Search, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Loader2
} from 'lucide-react';
import { validateProductExternal, ValidationResult } from '@/services/externalApiService';
import { useToast } from '@/hooks/use-toast';

interface ExternalValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  barcode: string;
}

const ExternalValidationDialog = ({ open, onOpenChange, productName, barcode }: ExternalValidationDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBarcode, setSearchBarcode] = useState('');
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setSearchQuery(productName);
    setSearchBarcode(barcode);
  }, [productName, barcode]);

  const handleValidation = async () => {
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
      console.log('Starting external validation for:', searchQuery);
      const result = await validateProductExternal(searchQuery, searchBarcode || undefined);
      console.log('External validation result:', result);
      
      setValidationResults([result]);

      toast({
        title: "Validation Complete",
        description: result.found ? 
          `Found in external databases with ${Math.round(result.confidence * 100)}% confidence` :
          "Product not found in external databases",
      });

    } catch (error) {
      console.error('External validation error:', error);
      toast({
        title: "Validation Error",
        description: "Failed to validate product externally",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (result: ValidationResult) => {
    if (!result.found) return <XCircle className="h-5 w-5 text-red-500" />;
    if (result.verified) return <CheckCircle className="h-5 w-5 text-green-500" />;
    return <AlertTriangle className="h-5 w-5 text-orange-500" />;
  };

  const getStatusColor = (result: ValidationResult) => {
    if (!result.found) return 'border-red-200 bg-red-50';
    if (result.verified) return 'border-green-200 bg-green-50';
    return 'border-orange-200 bg-orange-50';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-600" />
            Advanced External Validation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="ext_search">Product Name</Label>
              <Input
                id="ext_search"
                placeholder="Enter product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="ext_barcode">Barcode (Optional)</Label>
              <Input
                id="ext_barcode"
                placeholder="Enter barcode..."
                value={searchBarcode}
                onChange={(e) => setSearchBarcode(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button 
              onClick={handleValidation}
              disabled={loading || !searchQuery.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Validate Product
                </>
              )}
            </Button>
          </div>

          {/* Results Section */}
          {validationResults.length > 0 && (
            <div className="space-y-4">
              <Separator />
              <h4 className="font-semibold text-gray-900">Validation Results</h4>
              
              {validationResults.map((result, index) => (
                <Card key={index} className={`border-2 ${getStatusColor(result)}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result)}
                        <span className="font-medium">
                          {result.found ? 
                            (result.verified ? 'Verified Product' : 'Product Found - Issues Detected') :
                            'Product Not Found'
                          }
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(result.confidence * 100)}% confidence
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {result.product ? (
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium">{result.product.name}</p>
                          {result.product.brand && (
                            <p className="text-sm text-gray-600">Brand: {result.product.brand}</p>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            Source: {result.source.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Category: {result.product.category}
                          </Badge>
                          {result.product.nutriScore && (
                            <Badge variant="outline" className="text-xs">
                              Nutri-Score: {result.product.nutriScore}
                            </Badge>
                          )}
                        </div>

                        {result.product.ingredients && (
                          <div className="text-sm">
                            <strong>Ingredients:</strong>
                            <p className="text-gray-600 mt-1 line-clamp-3">
                              {result.product.ingredients}
                            </p>
                          </div>
                        )}

                        {result.alternatives && result.alternatives.length > 0 && (
                          <div className="text-sm">
                            <strong>Alternative Products:</strong>
                            <ul className="mt-1 space-y-1">
                              {result.alternatives.slice(0, 3).map((alt, altIndex) => (
                                <li key={altIndex} className="text-gray-600 flex items-center gap-2">
                                  <ExternalLink className="h-3 w-3" />
                                  {alt.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-600">
                        No external data available for this product. This could mean:
                      </p>
                    )}
                    
                    {!result.found && (
                      <ul className="text-sm text-gray-600 mt-2 space-y-1">
                        <li>• Product is not registered in external databases</li>
                        <li>• Product name or barcode might be incorrect</li>
                        <li>• Product might be new or locally distributed</li>
                      </ul>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExternalValidationDialog;
