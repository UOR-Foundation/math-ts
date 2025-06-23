import { createFieldSubstrate } from '@uor-foundation/field-substrate';
import { MultiModalFactorization } from '../src/multimodal-factorization';
import { isPrimeViaFieldDynamicsTrue } from '../src/true-field-prime-detection';

describe('Scalable Factorization Tests', () => {
  const substrate = createFieldSubstrate();
  const factorizer = new MultiModalFactorization(substrate);

  beforeEach(() => {
    // Clear cache before each test
    factorizer.clearCache();
  });

  describe('Small Scale (< 1000)', () => {
    test('should factor small composites', async () => {
      const testCases = [
        { n: 6n, expected: [2n, 3n] },
        { n: 15n, expected: [3n, 5n] },
        { n: 77n, expected: [7n, 11n] },
        { n: 143n, expected: [11n, 13n] },
        { n: 221n, expected: [13n, 17n] },
        { n: 323n, expected: [17n, 19n] },
        { n: 437n, expected: [19n, 23n] },
        { n: 667n, expected: [23n, 29n] },
        { n: 899n, expected: [29n, 31n] },
      ];

      for (const { n, expected } of testCases) {
        const result = await factorizer.factorize(n);
        expect(result).toEqual(expected);
      }
    });

    test('should identify small primes', async () => {
      const primes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n, 73n, 79n, 83n, 89n, 97n];
      
      for (const p of primes) {
        const result = await factorizer.factorize(p);
        expect(result).toEqual([p]);
      }
    });

    test('should factor numbers with multiple prime factors', async () => {
      const testCases = [
        { n: 30n, expected: [2n, 3n, 5n] },
        { n: 210n, expected: [2n, 3n, 5n, 7n] },
        { n: 420n, expected: [2n, 2n, 3n, 5n, 7n] },
        { n: 1001n, expected: [7n, 11n, 13n] },
      ];

      for (const { n, expected } of testCases) {
        const result = await factorizer.factorize(n);
        expect(result).toEqual(expected);
      }
    });
  });

  describe('Medium Scale (1000 - 1,000,000)', () => {
    test('should factor medium composites', async () => {
      const testCases = [
        { n: 1003n, expected: [17n, 59n] },
        { n: 10001n, expected: [73n, 137n] },
        { n: 10403n, expected: [101n, 103n] },
        { n: 100001n, expected: [11n, 9091n] },
        { n: 123456n, expected: [2n, 2n, 2n, 2n, 2n, 2n, 3n, 643n] },
        { n: 999983n, expected: [999983n] }, // Prime
      ];

      for (const { n, expected } of testCases) {
        const result = await factorizer.factorize(n);
        expect(result).toEqual(expected);
      }
    });

    test('should handle perfect squares', async () => {
      const testCases = [
        { n: 121n, expected: [11n, 11n] },
        { n: 169n, expected: [13n, 13n] },
        { n: 289n, expected: [17n, 17n] },
        { n: 361n, expected: [19n, 19n] },
        { n: 10201n, expected: [101n, 101n] },
      ];

      for (const { n, expected } of testCases) {
        const result = await factorizer.factorize(n);
        expect(result).toEqual(expected);
      }
    });

    test('should handle powers of primes', async () => {
      const testCases = [
        { n: 128n, expected: [2n, 2n, 2n, 2n, 2n, 2n, 2n] }, // 2^7
        { n: 243n, expected: [3n, 3n, 3n, 3n, 3n] }, // 3^5
        { n: 625n, expected: [5n, 5n, 5n, 5n] }, // 5^4
        { n: 343n, expected: [7n, 7n, 7n] }, // 7^3
      ];

      for (const { n, expected } of testCases) {
        const result = await factorizer.factorize(n);
        expect(result).toEqual(expected);
      }
    });
  });

  describe('Large Scale (> 1,000,000)', () => {
    test('should factor large semiprimes', async () => {
      const testCases = [
        { n: 1000003n, expected: [1000003n] }, // Prime
        { n: 1000037n, expected: [1000037n] }, // Prime
        { n: 1299709n, expected: [1299709n] }, // 100,000th prime
        { n: 15485863n, expected: [15485863n] }, // 1,000,000th prime
      ];

      for (const { n, expected } of testCases) {
        const result = await factorizer.factorize(n);
        expect(result).toEqual(expected);
      }
    });

    test('should factor RSA-like numbers (small examples)', async () => {
      // These are products of two primes, similar to RSA keys but much smaller
      const testCases = [
        { n: 2047n, expected: [23n, 89n] },
        { n: 3233n, expected: [53n, 61n] },
        { n: 9991n, expected: [97n, 103n] },
        { n: 10001n, expected: [73n, 137n] },
        { n: 10403n, expected: [101n, 103n] },
      ];

      for (const { n, expected } of testCases) {
        const result = await factorizer.factorize(n);
        expect(result).toEqual(expected);
      }
    });

    test('should handle large numbers with small factors', async () => {
      const testCases = [
        { n: 1000002n, expected: [2n, 3n, 166667n] },
        { n: 1000005n, expected: [3n, 5n, 163n, 409n] },
        { n: 1000007n, expected: [29n, 34483n] },
        { n: 12345678n, expected: [2n, 3n, 3n, 47n, 14593n] },
      ];

      for (const { n, expected } of testCases) {
        const result = await factorizer.factorize(n);
        expect(result).toEqual(expected);
      }
    });
  });

  describe('Very Large Scale (> 10^10)', () => {
    test('should identify large primes efficiently', async () => {
      const largePrimes = [
        10000000019n,
        100000000003n,
        1000000000039n,
        10000000000037n,
      ];

      for (const p of largePrimes) {
        const start = Date.now();
        const result = await factorizer.factorize(p);
        const elapsed = Date.now() - start;
        
        expect(result).toEqual([p]);
        expect(elapsed).toBeLessThan(100); // Should be fast for prime checking
      }
    });

    test('should factor numbers with known small factors', async () => {
      const testCases = [
        { n: 10000000020n, expected: [2n, 2n, 3n, 5n, 43n, 983n, 3943n] },
        { n: 10000000050n, expected: [2n, 3n, 5n, 5n, 66666667n] },
        { n: 12345678901n, expected: [857n, 14405693n] },
      ];

      for (const { n, expected } of testCases) {
        const result = await factorizer.factorize(n);
        expect(result).toEqual(expected);
      }
    });
  });

  describe('Special Cases', () => {
    test('should handle edge cases', async () => {
      expect(await factorizer.factorize(0n)).toEqual([]);
      expect(await factorizer.factorize(1n)).toEqual([]);
      expect(await factorizer.factorize(2n)).toEqual([2n]);
    });

    test('should handle negative inputs gracefully', async () => {
      expect(await factorizer.factorize(-1n)).toEqual([]);
      expect(await factorizer.factorize(-10n)).toEqual([]);
    });
  });

  describe('Performance Benchmarks', () => {
    test('should factor within reasonable time limits', async () => {
      const benchmarks = [
        { n: 77n, maxTime: 10 },
        { n: 10001n, maxTime: 50 },
        { n: 1000007n, maxTime: 100 },
        { n: 100000007n, maxTime: 100 }, // Prime, should be fast
        { n: 12345678901n, maxTime: 500 },
      ];

      for (const { n, maxTime } of benchmarks) {
        const start = Date.now();
        await factorizer.factorize(n);
        const elapsed = Date.now() - start;
        
        expect(elapsed).toBeLessThan(maxTime);
      }
    });
  });

  describe('Field Pattern Analysis', () => {
    test('should leverage field patterns for factorization hints', async () => {
      // Test that field patterns provide useful hints
      const n = 77n; // 7 × 11
      const pattern77 = substrate.getFieldPattern(77n);
      const pattern7 = substrate.getFieldPattern(7n);
      const pattern11 = substrate.getFieldPattern(11n);
      
      // Field 1 (Tribonacci) vanishes in 77 but is present in both 7 and 11
      expect(pattern7[1] && pattern11[1]).toBe(true);
      expect(pattern77[1]).toBe(false); // Vanished!
      
      const result = await factorizer.factorize(n, true); // Enable debug
      expect(result).toEqual([7n, 11n]);
    });
  });

  describe('Caching Efficiency', () => {
    test('should demonstrate cache effectiveness', async () => {
      const numbers = [77n, 143n, 1001n, 10001n, 100003n];
      
      // First pass - populate cache
      const start1 = Date.now();
      for (const n of numbers) {
        await factorizer.factorize(n);
      }
      const time1 = Date.now() - start1;
      
      // Second pass - should be faster due to cache
      const start2 = Date.now();
      for (const n of numbers) {
        await factorizer.factorize(n);
      }
      const time2 = Date.now() - start2;
      
      expect(time2).toBeLessThan(time1 * 0.5); // At least 2x faster
    });
  });
});