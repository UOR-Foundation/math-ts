/**
 * Mathematical Universe Tuning Configuration
 * 
 * This configuration file contains adjustable parameters that can be tuned
 * based on diagnostic results to improve the implementation's accuracy.
 */

export interface TuningConfig {
  primality: {
    // Confidence thresholds
    minConfidenceForPrime: number;
    maxConfidenceForComposite: number;
    
    // Field pattern weights
    tribonacciDecoherenceWeight: number;
    goldenHarmonyWeight: number;
    perfectResonanceWeight: number;
    pagePositionWeight: number;
    
    // Small prime checks
    checkDivisibilityUpTo: number;
    knownPrimesLimit: number;
    
    // Large number handling
    useMillerRabin: boolean;
    millerRabinIterations: number;
  };
  
  factorization: {
    // Small factor extraction
    smallFactorLimit: number;
    trialDivisionLimit: number;
    
    // Field collapse parameters
    maxIterations: number;
    timeoutMs: number;
    confidenceThreshold: number;
    
    // Search strategies
    useFieldCollapse: boolean;
    useResonanceFactorization: boolean;
    usePageRelativeFactorization: boolean;
    
    // Search windows
    factorSearchRadius: bigint;
    harmonicSearchDepth: number;
  };
  
  fieldAnalysis: {
    // Harmonic analysis
    maxHarmonicBits: number;
    harmonicScaleFactor: number;
    
    // Resonance calculation
    resonancePrecision: number;
    useExactArithmetic: boolean;
    
    // Pattern matching
    patternMatchTolerance: number;
    resonanceMatchTolerance: number;
  };
  
  performance: {
    // Caching
    maxCacheSize: number;
    cacheTimeout: number;
    
    // Search limits
    maxSearchIterations: number;
    maxPageSearch: bigint;
    
    // Parallel processing
    enableParallel: boolean;
    workerThreads: number;
  };
}

// Default configuration
export const DEFAULT_CONFIG: TuningConfig = {
  primality: {
    minConfidenceForPrime: 0.7,
    maxConfidenceForComposite: 0.5,
    
    tribonacciDecoherenceWeight: 0.3,
    goldenHarmonyWeight: 1.3,
    perfectResonanceWeight: 0.5,
    pagePositionWeight: 0.8,
    
    checkDivisibilityUpTo: 1000,
    knownPrimesLimit: 10000,
    
    useMillerRabin: false,
    millerRabinIterations: 20
  },
  
  factorization: {
    smallFactorLimit: 10000,
    trialDivisionLimit: 1000,
    
    maxIterations: 100,
    timeoutMs: 5000,
    confidenceThreshold: 0.7,
    
    useFieldCollapse: true,
    useResonanceFactorization: true,
    usePageRelativeFactorization: true,
    
    factorSearchRadius: 10000n,
    harmonicSearchDepth: 32
  },
  
  fieldAnalysis: {
    maxHarmonicBits: 256,
    harmonicScaleFactor: 2,
    
    resonancePrecision: 15,
    useExactArithmetic: false,
    
    patternMatchTolerance: 0.01,
    resonanceMatchTolerance: 0.01
  },
  
  performance: {
    maxCacheSize: 10000,
    cacheTimeout: 3600000, // 1 hour
    
    maxSearchIterations: 10000,
    maxPageSearch: 10000n,
    
    enableParallel: false,
    workerThreads: 4
  }
};

// Optimized configurations for specific use cases
export const OPTIMIZED_CONFIGS = {
  // Configuration optimized for accuracy
  highAccuracy: {
    ...DEFAULT_CONFIG,
    primality: {
      ...DEFAULT_CONFIG.primality,
      minConfidenceForPrime: 0.9,
      maxConfidenceForComposite: 0.3,
      checkDivisibilityUpTo: 10000,
      useMillerRabin: true,
      millerRabinIterations: 40
    },
    factorization: {
      ...DEFAULT_CONFIG.factorization,
      smallFactorLimit: 100000,
      trialDivisionLimit: 10000,
      maxIterations: 1000,
      timeoutMs: 30000
    }
  },
  
  // Configuration optimized for speed
  highSpeed: {
    ...DEFAULT_CONFIG,
    primality: {
      ...DEFAULT_CONFIG.primality,
      minConfidenceForPrime: 0.6,
      checkDivisibilityUpTo: 100,
      useMillerRabin: false
    },
    factorization: {
      ...DEFAULT_CONFIG.factorization,
      smallFactorLimit: 1000,
      maxIterations: 10,
      timeoutMs: 1000,
      usePageRelativeFactorization: false
    }
  },
  
  // Configuration for large numbers
  largeNumbers: {
    ...DEFAULT_CONFIG,
    primality: {
      ...DEFAULT_CONFIG.primality,
      useMillerRabin: true,
      millerRabinIterations: 30
    },
    factorization: {
      ...DEFAULT_CONFIG.factorization,
      useFieldCollapse: true,
      useResonanceFactorization: true,
      factorSearchRadius: 1000000n,
      harmonicSearchDepth: 64
    },
    fieldAnalysis: {
      ...DEFAULT_CONFIG.fieldAnalysis,
      maxHarmonicBits: 512,
      useExactArithmetic: true
    }
  }
};

