
import { useState } from 'react';
import { ArrowUpDown, Calendar, Star, MapPin, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export type SortOption = 
  | 'relevance' 
  | 'name_asc' 
  | 'name_desc' 
  | 'date_newest' 
  | 'date_oldest' 
  | 'nutri_score_best' 
  | 'location';

interface SearchSortOptionsProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
}

const SearchSortOptions = ({ sortBy, onSortChange }: SearchSortOptionsProps) => {
  const sortOptions = [
    { value: 'relevance' as SortOption, label: 'Relevance', icon: Star },
    { value: 'name_asc' as SortOption, label: 'Name (A-Z)', icon: ArrowUpDown },
    { value: 'name_desc' as SortOption, label: 'Name (Z-A)', icon: ArrowUpDown },
    { value: 'date_newest' as SortOption, label: 'Newest First', icon: Calendar },
    { value: 'date_oldest' as SortOption, label: 'Oldest First', icon: Calendar },
    { value: 'nutri_score_best' as SortOption, label: 'Best Nutri-Score', icon: Shield },
    { value: 'location' as SortOption, label: 'Location', icon: MapPin },
  ];

  const getCurrentLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortBy);
    return option ? option.label : 'Relevance';
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-600">Sort by:</span>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="bg-white">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {getCurrentLabel()}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg">
          {sortOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={`cursor-pointer hover:bg-gray-50 ${
                  sortBy === option.value ? 'bg-blue-50 text-blue-700' : ''
                }`}
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {option.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SearchSortOptions;
