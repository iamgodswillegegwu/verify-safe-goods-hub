
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Globe } from 'lucide-react';
import EnhancedVerificationResult from '../EnhancedVerificationResult';
import { ValidationResult } from '@/services/externalApiService';

interface ResultsSectionProps {
  verificationResult: any;
  externalResult: ValidationResult | null;
}

const ResultsSection = ({ verificationResult, externalResult }: ResultsSectionProps) => {
  if (!verificationResult && !externalResult) {
    return null;
  }

  return (
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
  );
};

export default ResultsSection;
