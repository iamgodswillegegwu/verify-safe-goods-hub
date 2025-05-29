
// Map internal categories to external API categories
export const getCategoryMapping = (category: string): string => {
  const mappings: Record<string, string> = {
    'Cosmetics': 'cosmetics',
    'Skincare': 'cosmetics',
    'Personal Care': 'personal_care',
    'Hair Care': 'cosmetics',
    'Food Products': 'food',
    'Beverages': 'food',
    'Supplements': 'supplement',
    'Vitamins': 'supplement',
    'Medications': 'medication'
  };
  
  return mappings[category] || 'food';
};
