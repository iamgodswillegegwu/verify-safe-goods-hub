
import { supabase } from '@/integrations/supabase/client';
import { 
  validateProductExternal, 
  ValidationResult, 
  ExternalProduct,
  cacheExternalResult,
  getCachedResult 
} from './externalApiService';

export interface AggregatedValidationResult {
  productName: string;
  overallVerified: boolean;
  confidence: number;
  sources: {
    internal: {
      found: boolean;
      verified: boolean;
      product?: any;
    };
    external: ValidationResult;
  };
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  summary: string;
}

export const performAggregatedValidation = async (
  productName: string,
  barcode?: string,
  category?: string,
  ingredients?: string[]
): Promise<AggregatedValidationResult> => {
  try {
    console.log('Starting aggregated validation for:', productName);

    // Check cache first
    const cacheKey = `aggregated-${productName}-${barcode || ''}-${category || ''}`;
    const cached = await getCachedResult(cacheKey);
    
    // Parallel validation: Internal + External
    const [internalResult, externalResult] = await Promise.all([
      // Internal database search
      supabase
        .from('products')
        .select(`
          *,
          manufacturer:manufacturers(*),
          category:categories(*)
        `)
        .eq('status', 'approved')
        .ilike('name', `%${productName}%`)
        .limit(1)
        .single(),
      
      // External API validation
      validateProductExternal(productName, barcode, category, ingredients)
    ]);

    const internalFound = !internalResult.error && internalResult.data;
    const externalFound = externalResult.found;

    // Risk assessment algorithm
    let riskLevel: 'low' | 'medium' | 'high' = 'medium';
    const recommendations: string[] = [];

    if (internalFound && externalFound && externalResult.verified) {
      riskLevel = 'low';
      recommendations.push('✅ Product verified in both internal and external databases');
    } else if (internalFound || (externalFound && externalResult.verified)) {
      riskLevel = 'low';
      recommendations.push('✅ Product verified in at least one reliable source');
    } else if (externalFound && !externalResult.verified) {
      riskLevel = 'medium';
      recommendations.push('⚠️ Product found but has verification issues');
      recommendations.push('Consider contacting manufacturer for clarification');
    } else {
      riskLevel = 'high';
      recommendations.push('❌ Product not found in any database');
      recommendations.push('Exercise extreme caution - may be counterfeit');
      recommendations.push('Contact manufacturer directly for verification');
    }

    // Add category-specific recommendations
    if (category === 'medication' || category === 'supplement') {
      if (riskLevel !== 'low') {
        recommendations.push('🏥 Consult healthcare provider before use');
      }
    }

    if (category === 'food' && externalResult.product?.nutriScore) {
      const score = externalResult.product.nutriScore;
      if (['D', 'E'].includes(score)) {
        recommendations.push(`📊 Nutri-Score ${score} - Consider healthier alternatives`);
      }
    }

    if (ingredients && ingredients.length > 0) {
      // Check for common allergens
      const commonAllergens = ['milk', 'eggs', 'fish', 'shellfish', 'nuts', 'peanuts', 'wheat', 'soy'];
      const foundAllergens = ingredients.filter(ing => 
        commonAllergens.some(allergen => 
          ing.toLowerCase().includes(allergen.toLowerCase())
        )
      );
      
      if (foundAllergens.length > 0) {
        recommendations.push(`⚠️ Contains potential allergens: ${foundAllergens.join(', ')}`);
      }
    }

    // Calculate overall confidence
    let overallConfidence = 0;
    if (internalFound) overallConfidence += 0.4;
    if (externalFound) overallConfidence += externalResult.confidence * 0.6;
    
    overallConfidence = Math.min(0.95, overallConfidence);

    // Generate summary
    let summary = '';
    if (riskLevel === 'low') {
      summary = 'This product appears to be authentic and safe based on multiple database verifications.';
    } else if (riskLevel === 'medium') {
      summary = 'This product has some verification but requires caution. Additional checks recommended.';
    } else {
      summary = 'This product could not be verified and may pose risks. Extreme caution advised.';
    }

    const result: AggregatedValidationResult = {
      productName,
      overallVerified: riskLevel === 'low',
      confidence: overallConfidence,
      sources: {
        internal: {
          found: !!internalFound,
          verified: !!internalFound,
          product: internalResult.data
        },
        external: externalResult
      },
      recommendations,
      riskLevel,
      summary
    };

    // Cache the aggregated result
    await cacheExternalResult(cacheKey, externalResult);

    console.log('Aggregated validation complete:', result);
    return result;

  } catch (error) {
    console.error('Error in aggregated validation:', error);
    
    return {
      productName,
      overallVerified: false,
      confidence: 0,
      sources: {
        internal: { found: false, verified: false },
        external: { found: false, verified: false, confidence: 0, source: 'error', alternatives: [] }
      },
      recommendations: ['❌ Validation system error - please try again'],
      riskLevel: 'high',
      summary: 'Unable to perform validation due to system error.'
    };
  }
};

// Analytics and monitoring
export const logValidationAttempt = async (
  productName: string,
  result: AggregatedValidationResult,
  userId?: string
) => {
  try {
    // Use rpc call since validation_logs table doesn't exist in types yet
    const { error } = await supabase.rpc('log_validation_attempt', {
      p_user_id: userId,
      p_product_name: productName,
      p_result_summary: result.summary,
      p_risk_level: result.riskLevel,
      p_confidence: result.confidence,
      p_sources_checked: {
        internal: result.sources.internal.found,
        external: result.sources.external.found
      }
    });

    if (error) {
      console.error('Error logging validation attempt:', error);
    }
  } catch (error) {
    console.error('Error logging validation attempt:', error);
  }
};

export const getValidationStats = async (): Promise<{
  totalValidations: number;
  verifiedProducts: number;
  riskDistribution: Record<string, number>;
  topSources: Record<string, number>;
}> => {
  try {
    // Use rpc call since validation_logs table doesn't exist in types yet
    const { data, error } = await supabase.rpc('get_validation_stats');

    if (error || !data) {
      return {
        totalValidations: 0,
        verifiedProducts: 0,
        riskDistribution: {},
        topSources: {}
      };
    }

    return data;
  } catch (error) {
    console.error('Error getting validation stats:', error);
    return {
      totalValidations: 0,
      verifiedProducts: 0,
      riskDistribution: {},
      topSources: {}
    };
  }
};
