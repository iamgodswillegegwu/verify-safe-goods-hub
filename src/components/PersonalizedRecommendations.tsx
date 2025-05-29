
import { useState, useEffect } from 'react';
import { Star, TrendingUp, Heart, ShoppingCart, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { getPersonalizedRecommendations, RecommendationScore } from '@/services/recommendationService';
import { addToFavorites, isProductFavorited } from '@/services/productService';
import { useToast } from '@/components/ui/use-toast';

interface PersonalizedRecommendationsProps {
  className?: string;
  limit?: number;
}

const PersonalizedRecommendations = ({ className = '', limit = 5 }: PersonalizedRecommendationsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<RecommendationScore[]>([]);
  const [favoriteStates, setFavoriteStates] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user, limit]);

  const loadRecommendations = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const recs = await getPersonalizedRecommendations(user.id, limit);
      setRecommendations(recs);

      // Check favorite status for each recommendation
      const favoriteChecks = await Promise.all(
        recs.map(async (rec) => {
          const isFav = await isProductFavorited(user.id, rec.product.id);
          return { id: rec.product.id, isFavorited: isFav };
        })
      );

      const favoriteMap = favoriteChecks.reduce((acc, { id, isFavorited }) => {
        acc[id] = isFavorited;
        return acc;
      }, {} as Record<string, boolean>);

      setFavoriteStates(favoriteMap);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteToggle = async (productId: string) => {
    if (!user) return;

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

  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-slate-600">Sign in to get personalized recommendations</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 text-center">
            Start verifying and favoriting products to get personalized recommendations!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Recommended For You
          <Badge variant="outline" className="ml-auto">
            <TrendingUp className="h-3 w-3 mr-1" />
            Personalized
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={rec.product.id}
              className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-800 truncate">
                      {rec.product.name}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {rec.product.manufacturer?.company_name}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-2">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-purple-600">
                        {rec.score} pts
                      </div>
                      {rec.product.nutri_score && (
                        <Badge 
                          variant="outline" 
                          className="text-xs border-green-300 text-green-700"
                        >
                          {rec.product.nutri_score}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {rec.reasons.slice(0, 2).map((reason, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary" 
                        className="text-xs bg-purple-100 text-purple-700"
                      >
                        {reason}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleFavoriteToggle(rec.product.id)}
                    disabled={favoriteStates[rec.product.id]}
                    className="text-xs"
                  >
                    <Heart 
                      className={`h-3 w-3 mr-1 ${favoriteStates[rec.product.id] ? 'fill-current text-red-500' : ''}`} 
                    />
                    {favoriteStates[rec.product.id] ? 'Favorited' : 'Add to Favorites'}
                  </Button>
                  
                  <Button size="sm" className="text-xs bg-purple-600 hover:bg-purple-700">
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedRecommendations;
