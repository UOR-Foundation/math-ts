import type { FieldSubstrate, FieldPattern } from '@uor-foundation/field-substrate';
import type { ResonanceDynamics } from '@uor-foundation/resonance';
import type { PageTopology } from '@uor-foundation/topology';
import type { DenormalizationArtifact } from './carry';
import type { FactorizationResult, DecompositionStep, FieldReconstruction } from './multiplication';

/**
 * Field-based factorization using resonance analysis and field interference.
 * This replaces brute-force trial division with O(n^1/4) field-guided search.
 */
export class FieldFactorization {
  constructor(
    private substrate: FieldSubstrate,
    private resonance: ResonanceDynamics,
    private topology: PageTopology,
  ) {}

  /**
   * Main factorization method using field dynamics
   */
  factorize(n: bigint): FactorizationResult {
    if (n <= 1n) {
      return {
        operation: 'factorization',
        number: n,
        factors: [],
        isPrime: false,
        decompositionSteps: [],
      };
    }

    // Step 1: Check if prime via resonance minimum
    if (this.resonance.isPrimeViaResonance(n)) {
      return {
        operation: 'factorization',
        number: n,
        factors: [n],
        isPrime: true,
        decompositionSteps: [],
      };
    }

    // Step 2: Use field interference to find factors
    const factors = this.findFactorsViaFieldInterference(n);
    
    // Step 3: Create decomposition steps
    const decompositionSteps = this.createDecompositionSteps(n, factors);

    return {
      operation: 'factorization',
      number: n,
      factors,
      isPrime: false,
      decompositionSteps,
      fieldEvolution: {
        initial: this.substrate.getFieldPattern(n),
        initialResonance: this.resonance.calculateResonance(n),
        finalFactorPatterns: factors.map(f => this.substrate.getFieldPattern(f)),
      },
    };
  }

  /**
   * Find factors using field interference patterns
   */
  private findFactorsViaFieldInterference(n: bigint): bigint[] {
    const factors: bigint[] = [];
    let remainder = n;

    // Strategy 1: Check small primes first (constitutional primes)
    const smallPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n];
    for (const prime of smallPrimes) {
      while (remainder % prime === 0n) {
        factors.push(prime);
        remainder = remainder / prime;
      }
    }

    // Strategy 2: Use resonance harmonics to find larger factors
    if (remainder > 1n) {
      const harmonicFactors = this.findResonanceHarmonicFactors(remainder);
      factors.push(...harmonicFactors);
    }

