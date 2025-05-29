
import { ExternalProduct, ValidationResult } from './externalApiService';

export interface ValidationStats {
  totalValidations: number;
  successRate: number;
  averageConfidence: number;
  sourceBreakdown: Record<string, number>;
  verifiedProducts: number;
  riskDistribution: Record<string, number>;
  topSources: Record<string, number>;
}

export const getValidationStats = async (): Promise<ValidationStats> => {
  // Mock implementation - in real app this would query your database
  return {
    totalValidations: 1247,
    successRate: 0.87,
    averageConfidence: 0.82,
    sourceBreakdown: {
      'openfoodfacts': 45,
      'fda': 30,
      'nafdac': 25
    },
    verifiedProducts: 1087,
    riskDistribution: {
      'low': 60,
      'medium': 30,
      'high': 10
    },
    topSources: {
      'openfoodfacts': 45,
      'fda': 30,
      'nafdac': 25
    }
  };
};

export interface AggregatedResult {
  products: ExternalProduct[];
  stats: ValidationStats;
  totalCount: number;
}

export const aggregateResults = async (
  products: ExternalProduct[]
): Promise<AggregatedResult> => {
  const stats = await getValidationStats();
  
  return {
    products,
    stats,
    totalCount: products.length
  };
};
