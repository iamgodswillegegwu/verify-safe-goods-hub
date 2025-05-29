
import { useState } from 'react';
import { Star, Heart, MapPin, Calendar, Shield, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { addToFavorites, isProductFavorited } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';

interface SearchResultsListProps {
  products: Product[];
  isLoading: boolean;
  onProductSelect?: (product: Product) => void;
}

const SearchResultsList = ({ products, isLoading, onProductSelect }: SearchResultsListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favoriteStates, setFavoriteStates] = useState<Record<string, boolean>>({});

  const handleFavoriteToggle = async (productId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add products to favorites.",
        variant: "destructive"
      });
      return;
    }

    try {
      const isFavorited = favoriteStates[productId];
      
      if (!isFavorited) {
        await addToFavorites(user.id, productId);
        setFavoriteStates(prev => ({ ...prev, [productId]: true }));
        toast({
          title: "Added to Favorites",
          description: "Product added to your favorites.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to favorites. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getNutriScoreColor = (score?: string) => {
    switch (score) {
      case 'A': return 'bg-green-600 text-white';
      case 'B': return 'bg-green-400 text-white';
      case 'C': return 'bg-yellow-500 text-white';
      case 'D': return 'bg-orange-500 text-white';
      case 'E': return 'bg-red-600 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2 mb-4"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-slate-200 rounded w-16"></div>
                <div className="h-6 bg-slate-200 rounded w-20"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">No products found</h3>
          <p className="text-slate-500">Try adjusting your search filters or search terms.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-700">
          Search Results ({products.length})
        </h3>
      </div>
      
      {products.map((product) => (
        <Card 
          key={product.id} 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onProductSelect?.(product)}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 mb-1">
                      {product.name}
                    </h4>
                    <p className="text-sm text-slate-600 mb-2">
                      by {product.manufacturer?.company_name || 'Unknown Manufacturer'}
                    </p>
                    <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    {product.nutri_score && (
                      <Badge className={getNutriScoreColor(product.nutri_score)}>
                        Nutri-Score {product.nutri_score}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {product.category && (
                    <Badge variant="secondary" className="text-xs">
                      {product.category.name}
                    </Badge>
                  )}
                  {product.country && (
                    <Badge variant="outline" className="text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      {product.country}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    Expires {new Date(product.expiry_date).toLocaleDateString()}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavoriteToggle(product.id);
                    }}
                    disabled={favoriteStates[product.id]}
                    className="text-xs"
                  >
                    <Heart 
                      className={`h-3 w-3 mr-1 ${favoriteStates[product.id] ? 'fill-current text-red-500' : ''}`} 
                    />
                    {favoriteStates[product.id] ? 'Favorited' : 'Add to Favorites'}
                  </Button>
                  
                  <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SearchResultsList;
