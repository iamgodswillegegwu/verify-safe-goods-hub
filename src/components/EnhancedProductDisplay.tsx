
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Heart, Share2, ShieldCheck, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { ExternalProduct } from '@/services/externalApiService';

interface EnhancedProductDisplayProps {
  products: ExternalProduct[];
  searchQuery: string;
}

const EnhancedProductDisplay = ({ products, searchQuery }: EnhancedProductDisplayProps) => {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleAddToFavorites = (productId: string) => {
    setFavorites(prev => new Set([...prev, productId]));
    toast({
      title: "Added to Favorites",
      description: "Product has been added to your favorites list.",
    });
  };

  const handleShare = async (product: ExternalProduct) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this product: ${product.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Product link copied to clipboard.",
      });
    }
  };

  const getVerificationIcon = (verified: boolean, confidence: number) => {
    if (verified && confidence > 0.8) {
      return <ShieldCheck className="h-4 w-4 text-green-600" />;
    } else if (verified && confidence > 0.6) {
      return <CheckCircle className="h-4 w-4 text-blue-600" />;
    } else if (confidence > 0.4) {
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getVerificationBadge = (verified: boolean, confidence: number) => {
    if (verified && confidence > 0.8) {
      return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
    } else if (verified && confidence > 0.6) {
      return <Badge className="bg-blue-100 text-blue-800">Likely Genuine</Badge>;
    } else if (confidence > 0.4) {
      return <Badge variant="secondary">Uncertain</Badge>;
    } else {
      return <Badge variant="destructive">High Risk</Badge>;
    }
  };

  const getRiskAlert = (verified: boolean, confidence: number) => {
    if (!verified && confidence < 0.4) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">High Risk Product</span>
          </div>
          <p className="text-sm text-red-700 mt-1">
            This product could not be verified and may be counterfeit. Exercise caution before purchase.
          </p>
        </div>
      );
    } else if (confidence < 0.6) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <Info className="h-4 w-4" />
            <span className="font-medium">Verification Incomplete</span>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            Some verification checks are pending. Check back later for complete results.
          </p>
        </div>
      );
    }
    return null;
  };

  if (!products || products.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No products found for "{searchQuery}"</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  {product.name}
                  {getVerificationIcon(product.verified, product.confidence)}
                </CardTitle>
                <CardDescription className="mt-1">
                  {product.brand && <span className="font-medium">{product.brand}</span>}
                  {product.category && <span className="text-gray-500"> • {product.category}</span>}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {getVerificationBadge(product.verified, product.confidence)}
                <Badge variant="outline" className="text-xs">
                  {Math.round(product.confidence * 100)}% confidence
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {product.description && (
              <p className="text-gray-600 mb-4">{product.description}</p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Source: {product.source.toUpperCase()}
                </Badge>
                {product.barcode && (
                  <Badge variant="outline" className="text-xs">
                    {product.barcode}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddToFavorites(product.id)}
                  disabled={favorites.has(product.id)}
                >
                  <Heart className={`h-4 w-4 ${favorites.has(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare(product)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {getRiskAlert(product.verified, product.confidence)}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EnhancedProductDisplay;
