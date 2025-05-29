
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Package, 
  MapPin, 
  Calendar, 
  Award, 
  Building, 
  Globe,
  Star,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface EnhancedProductDisplayProps {
  result: any;
}

const EnhancedProductDisplay = ({ result }: EnhancedProductDisplayProps) => {
  const isExternal = !!result.externalData;
  const productData = result.externalData || result.product;
  
  const getNutriScoreColor = (score?: string) => {
    switch (score?.toUpperCase()) {
      case 'A': return 'bg-green-600 text-white';
      case 'B': return 'bg-green-400 text-white';
      case 'C': return 'bg-yellow-500 text-white';
      case 'D': return 'bg-orange-500 text-white';
      case 'E': return 'bg-red-600 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Product Card */}
      <Card className={`border-2 ${result.isVerified ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
        <CardHeader className={`${result.isVerified ? 'bg-green-100' : 'bg-yellow-100'} rounded-t-lg`}>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {result.isVerified ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              )}
              <div>
                <h3 className={`text-lg font-bold ${result.isVerified ? 'text-green-800' : 'text-yellow-800'}`}>
                  {result.isVerified ? '✅ Product Verified!' : '⚠️ Product Found with Caution'}
                </h3>
                <p className="text-sm opacity-75">
                  {result.productName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${isExternal ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                {isExternal ? (
                  <>
                    <Globe className="h-3 w-3 mr-1" />
                    External API
                  </>
                ) : (
                  <>
                    <Shield className="h-3 w-3 mr-1" />
                    Internal DB
                  </>
                )}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="space-y-4">
              {productData?.imageUrl && (
                <div className="text-center">
                  <img 
                    src={productData.imageUrl} 
                    alt={result.productName}
                    className="w-full max-w-xs mx-auto rounded-lg shadow-md"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-2">Official Product Image</p>
                </div>
              )}
              
              {/* Quick Info Badges */}
              <div className="flex flex-wrap gap-2">
                {productData?.nutriScore && (
                  <Badge className={getNutriScoreColor(productData.nutriScore)}>
                    <Award className="h-3 w-3 mr-1" />
                    Nutri-Score {productData.nutriScore.toUpperCase()}
                  </Badge>
                )}
                {(productData?.category?.name || productData?.category) && (
                  <Badge variant="outline">
                    <Package className="h-3 w-3 mr-1" />
                    {typeof productData.category === 'object' ? productData.category.name : productData.category}
                  </Badge>
                )}
                {isExternal && productData?.source && (
                  <Badge variant="secondary">
                    Source: {productData.source.toUpperCase()}
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Product Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Manufacturer:</span>
                    <span className="font-medium">{result.manufacturer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration:</span>
                    <span className="font-medium">{result.registrationDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Certification:</span>
                    <span className="font-medium">{result.certificationNumber}</span>
                  </div>
                  {productData?.country && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Origin:</span>
                      <span className="font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {productData.country}
                        {productData.state && `, ${productData.state}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Details for External Products */}
              {isExternal && productData && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    External Database Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    {productData.brand && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Brand:</span>
                        <span className="font-medium">{productData.brand}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data Source:</span>
                      <span className="font-medium">{productData.source?.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Verification Status:</span>
                      <Badge variant={productData.verified ? "default" : "destructive"} className="text-xs">
                        {productData.verified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Filter Context */}
              {result.searchFilters && Object.keys(result.searchFilters).length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Search Context</h4>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(result.searchFilters).map(([key, value]) => 
                      value && (
                        <Badge key={key} variant="outline" className="text-xs">
                          {key}: {Array.isArray(value) ? value.join(', ') : value}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Similar Products */}
      {result.similarProducts && result.similarProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-600" />
              Related Products Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {result.similarProducts.slice(0, 5).map((product: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {product.imageUrl && (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    )}
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-600">by {product.manufacturer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.nutriScore && (
                      <Badge className={getNutriScoreColor(product.nutriScore)} size="sm">
                        {product.nutriScore}
                      </Badge>
                    )}
                    <Badge variant="outline" size="sm">
                      {product.source === 'external' ? 'External' : 'Verified'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedProductDisplay;
