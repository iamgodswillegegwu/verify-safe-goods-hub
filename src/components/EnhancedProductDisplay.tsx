
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Star,
  ExternalLink,
  Package,
  Building,
  Calendar
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  description?: string;
  verified: boolean;
  confidence: number;
  source: string;
  imageUrl?: string;
  barcode?: string;
}

interface EnhancedProductDisplayProps {
  product: Product;
  similarProducts?: Product[];
  onViewDetails?: (product: Product) => void;
}

const EnhancedProductDisplay = ({ 
  product, 
  similarProducts = [], 
  onViewDetails 
}: EnhancedProductDisplayProps) => {
  const getVerificationBadge = (verified: boolean, confidence: number) => {
    if (verified && confidence > 0.8) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      );
    } else if (verified && confidence > 0.6) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Partially Verified
        </Badge>
      );
    }
    return (
      <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" />
        Unverified
      </Badge>
    );
  };

  const getConfidenceStars = (confidence: number) => {
    const stars = Math.round(confidence * 5);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Main Product Card */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                {product.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-4">
                {product.brand && (
                  <span className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {product.brand}
                  </span>
                )}
                {product.barcode && (
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {product.barcode}
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="text-right space-y-2">
              {getVerificationBadge(product.verified, product.confidence)}
              <div className="flex items-center gap-1">
                {getConfidenceStars(product.confidence)}
                <span className="text-sm text-gray-600 ml-1">
                  {Math.round(product.confidence * 100)}%
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.imageUrl && (
              <div className="space-y-2">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>
            )}
            
            <div className="space-y-3">
              {product.category && (
                <div>
                  <h4 className="font-medium text-gray-700">Category</h4>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
              )}
              
              {product.description && (
                <div>
                  <h4 className="font-medium text-gray-700">Description</h4>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-medium text-gray-700">Source</h4>
                <Badge variant="secondary" className="capitalize">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  {product.source}
                </Badge>
              </div>
            </div>
          </div>

          {onViewDetails && (
            <div className="pt-4 border-t">
              <Button onClick={() => onViewDetails(product)} className="w-full">
                View Full Details
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Similar Products</CardTitle>
            <CardDescription>
              Products that might be related to your search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarProducts.slice(0, 6).map((similar) => (
                <Card key={similar.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm line-clamp-2">{similar.name}</h5>
                      <div className="flex items-center justify-between">
                        {getVerificationBadge(similar.verified, similar.confidence)}
                        <div className="flex items-center gap-1">
                          {getConfidenceStars(similar.confidence)}
                        </div>
                      </div>
                      {similar.brand && (
                        <p className="text-xs text-gray-600">{similar.brand}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedProductDisplay;
