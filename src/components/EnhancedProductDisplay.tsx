import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  MapPin, 
  Building, 
  FileText, 
  Heart,
  Search,
  ExternalLink,
  Star
} from 'lucide-react';

interface EnhancedProductDisplayProps {
  result: any;
  similarProducts?: any[];
}

const getSourceBadge = (source: string) => {
  const sourceConfigs = {
    'internal': { label: 'Internal DB', color: 'bg-blue-100 text-blue-800' },
    'openfoodfacts': { label: 'Open Food Facts', color: 'bg-green-100 text-green-800' },
    'fda': { label: 'FDA', color: 'bg-red-100 text-red-800' },
    'cosing': { label: 'CosIng (EU)', color: 'bg-purple-100 text-purple-800' },
    'gs1': { label: 'GS1 Global', color: 'bg-orange-100 text-orange-800' },
    'nafdac': { label: 'NAFDAC (Nigeria)', color: 'bg-emerald-100 text-emerald-800' },
    'external': { label: 'External', color: 'bg-gray-100 text-gray-800' }
  };

  const config = sourceConfigs[source as keyof typeof sourceConfigs] || sourceConfigs.external;
  return (
    <Badge className={config.color}>
      {config.label}
    </Badge>
  );
};

const getCertifyingOrganization = (product: any) => {
  if (product.data?.certifyingOrganization) {
    return product.data.certifyingOrganization;
  }
  
  switch (product.source) {
    case 'fda':
      return 'FDA (United States)';
    case 'openfoodfacts':
      return 'Open Food Facts (Global)';
    case 'cosing':
      return 'CosIng (European Union)';
    case 'gs1':
      return 'GS1 Global Registry';
    case 'nafdac':
      return 'NAFDAC (Nigeria)';
    case 'internal':
      return 'Internal Database';
    default:
      return 'External Source';
  }
};

