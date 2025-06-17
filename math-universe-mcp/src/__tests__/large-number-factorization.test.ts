/**
 * Large Number Factorization Tests
 *
 * This test suite specifically validates the factorization of large numbers
 * to ensure accuracy and identify issues with the field collapse algorithm.
 */

import { FieldCollapseFactorization } from '../math-universe-large';

describe('Large Number Factorization Validation', () => {
  let factorizer: FieldCollapseFactorization;

  beforeEach(() => {
    factorizer = new FieldCollapseFactorization();
  });

  describe('Powers of 10 Factorization', () => {
    test('should correctly factor 10^n for small n', () => {
      const testCases = [
        { n: 10n, expected: [2n, 5n] },
        { n: 100n, expected: [2n, 2n, 5n, 5n] },
        { n: 1000n, expected: [2n, 2n, 2n, 5n, 5n, 5n] },
        { n: 10000n, expected: [2n, 2n, 2n, 2n, 5n, 5n, 5n, 5n] },
        { n: 100000n, expected: [2n, 2n, 2n, 2n, 2n, 5n, 5n, 5n, 5n, 5n] }
      ];

      for (const { n, expected } of testCases) {
        const result = factorizer.attemptFactorization(n);
        const sortedFactors = result.factors.sort((a, b) => Number(a - b));
        const sortedExpected = expected.sort((a, b) => Number(a - b));

        expect(sortedFactors).toEqual(sortedExpected);
        expect(result.method).not.toContain('Prime');
      }
    });

    test('should correctly factor 10^30', () => {
      const n = 1000000000000000000000000000000n; // 10^30
      const result = factorizer.attemptFactorization(n);

      // 10^30 = 2^30 × 5^30
      // Count factors of 2 and 5
      let twos = 0;
      let fives = 0;
      let others = 0;

      for (const factor of result.factors) {
        if (factor === 2n) {
          twos++;
        } else if (factor === 5n) {
          fives++;
        } else {
          others++;
        }
      }

      // Should have 30 factors of 2 and 30 factors of 5
      expect(twos).toBe(30);
      expect(fives).toBe(30);
      expect(others).toBe(0);
      expect(result.method).not.toContain('Prime');
    });

    test('should handle 10^n for various large n', () => {
      const testCases = [
        { exponent: 10, factorCount: 20 }, // 10 twos, 10 fives
        { exponent: 15, factorCount: 30 }, // 15 twos, 15 fives
        { exponent: 20, factorCount: 40 } // 20 twos, 20 fives
      ];

      for (const { exponent, factorCount } of testCases) {
        const n = 10n ** BigInt(exponent);
        const result = factorizer.attemptFactorization(n);

        expect(result.factors.length).toBe(factorCount);
        expect(result.method).not.toContain('Prime');
      }
    });
  });

  describe('Known Composite Factorization', () => {
    test('should factor RSA-style semiprimes', () => {
      const semiprimes = [
        { n: 15n, expected: [3n, 5n] },
        { n: 21n, expected: [3n, 7n] },
        { n: 35n, expected: [5n, 7n] },
        { n: 77n, expected: [7n, 11n] },
        { n: 143n, expected: [11n, 13n] },
        { n: 221n, expected: [13n, 17n] }
      ];

      for (const { n, expected } of semiprimes) {
        const result = factorizer.attemptFactorization(n);
        expect(result.factors.sort((a, b) => Number(a - b))).toEqual(expected);
      }
    });

    test('should factor numbers with repeated prime factors', () => {
      const testCases = [
        { n: 4n, expected: [2n, 2n] },
        { n: 8n, expected: [2n, 2n, 2n] },
        { n: 9n, expected: [3n, 3n] },
        { n: 16n, expected: [2n, 2n, 2n, 2n] },
        { n: 25n, expected: [5n, 5n] },
        { n: 27n, expected: [3n, 3n, 3n] }
      ];

      for (const { n, expected } of testCases) {
        const result = factorizer.attemptFactorization(n);
        expect(result.factors.sort((a, b) => Number(a - b))).toEqual(expected);
      }
    });
  });

  describe('Prime Number Handling', () => {
    test('should correctly identify small primes', () => {
      const primes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n];

      for (const prime of primes) {
        const result = factorizer.attemptFactorization(prime);
        expect(result.factors).toEqual([prime]);
        expect(result.method).toContain('Prime');
        expect(result.confidence).toBeGreaterThan(0.7);
      }
    });

    test('should identify known large primes', () => {
      const largePrimes = [
        104729n, // 10,000th prime
        1299709n, // 100,000th prime
        15485863n // 1,000,000th prime
      ];

      for (const prime of largePrimes) {
        const result = factorizer.attemptFactorization(prime);
        expect(result.factors).toEqual([prime]);
        expect(result.method).toContain('Prime');
      }
    });
  });

  describe('Field Collapse Algorithm Validation', () => {
    test('should extract small factors before field collapse', () => {
      const testCases = [
        { n: 30n, smallFactors: [2n, 3n, 5n] },
        { n: 60n, smallFactors: [2n, 2n, 3n, 5n] },
        { n: 120n, smallFactors: [2n, 2n, 2n, 3n, 5n] }
      ];

      for (const { n, smallFactors } of testCases) {
        const result = factorizer.attemptFactorization(n);

        // Check that all small factors are found
        for (const factor of smallFactors) {
          expect(result.factors).toContain(factor);
        }
      }
    });

    test('should handle timeout gracefully for difficult numbers', () => {
      // Create a large semiprime that's hard to factor
      const largePrime1 = 1000000007n;
      const largePrime2 = 1000000009n;
      const hardNumber = largePrime1 * largePrime2;

      const result = factorizer.attemptFactorization(hardNumber);

      // Should either factor correctly or timeout
      if (result.method.includes('timeout')) {
        expect(result.confidence).toBeLessThanOrEqual(0.5);
        expect(result.iterations).toBeGreaterThan(0);
      } else {
        expect(result.factors.sort((a, b) => Number(a - b))).toEqual([largePrime1, largePrime2]);
      }
    });
  });

  describe('Specific Bug Fixes', () => {
    test('should not misidentify 10^30 as prime', () => {
      const n = 1000000000000000000000000000000n;
      const result = factorizer.attemptFactorization(n);

      expect(result.method).not.toContain('Prime');
      expect(result.factors.length).toBeGreaterThan(1);

      // Verify it's fully factored
      let product = 1n;
      for (const factor of result.factors) {
        product *= factor;
      }
      expect(product).toBe(n);
    });

    test('should correctly factor numbers ending in many zeros', () => {
      const testCases = [1000n, 1000000n, 1000000000n, 1000000000000n];

      for (const n of testCases) {
        const result = factorizer.attemptFactorization(n);

        // Should not be identified as prime
        expect(result.method).not.toContain('Prime');

        // Should have both 2s and 5s as factors
        expect(result.factors.some(f => f === 2n)).toBe(true);
        expect(result.factors.some(f => f === 5n)).toBe(true);
      }
    });
  });

  describe('Factorization Accuracy Metrics', () => {
    test('should maintain high accuracy for known composites', () => {
      const testSet = [
        { n: 6n, factors: [2n, 3n] },
        { n: 12n, factors: [2n, 2n, 3n] },
        { n: 30n, factors: [2n, 3n, 5n] },
        { n: 210n, factors: [2n, 3n, 5n, 7n] },
        { n: 2310n, factors: [2n, 3n, 5n, 7n, 11n] }
      ];

      let correct = 0;
      const total = testSet.length;

      for (const { n, factors } of testSet) {
        const result = factorizer.attemptFactorization(n);
        const sortedResult = result.factors.sort((a, b) => Number(a - b));
        const sortedExpected = factors.sort((a, b) => Number(a - b));

        if (JSON.stringify(sortedResult) === JSON.stringify(sortedExpected)) {
          correct++;
        }
      }

      const accuracy = correct / total;
      expect(accuracy).toBeGreaterThanOrEqual(0.8); // At least 80% accuracy
    });
  });
});
