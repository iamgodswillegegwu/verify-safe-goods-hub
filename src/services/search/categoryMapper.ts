
// Enhanced category mapping for API integration
// Maps UI categories to API-specific category terms

export const getCategoryMapping = (category: string): string => {
  // Standardize input
  const normalizedCategory = category.toLowerCase().trim();
  
  const mappings: Record<string, string> = {
    'cosmetics': 'cosmetics',
    'skincare': 'cosmetics',
    'skin care': 'cosmetics',
    'personal care': 'personal_care',
    'hair care': 'cosmetics',
    'beauty': 'cosmetics',
    'makeup': 'cosmetics',
    'food products': 'food',
    'food': 'food',
    'beverages': 'food',
    'drinks': 'food',
    'supplements': 'supplement',
    'vitamins': 'supplement',
    'medications': 'medication',
    'drugs': 'medication',
    'pharmaceutical': 'medication'
  };
  
  // Find the matching category
  for (const [key, value] of Object.entries(mappings)) {
    if (normalizedCategory.includes(key)) {
      return value;
    }
  }
  
  // Default to food as most common
  return 'food';
};

// Get API provider by category
export const getAPIProviderByCategory = (category: string): string => {
  const categoryCode = getCategoryMapping(category);
  
  switch (categoryCode) {
    case 'cosmetics':
      return 'CosIng';
    case 'personal_care':
      return 'CosIng';
    case 'food':
      return 'OpenFoodFacts';
    case 'supplement':
      return 'FDA';
    case 'medication':
      return 'FDA';
    default:
      return 'Multiple Sources';
  }
};

// Map category to Nutri-Score relevance
export const isNutriScoreRelevant = (category: string): boolean => {
  const categoryCode = getCategoryMapping(category);
  return ['food', 'supplement'].includes(categoryCode);
};

// Get country code mappings for international APIs
export const getCountryCode = (country: string): string | undefined => {
  const countryMappings: Record<string, string> = {
    'nigeria': 'ng',
    'united states': 'us',
    'usa': 'us',
    'canada': 'ca',
    'united kingdom': 'uk',
    'uk': 'uk',
    'france': 'fr',
    'germany': 'de',
    'australia': 'au',
    'spain': 'es',
    'italy': 'it'
  };
  
  const normalized = country.toLowerCase().trim();
  return countryMappings[normalized];
};