// Tuning recommendations based on diagnostic results
export interface TuningRecommendation {
  parameter: string;
  currentValue: any;
  recommendedValue: any;
  reason: string;
  impact: 'high' | 'medium' | 'low';
}

export class TuningAdvisor {
  /**
   * Generate tuning recommendations based on diagnostic results
   */
  static generateRecommendations(diagnosticResults: any[]): TuningRecommendation[] {
    const recommendations: TuningRecommendation[] = [];
    
    // Analyze primality detection failures
    const primalityFailures = diagnosticResults.filter(r => 
      r.category === 'Primality Detection' && !r.passed
    );
    
    if (primalityFailures.length > 0) {
      // Check for powers of 10 being identified as prime
      const powersOf10Failures = primalityFailures.filter(r => 
        r.input.match(/^10+$/)
      );
      
      if (powersOf10Failures.length > 0) {
        recommendations.push({
          parameter: 'primality.checkDivisibilityUpTo',
          currentValue: DEFAULT_CONFIG.primality.checkDivisibilityUpTo,
          recommendedValue: 10,
          reason: 'Powers of 10 are being misidentified as prime. Basic divisibility check by 2 and 5 would fix this.',
          impact: 'high'
        });
      }
      
      // Check confidence thresholds
      const highConfidenceComposites = primalityFailures.filter(r => 
        r.confidence && r.confidence > 0.7
      );
      
      if (highConfidenceComposites.length > 0) {
        recommendations.push({
          parameter: 'primality.minConfidenceForPrime',
          currentValue: DEFAULT_CONFIG.primality.minConfidenceForPrime,
          recommendedValue: 0.9,
          reason: 'Composites are being identified as prime with high confidence. Increase threshold.',
          impact: 'high'
        });
      }
    }
    
    // Analyze factorization failures
    const factorizationFailures = diagnosticResults.filter(r => 
      r.category === 'Factorization' && !r.passed
    );
    
    if (factorizationFailures.length > 0) {
      // Check for unfactored composites
      const unfactored = factorizationFailures.filter(r => 
        r.details && r.details.method === 'Prime (no factorization needed)'
      );
      
      if (unfactored.length > 0) {
        recommendations.push({
          parameter: 'factorization.trialDivisionLimit',
          currentValue: DEFAULT_CONFIG.factorization.trialDivisionLimit,
          recommendedValue: 10000,
          reason: 'Composites are not being factored. Increase trial division limit.',
          impact: 'high'
        });
        
        recommendations.push({
          parameter: 'primality.useMillerRabin',
          currentValue: DEFAULT_CONFIG.primality.useMillerRabin,
          recommendedValue: true,
          reason: 'Enable Miller-Rabin test for better primality detection.',
          impact: 'medium'
        });
      }
    }
    
    // Analyze performance issues
    const performanceIssues = diagnosticResults.filter(r => 
      r.category === 'Performance' && !r.passed
    );
    
    if (performanceIssues.length > 0) {
      recommendations.push({
        parameter: 'performance.maxCacheSize',
        currentValue: DEFAULT_CONFIG.performance.maxCacheSize,
        recommendedValue: 50000,
        reason: 'Increase cache size to improve performance for repeated calculations.',
        impact: 'medium'
      });
    }
    
    return recommendations;
  }
  
  /**
   * Apply recommendations to create a new configuration
   */
  static applyRecommendations(
    baseConfig: TuningConfig, 
    recommendations: TuningRecommendation[]
  ): TuningConfig {
    // Deep clone with BigInt support
    const newConfig = JSON.parse(JSON.stringify(baseConfig, (key, value) => {
      if (typeof value === 'bigint') {
        return value.toString() + 'n';
      }
      return value;
    }), (key, value) => {
      if (typeof value === 'string' && value.endsWith('n') && /^\d+n$/.test(value)) {
        return BigInt(value.slice(0, -1));
      }
      return value;
    });
    
    for (const rec of recommendations) {
      const parts = rec.parameter.split('.');
      let obj: any = newConfig;
      
      for (let i = 0; i < parts.length - 1; i++) {
        obj = obj[parts[i]];
      }
      
      obj[parts[parts.length - 1]] = rec.recommendedValue;
    }
    
    return newConfig;
  }
}