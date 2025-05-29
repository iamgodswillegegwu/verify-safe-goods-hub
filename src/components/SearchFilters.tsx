
import { useState, useEffect } from 'react';
import { Filter, MapPin, Tag, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';

interface SearchFiltersProps {
  onFiltersChange: (filters: any) => void;
  currentFilters: any;
}

const SearchFilters = ({ onFiltersChange, currentFilters }: SearchFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);

  const nutriScoreOptions = ['A', 'B', 'C', 'D', 'E'];

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    // Fetch categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (categoriesData) {
      setCategories(categoriesData);
    }

    // Fetch unique countries and states from products
    const { data: productsData } = await supabase
      .from('products')
      .select('country, state')
      .eq('status', 'approved')
      .not('country', 'is', null);

    if (productsData) {
      const uniqueCountries = [...new Set(productsData.map(p => p.country).filter(Boolean))];
      const uniqueStates = [...new Set(productsData.map(p => p.state).filter(Boolean))];
      setCountries(uniqueCountries);
      setStates(uniqueStates);
    }
  };

  const updateFilters = (key: string, value: any) => {
    const newFilters = { ...currentFilters, [key]: value };
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const getActiveFiltersCount = () => {
    return Object.values(currentFilters).filter(value => 
      Array.isArray(value) ? value.length > 0 : value
    ).length;
  };

  return (
    <Card className="mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-600" />
                <span>Search Filters</span>
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {getActiveFiltersCount()} active
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm">
                {isOpen ? 'Hide' : 'Show'} Filters
              </Button>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Category Filter */}
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-slate-700 mb-3">
                <Tag className="h-4 w-4" />
                Category
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={currentFilters.category === category.name}
                      onCheckedChange={(checked) => {
                        updateFilters('category', checked ? category.name : undefined);
                      }}
                    />
                    <label 
                      htmlFor={`category-${category.id}`}
                      className="text-sm text-slate-600 cursor-pointer"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutri-Score Filter */}
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-slate-700 mb-3">
                <Award className="h-4 w-4" />
                Nutri-Score
              </h4>
              <div className="flex gap-2">
                {nutriScoreOptions.map((score) => {
                  const isSelected = currentFilters.nutriScore?.includes(score);
                  const getScoreColor = (score: string) => {
                    switch (score) {
                      case 'A': return 'bg-green-600 text-white hover:bg-green-700';
                      case 'B': return 'bg-green-400 text-white hover:bg-green-500';
                      case 'C': return 'bg-yellow-500 text-white hover:bg-yellow-600';
                      case 'D': return 'bg-orange-500 text-white hover:bg-orange-600';
                      case 'E': return 'bg-red-600 text-white hover:bg-red-700';
                      default: return 'bg-gray-400 text-white hover:bg-gray-500';
                    }
                  };

                  return (
                    <Button
                      key={score}
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                      className={isSelected ? getScoreColor(score) : "border-gray-300"}
                      onClick={() => {
                        const currentScores = currentFilters.nutriScore || [];
                        const newScores = isSelected
                          ? currentScores.filter((s: string) => s !== score)
                          : [...currentScores, score];
                        updateFilters('nutriScore', newScores.length > 0 ? newScores : undefined);
                      }}
                    >
                      {score}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Geographic Filter */}
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-slate-700 mb-3">
                <MapPin className="h-4 w-4" />
                Location
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Country</label>
                  <select
                    value={currentFilters.country || ''}
                    onChange={(e) => updateFilters('country', e.target.value || undefined)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Countries</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">State</label>
                  <select
                    value={currentFilters.state || ''}
                    onChange={(e) => updateFilters('state', e.target.value || undefined)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All States</option>
                    {states.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {getActiveFiltersCount() > 0 && (
              <div className="flex justify-end pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="text-slate-600 border-slate-300"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default SearchFilters;