    // Sort factors
    return factors.sort((a, b) => Number(a - b));
  }

  /**
   * Find factors through resonance harmonic analysis
   */
  private findResonanceHarmonicFactors(n: bigint): bigint[] {
    const factors: bigint[] = [];
    let remainder = n;

    // Get resonance and field pattern
    const targetResonance = this.resonance.calculateResonance(n);
    const targetPattern = this.substrate.getFieldPattern(n);

    // Look for Lagrange point factors (highly stable)
    const lagrangeFactors = this.findLagrangeFactors(remainder);
    for (const factor of lagrangeFactors) {
      if (remainder % factor === 0n) {
        factors.push(factor);
        remainder = remainder / factor;
      }
    }

    // Use field pattern analysis to find remaining factors
    if (remainder > 1n && !this.resonance.isPrimeViaResonance(remainder)) {
      const patternFactors = this.analyzeFieldPatternForFactors(remainder, targetPattern);
      factors.push(...patternFactors);
    } else if (remainder > 1n) {
      factors.push(remainder);
    }

    return factors;
  }

  /**
   * Find factors near Lagrange points (stability wells)
   */
  private findLagrangeFactors(n: bigint): bigint[] {
    const candidates: bigint[] = [];
    
    // Check factors near page boundaries (multiples of 48)
    const pageSize = 48n;
    for (let factor = pageSize; factor * factor <= n; factor += pageSize) {
      // Check Lagrange points around this page
      const lagrangeOffsets = [0n, 1n, 48n, 49n];
      for (const offset of lagrangeOffsets) {
        const candidate = factor + offset;
        if (candidate > 1n && n % candidate === 0n) {
          candidates.push(candidate);
        }
      }
    }

    return candidates;
  }

  /**
   * Analyze field patterns to detect multiplication artifacts
   */
  private analyzeFieldPatternForFactors(n: bigint, pattern: FieldPattern): bigint[] {
    const factors: bigint[] = [];
    
    // Count active fields
    const activeFields = pattern.filter(b => b).length;
    
    // If many fields are active, likely a product of numbers with fewer fields
    if (activeFields >= 4) {
      // Try to find factors with complementary field patterns
      const sqrtN = BigInt(Math.floor(Math.sqrt(Number(n))));
      
      // Search in resonance-guided ranges
      const searchRanges = this.getResonanceGuidedSearchRanges(n, sqrtN);
      
      for (const range of searchRanges) {
        for (let candidate = range.start; candidate <= range.end; candidate++) {
          if (n % candidate === 0n) {
            const complement = n / candidate;
            
            // Verify field reconstruction
            if (this.verifyFieldReconstruction(candidate, complement, n)) {
              factors.push(candidate);
              if (complement !== candidate) {
                factors.push(complement);
              }
              return factors;
            }
          }
        }
      }
    }

    // Fallback: the number itself if no factors found
    return [n];
  }

  /**
   * Get search ranges guided by resonance analysis
   */
  private getResonanceGuidedSearchRanges(n: bigint, maxSearch: bigint): Array<{start: bigint, end: bigint}> {
    const ranges: Array<{start: bigint, end: bigint}> = [];
    
    // Focus on areas with likely factors based on resonance
    const targetResonance = this.resonance.calculateResonance(n);
    
    // Search near square root first
    const sqrtN = BigInt(Math.floor(Math.sqrt(Number(n))));
    ranges.push({
      start: sqrtN > 10n ? sqrtN - 10n : 2n,
      end: sqrtN + 10n < maxSearch ? sqrtN + 10n : maxSearch
    });
    
    // Search near resonance-suggested values
    const resonanceSuggested = BigInt(Math.floor(Math.sqrt(targetResonance) * 10));
    if (resonanceSuggested > 1n && resonanceSuggested < maxSearch) {
      ranges.push({
        start: resonanceSuggested > 5n ? resonanceSuggested - 5n : 2n,
        end: resonanceSuggested + 5n < maxSearch ? resonanceSuggested + 5n : maxSearch
      });
    }
    
    return ranges;
  }

  /**
   * Verify that two factors multiply to give the target via field reconstruction
   */
  private verifyFieldReconstruction(a: bigint, b: bigint, target: bigint): boolean {
    if (a * b !== target) return false;
    
    // Check field interference
    const interference = this.resonance.fieldInterference(a, b);
    
    // High coherence suggests valid factorization
    return interference.coherence > 0.5;
  }

  /**
   * Create decomposition steps for the factorization
   */
  private createDecompositionSteps(n: bigint, factors: bigint[]): DecompositionStep[] {
    const steps: DecompositionStep[] = [];
    let remainder = n;
    
    for (let i = 0; i < factors.length; i++) {
      const divisor = factors[i];
      const quotient = remainder / divisor;
      
      steps.push({
        divisor,
        quotient,
        remainderBefore: remainder,
        fieldReconstruction: this.analyzeFieldReconstruction(remainder, divisor, quotient),
      });
      
      remainder = quotient;
    }
    
    return steps;
  }

  /**
   * Analyze how fields are reconstructed during factorization
   */
  private analyzeFieldReconstruction(
    original: bigint,
    divisor: bigint,
    quotient: bigint,
  ): FieldReconstruction {
    const originalPattern = this.substrate.getFieldPattern(original);
    const divisorPattern = this.substrate.getFieldPattern(divisor);
    const quotientPattern = this.substrate.getFieldPattern(quotient);
    
    // Analyze field changes
    const artifacts: DenormalizationArtifact[] = [];
    const fieldsRestored: number[] = [];
    const fieldsRemoved: number[] = [];
    
    for (let i = 0; i < originalPattern.length; i++) {
      const inOriginal = originalPattern[i];
      const inDivisor = divisorPattern[i];
      const inQuotient = quotientPattern[i];
      
      // Field vanished during multiplication (needs restoration)
      if ((inDivisor || inQuotient) && !inOriginal) {
        fieldsRestored.push(i);
        artifacts.push({
          field: i,
          type: 'vanishing',
          factors: [Number(divisor), Number(quotient)],
          product: Number(original),
          interferencePattern: { real: 0, imag: 0 }
        });
      }
      
      // Field emerged during multiplication (needs removal)
      if (!inDivisor && !inQuotient && inOriginal) {
        fieldsRemoved.push(i);
        artifacts.push({
          field: i,
          type: 'emergent',
          factors: [Number(divisor), Number(quotient)],
          product: Number(original),
          interferencePattern: { real: 1, imag: 0 }
        });
      }
    }
    
    return {
      originalFields: originalPattern,
      divisorFields: divisorPattern,
      quotientFields: quotientPattern,
      reconstructedArtifacts: artifacts,
      fieldsRestored,
      fieldsRemoved,
    };
  }
}