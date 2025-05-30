
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Globe, Package, AlertTriangle, CheckCircle, Building, Calendar, FileText, Factory, MapPin, Award } from 'lucide-react';
import EnhancedVerificationResult from '../EnhancedVerificationResult';
import { ValidationResult } from '@/services/externalApiService';

interface ResultsSectionProps {
  verificationResult: any;
  externalResult: ValidationResult | null;
}

const getCertificationBody = (source?: string) => {
  switch (source?.toLowerCase()) {
    case 'nafdac': return 'NAFDAC';
    case 'openfoodfacts': return 'Open Food Facts';
    case 'fda': return 'FDA';
    default: return 'Regulatory Authority';
  }
};

const NutriScoreBadge = ({ score }: { score: string }) => {
  const getScoreColor = (score: string) => {
    switch (score) {
      case 'A': return 'bg-green-600';
      case 'B': return 'bg-green-400';
      case 'C': return 'bg-yellow-500';
      case 'D': return 'bg-orange-500';
      case 'E': return 'bg-red-600';
      default: return 'bg-gray-400';
    }
  };

  return (
    <Badge className={`${getScoreColor(score)} text-white`}>
      <Award className="h-3 w-3 mr-1" />
      Nutri-Score: {score}
    </Badge>
  );
};

const ExternalProductDetails = ({ product, source }: { product: any; source: string }) => {
  const certificationBody = getCertificationBody(source);

  return (
    <div className="space-y-4">
      {/* Product Image and Basic Info */}
      <div className="flex items-start gap-4">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-20 h-20 object-cover rounded"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
        )}
        
        <div className="flex-1">
          <h4 className="font-medium text-lg">{product.name}</h4>
          {product.description && (
            <p className="text-sm text-slate-600 mt-1">{product.description}</p>
          )}
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {product.nutriScore && <NutriScoreBadge score={product.nutriScore} />}
            <Badge variant="outline" className="text-xs font-normal">
              Source: {source.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="text-xs font-normal">
              Category: {product.category || 'Unknown'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Detailed Information Grid */}
      <div className="grid md:grid-cols-2 gap-3 text-sm bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-slate-500" />
          <span className="text-slate-600">Manufacturer:</span>
          <span className="font-medium">{product.brand || 'Unknown'}</span>
        </div>
        
        {product.barcode && (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-500" />
            <span className="text-slate-600">Product ID/Barcode:</span>
            <span className="font-medium">{product.barcode}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-500" />
          <span className="text-slate-600">Date Registered:</span>
          <span className="font-medium">External Database</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Factory className="h-4 w-4 text-slate-500" />
          <span className="text-slate-600">Certification Body:</span>
          <span className="font-medium">{certificationBody}</span>
        </div>
        
        {product.country && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-500" />
            <span className="text-slate-600">Origin:</span>
            <span className="font-medium">{product.country}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-slate-500" />
          <span className="text-slate-600">Verification Status:</span>
          <span className={`font-medium ${product.verified ? 'text-green-600' : 'text-orange-600'}`}>
            {product.verified ? 'Verified' : 'Unverified'}
          </span>
        </div>
      </div>

      {/* Additional product information */}
      {product.ingredients && (
        <div>
          <h5 className="font-semibold text-slate-700 mb-2">🧪 Ingredients</h5>
          <p className="text-sm text-slate-600 bg-white p-3 rounded border">
            {product.ingredients}
          </p>
        </div>
      )}

      {product.nutritionFacts && (
        <div>
          <h5 className="font-semibold text-slate-700 mb-2">📊 Nutrition Facts</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-3 rounded border">
            {Object.entries(product.nutritionFacts).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-xs text-slate-500 capitalize">{key}</div>
                <div className="font-semibold text-slate-700">{String(value)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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
                <ExternalProductDetails 
                  product={externalResult.product} 
                  source={externalResult.source}
                />
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
