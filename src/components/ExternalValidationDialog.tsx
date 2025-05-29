import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  validateProductExternal, 
  ValidationResult, 
  ExternalProduct,
  getCachedResult,
  cacheResult
} from '@/services/externalApiService';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ExternalLink, 
  Loader2, 
  RefreshCw, 
  Database 
} from 'lucide-react';

interface ExternalValidationDialogProps {
  trigger: React.ReactNode;
  productName: string;
  barcode?: string;
  onValidationComplete?: (result: ValidationResult) => void;
}

interface ValidationStatusProps {
  validationResult: ValidationResult | null;
  loading: boolean;
}

const ValidationStatus: React.FC<ValidationStatusProps> = ({ validationResult, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Validating...
      </div>
    );
  }

  if (!validationResult) {
    return <div className="text-muted-foreground">Enter product details to validate.</div>;
  }

  if (validationResult.found && validationResult.verified) {
    return (
      <div className="flex items-center text-green-500">
        <CheckCircle className="mr-2 h-4 w-4" />
        Verified by {validationResult.source} with {validationResult.confidence}% confidence
      </div>
    );
  }

  if (validationResult.found && !validationResult.verified) {
    return (
      <div className="flex items-center text-yellow-500">
        <AlertTriangle className="mr-2 h-4 w-4" />
        Found but not fully verified. Confidence: {validationResult.confidence}%
      </div>
    );
  }

  return (
    <div className="flex items-center text-red-500">
      <XCircle className="mr-2 h-4 w-4" />
      Not found in external databases.
    </div>
  );
};

const ExternalValidationDialog = ({ trigger, productName, barcode, onValidationComplete }: ExternalValidationDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const performValidation = async () => {
    if (!productName.trim()) return;

    setLoading(true);
    setValidationResult(null);

    try {
      const result = await validateProductExternal(productName, barcode);
      setValidationResult(result);
      
      if (onValidationComplete) {
        onValidationComplete(result);
      }

      toast({
        title: result.found ? "Product Found" : "Product Not Found",
        description: result.found 
          ? `Found in ${result.source} with ${result.confidence}% confidence`
          : "Product not found in external databases",
        variant: result.found ? "default" : "destructive"
      });

    } catch (error) {
      console.error('Validation error:', error);
      toast({
        title: "Validation Error",
        description: "Failed to validate product with external sources",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            External Product Validation
          </DialogTitle>
          <DialogDescription>
            Validate product information against external databases and APIs
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <ValidationStatus validationResult={validationResult} loading={loading} />
          <div className="flex gap-2">
            <Button 
              onClick={performValidation} 
              disabled={loading || !productName.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Validate Product
                </>
              )}
            </Button>
            {validationResult?.product?.source === 'nafdac' && (
              <Button variant="outline" asChild>
                <a 
                  href={`https://greenbook.nafdac.gov.ng/search-result?regno=${validationResult.product.registrationNumber}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View on NAFDAC <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
          <Separator />
        </div>

        {validationResult && (
          <div className="space-y-4">
            {validationResult.product && (
              <div className="space-y-3">
                <h4 className="font-medium">Product Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <span className="ml-2 font-medium">{validationResult.product.name}</span>
                  </div>
                  {validationResult.product.brand && (
                    <div>
                      <span className="text-gray-500">Brand:</span>
                      <span className="ml-2">{validationResult.product.brand}</span>
                    </div>
                  )}
                  {validationResult.product.category && (
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <span className="ml-2">{validationResult.product.category}</span>
                    </div>
                  )}
                  {validationResult.product.manufacturer && (
                    <div>
                      <span className="text-gray-500">Manufacturer:</span>
                      <span className="ml-2">{validationResult.product.manufacturer}</span>
                    </div>
                  )}
                </div>

                {validationResult.product.ingredients && validationResult.product.ingredients.length > 0 && (
                  <div>
                    <span className="text-gray-500">Ingredients:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {validationResult.product.ingredients.map((ingredient, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {validationResult.alternatives && validationResult.alternatives.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Alternatives</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {validationResult.alternatives.map((alt, index) => (
                    <div key={index} className="border rounded-md p-3">
                      <div className="font-medium">{alt.name}</div>
                      <div className="text-sm text-gray-500">
                        Confidence: {alt.confidence}%
                      </div>
                      {alt.brand && (
                        <div className="text-sm text-gray-500">
                          Brand: {alt.brand}
                        </div>
                      )}
                      {alt.manufacturer && (
                        <div className="text-sm text-gray-500">
                          Manufacturer: {alt.manufacturer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExternalValidationDialog;
