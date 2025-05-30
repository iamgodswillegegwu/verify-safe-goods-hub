
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { getEnhancedValidation } from '@/services/search/enhancedValidationService';

interface ExternalValidationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  barcode: string;
}

const ExternalValidationDialog = ({ 
  isOpen, 
  onClose, 
  productName, 
  barcode 
}: ExternalValidationDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  useEffect(() => {
    if (isOpen && (barcode || productName)) {
      performValidation();
    }
  }, [isOpen, barcode, productName]);

  const performValidation = async () => {
    setLoading(true);
    try {
      const searchTerm = barcode || productName;
      console.log('Performing enhanced validation for:', searchTerm);
      
      const result = await getEnhancedValidation({
        barcode: barcode || '',
        productName: productName || '',
        category: detectCategory(productName)
      });
      
      console.log('Enhanced validation result:', result);
      setValidationResult(result);
    } catch (error) {
      console.error('Validation failed:', error);
      // Provide fallback result even on error
      setValidationResult({
        isValid: false,
        confidence: 0.1,
        sources: [{
          name: 'SYSTEM',
          status: 'error',
          verified: false,
          confidence: 0
        }],
        recommendations: ['Unable to validate product due to a system error.']
      });
    } finally {
      setLoading(false);
    }
  };

  const detectCategory = (name: string = ''): string | undefined => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('cream') || lowerName.includes('lotion') || 
        lowerName.includes('skin') || lowerName.includes('face')) {
      return 'Cosmetics';
    } else if (lowerName.includes('vitamin') || lowerName.includes('supplement')) {
      return 'Supplements';
    } else if (lowerName.includes('food') || lowerName.includes('drink')) {
      return 'Food Products';
    }
    
    return undefined;
  };

  const getStatusIcon = (verified: boolean, confidence: number) => {
    if (verified && confidence > 0.8) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else if (verified && confidence > 0.6) {
      return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    }
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>External Validation</DialogTitle>
          <DialogDescription>
            Validating "{productName || barcode}" against external databases
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-sm text-gray-600">
                Validating product across multiple data sources...
              </p>
              <p className="text-xs text-gray-500 mt-2">
                This may take a few moments
              </p>
            </div>
          ) : validationResult ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Overall Status</span>
                <Badge variant={validationResult.isValid ? "default" : "destructive"} className={validationResult.isValid ? "bg-green-600" : ""}>
                  {validationResult.isValid ? "Valid" : "Invalid"}
                </Badge>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Confidence Score</span>
                  <span className="text-sm font-medium">
                    {Math.round(validationResult.confidence * 100)}%
                  </span>
                </div>
                <Progress 
                  value={validationResult.confidence * 100} 
                  className={`h-2 ${
                    validationResult.confidence > 0.8 ? 'bg-green-100' : 
                    validationResult.confidence > 0.5 ? 'bg-yellow-100' : 'bg-red-100'
                  }`}
                />
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Validation Sources</h4>
                {validationResult.sources?.map((source: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(source.verified, source.confidence)}
                      <span className="text-sm">{source.name}</span>
                    </div>
                    <Badge variant="outline" className={
                      source.verified ? 
                        (source.confidence > 0.8 ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700") : 
                        "bg-red-50 text-red-700"
                    }>
                      {Math.round(source.confidence * 100)}%
                    </Badge>
                  </div>
                ))}
              </div>

              {validationResult.recommendations && (
                <div className="space-y-2">
                  <h4 className="font-medium">Recommendations</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {validationResult.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {validationResult.product && (
                <div className="space-y-2 bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium">Product Details</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Name:</strong> {validationResult.product.name}</p>
                    {validationResult.product.brand && (
                      <p><strong>Brand:</strong> {validationResult.product.brand}</p>
                    )}
                    {validationResult.product.category && (
                      <p><strong>Category:</strong> {validationResult.product.category}</p>
                    )}
                    {validationResult.product.nutriScore && (
                      <p>
                        <strong>Nutri-Score:</strong> 
                        <Badge className="ml-2" variant={
                          validationResult.product.nutriScore === 'A' ? 'default' :
                          validationResult.product.nutriScore === 'B' ? 'secondary' :
                          validationResult.product.nutriScore === 'C' ? 'outline' :
                          validationResult.product.nutriScore === 'D' ? 'destructive' : 'destructive'
                        }>
                          {validationResult.product.nutriScore}
                        </Badge>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
            {!loading && (
              <Button onClick={performValidation} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Revalidate
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExternalValidationDialog;
