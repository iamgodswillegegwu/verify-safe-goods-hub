
import { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Calendar, Shield, Building, ExternalLink, Heart, Flag, MapPin, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { addToFavorites, removeFromFavorites, isProductFavorited, reportProduct } from '@/services/productService';

interface NutriScoreProps {
  score: string;
}

interface VerificationResultProps {
  result: {
    productName: string;
    isVerified: boolean;
    manufacturer: string;
    registrationDate: string;
    certificationNumber: string;
    similarProducts?: Array<{
      name: string;
      manufacturer: string;
      verified?: boolean;
    }>;
    product?: {
      id: string;
      nutri_score?: string;
      country?: string;
      state?: string;
      city?: string;
      allergens?: string[];
      nutrition_facts?: Record<string, string | number>;
    };
  };
}

const NutriScoreBadge = ({ score }: NutriScoreProps) => {
  const getScoreColor = (score: string) => {
    switch (score) {
      case 'A': return 'bg-green-600 text-white';
      case 'B': return 'bg-green-400 text-white';
      case 'C': return 'bg-yellow-500 text-white';
      case 'D': return 'bg-orange-500 text-white';
      case 'E': return 'bg-red-600 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(score)}`}>
      <Award className="h-3 w-3 mr-1" />
      Nutri-Score: {score}
    </div>
  );
};

const EnhancedVerificationResult = ({ result }: VerificationResultProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    productName,
    isVerified,
    manufacturer,
    registrationDate,
    certificationNumber,
    similarProducts = [],
    product
  } = result;

  useEffect(() => {
    if (user && product?.id) {
      checkFavoriteStatus();
    }
  }, [user, product?.id]);

  const checkFavoriteStatus = async () => {
    if (user && product?.id) {
      try {
        const favorited = await isProductFavorited(user.id, product.id);
        setIsFavorited(favorited);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user || !product?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add products to favorites.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorited) {
        await removeFromFavorites(user.id, product.id);
        setIsFavorited(false);
        toast({
          title: "Removed from Favorites",
          description: "Product removed from your favorites.",
        });
      } else {
        await addToFavorites(user.id, product.id);
        setIsFavorited(true);
        toast({
          title: "Added to Favorites",
          description: "Product added to your favorites.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportProduct = async () => {
    if (!user || !product?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to report products.",
        variant: "destructive"
      });
      return;
    }

    try {
      await reportProduct(user.id, product.id, "suspicious", "User reported suspicious product");
      toast({
        title: "Product Reported",
        description: "Thank you for reporting. We'll investigate this product.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to report product. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className={`border-2 ${isVerified ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
      <CardHeader className={`${isVerified ? 'bg-green-100' : 'bg-orange-100'} rounded-t-lg`}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isVerified ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            )}
            <span className={isVerified ? 'text-green-800' : 'text-orange-800'}>
              {isVerified ? 'Product Verified ✓' : 'Product Not Verified ⚠️'}
            </span>
          </div>
          
          {product && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFavoriteToggle}
                disabled={isLoading}
                className={isFavorited ? 'bg-red-50 border-red-200 text-red-600' : 'bg-gray-50 border-gray-200'}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReportProduct}
                className="bg-gray-50 border-gray-200 text-gray-600"
              >
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Product Details */}
        <div>
          <h3 className="font-semibold text-lg text-slate-800 mb-3">{productName}</h3>
          
          {isVerified && product && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified Safe
                </Badge>
                
                {product.nutri_score && (
                  <NutriScoreBadge score={product.nutri_score} />
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600">Manufacturer:</span>
                  <span className="font-medium">{manufacturer}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600">Registered:</span>
                  <span className="font-medium">{new Date(registrationDate).toLocaleDateString()}</span>
                </div>
                
                {product.country && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-600">Origin:</span>
                    <span className="font-medium">{product.city}, {product.state}, {product.country}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 md:col-span-2">
                  <Shield className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600">Certificate:</span>
                  <span className="font-medium">{certificationNumber}</span>
                </div>
              </div>

              {/* Allergens */}
              {product.allergens && product.allergens.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">⚠️ Allergens</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.allergens.map((allergen, index) => (
                      <Badge key={index} variant="outline" className="border-orange-300 text-orange-700 bg-orange-50">
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Nutrition Facts */}
              {product.nutrition_facts && (
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">📊 Nutrition Facts (per serving)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-3 rounded-lg border">
                    {Object.entries(product.nutrition_facts).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-xs text-slate-500 capitalize">{key}</div>
                        <div className="font-semibold text-slate-700">{String(value)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-green-100 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">🎉 Congratulations!</h4>
                <p className="text-green-700 text-sm">
                  This product has been verified as authentic and safe for consumption. 
                  It meets all regulatory standards and is registered with authorized manufacturers.
                </p>
              </div>
            </div>
          )}

          {!isVerified && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-orange-300 text-orange-700 bg-orange-50">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Not Verified
                </Badge>
              </div>

              <div className="bg-orange-100 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">⚠️ Warning</h4>
                <p className="text-orange-700 text-sm mb-3">
                  This product was not found in our verified database or has different manufacturer information 
                  than registered. Please exercise caution before use.
                </p>
                <p className="text-orange-600 text-xs">
                  Consider contacting the manufacturer directly or consulting with relevant authorities.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Similar/Recommended Products */}
        {similarProducts.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                {isVerified ? 'Related Products' : 'Recommended Verified Alternatives'}
              </h4>
              
              <div className="space-y-2">
                {similarProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                    <div>
                      <p className="font-medium text-slate-800">{product.name}</p>
                      <p className="text-sm text-slate-600">{product.manufacturer}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {product.verified && (
                        <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
            Share Result
          </Button>
          <Button variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-50 flex-1">
            Save Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedVerificationResult;
