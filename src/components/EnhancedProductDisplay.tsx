import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ExternalLink, 
  Heart, 
  Share2, 
  ShoppingCart,
  MapPin,
  Calendar,
  User,
  Package,
  FileText,
  Search as SearchIcon
} from 'lucide-react';

interface EnhancedProductDisplayProps {
  product: any;
  verificationResult: any;
  onAddToFavorites: (product: any) => void;
}

interface VerificationStatusProps {
  verified: boolean;
  confidence: number;
  source: string;
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({ verified, confidence, source }) => {
  if (verified) {
    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-500">
        <CheckCircle className="h-4 w-4 mr-2" />
        Verified ({confidence}%) - {source}
      </Badge>
    );
  } else {
    return (
      <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-500">
        <XCircle className="h-4 w-4 mr-2" />
        Not Verified
      </Badge>
    );
  }
};

const EnhancedProductDisplay = ({ product, verificationResult, onAddToFavorites }: EnhancedProductDisplayProps) => {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Check if the product is already in favorites (example logic)
    // You might want to use local storage or a context to manage favorites
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.some((fav: any) => fav.id === product.id));
  }, [product.id]);

  const handleAddToFavorites = () => {
    onAddToFavorites(product);
    setIsFavorite(true);
    toast({
      title: "Added to Favorites",
      description: `${product.name} has been added to your favorites.`,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this product: ${product.name}`,
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.error('Error sharing', error));
    } else {
      toast({
        title: "Sharing Not Supported",
        description: "Web Share API is not supported in your browser.",
        variant: "warning"
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
        <CardDescription>
          {product.description || 'No description available.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {verificationResult && (
          <VerificationStatus
            verified={verificationResult.verified}
            confidence={verificationResult.confidence}
            source={verificationResult.source}
          />
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500">Brand:</span>
                  <span className="ml-2 font-medium">{product.brand || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Category:</span>
                  <span className="ml-2">{product.category || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Manufacturer:</span>
                  <span className="ml-2">{product.manufacturer || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Country:</span>
                  <span className="ml-2">{product.country || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Date Added:</span>
                  <span className="ml-2">
                    <Calendar className="h-4 w-4 mr-1 inline-block" />
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Added By:</span>
                  <span className="ml-2">
                    <User className="h-4 w-4 mr-1 inline-block" />
                    Admin
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Location:</span>
                  <span className="ml-2">
                    <MapPin className="h-4 w-4 mr-1 inline-block" />
                    {product.location || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Additional Information
              </h3>
              <p className="text-sm text-gray-600">
                {product.additionalInfo || 'No additional information available.'}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="verification" className="space-y-4">
            {/* Verification Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Verification Status</h4>
                {verificationResult ? (
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-2 font-medium">
                        {verificationResult.verified ? 'Verified' : 'Not Verified'}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500">Confidence:</span>
                      <span className="ml-2">{verificationResult.confidence}%</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500">Source:</span>
                      <span className="ml-2">{verificationResult.source}</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No verification data available.</p>
                )}
              </div>
              <div>
                <h4 className="font-medium">Product Identifiers</h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-gray-500">Product ID:</span>
                    <span className="ml-2">{product.id || 'N/A'}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Barcode:</span>
                    <span className="ml-2">{product.barcode || 'N/A'}</span>
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Data Sources
              </h3>
              
              {verificationResult?.sources?.map((source, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{source}</div>
                      <div className="text-sm text-gray-500">External validation source</div>
                    </div>
                    <Badge variant="outline">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <SearchIcon className="h-5 w-5" />
                Related Products
              </h3>
              
              {verificationResult?.alternatives?.slice(0, 3).map((alt, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{alt.name}</div>
                      <div className="text-sm text-gray-500">
                        {alt.confidence}% match
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          {!isFavorite ? (
            <Button
              onClick={handleAddToFavorites}
            >
              <Heart className="h-4 w-4 mr-2" />
              Add to Favorites
            </Button>
          ) : (
            <Button variant="secondary" disabled>
              <CheckCircle className="h-4 w-4 mr-2" />
              In Favorites
            </Button>
          )}
          <Button variant="outline">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedProductDisplay;
