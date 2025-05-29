
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { validateProductAcrossSources } from '@/services/apiAggregationService';
import type { ValidationSource } from '@/services/externalApiService';

interface ExternalValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  barcode?: string;
}

const ExternalValidationDialog = ({ 
  open, 
  onOpenChange, 
  productName, 
  barcode 
}: ExternalValidationDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState<ValidationSource[]>([]);

  const handleValidate = async () => {
    setLoading(true);
    try {
      const results = await validateProductAcrossSources(productName, barcode);
      setSources(results);
      
      const verifiedCount = results.filter(r => r.verified).length;
      toast({
        title: "Validation Complete",
        description: `Product verified across ${verifiedCount} of ${results.length} sources.`
      });
    } catch (error) {
      toast({
        title: "Validation Failed",
        description: "Failed to validate product across external sources.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Loader2 className="h-4 w-4 animate-spin" />;
    }
  };

  const getStatusBadge = (verified: boolean, confidence: number) => {
    if (verified && confidence > 0.8) {
      return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
    } else if (verified && confidence > 0.6) {
      return <Badge className="bg-blue-100 text-blue-800">Likely Genuine</Badge>;
    } else if (confidence > 0.4) {
      return <Badge variant="secondary">Uncertain</Badge>;
    } else {
      return <Badge variant="destructive">Not Found</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            External Validation
          </DialogTitle>
          <DialogDescription>
            Validate "{productName}" across multiple external databases and regulatory sources.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {sources.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                Click "Start Validation" to check this product across external sources.
              </p>
              <Button onClick={handleValidate} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  'Start Validation'
                )}
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-3">
                {sources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(source.status)}
                      <div>
                        <div className="font-medium">{source.name}</div>
                        <div className="text-sm text-gray-500">
                          Confidence: {Math.round(source.confidence * 100)}%
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(source.verified, source.confidence)}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleValidate} disabled={loading} variant="outline">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Re-validating...
                    </>
                  ) : (
                    'Re-validate'
                  )}
                </Button>
                <Button onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExternalValidationDialog;
