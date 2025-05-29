
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink, 
  Database, 
  Globe,
  Loader2,
  Award
} from 'lucide-react';
import { validateProductExternal, ValidationResult, cacheExternalResult, getCachedResult } from '@/services/externalApiService';

interface ExternalValidationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  barcode?: string;
  category?: string;
  ingredients?: string[];
}

const ExternalValidationDialog = ({ 
  isOpen, 
  onClose, 
  productName, 
  barcode, 
  category, 
  ingredients 
}: ExternalValidationDialogProps) => {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleValidate = async () => {
    setLoading(true);
    try {
      console.log('Starting external validation for:', productName);
      
      // Check cache first
      const cacheKey = `${productName}-${barcode || ''}-${category || ''}`;
      const cachedResult = await getCachedResult(cacheKey);
      
      if (cachedResult) {
        console.log('Using cached result');
        setValidationResult(cachedResult);
        setLoading(false);
        return;
      }

      // Perform external validation
      const result = await validateProductExternal(productName, barcode, category, ingredients);
      console.log('External validation result:', result);
      
      setValidationResult(result);
      
      // Cache the result
      await cacheExternalResult(cacheKey, result);
      
      toast({
        title: "Validation Complete",
        description: result.found ? 
          `Found product with ${Math.round(result.confidence * 100)}% confidence` :
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

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'openfoodfacts': return <Globe className="h-4 w-4 text-green-600" />;
      case 'fda': return <Database className="h-4 w-4 text-blue-600" />;
      case 'cosing': return <Award className="h-4 w-4 text-purple-600" />;
      case 'gs1': return <ExternalLink className="h-4 w-4 text-orange-600" />;
      default: return <Database className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSourceName = (source: string) => {
    switch (source) {
      case 'openfoodfacts': return 'Open Food Facts';
      case 'fda': return 'FDA Drug Database';
      case 'cosing': return 'CosIng (EU Cosmetics)';
      case 'gs1': return 'GS1 Global Registry';
      default: return 'Unknown Source';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            External Database Validation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Name:</strong> {productName}</div>
              {barcode && <div><strong>Barcode:</strong> {barcode}</div>}
              {category && <div><strong>Category:</strong> {category}</div>}
              {ingredients && ingredients.length > 0 && (
                <div><strong>Ingredients:</strong> {ingredients.slice(0, 3).join(', ')}{ingredients.length > 3 ? '...' : ''}</div>
              )}
            </CardContent>
          </Card>

          {/* Validation Button */}
          {!validationResult && (
            <div className="flex justify-center">
              <Button 
                onClick={handleValidate} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Validate with External APIs
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Validation Results */}
          {validationResult && (
            <Card className={`border-2 ${validationResult.verified ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
              <CardHeader className={`${validationResult.verified ? 'bg-green-100' : 'bg-orange-100'} rounded-t-lg`}>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {validationResult.verified ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-orange-600" />
                    )}
                    <span className={validationResult.verified ? 'text-green-800' : 'text-orange-800'}>
                      {validationResult.found ? 
                        (validationResult.verified ? 'Product Verified ✓' : 'Product Found - Verification Issues ⚠️') :
                        'Product Not Found ❌'
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {validationResult.product && getSourceIcon(validationResult.source)}
                    <Badge variant="outline" className="text-xs">
                      {Math.round(validationResult.confidence * 100)}% confidence
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                {validationResult.product && (
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3">External Database Match</h4>
                    <div className="bg-white p-4 rounded-lg border space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{validationResult.product.name}</p>
                          {validationResult.product.brand && (
                            <p className="text-sm text-slate-600">Brand: {validationResult.product.brand}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {getSourceIcon(validationResult.product.source)}
                          <span className="text-sm font-medium">{getSourceName(validationResult.product.source)}</span>
                        </div>
                      </div>

                      {validationResult.product.nutriScore && (
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Nutri-Score: <strong>{validationResult.product.nutriScore}</strong></span>
                        </div>
                      )}

                      {validationResult.product.allergens && validationResult.product.allergens.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-orange-700 mb-2">⚠️ Allergens:</p>
                          <div className="flex flex-wrap gap-1">
                            {validationResult.product.allergens.slice(0, 5).map((allergen, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-orange-300 text-orange-700">
                                {allergen.replace('en:', '')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {validationResult.product.imageUrl && (
                        <div>
                          <img 
                            src={validationResult.product.imageUrl} 
                            alt={validationResult.product.name}
                            className="w-20 h-20 object-cover rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {validationResult.alternatives && validationResult.alternatives.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3">Alternative Sources</h4>
                      <div className="space-y-2">
                        {validationResult.alternatives.map((alt, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                            <div>
                              <p className="font-medium text-sm">{alt.name}</p>
                              <p className="text-xs text-slate-600">{alt.brand}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getSourceIcon(alt.source)}
                              <span className="text-xs">{getSourceName(alt.source)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-4">
                  <Button onClick={onClose} className="flex-1">
                    Close
                  </Button>
                  <Button variant="outline" onClick={handleValidate} disabled={loading} className="flex-1">
                    Re-validate
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExternalValidationDialog;
