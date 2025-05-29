
import { useState, useEffect } from 'react';
import { Search, Clock, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { getUserPreferences } from '@/services/recommendationService';

interface SmartSearchSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  className?: string;
}

const SmartSearchSuggestions = ({ onSuggestionClick, className = '' }: SmartSearchSuggestionsProps) => {
  const { user } = useAuth();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState([
    'Organic face cream',
    'Vitamin C serum',
    'Natural shampoo',
    'Protein powder',
    'Sunscreen SPF 50',
    'Green tea extract'
  ]);
  const [categoryBasedSuggestions, setCategoryBasedSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadUserSuggestions();
    }
  }, [user]);

  const loadUserSuggestions = async () => {
    if (!user) return;

    try {
      const preferences = await getUserPreferences(user.id);
      setRecentSearches(preferences.frequentSearches.slice(0, 4));
      
      // Generate category-based suggestions
      const suggestions = preferences.favoriteCategories.map(category => {
        switch (category) {
          case 'Cosmetics':
            return ['Foundation', 'Lipstick', 'Mascara'];
          case 'Skincare':
            return ['Moisturizer', 'Cleanser', 'Toner'];
          case 'Hair Care':
            return ['Conditioner', 'Hair oil', 'Styling gel'];
          case 'Food Products':
            return ['Organic snacks', 'Whole grains', 'Natural juice'];
          case 'Supplements':
            return ['Multivitamin', 'Omega 3', 'Probiotics'];
          default:
            return [];
        }
      }).flat().slice(0, 3);
      
      setCategoryBasedSuggestions(suggestions);
    } catch (error) {
      console.error('Error loading user suggestions:', error);
    }
  };

  return (
    <div className={className}>
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500" />
              Recent Searches
            </h4>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onSuggestionClick(search)}
                  className="text-sm border-slate-200 hover:bg-slate-50"
                >
                  <Search className="h-3 w-3 mr-1" />
                  {search}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category-based Suggestions */}
      {categoryBasedSuggestions.length > 0 && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-purple-500" />
              Based on Your Preferences
            </h4>
            <div className="flex flex-wrap gap-2">
              {categoryBasedSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onSuggestionClick(suggestion)}
                  className="text-sm border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <Star className="h-3 w-3 mr-1" />
                  {suggestion}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trending Searches */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            Trending Searches
            <Badge variant="outline" className="ml-auto text-xs border-green-200 text-green-700">
              Popular
            </Badge>
          </h4>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((search, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onSuggestionClick(search)}
                className="text-sm border-green-200 text-green-700 hover:bg-green-50"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                {search}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartSearchSuggestions;
