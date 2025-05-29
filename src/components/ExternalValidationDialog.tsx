
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { getEnhancedValidation } from '@/services/search/enhancedValidationService';

interface ExternalValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  barcode: string;
}

const ExternalValidationDialog = ({ 
  open, 
  onOpenChange, 
  productName, 
  barcode 
}: ExternalValidationDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  useEffect(() => {
    if (open && barcode) {
      performValidation();
    }
  }, [open, barcode]);

  const performValidation = async () => {
    setLoading(true);
    try {
      const result = await getEnhancedValidation({
        barcode,
        productName
      });
      setValidationResult(result);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>External Validation</DialogTitle>
          <DialogDescription>
            Validating "{productName}" against external databases
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-600">Validating product...</p>
            </div>
          ) : validationResult ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Overall Status</span>
                <Badge variant={validationResult.isValid ? "default" : "destructive"}>
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
                <Progress value={validationResult.confidence * 100} className="h-2" />
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Validation Sources</h4>
                {validationResult.sources.map((source: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(source.verified, source.confidence)}
                      <span className="text-sm">{source.name}</span>
                    </div>
                    <Badge variant="outline">
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
            </div>
          ) : null}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Close
            </Button>
            {!loading && (
              <Button onClick={performValidation} className="flex-1">
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
