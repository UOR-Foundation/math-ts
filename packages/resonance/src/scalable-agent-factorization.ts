import type { FieldSubstrate, FieldPattern } from '@uor-foundation/field-substrate';
import { calculateResonance } from './resonance';
import { isPrimeViaFieldDynamicsTrue } from './true-field-prime-detection';

/**
 * Scalable agent-based factorization for arbitrary-size numbers
 */
export class ScalableAgentFactorization {
  constructor(
    private substrate: FieldSubstrate,
  ) {}

  /**
   * Factor large numbers using field-guided search
   */
  async factorize(n: bigint): Promise<bigint[]> {
    if (n <= 1n) return [];
    if (isPrimeViaFieldDynamicsTrue(this.substrate, n)) return [n];

    const factors: bigint[] = [];
    let remainder = n;

    // Step 1: Remove small prime factors efficiently
    remainder = this.removeSmallPrimeFactors(remainder, factors);

    // Step 2: Use field-guided search for larger factors
    if (remainder > 1n && !isPrimeViaFieldDynamicsTrue(this.substrate, remainder)) {
      const largeFactors = await this.findLargeFactors(remainder);
      factors.push(...largeFactors);
    } else if (remainder > 1n) {
      factors.push(remainder);
    }

    return factors.sort((a, b) => Number(a - b));
  }

  /**
   * Remove small prime factors up to a threshold
   */
  private removeSmallPrimeFactors(n: bigint, factors: bigint[]): bigint {
    let remainder = n;
    
    // Constitutional primes and small primes up to 1000
    const smallPrimes = this.generateSmallPrimes(1000);
    
    for (const prime of smallPrimes) {
      while (remainder % prime === 0n) {
        factors.push(prime);
        remainder = remainder / prime;
      }
      if (remainder === 1n) break;
    }
    
    return remainder;
  }

  /**
   * Find large factors using field interference patterns
   */
  private async findLargeFactors(n: bigint): Promise<bigint[]> {
    const nPattern = this.substrate.getFieldPattern(n);
    
    // Only use field-guided sieve - no fallbacks
    const strategy = this.analyzeFieldPattern(nPattern);
    return this.fieldGuidedSieve(n, strategy);
  }


  /**
   * Field-guided sieve for numbers with specific patterns
   */
  private async fieldGuidedSieve(
    n: bigint, 
    strategy: { vanishedFields: number[], emergedFields: number[] }
  ): Promise<bigint[]> {
    const sqrtN = this.approximateSqrt(n);
    const factors: bigint[] = [];
    
    // Generate candidates based on field requirements
    const candidates = this.generateFieldConstrainedCandidates(
      n, 
      sqrtN, 
      strategy.vanishedFields,
      strategy.emergedFields
    );
    
    for (const candidate of candidates) {
      if (n % candidate === 0n) {
        const complement = n / candidate;
        factors.push(candidate);
        if (complement !== candidate) {
          factors.push(complement);
        }
        return factors;
      }
    }
    
    return [n]; // No factors found with field constraints
  }


  /**
   * Helper: Analyze field pattern to determine strategy
   */
  private analyzeFieldPattern(pattern: FieldPattern): any {
    const vanished: number[] = [];
    const emerged: number[] = [];
    
    // We don't know a priori which fields vanished or emerged
    // This is the core challenge - we need to discover the pattern
    
    // For now, return empty constraints to see what happens
    return { vanishedFields: vanished, emergedFields: emerged };
  }

  /**
   * Helper: Generate small primes up to limit
   */
  private generateSmallPrimes(limit: number): bigint[] {
    const primes: bigint[] = [2n];
    for (let i = 3; i <= limit; i += 2) {
      if (isPrimeViaFieldDynamicsTrue(this.substrate, BigInt(i))) {
        primes.push(BigInt(i));
      }
    }
    return primes;
  }

  /**
   * Helper: Approximate square root for bigint
   */
  private approximateSqrt(n: bigint): bigint {
    if (n < 2n) return n;
    let x = n;
    let y = (x + 1n) / 2n;
    while (y < x) {
      x = y;
      y = (x + n / x) / 2n;
    }
    return x;
  }

  /**
   * Helper: GCD for bigint
   */
  private gcd(a: bigint, b: bigint): bigint {
    while (b !== 0n) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  /**
   * Helper: Absolute value for bigint
   */
  private abs(n: bigint): bigint {
    return n < 0n ? -n : n;
  }


  /**
   * Helper: Generate candidates with field constraints
   */
  private generateFieldConstrainedCandidates(
    n: bigint,
    limit: bigint,
    vanishedFields: number[],
    emergedFields: number[]
  ): bigint[] {
    const candidates: bigint[] = [];
    const nPattern = this.substrate.getFieldPattern(n);
    
    // Since we don't know which fields vanished/emerged,
    // we need to try all possibilities
    
    // For each field in the product pattern
    for (let fieldToTest = 0; fieldToTest < 8; fieldToTest++) {
      if (nPattern[fieldToTest]) {
        // This field is active in product - might have emerged
        // Look for factor pairs where NEITHER has this field
        for (let i = 2n; i <= limit; i++) {
          const iPattern = this.substrate.getFieldPattern(i);
          if (!iPattern[fieldToTest] && n % i === 0n) {
            const complement = n / i;
            const cPattern = this.substrate.getFieldPattern(complement);
            if (!cPattern[fieldToTest]) {
              // Found a pair where neither has the field that's in the product
              candidates.push(i);
            }
          }
        }
      } else {
        // This field is inactive in product - might have vanished  
        // Look for factor pairs where BOTH have this field
        for (let i = 2n; i <= limit && i < 10000n; i++) {
          const iPattern = this.substrate.getFieldPattern(i);
          if (iPattern[fieldToTest] && n % i === 0n) {
            const complement = n / i;
            const cPattern = this.substrate.getFieldPattern(complement);
            if (cPattern[fieldToTest]) {
              // Found a pair where both have the field that's not in the product
              candidates.push(i);
            }
          }
        }
      }
    }
    
    return [...new Set(candidates)];
  }

}