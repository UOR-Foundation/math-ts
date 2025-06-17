/**
 * Large Number Support for Mathematical Universe Database
 *
 * This module extends the mathematical universe to handle arbitrary precision
 * integers using the universe's native patterns for primality detection and
 * factorization.
 */

import { UniverseNativePrimalityDetector } from './universe-native-detector.js';

/**
 * Extended field analysis for large numbers
 */
class LargeNumberFieldAnalysis {
  private detector: UniverseNativePrimalityDetector;

  constructor() {
    this.detector = new UniverseNativePrimalityDetector();
  }

  /**
   * Determine if a number is probably prime
   */
  isProbablePrime(n: bigint): {
    is_probable_prime: boolean;
    confidence: number;
    resonance_evidence: string[];
  } {
    return this.detector.isProbablePrime(n);
  }

  /**
   * Find potential factors (simplified for now)
   */
  findPotentialFactors(_n: bigint): {
    small_factors: bigint[];
    factor_hints: Array<{
      field_pattern: string;
      probable_size: string;
      confidence: number;
    }>;
  } {
    return {
      small_factors: [],
      factor_hints: []
    };
  }
}

/**
 * Field collapse factorization
 */
class FieldCollapseFactorization {
  private analyzer = new LargeNumberFieldAnalysis();

  /**
   * Attempt factorization
   */
  async attemptFactorization(n: bigint): Promise<{
    factors: bigint[];
    method: string;
    confidence: number;
    iterations: number;
  }> {
    // Check if probably prime
    const primalityCheck = this.analyzer.isProbablePrime(n);
    if (primalityCheck.is_probable_prime && primalityCheck.confidence > 0.7) {
      return {
        factors: [n],
        method: 'Prime (no factorization needed)',
        confidence: primalityCheck.confidence,
        iterations: 0
      };
    }

    // Simple trial division for now
    const factors: bigint[] = [];
    let remaining = n;
    let iterations = 0;

    // Try small primes
    const smallPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n];
    
    for (const p of smallPrimes) {
      while (remaining % p === 0n) {
        factors.push(p);
        remaining /= p;
        iterations++;
      }
    }

    // If we've fully factored, we're done
    if (remaining === 1n) {
      return {
        factors: factors.sort((a, b) => Number(a - b)),
        method: 'Small prime factorization',
        confidence: 1.0,
        iterations
      };
    }

    // Try factoring up to sqrt(n) with a reasonable limit
    const limit = this.min(this.isqrt(remaining), 10000n);
    for (let i = 49n; i <= limit; i += 2n) {
      if (remaining % i === 0n) {
        factors.push(i);
        remaining /= i;
        iterations++;
        i -= 2n; // Try same factor again
      }
    }

    // Add any remaining factor
    if (remaining > 1n) {
      factors.push(remaining);
    }

    return {
      factors: factors.sort((a, b) => Number(a - b)),
      method: 'Trial division factorization',
      confidence: 0.9,
      iterations
    };
  }

  /**
   * Integer square root
   */
  private isqrt(n: bigint): bigint {
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
   * Min of two bigints
   */
  private min(a: bigint, b: bigint): bigint {
    return a < b ? a : b;
  }
}

// Export for use by the MCP server
export { LargeNumberFieldAnalysis, FieldCollapseFactorization };