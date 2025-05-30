
import { ExternalProduct, validateProductExternal, ValidationResult } from '../externalApiService';

export interface EnhancedValidationRequest {
  barcode: string;
  productName?: string;
  category?: string;
}

export interface EnhancedValidationResponse {
  isValid: boolean;
  confidence: number;
  sources: Array<{
    name: string;
    status: 'success' | 'error' | 'pending';
    verified: boolean;
    confidence: number;
  }>;
  product?: ExternalProduct;
  recommendations?: string[];
}

export const getEnhancedValidation = async (
  request: EnhancedValidationRequest
): Promise<EnhancedValidationResponse> => {
  try {
    console.log('Getting enhanced validation for:', request);

    // Validate using external services
    const externalResult = await validateProductExternal(request.barcode);

    // Add recommendations based on confidence level
    const recommendations: string[] = [];
    if (externalResult.confidence < 0.7) {
      recommendations.push('Consider additional verification from manufacturer');
      recommendations.push('Check product expiry date and batch number');
    }
    if (!externalResult.verified) {
      recommendations.push('Product may be counterfeit - exercise caution');
    }

    return {
      isValid: externalResult.verified,
      confidence: externalResult.confidence,
      sources: externalResult.sources,
      product: externalResult.product,
      recommendations
    };
  } catch (error) {
    console.error('Enhanced validation error:', error);
    return {
      isValid: false,
      confidence: 0,
      sources: [{
        name: 'System',
        status: 'error',
        verified: false,
        confidence: 0
      }],
      recommendations: ['Unable to validate product - please try again later']
    };
  }
};