const EnhancedProductDisplay = ({ result, similarProducts = [] }: EnhancedProductDisplayProps) => {
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

  const getCountriesAvailable = (countries: any) => {
    if (Array.isArray(countries)) {
      return countries.join(', ');
    }
    return countries;
  };

  const formatDate = (date: any) => {
    if (date) {
      return new Date(date).toLocaleDateString();
    }
    return 'N/A';
  };

  const renderProductCard = (product: any, index: number) => {
    return (
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
            <p className="text-xs text-gray-600">by {formatValue(product.manufacturer || product.brand)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {product.nutriScore && (
            <Badge className={getNutriScoreColor(product.nutriScore)}>
              {product.nutriScore}
            </Badge>
          )}
          <Badge variant="outline">
            {product.source === 'external' ? 'External' : 'Verified'}
          </Badge>
        </div>
      </div>
    );
  };

  const formatValue = (value: any, fallback = "Not found or Missing") => {
    if (value === null || value === undefined || value === '' || 
        (Array.isArray(value) && value.length === 0)) {
      return fallback;
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value);
  };

  if (!result.isVerified && !productData) {
    return (
      <div className="space-y-6">
        {/* Warning Message for Product Not Found */}
        <Card className="border-2 border-red-200 bg-red-50">
          <CardHeader className="bg-red-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <span className="text-red-800">⚠️ Product Not Verified</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-red-100 p-4 rounded-lg mb-4">
              <p className="text-red-700 font-medium mb-2">
                It seems like the product you're searching for is not Verified, as it cannot be found in our database.
              </p>
              <p className="text-red-600 text-sm">
                Please consider the following verified products with similar names or contents.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Similar Products Suggestions */}
        {similarProducts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-blue-600" />
                Suggested Verified Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {similarProducts.slice(0, 5).map((product: any, index: number) => (
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
                        <p className="text-xs text-gray-600">by {formatValue(product.manufacturer || product.brand)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {product.nutriScore && (
                        <Badge className={getNutriScoreColor(product.nutriScore)}>
                          {product.nutriScore}
                        </Badge>
                      )}
                      <Badge variant="outline">
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
  }

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
              <div className="text-center">
                <img 
                  src={productData?.imageUrl || productData?.image_url || '/placeholder.svg'} 
                  alt={result.productName}
                  className="w-full max-w-xs mx-auto rounded-lg shadow-md"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                <p className="text-xs text-gray-500 mt-2">Product Image</p>
              </div>
              
              {/* Quick Info Badges */}
              <div className="flex flex-wrap gap-2">
                {(productData?.nutri_score || productData?.nutriScore) && (
                  <Badge className={getNutriScoreColor(productData.nutri_score || productData.nutriScore)}>
                    <Award className="h-3 w-3 mr-1" />
                    Nutri-Score {(productData.nutri_score || productData.nutriScore).toUpperCase()}
                  </Badge>
                )}
                {(productData?.category?.name || productData?.category) && (
                  <Badge variant="outline">
                    <Package className="h-3 w-3 mr-1" />
                    {typeof productData.category === 'object' ? productData.category.name : productData.category}
                  </Badge>
                )}
              </div>
            </div>

            {/* Enhanced Product Details */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Product Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product Name:</span>
                    <span className="font-medium text-right">{formatValue(result.productName)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Manufacturer:</span>
                    <span className="font-medium text-right">
                      {formatValue(
                        productData?.manufacturer?.company_name || 
                        productData?.brand || 
                        result.manufacturer ||
                        productData?.labeler_name
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Countries Available:</span>
                    <span className="font-medium text-right">{getCountriesAvailable(productData?.country || productData?.countries)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Manufacturing Date:</span>
                    <span className="font-medium text-right">
                      {formatDate(
                        productData?.manufacturing_date ? 
                          new Date(productData.manufacturing_date).toLocaleDateString() : 
                          null
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date Registered:</span>
                    <span className="font-medium text-right">
                      {formatDate(
                        result.registrationDate !== 'N/A' ? result.registrationDate :
                        productData?.created_at ? new Date(productData.created_at).toLocaleDateString() : null
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date Approved:</span>
                    <span className="font-medium text-right">
                      {formatDate(
                        productData?.updated_at ? 
                          new Date(productData.updated_at).toLocaleDateString() : 
                          null
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Certification Details */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Certification Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration Body:</span>
                    <span className="font-medium text-right">
                      {getCertifyingOrganization(productData)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration Number:</span>
                    <span className="font-medium text-right">
                      {formatValue(
                        result.certificationNumber !== 'N/A' ? result.certificationNumber :
                        productData?.product_ndc ||
                        productData?.code ||
                        productData?.id
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nutri-Score:</span>
                    <span className="font-medium text-right">
                      {formatValue(productData?.nutri_score || productData?.nutriScore)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Certification Status:</span>
                    <span className="font-medium text-right">
                      <Badge variant={productData?.verified ? "default" : "destructive"}>
                        {productData?.verified ? 'Certified' : 'Under Review'}
                      </Badge>
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Product Contents/Ingredients */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Factory className="h-4 w-4" />
                  Contents & Ingredients
                </h4>
                <div className="text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700">
                      {formatValue(
                        productData?.ingredients_text ||
                        productData?.ingredients?.join(', ') ||
                        productData?.active_ingredients?.map((ing: any) => ing.name || ing).join(', ') ||
                        productData?.description
                      )}
                    </p>
                  </div>
                  {productData?.allergens && (
                    <div className="mt-2">
                      <span className="text-gray-600 text-xs">Allergens: </span>
                      <span className="text-red-600 text-xs font-medium">
                        {formatValue(productData.allergens)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              {result.isVerified ? 'Related Products' : 'Verified Alternative Products'}
            </CardTitle>
            {!result.isVerified && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-800">Product Not Verified</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      The product you're searching for cannot be found in our verified databases. 
                      Please consider the following verified alternatives with similar names or contents.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {similarProducts.map((product, index) => renderProductCard(product, index))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* NAFDAC Notice for Nigerian Products */}
      {(result.externalData?.source === 'nafdac' || similarProducts.some(p => p.source === 'nafdac')) && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">NAFDAC Verified Product</p>
                <p className="text-sm text-green-700">
                  This product is registered with the National Agency for Food and Drug Administration and Control (NAFDAC) of Nigeria.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedProductDisplay;
