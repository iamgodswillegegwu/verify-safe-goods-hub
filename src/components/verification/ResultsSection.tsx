
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Globe, Image, AlertTriangle, CheckCircle } from 'lucide-react';
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
                    (externalResult.verified ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        <span>Verified ✓</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        <span>Found - Issues ⚠️</span>
                      </div>
                    )) : (
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        <span>Not Found ❌</span>
                      </div>
                    )
                  }
                </span>
                <Badge variant="outline" className="text-xs">
                  {Math.round(externalResult.confidence * 100)}% confidence
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {externalResult.product ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    {externalResult.product.imageUrl ? (
                      <img 
                        src={externalResult.product.imageUrl} 
                        alt={externalResult.product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                        <Image className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <p className="font-medium">{externalResult.product.name}</p>
                      {externalResult.product.brand && (
                        <p className="text-sm text-slate-600">Brand: {externalResult.product.brand}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs font-normal">
                          Source: {externalResult.source.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-normal">
                          Category: {externalResult.product.category || 'Unknown'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {externalResult.product.nutriScore && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Nutri-Score:</span>
                      <Badge className={
                        externalResult.product.nutriScore === 'A' ? 'bg-green-600' : 
                        externalResult.product.nutriScore === 'B' ? 'bg-green-500' : 
                        externalResult.product.nutriScore === 'C' ? 'bg-yellow-500' : 
                        externalResult.product.nutriScore === 'D' ? 'bg-orange-500' : 
                        'bg-red-600'
                      }>
                        {externalResult.product.nutriScore}
                      </Badge>
                    </div>
                  )}
                  
                  {externalResult.product.barcode && (
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">Barcode/ID:</span> {externalResult.product.barcode}
                    </div>
                  )}
                  
                  {externalResult.product.description && (
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">Description:</span> {externalResult.product.description}
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-slate-600">No external data available</p>
                  <p className="text-sm text-slate-500 mt-1">Try searching with a more specific term</p>
                </div>
              )}
              
              {/* Sources Section */}
              {externalResult.sources && externalResult.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium mb-2">Sources Checked:</h4>
                  <div className="space-y-2">
                    {externalResult.sources.map((source, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">{source.name}</span>
                        <Badge variant="outline" className={
                          source.status === 'success' ? 'text-green-600 bg-green-50' : 
                          source.status === 'error' ? 'text-red-600 bg-red-50' : 
                          'text-gray-600 bg-gray-50'
                        }>
                          {source.status === 'success' ? 
                            (source.verified ? 'Verified' : 'Found') : 
                            source.status === 'error' ? 'Error' : 'Pending'
                          }
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ResultsSection;
