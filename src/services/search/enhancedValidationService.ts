
import { ExternalProduct, validateProductExternal, ValidationResult } from '../externalApiService';

export interface EnhancedValidation {
  overallRisk: 'low' | 'medium' | 'high';
  riskFactors: string[];
  recommendations: string[];
  sources: ValidationResult[];
  confidence: number;
}

export const getEnhancedValidation = async (
  productName: string,
  barcode?: string
): Promise<EnhancedValidation> => {
  try {
    console.log('Starting enhanced validation for:', productName);

    // Get validation from multiple external sources
    const validation = await validateProductExternal(productName, barcode);
    
    // Analyze risk factors based on validation results
    const riskFactors: string[] = [];
    const recommendations: string[] = [];
    
    if (!validation.found) {
      riskFactors.push('Product not found in external databases');
      recommendations.push('Verify product details with manufacturer directly');
    }
    
    if (validation.verified === false) {
      riskFactors.push('Product verification failed in external sources');
      recommendations.push('Exercise caution and seek alternative verified products');
    }
    
    if (validation.confidence < 0.7) {
      riskFactors.push('Low confidence in product data');
      recommendations.push('Cross-check product information from multiple sources');
    }

    // Determine overall risk level
    let overallRisk: 'low' | 'medium' | 'high' = 'low';
    
    if (riskFactors.length === 0 && validation.verified) {
      overallRisk = 'low';
    } else if (riskFactors.length <= 2 && validation.found) {
      overallRisk = 'medium';
    } else {
      overallRisk = 'high';
    }

    // Add general recommendations
    if (overallRisk === 'low') {
      recommendations.push('Product appears safe based on available data');
    }
    
    recommendations.push('Always check expiration dates and storage instructions');
    recommendations.push('Report any adverse reactions to relevant authorities');

    return {
      overallRisk,
      riskFactors,
      recommendations,
      sources: [validation],
      confidence: validation.confidence
    };

  } catch (error) {
    console.error('Enhanced validation error:', error);
    
    return {
      overallRisk: 'high',
      riskFactors: ['Unable to validate product due to system error'],
      recommendations: ['Manual verification recommended', 'Contact manufacturer directly'],
      sources: [],
      confidence: 0
    };
  }
};
